const {
	ActionRowBuilder,
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");
const stringUtils = require("../utils/stringUtils");
const Movie = require("../models/movie");

const checkUnreviewedMoviesCap = async (interaction, unreviewedMoviesCap) => {
	const userId = interaction.user.id;
	const unreviewedMoviesArr = await Movie.find({
		adderId: userId,
		review: null,
	});
	if (unreviewedMoviesArr.length > unreviewedMoviesCap) return -1;
	return 0;
};

const addMovie = async (interaction) => {
	// Constants
	const unreviewedMoviesCap = 10;
	const emptyTitleMessage = "🚫 Movie title can't be empty";
	const existingTitleMessage =
		"🚫 Movie with the same name already exists in the database.";
	const exceededCapMessage = `🚫 You have exceeded the ${unreviewedMoviesCap} unreviewed movies per person cap.`;
	const successMessage = (title) => `**${title}** is now stored.`;
	const errorMessage =
		"Command failed :( please report the the command and your input me3za#4854 please.";
	try {
		// Check unreviewed movies cap
		const checkResult = await checkUnreviewedMoviesCap(
			interaction,
			unreviewedMoviesCap
		);
		if (checkResult === -1)
			return interaction.reply({
				content: exceededCapMessage,
				ephemeral: true,
			});

		// Normalize movie title
		let movieTitle = interaction.options
			.getString("title")
			.trim()
			.toLowerCase();
		movieTitle = stringUtils.capitalize(movieTitle);
		if (!movieTitle)
			return interaction.reply({ content: emptyTitleMessage, ephemeral: true });

		// Check if movie title exists
		const movieExists = await Movie.findOne({ title: movieTitle });
		if (movieExists)
			return interaction.reply({
				content: existingTitleMessage,
				ephemeral: true,
			});

		// Create and save new movie
		const newMovie = new Movie({
			title: movieTitle,
			review: null,
			raters: [],
			adderId: interaction.user.id,
		});
		await newMovie.save();

		return interaction.reply(successMessage(movieTitle));
	} catch (err) {
		console.error(err);
		return interaction.reply(errorMessage);
	}
};

const randomizeMovie = async (interaction) => {
	try {
		const unreviewedMovies = await Movie.find({ review: { $exists: false } });

		if (!unreviewedMovies.length) {
			return interaction.reply(
				`All movies registered are already reviewed or no movies are registered yet.`
			);
		}
		const chosenMovie =
			unreviewMovies[Math.floor(Math.random() * unreviewMovies.length)];

		return interaction.reply(
			`Randomly Chosen Movie is **${chosenMovie.title}**.`
		);
	} catch (err) {
		console.error(err);
		return interaction.reply(
			"Command failed :( please report the the command and your input me3za#4854 please."
		);
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("movie")
		.setDescription("Commands for handling custom movie database")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("add")
				.setDescription("Add a movie to the collection of this servers movies")
				.addStringOption((option) =>
					option
						.setName("title")
						.setDescription("Name of the movie")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("randomize")
				.setDescription("Choose a none reviewed movie at random")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("rating")
				.setDescription("get the collective rating of a movie")
				.addStringOption((option) =>
					option
						.setName("title")
						.setDescription("Name of the movie")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("rate")
				.setDescription("Review one of the movies in the collection")
				.addStringOption((option) =>
					option
						.setName("title")
						.setDescription("Name of the movie")
						.setRequired(true)
				)
				.addNumberOption((option) =>
					option
						.setName("rating")
						.setDescription("Rating out of 10 of the movie")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("delete")
				.setDescription("delete a movie you added")
				.addStringOption((option) =>
					option
						.setName("title")
						.setDescription("Name of the movie")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("list").setDescription("list all movies registered")
		),
	execute: async (interaction) => {
		if (interaction.options.getSubcommand() === "add") {
			await addMovie(interaction);
		} else if (interaction.options.getSubcommand() === "randomize") {
			await randomizeMovie(interaction);
		} else if (interaction.options.getSubcommand() === "rating") {
			try {
				let movieTitle = interaction.options
					.getString("title")
					.trim()
					.toLowerCase();

				// unifying movie name by capitlazing
				movieTitle = stringUtils.capitalize(movieTitle);
				if (movieTitle.length === 0)
					return interaction.reply({
						content: "🚫 Movie title can't be empty",
						ephemeral: true,
					});
				const movie = await Movie.findOne({ title: movieTitle });

				if (movie === null)
					return interaction.reply({
						content: "🚫 Movie dosen't exist",
						ephemeral: true,
					});
				else {
					if (movie.review === null)
						return interaction.reply(
							`**${movieTitle}** is still not reviewed.`
						);
					else
						return interaction.reply(
							`**${movieTitle}** was rated for **${movie.review.toFixed(
								1
							)}/10**.`
						);
				}
			} catch (err) {
				console.error(err);
				return interaction.reply(
					"Command failed :( please report the the command and your input me3za#4854 please."
				);
			}
		} else if (interaction.options.getSubcommand() === "rate") {
			try {
				let movieTitle = interaction.options
					.getString("title")
					.trim()
					.toLowerCase();
				const userRating = interaction.options.getNumber("rating");

				// unifying movie name by capitlazing
				movieTitle = stringUtils.capitalize(movieTitle);
				if (movieTitle.length === 0)
					return interaction.reply({
						content: "🚫 Movie title can't be empty",
						ephemeral: true,
					});
				if (userRating > 10 || userRating < 0)
					return interaction.reply({
						content: "🚫 Rating must be positive and lower than 10",
						ephemeral: true,
					});
				const movie = await Movie.findOne({ title: movieTitle });

				if (!movie)
					return interaction.reply({
						content: "🚫 Movie isn't registerd",
						ephemeral: true,
					});
				const rater = movie.raters.filter(
					(object) => object.userId === interaction.user.id
				);

				if (rater.length > 0) {
					movie.raters.push({
						user: interaction.user.id,
						rating: userRating,
					});
					const ratings = movie.raters.map((object) => object.rating);
					movie.review =
						ratings.reduce(
							(previousValue, currentValue) => previousValue + currentValue,
							0
						) / ratings.length;
					await Movie.findOneAndUpdate({ _id: movie._id.toString() }, movie);
					return interaction.reply({
						content: `${
							interaction.user.username
						} re-reviewed **${movieTitle}** from **${rater[0].rating.toFixed(
							1
						)}/10** to **${userRating.toFixed(1)}/10**`,
					});
				}

				if (movie.review === null) movie.review = userRating;
				else movie.review = (movie.review + userRating) / 2;
				movie.raters.push({
					user: interaction.user.id,
					rating: userRating,
				});

				await Movie.findOneAndUpdate({ _id: movie._id.toString() }, movie);
				return interaction.reply(
					`${
						interaction.user.username
					} rated **${movieTitle}** : **${userRating.toFixed(1)}/10**`
				);
			} catch (err) {
				console.error(err);
				return interaction.reply(
					"Command failed :( please report the the command and your input me3za#4854 please."
				);
			}
		} else if (interaction.options.getSubcommand() === "list") {
			try {
				const embeds = [];
				const pages = {};
				let pageItemCount = 0;

				let movies = await Movie.find({});

				if (movies.length === 0)
					return interaction.reply({
						content: "🚫 No movies have been registered yet",
						ephemeral: true,
					});
				while (movies.length > 0) {
					const embed = new EmbedBuilder();
					while (pageItemCount < 10 && movies.length > 0) {
						embed.setTitle(`Page ${embeds.length + 1}`).addFields({
							name: `${movies[movies.length - 1].title}`,
							value: `${
								movies[movies.length - 1].review === null
									? "Unseen"
									: `${movies[movies.length - 1].review.toFixed(1)}/10`
							}`,
							inline: false,
						});
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
								.setCustomId("prev-embed")
								.setEmoji("⏪")
								.setDisabled(pages[id] === 0)
								.setStyle(ButtonStyle.Primary)
						)

						.addComponents(
							new ButtonBuilder()
								.setCustomId("next-embed")
								.setEmoji("⏩")
								.setDisabled(pages[id] === embeds.length - 1)
								.setStyle(ButtonStyle.Primary)
						);

					return row;
				};

				const id = interaction.user.id;
				pages[id] = pages[id] || 0;
				const embed = embeds[pages[id]];

				const filter = (i) => i.user.id === interaction.user.id;

				interaction.reply({
					ephemeral: true,
					embeds: [embed],
					components: [getRow(id)],
				});

				let collector = interaction.channel.createMessageComponentCollector({
					filter,
					time: 1000 * 60 * 10,
				});

				collector.on("collect", async (btnInt) => {
					if (!btnInt) return;

					btnInt.deferUpdate();
					if (
						btnInt.customId !== "prev-embed" &&
						btnInt.customId !== "next-embed"
					)
						return;
					if (btnInt.customId === "prev-embed" && pages[id] > 0) --pages[id];
					if (btnInt.customId === "next-embed" && pages[id] < embeds.length - 1)
						++pages[id];

					interaction.editReply({
						embeds: [embeds[pages[id]]],
						components: [getRow(id)],
					});
				});
			} catch (err) {
				console.error(err);
				return interaction.reply(
					"Command failed :( please report the the command and your input me3za#4854 please."
				);
			}
		} else if (interaction.options.getSubcommand() === "delete") {
			try {
				let movieTitle = interaction.options
					.getString("title")
					.trim()
					.toLowerCase(); // unifying movie name by capitlazing
				movieTitle = stringUtils.capitalize(movieTitle);
				if (movieTitle.length === 0)
					return interaction.reply({
						content: "🚫 Movie title can't be empty.",
						ephemeral: true,
					});
				const movie = await Movie.findOne({ title: movieTitle });

				if (movie === null)
					return interaction.reply({
						content: "🚫 Movie dosen't exist.",
						ephemeral: true,
					});
				if (movie.adderId === interaction.user.id) {
					if (movie.review !== null) {
						return interaction.reply({
							ephemeral: true,
							content: `🚫 You can't delete a movie that has been watched/reviewd.`,
						});
					}
					await movie.remove();
					return interaction.reply({
						content: `**${movie.title}** has been deleted.`,
					});
				}
				return interaction.reply({
					content: "🚫 Only the person that added the movie can delete it.",
					ephemeral: true,
				});
			} catch (err) {
				console.error(err);
				return interaction.reply(
					"Command failed :( please report the the command and your input me3za#4854 please."
				);
			}
		}
		return interaction.reply({
			content: `🚫 this command doesn't exist.`,
			ephemeral: true,
		});
	},
};
