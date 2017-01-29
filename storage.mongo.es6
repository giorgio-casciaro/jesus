var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
var ObjectID = mongodb.ObjectID
var R = require('ramda')

var checkNullId = (entity) => {
  if (!entity._id) {
    delete entity._id
  }
  return entity
}
var idToString = (id) => id.toString ? id.toString() : id
var toObjectID = (id) => new ObjectID(id)
function old (dbConfig, collectionName) {
  var db = false
  var collection = false

  function debug () {
    console.log('\u001b[1;33m' + `<Mongo ${collection}>` + '\u001b[0m')
    console.log.apply(console, arguments)
  }
  var getCollection = () => {
    return new Promise((resolve, reject) => {
      if (db && collection) resolve(true)
      var url = `mongodb://${(dbConfig.user || '')}${((dbConfig.password) ? ':' : '')}${(dbConfig.password || '')}${(dbConfig.user ? '@' : '')}${(dbConfig.host || 'localhost')}:${(dbConfig.port || 27017)}/${(dbConfig.database)}`
      MongoClient.connect(url, (err, db) => {
        if (err) reject(err)
        collection = db.collection(collectionName)
        resolve(true)
      })
    })
  }
}
module.exports = {
  insert: async({getConfig}, {documents}) => {
    var collection=await getCollection(getConfig())
    return new Promise((resolve, reject) => {
      collection.insertMany(R.map(checkNullId, documents), (err, result) => {
        if (err) return reject(new Error(err.errmsg))
        var returnValue = R.map(idToString, result.insertedIds)
        resolve(returnValue)
      })
    })
  },
  update: async(DI, {queriesArray, dataArray, insertIfNotExists = false}) => {
    await connect()
    return new Promise(function updatePromise (resolve, reject) {
      var bulk = collection.initializeUnorderedBulkOp()
      function updateSingle (id, index) {
        var bulkCommand = bulk.find({ _id: documentsData[index]._id })
        if (insertIfNotExists)bulkCommand = bulkCommand.upsert()
        bulkCommand.updateOne({ $set: documentsData[index] })
      }
      ids.forEach(updateSingle)
      bulk.execute(function (err, result) {
        if (err) return reject(new Error(err.errmsg))
        resolve(result)
      })
    })
  },
  // updateOrInsertOne: async(singleDocument) => {
  //   return new Promise(function updateOrInsertOnePromise (resolve, reject) {
  //     collection.save(checkNullId(singleDocument), (err, result) => {
  //       if (err) return reject(new Error(err.errmsg))
  //       var returnValue = R.map(idToString, result.insertedIds)
  //       resolve(returnValue)
  //     })
  //   })
  // },

  get: async(DI, {ids}) => {
      // debug(ids)
    await connect()
    return new Promise(function getPromise (resolve, reject) {
      collection.find({
        '_id': {
          $in: ids
        }
      }).toArray(function getMongoToArray (err, result) {
        if (err) return reject(new Error(err.errmsg))
        var returnValue = R.map((element) => {
          element._id = idToString(element._id)
          return element
        }, result)
        resolve(returnValue)
      })
    })
  },

  find: async(DI, {query, sort, limit, start}) => {
    await connect()
    return new Promise((resolve, reject) => {
      var mongoCommand = collection.find(query)
      if (sort) mongoCommand = mongoCommand.sort(sort)
      if (start) mongoCommand = mongoCommand.skip(start)
      if (limit) mongoCommand = mongoCommand.limit(sort)
      mongoCommand.toArray((err, result) => {
        if (err) return reject(new Error(err.errmsg))
          // var returnValue = R.map((element) => {
          //   element._id = idToString(element._id)
          //   return element
          // }, result)
        resolve(result)
      })
    })
  },

  delete: async(DI, {ids}) => {
    await connect()
    return new Promise(function deleteCallback (resolve, reject) {
      collection.deleteMany({
        '_id': {
            // $in: R.map(toObjectID, ids)
          $in: ids
        }
      }, (err, result) => {
        var returnValue = result.deletedCount
        if (err) reject(err)
        resolve(returnValue)
      })
    })
  }
}
