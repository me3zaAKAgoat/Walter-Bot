const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
	timeVc: {
		type: Number,
		default: 0,
	},
	messageCount: {
		type: Number,
		default: 0,
	},
	memberId: String,
});

activitySchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Activity", activitySchema);
