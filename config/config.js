let path = require('path')
let rootPath = path.normalize(__dirname + '/..')
let env = process.env.NODE_ENV || 'development'

let config = {
  production: {
    root: rootPath, 
    app: {
      name: 'miniblog'
    },
    port: process.env.PORT || 6637,
    db: 'mongodb://miniblog_runner:miniblog666@127.0.0.1:27017/miniblog'
  },
  development: {
    root: rootPath, 
    app: {
      name: 'miniblog'
    },
    port: process.env.PORT || 3003,
    db: 'mongodb://localhost/miniblog-test'
  }
}

module.exports = config[env]
