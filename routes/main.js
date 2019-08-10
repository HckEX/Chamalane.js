var express = require("express");
var router = express.Router();
var passport = require("../config/passport");

router.get("/", function(req, res){
  res.render("main/index");
});

router.get("/helloworld", function(req, res){
  res.render("main/helloworld");
});

router.get("/login", function (req,res) {
  var username = req.flash("username")[0];
  var errors = req.flash("errors")[0] || {};
  res.render("main/login", {
   username:username,
   errors:errors
  });
 });

 router.post("/login",
 function(req,res,next){
  var errors = {};
  var isValid = true;
  if(!req.body.username){
   isValid = false;
   errors.username = "Username is required!";
  }
  if(!req.body.password){
   isValid = false;
   errors.password = "Password is required!";
  }

  if(isValid){
   next();
  } else {
   req.flash("errors",errors);
   res.redirect("/login");
  }
 },

 passport.authenticate("local-login", {
  successRedirect : "/",
  failureRedirect : "/login"
 }
));

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
 });

module.exports = router;