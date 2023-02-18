const roleUtils = require("../utils/roleUtils");
const logger = require("../utils/logger");

module.exports = {
	name: "guildMemberAdd",
	once: false,
	execute: async (member) => {
		/* check if the newly added user is a bot */

		if (member.user.bot) {
			// only assign a bot role

			const botRole = member.guild.roles.cache.find(
				(role) => role.name.toLowerCase() === "bots"
			);
			try {
				await roleUtils.assignRole(member, botRole, "bots", [128, 128, 128]);
			} catch (err) {
				logger.error(err);
			}
		} else {
			// assgin a base member role and send a welcome message
			const welcomeChannelId = member.guild.systemChannelId;
			const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

			const memberRole = member.guild.roles.cache.find(
				(role) => role.name.toLowerCase() === "member"
			);
			try {
				await roleUtils.assignRole(member, memberRole, "member", [255, 0, 255]);

				await welcomeChannel.send(
					`Hello <@${member.id}> <a:peepoHi:1069612731189166140>\nWelcome to **${member.guild.name}**,\nFeel free to tell us a bit about yourself below this message,\nAnd enjoy your stay <a:miyanoHype:1069612575416922112>`
				);
			} catch (error) {
				if (error instanceof DiscordAPIError) {
					if (error.message.includes("Missing Permissions")) {
						logger.error(
							`Failed to send welcome message to ${member.user.tag}. Make sure that if a member role and a bot role exist, that they are under the bot in role hierarchy .`
						);
					} else if (error.message.includes("Unknown Channel")) {
						logger.error(
							`Failed to send welcome message to ${member.user.tag}. The system channel is not found.`
						);
					}
				} else {
					logger.error(
						`Failed to execute the welcome message function for ${member.user.tag}. Reason: ${error.message}`
					);
				}
			}
		}
	},
};
