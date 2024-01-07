import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputModalData,
  TextInputStyle,
} from "discord.js";
import { ModalHandler } from "./Modal";
import createToReadKeywordsRepository from "@to-bot/database/repositories/knex/to-read-keywords.repository";

const toReadKeywordModal: ModalHandler = {
  name: "create-to-read-keyword-modal",
  build: () => {
    const modal = new ModalBuilder()
      .setCustomId("create-to-read-keyword-modal")
      .setTitle("New To-Read-Keyword");

    const nameInput = new TextInputBuilder()
      .setCustomId("tagInput")
      .setLabel("Tag:")
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);

    modal.addComponents(firstActionRow);

    return modal;
  },
  execute: async (interaction, db) => {
    const tag = interaction.fields.getField("tagInput") as TextInputModalData;

    await createToReadKeywordsRepository(db).create({
      tag: tag.value,
    });

    await interaction.reply(
      `To-Read-Keyword [${tag.value}] created successfully!`
    );
  },
};

export default toReadKeywordModal;
