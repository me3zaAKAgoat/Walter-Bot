const { SlashCommandBuilder, EmbedBuilder, quote } = require("discord.js");
const discordUtils = require("../utils/discordUtils");
const logger = require("../utils/logger");

/*
make an embed denouncing ;
"vote if X should to be timed out for Y minutes"
collect 3 more votes and then apply timeout 
send death note gif and then timeout
*/

const USER_VOTES_NEEDED = 5;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("death")
		.setDescription("timeout member Y for X amount of minutes")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("note")
				.setDescription(
					"reaction vote to timeout member for X amount of minutes"
				)
				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription("the user to timeout")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("length")
						.setDescription("length of timeout")
						.setRequired(true)
						.addChoices(
							{ name: "1 minute", value: "1" },
							{ name: "5 minutes", value: "5" },
							{ name: "10 minutes", value: "10" },
							{ name: "1 day", value: "1440" }
						)
				)
		),
	execute: async (interaction) => {
		try {
			await interaction.deferReply();

			const user = interaction.options.getUser("user");
			const length = interaction.options.getString("length");
			const member = interaction.guild.members.cache.get(user.id);
			const quota =
				USER_VOTES_NEEDED + 1; /* + 1 is offset for the bot own reaction */

			const isAdmin = discordUtils.isAdmin(member);

			if (isAdmin)
				return interaction.editReply({
					content: "**🚫 This user is admin thus cant be timed out.**",
				});
			const message = await interaction.editReply({
				content: `Do you agree that user <@${user.id}> should be timed out for ${length} minutes, ${quota} votes total needed.`,
				fetchReply: true,
			});

			message.react("🤝");
			const filter = (reaction, user) => reaction.emoji.name === "🤝";

			const collector = message.createReactionCollector(filter, {
				time: 60 * 1000,
			});

			collector.on("collect", (reaction) => {
				if (reaction.count >= quota) {
					try {
						member.timeout(Number(length) * 60 * 1000);
					} catch (err) {
						logger.error(err);
						return interaction.editReply({
							content:
								"an issue happened, probably raise walters highest role, contact me3za",
						});
					}

					const gifEmbed = new EmbedBuilder()
						.setColor(0x843dff)
						.setTitle(
							`${quota} people voted so ${user.username} is now timed out for ${length} minutes`
						)
						.setImage(
							"https://media.tenor.com/1ybUFYQpNDgAAAAd/death-note-light-yagami.gif"
						);
					return interaction.editReply({
						content: "",
						embeds: [gifEmbed],
					});
				}
			});
		} catch (err) {
			logger.error(err);
		}
	},
};
