'use strict';

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var R = require('ramda');

var checkNullId = function checkNullId(entity) {
  if (!entity._id) {
    delete entity._id;
  }
  return entity;
};
var idToString = function idToString(id) {
  return id.toString ? id.toString() : id;
};
var toObjectID = function toObjectID(id) {
  return new ObjectID(id);
};
function old(dbConfig, collectionName) {
  var db = false;
  var collection = false;

  function debug() {
    console.log('\x1B[1;33m' + ('<Mongo ' + collection + '>') + '\x1B[0m');
    console.log.apply(console, arguments);
  }
  var getCollection = function getCollection() {
    return new Promise(function (resolve, reject) {
      if (db && collection) resolve(true);
      var url = 'mongodb://' + (dbConfig.user || '') + (dbConfig.password ? ':' : '') + (dbConfig.password || '') + (dbConfig.user ? '@' : '') + (dbConfig.host || 'localhost') + ':' + (dbConfig.port || 27017) + '/' + dbConfig.database;
      MongoClient.connect(url, function (err, db) {
        if (err) reject(err);
        collection = db.collection(collectionName);
        resolve(true);
      });
    });
  };
}
module.exports = {
  insert: function insert(_ref, _ref2) {
    var getConfig = _ref.getConfig;
    var documents = _ref2.documents;
    var collection;
    return regeneratorRuntime.async(function insert$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(getCollection(getConfig()));

          case 2:
            collection = _context.sent;
            return _context.abrupt('return', new Promise(function (resolve, reject) {
              collection.insertMany(R.map(checkNullId, documents), function (err, result) {
                if (err) return reject(new Error(err.errmsg));
                var returnValue = R.map(idToString, result.insertedIds);
                resolve(returnValue);
              });
            }));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, null, undefined);
  },
  update: function update(DI, _ref3) {
    var queriesArray = _ref3.queriesArray,
        dataArray = _ref3.dataArray,
        _ref3$insertIfNotExis = _ref3.insertIfNotExists,
        insertIfNotExists = _ref3$insertIfNotExis === undefined ? false : _ref3$insertIfNotExis;
    return regeneratorRuntime.async(function update$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(connect());

          case 2:
            return _context2.abrupt('return', new Promise(function updatePromise(resolve, reject) {
              var bulk = collection.initializeUnorderedBulkOp();
              function updateSingle(id, index) {
                var bulkCommand = bulk.find({ _id: documentsData[index]._id });
                if (insertIfNotExists) bulkCommand = bulkCommand.upsert();
                bulkCommand.updateOne({ $set: documentsData[index] });
              }
              ids.forEach(updateSingle);
              bulk.execute(function (err, result) {
                if (err) return reject(new Error(err.errmsg));
                resolve(result);
              });
            }));

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, undefined);
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

  get: function get(DI, _ref4) {
    var ids = _ref4.ids;
    return regeneratorRuntime.async(function get$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(connect());

          case 2:
            return _context3.abrupt('return', new Promise(function getPromise(resolve, reject) {
              collection.find({
                '_id': {
                  $in: ids
                }
              }).toArray(function getMongoToArray(err, result) {
                if (err) return reject(new Error(err.errmsg));
                var returnValue = R.map(function (element) {
                  element._id = idToString(element._id);
                  return element;
                }, result);
                resolve(returnValue);
              });
            }));

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, null, undefined);
  },

  find: function find(DI, _ref5) {
    var query = _ref5.query,
        sort = _ref5.sort,
        limit = _ref5.limit,
        start = _ref5.start;
    return regeneratorRuntime.async(function find$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(connect());

          case 2:
            return _context4.abrupt('return', new Promise(function (resolve, reject) {
              var mongoCommand = collection.find(query);
              if (sort) mongoCommand = mongoCommand.sort(sort);
              if (start) mongoCommand = mongoCommand.skip(start);
              if (limit) mongoCommand = mongoCommand.limit(sort);
              mongoCommand.toArray(function (err, result) {
                if (err) return reject(new Error(err.errmsg));
                // var returnValue = R.map((element) => {
                //   element._id = idToString(element._id)
                //   return element
                // }, result)
                resolve(result);
              });
            }));

          case 3:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, undefined);
  },

  delete: function _delete(DI, _ref6) {
    var ids = _ref6.ids;
    return regeneratorRuntime.async(function _delete$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(connect());

          case 2:
            return _context5.abrupt('return', new Promise(function deleteCallback(resolve, reject) {
              collection.deleteMany({
                '_id': {
                  // $in: R.map(toObjectID, ids)
                  $in: ids
                }
              }, function (err, result) {
                var returnValue = result.deletedCount;
                if (err) reject(err);
                resolve(returnValue);
              });
            }));

          case 3:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, undefined);
  }
};