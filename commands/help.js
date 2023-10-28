require("dotenv").config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("lists a helpful manual."),
	execute: async (interaction) => {
		const manualEmbed = new EmbedBuilder()
			.setTitle("__**Manual**__")
			.setDescription(
				"A manual to help you navigate through the commands and features of this bot, you can always contribute to this by sending a message to `me3za#4854`."
			)
			.setColor(process.env.COLOR_THEME);
		const commandDescription = {
			poll: {
				command: "`/poll`",
				description:
					"Your title could be any normal sentence, but your options should be separated by a comma. e.g: 'option1, option 2, option 3'",
			},
			rank: {
				command: "`/rank`",
				description:
					"Make sure the account nickname that you use is case precise and doesn't miss any uppercasing.",
			},
			movie: {
				command: "`/movie`",
				description:
					"This command provides a database for your server to setup your own collection of movies, and with your input, it can keep movies with their ratings, these ratings are calculated by averaging each member's rating.\n*P.S: Rating movies renders them ‘seen’ so they won’t show up in the (movie randomize) spinning wheel, meaning that you should not review a film that your friend group did not watch together.*",
			},
			configure: {
				command: "`/configure`",
				description:
					"This command helps admins configure things like the channel and role that the bot uses in different functionalities. Make sure that you send the channels with a '#' mention and roles with a '@' mention.",
			},
			configure: {
				command: "`/death note`",
				description:
					"Sometimes some people can be insanely fucking annoying, and if you know that other server members share the same consensus, you can vote to time them out without anyone being labeled a bully, nor anyone feeling bullied!",
			},
		};

		for (const key in commandDescription) {
			manualEmbed.addFields({
				name: commandDescription[key].command,
				value: commandDescription[key].description,
			});
		}

		return interaction.reply({ embeds: [manualEmbed] });
	},
};
