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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JhZ2UuZXM2Il0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRTdG9yYWdlUGFja2FnZSIsIkNPTkZJRyIsIkRJIiwiZ2V0U3RvcmFnZUFjdGlvbiIsIlBBQ0tBR0UiLCJnZXRWYWx1ZVByb21pc2UiLCJyZXF1aXJlIiwiY2hlY2tSZXF1aXJlZCIsImFjdGlvbiIsImFyZ3MiLCJzdG9yYWdlVHlwZSIsInR5cGUiLCJzdG9yYWdlIiwicmVzdWx0cyIsInRocm93RXJyb3IiLCJpbnNlcnQiLCJmaW5kIiwiZ2V0IiwidXBkYXRlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFDQUEsT0FBT0MsT0FBUCxHQUFpQixTQUFTQyxpQkFBVCxDQUE0QkMsTUFBNUIsRUFBb0NDLEVBQXBDLEVBQXdDO0FBQUE7O0FBQ3ZELE1BQUk7QUFBQSxRQU9FQyxnQkFQRjs7QUFBQTtBQUNGLFVBQU1DLFVBQVUsU0FBaEI7QUFDQSxVQUFNQyxrQkFBa0JDLFFBQVEsU0FBUixFQUFtQkQsZUFBM0M7QUFDQSxVQUFNRSxnQkFBZ0JELFFBQVEsU0FBUixFQUFtQkMsYUFBekM7QUFDQU4sZUFBU00sY0FBY04sTUFBZCxFQUFzQixDQUFDLGFBQUQsRUFBZ0IsZUFBaEIsRUFBaUMsbUJBQWpDLENBQXRCLEVBQTZFRyxPQUE3RSxDQUFUO0FBQ0FGLFdBQUtLLGNBQWNMLEVBQWQsRUFBa0IsRUFBbEIsRUFBc0JFLE9BQXRCLENBQUw7O0FBRUlELHlCQUFtQixpQkFBT0ssTUFBUCxFQUFlQyxJQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxnREFFRkosZ0JBQWdCSixPQUFPUyxXQUF2QixDQUZFOztBQUFBO0FBRWZDLG9CQUZlO0FBQUE7QUFBQSxnREFHQ0wsUUFBUSxlQUFlSyxJQUF2QixFQUE2QlYsTUFBN0IsRUFBcUNDLEVBQXJDLENBSEQ7O0FBQUE7QUFHZlUsdUJBSGU7QUFBQTtBQUFBLGdEQUlDQSxRQUFRSixNQUFSLEVBQWdCQyxJQUFoQixDQUpEOztBQUFBO0FBSWZJLHVCQUplO0FBQUEsaURBS1pBLE9BTFk7O0FBQUE7QUFBQTtBQUFBOztBQU9uQlgsbUJBQUdZLFVBQUgsQ0FBY1YsVUFBVSxvQkFBeEIsZUFBcURLLElBQXJEOztBQVBtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQVByQjs7QUFpQkY7QUFBQSxXQUFPO0FBQ0xNLGtCQUFRLGdCQUFNTixJQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzREFBZU4saUJBQWlCLFFBQWpCLEVBQTJCTSxJQUEzQixDQUFmOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBREg7QUFFTE8sZ0JBQU0sY0FBTVAsSUFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0RBQWVOLGlCQUFpQixNQUFqQixFQUF5Qk0sSUFBekIsQ0FBZjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUZEO0FBR0xRLGVBQUssYUFBTVIsSUFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0RBQWVOLGlCQUFpQixLQUFqQixFQUF3Qk0sSUFBeEIsQ0FBZjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUhBO0FBSUxTLGtCQUFRLGdCQUFNVCxJQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzREFBZU4saUJBQWlCLFFBQWpCLEVBQTJCTSxJQUEzQixDQUFmOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSkg7QUFBUDtBQWpCRTs7QUFBQTtBQXVCSCxHQXZCRCxDQXVCRSxPQUFPVSxLQUFQLEVBQWM7QUFDZGpCLE9BQUdZLFVBQUgsQ0FBY1YsVUFBVSxxQkFBeEIsRUFBK0NlLEtBQS9DO0FBQ0Q7QUFDRixDQTNCRCIsImZpbGUiOiJzdG9yYWdlLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRTdG9yYWdlUGFja2FnZSAoQ09ORklHLCBESSkge1xuICB0cnkge1xuICAgIGNvbnN0IFBBQ0tBR0UgPSAnc3RvcmFnZSdcbiAgICBjb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG4gICAgY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG4gICAgQ09ORklHID0gY2hlY2tSZXF1aXJlZChDT05GSUcsIFsnc3RvcmFnZVR5cGUnLCAnc3RvcmFnZUNvbmZpZycsICdzdG9yYWdlQ29sbGVjdGlvbiddLCBQQUNLQUdFKVxuICAgIERJID0gY2hlY2tSZXF1aXJlZChESSwgW10sIFBBQ0tBR0UpXG5cbiAgICB2YXIgZ2V0U3RvcmFnZUFjdGlvbiA9IGFzeW5jIChhY3Rpb24sIGFyZ3MpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciB0eXBlID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5zdG9yYWdlVHlwZSlcbiAgICAgICAgdmFyIHN0b3JhZ2UgPSBhd2FpdCByZXF1aXJlKCcuL3N0b3JhZ2UuJyArIHR5cGUpKENPTkZJRywgREkpXG4gICAgICAgIHZhciByZXN1bHRzID0gYXdhaXQgc3RvcmFnZVthY3Rpb25dKGFyZ3MpXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBESS50aHJvd0Vycm9yKFBBQ0tBR0UgKyAnIGdldFN0b3JhZ2VBY3Rpb24gJywgZXJyb3IsIGFyZ3MpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBpbnNlcnQ6IGFzeW5jKGFyZ3MpID0+IGdldFN0b3JhZ2VBY3Rpb24oJ2luc2VydCcsIGFyZ3MpLFxuICAgICAgZmluZDogYXN5bmMoYXJncykgPT4gZ2V0U3RvcmFnZUFjdGlvbignZmluZCcsIGFyZ3MpLFxuICAgICAgZ2V0OiBhc3luYyhhcmdzKSA9PiBnZXRTdG9yYWdlQWN0aW9uKCdnZXQnLCBhcmdzKSxcbiAgICAgIHVwZGF0ZTogYXN5bmMoYXJncykgPT4gZ2V0U3RvcmFnZUFjdGlvbigndXBkYXRlJywgYXJncylcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcihQQUNLQUdFICsgJyBnZXRTdG9yYWdlUGFja2FnZSAnLCBlcnJvcilcbiAgfVxufVxuIl19