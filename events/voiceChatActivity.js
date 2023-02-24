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
			const timeInVoice = Math.round(
				Date.now() - voiceChannelUsers.get(oldState.id) / (60 * 1000) // translate milliseconds to minutes
			);
			try {
				await Activity.findOneAndUpdate(
					{ memberId: oldState.id },
					{
						$inc: { timeVc: timeInVoice },
						$setOnInsert: {
							messageCount: 0,
							memberId: oldState.id,
						},
					},
					{ upsert: true }
				);
				voiceChannelUsers.delete(oldState.id);
			} catch (err) {
				logger.error(err);
			}
		}
	},
};
