
if (!global._babelPolyfill)require('babel-polyfill')
var R = require('ramda')
// var deref = require('json-schema-deref-sync')
// var faker = require('faker')
// var jsf = require('json-schema-faker')
// faker.locale = 'it'
// var restler = require('restler')
//
var request = require('request')
var t = require('tap')
var path = require('path')

var jesus = require('../jesus')

const getConsole = (serviceName, serviceId, pack) => jesus.getConsole({error: true, debug: true, log: true, warn: true}, serviceName, serviceId, pack)
var CONSOLE = getConsole('BASE TEST', '----', '-----')

var sharedConfig = {
  'net1': {
    'net': {
      transports: {
        'test': {
          url: 'localhost:8080'
        }
      }
    },
    'events.emit': {
      testEvent: {}
    },
    'events.listen': {
      testEvent: {
        method: 'testResponse'
      }
    },
    'methods': {
      'testNoResponse': {
        public: true,
        responseType: 'noResponse',
        responseSchema: {'type': 'object'},
        requestSchema: {'type': 'object'}
      },
      'testAknowlegment': {
        public: true,
        responseType: 'aknowlegment',
        responseSchema: {'type': 'object'},
        requestSchema: {'type': 'object'}
      },
      'testResponse': {
        public: true,
        responseType: 'response',
        responseSchema: {'type': 'object'},
        requestSchema: {'type': 'object'}
      },
      'testStream': {
        public: true,
        responseType: 'stream',
        responseSchema: {'type': 'object'},
        requestSchema: {'type': 'object'}
      }
    }
  }
}
sharedConfig.net2 = R.merge(sharedConfig.net1, {
  net: {
    transports: {
      'test': {
        url: 'localhost:8082'
      }
    }
  },
  'events.listen': {
    testEvent: {
      method: 'testResponse'
    }
  }
})
sharedConfig.net3 = R.merge(sharedConfig.net1, {
  net: {
    transports: {
      'test': {
        url: 'localhost:8083'
      }
    }
  },
  'events.listen': {
    testEvent: {
      method: 'testNoResponse'
    }
  }
})
sharedConfig.net4 = R.merge(sharedConfig.net1, {
  net: {
    transports: {
      'test': {
        url: 'localhost:8084'
      }
    }
  },
  'events.listen': {
    testEvent: {
      method: 'testAknowlegment'
    }
  }
})
var meta = {
  corrid: 'testRequest',
  userid: 'testUser'
}

var testCheck = false
var stream
var Methods = {
  testNoResponse: async(data, meta) => { CONSOLE.debug('testNoResponse', {data, meta}); testCheck = data },
  testAknowlegment: async(data, meta) => { testCheck = data },
  testResponse: async(data, meta) => { testCheck = data; return data },
  testStream: (data, meta, getStream) => {
    CONSOLE.debug('testStream', {data, meta, getStream})
    testCheck = data
    var onClose = () => { CONSOLE.log('stream closed') }
    stream = getStream(onClose, 120000)
    stream.write({testStreamConnnected: 1})
    setTimeout(() => stream.write({testStreamData: 1}), 500)
    setTimeout(() => stream.end(), 1000)
  }
}
var getMethods = () => {
  return Methods
}

var getSharedConfig = async (service, config = 'service', exclude, asObj) => {
  if (service === '*') {
    var results = {}
    for (var i in sharedConfig) {
      if (i !== exclude) {
        results[i] = sharedConfig[i][config]
        results[i].serviceName = i
      }
    }
    if (!asObj) { results = Object.values(results) }
    return results
  }
  return sharedConfig[service][config]
}
var netServer1 = require('../net.server')({getConsole, serviceName: 'net1', serviceId: 'net1', getMethods, getSharedConfig, config: sharedConfig.net1.net})
var netServer2 = require('../net.server')({getConsole, serviceName: 'net2', serviceId: 'net2', getMethods, getSharedConfig, config: sharedConfig.net2.net})
var netServer3 = require('../net.server')({getConsole, serviceName: 'net3', serviceId: 'net3', getMethods, getSharedConfig, config: sharedConfig.net3.net})
var netServer4 = require('../net.server')({getConsole, serviceName: 'net4', serviceId: 'net4', getMethods, getSharedConfig, config: sharedConfig.net4.net})
netServer1.start()
netServer2.start()
netServer3.start()
netServer4.start()

var netClient1 = require('../net.client')({getConsole, serviceName: 'net1', serviceId: 'net1', getSharedConfig, config: sharedConfig.net1.net})

t.test('*** NET ***', {
  autoend: true
}, async function mainTest (t) {
  t.plan(5)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await t.test('netClient1.rpc -> testNoResponse', async function (t) {
    testCheck = false
    var response = await netClient1.rpc({to: 'net1', method: 'testNoResponse', data: {'test_data': 1}, meta, timeout: 5000, singleResponse: true})
    t.same(response, null, 'response=true on NoResponse')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    t.same(testCheck, {'test_data': 1}, 'testNoResponse richiesta ricevuta')
    t.end()
  })
  await t.test('netClient1.rpc -> testAknowlegment', async function (t) {
    testCheck = false
    var response = await netClient1.rpc({to: 'net1', method: 'testAknowlegment', data: {'test_data': 1}, meta, timeout: 5000, singleResponse: true})
    t.same(response, null, 'Aknowlegment ok')
    t.same(testCheck, {'test_data': 1}, 'testAknowlegment richiesta ricevuta')
    t.end()
  })
  //
  await t.test('netClient1.rpc -> testResponse', async function (t) {
    testCheck = false
    var response = await netClient1.rpc({to: 'net1', method: 'testResponse', data: {'test_data': 1}, meta, timeout: 5000, singleResponse: true})
    t.same(response, {'test_data': 1}, 'response as sended')
    t.same(testCheck, {'test_data': 1}, 'testResponse richiesta ricevuta')
    t.end()
  })
  await t.test('netClient1.rpc -> testStream', async function (t) {
    testCheck = false
    var testStream = false
    var streaming = await netClient1.rpc({to: 'net1', method: 'testStream', data: {'test_data': 1}, meta, timeout: 5000, singleResponse: true})
    streaming.on('data', (data) => { CONSOLE.debug('streaming data', data); testStream = true })
    streaming.on('error', (data) => CONSOLE.debug('streaming error', data))
    streaming.on('end', (data) => CONSOLE.debug('streaming close', data))

    await new Promise((resolve) => setTimeout(resolve, 1000))
    t.same(testStream, true, 'Stream received')
    t.same(testCheck, {'test_data': 1}, 'testStream richiesta ricevuta')
    t.end()
  })

  await t.test('netClient1.rpc -> testResponse delayed 2000', async function (t) {
    testCheck = false
    var response = await netClient1.rpc({to: 'net1', method: 'testResponse', data: {'test_data': 1}, meta, delayed: 1000, timeout: 5000, singleResponse: true})
    t.same(response, null, 'delayed response   ')
    await new Promise((resolve) => setTimeout(resolve, 2000))
    t.same(testCheck, {'test_data': 1}, 'delayed received')
    t.end()
  })

  await t.test('netClient1.emit -> testEmit', async function (t) {
    testCheck = false
    var response = await netClient1.emit({event: 'testEvent', data: {'eventTest_data': 1}, meta, timeout: 5000, singleResponse: true})
    t.same(response, {'eventTest_data': 1}, 'response as sended')
    t.same(testCheck, {'eventTest_data': 1}, 'delayed received')
    t.end()
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))
  t.end()
  process.exit()
})
