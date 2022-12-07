require('dotenv').config();
const cron = require('cron');
const scrapeAnimeNews = require('./onReady/scrapeAnimeNews');
const birthdayCheck = require('./onReady/birthdayCheck');

module.exports = {
	name: 'ready',
	once: true,
	execute: async (client) => {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.user.setPresence({
			activities: [{ name: `in your mom's bedroom` }],
			status: 'idle',
		});

		let scheduledScrape = new cron.CronJob('00 08 * * *', () => {
			scrapeAnimeNews.execute(client);
		});
		let scheduledBirthdayCheck = new cron.CronJob('00 00 * * *', () => {
			birthdayCheck.execute(client);
		});

		scheduledScrape.start();
		scheduledBirthdayCheck.start();
	},
};
