const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const url = require('url')
const PACKAGE = 'channel.httpPublic.server'
const checkRequired = require('../utils').checkRequired
const publicApi = false
var httpApi
var httpServer

module.exports = function getChannelHttpPublicServerPackage ({ getConsole, methodCall, serviceName = 'unknow', serviceId = 'unknow', config, getMethodsConfig }) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  try {
    checkRequired({config, methodCall, getConsole, getMethodsConfig})
    async function start () {
      var httpUrl = 'http://' + config.url.replace('http://', '').replace('//', '')
      var httpPort = url.parse(httpUrl, false, true).port
      httpApi = express()
      var corsOrigin = config.cors ? config.cors.split(',') : false
      httpApi.use(cors({origin: corsOrigin}))
      httpApi.use(helmet())
      httpApi.use(compression({level: 1}))
      httpApi.use(bodyParser.json()) // support json encoded bodies
      httpApi.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
      httpApi.all('*', async (req, res) => {
        try {
          var newMeta = {}
          for (var metaK in req.headers) if (metaK.indexOf('app-meta-') + 1)newMeta[metaK.replace('app-meta-', '')] = req.headers[metaK]
          var methodsConfig = await getMethodsConfig()
          var paths = req.path.split('/')
          var methodName = paths[0]
          if (!methodsConfig[methodName]) throw new Error('not valid method')
          var data = req.body || req.query
          var message = {
            meta: newMeta, // HTTP HEADERS ONLY LOWERCASE
            method: methodName,
            data
          }
          var isStream = (newMeta.stream === 'true' || newMeta.stream === '1')
          CONSOLE.debug('newMeta', {newMeta})
          if (!isStream) {
            var response = await methodCall(message, false, publicApi, 'httpPublic')
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

            methodCall(message, getStream, publicApi, 'httpPublic')
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
        CONSOLE.debug('Stopping httpServer', httpServer)
        httpServer.close()
      },
      restart () {
        httpServer.close(start)
      }
    }
  } catch (error) {
    CONSOLE.error(error, {config})
    throw new Error('getChannelHttpServerPackage ' + config.url)
  }
}
