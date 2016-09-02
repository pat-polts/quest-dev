 "use strict";

var express       = require('express');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var sessions      = require('express-session');
var mongoose      = require('mongoose');
var hash          = require('bcrypt-nodejs');
var path          = require('path'); 
var app           = express();
var router        = express.Router();
// var debug          = require('debug')('passport-mongo'); 

//routes
var userAuth       = require('./routes/authenticate.js');


var port = process.env.PORT || 3000; 
var sess = {
  secret: 'Sjhf#@jsduries',
  cookie: {}
}
app.use('/views', express.static(path.join(__dirname, 'views'))); 
app.use('/dist', express.static(path.join(__dirname, 'dist'))); 
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(sessions({
  secret: 'Sjhf#@jsduries',
  name: 'quest_dev',
  path: '/#/',
  proxy: true,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: false}
})); 

app.all('*',function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use('/auth/', userAuth); 

app.get('/', function(req, res) {
  console.log('Rquest!');
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
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
  sess.name = 'quest_game'
  app.use(session(sess))
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