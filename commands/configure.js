const { SlashCommandBuilder } = require('discord.js');
const Role = require('../models/role.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('configure')
		.setDescription('configurations of the bot')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('anime')
				.setDescription(
					'configure the role that gets tagged on anime channel announcements'
				)
				.addStringOption((option) =>
					option
						.setName('role')
						.setDescription(
							'the role that gets tagged on anime channel announcements'
						)
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('channel')
						.setDescription('the channel that gets news posted on')
						.setRequired(true)
				)
		),
	execute: async (interaction) => {
		const subCommand = interaction.options.getSubcommand();
		if (subCommand === 'anime') {
			try {
				const animeRoleTag = interaction.options.getString('role');
				const animeRole = await Role.findOne({ type: subCommand });
				console.log(animeRole);
				console.log(animeRoleTag);
				if (animeRole !== null) {
					await Role.findByIdAndUpdate(animeRole._id.toString(), {
						type: subCommand,
						tag: animeRoleTag,
					});
					return await interaction.reply(
						`Successfully updated the ${subCommand} tag ${animeRoleTag}.`
					);
				}
				const newAnimeRole = new Role({
					type: subCommand,
					tag: animeRoleTag,
				});
				await newAnimeRole.save();
				return await interaction.reply(
					`Successfully registered the ${subCommand} tag ${animeRoleTag}.`
				);
			} catch (err) {
				console.log(err);
				return await interaction.reply(
					'Command failed :( please report the the command and your input me3za#4854 please.'
				);
			}
		}
	},
};
