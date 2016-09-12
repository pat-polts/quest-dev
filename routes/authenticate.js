"use strict";

var express    = require('express');
var app        = express();
var router     = express.Router();
var session    = require('express-session');  
var bodyparser = require('body-parser');  
// var io    = require('socket.io');
var Http       = require('node-rest-client').Client;
var httpClient = new Http();
var fs           = require('fs'); 

var token = null;

router.post('/login', function(req, res, next) {
  // var socket = io(req.originalUrl);
  var api = process.env.API_LOGIN; 

  if(req.body.login && req.body.senha){ 

    var args = { 
      data: { Login: req.body.login, Senha: req.body.senha},
      headers: { "Content-Type": "application/json" }
    };
 
    httpClient.post(api, args, function (data, response) {
      if(data){      
         
         if(req.session){
           req.session.user = data;

          req.session.regenerate(function(err){
            if(err) res.status(400).end({error: err});

            if(req.session.user){ 
             res.status(200).send({logged: true});
            }else{
              res.status(500).send({error: "sem sessão, logue"});
            }

          });
        }else{
          res.status(500).send({error: "erro inesperado"});
        }

      }else{
        res.status(500).end();
      }

    });
  }
});

router.get('/session', function(req, res, next) {
  var uSessions = [
    {"token": req.session.user},
    {"ultimaRespondida": req.session.lastQ},
    {"ultimaPagina": null}
  ]
  res.status(200).send({uSessions});
});

router.get('/logout', function(req, res, next){

  res.redirect('/login');
});

/*
# Check token existe
*/

router.get('/status', function(req, res, next){ 

  if(req.session.user){
    var user = req.session.user;
    if(user){
      res.status(200).send({logged: true});
    }
  }else{
    res.status(500).send({error: "Sem suporte a sessões"});
  }

});
 

module.exports = router;