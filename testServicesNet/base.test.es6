if (!global._babelPolyfill)require('babel-polyfill')
// var R = require('ramda')
var deref = require('json-schema-deref-sync')
var faker = require('faker')
var jsf = require('json-schema-faker')
faker.locale = 'it'
var request = require('restler')
var t = require('tap')
var path = require('path')

t.test('*** SERVICES NET ***', {
  autoend: true
}, async function mainTest (t) {
  var MS_USERS = await require('./users/start')()

  await t.test('NO COMPRESSION', async function (t) {
    var apiConfig = require('./shared/services/users/api.json')
    var derefOptions = {baseFolder: path.join(__dirname + '/shared/services/users/'), failOnMissing: true}

    var schemaCreate = deref(apiConfig.createUser.requestSchema, derefOptions)
    var schemaRead = deref(apiConfig.readUser.requestSchema, derefOptions)
    var schemaUpdate = deref(apiConfig.updateUser.requestSchema, derefOptions)
    var schemaDelete = deref(apiConfig.deleteUser.requestSchema, derefOptions)

    console.debug('json schema faker schema', derefOptions, {schemaCreate, schemaRead, schemaUpdate, schemaDelete})
    console.debug('json schema faker schema examples', jsf(schemaCreate), jsf(schemaRead), jsf(schemaUpdate), jsf(schemaDelete),)
    var testDataToSend = []
    for (let i = 0; i < 1; i++) {
      console.group(`TEST RIGHT DATA ${i}`)
      console.group(`createUser`)
      var createdResponse
      var createRequest = jsf(schemaCreate)
      await new Promise((resolve, reject) => {
        console.debug('send createRequest', JSON.stringify(createRequest))
        request.postJson('http://127.0.0.1:1080/createUser', createRequest).on('complete', function (dataResponse, response) {
          console.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response createUser is object')
          t.type(dataResponse.id, 'string', 'Response createUser id is string ' + dataResponse.id)
          createdResponse = dataResponse
          resolve()
        })
      })
      console.groupEnd()
      console.group(`readUser From id`)
      await new Promise((resolve, reject) => {
        var data = {id: createdResponse.id}
        console.debug('send', schemaRead, JSON.stringify(data))
        request.postJson('http://127.0.0.1:1080/readUser', data).on('complete', function (dataResponse, response) {
          console.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response readUser is object')
          t.same(dataResponse.username, createRequest.data.username, 'Response readUser  username as sended, id:' + dataResponse._id)
          resolve()
        })
      })
      console.groupEnd()
      console.group(`updateUser`)
      schemaUpdate.allOf[2] = {'properties': {'data': {required: ['username']}}}
      var updateRequest = jsf(schemaUpdate)
      updateRequest.id = createdResponse.id
      await new Promise((resolve, reject) => {
        console.debug('send', schemaUpdate, JSON.stringify(updateRequest))
        request.postJson('http://127.0.0.1:1080/updateUser', updateRequest).on('complete', function (dataResponse, response) {
          console.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response updateUser is object')
          t.same(dataResponse.id, createdResponse.id, 'Response updateUser  id as sended, id:' + dataResponse.id)
          resolve()
        })
      })
      console.groupEnd()
      console.group(`readUser From data/_id`)
      await new Promise((resolve, reject) => {
        var data = {data: {_id: createdResponse.id}}
        console.debug('send', schemaRead, JSON.stringify(data))
        request.postJson('http://127.0.0.1:1080/readUser', data).on('complete', function (dataResponse, response) {
          console.debug('receive', JSON.stringify(dataResponse))
          t.type(dataResponse, 'object', 'Response readUser is object')
          t.same(dataResponse.username, updateRequest.data.username, 'Response readUser username as updated, id:' + dataResponse._id)
          resolve()
        })
      })
      console.groupEnd()
      console.groupEnd()
    }
    // schema.properties.data.properties.username.pattern = '[a]' // MODIFY FOR WRONG REQUESTS
    // for (let i = 0; i < 1; i++) {
    //   await new Promise((resolve, reject) => {
    //     var data = jsf(schemaCreate)
    //     console.debug('send', JSON.stringify(data))
    //     request.postJson('http://127.0.0.1:1080/createUser', data).on('complete', function (dataResponse, response) {
    //       console.debug('receive', JSON.stringify(dataResponse))
    //       t.type(dataResponse, 'object', 'Response wrong createUser is object')
    //       t.type(dataResponse.error, 'string', 'Response wrong createUser return error ' + dataResponse.error)
    //       resolve()
    //     })
    //   })
    // }
    t.end()
  })

  MS_USERS.stop()
})
