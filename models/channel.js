const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
	type: String,
	id: String,
});

channelSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Channel', channelSchema);
