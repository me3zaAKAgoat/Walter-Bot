const Activity = require("../models/activity");
const logger = require("../utils/logger");

module.exports = {
	name: "messageCreate",
	once: false,
	execute: async (message) => {
		if (message.author.bot) return;
		try {
			await Activity.findOneAndUpdate(
				{ userId: message.member.user.id, guildId: message.guildId },
				{
					$inc: { messageCount: 1 },
					$setOnInsert: {
						userId: message.member.user.id,
						guildId: message.guildId,
					},
				},
				{ upsert: true }
			);
		} catch (err) {
			logger.error(err);
		}
	},
};
