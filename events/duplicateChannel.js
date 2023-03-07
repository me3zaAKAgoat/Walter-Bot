const logger = require("../utils/logger");
const Channel = require("../models/channel");

const cloneChannels = new Set();

module.exports = {
	name: "voiceStateUpdate",
	once: false,
	execute: async (oldState, newState) => {
		if (!oldState.channelId && newState.channelId) {
			// User has joined a voice channel
			const voiceChannel = newState.channel;

			try {
				const isMonitored = await Channel.findOne({
					channelId: voiceChannel.id,
				});
				if (isMonitored) {
					const cloneChannel = await voiceChannel.clone({
						name: `${newState.channel.name} ${newState.member.displayName}`,
					});
					cloneChannels.add(cloneChannel.id);

					newState.setChannel(cloneChannel);
				}
			} catch (err) {
				logger.error(err);
			}
		} else if (oldState.channelId && !newState.channelId) {
			if (cloneChannels.has(oldState.channel.id)) {
				const cloneChannel = oldState.channel;
				if (cloneChannel.members.size === 0) {
					try {
						cloneChannel.delete();
						cloneChannels.delete(cloneChannel.id);
					} catch (err) {
						logger.error(err);
					}
				}
			}
		}
	},
};
