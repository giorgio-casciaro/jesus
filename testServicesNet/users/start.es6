var uuidV4 = require('uuid/v4')
var path = require('path')
// import { addListener } from 'storyboard'
// import wsServerListener from 'storyboard/lib/listeners/wsServer'
// addListener(wsServerListener)

var CONFIG  = require('./config')
var SHARED_CONFIG = require(CONFIG.sharedServicePath+'/service.json')

module.exports = async function startMicroservice (configOverwrite = {}) {
  var SERVICE = {
    SHARED_CONFIG, CONFIG
  }
  SERVICE.instanceId = uuidV4()

  SERVICE.apiPublic = require('../../../api.http')({ publicOnly: true, httpPort: SHARED_CONFIG.httpPublicApiPort,  serviceMethodsFile: CONFIG.serviceMethodsFile,  sharedServicePath: CONFIG.sharedServicePath})
  SERVICE.apiPrivate = require('../../../api.http')({publicOnly: false, httpPort: SHARED_CONFIG.httpPrivateApiPort,  serviceMethodsFile: CONFIG.serviceMethodsFile,  sharedServicePath: CONFIG.sharedServicePath})
  SERVICE.net =  require('../../../net.server')({netUrl: SHARED_CONFIG.netUrl,serviceMethodsFile: CONFIG.serviceMethodsFile})

  await SERVICE.net.start()
  await SERVICE.apiPublic.start()
  await SERVICE.apiPrivate.start()

  SERVICE.stop = () => {
    SERVICE.apiPublic.stop()
    SERVICE.apiPrivate.stop()
    SERVICE.net.stop()
  }
  return SERVICE
}
