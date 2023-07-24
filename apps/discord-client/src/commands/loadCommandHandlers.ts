import { Collection } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { CommandHandler } from "./Command";

const commandsFolderPath = __dirname;

export const loadCommandHandlers = async () => {
  const commandhandlers = new Collection<string, CommandHandler>();

  type commandHadlerPromise = Promise<{ default: CommandHandler }>;
  const commandHandlerByFilename = (
    commandFilename: string
  ): commandHadlerPromise =>
    import(path.join(commandsFolderPath, commandFilename));

  const commandsHandlersPromises = fs
    .readdirSync(commandsFolderPath)
    .filter((file) => file.endsWith(".command.ts"))
    .map(commandHandlerByFilename);

  console.log(
    `Loading ${commandsHandlersPromises.length} application (/) commands.`
  );

  const commandsHandlers = await Promise.all(commandsHandlersPromises);

  commandsHandlers.forEach(({ default: commandHandler }) => {
    if (!("data" in commandHandler && "execute" in commandHandler)) {
      console.log(
        `[WARNING] The command at is missing a required "data" or "execute" property.`
      );
      return;
    }

    commandhandlers.set(commandHandler.data.name, commandHandler);
  });

  return commandhandlers;
};
