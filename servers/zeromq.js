process.on('unhandledRejection', (err, p) => {
  console.error(err)
  console.log('An unhandledRejection occurred')
  console.log(`Rejected Promise: ${p}`)
  console.log(`Rejection: ${err}`)
})

var zeromq = require('zeromq')
const uuidV4 = require('uuid/v4')

const log = (msg, data) => { console.log('\n' + JSON.stringify(['LOG', 'ZEROMQ SERVER', msg, data])) }
const debug = (msg, data) => { if (process.env.debugJesus)console.log('\n' + JSON.stringify(['DEBUG', 'ZEROMQ SERVER', msg, data])) }
const error = (msg, err) => { console.error(err); console.log('\n' + JSON.stringify(['ERROR', 'ZEROMQ SERVER', msg, err])) }

const validate = require('./validation').validate

function getMeta (data) {
  var newMeta = Object.assign({}, data.meta || {})
  if (!newMeta.corrid)newMeta.corrid = uuidV4()
  if (!newMeta.ch)newMeta.ch = 'zeromq'
  return newMeta
}

class ZeromqServerStream extends require('stream').Duplex {
  _read (n) {
    log('ZeromqServerStream _read', { n})
  }
  _write (chunk, encoding, callback) {
    log('ZeromqServerStream _write', { chunk, encoding})
    try {
      // WRITE STREAM TO RESOURCE
      this.zeromqServer.send([this.clientIdRaw, JSON.stringify({ reqId: this.reqId, type: 'stream', data: chunk })])
      callback()
    } catch (err) {
      callback(new Error('chunk is invalid'))
    }
  }
  _destroy () {
    log('ZeromqServerStream _destroy', {})
    // READ STREAM FROM RESOURCE
    this.zeromqServer.send([this.clientIdRaw, JSON.stringify({ reqId: this.reqId, type: 'streamEnd' })])
    // if (this.externalBuffer && this.externalBuffer[0]) this.push(this.externalBuffer.shift())
    log('_destroy', {})
  }
}

