if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

var express = require('express');
var router = express.Router();
const passport = require('passport');
const upload = require("./multer.route");
const wrapAsync = require("../utils/wrapAsync");
// require('dotenv').config();

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
router.get('/', wrapAsync(userController.getUsers));;
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
