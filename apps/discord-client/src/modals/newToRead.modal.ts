import {
  ActionRowBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { ModalHandler } from "./Modal";

const toReadModal: ModalHandler = {
  name: "create-to-read-modal",
  build: () => {
    const modal = new ModalBuilder()
      .setCustomId("create-to-read-modal")
      .setTitle("New To-Read");

    const nameInput = new TextInputBuilder()
      .setCustomId("nameInput")
      .setLabel("Name:")
      .setStyle(TextInputStyle.Paragraph);

    const urlInput = new TextInputBuilder()
      .setCustomId("urlInput")
      .setLabel("Url:")
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    const secondActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(urlInput);

    modal.addComponents(firstActionRow, secondActionRow);

    return modal;
  },
  execute: async (interaction: ModalSubmitInteraction) => {
    await interaction.reply({
      content: "Your submission was received successfully!",
    });
  },
};

export default toReadModal;
