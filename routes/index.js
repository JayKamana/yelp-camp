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
      passport.authenticate('local')(req, res, () =>
        res.redirect('/campgrounds')
      )
    )
    .catch(err => {
      console.log(err);
      res.render('register');
    });
});

//Login form route
router.get('/login', (req, res) => {
  res.render('login');
});

//Handle Login form logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {}
);

//Logout form route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
