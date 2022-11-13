const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('status of the bot'),
	execute: async (interaction) => {
		try {
			return await interaction.reply('☑️ Up and running!');
		} catch (err) {
			console.log(err);
			return await interaction.reply(
				'Command failed :( contact me3za#4854 please.'
			);
		}
	},
};
