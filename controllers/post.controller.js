const postModel = require("../models/post");
const userModel = require("../models/users");
const fs = require('fs');
const path = require('path');

exports.feed = async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const posts = await postModel.find().populate("user");

  const shuffleArray = (array) => array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  res.render('feed', { user, post: shuffleArray(posts), nav: true });
};

exports.createPost = async (req, res) => {
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
    if (!imageFilename) return res.send("Image generation failed.");
  } else {
    return res.send("Invalid image option.");
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
};

exports.editPostPage = async (req, res) => {
  const post = await postModel.findById(req.params.id);
  const user = await userModel.findById(post.user);
  res.render('editpost', { post, user, nav: true });
};

exports.editPost = async (req, res) => {
  const { title, description } = req.body;
  await postModel.findByIdAndUpdate(req.params.id, { title, description });
  res.redirect('/profile');
};

exports.deletePost = async (req, res) => {
  const post = await postModel.findById(req.params.id);
  const user = await userModel.findOne({ username: req.session.passport.user });

  user.post.pull(post._id);
  await user.save();

  const imagePath = path.join(__dirname, '..', 'public', 'images', 'uploads', post.image);
  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

  await postModel.findByIdAndDelete(req.params.id);
  res.redirect('/profile');
};
