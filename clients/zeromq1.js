// /**
//  *  Monitor events
//  */
// var events = exports.events = {
//     1:   "connect"       // zmq.ZMQ_EVENT_CONNECTED
//   , 2:   "connect_delay" // zmq.ZMQ_EVENT_CONNECT_DELAYED
//   , 4:   "connect_retry" // zmq.ZMQ_EVENT_CONNECT_RETRIED
//   , 8:   "listen"        // zmq.ZMQ_EVENT_LISTENING
//   , 16:  "bind_error"    // zmq.ZMQ_EVENT_BIND_FAILED
//   , 32:  "accept"        // zmq.ZMQ_EVENT_ACCEPTED
//   , 64:  "accept_error"  // zmq.ZMQ_EVENT_ACCEPT_FAILED
//   , 128: "close"         // zmq.ZMQ_EVENT_CLOSED
//   , 256: "close_error"   // zmq.ZMQ_EVENT_CLOSE_FAILED
//   , 512: "disconnect"    // zmq.ZMQ_EVENT_DISCONNECTED
// }
// bind
// unbind
// error
// message
process.on('unhandledRejection', (err, p) => {
  console.error(err)
  console.log('An unhandledRejection occurred')
  console.log(`Rejected Promise: ${p}`)
  console.log(`Rejection: ${err}`)
})

var zeromq = require('zeromq')
const uuidV4 = require('uuid/v4')

