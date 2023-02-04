const roleUtils = require("../utils/roleUtils");

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
			roleUtils.assignRole(member, botRole, "bots", [128, 128, 128]);
		} else {
			// assgin a base member role and send a welcome message

			const memberRole = member.guild.roles.cache.find(
				(role) => role.name.toLowerCase() === "member"
			);
			roleUtils.assignRole(member, memberRole, "member", [255, 0, 255]);
			const welcomeChannleId = member.guild.systemChannelId;
			try {
				const welcomeChannel =
					member.guild.channels.cache.get(welcomeChannleId);
				await welcomeChannel.send(
					`Hello <@${member.id}> <a:peepoHi:1069612731189166140>\nWelcome to **${member.guild.name}**,\nFeel free to tell us a bit about yourself below this message,\nAnd enjoy your stay <a:miyanoHype:1069612575416922112>`
				);
			} catch (err) {
				console.error("couldn't send welcome message", err);
				return;
			}
		}
	},
};
