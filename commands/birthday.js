const { SlashCommandBuilder } = require('discord.js');
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
