var express = require('express');
var router = express.Router();
const userModel =  require("./users");
const postModel =  require("./post");
const passport = require('passport');
const localStrategy = require("passport-local");
const upload = require("./multer");
const axios = require('axios');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

passport.use(new localStrategy(userModel.authenticate()))

router.get('/', function(req, res, next) {
  res.render('index', {nav : true}); 
});

router.get('/login', function(req, res, next) {
  res.render('login', {nav : false}); 
});

router.get('/register', function(req, res, next) {
  res.render('register', {nav : false}); 
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate("post");
  res.render('profile', { user, nav: true }); 
});

router.get('/show/posts', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate("post");
  res.render('show', { user, nav: true }); 
});

router.get('/feed', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const post = await postModel.find().populate("user");
  res.render('feed', { user, post, nav: true }); 
});


router.get('/add', isLoggedIn , async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('add', {user, nav : true}); 
});

router.post('/fileupload', isLoggedIn , upload.single("image") , async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

const clipdropApiKey = process.env.CLIPDROP_API_KEY;

router.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;
  const uploadsDir = path.join(__dirname, '..', 'public', 'images', 'uploads');

  if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
  }

  try {
      const response = await axios.post(
          'https://clipdrop-api.co/text-to-image/v1',
          { prompt },
          {
              headers: {
                  'x-api-key': clipdropApiKey,
                  'Content-Type': 'application/json'
              },
              responseType: 'arraybuffer'
          }
      );

      const filename = `generated_${Date.now()}.png`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, response.data);

      res.json({ success: true, filename });
  } catch (error) {
      console.error("Error generating image:", error);
      res.json({ success: false });
  }
});

router.post('/createpost', isLoggedIn, upload.single("postimage"), async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });

  let imageFilename = null;

  if (req.body.imageOption === 'upload') {
      if (req.file) {
          imageFilename = req.file.filename;
      } else {
          return res.send("Please upload an image.");
      }
  } else if (req.body.imageOption === 'generate') {
      imageFilename = req.body.generatedImageFilename;
      if (!imageFilename) {
          return res.send("Image generation failed or was not completed.");
      }
  }

  const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: imageFilename
  });

  user.post.push(post._id);
  await user.save();
  res.redirect("/profile");
});








router.post('/register', function(req, res, next) {
  const data = new userModel({
    username : req.body.username,
    name : req.body.fullname,
    email : req.body.email,
    contact : req.body.contact,
  })

  userModel.register(data, req.body.password)
    .then(function() {
      passport.authenticate("local")(req,res, function() {
        res.redirect("/profile")
      })
    })
});

router.post('/login', passport.authenticate("local" , {
  failureRedirect: "/login",
  successRedirect: "/profile",
}) , function(req, res, next) {});

router.get('/logout',function(req, res, next) {
  req.logout(function(err) {
    if(err) { return next(err); }
    res.redirect("/");
  })
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
