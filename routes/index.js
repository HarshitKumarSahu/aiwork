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

// router.get('/show/posts', isLoggedIn, async function(req, res, next) {
//   const user = await userModel.findOne({ username: req.session.passport.user }).populate("post");
//   res.render('show', { user, nav: true }); 
// });

router.get('/feed', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const post = await postModel.find().populate("user");

  function shuffleArray(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
  }
  
  // Assuming `post` is your array of posts
  const shuffledPosts = shuffleArray(post);


  res.render('feed', { user, post: shuffledPosts, nav: true }); 
});





// router.get('/add', isLoggedIn , async function(req, res, next) {
//   const user = await userModel.findOne({username: req.session.passport.user});
//   res.render('add', {user, nav : true}); 
// });

// Upload form route
router.get('/upload', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('upload', { user, nav: true });
});

// Generate form route
router.get('/generate', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('generate', { user, nav: true });
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

// router.post('/createpost', isLoggedIn, upload.single("postimage"), async function(req, res, next) {
//   console.log("File uploaded:", req.file); // Debug log

//   if (!req.file) {
//       console.log("Error: No file uploaded.");
//       return res.send("File upload failed.");
//   }

//   const user = await userModel.findOne({ username: req.session.passport.user });

//   const post = await postModel.create({
//       user: user._id,
//       title: req.body.title,
//       description: req.body.description,
//       image: req.file.filename
//   });

//   user.post.push(post._id);
//   await user.save();
  
//   console.log("Post created with image:", req.file.filename);
//   res.redirect("/profile");
// });

router.post('/createpost', isLoggedIn, upload.single("postimage"), async function (req, res, next) {
  console.log("✅ Received request to create post.");
  console.log("Form Type:", req.body.imageOption);

  const user = await userModel.findOne({ username: req.session.passport.user });

  let imageFilename = null;

  // Handle Image Upload
  if (req.body.imageOption === 'upload') {
      if (req.file) {
          imageFilename = req.file.filename;
          console.log("✅ Uploaded Image:", imageFilename);
      } else {
          console.log("❌ Error: No file uploaded.");
          return res.send("Please upload an image.");
      }
  }
  // Handle AI-Generated Image
  else if (req.body.imageOption === 'generate') {
      imageFilename = req.body.generatedImageFilename;
      if (!imageFilename) {
          console.log("❌ Error: No AI-generated image provided.");
          return res.send("Image generation failed or was not completed.");
      }
      console.log("✅ Generated Image:", imageFilename);
  } 
  // Invalid imageOption
  else {
      console.log("❌ Error: Invalid imageOption.");
      return res.send("Invalid image option.");
  }

  // Create new post with selected image
  const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: imageFilename
  });

  user.post.push(post._id);
  await user.save();

  console.log("✅ Post created successfully with image:", imageFilename);
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
