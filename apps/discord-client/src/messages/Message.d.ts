import {
  AnySelectMenuInteraction,
  MessageInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

export type MessageHandler = {
  name: string;
  build: () => ActionRowBuilder;
  execute: (interaction: AnySelectMenuInteraction) => Promise<void>;
};
