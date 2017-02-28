var express = require('express-http2')
var bodyParser = require('body-parser')
var compression = require('compression')
var helmet = require('helmet')
const netClient = require('./net.client')
const uuidV4 = require('uuid/v4')
const PACKAGE = 'api.http'

var checkRequired = require('./jesus').checkRequired

module.exports = function getHttpApiPackage ({serviceName, serviceId, publicOnly = true, httpPort = 80, getMethods, getSharedConfig}) {
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE)
  try {
    checkRequired({serviceName, serviceId, getMethods, getSharedConfig})
    var LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE)
    var netClientPackage = netClient({getSharedConfig, serviceName, serviceId})
    var httpApi
    var httpServer
    async function start () {
      httpApi = express()
      httpApi.use(helmet())
      httpApi.use(compression({level: 1}))
      httpApi.use(bodyParser.json()) // support json encoded bodies
      httpApi.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
      httpApi.all('*', async (req, res) => {
        try {
          var methodName = req.url.replace('/', '')
          var serviceMethods = getMethods()
          var serviceMethodsConfig = await getSharedConfig(serviceName, 'methods')
          if (!serviceMethodsConfig[methodName])errorThrow(methodName + ' is not valid (not defined in methods config)')
          if (!serviceMethodsConfig[methodName].public && publicOnly)errorThrow(methodName + ' is not public')
          if (!serviceMethods[methodName])errorThrow(methodName + ' is not valid (not defined service methods js file)')
          var data = req.body || req.query
          var meta = {
            type: 'apiRequest',
            requestId: req.headers.requestId || uuidV4(),
            userId: data.userId,
            methodName,
            ip: req.ip,
            // headers: req.headers,
            timestamp: Date.now() / 1000
          }
          LOG.debug('Api request ' + methodName + ' requestId:' + meta.requestId, {methodName, httpPort, serviceMethods, data, meta})
          var eventReqResult = await netClientPackage.emit('apiRequest', {data, meta}, meta)
          if (!serviceMethodsConfig[methodName].stream) {
            var response = await serviceMethods[methodName](eventReqResult || data, meta)
            var eventResResult = await netClientPackage.emit('apiResponse', {response, meta}, meta)
            res.send(eventResResult || response)
          } else {
            // STREAM
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive'
            })
            var stream = {
              write: (data) => {
                res.write('data: ' + JSON.stringify(data) + '\n\n')
              },
              res
            }
            serviceMethods[methodName](eventReqResult || data, meta, stream)
          }
        } catch (error) {
          LOG.warn('Api error', {error})
          res.send({error})
        }
      })
      httpServer = httpApi.on('connection', function (socket) {
        socket.setTimeout(60000)
      }).listen(httpPort)
      LOG.debug('http Api listening on port' + httpPort)
    }
    return {
      start,
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
