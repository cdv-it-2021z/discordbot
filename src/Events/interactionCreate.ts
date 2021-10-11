import { Event } from "../Interfaces";

export const event: Event = {
    name: "interactionCreate",
    run: async ( client, i ) => {
        if ( !i.isCommand() ) return;
            
        const command = client.commands.get(i.commandName);
        if (!command) return;

        try {
            await command.run({client, message: i});
        } catch (e) { 
            console.error(`Error while executing ${i.commandName}`, e);
        }
    }   
}