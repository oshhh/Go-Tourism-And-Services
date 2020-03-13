var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login',{title:"Login to TKG"});
  console.log("Login Rendered");
});
router.post('/',function(req,res,next){
  console.log("BODY: "+req.body.uid);
  req.session.uname=req.body.uid;
  res.redirect('/..');
  next();
});
module.exports = router;
