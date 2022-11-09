const { SlashCommandBuilder } = require("discord.js");
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
		await interaction.deferReply()
		const movieTitle = interaction.options.getString('title').trim();
		if (movieTitle.length === 0)
			return interaction.editReply("Movie title can't be empty.");
		try {
			const movieExists = await Movie.findOne({title : movieTitle});
			
			if (movieExists)
				return interaction.editReply('Movie already exists.')
			else 
			{
				const newMovie = new Movie({
					title : movieTitle,
					review : null,
					raters : [],
				})
				await newMovie.save();

				return await interaction.editReply(`Registered The Movie **${movieTitle}**.`);
			}
		} catch(err)
		{
			console.log(err)
			return await interaction.editReply('command failed');
		}
	} 
}