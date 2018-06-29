const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const passport = require('passport');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

const { mongoose } = require('./db/mongoose');

const { User } = require('./models/user');
const { Campground } = require('./models/campground');
const { Comment } = require('./models/comment');

const SeedDB = require('./seeds');
SeedDB();

app.set('view engine', 'ejs');

app.use(
  require('express-session')({
    secret: 'yelp camp secret key',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  Campground.find()
    .then(campgrounds => res.render('campgrounds/index', { campgrounds }))
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
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec()
    .then(campground => {
      res.render('campgrounds/show', { campground });
    })
    .catch(err => console.log(err));
});

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => res.render('comments/new', { campground }))
    .catch(err => console.log(err));
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => {
      Comment.create(req.body.comment).then(comment => {
        campground.comments.push(comment);
        campground.save();
        res.redirect('/campgrounds/' + campground._id);
      });
    })
    .catch(err => console.log(err));
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
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

app.get('/login', (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {}
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => console.log('YelpCamp server is running on port 3000'));
