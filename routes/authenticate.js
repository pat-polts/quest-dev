var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose       = require('mongoose');

var User = require('../models/user.js');


router.post('/register', function(req, res) {
  // User.register(new User({ username: req.body.username }),
  //   req.body.password, function(err, account) {
  //   if (err) {
  //     return res.status(500).json({
  //       err: err
  //     });
  //   }
  //   passport.authenticate('local')(req, res, function () {
  //     return res.status(200).json({
  //       status: 'Registration successful!'
  //     });
  //   });
  // });

      
      var User = mongoose.model('users', userSchema);
      var demoUser = new User({username: 'demo', password: 'teste'});
      demoUser.save();
});

router.post('/login', function(req, res, next) {
      var User = mongoose.model('users', userSchema);
      User.findOne({username: req.body.username, password: req.body.password}, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to get login");
        } else {
          res.status(200).json(doc);
        }
      });

  // passport.authenticate('local', function(err, user, info) {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (!user) {
  //     return res.status(401).json({
  //       err: info
  //     });
  //   }
  //   req.logIn(user, function(err) {
  //     if (err) {
  //       return res.status(500).json({
  //         err: 'Could not log in user'
  //       });
  //     }
  //     res.status(200).json({
  //       status: 'Login successful!'
  //     });
  //   });
  // })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

module.exports = router;