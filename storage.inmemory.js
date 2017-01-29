'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
var sift = require('sift');
var path = require('path');
var fs = require('fs');
var uuidV4 = require('uuid/v4');

var db = {};
var dbFilename;
var getCollection = function getCollection(dbConfig, collectionName) {
  if (!db[collectionName]) db[collectionName] = {};
  return db[collectionName];
};
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
                  sort = _ref.sort,
                  limit = _ref.limit,
                  start = _ref.start;
              var sifted;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      sifted = sift(query, R.values(collection));
                      return _context.abrupt('return', sifted);

                    case 2:
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
                      items.forEach(function (value) {
                        if (!value._id) value._id = uuidV4();
                        collection[value._id] = value;
                      });
                      savefile();
                      return _context2.abrupt('return', true);

                    case 5:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, null, this);
            };

            var savefile = function savefile() {
              DI.debug({ msg: 'STORAGE TEST WRITE TO DISK ', context: PACKAGE, debug: { dbFile: dbFile, collection: collection } });
              fs.writeFile(dbFile, JSON.stringify(collection), 'utf8', function () {
                DI.debug({ msg: 'STORAGE TEST WRITED TO DISK ', context: PACKAGE, debug: { dbFile: dbFile, collection: collection } });
              });
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
                    dbFile = path.join(storageConfig.path, getReadableDate() + ' ' + storageCollection + '.json');
                    collection = getCollection(storageConfig, storageCollection);
                    return _context6.abrupt('return', {
                      v: {
                        insert: insert,
                        get: function get(_ref3) {
                          var ids = _ref3.ids;
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
                                    results[id] = R.clone(collection[id]);
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
                                              collection[queryIndex] = R.merge(item, dataArray[queryIndex]);
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

                                case 3:
                                case 'end':
                                  return _context5.stop();
                              }
                            }
                          }, null, this);
                        }
                      }
                    });

                  case 14:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuaW5tZW1vcnkuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2lmdCIsInBhdGgiLCJmcyIsInV1aWRWNCIsImRiIiwiZGJGaWxlbmFtZSIsImdldENvbGxlY3Rpb24iLCJkYkNvbmZpZyIsImNvbGxlY3Rpb25OYW1lIiwiZ2V0UmVhZGFibGVEYXRlIiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwicmVwbGFjZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRTdG9yYWdlVGVzdFBhY2thZ2UiLCJDT05GSUciLCJESSIsImZpbmQiLCJxdWVyeSIsInNvcnQiLCJsaW1pdCIsInN0YXJ0Iiwic2lmdGVkIiwidmFsdWVzIiwiY29sbGVjdGlvbiIsImluc2VydCIsIml0ZW1zIiwibGVuZ3RoIiwiRXJyb3IiLCJmb3JFYWNoIiwidmFsdWUiLCJfaWQiLCJzYXZlZmlsZSIsImRlYnVnIiwibXNnIiwiY29udGV4dCIsIlBBQ0tBR0UiLCJkYkZpbGUiLCJ3cml0ZUZpbGUiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2V0VmFsdWVQcm9taXNlIiwiY2hlY2tSZXF1aXJlZCIsInN0b3JhZ2VDb2xsZWN0aW9uIiwic3RvcmFnZUNvbmZpZyIsImpvaW4iLCJnZXQiLCJpZHMiLCJyZXN1bHRzIiwiaWQiLCJjbG9uZSIsInVwZGF0ZSIsInF1ZXJpZXNBcnJheSIsImRhdGFBcnJheSIsImluc2VydElmTm90RXhpc3RzIiwicXVlcnlJbmRleCIsInF1ZXJ5UmVzdWx0cyIsIml0ZW0iLCJtZXJnZSIsInRocm93RXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUUsT0FBT0YsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJRyxLQUFLSCxRQUFRLElBQVIsQ0FBVDtBQUNBLElBQU1JLFNBQVNKLFFBQVEsU0FBUixDQUFmOztBQUVBLElBQUlLLEtBQUssRUFB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QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDRFQUNNdEMsS0FBSyxFQUFDQyxZQUFELEVBQUwsQ0FETjs7QUFBQTtBQUNmc0Msd0RBRGU7O0FBRW5CQSx5REFBYTNCLE9BQWIsQ0FBcUIsVUFBQzRCLElBQUQsRUFBVTtBQUM3QmpDLHlEQUFXK0IsVUFBWCxJQUF5QjFELEVBQUU2RCxLQUFGLENBQVFELElBQVIsRUFBY0osVUFBVUUsVUFBVixDQUFkLENBQXpCO0FBQ0QsNkNBRkQ7O0FBRm1CLGtEQUtmLENBQUNDLGFBQWE3QixNQUFkLElBQXdCMkIsaUJBTFQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSw0RUFLa0M3QixPQUFPLEVBQUNDLE9BQU8sQ0FBQzJCLFVBQVVFLFVBQVYsQ0FBRCxDQUFSLEVBQVAsQ0FMbEM7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUNBQXJCO0FBT0F2QjtBQVJNLG9FQVNDLElBVEQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFYSDtBQS9CTTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBdURiaEIsYUFBRzJDLFVBQUgsQ0FBYyxzQ0FBZDs7QUF2RGE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoic3RvcmFnZS5pbm1lbW9yeS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBzaWZ0ID0gcmVxdWlyZSgnc2lmdCcpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG5cbnZhciBkYiA9IHt9XG52YXIgZGJGaWxlbmFtZVxudmFyIGdldENvbGxlY3Rpb24gPSAoZGJDb25maWcsIGNvbGxlY3Rpb25OYW1lKSA9PiB7XG4gIGlmICghZGJbY29sbGVjdGlvbk5hbWVdKWRiW2NvbGxlY3Rpb25OYW1lXSA9IHt9XG4gIHJldHVybiBkYltjb2xsZWN0aW9uTmFtZV1cbn1cbmZ1bmN0aW9uIGdldFJlYWRhYmxlRGF0ZSAoKSB7IHJldHVybiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvVC8sICcgJykucmVwbGFjZSgvXFwuLisvLCAnJykgfVxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBnZXRTdG9yYWdlVGVzdFBhY2thZ2UgKENPTkZJRywgREkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBQQUNLQUdFID0gJ3N0b3JhZ2UudGVzdCdcbiAgICBjb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG4gICAgY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG4gICAgQ09ORklHID0gY2hlY2tSZXF1aXJlZChDT05GSUcsIFsnc3RvcmFnZUNvbGxlY3Rpb24nLCAnc3RvcmFnZUNvbmZpZyddLCBQQUNLQUdFKVxuICAgIERJID0gY2hlY2tSZXF1aXJlZChESSwgWydlcnJvcicsICdsb2cnLCAnZGVidWcnXSwgUEFDS0FHRSlcbiAgICB2YXIgc3RvcmFnZUNvbGxlY3Rpb24gPSBhd2FpdCBnZXRWYWx1ZVByb21pc2UoQ09ORklHLnN0b3JhZ2VDb2xsZWN0aW9uKVxuICAgIHZhciBzdG9yYWdlQ29uZmlnID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5zdG9yYWdlQ29uZmlnKVxuICAgIHZhciBkYkZpbGUgPSBwYXRoLmpvaW4oc3RvcmFnZUNvbmZpZy5wYXRoLCBnZXRSZWFkYWJsZURhdGUoKSArICcgJyArIHN0b3JhZ2VDb2xsZWN0aW9uICsgJy5qc29uJylcbiAgICB2YXIgY29sbGVjdGlvbiA9IGdldENvbGxlY3Rpb24oc3RvcmFnZUNvbmZpZywgc3RvcmFnZUNvbGxlY3Rpb24pXG4gICAgYXN5bmMgZnVuY3Rpb24gZmluZCAoe3F1ZXJ5LCBzb3J0LCBsaW1pdCwgc3RhcnR9KSB7XG4gICAgICB2YXIgc2lmdGVkID0gc2lmdChxdWVyeSwgUi52YWx1ZXMoY29sbGVjdGlvbikpXG4gICAgICByZXR1cm4gc2lmdGVkXG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGluc2VydCAoe2l0ZW1zfSkge1xuICAgICAgaWYgKCFpdGVtcyB8fCAhaXRlbXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ05vIGl0ZW1zJylcbiAgICAgIGl0ZW1zLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUuX2lkKXZhbHVlLl9pZCA9IHV1aWRWNCgpXG4gICAgICAgIGNvbGxlY3Rpb25bdmFsdWUuX2lkXSA9IHZhbHVlXG4gICAgICB9KVxuICAgICAgc2F2ZWZpbGUoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgZnVuY3Rpb24gc2F2ZWZpbGUgKCkge1xuICAgICAgREkuZGVidWcoe21zZzogJ1NUT1JBR0UgVEVTVCBXUklURSBUTyBESVNLICcsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7ZGJGaWxlLCBjb2xsZWN0aW9ufX0pXG4gICAgICBmcy53cml0ZUZpbGUoZGJGaWxlLCBKU09OLnN0cmluZ2lmeShjb2xsZWN0aW9uKSwgJ3V0ZjgnLCAoKSA9PiB7XG4gICAgICAgIERJLmRlYnVnKHttc2c6ICdTVE9SQUdFIFRFU1QgV1JJVEVEIFRPIERJU0sgJywgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtkYkZpbGUsIGNvbGxlY3Rpb259fSlcbiAgICAgIH0pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgaW5zZXJ0LFxuICAgICAgZ2V0OiBhc3luYyBmdW5jdGlvbiBnZXQgKHtpZHN9KSB7XG4gICAgICAgIGlmICghaWRzKSB0aHJvdyBuZXcgRXJyb3IoJ05vIGl0ZW1zIGlkcycpXG4gICAgICAgIHJlc3VsdHMgPSBbXVxuICAgICAgICBpZHMuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgICAgICByZXN1bHRzW2lkXSA9IFIuY2xvbmUoY29sbGVjdGlvbltpZF0pXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9LFxuICAgICAgZmluZCxcbiAgICAgIHVwZGF0ZTogYXN5bmMgZnVuY3Rpb24gdXBkYXRlICh7cXVlcmllc0FycmF5LCBkYXRhQXJyYXksIGluc2VydElmTm90RXhpc3RzID0gZmFsc2V9KSB7XG4gICAgICAgIHF1ZXJpZXNBcnJheS5mb3JFYWNoKGFzeW5jKHF1ZXJ5LCBxdWVyeUluZGV4KSA9PiB7XG4gICAgICAgICAgdmFyIHF1ZXJ5UmVzdWx0cyA9IGF3YWl0IGZpbmQoe3F1ZXJ5fSlcbiAgICAgICAgICBxdWVyeVJlc3VsdHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgY29sbGVjdGlvbltxdWVyeUluZGV4XSA9IFIubWVyZ2UoaXRlbSwgZGF0YUFycmF5W3F1ZXJ5SW5kZXhdKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKCFxdWVyeVJlc3VsdHMubGVuZ3RoICYmIGluc2VydElmTm90RXhpc3RzKSBhd2FpdCBpbnNlcnQoe2l0ZW1zOiBbZGF0YUFycmF5W3F1ZXJ5SW5kZXhdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIHNhdmVmaWxlKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0U3RvcmFnZVRpbmdvZGJQYWNrYWdlKENPTkZJRywgREkpJywgZXJyb3IpXG4gIH1cbn1cbiJdfQ==