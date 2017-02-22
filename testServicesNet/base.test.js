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

t.test('*** SERVICES NET ***', {
  autoend: true
}, function mainTest(t) {
  var MS_RESOURCES, MS_EVENTS_EMITTER, MS_AUTHORIZATIONS, MS_LOGS, MS_EVENTS_EMITTER_URL, resourceInsert, MS_VIEW, MS_VIEW_URL;
  return regeneratorRuntime.async(function mainTest$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
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

                    console.debug('TEST', 'methodsConfig', methodsConfig);
                    baseUrl = 'http://127.0.0.1:' + MS_RESOURCES.SHARED_CONFIG.httpPublicApiPort + '/';

                    console.debug('TEST', 'baseUrl', baseUrl);
                    schemaCreate = deref(methodsConfig.createResource.requestSchema, derefOptions);
                    schemaRead = deref(methodsConfig.readResource.requestSchema, derefOptions);
                    schemaUpdate = deref(methodsConfig.updateResource.requestSchema, derefOptions);
                    schemaDelete = deref(methodsConfig.deleteResource.requestSchema, derefOptions);


                    console.debug('json schema faker schema', derefOptions, { schemaCreate: schemaCreate, schemaRead: schemaRead, schemaUpdate: schemaUpdate, schemaDelete: schemaDelete });
                    console.debug('json schema faker schema examples', jsf(schemaCreate), jsf(schemaRead), jsf(schemaUpdate), jsf(schemaDelete));
                    testDataToSend = [];
                    // await t.test('NO COMPRESSION', async function (t) {
                    //   await new Promise((resolve, reject) => {
                    //     restler.postJson(baseUrl + 'createResource').on('complete', function (dataResponse, response) {
                    //       console.debug('rebuildViews receive', response, dataResponse)
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
                    // console.group(`TEST RIGHT DATA ${i}`)
                    // console.group(`createResource`)

                    _context.next = 17;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      console.debug('send createRequest', JSON.stringify(createRequest));
                      restler.postJson(baseUrl + 'createResource', createRequest).on('complete', function (dataResponse, response) {
                        console.debug('receive', JSON.stringify(dataResponse));
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
                      var data = { id: createdResponse.id };
                      console.debug('send', schemaRead, JSON.stringify(data));
                      restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
                        console.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response readResource is object');
                        t.same(dataResponse.body, createRequest.data.body, 'Response readResource  body as sended, id:' + dataResponse._id);
                        resolve();
                      });
                    }));

                  case 21:
                    // console.groupEnd()
                    // console.group(`updateResource`)
                    schemaUpdate.properties.data.required = ['body'];
                    updateRequest = jsf(schemaUpdate);

                    updateRequest.id = createdResponse.id;
                    _context.next = 26;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      console.debug('send', schemaUpdate, JSON.stringify(updateRequest));
                      restler.postJson(baseUrl + 'updateResource', updateRequest).on('complete', function (dataResponse, response) {
                        console.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response updateResource is object');
                        t.same(dataResponse.id, createdResponse.id, 'Response updateResource  id as sended, id:' + dataResponse.id);
                        resolve();
                      });
                    }));

                  case 26:
                    _context.next = 28;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var data = { data: { _id: createdResponse.id } };
                      console.debug('send', schemaRead, JSON.stringify(data));
                      restler.postJson(baseUrl + 'readResource', data).on('complete', function (dataResponse, response) {
                        console.debug('receive', JSON.stringify(dataResponse));
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

          _context7.next = 3;
          return regeneratorRuntime.awrap(require('./services/resources/start')());

        case 3:
          MS_RESOURCES = _context7.sent;
          _context7.next = 6;
          return regeneratorRuntime.awrap(require('./services/eventsEmitter/start')());

        case 6:
          MS_EVENTS_EMITTER = _context7.sent;
          _context7.next = 9;
          return regeneratorRuntime.awrap(require('./services/authorizations/start')());

        case 9:
          MS_AUTHORIZATIONS = _context7.sent;
          _context7.next = 12;
          return regeneratorRuntime.awrap(require('./services/logs/start')());

        case 12:
          MS_LOGS = _context7.sent;
          MS_EVENTS_EMITTER_URL = 'http://127.0.0.1:' + MS_EVENTS_EMITTER.SHARED_CONFIG.httpPublicApiPort + '/';


          t.plan(5);

          console.debug('-------------------------------------- TEST 0 -------------------------------------------');
          _context7.next = 18;
          return regeneratorRuntime.awrap(t.test('TEST 0', function _callee(t) {
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      request.get(MS_EVENTS_EMITTER_URL + 'listenEvents').on('response', function (response) {
                        console.debug('response received');
                        resolve();
                      }).on('error', function (error) {
                        console.log('error', error);
                        reject();
                      }).on('data', function (binData) {
                        var dataString = binData.toString('utf8');
                        var data = JSON.parse(dataString.replace('data: ', ''));
                        console.debug('TEST HTTP STREAMING DATA', data);
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

        case 18:

          console.debug('-------------------------------------- PREPARING -------------------------------------------');
          _context7.next = 21;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 2000);
          }));

        case 21:

          console.debug('-------------------------------------- TEST 1 -------------------------------------------');
          _context7.next = 24;
          return regeneratorRuntime.awrap(t.test('TEST 1', function _callee2(t) {
            return regeneratorRuntime.async(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(resourceInsert(t, 5));

                  case 2:
                    t.end();

                  case 3:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, null, this);
          }));

        case 24:

          console.debug('-------------------------------------- STOP -------------------------------------------');
          _context7.next = 27;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 7000);
          }));

        case 27:

          console.debug('-------------------------------------- PREPARING -------------------------------------------');
          _context7.next = 30;
          return regeneratorRuntime.awrap(require('./services/view/start')());

        case 30:
          MS_VIEW = _context7.sent;
          MS_VIEW_URL = 'http://127.0.0.1:' + MS_VIEW.SHARED_CONFIG.httpPrivateApiPort + '/';
          _context7.next = 34;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 34:

          console.debug('-------------------------------------- TEST 2 -------------------------------------------');
          _context7.next = 37;
          return regeneratorRuntime.awrap(t.test('TEST 2', function _callee3(t) {
            return regeneratorRuntime.async(function _callee3$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      console.debug('send rebuildViews', MS_VIEW_URL + 'rebuildViews');
                      restler.postJson(MS_VIEW_URL + 'rebuildViews').on('complete', function (dataResponse, response) {
                        console.debug('rebuildViews receive', response, dataResponse);
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

        case 37:
          MS_VIEW.stop();

          console.debug('-------------------------------------- STOP -------------------------------------------');
          _context7.next = 41;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 10000);
          }));

        case 41:

          console.debug('-------------------------------------- TEST 3 -------------------------------------------');
          _context7.next = 44;
          return regeneratorRuntime.awrap(t.test('TEST 3', function _callee4(t) {
            return regeneratorRuntime.async(function _callee4$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return regeneratorRuntime.awrap(resourceInsert(t, 5));

                  case 2:
                    t.end();

                  case 3:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, null, this);
          }));

        case 44:

          console.debug('-------------------------------------- PREPARING -------------------------------------------');
          _context7.next = 47;
          return regeneratorRuntime.awrap(MS_VIEW.start());

        case 47:

          console.debug('-------------------------------------- TEST 4 -------------------------------------------');
          _context7.next = 50;
          return regeneratorRuntime.awrap(t.test('TEST 4', function _callee5(t) {
            return regeneratorRuntime.async(function _callee5$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      console.debug('send syncViews', MS_VIEW_URL + 'syncViews');
                      restler.postJson(MS_VIEW_URL + 'syncViews').on('complete', function (dataResponse, response) {
                        console.debug('syncViews receive', response, dataResponse);
                        resolve();
                      });
                    }));

                  case 2:
                    MS_VIEW.stop();
                    t.end();

                  case 4:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, null, this);
          }));

        case 50:
        case 'end':
          return _context7.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiZGVyZWYiLCJmYWtlciIsImpzZiIsImxvY2FsZSIsInJlc3RsZXIiLCJyZXF1ZXN0IiwidCIsInBhdGgiLCJ0ZXN0IiwiYXV0b2VuZCIsIm1haW5UZXN0IiwicmVzb3VyY2VJbnNlcnQiLCJsb29wcyIsInN0ZXBzIiwibWV0aG9kc0NvbmZpZyIsIk1TX1JFU09VUkNFUyIsIkNPTkZJRyIsInNoYXJlZFNlcnZpY2VQYXRoIiwiZGVyZWZPcHRpb25zIiwiYmFzZUZvbGRlciIsImZhaWxPbk1pc3NpbmciLCJjb25zb2xlIiwiZGVidWciLCJiYXNlVXJsIiwiU0hBUkVEX0NPTkZJRyIsImh0dHBQdWJsaWNBcGlQb3J0Iiwic2NoZW1hQ3JlYXRlIiwiY3JlYXRlUmVzb3VyY2UiLCJyZXF1ZXN0U2NoZW1hIiwic2NoZW1hUmVhZCIsInJlYWRSZXNvdXJjZSIsInNjaGVtYVVwZGF0ZSIsInVwZGF0ZVJlc291cmNlIiwic2NoZW1hRGVsZXRlIiwiZGVsZXRlUmVzb3VyY2UiLCJ0ZXN0RGF0YVRvU2VuZCIsImkiLCJjcmVhdGVSZXF1ZXN0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJKU09OIiwic3RyaW5naWZ5IiwicG9zdEpzb24iLCJvbiIsImRhdGFSZXNwb25zZSIsInJlc3BvbnNlIiwidHlwZSIsImlkIiwiY3JlYXRlZFJlc3BvbnNlIiwiZGF0YSIsInNhbWUiLCJib2R5IiwiX2lkIiwicHJvcGVydGllcyIsInJlcXVpcmVkIiwidXBkYXRlUmVxdWVzdCIsIk1TX0VWRU5UU19FTUlUVEVSIiwiTVNfQVVUSE9SSVpBVElPTlMiLCJNU19MT0dTIiwiTVNfRVZFTlRTX0VNSVRURVJfVVJMIiwicGxhbiIsImdldCIsImVycm9yIiwibG9nIiwiYmluRGF0YSIsImRhdGFTdHJpbmciLCJ0b1N0cmluZyIsInBhcnNlIiwicmVwbGFjZSIsImVuZCIsInNldFRpbWVvdXQiLCJNU19WSUVXIiwiTVNfVklFV19VUkwiLCJodHRwUHJpdmF0ZUFwaVBvcnQiLCJzdG9wIiwic3RhcnQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxDQUFDQSxPQUFPQyxjQUFaLEVBQTJCQyxRQUFRLGdCQUFSO0FBQzNCO0FBQ0EsSUFBSUMsUUFBUUQsUUFBUSx3QkFBUixDQUFaO0FBQ0EsSUFBSUUsUUFBUUYsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJRyxNQUFNSCxRQUFRLG1CQUFSLENBQVY7QUFDQUUsTUFBTUUsTUFBTixHQUFlLElBQWY7QUFDQSxJQUFJQyxVQUFVTCxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlNLFVBQVVOLFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBSU8sSUFBSVAsUUFBUSxLQUFSLENBQVI7QUFDQSxJQUFJUSxPQUFPUixRQUFRLE1BQVIsQ0FBWDs7QUFFQU8sRUFBRUUsSUFBRixDQUFPLHNCQUFQLEVBQStCO0FBQzdCQyxXQUFTO0FBRG9CLENBQS9CLEVBRUcsU0FBZUMsUUFBZixDQUF5QkosQ0FBekI7QUFBQSwwRkFVY0ssY0FWZDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVWNBLHdCQVZkLFlBVWNBLGNBVmQsQ0FVOEJMLENBVjlCO0FBQUEsZ0JBVWlDTSxLQVZqQyx1RUFVeUMsRUFWekM7QUFBQSxnQkFVNkNDLEtBVjdDLHVFQVVxRCxHQVZyRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXS0MsaUNBWEwsR0FXcUJmLFFBQVFnQixhQUFhQyxNQUFiLENBQW9CQyxpQkFBcEIsR0FBd0MsZUFBaEQsQ0FYckI7QUFZS0MsZ0NBWkwsR0FZb0IsRUFBQ0MsWUFBWUosYUFBYUMsTUFBYixDQUFvQkMsaUJBQWpDLEVBQW9ERyxlQUFlLElBQW5FLEVBWnBCOztBQWFDQyw0QkFBUUMsS0FBUixDQUFjLE1BQWQsRUFBc0IsZUFBdEIsRUFBdUNSLGFBQXZDO0FBQ0lTLDJCQWRMLHlCQWNtQ1IsYUFBYVMsYUFBYixDQUEyQkMsaUJBZDlEOztBQWVDSiw0QkFB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QXdCQyxRQUF4QixFQUFrQztBQUMzRnpCLGdDQUFRQyxLQUFSLENBQWMsbUJBQWQsRUFBbUN3QixRQUFuQyxFQUE2Q0QsWUFBN0M7QUFDQU47QUFDRCx1QkFIRDtBQUlELHFCQU5LLENBRGU7O0FBQUE7QUFRckJpQyw0QkFBUUcsSUFBUjtBQUNBckUsc0JBQUVnRSxHQUFGOztBQVRxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFqQixDQTlKTDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUZIIiwiZmlsZSI6ImJhc2UudGVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJpZiAoIWdsb2JhbC5fYmFiZWxQb2x5ZmlsbClyZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpXG4vLyB2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBkZXJlZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWRlcmVmLXN5bmMnKVxudmFyIGZha2VyID0gcmVxdWlyZSgnZmFrZXInKVxudmFyIGpzZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWZha2VyJylcbmZha2VyLmxvY2FsZSA9ICdpdCdcbnZhciByZXN0bGVyID0gcmVxdWlyZSgncmVzdGxlcicpXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxudC50ZXN0KCcqKiogU0VSVklDRVMgTkVUICoqKicsIHtcbiAgYXV0b2VuZDogdHJ1ZVxufSwgYXN5bmMgZnVuY3Rpb24gbWFpblRlc3QgKHQpIHtcbiAgdmFyIE1TX1JFU09VUkNFUyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvcmVzb3VyY2VzL3N0YXJ0JykoKVxuICB2YXIgTVNfRVZFTlRTX0VNSVRURVIgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL2V2ZW50c0VtaXR0ZXIvc3RhcnQnKSgpXG4gIHZhciBNU19BVVRIT1JJWkFUSU9OUyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvYXV0aG9yaXphdGlvbnMvc3RhcnQnKSgpXG4gIHZhciBNU19MT0dTID0gYXdhaXQgcmVxdWlyZSgnLi9zZXJ2aWNlcy9sb2dzL3N0YXJ0JykoKVxuXG4gIHZhciBNU19FVkVOVFNfRU1JVFRFUl9VUkwgPSBgaHR0cDovLzEyNy4wLjAuMToke01TX0VWRU5UU19FTUlUVEVSLlNIQVJFRF9DT05GSUcuaHR0cFB1YmxpY0FwaVBvcnR9L2BcblxuICB0LnBsYW4oNSlcblxuICBhc3luYyBmdW5jdGlvbiByZXNvdXJjZUluc2VydCAodCwgbG9vcHMgPSAxMCwgc3RlcHMgPSAxMDApIHtcbiAgICB2YXIgbWV0aG9kc0NvbmZpZyA9IHJlcXVpcmUoTVNfUkVTT1VSQ0VTLkNPTkZJRy5zaGFyZWRTZXJ2aWNlUGF0aCArICcvbWV0aG9kcy5qc29uJylcbiAgICB2YXIgZGVyZWZPcHRpb25zID0ge2Jhc2VGb2xkZXI6IE1TX1JFU09VUkNFUy5DT05GSUcuc2hhcmVkU2VydmljZVBhdGgsIGZhaWxPbk1pc3Npbmc6IHRydWV9XG4gICAgY29uc29sZS5kZWJ1ZygnVEVTVCcsICdtZXRob2RzQ29uZmlnJywgbWV0aG9kc0NvbmZpZylcbiAgICB2YXIgYmFzZVVybCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7TVNfUkVTT1VSQ0VTLlNIQVJFRF9DT05GSUcuaHR0cFB1YmxpY0FwaVBvcnR9L2BcbiAgICBjb25zb2xlLmRlYnVnKCdURVNUJywgJ2Jhc2VVcmwnLCBiYXNlVXJsKVxuICAgIHZhciBzY2hlbWFDcmVhdGUgPSBkZXJlZihtZXRob2RzQ29uZmlnLmNyZWF0ZVJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcbiAgICB2YXIgc2NoZW1hUmVhZCA9IGRlcmVmKG1ldGhvZHNDb25maWcucmVhZFJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcbiAgICB2YXIgc2NoZW1hVXBkYXRlID0gZGVyZWYobWV0aG9kc0NvbmZpZy51cGRhdGVSZXNvdXJjZS5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG4gICAgdmFyIHNjaGVtYURlbGV0ZSA9IGRlcmVmKG1ldGhvZHNDb25maWcuZGVsZXRlUmVzb3VyY2UucmVxdWVzdFNjaGVtYSwgZGVyZWZPcHRpb25zKVxuXG4gICAgY29uc29sZS5kZWJ1ZygnanNvbiBzY2hlbWEgZmFrZXIgc2NoZW1hJywgZGVyZWZPcHRpb25zLCB7c2NoZW1hQ3JlYXRlLCBzY2hlbWFSZWFkLCBzY2hlbWFVcGRhdGUsIHNjaGVtYURlbGV0ZX0pXG4gICAgY29uc29sZS5kZWJ1ZygnanNvbiBzY2hlbWEgZmFrZXIgc2NoZW1hIGV4YW1wbGVzJywganNmKHNjaGVtYUNyZWF0ZSksIGpzZihzY2hlbWFSZWFkKSwganNmKHNjaGVtYVVwZGF0ZSksIGpzZihzY2hlbWFEZWxldGUpLClcbiAgICB2YXIgdGVzdERhdGFUb1NlbmQgPSBbXVxuICAgIC8vIGF3YWl0IHQudGVzdCgnTk8gQ09NUFJFU1NJT04nLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIC8vICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIC8vICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAnY3JlYXRlUmVzb3VyY2UnKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgIC8vICAgICAgIGNvbnNvbGUuZGVidWcoJ3JlYnVpbGRWaWV3cyByZWNlaXZlJywgcmVzcG9uc2UsIGRhdGFSZXNwb25zZSlcbiAgICAvLyAgICAgICByZXNvbHZlKClcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgIH0pXG4gICAgLy9cbiAgICAvLyAgIHQuZW5kKClcbiAgICAvLyB9KVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9vcHM7IGkrKykge1xuICAgICAgLy8gY29uc29sZS5ncm91cChgVEVTVCBSSUdIVCBEQVRBICR7aX1gKVxuICAgICAgLy8gY29uc29sZS5ncm91cChgY3JlYXRlUmVzb3VyY2VgKVxuICAgICAgdmFyIGNyZWF0ZWRSZXNwb25zZVxuICAgICAgdmFyIGNyZWF0ZVJlcXVlc3QgPSBqc2Yoc2NoZW1hQ3JlYXRlKVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdzZW5kIGNyZWF0ZVJlcXVlc3QnLCBKU09OLnN0cmluZ2lmeShjcmVhdGVSZXF1ZXN0KSlcbiAgICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ2NyZWF0ZVJlc291cmNlJywgY3JlYXRlUmVxdWVzdCkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIGNyZWF0ZVJlc291cmNlIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZS5pZCwgJ3N0cmluZycsICdSZXNwb25zZSBjcmVhdGVSZXNvdXJjZSBpZCBpcyBzdHJpbmcgJyArIGRhdGFSZXNwb25zZS5pZClcbiAgICAgICAgICBjcmVhdGVkUmVzcG9uc2UgPSBkYXRhUmVzcG9uc2VcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBpZiAoc3RlcHMgPT09IDEpIGNvbnRpbnVlXG4gICAgICAvLyBjb25zb2xlLmdyb3VwRW5kKClcbiAgICAgIC8vIGNvbnNvbGUuZ3JvdXAoYHJlYWRSZXNvdXJjZSBGcm9tIGlkYClcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdmFyIGRhdGEgPSB7aWQ6IGNyZWF0ZWRSZXNwb25zZS5pZH1cbiAgICAgICAgY29uc29sZS5kZWJ1Zygnc2VuZCcsIHNjaGVtYVJlYWQsIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAncmVhZFJlc291cmNlJywgZGF0YSkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHJlYWRSZXNvdXJjZSBpcyBvYmplY3QnKVxuICAgICAgICAgIHQuc2FtZShkYXRhUmVzcG9uc2UuYm9keSwgY3JlYXRlUmVxdWVzdC5kYXRhLmJvZHksICdSZXNwb25zZSByZWFkUmVzb3VyY2UgIGJvZHkgYXMgc2VuZGVkLCBpZDonICsgZGF0YVJlc3BvbnNlLl9pZClcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICAvLyBjb25zb2xlLmdyb3VwRW5kKClcbiAgICAgIC8vIGNvbnNvbGUuZ3JvdXAoYHVwZGF0ZVJlc291cmNlYClcbiAgICAgIHNjaGVtYVVwZGF0ZS5wcm9wZXJ0aWVzLmRhdGEucmVxdWlyZWQgPSBbJ2JvZHknXVxuICAgICAgdmFyIHVwZGF0ZVJlcXVlc3QgPSBqc2Yoc2NoZW1hVXBkYXRlKVxuICAgICAgdXBkYXRlUmVxdWVzdC5pZCA9IGNyZWF0ZWRSZXNwb25zZS5pZFxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdzZW5kJywgc2NoZW1hVXBkYXRlLCBKU09OLnN0cmluZ2lmeSh1cGRhdGVSZXF1ZXN0KSlcbiAgICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ3VwZGF0ZVJlc291cmNlJywgdXBkYXRlUmVxdWVzdCkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHVwZGF0ZVJlc291cmNlIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC5zYW1lKGRhdGFSZXNwb25zZS5pZCwgY3JlYXRlZFJlc3BvbnNlLmlkLCAnUmVzcG9uc2UgdXBkYXRlUmVzb3VyY2UgIGlkIGFzIHNlbmRlZCwgaWQ6JyArIGRhdGFSZXNwb25zZS5pZClcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICAvLyBjb25zb2xlLmdyb3VwRW5kKClcbiAgICAgIC8vIGNvbnNvbGUuZ3JvdXAoYHJlYWRSZXNvdXJjZSBGcm9tIGRhdGEvX2lkYClcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdmFyIGRhdGEgPSB7ZGF0YToge19pZDogY3JlYXRlZFJlc3BvbnNlLmlkfX1cbiAgICAgICAgY29uc29sZS5kZWJ1Zygnc2VuZCcsIHNjaGVtYVJlYWQsIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAncmVhZFJlc291cmNlJywgZGF0YSkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHJlYWRSZXNvdXJjZSBpcyBvYmplY3QnKVxuICAgICAgICAgIHQuc2FtZShkYXRhUmVzcG9uc2UuYm9keSwgdXBkYXRlUmVxdWVzdC5kYXRhLmJvZHksICdSZXNwb25zZSByZWFkUmVzb3VyY2UgYm9keSBhcyB1cGRhdGVkLCBpZDonICsgZGF0YVJlc3BvbnNlLl9pZClcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICAvLyBjb25zb2xlLmdyb3VwRW5kKClcbiAgICAgIC8vIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgIH1cbiAgfVxuXG4gIGNvbnNvbGUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDAnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlcXVlc3QuZ2V0KE1TX0VWRU5UU19FTUlUVEVSX1VSTCArICdsaXN0ZW5FdmVudHMnKVxuICAgICAgLm9uKCdyZXNwb25zZScsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdyZXNwb25zZSByZWNlaXZlZCcpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICAgIC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJywgZXJyb3IpXG4gICAgICAgIHJlamVjdCgpXG4gICAgICB9KVxuICAgICAgLm9uKCdkYXRhJywgZnVuY3Rpb24gKGJpbkRhdGEpIHtcbiAgICAgICAgdmFyIGRhdGFTdHJpbmcgPSBiaW5EYXRhLnRvU3RyaW5nKCd1dGY4JylcbiAgICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKGRhdGFTdHJpbmcucmVwbGFjZSgnZGF0YTogJywgJycpKVxuICAgICAgICBjb25zb2xlLmRlYnVnKCdURVNUIEhUVFAgU1RSRUFNSU5HIERBVEEnLCBkYXRhKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBjb25zb2xlLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUkVQQVJJTkcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKVxuXG4gIGNvbnNvbGUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDEnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IHJlc291cmNlSW5zZXJ0KHQsIDUpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIGNvbnNvbGUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFNUT1AgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDcwMDApKVxuXG4gIGNvbnNvbGUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgdmFyIE1TX1ZJRVcgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL3ZpZXcvc3RhcnQnKSgpXG4gIHZhciBNU19WSUVXX1VSTCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7TVNfVklFVy5TSEFSRURfQ09ORklHLmh0dHBQcml2YXRlQXBpUG9ydH0vYFxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcblxuICBjb25zb2xlLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGF3YWl0IHQudGVzdCgnVEVTVCAyJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zb2xlLmRlYnVnKCdzZW5kIHJlYnVpbGRWaWV3cycsIE1TX1ZJRVdfVVJMICsgJ3JlYnVpbGRWaWV3cycpXG4gICAgICByZXN0bGVyLnBvc3RKc29uKE1TX1ZJRVdfVVJMICsgJ3JlYnVpbGRWaWV3cycpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3JlYnVpbGRWaWV3cyByZWNlaXZlJywgcmVzcG9uc2UsIGRhdGFSZXNwb25zZSlcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0LmVuZCgpXG4gIH0pXG4gIE1TX1ZJRVcuc3RvcCgpXG5cbiAgY29uc29sZS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gU1RPUCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMDApKVxuXG4gIGNvbnNvbGUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRFU1QgMyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgdC50ZXN0KCdURVNUIDMnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIGF3YWl0IHJlc291cmNlSW5zZXJ0KHQsIDUpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIGNvbnNvbGUuZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSRVBBUklORyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgTVNfVklFVy5zdGFydCgpXG5cbiAgY29uc29sZS5kZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVEVTVCA0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBhd2FpdCB0LnRlc3QoJ1RFU1QgNCcsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc29sZS5kZWJ1Zygnc2VuZCBzeW5jVmlld3MnLCBNU19WSUVXX1VSTCArICdzeW5jVmlld3MnKVxuICAgICAgcmVzdGxlci5wb3N0SnNvbihNU19WSUVXX1VSTCArICdzeW5jVmlld3MnKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdzeW5jVmlld3MgcmVjZWl2ZScsIHJlc3BvbnNlLCBkYXRhUmVzcG9uc2UpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuICAgIE1TX1ZJRVcuc3RvcCgpXG4gICAgdC5lbmQoKVxuICB9KVxuICAvLyBNU19SRVNPVVJDRVMuc3RvcCgpXG4gIC8vIE1TX0FVVEhPUklaQVRJT05TLnN0b3AoKVxuICAvLyBNU19MT0dTLnN0b3AoKVxuICAvLyBNU19WSUVXLnN0b3AoKVxufSlcbiJdfQ==