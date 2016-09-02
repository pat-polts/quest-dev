var express  = require('express');
var router   = express.Router();
var sessions = require('express-session'); 
var mongoose = require('mongoose');
var sess; 

var Use = require('../models/user');

router.post('/login', function(req, res, next) {
   return res.status(400).send({
    message: 'This is an error!'
   });
   return res.status(500).send({
    message: 'This is an error!'
   });
});

// router.post('/login', function(req, res) {
//   if(!req.body) { 
//         return res.send(400); 
//     } // 6
//   console.log(req.body);
 
//   // $http.post('http://via.events/jogoquest/api/Usuarios/Logar', {Login: req.body.login, Senha: req.body.senha}, 
//   //   function(data, status) {
//   //     var error;
//   //     sess = req.session.users;
//   //     if(status === 200){
//   //       //logado
//   //       sess.logged = true;
//   //       sess.oken = data;
//   //       sess.save(function(err) {
//   //         // session saved
//   //         if(err){
//   //           error = err;
//   //           console.log(err);
//   //         }

//   //       });

//   //     }else if(status === 500){
//   //       //login ou senha invalido
//   //           error = "Login ou senha não existe";
//   //     }else{
//   //       //erro desconhecido
//   //           error = "Serviço indisponivel, tente mais tarde.";
//   //     }
//   // });

//   // return (data,status,sess,error);
// });


// router.post('/register', function(req, res) {
//   // User.register(new User({ username: req.body.username }),
//   //   req.body.password, function(err, account) {
//   //   if (err) {
//   //     return res.status(500).json({
//   //       err: err
//   //     });
//   //   }
//   //   passport.authenticate('local')(req, res, function () {
//   //     return res.status(200).json({
//   //       status: 'Registration successful!'
//   //     });
//   //   });
//   // });

      
//       var User = mongoose.model('users', userSchema);
//       var demoUser = new User({username: 'demo', password: 'teste'});
//       demoUser.save();
// });

// router.post('/login', function(req, res, next) {
//       var User = mongoose.model('users', userSchema);
//       User.findOne({username: req.body.username, password: req.body.password}, function(err, doc) {
//         if (err) {
//           handleError(res, err.message, "Failed to get login");
//         } else {
//           res.status(200).json(doc);
//         }
//       });

//   // passport.authenticate('local', function(err, user, info) {
//   //   if (err) {
//   //     return next(err);
//   //   }
//   //   if (!user) {
//   //     return res.status(401).json({
//   //       err: info
//   //     });
//   //   }
//   //   req.logIn(user, function(err) {
//   //     if (err) {
//   //       return res.status(500).json({
//   //         err: 'Could not log in user'
//   //       });
//   //     }
//   //     res.status(200).json({
//   //       status: 'Login successful!'
//   //     });
//   //   });
//   // })(req, res, next);
// });

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

// router.get('/status', function(req, res) {
//   if (!req.isAuthenticated()) {
//     return res.status(200).json({
//       status: false
//     });
//   }
//   res.status(200).json({
//     status: true
//   });
// });

module.exports = router;