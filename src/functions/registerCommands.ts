import { Command, CommandList } from "../Interfaces";

import { REST }  from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from "@discordjs/builders";
import botClient from "../Client";

const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);


export const registerCommands: (client: botClient, guildIds?: string[]) => void = ( client: botClient, guildIds: string[] ) => {
    const guilds = client.guilds.cache;
    const builtCommands = client.commands.map( (command: Command) => {
        return { 
            name: command.name, 
            description: command.description, 
            options: command.options, 
            default_permission: (command.permission || command.onlyFor) ? false : true,
        };
    });

    for (const gi of guilds) {
        const guild = gi[1];
        
        if( guildIds && guildIds.indexOf( guild.id ) == -1 ) continue;

        rest.put(
            Routes.applicationGuildCommands( client.user.id, gi[0] ), 
            { body: builtCommands } 
        ).then( async (commandList: CommandList[]) => {
            const permissions = [];
            commandList.forEach( command => {
                const permissionTmp: {id: string, type: string, permission: boolean}[] = [];
                const roles = guild.roles.cache.filter(role => role.permissions.has( client.commands.get(command.name).permission ) );
                
                roles.each(role => permissionTmp.push({ id: role.id, type: "ROLE", permission: true }));
                permissions.push({ id: command.id, permissions: permissionTmp });
            });

            await guild.commands.permissions.set({ fullPermissions: permissions });
        })
        .catch(console.error);
    }
}