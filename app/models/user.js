// User model

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var md5    = require('md5')

var UserSchema = new Schema({
  name: { type: String, required: true, }, //必须的
  password: { type: String, required: true, },
  email: { type: String, required: true, },
  created: {type: Date}
});

UserSchema.methods.verifyPassword = function(password){
	var isMatch =  md5(password) === this.password
	return isMatch
}

mongoose.model('User', UserSchema);

