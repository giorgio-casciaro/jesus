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
var testTransports = ['httpPublic', 'socket', 'grpc', 'http', 'test'];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zcG9ydHMudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwidCIsImplc3VzIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsImVycm9yIiwiZGVidWciLCJsb2ciLCJ3YXJuIiwiQ09OU09MRSIsImNvbmZpZyIsInVybCIsImZpbGUiLCJ0ZXN0Q2hlY2siLCJ0ZXN0U3RyZWFtIiwibWV0aG9kQ2FsbCIsImRhdGEiLCJnZXRTdHJlYW0iLCJpc1B1YmxpYyIsInN0cmVhbSIsImNvbnNvbGUiLCJ3cml0ZSIsInRlc3RTdHJlYW1Db25ubmVjdGVkIiwic2V0VGltZW91dCIsInRlc3RTdHJlYW1EYXRhIiwiZW5kIiwidGVzdFRyYW5zcG9ydHMiLCJwbGFuIiwibGVuZ3RoIiwibWVzc2FnZSIsIm1ldGhvZCIsIm1ldGEiLCJtYWluVGVzdCIsInRlc3RUcmFuc3BvcnQiLCJ0ZXN0IiwiYXV0b2VuZCIsIlByb21pc2UiLCJyZXNvbHZlIiwidHJhbnNwb3J0U2VydmVyIiwidHJhbnNwb3J0Q2xpZW50Iiwic3RhcnQiLCJzZW5kIiwicmVzcG9uc2UiLCJzYW1lIiwidGVzdFN0cmVhbTIiLCJ0ZXN0U3RyZWFtMyIsInN0cmVhbWluZyIsIm9uIiwic3RvcCIsImFsbCIsIm1hcCIsInRoZW4iLCJwcm9jZXNzIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLENBQUNBLE9BQU9DLGNBQVosRUFBMkJDLFFBQVEsZ0JBQVI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUlDLElBQUlELFFBQVEsS0FBUixDQUFSO0FBQ0E7O0FBRUEsSUFBSUUsUUFBUUYsUUFBUSxVQUFSLENBQVo7O0FBRUEsSUFBTUcsYUFBYSxTQUFiQSxVQUFhLENBQUNDLFdBQUQsRUFBY0MsU0FBZCxFQUF5QkMsSUFBekI7QUFBQSxTQUFrQ0osTUFBTUMsVUFB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LEVBQXlCLGlDQUF6QjtBQUNBZix3QkFBRTRDLElBQUYsQ0FBT0MsV0FBUCxFQUFvQixJQUFwQixFQUEwQiw4QkFBMUI7QUFDQTdDLHdCQUFFNEMsSUFBRixDQUFPRSxXQUFQLEVBQW9CLElBQXBCLEVBQTBCLDZCQUExQjtBQUNBOUMsd0JBQUU0QyxJQUFGLENBQU85QixTQUFQLEVBQWtCLElBQWxCLEVBQXdCLHFCQUF4QjtBQUNBZCx3QkFBRTBCLEdBQUY7O0FBZGlEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQTdDLENBMUI4Rjs7QUFBQTtBQUFBO0FBQUEsNENBMkM5RixJQUFJVyxPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLHFCQUFhZCxXQUFXYyxPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxhQUFaLENBM0M4Rjs7QUFBQTtBQTRDcEdDLDRCQUFnQlUsSUFBaEI7QUE1Q29HO0FBQUEsNENBNkM5RixJQUFJWixPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLHFCQUFhZCxXQUFXYyxPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxhQUFaLENBN0M4Rjs7QUFBQTtBQThDcEd0QyxjQUFFMEIsR0FBRjs7QUE5Q29HO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQXBFLENBQW5CO0FBQUEsQ0FBZjs7QUFpREFXLFFBQVFhLEdBQVIsQ0FBWXZCLGVBQWV3QixHQUFmLENBQW1CbEIsUUFBbkIsQ0FBWixFQUEwQ21CLElBQTFDLENBQStDO0FBQUEsU0FBTUMsUUFBUUMsSUFBUixFQUFOO0FBQUEsQ0FBL0MiLCJmaWxlIjoidHJhbnNwb3J0cy50ZXN0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaWYgKCFnbG9iYWwuX2JhYmVsUG9seWZpbGwpcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKVxuLy8gdmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG4vLyB2YXIgZGVyZWYgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1kZXJlZi1zeW5jJylcbi8vIHZhciBmYWtlciA9IHJlcXVpcmUoJ2Zha2VyJylcbi8vIHZhciBqc2YgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1mYWtlcicpXG4vLyBmYWtlci5sb2NhbGUgPSAnaXQnXG4vLyB2YXIgcmVzdGxlciA9IHJlcXVpcmUoJ3Jlc3RsZXInKVxuLy9cbi8vIHZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpXG52YXIgdCA9IHJlcXVpcmUoJ3RhcCcpXG4vLyB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG52YXIgamVzdXMgPSByZXF1aXJlKCcuLi9qZXN1cycpXG5cbmNvbnN0IGdldENvbnNvbGUgPSAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykgPT4gamVzdXMuZ2V0Q29uc29sZSh7ZXJyb3I6IHRydWUsIGRlYnVnOiB0cnVlLCBsb2c6IHRydWUsIHdhcm46IHRydWV9LCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKVxudmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKCdCQVNFIFRFU1QnLCAnLS0tLScsICctLS0tLScpXG5cbnZhciBjb25maWcgPSB7dXJsOiAnbG9jYWxob3N0OjgwODAnLCBmaWxlOiAnL3RtcC90ZXN0J31cbnZhciB0ZXN0Q2hlY2sgPSBmYWxzZVxudmFyIHRlc3RTdHJlYW0gPSBmYWxzZVxudmFyIG1ldGhvZENhbGwgPSBhc3luYyAoZGF0YSwgZ2V0U3RyZWFtLCBpc1B1YmxpYykgPT4ge1xuICBDT05TT0xFLmRlYnVnKCdtZXRob2RDYWxsJywgZGF0YSwgZ2V0U3RyZWFtLCBpc1B1YmxpYylcbiAgdGVzdENoZWNrID0gdHJ1ZVxuICBpZiAoIWdldFN0cmVhbSkgcmV0dXJuIGRhdGFcbiAgdmFyIHN0cmVhbSA9IGdldFN0cmVhbSgoKSA9PiBjb25zb2xlLmxvZygnY2xvc2VkJyksIDEyMDAwMClcbiAgc3RyZWFtLndyaXRlKHt0ZXN0U3RyZWFtQ29ubm5lY3RlZDogMX0pXG5cbiAgc2V0VGltZW91dCgoKSA9PiBzdHJlYW0ud3JpdGUoe3Rlc3RTdHJlYW1EYXRhOiAxfSksIDUwMClcbiAgc2V0VGltZW91dCgoKSA9PiBzdHJlYW0uZW5kKCksIDEwMDApXG4gIHRlc3RTdHJlYW0gPSB0cnVlXG59XG52YXIgdGVzdFRyYW5zcG9ydHMgPSBbICdodHRwUHVibGljJywgJ3NvY2tldCcsICdncnBjJywgJ2h0dHAnLCAndGVzdCddXG5cbnQucGxhbih0ZXN0VHJhbnNwb3J0cy5sZW5ndGgpXG52YXIgbWVzc2FnZSA9IHtcbiAgbWV0aG9kOiAndGVzdE1FdGhvZCcsXG4gIGRhdGE6IHsndGVzdERhdGEnOiAxfSxcbiAgbWV0YTogeydjb3JyaWQnOiAxLCAndXNlcmlkJzogMX1cbn1cbnZhciBtYWluVGVzdCA9ICh0ZXN0VHJhbnNwb3J0KSA9PiB0LnRlc3QoJyoqKiAnICsgdGVzdFRyYW5zcG9ydCArICcgVFJBTlNQT1JUICoqKicsIHsgYXV0b2VuZDogdHJ1ZX0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICB2YXIgdHJhbnNwb3J0U2VydmVyID0gcmVxdWlyZSgnLi4vdHJhbnNwb3J0cy8nICsgdGVzdFRyYW5zcG9ydCArICcuc2VydmVyJykoe2dldENvbnNvbGUsIG1ldGhvZENhbGwsIGNvbmZpZ30pXG4gIHZhciB0cmFuc3BvcnRDbGllbnQgPSByZXF1aXJlKCcuLi90cmFuc3BvcnRzLycgKyB0ZXN0VHJhbnNwb3J0ICsgJy5jbGllbnQnKSh7Z2V0Q29uc29sZX0pXG4gIHRyYW5zcG9ydFNlcnZlci5zdGFydCgpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKVxuICB0LnBsYW4oMylcbiAgYXdhaXQgdC50ZXN0KCd0cmFuc3BvcnRDbGllbnQuc2VuZCAtPiB0ZXN0UmVzcG9uc2UnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgdHJhbnNwb3J0Q2xpZW50LnNlbmQoY29uZmlnLCBtZXNzYWdlLCA1MDAwLCB0cnVlLCBmYWxzZSlcbiAgICBDT05TT0xFLmRlYnVnKCd0ZXN0UmVzcG9uc2UgcmVzcG9uc2UnLCByZXNwb25zZSlcbiAgICB0LnNhbWUocmVzcG9uc2UuZGF0YSwgbWVzc2FnZS5kYXRhLCAncmVzcG9uc2UgZGF0YSBhcyBzZW5kZWQnKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHRydWUsICd0ZXN0UmVzcG9uc2UgcmljaGllc3RhIHJpY2V2dXRhJylcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgdC50ZXN0KCd0cmFuc3BvcnRDbGllbnQuc2VuZCAtPiB0ZXN0Tm9SZXNwb25zZScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCB0cmFuc3BvcnRDbGllbnQuc2VuZChjb25maWcsIG1lc3NhZ2UsIDUwMDAsIGZhbHNlLCBmYWxzZSlcbiAgICBDT05TT0xFLmRlYnVnKCd0ZXN0Tm9SZXNwb25zZSByZXNwb25zZScsIHJlc3BvbnNlKVxuICAgIHQuc2FtZShyZXNwb25zZSwgbnVsbCwgJ3Jlc3BvbnNlIG51bGwnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwMCkpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgdHJ1ZSwgJ3Rlc3RSZXNwb25zZSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCB0LnRlc3QoJ3RyYW5zcG9ydENsaWVudC5zZW5kIC0+IHRlc3RTdHJlYW0nLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdGVzdFN0cmVhbSA9IGZhbHNlXG4gICAgdmFyIHRlc3RTdHJlYW0yID0gZmFsc2VcbiAgICB2YXIgdGVzdFN0cmVhbTMgPSBmYWxzZVxuICAgIHZhciBzdHJlYW1pbmcgPSBhd2FpdCB0cmFuc3BvcnRDbGllbnQuc2VuZChjb25maWcsIG1lc3NhZ2UsIDUwMDAsIHRydWUsIHRydWUpXG4gICAgc3RyZWFtaW5nLm9uKCdkYXRhJywgKGRhdGEpID0+IHsgQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGRhdGEnLCBkYXRhKTsgdGVzdFN0cmVhbTIgPSB0cnVlIH0pXG4gICAgc3RyZWFtaW5nLm9uKCdlcnJvcicsIChkYXRhKSA9PiBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgZXJyb3InLCBkYXRhKSlcbiAgICBzdHJlYW1pbmcub24oJ2VuZCcsIChkYXRhKSA9PiB7IENPTlNPTEUuZGVidWcoJ3N0cmVhbWluZyBjbG9zZScsIGRhdGEpOyB0ZXN0U3RyZWFtMyA9IHRydWUgfSlcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSlcbiAgICB0LnNhbWUodGVzdFN0cmVhbSwgdHJ1ZSwgJ21ldGhvZENhbGwgcmFnZ2l1bnRvIHN0cmVhbWluZyAnKVxuICAgIHQuc2FtZSh0ZXN0U3RyZWFtMiwgdHJ1ZSwgJ3Rlc3RTdHJlYW0yIG9uIGRhdGEgcmljZXZ1dG8nKVxuICAgIHQuc2FtZSh0ZXN0U3RyZWFtMywgdHJ1ZSwgJ3Rlc3RTdHJlYW0zIG9uIGVuZCByaWNldnV0bycpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgdHJ1ZSwgJ21ldGhvZENhbGwgYXZ2aWF0byAnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgdHJhbnNwb3J0U2VydmVyLnN0b3AoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgdC5lbmQoKVxufSlcblxuUHJvbWlzZS5hbGwodGVzdFRyYW5zcG9ydHMubWFwKG1haW5UZXN0KSkudGhlbigoKSA9PiBwcm9jZXNzLmV4aXQoKSlcbiJdfQ==