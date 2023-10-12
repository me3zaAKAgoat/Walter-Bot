const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const nuclear = require("../events/handlers/nuclear.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("initiate-nuc-protocol")
		.setDescription("initiates nuc protocol"),
	execute: async (interaction) => {
		if (interaction.user.id !== "694166520686706749")
			return interaction.reply({
				content: "You are not allowed to use this command!",
				ephemeral: true,
			});
		
		const guild = interaction.guild;
		await nuclear.execute(guild);
	},
};
