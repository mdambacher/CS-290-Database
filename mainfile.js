var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);


app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO workouts (`name`,`reps`, `weight`, `date`, `lbs`) VALUES (?,?,?,?,?)", [req.query.c, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
    //context.results = "Inserted id " + result.insertId;
    //res.render('home',context);
  });
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.dataList = rows;
    res.render('home', context);
  });
});

app.get('/delete', function(req,res,next){
  var context = {};
  mysql.pool.query('DELETE FROM workouts WHERE id = ?', [req.query.id], function(err,result){
    if(err){
      next(err);
      return;
    }  
  });
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.dataList = rows;
    res.render('home', context);
  });
});

app.get('/update', function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts WHERE id = ?', [req.query.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.dataList = rows;
    res.render('update', context);
  });
});

app.get('/updated',function(req,res,next){
  var context = {};
  mysql.pool.query('UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?',
    [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs, req.query.id],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    context.dataList = rows;
    res.render('home',context);
  });
});

app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.dataList = rows;
    res.render('home', context);
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
