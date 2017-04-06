'use strict';

if (!global._babelPolyfill) require('babel-polyfill');
var R = require('ramda');
var request = require('request');
var t = require('tap');
var path = require('path');

var getConsole = function getConsole(serviceName, serviceId, pack) {
  return require('../utils').getConsole({ error: true, debug: true, log: true, warn: true }, serviceName, serviceId, pack);
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
  return regeneratorRuntime.async(function mainTest$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          t.plan(5);
          _context10.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 3:
          _context10.next = 5;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testNoResponse', function _callee2(t) {
            var response;
            return regeneratorRuntime.async(function _callee2$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    testCheck = false;
                    _context5.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testNoResponse', data: { 'test_data': 1 }, meta: meta, timeout: 5000 }));

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
          _context10.next = 7;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testAknowlegment', function _callee3(t) {
            var response;
            return regeneratorRuntime.async(function _callee3$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    testCheck = false;
                    _context6.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testAknowlegment', data: { 'test_data': 1 }, meta: meta, timeout: 5000 }));

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
          _context10.next = 9;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testResponse', function _callee4(t) {
            var response;
            return regeneratorRuntime.async(function _callee4$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    testCheck = false;
                    _context7.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testResponse', data: { 'test_data': 1 }, meta: meta, timeout: 5000 }));

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
          _context10.next = 11;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testStream', function _callee5(t) {
            var testStream, streaming;
            return regeneratorRuntime.async(function _callee5$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    testCheck = false;
                    testStream = false;
                    _context8.next = 4;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testStream', data: { 'test_data': 1 }, meta: meta, timeout: 5000 }));

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
          _context10.next = 13;
          return regeneratorRuntime.awrap(t.test('netClient1.emit -> testEmit', function _callee6(t) {
            var response;
            return regeneratorRuntime.async(function _callee6$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    testCheck = false;
                    _context9.next = 3;
                    return regeneratorRuntime.awrap(netClient1.emit({ event: 'testEvent', data: { 'eventTest_data': 1 }, meta: meta, timeout: 5000, singleResponse: true }));

                  case 3:
                    response = _context9.sent;

                    t.same(response, { 'eventTest_data': 1 }, 'response as sended');
                    t.same(testCheck, { 'eventTest_data': 1 }, 'delayed received');
                    t.end();

                  case 7:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, null, this);
          }));

        case 13:
          _context10.next = 15;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 15:
          t.end();
          //process.exit()

        case 16:
        case 'end':
          return _context10.stop();
      }
    }
  }, null, this);
}).then(function () {
  return process.exit();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC50ZXN0LmVzNiJdLCJuYW1lcyI6WyJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsInJlcXVpcmUiLCJSIiwicmVxdWVzdCIsInQiLCJwYXRoIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsImVycm9yIiwiZGVidWciLCJsb2ciLCJ3YXJuIiwiQ09OU09MRSIsInNoYXJlZENvbmZpZyIsInRyYW5zcG9ydHMiLCJ1cmwiLCJ0ZXN0RXZlbnQiLCJtZXRob2QiLCJwdWJsaWMiLCJyZXNwb25zZVR5cGUiLCJyZXNwb25zZVNjaGVtYSIsInJlcXVlc3RTY2hlbWEiLCJuZXQyIiwibWVyZ2UiLCJuZXQxIiwibmV0IiwibmV0MyIsIm5ldDQiLCJtZXRhIiwiY29ycmlkIiwidXNlcmlkIiwidGVzdENoZWNrIiwic3RyZWFtIiwiTWV0aG9kcyIsInRlc3ROb1Jlc3BvbnNlIiwiZGF0YSIsInRlc3RBa25vd2xlZ21lbnQiLCJ0ZXN0UmVzcG9uc2UiLCJ0ZXN0U3RyZWFtIiwiZ2V0U3RyZWFtIiwib25DbG9zZSIsIndyaXRlIiwidGVzdFN0cmVhbUNvbm5uZWN0ZWQiLCJzZXRUaW1lb3V0IiwidGVzdFN0cmVhbURhdGEiLCJlbmQiLCJnZXRNZXRob2RzIiwiZ2V0U2hhcmVkQ29uZmlnIiwic2VydmljZSIsImNvbmZpZyIsImV4Y2x1ZGUiLCJhc09iaiIsInJlc3VsdHMiLCJpIiwiT2JqZWN0IiwidmFsdWVzIiwibmV0U2VydmVyMSIsIm5ldFNlcnZlcjIiLCJuZXRTZXJ2ZXIzIiwibmV0U2VydmVyNCIsInN0YXJ0IiwibmV0Q2xpZW50MSIsInRlc3QiLCJhdXRvZW5kIiwibWFpblRlc3QiLCJwbGFuIiwiUHJvbWlzZSIsInJlc29sdmUiLCJycGMiLCJ0byIsInRpbWVvdXQiLCJyZXNwb25zZSIsInNhbWUiLCJzdHJlYW1pbmciLCJvbiIsImVtaXQiLCJldmVudCIsInNpbmdsZVJlc3BvbnNlIiwidGhlbiIsInByb2Nlc3MiLCJl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RSxFQUF1RU8sZ0JBQWdCLElBQXZGLEVBQWhCLENBRnFCOztBQUFBO0FBRXRDTiw0QkFGc0M7O0FBRzFDckUsc0JBQUVzRSxJQUFGLENBQU9ELFFBQVAsRUFBaUIsRUFBQyxrQkFBa0IsQ0FBbkIsRUFBakIsRUFBd0Msb0JBQXhDO0FBQ0FyRSxzQkFBRXNFLElBQUYsQ0FBT3pDLFNBQVAsRUFBa0IsRUFBQyxrQkFBa0IsQ0FBbkIsRUFBbEIsRUFBeUMsa0JBQXpDO0FBQ0E3QixzQkFBRTJDLEdBQUY7O0FBTDBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXRDLENBeENMOztBQUFBO0FBQUE7QUFBQSwwQ0FnREssSUFBSXFCLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWF4QixXQUFXd0IsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQWhETDs7QUFBQTtBQWlERGpFLFlBQUUyQyxHQUFGO0FBQ0E7O0FBbERDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgsRUFxREdpQyxJQXJESCxDQXFEUTtBQUFBLFNBQU1DLFFBQVFDLElBQVIsRUFBTjtBQUFBLENBckRSIiwiZmlsZSI6Im5ldC50ZXN0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaWYgKCFnbG9iYWwuX2JhYmVsUG9seWZpbGwpcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKVxudmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IHJlcXVpcmUoJy4uL3V0aWxzJykuZ2V0Q29uc29sZSh7ZXJyb3I6IHRydWUsIGRlYnVnOiB0cnVlLCBsb2c6IHRydWUsIHdhcm46IHRydWV9LCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKVxudmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKCdCQVNFIFRFU1QnLCAnLS0tLScsICctLS0tLScpXG5cbnZhciBzaGFyZWRDb25maWcgPSB7XG4gICduZXQxJzoge1xuICAgICduZXQnOiB7XG4gICAgICB0cmFuc3BvcnRzOiB7XG4gICAgICAgICd0ZXN0Jzoge1xuICAgICAgICAgIHVybDogJ2xvY2FsaG9zdDo4MDgwJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICAnZXZlbnRzLmVtaXQnOiB7XG4gICAgICB0ZXN0RXZlbnQ6IHt9XG4gICAgfSxcbiAgICAnZXZlbnRzLmxpc3Rlbic6IHtcbiAgICAgIHRlc3RFdmVudDoge1xuICAgICAgICBtZXRob2Q6ICd0ZXN0UmVzcG9uc2UnXG4gICAgICB9XG4gICAgfSxcbiAgICAnbWV0aG9kcyc6IHtcbiAgICAgICd0ZXN0Tm9SZXNwb25zZSc6IHtcbiAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdub1Jlc3BvbnNlJyxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9LFxuICAgICAgJ3Rlc3RBa25vd2xlZ21lbnQnOiB7XG4gICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnYWtub3dsZWdtZW50JyxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9LFxuICAgICAgJ3Rlc3RSZXNwb25zZSc6IHtcbiAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdyZXNwb25zZScsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0U3RyZWFtJzoge1xuICAgICAgICBwdWJsaWM6IHRydWUsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ3N0cmVhbScsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuc2hhcmVkQ29uZmlnLm5ldDIgPSBSLm1lcmdlKHNoYXJlZENvbmZpZy5uZXQxLCB7XG4gIG5ldDoge1xuICAgIHRyYW5zcG9ydHM6IHtcbiAgICAgICd0ZXN0Jzoge1xuICAgICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4MidcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICdldmVudHMubGlzdGVuJzoge1xuICAgIHRlc3RFdmVudDoge1xuICAgICAgbWV0aG9kOiAndGVzdFJlc3BvbnNlJ1xuICAgIH1cbiAgfVxufSlcbnNoYXJlZENvbmZpZy5uZXQzID0gUi5tZXJnZShzaGFyZWRDb25maWcubmV0MSwge1xuICBuZXQ6IHtcbiAgICB0cmFuc3BvcnRzOiB7XG4gICAgICAndGVzdCc6IHtcbiAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODMnXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAnZXZlbnRzLmxpc3Rlbic6IHtcbiAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgIG1ldGhvZDogJ3Rlc3ROb1Jlc3BvbnNlJ1xuICAgIH1cbiAgfVxufSlcbnNoYXJlZENvbmZpZy5uZXQ0ID0gUi5tZXJnZShzaGFyZWRDb25maWcubmV0MSwge1xuICBuZXQ6IHtcbiAgICB0cmFuc3BvcnRzOiB7XG4gICAgICAndGVzdCc6IHtcbiAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODQnXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAnZXZlbnRzLmxpc3Rlbic6IHtcbiAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgIG1ldGhvZDogJ3Rlc3RBa25vd2xlZ21lbnQnXG4gICAgfVxuICB9XG59KVxudmFyIG1ldGEgPSB7XG4gIGNvcnJpZDogJ3Rlc3RSZXF1ZXN0JyxcbiAgdXNlcmlkOiAndGVzdFVzZXInXG59XG5cbnZhciB0ZXN0Q2hlY2sgPSBmYWxzZVxudmFyIHN0cmVhbVxudmFyIE1ldGhvZHMgPSB7XG4gIHRlc3ROb1Jlc3BvbnNlOiBhc3luYyhkYXRhLCBtZXRhKSA9PiB7IENPTlNPTEUuZGVidWcoJ3Rlc3ROb1Jlc3BvbnNlJywge2RhdGEsIG1ldGF9KTsgdGVzdENoZWNrID0gZGF0YSB9LFxuICB0ZXN0QWtub3dsZWdtZW50OiBhc3luYyhkYXRhLCBtZXRhKSA9PiB7IHRlc3RDaGVjayA9IGRhdGEgfSxcbiAgdGVzdFJlc3BvbnNlOiBhc3luYyhkYXRhLCBtZXRhKSA9PiB7IHRlc3RDaGVjayA9IGRhdGE7IHJldHVybiBkYXRhIH0sXG4gIHRlc3RTdHJlYW06IChkYXRhLCBtZXRhLCBnZXRTdHJlYW0pID0+IHtcbiAgICBDT05TT0xFLmRlYnVnKCd0ZXN0U3RyZWFtJywge2RhdGEsIG1ldGEsIGdldFN0cmVhbX0pXG4gICAgdGVzdENoZWNrID0gZGF0YVxuICAgIHZhciBvbkNsb3NlID0gKCkgPT4geyBDT05TT0xFLmxvZygnc3RyZWFtIGNsb3NlZCcpIH1cbiAgICBzdHJlYW0gPSBnZXRTdHJlYW0ob25DbG9zZSwgMTIwMDAwKVxuICAgIHN0cmVhbS53cml0ZSh7dGVzdFN0cmVhbUNvbm5uZWN0ZWQ6IDF9KVxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLndyaXRlKHt0ZXN0U3RyZWFtRGF0YTogMX0pLCA1MDApXG4gICAgc2V0VGltZW91dCgoKSA9PiBzdHJlYW0uZW5kKCksIDEwMDApXG4gIH1cbn1cbnZhciBnZXRNZXRob2RzID0gKCkgPT4ge1xuICByZXR1cm4gTWV0aG9kc1xufVxuXG52YXIgZ2V0U2hhcmVkQ29uZmlnID0gYXN5bmMgKHNlcnZpY2UsIGNvbmZpZyA9ICdzZXJ2aWNlJywgZXhjbHVkZSwgYXNPYmopID0+IHtcbiAgaWYgKHNlcnZpY2UgPT09ICcqJykge1xuICAgIHZhciByZXN1bHRzID0ge31cbiAgICBmb3IgKHZhciBpIGluIHNoYXJlZENvbmZpZykge1xuICAgICAgaWYgKGkgIT09IGV4Y2x1ZGUpIHtcbiAgICAgICAgcmVzdWx0c1tpXSA9IHNoYXJlZENvbmZpZ1tpXVtjb25maWddXG4gICAgICAgIHJlc3VsdHNbaV0uc2VydmljZU5hbWUgPSBpXG4gICAgICB9XG4gICAgfVxuICAgIGlmICghYXNPYmopIHsgcmVzdWx0cyA9IE9iamVjdC52YWx1ZXMocmVzdWx0cykgfVxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cbiAgcmV0dXJuIHNoYXJlZENvbmZpZ1tzZXJ2aWNlXVtjb25maWddXG59XG52YXIgbmV0U2VydmVyMSA9IHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQxJywgc2VydmljZUlkOiAnbmV0MScsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZywgY29uZmlnOiBzaGFyZWRDb25maWcubmV0MS5uZXR9KVxudmFyIG5ldFNlcnZlcjIgPSByZXF1aXJlKCcuLi9uZXQuc2VydmVyJykoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lOiAnbmV0MicsIHNlcnZpY2VJZDogJ25ldDInLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGNvbmZpZzogc2hhcmVkQ29uZmlnLm5ldDIubmV0fSlcbnZhciBuZXRTZXJ2ZXIzID0gcmVxdWlyZSgnLi4vbmV0LnNlcnZlcicpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZTogJ25ldDMnLCBzZXJ2aWNlSWQ6ICduZXQzJywgZ2V0TWV0aG9kcywgZ2V0U2hhcmVkQ29uZmlnLCBjb25maWc6IHNoYXJlZENvbmZpZy5uZXQzLm5ldH0pXG52YXIgbmV0U2VydmVyNCA9IHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQ0Jywgc2VydmljZUlkOiAnbmV0NCcsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZywgY29uZmlnOiBzaGFyZWRDb25maWcubmV0NC5uZXR9KVxubmV0U2VydmVyMS5zdGFydCgpXG5uZXRTZXJ2ZXIyLnN0YXJ0KClcbm5ldFNlcnZlcjMuc3RhcnQoKVxubmV0U2VydmVyNC5zdGFydCgpXG5cbnZhciBuZXRDbGllbnQxID0gcmVxdWlyZSgnLi4vbmV0LmNsaWVudCcpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZTogJ25ldDEnLCBzZXJ2aWNlSWQ6ICduZXQxJywgZ2V0U2hhcmVkQ29uZmlnLCBjb25maWc6IHNoYXJlZENvbmZpZy5uZXQxLm5ldH0pXG5cbnQudGVzdCgnKioqIE5FVCAqKionLCB7XG4gIGF1dG9lbmQ6IHRydWVcbn0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIHQucGxhbig1KVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLnJwYyAtPiB0ZXN0Tm9SZXNwb25zZScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBuZXRDbGllbnQxLnJwYyh7dG86ICduZXQxJywgbWV0aG9kOiAndGVzdE5vUmVzcG9uc2UnLCBkYXRhOiB7J3Rlc3RfZGF0YSc6IDF9LCBtZXRhLCB0aW1lb3V0OiA1MDAwfSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIG51bGwsICdyZXNwb25zZT10cnVlIG9uIE5vUmVzcG9uc2UnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsndGVzdF9kYXRhJzogMX0sICd0ZXN0Tm9SZXNwb25zZSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLnJwYyAtPiB0ZXN0QWtub3dsZWdtZW50JywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG5ldENsaWVudDEucnBjKHt0bzogJ25ldDEnLCBtZXRob2Q6ICd0ZXN0QWtub3dsZWdtZW50JywgZGF0YTogeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSwgdGltZW91dDogNTAwMH0pXG4gICAgdC5zYW1lKHJlc3BvbnNlLCBudWxsLCAnQWtub3dsZWdtZW50IG9rJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdEFrbm93bGVnbWVudCByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgLy9cbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLnJwYyAtPiB0ZXN0UmVzcG9uc2UnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoe3RvOiAnbmV0MScsIG1ldGhvZDogJ3Rlc3RSZXNwb25zZScsIGRhdGE6IHsndGVzdF9kYXRhJzogMX0sIG1ldGEsIHRpbWVvdXQ6IDUwMDB9KVxuICAgIHQuc2FtZShyZXNwb25zZSwgeyd0ZXN0X2RhdGEnOiAxfSwgJ3Jlc3BvbnNlIGFzIHNlbmRlZCcpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgeyd0ZXN0X2RhdGEnOiAxfSwgJ3Rlc3RSZXNwb25zZSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLnJwYyAtPiB0ZXN0U3RyZWFtJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciB0ZXN0U3RyZWFtID0gZmFsc2VcbiAgICB2YXIgc3RyZWFtaW5nID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoe3RvOiAnbmV0MScsIG1ldGhvZDogJ3Rlc3RTdHJlYW0nLCBkYXRhOiB7J3Rlc3RfZGF0YSc6IDF9LCBtZXRhLCB0aW1lb3V0OiA1MDAwfSlcbiAgICBzdHJlYW1pbmcub24oJ2RhdGEnLCAoZGF0YSkgPT4geyBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgZGF0YScsIGRhdGEpOyB0ZXN0U3RyZWFtID0gdHJ1ZSB9KVxuICAgIHN0cmVhbWluZy5vbignZXJyb3InLCAoZGF0YSkgPT4gQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGVycm9yJywgZGF0YSkpXG4gICAgc3RyZWFtaW5nLm9uKCdlbmQnLCAoZGF0YSkgPT4gQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGNsb3NlJywgZGF0YSkpXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgICB0LnNhbWUodGVzdFN0cmVhbSwgdHJ1ZSwgJ1N0cmVhbSByZWNlaXZlZCcpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgeyd0ZXN0X2RhdGEnOiAxfSwgJ3Rlc3RTdHJlYW0gcmljaGllc3RhIHJpY2V2dXRhJylcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLmVtaXQgLT4gdGVzdEVtaXQnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5lbWl0KHtldmVudDogJ3Rlc3RFdmVudCcsIGRhdGE6IHsnZXZlbnRUZXN0X2RhdGEnOiAxfSwgbWV0YSwgdGltZW91dDogNTAwMCwgc2luZ2xlUmVzcG9uc2U6IHRydWV9KVxuICAgIHQuc2FtZShyZXNwb25zZSwgeydldmVudFRlc3RfZGF0YSc6IDF9LCAncmVzcG9uc2UgYXMgc2VuZGVkJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J2V2ZW50VGVzdF9kYXRhJzogMX0sICdkZWxheWVkIHJlY2VpdmVkJylcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIHQuZW5kKClcbiAgLy9wcm9jZXNzLmV4aXQoKVxufSkudGhlbigoKSA9PiBwcm9jZXNzLmV4aXQoKSlcbiJdfQ==