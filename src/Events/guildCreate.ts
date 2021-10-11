import { Event } from "../Interfaces";

import { registerCommands } from "../functions/registerCommands";
import { Guild } from "discord.js";

export const event: Event = {
    name: "guildCreate",
    run: async ( client, guild: Guild ) => {
        console.info( `Dołączono do servera: ${guild.name}` );

        registerCommands(client, [guild.id]);
    }   
}