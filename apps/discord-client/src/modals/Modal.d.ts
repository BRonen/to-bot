import { ModalBuilder, ModalSubmitInteraction } from "discord.js";

export type ModalHandler = {
  name: string;
  build: () => ModalBuilder;
  execute: (interaction: ModalSubmitInteraction) => Promise<void>;
};
