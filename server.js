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
// var debug          = require('debug')('passport-mongo'); 

//routes
var userAuth       = require('./routes/authenticate.js');

//models
var User  = require('./models/user.js');  

var USER_COLLECTION = "users";

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGOLAB_URI || 
'mongodb://localhost/quest-mockup';
// The http server will listen to an appropriate port, or default to
// port 5000.
var port = process.env.PORT || 3000;
// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
// mongoose.connect(uristring, function (err, res) {
//   if (err) {
//   console.log (' ERROR connecting to: ' + uristring + ' . ' + err);
//   } else {
//   console.log (' Succeeded connected to: ' + uristring);
//   }
// });

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

app.set('port', port);

if(process.env.NODE_ENV == "production"){
    /* 
   * Mongoose by default sets the auto_reconnect option to true.
   * We recommend setting socket options at both the server and replica set level.
   * We recommend a 30 second connection timeout because it allows for 
   * plenty of time in most operating environments.
   */
  var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };       
   
  var mongodbUri = uristring;
   
  mongoose.connect(mongodbUri, options);
  var conn = mongoose.connection;             
   
  conn.on('error', console.error.bind(console, 'connection error:'));  
   
  conn.once('open', function() {
    // Wait for the database connection to establish, then start the app.    

    var server = app.listen(app.get('port'), function() {
      console.log("local running at - http://localhost:" + server.address().port);
      // debug('debug port: ' + server.address().port);
    });   
                      
  });
}else{

app.use(passport.initialize());
app.use(passport.session()); 
// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var server = app.listen(app.get('port'), function() {
  console.log("local running at - http://localhost:" + server.address().port);
  // debug('debug port: ' + server.address().port);
});

}

module.exports = app;