var jesus = require('../../../jesus')

var serviceName = require('./config').serviceName
var serviceId = require('./serviceId.json')
var sharedServicesPath = require('./config').sharedServicesPath
var sharedServicePath = require('./config').sharedServicePath
// const netClient = require('../../../net.client')

process.on('unhandledRejection', (reason, promise) => LOG.error('unhandledRejection Reason: ', promise, reason))

const PACKAGE = 'methods'
var LOG = jesus.LOG(serviceName, serviceId, PACKAGE)
var errorThrow = jesus.errorThrow(serviceName, serviceId, PACKAGE)

const EventEmitter = require('events')
var eventsStream = new EventEmitter()

module.exports = {
  async  listenEvents (views, meta, stream) {
    try {
      LOG.debug(`start listenEvents()`, {views, meta, stream})
      eventsStream.on('captured', (data) => {
        stream.write(data)
      })
    } catch (error) {
      LOG.warn('problems during listenEvents', error)
      return {error: 'problems during listenEvents', originalError: error}
    }
  },
  async  capture (data, meta) {
    try {
      LOG.debug(`capture`, {data, meta})
      eventsStream.emit('captured', data)
    } catch (error) {
      LOG.warn('problems during listenEvents', error)
      return {error: 'problems during listenEvents', originalError: error}
    }
  }
}
