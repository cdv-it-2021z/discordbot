module.exports = {
    async execute({bot}) {
        let channel, message;
        bot.on('ready', async () => {
            channel = await bot.channels.fetch("895608968871829525");
            message = await channel.messages.fetch("895710707973255218");
        });
        
        bot.on('messageReactionAdd', async (m, u) => {
            if ( m.message == message ) {
                switch( m.emoji.name ) {
                    case "🗿": {
                        const role = await m.message.guild.roles.fetch("895611011124576276");
                        const member = await m.message.guild.members.fetch(u.id);
                        await member.roles.add(role);

                        break;
                    }
                    case "🍆": {
                        const role = await m.message.guild.roles.fetch("895615854283214850");
                        const member = await m.message.guild.members.fetch(u.id);
                        await member.roles.add(role);
                        
                        break;
                    }
                }
            }
        });

        bot.on('messageReactionRemove', async (m, u) => {
            if (m.message == message) {
                switch( m.emoji.name ) {
                    case "🗿": {
                        const role = await m.message.guild.roles.fetch("895611011124576276");
                        const member = await m.message.guild.members.fetch(u.id);
                        await member.roles.remove(role);

                        break;
                    }
                    case "🍆": {
                        const role = await m.message.guild.roles.fetch("895615854283214850");
                        const member = await m.message.guild.members.fetch(u.id);
                        await member.roles.remove(role);
                        
                        break;
                    }
                }
            }
        });
    }
}