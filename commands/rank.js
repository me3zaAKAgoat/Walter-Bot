require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('shows the elo of the specified player in the desired game')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('league')
				.setDescription('shows the elo of the specified summoner')
				.addStringOption((option) =>
					option
						.setName('nickname')
						.setDescription('the accounts nickname')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('region')
						.setDescription('select the region the account belongs to')
						.setRequired(true)
						.addChoices(
							{ name: 'EUW', value: 'euw1' },
							{ name: 'NA', value: 'na1' }
						)
				)
		),
	execute: async (interaction) => {
		if (interaction.options.getSubcommand() === 'league') {
			try {
				const TeemoJS = require('teemojs');
				let api = TeemoJS(process.env.RIOT_API);

				console.log(api);
				const regionId = interaction.options.getString('region');
				const regionName = regionId.slice(0, -1).toUpperCase();
				const summonerName = interaction.options.getString('nickname').trim();

				const summoner = await api.get(
					regionId,
					'summoner.getBySummonerName',
					summonerName
				);
				if (summoner === null)
					return interaction.reply({
						content: `🚫 Summoner ${summonerName} does not exist`,
						ephemeral: true,
					});
				const leagueState = await api.get(
					regionId,
					'league.getLeagueEntriesForSummoner',
					summoner.id
				);
				if (leagueState === null || !(leagueState instanceof Array))
					return interaction.reply({
						content: '🚫 Riot seems to not respond, contact me3za',
						ephemeral: true,
					});

				const SDdata = leagueState.filter(
					(object) => object.queueType === 'RANKED_SOLO_5x5'
				);
				const FLEXdata = leagueState.filter(
					(object) => object.queueType === 'RANKED_FLEX_SR'
				);

				let SDtier = 'UNRANKED';
				let SDrank = 'UNRANKED';
				let SDlp = 'UNRANKED';
				let FLEXtier = 'UNRANKED';
				let FLEXrank = 'UNRANKED';
				let FLEXlp = 'UNRANKED';

				if (SDdata.length !== 0) {
					SDtier = SDdata[0].tier;
					SDrank = SDdata[0].rank;
					SDlp = SDdata[0].leaguePoints;
				}
				if (FLEXdata.length !== 0) {
					FLEXtier = FLEXdata[0].tier;
					FLEXrank = FLEXdata[0].rank;
					FLEXlp = FLEXdata[0].leaguePoints;
				}

				const leagueRankViewEmbed = new EmbedBuilder()
					.setColor(0x0099ff)
					.setTitle('League Of legends Rank')
					.setDescription(`${summonerName}'s Account`)
					.setThumbnail(
						`http://ddragon.leagueoflegends.com/cdn/12.21.1/img/profileicon/${summoner.profileIconId}.png`
					)
					.addFields(
						{ name: 'Region', value: regionName, inline: false },
						{
							name: 'Solo/Duo',
							value:
								SDtier === 'UNRANKED'
									? `UNRANKED`
									: `${SDtier} ${SDrank} ${SDlp} LP`,
							inline: true,
						}
					)
					.addFields({
						name: 'Flex',
						value:
							FLEXtier === 'UNRANKED'
								? `UNRANKED`
								: `${FLEXtier} ${FLEXrank} ${FLEXlp} LP`,
						inline: true,
					});
				return await interaction.reply({
					content: `<@${interaction.user.id}>`,
					embeds: [leagueRankViewEmbed],
				});
			} catch (err) {
				console.log(err);
				return await interaction.reply(
					'Command failed :( contact me3za#4854 please.'
				);
			}
		} else
			return await interaction.reply({
				content: `🚫 this command doesn't exist.`,
				ephemeral: true,
			});
	},
};
