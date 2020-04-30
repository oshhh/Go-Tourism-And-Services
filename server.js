var mysql = require('mysql');

tables = {
    'location': ['location_id', 'locality', 'city', 'state', 'country' ],
    'administrator': ['admin_id', 'name', 'role', 'email', 'password'],
    'user': ['user_id', 'name', 'email', 'password', 'address', 'phone_no', 'location_id', 'active'],
    'service_provider': ['approved','service_provider_id', 'name', 'password', 'domain','active'],
    'service': ['service_id', 'service_provider_id', 'price', 'discount'],
    'hotel': ['service_provider_id','location_id', 'wifi_facility','stars'],
    'room': ['service_id', 'room_type', 'capacity','ac'],
    'restaurant': ['service_provider_id', 'location_id', 'delivers', 'cuisine'],
    'food_item': ['service_id', 'name', 'cuisine'],
    'flight': ['service_id', 'from_city', 'to_city', 'departure_time', 'arrival_time'],
    'taxi': ['service_id', 'car_name', 'capacity', 'AC'],
    'bus': ['service_id', 'from_location_id', 'to_location_id', 'active_days', 'AC'],
    'train': ['service_id', 'from_location_id', 'to_location_id', 'active_days', 'AC'],
    'route': ['service_id', 'location_id', 'arrival_time'],
    'tourist_spot': ['tourist_spot_id', 'name', 'location_id', 'type', 'entry_fee'],
    'guide': ['service_id','name', 'tourist_spot_id'],
    'trip': ['trip_id','user_id','departure_date', 'return_date', 'destination_city'],
    'service_request': ['request_id', 'trip_id', 'service_id', 'request_timestamp', 'quantity', 'cost', 'status', 'user_rating', 'service_rating', 'comments','service_required_date','number_days','completion_date'],
    'query': ['query_id', 'user_id', 'service_provider_id','timestamp','query','side']
}

db_config = {
    host: "remotemysql.com",
    user: "lHyGk3wWaK",
    password: "IAahckiJYJ",
    database: "lHyGk3wWaK",
    multipleStatements: true
}

// db_config = {
//     host: "localhost",
//     user: "root",
//     password: "zzzz",
//     database: "lHyGk3wWaK",
//     multipleStatements: true
// }

