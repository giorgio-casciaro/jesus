const jesus = require('../../../jesus')
const PACKAGE = 'methods'
const serviceName = require('./config').serviceName
const serviceId = require('./serviceId.json')

const getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath)
const getConsole = (serviceName, serviceId, pack) => jesus.getConsole(require('./config').console, serviceName, serviceId, pack)
const CONSOLE = getConsole(serviceName, serviceId, PACKAGE)

module.exports = {
  async  authorize ({action, entityName, id, meta}) {
    try {
        // DI.warn({msg: `authorize`, debug: {action, entityName, itemsIds, meta}})
      return {
        userData: {'userId': '195151662661'}
      }
    } catch (error) {
      CONSOLE.warn('problems during listenEvents', error)
      return {error: 'problems during authorizations', originalError: error}
    }
  }
}
