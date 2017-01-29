var R = require('ramda')
var sift = require('sift')
var path = require('path')
var fs = require('fs')
const uuidV4 = require('uuid/v4')

var db = {}
var dbFilename
var getCollection = (dbConfig, collectionName) => {
  if (!db[collectionName])db[collectionName] = {}
  return db[collectionName]
}
function getReadableDate () { return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') }
module.exports = async function getStorageTestPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'storage.test'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['storageCollection', 'storageConfig'], PACKAGE)
    DI = checkRequired(DI, ['error', 'log', 'debug'], PACKAGE)
    var storageCollection = await getValuePromise(CONFIG.storageCollection)
    var storageConfig = await getValuePromise(CONFIG.storageConfig)
    var dbFile = path.join(storageConfig.path, getReadableDate() + ' ' + storageCollection + '.json')
    var collection = getCollection(storageConfig, storageCollection)
    async function find ({query, sort, limit, start}) {
      var sifted = sift(query, R.values(collection))
      return sifted
    }
    async function insert ({items}) {
      if (!items || !items.length) throw new Error('No items')
      items.forEach((value) => {
        if (!value._id)value._id = uuidV4()
        collection[value._id] = value
      })
      savefile()
      return true
    }
    function savefile () {
      DI.debug({msg: 'STORAGE TEST WRITE TO DISK ', context: PACKAGE, debug: {dbFile, collection}})
      fs.writeFile(dbFile, JSON.stringify(collection), 'utf8', () => {
        DI.debug({msg: 'STORAGE TEST WRITED TO DISK ', context: PACKAGE, debug: {dbFile, collection}})
      })
      return true
    }
    return {
      insert,
      get: async function get ({ids}) {
        if (!ids) throw new Error('No items ids')
        results = []
        ids.forEach((id) => {
          results[id] = R.clone(collection[id])
        })
        return results
      },
      find,
      update: async function update ({queriesArray, dataArray, insertIfNotExists = false}) {
        queriesArray.forEach(async(query, queryIndex) => {
          var queryResults = await find({query})
          queryResults.forEach((item) => {
            collection[queryIndex] = R.merge(item, dataArray[queryIndex])
          })
          if (!queryResults.length && insertIfNotExists) await insert({items: [dataArray[queryIndex]]})
        })
        savefile()
        return true
      }
    }
  } catch (error) {
    DI.throwError('getStorageTingodbPackage(CONFIG, DI)', error)
  }
}
