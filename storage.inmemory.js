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

                                            //console.log({queryResults})
                                            queryResults.forEach(function (item) {
                                              collection[item._id] = R.merge(item, dataArray[queryIndex]); //dataArray[queryIndex]._id
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuaW5tZW1vcnkuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2lmdCIsInBhdGgiLCJmcyIsInV1aWRWNCIsImRiIiwiZ2xvYmFsIiwiaW5NZW1vcnlEYiIsImNvbGxlY3Rpb25zIiwiY29sbGVjdGlvbnNTYXZlVGltZW91dCIsImdldFJlYWRhYmxlRGF0ZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInJlcGxhY2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0U3RvcmFnZVRlc3RQYWNrYWdlIiwiQ09ORklHIiwiREkiLCJmaW5kIiwicXVlcnkiLCJzb3J0IiwibGltaXQiLCJzdGFydCIsInJlc3VsdHMiLCJ2YWx1ZXMiLCJjb2xsZWN0aW9uIiwiZm9yRWFjaE9iakluZGV4ZWQiLCJzb3J0VmFsdWUiLCJzb3J0SW5kZXgiLCJiZWZvcmUiLCJjbG9uZSIsInNvcnRCeSIsInByb3AiLCJyZXZlcnNlIiwiZGVidWciLCJtc2ciLCJjb250ZXh0IiwiUEFDS0FHRSIsInNsaWNlIiwic3RvcmFnZUNvbGxlY3Rpb24iLCJpbnNlcnQiLCJpdGVtcyIsImxlbmd0aCIsIkVycm9yIiwiZm9yRWFjaCIsInZhbHVlIiwiX2lkIiwic2F2ZWZpbGUiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZGJGaWxlIiwid3JpdGVGaWxlIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldFZhbHVlUHJvbWlzZSIsImNoZWNrUmVxdWlyZWQiLCJzdG9yYWdlQ29uZmlnIiwiam9pbiIsImdldCIsImlkcyIsImlkIiwicHVzaCIsInVwZGF0ZSIsInF1ZXJpZXNBcnJheSIsImRhdGFBcnJheSIsImluc2VydElmTm90RXhpc3RzIiwicXVlcnlJbmRleCIsInF1ZXJ5UmVzdWx0cyIsIml0ZW0iLCJtZXJnZSIsInRocm93RXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUUsT0FBT0YsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJRyxLQUFLSCxRQUFRLElBQVIsQ0FBVDtBQUNBLElBQU1JLFNBQVNKLFFBQVEsU0FBUixDQUFmO0FBQ0EsSUFBSUssS0FBS0MsT0FBT0MsVUFBUCxHQUFvQixFQUFDQyxhQUFhLEVBQWQsRUFBa0JDLHdCQUF3QixFQUExQyxFQUE3QjtBQUNBLFNBQVNDLGVBQVQsR0FBNEI7QUFBRSxTQUFPLElBQUlDLElBQUosR0FBV0MsV0FBWCxHQUF5QkMsT0FBekIsQ0FBaUMsR0FBakMsRUFBc0MsR0FBdEMsRUFBMkNBLE9BQTNDLENBQW1ELE1BQW5ELEVBQTJELEVBQTNELENBQVA7QUFBdUU7QUFDckdDLE9BQU9DLE9BQVAsR0FBaUIsU0FBZUMscUJBQWYsQ0FBc0NDLE1BQXRDLEVBQThDQyxFQUE5QztBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBZUVDLElBZkYsR0FlYjtBQUFBLGtCQUFzQkMsS0FBdEIsUUFBc0JBLEtBQXRCO0FBQUEsbUNBQTZCQyxJQUE3QjtBQUFBLGtCQUE2QkEsSUFBN0IsNkJBQW9DLElBQXBDO0FBQUEsb0NBQTBDQyxLQUExQztBQUFBLGtCQUEwQ0EsS0FBMUMsOEJBQWtELElBQWxEO0FBQUEsb0NBQXdEQyxLQUF4RDtBQUFBLGtCQUF3REEsS0FBeEQsOEJBQWdFLENBQWhFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQ0lDLDZCQUZOLEdBRWdCdkIsS0FBS21CLEtBQUwsRUFBWXJCLEVBQUUwQixNQUFGLENBQVNDLFVBQVQsQ0FBWixDQUZoQjs7O0FBSUUsMEJBQUlMLElBQUosRUFBVTtBQUNSdEIsMEJBQUU0QixpQkFBRixDQUFvQixVQUFDQyxTQUFELEVBQVlDLFNBQVosRUFBMEI7QUFDNUMsOEJBQUlDLFNBQVMvQixFQUFFZ0MsS0FBRixDQUFRUCxPQUFSLENBQWI7QUFDQUEsb0NBQVV6QixFQUFFaUMsTUFBRixDQUFTakMsRUFBRWtDLElBQUYsQ0FBT0osU0FBUCxDQUFULEVBQTRCTCxPQUE1QixDQUFWO0FBQ0EsOEJBQUksQ0FBQ0ksU0FBTCxFQUFlSixVQUFVekIsRUFBRW1DLE9BQUYsQ0FBVVYsT0FBVixDQUFWO0FBQ2ZOLDZCQUFHaUIsS0FBSCxDQUFTLEVBQUNDLHFCQUFELEVBQXdCQyxTQUFTQyxPQUFqQyxFQUEwQ0gsT0FBTyxFQUFDUCxvQkFBRCxFQUFZQyxvQkFBWixFQUF1QkMsY0FBdkIsRUFBK0JOLGdCQUEvQixFQUFqRCxFQUFUO0FBQ0QseUJBTEQsRUFLR0gsSUFMSDtBQU1EO0FBQ0RHLGdDQUFVekIsRUFBRXdDLEtBQUYsQ0FBUWhCLEtBQVIsRUFBZUQsUUFBUUMsS0FBdkIsRUFBOEJDLE9BQTlCLENBQVY7QUFDQU4seUJBQUdpQixLQUFILENBQVMsRUFBQ0MsY0FBRCxFQUFpQkMsU0FBU0MsT0FBMUIsRUFBbUNILE9BQU8sRUFBQ0ssb0NBQUQsRUFBb0JwQixZQUFwQixFQUEyQk0sc0JBQTNCLEVBQXVDRixnQkFBdkMsRUFBMUMsRUFBVDtBQWJGLHVEQWNTQSxPQWRUOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBZmE7O0FBQUEsZ0JBK0JFaUIsTUEvQkYsR0ErQmI7QUFBQSxrQkFBd0JDLEtBQXhCLFNBQXdCQSxLQUF4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsNEJBQ00sQ0FBQ0EsS0FBRCxJQUFVLENBQUNBLE1BQU1DLE1BRHZCO0FBQUE7QUFBQTtBQUFBOztBQUFBLDRCQUNxQyxJQUFJQyxLQUFKLENBQVUsVUFBVixDQURyQzs7QUFBQTtBQUVFRiw4QkFBUTNDLEVBQUVnQyxLQUFGLENBQVFXLEtBQVIsQ0FBUjtBQUNBQSw0QkFBTUcsT0FBTixDQUFjLFVBQUNDLEtBQUQsRUFBVztBQUN2Qiw0QkFBSSxDQUFDQSxNQUFNQyxHQUFYLEVBQWVELE1BQU1DLEdBQU4sR0FBWTNDLFFBQVo7QUFDZnNCLG1DQUFXb0IsTUFBTUMsR0FBakIsSUFBd0JELEtBQXhCO0FBQ0QsdUJBSEQ7QUFJQUU7QUFQRix3REFRUyxJQVJUOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBL0JhOztBQUFBLGdCQXlDSkEsUUF6Q0ksR0F5Q2IsU0FBU0EsUUFBVCxHQUFxQjtBQUNuQixrQkFBSSxDQUFDM0MsR0FBR0ksc0JBQUgsQ0FBMEIrQixpQkFBMUIsQ0FBTCxFQUFrRG5DLEdBQUdJLHNCQUFILENBQTBCK0IsaUJBQTFCLElBQStDLEVBQS9DO0FBQ2xELGtCQUFJbkMsR0FBR0ksc0JBQUgsQ0FBMEIrQixpQkFBMUIsQ0FBSixFQUFrRFMsYUFBYTVDLEdBQUdJLHNCQUFILENBQTBCK0IsaUJBQTFCLENBQWI7QUFDbERuQyxpQkFBR0ksc0JBQUgsQ0FBMEIrQixpQkFBMUIsSUFBK0NVLFdBQVcsWUFBWTtBQUNwRWhDLG1CQUFHaUIsS0FBSCxDQUFTLEVBQUNDLEtBQVFJLGlCQUFSLHNCQUFELEVBQStDSCxTQUFTQyxPQUF4RCxFQUFpRUgsT0FBTyxFQUFDZ0IsY0FBRCxFQUFTekIsc0JBQVQsRUFBeEUsRUFBVDtBQUNBdkIsbUJBQUdpRCxTQUFILENBQWFELE1BQWIsRUFBcUJFLEtBQUtDLFNBQUwsQ0FBZTVCLFVBQWYsRUFBMkIsSUFBM0IsRUFBaUMsQ0FBakMsQ0FBckIsRUFBMEQsTUFBMUQsRUFBa0UsWUFBTTtBQUN0RVIscUJBQUdpQixLQUFILENBQVMsRUFBQ0MsS0FBUUksaUJBQVIscUJBQUQsRUFBOENILFNBQVNDLE9BQXZELEVBQWdFSCxPQUFPLEVBQUNnQixjQUFELEVBQXZFLEVBQVQ7QUFDRCxpQkFGRDtBQUdELGVBTDhDLEVBSzVDLElBTDRDLENBQS9DO0FBTUEscUJBQU8sSUFBUDtBQUNELGFBbkRZOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFUGIsMkJBRk8sR0FFRyxjQUZIO0FBR1BpQixtQ0FITyxHQUdXdkQsUUFBUSxTQUFSLEVBQW1CdUQsZUFIOUI7QUFJUEMsaUNBSk8sR0FJU3hELFFBQVEsU0FBUixFQUFtQndELGFBSjVCOztBQUtidkMsNkJBQVN1QyxjQUFjdkMsTUFBZCxFQUFzQixDQUFDLG1CQUFELEVBQXNCLGVBQXRCLENBQXRCLEVBQThEcUIsT0FBOUQsQ0FBVDtBQUNBcEIseUJBQUtzQyxjQUFjdEMsRUFBZCxFQUFrQixDQUFDLFlBQUQsRUFBZSxLQUFmLEVBQXNCLE9BQXRCLENBQWxCLEVBQWtEb0IsT0FBbEQsQ0FBTDs7QUFOYTtBQUFBLG9EQVFpQmlCLGdCQUFnQnRDLE9BQU91QixpQkFBdkIsQ0FSakI7O0FBQUE7QUFRVEEscUNBUlM7QUFBQTtBQUFBLG9EQVNhZSxnQkFBZ0J0QyxPQUFPd0MsYUFBdkIsQ0FUYjs7QUFBQTtBQVNUQSxpQ0FUUztBQVVUTiw2QkFBU2pELEtBQUt3RCxJQUFMLENBQVVELGNBQWN2RCxJQUF4QixFQUE4QnNDLG9CQUFvQixPQUFsRCxDQVZBOzs7QUFZYix3QkFBSSxDQUFDbkMsR0FBR0csV0FBSCxDQUFlZ0MsaUJBQWYsQ0FBTCxFQUF1Q25DLEdBQUdHLFdBQUgsQ0FBZWdDLGlCQUFmLElBQW9DLEVBQXBDO0FBQ25DZCxpQ0FBYXJCLEdBQUdHLFdBQUgsQ0FBZWdDLGlCQUFmLENBYko7QUFBQTtBQUFBLHlCQW9ETjtBQUNMQyxzQ0FESztBQUVMa0IsNkJBQUssU0FBZUEsR0FBZjtBQUFBLDhCQUFxQkMsR0FBckIsU0FBcUJBLEdBQXJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNDQUNFQSxHQURGO0FBQUE7QUFBQTtBQUFBOztBQUFBLHdDQUNhLElBQUloQixLQUFKLENBQVUsY0FBVixDQURiOztBQUFBO0FBRUNwQix5Q0FGRCxHQUVXLEVBRlg7O0FBR0hvQyxzQ0FBSWYsT0FBSixDQUFZLFVBQUNnQixFQUFELEVBQVE7QUFDbEJyQyw0Q0FBUXNDLElBQVIsQ0FBYS9ELEVBQUVnQyxLQUFGLENBQVFMLFdBQVdtQyxFQUFYLENBQVIsQ0FBYjtBQUNELG1DQUZEO0FBSEcsb0VBTUlyQyxPQU5KOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHlCQUZBO0FBVUxMLGtDQVZLO0FBV0w0QyxnQ0FBUSxTQUFlQSxNQUFmO0FBQUE7O0FBQUEsOEJBQXdCQyxZQUF4QixTQUF3QkEsWUFBeEI7QUFBQSw4QkFBc0NDLFNBQXRDLFNBQXNDQSxTQUF0QztBQUFBLDREQUFpREMsaUJBQWpEO0FBQUEsOEJBQWlEQSxpQkFBakQseUNBQXFFLEtBQXJFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDTkQsOENBQVlsRSxFQUFFZ0MsS0FBRixDQUFRa0MsU0FBUixDQUFaO0FBQ0FELCtDQUFhbkIsT0FBYixDQUFxQixrQkFBTXpCLEtBQU4sRUFBYStDLFVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw0RUFDTWhELEtBQUssRUFBQ0MsWUFBRCxFQUFMLENBRE47O0FBQUE7QUFDZmdELHdEQURlOztBQUVuQjtBQUNBQSx5REFBYXZCLE9BQWIsQ0FBcUIsVUFBQ3dCLElBQUQsRUFBVTtBQUM3QjNDLHlEQUFXMkMsS0FBS3RCLEdBQWhCLElBQXVCaEQsRUFBRXVFLEtBQUYsQ0FBUUQsSUFBUixFQUFjSixVQUFVRSxVQUFWLENBQWQsQ0FBdkIsQ0FENkIsQ0FDK0I7QUFDN0QsNkNBRkQ7O0FBSG1CLGtEQU1mLENBQUNDLGFBQWF6QixNQUFkLElBQXdCdUIsaUJBTlQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSw0RUFNa0N6QixPQUFPLEVBQUNDLE9BQU8sQ0FBQ3VCLFVBQVVFLFVBQVYsQ0FBRCxDQUFSLEVBQVAsQ0FObEM7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUNBQXJCO0FBUUFuQjtBQVZNLG9FQVdDLElBWEQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFYSDtBQXBETTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBOEViOUIsYUFBR3FELFVBQUgsQ0FBYyxzQ0FBZDs7QUE5RWE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoic3RvcmFnZS5pbm1lbW9yeS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBzaWZ0ID0gcmVxdWlyZSgnc2lmdCcpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG52YXIgZGIgPSBnbG9iYWwuaW5NZW1vcnlEYiA9IHtjb2xsZWN0aW9uczoge30sIGNvbGxlY3Rpb25zU2F2ZVRpbWVvdXQ6IHt9fVxuZnVuY3Rpb24gZ2V0UmVhZGFibGVEYXRlICgpIHsgcmV0dXJuIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9ULywgJyAnKS5yZXBsYWNlKC9cXC4uKy8sICcnKSB9XG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldFN0b3JhZ2VUZXN0UGFja2FnZSAoQ09ORklHLCBESSkge1xuICB0cnkge1xuICAgIGNvbnN0IFBBQ0tBR0UgPSAnc3RvcmFnZS50ZXN0J1xuICAgIGNvbnN0IGdldFZhbHVlUHJvbWlzZSA9IHJlcXVpcmUoJy4vamVzdXMnKS5nZXRWYWx1ZVByb21pc2VcbiAgICBjb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbiAgICBDT05GSUcgPSBjaGVja1JlcXVpcmVkKENPTkZJRywgWydzdG9yYWdlQ29sbGVjdGlvbicsICdzdG9yYWdlQ29uZmlnJ10sIFBBQ0tBR0UpXG4gICAgREkgPSBjaGVja1JlcXVpcmVkKERJLCBbJ3Rocm93RXJyb3InLCAnbG9nJywgJ2RlYnVnJ10sIFBBQ0tBR0UpXG5cbiAgICB2YXIgc3RvcmFnZUNvbGxlY3Rpb24gPSBhd2FpdCBnZXRWYWx1ZVByb21pc2UoQ09ORklHLnN0b3JhZ2VDb2xsZWN0aW9uKVxuICAgIHZhciBzdG9yYWdlQ29uZmlnID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5zdG9yYWdlQ29uZmlnKVxuICAgIHZhciBkYkZpbGUgPSBwYXRoLmpvaW4oc3RvcmFnZUNvbmZpZy5wYXRoLCBzdG9yYWdlQ29sbGVjdGlvbiArICcuanNvbicpXG5cbiAgICBpZiAoIWRiLmNvbGxlY3Rpb25zW3N0b3JhZ2VDb2xsZWN0aW9uXSlkYi5jb2xsZWN0aW9uc1tzdG9yYWdlQ29sbGVjdGlvbl0gPSB7fVxuICAgIHZhciBjb2xsZWN0aW9uID0gZGIuY29sbGVjdGlvbnNbc3RvcmFnZUNvbGxlY3Rpb25dXG5cbiAgICBhc3luYyBmdW5jdGlvbiBmaW5kICh7cXVlcnksIHNvcnQgPSBudWxsLCBsaW1pdCA9IDEwMDAsIHN0YXJ0ID0gMH0pIHtcbiAgICAgIC8vIFRPIEZJWFxuICAgICAgdmFyIHJlc3VsdHMgPSBzaWZ0KHF1ZXJ5LCBSLnZhbHVlcyhjb2xsZWN0aW9uKSlcblxuICAgICAgaWYgKHNvcnQpIHtcbiAgICAgICAgUi5mb3JFYWNoT2JqSW5kZXhlZCgoc29ydFZhbHVlLCBzb3J0SW5kZXgpID0+IHtcbiAgICAgICAgICB2YXIgYmVmb3JlID0gUi5jbG9uZShyZXN1bHRzKVxuICAgICAgICAgIHJlc3VsdHMgPSBSLnNvcnRCeShSLnByb3Aoc29ydEluZGV4KSwgcmVzdWx0cylcbiAgICAgICAgICBpZiAoIXNvcnRWYWx1ZSlyZXN1bHRzID0gUi5yZXZlcnNlKHJlc3VsdHMpXG4gICAgICAgICAgREkuZGVidWcoe21zZzogYGZpbmQoKSBzb3J0aW5nYCwgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtzb3J0VmFsdWUsIHNvcnRJbmRleCwgYmVmb3JlLCByZXN1bHRzfX0pXG4gICAgICAgIH0sIHNvcnQpXG4gICAgICB9XG4gICAgICByZXN1bHRzID0gUi5zbGljZShzdGFydCwgbGltaXQgKyBzdGFydCwgcmVzdWx0cylcbiAgICAgIERJLmRlYnVnKHttc2c6IGBmaW5kKCkgYCwgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtzdG9yYWdlQ29sbGVjdGlvbiwgcXVlcnksIGNvbGxlY3Rpb24sIHJlc3VsdHN9fSlcbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGluc2VydCAoe2l0ZW1zfSkge1xuICAgICAgaWYgKCFpdGVtcyB8fCAhaXRlbXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ05vIGl0ZW1zJylcbiAgICAgIGl0ZW1zID0gUi5jbG9uZShpdGVtcylcbiAgICAgIGl0ZW1zLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUuX2lkKXZhbHVlLl9pZCA9IHV1aWRWNCgpXG4gICAgICAgIGNvbGxlY3Rpb25bdmFsdWUuX2lkXSA9IHZhbHVlXG4gICAgICB9KVxuICAgICAgc2F2ZWZpbGUoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgZnVuY3Rpb24gc2F2ZWZpbGUgKCkge1xuICAgICAgaWYgKCFkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSlkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSA9IHt9XG4gICAgICBpZiAoZGIuY29sbGVjdGlvbnNTYXZlVGltZW91dFtzdG9yYWdlQ29sbGVjdGlvbl0pIGNsZWFyVGltZW91dChkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W3N0b3JhZ2VDb2xsZWN0aW9uXSlcbiAgICAgIGRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbc3RvcmFnZUNvbGxlY3Rpb25dID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIERJLmRlYnVnKHttc2c6IGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklUSU5HIFRPIERJU0sgYCwgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtkYkZpbGUsIGNvbGxlY3Rpb259fSlcbiAgICAgICAgZnMud3JpdGVGaWxlKGRiRmlsZSwgSlNPTi5zdHJpbmdpZnkoY29sbGVjdGlvbiwgbnVsbCwgNCksICd1dGY4JywgKCkgPT4ge1xuICAgICAgICAgIERJLmRlYnVnKHttc2c6IGAke3N0b3JhZ2VDb2xsZWN0aW9ufSBXUklURUQgVE8gRElTSyBgLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge2RiRmlsZX19KVxuICAgICAgICB9KVxuICAgICAgfSwgMTAwMClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBpbnNlcnQsXG4gICAgICBnZXQ6IGFzeW5jIGZ1bmN0aW9uIGdldCAoe2lkc30pIHtcbiAgICAgICAgaWYgKCFpZHMpIHRocm93IG5ldyBFcnJvcignTm8gaXRlbXMgaWRzJylcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXVxuICAgICAgICBpZHMuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgICAgICByZXN1bHRzLnB1c2goUi5jbG9uZShjb2xsZWN0aW9uW2lkXSkpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9LFxuICAgICAgZmluZCxcbiAgICAgIHVwZGF0ZTogYXN5bmMgZnVuY3Rpb24gdXBkYXRlICh7cXVlcmllc0FycmF5LCBkYXRhQXJyYXksIGluc2VydElmTm90RXhpc3RzID0gZmFsc2V9KSB7XG4gICAgICAgIGRhdGFBcnJheSA9IFIuY2xvbmUoZGF0YUFycmF5KVxuICAgICAgICBxdWVyaWVzQXJyYXkuZm9yRWFjaChhc3luYyhxdWVyeSwgcXVlcnlJbmRleCkgPT4ge1xuICAgICAgICAgIHZhciBxdWVyeVJlc3VsdHMgPSBhd2FpdCBmaW5kKHtxdWVyeX0pXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyh7cXVlcnlSZXN1bHRzfSlcbiAgICAgICAgICBxdWVyeVJlc3VsdHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgY29sbGVjdGlvbltpdGVtLl9pZF0gPSBSLm1lcmdlKGl0ZW0sIGRhdGFBcnJheVtxdWVyeUluZGV4XSkgLy9kYXRhQXJyYXlbcXVlcnlJbmRleF0uX2lkXG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAoIXF1ZXJ5UmVzdWx0cy5sZW5ndGggJiYgaW5zZXJ0SWZOb3RFeGlzdHMpIGF3YWl0IGluc2VydCh7aXRlbXM6IFtkYXRhQXJyYXlbcXVlcnlJbmRleF1dfSlcbiAgICAgICAgfSlcbiAgICAgICAgc2F2ZWZpbGUoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBESS50aHJvd0Vycm9yKCdnZXRTdG9yYWdlVGluZ29kYlBhY2thZ2UoQ09ORklHLCBESSknLCBlcnJvcilcbiAgfVxufVxuIl19