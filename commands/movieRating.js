const { SlashCommandBuilder } = require("discord.js");
const Movie = require('../models/movie.js');


module.exports = {
	data : new SlashCommandBuilder()
	.setName('get-movie-rating')
	.setDescription('get the collective rating of a movie.')
	.addStringOption(option=>
		option.setName('title')
			.setDescription('Name of the movie')
			.setRequired(true)
			)
	,
	execute : async (interaction) => {
		await interaction.deferReply();
		let movieTitle = interaction.options.getString('title').trim().toLowerCase();
        const userRating = interaction.options.getNumber('rating');

        // unifying movie name by capitlazing
		movieTitle = movieTitle.split(" ");
		for (var i = 0; i < movieTitle.length; i++) {
			movieTitle[i] = movieTitle[i].charAt(0).toUpperCase() + movieTitle[i].slice(1);
		}
		movieTitle = movieTitle.join(" ");

		if (movieTitle.length === 0)
			return interaction.reply({ content : "🚫 Movie title can't be empty", ephemeral : true });
		try {
            const movie = await Movie.findOne({title : movieTitle})
			
			if (!movie)
				return interaction.reply({ content : "🚫 Movie dosen't exist", ephemeral : true })
			else 
			{
                if (movie.review === null)
                    return await interaction.reply(`${movieTitle} is still not reviewed.`);
                else
                    return await interaction.reply(`**${movieTitle}** was rated for **${movie.review.toFixed(1)}/10**.`);
			}
		} catch(err)
		{
			console.log(err)
			return await interaction.reply('command failed');
		}
	} 
}