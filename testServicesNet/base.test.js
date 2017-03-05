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

          console.log("http://127.0.0.1:1090/inspector");
          CONSOLE.debug('-------------------------------------- PREPARING -------------------------------------------');
          _context8.next = 21;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 2000);
          }));

        case 21:

          CONSOLE.debug('-------------------------------------- TEST 0 - EVENTS_EMITTER chiamata allo streaming degli eventi  ------------------------------------------');
          _context8.next = 24;
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
                        CONSOLE.debug('TEST HTTP STREAMING DATA', dataString, MS_EVENTS_EMITTER_requestHttp);
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

        case 24:
          CONSOLE.debug('-------------------------------------- PREPARING -------------------------------------------');
          _context8.next = 27;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 27:

          CONSOLE.debug('-------------------------------------- TEST 1 - Inserimento Dati (MS_VIEW spento)-------------------------------------------');
          _context8.next = 30;
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

        case 30:
          //

          CONSOLE.debug('-------------------------------------- STOP -------------------------------------------');
          _context8.next = 33;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 33:

          CONSOLE.debug('-------------------------------------- PREPARING - accendo MS_VIEW-------------------------------------------');
          _context8.next = 36;
          return regeneratorRuntime.awrap(require('./services/view/start')());

        case 36:
          MS_VIEW = _context8.sent;
          MS_VIEW_URL = 'http://127.0.0.1:' + MS_VIEW.SHARED_CONFIG.httpPrivateApiPort + '/';
          _context8.next = 40;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 40:

          CONSOLE.debug('-------------------------------------- TEST 2.1 - MS_VIEW rebuildViews (MS_VIEW dovrebbe recuperarei dati inseriti in precedenza)-------------------------------------------');
          _context8.next = 43;
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

        case 43:

          CONSOLE.debug('-------------------------------------- PREPARING - aggiungo evento viewsUpdated a MS_VIEW-------------------------------------------');
          _context8.next = 46;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 46:
          _context8.next = 48;
          return regeneratorRuntime.awrap(jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {
            'viewsUpdated': {
              'method': 'viewsUpdated',
              'haveResponse': false
            }
          }));

        case 48:
          _context8.next = 50;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 50:

          CONSOLE.debug('-------------------------------------- TEST 2.2 - Inserimento Dati (MS_VIEW acceso,dovrebbe aggiornarsi live)-------------------------------------------');

          _context8.next = 53;
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

        case 53:
          _context8.next = 55;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 55:
          _context8.next = 57;
          return regeneratorRuntime.awrap(jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {}));

        case 57:
          _context8.next = 59;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 59:
          MS_VIEW.stop();

          CONSOLE.debug('-------------------------------------- STOP - MS_VIEW stopped------------------------------------------');
          _context8.next = 63;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 63:

          CONSOLE.debug('-------------------------------------- TEST 3 - Inserimento Dati (MS_VIEW stopped) -------------------------------------------');
          _context8.next = 66;
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

        case 66:

          CONSOLE.debug('-------------------------------------- PREPARING - MS_VIEW starting-------------------------------------------');
          _context8.next = 69;
          return regeneratorRuntime.awrap(MS_VIEW.start());

        case 69:
          _context8.next = 71;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 71:

          CONSOLE.debug('-------------------------------------- TEST 4 - MS_VIEW syncViews -------------------------------------------');
          _context8.next = 74;
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

        case 74:
          _context8.next = 76;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 76:
          MS_VIEW.stop();

          MS_RESOURCES.stop();
          MS_EVENTS_EMITTER.stop();
          MS_AUTHORIZATIONS.stop();
          MS_LOGS.stop();
          MS_VIEW.stop();
          MS_EVENTS_EMITTER_responseHttp.destroy();
          t.end();
          _context8.next = 86;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 100000);
          }));

        case 86:
        case 'end':
          return _context8.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiZGVyZWYiLCJmYWtlciIsImpzZiIsImxvY2FsZSIsInJlc3RsZXIiLCJyZXF1ZXN0IiwidCIsInBhdGgiLCJDT05TT0xFIiwiZ2V0Q29uc29sZSIsImRlYnVnIiwibG9nIiwiZXJyb3IiLCJ3YXJuIiwiamVzdXMiLCJ0ZXN0IiwibWFpblRlc3QiLCJyZXNvdXJjZUluc2VydCIsImxvb3BzIiwic3RlcHMiLCJtZXRob2RzQ29uZmlnIiwiam9pbiIsIl9fZGlybmFtZSIsImRlcmVmT3B0aW9ucyIsImJhc2VGb2xkZXIiLCJmYWlsT25NaXNzaW5nIiwiYmFzZVVybCIsIk1TX1JFU09VUkNFUyIsIlNIQVJFRF9DT05GSUciLCJodHRwUHVibGljQXBpUG9ydCIsInNjaGVtYUNyZWF0ZSIsImNyZWF0ZVJlc291cmNlIiwicmVxdWVzdFNjaGVtYSIsInNjaGVtYVJlYWQiLCJyZWFkUmVzb3VyY2UiLCJzY2hlbWFVcGRhdGUiLCJ1cGRhdGVSZXNvdXJjZSIsInNjaGVtYURlbGV0ZSIsImRlbGV0ZVJlc291cmNlIiwidGVzdERhdGFUb1NlbmQiLCJpIiwiY3JlYXRlUmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiSlNPTiIsInN0cmluZ2lmeSIsInBvc3RKc29uIiwib24iLCJkYXRhUmVzcG9uc2UiLCJyZXNwb25zZSIsInR5cGUiLCJpZCIsImNyZWF0ZWRSZXNwb25zZSIsImRhdGEiLCJ1c2VySWQiLCJ0b2tlbiIsInNhbWUiLCJib2R5IiwiX2lkIiwicHJvcGVydGllcyIsInJlcXVpcmVkIiwidXBkYXRlUmVxdWVzdCIsIk1TX0VWRU5UU19FTUlUVEVSIiwiTVNfQVVUSE9SSVpBVElPTlMiLCJNU19MT0dTIiwiTVNfRVZFTlRTX0VNSVRURVJfVVJMIiwic2V0U2hhcmVkQ29uZmlnIiwicGxhbiIsImNvbnNvbGUiLCJzZXRUaW1lb3V0IiwiTVNfRVZFTlRTX0VNSVRURVJfcmVxdWVzdEh0dHAiLCJtZXRob2QiLCJ1cmkiLCJNU19FVkVOVFNfRU1JVFRFUl9yZXNwb25zZUh0dHAiLCJiaW5EYXRhIiwiZGF0YVN0cmluZyIsInRvU3RyaW5nIiwiZW5kIiwiTVNfVklFVyIsIk1TX1ZJRVdfVVJMIiwiaHR0cFByaXZhdGVBcGlQb3J0Iiwic3RvcCIsInN0YXJ0IiwiZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLENBQUNBLE9BQU9DLGNBQVosRUFBMkJDLFFBQVEsZ0JBQVI7QUFDM0I7QUFDQSxJQUFJQyxRQUFRRCxRQUFRLHdCQUFSLENBQVo7QUFDQSxJQUFJRSxRQUFRRixRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlHLE1BQU1ILFFBQVEsbUJBQVIsQ0FBVjtBQUNBRSxNQUFNRSxNQUFOLEdBQWUsSUFBZjtBQUNBLElBQUlDLFVBQVVMLFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBSU0sVUFBVU4sUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFJTyxJQUFJUCxRQUFRLEtBQVIsQ0FBUjtBQUNBLElBQUlRLE9BQU9SLFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSVMsVUFBVVQsUUFBUSxVQUFSLEVBQW9CVSxVQUFwQixDQUErQixFQUFDQyxPQUFPLElBQVIsRUFBY0MsS0FBSyxJQUFuQixFQUF5QkMsT0FBTyxJQUFoQyxFQUFzQ0MsTUFBTSxJQUE1QyxFQUEvQixFQUFpRixXQUFqRixFQUE4RixNQUE5RixFQUFzRyxPQUF0RyxDQUFkO0FBQ0EsSUFBSUMsUUFBUWYsUUFBUSxVQUFSLENBQVo7O0FBRUFPLEVBQUVTLElBQUYsQ0FBTyxzQkFBUCxFQUErQjtBQUMvQjtBQUQrQixDQUEvQixFQUVHLFNBQWVDLFFBQWYsQ0FBeUJWLENBQXpCO0FBQUEsMEZBV2NXLGNBWGQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdjQSx3QkFYZCxZQVdjQSxjQVhkLENBVzhCWCxDQVg5QjtBQUFBLGdCQVdpQ1ksS0FYakMsdUVBV3lDLEVBWHpDO0FBQUEsZ0JB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QUFpQmlDLGNBQWMsV0FBL0IsRUFBNENoQyxFQUE1QyxDQUErQyxVQUEvQyxFQUEyRCxVQUFVQyxZQUFWLEVBQXdCQyxRQUF4QixFQUFrQztBQUMzRjFDLGdDQUFRRSxLQUFSLENBQWMsbUJBQWQsRUFBbUN3QyxRQUFuQyxFQUE2Q0QsWUFBN0M7QUFDQU47QUFDRCx1QkFIRDtBQUlELHFCQU5LLENBRGU7O0FBQUE7O0FBU3JCckMsc0JBQUV3RSxHQUFGOztBQVRxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFqQixDQS9MTDs7QUFBQTtBQUFBO0FBQUEsMENBME1LLElBQUlwQyxPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLG1CQUFhMkIsV0FBVzNCLE9BQVgsRUFBb0IsSUFBcEIsQ0FBYjtBQUFBLFdBQVosQ0ExTUw7O0FBQUE7QUEyTURvQyxrQkFBUUcsSUFBUjs7QUFFQXZELHVCQUFhdUQsSUFBYjtBQUNBbkIsNEJBQWtCbUIsSUFBbEI7QUFDQWxCLDRCQUFrQmtCLElBQWxCO0FBQ0FqQixrQkFBUWlCLElBQVI7QUFDQUgsa0JBQVFHLElBQVI7QUFDQVIseUNBQStCVSxPQUEvQjtBQUNBOUUsWUFBRXdFLEdBQUY7QUFuTkM7QUFBQSwwQ0FvTkssSUFBSXBDLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWEyQixXQUFXM0IsT0FBWCxFQUFvQixNQUFwQixDQUFiO0FBQUEsV0FBWixDQXBOTDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUZIIiwiZmlsZSI6ImJhc2UudGVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmlmICghZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKXJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJylcbi8vIHZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIGRlcmVmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZGVyZWYtc3luYycpXG52YXIgZmFrZXIgPSByZXF1aXJlKCdmYWtlcicpXG52YXIganNmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZmFrZXInKVxuZmFrZXIubG9jYWxlID0gJ2l0J1xudmFyIHJlc3RsZXIgPSByZXF1aXJlKCdyZXN0bGVyJylcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpXG52YXIgdCA9IHJlcXVpcmUoJ3RhcCcpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIENPTlNPTEUgPSByZXF1aXJlKCcuLi9qZXN1cycpLmdldENvbnNvbGUoe2RlYnVnOiB0cnVlLCBsb2c6IHRydWUsIGVycm9yOiB0cnVlLCB3YXJuOiB0cnVlfSwnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxudmFyIGplc3VzID0gcmVxdWlyZSgnLi4vamVzdXMnKVxuXG50LnRlc3QoJyoqKiBTRVJWSUNFUyBORVQgKioqJywge1xuLy8gIGF1dG9lbmQ6IHRydWVcbn0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIHZhciBNU19SRVNPVVJDRVMgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL3Jlc291cmNlcy9zdGFydCcpKClcbiAgdmFyIE1TX0VWRU5UU19FTUlUVEVSID0gYXdhaXQgcmVxdWlyZSgnLi9zZXJ2aWNlcy9ldmVudHNFbWl0dGVyL3N0YXJ0JykoKVxuICB2YXIgTVNfQVVUSE9SSVpBVElPTlMgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL2F1dGhvcml6YXRpb25zL3N0YXJ0JykoKVxuICB2YXIgTVNfTE9HUyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvbG9ncy9zdGFydCcpKClcbiAgdmFyIE1TX0VWRU5UU19FTUlUVEVSX1VSTCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7TVNfRVZFTlRTX0VNSVRURVIuU0hBUkVEX0NPTkZJRy5odHRwUHVibGljQXBpUG9ydH0vYFxuXG4gIGF3YWl0IGplc3VzLnNldFNoYXJlZENvbmZpZyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvc2VydmljZXMvJyksICd2aWV3JywgJ2V2ZW50cy5saXN0ZW4nLCB7fSlcblxuICB0LnBsYW4oNilcblxuICBhc3luYyBmdW5jdGlvbiByZXNvdXJjZUluc2VydCAodCwgbG9vcHMgPSAxMCwgc3RlcHMgPSAxMDApIHtcbiAgICB2YXIgbWV0aG9kc0NvbmZpZyA9IHJlcXVpcmUocGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc2hhcmVkL3NlcnZpY2VzL3Jlc291cmNlcy9tZXRob2RzLmpzb24nKSlcbiAgICB2YXIgZGVyZWZPcHRpb25zID0ge2Jhc2VGb2xkZXI6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy9yZXNvdXJjZXMvJyksIGZhaWxPbk1pc3Npbmc6IHRydWV9XG4gICAgQ09OU09MRS5kZWJ1ZygnVEVTVCcsICdtZXRob2RzQ29uZmlnJywgbWV0aG9kc0NvbmZpZylcbiAgICB2YXIgYmFzZVVybCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7TVNfUkVTT1VSQ0VTLlNIQVJFRF9DT05GSUcuaHR0cFB1YmxpY0FwaVBvcnR9L2BcbiAgICBDT05TT0xFLmRlYnVnKCdURVNUJywgJ2Jhc2VVcmwnLCBiYXNlVXJsKVxuICAgIHZhciBzY2hlbWFDcmVhdGUgPSBkZXJlZihtZXRob2RzQ29uZmlnLmNyZWF0ZVJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcbiAgICB2YXIgc2NoZW1hUmVhZCA9IGRlcmVmKG1ldGhvZHNDb25maWcucmVhZFJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcbiAgICB2YXIgc2NoZW1hVXBkYXRlID0gZGVyZWYobWV0aG9kc0NvbmZpZy51cGRhdGVSZXNvdXJjZS5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG4gICAgdmFyIHNjaGVtYURlbGV0ZSA9IGRlcmVmKG1ldGhvZHNDb25maWcuZGVsZXRlUmVzb3VyY2UucmVxdWVzdFNjaGVtYSwgZGVyZWZPcHRpb25zKVxuXG4gICAgQ09OU09MRS5kZWJ1ZygnanNvbiBzY2hlbWEgZmFrZXIgc2NoZW1hJywgZGVyZWZPcHRpb25zLCB7c2NoZW1hQ3JlYXRlLCBzY2hlbWFSZWFkLCBzY2hlbWFVcGRhdGUsIHNjaGVtYURlbGV0ZX0pXG4gICAgQ09OU09MRS5kZWJ1ZygnanNvbiBzY2hlbWEgZmFrZXIgc2NoZW1hIGV4YW1wbGVzJywganNmKHNjaGVtYUNyZWF0ZSksIGpzZihzY2hlbWFSZWFkKSwganNmKHNjaGVtYVVwZGF0ZSksIGpzZihzY2hlbWFEZWxldGUpLClcbiAgICB2YXIgdGVzdERhdGFUb1NlbmQgPSBbXVxuICAgIC8vIGF3YWl0IHQudGVzdCgnTk8gQ09NUFJFU1NJT04nLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIC8vICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIC8vICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAnY3JlYXRlUmVzb3VyY2UnKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgIC8vICAgICAgIENPTlNPTEUuZGVidWcoJ3JlYnVpbGRWaWV3cyByZWNlaXZlJywgcmVzcG9uc2UsIGRhdGFSZXNwb25zZSlcbiAgICAvLyAgICAgICByZXNvbHZlKClcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgIH0pXG4gICAgLy9cbiAgICAvLyAgIHQuZW5kKClcbiAgICAvLyB9KVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9vcHM7IGkrKykge1xuICAgICAgLy8gQ09OU09MRS5ncm91cChgVEVTVCBSSUdIVCBEQVRBICR7aX1gKVxuICAgICAgLy8gQ09OU09MRS5ncm91cChgY3JlYXRlUmVzb3VyY2VgKVxuICAgICAgdmFyIGNyZWF0ZWRSZXNwb25zZVxuICAgICAgdmFyIGNyZWF0ZVJlcXVlc3QgPSBqc2Yoc2NoZW1hQ3JlYXRlKVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdzZW5kIGNyZWF0ZVJlcXVlc3QnLCBKU09OLnN0cmluZ2lmeShjcmVhdGVSZXF1ZXN0KSlcbiAgICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ2NyZWF0ZVJlc291cmNlJywgY3JlYXRlUmVxdWVzdCkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIGNyZWF0ZVJlc291cmNlIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZS5pZCwgJ3N0cmluZycsICdSZXNwb25zZSBjcmVhdGVSZXNvdXJjZSBpZCBpcyBzdHJpbmcgJyArIGRhdGFSZXNwb25zZS5pZClcbiAgICAgICAgICBjcmVhdGVkUmVzcG9uc2UgPSBkYXRhUmVzcG9uc2VcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBpZiAoc3RlcHMgPT09IDEpIGNvbnRpbnVlXG4gICAgICAvLyBDT05TT0xFLmdyb3VwRW5kKClcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXAoYHJlYWRSZXNvdXJjZSBGcm9tIGlkYClcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdmFyIGRhdGEgPSB7aWQ6IGNyZWF0ZWRSZXNwb25zZS5pZCwgdXNlcklkOiAndGVzdCcsIHRva2VuOiAndGVzdCd9XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQnLCBzY2hlbWFSZWFkLCBKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ3JlYWRSZXNvdXJjZScsIGRhdGEpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSByZWFkUmVzb3VyY2UgaXMgb2JqZWN0JylcbiAgICAgICAgICB0LnNhbWUoZGF0YVJlc3BvbnNlLmJvZHksIGNyZWF0ZVJlcXVlc3QuZGF0YS5ib2R5LCAnUmVzcG9uc2UgcmVhZFJlc291cmNlICBib2R5IGFzIHNlbmRlZCwgaWQ6JyArIGRhdGFSZXNwb25zZS5faWQpXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLy8gQ09OU09MRS5ncm91cEVuZCgpXG4gICAgICAvLyBDT05TT0xFLmdyb3VwKGB1cGRhdGVSZXNvdXJjZWApXG4gICAgICBzY2hlbWFVcGRhdGUucHJvcGVydGllcy5kYXRhLnJlcXVpcmVkID0gWydib2R5J11cbiAgICAgIHZhciB1cGRhdGVSZXF1ZXN0ID0ganNmKHNjaGVtYVVwZGF0ZSlcbiAgICAgIHVwZGF0ZVJlcXVlc3QuaWQgPSBjcmVhdGVkUmVzcG9uc2UuaWRcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCcsIHNjaGVtYVVwZGF0ZSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlUmVxdWVzdCkpXG4gICAgICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICd1cGRhdGVSZXNvdXJjZScsIHVwZGF0ZVJlcXVlc3QpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSB1cGRhdGVSZXNvdXJjZSBpcyBvYmplY3QnKVxuICAgICAgICAgIHQuc2FtZShkYXRhUmVzcG9uc2UuaWQsIGNyZWF0ZWRSZXNwb25zZS5pZCwgJ1Jlc3BvbnNlIHVwZGF0ZVJlc291cmNlICBpZCBhcyBzZW5kZWQsIGlkOicgKyBkYXRhUmVzcG9uc2UuaWQpXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLy8gQ09OU09MRS5ncm91cEVuZCgpXG4gICAgICAvLyBDT05TT0xFLmdyb3VwKGByZWFkUmVzb3VyY2UgRnJvbSBkYXRhL19pZGApXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHZhciBkYXRhID0ge2lkOiBjcmVhdGVkUmVzcG9uc2UuaWQsIHVzZXJJZDogJ3Rlc3QnLCB0b2tlbjogJ3Rlc3QnfVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdzZW5kJywgc2NoZW1hUmVhZCwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gICAgICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICdyZWFkUmVzb3VyY2UnLCBkYXRhKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ3JlY2VpdmUnLCBKU09OLnN0cmluZ2lmeShkYXRhUmVzcG9uc2UpKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgcmVhZFJlc291cmNlIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC5zYW1lKGRhdGFSZXNwb25zZS5ib2R5LCB1cGRhdGVSZXF1ZXN0LmRhdGEuYm9keSwgJ1Jlc3BvbnNlIHJlYWRSZXNvdXJjZSBib2R5IGFzIHVwZGF0ZWQsIGlkOicgKyBkYXRhUmVzcG9uc2UuX2lkKVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXBFbmQoKVxuICAgICAgLy8gQ09OU09MRS5ncm91cEVuZCgpXG4gICAgfVxuICB9XG5cbiAgY29uc29sZS5sb2coXCJodHRwOi8vMTI3LjAuMC4xOjEwOTAvaW5zcGVjdG9yXCIpXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMjAwMCkpXG5cbiAgQ09OU09MRS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVEVTVCAwIC0gRVZFTlRTX0VNSVRURVIgY2hpYW1hdGEgYWxsbyBzdHJlYW1pbmcgZGVnbGkgZXZlbnRpICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICB2YXIgTVNfRVZFTlRTX0VNSVRURVJfcmVxdWVzdEh0dHBcbiAgdmFyIE1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cFxuXG4gIGF3YWl0IHQudGVzdCgnVEVTVCAwJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cCA9IHJlcXVlc3QoXG4gICAgICAgIHsgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmk6IE1TX0VWRU5UU19FTUlUVEVSX1VSTCArICdsaXN0ZW5FdmVudHMnXG4gICAgICAgIH0pXG4gICAgICBNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cC5vbigncmVzcG9uc2UnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnVEVTVCBIVFRQIFNUUkVBTUlORyBSRVNQT05TRScsIHJlc3BvbnNlKVxuICAgICAgICBNU19FVkVOVFNfRU1JVFRFUl9yZXNwb25zZUh0dHAgPSByZXNwb25zZVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgICAub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ1RFU1QgSFRUUCBTVFJFQU1JTkcgRVJST1InLCBlcnJvcilcbiAgICAgICAgcmVqZWN0KClcbiAgICAgIH0pXG4gICAgICAub24oJ2RhdGEnLCBmdW5jdGlvbiAoYmluRGF0YSkge1xuICAgICAgICB2YXIgZGF0YVN0cmluZyA9IGJpbkRhdGEudG9TdHJpbmcoJ3V0ZjgnKVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdURVNUIEhUVFAgU1RSRUFNSU5HIERBVEEnLCBkYXRhU3RyaW5nLCBNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHQuZW5kKClcbiAgfSlcbiAgQ09OU09MRS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUFJFUEFSSU5HIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDEgLSBJbnNlcmltZW50byBEYXRpIChNU19WSUVXIHNwZW50byktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDEgLSBJbnNlcmltZW50byBEYXRpIChNU19WSUVXIHNwZW50byknLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IHJlc291cmNlSW5zZXJ0KHQsIDEpXG4gICAgdC5lbmQoKVxuICB9KVxuICAvL1xuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFNUT1AgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtIGFjY2VuZG8gTVNfVklFVy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICB2YXIgTVNfVklFVyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvdmlldy9zdGFydCcpKClcbiAgdmFyIE1TX1ZJRVdfVVJMID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtNU19WSUVXLlNIQVJFRF9DT05GSUcuaHR0cFByaXZhdGVBcGlQb3J0fS9gXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMi4xIC0gTVNfVklFVyByZWJ1aWxkVmlld3MgKE1TX1ZJRVcgZG92cmViYmUgcmVjdXBlcmFyZWkgZGF0aSBpbnNlcml0aSBpbiBwcmVjZWRlbnphKS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgMi4xJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBDT05TT0xFLmRlYnVnKCdzZW5kIHJlYnVpbGRWaWV3cycsIE1TX1ZJRVdfVVJMICsgJ3JlYnVpbGRWaWV3cycpXG4gICAgICByZXN0bGVyLnBvc3RKc29uKE1TX1ZJRVdfVVJMICsgJ3JlYnVpbGRWaWV3cycpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3JlYnVpbGRWaWV3cyByZWNlaXZlJywgcmVzcG9uc2UsIGRhdGFSZXNwb25zZSlcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgIH0pXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtIGFnZ2l1bmdvIGV2ZW50byB2aWV3c1VwZGF0ZWQgYSBNU19WSUVXLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICBhd2FpdCBqZXN1cy5zZXRTaGFyZWRDb25maWcocGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc2hhcmVkL3NlcnZpY2VzLycpLCAndmlldycsICdldmVudHMubGlzdGVuJywge1xuICAgICd2aWV3c1VwZGF0ZWQnOiB7XG4gICAgICAnbWV0aG9kJzogJ3ZpZXdzVXBkYXRlZCcsXG4gICAgICAnaGF2ZVJlc3BvbnNlJzogZmFsc2VcbiAgICB9XG4gIH0pXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMi4yIC0gSW5zZXJpbWVudG8gRGF0aSAoTVNfVklFVyBhY2Nlc28sZG92cmViYmUgYWdnaW9ybmFyc2kgbGl2ZSktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcblxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgMi4yJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCByZXNvdXJjZUluc2VydCh0LCA1LCAxKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCA1MDAwKSlcbiAgYXdhaXQgamVzdXMuc2V0U2hhcmVkQ29uZmlnKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy8nKSwgJ3ZpZXcnLCAnZXZlbnRzLmxpc3RlbicsIHt9KVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgTVNfVklFVy5zdG9wKClcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVE9QIC0gTVNfVklFVyBzdG9wcGVkLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpXG5cbiAgQ09OU09MRS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVEVTVCAzIC0gSW5zZXJpbWVudG8gRGF0aSAoTVNfVklFVyBzdG9wcGVkKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDMnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IHJlc291cmNlSW5zZXJ0KHQsIDUsIDEpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtIE1TX1ZJRVcgc3RhcnRpbmctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgTVNfVklFVy5zdGFydCgpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgNCAtIE1TX1ZJRVcgc3luY1ZpZXdzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgNCcsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCBzeW5jVmlld3MnLCBNU19WSUVXX1VSTCArICdzeW5jVmlld3MnKVxuICAgICAgcmVzdGxlci5wb3N0SnNvbihNU19WSUVXX1VSTCArICdzeW5jVmlld3MnKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdzeW5jVmlld3MgcmVjZWl2ZScsIHJlc3BvbnNlLCBkYXRhUmVzcG9uc2UpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdC5lbmQoKVxuICB9KVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCA1MDAwKSlcbiAgTVNfVklFVy5zdG9wKClcblxuICBNU19SRVNPVVJDRVMuc3RvcCgpXG4gIE1TX0VWRU5UU19FTUlUVEVSLnN0b3AoKVxuICBNU19BVVRIT1JJWkFUSU9OUy5zdG9wKClcbiAgTVNfTE9HUy5zdG9wKClcbiAgTVNfVklFVy5zdG9wKClcbiAgTVNfRVZFTlRTX0VNSVRURVJfcmVzcG9uc2VIdHRwLmRlc3Ryb3koKVxuICB0LmVuZCgpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDAwMCkpXG59KVxuIl19