function handleDisconnect() {
    con = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    con.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    con.on('error', function(err) {
        console.log('db error', err);
        if(err.code == 'PROTOCOL_CONNECTION_LOST' || err.code == 'ECONNRESET') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

function runQuery(callback, query) {
    console.log("Query Run/ :"+query);
    result = con.query(query, function (err, result) {
        if (err)
        {
            console.log(err);
            callback(null);
            return;
        } else {
            // console.log(result);
            // console.log(callback);
            if(callback!=null)
            callback(result);
        }

    });
}
function runTransaction(callback,queries)
{
    console.log("Transaction Run/ :");
    console.log(queries);
    // con.query(queries,)
}
function insertIntoTable(callback,table_name, data) {
    query = 'insert into '+table_name+' values ('
    for(i = 0; i <tables[table_name].length;i++) {
        query += data[tables[table_name][i]];
        if(i != tables[table_name].length - 1)
            query += ', '
    }
    query += ');';
    // console.log('insert query:',query);
    runQuery(callback, query);
}

function selectAllFromTable(callback, table_name) {
    query = 'select distinct * from ' + table_name + ';';
    runQuery(callback, query);
}

// Register
function register_user(callback,user) {
    insertIntoTable(callback,'user', user);
}
function delete_service(callback,service_type,Service)
{
    
}
function register_service(callback,service_type,service)
{
    insertIntoTable(function(result){
        if(result)
        {
            console.log('inserted main');
            console.log(service_type);
            switch(service_type){
                case 'hotel':
                    insertIntoTable(callback,'room', service);
                    break;
                case 'restaurant':
                    insertIntoTable(callback,'food_item', service);
                    break;
                case 'airline':
                    insertIntoTable(callback,'flight', service);
                    break;
                case 'bus':
                    insertIntoTable(callback,'bus', service);
                    break;
                case 'train':
                    insertIntoTable(callback,'train', service);
                    break;
                case 'taxi':
                    insertIntoTable(callback,'taxi', service);
                    break;
                case 'guide':
                    insertIntoTable(callback,'guide',service);
            }
        }
        else{
            callback(null);
        }
    },'service', service);
    
}
function register_service_provider(callback,service_provider) {
    if(service_provider['domain'] == 'hotel' | service_provider['domain'] == 'restaurant') {
        insertIntoTable('service_provider', service_provider);
        insertIntoTable(callback,service_provider['domain'], service_provider);
    }
    else{
        insertIntoTable(callback,'service_provider', service_provider);
    }
}
function register_administrator(callback,administrator) {
    insertIntoTable(callback,'administrator', administrator);
}

// Login
function login_user(callback, user_id) {
    query = 'select distinct password from user where user_id = \"' + user_id + '\";'
    return runQuery(callback, query);
}
function login_service_provider(callback, user_id) {
    query = 'select distinct password from service_provider where service_provider_id = \"' + user_id + '\";'
    return runQuery(callback, query);
}
function login_administrator(callback, user_id) {
    query = 'select distinct password from administrator where admin_id = \"' + user_id + '\";'
    return runQuery(callback, query);
}

// Deactivate or Remove
function deactivate_user(user) {
    runQuery(function(result){}, 'update user set active = \'N\' where user_id = ' + user_id + ';');
}
function deactivate_service_provider(service_provider_id) {
    runQuery(function(result){}, 'update service_provider set active = \'N\' where user_id = ' + user_id + ';');
}
function remove_administrator(service_provider_id) {
    runQuery(function(result){}, 'delete from service_provider where service_provider_id = ' + service_provider_id + ';');
}

// Location
function getLocations(callback, attribute_values) {
    query= 'select distinct * from location ' + whereClause(attribute_values) + ';';
    console.log(query);
    runQuery(callback,query);
}
function addLocation(callback,location) {
    insertIntoTable(callback,'location', location);
}

// Helpers
function assignAttributes(input_tables) {
    attribute_values = {}
    for(var j = 0; j < input_tables.length; ++ j) {
        for(i = 0; i < tables[input_tables[j]].length; ++ i) {
            attribute_values[input_tables[j] + '.' + tables[input_tables[j]][i]] = ['\'%\''];
        }
     
    }
    // console.log('available attributes: ');
    // console.log(attribute_values);
    return attribute_values;
}
function whereClause(attribute_values) {
    query = '';
    var att_no = 0
    for(var attribute in attribute_values) {
        query += attribute + ' like ' + attribute_values[attribute];
        if(att_no == Object.keys(attribute_values).length - 1) continue;
            query += ') and (';
        att_no ++;
    }
    // console.log(query);
    return query;
}


// User functions to display services according to filters
async function getFlights(callback, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['flight', 'service'])
    }
    query = 'select distinct flight.service_id, service_provider_id, from_city, to_city, departure_time, arrival_time, price, discount, (SELECT distinct COALESCE(AVG(service_rating),0) FROM service_request as u where u.service_id=service.service_id)  as rating  from flight, service where ( service.service_id = flight.service_id) and (' + whereClause(attribute_values) + ');'
    return await runQuery(callback, query);
}
function getBusTrains(callback, t_type, from, to, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['bus', 'train'])
    }
    query_bus = 'select distinct * from bus, route as r1, route as r2, location l1, location l2, service where (service.service_id = bus.service_id) and (bus.service_id = r1.service_id) and (l1.location_id = r1.location_id) and (r2.service_id = bus.service_id) and (l2.location_id = r2.location_id) and (l1.locality like ' + from +') and (l2.locality like ' + to + ') and (' + whereClause(attribute_values) + ')';
    query_train = 'select distinct * from train, route as r1, route as r2, location l1, location l2, service where (service.service_id = train.service_id) and (train.service_id = r1.service_id) and (l1.location_id = r1.location_id) and (r2.service_id = train.service_id) and (l2.location_id = r2.location_id) and  (l1.locality like ' + from +') and (l2.locality like ' + to + ') and (' + whereClause(attribute_values) + ')';
    console.log(t_type);
    if(t_type == 'B') {
        query = query_bus + ';';
    } else if(t_type == 'T') {
        query = query_train + ';';
    } else {
        query = '(' + query_bus + ') union (' + query_train + ');'
        // query = 'select distinct * from bus;'
        // query = query_bus;
    }
    runQuery(callback, query);
}
function getRoutes(callback) {
    query = 'select distinct * from route, location where route.location_id = location.location_id;'
    runQuery(callback, query);
}
function getTaxis(callback, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['taxi', 'service'])
    }
    query = 'select distinct taxi.service_id, service_provider_id, car_name, capacity, AC, price, discount, (SELECT distinct COALESCE(AVG(service_rating),0) FROM service_request as u where u.service_id=service.service_id)  as rating  from taxi, service where ( service.service_id = taxi.service_id) and (' + whereClause(attribute_values) + ');'
    runQuery(callback, query);
}
function getRooms(callback, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['room', 'hotel', 'service'])
    }
    query = 'select distinct room.service_id, hotel.service_provider_id, service_provider.name as name, locality, city, room_type, capacity, wifi_facility, AC, star, price, discount, (SELECT distinct COALESCE(AVG(service_rating),0) FROM service_request as u where u.service_id=service.service_id)  as rating  from room, hotel, location, service, service_provider where (hotel.service_provider_id = service_provider.service_provider_id) and (service.service_id = room.service_id) and (hotel.service_provider_id = service.service_provider_id) and (location.location_id = hotel.location_id) and (' + whereClause(attribute_values) + ');'
    runQuery(callback, query);
}
function getFoodItems(callback,filters)
{
    query=`
    select distinct s.service_id,f.name,f.cuisine,s.price,s.discount,p.name as res_name, p.service_provider_id as res_id, l.locality,l.city,r.delivers,
    (SELECT distinct COALESCE(AVG(service_rating),0) FROM service_request as u where u.service_id=s.service_id)  as rating 
    from food_item as f,service_provider as p,location as l, restaurant as r,service as s 
    where(
    f.service_id=s.service_id and 
    p.service_provider_id=s.service_provider_id and 
    r.service_provider_id=s.service_provider_id and 
    l.location_id=r.location_id and
    f.name like `+filters.name+` and p.name like `+filters.rest+` and r.delivers like `+filters.delivers +` and l.city like `+filters.city+`
    and p.service_provider_id like `+filters.service_provider_id+`);
    `
    runQuery(callback,query);
}
function getFoodItem(callback,filters)
{
    query=`
    select distinct s.service_id,f.name,f.cuisine,s.price,s.discount,p.name as res_name, p.service_provider_id as res_id, l.locality,l.city,r.delivers,
    (SELECT distinct COALESCE(AVG(service_rating),0) FROM service_request as u where u.service_id=s.service_id)  as rating 
    from food_item as f,service_provider as p,location as l, restaurant as r,service as s 
    where(
    f.service_id=s.service_id and 
    p.service_provider_id=s.service_provider_id and 
    r.service_provider_id=s.service_provider_id and 
    l.location_id=r.location_id and
    f.name like `+filters.name+` and p.name like `+filters.rest+` and r.delivers like `+filters.delivers +`
    and p.service_provider_id like `+filters.service_provider_id+`);
    `
    runQuery(callback,query);
}
function getTouristSpots(callback, attribute_values, city, unvisited = false) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['tourist_spot'])
    }
    if(unvisited) {
        query = 'select distinct * from tourist_spot, location where (tourist_spot_id not in (select distinct tourist_spot_id from visited where user_id in ( select distinct user_id from trip where trip_id = ' + trip_id +')) tourist_spot.location_id = location.location_id and location.city REGEXP '+ city + ') and (' + whereClause(attribute_values) + ');';
    } else {
        query = 'select distinct * from tourist_spot, location where (tourist_spot.location_id = location.location_id and location.city like ' + city + ' ) and (' + whereClause(attribute_values) + ');';
    }
    runQuery(callback, query);
}
function getGuides(callback, attribute_values, tourist_spot_name, tourist_spot_city) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['guide', 'tourist_spot'])
    }
    query = 'select distinct guide.name as guide_name, tourist_spot.name as tourist_spot_name, locality, city, state,  guide.service_id, guide.tourist_spot_id, type, entry_fee, price, discount, (SELECT distinct COALESCE(AVG(service_rating),0) FROM service_request as u where u.service_id=service.service_id)  as rating from guide, service, tourist_spot, location where (guide.service_id = service.service_id) and (guide.tourist_spot_id = tourist_spot.tourist_spot_id) and (tourist_spot.location_id = location.location_id and location.city like ' + tourist_spot_city + ' ) and ( tourist_spot.name like ' + tourist_spot_name + ');';
    runQuery(callback, query);
}
function getTrips(callback, attribute_values) {
    runQuery(callback, 'select distinct * from trip where ' + whereClause(attribute_values) + ';');
}
function getServiceRequests(callback, user_id, attribute_values) {
    if(Object.keys(attribute_values).length == 0) {
        attribute_values = assignAttributes(['service_request']);
    }
    query = `select distinct * from service_request where trip_id in (select distinct trip_id from trip where trip.user_id = \"` + user_id +`\") and (` + whereClause(attribute_values) + `) ORDER BY request_timestamp DESC;`;
    runQuery(callback, query);
}
function providerGetRequests(callback,user_id)
{
    query = `select service_request.*,u.name,u.email,u.address,u.phone_no
    from service_request,service_provider as p, service as s,user as u,trip as t
    where (t.user_id=u.user_id and t.trip_id=service_request.trip_id and
    service_request.service_id=s.service_id and s.service_provider_id=p.service_provider_id 
    and p.service_provider_id like"`+user_id+`")
    ORDER BY request_timestamp DESC;`;
    runQuery(callback, query);
}
function allServiceRequest(callback,filterData)
{
    query=`select r.*, u.name as uname, u.user_id as uid, p.name as pname
    from service_request as r, user as u, trip as t, service_provider as p, service as s
    where( r.trip_id=t.trip_id and t.user_id=u.user_id and 
        r.service_id = s.service_id and p.service_provider_id=s.service_provider_id
        and u.name REGEXP "`+filterData.user_id+`" 
        and p.name REGEXP "`+filterData.pname+`"
        and s.service_id REGEXP "`+filterData.service_id+`")
        ORDER BY r.request_timestamp DESC`;
    runQuery(callback,query);
}
function createTrip(callback, attribute_values) {
    query = 'insert into trip values ((select count(*) from trip), ' + attribute_values['user_id'] + ', ' + attribute_values['departure_date'] + ', ' + attribute_values['return_date'] + ', ' + attribute_values['destination_city'] + ');'
    runQuery(callback, query);
}

