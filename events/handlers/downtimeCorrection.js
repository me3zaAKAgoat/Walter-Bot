const logger = require("../../utils/logger");
const roleUtils = require("../../utils/roleUtils");

module.exports = {
	execute: async (client) => {
		for (const guild of client.guilds.cache.values()) {
			try {
				await guild.members.fetch();
	
				const memberRole = guild.roles.cache.find(
					(role) => role.name.toLowerCase() === "member"
				);
	
				const botRole = guild.roles.cache.find(
					(role) => role.name.toLowerCase() === "bots"
				);
	
				for (const member of [...guild.members.cache.values()]) {
					if (member.user.bot) {
						// only assign a bot role
	
						if (!member.roles.cache.has(botRole?.id))
							await roleUtils.assignRole(
								member,
								botRole,
								"bots",
								[128, 128, 128]
							);
					} else {
						// assgin a base member role
	
						if (!member.roles.cache.has(memberRole?.id))
							await roleUtils.assignRole(
								member,
								memberRole,
								"member",
								[255, 0, 255]
							);
					}
				}
			}
			catch(err)
			{
				logger.error(err)
			}
		}
	},
};
