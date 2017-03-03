const jesus = require('../../../jesus')
const PACKAGE = 'methods'
const serviceName = require('./config').serviceName
const serviceId = require('./serviceId.json')

const getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath)
const getConsole = (serviceName, serviceId, pack) => jesus.getConsole(require('./config').console, serviceName, serviceId, pack)
const CONSOLE = getConsole(serviceName, serviceId, PACKAGE)

const MAX_REQUEST_TIMEOUT = require('./config').MAX_REQUEST_TIMEOUT || 120000
const EventEmitter = require('events')
var eventsStream = global.eventsStream = global.eventsStream || new EventEmitter()

module.exports = {
  listenEvents (views, meta, stream) {
    try {
      CONSOLE.debug(`start listenEvents() requestId:` + meta.requestId, {views, meta, stream, eventsStream})
      var callback = (data, meta) => stream.write(data)
      var removeCallback = () => eventsStream.removeListener('connection', callback)
      eventsStream.on('captured', callback)
      stream.res.on('close', removeCallback)
      stream.res.on('finish', removeCallback)
      stream.write({connected: true})
      setTimeout(stream.res.end, MAX_REQUEST_TIMEOUT)
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
