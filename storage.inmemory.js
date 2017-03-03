'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
var sift = require('sift');
var path = require('path');
var fs = require('fs');
var uuidV4 = require('uuid/v4');
var checkRequired = require('./jesus').checkRequired;
var db = global.db = global.db || { collections: {}, collectionsSaveTimeout: {} };
function getReadableDate() {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
var PACKAGE = 'storage.inmemory';

module.exports = function getStorageTestPackage(_ref) {
  var getConsole = _ref.getConsole,
      serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      storageConfig = _ref.storageConfig;

  try {
    var CONSOLE;
    var errorThrow;

    var _ret = function () {
      var getCollection = function getCollection(collectionName) {
        //checkRequired({ collectionName }, PACKAGE)
        if (!db.collections[collectionName]) db.collections[collectionName] = {};
        return db.collections[collectionName];
      };

      var find = function _callee(_ref2) {
        var collectionName = _ref2.collectionName,
            query = _ref2.query,
            _ref2$sort = _ref2.sort,
            sort = _ref2$sort === undefined ? null : _ref2$sort,
            _ref2$limit = _ref2.limit,
            limit = _ref2$limit === undefined ? 1000 : _ref2$limit,
            _ref2$start = _ref2.start,
            start = _ref2$start === undefined ? 0 : _ref2$start,
            _ref2$fields = _ref2.fields,
            fields = _ref2$fields === undefined ? null : _ref2$fields;
        var collection, results;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                collection = getCollection(collectionName);
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
                CONSOLE.debug('find()', { collectionName: collectionName, query: query, collection: collection, results: results });
                return _context.abrupt('return', results);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, null, this);
      };

      var insert = function _callee2(_ref3) {
        var collectionName = _ref3.collectionName,
            objs = _ref3.objs;
        var collection;
        return regeneratorRuntime.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                collection = getCollection(collectionName);

                CONSOLE.debug(collectionName + ' DB INSERT ', objs);

                if (objs) {
                  _context2.next = 4;
                  break;
                }

                throw 'No objs';

              case 4:
                objs = R.clone(objs);
                objs.forEach(function (value) {
                  if (!value._id) value._id = uuidV4();
                  collection[value._id] = value;
                });
                savefile(collectionName);
                return _context2.abrupt('return', objs);

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, null, this);
      };

      var savefile = function savefile(collectionName) {
        var dbFile = path.join(storageConfig.path, collectionName + '.json');
        if (!db.collectionsSaveTimeout[collectionName]) db.collectionsSaveTimeout[collectionName] = {};
        if (db.collectionsSaveTimeout[collectionName]) clearTimeout(db.collectionsSaveTimeout[collectionName]);
        db.collectionsSaveTimeout[collectionName] = setTimeout(function () {
          var collection = getCollection(collectionName);
          CONSOLE.debug(collectionName + ' WRITING TO LOGSK ', { dbFile: dbFile, collection: collection });
          fs.writeFile(dbFile, JSON.stringify(collection, null, 4), 'utf8', function () {
            CONSOLE.debug(collectionName + ' WRITED TO LOGSK ', { dbFile: dbFile });
          });
        }, 1000);
        return true;
      };

      CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
      errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);


      checkRequired({ serviceName: serviceName, serviceId: serviceId, storageConfig: storageConfig, 'storageConfig.path': storageConfig.path }, PACKAGE);

      return {
        v: {
          insert: insert,
          get: function get(_ref4) {
            var collectionName = _ref4.collectionName,
                ids = _ref4.ids;
            var collection, results;
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
                    collection = getCollection(collectionName);
                    results = [];

                    ids.forEach(function (id) {
                      if (collection[id]) results.push(R.clone(collection[id]));
                    });
                    return _context3.abrupt('return', results);

                  case 6:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, null, this);
          },
          find: find,
          update: function update(_ref5) {
            var _this = this;

            var collectionName = _ref5.collectionName,
                queriesArray = _ref5.queriesArray,
                dataArray = _ref5.dataArray,
                _ref5$insertIfNotExis = _ref5.insertIfNotExists,
                insertIfNotExists = _ref5$insertIfNotExis === undefined ? false : _ref5$insertIfNotExis;
            var collection;
            return regeneratorRuntime.async(function update$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    CONSOLE.debug('update ', { collectionName: collectionName, queriesArray: queriesArray, dataArray: dataArray, insertIfNotExists: insertIfNotExists });
                    dataArray = R.clone(dataArray);
                    collection = getCollection(collectionName);

                    queriesArray.forEach(function _callee3(query, queryIndex) {
                      var queryResults;
                      return regeneratorRuntime.async(function _callee3$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              _context4.next = 2;
                              return regeneratorRuntime.awrap(find({ collectionName: collectionName, query: query }));

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
                              return regeneratorRuntime.awrap(insert({ collectionName: collectionName, objs: [dataArray[queryIndex]] }));

                            case 7:
                            case 'end':
                              return _context4.stop();
                          }
                        }
                      }, null, _this);
                    });
                    savefile(collectionName);
                    return _context5.abrupt('return', true);

                  case 6:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, null, this);
          }
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    CONSOLE.error(error);
    throw PACKAGE + ' getStorageTingodbPackage';
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuaW5tZW1vcnkuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2lmdCIsInBhdGgiLCJmcyIsInV1aWRWNCIsImNoZWNrUmVxdWlyZWQiLCJkYiIsImdsb2JhbCIsImNvbGxlY3Rpb25zIiwiY29sbGVjdGlvbnNTYXZlVGltZW91dCIsImdldFJlYWRhYmxlRGF0ZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInJlcGxhY2UiLCJQQUNLQUdFIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFN0b3JhZ2VUZXN0UGFja2FnZSIsImdldENvbnNvbGUiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsInN0b3JhZ2VDb25maWciLCJDT05TT0xFIiwiZXJyb3JUaHJvdyIsImdldENvbGxlY3Rpb24iLCJjb2xsZWN0aW9uTmFtZSIsImZpbmQiLCJxdWVyeSIsInNvcnQiLCJsaW1pdCIsInN0YXJ0IiwiZmllbGRzIiwiY29sbGVjdGlvbiIsInJlc3VsdHMiLCJ2YWx1ZXMiLCJfaWQiLCJtYXAiLCJyZXN1bHQiLCJjbG9uZSIsInVudXNlZEtleXMiLCJPYmplY3QiLCJrZXlzIiwiZmlsdGVyIiwia2V5IiwiZm9yRWFjaCIsInYiLCJmb3JFYWNoT2JqSW5kZXhlZCIsInNvcnRWYWx1ZSIsInNvcnRJbmRleCIsInNvcnRCeSIsInByb3AiLCJyZXZlcnNlIiwic2xpY2UiLCJkZWJ1ZyIsImluc2VydCIsIm9ianMiLCJ2YWx1ZSIsInNhdmVmaWxlIiwiZGJGaWxlIiwiam9pbiIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJ3cml0ZUZpbGUiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2V0IiwiaWRzIiwiaWQiLCJwdXNoIiwidXBkYXRlIiwicXVlcmllc0FycmF5IiwiZGF0YUFycmF5IiwiaW5zZXJ0SWZOb3RFeGlzdHMiLCJxdWVyeUluZGV4IiwicXVlcnlSZXN1bHRzIiwib2JqIiwibWVyZ2UiLCJsZW5ndGgiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztB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QWE4QyxVQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOERBQ00vQyxLQUFLLEVBQUNELDhCQUFELEVBQWdCRSxZQUFoQixFQUFMLENBRE47O0FBQUE7QUFDZitDLDBDQURlOztBQUVuQjtBQUNBQSwyQ0FBYTlCLE9BQWIsQ0FBcUIsVUFBQytCLEdBQUQsRUFBUztBQUM1QjNDLDJDQUFXMkMsSUFBSXhDLEdBQWYsSUFBc0JwQyxFQUFFNkUsS0FBRixDQUFRRCxHQUFSLEVBQWFKLFVBQVVFLFVBQVYsQ0FBYixDQUF0QixDQUQ0QixDQUM4QjtBQUMzRCwrQkFGRDs7QUFIbUIsb0NBTWYsQ0FBQ0MsYUFBYUcsTUFBZCxJQUF3QkwsaUJBTlQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSw4REFNa0NsQixPQUFPLEVBQUM3Qiw4QkFBRCxFQUFnQjhCLE1BQU0sQ0FBQ2dCLFVBQVVFLFVBQVYsQ0FBRCxDQUF0QixFQUFQLENBTmxDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUFyQjtBQVFBaEIsNkJBQVNoQyxjQUFUO0FBWk0sc0RBYUMsSUFiRDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVpIO0FBQVA7QUE1REU7O0FBQUE7QUF3RkgsR0F4RkQsQ0F3RkUsT0FBT3FELEtBQVAsRUFBYztBQUNkeEQsWUFBUXdELEtBQVIsQ0FBY0EsS0FBZDtBQUNBLFVBQU1oRSxxQ0FBTjtBQUNEO0FBQ0YsQ0E3RkQiLCJmaWxlIjoic3RvcmFnZS5pbm1lbW9yeS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBzaWZ0ID0gcmVxdWlyZSgnc2lmdCcpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbnZhciBkYiA9IGdsb2JhbC5kYiA9IGdsb2JhbC5kYiB8fCB7Y29sbGVjdGlvbnM6IHt9LCBjb2xsZWN0aW9uc1NhdmVUaW1lb3V0OiB7fX1cbmZ1bmN0aW9uIGdldFJlYWRhYmxlRGF0ZSAoKSB7IHJldHVybiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvVC8sICcgJykucmVwbGFjZSgvXFwuLisvLCAnJykgfVxuY29uc3QgUEFDS0FHRSA9ICdzdG9yYWdlLmlubWVtb3J5J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFN0b3JhZ2VUZXN0UGFja2FnZSAoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb25maWd9KSB7XG4gIHRyeSB7XG4gICAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gICAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG4gICAgY2hlY2tSZXF1aXJlZCh7IHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb25maWcsICdzdG9yYWdlQ29uZmlnLnBhdGgnOiBzdG9yYWdlQ29uZmlnLnBhdGh9LCBQQUNLQUdFKVxuICAgIGZ1bmN0aW9uIGdldENvbGxlY3Rpb24gKGNvbGxlY3Rpb25OYW1lKSB7XG4gICAgICAvL2NoZWNrUmVxdWlyZWQoeyBjb2xsZWN0aW9uTmFtZSB9LCBQQUNLQUdFKVxuICAgICAgaWYgKCFkYi5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uTmFtZV0pZGIuY29sbGVjdGlvbnNbY29sbGVjdGlvbk5hbWVdID0ge31cbiAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uTmFtZV1cbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBmaW5kICh7Y29sbGVjdGlvbk5hbWUsIHF1ZXJ5LCBzb3J0ID0gbnVsbCwgbGltaXQgPSAxMDAwLCBzdGFydCA9IDAsIGZpZWxkcyA9IG51bGx9KSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiA9IGdldENvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUpXG4gICAgICB2YXIgcmVzdWx0cyA9IHNpZnQocXVlcnksIFIudmFsdWVzKGNvbGxlY3Rpb24pKVxuICAgICAgaWYgKGZpZWxkcykge1xuICAgICAgICBmaWVsZHMuX2lkID0gMVxuICAgICAgICByZXN1bHRzID0gUi5tYXAocmVzdWx0ID0+IHtcbiAgICAgICAgICByZXN1bHQgPSBSLmNsb25lKHJlc3VsdClcbiAgICAgICAgICB2YXIgdW51c2VkS2V5cyA9IE9iamVjdC5rZXlzKHJlc3VsdCkuZmlsdGVyKGtleSA9PiAhZmllbGRzW2tleV0pXG4gICAgICAgICAgdW51c2VkS2V5cy5mb3JFYWNoKHYgPT4gZGVsZXRlIHJlc3VsdFt2XSlcbiAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIH0sIHJlc3VsdHMpXG4gICAgICB9XG4gICAgICBpZiAoc29ydCkge1xuICAgICAgICBSLmZvckVhY2hPYmpJbmRleGVkKChzb3J0VmFsdWUsIHNvcnRJbmRleCkgPT4ge1xuICAgICAgICAgIC8vIHZhciBiZWZvcmUgPSBSLmNsb25lKHJlc3VsdHMpXG4gICAgICAgICAgcmVzdWx0cyA9IFIuc29ydEJ5KFIucHJvcChzb3J0SW5kZXgpLCByZXN1bHRzKVxuICAgICAgICAgIGlmICghc29ydFZhbHVlKXJlc3VsdHMgPSBSLnJldmVyc2UocmVzdWx0cylcbiAgICAgICAgICAvLyBDT05TT0xFLmRlYnVnKGBmaW5kKCkgc29ydGluZ2AsIHtzb3J0VmFsdWUsIHNvcnRJbmRleCwgYmVmb3JlLCByZXN1bHRzfSlcbiAgICAgICAgfSwgc29ydClcbiAgICAgIH1cbiAgICAgIHJlc3VsdHMgPSBSLnNsaWNlKHN0YXJ0LCBsaW1pdCArIHN0YXJ0LCByZXN1bHRzKVxuICAgICAgQ09OU09MRS5kZWJ1ZyhgZmluZCgpYCwge2NvbGxlY3Rpb25OYW1lLCBxdWVyeSwgY29sbGVjdGlvbiwgcmVzdWx0c30pXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBpbnNlcnQgKHtjb2xsZWN0aW9uTmFtZSwgb2Jqc30pIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uID0gZ2V0Q29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSlcbiAgICAgIENPTlNPTEUuZGVidWcoYCR7Y29sbGVjdGlvbk5hbWV9IERCIElOU0VSVCBgLCBvYmpzKVxuICAgICAgaWYgKCFvYmpzKSB0aHJvdyAnTm8gb2JqcydcbiAgICAgIG9ianMgPSBSLmNsb25lKG9ianMpXG4gICAgICBvYmpzLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUuX2lkKXZhbHVlLl9pZCA9IHV1aWRWNCgpXG4gICAgICAgIGNvbGxlY3Rpb25bdmFsdWUuX2lkXSA9IHZhbHVlXG4gICAgICB9KVxuICAgICAgc2F2ZWZpbGUoY29sbGVjdGlvbk5hbWUpXG4gICAgICByZXR1cm4gb2Jqc1xuICAgIH1cbiAgICBmdW5jdGlvbiBzYXZlZmlsZSAoY29sbGVjdGlvbk5hbWUpIHtcbiAgICAgIHZhciBkYkZpbGUgPSBwYXRoLmpvaW4oc3RvcmFnZUNvbmZpZy5wYXRoLCBjb2xsZWN0aW9uTmFtZSArICcuanNvbicpXG4gICAgICBpZiAoIWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbY29sbGVjdGlvbk5hbWVdKWRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbY29sbGVjdGlvbk5hbWVdID0ge31cbiAgICAgIGlmIChkYi5jb2xsZWN0aW9uc1NhdmVUaW1lb3V0W2NvbGxlY3Rpb25OYW1lXSkgY2xlYXJUaW1lb3V0KGRiLmNvbGxlY3Rpb25zU2F2ZVRpbWVvdXRbY29sbGVjdGlvbk5hbWVdKVxuICAgICAgZGIuY29sbGVjdGlvbnNTYXZlVGltZW91dFtjb2xsZWN0aW9uTmFtZV0gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbGxlY3Rpb24gPSBnZXRDb2xsZWN0aW9uKGNvbGxlY3Rpb25OYW1lKVxuICAgICAgICBDT05TT0xFLmRlYnVnKGAke2NvbGxlY3Rpb25OYW1lfSBXUklUSU5HIFRPIExPR1NLIGAsIHtkYkZpbGUsIGNvbGxlY3Rpb259KVxuICAgICAgICBmcy53cml0ZUZpbGUoZGJGaWxlLCBKU09OLnN0cmluZ2lmeShjb2xsZWN0aW9uLCBudWxsLCA0KSwgJ3V0ZjgnLCAoKSA9PiB7XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZyhgJHtjb2xsZWN0aW9uTmFtZX0gV1JJVEVEIFRPIExPR1NLIGAsIHtkYkZpbGV9KVxuICAgICAgICB9KVxuICAgICAgfSwgMTAwMClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBpbnNlcnQsXG4gICAgICBnZXQ6IGFzeW5jIGZ1bmN0aW9uIGdldCAoe2NvbGxlY3Rpb25OYW1lLCBpZHN9KSB7XG4gICAgICAgIGlmICghaWRzKSB0aHJvdyAnTm8gb2JqcyBpZHMnXG4gICAgICAgIHZhciBjb2xsZWN0aW9uID0gZ2V0Q29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSlcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXVxuICAgICAgICBpZHMuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgICAgICBpZiAoY29sbGVjdGlvbltpZF0pcmVzdWx0cy5wdXNoKFIuY2xvbmUoY29sbGVjdGlvbltpZF0pKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfSxcbiAgICAgIGZpbmQsXG4gICAgICB1cGRhdGU6IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZSAoe2NvbGxlY3Rpb25OYW1lLCBxdWVyaWVzQXJyYXksIGRhdGFBcnJheSwgaW5zZXJ0SWZOb3RFeGlzdHMgPSBmYWxzZX0pIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1ZyhgdXBkYXRlIGAsIHtjb2xsZWN0aW9uTmFtZSwgcXVlcmllc0FycmF5LCBkYXRhQXJyYXksIGluc2VydElmTm90RXhpc3RzfSlcbiAgICAgICAgZGF0YUFycmF5ID0gUi5jbG9uZShkYXRhQXJyYXkpXG4gICAgICAgIHZhciBjb2xsZWN0aW9uID0gZ2V0Q29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSlcbiAgICAgICAgcXVlcmllc0FycmF5LmZvckVhY2goYXN5bmMocXVlcnksIHF1ZXJ5SW5kZXgpID0+IHtcbiAgICAgICAgICB2YXIgcXVlcnlSZXN1bHRzID0gYXdhaXQgZmluZCh7Y29sbGVjdGlvbk5hbWUscXVlcnl9KVxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHtxdWVyeVJlc3VsdHN9KVxuICAgICAgICAgIHF1ZXJ5UmVzdWx0cy5mb3JFYWNoKChvYmopID0+IHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb25bb2JqLl9pZF0gPSBSLm1lcmdlKG9iaiwgZGF0YUFycmF5W3F1ZXJ5SW5kZXhdKSAvLyBkYXRhQXJyYXlbcXVlcnlJbmRleF0uX2lkXG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAoIXF1ZXJ5UmVzdWx0cy5sZW5ndGggJiYgaW5zZXJ0SWZOb3RFeGlzdHMpIGF3YWl0IGluc2VydCh7Y29sbGVjdGlvbk5hbWUsb2JqczogW2RhdGFBcnJheVtxdWVyeUluZGV4XV19KVxuICAgICAgICB9KVxuICAgICAgICBzYXZlZmlsZShjb2xsZWN0aW9uTmFtZSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ09OU09MRS5lcnJvcihlcnJvcilcbiAgICB0aHJvdyBQQUNLQUdFICsgYCBnZXRTdG9yYWdlVGluZ29kYlBhY2thZ2VgXG4gIH1cbn1cbiJdfQ==