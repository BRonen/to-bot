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
        new StringSelectMenuOptionBuilder()
          .setLabel("<clear>")
          .setValue("0"),
        ...toReadKeywords.map(
          ({ id, tag }) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(tag)
              .setValue(id.toString()),
        ),
      );

    const actionRow = new ActionRowBuilder().addComponents(select);

    return [actionRow];
  },
  execute: async (interaction, db, customParameter) => {
    const repository = createToReadRepository(db);

    if (interaction.values.includes('0')) {
      await repository.clearKeywordsById(Number(customParameter));
      await interaction.reply("Successfully cleared!");
    } else {
      // TODO: actually this adds keywords without removing the previous
      await repository.addKeywordsByIds(
        interaction.values.map(Number),
        Number(customParameter),
      );
      await interaction.reply("Successfully added!");
    }

    const toRead = await repository.find(customParameter);

    // TODO: move channels id to .env
    const channel = interaction.guild?.channels.cache.get('393124178749816834');
    
    if(!channel?.isTextBased() || !toRead) return;

    const tags = toRead.tags || [];

    // TODO: move embed components to another folder
    const newToReadEmbed = {
      color: 0x0099ff,
      title: toRead.name,
      url: toRead.url,
      description: toRead.url,
      fields: [
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        ...(tags).map(tag => ({
          name: tag,
          value: '',
          inline: true,
        })),
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Last edit at'
      },
    };

    (await channel.messages.fetch(toRead.discord_id)).edit({ embeds: [newToReadEmbed]});
  },
};

export default addToreadKeywordsMessage;
