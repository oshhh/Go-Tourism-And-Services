var express = require('express');
var router = express.Router();
const util = require('util');

router.get('/getData', function(req, res, next) {
  console.log(util.inspect(req.query, false,null,true));
  serverjs=req.app.get('dbHandler');
  switch(req.query.type)
  {
    case 'food':
      serverjs.getFoodItems(function(result){
        if(result)
        {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            isRes:true,
            msg:"Query OK: sending result",
            content:result
          }));
        }
        else{
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            isRes:false,
            msg:"Unknown Request sent"
          }));
        }
      },{
        name:(req.query.fname=="")?(".*"):(req.query.fname),
        rest:(req.query.rname=="")?(".*"):(req.query.rname),
        delivery:(req.query.delivery==1)?("Y"):(".*")
      });
    break;
    case "review":
      serverjs.getServiceReview(function(result){
        if(result)
        {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            isRes:true,
            msg:"Query OK: sending result",
            content:result
          }));
        }
        else{
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            isRes:false,
            msg:"Unknown Request sent"
          }));
        }
      },req.query.service_id);
      break;
    default:
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({msg:"Unknown Request sent"}))
  }
;
});

module.exports = router;
