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

  t.plan(10)

  var schema = {
    type: 'object',
    properties: {
      id: {
        $ref: '#/definitions/positiveInt'
      },
      name: {
        type: 'string',
        faker: 'name.findName'
      },
      email: {
        type: 'string',
        format: 'email',
        faker: 'internet.email'
      },
          // test: {
          //   type: 'string',
          // },
      test2: {
        type: 'string',
        minLength: 100,
        minLength: 1000
      },
      test3: {
        'type': 'array',
        'items': [{
          'type': 'string',
          'format': 'date-time'
        }, {
          'type': 'string',
          'format': 'email'
        }, {
          'type': 'string',
          'format': 'hostname'
        }, {
          'type': 'string',
          'format': 'ipv4'
        }, {
          'type': 'string',
          'format': 'ipv6'
        }, {
          'type': 'string',
          'format': 'uri'
        }]
      }
    },
    required: ['id', 'name', 'email'],

    definitions: {
      positiveInt: {
        type: 'integer',
        minimum: 0,
        exclusiveMinimum: true
      }
    }
  }
  var testData = []
  for (let i = 0; i < 200; i++) {
    testData.push(jsf(schema))
  }
  var testDataToSend = []
  for (let i = 0; i < 200; i++) {
    testDataToSend.push(jsf(schema))
  }
  async function testEmit () {
    var start = new Date()
    NET_1.resetSerializedDataByte()
    for (var data of testDataToSend) {
      await DI_1.emitEvent({name: 'test', data})
    }
    return { time: (new Date() - start), dataByte: NET_1.getSerializedDataByte()}
  }

  await t.test('NO COMPRESSION', async function (t) {
    var serializeFunction = (obj, dictionary) => new Buffer(JSON.stringify(obj))
    var deserializeFunction = (buffer, dictionary) => JSON.parse(buffer.toString())
    NET_1.setSerializeFunction(serializeFunction)
    NET_1.setDeserializeFunction(deserializeFunction)
    var result = await testEmit()
    t.ok(true, 'size ' + bytesToSize(result.dataByte))
    t.ok(true, 'time ' + (result.time / 1000) + ' s')
    t.end()
  })

  await t.test('zlib.deflate NO DICTIONARY', async function (t) {
    var serializeFunction = (obj) => zlib.deflateSync(JSON.stringify(obj), {level: 1})
    var deserializeFunction = (obj) => JSON.parse(zlib.inflateSync(obj))
    NET_1.setSerializeFunction(serializeFunction)
    NET_1.setDeserializeFunction(deserializeFunction)
    var result = await testEmit()
    t.ok(true, 'size ' + bytesToSize(result.dataByte))
    t.ok(true, 'time ' + (result.time / 1000) + ' s')
    t.end()
  })

  await t.test('zlib.gzip NO DICTIONARY', async function (t) {
    var serializeFunction = (obj) => zlib.gzipSync(JSON.stringify(obj), {level: 1})
    var deserializeFunction = (obj) => JSON.parse(zlib.gunzipSync(obj))
    NET_1.setSerializeFunction(serializeFunction)
    NET_1.setDeserializeFunction(deserializeFunction)
    var result = await testEmit()
    t.ok(true, 'size ' + bytesToSize(result.dataByte))
    t.ok(true, 'time ' + (result.time / 1000) + ' s')
    t.end()
  })

  await t.test('zlib.deflate DICTIONARY: analize data', async function (t) {
    // Extract words, remove punctuation (extra: replace(/\s/g, " "))
    function getDictionary (str) {
      // var words = str.replace(/[,\;.:\(\)]/g, '').split(' ').sort()
      var words = str.match(/.{1,10}/g).sort()
      var wcnt = [], w = '', cnt = 0 // pairs, current word, current word count
      for (var i = 0, cnt = 0, w = ''; i < words.length; i++) {
        if (words[i] === w) {
          cnt++ // another match
        } else {
          if (w !== '') {
            wcnt.push([cnt, w])
          } // Push a pair (count, word)
          cnt = 1 // Start counting for this word
          w = words[i] // Start counting again
        }
      }
      if (w !== '') {
        wcnt.push([cnt, w])
        // wcnt.unshift([cnt, w])
      } // Push last word
      wcnt.sort() // Greater matches at the end
      // wcnt.reverse()
      for (var i in wcnt) {
        wcnt[i] = wcnt[i][1]
      } // Just take the words
      var dict = wcnt.join('').slice(-1000)  // Join the words, take last 70 chars
      return dict
    }
    // console.log(JSON.stringify(resultData))
    // console.log(getDictionary(JSON.stringify(testData)))
    var dictionary = new Buffer(getDictionary(JSON.stringify(testData)), 'utf8')
    var serializeFunction = (obj) => zlib.deflateSync(JSON.stringify(obj), {dictionary, level: 1})
    var deserializeFunction = (obj) => JSON.parse(zlib.inflateSync(obj, {dictionary}))
    NET_1.setSerializeFunction(serializeFunction)
    NET_1.setDeserializeFunction(deserializeFunction)
    var result = await testEmit()
    t.ok(true, 'size ' + bytesToSize(result.dataByte))
    t.ok(true, 'time ' + (result.time / 1000) + ' s')
    t.ok(true, 'dict ' + bytesToSize(dictionary.byteLength))
    t.end()
  })

  await t.test('zlib.deflate DICTIONARY: analize data generic', async function (t) {
      // Extract words, remove punctuation (extra: replace(/\s/g, " "))
    function getDictionary (str) {
        // var words = str.replace(/[,\;.:\(\)]/g, '').split(' ').sort()
      var words = str.match(/.{1,10}/g).sort()
      var wcnt = [], w = '', cnt = 0 // pairs, current word, current word count
      for (var i = 0, cnt = 0, w = ''; i < words.length; i++) {
        if (words[i] === w) {
          cnt++ // another match
        } else {
          if (w !== '') {
            wcnt.push([cnt, w])
          } // Push a pair (count, word)
          cnt = 1 // Start counting for this word
          w = words[i] // Start counting again
        }
      }
      if (w !== '') {
        wcnt.push([cnt, w])
          // wcnt.unshift([cnt, w])
      } // Push last word
      wcnt.sort() // Greater matches at the end
        // wcnt.reverse()
      for (var i in wcnt) {
        wcnt[i] = wcnt[i][1]
      } // Just take the words
      var dict = wcnt.join('').slice(-10000)  // Join the words, take last 70 chars
      return dict
    }
      // console.log(JSON.stringify(resultData))
      // console.log(getDictionary(JSON.stringify(testData)))
    var dictionary = new Buffer(getDictionary(JSON.stringify(testData)), 'utf8')
    var serializeFunction = (obj) => zlib.deflateSync(JSON.stringify(obj), {dictionary, level: 1})
    var deserializeFunction = (obj) => JSON.parse(zlib.inflateSync(obj, {dictionary}))
    NET_1.setSerializeFunction(serializeFunction)
    NET_1.setDeserializeFunction(deserializeFunction)
    var result = await testEmit()
    t.ok(true, 'size ' + bytesToSize(result.dataByte))
    t.ok(true, 'time ' + (result.time / 1000) + ' s')
    t.ok(true, 'dict ' + bytesToSize(dictionary.byteLength))
    t.end()
  })
  await t.test('zlib.deflate DICTIONARY: analize data strLength = 120; strLength > 20', async function (t) {
    function getDictionary (strOriginal) {
      console.time('getDictionary')
      var founded = {}
      var str = strOriginal
      for (var strLength = 120; strLength > 20; strLength--) {
        for (var strInit = 0; strInit < strLength; strInit++) {
          var words = R.splitEvery(strLength, str.slice(strInit))// .sort()
          var wordsFiltered = words.filter((word, index) => {
            founded[word] = founded[word] ? founded[word] + 1 : 1
            if (founded[word] > 1) return false
            return true
          })
          str = wordsFiltered.join('')
        }
      }
      founded = R.toPairs(founded)
      founded = R.filter((foundedSingle) => (foundedSingle[1] > 1), founded)
      founded = R.sortBy((foundedSingle) => ((foundedSingle[1] * 1) + (foundedSingle[0].length * 1)), founded)
      founded = founded.slice(0, 100)  // founded.sort().reverse() // Greater matches at the end
      console.timeEnd('getDictionary')
      return founded.join('')
    }
      // console.log(JSON.stringify(resultData))
      // console.log(getDictionary(JSON.stringify(testData)))
    var dictionary = new Buffer(getDictionary(JSON.stringify(testData)), 'utf8')
    var serializeFunction = (obj) => zlib.deflateSync(JSON.stringify(obj), {dictionary, level: 1})
    var deserializeFunction = (obj) => JSON.parse(zlib.inflateSync(obj, {dictionary}))
    NET_1.setSerializeFunction(serializeFunction)
    NET_1.setDeserializeFunction(deserializeFunction)
    var result = await testEmit()
    t.ok(true, 'size ' + bytesToSize(result.dataByte))
    t.ok(true, 'time ' + (result.time / 1000) + ' s')
    t.ok(true, 'dict ' + bytesToSize(dictionary.byteLength))
    t.end()
  })
  await t.test('zlib.deflate DICTIONARY: analize data strLength = 500; strLength > 10', async function (t) {
    function getDictionary (strOriginal) {
      console.time('getDictionary')
      var founded = {}
      var str = strOriginal
      for (var strLength = 500; strLength > 10; strLength--) {
        for (var strInit = 0; strInit < strLength; strInit++) {
          var words = R.splitEvery(strLength, str.slice(strInit))// .sort()
          var wordsFiltered = words.filter((word, index) => {
            founded[word] = founded[word] ? founded[word] + 1 : 1
            if (founded[word] > 1) return false
            return true
          })
          str = wordsFiltered.join('')
        }
      }
      founded = R.toPairs(founded)
      founded = R.filter((foundedSingle) => (foundedSingle[1] > 1), founded)
      founded = R.sortBy((foundedSingle) => ((foundedSingle[1] * 1) + (foundedSingle[0].length * 1)), founded)
      founded = founded.slice(0, 50)  // founded.sort().reverse() // Greater matches at the end
      console.timeEnd('getDictionary')
      return founded.join('')
    }
      // console.log(JSON.stringify(resultData))
      // console.log(getDictionary(JSON.stringify(testData)))
    var dictionary = new Buffer(getDictionary(JSON.stringify(testData)), 'utf8')
    var serializeFunction = (obj) => zlib.deflateSync(JSON.stringify(obj), {dictionary, level: 1})
    var deserializeFunction = (obj) => JSON.parse(zlib.inflateSync(obj, {dictionary}))
    NET_1.setSerializeFunction(serializeFunction)
    NET_1.setDeserializeFunction(deserializeFunction)
    var result = await testEmit()
    t.ok(true, 'size ' + bytesToSize(result.dataByte))
    t.ok(true, 'time ' + (result.time / 1000) + ' s')
    t.ok(true, 'dict ' + bytesToSize(dictionary.byteLength))

    t.end()
  })

  await t.test('zlib.deflate DICTIONARY: rivisitazione algoritmo', async function (t) {
    function getDictionary (strOriginal) {
      console.time('getDictionary')
      var founded = {}

      var strLengthMax = 50
      var strLengthMin = 5
      var str = strOriginal.slice(0, 100000)
      if (strLengthMax > str.length / 2)strLengthMax = Math.floor(str.length / 2)
      for (var strLength = strLengthMax; strLength > strLengthMin; strLength--) {
        for (var strInit = 0; strInit < strLength; strInit++) {
          var words = R.splitEvery(strLength, str.slice(strInit))// .sort()
          // words = words.filter((word) => word.length === strLength)
          words.forEach((word, index) => {
            founded[word] = founded[word] ? founded[word] + 1 : 1
            if (founded[word] > 1) {
              str = str.replace(word, '').replace(word, '')
              // str = str.split(word).join("")
              if (strLengthMax > str.length)strLengthMax = str.length
            // str = str.split(word).join("")
            }
          })
        }
      }
      founded = R.toPairs(founded)
      founded = R.filter((foundedSingle) => (foundedSingle[1] > 1), founded)
      founded = R.sortBy((foundedSingle) => (foundedSingle[1] * 1) + foundedSingle[0].length, founded).reverse()
      console.timeEnd('getDictionary')
      console.log(founded.slice(0, 10))
    // founded = founded.slice(0, 10000).reverse()
      return founded.join('').slice(0, 50000)
    }
    // console.log(JSON.stringify(resultData))
    // console.log(getDictionary(JSON.stringify(testData)))
  // testData = '123456123456123456'
    var dictionary = new Buffer(getDictionary(JSON.stringify(testData)), 'utf8')
    var serializeFunction = (obj) => zlib.deflateSync(JSON.stringify(obj), {dictionary, level: 1})
    var deserializeFunction = (obj) => JSON.parse(zlib.inflateSync(obj, {dictionary}))
    NET_1.setSerializeFunction(serializeFunction)
    NET_1.setDeserializeFunction(deserializeFunction)
    var result = await testEmit()
    t.ok(true, 'size ' + bytesToSize(result.dataByte))
    t.ok(true, 'time ' + (result.time / 1000) + ' s')
    t.ok(true, 'dict ' + bytesToSize(dictionary.byteLength))

    t.end()
  })

  // await t.test('zlib.deflate DICTIONARY: rivisitazione algoritmo 2', async function (t) {
  //   function getDictionary (strOriginal) {
  //     console.time('getDictionary')
  //     var founded = {}
  //
  //     var strLengthMax = 50
  //     var strLengthMin = 5
  //     var str = strOriginal.replace(/[,\;.:\(\)]/g, '').slice(0, 100000)
  //     if (strLengthMax > str.length / 2)strLengthMax = Math.floor(str.length / 2)
  //     for (var strLength = strLengthMax; strLength > strLengthMin; strLength--) {
  //       for (var strInit = 0; strInit < strLength; strInit++) {
  //         var words = R.splitEvery(strLength, str.slice(strInit))// .sort()
  //         // words = words.filter((word) => word.length === strLength)
  //         words.forEach((word, index) => {
  //           founded[word] = founded[word] ? founded[word] + 1 : 1
  //           if (founded[word] > 1) {
  //             str = str.replace(word, '').replace(word, '')
  //             // str = str.split(word).join("")
  //             if (strLengthMax > str.length)strLengthMax = str.length
  //           // str = str.split(word).join("")
  //           }
  //         })
  //       }
  //     }
  //     founded = R.toPairs(founded)
  //     founded = R.filter((foundedSingle) => (foundedSingle[1] > 1), founded)
  //     founded = R.sortBy((foundedSingle) => (foundedSingle[1] * 1) + foundedSingle[0].length, founded).reverse()
  //     console.timeEnd('getDictionary')
  //     // console.log(founded.slice(0, 10))
  //   // founded = founded.slice(0, 10000).reverse()
  //     return founded.join('').slice(0, 50000)
  //   }
  //   // console.log(JSON.stringify(resultData))
  //   // console.log(getDictionary(JSON.stringify(testData)))
  // // testData = '123456123456123456'
  //   var dictionary = new Buffer(getDictionary(JSON.stringify(testData)), 'utf8')
  //   var serializeFunction = (obj) => zlib.deflateSync(JSON.stringify(obj), {dictionary, level: 3})
  //   var deserializeFunction = (obj) => JSON.parse(zlib.inflateSync(obj, {dictionary}))
  //   NET_1.setSerializeFunction(serializeFunction)
  //   NET_1.setDeserializeFunction(deserializeFunction)
  //   var result = await testEmit()
  //   t.ok(true, 'size ' + bytesToSize(result.dataByte))
  //   t.ok(true, 'time ' + (result.time / 1000) + ' s')
  //   t.ok(true, 'dict ' + bytesToSize(dictionary.byteLength))
  //
  //   t.end()
  // })
  // await t.test('zlib.deflate DICTIONARY: rivisitazione algoritmo 3', async function (t) {
  //   function getDictionary (strOriginal) {
  //     console.time('getDictionary')
  //     var founded = {}
  //
  //     var strLengthMax = 40
  //     var strLengthMin = 5
  //     var str = strOriginal.slice(0, 100000)
  //     if (strLengthMax > str.length / 2)strLengthMax = Math.floor(str.length / 2)
  //     for (var strLength = strLengthMax; strLength > strLengthMin; strLength--) {
  //       var words = []
  //       for (var strInit = 0; strInit < strLength; strInit++) {
  //         words = words.concat(R.splitEvery(strLength, str.slice(strInit)))// .sort()
  //       }
  //       words = words.filter((word) => word.length === strLength)
  //       words.forEach((word, index) => {
  //         founded[word] = founded[word] ? founded[word] + 1 : 1
  //         if (founded[word] > 1) {
  //           str = str.replace(word, '').replace(word, '')
  //               // str = str.split(word).join("")
  //           if (strLengthMax > str.length)strLengthMax = str.length
  //             // str = str.split(word).join("")
  //         }
  //       })
  //     }
  //     founded = R.toPairs(founded)
  //     founded = R.filter((foundedSingle) => (foundedSingle[1] > 1), founded)
  //     founded = R.sortBy((foundedSingle) => (foundedSingle[1] * 1) + foundedSingle[0].length, founded).reverse()
  //     console.timeEnd('getDictionary')
  //     console.log(founded.slice(0, 10))
  //     // founded = founded.slice(0, 10000).reverse()
  //     return founded.join('').slice(0, 50000)
  //   }
  //     // console.log(JSON.stringify(resultData))
  //     // console.log(getDictionary(JSON.stringify(testData)))
  //   // testData = '123456123456123456'
  //   var dictionary = new Buffer(getDictionary(JSON.stringify(testData)), 'utf8')
  //   var serializeFunction = (obj) => zlib.deflateSync(JSON.stringify(obj), {dictionary, level: 3})
  //   var deserializeFunction = (obj) => JSON.parse(zlib.inflateSync(obj, {dictionary}))
  //   NET_1.setSerializeFunction(serializeFunction)
  //   NET_1.setDeserializeFunction(deserializeFunction)
  //   var result = await testEmit()
  //   t.ok(true, 'size ' + bytesToSize(result.dataByte))
  //   t.ok(true, 'time ' + (result.time / 1000) + ' s')
  //   t.ok(true, 'dict ' + bytesToSize(dictionary.byteLength))
  //
  //   t.end()
  // })
 //  await t.test('zlib.deflate DICTIONARY: rivisitazione algoritmo 4', async function (t) {
 //    function getDictionary (strOriginal) {
 //      console.time('getDictionary 4')
 //      var founded = {}
 //
 //      var strLengthMax = 30
 //      var strLengthMin = 5
 //      var str = strOriginal.slice(0, 100000)
 //      if (strLengthMax > str.length)strLengthMax = str.length-1
 //      for (var strLength = strLengthMax; strLength > strLengthMin; strLength--) {
 //        var words = []
 //        for (var strInit = 0; strInit < strLength; strInit++) {
 //          var splitted = R.splitEvery(strLength, str.slice(strInit))// .sort()
 //          splitted = splitted.filter((word) => word.length === strLength)
 //          if (!splitted.length) break
 //          splitted.forEach((word, index) => {
 //            if (!words[index])words[index] = []
 //            words[index][strInit]=word
 //          })
 //        }
 //        console.log({strLength, words: words.length})
 //        words.forEach((wordsByStrInit, index) => {
 //          wordsByStrInit.every((word, indexStrInit) => {
 //            //console.log(word, index, indexStrInit)
 //            founded[word] = founded[word] ? founded[word] + 1 : 1
 //            if (founded[word] > 1) {
 //              //console.warn('FOUNDED ', word)
 //              str = str.split(word).join("")
 //              //str = str.replace(word, '').replace(word, '')
 //              if (strLengthMax > str.length)strLengthMax = str.length-1
 //              return false
 //            }
 //            // if (founded[word] >= 1) return false
 //            return true
 //          })
 //        })
 //      }
 //      founded = R.toPairs(founded)
 //      founded = R.filter((foundedSingle) => (foundedSingle[1] > 1), founded)
 //      founded = R.sortBy((foundedSingle) => foundedSingle[1], founded).reverse()
 //      console.timeEnd('getDictionary 4')
 //      //console.log(founded.slice(0, 10))
 // // founded = founded.slice(0, 10000).reverse()
 //      return founded.join('').slice(0, 50000)
 //    }
 //  // console.log(JSON.stringify(resultData))
 //  // console.log(getDictionary(JSON.stringify(testData)))
 //  //  testData = '123456123456123456123456'
 //    var dictionary = new Buffer(getDictionary(JSON.stringify(testData)), 'utf8')
 //    var serializeFunction = (obj) => zlib.deflateSync(JSON.stringify(obj), {dictionary, level: 3})
 //    var deserializeFunction = (obj) => JSON.parse(zlib.inflateSync(obj, {dictionary}))
 //    NET_1.setSerializeFunction(serializeFunction)
 //    NET_1.setDeserializeFunction(deserializeFunction)
 //    var result = await testEmit()
 //    t.ok(true, 'size ' + bytesToSize(result.dataByte))
 //    t.ok(true, 'time ' + (result.time / 1000) + ' s')
 //    t.ok(true, 'dict ' + bytesToSize(dictionary.byteLength))
 //
 //    t.end()
 //  })

