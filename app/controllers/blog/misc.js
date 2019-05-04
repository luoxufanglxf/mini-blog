var express = require('express'),
    router = express.Router();

module.exports = function (app) {
    app.use('/', router);
};

router.get('/about', function (req, res, next) {
    res.render('blog/abobt', {
      title: 'About ME'
  })
})