const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const Activity = require("../models/activity");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lb")
		.setDescription("get a leaderboard of the most active users"),
	execute: async (interaction) => {
		await interaction.deferReply();

		const guild = interaction.member.guild;

		const unsortedUserActivities = await Activity.find({
			guildId: guild.id,
		});

		const userActivities = unsortedUserActivities.sort(
			(a, b) => b.vcTime - a.vcTime + (b.messageCount - a.messageCount) * 2.5
		);

		const lbEmbed = new EmbedBuilder()
			.setTitle(`The current most active users are:`)
			.setColor(0x843dff)
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setThumbnail(guild.iconURL());

		let rank = 1;

		for (const activity of userActivities) {
			if (rank > 5) break;
			const member = await guild.members.fetch(activity.userId);
			lbEmbed.addFields({
				name: `\u200b`,
				value: `**${rank}**. ${member.user.username}`,
			});
			lbEmbed.addFields({
				name: "Voice chat:",
				value: "**Text chat:**",
				inline: true,
			});
			lbEmbed.addFields({
				name: `\`${Math.round(activity.vcTime / 60)} Hours\``,
				value: `**\`${activity.messageCount} Messages\`**`,
				inline: true,
			});
			rank++;
		}
		await interaction.editReply({ embeds: [lbEmbed] });
	},
};
