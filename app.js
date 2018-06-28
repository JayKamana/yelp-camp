const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');

const { Campground } = require('./models/campground');
// const { Comment } = require('./models/comment');
// const { User } = require('./models/user');

const SeedDB = require('./seeds');
SeedDB();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  Campground.find()
    .then(campgrounds => res.render('index', { campgrounds }))
    .catch(err => console.log(err));
});

app.post('/campgrounds', (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;

  const newCampground = new Campground({ name, image, description });

  newCampground
    .save()
    .then(campground => console.log(campground))
    .catch(err => console.log(err));

  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec()
    .then(campground => {
      console.log(campground);
      res.render('show', { campground });
    })
    .catch(err => console.log(err));
});

app.listen(3000, () => console.log('YelpCamp server is running on port 3000'));
