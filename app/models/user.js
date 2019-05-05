// User model

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const md5    = require('md5')

const UserSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  created: { type: Date }
})

UserSchema.methods.verifyPassword = function(password){
	const isMatch = md5(password) === this.password
	return isMatch
}

mongoose.model('User', UserSchema)

