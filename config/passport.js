const passport      = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose      = require('mongoose')
const User          = mongoose.model('User')

module.exports.init = function(){
	passport.use(new LocalStrategy({
		usernameField: 'myname',
		passwordField: 'password'
	},function(myname, password, done) {
	    User.findOne({ name: myname }, function (err, user) {
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
		done(null, user._id)
	})

	passport.deserializeUser(function(id, done) {
		User.findById(id, function (err, user) {
			done(err, user)
		})
	})
}