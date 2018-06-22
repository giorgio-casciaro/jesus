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
// var responsesInfo = {}
// var responsesStreams = {}
var getConnection = function (path, force, debugData) {
  if (connections[path])debug('zeromqClient.connect from cache', { path, debugData, cache: connections[path] })
  if (force || !connections[path]) {
    log('zeromqClient.connect not  from cache', { path, debugData, cache: connections[path] })
    connections[path] = new Promise((resolve, reject) => {
      var zeromqClient = zeromq.socket('dealer')
      this.reject = reject
      this.resolve = resolve
      zeromqClient.responsesInfo = {}
      zeromqClient.responsesStreams = {}
      zeromqClient.monitor()
    // zeromqClient.setsockopt(zeromq.ZMQ_RECONNECT_IVL_MAX, 10000)
    // zeromqClient.setsockopt(zeromq.ZMQ_LINGER, 0)
    // zeromqClient.setsockopt(zeromq.LINGER, 0)
    // zeromqClient.setsockopt(zeromq.ZMQ_IMMEDIATE, 1)

      zeromqClient.path = path

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
        zeromqClient.connected = true
        log('zeromqClient connected', {err, path: zeromqClient.path, debugData})
        zeromqClient.err = false
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      // resolved = true
        resolve(zeromqClient)
      }).on('accept', err => {
        debug('zeromqClient accept', {err, path: zeromqClient.path, debugData})
      }).on('close', err => {
        log('zeromqClient close', {err, path: zeromqClient.path, debugData})
        zeromqClient.err = err
        zeromqClient.connected = false
      // try { zeromqClient.close() } catch (err) {}
      // if (connections[path]) delete connections[path]
      // if (!resolved) {
      //   resolved = true
      //   reject(new Error('disconnected stream zeromq close'))
      // }
      // reject(new Error('disconnected stream zeromq close'))
      // zeromqClient.term()
      // delete connections[path]
      // responsesInfo[reqId].filter(promise => promise.zeromqClient === zeromqClient).

      // if (connections[path]) delete connections[path]

      // resolve(zeromqClient)
      }).on('connect_delay', err => {
      // zeromqClient.err = err
      // zeromqClient.connected = false
      // zeromqClient.close()
      // zeromqClient.err = err
        log('zeromqClient connect_delay', {err, path: zeromqClient.path, debugData})
      // zeromqClient.close()
      // if (connections[path]) delete connections[path]
      // reject(new Error('disconnected stream zeromq connect_delay'))
      // if (!resolved) {
      //   resolved = true
      //   reject(new Error('disconnected stream zeromq connect_delay'))
      // }
      }).on('connect_retry', err => {
      // zeromqClient.err = err
      // zeromqClient.connected = false
        log('zeromqClient connect_retry', {err, path: zeromqClient.path, debugData})
      // try { zeromqClient.close() } catch (err) {}
      //
      // if (connections[path]) delete connections[path]
      // reject(new Error('timeout stream zeromq '))
      // if (!resolved) {
      //   resolved = true
      //   reject(new Error('disconnected stream zeromq close'))
      // }
      // reject(new Error('disconnected stream zeromq close'))
      }).on('connect_error', err => {
        zeromqClient.err = err
        zeromqClient.connected = false
        log('zeromqClient connect_error', {err, path: zeromqClient.path, debugData})
      }).on('close_error', err => {
        zeromqClient.err = err
        zeromqClient.connected = false
        zeromqClient.err = err
        log('zeromqClient close_error', {err, path: zeromqClient.path, debugData})
      }).on('accept_error', err => {
        zeromqClient.err = err
        log('zeromqClient accept_error', {err, path: zeromqClient.path, debugData})
      }).on('disconnect', err => {
        zeromqClient.err = err
        zeromqClient.connected = false
        // zeromqClient.disconnectedPermanently = true
        log('zeromqClient disconnect', {err, path: zeromqClient.path, debugData})
        // if (connections[path]) delete connections[path]
        zeromqClient.closeConnection()
      // for (var reqId in responsesInfo) {
      //   if (responsesInfo[reqId].zeromqClient === zeromqClient) {
      //     responsesInfo[reqId].reject(new Error('zeromqClient disconnect rejected promise'))
      //     debug('zeromqClient rejected promise', responsesInfo[reqId])
      //     delete responsesInfo[reqId]
      //   }
      // }
      // for (reqId in responsesStreams) {
      //   if (responsesStreams[reqId].zeromqClient === zeromqClient) {
      //     responsesStreams[reqId].destroy()
      //     // responsesStreams[reqId].emit('end')
      //     // responsesStreams[reqId].removeAllListeners()
      //     // debug('zeromqClient end stream', responsesStreams[reqId])
      //     // delete responsesStreams[reqId]
      //   }
      // }
        // if (connections[path]) delete connections[path]
        // zeromqClient.close()
        // reject(new Error('disconnected stream zeromq close'))
      }).on('error', err => {
        zeromqClient.err = err
        zeromqClient.connected = false
        log('zeromqClient error', {err, path: zeromqClient.path, debugData})
        error(`0MQ error: ${err}`, err)
      // setTimeout(() => {
      //   zeromqClient.connect(path)
      // }, 3000)
      }).on('message', (dataRaw) => {
        var data = JSON.parse(dataRaw.toString())
      // debug('zeromq  CLIENT message ', data)
        if ((!data.type || data.type === 'response') && data.reqId && zeromqClient.responsesInfo[data.reqId]) {
          debug('zeromq  CLIENT message response', data)
          zeromqClient.responsesInfo[data.reqId].promiseResolve(data.data)
          delete zeromqClient.responsesInfo[data.reqId]
        } else if (data.type === 'stream' && data.reqId && zeromqClient.responsesStreams[data.reqId]) {
          debug('zeromq  CLIENT message stream', data)
          zeromqClient.responsesStreams[data.reqId].push(data.data)
        } else if (data.type === 'streamEnd' && data.reqId && zeromqClient.responsesStreams[data.reqId]) {
          debug('zeromq  CLIENT message streamEnd', data)
          zeromqClient.responsesStreams[data.reqId].destroy()
        // responsesStreams[data.reqId].emit('end')
        // responsesStreams[data.reqId].removeAllListeners()
        // delete responsesStreams[data.reqId]
        }
      })
      zeromqClient.checkConnection = async () => {
        if (zeromqClient.connectionClosed) { return getConnection(path, true) }
      }
      zeromqClient.closeConnection = async () => {
        // delete connections[path]
        log('closeConnection', { keys: Object.keys(connections) })
        // zeromqClient.connected = false
        for (var reqId in zeromqClient.responsesInfo) {
          log('zeromqClient rejected promise', zeromqClient.path)
          zeromqClient.responsesInfo[reqId].promiseReject(new Error('zeromqClient disconnect rejected promise'))
          delete zeromqClient.responsesInfo[reqId]
        }
        for (reqId in zeromqClient.responsesStreams) {
          zeromqClient.responsesStreams[reqId].destroy()
            // responsesStreams[reqId].emit('end')
            // responsesStreams[reqId].removeAllListeners()
            // debug('zeromqClient end stream', responsesStreams[reqId])
            // delete responsesStreams[reqId]
        }
        zeromqClient.unmonitor()
        zeromqClient.close()
        zeromqClient.connectionClosed = true
        reject()
      }
      zeromqClient.rpc = async (method, data, meta, asStream = false, forceSend = false) => {
        debug('zeromqClient.rpc', {connected: zeromqClient.connected, method, data, meta})
        // if (!forceSend && !zeromqClient.connected) throw new Error('zeromqClient socket present but not connected')
        var reqId = uuidV4()
        if (!asStream) {
          var promiseResolve, promiseReject
          var promise = new Promise(function (resolve, reject) { promiseResolve = resolve; promiseReject = reject })
          zeromqClient.responsesInfo[reqId] = {requestData: data, promise, promiseResolve, promiseReject}
        } else {
          var stream = new ZeromqClientStream({objectMode: true, writableObjectMode: true, readableObjectMode: true})
          stream.zeromqClient = zeromqClient
          stream.reqId = reqId
          stream.requestData = {path, method, data, meta}
          stream.on('error', (error) => { log('stream error', {error, errormsg: error.message}) })
          stream.on('readable', () => { debug('stream readable', true) })
          stream.on('end', (error) => { log('stream end', error) })
      // stream.on('data', () => { debug('stream data') })
          stream.on('close', (error) => {
            log('zeromqClient stream close', error)
            if (zeromqClient.responsesStreams[reqId]) delete zeromqClient.responsesStreams[reqId]
          })
          zeromqClient.responsesStreams[reqId] = stream
        }
        debug('zeromqClient rpc send', {reqId, data, method, meta})
        zeromqClient.send(JSON.stringify({reqId, data, method, meta}))
        if (!asStream) {
          return promise
        } else {
          return stream
        }
      }

      log('zeromqClient connect', {path, debugData})
      zeromqClient.connect(path)
    })
  } else {
    debug('zeromqClient.connect from cache', path)
  }
  return connections[path]
  // debug('zeromqClient.connected', path)
  // return zeromqClient
}

