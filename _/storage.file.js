'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var fs = require('fs-extra');
var path = require('path');
var R = require('ramda');

var uuidV4 = require('uuid/v4');
var checkNullId = function checkNullId(entity) {
  if (!entity._id) {
    delete entity._id;
  }
  return entity;
};
var idToString = function idToString(id) {
  return id.toString ? id.toString() : id;
};

var getCollectionFile = function getCollectionFile(storageConfig, collection) {
  var db = new Db(storageConfig.path, {});
  return db.collection(collection);
};

module.exports = function getStorageFilePackage(CONFIG, DI) {
  var _this = this;

  var storageCollection, storageConfig, collectionFile, _ret;

  return regeneratorRuntime.async(function getStorageFilePackage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(function _callee() {
            var PACKAGE, getValuePromise, checkRequired;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    PACKAGE = 'storage.file';
                    getValuePromise = require('./jesus').getValuePromise;
                    checkRequired = require('./jesus').checkRequired;

                    CONFIG = checkRequired(CONFIG, ['storageCollection', 'storageConfig'], PACKAGE);
                    DI = checkRequired(DI, ['throwError'], PACKAGE);
                    _context.next = 7;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.storageCollection));

                  case 7:
                    storageCollection = _context.sent;
                    _context.next = 10;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.storageConfig));

                  case 10:
                    storageConfig = _context.sent;
                    collectionFile = path.join(storageConfig.path, storageCollection);

                    console.log("collectionFile", collectionFile);
                    return _context.abrupt('return', {
                      v: {
                        insert: function insert(_ref) {
                          var items = _ref.items;

                          try {
                            var outputJsonPromises = items.map(function (item) {
                              return new Promise(function (resolve, reject) {
                                if (!item._id) item._id = uuidV4();
                                fs.outputJson(path.join(collectionFile, item._id), item, function (err) {
                                  if (err) reject(err);
                                  resolve(true);
                                });
                              });
                            });
                            return outputJsonPromises;
                          } catch (error) {
                            DI.throwError(PACKAGE + ' insert(args) ', error, { items: items });
                          }
                        }
                      }
                    });

                  case 14:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, _this);
          }());

        case 3:
          _ret = _context2.sent;

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt('return', _ret.v);

        case 6:
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2['catch'](0);

          DI.throwError('getStorageTingodbPackage(CONFIG, DI)', _context2.t0);

        case 11:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this, [[0, 8]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuZmlsZS5lczYiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwicGF0aCIsIlIiLCJ1dWlkVjQiLCJjaGVja051bGxJZCIsImVudGl0eSIsIl9pZCIsImlkVG9TdHJpbmciLCJpZCIsInRvU3RyaW5nIiwiZ2V0Q29sbGVjdGlvbkZpbGUiLCJzdG9yYWdlQ29uZmlnIiwiY29sbGVjdGlvbiIsImRiIiwiRGIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0U3RvcmFnZUZpbGVQYWNrYWdlIiwiQ09ORklHIiwiREkiLCJQQUNLQUdFIiwiZ2V0VmFsdWVQcm9taXNlIiwiY2hlY2tSZXF1aXJlZCIsInN0b3JhZ2VDb2xsZWN0aW9uIiwiY29sbGVjdGlvbkZpbGUiLCJqb2luIiwiY29uc29sZSIsImxvZyIsImluc2VydCIsIml0ZW1zIiwib3V0cHV0SnNvblByb21pc2VzIiwibWFwIiwiaXRlbSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib3V0cHV0SnNvbiIsImVyciIsImVycm9yIiwidGhyb3dFcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLEtBQUtDLFFBQVEsVUFBUixDQUFUO0FBQ0EsSUFBSUMsT0FBT0QsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJRSxJQUFJRixRQUFRLE9BQVIsQ0FBUjs7QUFFQSxJQUFNRyxTQUFTSCxRQUFRLFNBQVIsQ0FBZjtBQUNBLElBQUlJLGNBQWMsU0FBZEEsV0FBYyxDQUFDQyxNQUFELEVBQVk7QUFDNUIsTUFBSSxDQUFDQSxPQUFPQyxHQUFaLEVBQWlCO0FBQ2YsV0FBT0QsT0FBT0MsR0FBZDtBQUNEO0FBQ0QsU0FBT0QsTUFBUDtBQUNELENBTEQ7QUFNQSxJQUFJRSxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0MsRUFBRDtBQUFBLFNBQVFBLEdBQUdDLFFBQUgsR0FBY0QsR0FBR0MsUUFBSCxFQUFkLEdBQThCRCxFQUF0QztBQUFBLENBQWpCOztBQUVBLElBQUlFLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQUNDLGFBQUQsRUFBZ0JDLFVBQWhCLEVBQStCO0FBQ3JELE1BQUlDLEtBQUssSUFBSUMsRUFBSixDQUFPSCxjQUFjVixJQUFyQixFQUEyQixFQUEzQixDQUFUO0FBQ0EsU0FBT1ksR0FBR0QsVUFBSCxDQUFjQSxVQUFkLENBQVA7QUFDRCxDQUhEOztBQUtBRyxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLHFCQUFmLENBQXNDQyxNQUF0QyxFQUE4Q0MsRUFBOUM7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFUEMsMkJBRk8sR0FFRyxjQUZIO0FBR1BDLG1DQUhPLEdBR1dyQixRQUFRLFNBQVIsRUFBbUJxQixlQUg5QjtBQUlQQyxpQ0FKTyxHQUlTdEIsUUFBUSxTQUFSLEVBQW1Cc0IsYUFKNUI7O0FBS2JKLDZCQUFTSSxjQUFjSixNQUFkLEVBQXNCLENBQUMsbUJBQUQsRUFBc0IsZUFBdEIsQ0FBdEIsRUFBOERFLE9BQTlELENBQVQ7QUFDQUQseUJBQUtHLGNBQWNILEVBQWQsRUFBa0IsQ0FBQyxZQUFELENBQWxCLEVBQWtDQyxPQUFsQyxDQUFMO0FBTmE7QUFBQSxvREFPaUJDLGdCQUFnQkgsT0FBT0ssaUJBQXZCLENBUGpCOztBQUFBO0FBT1RBLHFDQVBTO0FBQUE7QUFBQSxvREFRYUYsZ0JBQWdCSCxPQUFPUCxhQUF2QixDQVJiOztBQUFBO0FBUVRBLGlDQVJTO0FBU1RhLHFDQUFpQnZCLEtBQUt3QixJQUFMLENBQVVkLGNBQWNWLElBQXhCLEVBQThCc0IsaUJBQTlCLENBVFI7O0FBVWJHLDRCQUFRQyxHQUFSLENBQVksZ0JBQVosRUFBNkJILGNBQTdCO0FBVmE7QUFBQSx5QkFXTjtBQUNMSSxnQ0FBUSxTQUFTQSxNQUFULE9BQTBCO0FBQUEsOEJBQVJDLEtBQVEsUUFBUkEsS0FBUTs7QUFDaEMsOEJBQUk7QUFDRixnQ0FBSUMscUJBQXFCRCxNQUFNRSxHQUFOLENBQVUsVUFBQ0MsSUFBRCxFQUFVO0FBQzNDLHFDQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVNDLE1BQVQsRUFBb0I7QUFDckMsb0NBQUcsQ0FBRUgsS0FBSzFCLEdBQVYsRUFBZTBCLEtBQUsxQixHQUFMLEdBQVNILFFBQVQ7QUFDZkosbUNBQUdxQyxVQUFILENBQWNuQyxLQUFLd0IsSUFBTCxDQUFVRCxjQUFWLEVBQTBCUSxLQUFLMUIsR0FBL0IsQ0FBZCxFQUFtRDBCLElBQW5ELEVBQXlELFVBQVVLLEdBQVYsRUFBZTtBQUN0RSxzQ0FBR0EsR0FBSCxFQUFPRixPQUFPRSxHQUFQO0FBQ1BILDBDQUFRLElBQVI7QUFDRCxpQ0FIRDtBQUlELCtCQU5NLENBQVA7QUFPRCw2QkFSd0IsQ0FBekI7QUFTQSxtQ0FBT0osa0JBQVA7QUFDRCwyQkFYRCxDQVdFLE9BQU9RLEtBQVAsRUFBYztBQUNkbkIsK0JBQUdvQixVQUFILENBQWNuQixVQUFVLGdCQUF4QixFQUEwQ2tCLEtBQTFDLEVBQWlELEVBQUNULFlBQUQsRUFBakQ7QUFDRDtBQUNGO0FBaEJJO0FBWE07O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQThCYlYsYUFBR29CLFVBQUgsQ0FBYyxzQ0FBZDs7QUE5QmE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoic3RvcmFnZS5maWxlLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcblxuY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG52YXIgY2hlY2tOdWxsSWQgPSAoZW50aXR5KSA9PiB7XG4gIGlmICghZW50aXR5Ll9pZCkge1xuICAgIGRlbGV0ZSBlbnRpdHkuX2lkXG4gIH1cbiAgcmV0dXJuIGVudGl0eVxufVxudmFyIGlkVG9TdHJpbmcgPSAoaWQpID0+IGlkLnRvU3RyaW5nID8gaWQudG9TdHJpbmcoKSA6IGlkXG5cbnZhciBnZXRDb2xsZWN0aW9uRmlsZSA9IChzdG9yYWdlQ29uZmlnLCBjb2xsZWN0aW9uKSA9PiB7XG4gIHZhciBkYiA9IG5ldyBEYihzdG9yYWdlQ29uZmlnLnBhdGgsIHt9KVxuICByZXR1cm4gZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldFN0b3JhZ2VGaWxlUGFja2FnZSAoQ09ORklHLCBESSkge1xuICB0cnkge1xuICAgIGNvbnN0IFBBQ0tBR0UgPSAnc3RvcmFnZS5maWxlJ1xuICAgIGNvbnN0IGdldFZhbHVlUHJvbWlzZSA9IHJlcXVpcmUoJy4vamVzdXMnKS5nZXRWYWx1ZVByb21pc2VcbiAgICBjb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbiAgICBDT05GSUcgPSBjaGVja1JlcXVpcmVkKENPTkZJRywgWydzdG9yYWdlQ29sbGVjdGlvbicsICdzdG9yYWdlQ29uZmlnJ10sIFBBQ0tBR0UpXG4gICAgREkgPSBjaGVja1JlcXVpcmVkKERJLCBbJ3Rocm93RXJyb3InXSwgUEFDS0FHRSlcbiAgICB2YXIgc3RvcmFnZUNvbGxlY3Rpb24gPSBhd2FpdCBnZXRWYWx1ZVByb21pc2UoQ09ORklHLnN0b3JhZ2VDb2xsZWN0aW9uKVxuICAgIHZhciBzdG9yYWdlQ29uZmlnID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5zdG9yYWdlQ29uZmlnKVxuICAgIHZhciBjb2xsZWN0aW9uRmlsZSA9IHBhdGguam9pbihzdG9yYWdlQ29uZmlnLnBhdGgsIHN0b3JhZ2VDb2xsZWN0aW9uKVxuICAgIGNvbnNvbGUubG9nKFwiY29sbGVjdGlvbkZpbGVcIixjb2xsZWN0aW9uRmlsZSlcbiAgICByZXR1cm4ge1xuICAgICAgaW5zZXJ0OiBmdW5jdGlvbiBpbnNlcnQgKHtpdGVtc30pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgb3V0cHV0SnNvblByb21pc2VzID0gaXRlbXMubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgIGlmKCEgaXRlbS5faWQpIGl0ZW0uX2lkPXV1aWRWNCgpXG4gICAgICAgICAgICAgIGZzLm91dHB1dEpzb24ocGF0aC5qb2luKGNvbGxlY3Rpb25GaWxlLCBpdGVtLl9pZCksIGl0ZW0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZihlcnIpcmVqZWN0KGVycilcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuIG91dHB1dEpzb25Qcm9taXNlc1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIERJLnRocm93RXJyb3IoUEFDS0FHRSArICcgaW5zZXJ0KGFyZ3MpICcsIGVycm9yLCB7aXRlbXN9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIERJLnRocm93RXJyb3IoJ2dldFN0b3JhZ2VUaW5nb2RiUGFja2FnZShDT05GSUcsIERJKScsIGVycm9yKVxuICB9XG59XG4iXX0=