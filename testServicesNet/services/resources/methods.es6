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

const validateMethodRequest = async (methodName, data) => jesus.validateMethodFromConfig(serviceName, serviceId, await getSharedConfig(serviceName, 'methods'), methodName, data, 'requestSchema')
const validateMethodResponse = async (methodName, data) => jesus.validateMethodFromConfig(serviceName, serviceId, await getSharedConfig(serviceName, 'methods'), methodName, data, 'responseSchema')

var netClientPackage = netClient({getSharedConfig, serviceName, serviceId})

async function authorize (data) {
  var results = await netClientPackage.emit('authorize', data, data.meta)
  if (!results) errorThrow(`not authorized`)
  return results
}

module.exports = {
  async  createResource ({data, id, userId, token}, meta) {
    try {
      LOG.profile('createResource')
      LOG.debug(`start createResource() requestId:` + meta.requestId, {data, id, meta})
      await validateMethodRequest('createResource', {data, id, userId, token})
      data._id = id = id || data._id || uuidV4() // generate id if necessary
      var cqrs = await entityCqrs(require('./config.Resource'), {serviceName, serviceId})
      await authorize({action: 'write.create', entityName: 'Resource', meta, data, id})
      var addedMutation = await cqrs.mutationsPackage.mutate({data, objId: id, mutation: 'create', meta})
      // REFRESH VIEWS
      cqrs.viewsPackage.refreshViews({objIds: [id], loadSnapshot: false, loadMutations: false, addMutations: [addedMutation]}).then((views) => {
        netClientPackage.emit('viewsUpdated', views, meta)
      })
      var response = await validateMethodResponse('createResource', {id})
      LOG.profileEnd('createResource')
      return response
    } catch (error) {
      LOG.warn('problems during create', error)
      return {error: 'problems during create', originalError: error}
    }
  },
  async  updateResource ({data, id, userId, token}, meta) {
    try {
      LOG.debug(`start updateResource() requestId:` + meta.requestId, {data, id, meta})
      await validateMethodRequest('updateResource', {data, id, userId, token})
      data._id = id = id || data._id
      var cqrs = await entityCqrs(require('./config.Resource'), {serviceName, serviceId})
      await authorize({action: 'write.update', entityName: 'Resource', meta, data, id})
      var addedMutation = await cqrs.mutationsPackage.mutate({data, objId: id, mutation: 'update', meta})
      cqrs.viewsPackage.refreshViews({objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation]}).then((views) => {
        netClientPackage.emit('viewsUpdated', views, meta)
      })
      return await validateMethodResponse('updateResource', {id})
    } catch (error) {
      LOG.warn('problems during update', error)
      return {error: 'problems during update', originalError: error}
    }
  },
  async  deleteResource ({id, userId, token}, meta) {
    try {
      LOG.debug(`start deleteResource() requestId:` + meta.requestId, {id, meta})
      await validateMethodRequest('deleteResource', {id, userId, token})
      await authorize({action: 'write.delete', entityName: 'Resource', meta, id})
      var cqrs = await entityCqrs(require('./config.Resource'), {serviceName, serviceId})
      var addedMutation = await cqrs.mutationsPackage.mutate({ objId: id, mutation: 'delete', meta})
      cqrs.viewsPackage.refreshViews({objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation]}).then((views) => {
        netClientPackage.emit('viewsUpdated', views, meta)
      })
      return await validateMethodResponse('deleteResource', {id})
    } catch (error) {
      LOG.warn('problems during delete', error)
      return {error: 'problems during delete', originalError: error}
    }
  },
  async  readResource ({id, userId, token}, meta) {
    try {
      LOG.debug(`start readResource() requestId:` + meta.requestId, {id, meta})
      await validateMethodRequest('readResource', {id, userId, token})
      await authorize({action: 'read', entityName: 'Resource', meta, id})
      var cqrs = await entityCqrs(require('./config.Resource'), {serviceName, serviceId})
      var viewsResult = await cqrs.viewsPackage.get({ids: [id]})
      LOG.debug(`readResource viewsResult`, viewsResult)
      if (viewsResult.length !== 1) throw `id: ${id} Item Not Founded`
      return await validateMethodResponse('readResource', viewsResult[0])
    } catch (error) {
      LOG.warn('problems during read', error)
      return {error: 'problems during read', originalError: error}
    }
  },
  // PRIVATE
  async  listResources ({page = 1, timestamp, pageItems = 10, checksumOnly = false, idIn}, meta) {
    try {
      LOG.debug(`start listResources() requestId:` + meta.requestId, {page, timestamp}, meta)
      await validateMethodRequest('listResources', {page, timestamp}, meta)
      var cqrs = await entityCqrs(require('./config.Resource'), {serviceName, serviceId})
      var fields = (checksumOnly) ? { _viewHash: 1 } : null
      var query = {}
      if (timestamp)query._viewBuilded = {$lt: timestamp}
      if (idIn)query._id = {$in: idIn}
      var views = await cqrs.viewsPackage.find({query, limit: pageItems, start: (page - 1) * pageItems, fields})
      LOG.debug(`listResources response`, {views})
      return await validateMethodResponse('listResources', views)
    } catch (error) {
      LOG.warn('problems during listResources', error)
      return {error: 'problems during listResources', originalError: error}
    }
  }
}
