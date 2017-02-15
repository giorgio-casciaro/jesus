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
                      // TO FIX
                      results = sift(query, R.values(collection));


                      if (sort) {
                        R.forEachObjIndexed(function (sortValue, sortIndex) {
                          var before = R.clone(results);
                          results = R.sortBy(R.prop(sortIndex), results);
                          if (!sortValue) results = R.reverse(results);
                          LOG.debug({ msg: 'find() sorting', context: PACKAGE, debug: { sortValue: sortValue, sortIndex: sortIndex, before: before, results: results } });
                        }, sort);
                      }
                      results = R.slice(start, limit + start, results);
                      LOG.debug({ msg: 'find() ', context: PACKAGE, debug: { storageCollection: storageCollection, query: query, collection: collection, results: results } });
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

                      throw new Error('No objs');

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
                LOG.debug({ msg: storageCollection + ' WRITING TO LOGSK ', context: PACKAGE, debug: { dbFile: dbFile, collection: collection } });
                fs.writeFile(dbFile, JSON.stringify(collection, null, 4), 'utf8', function () {
                  LOG.debug({ msg: storageCollection + ' WRITED TO LOGSK ', context: PACKAGE, debug: { dbFile: dbFile } });
                });
              }, 1000);
              return true;
            };

            var PACKAGE = 'storage.test';
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

                          throw new Error('No objs ids');

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
          throw new Error('getStorageTingodbPackage');

        case 10:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, this, [[0, 6]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuaW5tZW1vcnkuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2lmdCIsInBhdGgiLCJmcyIsInV1aWRWNCIsImNoZWNrUmVxdWlyZWQiLCJkYiIsImNvbGxlY3Rpb25zIiwiY29sbGVjdGlvbnNTYXZlVGltZW91dCIsImdldFJlYWRhYmxlRGF0ZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInJlcGxhY2UiLCJMT0ciLCJjb25zb2xlIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFN0b3JhZ2VUZXN0UGFja2FnZSIsInN0b3JhZ2VDb2xsZWN0aW9uIiwic3RvcmFnZUNvbmZpZyIsImZpbmQiLCJxdWVyeSIsInNvcnQiLCJsaW1pdCIsInN0YXJ0IiwicmVzdWx0cyIsInZhbHVlcyIsImNvbGxlY3Rpb24iLCJmb3JFYWNoT2JqSW5kZXhlZCIsInNvcnRWYWx1ZSIsInNvcnRJbmRleCIsImJlZm9yZSIsImNsb25lIiwic29ydEJ5IiwicHJvcCIsInJldmVyc2UiLCJkZWJ1ZyIsIm1zZyIsImNvbnRleHQiLCJQQUNLQUdFIiwic2xpY2UiLCJpbnNlcnQiLCJvYmpzIiwiRXJyb3IiLCJmb3JFYWNoIiwidmFsdWUiLCJfaWQiLCJzYXZlZmlsZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJkYkZpbGUiLCJ3cml0ZUZpbGUiLCJKU09OIiwic3RyaW5naWZ5Iiwiam9pbiIsImdldCIsImlkcyIsImlkIiwicHVzaCIsInVwZGF0ZSIsInF1ZXJpZXNBcnJheSIsImRhdGFBcnJheSIsImluc2VydElmTm90RXhpc3RzIiwicXVlcnlJbmRleCIsInF1ZXJ5UmVzdWx0cyIsIm9iaiIsIm1lcmdlIiwibGVuZ3RoIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUUsT0FBT0YsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJRyxL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QUNDLFlBQUQsRUFBTCxDQUROOztBQUFBO0FBQ2YyQyxnREFEZTs7QUFFbkI7QUFDQUEsaURBQWFwQixPQUFiLENBQXFCLFVBQUNxQixHQUFELEVBQVM7QUFDNUJ0QyxpREFBV3NDLElBQUluQixHQUFmLElBQXNCL0MsRUFBRW1FLEtBQUYsQ0FBUUQsR0FBUixFQUFhSixVQUFVRSxVQUFWLENBQWIsQ0FBdEIsQ0FENEIsQ0FDOEI7QUFDM0QscUNBRkQ7O0FBSG1CLDBDQU1mLENBQUNDLGFBQWFHLE1BQWQsSUFBd0JMLGlCQU5UO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsb0VBTWtDckIsT0FBTyxFQUFDQyxNQUFNLENBQUNtQixVQUFVRSxVQUFWLENBQUQsQ0FBUCxFQUFQLENBTmxDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDJCQUFyQjtBQVFBaEI7QUFWTSw0REFXQyxJQVhEOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWEg7QUFBUDtBQS9DYTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQXlFYmxDLGNBQUl1RCxLQUFKLENBQVU3QixPQUFWO0FBekVhLGdCQTBFUCxJQUFJSSxLQUFKLDRCQTFFTzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJzdG9yYWdlLmlubWVtb3J5LmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIHNpZnQgPSByZXF1aXJlKCdzaWZ0JylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxudmFyIGRiID0ge2NvbGxlY3Rpb25zOiB7fSwgY29sbGVjdGlvbnNTYXZlVGltZW91dDoge319XG5mdW5jdGlvbiBnZXRSZWFkYWJsZURhdGUgKCkgeyByZXR1cm4gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1QvLCAnICcpLnJlcGxhY2UoL1xcLi4rLywgJycpIH1cbnZhciBMT0cgPSBjb25zb2xlXG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0U3RvcmFnZVRlc3RQYWNrYWdlICh7c3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWd9KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgUEFDS0FHRSA9ICdzdG9yYWdlLnRlc3QnXG4gICAgY2hlY2tSZXF1aXJlZCh7c3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWcsICdzdG9yYWdlQ29uZmlnLnBhdGgnOiBzdG9yYWdlQ29uZmlnLnBhdGh9LCBQQUNLQUdFKVxuXG4gICAgdmFyIGRiRmlsZSA9IHBhdGguam9pbihzdG9yYWdlQ29uZmlnLnBhdGgsIHN0b3JhZ2VDb2xsZWN0aW9uICsgJy5qc29uJylcblxuICAgIGlmICghZGIuY29sbGVjdGlvbnNbc3RvcmFnZUNvbGxlY3Rpb25dKWRiLmNvbGxlY3Rpb25zW3N0b3JhZ2VDb2xsZWN0aW9uXSA9IHt9XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBkYi5jb2xsZWN0aW9uc1tzdG9yYWdlQ29sbGVjdGlvbl1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGZpbmQgKHtxdWVyeSwgc29ydCA9IG51bGwsIGxpbWl0ID0gMTAwMCwgc3RhcnQgPSAwfSkge1xuICAgICAgLy8gVE8gRklYXG4gICAgICB2YXIgcmVzdWx0cyA9IHNpZnQocXVlcnksIFIudmFsdWVzKGNvbGxlY3Rpb24pKVxuXG4gICAgICBpZiAoc29ydCkge1xuICAgICAgICBSLmZvckVhY2hPYmpJbmRleGVkKChzb3J0VmFsdWUsIHNvcnRJbmRleCkgPT4ge1xuICAgICAgICAgIHZhciBiZWZvcmUgPSBSLmNsb25lKHJlc3VsdHMpXG4gICAgICAgICAgcmVzdWx0cyA9IFIuc29ydEJ5KFIucHJvcChzb3J0SW5kZXgpLCByZXN1bHRzKVxuICAgICAgICAgIGlmICghc29ydFZhbHVlKXJlc3VsdHMgPSBSLnJldmVyc2UocmVzdWx0cylcbiAgICAgICAgICBMT0cuZGVidWcoe21zZzogYGZpbmQoKSBzb3J0aW5nYCwgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtzb3J0VmFsdWUsIHNvcnRJbmRleCwgYmVmb3JlLCByZXN1bHRzfX0pXG4gICAgICAgIH0sIHNvcnQpXG4gICAgICB9XG4gICAgICByZXN1bHRzID0gUi5zbGljZShzdGFydCwgbGltaXQgKyBzdGFydCwgcmVzdWx0cylcbiAgICAgIExPRy5kZWJ1Zyh7bXNnOiBgZmluZCgpIGAsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7c3RvcmFnZUNvbGxlY3Rpb24sIHF1ZXJ5LCBjb2xsZWN0aW9uLCByZXN1bHRzfX0pXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBpbnNlcnQgKHtvYmpzfSkge1xuICAgICAgaWYgKCFvYmpzKSB0aHJvdyBuZXcgRXJyb3IoJ05vIG9ianMnKVxuICAgICAgb2JqcyA9IFIuY2xvbmUob2JqcylcbiAgICAgIG9ianMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCF2YWx1ZS5faWQpdmFsdWUuX2lkID0gdXVpZFY0KClcbiAgICAgICAgY29sbGVjdGlvblt2YWx1ZS5faWRdID0gdmFsdWVcbiAgICAgIH0pXG4gICAgICBzYXZlZmlsZSgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBmdW5jdGlvbiBzYXZlZmlsZSAoKSB7XG4gICAgICBpZiAoIWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dKWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dID0ge31cbiAgICAgIGlmIChkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSkgY2xlYXJUaW1lb3V0KGRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dKVxuICAgICAgZGIuY29sbGVjdGlvbnNTYXZlVGltZW91dFtzdG9yYWdlQ29sbGVjdGlvbl0gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgTE9HLmRlYnVnKHttc2c6IGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklUSU5HIFRPIExPR1NLIGAsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7ZGJGaWxlLCBjb2xsZWN0aW9ufX0pXG4gICAgICAgIGZzLndyaXRlRmlsZShkYkZpbGUsIEpTT04uc3RyaW5naWZ5KGNvbGxlY3Rpb24sIG51bGwsIDQpLCAndXRmOCcsICgpID0+IHtcbiAgICAgICAgICBMT0cuZGVidWcoe21zZzogYCR7c3RvcmFnZUNvbGxlY3Rpb259IFdSSVRFRCBUTyBMT0dTSyBgLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge2RiRmlsZX19KVxuICAgICAgICB9KVxuICAgICAgfSwgMTAwMClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBpbnNlcnQsXG4gICAgICBnZXQ6IGFzeW5jIGZ1bmN0aW9uIGdldCAoe2lkc30pIHtcbiAgICAgICAgaWYgKCFpZHMpIHRocm93IG5ldyBFcnJvcignTm8gb2JqcyBpZHMnKVxuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgIGlkcy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICAgIGlmKGNvbGxlY3Rpb25baWRdKXJlc3VsdHMucHVzaChSLmNsb25lKGNvbGxlY3Rpb25baWRdKSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH0sXG4gICAgICBmaW5kLFxuICAgICAgdXBkYXRlOiBhc3luYyBmdW5jdGlvbiB1cGRhdGUgKHtxdWVyaWVzQXJyYXksIGRhdGFBcnJheSwgaW5zZXJ0SWZOb3RFeGlzdHMgPSBmYWxzZX0pIHtcbiAgICAgICAgZGF0YUFycmF5ID0gUi5jbG9uZShkYXRhQXJyYXkpXG4gICAgICAgIHF1ZXJpZXNBcnJheS5mb3JFYWNoKGFzeW5jKHF1ZXJ5LCBxdWVyeUluZGV4KSA9PiB7XG4gICAgICAgICAgdmFyIHF1ZXJ5UmVzdWx0cyA9IGF3YWl0IGZpbmQoe3F1ZXJ5fSlcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh7cXVlcnlSZXN1bHRzfSlcbiAgICAgICAgICBxdWVyeVJlc3VsdHMuZm9yRWFjaCgob2JqKSA9PiB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uW29iai5faWRdID0gUi5tZXJnZShvYmosIGRhdGFBcnJheVtxdWVyeUluZGV4XSkgLy8gZGF0YUFycmF5W3F1ZXJ5SW5kZXhdLl9pZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKCFxdWVyeVJlc3VsdHMubGVuZ3RoICYmIGluc2VydElmTm90RXhpc3RzKSBhd2FpdCBpbnNlcnQoe29ianM6IFtkYXRhQXJyYXlbcXVlcnlJbmRleF1dfSlcbiAgICAgICAgfSlcbiAgICAgICAgc2F2ZWZpbGUoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBMT0cuZXJyb3IoUEFDS0FHRSwgZXJyb3IpXG4gICAgdGhyb3cgbmV3IEVycm9yKGBnZXRTdG9yYWdlVGluZ29kYlBhY2thZ2VgKVxuICB9XG59XG4iXX0=