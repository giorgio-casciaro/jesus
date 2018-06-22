process.on('unhandledRejection', (err, p) => {
  console.error(err)
  console.log('An unhandledRejection occurred')
  console.log(`Rejected Promise: ${p}`)
  console.log(`Rejection: ${err}`)
})

const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const multer = require('multer')
const fileType = require('file-type')
const readChunk = require('read-chunk')
const uuidV4 = require('uuid/v4')

const validate = require('./validation').validate

const log = (msg, data) => { console.log('\n' + JSON.stringify(['LOG', 'JESUS SERVER HTTP', msg, data])) }
const debug = (msg, data) => { if (process.env.debugJesus)console.log('\n' + JSON.stringify(['DEBUG', 'JESUS SERVER HTTP', msg, data])) }
const error = (msg, data) => { console.log('\n' + JSON.stringify(['ERROR', 'JESUS SERVER HTTP', msg, data])); console.error(data) }

const url = require('url')
// const mv = require('mv')
const fs = require('fs')
const path = require('path')

function getUploadConfig (uploadConfig) {
  return {
    fields: uploadConfig.fields || [ { name: 'file', maxCount: 1 } ],
    mimetypes: uploadConfig.mimetypes || 'image/jpeg,image/png',
    limits: Object.assign({
      fieldNameSize: 1024, // 1kb
      fieldSize: 1024 * 1024 * 120, // 120kb
      fields: 150,
      fileSize: 1024 * 1024 * 50, // 5MB
      files: 10,
      parts: 150,
      headerPairs: 150
    }, uploadConfig.limits || {})
  }
}
function pushUploadMiddleware (middleware, uploadConfig) {
  if (!uploadConfig) {
    middleware.push(multer().none())
    return false
  }
  var config = getUploadConfig(uploadConfig)
  const upload = multer({
    dest: path.join(__dirname, '../tempUpload/'),
    fileFilter: function (req, file, cb) {
      if (config.mimetypes.split(',').indexOf(file.mimetype) < 0) { return cb(null, false, new Error('Wrong file type ' + file.mimetype)) }
      cb(null, true)
    },
    limits: config.limits
  })
  middleware.push(upload.fields(config.fields))
}

function addUploadedFiles (filesInfo, data, meta, uploadConfig) {
  log('addUploadedFiles', {filesInfo, data, meta, uploadConfig})
  if (!uploadConfig) return false
  var config = getUploadConfig(uploadConfig)
  if (filesInfo) {
    meta['files'] = filesInfo
    log('filesInfo', filesInfo)
    for (var fieldName in filesInfo) {
      log('filesInfo[fieldName]', filesInfo[fieldName])
      for (var fileIndex in filesInfo[fieldName]) {
        var file = filesInfo[fieldName][fileIndex]
        log('file', {file})
        var chunk = readChunk.sync(file.path, 0, 4100)
        var mime = fileType(chunk)
        log('fileField', {config: config.mimetypes, mime, file})
        if (config.mimetypes.split(',').indexOf(mime.mime) < 0) {
          fs.unlinkSync(file.path)
          throw new Error('wrong file type ' + mime.mime)
        }
        file.mimetype = mime.mime
        data[file.fieldname] = fs.readFileSync(file.path)
      }
    }
  }
}

function getMeta (headers) {
  var newMeta = {}
  log('getMeta', headers)
  for (var metaK in headers) if (metaK.indexOf('app-meta-') + 1)newMeta[metaK.replace('app-meta-', '')] = headers[metaK]
  if (!newMeta.corrid)newMeta.corrid = uuidV4()
  if (!newMeta.ch)newMeta.ch = 'http'
  return newMeta
}

