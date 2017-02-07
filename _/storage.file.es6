var fs = require('fs-extra')
var path = require('path')
var R = require('ramda')

const uuidV4 = require('uuid/v4')
var checkNullId = (entity) => {
  if (!entity._id) {
    delete entity._id
  }
  return entity
}
var idToString = (id) => id.toString ? id.toString() : id

var getCollectionFile = (storageConfig, collection) => {
  var db = new Db(storageConfig.path, {})
  return db.collection(collection)
}

module.exports = async function getStorageFilePackage (CONFIG, DI) {
  try {
    const PACKAGE = 'storage.file'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['storageCollection', 'storageConfig'], PACKAGE)
    DI = checkRequired(DI, ['throwError'], PACKAGE)
    var storageCollection = await getValuePromise(CONFIG.storageCollection)
    var storageConfig = await getValuePromise(CONFIG.storageConfig)
    var collectionFile = path.join(storageConfig.path, storageCollection)
    console.log("collectionFile",collectionFile)
    return {
      insert: function insert ({items}) {
        try {
          var outputJsonPromises = items.map((item) => {
            return new Promise((resolve,reject) => {
              if(! item._id) item._id=uuidV4()
              fs.outputJson(path.join(collectionFile, item._id), item, function (err) {
                if(err)reject(err)
                resolve(true)
              })
            })
          })
          return outputJsonPromises
        } catch (error) {
          DI.throwError(PACKAGE + ' insert(args) ', error, {items})
        }
      }
    }
  } catch (error) {
    DI.throwError('getStorageTingodbPackage(CONFIG, DI)', error)
  }
}
