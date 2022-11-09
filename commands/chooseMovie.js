const { SlashCommandBuilder } = require("discord.js");
const Movie = require('../models/movie.js');


module.exports = {
	data : new SlashCommandBuilder()
	.setName('randomize-movie')
	.setDescription('Choose a none reviewed movie at random')
	,
	execute : async (interaction) => {
		await interaction.deferReply();

		try {
			const arrOfMovies = await Movie.find({});
			console.log(arrOfMovies);

			const unreviewMovies = arrOfMovies.filter(movie => movie.review === null);
			console.log(unreviewMovies);

			if (unreviewMovies.length !== 0)
			{
				const chosenMovie = unreviewMovies[Math.floor(Math.random() * unreviewMovies.length)];

				return await interaction.editReply(`Randomly Chosen Movie is **${chosenMovie.title}**.`);
			}
			else
				return await interaction.editReply(`All movies registered are already reviewed or no movies are registered yet.`);
		} catch(err)
		{
			console.log(err)
			return await interaction.editReply('command failed');
		}
	} 
}