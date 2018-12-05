process.on('unhandledRejection', (err, p) => {
  console.error(err)
  console.log('An unhandledRejection occurred')
  console.log(`Rejected Promise: ${p}`)
  console.log(`Rejection: ${err}`)
})

var zeromq = require('zeromq')
// const uuidV4 = require('uuid/v4')

const log = (msg, data) => { console.log('\n' + JSON.stringify(['LOG', 'ZEROMQ SERVER', msg, data])) }
const debug = (msg, data) => { if (process.env.debugJesus)console.log('\n' + JSON.stringify(['DEBUG', 'ZEROMQ SERVER', msg, data])) }
const error = (msg, data) => { console.log('\n' + JSON.stringify(['ERROR', 'ZEROMQ SERVER', msg, data])) }

// const validate = require('./validation').validate

// function getMeta (data) {
//   var newMeta = Object.assign({}, data.meta || {})
//   if (!newMeta.corrid)newMeta.corrid = uuidV4()
//   if (!newMeta.ch)newMeta.ch = 'zeromq'
//   return newMeta
// }

class ZeromqServerStream extends require('stream').Writable {
  _write (chunk, encoding, callback) {
    debug('_write', {chunk, encoding, callback})
    try {
      // WRITE STREAM TO RESOURCE
      this.zeromqServer.send([this.clientIdRaw, JSON.stringify({ reqId: this.reqId, type: 'stream', data: chunk })])
      callback()
    } catch (err) {
      callback(new Error('chunk is invalid'))
    }
  }

  setReqId (reqId) {
    this.reqId = reqId
    return this
  }
  setClientIdRaw (clientIdRaw) {
    this.clientIdRaw = clientIdRaw
    return this
  }
  setZeromqServer (zeromqServer) {
    this.zeromqServer = zeromqServer
    return this
  }
  _destroy () {
    // READ STREAM FROM RESOURCE
    this.zeromqServer.send([this.clientIdRaw, JSON.stringify({ reqId: this.reqId, type: 'streamEnd' })])
    // if (this.externalBuffer && this.externalBuffer[0]) this.push(this.externalBuffer.shift())
    log('_destroy', {})
  }
}

module.exports = function zeromqServer ({ config, methods }) {
  var zeromqServer
  var requestStreams = {}
  try {
    var start = async function () {
      log('zeromq Api try to start on ' + config.url)
      zeromqServer = zeromq.socket('push')
      zeromqServer.monitor()
      zeromqServer.setsockopt(zeromq.ZMQ_ROUTER_MANDATORY, 1)
      zeromqServer.on('error', err => {
        error(`0MQ error: ${err}`, err)
      })
        .on('disconnect', (clientIdRaw, err) => {
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
