
if (!global._babelPolyfill) {
  require('babel-polyfill')
}
const throwError = require('./error').throwError
var t = require('tap')
var R = require('ramda')
var path = require('path')
var fs = require('fs')
const PACKAGE = 'jesus.test'
process.on('unhandledRejection', (reason, promise) => {
  console.log('unhandledRejection Reason: ', promise, reason)
  console.trace(promise)
})
var debugActive = false
var debugSaveTimeout
var debugFile = path.join(__dirname, 'testMaterial/debug', PACKAGE + '.json')
var debugRegistry = []
function save_debug () {

}
var DEBUG = function (type, debug, msg = 'unknow', context = 'unknow') {
  if (!debugActive) return null
  debugRegistry.push({
    [`${type} ${context} > ${msg}`]: debug
  })
  if (debugSaveTimeout) clearTimeout(debugSaveTimeout)
  debugSaveTimeout = setTimeout(function () {
    fs.writeFile(debugFile, JSON.stringify(debugRegistry, null, 4), 'utf8')
  }, 1000)
}
// var DEBUG = function (type, debug, msg = 'unknow', context = 'unknow') {
//   if (!debugActive) return null
//   const ANSI_RESET = '\u001B[0m'
//   const ANSI_BLACK = '\u001B[30m'
//   const ANSI_RED = '\u001B[31m'
//   const ANSI_GREEN = '\u001B[32m'
//   const ANSI_YELLOW = '\u001B[33m'
//   const ANSI_BLUE = '\u001B[34m'
//   const ANSI_PURPLE = '\u001B[35m'
//   const ANSI_CYAN = '\u001B[36m'
//   const ANSI_WHITE = '\u001B[37m'
//   if (type === 'ERROR') console.log(`${ANSI_RED}`)
//   if (type === 'WARNING') console.log(`${ANSI_YELLOW}`)
//   if (type === 'LOG') console.log(`${ANSI_GREEN}`)
//   if (type === 'DEBUG') console.log(`${ANSI_CYAN}`)
//   console.log(`${type} ${context} > ${msg} ${ANSI_RESET}`)
//   console.log(debug)
//   // console.log(JSON.stringify(arguments).substring(0, 250))
// }
var LOG = function (type, log, msg = 'unknow', context = 'unknow') {
  const ANSI_RESET = '\u001B[0m'
  const ANSI_BLACK = '\u001B[30m'
  const ANSI_BACKGROUND_CYAN = '\u001B[46m'
  console.log(`${ANSI_BACKGROUND_CYAN + ANSI_BLACK}`)
  console.log(`LOG --> ${type} ${context} > ${msg} ${ANSI_RESET}`)
  DEBUG(type, log, msg, context)
}

var SERVICE
var SERVICE_NAME = 'testService'
var fakeAuth = {
  userId: '195151662661'
}

var DI = {
  throwError,
  authenticate: async({request}) => fakeAuth,
  authorize: async({route, request}) => true,
  // getEvents: (payload) => new Promise((resolve, reject) => {
  //   resolve(SERVICE.events)
  // }),
  // getConfig: (payload) => new Promise((resolve, reject) => {
  //   resolve(config)
  // }),
  registerRoute: async({route, routeFunction}) => SERVICE.routes[route] = routeFunction,
  callRoute: async({route, request}) => SERVICE.routes[route](request),
  deregisterRoute: async({route}) => SERVICE.routes[route](request),
  deregisterRoute: async({route}) => delete SERVICE.routes[route],
  registerEvent: async({name, route}) => {
    SERVICE.events[name] = {
      name,
      route,
      service: SERVICE_NAME
    }
  },
  deregisterEvent: async({name}) => delete SERVICE.events[event],
  emitEvent: async({name, payload}) => {

  },
  log: async({context, msg, log, type}) => LOG(type, log, msg, context),
  debug: async({context, msg, debug}) => DEBUG('DEBUG', debug, msg, context),
  error: async({error}) => {
    const ANSI_RESET = '\u001B[0m'
    const ANSI_RED = '\u001B[31m'
    console.log(`${ANSI_RED} ORIGINAL ERROR ${ANSI_RESET}`)
    console.log(error.originalError || error)
    console.log(`APP ERROR --> ${error.info && error.info.message ? error.info.message : 'unknow'}`)
    console.log(`${ANSI_RED} APP TRACE ${ANSI_RESET}`)
    if (error.getAppTrace)console.log(JSON.stringify(error.getAppTrace(), null, 4))
    // if (error.toString)console.log(JSON.stringify(error.toString(), null, 4))
    LOG('ERROR', error, 'jesus-test', 'APP-ERROR')
  }
}

