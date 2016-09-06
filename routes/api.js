var express    = require('express');
var app        = express();
var router     = express.Router();
var session    = require('express-session');  
var bodyparser = require('body-parser');  
var Http       = require('node-rest-client').Client;
var httpClient = new Http();
var redisStore = require('connect-redis')(session);


var MemoryStore = session.MemoryStore,
    sessionStore = new MemoryStore();

router.get('/login', function(req, res) {
    var env = process.env.API_END_POINT;
    res.status(200).json.Stringfy({
      api: env
    });
});

router.get('/questions', function(req, res, next) {

  if(req.session.token){

      var env = process.env.API_QUESTION + req.session.token;

      httpClient.get(env, function (data, response) {
        if(data){
          // console.log(data);
          res.status(200);
          res.send({
            data
          });

        }else{
          res.status(500);
            res.send({
              error: "Não foi possivel carregar as questoes"
            }); 
        } 
      });

  }

});
 
router.get('/user',function(req,res,next){

  if(!req.session.token){
     res.status(500);
    res.end('Sem usuario');
  }
  var token = req.session.token; 

  var api = process.env.API_USER + token; 

      httpClient.get(api, function (data, response) {
        if(data){ 
          // console.log(data);
          res.status(200);
          res.send({
            user: data
          });

        }else{
          res.status(500);
            res.end("Não foi possivel obter usuario"); 
        } 
      });

});
 
router.get('/question/:id',function(req,res,next){

  if(!req.session.token){
     res.status(500);
    res.end('Sem usuario');
  }
  var token = req.session.token; 

  var api = process.env.API_QUESTION_SINGLE + '/' + req.params.id + '/' + token;
console.log(api);
      httpClient.get(api, function (data, response) {
        if(data){ 
         console.log(data);
          res.status(200);
          res.send({
            question: data
          });

        }else{
          res.status(500);
            res.end("Não foi possivel obter pergunta"); 
        } 
      });

});

 
router.post('/question',function(req,res,next){

  if(!req.session.token){
     res.status(500);
    res.end('Sem usuario');
  }
  var token = req.session.token; 

  var api = process.env.API_SEND_QUESTION + token;

  if(!req.body.numero && !req.body.valor){
    res.status(500);
    res.end("dados para cadastro incompleto");
  }

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

});

module.exports = router;