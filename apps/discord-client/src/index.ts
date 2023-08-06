import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Options,
} from "discord.js";
import { loadCommandHandlers } from "./commands/commandHandlersLoader";
import { CommandHandler } from "./commands/Command";
import { loadModalHandlers } from "./modals/modalHandlersLoader";
import { ModalHandler } from "./modals/Modal";
import { loadMessageHandlers } from "./messages/messageHandlersLoader";
import { MessageHandler } from "./messages/Message";
import { loadContextMenuCommandHandlers } from "./contextMenuCommand/contextMenuCommandHandlerLoader";
import { ContextMenuCommandHandler } from "./contextMenuCommand/ContextMenuCommand";

if (!process.env.DISCORD_TOKEN)
  throw new Error("Invalid token value on environment");

import knex from "knex";
import knexConfig from "core/knexfile";

const db = knex(knexConfig["development"]);

interface Maple extends Client {
  commands?: Collection<string, CommandHandler>;
  modals?: Collection<string, ModalHandler>;
  messages?: Collection<string, MessageHandler>;
  contextMenuCommands?: Collection<string, ContextMenuCommandHandler>;
}

const client: Maple = new Client({
  makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
  partials: [],
});

loadCommandHandlers().then((commandHandlers) => {
  client.commands = commandHandlers;
});
loadModalHandlers().then((modalHandlers) => {
  client.modals = modalHandlers;
});
loadMessageHandlers().then((messageHandlers) => {
  client.messages = messageHandlers;
});
loadContextMenuCommandHandlers().then((contextMenuCommandHandlers) => {
  client.contextMenuCommands = contextMenuCommandHandlers;
});

client.on(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (
    !client.commands ||
    !client.modals ||
    !client.messages ||
    !client.contextMenuCommands
  )
    return;

  if (interaction.isContextMenuCommand()) {
    const contextMenuCommandHandler = client.contextMenuCommands.get(
      interaction.commandName
    );

    if (!contextMenuCommandHandler) return;

    return contextMenuCommandHandler.execute(interaction, db);
  }

  if (interaction.isAnySelectMenu()) {
    const [customId, customParameter] = interaction.customId.split("?");
    const messageHandler = client.messages.get(customId);

    if (!messageHandler) return;

    return messageHandler.execute(interaction, db, customParameter);
  }

  if (interaction.isModalSubmit()) {
    const modalHandler = client.modals.get(interaction.customId);

    if (!modalHandler) return;

    return modalHandler.execute(interaction, db);
  }

  if (interaction.isCommand()) {
    const commandHandler = client.commands.get(interaction.commandName);

    if (!commandHandler) return;

    return commandHandler.execute(interaction);
  }

  console.log("else", interaction);
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("Started running..."))
  .catch(console.error);
