const role = require('../models/role');

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	execute: (member) => {
		try {
			const welcomeChannleId = member.guild.systemChannelId;
			let baseRole;

			baseRole = member.guild.roles.cache.find(
				(role) => role.name.toLowerCase() === 'member'
			);
			if (!baseRole) {
				console.log('didnt find member role');
				member.guild.roles
					.create({
						name: 'member',
						color: [255, 0, 255],
						reason: 'needed base member role',
					})
					.then((role) => member.roles.add(role))
					.catch((err) => console.log(err));
			} else member.roles.add(baseRole);

			const welcomeChannel = member.guild.channels.cache.get(welcomeChannleId);

			welcomeChannel.send(
				`Hello <@${member.id}> <a:peepoHi:1069612731189166140>\nWelcome to **${member.guild.name}**,\nFeel free to tell us a bit about yourself below this message,\nAnd enjoy your stay <a:miyanoHype:802396924874850325>`
			);
		} catch (err) {
			console.log(err);
		}
	},
};
