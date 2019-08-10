var express = require("express");
var router = express.Router();
var User = require("../models/User");
var util = require("../util");


router.get("/", util.isLoggedin, function (req, res) {
  User.find({})
    .sort({ username: 1 })
    .exec(function (err, users) {
      if (err) return res.json(err);
      res.render("users/index", { users: users });
    });
});

router.get("/new", function (req, res) {
  var user = req.flash("user")[0] || {};
  var errors = req.flash("errors")[0] || {};
  res.render("users/new", { user: user, errors: errors });
});

router.post("/", function (req, res) {
  User.create(req.body, function (err, user) {
    if (err) {
      req.flash("user", req.body);
      req.flash("errors", util.parseError(err)); // 1
      return res.redirect("/users/new");
    }
    res.redirect("/users");
  });
});

router.get("/:username", util.isLoggedin, function (req, res) {
  User.findOne({ username: req.params.username }, function (err, user) {
    if (err) return res.json(err);
    res.render("users/show", { user: user });
  });
});

router.get("/:username/edit", util.isLoggedin, checkPermission, function (req, res) {
  var user = req.flash("user")[0];
  var errors = req.flash("errors")[0] || {};
  if (!user) {
    User.findOne({ username: req.params.username }, function (err, user) {
      if (err) return res.json(err);
      res.render("users/edit", { username: req.params.username, user: user, errors: errors });
    });
  } else {
    res.render("users/edit", { username: req.params.username, user: user, errors: errors });
  }
});

router.put("/:username", util.isLoggedin, checkPermission, function (req, res, next) {
  User.findOne({ username: req.params.username })
    .select({ password: 1 })
    .exec(function (err, user) {
      if (err) return res.json(err);

      // update user object
      user.originalPassword = user.password;
      user.password = req.body.newPassword ? req.body.newPassword : user.password; // 2-3
      for (var p in req.body) { // 2-4
        user[p] = req.body[p];
      }

      // save updated user
      user.save(function (err, user) {
        if (err) {
          req.flash("user", req.body);
          req.flash("errors", util.parseError(err)); // 1
          return res.redirect("/users/" + req.params.username + "/edit");
        }
        res.redirect("/users/" + req.params.username);
      });
    });
});

module.exports = router;

function checkPermission(req, res, next){
  User.findOne({username:req.params.username}, function(err, user){
   if(err) return res.json(err);
   if(user.id != req.user.id) return util.noPermission(req, res);
 
   next();
  });
 }