var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    Category = mongoose.model('Category'),
    nodemailer = require('nodemailer')

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

  var conditions = {published:true}

  if(req.query.keyword){
      conditions.title = new RegExp(req.query.keyword.trim(), 'i')
      conditions.content = new RegExp(req.query.keyword.trim(), 'i')
  }
  Post.find(conditions)
      .sort('-created')
      .populate('author')
      .populate('category')
      .exec(function (err, posts) {
          if (err) return next(err);

          var pageNum = Math.abs(parseInt(req.query.page || 1, 10))
          var pageSize = 5
          var totalCount = posts.length
          var pageCount = Math.ceil(totalCount / pageSize)

          if(pageNum > pageCount){
            pageNum = pageCount
          }

          res.render('blog/index', {
              title: '罗旭芳的mini-blog',
              posts: posts.slice((pageNum -1) * pageSize,pageNum * pageSize),
              pageNum:pageNum,
              pageCount:pageCount
          });
      });
});

router.get('/category/:title', function (req, res, next) {
    Category.findOne({title: req.params.title}).exec(function(err,category){
        if(err){
           return next(err)
        }

        Post.find({ category:category,published:true})
            .sort('created')
            .populate('category')
            .populate('author')
            .exec(function(err,posts){
                if(err){
                   return next(err)
                }

                res.render('blog/category', {
                    posts: posts,
                    category:category
                });
            })
    })
});

router.get('/view/:id', function (req, res, next) {
    if(!req.params.id){
      return next(new Error('no  post'))
    }

    var conditions = {};
    try{
      conditions._id = mongoose.Types.ObjectId(req.params.id)
    }catch(err){
      conditions.slug = req.params.id
    };
    
    Post.findOne(conditions)
        .populate('category')
        .populate('author')
        .exec(function(err,post){
            if(err){
              return next(err)
            }

            res.render('blog/view',{
                post:post
            })
        })
});

router.post('/comment/:id', function (req, res, next) {
        if(!req.body.email){
              return next(new Error('no  email'))
            }

        if(!req.body.content){
              return next(new Error('no  content'))
            }

        var conditions = {};
        try{
          conditions._id = mongoose.Types.ObjectId(req.params.id)
        }catch(err){
          conditions.slug = req.params.id
        };
        
        Post.findOne(conditions).exec(function(err,post){
            if(err){
              return next(err)
            }

            var comment = { 
              email: req.body.email, 
              content:req.body.content,
              created: new Date()
            }

            post.comments.unshift(comment)
            post.markModified('comments')

            post.save(function(err, post){
                req.flash('info', '评论成功添加')
                res.redirect('/posts/view/' + post.slug)
            })
        })
});

router.get('/favorite/:id', function (req, res, next) {


    var conditions = {};
    try{
      conditions._id = mongoose.Types.ObjectId(req.params.id)
    }catch(err){
      conditions.slug = req.params.id
    };
    
    Post.findOne(conditions)
        .populate('category')
        .populate('author')
        .exec(function(err,post){
            if(err){
              return next(err)
            }

            post.meta.favorite = post.meta.favorite ? post.meta.favorite + 1: 1
            post.markModified('meta')
            post.save(function(err){
                res.redirect('/posts/view/' + post.slug)
            })
        })
});

router.post('/comment/contactMe', function (req, res, next) {
});

router.post('/contactMe', function (req, res, next) {
    let name = req.body.name
    let email = req.body.email
    let content = req.body.content

    function sendEmail() {
        let transporter = nodemailer.createTransport({
            service: 'qq',
            auth: {
                user: '1761997216@qq.com',//user: 'jiayouzzc@126.com',	//   
                pass: 'jacnlcfehnmudjda'//pass: 'kobe241298'// 
            }
        })

        var mailOptions = {
            from: '1761997216@qq.com', // 发送者  
            to: 'jiayouzzc@126.com', // 接受者,可以同时发送多个,以逗号隔开  
            subject: `博客 留言`, // 标题  
            //text: 'Hello world', // 文本  
            html: `
                <p>姓名:</p><p>${name}</p>
                <p>邮箱:</p><p>${email}</p>
                <p>留言内容:</p><p>${content}</p>
            `
        }

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                return;
            }

            console.log('发送成功');
        })
    }
    sendEmail()
    
    
    res.redirect('/')
    //req.flash('info', '留言已通过邮箱发送给我，我会即使联系你')
});