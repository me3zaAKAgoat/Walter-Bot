const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const Activity = require("../models/activity");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lb")
		.setDescription("get a leaderboard of the most active users"),
	execute: async (interaction) => {
		await interaction.deferReply();

		const unsortedUserActivities = await Activity.find({});

		const userActivities = unsortedUserActivity.sort((a, b) => {
			a.vcTime > b.vcTime;
		});

		const lbEmbed = new EmbedBuilder()
			.setTitle(
				`The most active users of __**${interaction.guild.name}**__ are:`
			)
			.setColor(0x843dff)
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			});

		for (const activity of userActivity)
			await interaction.editReply({ embeds: [lbEmbed] });
	},
};
