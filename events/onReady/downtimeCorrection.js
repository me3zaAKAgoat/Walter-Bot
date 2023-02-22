const logger = require("../../utils/logger");
const roleUtils = require("../../utils/roleUtils");

module.exports = {
	execute: async (client) => {
		try {
			for (const guild of client.guilds.cache.values()) {
				await guild.members.fetch();

				for (const member of guild.members.cache.values()) {
					if (member.user.bot) {
						// only assign a bot role

						const botRole = member.guild.roles.cache.find(
							(role) => role.name.toLowerCase() === "bots"
						);
						await roleUtils.assignRole(
							member,
							botRole,
							"bots",
							[128, 128, 128]
						);
					} else {
						// assgin a base member role

						const memberRole = member.guild.roles.cache.find(
							(role) => role.name.toLowerCase() === "member"
						);
						await roleUtils.assignRole(
							member,
							memberRole,
							"member",
							[255, 0, 255]
						);
					}
				}
			}
		} catch (err) {
			logger.error(err);
		}
	},
};
