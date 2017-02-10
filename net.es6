var R = require('ramda')
var grpc = require('grpc')
var url = require('url')
var net = require('net')
var zlib = require('zlib')
var msgpack = require('msgpack')
// const avro = require('avsc');
var dictionary = new Buffer('"{}[]test', 'utf8')
var serializedDataByte = 0
var serializeFunction = (obj, dictionary) => zlib.deflateSync(JSON.stringify(obj), {dictionary})
var deserializeFunction = (obj, dictionary) => JSON.parse(zlib.inflateSync(obj, {dictionary}))
function serializeJson (obj) {
  // var testType = avro.infer(obj);
  // return testType.toBuffer(obj)
  // return zlib.deflateSync(msgpack.pack(obj),{level:1})
  // return msgpack.pack(obj)
  // return zlib.gzipSync(msgpack.pack(obj),{level:3})
  // var result = zlib.deflateSync(JSON.stringify(obj), {dictionary})
  var result = serializeFunction(obj, dictionary)
  serializedDataByte += (result.byteLength)
  return result
  // console.log(serializedDataByte)

  // return zlib.gzipSync(JSON.stringify(obj),{level:3})
  // return new Buffer(JSON.stringify(obj))
}
function deserializeJson (buffer) {
  var result = deserializeFunction(buffer, dictionary)
  return result
  // var testType = avro.infer(buffer);
  // return testType.fromBuffer(buffer)
  // return msgpack.unpack(zlib.inflateSync(buffer))
  // return msgpack.unpack(buffer)
  // return msgpack.unpack(zlib.gunzipSync(buffer))
  // return JSON.parse(zlib.inflateSync(buffer, {dictionary}))
  // return JSON.parse(zlib.gunzipSync(buffer))
  // return JSON.parse(buffer.toString())
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

module.exports = async function getNetPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'net'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['url', 'netRegistry'], PACKAGE)
    DI = checkRequired(DI, [ 'throwError', 'log', 'debug'], PACKAGE)

    var clientCache = {}
    var callServiceApi = ({service, eventListener, data}) => new Promise((resolve, reject) => {
      if (clientCache[service.url]) var client = clientCache[service.url]
      else {
        var clientClass = grpc.makeGenericClientConstructor(grpcService)
        var client = clientCache[service.url] = new clientClass(service.url, grpc.credentials.createInsecure())
      }
      var callTimeout = setTimeout(() => {
        grpc.closeClient(client)
        reject({message: 'Response problems: REQUEST TIMEOUT: control proto file for correct response format', service, eventListener, data})
      }, eventListener.timeout || 5000)
      // DI.log('NET MESSAGE SENDING', {route: eventListener.route, data})
      client.message({route: eventListener.route, data}, (error, serviceResponse) => {
        clearTimeout(callTimeout)
        if (error)reject(error)
        resolve(serviceResponse)
      })
    })
    // var serviceFunctions
    var serviceServer
    var netRegistry = await getValuePromise(CONFIG.netRegistry)

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
      async start () {
        var grpcServiceFunctions = {
          message (call, callback) {
            // DI.log('NET MESSAGE RECEIVED', call.request)
            var routes = DI.getRoutes()
            var routeFunction = routes[call.request.route]
            var data = call.request.data
            routeFunction(data)
            .then(response => callback(null, response))
            .catch(error => callback(null, error))
          }
        }

        var url = await getValuePromise(CONFIG.url)
        serviceServer = new grpc.Server()
        serviceServer.addService(grpcService, grpcServiceFunctions)
        serviceServer.bind(url, grpc.ServerCredentials.createInsecure())
        serviceServer.start()
      },
      stop () {
        serviceServer.tryShutdown(() => {})
      },
      restart () {
        serviceServer.tryShutdown(start)
      },
      emitEvent ({name, data, singleResponse = true}) {
        if (netRegistry && netRegistry.listeners && netRegistry.listeners[name]) {
          var waitResponses = []
          netRegistry.listeners[name].forEach((eventListener) => {
            var service = netRegistry.services[eventListener.service]
            var callServiceApiPromise = callServiceApi({service, eventListener, data})
            if (eventListener.haveResponse)waitResponses.push(callServiceApiPromise)
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
