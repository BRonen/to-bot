import { 
  Client,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder
} from 'discord.js';

if(!process.env.DISCORD_TOKEN) throw new Error('Invalid token value on environment');

const client = new Client({
  intents: [ GatewayIntentBits.Guilds ],
  partials: [],
});


client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})

// will receive a Task and will create a reminder to the user sending a notification


client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log('running'))
  .catch(console.error);
