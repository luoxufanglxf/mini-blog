const express = require('express')
const config = require('./config/config')
const glob = require('glob')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(config.db, { useMongoClient:true })
const db = mongoose.connection
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
})

const models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model)
})
const app = express()

module.exports = require('./config/express')(app, config, db)
module.exports = require('./config/passport').init()

app.listen(config.port, function () {
  console.log('服务成功运行在端口：' + config.port)
})

