const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Birthday = require("../models/birthday");
const logger = require("../utils/logger");
const { paginate } = require("../utils/discordUtils");

const formatDate = (day, month) => `${padZero(day)}/${padZero(month)}`;

const padZero = (number) => (number >= 10 ? number : `0${number}`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("birthday")
		.setDescription(
			`birthday management command, if you troll you're insta timed out for 1 week :D`
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("add")
				.setDescription(`enter a member's birthdate`)
				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription("the user you want to denounce a birthday for")
						.setRequired(true)
				)
				.addNumberOption((option) =>
					option
						.setName("day")
						.setDescription("day from 1 to 31")
						.setRequired(true)
				)
				.addNumberOption((option) =>
					option
						.setName("month")
						.setDescription("month from 1 to 12")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("get")
				.setDescription(`get a members birthdate if it's registered`)
				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription("the user of which you want to see the birthday")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("list").setDescription(`lists member birhtdays`)
		),
	execute: async (interaction) => {
		if (interaction.options.getSubcommand() === "add") {
			const user = interaction.options.getUser("user");
			const day = interaction.options.getNumber("day");
			const month = interaction.options.getNumber("month");

			if (day < 1 || day > 31 || month < 1 || month > 12) {
				return interaction.reply({
					ephemeral: true,
					content: "🚫 in what universe does the date you inputted exist??",
				});
			}

			try {
				const upsertedBirthday = await Birthday.findOneAndUpdate(
					{ userId: user.id },
					{ day, month, $addToSet: { guildId: interaction.guildId } },
					{ upsert: true, new: true }
				);
				return interaction.reply({
					content: `**${user.username}**'s birthday was ${
						upsertedBirthday.isNew ? "set to" : "updated to"
					} ${formatDate(day, month)}.`,
				});
			} catch (err) {
				logger.error(subCommand, err);
				return interaction.reply(
					"there was an issue completing this command contact me3za"
				);
			}
		} else if (interaction.options.getSubcommand() === "get") {
			const user = interaction.options.getUser("user");

			try {
				const memberBirthday = await Birthday.findOne({ userId: user.id });
				if (memberBirthday === null) {
					return interaction.reply({
						content: `🚫 No birthday is set to this member.`,
					});
				}
				return interaction.reply({
					content: `**${user.username}**'s birthday is ${formatDate(
						memberBirthday.day,
						memberBirthday.month
					)}.`,
				});
			} catch (err) {
				logger.error(subCommand, err);
				return interaction.reply(
					"there was an issue completing this command contact me3za"
				);
			}
		} else if (interaction.options.getSubcommand() === "list") {
			await interaction.deferReply();

			const nonBotMembers = Array.from(
				(await interaction.guild.members.fetch()).values()
			).filter((member) => !member.user.bot);

			const userIds = nonBotMembers.map((member) => member.user.id);
			const birthdays = await Birthday.find({ userId: { $in: userIds } });

			if (birthdays.length === 0)
				return interaction.editReply({
					content: "🚫 No birthdays have been registered yet",
				});

			//sort birthdays
			birthdays.sort((a, b) => b.month * 100 + b.day - (a.month * 100 + a.day));

			const embedGenerator = (pageNum) =>
				new EmbedBuilder().setTitle(`**Page ${pageNum + 1}**`).setFooter({
					text: "(Only the caller of this command can switch pages !!)",
				});

			const items = birthdays.map((birthday) => {
				const member = nonBotMembers.find(
					(member) => member.user.id === birthday.userId
				);
				return {
					name: `${member.user.username}`,
					value: `<t:${
						new Date(
							new Date().getFullYear(),
							birthday.month - 1,
							birthday.day
						).getTime() / 1000
					}:d>`,
				};
			});

			await paginate(interaction, items, 10, embedGenerator);
		} else {
			return interaction.reply({
				content: `🚫 this command doesn't exist.`,
				ephemeral: true,
			});
		}
	},
};
