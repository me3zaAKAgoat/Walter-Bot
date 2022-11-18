const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const Role = require('../models/role');
const Channel = require('../models/channel');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription(`get an expanded view of the user's avatar`)
		.addUserOption((option) =>
			option
				.setName('tag')
				.setDescription('tag of the person you want to expand the avatar for')
				.setRequired(false)
		),
	execute: async (interaction) => {
		try {
			const user = interaction.options.getUser('tag');
			if (!user) {
				const user = interaction.user;
				const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`;
				const avatarEmbed = new EmbedBuilder()
					.setImage(`${avatarUrl}`)
					.setAuthor({ name: `${interaction.user.username}` });
				return await interaction.reply({ embeds: [avatarEmbed] });
			}
			const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`;
			const avatarEmbed = new EmbedBuilder()
				.setImage(`${avatarUrl}`)
				.setAuthor({ name: `${user.username}` });
			return await interaction.reply({ embeds: [avatarEmbed] });
		} catch (err) {
			console.log(err);
		}
	},
};
