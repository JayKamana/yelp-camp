const express = require('express');
const router = express.Router({ mergeParams: true });
const { Campground } = require('../models/campground');
const { Comment } = require('../models/comment');
const { isLoggedIn, checkCommentOwnership } = require('../middleware');

//Comments New
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => res.render('comments/new', { campground }))
    .catch(() => {
      req.flash('error', 'Campground not found');
      res.redirect('/campgrounds');
    });
});

//Comments Create
router.post('/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => {
      Comment.create(req.body.comment)
        .then(comment => {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash('success', 'Comment added');
          res.redirect('/campgrounds/' + campground._id);
        })
        .catch(() => {
          req.flash('error', 'Comment could not be created');
          res.redirect('/campgrounds/' + campground._id);
        });
    })
    .catch(() => {
      req.flash('error', 'Campground not found');
      res.redirect('/campgrounds');
    });
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
    .catch(() => {
      req.flash('error', 'Comment not found');
      res.redirect('/campgrounds' + req.params.id);
    });
});

//Comment Update
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
    .then(updatedComment => {
      req.flash('success', 'Comment updated');
      res.redirect('/campgrounds/' + req.params.id);
    })
    .catch(err => {
      req.flash('error', 'Comment could not be updated');
      res.redirect('/campgrounds');
    });
});

//Comment Delete
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id)
    .then(() => {
      req.flash('success', 'Comment successfully deleted');
      res.redirect('/campgrounds/' + req.params.id);
    })
    .catch(err => {
      req.flash('error', 'Comment could not be deleted');
      res.redirect('back');
    });
});

module.exports = router;
