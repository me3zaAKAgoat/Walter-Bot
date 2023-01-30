const Birthday = require('../../models/birthday');
const Channel = require('../../models/channel');

module.exports = {
	execute: async (client) => {
		try {
			const thisDay = new Date().getDate();
			const thisMonth = new Date().getMonth() + 1;
			const birthdaysQuery = await Birthday.find({
				day: thisDay,
				month: thisMonth,
			});

			const channelIdFetch = await Channel.findOne({ type: 'birthday' });
			const announcementChannel = client.channels.cache.get(channelIdFetch.id);
			const currentGuild = announcementChannel.guild;
			const highestBotRolePosition = currentGuild.me.roles.cache
				.sort((a, b) => b.position - a.position)
				.first().position;

			let birthdayRole;

			birthdayRole = currentGuild.roles.cache.find(
				(role) => role.name.toLowerCase() === 'birthday'
			);
			if (!birthdayRole) {
				currentGuild.roles
					.create({
						name: 'birthday',
						color: [255, 226, 59],
						reason: 'needed a birthday role role',
						position: highestBotRolePosition - 1,
					})
					.then((role) => {
						member.roles.add(role);
						console.log('didnt find birthday role so I created one');
					})
					.catch((err) => console.log(err));
			} else currentGuild.roles.add(birthdayRole);

			/* need to add cleanup to remove members of which the birthday is over */
			for (const birthday of birthdaysQuery) {
				announcementChannel.send(
					`@everyone
Today is <@${birthday.userId}>'s birthday 🥳, don't forget to wish them a happy birthday <a:miyanoHype:802396924874850325>, and as always our age is merely the number of years the world has been enjoying us! :D`
				);
			}
		} catch (err) {
			console.log(err);
		}
	},
};

const convertTimezone = (date, timezone) => {
	return new Date(
		(date instanceof String ? new Date(date) : date).toLocaleString(timezone)
	);
};
