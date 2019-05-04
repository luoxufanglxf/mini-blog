var express = require('express'),
    router = express.Router(),
    slug     = require('slug'),
    pinyin     = require('pinyin'),
    auth     = require('./users'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    Category = mongoose.model('Category');

module.exports = function (app) {
    app.use('/admin/categories', router);
};

router.get('/', auth.requireLogin,function (req, res, next) {
    res.render('admin/category/index', {
        
    });
});

router.get('/add', auth.requireLogin,function (req, res, next) {
    res.render('admin/category/add', {
        action: "/admin/categories/add",

        category:{ _id: ''}

    });
});

router.post('/add', auth.requireLogin,function (req, res, next) {
    req.checkBody('title','请添加分类名称').notEmpty()

    var errors = req.validationErrors()
    if(errors){
        return res.render('admin/category/add',{
            errors: errors,
            title:req.body.title,
        })
    }

    var title = req.body.title.trim()

        var py = pinyin(title, {
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
                console.log('张智超zzc:' ,err)
                req.flash('error', '文章保存失败')
                res.redirect('/admin/categories/add')
            }else{
                req.flash('info', '文章保存成功')
                res.redirect('/admin/categories')
            }
        })
});



router.get('/edit/:id', auth.requireLogin,getCategoryById,function (req, res, next) {
   res.render('admin/category/add',{
        action: "/admin/categories/edit/" + req.category._id,
        category: req.category
   })
})

router.post('/edit/:id', auth.requireLogin,getCategoryById,function (req, res, next) {

	var category = req.category

    var title = req.body.title.trim()

    var py = pinyin(title, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
    }).map(function(item){
        return item[0]
    }).join(' ')


    category.title= title
    category.slug= slug(py)

    category.save( function(err, category){
        if(err){
            console.log('张智超zzc:' ,err)
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

    Category.findOne({ _id: req.params.id})
            .exec( function(err, category){
                 if(err){
                    return next(err)
                 }
                 if(!category){
                    return next(new Error( ' category not flund'))
                 }

                 req.category = category
                 next()
            })
}