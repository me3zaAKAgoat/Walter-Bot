const role = require('../models/role');

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	execute: (member) => {
		try {
			const welcomeChannleId = member.guild.systemChannelId;
			if (member.user.bot) {
				const botRole = member.guild.roles.cache.find(
					(role) => role.name.toLowerCase() === 'bots'
				);
				if (!botRole) {
					console.log('didnt find bot role');
					member.guild.roles
						.create({
							name: 'bots',
							color: [128, 128, 128],
							reason: 'needed base bot role',
						})
						.then((role) => member.roles.add(role))
						.catch((err) => console.log(err));
				} else member.roles.add(botRole);
			} else {
				const baseRole = member.guild.roles.cache.find(
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
			}

			const welcomeChannel = member.guild.channels.cache.get(welcomeChannleId);

			welcomeChannel.send(
				`Hello <@${member.id}> <a:peepoHi:1069612731189166140>\nWelcome to **${member.guild.name}**,\nFeel free to tell us a bit about yourself below this message,\nAnd enjoy your stay <a:miyanoHype:1069612575416922112>`
			);
		} catch (err) {
			console.log(err);
		}
	},
};
