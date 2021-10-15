import { Client, Collection, Intents, Message, TextChannel } from "discord.js";
import { Command, Event, Listener } from "../Interfaces";
import { PrismaClient } from "@prisma/client";

import path from "path";
import { readdirSync } from "fs";

import * as dotenv from "dotenv";
dotenv.config();

class botClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public aliases: Collection<string, Command> = new Collection();
    public reactionListeners: Listener[] = [];

    public Channels: Collection<string, TextChannel> = new Collection();
    public Messages: Collection<string, Message> = new Collection();

    public readonly db: PrismaClient = new PrismaClient();

    constructor() {
        super({ intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES, 
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS
        ]});
    }

    public async init() {
        this.login( process.env.DISCORD_TOKEN );
        
        // read commands
        const cmdPath = path.join(__dirname, "..", "Commands");
        readdirSync(cmdPath).forEach( async (file) => {
            if( file.endsWith('.ts') ){
                const { command } = require(`${cmdPath}/${file}`);
    
                this.commands.set(command.name, command);

                if( command?.aliases?.length > 0 )
                    command.aliases.forEach( (alias: string) => this.aliases.set(alias, command));
            }
        });
        console.info(`Zarejestrowano : ${this.commands.size} komend`);

        // read events
        const eventPath = path.join( __dirname, "..", "Events" );
        readdirSync(eventPath).forEach( async (file) => {
            const { event } = await import(`${eventPath}/${file}`);
            
            if( event ){
                this.events.set(event.name, event);
    
                this.on(event.name, event.run.bind(null, this));
            }
        });

        this.reactionListeners = await this.db.listener.findMany() || [];
    }
}


export default botClient;