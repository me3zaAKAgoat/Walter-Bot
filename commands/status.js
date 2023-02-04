const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("status of the bot"),
	execute: async (interaction) => {
		try {
			return interaction.reply("☑️ Up and running!");
		} catch (err) {
			console.error(err);
			return interaction.reply(
				"Command failed :( please report the the command and your input me3za#4854 please."
			);
		}
	},
};
