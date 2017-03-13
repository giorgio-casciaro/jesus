
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
var CONSOLE = require('../jesus').getConsole(false,'BASE TEST', '----', '-----')
var jesus = require('../jesus')

t.test('*** SERVICES NET ***', {
//  autoend: true
}, async function mainTest (t) {
  var MS_RESOURCES = await require('./services/resources/start')()

  await jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {})

  t.plan(1)

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
        var data = {id: createdResponse.id, userid: 'test', token: 'test'}
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
        var data = {id: createdResponse.id, userid: 'test', token: 'test'}
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
  CONSOLE.debug('-------------------------------------- TEST 1 - Inserimento Dati (MS_VIEW spento)-------------------------------------------')
  await new Promise((resolve) => setTimeout(resolve, 5000))
  await t.test('TEST 1 - Inserimento Dati (MS_VIEW spento)', async function (t) {
    await resourceInsert(t, 1)
    t.end()
  })

  await new Promise((resolve) => setTimeout(resolve, 100000))


  MS_RESOURCES.stop()
  t.end()
})
