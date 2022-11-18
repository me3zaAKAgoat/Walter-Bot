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
				const roleTag = interaction.options.getString('role');
				const registeredRole = await Role.findOne({ type: subCommand });
				const channelId = interaction.options.getString('channel');
				const registeredChannel = await Channel.findOne({ type: subCommand });

				if (inputSanitizing(roleTag, channelId) === -1)
					return await interaction.reply({
						content:
							'Please make sure that your input contained tags using @ and #',
						ephemeral: true,
					});
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
				return await interaction.reply(
					'Command failed :( please report the the command and your input me3za#4854 please.'
				);
			}
		}
	},
};

const inputSanitizing = (roleTag, channelId) => {
	//check wether channel id conforms to channel ids in discord
	//check wether role tag conforms to role tags in discord

	if (
		!(
			roleTag.startsWith('<@&') &&
			roleTag.endsWith('>') &&
			'0' <= roleTag[3] &&
			roleTag[3] <= '9'
		)
	)
		return -1;
	if (
		!(
			channelId.startsWith('<#') &&
			channelId.endsWith('>') &&
			'0' <= channelId[2] &&
			channelId[2] <= '9'
		)
	)
		return -1;
	return 0;
};
