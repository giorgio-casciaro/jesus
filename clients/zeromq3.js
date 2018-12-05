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
var newConnection = function (path, debugData) {
  return new Promise((resolve, reject) => {
    var zeromqClient = zeromq.socket('dealer')
    this.reject = reject
    this.resolve = resolve
    zeromqClient.responsesInfo = {}
    zeromqClient.responsesStreams = {}
    zeromqClient.monitor()
    zeromqClient.path = path

    debug('zeromqClient', {zeromqClient, eventNames: zeromqClient.eventNames()})

    zeromqClient.on('connect', async code => {
      zeromqClient.connected = true
      zeromqClient.err = false
      resolve(zeromqClient)
      log('zeromqClient connect', {code, path: zeromqClient.path, debugData})
    }).on('close', errCode => {
      zeromqClient.connected = false
      log('zeromqClient close', {errCode, path: zeromqClient.path, debugData})
      resolve(zeromqClient)
    }).on('connect_delay', errCode => {
      zeromqClient.connected = false
      log('zeromqClient connect_delay', {errCode, path: zeromqClient.path, debugData})
    }).on('connect_retry', errCode => {
      zeromqClient.connected = false
      log('zeromqClient connect_retry', {errCode, path: zeromqClient.path, debugData})
    }).on('disconnect', errCode => {
      zeromqClient.connected = false
      log('zeromqClient disconnect', {errCode, path: zeromqClient.path, debugData})
      zeromqClient.closeConnection()
    }).on('error', errCode => {
      zeromqClient.connected = false
      log('zeromqClient error', {errCode, path: zeromqClient.path, debugData})
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
        log('zeromq  CLIENT message streamEnd', data)
        zeromqClient.responsesStreams[data.reqId].destroy()
      }
    })
    zeromqClient.closeConnection = async () => {
      zeromqClient.connectionClosed = true
      log('closeConnection', { keys: Object.keys(connections) })
      for (var reqId in zeromqClient.responsesInfo) {
        zeromqClient.responsesInfo[reqId].promiseReject(new Error('zeromqClient closeConnection rejected promise'))
        delete zeromqClient.responsesInfo[reqId]
      }
      for (reqId in zeromqClient.responsesStreams) {
        zeromqClient.responsesStreams[reqId].destroy()
        delete zeromqClient.responsesInfo[reqId]
      }
      zeromqClient.unmonitor()
      zeromqClient.close()
      reject(new Error('zeromqClient closeConnection'))
    }
    zeromqClient.rpc = async (method, data, meta, asStream = false, timeout = 120000) => {
      debug('zeromqClient.rpc', {connected: zeromqClient.connected, method, data, meta})
      var reqId = uuidV4()
      if (!asStream) {
        var promiseResolve, promiseReject
        var promise = new Promise(function (resolve, reject) { promiseResolve = resolve; promiseReject = reject })
        setTimeout(() => { promiseReject(new Error('zeromqClient rpc timout ')) }, timeout)
        zeromqClient.responsesInfo[reqId] = {requestData: data, promise, promiseResolve, promiseReject}
      } else {
        var stream = new ZeromqClientStream({objectMode: true, writableObjectMode: true, readableObjectMode: true})
        stream.zeromqClient = zeromqClient
        stream.reqId = reqId
        stream.requestData = {path, method, data, meta}
        stream.on('error', (error) => { log('stream error', {error, errormsg: error.message}) })
        stream.on('readable', () => { debug('stream readable', true) })
        stream.on('end', (error) => { log('stream end', error) })
        stream.on('close', () => {
          log('zeromqClient stream close', {reqId, present: !!zeromqClient.responsesStreams[reqId]})
          if (zeromqClient.responsesStreams[reqId]) delete zeromqClient.responsesStreams[reqId]
          zeromqClient.send(JSON.stringify({reqId, type: 'streamEnd'}))
        })
        // stream.on('destroy', (error) => {
        //   log('zeromqClient stream destroy', error)
        //   // if (zeromqClient.responsesStreams[reqId]) delete zeromqClient.responsesStreams[reqId]
        // })
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
}

class ZeromqClientStream extends require('stream').Readable {
  _read () {}
}
var connectionsCache = {}
var getConnection = async function (path) {
  if (!connectionsCache[path])connectionsCache[path] = newConnection(path)
  return connectionsCache[path]
}
var getConnectedConnections = async function (paths) {
  var connections = await Promise.all(paths.map(getConnection))
  return connections.filter(connection => connection.connected)
}
module.exports = function zeromqClientFunc () {
  return {
    newConnection,
    getConnectedConnections,
    getConnection
  }
}
