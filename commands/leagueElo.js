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

		const pyke = new Pyke(process.env.RIOT_API, "10"); // 10 seconds to cache

		const summonerName = interaction.options.getString('nickname');
		const regionId = interaction.options.getString('region');

		try {
			const summoner = await pyke.summoner.getBySummonerName(String(summonerName), regionId);
			const summonerIcon = summoner.profileIconId; 
		} catch(err) {
			console.log(err)
			await interaction.reply('Command Failed');
		}

		if (typeof summoner != 'undefined')
		{
			try {
				let leaguePosition = await pyke.league.getAllLeaguePositionsForSummoner(
					summoner.id,
					regionID);
				tierSD = leaguePosition.all.RANKED_SOLO_5x5.tier;
				rankSD = leaguePosition.all.RANKED_SOLO_5x5.rank;
				lpSD = leaguePosition.all.RANKED_SOLO_5x5.leaguePoints;
				winsSD = leaguePosition.all.RANKED_SOLO_5x5.wins;
				lossesSD = leaguePosition.all.RANKED_SOLO_5x5.losses;
				winrateSD = round([winsSD / (winsSD + lossesSD)] * 100, 1);

				tierFlex = leaguePosition.all.RANKED_FLEX_SR.tier;
				rankFlex = leaguePosition.all.RANKED_FLEX_SR.rank;
				lpFlex = leaguePosition.all.RANKED_FLEX_SR.leaguePoints;
				winsFlex = leaguePosition.all.RANKED_FLEX_SR.wins;
				lossesFlex = leaguePosition.all.RANKED_FLEX_SR.losses;
				winrateFlex = round([winsFlex / (winsFlex + lossesFlex)] * 100, 1);

				// should handle cases of what these api calls return
			} catch(err) {
				console.log(err)
				await interaction.reply('Command Failed');
			}
		}
		await interaction.reply('Pong!')
	}
}