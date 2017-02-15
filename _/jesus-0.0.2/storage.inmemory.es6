var R = require('ramda')
var sift = require('sift')
var path = require('path')
var fs = require('fs')
const uuidV4 = require('uuid/v4')
var db = global.inMemoryDb = {collections: {}, collectionsSaveTimeout: {}}
function getReadableDate () { return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') }
module.exports = async function getStorageTestPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'storage.test'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['storageCollection', 'storageConfig'], PACKAGE)
    DI = checkRequired(DI, ['throwError', 'log', 'debug'], PACKAGE)

    var storageCollection = await getValuePromise(CONFIG.storageCollection)
    var storageConfig = await getValuePromise(CONFIG.storageConfig)
    var dbFile = path.join(storageConfig.path, storageCollection + '.json')

    if (!db.collections[storageCollection])db.collections[storageCollection] = {}
    var collection = db.collections[storageCollection]

    async function find ({query, sort = null, limit = 1000, start = 0}) {
      // TO FIX
      var results = sift(query, R.values(collection))

      if (sort) {
        R.forEachObjIndexed((sortValue, sortIndex) => {
          var before = R.clone(results)
          results = R.sortBy(R.prop(sortIndex), results)
          if (!sortValue)results = R.reverse(results)
          DI.debug({msg: `find() sorting`, context: PACKAGE, debug: {sortValue, sortIndex, before, results}})
        }, sort)
      }
      results = R.slice(start, limit + start, results)
      DI.debug({msg: `find() `, context: PACKAGE, debug: {storageCollection, query, collection, results}})
      return results
    }
    async function insert ({items}) {
      if (!items || !items.length) throw new Error('No items')
      items = R.clone(items)
      items.forEach((value) => {
        if (!value._id)value._id = uuidV4()
        collection[value._id] = value
      })
      savefile()
      return true
    }
    function savefile () {
      if (!db.collectionsSaveTimeout[storageCollection])db.collectionsSaveTimeout[storageCollection] = {}
      if (db.collectionsSaveTimeout[storageCollection]) clearTimeout(db.collectionsSaveTimeout[storageCollection])
      db.collectionsSaveTimeout[storageCollection] = setTimeout(function () {
        DI.debug({msg: `${storageCollection} WRITING TO DISK `, context: PACKAGE, debug: {dbFile, collection}})
        fs.writeFile(dbFile, JSON.stringify(collection, null, 4), 'utf8', () => {
          DI.debug({msg: `${storageCollection} WRITED TO DISK `, context: PACKAGE, debug: {dbFile}})
        })
      }, 1000)
      return true
    }
    return {
      insert,
      get: async function get ({ids}) {
        if (!ids) throw new Error('No items ids')
        var results = []
        ids.forEach((id) => {
          results.push(R.clone(collection[id]))
        })
        return results
      },
      find,
      update: async function update ({queriesArray, dataArray, insertIfNotExists = false}) {
        dataArray = R.clone(dataArray)
        queriesArray.forEach(async(query, queryIndex) => {
          var queryResults = await find({query})
          //console.log({queryResults})
          queryResults.forEach((item) => {
            collection[item._id] = R.merge(item, dataArray[queryIndex]) //dataArray[queryIndex]._id
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
