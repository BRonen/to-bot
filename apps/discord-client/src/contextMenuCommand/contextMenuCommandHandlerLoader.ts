import { Collection } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import type { ContextMenuCommandHandler } from "./ContextMenuCommand";

const commandsFolderPath = __dirname;

export const loadContextMenuCommandHandlers = async () => {
  const commandhandlers = new Collection<string, ContextMenuCommandHandler>();

  type commandHadlerPromise = Promise<{ default: ContextMenuCommandHandler }>;
  const commandHandlerByFilename = (
    commandFilename: string
  ): commandHadlerPromise =>
    import(path.join(commandsFolderPath, commandFilename));

  const commandsHandlersPromises = fs
    .readdirSync(commandsFolderPath)
    .filter((file) => file.endsWith(".command.ts"))
    .map(commandHandlerByFilename);

  console.log(
    `Loading ${commandsHandlersPromises.length} application (/) context menu commands.`
  );

  const commandsHandlers = await Promise.all(commandsHandlersPromises);

  commandsHandlers.forEach(({ default: commandHandler }) => {
    if (!("data" in commandHandler && "execute" in commandHandler)) {
      console.log(
        `[WARNING] The context menu command at is missing a required "data" or "execute" property.`
      );
      return;
    }

    commandhandlers.set(commandHandler.data.name, commandHandler);
  });

  return commandhandlers;
};
