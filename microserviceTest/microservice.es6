var R = require('ramda')
module.exports = async function startMicroservice (configOverwrite = {}) {
  var CONFIG = R.merge(require('./config'), configOverwrite)
  var SERVICE = require('../SERVICE.default')(CONFIG)

  var DI = {
    log: SERVICE.log,
    debug: SERVICE.debug,
    warn: SERVICE.warn,
    errorResponse: SERVICE.errorResponse,
    throwError: SERVICE.throwError,
    getRoutes: SERVICE.getRoutes,
    authorize: async function authorize () {
      return {
        'userId': 195151662661
      }
    }
  }
  var NET = await require('../net')(CONFIG, DI)
  DI.emitEvent = NET.emitEvent


  SERVICE.registerRoute({
    route: 'updateAutorizationsView',
    routeFunction: async function authorize ({entity, items, itemsIds}) {
      try {
        var storagePackage = await CONFIG.autorizationsView.storage(CONFIG.autorizationsView, DI)
        DI.warn({msg: `updateView`, debug: {meta, items, itemsIds}})
        items=R.map(CONFIG.autorizationsView.filterIncomingData, items)
        items=R.map(R.merge({'_entity': entity}), items)
        await storagePackage.update({
          queriesArray: R.map((itemId) => ({'_id': itemId}), itemsIds),
          dataArray: items,
          insertIfNotExists: true})
      } catch (error) {
        return DI.errorResponse({message: 'problems during updateAutorizationsView', originalError: error})
      }
    }})

  SERVICE.registerRoute({
    route: 'authorize',
    routeFunction: async function authorize ({action, entityName, itemsIds, meta}) {
      try {
        DI.warn({msg: `authorize`, debug: {action, entityName, itemsIds, meta}})
        return {
          userData: {'userId': '195151662661'}
        }
      } catch (error) {
        return DI.errorResponse({message: 'problems during authorize', originalError: error})
      }
    }})

  SERVICE.registerRoute({
    route: 'test',
    routeFunction: async function test ({meta, items, itemsIds}) {
      try {
        DI.warn({msg: `test`, context: 'SERVICE', debug: {items, itemsIds}})
        return {itemsIds}
      } catch (error) {
        return DI.errorResponse({message: 'problems during test', originalError: error})
      }
    }})

  var userPermissionBasePackage = await require('../entity.base')(CONFIG['UserPermission'], DI)

  SERVICE.registerRoute({
    route: 'updateUserPermission',
    routeFunction: async function updateUserPermissionRoute ({meta, items, itemsIds}) {
      try {
        ({items, itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({items, itemsIds, appendIdsToItems: true}))
        var filterProps = R.pickBy((val, key) => (key === '_id' || key.charAt(0) !== '_')) // remove items data starting with _ (exclude _id )
        items = R.map(filterProps, items)
        var userData = await DI.authorize({action: 'write.update', entityName: 'UserPermission', items, itemsIds, meta})
        await userPermissionBasePackage.update({items, itemsIds, userData})
        return {itemsIds}
      } catch (error) {
        return DI.errorResponse({message: 'Permission problems during update'})
      }
    }})
  SERVICE.registerRoute({
    route: 'deleteUserPermission',
    routeFunction: async function deleteUserPermissionRoute ({meta, itemsIds, items}) {
      try {
        ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({items, itemsIds}))
        items = R.map(() => ({'_deleted': true}), itemsIds)
        console.log({items})
        var userData = await DI.authorize({action: 'write.delete', entityName: 'UserPermission', items, itemsIds, meta})
        await userPermissionBasePackage.update({items, itemsIds, userData})
        return {itemsIds}
      } catch (error) {
        return DI.errorResponse({message: 'Permission problems during delete'})
      }
    }})

  SERVICE.registerRoute({
    route: 'readUserPermission',
    routeFunction: async function readUserPermissionRoute ({meta, items, itemsIds}) {
      try {
        ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({itemsIds}))
        var userData = await DI.authorize({action: 'read', entityName: 'UserPermission', items, itemsIds, meta})
        items = await userPermissionBasePackage.read({items, itemsIds, userData})
        return {items}
      } catch (error) {
        return DI.errorResponse({message: 'Permission problems during read'})
      }
    }})

  var userCqrsPackage = await require('../entity.cqrs')(CONFIG['User'], DI)

  SERVICE.registerRoute({
    route: 'createUser',
    routeFunction: async function createUserRoute ({meta, items, itemsIds}) {
      try {
        ({items, itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({items, itemsIds, generateIds: true, appendIdsToItems: true}))
        DI.debug({msg: `start createUserRoute()`, context: 'SERVICE', debug: {items, itemsIds}})
        var userData = await DI.authorize({action: 'write.create', entityName: 'User', items, itemsIds, meta})
        var addedMutations = await userCqrsPackage.mutate({items, itemsIds, mutation: 'create', userData})
        userCqrsPackage.refreshViews({itemsIds, loadSnapshot: false, loadMutations: false, addMutations: addedMutations}) // not await
        return {itemsIds}
      } catch (error) {
        return DI.errorResponse({message: 'problems during create', originalError: error})
      }
    }})

  SERVICE.registerRoute({
    route: 'updateUser',
    routeFunction: async function updateUserRoute ({meta, itemsIds, items}) {
      try {
        ({items, itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({items, itemsIds}))
        var filterProps = R.pickBy((val, key) => (key.charAt(0) !== '_')) // remove items data starting with _ ( _id , _deleted ecc)
        items = R.map(filterProps, items)
        var userData = await DI.authorize({action: 'write.update', entityName: 'User', items, itemsIds, meta})
        await userCqrsPackage.mutate({items, itemsIds, mutation: 'update', userData})
        await userCqrsPackage.refreshViews({itemsIds, loadSnapshot: true, loadMutations: true }) // not await
        return {itemsIds}
      } catch (error) {
        return DI.errorResponse({message: 'problems during update'})
      }
    }})
  SERVICE.registerRoute({
    route: 'deleteUser',
    routeFunction: async function deleteUserRoute ({meta, itemsIds, items}) {
      try {
        ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({itemsIds}))
        var userData = await DI.authorize({action: 'write.delete', entityName: 'User', itemsIds, meta})
        await userCqrsPackage.mutate({itemsIds, mutation: 'delete', userData})
        await userCqrsPackage.refreshViews({itemsIds, loadSnapshot: true, loadMutations: true }) // not await
        return {itemsIds}
      } catch (error) {
        return DI.errorResponse(error)
      }
    }})
  SERVICE.registerRoute({
    route: 'readUser',
    private: true,
    routeFunction: async function readUserRoute ({meta, itemsIds}) {
      try {
        ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({itemsIds}))
        var userData = await DI.authorize({action: 'read', entityName: 'User', itemsIds, meta})
        var items = await userCqrsPackage.read({itemsIds})
        console.log({itemsIds, items})
        return {items}
      } catch (error) {
        return DI.errorResponse(error)
      }
    }})

  SERVICE.apiGrpc = require('../api.grpc')(CONFIG, DI)
  await SERVICE.apiGrpc.start()

  SERVICE.apiRest = require('../api.rest')(CONFIG, DI)
  await SERVICE.apiRest.start()

  return {
    SERVICE,
    CONFIG,
    DI
  }
}
