import { Permissions } from "discord.js";
import { Command } from "../Interfaces";

export const command: Command = {
    name: "test",
    description: "TEst command!",
    permission: Permissions.FLAGS.KICK_MEMBERS,
    run: async({ message }) => {
        message.reply(`Tested!`);
    }
}