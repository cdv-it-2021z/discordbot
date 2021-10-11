import Bot from "../Client";
import { Message, PermissionResolvable } from "discord.js";

type args = {
    client: Bot;
    message: Message;
    args?: string[];
}
interface Run {
    (arg0: args);
}

export interface Command {
    id?: string;
    name: string;
    description: string;
    aliases?: string[];
    permission: PermissionResolvable
    run: Run;
}