const Activity = require("../models/activity");

module.exports = {
	name: "message",
	once: false,
	execute: async (message) => {
		if (message.author.bot) return;
		try {
			let activity = await Activity.findOne({ memberId: message.author.id });
			if (!activity) {
				activity = new Activity({
					messageCount: 1,
					memberId: message.author.id,
				});
			} else {
				activity.messageCount += 1;
			}
			await activity.save();
		} catch (err) {
			console.error(err);
		}
	},
};
