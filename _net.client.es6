var R = require('ramda')
var grpc = require('grpc')
var zlib = require('zlib')
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
  },

  messageMulti: {
    path: 'messageMulti',
    requestStream: false,
    responseStream: false,
    requestSerialize: serializeJson,
    requestDeserialize: deserializeJson,
    responseSerialize: serializeJson,
    responseDeserialize: deserializeJson
  }
}

var delayedSendData = global.JESUS_NET_CLIENT_delayedSendData = global.JESUS_NET_CLIENT_delayedSendData || {}

module.exports = function getNetClientPackage ({getConsole, serviceName, serviceId, getSharedConfig}) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE)
  try {
    checkRequired({serviceName, serviceId, getSharedConfig})
    var defaultEventEmit = require('./default.event.emit.json')

    var clientCache = {}
    var getGrpcClient = (netUrl) => new Promise((resolve, reject) => {
      var client
      if (clientCache[netUrl])client = clientCache[netUrl]
      else {
        var ClientClass = grpc.makeGenericClientConstructor(grpcService)
        client = clientCache[netUrl] = new ClientClass(netUrl, grpc.credentials.createInsecure())
      }
      CONSOLE.debug('getGrpcClient ', client)
      resolve(client)
    })
    var sendMessage = ({throwOnErrorResponse, name, netUrl, timeout = 5000, method, multi = false, haveResponse, data, listenerServiceName, meta}) => new Promise((resolve, reject) => {
      CONSOLE.debug('sendMessage ' + name + ' to ' + listenerServiceName, {name, data, listenerServiceName, meta})
      getGrpcClient(netUrl).then((client) => {
        // if (eventListenConfig.haveResponse) {
        var callTimeout
        var corrid = meta.corrid
        var userid = meta.userid
        var messageFunction = 'message'
        if (multi) messageFunction = 'messageMulti'
        var call = client[messageFunction]({ serviceName, serviceId, event: name, method, data, corrid, userid}, (error, serviceResponse) => {
          if (callTimeout)clearTimeout(callTimeout)
          if (error)reject(error)
          resolve(serviceResponse)
        })
        callTimeout = setTimeout(() => {
          call.cancel()
          CONSOLE.warn('sendMessage timeout ' + name + ' to ' + listenerServiceName, {serviceName, timeout })
          if (haveResponse)reject({message: 'Response problems: REQUEST TIMEOUT', data, listenerServiceName})
          else resolve()
        }, timeout)
      }).catch(error => {
        CONSOLE.warn('sendMessage error' + name + ' to ' + listenerServiceName, error)
        reject(error)
      })
    })
    const buildServicesRegistry = async (schema = 'events.listen', exclude) => {
      var servicesConfig = await getSharedConfig('*', schema, exclude)
      var listeners = {}
      servicesConfig.forEach(service => {
        var serviceName = service.serviceName
        Object.keys(service).forEach(eventName => {
          if (!listeners[eventName])listeners[eventName] = []
          listeners[eventName].push({serviceName, event: service[eventName], eventName})
        }, service)
      })
      return listeners
    }

    function filterByTag (tags) {
      return (tagFilter) => {
        if (tagFilter)CONSOLE.debug(`filterByTag()`, tags.indexOf(tagFilter) + 1)
        return !tags || !tagFilter ? true : tags.indexOf(tagFilter) + 1
      }
    }
    async function rpc (serviceName, method, data, meta, timeout = 5000) {
      CONSOLE.debug('rpc ' + serviceName + ' ' + method + ' corrid:' + meta.corrid, {data, timeout, meta})
      var listenerService = await getSharedConfig(serviceName, 'service') // TO FIX ADD CACHE
      var sendMessageResponse = await sendMessage({name: '_rpcCall', listenerServiceName: serviceName, netUrl: listenerService.netUrl, timeout, method, haveResponse: true, data, meta})
      return sendMessageResponse
    }
    async function emit (name, data, meta, throwOnErrorResponse = true) {
      CONSOLE.debug('emit ' + name + ' corrid:' + meta.corrid, {name, data, meta})
      var eventsEmitConfig = Object.assign({}, defaultEventEmit, await getSharedConfig(serviceName, 'events.emit'))
      if (!eventsEmitConfig[name]) return CONSOLE.warn(name + ' event not defined in /events.emit.json')
      var eventEmitConfig = eventsEmitConfig[name]

      var eventsListenRegistry = await buildServicesRegistry('events.listen', serviceName)

      var servicesRegistry = await getSharedConfig('*', 'service', serviceName, true)
      // CONSOLE.debug('emit info', {eventEmitConfig, eventsListenRegistry, servicesRegistry})
      var waitResponses = []
      var eventListeners = []
      if (eventsListenRegistry[name])eventListeners = eventListeners.concat(eventsListenRegistry[name])
      if (eventsListenRegistry['*'])eventListeners = eventListeners.concat(eventsListenRegistry['*'])
      var filterByTagEventEmit = filterByTag(eventEmitConfig.tags)
      eventListeners = eventListeners.filter(eventListener => filterByTagEventEmit(eventListener.event.filterByTag))
      if (!eventListeners.length) {
        CONSOLE.debug(name + ' event have no listeners ')
        return false
      }
      eventListeners.forEach((eventListener) => {
        var listenerServiceName = eventListener.serviceName
        var listenerService = servicesRegistry[listenerServiceName]
        var eventListenConfig = eventListener.event

        // var sendMessagePromise = sendMessage({name, listenerService, listenerServiceName, eventListenConfig, eventEmitConfig, data, listenerServiceName, meta})
        if (eventListenConfig.delayed) {
          var index = name + listenerServiceName + eventListenConfig.method
          if (!delayedSendData[index]) {
            var timeout = setTimeout(() => {
              var multiEvent = delayedSendData[index]
              delete delayedSendData[index]
              sendMessage(multiEvent)
            }, eventListenConfig.delayed)
            delayedSendData[index] = {throwOnErrorResponse, name: '_messageMulti', listenerServiceName, multi: true, timeout: 60000, method: eventListenConfig.method, netUrl: listenerService.netUrl, data: {event: name, messages: []}, meta}
          }
          delayedSendData[index].data.messages.push({data, meta})
        } else {
          var sendMessagePromise = sendMessage({name, listenerServiceName, netUrl: listenerService.netUrl, timeout: eventEmitConfig.timeout, method: eventListenConfig.method, haveResponse: eventListenConfig.haveResponse, data, meta})
          if (eventListenConfig.haveResponse && eventEmitConfig.waitResponse)waitResponses.push(sendMessagePromise)
        }
      })
      CONSOLE.debug('emit ' + name + ' waitResponses', waitResponses)
      var resultPromise
      if (eventEmitConfig.waitResponse) {
        if (eventEmitConfig.responseRequired && !waitResponses.length) errorThrow(name + ' event need a response')
        if (eventEmitConfig.singleResponse) resultPromise = waitResponses[0]
        else resultPromise = Promise.all(waitResponses)
        var result = await resultPromise
        CONSOLE.debug('emit ' + name + ' results', result)
        return result
      }
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
      emit,
      rpc
    }
  } catch (error) {
    errorThrow('getNetClientPackage', {error, getSharedConfig, serviceName})
  }
}
