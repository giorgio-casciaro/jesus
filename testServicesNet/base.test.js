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
var CONSOLE = require('../jesus').getConsole(false, 'BASE TEST', '----', '-----');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiZGVyZWYiLCJmYWtlciIsImpzZiIsImxvY2FsZSIsInJlc3RsZXIiLCJyZXF1ZXN0IiwidCIsInBhdGgiLCJDT05TT0xFIiwiZ2V0Q29uc29sZSIsImplc3VzIiwidGVzdCIsIm1haW5UZXN0IiwicmVzb3VyY2VJbnNlcnQiLCJsb29wcyIsInN0ZXBzIiwibWV0aG9kc0NvbmZpZyIsImpvaW4iLCJfX2Rpcm5hbWUiLCJkZXJlZk9wdGlvbnMiLCJiYXNlRm9sZGVyIiwiZmFpbE9uTWlzc2luZyIsImRlYnVnIiwiYmFzZVVybCIsIk1TX1JFU09VUkNFUyIsIlNIQVJFRF9DT05GSUciLCJodHRwUHVibGljQXBpUG9ydCIsInNjaGVtYUNyZWF0ZSIsImNyZWF0ZVJlc291cmNlIiwicmVxdWVzdFNjaGVtYSIsInNjaGVtYVJlYWQiLCJyZWFkUmVzb3VyY2UiLCJzY2hlbWFVcGRhdGUiLCJ1cGRhdGVSZXNvdXJjZSIsInNjaGVtYURlbGV0ZSIsImRlbGV0ZVJlc291cmNlIiwidGVzdERhdGFUb1NlbmQiLCJpIiwiY3JlYXRlUmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiSlNPTiIsInN0cmluZ2lmeSIsInBvc3RKc29uIiwib24iLCJkYXRhUmVzcG9uc2UiLCJyZXNwb25zZSIsInR5cGUiLCJpZCIsImNyZWF0ZWRSZXNwb25zZSIsImRhdGEiLCJ1c2VySWQiLCJ0b2tlbiIsInNhbWUiLCJib2R5IiwiX2lkIiwicHJvcGVydGllcyIsInJlcXVpcmVkIiwidXBkYXRlUmVxdWVzdCIsIk1TX0VWRU5UU19FTUlUVEVSIiwiTVNfQVVUSE9SSVpBVElPTlMiLCJNU19MT0dTIiwiTVNfRVZFTlRTX0VNSVRURVJfVVJMIiwic2V0U2hhcmVkQ29uZmlnIiwicGxhbiIsInNldFRpbWVvdXQiLCJNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cCIsIm1ldGhvZCIsInVyaSIsIk1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cCIsImVycm9yIiwiYmluRGF0YSIsImRhdGFTdHJpbmciLCJ0b1N0cmluZyIsInBhcnNlIiwicmVwbGFjZSIsImVuZCIsIk1TX1ZJRVciLCJNU19WSUVXX1VSTCIsImh0dHBQcml2YXRlQXBpUG9ydCIsInN0b3AiLCJzdGFydCIsImRlc3Ryb3kiXSwibWFwcGluZ3MiOiI7O0FBQ0EsSUFBSSxDQUFDQSxPQUFPQyxjQUFaLEVBQTJCQyxRQUFRLGdCQUFSO0FBQzNCO0FBQ0EsSUFBSUMsUUFBUUQsUUFBUSx3QkFBUixDQUFaO0FBQ0EsSUFBSUUsUUFBUUYsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJRyxNQUFNSCxRQUFRLG1CQUFSLENBQVY7QUFDQUUsTUFBTUUsTUFBTixHQUFlLElBQWY7QUFDQSxJQUFJQyxVQUFVTCxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlNLFVBQVVOLFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBSU8sSUFBSVAsUUFBUSxLQUFSLENBQVI7QUFDQSxJQUFJUSxPQUFPUixRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlTLFVBQVVULFFBQVEsVUFBUixFQUFvQlUsVUFBcEIsQ0FBK0IsS0FBL0IsRUFBcUMsV0FBckMsRUFBa0QsTUFBbEQsRUFBMEQsT0FBMUQsQ0FBZDtBQUNBLElBQUlDLFFBQVFYLFFBQVEsVUFBUixDQUFaOztBQUVBTyxFQUFFSyxJQUFGLENBQU8sc0JBQVAsRUFBK0I7QUFDL0I7QUFEK0IsQ0FBL0IsRUFFRyxTQUFlQyxRQUFmLENBQXlCTixDQUF6QjtBQUFBLDBGQVdjTyxjQVhkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXY0Esd0JBWGQsWUFXY0EsY0FYZCxDQVc4QlAsQ0FYOUI7QUFBQSxnQkFXaUNRLEtBWGpDLHVFQVd5QyxFQVh6QztBQUFBLGdCQVc2Q0MsS0FYN0MsdUVBV3FELEdBWHJEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVlLQyxpQ0FaTCxHQVlxQmpCLFFBQVFR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QixFQUE0Q2xDLEVBQTVDLENBQStDLFVBQS9DLEVBQTJELFVBQVVDLFlBQVYsRUFBd0JDLFFBQXhCLEVBQWtDO0FBQzNGdkMsZ0NBQVFjLEtBQVIsQ0FBYyxtQkFBZCxFQUFtQ3lCLFFBQW5DLEVBQTZDRCxZQUE3QztBQUNBTjtBQUNELHVCQUhEO0FBSUQscUJBTkssQ0FEZTs7QUFBQTs7QUFTckJsQyxzQkFBRXVFLEdBQUY7O0FBVHFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQWpCLENBL0xMOztBQUFBO0FBQUE7QUFBQSwwQ0EwTUssSUFBSXRDLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWEwQixXQUFXMUIsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQTFNTDs7QUFBQTtBQTJNRHNDLGtCQUFRRyxJQUFSOztBQUVBekQsdUJBQWF5RCxJQUFiO0FBQ0FyQiw0QkFBa0JxQixJQUFsQjtBQUNBcEIsNEJBQWtCb0IsSUFBbEI7QUFDQW5CLGtCQUFRbUIsSUFBUjtBQUNBSCxrQkFBUUcsSUFBUjtBQUNBWCx5Q0FBK0JhLE9BQS9CO0FBQ0E3RSxZQUFFdUUsR0FBRjtBQW5OQztBQUFBLDBDQW9OSyxJQUFJdEMsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYTBCLFdBQVcxQixPQUFYLEVBQW9CLE1BQXBCLENBQWI7QUFBQSxXQUFaLENBcE5MOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgiLCJmaWxlIjoiYmFzZS50ZXN0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaWYgKCFnbG9iYWwuX2JhYmVsUG9seWZpbGwpcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKVxuLy8gdmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgZGVyZWYgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1kZXJlZi1zeW5jJylcbnZhciBmYWtlciA9IHJlcXVpcmUoJ2Zha2VyJylcbnZhciBqc2YgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1mYWtlcicpXG5mYWtlci5sb2NhbGUgPSAnaXQnXG52YXIgcmVzdGxlciA9IHJlcXVpcmUoJ3Jlc3RsZXInKVxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0JylcbnZhciB0ID0gcmVxdWlyZSgndGFwJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgQ09OU09MRSA9IHJlcXVpcmUoJy4uL2plc3VzJykuZ2V0Q29uc29sZShmYWxzZSwnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxudmFyIGplc3VzID0gcmVxdWlyZSgnLi4vamVzdXMnKVxuXG50LnRlc3QoJyoqKiBTRVJWSUNFUyBORVQgKioqJywge1xuLy8gIGF1dG9lbmQ6IHRydWVcbn0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIHZhciBNU19SRVNPVVJDRVMgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL3Jlc291cmNlcy9zdGFydCcpKClcbiAgdmFyIE1TX0VWRU5UU19FTUlUVEVSID0gYXdhaXQgcmVxdWlyZSgnLi9zZXJ2aWNlcy9ldmVudHNFbWl0dGVyL3N0YXJ0JykoKVxuICB2YXIgTVNfQVVUSE9SSVpBVElPTlMgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL2F1dGhvcml6YXRpb25zL3N0YXJ0JykoKVxuICB2YXIgTVNfTE9HUyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvbG9ncy9zdGFydCcpKClcbiAgdmFyIE1TX0VWRU5UU19FTUlUVEVSX1VSTCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7TVNfRVZFTlRTX0VNSVRURVIuU0hBUkVEX0NPTkZJRy5odHRwUHVibGljQXBpUG9ydH0vYFxuXG4gIGF3YWl0IGplc3VzLnNldFNoYXJlZENvbmZpZyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvc2VydmljZXMvJyksICd2aWV3JywgJ2V2ZW50cy5saXN0ZW4nLCB7fSlcblxuICB0LnBsYW4oNilcblxuICBhc3luYyBmdW5jdGlvbiByZXNvdXJjZUluc2VydCAodCwgbG9vcHMgPSAxMCwgc3RlcHMgPSAxMDApIHtcbiAgICB2YXIgbWV0aG9kc0NvbmZpZyA9IHJlcXVpcmUocGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc2hhcmVkL3NlcnZpY2VzL3Jlc291cmNlcy9tZXRob2RzLmpzb24nKSlcbiAgICB2YXIgZGVyZWZPcHRpb25zID0ge2Jhc2VGb2xkZXI6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy9yZXNvdXJjZXMvJyksIGZhaWxPbk1pc3Npbmc6IHRydWV9XG4gICAgQ09OU09MRS5kZWJ1ZygnVEVTVCcsICdtZXRob2RzQ29uZmlnJywgbWV0aG9kc0NvbmZpZylcbiAgICB2YXIgYmFzZVVybCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7TVNfUkVTT1VSQ0VTLlNIQVJFRF9DT05GSUcuaHR0cFB1YmxpY0FwaVBvcnR9L2BcbiAgICBDT05TT0xFLmRlYnVnKCdURVNUJywgJ2Jhc2VVcmwnLCBiYXNlVXJsKVxuICAgIHZhciBzY2hlbWFDcmVhdGUgPSBkZXJlZihtZXRob2RzQ29uZmlnLmNyZWF0ZVJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcbiAgICB2YXIgc2NoZW1hUmVhZCA9IGRlcmVmKG1ldGhvZHNDb25maWcucmVhZFJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcbiAgICB2YXIgc2NoZW1hVXBkYXRlID0gZGVyZWYobWV0aG9kc0NvbmZpZy51cGRhdGVSZXNvdXJjZS5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG4gICAgdmFyIHNjaGVtYURlbGV0ZSA9IGRlcmVmKG1ldGhvZHNDb25maWcuZGVsZXRlUmVzb3VyY2UucmVxdWVzdFNjaGVtYSwgZGVyZWZPcHRpb25zKVxuXG4gICAgQ09OU09MRS5kZWJ1ZygnanNvbiBzY2hlbWEgZmFrZXIgc2NoZW1hJywgZGVyZWZPcHRpb25zLCB7c2NoZW1hQ3JlYXRlLCBzY2hlbWFSZWFkLCBzY2hlbWFVcGRhdGUsIHNjaGVtYURlbGV0ZX0pXG4gICAgQ09OU09MRS5kZWJ1ZygnanNvbiBzY2hlbWEgZmFrZXIgc2NoZW1hIGV4YW1wbGVzJywganNmKHNjaGVtYUNyZWF0ZSksIGpzZihzY2hlbWFSZWFkKSwganNmKHNjaGVtYVVwZGF0ZSksIGpzZihzY2hlbWFEZWxldGUpLClcbiAgICB2YXIgdGVzdERhdGFUb1NlbmQgPSBbXVxuICAgIC8vIGF3YWl0IHQudGVzdCgnTk8gQ09NUFJFU1NJT04nLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIC8vICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIC8vICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAnY3JlYXRlUmVzb3VyY2UnKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgIC8vICAgICAgIENPTlNPTEUuZGVidWcoJ3JlYnVpbGRWaWV3cyByZWNlaXZlJywgcmVzcG9uc2UsIGRhdGFSZXNwb25zZSlcbiAgICAvLyAgICAgICByZXNvbHZlKClcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgIH0pXG4gICAgLy9cbiAgICAvLyAgIHQuZW5kKClcbiAgICAvLyB9KVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9vcHM7IGkrKykge1xuICAgICAgLy8gQ09OU09MRS5ncm91cChgVEVTVCBSSUdIVCBEQVRBICR7aX1gKVxuICAgICAgLy8gQ09OU09MRS5ncm91cChgY3JlYXRlUmVzb3VyY2VgKVxuICAgICAgdmFyIGNyZWF0ZWRSZXNwb25zZVxuICAgICAgdmFyIGNyZWF0ZVJlcXVlc3QgPSBqc2Yoc2NoZW1hQ3JlYXRlKVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdzZW5kIGNyZWF0ZVJlcXVlc3QnLCBKU09OLnN0cmluZ2lmeShjcmVhdGVSZXF1ZXN0KSlcbiAgICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ2NyZWF0ZVJlc291cmNlJywgY3JlYXRlUmVxdWVzdCkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIGNyZWF0ZVJlc291cmNlIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZS5pZCwgJ3N0cmluZycsICdSZXNwb25zZSBjcmVhdGVSZXNvdXJjZSBpZCBpcyBzdHJpbmcgJyArIGRhdGFSZXNwb25zZS5pZClcbiAgICAgICAgICBjcmVhdGVkUmVzcG9uc2UgPSBkYXRhUmVzcG9uc2VcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBpZiAoc3RlcHMgPT09IDEpIGNvbnRpbnVlXG4gICAgICAvLyBDT05TT0xFLmdyb3VwRW5kKClcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXAoYHJlYWRSZXNvdXJjZSBGcm9tIGlkYClcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdmFyIGRhdGEgPSB7aWQ6IGNyZWF0ZWRSZXNwb25zZS5pZCwgdXNlcklkOiAndGVzdCcsIHRva2VuOiAndGVzdCd9XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQnLCBzY2hlbWFSZWFkLCBKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ3JlYWRSZXNvdXJjZScsIGRhdGEpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSByZWFkUmVzb3VyY2UgaXMgb2JqZWN0JylcbiAgICAgICAgICB0LnNhbWUoZGF0YVJlc3BvbnNlLmJvZHksIGNyZWF0ZVJlcXVlc3QuZGF0YS5ib2R5LCAnUmVzcG9uc2UgcmVhZFJlc291cmNlICBib2R5IGFzIHNlbmRlZCwgaWQ6JyArIGRhdGFSZXNwb25zZS5faWQpXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLy8gQ09OU09MRS5ncm91cEVuZCgpXG4gICAgICAvLyBDT05TT0xFLmdyb3VwKGB1cGRhdGVSZXNvdXJjZWApXG4gICAgICBzY2hlbWFVcGRhdGUucHJvcGVydGllcy5kYXRhLnJlcXVpcmVkID0gWydib2R5J11cbiAgICAgIHZhciB1cGRhdGVSZXF1ZXN0ID0ganNmKHNjaGVtYVVwZGF0ZSlcbiAgICAgIHVwZGF0ZVJlcXVlc3QuaWQgPSBjcmVhdGVkUmVzcG9uc2UuaWRcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCcsIHNjaGVtYVVwZGF0ZSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlUmVxdWVzdCkpXG4gICAgICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICd1cGRhdGVSZXNvdXJjZScsIHVwZGF0ZVJlcXVlc3QpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSB1cGRhdGVSZXNvdXJjZSBpcyBvYmplY3QnKVxuICAgICAgICAgIHQuc2FtZShkYXRhUmVzcG9uc2UuaWQsIGNyZWF0ZWRSZXNwb25zZS5pZCwgJ1Jlc3BvbnNlIHVwZGF0ZVJlc291cmNlICBpZCBhcyBzZW5kZWQsIGlkOicgKyBkYXRhUmVzcG9uc2UuaWQpXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLy8gQ09OU09MRS5ncm91cEVuZCgpXG4gICAgICAvLyBDT05TT0xFLmdyb3VwKGByZWFkUmVzb3VyY2UgRnJvbSBkYXRhL19pZGApXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHZhciBkYXRhID0ge2lkOiBjcmVhdGVkUmVzcG9uc2UuaWQsIHVzZXJJZDogJ3Rlc3QnLCB0b2tlbjogJ3Rlc3QnfVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdzZW5kJywgc2NoZW1hUmVhZCwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gICAgICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICdyZWFkUmVzb3VyY2UnLCBkYXRhKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ3JlY2VpdmUnLCBKU09OLnN0cmluZ2lmeShkYXRhUmVzcG9uc2UpKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgcmVhZFJlc291cmNlIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC5zYW1lKGRhdGFSZXNwb25zZS5ib2R5LCB1cGRhdGVSZXF1ZXN0LmRhdGEuYm9keSwgJ1Jlc3BvbnNlIHJlYWRSZXNvdXJjZSBib2R5IGFzIHVwZGF0ZWQsIGlkOicgKyBkYXRhUmVzcG9uc2UuX2lkKVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXBFbmQoKVxuICAgICAgLy8gQ09OU09MRS5ncm91cEVuZCgpXG4gICAgfVxuICB9XG5cbiAgQ09OU09MRS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUFJFUEFSSU5HIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDAgLSBFVkVOVFNfRU1JVFRFUiBjaGlhbWF0YSBhbGxvIHN0cmVhbWluZyBkZWdsaSBldmVudGkgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIHZhciBNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cFxuICB2YXIgTVNfRVZFTlRTX0VNSVRURVJfcmVzcG9uc2VIdHRwXG5cbiAgYXdhaXQgdC50ZXN0KCdURVNUIDAnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIE1TX0VWRU5UU19FTUlUVEVSX3JlcXVlc3RIdHRwID0gcmVxdWVzdChcbiAgICAgICAgeyBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHVyaTogTVNfRVZFTlRTX0VNSVRURVJfVVJMICsgJ2xpc3RlbkV2ZW50cydcbiAgICAgICAgfSlcbiAgICAgIE1TX0VWRU5UU19FTUlUVEVSX3JlcXVlc3RIdHRwLm9uKCdyZXNwb25zZScsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdURVNUIEhUVFAgU1RSRUFNSU5HIFJFU1BPTlNFJywgcmVzcG9uc2UpXG4gICAgICAgIE1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cCA9IHJlc3BvbnNlXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICAgIC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnVEVTVCBIVFRQIFNUUkVBTUlORyBFUlJPUicsIGVycm9yKVxuICAgICAgICByZWplY3QoKVxuICAgICAgfSlcbiAgICAgIC5vbignZGF0YScsIGZ1bmN0aW9uIChiaW5EYXRhKSB7XG4gICAgICAgIHZhciBkYXRhU3RyaW5nID0gYmluRGF0YS50b1N0cmluZygndXRmOCcpXG4gICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShkYXRhU3RyaW5nLnJlcGxhY2UoJ2RhdGE6ICcsICcnKSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnVEVTVCBIVFRQIFNUUkVBTUlORyBEQVRBJywgZGF0YSwgTVNfRVZFTlRTX0VNSVRURVJfcmVxdWVzdEh0dHApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0LmVuZCgpXG4gIH0pXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG5cbiAgQ09OU09MRS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVEVTVCAxIC0gSW5zZXJpbWVudG8gRGF0aSAoTVNfVklFVyBzcGVudG8pLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IHQudGVzdCgnVEVTVCAxIC0gSW5zZXJpbWVudG8gRGF0aSAoTVNfVklFVyBzcGVudG8pJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCByZXNvdXJjZUluc2VydCh0LCAxKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgLy9cblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVE9QIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLSBhY2NlbmRvIE1TX1ZJRVctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgdmFyIE1TX1ZJRVcgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL3ZpZXcvc3RhcnQnKSgpXG4gIHZhciBNU19WSUVXX1VSTCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7TVNfVklFVy5TSEFSRURfQ09ORklHLmh0dHBQcml2YXRlQXBpUG9ydH0vYFxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDIuMSAtIE1TX1ZJRVcgcmVidWlsZFZpZXdzIChNU19WSUVXIGRvdnJlYmJlIHJlY3VwZXJhcmVpIGRhdGkgaW5zZXJpdGkgaW4gcHJlY2VkZW56YSktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDIuMScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCByZWJ1aWxkVmlld3MnLCBNU19WSUVXX1VSTCArICdyZWJ1aWxkVmlld3MnKVxuICAgICAgcmVzdGxlci5wb3N0SnNvbihNU19WSUVXX1VSTCArICdyZWJ1aWxkVmlld3MnKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWJ1aWxkVmlld3MgcmVjZWl2ZScsIHJlc3BvbnNlLCBkYXRhUmVzcG9uc2UpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLSBhZ2dpdW5nbyBldmVudG8gdmlld3NVcGRhdGVkIGEgTVNfVklFVy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgYXdhaXQgamVzdXMuc2V0U2hhcmVkQ29uZmlnKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy8nKSwgJ3ZpZXcnLCAnZXZlbnRzLmxpc3RlbicsIHtcbiAgICAndmlld3NVcGRhdGVkJzoge1xuICAgICAgJ21ldGhvZCc6ICd2aWV3c1VwZGF0ZWQnLFxuICAgICAgJ2hhdmVSZXNwb25zZSc6IGZhbHNlXG4gICAgfVxuICB9KVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDIuMiAtIEluc2VyaW1lbnRvIERhdGkgKE1TX1ZJRVcgYWNjZXNvLGRvdnJlYmJlIGFnZ2lvcm5hcnNpIGxpdmUpLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG5cbiAgYXdhaXQgdC50ZXN0KCdURVNUIDIuMicsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgcmVzb3VyY2VJbnNlcnQodCwgNSwgMSlcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpXG4gIGF3YWl0IGplc3VzLnNldFNoYXJlZENvbmZpZyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvc2VydmljZXMvJyksICd2aWV3JywgJ2V2ZW50cy5saXN0ZW4nLCB7fSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIE1TX1ZJRVcuc3RvcCgpXG5cbiAgQ09OU09MRS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gU1RPUCAtIE1TX1ZJRVcgc3RvcHBlZC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMyAtIEluc2VyaW1lbnRvIERhdGkgKE1TX1ZJRVcgc3RvcHBlZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IHQudGVzdCgnVEVTVCAzJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCByZXNvdXJjZUluc2VydCh0LCA1LCAxKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLSBNU19WSUVXIHN0YXJ0aW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IE1TX1ZJRVcuc3RhcnQoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDQgLSBNU19WSUVXIHN5bmNWaWV3cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDQnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQgc3luY1ZpZXdzJywgTVNfVklFV19VUkwgKyAnc3luY1ZpZXdzJylcbiAgICAgIHJlc3RsZXIucG9zdEpzb24oTVNfVklFV19VUkwgKyAnc3luY1ZpZXdzJykub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1Zygnc3luY1ZpZXdzIHJlY2VpdmUnLCByZXNwb25zZSwgZGF0YVJlc3BvbnNlKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHQuZW5kKClcbiAgfSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpXG4gIE1TX1ZJRVcuc3RvcCgpXG5cbiAgTVNfUkVTT1VSQ0VTLnN0b3AoKVxuICBNU19FVkVOVFNfRU1JVFRFUi5zdG9wKClcbiAgTVNfQVVUSE9SSVpBVElPTlMuc3RvcCgpXG4gIE1TX0xPR1Muc3RvcCgpXG4gIE1TX1ZJRVcuc3RvcCgpXG4gIE1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cC5kZXN0cm95KClcbiAgdC5lbmQoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwMDApKVxufSlcbiJdfQ==