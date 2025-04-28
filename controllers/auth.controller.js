const passport = require("passport");
const userModel = require("../models/users");

exports.register = (req, res) => {
  const data = new userModel({
    username: req.body.username,
    name: req.body.fullname,
    email: req.body.email,
    contact: req.body.contact,
  });

  userModel.register(data, req.body.password)
    .then(() => passport.authenticate("local")(req, res, () => res.redirect("/profile")));
};

exports.login = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/profile",
});

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};
