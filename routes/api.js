var express    = require('express');
var app        = express();
var router     = express.Router();
var session    = require('express-session');  
var bodyparser = require('body-parser');  
var Client     = require('node-rest-client').Client;
var client     = new Client();


var MemoryStore = session.MemoryStore,
    sessionStore = new MemoryStore();

router.get('/login', function(req, res) {
    var env = process.env.API_END_POINT;
    res.status(200).json.Stringfy({
      api: env
    });
});

router.get('/question', function(req, res, next) {
// console.log(res.cookie);
    var env = process.env.API_QUESTION;
    res.status(200).json.Stringfy({
      api: env
    });

});
 

module.exports = router;