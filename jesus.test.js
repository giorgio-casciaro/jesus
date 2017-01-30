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
var fs = require('fs');
var PACKAGE = 'jesus.test';
process.on('unhandledRejection', function (reason, promise) {
  console.log('unhandledRejection Reason: ', promise, reason);
  console.trace(promise);
});
var debugActive = false;
var debugSaveTimeout;
var debugFile = path.join(__dirname, 'testMaterial/debug', PACKAGE + '.json');
var debugRegistry = [];
function save_debug() {}
var DEBUG = function DEBUG(type, debug) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'unknow';
  var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'unknow';

  if (!debugActive) return null;
  debugRegistry.push(_defineProperty({}, type + ' ' + context + ' > ' + msg, debug));
  if (debugSaveTimeout) clearTimeout(debugSaveTimeout);
  debugSaveTimeout = setTimeout(function () {
    fs.writeFile(debugFile, JSON.stringify(debugRegistry, null, 4), 'utf8');
  }, 1000);
};
// var DEBUG = function (type, debug, msg = 'unknow', context = 'unknow') {
//   if (!debugActive) return null
//   const ANSI_RESET = '\u001B[0m'
//   const ANSI_BLACK = '\u001B[30m'
//   const ANSI_RED = '\u001B[31m'
//   const ANSI_GREEN = '\u001B[32m'
//   const ANSI_YELLOW = '\u001B[33m'
//   const ANSI_BLUE = '\u001B[34m'
//   const ANSI_PURPLE = '\u001B[35m'
//   const ANSI_CYAN = '\u001B[36m'
//   const ANSI_WHITE = '\u001B[37m'
//   if (type === 'ERROR') console.log(`${ANSI_RED}`)
//   if (type === 'WARNING') console.log(`${ANSI_YELLOW}`)
//   if (type === 'LOG') console.log(`${ANSI_GREEN}`)
//   if (type === 'DEBUG') console.log(`${ANSI_CYAN}`)
//   console.log(`${type} ${context} > ${msg} ${ANSI_RESET}`)
//   console.log(debug)
//   // console.log(JSON.stringify(arguments).substring(0, 250))
// }
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

