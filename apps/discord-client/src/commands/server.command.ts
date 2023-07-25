import { SlashCommandBuilder } from "discord.js";
import { CommandHandler } from "./Command";

const handler: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server."),

  execute: async (interaction) => {
    await interaction.reply(
      `This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`
    );
  },
};

export default handler;
