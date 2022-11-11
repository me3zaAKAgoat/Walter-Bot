require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const LatestScrape = require('../models/latestScrape');
const cron = require('cron');
const { findById } = require('../models/movie');

const appOnlyClient = new TwitterApi(process.env.TWT_BEARER_TOKEN);

module.exports = {
	name: 'ready',
	once: true,
	execute : async (client) => {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const scrapeTwitterNews = async () => {
			const newsChannelId = '1040725565235273808';
			const newsChannel = client.channels.cache.get(newsChannelId)
	
			const keywords = ['BREAKING', 'NEWS', 'ANNOUNCEMENT'];
			const latestScrapeQuery = await LatestScrape.find({});
			const latestScrape = latestScrapeQuery[0].latestScrape;
	
			if (!latestScrape || !(latestScrape instanceof Date))
			{
				console.log('couldnt collect latest scrape document')
				return ;
			}
		
			let currentFetches = 0; // two variables used to gate how many fetches for tweets will occur to prevent breaking rate limit
			const maximumFetches = 3;
		
			const user = await appOnlyClient.v2.userByUsername('Crunchyroll');
			const userId = user.data.id;
			const tweetsPage = await appOnlyClient.v2.userTimeline(userId, { exclude : 'replies', exclude : 'retweets', 'tweet.fields' : ['created_at']})
			
			let tweetsArr = tweetsPage.data.data;
			
			while (new Date(tweetsArr[tweetsArr.length - 1].created_at) > latestScrape && currentFetches < maximumFetches) // while the oldest fetched tweet is younger than my latest scrape
			{
				await tweetsPage.fetchNext();
				tweetsArr = tweetsPage.data.data;
				currentFetches++;
			}
	
			for (const tweet of tweetsArr)
			{		
				let found = false;
				for (const keyword of keywords)
				{
					found = tweet.text.toLowerCase().includes(keyword.toLowerCase());
					if (found)
					{
						console.log(tweet.text)
						newsChannel.send(`https://twitter.com/Crunchyroll/status/${tweet.id}`);
						console.log('message sent');
						break;
					}
					found = false;
				}
			}
			
			await LatestScrape.findByIdAndUpdate(latestScrapeQuery[0]._id.toString(), {
				latestScrape : new Date()
			})

		}

		let scheduledScrape = new cron.CronJob('00 06,18 * * *', scrapeTwitterNews)

		scheduledScrape.start();
	}
}