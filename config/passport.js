
const passport      = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose      = require('mongoose')
const User          = mongoose.model('User')

module.exports.init = function(){
	console.log('passport.local.init')
	passport.use(new LocalStrategy({
		usernameField: 'myname',
		passwordField: 'password'
	},function(myname, password, done) {
		console.log('passport.local.find:' , myname)
	    User.findOne({ name: myname }, function (err, user) {
	    	console.log('passport.local.find:' , user, err)
			if (err) {
				return done(err)
			}
			if (!user) {
				return done(null, false)
			}
			if (!user.verifyPassword(password)) {
				return done(null, false)
			}
			return done(null, user)
	    })
	  }
	))

	passport.serializeUser(function(user, done) {
		console.log('passport.local.serializeUser:' , user)
		done(null, user._id)
	})

	passport.deserializeUser(function(id, done) {
		console.log('passport.local.deserializeUser:' , id)
		User.findById(id, function (err, user) {
			done(err, user)
		})
	})
}