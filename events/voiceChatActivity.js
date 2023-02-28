const { time } = require("cron");
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
			if (oldState.id === undefined) return;
			const timeInVoice = Math.floor(
				(Date.now() - voiceChannelUsers.get(oldState.id)) / (60 * 1000) // translate milliseconds to minutes
			);
			try {
				await Activity.findOneAndUpdate(
					{ memberId: oldState.id },
					{
						$inc: { vcTime: timeInVoice },
						$setOnInsert: {
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
