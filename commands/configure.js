const { SlashCommandBuilder } = require("discord.js");
const Role = require("../models/role");
const Channel = require("../models/channel");
const discordUtils = require("../utils/discordUtils");
const logger = require("../utils/logger");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("configure")
		.setDescription("configurations of the bot")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("anime")
				.setDescription(
					"configure the role that gets tagged on anime announcements channel"
				)
				.addRoleOption((option) =>
					option
						.setName("role")
						.setDescription(
							"the role that gets tagged on anime channel announcements"
						)
						.setRequired(true)
				)
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription("the channel that gets news posted on")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("birthday")
				.setDescription(
					"configure the channel where the birthday will be announced"
				)
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription("the channel where the birthday will be announced")
						.setRequired(true)
				)
		),
	execute: async (interaction) => {
		if (!discordUtils.isAdmin(interaction.member))
			return interaction.reply({
				content: "🚫 this command is admin only.",
				ephemeral: true,
			});
		const subcommandName = interaction.options.getSubcommand();
		if (subcommandName === "anime") {
			const role = interaction.options.getRole("role");
			const channel = interaction.options.getChannel("channel");
			if (
				[undefined, null].includes(role) ||
				[undefined, null].includes(channel)
			) {
				return interaction.relpy({
					ephemeral: true,
					content:
						"This interaction failed, pls make sure you are sending valid roles/channels",
				});
			}

			try {
				// upsert role id
				await Role.findOneAndUpdate(
					{ guildId: interaction.guildId, role: subcommandName },
					{ roleId: role.id },
					{ upsert: true, new: true }
				);
				// upsert channel id
				await Channel.findOneAndUpdate(
					{ guildId: interaction.guildId, channel: subcommandName },
					{ channelId: channel.id },
					{ upsert: true, new: true }
				);
			} catch (err) {
				logger.error(subcommandName, err);
				return interaction.reply(
					"there was an issue completing this command contact me3za"
				);
			}

			return interaction.reply(
				`Successfully registered the ${subcommandName} tag <@&${role.id}> and the channel <#${channel.id}>.`
			);
		} else if (subcommandName === "birthday") {
			const channel = interaction.options.getChannel("channel");

			try {
				// upsert channel id
				await Channel.findOneAndUpdate(
					{ guildId: interaction.guildId, channel: subcommandName },
					{ channelId: channel.id },
					{ upsert: true, new: true }
				);
			} catch (err) {
				logger.error(subcommandName, err);
				return interaction.reply(
					"there was an issue completing this command contact me3za"
				);
			}

			return interaction.reply(
				`Successfully registered the ${subcommandName} announcement channel to <#${channel.id}>.`
			);
		}
		return interaction.reply({
			content: "🚫 this command doesn't exist.",
			ephemeral: true,
		});
	},
};
