
if (!global._babelPolyfill)require('babel-polyfill')
var R = require('ramda')
// var deref = require('json-schema-deref-sync')
// var faker = require('faker')
// var jsf = require('json-schema-faker')
// faker.locale = 'it'
// var restler = require('restler')
//
var t = require('tap')
var path = require('path')

var jesus = require('../jesus')
var meta = {
  corrid: 'testRequest',
  userid: 'testUser'
}
const getConsole = (serviceName, serviceId, pack) => jesus.getConsole({error: true, debug: true, log: true, warn: true}, serviceName, serviceId, pack)
var CONSOLE = getConsole('BASE TEST', '----', '-----')

var mutationsCqrs = require('../mutations.cqrs')({getConsole, mutationsPath: path.join(__dirname, 'mutations')})

t.test('*** VIEWS CQRS ***', {
  autoend: true
}, async function mainTest (t) {
  t.plan(1)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  //
  await t.test('mutationsCqrs.mutate -> mutationState', async function (t) {
    var mutations = []
    mutations.push(mutationsCqrs.mutate({mutation: 'update', objId: 'testobjId', data: {testData: 1}, meta}))
    mutations.push(mutationsCqrs.mutate({mutation: 'update', objId: 'testobjId', data: {testData2: 1}, meta}))

    var getObjMutations = async() => {
      return mutations
    }

    var applyMutations = mutationsCqrs.applyMutations
    var viewsCqrs = require('../views.cqrs')({getConsole, snapshotsMaxMutations: 10, getObjMutations, applyMutations})
    var addMutations = [mutations[1], mutationsCqrs.mutate({mutation: 'update', objId: 'testobjId', data: {testData: 2}, meta})]
    var viewState = await viewsCqrs.refreshViews({objIds: ['testobjId'], loadMutations: true, addMutations})
    // mutationsCqrs.applyMutations()
    CONSOLE.debug('viewState', viewState)
    // t.ok(viewState.timestamp, 'mutationState.timestamp setted')
    // t.same(viewState.version, '001', 'mutationState.version setted')
    t.end()
  })

  // await new Promise((resolve) => setTimeout(resolve, 10000))
  t.end()
  process.exit()
})
