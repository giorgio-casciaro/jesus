var t = require('tap')
if (!global._babelPolyfill) {
  require('babel-polyfill')
}
var LOG = function (type, obj) {
  const ANSI_RESET = '\u001B[0m'
  const ANSI_BLACK = '\u001B[30m'
  const ANSI_RED = '\u001B[31m'
  const ANSI_GREEN = '\u001B[32m'
  const ANSI_YELLOW = '\u001B[33m'
  const ANSI_BLUE = '\u001B[34m'
  const ANSI_PURPLE = '\u001B[35m'
  const ANSI_CYAN = '\u001B[36m'
  const ANSI_WHITE = '\u001B[37m'
  console.log(`${ANSI_GREEN} TEST ${type} ${ANSI_RESET}`)
  console.log(obj)
  // console.log(JSON.stringify(arguments).substring(0, 250))
}

var SERVICE = require('./eventsEmitter')()

t.test('*** JESUS EVENTS EMITTER ***', {
  autoend: true
}, async function mainTest (t) {
  t.plan(1)
  try {
    await t.test('*** JESUS EVENTS EMITTER 1 ***', async function (t) {
      try {
        SERVICE.on('testEvent', (eventData, eventEmitOptions, eventRegistrationOptions) => new Promise((resolve, reject) => {
          resolve(eventData)
        }))
        var fakeSend = 134
        var testCurried = SERVICE.emit('testEvent')
        t.type(testCurried, 'function')
        t.type(testCurried(fakeSend), 'Promise')
        var testCurriedValue = await testCurried(fakeSend)
        t.same(testCurriedValue[0], fakeSend, 'Curried Test')
        LOG('RESOLVE TEST 1', {testCurriedValue, fakeSend})
        t.end()
      } catch (error) {
        LOG('REJECT TEST 1', error)
        console.trace(error)
        t.fail('FAIL deletePermission')
        t.end('FAIL deletePermission')
      }
      // SERVICE_API.deletePermission({
      //   ids: testPermissionsIds
      // }, function (result) {
      //   LOG('RESOLVE deletePermission', result)
      //   // t.pass('PASS deletePermission')
      //   t.end()
      // }, function (error) {
      //   LOG('REJECT deletePermission', error)
      //   t.fail('FAIL deletePermission')
      //   t.end('FAIL deletePermission')
      // })
    })
    //
    // await t.test('*** SERVICE.createPermission ***', function (t) {
    //   SERVICE_API.createPermission({
    //     items: testPermissions
    //   }, function (result) {
    //     LOG('RESOLVE createPermission', result)
    //     // t.pass('PASS createPermission')
    //     t.end()
    //   }, function (error) {
    //     LOG('REJECT createPermission', error)
    //     t.fail('FAIL createPermission')
    //     t.end()
    //   })
    // })
    // //
    // await t.test('*** SERVICE.createPermission try to reinsert same ids***', function (t) {
    //   SERVICE_API.createPermission({
    //     items: testPermissions
    //   }, function (result) {
    //     LOG('RESOLVE createPermission', result)
    //     t.fail('FAIL createPermission')
    //     t.end()
    //   }, function (error) {
    //     LOG('REJECT createPermission', error)
    //     t.end()
    //   })
    // })
    //
    // await t.test('*** SERVICE.readPermission ***', function (t) {
    //   SERVICE_API.readPermission({
    //     ids: testPermissionsIds
    //   }, function (result) {
    //     LOG('RESOLVE readPermission', result)
    //     t.end()
    //   }, function (error) {
    //     LOG('REJECT readPermission', error)
    //     t.fail('FAIL readPermission')
    //     t.end()
    //   })
    // })
    //
    // await t.test('*** SERVICE.updatePermission ***', function (t) {
    //   SERVICE_API.updatePermission({
    //     items: testPermissions
    //   }, function (result) {
    //     LOG('RESOLVE updatePermission', result)
    //     t.end('RESOLVE updatePermission')
    //   }, function (error) {
    //     LOG('REJECT updatePermission', error)
    //     t.fail('FAIL updatePermission')
    //     t.end()
    //   })
    // })
  } catch (error) {
    LOG('TEST ERROR', error)
  }
  // t.end()
  process.exit(0)
})
