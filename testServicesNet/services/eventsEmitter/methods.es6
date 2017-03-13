
const jesus = require('../../../jesus')
const PACKAGE = 'methods'
const serviceName = require('./config').serviceName
const serviceId = require('./serviceId.json')

const getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath)
const getConsole = (serviceName, serviceId, pack) => jesus.getConsole(require('./config').console, serviceName, serviceId, pack)
const CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
var errorThrow = jesus.errorThrow(serviceName, serviceId, PACKAGE)

const MAX_REQUEST_TIMEOUT = require('./config').MAX_REQUEST_TIMEOUT || 120000
const EventEmitter = require('events')
var eventsStream = global.eventsStream = global.eventsStream || new EventEmitter()

module.exports = {
  listenEvents (data, meta, getStream) { // STREAM
    try {
      var writeStream=async(data) => {
        try { stream.write(data) }
        catch (error) {
          CONSOLE.warn('problems during stream', error)
        }
      }
      var onStreamClose = () => eventsStream.removeListener('captured', writeStream)
      var stream = getStream(onStreamClose, 120000)
      //eventsStream.on('captured', (data)=>stream(data).catch(error=>errorThrow('problems during streaming', {error})))
      stream.write({_connected:true})
      eventsStream.on('captured', writeStream)
      return {streamConnected: true}
    } catch (error) {
      CONSOLE.warn('problems during listenEvents', error)
      return {error: 'problems during listenEvents', originalError: error}
    }
  },
  async  capture (data, meta) {
    try {
      CONSOLE.debug(`capture corrid:` + meta.corrid, {data, meta, eventsStream})
      eventsStream.emit('captured', 'captured', {data, meta})
    } catch (error) {
      CONSOLE.warn('problems during listenEvents', error)
      return {error: 'problems during listenEvents', originalError: error}
    }
  }
}
