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

module.exports = function getNetServerPackage ({getConsole,serviceName, serviceId, netUrl, getMethods, getSharedConfig}) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE)
  var defaultListeners = {
    '_rpcCall': {
      'haveResponse': true
    }
    // '_messageMulti': {
    //   'haveResponse': false
    // }
  }

  async function messageCall (requestData) {
    var event = requestData.event
    var eventsListenConfig = Object.assign({}, defaultListeners, await getSharedConfig(serviceName, 'events.listen'))
    CONSOLE.debug('eventsListenConfig', {serviceName, getSharedConfig: await getSharedConfig(serviceName, 'events.listen'), eventsListenConfig})
    if (!eventsListenConfig[event] && !eventsListenConfig['*']) return CONSOLE.warn(netUrl, event + ' event not defined in /events.listen.json')
    var eventConfig = eventsListenConfig[event] || eventsListenConfig['*']

    var from = requestData.serviceName
    var methodName = requestData.method
    var service = getMethods()
    if (!service[methodName]) throw methodName + ' is not valid'
    var method = service[methodName]
    var data = requestData.data
    var meta = {
      type: 'netEvent',
      from,
      requestId: requestData.requestId || uuidV4(),
      userId: requestData.userId,
      methodName,
      event,
      timestamp: Date.now()
    }
    CONSOLE.debug('message received ' + methodName + ' requestId:' + meta.requestId, {eventConfig})
    if (eventConfig.haveResponse) {
      try {
        var response = await method(data, meta)
        CONSOLE.debug('message response ' + methodName, {response})
        return response
      } catch (error) {
        CONSOLE.warn('message error ' + methodName, {error})
        return error
      }
    } else {
      CONSOLE.debug('message aknowlegment ' + methodName)
      method(data, meta)
      return {aknowlegment: true}
    }
  }
  try {
    var serviceServer
    checkRequired({serviceName, serviceId, netUrl, getMethods, getSharedConfig})
    async function start () {
      var grpcServiceFunctions = {
        async message (call, callback) {
          try {
            var response = await messageCall(call.request)
            CONSOLE.debug('message response', {request: call.request, response})
            callback(null, response)
          } catch (error) {
            CONSOLE.error('message error', error)
            callback(error, null)
          }
        },
        async messageMulti (call, callback) {
          callback(null, null)

          var promises = []
          call.request.data.messages.forEach(({data, meta}) => {
            var reqData = Object.assign({}, call.request, {data, meta})
            CONSOLE.debug('messageMulti reqData ', reqData)
            promises.push(messageCall(reqData, callback))
          })
          return await Promise.all(promises)
        }
      }
      serviceServer = new grpc.Server()
      serviceServer.addService(grpcService, grpcServiceFunctions)
      serviceServer.bind(netUrl, grpc.ServerCredentials.createInsecure())
      serviceServer.start()
      CONSOLE.debug('Net started on port:' + netUrl)
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
    errorThrow('getNetServerPackage', {error, netUrl, getSharedConfig})
  }
}
