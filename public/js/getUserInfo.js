const axios = require('axios')

var getIpInfo = function (ip,cb) {
  var url = `http://ip-api.com/json/${ip}?lang=zh-CN`;

  return axios.get(url)
    .then(res => {
        cb(res.data)
    })
    .catch(function (error) {
        cb(error)
    })
}

module.exports = getIpInfo