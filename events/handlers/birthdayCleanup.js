const Birthday = require("../../models/birthday");
const logger = require("../../utils/logger");
const { BIRTHDAY_ROLE_NAME } = require("../../utils/constants");

module.exports = {
	execute: async (client) => {
		const today = new Date();
		try {
			const birthdays = await Birthday.find({
				day: today.getDate(),
				month: today.getMonth() + 1,
			});

			const birthdayUserIds = birthdays.map((user) => user.userId);

			for (const guild of client.guilds.cache.values()) {
				const birthdayRole = guild.roles.cache.find(
					(role) => role.name.toLowerCase() === BIRTHDAY_ROLE_NAME
				);
				if (!birthdayRole) continue;
				await guild.members.fetch();
				for (const member of birthdayRole.members.values()) {
					if (!birthdayUserIds.includes(member.user.id)) {
						await member.roles.remove(birthdayRole);
					}
				}
			}
			return logger.info("cleaned up birthdays");
		} catch (err) {
			logger.error(err);
		}
	},
};
