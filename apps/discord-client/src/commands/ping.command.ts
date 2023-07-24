import { SlashCommandBuilder } from "discord.js";
import { CommandHandler } from "./Command";

const handler: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),

  execute: async (interaction) => {
    console.log(interaction);

    await interaction.reply("Pong!");
  },
};

export default handler;
