require('dotenv').config();
const cron = require('cron');
const scrapeAnimeNews = require('./onReady/scrapeAnimeNews');

module.exports = {
	name: 'ready',
	once: true,
	execute: async (client) => {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		let scheduledScrape = new cron.CronJob('00 08 * * *', () => {
			scrapeAnimeNews.execute(client);
		});
		let scheduledBirthdayCheck = new cron.CronJob('10 00 * * *', () => {
			birthdayCheck.execute(client);
		});

		scheduledScrape.start();
		scheduledBirthdayCheck.start();
	},
};
