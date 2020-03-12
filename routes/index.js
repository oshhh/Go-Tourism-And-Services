var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.sendFile(req.app.get('root')+'/public/main.html');
  res.render('index',{title:"Main Page (Index)",name:"NoName"});
  console.log("Index Rendered");
});

module.exports = router;
