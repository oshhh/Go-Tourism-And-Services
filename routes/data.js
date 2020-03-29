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
    case 'flight':
        serverjs.getFlight(sendResponse,{
          from_city: req.query.from,
          to_city: req.query.to,
          departure_time: req.query.departure_time,
        });       
    break;
    case 'taxi':
        serverjs.getTaxi(sendResponse, {
          car_name: req.query.car_name,
          capacity: req.query.capacity,
          AC: req.query.AC,
        });       
    break;
    case 'food':
      serverjs.getFoodItems(sendResponse,{
        name:(req.query.fname=="")?(".*"):(req.query.fname),
        rest:(req.query.rname=="")?(".*"):(req.query.rname),
        delivers: req.query.delivers
      });
    break;
    case "service_request":
      serverjs.getServiceRequests(function(result){
        if(result)
        {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            isRes:true,
            msg:"Query OK: sending result",
            content:result
          }));
          console.log("results obtained!")
        }
        else{
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            isRes:false,
            msg:"Unknown Request sent"
          }));
        }
      },req.session.uname,
      {});
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
