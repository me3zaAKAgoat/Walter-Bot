require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('league-elo')
		.setDescription('shows the elo of the specified summoner')
		.addStringOption(option =>
			option.setName('nickname')
				.setDescription('the accounts nickname')
				.setRequired(true)
				)
		.addStringOption(option =>
			option.setName('region')
				.setDescription('select the region the account belongs to')
				.setRequired(true)
				.addChoices(
					{ name: 'EUW', value: 'euw1' },
					{ name: 'NA', value: 'na1' },
				)),
	execute : async (interaction) => {
		const TeemoJS = require('teemojs');
		let api = TeemoJS(process.env.RIOT_API);

		const regionId = interaction.options.getString('region');
		const regionName = regionId.slice(0, -1).toUpperCase();
		const summonerName = interaction.options.getString('nickname')

		await interaction.deferReply();
		try {
			const summoner = await api.get(regionId, 'summoner.getBySummonerName', summonerName);
			const leagueState = await api.get(regionId, 'league.getLeagueEntriesForSummoner', summoner.id);
			
			const leagueRankViewEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('League Of legends Rank')
			.setDescription(`${summonerName}'s Account`)
			.setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.21.1/img/profileicon/${summoner.profileIconId}.png`)
			.addFields(
				{ name: 'Region', value: regionName, inline: false },
				{ name: 'Solo/Duo', value: `${leagueState[0].tier} ${leagueState[0].rank} ${leagueState[0].leaguePoints} LP`, inline: true  },

			)
			.addFields(
				{ name: 'Flex', value: `${leagueState[1].tier} ${leagueState[1].rank} ${leagueState[1].leaguePoints} LP`, inline: true  },
			)
			await interaction.editReply({ content : `<@${interaction.user.id}>`, embeds: [leagueRankViewEmbed] });
		} catch(err) {
			console.log(err);
			await interaction.editReply('failed');
		}
	}
}