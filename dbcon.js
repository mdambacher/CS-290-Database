var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit	: 10,
  host  			: 'localhost',  //change to local host
  user  			: 'student',
  password			: 'default',
  database			: 'student'
});

module.exports.pool = pool;
