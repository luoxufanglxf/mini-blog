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

router.get('/delete/:id', auth.requireLogin , function (req, res, next) {
  if(!req.params.id){
    return next(new Error('no message id provided'))
  }

  Message.remove({ _id: req.params.id}).exec(function(err, rowsRemove){
    if(err){
      return next(err)
    }

    if(rowsRemove){
      req.flash('success', '文章删除成功')
    }else{
      req.flash('success', '文章删除失败')
    }
    res.redirect('/admin/message')
  })
})