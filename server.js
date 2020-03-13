var mysql = require('mysql');
// Username: lHyGk3wWaK
// Database name: lHyGk3wWaK
// Password: X38PHfGbqx
// Server: remotemysql.com
// Port: 3306


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
    'service_request': ['request_id', 'trip_id', 'service_id', 'timestamp', 'quantity', 'cost', 'status', 'user_rating', 'comments'],
    'query': ['query_id', 'user_id', 'query']
}

var con = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12327792",
  password: "LTiPskhtKS",
  database: "sql12327792"
});


// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "tourism"
// });


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
    return result;
}

function insert(table_name, data) {
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
    insert('user', user);
}

function register_service_provider(service_provider, services) {
    insert('service_provider', service_provider);
    if(service_provider['domain'] == 'hotel' | service_provider['domain'] == 'restaurant') {
        insert(service_provider['domain'], service_provider);
    }
    for(i = 0; i < services.length; i ++) {
        insert('service', services[i]);
        switch(service_provider['domain']) {
            case 'hotel':
                insert('room', services[i]);
                break;
            case 'restaurant':
                insert('food_item', services[i]);
                break;
            case 'airline':
                insert('flight', services[i]);
                break;
            case 'bus provider':
                insert('bus', services[i]);
                break;
            case 'train provider':
                insert('train', services[i]);
                break;
            case 'taxi provider':
                insert('taxi', services[i]);
                break;
        }
    }
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

async function getGeneralServiceProviderAndService() {
    attribute_values = inputAttributes(['service_provider', 'service']);
    query = 'select * ' + 'from service_provider, service where( (service_provider.service_provider_id = service.service_provider_id) and (' + whereClause(attribute_values) +  '));'
    return await runQuery(query);
}

function getParticularServiceProviderAndService(service_provider, service) {
    attribute_values = inputAttributes(['service_provider', 'service', service_provider, service]);
    query = 'select * ' + 'from service_provider, service, ' + service_provider + ', ' + service + ' where( (service_provider.service_provider_id = service.service_provider_id) and (service_provider.service_provider_id = ' + service_provider + '.service_provider_id' + ') and (service.service_id = ' + service + '.service_id' + ') and (' + whereClause(attribute_values) +  '));'
    return runQuery(query);
}

function getAvgServiceRating(service_id) {
    return 'select avg(service_rating) from service_request where service_request.service_id = ' + service_id + ' ';
}

function getAvgServiceProviderRating(service_provider_id) {
    return 'select avg(service_rating) from service_request where service_request.service_id in (select service_id from service where service_provider_id = ' + service_provider_id + ') ';
}

async function main() {
    await connect();
    // register_user({'user_id': '\'USR00001\'', 'name': '\'osheen\'', 'email': '\'osheen18059@iiitd.ac.in\'', 'password': '\'xxxx\'', 'address': '\'whatever\'', 'phone_no': '\'7042073559\'', 'location_id': '\'LOC00001\''})
    result = await getGeneralServiceProviderAndService();
    console.log(result);
    // for(table in tables) {
    //     select(table);
    // }
}

main();



