const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
    .setName('creator')
    .setDescription('Names the creator of the bot'),
    execute : async (interaction) => {
        return await interaction.reply('The sexy madlad that me3za is 🥺.')
    }
}