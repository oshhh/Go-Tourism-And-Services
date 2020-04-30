var express = require('express');
const util = require('util');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.sendFile(req.app.get('root')+'/public/main.html');
  res.render('signup',{title:"Make new Account"});
  console.log("signup Rendered");
});
router.post('/',function(req,res,next){
  console.log(util.inspect(req.body, false,null,true));
  serverjs=req.app.get('dbHandler');
  if(req.body.acc_type=='0')
  {
    // Use req.body.aname, req.body.arole, req.body.amail, req.body.apass, req.body.apass2
    serverjs.count_table(function(result){
      data={
        admin_id:'ADM'+("00000" + result[0]['cnt']).slice(-5),
        name:req.body.aname,
        role:req.body.arole,
        email:req.body.amail,
        password:req.body.apass2,
      }
      // console.log("sending");
      // console.log(data);
      serverjs.admin.register_administrator(function(result){
        if(result)
        {
          req.session.msg="SAccount Created Succesfully, Login with your username: "+data.admin_id;
          res.redirect('/..');
        }
        else{
          req.session.msg="DAccount creation failed, try again";
          res.redirect('/..');
        }
      },data);
    },'administrator');

  }
  else if(req.body.acc_type=='1'){
    // These values always exists : req.body.sname, req.body.spass, req.body.spass2
    //req.body.wifi/delivery for checkboxes
    //req.body.slocality/scity/sstate/spin for both hotel & restaurant
    //cuisine for restaurant only
    console.log("in type 1");
    serverjs.count_table(function(resultSPR){
      prefix='';
      switch(req.body.providerType){
        case 'hotel':
          prefix='HOT';
          break;
        case 'restaurant':
          prefix="RES";
          break;
        case 'airline':
          prefix="AIR";
          break;
        case 'taxi provider':
          prefix="TAP";
          break;
        case 'bus provider':
          prefix="BPR";
          break;
        case 'train provider':
          prefix="TRP";
          break;
        case 'guide provider':
          prefix="GUP";
          break;
      }
      data={
        approved:"\"N\"",
        service_provider_id: "\"" + prefix+("00000" + resultSPR[0]['cnt']).slice(-5) + "\"",
        name: "\"" + req.body.sname + "\"",
        password: "\"" + req.body.spass2 + "\"",
        domain: "\"" + req.body.providerType + "\"",
        active:"\"Y\""
      }
      serverjs.insertIntoTable(function(result){
        if(result)
        {
          if(req.body.providerType=='hotel' || req.body.providerType=='restaurant')
          {
            serverjs.getLocation(function(resLoc){ 
              let addnewLoc=false;
              oldLoc="";
              if(resLoc[0])
              {
                console.log(resLoc);
                if(resLoc.legth==0)
                  addnewLoc=true;
                else{
                  oldLoc=resLoc[0].location_id;
                }
              }
              else{
                addnewLoc=true;
              }
              if(addnewLoc)
              {
                serverjs.count_table(function(resultCount){
                  locData={
                    location_id:"\"LOC"+("00000" + resultCount[0]['cnt']).slice(-5) + "\"",
                    locality:"\"" + req.body.slocality + "\"",
                    city:"\"" + req.body.scity + "\"",
                    state:"\"" + req.body.sstate + "\"",
                    country:"\"India\"",
                    pincode:"\"" + req.body.spin + "\""
                  }
                  serverjs.addLocation(function(result){
                    if(result)
                    {
                      if(req.body.providerType=="hotel")
                      {
                        hData={
                          service_provider_id:"\"" + prefix+("00000" + resultSPR[0]['cnt']).slice(-5) + "\"",
                          name:"\"" + req.body.sname + "\"",
                          location_id:"\"LOC"+("0 0000" + resultCount[0]['cnt']).slice(-5) + "\"",
                          wifi_facility:(req.body.wifi)?("\"Y\""):("\"N\""),
                        }
                        serverjs.insertIntoTable(function(resA){
                          if(resA)
                          {
                            req.session.msg="SAccount Created Succesfully, Login with your username: "+hData.service_provider_id;
                            res.redirect('/..');
                          }
                          else{
                            req.session.msg="DAccount creation failed, try again";
                            res.redirect('/..');
                          }
  
                        },'hotel',hData);
                      }
                      else if(req.body.providerType=="restaurant")
                      {
                        rData={
                          service_provider_id:"\"" + prefix+("00000" + resultSPR[0]['cnt']).slice(-5) + "\"",
                          name:"\"" + req.body.sname + "\"",
                          delivers:(req.body.delivery)?("\"Y\""):("\"N\""),
                          location_id:"\"LOC"+("00000" + resultCount[0]['cnt']).slice(-5) + "\"",
                          cuisine:"\"" + req.body.cuisine + "\""
                        }
                        serverjs.insertIntoTable(function(resA){
                          if(resA)
                          {
                            req.session.msg="SAccount Created Succesfully, Login with your username: "+rData.service_provider_id;
                            res.redirect('/..');
                          }
                          else{
                            req.session.msg="DAccount creation failed, try again";
                            res.redirect('/..');
                          }
  
                        },'restaurant',rData);
                      }
                    }
                    else{
                      req.session.msg="DAccount creation failed, try again";
                      res.redirect('/..');
                    }
                  },locData);
                },'location');
              }
              else{
                if(req.body.providerType=="hotel")
                {
                  // console.log("reached her");
                  hData={
                    service_provider_id:"\"" + prefix+("00000" + resultSPR[0]['cnt']).slice(-5) + "\"",
                    name:"\"" + req.body.sname + "\"",
                    location_id:"\"" + oldLoc + "\"",
                    wifi_facility:(req.body.wifi)?("\"Y\""):("\"N\""),
                  }
                  serverjs.insertIntoTable(function(resA){
                    if(resA)
                    {
                      req.session.msg="SAccount Created Succesfully, Login with your username: "+hData.service_provider_id;
                      res.redirect('/..');
                    }
                    else{
                      req.session.msg="DAccount creation failed, try again";
                      res.redirect('/..');
                    }
  
                  },'hotel',hData);
                }
                else if(req.body.providerType=="restaurant")
                {
                  rData={
                    service_provider_id:"\"" + prefix+("00000" + resultSPR[0]['cnt']).slice(-5) + "\"",
                    name:"\"" + req.body.sname + "\"",
                    delivers:(req.body.delivery)?("\"Y\""):("\"N\""),
                    location_id:"\"" + oldLoc + "\"",
                    cuisine:"\"" + req.body.cuisine + "\""
                  }
                  serverjs.insertIntoTable(function(resA){
                    if(resA)
                    {
                      req.session.msg="SAccount Created Succesfully, Login with your username: "+rData.service_provider_id;
                      res.redirect('/..');
                    }
                    else{
                      req.session.msg="DAccount creation failed, try again";
                      res.redirect('/..');
                    }
  
                  },'restaurant',rData);
                }
  
              }
            },{city:["\""+req.body.scity+"\""]})
          }
          else{
            req.session.msg="SAccount Created Succesfully, Login with your username: "+data.service_provider_id;
            res.redirect('/..');
          }
        }
        else{
          req.session.msg="DAccount creation failed, try again";
          res.redirect('/..');
        }
      },'service_provider',data)
    },'service_provider');
  }
  else if(req.body.acc_type=='2'){
    serverjs.count_table(function(result){
      data={
        user_id:'\"USR'+("00000" + result[0]['cnt']).slice(-5) + "\"",
        name:"\"" + req.body.uname + "\"",
        email:"\"" + req.body.umail + "\"",
        phone_no:"\"" + req.body.utel + "\"",
        password:"\"" + req.body.upass2 + "\"",
        address:"\"" + req.body.uadd + "\"",
        location_id:"\"LOC00000\"",
        active:"\"Y\""
      }
      serverjs.user.register_user(function(result){
        if(result)
        {
          req.session.msg="SAccount Created Succesfully, Login with your username: "+data.user_id;
          res.redirect('/..');
        }
        else{
          req.session.msg="DAccount creation failed, try again";
          res.redirect('/..');
        }
      },data);
    },'user');
    //User Data availabe vars in req.body : uname,umail,utel,upass,upass2,uadd,ucity
  }
  else{
    req.session.msg="DBad POST request";
    res.redirect('/..');
    // next();
  }
});
module.exports = router;
