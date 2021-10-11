!process.env.DISCORD_TOKEN && require('dotenv').config();
const { Client, Intents } = require('discord.js');
const { readdirSync } = require('fs');

const bot = new Client(
    {
        intents: [
            Intents.FLAGS.GUILDS, 
            Intents.FLAGS.GUILD_MESSAGES, 
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS
        ],
        partials: [
            'CHANNEL',
            'MESSAGE',
            'REACTION'
        ]
    });

const commands = {};
const commandFiles = fs.readdirSync('./cmds').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    
    const commandTmp = command.data;
    commandTmp.execute = command.execute;
    commandTmp.permission = command.permission;
    commands[`${file.replace('.js', '')}`] = commandTmp;
}


const modules = fs.readdirSync('./modules')
    .filter(f => f.endsWith('.js'))
    .forEach(f => require(`./modules/${f}`).execute({bot, commands}));

bot.login(process.env.DISCORD_TOKEN);