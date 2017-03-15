var path = require('path')
var fs = require('fs')
module.exports = async function startMicroservice () {
  var CONFIG = require('./config')
  var serviceId = require('shortid').generate()
  fs.writeFileSync(path.join(__dirname, './serviceId.json'), JSON.stringify(serviceId))
  var methodsFile=path.join(__dirname, './methods.js')
  var logDir = path.join(__dirname, './logs')
  var SERVICE = await require('../start')({CONFIG, serviceId, methodsFile, logDir})
  return SERVICE
}
