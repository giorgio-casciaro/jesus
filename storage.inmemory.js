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
var LOG = console;
var PACKAGE = 'storage.inmemory';

module.exports = function getStorageTestPackage(_ref) {
  var storageCollection = _ref.storageCollection,
      storageConfig = _ref.storageConfig;

  var dbFile, collection, _ret;

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
                  start = _ref2$start === undefined ? 0 : _ref2$start;
              var results;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      results = sift(query, R.values(collection));

                      if (sort) {
                        R.forEachObjIndexed(function (sortValue, sortIndex) {
                          var before = R.clone(results);
                          results = R.sortBy(R.prop(sortIndex), results);
                          if (!sortValue) results = R.reverse(results);
                          LOG.debug(PACKAGE, 'find() sorting', { sortValue: sortValue, sortIndex: sortIndex, before: before, results: results });
                        }, sort);
                      }
                      results = R.slice(start, limit + start, results);
                      LOG.debug(PACKAGE, 'find()', { storageCollection: storageCollection, query: query, collection: collection, results: results });
                      return _context.abrupt('return', results);

                    case 5:
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
                LOG.debug(PACKAGE, storageCollection + ' WRITING TO LOGSK ', { dbFile: dbFile, collection: collection });
                fs.writeFile(dbFile, JSON.stringify(collection, null, 4), 'utf8', function () {
                  LOG.debug(PACKAGE, storageCollection + ' WRITED TO LOGSK ', { dbFile: dbFile });
                });
              }, 1000);
              return true;
            };

            checkRequired({ storageCollection: storageCollection, storageConfig: storageConfig, 'storageConfig.path': storageConfig.path }, PACKAGE);
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

          LOG.error(PACKAGE, _context6.t0);
          throw PACKAGE + ' getStorageTingodbPackage';

        case 10:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, this, [[0, 6]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuaW5tZW1vcnkuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2lmdCIsInBhdGgiLCJmcyIsInV1aWRWNCIsImNoZWNrUmVxdWlyZWQiLCJkYiIsImNvbGxlY3Rpb25zIiwiY29sbGVjdGlvbnNTYXZlVGltZW91dCIsImdldFJlYWRhYmxlRGF0ZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInJlcGxhY2UiLCJMT0ciLCJjb25zb2xlIiwiUEFDS0FHRSIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRTdG9yYWdlVGVzdFBhY2thZ2UiLCJzdG9yYWdlQ29sbGVjdGlvbiIsInN0b3JhZ2VDb25maWciLCJmaW5kIiwicXVlcnkiLCJzb3J0IiwibGltaXQiLCJzdGFydCIsInJlc3VsdHMiLCJ2YWx1ZXMiLCJjb2xsZWN0aW9uIiwiZm9yRWFjaE9iakluZGV4ZWQiLCJzb3J0VmFsdWUiLCJzb3J0SW5kZXgiLCJiZWZvcmUiLCJjbG9uZSIsInNvcnRCeSIsInByb3AiLCJyZXZlcnNlIiwiZGVidWciLCJzbGljZSIsImluc2VydCIsIm9ianMiLCJmb3JFYWNoIiwidmFsdWUiLCJfaWQiLCJzYXZlZmlsZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJkYkZpbGUiLCJ3cml0ZUZpbGUiLCJKU09OIiwic3RyaW5naWZ5Iiwiam9pbiIsImdldCIsImlkcyIsImlkIiwicHVzaCIsInVwZGF0ZSIsInF1ZXJpZXNBcnJheSIsImRhdGFBcnJheSIsImluc2VydElmTm90RXhpc3RzIiwicXVlcnlJbmRleCIsInF1ZXJ5UmVzdWx0cyIsIm9iaiIsIm1lcmdlIiwibGVuZ3RoIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUUsT0FBT0YsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJRyxLQUFLSCxRQUFRLElBQVIsQ0FBVDtBQUNB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QUFDQyxhQUFhRyxNQUFkLElBQXdCTCxpQkFOVDtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLG9FQU1rQ3BCLE9BQU8sRUFBQ0MsTUFBTSxDQUFDa0IsVUFBVUUsVUFBVixDQUFELENBQVAsRUFBUCxDQU5sQzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFBckI7QUFRQWhCO0FBVk0sNERBV0MsSUFYRDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVhIO0FBQVA7QUExQ2E7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFvRWIvQixjQUFJb0QsS0FBSixDQUFVbEQsT0FBVjtBQXBFYSxnQkFxRVBBLHFDQXJFTzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJzdG9yYWdlLmlubWVtb3J5LmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIHNpZnQgPSByZXF1aXJlKCdzaWZ0JylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxudmFyIGRiID0ge2NvbGxlY3Rpb25zOiB7fSwgY29sbGVjdGlvbnNTYXZlVGltZW91dDoge319XG5mdW5jdGlvbiBnZXRSZWFkYWJsZURhdGUgKCkgeyByZXR1cm4gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1QvLCAnICcpLnJlcGxhY2UoL1xcLi4rLywgJycpIH1cbnZhciBMT0cgPSBjb25zb2xlXG5jb25zdCBQQUNLQUdFID0gJ3N0b3JhZ2UuaW5tZW1vcnknXG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0U3RvcmFnZVRlc3RQYWNrYWdlICh7c3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWd9KSB7XG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7c3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWcsICdzdG9yYWdlQ29uZmlnLnBhdGgnOiBzdG9yYWdlQ29uZmlnLnBhdGh9LCBQQUNLQUdFKVxuICAgIHZhciBkYkZpbGUgPSBwYXRoLmpvaW4oc3RvcmFnZUNvbmZpZy5wYXRoLCBzdG9yYWdlQ29sbGVjdGlvbiArICcuanNvbicpXG4gICAgaWYgKCFkYi5jb2xsZWN0aW9uc1tzdG9yYWdlQ29sbGVjdGlvbl0pZGIuY29sbGVjdGlvbnNbc3RvcmFnZUNvbGxlY3Rpb25dID0ge31cbiAgICB2YXIgY29sbGVjdGlvbiA9IGRiLmNvbGxlY3Rpb25zW3N0b3JhZ2VDb2xsZWN0aW9uXVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZmluZCAoe3F1ZXJ5LCBzb3J0ID0gbnVsbCwgbGltaXQgPSAxMDAwLCBzdGFydCA9IDB9KSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IHNpZnQocXVlcnksIFIudmFsdWVzKGNvbGxlY3Rpb24pKVxuICAgICAgaWYgKHNvcnQpIHtcbiAgICAgICAgUi5mb3JFYWNoT2JqSW5kZXhlZCgoc29ydFZhbHVlLCBzb3J0SW5kZXgpID0+IHtcbiAgICAgICAgICB2YXIgYmVmb3JlID0gUi5jbG9uZShyZXN1bHRzKVxuICAgICAgICAgIHJlc3VsdHMgPSBSLnNvcnRCeShSLnByb3Aoc29ydEluZGV4KSwgcmVzdWx0cylcbiAgICAgICAgICBpZiAoIXNvcnRWYWx1ZSlyZXN1bHRzID0gUi5yZXZlcnNlKHJlc3VsdHMpXG4gICAgICAgICAgTE9HLmRlYnVnKFBBQ0tBR0UsIGBmaW5kKCkgc29ydGluZ2AsIHtzb3J0VmFsdWUsIHNvcnRJbmRleCwgYmVmb3JlLCByZXN1bHRzfSlcbiAgICAgICAgfSwgc29ydClcbiAgICAgIH1cbiAgICAgIHJlc3VsdHMgPSBSLnNsaWNlKHN0YXJ0LCBsaW1pdCArIHN0YXJ0LCByZXN1bHRzKVxuICAgICAgTE9HLmRlYnVnKFBBQ0tBR0UsIGBmaW5kKClgLCB7c3RvcmFnZUNvbGxlY3Rpb24sIHF1ZXJ5LCBjb2xsZWN0aW9uLCByZXN1bHRzfSlcbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGluc2VydCAoe29ianN9KSB7XG4gICAgICBpZiAoIW9ianMpIHRocm93ICdObyBvYmpzJ1xuICAgICAgb2JqcyA9IFIuY2xvbmUob2JqcylcbiAgICAgIG9ianMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCF2YWx1ZS5faWQpdmFsdWUuX2lkID0gdXVpZFY0KClcbiAgICAgICAgY29sbGVjdGlvblt2YWx1ZS5faWRdID0gdmFsdWVcbiAgICAgIH0pXG4gICAgICBzYXZlZmlsZSgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBmdW5jdGlvbiBzYXZlZmlsZSAoKSB7XG4gICAgICBpZiAoIWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dKWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dID0ge31cbiAgICAgIGlmIChkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSkgY2xlYXJUaW1lb3V0KGRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dKVxuICAgICAgZGIuY29sbGVjdGlvbnNTYXZlVGltZW91dFtzdG9yYWdlQ29sbGVjdGlvbl0gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgTE9HLmRlYnVnKFBBQ0tBR0UsIGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklUSU5HIFRPIExPR1NLIGAsIHtkYkZpbGUsIGNvbGxlY3Rpb259KVxuICAgICAgICBmcy53cml0ZUZpbGUoZGJGaWxlLCBKU09OLnN0cmluZ2lmeShjb2xsZWN0aW9uLCBudWxsLCA0KSwgJ3V0ZjgnLCAoKSA9PiB7XG4gICAgICAgICAgTE9HLmRlYnVnKFBBQ0tBR0UsIGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklURUQgVE8gTE9HU0sgYCwge2RiRmlsZX0pXG4gICAgICAgIH0pXG4gICAgICB9LCAxMDAwKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGluc2VydCxcbiAgICAgIGdldDogYXN5bmMgZnVuY3Rpb24gZ2V0ICh7aWRzfSkge1xuICAgICAgICBpZiAoIWlkcykgdGhyb3cgJ05vIG9ianMgaWRzJ1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgIGlkcy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICAgIGlmIChjb2xsZWN0aW9uW2lkXSlyZXN1bHRzLnB1c2goUi5jbG9uZShjb2xsZWN0aW9uW2lkXSkpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9LFxuICAgICAgZmluZCxcbiAgICAgIHVwZGF0ZTogYXN5bmMgZnVuY3Rpb24gdXBkYXRlICh7cXVlcmllc0FycmF5LCBkYXRhQXJyYXksIGluc2VydElmTm90RXhpc3RzID0gZmFsc2V9KSB7XG4gICAgICAgIGRhdGFBcnJheSA9IFIuY2xvbmUoZGF0YUFycmF5KVxuICAgICAgICBxdWVyaWVzQXJyYXkuZm9yRWFjaChhc3luYyhxdWVyeSwgcXVlcnlJbmRleCkgPT4ge1xuICAgICAgICAgIHZhciBxdWVyeVJlc3VsdHMgPSBhd2FpdCBmaW5kKHtxdWVyeX0pXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coe3F1ZXJ5UmVzdWx0c30pXG4gICAgICAgICAgcXVlcnlSZXN1bHRzLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgICAgICAgY29sbGVjdGlvbltvYmouX2lkXSA9IFIubWVyZ2Uob2JqLCBkYXRhQXJyYXlbcXVlcnlJbmRleF0pIC8vIGRhdGFBcnJheVtxdWVyeUluZGV4XS5faWRcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICghcXVlcnlSZXN1bHRzLmxlbmd0aCAmJiBpbnNlcnRJZk5vdEV4aXN0cykgYXdhaXQgaW5zZXJ0KHtvYmpzOiBbZGF0YUFycmF5W3F1ZXJ5SW5kZXhdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIHNhdmVmaWxlKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgTE9HLmVycm9yKFBBQ0tBR0UsIGVycm9yKVxuICAgIHRocm93IFBBQ0tBR0UgKyBgIGdldFN0b3JhZ2VUaW5nb2RiUGFja2FnZWBcbiAgfVxufVxuIl19