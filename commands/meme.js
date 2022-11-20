const { SlashCommandBuilder } = require('discord.js');
const Jimp = require('jimp');
const process = require('process');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription(`makes a meme out of your input`)
		.addStringOption((option) =>
			option
				.setName('content')
				.setDescription('the text that fills the meme')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('type')
				.setDescription('Select animal for photo')
				.setRequired(true)
				.addChoices(
					{ name: 'when competition', value: 'squidward' },
					{ name: 'allo', value: 'wallace' },
					{ name: 'vibrator', value: 'vibrator' }
				)
		),

	execute: async (interaction) => {
		const type = interaction.options.getString('type');
		if (type === 'squidward') {
			try {
				const content = interaction.options.getString('content');
				await interaction.deferReply();
				if (content.length > 100) {
					return await interaction.editReply({
						content: '🚫 You have way too many characters to fit in this meme.',
						ephemeral: true,
					});
				}
				writeMeme(type, content)
					.then(async (meme) => {
						await interaction.editReply({ files: [meme] });
					})
					.catch((error) => console.log(error));
			} catch (err) {
				console.log(err);
			}
		} else if (type === 'wallace') {
			try {
				const content = interaction.options.getString('content');
				await interaction.deferReply();
				if (content.length > 100) {
					return await interaction.editReply({
						content: '🚫 You have way too many characters to fit in this meme.',
						ephemeral: true,
					});
				}
				writeMeme(type, content)
					.then(async (meme) => {
						await interaction.editReply({ files: [meme] });
					})
					.catch((error) => console.log(error));
			} catch (err) {
				console.log(err);
			}
		} else if (type === 'vibrator') {
			try {
				const content = interaction.options.getString('content');
				await interaction.deferReply();
				if (content.length > 100) {
					return await interaction.editReply({
						content: '🚫 You have way too many characters to fit in this meme.',
						ephemeral: true,
					});
				}
				writeMeme(type, content)
					.then(async (meme) => {
						await interaction.editReply({ files: [meme] });
					})
					.catch((error) => console.log(error));
			} catch (err) {
				console.log(err);
			}
		} else {
			try {
				await interaction.reply({
					ephemeral: true,
					content: 'This meme template does not exist',
				});
			} catch (err) {
				console.log(err);
			}
		}
	},
};

const writeMeme = async (type, content) => {
	let image = await Jimp.read(`${process.cwd()}/commands/memes/${type}.jpg`);

	let x = 1;
	let y = 4;
	let maxWidth = 400;
	let maxHeight = 100;
	let memeFont = Jimp.FONT_SANS_32_BLACK;
	if (type === 'vibrator') memeFont = Jimp.FONT_SANS_16_BLACK;
	if (type === 'wallace') {
		x = 2;
		y = 0;
		maxWidth = 300;
	}
	await Jimp.loadFont(memeFont)
		.then((font) => {
			image.print(
				font,
				x,
				y,
				{
					text: content,
					alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
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
