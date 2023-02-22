const {
	ActionRowBuilder,
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");
const Birthday = require("../models/birthday");
const logger = require("../utils/logger");

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
					{ day, month },
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
			if (memberBirthday === null) {
				return interaction.reply({
					content: `🚫 No birthday is set to this member.`,
				});
			}
			try {
				const memberBirthday = await Birthday.findOne({ userId: user.id });
				return interaction.reply({
					content: `**${user.username}**'s birthday is ${formatDate(
						memberBirthday.day
					)}/${formatDate(memberBirthday.month)}.`,
				});
			} catch (err) {
				logger.error(subCommand, err);
				return interaction.reply(
					"there was an issue completing this command contact me3za"
				);
			}
		} else if (interaction.options.getSubcommand() === "list") {
			try {
				await interaction.deferReply({
					ephemeral: true,
				});
				const embeds = [];
				const pages = {};
				let pageItemCount = 0;

				let birthdays = await Birthday.find({});

				birthdays = birthdays.sort(
					(first, second) =>
						first.month * 100 + first.day - second.month * 100 + second.day
				);
				if (birthdays.length === 0)
					return interaction.editReply({
						content: "🚫 No birthdays have been registered yet",
					});

				while (birthdays.length > 0) {
					const embed = new EmbedBuilder();

					while (pageItemCount < 10 && birthdays.length > 0) {
						try {
							const member = await interaction.guild.members.fetch(
								birthdays[birthdays.length - 1].userId
							);
							username = member.user.username;
							embed.setTitle(`Page ${embeds.length + 1}`).addFields({
								name: `**${username}**`,
								value: `${formatDate(
									birthdays[birthdays.length - 1].day,
									birthdays[birthdays.length - 1].month
								)}`,
								inline: false,
							});
						} catch (err) {
							/* it's okay to not log or do anything about this exception beacuse it only notifies us of the user
							not being a member of the calling guild*/
						}

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
								.setCustomId("prev-embed")
								.setEmoji("⏪")
								.setDisabled(pages[id] === 0)
								.setStyle(ButtonStyle.Primary)
						)

						.addComponents(
							new ButtonBuilder()
								.setCustomId("next-embed")
								.setEmoji("⏩")
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

				collector.on("collect", async (btnInt) => {
					if (!btnInt) return;

					btnInt.deferUpdate();
					if (
						btnInt.customId !== "prev-embed" &&
						btnInt.customId !== "next-embed"
					)
						return;
					if (btnInt.customId === "prev-embed" && pages[id] > 0) --pages[id];
					if (btnInt.customId === "next-embed" && pages[id] < embeds.length - 1)
						++pages[id];

					interaction.editReply({
						embeds: [embeds[pages[id]]],
						components: [getRow(id)],
					});
				});
			} catch (err) {
				logger.error(err);
				return interaction.editReply(
					"Command failed :( please report the the command and your input me3za#4854 please."
				);
			}
		} else {
			return interaction.reply({
				content: `🚫 this command doesn't exist.`,
				ephemeral: true,
			});
		}
	},
};
