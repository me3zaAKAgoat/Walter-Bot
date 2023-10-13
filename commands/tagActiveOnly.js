const { SlashCommandBuilder } = require("discord.js");
const Activity = require("../models/activity");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("tag")
		.setDescription("passes tags of users who are most active for you to copy and paste")
		.addSubcommand((subcommand) => 
			subcommand
			.setName("active")
			.setDescription("passes tags of users who are most active for you to copy and paste")
			.addNumberOption((option) => 
				option
				.setName('hours')
				.setDescription("minimum of hours in vc")
				.setMinValue(0)
				.setRequired(true))
		),
	execute: async (interaction) => {
		await interaction.deferReply({ephemeral : true});

		const minimumOfHours = interaction.options.getNumber("hours");
		const guild = interaction.guild;

		const userActivities = await Activity.find({
			guildId: guild.id,
			vcTime : { $gte : minimumOfHours * 60}
		});

		return await interaction.editReply({content : userActivities.map(activity => `\\<@${activity.userId}>`).join(" ")});
	},
};
