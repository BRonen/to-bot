import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
import { ContextMenuCommandHandler } from "./ContextMenuCommand";
import createToReadRepository from "core/repositories/to-read/knex.repository";

const deleteToRead: ContextMenuCommandHandler = {
  data: new ContextMenuCommandBuilder()
    .setName("Readed To-Read")
    .setType(ApplicationCommandType.Message),
  execute: async (interaction, db) => {
    if (!interaction.isMessageContextMenuCommand()) return;

    await createToReadRepository(db).setAsReadedByDiscordId(
      interaction.targetMessage.id
    );
    await interaction.targetMessage.react('✅');

    await (await interaction.reply("Readed successfully")).delete();
  },
};

export default deleteToRead;
