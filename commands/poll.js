require("dotenv").config();
const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("poll")
		.setDescription("create a poll")
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
			const pollTitle = interaction.options.getString("title");
			const optionsString = interaction.options.getString("options");
			const description = interaction.options.getString("description");
			if (!pollTitle.length || !optionsString.length)
				return interaction.reply({
					ephemeral: true,
					content:
						"🚫 Please make sure your title and options were correctly formatted.",
				});
			if (!optionsString.includes(","))
				return interaction.reply({
					ephemeral: true,
					content: "🚫 You should have at least 2 options.",
				});
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
			let optionsArr = optionsString.split(",").map((option) => option.trim());
			if (optionsArr.length > 10)
				return interaction.reply({
					ephemeral: true,
					content: `🚫 can't handle more than 10 options.`,
				});
			optionsArr = optionsArr.map(
				(option) => option.charAt(0).toUpperCase() + option.slice(1)
			);
			const pollEmbed = new EmbedBuilder().setTitle(`📊	${pollTitle}`);
			if (description) {
				pollEmbed.setDescription(description);
			}
			for (const [index, option] of optionsArr.entries()) {
				pollEmbed.addFields({
					name: `\u200b`,
					value: `${reactionEmojisArr[index]}	**${option}**`,
				});
			}
			pollEmbed.setFooter({
				text: `\u200b`,
			});
			const reply = await interaction.reply({
				embeds: [pollEmbed],
				fetchReply: true,
			});
			/* start the reactions for the users to choose from */
			for (const [index, option] of optionsArr.entries()) {
				reply.react(reactionEmojisArr[index]);
			}
			return;
		} catch (err) {
			console.error(err);
		}
	},
};
