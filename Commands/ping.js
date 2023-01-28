const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const NAME = "ping";
const DESCRIPTION = "Replies with the bot's latency";

module.exports = {
  data: new SlashCommandBuilder().setName(NAME).setDescription(DESCRIPTION),
  async execute(interaction) {
    let ping = Date.now();
    await interaction.reply("Loading...");
    ping = Date.now() - ping;
    await interaction.editReply(`The bot latency is ${ping}ms.`);
  },
};