const log = (msg, data) => { console.log('\n' + JSON.stringify(['LOG', 'ZEROMQ CLIENT', msg, data])) }
const debug = (msg, data) => { if (process.env.debugJesus)console.log('\n' + JSON.stringify(['DEBUG', 'ZEROMQ CLIENT', msg, data])) }
const error = (msg, data) => { console.log('\n' + JSON.stringify(['ERROR', 'ZEROMQ CLIENT', msg, data])); console.error(data) }
var connections = {}
var responsesPromises = {}
var responsesStreams = {}
var getConnection = async function (path, force, debugData) {
  if (typeof connections[path] !== 'undefined') {
    debug('zeromqClient.connect from cache', path)
    var conn = await connections[path]
    return conn
  }
  log('zeromqClient.connect not  from cache', { path, debugData, cache: connections[path] })
  var zeromqClient = zeromq.socket('dealer')
  connections[path] = zeromqClient
  zeromqClient.setsockopt(zeromq.ZMQ_RECONNECT_IVL_MAX, 10000)
  zeromqClient.setsockopt(zeromq.ZMQ_LINGER, 0)
  // zeromqClient.setsockopt(zeromq.LINGER, 0)
  // zeromqClient.setsockopt(zeromq.ZMQ_IMMEDIATE, 1)
  zeromqClient.monitor()

  zeromqClient.path = path

  await new Promise((resolve, reject) => {
    // var resolved = false
    debug('zeromqClient', {zeromqClient, eventNames: zeromqClient.eventNames()})
    // setTimeout(() => {
    //   if (!zeromqClient.connected) {
    //     if (connections[path]) {
    //       delete connections[path]
    //       try { zeromqClient.close() } catch (err) {}
    //     }
    //     reject(new Error('timeout stream zeromq '))
    //   }
    // }, 1000)
    zeromqClient.on('connect', async err => {
      log('zeromqClient connected', {err, zeromqClient, debugData})
      zeromqClient.err = false
      zeromqClient.connected = true
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      // resolved = true
      resolve()
    }).on('accept', err => {
      debug('zeromqClient accept', {err, zeromqClient, debugData})
    }).on('close', err => {
      log('zeromqClient close', {err, zeromqClient, debugData})
      zeromqClient.err = err
      try { zeromqClient.close() } catch (err) {}
      if (connections[path]) delete connections[path]
      // if (!resolved) {
      //   resolved = true
      //   reject(new Error('disconnected stream zeromq close'))
      // }
      reject(new Error('disconnected connection zeromq close'))
      // zeromqClient.term()
      // delete connections[path]
      // responsesPromises[reqId].filter(promise => promise.zeromqClient === zeromqClient).

      // if (connections[path]) delete connections[path]
    }).on('connect_delay', err => {
      // zeromqClient.close()
      // zeromqClient.err = err
      debug('zeromqClient connect_delay', {err, zeromqClient, debugData})
      // zeromqClient.close()
      // if (connections[path]) delete connections[path]
      // reject(new Error('disconnected stream zeromq connect_delay'))
      // if (!resolved) {
      //   resolved = true
      //   reject(new Error('disconnected stream zeromq connect_delay'))
      // }
    }).on('connect_retry', err => {
      zeromqClient.err = err
      log('zeromqClient connect_retry', {err, zeromqClient, debugData})
      try { zeromqClient.close() } catch (err) {}

      if (connections[path]) delete connections[path]
      reject(new Error('timeout stream zeromq '))
      // if (!resolved) {
      //   resolved = true
      //   reject(new Error('disconnected stream zeromq close'))
      // }
      // reject(new Error('disconnected stream zeromq close'))
    }).on('connect_error', err => {
      log('zeromqClient connect_error', {err, zeromqClient, debugData})
    }).on('close_error', err => {
      zeromqClient.err = err
      log('zeromqClient close_error', {err, zeromqClient, debugData})
    }).on('accept_error', err => {
      zeromqClient.err = err
      log('zeromqClient accept_error', {err, zeromqClient, debugData})
    }).on('disconnect', err => {
      zeromqClient.err = err
      log('zeromqClient disconnect', {err, zeromqClient, debugData})
      for (var reqId in responsesPromises) {
        if (responsesPromises[reqId].zeromqClient === zeromqClient) {
          responsesPromises[reqId].reject(new Error('zeromqClient disconnect rejected promise'))
          debug('zeromqClient rejected promise', responsesPromises[reqId])
          delete responsesPromises[reqId]
        }
      }
      for (reqId in responsesStreams) {
        if (responsesStreams[reqId].zeromqClient === zeromqClient) {
          responsesStreams[reqId].destroy()
          // responsesStreams[reqId].emit('end')
          // responsesStreams[reqId].removeAllListeners()
          // debug('zeromqClient end stream', responsesStreams[reqId])
          // delete responsesStreams[reqId]
        }
      }
      // zeromqClient.close()
      // if (connections[path]) delete connections[path]
    }).on('error', err => {
      zeromqClient.err = err
      log('zeromqClient error', {err, zeromqClient, debugData})
      error(`0MQ error: ${err}`, err)
      // setTimeout(() => {
      //   zeromqClient.connect(path)
      // }, 3000)
    }).on('message', (dataRaw) => {
      var data = JSON.parse(dataRaw.toString())
      // debug('zeromq  CLIENT message ', data)
      if ((!data.type || data.type === 'response') && data.reqId && responsesPromises[data.reqId]) {
        debug('zeromq  CLIENT message response', data)
        responsesPromises[data.reqId].resolve(data.data)
        delete responsesPromises[data.reqId]
      } else if (data.type === 'stream' && data.reqId && responsesStreams[data.reqId]) {
        debug('zeromq  CLIENT message stream', data)
        responsesStreams[data.reqId].push(data.data)
      } else if (data.type === 'streamEnd' && data.reqId && responsesStreams[data.reqId]) {
        debug('zeromq  CLIENT message streamEnd', data)
        responsesStreams[data.reqId].destroy()
        // responsesStreams[data.reqId].emit('end')
        // responsesStreams[data.reqId].removeAllListeners()
        // delete responsesStreams[data.reqId]
      }
    })
    log('zeromqClient connect', {path, debugData})
    zeromqClient.connect(path)
  })

  // debug('zeromqClient.connected', path)
  return zeromqClient
}

