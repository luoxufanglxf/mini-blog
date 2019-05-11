const express  = require('express')
const router   = express.Router()
const slug     = require('slug')
const pinyin   = require('pinyin')
const auth     = require('./users')
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const Category = mongoose.model('Category')

module.exports = function (app) {
  app.use('/admin/categories', router)
}

router.get('/', auth.requireLogin,function (req, res, next) {
  res.render('admin/category/index', {
    title:'分类列表'
  })
})

router.get('/add', auth.requireLogin,function (req, res, next) {
  res.render('admin/category/add', {
    title:'添加分类',
    action: "/admin/categories/add",
    category:{ _id: ''}
  })
})

router.post('/add', auth.requireLogin,function (req, res, next) {
  req.checkBody('title','请添加分类名称').notEmpty()
  const errors = req.validationErrors()
  if(errors){
    return res.render('admin/category/add',{
      errors: errors,
      title:req.body.title,
    })
  }

  const title = req.body.title.trim()
  const py = pinyin(title, {
      style: pinyin.STYLE_NORMAL,
      heteronym: false
  }).map(function(item){
      return item[0]
  }).join(' ')

  var category = new Category({
    title:title,
    slug: slug(py),
    created: new Date()
  })

  category.save( function(err, category){
    if(err){
      req.flash('error', '文章保存失败')
      res.redirect('/admin/categories/add')
    }else{
      req.flash('info', '文章保存成功')
      res.redirect('/admin/categories')
    }
  })
})



router.get('/edit/:id', auth.requireLogin,getCategoryById,function (req, res, next) {
   res.render('admin/category/add',{
      action: "/admin/categories/edit/" + req.category._id,
      category: req.category
   })
})

router.post('/edit/:id', auth.requireLogin,getCategoryById,function (req, res, next) {
	const category = req.category
  const title = req.body.title.trim()

  const py = pinyin(title, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false
  }).map(function(item){
    return item[0]
  }).join(' ')

  category.title= title
  category.slug= slug(py)

  category.save( function(err, category){
    if(err){
      req.flash('error', '分类编辑失败')
      res.redirect('/admin/categories/edit/' + post._id)
    }else{
      req.flash('info', '分类编辑成功')
      res.redirect('/admin/categories')
    }
  })
})

router.get('/delete/:id', auth.requireLogin,getCategoryById,function (req, res, next) {
  req.category.remove(function(err, rowsRemove){
    if(err){
      return next(err)
    }

    if(rowsRemove){
      req.flash('success', '分类删除成功')
    }else{
      req.flash('success', '分类删除失败')
    }
    res.redirect('/admin/categories')
  })
})

function getCategoryById(req, res, next){
  if( !req.params.id){
    return next(new Error( ' category not flund'))
  }

  Category
    .findOne({ _id: req.params.id })
    .exec(function(err, category){
      if(err){
        return next(err)
      }
      if(!category){
        return next(new Error('category not flund'))
      }
      req.category = category
      next()
    })
}