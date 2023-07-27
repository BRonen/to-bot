import { GuildMember, SlashCommandBuilder } from "discord.js";
import { CommandHandler } from "./Command";

const handler: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user."),

  execute: async (interaction) => {
    if (!interaction.member) {
      await interaction.reply(
        `This command was run by ${interaction.user.username}`
      );
      return;
    }

    await interaction.reply(
      `This command was run by ${interaction.user.username}, who joined on ${
        (interaction.member as GuildMember).joinedAt
      }.`
    );
  },
};

export default handler;
