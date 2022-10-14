const {SlashCommandBuilder} = require('discord.js');

modules.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies With Pong!'),
    async execute(interaction){
        await interaction.reply('Pong!')
    }
}