t.test('*** JESUS SERVICE CRUD ***', {
  autoend: true
}, function mainTest(t) {
  var storagePackage, entityTestConfig, entityTestDI;
  return regeneratorRuntime.async(function mainTest$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
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
          _context22.next = 6;
          return regeneratorRuntime.awrap(require('./mutations.cqrs')(entityTestConfig, entityTestDI));

        case 6:
          entityTestDI.mutationsPackage = _context22.sent;
          _context22.next = 9;
          return regeneratorRuntime.awrap(require('./views.cqrs')(entityTestConfig, entityTestDI));

        case 9:
          entityTestDI.viewsPackage = _context22.sent;
          _context22.next = 12;
          return regeneratorRuntime.awrap(require('./validate')(entityTestConfig, entityTestDI));

        case 12:
          entityTestDI.validate = _context22.sent;


          global.serviceResponse = {};
          t.plan(4);
          _context22.next = 17;
          return regeneratorRuntime.awrap(t.test('-> CRUD CREATE', function _callee3(t) {
            var createEntityTest, createEntityTestRequest;
            return regeneratorRuntime.async(function _callee3$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    _context15.prev = 0;

                    createEntityTest = function _callee2(request) {
                      var _this = this;

                      var items, authorizationsData, itemsIds, itemsMutations, _ret;

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
                                        itemsMutations = _context13.sent;

                                        DI.debug({ msg: 'createEntityTest', context: PACKAGE, debug: { itemsMutations: itemsMutations } });
                                        _context13.next = 19;
                                        return regeneratorRuntime.awrap(entityTestDI.viewsPackage.refreshItemsViews({ itemsIds: itemsIds, loadSnapshot: false, loadMutations: false, addMutations: itemsMutations }));

                                      case 19:
                                        return _context13.abrupt('return', {
                                          v: { itemsIds: itemsIds }
                                        });

                                      case 20:
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

                    DI.registerRoute({ route: 'createEntityTest', routeFunction: createEntityTest });
                    DI.registerEvent({ event: 'createEntityTest', route: 'createEntityTest' });
                    createEntityTestRequest = {
                      items: [{ name: 'test' }, { name: 'test2' }]
                    };
                    _context15.prev = 5;
                    _context15.next = 8;
                    return regeneratorRuntime.awrap(DI.callRoute({ route: 'createEntityTest', request: createEntityTestRequest }));

                  case 8:
                    global.serviceResponse = _context15.sent;

                    t.type(global.serviceResponse, 'object', 'Response is object');
                    t.type(global.serviceResponse.itemsIds, 'Array', 'itemsIds is array');
                    t.type(global.serviceResponse.itemsIds.length, 2, 'itemsIds length is 2');
                    _context15.next = 17;
                    break;

                  case 14:
                    _context15.prev = 14;
                    _context15.t0 = _context15['catch'](5);

                    DI.throwError('DI.callRoute createEntityTest', _context15.t0, { route: 'createEntityTest', request: createEntityTestRequest });

                  case 17:

                    t.end();
                    _context15.next = 25;
                    break;

                  case 20:
                    _context15.prev = 20;
                    _context15.t1 = _context15['catch'](0);

                    DI.error({ error: _context15.t1 });
                    t.fail('FAIL createEntityTest');
                    t.end('FAIL createEntityTest');

                  case 25:
                  case 'end':
                    return _context15.stop();
                }
              }
            }, null, this, [[0, 20], [5, 14]]);
          }));

        case 17:
          _context22.next = 19;
          return regeneratorRuntime.awrap(t.test('-> CRUD UPDATE', function _callee5(t) {
            var updateEntityTest, updateEntityTestRequest;
            return regeneratorRuntime.async(function _callee5$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    _context17.prev = 0;

                    updateEntityTest = function _callee4(request) {
                      var items, authorizationsData, itemsIds, itemsMutations;
                      return regeneratorRuntime.async(function _callee4$(_context16) {
                        while (1) {
                          switch (_context16.prev = _context16.next) {
                            case 0:
                              _context16.prev = 0;
                              items = request.items;

                              if (!(!items || !items.length)) {
                                _context16.next = 4;
                                break;
                              }

                              throw new Error('updateEntityTest require items');

                            case 4:
                              items.forEach(function (item) {
                                if (!item._id) throw new Error('updateEntityTest items _id field is required');
                              }); // ID NEEDED
                              _context16.next = 7;
                              return regeneratorRuntime.awrap(entityTestDI.validate({ items: items }));

                            case 7:
                              _context16.next = 9;
                              return regeneratorRuntime.awrap(DI.authenticate({ request: request }));

                            case 9:
                              authorizationsData = _context16.sent;
                              _context16.next = 12;
                              return regeneratorRuntime.awrap(DI.authorize({ context: authorizationsData, action: 'write', entity: 'entityTest', items: items }));

                            case 12:
                              itemsIds = R.map(R.prop('_id'), items);
                              _context16.next = 15;
                              return regeneratorRuntime.awrap(entityTestDI.mutationsPackage.mutate({ mutation: 'update', itemsIds: itemsIds, items: items }));

                            case 15:
                              itemsMutations = _context16.sent;

                              DI.debug({ msg: 'updateEntityTest', context: PACKAGE, debug: { itemsMutations: itemsMutations } });
                              _context16.next = 19;
                              return regeneratorRuntime.awrap(entityTestDI.viewsPackage.refreshItemsViews({ itemsIds: itemsIds, loadSnapshot: true, loadMutations: true, addMutations: itemsMutations }));

                            case 19:
                              return _context16.abrupt('return', { itemsIds: itemsIds });

                            case 22:
                              _context16.prev = 22;
                              _context16.t0 = _context16['catch'](0);

                              DI.throwError('updateEntityTest', _context16.t0, request);

                            case 25:
                            case 'end':
                              return _context16.stop();
                          }
                        }
                      }, null, this, [[0, 22]]);
                    };

                    DI.registerRoute({ route: 'updateEntityTest', routeFunction: updateEntityTest });
                    DI.registerEvent({ event: 'updateEntityTest', route: 'updateEntityTest' });
                    updateEntityTestRequest = {
                      items: [{ name: 'testupdate', _id: global.serviceResponse.itemsIds[0] }, { name: 'testupdate2', _id: global.serviceResponse.itemsIds[1] }]
                    };
                    _context17.prev = 5;
                    _context17.next = 8;
                    return regeneratorRuntime.awrap(DI.callRoute({ route: 'updateEntityTest', request: updateEntityTestRequest }));

                  case 8:
                    global.serviceResponse = _context17.sent;

                    t.type(global.serviceResponse, 'object', 'Response is object');
                    t.type(global.serviceResponse.itemsIds, 'Array', 'itemsIds is array');
                    t.type(global.serviceResponse.itemsIds.length, 2, 'itemsIds length is 2');
                    _context17.next = 17;
                    break;

                  case 14:
                    _context17.prev = 14;
                    _context17.t0 = _context17['catch'](5);

                    DI.throwError('DI.callRoute updateEntityTest', _context17.t0, { route: 'updateEntityTest', request: updateEntityTestRequest });

                  case 17:

                    t.end();
                    _context17.next = 25;
                    break;

                  case 20:
                    _context17.prev = 20;
                    _context17.t1 = _context17['catch'](0);

                    DI.error({ error: _context17.t1 });
                    t.fail('FAIL updateEntityTest');
                    t.end('FAIL updateEntityTest');

                  case 25:
                  case 'end':
                    return _context17.stop();
                }
              }
            }, null, this, [[0, 20], [5, 14]]);
          }));

        case 19:
          _context22.next = 21;
          return regeneratorRuntime.awrap(t.test('-> CRUD READ', function _callee7(t) {
            var readEntityTest, readEntityTestRequest;
            return regeneratorRuntime.async(function _callee7$(_context19) {
              while (1) {
                switch (_context19.prev = _context19.next) {
                  case 0:
                    _context19.prev = 0;

                    readEntityTest = function _callee6(request) {
                      var itemsIds, authorizationsData, items;
                      return regeneratorRuntime.async(function _callee6$(_context18) {
                        while (1) {
                          switch (_context18.prev = _context18.next) {
                            case 0:
                              _context18.prev = 0;
                              itemsIds = request.ids;

                              if (!(!itemsIds || !itemsIds.length)) {
                                _context18.next = 4;
                                break;
                              }

                              throw new Error('readEntityTest require items ids');

                            case 4:
                              _context18.next = 6;
                              return regeneratorRuntime.awrap(DI.authenticate({ request: request }));

                            case 6:
                              authorizationsData = _context18.sent;
                              _context18.next = 9;
                              return regeneratorRuntime.awrap(DI.authorize({ context: authorizationsData, action: 'read', entity: 'entityTest', itemsIds: itemsIds }));

                            case 9:
                              _context18.next = 11;
                              return regeneratorRuntime.awrap(entityTestDI.viewsPackage.get({ ids: itemsIds }));

                            case 11:
                              items = _context18.sent;

                              DI.debug({ msg: 'readEntityTest', context: PACKAGE, debug: { itemsIds: itemsIds, authorizationsData: authorizationsData, items: items } });
                              return _context18.abrupt('return', { items: items });

                            case 16:
                              _context18.prev = 16;
                              _context18.t0 = _context18['catch'](0);

                              DI.throwError('readEntityTest', _context18.t0, request);

                            case 19:
                            case 'end':
                              return _context18.stop();
                          }
                        }
                      }, null, this, [[0, 16]]);
                    };

                    DI.registerRoute({ route: 'readEntityTest', routeFunction: readEntityTest });
                    DI.registerEvent({ event: 'readEntityTest', route: 'readEntityTest' });
                    readEntityTestRequest = {
                      ids: global.serviceResponse.itemsIds
                    };
                    _context19.prev = 5;
                    _context19.next = 8;
                    return regeneratorRuntime.awrap(DI.callRoute({ route: 'readEntityTest', request: readEntityTestRequest }));

                  case 8:
                    global.serviceResponse = _context19.sent;

                    t.type(global.serviceResponse, 'object', 'Response is object');
                    t.type(global.serviceResponse.items, 'Array', 'items is array');
                    t.type(global.serviceResponse.items.length, 2, 'items length is 2');
                    t.equal(global.serviceResponse.items[0].name, 'testupdate', 'item 1 : sended name = readed name');
                    t.equal(global.serviceResponse.items[1].name, 'testupdate2', 'item 2 : sended name = readed name');
                    _context19.next = 19;
                    break;

                  case 16:
                    _context19.prev = 16;
                    _context19.t0 = _context19['catch'](5);

                    DI.throwError('DI.callRoute readEntityTest', _context19.t0, { route: 'readEntityTest', request: readEntityTestRequest });

                  case 19:

                    t.end();
                    _context19.next = 27;
                    break;

                  case 22:
                    _context19.prev = 22;
                    _context19.t1 = _context19['catch'](0);

                    DI.error({ error: _context19.t1 });
                    t.fail('FAIL readEntityTest');
                    t.end('FAIL readEntityTest');

                  case 27:
                  case 'end':
                    return _context19.stop();
                }
              }
            }, null, this, [[0, 22], [5, 16]]);
          }));

        case 21:
          debugActive = true;
          _context22.next = 24;
          return regeneratorRuntime.awrap(t.test('-> CRUD DELETE', function _callee9(t) {
            var deleteEntityTest, deleteEntityTestRequest;
            return regeneratorRuntime.async(function _callee9$(_context21) {
              while (1) {
                switch (_context21.prev = _context21.next) {
                  case 0:
                    _context21.prev = 0;

                    deleteEntityTest = function _callee8(request) {
                      var itemsIds, authorizationsData, itemsMutations;
                      return regeneratorRuntime.async(function _callee8$(_context20) {
                        while (1) {
                          switch (_context20.prev = _context20.next) {
                            case 0:
                              _context20.prev = 0;
                              itemsIds = request.ids;

                              if (!(!itemsIds || !itemsIds.length)) {
                                _context20.next = 4;
                                break;
                              }

                              throw new Error('deleteEntityTest require items ids');

                            case 4:
                              _context20.next = 6;
                              return regeneratorRuntime.awrap(DI.authenticate({ request: request }));

                            case 6:
                              authorizationsData = _context20.sent;
                              _context20.next = 9;
                              return regeneratorRuntime.awrap(DI.authorize({ context: authorizationsData, action: 'write', entity: 'entityTest', itemsIds: itemsIds }));

                            case 9:
                              _context20.next = 11;
                              return regeneratorRuntime.awrap(entityTestDI.mutationsPackage.mutate({ mutation: 'delete', itemsIds: itemsIds }));

                            case 11:
                              itemsMutations = _context20.sent;
                              _context20.next = 14;
                              return regeneratorRuntime.awrap(entityTestDI.viewsPackage.refreshItemsViews({ itemsIds: itemsIds, loadSnapshot: true, loadMutations: true, addMutations: itemsMutations }));

                            case 14:
                              DI.debug({ msg: 'deleteEntityTest', context: PACKAGE, debug: { itemsIds: itemsIds, itemsMutations: itemsMutations } });
                              return _context20.abrupt('return', { itemsIds: itemsIds });

                            case 18:
                              _context20.prev = 18;
                              _context20.t0 = _context20['catch'](0);

                              DI.throwError('deleteEntityTest', _context20.t0, request);

                            case 21:
                            case 'end':
                              return _context20.stop();
                          }
                        }
                      }, null, this, [[0, 18]]);
                    };

                    DI.registerRoute({ route: 'deleteEntityTest', routeFunction: deleteEntityTest });
                    DI.registerEvent({ event: 'deleteEntityTest', route: 'deleteEntityTest' });
                    deleteEntityTestRequest = {
                      ids: [global.serviceResponse.items[0]._id]
                    };
                    _context21.prev = 5;
                    _context21.next = 8;
                    return regeneratorRuntime.awrap(DI.callRoute({ route: 'deleteEntityTest', request: deleteEntityTestRequest }));

                  case 8:
                    global.serviceResponse = _context21.sent;

                    t.type(global.serviceResponse, 'object', 'Response is object');
                    t.type(global.serviceResponse.itemsIds, 'Array', 'items is array');
                    t.type(global.serviceResponse.itemsIds.length, 1, 'items length is 1');
                    _context21.next = 17;
                    break;

                  case 14:
                    _context21.prev = 14;
                    _context21.t0 = _context21['catch'](5);

                    DI.throwError('DI.callRoute deleteEntityTest', _context21.t0, { route: 'deleteEntityTest', request: deleteEntityTestRequest });

                  case 17:

                    t.end();
                    _context21.next = 25;
                    break;

                  case 20:
                    _context21.prev = 20;
                    _context21.t1 = _context21['catch'](0);

                    DI.error({ error: _context21.t1 });
                    t.fail('FAIL deleteEntityTest');
                    t.end('FAIL deleteEntityTest');

                  case 25:
                  case 'end':
                    return _context21.stop();
                }
              }
            }, null, this, [[0, 20], [5, 14]]);
          }));

        case 24:
        case 'end':
          return _context22.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImplc3VzLnRlc3QuZXM2Il0sIm5hbWVzIjpbImdsb2JhbCIsIl9iYWJlbFBvbHlmaWxsIiwicmVxdWlyZSIsInRocm93RXJyb3IiLCJ0IiwiUiIsInBhdGgiLCJmcyIsIlBBQ0tBR0UiLCJwcm9jZXNzIiwib24iLCJyZWFzb24iLCJwcm9taXNlIiwiY29uc29sZSIsImxvZyIsInRyYWNlIiwiZGVidWdBY3RpdmUiLCJkZWJ1Z1NhdmVUaW1lb3V0IiwiZGVidWdGaWxlIiwiam9pbiIsIl9fZGlybmFtZSIsImRlYnVnUmVnaXN0cnkiLCJzYXZlX2RlYnVnIiwiREVCVUciLCJ0eXBlIiwiZGVidWciLCJtc2ciLCJjb250ZXh0IiwicHVzaCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJ3cml0ZUZpbGUiLCJKU09OIiwic3RyaW5naWZ5IiwiTE9HIiwiQU5TSV9SRVNFVCIsIkFOU0lfQkxBQ0siLCJBTlNJX0JBQ0tHUk9VTkRfQ1lBTiIsIlNFUlZJQ0UiLCJTRVJWSUNFX05BTUUiLCJmYWtlQXV0aCIsInVzZXJJZCIsIkRJIiwiYXV0aGVudGljYXRlIiwicmVxdWVzdCIsImF1dGhvcml6ZSIsInJvdXRlIiwicmVnaXN0ZXJSb3V0ZSIsInJvdXRlRnVuY3Rpb24iLCJyb3V0ZXMiLCJjYWxsUm91dGUiLCJkZXJlZ2lzdGVyUm91dGUiLCJuYW1lIiwiZXZlbnRzIiwic2VydmljZSIsImV2ZW50IiwicGF5bG9hZCIsImVycm9yIiwiQU5TSV9SRUQiLCJvcmlnaW5hbEVycm9yIiwiaW5mbyIsIm1lc3NhZ2UiLCJnZXRBcHBUcmFjZSIsInRlc3QiLCJhdXRvZW5kIiwibWFpblRlc3QiLCJjb25maWciLCJtYWluU3RvcmFnZSIsInN0b3JhZ2VQYWNrYWdlIiwiZW50aXR5VGVzdENvbmZpZyIsInN0b3JhZ2VUeXBlIiwic3RvcmFnZUNvbmZpZyIsIm11dGF0aW9uc1BhdGgiLCJtdXRhdGlvbnNDb2xsZWN0aW9uIiwidmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnMiLCJ2YWxpZGF0aW9uU2NoZW1hIiwidmFsaWRhdGlvblR5cGUiLCJlbnRpdHlUZXN0REkiLCJtZXJnZSIsIm11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlIiwic3RvcmFnZUNvbGxlY3Rpb24iLCJ2aWV3c1N0b3JhZ2VQYWNrYWdlIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSIsIm11dGF0aW9uc1BhY2thZ2UiLCJ2aWV3c1BhY2thZ2UiLCJ2YWxpZGF0ZSIsInNlcnZpY2VSZXNwb25zZSIsInBsYW4iLCJjcmVhdGVFbnRpdHlUZXN0IiwidXVpZFY0IiwiaXRlbXMiLCJsZW5ndGgiLCJFcnJvciIsImZvckVhY2giLCJpdGVtIiwiX2lkIiwiYXV0aG9yaXphdGlvbnNEYXRhIiwiYWN0aW9uIiwiZW50aXR5IiwiaXRlbXNJZHMiLCJtYXAiLCJwcm9wIiwibXV0YXRlIiwibXV0YXRpb24iLCJpdGVtc011dGF0aW9ucyIsInJlZnJlc2hJdGVtc1ZpZXdzIiwibG9hZFNuYXBzaG90IiwibG9hZE11dGF0aW9ucyIsImFkZE11dGF0aW9ucyIsInJlZ2lzdGVyRXZlbnQiLCJjcmVhdGVFbnRpdHlUZXN0UmVxdWVzdCIsImVuZCIsImZhaWwiLCJ1cGRhdGVFbnRpdHlUZXN0IiwidXBkYXRlRW50aXR5VGVzdFJlcXVlc3QiLCJyZWFkRW50aXR5VGVzdCIsImlkcyIsImdldCIsInJlYWRFbnRpdHlUZXN0UmVxdWVzdCIsImVxdWFsIiwiZGVsZXRlRW50aXR5VGVzdCIsImRlbGV0ZUVudGl0eVRlc3RSZXF1ZXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBLElBQUksQ0FBQ0EsT0FBT0MsY0FBWixFQUE0QjtBQUMxQkMsVUFBUSxnQkFBUjtBQUNEO0FBQ0QsSUFBTUMsYUFBYUQsUUFBUSxTQUFSLEVBQW1CQyxVQUF0QztBQUNBLElBQUlDLElBQUlGLFFBQVEsS0FBUixDQUFSO0FBQ0EsSUFBSUcsSUFBSUgsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJSSxPQUFPSixRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlLLEtBQUtMLFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBTU0sVUFBVSxZQUFoQjtBQUNBQyxRQUFRQyxFQUFSLENBQVcsb0JBQVgsRUFBaUMsVUFBQ0MsTUFBRCxFQUFTQyxPQUFULEVBQXFCO0FBQ3BEQyxVQUFRQyxHQUFSLENBQVksNkJBQVosRUFBMkNGLE9BQTNDLEVBQW9ERCxNQUFwRDtBQUNBRSxVQUFRRSxLQUFSLENBQWNILE9BQWQ7QUFDRCxDQUhEO0FBSUEsSUFBSUksY0FBYyxLQUFsQjtBQUNBLElBQUlDLGdCQUFKO0FBQ0EsSUFBSUMsWUFBWVosS0FBS2EsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLG9CQUFyQixFQUEyQ1osVUFBVSxPQUFyRCxDQUFoQjtBQUNBLElBQUlhLGdCQUFnQixFQUFwQjtBQUNBLFNBQVNDLFVBQVQsR0FBdUIsQ0FFdEI7QUFDRCxJQUFJQyxRQUFRLFNBQVJBLEtBQVEsQ0FBVUMsSUFBVixFQUFnQkMsS0FBaEIsRUFBMkQ7QUFBQSxNQUFwQ0MsR0FBb0MsdUVBQTlCLFFBQThCO0FBQUEsTUFBcEJDLE9BQW9CLHVFQUFWLFFBQVU7O0FBQ3JFLE1BQUksQ0FBQ1gsV0FBTCxFQUFrQixPQUFPLElBQVA7QUFDbEJLLGdCQUFjTyxJQUFkLHFCQUNNSixJQUROLFNBQ2NHLE9BRGQsV0FDMkJELEdBRDNCLEVBQ21DRCxLQURuQztBQUdBLE1BQUlSLGdCQUFKLEVBQXNCWSxhQUFhWixnQkFBYjtBQUN0QkEscUJBQW1CYSxXQUFXLFlBQVk7QUFDeEN2QixPQUFHd0IsU0FBSCxDQUFhYixTQUFiLEVBQXdCYyxLQUFLQyxTQUFMLENBQWVaLGFBQWYsRUFBOEIsSUFBOUIsRUFBb0MsQ0FBcEMsQ0FBeEIsRUFBZ0UsTUFBaEU7QUFDRCxHQUZrQixFQUVoQixJQUZnQixDQUFuQjtBQUdELENBVEQ7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUlhLE1BQU0sU0FBTkEsR0FBTSxDQUFVVixJQUFWLEVBQWdCVixHQUFoQixFQUF5RDtBQUFBLE1BQXBDWSxHQUFvQyx1RUFBOUIsUUFBOEI7QUFBQSxNQUFwQkMsT0FBb0IsdUVBQVYsUUFBVTs7QUFDakUsTUFBTVEsYUFBYSxTQUFuQjtBQUNBLE1BQU1DLGFBQWEsVUFBbkI7QUFDQSxNQUFNQyx1QkFBdUIsVUFBN0I7QUFDQXhCLFVBQVFDLEdBQVIsT0FBZXVCLHVCQUF1QkQsVUFBdEM7QUFDQXZCLFVBQVFDLEdBQVIsY0FBdUJVLElBQXZCLFNBQStCRyxPQUEvQixXQUE0Q0QsR0FBNUMsU0FBbURTLFVBQW5EO0FBQ0FaLFFBQU1DLElBQU4sRUFBWVYsR0FBWixFQUFpQlksR0FBakIsRUFBc0JDLE9BQXRCO0FBQ0QsQ0FQRDs7QUFTQSxJQUFJVyxPQUFKO0FBQ0EsSUFBSUMsZUFBZSxhQUFuQjtBQUNBLElBQUlDLFdBQVc7QUFDYkMsVUFBUTtBQURLLENBQWY7O0FBSUEsSUFBSUM7QUFDRnZDLHdCQURFO0FBRUZ3QyxnQkFBYztBQUFBLFFBQU9DLE9BQVAsUUFBT0EsT0FBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkNBQW9CSixRQUFwQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUZaO0FBR0ZLLGFBQVc7QUFBQSxRQUFPQyxLQUFQLFNBQU9BLEtBQVA7QUFBQSxRQUFjRixPQUFkLFNBQWNBLE9BQWQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQUEyQixJQUEzQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUhUO0FBSUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FHLGlCQUFlO0FBQUEsUUFBT0QsS0FBUCxTQUFPQSxLQUFQO0FBQUEsUUFBY0UsYUFBZCxTQUFjQSxhQUFkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FBaUNWLFFBQVFXLE1BQVIsQ0FBZUgsS0FBZixJQUF3QkUsYUFBekQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FWYjtBQVdGRSxhQUFXO0FBQUEsUUFBT0osS0FBUCxTQUFPQSxLQUFQO0FBQUEsUUFBY0YsT0FBZCxTQUFjQSxPQUFkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FBMkJOLFFBQVFXLE1BQVIsQ0FBZUgsS0FBZixFQUFzQkYsT0FBdEIsQ0FBM0I7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FYVDtBQVlGTyxtQkFBaUI7QUFBQSxRQUFPTCxLQUFQLFNBQU9BLEtBQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQUFrQlIsUUFBUVcsTUFBUixDQUFlSCxLQUFmLEVBQXNCRixPQUF0QixDQUFsQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVpmLDJDQWFlO0FBQUEsTUFBT0UsS0FBUCxTQUFPQSxLQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw0Q0FBa0IsT0FBT1IsUUFBUVcsTUFBUixDQUFlSCxLQUFmLENBQXpCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBYmYseUNBY2E7QUFBQSxNQUFPTSxJQUFQLFNBQU9BLElBQVA7QUFBQSxNQUFhTixLQUFiLFNBQWFBLEtBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNiUixrQkFBUWUsTUFBUixDQUFlRCxJQUFmLElBQXVCO0FBQ3JCQSxzQkFEcUI7QUFFckJOLHdCQUZxQjtBQUdyQlEscUJBQVNmO0FBSFksV0FBdkI7O0FBRGE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FkYiwyQ0FxQmU7QUFBQSxNQUFPYSxJQUFQLFNBQU9BLElBQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDRDQUFpQixPQUFPZCxRQUFRZSxNQUFSLENBQWVFLEtBQWYsQ0FBeEI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FyQmYscUNBc0JTO0FBQUEsTUFBT0gsSUFBUCxTQUFPQSxJQUFQO0FBQUEsTUFBYUksT0FBYixTQUFhQSxPQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0F0QlQsK0JBeUJHO0FBQUEsTUFBTzdCLE9BQVAsVUFBT0EsT0FBUDtBQUFBLE1BQWdCRCxHQUFoQixVQUFnQkEsR0FBaEI7QUFBQSxNQUFxQlosSUFBckIsVUFBcUJBLEdBQXJCO0FBQUEsTUFBMEJVLElBQTFCLFVBQTBCQSxJQUExQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkNBQW9DVSxJQUFJVixJQUFKLEVBQVVWLElBQVYsRUFBZVksR0FBZixFQUFvQkMsT0FBcEIsQ0FBcEM7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0F6QkgsaUNBMEJLO0FBQUEsTUFBT0EsT0FBUCxVQUFPQSxPQUFQO0FBQUEsTUFBZ0JELEdBQWhCLFVBQWdCQSxHQUFoQjtBQUFBLE1BQXFCRCxNQUFyQixVQUFxQkEsS0FBckI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQUFnQ0YsTUFBTSxPQUFOLEVBQWVFLE1BQWYsRUFBc0JDLEdBQXRCLEVBQTJCQyxPQUEzQixDQUFoQzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQTFCTCxpQ0EyQks7QUFBQSxNQUFPOEIsTUFBUCxVQUFPQSxLQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNDdEIsb0JBREQsR0FDYyxTQURkO0FBRUN1QixrQkFGRCxHQUVZLFVBRlo7O0FBR0w3QyxrQkFBUUMsR0FBUixDQUFlNEMsUUFBZix3QkFBMEN2QixVQUExQztBQUNBdEIsa0JBQVFDLEdBQVIsQ0FBWTJDLE9BQU1FLGFBQU4sSUFBdUJGLE1BQW5DO0FBQ0E1QyxrQkFBUUMsR0FBUixxQkFBNkIyQyxPQUFNRyxJQUFOLElBQWNILE9BQU1HLElBQU4sQ0FBV0MsT0FBekIsR0FBbUNKLE9BQU1HLElBQU4sQ0FBV0MsT0FBOUMsR0FBd0QsUUFBckY7QUFDQWhELGtCQUFRQyxHQUFSLENBQWU0QyxRQUFmLG1CQUFxQ3ZCLFVBQXJDO0FBQ0EsY0FBSXNCLE9BQU1LLFdBQVYsRUFBc0JqRCxRQUFRQyxHQUFSLENBQVlrQixLQUFLQyxTQUFMLENBQWV3QixPQUFNSyxXQUFOLEVBQWYsRUFBb0MsSUFBcEMsRUFBMEMsQ0FBMUMsQ0FBWjtBQUN0QjtBQUNBNUIsY0FBSSxPQUFKLEVBQWF1QixNQUFiLEVBQW9CLFlBQXBCLEVBQWtDLFdBQWxDOztBQVRLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBM0JMLE9BQUo7O0FBd0NBckQsRUFBRTJELElBQUYsQ0FBTyw0QkFBUCxFQUFxQztBQUNuQ0MsV0FBUztBQUQwQixDQUFyQyxFQUVHLFNBQWVDLFFBQWYsQ0FBeUI3RCxDQUF6QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRGtDLG9CQUFVO0FBQ1JXLG9CQUFRLEVBREE7QUFFUmlCLG9CQUFRO0FBQ05DLDJCQUFhO0FBQ1gzQyxzQkFBTSxVQURLO0FBRVgwQyx3QkFBUTtBQUNONUQsd0JBQU1BLEtBQUthLElBQUwsQ0FBVUMsU0FBVixFQUFxQixxQkFBckI7QUFEQTtBQUZHO0FBRFAsYUFGQTtBQVVSaUMsb0JBQVE7QUFWQSxXQUFWOztBQWFJZSx3QkFkSCxHQWNvQmxFLFFBQVEsV0FBUixDQWRwQjtBQWdCR21FLDBCQWhCSCxHQWdCc0I7QUFDckJDLHlCQUFhO0FBQUEscUJBQU1oQyxRQUFRNEIsTUFBUixDQUFlQyxXQUFmLENBQTJCM0MsSUFBakM7QUFBQSxhQURRO0FBRXJCK0MsMkJBQWU7QUFBQSxxQkFBTWpDLFFBQVE0QixNQUFSLENBQWVDLFdBQWYsQ0FBMkJELE1BQWpDO0FBQUEsYUFGTTtBQUdyQk0sMkJBQWU7QUFBQSxxQkFBTWxFLEtBQUthLElBQUwsQ0FBVUMsU0FBVixFQUFxQixtQ0FBckIsQ0FBTjtBQUFBLGFBSE07QUFJckJxRCxpQ0FBcUI7QUFBQSxxQkFBTW5FLEtBQUthLElBQUwsQ0FBVUMsU0FBVixFQUFxQixtQ0FBckIsQ0FBTjtBQUFBLGFBSkE7QUFLckJzRCx3Q0FBNEI7QUFBQSxxQkFBTSxFQUFOO0FBQUEsYUFMUDtBQU1yQkMsOEJBQWtCLDRCQUFNO0FBQ3RCLGtCQUFJO0FBQ0YsdUJBQU96RSxRQUFRLDhDQUFSLENBQVA7QUFDRCxlQUZELENBRUUsT0FBT3VELEtBQVAsRUFBYztBQUNkZixtQkFBR3ZDLFVBQUgsQ0FBYyxzQ0FBZCxFQUFzRHNELEtBQXREO0FBQ0Q7QUFDRixhQVpvQjtBQWFyQm1CLDRCQUFnQjtBQUFBLHFCQUFNLFlBQU47QUFBQTtBQWJLLFdBaEJ0QjtBQStCR0Msc0JBL0JILEdBK0JrQnhFLEVBQUV5RSxLQUFGLENBQVE7QUFDekJDLHFDQUF5QlgsZUFBZS9ELEVBQUV5RSxLQUFGLENBQVFULGdCQUFSLEVBQTBCO0FBQ2hFVyxpQ0FBbUI7QUFBQSx1QkFBTSxxQkFBTjtBQUFBO0FBRDZDLGFBQTFCLENBQWYsRUFFckJ0QyxFQUZxQixDQURBO0FBSXpCdUMsaUNBQXFCYixlQUFlL0QsRUFBRXlFLEtBQUYsQ0FBUVQsZ0JBQVIsRUFBMEI7QUFDNURXLGlDQUFtQjtBQUFBLHVCQUFNLHFCQUFOO0FBQUE7QUFEeUMsYUFBMUIsQ0FBZixFQUVqQnRDLEVBRmlCLENBSkk7QUFPekJ2Qyx3QkFBWXVDLEdBQUd2QyxVQVBVO0FBUXpCK0UsMENBQThCZCxlQUFlL0QsRUFBRXlFLEtBQUYsQ0FBUVQsZ0JBQVIsRUFBMEI7QUFDckVXLGlDQUFtQjtBQUFBLHVCQUFNLDhCQUFOO0FBQUE7QUFEa0QsYUFBMUIsQ0FBZixFQUUxQnRDLEVBRjBCO0FBUkwsV0FBUixFQVdoQkEsRUFYZ0IsQ0EvQmxCO0FBQUE7QUFBQSwwQ0EyQ3FDeEMsUUFBUSxrQkFBUixFQUE0Qm1FLGdCQUE1QixFQUE4Q1EsWUFBOUMsQ0EzQ3JDOztBQUFBO0FBMkNEQSx1QkFBYU0sZ0JBM0NaO0FBQUE7QUFBQSwwQ0E0Q2lDakYsUUFBUSxjQUFSLEVBQXdCbUUsZ0JBQXhCLEVBQTBDUSxZQUExQyxDQTVDakM7O0FBQUE7QUE0Q0RBLHVCQUFhTyxZQTVDWjtBQUFBO0FBQUEsMENBNkM2QmxGLFFBQVEsWUFBUixFQUFzQm1FLGdCQUF0QixFQUF3Q1EsWUFBeEMsQ0E3QzdCOztBQUFBO0FBNkNEQSx1QkFBYVEsUUE3Q1o7OztBQStDRHJGLGlCQUFPc0YsZUFBUCxHQUF5QixFQUF6QjtBQUNBbEYsWUFBRW1GLElBQUYsQ0FBTyxDQUFQO0FBaERDO0FBQUEsMENBaURLbkYsRUFBRTJELElBQUYsQ0FBTyxnQkFBUCxFQUF5QixrQkFBZ0IzRCxDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFFdkJvRixvQ0FGdUIsR0FFSixrQkFBZ0I1QyxPQUFoQjtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUViNkMsOENBRmEsR0FFSnZGLFFBQVEsU0FBUixDQUZJO0FBR2Z3RixnREFBUTlDLFFBQVE4QyxLQUhEOztBQUFBLDhDQUlmLENBQUNBLEtBQUQsSUFBVSxDQUFDQSxNQUFNQyxNQUpGO0FBQUE7QUFBQTtBQUFBOztBQUFBLDhDQUlnQixJQUFJQyxLQUFKLENBQVUsZ0NBQVYsQ0FKaEI7O0FBQUE7QUFLbkJGLDhDQUFNRyxPQUFOLENBQWMsVUFBQ0MsSUFBRCxFQUFVO0FBQUUsOENBQUksQ0FBQ0EsS0FBS0MsR0FBVixFQUFjRCxLQUFLQyxHQUFMLEdBQVdOLFFBQVg7QUFBcUIseUNBQTdELEVBTG1CLENBSzRDO0FBTDVDO0FBQUEsd0VBTWJaLGFBQWFRLFFBQWIsQ0FBc0IsRUFBQ0ssWUFBRCxFQUF0QixDQU5hOztBQUFBO0FBQUE7QUFBQSx3RUFPWWhELEdBQUdDLFlBQUgsQ0FBZ0IsRUFBQ0MsZ0JBQUQsRUFBaEIsQ0FQWjs7QUFBQTtBQU9mb0QsMERBUGU7QUFBQTtBQUFBLHdFQVFidEQsR0FBR0csU0FBSCxDQUFhLEVBQUNsQixTQUFTcUUsa0JBQVYsRUFBOEJDLFFBQVEsT0FBdEMsRUFBK0NDLFFBQVEsWUFBdkQsRUFBcUVSLFlBQXJFLEVBQWIsQ0FSYTs7QUFBQTtBQVNmUyxtREFBVzlGLEVBQUUrRixHQUFGLENBQU0vRixFQUFFZ0csSUFBRixDQUFPLEtBQVAsQ0FBTixFQUFxQlgsS0FBckIsQ0FUSTtBQUFBO0FBQUEsd0VBVVFiLGFBQWFNLGdCQUFiLENBQThCbUIsTUFBOUIsQ0FBcUMsRUFBQ0MsVUFBVSxRQUFYLEVBQXFCSixrQkFBckIsRUFBK0JULFlBQS9CLEVBQXJDLENBVlI7O0FBQUE7QUFVZmMsc0RBVmU7O0FBV25COUQsMkNBQUdqQixLQUFILENBQVMsRUFBQ0MsS0FBSyxrQkFBTixFQUEwQkMsU0FBU25CLE9BQW5DLEVBQTRDaUIsT0FBTyxFQUFDK0UsOEJBQUQsRUFBbkQsRUFBVDtBQVhtQjtBQUFBLHdFQVliM0IsYUFBYU8sWUFBYixDQUEwQnFCLGlCQUExQixDQUE0QyxFQUFDTixrQkFBRCxFQUFXTyxjQUFjLEtBQXpCLEVBQWdDQyxlQUFlLEtBQS9DLEVBQXNEQyxjQUFjSixjQUFwRSxFQUE1QyxDQVphOztBQUFBO0FBQUE7QUFBQSw2Q0FhWixFQUFDTCxrQkFBRDtBQWJZOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFnQm5CekQsaUNBQUd2QyxVQUFILENBQWMsa0JBQWQsaUJBQXlDeUMsT0FBekM7O0FBaEJtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFGSTs7QUFxQjNCRix1QkFBR0ssYUFBSCxDQUFpQixFQUFDRCxPQUFPLGtCQUFSLEVBQTRCRSxlQUFld0MsZ0JBQTNDLEVBQWpCO0FBQ0E5Qyx1QkFBR21FLGFBQUgsQ0FBaUIsRUFBQ3RELE9BQU8sa0JBQVIsRUFBNEJULE9BQU8sa0JBQW5DLEVBQWpCO0FBQ0lnRSwyQ0F2QnVCLEdBdUJHO0FBQzVCcEIsNkJBQU8sQ0FBQyxFQUFDdEMsTUFBTSxNQUFQLEVBQUQsRUFBaUIsRUFBQ0EsTUFBTSxPQUFQLEVBQWpCO0FBRHFCLHFCQXZCSDtBQUFBO0FBQUE7QUFBQSxvREEyQk1WLEdBQUdRLFNBQUgsQ0FBYSxFQUFDSixPQUFPLGtCQUFSLEVBQTRCRixTQUFTa0UsdUJBQXJDLEVBQWIsQ0EzQk47O0FBQUE7QUEyQnpCOUcsMkJBQU9zRixlQTNCa0I7O0FBNEJ6QmxGLHNCQUFFb0IsSUFBRixDQUFPeEIsT0FBT3NGLGVBQWQsRUFBK0IsUUFBL0IsRUFBeUMsb0JBQXpDO0FBQ0FsRixzQkFBRW9CLElBQUYsQ0FBT3hCLE9BQU9zRixlQUFQLENBQXVCYSxRQUE5QixFQUF3QyxPQUF4QyxFQUFpRCxtQkFBakQ7QUFDQS9GLHNCQUFFb0IsSUFBRixDQUFPeEIsT0FBT3NGLGVBQVAsQ0FBdUJhLFFBQXZCLENBQWdDUixNQUF2QyxFQUErQyxDQUEvQyxFQUFrRCxzQkFBbEQ7QUE5QnlCO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQWdDekJqRCx1QkFBR3ZDLFVBQUgsQ0FBYywrQkFBZCxpQkFBc0QsRUFBQzJDLE9BQU8sa0JBQVIsRUFBNEJGLFNBQVNrRSx1QkFBckMsRUFBdEQ7O0FBaEN5Qjs7QUFtQzNCMUcsc0JBQUUyRyxHQUFGO0FBbkMyQjtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFxQzNCckUsdUJBQUdlLEtBQUgsQ0FBUyxFQUFDQSxvQkFBRCxFQUFUO0FBQ0FyRCxzQkFBRTRHLElBQUYsQ0FBTyx1QkFBUDtBQUNBNUcsc0JBQUUyRyxHQUFGLENBQU0sdUJBQU47O0FBdkMyQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUF6QixDQWpETDs7QUFBQTtBQUFBO0FBQUEsMENBMkZLM0csRUFBRTJELElBQUYsQ0FBTyxnQkFBUCxFQUF5QixrQkFBZ0IzRCxDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFFdkI2RyxvQ0FGdUIsR0FFSixrQkFBZ0JyRSxPQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVmOEMsbUNBRmUsR0FFUDlDLFFBQVE4QyxLQUZEOztBQUFBLG9DQUdmLENBQUNBLEtBQUQsSUFBVSxDQUFDQSxNQUFNQyxNQUhGO0FBQUE7QUFBQTtBQUFBOztBQUFBLG9DQUdnQixJQUFJQyxLQUFKLENBQVUsZ0NBQVYsQ0FIaEI7O0FBQUE7QUFJbkJGLG9DQUFNRyxPQUFOLENBQWMsVUFBQ0MsSUFBRCxFQUFVO0FBQUUsb0NBQUksQ0FBQ0EsS0FBS0MsR0FBVixFQUFlLE1BQU0sSUFBSUgsS0FBSixDQUFVLDhDQUFWLENBQU47QUFBaUUsK0JBQTFHLEVBSm1CLENBSXlGO0FBSnpGO0FBQUEsOERBS2JmLGFBQWFRLFFBQWIsQ0FBc0IsRUFBQ0ssWUFBRCxFQUF0QixDQUxhOztBQUFBO0FBQUE7QUFBQSw4REFNWWhELEdBQUdDLFlBQUgsQ0FBZ0IsRUFBQ0MsZ0JBQUQsRUFBaEIsQ0FOWjs7QUFBQTtBQU1mb0QsZ0RBTmU7QUFBQTtBQUFBLDhEQU9idEQsR0FBR0csU0FBSCxDQUFhLEVBQUNsQixTQUFTcUUsa0JBQVYsRUFBOEJDLFFBQVEsT0FBdEMsRUFBK0NDLFFBQVEsWUFBdkQsRUFBcUVSLFlBQXJFLEVBQWIsQ0FQYTs7QUFBQTtBQVFmUyxzQ0FSZSxHQVFKOUYsRUFBRStGLEdBQUYsQ0FBTS9GLEVBQUVnRyxJQUFGLENBQU8sS0FBUCxDQUFOLEVBQXFCWCxLQUFyQixDQVJJO0FBQUE7QUFBQSw4REFTUWIsYUFBYU0sZ0JBQWIsQ0FBOEJtQixNQUE5QixDQUFxQyxFQUFDQyxVQUFVLFFBQVgsRUFBcUJKLGtCQUFyQixFQUErQlQsWUFBL0IsRUFBckMsQ0FUUjs7QUFBQTtBQVNmYyw0Q0FUZTs7QUFVbkI5RCxpQ0FBR2pCLEtBQUgsQ0FBUyxFQUFDQyxLQUFLLGtCQUFOLEVBQTBCQyxTQUFTbkIsT0FBbkMsRUFBNENpQixPQUFPLEVBQUMrRSw4QkFBRCxFQUFuRCxFQUFUO0FBVm1CO0FBQUEsOERBV2IzQixhQUFhTyxZQUFiLENBQTBCcUIsaUJBQTFCLENBQTRDLEVBQUNOLGtCQUFELEVBQVdPLGNBQWMsSUFBekIsRUFBK0JDLGVBQWUsSUFBOUMsRUFBb0RDLGNBQWNKLGNBQWxFLEVBQTVDLENBWGE7O0FBQUE7QUFBQSxpRUFZWixFQUFDTCxrQkFBRCxFQVpZOztBQUFBO0FBQUE7QUFBQTs7QUFlbkJ6RCxpQ0FBR3ZDLFVBQUgsQ0FBYyxrQkFBZCxpQkFBeUN5QyxPQUF6Qzs7QUFmbUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBRkk7O0FBb0IzQkYsdUJBQUdLLGFBQUgsQ0FBaUIsRUFBQ0QsT0FBTyxrQkFBUixFQUE0QkUsZUFBZWlFLGdCQUEzQyxFQUFqQjtBQUNBdkUsdUJBQUdtRSxhQUFILENBQWlCLEVBQUN0RCxPQUFPLGtCQUFSLEVBQTRCVCxPQUFPLGtCQUFuQyxFQUFqQjtBQUNJb0UsMkNBdEJ1QixHQXNCRztBQUM1QnhCLDZCQUFPLENBQUMsRUFBQ3RDLE1BQU0sWUFBUCxFQUFxQjJDLEtBQUsvRixPQUFPc0YsZUFBUCxDQUF1QmEsUUFBdkIsQ0FBZ0MsQ0FBaEMsQ0FBMUIsRUFBRCxFQUFpRSxFQUFDL0MsTUFBTSxhQUFQLEVBQXNCMkMsS0FBSy9GLE9BQU9zRixlQUFQLENBQXVCYSxRQUF2QixDQUFnQyxDQUFoQyxDQUEzQixFQUFqRTtBQURxQixxQkF0Qkg7QUFBQTtBQUFBO0FBQUEsb0RBMEJNekQsR0FBR1EsU0FBSCxDQUFhLEVBQUNKLE9BQU8sa0JBQVIsRUFBNEJGLFNBQVNzRSx1QkFBckMsRUFBYixDQTFCTjs7QUFBQTtBQTBCekJsSCwyQkFBT3NGLGVBMUJrQjs7QUEyQnpCbEYsc0JBQUVvQixJQUFGLENBQU94QixPQUFPc0YsZUFBZCxFQUErQixRQUEvQixFQUF5QyxvQkFBekM7QUFDQWxGLHNCQUFFb0IsSUFBRixDQUFPeEIsT0FBT3NGLGVBQVAsQ0FBdUJhLFFBQTlCLEVBQXdDLE9BQXhDLEVBQWlELG1CQUFqRDtBQUNBL0Ysc0JBQUVvQixJQUFGLENBQU94QixPQUFPc0YsZUFBUCxDQUF1QmEsUUFBdkIsQ0FBZ0NSLE1BQXZDLEVBQStDLENBQS9DLEVBQWtELHNCQUFsRDtBQTdCeUI7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBK0J6QmpELHVCQUFHdkMsVUFBSCxDQUFjLCtCQUFkLGlCQUFzRCxFQUFDMkMsT0FBTyxrQkFBUixFQUE0QkYsU0FBU3NFLHVCQUFyQyxFQUF0RDs7QUEvQnlCOztBQWtDM0I5RyxzQkFBRTJHLEdBQUY7QUFsQzJCO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQW9DM0JyRSx1QkFBR2UsS0FBSCxDQUFTLEVBQUNBLG9CQUFELEVBQVQ7QUFDQXJELHNCQUFFNEcsSUFBRixDQUFPLHVCQUFQO0FBQ0E1RyxzQkFBRTJHLEdBQUYsQ0FBTSx1QkFBTjs7QUF0QzJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXpCLENBM0ZMOztBQUFBO0FBQUE7QUFBQSwwQ0FvSUszRyxFQUFFMkQsSUFBRixDQUFPLGNBQVAsRUFBdUIsa0JBQWdCM0QsQ0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBRXJCK0csa0NBRnFCLEdBRUosa0JBQWdCdkUsT0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFYnVELHNDQUZhLEdBRUZ2RCxRQUFRd0UsR0FGTjs7QUFBQSxvQ0FHYixDQUFDakIsUUFBRCxJQUFhLENBQUNBLFNBQVNSLE1BSFY7QUFBQTtBQUFBO0FBQUE7O0FBQUEsb0NBR3dCLElBQUlDLEtBQUosQ0FBVSxrQ0FBVixDQUh4Qjs7QUFBQTtBQUFBO0FBQUEsOERBSWNsRCxHQUFHQyxZQUFILENBQWdCLEVBQUNDLGdCQUFELEVBQWhCLENBSmQ7O0FBQUE7QUFJYm9ELGdEQUphO0FBQUE7QUFBQSw4REFLWHRELEdBQUdHLFNBQUgsQ0FBYSxFQUFDbEIsU0FBU3FFLGtCQUFWLEVBQThCQyxRQUFRLE1BQXRDLEVBQThDQyxRQUFRLFlBQXRELEVBQW9FQyxrQkFBcEUsRUFBYixDQUxXOztBQUFBO0FBQUE7QUFBQSw4REFNQ3RCLGFBQWFPLFlBQWIsQ0FBMEJpQyxHQUExQixDQUE4QixFQUFDRCxLQUFLakIsUUFBTixFQUE5QixDQU5EOztBQUFBO0FBTWJULG1DQU5hOztBQU9qQmhELGlDQUFHakIsS0FBSCxDQUFTLEVBQUNDLEtBQUssZ0JBQU4sRUFBd0JDLFNBQVNuQixPQUFqQyxFQUEwQ2lCLE9BQU8sRUFBQzBFLGtCQUFELEVBQVdILHNDQUFYLEVBQStCTixZQUEvQixFQUFqRCxFQUFUO0FBUGlCLGlFQVFWLEVBQUNBLFlBQUQsRUFSVTs7QUFBQTtBQUFBO0FBQUE7O0FBV2pCaEQsaUNBQUd2QyxVQUFILENBQWMsZ0JBQWQsaUJBQXVDeUMsT0FBdkM7O0FBWGlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUZJOztBQWdCekJGLHVCQUFHSyxhQUFILENBQWlCLEVBQUNELE9BQU8sZ0JBQVIsRUFBMEJFLGVBQWVtRSxjQUF6QyxFQUFqQjtBQUNBekUsdUJBQUdtRSxhQUFILENBQWlCLEVBQUN0RCxPQUFPLGdCQUFSLEVBQTBCVCxPQUFPLGdCQUFqQyxFQUFqQjtBQUNJd0UseUNBbEJxQixHQWtCRztBQUMxQkYsMkJBQUtwSCxPQUFPc0YsZUFBUCxDQUF1QmE7QUFERixxQkFsQkg7QUFBQTtBQUFBO0FBQUEsb0RBc0JRekQsR0FBR1EsU0FBSCxDQUFhLEVBQUNKLE9BQU8sZ0JBQVIsRUFBMEJGLFNBQVMwRSxxQkFBbkMsRUFBYixDQXRCUjs7QUFBQTtBQXNCdkJ0SCwyQkFBT3NGLGVBdEJnQjs7QUF1QnZCbEYsc0JBQUVvQixJQUFGLENBQU94QixPQUFPc0YsZUFBZCxFQUErQixRQUEvQixFQUF5QyxvQkFBekM7QUFDQWxGLHNCQUFFb0IsSUFBRixDQUFPeEIsT0FBT3NGLGVBQVAsQ0FBdUJJLEtBQTlCLEVBQXFDLE9BQXJDLEVBQThDLGdCQUE5QztBQUNBdEYsc0JBQUVvQixJQUFGLENBQU94QixPQUFPc0YsZUFBUCxDQUF1QkksS0FBdkIsQ0FBNkJDLE1BQXBDLEVBQTRDLENBQTVDLEVBQStDLG1CQUEvQztBQUNBdkYsc0JBQUVtSCxLQUFGLENBQVF2SCxPQUFPc0YsZUFBUCxDQUF1QkksS0FBdkIsQ0FBNkIsQ0FBN0IsRUFBZ0N0QyxJQUF4QyxFQUE4QyxZQUE5QyxFQUE0RCxvQ0FBNUQ7QUFDQWhELHNCQUFFbUgsS0FBRixDQUFRdkgsT0FBT3NGLGVBQVAsQ0FBdUJJLEtBQXZCLENBQTZCLENBQTdCLEVBQWdDdEMsSUFBeEMsRUFBOEMsYUFBOUMsRUFBNkQsb0NBQTdEO0FBM0J1QjtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUE2QnZCVix1QkFBR3ZDLFVBQUgsQ0FBYyw2QkFBZCxpQkFBb0QsRUFBQzJDLE9BQU8sZ0JBQVIsRUFBMEJGLFNBQVMwRSxxQkFBbkMsRUFBcEQ7O0FBN0J1Qjs7QUFnQ3pCbEgsc0JBQUUyRyxHQUFGO0FBaEN5QjtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFrQ3pCckUsdUJBQUdlLEtBQUgsQ0FBUyxFQUFDQSxvQkFBRCxFQUFUO0FBQ0FyRCxzQkFBRTRHLElBQUYsQ0FBTyxxQkFBUDtBQUNBNUcsc0JBQUUyRyxHQUFGLENBQU0scUJBQU47O0FBcEN5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUF2QixDQXBJTDs7QUFBQTtBQTJLRC9GLHdCQUFjLElBQWQ7QUEzS0M7QUFBQSwwQ0E0S0taLEVBQUUyRCxJQUFGLENBQU8sZ0JBQVAsRUFBeUIsa0JBQWdCM0QsQ0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBRXZCb0gsb0NBRnVCLEdBRUosa0JBQWdCNUUsT0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFZnVELHNDQUZlLEdBRUp2RCxRQUFRd0UsR0FGSjs7QUFBQSxvQ0FHZixDQUFDakIsUUFBRCxJQUFhLENBQUNBLFNBQVNSLE1BSFI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsb0NBR3NCLElBQUlDLEtBQUosQ0FBVSxvQ0FBVixDQUh0Qjs7QUFBQTtBQUFBO0FBQUEsOERBSVlsRCxHQUFHQyxZQUFILENBQWdCLEVBQUNDLGdCQUFELEVBQWhCLENBSlo7O0FBQUE7QUFJZm9ELGdEQUplO0FBQUE7QUFBQSw4REFLYnRELEdBQUdHLFNBQUgsQ0FBYSxFQUFDbEIsU0FBU3FFLGtCQUFWLEVBQThCQyxRQUFRLE9BQXRDLEVBQStDQyxRQUFRLFlBQXZELEVBQXFFQyxrQkFBckUsRUFBYixDQUxhOztBQUFBO0FBQUE7QUFBQSw4REFNUXRCLGFBQWFNLGdCQUFiLENBQThCbUIsTUFBOUIsQ0FBcUMsRUFBQ0MsVUFBVSxRQUFYLEVBQXFCSixrQkFBckIsRUFBckMsQ0FOUjs7QUFBQTtBQU1mSyw0Q0FOZTtBQUFBO0FBQUEsOERBT2IzQixhQUFhTyxZQUFiLENBQTBCcUIsaUJBQTFCLENBQTRDLEVBQUNOLGtCQUFELEVBQVdPLGNBQWMsSUFBekIsRUFBK0JDLGVBQWUsSUFBOUMsRUFBb0RDLGNBQWNKLGNBQWxFLEVBQTVDLENBUGE7O0FBQUE7QUFRbkI5RCxpQ0FBR2pCLEtBQUgsQ0FBUyxFQUFDQyxLQUFLLGtCQUFOLEVBQTBCQyxTQUFTbkIsT0FBbkMsRUFBNENpQixPQUFPLEVBQUMwRSxrQkFBRCxFQUFXSyw4QkFBWCxFQUFuRCxFQUFUO0FBUm1CLGlFQVNaLEVBQUNMLGtCQUFELEVBVFk7O0FBQUE7QUFBQTtBQUFBOztBQVluQnpELGlDQUFHdkMsVUFBSCxDQUFjLGtCQUFkLGlCQUF5Q3lDLE9BQXpDOztBQVptQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFGSTs7QUFpQjNCRix1QkFBR0ssYUFBSCxDQUFpQixFQUFDRCxPQUFPLGtCQUFSLEVBQTRCRSxlQUFld0UsZ0JBQTNDLEVBQWpCO0FBQ0E5RSx1QkFBR21FLGFBQUgsQ0FBaUIsRUFBQ3RELE9BQU8sa0JBQVIsRUFBNEJULE9BQU8sa0JBQW5DLEVBQWpCO0FBQ0kyRSwyQ0FuQnVCLEdBbUJHO0FBQzVCTCwyQkFBSyxDQUFDcEgsT0FBT3NGLGVBQVAsQ0FBdUJJLEtBQXZCLENBQTZCLENBQTdCLEVBQWdDSyxHQUFqQztBQUR1QixxQkFuQkg7QUFBQTtBQUFBO0FBQUEsb0RBdUJNckQsR0FBR1EsU0FBSCxDQUFhLEVBQUNKLE9BQU8sa0JBQVIsRUFBNEJGLFNBQVM2RSx1QkFBckMsRUFBYixDQXZCTjs7QUFBQTtBQXVCekJ6SCwyQkFBT3NGLGVBdkJrQjs7QUF3QnpCbEYsc0JBQUVvQixJQUFGLENBQU94QixPQUFPc0YsZUFBZCxFQUErQixRQUEvQixFQUF5QyxvQkFBekM7QUFDQWxGLHNCQUFFb0IsSUFBRixDQUFPeEIsT0FBT3NGLGVBQVAsQ0FBdUJhLFFBQTlCLEVBQXdDLE9BQXhDLEVBQWlELGdCQUFqRDtBQUNBL0Ysc0JBQUVvQixJQUFGLENBQU94QixPQUFPc0YsZUFBUCxDQUF1QmEsUUFBdkIsQ0FBZ0NSLE1BQXZDLEVBQStDLENBQS9DLEVBQWtELG1CQUFsRDtBQTFCeUI7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBNEJ6QmpELHVCQUFHdkMsVUFBSCxDQUFjLCtCQUFkLGlCQUFzRCxFQUFDMkMsT0FBTyxrQkFBUixFQUE0QkYsU0FBUzZFLHVCQUFyQyxFQUF0RDs7QUE1QnlCOztBQStCM0JySCxzQkFBRTJHLEdBQUY7QUEvQjJCO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQWlDM0JyRSx1QkFBR2UsS0FBSCxDQUFTLEVBQUNBLG9CQUFELEVBQVQ7QUFDQXJELHNCQUFFNEcsSUFBRixDQUFPLHVCQUFQO0FBQ0E1RyxzQkFBRTJHLEdBQUYsQ0FBTSx1QkFBTjs7QUFuQzJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXpCLENBNUtMOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgiLCJmaWxlIjoiamVzdXMudGVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmlmICghZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKSB7XG4gIHJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJylcbn1cbmNvbnN0IHRocm93RXJyb3IgPSByZXF1aXJlKCcuL2Vycm9yJykudGhyb3dFcnJvclxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgUEFDS0FHRSA9ICdqZXN1cy50ZXN0J1xucHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgKHJlYXNvbiwgcHJvbWlzZSkgPT4ge1xuICBjb25zb2xlLmxvZygndW5oYW5kbGVkUmVqZWN0aW9uIFJlYXNvbjogJywgcHJvbWlzZSwgcmVhc29uKVxuICBjb25zb2xlLnRyYWNlKHByb21pc2UpXG59KVxudmFyIGRlYnVnQWN0aXZlID0gZmFsc2VcbnZhciBkZWJ1Z1NhdmVUaW1lb3V0XG52YXIgZGVidWdGaWxlID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3Rlc3RNYXRlcmlhbC9kZWJ1ZycsIFBBQ0tBR0UgKyAnLmpzb24nKVxudmFyIGRlYnVnUmVnaXN0cnkgPSBbXVxuZnVuY3Rpb24gc2F2ZV9kZWJ1ZyAoKSB7XG5cbn1cbnZhciBERUJVRyA9IGZ1bmN0aW9uICh0eXBlLCBkZWJ1ZywgbXNnID0gJ3Vua25vdycsIGNvbnRleHQgPSAndW5rbm93Jykge1xuICBpZiAoIWRlYnVnQWN0aXZlKSByZXR1cm4gbnVsbFxuICBkZWJ1Z1JlZ2lzdHJ5LnB1c2goe1xuICAgIFtgJHt0eXBlfSAke2NvbnRleHR9ID4gJHttc2d9YF06IGRlYnVnXG4gIH0pXG4gIGlmIChkZWJ1Z1NhdmVUaW1lb3V0KSBjbGVhclRpbWVvdXQoZGVidWdTYXZlVGltZW91dClcbiAgZGVidWdTYXZlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGZzLndyaXRlRmlsZShkZWJ1Z0ZpbGUsIEpTT04uc3RyaW5naWZ5KGRlYnVnUmVnaXN0cnksIG51bGwsIDQpLCAndXRmOCcpXG4gIH0sIDEwMDApXG59XG4vLyB2YXIgREVCVUcgPSBmdW5jdGlvbiAodHlwZSwgZGVidWcsIG1zZyA9ICd1bmtub3cnLCBjb250ZXh0ID0gJ3Vua25vdycpIHtcbi8vICAgaWYgKCFkZWJ1Z0FjdGl2ZSkgcmV0dXJuIG51bGxcbi8vICAgY29uc3QgQU5TSV9SRVNFVCA9ICdcXHUwMDFCWzBtJ1xuLy8gICBjb25zdCBBTlNJX0JMQUNLID0gJ1xcdTAwMUJbMzBtJ1xuLy8gICBjb25zdCBBTlNJX1JFRCA9ICdcXHUwMDFCWzMxbSdcbi8vICAgY29uc3QgQU5TSV9HUkVFTiA9ICdcXHUwMDFCWzMybSdcbi8vICAgY29uc3QgQU5TSV9ZRUxMT1cgPSAnXFx1MDAxQlszM20nXG4vLyAgIGNvbnN0IEFOU0lfQkxVRSA9ICdcXHUwMDFCWzM0bSdcbi8vICAgY29uc3QgQU5TSV9QVVJQTEUgPSAnXFx1MDAxQlszNW0nXG4vLyAgIGNvbnN0IEFOU0lfQ1lBTiA9ICdcXHUwMDFCWzM2bSdcbi8vICAgY29uc3QgQU5TSV9XSElURSA9ICdcXHUwMDFCWzM3bSdcbi8vICAgaWYgKHR5cGUgPT09ICdFUlJPUicpIGNvbnNvbGUubG9nKGAke0FOU0lfUkVEfWApXG4vLyAgIGlmICh0eXBlID09PSAnV0FSTklORycpIGNvbnNvbGUubG9nKGAke0FOU0lfWUVMTE9XfWApXG4vLyAgIGlmICh0eXBlID09PSAnTE9HJykgY29uc29sZS5sb2coYCR7QU5TSV9HUkVFTn1gKVxuLy8gICBpZiAodHlwZSA9PT0gJ0RFQlVHJykgY29uc29sZS5sb2coYCR7QU5TSV9DWUFOfWApXG4vLyAgIGNvbnNvbGUubG9nKGAke3R5cGV9ICR7Y29udGV4dH0gPiAke21zZ30gJHtBTlNJX1JFU0VUfWApXG4vLyAgIGNvbnNvbGUubG9nKGRlYnVnKVxuLy8gICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpLnN1YnN0cmluZygwLCAyNTApKVxuLy8gfVxudmFyIExPRyA9IGZ1bmN0aW9uICh0eXBlLCBsb2csIG1zZyA9ICd1bmtub3cnLCBjb250ZXh0ID0gJ3Vua25vdycpIHtcbiAgY29uc3QgQU5TSV9SRVNFVCA9ICdcXHUwMDFCWzBtJ1xuICBjb25zdCBBTlNJX0JMQUNLID0gJ1xcdTAwMUJbMzBtJ1xuICBjb25zdCBBTlNJX0JBQ0tHUk9VTkRfQ1lBTiA9ICdcXHUwMDFCWzQ2bSdcbiAgY29uc29sZS5sb2coYCR7QU5TSV9CQUNLR1JPVU5EX0NZQU4gKyBBTlNJX0JMQUNLfWApXG4gIGNvbnNvbGUubG9nKGBMT0cgLS0+ICR7dHlwZX0gJHtjb250ZXh0fSA+ICR7bXNnfSAke0FOU0lfUkVTRVR9YClcbiAgREVCVUcodHlwZSwgbG9nLCBtc2csIGNvbnRleHQpXG59XG5cbnZhciBTRVJWSUNFXG52YXIgU0VSVklDRV9OQU1FID0gJ3Rlc3RTZXJ2aWNlJ1xudmFyIGZha2VBdXRoID0ge1xuICB1c2VySWQ6ICcxOTUxNTE2NjI2NjEnXG59XG5cbnZhciBESSA9IHtcbiAgdGhyb3dFcnJvcixcbiAgYXV0aGVudGljYXRlOiBhc3luYyh7cmVxdWVzdH0pID0+IGZha2VBdXRoLFxuICBhdXRob3JpemU6IGFzeW5jKHtyb3V0ZSwgcmVxdWVzdH0pID0+IHRydWUsXG4gIC8vIGdldEV2ZW50czogKHBheWxvYWQpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgLy8gICByZXNvbHZlKFNFUlZJQ0UuZXZlbnRzKVxuICAvLyB9KSxcbiAgLy8gZ2V0Q29uZmlnOiAocGF5bG9hZCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAvLyAgIHJlc29sdmUoY29uZmlnKVxuICAvLyB9KSxcbiAgcmVnaXN0ZXJSb3V0ZTogYXN5bmMoe3JvdXRlLCByb3V0ZUZ1bmN0aW9ufSkgPT4gU0VSVklDRS5yb3V0ZXNbcm91dGVdID0gcm91dGVGdW5jdGlvbixcbiAgY2FsbFJvdXRlOiBhc3luYyh7cm91dGUsIHJlcXVlc3R9KSA9PiBTRVJWSUNFLnJvdXRlc1tyb3V0ZV0ocmVxdWVzdCksXG4gIGRlcmVnaXN0ZXJSb3V0ZTogYXN5bmMoe3JvdXRlfSkgPT4gU0VSVklDRS5yb3V0ZXNbcm91dGVdKHJlcXVlc3QpLFxuICBkZXJlZ2lzdGVyUm91dGU6IGFzeW5jKHtyb3V0ZX0pID0+IGRlbGV0ZSBTRVJWSUNFLnJvdXRlc1tyb3V0ZV0sXG4gIHJlZ2lzdGVyRXZlbnQ6IGFzeW5jKHtuYW1lLCByb3V0ZX0pID0+IHtcbiAgICBTRVJWSUNFLmV2ZW50c1tuYW1lXSA9IHtcbiAgICAgIG5hbWUsXG4gICAgICByb3V0ZSxcbiAgICAgIHNlcnZpY2U6IFNFUlZJQ0VfTkFNRVxuICAgIH1cbiAgfSxcbiAgZGVyZWdpc3RlckV2ZW50OiBhc3luYyh7bmFtZX0pID0+IGRlbGV0ZSBTRVJWSUNFLmV2ZW50c1tldmVudF0sXG4gIGVtaXRFdmVudDogYXN5bmMoe25hbWUsIHBheWxvYWR9KSA9PiB7XG5cbiAgfSxcbiAgbG9nOiBhc3luYyh7Y29udGV4dCwgbXNnLCBsb2csIHR5cGV9KSA9PiBMT0codHlwZSwgbG9nLCBtc2csIGNvbnRleHQpLFxuICBkZWJ1ZzogYXN5bmMoe2NvbnRleHQsIG1zZywgZGVidWd9KSA9PiBERUJVRygnREVCVUcnLCBkZWJ1ZywgbXNnLCBjb250ZXh0KSxcbiAgZXJyb3I6IGFzeW5jKHtlcnJvcn0pID0+IHtcbiAgICBjb25zdCBBTlNJX1JFU0VUID0gJ1xcdTAwMUJbMG0nXG4gICAgY29uc3QgQU5TSV9SRUQgPSAnXFx1MDAxQlszMW0nXG4gICAgY29uc29sZS5sb2coYCR7QU5TSV9SRUR9IE9SSUdJTkFMIEVSUk9SICR7QU5TSV9SRVNFVH1gKVxuICAgIGNvbnNvbGUubG9nKGVycm9yLm9yaWdpbmFsRXJyb3IgfHwgZXJyb3IpXG4gICAgY29uc29sZS5sb2coYEFQUCBFUlJPUiAtLT4gJHtlcnJvci5pbmZvICYmIGVycm9yLmluZm8ubWVzc2FnZSA/IGVycm9yLmluZm8ubWVzc2FnZSA6ICd1bmtub3cnfWApXG4gICAgY29uc29sZS5sb2coYCR7QU5TSV9SRUR9IEFQUCBUUkFDRSAke0FOU0lfUkVTRVR9YClcbiAgICBpZiAoZXJyb3IuZ2V0QXBwVHJhY2UpY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXJyb3IuZ2V0QXBwVHJhY2UoKSwgbnVsbCwgNCkpXG4gICAgLy8gaWYgKGVycm9yLnRvU3RyaW5nKWNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGVycm9yLnRvU3RyaW5nKCksIG51bGwsIDQpKVxuICAgIExPRygnRVJST1InLCBlcnJvciwgJ2plc3VzLXRlc3QnLCAnQVBQLUVSUk9SJylcbiAgfVxufVxuXG50LnRlc3QoJyoqKiBKRVNVUyBTRVJWSUNFIENSVUQgKioqJywge1xuICBhdXRvZW5kOiB0cnVlXG59LCBhc3luYyBmdW5jdGlvbiBtYWluVGVzdCAodCkge1xuICBTRVJWSUNFID0ge1xuICAgIHJvdXRlczoge30sXG4gICAgY29uZmlnOiB7XG4gICAgICBtYWluU3RvcmFnZToge1xuICAgICAgICB0eXBlOiAnaW5tZW1vcnknLFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdE1hdGVyaWFsL2ZpbGVEYicpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGV2ZW50czoge31cbiAgfVxuXG4gIHZhciBzdG9yYWdlUGFja2FnZSA9IHJlcXVpcmUoJy4vc3RvcmFnZScpXG5cbiAgdmFyIGVudGl0eVRlc3RDb25maWcgPSB7XG4gICAgc3RvcmFnZVR5cGU6ICgpID0+IFNFUlZJQ0UuY29uZmlnLm1haW5TdG9yYWdlLnR5cGUsXG4gICAgc3RvcmFnZUNvbmZpZzogKCkgPT4gU0VSVklDRS5jb25maWcubWFpblN0b3JhZ2UuY29uZmlnLFxuICAgIG11dGF0aW9uc1BhdGg6ICgpID0+IHBhdGguam9pbihfX2Rpcm5hbWUsICd0ZXN0TWF0ZXJpYWwvZW50aXR5VGVzdC9tdXRhdGlvbnMnKSxcbiAgICBtdXRhdGlvbnNDb2xsZWN0aW9uOiAoKSA9PiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdE1hdGVyaWFsL2VudGl0eVRlc3QvbXV0YXRpb25zJyksXG4gICAgdmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnM6ICgpID0+IDEwLFxuICAgIHZhbGlkYXRpb25TY2hlbWE6ICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiByZXF1aXJlKCcuL3Rlc3RNYXRlcmlhbC9lbnRpdHlUZXN0L2VudGl0eS5zY2hlbWEuanNvbicpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBESS50aHJvd0Vycm9yKCdlbnRpdHlUZXN0Q29uZmlnIHZhbGlkYXRpb25TY2hlbWEoKSAnLCBlcnJvcilcbiAgICAgIH1cbiAgICB9LFxuICAgIHZhbGlkYXRpb25UeXBlOiAoKSA9PiAnanNvblNjaGVtYSdcbiAgfVxuICB2YXIgZW50aXR5VGVzdERJID0gUi5tZXJnZSh7XG4gICAgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2U6IHN0b3JhZ2VQYWNrYWdlKFIubWVyZ2UoZW50aXR5VGVzdENvbmZpZywge1xuICAgICAgc3RvcmFnZUNvbGxlY3Rpb246ICgpID0+ICdlbnRpdHlUZXN0TXV0YXRpb25zJ1xuICAgIH0pLCBESSksXG4gICAgdmlld3NTdG9yYWdlUGFja2FnZTogc3RvcmFnZVBhY2thZ2UoUi5tZXJnZShlbnRpdHlUZXN0Q29uZmlnLCB7XG4gICAgICBzdG9yYWdlQ29sbGVjdGlvbjogKCkgPT4gJ2VudGl0eVRlc3RWaWV3c01haW4nXG4gICAgfSksIERJKSxcbiAgICB0aHJvd0Vycm9yOiBESS50aHJvd0Vycm9yLFxuICAgIHZpZXdzU25hcHNob3RzU3RvcmFnZVBhY2thZ2U6IHN0b3JhZ2VQYWNrYWdlKFIubWVyZ2UoZW50aXR5VGVzdENvbmZpZywge1xuICAgICAgc3RvcmFnZUNvbGxlY3Rpb246ICgpID0+ICdlbnRpdHlUZXN0Vmlld3NNYWluU25hcHNob3RzJ1xuICAgIH0pLCBESSlcbiAgfSwgREkpXG4gIGVudGl0eVRlc3RESS5tdXRhdGlvbnNQYWNrYWdlID0gYXdhaXQgcmVxdWlyZSgnLi9tdXRhdGlvbnMuY3FycycpKGVudGl0eVRlc3RDb25maWcsIGVudGl0eVRlc3RESSlcbiAgZW50aXR5VGVzdERJLnZpZXdzUGFja2FnZSA9IGF3YWl0IHJlcXVpcmUoJy4vdmlld3MuY3FycycpKGVudGl0eVRlc3RDb25maWcsIGVudGl0eVRlc3RESSlcbiAgZW50aXR5VGVzdERJLnZhbGlkYXRlID0gYXdhaXQgcmVxdWlyZSgnLi92YWxpZGF0ZScpKGVudGl0eVRlc3RDb25maWcsIGVudGl0eVRlc3RESSlcblxuICBnbG9iYWwuc2VydmljZVJlc3BvbnNlID0ge31cbiAgdC5wbGFuKDQpXG4gIGF3YWl0IHQudGVzdCgnLT4gQ1JVRCBDUkVBVEUnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgY3JlYXRlRW50aXR5VGVzdCA9IGFzeW5jIGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG4gICAgICAgICAgdmFyIGl0ZW1zID0gcmVxdWVzdC5pdGVtc1xuICAgICAgICAgIGlmICghaXRlbXMgfHwgIWl0ZW1zLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdjcmVhdGVFbnRpdHlUZXN0IHJlcXVpcmUgaXRlbXMnKVxuICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHsgaWYgKCFpdGVtLl9pZClpdGVtLl9pZCA9IHV1aWRWNCgpIH0pIC8vIElEIEFVVE9HRU5FUkFURUQgSUYgTk9UIElOQ0xVREVEXG4gICAgICAgICAgYXdhaXQgZW50aXR5VGVzdERJLnZhbGlkYXRlKHtpdGVtc30pXG4gICAgICAgICAgdmFyIGF1dGhvcml6YXRpb25zRGF0YSA9IGF3YWl0IERJLmF1dGhlbnRpY2F0ZSh7cmVxdWVzdH0pXG4gICAgICAgICAgYXdhaXQgREkuYXV0aG9yaXplKHtjb250ZXh0OiBhdXRob3JpemF0aW9uc0RhdGEsIGFjdGlvbjogJ3dyaXRlJywgZW50aXR5OiAnZW50aXR5VGVzdCcsIGl0ZW1zfSlcbiAgICAgICAgICB2YXIgaXRlbXNJZHMgPSBSLm1hcChSLnByb3AoJ19pZCcpLCBpdGVtcylcbiAgICAgICAgICB2YXIgaXRlbXNNdXRhdGlvbnMgPSBhd2FpdCBlbnRpdHlUZXN0REkubXV0YXRpb25zUGFja2FnZS5tdXRhdGUoe211dGF0aW9uOiAnY3JlYXRlJywgaXRlbXNJZHMsIGl0ZW1zfSlcbiAgICAgICAgICBESS5kZWJ1Zyh7bXNnOiAnY3JlYXRlRW50aXR5VGVzdCcsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7aXRlbXNNdXRhdGlvbnN9fSlcbiAgICAgICAgICBhd2FpdCBlbnRpdHlUZXN0REkudmlld3NQYWNrYWdlLnJlZnJlc2hJdGVtc1ZpZXdzKHtpdGVtc0lkcywgbG9hZFNuYXBzaG90OiBmYWxzZSwgbG9hZE11dGF0aW9uczogZmFsc2UsIGFkZE11dGF0aW9uczogaXRlbXNNdXRhdGlvbnN9KVxuICAgICAgICAgIHJldHVybiB7aXRlbXNJZHN9XG4gICAgICAgICAgICAvLyBESS5sb2coe2NvbnRleHQ6ICdwYWNrYWdlTmFtZScsIG5hbWU6ICdjcmVhdGVFbnRpdHlUZXN0JywgbG9nOiB7aWRzfX0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgREkudGhyb3dFcnJvcignY3JlYXRlRW50aXR5VGVzdCcsIGVycm9yLCByZXF1ZXN0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBESS5yZWdpc3RlclJvdXRlKHtyb3V0ZTogJ2NyZWF0ZUVudGl0eVRlc3QnLCByb3V0ZUZ1bmN0aW9uOiBjcmVhdGVFbnRpdHlUZXN0fSlcbiAgICAgIERJLnJlZ2lzdGVyRXZlbnQoe2V2ZW50OiAnY3JlYXRlRW50aXR5VGVzdCcsIHJvdXRlOiAnY3JlYXRlRW50aXR5VGVzdCd9KVxuICAgICAgdmFyIGNyZWF0ZUVudGl0eVRlc3RSZXF1ZXN0ID0ge1xuICAgICAgICBpdGVtczogW3tuYW1lOiAndGVzdCd9LCB7bmFtZTogJ3Rlc3QyJ31dXG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBnbG9iYWwuc2VydmljZVJlc3BvbnNlID0gYXdhaXQgREkuY2FsbFJvdXRlKHtyb3V0ZTogJ2NyZWF0ZUVudGl0eVRlc3QnLCByZXF1ZXN0OiBjcmVhdGVFbnRpdHlUZXN0UmVxdWVzdH0pXG4gICAgICAgIHQudHlwZShnbG9iYWwuc2VydmljZVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIGlzIG9iamVjdCcpXG4gICAgICAgIHQudHlwZShnbG9iYWwuc2VydmljZVJlc3BvbnNlLml0ZW1zSWRzLCAnQXJyYXknLCAnaXRlbXNJZHMgaXMgYXJyYXknKVxuICAgICAgICB0LnR5cGUoZ2xvYmFsLnNlcnZpY2VSZXNwb25zZS5pdGVtc0lkcy5sZW5ndGgsIDIsICdpdGVtc0lkcyBsZW5ndGggaXMgMicpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBESS50aHJvd0Vycm9yKCdESS5jYWxsUm91dGUgY3JlYXRlRW50aXR5VGVzdCcsIGVycm9yLCB7cm91dGU6ICdjcmVhdGVFbnRpdHlUZXN0JywgcmVxdWVzdDogY3JlYXRlRW50aXR5VGVzdFJlcXVlc3R9KVxuICAgICAgfVxuXG4gICAgICB0LmVuZCgpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIERJLmVycm9yKHtlcnJvcn0pXG4gICAgICB0LmZhaWwoJ0ZBSUwgY3JlYXRlRW50aXR5VGVzdCcpXG4gICAgICB0LmVuZCgnRkFJTCBjcmVhdGVFbnRpdHlUZXN0JylcbiAgICB9XG4gIH0pXG4gIGF3YWl0IHQudGVzdCgnLT4gQ1JVRCBVUERBVEUnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgdXBkYXRlRW50aXR5VGVzdCA9IGFzeW5jIGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGl0ZW1zID0gcmVxdWVzdC5pdGVtc1xuICAgICAgICAgIGlmICghaXRlbXMgfHwgIWl0ZW1zLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd1cGRhdGVFbnRpdHlUZXN0IHJlcXVpcmUgaXRlbXMnKVxuICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHsgaWYgKCFpdGVtLl9pZCkgdGhyb3cgbmV3IEVycm9yKCd1cGRhdGVFbnRpdHlUZXN0IGl0ZW1zIF9pZCBmaWVsZCBpcyByZXF1aXJlZCcpIH0pIC8vIElEIE5FRURFRFxuICAgICAgICAgIGF3YWl0IGVudGl0eVRlc3RESS52YWxpZGF0ZSh7aXRlbXN9KVxuICAgICAgICAgIHZhciBhdXRob3JpemF0aW9uc0RhdGEgPSBhd2FpdCBESS5hdXRoZW50aWNhdGUoe3JlcXVlc3R9KVxuICAgICAgICAgIGF3YWl0IERJLmF1dGhvcml6ZSh7Y29udGV4dDogYXV0aG9yaXphdGlvbnNEYXRhLCBhY3Rpb246ICd3cml0ZScsIGVudGl0eTogJ2VudGl0eVRlc3QnLCBpdGVtc30pXG4gICAgICAgICAgdmFyIGl0ZW1zSWRzID0gUi5tYXAoUi5wcm9wKCdfaWQnKSwgaXRlbXMpXG4gICAgICAgICAgdmFyIGl0ZW1zTXV0YXRpb25zID0gYXdhaXQgZW50aXR5VGVzdERJLm11dGF0aW9uc1BhY2thZ2UubXV0YXRlKHttdXRhdGlvbjogJ3VwZGF0ZScsIGl0ZW1zSWRzLCBpdGVtc30pXG4gICAgICAgICAgREkuZGVidWcoe21zZzogJ3VwZGF0ZUVudGl0eVRlc3QnLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge2l0ZW1zTXV0YXRpb25zfX0pXG4gICAgICAgICAgYXdhaXQgZW50aXR5VGVzdERJLnZpZXdzUGFja2FnZS5yZWZyZXNoSXRlbXNWaWV3cyh7aXRlbXNJZHMsIGxvYWRTbmFwc2hvdDogdHJ1ZSwgbG9hZE11dGF0aW9uczogdHJ1ZSwgYWRkTXV0YXRpb25zOiBpdGVtc011dGF0aW9uc30pXG4gICAgICAgICAgcmV0dXJuIHtpdGVtc0lkc31cbiAgICAgICAgICAgIC8vIERJLmxvZyh7Y29udGV4dDogJ3BhY2thZ2VOYW1lJywgbmFtZTogJ3VwZGF0ZUVudGl0eVRlc3QnLCBsb2c6IHtpZHN9fSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBESS50aHJvd0Vycm9yKCd1cGRhdGVFbnRpdHlUZXN0JywgZXJyb3IsIHJlcXVlc3QpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIERJLnJlZ2lzdGVyUm91dGUoe3JvdXRlOiAndXBkYXRlRW50aXR5VGVzdCcsIHJvdXRlRnVuY3Rpb246IHVwZGF0ZUVudGl0eVRlc3R9KVxuICAgICAgREkucmVnaXN0ZXJFdmVudCh7ZXZlbnQ6ICd1cGRhdGVFbnRpdHlUZXN0Jywgcm91dGU6ICd1cGRhdGVFbnRpdHlUZXN0J30pXG4gICAgICB2YXIgdXBkYXRlRW50aXR5VGVzdFJlcXVlc3QgPSB7XG4gICAgICAgIGl0ZW1zOiBbe25hbWU6ICd0ZXN0dXBkYXRlJywgX2lkOiBnbG9iYWwuc2VydmljZVJlc3BvbnNlLml0ZW1zSWRzWzBdIH0sIHtuYW1lOiAndGVzdHVwZGF0ZTInLCBfaWQ6IGdsb2JhbC5zZXJ2aWNlUmVzcG9uc2UuaXRlbXNJZHNbMV0gfV1cbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGdsb2JhbC5zZXJ2aWNlUmVzcG9uc2UgPSBhd2FpdCBESS5jYWxsUm91dGUoe3JvdXRlOiAndXBkYXRlRW50aXR5VGVzdCcsIHJlcXVlc3Q6IHVwZGF0ZUVudGl0eVRlc3RSZXF1ZXN0fSlcbiAgICAgICAgdC50eXBlKGdsb2JhbC5zZXJ2aWNlUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgaXMgb2JqZWN0JylcbiAgICAgICAgdC50eXBlKGdsb2JhbC5zZXJ2aWNlUmVzcG9uc2UuaXRlbXNJZHMsICdBcnJheScsICdpdGVtc0lkcyBpcyBhcnJheScpXG4gICAgICAgIHQudHlwZShnbG9iYWwuc2VydmljZVJlc3BvbnNlLml0ZW1zSWRzLmxlbmd0aCwgMiwgJ2l0ZW1zSWRzIGxlbmd0aCBpcyAyJylcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIERJLnRocm93RXJyb3IoJ0RJLmNhbGxSb3V0ZSB1cGRhdGVFbnRpdHlUZXN0JywgZXJyb3IsIHtyb3V0ZTogJ3VwZGF0ZUVudGl0eVRlc3QnLCByZXF1ZXN0OiB1cGRhdGVFbnRpdHlUZXN0UmVxdWVzdH0pXG4gICAgICB9XG5cbiAgICAgIHQuZW5kKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgREkuZXJyb3Ioe2Vycm9yfSlcbiAgICAgIHQuZmFpbCgnRkFJTCB1cGRhdGVFbnRpdHlUZXN0JylcbiAgICAgIHQuZW5kKCdGQUlMIHVwZGF0ZUVudGl0eVRlc3QnKVxuICAgIH1cbiAgfSlcbiAgYXdhaXQgdC50ZXN0KCctPiBDUlVEIFJFQUQnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgcmVhZEVudGl0eVRlc3QgPSBhc3luYyBmdW5jdGlvbiAocmVxdWVzdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBpdGVtc0lkcyA9IHJlcXVlc3QuaWRzXG4gICAgICAgICAgaWYgKCFpdGVtc0lkcyB8fCAhaXRlbXNJZHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ3JlYWRFbnRpdHlUZXN0IHJlcXVpcmUgaXRlbXMgaWRzJylcbiAgICAgICAgICB2YXIgYXV0aG9yaXphdGlvbnNEYXRhID0gYXdhaXQgREkuYXV0aGVudGljYXRlKHtyZXF1ZXN0fSlcbiAgICAgICAgICBhd2FpdCBESS5hdXRob3JpemUoe2NvbnRleHQ6IGF1dGhvcml6YXRpb25zRGF0YSwgYWN0aW9uOiAncmVhZCcsIGVudGl0eTogJ2VudGl0eVRlc3QnLCBpdGVtc0lkc30pXG4gICAgICAgICAgdmFyIGl0ZW1zID0gYXdhaXQgZW50aXR5VGVzdERJLnZpZXdzUGFja2FnZS5nZXQoe2lkczogaXRlbXNJZHN9KVxuICAgICAgICAgIERJLmRlYnVnKHttc2c6ICdyZWFkRW50aXR5VGVzdCcsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7aXRlbXNJZHMsIGF1dGhvcml6YXRpb25zRGF0YSwgaXRlbXN9fSlcbiAgICAgICAgICByZXR1cm4ge2l0ZW1zfVxuICAgICAgICAgICAgLy8gREkubG9nKHtjb250ZXh0OiAncGFja2FnZU5hbWUnLCBuYW1lOiAncmVhZEVudGl0eVRlc3QnLCBsb2c6IHtpZHN9fSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBESS50aHJvd0Vycm9yKCdyZWFkRW50aXR5VGVzdCcsIGVycm9yLCByZXF1ZXN0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBESS5yZWdpc3RlclJvdXRlKHtyb3V0ZTogJ3JlYWRFbnRpdHlUZXN0Jywgcm91dGVGdW5jdGlvbjogcmVhZEVudGl0eVRlc3R9KVxuICAgICAgREkucmVnaXN0ZXJFdmVudCh7ZXZlbnQ6ICdyZWFkRW50aXR5VGVzdCcsIHJvdXRlOiAncmVhZEVudGl0eVRlc3QnfSlcbiAgICAgIHZhciByZWFkRW50aXR5VGVzdFJlcXVlc3QgPSB7XG4gICAgICAgIGlkczogZ2xvYmFsLnNlcnZpY2VSZXNwb25zZS5pdGVtc0lkc1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgZ2xvYmFsLnNlcnZpY2VSZXNwb25zZSA9IGF3YWl0IERJLmNhbGxSb3V0ZSh7cm91dGU6ICdyZWFkRW50aXR5VGVzdCcsIHJlcXVlc3Q6IHJlYWRFbnRpdHlUZXN0UmVxdWVzdH0pXG4gICAgICAgIHQudHlwZShnbG9iYWwuc2VydmljZVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIGlzIG9iamVjdCcpXG4gICAgICAgIHQudHlwZShnbG9iYWwuc2VydmljZVJlc3BvbnNlLml0ZW1zLCAnQXJyYXknLCAnaXRlbXMgaXMgYXJyYXknKVxuICAgICAgICB0LnR5cGUoZ2xvYmFsLnNlcnZpY2VSZXNwb25zZS5pdGVtcy5sZW5ndGgsIDIsICdpdGVtcyBsZW5ndGggaXMgMicpXG4gICAgICAgIHQuZXF1YWwoZ2xvYmFsLnNlcnZpY2VSZXNwb25zZS5pdGVtc1swXS5uYW1lLCAndGVzdHVwZGF0ZScsICdpdGVtIDEgOiBzZW5kZWQgbmFtZSA9IHJlYWRlZCBuYW1lJylcbiAgICAgICAgdC5lcXVhbChnbG9iYWwuc2VydmljZVJlc3BvbnNlLml0ZW1zWzFdLm5hbWUsICd0ZXN0dXBkYXRlMicsICdpdGVtIDIgOiBzZW5kZWQgbmFtZSA9IHJlYWRlZCBuYW1lJylcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIERJLnRocm93RXJyb3IoJ0RJLmNhbGxSb3V0ZSByZWFkRW50aXR5VGVzdCcsIGVycm9yLCB7cm91dGU6ICdyZWFkRW50aXR5VGVzdCcsIHJlcXVlc3Q6IHJlYWRFbnRpdHlUZXN0UmVxdWVzdH0pXG4gICAgICB9XG5cbiAgICAgIHQuZW5kKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgREkuZXJyb3Ioe2Vycm9yfSlcbiAgICAgIHQuZmFpbCgnRkFJTCByZWFkRW50aXR5VGVzdCcpXG4gICAgICB0LmVuZCgnRkFJTCByZWFkRW50aXR5VGVzdCcpXG4gICAgfVxuICB9KVxuICBkZWJ1Z0FjdGl2ZSA9IHRydWVcbiAgYXdhaXQgdC50ZXN0KCctPiBDUlVEIERFTEVURScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBkZWxldGVFbnRpdHlUZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgaXRlbXNJZHMgPSByZXF1ZXN0Lmlkc1xuICAgICAgICAgIGlmICghaXRlbXNJZHMgfHwgIWl0ZW1zSWRzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdkZWxldGVFbnRpdHlUZXN0IHJlcXVpcmUgaXRlbXMgaWRzJylcbiAgICAgICAgICB2YXIgYXV0aG9yaXphdGlvbnNEYXRhID0gYXdhaXQgREkuYXV0aGVudGljYXRlKHtyZXF1ZXN0fSlcbiAgICAgICAgICBhd2FpdCBESS5hdXRob3JpemUoe2NvbnRleHQ6IGF1dGhvcml6YXRpb25zRGF0YSwgYWN0aW9uOiAnd3JpdGUnLCBlbnRpdHk6ICdlbnRpdHlUZXN0JywgaXRlbXNJZHN9KVxuICAgICAgICAgIHZhciBpdGVtc011dGF0aW9ucyA9IGF3YWl0IGVudGl0eVRlc3RESS5tdXRhdGlvbnNQYWNrYWdlLm11dGF0ZSh7bXV0YXRpb246ICdkZWxldGUnLCBpdGVtc0lkc30pXG4gICAgICAgICAgYXdhaXQgZW50aXR5VGVzdERJLnZpZXdzUGFja2FnZS5yZWZyZXNoSXRlbXNWaWV3cyh7aXRlbXNJZHMsIGxvYWRTbmFwc2hvdDogdHJ1ZSwgbG9hZE11dGF0aW9uczogdHJ1ZSwgYWRkTXV0YXRpb25zOiBpdGVtc011dGF0aW9uc30pXG4gICAgICAgICAgREkuZGVidWcoe21zZzogJ2RlbGV0ZUVudGl0eVRlc3QnLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge2l0ZW1zSWRzLCBpdGVtc011dGF0aW9uc319KVxuICAgICAgICAgIHJldHVybiB7aXRlbXNJZHN9XG4gICAgICAgICAgICAvLyBESS5sb2coe2NvbnRleHQ6ICdwYWNrYWdlTmFtZScsIG5hbWU6ICdkZWxldGVFbnRpdHlUZXN0JywgbG9nOiB7aWRzfX0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgREkudGhyb3dFcnJvcignZGVsZXRlRW50aXR5VGVzdCcsIGVycm9yLCByZXF1ZXN0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBESS5yZWdpc3RlclJvdXRlKHtyb3V0ZTogJ2RlbGV0ZUVudGl0eVRlc3QnLCByb3V0ZUZ1bmN0aW9uOiBkZWxldGVFbnRpdHlUZXN0fSlcbiAgICAgIERJLnJlZ2lzdGVyRXZlbnQoe2V2ZW50OiAnZGVsZXRlRW50aXR5VGVzdCcsIHJvdXRlOiAnZGVsZXRlRW50aXR5VGVzdCd9KVxuICAgICAgdmFyIGRlbGV0ZUVudGl0eVRlc3RSZXF1ZXN0ID0ge1xuICAgICAgICBpZHM6IFtnbG9iYWwuc2VydmljZVJlc3BvbnNlLml0ZW1zWzBdLl9pZF1cbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGdsb2JhbC5zZXJ2aWNlUmVzcG9uc2UgPSBhd2FpdCBESS5jYWxsUm91dGUoe3JvdXRlOiAnZGVsZXRlRW50aXR5VGVzdCcsIHJlcXVlc3Q6IGRlbGV0ZUVudGl0eVRlc3RSZXF1ZXN0fSlcbiAgICAgICAgdC50eXBlKGdsb2JhbC5zZXJ2aWNlUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgaXMgb2JqZWN0JylcbiAgICAgICAgdC50eXBlKGdsb2JhbC5zZXJ2aWNlUmVzcG9uc2UuaXRlbXNJZHMsICdBcnJheScsICdpdGVtcyBpcyBhcnJheScpXG4gICAgICAgIHQudHlwZShnbG9iYWwuc2VydmljZVJlc3BvbnNlLml0ZW1zSWRzLmxlbmd0aCwgMSwgJ2l0ZW1zIGxlbmd0aCBpcyAxJylcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIERJLnRocm93RXJyb3IoJ0RJLmNhbGxSb3V0ZSBkZWxldGVFbnRpdHlUZXN0JywgZXJyb3IsIHtyb3V0ZTogJ2RlbGV0ZUVudGl0eVRlc3QnLCByZXF1ZXN0OiBkZWxldGVFbnRpdHlUZXN0UmVxdWVzdH0pXG4gICAgICB9XG5cbiAgICAgIHQuZW5kKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgREkuZXJyb3Ioe2Vycm9yfSlcbiAgICAgIHQuZmFpbCgnRkFJTCBkZWxldGVFbnRpdHlUZXN0JylcbiAgICAgIHQuZW5kKCdGQUlMIGRlbGV0ZUVudGl0eVRlc3QnKVxuICAgIH1cbiAgfSlcbn0pXG4iXX0=