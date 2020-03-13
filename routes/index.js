var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.sendFile(req.app.get('root')+'/public/main.html');
  var uname=req.session.uname;
  res.render('user',{title:"Main Page (Index)",name:uname});
  console.log("Index Rendered");
});
router.get('/logout', function(req, res, next) {
  // res.sendFile(req.app.get('root')+'/public/main.html');
  req.session.uname=null;
  res.redirect('/');
  console.log("LogOut");
});
router.get('/signup', function(req, res, next) {
  // res.sendFile(req.app.get('root')+'/public/main.html');
  res.render('signup',{title:"Make new Account"});
  console.log("signup Rendered");
});
router.post('/signup',function(req,res,next){
  console.log("BODY: "+req.body.uid);
  // req.session.uname=req.body.uid;
  res.redirect('/..');
  next();
});
module.exports = router;
