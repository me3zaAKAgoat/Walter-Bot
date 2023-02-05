require("dotenv").config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

const upvotesCount = 200;
const postsCount = 5000;
const subreddits = [
	"nsfw",
	"RealGirls",
	"hentai",
	"LegalTeens",
	"Rule34",
	"AsiansGoneWild",
	"goneWild",
	"pawg",
	"porn",
	"collegesluts",
	"cumsluts",
	"palegirls",
	"girlsinyogapants",
	"asstastic",
	"curvy",
	"thick",
	"redheads",
];

const getRandomNsfwPost = async (subreddit) => {
	const response = await axios.get(
		`https://www.reddit.com/r/${subreddit}/new.json?limit=${postsCount}`
	);
	const posts = response.data.data.children;

	// Filter the posts based on upvotes
	const highUpvotedPosts = posts.filter(
		(post) =>
			post.data.ups >= upvotesCount &&
			(post.data.url.endsWith(".png") || post.data.url.endsWith(".jpg"))
	);

	// Select a random post
	const randomIndex = Math.floor(Math.random() * highUpvotedPosts.length);
	const randomPost = highUpvotedPosts[randomIndex];

	return randomPost;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("nsfw")
		.setDescription("spits a random nsfw image scraped from reddit"),
	execute: async (interaction) => {
		if (!interaction.channel.nsfw)
			return interaction.reply({
				content: "🚫 you need to be in a NSFW channel to use this command",
				ephemeral: true,
			});
		try {
			await interaction.deferReply();

			let subreddit;
			let nsfwUrl;
			while (true) {
				subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

				const nsfwPost = await getRandomNsfwPost(subreddit);
				if (nsfwPost !== undefined) {
					nsfwUrl = nsfwPost.data.url;
					break;
				}
			}

			const nsfwEmbed = new EmbedBuilder()
				.setTitle(`__r/${subreddit}__`)
				.setColor("0xdb4bca")
				.setImage(nsfwUrl);
			return interaction.editReply({ embeds: [nsfwEmbed] });
		} catch (err) {
			console.error(err);
		}
	},
};
