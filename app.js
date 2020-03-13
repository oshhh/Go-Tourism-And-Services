const port=5060;
var express =require('express');
var path = require('path');
var hbs = require('express-handlebars');
var session = require('express-session')
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var dbHandler = require('./server.js')
const util = require('util');
var app=express();
var serv=require('http').Server(app);
//Template Engine init.
app.set('views', path.join(__dirname, 'views'));
app.set('dbHandler',dbHandler);
app.engine('hbs',hbs({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views',),
    defaultLayout: 'layout.hbs',
    partialsDir: [path.join(__dirname, 'views')]
}));
app.set('view engine', 'hbs');
app.use('/public',express.static(__dirname+'/public'));

app.use(express.json());
app.use(express.urlencoded());

app.use(session({secret:"Kathal"}));

app.get('/',function(req,res,next){
  console.log("Main page Access");
  var uname=req.session.uname;
  if(!uname)
    res.redirect('/login');
  else
    next();
});
function main()
{
  console.log(b);
}
app.set('root',__dirname);
app.use('/',indexRouter);
app.use('/login',loginRouter);
serv.listen(port);
console.log("it's started on http://localhost:"+port);
dbHandler.getTouristSpots(function(result){
  console.log(util.inspect(result,false,null,true));
});
module.exports=app;