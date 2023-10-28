const { SlashCommandBuilder } = require("discord.js");
const Activity = require("../models/activity");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("tag")
		.setDescription("tags members that have more hours in vc than you indicated.")
		.addSubcommand((subcommand) => 
			subcommand
			.setName("active")
			.setDescription("tags members that have more hours in vc than you indicated.")
			.addNumberOption((option) => 
				option
				.setName('hours')
				.setDescription("minimum of hours in vc")
				.setMinValue(0)
				.setRequired(true))
		),
	execute: async (interaction) => {
		interaction.deferReply();
		interaction.deleteReply();
	
		const minimumOfHours = interaction.options.getNumber("hours");
		const guild = interaction.guild;

		const userActivities = await Activity.find({
			guildId: guild.id,
			vcTime : { $gte : minimumOfHours * 60}
		});

		return await interaction.channel.send(userActivities.map(activity => `<@${activity.userId}>`).join(" "));
	},
};
