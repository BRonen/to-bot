import { REST, Routes } from "discord.js";
import { loadCommandHandlers } from "../src/commands/commandHandlersLoader";
import { loadContextMenuCommandHandlers } from "../src/contextMenuCommand/contextMenuCommandHandlerLoader";

if (!process.env.DISCORD_TOKEN)
  throw new Error("Invalid DISCORD_TOKEN value on environment");

if (!process.env.CLIENT_ID)
  throw new Error("Invalid CLIENT_ID value on environment");

if (!process.env.GUILD_ID)
  throw new Error("Invalid GUILD_ID value on environment");

loadContextMenuCommandHandlers().then(async (commandFilePaths) => {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID!
      ),
      {
        body: commandFilePaths.map((commandFilePath) =>
          commandFilePath.data.toJSON()
        ),
      }
    );

    console.log(`Successfully reloaded application (/) context menu commands.`);
  } catch (error) {
    console.error(error);
  }
});

loadCommandHandlers().then(async (commandFilePaths) => {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID!
      ),
      {
        body: commandFilePaths.map((commandFilePath) =>
          commandFilePath.data.toJSON()
        ),
      }
    );

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
});
