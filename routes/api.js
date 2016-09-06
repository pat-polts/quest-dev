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
// console.log(res.cookie);
    var env = process.env.API_QUESTION + req.session.token;
    httpClient.post(env, function (data, response) {
      if(data){
        
         res.status(200);
         
        res.send(json.Stringfy({
          api: env
        }));

      }else{
        res.status(500);
          res.send({
            logged: false
          }); 
      } 
    });

});
 

module.exports = router;