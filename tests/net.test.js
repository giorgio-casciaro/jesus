
var R = require('ramda')
var request = require('request')
var t = require('tap')
var path = require('path')

var genericSchema = {'type': 'object', 'additionalProperties': true}
var sharedConfig = {
  'net1': {
    'net': {
      channels: {
        'test': {
          url: 'localhost:8080'
        }
      }
    },
    rpcOut: {
      'testRpcNoResponse': {
        to: 'net1',
        method: 'testNoResponse',
        requestSchema: genericSchema,
        responseSchema: genericSchema
      },
      'testRpcAknowlegment': {
        to: 'net1',
        method: 'testAknowlegment',
        requestSchema: genericSchema,
        responseSchema: genericSchema
      },
      'testRpcResponse': {
        to: 'net1',
        method: 'testResponse',
        requestSchema: genericSchema,
        responseSchema: genericSchema
      },
      'testRpcStream': {
        to: 'net1',
        method: 'testStream',
        requestSchema: genericSchema,
        responseSchema: genericSchema
      }
    },
    eventsOut: {
      'testEvent': {
        multipleResponse: false,
        requestSchema: genericSchema,
        responseSchema: genericSchema
      }
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
        responseSchema: genericSchema,
        requestSchema: genericSchema
      },
      'testAknowlegment': {
        public: true,
        responseType: 'aknowlegment',
        responseSchema: genericSchema,
        requestSchema: genericSchema
      },
      'testResponse': {
        public: true,
        responseType: 'response',
        responseSchema: genericSchema,
        requestSchema: genericSchema
      },
      'testStream': {
        public: true,
        responseType: 'stream',
        responseSchema: genericSchema,
        requestSchema: genericSchema
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
  testNoResponse: async function (data, meta, getStream) {
    console.log('METHOD testNoResponse', {data, meta, getStream})
    testCheck = data
  },
  testAknowlegment: async function (data, meta, getStream) { testCheck = data },
  testResponse: async function (data, meta, getStream) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    testCheck = data
    return data
  },
  testStream: async function (data, meta, getStream) {
    console.debug('testStream', {data, meta, getStream})
    testCheck = data
    var onClose = () => { console.log('stream closed') }
    stream = getStream(onClose, 120000)
    stream.write({testStreamConnnected: 1})
    setTimeout(() => stream.write({testStreamData: 1}), 500)
    setTimeout(() => stream.end(), 1000)
  }
}

var stubs = require('./stubs')(sharedConfig, Methods)

var netServer1 = stubs.getServer('net1', 'net1')
var netServer2 = stubs.getServer('net2', 'net2')
var netServer3 = stubs.getServer('net3', 'net3')
var netServer4 = stubs.getServer('net4', 'net4')

netServer1.start()
netServer2.start()
netServer3.start()
netServer4.start()

var netClient1 = stubs.getClient('net1', 'net1')

t.test('*** NET ***', {
  autoend: true
}, async function mainTest (t) {
  t.plan(5)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await t.test('netClient1.rpc -> testNoResponse', async function (t) {
    testCheck = false
    var response = await netClient1.rpc('testRpcNoResponse', {'test_data': 1}, meta)
    t.same(response, null, 'response=null on NoResponse')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    t.same(testCheck, {'test_data': 1}, 'testNoResponse richiesta ricevuta')
    t.end()
  })

  await t.test('netClient1.rpc -> testAknowlegment', async function (t) {
    testCheck = false
    var response = await netClient1.rpc('testRpcAknowlegment', {'test_data': 1}, meta)
    t.same(response, { aknowlegment: 1 }, 'Aknowlegment ok')
    t.same(testCheck, {'test_data': 1}, 'testAknowlegment richiesta ricevuta')
    t.end()
  })
  //
  await t.test('netClient1.rpc -> testResponse', async function (t) {
    testCheck = false
    var response = await netClient1.rpc('testRpcResponse', {'test_data': 1}, meta)
    t.same(response, {'test_data': 1}, 'response as sended')
    t.same(testCheck, {'test_data': 1}, 'testResponse richiesta ricevuta')
    t.end()
  })
  await t.test('netClient1.rpc -> testStream', async function (t) {
    testCheck = false
    var testStream = false
    var streaming = await netClient1.rpc('testRpcStream', {'test_data': 1}, meta)
    streaming.on('data', (data) => { console.debug('streaming data', data); testStream = true })
    streaming.on('error', (data) => console.debug('streaming error', data))
    streaming.on('end', (data) => console.debug('streaming close', data))

    await new Promise((resolve) => setTimeout(resolve, 1000))
    t.same(testStream, true, 'Stream received')
    t.same(testCheck, {'test_data': 1}, 'testStream richiesta ricevuta')
    t.end()
  })

  await t.test('netClient1.emit -> testEmit', async function (t) {
    testCheck = false
    var response = await netClient1.emit('testEvent', {'eventTest_data': 1}, meta)
    t.same(response, {'eventTest_data': 1}, 'response as sended')
    t.same(testCheck, {'eventTest_data': 1}, 'delayed received')
    t.end()
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))
  t.end()
  // process.exit()
}).then(() => process.exit())
