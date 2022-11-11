const { ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const movie = require("../models/movie.js");
const Movie = require('../models/movie.js');


module.exports = {
	data : new SlashCommandBuilder()
	.setName('movie')
	.setDescription('Commands for handling custom movie database')
	.addSubcommand(subcommand => subcommand
		.setName('add')
		.setDescription('Add a movie to the collection of this servers movies')
		.addStringOption(option=>
			option.setName('title')
				.setDescription('Name of the movie')
				.setRequired(true)
			))
	.addSubcommand(subcommand => subcommand
		.setName('randomize')
		.setDescription('Choose a none reviewed movie at random')
		.addStringOption(option=>
			option.setName('title')
				.setDescription('Name of the movie')
				.setRequired(true)
			))
	.addSubcommand(subcommand => subcommand
		.setName('rating')
		.setDescription('get the collective rating of a movie.')
		.addStringOption(option=>
			option.setName('title')
				.setDescription('Name of the movie')
				.setRequired(true)
			))
	.addSubcommand(subcommand => subcommand
		.setName('review')
		.setDescription('Review one of the movies in the collection')
		.addStringOption(option=>
			option.setName('title')
				.setDescription('Name of the movie')
				.setRequired(true)
			)
		.addNumberOption(option=>
			option.setName('rating')
				.setDescription('Rating out of 10 of the movie')
				.setRequired(true)
			))
	.addSubcommand(subcommand => subcommand
		.setName('list')
		.setDescription('list all movies registered')
			)
	,
	execute : async (interaction) => {

		if (interaction.options.getSubcommand() === 'add')
		{
			let movieTitle = interaction.options.getString('title').trim().toLowerCase();

			// unifying movie name by capitlazing
			movieTitle = movieTitle.split(" ");
			for (var i = 0; i < movieTitle.length; i++) {
				movieTitle[i] = movieTitle[i].charAt(0).toUpperCase() + movieTitle[i].slice(1);
			}
			movieTitle = movieTitle.join(" ");
	
			if (movieTitle.length === 0)
				return interaction.reply({ content : "🚫 Movie title can't be empty.", ephemeral : true });
			try {
				const movieExists = await Movie.findOne({title : movieTitle});
				
				if (movieExists)
					return interaction.reply({ content : '🚫 Movie already exists.', ephemeral : true })
				else 
				{
					const newMovie = new Movie({
						title : movieTitle,
						review : null,
						raters : [],
					})
					await newMovie.save();
	
					return await interaction.reply(`**${movieTitle}** is now stored.`);
				}
			} catch(err)
			{
				console.log(err)
				return await interaction.reply('command failed');
			}
		}
		else if (interaction.options.getSubcommand() === 'randomize')
		{
			try {
				const arrOfMovies = await Movie.find({});
				console.log(arrOfMovies);
	
				const unreviewMovies = arrOfMovies.filter(movie => movie.review === null);
				console.log(unreviewMovies);
	
				if (unreviewMovies.length !== 0)
				{
					const chosenMovie = unreviewMovies[Math.floor(Math.random() * unreviewMovies.length)];
	
					return await interaction.reply(`Randomly Chosen Movie is **${chosenMovie.title}**.`);
				}
				else
					return await interaction.reply(`All movies registered are already reviewed or no movies are registered yet.`);
			} catch(err)
			{
				console.log(err)
				return await interaction.reply('command failed');
			}
		}
		else if (interaction.options.getSubcommand() === 'rating')
		{
			let movieTitle = interaction.options.getString('title').trim().toLowerCase();
			const userRating = interaction.options.getNumber('rating');
	
			// unifying movie name by capitlazing
			movieTitle = movieTitle.split(" ");
			for (var i = 0; i < movieTitle.length; i++) {
				movieTitle[i] = movieTitle[i].charAt(0).toUpperCase() + movieTitle[i].slice(1);
			}
			movieTitle = movieTitle.join(" ");
	
			if (movieTitle.length === 0)
				return await interaction.reply({ content : "🚫 Movie title can't be empty", ephemeral : true });
			try {
				const movie = await Movie.findOne({title : movieTitle})
				
				console.log(movie);
				if (movie === null)
					return await interaction.reply({ content : "🚫 Movie dosen't exist", ephemeral : true })
				else 
				{
					if (movie.review === null)
						return await interaction.reply(`${movieTitle} is still not reviewed.`);
					else
						return await interaction.reply(`**${movieTitle}** was rated for **${movie.review.toFixed(1)}/10**.`);
				}
			} catch(err){
				console.log(err)
				return await interaction.reply('command failed');
			}
		}
		else if (interaction.options.getSubcommand() === 'review')
		{
			let movieTitle = interaction.options.getString('title').trim().toLowerCase();
			const userRating = interaction.options.getNumber('rating');
	
			// unifying movie name by capitlazing
			movieTitle = movieTitle.split(" ");
			for (var i = 0; i < movieTitle.length; i++) {
				movieTitle[i] = movieTitle[i].charAt(0).toUpperCase() + movieTitle[i].slice(1);
			}
			movieTitle = movieTitle.join(" ");
	
			if (movieTitle.length === 0)
				return await interaction.reply({ content : "🚫 Movie title can't be empty", ephemeral : true });
			else if (userRating > 10 || userRating < 0)
				return await interaction.reply({ content : "🚫 Rating must be positive and lower than 10", ephemeral : true });
			try {
				const movie = await Movie.findOne({title : movieTitle})
				
				if (!movie)
					return await interaction.reply({ content : "🚫 Movie isn't registerd", ephemeral : true })
				else 
				{
					const rater = movie.raters.filter(object => object.user === interaction.user.id)
					
					console.log(rater)
					if (rater.length > 0)
					{
						movie.raters = movie.raters.filter(object => object.user !== interaction.user.id)
						movie.raters.push({user : interaction.user.id, rating : userRating});
						const ratings = movie.raters.map(object => object.rating);
						movie.review = ratings.reduce((previousValue, currentValue) => previousValue + currentValue, 0) / ratings.length;
						await Movie.findOneAndUpdate({_id : movie._id.toString()}, movie);
						return await interaction.reply(
							{ content : `${interaction.user.username} re-reviewed **${movieTitle}** from **${rater[0].rating.toFixed(1)}/10** to **${userRating.toFixed(1)}/10**` });
					}
	
					if (movie.review === null)
						movie.review = userRating;
					else
						movie.review = (movie.review + userRating) / 2;
					movie.raters.push({user : interaction.user.id, rating : userRating});
	
					await Movie.findOneAndUpdate({_id : movie._id.toString()}, movie);
					return await interaction.reply(`${interaction.user.username} rated **${movieTitle}** : **${userRating.toFixed(1)}/10**`);
				}
			} catch(err)
			{
				console.log(err)
				return await interaction.reply('command failed');
			}
		}
		else if (interaction.options.getSubcommand() === 'list')
		{
			const embeds = [];
			const pages = {};
			let pageItemCount = 0;

			let movies = await Movie.find({});

			if (movies.length === 0)
				return await interaction.reply({content : '🚫 No movies have been registered yet', ephemeral : true})
			while (movies.length > 0)
			{
				const embed = new EmbedBuilder();
				while (pageItemCount < 10 && movies.length > 0)
				{
					embed
					.setTitle(`Page ${embeds.length+1}`)
					.addFields(
						{ name: `${movies[movies.length - 1].title}`, value: `${movies[movies.length - 1].review === null ? 'Unseen' : `${movies[movies.length - 1].review.toFixed(1)}/10`}`
						, inline: false },
					)
					movies.pop();
					pageItemCount++;
				}
				pageItemCount = 0;
				embeds.push(embed);
			}


			const getRow = (id) => {
				const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
					.setCustomId('prev-embed')
					.setEmoji('⏪')
					.setDisabled(pages[id] === 0)
					.setStyle(ButtonStyle.Primary)
				)

				.addComponents( 
					new ButtonBuilder()
					.setCustomId('next-embed')
					.setEmoji('⏩')
					.setDisabled(pages[id] === embeds.length - 1)
					.setStyle(ButtonStyle.Primary)
				)

				return row;
			}

			const id = interaction.user.id;
			pages[id] = pages[id] || 0;
			const embed = embeds[pages[id]];
	
			const filter = i => i.user.id === interaction.user.id;
	
			await interaction.reply({
				ephemeral : true,
				embeds : [embed],
				components : [getRow(id)]
			})

			let collector = interaction.channel.createMessageComponentCollector({ filter, time: 1000 * 60 * 2 });

			collector.on('collect', async (btnInt) => {
				if (!btnInt)
					return ;
				
				btnInt.deferUpdate();
				if (btnInt.customId !== 'prev-embed' && btnInt.customId !== 'next-embed')
					return ;
				if (btnInt.customId === 'prev-embed' && pages[id] > 0)
					--pages[id];
				if (btnInt.customId === 'next-embed' && pages[id] < embeds.length - 1)
					++pages[id];
				
				await interaction.editReply({
					embeds : [embeds[pages[id]]],
					components : [getRow(id)]
				})
			})
		}
		else
			return await interaction.reply({ content : `🚫 this command does 0.`, ephemeral : true });
	} 
}