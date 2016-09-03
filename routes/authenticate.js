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
        // 
          req.session.uid = req.session.uid || { token: data };
          req.uid         = req.session.uid;
          req.session.save(function(err){
            if(err) console.log(err);
          });
          req.session.regenerate(function(err){
             if(err) console.log(err); 
          });
          res.send(JSON.stringify({
            response: 'logged'
          }));

          

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
  if(req.uid){

    res.status(200);
    console.log(req.uid.token);
    res.send(JSON.stringify({
      user: true, 
    }));

  }else{
    console.log("no session");
    res.status(500);
    res.send(JSON.stringify({
      user: false, 
    }));
  } 
});
 

module.exports = router;