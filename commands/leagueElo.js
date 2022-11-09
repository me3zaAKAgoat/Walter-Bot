require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leagueElo')
		.setDescription('shows the elo of the specified summoner')
		.addStringOption(option =>
			option.setName('nickname')
				.setDescription('the accounts nickname'))
		.addStringOption(option =>
			option.setName('region')
				.setDescription('select the region the account belongs to')
				.setRequired(true)
				.addChoices(
					{ name: 'EUW', value: 'euw1' },
					{ name: 'NA', value: 'na1' },
				))
	,
	execute : async (interaction) => {
		await interaction.reply('xdd')
	}
}