require('babel-polyfill')
const R = require('ramda')
const jesus = require('jesus')
const path = require('path')
const PACKAGE_NAME = 'permissions'
const CONFIG = require('./config')

// SHARED FUNCTIONS
// var optionsStorage = jesus.getStoragePackage(CONFIG.optionsStorage, CONFIG.entities.Permission.optionsStorageCollection)
var mutationsStorage = jesus.getStoragePackage(CONFIG.entities.Permission.mutationsStorage, CONFIG.entities.Permission.mutationsStorageCollection)
const mutationsPackage = require('jesus/cqrs.mutations')({
  mutationsPath: path.join(__dirname, 'mutations'),
  storage: mutationsStorage
})
const mainViewPackage = require('jesus/cqrs.views')({
  mutations: mutationsPackage,
  snapshotsMaxMutations: 10,
  snapshotsStorage: jesus.getStoragePackage(CONFIG.entities.Permission.mainViewSnapshotsStorage, CONFIG.entities.Permission.mainViewSnapshotsStorageCollection),
  storage: jesus.getStoragePackage(CONFIG.entities.Permission.mainViewStorage, CONFIG.entities.Permission.mainViewStorageCollection)
})
const validateData = require('jesus/validate.jsonSchema')(require('civilconnect/entities/Permission/entity.schema.json'))

function getDeleteFunction (DI) {
  const FUNCTION_NAME = 'delete'
  jesus.checkRequiredDependencies(DI, ['authenticate', 'authorize', 'log', 'validate', 'mutate', 'refreshViews'])
  function log (type, data) {
    DI.log({type, context: [PACKAGE_NAME, FUNCTION_NAME], data})
  }
  return (request = {}) => new Promise(async function createPromise (resolve, reject) {
    try {
      var entityIds = request.ids
      var authorizationsData = await DI.authenticate(request.token)
      await DI.authorize('Permission', 'read', authorizationsData, {ids: entityIds})

      await mutationsPackage.mutate('delete', entityIds)
      await mainViewPackage.refreshEntitiesViews(entityIds)
      log('LOG', {entityIds})
      resolve({ids: entityIds})
    } catch (error) {
      log('ERROR', error)
      reject(error)
    }
  })
}

function getCreatePermissionFunction (DI) {
  const FUNCTION_NAME = 'create'
  jesus.checkRequiredDependencies(DI, ['authenticate', 'authorize', 'getLogFunction'])
  const log = DI.getLogFunction([PACKAGE_NAME, FUNCTION_NAME])
  // MAIN FUNCTION
  return async function create (request = {}, resolve, reject) {
    try {
      var entityInstances = request.items
      await validateData(entityInstances)

      var authorizationsData = await DI.authenticate(request.token)
      await DI.authorize('Permission', 'write', authorizationsData, {instances: entityInstances})

      // var newIds = jesus.createNewIds(entityInstances.length)
      // var entityInstancesWithIds = jesus.addObjectColumn(entityInstances, '_id', newIds)
      var entityIds = R.map(R.prop('_id'), entityInstances)
      var entitiesMutations = await mutationsPackage.mutate('create', entityIds, entityInstances)
      await mainViewPackage.refreshEntitiesViews(entityIds, false, entitiesMutations)
      log('LOG', {entityInstances})
      resolve({ids: entityIds})
    } catch (error) {
      log('ERROR', error)
      reject(error)
    }
  }
}
function getReadPermissionFunction (DI) {
  const FUNCTION_NAME = 'read'
  jesus.checkRequiredDependencies(DI, ['authenticate', 'authorize', 'getLogFunction'])
  const log = DI.getLogFunction([PACKAGE_NAME, FUNCTION_NAME])
  return async function create (request = {}, resolve, reject) {
    try {
      var entityIds = request.ids
      var authorizationsData = await DI.authenticate(request.token)
      await DI.authorize('Permission', 'read', authorizationsData, {ids: entityIds})
      var entityInstances = await mainViewPackage.get(entityIds)
      log('LOG', {entityInstances})
      resolve({entityInstances})
    } catch (error) {
      log('ERROR', error)
      reject(error)
    }
  }
}

function getUpdatePermissionFunction (DI) {
  const FUNCTION_NAME = 'update'
  jesus.checkRequiredDependencies(DI, ['authenticate', 'authorize', 'getLogFunction'])
  const log = DI.getLogFunction([PACKAGE_NAME, FUNCTION_NAME])
  // MAIN FUNCTION
  return async function create (request = {}, resolve, reject) {
    try {
      var entityInstances = request.items
      await validateData(entityInstances)

      var authorizationsData = await DI.authenticate(request.token)
      await DI.authorize('Permission', 'write', authorizationsData, {instances: entityInstances})

      // var newIds = jesus.createNewIds(entityInstances.length)
      // var entityInstancesWithIds = jesus.addObjectColumn(entityInstances, '_id', newIds)
      var entityIds = R.map(R.prop('_id'), entityInstances)
      await mutationsPackage.mutate('update', entityIds, entityInstances)
      await mainViewPackage.refreshEntitiesViews(entityIds)
      log('LOG', {entityIds})
      resolve({ids: entityIds})
    } catch (error) {
      log('ERROR', error)
      reject(error)
    }
  }
}
// FUNCTIONS
module.exports = (DI) => {
  DI = R.clone(DI)
  // DI.on('createPermission', getCreatePermissionFunction(DI))
  DI.on('deletePermission', getDeletePermissionFunction(DI), {localEvent: true})
  // api.createPermission = getCreatePermissionFunction(DI)
  // api.readPermission = getReadPermissionFunction(DI)
  // api.deletePermission = getDeletePermissionFunction(DI)
  // api.updatePermission = getUpdatePermissionFunction(DI)
  // return api
}
