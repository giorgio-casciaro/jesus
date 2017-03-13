'use strict';

if (!global._babelPolyfill) require('babel-polyfill');
var R = require('ramda');
// var deref = require('json-schema-deref-sync')
// var faker = require('faker')
// var jsf = require('json-schema-faker')
// faker.locale = 'it'
// var restler = require('restler')
//
var request = require('request');
var t = require('tap');
var path = require('path');

var jesus = require('../jesus');

var getConsole = function getConsole(serviceName, serviceId, pack) {
  return jesus.getConsole({ error: true, debug: true, log: true, warn: true }, serviceName, serviceId, pack);
};
var CONSOLE = getConsole('BASE TEST', '----', '-----');

var sharedConfig = {
  'net1': {
    'net': {
      transports: {
        'test': {
          url: 'localhost:8080'
        }
      }
    },
    'events.emit': {
      testEvent: {}
    },
    'events.listen': {
      testEvent: {
        method: 'testResponse'
      }
    },
    'methods': {
      'testNoResponse': {
        public: true,
        responseType: 'noResponse',
        responseSchema: { 'type': 'object' },
        requestSchema: { 'type': 'object' }
      },
      'testAknowlegment': {
        public: true,
        responseType: 'aknowlegment',
        responseSchema: { 'type': 'object' },
        requestSchema: { 'type': 'object' }
      },
      'testResponse': {
        public: true,
        responseType: 'response',
        responseSchema: { 'type': 'object' },
        requestSchema: { 'type': 'object' }
      },
      'testStream': {
        public: true,
        responseType: 'stream',
        responseSchema: { 'type': 'object' },
        requestSchema: { 'type': 'object' }
      }
    }
  }
};
sharedConfig.net2 = R.merge(sharedConfig.net1, {
  net: {
    transports: {
      'test': {
        url: 'localhost:8082'
      }
    }
  },
  'events.listen': {
    testEvent: {
      method: 'testResponse'
    }
  }
});
sharedConfig.net3 = R.merge(sharedConfig.net1, {
  net: {
    transports: {
      'test': {
        url: 'localhost:8083'
      }
    }
  },
  'events.listen': {
    testEvent: {
      method: 'testNoResponse'
    }
  }
});
sharedConfig.net4 = R.merge(sharedConfig.net1, {
  net: {
    transports: {
      'test': {
        url: 'localhost:8084'
      }
    }
  },
  'events.listen': {
    testEvent: {
      method: 'testAknowlegment'
    }
  }
});
var meta = {
  corrid: 'testRequest',
  userid: 'testUser'
};

var testCheck = false;
var stream;
var Methods = {
  testNoResponse: function testNoResponse(data, meta) {
    return regeneratorRuntime.async(function testNoResponse$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            CONSOLE.debug('testNoResponse', { data: data, meta: meta });testCheck = data;
          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, null, undefined);
  },
  testAknowlegment: function testAknowlegment(data, meta) {
    return regeneratorRuntime.async(function testAknowlegment$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            testCheck = data;
          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, undefined);
  },
  testResponse: function testResponse(data, meta) {
    return regeneratorRuntime.async(function testResponse$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            testCheck = data;return _context3.abrupt('return', data);

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, null, undefined);
  },
  testStream: function testStream(data, meta, getStream) {
    CONSOLE.debug('testStream', { data: data, meta: meta, getStream: getStream });
    testCheck = data;
    var onClose = function onClose() {
      CONSOLE.log('stream closed');
    };
    stream = getStream(onClose, 120000);
    stream.write({ testStreamConnnected: 1 });
    setTimeout(function () {
      return stream.write({ testStreamData: 1 });
    }, 500);
    setTimeout(function () {
      return stream.end();
    }, 1000);
  }
};
var getMethods = function getMethods() {
  return Methods;
};

