"use strict";

var express    = require('express');
var app        = express();
var router     = express.Router();
var session    = require('express-session');  
var bodyparser = require('body-parser');  
var Http       = require('node-rest-client').Client;
var httpClient = new Http();
var redisStore = require('connect-redis')(session);

router.post('/login', function(req, res, next) {

  var api = process.env.API_LOGIN; 

  if(req.body.Login && req.body.Senha){ 

    var args = { 
      data: { Login: req.body.Login, Senha: req.body.Senha},
      headers: { "Content-Type": "application/json" },
      requestConfig: {
        timeout: 1000, 
        noDelay: true, 
        keepAlive: true, 
        keepAliveDelay: 1000 
      }
    };
 
    httpClient.post(api, args, function (data, response) {
      if(data){    
        req.session.destroy(function(){
          //
          console.log(req.session);
        });
        var sess = {token: data};
          req.session.key =  sess;  

          res.status(200).send({
            logged: true
          });
         
      }else{
        res.status(500).send({
            error: false
        }); 
      } 
    });

  }else{
    res.status(400).end();
  }

});

router.get('/session', function(req, res, next) {
  
});

router.get('/logout', function(req, res, next){
  if(req.session.key){ 
    req.session.destroy(function() {
        res.status(200).send({
          msg: "Usuario deslogado"
        });
    });
  }else{
      req.session.destroy(function() {
        res.status(200).send({
          msg: "Usuario deslogado"
        });
    });
  }
});

router.get('/status', function(req, res, next){ 

  var userLog = req.session.token; 
  if(req.session.key){  
    res.status(200).send({
      msg: 'usuario logado'
    }); 
  }else{  
    res.status(500).send({
      error: 'usuario não logado'
    }); 
  }

});
 

module.exports = router;