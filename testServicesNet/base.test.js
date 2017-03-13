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

var MS_EVENTS_EMITTER_requestHttp;
var MS_EVENTS_EMITTER_responseHttp;

t.test('*** SERVICES NET ***', {
  //  autoend: true
}, function mainTest(t) {
  var MS_RESOURCES, MS_EVENTS_EMITTER, MS_AUTHORIZATIONS, MS_LOGS, resourceInsert, MS_VIEW, MS_VIEW_URL;
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
                    baseUrl = 'http://' + MS_RESOURCES.SHARED_NET_CONFIG.transports.httpPublic.url + '/';

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
                      _context.next = 36;
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

                    return _context.abrupt('continue', 33);

                  case 19:
                    // CONSOLE.groupEnd()
                    // CONSOLE.group(`readResource From id`)

                    CONSOLE.debug('createdResponse', createdResponse);
                    _context.next = 22;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var data = { id: createdResponse.id, userid: 'test', token: 'test' };
                      CONSOLE.debug('send', schemaRead, JSON.stringify(data));
                      restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
                        CONSOLE.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response readResource is object');
                        t.same(dataResponse.body, createRequest.data.body, 'Response readResource  body as sended, id:' + dataResponse._id);
                        resolve();
                      });
                    }));

                  case 22:
                    if (!(steps === 2)) {
                      _context.next = 24;
                      break;
                    }

                    return _context.abrupt('continue', 33);

                  case 24:
                    // CONSOLE.groupEnd()
                    // CONSOLE.group(`updateResource`)
                    schemaUpdate.properties.data.required = ['body'];
                    updateRequest = jsf(schemaUpdate);

                    updateRequest.id = createdResponse.id;
                    _context.next = 29;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      CONSOLE.debug('send', schemaUpdate, JSON.stringify(updateRequest));
                      restler.postJson(baseUrl + 'updateResource', updateRequest).on('complete', function (dataResponse, response) {
                        CONSOLE.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response updateResource is object');
                        t.same(dataResponse.id, createdResponse.id, 'Response updateResource  id as sended, id:' + dataResponse.id);
                        resolve();
                      });
                    }));

                  case 29:
                    if (!(steps === 3)) {
                      _context.next = 31;
                      break;
                    }

                    return _context.abrupt('continue', 33);

                  case 31:
                    _context.next = 33;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var data = { id: createdResponse.id, userid: 'test', token: 'test' };
                      CONSOLE.debug('send', schemaRead, JSON.stringify(data));
                      restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
                        CONSOLE.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response readResource is object');
                        t.same(dataResponse.body, updateRequest.data.body, 'Response readResource body as updated, id:' + dataResponse._id);
                        resolve();
                      });
                    }));

                  case 33:
                    i++;
                    _context.next = 13;
                    break;

                  case 36:
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
          _context8.next = 15;
          return regeneratorRuntime.awrap(jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {}));

        case 15:

          //t.plan(1)

          console.log('http://127.0.0.1:8203/inspector');
          CONSOLE.debug('-------------------------------------- PREPARING -------------------------------------------');
          _context8.next = 19;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 2000);
          }));

        case 19:

          CONSOLE.debug('-------------------------------------- TEST 0 - EVENTS_EMITTER chiamata allo streaming degli eventi  ------------------------------------------');

          _context8.next = 22;
          return regeneratorRuntime.awrap(t.test('TEST 0', function _callee(t) {
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      console.log(MS_EVENTS_EMITTER);
                      MS_EVENTS_EMITTER_requestHttp = request({ method: 'GET',
                        headers: {
                          stream: true
                        },
                        uri: 'http://' + MS_EVENTS_EMITTER.SHARED_NET_CONFIG.transports.httpPublic.url + '/listenEvents'
                      });
                      MS_EVENTS_EMITTER_requestHttp
                      // .on('response', function (response) {
                      //   CONSOLE.debug('TEST HTTP STREAMING RESPONSE', response)
                      //   MS_EVENTS_EMITTER_responseHttp = response
                      //   resolve()
                      // })
                      .on('error', function (error) {
                        CONSOLE.debug('TEST HTTP STREAMING ERROR', error);
                        reject();
                      }).on('data', function (data) {
                        CONSOLE.debug('TEST HTTP STREAMING DATA', data, MS_EVENTS_EMITTER_requestHttp);
                        resolve(data);
                      });
                    }).catch(function (error) {
                      return console.error(error);
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

        case 22:
          CONSOLE.debug('-------------------------------------- PREPARING -------------------------------------------');
          _context8.next = 25;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 25:

          CONSOLE.debug('-------------------------------------- TEST 1 - Inserimento Dati (MS_VIEW spento)-------------------------------------------');
          _context8.next = 28;
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

        case 28:

          //await new Promise((resolve) => setTimeout(resolve, 60000)) // STOP THERE!!!

          CONSOLE.debug('-------------------------------------- STOP -------------------------------------------');
          _context8.next = 31;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 31:

          CONSOLE.debug('-------------------------------------- PREPARING - accendo MS_VIEW-------------------------------------------');
          _context8.next = 34;
          return regeneratorRuntime.awrap(require('./services/view/start')());

        case 34:
          MS_VIEW = _context8.sent;
          MS_VIEW_URL = 'http://' + MS_VIEW.SHARED_NET_CONFIG.transports.http.url + '/'; //PRIVATE CALL

          _context8.next = 38;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 38:

          CONSOLE.debug('-------------------------------------- TEST 2.1 - MS_VIEW rebuildViews (MS_VIEW dovrebbe recuperarei dati inseriti in precedenza)-------------------------------------------');
          _context8.next = 41;
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

        case 41:

          CONSOLE.debug('-------------------------------------- PREPARING - aggiungo evento viewsUpdated a MS_VIEW-------------------------------------------');
          _context8.next = 44;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 44:
          _context8.next = 46;
          return regeneratorRuntime.awrap(jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {
            'viewsUpdated': {
              'method': 'viewsUpdated',
              'haveResponse': false
            }
          }));

        case 46:
          _context8.next = 48;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 48:

          CONSOLE.debug('-------------------------------------- TEST 2.2 - Inserimento Dati (MS_VIEW acceso,dovrebbe aggiornarsi live)-------------------------------------------');

          _context8.next = 51;
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

        case 51:
          _context8.next = 53;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 53:
          _context8.next = 55;
          return regeneratorRuntime.awrap(jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {}));

        case 55:
          _context8.next = 57;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 57:
          MS_VIEW.stop();

          CONSOLE.debug('-------------------------------------- STOP - MS_VIEW stopped------------------------------------------');
          _context8.next = 61;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 61:

          CONSOLE.debug('-------------------------------------- TEST 3 - Inserimento Dati (MS_VIEW stopped) -------------------------------------------');
          _context8.next = 64;
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

        case 64:

          CONSOLE.debug('-------------------------------------- PREPARING - MS_VIEW starting-------------------------------------------');
          _context8.next = 67;
          return regeneratorRuntime.awrap(MS_VIEW.start());

        case 67:
          _context8.next = 69;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 69:

          CONSOLE.debug('-------------------------------------- TEST 4 - MS_VIEW syncViews -------------------------------------------');
          _context8.next = 72;
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

        case 72:
          _context8.next = 74;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 74:
          MS_VIEW.stop();

          MS_RESOURCES.stop();
          MS_EVENTS_EMITTER.stop();
          MS_AUTHORIZATIONS.stop();
          MS_LOGS.stop();
          //if(MS_EVENTS_EMITTER_responseHttp)MS_EVENTS_EMITTER_responseHttp.destroy()
          t.end();
          _context8.next = 82;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 100000);
          }));

        case 82:
          process.exit();

        case 83:
        case 'end':
          return _context8.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiZGVyZWYiLCJmYWtlciIsImpzZiIsImxvY2FsZSIsInJlc3RsZXIiLCJyZXF1ZXN0IiwidCIsInBhdGgiLCJDT05TT0xFIiwiZ2V0Q29uc29sZSIsImRlYnVnIiwibG9nIiwiZXJyb3IiLCJ3YXJuIiwiamVzdXMiLCJNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cCIsIk1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cCIsInRlc3QiLCJtYWluVGVzdCIsInJlc291cmNlSW5zZXJ0IiwibG9vcHMiLCJzdGVwcyIsIm1ldGhvZHNDb25maWciLCJqb2luIiwiX19kaXJuYW1lIiwiZGVyZWZPcHRpb25zIiwiYmFzZUZvbGRlciIsImZhaWxPbk1pc3NpbmciLCJiYXNlVXJsIiwiTVNfUkVTT1VSQ0VTIiwiU0hBUkVEX05FVF9DT05GSUciLCJ0cmFuc3BvcnRzIiwiaHR0cFB1YmxpYyIsInVybCIsInNjaGVtYUNyZWF0ZSIsImNyZWF0ZVJlc291cmNlIiwicmVxdWVzdFNjaGVtYSIsInNjaGVtYVJlYWQiLCJyZWFkUmVzb3VyY2UiLCJzY2hlbWFVcGRhdGUiLCJ1cGRhdGVSZXNvdXJjZSIsInNjaGVtYURlbGV0ZSIsImRlbGV0ZVJlc291cmNlIiwidGVzdERhdGFUb1NlbmQiLCJpIiwiY3JlYXRlUmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiSlNPTiIsInN0cmluZ2lmeSIsInBvc3RKc29uIiwib24iLCJkYXRhUmVzcG9uc2UiLCJyZXNwb25zZSIsInR5cGUiLCJpZCIsImNyZWF0ZWRSZXNwb25zZSIsImRhdGEiLCJ1c2VyaWQiLCJ0b2tlbiIsInNhbWUiLCJib2R5IiwiX2lkIiwicHJvcGVydGllcyIsInJlcXVpcmVkIiwidXBkYXRlUmVxdWVzdCIsIk1TX0VWRU5UU19FTUlUVEVSIiwiTVNfQVVUSE9SSVpBVElPTlMiLCJNU19MT0dTIiwic2V0U2hhcmVkQ29uZmlnIiwiY29uc29sZSIsInNldFRpbWVvdXQiLCJtZXRob2QiLCJoZWFkZXJzIiwic3RyZWFtIiwidXJpIiwiY2F0Y2giLCJlbmQiLCJNU19WSUVXIiwiTVNfVklFV19VUkwiLCJodHRwIiwic3RvcCIsInN0YXJ0IiwicHJvY2VzcyIsImV4aXQiXSwibWFwcGluZ3MiOiI7O0FBQ0EsSUFBSSxDQUFDQSxPQUFPQyxjQUFaLEVBQTJCQyxRQUFRLGdCQUFSO0FBQzNCO0FBQ0EsSUFBSUMsUUFBUUQsUUFBUSx3QkFBUixDQUFaO0FBQ0EsSUFBSUUsUUFBUUYsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJRyxNQUFNSCxRQUFRLG1CQUFSLENBQVY7QUFDQUUsTUFBTUUsTUFBTixHQUFlLElBQWY7QUFDQSxJQUFJQyxVQUFVTCxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlNLFVBQVVOLFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBSU8sSUFBSVAsUUFBUSxLQUFSLENBQVI7QUFDQSxJQUFJUSxPQUFPUixRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlTLFVBQVVULFFBQVEsVUFBUixFQUFvQlUsVUFBcEIsQ0FBK0IsRUFBQ0MsT0FBTyxJQUFSLEVBQWNDLEtBQUssSUFBbkIsRUFBeUJDLE9BQU8sSUFBaEMsRUFBc0NDLE1BQU0sSUFBNUMsRUFBL0IsRUFBa0YsV0FBbEYsRUFBK0YsTUFBL0YsRUFBdUcsT0FBdkcsQ0FBZDtBQUNBLElBQUlDLFFBQVFmLFFBQVEsVUFBUixDQUFaOztBQUVBLElBQUlnQiw2QkFBSjtBQUNBLElBQUlDLDhCQUFKOztBQUVBVixFQUFFVyxJQUFGLENBQU8sc0JBQVAsRUFBK0I7QUFDL0I7QUFEK0IsQ0FBL0IsRUFFRyxTQUFlQyxRQUFmLENBQXlCWixDQUF6QjtBQUFBLG1FQVFjYSxjQVJkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRY0Esd0JBUmQsWUFRY0EsY0FSZCxDQVE4QmIsQ0FSOUI7QUFBQSxnQkFRaUNjLEtBUmpDLHVFQVF5QyxFQVJ6QztBQUFBLGdCQVE2Q0MsS0FSN0MsdUVBUXFELEdBUnJEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNLQyxpQ0FUTCxHQVNxQnZCLFFBQVFRLEtBQUtnQixJQUFMLENBQVVDLFNBQVYsRUFBcUIsMENBQXJCLENBQVIsQ0FUckI7QUFVS0MsZ0NBVkwsR0FVb0IsRUFBQ0MsWUFBWW5CLEtBQUtnQixJQUFMLENBQVVDLFNBQVYsRUFBcUIsOEJBQXJCLENBQWIsRUFBbUVHLGVBQWUsSUFBbEYsRUFWcEI7O0FBV0NuQiw0QkFBUUUsS0FBUixDQUFjLE1BQWQsRUFBc0IsZUFBdEIsRUFBdUNZLGFBQXZDO0FBQ0lNLDJCQVpMLEdBWWUsWUFBWUMsYUFBYUMsaUJBQWIsQ0FBK0JDLFVBQS9CLENBQTBDQyxVQUExQyxDQUFxREMsR0FBakUsR0FBdUUsR0FadEY7O0FBYUN6Qiw0QkFBUUUsS0FBUixDQUFjLE1BQWQsRUFBc0IsU0FBdEIsRUFBaUNrQixPQUFqQztBQUNJTSxnQ0FkTCxHQWNvQmxDLE1BQU1zQixjQUFjYSxjQUFkLENBQTZCQyxhQUFuQyxFQUFrRFgsWUFBbEQsQ0FkcEI7QUFlS1ksOEJBZkwsR0Fla0JyQyxNQUFNc0IsY0FBY2dCLFlBQWQsQ0FBMkJGLGFBQWpDLEVBQWdEWCxZQUFoRCxDQWZsQjtBQWdCS2MsZ0NBaEJMLEdBZ0JvQnZDLE1BQU1zQixjQUFja0IsY0FBZCxDQUE2QkosYUFBbkMsRUFBa0RYLFlBQWxELENBaEJwQjtBQWlCS2dCLGdDQWpCTCxHQWlCb0J6QyxNQUFNc0IsY0FBY29CLGNBQWQsQ0FBNkJOLGFBQW5DLEVBQWtEWCxZQUFsRCxDQWpCcEI7OztBQW1CQ2pCLDRCQUFRRSxLQUFSLENBQWMsMEJBQWQsRUFBMENlLFlBQTFDLEVBQXdELEVBQUNTLDBCQUFELEVBQWVHLHNCQUFmLEVBQTJCRSwwQkFBM0IsRUFBeUNFLDBCQUF6QyxFQUF4RDtBQUNBakMsNEJBQVFFLEtBQVIsQ0FBYyxtQ0FBZCxFQUFtRFIsSUFBSWdDLFlBQUosQ0FBbkQsRUFBc0VoQyxJQUFJbUMsVUFBSixDQUF0RSxFQUF1Rm5DLElBQUlxQyxZQUFKLENBQXZGLEVBQTBHckMsSUFBSXVDLFlBQUosQ0FBMUc7QUFDSUUsa0NBckJMLEdBcUJzQixFQXJCdEI7QUFzQkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ1NDLHFCQWhDVixHQWdDYyxDQWhDZDs7QUFBQTtBQUFBLDBCQWdDaUJBLElBQUl4QixLQWhDckI7QUFBQTtBQUFBO0FBQUE7O0FBb0NPeUIsaUNBcENQLEdBb0N1QjNDLElBQUlnQyxZQUFKLENBcEN2QjtBQWlDRztBQUNBOztBQWxDSDtBQUFBLG9EQXFDUyxJQUFJWSxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3JDeEMsOEJBQVFFLEtBQVIsQ0FBYyxvQkFBZCxFQUFvQ3VDLEtBQUtDLFNBQUwsQ0FBZUwsYUFBZixDQUFwQztBQUNBekMsOEJBQVErQyxRQUFSLENBQWlCdkIsVUFBVSxnQkFBM0IsRUFBNkNpQixhQUE3QyxFQUE0RE8sRUFBNUQsQ0FBK0QsVUFBL0QsRUFBMkUsVUFBVUMsWUFBVixFQUF3QkMsUUFBeEIsRUFBa0M7QUFDM0c5QyxnQ0FBUUUsS0FBUixDQUFjLFNBQWQsRUFBeUJ1QyxLQUFLQyxTQUFMLENBQWVHLFlBQWYsQ0FBekI7QUFDQS9DLDBCQUFFaUQsSUFBRixDQUFPRixZQUFQLEVBQXFCLFFBQXJCLEVBQStCLG1DQUEvQjtBQUNBL0MsMEJBQUVpRCxJQUFGLENBQU9GLGFBQWFHLEVBQXBCLEVBQXdCLFFBQXhCLEVBQWtDLDBDQUEwQ0gsYUFBYUcsRUFBekY7QUFDQUMsMENBQWtCSixZQUFsQjtBQUNBTjtBQUNELHVCQU5EO0FBT0QscUJBVEssQ0FyQ1Q7O0FBQUE7QUFBQSwwQkErQ08xQixVQUFVLENBL0NqQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQWdERztBQUNBOztBQUVBYiw0QkFBUUUsS0FBUixDQUFjLGlCQUFkLEVBQWtDK0MsZUFBbEM7QUFuREg7QUFBQSxvREFvRFMsSUFBSVgsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNyQywwQkFBSVUsT0FBTyxFQUFDRixJQUFJQyxnQkFBZ0JELEVBQXJCLEVBQXlCRyxRQUFRLE1BQWpDLEVBQXlDQyxPQUFPLE1BQWhELEVBQVg7QUFDQXBELDhCQUFRRSxLQUFSLENBQWMsTUFBZCxFQUFzQjJCLFVBQXRCLEVBQWtDWSxLQUFLQyxTQUFMLENBQWVRLElBQWYsQ0FBbEM7QUFDQXRELDhCQUFRK0MsUUFBUixDQUFpQnZCLFVBQVUsY0FBM0IsRUFBMkM4QixJQUEzQyxFQUFpRE4sRUFBakQsQ0FBb0QsVUFBcEQsRUFBZ0UsVUFBVUMsWUFBVixFQUF3QkMsUUFBeEIsRUFBa0M7QUFDaEc5QyxnQ0FBUUUsS0FBUixDQUFjLFNBQWQsRUFBeUJ1QyxLQUFLQyxTQUFMLENBQWVHLFlBQWYsQ0FBekI7QUFDQS9DLDBCQUFFaUQsSUFBRixDQUFPRixZQUFQLEVBQXFCLFFBQXJCLEVBQStCLGlDQUEvQjtBQUNBL0MsMEJBQUV1RCxJQUFGLENBQU9SLGFBQWFTLElBQXBCLEVBQTBCakIsY0FBY2EsSUFBZCxDQUFtQkksSUFBN0MsRUFBbUQsK0NBQStDVCxhQUFhVSxHQUEvRztBQUNBaEI7QUFDRCx1QkFMRDtBQU1ELHFCQVRLLENBcERUOztBQUFBO0FBQUEsMEJBOERPMUIsVUFBVSxDQTlEakI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUErREc7QUFDQTtBQUNBa0IsaUNBQWF5QixVQUFiLENBQXdCTixJQUF4QixDQUE2Qk8sUUFBN0IsR0FBd0MsQ0FBQyxNQUFELENBQXhDO0FBQ0lDLGlDQWxFUCxHQWtFdUJoRSxJQUFJcUMsWUFBSixDQWxFdkI7O0FBbUVHMkIsa0NBQWNWLEVBQWQsR0FBbUJDLGdCQUFnQkQsRUFBbkM7QUFuRUg7QUFBQSxvREFvRVMsSUFBSVYsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNyQ3hDLDhCQUFRRSxLQUFSLENBQWMsTUFBZCxFQUFzQjZCLFlBQXRCLEVBQW9DVSxLQUFLQyxTQUFMLENBQWVnQixhQUFmLENBQXBDO0FBQ0E5RCw4QkFBUStDLFFBQVIsQ0FBaUJ2QixVQUFVLGdCQUEzQixFQUE2Q3NDLGFBQTdDLEVBQTREZCxFQUE1RCxDQUErRCxVQUEvRCxFQUEyRSxVQUFVQyxZQUFWLEVBQXdCQyxRQUF4QixFQUFrQztBQUMzRzlDLGdDQUFRRSxLQUFSLENBQWMsU0FBZCxFQUF5QnVDLEtBQUtDLFNBQUwsQ0FBZUcsWUFBZixDQUF6QjtBQUNBL0MsMEJBQUVpRCxJQUFGLENBQU9GLFlBQVAsRUFBcUIsUUFBckIsRUFBK0IsbUNBQS9CO0FBQ0EvQywwQkFBRXVELElBQUYsQ0FBT1IsYUFBYUcsRUFBcEIsRUFBd0JDLGdCQUFnQkQsRUFBeEMsRUFBNEMsK0NBQStDSCxhQUFhRyxFQUF4RztBQUNBVDtBQUNELHVCQUxEO0FBTUQscUJBUkssQ0FwRVQ7O0FBQUE7QUFBQSwwQkE2RU8xQixVQUFVLENBN0VqQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUEsb0RBZ0ZTLElBQUl5QixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3JDLDBCQUFJVSxPQUFPLEVBQUNGLElBQUlDLGdCQUFnQkQsRUFBckIsRUFBeUJHLFFBQVEsTUFBakMsRUFBeUNDLE9BQU8sTUFBaEQsRUFBWDtBQUNBcEQsOEJBQVFFLEtBQVIsQ0FBYyxNQUFkLEVBQXNCMkIsVUFBdEIsRUFBa0NZLEtBQUtDLFNBQUwsQ0FBZVEsSUFBZixDQUFsQztBQUNBdEQsOEJBQVErQyxRQUFSLENBQWlCdkIsVUFBVSxjQUEzQixFQUEyQzhCLElBQTNDLEVBQWlETixFQUFqRCxDQUFvRCxVQUFwRCxFQUFnRSxVQUFVQyxZQUFWLEVBQXdCQyxRQUF4QixFQUFrQztBQUNoRzlDLGdDQUFRRSxLQUFSLENBQWMsU0FBZCxFQUF5QnVDLEtBQUtDLFNBQUwsQ0FBZUcsWUFBZixDQUF6QjtBQUNBL0MsMEJBQUVpRCxJQUFGLENBQU9GLFlBQVAsRUFBcUIsUUFBckIsRUFBK0IsaUNBQS9CO0FBQ0EvQywwQkFBRXVELElBQUYsQ0FBT1IsYUFBYVMsSUFBcEIsRUFBMEJJLGNBQWNSLElBQWQsQ0FBbUJJLElBQTdDLEVBQW1ELCtDQUErQ1QsYUFBYVUsR0FBL0c7QUFDQWhCO0FBQ0QsdUJBTEQ7QUFNRCxxQkFUSyxDQWhGVDs7QUFBQTtBQWdDNEJILHVCQWhDNUI7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsMENBQ3dCN0MsUUFBUSw0QkFBUixHQUR4Qjs7QUFBQTtBQUNHOEIsc0JBREg7QUFBQTtBQUFBLDBDQUU2QjlCLFFBQVEsZ0NBQVIsR0FGN0I7O0FBQUE7QUFFR29FLDJCQUZIO0FBQUE7QUFBQSwwQ0FHNkJwRSxRQUFRLGlDQUFSLEdBSDdCOztBQUFBO0FBR0dxRSwyQkFISDtBQUFBO0FBQUEsMENBSW1CckUsUUFBUSx1QkFBUixHQUpuQjs7QUFBQTtBQUlHc0UsaUJBSkg7QUFBQTtBQUFBLDBDQU1LdkQsTUFBTXdELGVBQU4sQ0FBc0IvRCxLQUFLZ0IsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLG9CQUFyQixDQUF0QixFQUFrRSxNQUFsRSxFQUEwRSxlQUExRSxFQUEyRixFQUEzRixDQU5MOztBQUFBOztBQStGRDs7QUFFQStDLGtCQUFRNUQsR0FBUixDQUFZLGlDQUFaO0FBQ0FILGtCQUFRRSxLQUFSLENBQWMsOEZBQWQ7QUFsR0M7QUFBQSwwQ0FtR0ssSUFBSW9DLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWF5QixXQUFXekIsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQW5HTDs7QUFBQTs7QUFxR0R2QyxrQkFBUUUsS0FBUixDQUFjLGlKQUFkOztBQXJHQztBQUFBLDBDQXVHS0osRUFBRVcsSUFBRixDQUFPLFFBQVAsRUFBaUIsaUJBQWdCWCxDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvREFDZixJQUFJd0MsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNyQ3VCLDhCQUFRNUQsR0FBUixDQUFZd0QsaUJBQVo7QUFDQXBELHNEQUFnQ1YsUUFDOUIsRUFBRW9FLFFBQVEsS0FBVjtBQUNFQyxpQ0FBUztBQUNQQyxrQ0FBUTtBQURELHlCQURYO0FBSUVDLDZCQUFLLFlBQVlULGtCQUFrQnJDLGlCQUFsQixDQUFvQ0MsVUFBcEMsQ0FBK0NDLFVBQS9DLENBQTBEQyxHQUF0RSxHQUE0RTtBQUpuRix1QkFEOEIsQ0FBaEM7QUFPQWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBLHVCQU1DcUMsRUFORCxDQU1JLE9BTkosRUFNYSxVQUFVeEMsS0FBVixFQUFpQjtBQUM1QkosZ0NBQVFFLEtBQVIsQ0FBYywyQkFBZCxFQUEyQ0UsS0FBM0M7QUFDQW9DO0FBQ0QsdUJBVEQsRUFVQ0ksRUFWRCxDQVVJLE1BVkosRUFVWSxVQUFVTSxJQUFWLEVBQWdCO0FBQzFCbEQsZ0NBQVFFLEtBQVIsQ0FBYywwQkFBZCxFQUEwQ2dELElBQTFDLEVBQWdEM0MsNkJBQWhEO0FBQ0FnQyxnQ0FBUVcsSUFBUjtBQUNELHVCQWJEO0FBY0QscUJBdkJLLEVBdUJIbUIsS0F2QkcsQ0F1Qkc7QUFBQSw2QkFBU04sUUFBUTNELEtBQVIsQ0FBY0EsS0FBZCxDQUFUO0FBQUEscUJBdkJILENBRGU7O0FBQUE7QUF5QnJCTixzQkFBRXdFLEdBQUY7O0FBekJxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFqQixDQXZHTDs7QUFBQTtBQWtJRHRFLGtCQUFRRSxLQUFSLENBQWMsOEZBQWQ7QUFsSUM7QUFBQSwwQ0FtSUssSUFBSW9DLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWF5QixXQUFXekIsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQW5JTDs7QUFBQTs7QUFxSUR2QyxrQkFBUUUsS0FBUixDQUFjLDhIQUFkO0FBcklDO0FBQUEsMENBc0lLSixFQUFFVyxJQUFGLENBQU8sNENBQVAsRUFBcUQsa0JBQWdCWCxDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvREFDbkRhLGVBQWViLENBQWYsRUFBa0IsQ0FBbEIsQ0FEbUQ7O0FBQUE7QUFFekRBLHNCQUFFd0UsR0FBRjs7QUFGeUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBckQsQ0F0SUw7O0FBQUE7O0FBMklEOztBQUVBdEUsa0JBQVFFLEtBQVIsQ0FBYyx5RkFBZDtBQTdJQztBQUFBLDBDQThJSyxJQUFJb0MsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYXlCLFdBQVd6QixPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxXQUFaLENBOUlMOztBQUFBOztBQWdKRHZDLGtCQUFRRSxLQUFSLENBQWMsK0dBQWQ7QUFoSkM7QUFBQSwwQ0FpSm1CWCxRQUFRLHVCQUFSLEdBakpuQjs7QUFBQTtBQWlKR2dGLGlCQWpKSDtBQWtKR0MscUJBbEpILEdBa0ppQixZQUFZRCxRQUFRakQsaUJBQVIsQ0FBMEJDLFVBQTFCLENBQXFDa0QsSUFBckMsQ0FBMENoRCxHQUF0RCxHQUE0RCxHQWxKN0UsRUFrSmlGOztBQWxKakY7QUFBQSwwQ0FtSkssSUFBSWEsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYXlCLFdBQVd6QixPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxXQUFaLENBbkpMOztBQUFBOztBQXFKRHZDLGtCQUFRRSxLQUFSLENBQWMsOEtBQWQ7QUFySkM7QUFBQSwwQ0FzSktKLEVBQUVXLElBQUYsQ0FBTyxVQUFQLEVBQW1CLGtCQUFnQlgsQ0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0RBQ2pCLElBQUl3QyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3JDeEMsOEJBQVFFLEtBQVIsQ0FBYyxtQkFBZCxFQUFtQ3NFLGNBQWMsY0FBakQ7QUFDQTVFLDhCQUFRK0MsUUFBUixDQUFpQjZCLGNBQWMsY0FBL0IsRUFBK0M1QixFQUEvQyxDQUFrRCxVQUFsRCxFQUE4RCxVQUFVQyxZQUFWLEVBQXdCQyxRQUF4QixFQUFrQztBQUM5RjlDLGdDQUFRRSxLQUFSLENBQWMsc0JBQWQsRUFBc0M0QyxRQUF0QyxFQUFnREQsWUFBaEQ7QUFDQU47QUFDRCx1QkFIRDtBQUlELHFCQU5LLENBRGlCOztBQUFBO0FBUXZCekMsc0JBQUV3RSxHQUFGOztBQVJ1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFuQixDQXRKTDs7QUFBQTs7QUFpS0R0RSxrQkFBUUUsS0FBUixDQUFjLHNJQUFkO0FBaktDO0FBQUEsMENBa0tLLElBQUlvQyxPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLG1CQUFheUIsV0FBV3pCLE9BQVgsRUFBb0IsSUFBcEIsQ0FBYjtBQUFBLFdBQVosQ0FsS0w7O0FBQUE7QUFBQTtBQUFBLDBDQW1LS2pDLE1BQU13RCxlQUFOLENBQXNCL0QsS0FBS2dCLElBQUwsQ0FBVUMsU0FBVixFQUFxQixvQkFBckIsQ0FBdEIsRUFBa0UsTUFBbEUsRUFBMEUsZUFBMUUsRUFBMkY7QUFDL0YsNEJBQWdCO0FBQ2Qsd0JBQVUsY0FESTtBQUVkLDhCQUFnQjtBQUZGO0FBRCtFLFdBQTNGLENBbktMOztBQUFBO0FBQUE7QUFBQSwwQ0F5S0ssSUFBSXNCLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWF5QixXQUFXekIsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQXpLTDs7QUFBQTs7QUEyS0R2QyxrQkFBUUUsS0FBUixDQUFjLDBKQUFkOztBQTNLQztBQUFBLDBDQTZLS0osRUFBRVcsSUFBRixDQUFPLFVBQVAsRUFBbUIsa0JBQWdCWCxDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvREFDakJhLGVBQWViLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FEaUI7O0FBQUE7QUFFdkJBLHNCQUFFd0UsR0FBRjs7QUFGdUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBbkIsQ0E3S0w7O0FBQUE7QUFBQTtBQUFBLDBDQWtMSyxJQUFJaEMsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYXlCLFdBQVd6QixPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxXQUFaLENBbExMOztBQUFBO0FBQUE7QUFBQSwwQ0FtTEtqQyxNQUFNd0QsZUFBTixDQUFzQi9ELEtBQUtnQixJQUFMLENBQVVDLFNBQVYsRUFBcUIsb0JBQXJCLENBQXRCLEVBQWtFLE1BQWxFLEVBQTBFLGVBQTFFLEVBQTJGLEVBQTNGLENBbkxMOztBQUFBO0FBQUE7QUFBQSwwQ0FvTEssSUFBSXNCLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWF5QixXQUFXekIsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQXBMTDs7QUFBQTtBQXFMRGdDLGtCQUFRRyxJQUFSOztBQUVBMUUsa0JBQVFFLEtBQVIsQ0FBYyx5R0FBZDtBQXZMQztBQUFBLDBDQXdMSyxJQUFJb0MsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYXlCLFdBQVd6QixPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxXQUFaLENBeExMOztBQUFBOztBQTBMRHZDLGtCQUFRRSxLQUFSLENBQWMsZ0lBQWQ7QUExTEM7QUFBQSwwQ0EyTEtKLEVBQUVXLElBQUYsQ0FBTyxRQUFQLEVBQWlCLGtCQUFnQlgsQ0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0RBQ2ZhLGVBQWViLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FEZTs7QUFBQTtBQUVyQkEsc0JBQUV3RSxHQUFGOztBQUZxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFqQixDQTNMTDs7QUFBQTs7QUFnTUR0RSxrQkFBUUUsS0FBUixDQUFjLGdIQUFkO0FBaE1DO0FBQUEsMENBaU1LcUUsUUFBUUksS0FBUixFQWpNTDs7QUFBQTtBQUFBO0FBQUEsMENBa01LLElBQUlyQyxPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLG1CQUFheUIsV0FBV3pCLE9BQVgsRUFBb0IsSUFBcEIsQ0FBYjtBQUFBLFdBQVosQ0FsTUw7O0FBQUE7O0FBb01EdkMsa0JBQVFFLEtBQVIsQ0FBYywrR0FBZDtBQXBNQztBQUFBLDBDQXFNS0osRUFBRVcsSUFBRixDQUFPLFFBQVAsRUFBaUIsa0JBQWdCWCxDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvREFDZixJQUFJd0MsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNyQ3hDLDhCQUFRRSxLQUFSLENBQWMsZ0JBQWQsRUFBZ0NzRSxjQUFjLFdBQTlDO0FBQ0E1RSw4QkFBUStDLFFBQVIsQ0FBaUI2QixjQUFjLFdBQS9CLEVBQTRDNUIsRUFBNUMsQ0FBK0MsVUFBL0MsRUFBMkQsVUFBVUMsWUFBVixFQUF3QkMsUUFBeEIsRUFBa0M7QUFDM0Y5QyxnQ0FBUUUsS0FBUixDQUFjLG1CQUFkLEVBQW1DNEMsUUFBbkMsRUFBNkNELFlBQTdDO0FBQ0FOO0FBQ0QsdUJBSEQ7QUFJRCxxQkFOSyxDQURlOztBQUFBOztBQVNyQnpDLHNCQUFFd0UsR0FBRjs7QUFUcUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBakIsQ0FyTUw7O0FBQUE7QUFBQTtBQUFBLDBDQWdOSyxJQUFJaEMsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYXlCLFdBQVd6QixPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxXQUFaLENBaE5MOztBQUFBO0FBaU5EZ0Msa0JBQVFHLElBQVI7O0FBRUFyRCx1QkFBYXFELElBQWI7QUFDQWYsNEJBQWtCZSxJQUFsQjtBQUNBZCw0QkFBa0JjLElBQWxCO0FBQ0FiLGtCQUFRYSxJQUFSO0FBQ0E7QUFDQTVFLFlBQUV3RSxHQUFGO0FBeE5DO0FBQUEsMENBeU5LLElBQUloQyxPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLG1CQUFheUIsV0FBV3pCLE9BQVgsRUFBb0IsTUFBcEIsQ0FBYjtBQUFBLFdBQVosQ0F6Tkw7O0FBQUE7QUEwTkRxQyxrQkFBUUMsSUFBUjs7QUExTkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FGSCIsImZpbGUiOiJiYXNlLnRlc3QuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5pZiAoIWdsb2JhbC5fYmFiZWxQb2x5ZmlsbClyZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpXG4vLyB2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBkZXJlZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWRlcmVmLXN5bmMnKVxudmFyIGZha2VyID0gcmVxdWlyZSgnZmFrZXInKVxudmFyIGpzZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWZha2VyJylcbmZha2VyLmxvY2FsZSA9ICdpdCdcbnZhciByZXN0bGVyID0gcmVxdWlyZSgncmVzdGxlcicpXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBDT05TT0xFID0gcmVxdWlyZSgnLi4vamVzdXMnKS5nZXRDb25zb2xlKHtkZWJ1ZzogdHJ1ZSwgbG9nOiB0cnVlLCBlcnJvcjogdHJ1ZSwgd2FybjogdHJ1ZX0sICdCQVNFIFRFU1QnLCAnLS0tLScsICctLS0tLScpXG52YXIgamVzdXMgPSByZXF1aXJlKCcuLi9qZXN1cycpXG5cbnZhciBNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cFxudmFyIE1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cFxuXG50LnRlc3QoJyoqKiBTRVJWSUNFUyBORVQgKioqJywge1xuLy8gIGF1dG9lbmQ6IHRydWVcbn0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIHZhciBNU19SRVNPVVJDRVMgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL3Jlc291cmNlcy9zdGFydCcpKClcbiAgdmFyIE1TX0VWRU5UU19FTUlUVEVSID0gYXdhaXQgcmVxdWlyZSgnLi9zZXJ2aWNlcy9ldmVudHNFbWl0dGVyL3N0YXJ0JykoKVxuICB2YXIgTVNfQVVUSE9SSVpBVElPTlMgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL2F1dGhvcml6YXRpb25zL3N0YXJ0JykoKVxuICB2YXIgTVNfTE9HUyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvbG9ncy9zdGFydCcpKClcblxuICBhd2FpdCBqZXN1cy5zZXRTaGFyZWRDb25maWcocGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc2hhcmVkL3NlcnZpY2VzLycpLCAndmlldycsICdldmVudHMubGlzdGVuJywge30pXG5cbiAgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VJbnNlcnQgKHQsIGxvb3BzID0gMTAsIHN0ZXBzID0gMTAwKSB7XG4gICAgdmFyIG1ldGhvZHNDb25maWcgPSByZXF1aXJlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy9yZXNvdXJjZXMvbWV0aG9kcy5qc29uJykpXG4gICAgdmFyIGRlcmVmT3B0aW9ucyA9IHtiYXNlRm9sZGVyOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvc2VydmljZXMvcmVzb3VyY2VzLycpLCBmYWlsT25NaXNzaW5nOiB0cnVlfVxuICAgIENPTlNPTEUuZGVidWcoJ1RFU1QnLCAnbWV0aG9kc0NvbmZpZycsIG1ldGhvZHNDb25maWcpXG4gICAgdmFyIGJhc2VVcmwgPSAnaHR0cDovLycgKyBNU19SRVNPVVJDRVMuU0hBUkVEX05FVF9DT05GSUcudHJhbnNwb3J0cy5odHRwUHVibGljLnVybCArICcvJ1xuICAgIENPTlNPTEUuZGVidWcoJ1RFU1QnLCAnYmFzZVVybCcsIGJhc2VVcmwpXG4gICAgdmFyIHNjaGVtYUNyZWF0ZSA9IGRlcmVmKG1ldGhvZHNDb25maWcuY3JlYXRlUmVzb3VyY2UucmVxdWVzdFNjaGVtYSwgZGVyZWZPcHRpb25zKVxuICAgIHZhciBzY2hlbWFSZWFkID0gZGVyZWYobWV0aG9kc0NvbmZpZy5yZWFkUmVzb3VyY2UucmVxdWVzdFNjaGVtYSwgZGVyZWZPcHRpb25zKVxuICAgIHZhciBzY2hlbWFVcGRhdGUgPSBkZXJlZihtZXRob2RzQ29uZmlnLnVwZGF0ZVJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcbiAgICB2YXIgc2NoZW1hRGVsZXRlID0gZGVyZWYobWV0aG9kc0NvbmZpZy5kZWxldGVSZXNvdXJjZS5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG5cbiAgICBDT05TT0xFLmRlYnVnKCdqc29uIHNjaGVtYSBmYWtlciBzY2hlbWEnLCBkZXJlZk9wdGlvbnMsIHtzY2hlbWFDcmVhdGUsIHNjaGVtYVJlYWQsIHNjaGVtYVVwZGF0ZSwgc2NoZW1hRGVsZXRlfSlcbiAgICBDT05TT0xFLmRlYnVnKCdqc29uIHNjaGVtYSBmYWtlciBzY2hlbWEgZXhhbXBsZXMnLCBqc2Yoc2NoZW1hQ3JlYXRlKSwganNmKHNjaGVtYVJlYWQpLCBqc2Yoc2NoZW1hVXBkYXRlKSwganNmKHNjaGVtYURlbGV0ZSksKVxuICAgIHZhciB0ZXN0RGF0YVRvU2VuZCA9IFtdXG4gICAgLy8gYXdhaXQgdC50ZXN0KCdOTyBDT01QUkVTU0lPTicsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgLy8gICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgLy8gICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICdjcmVhdGVSZXNvdXJjZScpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgLy8gICAgICAgQ09OU09MRS5kZWJ1ZygncmVidWlsZFZpZXdzIHJlY2VpdmUnLCByZXNwb25zZSwgZGF0YVJlc3BvbnNlKVxuICAgIC8vICAgICAgIHJlc29sdmUoKVxuICAgIC8vICAgICB9KVxuICAgIC8vICAgfSlcbiAgICAvL1xuICAgIC8vICAgdC5lbmQoKVxuICAgIC8vIH0pXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29wczsgaSsrKSB7XG4gICAgICAvLyBDT05TT0xFLmdyb3VwKGBURVNUIFJJR0hUIERBVEEgJHtpfWApXG4gICAgICAvLyBDT05TT0xFLmdyb3VwKGBjcmVhdGVSZXNvdXJjZWApXG4gICAgICB2YXIgY3JlYXRlZFJlc3BvbnNlXG4gICAgICB2YXIgY3JlYXRlUmVxdWVzdCA9IGpzZihzY2hlbWFDcmVhdGUpXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQgY3JlYXRlUmVxdWVzdCcsIEpTT04uc3RyaW5naWZ5KGNyZWF0ZVJlcXVlc3QpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAnY3JlYXRlUmVzb3VyY2UnLCBjcmVhdGVSZXF1ZXN0KS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ3JlY2VpdmUnLCBKU09OLnN0cmluZ2lmeShkYXRhUmVzcG9uc2UpKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgY3JlYXRlUmVzb3VyY2UgaXMgb2JqZWN0JylcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLmlkLCAnc3RyaW5nJywgJ1Jlc3BvbnNlIGNyZWF0ZVJlc291cmNlIGlkIGlzIHN0cmluZyAnICsgZGF0YVJlc3BvbnNlLmlkKVxuICAgICAgICAgIGNyZWF0ZWRSZXNwb25zZSA9IGRhdGFSZXNwb25zZVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGlmIChzdGVwcyA9PT0gMSkgY29udGludWVcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXBFbmQoKVxuICAgICAgLy8gQ09OU09MRS5ncm91cChgcmVhZFJlc291cmNlIEZyb20gaWRgKVxuXG4gICAgICBDT05TT0xFLmRlYnVnKCdjcmVhdGVkUmVzcG9uc2UnLCAgY3JlYXRlZFJlc3BvbnNlKVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB2YXIgZGF0YSA9IHtpZDogY3JlYXRlZFJlc3BvbnNlLmlkLCB1c2VyaWQ6ICd0ZXN0JywgdG9rZW46ICd0ZXN0J31cbiAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCcsIHNjaGVtYVJlYWQsIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAncmVhZFJlc291cmNlJywgZGF0YSkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHJlYWRSZXNvdXJjZSBpcyBvYmplY3QnKVxuICAgICAgICAgIHQuc2FtZShkYXRhUmVzcG9uc2UuYm9keSwgY3JlYXRlUmVxdWVzdC5kYXRhLmJvZHksICdSZXNwb25zZSByZWFkUmVzb3VyY2UgIGJvZHkgYXMgc2VuZGVkLCBpZDonICsgZGF0YVJlc3BvbnNlLl9pZClcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBpZiAoc3RlcHMgPT09IDIpIGNvbnRpbnVlXG4gICAgICAvLyBDT05TT0xFLmdyb3VwRW5kKClcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXAoYHVwZGF0ZVJlc291cmNlYClcbiAgICAgIHNjaGVtYVVwZGF0ZS5wcm9wZXJ0aWVzLmRhdGEucmVxdWlyZWQgPSBbJ2JvZHknXVxuICAgICAgdmFyIHVwZGF0ZVJlcXVlc3QgPSBqc2Yoc2NoZW1hVXBkYXRlKVxuICAgICAgdXBkYXRlUmVxdWVzdC5pZCA9IGNyZWF0ZWRSZXNwb25zZS5pZFxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdzZW5kJywgc2NoZW1hVXBkYXRlLCBKU09OLnN0cmluZ2lmeSh1cGRhdGVSZXF1ZXN0KSlcbiAgICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ3VwZGF0ZVJlc291cmNlJywgdXBkYXRlUmVxdWVzdCkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHVwZGF0ZVJlc291cmNlIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC5zYW1lKGRhdGFSZXNwb25zZS5pZCwgY3JlYXRlZFJlc3BvbnNlLmlkLCAnUmVzcG9uc2UgdXBkYXRlUmVzb3VyY2UgIGlkIGFzIHNlbmRlZCwgaWQ6JyArIGRhdGFSZXNwb25zZS5pZClcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBpZiAoc3RlcHMgPT09IDMpIGNvbnRpbnVlXG4gICAgICAvLyBDT05TT0xFLmdyb3VwRW5kKClcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXAoYHJlYWRSZXNvdXJjZSBGcm9tIGRhdGEvX2lkYClcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdmFyIGRhdGEgPSB7aWQ6IGNyZWF0ZWRSZXNwb25zZS5pZCwgdXNlcmlkOiAndGVzdCcsIHRva2VuOiAndGVzdCd9XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQnLCBzY2hlbWFSZWFkLCBKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ3JlYWRSZXNvdXJjZScsIGRhdGEpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSByZWFkUmVzb3VyY2UgaXMgb2JqZWN0JylcbiAgICAgICAgICB0LnNhbWUoZGF0YVJlc3BvbnNlLmJvZHksIHVwZGF0ZVJlcXVlc3QuZGF0YS5ib2R5LCAnUmVzcG9uc2UgcmVhZFJlc291cmNlIGJvZHkgYXMgdXBkYXRlZCwgaWQ6JyArIGRhdGFSZXNwb25zZS5faWQpXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLy8gQ09OU09MRS5ncm91cEVuZCgpXG4gICAgICAvLyBDT05TT0xFLmdyb3VwRW5kKClcbiAgICB9XG4gIH1cblxuICAvL3QucGxhbigxKVxuXG4gIGNvbnNvbGUubG9nKCdodHRwOi8vMTI3LjAuMC4xOjgyMDMvaW5zcGVjdG9yJylcbiAgQ09OU09MRS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUFJFUEFSSU5HIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDAgLSBFVkVOVFNfRU1JVFRFUiBjaGlhbWF0YSBhbGxvIHN0cmVhbWluZyBkZWdsaSBldmVudGkgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG5cbiAgYXdhaXQgdC50ZXN0KCdURVNUIDAnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKE1TX0VWRU5UU19FTUlUVEVSKVxuICAgICAgTVNfRVZFTlRTX0VNSVRURVJfcmVxdWVzdEh0dHAgPSByZXF1ZXN0KFxuICAgICAgICB7IG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgc3RyZWFtOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB1cmk6ICdodHRwOi8vJyArIE1TX0VWRU5UU19FTUlUVEVSLlNIQVJFRF9ORVRfQ09ORklHLnRyYW5zcG9ydHMuaHR0cFB1YmxpYy51cmwgKyAnL2xpc3RlbkV2ZW50cydcbiAgICAgICAgfSlcbiAgICAgIE1TX0VWRU5UU19FTUlUVEVSX3JlcXVlc3RIdHRwXG4gICAgICAvLyAub24oJ3Jlc3BvbnNlJywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAvLyAgIENPTlNPTEUuZGVidWcoJ1RFU1QgSFRUUCBTVFJFQU1JTkcgUkVTUE9OU0UnLCByZXNwb25zZSlcbiAgICAgIC8vICAgTVNfRVZFTlRTX0VNSVRURVJfcmVzcG9uc2VIdHRwID0gcmVzcG9uc2VcbiAgICAgIC8vICAgcmVzb2x2ZSgpXG4gICAgICAvLyB9KVxuICAgICAgLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdURVNUIEhUVFAgU1RSRUFNSU5HIEVSUk9SJywgZXJyb3IpXG4gICAgICAgIHJlamVjdCgpXG4gICAgICB9KVxuICAgICAgLm9uKCdkYXRhJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnVEVTVCBIVFRQIFNUUkVBTUlORyBEQVRBJywgZGF0YSwgTVNfRVZFTlRTX0VNSVRURVJfcmVxdWVzdEh0dHApXG4gICAgICAgIHJlc29sdmUoZGF0YSlcbiAgICAgIH0pXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpXG4gICAgdC5lbmQoKVxuICB9KVxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMSAtIEluc2VyaW1lbnRvIERhdGkgKE1TX1ZJRVcgc3BlbnRvKS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgMSAtIEluc2VyaW1lbnRvIERhdGkgKE1TX1ZJRVcgc3BlbnRvKScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgcmVzb3VyY2VJbnNlcnQodCwgMSlcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgLy9hd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCA2MDAwMCkpIC8vIFNUT1AgVEhFUkUhISFcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVE9QIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLSBhY2NlbmRvIE1TX1ZJRVctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgdmFyIE1TX1ZJRVcgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL3ZpZXcvc3RhcnQnKSgpXG4gIHZhciBNU19WSUVXX1VSTCA9ICdodHRwOi8vJyArIE1TX1ZJRVcuU0hBUkVEX05FVF9DT05GSUcudHJhbnNwb3J0cy5odHRwLnVybCArICcvJyAvL1BSSVZBVEUgQ0FMTFxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDIuMSAtIE1TX1ZJRVcgcmVidWlsZFZpZXdzIChNU19WSUVXIGRvdnJlYmJlIHJlY3VwZXJhcmVpIGRhdGkgaW5zZXJpdGkgaW4gcHJlY2VkZW56YSktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDIuMScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCByZWJ1aWxkVmlld3MnLCBNU19WSUVXX1VSTCArICdyZWJ1aWxkVmlld3MnKVxuICAgICAgcmVzdGxlci5wb3N0SnNvbihNU19WSUVXX1VSTCArICdyZWJ1aWxkVmlld3MnKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWJ1aWxkVmlld3MgcmVjZWl2ZScsIHJlc3BvbnNlLCBkYXRhUmVzcG9uc2UpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLSBhZ2dpdW5nbyBldmVudG8gdmlld3NVcGRhdGVkIGEgTVNfVklFVy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgYXdhaXQgamVzdXMuc2V0U2hhcmVkQ29uZmlnKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy8nKSwgJ3ZpZXcnLCAnZXZlbnRzLmxpc3RlbicsIHtcbiAgICAndmlld3NVcGRhdGVkJzoge1xuICAgICAgJ21ldGhvZCc6ICd2aWV3c1VwZGF0ZWQnLFxuICAgICAgJ2hhdmVSZXNwb25zZSc6IGZhbHNlXG4gICAgfVxuICB9KVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDIuMiAtIEluc2VyaW1lbnRvIERhdGkgKE1TX1ZJRVcgYWNjZXNvLGRvdnJlYmJlIGFnZ2lvcm5hcnNpIGxpdmUpLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG5cbiAgYXdhaXQgdC50ZXN0KCdURVNUIDIuMicsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgcmVzb3VyY2VJbnNlcnQodCwgNSwgMSlcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpXG4gIGF3YWl0IGplc3VzLnNldFNoYXJlZENvbmZpZyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvc2VydmljZXMvJyksICd2aWV3JywgJ2V2ZW50cy5saXN0ZW4nLCB7fSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIE1TX1ZJRVcuc3RvcCgpXG5cbiAgQ09OU09MRS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gU1RPUCAtIE1TX1ZJRVcgc3RvcHBlZC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMyAtIEluc2VyaW1lbnRvIERhdGkgKE1TX1ZJRVcgc3RvcHBlZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IHQudGVzdCgnVEVTVCAzJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCByZXNvdXJjZUluc2VydCh0LCA1LCAxKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLSBNU19WSUVXIHN0YXJ0aW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IE1TX1ZJRVcuc3RhcnQoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDQgLSBNU19WSUVXIHN5bmNWaWV3cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDQnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQgc3luY1ZpZXdzJywgTVNfVklFV19VUkwgKyAnc3luY1ZpZXdzJylcbiAgICAgIHJlc3RsZXIucG9zdEpzb24oTVNfVklFV19VUkwgKyAnc3luY1ZpZXdzJykub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1Zygnc3luY1ZpZXdzIHJlY2VpdmUnLCByZXNwb25zZSwgZGF0YVJlc3BvbnNlKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHQuZW5kKClcbiAgfSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpXG4gIE1TX1ZJRVcuc3RvcCgpXG5cbiAgTVNfUkVTT1VSQ0VTLnN0b3AoKVxuICBNU19FVkVOVFNfRU1JVFRFUi5zdG9wKClcbiAgTVNfQVVUSE9SSVpBVElPTlMuc3RvcCgpXG4gIE1TX0xPR1Muc3RvcCgpXG4gIC8vaWYoTVNfRVZFTlRTX0VNSVRURVJfcmVzcG9uc2VIdHRwKU1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cC5kZXN0cm95KClcbiAgdC5lbmQoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwMDApKVxuICBwcm9jZXNzLmV4aXQoKVxufSlcbiJdfQ==