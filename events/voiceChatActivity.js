const Activity = require("../models/activity");
const logger = require("../utils/logger");

const voiceChannelUsers = new Map();

module.exports = {
	name: "voiceStateUpdate",
	once: false,
	execute: async (oldState, newState) => {
		if (oldState.member.user.bot || newState.member.user.bot) return;
	
		if (!oldState.channelId && newState.channelId) {
			// User has joined a voice channel
			voiceChannelUsers.set(newState.id, Date.now());
		} else if (oldState.channelId && !newState.channelId) {
			// User has left a voice channel

			// check if somehow the entrance to channel timestamp wasnt recorded
			if (voiceChannelUsers.get(oldState.id) === undefined) return;

			const timeInVoice = Math.floor(
				(Date.now() - voiceChannelUsers.get(oldState.id)) / (60 * 1000) // translate milliseconds to minutes
			);
			try {
				await Activity.findOneAndUpdate(
					{ userId: oldState.member.user.id, guildId: oldState.guild.id },
					{
						$inc: { vcTime: timeInVoice },
						$setOnInsert: {
							userId: oldState.member.user.id,
							guildId: oldState.guild.id,
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
