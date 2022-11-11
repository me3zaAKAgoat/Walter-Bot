const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
    .setName('status')
    .setDescription('status of the bot'),
    execute : async (interaction) => {
        return await interaction.reply('☑️ Up and running!')
    }
}