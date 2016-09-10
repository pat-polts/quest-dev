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
          req.session.user =  data;  
          req.session.save(function(erro){
            if(erro) res.end("sem sessão");
            res.status(200).send({
              logged: 'ok'
            });
         
          });
 
      }else{
        res.status(500).send({
            error: "usuario ou login incorreto"
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
  if(req.session){ 
    req.session.destroy(function() {
        res.status(200).send({
          msg: "Usuario deslogado"
        });
    });
  }
  res.redirect('/login');
});

router.get('/status', function(req, res, next){ 
 
  if(req.session){  
    res.status(200).send({
      msg: 'usuario logado'
    }); 
  }else{  
    res.send({
      error: 'usuario não logado'
    }); 
  }

});
 

module.exports = router;