var getSharedConfig = function _callee(service) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'service';
  var exclude = arguments[2];
  var asObj = arguments[3];
  var results, i;
  return regeneratorRuntime.async(function _callee$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(service === '*')) {
            _context4.next = 5;
            break;
          }

          results = {};

          for (i in sharedConfig) {
            if (i !== exclude) {
              results[i] = sharedConfig[i][config];
              results[i].serviceName = i;
            }
          }
          if (!asObj) {
            results = Object.values(results);
          }
          return _context4.abrupt('return', results);

        case 5:
          return _context4.abrupt('return', sharedConfig[service][config]);

        case 6:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, undefined);
};
var netServer1 = require('../net.server')({ getConsole: getConsole, serviceName: 'net1', serviceId: 'net1', getMethods: getMethods, getSharedConfig: getSharedConfig, config: sharedConfig.net1.net });
var netServer2 = require('../net.server')({ getConsole: getConsole, serviceName: 'net2', serviceId: 'net2', getMethods: getMethods, getSharedConfig: getSharedConfig, config: sharedConfig.net2.net });
var netServer3 = require('../net.server')({ getConsole: getConsole, serviceName: 'net3', serviceId: 'net3', getMethods: getMethods, getSharedConfig: getSharedConfig, config: sharedConfig.net3.net });
var netServer4 = require('../net.server')({ getConsole: getConsole, serviceName: 'net4', serviceId: 'net4', getMethods: getMethods, getSharedConfig: getSharedConfig, config: sharedConfig.net4.net });
netServer1.start();
netServer2.start();
netServer3.start();
netServer4.start();

var netClient1 = require('../net.client')({ getConsole: getConsole, serviceName: 'net1', serviceId: 'net1', getSharedConfig: getSharedConfig, config: sharedConfig.net1.net });

