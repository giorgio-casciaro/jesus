'use strict';

if (!global._babelPolyfill) require('babel-polyfill');
// var R = require('ramda')
// var deref = require('json-schema-deref-sync')
// var faker = require('faker')
// var jsf = require('json-schema-faker')
// faker.locale = 'it'
// var restler = require('restler')
//
// var request = require('request')
var t = require('tap');
// var path = require('path')

var jesus = require('../jesus');

var getConsole = function getConsole(serviceName, serviceId, pack) {
  return jesus.getConsole({ error: true, debug: true, log: true, warn: true }, serviceName, serviceId, pack);
};
var CONSOLE = getConsole('BASE TEST', '----', '-----');

var config = { url: 'localhost:8080' };
var testCheck = false;
var testStream = false;
var methodCall = function _callee(data, getStream, isPublic) {
  var stream;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          testCheck = true;

          if (getStream) {
            _context.next = 3;
            break;
          }

          return _context.abrupt('return', data);

        case 3:
          stream = getStream(function () {
            return console.log('closed');
          }, 120000);

          stream.write({ testStreamConnnected: 1 });
          CONSOLE.debug('methodCall', data, stream);
          setTimeout(function () {
            return stream.write({ testStreamData: 1 });
          }, 500);
          setTimeout(function () {
            return stream.end();
          }, 1000);
          testStream = true;

        case 9:
        case 'end':
          return _context.stop();
      }
    }
  }, null, undefined);
};
var testTransports = ['httpPublic', 'grpc', 'http', 'test'];

t.plan(testTransports.length);
var message = {
  f: 'testService',
  m: 'testMEthod',
  d: [{ d: { 'testData': 1 }, r: 'testcorrid', u: 'userid' }]
};
var mainTest = function mainTest(testTransport) {
  return t.test('*** ' + testTransport + ' TRANSPORT ***', { autoend: true }, function mainTest(t) {
    var transportServer, transportClient;
    return regeneratorRuntime.async(function mainTest$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            }));

          case 2:
            transportServer = require('../transports/' + testTransport + '.server')({ getConsole: getConsole, methodCall: methodCall, config: config });
            transportClient = require('../transports/' + testTransport + '.client')({ getConsole: getConsole });

            transportServer.start();
            _context5.next = 7;
            return regeneratorRuntime.awrap(new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            }));

          case 7:
            t.plan(3);
            _context5.next = 10;
            return regeneratorRuntime.awrap(t.test('transportClient.send -> testResponse', function _callee2(t) {
              var response;
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      testCheck = false;
                      _context2.next = 3;
                      return regeneratorRuntime.awrap(transportClient.send(config, message, 5000, true, false));

                    case 3:
                      response = _context2.sent;

                      CONSOLE.debug('testResponse response', response);
                      t.same(response, message, 'response as sended');
                      t.same(testCheck, true, 'testResponse richiesta ricevuta');
                      t.end();

                    case 8:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, null, this);
            }));

          case 10:
            _context5.next = 12;
            return regeneratorRuntime.awrap(t.test('transportClient.send -> testNoResponse', function _callee3(t) {
              var response;
              return regeneratorRuntime.async(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      testCheck = false;
                      _context3.next = 3;
                      return regeneratorRuntime.awrap(transportClient.send(config, message, 5000, false, false));

                    case 3:
                      response = _context3.sent;

                      CONSOLE.debug('testNoResponse response', response);
                      t.same(response, null, 'response null');
                      _context3.next = 8;
                      return regeneratorRuntime.awrap(new Promise(function (resolve) {
                        return setTimeout(resolve, 500);
                      }));

                    case 8:
                      t.same(testCheck, true, 'testResponse richiesta ricevuta');
                      t.end();

                    case 10:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, null, this);
            }));

          case 12:
            _context5.next = 14;
            return regeneratorRuntime.awrap(t.test('transportClient.send -> testStream', function _callee4(t) {
              var testStream2, testStream3, streaming;
              return regeneratorRuntime.async(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      testCheck = false;
                      testStream = false;
                      testStream2 = false;
                      testStream3 = false;
                      _context4.next = 6;
                      return regeneratorRuntime.awrap(transportClient.send(config, message, 5000, true, true));

                    case 6:
                      streaming = _context4.sent;

                      streaming.on('data', function (data) {
                        CONSOLE.debug('streaming data', data);testStream2 = true;
                      });
                      streaming.on('error', function (data) {
                        return CONSOLE.debug('streaming error', data);
                      });
                      streaming.on('end', function (data) {
                        CONSOLE.debug('streaming close', data);testStream3 = true;
                      });
                      _context4.next = 12;
                      return regeneratorRuntime.awrap(new Promise(function (resolve) {
                        return setTimeout(resolve, 3000);
                      }));

                    case 12:
                      t.same(testStream, true, 'methodCall raggiunto streaming ');
                      t.same(testStream2, true, 'testStream2 on data ricevuto');
                      t.same(testStream3, true, 'testStream3 on end ricevuto');
                      t.same(testCheck, true, 'methodCall avviato ');
                      t.end();

                    case 17:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, null, this);
            }));

          case 14:
            _context5.next = 16;
            return regeneratorRuntime.awrap(new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            }));

          case 16:
            transportServer.stop();
            _context5.next = 19;
            return regeneratorRuntime.awrap(new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            }));

          case 19:
            t.end();

          case 20:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, this);
  });
};

