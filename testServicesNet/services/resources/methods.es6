
const jesus = require('../../../jesus')
const uuidV4 = require('uuid/v4')

const PACKAGE = 'methods'
const serviceName = require('./config').serviceName
const serviceId = require('./serviceId.json')

const getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath)
const getConsole = (serviceName, serviceId, pack) => jesus.getConsole(require('./config').console, serviceName, serviceId, pack)
const CONSOLE = getConsole(serviceName, serviceId, PACKAGE)

const msNet = require('../../../net.client')({getSharedConfig, serviceName, serviceId, getConsole})
// const msNet = {emit:()=>true,rpc:()=>true}

const getStorage = () => require('../../../storage.inmemory')({getConsole, serviceName, serviceId, storageConfig: require('./config').storage})
const storageGet = (collectionName, ids) => getStorage().get({collectionName, ids}) // ASYNC
const storageFind = (args) => getStorage().find(args) // ASYNC
const storageInsert = (collectionName, obj) => getStorage().insert({collectionName, objs: [obj]}) // ASYNC
const storageUpdate = (collectionName, obj) => getStorage().update({collectionName, queriesArray: [{'_id': obj._id}], dataArray: [obj], insertIfNotExists: true}) // ASYNC

const authorize = (data) => msNet.emit('authorize', data, data.meta, true)// ASYNC

var entityConfig = require('./config.Resource')

const getObjMutations = ({entityName, objId, minTimestamp = 0}) => getStorage().find({ collectionName: entityName + 'Mutations', query: { objId, timestamp: {$gte: minTimestamp} }, sort: {timestamp: 1} }) // ASYNC
const getLastSnapshot = ({entityName, objId}) => getStorage().find({collectionName: entityName + 'MainViewSnapshots', query: {objId: objId}, sort: {timestamp: 1}, limit: 1, start: 0})// ASYNC
var mutationsCqrsPack = require('../../../mutations.cqrs')({serviceName, serviceId, getConsole, mutationsPath: entityConfig.mutationsPath})
var viewsCqrsPack = require('../../../views.cqrs')({serviceName, serviceId, getConsole, getObjMutations, applyMutations: mutationsCqrsPack.applyMutations, snapshotsMaxMutations: entityConfig.snapshotsMaxMutations})

const refreshViews = async (args) => {
  var results = await viewsCqrsPack.refreshViews(args)
  var views = []
  results.forEach(({updatedView, newSnapshot}) => {
    if (updatedView) {
      views.push(updatedView)
      storageUpdate(entityConfig.viewsCollection, updatedView)
    }
    if (newSnapshot)storageInsert(entityConfig.snapshotsCollection, newSnapshot)
  })
  return views
}
const mutate = async (args) => {
  var mutation = mutationsCqrsPack.mutate(args)
  await storageInsert(entityConfig.mutationsCollection, mutation)
  return mutation
}

module.exports = {
  async  createResource ({data, id, userId, token}, meta) {
    try {
      CONSOLE.debug(`start createResource() requestId:` + meta.requestId, {data, id, meta})
      await authorize({action: 'write.create', entityName: 'Resource', meta, data, id})

      data._id = id = id || data._id || uuidV4() // generate id if necessary
      var addedMutation = await mutate({data, objId: id, mutation: 'create', meta})
      var views = refreshViews({objIds: [id], lastSnapshot: false, loadMutations: false, addMutations: [addedMutation]})
      msNet.emit('mainViewsUpdated', views, meta)
      return {id}
    } catch (error) {
      CONSOLE.warn('problems during create', error)
      return {error: 'problems during create', originalError: error}
    }
  },
  async  updateResource ({data, id, userId, token}, meta) {
    try {
      CONSOLE.debug(`start updateResource() requestId:` + meta.requestId, {data, id, meta})

      data._id = id = id || data._id
      var addedMutation = await mutate({data, objId: id, mutation: 'update', meta})
      var views = refreshViews({objIds: [id], lastSnapshot: getLastSnapshot('Resource', id), loadMutations: true, addMutations: [addedMutation]})
      msNet.emit('mainViewsUpdated', views, meta)
      return {id}
    } catch (error) {
      CONSOLE.warn('problems during update', error)
      return {error: 'problems during update', originalError: error}
    }
  },
  async  deleteResource ({id, userId, token}, meta) {
    try {
      CONSOLE.debug(`start deleteResource() requestId:` + meta.requestId, {id, meta})
      await validateMethodRequest('deleteResource', {id, userId, token})
      await authorize({action: 'write.delete', entityName: 'Resource', meta, id})

      var addedMutation = await mutate({ objId: id, mutation: 'delete', meta})
      var views = refreshViews({objIds: [id], lastSnapshot: getLastSnapshot('Resource', id), loadMutations: true, addMutations: [addedMutation]})
      msNet.emit('mainViewsUpdated', views, meta)

      return {id}
    } catch (error) {
      CONSOLE.warn('problems during delete', error)
      return {error: 'problems during delete', originalError: error}
    }
  },
  async  readResource ({id, userId, token}, meta) {
    try {
      CONSOLE.debug(`start readResource() requestId:` + meta.requestId, {id, meta})
      await authorize({action: 'read', entityName: 'Resource', meta, id})

      var viewsResult = await storageGet(entityConfig.viewsCollection, [id])
      if (viewsResult.length !== 1) throw `id: ${id} Item Not Found`

      return  viewsResult[0]
    } catch (error) {
      CONSOLE.warn('problems during read', error)
      return {error: 'problems during read', originalError: error}
    }
  },
  // PRIVATE
  async  listResources ({page = 1, timestamp, pageItems = 10, checksumOnly = false, idIn}, meta) {
    try {
      CONSOLE.debug(`start listResources() requestId:` + meta.requestId, {page, timestamp}, meta)

      var fields = (checksumOnly) ? { _viewHash: 1 } : null
      var query = {}
      if (timestamp)query._viewBuilded = {$lt: timestamp}
      if (idIn)query._id = {$in: idIn}
      var views = await storageFind({collectionName: entityConfig.viewsCollection, query, limit: pageItems, start: (page - 1) * pageItems, fields})
      CONSOLE.debug(`listResources() views:`, views)
      return views
    } catch (error) {
      CONSOLE.warn('problems during listResources', error)
      return {error: 'problems during listResources', originalError: error}
    }
  }
}