module.exports = function zeromqServer ({ config, methods }) {
  var zeromqServer
  var requestStreamsByClientId = {}
  try {
    var start = async function () {
      log('zeromq Api try to start on ' + config.url)
      zeromqServer = zeromq.socket('router')
      zeromqServer.monitor()
      zeromqServer.setsockopt(zeromq.ZMQ_ROUTER_MANDATORY, 1)
      // zeromqServer.setsockopt(zeromq.ZMQ_RCVBUF, 10)
      // zeromqServer.setsockopt(zeromq.ZMQ_SNDBUF, 10)
      // zeromqServer.setsockopt(zeromq.ZMQ_HWM, 10)
      // zeromqServer.setsockopt(zeromq.ZMQ_LINGER, 1000)
      // zeromqServer.setsockopt(zeromq.ZMQ_BACKLOG, 10)
      zeromqServer.on('error', err => {
        error(`0MQ error: ${err}`, err)
      })
        .on('disconnect', (clientIdRaw, err) => {
          if (requestStreamsByClientId[clientIdRaw]) {
            Objects.keys(requestStreamsByClientId[clientIdRaw]).forEach((reqId) => {
              requestStreamsByClientId[clientIdRaw][reqId].end()
              delete requestStreamsByClientId[clientIdRaw][reqId]
            })
          }
          log('zeromqServer disconnect', {clientIdRaw, err, zeromqServer})
        })
        .on('error', err => {
          log('zeromqServer error', {err, zeromqServer})
        })
        .on('bind_error', err => {
          log('zeromqServer bind_error', {err, zeromqServer})
        })
        .on('accept_error', err => {
          log('zeromqServer accept_error', {err, zeromqServer})
        })
        .on('unbind', err => {
          log('zeromqServer unbind', {err, zeromqServer})
        })
        .on('close_error', err => {
          log('zeromqServer close_error', {err, zeromqServer})
        })
        .on('close', err => {
          log('zeromqServer close', {err, zeromqServer})
        })
        .on('connect', err => {
          log('zeromqServer connect', {err, zeromqServer})
        })
        .on('message', async (clientIdRaw, dataRaw) => {
          // var clientId = clientIdRaw.toString('base64')
          log('zeromq  SERVER message data', {clientIdRaw, dataRaw, dataRawToString: dataRaw.toString()})
          var data = JSON.parse(dataRaw.toString())
          log('zeromq  SERVER message ', {method: data.method, type: data.type})
          if (data.type === 'streamEnd') {
            if (requestStreamsByClientId[clientIdRaw] && requestStreamsByClientId[clientIdRaw][data.reqId]) {
              // requestStreamsByClientId[clientIdRaw][data.reqId].destroy()
              requestStreamsByClientId[clientIdRaw][data.reqId].end()
              delete requestStreamsByClientId[clientIdRaw][data.reqId]
            }
          } else if (data.type === 'stream') {
            log('zeromq  SERVER message stream', data)
            requestStreamsByClientId[clientIdRaw][data.reqId].push(data.data)
          } else if (!data.type || data.type === 'request') {
            var method = methods[data.method]
            debug('zeromq  SERVER message ', {data, method})
            if (!method || !method.config) {
              return zeromqServer.send([clientIdRaw, JSON.stringify({ reqId: data.reqId, data: {__RESULT_TYPE__: 'error', errorType: 'zeromqServer', error: 'method not defined: ' + method, errorData: data} })])
            }
            // if (typeof method.config.warmUp === 'undefined')method.config.warmUp = 2000
            // if (method.config.warmUp) {
            //   if (!method.config.warmUpPromise) method.config.warmUpPromise = new Promise((resolve) => setTimeout(resolve, method.config.warmUp))
            //   await method.config.warmUpPromise
            // }
            if (!method.config.stream) {
              var response
              try {
                validate(method.request, data.data)
                response = await method.exec(data.data, data.meta)
                validate(method.response, response)
              } catch (err) {
                // if (!err.data)err.data = {errors: [err.message]}
                error('zeromqServer error', err)
                response = {__RESULT_TYPE__: 'error', errorType: 'zeromqServer', error: err.message, errorData: err.data}
              }
              debug('zeromq  SERVER message response', {response})
              zeromqServer.send([clientIdRaw, JSON.stringify({ reqId: data.reqId, data: response })])
            } else {
              var getStream = function () {
                // var isClosed = false
                // var timeout = false
                // var stream = {
                //   write: async function (streamData) { if (!isClosed)zeromqServer.send([clientIdRaw, JSON.stringify({ reqId: data.reqId, type: 'stream', data: streamData })]) },
                //   end: async function () {
                //     isClosed = true
                //     if (timeout)clearTimeout(timeout)
                //     try {
                //       zeromqServer.send([clientIdRaw, JSON.stringify({ reqId: data.reqId, type: 'streamEnd' })])
                //     } catch (err) { log(`0MQ getStream close: ${err}`, err) }
                //     if (onClose)onClose()
                //     delete requestStreamsByClientId[clientIdRaw][data.reqId]
                //   }
                // }
                var stream = new ZeromqServerStream({objectMode: true, writableObjectMode: true, readableObjectMode: true})
                stream.zeromqServer = zeromqServer
                stream.reqId = data.reqId
                stream.clientIdRaw = clientIdRaw
                stream.info = data
                stream.on('finish', (error) => { log('stream finish', {error}) })
                stream.on('error', (error) => { log('stream error', {error}) })
                stream.on('data', (data) => { log('stream data', data) })
                stream.on('end', (error) => { log('stream end', error) })
                stream.on('close', (data) => {
                  log('zeromqServer stream close', data)
                  delete requestStreamsByClientId[clientIdRaw][data.reqId]
                })
                // stream.on('data', (streamData) => {
                //   log('zeromqServer stream data', {data, streamData})
                //   zeromqServer.send([clientIdRaw, JSON.stringify({ reqId: data.reqId, type: 'stream', data: streamData })])
                // })
                // if (MAX_REQUEST_TIMEOUT)timeout = setTimeout(stream.end, MAX_REQUEST_TIMEOUT)
                if (!requestStreamsByClientId[clientIdRaw])requestStreamsByClientId[clientIdRaw] = {}
                requestStreamsByClientId[clientIdRaw][data.reqId] = stream
                return stream
              }
              await method.exec(data.data, data.meta, getStream)
            }
          }
          // this[pass](data, id)
        }).bindSync(config.url)
      log('zeromq Api started on ' + config.url)
    }

    return {
      start,
      stop () {
        debug('Stopping zeromqApi')
        if (zeromqServer && zeromqServer.close)zeromqServer.unbindSync(config.url).close()
      },
      restart () {
        if (zeromqServer && zeromqServer.close)zeromqServer.unbindSync(config.url).close()
        start()
      }
    }
  } catch (error) {
    error(error, {config})
    throw error
  }
}
