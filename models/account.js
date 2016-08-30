// user model
var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Account = new Schema({
  uid: String,
  name: String,
  score: String,
  level: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('account', Account);