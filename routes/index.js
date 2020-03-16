var express = require('express');
const util = require('util');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.sendFile(req.app.get('root')+'/public/main.html');
  var uname=req.session.uname;
  if(uname.startsWith("ADM"))
  {
    res.render('admin',{title:"Main Page (Index)",name:uname,role:"Master Admin"});
  }
  else if(uname.startsWith("USR")){
    res.render('user',{title:"Main Page (Index)",name:uname});
  }
  else
  {
    res.render('user',{title:"Main Page (Index)",name:uname});
  }
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
  console.log(util.inspect(req.body, false,null,true));
  serverjs=req.app.get('dbHandler');
  if(req.body.acc_type=='0')
  {
    // Use req.body.aname, req.body.arole, req.body.amail, req.body.apass, req.body.apass2
    
  }
  else if(req.body.acc_type=='1'){
    // These values always exists : req.body.sname, req.body.spass, req.body.spass2
    //req.body.wifi/delivery for checkboxes
    //req.body.slocality/scity/sstate/spin for both hotel & restaurant
    //cuisine for restaurant only
      if(req.body.providerType=="Hotel")
      {
          
      }
      else if(req.body.providerType=="Restaurant")
      {

      }
      else{

      }
  }
  else if(req.body.acc_type=='2'){
    //User Data availabe vars in req.body : uname,umail,utel,upass,upass2,uadd,ucity
  }
  else{
    console.log("Bad POST req");
  }
  res.redirect('/..');
  // next();
});
module.exports = router;