// Update status by service_provider
function rateService(callback, request_id, rating, comments) {
    runQuery(callback, 'start transaction; update service_request set service_rating = ' + rating + ' where request_id = ' + request_id + '; update service_request set comments = ' + comments + ' where request_id = ' + request_id + '; commit;');
}

// Update status by service_provider
function changeStatusOfServiceRequest(request_id, status) {
    runQuery(function(result){}, 'update service_request set status = ' + status + ' where request_id = ' + request_id + ';');
}

function getAdmins(callback, attribute_values) {
    if(attribute_values == null) {
        attribute_values = assignAttributes(['administrator'])
    }
    query = 'select distinct * from administrator where (' + whereClause(attribute_values) + ')';
    runQuery(callback, query);
}

function getUsers(callback, attribute_values) {
    if(attribute_values == null) {
        attribute_values = assignAttributes(['user'])
    }
    query = 'select distinct * from user, location where (location.location_id = user.location_id) and (' + whereClause(attribute_values) + ')';
    runQuery(callback, query);
}

function getServiceProviders(callback, attribute_values) {
    if(attribute_values == null) {
        attribute_values = assignAttributes(['service_provider'])
    }
    query = 'select distinct * from service_provider where (' + whereClause(attribute_values) + ')';
    runQuery(callback, query);
}


