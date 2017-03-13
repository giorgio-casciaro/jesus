if (!global._babelPolyfill)require('babel-polyfill')
var restler = require('restler')
var jesus = require('../jesus')
var path = require('path')
async function resourceInsert (loops = 10, steps = 10, baseUrl, createRequest, updateRequest) {
  for (let i = 0; i < loops; i++) {
    var createdResponse, readResponse, updateResponse
    await new Promise((resolve, reject) => {
      restler.postJson(baseUrl + 'createResource', createRequest).on('complete', function (dataResponse, response) {
        createdResponse = dataResponse
        resolve()
      })
    })
    if (steps === 1) continue
    await new Promise((resolve, reject) => {
      restler.postJson(baseUrl + 'readResource', {id: createdResponse.id, userid: 'test', token: 'test'}).on('complete', function (dataResponse, response) {
        readResponse = dataResponse
        resolve()
      })
    })
    if (steps === 2) continue
    updateRequest.id = createdResponse.id
    await new Promise((resolve, reject) => {
      restler.postJson(baseUrl + 'updateResource', updateRequest).on('complete', function (dataResponse, response) {
        updateResponse = dataResponse
        resolve()
      })
    })
    if (steps === 3) continue
    await new Promise((resolve, reject) => {
      restler.postJson(baseUrl + 'deleteResource', {id: createdResponse.id, userid: 'test', token: 'test'}).on('complete', function (dataResponse, response) {
        readResponse = dataResponse
        resolve()
      })
    })
  }
}
async function start () {
  var MS_RESOURCES = await require('./services/resources/start')()
  var MS_EVENTS_EMITTER = await require('./services/eventsEmitter/start')()
  var MS_VIEW = await require('./services/view/start')()
  var MS_AUTHORIZATIONS = await require('./services/authorizations/start')()
  var MS_LOGS = await require('./services/logs/start')()
  await new Promise((resolve) => setTimeout(resolve, 5000))
  var MS_EVENTS_EMITTER_URL = `http://127.0.0.1:${MS_EVENTS_EMITTER.SHARED_CONFIG.httpPublicApiPort}/`

  var baseUrl = `http://127.0.0.1:${MS_RESOURCES.SHARED_CONFIG.httpPublicApiPort}/`
  var createRequest = {data: {title: '123456', body: '123456', email: '123456@vopa.it'}, userid: 'test', token: 'test'}
  var updateRequest = {data: {title: '789456', body: '789456', email: '789456@vopa.it'}, userid: 'test', token: 'test'}
  console.profile('processPixels()')
  await resourceInsert(1, 1, baseUrl, createRequest, updateRequest)
  console.profileEnd()
  await new Promise((resolve) => setTimeout(resolve, 3000))
  MS_RESOURCES.stop()
  MS_EVENTS_EMITTER.stop()
  MS_AUTHORIZATIONS.stop()
  MS_LOGS.stop()
  //MS_VIEW.stop()
}
start()
