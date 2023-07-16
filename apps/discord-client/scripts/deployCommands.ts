import { REST, Routes } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { CommandHandler } from "../src/commands/Command";

if (!process.env.DISCORD_TOKEN)
  throw new Error("Invalid DISCORD_TOKEN value on environment");

if (!process.env.CLIENT_ID)
  throw new Error("Invalid CLIENT_ID value on environment");

if (!process.env.GUILD_ID)
  throw new Error("Invalid GUILD_ID value on environment");

const commandsFolderPath = path.join(__dirname, "../src/commands");

type commandHadlerPromise = Promise<{ default: CommandHandler }>;
const commandHandlerByFilename = (
  commandFilename: string
): commandHadlerPromise =>
  import(path.join(commandsFolderPath, commandFilename));

const commandsHandlersPromises = fs
  .readdirSync(commandsFolderPath)
  .filter((file) => file.endsWith(".command.ts"))
  .map(commandHandlerByFilename);

Promise.all(commandsHandlersPromises).then(async (commandFilePaths) => {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log(
      `Started deploying ${commandFilePaths.length} application (/) commands.`
    );

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID!
      ),
      {
        body: commandFilePaths.map((commandFilePath) =>
          commandFilePath.default.data.toJSON()
        ),
      }
    );

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
});
