'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var PACKAGE = 'storage';
module.exports = function getStoragePackage(CONFIG, DI) {
  var _this = this;

  try {
    var getStorageAction;

    var _ret = function () {
      var getValuePromise = require('./jesus').getValuePromise;
      var checkRequired = require('./jesus').checkRequired;
      CONFIG = checkRequired(CONFIG, ['storageType', 'storageConfig', 'storageCollection'], PACKAGE);
      DI = checkRequired(DI, ["throwError"], PACKAGE);

      getStorageAction = function _callee(action, args) {
        var type, storage, results;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return regeneratorRuntime.awrap(getValuePromise(CONFIG.storageType));

              case 3:
                type = _context.sent;
                _context.next = 6;
                return regeneratorRuntime.awrap(require('./storage.' + type)(CONFIG, DI));

              case 6:
                storage = _context.sent;
                _context.next = 9;
                return regeneratorRuntime.awrap(storage[action](args));

              case 9:
                results = _context.sent;
                return _context.abrupt('return', results);

              case 13:
                _context.prev = 13;
                _context.t0 = _context['catch'](0);

                DI.throwError(PACKAGE + ' getStorageAction ', _context.t0, args);

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, null, _this, [[0, 13]]);
      };

      return {
        v: {
          insert: function insert(args) {
            return regeneratorRuntime.async(function insert$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    return _context2.abrupt('return', getStorageAction('insert', args));

                  case 1:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, _this);
          },
          find: function find(args) {
            return regeneratorRuntime.async(function find$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    return _context3.abrupt('return', getStorageAction('find', args));

                  case 1:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, null, _this);
          },
          get: function get(args) {
            return regeneratorRuntime.async(function get$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    return _context4.abrupt('return', getStorageAction('get', args));

                  case 1:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, null, _this);
          },
          update: function update(args) {
            return regeneratorRuntime.async(function update$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    return _context5.abrupt('return', getStorageAction('update', args));

                  case 1:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, null, _this);
          }
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    DI.throwError(PACKAGE + ' getStoragePackage ', error);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuZXM2Il0sIm5hbWVzIjpbIlBBQ0tBR0UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0U3RvcmFnZVBhY2thZ2UiLCJDT05GSUciLCJESSIsImdldFN0b3JhZ2VBY3Rpb24iLCJnZXRWYWx1ZVByb21pc2UiLCJyZXF1aXJlIiwiY2hlY2tSZXF1aXJlZCIsImFjdGlvbiIsImFyZ3MiLCJzdG9yYWdlVHlwZSIsInR5cGUiLCJzdG9yYWdlIiwicmVzdWx0cyIsInRocm93RXJyb3IiLCJpbnNlcnQiLCJmaW5kIiwiZ2V0IiwidXBkYXRlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxJQUFNQSxVQUFVLFNBQWhCO0FBQ0FDLE9BQU9DLE9BQVAsR0FBaUIsU0FBU0MsaUJBQVQsQ0FBNEJDLE1BQTVCLEVBQW9DQyxFQUFwQyxFQUF3QztBQUFBOztBQUN2RCxNQUFJO0FBQUEsUUFNRUMsZ0JBTkY7O0FBQUE7QUFDRixVQUFNQyxrQkFBa0JDLFFBQVEsU0FBUixFQUFtQkQsZUFBM0M7QUFDQSxVQUFNRSxnQkFBZ0JELFFBQVEsU0FBUixFQUFtQkMsYUFBekM7QUFDQUwsZUFBU0ssY0FBY0wsTUFBZCxFQUFzQixDQUFDLGFBQUQsRUFBZ0IsZUFBaEIsRUFBaUMsbUJBQWpDLENBQXRCLEVBQTZFSixPQUE3RSxDQUFUO0FBQ0FLLFdBQUtJLGNBQWNKLEVBQWQsRUFBa0IsQ0FBQyxZQUFELENBQWxCLEVBQWtDTCxPQUFsQyxDQUFMOztBQUVJTSx5QkFBbUIsaUJBQU9JLE1BQVAsRUFBZUMsSUFBZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0RBRUZKLGdCQUFnQkgsT0FBT1EsV0FBdkIsQ0FGRTs7QUFBQTtBQUVmQyxvQkFGZTtBQUFBO0FBQUEsZ0RBR0NMLFFBQVEsZUFBZUssSUFBdkIsRUFBNkJULE1BQTdCLEVBQXFDQyxFQUFyQyxDQUhEOztBQUFBO0FBR2ZTLHVCQUhlO0FBQUE7QUFBQSxnREFJQ0EsUUFBUUosTUFBUixFQUFnQkMsSUFBaEIsQ0FKRDs7QUFBQTtBQUlmSSx1QkFKZTtBQUFBLGlEQUtaQSxPQUxZOztBQUFBO0FBQUE7QUFBQTs7QUFPbkJWLG1CQUFHVyxVQUFILENBQWNoQixVQUFVLG9CQUF4QixlQUFxRFcsSUFBckQ7O0FBUG1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BTnJCOztBQWdCRjtBQUFBLFdBQU87QUFDTE0sa0JBQVEsZ0JBQU1OLElBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNEQUFlTCxpQkFBaUIsUUFBakIsRUFBMkJLLElBQTNCLENBQWY7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FESDtBQUVMTyxnQkFBTSxjQUFNUCxJQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzREFBZUwsaUJBQWlCLE1BQWpCLEVBQXlCSyxJQUF6QixDQUFmOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBRkQ7QUFHTFEsZUFBSyxhQUFNUixJQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzREFBZUwsaUJBQWlCLEtBQWpCLEVBQXdCSyxJQUF4QixDQUFmOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBSEE7QUFJTFMsa0JBQVEsZ0JBQU1ULElBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNEQUFlTCxpQkFBaUIsUUFBakIsRUFBMkJLLElBQTNCLENBQWY7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFKSDtBQUFQO0FBaEJFOztBQUFBO0FBc0JILEdBdEJELENBc0JFLE9BQU9VLEtBQVAsRUFBYztBQUNkaEIsT0FBR1csVUFBSCxDQUFjaEIsVUFBVSxxQkFBeEIsRUFBK0NxQixLQUEvQztBQUNEO0FBQ0YsQ0ExQkQiLCJmaWxlIjoic3RvcmFnZS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmNvbnN0IFBBQ0tBR0UgPSAnc3RvcmFnZSdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U3RvcmFnZVBhY2thZ2UgKENPTkZJRywgREkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG4gICAgY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG4gICAgQ09ORklHID0gY2hlY2tSZXF1aXJlZChDT05GSUcsIFsnc3RvcmFnZVR5cGUnLCAnc3RvcmFnZUNvbmZpZycsICdzdG9yYWdlQ29sbGVjdGlvbiddLCBQQUNLQUdFKVxuICAgIERJID0gY2hlY2tSZXF1aXJlZChESSwgW1widGhyb3dFcnJvclwiXSwgUEFDS0FHRSlcblxuICAgIHZhciBnZXRTdG9yYWdlQWN0aW9uID0gYXN5bmMgKGFjdGlvbiwgYXJncykgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHR5cGUgPSBhd2FpdCBnZXRWYWx1ZVByb21pc2UoQ09ORklHLnN0b3JhZ2VUeXBlKVxuICAgICAgICB2YXIgc3RvcmFnZSA9IGF3YWl0IHJlcXVpcmUoJy4vc3RvcmFnZS4nICsgdHlwZSkoQ09ORklHLCBESSlcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBhd2FpdCBzdG9yYWdlW2FjdGlvbl0oYXJncylcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIERJLnRocm93RXJyb3IoUEFDS0FHRSArICcgZ2V0U3RvcmFnZUFjdGlvbiAnLCBlcnJvciwgYXJncylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGluc2VydDogYXN5bmMoYXJncykgPT4gZ2V0U3RvcmFnZUFjdGlvbignaW5zZXJ0JywgYXJncyksXG4gICAgICBmaW5kOiBhc3luYyhhcmdzKSA9PiBnZXRTdG9yYWdlQWN0aW9uKCdmaW5kJywgYXJncyksXG4gICAgICBnZXQ6IGFzeW5jKGFyZ3MpID0+IGdldFN0b3JhZ2VBY3Rpb24oJ2dldCcsIGFyZ3MpLFxuICAgICAgdXBkYXRlOiBhc3luYyhhcmdzKSA9PiBnZXRTdG9yYWdlQWN0aW9uKCd1cGRhdGUnLCBhcmdzKVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBESS50aHJvd0Vycm9yKFBBQ0tBR0UgKyAnIGdldFN0b3JhZ2VQYWNrYWdlICcsIGVycm9yKVxuICB9XG59XG4iXX0=