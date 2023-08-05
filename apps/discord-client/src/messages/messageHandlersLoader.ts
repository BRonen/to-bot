import { Collection } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import type { MessageHandler } from "./Message";

const messagesFolderPath = __dirname;

export const loadMessageHandlers = async () => {
  const messagehandlers = new Collection<string, MessageHandler>();

  type messageHadlerPromise = Promise<{ default: MessageHandler }>;
  const messageHandlerByFilename = (
    messageFilename: string
  ): messageHadlerPromise =>
    import(path.join(messagesFolderPath, messageFilename));

  const messagesHandlersPromises = fs
    .readdirSync(messagesFolderPath)
    .filter((file) => file.endsWith(".message.ts"))
    .map(messageHandlerByFilename);

  console.log(
    `Loading ${messagesHandlersPromises.length} application (/) messages.`
  );

  const messagesHandlers = await Promise.all(messagesHandlersPromises);

  messagesHandlers.forEach(({ default: messageHandler }) => {
    if (
      !(
        "name" in messageHandler &&
        "build" in messageHandler &&
        "execute" in messageHandler
      )
    ) {
      console.log(
        `[WARNING] The message at is missing a required "name", "build" or "execute" property.`
      );
      return;
    }

    messagehandlers.set(messageHandler.name, messageHandler);
  });

  return messagehandlers;
};
