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

var getConsole = function getConsole(serviceName, serviceId, pack) {
  return require('../utils').getConsole({ error: true, debug: true, log: true, warn: true }, serviceName, serviceId, pack);
};
var CONSOLE = getConsole('BASE TEST', '----', '-----');

var config = { url: 'localhost:8080', file: '/tmp/test' };
var testCheck = false;
var testStream = false;
var methodCall = function _callee(data, getStream, isPublic) {
  var stream;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          CONSOLE.debug('methodCall', data, getStream, isPublic);
          testCheck = true;

          if (getStream) {
            _context.next = 4;
            break;
          }

          return _context.abrupt('return', data);

        case 4:
          stream = getStream(function () {
            return console.log('closed');
          }, 120000);

          stream.write({ testStreamConnnected: 1 });

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
var testTransports = ['httpPublic', 'socket', 'http', 'test'];

t.plan(testTransports.length);
var message = {
  method: 'testMEthod',
  data: { 'testData': 1 },
  meta: { 'corrid': 1, 'userid': 1 }
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
              return setTimeout(resolve, 2000);
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
                      t.same(response.data, message.data, 'response data as sended');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zcG9ydHMudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwidCIsImdldENvbnNvbGUiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsInBhY2siLCJlcnJvciIsImRlYnVnIiwibG9nIiwid2FybiIsIkNPTlNPTEUiLCJjb25maWciLCJ1cmwiLCJmaWxlIiwidGVzdENoZWNrIiwidGVzdFN0cmVhbSIsIm1ldGhvZENhbGwiLCJkYXRhIiwiZ2V0U3RyZWFtIiwiaXNQdWJsaWMiLCJzdHJlYW0iLCJjb25zb2xlIiwid3JpdGUiLCJ0ZXN0U3RyZWFtQ29ubm5lY3RlZCIsInNldFRpbWVvdXQiLCJ0ZXN0U3RyZWFtRGF0YSIsImVuZCIsInRlc3RUcmFuc3BvcnRzIiwicGxhbiIsImxlbmd0aCIsIm1lc3NhZ2UiLCJtZXRob2QiLCJtZXRhIiwibWFpblRlc3QiLCJ0ZXN0VHJhbnNwb3J0IiwidGVzdCIsImF1dG9lbmQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRyYW5zcG9ydFNlcnZlciIsInRyYW5zcG9ydENsaWVudCIsInN0YXJ0Iiwic2VuZCIsInJlc3BvbnNlIiwic2FtZSIsInRlc3RTdHJlYW0yIiwidGVzdFN0cmVhbTMiLCJzdHJlYW1pbmciLCJvbiIsInN0b3AiLCJhbGwiLCJtYXAiLCJ0aGVuIiwicHJvY2VzcyIsImV4aXQiXSwibWFwcGluZ3MiOiI7O0FBQ0EsSUFBSSxDQUFDQSxPQUFPQyxjQUFaLEVBQTJCQyxRQUFRLGdCQUFSO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJQyxJQUFJRCxRQUFRLEtBQVIsQ0FBUjtBQUNBOztBQUVBLElBQU1FLGFBQWEsU0FBYkEsVUFBYSxDQUFDQyxXQUFELEVBQWNDLFNBQWQsRUFBeUJDLElBQXpCO0FBQUEsU0FBa0NMLFFBQVEsVUFBUixFQUFvQkUsVUFBcEIsQ0FBK0IsRUFBQ0ksT0FBTyxJQUFSLEVBQWND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QVAsRUFBb0IsSUFBcEIsRUFBMEIsOEJBQTFCO0FBQ0E1Qyx3QkFBRTJDLElBQUYsQ0FBT0UsV0FBUCxFQUFvQixJQUFwQixFQUEwQiw2QkFBMUI7QUFDQTdDLHdCQUFFMkMsSUFBRixDQUFPOUIsU0FBUCxFQUFrQixJQUFsQixFQUF3QixxQkFBeEI7QUFDQWIsd0JBQUV5QixHQUFGOztBQWRpRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUE3QyxDQTFCOEY7O0FBQUE7QUFBQTtBQUFBLDRDQTJDOUYsSUFBSVcsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxxQkFBYWQsV0FBV2MsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsYUFBWixDQTNDOEY7O0FBQUE7QUE0Q3BHQyw0QkFBZ0JVLElBQWhCO0FBNUNvRztBQUFBLDRDQTZDOUYsSUFBSVosT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxxQkFBYWQsV0FBV2MsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsYUFBWixDQTdDOEY7O0FBQUE7QUE4Q3BHckMsY0FBRXlCLEdBQUY7O0FBOUNvRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFwRSxDQUFuQjtBQUFBLENBQWY7O0FBaURBVyxRQUFRYSxHQUFSLENBQVl2QixlQUFld0IsR0FBZixDQUFtQmxCLFFBQW5CLENBQVosRUFBMENtQixJQUExQyxDQUErQztBQUFBLFNBQU1DLFFBQVFDLElBQVIsRUFBTjtBQUFBLENBQS9DIiwiZmlsZSI6InRyYW5zcG9ydHMudGVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmlmICghZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKXJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJylcbi8vIHZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxuLy8gdmFyIGRlcmVmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZGVyZWYtc3luYycpXG4vLyB2YXIgZmFrZXIgPSByZXF1aXJlKCdmYWtlcicpXG4vLyB2YXIganNmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZmFrZXInKVxuLy8gZmFrZXIubG9jYWxlID0gJ2l0J1xuLy8gdmFyIHJlc3RsZXIgPSByZXF1aXJlKCdyZXN0bGVyJylcbi8vXG4vLyB2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxuLy8gdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuY29uc3QgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiByZXF1aXJlKCcuLi91dGlscycpLmdldENvbnNvbGUoe2Vycm9yOiB0cnVlLCBkZWJ1ZzogdHJ1ZSwgbG9nOiB0cnVlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbnZhciBDT05TT0xFID0gZ2V0Q29uc29sZSgnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxuXG52YXIgY29uZmlnID0ge3VybDogJ2xvY2FsaG9zdDo4MDgwJywgZmlsZTogJy90bXAvdGVzdCd9XG52YXIgdGVzdENoZWNrID0gZmFsc2VcbnZhciB0ZXN0U3RyZWFtID0gZmFsc2VcbnZhciBtZXRob2RDYWxsID0gYXN5bmMgKGRhdGEsIGdldFN0cmVhbSwgaXNQdWJsaWMpID0+IHtcbiAgQ09OU09MRS5kZWJ1ZygnbWV0aG9kQ2FsbCcsIGRhdGEsIGdldFN0cmVhbSwgaXNQdWJsaWMpXG4gIHRlc3RDaGVjayA9IHRydWVcbiAgaWYgKCFnZXRTdHJlYW0pIHJldHVybiBkYXRhXG4gIHZhciBzdHJlYW0gPSBnZXRTdHJlYW0oKCkgPT4gY29uc29sZS5sb2coJ2Nsb3NlZCcpLCAxMjAwMDApXG4gIHN0cmVhbS53cml0ZSh7dGVzdFN0cmVhbUNvbm5uZWN0ZWQ6IDF9KVxuXG4gIHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLndyaXRlKHt0ZXN0U3RyZWFtRGF0YTogMX0pLCA1MDApXG4gIHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLmVuZCgpLCAxMDAwKVxuICB0ZXN0U3RyZWFtID0gdHJ1ZVxufVxudmFyIHRlc3RUcmFuc3BvcnRzID0gWyAnaHR0cFB1YmxpYycsICdzb2NrZXQnLCAgJ2h0dHAnLCAndGVzdCddXG5cbnQucGxhbih0ZXN0VHJhbnNwb3J0cy5sZW5ndGgpXG52YXIgbWVzc2FnZSA9IHtcbiAgbWV0aG9kOiAndGVzdE1FdGhvZCcsXG4gIGRhdGE6IHsndGVzdERhdGEnOiAxfSxcbiAgbWV0YTogeydjb3JyaWQnOiAxLCAndXNlcmlkJzogMX1cbn1cbnZhciBtYWluVGVzdCA9ICh0ZXN0VHJhbnNwb3J0KSA9PiB0LnRlc3QoJyoqKiAnICsgdGVzdFRyYW5zcG9ydCArICcgVFJBTlNQT1JUICoqKicsIHsgYXV0b2VuZDogdHJ1ZX0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICB2YXIgdHJhbnNwb3J0U2VydmVyID0gcmVxdWlyZSgnLi4vdHJhbnNwb3J0cy8nICsgdGVzdFRyYW5zcG9ydCArICcuc2VydmVyJykoe2dldENvbnNvbGUsIG1ldGhvZENhbGwsIGNvbmZpZ30pXG4gIHZhciB0cmFuc3BvcnRDbGllbnQgPSByZXF1aXJlKCcuLi90cmFuc3BvcnRzLycgKyB0ZXN0VHJhbnNwb3J0ICsgJy5jbGllbnQnKSh7Z2V0Q29uc29sZX0pXG4gIHRyYW5zcG9ydFNlcnZlci5zdGFydCgpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKVxuICB0LnBsYW4oMylcbiAgYXdhaXQgdC50ZXN0KCd0cmFuc3BvcnRDbGllbnQuc2VuZCAtPiB0ZXN0UmVzcG9uc2UnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgdHJhbnNwb3J0Q2xpZW50LnNlbmQoY29uZmlnLCBtZXNzYWdlLCA1MDAwLCB0cnVlLCBmYWxzZSlcbiAgICBDT05TT0xFLmRlYnVnKCd0ZXN0UmVzcG9uc2UgcmVzcG9uc2UnLCByZXNwb25zZSlcbiAgICB0LnNhbWUocmVzcG9uc2UuZGF0YSwgbWVzc2FnZS5kYXRhLCAncmVzcG9uc2UgZGF0YSBhcyBzZW5kZWQnKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHRydWUsICd0ZXN0UmVzcG9uc2UgcmljaGllc3RhIHJpY2V2dXRhJylcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgdC50ZXN0KCd0cmFuc3BvcnRDbGllbnQuc2VuZCAtPiB0ZXN0Tm9SZXNwb25zZScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCB0cmFuc3BvcnRDbGllbnQuc2VuZChjb25maWcsIG1lc3NhZ2UsIDUwMDAsIGZhbHNlLCBmYWxzZSlcbiAgICBDT05TT0xFLmRlYnVnKCd0ZXN0Tm9SZXNwb25zZSByZXNwb25zZScsIHJlc3BvbnNlKVxuICAgIHQuc2FtZShyZXNwb25zZSwgbnVsbCwgJ3Jlc3BvbnNlIG51bGwnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwMCkpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgdHJ1ZSwgJ3Rlc3RSZXNwb25zZSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCB0LnRlc3QoJ3RyYW5zcG9ydENsaWVudC5zZW5kIC0+IHRlc3RTdHJlYW0nLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdGVzdFN0cmVhbSA9IGZhbHNlXG4gICAgdmFyIHRlc3RTdHJlYW0yID0gZmFsc2VcbiAgICB2YXIgdGVzdFN0cmVhbTMgPSBmYWxzZVxuICAgIHZhciBzdHJlYW1pbmcgPSBhd2FpdCB0cmFuc3BvcnRDbGllbnQuc2VuZChjb25maWcsIG1lc3NhZ2UsIDUwMDAsIHRydWUsIHRydWUpXG4gICAgc3RyZWFtaW5nLm9uKCdkYXRhJywgKGRhdGEpID0+IHsgQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGRhdGEnLCBkYXRhKTsgdGVzdFN0cmVhbTIgPSB0cnVlIH0pXG4gICAgc3RyZWFtaW5nLm9uKCdlcnJvcicsIChkYXRhKSA9PiBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgZXJyb3InLCBkYXRhKSlcbiAgICBzdHJlYW1pbmcub24oJ2VuZCcsIChkYXRhKSA9PiB7IENPTlNPTEUuZGVidWcoJ3N0cmVhbWluZyBjbG9zZScsIGRhdGEpOyB0ZXN0U3RyZWFtMyA9IHRydWUgfSlcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSlcbiAgICB0LnNhbWUodGVzdFN0cmVhbSwgdHJ1ZSwgJ21ldGhvZENhbGwgcmFnZ2l1bnRvIHN0cmVhbWluZyAnKVxuICAgIHQuc2FtZSh0ZXN0U3RyZWFtMiwgdHJ1ZSwgJ3Rlc3RTdHJlYW0yIG9uIGRhdGEgcmljZXZ1dG8nKVxuICAgIHQuc2FtZSh0ZXN0U3RyZWFtMywgdHJ1ZSwgJ3Rlc3RTdHJlYW0zIG9uIGVuZCByaWNldnV0bycpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgdHJ1ZSwgJ21ldGhvZENhbGwgYXZ2aWF0byAnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgdHJhbnNwb3J0U2VydmVyLnN0b3AoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgdC5lbmQoKVxufSlcblxuUHJvbWlzZS5hbGwodGVzdFRyYW5zcG9ydHMubWFwKG1haW5UZXN0KSkudGhlbigoKSA9PiBwcm9jZXNzLmV4aXQoKSlcbiJdfQ==