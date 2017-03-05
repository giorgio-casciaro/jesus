
if (!global._babelPolyfill)require('babel-polyfill')
// var R = require('ramda')
var deref = require('json-schema-deref-sync')
var faker = require('faker')
var jsf = require('json-schema-faker')
faker.locale = 'it'
var restler = require('restler')
var request = require('request')
var t = require('tap')
var path = require('path')
var CONSOLE = require('../jesus').getConsole({debug: true, log: true, error: true, warn: true},'BASE TEST', '----', '-----')
var jesus = require('../jesus')

t.test('*** SERVICES NET ***', {
//  autoend: true
}, async function mainTest (t) {
  var MS_RESOURCES = await require('./services/resources/start')()
  var MS_EVENTS_EMITTER = await require('./services/eventsEmitter/start')()
  var MS_AUTHORIZATIONS = await require('./services/authorizations/start')()
  var MS_LOGS = await require('./services/logs/start')()
  var MS_EVENTS_EMITTER_URL = `http://127.0.0.1:${MS_EVENTS_EMITTER.SHARED_CONFIG.httpPublicApiPort}/`

  await jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {})

  t.plan(6)

  async function resourceInsert (t, loops = 10, steps = 100) {
    var methodsConfig = require(path.join(__dirname, './shared/services/resources/methods.json'))
    var derefOptions = {baseFolder: path.join(__dirname, './shared/services/resources/'), failOnMissing: true}
    CONSOLE.debug('TEST', 'methodsConfig', methodsConfig)
    var baseUrl = `http://127.0.0.1:${MS_RESOURCES.SHARED_CONFIG.httpPublicApiPort}/`
    CONSOLE.debug('TEST', 'baseUrl', baseUrl)
    var schemaCreate = deref(methodsConfig.createResource.requestSchema, derefOptions)
    var schemaRead = deref(methodsConfig.readResource.requestSchema, derefOptions)
    var schemaUpdate = deref(methodsConfig.updateResource.requestSchema, derefOptions)
    var schemaDelete = deref(methodsConfig.deleteResource.requestSchema, derefOptions)

    CONSOLE.debug('json schema faker schema', derefOptions, {schemaCreate, schemaRead, schemaUpdate, schemaDelete})
    CONSOLE.debug('json schema faker schema examples', jsf(schemaCreate), jsf(schemaRead), jsf(schemaUpdate), jsf(schemaDelete),)
    var testDataToSend = []
    // await t.test('NO COMPRESSION', async function (t) {
    //   await new Promise((resolve, reject) => {
    //     restler.postJson(baseUrl + 'createResource').on('complete', function (dataResponse, response) {
    //       CONSOLE.debug('rebuildViews receive', response, dataResponse)
    //       resolve()
    //     })
    //   })
    //
    //   t.end()
    // })
    for (let i = 0; i < loops; i++) {
      // CONSOLE.group(`TEST RIGHT DATA ${i}`)
      // CONSOLE.group(`createResource`)
      var createdResponse
      var createRequest = jsf(schemaCreate)
      await new Promise((resolve, reject) => {
        CONSOLE.debug('send createRequest', JSON.stringify(createRequest))
        restler.postJson(baseUrl + 'createResource', createRequest).on('complete', function (dataResponse, response) {
          CONSOLE.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response createResource is object')
          t.type(dataResponse.id, 'string', 'Response createResource id is string ' + dataResponse.id)
          createdResponse = dataResponse
          resolve()
        })
      })
      if (steps === 1) continue
      // CONSOLE.groupEnd()
      // CONSOLE.group(`readResource From id`)
      await new Promise((resolve, reject) => {
        var data = {id: createdResponse.id, userId: 'test', token: 'test'}
        CONSOLE.debug('send', schemaRead, JSON.stringify(data))
        restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
          CONSOLE.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response readResource is object')
          t.same(dataResponse.body, createRequest.data.body, 'Response readResource  body as sended, id:' + dataResponse._id)
          resolve()
        })
      })
      // CONSOLE.groupEnd()
      // CONSOLE.group(`updateResource`)
      schemaUpdate.properties.data.required = ['body']
      var updateRequest = jsf(schemaUpdate)
      updateRequest.id = createdResponse.id
      await new Promise((resolve, reject) => {
        CONSOLE.debug('send', schemaUpdate, JSON.stringify(updateRequest))
        restler.postJson(baseUrl + 'updateResource', updateRequest).on('complete', function (dataResponse, response) {
          CONSOLE.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response updateResource is object')
          t.same(dataResponse.id, createdResponse.id, 'Response updateResource  id as sended, id:' + dataResponse.id)
          resolve()
        })
      })
      // CONSOLE.groupEnd()
      // CONSOLE.group(`readResource From data/_id`)
      await new Promise((resolve, reject) => {
        var data = {id: createdResponse.id, userId: 'test', token: 'test'}
        CONSOLE.debug('send', schemaRead, JSON.stringify(data))
        restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
          CONSOLE.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response readResource is object')
          t.same(dataResponse.body, updateRequest.data.body, 'Response readResource body as updated, id:' + dataResponse._id)
          resolve()
        })
      })
      // CONSOLE.groupEnd()
      // CONSOLE.groupEnd()
    }
  }

  console.log("http://127.0.0.1:1090/inspector")
  CONSOLE.debug('-------------------------------------- PREPARING -------------------------------------------')
  await new Promise((resolve) => setTimeout(resolve, 2000))

  CONSOLE.debug('-------------------------------------- TEST 0 - EVENTS_EMITTER chiamata allo streaming degli eventi  ------------------------------------------')
  var MS_EVENTS_EMITTER_requestHttp
  var MS_EVENTS_EMITTER_responseHttp

  await t.test('TEST 0', async function (t) {
    await new Promise((resolve, reject) => {
      MS_EVENTS_EMITTER_requestHttp = request(
        { method: 'GET',
          uri: MS_EVENTS_EMITTER_URL + 'listenEvents'
        })
      MS_EVENTS_EMITTER_requestHttp.on('response', function (response) {
        CONSOLE.debug('TEST HTTP STREAMING RESPONSE', response)
        MS_EVENTS_EMITTER_responseHttp = response
        resolve()
      })
      .on('error', function (error) {
        CONSOLE.debug('TEST HTTP STREAMING ERROR', error)
        reject()
      })
      .on('data', function (binData) {
        var dataString = binData.toString('utf8')
        CONSOLE.debug('TEST HTTP STREAMING DATA', dataString, MS_EVENTS_EMITTER_requestHttp)
      })
    })

    t.end()
  })
  CONSOLE.debug('-------------------------------------- PREPARING -------------------------------------------')
  await new Promise((resolve) => setTimeout(resolve, 1000))

  CONSOLE.debug('-------------------------------------- TEST 1 - Inserimento Dati (MS_VIEW spento)-------------------------------------------')
  await t.test('TEST 1 - Inserimento Dati (MS_VIEW spento)', async function (t) {
    await resourceInsert(t, 1)
    t.end()
  })
  //

  CONSOLE.debug('-------------------------------------- STOP -------------------------------------------')
  await new Promise((resolve) => setTimeout(resolve, 1000))

  CONSOLE.debug('-------------------------------------- PREPARING - accendo MS_VIEW-------------------------------------------')
  var MS_VIEW = await require('./services/view/start')()
  var MS_VIEW_URL = `http://127.0.0.1:${MS_VIEW.SHARED_CONFIG.httpPrivateApiPort}/`
  await new Promise((resolve) => setTimeout(resolve, 1000))

  CONSOLE.debug('-------------------------------------- TEST 2.1 - MS_VIEW rebuildViews (MS_VIEW dovrebbe recuperarei dati inseriti in precedenza)-------------------------------------------')
  await t.test('TEST 2.1', async function (t) {
    await new Promise((resolve, reject) => {
      CONSOLE.debug('send rebuildViews', MS_VIEW_URL + 'rebuildViews')
      restler.postJson(MS_VIEW_URL + 'rebuildViews').on('complete', function (dataResponse, response) {
        CONSOLE.debug('rebuildViews receive', response, dataResponse)
        resolve()
      })
    })
    t.end()
  })

  CONSOLE.debug('-------------------------------------- PREPARING - aggiungo evento viewsUpdated a MS_VIEW-------------------------------------------')
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {
    'viewsUpdated': {
      'method': 'viewsUpdated',
      'haveResponse': false
    }
  })
  await new Promise((resolve) => setTimeout(resolve, 1000))

  CONSOLE.debug('-------------------------------------- TEST 2.2 - Inserimento Dati (MS_VIEW acceso,dovrebbe aggiornarsi live)-------------------------------------------')

  await t.test('TEST 2.2', async function (t) {
    await resourceInsert(t, 5, 1)
    t.end()
  })

  await new Promise((resolve) => setTimeout(resolve, 5000))
  await jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {})
  await new Promise((resolve) => setTimeout(resolve, 1000))
  MS_VIEW.stop()

  CONSOLE.debug('-------------------------------------- STOP - MS_VIEW stopped------------------------------------------')
  await new Promise((resolve) => setTimeout(resolve, 5000))

  CONSOLE.debug('-------------------------------------- TEST 3 - Inserimento Dati (MS_VIEW stopped) -------------------------------------------')
  await t.test('TEST 3', async function (t) {
    await resourceInsert(t, 5, 1)
    t.end()
  })

  CONSOLE.debug('-------------------------------------- PREPARING - MS_VIEW starting-------------------------------------------')
  await MS_VIEW.start()
  await new Promise((resolve) => setTimeout(resolve, 1000))

  CONSOLE.debug('-------------------------------------- TEST 4 - MS_VIEW syncViews -------------------------------------------')
  await t.test('TEST 4', async function (t) {
    await new Promise((resolve, reject) => {
      CONSOLE.debug('send syncViews', MS_VIEW_URL + 'syncViews')
      restler.postJson(MS_VIEW_URL + 'syncViews').on('complete', function (dataResponse, response) {
        CONSOLE.debug('syncViews receive', response, dataResponse)
        resolve()
      })
    })

    t.end()
  })
  await new Promise((resolve) => setTimeout(resolve, 5000))
  MS_VIEW.stop()

  MS_RESOURCES.stop()
  MS_EVENTS_EMITTER.stop()
  MS_AUTHORIZATIONS.stop()
  MS_LOGS.stop()
  MS_VIEW.stop()
  MS_EVENTS_EMITTER_responseHttp.destroy()
  t.end()
  await new Promise((resolve) => setTimeout(resolve, 100000))
})
