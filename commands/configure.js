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
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('birthday')
				.setDescription(
					'configure the channel where the birthday will be announced'
				)
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription('the channel where the birthday will be announced')
						.setRequired(true)
				)
		),
	execute: async (interaction) => {
		try {
			const subCommand = interaction.options.getSubcommand();
			if (subCommand === 'anime') {
				let roleTag;
				let channelId;
				const roleFetch = interaction.options.getRole('role');
				const channelFetch = interaction.options.getChannel('channel');
				if (
					![undefined, null].includes(roleFetch) &&
					![undefined, null].includes(channelFetch)
				) {
					roleTag = `<@&${roleFetch.id}>`;
					channelId = channelFetch.id;
				} else {
					return await interaction.relpy({
						ephemeral: true,
						content:
							'This interaction failed, pls make sure you are sending valid roles/channels, otherwise contact me3za',
					});
				}
				console.log('role tag', roleTag, 'channel id', channelId);
				const registeredRole = await Role.findOne({ type: subCommand });
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
				const registeredChannel = await Channel.findOne({ type: subCommand });
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
				return await interaction.reply(
					`Successfully registered the ${subCommand} tag ${roleTag} and the channel <#${channelId}>.`
				);
			} else if (subCommand === 'birthday') {
				const channel = interaction.options.getChannel('channel');
				const updateResult = await Channel.findOneAndUpdate(
					{
						type: subCommand,
					},
					{ id: channel.id }
				);

				if (updateResult !== null) {
					return await interaction.reply({
						content: `Updated birthday channel to <#${channel.id}>.`,
					});
				}

				const newBirthdayChannel = new Channel({
					type: subCommand,
					id: channel.id,
				});

				newBirthdayChannel.save();
				return await interaction.reply(
					`Successfully registered the ${subCommand} announcement channel to <#${channel.id}>.`
				);
			}
		} catch (err) {
			console.log(err);
			return await interaction.reply({
				content:
					'Command failed :( please report the the command and your input me3za#4854 please.',
				ephemeral: true,
			});
		}
	},
};
