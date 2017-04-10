
if (!global._babelPolyfill)require('babel-polyfill')
var R = require('ramda')
var request = require('request')
var t = require('tap')
var path = require('path')

const getConsole = (serviceName, serviceId, pack) => require('../utils').getConsole({error: true, debug: true, log: false, warn: true}, serviceName, serviceId, pack)
var CONSOLE = getConsole('BASE TEST', '----', '-----')

var sharedConfig = {
  'net1': {
    'net': {
      channels: {
        'test': {
          url: 'localhost:8080'
        }
      }
    },
    'eventsOut': {
      testEvent: {}
    },
    'eventsIn': {
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
    channels: {
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
    channels: {
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
    channels: {
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

var getMethods = (service, exclude) => Methods

var getSharedConfig = (field = '*', exclude = '', subfield = 'net') => {
  if (field === '*') return Object.keys(sharedConfig).filter((key) => key !== exclude).map((key) => { return {items: sharedConfig[key][subfield], service: key} })
  else return sharedConfig[field][subfield]
}
var getMethodsConfig = async (service, exclude) => getSharedConfig(service, exclude, 'methods')
var getNetConfig = async (service, exclude) => getSharedConfig(service, exclude, 'net')
var getEventsIn = async (service, exclude) => getSharedConfig(service, exclude, 'eventsIn')
var getEventsOut = async (service, exclude) => getSharedConfig(service, exclude, 'eventsOut')

var netServer1 = require('../net.server')({getConsole, serviceName: 'net1', serviceId: 'net1', getMethods, getMethodsConfig, getNetConfig})
var netServer2 = require('../net.server')({getConsole, serviceName: 'net2', serviceId: 'net2', getMethods, getMethodsConfig, getNetConfig})
var netServer3 = require('../net.server')({getConsole, serviceName: 'net3', serviceId: 'net3', getMethods, getMethodsConfig, getNetConfig})
var netServer4 = require('../net.server')({getConsole, serviceName: 'net4', serviceId: 'net4', getMethods, getMethodsConfig, getNetConfig})
netServer1.start()
netServer2.start()
netServer3.start()
netServer4.start()

var netClient1 = require('../net.client')({getConsole, serviceName: 'net1', serviceId: 'net1', getNetConfig, getEventsIn, getMethodsConfig})

t.test('*** NET ***', {
  autoend: true
}, async function mainTest (t) {
  t.plan(5)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await t.test('netClient1.rpc -> testNoResponse', async function (t) {
    testCheck = false
    var response = await netClient1.rpc({to: 'net1', method: 'testNoResponse', data: {'test_data': 1}, meta, timeout: 5000})
    t.same(response, null, 'response=true on NoResponse')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    t.same(testCheck, {'test_data': 1}, 'testNoResponse richiesta ricevuta')
    t.end()
  })
  await t.test('netClient1.rpc -> testAknowlegment', async function (t) {
    testCheck = false
    var response = await netClient1.rpc({to: 'net1', method: 'testAknowlegment', data: {'test_data': 1}, meta, timeout: 5000})
    t.same(response, null, 'Aknowlegment ok')
    t.same(testCheck, {'test_data': 1}, 'testAknowlegment richiesta ricevuta')
    t.end()
  })
  //
  await t.test('netClient1.rpc -> testResponse', async function (t) {
    testCheck = false
    var response = await netClient1.rpc({to: 'net1', method: 'testResponse', data: {'test_data': 1}, meta, timeout: 5000})
    t.same(response, {'test_data': 1}, 'response as sended')
    t.same(testCheck, {'test_data': 1}, 'testResponse richiesta ricevuta')
    t.end()
  })
  await t.test('netClient1.rpc -> testStream', async function (t) {
    testCheck = false
    var testStream = false
    var streaming = await netClient1.rpc({to: 'net1', method: 'testStream', data: {'test_data': 1}, meta, timeout: 5000})
    streaming.on('data', (data) => { CONSOLE.debug('streaming data', data); testStream = true })
    streaming.on('error', (data) => CONSOLE.debug('streaming error', data))
    streaming.on('end', (data) => CONSOLE.debug('streaming close', data))

    await new Promise((resolve) => setTimeout(resolve, 1000))
    t.same(testStream, true, 'Stream received')
    t.same(testCheck, {'test_data': 1}, 'testStream richiesta ricevuta')
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
  // process.exit()
}).then(() => process.exit())
