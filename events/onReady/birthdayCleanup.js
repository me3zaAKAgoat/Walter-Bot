const Birthday = require("../../models/birthday");
const logger = require("../../utils/logger");

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
					(role) => role.name.toLowerCase() === "birthday"
				);
				if (!birthdayRole) continue;
				await guild.members.fetch();
				for (const member of birthdayRole.members.values()) {
					if (!birthdayUserIds.includes(member.user.id)) {
						await member.roles.remove(birthdayRole);
					}
				}
			}
		} catch (err) {
			logger.error(err);
		}
	},
};
