'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function getStoragePackage(CONFIG, DI) {
  var _this = this;

  try {
    var getStorageAction;

    var _ret = function () {
      var PACKAGE = 'storage';
      var getValuePromise = require('./jesus').getValuePromise;
      var checkRequired = require('./jesus').checkRequired;
      CONFIG = checkRequired(CONFIG, ['storageType', 'storageConfig', 'storageCollection'], PACKAGE);
      DI = checkRequired(DI, [], PACKAGE);

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

                console.log(storage);
                _context.next = 10;
                return regeneratorRuntime.awrap(storage[action](args));

              case 10:
                results = _context.sent;
                return _context.abrupt('return', results);

              case 14:
                _context.prev = 14;
                _context.t0 = _context['catch'](0);

                DI.throwError(PACKAGE + ' getStorageAction ', _context.t0, args);

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, null, _this, [[0, 14]]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuZXM2Il0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRTdG9yYWdlUGFja2FnZSIsIkNPTkZJRyIsIkRJIiwiZ2V0U3RvcmFnZUFjdGlvbiIsIlBBQ0tBR0UiLCJnZXRWYWx1ZVByb21pc2UiLCJyZXF1aXJlIiwiY2hlY2tSZXF1aXJlZCIsImFjdGlvbiIsImFyZ3MiLCJzdG9yYWdlVHlwZSIsInR5cGUiLCJzdG9yYWdlIiwiY29uc29sZSIsImxvZyIsInJlc3VsdHMiLCJ0aHJvd0Vycm9yIiwiaW5zZXJ0IiwiZmluZCIsImdldCIsInVwZGF0ZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQ0FBLE9BQU9DLE9BQVAsR0FBaUIsU0FBU0MsaUJBQVQsQ0FBNEJDLE1BQTVCLEVBQW9DQyxFQUFwQyxFQUF3QztBQUFBOztBQUN2RCxNQUFJO0FBQUEsUUFPRUMsZ0JBUEY7O0FBQUE7QUFDRixVQUFNQyxVQUFVLFNBQWhCO0FBQ0EsVUFBTUMsa0JBQWtCQyxRQUFRLFNBQVIsRUFBbUJELGVBQTNDO0FBQ0EsVUFBTUUsZ0JBQWdCRCxRQUFRLFNBQVIsRUFBbUJDLGFBQXpDO0FBQ0FOLGVBQVNNLGNBQWNOLE1BQWQsRUFBc0IsQ0FBQyxhQUFELEVBQWdCLGVBQWhCLEVBQWlDLG1CQUFqQyxDQUF0QixFQUE2RUcsT0FBN0UsQ0FBVDtBQUNBRixXQUFLSyxjQUFjTCxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCRSxPQUF0QixDQUFMOztBQUVJRCx5QkFBbUIsaUJBQU9LLE1BQVAsRUFBZUMsSUFBZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0RBRUZKLGdCQUFnQkosT0FBT1MsV0FBdkIsQ0FGRTs7QUFBQTtBQUVmQyxvQkFGZTtBQUFBO0FBQUEsZ0RBR0NMLFFBQVEsZUFBZUssSUFBdkIsRUFBNkJWLE1BQTdCLEVBQXFDQyxFQUFyQyxDQUhEOztBQUFBO0FBR2ZVLHVCQUhlOztBQUluQkMsd0JBQVFDLEdBQVIsQ0FBWUYsT0FBWjtBQUptQjtBQUFBLGdEQUtDQSxRQUFRSixNQUFSLEVBQWdCQyxJQUFoQixDQUxEOztBQUFBO0FBS2ZNLHVCQUxlO0FBQUEsaURBTVpBLE9BTlk7O0FBQUE7QUFBQTtBQUFBOztBQVFuQmIsbUJBQUdjLFVBQUgsQ0FBY1osVUFBVSxvQkFBeEIsZUFBcURLLElBQXJEOztBQVJtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQVByQjs7QUFrQkY7QUFBQSxXQUFPO0FBQ0xRLGtCQUFRLGdCQUFNUixJQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzREFBZU4saUJBQWlCLFFBQWpCLEVBQTJCTSxJQUEzQixDQUFmOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBREg7QUFFTFMsZ0JBQU0sY0FBTVQsSUFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0RBQWVOLGlCQUFpQixNQUFqQixFQUF5Qk0sSUFBekIsQ0FBZjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUZEO0FBR0xVLGVBQUssYUFBTVYsSUFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0RBQWVOLGlCQUFpQixLQUFqQixFQUF3Qk0sSUFBeEIsQ0FBZjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUhBO0FBSUxXLGtCQUFRLGdCQUFNWCxJQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzREFBZU4saUJBQWlCLFFBQWpCLEVBQTJCTSxJQUEzQixDQUFmOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSkg7QUFBUDtBQWxCRTs7QUFBQTtBQXdCSCxHQXhCRCxDQXdCRSxPQUFPWSxLQUFQLEVBQWM7QUFDZG5CLE9BQUdjLFVBQUgsQ0FBY1osVUFBVSxxQkFBeEIsRUFBK0NpQixLQUEvQztBQUNEO0FBQ0YsQ0E1QkQiLCJmaWxlIjoic3RvcmFnZS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U3RvcmFnZVBhY2thZ2UgKENPTkZJRywgREkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBQQUNLQUdFID0gJ3N0b3JhZ2UnXG4gICAgY29uc3QgZ2V0VmFsdWVQcm9taXNlID0gcmVxdWlyZSgnLi9qZXN1cycpLmdldFZhbHVlUHJvbWlzZVxuICAgIGNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuICAgIENPTkZJRyA9IGNoZWNrUmVxdWlyZWQoQ09ORklHLCBbJ3N0b3JhZ2VUeXBlJywgJ3N0b3JhZ2VDb25maWcnLCAnc3RvcmFnZUNvbGxlY3Rpb24nXSwgUEFDS0FHRSlcbiAgICBESSA9IGNoZWNrUmVxdWlyZWQoREksIFtdLCBQQUNLQUdFKVxuXG4gICAgdmFyIGdldFN0b3JhZ2VBY3Rpb24gPSBhc3luYyAoYWN0aW9uLCBhcmdzKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgdHlwZSA9IGF3YWl0IGdldFZhbHVlUHJvbWlzZShDT05GSUcuc3RvcmFnZVR5cGUpXG4gICAgICAgIHZhciBzdG9yYWdlID0gYXdhaXQgcmVxdWlyZSgnLi9zdG9yYWdlLicgKyB0eXBlKShDT05GSUcsIERJKVxuICAgICAgICBjb25zb2xlLmxvZyhzdG9yYWdlKVxuICAgICAgICB2YXIgcmVzdWx0cyA9IGF3YWl0IHN0b3JhZ2VbYWN0aW9uXShhcmdzKVxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgREkudGhyb3dFcnJvcihQQUNLQUdFICsgJyBnZXRTdG9yYWdlQWN0aW9uICcsIGVycm9yLCBhcmdzKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgaW5zZXJ0OiBhc3luYyhhcmdzKSA9PiBnZXRTdG9yYWdlQWN0aW9uKCdpbnNlcnQnLCBhcmdzKSxcbiAgICAgIGZpbmQ6IGFzeW5jKGFyZ3MpID0+IGdldFN0b3JhZ2VBY3Rpb24oJ2ZpbmQnLCBhcmdzKSxcbiAgICAgIGdldDogYXN5bmMoYXJncykgPT4gZ2V0U3RvcmFnZUFjdGlvbignZ2V0JywgYXJncyksXG4gICAgICB1cGRhdGU6IGFzeW5jKGFyZ3MpID0+IGdldFN0b3JhZ2VBY3Rpb24oJ3VwZGF0ZScsIGFyZ3MpXG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIERJLnRocm93RXJyb3IoUEFDS0FHRSArICcgZ2V0U3RvcmFnZVBhY2thZ2UgJywgZXJyb3IpXG4gIH1cbn1cbiJdfQ==