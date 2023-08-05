import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { MessageHandler } from "./Message";
import createToReadKeywordsRepository from "core/repositories/to-read-keywords/knex.repository";
import createToReadRepository from "core/repositories/to-read/knex.repository";

const addToreadKeywordsMessage: MessageHandler = {
  name: "add-to-read-keywords",
  build: async (db, customParameter) => {
    const toReadKeywords = await createToReadKeywordsRepository(db).findAll();
    console.log(
      { toReadKeywords },
      toReadKeywords.map(({ id, tag }) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(tag)
          .setDescription("The Water-type Tiny Turtle Pokémon.")
          .setValue(id.toString())
      )
    );

    if (!toReadKeywords.length) return;

    const select = new StringSelectMenuBuilder()
      .setCustomId(`add-to-read-keywords?${customParameter}`)
      .setPlaceholder("Add To-Read keywords:")
      .setMaxValues(Math.min(25, toReadKeywords.length))
      .addOptions(
        ...toReadKeywords.map(
          ({ id, tag }) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(tag)
              .setDescription("The Water-type Tiny Turtle Pokémon.")
              .setValue(id.toString()),
          new StringSelectMenuOptionBuilder()
            .setLabel("placeholder")
            .setValue("0")
        )
      );

    const actionRow = new ActionRowBuilder().addComponents(select);

    return actionRow;
  },
  execute: async (interaction, db, customParameter) => {
    console.log(interaction.values);

    await createToReadRepository(db).addKeywordsByIds(
      interaction.values.map(Number),
      Number(customParameter)
    );

    await interaction.reply("Successfully added!");
  },
};

export default addToreadKeywordsMessage;
