var grpc = require('grpc')
var R = require('ramda')
module.exports = function getGrpcApiPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'api.grpc'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['proto', 'grpcUrl'], PACKAGE)
    DI = checkRequired(DI, [ 'getRoutes','throwError', 'log', 'debug'], PACKAGE)

    var addGrpcRoutesBridge = (routeFunction) => {
      return function grpcBridge (call, callback) {
        routeFunction(call.request)
        .then(response => callback(null, response)) // PROBLEMA: grpc non da errore in caso di risposta formattata male
        .catch(error => callback(null, error))
      }
    }
    var grpcApi
    var routeServer
    return {
      async start () {
        grpcApi = R.map(addGrpcRoutesBridge, DI.getRoutes())
        var protoFile = await getValuePromise(CONFIG.proto)
        var grpcUrl = await getValuePromise(CONFIG.grpcUrl)
        var PROTO = grpc.load(protoFile)
        routeServer = new grpc.Server()
        routeServer.addProtoService(PROTO.Service.service, grpcApi)
        routeServer.bind(grpcUrl, grpc.ServerCredentials.createInsecure())
        routeServer.start()
      },
      stop () {
        routeServer.tryShutdown(() => {})
      },
      restart () {
        routeServer.tryShutdown(start)
      }
    }
  } catch (error) {
    DI.throwError('getGrpcApiPackage(CONFIG, DI)', error)
  }
}

// {

// }
