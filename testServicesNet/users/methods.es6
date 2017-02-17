var entityCqrs = require('../../entity.cqrs')
var jesus = require('../../jesus')
const uuidV4 = require('uuid/v4')
var LOG = console
process.on('unhandledRejection', (reason, promise) => LOG.error('unhandledRejection Reason: ', promise, reason))

var CONFIG = require('./config')
const PACKAGE = 'service.users'

const getAllServicesConfig = (schema) => jesus.getAllServicesConfigFromDir(CONFIG.sharedServicesPath, schema)
const validateApiRequest = (apiMethod, data) => jesus.validateApiFromConfig(CONFIG.sharedServicePath + '/api.json', apiMethod, data, 'requestSchema')
const validateApiResponse = (apiMethod, data) => jesus.validateApiFromConfig(CONFIG.sharedServicePath + '/api.json', apiMethod, data, 'responseSchema')

const NET_CLIENT_ARGS = {getAllServicesConfig, sharedServicePath: CONFIG.sharedServicePath}
var netClient = require('../../net.client')(NET_CLIENT_ARGS)

module.exports = {
  async  test (test) {
    try {
      return test
    } catch (error) {
      return LOG.error({message: 'problems during test', originalError: error})
    }
  },
  async  createUser ({meta, data, id}) {
    try {
      LOG.profile("createUser")
      LOG.debug(PACKAGE, `start createUser()`, {meta, data, id})
      validateApiRequest('createUser', {meta, data, id})
      data._id = id = id || data._id || uuidV4() // generate id if necessary
      var cqrs = await entityCqrs(require('./config.User'))
      var userData = await netClient.emit('authorize', {action: 'write.create', entityName: 'User', meta, data, id})
      var addedMutation = await cqrs.mutationsPackage.mutate({data, objId: id, mutation: 'create', userData})
      cqrs.viewsPackage.refreshViews({objIds: [id], loadSnapshot: false, loadMutations: false, addMutations: [addedMutation]}) // not await
      LOG.profileEnd("createUser")
      return validateApiResponse('createUser', {id})
    } catch (error) {
      LOG.warn(PACKAGE, 'problems during create', error)
      return {error: 'problems during create', originalError: error}
    }
  },
  async  updateUser ({meta, data, id}) {
    try {
      LOG.debug(PACKAGE, `start updateUser()`, {meta, data, id})
      validateApiRequest('updateUser', {meta, data, id})
      data._id = id = id || data._id
      var cqrs = await entityCqrs(require('./config.User'))
      var userData = await netClient.emit('authorize', {action: 'write.update', entityName: 'User', meta, data, id})
      var addedMutation = await cqrs.mutationsPackage.mutate({data, objId: id, mutation: 'update', userData})
      cqrs.viewsPackage.refreshViews({objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation]}) // not await
      return validateApiResponse('updateUser', {id})
    } catch (error) {
      LOG.warn(PACKAGE, 'problems during update', error)
      return {error: 'problems during update', originalError: error}
    }
  },
  async  deleteUser ({meta, data, id}) {
    try {
      LOG.debug(PACKAGE, `start deleteUser()`, {meta, data, id})
      validateApiRequest('deleteUser', {meta, data, id})
      data._id = id = id || data._id
      var cqrs = await entityCqrs(require('./config.User'))
      var userData = await netClient.emit('authorize', {action: 'write.delete', entityName: 'User', meta, data, id})
      var addedMutation = await cqrs.mutationsPackage.mutate({data, objId: id, mutation: 'delete', userData})
      cqrs.viewsPackage.refreshViews({objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation]}) // not await
      return validateApiResponse('deleteUser', {id})
    } catch (error) {
      LOG.warn(PACKAGE, 'problems during delete', error)
      return {error: 'problems during delete', originalError: error}
    }
  },
  async  readUser ({meta, data, id}) {
    try {
      LOG.debug(PACKAGE, `start readUser()`, {meta, data, id})
      validateApiRequest('readUser', {meta, data, id})
      id = id || data._id
      var cqrs = await entityCqrs(require('./config.User'))
      var viewsResult = await cqrs.viewsPackage.get({ids: [id]})
      LOG.debug(PACKAGE, `readUser viewsResult`, viewsResult)
      if (viewsResult.length !== 1) throw `id: ${id} Item Not Founded`
      var userData = await netClient.emit('authorize', {action: 'read', entityName: 'User', meta, data, id})
      return validateApiResponse('readUser', viewsResult[0])
    } catch (error) {
      LOG.warn(PACKAGE, 'problems during read', error)
      return {error: 'problems during read', originalError: error}
    }
  },
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

