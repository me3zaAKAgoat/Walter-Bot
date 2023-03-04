const logger = require("../utils/logger");

module.exports = {
	name: "guildMemberRemove",
	once: false,
	execute: (member) => {
		try {
			const welcomeChannleId = member.guild.systemChannelId;

			const welcomeChannel = member.guild.channels.cache.get(welcomeChannleId);

			welcomeChannel.send(
				`**${member.user.username}** ${
					member.nickname !== null ? `aka **${member.nickname}** ` : ""
				}just left!`
			);
		} catch (err) {
			logger.error(err);
		}
	},
};
