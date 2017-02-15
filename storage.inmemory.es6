var R = require('ramda')
var sift = require('sift')
var path = require('path')
var fs = require('fs')
const uuidV4 = require('uuid/v4')
const checkRequired = require('./jesus').checkRequired
var db = {collections: {}, collectionsSaveTimeout: {}}
function getReadableDate () { return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') }
var LOG = console

module.exports = async function getStorageTestPackage ({storageCollection, storageConfig}) {
  try {
    const PACKAGE = 'storage.test'
    checkRequired({storageCollection, storageConfig, 'storageConfig.path': storageConfig.path}, PACKAGE)

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
          LOG.debug({msg: `find() sorting`, context: PACKAGE, debug: {sortValue, sortIndex, before, results}})
        }, sort)
      }
      results = R.slice(start, limit + start, results)
      LOG.debug({msg: `find() `, context: PACKAGE, debug: {storageCollection, query, collection, results}})
      return results
    }
    async function insert ({objs}) {
      if (!objs) throw new Error('No objs')
      objs = R.clone(objs)
      objs.forEach((value) => {
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
        LOG.debug({msg: `${storageCollection} WRITING TO LOGSK `, context: PACKAGE, debug: {dbFile, collection}})
        fs.writeFile(dbFile, JSON.stringify(collection, null, 4), 'utf8', () => {
          LOG.debug({msg: `${storageCollection} WRITED TO LOGSK `, context: PACKAGE, debug: {dbFile}})
        })
      }, 1000)
      return true
    }
    return {
      insert,
      get: async function get ({ids}) {
        if (!ids) throw new Error('No objs ids')
        var results = []
        ids.forEach((id) => {
          if(collection[id])results.push(R.clone(collection[id]))
        })
        return results
      },
      find,
      update: async function update ({queriesArray, dataArray, insertIfNotExists = false}) {
        dataArray = R.clone(dataArray)
        queriesArray.forEach(async(query, queryIndex) => {
          var queryResults = await find({query})
          // console.log({queryResults})
          queryResults.forEach((obj) => {
            collection[obj._id] = R.merge(obj, dataArray[queryIndex]) // dataArray[queryIndex]._id
          })
          if (!queryResults.length && insertIfNotExists) await insert({objs: [dataArray[queryIndex]]})
        })
        savefile()
        return true
      }
    }
  } catch (error) {
    LOG.error(PACKAGE, error)
    throw new Error(`getStorageTingodbPackage`)
  }
}
