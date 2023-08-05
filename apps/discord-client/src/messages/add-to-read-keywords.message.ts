import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { MessageHandler } from "./Message";

const addToreadKeywordsMessage: MessageHandler = {
  name: "add-to-read-keywords",
  build: () => {
    const select = new StringSelectMenuBuilder()
      .setCustomId("add-to-read-keywords")
      .setPlaceholder("Select multiple users.")
      .setMaxValues(2)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Bulbasaur")
          .setDescription("The dual-type Grass/Poison Seed Pokémon.")
          .setValue("bulbasaur"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Charmander")
          .setDescription("The Fire-type Lizard Pokémon.")
          .setValue("charmander"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Squirtle")
          .setDescription("The Water-type Tiny Turtle Pokémon.")
          .setValue("squirtle")
      );

    const actionRow = new ActionRowBuilder().addComponents(select);

    return actionRow;
  },
  execute: async (interaction) => {
    await interaction.reply("Your submission was received successfully!;!!!!");
  },
};

export default addToreadKeywordsMessage;
