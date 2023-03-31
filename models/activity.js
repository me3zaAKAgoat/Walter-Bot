const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
	vcTime: {
		type: Number, // time in vc in minutes
		default: 0,
	},
	messageCount: {
		type: Number, // number of messages
		default: 0,
	},
	userId: String,
	guildId: String,
});

activitySchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Activity", activitySchema);
