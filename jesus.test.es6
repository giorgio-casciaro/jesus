
if (!global._babelPolyfill) {
  require('babel-polyfill')
}
const throwError = require('./error').throwError
var t = require('tap')
var R = require('ramda')
var path = require('path')
const PACKAGE = 'jesus.test'
process.on('unhandledRejection', (reason, promise) => {
  console.log('unhandledRejection Reason: ', promise, reason)
  console.trace(promise)
})

var DEBUG = function (type, debug, msg = 'unknow', context = 'unknow') {
  const ANSI_RESET = '\u001B[0m'
  const ANSI_BLACK = '\u001B[30m'
  const ANSI_RED = '\u001B[31m'
  const ANSI_GREEN = '\u001B[32m'
  const ANSI_YELLOW = '\u001B[33m'
  const ANSI_BLUE = '\u001B[34m'
  const ANSI_PURPLE = '\u001B[35m'
  const ANSI_CYAN = '\u001B[36m'
  const ANSI_WHITE = '\u001B[37m'
  if (type === 'ERROR') {
    console.log(`${ANSI_RED}`)
  }
  if (type === 'WARNING') {
    console.log(`${ANSI_YELLOW}`)
  }
  if (type === 'LOG') {
    console.log(`${ANSI_GREEN}`)
  }
  if (type === 'DEBUG') {
    console.log(`${ANSI_CYAN}`)
  }
  console.log(`${type} ${context} > ${msg} ${ANSI_RESET}`)
  console.log(debug)
  // console.log(JSON.stringify(arguments).substring(0, 250))
}
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

  // validateEntity: (payload) => new Promise((resolve, reject) => {
  //   LOG('LOG', payload)
  //   resolve(true)
  // }),
  // getEntitySchema: (payload) => new Promise((resolve, reject) => {
  //   LOG('LOG', payload)
  //   resolve(true)
  // })

}
function setPackageArgsOverwrite () {
  var overwriteArgs = Array.prototype.slice.call(arguments, 1)
  var originalPackage = arguments[0]
  var modifiedPackage = {}
  for (var i in originalPackage) {
    modifiedPackage[i] = function packageArgsOverwrite () {
      var modifiedArguments = Object.assign(arguments, overwriteArgs)
      return originalPackage[i].apply(this, modifiedArguments)
    }
  }
  return modifiedPackage
}
t.test('*** JESUS SERVICE CRUD ***', {
  autoend: true
}, async function mainTest (t) {
  t.plan(1)
  await t.test('*** JESUS SERVICE CRUD 1 ***', async function (t) {
    try {
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
        // SHARED FUNCTIONS
        // var optionsStorage = jesus.getStoragePackage(CONFIG.optionsStorage, CONFIG.items.entityTest.optionsStorageCollection)

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

      async function createEntityTest (request) {
        try {
          const uuidV4 = require('uuid/v4')
          var items = request.items
          if (!items || !items.length) throw new Error('createEntityTest require items')
          items.forEach((item) => { if (!item._id)item._id = uuidV4() }) // ID AUTOGENERATED IF NOT INCLUDED
          await entityTestDI.validate({items})
          var authorizationsData = await DI.authenticate({request})
          await DI.authorize({context: authorizationsData, action: 'write', entity: 'entityTest', items})
          var itemsIds = R.map(R.prop('_id'), items)
          var itemsMutation = await entityTestDI.mutationsPackage.mutate({mutation: 'create', itemsIds, items})

          await entityTestDI.viewsPackage.refreshItemsViews({itemsIds, loadSnapshot: false, itemsMutations: [itemsMutation]})
          return {itemsIds}
            // DI.log({context: 'packageName', name: 'createEntityTest', log: {ids}})
        } catch (error) {
          DI.throwError('createEntityTest', error, request)
        }
      }
      DI.registerRoute({route: 'createEntityTest', routeFunction: createEntityTest})
      DI.registerEvent({event: 'createEntityTest', route: 'createEntityTest'})
      var createEntityTestRequest = {
        items: [{name: 'test'}]
      }
      try {
        var response=await DI.callRoute({route: 'createEntityTest', request: createEntityTestRequest})
        t.type(response, 'object')
        t.type(response.itemsIds, 'Array')
        t.type(response.itemsIds.length, 1)
      } catch (error) {
        DI.throwError('DI.callRoute createEntityTest', error, {route: 'createEntityTest', request: createEntityTestRequest})
      }

        // var entityTestDI = {
        //   validate: entityTestValidate,
        //   mutationsPackage: entityTestMutationsPackage,
        //   viewsPackage: entityTestMainViewPackage
        // }
        //
        // var entityTest_crud = require('./service.crud')
        // entityTest_crud(R.merge(entityTestDI, DI), {})
      LOG('RESOLVE TEST 1', {SERVICE})
      t.end()
    } catch (error) {
      // throw error
      DI.error({error})
      LOG('REJECT TEST 1')
      // t.fail('FAIL deleteentityTest')
      t.end('FAIL deleteentityTest')
    }
      // SERVICE_API.deleteentityTest({
      //   ids: testentityTestsIds
      // }, function (result) {
      //   LOG('RESOLVE deleteentityTest', result)
      //   // t.pass('PASS deleteentityTest')
      //   t.end()
      // }, function (error) {
      //   LOG('REJECT deleteentityTest', error)
      //   t.fail('FAIL deleteentityTest')
      //   t.end('FAIL deleteentityTest')
      // })
  })
    //
    // await t.test('*** SERVICE.createentityTest ***', function (t) {
    //   SERVICE_API.createentityTest({
    //     items: testentityTests
    //   }, function (result) {
    //     LOG('RESOLVE createentityTest', result)
    //     // t.pass('PASS createentityTest')
    //     t.end()
    //   }, function (error) {
    //     LOG('REJECT createentityTest', error)
    //     t.fail('FAIL createentityTest')
    //     t.end()
    //   })
    // })
    // //
    // await t.test('*** SERVICE.createentityTest try to reinsert same ids***', function (t) {
    //   SERVICE_API.createentityTest({
    //     items: testentityTests
    //   }, function (result) {
    //     LOG('RESOLVE createentityTest', result)
    //     t.fail('FAIL createentityTest')
    //     t.end()
    //   }, function (error) {
    //     LOG('REJECT createentityTest', error)
    //     t.end()
    //   })
    // })
    //
    // await t.test('*** SERVICE.readentityTest ***', function (t) {
    //   SERVICE_API.readentityTest({
    //     ids: testentityTestsIds
    //   }, function (result) {
    //     LOG('RESOLVE readentityTest', result)
    //     t.end()
    //   }, function (error) {
    //     LOG('REJECT readentityTest', error)
    //     t.fail('FAIL readentityTest')
    //     t.end()
    //   })
    // })
    //
    // await t.test('*** SERVICE.updateentityTest ***', function (t) {
    //   SERVICE_API.updateentityTest({
    //     items: testentityTests
    //   }, function (result) {
    //     LOG('RESOLVE updateentityTest', result)
    //     t.end('RESOLVE updateentityTest')
    //   }, function (error) {
    //     LOG('REJECT updateentityTest', error)
    //     t.fail('FAIL updateentityTest')
    //     t.end()
    //   })
    // })
  // t.end()
  // process.exit(0)
})
