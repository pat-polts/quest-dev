 "use strict";

var express      = require('express');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var hash         = require('bcrypt-nodejs');
var path         = require('path'); 
var app          = express();
var router       = express.Router();
var session      = require('express-session');
var redis        = require("redis");
var redisStore   = require('connect-redis')(session);

if(!process.env.NODE_ENV){
  app.use(function(req, res, next) {
    var err = new Error('Sem o arquivo .env');
    err.status = 500;
    next(err);
  });
}
if(process.env.REDIS_URL){
  var cli = redis.createClient(process.env.REDIS_URL);
}else{
  var cli = redis.createClient();
}

//routes
var userAuth = require('./routes/authenticate.js');
var api      = require('./routes/api.js');
var port     = process.env.PORT || 3000; 
var hour     = 3600000
var exp      = new Date(Date.now() + hour);
var helmet   = require('helmet');

app.use(helmet());
app.use('/views', express.static(path.join(__dirname, 'views'))); 
app.use('/dist', express.static(path.join(__dirname, 'dist'))); 
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session({  
  store: new redisStore({ client: cli}),
  secret: process.env.APP_SECRET, 
  httpOnly: true,
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: true,
    httpOnly: true,
    domain: process.env.HOST || 'localhost',
    path: '/' 
  }
})); 

app.all('*',function(req, res, next){ 
  res.header("Access-Control-Allow-Origin", "localhost");
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/auth/', userAuth); 
app.use('/api/', api); 

app.get('/', function(req, res, next) { 
  res.sendFile(path.join(__dirname, 'views/index.html')); 
});

// Catch all errors
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler 
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
  }); 
}else{
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.end(JSON.stringify({
      message: err.message,
      error: {}
    }));
  }); 
} 

app.set('port', port);

var server = app.listen(app.get('port'), function() {
	console.log("local running at - http://localhost:" + server.address().port);
});

module.exports = app;