// var express = require('express');
// var router = express.Router();
// const userModel = require("../models/users");
// const postModel = require("../models/post");
// const passport = require('passport');
// const localStrategy = require("passport-local");
// const upload = require("./multer");
// const axios = require('axios');
// const fs = require('fs');
// const path = require('path');
// const wrapAsync = require("../utils/wrapAsync");
// require('dotenv').config();

// passport.use(new localStrategy(userModel.authenticate()));

// // Middleware
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect("/login");
// }

// // Routes

// router.get('/', (req, res) => res.render('index', { nav: true }));
// router.get('/login', (req, res) => res.render('login', { nav: false }));
// router.get('/register', (req, res) => res.render('register', { nav: false }));

// router.get('/profile', isLoggedIn, wrapAsync(async (req, res) => {
//   const user = await userModel.findOne({ username: req.session.passport.user }).populate("post");
//   res.render('profile', { user, nav: true });
// }));

// router.get('/feed', isLoggedIn, wrapAsync(async (req, res) => {
//   const user = await userModel.findOne({ username: req.session.passport.user });
//   const posts = await postModel.find().populate("user");

//   const shuffleArray = (array) => array
//     .map(value => ({ value, sort: Math.random() }))
//     .sort((a, b) => a.sort - b.sort)
//     .map(({ value }) => value);

//   res.render('feed', { user, post: shuffleArray(posts), nav: true });
// }));

// // Upload form
// router.get('/upload', isLoggedIn, wrapAsync(async (req, res) => {
//   const user = await userModel.findOne({ username: req.session.passport.user });
//   res.render('upload', { user, nav: true });
// }));

// // Generate form
// router.get('/generate', isLoggedIn, wrapAsync(async (req, res) => {
//   const user = await userModel.findOne({ username: req.session.passport.user });
//   res.render('generate', { user, nav: true });
// }));

// // Upload profile image
// router.post('/fileupload', isLoggedIn, upload.single("image"), wrapAsync(async (req, res) => {
//   const user = await userModel.findOne({ username: req.session.passport.user });
//   user.profileImage = req.file.filename;
//   await user.save();
//   res.redirect("/profile");
// }));

// // Generate AI Image
// const clipdropApiKey = process.env.CLIPDROP_API_KEY;

// router.post('/generate-image', wrapAsync(async (req, res) => {
//   const { prompt } = req.body;
//   const uploadsDir = path.join(__dirname, '..', 'public', 'images', 'uploads');

//   if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

//   try {
//     const response = await axios.post(
//       'https://clipdrop-api.co/text-to-image/v1',
//       { prompt },
//       {
//         headers: {
//           'x-api-key': clipdropApiKey,
//           'Content-Type': 'application/json'
//         },
//         responseType: 'arraybuffer'
//       }
//     );

//     const filename = `generated_${Date.now()}.png`;
//     const filePath = path.join(uploadsDir, filename);
//     fs.writeFileSync(filePath, response.data);
//     res.json({ success: true, filename });
//   } 
//   // catch (error) {
//   //   console.error("Error generating image:", error);
//   //   res.json({ success: false });
//   // }
//   catch (error) {
//     console.error("Error generating image:", error.response?.data || error.message);
//     res.json({ success: false, error: "Failed to generate image. Try again." });
//   }
// }));

// // Create post with image (upload or generated)
// router.post('/createpost', isLoggedIn, upload.single("postimage"), async (req, res) => {
//   console.log("✅ Received request to create post.");
//   const user = await userModel.findOne({ username: req.session.passport.user });

//   let imageFilename = null;
//   if (req.body.imageOption === 'upload') {
//     if (req.file) {
//       imageFilename = req.file.filename;
//     } else {
//       return res.send("Please upload an image.");
//     }
//   } else if (req.body.imageOption === 'generate') {
//     imageFilename = req.body.generatedImageFilename;
//     if (!imageFilename) return res.send("Image generation failed.");
//   } else {
//     return res.send("Invalid image option.");
//   }

//   const post = await postModel.create({
//     user: user._id,
//     title: req.body.title,
//     description: req.body.description,
//     image: imageFilename
//   });

//   user.post.push(post._id);
//   await user.save();
//   res.redirect("/profile");
// });

// // Edit profile page
// router.get('/editprofile', isLoggedIn, async (req, res) => {
//   const user = await userModel.findOne({ username: req.session.passport.user });
//   res.render('editprofile', { user, nav: true });
// });

