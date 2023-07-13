import { Client } from "discord.js";

if (!process.env.DISCORD_TOKEN)
  throw new Error("Invalid token value on environment");

const client = new Client({
  intents: [],
  partials: [],
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("running"))
  .catch(console.error);
