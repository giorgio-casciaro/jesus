const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const multer = require('multer')

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

      // MIDDLEWARE
      if (!config.mimetypes)config.mimetypes = 'image/jpeg,image/png'
      const upload = multer({
        dest: '/uploads/',
        fileFilter: function (req, file, cb) {
          if (config.mimetypes.split(',').indexOf(file.mimetype) < 0) { return cb(null, false, new Error('Wrong file type ' + file.mimetype)) }
          cb(null, true)
        },
        limits: {
          fieldNameSize: 1024, // 1kb
          fieldSize: 1024 * 120, // 120kb
          fields: 150,
          fileSize: 1024 * 1024 * 5, // 5MB
          files: 10,
          parts: 150,
          headerPairs: 150
        }
      })

      var corsOrigin = config.cors ? config.cors.split(',') : false
      httpApi.use(cors({origin: corsOrigin}))
      httpApi.use(helmet())
      httpApi.use(compression({level: 1}))
      httpApi.use(bodyParser.json())
      httpApi.use(bodyParser.urlencoded({ extended: true }))

      // ROUTE
      httpApi.all('*', upload.any(), async (req, res) => {
        try {
          // if (req.path.indexOf('.') > 0) throw new Error(req.path + ' not valid')
          var newMeta = {}
          for (var metaK in req.headers) if (metaK.indexOf('app-meta-') + 1)newMeta[metaK.replace('app-meta-', '')] = req.headers[metaK]
          var methodsConfig = await getMethodsConfig()
          var paths = req.path.split('/').filter(s => s !== '')
          var methodName = paths[0]
          if (!methodsConfig[methodName]) throw new Error(paths[0] + ' not valid method')
          var data = req.method === 'GET' ? req.query : req.body
          if (paths.length > 1) {
            var tempName // PATH EXTRA DATA
            paths.slice(1).forEach((value, index) => { if (index % 2)data[tempName] = value; else tempName = value })
          }
          if (req.files) {
            newMeta['files'] = req.files
            req.files.forEach((file) => {
              console.log('fileField', file)
              data[file.fieldname] = file
            })
          }
          var message = {
            meta: newMeta, // HTTP HEADERS ONLY LOWERCASE
            method: methodName,
            data
          }
          var isStream = (newMeta.stream === 'true' || newMeta.stream === '1')
          CONSOLE.debug('newMeta', {newMeta})
          if (!isStream) {
            var response = await methodCall(message, false, publicApi, 'httpPublic')
            if (response === null)res.status(404)
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
          CONSOLE.warn('Api error', error.toString())
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