function count_table(callback,table_name)
{
    query="select distinct count(*) as cnt from "+table_name+";";
    runQuery(callback,query);
}
function getUserInfo(callback,uid)
{
    query="select distinct * from user where user_id=\""+uid+"\";";
    runQuery(callback,query);
}
function getAdminInfo(callback,uid)
{
    query="select distinct * from administrator where admin_id=\""+uid+"\";";
    runQuery(callback,query);
}
function getServiceReview(callback,service_id)
{
    query=`select distinct u.name as user,r.request_timestamp,r.comments as body,r.service_rating as rating
    from user as u,service_request as r,trip as t
    where(u.user_id=t.user_id and r.trip_id=t.trip_id and r.service_id REGEXP "`+service_id+`" and r.service_rating is not null);`;
    runQuery(callback,query);
}

// function getTrips(callback,user_id)
// {
//     query=`select distinct t.trip_id,u.user_id,t.departure_date,t.return_date,t.city
//     from trip as t,user as u
//     where(u.user_id=t.user_id and u.user_id REGEXP "`+user_id+`")
//     ORDER BY t.departure_date;`
//     runQuery(callback,query)
// }
function getBuses(callback,service_provider_id)
{
    query=`select s.*,b.*,f.city as from_location_id_v,t.city as to_location_id_v
    from service as s, bus as b,location as f,location as t
    where(s.service_id=b.service_id and f.location_id = b.from_location_id and t.location_id=b.to_location_id and
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getTrains(callback,service_provider_id)
{
    query=`select s.*,tr.*,f.city as from_location_id_v,t.city as to_location_id_v
    from service as s, train as tr,location as f,location as t
    where(s.service_id=tr.service_id and f.location_id = tr.from_location_id and t.location_id=tr.to_location_id and
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getFlight(callback,service_provider_id)
{
    query=`select s.*,f.*
    from service as s, flight as f
    where(s.service_id=f.service_id and
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getRoom(callback,service_provider_id)
{
    query=`select s.*,r.*
    from service as s, room as r
    where(s.service_id=r.service_id and
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getTaxi(callback,service_provider_id)
{
    query=`select s.*,t.*
    from service as s, taxi as t
    where(s.service_id=t.service_id and
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getGuide(callback,service_provider_id)
{
    query=`select distinct s.*,g.name as gname, t.*, l.*
    from service as s, guide as g, tourist_spot as t, location as l
    where(s.service_id=g.service_id and l.location_id=t.location_id and
    t.tourist_spot_id=g.tourist_spot_id and 
    s.service_provider_id like "`+service_provider_id+`")`;
    runQuery(callback,query);
}
function getRoute(callback,service_id)
{
    query=`select r.*,l.city as location_id_v
    from route as r, location as l
    where(l.location_id=r.location_id and
    r.service_id like "`+service_id+`")`;
    runQuery(callback,query);
}
function deleteRoute(callback,service_id)
{
    query=`delete
    from route
    where service_id="`+service_id+`";`
    runQuery(callback,query);
}
function deleteRow(callback,table_name,searchKey,searchValue)
{
    query=`delete
    from `+table_name+`
    where `+searchKey+`="`+searchValue+`";`
    runQuery(callback,query);
}
// function getTrips(callback,user_id)
// {
//     query=`select distinct t.trip_id,u.user_id,t.departure_date,t.return_date,t.city
//     from trip as t,user as u
//     where(u.user_id=t.user_id and u.user_id REGEXP "`+user_id+`")
//     ORDER BY t.departure_date;`
//     runQuery(callback,query)
// }
function getAutoCorrectPredictions(callback,table_name,column_name)
{
    query=`select distinct `+column_name+` as prediction
    from `+table_name+``;   
    runQuery(callback,query);
}
function getFilteredAutoCorrectPrediction(callback,queryData)
{
    query=`select distinct `+queryData.target_column+` as prediction
    from `+queryData.target_table+` as target, `+queryData.source_table+` as source
    where ( target.`+queryData.searchKey+`= source.`+queryData.searchKey+`)`;   
    runQuery(callback,query);
}
function getFilteredQueries(callback,uid,pid)
{
    query=`select distinct q.*, u.name as uname, p.name as pname
    from query as q, user as u, service_provider as p
    where( q.service_provider_id = p.service_provider_id and q.user_id = u.user_id and
        u.user_id REGEXP "`+uid+`" and p.service_provider_id REGEXP "`+pid+`")
        order by q.timestamp DESC`;
    runQuery(callback,query);
}
function insertQuery(callback,reqObj)
{
    serverjs.count_table( function(result) {
        newID="\"QRY" + ("00000" + (result[0]['cnt'] + 1)).slice(-5) + "\"";
        console.log(newID);
        console.log(reqObj);
        query=`insert into query VALUES(`+newID+`,"`+reqObj.user+`","`+reqObj.provider+`",NOW(),"`+reqObj.msg+`","`+reqObj.side+`")`;
        runQuery(callback,query);
    } , "query");
}
function updateOneColumn(callback,data)
{
    query=`update `+data.table_name+`
    set `+data.column_name+` = `+data.newValue+`
    where `+data.whereColumn+` = `+data.whereValue+`;`;
    runQuery(callback,query);
}
function updateList(callback,data)
{
    query='';
    for(i in data){
        query+='update '+data[i].table_name+
        ' set '+data[i].column_name+' = "'+data[i].newValue+
        '" where '+data[i].whereColumn+' = "'+data[i].whereValue+'";';
    }
    runQuery(callback,query);
}
function insertRoutes(callback,service_id,data){
    query='';
    for(i in data){
        query+='insert into route'+
        ' VALUES("'+service_id+'","'+data[i].location_id+'","'+data[i].arrival_time +'");';
    }
    runQuery(callback,query);
}
function getLocation(callback,city_name)
{
    query=`select *
    from location
    where (city like "`+city_name+`")`;
    runQuery(callback,query);
}
function getTouristSpot(callback,spot_name,spot_type,city)
{
    query=`select t.*, l.*
    from tourist_spot as t, location as l
    where (l.location_id=t.location_id and 
        t.name like "`+spot_name+`" and 
        t.type like "`+spot_type+`" and
        l.city like "`+city+`")`;
    runQuery(callback,query);
}
function getServices(callback,data)
{
    query=`blank`;
    runQuery(query);
}

function planTrip(callback, trip) {
    console.log(trip);
    trip.budget = parseInt(trip.budget);
    trip.number_of_days = parseInt(trip.number_of_days);
    trip.number_of_people = parseInt(trip.number_of_people);
    trip.weightage.food = parseInt(trip.weightage.food);
    trip.weightage.flight = parseInt(trip.weightage.flight);
    trip.weightage.room = parseInt(trip.weightage.room);
    trip.weightage.taxi = parseInt(trip.weightage.taxi);
    trip.weightage.tourist_spot = parseInt(trip.weightage.tourist_spot);
    food_expense = [
        [200, trip.number_of_people * trip.number_of_days], 
        [500, trip.number_of_people * trip.number_of_days], 
        [1000, trip.number_of_people * trip.number_of_days], 
        [1500, trip.number_of_people * trip.number_of_days]
    ]
    departure_flights = []
    return_flights = []
    taxis = []
    rooms = []
    tourist_spots = []
    trip.itinerary = {
        pleasure_value : 0,
        cost : 0,
        status : "Budget Too Low!"
    }

    // Possible options for rooms based on ratings
    room_query = {}
    for(var i in [0, 1, 2, 3, 4, 5]) {
        room_query[i] = "select * from room, hotel, location, service where room.service_id = service.service_id and service.service_provider_id = hotel.service_provider_id and location.location_id = hotel.location_id and city = " + trip.destination_city + " and star = " + i + " order by price * (1 - discount * 0.01) * floor((capacity + " + trip.number_of_people + " - 1)/capacity) limit 1;";
        // room_query[i] = "select * from room, hotel, location, service where room.service_id = service.service_id and service.service_provider_id = hotel.service_provider_id and location.location_id = hotel.location_id and city = " + trip.destination_city + " limit 1;";
    }


    user_city_query = "select city from user, location where user.location_id = location.location_id and user.user_id = " + trip.user_id;
    runQuery(function(result) {
        console.log(trip.from_home);
        if(trip.from_home == false) {
            trip.user_city = "\"" + result[0].city + "\""; 
        }
        // Possible options for flights
        // Only one possible option (the cheapest one since there are no other parameters)
        departure_flight_query = "select * from flight f1, service where f1.service_id = service.service_id and from_city = " + trip.user_city + " and to_city = " + trip.destination_city + " order by (price * (1 - discount * 0.01)) limit 1;"
        runQuery(function(result) {
            console.log(trip);
            if(result.length > 0) {
                departure_flights.push([result[0], trip.number_of_people]);
            }
            return_flight_query = "select * from flight f1, service where f1.service_id = service.service_id and from_city = " + trip.destination_city + " and to_city = " + trip.user_city + " order by (price * (1 - discount * 0.01)) limit 1;"
            runQuery(function(result) {
                if(result.length > 0) {
                    return_flights.push([result[0], trip.number_of_people]);
                }
                // Possible options for taxis based on capacity
                ac_taxi_query = "select * from taxi t1, service where t1.service_id = service.service_id and t1.AC = \'Y\' order by price * (1 - discount * 0.01) * floor((" + trip.number_of_people + " + capacity - 1)/ capacity) limit 1;"
                runQuery(function(result) {
                    if(result.length > 0) {
                        taxis.push([result[0], Math.floor((trip.number_of_people + result[0].capacity - 1)/result[0].capacity) * trip.number_of_days])
                    }
                    nonac_taxi_query = "select * from taxi t1, service where t1.service_id = service.service_id and t1.AC = \'N\' order by price * (1 - discount * 0.01) * floor((" + trip.number_of_people + " + capacity - 1)/ + capacity) limit 1;"
                    runQuery(function(result) {
                        if(result.length > 0) 
                            taxis.push([result[0], Math.floor((trip.number_of_people + result[0].capacity - 1)/result[0].capacity) * trip.number_of_days])
                        // Possible options for tourist spots
                        tourist_spot_query = "select * from tourist_spot, location where tourist_spot.location_id = location.location_id and location.city = " + trip.destination_city + ";"
                        runQuery(function(result) {
                            if(result.length > 0) {
                                tourist_spots = result
                            }
                            runQuery(function(result) {
                                if(result.length > 0) {
                                    result[0].rating = 0;
                                    rooms.push([result[0], Math.floor((trip.number_of_people + result[0].capacity - 1)/result[0].capacity) * trip.number_of_days])
                                }
                                runQuery(function(result) {
                                    if(result.length > 0) {
                                        result[0].rating = 1;
                                        rooms.push([result[0], Math.floor((trip.number_of_people + result[0].capacity - 1)/result[0].capacity) * trip.number_of_days])
                                    }
                                    runQuery(function(result) {
                                        if(result.length > 0) {
                                            result[0].rating = 2;
                                            rooms.push([result[0], Math.floor((trip.number_of_people + result[0].capacity - 1)/result[0].capacity) * trip.number_of_days])
                                        }
                                        runQuery(function(result) {
                                            if(result.length > 0) {
                                                result[0].rating = 3;
                                                rooms.push([result[0], Math.floor((trip.number_of_people + result[0].capacity - 1)/result[0].capacity) * trip.number_of_days])
                                            }
                                            runQuery(function(result) {
                                                if(result.length > 0) {
                                                    result[0].rating = 4;
                                                    rooms.push([result[0], Math.floor((trip.number_of_people + result[0].capacity - 1)/result[0].capacity) * trip.number_of_days]) 
                                                }   
                                                runQuery(function(result) {
                                                    if(result.length > 0) {
                                                        result[0].rating = 5;
                                                        rooms.push([result[0], Math.floor((trip.number_of_people + result[0].capacity - 1)/result[0].capacity) * trip.number_of_days])
                                                    }
                                                    if(rooms.length == 0) {
                                                        trip.itinerary.status = "No hotel rooms found in city!"
                                                    }
                                                    if(taxis.length == 0) {
                                                        trip.itinerary.status = "No taxis found!"
                                                    }
                                                    if(departure_flights.length == 0) {
                                                        trip.itinerary.status = "No departure flights found to destination city!"
                                                    }
                                                    if(return_flights.length == 0) {
                                                        trip.itinerary.status = "No return flights found from destination city!"
                                                    }
                                                    // if(tourist_spots.length == 0) {
                                                    //     trip.itinerary.status = "No tourist spots found in city!"
                                                    // }
                                                            
                                                    trip.itinerary.pleasure_value = 0
                                                    
                                                    for(foo = 0; foo < food_expense.length; ++ foo) {
                                                        for(d_fli = 0; d_fli < departure_flights.length; ++ d_fli) {
                                                            for(r_fli = 0; r_fli < return_flights.length; ++ r_fli) {
                                                                for(tax = 0; tax < taxis.length; ++ tax) {
                                                                    for(roo = 0; roo < rooms.length; ++ roo) {
                                                                        for(tor = 0; tor <= tourist_spots.length; ++ tor) {
                                                                            total_cost = 0;
                                                                            total_cost += food_expense[foo][0] * food_expense[foo][1];
                                                                            total_cost += (departure_flights[d_fli][0].price) * (1 - departure_flights[d_fli][0].discount * 0.01) * departure_flights[d_fli][1];
                                                                            total_cost += (return_flights[r_fli][0].price) * (1 - return_flights[r_fli][0].discount * 0.01) * return_flights[r_fli][1];
                                                                            total_cost += taxis[tax][0].price * (1 - taxis[tax][0].discount * 0.01) * taxis[tax][1];
                                                                            total_cost += rooms[roo][0].price * (1 - rooms[roo][0].discount * 0.01) * rooms[roo][1];
                                                                            for(i = 0; i < tor - 1; ++ i) {
                                                                                total_cost += (tourist_spots[i].entry_fee) * (trip.number_of_people);
                                                                            }
                                                                            if(total_cost > trip.budget) continue;
                                                                            console.log(Math.floor((trip.number_of_people + rooms[roo][0].capacity - 1)) + "/" + (rooms[roo][0].capacity) + " * " + trip.number_of_days);
                                                                            pleasure_value = 0
                                                                            pleasure_value += (1) * trip.weightage.flight;
                                                                            pleasure_value += (food_expense[foo][0]/1500) * trip.weightage.food;
                                                                            pleasure_value += (taxis[tax][0].AC == 'Y' ? 1 : 0) * trip.weightage.taxi;
                                                                            pleasure_value += ((rooms[roo][0].rating + (rooms[roo][0].wifi == 'Y'? 1 : 0))/6) * trip.weightage.room ;
                                                                            pleasure_value += ((tor + 1)/(3 * trip.number_of_days)) * trip.weightage.tourist_spot;
                                                                            pleasure_value /= (trip.weightage.flight + trip.weightage.food + trip.weightage.taxi + trip.weightage.room + trip.weightage.tourist_spot);
                                                                            pleasure_value *= 10;
                                                                            if(trip.itinerary.pleasure_value < pleasure_value || trip.itinerary.pleasure_value == pleasure_value && trip.itinerary.cost > total_cost) {
                                                                                trip.itinerary.food_expense = food_expense[foo];
                                                                                trip.itinerary.departure_flight = departure_flights[d_fli];
                                                                                trip.itinerary.return_flight = return_flights[r_fli];
                                                                                trip.itinerary.taxi = taxis[tax];
                                                                                trip.itinerary.room = rooms[roo];
                                                                                trip.itinerary.tourist_spots = tourist_spots.slice(0, tor);
                                                                                trip.itinerary.pleasure_value = pleasure_value;
                                                                                trip.itinerary.cost = total_cost;
                                                                                trip.itinerary.status = "itinerary created!";
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    trip.itinerary.pleasure_value = Math.round(trip.itinerary.pleasure_value * 100) / 100
                                                    console.log(trip);
                                                    callback(trip);
                                                } , room_query[5]);
                                            } , room_query[4]);                                
                                        } , room_query[3]);                            
                                    } , room_query[2]);                       
                                } , room_query[1]);                    
                            } , room_query[0]);
                        }, tourist_spot_query);
                    }, nonac_taxi_query);
                } , ac_taxi_query);
            }, return_flight_query);
        }, departure_flight_query);   
    }, user_city_query);
}

function analyseMaxServiceRequests(callback, domain) {
    query = 'select (rank() over(order by count(*) desc)) as rank_, service.service_provider_id as service_provider_id, name, count(*) as count from service_request, service, service_provider where service_request.service_id = service.service_id and service.service_provider_id = service_provider.service_provider_id and domain = ' + domain + ' group by service.service_provider_id;'
    runQuery(callback, query)
}
function analyseMaxRating(callback, domain) {
    query = 'select (rank() over(order by avg(service_rating) desc)) as rank_, service.service_provider_id as service_provider_id, name, avg(service_rating) as rating from service_request, service, service_provider where service_request.service_id = service.service_id and service.service_provider_id = service_provider.service_provider_id and domain = ' + domain + ' group by service.service_provider_id;'
    runQuery(callback, query)
}
function analyseMinQueryResponseTime(callback, domain) {
    query = `select rank() over(order by (
        COALESCE(AVG(TIME_TO_SEC(TIMEDIFF (
       (select min(q1.timestamp)
       from query as q1
       where(q1.service_provider_id=q.service_provider_id and q1.user_id=q.user_id and q1.side="S")),
       (select min(q2.timestamp)
       from query as q2
       where(q2.service_provider_id=q.service_provider_id and q2.user_id=q.user_id and q2.side="U"))
       ))/60 ),NULL)
        ) asc) as rank_, q.service_provider_id, p.name as name,
       COALESCE(AVG(TIME_TO_SEC(TIMEDIFF (
       (select min(q1.timestamp)
       from query as q1
       where(q1.service_provider_id=q.service_provider_id and q1.user_id=q.user_id and q1.side="S")),
       (select min(q2.timestamp)
       from query as q2
       where(q2.service_provider_id=q.service_provider_id and q2.user_id=q.user_id and q2.side="U"))
       ))/60 ),NULL) as response_time
       from query as q, service_provider as p
       where p.domain = `+domain+` and p.service_provider_id = q.service_provider_id 
      GROUP BY  q.service_provider_id
      HAVING
      COALESCE(AVG(TIME_TO_SEC(TIMEDIFF (
        (select min(q1.timestamp)
        from query as q1
        where(q1.service_provider_id=q.service_provider_id and q1.user_id=q.user_id and q1.side="S")),
        (select min(q2.timestamp)
        from query as q2
        where(q2.service_provider_id=q.service_provider_id and q2.user_id=q.user_id and q2.side="U"))
        ))/60 ),NULL) is not null;`
    runQuery(callback, query)
}
function analyseUserByRegion(callback, service_provider_id) {
    query = "select (rank() over(order by count(*) desc)) as rank_, city, state, count(*) as count from service_request, service, trip, user, location where service_request.service_id = service.service_id and service.service_provider_id = " + service_provider_id + " and service_request.trip_id = trip.trip_id and trip.user_id = user.user_id and user.location_id = location.location_id group by state, city with rollup;"
    runQuery(callback, query);
}

function analyseStatusOfRequests(callback, service_provider_id) {
    query = "select (rank() over(order by count(*) desc)) as rank_, status, count(*) as count from service_request, service where service_request.service_id = service.service_id and service.service_provider_id = " + service_provider_id + " group by (status);"
    runQuery(callback, query);
}


async function main() {
    console.log('Start serverjs');
    await handleDisconnect();
    // createDatabase(function(){
    //     console.log('done Creation');
    // });
    // runQuery(function(result){console.log(result);}, "select distinct city from location");
    // runQuery(function(result) {console.log("service requests");console.log(result);}, "select * from service_request where service_id like \"ROO%\";")
    console.log('done Connect');
    // analyseMaxServiceRequests(function(result){console.log(result)}, '"hotel"')
    // planTrip(function(result) {console.log(result)}, {user_id : "\"USR00000\"", destination_city : "\"Delhi\"", user_city: "\"Mumbai\"", number_of_people : 4, number_of_days : 2, budget : 40000, weightage : {food : 2, taxi : 3, room : 5, tourist_spot : 3, flight : 3}});
}
main();


module.exports = {
    'user': {
        'register_user' : register_user,
        'login_user' : login_user,
        'deactivate_user' : deactivate_user,
        'getFlights' : getFlights,
        'getBusTrains' : getBusTrains,
        'getRoutes' : getRoutes,
        'getTaxis' : getTaxis,
        'getRooms' : getRooms,
        'getFoodItems':getFoodItems,
        'getTouristSpots' : getTouristSpots,
        'getGuides' : getGuides,
        'getTrips' : getTrips,
        'getServiceRequests' : getServiceRequests,
        'createTrip' : createTrip,
        'getUserInfo':getUserInfo,
        'rateService' : rateService,
        'planTrip' : planTrip,
    },
    'admin' : {
        'register_administrator' : register_administrator,
        'login_administrator' : login_administrator,
        'getAdminInfo':getAdminInfo,
        'remove_administrator' : remove_administrator, 
        'getAdmins' : getAdmins,
        'getUsers' : getUsers,
        'getServiceProviders' : getServiceProviders,
        'allServiceRequest':allServiceRequest
    },
    'service_provider' : {
        'register_service_provider' : register_service_provider,
        'login_service_provider' : login_service_provider,
        'register_service':register_service,
        'deactivate_service_provider' : deactivate_service_provider,
        'getServices':getServices,
        'getFoodItem':getFoodItem,
        'getBuses':getBuses,
        'getTrains':getTrains,
        'getFlight':getFlight,
        'getRoute' : getRoute,
        'getRoom':getRoom,
        'getTaxi':getTaxi,
        'getGuide':getGuide,
        'providerGetRequests':providerGetRequests,
        'analyseMaxServiceRequests' : analyseMaxServiceRequests,
        'analyseMaxRating' : analyseMaxRating,
        'analyseMinQueryResponseTime' : analyseMinQueryResponseTime,
        'analyseUserByRegion' : analyseUserByRegion,
        'analyseStatusOfRequests' : analyseStatusOfRequests,
    },
    'tables' : tables,
    'insertIntoTable' : insertIntoTable,
    'selectAllFromTable' : selectAllFromTable,
    'count_table':count_table,
    'getLocations' : getLocations,
    'addLocation' : addLocation,
    'changeStatusOfServiceRequest' : changeStatusOfServiceRequest,
    'getServiceReview':getServiceReview,
    'updateOneColumn':updateOneColumn,
    'updateList':updateList,
    'insertRoutes':insertRoutes,
    'getLocation':getLocation,
    'deleteRoute':deleteRoute,
    'deleteRow':deleteRow,
    'getTouristSpot':getTouristSpot,
    'getAutoCorrectPredictions':getAutoCorrectPredictions,
    'getFilteredAutoCorrectPrediction':getFilteredAutoCorrectPrediction,
    'getFilteredQueries':getFilteredQueries,
    'insertQuery':insertQuery
}
            
