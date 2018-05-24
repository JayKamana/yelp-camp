const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

const campgrounds = [
  {
    name: 'Salmon creek',
    image:
      'https://pixabay.com/get/ea31b10929f7063ed1584d05fb1d4e97e07ee3d21cac104497f7c079a2edb3b9_340.jpg'
  },
  {
    name: 'Granite Hill',
    image:
      'https://pixabay.com/get/ea36b40a2efd083ed1584d05fb1d4e97e07ee3d21cac104497f7c079a2edb3b9_340.jpg'
  },
  {
    name: "Mountain Goat's Rest",
    image: 'https://farm4.staticflickr.com/3859/15206294046_757339f82d.jpg'
  }
];

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  res.render('Campgrounds', { campgrounds });
});

app.post('/campgrounds', (req, res) => {
  const name = req.body.name;
  const image = req.body.image;

  campgrounds.push({ name, image });
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.listen(3000, () => console.log('YelpCamp server is running on port 3000'));