Promise.all(testTransports.map(mainTest)).then(function () {
  return process.exit();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zcG9ydHMudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwidCIsImplc3VzIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsImVycm9yIiwiZGVidWciLCJsb2ciLCJ3YXJuIiwiQ09OU09MRSIsImNvbmZpZyIsInVybCIsInRlc3RDaGVjayIsInRlc3RTdHJlYW0iLCJtZXRob2RDYWxsIiwiZGF0YSIsImdldFN0cmVhbSIsImlzUHVibGljIiwic3RyZWFtIiwiY29uc29sZSIsIndyaXRlIiwidGVzdFN0cmVhbUNvbm5uZWN0ZWQiLCJzZXRUaW1lb3V0IiwidGVzdFN0cmVhbURhdGEiLCJlbmQiLCJ0ZXN0VHJhbnNwb3J0cyIsInBsYW4iLCJsZW5ndGgiLCJtZXNzYWdlIiwiZiIsIm0iLCJkIiwiciIsInUiLCJtYWluVGVzdCIsInRlc3RUcmFuc3BvcnQiLCJ0ZXN0IiwiYXV0b2VuZCIsIlByb21pc2UiLCJyZXNvbHZlIiwidHJhbnNwb3J0U2VydmVyIiwidHJhbnNwb3J0Q2xpZW50Iiwic3RhcnQiLCJzZW5kIiwicmVzcG9uc2UiLCJzYW1lIiwidGVzdFN0cmVhbTIiLCJ0ZXN0U3RyZWFtMyIsInN0cmVhbWluZyIsIm9uIiwic3RvcCIsImFsbCIsIm1hcCIsInRoZW4iLCJwcm9jZXNzIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLENBQUNBLE9BQU9DLGNBQVosRUFBMkJDLFFBQVEsZ0JBQVI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUlDLElBQUlELFFBQVEsS0FBUixDQUFSO0FBQ0E7O0FBRUEsSUFBSUUsUUFBUUYsUUFBUSxVQUFSLENBQVo7O0FBRUEsSUFBTUcsYUFBYSxTQUFiQSxVQUFhLENBQUNDLFdBQUQsRUFBY0MsU0FBZCxFQUF5QkMsSUFBekI7QUFBQSxTQUFrQ0osTUFBTUMsVUFBTixD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QkFBRThDLElBQUYsQ0FBT0MsV0FBUCxFQUFvQixJQUFwQixFQUEwQiw4QkFBMUI7QUFDQS9DLHdCQUFFOEMsSUFBRixDQUFPRSxXQUFQLEVBQW9CLElBQXBCLEVBQTBCLDZCQUExQjtBQUNBaEQsd0JBQUU4QyxJQUFGLENBQU9qQyxTQUFQLEVBQWtCLElBQWxCLEVBQXdCLHFCQUF4QjtBQUNBYix3QkFBRXlCLEdBQUY7O0FBZGlEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQTdDLENBMUI4Rjs7QUFBQTtBQUFBO0FBQUEsNENBMkM5RixJQUFJYyxPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLHFCQUFhakIsV0FBV2lCLE9BQVgsRUFBb0IsSUFBcEIsQ0FBYjtBQUFBLGFBQVosQ0EzQzhGOztBQUFBO0FBNENwR0MsNEJBQWdCVSxJQUFoQjtBQTVDb0c7QUFBQSw0Q0E2QzlGLElBQUlaLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEscUJBQWFqQixXQUFXaUIsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsYUFBWixDQTdDOEY7O0FBQUE7QUE4Q3BHeEMsY0FBRXlCLEdBQUY7O0FBOUNvRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFwRSxDQUFuQjtBQUFBLENBQWY7O0FBaURBYyxRQUFRYSxHQUFSLENBQVkxQixlQUFlMkIsR0FBZixDQUFtQmxCLFFBQW5CLENBQVosRUFBMENtQixJQUExQyxDQUErQztBQUFBLFNBQU1DLFFBQVFDLElBQVIsRUFBTjtBQUFBLENBQS9DIiwiZmlsZSI6InRyYW5zcG9ydHMudGVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmlmICghZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKXJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJylcbi8vIHZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxuLy8gdmFyIGRlcmVmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZGVyZWYtc3luYycpXG4vLyB2YXIgZmFrZXIgPSByZXF1aXJlKCdmYWtlcicpXG4vLyB2YXIganNmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZmFrZXInKVxuLy8gZmFrZXIubG9jYWxlID0gJ2l0J1xuLy8gdmFyIHJlc3RsZXIgPSByZXF1aXJlKCdyZXN0bGVyJylcbi8vXG4vLyB2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxuLy8gdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxudmFyIGplc3VzID0gcmVxdWlyZSgnLi4vamVzdXMnKVxuXG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IGplc3VzLmdldENvbnNvbGUoe2Vycm9yOiB0cnVlLCBkZWJ1ZzogdHJ1ZSwgbG9nOiB0cnVlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbnZhciBDT05TT0xFID0gZ2V0Q29uc29sZSgnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxuXG52YXIgY29uZmlnID0ge3VybDogJ2xvY2FsaG9zdDo4MDgwJ31cbnZhciB0ZXN0Q2hlY2sgPSBmYWxzZVxudmFyIHRlc3RTdHJlYW0gPSBmYWxzZVxudmFyIG1ldGhvZENhbGwgPSBhc3luYyAoZGF0YSwgZ2V0U3RyZWFtLCBpc1B1YmxpYykgPT4ge1xuICB0ZXN0Q2hlY2sgPSB0cnVlXG4gIGlmICghZ2V0U3RyZWFtKSByZXR1cm4gZGF0YVxuICB2YXIgc3RyZWFtID0gZ2V0U3RyZWFtKCgpID0+IGNvbnNvbGUubG9nKCdjbG9zZWQnKSwgMTIwMDAwKVxuICBzdHJlYW0ud3JpdGUoe3Rlc3RTdHJlYW1Db25ubmVjdGVkOiAxfSlcbiAgQ09OU09MRS5kZWJ1ZygnbWV0aG9kQ2FsbCcsIGRhdGEsIHN0cmVhbSlcbiAgc2V0VGltZW91dCgoKSA9PiBzdHJlYW0ud3JpdGUoe3Rlc3RTdHJlYW1EYXRhOiAxfSksIDUwMClcbiAgc2V0VGltZW91dCgoKSA9PiBzdHJlYW0uZW5kKCksIDEwMDApXG4gIHRlc3RTdHJlYW0gPSB0cnVlXG59XG52YXIgdGVzdFRyYW5zcG9ydHMgPSBbJ2h0dHBQdWJsaWMnLCAnZ3JwYycsJ2h0dHAnLCd0ZXN0J11cblxudC5wbGFuKHRlc3RUcmFuc3BvcnRzLmxlbmd0aClcbnZhciBtZXNzYWdlID0ge1xuICBmOiAndGVzdFNlcnZpY2UnLFxuICBtOiAndGVzdE1FdGhvZCcsXG4gIGQ6IFt7IGQ6IHsndGVzdERhdGEnOiAxfSwgcjogJ3Rlc3Rjb3JyaWQnLCB1OiAndXNlcmlkJyB9XVxufVxudmFyIG1haW5UZXN0ID0gKHRlc3RUcmFuc3BvcnQpID0+IHQudGVzdCgnKioqICcgKyB0ZXN0VHJhbnNwb3J0ICsgJyBUUkFOU1BPUlQgKioqJywgeyBhdXRvZW5kOiB0cnVlfSwgYXN5bmMgZnVuY3Rpb24gbWFpblRlc3QgKHQpIHtcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIHZhciB0cmFuc3BvcnRTZXJ2ZXIgPSByZXF1aXJlKCcuLi90cmFuc3BvcnRzLycgKyB0ZXN0VHJhbnNwb3J0ICsgJy5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgbWV0aG9kQ2FsbCwgY29uZmlnfSlcbiAgdmFyIHRyYW5zcG9ydENsaWVudCA9IHJlcXVpcmUoJy4uL3RyYW5zcG9ydHMvJyArIHRlc3RUcmFuc3BvcnQgKyAnLmNsaWVudCcpKHtnZXRDb25zb2xlfSlcbiAgdHJhbnNwb3J0U2VydmVyLnN0YXJ0KClcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIHQucGxhbigzKVxuICBhd2FpdCB0LnRlc3QoJ3RyYW5zcG9ydENsaWVudC5zZW5kIC0+IHRlc3RSZXNwb25zZScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCB0cmFuc3BvcnRDbGllbnQuc2VuZChjb25maWcsIG1lc3NhZ2UsIDUwMDAsIHRydWUsIGZhbHNlKVxuICAgIENPTlNPTEUuZGVidWcoJ3Rlc3RSZXNwb25zZSByZXNwb25zZScscmVzcG9uc2UpXG4gICAgdC5zYW1lKHJlc3BvbnNlLCBtZXNzYWdlLCAncmVzcG9uc2UgYXMgc2VuZGVkJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB0cnVlLCAndGVzdFJlc3BvbnNlIHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIGF3YWl0IHQudGVzdCgndHJhbnNwb3J0Q2xpZW50LnNlbmQgLT4gdGVzdE5vUmVzcG9uc2UnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgdHJhbnNwb3J0Q2xpZW50LnNlbmQoY29uZmlnLCBtZXNzYWdlLCA1MDAwLCBmYWxzZSwgZmFsc2UpXG4gICAgQ09OU09MRS5kZWJ1ZygndGVzdE5vUmVzcG9uc2UgcmVzcG9uc2UnLHJlc3BvbnNlKVxuICAgIHQuc2FtZShyZXNwb25zZSwgbnVsbCwgJ3Jlc3BvbnNlIG51bGwnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwMCkpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgdHJ1ZSwgJ3Rlc3RSZXNwb25zZSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCB0LnRlc3QoJ3RyYW5zcG9ydENsaWVudC5zZW5kIC0+IHRlc3RTdHJlYW0nLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdGVzdFN0cmVhbSA9IGZhbHNlXG4gICAgdmFyIHRlc3RTdHJlYW0yID0gZmFsc2VcbiAgICB2YXIgdGVzdFN0cmVhbTMgPSBmYWxzZVxuICAgIHZhciBzdHJlYW1pbmcgPSBhd2FpdCB0cmFuc3BvcnRDbGllbnQuc2VuZChjb25maWcsIG1lc3NhZ2UsIDUwMDAsIHRydWUsIHRydWUpXG4gICAgc3RyZWFtaW5nLm9uKCdkYXRhJywgKGRhdGEpID0+IHsgQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGRhdGEnLCBkYXRhKTsgdGVzdFN0cmVhbTIgPSB0cnVlIH0pXG4gICAgc3RyZWFtaW5nLm9uKCdlcnJvcicsIChkYXRhKSA9PiBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgZXJyb3InLCBkYXRhKSlcbiAgICBzdHJlYW1pbmcub24oJ2VuZCcsIChkYXRhKSA9PiB7IENPTlNPTEUuZGVidWcoJ3N0cmVhbWluZyBjbG9zZScsIGRhdGEpOyB0ZXN0U3RyZWFtMyA9IHRydWUgfSlcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSlcbiAgICB0LnNhbWUodGVzdFN0cmVhbSwgdHJ1ZSwgJ21ldGhvZENhbGwgcmFnZ2l1bnRvIHN0cmVhbWluZyAnKVxuICAgIHQuc2FtZSh0ZXN0U3RyZWFtMiwgdHJ1ZSwgJ3Rlc3RTdHJlYW0yIG9uIGRhdGEgcmljZXZ1dG8nKVxuICAgIHQuc2FtZSh0ZXN0U3RyZWFtMywgdHJ1ZSwgJ3Rlc3RTdHJlYW0zIG9uIGVuZCByaWNldnV0bycpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgdHJ1ZSwgJ21ldGhvZENhbGwgYXZ2aWF0byAnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgdHJhbnNwb3J0U2VydmVyLnN0b3AoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgdC5lbmQoKVxufSlcblxuUHJvbWlzZS5hbGwodGVzdFRyYW5zcG9ydHMubWFwKG1haW5UZXN0KSkudGhlbigoKSA9PiBwcm9jZXNzLmV4aXQoKSlcbiJdfQ==