require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/movie');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log('connected to', process.env.MONGODB_URI));

//clear movies
Movie.deleteMany({}).then((result) => console.log('Movies', result));
// Movie.findOne({title : 'chainsaw man season 1'}).then(qurey => console.log(qurey))