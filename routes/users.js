var express = require("express");
var router = express.Router();
var User  = require("../models/User");


router.get("/", function(req, res){
 User.find({})
 .sort({username:1})
 .exec(function(err, users){
  if(err) return res.json(err);
  res.render("users/index", {users:users});
 });
});


router.get("/new", function(req, res){
 res.render("users/new", {user:{}});
});

router.post("/", function(req, res){
 User.create(req.body, function(err, user){
  if(err) return res.json(err);
  res.redirect("/users");
 });
});

router.get("/:username", function(req, res){
 User.findOne({username:req.params.username}, function(err, user){
  if(err) return res.json(err);
  res.render("users/show", {user:user});
 });
});

router.get("/:username/edit", function(req, res){
 User.findOne({username:req.params.username}, function(err, user){
  if(err) return res.json(err);
  res.render("users/edit", {user:user});
 });
});

router.put("/:username",function(req, res, next){
 User.findOne({username:req.params.username}) // 2-1
 .select("password") // 2-2
 .exec(function(err, user){
  if(err) return res.json(err);

  user.originalPassword = user.password;
  user.password = req.body.newPassword? req.body.newPassword : user.password; // 2-3
  for(var p in req.body){ // 2-4
   user[p] = req.body[p];
  }

  user.save(function(err, user){
   if(err) return res.json(err);
   res.redirect("/users/"+req.params.username);
  });
 });
});

module.exports = router;