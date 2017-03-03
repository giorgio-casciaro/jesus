'use strict';

if (!global._babelPolyfill) require('babel-polyfill');
// var R = require('ramda')
var deref = require('json-schema-deref-sync');
var faker = require('faker');
var jsf = require('json-schema-faker');
faker.locale = 'it';
var restler = require('restler');
var request = require('request');
var t = require('tap');
var path = require('path');
var CONSOLE = require('../jesus').getConsole({ debug: true, log: true, error: true, warn: true }, 'BASE TEST', '----', '-----');
var jesus = require('../jesus');

t.test('*** SERVICES NET ***', {
  //  autoend: true
}, function mainTest(t) {
  var MS_RESOURCES, MS_EVENTS_EMITTER, MS_AUTHORIZATIONS, MS_LOGS, MS_EVENTS_EMITTER_URL, resourceInsert, MS_EVENTS_EMITTER_requestHttp, MS_EVENTS_EMITTER_responseHttp, MS_VIEW, MS_VIEW_URL;
  return regeneratorRuntime.async(function mainTest$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          resourceInsert = function resourceInsert(t) {
            var loops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
            var steps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
            var methodsConfig, derefOptions, baseUrl, schemaCreate, schemaRead, schemaUpdate, schemaDelete, testDataToSend, i, createdResponse, createRequest, updateRequest;
            return regeneratorRuntime.async(function resourceInsert$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    methodsConfig = require(path.join(__dirname, './shared/services/resources/methods.json'));
                    derefOptions = { baseFolder: path.join(__dirname, './shared/services/resources/'), failOnMissing: true };

                    CONSOLE.debug('TEST', 'methodsConfig', methodsConfig);
                    baseUrl = 'http://127.0.0.1:' + MS_RESOURCES.SHARED_CONFIG.httpPublicApiPort + '/';

                    CONSOLE.debug('TEST', 'baseUrl', baseUrl);
                    schemaCreate = deref(methodsConfig.createResource.requestSchema, derefOptions);
                    schemaRead = deref(methodsConfig.readResource.requestSchema, derefOptions);
                    schemaUpdate = deref(methodsConfig.updateResource.requestSchema, derefOptions);
                    schemaDelete = deref(methodsConfig.deleteResource.requestSchema, derefOptions);


                    CONSOLE.debug('json schema faker schema', derefOptions, { schemaCreate: schemaCreate, schemaRead: schemaRead, schemaUpdate: schemaUpdate, schemaDelete: schemaDelete });
                    CONSOLE.debug('json schema faker schema examples', jsf(schemaCreate), jsf(schemaRead), jsf(schemaUpdate), jsf(schemaDelete));
                    testDataToSend = [];
                    // await t.test('NO COMPRESSION', async function (t) {
                    //   await new Promise((resolve, reject) => {
                    //     restler.postJson(baseUrl + 'createResource').on('complete', function (dataResponse, response) {
                    //       CONSOLE.debug('rebuildViews receive', response, dataResponse)
                    //       resolve()
                    //     })
                    //   })
                    //
                    //   t.end()
                    // })

                    i = 0;

                  case 13:
                    if (!(i < loops)) {
                      _context.next = 31;
                      break;
                    }

                    createRequest = jsf(schemaCreate);
                    // CONSOLE.group(`TEST RIGHT DATA ${i}`)
                    // CONSOLE.group(`createResource`)

                    _context.next = 17;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      CONSOLE.debug('send createRequest', JSON.stringify(createRequest));
                      restler.postJson(baseUrl + 'createResource', createRequest).on('complete', function (dataResponse, response) {
                        CONSOLE.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response createResource is object');
                        t.type(dataResponse.id, 'string', 'Response createResource id is string ' + dataResponse.id);
                        createdResponse = dataResponse;
                        resolve();
                      });
                    }));

                  case 17:
                    if (!(steps === 1)) {
                      _context.next = 19;
                      break;
                    }

                    return _context.abrupt('continue', 28);

                  case 19:
                    _context.next = 21;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var data = { id: createdResponse.id, userId: 'test', token: 'test' };
                      CONSOLE.debug('send', schemaRead, JSON.stringify(data));
                      restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
                        CONSOLE.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response readResource is object');
                        t.same(dataResponse.body, createRequest.data.body, 'Response readResource  body as sended, id:' + dataResponse._id);
                        resolve();
                      });
                    }));

                  case 21:
                    // CONSOLE.groupEnd()
                    // CONSOLE.group(`updateResource`)
                    schemaUpdate.properties.data.required = ['body'];
                    updateRequest = jsf(schemaUpdate);

                    updateRequest.id = createdResponse.id;
                    _context.next = 26;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      CONSOLE.debug('send', schemaUpdate, JSON.stringify(updateRequest));
                      restler.postJson(baseUrl + 'updateResource', updateRequest).on('complete', function (dataResponse, response) {
                        CONSOLE.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response updateResource is object');
                        t.same(dataResponse.id, createdResponse.id, 'Response updateResource  id as sended, id:' + dataResponse.id);
                        resolve();
                      });
                    }));

                  case 26:
                    _context.next = 28;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var data = { id: createdResponse.id, userId: 'test', token: 'test' };
                      CONSOLE.debug('send', schemaRead, JSON.stringify(data));
                      restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
                        CONSOLE.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response readResource is object');
                        t.same(dataResponse.body, updateRequest.data.body, 'Response readResource body as updated, id:' + dataResponse._id);
                        resolve();
                      });
                    }));

                  case 28:
                    i++;
                    _context.next = 13;
                    break;

                  case 31:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this);
          };

          _context8.next = 3;
          return regeneratorRuntime.awrap(require('./services/resources/start')());

        case 3:
          MS_RESOURCES = _context8.sent;
          _context8.next = 6;
          return regeneratorRuntime.awrap(require('./services/eventsEmitter/start')());

        case 6:
          MS_EVENTS_EMITTER = _context8.sent;
          _context8.next = 9;
          return regeneratorRuntime.awrap(require('./services/authorizations/start')());

        case 9:
          MS_AUTHORIZATIONS = _context8.sent;
          _context8.next = 12;
          return regeneratorRuntime.awrap(require('./services/logs/start')());

        case 12:
          MS_LOGS = _context8.sent;
          MS_EVENTS_EMITTER_URL = 'http://127.0.0.1:' + MS_EVENTS_EMITTER.SHARED_CONFIG.httpPublicApiPort + '/';
          _context8.next = 16;
          return regeneratorRuntime.awrap(jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {}));

        case 16:

          t.plan(6);

          CONSOLE.debug('-------------------------------------- PREPARING -------------------------------------------');
          _context8.next = 20;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 2000);
          }));

        case 20:

          CONSOLE.debug('-------------------------------------- TEST 0 - EVENTS_EMITTER chiamata allo streaming degli eventi  ------------------------------------------');
          _context8.next = 23;
          return regeneratorRuntime.awrap(t.test('TEST 0', function _callee(t) {
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      MS_EVENTS_EMITTER_requestHttp = request({ method: 'GET',
                        uri: MS_EVENTS_EMITTER_URL + 'listenEvents'
                      });
                      MS_EVENTS_EMITTER_requestHttp.on('response', function (response) {
                        CONSOLE.debug('TEST HTTP STREAMING RESPONSE', response);
                        MS_EVENTS_EMITTER_responseHttp = response;
                        resolve();
                      }).on('error', function (error) {
                        CONSOLE.debug('TEST HTTP STREAMING ERROR', error);
                        reject();
                      }).on('data', function (binData) {
                        var dataString = binData.toString('utf8');
                        var data = JSON.parse(dataString.replace('data: ', ''));
                        CONSOLE.debug('TEST HTTP STREAMING DATA', data, MS_EVENTS_EMITTER_requestHttp);
                      });
                    }));

                  case 2:

                    t.end();

                  case 3:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, this);
          }));

        case 23:
          CONSOLE.debug('-------------------------------------- PREPARING -------------------------------------------');
          _context8.next = 26;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 26:

          CONSOLE.debug('-------------------------------------- TEST 1 - Inserimento Dati (MS_VIEW spento)-------------------------------------------');
          _context8.next = 29;
          return regeneratorRuntime.awrap(t.test('TEST 1 - Inserimento Dati (MS_VIEW spento)', function _callee2(t) {
            return regeneratorRuntime.async(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(resourceInsert(t, 1));

                  case 2:
                    t.end();

                  case 3:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, null, this);
          }));

        case 29:
          //

          CONSOLE.debug('-------------------------------------- STOP -------------------------------------------');
          _context8.next = 32;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 32:

          CONSOLE.debug('-------------------------------------- PREPARING - accendo MS_VIEW-------------------------------------------');
          _context8.next = 35;
          return regeneratorRuntime.awrap(require('./services/view/start')());

        case 35:
          MS_VIEW = _context8.sent;
          MS_VIEW_URL = 'http://127.0.0.1:' + MS_VIEW.SHARED_CONFIG.httpPrivateApiPort + '/';
          _context8.next = 39;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 39:

          CONSOLE.debug('-------------------------------------- TEST 2.1 - MS_VIEW rebuildViews (MS_VIEW dovrebbe recuperarei dati inseriti in precedenza)-------------------------------------------');
          _context8.next = 42;
          return regeneratorRuntime.awrap(t.test('TEST 2.1', function _callee3(t) {
            return regeneratorRuntime.async(function _callee3$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      CONSOLE.debug('send rebuildViews', MS_VIEW_URL + 'rebuildViews');
                      restler.postJson(MS_VIEW_URL + 'rebuildViews').on('complete', function (dataResponse, response) {
                        CONSOLE.debug('rebuildViews receive', response, dataResponse);
                        resolve();
                      });
                    }));

                  case 2:
                    t.end();

                  case 3:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, null, this);
          }));

        case 42:

          CONSOLE.debug('-------------------------------------- PREPARING - aggiungo evento viewsUpdated a MS_VIEW-------------------------------------------');
          _context8.next = 45;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 45:
          _context8.next = 47;
          return regeneratorRuntime.awrap(jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {
            'viewsUpdated': {
              'method': 'viewsUpdated',
              'haveResponse': false
            }
          }));

        case 47:
          _context8.next = 49;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 49:

          CONSOLE.debug('-------------------------------------- TEST 2.2 - Inserimento Dati (MS_VIEW acceso,dovrebbe aggiornarsi live)-------------------------------------------');

          _context8.next = 52;
          return regeneratorRuntime.awrap(t.test('TEST 2.2', function _callee4(t) {
            return regeneratorRuntime.async(function _callee4$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return regeneratorRuntime.awrap(resourceInsert(t, 5, 1));

                  case 2:
                    t.end();

                  case 3:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, null, this);
          }));

        case 52:
          _context8.next = 54;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 54:
          _context8.next = 56;
          return regeneratorRuntime.awrap(jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {}));

        case 56:
          _context8.next = 58;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 58:
          MS_VIEW.stop();

          CONSOLE.debug('-------------------------------------- STOP - MS_VIEW stopped------------------------------------------');
          _context8.next = 62;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 62:

          CONSOLE.debug('-------------------------------------- TEST 3 - Inserimento Dati (MS_VIEW stopped) -------------------------------------------');
          _context8.next = 65;
          return regeneratorRuntime.awrap(t.test('TEST 3', function _callee5(t) {
            return regeneratorRuntime.async(function _callee5$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return regeneratorRuntime.awrap(resourceInsert(t, 5, 1));

                  case 2:
                    t.end();

                  case 3:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, null, this);
          }));

        case 65:

          CONSOLE.debug('-------------------------------------- PREPARING - MS_VIEW starting-------------------------------------------');
          _context8.next = 68;
          return regeneratorRuntime.awrap(MS_VIEW.start());

        case 68:
          _context8.next = 70;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 70:

          CONSOLE.debug('-------------------------------------- TEST 4 - MS_VIEW syncViews -------------------------------------------');
          _context8.next = 73;
          return regeneratorRuntime.awrap(t.test('TEST 4', function _callee6(t) {
            return regeneratorRuntime.async(function _callee6$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      CONSOLE.debug('send syncViews', MS_VIEW_URL + 'syncViews');
                      restler.postJson(MS_VIEW_URL + 'syncViews').on('complete', function (dataResponse, response) {
                        CONSOLE.debug('syncViews receive', response, dataResponse);
                        resolve();
                      });
                    }));

                  case 2:

                    t.end();

                  case 3:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, null, this);
          }));

        case 73:
          _context8.next = 75;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 75:
          MS_VIEW.stop();

          MS_RESOURCES.stop();
          MS_EVENTS_EMITTER.stop();
          MS_AUTHORIZATIONS.stop();
          MS_LOGS.stop();
          MS_VIEW.stop();
          MS_EVENTS_EMITTER_responseHttp.destroy();
          t.end();
          _context8.next = 85;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 100000);
          }));

        case 85:
        case 'end':
          return _context8.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiZGVyZWYiLCJmYWtlciIsImpzZiIsImxvY2FsZSIsInJlc3RsZXIiLCJyZXF1ZXN0IiwidCIsInBhdGgiLCJDT05TT0xFIiwiZ2V0Q29uc29sZSIsImRlYnVnIiwibG9nIiwiZXJyb3IiLCJ3YXJuIiwiamVzdXMiLCJ0ZXN0IiwibWFpblRlc3QiLCJyZXNvdXJjZUluc2VydCIsImxvb3BzIiwic3RlcHMiLCJtZXRob2RzQ29uZmlnIiwiam9pbiIsIl9fZGlybmFtZSIsImRlcmVmT3B0aW9ucyIsImJhc2VGb2xkZXIiLCJmYWlsT25NaXNzaW5nIiwiYmFzZVVybCIsIk1TX1JFU09VUkNFUyIsIlNIQVJFRF9DT05GSUciLCJodHRwUHVibGljQXBpUG9ydCIsInNjaGVtYUNyZWF0ZSIsImNyZWF0ZVJlc291cmNlIiwicmVxdWVzdFNjaGVtYSIsInNjaGVtYVJlYWQiLCJyZWFkUmVzb3VyY2UiLCJzY2hlbWFVcGRhdGUiLCJ1cGRhdGVSZXNvdXJjZSIsInNjaGVtYURlbGV0ZSIsImRlbGV0ZVJlc291cmNlIiwidGVzdERhdGFUb1NlbmQiLCJpIiwiY3JlYXRlUmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiSlNPTiIsInN0cmluZ2lmeSIsInBvc3RKc29uIiwib24iLCJkYXRhUmVzcG9uc2UiLCJyZXNwb25zZSIsInR5cGUiLCJpZCIsImNyZWF0ZWRSZXNwb25zZSIsImRhdGEiLCJ1c2VySWQiLCJ0b2tlbiIsInNhbWUiLCJib2R5IiwiX2lkIiwicHJvcGVydGllcyIsInJlcXVpcmVkIiwidXBkYXRlUmVxdWVzdCIsIk1TX0VWRU5UU19FTUlUVEVSIiwiTVNfQVVUSE9SSVpBVElPTlMiLCJNU19MT0dTIiwiTVNfRVZFTlRTX0VNSVRURVJfVVJMIiwic2V0U2hhcmVkQ29uZmlnIiwicGxhbiIsInNldFRpbWVvdXQiLCJNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cCIsIm1ldGhvZCIsInVyaSIsIk1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cCIsImJpbkRhdGEiLCJkYXRhU3RyaW5nIiwidG9TdHJpbmciLCJwYXJzZSIsInJlcGxhY2UiLCJlbmQiLCJNU19WSUVXIiwiTVNfVklFV19VUkwiLCJodHRwUHJpdmF0ZUFwaVBvcnQiLCJzdG9wIiwic3RhcnQiLCJkZXN0cm95Il0sIm1hcHBpbmdzIjoiOztBQUNBLElBQUksQ0FBQ0EsT0FBT0MsY0FBWixFQUEyQkMsUUFBUSxnQkFBUjtBQUMzQjtBQUNBLElBQUlDLFFBQVFELFFBQVEsd0JBQVIsQ0FBWjtBQUNBLElBQUlFLFFBQVFGLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSUcsTUFBTUgsUUFBUSxtQkFBUixDQUFWO0FBQ0FFLE1BQU1FLE1BQU4sR0FBZSxJQUFmO0FBQ0EsSUFBSUMsVUFBVUwsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFJTSxVQUFVTixRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlPLElBQUlQLFFBQVEsS0FBUixDQUFSO0FBQ0EsSUFBSVEsT0FBT1IsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJUyxVQUFVVCxRQUFRLFVBQVIsRUFBb0JVLFVBQXBCLENBQStCLEVBQUNDLE9BQU8sSUFBUixFQUFjQyxLQUFLLElBQW5CLEVBQXlCQyxPQUFPLElBQWhDLEVBQXNDQyxNQUFNLElBQTVDLEVBQS9CLEVBQWlGLFdBQWpGLEVBQThGLE1BQTlGLEVBQXNHLE9BQXRHLENBQWQ7QUFDQSxJQUFJQyxRQUFRZixRQUFRLFVBQVIsQ0FBWjs7QUFFQU8sRUFBRVMsSUFBRixDQUFPLHNCQUFQLEVBQStCO0FBQy9CO0FBRCtCLENBQS9CLEVBRUcsU0FBZUMsUUFBZixDQUF5QlYsQ0FBekI7QUFBQSwwRkFXY1csY0FYZDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBV2NBLHdCQVhkLFlBV2NBLGNBWGQsQ0FXOEJYLENBWDlCO0FBQUEsZ0JBV2lDWSxLQVhqQyx1RUFXeUMsRUFYekM7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QkFBUUUsS0FBUixDQUFjLGdCQUFkLEVBQWdDdUUsY0FBYyxXQUE5QztBQUNBN0UsOEJBQVEyQyxRQUFSLENBQWlCa0MsY0FBYyxXQUEvQixFQUE0Q2pDLEVBQTVDLENBQStDLFVBQS9DLEVBQTJELFVBQVVDLFlBQVYsRUFBd0JDLFFBQXhCLEVBQWtDO0FBQzNGMUMsZ0NBQVFFLEtBQVIsQ0FBYyxtQkFBZCxFQUFtQ3dDLFFBQW5DLEVBQTZDRCxZQUE3QztBQUNBTjtBQUNELHVCQUhEO0FBSUQscUJBTkssQ0FEZTs7QUFBQTs7QUFTckJyQyxzQkFBRXlFLEdBQUY7O0FBVHFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQWpCLENBL0xMOztBQUFBO0FBQUE7QUFBQSwwQ0EwTUssSUFBSXJDLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWEwQixXQUFXMUIsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQTFNTDs7QUFBQTtBQTJNRHFDLGtCQUFRRyxJQUFSOztBQUVBeEQsdUJBQWF3RCxJQUFiO0FBQ0FwQiw0QkFBa0JvQixJQUFsQjtBQUNBbkIsNEJBQWtCbUIsSUFBbEI7QUFDQWxCLGtCQUFRa0IsSUFBUjtBQUNBSCxrQkFBUUcsSUFBUjtBQUNBVix5Q0FBK0JZLE9BQS9CO0FBQ0EvRSxZQUFFeUUsR0FBRjtBQW5OQztBQUFBLDBDQW9OSyxJQUFJckMsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYTBCLFdBQVcxQixPQUFYLEVBQW9CLE1BQXBCLENBQWI7QUFBQSxXQUFaLENBcE5MOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgiLCJmaWxlIjoiYmFzZS50ZXN0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaWYgKCFnbG9iYWwuX2JhYmVsUG9seWZpbGwpcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKVxuLy8gdmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgZGVyZWYgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1kZXJlZi1zeW5jJylcbnZhciBmYWtlciA9IHJlcXVpcmUoJ2Zha2VyJylcbnZhciBqc2YgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1mYWtlcicpXG5mYWtlci5sb2NhbGUgPSAnaXQnXG52YXIgcmVzdGxlciA9IHJlcXVpcmUoJ3Jlc3RsZXInKVxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0JylcbnZhciB0ID0gcmVxdWlyZSgndGFwJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgQ09OU09MRSA9IHJlcXVpcmUoJy4uL2plc3VzJykuZ2V0Q29uc29sZSh7ZGVidWc6IHRydWUsIGxvZzogdHJ1ZSwgZXJyb3I6IHRydWUsIHdhcm46IHRydWV9LCdCQVNFIFRFU1QnLCAnLS0tLScsICctLS0tLScpXG52YXIgamVzdXMgPSByZXF1aXJlKCcuLi9qZXN1cycpXG5cbnQudGVzdCgnKioqIFNFUlZJQ0VTIE5FVCAqKionLCB7XG4vLyAgYXV0b2VuZDogdHJ1ZVxufSwgYXN5bmMgZnVuY3Rpb24gbWFpblRlc3QgKHQpIHtcbiAgdmFyIE1TX1JFU09VUkNFUyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvcmVzb3VyY2VzL3N0YXJ0JykoKVxuICB2YXIgTVNfRVZFTlRTX0VNSVRURVIgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL2V2ZW50c0VtaXR0ZXIvc3RhcnQnKSgpXG4gIHZhciBNU19BVVRIT1JJWkFUSU9OUyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvYXV0aG9yaXphdGlvbnMvc3RhcnQnKSgpXG4gIHZhciBNU19MT0dTID0gYXdhaXQgcmVxdWlyZSgnLi9zZXJ2aWNlcy9sb2dzL3N0YXJ0JykoKVxuICB2YXIgTVNfRVZFTlRTX0VNSVRURVJfVVJMID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtNU19FVkVOVFNfRU1JVFRFUi5TSEFSRURfQ09ORklHLmh0dHBQdWJsaWNBcGlQb3J0fS9gXG5cbiAgYXdhaXQgamVzdXMuc2V0U2hhcmVkQ29uZmlnKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy8nKSwgJ3ZpZXcnLCAnZXZlbnRzLmxpc3RlbicsIHt9KVxuXG4gIHQucGxhbig2KVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHJlc291cmNlSW5zZXJ0ICh0LCBsb29wcyA9IDEwLCBzdGVwcyA9IDEwMCkge1xuICAgIHZhciBtZXRob2RzQ29uZmlnID0gcmVxdWlyZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvc2VydmljZXMvcmVzb3VyY2VzL21ldGhvZHMuanNvbicpKVxuICAgIHZhciBkZXJlZk9wdGlvbnMgPSB7YmFzZUZvbGRlcjogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc2hhcmVkL3NlcnZpY2VzL3Jlc291cmNlcy8nKSwgZmFpbE9uTWlzc2luZzogdHJ1ZX1cbiAgICBDT05TT0xFLmRlYnVnKCdURVNUJywgJ21ldGhvZHNDb25maWcnLCBtZXRob2RzQ29uZmlnKVxuICAgIHZhciBiYXNlVXJsID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtNU19SRVNPVVJDRVMuU0hBUkVEX0NPTkZJRy5odHRwUHVibGljQXBpUG9ydH0vYFxuICAgIENPTlNPTEUuZGVidWcoJ1RFU1QnLCAnYmFzZVVybCcsIGJhc2VVcmwpXG4gICAgdmFyIHNjaGVtYUNyZWF0ZSA9IGRlcmVmKG1ldGhvZHNDb25maWcuY3JlYXRlUmVzb3VyY2UucmVxdWVzdFNjaGVtYSwgZGVyZWZPcHRpb25zKVxuICAgIHZhciBzY2hlbWFSZWFkID0gZGVyZWYobWV0aG9kc0NvbmZpZy5yZWFkUmVzb3VyY2UucmVxdWVzdFNjaGVtYSwgZGVyZWZPcHRpb25zKVxuICAgIHZhciBzY2hlbWFVcGRhdGUgPSBkZXJlZihtZXRob2RzQ29uZmlnLnVwZGF0ZVJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcbiAgICB2YXIgc2NoZW1hRGVsZXRlID0gZGVyZWYobWV0aG9kc0NvbmZpZy5kZWxldGVSZXNvdXJjZS5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG5cbiAgICBDT05TT0xFLmRlYnVnKCdqc29uIHNjaGVtYSBmYWtlciBzY2hlbWEnLCBkZXJlZk9wdGlvbnMsIHtzY2hlbWFDcmVhdGUsIHNjaGVtYVJlYWQsIHNjaGVtYVVwZGF0ZSwgc2NoZW1hRGVsZXRlfSlcbiAgICBDT05TT0xFLmRlYnVnKCdqc29uIHNjaGVtYSBmYWtlciBzY2hlbWEgZXhhbXBsZXMnLCBqc2Yoc2NoZW1hQ3JlYXRlKSwganNmKHNjaGVtYVJlYWQpLCBqc2Yoc2NoZW1hVXBkYXRlKSwganNmKHNjaGVtYURlbGV0ZSksKVxuICAgIHZhciB0ZXN0RGF0YVRvU2VuZCA9IFtdXG4gICAgLy8gYXdhaXQgdC50ZXN0KCdOTyBDT01QUkVTU0lPTicsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgLy8gICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgLy8gICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICdjcmVhdGVSZXNvdXJjZScpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgLy8gICAgICAgQ09OU09MRS5kZWJ1ZygncmVidWlsZFZpZXdzIHJlY2VpdmUnLCByZXNwb25zZSwgZGF0YVJlc3BvbnNlKVxuICAgIC8vICAgICAgIHJlc29sdmUoKVxuICAgIC8vICAgICB9KVxuICAgIC8vICAgfSlcbiAgICAvL1xuICAgIC8vICAgdC5lbmQoKVxuICAgIC8vIH0pXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29wczsgaSsrKSB7XG4gICAgICAvLyBDT05TT0xFLmdyb3VwKGBURVNUIFJJR0hUIERBVEEgJHtpfWApXG4gICAgICAvLyBDT05TT0xFLmdyb3VwKGBjcmVhdGVSZXNvdXJjZWApXG4gICAgICB2YXIgY3JlYXRlZFJlc3BvbnNlXG4gICAgICB2YXIgY3JlYXRlUmVxdWVzdCA9IGpzZihzY2hlbWFDcmVhdGUpXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQgY3JlYXRlUmVxdWVzdCcsIEpTT04uc3RyaW5naWZ5KGNyZWF0ZVJlcXVlc3QpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAnY3JlYXRlUmVzb3VyY2UnLCBjcmVhdGVSZXF1ZXN0KS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ3JlY2VpdmUnLCBKU09OLnN0cmluZ2lmeShkYXRhUmVzcG9uc2UpKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgY3JlYXRlUmVzb3VyY2UgaXMgb2JqZWN0JylcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLmlkLCAnc3RyaW5nJywgJ1Jlc3BvbnNlIGNyZWF0ZVJlc291cmNlIGlkIGlzIHN0cmluZyAnICsgZGF0YVJlc3BvbnNlLmlkKVxuICAgICAgICAgIGNyZWF0ZWRSZXNwb25zZSA9IGRhdGFSZXNwb25zZVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGlmIChzdGVwcyA9PT0gMSkgY29udGludWVcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXBFbmQoKVxuICAgICAgLy8gQ09OU09MRS5ncm91cChgcmVhZFJlc291cmNlIEZyb20gaWRgKVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB2YXIgZGF0YSA9IHtpZDogY3JlYXRlZFJlc3BvbnNlLmlkLCB1c2VySWQ6ICd0ZXN0JywgdG9rZW46ICd0ZXN0J31cbiAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCcsIHNjaGVtYVJlYWQsIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAncmVhZFJlc291cmNlJywgZGF0YSkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHJlYWRSZXNvdXJjZSBpcyBvYmplY3QnKVxuICAgICAgICAgIHQuc2FtZShkYXRhUmVzcG9uc2UuYm9keSwgY3JlYXRlUmVxdWVzdC5kYXRhLmJvZHksICdSZXNwb25zZSByZWFkUmVzb3VyY2UgIGJvZHkgYXMgc2VuZGVkLCBpZDonICsgZGF0YVJlc3BvbnNlLl9pZClcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICAvLyBDT05TT0xFLmdyb3VwRW5kKClcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXAoYHVwZGF0ZVJlc291cmNlYClcbiAgICAgIHNjaGVtYVVwZGF0ZS5wcm9wZXJ0aWVzLmRhdGEucmVxdWlyZWQgPSBbJ2JvZHknXVxuICAgICAgdmFyIHVwZGF0ZVJlcXVlc3QgPSBqc2Yoc2NoZW1hVXBkYXRlKVxuICAgICAgdXBkYXRlUmVxdWVzdC5pZCA9IGNyZWF0ZWRSZXNwb25zZS5pZFxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdzZW5kJywgc2NoZW1hVXBkYXRlLCBKU09OLnN0cmluZ2lmeSh1cGRhdGVSZXF1ZXN0KSlcbiAgICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ3VwZGF0ZVJlc291cmNlJywgdXBkYXRlUmVxdWVzdCkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHVwZGF0ZVJlc291cmNlIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC5zYW1lKGRhdGFSZXNwb25zZS5pZCwgY3JlYXRlZFJlc3BvbnNlLmlkLCAnUmVzcG9uc2UgdXBkYXRlUmVzb3VyY2UgIGlkIGFzIHNlbmRlZCwgaWQ6JyArIGRhdGFSZXNwb25zZS5pZClcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICAvLyBDT05TT0xFLmdyb3VwRW5kKClcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXAoYHJlYWRSZXNvdXJjZSBGcm9tIGRhdGEvX2lkYClcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdmFyIGRhdGEgPSB7aWQ6IGNyZWF0ZWRSZXNwb25zZS5pZCwgdXNlcklkOiAndGVzdCcsIHRva2VuOiAndGVzdCd9XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQnLCBzY2hlbWFSZWFkLCBKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ3JlYWRSZXNvdXJjZScsIGRhdGEpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSByZWFkUmVzb3VyY2UgaXMgb2JqZWN0JylcbiAgICAgICAgICB0LnNhbWUoZGF0YVJlc3BvbnNlLmJvZHksIHVwZGF0ZVJlcXVlc3QuZGF0YS5ib2R5LCAnUmVzcG9uc2UgcmVhZFJlc291cmNlIGJvZHkgYXMgdXBkYXRlZCwgaWQ6JyArIGRhdGFSZXNwb25zZS5faWQpXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLy8gQ09OU09MRS5ncm91cEVuZCgpXG4gICAgICAvLyBDT05TT0xFLmdyb3VwRW5kKClcbiAgICB9XG4gIH1cblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMCAtIEVWRU5UU19FTUlUVEVSIGNoaWFtYXRhIGFsbG8gc3RyZWFtaW5nIGRlZ2xpIGV2ZW50aSAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgdmFyIE1TX0VWRU5UU19FTUlUVEVSX3JlcXVlc3RIdHRwXG4gIHZhciBNU19FVkVOVFNfRU1JVFRFUl9yZXNwb25zZUh0dHBcblxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgMCcsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgTVNfRVZFTlRTX0VNSVRURVJfcmVxdWVzdEh0dHAgPSByZXF1ZXN0KFxuICAgICAgICB7IG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJpOiBNU19FVkVOVFNfRU1JVFRFUl9VUkwgKyAnbGlzdGVuRXZlbnRzJ1xuICAgICAgICB9KVxuICAgICAgTVNfRVZFTlRTX0VNSVRURVJfcmVxdWVzdEh0dHAub24oJ3Jlc3BvbnNlJywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ1RFU1QgSFRUUCBTVFJFQU1JTkcgUkVTUE9OU0UnLCByZXNwb25zZSlcbiAgICAgICAgTVNfRVZFTlRTX0VNSVRURVJfcmVzcG9uc2VIdHRwID0gcmVzcG9uc2VcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgICAgLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdURVNUIEhUVFAgU1RSRUFNSU5HIEVSUk9SJywgZXJyb3IpXG4gICAgICAgIHJlamVjdCgpXG4gICAgICB9KVxuICAgICAgLm9uKCdkYXRhJywgZnVuY3Rpb24gKGJpbkRhdGEpIHtcbiAgICAgICAgdmFyIGRhdGFTdHJpbmcgPSBiaW5EYXRhLnRvU3RyaW5nKCd1dGY4JylcbiAgICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKGRhdGFTdHJpbmcucmVwbGFjZSgnZGF0YTogJywgJycpKVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdURVNUIEhUVFAgU1RSRUFNSU5HIERBVEEnLCBkYXRhLCBNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHQuZW5kKClcbiAgfSlcbiAgQ09OU09MRS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUFJFUEFSSU5HIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDEgLSBJbnNlcmltZW50byBEYXRpIChNU19WSUVXIHNwZW50byktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDEgLSBJbnNlcmltZW50byBEYXRpIChNU19WSUVXIHNwZW50byknLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IHJlc291cmNlSW5zZXJ0KHQsIDEpXG4gICAgdC5lbmQoKVxuICB9KVxuICAvL1xuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFNUT1AgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtIGFjY2VuZG8gTVNfVklFVy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICB2YXIgTVNfVklFVyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvdmlldy9zdGFydCcpKClcbiAgdmFyIE1TX1ZJRVdfVVJMID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtNU19WSUVXLlNIQVJFRF9DT05GSUcuaHR0cFByaXZhdGVBcGlQb3J0fS9gXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMi4xIC0gTVNfVklFVyByZWJ1aWxkVmlld3MgKE1TX1ZJRVcgZG92cmViYmUgcmVjdXBlcmFyZWkgZGF0aSBpbnNlcml0aSBpbiBwcmVjZWRlbnphKS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgMi4xJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBDT05TT0xFLmRlYnVnKCdzZW5kIHJlYnVpbGRWaWV3cycsIE1TX1ZJRVdfVVJMICsgJ3JlYnVpbGRWaWV3cycpXG4gICAgICByZXN0bGVyLnBvc3RKc29uKE1TX1ZJRVdfVVJMICsgJ3JlYnVpbGRWaWV3cycpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3JlYnVpbGRWaWV3cyByZWNlaXZlJywgcmVzcG9uc2UsIGRhdGFSZXNwb25zZSlcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgIH0pXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtIGFnZ2l1bmdvIGV2ZW50byB2aWV3c1VwZGF0ZWQgYSBNU19WSUVXLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICBhd2FpdCBqZXN1cy5zZXRTaGFyZWRDb25maWcocGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc2hhcmVkL3NlcnZpY2VzLycpLCAndmlldycsICdldmVudHMubGlzdGVuJywge1xuICAgICd2aWV3c1VwZGF0ZWQnOiB7XG4gICAgICAnbWV0aG9kJzogJ3ZpZXdzVXBkYXRlZCcsXG4gICAgICAnaGF2ZVJlc3BvbnNlJzogZmFsc2VcbiAgICB9XG4gIH0pXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMi4yIC0gSW5zZXJpbWVudG8gRGF0aSAoTVNfVklFVyBhY2Nlc28sZG92cmViYmUgYWdnaW9ybmFyc2kgbGl2ZSktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcblxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgMi4yJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCByZXNvdXJjZUluc2VydCh0LCA1LCAxKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCA1MDAwKSlcbiAgYXdhaXQgamVzdXMuc2V0U2hhcmVkQ29uZmlnKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy8nKSwgJ3ZpZXcnLCAnZXZlbnRzLmxpc3RlbicsIHt9KVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgTVNfVklFVy5zdG9wKClcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVE9QIC0gTVNfVklFVyBzdG9wcGVkLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpXG5cbiAgQ09OU09MRS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVEVTVCAzIC0gSW5zZXJpbWVudG8gRGF0aSAoTVNfVklFVyBzdG9wcGVkKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDMnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IHJlc291cmNlSW5zZXJ0KHQsIDUsIDEpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtIE1TX1ZJRVcgc3RhcnRpbmctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgTVNfVklFVy5zdGFydCgpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgNCAtIE1TX1ZJRVcgc3luY1ZpZXdzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgNCcsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCBzeW5jVmlld3MnLCBNU19WSUVXX1VSTCArICdzeW5jVmlld3MnKVxuICAgICAgcmVzdGxlci5wb3N0SnNvbihNU19WSUVXX1VSTCArICdzeW5jVmlld3MnKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdzeW5jVmlld3MgcmVjZWl2ZScsIHJlc3BvbnNlLCBkYXRhUmVzcG9uc2UpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdC5lbmQoKVxuICB9KVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCA1MDAwKSlcbiAgTVNfVklFVy5zdG9wKClcblxuICBNU19SRVNPVVJDRVMuc3RvcCgpXG4gIE1TX0VWRU5UU19FTUlUVEVSLnN0b3AoKVxuICBNU19BVVRIT1JJWkFUSU9OUy5zdG9wKClcbiAgTVNfTE9HUy5zdG9wKClcbiAgTVNfVklFVy5zdG9wKClcbiAgTVNfRVZFTlRTX0VNSVRURVJfcmVzcG9uc2VIdHRwLmRlc3Ryb3koKVxuICB0LmVuZCgpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDAwMCkpXG59KVxuIl19