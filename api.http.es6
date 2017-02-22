var express = require('express-http2')
var bodyParser = require('body-parser')
var compression = require('compression')
var helmet = require('helmet')
const netClient = require('./net.client')
const PACKAGE = 'api.http'

var checkRequired = require('./jesus').checkRequired
var checkRequiredFiles = require('./jesus').checkRequiredFiles

module.exports = function getHttpApiPackage ({serviceName, serviceId, publicOnly = true, httpPort = 80, serviceMethodsFile, sharedServicePath, sharedServicesPath}) {
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE)
  try {
    checkRequired({serviceName, serviceId, serviceMethodsFile, sharedServicePath, sharedServicesPath})
    checkRequiredFiles([sharedServicePath + '/methods.json'])
    var LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE)
    var netClientPackage = netClient({sharedServicesPath, sharedServicePath, serviceName, serviceId})
    var httpApi
    var httpServer
    return {
      async  start () {
        httpApi = express()
        httpApi.use(helmet())
        httpApi.use(compression({level: 1}))
        httpApi.use(bodyParser.json()) // support json encoded bodies
        httpApi.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
        httpApi.all('*', async (req, res) => {
          try {
            var methodName = req.url.replace('/', '')
            var serviceMethods = require(serviceMethodsFile)
            var serviceMethodsConfig = require(sharedServicePath + '/methods.json')
            LOG.debug('serviceMethodsConfig', {sharedServicePath, serviceMethodsConfig})
            if (!serviceMethodsConfig[methodName])errorThrow(methodName + ' is not valid (not defined in methods.json)')
            if (!serviceMethodsConfig[methodName].public && publicOnly)errorThrow(methodName + ' is not public')
            if (!serviceMethods[methodName])errorThrow(methodName + ' is not valid (not defined service methods.js file)')
            var data = req.body || req.query
            var meta = {
              type: 'apiRequest',
              methodName,
              ip: req.ip,
              headers: req.headers,
              timestamp: Date.now() / 1000
            }
            LOG.debug('Api request ' + methodName, {methodName, httpPort, serviceMethodsFile, data, meta})
            var eventReqResult = await netClientPackage.emit('apiRequest', {data, meta})
            if (!serviceMethodsConfig[methodName].stream) {
              var response = await serviceMethods[methodName](eventReqResult || data, meta)
              var eventResResult = await netClientPackage.emit('apiResponse', {response, meta})
              res.send(eventResResult || response)
            } else {
              // STREAM
              res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
              })
              var stream = {write: (data) => {
                res.write('data: ' + JSON.stringify(data) + '\n\n')
              }, close: res.close}
              await serviceMethods[methodName](eventReqResult || data, meta, stream)
            }
          } catch (error) {
            LOG.warn('Api error', {error})
            res.send({error})
          }
        })
        httpServer = httpApi.listen(httpPort)
        LOG.debug('http Api listening on port' + httpPort)
      },
      stop () {
        httpServer.close()
      },
      httpart () {
        httpServer.close(start)
      }
    }
  } catch (error) {
    errorThrow('getHttpApiPackage', {error})
  }
}

// {

// }
