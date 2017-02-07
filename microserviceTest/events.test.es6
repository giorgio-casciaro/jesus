if (!global._babelPolyfill) {
  require('babel-polyfill')
}
var getMicroservice = require('./microservice')
var t = require('tap')
var path = require('path')

t.test('*** JESUS SERVICE ENTITY ***', {
  autoend: true
}, async function mainTest (t) {
  var SERVICE_1, CONFIG_1, DI_1
  ({ SERVICE: SERVICE_1, CONFIG: CONFIG_1, DI: DI_1 } = await getMicroservice({name: 'testMicroservice', grpcUrl: '0.0.0.0:10000', eventsRegistry: require('./shared/eventsRegistry.json')}))

  var SERVICE_2, CONFIG_2, DI_2
  ({ SERVICE: SERVICE_2, CONFIG: CONFIG_2, DI: DI_2 } = await getMicroservice({name: 'authorizations', proto: path.join(__dirname, '/shared/services/authorizations.proto'), grpcUrl: '0.0.0.0:10001', restPort: 8081, eventsRegistry: require('./shared/eventsRegistry.json')}))
  t.plan(1)
  await t.test('-> ENTITY CREATE', async function (t) {
    var rapidTest = await DI_2.emitEvent({name: 'viewsUpdated', data: {itemsIds: ['test']}})
    console.log(rapidTest)
    var reqData = {action: 'write.test', entityName: 'User'}
    try {
      var rapidTest = await DI_1.emitEvent({name: 'authorize', data: reqData})
      console.log(rapidTest)
    } catch (error) {
      console.log({error})
    }
    SERVICE_1.apiGrpc.stop()
    SERVICE_1.apiRest.stop()
    SERVICE_2.apiGrpc.stop()
    SERVICE_2.apiRest.stop()
    t.end()

    // } catch (error) {
    //   //DI.error(error)
    //   t.fail('FAIL createEntityTest')
    //   t.end('FAIL createEntityTest')
    // }
  })
})
