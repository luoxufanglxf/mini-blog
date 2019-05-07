const express  = require('express')
const router   = express.Router()
const mongoose = require('mongoose')
const auth     = require('./users')
const Message  = mongoose.model('Message')

module.exports = function (app) {
  app.use('/admin/message', router)
}

router.get('/', auth.requireLogin,function (req, res, next) {
  Message
    .find({})
    .sort('created')
    .exec(function(err,messages){
    if(err){
        return next(err)
    }
    res.render('admin/message', {
      title: '留言管理',
      messagess: messages
    })
  })
})