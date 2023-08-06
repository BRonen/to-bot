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
    // TODO: validate field type instead of forcing types
    const name = interaction.fields.getField("nameInput") as TextInputModalData;
    const url = interaction.fields.getField("urlInput") as TextInputModalData;

    const toTestChannel = await interaction.guild?.channels.cache.get('393124178749816834');

    if (!toTestChannel?.isTextBased()) return;

    // TODO: move embed components to another folder
    const newToReadEmbed = {
      color: 0x0099ff,
      title: name.value,
      url: url.value,
      description: url.value,
      fields: [],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Last edit at'
      },
    };

    const newToReadMessage = await toTestChannel.send({ embeds: [newToReadEmbed] });

    const toReadId = await createToReadRepository(db).create({
      discord_id: newToReadMessage.id,
      name: name.value,
      url: url.value,
      tags: [],
    });

    const keywordsSelect = await addToreadKeywordsMessage.build(
      db,
      toReadId.id.toString(),
    );

    await interaction.reply({
      content: `To-Read [${name.value}] created successfully!`,
      components: keywordsSelect,
    });
  },
};

export default toReadModal;
