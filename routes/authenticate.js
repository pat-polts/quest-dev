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
        req.session.token = data;
        res.locals.token = data;
          res.send({
            status: 200
          });

      }else if(res.status(500)){
          res.send({
            status: 500
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

router.get('/status', function(req,res,next){ 
  // console.log(req);
  if (req.sessionID){ 
    console.log(req.sessions);
    // console.log(req.sessions["token"]);
  }

  if(req.body){
    res.status(200);
    res.send({
      user: true
    });
  }else{
    res.status(500);
    res.send({
      user: false
    });
  }

});

router.get('/api', function(req,res,next){

  client.registerMethod("jsonMethod", process.env.API_HELP, "GET");
  client.get(process.env.API_HELP,
    function (data, response) {
        // parsed response body as js object 
        console.log(data);
        // raw response 
        console.log(response);
    });

});

module.exports = router;