// // Handle edit profile form
// router.post('/editprofile', isLoggedIn, wrapAsync(async (req, res) => {
//   try {
//     const user = await userModel.findOne({ username: req.session.passport.user });
//     user.name = req.body.name || user.name;
//     user.username = req.body.username || user.username;
//     user.email = req.body.email || user.email;
//     user.contact = req.body.contact || user.contact;
//     await user.save();
//     res.redirect('/profile');
//   } catch (err) {
//     console.error("Error updating profile:", err);
//     res.send("An error occurred while updating profile.");
//   }
// }));

// // Delete user and all posts
// router.post('/deleteuser', isLoggedIn, wrapAsync(async (req, res, next) => {
//   try {
//     const user = await userModel.findOne({ username: req.session.passport.user });

//     const userPosts = await postModel.find({ user: user._id });
//     for (let post of userPosts) {
//       const imagePath = path.join(__dirname, '..', 'public', 'images', 'uploads', post.image);
//       if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
//     }

//     await postModel.deleteMany({ user: user._id });
//     await userModel.findByIdAndDelete(user._id);

//     req.logout(function(err) {
//       if (err) return next(err);
//       res.redirect('/');
//     });
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     res.send("Something went wrong.");
//   }
// }));

// // Edit post
// router.get('/editpost/:id', isLoggedIn, wrapAsync(async (req, res) => {
//   const post = await postModel.findById(req.params.id);
//   const user = await userModel.findById(post.user);
//   res.render('editpost', { post, user, nav: true });
// }));

// router.post('/editpost/:id', isLoggedIn, wrapAsync(async (req, res) => {
//   const { title, description } = req.body;
//   await postModel.findByIdAndUpdate(req.params.id, { title, description });
//   res.redirect('/profile');
// }));

// // Delete post
// router.post('/deletepost/:id', isLoggedIn, wrapAsync(async (req, res) => {
//   const post = await postModel.findById(req.params.id);
//   const user = await userModel.findOne({ username: req.session.passport.user });

//   user.post.pull(post._id);
//   await user.save();

//   const imagePath = path.join(__dirname, '..', 'public', 'images', 'uploads', post.image);
//   if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

//   await postModel.findByIdAndDelete(req.params.id);
//   res.redirect('/profile');
// }));

// // Register route
// router.post('/register', (req, res) => {
//   const data = new userModel({
//     username: req.body.username,
//     name: req.body.fullname,
//     email: req.body.email,
//     contact: req.body.contact,
//   });

//   userModel.register(data, req.body.password)
//     .then(() => passport.authenticate("local")(req, res, () => res.redirect("/profile")));
// });

// // Login route
// router.post('/login', passport.authenticate("local", {
//   failureRedirect: "/login",
//   successRedirect: "/profile",
// }));

// // Logout route
// router.get('/logout', (req, res, next) => {
//   req.logout((err) => {
//     if (err) return next(err);
//     res.redirect('/');
//   });
// });

// module.exports = router;

var express = require('express');
var router = express.Router();
const passport = require('passport');
const upload = require("./multer.route");
const wrapAsync = require("../utils/wrapAsync");
require('dotenv').config();

const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const postController = require("../controllers/post.controller");
const uploadController = require("../controllers/upload.controller");
const generateController = require("../controllers/generate.controller");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// Pages
router.get('/', (req, res) => res.render('index', { nav: true }));
router.get('/login', (req, res) => res.render('login', { nav: false }));
router.get('/register', (req, res) => res.render('register', { nav: false }));

// Profile
router.get('/profile', isLoggedIn, wrapAsync(userController.getProfile));
router.get('/editprofile', isLoggedIn, wrapAsync(userController.editProfilePage));
router.post('/editprofile', isLoggedIn, wrapAsync(userController.editProfile));
router.post('/deleteuser', isLoggedIn, wrapAsync(userController.deleteUser));

// Feed
router.get('/feed', isLoggedIn, wrapAsync(postController.feed));

// Upload
router.get('/upload', isLoggedIn, (req, res) => res.render('upload', { nav: true }));
router.post('/fileupload', isLoggedIn, upload.single("image"), wrapAsync(uploadController.uploadProfileImage));

// Generate
router.get('/generate', isLoggedIn, (req, res) => res.render('generate', { nav: true }));
router.post('/generate-image', wrapAsync(generateController.generateImage));

// Posts
router.post('/createpost', isLoggedIn, upload.single("postimage"), wrapAsync(postController.createPost));
router.get('/editpost/:id', isLoggedIn, wrapAsync(postController.editPostPage));
router.post('/editpost/:id', isLoggedIn, wrapAsync(postController.editPost));
router.post('/deletepost/:id', isLoggedIn, wrapAsync(postController.deletePost));

// Auth
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