// const EventEmitter = require('events')
// var streamReadable = require('stream').Readable
// var streamWritable = require('stream').Writable

// class ZeromqClientStreamTransform extends require('stream').Transform {}
class ZeromqClientStream extends require('stream').Readable {
  // _write (chunk, encoding, callback) {
  //   debug('_write', {chunk, encoding, callback})
  //   try {
  //     // WRITE STREAM TO RESOURCE
  //     callback()
  //   } catch (err) {
  //     callback(new Error('chunk is invalid'))
  //   }
  // }
  // addToResponsesBuffer (chunk) {
  //   if (!this.externalBuffer) this.externalBuffer = []
  //   this.externalBuffer.push(chunk)
  //   debug('addToResponsesBuffer', {chunk, externalBuffer: this.externalBuffer})
  //   this.read()
  //   return this
  // }
  setReqId (reqId) {
    this.reqId = reqId
    return this
  }
  setZeromqClient (zeromqClient) {
    this.zeromqClient = zeromqClient
    return this
  }
  // _destroy (err, callback) {
  //   debug('_destroy', {err, callback})
  // }
  // _final (err, callback) {
  //   debug('_final', {err, callback})
  // }
  _read (size) {
  }
  // _destroy () {
  //   // READ STREAM FROM RESOURCE
  //   // this.zeromqClient.send(JSON.stringify({reqId: this.reqId, type: 'streamEnd'}))
  //   // if (this.externalBuffer && this.externalBuffer[0]) this.push(this.externalBuffer.shift())
  //   debug('_destroy', {})
  // }
}

var rpc = async function (path, method, data, meta, asStream = false, forceSend = false) {
  var zeromqClient = await getConnection(path, false, {path, method, data, meta})
  // if (!forceSend && zeromqClient.err) throw new Error('zeromqClient socket not ready')
  var reqId = uuidV4()
  if (!asStream) var responsePromise = new Promise((resolve, reject) => { responsesPromises[reqId] = {method, resolve, reject, zeromqClient} })
  else {
    var stream = new ZeromqClientStream({objectMode: true, writableObjectMode: true, readableObjectMode: true})
    stream.setZeromqClient(zeromqClient)
    stream.setReqId(reqId)
    stream.requestData = {path, method, data, meta}
    stream.on('error', (error) => { log('stream error', {error, errormsg: error.message}) })
    stream.on('readable', () => { debug('stream readable', true) })
    stream.on('end', (error) => { log('stream end', error) })
    // stream.on('data', () => { debug('stream data') })
    stream.on('close', (error) => {
      log('zeromqClient stream close', error)
      if (responsesStreams[reqId]) delete responsesStreams[reqId]
    })
    responsesStreams[reqId] = stream
  }
  debug('zeromqClient rpc send', {reqId, data, method, meta})
  zeromqClient.send(JSON.stringify({reqId, data, method, meta}))
  if (!asStream) {
    return responsePromise
  } else {
    return stream
  }
}
module.exports = function zeromqClient () {
  return {
    rpc,
    rpcTry: async (paths, method, data, meta, asStream) => {
      var counter = 0
      while (counter < 100) {
        counter++
        if (!paths[0]) return null
        for (var i in paths) {
          var path = paths[i]
          try {
            if (counter > 1)log('rpcTry rpc recall', {path, method, data, meta, asStream})
            var rpcRes = await rpc(path, method, data, meta, asStream)
            if (counter > 1)log('rpcTry rpc rpcRes', rpcRes)
            return rpcRes
          } catch (err) {
            log('zeromqClient rpcTry error', {err, path, method, data, meta, asStream})
          }
        }
        log('zeromqClient rpcTry all tried', {counter, paths, method, data, meta, asStream})
        await new Promise((resolve) => setTimeout(resolve, 100 * counter))
      }
      // await rpc(paths[0], method, data, meta, asStream, true)
    }
  }
}
