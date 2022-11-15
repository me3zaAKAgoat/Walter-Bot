const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('creator')
		.setDescription('Names the creator of the bot'),
	execute: async (interaction) => {
		try {
			return await interaction.reply('The sexy madlad that me3za is 🥺.');
		} catch (err) {
			console.log(err);
			return await interaction.reply(
				'Command failed :( please report the the command and your input me3za#4854 please.'
			);
		}
	},
};
