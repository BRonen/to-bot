import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Options,
} from "discord.js";
import { loadCommandHandlers } from "./commands/loadCommandHandlers";
import { CommandHandler } from "./commands/Command";
import { loadModalHandlers } from "./modals/modalHandlersLoader";
import { ModalHandler } from "./modals/Modal";

if (!process.env.DISCORD_TOKEN)
  throw new Error("Invalid token value on environment");

interface Maple extends Client {
  commands?: Collection<string, CommandHandler>;
  modals?: Collection<string, ModalHandler>;
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

client.on(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!client.commands || !client.modals) return;

  if (interaction.isModalSubmit()) {
    client.modals.get(interaction.customId)?.execute(interaction);
  }

  if (!interaction.isCommand()) return;

  client.commands.get(interaction.commandName)?.execute(interaction);
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("Started running..."))
  .catch(console.error);
