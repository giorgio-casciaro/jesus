var entityCqrs = require('../../../entity.cqrs')
var jesus = require('../../../jesus')
const uuidV4 = require('uuid/v4')
const netClient = require('../../../net.client')

var serviceName = require('./config').serviceName
var serviceId = require('./serviceId.json')
var getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath)

const PACKAGE = 'methods'
var LOG = jesus.LOG(serviceName, serviceId, PACKAGE)
var errorThrow = jesus.errorThrow(serviceName, serviceId, PACKAGE)

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
