var entityCqrs = require('../../../entity.cqrs')
var jesus = require('../../../jesus')
const uuidV4 = require('uuid/v4')
const netClient = require('../../../net.client')

var serviceName = require('./config').serviceName
var serviceId = require('./serviceId.json')
var sharedServicesPath = require('./config').sharedServicesPath
var sharedServicePath = require('./config').sharedServicePath

process.on('unhandledRejection', (reason, promise) => LOG.error('unhandledRejection Reason: ', promise, reason))

const PACKAGE = 'methods'
var LOG = jesus.LOG(serviceName, serviceId, PACKAGE)
var errorThrow = jesus.errorThrow(serviceName, serviceId, PACKAGE)

const validateMethodRequest = (apiMethod, data) => jesus.validateMethodFromConfig(serviceName, serviceId, sharedServicePath + '/methods.json', apiMethod, data, 'requestSchema')
const validateMethodResponse = (apiMethod, data) => jesus.validateMethodFromConfig(serviceName, serviceId, sharedServicePath + '/methods.json', apiMethod, data, 'responseSchema')

const NET_CLIENT_ARGS = {sharedServicesPath, sharedServicePath, serviceName, serviceId}
var netClientPackage = netClient(NET_CLIENT_ARGS)

async function authorize (data) {
  var results = await netClientPackage.emit('authorize', data)
  if (!results) errorThrow(`not authorized`)
  return results
}

module.exports = {
  async  createResource ({data, id}, meta) {
    try {
      // LOG.profile('createResource')
      LOG.debug(`start createResource()`, {data, id}, meta)
      validateMethodRequest('createResource', {data, id}, meta)
      data._id = id = id || data._id || uuidV4() // generate id if necessary
      var cqrs = await entityCqrs(require('./config.Resource'), {serviceName, serviceId})
      var userData = authorize({action: 'write.create', entityName: 'Resource', meta, data, id})
      var addedMutation = await cqrs.mutationsPackage.mutate({data, objId: id, mutation: 'create', userData})
      // REFRESH VIEWS
      cqrs.viewsPackage.refreshViews({objIds: [id], loadSnapshot: false, loadMutations: false, addMutations: [addedMutation]}).then((views) => {
        netClientPackage.emit('viewsUpdated', views)
      })
      // LOG.profileEnd('createResource')
      return validateMethodResponse('createResource', {id})
    } catch (error) {
      LOG.warn('problems during create', error)
      return {error: 'problems during create', originalError: error}
    }
  },
  async  updateResource ({data, id}, meta) {
    try {
      LOG.debug(`start updateResource()`, {data, id}, meta)
      validateMethodRequest('updateResource', {data, id}, meta)
      data._id = id = id || data._id
      var cqrs = await entityCqrs(require('./config.Resource'), {serviceName, serviceId})
      var userData = authorize({action: 'write.update', entityName: 'Resource', meta, data, id})
      var addedMutation = await cqrs.mutationsPackage.mutate({data, objId: id, mutation: 'update', userData})
      cqrs.viewsPackage.refreshViews({objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation]}).then((views) => {
        netClientPackage.emit('viewsUpdated', views)
      })
      return validateMethodResponse('updateResource', {id})
    } catch (error) {
      LOG.warn('problems during update', error)
      return {error: 'problems during update', originalError: error}
    }
  },
  async  deleteResource ({data, id}, meta) {
    try {
      LOG.debug(`start deleteResource()`, {data, id}, meta)
      validateMethodRequest('deleteResource', {data, id}, meta)
      data._id = id = id || data._id
      var cqrs = await entityCqrs(require('./config.Resource'), {serviceName, serviceId})
      var userData = authorize({action: 'write.delete', entityName: 'Resource', meta, data, id})
      var addedMutation = await cqrs.mutationsPackage.mutate({data, objId: id, mutation: 'delete', userData})
      cqrs.viewsPackage.refreshViews({objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation]}).then((views) => {
        netClientPackage.emit('viewsUpdated', views)
      })
      return validateMethodResponse('deleteResource', {id})
    } catch (error) {
      LOG.warn('problems during delete', error)
      return {error: 'problems during delete', originalError: error}
    }
  },
  async  readResource ({data, id}, meta) {
    try {
      LOG.debug(`start readResource()`, {data, id}, meta)
      validateMethodRequest('readResource', {data, id}, meta)
      id = id || data._id
      var cqrs = await entityCqrs(require('./config.Resource'), {serviceName, serviceId})
      var viewsResult = await cqrs.viewsPackage.get({ids: [id]})
      LOG.debug(`readResource viewsResult`, viewsResult)
      if (viewsResult.length !== 1) throw `id: ${id} Item Not Founded`
      var userData = authorize({action: 'read', entityName: 'Resource', meta, data, id})
      return validateMethodResponse('readResource', viewsResult[0])
    } catch (error) {
      LOG.warn('problems during read', error)
      return {error: 'problems during read', originalError: error}
    }
  },
  async  listResources ({page=1, timestamp, pageItems = 10, checksumOnly = false, idIn}, meta) {
    try {
      LOG.debug(`start listResources()`, {page, timestamp}, meta)
      validateMethodRequest('listResources', {page, timestamp}, meta)
      var cqrs = await entityCqrs(require('./config.Resource'), {serviceName, serviceId})
      var fields = (checksumOnly) ? { _viewHash: 1 } : null
      var query = {}
      if (timestamp)query._viewBuilded = {$lt: timestamp}
      if (idIn)query._id = {$in: idIn}
      var views = await cqrs.viewsPackage.find({query, limit: pageItems, start: (page - 1) * pageItems, fields})
      LOG.debug(`listResources response`, {views})
      return validateMethodResponse('listResources', views)
    } catch (error) {
      LOG.warn('problems during listResources', error)
      return {error: 'problems during listResources', originalError: error}
    }
  }
}
