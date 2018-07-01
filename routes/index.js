const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../models/user');

const { isLoggedIn } = require('../middleware');

//Root route
router.get('/', (req, res) => {
  res.render('landing');
});

//Register form route
router.get('/register', (req, res) => {
  res.render('register');
});

//Handle sign up logic
router.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password)
    .then(user =>
      passport.authenticate('local')(req, res, () => {
        req.flash('success', 'Welcome to Yelpcamp ' + user.username);
        res.redirect('/campgrounds');
      })
    )
    .catch(err => {
      req.flash('error', err.message);
      res.redirect('register');
    });
});

//Login form route
router.get('/login', (req, res) => {
  res.render('login');
});

//Handle Login form logic
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Welcome to YelpCamp, ' + req.body.username + '!'
  })(req, res);
});

//Logout form route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/');
});

module.exports = router;
