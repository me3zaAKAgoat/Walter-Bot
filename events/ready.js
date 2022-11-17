require('dotenv').config();
const cron = require('cron');
const scrapeAnimeNews = require('./onReady/scrapeAnimeNews');

module.exports = {
	name: 'ready',
	once: true,
	execute: async (client) => {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		let scheduledScrape = new cron.CronJob('00 06,18,12,00 * * *', (client) =>
			scrapeAnimeNews.execute(client)
		);

		scheduledScrape.start();
	},
};
