'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
var sift = require('sift');
var path = require('path');
var fs = require('fs');
var uuidV4 = require('uuid/v4');
var db = global.inMemoryDb = { collections: {}, collectionsSaveTimeout: {} };
function getReadableDate() {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
module.exports = function getStorageTestPackage(CONFIG, DI) {
  var _this2 = this;

  var storageCollection, storageConfig, dbFile, collection, _ret;

  return regeneratorRuntime.async(function getStorageTestPackage$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(function _callee4() {
            var find = function _callee(_ref) {
              var query = _ref.query,
                  _ref$sort = _ref.sort,
                  sort = _ref$sort === undefined ? null : _ref$sort,
                  _ref$limit = _ref.limit,
                  limit = _ref$limit === undefined ? 1000 : _ref$limit,
                  _ref$start = _ref.start,
                  start = _ref$start === undefined ? 0 : _ref$start;
              var results;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      // TO FIX
                      results = sift(query, R.values(collection));


                      if (sort) {
                        R.forEachObjIndexed(function (sortValue, sortIndex) {
                          var before = R.clone(results);
                          results = R.sortBy(R.prop(sortIndex), results);
                          if (!sortValue) results = R.reverse(results);
                          DI.debug({ msg: 'find() sorting', context: PACKAGE, debug: { sortValue: sortValue, sortIndex: sortIndex, before: before, results: results } });
                        }, sort);
                      }
                      results = R.slice(start, limit + start, results);
                      DI.debug({ msg: 'find() ', context: PACKAGE, debug: { storageCollection: storageCollection, query: query, collection: collection, results: results } });
                      return _context.abrupt('return', results);

                    case 5:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, null, this);
            };

            var insert = function _callee2(_ref2) {
              var items = _ref2.items;
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (!(!items || !items.length)) {
                        _context2.next = 2;
                        break;
                      }

                      throw new Error('No items');

                    case 2:
                      items = R.clone(items);
                      items.forEach(function (value) {
                        if (!value._id) value._id = uuidV4();
                        collection[value._id] = value;
                      });
                      savefile();
                      return _context2.abrupt('return', true);

                    case 6:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, null, this);
            };

            var savefile = function savefile() {
              if (!db.collectionsSaveTimeout[storageCollection]) db.collectionsSaveTimeout[storageCollection] = {};
              if (db.collectionsSaveTimeout[storageCollection]) clearTimeout(db.collectionsSaveTimeout[storageCollection]);
              db.collectionsSaveTimeout[storageCollection] = setTimeout(function () {
                DI.debug({ msg: storageCollection + ' WRITING TO DISK ', context: PACKAGE, debug: { dbFile: dbFile, collection: collection } });
                fs.writeFile(dbFile, JSON.stringify(collection, null, 4), 'utf8', function () {
                  DI.debug({ msg: storageCollection + ' WRITED TO DISK ', context: PACKAGE, debug: { dbFile: dbFile } });
                });
              }, 1000);
              return true;
            };

            var PACKAGE, getValuePromise, checkRequired;
            return regeneratorRuntime.async(function _callee4$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    PACKAGE = 'storage.test';
                    getValuePromise = require('./jesus').getValuePromise;
                    checkRequired = require('./jesus').checkRequired;

                    CONFIG = checkRequired(CONFIG, ['storageCollection', 'storageConfig'], PACKAGE);
                    DI = checkRequired(DI, ['throwError', 'log', 'debug'], PACKAGE);

                    _context6.next = 7;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.storageCollection));

                  case 7:
                    storageCollection = _context6.sent;
                    _context6.next = 10;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.storageConfig));

                  case 10:
                    storageConfig = _context6.sent;
                    dbFile = path.join(storageConfig.path, storageCollection + '.json');


                    if (!db.collections[storageCollection]) db.collections[storageCollection] = {};
                    collection = db.collections[storageCollection];
                    return _context6.abrupt('return', {
                      v: {
                        insert: insert,
                        get: function get(_ref3) {
                          var ids = _ref3.ids;
                          var results;
                          return regeneratorRuntime.async(function get$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  if (ids) {
                                    _context3.next = 2;
                                    break;
                                  }

                                  throw new Error('No items ids');

                                case 2:
                                  results = [];

                                  ids.forEach(function (id) {
                                    results.push(R.clone(collection[id]));
                                  });
                                  return _context3.abrupt('return', results);

                                case 5:
                                case 'end':
                                  return _context3.stop();
                              }
                            }
                          }, null, this);
                        },
                        find: find,
                        update: function update(_ref4) {
                          var _this = this;

                          var queriesArray = _ref4.queriesArray,
                              dataArray = _ref4.dataArray,
                              _ref4$insertIfNotExis = _ref4.insertIfNotExists,
                              insertIfNotExists = _ref4$insertIfNotExis === undefined ? false : _ref4$insertIfNotExis;
                          return regeneratorRuntime.async(function update$(_context5) {
                            while (1) {
                              switch (_context5.prev = _context5.next) {
                                case 0:
                                  dataArray = R.clone(dataArray);
                                  queriesArray.forEach(function _callee3(query, queryIndex) {
                                    var queryResults;
                                    return regeneratorRuntime.async(function _callee3$(_context4) {
                                      while (1) {
                                        switch (_context4.prev = _context4.next) {
                                          case 0:
                                            _context4.next = 2;
                                            return regeneratorRuntime.awrap(find({ query: query }));

                                          case 2:
                                            queryResults = _context4.sent;

                                            console.log({ queryResults: queryResults });
                                            queryResults.forEach(function (item) {
                                              collection[item._id] = R.merge(item, dataArray[queryIndex]); //dataArray[queryIndex]._id
                                            });

                                            if (!(!queryResults.length && insertIfNotExists)) {
                                              _context4.next = 8;
                                              break;
                                            }

                                            _context4.next = 8;
                                            return regeneratorRuntime.awrap(insert({ items: [dataArray[queryIndex]] }));

                                          case 8:
                                          case 'end':
                                            return _context4.stop();
                                        }
                                      }
                                    }, null, _this);
                                  });
                                  savefile();
                                  return _context5.abrupt('return', true);

                                case 4:
                                case 'end':
                                  return _context5.stop();
                              }
                            }
                          }, null, this);
                        }
                      }
                    });

                  case 15:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, null, _this2);
          }());

        case 3:
          _ret = _context7.sent;

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt('return', _ret.v);

        case 6:
          _context7.next = 11;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7['catch'](0);

          DI.throwError('getStorageTingodbPackage(CONFIG, DI)', _context7.t0);

        case 11:
        case 'end':
          return _context7.stop();
      }
    }
  }, null, this, [[0, 8]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuaW5tZW1vcnkuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2lmdCIsInBhdGgiLCJmcyIsInV1aWRWNCIsImRiIiwiZ2xvYmFsIiwiaW5NZW1vcnlEYiIsImNvbGxlY3Rpb25zIiwiY29sbGVjdGlvbnNTYXZlVGltZW91dCIsImdldFJlYWRhYmxlRGF0ZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInJlcGxhY2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0U3RvcmFnZVRlc3RQYWNrYWdlIiwiQ09ORklHIiwiREkiLCJmaW5kIiwicXVlcnkiLCJzb3J0IiwibGltaXQiLCJzdGFydCIsInJlc3VsdHMiLCJ2YWx1ZXMiLCJjb2xsZWN0aW9uIiwiZm9yRWFjaE9iakluZGV4ZWQiLCJzb3J0VmFsdWUiLCJzb3J0SW5kZXgiLCJiZWZvcmUiLCJjbG9uZSIsInNvcnRCeSIsInByb3AiLCJyZXZlcnNlIiwiZGVidWciLCJtc2ciLCJjb250ZXh0IiwiUEFDS0FHRSIsInNsaWNlIiwic3RvcmFnZUNvbGxlY3Rpb24iLCJpbnNlcnQiLCJpdGVtcyIsImxlbmd0aCIsIkVycm9yIiwiZm9yRWFjaCIsInZhbHVlIiwiX2lkIiwic2F2ZWZpbGUiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZGJGaWxlIiwid3JpdGVGaWxlIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldFZhbHVlUHJvbWlzZSIsImNoZWNrUmVxdWlyZWQiLCJzdG9yYWdlQ29uZmlnIiwiam9pbiIsImdldCIsImlkcyIsImlkIiwicHVzaCIsInVwZGF0ZSIsInF1ZXJpZXNBcnJheSIsImRhdGFBcnJheSIsImluc2VydElmTm90RXhpc3RzIiwicXVlcnlJbmRleCIsInF1ZXJ5UmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciLCJpdGVtIiwibWVyZ2UiLCJ0aHJvd0Vycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJQyxPQUFP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O0FBQUE7O0FBOEViOUIsYUFBR3VELFVBQUgsQ0FBYyxzQ0FBZDs7QUE5RWE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoic3RvcmFnZS5pbm1lbW9yeS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBzaWZ0ID0gcmVxdWlyZSgnc2lmdCcpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG52YXIgZGIgPSBnbG9iYWwuaW5NZW1vcnlEYiA9IHtjb2xsZWN0aW9uczoge30sIGNvbGxlY3Rpb25zU2F2ZVRpbWVvdXQ6IHt9fVxuZnVuY3Rpb24gZ2V0UmVhZGFibGVEYXRlICgpIHsgcmV0dXJuIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9ULywgJyAnKS5yZXBsYWNlKC9cXC4uKy8sICcnKSB9XG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldFN0b3JhZ2VUZXN0UGFja2FnZSAoQ09ORklHLCBESSkge1xuICB0cnkge1xuICAgIGNvbnN0IFBBQ0tBR0UgPSAnc3RvcmFnZS50ZXN0J1xuICAgIGNvbnN0IGdldFZhbHVlUHJvbWlzZSA9IHJlcXVpcmUoJy4vamVzdXMnKS5nZXRWYWx1ZVByb21pc2VcbiAgICBjb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbiAgICBDT05GSUcgPSBjaGVja1JlcXVpcmVkKENPTkZJRywgWydzdG9yYWdlQ29sbGVjdGlvbicsICdzdG9yYWdlQ29uZmlnJ10sIFBBQ0tBR0UpXG4gICAgREkgPSBjaGVja1JlcXVpcmVkKERJLCBbJ3Rocm93RXJyb3InLCAnbG9nJywgJ2RlYnVnJ10sIFBBQ0tBR0UpXG5cbiAgICB2YXIgc3RvcmFnZUNvbGxlY3Rpb24gPSBhd2FpdCBnZXRWYWx1ZVByb21pc2UoQ09ORklHLnN0b3JhZ2VDb2xsZWN0aW9uKVxuICAgIHZhciBzdG9yYWdlQ29uZmlnID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5zdG9yYWdlQ29uZmlnKVxuICAgIHZhciBkYkZpbGUgPSBwYXRoLmpvaW4oc3RvcmFnZUNvbmZpZy5wYXRoLCBzdG9yYWdlQ29sbGVjdGlvbiArICcuanNvbicpXG5cbiAgICBpZiAoIWRiLmNvbGxlY3Rpb25zW3N0b3JhZ2VDb2xsZWN0aW9uXSlkYi5jb2xsZWN0aW9uc1tzdG9yYWdlQ29sbGVjdGlvbl0gPSB7fVxuICAgIHZhciBjb2xsZWN0aW9uID0gZGIuY29sbGVjdGlvbnNbc3RvcmFnZUNvbGxlY3Rpb25dXG5cbiAgICBhc3luYyBmdW5jdGlvbiBmaW5kICh7cXVlcnksIHNvcnQgPSBudWxsLCBsaW1pdCA9IDEwMDAsIHN0YXJ0ID0gMH0pIHtcbiAgICAgIC8vIFRPIEZJWFxuICAgICAgdmFyIHJlc3VsdHMgPSBzaWZ0KHF1ZXJ5LCBSLnZhbHVlcyhjb2xsZWN0aW9uKSlcblxuICAgICAgaWYgKHNvcnQpIHtcbiAgICAgICAgUi5mb3JFYWNoT2JqSW5kZXhlZCgoc29ydFZhbHVlLCBzb3J0SW5kZXgpID0+IHtcbiAgICAgICAgICB2YXIgYmVmb3JlID0gUi5jbG9uZShyZXN1bHRzKVxuICAgICAgICAgIHJlc3VsdHMgPSBSLnNvcnRCeShSLnByb3Aoc29ydEluZGV4KSwgcmVzdWx0cylcbiAgICAgICAgICBpZiAoIXNvcnRWYWx1ZSlyZXN1bHRzID0gUi5yZXZlcnNlKHJlc3VsdHMpXG4gICAgICAgICAgREkuZGVidWcoe21zZzogYGZpbmQoKSBzb3J0aW5nYCwgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtzb3J0VmFsdWUsIHNvcnRJbmRleCwgYmVmb3JlLCByZXN1bHRzfX0pXG4gICAgICAgIH0sIHNvcnQpXG4gICAgICB9XG4gICAgICByZXN1bHRzID0gUi5zbGljZShzdGFydCwgbGltaXQgKyBzdGFydCwgcmVzdWx0cylcbiAgICAgIERJLmRlYnVnKHttc2c6IGBmaW5kKCkgYCwgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtzdG9yYWdlQ29sbGVjdGlvbiwgcXVlcnksIGNvbGxlY3Rpb24sIHJlc3VsdHN9fSlcbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGluc2VydCAoe2l0ZW1zfSkge1xuICAgICAgaWYgKCFpdGVtcyB8fCAhaXRlbXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ05vIGl0ZW1zJylcbiAgICAgIGl0ZW1zID0gUi5jbG9uZShpdGVtcylcbiAgICAgIGl0ZW1zLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUuX2lkKXZhbHVlLl9pZCA9IHV1aWRWNCgpXG4gICAgICAgIGNvbGxlY3Rpb25bdmFsdWUuX2lkXSA9IHZhbHVlXG4gICAgICB9KVxuICAgICAgc2F2ZWZpbGUoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgZnVuY3Rpb24gc2F2ZWZpbGUgKCkge1xuICAgICAgaWYgKCFkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSlkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSA9IHt9XG4gICAgICBpZiAoZGIuY29sbGVjdGlvbnNTYXZlVGltZW91dFtzdG9yYWdlQ29sbGVjdGlvbl0pIGNsZWFyVGltZW91dChkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSlcbiAgICAgIGRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIERJLmRlYnVnKHttc2c6IGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklUSU5HIFRPIERJU0sgYCwgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtkYkZpbGUsIGNvbGxlY3Rpb259fSlcbiAgICAgICAgZnMud3JpdGVGaWxlKGRiRmlsZSwgSlNPTi5zdHJpbmdpZnkoY29sbGVjdGlvbiwgbnVsbCwgNCksICd1dGY4JywgKCkgPT4ge1xuICAgICAgICAgIERJLmRlYnVnKHttc2c6IGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklURUQgVE8gRElTSyBgLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge2RiRmlsZX19KVxuICAgICAgICB9KVxuICAgICAgfSwgMTAwMClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBpbnNlcnQsXG4gICAgICBnZXQ6IGFzeW5jIGZ1bmN0aW9uIGdldCAoe2lkc30pIHtcbiAgICAgICAgaWYgKCFpZHMpIHRocm93IG5ldyBFcnJvcignTm8gaXRlbXMgaWRzJylcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXVxuICAgICAgICBpZHMuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgICAgICByZXN1bHRzLnB1c2goUi5jbG9uZShjb2xsZWN0aW9uW2lkXSkpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9LFxuICAgICAgZmluZCxcbiAgICAgIHVwZGF0ZTogYXN5bmMgZnVuY3Rpb24gdXBkYXRlICh7cXVlcmllc0FycmF5LCBkYXRhQXJyYXksIGluc2VydElmTm90RXhpc3RzID0gZmFsc2V9KSB7XG4gICAgICAgIGRhdGFBcnJheSA9IFIuY2xvbmUoZGF0YUFycmF5KVxuICAgICAgICBxdWVyaWVzQXJyYXkuZm9yRWFjaChhc3luYyhxdWVyeSwgcXVlcnlJbmRleCkgPT4ge1xuICAgICAgICAgIHZhciBxdWVyeVJlc3VsdHMgPSBhd2FpdCBmaW5kKHtxdWVyeX0pXG4gICAgICAgICAgY29uc29sZS5sb2coe3F1ZXJ5UmVzdWx0c30pXG4gICAgICAgICAgcXVlcnlSZXN1bHRzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb25baXRlbS5faWRdID0gUi5tZXJnZShpdGVtLCBkYXRhQXJyYXlbcXVlcnlJbmRleF0pIC8vZGF0YUFycmF5W3F1ZXJ5SW5kZXhdLl9pZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKCFxdWVyeVJlc3VsdHMubGVuZ3RoICYmIGluc2VydElmTm90RXhpc3RzKSBhd2FpdCBpbnNlcnQoe2l0ZW1zOiBbZGF0YUFycmF5W3F1ZXJ5SW5kZXhdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIHNhdmVmaWxlKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0U3RvcmFnZVRpbmdvZGJQYWNrYWdlKENPTkZJRywgREkpJywgZXJyb3IpXG4gIH1cbn1cbiJdfQ==