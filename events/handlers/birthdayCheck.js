const Birthday = require("../../models/birthday");
const Channel = require("../../models/channel");
const roleUtils = require("../../utils/roleUtils");
const logger = require("../../utils/logger");
const { BIRTHDAY_ROLE_NAME } = require("../../utils/constants");

const birthdayMessage = (userId) =>
	`@everyone Today is <@${userId}>'s birthday <:birff:1218159718439194777>, don't forget to wish them a happy birthday <:hugg:1210799125470122014>, and as always our age is merely the number of years the world has been enjoying us! :D`;

module.exports = {
	execute: async (client) => {
		const currentDay = new Date().getDate();
		const currentMonth = new Date().getMonth() + 1;

		try {
			const birthdays = await Birthday.find({
				day: currentDay,
				month: currentMonth,
			});
			if (!birthdays.length) return;

			for (const guild of client.guilds.cache.values()) {
				const announcementChannelId = (
					await Channel.findOne({ channel: "birthday", guildId: guild.id })
				)?.channelId;

				if (!announcementChannelId) continue;

				const announcementChannel = client.channels.cache.get(
					announcementChannelId
				);
				if (!announcementChannel) continue;

				let birthdayRole = guild.roles.cache.find(
					(role) => role.name.toLowerCase() === BIRTHDAY_ROLE_NAME
				);

				for (const birthday of birthdays) {
					const member = guild.members.cache.get(birthday.userId);

					if (!member) continue;

					try {
						await announcementChannel.send(birthdayMessage(member.id));
					} catch (err) {
						logger.error(
							`Failed to send birthday message for ${member.id}: ${err}`
						);
					}

					birthdayRole = await roleUtils.assignRole(
						member,
						birthdayRole,
						BIRTHDAY_ROLE_NAME,
						[255, 31, 79]
					);

					// get the bot's highest role
					await guild.members.fetch();
					const botMember = guild.members.cache.get(client.user.id);
					const botRole = botMember.roles.highest;

					// raise the order of the birthday role
					const maxPosition = botRole.position - 1;
					if (birthdayRole.position < maxPosition) {
						await birthdayRole.setPosition(maxPosition);
					}
					// make the birhtday role visible
					if (!birthdayRole.hoist) await birthdayRole.setHoist(true);
				}
			}
			return logger.info("checked for birthdays");
		} catch (err) {
			logger.error(err);
		}
	},
};
