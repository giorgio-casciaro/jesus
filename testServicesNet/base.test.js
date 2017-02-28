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
var LOG = require('../jesus').LOG('BASE TEST', '----', '-----');
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
                    methodsConfig = require(MS_RESOURCES.CONFIG.sharedServicePath + '/methods.json');
                    derefOptions = { baseFolder: MS_RESOURCES.CONFIG.sharedServicePath, failOnMissing: true };

                    LOG.debug('TEST', 'methodsConfig', methodsConfig);
                    baseUrl = 'http://127.0.0.1:' + MS_RESOURCES.SHARED_CONFIG.httpPublicApiPort + '/';

                    LOG.debug('TEST', 'baseUrl', baseUrl);
                    schemaCreate = deref(methodsConfig.createResource.requestSchema, derefOptions);
                    schemaRead = deref(methodsConfig.readResource.requestSchema, derefOptions);
                    schemaUpdate = deref(methodsConfig.updateResource.requestSchema, derefOptions);
                    schemaDelete = deref(methodsConfig.deleteResource.requestSchema, derefOptions);


                    LOG.debug('json schema faker schema', derefOptions, { schemaCreate: schemaCreate, schemaRead: schemaRead, schemaUpdate: schemaUpdate, schemaDelete: schemaDelete });
                    LOG.debug('json schema faker schema examples', jsf(schemaCreate), jsf(schemaRead), jsf(schemaUpdate), jsf(schemaDelete));
                    testDataToSend = [];
                    // await t.test('NO COMPRESSION', async function (t) {
                    //   await new Promise((resolve, reject) => {
                    //     restler.postJson(baseUrl + 'createResource').on('complete', function (dataResponse, response) {
                    //       LOG.debug('rebuildViews receive', response, dataResponse)
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
                    // LOG.group(`TEST RIGHT DATA ${i}`)
                    // LOG.group(`createResource`)

                    _context.next = 17;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      LOG.debug('send createRequest', JSON.stringify(createRequest));
                      restler.postJson(baseUrl + 'createResource', createRequest).on('complete', function (dataResponse, response) {
                        LOG.debug('receive', JSON.stringify(dataResponse));
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
                      LOG.debug('send', schemaRead, JSON.stringify(data));
                      restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
                        LOG.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response readResource is object');
                        t.same(dataResponse.body, createRequest.data.body, 'Response readResource  body as sended, id:' + dataResponse._id);
                        resolve();
                      });
                    }));

                  case 21:
                    // LOG.groupEnd()
                    // LOG.group(`updateResource`)
                    schemaUpdate.properties.data.required = ['body'];
                    updateRequest = jsf(schemaUpdate);

                    updateRequest.id = createdResponse.id;
                    _context.next = 26;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      LOG.debug('send', schemaUpdate, JSON.stringify(updateRequest));
                      restler.postJson(baseUrl + 'updateResource', updateRequest).on('complete', function (dataResponse, response) {
                        LOG.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response updateResource is object');
                        t.same(dataResponse.id, createdResponse.id, 'Response updateResource  id as sended, id:' + dataResponse.id);
                        resolve();
                      });
                    }));

                  case 26:
                    _context.next = 28;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var data = { id: createdResponse.id, userId: 'test', token: 'test' };
                      LOG.debug('send', schemaRead, JSON.stringify(data));
                      restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
                        LOG.debug('receive', JSON.stringify(dataResponse));
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

          LOG.debug('-------------------------------------- PREPARING -------------------------------------------');
          _context8.next = 20;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 2000);
          }));

        case 20:

          LOG.debug('-------------------------------------- TEST 0 - EVENTS_EMITTER chiamata allo streaming degli eventi  ------------------------------------------');
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
                        LOG.debug('TEST HTTP STREAMING RESPONSE', response);
                        MS_EVENTS_EMITTER_responseHttp = response;
                        resolve();
                      }).on('error', function (error) {
                        LOG.debug('TEST HTTP STREAMING ERROR', error);
                        reject();
                      }).on('data', function (binData) {
                        var dataString = binData.toString('utf8');
                        var data = JSON.parse(dataString.replace('data: ', ''));
                        LOG.debug('TEST HTTP STREAMING DATA', data, MS_EVENTS_EMITTER_requestHttp);
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
          LOG.debug('-------------------------------------- PREPARING -------------------------------------------');
          _context8.next = 26;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 26:

          LOG.debug('-------------------------------------- TEST 1 - Inserimento Dati (MS_VIEW spento)-------------------------------------------');
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
          process.exit();
          LOG.debug('-------------------------------------- STOP -------------------------------------------');
          _context8.next = 33;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 33:

          LOG.debug('-------------------------------------- PREPARING - accendo MS_VIEW-------------------------------------------');
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

          LOG.debug('-------------------------------------- TEST 2.1 - MS_VIEW rebuildViews (MS_VIEW dovrebbe recuperarei dati inseriti in precedenza)-------------------------------------------');
          _context8.next = 43;
          return regeneratorRuntime.awrap(t.test('TEST 2.1', function _callee3(t) {
            return regeneratorRuntime.async(function _callee3$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      LOG.debug('send rebuildViews', MS_VIEW_URL + 'rebuildViews');
                      restler.postJson(MS_VIEW_URL + 'rebuildViews').on('complete', function (dataResponse, response) {
                        LOG.debug('rebuildViews receive', response, dataResponse);
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

          LOG.debug('-------------------------------------- PREPARING - aggiungo evento viewsUpdated a MS_VIEW-------------------------------------------');
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

          LOG.debug('-------------------------------------- TEST 2.2 - Inserimento Dati (MS_VIEW acceso,dovrebbe aggiornarsi live)-------------------------------------------');

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

          LOG.debug('-------------------------------------- STOP - MS_VIEW stopped------------------------------------------');
          _context8.next = 63;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 63:

          LOG.debug('-------------------------------------- TEST 3 - Inserimento Dati (MS_VIEW stopped) -------------------------------------------');
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

          LOG.debug('-------------------------------------- PREPARING - MS_VIEW starting-------------------------------------------');
          _context8.next = 69;
          return regeneratorRuntime.awrap(MS_VIEW.start());

        case 69:
          _context8.next = 71;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 71:

          LOG.debug('-------------------------------------- TEST 4 - MS_VIEW syncViews -------------------------------------------');
          _context8.next = 74;
          return regeneratorRuntime.awrap(t.test('TEST 4', function _callee6(t) {
            return regeneratorRuntime.async(function _callee6$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      LOG.debug('send syncViews', MS_VIEW_URL + 'syncViews');
                      restler.postJson(MS_VIEW_URL + 'syncViews').on('complete', function (dataResponse, response) {
                        LOG.debug('syncViews receive', response, dataResponse);
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
            return setTimeout(resolve, 1000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiZGVyZWYiLCJmYWtlciIsImpzZiIsImxvY2FsZSIsInJlc3RsZXIiLCJyZXF1ZXN0IiwidCIsInBhdGgiLCJMT0ciLCJqZXN1cyIsInRlc3QiLCJtYWluVGVzdCIsInJlc291cmNlSW5zZXJ0IiwibG9vcHMiLCJzdGVwcyIsIm1ldGhvZHNDb25maWciLCJNU19SRVNPVVJDRVMiLCJDT05GSUciLCJzaGFyZWRTZXJ2aWNlUGF0aCIsImRlcmVmT3B0aW9ucyIsImJhc2VGb2xkZXIiLCJmYWlsT25NaXNzaW5nIiwiZGVidWciLCJiYXNlVXJsIiwiU0hBUkVEX0NPTkZJRyIsImh0dHBQdWJsaWNBcGlQb3J0Iiwic2NoZW1hQ3JlYXRlIiwiY3JlYXRlUmVzb3VyY2UiLCJyZXF1ZXN0U2NoZW1hIiwic2NoZW1hUmVhZCIsInJlYWRSZXNvdXJjZSIsInNjaGVtYVVwZGF0ZSIsInVwZGF0ZVJlc291cmNlIiwic2NoZW1hRGVsZXRlIiwiZGVsZXRlUmVzb3VyY2UiLCJ0ZXN0RGF0YVRvU2VuZCIsImkiLCJjcmVhdGVSZXF1ZXN0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJKU09OIiwic3RyaW5naWZ5IiwicG9zdEpzb24iLCJvbiIsImRhdGFSZXNwb25zZSIsInJlc3BvbnNlIiwidHlwZSIsImlkIiwiY3JlYXRlZFJlc3BvbnNlIiwiZGF0YSIsInVzZXJJZCIsInRva2VuIiwic2FtZSIsImJvZHkiLCJfaWQiLCJwcm9wZXJ0aWVzIiwicmVxdWlyZWQiLCJ1cGRhdGVSZXF1ZXN0IiwiTVNfRVZFTlRTX0VNSVRURVIiLCJNU19BVVRIT1JJWkFUSU9OUyIsIk1TX0xPR1MiLCJNU19FVkVOVFNfRU1JVFRFUl9VUkwiLCJzZXRTaGFyZWRDb25maWciLCJqb2luIiwiX19kaXJuYW1lIiwicGxhbiIsInNldFRpbWVvdXQiLCJNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cCIsIm1ldGhvZCIsInVyaSIsIk1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cCIsImVycm9yIiwiYmluRGF0YSIsImRhdGFTdHJpbmciLCJ0b1N0cmluZyIsInBhcnNlIiwicmVwbGFjZSIsImVuZCIsInByb2Nlc3MiLCJleGl0IiwiTVNfVklFVyIsIk1TX1ZJRVdfVVJMIiwiaHR0cFByaXZhdGVBcGlQb3J0Iiwic3RvcCIsInN0YXJ0IiwiZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLENBQUNBLE9BQU9DLGNBQVosRUFBMkJDLFFBQVEsZ0JBQVI7QUFDM0I7QUFDQSxJQUFJQyxRQUFRRCxRQUFRLHdCQUFSLENBQVo7QUFDQSxJQUFJRSxRQUFRRixRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlHLE1BQU1ILFFBQVEsbUJBQVIsQ0FBVjtBQUNBRSxNQUFNRSxNQUFOLEdBQWUsSUFBZjtBQUNBLElBQUlDLFVBQVVMLFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBSU0sVUFBVU4sUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFJTyxJQUFJUCxRQUFRLEtBQVIsQ0FBUjtBQUNBLElBQUlRLE9BQU9SLFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSVMsTUFBTVQsUUFBUSxVQUFSLEVBQW9CUyxHQUFwQixDQUF3QixXQUF4QixFQUFxQyxNQUFyQyxFQUE2QyxPQUE3QyxDQUFWO0FBQ0EsSUFBSUMsUUFBUVYsUUFBUSxVQUFSLENBQVo7O0FBRUFPLEVBQUVJLElBQUYsQ0FBTyxzQkFBUCxFQUErQjtBQUMvQjtBQUQrQixDQUEvQixFQUVHLFNBQWVDLFFBQWYsQ0FBeUJMLENBQXpCO0FBQUEsMEZBV2NNLGNBWGQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdjQSx3QkFYZCxZQVdjQSxjQVhkLENBVzhCTixDQVg5QjtBQUFBLGdCQVdpQ08sS0FYakMsdUVBV3lDLEVBWHpDO0FBQUEsZ0JBVzZDQyxLQVg3Qyx1RUFXcUQsR0FYckQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWUtDLGlDQVpMLEdBWXFCaEIsUUFBUWlCLGFBQWFDLE1BQWIsQ0FBb0JDLGlCQUFwQixHQUF3QyxlQUFoRCxDQVpyQjtBQWFLQyxnQ0FiTCxHQWFvQixFQUFDQyxZQUFZSixhQUFhQyxNQUFiLENBQW9CQyxpQkFBakMsRUFBb0RHLGVBQWUsSUFBbkUsRUFicEI7O0FBY0NiLHdCQUFJYyxLQUFKLENBQVUsTUFBVixFQUFrQixlQUFsQixFQUFtQ1AsYUFBbkM7QUFDSVEsMkJBZkwseUJBZW1DUCxhQUFhUSxhQUFiLENBQTJCQyxpQkFmOUQ7O0FBZ0JDakIsd0JBQUljLEtBQUosQ0FBVSxNQUFWLEVBQWtCLFNBQWxCLEVBQTZCQyxPQUE3QjtBQUNJRyxnQ0FqQkwsR0FpQm9CMUIsTUFBTWUsY0FBY1ksY0FBZCxDQUE2QkMsYUFBbkMsRUFBa0RULFlBQWxELENBakJwQjtBQWtCS1UsOEJBbEJMLEdBa0JrQjdCLE1BQU1lLGNBQWNlLFlBQWQsQ0FBMkJGLGFBQWpDLEVBQWdEVCxZQUFoRCxDQWxCbEI7QUFtQktZLGdDQW5CTCxHQW1Cb0IvQixNQUFNZSxjQUFjaUIsY0FBZCxDQUE2QkosYUFBbkMsRUFBa0RULFlBQWxELENBbkJwQjtBQW9CS2MsZ0NBcEJMLEdBb0JvQmpDLE1BQU1lLGNBQWNtQixjQUFkLENBQTZCTixhQUFuQyxFQUFrRFQsWUFBbEQsQ0FwQnBCOzs7QUFzQkNYLHdCQUFJYyxLQUFKLENBQVUsMEJBQVYsRUFBc0NILFlBQXRDLEVBQW9ELEVBQUNPLDBCQUFELEVBQWVHLHNCQUFmLEVBQTJCRSwwQkFBM0IsRUFBeUNFLDBCQUF6QyxFQUFwRDtBQUNBekIsd0JBQUljLEtBQUosQ0FBVSxtQ0FBVixFQUErQ3BCLElBQUl3QixZQUFKLENBQS9DLEVBQWtFeEIsSUFBSTJCLFVBQUosQ0FBbEUsRUFBbUYzQixJQUFJNkIsWUFBSixDQUFuRixFQUFzRzdCLElBQUkrQixZQUFKLENBQXRHO0FBQ0lFLGtDQXhCTCxHQXdCc0IsRUF4QnRCO0FBeUJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNTQyxxQkFuQ1YsR0FtQ2MsQ0FuQ2Q7O0FBQUE7QUFBQSwwQkFtQ2lCQSxJQUFJdkIsS0FuQ3JCO0FBQUE7QUFBQTtBQUFBOztBQXVDT3dCLGlDQXZDUCxHQXVDdUJuQyxJQUFJd0IsWUFBSixDQXZDdkI7QUFvQ0c7QUFDQTs7QUFyQ0g7QUFBQSxvREF3Q1MsSUFBSVksT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNyQ2hDLDBCQUFJYyxLQUFKLENBQVUsb0JBQVYsRUFBZ0NtQixLQUFLQyxTQUFMLENBQWVMLGFBQWYsQ0FBaEM7QUFDQWpDLDhCQUFRdUMsUUFBUixDQUFpQnBCLFVBQVUsZ0JBQTNCLEVBQTZDYyxhQUE3QyxFQUE0RE8sRUFBNUQsQ0FBK0QsVUFBL0QsRUFBMkUsVUFBVUMsWUFBVixFQUF3QkMsUUFBeEIsRUFBa0M7QUFDM0d0Qyw0QkFBSWMsS0FBSixDQUFVLFNBQVYsRUFBcUJtQixLQUFLQyxTQUFMLENBQWVHLFlBQWYsQ0FBckI7QUFDQXZDLDBCQUFFeUMsSUFBRixDQUFPRixZQUFQLEVBQXFCLFFBQXJCLEVBQStCLG1DQUEvQjtBQUNBdkMsMEJBQUV5QyxJQUFGLENBQU9GLGFBQWFHLEVBQXBCLEVBQXdCLFFBQXhCLEVBQWtDLDBDQUEwQ0gsYUFBYUcsRUFBekY7QUFDQUMsMENBQWtCSixZQUFsQjtBQUNBTjtBQUNELHVCQU5EO0FBT0QscUJBVEssQ0F4Q1Q7O0FBQUE7QUFBQSwwQkFrRE96QixVQUFVLENBbERqQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUEsb0RBcURTLElBQUl3QixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3JDLDBCQUFJVSxPQUFPLEVBQUNGLElBQUlDLGdCQUFnQkQsRUFBckIsRUFBeUJHLFFBQVEsTUFBakMsRUFBeUNDLE9BQU8sTUFBaEQsRUFBWDtBQUNBNUMsMEJBQUljLEtBQUosQ0FBVSxNQUFWLEVBQWtCTyxVQUFsQixFQUE4QlksS0FBS0MsU0FBTCxDQUFlUSxJQUFmLENBQTlCO0FBQ0E5Qyw4QkFBUXVDLFFBQVIsQ0FBaUJwQixVQUFVLGNBQTNCLEVBQTJDMkIsSUFBM0MsRUFBaUROLEVBQWpELENBQW9ELFVBQXBELEVBQWdFLFVBQVVDLFlBQVYsRUFBd0JDLFFBQXhCLEVBQWtDO0FBQ2hHdEMsNEJBQUljLEtBQUosQ0FBVSxTQUFWLEVBQXFCbUIsS0FBS0MsU0FBTCxDQUFlRyxZQUFmLENBQXJCO0FBQ0F2QywwQkFBRXlDLElBQUYsQ0FBT0YsWUFBUCxFQUFxQixRQUFyQixFQUErQixpQ0FBL0I7QUFDQXZDLDBCQUFFK0MsSUFBRixDQUFPUixhQUFhUyxJQUFwQixFQUEwQmpCLGNBQWNhLElBQWQsQ0FBbUJJLElBQTdDLEVBQW1ELCtDQUErQ1QsYUFBYVUsR0FBL0c7QUFDQWhCO0FBQ0QsdUJBTEQ7QUFNRCxxQkFUSyxDQXJEVDs7QUFBQTtBQStERztBQUNBO0FBQ0FSLGlDQUFheUIsVUFBYixDQUF3Qk4sSUFBeEIsQ0FBNkJPLFFBQTdCLEdBQXdDLENBQUMsTUFBRCxDQUF4QztBQUNJQyxpQ0FsRVAsR0FrRXVCeEQsSUFBSTZCLFlBQUosQ0FsRXZCOztBQW1FRzJCLGtDQUFjVixFQUFkLEdBQW1CQyxnQkFBZ0JELEVBQW5DO0FBbkVIO0FBQUEsb0RBb0VTLElBQUlWLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDckNoQywwQkFBSWMsS0FBSixDQUFVLE1BQVYsRUFBa0JTLFlBQWxCLEVBQWdDVSxLQUFLQyxTQUFMLENBQWVnQixhQUFmLENBQWhDO0FBQ0F0RCw4QkFBUXVDLFFBQVIsQ0FBaUJwQixVQUFVLGdCQUEzQixFQUE2Q21DLGFBQTdDLEVBQTREZCxFQUE1RCxDQUErRCxVQUEvRCxFQUEyRSxVQUFVQyxZQUFWLEVBQXdCQyxRQUF4QixFQUFrQztBQUMzR3RDLDRCQUFJYyxLQUFKLENBQVUsU0FBVixFQUFxQm1CLEtBQUtDLFNBQUwsQ0FBZUcsWUFBZixDQUFyQjtBQUNBdkMsMEJBQUV5QyxJQUFGLENBQU9GLFlBQVAsRUFBcUIsUUFBckIsRUFBK0IsbUNBQS9CO0FBQ0F2QywwQkFBRStDLElBQUYsQ0FBT1IsYUFBYUcsRUFBcEIsRUFBd0JDLGdCQUFnQkQsRUFBeEMsRUFBNEMsK0NBQStDSCxhQUFhRyxFQUF4RztBQUNBVDtBQUNELHVCQUxEO0FBTUQscUJBUkssQ0FwRVQ7O0FBQUE7QUFBQTtBQUFBLG9EQStFUyxJQUFJRCxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3JDLDBCQUFJVSxPQUFPLEVBQUNGLElBQUlDLGdCQUFnQkQsRUFBckIsRUFBeUJHLFFBQVEsTUFBakMsRUFBeUNDLE9BQU8sTUFBaEQsRUFBWDtBQUNBNUMsMEJBQUljLEtBQUosQ0FBVSxNQUFWLEVBQWtCTyxVQUFsQixFQUE4QlksS0FBS0MsU0FBTCxDQUFlUSxJQUFmLENBQTlCO0FBQ0E5Qyw4QkFBUXVDLFFBQVIsQ0FBaUJwQixVQUFVLGNBQTNCLEVBQTJDMkIsSUFBM0MsRUFBaUROLEVBQWpELENBQW9ELFVBQXBELEVBQWdFLFVBQVVDLFlBQVYsRUFBd0JDLFFBQXhCLEVBQWtDO0FBQ2hHdEMsNEJBQUljLEtBQUosQ0FBVSxTQUFWLEVBQXFCbUIsS0FBS0MsU0FBTCxDQUFlRyxZQUFmLENBQXJCO0FBQ0F2QywwQkFBRXlDLElBQUYsQ0FBT0YsWUFBUCxFQUFxQixRQUFyQixFQUErQixpQ0FBL0I7QUFDQXZDLDBCQUFFK0MsSUFBRixDQUFPUixhQUFhUyxJQUFwQixFQUEwQkksY0FBY1IsSUFBZCxDQUFtQkksSUFBN0MsRUFBbUQsK0NBQStDVCxhQUFhVSxHQUEvRztBQUNBaEI7QUFDRCx1QkFMRDtBQU1ELHFCQVRLLENBL0VUOztBQUFBO0FBbUM0QkgsdUJBbkM1QjtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSwwQ0FDd0JyQyxRQUFRLDRCQUFSLEdBRHhCOztBQUFBO0FBQ0dpQixzQkFESDtBQUFBO0FBQUEsMENBRTZCakIsUUFBUSxnQ0FBUixHQUY3Qjs7QUFBQTtBQUVHNEQsMkJBRkg7QUFBQTtBQUFBLDBDQUc2QjVELFFBQVEsaUNBQVIsR0FIN0I7O0FBQUE7QUFHRzZELDJCQUhIO0FBQUE7QUFBQSwwQ0FJbUI3RCxRQUFRLHVCQUFSLEdBSm5COztBQUFBO0FBSUc4RCxpQkFKSDtBQUtHQywrQkFMSCx5QkFLK0NILGtCQUFrQm5DLGFBQWxCLENBQWdDQyxpQkFML0U7QUFBQTtBQUFBLDBDQU9LaEIsTUFBTXNELGVBQU4sQ0FBc0J4RCxLQUFLeUQsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLG9CQUFyQixDQUF0QixFQUFrRSxNQUFsRSxFQUEwRSxlQUExRSxFQUEyRixFQUEzRixDQVBMOztBQUFBOztBQVNEM0QsWUFBRTRELElBQUYsQ0FBTyxDQUFQOztBQXFGQTFELGNBQUljLEtBQUosQ0FBVSw4RkFBVjtBQTlGQztBQUFBLDBDQStGSyxJQUFJZ0IsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYTRCLFdBQVc1QixPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxXQUFaLENBL0ZMOztBQUFBOztBQWlHRC9CLGNBQUljLEtBQUosQ0FBVSxpSkFBVjtBQWpHQztBQUFBLDBDQXFHS2hCLEVBQUVJLElBQUYsQ0FBTyxRQUFQLEVBQWlCLGlCQUFnQkosQ0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0RBQ2YsSUFBSWdDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDckM0QixzREFBZ0MvRCxRQUM5QixFQUFFZ0UsUUFBUSxLQUFWO0FBQ0VDLDZCQUFLUix3QkFBd0I7QUFEL0IsdUJBRDhCLENBQWhDO0FBSUFNLG9EQUE4QnhCLEVBQTlCLENBQWlDLFVBQWpDLEVBQTZDLFVBQVVFLFFBQVYsRUFBb0I7QUFDL0R0Qyw0QkFBSWMsS0FBSixDQUFVLDhCQUFWLEVBQTBDd0IsUUFBMUM7QUFDQXlCLHlEQUFpQ3pCLFFBQWpDO0FBQ0FQO0FBQ0QsdUJBSkQsRUFLQ0ssRUFMRCxDQUtJLE9BTEosRUFLYSxVQUFVNEIsS0FBVixFQUFpQjtBQUM1QmhFLDRCQUFJYyxLQUFKLENBQVUsMkJBQVYsRUFBdUNrRCxLQUF2QztBQUNBaEM7QUFDRCx1QkFSRCxFQVNDSSxFQVRELENBU0ksTUFUSixFQVNZLFVBQVU2QixPQUFWLEVBQW1CO0FBQzdCLDRCQUFJQyxhQUFhRCxRQUFRRSxRQUFSLENBQWlCLE1BQWpCLENBQWpCO0FBQ0EsNEJBQUl6QixPQUFPVCxLQUFLbUMsS0FBTCxDQUFXRixXQUFXRyxPQUFYLENBQW1CLFFBQW5CLEVBQTZCLEVBQTdCLENBQVgsQ0FBWDtBQUNBckUsNEJBQUljLEtBQUosQ0FBVSwwQkFBVixFQUFzQzRCLElBQXRDLEVBQTRDa0IsNkJBQTVDO0FBQ0QsdUJBYkQ7QUFjRCxxQkFuQkssQ0FEZTs7QUFBQTs7QUFzQnJCOUQsc0JBQUV3RSxHQUFGOztBQXRCcUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBakIsQ0FyR0w7O0FBQUE7QUE2SER0RSxjQUFJYyxLQUFKLENBQVUsOEZBQVY7QUE3SEM7QUFBQSwwQ0E4SEssSUFBSWdCLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWE0QixXQUFXNUIsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQTlITDs7QUFBQTs7QUFnSUQvQixjQUFJYyxLQUFKLENBQVUsOEhBQVY7QUFoSUM7QUFBQSwwQ0FpSUtoQixFQUFFSSxJQUFGLENBQU8sNENBQVAsRUFBcUQsa0JBQWdCSixDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvREFDbkRNLGVBQWVOLENBQWYsRUFBa0IsQ0FBbEIsQ0FEbUQ7O0FBQUE7QUFFekRBLHNCQUFFd0UsR0FBRjs7QUFGeUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBckQsQ0FqSUw7O0FBQUE7QUFxSUQ7QUFDRkMsa0JBQVFDLElBQVI7QUFDRXhFLGNBQUljLEtBQUosQ0FBVSx5RkFBVjtBQXZJQztBQUFBLDBDQXdJSyxJQUFJZ0IsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYTRCLFdBQVc1QixPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxXQUFaLENBeElMOztBQUFBOztBQTBJRC9CLGNBQUljLEtBQUosQ0FBVSwrR0FBVjtBQTFJQztBQUFBLDBDQTJJbUJ2QixRQUFRLHVCQUFSLEdBM0luQjs7QUFBQTtBQTJJR2tGLGlCQTNJSDtBQTRJR0MscUJBNUlILHlCQTRJcUNELFFBQVF6RCxhQUFSLENBQXNCMkQsa0JBNUkzRDtBQUFBO0FBQUEsMENBNklLLElBQUk3QyxPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLG1CQUFhNEIsV0FBVzVCLE9BQVgsRUFBb0IsSUFBcEIsQ0FBYjtBQUFBLFdBQVosQ0E3SUw7O0FBQUE7O0FBK0lEL0IsY0FBSWMsS0FBSixDQUFVLDhLQUFWO0FBL0lDO0FBQUEsMENBZ0pLaEIsRUFBRUksSUFBRixDQUFPLFVBQVAsRUFBbUIsa0JBQWdCSixDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvREFDakIsSUFBSWdDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDckNoQywwQkFBSWMsS0FBSixDQUFVLG1CQUFWLEVBQStCNEQsY0FBYyxjQUE3QztBQUNBOUUsOEJBQVF1QyxRQUFSLENBQWlCdUMsY0FBYyxjQUEvQixFQUErQ3RDLEVBQS9DLENBQWtELFVBQWxELEVBQThELFVBQVVDLFlBQVYsRUFBd0JDLFFBQXhCLEVBQWtDO0FBQzlGdEMsNEJBQUljLEtBQUosQ0FBVSxzQkFBVixFQUFrQ3dCLFFBQWxDLEVBQTRDRCxZQUE1QztBQUNBTjtBQUNELHVCQUhEO0FBSUQscUJBTkssQ0FEaUI7O0FBQUE7QUFRdkJqQyxzQkFBRXdFLEdBQUY7O0FBUnVCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQW5CLENBaEpMOztBQUFBOztBQTJKRHRFLGNBQUljLEtBQUosQ0FBVSxzSUFBVjtBQTNKQztBQUFBLDBDQTRKSyxJQUFJZ0IsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYTRCLFdBQVc1QixPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxXQUFaLENBNUpMOztBQUFBO0FBQUE7QUFBQSwwQ0E2Sks5QixNQUFNc0QsZUFBTixDQUFzQnhELEtBQUt5RCxJQUFMLENBQVVDLFNBQVYsRUFBcUIsb0JBQXJCLENBQXRCLEVBQWtFLE1BQWxFLEVBQTBFLGVBQTFFLEVBQTJGO0FBQy9GLDRCQUFnQjtBQUNkLHdCQUFVLGNBREk7QUFFZCw4QkFBZ0I7QUFGRjtBQUQrRSxXQUEzRixDQTdKTDs7QUFBQTtBQUFBO0FBQUEsMENBbUtLLElBQUkzQixPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLG1CQUFhNEIsV0FBVzVCLE9BQVgsRUFBb0IsSUFBcEIsQ0FBYjtBQUFBLFdBQVosQ0FuS0w7O0FBQUE7O0FBcUtEL0IsY0FBSWMsS0FBSixDQUFVLDBKQUFWOztBQXJLQztBQUFBLDBDQXVLS2hCLEVBQUVJLElBQUYsQ0FBTyxVQUFQLEVBQW1CLGtCQUFnQkosQ0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0RBQ2pCTSxlQUFlTixDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBRGlCOztBQUFBO0FBRXZCQSxzQkFBRXdFLEdBQUY7O0FBRnVCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQW5CLENBdktMOztBQUFBO0FBQUE7QUFBQSwwQ0E0S0ssSUFBSXhDLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWE0QixXQUFXNUIsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQTVLTDs7QUFBQTtBQUFBO0FBQUEsMENBNktLOUIsTUFBTXNELGVBQU4sQ0FBc0J4RCxLQUFLeUQsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLG9CQUFyQixDQUF0QixFQUFrRSxNQUFsRSxFQUEwRSxlQUExRSxFQUEyRixFQUEzRixDQTdLTDs7QUFBQTtBQUFBO0FBQUEsMENBOEtLLElBQUkzQixPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLG1CQUFhNEIsV0FBVzVCLE9BQVgsRUFBb0IsSUFBcEIsQ0FBYjtBQUFBLFdBQVosQ0E5S0w7O0FBQUE7QUErS0QwQyxrQkFBUUcsSUFBUjs7QUFFQTVFLGNBQUljLEtBQUosQ0FBVSx5R0FBVjtBQWpMQztBQUFBLDBDQWtMSyxJQUFJZ0IsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYTRCLFdBQVc1QixPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxXQUFaLENBbExMOztBQUFBOztBQW9MRC9CLGNBQUljLEtBQUosQ0FBVSxnSUFBVjtBQXBMQztBQUFBLDBDQXFMS2hCLEVBQUVJLElBQUYsQ0FBTyxRQUFQLEVBQWlCLGtCQUFnQkosQ0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0RBQ2ZNLGVBQWVOLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FEZTs7QUFBQTtBQUVyQkEsc0JBQUV3RSxHQUFGOztBQUZxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFqQixDQXJMTDs7QUFBQTs7QUEwTER0RSxjQUFJYyxLQUFKLENBQVUsZ0hBQVY7QUExTEM7QUFBQSwwQ0EyTEsyRCxRQUFRSSxLQUFSLEVBM0xMOztBQUFBO0FBQUE7QUFBQSwwQ0E0TEssSUFBSS9DLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWE0QixXQUFXNUIsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQTVMTDs7QUFBQTs7QUE4TEQvQixjQUFJYyxLQUFKLENBQVUsK0dBQVY7QUE5TEM7QUFBQSwwQ0ErTEtoQixFQUFFSSxJQUFGLENBQU8sUUFBUCxFQUFpQixrQkFBZ0JKLENBQWhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG9EQUNmLElBQUlnQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3JDaEMsMEJBQUljLEtBQUosQ0FBVSxnQkFBVixFQUE0QjRELGNBQWMsV0FBMUM7QUFDQTlFLDhCQUFRdUMsUUFBUixDQUFpQnVDLGNBQWMsV0FBL0IsRUFBNEN0QyxFQUE1QyxDQUErQyxVQUEvQyxFQUEyRCxVQUFVQyxZQUFWLEVBQXdCQyxRQUF4QixFQUFrQztBQUMzRnRDLDRCQUFJYyxLQUFKLENBQVUsbUJBQVYsRUFBK0J3QixRQUEvQixFQUF5Q0QsWUFBekM7QUFDQU47QUFDRCx1QkFIRDtBQUlELHFCQU5LLENBRGU7O0FBQUE7O0FBU3JCakMsc0JBQUV3RSxHQUFGOztBQVRxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFqQixDQS9MTDs7QUFBQTtBQUFBO0FBQUEsMENBME1LLElBQUl4QyxPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLG1CQUFhNEIsV0FBVzVCLE9BQVgsRUFBb0IsSUFBcEIsQ0FBYjtBQUFBLFdBQVosQ0ExTUw7O0FBQUE7QUEyTUQwQyxrQkFBUUcsSUFBUjs7QUFFQXBFLHVCQUFhb0UsSUFBYjtBQUNBekIsNEJBQWtCeUIsSUFBbEI7QUFDQXhCLDRCQUFrQndCLElBQWxCO0FBQ0F2QixrQkFBUXVCLElBQVI7QUFDQUgsa0JBQVFHLElBQVI7QUFDQWIseUNBQStCZSxPQUEvQjtBQUNBaEYsWUFBRXdFLEdBQUY7QUFuTkM7QUFBQSwwQ0FvTkssSUFBSXhDLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWE0QixXQUFXNUIsT0FBWCxFQUFvQixNQUFwQixDQUFiO0FBQUEsV0FBWixDQXBOTDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUZIIiwiZmlsZSI6ImJhc2UudGVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmlmICghZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKXJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJylcbi8vIHZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIGRlcmVmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZGVyZWYtc3luYycpXG52YXIgZmFrZXIgPSByZXF1aXJlKCdmYWtlcicpXG52YXIganNmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZmFrZXInKVxuZmFrZXIubG9jYWxlID0gJ2l0J1xudmFyIHJlc3RsZXIgPSByZXF1aXJlKCdyZXN0bGVyJylcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpXG52YXIgdCA9IHJlcXVpcmUoJ3RhcCcpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIExPRyA9IHJlcXVpcmUoJy4uL2plc3VzJykuTE9HKCdCQVNFIFRFU1QnLCAnLS0tLScsICctLS0tLScpXG52YXIgamVzdXMgPSByZXF1aXJlKCcuLi9qZXN1cycpXG5cbnQudGVzdCgnKioqIFNFUlZJQ0VTIE5FVCAqKionLCB7XG4vLyAgYXV0b2VuZDogdHJ1ZVxufSwgYXN5bmMgZnVuY3Rpb24gbWFpblRlc3QgKHQpIHtcbiAgdmFyIE1TX1JFU09VUkNFUyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvcmVzb3VyY2VzL3N0YXJ0JykoKVxuICB2YXIgTVNfRVZFTlRTX0VNSVRURVIgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL2V2ZW50c0VtaXR0ZXIvc3RhcnQnKSgpXG4gIHZhciBNU19BVVRIT1JJWkFUSU9OUyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvYXV0aG9yaXphdGlvbnMvc3RhcnQnKSgpXG4gIHZhciBNU19MT0dTID0gYXdhaXQgcmVxdWlyZSgnLi9zZXJ2aWNlcy9sb2dzL3N0YXJ0JykoKVxuICB2YXIgTVNfRVZFTlRTX0VNSVRURVJfVVJMID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtNU19FVkVOVFNfRU1JVFRFUi5TSEFSRURfQ09ORklHLmh0dHBQdWJsaWNBcGlQb3J0fS9gXG5cbiAgYXdhaXQgamVzdXMuc2V0U2hhcmVkQ29uZmlnKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy8nKSwgJ3ZpZXcnLCAnZXZlbnRzLmxpc3RlbicsIHt9KVxuXG4gIHQucGxhbig2KVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHJlc291cmNlSW5zZXJ0ICh0LCBsb29wcyA9IDEwLCBzdGVwcyA9IDEwMCkge1xuICAgIHZhciBtZXRob2RzQ29uZmlnID0gcmVxdWlyZShNU19SRVNPVVJDRVMuQ09ORklHLnNoYXJlZFNlcnZpY2VQYXRoICsgJy9tZXRob2RzLmpzb24nKVxuICAgIHZhciBkZXJlZk9wdGlvbnMgPSB7YmFzZUZvbGRlcjogTVNfUkVTT1VSQ0VTLkNPTkZJRy5zaGFyZWRTZXJ2aWNlUGF0aCwgZmFpbE9uTWlzc2luZzogdHJ1ZX1cbiAgICBMT0cuZGVidWcoJ1RFU1QnLCAnbWV0aG9kc0NvbmZpZycsIG1ldGhvZHNDb25maWcpXG4gICAgdmFyIGJhc2VVcmwgPSBgaHR0cDovLzEyNy4wLjAuMToke01TX1JFU09VUkNFUy5TSEFSRURfQ09ORklHLmh0dHBQdWJsaWNBcGlQb3J0fS9gXG4gICAgTE9HLmRlYnVnKCdURVNUJywgJ2Jhc2VVcmwnLCBiYXNlVXJsKVxuICAgIHZhciBzY2hlbWFDcmVhdGUgPSBkZXJlZihtZXRob2RzQ29uZmlnLmNyZWF0ZVJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcbiAgICB2YXIgc2NoZW1hUmVhZCA9IGRlcmVmKG1ldGhvZHNDb25maWcucmVhZFJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcbiAgICB2YXIgc2NoZW1hVXBkYXRlID0gZGVyZWYobWV0aG9kc0NvbmZpZy51cGRhdGVSZXNvdXJjZS5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG4gICAgdmFyIHNjaGVtYURlbGV0ZSA9IGRlcmVmKG1ldGhvZHNDb25maWcuZGVsZXRlUmVzb3VyY2UucmVxdWVzdFNjaGVtYSwgZGVyZWZPcHRpb25zKVxuXG4gICAgTE9HLmRlYnVnKCdqc29uIHNjaGVtYSBmYWtlciBzY2hlbWEnLCBkZXJlZk9wdGlvbnMsIHtzY2hlbWFDcmVhdGUsIHNjaGVtYVJlYWQsIHNjaGVtYVVwZGF0ZSwgc2NoZW1hRGVsZXRlfSlcbiAgICBMT0cuZGVidWcoJ2pzb24gc2NoZW1hIGZha2VyIHNjaGVtYSBleGFtcGxlcycsIGpzZihzY2hlbWFDcmVhdGUpLCBqc2Yoc2NoZW1hUmVhZCksIGpzZihzY2hlbWFVcGRhdGUpLCBqc2Yoc2NoZW1hRGVsZXRlKSwpXG4gICAgdmFyIHRlc3REYXRhVG9TZW5kID0gW11cbiAgICAvLyBhd2FpdCB0LnRlc3QoJ05PIENPTVBSRVNTSU9OJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICAvLyAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ2NyZWF0ZVJlc291cmNlJykub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICBMT0cuZGVidWcoJ3JlYnVpbGRWaWV3cyByZWNlaXZlJywgcmVzcG9uc2UsIGRhdGFSZXNwb25zZSlcbiAgICAvLyAgICAgICByZXNvbHZlKClcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgIH0pXG4gICAgLy9cbiAgICAvLyAgIHQuZW5kKClcbiAgICAvLyB9KVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9vcHM7IGkrKykge1xuICAgICAgLy8gTE9HLmdyb3VwKGBURVNUIFJJR0hUIERBVEEgJHtpfWApXG4gICAgICAvLyBMT0cuZ3JvdXAoYGNyZWF0ZVJlc291cmNlYClcbiAgICAgIHZhciBjcmVhdGVkUmVzcG9uc2VcbiAgICAgIHZhciBjcmVhdGVSZXF1ZXN0ID0ganNmKHNjaGVtYUNyZWF0ZSlcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgTE9HLmRlYnVnKCdzZW5kIGNyZWF0ZVJlcXVlc3QnLCBKU09OLnN0cmluZ2lmeShjcmVhdGVSZXF1ZXN0KSlcbiAgICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ2NyZWF0ZVJlc291cmNlJywgY3JlYXRlUmVxdWVzdCkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBMT0cuZGVidWcoJ3JlY2VpdmUnLCBKU09OLnN0cmluZ2lmeShkYXRhUmVzcG9uc2UpKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgY3JlYXRlUmVzb3VyY2UgaXMgb2JqZWN0JylcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLmlkLCAnc3RyaW5nJywgJ1Jlc3BvbnNlIGNyZWF0ZVJlc291cmNlIGlkIGlzIHN0cmluZyAnICsgZGF0YVJlc3BvbnNlLmlkKVxuICAgICAgICAgIGNyZWF0ZWRSZXNwb25zZSA9IGRhdGFSZXNwb25zZVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGlmIChzdGVwcyA9PT0gMSkgY29udGludWVcbiAgICAgIC8vIExPRy5ncm91cEVuZCgpXG4gICAgICAvLyBMT0cuZ3JvdXAoYHJlYWRSZXNvdXJjZSBGcm9tIGlkYClcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdmFyIGRhdGEgPSB7aWQ6IGNyZWF0ZWRSZXNwb25zZS5pZCwgdXNlcklkOiAndGVzdCcsIHRva2VuOiAndGVzdCd9XG4gICAgICAgIExPRy5kZWJ1Zygnc2VuZCcsIHNjaGVtYVJlYWQsIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAncmVhZFJlc291cmNlJywgZGF0YSkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBMT0cuZGVidWcoJ3JlY2VpdmUnLCBKU09OLnN0cmluZ2lmeShkYXRhUmVzcG9uc2UpKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgcmVhZFJlc291cmNlIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC5zYW1lKGRhdGFSZXNwb25zZS5ib2R5LCBjcmVhdGVSZXF1ZXN0LmRhdGEuYm9keSwgJ1Jlc3BvbnNlIHJlYWRSZXNvdXJjZSAgYm9keSBhcyBzZW5kZWQsIGlkOicgKyBkYXRhUmVzcG9uc2UuX2lkKVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC8vIExPRy5ncm91cEVuZCgpXG4gICAgICAvLyBMT0cuZ3JvdXAoYHVwZGF0ZVJlc291cmNlYClcbiAgICAgIHNjaGVtYVVwZGF0ZS5wcm9wZXJ0aWVzLmRhdGEucmVxdWlyZWQgPSBbJ2JvZHknXVxuICAgICAgdmFyIHVwZGF0ZVJlcXVlc3QgPSBqc2Yoc2NoZW1hVXBkYXRlKVxuICAgICAgdXBkYXRlUmVxdWVzdC5pZCA9IGNyZWF0ZWRSZXNwb25zZS5pZFxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBMT0cuZGVidWcoJ3NlbmQnLCBzY2hlbWFVcGRhdGUsIEpTT04uc3RyaW5naWZ5KHVwZGF0ZVJlcXVlc3QpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAndXBkYXRlUmVzb3VyY2UnLCB1cGRhdGVSZXF1ZXN0KS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICAgIExPRy5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSB1cGRhdGVSZXNvdXJjZSBpcyBvYmplY3QnKVxuICAgICAgICAgIHQuc2FtZShkYXRhUmVzcG9uc2UuaWQsIGNyZWF0ZWRSZXNwb25zZS5pZCwgJ1Jlc3BvbnNlIHVwZGF0ZVJlc291cmNlICBpZCBhcyBzZW5kZWQsIGlkOicgKyBkYXRhUmVzcG9uc2UuaWQpXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLy8gTE9HLmdyb3VwRW5kKClcbiAgICAgIC8vIExPRy5ncm91cChgcmVhZFJlc291cmNlIEZyb20gZGF0YS9faWRgKVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB2YXIgZGF0YSA9IHtpZDogY3JlYXRlZFJlc3BvbnNlLmlkLCB1c2VySWQ6ICd0ZXN0JywgdG9rZW46ICd0ZXN0J31cbiAgICAgICAgTE9HLmRlYnVnKCdzZW5kJywgc2NoZW1hUmVhZCwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gICAgICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICdyZWFkUmVzb3VyY2UnLCBkYXRhKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICAgIExPRy5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSByZWFkUmVzb3VyY2UgaXMgb2JqZWN0JylcbiAgICAgICAgICB0LnNhbWUoZGF0YVJlc3BvbnNlLmJvZHksIHVwZGF0ZVJlcXVlc3QuZGF0YS5ib2R5LCAnUmVzcG9uc2UgcmVhZFJlc291cmNlIGJvZHkgYXMgdXBkYXRlZCwgaWQ6JyArIGRhdGFSZXNwb25zZS5faWQpXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLy8gTE9HLmdyb3VwRW5kKClcbiAgICAgIC8vIExPRy5ncm91cEVuZCgpXG4gICAgfVxuICB9XG5cbiAgTE9HLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKVxuXG4gIExPRy5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVEVTVCAwIC0gRVZFTlRTX0VNSVRURVIgY2hpYW1hdGEgYWxsbyBzdHJlYW1pbmcgZGVnbGkgZXZlbnRpICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICB2YXIgTVNfRVZFTlRTX0VNSVRURVJfcmVxdWVzdEh0dHBcbiAgdmFyIE1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cFxuXG4gIGF3YWl0IHQudGVzdCgnVEVTVCAwJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cCA9IHJlcXVlc3QoXG4gICAgICAgIHsgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmk6IE1TX0VWRU5UU19FTUlUVEVSX1VSTCArICdsaXN0ZW5FdmVudHMnXG4gICAgICAgIH0pXG4gICAgICBNU19FVkVOVFNfRU1JVFRFUl9yZXF1ZXN0SHR0cC5vbigncmVzcG9uc2UnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgTE9HLmRlYnVnKCdURVNUIEhUVFAgU1RSRUFNSU5HIFJFU1BPTlNFJywgcmVzcG9uc2UpXG4gICAgICAgIE1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cCA9IHJlc3BvbnNlXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICAgIC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgTE9HLmRlYnVnKCdURVNUIEhUVFAgU1RSRUFNSU5HIEVSUk9SJywgZXJyb3IpXG4gICAgICAgIHJlamVjdCgpXG4gICAgICB9KVxuICAgICAgLm9uKCdkYXRhJywgZnVuY3Rpb24gKGJpbkRhdGEpIHtcbiAgICAgICAgdmFyIGRhdGFTdHJpbmcgPSBiaW5EYXRhLnRvU3RyaW5nKCd1dGY4JylcbiAgICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKGRhdGFTdHJpbmcucmVwbGFjZSgnZGF0YTogJywgJycpKVxuICAgICAgICBMT0cuZGVidWcoJ1RFU1QgSFRUUCBTVFJFQU1JTkcgREFUQScsIGRhdGEsIE1TX0VWRU5UU19FTUlUVEVSX3JlcXVlc3RIdHRwKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdC5lbmQoKVxuICB9KVxuICBMT0cuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG5cbiAgTE9HLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDEgLSBJbnNlcmltZW50byBEYXRpIChNU19WSUVXIHNwZW50byktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDEgLSBJbnNlcmltZW50byBEYXRpIChNU19WSUVXIHNwZW50byknLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IHJlc291cmNlSW5zZXJ0KHQsIDEpXG4gICAgdC5lbmQoKVxuICB9KVxuICAvL1xucHJvY2Vzcy5leGl0KClcbiAgTE9HLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVE9QIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBMT0cuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtIGFjY2VuZG8gTVNfVklFVy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICB2YXIgTVNfVklFVyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvdmlldy9zdGFydCcpKClcbiAgdmFyIE1TX1ZJRVdfVVJMID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtNU19WSUVXLlNIQVJFRF9DT05GSUcuaHR0cFByaXZhdGVBcGlQb3J0fS9gXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuXG4gIExPRy5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVEVTVCAyLjEgLSBNU19WSUVXIHJlYnVpbGRWaWV3cyAoTVNfVklFVyBkb3ZyZWJiZSByZWN1cGVyYXJlaSBkYXRpIGluc2VyaXRpIGluIHByZWNlZGVuemEpLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IHQudGVzdCgnVEVTVCAyLjEnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIExPRy5kZWJ1Zygnc2VuZCByZWJ1aWxkVmlld3MnLCBNU19WSUVXX1VSTCArICdyZWJ1aWxkVmlld3MnKVxuICAgICAgcmVzdGxlci5wb3N0SnNvbihNU19WSUVXX1VSTCArICdyZWJ1aWxkVmlld3MnKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICBMT0cuZGVidWcoJ3JlYnVpbGRWaWV3cyByZWNlaXZlJywgcmVzcG9uc2UsIGRhdGFSZXNwb25zZSlcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgIH0pXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIExPRy5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUFJFUEFSSU5HIC0gYWdnaXVuZ28gZXZlbnRvIHZpZXdzVXBkYXRlZCBhIE1TX1ZJRVctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIGF3YWl0IGplc3VzLnNldFNoYXJlZENvbmZpZyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvc2VydmljZXMvJyksICd2aWV3JywgJ2V2ZW50cy5saXN0ZW4nLCB7XG4gICAgJ3ZpZXdzVXBkYXRlZCc6IHtcbiAgICAgICdtZXRob2QnOiAndmlld3NVcGRhdGVkJyxcbiAgICAgICdoYXZlUmVzcG9uc2UnOiBmYWxzZVxuICAgIH1cbiAgfSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG5cbiAgTE9HLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDIuMiAtIEluc2VyaW1lbnRvIERhdGkgKE1TX1ZJRVcgYWNjZXNvLGRvdnJlYmJlIGFnZ2lvcm5hcnNpIGxpdmUpLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG5cbiAgYXdhaXQgdC50ZXN0KCdURVNUIDIuMicsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgcmVzb3VyY2VJbnNlcnQodCwgNSwgMSlcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpXG4gIGF3YWl0IGplc3VzLnNldFNoYXJlZENvbmZpZyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvc2VydmljZXMvJyksICd2aWV3JywgJ2V2ZW50cy5saXN0ZW4nLCB7fSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIE1TX1ZJRVcuc3RvcCgpXG5cbiAgTE9HLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVE9QIC0gTVNfVklFVyBzdG9wcGVkLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpXG5cbiAgTE9HLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDMgLSBJbnNlcmltZW50byBEYXRpIChNU19WSUVXIHN0b3BwZWQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgMycsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgcmVzb3VyY2VJbnNlcnQodCwgNSwgMSlcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgTE9HLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLSBNU19WSUVXIHN0YXJ0aW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IE1TX1ZJRVcuc3RhcnQoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBMT0cuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgNCAtIE1TX1ZJRVcgc3luY1ZpZXdzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgNCcsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgTE9HLmRlYnVnKCdzZW5kIHN5bmNWaWV3cycsIE1TX1ZJRVdfVVJMICsgJ3N5bmNWaWV3cycpXG4gICAgICByZXN0bGVyLnBvc3RKc29uKE1TX1ZJRVdfVVJMICsgJ3N5bmNWaWV3cycpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgIExPRy5kZWJ1Zygnc3luY1ZpZXdzIHJlY2VpdmUnLCByZXNwb25zZSwgZGF0YVJlc3BvbnNlKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHQuZW5kKClcbiAgfSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIE1TX1ZJRVcuc3RvcCgpXG5cbiAgTVNfUkVTT1VSQ0VTLnN0b3AoKVxuICBNU19FVkVOVFNfRU1JVFRFUi5zdG9wKClcbiAgTVNfQVVUSE9SSVpBVElPTlMuc3RvcCgpXG4gIE1TX0xPR1Muc3RvcCgpXG4gIE1TX1ZJRVcuc3RvcCgpXG4gIE1TX0VWRU5UU19FTUlUVEVSX3Jlc3BvbnNlSHR0cC5kZXN0cm95KClcbiAgdC5lbmQoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwMDApKVxufSlcbiJdfQ==