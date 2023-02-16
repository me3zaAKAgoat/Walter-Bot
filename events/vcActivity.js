const Activity = require("../models/activity");
const logger = require("../utils/logger");

const voiceChannelUsers = new Map();

module.exports = {
	name: "voiceStateUpdate",
	once: false,
	execute: async (oldState, newState) => {
		if (!oldState.channelId && newState.channelId) {
			// User has joined a voice channel
			voiceChannelUsers.set(newState.id, Date.now());
		} else if (oldState.channelId && !newState.channelId) {
			// User has left a voice channel
			const timeInVoice = Date.now() - voiceChannelUsers.get(oldState.id);
			try {
				let activity = await Activity.findOne({ memberId: oldState.id });
				if (!activity) {
					activity = new Activity({
						messageCount: 0,
						timeVc: timeInVoice,
						memberId: oldState.id,
					});
				} else {
					activity.timeVc += timeInVoice;
				}
				await activity.save();
				voiceChannelUsers.delete(oldState.id);
			} catch (err) {
				logger.error(err);
			}
		}
	},
};
