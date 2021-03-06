const express  = require('express')
const router   = express.Router()
const mongoose = require('mongoose')
const md5 = require('md5')
const passport = require('passport')
const User     = mongoose.model('User')

module.exports = function (app) {
  app.use('/admin/users', router)
}

module.exports.requireLogin = function(req,res,next){
  if(req.user){
    next()
  }else{
    req.flash('error', "不是罗旭芳是进不去滴")
    res.redirect('/admin/users/login')
  }
}

router.get('/login', function (req, res, next) {
  res.render('blog/user/login', {
    title: '登录'
  })
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/admin/users/login' ,
    failureFlash: '你不是罗旭芳你进不去后台'
  }),
  function (req, res, next) {
    res.redirect('/admin/posts')
})

router.get('/register', function (req, res, next) {
  res.render('blog/user/register', {
    title: '注册'
  })
})

router.post('/register', function (req, res, next) {
  req.checkBody('myname','用户名不能为空').notEmpty()
  req.checkBody('password','密码不能为空').notEmpty()

  const errors = req.validationErrors()
  if(errors){
    return res.render('blog/user/register', req.body)
  }

  const user = new User({
    name: req.body.myname,
    email: req.body.myname,
    password: md5(req.body.password),
    created: new Date()
  })

  user.save( function(err, user){
    if(err){
      req.flash('error', '注册失败')
      res.render('/admin/users/register')
    }else{
      req.flash('info', '恭喜你成功注册')
      res.redirect('/admin/users/login')
    }
  })
})

router.get('/logout', function (req, res, next) {
  req.logout()
  res.redirect('/')
})