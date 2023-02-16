const Activity = require("../models/activity");
const logger = require("../utils/logger");

module.exports = {
	name: "messageCreate",
	once: false,
	execute: async (message) => {
		if (message.author.bot) return;
		try {
			let activity = await Activity.findOne({ memberId: message.author.id });
			if (!activity) {
				activity = new Activity({
					messageCount: 1,
					timeVc: 0,
					memberId: message.author.id,
				});
			} else {
				activity.messageCount += 1;
			}
			await activity.save();
		} catch (err) {
			logger.error(err);
		}
	},
};
