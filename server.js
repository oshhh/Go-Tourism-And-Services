var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "university"
});


function formQuery(table_name, attribute_values) {
    query = 'select * from ' + table_name + ' where (';

    var att_no = 0
    for(var attribute in attribute_values) {
        for(var value in attribute_values[attribute]) {
            console.log(value);
            console.log(attribute_values[value]);
            query += attribute + ' like ' + attribute_values[attribute][value];
            if(value == attribute_values[attribute].length - 1) continue;
                query += ' or '
        }
        if(att_no == Object.keys(attribute_values).length - 1) continue;
            query += ') and (';
        att_no ++;
    }
    query += ');';
    console.log(query);
    return query;
}


// Query a table_name
// table_name = 'room'
// attribute_values = {'service_id': ["\'ROO%\'"], 'room_type': ['\'standard\''], 'capacity': [1, 2]}

table_name = 'course';
attribute_values = {'title': ["\'%\'"]}



con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(formQuery(table_name, attribute_values)
, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});

