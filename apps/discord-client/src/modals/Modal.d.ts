import { ModalBuilder, ModalSubmitInteraction } from "discord.js";
import type { Knex } from 'knex'

export type ModalHandler = {
  name: string;
  build: () => ModalBuilder;
  execute: (interaction: ModalSubmitInteraction, db: Knex) => Promise<void>;
};
