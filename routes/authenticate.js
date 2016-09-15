"use strict";

var express    = require('express');
var app        = express();
var router     = express.Router();
var session    = require('express-session');  
var bodyparser = require('body-parser');  
// var io      = require('socket.io');
var Http       = require('node-rest-client').Client;
var httpClient = new Http();
var fs         = require('fs'); 
var cache      = require('memory-cache');
var hour       = 3600000;  
var exp        = new Date(Date.now() + hour); 
var token      = null;

router.post('/login', function(req, res, next) {
 
  var api = process.env.API_LOGIN; 

  if(req.body.login && req.body.senha){ 

    var args = { 
      data: { Login: req.body.login, Senha: req.body.senha},
      headers: { "Content-Type": "application/json" }
    };
 
    httpClient.post(api, args, function (data, response) {
      if(data){         

        cache.put('ut',data,hour); 
        console.log(cache.get('ut'));
        if(cache.get('ut')){ 

          res.status(200).send({logged: true});
          
        }else{
          res.status(500).send({error: "sem sessão, logue"});   
        }

      }else{
        res.status(500).end();
      }

    });
  }
});

 
router.get('/logout', function(req, res, next){

  res.redirect('/login');
});

/*
# Check token existe
*/

router.get('/status', function(req, res, next){ 

 var token = cache.get('ut'); 

  if(token){ 
    
    res.status(200).send({logged: true});
    
  }else{
    res.status(500).send({error: "Sem suporte a sessões"});
  }

});
 

module.exports = router;