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
    // User
    case 'flight':
        serverjs.user.getFlights(sendResponse,{
          from_city: req.query.from,
          to_city: req.query.to,
          departure_time: req.query.departure_time
        });       
    break;
    case 'bus_train':
        serverjs.user.getBusTrains(function(result){
          routes = {}
          console.log("result");
          result_ = {}
          for(bus in result) {
            result_[result[bus].service_id] = result[bus];
            bus = result[bus];
            result_[bus.service_id].route = [];
          }
          serverjs.user.getRoutes(function(routes) {
            for(i in routes) {
              if(routes[i].service_id in result_) {
                result_[routes[i].service_id].route.push(routes[i]);
              }
            }
            for(i in result) {
              result[i] = result_[result[i].service_id]
            }
            sendResponse(result);
          });
        }, req.query.t_type, req.query.from, req.query.to, {
          AC: req.query.AC
        });      
    break;
    case 'taxi':
        serverjs.user.getTaxis(sendResponse, {
          car_name: req.query.car_name,
          capacity: req.query.capacity,
          AC: req.query.AC
        });       
    break;
    case 'room':
        serverjs.user.getRooms(sendResponse, {
          // name: req.query.name,
          city: req.query.city,
          room_type: req.query.room_type,
          capacity: req.query.capacity,
          wifi_facility: req.query.wifi_facility
        });      
    break;
    case 'food':
      serverjs.user.getFoodItems(sendResponse,{
        name:(req.query.fname=="")?(".*"):(req.query.fname),
        rest:(req.query.rname=="")?(".*"):(req.query.rname),
        delivers: req.query.delivers
      });
    break;
    case 'tourist_spot':
        serverjs.user.getTouristSpots(sendResponse, {
          name: req.query.name,
          type: req.query.t_type,
        }, req.query.city);   
    break;
    case 'guide':
        serverjs.user.getGuides(sendResponse, {
        }, req.query.tourist_spot_name, req.query.tourist_spot_city);   
    break;
    case "service_request":
        serverjs.user.getServiceRequests(sendResponse,req.session.uname,
        {});
    break;
    case "review":
      serverjs.user.getServiceReview(sendResponse,req.query.service_id);
      break;

    case 'trip':
      serverjs.user.getTrips(sendResponse,req.query.user_id)
      break;
    // Admin
    case 'admin':
      serverjs.admin.getAdmins(sendResponse, {
        admin_id: req.query.admin_id,
        name: req.query.name,
        role: req.query.role,
        email: req.query.email
      });
    break;
    case 'user':
        serverjs.admin.getUsers(sendResponse, {
          user_id : req.query.user_id,
          name : req.query.name,
          email : req.query.email,
          phone_no : req.query.phone_no,
          city : req.query.city,        
        });
    break;
    case 'service_provider':
        serverjs.admin.getServiceProviders(sendResponse, {
          service_provider_id : req.query.service_provider_id,
          name : req.query.name,
          domain : req.query.domain,
          active : req.query.active,
          approved : req.query.approved,
        });
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
