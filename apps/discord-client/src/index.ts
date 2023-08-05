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

if (!process.env.DISCORD_TOKEN)
  throw new Error("Invalid token value on environment");

interface Maple extends Client {
  commands?: Collection<string, CommandHandler>;
  modals?: Collection<string, ModalHandler>;
  messages?: Collection<string, MessageHandler>;
}

const client: Maple = new Client({
  makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
  intents: [GatewayIntentBits.Guilds],
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

client.on(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!client.commands || !client.modals || !client.messages) return;

  if (interaction.isAnySelectMenu()) {
    const messageHandler = client.messages.get(interaction.customId);

    if (!messageHandler) return;

    return messageHandler.execute(interaction);
  }

  if (interaction.isModalSubmit()) {
    const modalHandler = client.modals.get(interaction.customId);

    if (!modalHandler) return;

    return modalHandler.execute(interaction);
  }

  if (interaction.isCommand()) {
    const commandHandler = client.commands.get(interaction.commandName);

    if (!commandHandler) return;

    return commandHandler.execute(interaction);
  }

  console.log(interaction);
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("Started running..."))
  .catch(console.error);
