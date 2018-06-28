const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://jaykamana:jay123@ds121251.mlab.com:21251/yelp-camp')
  .then(() => console.log('MongoDb Connected'));

module.exports = {
  mongoose
};
