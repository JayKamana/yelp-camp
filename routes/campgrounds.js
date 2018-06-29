const express = require('express');
const router = express.Router();
const { Campground } = require('../models/campground');

//Index route
router.get('/', (req, res) => {
  Campground.find()
    .then(campgrounds => res.render('campgrounds/index', { campgrounds }))
    .catch(err => console.log(err));
});

//Campgrounds Create
router.post('/', (req, res) => {
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

//Campgrounds New
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

//Comments Show
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec()
    .then(campground => {
      res.render('campgrounds/show', { campground });
    })
    .catch(err => console.log(err));
});

module.exports = router;
