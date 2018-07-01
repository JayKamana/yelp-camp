const express = require('express');
const router = express.Router({ mergeParams: true });
const { Campground } = require('../models/campground');
const { Comment } = require('../models/comment');

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id)
      .then(foundComment => {
        if (foundComment.author.id.equals(req.user._id)) {
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

//Comments New
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => res.render('comments/new', { campground }))
    .catch(err => console.log(err));
});

//Comments Create
router.post('/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => {
      Comment.create(req.body.comment).then(comment => {
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save();
        campground.comments.push(comment);
        campground.save();
        res.redirect('/campgrounds/' + campground._id);
      });
    })
    .catch(err => console.log(err));
});

//Comment Edit
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id)
    .then(comment =>
      res.render('comments/edit', {
        campground_id: req.params.id,
        comment
      })
    )
    .catch(err => console.log(err));
});

//Comment Update
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
    .then(updatedComment => res.redirect('/campgrounds/' + req.params.id))
    .catch(err => {
      res.redirect('/campgrounds');
      console.log(err);
    });
});

//Comment Delete
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id)
    .then(() => res.redirect('/campgrounds/' + req.params.id))
    .catch(err => {
      res.redirect('back');
      console.log(err);
    });
});

module.exports = router;
