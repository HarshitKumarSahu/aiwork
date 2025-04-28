const userModel = require("../models/users");

exports.uploadProfileImage = async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
};
