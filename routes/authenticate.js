var express    = require('express');
var app        = express();
var router     = express.Router();
var session   = require('express-session');  
var bodyparser = require('body-parser');  
var Client     = require('node-rest-client').Client;
var client = new Client();


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
        res.status(200);

           var sessionID = req.sessionID; 
           var sess      = req.session;

            sess.token = data; 
            req.session.save(function(err){ 
              if(err) res.end(err);
            }); 

            sessionStore.set('user_data', sess.token, function(error){
              if(error) res.end(error);
            });
            //sessionStore.touch(sess.user.id, sess.user, function(error){});

          next(res.send(JSON.stringify({
            response: 'logged' 
          })));

          

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


router.get('/logout', function(req, res, next){
  sessionStore.destroy('user_data', function(error){
    if(error) res.end(error);
  });
    res.send({
        logout: true
      });
    res.status(200);
});

router.get('/status', function(req, res, next){ 

  var hour = 3600000;
  var userLog = sessionStore.sessions.user_data;
  // console.log(userLog);

  if(userLog){
    var sessionID = 'user_data'; 
    // console.log(userLog);
    res.status(200);  
    next(res.send({
       logged: true,
       status: 200
    }));

  }else{ 
    res.status(500);
    next( 
    res.send({
       logged: false,
       status: 500
    }));
  } 
});
 

module.exports = router;