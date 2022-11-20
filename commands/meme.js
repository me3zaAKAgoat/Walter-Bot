const { SlashCommandBuilder } = require('discord.js');
const Jimp = require('jimp');
const fs = require('fs');
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
					{ name: 'allo', value: 'wallace' }
				)
		),
	execute: async (interaction) => {
		const type = interaction.options.getString('type');
		if (type === 'squidward') {
			try {
				const content = interaction.options.getString('content');
				await interaction.deferReply();
				if (content.length > 60) {
					return await interaction.editReply({
						content: '🚫 You have way too many characters to fit in this meme.',
						ephemeral: true,
					});
				}
				const wordsArr = content.split(' ');
				let sanitizedText = '';
				let lineLength = 0;
				const maxLength = 20;
				for (const word of wordsArr) {
					if (lineLength < maxLength) {
						sanitizedText += ' ' + word;
						lineLength += 1 + word.length;
					} else {
						sanitizedText += '\n' + word;
						lineLength = 0;
					}
				}
				console.log(sanitizedText);
				await writeToImage(sanitizedText, type).then(
					await interaction.channel.send({
						files: ['./commands/memes/tmp/output.jepg'],
					})
				);
				return await interaction.editReply('done');
			} catch (err) {
				console.log(err);
			}
		}
	},
};

const writeToImage = async (sanitizedText, type) => {
	const img = await Jimp.read(`${process.cwd()}/commands/memes/${type}.jpg`);

	Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
		.then((font) => {
			img.print(font, 22, 20, sanitizedText);
			return img;
		})
		.then((image) => {
			let file = `${process.cwd()}/commands/memes/tmp/output.${img.getExtension()}`;
			return image.write(file); // save
		});
};
