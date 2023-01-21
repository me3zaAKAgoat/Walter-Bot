module.exports = {
	name: 'guildMemberAdd',
	once: false,
	execute: (member) => {
		try {
			const welcomeChannleId = member.guild.systemChannelId;
			let memberRole;

			try {
				memberRole = member.guild.roles.cache.find(
					(role) => role.name.toLowerCase() === 'member'
				);
			} catch {
				console.log('didnt find member role');
				member.guild.roles
					.create({
						name: 'member',
						color: [255, 0, 255],
						reason: 'needed base member role',
					})
					.then((role) => (memberRole = role))
					.catch((err) => console.log(err));
			}

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
