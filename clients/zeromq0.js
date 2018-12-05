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
var getConnection = async function (path) {
  if (connections[path]) return connections[path]
  var zeromqClient = zeromq.socket('dealer')
  zeromqClient.setsockopt(zeromq.ZMQ_RECONNECT_IVL_MAX, 10000)
  // zeromqClient.setsockopt(zeromq.ZMQ_IMMEDIATE, 1)
  zeromqClient.monitor()
  connections[path] = zeromqClient
  log('zeromqClient.connect', path)
  await new Promise((resolve, reject) => {
    log('zeromqClient', {zeromqClient, eventNames: zeromqClient.eventNames()})
    zeromqClient.on('connect', err => {
      log('zeromqClient connected', {err, zeromqClient})
      zeromqClient.err = false
      resolve()
    }).on('accept', err => {
      log('zeromqClient accept', {err, zeromqClient})
    }).on('close', err => {
      zeromqClient.err = err
      // responsesPromises[reqId].filter(promise => promise.zeromqClient === zeromqClient).

      // if (connections[path]) delete connections[path]
      // log('zeromqClient close', {err, zeromqClient})
    }).on('connect_delay', err => {
      // log('zeromqClient connect_delay', {err, zeromqClient})
    }).on('connect_retry', err => {
      // log('zeromqClient connect_retry', {err, zeromqClient})
    }).on('close_error', err => {
      zeromqClient.err = err
      log('zeromqClient close_error', {err, zeromqClient})
    }).on('accept_error', err => {
      zeromqClient.err = err
      log('zeromqClient accept_error', {err, zeromqClient})
    }).on('disconnect', err => {
      zeromqClient.err = err
      log('zeromqClient disconnect', {err, zeromqClient})
      for (var reqId in responsesPromises) {
        if (responsesPromises[reqId].zeromqClient === zeromqClient) {
          responsesPromises[reqId].reject('zeromqClient disconnect rejected promise')
          log('zeromqClient rejected promise', responsesPromises[reqId])
          delete responsesPromises[reqId]
        }
      }
      for (reqId in responsesStreams) {
        if (responsesStreams[reqId].zeromqClient === zeromqClient) {
          responsesStreams[reqId].emit('end')
          responsesStreams[reqId].removeAllListeners()
          log('zeromqClient end stream', responsesStreams[reqId])
          delete responsesStreams[reqId]
        }
      }
      // zeromqClient.close()
      // if (connections[path]) delete connections[path]
    }).on('error', err => {
      zeromqClient.err = err
      log('zeromqClient error', {err, zeromqClient})
      error(`0MQ error: ${err}`, err)
      // setTimeout(() => {
      //   zeromqClient.connect(path)
      // }, 3000)
    }).on('message', (dataRaw) => {
      var data = JSON.parse(dataRaw.toString())
      debug('zeromq  CLIENT message ', data)
      if ((!data.type || data.type === 'response') && data.reqId && responsesPromises[data.reqId]) {
        responsesPromises[data.reqId].resolve(data.data)
        delete responsesPromises[data.reqId]
      } else if (data.type === 'stream' && data.reqId && responsesStreams[data.reqId])responsesStreams[data.reqId].emit('data', data.data)
      else if (data.type === 'streamEnd' && data.reqId && responsesStreams[data.reqId]) {
        responsesStreams[data.reqId].emit('end')
        responsesStreams[data.reqId].removeAllListeners()
        delete responsesStreams[data.reqId]
      }
    })
    zeromqClient.connect(path)
  })

  // log('zeromqClient.connected', path)
  return zeromqClient
}

const EventEmitter = require('events')

class ZeromqClientStreamEmitter extends EventEmitter {}

var rpc = async function (path, method, data, meta, asStream = false, forceSend = false) {
  var zeromqClient = await getConnection(path)
  if (!forceSend && zeromqClient.err) throw new Error('zeromqClient socket not ready')
  var reqId = uuidV4()
  if (!asStream) var responsePromise = new Promise((resolve, reject) => { responsesPromises[reqId] = {method, resolve, reject, zeromqClient} })
  else {
    var stream = new ZeromqClientStreamEmitter()
    stream.zeromqClient = zeromqClient
    stream.end = () => {
      debug('zeromqClient stream end', {reqId, type: 'streamEnd'})
      zeromqClient.send(JSON.stringify({reqId, type: 'streamEnd'}))
      if (responsesStreams[reqId]) {
        responsesStreams[reqId].emit('end')
        responsesStreams[reqId].removeAllListeners()
        delete responsesStreams[reqId]
      }
    }
    responsesStreams[reqId] = stream
  }
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
      if (!paths[0]) return null
      for (var i in paths) {
        var path = paths[i]
        try {
          return await rpc(path, method, data, meta, asStream)
        } catch (err) {
          debug('zeromqClient rpcTry error', {err})
        }
      }
      await rpc(paths[0], method, data, meta, asStream, true)
    }
  }
}
