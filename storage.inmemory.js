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
                      if (objs) {
                        _context2.next = 2;
                        break;
                      }

                      throw 'No objs';

                    case 2:
                      objs = R.clone(objs);
                      objs.forEach(function (value) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuaW5tZW1vcnkuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2lmdCIsInBhdGgiLCJmcyIsInV1aWRWNCIsImNoZWNrUmVxdWlyZWQiLCJkYiIsImNvbGxlY3Rpb25zIiwiY29sbGVjdGlvbnNTYXZlVGltZW91dCIsImdldFJlYWRhYmxlRGF0ZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInJlcGxhY2UiLCJQQUNLQUdFIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFN0b3JhZ2VUZXN0UGFja2FnZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwic3RvcmFnZUNvbGxlY3Rpb24iLCJzdG9yYWdlQ29uZmlnIiwiZmluZCIsInF1ZXJ5Iiwic29ydCIsImxpbWl0Iiwic3RhcnQiLCJmaWVsZHMiLCJyZXN1bHRzIiwidmFsdWVzIiwiY29sbGVjdGlvbiIsIl9pZCIsIm1hcCIsInJlc3VsdCIsImNsb25lIiwidW51c2VkS2V5cyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJrZXkiLCJmb3JFYWNoIiwidiIsImZvckVhY2hPYmpJbmRleGVkIiwic29ydFZhbHVlIiwic29ydEluZGV4Iiwic29ydEJ5IiwicHJvcCIsInJldmVyc2UiLCJzbGljZSIsIkxPRyIsImRlYnVnIiwiaW5zZXJ0Iiwib2JqcyIsInZhbHVlIiwic2F2ZWZpbGUiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZGJGaWxlIiwid3JpdGVGaWxlIiwiSlNPTiIsInN0cmluZ2lmeSIsImVycm9yVGhyb3ciLCJqb2luIiwiZ2V0IiwiaWRzIiwiaWQiLCJwdXNoIiwidXBkYXRlIiwicXVlcmllc0FycmF5IiwiZGF0YUFycmF5IiwiaW5zZXJ0SWZOb3RFeGlzdHMiLCJxdWVyeUluZGV4IiwicXVlcnlSZXN1bHRzIiwib2JqIiwibWVyZ2UiLCJsZW5ndGgiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFB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RmEsZ0JBaUZQOUQscUNBakZPOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6InN0b3JhZ2UuaW5tZW1vcnkuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgc2lmdCA9IHJlcXVpcmUoJ3NpZnQnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG52YXIgZGIgPSB7Y29sbGVjdGlvbnM6IHt9LCBjb2xsZWN0aW9uc1NhdmVUaW1lb3V0OiB7fX1cbmZ1bmN0aW9uIGdldFJlYWRhYmxlRGF0ZSAoKSB7IHJldHVybiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvVC8sICcgJykucmVwbGFjZSgvXFwuLisvLCAnJykgfVxuY29uc3QgUEFDS0FHRSA9ICdzdG9yYWdlLmlubWVtb3J5J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldFN0b3JhZ2VUZXN0UGFja2FnZSAoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb2xsZWN0aW9uLCBzdG9yYWdlQ29uZmlnfSkge1xuICB0cnkge1xuICAgIHZhciBMT0cgPSByZXF1aXJlKCcuL2plc3VzJykuTE9HKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gICAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG4gICAgY2hlY2tSZXF1aXJlZCh7IHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb2xsZWN0aW9uLCBzdG9yYWdlQ29uZmlnLCAnc3RvcmFnZUNvbmZpZy5wYXRoJzogc3RvcmFnZUNvbmZpZy5wYXRofSwgUEFDS0FHRSlcbiAgICB2YXIgZGJGaWxlID0gcGF0aC5qb2luKHN0b3JhZ2VDb25maWcucGF0aCwgc3RvcmFnZUNvbGxlY3Rpb24gKyAnLmpzb24nKVxuICAgIGlmICghZGIuY29sbGVjdGlvbnNbc3RvcmFnZUNvbGxlY3Rpb25dKWRiLmNvbGxlY3Rpb25zW3N0b3JhZ2VDb2xsZWN0aW9uXSA9IHt9XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBkYi5jb2xsZWN0aW9uc1tzdG9yYWdlQ29sbGVjdGlvbl1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGZpbmQgKHtxdWVyeSwgc29ydCA9IG51bGwsIGxpbWl0ID0gMTAwMCwgc3RhcnQgPSAwLCBmaWVsZHMgPSBudWxsfSkge1xuICAgICAgdmFyIHJlc3VsdHMgPSBzaWZ0KHF1ZXJ5LCBSLnZhbHVlcyhjb2xsZWN0aW9uKSlcbiAgICAgIGlmIChmaWVsZHMpIHtcbiAgICAgICAgZmllbGRzLl9pZCA9IDFcbiAgICAgICAgcmVzdWx0cyA9IFIubWFwKHJlc3VsdCA9PiB7XG4gICAgICAgICAgcmVzdWx0PVIuY2xvbmUocmVzdWx0KVxuICAgICAgICAgIHZhciB1bnVzZWRLZXlzID0gT2JqZWN0LmtleXMocmVzdWx0KS5maWx0ZXIoa2V5ID0+ICFmaWVsZHNba2V5XSlcbiAgICAgICAgICB1bnVzZWRLZXlzLmZvckVhY2godiA9PiBkZWxldGUgcmVzdWx0W3ZdKVxuICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfSxyZXN1bHRzKVxuICAgICAgfVxuICAgICAgaWYgKHNvcnQpIHtcbiAgICAgICAgUi5mb3JFYWNoT2JqSW5kZXhlZCgoc29ydFZhbHVlLCBzb3J0SW5kZXgpID0+IHtcbiAgICAgICAgICAvLyB2YXIgYmVmb3JlID0gUi5jbG9uZShyZXN1bHRzKVxuICAgICAgICAgIHJlc3VsdHMgPSBSLnNvcnRCeShSLnByb3Aoc29ydEluZGV4KSwgcmVzdWx0cylcbiAgICAgICAgICBpZiAoIXNvcnRWYWx1ZSlyZXN1bHRzID0gUi5yZXZlcnNlKHJlc3VsdHMpXG4gICAgICAgICAgLy8gTE9HLmRlYnVnKGBmaW5kKCkgc29ydGluZ2AsIHtzb3J0VmFsdWUsIHNvcnRJbmRleCwgYmVmb3JlLCByZXN1bHRzfSlcbiAgICAgICAgfSwgc29ydClcbiAgICAgIH1cbiAgICAgIHJlc3VsdHMgPSBSLnNsaWNlKHN0YXJ0LCBsaW1pdCArIHN0YXJ0LCByZXN1bHRzKVxuICAgICAgTE9HLmRlYnVnKGBmaW5kKClgLCB7c3RvcmFnZUNvbGxlY3Rpb24sIHF1ZXJ5LCBjb2xsZWN0aW9uLCByZXN1bHRzfSlcbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGluc2VydCAoe29ianN9KSB7XG4gICAgICBpZiAoIW9ianMpIHRocm93ICdObyBvYmpzJ1xuICAgICAgb2JqcyA9IFIuY2xvbmUob2JqcylcbiAgICAgIG9ianMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCF2YWx1ZS5faWQpdmFsdWUuX2lkID0gdXVpZFY0KClcbiAgICAgICAgY29sbGVjdGlvblt2YWx1ZS5faWRdID0gdmFsdWVcbiAgICAgIH0pXG4gICAgICBzYXZlZmlsZSgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBmdW5jdGlvbiBzYXZlZmlsZSAoKSB7XG4gICAgICBpZiAoIWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dKWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dID0ge31cbiAgICAgIGlmIChkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSkgY2xlYXJUaW1lb3V0KGRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dKVxuICAgICAgZGIuY29sbGVjdGlvbnNTYXZlVGltZW91dFtzdG9yYWdlQ29sbGVjdGlvbl0gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgTE9HLmRlYnVnKGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklUSU5HIFRPIExPR1NLIGAsIHtkYkZpbGUsIGNvbGxlY3Rpb259KVxuICAgICAgICBmcy53cml0ZUZpbGUoZGJGaWxlLCBKU09OLnN0cmluZ2lmeShjb2xsZWN0aW9uLCBudWxsLCA0KSwgJ3V0ZjgnLCAoKSA9PiB7XG4gICAgICAgICAgTE9HLmRlYnVnKGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklURUQgVE8gTE9HU0sgYCwge2RiRmlsZX0pXG4gICAgICAgIH0pXG4gICAgICB9LCAxMDAwKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGluc2VydCxcbiAgICAgIGdldDogYXN5bmMgZnVuY3Rpb24gZ2V0ICh7aWRzfSkge1xuICAgICAgICBpZiAoIWlkcykgdGhyb3cgJ05vIG9ianMgaWRzJ1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgIGlkcy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICAgIGlmIChjb2xsZWN0aW9uW2lkXSlyZXN1bHRzLnB1c2goUi5jbG9uZShjb2xsZWN0aW9uW2lkXSkpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9LFxuICAgICAgZmluZCxcbiAgICAgIHVwZGF0ZTogYXN5bmMgZnVuY3Rpb24gdXBkYXRlICh7cXVlcmllc0FycmF5LCBkYXRhQXJyYXksIGluc2VydElmTm90RXhpc3RzID0gZmFsc2V9KSB7XG4gICAgICAgIGRhdGFBcnJheSA9IFIuY2xvbmUoZGF0YUFycmF5KVxuICAgICAgICBxdWVyaWVzQXJyYXkuZm9yRWFjaChhc3luYyhxdWVyeSwgcXVlcnlJbmRleCkgPT4ge1xuICAgICAgICAgIHZhciBxdWVyeVJlc3VsdHMgPSBhd2FpdCBmaW5kKHtxdWVyeX0pXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coe3F1ZXJ5UmVzdWx0c30pXG4gICAgICAgICAgcXVlcnlSZXN1bHRzLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgICAgICAgY29sbGVjdGlvbltvYmouX2lkXSA9IFIubWVyZ2Uob2JqLCBkYXRhQXJyYXlbcXVlcnlJbmRleF0pIC8vIGRhdGFBcnJheVtxdWVyeUluZGV4XS5faWRcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICghcXVlcnlSZXN1bHRzLmxlbmd0aCAmJiBpbnNlcnRJZk5vdEV4aXN0cykgYXdhaXQgaW5zZXJ0KHtvYmpzOiBbZGF0YUFycmF5W3F1ZXJ5SW5kZXhdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIHNhdmVmaWxlKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgTE9HLmVycm9yKGVycm9yKVxuICAgIHRocm93IFBBQ0tBR0UgKyBgIGdldFN0b3JhZ2VUaW5nb2RiUGFja2FnZWBcbiAgfVxufVxuIl19