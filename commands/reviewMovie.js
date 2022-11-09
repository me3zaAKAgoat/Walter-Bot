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
		const movieTitle = interaction.options.getString('title').trim();
        const userRating = interaction.options.getNumber('rating');

		if (movieTitle.length === 0)
			return interaction.editReply("Movie title can't be empty");
        else if (userRating > 10 || userRating < 0)
            return interaction.editReply("Rating must be positive and lower than 10");
		try {
			const movieExists = await Movie.findOne({title : movieTitle});
			
			if (!movieExists)
				return interaction.editReply("Movie dosen't exist")
			else 
			{
                const movie = await Movie.findOne({title : movieTitle})

                if (movie.raters.includes(interaction.user.id, 0))
                    return await interaction.editReply(`**? can't review same movie twice you disgusting mongrel.**`);

                if (movie.review === null)
                    movie.review = userRating;
                else
                    movie.review = (movie.review + userRating)/2;
                movie.raters.push(interaction.user.id);

				await Movie.findOneAndUpdate({_id : movie._id.toString()}, movie);
				return await interaction.editReply(`Registered ${interaction.user.username}'s Review for **${movieTitle}**`);
			}
		} catch(err)
		{
			console.log(err)
			return await interaction.editReply('command failed');
		}
	} 
}