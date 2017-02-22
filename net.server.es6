var grpc = require('grpc')
var zlib = require('zlib')
const PACKAGE = 'net.server'
const checkRequired = require('./jesus').checkRequired

// MESSAGE SERIALIZATION
var serializedDataByte = 0
var serializeFunction = (obj, dictionary) => zlib.deflateSync(JSON.stringify(obj), {dictionary})
var deserializeFunction = (obj, dictionary) => JSON.parse(zlib.inflateSync(obj, {dictionary}))
function serializeJson (obj) {
  var result = serializeFunction(obj)
  serializedDataByte += (result.byteLength)
  return result
}
function deserializeJson (buffer) {
  var result = deserializeFunction(buffer)
  return result
}
var grpcService = {
  message: {
    path: 'message',
    requestStream: false,
    responseStream: false,
    requestSerialize: serializeJson,
    requestDeserialize: deserializeJson,
    responseSerialize: serializeJson,
    responseDeserialize: deserializeJson
  }
}

module.exports = function getNetServerPackage ({serviceName, serviceId, netUrl, serviceMethodsFile, sharedServicePath}) {
  var LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE)
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE)
  try {
    var serviceServer
    checkRequired({serviceName, serviceId, netUrl, serviceMethodsFile, sharedServicePath})
    async function start () {
      var grpcServiceFunctions = {
        message (call, callback) {
          var event = call.request.event
          var eventsListenConfig = require(sharedServicePath + '/events.listen.json')
          if (!eventsListenConfig[event] && !eventsListenConfig['*']) return LOG.warn(netUrl, event + ' event not defined in /events.listen.json')
          var eventConfig = eventsListenConfig[event] || eventsListenConfig['*']

          var serviceName = call.request.serviceName
          var methodName = call.request.method
          var service = require(serviceMethodsFile)
          if (!service[methodName]) throw methodName + ' is not valid'
          var method = service[methodName]
          var data = call.request.data
          var meta = {
            type: 'netEvent',
            from: serviceName,
            event,
            timestamp: Date.now()
          }
          LOG.debug('message received ' + methodName, {eventConfig})
          if (eventConfig.haveResponse) {
            method(data, meta).then(response => {
              LOG.debug('message response ' + methodName, {response})
              callback(null, response)
            }).catch(error => {
              LOG.warn('message error ' + methodName, {error})
              callback(null, error)
            })
          } else {
            LOG.debug('message aknowlegment ' + methodName)
            method(data, meta)
            callback(null, {aknowlegment: true})
          }
        }
      }
      serviceServer = new grpc.Server()
      serviceServer.addService(grpcService, grpcServiceFunctions)
      serviceServer.bind(netUrl, grpc.ServerCredentials.createInsecure())
      serviceServer.start()
      LOG.debug('Net started on port:' + netUrl)
    }
    return {
      getSerializedDataByte () {
        return serializedDataByte
      },
      resetSerializedDataByte () {
        serializedDataByte = 0
      },
      setSerializeFunction (newFunc) {
        serializeFunction = newFunc
      },
      setDeserializeFunction (newFunc) {
        deserializeFunction = newFunc
      },
      start,
      stop () {
        serviceServer.tryShutdown(() => {})
      },
      restart () {
        serviceServer.tryShutdown(start)
      }
    }
  } catch (error) {
    errorThrow('getNetServerPackage', {error, netUrl, serviceMethodsFile, sharedServicePath})
  }
}
