var grpc = require('grpc')
var zlib = require('zlib')
const PACKAGE = 'transport.grpc.client'
const checkRequired = require('../jesus').checkRequired

module.exports = function getTransportGrpcClientPackage ({serialize, deserialize, getConsole, serviceName = 'unknow', serviceId = 'unknow'}) {
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
    var getClient = (url) => {
      var ClientClass = grpc.makeGenericClientConstructor(grpcService)
      return new ClientClass(url, grpc.credentials.createInsecure())
    }
    checkRequired({serviceName, serviceId, getConsole})
    return {
      send (listener, message, timeout = 120000, waitResponse = true, isStream = false) {
        return new Promise((resolve, reject) => {
          CONSOLE.debug('send:', JSON.stringify({listener, message, timeout, waitResponse, isStream}))
          var client = getClient(listener.url)
          var callTimeout, call
          if (isStream) {
            call = client.messageStream(message)
            resolve(call)
          } else {
            CONSOLE.debug('client.message call')
            call = client.message(message, (error, serviceResponse) => {
              CONSOLE.debug('client.message response:', JSON.stringify({error, serviceResponse}))
              if (callTimeout)clearTimeout(callTimeout)
              if (error) return reject(error)
              if (waitResponse)resolve(serviceResponse)
            })
            callTimeout = setTimeout(() => {
              call.end()
              CONSOLE.warn('sendMessage timeout  to ' + listener.url, { message,serviceName, timeout })
              if (waitResponse)reject('Response problems: REQUEST TIMEOUT')
              else resolve(null)
            }, timeout)
          }
          if (!waitResponse)resolve(null)
        })
      }
    }
  } catch (error) {
    CONSOLE.error(error, {getConsole})
    throw new Error('Error during getTransportGrpcClientPackage')
  }
}
