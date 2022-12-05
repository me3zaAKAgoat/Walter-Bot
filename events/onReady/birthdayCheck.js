const Birthday = require('../../models/birthday');
const Channel = require('../../models/channel');

module.exports = {
	execute: async (client) => {
		try {
			const channelFetch = await Channel.findOne({ type: 'birthday' });
			const bdAnnouncementChannel = client.channels.cache.get(channelFetch.id);
			const thisDay = new Date().getDate();
			const thisMonth = new Date().getMonth() + 1;
			const birthdaysQuery = await Birthday.find({
				day: thisDay,
				month: thisMonth,
			});

			for (const birthday of birthdaysQuery) {
				bdAnnouncementChannel.send(
					`@everyone
Today is <@${birthday.userId}>'s birthday 🥳, don't forget to wish them a happy birthday, and as always our age is merely the number of years the world has been enjoying us! :D`
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
