import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Options,
  REST,
} from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";

if (!process.env.DISCORD_TOKEN)
  throw new Error("Invalid token value on environment");

interface Maple extends Client {
  commands?: Collection<string, any>;
}

const client: Maple = new Client({
  makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
  intents: [GatewayIntentBits.Guilds],
  partials: [],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on(Events.InteractionCreate, (interaction) => {
  console.log(interaction);
});

// will receive a Task and will create a reminder to the user sending a notification

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("running"))
  .catch(console.error);
