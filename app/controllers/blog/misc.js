var express = require('express'),
    router = express.Router();

module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.redirect('/posts')
});

router.get('/about', function (req, res, next) {
    res.render('blog/abobt', {
      title: 'About ME'
  })
})

router.get('/zzc', function (req, res, next) {
  res.render('blog/zzc', {
      title: 'Contact ME'
  })
})
