module.exports = {
	name: 'guildMemberAdd',
	once: false,
	execute: (member) => {
		try {
			const welcomeChannleId = member.guild.systemChannelId;

			let memberRole = member.guild.roles.cache.find(
				(role) => role.name.toLowerCase() === 'member'
			);

			const welcomeChannel = member.guild.channels.cache.get(welcomeChannleId);

			member.roles.add(memberRole);

			welcomeChannel.send(
				`Hello <@${member.id}>,\nWelcome to **${member.guild.name}**,\nFeel free to tell us a bit about yourself below this message,\nAnd enjoy your stay 😄`
			);
		} catch (err) {
			console.log(err);
		}
	},
};
