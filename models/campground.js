const mongoose = require('mongoose');

const campgroundsSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: 'String'
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

let Campground = mongoose.model('Campground', campgroundsSchema);

module.exports = {
  Campground
};
