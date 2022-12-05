const Birthday = require('../../models/birthday');
const Channel = require('../../models/channel')

module.exports = {
	execute: async (client) => {
		try {
			const channelFetch = await Channel.findOne({ type: 'birthday' });
            const birthday
            
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
