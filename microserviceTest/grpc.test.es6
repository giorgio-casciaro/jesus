if (!global._babelPolyfill) {
  require('babel-polyfill')
}
var getMicroservice = require('./microservice')
var t = require('tap')

t.test('*** JESUS SERVICE ENTITY ***', {
  autoend: true
}, async function mainTest (t) {
  var SERVICE_1, CONFIG_1, DI_1
  ({ SERVICE: SERVICE_1, CONFIG: CONFIG_1, DI: DI_1 } = await getMicroservice({grpcUrl: '0.0.0.0:10000'}))
  //
  // var SERVICE_2, CONFIG_2, DI_2
  // ({ SERVICE: SERVICE_2, CONFIG: CONFIG_2, DI: DI_2 } = await getMicroservice({grpcUrl: '0.0.0.0:11000'}))

  t.plan(1)
  await t.test('-> ENTITY CREATE', async function (t) {
    // CALL CREATE USER
    // var serviceCreateUserRequest = {items: [{username: 'test', email: 'test@test.com'}, {username: 'test2', email: 'test@test.com'}]}
    // global.serviceCreateResponse = await SERVICE.callRoute({route: 'createUser', request: serviceCreateUserRequest})
    // DI.debug('global.serviceCreateResponse', {response: global.serviceCreateResponse})
    // t.type(global.serviceCreateResponse, 'object', 'Response is object')
    // t.type(global.serviceCreateResponse.itemsIds, 'Array', 'itemsIds is array')
    // t.equal(global.serviceCreateResponse.itemsIds.length, 2, 'itemsIds length is 2')
    var grpc = require('grpc')
    var grpcService = grpc.load(__dirname + '/shared/services/testMicroservice.proto').Service
    var grpcCredentials = require('grpc').credentials.createInsecure()
    var client = new grpcService('0.0.0.0:10000', grpcCredentials)

    var serviceCreateUserRequest = {items: [{username: 'test', email: 'test@test.com'}, {username: 'test2', email: 'test@test.com'}]}

    await new Promise((resolve, reject) => {
      client.createUser(serviceCreateUserRequest, (error, serviceCreateResponse) => {
        console.log('serviceCreateResponse', error, serviceCreateResponse)

        t.type(serviceCreateResponse, 'object', 'Response is object')
        t.type(serviceCreateResponse.itemsIds, 'Array', 'itemsIds is array')
        t.equal(serviceCreateResponse.itemsIds.length, 2, 'itemsIds length is 2')
        resolve()
        // SERVICE_2.apiGrpc.stop()
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