module.exports = function httpServer ({ config, methods }) {
  var httpApi
  var httpServer
  try {
    var start = async function () {
      log('http Api start on ' + config.url)
      var httpUrl = 'http://' + config.url.replace('http://', '').replace('//', '')
      var httpPort = url.parse(httpUrl, false, true).port

      httpApi = express()

      // MIDDLEWARE
      var corsOrigin = config.cors ? config.cors.split(',') : false
      httpApi.use(cors({origin: corsOrigin}))
      // httpApi.use(helmet())
      // httpApi.use(compression({level: 1}))
      httpApi.use(bodyParser.json())
      httpApi.use(bodyParser.urlencoded({ extended: true }))

      Object.keys(methods).forEach((methodName) => {
        log('http Api start method ', methodName)

        var method = methods[methodName]
        if (!method.config.public) return false
        var middleware = []
        pushUploadMiddleware(middleware, method.config.upload)
        httpApi.all('/' + methodName, middleware, async function (req, res) {
          log('http Api call method ', {methodName, query: req.query, body: req.body})
          var meta = getMeta(req.headers)
          var data = req.method === 'GET' ? req.query : req.body
          await addUploadedFiles(req.files, data, meta, method.config.upload)
          if (!method.config.stream) {
            try {
              validate(method.request, data)
              var response = await method.exec(data, meta, false)
              validate(method.response, response)
              if (response === null)res.status(404).end()
              else if (typeof response === 'string') {
                res.status(200).send(response)
              } else if (response instanceof Buffer) {
                var mime = fileType(response)
                if (mime) res.set('Content-Type', mime.mime)
                res.status(200).send(response)
              } else if (typeof response === 'object') {
                debug('http Api call response ', response)
                res.status(200).json(response)
              }
            } catch (err) {
            // if (!err.data)err.data = {errors: [error.message]}
              error('httpApi error', err)
              res.status(200).json({__RESULT_TYPE__: 'error', errorType: 'httpApi', error: err.message, errorData: err.data})
            }
          } else {
            debug('HttpPublic MESSAGE STREAM', {data, meta, headers: req.headers})
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive'
            })
            var getStream = function (onClose, MAX_REQUEST_TIMEOUT) {
              var isClosed = false
              const close = () => { isClosed = true; if (timeout)clearTimeout(timeout); onClose() }
              res.on('close', (data) => { log('streaming closed', data); close() })
                .on('finish', (data) => { log('streaming finish', data); close() })
                .on('error', (data) => { log('streaming error', data); close() })
                .on('end', (data) => { log('streaming end', data); close() })
              var timeout = false
              if (MAX_REQUEST_TIMEOUT)timeout = setTimeout(() => { timeout = false; res.end() }, MAX_REQUEST_TIMEOUT)
              return {
                write: function (obj) { if (!isClosed)res.write('data: ' + JSON.stringify(obj) + '\n\n') },
                end: function (obj) { if (!isClosed)res.end() }
              }
            }

            method.exec(data, meta, getStream)
          }
        })
      })

    // ROUTE
    // httpApi.all('*', upload.any(), async function (req, res) {
    //   try {
    //     // if (req.path.indexOf('.') > 0) throw new Error(req.path + ' not valid')
    //     var newMeta = {}
    //     for (var metaK in req.headers) if (metaK.indexOf('app-meta-') + 1)newMeta[metaK.replace('app-meta-', '')] = req.headers[metaK]
    //     var methodsConfig = await getMethodsConfig()
    //     var paths = req.path.split('/').filter(s => s !== '')
    //     var methodName = paths[0]
    //     if (!methodsConfig[methodName]) throw new Error(paths[0] + ' not valid method')
    //     var data = req.method === 'GET' ? req.query : req.body
    //     if (paths.length > 1) {
    //       var tempName // PATH EXTRA DATA
    //       paths.slice(1).forEach((value, index) => { if (index % 2)data[tempName] = value; else tempName = value })
    //     }
    //     // hl('req.files', req.files)
    //     if (req.files) {
    //       newMeta['files'] = req.files
    //       req.files.forEach((file) => {
    //         var chunk = readChunk.sync(file.path, 0, 4100)
    //         var mime = fileType(chunk)
    //         log('fileField', {config: config.mimetypes, mime, file})
    //         if (config.mimetypes.split(',').indexOf(mime.mime) < 0) {
    //           fs.unlinkSync(file.path)
    //           throw new Error('wrong file type ' + mime.mime)
    //         }
    //         file.mimetype = mime.mime
    //         // var newPath = path.join(__dirname, '../tempUpload/', XXHash.hash(file, 0xCAFEBABE))
    //         // mv(file.path, newPath)
    //         // file.path = newPath
    //         data[file.fieldname] = file
    //       })
    //     }
    //     var message = {
    //       meta: newMeta, // HTTP HEADERS ONLY LOWERCASE
    //       method: methodName,
    //       data
    //     }
    //     // var isStream = (newMeta.stream === 'true' || newMeta.stream === '1')
    //     var isStream = methodsConfig[methodName].responseType === 'stream' || newMeta.stream === 'true' || newMeta.stream === '1'
    //     debug('newMeta', {newMeta})
    //     if (!isStream) {
    //       var response = await methodCall(message, false, publicApi, 'httpPublic')
    //       if (response === null)res.status(404).end()
    //       else if (typeof response === 'string') {
    //         // res.set('Content-Type', 'text/plain')
    //         res.status(200).send(response)
    //       } else if (response instanceof Buffer) {
    //         var mime = fileType(response)
    //         log('mime', mime.mime)
    //         if (mime) res.set('Content-Type', mime.mime)
    //         res.status(200).send(response)
    //       } else if (typeof response === 'object') {
    //         res.status(200).json(response)
    //       }
    //     } else {
    //       debug('HttpPublic MESSAGE STREAM', {isStream, message, headers: req.headers, data})
    //       res.writeHead(200, {
    //         'Content-Type': 'text/event-stream',
    //         'Cache-Control': 'no-cache',
    //         'Connection': 'keep-alive'
    //       })
    //       function getStream (onClose, MAX_REQUEST_TIMEOUT) {
    //         var isClosed = false
    //         const close = () => { isClosed = true; if (timeout)clearTimeout(timeout); onClose() }
    //         res
    //         .on('close', (data) => { log('streaming closed', data); close() })
    //         .on('finish', (data) => { log('streaming finish', data); close() })
    //         .on('error', (data) => { log('streaming error', data); close() })
    //         .on('end', (data) => { log('streaming end', data); close() })
    //         var timeout = false
    //         //  hl('MAX_REQUEST_TIMEOUT', MAX_REQUEST_TIMEOUT)
    //         // if (MAX_REQUEST_TIMEOUT)timeout = setTimeout(function () { // hl('MAX_REQUEST_TIMEOUT', MAX_REQUEST_TIMEOUT) }, MAX_REQUEST_TIMEOUT)
    //         if (MAX_REQUEST_TIMEOUT)timeout = setTimeout(() => { timeout = false; res.end() }, MAX_REQUEST_TIMEOUT)
    //         return {
    //           // write: (obj) => res.write(JSON.stringify(obj)),
    //           write: function (obj) { if (!isClosed)res.write('data: ' + JSON.stringify(obj) + '\n\n') },
    //           end: function (obj) { if (!isClosed)res.end() }
    //         }
    //       }
    //
    //       methodCall(message, getStream, publicApi, 'httpPublic')
    //     }
    //   } catch (error) {
    //     log('Api error', error.toString())
    //     res.send({error})
    //   }
    // })
    // httpServer = httpApi.on('connection', function (socket) {
    //   // socket.setTimeout(60000)
    // }).listen(httpPort)

      await new Promise((resolve) => {
        log('http Api listening on ' + config.url)
        httpServer = httpApi.listen(httpPort, resolve)
      })
    }

    log('getChannelHttpPublicServerPackage')

    return {
      start,
      stop () {
        debug('Stopping httpApi')
        if (httpServer && httpServer.close)httpServer.close()
      },
      restart () {
        if (httpServer && httpServer.close)httpServer.close(start)
      }
    }
  } catch (error) {
    error(error, {config})
    throw new Error('getChannelHttpServerPackage ' + config.url)
  }
}
