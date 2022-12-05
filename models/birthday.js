const mongoose = require('mongoose');

const birthday = mongoose.Schema({
	userId: String,
	day: Number,
	month: Number,
});

birthday.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Birthday', birthday);
