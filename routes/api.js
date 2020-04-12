var express = require('express');
var router = express.Router();
const util = require('util');

router.get('/getData', function(req, res, next) {
  console.log(util.inspect(req.query, false,null,true));
  sendResponse=function(result){
    if(result)
    {
      // console.log("got result",result)
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
  let prov="\"%\""
  if(req.query.service_provider_id)
  prov=req.query.service_provider_id;
  serverjs=req.app.get('dbHandler');
  switch(req.query.type)
  {
    // User
    case "service_request":
        serverjs.user.getTrips(function(result) {
          console.log("here")
          console.log(result);
          trips = {}
          for(i in result) {
            trips[result[i].trip_id] = result[i];
            trips[result[i].trip_id].service_requests = [];
          }
          serverjs.user.getServiceRequests(function(result) {
            for(i in result) {
              if(result[i].trip_id in trips) {
                trips[result[i].trip_id].service_requests.push(result[i]);
              }
            }
            result = []
            for(trip_id in trips) {
              result.push(trips[trip_id]);
            }
            sendResponse(result);
          },req.session.uname, {});
        }, {
            user_id : "\"" + req.session.uname + "\"",
          })
    break;
    case 'new_trip' :
      serverjs.user.createTrip(sendResponse, {
        user_id : req.query.user_id,
        destination_city : req.query.destination_city,
        departure_date : req.query.departure_date,
        return_date : req.query.return_date,
      })
    case 'flight':
        serverjs.user.getFlights(sendResponse,{
          from_city: req.query.from,
          to_city: req.query.to,
          departure_time: req.query.departure_time,
          service_provider_id: prov
          
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
            console.log(result);
            sendResponse(result);
          });
        }, req.query.t_type, req.query.from, req.query.to, {
          AC: req.query.AC,
          service_provider_id: prov
        });
    break;
    case 'taxi':
        serverjs.user.getTaxis(sendResponse, {
          car_name: req.query.car_name,
          capacity: req.query.capacity,
          AC: req.query.AC,
          service_provider_id: prov
        });       
    break;
    case 'room':
        serverjs.user.getRooms(sendResponse, {
          // name: req.query.name,
          city: req.query.city,
          room_type: req.query.room_type,
          capacity: req.query.capacity,
          wifi_facility: req.query.wifi_facility,
        });      
    break;
    case 'food':
      serverjs.user.getFoodItems(sendResponse,{
        name:(req.query.fname=="")?(".*"):(req.query.fname),
        rest:(req.query.rname=="")?(".*"):(req.query.rname),
        delivers: req.query.delivers,
        service_provider_id: prov
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
    case 'noRoute_bus_train':
      serverjs.user.getBusTrains(sendResponse,req.query.t_type, req.query.from, req.query.to, {
        AC: req.query.AC,
        service_provider_id: prov
      });
    break;      
    case 'servicesByProvider':
      serverjs.service_provider[req.query.func](sendResponse,req.query.service_provider_id);
      break;
    case 'adminRequests':
      serverjs.admin.allServiceRequest(sendResponse,req.query);
      break;
    case 'route':
        serverjs.service_provider.getRoute(sendResponse,req.query.service_id);
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
router.put('/updateData', function(req, res, next) {
  // console.log("REQS");
  console.log(util.inspect(req.body, false,null,true));
  serverjs=req.app.get('dbHandler');
  serverjs.updateOneColumn(function(result){
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      isRes:true,
      msg:"Query OK: sending result",
      content:result
    }));
  },req.body);
});
router.post('/deleteData', function(req, res, next) {
  // console.log("REQS");
  sendResponse=function(result){
    if(result)
    {
      // console.log("got result",result)
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
  console.log('DElete');
  console.log(util.inspect(req.body, false,null,true));
  serverjs=req.app.get('dbHandler');
  switch(req.body.type){
    case "route":
      serverjs.deleteRoute(sendResponse,req.body.service_id);
    break;
    case "administrator":
      serverjs.deleteRow(sendResponse,'administrator',"admin_id",req.body.admin_id);
    break;
    case "user":
      serverjs.deleteRow(sendResponse,'user',"user_id",req.body.user_id);
      break;
    case 'service_provider':
      serverjs.deleteRow(sendResponse,'service_provider',"service_provider_id",req.body.service_provider_id);
      break;
    default:
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        isRes:false,
        msg:"Unknown Request sent"
      }));
      break;
  }
});
router.get('/getLocationID',function(req,res,next){
  console.log(util.inspect(req.query, false,null,true));
  serverjs=req.app.get('dbHandler');
  serverjs.getLocation(function(result){
    if(result)
    {
      if(result.length!=0)
      {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          isRes:true,
          msg:"Query OK: sending result",
          content:result[0].location_id
        }));
      }
      else{
        serverjs.count_table(function(res2){
            serverjs.insertIntoTable(function(res3){
              if(res3)
              {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  isRes:true,
                  msg:"Query OK: sending result",
                  content:'LOC'+("00000" + res2[0]['cnt']).slice(-5)
                }));
              }
              else{
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({msg:"Unknown Request sent"}))
              }
            },'location',{
              location_id:'LOC'+("00000" + res2[0]['cnt']).slice(-5),
              locality:"DUMMY",
              city:req.query.city,
              state:"DUMMY",
              country:"DUMMY",
              pincode:"000000"
            })
        },'location');
      }
    }
    else{
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({msg:"Unknown Request sent"}))
    }
  },req.query.city);
});
router.post('/insertList', function(req, res, next) {
  sendResponse=function(result){
    if(result)
    {
      // console.log("got result",result)
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
  console.log(util.inspect(req.body, false,null,true));
  serverjs=req.app.get('dbHandler');
  switch(req.body.type){
    case "route":
      serverjs.insertRoutes(sendResponse,req.body.service_id,req.body.arr);
      break;
    default:
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({msg:"Unknown Request sent"}))
      break;
  }
});
router.put('/updateList', function(req, res, next) {
  console.log("Update LIst");
  console.log(util.inspect(req.body, false,null,true));
  serverjs=req.app.get('dbHandler');
  serverjs.updateList(function(result){
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      isRes:true,
      msg:"Query OK: sending result",
      content:result
    }));
  },req.body);
});
router.post('/addService',function(req,res,next){
  sendResponse=function(result){
    if(result)
    {
      // console.log("got result",result)
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
  console.log(util.inspect(req.body, false,null,true));
  serverjs=req.app.get('dbHandler');
  serverjs.count_table(function(result){
    req.body.service_id=req.body.prefix+("00000" + result[0]['cnt']).slice(-5);
    serverjs.service_provider.register_service(function(res2){
      console.log("inside");
      console.log(req.body.prefix+("00000" + result[0]['cnt']).slice(-5));
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        isRes:true,
        msg:"Query OK: sending result",
        content:req.body.prefix+("00000" + result[0]['cnt']).slice(-5)
      }));
    },req.body.type,req.body);
  },'service');
});
module.exports = router;
