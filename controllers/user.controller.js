const userModel = require("../models/users.model");
const postModel = require("../models/post.model");
const fs = require('fs');
const path = require('path');

exports.getUsers =  async (req, res) => {
  const users = await userModel.find({}).populate('post');
  res.render('index', { nav: true, users });
};

exports.getProfile = async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate("post");
  res.render('profile', { user, nav: true });
};

exports.editProfilePage = async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('editprofile', { user, nav: true });
};

exports.editProfile = async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.name = req.body.name || user.name;
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.contact = req.body.contact || user.contact;
  await user.save();
  res.redirect('/profile');
};

exports.deleteUser = async (req, res, next) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const posts = await postModel.find({ user: user._id });

  // posts.forEach(post => {
  //   const imagePath = path.join(__dirname, '..', 'public', 'images', 'uploads', post.image);
  //   if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  // });

  const { cloudinary } = require('../utils/cloudConfig');

  for (const post of posts) {
    if (post.image && post.image.filename) {
      await cloudinary.uploader.destroy(post.image.filename);
    }
  }

  await postModel.deleteMany({ user: user._id });
  await userModel.findByIdAndDelete(user._id);

  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
};
