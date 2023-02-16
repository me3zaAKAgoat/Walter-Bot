require("dotenv").config();
const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const TeemoJS = require("teemojs");
const stringUtils = require("../utils/stringUtils");
let api = TeemoJS(process.env.RIOT_API);
const logger = require("../utils/logger");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rank")
		.setDescription("shows the elo of the specified player in the desired game")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("league")
				.setDescription(
					"show the solo/duo and flex rank of the specified summoner"
				)
				.addStringOption((option) =>
					option
						.setName("nickname")
						.setDescription("the accounts nickname")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("region")
						.setDescription("select the region the account belongs to")
						.setRequired(true)
						.addChoices(
							{ name: "EUW", value: "euw1" },
							{ name: "NA", value: "na1" }
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("tft")
				.setDescription("show the tft rank of specified player")
				.addStringOption((option) =>
					option
						.setName("nickname")
						.setDescription("the accounts nickname")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("region")
						.setDescription("select the region the account belongs to")
						.setRequired(true)
						.addChoices(
							{ name: "EUW", value: "euw1" },
							{ name: "NA", value: "na1" }
						)
				)
		),
	execute: async (interaction) => {
		try {
			const regionId = interaction.options.getString("region");
			const regionName = regionId.slice(0, -1).toUpperCase();
			const summonerName = interaction.options.getString("nickname").trim();

			const summoner = await api.get(
				regionId,
				"summoner.getBySummonerName",
				summonerName
			);
			if (summoner === null)
				return interaction.reply({
					content: `🚫 Summoner ${summonerName} does not exist`,
					ephemeral: true,
				});
			if (interaction.options.getSubcommand() === "league") {
				const leagueState = await api.get(
					regionId,
					"league.getLeagueEntriesForSummoner",
					summoner.id
				);
				if (leagueState === null || !(leagueState instanceof Array))
					return interaction.reply({
						content: "🚫 Riot seems to not respond, contact me3za",
						ephemeral: true,
					});

				const SDdata = leagueState.filter(
					(object) => object.queueType === "RANKED_SOLO_5x5"
				);
				const FLEXdata = leagueState.filter(
					(object) => object.queueType === "RANKED_FLEX_SR"
				);

				let SDtier = "UNRANKED";
				let SDrank = "UNRANKED";
				let SDlp = "UNRANKED";
				let FLEXtier = "UNRANKED";
				let FLEXrank = "UNRANKED";
				let FLEXlp = "UNRANKED";

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
					.setTitle("League Of Legends")
					.setThumbnail(
						`http://ddragon.leagueoflegends.com/cdn/12.21.1/img/profileicon/${summoner.profileIconId}.png`
					)
					.addFields({
						name: "Summoner",
						value: `${stringUtils.capitalize(summonerName)}`,
						inline: false,
					})
					.addFields(
						{ name: "Region", value: regionName, inline: false },
						{
							name: "Solo/Duo",
							value:
								SDtier === "UNRANKED"
									? `UNRANKED`
									: `${SDtier} ${SDrank} ${SDlp} LP`,
							inline: true,
						}
					)
					.addFields({
						name: "Flex",
						value:
							FLEXtier === "UNRANKED"
								? `UNRANKED`
								: `${FLEXtier} ${FLEXrank} ${FLEXlp} LP`,
						inline: true,
					});
				return interaction.reply({
					content: `<@${interaction.user.id}>`,
					embeds: [leagueRankViewEmbed],
				});
			} else if (interaction.options.getSubcommand() === "tft") {
				const tftState = await api.get(
					regionId,
					"league.getLeagueEntriesForSummoner",
					summoner.id
				);
				if (tftState === null || !(tftState instanceof Array))
					return interaction.reply({
						content: "🚫 Riot seems to not respond, contact me3za",
						ephemeral: true,
					});
				const TFTDUdata = tftState.filter(
					(object) => object.queueType === "RANKED_TFT_DOUBLE_UP"
				);

				let TFTDUtier = "UNRANKED";

				if (TFTDUdata.length !== 0) {
					TFTDUtier = TFTDUdata[0].tier;
					TFTDUrank = TFTDUdata[0].rank;
					TFTDUlp = TFTDUdata[0].leaguePoints;
				}

				const TFTRankViewEmbed = new EmbedBuilder()
					.setColor(0x0099ff)
					.setTitle("Teamfight Tactics")
					.setThumbnail(
						`http://ddragon.leagueoflegends.com/cdn/12.21.1/img/profileicon/${summoner.profileIconId}.png`
					)
					.addFields({
						name: "Summoner",
						value: `${stringUtils.capitalize(summonerName)}`,
						inline: false,
					})
					.addFields(
						{ name: "Region", value: regionName, inline: false },
						{
							name: "Double Up",
							value:
								TFTDUtier === "UNRANKED"
									? `UNRANKED`
									: `${TFTDUtier} ${TFTDUrank} ${TFTDUlp} LP`,
							inline: true,
						}
					);
				return interaction.reply({
					content: `<@${interaction.user.id}>`,
					embeds: [TFTRankViewEmbed],
				});
			} else
				return interaction.reply({
					content: `🚫 this command doesn't exist.`,
					ephemeral: true,
				});
		} catch (err) {
			logger.error(err);
			return interaction.reply(
				"Command failed :( please report the the command and your input me3za#4854 please."
			);
		}
	},
};
