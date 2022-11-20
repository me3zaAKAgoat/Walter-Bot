const { SlashCommandBuilder } = require('discord.js');
const Role = require('../models/role');
const Channel = require('../models/channel');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('configure')
		.setDescription('configurations of the bot')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('anime')
				.setDescription(
					'configure the role that gets tagged on anime announcements channel'
				)
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription(
							'the role that gets tagged on anime channel announcements'
						)
						.setRequired(true)
				)
				.addChannelOption((option) =>
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
				let roleTag;
				const role = interaction.options.getRole('role');
				if (role !== null) {
					roleTag = `<@&${role.id}>`;
				}
				const registeredRole = await Role.findOne({ type: subCommand });
				const channelId = interaction.options.getChannel('channel');
				const registeredChannel = await Channel.findOne({ type: subCommand });

				console.log(roleTag, channelId);
				if (registeredChannel !== null) {
					await Channel.findByIdAndUpdate(registeredChannel._id.toString(), {
						type: subCommand,
						id: channelId,
					});
				} else {
					const newChannel = new Channel({
						type: subCommand,
						id: channelId,
					});
					await newChannel.save();
				}
				if (registeredRole !== null) {
					await Role.findByIdAndUpdate(registeredRole._id.toString(), {
						type: subCommand,
						tag: roleTag,
					});
				} else {
					const newRole = new Role({
						type: subCommand,
						tag: roleTag,
					});
					await newRole.save();
				}
				return await interaction.reply(
					`Successfully registered the ${subCommand} tag ${roleTag} and the channel ${channelId}.`
				);
			} catch (err) {
				console.log(err);
				return await interaction.reply({
					content:
						'Command failed :( please report the the command and your input me3za#4854 please.',
					ephemeral: true,
				});
			}
		}
	},
};