// END SERVICE

  SERVICE_1.stop()
  SERVICE_2.stop()
})
// function serializeJson (obj) {
//   // var testType = avro.infer(obj);
//   // return testType.toBuffer(obj)
//   // return zlib.deflateSync(msgpack.pack(obj),{level:1})
//   // return msgpack.pack(obj)
//   // return zlib.gzipSync(msgpack.pack(obj),{level:3})
//   // var result = zlib.deflateSync(JSON.stringify(obj), {dictionary})
//   var result = serializeFunction(obj, dictionary)
//   serializedDataByte += (result.byteLength)
//   return result
//   // console.log(serializedDataByte)
//
//   // return zlib.gzipSync(JSON.stringify(obj),{level:3})
//   // return new Buffer(JSON.stringify(obj))
// }
// function deserializeJson (buffer) {
//   var result = deserializeFunction(buffer, dictionary)
//   return result
//   // var testType = avro.infer(buffer);
//   // return testType.fromBuffer(buffer)
//   // return msgpack.unpack(zlib.inflateSync(buffer))
//   // return msgpack.unpack(buffer)
//   // return msgpack.unpack(zlib.gunzipSync(buffer))
//   // return JSON.parse(zlib.inflateSync(buffer, {dictionary}))
//   // return JSON.parse(zlib.gunzipSync(buffer))
//   // return JSON.parse(buffer.toString())
// }
