var express = require('express');
var router = express.Router();
const userModel =  require("./users");
const passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('index'); 
});

router.get('/login', function(req, res, next) {
  res.render('login'); 
});

router.get('/register', function(req, res, next) {
  res.render('register'); 
});

router.post('/register', function(req, res, next) {
  const data = new userModel({
    username : req.body.username,
    email : req.body.email,
    contact : req.body.contact,
  })

  userModel.register(data, req.body.password)
    .then(function() {
      passport.authenticate("local")(req,res, function() {
        res.render("/profile")
      })
    })
});

router.get('/profile', function(req, res, next) {
  res.render('profile'); 
});

module.exports = router;