// const EventEmitter = require('events')
// var streamReadable = require('stream').Readable
// var streamWritable = require('stream').Writable

// class ZeromqClientStreamTransform extends require('stream').Transform {}
class ZeromqClientStream extends require('stream').Readable {
  _read () {}
}
const os = require('os')

module.exports = function zeromqClientFunc () {
  return {
    // async closeConnection  (path) {
    //   log('closeConnection', {path, keys: Object.keys(connections)})
    //   if (!connections[path]) return null
    //   var zeromqClient = await connections[path]
    //   zeromqClient.connected = false
    //   for (var reqId in zeromqClient.responsesInfo) {
    //     log('zeromqClient rejected promise', zeromqClient.path)
    //     zeromqClient.responsesInfo[reqId].promiseReject(new Error('zeromqClient disconnect rejected promise'))
    //     delete zeromqClient.responsesInfo[reqId]
    //   }
    //   for (reqId in zeromqClient.responsesStreams) {
    //     zeromqClient.responsesStreams[reqId].destroy()
    //       // responsesStreams[reqId].emit('end')
    //       // responsesStreams[reqId].removeAllListeners()
    //       // debug('zeromqClient end stream', responsesStreams[reqId])
    //       // delete responsesStreams[reqId]
    //   }
    //   delete connections[path]
    //   try { zeromqClient.close() } catch (err) {}
    // },
    getConnection

  }
}
