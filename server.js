 "use strict";

var express      = require('express');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser'); 
var bcrypt       = require('bcrypt-nodejs');
var path         = require('path'); 
var session      = require('express-session');  
var app          = express(); 
var fs           = require('fs');

var port         = process.env.PORT || 3000; 
var hour         = 3600000; 
var check        = 1440;
var exp          = new Date(Date.now() + hour); 


var userAuth     = require('./routes/authenticate.js');
var api          = require('./routes/api.js');
var helmet       = require('helmet');


var appSecret = process.env.APP_SECRET ? process.env.APP_SECRET : 'Tabuleiro default session key';

if(app.get('env') === 'production'){

  var express_session = {
    secret: appSecret,  
    cookie: {}
  }

} 

app.use(helmet());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(
  session({  
    secret: appSecret,  
    resave: true,
    saveUninitialized: true,
    cookie: { 
        maxAge: hour, 
        httpOnly: false, 
        secure: true 
    }
  })
); 

app.use('/dist', express.static(path.join(__dirname, 'dist'))); 
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/views', express.static(path.join(__dirname, 'views'))); 

app.use('/auth/', userAuth); 
app.use('/api/', api); 

app.get('/', function(req, res, next) { 


  res.sendFile(path.join(__dirname, 'views/index.html')); 
});

// Todos os erros sem status especificado ou 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Erros em produção
if (app.get('env') === 'production') {
  app.use(session({   
    secret: process.env.APP_SECRET,  
    path: process.env.PATH_SERVER,
    cookie: { 
      ephemeral: true, // encerra sessão ao fechar o browser
      httpOnly: true, // cooki não pode ser acessado via javascript, segurança
      secure: true // setar apenas em produção, ou não visualiza nada
    }
  })
  ); 

  app.use(function(err, req, res, next) {
    res.status(err.status || 500).render('error', {
        message: "Requisição não encontrada, volte mais tarde!",
        error: {  }
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
var views = 0;
 


module.exports = app;