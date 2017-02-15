var Db = require('tingodb')().Db
var R = require('ramda')
var checkNullId = (entity) => {
  if (!entity._id) {
    delete entity._id
  }
  return entity
}
var idToString = (id) => id.toString ? id.toString() : id

var getCollection = (dbConfig, collectionName) => {
  var db = new Db(dbConfig.path, {})
  return db.collection(collectionName)
}

module.exports = async function getStorageTingodbPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'storage.tingodb'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['storageCollection', 'storageConfig'], PACKAGE)
    DI = checkRequired(DI, [], PACKAGE)
    var storageCollection = await getValuePromise(CONFIG.storageCollection)
    var storageConfig = await getValuePromise(CONFIG.storageConfig)
    var collection = getCollection(storageConfig, storageCollection)
    return {
      insert: async function insert ({items}) {
        try {
          if(!items||!items.length)throw new Error("No items")
          collection.insertMany(R.map(checkNullId, items), (err, result) => {
            if (err) throw new Error(err.errmsg)
            var returnValue = R.map(idToString, result.insertedIds)
            return returnValue
          })
        } catch (error) {
          DI.throwError(PACKAGE + ' insert(args) ', error, {items})
        }
      }
    }
  } catch (error) {
    DI.throwError('getStorageTingodbPackage(CONFIG, DI)', error)
  }
}
