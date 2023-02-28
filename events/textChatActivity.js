const Activity = require("../models/activity");
const logger = require("../utils/logger");

module.exports = {
	name: "messageCreate",
	once: false,
	execute: async (message) => {
		if (message.author.bot) return;
		try {
			await Activity.findOneAndUpdate(
				{ memberId: message.author.id },
				{
					$inc: { messageCount: 1 },
					$setOnInsert: {
						memberId: message.author.id,
					},
				},
				{ upsert: true }
			);
		} catch (err) {
			logger.error(err);
		}
	},
};
