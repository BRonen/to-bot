import type {
  AnySelectMenuInteraction,
  MessageInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import type { Knex } from "knex";

export type MessageHandler = {
  name: string;
  build: (db: Knex, customParameter: string) => ActionRowBuilder;
  execute: (
    interaction: AnySelectMenuInteraction,
    db: Knex,
    customParameter: string
  ) => Promise<void>;
};
