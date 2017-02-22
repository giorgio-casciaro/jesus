var jesus = require('../../../jesus')

var serviceName = require('./config').serviceName
var serviceId = require('./serviceId.json')
var sharedServicesPath = require('./config').sharedServicesPath
var sharedServicePath = require('./config').sharedServicePath

process.on('unhandledRejection', (reason, promise) => LOG.error('unhandledRejection Reason: ', promise, reason))

const PACKAGE = 'methods'
var LOG = jesus.LOG(serviceName,serviceId,PACKAGE)
var errorThrow = jesus.errorThrow(serviceName,serviceId,PACKAGE)



module.exports = {
  async  authorize ({action, entityName, id, meta}) {
    try {
        // DI.warn({msg: `authorize`, debug: {action, entityName, itemsIds, meta}})
      return {
        userData: {'userId': '195151662661'}
      }
    } catch (error) {
      return DI.errorResponse({message: 'problems during authorize', originalError: error})
    }
  }
}
