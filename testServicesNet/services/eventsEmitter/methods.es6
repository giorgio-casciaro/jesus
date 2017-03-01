var jesus = require('../../../jesus')

var serviceName = require('./config').serviceName
var serviceId = require('./serviceId.json')
var getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath)
var getConsole = (serviceName, serviceId, pack) => jesus.getConsole(require('./config').console, serviceName, serviceId, pack)

const PACKAGE = 'methods'
var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
const MAX_REQUEST_TIMEOUT = require('./config').MAX_REQUEST_TIMEOUT || 120000

const EventEmitter = require('events')
CONSOLE.debug('eventsStream global', global.eventsStream)
var eventsStream = global.eventsStream = global.eventsStream || new EventEmitter()
module.exports = {
  listenEvents (views, meta, stream) {
    try {
      CONSOLE.debug(`start listenEvents() requestId:` + meta.requestId, {views, meta, stream, eventsStream})
      var callback = (data, meta) => {
        CONSOLE.debug("listenEvents() callback count events 'connection'", eventsStream.listenerCount('connection'))
        stream.write(data)
      }
      var removeCallback = (r) => {
        CONSOLE.debug("listenEvents() removeCallback count events 'connection'", eventsStream.listenerCount('connection'))
        eventsStream.removeListener('connection', callback)
      }
      eventsStream.on('captured', callback)
      stream.res.on('close', removeCallback)
      stream.res.on('finish', removeCallback)
      stream.write({connected: true})
      var maxTimeout = setTimeout(() => {
        CONSOLE.debug("listenEvents() maxTimeout closing requestId:"+ meta.requestId)
        stream.res.end();
      }, MAX_REQUEST_TIMEOUT)
      // setInterval(() => stream.write({keepAlive: true}), 1000)
    } catch (error) {
      CONSOLE.warn('problems during listenEvents', error)
      return {error: 'problems during listenEvents', originalError: error}
    }
  },
  async  capture (data, meta) {
    try {
      CONSOLE.debug(`capture requestId:` + meta.requestId, {data, meta, eventsStream})
      eventsStream.emit('captured', data, meta)
    } catch (error) {
      CONSOLE.warn('problems during listenEvents', error)
      return {error: 'problems during listenEvents', originalError: error}
    }
  }
}
