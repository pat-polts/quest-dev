 "use strict";

var express        = require('express');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var expressSession = require('express-session');
var mongoose       = require('mongoose');
var hash           = require('bcrypt-nodejs');
var path           = require('path');
var passport       = require('passport');
var localStrategy  = require('passport-local' ).Strategy
var app            = express();
var router         = express.Router();
var debug          = require('debug')('passport-mongo'); ;

//routes
var userAuth       = require('./routes/authenticate.js');

//models
var User           = require('./models/user.js');

// mongoose: temporário dev, pode ser o mesmo link o mongo automaticamente abre a conexão se estiver rodando 
mongoose.connect('mongodb://localhost/quest-db');

app.use('/views', express.static(path.join(__dirname, 'views'))); 
app.use('/dist', express.static(path.join(__dirname, 'dist'))); 
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); 

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use('/auth/', userAuth);

app.get('/', function(req, res) {
  console.log('Rquest!');
  res.sendFile(path.join(__dirname, 'views/index.html')); 
});

// Catch errors
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

// production error handler 
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
	console.log("Don't mess with the dragons - http://localhost:" + server.address().port);
  debug('debug port: ' + server.address().port);
});

module.exports = app;