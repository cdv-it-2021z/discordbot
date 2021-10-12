import { Collection, Message, TextChannel } from "discord.js";

import { Event } from "../Interfaces";
import { registerCommands } from "../functions/registerCommands";

export const event: Event = {
    name: "ready",
    run: async ( client ) => {
        console.info( `${client.user.username} online!` );

        for( const listener of client.reactionListeners ) {
            if( client.Messages.get(listener.message) ) continue;

            const channel = await client.channels.fetch(listener.channel) as TextChannel;
            const message = await channel.messages.fetch(listener.message);

            if( channel && message ){
                client.Channels.set(listener.channel, channel);
                client.Messages.set(listener.message, message);
            }
        }

        registerCommands(client);
    }   
}