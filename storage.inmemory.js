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

                      DI.debug({ msg: 'find() ', context: PACKAGE, debug: { storageCollection: storageCollection, query: query, collection: collection, results: results } });
                      if (sort) {
                        R.addIndex(R.forEach)(function (sortValue, sortIndex) {
                          results = R.sortBy(R.prop(sortIndex), results);
                        }, sort);
                      }
                      return _context.abrupt('return', R.slice(limit, start + limit, results));

                    case 4:
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
                    DI = checkRequired(DI, ['error', 'log', 'debug'], PACKAGE);

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

                                            queryResults.forEach(function (item) {
                                              collection[dataArray[queryIndex]._id] = R.merge(item, dataArray[queryIndex]);
                                            });

                                            if (!(!queryResults.length && insertIfNotExists)) {
                                              _context4.next = 7;
                                              break;
                                            }

                                            _context4.next = 7;
                                            return regeneratorRuntime.awrap(insert({ items: [dataArray[queryIndex]] }));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuaW5tZW1vcnkuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2lmdCIsInBhdGgiLCJmcyIsInV1aWRWNCIsImRiIiwiZ2xvYmFsIiwiaW5NZW1vcnlEYiIsImNvbGxlY3Rpb25zIiwiY29sbGVjdGlvbnNTYXZlVGltZW91dCIsImdldFJlYWRhYmxlRGF0ZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInJlcGxhY2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0U3RvcmFnZVRlc3RQYWNrYWdlIiwiQ09ORklHIiwiREkiLCJmaW5kIiwicXVlcnkiLCJzb3J0IiwibGltaXQiLCJzdGFydCIsInJlc3VsdHMiLCJ2YWx1ZXMiLCJjb2xsZWN0aW9uIiwiZGVidWciLCJtc2ciLCJjb250ZXh0IiwiUEFDS0FHRSIsInN0b3JhZ2VDb2xsZWN0aW9uIiwiYWRkSW5kZXgiLCJmb3JFYWNoIiwic29ydFZhbHVlIiwic29ydEluZGV4Iiwic29ydEJ5IiwicHJvcCIsInNsaWNlIiwiaW5zZXJ0IiwiaXRlbXMiLCJsZW5ndGgiLCJFcnJvciIsImNsb25lIiwidmFsdWUiLCJfaWQiLCJzYXZlZmlsZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJkYkZpbGUiLCJ3cml0ZUZpbGUiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2V0VmFsdWVQcm9taXNlIiwiY2hlY2tSZXF1aXJlZCIsInN0b3JhZ2VDb25maWciLCJqb2luIiwiZ2V0IiwiaWRzIiwiaWQiLCJwdXNoIiwidXBkYXRlIiwicXVlcmllc0FycmF5IiwiZGF0YUFycmF5IiwiaW5zZXJ0SWZOb3RFeGlzdHMiLCJxdWVyeUluZGV4IiwicXVlcnlSZXN1bHRzIiwiaXRlbSIsIm1lcmdlIiwidGhyb3dFcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBSUMsT0FBT0QsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJRSxPQUFPRixRQUFRLE1BQVIs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QUFBQTtBQUFBO0FBQUEsNEVBQ005QyxLQUFLLEVBQUNDLFlBQUQsRUFBTCxDQUROOztBQUFBO0FBQ2Y4Qyx3REFEZTs7QUFFbkJBLHlEQUFhakMsT0FBYixDQUFxQixVQUFDa0MsSUFBRCxFQUFVO0FBQzdCekMseURBQVdxQyxVQUFVRSxVQUFWLEVBQXNCcEIsR0FBakMsSUFBd0M5QyxFQUFFcUUsS0FBRixDQUFRRCxJQUFSLEVBQWNKLFVBQVVFLFVBQVYsQ0FBZCxDQUF4QztBQUNELDZDQUZEOztBQUZtQixrREFLZixDQUFDQyxhQUFhekIsTUFBZCxJQUF3QnVCLGlCQUxUO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsNEVBS2tDekIsT0FBTyxFQUFDQyxPQUFPLENBQUN1QixVQUFVRSxVQUFWLENBQUQsQ0FBUixFQUFQLENBTGxDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1DQUFyQjtBQU9BbkI7QUFUTSxvRUFVQyxJQVZEOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWEg7QUEvQ007O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQXdFYjVCLGFBQUdtRCxVQUFILENBQWMsc0NBQWQ7O0FBeEVhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6InN0b3JhZ2UuaW5tZW1vcnkuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgc2lmdCA9IHJlcXVpcmUoJ3NpZnQnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxudmFyIGRiID0gZ2xvYmFsLmluTWVtb3J5RGIgPSB7Y29sbGVjdGlvbnM6IHt9LCBjb2xsZWN0aW9uc1NhdmVUaW1lb3V0OiB7fX1cbmZ1bmN0aW9uIGdldFJlYWRhYmxlRGF0ZSAoKSB7IHJldHVybiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvVC8sICcgJykucmVwbGFjZSgvXFwuLisvLCAnJykgfVxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBnZXRTdG9yYWdlVGVzdFBhY2thZ2UgKENPTkZJRywgREkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBQQUNLQUdFID0gJ3N0b3JhZ2UudGVzdCdcbiAgICBjb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG4gICAgY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG4gICAgQ09ORklHID0gY2hlY2tSZXF1aXJlZChDT05GSUcsIFsnc3RvcmFnZUNvbGxlY3Rpb24nLCAnc3RvcmFnZUNvbmZpZyddLCBQQUNLQUdFKVxuICAgIERJID0gY2hlY2tSZXF1aXJlZChESSwgWydlcnJvcicsICdsb2cnLCAnZGVidWcnXSwgUEFDS0FHRSlcblxuICAgIHZhciBzdG9yYWdlQ29sbGVjdGlvbiA9IGF3YWl0IGdldFZhbHVlUHJvbWlzZShDT05GSUcuc3RvcmFnZUNvbGxlY3Rpb24pXG4gICAgdmFyIHN0b3JhZ2VDb25maWcgPSBhd2FpdCBnZXRWYWx1ZVByb21pc2UoQ09ORklHLnN0b3JhZ2VDb25maWcpXG4gICAgdmFyIGRiRmlsZSA9IHBhdGguam9pbihzdG9yYWdlQ29uZmlnLnBhdGgsIHN0b3JhZ2VDb2xsZWN0aW9uICsgJy5qc29uJylcblxuICAgIGlmICghZGIuY29sbGVjdGlvbnNbc3RvcmFnZUNvbGxlY3Rpb25dKWRiLmNvbGxlY3Rpb25zW3N0b3JhZ2VDb2xsZWN0aW9uXSA9IHt9XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBkYi5jb2xsZWN0aW9uc1tzdG9yYWdlQ29sbGVjdGlvbl1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGZpbmQgKHtxdWVyeSwgc29ydCA9IG51bGwsIGxpbWl0ID0gMTAwMCwgc3RhcnQgPSAwfSkge1xuICAgICAgLy8gVE8gRklYXG4gICAgICB2YXIgcmVzdWx0cyA9IHNpZnQocXVlcnksIFIudmFsdWVzKGNvbGxlY3Rpb24pKVxuICAgICAgREkuZGVidWcoe21zZzogYGZpbmQoKSBgLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge3N0b3JhZ2VDb2xsZWN0aW9uLHF1ZXJ5LCBjb2xsZWN0aW9uLHJlc3VsdHN9fSlcbiAgICAgIGlmIChzb3J0KSB7XG4gICAgICAgIFIuYWRkSW5kZXgoUi5mb3JFYWNoKSgoc29ydFZhbHVlLCBzb3J0SW5kZXgpID0+IHtcbiAgICAgICAgICByZXN1bHRzID0gUi5zb3J0QnkoUi5wcm9wKHNvcnRJbmRleCksIHJlc3VsdHMpXG4gICAgICAgIH0sIHNvcnQpXG4gICAgICB9XG4gICAgICByZXR1cm4gUi5zbGljZShsaW1pdCwgc3RhcnQgKyBsaW1pdCwgcmVzdWx0cylcbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gaW5zZXJ0ICh7aXRlbXN9KSB7XG4gICAgICBpZiAoIWl0ZW1zIHx8ICFpdGVtcy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTm8gaXRlbXMnKVxuICAgICAgaXRlbXMgPSBSLmNsb25lKGl0ZW1zKVxuICAgICAgaXRlbXMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCF2YWx1ZS5faWQpdmFsdWUuX2lkID0gdXVpZFY0KClcbiAgICAgICAgY29sbGVjdGlvblt2YWx1ZS5faWRdID0gdmFsdWVcbiAgICAgIH0pXG4gICAgICBzYXZlZmlsZSgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBmdW5jdGlvbiBzYXZlZmlsZSAoKSB7XG4gICAgICBpZiAoIWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dKWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dID0ge31cbiAgICAgIGlmIChkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSkgY2xlYXJUaW1lb3V0KGRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dKVxuICAgICAgZGIuY29sbGVjdGlvbnNTYXZlVGltZW91dFtzdG9yYWdlQ29sbGVjdGlvbl0gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgREkuZGVidWcoe21zZzogYCR7c3RvcmFnZUNvbGxlY3Rpb259IFdSSVRJTkcgVE8gRElTSyBgLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge2RiRmlsZSwgY29sbGVjdGlvbn19KVxuICAgICAgICBmcy53cml0ZUZpbGUoZGJGaWxlLCBKU09OLnN0cmluZ2lmeShjb2xsZWN0aW9uLCBudWxsLCA0KSwgJ3V0ZjgnLCAoKSA9PiB7XG4gICAgICAgICAgREkuZGVidWcoe21zZzogYCR7c3RvcmFnZUNvbGxlY3Rpb259IFdSSVRFRCBUTyBESVNLIGAsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7ZGJGaWxlfX0pXG4gICAgICAgIH0pXG4gICAgICB9LCAxMDAwKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGluc2VydCxcbiAgICAgIGdldDogYXN5bmMgZnVuY3Rpb24gZ2V0ICh7aWRzfSkge1xuICAgICAgICBpZiAoIWlkcykgdGhyb3cgbmV3IEVycm9yKCdObyBpdGVtcyBpZHMnKVxuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgIGlkcy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChSLmNsb25lKGNvbGxlY3Rpb25baWRdKSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH0sXG4gICAgICBmaW5kLFxuICAgICAgdXBkYXRlOiBhc3luYyBmdW5jdGlvbiB1cGRhdGUgKHtxdWVyaWVzQXJyYXksIGRhdGFBcnJheSwgaW5zZXJ0SWZOb3RFeGlzdHMgPSBmYWxzZX0pIHtcbiAgICAgICAgZGF0YUFycmF5ID0gUi5jbG9uZShkYXRhQXJyYXkpXG4gICAgICAgIHF1ZXJpZXNBcnJheS5mb3JFYWNoKGFzeW5jKHF1ZXJ5LCBxdWVyeUluZGV4KSA9PiB7XG4gICAgICAgICAgdmFyIHF1ZXJ5UmVzdWx0cyA9IGF3YWl0IGZpbmQoe3F1ZXJ5fSlcbiAgICAgICAgICBxdWVyeVJlc3VsdHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgY29sbGVjdGlvbltkYXRhQXJyYXlbcXVlcnlJbmRleF0uX2lkXSA9IFIubWVyZ2UoaXRlbSwgZGF0YUFycmF5W3F1ZXJ5SW5kZXhdKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKCFxdWVyeVJlc3VsdHMubGVuZ3RoICYmIGluc2VydElmTm90RXhpc3RzKSBhd2FpdCBpbnNlcnQoe2l0ZW1zOiBbZGF0YUFycmF5W3F1ZXJ5SW5kZXhdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIHNhdmVmaWxlKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0U3RvcmFnZVRpbmdvZGJQYWNrYWdlKENPTkZJRywgREkpJywgZXJyb3IpXG4gIH1cbn1cbiJdfQ==