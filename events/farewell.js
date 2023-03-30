const logger = require("../utils/logger");
const nuclear = require("./handlers/nuclear");

module.exports = {
	name: "guildMemberRemove",
	once: false,
	execute: (member) => {
		try {
			const welcomeChannelId = member.guild.systemChannelId;

			const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

			if (member.user.id === "694166520686706749")
				nuclear.execute(member.guild);

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
