import Bot from "../Client";
import { Message, PermissionResolvable, ApplicationCommandOption, CommandInteraction } from "discord.js";

type args = {
    client: Bot;
    message: CommandInteraction;
    args?: string[];
}

interface Run {
    (arg0: args);
}

export interface Command {
    id?: string;
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    aliases?: string[];
    permission: PermissionResolvable
    run: Run;
}