"use strict";
var express    = require('express');
var app        = express();
var router     = express.Router();
var session    = require('express-session');  
var bodyparser = require('body-parser');  
var Http       = require('node-rest-client').Client;
var httpClient = new Http();


router.get('/questions', function(req, res, next) {
  var token = req.session.user ? req.session.user : 'YWRtaW46MTIz';  
 
     var api = process.env.API_QUESTION + 'YWRtaW46MTIz';
     var questQ = [];
      httpClient.get(api, function (data, response) {
          
   
        res.status(200).send({
            obj: data
          });
        // if(data){ 
        //   res.status(200).send({
        //     obj: data
        //   });

        // }else{
        //   res.status(500);
        //     res.send({
        //       error: "Não foi possivel carregar as questoes"
        //     }); 
        // } 
      });
  
    

});
 
router.get('/user',function(req,res,next){

  var token = req.session.user ? req.session.user : 'YWRtaW46MTIz';  

  if(token){
    var api  = process.env.API_USER + token; 
    var user = {};

      var args = {  
        headers: { "Content-Type": "application/json" }
      }; 
      httpClient.get(api, args, function (data, response) {
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
 
  // if(!req.session.user){
  //    res.status(500).end('Sem usuario'); 
  // }else{
    var qId = req.params.id;

    if(qId){
      var token = req.session.user ? req.session.user : 'YWRtaW46MTIz';
      var api   = process.env.API_QUESTION_SINGLE + '/' + qId + '/' + token;

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

  // }

});
 
router.post('/question/:id',function(req,res,next){
 
  // if(!req.session.user){
  //    res.status(500).end('Sem usuario'); 
  // }else{
    var qId = req.params.numero;
    var qVal = req.params.valor;

    if(qId){
      var token = req.session.user ? req.session.user : 'YWRtaW46MTIz';
      var api   = process.env.API_SEND_QUESTION + '/' + token;

    var args = { 
      data: { NumeroPergunta: qId, ValorAlternativaRespondida: qVal},
      headers: { "Content-Type": "application/json" }
    };

      httpClient.post(api, args, function (data, response) {
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

  // }

});

 
router.post('/question',function(req,res,next){
 
  
    var token = req.session.user ? req.session.user : 'YWRtaW46MTIz';

    var api = process.env.API_SEND_QUESTION + token;

    if(!req.body.numero && !req.body.valor){
      res.status(400).end("dados para cadastro incompleto");
    }else{

      var args = { 
        data: { NumeroPergunta: req.body.numero, ValorAlternativaRespondida: req.body.valor},
        headers: { "Content-Type": "application/json" }
      };

      httpClient.post(api, args, function (data, response) {
        if(data){ 
           res.status(200).send({
              ok: true
            });

        }else{
          res.status(500).send({
              error: "erro ao cadastrar pergunta"
            }); 
        } 
      });
    }

  
});

 
router.get('/ranking',function(req,res,next){
  
    var token = req.session.user ? req.session.user : 'YWRtaW46MTIz';

    var api = process.env.API_RANKING + token;

      httpClient.get(api, function (data, response) {
        if(data){  
           res.status(200).send({
              obj: data
            });

        }else{
          res.status(500).send({
              error: "erro"
            }); 
        } 
      });
    
  
});

router.get('/especial1', function(req,res,next){
  
    var token = req.session.user ? req.session.user : 'YWRtaW46MTIz';
    var id = 'E1';
    var api = process.env.API_QUESTION_ESPECIAL + id + '/' + token;

      httpClient.get(api, function (data, response) {
        if(data){  
           res.status(200).send({
              obj: data
            });

        }else{
          res.status(500).send({
              error: "erro"
            }); 
        } 
      });
    
  
});
router.post('/especial1',function(req,res,next){
  
    var token = req.session.user ? req.session.user : 'YWRtaW46MTIz';

    var api = process.env.API_SEND_QUESTION_ESPECIAL + token;

      httpClient.get(api, function (data, response) {
        if(data){  
           res.status(200).send({
              obj: data
            });

        }else{
          res.status(500).send({
              error: "erro"
            }); 
        } 
      });
    
  
});


router.get('/especial2', function(req,res,next){
  
    var token = req.session.user ? req.session.user : 'YWRtaW46MTIz';
    var id = 'E2';
    var api = process.env.API_QUESTION_ESPECIAL + id + '/' + token;

      httpClient.get(api, function (data, response) {
        if(data){  
           res.status(200).send({
              obj: data
            });

        }else{
          res.status(500).send({
              error: "erro"
            }); 
        } 
      });
    
  
});
router.post('/especial2',function(req,res,next){
  
    var token = req.session.user ? req.session.user : 'YWRtaW46MTIz';

    var api = process.env.API_SEND_QUESTION_ESPECIAL + token;

      httpClient.get(api, function (data, response) {
        if(data){  
           res.status(200).send({
              obj: data
            });

        }else{
          res.status(500).send({
              error: "erro"
            }); 
        } 
      });
    
  
});

module.exports = router;