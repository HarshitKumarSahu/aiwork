if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}


// Basic requires
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Session and Passport requires
const expressSession = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

// Routes and Models
var indexRouter = require('./routes/index.route');
var usersRouter = require('./models/users.model'); // Assuming users.js exports your user model

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mongo Store
const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_DB_URL,
  crypto: {
    secret: "hello world"
  },
  touchAfter: 24 * 3600,
})
store.on("error", () => {
  console.log("error in mongo session", err)
})

// Express Session
app.use(expressSession({
  store: store,
  secret: "hello world",
  resave: false,
  saveUninitialized: false,
  cookies : {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days lifetime from now
    maxAge: 7 * 24 * 60 * 60 * 1000, // Alternative to `expires`: 7 days lifetime
    httpOnly: true   // Prevents client-side access
  }
}));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(usersRouter.authenticate()));
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
