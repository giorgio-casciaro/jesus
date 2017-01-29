'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _DI;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

if (!global._babelPolyfill) {
  require('babel-polyfill');
}
var throwError = require('./error').throwError;
var t = require('tap');
var R = require('ramda');
var path = require('path');
var PACKAGE = 'jesus.test';
process.on('unhandledRejection', function (reason, promise) {
  console.log('unhandledRejection Reason: ', promise, reason);
  console.trace(promise);
});

var DEBUG = function DEBUG(type, debug) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'unknow';
  var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'unknow';

  var ANSI_RESET = '\x1B[0m';
  var ANSI_BLACK = '\x1B[30m';
  var ANSI_RED = '\x1B[31m';
  var ANSI_GREEN = '\x1B[32m';
  var ANSI_YELLOW = '\x1B[33m';
  var ANSI_BLUE = '\x1B[34m';
  var ANSI_PURPLE = '\x1B[35m';
  var ANSI_CYAN = '\x1B[36m';
  var ANSI_WHITE = '\x1B[37m';
  if (type === 'ERROR') {
    console.log('' + ANSI_RED);
  }
  if (type === 'WARNING') {
    console.log('' + ANSI_YELLOW);
  }
  if (type === 'LOG') {
    console.log('' + ANSI_GREEN);
  }
  if (type === 'DEBUG') {
    console.log('' + ANSI_CYAN);
  }
  console.log(type + ' ' + context + ' > ' + msg + ' ' + ANSI_RESET);
  console.log(debug);
  // console.log(JSON.stringify(arguments).substring(0, 250))
};
var LOG = function LOG(type, log) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'unknow';
  var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'unknow';

  var ANSI_RESET = '\x1B[0m';
  var ANSI_BLACK = '\x1B[30m';
  var ANSI_BACKGROUND_CYAN = '\x1B[46m';
  console.log('' + (ANSI_BACKGROUND_CYAN + ANSI_BLACK));
  console.log('LOG --> ' + type + ' ' + context + ' > ' + msg + ' ' + ANSI_RESET);
  DEBUG(type, log, msg, context);
};

var SERVICE;
var SERVICE_NAME = 'testService';
var fakeAuth = {
  userId: '195151662661'
};

