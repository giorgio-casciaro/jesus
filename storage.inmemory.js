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
  var getConsole = _ref.getConsole,
      serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      storageCollection = _ref.storageCollection,
      storageConfig = _ref.storageConfig;

  var CONSOLE, errorThrow, dbFile, collection, _ret;

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
                          // CONSOLE.debug(`find() sorting`, {sortValue, sortIndex, before, results})
                        }, sort);
                      }
                      results = R.slice(start, limit + start, results);
                      CONSOLE.debug('find()', { storageCollection: storageCollection, query: query, collection: collection, results: results });
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
                      CONSOLE.debug(storageCollection + ' DB INSERT ', objs);

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
                CONSOLE.debug(storageCollection + ' WRITING TO LOGSK ', { dbFile: dbFile, collection: collection });
                fs.writeFile(dbFile, JSON.stringify(collection, null, 4), 'utf8', function () {
                  CONSOLE.debug(storageCollection + ' WRITED TO LOGSK ', { dbFile: dbFile });
                });
              }, 1000);
              return true;
            };

            CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
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

          CONSOLE.error(_context6.t0);
          throw PACKAGE + ' getStorageTingodbPackage';

        case 10:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, this, [[0, 6]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuaW5tZW1vcnkuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2lmdCIsInBhdGgiLCJmcyIsInV1aWRWNCIsImNoZWNrUmVxdWlyZWQiLCJkYiIsImNvbGxlY3Rpb25zIiwiY29sbGVjdGlvbnNTYXZlVGltZW91dCIsImdldFJlYWRhYmxlRGF0ZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInJlcGxhY2UiLCJQQUNLQUdFIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFN0b3JhZ2VUZXN0UGFja2FnZSIsImdldENvbnNvbGUiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsInN0b3JhZ2VDb2xsZWN0aW9uIiwic3RvcmFnZUNvbmZpZyIsImZpbmQiLCJxdWVyeSIsInNvcnQiLCJsaW1pdCIsInN0YXJ0IiwiZmllbGRzIiwicmVzdWx0cyIsInZhbHVlcyIsImNvbGxlY3Rpb24iLCJfaWQiLCJtYXAiLCJyZXN1bHQiLCJjbG9uZSIsInVudXNlZEtleXMiLCJPYmplY3QiLCJrZXlzIiwiZmlsdGVyIiwia2V5IiwiZm9yRWFjaCIsInYiLCJmb3JFYWNoT2JqSW5kZXhlZCIsInNvcnRWYWx1ZSIsInNvcnRJbmRleCIsInNvcnRCeSIsInByb3AiLCJyZXZlcnNlIiwic2xpY2UiLCJDT05TT0xFIiwiZGVidWciLCJpbnNlcnQiLCJvYmpzIiwidmFsdWUiLCJzYXZlZmlsZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJkYkZpbGUiLCJ3cml0ZUZpbGUiLCJKU09OIiwic3RyaW5naWZ5IiwiZXJyb3JUaHJvdyIsImpvaW4iLCJnZXQiLCJpZHMiLCJpZCIsInB1c2giLCJ1cGRhdGUiLCJxdWVyaWVzQXJyYXkiLCJkYXRhQXJyYXkiLCJpbnNlcnRJZk5vdEV4aXN0cyIsInF1ZXJ5SW5kZXgiLCJxdWVyeVJlc3VsdHMiLCJvYmoiLCJtZXJnZSIsImxlbmd0aCIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxP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QUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBaUZiTCxrQkFBUTJCLEtBQVI7QUFqRmEsZ0JBa0ZQL0QscUNBbEZPOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6InN0b3JhZ2UuaW5tZW1vcnkuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgc2lmdCA9IHJlcXVpcmUoJ3NpZnQnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG52YXIgZGIgPSB7Y29sbGVjdGlvbnM6IHt9LCBjb2xsZWN0aW9uc1NhdmVUaW1lb3V0OiB7fX1cbmZ1bmN0aW9uIGdldFJlYWRhYmxlRGF0ZSAoKSB7IHJldHVybiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvVC8sICcgJykucmVwbGFjZSgvXFwuLisvLCAnJykgfVxuY29uc3QgUEFDS0FHRSA9ICdzdG9yYWdlLmlubWVtb3J5J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldFN0b3JhZ2VUZXN0UGFja2FnZSAoe2dldENvbnNvbGUsc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgc3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWd9KSB7XG4gIHRyeSB7XG4gICAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gICAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG4gICAgY2hlY2tSZXF1aXJlZCh7IHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb2xsZWN0aW9uLCBzdG9yYWdlQ29uZmlnLCAnc3RvcmFnZUNvbmZpZy5wYXRoJzogc3RvcmFnZUNvbmZpZy5wYXRofSwgUEFDS0FHRSlcbiAgICB2YXIgZGJGaWxlID0gcGF0aC5qb2luKHN0b3JhZ2VDb25maWcucGF0aCwgc3RvcmFnZUNvbGxlY3Rpb24gKyAnLmpzb24nKVxuICAgIGlmICghZGIuY29sbGVjdGlvbnNbc3RvcmFnZUNvbGxlY3Rpb25dKWRiLmNvbGxlY3Rpb25zW3N0b3JhZ2VDb2xsZWN0aW9uXSA9IHt9XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBkYi5jb2xsZWN0aW9uc1tzdG9yYWdlQ29sbGVjdGlvbl1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGZpbmQgKHtxdWVyeSwgc29ydCA9IG51bGwsIGxpbWl0ID0gMTAwMCwgc3RhcnQgPSAwLCBmaWVsZHMgPSBudWxsfSkge1xuICAgICAgdmFyIHJlc3VsdHMgPSBzaWZ0KHF1ZXJ5LCBSLnZhbHVlcyhjb2xsZWN0aW9uKSlcbiAgICAgIGlmIChmaWVsZHMpIHtcbiAgICAgICAgZmllbGRzLl9pZCA9IDFcbiAgICAgICAgcmVzdWx0cyA9IFIubWFwKHJlc3VsdCA9PiB7XG4gICAgICAgICAgcmVzdWx0PVIuY2xvbmUocmVzdWx0KVxuICAgICAgICAgIHZhciB1bnVzZWRLZXlzID0gT2JqZWN0LmtleXMocmVzdWx0KS5maWx0ZXIoa2V5ID0+ICFmaWVsZHNba2V5XSlcbiAgICAgICAgICB1bnVzZWRLZXlzLmZvckVhY2godiA9PiBkZWxldGUgcmVzdWx0W3ZdKVxuICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfSxyZXN1bHRzKVxuICAgICAgfVxuICAgICAgaWYgKHNvcnQpIHtcbiAgICAgICAgUi5mb3JFYWNoT2JqSW5kZXhlZCgoc29ydFZhbHVlLCBzb3J0SW5kZXgpID0+IHtcbiAgICAgICAgICAvLyB2YXIgYmVmb3JlID0gUi5jbG9uZShyZXN1bHRzKVxuICAgICAgICAgIHJlc3VsdHMgPSBSLnNvcnRCeShSLnByb3Aoc29ydEluZGV4KSwgcmVzdWx0cylcbiAgICAgICAgICBpZiAoIXNvcnRWYWx1ZSlyZXN1bHRzID0gUi5yZXZlcnNlKHJlc3VsdHMpXG4gICAgICAgICAgLy8gQ09OU09MRS5kZWJ1ZyhgZmluZCgpIHNvcnRpbmdgLCB7c29ydFZhbHVlLCBzb3J0SW5kZXgsIGJlZm9yZSwgcmVzdWx0c30pXG4gICAgICAgIH0sIHNvcnQpXG4gICAgICB9XG4gICAgICByZXN1bHRzID0gUi5zbGljZShzdGFydCwgbGltaXQgKyBzdGFydCwgcmVzdWx0cylcbiAgICAgIENPTlNPTEUuZGVidWcoYGZpbmQoKWAsIHtzdG9yYWdlQ29sbGVjdGlvbiwgcXVlcnksIGNvbGxlY3Rpb24sIHJlc3VsdHN9KVxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gaW5zZXJ0ICh7b2Jqc30pIHtcbiAgICAgIENPTlNPTEUuZGVidWcoYCR7c3RvcmFnZUNvbGxlY3Rpb259IERCIElOU0VSVCBgLCBvYmpzKVxuICAgICAgaWYgKCFvYmpzKSB0aHJvdyAnTm8gb2JqcydcbiAgICAgIG9ianMgPSBSLmNsb25lKG9ianMpXG4gICAgICBvYmpzLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUuX2lkKXZhbHVlLl9pZCA9IHV1aWRWNCgpXG4gICAgICAgIGNvbGxlY3Rpb25bdmFsdWUuX2lkXSA9IHZhbHVlXG4gICAgICB9KVxuICAgICAgc2F2ZWZpbGUoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgZnVuY3Rpb24gc2F2ZWZpbGUgKCkge1xuICAgICAgaWYgKCFkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSlkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSA9IHt9XG4gICAgICBpZiAoZGIuY29sbGVjdGlvbnNTYXZlVGltZW91dFtzdG9yYWdlQ29sbGVjdGlvbl0pIGNsZWFyVGltZW91dChkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSlcbiAgICAgIGRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoYCR7c3RvcmFnZUNvbGxlY3Rpb259IFdSSVRJTkcgVE8gTE9HU0sgYCwge2RiRmlsZSwgY29sbGVjdGlvbn0pXG4gICAgICAgIGZzLndyaXRlRmlsZShkYkZpbGUsIEpTT04uc3RyaW5naWZ5KGNvbGxlY3Rpb24sIG51bGwsIDQpLCAndXRmOCcsICgpID0+IHtcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklURUQgVE8gTE9HU0sgYCwge2RiRmlsZX0pXG4gICAgICAgIH0pXG4gICAgICB9LCAxMDAwKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGluc2VydCxcbiAgICAgIGdldDogYXN5bmMgZnVuY3Rpb24gZ2V0ICh7aWRzfSkge1xuICAgICAgICBpZiAoIWlkcykgdGhyb3cgJ05vIG9ianMgaWRzJ1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgIGlkcy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICAgIGlmIChjb2xsZWN0aW9uW2lkXSlyZXN1bHRzLnB1c2goUi5jbG9uZShjb2xsZWN0aW9uW2lkXSkpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9LFxuICAgICAgZmluZCxcbiAgICAgIHVwZGF0ZTogYXN5bmMgZnVuY3Rpb24gdXBkYXRlICh7cXVlcmllc0FycmF5LCBkYXRhQXJyYXksIGluc2VydElmTm90RXhpc3RzID0gZmFsc2V9KSB7XG4gICAgICAgIGRhdGFBcnJheSA9IFIuY2xvbmUoZGF0YUFycmF5KVxuICAgICAgICBxdWVyaWVzQXJyYXkuZm9yRWFjaChhc3luYyhxdWVyeSwgcXVlcnlJbmRleCkgPT4ge1xuICAgICAgICAgIHZhciBxdWVyeVJlc3VsdHMgPSBhd2FpdCBmaW5kKHtxdWVyeX0pXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coe3F1ZXJ5UmVzdWx0c30pXG4gICAgICAgICAgcXVlcnlSZXN1bHRzLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgICAgICAgY29sbGVjdGlvbltvYmouX2lkXSA9IFIubWVyZ2Uob2JqLCBkYXRhQXJyYXlbcXVlcnlJbmRleF0pIC8vIGRhdGFBcnJheVtxdWVyeUluZGV4XS5faWRcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICghcXVlcnlSZXN1bHRzLmxlbmd0aCAmJiBpbnNlcnRJZk5vdEV4aXN0cykgYXdhaXQgaW5zZXJ0KHtvYmpzOiBbZGF0YUFycmF5W3F1ZXJ5SW5kZXhdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIHNhdmVmaWxlKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ09OU09MRS5lcnJvcihlcnJvcilcbiAgICB0aHJvdyBQQUNLQUdFICsgYCBnZXRTdG9yYWdlVGluZ29kYlBhY2thZ2VgXG4gIH1cbn1cbiJdfQ==