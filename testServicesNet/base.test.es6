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

t.test('*** SERVICES NET ***', {
  autoend: true
}, async function mainTest (t) {
  var MS_RESOURCES = await require('./services/resources/start')()
  var MS_EVENTS_EMITTER = await require('./services/eventsEmitter/start')()
  var MS_AUTHORIZATIONS = await require('./services/authorizations/start')()
  var MS_LOGS = await require('./services/logs/start')()

  var MS_EVENTS_EMITTER_URL = `http://127.0.0.1:${MS_EVENTS_EMITTER.SHARED_CONFIG.httpPublicApiPort}/`

  t.plan(5)

  async function resourceInsert (t, loops = 10, steps = 100) {
    var methodsConfig = require(MS_RESOURCES.CONFIG.sharedServicePath + '/methods.json')
    var derefOptions = {baseFolder: MS_RESOURCES.CONFIG.sharedServicePath, failOnMissing: true}
    console.debug('TEST', 'methodsConfig', methodsConfig)
    var baseUrl = `http://127.0.0.1:${MS_RESOURCES.SHARED_CONFIG.httpPublicApiPort}/`
    console.debug('TEST', 'baseUrl', baseUrl)
    var schemaCreate = deref(methodsConfig.createResource.requestSchema, derefOptions)
    var schemaRead = deref(methodsConfig.readResource.requestSchema, derefOptions)
    var schemaUpdate = deref(methodsConfig.updateResource.requestSchema, derefOptions)
    var schemaDelete = deref(methodsConfig.deleteResource.requestSchema, derefOptions)

    console.debug('json schema faker schema', derefOptions, {schemaCreate, schemaRead, schemaUpdate, schemaDelete})
    console.debug('json schema faker schema examples', jsf(schemaCreate), jsf(schemaRead), jsf(schemaUpdate), jsf(schemaDelete),)
    var testDataToSend = []
    // await t.test('NO COMPRESSION', async function (t) {
    //   await new Promise((resolve, reject) => {
    //     restler.postJson(baseUrl + 'createResource').on('complete', function (dataResponse, response) {
    //       console.debug('rebuildViews receive', response, dataResponse)
    //       resolve()
    //     })
    //   })
    //
    //   t.end()
    // })
    for (let i = 0; i < loops; i++) {
      // console.group(`TEST RIGHT DATA ${i}`)
      // console.group(`createResource`)
      var createdResponse
      var createRequest = jsf(schemaCreate)
      await new Promise((resolve, reject) => {
        console.debug('send createRequest', JSON.stringify(createRequest))
        restler.postJson(baseUrl + 'createResource', createRequest).on('complete', function (dataResponse, response) {
          console.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response createResource is object')
          t.type(dataResponse.id, 'string', 'Response createResource id is string ' + dataResponse.id)
          createdResponse = dataResponse
          resolve()
        })
      })
      if (steps === 1) continue
      // console.groupEnd()
      // console.group(`readResource From id`)
      await new Promise((resolve, reject) => {
        var data = {id: createdResponse.id}
        console.debug('send', schemaRead, JSON.stringify(data))
        restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
          console.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response readResource is object')
          t.same(dataResponse.body, createRequest.data.body, 'Response readResource  body as sended, id:' + dataResponse._id)
          resolve()
        })
      })
      // console.groupEnd()
      // console.group(`updateResource`)
      schemaUpdate.properties.data.required = ['body']
      var updateRequest = jsf(schemaUpdate)
      updateRequest.id = createdResponse.id
      await new Promise((resolve, reject) => {
        console.debug('send', schemaUpdate, JSON.stringify(updateRequest))
        restler.postJson(baseUrl + 'updateResource', updateRequest).on('complete', function (dataResponse, response) {
          console.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response updateResource is object')
          t.same(dataResponse.id, createdResponse.id, 'Response updateResource  id as sended, id:' + dataResponse.id)
          resolve()
        })
      })
      // console.groupEnd()
      // console.group(`readResource From data/_id`)
      await new Promise((resolve, reject) => {
        var data = {data: {_id: createdResponse.id}}
        console.debug('send', schemaRead, JSON.stringify(data))
        restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
          console.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response readResource is object')
          t.same(dataResponse.body, updateRequest.data.body, 'Response readResource body as updated, id:' + dataResponse._id)
          resolve()
        })
      })
      // console.groupEnd()
      // console.groupEnd()
    }
  }

  console.debug('-------------------------------------- TEST 0 -------------------------------------------')
  await t.test('TEST 0', async function (t) {
    await new Promise((resolve, reject) => {
      request.get(MS_EVENTS_EMITTER_URL + 'listenEvents')
      .on('response', function (response) {
        console.debug('response received')
        resolve()
      })
      .on('error', function (error) {
        console.log('error', error)
        reject()
      })
      .on('data', function (binData) {
        var dataString = binData.toString('utf8')
        var data = JSON.parse(dataString.replace('data: ', ''))
        console.debug('TEST HTTP STREAMING DATA', data)
      })
    })
    t.end()
  })

  console.debug('-------------------------------------- PREPARING -------------------------------------------')
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.debug('-------------------------------------- TEST 1 -------------------------------------------')
  await t.test('TEST 1', async function (t) {
    await resourceInsert(t, 5)
    t.end()
  })

  console.debug('-------------------------------------- STOP -------------------------------------------')
  await new Promise((resolve) => setTimeout(resolve, 7000))

  console.debug('-------------------------------------- PREPARING -------------------------------------------')
  var MS_VIEW = await require('./services/view/start')()
  var MS_VIEW_URL = `http://127.0.0.1:${MS_VIEW.SHARED_CONFIG.httpPrivateApiPort}/`
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.debug('-------------------------------------- TEST 2 -------------------------------------------')
  await t.test('TEST 2', async function (t) {
    await new Promise((resolve, reject) => {
      console.debug('send rebuildViews', MS_VIEW_URL + 'rebuildViews')
      restler.postJson(MS_VIEW_URL + 'rebuildViews').on('complete', function (dataResponse, response) {
        console.debug('rebuildViews receive', response, dataResponse)
        resolve()
      })
    })

    t.end()
  })
  MS_VIEW.stop()

  console.debug('-------------------------------------- STOP -------------------------------------------')
  await new Promise((resolve) => setTimeout(resolve, 10000))

  console.debug('-------------------------------------- TEST 3 -------------------------------------------')
  await t.test('TEST 3', async function (t) {
    await resourceInsert(t, 5)
    t.end()
  })

  console.debug('-------------------------------------- PREPARING -------------------------------------------')
  await MS_VIEW.start()

  console.debug('-------------------------------------- TEST 4 -------------------------------------------')
  await t.test('TEST 4', async function (t) {
    await new Promise((resolve, reject) => {
      console.debug('send syncViews', MS_VIEW_URL + 'syncViews')
      restler.postJson(MS_VIEW_URL + 'syncViews').on('complete', function (dataResponse, response) {
        console.debug('syncViews receive', response, dataResponse)
        resolve()
      })
    })
    MS_VIEW.stop()
    t.end()
  })
  // MS_RESOURCES.stop()
  // MS_AUTHORIZATIONS.stop()
  // MS_LOGS.stop()
  // MS_VIEW.stop()
})