t.test('*** JESUS SERVICE CRUD ***', {
  autoend: true
}, async function mainTest (t) {
  SERVICE = {
    routes: {},
    config: {
      mainStorage: {
        type: 'inmemory',
        config: {
          path: path.join(__dirname, 'testMaterial/fileDb')
        }
      }
    },
    events: {}
  }

  var storagePackage = require('./storage')

  var entityTestConfig = {
    storageType: () => SERVICE.config.mainStorage.type,
    storageConfig: () => SERVICE.config.mainStorage.config,
    mutationsPath: () => path.join(__dirname, 'testMaterial/entityTest/mutations'),
    mutationsCollection: () => path.join(__dirname, 'testMaterial/entityTest/mutations'),
    viewsSnapshotsMaxMutations: () => 10,
    validationSchema: () => {
      try {
        return require('./testMaterial/entityTest/entity.schema.json')
      } catch (error) {
        DI.throwError('entityTestConfig validationSchema() ', error)
      }
    },
    validationType: () => 'jsonSchema'
  }
  var entityTestDI = R.merge({
    mutationsStoragePackage: storagePackage(R.merge(entityTestConfig, {
      storageCollection: () => 'entityTestMutations'
    }), DI),
    viewsStoragePackage: storagePackage(R.merge(entityTestConfig, {
      storageCollection: () => 'entityTestViewsMain'
    }), DI),
    throwError: DI.throwError,
    viewsSnapshotsStoragePackage: storagePackage(R.merge(entityTestConfig, {
      storageCollection: () => 'entityTestViewsMainSnapshots'
    }), DI)
  }, DI)
  entityTestDI.mutationsPackage = await require('./mutations.cqrs')(entityTestConfig, entityTestDI)
  entityTestDI.viewsPackage = await require('./views.cqrs')(entityTestConfig, entityTestDI)
  entityTestDI.validate = await require('./validate')(entityTestConfig, entityTestDI)

  global.serviceResponse = {}
  t.plan(4)
  await t.test('-> CRUD CREATE', async function (t) {
    try {
      var createEntityTest = async function (request) {
        try {
          const uuidV4 = require('uuid/v4')
          var items = request.items
          if (!items || !items.length) throw new Error('createEntityTest require items')
          items.forEach((item) => { if (!item._id)item._id = uuidV4() }) // ID AUTOGENERATED IF NOT INCLUDED
          await entityTestDI.validate({items})
          var authorizationsData = await DI.authenticate({request})
          await DI.authorize({context: authorizationsData, action: 'write', entity: 'entityTest', items})
          var itemsIds = R.map(R.prop('_id'), items)
          var itemsMutations = await entityTestDI.mutationsPackage.mutate({mutation: 'create', itemsIds, items})
          DI.debug({msg: 'createEntityTest', context: PACKAGE, debug: {itemsMutations}})
          await entityTestDI.viewsPackage.refreshItemsViews({itemsIds, loadSnapshot: false, loadMutations: false, addMutations: itemsMutations})
          return {itemsIds}
            // DI.log({context: 'packageName', name: 'createEntityTest', log: {ids}})
        } catch (error) {
          DI.throwError('createEntityTest', error, request)
        }
      }
      DI.registerRoute({route: 'createEntityTest', routeFunction: createEntityTest})
      DI.registerEvent({event: 'createEntityTest', route: 'createEntityTest'})
      var createEntityTestRequest = {
        items: [{name: 'test'}, {name: 'test2'}]
      }
      try {
        global.serviceResponse = await DI.callRoute({route: 'createEntityTest', request: createEntityTestRequest})
        t.type(global.serviceResponse, 'object', 'Response is object')
        t.type(global.serviceResponse.itemsIds, 'Array', 'itemsIds is array')
        t.type(global.serviceResponse.itemsIds.length, 2, 'itemsIds length is 2')
      } catch (error) {
        DI.throwError('DI.callRoute createEntityTest', error, {route: 'createEntityTest', request: createEntityTestRequest})
      }

      t.end()
    } catch (error) {
      DI.error({error})
      t.fail('FAIL createEntityTest')
      t.end('FAIL createEntityTest')
    }
  })
  await t.test('-> CRUD UPDATE', async function (t) {
    try {
      var updateEntityTest = async function (request) {
        try {
          var items = request.items
          if (!items || !items.length) throw new Error('updateEntityTest require items')
          items.forEach((item) => { if (!item._id) throw new Error('updateEntityTest items _id field is required') }) // ID NEEDED
          await entityTestDI.validate({items})
          var authorizationsData = await DI.authenticate({request})
          await DI.authorize({context: authorizationsData, action: 'write', entity: 'entityTest', items})
          var itemsIds = R.map(R.prop('_id'), items)
          var itemsMutations = await entityTestDI.mutationsPackage.mutate({mutation: 'update', itemsIds, items})
          DI.debug({msg: 'updateEntityTest', context: PACKAGE, debug: {itemsMutations}})
          await entityTestDI.viewsPackage.refreshItemsViews({itemsIds, loadSnapshot: true, loadMutations: true, addMutations: itemsMutations})
          return {itemsIds}
            // DI.log({context: 'packageName', name: 'updateEntityTest', log: {ids}})
        } catch (error) {
          DI.throwError('updateEntityTest', error, request)
        }
      }
      DI.registerRoute({route: 'updateEntityTest', routeFunction: updateEntityTest})
      DI.registerEvent({event: 'updateEntityTest', route: 'updateEntityTest'})
      var updateEntityTestRequest = {
        items: [{name: 'testupdate', _id: global.serviceResponse.itemsIds[0] }, {name: 'testupdate2', _id: global.serviceResponse.itemsIds[1] }]
      }
      try {
        global.serviceResponse = await DI.callRoute({route: 'updateEntityTest', request: updateEntityTestRequest})
        t.type(global.serviceResponse, 'object', 'Response is object')
        t.type(global.serviceResponse.itemsIds, 'Array', 'itemsIds is array')
        t.type(global.serviceResponse.itemsIds.length, 2, 'itemsIds length is 2')
      } catch (error) {
        DI.throwError('DI.callRoute updateEntityTest', error, {route: 'updateEntityTest', request: updateEntityTestRequest})
      }

      t.end()
    } catch (error) {
      DI.error({error})
      t.fail('FAIL updateEntityTest')
      t.end('FAIL updateEntityTest')
    }
  })
  await t.test('-> CRUD READ', async function (t) {
    try {
      var readEntityTest = async function (request) {
        try {
          var itemsIds = request.ids
          if (!itemsIds || !itemsIds.length) throw new Error('readEntityTest require items ids')
          var authorizationsData = await DI.authenticate({request})
          await DI.authorize({context: authorizationsData, action: 'read', entity: 'entityTest', itemsIds})
          var items = await entityTestDI.viewsPackage.get({ids: itemsIds})
          DI.debug({msg: 'readEntityTest', context: PACKAGE, debug: {itemsIds, authorizationsData, items}})
          return {items}
            // DI.log({context: 'packageName', name: 'readEntityTest', log: {ids}})
        } catch (error) {
          DI.throwError('readEntityTest', error, request)
        }
      }
      DI.registerRoute({route: 'readEntityTest', routeFunction: readEntityTest})
      DI.registerEvent({event: 'readEntityTest', route: 'readEntityTest'})
      var readEntityTestRequest = {
        ids: global.serviceResponse.itemsIds
      }
      try {
        global.serviceResponse = await DI.callRoute({route: 'readEntityTest', request: readEntityTestRequest})
        t.type(global.serviceResponse, 'object', 'Response is object')
        t.type(global.serviceResponse.items, 'Array', 'items is array')
        t.type(global.serviceResponse.items.length, 2, 'items length is 2')
        t.equal(global.serviceResponse.items[0].name, 'testupdate', 'item 1 : sended name = readed name')
        t.equal(global.serviceResponse.items[1].name, 'testupdate2', 'item 2 : sended name = readed name')
      } catch (error) {
        DI.throwError('DI.callRoute readEntityTest', error, {route: 'readEntityTest', request: readEntityTestRequest})
      }

      t.end()
    } catch (error) {
      DI.error({error})
      t.fail('FAIL readEntityTest')
      t.end('FAIL readEntityTest')
    }
  })
  debugActive = true
  await t.test('-> CRUD DELETE', async function (t) {
    try {
      var deleteEntityTest = async function (request) {
        try {
          var itemsIds = request.ids
          if (!itemsIds || !itemsIds.length) throw new Error('deleteEntityTest require items ids')
          var authorizationsData = await DI.authenticate({request})
          await DI.authorize({context: authorizationsData, action: 'write', entity: 'entityTest', itemsIds})
          var itemsMutations = await entityTestDI.mutationsPackage.mutate({mutation: 'delete', itemsIds})
          await entityTestDI.viewsPackage.refreshItemsViews({itemsIds, loadSnapshot: true, loadMutations: true, addMutations: itemsMutations})
          DI.debug({msg: 'deleteEntityTest', context: PACKAGE, debug: {itemsIds, itemsMutations}})
          return {itemsIds}
            // DI.log({context: 'packageName', name: 'deleteEntityTest', log: {ids}})
        } catch (error) {
          DI.throwError('deleteEntityTest', error, request)
        }
      }
      DI.registerRoute({route: 'deleteEntityTest', routeFunction: deleteEntityTest})
      DI.registerEvent({event: 'deleteEntityTest', route: 'deleteEntityTest'})
      var deleteEntityTestRequest = {
        ids: [global.serviceResponse.items[0]._id]
      }
      try {
        global.serviceResponse = await DI.callRoute({route: 'deleteEntityTest', request: deleteEntityTestRequest})
        t.type(global.serviceResponse, 'object', 'Response is object')
        t.type(global.serviceResponse.itemsIds, 'Array', 'items is array')
        t.type(global.serviceResponse.itemsIds.length, 1, 'items length is 1')
      } catch (error) {
        DI.throwError('DI.callRoute deleteEntityTest', error, {route: 'deleteEntityTest', request: deleteEntityTestRequest})
      }

      t.end()
    } catch (error) {
      DI.error({error})
      t.fail('FAIL deleteEntityTest')
      t.end('FAIL deleteEntityTest')
    }
  })
})
