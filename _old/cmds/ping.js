const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Testowa komenda")
        .setDefaultPermission(false),
    permission: "ADMINISTRATOR",
    async execute(i) {
        await i.reply({content: "Pong!"});
    }
}