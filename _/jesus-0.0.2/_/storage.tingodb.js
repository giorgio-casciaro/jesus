'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Db = require('tingodb')().Db;
var R = require('ramda');
var checkNullId = function checkNullId(entity) {
  if (!entity._id) {
    delete entity._id;
  }
  return entity;
};
var idToString = function idToString(id) {
  return id.toString ? id.toString() : id;
};

var getCollection = function getCollection(dbConfig, collectionName) {
  var db = new Db(dbConfig.path, {});
  return db.collection(collectionName);
};

module.exports = function getStorageTingodbPackage(CONFIG, DI) {
  var _this = this;

  var storageCollection, storageConfig, collection, _ret;

  return regeneratorRuntime.async(function getStorageTingodbPackage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(function _callee() {
            var PACKAGE, getValuePromise, checkRequired;
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    PACKAGE = 'storage.tingodb';
                    getValuePromise = require('./jesus').getValuePromise;
                    checkRequired = require('./jesus').checkRequired;

                    CONFIG = checkRequired(CONFIG, ['storageCollection', 'storageConfig'], PACKAGE);
                    DI = checkRequired(DI, [], PACKAGE);
                    _context2.next = 7;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.storageCollection));

                  case 7:
                    storageCollection = _context2.sent;
                    _context2.next = 10;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.storageConfig));

                  case 10:
                    storageConfig = _context2.sent;
                    collection = getCollection(storageConfig, storageCollection);
                    return _context2.abrupt('return', {
                      v: {
                        insert: function insert(_ref) {
                          var items = _ref.items;
                          return regeneratorRuntime.async(function insert$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.prev = 0;

                                  if (!(!items || !items.length)) {
                                    _context.next = 3;
                                    break;
                                  }

                                  throw new Error("No items");

                                case 3:
                                  collection.insertMany(R.map(checkNullId, items), function (err, result) {
                                    if (err) throw new Error(err.errmsg);
                                    var returnValue = R.map(idToString, result.insertedIds);
                                    return returnValue;
                                  });
                                  _context.next = 9;
                                  break;

                                case 6:
                                  _context.prev = 6;
                                  _context.t0 = _context['catch'](0);

                                  DI.throwError(PACKAGE + ' insert(args) ', _context.t0, { items: items });

                                case 9:
                                case 'end':
                                  return _context.stop();
                              }
                            }
                          }, null, this, [[0, 6]]);
                        }
                      }
                    });

                  case 13:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, _this);
          }());

        case 3:
          _ret = _context3.sent;

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt('return', _ret.v);

        case 6:
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3['catch'](0);

          DI.throwError('getStorageTingodbPackage(CONFIG, DI)', _context3.t0);

        case 11:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this, [[0, 8]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UudGluZ29kYi5lczYiXSwibmFtZXMiOlsiRGIiLCJyZXF1aXJlIiwiUiIsImNoZWNrTnVsbElkIiwiZW50aXR5IiwiX2lkIiwiaWRUb1N0cmluZyIsImlkIiwidG9TdHJpbmciLCJnZXRDb2xsZWN0aW9uIiwiZGJDb25maWciLCJjb2xsZWN0aW9uTmFtZSIsImRiIiwicGF0aCIsImNvbGxlY3Rpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0U3RvcmFnZVRpbmdvZGJQYWNrYWdlIiwiQ09ORklHIiwiREkiLCJQQUNLQUdFIiwiZ2V0VmFsdWVQcm9taXNlIiwiY2hlY2tSZXF1aXJlZCIsInN0b3JhZ2VDb2xsZWN0aW9uIiwic3RvcmFnZUNvbmZpZyIsImluc2VydCIsIml0ZW1zIiwibGVuZ3RoIiwiRXJyb3IiLCJpbnNlcnRNYW55IiwibWFwIiwiZXJyIiwicmVzdWx0IiwiZXJybXNnIiwicmV0dXJuVmFsdWUiLCJpbnNlcnRlZElkcyIsInRocm93RXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxLQUFLQyxRQUFRLFNBQVIsSUFBcUJELEVBQTlCO0FBQ0EsSUFBSUUsSUFBSUQsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJRSxjQUFjLFNBQWRBLFdBQWMsQ0FBQ0MsTUFBRCxFQUFZO0FBQzVCLE1BQUksQ0FBQ0EsT0FBT0MsR0FBWixFQUFpQjtBQUNmLFdBQU9ELE9BQU9DLEdBQWQ7QUFDRDtBQUNELFNBQU9ELE1BQVA7QUFDRCxDQUxEO0FBTUEsSUFBSUUsYUFBYSxTQUFiQSxVQUFhLENBQUNDLEVBQUQ7QUFBQSxTQUFRQSxHQUFHQyxRQUFILEdBQWNELEdBQUdDLFFBQUgsRUFBZCxHQUE4QkQsRUFBdEM7QUFBQSxDQUFqQjs7QUFFQSxJQUFJRSxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNDLFFBQUQsRUFBV0MsY0FBWCxFQUE4QjtBQUNoRCxNQUFJQyxLQUFLLElBQUlaLEVBQUosQ0FBT1UsU0FBU0csSUFBaEIsRUFBc0IsRUFBdEIsQ0FBVDtBQUNBLFNBQU9ELEdBQUdFLFVBQUgsQ0FBY0gsY0FBZCxDQUFQO0FBQ0QsQ0FIRDs7QUFLQUksT0FBT0MsT0FBUCxHQUFpQixTQUFlQyx3QkFBZixDQUF5Q0MsTUFBekMsRUFBaURDLEVBQWpEO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRVBDLDJCQUZPLEdBRUcsaUJBRkg7QUFHUEMsbUNBSE8sR0FHV3BCLFFBQVEsU0FBUixFQUFtQm9CLGVBSDlCO0FBSVBDLGlDQUpPLEdBSVNyQixRQUFRLFNBQVIsRUFBbUJxQixhQUo1Qjs7QUFLYkosNkJBQVNJLGNBQWNKLE1BQWQsRUFBc0IsQ0FBQyxtQkFBRCxFQUFzQixlQUF0QixDQUF0QixFQUE4REUsT0FBOUQsQ0FBVDtBQUNBRCx5QkFBS0csY0FBY0gsRUFBZCxFQUFrQixFQUFsQixFQUFzQkMsT0FBdEIsQ0FBTDtBQU5hO0FBQUEsb0RBT2lCQyxnQkFBZ0JILE9BQU9LLGlCQUF2QixDQVBqQjs7QUFBQTtBQU9UQSxxQ0FQUztBQUFBO0FBQUEsb0RBUWFGLGdCQUFnQkgsT0FBT00sYUFBdkIsQ0FSYjs7QUFBQTtBQVFUQSxpQ0FSUztBQVNUVixpQ0FBYUwsY0FBY2UsYUFBZCxFQUE2QkQsaUJBQTdCLENBVEo7QUFBQTtBQUFBLHlCQVVOO0FBQ0xFLGdDQUFRLFNBQWVBLE1BQWY7QUFBQSw4QkFBd0JDLEtBQXhCLFFBQXdCQSxLQUF4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUEsd0NBRUQsQ0FBQ0EsS0FBRCxJQUFRLENBQUNBLE1BQU1DLE1BRmQ7QUFBQTtBQUFBO0FBQUE7O0FBQUEsd0NBRTJCLElBQUlDLEtBQUosQ0FBVSxVQUFWLENBRjNCOztBQUFBO0FBR0pkLDZDQUFXZSxVQUFYLENBQXNCM0IsRUFBRTRCLEdBQUYsQ0FBTTNCLFdBQU4sRUFBbUJ1QixLQUFuQixDQUF0QixFQUFpRCxVQUFDSyxHQUFELEVBQU1DLE1BQU4sRUFBaUI7QUFDaEUsd0NBQUlELEdBQUosRUFBUyxNQUFNLElBQUlILEtBQUosQ0FBVUcsSUFBSUUsTUFBZCxDQUFOO0FBQ1Qsd0NBQUlDLGNBQWNoQyxFQUFFNEIsR0FBRixDQUFNeEIsVUFBTixFQUFrQjBCLE9BQU9HLFdBQXpCLENBQWxCO0FBQ0EsMkNBQU9ELFdBQVA7QUFDRCxtQ0FKRDtBQUhJO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQVNKZixxQ0FBR2lCLFVBQUgsQ0FBY2hCLFVBQVUsZ0JBQXhCLGVBQWlELEVBQUNNLFlBQUQsRUFBakQ7O0FBVEk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFESDtBQVZNOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUF5QmJQLGFBQUdpQixVQUFILENBQWMsc0NBQWQ7O0FBekJhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6InN0b3JhZ2UudGluZ29kYi5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRGIgPSByZXF1aXJlKCd0aW5nb2RiJykoKS5EYlxudmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgY2hlY2tOdWxsSWQgPSAoZW50aXR5KSA9PiB7XG4gIGlmICghZW50aXR5Ll9pZCkge1xuICAgIGRlbGV0ZSBlbnRpdHkuX2lkXG4gIH1cbiAgcmV0dXJuIGVudGl0eVxufVxudmFyIGlkVG9TdHJpbmcgPSAoaWQpID0+IGlkLnRvU3RyaW5nID8gaWQudG9TdHJpbmcoKSA6IGlkXG5cbnZhciBnZXRDb2xsZWN0aW9uID0gKGRiQ29uZmlnLCBjb2xsZWN0aW9uTmFtZSkgPT4ge1xuICB2YXIgZGIgPSBuZXcgRGIoZGJDb25maWcucGF0aCwge30pXG4gIHJldHVybiBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25OYW1lKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldFN0b3JhZ2VUaW5nb2RiUGFja2FnZSAoQ09ORklHLCBESSkge1xuICB0cnkge1xuICAgIGNvbnN0IFBBQ0tBR0UgPSAnc3RvcmFnZS50aW5nb2RiJ1xuICAgIGNvbnN0IGdldFZhbHVlUHJvbWlzZSA9IHJlcXVpcmUoJy4vamVzdXMnKS5nZXRWYWx1ZVByb21pc2VcbiAgICBjb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbiAgICBDT05GSUcgPSBjaGVja1JlcXVpcmVkKENPTkZJRywgWydzdG9yYWdlQ29sbGVjdGlvbicsICdzdG9yYWdlQ29uZmlnJ10sIFBBQ0tBR0UpXG4gICAgREkgPSBjaGVja1JlcXVpcmVkKERJLCBbXSwgUEFDS0FHRSlcbiAgICB2YXIgc3RvcmFnZUNvbGxlY3Rpb24gPSBhd2FpdCBnZXRWYWx1ZVByb21pc2UoQ09ORklHLnN0b3JhZ2VDb2xsZWN0aW9uKVxuICAgIHZhciBzdG9yYWdlQ29uZmlnID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5zdG9yYWdlQ29uZmlnKVxuICAgIHZhciBjb2xsZWN0aW9uID0gZ2V0Q29sbGVjdGlvbihzdG9yYWdlQ29uZmlnLCBzdG9yYWdlQ29sbGVjdGlvbilcbiAgICByZXR1cm4ge1xuICAgICAgaW5zZXJ0OiBhc3luYyBmdW5jdGlvbiBpbnNlcnQgKHtpdGVtc30pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZighaXRlbXN8fCFpdGVtcy5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiTm8gaXRlbXNcIilcbiAgICAgICAgICBjb2xsZWN0aW9uLmluc2VydE1hbnkoUi5tYXAoY2hlY2tOdWxsSWQsIGl0ZW1zKSwgKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBuZXcgRXJyb3IoZXJyLmVycm1zZylcbiAgICAgICAgICAgIHZhciByZXR1cm5WYWx1ZSA9IFIubWFwKGlkVG9TdHJpbmcsIHJlc3VsdC5pbnNlcnRlZElkcylcbiAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgREkudGhyb3dFcnJvcihQQUNLQUdFICsgJyBpbnNlcnQoYXJncykgJywgZXJyb3IsIHtpdGVtc30pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0U3RvcmFnZVRpbmdvZGJQYWNrYWdlKENPTkZJRywgREkpJywgZXJyb3IpXG4gIH1cbn1cbiJdfQ==