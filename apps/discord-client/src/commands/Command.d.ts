import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export type CommandHandler = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
};
