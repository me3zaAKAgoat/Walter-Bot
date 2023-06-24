const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const discordUtils = require("../utils/discordUtils");
const logger = require("../utils/logger");

/*
make an embed denouncing ;
"vote if X should to be timed out for Y minutes"
collect 3 more votes and then apply timeout 
send death note gif and then timeout
*/

const USER_VOTES_NEEDED = 4;

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
							{ name: "5 minute", value: "5" },
							{ name: "30 minutes", value: "30" },
							{ name: "1 hour", value: "60" },
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
			let counter = 0;
			const quota =
				USER_VOTES_NEEDED + 1; /* + 1 is offset for the bot own reaction */

			const isAdmin = discordUtils.isAdmin(member);

			if (isAdmin)
				return interaction.editReply({
					content: "**🚫 This user is admin thus cant be timed out.**",
				});

			const reactionHostEmbed = new EmbedBuilder()
				.setColor(process.env.COLOR_THEME)
				.setTitle(
					`Do want user ${user.username} to be timed out for ${length} minutes?`
				)
				.setThumbnail(user.avatarURL())
				.setDescription("**React** with 🤝 to help time them out!")
				.addFields({
					name: "vote ends in:",
					value: `<t:${Math.round(Date.now() / 1000 + 60)}:R>`,
				})
				.setFooter({ text: `${quota} votes total needed` });
			const message = await interaction.editReply({
				// content: `Do you agree that user <@${user.id}> should be timed out for ${length} minutes, ${quota} votes total needed.`,
				embeds: [reactionHostEmbed],
				fetchReply: true,
			});

			message.react("🤝");
			const filter = (reaction, user) => reaction.emoji.name === "🤝";

			const collector = message.createReactionCollector({
				filter,
				time: 60 * 1000,
			});

			collector.on("collect", async (reaction) => {
				counter += 1;
				if (counter >= quota) {
					try {
						await member.timeout(Number(length) * 60 * 1000);

						const gifEmbed = new EmbedBuilder()
							.setColor(process.env.COLOR_THEME)
							.setTitle(
								`${quota} people voted so \`${user.username}\` is now timed out for ${length} minutes`
							)
							.setImage(
								"https://media.tenor.com/1ybUFYQpNDgAAAAd/death-note-light-yagami.gif"
							);
						message.reactions.removeAll();

						return interaction.editReply({
							content: "",
							embeds: [gifEmbed],
						});
					} catch (err) {
						logger.error(err);
						return interaction.editReply({
							content:
								"an issue happened, probably raise walters highest role, contact me3za",
						});
					}
				}
			});

			collector.on("end", () => {
				if (counter < quota) {
					const timeoutEmbed = new EmbedBuilder()
						.setColor(0xff0000)
						.setTitle(
							`Timer ended before enough people voted.\n\n\nUser \`${user.username}\` will not be timed out.`
						)
						.setThumbnail(user.avatarURL());
					message.reactions.removeAll();
					interaction.editReply({
						embeds: [timeoutEmbed],
					});
				}
			});
		} catch (err) {
			logger.error(err);
		}
	},
};
