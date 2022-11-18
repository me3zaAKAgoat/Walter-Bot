require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('create a poll')
		.addStringOption((option) =>
			option
				.setName('title')
				.setDescription('what is the poll for')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('options')
				.setDescription('seperate options with a comma (virgule)')
				.setRequired(true)
		),
	execute: async (interaction) => {
		try {
			const pollTitle = interaction.options.getString('title');
			const optionsString = interaction.options.getString('options');
			if (!pollTitle.length || !optionsString.length)
				return await interaction.reply({
					ephemeral: true,
					content:
						'🚫 please make sure your title and options were correctly formatted.',
				});
			const reactionEmojisArr = [
				'0️⃣',
				'1️⃣',
				'2️⃣',
				'3️⃣',
				'4️⃣',
				'5️⃣',
				'6️⃣',
				'7️⃣',
				'8️⃣',
				'9️⃣',
			];
			const optionsArr = optionsString
				.split(',')
				.map((option) => option.trim());
			if (optionsArr.length > 10)
				return await interaction.reply({
					ephemeral: true,
					content: `🚫 can't handle more than 10 options.`,
				});
			const pollEmbed = new EmbedBuilder().setTitle(`📊 ${pollTitle}`);
			pollEmbed.addFields({
				name: `React to this post with the following reactions to voice your opinion.`,
				value: `\u200b`,
			});
			for (const [index, option] of optionsArr.entries()) {
				pollEmbed.addFields({
					name: `${reactionEmojisArr[index]}	**${option}**`,
					value: `\u200b`,
				});
			}
			const reply = await interaction.reply({
				embeds: [pollEmbed],
				fetchReply: true,
			});
			for (const [index, option] of optionsArr.entries()) {
				reply.react(reactionEmojisArr[index]);
			}
			return;
		} catch (err) {
			console.log(err);
		}
	},
};
