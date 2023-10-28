const { SlashCommandBuilder } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("status of the bot."),
	execute: async (interaction) => {
		try {
			return interaction.reply("☑️ Up and running!");
		} catch (err) {
			logger.error(err);
			return interaction.reply(
				"Command failed :( please report the the command and your input me3za#4854 please."
			);
		}
	},
};
