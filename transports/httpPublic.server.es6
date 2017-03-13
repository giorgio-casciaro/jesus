var express = require('express-http2')
var bodyParser = require('body-parser')
var compression = require('compression')
var helmet = require('helmet')
const url = require('url')
const PACKAGE = 'transport.httpPublic.server'
const checkRequired = require('../jesus').checkRequired
const publicApi = false
var httpApi
var httpServer

module.exports = function getTransportHttpPublicServerPackage ({ getConsole, methodCall, serviceName = 'unknow', serviceId = 'unknow', config }) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  try {

    checkRequired({config, methodCall, getConsole})
    async function start () {
      var httpUrl = 'http://' + config.url.replace('http://', '').replace('//', '')
      var httpPort = url.parse(httpUrl, false, true).port
      httpApi = express()
      httpApi.use(helmet())
      httpApi.use(compression({level: 1}))
      httpApi.use(bodyParser.json()) // support json encoded bodies
      httpApi.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
      httpApi.all('*', async (req, res) => {
        try {
          var methodName = req.url.replace('/', '')
          var data = req.body || req.query
          var message = {
            f: req.headers.from || '__HTTP_CLIENT__',
            m: methodName,
            d: [{ d: data, r: req.headers.corrid, u: req.headers.userid }] // HTTP HEADERS ONLY LOWERCASE
          }
          var isStream = !!req.headers.stream
          if (!isStream) {
            CONSOLE.debug('HttpPublic MESSAGE', {isStream, message, headers: req.headers, data})
            var response = await methodCall(message, false, publicApi)
            res.send(response)
          } else {
            CONSOLE.debug('HttpPublic MESSAGE STREAM', {isStream, message, headers: req.headers, data})
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive'
            })
            var getStream = (onClose, MAX_REQUEST_TIMEOUT = 120000) => {
              const close = () => { if (timeout)clearTimeout(timeout); onClose() }
              res.on('close', close).on('finish', close).on('error', close).on('end', close)
              var timeout = setTimeout(res.end, MAX_REQUEST_TIMEOUT)
              return {
                write: (obj) => res.write(JSON.stringify(obj)),
                end: (obj) => res.end()
              }
            }

            methodCall(message, getStream, publicApi)
          }
        } catch (error) {
          CONSOLE.warn('Api error', {error})
          res.send({error})
        }
      })
      httpServer = httpApi.on('connection', function (socket) {
        // socket.setTimeout(60000)
      }).listen(httpPort)
      CONSOLE.debug('http Api listening on ' + config.url)
    }

    return {
      start,
      stop () {
        httpServer.close()
      },
      httpart () {
        httpServer.close(start)
      }
    }
  } catch (error) {
    CONSOLE.error(error, {config})
    throw new Error('getTransportHttpServerPackage ' + config.url)
  }
}
