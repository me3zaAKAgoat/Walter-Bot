const { TwitterApi } = require('twitter-api-v2');
const LatestScrape = require('../../models/latestScrape');
const Twitterclient = new TwitterApi(process.env.TWT_BEARER_TOKEN);
const Role = require('../../models/role');
const Channel = require('../../models/channel');

module.exports = {
	execute: async (client) => {
		try {
			let newLatestScrape = new Date();
			let newsChannel;
			let roleTag;
			const newsChannelFetch = await Channel.findOne({ type: 'anime' });
			if (newsChannelFetch === null) {
				console.log('configure channel id');
				return;
			} else {
				newsChannelId = newsChannelFetch.id;
				newsChannel = client.channels.cache.get(newsChannelId);
			}

			const roleFetch = await Role.findOne({ type: 'anime' });
			if (roleFetch === null) {
				console.log('configure role tag');
				return;
			} else {
				roleTag = roleFetch.tag;
			}

			const keywords = ['BREAKING', 'NEWS', 'ANNOUNCEMENT'];
			const wordsNegateLikeCount = [
				'blue lock',
				'boku no hero',
				'bleach',
				'spy x family',
				'spyxfamily',
			];
			const latestScrapeQuery = await LatestScrape.find({});
			const latestScrape = latestScrapeQuery[0].latestScrape;

			if (!latestScrape || !(latestScrape instanceof Date)) {
				console.log('couldnt collect latest scrape document');
				return;
			}

			let currentFetches = 0; // two variables used to gate how many fetches for tweets will occur to prevent breaking rate limit
			const maximumFetches = 3;

			const accountName = 'Crunchyroll';
			const user = await Twitterclient.v2.userByUsername(accountName);
			const userId = user.data.id;
			const tweetsPage = await Twitterclient.v2.userTimeline(userId, {
				exclude: 'replies',
				exclude: 'retweets',
				'tweet.fields': ['created_at', 'public_metrics'],
			});

			let tweetsArr = tweetsPage.data.data;
			if (tweetsArr.length == 0) {
				console.log('no tweets were fetched');
				return;
			}
			while (
				convertTimezone(
					tweetsArr[tweetsArr.length - 1].created_at,
					'Africa/Casablanca'
				) > latestScrape &&
				currentFetches < maximumFetches
			) {
				// while the oldest fetched tweet is younger than my latest scrape
				await tweetsPage.fetchNext();
				tweetsArr = tweetsPage.data.data;
				currentFetches++;
			}

			tweetsArr = tweetsArr.filter(
				(tweet) =>
					convertTimezone(tweet.created_at, 'Africa/Casablanca') > latestScrape
			);

			tweetsArr.reverse();
			/* check wether tweets meet the criteria of like count or importance
			and the existence of the specified keywords and no self advertisement
			*/

			for (const tweet of tweetsArr) {
				let foundKeyword = false;
				let selfAdvert = false;
				let important = false;
				for (const keyword of keywords) {
					foundKeyword = tweet.text
						.toLowerCase()
						.includes(keyword.toLowerCase());
					selfAdvert = tweet.text
						.toLowerCase()
						.includes(accountName.toLowerCase());
					for (const importantWord of wordsNegateLikeCount) {
						important = tweet.text.toLowerCase().includes(importantWord);
						if (important) break;
					}
					if (
						foundKeyword &&
						!selfAdvert &&
						(tweet.public_metrics.like_count >= 4000 || important)
					) {
						newsChannel.send(`${roleTag}`);
						newsChannel.send(
							`https://twitter.com/Crunchyroll/status/${tweet.id}`
						);
						break;
					}
					foundKeyword = false;
					selfAdvert = false;
					important = false;
				}
			}

			await LatestScrape.findByIdAndUpdate(
				latestScrapeQuery[0]._id.toString(),
				{
					latestScrape: newLatestScrape,
				}
			);
			console.log('no exceptions found in scraping anime news');
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
