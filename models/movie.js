const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  title: String,
  review: Number,
  raters : [{
    type : String
  }],
});

movieSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Movie', movieSchema);