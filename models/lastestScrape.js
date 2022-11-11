const mongoose = require('mongoose');

const latestScrape = mongoose.Schema({
    latestScrape : Date,
});

latestScrape.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('LatestScrape', latestScrape);