const mongoose = require('mongoose');

const campgroundsSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

let Campground = mongoose.model('Campground', campgroundsSchema);

module.exports = {
  Campground
};
