var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.sendFile(req.app.get('root')+'/public/main.html');
  var uname=req.session.uname;
  res.render('index',{title:"Main Page (Index)",name:uname});
  console.log("Index Rendered");
});
router.get('/logout', function(req, res, next) {
  // res.sendFile(req.app.get('root')+'/public/main.html');
  req.session.uname=null;
  res.redirect('/');
  console.log("LogOut");
});
module.exports = router;
