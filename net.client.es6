var R = require('ramda')
var grpc = require('grpc')
var zlib = require('zlib')
var LOG = console
const PACKAGE = 'net.client'
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

module.exports =  function getNetClientPackage ({getAllServicesConfig, sharedServicePath}) {
  try {
    checkRequired({getAllServicesConfig, sharedServicePath}, PACKAGE)

    // var callServiceApi = ({service, eventListener, data}) => new Promise((resolve, reject) => {
    //   if (clientCache[service.url]) var client = clientCache[service.url]
    //   else {
    //     var clientClass = grpc.makeGenericClientConstructor(grpcService)
    //     var client = clientCache[service.url] = new clientClass(service.url, grpc.credentials.createInsecure())
    //   }
    //   var callTimeout = setTimeout(() => {
    //     grpc.closeClient(client)
    //     reject({message: 'Response problems: REQUEST TIMEOUT', service, eventListener, data})
    //   }, eventListener.timeout || 5000)
    //   // DI.log('NET MESSAGE SENDING', {route: eventListener.route, data})
    //   client.message({route: eventListener.route, data}, (error, serviceResponse) => {
    //     clearTimeout(callTimeout)
    //     if (error)reject(error)
    //     resolve(serviceResponse)
    //   })
    // })
    var clientCache = {}
    var getGrpcClient = (netUrl) => new Promise((resolve, reject) => {
      if (clientCache[netUrl])resolve(clientCache[netUrl])
      else {
        var ClientClass = grpc.makeGenericClientConstructor(grpcService)
        var client = clientCache[netUrl] = new ClientClass(netUrl, grpc.credentials.createInsecure())
        // grpc.waitForClientReady(client, 100000000, (error, response) => {
        //   LOG.debug("waitForClientReady",error, response)
        //   if (error)reject("GRPC cant connect to server "+netUrl)
        //   resolve(client)
        // })
        resolve(client)
      }
    })
    var callServiceApi = ({service, eventListenConfig, eventEmitConfig, data, serviceName}) => new Promise((resolve, reject) => {
      LOG.debug('callServiceApi', service, eventListenConfig, eventEmitConfig, data, serviceName)
      getGrpcClient(service.netUrl).then((client) => {
        var callTimeout = setTimeout(() => {
          grpc.closeClient(client)
          reject({message: 'Response problems: REQUEST TIMEOUT', service, eventListenConfig, eventEmitConfig, data, serviceName})
        }, eventEmitConfig.timeout || 5000)
        // DI.log('NET MESSAGE SENDING', {route: eventListener.route, data})
        client.message({method: eventListenConfig.method, data}, (error, serviceResponse) => {
          clearTimeout(callTimeout)
          if (error)reject(error)
          resolve(serviceResponse)
        })
      }).catch(error => {
        LOG.warn('callServiceApi error', error)
        reject(error)
      })
    })
    const buildServicesRegistry = (schema = 'events.listen.json') => {
      var services = getAllServicesConfig(schema)
      var listeners = {}
      R.mapObjIndexed((service, serviceName) => {
        R.mapObjIndexed((event, eventName) => {
          if (!listeners[eventName])listeners[eventName] = []
          listeners[eventName].push({serviceName, event, eventName})
        }, service)
      }, services)
      return listeners
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
      emit (name, data) {
        LOG.debug('emit', name, data,sharedServicePath+"/events.emit.json")
        var eventsEmitConfig = require(sharedServicePath+"/events.emit.json")
        if (!eventsEmitConfig[name]) return LOG.warn(name + ' event not defined in ' + eventsEmitConfigFile)
        var eventEmitConfig = eventsEmitConfig[name]

        var eventsListenRegistry = buildServicesRegistry('events.listen.json') // TO FIX ADD CACHE
        if (!eventsListenRegistry[name] || !eventsListenRegistry[name].length) {
          LOG.warn(name + ' event have no listeners ')
          return false
        }
        var servicesRegistry = getAllServicesConfig('service.json') // TO FIX ADD CACHE
        LOG.debug('servicesRegistry', servicesRegistry)
        var waitResponses = []
        eventsListenRegistry[name].forEach((eventListener) => {
          var serviceName = eventListener.serviceName
          var service = servicesRegistry[serviceName]
          var eventListenConfig = eventListener.event
          var callServiceApiPromise = callServiceApi({service, eventListenConfig, eventEmitConfig, data, serviceName})
          if (eventListenConfig.haveResponse && eventEmitConfig.waitResponse)waitResponses.push(callServiceApiPromise)
        })
        LOG.debug('waitResponses', waitResponses)
        var result
        if (eventEmitConfig.waitResponse) {
          if (eventEmitConfig.singleResponse) result = waitResponses[0]
          else result = Promise.all(waitResponses)
        } else { result = false }

        LOG.debug('emit result', result)
        return result
      }
    }
  } catch (error) {
    LOG.error(PACKAGE, error)
    throw new Error('getNetClientPackage')
  }
}