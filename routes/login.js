var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login',{title:"Login to TKG"});
  console.log("Login Rendered");
});

module.exports = router;
