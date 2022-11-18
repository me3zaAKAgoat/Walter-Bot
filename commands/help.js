require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('get a helpful manual'),
	execute: async (interaction) => {
		try {
			const manualEmbed = new EmbedBuilder()
				.setTitle('Help Manual')
				.setDescription(
					'a list of helpful instructions that ease the use of the bot, you can always contribute by sending a message to `me3za#4854`.'
				);
			const commandDescription = {
				poll: {
					command: '/poll',
					description:
						'Your title should be a natural sentence, but your options should be a sentence in which the words are separated by a comma.',
				},
				rank: {
					command: '/rank',
					description: `Make sure the account nickname that you use is case precise and doesn't miss any uppercasing.`,
				},
				movie: {
					command: '/movie',
					description: `This command provides a database of movies, and with your help, it can keep movie ratings calculated by averaging each member's rating. Rating movies renders them ‘seen’ so they won’t show up in the movie spinning wheel, meaning that you should not review a film that your friend group did not watch together.`,
				},
				configure: {
					command: '/configure',
					description: `This command helps you configure things like the channel and role that the bot uses in different functionalities. Make sure that you send the channels with a '#' tag and roles with a '@' tag.`,
				},
			};
			for (const [key, value] of Object.entries(commandDescription)) {
				manualEmbed.addFields({
					name: value.command,
					value: value.description,
				});
			}
			await interaction.reply({ embeds: [manualEmbed] });
		} catch (err) {
			console.log(err);
		}
	},
};
