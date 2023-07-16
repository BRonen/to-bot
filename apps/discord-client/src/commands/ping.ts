import { SlashCommandBuilder, CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),

  async execute(interaction: CommandInteraction) {
    console.log(interaction);

    await interaction.reply("Pong!");
  },
};
