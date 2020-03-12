var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "university"
});



con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("select * from course;", function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});

