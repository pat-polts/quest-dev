"use strict";
var express    = require('express');
var app        = express();
var router     = express.Router();
var session    = require('express-session');  
var bodyparser = require('body-parser');  
var Http       = require('node-rest-client').Client;
var httpClient = new Http();
var redisStore = require('connect-redis')(session);

router.get('/login', function(req, res, next) {
    var env = process.env.API_END_POINT;
    res.status(200).json.Stringfy({
      api: env
    });
    next();
});

router.get('/questions', function(req, res, next) {
  if(req.path !== '/questions' && req.route !== '/questions'){
      res.end();
    } 
  if(!req.session.token){
    res.end('Ops! Sua sessão expirou'); 
  }else{
     var env = process.env.API_QUESTION + req.session.token;

      httpClient.get(env, function (data, response) {
        if(data){ 
          res.status(200).send({
            data
          });

        }else{
          res.status(500);
            res.send({
              error: "Não foi possivel carregar as questoes"
            }); 
            next();
        } 
      });
  }
    

});
 
router.get('/user',function(req,res,next){

  if(!req.session.token){
     res.status(500).end('Sem usuario'); 
  }else{

  var token = req.session.token; 

  var api = process.env.API_USER + token; 
  var user = {};
      httpClient.get(api, function (data, response) {
        if(data){  
          user.name  = data.Nome;
          user.score = data.Pontuacao;
          user.lastQ = data.UltimaPerguntaRespondida; 

          res.status(200).send({obj: user});
       

        }else{
          res.status(500).send({error: "Não foi possivel obter usuario, efetue o login e tente novamente"}); 
         
        } 
      });
  }

});
 
router.get('/question/:id',function(req,res,next){
 
  if(!req.session.token){
     res.status(500).end('Sem usuario'); 
  }else{
    var qId = req.params.id;

    if(qId){
      var token = req.session.token; 
      var api = process.env.API_QUESTION_SINGLE + '/' + qId + '/' + token;

      httpClient.get(api, function (data, response) {
        if(data){ 
    
          res.status(200).send({
            obj: data
          });

        }else{
          res.status(500).send({
            error: "Não foi possivel obter pergunta"
          }); 
        } 
      });
    }

  }

});

 
router.post('/question',function(req,res,next){
  if(req.originalUrl !== '/question'){
    res.end();
  }
  if(!req.session.token){
     res.status(500).end('Sem usuario'); 
  }else{
    var token = req.session.token; 

    var api = process.env.API_SEND_QUESTION + token;

    if(!req.body.numero && !req.body.valor){
      res.status(400).end("dados para cadastro incompleto");
    }else{

      var args = { 
        data: { NumeroPergunta: req.body.numero, ValorAlternativaRespondida: req.body.valor},
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
          console.log(data);
           res.status(200);
           res.send({
              ok: true
            });

        }else{
          res.status(500);
            res.send({
              ok: false
            }); 
        } 
      });
    }

  }
  
});

module.exports = router;