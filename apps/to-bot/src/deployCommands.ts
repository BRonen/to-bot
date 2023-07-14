import { REST, Routes } from "discord.js";

if (!process.env.DISCORD_TOKEN)
  throw new Error("Invalid DISCORD_TOKEN value on environment");
if (!process.env.CLIENT_ID)
  throw new Error("Invalid CLIENT_ID value on environment");
if (!process.env.GUILD_ID)
  throw new Error("Invalid GUILD_ID value on environment");

import * as fs from "node:fs";
import * as path from "node:path";

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  console.log("commandsPath", commandsPath);

  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    console.log(commandsPath);

    // if ('data' in command && 'execute' in command) {
    // 	commands.push(command.data.toJSON());
    // } else {
    // 	console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    // }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID as string,
        process.env.GUILD_ID as string
      ),
      { body: commands }
    );
    console.log(data);

    // console.log(`Successfully reloaded ${data?.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
