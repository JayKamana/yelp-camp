const express = require('express');
const router = express.Router();
const { Campground } = require('../models/campground');
const { isLoggedIn, checkCampgroundOwnership } = require('../middleware');

//Index route
router.get('/', (req, res) => {
  Campground.find()
    .then(campgrounds => res.render('campgrounds/index', { campgrounds }))
    .catch(err => console.log(err));
});

//Campgrounds Create
router.post('/', isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = new Campground({ name, image, description, author });
  Campground.create(newCampground)
    .then(campground => {
      req.flash('success', campground.name + ' campground created');
      res.redirect('/campgrounds');
    })
    .catch(() => {
      req.flash('error', 'the campground could not be created');
      res.redirect('/campgrounds');
    });
});

//Campgrounds New
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

//Campgrounds Show
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec()
    .then(campground => {
      res.render('campgrounds/show', { campground });
    })
    .catch(() => {
      req.flash('error', 'the campground could not be found');
      res.redirect('/campgrounds');
    });
});

router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => res.render('campgrounds/edit', { campground }))
    .catch(() => {
      req.flash('error', 'Campground could not be found');
      res.redirect('/campgrounds/' + req.params.id);
    });
});

router.put('/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    .then(updatedCampground => {
      req.flash('success', 'Campground updated');
      res.redirect('/campgrounds/' + req.params.id);
    })
    .catch(err => {
      req.flash('error', 'Campground could not be updated');
      res.redirect('/campgrounds/' + req.params.id);
    });
});

router.delete('/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id)
    .then(() => {
      req.flash('success', 'Campground successfully deleted');
      res.redirect('/campgrounds');
    })
    .catch(err => {
      req.flash('error', 'Campground could not be deleted');
      res.redirect('/campgrounds');
    });
});

module.exports = router;
