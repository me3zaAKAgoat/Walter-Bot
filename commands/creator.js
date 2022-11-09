const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
    .setName('creator')
    .setDescription('Names the creator of the bot'),
    execute : async (interaction) => {
        interaction.reply('The sexy madlad me3za is 🥺')
    }
}