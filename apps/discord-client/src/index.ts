import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Options,
} from "discord.js";
import { loadCommandHandlers } from "./commands/loadCommandHandlers";
import { CommandHandler } from "./commands/Command";

if (!process.env.DISCORD_TOKEN)
  throw new Error("Invalid token value on environment");

interface Maple extends Client {
  commands?: Collection<string, CommandHandler>;
}

const client: Maple = new Client({
  makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
  intents: [GatewayIntentBits.Guilds],
  partials: [],
});

loadCommandHandlers().then((commandHandlers) => {
  client.commands = commandHandlers;
});

client.on(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, (interaction) => {
  if (!client.commands) return;

  if (!interaction.isCommand()) return;

  client.commands.get(interaction.commandName)?.execute(interaction);
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("Started running..."))
  .catch(console.error);
