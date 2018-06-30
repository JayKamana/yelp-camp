const express = require('express');
const router = express.Router();
const { Campground } = require('../models/campground');

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id)
      .then(foundCampground => {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      })
      .catch(() => res.redirect('back'));
  } else {
    res.redirect('back');
  }
};

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
      console.log(campground);
    })
    .catch(err => console.log(err));

  res.redirect('/campgrounds');
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
    .catch(err => console.log(err));
});

router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => res.render('campgrounds/edit', { campground }))
    .catch(err => console.log(err));
});

router.put('/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    .then(updatedCampground => res.redirect('/campgrounds/' + req.params.id))
    .catch(err => {
      res.redirect('/campgrounds');
      console.log(err);
    });
});

router.delete('/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/campgrounds'))
    .catch(err => {
      res.redirect('/campgrounds');
      console.log(err);
    });
});

module.exports = router;
