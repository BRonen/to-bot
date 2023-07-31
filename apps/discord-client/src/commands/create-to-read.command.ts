import { SlashCommandBuilder } from "discord.js";
import { CommandHandler } from "./Command";
import newToReadModal from "../modals/newToRead.modal";

const handler: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName("create-to-read")
    .setDescription("Create a new To Read."),

  execute: async (interaction) => {
    const modal = newToReadModal.build();

    await interaction.showModal(modal);
  },
};

export default handler;
