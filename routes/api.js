var express = require('express');
var router = express.Router();
const util = require('util');
const log4js = require('log4js');
const logger = log4js.getLogger("API");
router.get('/getData', function(req, res, next) {
  // logger.error(req.query.type);
  // console.log(util.inspect(req.query, false,null,true));
  let savedRes=res;
  sendResponse=function(actRes,result){
    if(result)
    {
      // console.log("got result",result)
      // logger.info(req.query.type);
      actRes.setHeader('Content-Type', 'application/json');
      actRes.end(JSON.stringify({
        isRes:true,
        msg:"Query OK: sending result",
        content:result
      }));
    }
    else{
      actRes.setHeader('Content-Type', 'application/json');
      actRes.end(JSON.stringify({
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
    case "my_trips":
        serverjs.user.getTrips(function(result) {
          logger.debug(req.session.uname);
          trips = {}
          for(i in result) {
            trips[result[i].trip_id] = result[i];
            trips[result[i].trip_id].service_requests = [];
          }
          serverjs.user.getServiceRequests(function(result) {
            completed_requests = []
            for(i in result) {
              if((result[i].status == "Completed" || result[i].status == "Paid") && (result[i].service_rating == null)) {
                completed_requests.push(result[i]);
              }
              if(result[i].trip_id in trips) {
                trips[result[i].trip_id].service_requests.push(result[i]);
                trips[result[i].trip_id].show_requests = false;
              }
            }
            result = []
            for(trip_id in trips) {
              result.push(trips[trip_id]);
            }
            sendResponse(res,{result, completed_requests});
          },req.query.username, {request_id : "\"%\""});
        }, {
            user_id : "\"" + req.query.username + "\"",
          })
    break;
    case "service_request":
      serverjs.user.getServiceRequests(function(result){sendResponse(res,result);},req.session.uname, {
        status: "\"Completed\""
      });

    break;
    case 'new_trip':
      serverjs.count_table( function(result) {
        serverjs.insertIntoTable(function(result){sendResponse(res,result);}, 'trip', {
          trip_id:"\"TRP" + ("00000" + (result[0]['cnt'] + 1)).slice(-5) + "\"",
          user_id: "\"" + req.session.uname + "\"",
          destination_city : "\"" + req.query.destination_city + "\"",
          departure_date : "\"" + req.query.departure_date + "\"",
          return_date : "\"" + req.query.return_date + "\"",
        });
      } , "trip");
    break;
    case 'new_trip_return_id':
      serverjs.count_table( function(result) {
        serverjs.insertIntoTable(function(re1){
          if(result)
          {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              isRes:true,
              msg:"Query OK: sending result",
              content:"\"TRP" + ("00000" + (result[0]['cnt'] + 1)).slice(-5) + "\""
            }));
          }
        }, 'trip', {
          trip_id:"\"TRP" + ("00000" + (result[0]['cnt'] + 1)).slice(-5) + "\"",
          user_id: "\"" + req.session.uname + "\"",
          destination_city : "\"" + req.query.destination_city + "\"",
          departure_date : "\"" + req.query.departure_date + "\"",
          return_date : "\"" + req.query.return_date + "\"",
        });
      } , "trip");
    break;
    case 'rate_service':
      serverjs.user.rateService(function(result){sendResponse(res,result);}, req.query.request_id, req.query.service_rating, req.query.comments);
    break;
    case 'flight':
        serverjs.user.getFlights(function(result){sendResponse(res,result);},{
          from_city: req.query.from,
          to_city: req.query.to,          
        });       
    break;
    case 'bus_train':
      console.log(req.query.t_type);
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
            result = []
            for(i in result_) {
              result_[i].route.sort(function(a, b) {return a.arrival_time.localeCompare(b.arrival_time)});
              result.push(result_[i])
            }
            console.log(result);
            sendResponse(res,result);
          });
        }, req.query.t_type, req.query.from, req.query.to, {
          AC: req.query.AC,
        });
    break;
    case 'taxi':
        serverjs.user.getTaxis(function(result){sendResponse(res,result);}, {
          car_name: req.query.car_name,
          capacity: req.query.capacity,
          AC: req.query.AC,
        });       
    break;
    case 'room':
        serverjs.user.getRooms(function(result){sendResponse(res,result);}, {
          name: req.query.name,
          city: req.query.city,
          room_type: req.query.room_type,
          name: req.query.name,
          capacity: req.query.capacity,
          wifi_facility: req.query.wifi_facility,
          AC: req.query.AC,
          star: req.query.star,
        });      
    break;
    case 'food':
      serverjs.user.getFoodItems(function(result){sendResponse(res,result);},{
        name:(req.query.fname=="")?(".*"):(req.query.fname),
        rest:(req.query.rname=="")?(".*"):(req.query.rname),
        city:(req.query.city=="")?(".*"):(req.query.city),
        delivers: req.query.delivers,
      });
    break;
    case 'tourist_spot':
        serverjs.user.getTouristSpots(function(result){sendResponse(res,result);}, {
          name: req.query.name,
          type: req.query.t_type,
        }, req.query.city);   
    break;
    case 'guide':
        serverjs.user.getGuides(function(result){sendResponse(res,result);}, {
        }, req.query.tourist_spot_name, req.query.tourist_spot_city);   
    break;
    case "review":
      serverjs.getServiceReview(function(result){sendResponse(res,result);},req.query.service_id);
      break;
    case 'trip':
      serverjs.user.getTrips(function(result){sendResponse(res,result);}, {
        user_id : "\"" + req.session.uname + "\""
      })
    break;
    case 'request':
      serverjs.count_table( function(result) {
        serverjs.insertIntoTable(function(result){sendResponse(res,result);}, 'service_request', {
          request_id:"\"RST" + ("00000" + result[0]['cnt']).slice(-5) + "\"",
          trip_id : req.query.trip_id,
          service_id : req.query.service_id,
          request_timestamp : "NOW()",
          number_days : req.query.number_of_days,
          quantity : req.query.quantity,
          cost : req.query.cost,
          status : "\"Pending\"",
          user_rating : "null",
          service_rating : "null",
          comments : "null",
          service_required_date : req.query.service_required_date,
          completion_date: "null",
        });
      } , "service_request");
    break;
    case 'plan_trip':
      serverjs.user.planTrip(function(result){sendResponse(res,result);}, {
        user_id: req.query.user_id,
        destination_city: req.query.destination_city ,
        user_city: req.query.user_city,
        number_of_people: req.query.number_of_people,
        number_of_days: req.query.number_of_days,
        budget: req.query.budget,
        from_home: req.query.from_home,
        weightage: { 
          food: req.query.food_weightage, 
          taxi: req.query.taxi_weightage, 
          room: req.query.room_weightage, 
          tourist_spot: req.query.tourist_spot_weightage, 
          flight: req.query.flight_weightage, 
        }});
    break;
    // Admin
    case 'admin':
      serverjs.admin.getAdmins(function(result){sendResponse(res,result);}, {
        admin_id: req.query.admin_id,
        name: req.query.name,
        role: req.query.role,
        email: req.query.email
      });
    break;
    case 'user':
        serverjs.admin.getUsers(function(result){sendResponse(res,result);}, {
          user_id : req.query.user_id,
          name : req.query.name,
          email : req.query.email,
          phone_no : req.query.phone_no,
          city : req.query.city,        
        });
    break;
    case 'service_provider':
        serverjs.admin.getServiceProviders(function(result){sendResponse(res,result);}, {
          service_provider_id : req.query.service_provider_id,
          name : req.query.name,
          domain : req.query.domain,
          active : req.query.active,
          approved : req.query.approved,
        });
    break;
    case 'noRoute_bus_train':
      serverjs.user.getBusTrains(function(result){sendResponse(res,result);},req.query.t_type, req.query.from, req.query.to, {
        AC: req.query.AC,
        service_provider_id: prov
      });
    break;      
    case 'servicesByProvider':
      serverjs.service_provider[req.query.func](function(result){sendResponse(res,result);},req.query.service_provider_id);
      break;
    case 'requestByProvider':
      serverjs.service_provider.providerGetRequests(function(result){sendResponse(res,result);},req.session.uname);
      break;
    case 'adminRequests':
      serverjs.admin.allServiceRequest(function(result){sendResponse(res,result);},req.query);
      break;
    case 'route':
        serverjs.service_provider.getRoute(function(result){sendResponse(res,result);},req.query.service_id);
        break;
    case 'singleColumn':
      serverjs.getAutoCorrectPredictions(function(result){sendResponse(res,result);},req.query.table_name,req.query.column_name);
      break;
    case 'FilteredSingleColumn':
      serverjs.getFilteredAutoCorrectPrediction(function(result){sendResponse(res,result);},req.query);
      break;
    case 'allQueries':
      // logger.info(req.query.uid,req.query.pid);
      serverjs.getFilteredQueries(function(result){sendResponse(res,result);},req.query.uid,req.query.pid);
      break;
    case 'analyseMaxServiceRequests':
      serverjs.service_provider.analyseMaxServiceRequests(function(result){sendResponse(res,result);}, req.query.domain);
      break;
    case 'analyseMaxRating':
      serverjs.service_provider.analyseMaxRating(function(result){sendResponse(res,result);}, req.query.domain);
      break;
    case 'analyseMinQueryResponseTime':
      serverjs.service_provider.analyseMinQueryResponseTime(function(result){sendResponse(res,result);}, req.query.domain);
      break;
    case 'analyseUserByRegion':
      serverjs.service_provider.analyseUserByRegion(function(result){sendResponse(res,result);}, req.query.service_provider_id);
      break;
    case 'analyseStatusOfRequests':
      serverjs.service_provider.analyseStatusOfRequests(function(result){sendResponse(res,result);}, req.query.service_provider_id);
      break;
    case 'deactivate_user':
      serverjs.user.deactivateUser(function(result){sendResponse(res,result);}, req.query.user_id);
      break;
    case 'deactivate_service_provider':
      serverjs.service_provider.deactivateServiceProvider(function(result){sendResponse(res,result);}, req.query.service_provider_id);
      break;
    case 'reactivate_user':
      serverjs.user.reactivateUser(function(result){sendResponse(res,result);}, req.query.user_id);
      break;
    case 'reactivate_service_provider':
      serverjs.service_provider.reactivateServiceProvider(function(result){sendResponse(res,result);}, req.query.service_provider_id);
      break;
    default:
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({msg:"Unknown Request sent"}))

  }
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
router.get('/getTouristSpotID',function(req,res,next){
  console.log(util.inspect(req.query, false,null,true));
  serverjs=req.app.get('dbHandler');
  serverjs.getTouristSpot(function(result){
    if(result)
    {
      if(result.length!=0)
      {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          isRes:true,
          msg:"Query OK: sending result",
          content:result[0].tourist_spot_id
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
                content:'TOR'+("00000" + res2[0]['cnt']).slice(-5)
              }));
            }
          },'tourist_spot',{
            tourist_spot_id:'TOR'+("00000" + res2[0]['cnt']).slice(-5),
            name:req.query.name,
            location_id:req.query.location_id,
            type:req.query.type,
            entry_fee:req.query.entry_fee
          })
        },'tourist_spot');
      }
    }
    else{
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({msg:"Unknown Request sent"}))
    }
  },req.query.name,req.query.type,req.query.city);
});
router.post('/insertquery', function(req, res, next) {
  serverjs=req.app.get('dbHandler');
  sendResponse=function(actRes,result){
    if(result)
    {
      // console.log("got result",result)
      actRes.setHeader('Content-Type', 'application/json');
      actRes.end(JSON.stringify({
        isRes:true,
        msg:"Query OK: sending result",
        content:result
      }));
    }
    else{
      actRes.setHeader('Content-Type', 'application/json');
      actRes.end(JSON.stringify({
        isRes:false,
        msg:"Unknown Request sent"
      }));
    }
  };
  serverjs.insertQuery(function(result){sendResponse(res,result);},req.body);
});
router.post('/insertList', function(req, res, next) {
  sendResponse=function(actRes,result){
    if(result)
    {
      // console.log("got result",result)
      actRes.setHeader('Content-Type', 'application/json');
      actRes.end(JSON.stringify({
        isRes:true,
        msg:"Query OK: sending result",
        content:result
      }));
    }
    else{
      actRes.setHeader('Content-Type', 'application/json');
      actRes.end(JSON.stringify({
        isRes:false,
        msg:"Unknown Request sent"
      }));
    }
  };
  console.log(util.inspect(req.body, false,null,true));
  serverjs=req.app.get('dbHandler');
  switch(req.body.type){
    case "route":
      serverjs.insertRoutes(function(result){sendResponse(res,result);},req.body.service_id,req.body.arr);
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
    req.body.service_id='"'+req.body.prefix+("00000" + result[0]['cnt']).slice(-5)+'"';
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
