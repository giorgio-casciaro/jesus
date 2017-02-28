'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
var sift = require('sift');
var path = require('path');
var fs = require('fs');
var uuidV4 = require('uuid/v4');
var checkRequired = require('./jesus').checkRequired;
var db = { collections: {}, collectionsSaveTimeout: {} };
function getReadableDate() {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
var PACKAGE = 'storage.inmemory';

module.exports = function getStorageTestPackage(_ref) {
  var serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      storageCollection = _ref.storageCollection,
      storageConfig = _ref.storageConfig;

  var LOG, errorThrow, dbFile, collection, _ret;

  return regeneratorRuntime.async(function getStorageTestPackage$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;

          _ret = function () {
            var find = function _callee(_ref2) {
              var query = _ref2.query,
                  _ref2$sort = _ref2.sort,
                  sort = _ref2$sort === undefined ? null : _ref2$sort,
                  _ref2$limit = _ref2.limit,
                  limit = _ref2$limit === undefined ? 1000 : _ref2$limit,
                  _ref2$start = _ref2.start,
                  start = _ref2$start === undefined ? 0 : _ref2$start,
                  _ref2$fields = _ref2.fields,
                  fields = _ref2$fields === undefined ? null : _ref2$fields;
              var results;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      results = sift(query, R.values(collection));

                      if (fields) {
                        fields._id = 1;
                        results = R.map(function (result) {
                          result = R.clone(result);
                          var unusedKeys = Object.keys(result).filter(function (key) {
                            return !fields[key];
                          });
                          unusedKeys.forEach(function (v) {
                            return delete result[v];
                          });
                          return result;
                        }, results);
                      }
                      if (sort) {
                        R.forEachObjIndexed(function (sortValue, sortIndex) {
                          // var before = R.clone(results)
                          results = R.sortBy(R.prop(sortIndex), results);
                          if (!sortValue) results = R.reverse(results);
                          // LOG.debug(`find() sorting`, {sortValue, sortIndex, before, results})
                        }, sort);
                      }
                      results = R.slice(start, limit + start, results);
                      LOG.debug('find()', { storageCollection: storageCollection, query: query, collection: collection, results: results });
                      return _context.abrupt('return', results);

                    case 6:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, null, this);
            };

            var insert = function _callee2(_ref3) {
              var objs = _ref3.objs;
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      LOG.debug(storageCollection + ' DB INSERT ', objs);

                      if (objs) {
                        _context2.next = 3;
                        break;
                      }

                      throw 'No objs';

                    case 3:
                      objs = R.clone(objs);
                      objs.forEach(function (value) {
                        if (!value._id) value._id = uuidV4();
                        collection[value._id] = value;
                      });
                      savefile();
                      return _context2.abrupt('return', true);

                    case 7:
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
                LOG.debug(storageCollection + ' WRITING TO LOGSK ', { dbFile: dbFile, collection: collection });
                fs.writeFile(dbFile, JSON.stringify(collection, null, 4), 'utf8', function () {
                  LOG.debug(storageCollection + ' WRITED TO LOGSK ', { dbFile: dbFile });
                });
              }, 1000);
              return true;
            };

            LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE);
            errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);


            checkRequired({ serviceName: serviceName, serviceId: serviceId, storageCollection: storageCollection, storageConfig: storageConfig, 'storageConfig.path': storageConfig.path }, PACKAGE);
            dbFile = path.join(storageConfig.path, storageCollection + '.json');

            if (!db.collections[storageCollection]) db.collections[storageCollection] = {};
            collection = db.collections[storageCollection];

            return {
              v: {
                insert: insert,
                get: function get(_ref4) {
                  var ids = _ref4.ids;
                  var results;
                  return regeneratorRuntime.async(function get$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          if (ids) {
                            _context3.next = 2;
                            break;
                          }

                          throw 'No objs ids';

                        case 2:
                          results = [];

                          ids.forEach(function (id) {
                            if (collection[id]) results.push(R.clone(collection[id]));
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
                update: function update(_ref5) {
                  var _this = this;

                  var queriesArray = _ref5.queriesArray,
                      dataArray = _ref5.dataArray,
                      _ref5$insertIfNotExis = _ref5.insertIfNotExists,
                      insertIfNotExists = _ref5$insertIfNotExis === undefined ? false : _ref5$insertIfNotExis;
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

                                    // console.log({queryResults})
                                    queryResults.forEach(function (obj) {
                                      collection[obj._id] = R.merge(obj, dataArray[queryIndex]); // dataArray[queryIndex]._id
                                    });

                                    if (!(!queryResults.length && insertIfNotExists)) {
                                      _context4.next = 7;
                                      break;
                                    }

                                    _context4.next = 7;
                                    return regeneratorRuntime.awrap(insert({ objs: [dataArray[queryIndex]] }));

                                  case 7:
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
            };
          }();

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt('return', _ret.v);

        case 4:
          _context6.next = 10;
          break;

        case 6:
          _context6.prev = 6;
          _context6.t0 = _context6['catch'](0);

          LOG.error(_context6.t0);
          throw PACKAGE + ' getStorageTingodbPackage';

        case 10:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, this, [[0, 6]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuaW5tZW1vcnkuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2lmdCIsInBhdGgiLCJmcyIsInV1aWRWNCIsImNoZWNrUmVxdWlyZWQiLCJkYiIsImNvbGxlY3Rpb25zIiwiY29sbGVjdGlvbnNTYXZlVGltZW91dCIsImdldFJlYWRhYmxlRGF0ZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInJlcGxhY2UiLCJQQUNLQUdFIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFN0b3JhZ2VUZXN0UGFja2FnZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwic3RvcmFnZUNvbGxlY3Rpb24iLCJzdG9yYWdlQ29uZmlnIiwiZmluZCIsInF1ZXJ5Iiwic29ydCIsImxpbWl0Iiwic3RhcnQiLCJmaWVsZHMiLCJyZXN1bHRzIiwidmFsdWVzIiwiY29sbGVjdGlvbiIsIl9pZCIsIm1hcCIsInJlc3VsdCIsImNsb25lIiwidW51c2VkS2V5cyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJrZXkiLCJmb3JFYWNoIiwidiIsImZvckVhY2hPYmpJbmRleGVkIiwic29ydFZhbHVlIiwic29ydEluZGV4Iiwic29ydEJ5IiwicHJvcCIsInJldmVyc2UiLCJzbGljZSIsIkxPRyIsImRlYnVnIiwiaW5zZXJ0Iiwib2JqcyIsInZhbHVlIiwic2F2ZWZpbGUiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZGJGaWxlIiwid3JpdGVGaWxlIiwiSlNPTiIsInN0cmluZ2lmeSIsImVycm9yVGhyb3ciLCJqb2luIiwiZ2V0IiwiaWRzIiwiaWQiLCJwdXNoIiwidXBkYXRlIiwicXVlcmllc0FycmF5IiwiZGF0YUFycmF5IiwiaW5zZXJ0SWZOb3RFeGlzdHMiLCJxdWVyeUluZGV4IiwicXVlcnlSZXN1bHRzIiwib2JqIiwibWVyZ2UiLCJsZW5ndGgiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFB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QUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBaUZiTCxjQUFJMkIsS0FBSjtBQWpGYSxnQkFrRlA5RCxxQ0FsRk87O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoic3RvcmFnZS5pbm1lbW9yeS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBzaWZ0ID0gcmVxdWlyZSgnc2lmdCcpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbnZhciBkYiA9IHtjb2xsZWN0aW9uczoge30sIGNvbGxlY3Rpb25zU2F2ZVRpbWVvdXQ6IHt9fVxuZnVuY3Rpb24gZ2V0UmVhZGFibGVEYXRlICgpIHsgcmV0dXJuIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9ULywgJyAnKS5yZXBsYWNlKC9cXC4uKy8sICcnKSB9XG5jb25zdCBQQUNLQUdFID0gJ3N0b3JhZ2UuaW5tZW1vcnknXG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0U3RvcmFnZVRlc3RQYWNrYWdlICh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgc3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWd9KSB7XG4gIHRyeSB7XG4gICAgdmFyIExPRyA9IHJlcXVpcmUoJy4vamVzdXMnKS5MT0coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgICB2YXIgZXJyb3JUaHJvdyA9IHJlcXVpcmUoJy4vamVzdXMnKS5lcnJvclRocm93KHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG5cbiAgICBjaGVja1JlcXVpcmVkKHsgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgc3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWcsICdzdG9yYWdlQ29uZmlnLnBhdGgnOiBzdG9yYWdlQ29uZmlnLnBhdGh9LCBQQUNLQUdFKVxuICAgIHZhciBkYkZpbGUgPSBwYXRoLmpvaW4oc3RvcmFnZUNvbmZpZy5wYXRoLCBzdG9yYWdlQ29sbGVjdGlvbiArICcuanNvbicpXG4gICAgaWYgKCFkYi5jb2xsZWN0aW9uc1tzdG9yYWdlQ29sbGVjdGlvbl0pZGIuY29sbGVjdGlvbnNbc3RvcmFnZUNvbGxlY3Rpb25dID0ge31cbiAgICB2YXIgY29sbGVjdGlvbiA9IGRiLmNvbGxlY3Rpb25zW3N0b3JhZ2VDb2xsZWN0aW9uXVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZmluZCAoe3F1ZXJ5LCBzb3J0ID0gbnVsbCwgbGltaXQgPSAxMDAwLCBzdGFydCA9IDAsIGZpZWxkcyA9IG51bGx9KSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IHNpZnQocXVlcnksIFIudmFsdWVzKGNvbGxlY3Rpb24pKVxuICAgICAgaWYgKGZpZWxkcykge1xuICAgICAgICBmaWVsZHMuX2lkID0gMVxuICAgICAgICByZXN1bHRzID0gUi5tYXAocmVzdWx0ID0+IHtcbiAgICAgICAgICByZXN1bHQ9Ui5jbG9uZShyZXN1bHQpXG4gICAgICAgICAgdmFyIHVudXNlZEtleXMgPSBPYmplY3Qua2V5cyhyZXN1bHQpLmZpbHRlcihrZXkgPT4gIWZpZWxkc1trZXldKVxuICAgICAgICAgIHVudXNlZEtleXMuZm9yRWFjaCh2ID0+IGRlbGV0ZSByZXN1bHRbdl0pXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9LHJlc3VsdHMpXG4gICAgICB9XG4gICAgICBpZiAoc29ydCkge1xuICAgICAgICBSLmZvckVhY2hPYmpJbmRleGVkKChzb3J0VmFsdWUsIHNvcnRJbmRleCkgPT4ge1xuICAgICAgICAgIC8vIHZhciBiZWZvcmUgPSBSLmNsb25lKHJlc3VsdHMpXG4gICAgICAgICAgcmVzdWx0cyA9IFIuc29ydEJ5KFIucHJvcChzb3J0SW5kZXgpLCByZXN1bHRzKVxuICAgICAgICAgIGlmICghc29ydFZhbHVlKXJlc3VsdHMgPSBSLnJldmVyc2UocmVzdWx0cylcbiAgICAgICAgICAvLyBMT0cuZGVidWcoYGZpbmQoKSBzb3J0aW5nYCwge3NvcnRWYWx1ZSwgc29ydEluZGV4LCBiZWZvcmUsIHJlc3VsdHN9KVxuICAgICAgICB9LCBzb3J0KVxuICAgICAgfVxuICAgICAgcmVzdWx0cyA9IFIuc2xpY2Uoc3RhcnQsIGxpbWl0ICsgc3RhcnQsIHJlc3VsdHMpXG4gICAgICBMT0cuZGVidWcoYGZpbmQoKWAsIHtzdG9yYWdlQ29sbGVjdGlvbiwgcXVlcnksIGNvbGxlY3Rpb24sIHJlc3VsdHN9KVxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gaW5zZXJ0ICh7b2Jqc30pIHtcbiAgICAgIExPRy5kZWJ1ZyhgJHtzdG9yYWdlQ29sbGVjdGlvbn0gREIgSU5TRVJUIGAsIG9ianMpXG4gICAgICBpZiAoIW9ianMpIHRocm93ICdObyBvYmpzJ1xuICAgICAgb2JqcyA9IFIuY2xvbmUob2JqcylcbiAgICAgIG9ianMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCF2YWx1ZS5faWQpdmFsdWUuX2lkID0gdXVpZFY0KClcbiAgICAgICAgY29sbGVjdGlvblt2YWx1ZS5faWRdID0gdmFsdWVcbiAgICAgIH0pXG4gICAgICBzYXZlZmlsZSgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBmdW5jdGlvbiBzYXZlZmlsZSAoKSB7XG4gICAgICBpZiAoIWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dKWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dID0ge31cbiAgICAgIGlmIChkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSkgY2xlYXJUaW1lb3V0KGRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dKVxuICAgICAgZGIuY29sbGVjdGlvbnNTYXZlVGltZW91dFtzdG9yYWdlQ29sbGVjdGlvbl0gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgTE9HLmRlYnVnKGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklUSU5HIFRPIExPR1NLIGAsIHtkYkZpbGUsIGNvbGxlY3Rpb259KVxuICAgICAgICBmcy53cml0ZUZpbGUoZGJGaWxlLCBKU09OLnN0cmluZ2lmeShjb2xsZWN0aW9uLCBudWxsLCA0KSwgJ3V0ZjgnLCAoKSA9PiB7XG4gICAgICAgICAgTE9HLmRlYnVnKGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklURUQgVE8gTE9HU0sgYCwge2RiRmlsZX0pXG4gICAgICAgIH0pXG4gICAgICB9LCAxMDAwKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGluc2VydCxcbiAgICAgIGdldDogYXN5bmMgZnVuY3Rpb24gZ2V0ICh7aWRzfSkge1xuICAgICAgICBpZiAoIWlkcykgdGhyb3cgJ05vIG9ianMgaWRzJ1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgIGlkcy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICAgIGlmIChjb2xsZWN0aW9uW2lkXSlyZXN1bHRzLnB1c2goUi5jbG9uZShjb2xsZWN0aW9uW2lkXSkpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9LFxuICAgICAgZmluZCxcbiAgICAgIHVwZGF0ZTogYXN5bmMgZnVuY3Rpb24gdXBkYXRlICh7cXVlcmllc0FycmF5LCBkYXRhQXJyYXksIGluc2VydElmTm90RXhpc3RzID0gZmFsc2V9KSB7XG4gICAgICAgIGRhdGFBcnJheSA9IFIuY2xvbmUoZGF0YUFycmF5KVxuICAgICAgICBxdWVyaWVzQXJyYXkuZm9yRWFjaChhc3luYyhxdWVyeSwgcXVlcnlJbmRleCkgPT4ge1xuICAgICAgICAgIHZhciBxdWVyeVJlc3VsdHMgPSBhd2FpdCBmaW5kKHtxdWVyeX0pXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coe3F1ZXJ5UmVzdWx0c30pXG4gICAgICAgICAgcXVlcnlSZXN1bHRzLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgICAgICAgY29sbGVjdGlvbltvYmouX2lkXSA9IFIubWVyZ2Uob2JqLCBkYXRhQXJyYXlbcXVlcnlJbmRleF0pIC8vIGRhdGFBcnJheVtxdWVyeUluZGV4XS5faWRcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICghcXVlcnlSZXN1bHRzLmxlbmd0aCAmJiBpbnNlcnRJZk5vdEV4aXN0cykgYXdhaXQgaW5zZXJ0KHtvYmpzOiBbZGF0YUFycmF5W3F1ZXJ5SW5kZXhdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIHNhdmVmaWxlKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgTE9HLmVycm9yKGVycm9yKVxuICAgIHRocm93IFBBQ0tBR0UgKyBgIGdldFN0b3JhZ2VUaW5nb2RiUGFja2FnZWBcbiAgfVxufVxuIl19