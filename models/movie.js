const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
	title: String,
	review: Number,
	adderId: String,
	raters: [
		{
			userId: {
				type: String,
			},
			rating: {
				type: Number,
			},
		},
	],
	guildId: String,
});

movieSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Movie", movieSchema);
