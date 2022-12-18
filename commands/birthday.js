const {
	ActionRowBuilder,
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
const birthday = require('../models/birthday');
const Birthday = require('../models/birthday');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('birthday')
		.setDescription(
			`birthday management command, if you troll you're insta timed out for 1 week :D`
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription(`enter a member's birthdate`)
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('the user you want to denounce a birthday for')
						.setRequired(true)
				)
				.addNumberOption((option) =>
					option
						.setName('day')
						.setDescription('day from 1 to 31')
						.setRequired(true)
				)
				.addNumberOption((option) =>
					option
						.setName('month')
						.setDescription('month from 1 to 12')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('get')
				.setDescription(`get a members birthdate if it's registered`)
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('the user of which you want to see the birthday')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('list').setDescription(`lists member birhtdays`)
		),
	execute: async (interaction) => {
		try {
			if (interaction.options.getSubcommand() === 'add') {
				const user = interaction.options.getUser('user');
				const day = interaction.options.getNumber('day');
				const month = interaction.options.getNumber('month');

				if (day < 1 || day > 31 || month < 1 || month > 12) {
					return await interaction.reply({
						ephemeral: true,
						content: '🚫 in what universe does the date you inputted exist??',
					});
				}

				const updateResult = await Birthday.findOneAndUpdate(
					{
						userId: user.id,
					},
					{ day: day, month: month }
				);

				if (updateResult !== null) {
					return await interaction.reply({
						content: `**${user.username}**'s birthday was updated to ${
							day >= 10 ? day : `0${day}`
						}/${month >= 10 ? month : `0${month}`}.`,
					});
				}
				const newBirthday = new Birthday({
					userId: user.id,
					day: day,
					month: month,
				});

				await newBirthday.save();
				return await interaction.reply({
					content: `**${user.username}**'s birthday is set to ${
						day >= 10 ? day : `0${day}`
					}/${month >= 10 ? month : `0${month}`}.`,
				});
			} else if (interaction.options.getSubcommand() === 'get') {
				const user = interaction.options.getUser('user');
				const queryResult = await Birthday.findOne({ userId: user.id });
				if (queryResult === null) {
					return await interaction.reply({
						content: `🚫 No birthday is set to this member.`,
					});
				}

				return await interaction.reply({
					content: `**${user.username}**'s birthday is ${
						queryResult.day >= 10 ? queryResult.day : `0${queryResult.day}`
					}/${
						queryResult.month >= 10
							? queryResult.month
							: `0${queryResult.month}`
					}.`,
				});
			} else if (interaction.options.getSubcommand() === 'list') {
				try {
					await interaction.deferReply();
					const embeds = [];
					const pages = {};
					let pageItemCount = 0;

					let birthdays = await Birthday.find({});

					birthdays = birthdays.sort(
						(first, second) =>
							first.month * 100 + first.day - second.month * 100 + second.day
					);
					if (birthdays.length === 0)
						return await interaction.editReply({
							content: '🚫 No birthdays have been registered yet',
						});

					while (birthdays.length > 0) {
						const embed = new EmbedBuilder();
						while (pageItemCount < 10 && birthdays.length > 0) {
							const member = await interaction.guild.members.fetch(
								birthdays[birthdays.length - 1].userId
							);
							embed.setTitle(`Page ${embeds.length + 1}`).addFields({
								name: `**${
									member === undefined
										? 'No longer exists'
										: member.user.username
								}**`,
								value: `${
									birthdays[birthdays.length - 1].day >= 10
										? birthdays[birthdays.length - 1].day
										: `0${birthdays[birthdays.length - 1].day}`
								}/${
									birthdays[birthdays.length - 1].month >= 10
										? birthdays[birthdays.length - 1].month
										: `0${birthdays[birthdays.length - 1].month}`
								}`,
								inline: false,
							});
							birthdays.pop();
							pageItemCount++;
						}
						pageItemCount = 0;
						embeds.push(embed);
					}

					const getRow = (id) => {
						const row = new ActionRowBuilder()
							.addComponents(
								new ButtonBuilder()
									.setCustomId('prev-embed')
									.setEmoji('⏪')
									.setDisabled(pages[id] === 0)
									.setStyle(ButtonStyle.Primary)
							)

							.addComponents(
								new ButtonBuilder()
									.setCustomId('next-embed')
									.setEmoji('⏩')
									.setDisabled(pages[id] === embeds.length - 1)
									.setStyle(ButtonStyle.Primary)
							);

						return row;
					};

					const id = interaction.user.id;
					pages[id] = pages[id] || 0;
					const embed = embeds[pages[id]];

					const filter = (i) => i.user.id === interaction.user.id;

					interaction.editReply({
						embeds: [embed],
						components: [getRow(id)],
					});

					let collector = interaction.channel.createMessageComponentCollector({
						filter,
						time: 1000 * 60 * 10,
					});

					collector.on('collect', async (btnInt) => {
						if (!btnInt) return;

						btnInt.deferUpdate();
						if (
							btnInt.customId !== 'prev-embed' &&
							btnInt.customId !== 'next-embed'
						)
							return;
						if (btnInt.customId === 'prev-embed' && pages[id] > 0) --pages[id];
						if (
							btnInt.customId === 'next-embed' &&
							pages[id] < embeds.length - 1
						)
							++pages[id];

						interaction.editReply({
							embeds: [embeds[pages[id]]],
							components: [getRow(id)],
						});
					});
				} catch (err) {
					console.log(err);
					return await interaction.editReply(
						'Command failed :( please report the the command and your input me3za#4854 please.'
					);
				}
			} else {
				return await interaction.reply({
					content: `🚫 this command doesn't exist.`,
					ephemeral: true,
				});
			}
		} catch (err) {
			console.log(err);
		}
	},
};
