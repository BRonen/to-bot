import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputModalData,
  TextInputStyle,
} from "discord.js";
import { ModalHandler } from "./Modal";
import addToreadKeywordsMessage from "../messages/add-to-read-keywords.message";
import createToReadRepository from "core/repositories/to-read/knex.repository";

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
  execute: async (interaction, db) => {
    const name = interaction.fields.getField("nameInput") as TextInputModalData;
    const url = interaction.fields.getField("urlInput") as TextInputModalData;

    const toReadId = await createToReadRepository(db).create({
      name: name.value,
      url: url.value,
      tags: [],
    });

    const keywordsSelect = await addToreadKeywordsMessage.build(
      db,
      toReadId.id.toString()
    );

    console.log({ keywordsSelect });

    await interaction.reply({
      content: `To-Read [${name.value}] created successfully!`,
      components: [keywordsSelect],
    });
  },
};

export default toReadModal;
