import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
import { ContextMenuCommandHandler } from "./ContextMenuCommand";
import createToReadRepository from "core/repositories/to-read/knex.repository";

const deleteToRead: ContextMenuCommandHandler = {
  data: new ContextMenuCommandBuilder()
    .setName("Delete To-Read")
    .setType(ApplicationCommandType.Message),
  execute: async (interaction, db) => {
    if (!interaction.isMessageContextMenuCommand()) return;

    await createToReadRepository(db).deleteByDiscordId(
      interaction.targetMessage.id
    );
    await interaction.targetMessage.delete();

    await (await interaction.reply("Deleted successfully")).delete();
  },
};

export default deleteToRead;