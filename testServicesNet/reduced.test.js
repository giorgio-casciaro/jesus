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
  var MS_RESOURCES, resourceInsert;
  return regeneratorRuntime.async(function mainTest$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
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
                      var data = { id: createdResponse.id, userid: 'test', token: 'test' };
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
                      var data = { id: createdResponse.id, userid: 'test', token: 'test' };
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

          _context3.next = 3;
          return regeneratorRuntime.awrap(require('./services/resources/start')());

        case 3:
          MS_RESOURCES = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(jesus.setSharedConfig(path.join(__dirname, './shared/services/'), 'view', 'events.listen', {}));

        case 6:

          t.plan(1);

          CONSOLE.debug('-------------------------------------- TEST 1 - Inserimento Dati (MS_VIEW spento)-------------------------------------------');
          _context3.next = 10;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(t.test('TEST 1 - Inserimento Dati (MS_VIEW spento)', function _callee(t) {
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(resourceInsert(t, 1));

                  case 2:
                    t.end();

                  case 3:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, this);
          }));

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 100000);
          }));

        case 14:

          MS_RESOURCES.stop();
          t.end();

        case 16:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZHVjZWQudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiZGVyZWYiLCJmYWtlciIsImpzZiIsImxvY2FsZSIsInJlc3RsZXIiLCJyZXF1ZXN0IiwidCIsInBhdGgiLCJDT05TT0xFIiwiZ2V0Q29uc29sZSIsImplc3VzIiwidGVzdCIsIm1haW5UZXN0IiwicmVzb3VyY2VJbnNlcnQiLCJsb29wcyIsInN0ZXBzIiwibWV0aG9kc0NvbmZpZyIsImpvaW4iLCJfX2Rpcm5hbWUiLCJkZXJlZk9wdGlvbnMiLCJiYXNlRm9sZGVyIiwiZmFpbE9uTWlzc2luZyIsImRlYnVnIiwiYmFzZVVybCIsIk1TX1JFU09VUkNFUyIsIlNIQVJFRF9DT05GSUciLCJodHRwUHVibGljQXBpUG9ydCIsInNjaGVtYUNyZWF0ZSIsImNyZWF0ZVJlc291cmNlIiwicmVxdWVzdFNjaGVtYSIsInNjaGVtYVJlYWQiLCJyZWFkUmVzb3VyY2UiLCJzY2hlbWFVcGRhdGUiLCJ1cGRhdGVSZXNvdXJjZSIsInNjaGVtYURlbGV0ZSIsImRlbGV0ZVJlc291cmNlIiwidGVzdERhdGFUb1NlbmQiLCJpIiwiY3JlYXRlUmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiSlNPTiIsInN0cmluZ2lmeSIsInBvc3RKc29uIiwib24iLCJkYXRhUmVzcG9uc2UiLCJyZXNwb25zZSIsInR5cGUiLCJpZCIsImNyZWF0ZWRSZXNwb25zZSIsImRhdGEiLCJ1c2VySWQiLCJ0b2tlbiIsInNhbWUiLCJib2R5IiwiX2lkIiwicHJvcGVydGllcyIsInJlcXVpcmVkIiwidXBkYXRlUmVxdWVzdCIsInNldFNoYXJlZENvbmZpZyIsInBsYW4iLCJzZXRUaW1lb3V0IiwiZW5kIiwic3RvcCJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLENBQUNBLE9BQU9DLGNBQVosRUFBMkJDLFFBQVEsZ0JBQVI7QUFDM0I7QUFDQSxJQUFJQyxRQUFRRCxRQUFR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QyxFQUFFSyxJQUFGLENBQU8sNENBQVAsRUFBcUQsaUJBQWdCTCxDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvREFDbkRPLGVBQWVQLENBQWYsRUFBa0IsQ0FBbEIsQ0FEbUQ7O0FBQUE7QUFFekRBLHNCQUFFeUQsR0FBRjs7QUFGeUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBckQsQ0EzRkw7O0FBQUE7QUFBQTtBQUFBLDBDQWdHSyxJQUFJeEIsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYXNCLFdBQVd0QixPQUFYLEVBQW9CLE1BQXBCLENBQWI7QUFBQSxXQUFaLENBaEdMOztBQUFBOztBQW1HRGhCLHVCQUFhd0MsSUFBYjtBQUNBMUQsWUFBRXlELEdBQUY7O0FBcEdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgiLCJmaWxlIjoicmVkdWNlZC50ZXN0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaWYgKCFnbG9iYWwuX2JhYmVsUG9seWZpbGwpcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKVxuLy8gdmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgZGVyZWYgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1kZXJlZi1zeW5jJylcbnZhciBmYWtlciA9IHJlcXVpcmUoJ2Zha2VyJylcbnZhciBqc2YgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1mYWtlcicpXG5mYWtlci5sb2NhbGUgPSAnaXQnXG52YXIgcmVzdGxlciA9IHJlcXVpcmUoJ3Jlc3RsZXInKVxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0JylcbnZhciB0ID0gcmVxdWlyZSgndGFwJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgQ09OU09MRSA9IHJlcXVpcmUoJy4uL2plc3VzJykuZ2V0Q29uc29sZShmYWxzZSwnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxudmFyIGplc3VzID0gcmVxdWlyZSgnLi4vamVzdXMnKVxuXG50LnRlc3QoJyoqKiBTRVJWSUNFUyBORVQgKioqJywge1xuLy8gIGF1dG9lbmQ6IHRydWVcbn0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIHZhciBNU19SRVNPVVJDRVMgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL3Jlc291cmNlcy9zdGFydCcpKClcblxuICBhd2FpdCBqZXN1cy5zZXRTaGFyZWRDb25maWcocGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc2hhcmVkL3NlcnZpY2VzLycpLCAndmlldycsICdldmVudHMubGlzdGVuJywge30pXG5cbiAgdC5wbGFuKDEpXG5cbiAgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VJbnNlcnQgKHQsIGxvb3BzID0gMTAsIHN0ZXBzID0gMTAwKSB7XG4gICAgdmFyIG1ldGhvZHNDb25maWcgPSByZXF1aXJlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9zZXJ2aWNlcy9yZXNvdXJjZXMvbWV0aG9kcy5qc29uJykpXG4gICAgdmFyIGRlcmVmT3B0aW9ucyA9IHtiYXNlRm9sZGVyOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvc2VydmljZXMvcmVzb3VyY2VzLycpLCBmYWlsT25NaXNzaW5nOiB0cnVlfVxuICAgIENPTlNPTEUuZGVidWcoJ1RFU1QnLCAnbWV0aG9kc0NvbmZpZycsIG1ldGhvZHNDb25maWcpXG4gICAgdmFyIGJhc2VVcmwgPSBgaHR0cDovLzEyNy4wLjAuMToke01TX1JFU09VUkNFUy5TSEFSRURfQ09ORklHLmh0dHBQdWJsaWNBcGlQb3J0fS9gXG4gICAgQ09OU09MRS5kZWJ1ZygnVEVTVCcsICdiYXNlVXJsJywgYmFzZVVybClcbiAgICB2YXIgc2NoZW1hQ3JlYXRlID0gZGVyZWYobWV0aG9kc0NvbmZpZy5jcmVhdGVSZXNvdXJjZS5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG4gICAgdmFyIHNjaGVtYVJlYWQgPSBkZXJlZihtZXRob2RzQ29uZmlnLnJlYWRSZXNvdXJjZS5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG4gICAgdmFyIHNjaGVtYVVwZGF0ZSA9IGRlcmVmKG1ldGhvZHNDb25maWcudXBkYXRlUmVzb3VyY2UucmVxdWVzdFNjaGVtYSwgZGVyZWZPcHRpb25zKVxuICAgIHZhciBzY2hlbWFEZWxldGUgPSBkZXJlZihtZXRob2RzQ29uZmlnLmRlbGV0ZVJlc291cmNlLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcblxuICAgIENPTlNPTEUuZGVidWcoJ2pzb24gc2NoZW1hIGZha2VyIHNjaGVtYScsIGRlcmVmT3B0aW9ucywge3NjaGVtYUNyZWF0ZSwgc2NoZW1hUmVhZCwgc2NoZW1hVXBkYXRlLCBzY2hlbWFEZWxldGV9KVxuICAgIENPTlNPTEUuZGVidWcoJ2pzb24gc2NoZW1hIGZha2VyIHNjaGVtYSBleGFtcGxlcycsIGpzZihzY2hlbWFDcmVhdGUpLCBqc2Yoc2NoZW1hUmVhZCksIGpzZihzY2hlbWFVcGRhdGUpLCBqc2Yoc2NoZW1hRGVsZXRlKSwpXG4gICAgdmFyIHRlc3REYXRhVG9TZW5kID0gW11cbiAgICAvLyBhd2FpdCB0LnRlc3QoJ05PIENPTVBSRVNTSU9OJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICAvLyAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ2NyZWF0ZVJlc291cmNlJykub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICBDT05TT0xFLmRlYnVnKCdyZWJ1aWxkVmlld3MgcmVjZWl2ZScsIHJlc3BvbnNlLCBkYXRhUmVzcG9uc2UpXG4gICAgLy8gICAgICAgcmVzb2x2ZSgpXG4gICAgLy8gICAgIH0pXG4gICAgLy8gICB9KVxuICAgIC8vXG4gICAgLy8gICB0LmVuZCgpXG4gICAgLy8gfSlcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvb3BzOyBpKyspIHtcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXAoYFRFU1QgUklHSFQgREFUQSAke2l9YClcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXAoYGNyZWF0ZVJlc291cmNlYClcbiAgICAgIHZhciBjcmVhdGVkUmVzcG9uc2VcbiAgICAgIHZhciBjcmVhdGVSZXF1ZXN0ID0ganNmKHNjaGVtYUNyZWF0ZSlcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCBjcmVhdGVSZXF1ZXN0JywgSlNPTi5zdHJpbmdpZnkoY3JlYXRlUmVxdWVzdCkpXG4gICAgICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICdjcmVhdGVSZXNvdXJjZScsIGNyZWF0ZVJlcXVlc3QpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSBjcmVhdGVSZXNvdXJjZSBpcyBvYmplY3QnKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UuaWQsICdzdHJpbmcnLCAnUmVzcG9uc2UgY3JlYXRlUmVzb3VyY2UgaWQgaXMgc3RyaW5nICcgKyBkYXRhUmVzcG9uc2UuaWQpXG4gICAgICAgICAgY3JlYXRlZFJlc3BvbnNlID0gZGF0YVJlc3BvbnNlXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgaWYgKHN0ZXBzID09PSAxKSBjb250aW51ZVxuICAgICAgLy8gQ09OU09MRS5ncm91cEVuZCgpXG4gICAgICAvLyBDT05TT0xFLmdyb3VwKGByZWFkUmVzb3VyY2UgRnJvbSBpZGApXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHZhciBkYXRhID0ge2lkOiBjcmVhdGVkUmVzcG9uc2UuaWQsIHVzZXJJZDogJ3Rlc3QnLCB0b2tlbjogJ3Rlc3QnfVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdzZW5kJywgc2NoZW1hUmVhZCwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gICAgICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICdyZWFkUmVzb3VyY2UnLCBkYXRhKS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ3JlY2VpdmUnLCBKU09OLnN0cmluZ2lmeShkYXRhUmVzcG9uc2UpKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgcmVhZFJlc291cmNlIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC5zYW1lKGRhdGFSZXNwb25zZS5ib2R5LCBjcmVhdGVSZXF1ZXN0LmRhdGEuYm9keSwgJ1Jlc3BvbnNlIHJlYWRSZXNvdXJjZSAgYm9keSBhcyBzZW5kZWQsIGlkOicgKyBkYXRhUmVzcG9uc2UuX2lkKVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXBFbmQoKVxuICAgICAgLy8gQ09OU09MRS5ncm91cChgdXBkYXRlUmVzb3VyY2VgKVxuICAgICAgc2NoZW1hVXBkYXRlLnByb3BlcnRpZXMuZGF0YS5yZXF1aXJlZCA9IFsnYm9keSddXG4gICAgICB2YXIgdXBkYXRlUmVxdWVzdCA9IGpzZihzY2hlbWFVcGRhdGUpXG4gICAgICB1cGRhdGVSZXF1ZXN0LmlkID0gY3JlYXRlZFJlc3BvbnNlLmlkXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQnLCBzY2hlbWFVcGRhdGUsIEpTT04uc3RyaW5naWZ5KHVwZGF0ZVJlcXVlc3QpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAndXBkYXRlUmVzb3VyY2UnLCB1cGRhdGVSZXF1ZXN0KS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ3JlY2VpdmUnLCBKU09OLnN0cmluZ2lmeShkYXRhUmVzcG9uc2UpKVxuICAgICAgICAgIHQudHlwZShkYXRhUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgdXBkYXRlUmVzb3VyY2UgaXMgb2JqZWN0JylcbiAgICAgICAgICB0LnNhbWUoZGF0YVJlc3BvbnNlLmlkLCBjcmVhdGVkUmVzcG9uc2UuaWQsICdSZXNwb25zZSB1cGRhdGVSZXNvdXJjZSAgaWQgYXMgc2VuZGVkLCBpZDonICsgZGF0YVJlc3BvbnNlLmlkKVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXBFbmQoKVxuICAgICAgLy8gQ09OU09MRS5ncm91cChgcmVhZFJlc291cmNlIEZyb20gZGF0YS9faWRgKVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB2YXIgZGF0YSA9IHtpZDogY3JlYXRlZFJlc3BvbnNlLmlkLCB1c2VySWQ6ICd0ZXN0JywgdG9rZW46ICd0ZXN0J31cbiAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZCcsIHNjaGVtYVJlYWQsIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAncmVhZFJlc291cmNlJywgZGF0YSkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHJlYWRSZXNvdXJjZSBpcyBvYmplY3QnKVxuICAgICAgICAgIHQuc2FtZShkYXRhUmVzcG9uc2UuYm9keSwgdXBkYXRlUmVxdWVzdC5kYXRhLmJvZHksICdSZXNwb25zZSByZWFkUmVzb3VyY2UgYm9keSBhcyB1cGRhdGVkLCBpZDonICsgZGF0YVJlc3BvbnNlLl9pZClcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICAvLyBDT05TT0xFLmdyb3VwRW5kKClcbiAgICAgIC8vIENPTlNPTEUuZ3JvdXBFbmQoKVxuICAgIH1cbiAgfVxuICBDT05TT0xFLmRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURVNUIDEgLSBJbnNlcmltZW50byBEYXRpIChNU19WSUVXIHNwZW50byktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpXG4gIGF3YWl0IHQudGVzdCgnVEVTVCAxIC0gSW5zZXJpbWVudG8gRGF0aSAoTVNfVklFVyBzcGVudG8pJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICBhd2FpdCByZXNvdXJjZUluc2VydCh0LCAxKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwMDApKVxuXG5cbiAgTVNfUkVTT1VSQ0VTLnN0b3AoKVxuICB0LmVuZCgpXG59KVxuIl19