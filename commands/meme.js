const { SlashCommandBuilder } = require("discord.js");
const Jimp = require("jimp");
const process = require("process");

const memeInfo = {
	squidward: {
		x: 1,
		y: 4,
	},
	wallace: {
		x: 20,
		y: 4,
	},
	vibrator: {
		x: 1,
		y: 4,
	},
	sirtat: {
		x: 20,
		y: 225,
	},
};

const writeMeme = async (type, content, x, y) => {
	const image = await Jimp.read(
		`${process.cwd()}/commands/content/memes/${type}.jpg`
	);

	const maxWidth = 400;
	const maxHeight = 100;
	const memeFont = Jimp.FONT_SANS_32_BLACK;

	const font = await Jimp.loadFont(memeFont);
	image.print(
		font,
		x,
		y,
		{
			text: content,
			alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
			alignmentY: Jimp.VERTICAL_ALIGN_TOP,
		},
		maxWidth,
		maxHeight
	);
	return image;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("meme")
		.setDescription("makes a meme out of your input")
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("Select animal for photo")
				.setRequired(true)
				.addChoices(
					{ name: "when Im in a competition", value: "squidward" },
					{ name: "allo o_o", value: "wallace" },
					{ name: "vibrator", value: "vibrator" },
					{ name: "sir tat... w 3ad aji", value: "sirtat" }
				)
		)
		.addStringOption((option) =>
			option
				.setName("text")
				.setDescription("the text that fills the meme")
				.setRequired(true)
		),
	execute: async (interaction) => {
		const type = interaction.options.getString("type");
		await interaction.deferReply();
		/* the following line checks wether the type that the user inputted does exist */
		if (!memeInfo[type]) {
			return interaction.editReply({
				ephemeral: true,
				content: "This meme template does not exist",
			});
		}

		/* the following line checks if the content would be too long to fit in a the meme template */

		const content = interaction.options.getString("text");
		if (content.length > 100) {
			return interaction.editReply({
				content: "🚫 You have way too many characters to fit in this meme.",
				ephemeral: true,
			});
		}

		/* the following try catch block writes to the template and then sends the file
		back to the interaction */

		try {
			const image = await writeMeme(
				type,
				content,
				memeInfo[type].x,
				memeInfo[type].y
			);
			const filePath = `${process.cwd()}/commands/content/memes/tmp/output.${image.getExtension()}`;
			image.write(filePath, async () => {
				return interaction.editReply({ files: [filePath] });
			});
		} catch (err) {
			console.error(err);
			return interaction.editReply({
				content: "an error occured in creating the meme",
			});
		}
	},
};
