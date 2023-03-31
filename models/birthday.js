const mongoose = require("mongoose");

const birthdaySchema = mongoose.Schema({
	userId: String,
	guildId: [String],
	day: Number,
	month: Number,
});

birthdaySchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Birthday", birthdaySchema);
