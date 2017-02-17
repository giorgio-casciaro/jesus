var grpc = require('grpc')
var zlib = require('zlib')
var LOG = console
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

module.exports = function getNetServerPackage ({netUrl, serviceMethodsFile}) {
  try {
    var serviceServer
    checkRequired({netUrl, serviceMethodsFile})
    async function start () {
      var grpcServiceFunctions = {
        message (call, callback) {
          // DI.log('NET MESSAGE RECEIVED', call.request)
          var methodName = call.request.method
          var service = require(serviceMethodsFile)
          if (!service[methodName]) throw methodName + ' is not valid'
          var method = service[methodName]
          var data = call.request.data
          method(data)
          .then(response => callback(null, response))
          .catch(error => callback(null, error))
        }
      }
      serviceServer = new grpc.Server()
      serviceServer.addService(grpcService, grpcServiceFunctions)
      serviceServer.bind(netUrl, grpc.ServerCredentials.createInsecure())
      serviceServer.start()
      LOG.debug(PACKAGE, 'Net started on port:' + netUrl)
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
    LOG.error(PACKAGE, error)
    throw PACKAGE + ' getNetServerPackage'
  }
}
