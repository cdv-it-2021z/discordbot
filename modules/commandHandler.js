module.exports = {
    async execute({bot, commands}) {
        bot.on('interactionCreate', async (i) => {
            if (!i.isCommand()) return;
            
            const command = commands[i.commandName];
            if (!command) return;

            try {
                await command.execute(i);
            } catch (e) { 
                console.error(`Error while executing ${i.commandName}`, e);
            }
        })
    }
}