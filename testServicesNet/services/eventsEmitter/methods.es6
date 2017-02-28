var jesus = require('../../../jesus')

var serviceName = require('./config').serviceName
var serviceId = require('./serviceId.json')
var getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath)

const PACKAGE = 'methods'
var LOG = jesus.LOG(serviceName, serviceId, PACKAGE)

const EventEmitter = require('events')
LOG.debug('eventsStream global', global.eventsStream)
var eventsStream = global.eventsStream = global.eventsStream || new EventEmitter()
module.exports = {
   listenEvents (views, meta, stream) {
    try {
      LOG.debug(`start listenEvents() requestId:` + meta.requestId, {views, meta, stream, eventsStream})
      var callback = (data, meta) => {
        LOG.debug("listenEvents() callback count events 'connection'", eventsStream.listenerCount('connection'))
        stream.write(data)
      }
      var removeCallback = (r) => {
        LOG.debug("listenEvents() removeCallback count events 'connection'", eventsStream.listenerCount('connection'))
        eventsStream.removeListener('connection', callback)
      }
      eventsStream.on('captured', callback)
      stream.res.on('close', removeCallback)
      stream.res.on('finish', removeCallback)
      stream.write({connected: true})
      //setInterval(() => stream.write({keepAlive: true}), 1000)
    } catch (error) {
      LOG.warn('problems during listenEvents', error)
      return {error: 'problems during listenEvents', originalError: error}
    }
  },
  async  capture (data, meta) {
    try {
      LOG.debug(`capture requestId:` + meta.requestId, {data, meta, eventsStream})
      eventsStream.emit('captured', data, meta)
    } catch (error) {
      LOG.warn('problems during listenEvents', error)
      return {error: 'problems during listenEvents', originalError: error}
    }
  }
}
