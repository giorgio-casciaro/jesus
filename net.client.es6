var R = require('ramda')
var grpc = require('grpc')
var zlib = require('zlib')
const PACKAGE = 'net.client'
const checkRequired = require('./jesus').checkRequired
const checkRequiredFiles = require('./jesus').checkRequiredFiles

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

module.exports = function getNetClientPackage ({serviceName, serviceId, sharedServicesPath, sharedServicePath}) {
  var getAllServicesConfig = (schema) => require('./jesus').getAllServicesConfigFromDir(sharedServicesPath, schema)
  try {
    var LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE)
    var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE)

    checkRequired({serviceName, serviceId, sharedServicesPath, sharedServicePath})
    checkRequiredFiles([sharedServicePath + '/events.emit.json'])

    var clientCache = {}
    var getGrpcClient = (netUrl) => new Promise((resolve, reject) => {
      var client
      if (clientCache[netUrl])client =clientCache[netUrl]
      else {
        var ClientClass = grpc.makeGenericClientConstructor(grpcService)
         client = clientCache[netUrl] = new ClientClass(netUrl, grpc.credentials.createInsecure())
      }
      LOG.debug('getGrpcClient ', client)
      resolve(client)
    })
    var sendMessage = ({name, listenerService, eventListenConfig, eventEmitConfig, data, listenerServiceName}) => new Promise((resolve, reject) => {
      LOG.debug('sendMessage ' + name + ' to ' + listenerServiceName, {name, listenerService, eventListenConfig, eventEmitConfig, data, listenerServiceName})
      getGrpcClient(listenerService.netUrl).then((client) => {
        // if (eventListenConfig.haveResponse) {
        var callTimeout
        var call = client.message({ serviceName, serviceId, event: name, method: eventListenConfig.method, data}, (error, serviceResponse) => {
          if (callTimeout)clearTimeout(callTimeout)
          if (error)reject(error)
          resolve(serviceResponse)
        })
        callTimeout = setTimeout(() => {
          // client.$channel.close()
          // grpc.closeClient(client)
          call.cancel()
          LOG.warn('sendMessage timeout ' + name + ' to ' + listenerServiceName, {serviceName, listenerService, timeout: eventEmitConfig.timeout})
            // grpc.closeClient(client)
          if (eventListenConfig.haveResponse)reject({message: 'Response problems: REQUEST TIMEOUT', listenerService, eventListenConfig, eventEmitConfig, data, listenerServiceName})
          else resolve()
        }, eventListenConfig.timeout||5000)
        // }
        // DI.log('NET MESSAGE SENDING', {route: eventListener.route, data})
        // var deadline = 10000000000
        // deadline.setSeconds(deadline.getSeconds() + 100000)
        // var deadline = Infinity

        // if (!eventListenConfig.haveResponse)resolve()
      }).catch(error => {
        LOG.warn('sendMessage error' + name + ' to ' + listenerServiceName, error)
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

    function emit (name, data) {
      LOG.debug('emit ' + name, {name, data, sharedServicePath})
      var eventsEmitConfig = require(sharedServicePath + '/events.emit.json')
      if (!eventsEmitConfig[name]) return LOG.warn(name + ' event not defined in /events.emit.json')
      var eventEmitConfig = eventsEmitConfig[name]

      var eventsListenRegistry = buildServicesRegistry('events.listen.json') // TO FIX ADD CACHE

      var servicesRegistry = getAllServicesConfig('service.json') // TO FIX ADD CACHE
      //LOG.debug('emit info', {eventEmitConfig, eventsListenRegistry, servicesRegistry})
      var waitResponses = []
      var eventListeners = []
      if (eventsListenRegistry[name])eventListeners = eventListeners.concat(eventsListenRegistry[name])
      if (eventsListenRegistry['*'])eventListeners = eventListeners.concat(eventsListenRegistry['*'])
      if (!eventListeners.length) {
        LOG.debug(name + ' event have no listeners ')
        return false
      }
      eventListeners.forEach((eventListener) => {
        var listenerServiceName = eventListener.serviceName
        var listenerService = servicesRegistry[listenerServiceName]
        var eventListenConfig = eventListener.event
        var sendMessagePromise = sendMessage({name, listenerService, listenerServiceName, eventListenConfig, eventEmitConfig, data, listenerServiceName})
        if (eventListenConfig.haveResponse && eventEmitConfig.waitResponse)waitResponses.push(sendMessagePromise)
      })
      LOG.debug('emit ' + name +' waitResponses', waitResponses)
      var result
      if (eventEmitConfig.waitResponse) {
        if (eventEmitConfig.responseRequired && !waitResponses.length) errorThrow(name + ' event need a response')
        if (eventEmitConfig.singleResponse) result = waitResponses[0]
        else result = Promise.all(waitResponses)
      } else { result = false }

      LOG.debug('emit ' + name +' results', result)
      return result
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
      emit
    }
  } catch (error) {
    errorThrow('getNetClientPackage', {error, getAllServicesConfig, sharedServicePath, serviceName})
  }
}
