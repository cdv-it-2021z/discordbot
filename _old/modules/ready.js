const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);

module.exports = {
    async execute({bot, commands}) {
        bot.on('ready', async () => {

            console.log(bot.user.username, bot.user.id);
        
            const guilds = bot.guilds.cache;
            for (const guild of guilds) {
                const commandList = await rest.put(Routes.applicationGuildCommands(bot.user.id, guild[0]), {body: Object.values(commands)});
                const permissions = [];
                for (const command of commandList) {
                    const permissionTmp = [];
                    const permission = commands[command.name].permission;
                    const roles = guild[1].roles.cache.filter(role => role.permissions.has(permission));
                    roles.each(role => permissionTmp.push({id: role.id, type: "ROLE", permission: true}));
                    permissions.push({id: command.id, permissions: permissionTmp});
                }
                await guild[1].commands.permissions.set({fullPermissions: permissions});
            }
        });
    }
}