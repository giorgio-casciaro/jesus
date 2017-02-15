var R = require('ramda')
// var http2 = require('http2')
// var querystring = require('querystring')
var url = require('url')
var net = require('net')

module.exports = async function getNetPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'net'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['netRegistry'], PACKAGE)
    DI = checkRequired(DI, [ 'throwError', 'log', 'debug'], PACKAGE)

    var SERVER_HTTP = require('./api.http')(CONFIG, DI)

    var callServiceApi = ({service, eventListener, data}) => new Promise((resolve, reject) => {
      var urlObj = url.parse(service.http.url)
      var client = new net.Socket()
      client.connect(urlObj.port, urlObj.hostname, function () {
      	console.log('Connected')
      	client.write('Hello, server! Love, Client.')
      })
      var i = 0
      client.on('data', function (data) {
      	console.log('Received: ' + data)
      	i++
      	if (i == 2)      		{
        client.destroy()
      }
      })
      client.on('close', function () {
      	console.log('Connection closed')
      })
      client.on('error', function (error) {
      	console.error(error)
      })
      // var dataBuffer = querystring.stringify(data)
      // var urlObj = url.parse(service.http.url)
      // var options = {
      //   hostname: urlObj.hostname,
      //   port: urlObj.port,
      //   path: '/' + eventListener.route,
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //     'Content-Length': Buffer.byteLength(dataBuffer)
      //   }
      // }
      // process.env.HTTP2_PLAIN = true
      // console.log(options)
      //
      // var req = http2.raw.request(options, function (res) {
      //   console.log('statusCode:', res.statusCode)
      //   console.log('headers:', res.headers)
      //
      //   res.on('data', (chunk) => {
      //     console.log('on data: ' + chunk)
      //   })
      //   res.on('error', (chunk) => {
      //     console.log('error: ' + chunk)
      //   })
      //   res.on('end', (chunk) => {
      //     console.log('on end: ' + chunk)
      //   })
      // })
      // , (res) => {
      //   console.log('statusCode:', res.statusCode)
      //   console.log('headers:', res.headers)
      //
      //   res.on('data', (chunk) => {
      //     console.log("on data: " + chunk);
      //   })
      //   res.on('end', (chunk) => {
      //     console.log("on end: " + chunk);
      //   })
      // }
      req.on('response', function (res) {
        console.log('statusCode:', res.statusCode)
        console.log('headers:', res.headers)

        res.on('data', (chunk) => {
          console.log('on data: ' + chunk)
        })
        res.on('end', (chunk) => {
          console.log('on end: ' + chunk)
        })
      })
      req.on('push', (chunk) => {
        console.log('push: ' + chunk)
      })
      req.on('error', (e) => {
        console.error(e)
      })
      req.end()
      // var grpcService = grpc.load(service.proto).Service
      // var client = new grpcService(service.grpc.url, grpcCredentials)
      // var callTimeout = setTimeout(() => {
      //   grpc.closeClient(client)
      //   reject({message: 'Response problems: REQUEST TIMEOUT: control proto file for correct response format', service, eventListener, data})
      // }, eventListener.timeout || 5000)
      //
      // client[eventListener.route](data, (error, serviceResponse) => {
      //   clearTimeout(callTimeout)
      //   if (error)reject(error)
      //   resolve(serviceResponse)
      // })
    })
    var server
    var netRegistry = await getValuePromise(CONFIG.netRegistry)
    return {
      stop () {
        server.listen(52275, '127.0.0.1')
      },
      start () {
        var textChunk = ''
        server = net.createServer(function (socket) {
          socket.write('Echo server\r\n')
          socket.on('data', function (data) {
            console.log(data)
            textChunk = data.toString('utf8')
            console.log(textChunk)
            socket.write(textChunk)
          })
        })
        server.listen(52275, '127.0.0.1')
      },
      restart: SERVER_HTTP.restart,
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
