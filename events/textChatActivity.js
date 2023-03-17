const Activity = require("../models/activity");
const logger = require("../utils/logger");

module.exports = {
	name: "messageCreate",
	once: false,
	execute: async (message) => {
		if (message.author.bot) return;
		try {
			let activityDoc = await Activity.findOne({
				memberId: message.author.id,
			});
			if (!activityDoc) {
				activityDoc = new Activity({
					messageCount: 1,
					memberId: message.author.id,
				});
			} else {
				activityDoc.messageCount += 1;
			}
			await activityDoc.save();
		} catch (err) {
			logger.error(err);
		}
	},
};
