const postModel = require("../models/post.model");
const userModel = require("../models/users.model");
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

// exports.createPost = async (req, res) => {
//   const user = await userModel.findOne({ username: req.session.passport.user });
//   let imageFilename = null;

//   if (req.body.imageOption === 'upload') {
//     if (req.file) {
//       imageFilename = {
//         url: req.file.path,
//         filename: req.file.filename
//       };
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
// };

// exports.createPost = async (req, res) => {
//   const user = await userModel.findOne({ username: req.session.passport.user });

//   if (!req.file) {
//     return res.send("Please upload an image.");
//   }

//   const post = await postModel.create({
//     user: user._id,
//     title: req.body.title,
//     description: req.body.description,
//     image: {
//       url: req.file.path,
//       filename: req.file.filename,
//     },
//   });

//   user.post.push(post._id);
//   await user.save();
//   res.redirect("/profile");
// };


exports.createPost = async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });

  let imageData;

  if (req.file) {
    // File uploaded case
    imageData = {
      url: req.file.path,    // This might be a local path or Cloudinary path depending on your multer setup
      filename: req.file.filename,
    };
  } else if (req.body.generatedImageFilename) {
    // Generated image URL case
    imageData = {
      url: req.body.generatedImageFilename,  // Cloudinary URL string sent from frontend
      filename: null,  // or you can parse the filename from the URL if needed
    };
  } else {
    return res.send("Please upload or generate an image.");
  }

  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: imageData,
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

// exports.deletePost = async (req, res) => {
//   const post = await postModel.findById(req.params.id);
//   const user = await userModel.findOne({ username: req.session.passport.user });

//   user.post.pull(post._id);
//   await user.save();

//   const { cloudinary } = require('../utils/cloudConfig');
//   await cloudinary.uploader.destroy(post.image.filename);


//   await postModel.findByIdAndDelete(req.params.id);
//   res.redirect('/profile');
// };

exports.deletePost = async (req, res) => {
  const post = await postModel.findById(req.params.id);
  const user = await userModel.findOne({ username: req.session.passport.user });

  if (!post) return res.status(404).send("Post not found");

  // Remove post reference from user
  user.post.pull(post._id);
  await user.save();

  // Destroy image if public_id exists
  const { cloudinary } = require('../utils/cloudConfig');
  if (post.image.filename) {
    try {
      await cloudinary.uploader.destroy(post.image.filename);
    } catch (err) {
      console.error("Error deleting image from Cloudinary:", err);
    }
  }

  await postModel.findByIdAndDelete(req.params.id);
  res.redirect('/profile');
};
