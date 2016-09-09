"use strict";

var express    = require('express');
var app        = express();
var router     = express.Router();
var session    = require('express-session');  
var bodyparser = require('body-parser');  
var Http       = require('node-rest-client').Client;
var httpClient = new Http();
var redisStore = require('connect-redis')(session);

router.get('/api/login', function(req, res) {
    var env = process.env.API_END_POINT;
    res.status(200).send({
      api: process.env.API_END_POINT
    });
});

router.post('/login', function(req, res, next) {
   if(req.path !== '/login'){
      res.end();
    }
  var api = process.env.API_LOGIN; 

  if(req.body.Login && req.body.Senha){ 

    var args = { 
      data: { Login: req.body.Login, Senha: req.body.Senha},
      headers: { "Content-Type": "application/json" },
      requestConfig: {
        timeout: 1000, //request timeout in milliseconds 
        noDelay: true, //Enable/disable the Nagle algorithm 
        keepAlive: true, //Enable/disable keep-alive functionalityidle socket. 
        keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent 
      }
    };
 
    httpClient.post(api, args, function (data, response) {
      if(data){    
        req.session.destroy(function(){
          //
        });
        var sess = {token: data};
          req.session.key =  sess;  


              res.status(200).send({
                logged: true
              });

          // req.session.save(function(err){
          //   if(err)res.end(err);

          // });
         
      }else{
        res.status(500).send({
            logged: false
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