t.test('*** NET ***', {
  autoend: true
}, function mainTest(t) {
  return regeneratorRuntime.async(function mainTest$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          t.plan(5);
          _context11.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 3:
          _context11.next = 5;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testNoResponse', function _callee2(t) {
            var response;
            return regeneratorRuntime.async(function _callee2$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    testCheck = false;
                    _context5.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testNoResponse', data: { 'test_data': 1 }, meta: meta, timeout: 5000, singleResponse: true }));

                  case 3:
                    response = _context5.sent;

                    t.same(response, null, 'response=true on NoResponse');
                    _context5.next = 7;
                    return regeneratorRuntime.awrap(new Promise(function (resolve) {
                      return setTimeout(resolve, 1000);
                    }));

                  case 7:
                    t.same(testCheck, { 'test_data': 1 }, 'testNoResponse richiesta ricevuta');
                    t.end();

                  case 9:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, null, this);
          }));

        case 5:
          _context11.next = 7;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testAknowlegment', function _callee3(t) {
            var response;
            return regeneratorRuntime.async(function _callee3$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    testCheck = false;
                    _context6.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testAknowlegment', data: { 'test_data': 1 }, meta: meta, timeout: 5000, singleResponse: true }));

                  case 3:
                    response = _context6.sent;

                    t.same(response, null, 'Aknowlegment ok');
                    t.same(testCheck, { 'test_data': 1 }, 'testAknowlegment richiesta ricevuta');
                    t.end();

                  case 7:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, null, this);
          }));

        case 7:
          _context11.next = 9;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testResponse', function _callee4(t) {
            var response;
            return regeneratorRuntime.async(function _callee4$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    testCheck = false;
                    _context7.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testResponse', data: { 'test_data': 1 }, meta: meta, timeout: 5000, singleResponse: true }));

                  case 3:
                    response = _context7.sent;

                    t.same(response, { 'test_data': 1 }, 'response as sended');
                    t.same(testCheck, { 'test_data': 1 }, 'testResponse richiesta ricevuta');
                    t.end();

                  case 7:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, null, this);
          }));

        case 9:
          _context11.next = 11;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testStream', function _callee5(t) {
            var testStream, streaming;
            return regeneratorRuntime.async(function _callee5$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    testCheck = false;
                    testStream = false;
                    _context8.next = 4;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testStream', data: { 'test_data': 1 }, meta: meta, timeout: 5000, singleResponse: true }));

                  case 4:
                    streaming = _context8.sent;

                    streaming.on('data', function (data) {
                      CONSOLE.debug('streaming data', data);testStream = true;
                    });
                    streaming.on('error', function (data) {
                      return CONSOLE.debug('streaming error', data);
                    });
                    streaming.on('end', function (data) {
                      return CONSOLE.debug('streaming close', data);
                    });

                    _context8.next = 10;
                    return regeneratorRuntime.awrap(new Promise(function (resolve) {
                      return setTimeout(resolve, 1000);
                    }));

                  case 10:
                    t.same(testStream, true, 'Stream received');
                    t.same(testCheck, { 'test_data': 1 }, 'testStream richiesta ricevuta');
                    t.end();

                  case 13:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, null, this);
          }));

        case 11:
          _context11.next = 13;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testResponse delayed 2000', function _callee6(t) {
            var response;
            return regeneratorRuntime.async(function _callee6$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    testCheck = false;
                    _context9.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testResponse', data: { 'test_data': 1 }, meta: meta, delayed: 1000, timeout: 5000, singleResponse: true }));

                  case 3:
                    response = _context9.sent;

                    t.same(response, null, 'delayed response   ');
                    _context9.next = 7;
                    return regeneratorRuntime.awrap(new Promise(function (resolve) {
                      return setTimeout(resolve, 2000);
                    }));

                  case 7:
                    t.same(testCheck, { 'test_data': 1 }, 'delayed received');
                    t.end();

                  case 9:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, null, this);
          }));

        case 13:
          _context11.next = 15;
          return regeneratorRuntime.awrap(t.test('netClient1.emit -> testEmit', function _callee7(t) {
            var response;
            return regeneratorRuntime.async(function _callee7$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    testCheck = false;
                    _context10.next = 3;
                    return regeneratorRuntime.awrap(netClient1.emit({ event: 'testEvent', data: { 'eventTest_data': 1 }, meta: meta, timeout: 5000, singleResponse: true }));

                  case 3:
                    response = _context10.sent;

                    t.same(response, { 'eventTest_data': 1 }, 'response as sended');
                    t.same(testCheck, { 'eventTest_data': 1 }, 'delayed received');
                    t.end();

                  case 7:
                  case 'end':
                    return _context10.stop();
                }
              }
            }, null, this);
          }));

        case 15:
          _context11.next = 17;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 17:
          t.end();
          process.exit();

        case 19:
        case 'end':
          return _context11.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC50ZXN0LmVzNiJdLCJuYW1lcyI6WyJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsInJlcXVpcmUiLCJSIiwicmVxdWVzdCIsInQiLCJwYXRoIiwiamVzdXMiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwYWNrIiwiZXJyb3IiLCJkZWJ1ZyIsImxvZyIsIndhcm4iLCJDT05TT0xFIiwic2hhcmVkQ29uZmlnIiwidHJhbnNwb3J0cyIsInVybCIsInRlc3RFdmVudCIsIm1ldGhvZCIsInB1YmxpYyIsInJlc3BvbnNlVHlwZSIsInJlc3BvbnNlU2NoZW1hIiwicmVxdWVzdFNjaGVtYSIsIm5ldDIiLCJtZXJnZSIsIm5ldDEiLCJuZXQiLCJuZXQzIiwibmV0NCIsIm1ldGEiLCJjb3JyaWQiLCJ1c2VyaWQiLCJ0ZXN0Q2hlY2siLCJzdHJlYW0iLCJNZXRob2RzIiwidGVzdE5vUmVzcG9uc2UiLCJkYXRhIiwidGVzdEFrbm93bGVnbWVudCIsInRlc3RSZXNwb25zZSIsInRlc3RTdHJlYW0iLCJnZXRTdHJlYW0iLCJvbkNsb3NlIiwid3JpdGUiLCJ0ZXN0U3RyZWFtQ29ubm5lY3RlZCIsInNldFRpbWVvdXQiLCJ0ZXN0U3RyZWFtRGF0YSIsImVuZCIsImdldE1ldGhvZHMiLCJnZXRTaGFyZWRDb25maWciLCJzZXJ2aWNlIiwiY29uZmlnIiwiZXhjbHVkZSIsImFzT2JqIiwicmVzdWx0cyIsImkiLCJPYmplY3QiLCJ2YWx1ZXMiLCJuZXRTZXJ2ZXIxIiwibmV0U2VydmVyMiIsIm5ldFNlcnZlcjMiLCJuZXRTZXJ2ZXI0Iiwic3RhcnQiLCJuZXRDbGllbnQxIiwidGVzdCIsImF1dG9lbmQiLCJtYWluVGVzdCIsInBsYW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJwYyIsInRvIiwidGltZW91dCIsInNpbmdsZVJlc3BvbnNlIiwicmVzcG9uc2UiLCJzYW1lIiwic3RyZWFtaW5nIiwib24iLCJkZWxheWVkIiwiZW1pdCIsImV2ZW50Iiwi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O0FBQ0F2RSxzQkFBRXdFLElBQUYsQ0FBTzFDLFNBQVAsRUFBa0IsRUFBQyxrQkFBa0IsQ0FBbkIsRUFBbEIsRUFBeUMsa0JBQXpDO0FBQ0E5QixzQkFBRTRDLEdBQUY7O0FBTDBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXRDLENBakRMOztBQUFBO0FBQUE7QUFBQSwwQ0F5REssSUFBSXFCLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWF4QixXQUFXd0IsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQXpETDs7QUFBQTtBQTBERGxFLFlBQUU0QyxHQUFGO0FBQ0FrQyxrQkFBUUMsSUFBUjs7QUEzREM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FGSCIsImZpbGUiOiJuZXQudGVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmlmICghZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKXJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJylcbnZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxuLy8gdmFyIGRlcmVmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZGVyZWYtc3luYycpXG4vLyB2YXIgZmFrZXIgPSByZXF1aXJlKCdmYWtlcicpXG4vLyB2YXIganNmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZmFrZXInKVxuLy8gZmFrZXIubG9jYWxlID0gJ2l0J1xuLy8gdmFyIHJlc3RsZXIgPSByZXF1aXJlKCdyZXN0bGVyJylcbi8vXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxudmFyIGplc3VzID0gcmVxdWlyZSgnLi4vamVzdXMnKVxuXG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IGplc3VzLmdldENvbnNvbGUoe2Vycm9yOiB0cnVlLCBkZWJ1ZzogdHJ1ZSwgbG9nOiB0cnVlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbnZhciBDT05TT0xFID0gZ2V0Q29uc29sZSgnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxuXG52YXIgc2hhcmVkQ29uZmlnID0ge1xuICAnbmV0MSc6IHtcbiAgICAnbmV0Jzoge1xuICAgICAgdHJhbnNwb3J0czoge1xuICAgICAgICAndGVzdCc6IHtcbiAgICAgICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4MCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2V2ZW50cy5lbWl0Jzoge1xuICAgICAgdGVzdEV2ZW50OiB7fVxuICAgIH0sXG4gICAgJ2V2ZW50cy5saXN0ZW4nOiB7XG4gICAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgICAgbWV0aG9kOiAndGVzdFJlc3BvbnNlJ1xuICAgICAgfVxuICAgIH0sXG4gICAgJ21ldGhvZHMnOiB7XG4gICAgICAndGVzdE5vUmVzcG9uc2UnOiB7XG4gICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnbm9SZXNwb25zZScsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0QWtub3dsZWdtZW50Jzoge1xuICAgICAgICBwdWJsaWM6IHRydWUsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2Frbm93bGVnbWVudCcsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0UmVzcG9uc2UnOiB7XG4gICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAncmVzcG9uc2UnLFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH0sXG4gICAgICAndGVzdFN0cmVhbSc6IHtcbiAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdzdHJlYW0nLFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbnNoYXJlZENvbmZpZy5uZXQyID0gUi5tZXJnZShzaGFyZWRDb25maWcubmV0MSwge1xuICBuZXQ6IHtcbiAgICB0cmFuc3BvcnRzOiB7XG4gICAgICAndGVzdCc6IHtcbiAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODInXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAnZXZlbnRzLmxpc3Rlbic6IHtcbiAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgIG1ldGhvZDogJ3Rlc3RSZXNwb25zZSdcbiAgICB9XG4gIH1cbn0pXG5zaGFyZWRDb25maWcubmV0MyA9IFIubWVyZ2Uoc2hhcmVkQ29uZmlnLm5ldDEsIHtcbiAgbmV0OiB7XG4gICAgdHJhbnNwb3J0czoge1xuICAgICAgJ3Rlc3QnOiB7XG4gICAgICAgIHVybDogJ2xvY2FsaG9zdDo4MDgzJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJ2V2ZW50cy5saXN0ZW4nOiB7XG4gICAgdGVzdEV2ZW50OiB7XG4gICAgICBtZXRob2Q6ICd0ZXN0Tm9SZXNwb25zZSdcbiAgICB9XG4gIH1cbn0pXG5zaGFyZWRDb25maWcubmV0NCA9IFIubWVyZ2Uoc2hhcmVkQ29uZmlnLm5ldDEsIHtcbiAgbmV0OiB7XG4gICAgdHJhbnNwb3J0czoge1xuICAgICAgJ3Rlc3QnOiB7XG4gICAgICAgIHVybDogJ2xvY2FsaG9zdDo4MDg0J1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJ2V2ZW50cy5saXN0ZW4nOiB7XG4gICAgdGVzdEV2ZW50OiB7XG4gICAgICBtZXRob2Q6ICd0ZXN0QWtub3dsZWdtZW50J1xuICAgIH1cbiAgfVxufSlcbnZhciBtZXRhID0ge1xuICBjb3JyaWQ6ICd0ZXN0UmVxdWVzdCcsXG4gIHVzZXJpZDogJ3Rlc3RVc2VyJ1xufVxuXG52YXIgdGVzdENoZWNrID0gZmFsc2VcbnZhciBzdHJlYW1cbnZhciBNZXRob2RzID0ge1xuICB0ZXN0Tm9SZXNwb25zZTogYXN5bmMoZGF0YSwgbWV0YSkgPT4geyBDT05TT0xFLmRlYnVnKCd0ZXN0Tm9SZXNwb25zZScsIHtkYXRhLCBtZXRhfSk7IHRlc3RDaGVjayA9IGRhdGEgfSxcbiAgdGVzdEFrbm93bGVnbWVudDogYXN5bmMoZGF0YSwgbWV0YSkgPT4geyB0ZXN0Q2hlY2sgPSBkYXRhIH0sXG4gIHRlc3RSZXNwb25zZTogYXN5bmMoZGF0YSwgbWV0YSkgPT4geyB0ZXN0Q2hlY2sgPSBkYXRhOyByZXR1cm4gZGF0YSB9LFxuICB0ZXN0U3RyZWFtOiAoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtKSA9PiB7XG4gICAgQ09OU09MRS5kZWJ1ZygndGVzdFN0cmVhbScsIHtkYXRhLCBtZXRhLCBnZXRTdHJlYW19KVxuICAgIHRlc3RDaGVjayA9IGRhdGFcbiAgICB2YXIgb25DbG9zZSA9ICgpID0+IHsgQ09OU09MRS5sb2coJ3N0cmVhbSBjbG9zZWQnKSB9XG4gICAgc3RyZWFtID0gZ2V0U3RyZWFtKG9uQ2xvc2UsIDEyMDAwMClcbiAgICBzdHJlYW0ud3JpdGUoe3Rlc3RTdHJlYW1Db25ubmVjdGVkOiAxfSlcbiAgICBzZXRUaW1lb3V0KCgpID0+IHN0cmVhbS53cml0ZSh7dGVzdFN0cmVhbURhdGE6IDF9KSwgNTAwKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLmVuZCgpLCAxMDAwKVxuICB9XG59XG52YXIgZ2V0TWV0aG9kcyA9ICgpID0+IHtcbiAgcmV0dXJuIE1ldGhvZHNcbn1cblxudmFyIGdldFNoYXJlZENvbmZpZyA9IGFzeW5jIChzZXJ2aWNlLCBjb25maWcgPSAnc2VydmljZScsIGV4Y2x1ZGUsIGFzT2JqKSA9PiB7XG4gIGlmIChzZXJ2aWNlID09PSAnKicpIHtcbiAgICB2YXIgcmVzdWx0cyA9IHt9XG4gICAgZm9yICh2YXIgaSBpbiBzaGFyZWRDb25maWcpIHtcbiAgICAgIGlmIChpICE9PSBleGNsdWRlKSB7XG4gICAgICAgIHJlc3VsdHNbaV0gPSBzaGFyZWRDb25maWdbaV1bY29uZmlnXVxuICAgICAgICByZXN1bHRzW2ldLnNlcnZpY2VOYW1lID0gaVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWFzT2JqKSB7IHJlc3VsdHMgPSBPYmplY3QudmFsdWVzKHJlc3VsdHMpIH1cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG4gIHJldHVybiBzaGFyZWRDb25maWdbc2VydmljZV1bY29uZmlnXVxufVxudmFyIG5ldFNlcnZlcjEgPSByZXF1aXJlKCcuLi9uZXQuc2VydmVyJykoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lOiAnbmV0MScsIHNlcnZpY2VJZDogJ25ldDEnLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGNvbmZpZzogc2hhcmVkQ29uZmlnLm5ldDEubmV0fSlcbnZhciBuZXRTZXJ2ZXIyID0gcmVxdWlyZSgnLi4vbmV0LnNlcnZlcicpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZTogJ25ldDInLCBzZXJ2aWNlSWQ6ICduZXQyJywgZ2V0TWV0aG9kcywgZ2V0U2hhcmVkQ29uZmlnLCBjb25maWc6IHNoYXJlZENvbmZpZy5uZXQyLm5ldH0pXG52YXIgbmV0U2VydmVyMyA9IHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQzJywgc2VydmljZUlkOiAnbmV0MycsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZywgY29uZmlnOiBzaGFyZWRDb25maWcubmV0My5uZXR9KVxudmFyIG5ldFNlcnZlcjQgPSByZXF1aXJlKCcuLi9uZXQuc2VydmVyJykoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lOiAnbmV0NCcsIHNlcnZpY2VJZDogJ25ldDQnLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGNvbmZpZzogc2hhcmVkQ29uZmlnLm5ldDQubmV0fSlcbm5ldFNlcnZlcjEuc3RhcnQoKVxubmV0U2VydmVyMi5zdGFydCgpXG5uZXRTZXJ2ZXIzLnN0YXJ0KClcbm5ldFNlcnZlcjQuc3RhcnQoKVxuXG52YXIgbmV0Q2xpZW50MSA9IHJlcXVpcmUoJy4uL25ldC5jbGllbnQnKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQxJywgc2VydmljZUlkOiAnbmV0MScsIGdldFNoYXJlZENvbmZpZywgY29uZmlnOiBzaGFyZWRDb25maWcubmV0MS5uZXR9KVxuXG50LnRlc3QoJyoqKiBORVQgKioqJywge1xuICBhdXRvZW5kOiB0cnVlXG59LCBhc3luYyBmdW5jdGlvbiBtYWluVGVzdCAodCkge1xuICB0LnBsYW4oNSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5ycGMgLT4gdGVzdE5vUmVzcG9uc2UnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoe3RvOiAnbmV0MScsIG1ldGhvZDogJ3Rlc3ROb1Jlc3BvbnNlJywgZGF0YTogeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSwgdGltZW91dDogNTAwMCwgc2luZ2xlUmVzcG9uc2U6IHRydWV9KVxuICAgIHQuc2FtZShyZXNwb25zZSwgbnVsbCwgJ3Jlc3BvbnNlPXRydWUgb24gTm9SZXNwb25zZScpXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgeyd0ZXN0X2RhdGEnOiAxfSwgJ3Rlc3ROb1Jlc3BvbnNlIHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3RBa25vd2xlZ21lbnQnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoe3RvOiAnbmV0MScsIG1ldGhvZDogJ3Rlc3RBa25vd2xlZ21lbnQnLCBkYXRhOiB7J3Rlc3RfZGF0YSc6IDF9LCBtZXRhLCB0aW1lb3V0OiA1MDAwLCBzaW5nbGVSZXNwb25zZTogdHJ1ZX0pXG4gICAgdC5zYW1lKHJlc3BvbnNlLCBudWxsLCAnQWtub3dsZWdtZW50IG9rJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdEFrbm93bGVnbWVudCByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgLy9cbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLnJwYyAtPiB0ZXN0UmVzcG9uc2UnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoe3RvOiAnbmV0MScsIG1ldGhvZDogJ3Rlc3RSZXNwb25zZScsIGRhdGE6IHsndGVzdF9kYXRhJzogMX0sIG1ldGEsIHRpbWVvdXQ6IDUwMDAsIHNpbmdsZVJlc3BvbnNlOiB0cnVlfSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIHsndGVzdF9kYXRhJzogMX0sICdyZXNwb25zZSBhcyBzZW5kZWQnKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsndGVzdF9kYXRhJzogMX0sICd0ZXN0UmVzcG9uc2UgcmljaGllc3RhIHJpY2V2dXRhJylcbiAgICB0LmVuZCgpXG4gIH0pXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5ycGMgLT4gdGVzdFN0cmVhbScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgdGVzdFN0cmVhbSA9IGZhbHNlXG4gICAgdmFyIHN0cmVhbWluZyA9IGF3YWl0IG5ldENsaWVudDEucnBjKHt0bzogJ25ldDEnLCBtZXRob2Q6ICd0ZXN0U3RyZWFtJywgZGF0YTogeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSwgdGltZW91dDogNTAwMCwgc2luZ2xlUmVzcG9uc2U6IHRydWV9KVxuICAgIHN0cmVhbWluZy5vbignZGF0YScsIChkYXRhKSA9PiB7IENPTlNPTEUuZGVidWcoJ3N0cmVhbWluZyBkYXRhJywgZGF0YSk7IHRlc3RTdHJlYW0gPSB0cnVlIH0pXG4gICAgc3RyZWFtaW5nLm9uKCdlcnJvcicsIChkYXRhKSA9PiBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgZXJyb3InLCBkYXRhKSlcbiAgICBzdHJlYW1pbmcub24oJ2VuZCcsIChkYXRhKSA9PiBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgY2xvc2UnLCBkYXRhKSlcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICAgIHQuc2FtZSh0ZXN0U3RyZWFtLCB0cnVlLCAnU3RyZWFtIHJlY2VpdmVkJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdFN0cmVhbSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3RSZXNwb25zZSBkZWxheWVkIDIwMDAnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoe3RvOiAnbmV0MScsIG1ldGhvZDogJ3Rlc3RSZXNwb25zZScsIGRhdGE6IHsndGVzdF9kYXRhJzogMX0sIG1ldGEsIGRlbGF5ZWQ6IDEwMDAsIHRpbWVvdXQ6IDUwMDAsIHNpbmdsZVJlc3BvbnNlOiB0cnVlfSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIG51bGwsICdkZWxheWVkIHJlc3BvbnNlICAgJylcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDAwKSlcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAnZGVsYXllZCByZWNlaXZlZCcpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5lbWl0IC0+IHRlc3RFbWl0JywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG5ldENsaWVudDEuZW1pdCh7ZXZlbnQ6ICd0ZXN0RXZlbnQnLCBkYXRhOiB7J2V2ZW50VGVzdF9kYXRhJzogMX0sIG1ldGEsIHRpbWVvdXQ6IDUwMDAsIHNpbmdsZVJlc3BvbnNlOiB0cnVlfSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIHsnZXZlbnRUZXN0X2RhdGEnOiAxfSwgJ3Jlc3BvbnNlIGFzIHNlbmRlZCcpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgeydldmVudFRlc3RfZGF0YSc6IDF9LCAnZGVsYXllZCByZWNlaXZlZCcpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICB0LmVuZCgpXG4gIHByb2Nlc3MuZXhpdCgpXG59KVxuIl19