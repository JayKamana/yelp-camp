const { Campground } = require('../models/campground');
const { Comment } = require('../models/comment');

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id)
      .then(foundCampground => {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that');
          res.redirect('back');
        }
      })
      .catch(() => {
        req.flash('error', 'Campground could not be found');
        res.redirect('back');
      });
  } else {
    req.flash('error', 'You need to be logged in to do that');

    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id)
      .then(foundComment => {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that');
          res.redirect('back');
        }
      })
      .catch(() => {
        res.redirect('back');
        req.flash('error', 'Comment could not be found');
      });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

module.exports = middlewareObj;
