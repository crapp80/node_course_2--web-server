/* eslint-disable no-console */

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; // configuration for heroku
const app = express();

hbs.registerPartials(`${__dirname}/views/partials`); // syntax to include partial: {{> nameOfPartial}}
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', `${log}\n`, (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});

// This middleware stops all following code from being executed, because next() isn't called
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(`${__dirname}/public/`));

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear()); // syntax to include helper: {{nameOfHelper}}
hbs.registerHelper('screamIt', text => text.toUpperCase());

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my Handlebars Template',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request.',
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
