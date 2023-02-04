const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
	role: String,
	roleId: String,
	guildId: String,
});

roleSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Role", roleSchema);
