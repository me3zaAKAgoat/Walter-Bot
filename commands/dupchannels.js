const { SlashCommandBuilder, Options, ChannelType } = require("discord.js");
const logger = require("../utils/logger");
const Channel = require("../models/channel");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("dup")
		.setDescription(
			"set a channel that will duplicate itself when a user joins it"
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("set the channel that will duplicate itself")
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildVoice)
		),
	execute: async (interaction) => {
		try {
			const channelOption = interaction.options.getChannel("channel");
			if ([undefined, null].includes(channelOption))
				return interaction.relpy({
					ephemeral: true,
					content:
						"This interaction failed, please make sure you are sending valid roles/channels",
				});

			const existingChannel = await Channel.findOne({
				channelId: channelOption.id,
			});

			if (!existingChannel) {
				const channelDocument = new Channel({
					channel: "duplicate",
					channelId: channelOption.id,
					guildId: interaction.guildId,
				});
				await channelDocument.save();
				return interaction.reply(
					`The channel <#${channelOption.id}> is now being monitored and will duplicate itself.`
				);
			} else return interaction.reply(`that channel is already being monitored.`);
		}
		catch (err) {
			logger.error(err);
		}
},
};
