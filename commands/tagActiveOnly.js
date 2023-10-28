const { SlashCommandBuilder } = require("discord.js");
const Activity = require("../models/activity");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("tag")
		.setDescription("tag top X most active members of the server")
		.addSubcommand((subcommand) => 
			subcommand
			.setName("active")
			.setDescription("tag top X most active members of the server")
			.addNumberOption((option) => 
				option
				.setName('count')
				.setDescription("number of most active members to tag")
				.setMinValue(0)
				.setRequired(true))
		),
	execute: async (interaction) => {
		interaction.deferReply();
		interaction.deleteReply();
	
		const numberOfActiveMembers = interaction.options.getNumber("count");
		const guild = interaction.guild;

		const unsortedUserActivities = await Activity.find({
			guildId: guild.id,
		});

		const userActivities = unsortedUserActivities.sort(
			(a, b) => b.vcTime - a.vcTime
		);

		const activeMembers = userActivities.slice(0, numberOfActiveMembers);

		return await interaction.channel.send(activeMembers.map(activity => `<@${activity.userId}>`).join(" "));
	},
};
