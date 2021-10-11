import { Event } from "../Interfaces";

import { registerCommands } from "../functions/registerCommands";

export const event: Event = {
    name: "ready",
    run: async ( client ) => {
        console.info( `${client.user.username} online!` );

        registerCommands(client);
    }   
}