require("dotenv").config();
const logger = require("../utils/logger");
const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { capitalize } = require("../utils/stringUtils");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("poll")
		.setDescription("create a poll.")
		.addStringOption((option) =>
			option
				.setName("title")
				.setDescription("what is the poll for")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("options")
				.setDescription("seperate options with a comma (virgule)")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("description")
				.setDescription("optional description on the poll")
				.setRequired(false)
		),
	execute: async (interaction) => {
		try {
			const title = interaction.options.getString("title");
			const options = interaction.options.getString("options");
			const description = interaction.options.getString("description");

			//validation of input
			if (!title.length || !options.length)
				return interaction.reply({
					ephemeral: true,
					content:
						"🚫 Please make sure your title and options were correctly formatted.",
				});
			if (!options.includes(","))
				return interaction.reply({
					ephemeral: true,
					content: "🚫 You should have at least 2 options.",
				});

			//array of emojis used to poll voter opinion
			const reactionEmojisArr = [
				"1️⃣",
				"2️⃣",
				"3️⃣",
				"4️⃣",
				"5️⃣",
				"6️⃣",
				"7️⃣",
				"8️⃣",
				"9️⃣",
				"0️⃣",
			];

			//list of sanitized options
			const optionsList = options
				.split(",")
				.map((option) => capitalize(option.trim()));

			//one more validator
			if (optionsList.length > 10)
				return interaction.reply({
					ephemeral: true,
					content: `🚫 can't handle more than 10 options.`,
				});

			const pollEmbed = new EmbedBuilder()
				.setTitle(`📊	${title}`)
				.setColor(process.env.COLOR_THEME)
				.setAuthor({
					name: interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL(),
				});

			//set description if there's one sisnce its optional
			if (description) pollEmbed.setDescription(description);

			//options
			for (const [index, option] of optionsList.entries()) {
				pollEmbed.addFields({
					name: `\u200b`,
					value: `${reactionEmojisArr[index]}		**${option}**`,
				});
			}

			// A sort of footer
			pollEmbed.addFields({
				name: `\u200b`,
				value: `React below to let us know what you think!`,
			});

			// should keep the reply object so the bot can initliaze the reactions
			const reply = await interaction.reply({
				embeds: [pollEmbed],
				fetchReply: true,
			});

			// initliaze reactions from bot
			for (const [index, option] of optionsList.entries()) {
				reply.react(reactionEmojisArr[index]);
			}
		} catch (err) {
			logger.error(err);
		}
	},
};
