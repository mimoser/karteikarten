/* eslint-disable linebreak-style */
const express = require('express');
// const expressValidator = require('express-validator');
const cookieSession = require('cookie-session');
const passport = require('passport');
const routes = require('./routes');
const passportSetup = require('./passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const bodyParser = require('body-parser');

const app = express();
// app.use(expressValidator());

const port = process.env.port || 3000;

// body parser
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// set up session cookies
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey],
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongodb.dbURI, {
  useNewUrlParser: true,
  keepAlive: true,
  reconnectTries: 10,
}, () => {
  console.log('connected to mongodb');
});

// set up routes
app.use(routes);

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
