var path = require('path')
var fs = require('fs')

var CONFIG = require('./config')
var SHARED_CONFIG = require(CONFIG.sharedServicePath + '/service.json')
var serviceId = require('shortid').generate()
fs.writeFileSync(path.join(__dirname, './serviceId.json'), JSON.stringify(serviceId))
var serviceName = CONFIG.serviceName

module.exports = async function startMicroservice () {
  var SERVICE = {
    serviceId, serviceName, SHARED_CONFIG, CONFIG
  }
  SERVICE.apiPublic = require('../../../api.http')({ serviceId, serviceName, publicOnly: true, httpPort: SHARED_CONFIG.httpPublicApiPort, serviceMethodsFile: CONFIG.serviceMethodsFile, sharedServicesPath: CONFIG.sharedServicesPath, sharedServicePath: CONFIG.sharedServicePath})
  SERVICE.apiPrivate = require('../../../api.http')({serviceId, serviceName, publicOnly: false, httpPort: SHARED_CONFIG.httpPrivateApiPort, serviceMethodsFile: CONFIG.serviceMethodsFile, sharedServicesPath: CONFIG.sharedServicesPath, sharedServicePath: CONFIG.sharedServicePath})
  SERVICE.net = require('../../../net.server')({serviceId, serviceName, netUrl: SHARED_CONFIG.netUrl, serviceMethodsFile: CONFIG.serviceMethodsFile, sharedServicePath: CONFIG.sharedServicePath, sharedServicesPath: CONFIG.sharedServicesPath})

  SERVICE.start = async () => {
    await SERVICE.apiPublic.start()
    await SERVICE.apiPrivate.start()
    await SERVICE.net.start()
  }
  SERVICE.stop = () => {
    SERVICE.apiPublic.stop()
    SERVICE.apiPrivate.stop()
    SERVICE.net.stop()
  }
  await SERVICE.start()
  return SERVICE
}
