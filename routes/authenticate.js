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
      // parsed response body as js object 
      // console.log(data);
      if(res.status(200)){
        var sess = req.session; 
        if(!sess.token){
          // userSession.cookie.expires  = false;
          sess.cookie.token = data;   
          sess.cookie.reload(function(err) {
            if(err){
              res.end(JSON.stringify({
                message: err,
                error: {}
              }));
            }

            console.log(sess.cookie);

          })
          res.send({
            status: 200
          });
          req.session.reload(function(err) {
            // session updated
          })
        }
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
  var sess = req.session; 
  if(sess.cookie){
    console.log(userSession.cookie);
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

module.exports = router;