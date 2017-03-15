var grpc = require('grpc')
const PACKAGE = 'transport.grpc.server'
const checkRequired = require('../jesus').checkRequired
var zlib = require('zlib')
const publicApi = false

// MESSAGE SERIALIZATION

var serviceServer
module.exports = function getTransportGrpcServerPackage ({serialize, deserialize, getConsole, methodCall, serviceName = 'unknow', serviceId = 'unknow', config}) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  try {
    var serializeDefault = (obj) => zlib.deflateSync(JSON.stringify(obj))
    var deserializeDefault = (buffer) => JSON.parse(zlib.inflateSync(buffer))
    var grpcService = {
      message: {
        path: 'message',
        requestStream: null,
        responseStream: null,
        requestSerialize: serialize || serializeDefault,
        requestDeserialize: deserialize || deserializeDefault,
        responseSerialize: serialize || serializeDefault,
        responseDeserialize: deserialize || deserializeDefault
      },
      messageStream: {
        path: 'messageStream',
        requestStream: false,
        responseStream: true,
        requestSerialize: serialize || serializeDefault,
        requestDeserialize: deserialize || deserializeDefault,
        responseSerialize: serialize || serializeDefault,
        responseDeserialize: deserialize || deserializeDefault
      }
    }
    var grpcServiceFunctions = {
      async message (call, callback) {
        try {
          var response = await methodCall(call.request, false, publicApi,"grpc")
          callback(null, response)
        } catch (error) {
          CONSOLE.error('message error', error)
          callback(error, null)
        }
      },
      async messageStream (call) {
        try {
          var getStream = (onClose, MAX_REQUEST_TIMEOUT = 120000) => {
            const close = () => { if (timeout)clearTimeout(timeout); onClose() }
            var timeout = setTimeout(() => { call.end(); close() }, MAX_REQUEST_TIMEOUT)
            return call
          }
          methodCall(call.request, getStream, publicApi,"grpc")
        } catch (error) {
          CONSOLE.error('messageStream error', error)
          call.cancel()
        }
      }
    }
    function start () {
      serviceServer = new grpc.Server()
      serviceServer.addService(grpcService, grpcServiceFunctions)
      serviceServer.bind(config.url, grpc.ServerCredentials.createInsecure())
      serviceServer.start()
      CONSOLE.debug('Net started on port:' + config.url)
    }
    checkRequired({serviceName, serviceId, config, methodCall, getConsole})
    return {
      start,
      stop () {
        serviceServer.tryShutdown(() => {})
      },
      restart () {
        serviceServer.tryShutdown(start)
      }
    }
  } catch (error) {
    CONSOLE.error(error, {config})
    throw new Error('getTransportGrpcServerPackage ' + config.url)
  }
}
