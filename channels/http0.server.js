var express = require('express')
var bodyParser = require('body-parser')
var compression = require('compression')
var helmet = require('helmet')
const url = require('url')
const PACKAGE = 'channel.http.server'
const checkRequired = require('../utils').checkRequired
const publicApi = false
var httpApi
var httpServer

module.exports = function getChannelHttpServerPackage ({ methodCall, serviceName = 'unknow', serviceId = 'unknow', config}) {
  
  try {
    checkRequired({config, methodCall})
    async function start () {
      var httpUrl = 'http://' + config.url.replace('http://', '').replace('//', '')
      var httpPort = url.parse(httpUrl, false, true).port
      httpApi = express()
      // httpApi.use(helmet())
      // httpApi.use(compression({level: 1}))
      httpApi.use(bodyParser.json()) // support json encoded bodies
      httpApi.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
      httpApi.all('/_httpMessage', async (req, res) => {
        try {
          var data = req.body || req.query
          console.debug('_httpMessage', req, data)
          var response = await methodCall(data, false, publicApi, 'http')
          res.send(response)
        } catch (error) {
          console.warn('Api error', {error})
          res.send({error})
        }
      })
      httpApi.all('/_httpMessageStream', async (req, res) => {
        try {
          var data = req.body || req.query
          // console.hl('_httpMessageStream', req, data)
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
          methodCall(data, getStream, publicApi, 'http')
        } catch (error) {
          console.warn('Api error', {error})
          res.send({error})
        }
      })
      httpApi.all('*', async function (req, res) {
        try {
          var newMeta = {}
          for (var metaK in req.headers) if (metaK.indexOf('app-meta-') + 1)newMeta[metaK.replace('app-meta-', '')] = req.headers[metaK]

          var methodName = req.url.replace('/', '')
          var data = req.body || req.query
          var message = {
            meta: newMeta, // HTTP HEADERS ONLY LOWERCASE
            method: methodName,
            data
          }
          var isStream = (newMeta.stream === 'true' || newMeta.stream === '1')
          console.debug('newMeta', {newMeta})
          if (!isStream) {
            var response = await methodCall(message, false, publicApi, 'httpPublic')
            res.send(response)
          } else {
            console.debug('HttpPublic MESSAGE STREAM', {isStream, message, headers: req.headers, data})
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive'
            })
            function getStream (onClose, MAX_REQUEST_TIMEOUT) {
              var isClosed = false
              const close = () => { isClosed = true; if (timeout)clearTimeout(timeout); onClose() }
              res
              .on('close', (data) => { console.log('streaming closed', data); close() })
              .on('finish', (data) => { console.log('streaming finish', data); close() })
              .on('error', (data) => { console.log('streaming error', data); close() })
              .on('end', (data) => { console.log('streaming end', data); close() })
              var timeout = false
              //  console.hl('MAX_REQUEST_TIMEOUT', MAX_REQUEST_TIMEOUT)
              // if (MAX_REQUEST_TIMEOUT)timeout = setTimeout(function () { // console.hl('MAX_REQUEST_TIMEOUT', MAX_REQUEST_TIMEOUT) }, MAX_REQUEST_TIMEOUT)
              if (MAX_REQUEST_TIMEOUT)timeout = setTimeout(() => { timeout = false; res.end() }, MAX_REQUEST_TIMEOUT)
              return {
                // write: (obj) => res.write(JSON.stringify(obj)),
                write: function (obj) { if (!isClosed)res.write('data: ' + JSON.stringify(obj) + '\n\n') },
                end: function (obj) { if (!isClosed)res.end() }
              }
            }
            // var getStream = (onClose, MAX_REQUEST_TIMEOUT = 120000) => {
            //   const close = () => { if (timeout)clearTimeout(timeout); onClose() }
            //   res.on('close', close).on('finish', close).on('error', close).on('end', close)
            //   var timeout = setTimeout(res.end, MAX_REQUEST_TIMEOUT)
            //   return {
            //     write: (obj) => res.write(JSON.stringify(obj)),
            //     end: (obj) => res.end()
            //   }
            // }

            methodCall(message, getStream, publicApi, 'httpPublic')
          }
        } catch (error) {
          console.warn('Api error', {error})
          res.send({error})
        }
      })
      httpServer = httpApi.on('connection', function (socket) {
        // socket.setTimeout(60000)
      }).listen(httpPort)
      console.debug('http Api listening on ' + config.url)
    }

    return {
      start,
      stop () {
        console.debug('Stopping httpServer', httpServer)
        httpServer.close()
      },
      restart () {
        httpServer.close(start)
      }
    }
  } catch (error) {
    console.error(error, {config})
    throw new Error('getChannelHttpServerPackage ' + config.url)
  }
}
