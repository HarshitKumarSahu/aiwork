const userModel = require("../models/users.model");

exports.uploadProfileImage = async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileImage = req.file.path;
  await user.save();
  res.redirect("/profile");
};
