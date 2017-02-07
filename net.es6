var grpc = require('grpc')
var R = require('ramda')

module.exports = async function getNetPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'net.grpc'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['eventsRegistry'], PACKAGE)
    DI = checkRequired(DI, [ 'throwError', 'log', 'debug'], PACKAGE)
    var grpcCredentials = await getValuePromise(CONFIG.grpcCredentials)

    var callGrpc = ({service, eventListener, data}) => new Promise((resolve, reject) => {
      var grpcService = grpc.load(service.proto).Service
      var client = new grpcService(service.grpc.url, grpcCredentials)
      var callTimeout = setTimeout(() => {
        grpc.closeClient(client)
        reject({message: 'Response problems: REQUEST TIMEOUT: control proto file for correct response format', service, eventListener, data})
      }, eventListener.timeout || 5000)

      client[eventListener.route](data, (error, serviceResponse) => {
        clearTimeout(callTimeout)
        if (error)reject(error)
        resolve(serviceResponse)
      })
    })
    var eventsRegistry = await getValuePromise(CONFIG.eventsRegistry)
    return {
      emitEvent ({name, data, singleResponse = true}) {
        if (eventsRegistry && eventsRegistry.listeners && eventsRegistry.listeners[name]) {
          var waitResponses = []
          eventsRegistry.listeners[name].forEach((eventListener) => {
            var service = eventsRegistry.services[eventListener.service]
            var callGrpcPromise = callGrpc({service: service, eventListener, data})
            if (eventListener.haveResponse)waitResponses.push(callGrpcPromise)
          })
          if (waitResponses.length) {
            if (singleResponse) return waitResponses[0]
            else return Promise.all(waitResponses)
          }
        }
      }
    }
  } catch (error) {
    DI.throwError('getNetPackage(CONFIG, DI)', error)
  }
}
