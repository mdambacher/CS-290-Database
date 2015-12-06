var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit	: 10,
  host  			: '52.88.112.1',  //change to local host
  user  			: 'student',
  password			: 'default',
  database			: 'student'
});

module.exports.pool = pool;
