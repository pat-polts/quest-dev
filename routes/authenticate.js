var express    = require('express');
var app        = express();
var router     = express.Router();
var sessions   = require('express-session');  
var bodyparser = require('body-parser');  
var Client     = require('node-rest-client').Client;
var client = new Client();

router.get('/api/login', function(req, res) {
    var env = process.env.API_END_POINT;
    res.status(200).json.Stringfy({
      api: process.env.API_END_POINT
    });
});

router.post('/login', function(req, res, next) {
  var api = process.env.API_LOGIN;
  // var session = req.session.key;
  if(api){
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
 
    client.post(api, args, function (data, response) {
      if(res.status(200)){  
      // sets a cookie with the user's info 
        req.sessions.token = data; 
        res.status(200);
          res.send({
            response: req.session
          });

      }else if(res.status(500)){
          res.status(500);
          res.send({
            response: "usuario nao existe"
          });
      }
      else{ 
          res.send(JSON.stringify({
            message: err.message,
            error: {}
          }));
      }
    });
  } 
});


router.get('/status', function(req, res, next){

if(req.sessions){
  console.log(req.sessions.token);
}
res.status(200);

});
 

module.exports = router;