const Activity = require("../models/activity");

const voiceChannelUsers = new Map();

module.exports = {
	name: "voiceStateUpdate",
	once: false,
	execute: async (oldState, newState) => {
		const oldVoiceState = oldState.voice;
		const newVoiceState = newState.voice;

		if (!oldVoiceState.channelID && newVoiceState.channelID) {
			// User has joined a voice channel
			voiceChannelUsers.set(newState.id, Date.now());
		} else if (oldVoiceState.channelID && !newVoiceState.channelID) {
			// User has left a voice channel
			const timeInVoice = Date.now() - voiceChannelUsers.get(oldState.id);
			voiceChannelUsers.delete(oldState.id);
			try {
				let activity = await Activity.findOne({ memberId: oldState.id });
				if (!activity) {
					activity = new Activity({
						timeVc: timeInVoice,
						memberId: oldState.id,
					});
				} else {
					activity.timeVc += timeInVoice;
				}
				await activity.save();
			} catch (err) {
				console.error(err);
			}
		}
	},
};
