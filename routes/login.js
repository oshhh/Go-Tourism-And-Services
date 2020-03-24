var express = require('express');
var router = express.Router();
const util = require('util');

router.get('/', function(req, res, next) {
  var msg=req.session.msg;
  var redColor=true;
  if(msg==null)
    msg="";
  else if(msg[0]=="S"){
    msg=msg.substring(1);
    redColor=false;
  }
  else{
    msg=msg.substring(1);
    redColor=true;
  }
  res.render('login',{title:"Login to TKG",message:msg,red:redColor});
  console.log("Login Rendered");
});
router.post('/',function(req,res,next){
  // console.log("BODY: "+req.body.uid);
  console.log(util.inspect(req.body, false,null,true));
  uname=req.body.uid;
  authenticate=function(result){
    console.log(result);
    if(!result)
    {
      req.session.msg="DUsername does not exists";
      res.redirect('/..');
      return;
    }
    console.log("got result");
    console.log(util.inspect(result, false,null,true));
    if(result.length==0)
    {
      req.session.msg="DUsername does not exists";
      res.redirect('/..');
    }
    else if(result[0].password!=req.body.password)
    {
      req.session.msg="DYou forgot the password";
      res.redirect('/..');
    }
    else{
      req.session.msg="";
      req.session.uname=req.body.uid;
      res.redirect('/..');
    }
  }
  if(uname.startsWith("USR"))
  {
    req.app.get('dbHandler').login_user(authenticate,uname);
  }
  else if(uname.startsWith("ADM"))
  {
    req.app.get('dbHandler').login_administrator(authenticate,uname);
  }
  else
  {
    req.app.get('dbHandler').login_service_provider(authenticate,uname);
  }
  // res.redirect('/..');
  // next();
});
module.exports = router;
