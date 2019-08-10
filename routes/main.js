var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
  res.render("main/index");
});
router.get("/helloworld", function(req, res){
  res.render("main/helloworld");
});

module.exports = router;