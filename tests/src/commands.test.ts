import { SlashCommandBuilder } from '@discordjs/builders/dist/interactions/slashCommands/SlashCommandBuilder';
import * as fs from 'fs';
import * as path from 'path';

describe("Testing commands", () => {

    const commands = fs.readdirSync( path.resolve("cmds/") )
        .filter( file => file.endsWith('.js') || file.endsWith('.ts') );

    describe("Checking individual commands", () => {
        for( const file of commands ) {
            describe(`Checking command: ${file}`, () => {
                const command = require(`../../cmds/${file}`);

                it(`Should have: data, permission, execute() `, () => {
                   expect(command).toHaveProperty("data");
                   expect(command).toHaveProperty("permission");
                   expect(command).toHaveProperty("execute");

                   expect( command.data ).toBeInstanceOf( SlashCommandBuilder );
                   expect( command.execute ).toBeInstanceOf( Function );
                });
            });
        }
    });
});


