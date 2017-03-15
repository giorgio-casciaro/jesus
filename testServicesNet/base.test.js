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
                      //console.log(MS_EVENTS_EMITTER)
                      MS_EVENTS_EMITTER_requestHttp = request({ method: 'GET',
                        headers: {
                          'app-meta-stream': true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiZGVyZWYiLCJmYWtlciIsImpzZiIsImxvY2FsZSIsInJlc3RsZXIiLCJyZXF1ZXN0IiwidCIsInBhdGgiLCJDT05TT0xFIiwiZ2V0Q29uc29sZSIsImRlYnVnIiwibG9nIiwiZXJyb3IiLCJ3YXJuIiwiamVzdXMiLCJNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cCIsIk1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cCIsInRlc3QiLCJtYWluVGVzdCIsInJlc291cmNlSW5zZXJ0IiwibG9vcHMiLCJzdGVwcyIsIm1ldGhvZHNDb25maWciLCJqb2luIiwiX19kaXJuYW1lIiwiZGVyZWZPcHRpb25zIiwiYmFzZUZvbGRlciIsImZhaWxPbk1pc3NpbmciLCJiYXNlVXJsIiwiTVNfUkVTT1VSQ0VTIiwiU0hBUkVEX05FVF9DT05GSUciLCJ0cmFuc3BvcnRzIiwiaHR0cFB1YmxpYyIsInVybCIsInNjaGVtYUNyZWF0ZSIsImNyZWF0ZVJlc291cmNlIiwicmVxdWVzdFNjaGVtYSIsInNjaGVtYVJlYWQiLCJyZWFkUmVzb3VyY2UiLCJzY2hlbWFVcGRhdGUiLCJ1cGRhdGVSZXNvdXJjZSIsInNjaGVtYURlbGV0ZSIsImRlbGV0ZVJlc291cmNlIiwidGVzdERhdGFUb1NlbmQiLCJpIiwiY3JlYXRlUmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiSlNPTiIsInN0cmluZ2lmeSIsInBvc3RKc29uIiwib24iLCJkYXRhUmVzcG9uc2UiLCJyZXNwb25zZSIsInR5cGUiLCJpZCIsImNyZWF0ZWRSZXNwb25zZSIsImRhdGEiLCJ1c2VyaWQiLCJ0b2tlbiIsInNhbWUiLCJib2R5IiwiX2lkIiwicHJvcGVydGllcyIsInJlcXVpcmVkIiwidXBkYXRlUmVxdWVzdCIsIk1TX0VWRU5UU19FTUlUVEVSIiwiTVNfQVVUSE9SSVpBVElPTlMiLCJNU19MT0dTIiwic2V0U2hhcmVkQ29uZmlnIiwiY29uc29sZSIsInNldFRpbWVvdXQiLCJtZXRob2QiLCJoZWFkZXJzIiwidXJpIiwiY2F0Y2giLCJlbmQiLCJNU19WSUVXIiwiTVNfVklFV19VUkwiLCJodHRwIiwic3RvcCIsInN0YXJ0IiwicHJvY2VzcyIsImV4aXQiXSwibWFwcGluZ3MiOiI7O0FBQ0EsSUFBSSxDQUFDQSxPQUFPQyxjQUFaLEVBQTJCQyxRQUFRLGdCQUFSO0FBQzNCO0FBQ0EsSUFBSUMsUUFBUUQsUUFBUSx3QkFBUixDQUFaO0FBQ0EsSUFBSUUsUUFBUUYsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJRyxNQUFNSCxRQUFRLG1CQUFSLENBQVY7QUFDQUUsTUFBTUUsTUFBTixHQUFlLElBQWY7QUFDQSxJQUFJQyxVQUFVTCxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlNLFVBQVVOLFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBSU8sSUFBSVAsUUFBUSxLQUFSLENBQVI7QUFDQSxJQUFJUSxPQUFPUixRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlTLFVBQVVULFFBQVEsVUFBUixFQUFvQlUsVUFBcEIsQ0FBK0IsRUFBQ0MsT0FBTyxJQUFSLEVBQWNDLEtBQUssSUFBbkIsRUFBeUJDLE9BQU8sSUFBaEMsRUFBc0NDLE1BQU0sSUFBNUMsRUFBL0IsRUFBa0YsV0FBbEYsRUFBK0YsTUFBL0YsRUFBdUcsT0FBdkcsQ0FBZDtBQUNBLElBQUlDLFFBQVFmLFFBQVEsVUFBUixDQUFaOztBQUVBLElBQUlnQiw2QkFBSjtBQUNBLElBQUlDLDhCQUFKOztBQUVBVixFQUFFVyxJQUFGLENBQU8sc0JBQVAsRUFBK0I7QUFDL0I7QUFEK0IsQ0FBL0IsRUFFRyxTQUFlQyxRQUFmLENBQXlCWixDQUF6QjtBQUFBLG1FQVFjYSxjQVJkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRY0Esd0JBUmQsWUFRY0EsY0FSZCxDQVE4QmIsQ0FSOUI7QUFBQSxnQkFRaUNjLEtBUmpDLHVFQVF5QyxFQVJ6QztBQUFBLGdCQVE2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dC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmlmICghZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKXJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJylcbi8vIHZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIGRlcmVmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZGVyZWYtc3luYycpXG52YXIgZmFrZXIgPSByZXF1aXJlKCdmYWtlcicpXG52YXIganNmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZmFrZXInKVxuZmFrZXIubG9jYWxlID0gJ2l0J1xudmFyIHJlc3RsZXIgPSByZXF1aXJlKCdyZXN0bGVyJylcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpXG52YXIgdCA9IHJlcXVpcmUoJ3RhcCcpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIENPTlNPTEUgPSByZXF1aXJlKCcuLi9qZXN1cycpLmdldENvbnNvbGUoe2RlYnVnOiB0cnVlLCBsb2c6IHRydWUsIGVycm9yOiB0cnVlLCB3YXJuOiB0cnVlfSwgJ0JBU0UgVEVTVCcsICctLS0tJywgJy0tLS0tJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4uL2plc3VzJylcblxudmFyIE1TX0VWRU5UU19FTUlUVEVSX3JlcXVlc3RIdHRwXG52YXIgTVNfRVZFTlRTX0VNSVRURVJfcmVzcG9uc2VIdHRwXG5cbnQudGVzdCgnKioqIFNFUlZJQ0VTIE5FVCAqKionLCB7XG4vLyAgYXV0b2VuZDogdHJ1ZVxufSwgYXN5bmMgZnVuY3Rpb24gbWFpblRlc3QgKHQpIHtcbiAgdmFyIE1TX1JFU09VUkNFUyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvcmVzb3VyY2VzL3N0YXJ0JykoKVxuICB2YXIgTVNfRVZFTlRTX0VNSVRURVIgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL2V2ZW50c0VtaXR0ZXIvc3RhcnQnKSgpXG4gIHZhciBNU19BVVRIT1JJWkFUSU9OUyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvYXV0aG9yaXphdGlvbnMvc3RhcnQnKSgpXG4gIHZhciBNU19MT0dTID0gYXdhaXQgcmVxdWlyZSgnLi9zZXJ2aWNlcy9sb2dzL3N0YXJ0JykoKVxuXG4gIGF3YWl0IGplc3VzLnNldFNoYXJlZENvbmZpZyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvc2VydmljZXMvJyksICd2aWV3JywgJ2V2ZW50cy5saXN0ZW4nLCB7fSlcblxuICBhc3luYyBmdW5jdGlvbiByZXNvdXJjZUluc2VydCAodCwgbG9vcHMgPSAxMCwgc3RlcHMgPSAxMDApIHtcbiAgICB2YXIgbWV0aG9kc0NvbmZpZyA9IHJlcXVpcmUocGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc2hhcmVkL3NlcnZpY2VzL3Jlc291cmNlcy9tZXRob2RzLmpzb24nKSlcbiAgICB2YXIgZGVyZWZPcHRpb25zID0ge2Jhc2VGb2xkZXI6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy9yZXNvdXJjZXMvJyksIGZhaWxPbk1pc3Npbmc6IHRydWV9XG4gICAgQ09OU09MRS5kZWJ1ZygnVEVTVCcsICdtZXRob2RzQ29uZmlnJywgbWV0aG9kc0NvbmZpZylcbiAgICB2YXIgYmFzZVVybCA9ICdodHRwOi8vJyArIE1TX1JFU09VUkNFUy5TSEFSRURfTkVUX0NPTkZJRy50cmFuc3BvcnRzLmh0dHBQdWJsaWMudXJsICsgJy8nXG4gICAgQ09OU09MRS5kZWJ1ZygnVEVTVCcsICdiYXNlVXJsJywgYmFzZVVybClcbiAgICB2YXIgc2NoZW1hQ3JlYXRlID0gZGVyZWYobWV0aG9kc0NvbmZpZy5jcmVhdGVSZXNvdXJjZS5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG4gICAgdmFyIHNjaGVtYVJlYWQgPSBkZXJlZihtZXRob2RzQ29uZmlnLnJlYWRSZXNvdXJjZS5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG4gICAgdmFyIHNjaGVtYVVwZGF0ZSA9IGRlcmVmKG1ldGhvZHNDb25maWcudXBkYXRlUmVzb3VyY2UucmVxdWVzdFNjaGVtYSwgZGVyZWZPcHRpb25zKVxuICAgIHZhciBzY2hlbWFEZWxldGUgPSBkZXJlZihtZXRob2RzQ29uZmlnLmRlbGV0ZVJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcblxuICAgIENPTlNPTEUuZGVidWcoJ2pzb24gc2NoZW1hIGZha2VyIHNjaGVtYScsIGRlcmVmT3B0aW9ucywge3NjaGVtYUNyZWF0ZSwgc2NoZW1hUmVhZCwgc2NoZW1hVXBkYXRlLCBzY2hlbWFEZWxldGV9KVxuICAgIENPTlNPTEUuZGVidWcoJ2pzb24gc2NoZW1hIGZha2VyIHNjaGVtYSBleGFtcGxlcycsIGpzZihzY2hlbWFDcmVhdGUpLCBqc2Yoc2NoZW1hUmVhZCksIGpzZihzY2hlbWFVcGRhdGUpLCBqc2Yoc2NoZW1hRGVsZXRlKSwpXG4gICAgdmFyIHRlc3REYXRhVG9TZW5kID0gW11cbiAgICAvLyBhd2FpdCB0LnRlc3QoJ05PIENPTVBSRVNTSU9OJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICAvLyAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ2NyZWF0ZVJlc291cmNlJykub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICBDT05TT0xFLmRlYnVnKCdyZWJ1aWxkVmlld3MgcmVjZWl2ZScsIHJlc3BvbnNlLCBkYXRhUmVzcG9uc2UpXG4gICAgLy8gICAgICAgcmVzb2x2ZSgpXG4gICAgLy8gICAgIH0pXG4gICAgLy8gICB9KVxuICAgIC8vXG4gICAgLy8gICB0LmVuZCgpXG4gICAgLy8gfSlcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvb3BzOyBpKyspIHtcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXAoYFRFU1QgUklHSFQgREFUQSAke2l9YClcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXAoYGNyZWF0ZVJlc291cmNlYClcbiAgICAgIHZhciBjcmVhdGVkUmVzcG9uc2VcbiAgICAgIHZhciBjcmVhdGVSZXF1ZXN0ID0ganNmKHNjaGVtYUNyZWF0ZSlcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCBjcmVhdGVSZXF1ZXN0JywgSlNPTi5zdHJpbmdpZnkoY3JlYXRlUmVxdWVzdCkpXG4gICAgICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICdjcmVhdGVSZXNvdXJjZScsIGNyZWF0ZVJlcXVlc3QpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSBjcmVhdGVSZXNvdXJjZSBpcyBvYmplY3QnKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UuaWQsICdzdHJpbmcnLCAnUmVzcG9uc2UgY3JlYXRlUmVzb3VyY2UgaWQgaXMgc3RyaW5nICcgKyBkYXRhUmVzcG9uc2UuaWQpXG4gICAgICAgICAgY3JlYXRlZFJlc3BvbnNlID0gZGF0YVJlc3BvbnNlXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgaWYgKHN0ZXBzID09PSAxKSBjb250aW51ZVxuICAgICAgLy8gQ09OU09MRS5ncm91cEVuZCgpXG4gICAgICAvLyBDT05TT0xFLmdyb3VwKGByZWFkUmVzb3VyY2UgRnJvbSBpZGApXG5cbiAgICAgIENPTlNPTEUuZGVidWcoJ2NyZWF0ZWRSZXNwb25zZScsICBjcmVhdGVkUmVzcG9uc2UpXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHZhciBkYXRhID0ge2lkOiBjcmVhdGVkUmVzcG9uc2UuaWQsIHVzZXJpZDogJ3Rlc3QnLCB0b2tlbjogJ3Rlc3QnfVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdzZW5kJywgc2NoZW1hUmVhZCwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gICAgICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICdyZWFkUmVzb3VyY2UnLCBkYXRhKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ3JlY2VpdmUnLCBKU09OLnN0cmluZ2lmeShkYXRhUmVzcG9uc2UpKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgcmVhZFJlc291cmNlIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC5zYW1lKGRhdGFSZXNwb25zZS5ib2R5LCBjcmVhdGVSZXF1ZXN0LmRhdGEuYm9keSwgJ1Jlc3BvbnNlIHJlYWRSZXNvdXJjZSAgYm9keSBhcyBzZW5kZWQsIGlkOicgKyBkYXRhUmVzcG9uc2UuX2lkKVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGlmIChzdGVwcyA9PT0gMikgY29udGludWVcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXBFbmQoKVxuICAgICAgLy8gQ09OU09MRS5ncm91cChgdXBkYXRlUmVzb3VyY2VgKVxuICAgICAgc2NoZW1hVXBkYXRlLnByb3BlcnRpZXMuZGF0YS5yZXF1aXJlZCA9IFsnYm9keSddXG4gICAgICB2YXIgdXBkYXRlUmVxdWVzdCA9IGpzZihzY2hlbWFVcGRhdGUpXG4gICAgICB1cGRhdGVSZXF1ZXN0LmlkID0gY3JlYXRlZFJlc3BvbnNlLmlkXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQnLCBzY2hlbWFVcGRhdGUsIEpTT04uc3RyaW5naWZ5KHVwZGF0ZVJlcXVlc3QpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAndXBkYXRlUmVzb3VyY2UnLCB1cGRhdGVSZXF1ZXN0KS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ3JlY2VpdmUnLCBKU09OLnN0cmluZ2lmeShkYXRhUmVzcG9uc2UpKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgdXBkYXRlUmVzb3VyY2UgaXMgb2JqZWN0JylcbiAgICAgICAgICB0LnNhbWUoZGF0YVJlc3BvbnNlLmlkLCBjcmVhdGVkUmVzcG9uc2UuaWQsICdSZXNwb25zZSB1cGRhdGVSZXNvdXJjZSAgaWQgYXMgc2VuZGVkLCBpZDonICsgZGF0YVJlc3BvbnNlLmlkKVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGlmIChzdGVwcyA9PT0gMykgY29udGludWVcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXBFbmQoKVxuICAgICAgLy8gQ09OU09MRS5ncm91cChgcmVhZFJlc291cmNlIEZyb20gZGF0YS9faWRgKVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB2YXIgZGF0YSA9IHtpZDogY3JlYXRlZFJlc3BvbnNlLmlkLCB1c2VyaWQ6ICd0ZXN0JywgdG9rZW46ICd0ZXN0J31cbiAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCcsIHNjaGVtYVJlYWQsIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAncmVhZFJlc291cmNlJywgZGF0YSkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHJlYWRSZXNvdXJjZSBpcyBvYmplY3QnKVxuICAgICAgICAgIHQuc2FtZShkYXRhUmVzcG9uc2UuYm9keSwgdXBkYXRlUmVxdWVzdC5kYXRhLmJvZHksICdSZXNwb25zZSByZWFkUmVzb3VyY2UgYm9keSBhcyB1cGRhdGVkLCBpZDonICsgZGF0YVJlc3BvbnNlLl9pZClcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICAvLyBDT05TT0xFLmdyb3VwRW5kKClcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXBFbmQoKVxuICAgIH1cbiAgfVxuXG4gIC8vdC5wbGFuKDEpXG5cbiAgY29uc29sZS5sb2coJ2h0dHA6Ly8xMjcuMC4wLjE6ODIwMy9pbnNwZWN0b3InKVxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMCAtIEVWRU5UU19FTUlUVEVSIGNoaWFtYXRhIGFsbG8gc3RyZWFtaW5nIGRlZ2xpIGV2ZW50aSAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcblxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgMCcsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy9jb25zb2xlLmxvZyhNU19FVkVOVFNfRU1JVFRFUilcbiAgICAgIE1TX0VWRU5UU19FTUlUVEVSX3JlcXVlc3RIdHRwID0gcmVxdWVzdChcbiAgICAgICAgeyBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdhcHAtbWV0YS1zdHJlYW0nOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB1cmk6ICdodHRwOi8vJyArIE1TX0VWRU5UU19FTUlUVEVSLlNIQVJFRF9ORVRfQ09ORklHLnRyYW5zcG9ydHMuaHR0cFB1YmxpYy51cmwgKyAnL2xpc3RlbkV2ZW50cydcbiAgICAgICAgfSlcbiAgICAgIE1TX0VWRU5UU19FTUlUVEVSX3JlcXVlc3RIdHRwXG4gICAgICAvLyAub24oJ3Jlc3BvbnNlJywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAvLyAgIENPTlNPTEUuZGVidWcoJ1RFU1QgSFRUUCBTVFJFQU1JTkcgUkVTUE9OU0UnLCByZXNwb25zZSlcbiAgICAgIC8vICAgTVNfRVZFTlRTX0VNSVRURVJfcmVzcG9uc2VIdHRwID0gcmVzcG9uc2VcbiAgICAgIC8vICAgcmVzb2x2ZSgpXG4gICAgICAvLyB9KVxuICAgICAgLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdURVNUIEhUVFAgU1RSRUFNSU5HIEVSUk9SJywgZXJyb3IpXG4gICAgICAgIHJlamVjdCgpXG4gICAgICB9KVxuICAgICAgLm9uKCdkYXRhJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnVEVTVCBIVFRQIFNUUkVBTUlORyBEQVRBJywgZGF0YSwgTVNfRVZFTlRTX0VNSVRURVJfcmVxdWVzdEh0dHApXG4gICAgICAgIHJlc29sdmUoZGF0YSlcbiAgICAgIH0pXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpXG4gICAgdC5lbmQoKVxuICB9KVxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMSAtIEluc2VyaW1lbnRvIERhdGkgKE1TX1ZJRVcgc3BlbnRvKS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgMSAtIEluc2VyaW1lbnRvIERhdGkgKE1TX1ZJRVcgc3BlbnRvKScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgcmVzb3VyY2VJbnNlcnQodCwgMSlcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgLy9hd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCA2MDAwMCkpIC8vIFNUT1AgVEhFUkUhISFcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVE9QIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLSBhY2NlbmRvIE1TX1ZJRVctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgdmFyIE1TX1ZJRVcgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL3ZpZXcvc3RhcnQnKSgpXG4gIHZhciBNU19WSUVXX1VSTCA9ICdodHRwOi8vJyArIE1TX1ZJRVcuU0hBUkVEX05FVF9DT05GSUcudHJhbnNwb3J0cy5odHRwLnVybCArICcvJyAvL1BSSVZBVEUgQ0FMTFxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDIuMSAtIE1TX1ZJRVcgcmVidWlsZFZpZXdzIChNU19WSUVXIGRvdnJlYmJlIHJlY3VwZXJhcmVpIGRhdGkgaW5zZXJpdGkgaW4gcHJlY2VkZW56YSktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDIuMScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCByZWJ1aWxkVmlld3MnLCBNU19WSUVXX1VSTCArICdyZWJ1aWxkVmlld3MnKVxuICAgICAgcmVzdGxlci5wb3N0SnNvbihNU19WSUVXX1VSTCArICdyZWJ1aWxkVmlld3MnKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWJ1aWxkVmlld3MgcmVjZWl2ZScsIHJlc3BvbnNlLCBkYXRhUmVzcG9uc2UpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLSBhZ2dpdW5nbyBldmVudG8gdmlld3NVcGRhdGVkIGEgTVNfVklFVy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgYXdhaXQgamVzdXMuc2V0U2hhcmVkQ29uZmlnKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy8nKSwgJ3ZpZXcnLCAnZXZlbnRzLmxpc3RlbicsIHtcbiAgICAndmlld3NVcGRhdGVkJzoge1xuICAgICAgJ21ldGhvZCc6ICd2aWV3c1VwZGF0ZWQnLFxuICAgICAgJ2hhdmVSZXNwb25zZSc6IGZhbHNlXG4gICAgfVxuICB9KVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDIuMiAtIEluc2VyaW1lbnRvIERhdGkgKE1TX1ZJRVcgYWNjZXNvLGRvdnJlYmJlIGFnZ2lvcm5hcnNpIGxpdmUpLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG5cbiAgYXdhaXQgdC50ZXN0KCdURVNUIDIuMicsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgcmVzb3VyY2VJbnNlcnQodCwgNSwgMSlcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpXG4gIGF3YWl0IGplc3VzLnNldFNoYXJlZENvbmZpZyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvc2VydmljZXMvJyksICd2aWV3JywgJ2V2ZW50cy5saXN0ZW4nLCB7fSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIE1TX1ZJRVcuc3RvcCgpXG5cbiAgQ09OU09MRS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gU1RPUCAtIE1TX1ZJRVcgc3RvcHBlZC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwMDApKVxuXG4gIENPTlNPTEUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMyAtIEluc2VyaW1lbnRvIERhdGkgKE1TX1ZJRVcgc3RvcHBlZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IHQudGVzdCgnVEVTVCAzJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCByZXNvdXJjZUluc2VydCh0LCA1LCAxKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLSBNU19WSUVXIHN0YXJ0aW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IE1TX1ZJRVcuc3RhcnQoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDQgLSBNU19WSUVXIHN5bmNWaWV3cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDQnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQgc3luY1ZpZXdzJywgTVNfVklFV19VUkwgKyAnc3luY1ZpZXdzJylcbiAgICAgIHJlc3RsZXIucG9zdEpzb24oTVNfVklFV19VUkwgKyAnc3luY1ZpZXdzJykub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1Zygnc3luY1ZpZXdzIHJlY2VpdmUnLCByZXNwb25zZSwgZGF0YVJlc3BvbnNlKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHQuZW5kKClcbiAgfSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpXG4gIE1TX1ZJRVcuc3RvcCgpXG5cbiAgTVNfUkVTT1VSQ0VTLnN0b3AoKVxuICBNU19FVkVOVFNfRU1JVFRFUi5zdG9wKClcbiAgTVNfQVVUSE9SSVpBVElPTlMuc3RvcCgpXG4gIE1TX0xPR1Muc3RvcCgpXG4gIC8vaWYoTVNfRVZFTlRTX0VNSVRURVJfcmVzcG9uc2VIdHRwKU1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cC5kZXN0cm95KClcbiAgdC5lbmQoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwMDApKVxuICBwcm9jZXNzLmV4aXQoKVxufSlcbiJdfQ==