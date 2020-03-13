var mysql = require('mysql');

table_attributes = {
    'location': ['location_id', 'locality', 'city', 'state', 'country', 'pincode'],
    'neighbouring': ['location1_id', 'location2_id', 'distance_in_km'],
    'administrator': ['admin_id', 'name', 'role', 'email'],
    'user': ['user_id', 'name', 'email', 'password', 'address', 'phone_no', 'location_id'],
    'service_provider': ['service_provider_id', 'name', 'domain'],
    'service': ['service_id', 'service_provider_id', 'price', 'discount'],
    'hotel': ['service_provider_id', 'name', 'location_id', 'wifi_facility'],
    'room': ['service_id', 'room_type', 'capacity'],
    'restaurant': ['service_provider_id', 'name', 'location_id', 'delivers', 'cuisine'],
    'food_item': ['service_id', 'name', 'cuisine'],
    'flight': ['service_id', 'from_location_id', 'to_location_id', 'departure_time', 'arrival_time'],
    'taxi': ['service_id', 'car_name', 'capacity', 'AC'],
    'bus': ['service_id', 'from_location_id', 'to_location_id', 'active_days', 'AC'],
    'route': ['service_id', 'location_id', 'arrival_time'],
    'tourist_spot': ['tourist_spot_id', 'name', 'location_id', 'type', 'entry_fee'],
    'guide': ['service_id', 'tourist_spot_id'],
    'trip': ['trip_id', 'departure_date', 'arrival_date', 'destination_id'],
    'service_request': ['request_id', 'trip_id', 'service_id', 'timestamp', 'quantity', 'cost', 'status', 'user_rating', 'comments'],
    'query': ['query_id', 'user_id', 'query']
}

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tourism"
});


function inputAttributes(tables) {
    attribute_values = {}
    for(var j = 0; j < tables.length; ++ j) {
        for(i = 0; i < table_attributes[tables[j]].length; ++ i) {
            attribute_values[tables[j] + '.' + table_attributes[tables[j]][i]] = ['\'%\''];
        }
     
    }
    console.log('available attributes: ');
    console.log(attribute_values);
    return attribute_values;
}

async function runQuery(query) {
    await con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log(query);
            console.log(result);
        });
        
    });
}

function whereClause(attribute_values) {
    query = '';
    var att_no = 0
    for(var attribute in attribute_values) {
        for(var value in attribute_values[attribute]) {
            query += attribute + ' like ' + attribute_values[attribute][value];
            if(value == attribute_values[attribute].length - 1) continue;
                query += ' or '
        }
        if(att_no == Object.keys(attribute_values).length - 1) continue;
            query += ') and (';
        att_no ++;
    }
    // console.log(query);
    return query;
}

function getGeneralServiceProviderAndService() {
    attribute_values = inputAttributes(['service_provider', 'service']);
    return 'select * ' + 'from service_provider, service where( (service_provider.service_provider_id = service.service_provider_id) and (' + whereClause(attribute_values) +  '));'
}

function getParticularServiceProviderAndService(service_provider, service) {
    attribute_values = inputAttributes(['service_provider', 'service', service_provider, service]);
    return 'select * ' + 'from service_provider, service, ' + service_provider + ', ' + service + ' where( (service_provider.service_provider_id = service.service_provider_id) and (service_provider.service_provider_id = ' + service_provider + '.service_provider_id' + ') and (service.service_id = ' + service + '.service_id' + ') and (' + whereClause(attribute_values) +  '));'
}

getParticularServiceProviderAndService('hotel', 'room');
runQuery(getGeneralServiceProviderAndService());

function getAvgServiceRating(service_id) {
    return 'select avg(service_rating) from service_request where service_request.service_id = ' + service_id + ' ';
}

function getAvgServiceProviderRating(service_provider_id) {
    return 'select avg(service_rating) from service_request where service_request.service_id in (select service_id from service where service_provider_id = ' + service_provider_id + ') ';
}






