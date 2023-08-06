import { SlashCommandBuilder } from "discord.js";
import { CommandHandler } from "./Command";
import newToReadKeywordModal from "../modals/new-to-read-keyword.modal";

const handler: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName("create-to-read-keyword")
    .setDescription("Create a new To Read Keyword."),

  execute: async (interaction) => {
    const modal = newToReadKeywordModal.build();

    await interaction.showModal(modal);
  },
};

export default handler;
