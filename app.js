var mysql      = require('mysql');
var express    = require('express');
var path       =require('path');
var connection = require('express-myconnection');


var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'hexaware',
  database : 'school'
});

connection.query('SELECT * FROM `students` WHERE `name` = "abhishek dash"', function (error, results, fields) {
  // error will be an Error if one occurred during the query
  // results will contain the results of the query
  // fields will contain information about the returned results fields (if any)
  console.log(results[0]);
});
connection.end();




var app = express()
app.get('/', function (req, res) {
  res.render(index.html);
})
app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
})
