const { SlashCommandBuilder } = require("discord.js");
const Movie = require('../models/movie.js');


module.exports = {
	data : new SlashCommandBuilder()
	.setName('review-movie')
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
			return interaction.editReply({ content : "🚫 Movie title can't be empty", ephemeral : true });
        else if (userRating > 10 || userRating < 0)
            return interaction.editReply({ content : "🚫 Rating must be positive and lower than 10", ephemeral : true });
		try {
            const movie = await Movie.findOne({title : movieTitle})
			
			if (!movie)
				return interaction.editReply({ content : "🚫 Movie dosen't exist", ephemeral : true })
			else 
			{
                if (movie.raters.includes(interaction.user.id, 0))
                    return await interaction.editReply({ content : `🚫 You already rated this movie you ape.`, ephemeral : true });

                if (movie.review === null)
                    movie.review = userRating;
                else
                    movie.review = (movie.review + userRating)/2;
                movie.raters.push(interaction.user.id);

				await Movie.findOneAndUpdate({_id : movie._id.toString()}, movie);
				return await interaction.editReply(`${interaction.user.username} rated **${movieTitle}** : **${userRating}/10**`);
			}
		} catch(err)
		{
			console.log(err)
			return await interaction.editReply('command failed');
		}
	} 
}