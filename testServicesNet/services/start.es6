var path = require('path')
var fs = require('fs')
var jesus = require('../../jesus')
module.exports = async function startMicroservice (CONFIG, serviceId, methodsFile) {
  var serviceName = CONFIG.serviceName

  var getSharedConfig = jesus.getSharedConfig(CONFIG.sharedServicesPath)
  var getConsole = (serviceName, serviceId, pack) => jesus.getConsole(CONFIG.console, serviceName, serviceId, pack)
  var getMethods = () => {
    return require(methodsFile)
  }
  setInterval(() => require.cache = [], 5000)
  var SHARED_CONFIG = await getSharedConfig(serviceName, 'service')
  var SHARED_NET_CONFIG = await getSharedConfig(serviceName, 'net')
  var SERVICE = { serviceId, serviceName, SHARED_CONFIG, CONFIG ,SHARED_NET_CONFIG}
  SERVICE.net = require('../../net.server')({serviceId, serviceName, config: SHARED_NET_CONFIG, getMethods, getSharedConfig, getConsole})

  SERVICE.start = async () => {
    await SERVICE.net.start()
  }
  SERVICE.stop = () => {
    SERVICE.net.stop()
  }
  await SERVICE.start()
  return SERVICE
}
