const { SlashCommandBuilder } = require("discord.js");
const movie = require("../models/movie.js");
const Movie = require('../models/movie.js');


module.exports = {
	data : new SlashCommandBuilder()
	.setName('add-movie')
	.setDescription('Add a movie to the collection of this servers movies')
	.addStringOption(option=>
		option.setName('title')
			.setDescription('Name of the movie')
			.setRequired(true)
			)
	,
	execute : async (interaction) => {
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
}