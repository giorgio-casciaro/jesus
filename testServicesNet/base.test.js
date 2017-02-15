'use strict';

if (!global._babelPolyfill) require('babel-polyfill');
// var R = require('ramda')
var deref = require('json-schema-deref-sync');
var faker = require('faker');
var jsf = require('json-schema-faker');
faker.locale = 'it';
var request = require('restler');
var t = require('tap');
var path = require('path');

t.test('*** SERVICES NET ***', {
  autoend: true
}, function mainTest(t) {
  var MS_USERS;
  return regeneratorRuntime.async(function mainTest$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(require('./users/start')());

        case 2:
          MS_USERS = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(t.test('NO COMPRESSION', function _callee(t) {
            var apiConfig, derefOptions, schemaCreate, schemaRead, schemaUpdate, schemaDelete, testDataToSend, i, createdResponse, createRequest, updateRequest;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    apiConfig = require('./shared/services/users/api.json');
                    derefOptions = { baseFolder: path.join(__dirname + '/shared/services/users/'), failOnMissing: true };
                    schemaCreate = deref(apiConfig.createUser.requestSchema, derefOptions);
                    schemaRead = deref(apiConfig.readUser.requestSchema, derefOptions);
                    schemaUpdate = deref(apiConfig.updateUser.requestSchema, derefOptions);
                    schemaDelete = deref(apiConfig.deleteUser.requestSchema, derefOptions);


                    console.debug('json schema faker schema', derefOptions, { schemaCreate: schemaCreate, schemaRead: schemaRead, schemaUpdate: schemaUpdate, schemaDelete: schemaDelete });
                    console.debug('json schema faker schema examples', jsf(schemaCreate), jsf(schemaRead), jsf(schemaUpdate), jsf(schemaDelete));
                    testDataToSend = [];
                    i = 0;

                  case 10:
                    if (!(i < 5)) {
                      _context.next = 36;
                      break;
                    }

                    console.group('TEST RIGHT DATA ' + i);
                    console.group('createUser');
                    createRequest = jsf(schemaCreate);
                    _context.next = 16;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      console.debug('send createRequest', JSON.stringify(createRequest));
                      request.postJson('http://127.0.0.1:1080/createUser', createRequest).on('complete', function (dataResponse, response) {
                        console.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response createUser is object');
                        t.type(dataResponse.id, 'string', 'Response createUser id is string ' + dataResponse.id);
                        createdResponse = dataResponse;
                        resolve();
                      });
                    }));

                  case 16:
                    console.groupEnd();
                    console.group('readUser From id');
                    _context.next = 20;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var data = { id: createdResponse.id };
                      console.debug('send', schemaRead, JSON.stringify(data));
                      request.postJson('http://127.0.0.1:1080/readUser', data).on('complete', function (dataResponse, response) {
                        console.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response readUser is object');
                        t.same(dataResponse.username, createRequest.data.username, 'Response readUser  username as sended, id:' + dataResponse._id);
                        resolve();
                      });
                    }));

                  case 20:
                    console.groupEnd();
                    console.group('updateUser');
                    schemaUpdate.allOf[2] = { 'properties': { 'data': { required: ['username'] } } };
                    updateRequest = jsf(schemaUpdate);

                    updateRequest.id = createdResponse.id;
                    _context.next = 27;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      console.debug('send', schemaUpdate, JSON.stringify(updateRequest));
                      request.postJson('http://127.0.0.1:1080/updateUser', updateRequest).on('complete', function (dataResponse, response) {
                        console.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response updateUser is object');
                        t.same(dataResponse.id, createdResponse.id, 'Response updateUser  id as sended, id:' + dataResponse.id);
                        resolve();
                      });
                    }));

                  case 27:
                    console.groupEnd();
                    console.group('readUser From data/_id');
                    _context.next = 31;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var data = { data: { _id: createdResponse.id } };
                      console.debug('send', schemaRead, JSON.stringify(data));
                      request.postJson('http://127.0.0.1:1080/readUser', data).on('complete', function (dataResponse, response) {
                        console.debug('receive', JSON.stringify(dataResponse));
                        t.type(dataResponse, 'object', 'Response readUser is object');
                        t.same(dataResponse.username, updateRequest.data.username, 'Response readUser username as updated, id:' + dataResponse._id);
                        resolve();
                      });
                    }));

                  case 31:
                    console.groupEnd();
                    console.groupEnd();

                  case 33:
                    i++;
                    _context.next = 10;
                    break;

                  case 36:
                    // schema.properties.data.properties.username.pattern = '[a]' // MODIFY FOR WRONG REQUESTS
                    // for (let i = 0; i < 1; i++) {
                    //   await new Promise((resolve, reject) => {
                    //     var data = jsf(schemaCreate)
                    //     console.debug('send', JSON.stringify(data))
                    //     request.postJson('http://127.0.0.1:1080/createUser', data).on('complete', function (dataResponse, response) {
                    //       console.debug('receive', JSON.stringify(dataResponse))
                    //       t.type(dataResponse, 'object', 'Response wrong createUser is object')
                    //       t.type(dataResponse.error, 'string', 'Response wrong createUser return error ' + dataResponse.error)
                    //       resolve()
                    //     })
                    //   })
                    // }
                    t.end();

                  case 37:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this);
          }));

        case 5:

          MS_USERS.stop();

        case 6:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiZGVyZWYiLCJmYWtlciIsImpzZiIsImxvY2FsZSIsInJlcXVlc3QiLCJ0IiwicGF0aCIsInRlc3QiLCJhdXRvZW5kIiwibWFpblRlc3QiLCJNU19VU0VSUyIsImFwaUNvbmZpZyIsImRlcmVmT3B0aW9ucyIsImJhc2VGb2xkZXIiLCJqb2luIiwiX19kaXJuYW1lIiwiZmFpbE9uTWlzc2luZyIsInNjaGVtYUNyZWF0ZSIsImNyZWF0ZVVzZXIiLCJyZXF1ZXN0U2NoZW1hIiwic2NoZW1hUmVhZCIsInJlYWRVc2VyIiwic2NoZW1hVXBkYXRlIiwidXBkYXRlVXNlciIsInNjaGVtYURlbGV0ZSIsImRlbGV0ZVVzZXIiLCJjb25zb2xlIiwiZGVidWciLCJ0ZXN0RGF0YVRvU2VuZCIsImkiLCJncm91cCIsImNyZWF0ZVJlcXVlc3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJwb3N0SnNvbiIsIm9uIiwiZGF0YVJlc3BvbnNlIiwicmVzcG9uc2UiLCJ0eXBlIiwiaWQiLCJjcmVhdGVkUmVzcG9uc2UiLCJncm91cEVuZCIsImRhdGEiLCJzYW1lIiwidXNlcm5hbWUiLCJfaWQiLCJhbGxPZiIsInJlcXVpcmVkIiwidXBkYXRlUmVxdWVzdCIsImVuZCIsInN0b3AiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxDQUFDQSxPQUFPQyxjQUFaLEVBQTJCQyxRQUFRLGdCQUFSO0FBQzNCO0FBQ0EsSUFBSUMsUUFBUUQsUUFBUSx3QkFBUixDQUFaO0FBQ0EsSUFBSUUsUUFBUUYsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJRyxNQUFNSCxRQUFRLG1CQUFSLENBQVY7QUFDQUUsTUFBTUUsTUFBTixHQUFlLElBQWY7QUFDQSxJQUFJQyxVQUFVTCxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlNLElBQUlOLFFBQVEsS0FBUixD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QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBeEIsc0JBQUUrQyxHQUFGOztBQWpGNkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBekIsQ0FITDs7QUFBQTs7QUF1RkQxQyxtQkFBUzJDLElBQVQ7O0FBdkZDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgiLCJmaWxlIjoiYmFzZS50ZXN0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbImlmICghZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKXJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJylcbi8vIHZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIGRlcmVmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZGVyZWYtc3luYycpXG52YXIgZmFrZXIgPSByZXF1aXJlKCdmYWtlcicpXG52YXIganNmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZmFrZXInKVxuZmFrZXIubG9jYWxlID0gJ2l0J1xudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXN0bGVyJylcbnZhciB0ID0gcmVxdWlyZSgndGFwJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbnQudGVzdCgnKioqIFNFUlZJQ0VTIE5FVCAqKionLCB7XG4gIGF1dG9lbmQ6IHRydWVcbn0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIHZhciBNU19VU0VSUyA9IGF3YWl0IHJlcXVpcmUoJy4vdXNlcnMvc3RhcnQnKSgpXG5cbiAgYXdhaXQgdC50ZXN0KCdOTyBDT01QUkVTU0lPTicsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdmFyIGFwaUNvbmZpZyA9IHJlcXVpcmUoJy4vc2hhcmVkL3NlcnZpY2VzL3VzZXJzL2FwaS5qc29uJylcbiAgICB2YXIgZGVyZWZPcHRpb25zID0ge2Jhc2VGb2xkZXI6IHBhdGguam9pbihfX2Rpcm5hbWUgKyAnL3NoYXJlZC9zZXJ2aWNlcy91c2Vycy8nKSwgZmFpbE9uTWlzc2luZzogdHJ1ZX1cblxuICAgIHZhciBzY2hlbWFDcmVhdGUgPSBkZXJlZihhcGlDb25maWcuY3JlYXRlVXNlci5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG4gICAgdmFyIHNjaGVtYVJlYWQgPSBkZXJlZihhcGlDb25maWcucmVhZFVzZXIucmVxdWVzdFNjaGVtYSwgZGVyZWZPcHRpb25zKVxuICAgIHZhciBzY2hlbWFVcGRhdGUgPSBkZXJlZihhcGlDb25maWcudXBkYXRlVXNlci5yZXF1ZXN0U2NoZW1hLCBkZXJlZk9wdGlvbnMpXG4gICAgdmFyIHNjaGVtYURlbGV0ZSA9IGRlcmVmKGFwaUNvbmZpZy5kZWxldGVVc2VyLnJlcXVlc3RTY2hlbWEsIGRlcmVmT3B0aW9ucylcblxuICAgIGNvbnNvbGUuZGVidWcoJ2pzb24gc2NoZW1hIGZha2VyIHNjaGVtYScsIGRlcmVmT3B0aW9ucywge3NjaGVtYUNyZWF0ZSwgc2NoZW1hUmVhZCwgc2NoZW1hVXBkYXRlLCBzY2hlbWFEZWxldGV9KVxuICAgIGNvbnNvbGUuZGVidWcoJ2pzb24gc2NoZW1hIGZha2VyIHNjaGVtYSBleGFtcGxlcycsIGpzZihzY2hlbWFDcmVhdGUpLCBqc2Yoc2NoZW1hUmVhZCksIGpzZihzY2hlbWFVcGRhdGUpLCBqc2Yoc2NoZW1hRGVsZXRlKSwpXG4gICAgdmFyIHRlc3REYXRhVG9TZW5kID0gW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgY29uc29sZS5ncm91cChgVEVTVCBSSUdIVCBEQVRBICR7aX1gKVxuICAgICAgY29uc29sZS5ncm91cChgY3JlYXRlVXNlcmApXG4gICAgICB2YXIgY3JlYXRlZFJlc3BvbnNlXG4gICAgICB2YXIgY3JlYXRlUmVxdWVzdCA9IGpzZihzY2hlbWFDcmVhdGUpXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3NlbmQgY3JlYXRlUmVxdWVzdCcsIEpTT04uc3RyaW5naWZ5KGNyZWF0ZVJlcXVlc3QpKVxuICAgICAgICByZXF1ZXN0LnBvc3RKc29uKCdodHRwOi8vMTI3LjAuMC4xOjEwODAvY3JlYXRlVXNlcicsIGNyZWF0ZVJlcXVlc3QpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSBjcmVhdGVVc2VyIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZS5pZCwgJ3N0cmluZycsICdSZXNwb25zZSBjcmVhdGVVc2VyIGlkIGlzIHN0cmluZyAnICsgZGF0YVJlc3BvbnNlLmlkKVxuICAgICAgICAgIGNyZWF0ZWRSZXNwb25zZSA9IGRhdGFSZXNwb25zZVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgICAgY29uc29sZS5ncm91cChgcmVhZFVzZXIgRnJvbSBpZGApXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHZhciBkYXRhID0ge2lkOiBjcmVhdGVkUmVzcG9uc2UuaWR9XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3NlbmQnLCBzY2hlbWFSZWFkLCBKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgICAgICAgcmVxdWVzdC5wb3N0SnNvbignaHR0cDovLzEyNy4wLjAuMToxMDgwL3JlYWRVc2VyJywgZGF0YSkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHJlYWRVc2VyIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC5zYW1lKGRhdGFSZXNwb25zZS51c2VybmFtZSwgY3JlYXRlUmVxdWVzdC5kYXRhLnVzZXJuYW1lLCAnUmVzcG9uc2UgcmVhZFVzZXIgIHVzZXJuYW1lIGFzIHNlbmRlZCwgaWQ6JyArIGRhdGFSZXNwb25zZS5faWQpXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgY29uc29sZS5ncm91cEVuZCgpXG4gICAgICBjb25zb2xlLmdyb3VwKGB1cGRhdGVVc2VyYClcbiAgICAgIHNjaGVtYVVwZGF0ZS5hbGxPZlsyXSA9IHsncHJvcGVydGllcyc6IHsnZGF0YSc6IHtyZXF1aXJlZDogWyd1c2VybmFtZSddfX19XG4gICAgICB2YXIgdXBkYXRlUmVxdWVzdCA9IGpzZihzY2hlbWFVcGRhdGUpXG4gICAgICB1cGRhdGVSZXF1ZXN0LmlkID0gY3JlYXRlZFJlc3BvbnNlLmlkXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3NlbmQnLCBzY2hlbWFVcGRhdGUsIEpTT04uc3RyaW5naWZ5KHVwZGF0ZVJlcXVlc3QpKVxuICAgICAgICByZXF1ZXN0LnBvc3RKc29uKCdodHRwOi8vMTI3LjAuMC4xOjEwODAvdXBkYXRlVXNlcicsIHVwZGF0ZVJlcXVlc3QpLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChkYXRhUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZygncmVjZWl2ZScsIEpTT04uc3RyaW5naWZ5KGRhdGFSZXNwb25zZSkpXG4gICAgICAgICAgdC50eXBlKGRhdGFSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSB1cGRhdGVVc2VyIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC5zYW1lKGRhdGFSZXNwb25zZS5pZCwgY3JlYXRlZFJlc3BvbnNlLmlkLCAnUmVzcG9uc2UgdXBkYXRlVXNlciAgaWQgYXMgc2VuZGVkLCBpZDonICsgZGF0YVJlc3BvbnNlLmlkKVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgICAgY29uc29sZS5ncm91cChgcmVhZFVzZXIgRnJvbSBkYXRhL19pZGApXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHZhciBkYXRhID0ge2RhdGE6IHtfaWQ6IGNyZWF0ZWRSZXNwb25zZS5pZH19XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3NlbmQnLCBzY2hlbWFSZWFkLCBKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgICAgICAgcmVxdWVzdC5wb3N0SnNvbignaHR0cDovLzEyNy4wLjAuMToxMDgwL3JlYWRVc2VyJywgZGF0YSkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHJlYWRVc2VyIGlzIG9iamVjdCcpXG4gICAgICAgICAgdC5zYW1lKGRhdGFSZXNwb25zZS51c2VybmFtZSwgdXBkYXRlUmVxdWVzdC5kYXRhLnVzZXJuYW1lLCAnUmVzcG9uc2UgcmVhZFVzZXIgdXNlcm5hbWUgYXMgdXBkYXRlZCwgaWQ6JyArIGRhdGFSZXNwb25zZS5faWQpXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgY29uc29sZS5ncm91cEVuZCgpXG4gICAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICB9XG4gICAgLy8gc2NoZW1hLnByb3BlcnRpZXMuZGF0YS5wcm9wZXJ0aWVzLnVzZXJuYW1lLnBhdHRlcm4gPSAnW2FdJyAvLyBNT0RJRlkgRk9SIFdST05HIFJFUVVFU1RTXG4gICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCAxOyBpKyspIHtcbiAgICAvLyAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyAgICAgdmFyIGRhdGEgPSBqc2Yoc2NoZW1hQ3JlYXRlKVxuICAgIC8vICAgICBjb25zb2xlLmRlYnVnKCdzZW5kJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gICAgLy8gICAgIHJlcXVlc3QucG9zdEpzb24oJ2h0dHA6Ly8xMjcuMC4wLjE6MTA4MC9jcmVhdGVVc2VyJywgZGF0YSkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICBjb25zb2xlLmRlYnVnKCdyZWNlaXZlJywgSlNPTi5zdHJpbmdpZnkoZGF0YVJlc3BvbnNlKSlcbiAgICAvLyAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLCAnb2JqZWN0JywgJ1Jlc3BvbnNlIHdyb25nIGNyZWF0ZVVzZXIgaXMgb2JqZWN0JylcbiAgICAvLyAgICAgICB0LnR5cGUoZGF0YVJlc3BvbnNlLmVycm9yLCAnc3RyaW5nJywgJ1Jlc3BvbnNlIHdyb25nIGNyZWF0ZVVzZXIgcmV0dXJuIGVycm9yICcgKyBkYXRhUmVzcG9uc2UuZXJyb3IpXG4gICAgLy8gICAgICAgcmVzb2x2ZSgpXG4gICAgLy8gICAgIH0pXG4gICAgLy8gICB9KVxuICAgIC8vIH1cbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgTVNfVVNFUlMuc3RvcCgpXG59KVxuIl19