var DI = (_DI = {
  throwError: throwError,
  authenticate: function authenticate(_ref) {
    var request = _ref.request;
    return regeneratorRuntime.async(function authenticate$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', fakeAuth);

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, null, undefined);
  },
  authorize: function authorize(_ref2) {
    var route = _ref2.route,
        request = _ref2.request;
    return regeneratorRuntime.async(function authorize$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', true);

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, undefined);
  },
  // getEvents: (payload) => new Promise((resolve, reject) => {
  //   resolve(SERVICE.events)
  // }),
  // getConfig: (payload) => new Promise((resolve, reject) => {
  //   resolve(config)
  // }),
  registerRoute: function registerRoute(_ref3) {
    var route = _ref3.route,
        routeFunction = _ref3.routeFunction;
    return regeneratorRuntime.async(function registerRoute$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', SERVICE.routes[route] = routeFunction);

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, null, undefined);
  },
  callRoute: function callRoute(_ref4) {
    var route = _ref4.route,
        request = _ref4.request;
    return regeneratorRuntime.async(function callRoute$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', SERVICE.routes[route](request));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, undefined);
  },
  deregisterRoute: function deregisterRoute(_ref5) {
    var route = _ref5.route;
    return regeneratorRuntime.async(function deregisterRoute$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt('return', SERVICE.routes[route](request));

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, undefined);
  }
}, _defineProperty(_DI, 'deregisterRoute', function deregisterRoute(_ref6) {
  var route = _ref6.route;
  return regeneratorRuntime.async(function deregisterRoute$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt('return', delete SERVICE.routes[route]);

        case 1:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, undefined);
}), _defineProperty(_DI, 'registerEvent', function registerEvent(_ref7) {
  var name = _ref7.name,
      route = _ref7.route;
  return regeneratorRuntime.async(function registerEvent$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          SERVICE.events[name] = {
            name: name,
            route: route,
            service: SERVICE_NAME
          };

        case 1:
        case 'end':
          return _context7.stop();
      }
    }
  }, null, undefined);
}), _defineProperty(_DI, 'deregisterEvent', function deregisterEvent(_ref8) {
  var name = _ref8.name;
  return regeneratorRuntime.async(function deregisterEvent$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          return _context8.abrupt('return', delete SERVICE.events[event]);

        case 1:
        case 'end':
          return _context8.stop();
      }
    }
  }, null, undefined);
}), _defineProperty(_DI, 'emitEvent', function emitEvent(_ref9) {
  var name = _ref9.name,
      payload = _ref9.payload;
  return regeneratorRuntime.async(function emitEvent$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
        case 'end':
          return _context9.stop();
      }
    }
  }, null, undefined);
}), _defineProperty(_DI, 'log', function log(_ref10) {
  var context = _ref10.context,
      msg = _ref10.msg,
      _log = _ref10.log,
      type = _ref10.type;
  return regeneratorRuntime.async(function log$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          return _context10.abrupt('return', LOG(type, _log, msg, context));

        case 1:
        case 'end':
          return _context10.stop();
      }
    }
  }, null, undefined);
}), _defineProperty(_DI, 'debug', function debug(_ref11) {
  var context = _ref11.context,
      msg = _ref11.msg,
      _debug = _ref11.debug;
  return regeneratorRuntime.async(function debug$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          return _context11.abrupt('return', DEBUG('DEBUG', _debug, msg, context));

        case 1:
        case 'end':
          return _context11.stop();
      }
    }
  }, null, undefined);
}), _defineProperty(_DI, 'error', function error(_ref12) {
  var _error = _ref12.error;
  var ANSI_RESET, ANSI_RED;
  return regeneratorRuntime.async(function error$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          ANSI_RESET = '\x1B[0m';
          ANSI_RED = '\x1B[31m';

          console.log(ANSI_RED + ' ORIGINAL ERROR ' + ANSI_RESET);
          console.log(_error.originalError || _error);
          console.log('APP ERROR --> ' + (_error.info && _error.info.message ? _error.info.message : 'unknow'));
          console.log(ANSI_RED + ' APP TRACE ' + ANSI_RESET);
          if (_error.getAppTrace) console.log(JSON.stringify(_error.getAppTrace(), null, 4));
          // if (error.toString)console.log(JSON.stringify(error.toString(), null, 4))
          LOG('ERROR', _error, 'jesus-test', 'APP-ERROR');

        case 8:
        case 'end':
          return _context12.stop();
      }
    }
  }, null, undefined);
}), _DI);
function setPackageArgsOverwrite() {
  var overwriteArgs = Array.prototype.slice.call(arguments, 1);
  var originalPackage = arguments[0];
  var modifiedPackage = {};
  for (var i in originalPackage) {
    modifiedPackage[i] = function packageArgsOverwrite() {
      var modifiedArguments = Object.assign(arguments, overwriteArgs);
      return originalPackage[i].apply(this, modifiedArguments);
    };
  }
  return modifiedPackage;
}
t.test('*** JESUS SERVICE CRUD ***', {
  autoend: true
}, function mainTest(t) {
  return regeneratorRuntime.async(function mainTest$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          t.plan(1);
          _context16.next = 3;
          return regeneratorRuntime.awrap(t.test('*** JESUS SERVICE CRUD 1 ***', function _callee3(t) {
            var createEntityTest, storagePackage, entityTestConfig, entityTestDI, createEntityTestRequest, response;
            return regeneratorRuntime.async(function _callee3$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    _context15.prev = 0;

                    createEntityTest = function _callee2(request) {
                      var _this = this;

                      var items, authorizationsData, itemsIds, itemsMutation, _ret;

                      return regeneratorRuntime.async(function _callee2$(_context14) {
                        while (1) {
                          switch (_context14.prev = _context14.next) {
                            case 0:
                              _context14.prev = 0;
                              _context14.next = 3;
                              return regeneratorRuntime.awrap(function _callee() {
                                var uuidV4;
                                return regeneratorRuntime.async(function _callee$(_context13) {
                                  while (1) {
                                    switch (_context13.prev = _context13.next) {
                                      case 0:
                                        uuidV4 = require('uuid/v4');
                                        items = request.items;

                                        if (!(!items || !items.length)) {
                                          _context13.next = 4;
                                          break;
                                        }

                                        throw new Error('createEntityTest require items');

                                      case 4:
                                        items.forEach(function (item) {
                                          if (!item._id) item._id = uuidV4();
                                        }); // ID AUTOGENERATED IF NOT INCLUDED
                                        _context13.next = 7;
                                        return regeneratorRuntime.awrap(entityTestDI.validate({ items: items }));

                                      case 7:
                                        _context13.next = 9;
                                        return regeneratorRuntime.awrap(DI.authenticate({ request: request }));

                                      case 9:
                                        authorizationsData = _context13.sent;
                                        _context13.next = 12;
                                        return regeneratorRuntime.awrap(DI.authorize({ context: authorizationsData, action: 'write', entity: 'entityTest', items: items }));

                                      case 12:
                                        itemsIds = R.map(R.prop('_id'), items);
                                        _context13.next = 15;
                                        return regeneratorRuntime.awrap(entityTestDI.mutationsPackage.mutate({ mutation: 'create', itemsIds: itemsIds, items: items }));

                                      case 15:
                                        itemsMutation = _context13.sent;
                                        _context13.next = 18;
                                        return regeneratorRuntime.awrap(entityTestDI.viewsPackage.refreshItemsViews({ itemsIds: itemsIds, loadSnapshot: false, itemsMutations: [itemsMutation] }));

                                      case 18:
                                        return _context13.abrupt('return', {
                                          v: { itemsIds: itemsIds }
                                        });

                                      case 19:
                                      case 'end':
                                        return _context13.stop();
                                    }
                                  }
                                }, null, _this);
                              }());

                            case 3:
                              _ret = _context14.sent;

                              if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
                                _context14.next = 6;
                                break;
                              }

                              return _context14.abrupt('return', _ret.v);

                            case 6:
                              _context14.next = 11;
                              break;

                            case 8:
                              _context14.prev = 8;
                              _context14.t0 = _context14['catch'](0);

                              DI.throwError('createEntityTest', _context14.t0, request);

                            case 11:
                            case 'end':
                              return _context14.stop();
                          }
                        }
                      }, null, this, [[0, 8]]);
                    };

                    SERVICE = {
                      routes: {},
                      config: {
                        mainStorage: {
                          type: 'inmemory',
                          config: {
                            path: path.join(__dirname, 'testMaterial/fileDb')
                          }
                        }
                      },
                      events: {}
                    };
                    // SHARED FUNCTIONS
                    // var optionsStorage = jesus.getStoragePackage(CONFIG.optionsStorage, CONFIG.items.entityTest.optionsStorageCollection)

                    storagePackage = require('./storage');
                    entityTestConfig = {
                      storageType: function storageType() {
                        return SERVICE.config.mainStorage.type;
                      },
                      storageConfig: function storageConfig() {
                        return SERVICE.config.mainStorage.config;
                      },
                      mutationsPath: function mutationsPath() {
                        return path.join(__dirname, 'testMaterial/entityTest/mutations');
                      },
                      mutationsCollection: function mutationsCollection() {
                        return path.join(__dirname, 'testMaterial/entityTest/mutations');
                      },
                      viewsSnapshotsMaxMutations: function viewsSnapshotsMaxMutations() {
                        return 10;
                      },
                      validationSchema: function validationSchema() {
                        try {
                          return require('./testMaterial/entityTest/entity.schema.json');
                        } catch (error) {
                          DI.throwError('entityTestConfig validationSchema() ', error);
                        }
                      },
                      validationType: function validationType() {
                        return 'jsonSchema';
                      }
                    };
                    entityTestDI = R.merge({
                      mutationsStoragePackage: storagePackage(R.merge(entityTestConfig, {
                        storageCollection: function storageCollection() {
                          return 'entityTestMutations';
                        }
                      }), DI),
                      viewsStoragePackage: storagePackage(R.merge(entityTestConfig, {
                        storageCollection: function storageCollection() {
                          return 'entityTestViewsMain';
                        }
                      }), DI),
                      throwError: DI.throwError,
                      viewsSnapshotsStoragePackage: storagePackage(R.merge(entityTestConfig, {
                        storageCollection: function storageCollection() {
                          return 'entityTestViewsMainSnapshots';
                        }
                      }), DI)
                    }, DI);
                    _context15.next = 8;
                    return regeneratorRuntime.awrap(require('./mutations.cqrs')(entityTestConfig, entityTestDI));

                  case 8:
                    entityTestDI.mutationsPackage = _context15.sent;
                    _context15.next = 11;
                    return regeneratorRuntime.awrap(require('./views.cqrs')(entityTestConfig, entityTestDI));

                  case 11:
                    entityTestDI.viewsPackage = _context15.sent;
                    _context15.next = 14;
                    return regeneratorRuntime.awrap(require('./validate')(entityTestConfig, entityTestDI));

                  case 14:
                    entityTestDI.validate = _context15.sent;

                    DI.registerRoute({ route: 'createEntityTest', routeFunction: createEntityTest });
                    DI.registerEvent({ event: 'createEntityTest', route: 'createEntityTest' });
                    createEntityTestRequest = {
                      items: [{ name: 'test' }]
                    };
                    _context15.prev = 18;
                    _context15.next = 21;
                    return regeneratorRuntime.awrap(DI.callRoute({ route: 'createEntityTest', request: createEntityTestRequest }));

                  case 21:
                    response = _context15.sent;

                    t.type(response, 'object');
                    t.type(response.itemsIds, 'Array');
                    t.type(response.itemsIds.length, 1);
                    _context15.next = 30;
                    break;

                  case 27:
                    _context15.prev = 27;
                    _context15.t0 = _context15['catch'](18);

                    DI.throwError('DI.callRoute createEntityTest', _context15.t0, { route: 'createEntityTest', request: createEntityTestRequest });

                  case 30:

                    // var entityTestDI = {
                    //   validate: entityTestValidate,
                    //   mutationsPackage: entityTestMutationsPackage,
                    //   viewsPackage: entityTestMainViewPackage
                    // }
                    //
                    // var entityTest_crud = require('./service.crud')
                    // entityTest_crud(R.merge(entityTestDI, DI), {})
                    LOG('RESOLVE TEST 1', { SERVICE: SERVICE });
                    t.end();
                    _context15.next = 39;
                    break;

                  case 34:
                    _context15.prev = 34;
                    _context15.t1 = _context15['catch'](0);

                    // throw error
                    DI.error({ error: _context15.t1 });
                    LOG('REJECT TEST 1');
                    // t.fail('FAIL deleteentityTest')
                    t.end('FAIL deleteentityTest');

                  case 39:
                  case 'end':
                    return _context15.stop();
                }
              }
            }, null, this, [[0, 34], [18, 27]]);
          }));

        case 3:
        case 'end':
          return _context16.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImplc3VzLnRlc3QuZXM2Il0sIm5hbWVzIjpbImdsb2JhbCIsIl9iYWJlbFBvbHlmaWxsIiwicmVxdWlyZSIsInRocm93RXJyb3IiLCJ0IiwiUiIsInBhdGgiLCJQQUNLQUdFIiwicHJvY2VzcyIsIm9uIiwicmVhc29uIiwicHJvbWlzZSIsImNvbnNvbGUiLCJsb2ciLCJ0cmFjZSIsIkRFQlVHIiwidHlwZSIsImRlYnVnIiwibXNnIiwiY29udGV4dCIsIkFOU0lfUkVTRVQiLCJBTlNJX0JMQUNLIiwiQU5TSV9SRUQiLCJBTlNJX0dSRUVOIiwiQU5TSV9ZRUxMT1ciLCJBTlNJX0JMVUUiLCJBTlNJX1BVUlBMRSIsIkFOU0lfQ1lBTiIsIkFOU0lfV0hJVEUiLCJMT0ciLCJBTlNJX0JBQ0tHUk9VTkRfQ1lBTiIsIlNFUlZJQ0UiLCJTRVJWSUNFX05BTUUiLCJmYWtlQXV0aCIsInVzZXJJZCIsIkRJIiwiYXV0aGVudGljYXRlIiwicmVxdWVzdCIsImF1dGhvcml6ZSIsInJvdXRlIiwicmVnaXN0ZXJSb3V0ZSIsInJvdXRlRnVuY3Rpb24iLCJyb3V0ZXMiLCJjYWxsUm91dGUiLCJkZXJlZ2lzdGVyUm91dGUiLCJuYW1lIiwiZXZlbnRzIiwic2VydmljZSIsImV2ZW50IiwicGF5bG9hZCIsImVycm9yIiwib3JpZ2luYWxFcnJvciIsImluZm8iLCJtZXNzYWdlIiwiZ2V0QXBwVHJhY2UiLCJKU09OIiwic3RyaW5naWZ5Iiwic2V0UGFja2FnZUFyZ3NPdmVyd3JpdGUiLCJvdmVyd3JpdGVBcmdzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJvcmlnaW5hbFBhY2thZ2UiLCJtb2RpZmllZFBhY2thZ2UiLCJpIiwicGFja2FnZUFyZ3NPdmVyd3JpdGUiLCJtb2RpZmllZEFyZ3VtZW50cyIsIk9iamVjdCIsImFzc2lnbiIsImFwcGx5IiwidGVzdCIsImF1dG9lbmQiLCJtYWluVGVzdCIsInBsYW4iLCJjcmVhdGVFbnRpdHlUZXN0IiwidXVpZFY0IiwiaXRlbXMiLCJsZW5ndGgiLCJFcnJvciIsImZvckVhY2giLCJpdGVtIiwiX2lkIiwiZW50aXR5VGVzdERJIiwidmFsaWRhdGUiLCJhdXRob3JpemF0aW9uc0RhdGEiLCJhY3Rpb24iLCJlbnRpdHkiLCJpdGVtc0lkcyIsIm1hcCIsInByb3AiLCJtdXRhdGlvbnNQYWNrYWdlIiwibXV0YXRlIiwibXV0YXRpb24iLCJpdGVtc011dGF0aW9uIiwidmlld3NQYWNrYWdlIiwicmVmcmVzaEl0ZW1zVmlld3MiLCJsb2FkU25hcHNob3QiLCJpdGVtc011dGF0aW9ucyIsImNvbmZpZyIsIm1haW5TdG9yYWdlIiwiam9pbiIsIl9fZGlybmFtZSIsInN0b3JhZ2VQYWNrYWdlIiwiZW50aXR5VGVzdENvbmZpZyIsInN0b3JhZ2VUeXBlIiwic3RvcmFnZUNvbmZpZyIsIm11dGF0aW9uc1BhdGgiLCJtdXRhdGlvbnNDb2xsZWN0aW9uIiwidmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnMiLCJ2YWxpZGF0aW9uU2NoZW1hIiwidmFsaWRhdGlvblR5cGUiLCJtZXJnZSIsIm11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlIiwic3RvcmFnZUNvbGxlY3Rpb24iLCJ2aWV3c1N0b3JhZ2VQYWNrYWdlIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSIsInJlZ2lzdGVyRXZlbnQiLCJjcmVhdGVFbnRpdHlUZXN0UmVxdWVzdCIsInJlc3BvbnNlIiwiZW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBLElBQUksQ0FBQ0EsT0FBT0MsY0FBWixFQUE0QjtBQUMxQkMsVUFBUSxnQkFBUjtBQUNEO0FBQ0QsSUFBTUMsYUFBYUQsUUFBUSxTQUFSLEVBQW1CQyxVQUF0QztBQUNBLElBQUlDLElBQUlGLFFBQVEsS0FBUixDQUFSO0FBQ0EsSUFBSUcsSUFBSUgsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJSSxPQUFPSixRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQU1LLFVBQVUsWUFBaEI7QUFDQUMsUUFBUUMsRUFBUixDQUFXLG9CQUFYLEVBQWlDLFVBQUNDLE1BQUQsRUFBU0MsT0FBVCxFQUFxQjtBQUNwREMsVUFBUUMsR0FBUixDQUFZLDZCQUFaLEVBQTJDRixPQUEzQyxFQUFvREQsTUFBcEQ7QUFDQUUsVUFBUUUsS0FBUixDQUFjSCxPQUFkO0FBQ0QsQ0FIRDs7QUFLQSxJQUFJSSxRQUFRLFNBQVJBLEtBQVEsQ0FBVUMsSUFBVixFQUFnQkMsS0FBaEIsRUFBMkQ7QUFBQSxNQUFwQ0MsR0FBb0MsdUVBQTlCLFFBQThCO0FBQUEsTUFBcEJDLE9BQW9CLHVFQUFWLFFBQVU7O0FBQ3JFLE1BQU1DLGFBQWEsU0FBbkI7QUFDQSxNQUFNQyxhQUFhLFVBQW5CO0FBQ0EsTUFBTUMsV0FBVyxVQUFqQjtBQUNBLE1BQU1DLGFBQWEsVUFBbkI7QUFDQSxNQUFNQyxjQUFjLFVBQXBCO0FBQ0EsTUFBTUMsWUFBWSxVQUFsQjtBQUNBLE1BQU1DLGNBQWMsVUFBcEI7QUFDQSxNQUFNQyxZQUFZLFVBQWxCO0FBQ0EsTUFBTUMsYUFBYSxVQUFuQjtBQUNBLE1BQUlaLFNBQVMsT0FBYixFQUFzQjtBQUNwQkosWUFBUUMsR0FBUixNQUFlUyxRQUFmO0FBQ0Q7QUFDRCxNQUFJTixTQUFTLFNBQWIsRUFBd0I7QUFDdEJKLFlBQVFDLEdBQVIsTUFBZVcsV0FBZjtBQUNEO0FBQ0QsTUFBSVIsU0FBUyxLQUFiLEVBQW9CO0FBQ2xCSixZQUFRQyxHQUFSLE1BQWVVLFVBQWY7QUFDRDtBQUNELE1BQUlQLFNBQVMsT0FBYixFQUFzQjtBQUNwQkosWUFBUUMsR0FBUixNQUFlYyxTQUFmO0FBQ0Q7QUFDRGYsVUFBUUMsR0FBUixDQUFlRyxJQUFmLFNBQXVCRyxPQUF2QixXQUFvQ0QsR0FBcEMsU0FBMkNFLFVBQTNDO0FBQ0FSLFVBQVFDLEdBQVIsQ0FBWUksS0FBWjtBQUNBO0FBQ0QsQ0F6QkQ7QUEwQkEsSUFBSVksTUFBTSxTQUFOQSxHQUFNLENBQVViLElBQVYsRUFBZ0JILEdBQWhCLEVBQXlEO0FBQUEsTUFBcENLLEdBQW9DLHVFQUE5QixRQUE4QjtBQUFBLE1BQXBCQyxPQUFvQix1RUFBVixRQUFVOztBQUNqRSxNQUFNQyxhQUFhLFNBQW5CO0FBQ0EsTUFBTUMsYUFBYSxVQUFuQjtBQUNBLE1BQU1TLHVCQUF1QixVQUE3QjtBQUNBbEIsVUFBUUMsR0FBUixPQUFlaUIsdUJBQXVCVCxVQUF0QztBQUNBVCxVQUFRQyxHQUFSLGNBQXVCRyxJQUF2QixTQUErQkcsT0FBL0IsV0FBNENELEdBQTVDLFNBQW1ERSxVQUFuRDtBQUNBTCxRQUFNQyxJQUFOLEVBQVlILEdBQVosRUFBaUJLLEdBQWpCLEVBQXNCQyxPQUF0QjtBQUNELENBUEQ7O0FBU0EsSUFBSVksT0FBSjtBQUNBLElBQUlDLGVBQWUsYUFBbkI7QUFDQSxJQUFJQyxXQUFXO0FBQ2JDLFVBQVE7QUFESyxDQUFmOztBQU1BLElBQUlDO0FBQ0ZoQyx3QkFERTtBQUVGaUMsZ0JBQWM7QUFBQSxRQUFPQyxPQUFQLFFBQU9BLE9BQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQUFvQkosUUFBcEI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FGWjtBQUdGSyxhQUFXO0FBQUEsUUFBT0MsS0FBUCxTQUFPQSxLQUFQO0FBQUEsUUFBY0YsT0FBZCxTQUFjQSxPQUFkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FBMkIsSUFBM0I7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FIVDtBQUlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBRyxpQkFBZTtBQUFBLFFBQU9ELEtBQVAsU0FBT0EsS0FBUDtBQUFBLFFBQWNFLGFBQWQsU0FBY0EsYUFBZDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOENBQWlDVixRQUFRVyxNQUFSLENBQWVILEtBQWYsSUFBd0JFLGFBQXpEOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBVmI7QUFXRkUsYUFBVztBQUFBLFFBQU9KLEtBQVAsU0FBT0EsS0FBUDtBQUFBLFFBQWNGLE9BQWQsU0FBY0EsT0FBZDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOENBQTJCTixRQUFRVyxNQUFSLENBQWVILEtBQWYsRUFBc0JGLE9BQXRCLENBQTNCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBWFQ7QUFZRk8sbUJBQWlCO0FBQUEsUUFBT0wsS0FBUCxTQUFPQSxLQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FBa0JSLFFBQVFXLE1BQVIsQ0FBZUgsS0FBZixFQUFzQkYsT0FBdEIsQ0FBbEI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFaZiwyQ0FhZTtBQUFBLE1BQU9FLEtBQVAsU0FBT0EsS0FBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsNENBQWtCLE9BQU9SLFFBQVFXLE1BQVIsQ0FBZUgsS0FBZixDQUF6Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQWJmLHlDQWNhO0FBQUEsTUFBT00sSUFBUCxTQUFPQSxJQUFQO0FBQUEsTUFBYU4sS0FBYixTQUFhQSxLQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDYlIsa0JBQVFlLE1BQVIsQ0FBZUQsSUFBZixJQUF1QjtBQUNyQkEsc0JBRHFCO0FBRXJCTix3QkFGcUI7QUFHckJRLHFCQUFTZjtBQUhZLFdBQXZCOztBQURhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBZGIsMkNBcUJlO0FBQUEsTUFBT2EsSUFBUCxTQUFPQSxJQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw0Q0FBaUIsT0FBT2QsUUFBUWUsTUFBUixDQUFlRSxLQUFmLENBQXhCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBckJmLHFDQXNCUztBQUFBLE1BQU9ILElBQVAsU0FBT0EsSUFBUDtBQUFBLE1BQWFJLE9BQWIsU0FBYUEsT0FBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBdEJULCtCQXlCRztBQUFBLE1BQU85QixPQUFQLFVBQU9BLE9BQVA7QUFBQSxNQUFnQkQsR0FBaEIsVUFBZ0JBLEdBQWhCO0FBQUEsTUFBcUJMLElBQXJCLFVBQXFCQSxHQUFyQjtBQUFBLE1BQTBCRyxJQUExQixVQUEwQkEsSUFBMUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQUFvQ2EsSUFBSWIsSUFBSixFQUFVSCxJQUFWLEVBQWVLLEdBQWYsRUFBb0JDLE9BQXBCLENBQXBDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBekJILGlDQTBCSztBQUFBLE1BQU9BLE9BQVAsVUFBT0EsT0FBUDtBQUFBLE1BQWdCRCxHQUFoQixVQUFnQkEsR0FBaEI7QUFBQSxNQUFxQkQsTUFBckIsVUFBcUJBLEtBQXJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw2Q0FBZ0NGLE1BQU0sT0FBTixFQUFlRSxNQUFmLEVBQXNCQyxHQUF0QixFQUEyQkMsT0FBM0IsQ0FBaEM7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0ExQkwsaUNBMkJLO0FBQUEsTUFBTytCLE1BQVAsVUFBT0EsS0FBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQzlCLG9CQURELEdBQ2MsU0FEZDtBQUVDRSxrQkFGRCxHQUVZLFVBRlo7O0FBR0xWLGtCQUFRQyxHQUFSLENBQWVTLFFBQWYsd0JBQTBDRixVQUExQztBQUNBUixrQkFBUUMsR0FBUixDQUFZcUMsT0FBTUMsYUFBTixJQUF1QkQsTUFBbkM7QUFDQXRDLGtCQUFRQyxHQUFSLHFCQUE2QnFDLE9BQU1FLElBQU4sSUFBY0YsT0FBTUUsSUFBTixDQUFXQyxPQUF6QixHQUFtQ0gsT0FBTUUsSUFBTixDQUFXQyxPQUE5QyxHQUF3RCxRQUFyRjtBQUNBekMsa0JBQVFDLEdBQVIsQ0FBZVMsUUFBZixtQkFBcUNGLFVBQXJDO0FBQ0EsY0FBSThCLE9BQU1JLFdBQVYsRUFBc0IxQyxRQUFRQyxHQUFSLENBQVkwQyxLQUFLQyxTQUFMLENBQWVOLE9BQU1JLFdBQU4sRUFBZixFQUFvQyxJQUFwQyxFQUEwQyxDQUExQyxDQUFaO0FBQ3RCO0FBQ0F6QixjQUFJLE9BQUosRUFBYXFCLE1BQWIsRUFBb0IsWUFBcEIsRUFBa0MsV0FBbEM7O0FBVEs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0EzQkwsT0FBSjtBQWlEQSxTQUFTTyx1QkFBVCxHQUFvQztBQUNsQyxNQUFJQyxnQkFBZ0JDLE1BQU1DLFNBQU4sQ0FBZ0JDLEtBQWhCLENBQXNCQyxJQUF0QixDQUEyQkMsU0FBM0IsRUFBc0MsQ0FBdEMsQ0FBcEI7QUFDQSxNQUFJQyxrQkFBa0JELFVBQVUsQ0FBVixDQUF0QjtBQUNBLE1BQUlFLGtCQUFrQixFQUF0QjtBQUNBLE9BQUssSUFBSUMsQ0FBVCxJQUFjRixlQUFkLEVBQStCO0FBQzdCQyxvQkFBZ0JDLENBQWhCLElBQXFCLFNBQVNDLG9CQUFULEdBQWlDO0FBQ3BELFVBQUlDLG9CQUFvQkMsT0FBT0MsTUFBUCxDQUFjUCxTQUFkLEVBQXlCTCxhQUF6QixDQUF4QjtBQUNBLGFBQU9NLGdCQUFnQkUsQ0FBaEIsRUFBbUJLLEtBQW5CLENBQXlCLElBQXpCLEVBQStCSCxpQkFBL0IsQ0FBUDtBQUNELEtBSEQ7QUFJRDtBQUNELFNBQU9ILGVBQVA7QUFDRDtBQUNEN0QsRUFBRW9FLElBQUYsQ0FBTyw0QkFBUCxFQUFxQztBQUNuQ0MsV0FBUztBQUQwQixDQUFyQyxFQUVHLFNBQWVDLFFBQWYsQ0FBeUJ0RSxDQUF6QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0RBLFlBQUV1RSxJQUFGLENBQU8sQ0FBUDtBQURDO0FBQUEsMENBRUt2RSxFQUFFb0UsSUFBRixDQUFPLDhCQUFQLEVBQXVDLGtCQUFnQnBFLENBQWhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWtEMUJ3RSxvQ0FsRDBCLEdBa0R6QyxrQkFBaUN2QyxPQUFqQztBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVVd0MsOENBRlYsR0FFbUIzRSxRQUFRLFNBQVIsQ0FGbkI7QUFHUTRFLGdEQUFRekMsUUFBUXlDLEtBSHhCOztBQUFBLDhDQUlRLENBQUNBLEtBQUQsSUFBVSxDQUFDQSxNQUFNQyxNQUp6QjtBQUFBO0FBQUE7QUFBQTs7QUFBQSw4Q0FJdUMsSUFBSUMsS0FBSixDQUFVLGdDQUFWLENBSnZDOztBQUFBO0FBS0lGLDhDQUFNRyxPQUFOLENBQWMsVUFBQ0MsSUFBRCxFQUFVO0FBQUUsOENBQUksQ0FBQ0EsS0FBS0MsR0FBVixFQUFjRCxLQUFLQyxHQUFMLEdBQVdOLFFBQVg7QUFBcUIseUNBQTdELEVBTEosQ0FLbUU7QUFMbkU7QUFBQSx3RUFNVU8sYUFBYUMsUUFBYixDQUFzQixFQUFDUCxZQUFELEVBQXRCLENBTlY7O0FBQUE7QUFBQTtBQUFBLHdFQU9tQzNDLEdBQUdDLFlBQUgsQ0FBZ0IsRUFBQ0MsZ0JBQUQsRUFBaEIsQ0FQbkM7O0FBQUE7QUFPUWlELDBEQVBSO0FBQUE7QUFBQSx3RUFRVW5ELEdBQUdHLFNBQUgsQ0FBYSxFQUFDbkIsU0FBU21FLGtCQUFWLEVBQThCQyxRQUFRLE9BQXRDLEVBQStDQyxRQUFRLFlBQXZELEVBQXFFVixZQUFyRSxFQUFiLENBUlY7O0FBQUE7QUFTUVcsbURBQVdwRixFQUFFcUYsR0FBRixDQUFNckYsRUFBRXNGLElBQUYsQ0FBTyxLQUFQLENBQU4sRUFBcUJiLEtBQXJCLENBVG5CO0FBQUE7QUFBQSx3RUFVOEJNLGFBQWFRLGdCQUFiLENBQThCQyxNQUE5QixDQUFxQyxFQUFDQyxVQUFVLFFBQVgsRUFBcUJMLGtCQUFyQixFQUErQlgsWUFBL0IsRUFBckMsQ0FWOUI7O0FBQUE7QUFVUWlCLHFEQVZSO0FBQUE7QUFBQSx3RUFZVVgsYUFBYVksWUFBYixDQUEwQkMsaUJBQTFCLENBQTRDLEVBQUNSLGtCQUFELEVBQVdTLGNBQWMsS0FBekIsRUFBZ0NDLGdCQUFnQixDQUFDSixhQUFELENBQWhELEVBQTVDLENBWlY7O0FBQUE7QUFBQTtBQUFBLDZDQWFXLEVBQUNOLGtCQUFEO0FBYlg7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQWdCSXRELGlDQUFHaEMsVUFBSCxDQUFjLGtCQUFkLGlCQUF5Q2tDLE9BQXpDOztBQWhCSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFsRHlDOztBQUV6Q04sOEJBQVU7QUFDUlcsOEJBQVEsRUFEQTtBQUVSMEQsOEJBQVE7QUFDTkMscUNBQWE7QUFDWHJGLGdDQUFNLFVBREs7QUFFWG9GLGtDQUFRO0FBQ045RixrQ0FBTUEsS0FBS2dHLElBQUwsQ0FBVUMsU0FBVixFQUFxQixxQkFBckI7QUFEQTtBQUZHO0FBRFAsdUJBRkE7QUFVUnpELDhCQUFRO0FBVkEscUJBQVY7QUFZRTtBQUNBOztBQUVFMEQsa0NBakJxQyxHQWlCcEJ0RyxRQUFRLFdBQVIsQ0FqQm9CO0FBbUJyQ3VHLG9DQW5CcUMsR0FtQmxCO0FBQ3JCQyxtQ0FBYTtBQUFBLCtCQUFNM0UsUUFBUXFFLE1BQVIsQ0FBZUMsV0FBZixDQUEyQnJGLElBQWpDO0FBQUEsdUJBRFE7QUFFckIyRixxQ0FBZTtBQUFBLCtCQUFNNUUsUUFBUXFFLE1BQVIsQ0FBZUMsV0FBZixDQUEyQkQsTUFBakM7QUFBQSx1QkFGTTtBQUdyQlEscUNBQWU7QUFBQSwrQkFBTXRHLEtBQUtnRyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsbUNBQXJCLENBQU47QUFBQSx1QkFITTtBQUlyQk0sMkNBQXFCO0FBQUEsK0JBQU12RyxLQUFLZ0csSUFBTCxDQUFVQyxTQUFWLEVBQXFCLG1DQUFyQixDQUFOO0FBQUEsdUJBSkE7QUFLckJPLGtEQUE0QjtBQUFBLCtCQUFNLEVBQU47QUFBQSx1QkFMUDtBQU1yQkMsd0NBQWtCLDRCQUFNO0FBQ3RCLDRCQUFJO0FBQ0YsaUNBQU83RyxRQUFRLDhDQUFSLENBQVA7QUFDRCx5QkFGRCxDQUVFLE9BQU9nRCxLQUFQLEVBQWM7QUFDZGYsNkJBQUdoQyxVQUFILENBQWMsc0NBQWQsRUFBc0QrQyxLQUF0RDtBQUNEO0FBQ0YsdUJBWm9CO0FBYXJCOEQsc0NBQWdCO0FBQUEsK0JBQU0sWUFBTjtBQUFBO0FBYksscUJBbkJrQjtBQWtDckM1QixnQ0FsQ3FDLEdBa0N0Qi9FLEVBQUU0RyxLQUFGLENBQVE7QUFDekJDLCtDQUF5QlYsZUFBZW5HLEVBQUU0RyxLQUFGLENBQVFSLGdCQUFSLEVBQTBCO0FBQ2hFVSwyQ0FBbUI7QUFBQSxpQ0FBTSxxQkFBTjtBQUFBO0FBRDZDLHVCQUExQixDQUFmLEVBRXJCaEYsRUFGcUIsQ0FEQTtBQUl6QmlGLDJDQUFxQlosZUFBZW5HLEVBQUU0RyxLQUFGLENBQVFSLGdCQUFSLEVBQTBCO0FBQzVEVSwyQ0FBbUI7QUFBQSxpQ0FBTSxxQkFBTjtBQUFBO0FBRHlDLHVCQUExQixDQUFmLEVBRWpCaEYsRUFGaUIsQ0FKSTtBQU96QmhDLGtDQUFZZ0MsR0FBR2hDLFVBUFU7QUFRekJrSCxvREFBOEJiLGVBQWVuRyxFQUFFNEcsS0FBRixDQUFRUixnQkFBUixFQUEwQjtBQUNyRVUsMkNBQW1CO0FBQUEsaUNBQU0sOEJBQU47QUFBQTtBQURrRCx1QkFBMUIsQ0FBZixFQUUxQmhGLEVBRjBCO0FBUkwscUJBQVIsRUFXaEJBLEVBWGdCLENBbENzQjtBQUFBO0FBQUEsb0RBOENIakMsUUFBUSxrQkFBUixFQUE0QnVHLGdCQUE1QixFQUE4Q3JCLFlBQTlDLENBOUNHOztBQUFBO0FBOEN6Q0EsaUNBQWFRLGdCQTlDNEI7QUFBQTtBQUFBLG9EQStDUDFGLFFBQVEsY0FBUixFQUF3QnVHLGdCQUF4QixFQUEwQ3JCLFlBQTFDLENBL0NPOztBQUFBO0FBK0N6Q0EsaUNBQWFZLFlBL0M0QjtBQUFBO0FBQUEsb0RBZ0RYOUYsUUFBUSxZQUFSLEVBQXNCdUcsZ0JBQXRCLEVBQXdDckIsWUFBeEMsQ0FoRFc7O0FBQUE7QUFnRHpDQSxpQ0FBYUMsUUFoRDRCOztBQXFFekNsRCx1QkFBR0ssYUFBSCxDQUFpQixFQUFDRCxPQUFPLGtCQUFSLEVBQTRCRSxlQUFlbUMsZ0JBQTNDLEVBQWpCO0FBQ0F6Qyx1QkFBR21GLGFBQUgsQ0FBaUIsRUFBQ3RFLE9BQU8sa0JBQVIsRUFBNEJULE9BQU8sa0JBQW5DLEVBQWpCO0FBQ0lnRiwyQ0F2RXFDLEdBdUVYO0FBQzVCekMsNkJBQU8sQ0FBQyxFQUFDakMsTUFBTSxNQUFQLEVBQUQ7QUFEcUIscUJBdkVXO0FBQUE7QUFBQTtBQUFBLG9EQTJFcEJWLEdBQUdRLFNBQUgsQ0FBYSxFQUFDSixPQUFPLGtCQUFSLEVBQTRCRixTQUFTa0YsdUJBQXJDLEVBQWIsQ0EzRW9COztBQUFBO0FBMkVuQ0MsNEJBM0VtQzs7QUE0RXZDcEgsc0JBQUVZLElBQUYsQ0FBT3dHLFFBQVAsRUFBaUIsUUFBakI7QUFDQXBILHNCQUFFWSxJQUFGLENBQU93RyxTQUFTL0IsUUFBaEIsRUFBMEIsT0FBMUI7QUFDQXJGLHNCQUFFWSxJQUFGLENBQU93RyxTQUFTL0IsUUFBVCxDQUFrQlYsTUFBekIsRUFBaUMsQ0FBakM7QUE5RXVDO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQWdGdkM1Qyx1QkFBR2hDLFVBQUgsQ0FBYywrQkFBZCxpQkFBc0QsRUFBQ29DLE9BQU8sa0JBQVIsRUFBNEJGLFNBQVNrRix1QkFBckMsRUFBdEQ7O0FBaEZ1Qzs7QUFtRnZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRjFGLHdCQUFJLGdCQUFKLEVBQXNCLEVBQUNFLGdCQUFELEVBQXRCO0FBQ0EzQixzQkFBRXFILEdBQUY7QUE1RnlDO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQThGekM7QUFDQXRGLHVCQUFHZSxLQUFILENBQVMsRUFBQ0Esb0JBQUQsRUFBVDtBQUNBckIsd0JBQUksZUFBSjtBQUNBO0FBQ0F6QixzQkFBRXFILEdBQUYsQ0FBTSx1QkFBTjs7QUFsR3lDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXZDLENBRkw7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FGSCIsImZpbGUiOiJqZXN1cy50ZXN0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaWYgKCFnbG9iYWwuX2JhYmVsUG9seWZpbGwpIHtcbiAgcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKVxufVxuY29uc3QgdGhyb3dFcnJvciA9IHJlcXVpcmUoJy4vZXJyb3InKS50aHJvd0Vycm9yXG52YXIgdCA9IHJlcXVpcmUoJ3RhcCcpXG52YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBQQUNLQUdFID0gJ2plc3VzLnRlc3QnXG5wcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwcm9taXNlKSA9PiB7XG4gIGNvbnNvbGUubG9nKCd1bmhhbmRsZWRSZWplY3Rpb24gUmVhc29uOiAnLCBwcm9taXNlLCByZWFzb24pXG4gIGNvbnNvbGUudHJhY2UocHJvbWlzZSlcbn0pXG5cbnZhciBERUJVRyA9IGZ1bmN0aW9uICh0eXBlLCBkZWJ1ZywgbXNnID0gJ3Vua25vdycsIGNvbnRleHQgPSAndW5rbm93Jykge1xuICBjb25zdCBBTlNJX1JFU0VUID0gJ1xcdTAwMUJbMG0nXG4gIGNvbnN0IEFOU0lfQkxBQ0sgPSAnXFx1MDAxQlszMG0nXG4gIGNvbnN0IEFOU0lfUkVEID0gJ1xcdTAwMUJbMzFtJ1xuICBjb25zdCBBTlNJX0dSRUVOID0gJ1xcdTAwMUJbMzJtJ1xuICBjb25zdCBBTlNJX1lFTExPVyA9ICdcXHUwMDFCWzMzbSdcbiAgY29uc3QgQU5TSV9CTFVFID0gJ1xcdTAwMUJbMzRtJ1xuICBjb25zdCBBTlNJX1BVUlBMRSA9ICdcXHUwMDFCWzM1bSdcbiAgY29uc3QgQU5TSV9DWUFOID0gJ1xcdTAwMUJbMzZtJ1xuICBjb25zdCBBTlNJX1dISVRFID0gJ1xcdTAwMUJbMzdtJ1xuICBpZiAodHlwZSA9PT0gJ0VSUk9SJykge1xuICAgIGNvbnNvbGUubG9nKGAke0FOU0lfUkVEfWApXG4gIH1cbiAgaWYgKHR5cGUgPT09ICdXQVJOSU5HJykge1xuICAgIGNvbnNvbGUubG9nKGAke0FOU0lfWUVMTE9XfWApXG4gIH1cbiAgaWYgKHR5cGUgPT09ICdMT0cnKSB7XG4gICAgY29uc29sZS5sb2coYCR7QU5TSV9HUkVFTn1gKVxuICB9XG4gIGlmICh0eXBlID09PSAnREVCVUcnKSB7XG4gICAgY29uc29sZS5sb2coYCR7QU5TSV9DWUFOfWApXG4gIH1cbiAgY29uc29sZS5sb2coYCR7dHlwZX0gJHtjb250ZXh0fSA+ICR7bXNnfSAke0FOU0lfUkVTRVR9YClcbiAgY29uc29sZS5sb2coZGVidWcpXG4gIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykuc3Vic3RyaW5nKDAsIDI1MCkpXG59XG52YXIgTE9HID0gZnVuY3Rpb24gKHR5cGUsIGxvZywgbXNnID0gJ3Vua25vdycsIGNvbnRleHQgPSAndW5rbm93Jykge1xuICBjb25zdCBBTlNJX1JFU0VUID0gJ1xcdTAwMUJbMG0nXG4gIGNvbnN0IEFOU0lfQkxBQ0sgPSAnXFx1MDAxQlszMG0nXG4gIGNvbnN0IEFOU0lfQkFDS0dST1VORF9DWUFOID0gJ1xcdTAwMUJbNDZtJ1xuICBjb25zb2xlLmxvZyhgJHtBTlNJX0JBQ0tHUk9VTkRfQ1lBTiArIEFOU0lfQkxBQ0t9YClcbiAgY29uc29sZS5sb2coYExPRyAtLT4gJHt0eXBlfSAke2NvbnRleHR9ID4gJHttc2d9ICR7QU5TSV9SRVNFVH1gKVxuICBERUJVRyh0eXBlLCBsb2csIG1zZywgY29udGV4dClcbn1cblxudmFyIFNFUlZJQ0VcbnZhciBTRVJWSUNFX05BTUUgPSAndGVzdFNlcnZpY2UnXG52YXIgZmFrZUF1dGggPSB7XG4gIHVzZXJJZDogJzE5NTE1MTY2MjY2MSdcbn1cblxuXG5cbnZhciBESSA9IHtcbiAgdGhyb3dFcnJvcixcbiAgYXV0aGVudGljYXRlOiBhc3luYyh7cmVxdWVzdH0pID0+IGZha2VBdXRoLFxuICBhdXRob3JpemU6IGFzeW5jKHtyb3V0ZSwgcmVxdWVzdH0pID0+IHRydWUsXG4gIC8vIGdldEV2ZW50czogKHBheWxvYWQpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgLy8gICByZXNvbHZlKFNFUlZJQ0UuZXZlbnRzKVxuICAvLyB9KSxcbiAgLy8gZ2V0Q29uZmlnOiAocGF5bG9hZCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAvLyAgIHJlc29sdmUoY29uZmlnKVxuICAvLyB9KSxcbiAgcmVnaXN0ZXJSb3V0ZTogYXN5bmMoe3JvdXRlLCByb3V0ZUZ1bmN0aW9ufSkgPT4gU0VSVklDRS5yb3V0ZXNbcm91dGVdID0gcm91dGVGdW5jdGlvbixcbiAgY2FsbFJvdXRlOiBhc3luYyh7cm91dGUsIHJlcXVlc3R9KSA9PiBTRVJWSUNFLnJvdXRlc1tyb3V0ZV0ocmVxdWVzdCksXG4gIGRlcmVnaXN0ZXJSb3V0ZTogYXN5bmMoe3JvdXRlfSkgPT4gU0VSVklDRS5yb3V0ZXNbcm91dGVdKHJlcXVlc3QpLFxuICBkZXJlZ2lzdGVyUm91dGU6IGFzeW5jKHtyb3V0ZX0pID0+IGRlbGV0ZSBTRVJWSUNFLnJvdXRlc1tyb3V0ZV0sXG4gIHJlZ2lzdGVyRXZlbnQ6IGFzeW5jKHtuYW1lLCByb3V0ZX0pID0+IHtcbiAgICBTRVJWSUNFLmV2ZW50c1tuYW1lXSA9IHtcbiAgICAgIG5hbWUsXG4gICAgICByb3V0ZSxcbiAgICAgIHNlcnZpY2U6IFNFUlZJQ0VfTkFNRVxuICAgIH1cbiAgfSxcbiAgZGVyZWdpc3RlckV2ZW50OiBhc3luYyh7bmFtZX0pID0+IGRlbGV0ZSBTRVJWSUNFLmV2ZW50c1tldmVudF0sXG4gIGVtaXRFdmVudDogYXN5bmMoe25hbWUsIHBheWxvYWR9KSA9PiB7XG5cbiAgfSxcbiAgbG9nOiBhc3luYyh7Y29udGV4dCwgbXNnLCBsb2csIHR5cGV9KSA9PiBMT0codHlwZSwgbG9nLCBtc2csIGNvbnRleHQpLFxuICBkZWJ1ZzogYXN5bmMoe2NvbnRleHQsIG1zZywgZGVidWd9KSA9PiBERUJVRygnREVCVUcnLCBkZWJ1ZywgbXNnLCBjb250ZXh0KSxcbiAgZXJyb3I6IGFzeW5jKHtlcnJvcn0pID0+IHtcbiAgICBjb25zdCBBTlNJX1JFU0VUID0gJ1xcdTAwMUJbMG0nXG4gICAgY29uc3QgQU5TSV9SRUQgPSAnXFx1MDAxQlszMW0nXG4gICAgY29uc29sZS5sb2coYCR7QU5TSV9SRUR9IE9SSUdJTkFMIEVSUk9SICR7QU5TSV9SRVNFVH1gKVxuICAgIGNvbnNvbGUubG9nKGVycm9yLm9yaWdpbmFsRXJyb3IgfHwgZXJyb3IpXG4gICAgY29uc29sZS5sb2coYEFQUCBFUlJPUiAtLT4gJHtlcnJvci5pbmZvICYmIGVycm9yLmluZm8ubWVzc2FnZSA/IGVycm9yLmluZm8ubWVzc2FnZSA6ICd1bmtub3cnfWApXG4gICAgY29uc29sZS5sb2coYCR7QU5TSV9SRUR9IEFQUCBUUkFDRSAke0FOU0lfUkVTRVR9YClcbiAgICBpZiAoZXJyb3IuZ2V0QXBwVHJhY2UpY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXJyb3IuZ2V0QXBwVHJhY2UoKSwgbnVsbCwgNCkpXG4gICAgLy8gaWYgKGVycm9yLnRvU3RyaW5nKWNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGVycm9yLnRvU3RyaW5nKCksIG51bGwsIDQpKVxuICAgIExPRygnRVJST1InLCBlcnJvciwgJ2plc3VzLXRlc3QnLCAnQVBQLUVSUk9SJylcbiAgfVxuXG4gIC8vIHZhbGlkYXRlRW50aXR5OiAocGF5bG9hZCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAvLyAgIExPRygnTE9HJywgcGF5bG9hZClcbiAgLy8gICByZXNvbHZlKHRydWUpXG4gIC8vIH0pLFxuICAvLyBnZXRFbnRpdHlTY2hlbWE6IChwYXlsb2FkKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gIC8vICAgTE9HKCdMT0cnLCBwYXlsb2FkKVxuICAvLyAgIHJlc29sdmUodHJ1ZSlcbiAgLy8gfSlcblxufVxuZnVuY3Rpb24gc2V0UGFja2FnZUFyZ3NPdmVyd3JpdGUgKCkge1xuICB2YXIgb3ZlcndyaXRlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgdmFyIG9yaWdpbmFsUGFja2FnZSA9IGFyZ3VtZW50c1swXVxuICB2YXIgbW9kaWZpZWRQYWNrYWdlID0ge31cbiAgZm9yICh2YXIgaSBpbiBvcmlnaW5hbFBhY2thZ2UpIHtcbiAgICBtb2RpZmllZFBhY2thZ2VbaV0gPSBmdW5jdGlvbiBwYWNrYWdlQXJnc092ZXJ3cml0ZSAoKSB7XG4gICAgICB2YXIgbW9kaWZpZWRBcmd1bWVudHMgPSBPYmplY3QuYXNzaWduKGFyZ3VtZW50cywgb3ZlcndyaXRlQXJncylcbiAgICAgIHJldHVybiBvcmlnaW5hbFBhY2thZ2VbaV0uYXBwbHkodGhpcywgbW9kaWZpZWRBcmd1bWVudHMpXG4gICAgfVxuICB9XG4gIHJldHVybiBtb2RpZmllZFBhY2thZ2Vcbn1cbnQudGVzdCgnKioqIEpFU1VTIFNFUlZJQ0UgQ1JVRCAqKionLCB7XG4gIGF1dG9lbmQ6IHRydWVcbn0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIHQucGxhbigxKVxuICBhd2FpdCB0LnRlc3QoJyoqKiBKRVNVUyBTRVJWSUNFIENSVUQgMSAqKionLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRyeSB7XG4gICAgICBTRVJWSUNFID0ge1xuICAgICAgICByb3V0ZXM6IHt9LFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBtYWluU3RvcmFnZToge1xuICAgICAgICAgICAgdHlwZTogJ2lubWVtb3J5JyxcbiAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdE1hdGVyaWFsL2ZpbGVEYicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBldmVudHM6IHt9XG4gICAgICB9XG4gICAgICAgIC8vIFNIQVJFRCBGVU5DVElPTlNcbiAgICAgICAgLy8gdmFyIG9wdGlvbnNTdG9yYWdlID0gamVzdXMuZ2V0U3RvcmFnZVBhY2thZ2UoQ09ORklHLm9wdGlvbnNTdG9yYWdlLCBDT05GSUcuaXRlbXMuZW50aXR5VGVzdC5vcHRpb25zU3RvcmFnZUNvbGxlY3Rpb24pXG5cbiAgICAgIHZhciBzdG9yYWdlUGFja2FnZSA9IHJlcXVpcmUoJy4vc3RvcmFnZScpXG5cbiAgICAgIHZhciBlbnRpdHlUZXN0Q29uZmlnID0ge1xuICAgICAgICBzdG9yYWdlVHlwZTogKCkgPT4gU0VSVklDRS5jb25maWcubWFpblN0b3JhZ2UudHlwZSxcbiAgICAgICAgc3RvcmFnZUNvbmZpZzogKCkgPT4gU0VSVklDRS5jb25maWcubWFpblN0b3JhZ2UuY29uZmlnLFxuICAgICAgICBtdXRhdGlvbnNQYXRoOiAoKSA9PiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdE1hdGVyaWFsL2VudGl0eVRlc3QvbXV0YXRpb25zJyksXG4gICAgICAgIG11dGF0aW9uc0NvbGxlY3Rpb246ICgpID0+IHBhdGguam9pbihfX2Rpcm5hbWUsICd0ZXN0TWF0ZXJpYWwvZW50aXR5VGVzdC9tdXRhdGlvbnMnKSxcbiAgICAgICAgdmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnM6ICgpID0+IDEwLFxuICAgICAgICB2YWxpZGF0aW9uU2NoZW1hOiAoKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiByZXF1aXJlKCcuL3Rlc3RNYXRlcmlhbC9lbnRpdHlUZXN0L2VudGl0eS5zY2hlbWEuanNvbicpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIERJLnRocm93RXJyb3IoJ2VudGl0eVRlc3RDb25maWcgdmFsaWRhdGlvblNjaGVtYSgpICcsIGVycm9yKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6ICgpID0+ICdqc29uU2NoZW1hJ1xuICAgICAgfVxuICAgICAgdmFyIGVudGl0eVRlc3RESSA9IFIubWVyZ2Uoe1xuICAgICAgICBtdXRhdGlvbnNTdG9yYWdlUGFja2FnZTogc3RvcmFnZVBhY2thZ2UoUi5tZXJnZShlbnRpdHlUZXN0Q29uZmlnLCB7XG4gICAgICAgICAgc3RvcmFnZUNvbGxlY3Rpb246ICgpID0+ICdlbnRpdHlUZXN0TXV0YXRpb25zJ1xuICAgICAgICB9KSwgREkpLFxuICAgICAgICB2aWV3c1N0b3JhZ2VQYWNrYWdlOiBzdG9yYWdlUGFja2FnZShSLm1lcmdlKGVudGl0eVRlc3RDb25maWcsIHtcbiAgICAgICAgICBzdG9yYWdlQ29sbGVjdGlvbjogKCkgPT4gJ2VudGl0eVRlc3RWaWV3c01haW4nXG4gICAgICAgIH0pLCBESSksXG4gICAgICAgIHRocm93RXJyb3I6IERJLnRocm93RXJyb3IsXG4gICAgICAgIHZpZXdzU25hcHNob3RzU3RvcmFnZVBhY2thZ2U6IHN0b3JhZ2VQYWNrYWdlKFIubWVyZ2UoZW50aXR5VGVzdENvbmZpZywge1xuICAgICAgICAgIHN0b3JhZ2VDb2xsZWN0aW9uOiAoKSA9PiAnZW50aXR5VGVzdFZpZXdzTWFpblNuYXBzaG90cydcbiAgICAgICAgfSksIERJKVxuICAgICAgfSwgREkpXG4gICAgICBlbnRpdHlUZXN0REkubXV0YXRpb25zUGFja2FnZSA9IGF3YWl0IHJlcXVpcmUoJy4vbXV0YXRpb25zLmNxcnMnKShlbnRpdHlUZXN0Q29uZmlnLCBlbnRpdHlUZXN0REkpXG4gICAgICBlbnRpdHlUZXN0REkudmlld3NQYWNrYWdlID0gYXdhaXQgcmVxdWlyZSgnLi92aWV3cy5jcXJzJykoZW50aXR5VGVzdENvbmZpZywgZW50aXR5VGVzdERJKVxuICAgICAgZW50aXR5VGVzdERJLnZhbGlkYXRlID0gYXdhaXQgcmVxdWlyZSgnLi92YWxpZGF0ZScpKGVudGl0eVRlc3RDb25maWcsIGVudGl0eVRlc3RESSlcblxuICAgICAgYXN5bmMgZnVuY3Rpb24gY3JlYXRlRW50aXR5VGVzdCAocmVxdWVzdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxuICAgICAgICAgIHZhciBpdGVtcyA9IHJlcXVlc3QuaXRlbXNcbiAgICAgICAgICBpZiAoIWl0ZW1zIHx8ICFpdGVtcy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignY3JlYXRlRW50aXR5VGVzdCByZXF1aXJlIGl0ZW1zJylcbiAgICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7IGlmICghaXRlbS5faWQpaXRlbS5faWQgPSB1dWlkVjQoKSB9KSAvLyBJRCBBVVRPR0VORVJBVEVEIElGIE5PVCBJTkNMVURFRFxuICAgICAgICAgIGF3YWl0IGVudGl0eVRlc3RESS52YWxpZGF0ZSh7aXRlbXN9KVxuICAgICAgICAgIHZhciBhdXRob3JpemF0aW9uc0RhdGEgPSBhd2FpdCBESS5hdXRoZW50aWNhdGUoe3JlcXVlc3R9KVxuICAgICAgICAgIGF3YWl0IERJLmF1dGhvcml6ZSh7Y29udGV4dDogYXV0aG9yaXphdGlvbnNEYXRhLCBhY3Rpb246ICd3cml0ZScsIGVudGl0eTogJ2VudGl0eVRlc3QnLCBpdGVtc30pXG4gICAgICAgICAgdmFyIGl0ZW1zSWRzID0gUi5tYXAoUi5wcm9wKCdfaWQnKSwgaXRlbXMpXG4gICAgICAgICAgdmFyIGl0ZW1zTXV0YXRpb24gPSBhd2FpdCBlbnRpdHlUZXN0REkubXV0YXRpb25zUGFja2FnZS5tdXRhdGUoe211dGF0aW9uOiAnY3JlYXRlJywgaXRlbXNJZHMsIGl0ZW1zfSlcblxuICAgICAgICAgIGF3YWl0IGVudGl0eVRlc3RESS52aWV3c1BhY2thZ2UucmVmcmVzaEl0ZW1zVmlld3Moe2l0ZW1zSWRzLCBsb2FkU25hcHNob3Q6IGZhbHNlLCBpdGVtc011dGF0aW9uczogW2l0ZW1zTXV0YXRpb25dfSlcbiAgICAgICAgICByZXR1cm4ge2l0ZW1zSWRzfVxuICAgICAgICAgICAgLy8gREkubG9nKHtjb250ZXh0OiAncGFja2FnZU5hbWUnLCBuYW1lOiAnY3JlYXRlRW50aXR5VGVzdCcsIGxvZzoge2lkc319KVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIERJLnRocm93RXJyb3IoJ2NyZWF0ZUVudGl0eVRlc3QnLCBlcnJvciwgcmVxdWVzdClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgREkucmVnaXN0ZXJSb3V0ZSh7cm91dGU6ICdjcmVhdGVFbnRpdHlUZXN0Jywgcm91dGVGdW5jdGlvbjogY3JlYXRlRW50aXR5VGVzdH0pXG4gICAgICBESS5yZWdpc3RlckV2ZW50KHtldmVudDogJ2NyZWF0ZUVudGl0eVRlc3QnLCByb3V0ZTogJ2NyZWF0ZUVudGl0eVRlc3QnfSlcbiAgICAgIHZhciBjcmVhdGVFbnRpdHlUZXN0UmVxdWVzdCA9IHtcbiAgICAgICAgaXRlbXM6IFt7bmFtZTogJ3Rlc3QnfV1cbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByZXNwb25zZT1hd2FpdCBESS5jYWxsUm91dGUoe3JvdXRlOiAnY3JlYXRlRW50aXR5VGVzdCcsIHJlcXVlc3Q6IGNyZWF0ZUVudGl0eVRlc3RSZXF1ZXN0fSlcbiAgICAgICAgdC50eXBlKHJlc3BvbnNlLCAnb2JqZWN0JylcbiAgICAgICAgdC50eXBlKHJlc3BvbnNlLml0ZW1zSWRzLCAnQXJyYXknKVxuICAgICAgICB0LnR5cGUocmVzcG9uc2UuaXRlbXNJZHMubGVuZ3RoLCAxKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgREkudGhyb3dFcnJvcignREkuY2FsbFJvdXRlIGNyZWF0ZUVudGl0eVRlc3QnLCBlcnJvciwge3JvdXRlOiAnY3JlYXRlRW50aXR5VGVzdCcsIHJlcXVlc3Q6IGNyZWF0ZUVudGl0eVRlc3RSZXF1ZXN0fSlcbiAgICAgIH1cblxuICAgICAgICAvLyB2YXIgZW50aXR5VGVzdERJID0ge1xuICAgICAgICAvLyAgIHZhbGlkYXRlOiBlbnRpdHlUZXN0VmFsaWRhdGUsXG4gICAgICAgIC8vICAgbXV0YXRpb25zUGFja2FnZTogZW50aXR5VGVzdE11dGF0aW9uc1BhY2thZ2UsXG4gICAgICAgIC8vICAgdmlld3NQYWNrYWdlOiBlbnRpdHlUZXN0TWFpblZpZXdQYWNrYWdlXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gdmFyIGVudGl0eVRlc3RfY3J1ZCA9IHJlcXVpcmUoJy4vc2VydmljZS5jcnVkJylcbiAgICAgICAgLy8gZW50aXR5VGVzdF9jcnVkKFIubWVyZ2UoZW50aXR5VGVzdERJLCBESSksIHt9KVxuICAgICAgTE9HKCdSRVNPTFZFIFRFU1QgMScsIHtTRVJWSUNFfSlcbiAgICAgIHQuZW5kKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gdGhyb3cgZXJyb3JcbiAgICAgIERJLmVycm9yKHtlcnJvcn0pXG4gICAgICBMT0coJ1JFSkVDVCBURVNUIDEnKVxuICAgICAgLy8gdC5mYWlsKCdGQUlMIGRlbGV0ZWVudGl0eVRlc3QnKVxuICAgICAgdC5lbmQoJ0ZBSUwgZGVsZXRlZW50aXR5VGVzdCcpXG4gICAgfVxuICAgICAgLy8gU0VSVklDRV9BUEkuZGVsZXRlZW50aXR5VGVzdCh7XG4gICAgICAvLyAgIGlkczogdGVzdGVudGl0eVRlc3RzSWRzXG4gICAgICAvLyB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAvLyAgIExPRygnUkVTT0xWRSBkZWxldGVlbnRpdHlUZXN0JywgcmVzdWx0KVxuICAgICAgLy8gICAvLyB0LnBhc3MoJ1BBU1MgZGVsZXRlZW50aXR5VGVzdCcpXG4gICAgICAvLyAgIHQuZW5kKClcbiAgICAgIC8vIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgLy8gICBMT0coJ1JFSkVDVCBkZWxldGVlbnRpdHlUZXN0JywgZXJyb3IpXG4gICAgICAvLyAgIHQuZmFpbCgnRkFJTCBkZWxldGVlbnRpdHlUZXN0JylcbiAgICAgIC8vICAgdC5lbmQoJ0ZBSUwgZGVsZXRlZW50aXR5VGVzdCcpXG4gICAgICAvLyB9KVxuICB9KVxuICAgIC8vXG4gICAgLy8gYXdhaXQgdC50ZXN0KCcqKiogU0VSVklDRS5jcmVhdGVlbnRpdHlUZXN0ICoqKicsIGZ1bmN0aW9uICh0KSB7XG4gICAgLy8gICBTRVJWSUNFX0FQSS5jcmVhdGVlbnRpdHlUZXN0KHtcbiAgICAvLyAgICAgaXRlbXM6IHRlc3RlbnRpdHlUZXN0c1xuICAgIC8vICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgIC8vICAgICBMT0coJ1JFU09MVkUgY3JlYXRlZW50aXR5VGVzdCcsIHJlc3VsdClcbiAgICAvLyAgICAgLy8gdC5wYXNzKCdQQVNTIGNyZWF0ZWVudGl0eVRlc3QnKVxuICAgIC8vICAgICB0LmVuZCgpXG4gICAgLy8gICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAvLyAgICAgTE9HKCdSRUpFQ1QgY3JlYXRlZW50aXR5VGVzdCcsIGVycm9yKVxuICAgIC8vICAgICB0LmZhaWwoJ0ZBSUwgY3JlYXRlZW50aXR5VGVzdCcpXG4gICAgLy8gICAgIHQuZW5kKClcbiAgICAvLyAgIH0pXG4gICAgLy8gfSlcbiAgICAvLyAvL1xuICAgIC8vIGF3YWl0IHQudGVzdCgnKioqIFNFUlZJQ0UuY3JlYXRlZW50aXR5VGVzdCB0cnkgdG8gcmVpbnNlcnQgc2FtZSBpZHMqKionLCBmdW5jdGlvbiAodCkge1xuICAgIC8vICAgU0VSVklDRV9BUEkuY3JlYXRlZW50aXR5VGVzdCh7XG4gICAgLy8gICAgIGl0ZW1zOiB0ZXN0ZW50aXR5VGVzdHNcbiAgICAvLyAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAvLyAgICAgTE9HKCdSRVNPTFZFIGNyZWF0ZWVudGl0eVRlc3QnLCByZXN1bHQpXG4gICAgLy8gICAgIHQuZmFpbCgnRkFJTCBjcmVhdGVlbnRpdHlUZXN0JylcbiAgICAvLyAgICAgdC5lbmQoKVxuICAgIC8vICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgLy8gICAgIExPRygnUkVKRUNUIGNyZWF0ZWVudGl0eVRlc3QnLCBlcnJvcilcbiAgICAvLyAgICAgdC5lbmQoKVxuICAgIC8vICAgfSlcbiAgICAvLyB9KVxuICAgIC8vXG4gICAgLy8gYXdhaXQgdC50ZXN0KCcqKiogU0VSVklDRS5yZWFkZW50aXR5VGVzdCAqKionLCBmdW5jdGlvbiAodCkge1xuICAgIC8vICAgU0VSVklDRV9BUEkucmVhZGVudGl0eVRlc3Qoe1xuICAgIC8vICAgICBpZHM6IHRlc3RlbnRpdHlUZXN0c0lkc1xuICAgIC8vICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgIC8vICAgICBMT0coJ1JFU09MVkUgcmVhZGVudGl0eVRlc3QnLCByZXN1bHQpXG4gICAgLy8gICAgIHQuZW5kKClcbiAgICAvLyAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIC8vICAgICBMT0coJ1JFSkVDVCByZWFkZW50aXR5VGVzdCcsIGVycm9yKVxuICAgIC8vICAgICB0LmZhaWwoJ0ZBSUwgcmVhZGVudGl0eVRlc3QnKVxuICAgIC8vICAgICB0LmVuZCgpXG4gICAgLy8gICB9KVxuICAgIC8vIH0pXG4gICAgLy9cbiAgICAvLyBhd2FpdCB0LnRlc3QoJyoqKiBTRVJWSUNFLnVwZGF0ZWVudGl0eVRlc3QgKioqJywgZnVuY3Rpb24gKHQpIHtcbiAgICAvLyAgIFNFUlZJQ0VfQVBJLnVwZGF0ZWVudGl0eVRlc3Qoe1xuICAgIC8vICAgICBpdGVtczogdGVzdGVudGl0eVRlc3RzXG4gICAgLy8gICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgLy8gICAgIExPRygnUkVTT0xWRSB1cGRhdGVlbnRpdHlUZXN0JywgcmVzdWx0KVxuICAgIC8vICAgICB0LmVuZCgnUkVTT0xWRSB1cGRhdGVlbnRpdHlUZXN0JylcbiAgICAvLyAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIC8vICAgICBMT0coJ1JFSkVDVCB1cGRhdGVlbnRpdHlUZXN0JywgZXJyb3IpXG4gICAgLy8gICAgIHQuZmFpbCgnRkFJTCB1cGRhdGVlbnRpdHlUZXN0JylcbiAgICAvLyAgICAgdC5lbmQoKVxuICAgIC8vICAgfSlcbiAgICAvLyB9KVxuICAvLyB0LmVuZCgpXG4gIC8vIHByb2Nlc3MuZXhpdCgwKVxufSlcbiJdfQ==