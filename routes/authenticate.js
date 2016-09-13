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
           var sess         = req.session.cookie; 
           sess.session     = Math.random() * 2;
           req.session.user = data;

          req.session.regenerate(function(err){
            if(err) res.status(400).end({error: err});

            if(sess.session){ 
              console.log(sess.session)
             res.status(200).send({logged: true});
            }else{
              res.status(500).send({error: "sem sessão, logue"});
            }

          });


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

 var sess = req.session.cookie; 

  if(sess.session){

    var user = sess.user;
    console.log(user);
    if(user){
      res.status(200).send({logged: true});
    }
  }else{
    res.status(500).send({error: "Sem suporte a sessões"});
  }

});
 

module.exports = router;