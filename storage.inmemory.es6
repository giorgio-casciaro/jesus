var R = require('ramda')
var sift = require('sift')
var path = require('path')
var fs = require('fs')
const uuidV4 = require('uuid/v4')
const checkRequired = require('./jesus').checkRequired
var db = global.db = global.db || {collections: {}, collectionsSaveTimeout: {}}
function getReadableDate () { return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') }
const PACKAGE = 'storage.inmemory'

module.exports = function getStorageTestPackage ({getConsole, serviceName, serviceId, storageConfig}) {
  try {
    var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
    var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE)

    checkRequired({ serviceName, serviceId, storageConfig, 'storageConfig.path': storageConfig.path}, PACKAGE)
    function getCollection (collectionName) {
      //checkRequired({ collectionName }, PACKAGE)
      if (!db.collections[collectionName])db.collections[collectionName] = {}
      return db.collections[collectionName]
    }

    async function find ({collectionName, query, sort = null, limit = 1000, start = 0, fields = null}) {
      var collection = getCollection(collectionName)
      var results = sift(query, R.values(collection))
      if (fields) {
        fields._id = 1
        results = R.map(result => {
          result = R.clone(result)
          var unusedKeys = Object.keys(result).filter(key => !fields[key])
          unusedKeys.forEach(v => delete result[v])
          return result
        }, results)
      }
      if (sort) {
        R.forEachObjIndexed((sortValue, sortIndex) => {
          // var before = R.clone(results)
          results = R.sortBy(R.prop(sortIndex), results)
          if (!sortValue)results = R.reverse(results)
          // CONSOLE.debug(`find() sorting`, {sortValue, sortIndex, before, results})
        }, sort)
      }
      results = R.slice(start, limit + start, results)
      CONSOLE.debug(`find()`, {collectionName, query, collection, results})
      return results
    }
    async function insert ({collectionName, objs}) {
      var collection = getCollection(collectionName)
      CONSOLE.debug(`${collectionName} DB INSERT `, objs)
      if (!objs) throw 'No objs'
      objs = R.clone(objs)
      objs.forEach((value) => {
        if (!value._id)value._id = uuidV4()
        collection[value._id] = value
      })
      savefile(collectionName)
      return objs
    }
    function savefile (collectionName) {
      var dbFile = path.join(storageConfig.path, collectionName + '.json')
      if (!db.collectionsSaveTimeout[collectionName])db.collectionsSaveTimeout[collectionName] = {}
      if (db.collectionsSaveTimeout[collectionName]) clearTimeout(db.collectionsSaveTimeout[collectionName])
      db.collectionsSaveTimeout[collectionName] = setTimeout(function () {
        var collection = getCollection(collectionName)
        CONSOLE.debug(`${collectionName} WRITING TO LOGSK `, {dbFile, collection})
        fs.writeFile(dbFile, JSON.stringify(collection, null, 4), 'utf8', () => {
          CONSOLE.debug(`${collectionName} WRITED TO LOGSK `, {dbFile})
        })
      }, 1000)
      return true
    }
    return {
      insert,
      get: async function get ({collectionName, ids}) {
        if (!ids) throw 'No objs ids'
        var collection = getCollection(collectionName)
        var results = []
        ids.forEach((id) => {
          if (collection[id])results.push(R.clone(collection[id]))
        })
        return results
      },
      find,
      update: async function update ({collectionName, queriesArray, dataArray, insertIfNotExists = false}) {
        CONSOLE.debug(`update `, {collectionName, queriesArray, dataArray, insertIfNotExists})
        dataArray = R.clone(dataArray)
        var collection = getCollection(collectionName)
        queriesArray.forEach(async(query, queryIndex) => {
          var queryResults = await find({collectionName,query})
          // console.log({queryResults})
          queryResults.forEach((obj) => {
            collection[obj._id] = R.merge(obj, dataArray[queryIndex]) // dataArray[queryIndex]._id
          })
          if (!queryResults.length && insertIfNotExists) await insert({collectionName,objs: [dataArray[queryIndex]]})
        })
        savefile(collectionName)
        return true
      }
    }
  } catch (error) {
    CONSOLE.error(error)
    throw PACKAGE + ` getStorageTingodbPackage`
  }
}
