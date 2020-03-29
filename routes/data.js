var express = require('express');
var router = express.Router();
const util = require('util');

router.get('/getData', function(req, res, next) {
  console.log(util.inspect(req.query, false,null,true));
  sendResponse=function(result){
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
  };
  serverjs=req.app.get('dbHandler');
  switch(req.query.type)
  {
    case 'food':
      serverjs.getFoodItems(sendResponse,{
        name:(req.query.fname=="")?(".*"):(req.query.fname),
        rest:(req.query.rname=="")?(".*"):(req.query.rname),
        delivery:(req.query.delivery==1)?("Y"):(".*")
      });
    break;
    case "review":
      serverjs.getServiceReview(sendResponse,req.query.service_id);
      break;
    case 'trip':
      serverjs.getTrips(sendResponse,req.query.user_id)
      break;
    default:
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({msg:"Unknown Request sent"}))
  }
;
});
router.post('/service_request',function(req, res, next){
  console.log(util.inspect(req.body, false,null,true));
  serverjs=req.app.get('dbHandler');
  //insert into table service Request
});

module.exports = router;
