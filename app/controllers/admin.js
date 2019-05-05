const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')

module.exports = function (app) {
  app.use('/admin', router);
}

router.get('/', function (req, res, next) {
  res.redirect('/admin/posts')
})