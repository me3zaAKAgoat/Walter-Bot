require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/movie');
const Role = require('./models/role');
const LatestScrape = require('./models/latestScrape');
const Birthday = require('./models/birthday');

mongoose
	.connect(process.env.MONGODB_URI)
	.then(console.log('connected to', process.env.MONGODB_URI));

Birthday.deleteMany({}).then((result) => console.log('Birthday', result));

// clear movies
// Movie.deleteMany({}).then((result) => console.log('Movies', result));
// Movie.findOne({title : 'chainsaw man season 1'}).then(qurey => console.log(qurey))
// Movie.find({}).then((result) => console.log(result));
// add first and only latest scrape document
// const storeFirstLatestScrape = async () => {
//   const latestScrape = new LatestScrape({
//     latestScrape : new Date()
//   })

//   await latestScrape.save();
// }

// storeFirstLatestScrape();

// LatestScrape.find({}).then(query => console.log(query)).catch(error => console.log(error))

// LatestScrape.deleteMany({}).then((result) => console.log('delete latest document', result));

// Role.deleteMany({}).then((result) =>
// 	console.log('delete latest document', result)
// );
