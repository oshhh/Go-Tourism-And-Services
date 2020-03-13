var mysql = require('mysql');


tables = {
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
    'service_request': ['request_id', 'trip_id', 'service_id', 'timestamp', 'quantity', 'cost', 'status', 'user_rating', 'service_rating', 'comments'],
    'query': ['query_id', 'user_id', 'query']
}

var con = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12327792",
  password: "LTiPskhtKS",
  database: "sql12327792"
});

async function connect() {
    con.connect(function(err) {
        if (err) throw err;
        console.log('Connected!');
    });
}

async function runQuery(query, result) {
    var result;
    console.log(query);
    await con.query(query, function (err, result) {
            if (err) throw err;
            console.log(result);
    });
}

function _insert_(table_name, data) {
    query = 'insert into user values ('
    for(i = 0; i < tables['user'].length; i ++) {
        if(i == tables['user'].length - 1){
            query += user[tables['user'][i]];
        } else {
            query += user[tables['user'][i]] + ', '
        }
    }
    query += ');';
    runQuery(query);
}

function select(table_name) {
    query = 'select * from ' + table_name + ';';
    runQuery(query);
}

function register_user(user) {
    _insert_('user', user);
}

function deactivate_user(service_provider_id) {
    runQuery('update user set is_active = \'N\' where user_id = ' + user_id + ';');
}

function register_service_provider(service_provider, services) {
    _insert_('service_provider', service_provider);
    if(service_provider['domain'] == 'hotel' | service_provider['domain'] == 'restaurant') {
        _insert_(service_provider['domain'], service_provider);
    }
    for(i = 0; i < services.length; i ++) {
        _insert_('service', services[i]);
        switch(service_provider['domain']) {
            case 'hotel':
                _insert_('room', services[i]);
                break;
            case 'restaurant':
                _insert_('food_item', services[i]);
                break;
            case 'airline':
                _insert_('flight', services[i]);
                break;
            case 'bus provider':
                _insert_('bus', services[i]);
                break;
            case 'train provider':
                _insert_('train', services[i]);
                break;
            case 'taxi provider':
                _insert_('taxi', services[i]);
                break;
        }
    }
}

function deactivate_service_provider(service_provider_id) {
    runQuery('update service_provider set is_active = \'N\' where service_provider_id = ' + service_provider_id + ';');
}

function user_password(user_id) {
    query = 'select password from user where user_id = ' + user_id + ';'
    return
}

function inputAttributes(input_tables) {
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
    query = 'select * ' + 'from service_provider, service where( (service_provider.is_active = \'Y\') and (service_provider.service_provider_id = service.service_provider_id) and (' + whereClause(attribute_values) +  '));'
    runQuery(query);
}

function getParticularServiceProviderAndService(service_provider, service) {
    attribute_values = inputAttributes(['service_provider', 'service', service_provider, service]);
    query = 'select * ' + 'from service_provider, service, ' + service_provider + ', ' + service + ' where( (service_provider.is_active = \'Y\') and (service_provider.service_provider_id = service.service_provider_id) and (service_provider.service_provider_id = ' + service_provider + '.service_provider_id' + ') and (service.service_id = ' + service + '.service_id' + ') and (' + whereClause(attribute_values) +  '));'
    runQuery(query);
}

function getBusTrain(location1_id, location2_id) {
    query = '(select * from bus, route r1, route r2 where r1.service_id = bus.service_id and r2.service_id = bus.service_id and r1.location_id = ' + location1_id + ' and r2.location_id = ' + location2_id + ' and r1.arrival_time < r2.arrival_time) union (select * from train, route r1, route r2 where r1.service_id = bus.service_id and r2.service_id = bus.service_id and r1.location_id = ' + location1_id + ' and r2.location_id = ' + location2_id + ' and r1.arrival_time < r2.arrival_time)'
    runQuery(query);
}

function getTouristSpots(location_id) {
    attribute_values = inputAttributes(['tourist_spot'])
    query = 'select * from tourist_spot where (' + whereClause(attribute_values) + ');';
    runQuery(query);
}

function getAvgServiceRating(service_id) {
    return 'select avg(service_rating) from service_request where service_request.service_id = ' + service_id + ' ';
}

function getAvgServiceProviderRating(service_provider_id) {
    return 'select avg(service_rating) from service_request where service_request.service_id in (select service_id from service where service_provider_id = ' + service_provider_id + ') ';
}

async function main() {
    await connect();
    // getGeneralServiceProviderAndService();
    getTouristSpots();
}

main();



