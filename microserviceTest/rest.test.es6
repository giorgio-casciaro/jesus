if (!global._babelPolyfill) {
  require('babel-polyfill')
}
var getMicroservice = require('./microservice')
var t = require('tap')
var request = require('restler')

t.test('*** JESUS SERVICE ENTITY ***', {
  autoend: true
}, async function mainTest (t) {
  var SERVICE_1, CONFIG_1, DI_1
  ({ SERVICE: SERVICE_1, CONFIG: CONFIG_1, DI: DI_1 } = await getMicroservice({restPort: 8080}))
  //
  // var SERVICE_2, CONFIG_2, DI_2
  // ({ SERVICE: SERVICE_2, CONFIG: CONFIG_2, DI: DI_2 } = await getMicroservice({grpcUrl: '0.0.0.0:11000'}))

  t.plan(1)
  await t.test('-> ENTITY CREATE', async function (t) {
    var serviceCreateUserRequest = {items: [{username: 'test', email: 'test@test.com'}, {username: 'test2', email: 'test@test.com'}]}

    await new Promise((resolve, reject) => {
      request.postJson('http://127.0.0.1:8080/createUser', serviceCreateUserRequest).on('complete', function (serviceCreateResponse, response) {
        console.log('serviceCreateResponse', serviceCreateResponse)
        t.type(serviceCreateResponse, 'object', 'Response is object')
        t.type(serviceCreateResponse.itemsIds, 'Array', 'itemsIds is array')
        t.equal(serviceCreateResponse.itemsIds.length, 2, 'itemsIds length is 2')
        resolve()
      })
    })

    await new Promise((resolve, reject) => {
      request.get('http://127.0.0.1:8080/createUser', {data:serviceCreateUserRequest}).on('complete', function (serviceCreateResponse, response) {
        console.log('serviceCreateResponse', serviceCreateResponse)
        t.type(serviceCreateResponse, 'object', 'Response is object')
        t.type(serviceCreateResponse.itemsIds, 'Array', 'itemsIds is array')
        t.equal(serviceCreateResponse.itemsIds.length, 2, 'itemsIds length is 2')
        resolve()
      })
    })

    SERVICE_1.apiGrpc.stop()
    SERVICE_1.apiRest.stop()
    t.end()

    // } catch (error) {
    //   //DI.error(error)
    //   t.fail('FAIL createEntityTest')
    //   t.end('FAIL createEntityTest')
    // }
  })
})
