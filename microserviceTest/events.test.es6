var R = require('ramda')
var faker = require('faker')
faker.locale = 'it'
var zlib = require('zlib')
// var zstd = require('node-zstd')
// var LZ4 = require('lz4')
var jsf = require('json-schema-faker')

var msgpack = require('msgpack')
if (!global._babelPolyfill) {
  require('babel-polyfill')
}
var getMicroservice = require('./microservice')
var t = require('tap')
var path = require('path')

function bytesToSize (bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return 'n/a'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  if (i == 0) return bytes + ' ' + sizes[i]
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
};

t.test('*** NET MESSAGES COMPRESSION TEST ***', {
  autoend: true
}, async function mainTest (t) {
  var SERVICE_1, CONFIG_1, DI_1, NET_1
  var service1Config = {
    name: 'testMicroservice',
    httpPort: 8080,
    net: {
      netRegistry: require('./shared/netRegistry.json'),
      url: '0.0.0.0:8082'
    }
  }
  { ({ SERVICE: SERVICE_1, CONFIG: CONFIG_1, DI: DI_1, NET: NET_1 } = await getMicroservice(service1Config)) }

  var service2Config = {
    name: 'authorizations',
    httpPort: 9090,
    net: {
      netRegistry: require('./shared/netRegistry.json'),
      url: '0.0.0.0:9092'
    }
  }
  var SERVICE_2, CONFIG_2, DI_2, NET_2
  { ({ SERVICE: SERVICE_2, CONFIG: CONFIG_2, DI: DI_2, NET: NET_2 } = await getMicroservice(service2Config)) }

  t.plan(1)

  var schema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$"
      },
      name: {
        type: 'string',
        faker: 'name.findName'
      },
      email: {
        type: 'string',
        format: 'email',
        faker: 'internet.email'
      }
    },
    required: ['id', 'name', 'email'],

  }
  var testDataToSend = []
  for (let i = 0; i < 1000; i++) {
    testDataToSend.push(jsf(schema))
  }
  //console.log(testDataToSend)
  async function testEmit () {
    var start = new Date()
    NET_1.resetSerializedDataByte()
    for (var data of testDataToSend) {
      await DI_1.emitEvent({name: 'test', data})
    }
    return { time: (new Date() - start), dataByte: NET_1.getSerializedDataByte()}
  }

  await t.test('NO COMPRESSION', async function (t) {
    var result = await testEmit()
    t.ok(true, 'size ' + bytesToSize(result.dataByte))
    t.ok(true, 'time ' + (result.time / 1000) + ' s')
    t.end()
  })


  SERVICE_1.stop()
  SERVICE_2.stop()
})
