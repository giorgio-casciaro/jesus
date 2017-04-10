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
  return t.test('*** ' + testTransport + ' CHANNEL ***', { autoend: true }, function mainTest(t) {
    var channelServer, channelClient;
    return regeneratorRuntime.async(function mainTest$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            }));

          case 2:
            channelServer = require('../channels/' + testTransport + '.server')({ getConsole: getConsole, methodCall: methodCall, config: config });
            channelClient = require('../channels/' + testTransport + '.client')({ getConsole: getConsole });

            channelServer.start();
            _context5.next = 7;
            return regeneratorRuntime.awrap(new Promise(function (resolve) {
              return setTimeout(resolve, 2000);
            }));

          case 7:
            t.plan(3);
            _context5.next = 10;
            return regeneratorRuntime.awrap(t.test('channelClient.send -> testResponse', function _callee2(t) {
              var response;
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      testCheck = false;
                      _context2.next = 3;
                      return regeneratorRuntime.awrap(channelClient.send(config, message, 5000, true, false));

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
            return regeneratorRuntime.awrap(t.test('channelClient.send -> testNoResponse', function _callee3(t) {
              var response;
              return regeneratorRuntime.async(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      testCheck = false;
                      _context3.next = 3;
                      return regeneratorRuntime.awrap(channelClient.send(config, message, 5000, false, false));

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
            return regeneratorRuntime.awrap(t.test('channelClient.send -> testStream', function _callee4(t) {
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
                      return regeneratorRuntime.awrap(channelClient.send(config, message, 5000, true, true));

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
            channelServer.stop();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoYW5uZWxzLnRlc3QuZXM2Il0sIm5hbWVzIjpbImdsb2JhbCIsIl9iYWJlbFBvbHlmaWxsIiwicmVxdWlyZSIsInQiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwYWNrIiwiZXJyb3IiLCJkZWJ1ZyIsImxvZyIsIndhcm4iLCJDT05TT0xFIiwiY29uZmlnIiwidXJsIiwiZmlsZSIsInRlc3RDaGVjayIsInRlc3RTdHJlYW0iLCJtZXRob2RDYWxsIiwiZGF0YSIsImdldFN0cmVhbSIsImlzUHVibGljIiwic3RyZWFtIiwiY29uc29sZSIsIndyaXRlIiwidGVzdFN0cmVhbUNvbm5uZWN0ZWQiLCJzZXRUaW1lb3V0IiwidGVzdFN0cmVhbURhdGEiLCJlbmQiLCJ0ZXN0VHJhbnNwb3J0cyIsInBsYW4iLCJsZW5ndGgiLCJtZXNzYWdlIiwibWV0aG9kIiwibWV0YSIsIm1haW5UZXN0IiwidGVzdFRyYW5zcG9ydCIsInRlc3QiLCJhdXRvZW5kIiwiUHJvbWlzZSIsInJlc29sdmUiLCJjaGFubmVsU2VydmVyIiwiY2hhbm5lbENsaWVudCIsInN0YXJ0Iiwic2VuZCIsInJlc3BvbnNlIiwic2FtZSIsInRlc3RTdHJlYW0yIiwidGVzdFN0cmVhbTMiLCJzdHJlYW1pbmciLCJvbiIsInN0b3AiLCJhbGwiLCJtYXAiLCJ0aGVuIiwicHJvY2VzcyIsImV4aXQiXSwibWFwcGluZ3MiOiI7O0FBQ0EsSUFBSSxDQUFDQSxPQUFPQyxjQUFaLEVBQTJCQyxRQUFRLGdCQUFSO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJQyxJQUFJRCxRQUFRLEtBQVIsQ0FBUjtBQUNBOztBQUVBLElBQU1FLGFBQWEsU0FBYkEsVUFBYSxDQUFDQyxXQUFELEVBQWNDLFNBQWQsRUFBeUJDLElBQXpCO0FBQUEsU0FBa0NMLFFBQVEsVUFBUixFQUFvQkUsVUFBcEIsQ0FBK0IsRUFBQ0ksT0FBTyxJQUFSLEVBQWNDLE9BQU8s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QTBCLDhCQUExQjtBQUNBNUMsd0JBQUUyQyxJQUFGLENBQU9FLFdBQVAsRUFBb0IsSUFBcEIsRUFBMEIsNkJBQTFCO0FBQ0E3Qyx3QkFBRTJDLElBQUYsQ0FBTzlCLFNBQVAsRUFBa0IsSUFBbEIsRUFBd0IscUJBQXhCO0FBQ0FiLHdCQUFFeUIsR0FBRjs7QUFkK0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBM0MsQ0ExQjhGOztBQUFBO0FBQUE7QUFBQSw0Q0EyQzlGLElBQUlXLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEscUJBQWFkLFdBQVdjLE9BQVgsRUFBb0IsSUFBcEIsQ0FBYjtBQUFBLGFBQVosQ0EzQzhGOztBQUFBO0FBNENwR0MsMEJBQWNVLElBQWQ7QUE1Q29HO0FBQUEsNENBNkM5RixJQUFJWixPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLHFCQUFhZCxXQUFXYyxPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxhQUFaLENBN0M4Rjs7QUFBQTtBQThDcEdyQyxjQUFFeUIsR0FBRjs7QUE5Q29HO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQXBFLENBQW5CO0FBQUEsQ0FBZjs7QUFpREFXLFFBQVFhLEdBQVIsQ0FBWXZCLGVBQWV3QixHQUFmLENBQW1CbEIsUUFBbkIsQ0FBWixFQUEwQ21CLElBQTFDLENBQStDO0FBQUEsU0FBTUMsUUFBUUMsSUFBUixFQUFOO0FBQUEsQ0FBL0MiLCJmaWxlIjoiY2hhbm5lbHMudGVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmlmICghZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKXJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJylcbi8vIHZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxuLy8gdmFyIGRlcmVmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZGVyZWYtc3luYycpXG4vLyB2YXIgZmFrZXIgPSByZXF1aXJlKCdmYWtlcicpXG4vLyB2YXIganNmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZmFrZXInKVxuLy8gZmFrZXIubG9jYWxlID0gJ2l0J1xuLy8gdmFyIHJlc3RsZXIgPSByZXF1aXJlKCdyZXN0bGVyJylcbi8vXG4vLyB2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxuLy8gdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuY29uc3QgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiByZXF1aXJlKCcuLi91dGlscycpLmdldENvbnNvbGUoe2Vycm9yOiB0cnVlLCBkZWJ1ZzogdHJ1ZSwgbG9nOiB0cnVlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbnZhciBDT05TT0xFID0gZ2V0Q29uc29sZSgnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxuXG52YXIgY29uZmlnID0ge3VybDogJ2xvY2FsaG9zdDo4MDgwJywgZmlsZTogJy90bXAvdGVzdCd9XG52YXIgdGVzdENoZWNrID0gZmFsc2VcbnZhciB0ZXN0U3RyZWFtID0gZmFsc2VcbnZhciBtZXRob2RDYWxsID0gYXN5bmMgKGRhdGEsIGdldFN0cmVhbSwgaXNQdWJsaWMpID0+IHtcbiAgQ09OU09MRS5kZWJ1ZygnbWV0aG9kQ2FsbCcsIGRhdGEsIGdldFN0cmVhbSwgaXNQdWJsaWMpXG4gIHRlc3RDaGVjayA9IHRydWVcbiAgaWYgKCFnZXRTdHJlYW0pIHJldHVybiBkYXRhXG4gIHZhciBzdHJlYW0gPSBnZXRTdHJlYW0oKCkgPT4gY29uc29sZS5sb2coJ2Nsb3NlZCcpLCAxMjAwMDApXG4gIHN0cmVhbS53cml0ZSh7dGVzdFN0cmVhbUNvbm5uZWN0ZWQ6IDF9KVxuXG4gIHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLndyaXRlKHt0ZXN0U3RyZWFtRGF0YTogMX0pLCA1MDApXG4gIHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLmVuZCgpLCAxMDAwKVxuICB0ZXN0U3RyZWFtID0gdHJ1ZVxufVxudmFyIHRlc3RUcmFuc3BvcnRzID0gWyAnaHR0cFB1YmxpYycsICdzb2NrZXQnLCAgJ2h0dHAnLCAndGVzdCddXG5cbnQucGxhbih0ZXN0VHJhbnNwb3J0cy5sZW5ndGgpXG52YXIgbWVzc2FnZSA9IHtcbiAgbWV0aG9kOiAndGVzdE1FdGhvZCcsXG4gIGRhdGE6IHsndGVzdERhdGEnOiAxfSxcbiAgbWV0YTogeydjb3JyaWQnOiAxLCAndXNlcmlkJzogMX1cbn1cbnZhciBtYWluVGVzdCA9ICh0ZXN0VHJhbnNwb3J0KSA9PiB0LnRlc3QoJyoqKiAnICsgdGVzdFRyYW5zcG9ydCArICcgVFJBTlNQT1JUICoqKicsIHsgYXV0b2VuZDogdHJ1ZX0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICB2YXIgY2hhbm5lbFNlcnZlciA9IHJlcXVpcmUoJy4uL2NoYW5uZWxzLycgKyB0ZXN0VHJhbnNwb3J0ICsgJy5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgbWV0aG9kQ2FsbCwgY29uZmlnfSlcbiAgdmFyIGNoYW5uZWxDbGllbnQgPSByZXF1aXJlKCcuLi9jaGFubmVscy8nICsgdGVzdFRyYW5zcG9ydCArICcuY2xpZW50Jykoe2dldENvbnNvbGV9KVxuICBjaGFubmVsU2VydmVyLnN0YXJ0KClcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMjAwMCkpXG4gIHQucGxhbigzKVxuICBhd2FpdCB0LnRlc3QoJ2NoYW5uZWxDbGllbnQuc2VuZCAtPiB0ZXN0UmVzcG9uc2UnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgY2hhbm5lbENsaWVudC5zZW5kKGNvbmZpZywgbWVzc2FnZSwgNTAwMCwgdHJ1ZSwgZmFsc2UpXG4gICAgQ09OU09MRS5kZWJ1ZygndGVzdFJlc3BvbnNlIHJlc3BvbnNlJywgcmVzcG9uc2UpXG4gICAgdC5zYW1lKHJlc3BvbnNlLmRhdGEsIG1lc3NhZ2UuZGF0YSwgJ3Jlc3BvbnNlIGRhdGEgYXMgc2VuZGVkJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB0cnVlLCAndGVzdFJlc3BvbnNlIHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIGF3YWl0IHQudGVzdCgnY2hhbm5lbENsaWVudC5zZW5kIC0+IHRlc3ROb1Jlc3BvbnNlJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciByZXNwb25zZSA9IGF3YWl0IGNoYW5uZWxDbGllbnQuc2VuZChjb25maWcsIG1lc3NhZ2UsIDUwMDAsIGZhbHNlLCBmYWxzZSlcbiAgICBDT05TT0xFLmRlYnVnKCd0ZXN0Tm9SZXNwb25zZSByZXNwb25zZScsIHJlc3BvbnNlKVxuICAgIHQuc2FtZShyZXNwb25zZSwgbnVsbCwgJ3Jlc3BvbnNlIG51bGwnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwMCkpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgdHJ1ZSwgJ3Rlc3RSZXNwb25zZSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCB0LnRlc3QoJ2NoYW5uZWxDbGllbnQuc2VuZCAtPiB0ZXN0U3RyZWFtJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHRlc3RTdHJlYW0gPSBmYWxzZVxuICAgIHZhciB0ZXN0U3RyZWFtMiA9IGZhbHNlXG4gICAgdmFyIHRlc3RTdHJlYW0zID0gZmFsc2VcbiAgICB2YXIgc3RyZWFtaW5nID0gYXdhaXQgY2hhbm5lbENsaWVudC5zZW5kKGNvbmZpZywgbWVzc2FnZSwgNTAwMCwgdHJ1ZSwgdHJ1ZSlcbiAgICBzdHJlYW1pbmcub24oJ2RhdGEnLCAoZGF0YSkgPT4geyBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgZGF0YScsIGRhdGEpOyB0ZXN0U3RyZWFtMiA9IHRydWUgfSlcbiAgICBzdHJlYW1pbmcub24oJ2Vycm9yJywgKGRhdGEpID0+IENPTlNPTEUuZGVidWcoJ3N0cmVhbWluZyBlcnJvcicsIGRhdGEpKVxuICAgIHN0cmVhbWluZy5vbignZW5kJywgKGRhdGEpID0+IHsgQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGNsb3NlJywgZGF0YSk7IHRlc3RTdHJlYW0zID0gdHJ1ZSB9KVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMDApKVxuICAgIHQuc2FtZSh0ZXN0U3RyZWFtLCB0cnVlLCAnbWV0aG9kQ2FsbCByYWdnaXVudG8gc3RyZWFtaW5nICcpXG4gICAgdC5zYW1lKHRlc3RTdHJlYW0yLCB0cnVlLCAndGVzdFN0cmVhbTIgb24gZGF0YSByaWNldnV0bycpXG4gICAgdC5zYW1lKHRlc3RTdHJlYW0zLCB0cnVlLCAndGVzdFN0cmVhbTMgb24gZW5kIHJpY2V2dXRvJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB0cnVlLCAnbWV0aG9kQ2FsbCBhdnZpYXRvICcpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICBjaGFubmVsU2VydmVyLnN0b3AoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgdC5lbmQoKVxufSlcblxuUHJvbWlzZS5hbGwodGVzdFRyYW5zcG9ydHMubWFwKG1haW5UZXN0KSkudGhlbigoKSA9PiBwcm9jZXNzLmV4aXQoKSlcbiJdfQ==