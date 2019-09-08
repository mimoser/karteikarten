/* eslint-disable linebreak-style */

// environment variables from .env file
// console.log(require('dotenv').config());
require('dotenv').config();


const express = require('express');
// const expressValidator = require('express-validator');
const cookieSession = require('cookie-session');
const passport = require('passport');
const routes = require('./routes');
const passportSetup = require('./passport-setup');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
// app.use(expressValidator());

const port = process.env.port || 3000;

// body parser
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json({limit: '3000kb'}));

// set up session cookies
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.SESSION_COOKIE_KEY],
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
// mongoose.Promise = global.Promise; // angeblich seit Version 5 nicht mehr nötig
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  keepAlive: true,
  reconnectTries: 10,
}, () => {
  console.log('connected to mongodb');
});

// set up routes
app.use('/api',routes);

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`app now listening for requests on port ${port}`);
});
