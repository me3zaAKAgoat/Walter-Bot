require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/movie');
const LastestScrape = require('./models/lastestScrape')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log('connected to', process.env.MONGODB_URI));

// clear movies
// Movie.deleteMany({}).then((result) => console.log('Movies', result));
// Movie.findOne({title : 'chainsaw man season 1'}).then(qurey => console.log(qurey))


// add first and only latest scrape document
// const storeFirstLatestScrape = async () => {
//   const latestScrape = await new LastestScrape({
//     latestScrape : new Date()
//   })
  
//   await latestScrape.save();
// }

// storeFirstLatestScrape();

// LastestScrape.find({}).then(query => console.log(query)).catch(error => console.log(error))