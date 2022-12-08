const { SlashCommandBuilder } = require('discord.js');
const Jimp = require('jimp');
const process = require('process');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription(`makes a meme out of your input`)
		.addStringOption((option) =>
			option
				.setName('type')
				.setDescription('Select animal for photo')
				.setRequired(true)
				.addChoices(
					{ name: 'when Im in a competition', value: 'squidward' },
					{ name: 'allo o_o', value: 'wallace' },
					{ name: 'vibrator', value: 'vibrator' },
					{ name: 'sir tat... w 3ad aji', value: 'sirtat' }
					// { name: 'temptation button', value: 'trynotto' }
				)
		)
		.addStringOption((option) =>
			option
				.setName('text')
				.setDescription('the text that fills the meme')
				.setRequired(true)
		),
	execute: async (interaction) => {
		try {
			const type = interaction.options.getString('type');
			await interaction.deferReply();
			if (type === 'squidward') {
				const content = interaction.options.getString('content');
				if (content.length > 100) {
					return await interaction.editReply({
						content: '🚫 You have way too many characters to fit in this meme.',
						ephemeral: true,
					});
				}
				writeMeme(type, content, 1, 4)
					.then(async (meme) => {
						await interaction.editReply({ files: [meme] });
					})
					.catch((error) => console.log(error));
			} else if (type === 'wallace') {
				const content = interaction.options.getString('content');
				if (content.length > 100) {
					return await interaction.editReply({
						content: '🚫 You have way too many characters to fit in this meme.',
						ephemeral: true,
					});
				}
				writeMeme(type, content, 20, 4)
					.then(async (meme) => {
						await interaction.editReply({ files: [meme] });
					})
					.catch((error) => console.log(error));
			} else if (type === 'vibrator') {
				const content = interaction.options.getString('content');
				if (content.length > 100) {
					return await interaction.editReply({
						content: '🚫 You have way too many characters to fit in this meme.',
						ephemeral: true,
					});
				}
				writeMeme(type, content, 1, 4)
					.then(async (meme) => {
						await interaction.editReply({ files: [meme] });
					})
					.catch((error) => console.log(error));
			} else if (type === 'sirtat') {
				const content = interaction.options.getString('content');
				if (content.length > 100) {
					return await interaction.editReply({
						content: '🚫 You have way too many characters to fit in this meme.',
						ephemeral: true,
					});
				}
				writeMeme(type, content, 20, 225)
					.then(async (meme) => {
						await interaction.editReply({ files: [meme] });
					})
					.catch((error) => console.log(error));
			} else {
				await interaction.editReply({
					ephemeral: true,
					content: 'This meme template does not exist',
				});
			}
		} catch (err) {
			console.log(err);
		}
	},
};

const writeMeme = async (type, content, x, y) => {
	let image = await Jimp.read(`${process.cwd()}/commands/memes/${type}.jpg`);

	let maxWidth = 400;
	let maxHeight = 100;
	let memeFont = Jimp.FONT_SANS_32_BLACK;

	await Jimp.loadFont(memeFont)
		.then((font) => {
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
		})
		.then((image) => {
			let file = `${process.cwd()}/commands/memes/tmp/output.${image.getExtension()}`;
			return image.write(file); // save
		});
	return `${process.cwd()}/commands/memes/tmp/output.${image.getExtension()}`;
};
