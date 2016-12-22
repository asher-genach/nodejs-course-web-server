const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; // If not exist set to 3000

var app = express();

// Register the partials directory
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine','hbs');

// __dirname holds the path the the project directory
// static directory
// app.use() ==> middleware

// This here will not allow to block the public directories
// with maintenance as it was called before the maintenance.
// As a result we will move this call to below the middleware
// maintenance call.
//app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  var now = new Date().toString();

  // See expressjs.com, API reference 4.x.
  // See request, response, etc...

  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);

  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });

  // Method like: GET, url path: like /

// next ==> so you can tell this middleware function when it is done.
  next(); // This ends this middleware function. Passing the control.
  // If we dont call it the function will not end, and the website will
  // become iresponsive.
  // In some cases we can avoid calling next if there is an error.
  // In such case we want to avoid next() because we have an error and we
  // do not want to continue.

});

// We remove the maintenance so our app will execute OK.
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
//
//     // Since we dont call next the execuation will finish after this line.
// });

app.use(express.static(__dirname + '/public'));

// register partial/ handlebars helpers functions.
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});


// Register of an http get request

// Route A - root /
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home page',
    //currentYear: new Date().getFullYear(),
    welcomeMessage: 'Welcome !!!'
  });
  //res.send('<h1>Hello Express!</h1>')
  /*res.send({
    name:'Asher',
    likes: ['TV','Computers stuff']
  })*/
});

// Route B - /about
app.get('/about', (req, res) => {
  //res.send('About Page');
  res.render('about.hbs', {
    pageTitle: 'About page',
    //currentYear: new Date().getFullYear()
  });
});

// Route C - /projects
app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects page',
  });
});


// Route D - /bad
app.get('/bad', (req, res) => {
  res.send({ error: "Error"});
});

// Port port 
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