// var CONFIG = R.merge(require('./config'), configOverwrite)
// var userPermissionBasePackage = await require('../entity.base')(CONFIG['UserPermission'], DI)
// var userCqrsPackage = await require('../entity.cqrs')(CONFIG['User'], DI)
// module.exports = {
//   async updateAutorizationsView ({entity, items, itemsIds}) {
//     try {
//       var storagePackage = await CONFIG.autorizationsView.storage(CONFIG.autorizationsView, DI)
//       DI.warn({msg: `updateView`, debug: {meta, items, itemsIds}})
//       items = R.map(CONFIG.autorizationsView.filterIncomingData, items)
//       items = R.map(R.merge({'_entity': entity}), items)
//       await storagePackage.update({
//         queriesArray: R.map((itemId) => ({'_id': itemId}), itemsIds),
//         dataArray: items,
//         insertIfNotExists: true})
//     } catch (error) {
//       return DI.errorResponse({message: 'problems during updateAutorizationsView', originalError: error})
//     }
//   },
//   async  authorize ({action, entityName, itemsIds, meta}) {
//     try {
//       // DI.warn({msg: `authorize`, debug: {action, entityName, itemsIds, meta}})
//       return {
//         userData: {'userId': '195151662661'}
//       }
//     } catch (error) {
//       return DI.errorResponse({message: 'problems during authorize', originalError: error})
//     }
//   },
//   async  test (test) {
//     try {
//       return test
//     } catch (error) {
//       return DI.errorResponse({message: 'problems during test', originalError: error})
//     }
//   },
//   async  updateUserPermissionRoute ({meta, items, itemsIds}) {
//     try {
//       ({items, itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({items, itemsIds, appendIdsToItems: true}))
//       var filterProps = R.pickBy((val, key) => (key === '_id' || key.charAt(0) !== '_')) // remove items data starting with _ (exclude _id )
//       items = R.map(filterProps, items)
//       var userData = await DI.authorize({action: 'write.update', entityName: 'UserPermission', items, itemsIds, meta})
//       await userPermissionBasePackage.update({items, itemsIds, userData})
//       return {itemsIds}
//     } catch (error) {
//       return DI.errorResponse({message: 'Permission problems during update'})
//     }
//   },
//
//   async  deleteUserPermissionRoute ({meta, itemsIds, items}) {
//     try {
//       ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({items, itemsIds}))
//       items = R.map(() => ({'_deleted': true}), itemsIds)
//       // console.log({items})
//       var userData = await DI.authorize({action: 'write.delete', entityName: 'UserPermission', items, itemsIds, meta})
//       await userPermissionBasePackage.update({items, itemsIds, userData})
//       return {itemsIds}
//     } catch (error) {
//       return DI.errorResponse({message: 'Permission problems during delete'})
//     }
//   },
//   async  readUserPermissionRoute ({meta, items, itemsIds}) {
//     try {
//       ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({itemsIds}))
//       var userData = await DI.authorize({action: 'read', entityName: 'UserPermission', items, itemsIds, meta})
//       items = await userPermissionBasePackage.read({items, itemsIds, userData})
//       return {items}
//     } catch (error) {
//       return DI.errorResponse({message: 'Permission problems during read'})
//     }
//   },

//   async  deleteUserRoute ({meta, itemsIds, items}) {
//     try {
//       ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({itemsIds}))
//       var userData = await DI.authorize({action: 'write.delete', entityName: 'User', itemsIds, meta})
//       await userCqrsPackage.mutate({itemsIds, mutation: 'delete', userData})
//       await userCqrsPackage.refreshViews({itemsIds, loadSnapshot: true, loadMutations: true }) // not await
//       return {itemsIds}
//     } catch (error) {
//       return DI.errorResponse(error)
//     }
//   },
//   async  readUserRoute ({meta, itemsIds}) {
//     try {
//       ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({itemsIds}))
//       var userData = await DI.authorize({action: 'read', entityName: 'User', itemsIds, meta})
//       var items = await userCqrsPackage.read({itemsIds})
//       // console.log({itemsIds, items})
//       return {items}
//     } catch (error) {
//       return DI.errorResponse(error)
//     }
//   }}
