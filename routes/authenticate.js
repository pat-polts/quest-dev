var express    = require('express');
var app        = express();
var router     = express.Router();
var session    = require('express-session');  
var bodyparser = require('body-parser');  
var Http       = require('node-rest-client').Client;
var httpClient = new Http();
var redisStore   = require('connect-redis')(session);



var MemoryStore = session.MemoryStore,
    sessionStore = new MemoryStore();

router.get('/api/login', function(req, res) {
    var env = process.env.API_END_POINT;
    res.status(200).json.Stringfy({
      api: process.env.API_END_POINT
    });
});

router.post('/login', function(req, res, next) {
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
        res.status(200);
        var sess  = req.session;
          sess.token = data; 
          sess.regenerate(function(err) {
            if(err) res.end(err);
          });
         res.status(200);
         res.send({
            logged: true
          });

      }else{
        res.status(500);
          res.send({
            logged: false
          }); 
      } 
    });
  }

});

router.get('/login', function(req, res, next) {
  
});

router.get('/logout', function(req, res, next){
  req.session.destroy(function(err) {
    if(err) res.end(err);

   res.status(200);
   res.send({
      logged: false
    });

  });
});

router.get('/status', function(req, res, next){ 
 
  var userLog = req.session; 
// console.log(userLog.token);
  if(userLog.token){  
    res.status(200);
   res.send({
      logged: true
    });

  }else{  
    res.status(500);
    res.send({
        logged: false
      }); 
  } 
});
 

module.exports = router;