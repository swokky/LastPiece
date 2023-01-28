// Requirement
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { deploy } = require("./deploy.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Register the ClientReady event
client.once(Events.ClientReady, (c) => {
  deploy(process.env.TOKEN, process.env.CLIENT_ID, process.env.GUILD_ID);
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Register the Command event
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;
  client.commands.get(interaction.commandName).execute(interaction);
});

// Create the command handler
const commandsPath = path.join(__dirname, "commands");
const commandsFile = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandsFile) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

//Login to Discord with your client's token
client.login(process.env.TOKEN);
