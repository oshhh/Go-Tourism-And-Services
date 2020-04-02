var express = require('express');
const util = require('util');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.sendFile(req.app.get('root')+'/public/main.html');
  var uname=req.session.uname;
  serverjs=req.app.get('dbHandler');
  if(uname.startsWith("ADM"))
  {
    serverjs.getAdminInfo(function(result){
      if(result)
      {
        res.render('admin',{
          title:"Admin Dashboard",
          uid:result[0].admin_id,
          name:result[0].name,
          role:result[0].role
        });
      }
      else{
        req.session.msg="DAccount information invalid";
        res.redirect('/login');
      }
    },uname);
  }
  else if(uname.startsWith("USR")){
    serverjs.getUserInfo(function(result)
    {
      if(result)
      {
        res.render('user',{
          title:"User Dashboard",
          name:result[0].name,
          uid:uname
        });
      }
      else{
        req.session.msg="DAccount information invalid";
        res.redirect('/login');
      }
    },uname);
  }
  else
  {
    res.render('provider',{
      title:"Providers Dashboard",
      uid:"RES00001",
      name:"as",
    });
    // res.render('user',{title:"Main Page (Index)",name:uname});
  }
  console.log("Index Rendered");
});
router.get('/logout', function(req, res, next) {
  // res.sendFile(req.app.get('root')+'/public/main.html');
  req.session.uname=null;
  res.redirect('/');
  console.log("LogOut");
});
module.exports = router;
