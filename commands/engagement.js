const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const Activity = require("../models/activity");
const logger = require("../utils/logger");
const activity = require("../models/activity");
const { paginate } = require("../utils/discordUtils");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("engagement")
		.setDescription(
			"serves data about user activity and engagement in the server."
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("lb")
				.setDescription("get a leaderboard of user activity in vc/tc.")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("user")
				.setDescription("get this server's activity data of a user.")
				.addUserOption((option) =>
					option
						.setName("tag")
						.setDescription("tag of the person you want to get data about")
						.setRequired(false)
				)
		),
	execute: async (interaction) => {
		const subcommandName = interaction.options.getSubcommand();
		if (subcommandName === "lb") {
			await interaction.deferReply();

			const guild = interaction.member.guild;

			const unsortedUserActivities = await Activity.find({
				guildId: guild.id,
			});

			const userActivities = unsortedUserActivities.sort(
				(a, b) => b.vcTime - a.vcTime
			);

			const embedGenerator = (pageNum) =>
				new EmbedBuilder()
				.setTitle(`The current most active users are:`)
				.setColor(process.env.COLOR_THEME)
				.setAuthor({
					name: interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL(),
				})
				.setThumbnail(guild.iconURL())
				.setFooter({
					text: `ⓘ Only the caller of the command can switch pages.`,
				});

			let rank = 1;

			const items = [];
			for (const activity of userActivities) 
			{
				try {
					const member = await guild.members.fetch(activity.userId);
					items.push({
						name: `**${rank}**. ${member.user.username} (${activity._id.getTimestamp().toLocaleDateString("fr-FR")})`,
						value: `\`${Math.round(activity.vcTime / 60)} Hours | ${activity.messageCount} Messages\``,
					})
					rank++;
				}
				catch(err) {
					logger.error(err)
				}
			}
			items.reverse();
			await paginate(interaction, items, 10, embedGenerator);	
		} else if (subcommandName === "user") {
			await interaction.deferReply();

			let user = interaction.options.getUser("tag");
			if (!user) {
				user = interaction.user;
			}
			const guild = interaction.member.guild;

			const userActivity = await Activity.findOne({
				guildId: guild.id,
				userId: user.id,
			});

			if (userActivity === null)
				return await interaction.editReply({
					ephemeral: true,
					content: "🚫 **Sorry, there's no data for you.**",
				});

			const userEngagementEmbed = new EmbedBuilder()
				.setAuthor({
					name: user.tag,
					iconURL: user.displayAvatarURL(),
				})
				.setColor(process.env.COLOR_THEME)
				.setThumbnail(user.displayAvatarURL())
				.setTitle(`\`${user.username}\`'s engagement on this server`)
				.setFooter({
					text: `recording started at ~3rd April 2023`,
				})
				.addFields({
					name: "Voice chat:",
					value: "**Text chat:**",
					inline: true,
				})
				.addFields({
					name: `\`${Math.round(userActivity.vcTime / 60)} Hours\``,
					value: `**\`${userActivity.messageCount} Messages\`**`,
					inline: true,
				});

			await interaction.editReply({ embeds: [userEngagementEmbed] });
		}
	},
};
