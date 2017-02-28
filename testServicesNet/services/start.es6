var path = require('path')
var fs = require('fs')
var jesus = require('../../jesus')
module.exports = async function startMicroservice (CONFIG, serviceId, methodsFile) {
  var serviceName = CONFIG.serviceName

  var getSharedConfig = jesus.getSharedConfig(CONFIG.sharedServicesPath)
  var getMethods = () => {
    if (CONFIG.NODE_ENV === 'development') delete require.cache[require.resolve(methodsFile)]
    return require(methodsFile)
  }
  var SHARED_CONFIG = await getSharedConfig(serviceName, 'service')

  var SERVICE = { serviceId, serviceName, SHARED_CONFIG, CONFIG }

  SERVICE.apiPublic = require('../../api.http')({ serviceId, serviceName, publicOnly: true, httpPort: SHARED_CONFIG.httpPublicApiPort, getMethods, getSharedConfig})
  SERVICE.apiPrivate = require('../../api.http')({serviceId, serviceName, publicOnly: false, httpPort: SHARED_CONFIG.httpPrivateApiPort, getMethods, getSharedConfig})
  SERVICE.net = require('../../net.server')({serviceId, serviceName, netUrl: SHARED_CONFIG.netUrl, getMethods, getSharedConfig})

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
