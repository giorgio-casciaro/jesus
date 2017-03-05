var express = require('express-http2')
var bodyParser = require('body-parser')
var compression = require('compression')
var helmet = require('helmet')
const netClient = require('./net.client')
const uuidV4 = require('uuid/v4')
const PACKAGE = 'api.http'

var checkRequired = require('./jesus').checkRequired

module.exports = function getHttpApiPackage ({serviceName, serviceId, publicOnly = true, httpPort = 80, getMethods, getSharedConfig, getConsole}) {
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE)
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)

  var validateMethodRequest = (methodName, serviceMethodsConfig, data) => require('./jesus').validateMethodFromConfig(errorThrow, serviceName, serviceId, serviceMethodsConfig, methodName, data, 'requestSchema')
  var validateMethodResponse = (methodName, serviceMethodsConfig, data) => require('./jesus').validateMethodFromConfig(errorThrow, serviceName, serviceId, serviceMethodsConfig, methodName, data, 'responseSchema')
  // var validateMethodRequest = async (methodName, data) => true
  // var validateMethodResponse = async (methodName, data) => true
  try {
    checkRequired({serviceName, serviceId, getMethods, getSharedConfig, getConsole})
    var netClientPackage = netClient({getSharedConfig, serviceName, serviceId, getConsole})
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
        //  CONSOLE.debug('Api request ' + methodName + ' requestId:' + meta.requestId, {methodName, httpPort, serviceMethods, data, meta})
          var eventReqResult = await netClientPackage.emit('apiRequest', {data, meta}, meta)
          validateMethodRequest(methodName, serviceMethodsConfig, data, meta)
          var response, eventResResult
          if (!serviceMethodsConfig[methodName].stream) {
            response = await serviceMethods[methodName](eventReqResult || data, meta, res)
            validateMethodResponse(methodName, serviceMethodsConfig, response, meta)
            eventResResult = await netClientPackage.emit('apiResponse', {response, meta}, meta)
            res.send(eventResResult || response)
          } else {
            // STREAM
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive'
            })
            var getStream = (onClose, MAX_REQUEST_TIMEOUT = 120000) => {
              const close = () => { if (timeout)clearTimeout(timeout); onClose() }
              res.on('close', close)
              res.on('finish', close)
              res.on('error', close)
              var timeout = setTimeout(res.end, MAX_REQUEST_TIMEOUT)
              return async (data) => {
              //  CONSOLE.debug('stream callback', data)
                try {
                  //validateMethodResponse(methodName, serviceMethodsConfig, data, meta)
                  var streamEventResult = await netClientPackage.emit('apiStreamResponse', data, meta)
                  res.write('data: ' + JSON.stringify(streamEventResult || data) + '\n\n')
                  res.flush()
                } catch (error) {
                  errorThrow('apiStreamResponse', {error,methodName, serviceMethodsConfig, data, meta})
                }
              }
            }
            response = await serviceMethods[methodName](eventReqResult || data, meta, res, getStream)
            validateMethodResponse(methodName, serviceMethodsConfig, response, meta)
            if (response) { // SEND RESPONSE AS FIRST CHUNK
              eventResResult = await netClientPackage.emit('apiResponse', {response, meta}, meta)
              res.write('data: ' + JSON.stringify(eventResResult || response) + '\n\n')
              res.flush()
            }
          }
        } catch (error) {
          CONSOLE.warn('Api error', {error})
          res.send({error})
        }
      })
      httpServer = httpApi.on('connection', function (socket) {
        // socket.setTimeout(60000)
      }).listen(httpPort)
      CONSOLE.debug('http Api listening on port' + httpPort)
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
