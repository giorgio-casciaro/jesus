'use strict';

if (!global._babelPolyfill) require('babel-polyfill');
var R = require('ramda');
var request = require('request');
var t = require('tap');
var path = require('path');

var getConsole = function getConsole(serviceName, serviceId, pack) {
  return require('../utils').getConsole({ error: true, debug: true, log: false, warn: true }, serviceName, serviceId, pack);
};
var CONSOLE = getConsole('BASE TEST', '----', '-----');

var sharedConfig = {
  'net1': {
    'net': {
      channels: {
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
    channels: {
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
    channels: {
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
    channels: {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC50ZXN0LmVzNiJdLCJuYW1lcyI6WyJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsInJlcXVpcmUiLCJSIiwicmVxdWVzdCIsInQiLCJwYXRoIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsImVycm9yIiwiZGVidWciLCJsb2ciLCJ3YXJuIiwiQ09OU09MRSIsInNoYXJlZENvbmZpZyIsImNoYW5uZWxzIiwidXJsIiwidGVzdEV2ZW50IiwibWV0aG9kIiwicHVibGljIiwicmVzcG9uc2VUeXBlIiwicmVzcG9uc2VTY2hlbWEiLCJyZXF1ZXN0U2NoZW1hIiwibmV0MiIsIm1lcmdlIiwibmV0MSIsIm5ldCIsIm5ldDMiLCJuZXQ0IiwibWV0YSIsImNvcnJpZCIsInVzZXJpZCIsInRlc3RDaGVjayIsInN0cmVhbSIsIk1ldGhvZHMiLCJ0ZXN0Tm9SZXNwb25zZSIsImRhdGEiLCJ0ZXN0QWtub3dsZWdtZW50IiwidGVzdFJlc3BvbnNlIiwidGVzdFN0cmVhbSIsImdldFN0cmVhbSIsIm9uQ2xvc2UiLCJ3cml0ZSIsInRlc3RTdHJlYW1Db25ubmVjdGVkIiwic2V0VGltZW91dCIsInRlc3RTdHJlYW1EYXRhIiwiZW5kIiwiZ2V0TWV0aG9kcyIsImdldFNoYXJlZENvbmZpZyIsInNlcnZpY2UiLCJjb25maWciLCJleGNsdWRlIiwiYXNPYmoiLCJyZXN1bHRzIiwiaSIsIk9iamVjdCIsInZhbHVlcyIsIm5ldFNlcnZlcjEiLCJuZXRTZXJ2ZXIyIiwibmV0U2VydmVyMyIsIm5ldFNlcnZlcjQiLCJzdGFydCIsIm5ldENsaWVudDEiLCJ0ZXN0IiwiYXV0b2VuZCIsIm1haW5UZXN0IiwicGxhbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicnBjIiwidG8iLCJ0aW1lb3V0IiwicmVzcG9uc2UiLCJzYW1lIiwic3RyZWFtaW5nIiwib24iLCJlbWl0IiwiZXZlbnQiLCJzaW5nbGVSZXNwb25zZSIsInRoZW4iLCJwcm9jZXNzIiwiZXhp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dUVPLGdCQUFnQixJQUF2RixFQUFoQixDQUZxQjs7QUFBQTtBQUV0Q04sNEJBRnNDOztBQUcxQ3JFLHNCQUFFc0UsSUFBRixDQUFPRCxRQUFQLEVBQWlCLEVBQUMsa0JBQWtCLENBQW5CLEVBQWpCLEVBQXdDLG9CQUF4QztBQUNBckUsc0JBQUVzRSxJQUFGLENBQU96QyxTQUFQLEVBQWtCLEVBQUMsa0JBQWtCLENBQW5CLEVBQWxCLEVBQXlDLGtCQUF6QztBQUNBN0Isc0JBQUUyQyxHQUFGOztBQUwwQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUF0QyxDQXhDTDs7QUFBQTtBQUFBO0FBQUEsMENBZ0RLLElBQUlxQixPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLG1CQUFheEIsV0FBV3dCLE9BQVgsRUFBb0IsSUFBcEIsQ0FBYjtBQUFBLFdBQVosQ0FoREw7O0FBQUE7QUFpRERqRSxZQUFFMkMsR0FBRjtBQUNBOztBQWxEQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUZILEVBcURHaUMsSUFyREgsQ0FxRFE7QUFBQSxTQUFNQyxRQUFRQyxJQUFSLEVBQU47QUFBQSxDQXJEUiIsImZpbGUiOiJuZXQudGVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmlmICghZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKXJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJylcbnZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0JylcbnZhciB0ID0gcmVxdWlyZSgndGFwJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cblxuY29uc3QgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiByZXF1aXJlKCcuLi91dGlscycpLmdldENvbnNvbGUoe2Vycm9yOiB0cnVlLCBkZWJ1ZzogdHJ1ZSwgbG9nOiBmYWxzZSwgd2FybjogdHJ1ZX0sIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spXG52YXIgQ09OU09MRSA9IGdldENvbnNvbGUoJ0JBU0UgVEVTVCcsICctLS0tJywgJy0tLS0tJylcblxudmFyIHNoYXJlZENvbmZpZyA9IHtcbiAgJ25ldDEnOiB7XG4gICAgJ25ldCc6IHtcbiAgICAgIGNoYW5uZWxzOiB7XG4gICAgICAgICd0ZXN0Jzoge1xuICAgICAgICAgIHVybDogJ2xvY2FsaG9zdDo4MDgwJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICAnZXZlbnRzLmVtaXQnOiB7XG4gICAgICB0ZXN0RXZlbnQ6IHt9XG4gICAgfSxcbiAgICAnZXZlbnRzLmxpc3Rlbic6IHtcbiAgICAgIHRlc3RFdmVudDoge1xuICAgICAgICBtZXRob2Q6ICd0ZXN0UmVzcG9uc2UnXG4gICAgICB9XG4gICAgfSxcbiAgICAnbWV0aG9kcyc6IHtcbiAgICAgICd0ZXN0Tm9SZXNwb25zZSc6IHtcbiAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdub1Jlc3BvbnNlJyxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9LFxuICAgICAgJ3Rlc3RBa25vd2xlZ21lbnQnOiB7XG4gICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnYWtub3dsZWdtZW50JyxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9LFxuICAgICAgJ3Rlc3RSZXNwb25zZSc6IHtcbiAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdyZXNwb25zZScsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0U3RyZWFtJzoge1xuICAgICAgICBwdWJsaWM6IHRydWUsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ3N0cmVhbScsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuc2hhcmVkQ29uZmlnLm5ldDIgPSBSLm1lcmdlKHNoYXJlZENvbmZpZy5uZXQxLCB7XG4gIG5ldDoge1xuICAgIGNoYW5uZWxzOiB7XG4gICAgICAndGVzdCc6IHtcbiAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODInXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAnZXZlbnRzLmxpc3Rlbic6IHtcbiAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgIG1ldGhvZDogJ3Rlc3RSZXNwb25zZSdcbiAgICB9XG4gIH1cbn0pXG5zaGFyZWRDb25maWcubmV0MyA9IFIubWVyZ2Uoc2hhcmVkQ29uZmlnLm5ldDEsIHtcbiAgbmV0OiB7XG4gICAgY2hhbm5lbHM6IHtcbiAgICAgICd0ZXN0Jzoge1xuICAgICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4MydcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICdldmVudHMubGlzdGVuJzoge1xuICAgIHRlc3RFdmVudDoge1xuICAgICAgbWV0aG9kOiAndGVzdE5vUmVzcG9uc2UnXG4gICAgfVxuICB9XG59KVxuc2hhcmVkQ29uZmlnLm5ldDQgPSBSLm1lcmdlKHNoYXJlZENvbmZpZy5uZXQxLCB7XG4gIG5ldDoge1xuICAgIGNoYW5uZWxzOiB7XG4gICAgICAndGVzdCc6IHtcbiAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODQnXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAnZXZlbnRzLmxpc3Rlbic6IHtcbiAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgIG1ldGhvZDogJ3Rlc3RBa25vd2xlZ21lbnQnXG4gICAgfVxuICB9XG59KVxudmFyIG1ldGEgPSB7XG4gIGNvcnJpZDogJ3Rlc3RSZXF1ZXN0JyxcbiAgdXNlcmlkOiAndGVzdFVzZXInXG59XG5cbnZhciB0ZXN0Q2hlY2sgPSBmYWxzZVxudmFyIHN0cmVhbVxudmFyIE1ldGhvZHMgPSB7XG4gIHRlc3ROb1Jlc3BvbnNlOiBhc3luYyhkYXRhLCBtZXRhKSA9PiB7IENPTlNPTEUuZGVidWcoJ3Rlc3ROb1Jlc3BvbnNlJywge2RhdGEsIG1ldGF9KTsgdGVzdENoZWNrID0gZGF0YSB9LFxuICB0ZXN0QWtub3dsZWdtZW50OiBhc3luYyhkYXRhLCBtZXRhKSA9PiB7IHRlc3RDaGVjayA9IGRhdGEgfSxcbiAgdGVzdFJlc3BvbnNlOiBhc3luYyhkYXRhLCBtZXRhKSA9PiB7IHRlc3RDaGVjayA9IGRhdGE7IHJldHVybiBkYXRhIH0sXG4gIHRlc3RTdHJlYW06IChkYXRhLCBtZXRhLCBnZXRTdHJlYW0pID0+IHtcbiAgICBDT05TT0xFLmRlYnVnKCd0ZXN0U3RyZWFtJywge2RhdGEsIG1ldGEsIGdldFN0cmVhbX0pXG4gICAgdGVzdENoZWNrID0gZGF0YVxuICAgIHZhciBvbkNsb3NlID0gKCkgPT4geyBDT05TT0xFLmxvZygnc3RyZWFtIGNsb3NlZCcpIH1cbiAgICBzdHJlYW0gPSBnZXRTdHJlYW0ob25DbG9zZSwgMTIwMDAwKVxuICAgIHN0cmVhbS53cml0ZSh7dGVzdFN0cmVhbUNvbm5uZWN0ZWQ6IDF9KVxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLndyaXRlKHt0ZXN0U3RyZWFtRGF0YTogMX0pLCA1MDApXG4gICAgc2V0VGltZW91dCgoKSA9PiBzdHJlYW0uZW5kKCksIDEwMDApXG4gIH1cbn1cbnZhciBnZXRNZXRob2RzID0gKCkgPT4ge1xuICByZXR1cm4gTWV0aG9kc1xufVxuXG52YXIgZ2V0U2hhcmVkQ29uZmlnID0gYXN5bmMgKHNlcnZpY2UsIGNvbmZpZyA9ICdzZXJ2aWNlJywgZXhjbHVkZSwgYXNPYmopID0+IHtcbiAgaWYgKHNlcnZpY2UgPT09ICcqJykge1xuICAgIHZhciByZXN1bHRzID0ge31cbiAgICBmb3IgKHZhciBpIGluIHNoYXJlZENvbmZpZykge1xuICAgICAgaWYgKGkgIT09IGV4Y2x1ZGUpIHtcbiAgICAgICAgcmVzdWx0c1tpXSA9IHNoYXJlZENvbmZpZ1tpXVtjb25maWddXG4gICAgICAgIHJlc3VsdHNbaV0uc2VydmljZU5hbWUgPSBpXG4gICAgICB9XG4gICAgfVxuICAgIGlmICghYXNPYmopIHsgcmVzdWx0cyA9IE9iamVjdC52YWx1ZXMocmVzdWx0cykgfVxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cbiAgcmV0dXJuIHNoYXJlZENvbmZpZ1tzZXJ2aWNlXVtjb25maWddXG59XG52YXIgbmV0U2VydmVyMSA9IHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQxJywgc2VydmljZUlkOiAnbmV0MScsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZywgY29uZmlnOiBzaGFyZWRDb25maWcubmV0MS5uZXR9KVxudmFyIG5ldFNlcnZlcjIgPSByZXF1aXJlKCcuLi9uZXQuc2VydmVyJykoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lOiAnbmV0MicsIHNlcnZpY2VJZDogJ25ldDInLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGNvbmZpZzogc2hhcmVkQ29uZmlnLm5ldDIubmV0fSlcbnZhciBuZXRTZXJ2ZXIzID0gcmVxdWlyZSgnLi4vbmV0LnNlcnZlcicpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZTogJ25ldDMnLCBzZXJ2aWNlSWQ6ICduZXQzJywgZ2V0TWV0aG9kcywgZ2V0U2hhcmVkQ29uZmlnLCBjb25maWc6IHNoYXJlZENvbmZpZy5uZXQzLm5ldH0pXG52YXIgbmV0U2VydmVyNCA9IHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQ0Jywgc2VydmljZUlkOiAnbmV0NCcsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZywgY29uZmlnOiBzaGFyZWRDb25maWcubmV0NC5uZXR9KVxubmV0U2VydmVyMS5zdGFydCgpXG5uZXRTZXJ2ZXIyLnN0YXJ0KClcbm5ldFNlcnZlcjMuc3RhcnQoKVxubmV0U2VydmVyNC5zdGFydCgpXG5cbnZhciBuZXRDbGllbnQxID0gcmVxdWlyZSgnLi4vbmV0LmNsaWVudCcpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZTogJ25ldDEnLCBzZXJ2aWNlSWQ6ICduZXQxJywgZ2V0U2hhcmVkQ29uZmlnLCBjb25maWc6IHNoYXJlZENvbmZpZy5uZXQxLm5ldH0pXG5cbnQudGVzdCgnKioqIE5FVCAqKionLCB7XG4gIGF1dG9lbmQ6IHRydWVcbn0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIHQucGxhbig1KVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLnJwYyAtPiB0ZXN0Tm9SZXNwb25zZScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBuZXRDbGllbnQxLnJwYyh7dG86ICduZXQxJywgbWV0aG9kOiAndGVzdE5vUmVzcG9uc2UnLCBkYXRhOiB7J3Rlc3RfZGF0YSc6IDF9LCBtZXRhLCB0aW1lb3V0OiA1MDAwfSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIG51bGwsICdyZXNwb25zZT10cnVlIG9uIE5vUmVzcG9uc2UnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsndGVzdF9kYXRhJzogMX0sICd0ZXN0Tm9SZXNwb25zZSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLnJwYyAtPiB0ZXN0QWtub3dsZWdtZW50JywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG5ldENsaWVudDEucnBjKHt0bzogJ25ldDEnLCBtZXRob2Q6ICd0ZXN0QWtub3dsZWdtZW50JywgZGF0YTogeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSwgdGltZW91dDogNTAwMH0pXG4gICAgdC5zYW1lKHJlc3BvbnNlLCBudWxsLCAnQWtub3dsZWdtZW50IG9rJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdEFrbm93bGVnbWVudCByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgLy9cbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLnJwYyAtPiB0ZXN0UmVzcG9uc2UnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoe3RvOiAnbmV0MScsIG1ldGhvZDogJ3Rlc3RSZXNwb25zZScsIGRhdGE6IHsndGVzdF9kYXRhJzogMX0sIG1ldGEsIHRpbWVvdXQ6IDUwMDB9KVxuICAgIHQuc2FtZShyZXNwb25zZSwgeyd0ZXN0X2RhdGEnOiAxfSwgJ3Jlc3BvbnNlIGFzIHNlbmRlZCcpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgeyd0ZXN0X2RhdGEnOiAxfSwgJ3Rlc3RSZXNwb25zZSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLnJwYyAtPiB0ZXN0U3RyZWFtJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciB0ZXN0U3RyZWFtID0gZmFsc2VcbiAgICB2YXIgc3RyZWFtaW5nID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoe3RvOiAnbmV0MScsIG1ldGhvZDogJ3Rlc3RTdHJlYW0nLCBkYXRhOiB7J3Rlc3RfZGF0YSc6IDF9LCBtZXRhLCB0aW1lb3V0OiA1MDAwfSlcbiAgICBzdHJlYW1pbmcub24oJ2RhdGEnLCAoZGF0YSkgPT4geyBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgZGF0YScsIGRhdGEpOyB0ZXN0U3RyZWFtID0gdHJ1ZSB9KVxuICAgIHN0cmVhbWluZy5vbignZXJyb3InLCAoZGF0YSkgPT4gQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGVycm9yJywgZGF0YSkpXG4gICAgc3RyZWFtaW5nLm9uKCdlbmQnLCAoZGF0YSkgPT4gQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGNsb3NlJywgZGF0YSkpXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgICB0LnNhbWUodGVzdFN0cmVhbSwgdHJ1ZSwgJ1N0cmVhbSByZWNlaXZlZCcpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgeyd0ZXN0X2RhdGEnOiAxfSwgJ3Rlc3RTdHJlYW0gcmljaGllc3RhIHJpY2V2dXRhJylcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLmVtaXQgLT4gdGVzdEVtaXQnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5lbWl0KHtldmVudDogJ3Rlc3RFdmVudCcsIGRhdGE6IHsnZXZlbnRUZXN0X2RhdGEnOiAxfSwgbWV0YSwgdGltZW91dDogNTAwMCwgc2luZ2xlUmVzcG9uc2U6IHRydWV9KVxuICAgIHQuc2FtZShyZXNwb25zZSwgeydldmVudFRlc3RfZGF0YSc6IDF9LCAncmVzcG9uc2UgYXMgc2VuZGVkJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J2V2ZW50VGVzdF9kYXRhJzogMX0sICdkZWxheWVkIHJlY2VpdmVkJylcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIHQuZW5kKClcbiAgLy9wcm9jZXNzLmV4aXQoKVxufSkudGhlbigoKSA9PiBwcm9jZXNzLmV4aXQoKSlcbiJdfQ==