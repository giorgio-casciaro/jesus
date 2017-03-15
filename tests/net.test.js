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
          process.exit();

        case 17:
        case 'end':
          return _context10.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC50ZXN0LmVzNiJdLCJuYW1lcyI6WyJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsInJlcXVpcmUiLCJSIiwicmVxdWVzdCIsInQiLCJwYXRoIiwiamVzdXMiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwYWNrIiwiZXJyb3IiLCJkZWJ1ZyIsImxvZyIsIndhcm4iLCJDT05TT0xFIiwic2hhcmVkQ29uZmlnIiwidHJhbnNwb3J0cyIsInVybCIsInRlc3RFdmVudCIsIm1ldGhvZCIsInB1YmxpYyIsInJlc3BvbnNlVHlwZSIsInJlc3BvbnNlU2NoZW1hIiwicmVxdWVzdFNjaGVtYSIsIm5ldDIiLCJtZXJnZSIsIm5ldDEiLCJuZXQiLCJuZXQzIiwibmV0NCIsIm1ldGEiLCJjb3JyaWQiLCJ1c2VyaWQiLCJ0ZXN0Q2hlY2siLCJzdHJlYW0iLCJNZXRob2RzIiwidGVzdE5vUmVzcG9uc2UiLCJkYXRhIiwidGVzdEFrbm93bGVnbWVudCIsInRlc3RSZXNwb25zZSIsInRlc3RTdHJlYW0iLCJnZXRTdHJlYW0iLCJvbkNsb3NlIiwid3JpdGUiLCJ0ZXN0U3RyZWFtQ29ubm5lY3RlZCIsInNldFRpbWVvdXQiLCJ0ZXN0U3RyZWFtRGF0YSIsImVuZCIsImdldE1ldGhvZHMiLCJnZXRTaGFyZWRDb25maWciLCJzZXJ2aWNlIiwiY29uZmlnIiwiZXhjbHVkZSIsImFzT2JqIiwicmVzdWx0cyIsImkiLCJPYmplY3QiLCJ2YWx1ZXMiLCJuZXRTZXJ2ZXIxIiwibmV0U2VydmVyMiIsIm5ldFNlcnZlcjMiLCJuZXRTZXJ2ZXI0Iiwic3RhcnQiLCJuZXRDbGllbnQxIiwidGVzdCIsImF1dG9lbmQiLCJtYWluVGVzdCIsInBsYW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJwYyIsInRvIiwidGltZW91dCIsInJlc3BvbnNlIiwic2FtZSIsInN0cmVhbWluZyIsIm9uIiwiZW1pdCIsImV2ZW50Iiwic2luZ2xlUmVzcG9uc2UiLCJwcm9jZXNzIiwi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QUMsa0JBQWtCLENBQW5CLEVBQTNCLEVBQWtEUCxVQUFsRCxFQUF3RDBDLFNBQVMsSUFBakUsRUFBdUVPLGdCQUFnQixJQUF2RixFQUFoQixDQUZxQjs7QUFBQTtBQUV0Q04sNEJBRnNDOztBQUcxQ3RFLHNCQUFFdUUsSUFBRixDQUFPRCxRQUFQLEVBQWlCLEVBQUMsa0JBQWtCLENBQW5CLEVBQWpCLEVBQXdDLG9CQUF4QztBQUNBdEUsc0JBQUV1RSxJQUFGLENBQU96QyxTQUFQLEVBQWtCLEVBQUMsa0JBQWtCLENBQW5CLEVBQWxCLEVBQXlDLGtCQUF6QztBQUNBOUIsc0JBQUU0QyxHQUFGOztBQUwwQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUF0QyxDQXhDTDs7QUFBQTtBQUFBO0FBQUEsMENBZ0RLLElBQUlxQixPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLG1CQUFheEIsV0FBV3dCLE9BQVgsRUFBb0IsSUFBcEIsQ0FBYjtBQUFBLFdBQVosQ0FoREw7O0FBQUE7QUFpRERsRSxZQUFFNEMsR0FBRjtBQUNBaUMsa0JBQVFDLElBQVI7O0FBbERDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgiLCJmaWxlIjoibmV0LnRlc3QuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5pZiAoIWdsb2JhbC5fYmFiZWxQb2x5ZmlsbClyZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpXG52YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbi8vIHZhciBkZXJlZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWRlcmVmLXN5bmMnKVxuLy8gdmFyIGZha2VyID0gcmVxdWlyZSgnZmFrZXInKVxuLy8gdmFyIGpzZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWZha2VyJylcbi8vIGZha2VyLmxvY2FsZSA9ICdpdCdcbi8vIHZhciByZXN0bGVyID0gcmVxdWlyZSgncmVzdGxlcicpXG4vL1xudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0JylcbnZhciB0ID0gcmVxdWlyZSgndGFwJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4uL2plc3VzJylcblxuY29uc3QgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiBqZXN1cy5nZXRDb25zb2xlKHtlcnJvcjogdHJ1ZSwgZGVidWc6IHRydWUsIGxvZzogdHJ1ZSwgd2FybjogdHJ1ZX0sIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spXG52YXIgQ09OU09MRSA9IGdldENvbnNvbGUoJ0JBU0UgVEVTVCcsICctLS0tJywgJy0tLS0tJylcblxudmFyIHNoYXJlZENvbmZpZyA9IHtcbiAgJ25ldDEnOiB7XG4gICAgJ25ldCc6IHtcbiAgICAgIHRyYW5zcG9ydHM6IHtcbiAgICAgICAgJ3Rlc3QnOiB7XG4gICAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODAnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgICdldmVudHMuZW1pdCc6IHtcbiAgICAgIHRlc3RFdmVudDoge31cbiAgICB9LFxuICAgICdldmVudHMubGlzdGVuJzoge1xuICAgICAgdGVzdEV2ZW50OiB7XG4gICAgICAgIG1ldGhvZDogJ3Rlc3RSZXNwb25zZSdcbiAgICAgIH1cbiAgICB9LFxuICAgICdtZXRob2RzJzoge1xuICAgICAgJ3Rlc3ROb1Jlc3BvbnNlJzoge1xuICAgICAgICBwdWJsaWM6IHRydWUsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ25vUmVzcG9uc2UnLFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH0sXG4gICAgICAndGVzdEFrbm93bGVnbWVudCc6IHtcbiAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdha25vd2xlZ21lbnQnLFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH0sXG4gICAgICAndGVzdFJlc3BvbnNlJzoge1xuICAgICAgICBwdWJsaWM6IHRydWUsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ3Jlc3BvbnNlJyxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9LFxuICAgICAgJ3Rlc3RTdHJlYW0nOiB7XG4gICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnc3RyZWFtJyxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5zaGFyZWRDb25maWcubmV0MiA9IFIubWVyZ2Uoc2hhcmVkQ29uZmlnLm5ldDEsIHtcbiAgbmV0OiB7XG4gICAgdHJhbnNwb3J0czoge1xuICAgICAgJ3Rlc3QnOiB7XG4gICAgICAgIHVybDogJ2xvY2FsaG9zdDo4MDgyJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJ2V2ZW50cy5saXN0ZW4nOiB7XG4gICAgdGVzdEV2ZW50OiB7XG4gICAgICBtZXRob2Q6ICd0ZXN0UmVzcG9uc2UnXG4gICAgfVxuICB9XG59KVxuc2hhcmVkQ29uZmlnLm5ldDMgPSBSLm1lcmdlKHNoYXJlZENvbmZpZy5uZXQxLCB7XG4gIG5ldDoge1xuICAgIHRyYW5zcG9ydHM6IHtcbiAgICAgICd0ZXN0Jzoge1xuICAgICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4MydcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICdldmVudHMubGlzdGVuJzoge1xuICAgIHRlc3RFdmVudDoge1xuICAgICAgbWV0aG9kOiAndGVzdE5vUmVzcG9uc2UnXG4gICAgfVxuICB9XG59KVxuc2hhcmVkQ29uZmlnLm5ldDQgPSBSLm1lcmdlKHNoYXJlZENvbmZpZy5uZXQxLCB7XG4gIG5ldDoge1xuICAgIHRyYW5zcG9ydHM6IHtcbiAgICAgICd0ZXN0Jzoge1xuICAgICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4NCdcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICdldmVudHMubGlzdGVuJzoge1xuICAgIHRlc3RFdmVudDoge1xuICAgICAgbWV0aG9kOiAndGVzdEFrbm93bGVnbWVudCdcbiAgICB9XG4gIH1cbn0pXG52YXIgbWV0YSA9IHtcbiAgY29ycmlkOiAndGVzdFJlcXVlc3QnLFxuICB1c2VyaWQ6ICd0ZXN0VXNlcidcbn1cblxudmFyIHRlc3RDaGVjayA9IGZhbHNlXG52YXIgc3RyZWFtXG52YXIgTWV0aG9kcyA9IHtcbiAgdGVzdE5vUmVzcG9uc2U6IGFzeW5jKGRhdGEsIG1ldGEpID0+IHsgQ09OU09MRS5kZWJ1ZygndGVzdE5vUmVzcG9uc2UnLCB7ZGF0YSwgbWV0YX0pOyB0ZXN0Q2hlY2sgPSBkYXRhIH0sXG4gIHRlc3RBa25vd2xlZ21lbnQ6IGFzeW5jKGRhdGEsIG1ldGEpID0+IHsgdGVzdENoZWNrID0gZGF0YSB9LFxuICB0ZXN0UmVzcG9uc2U6IGFzeW5jKGRhdGEsIG1ldGEpID0+IHsgdGVzdENoZWNrID0gZGF0YTsgcmV0dXJuIGRhdGEgfSxcbiAgdGVzdFN0cmVhbTogKGRhdGEsIG1ldGEsIGdldFN0cmVhbSkgPT4ge1xuICAgIENPTlNPTEUuZGVidWcoJ3Rlc3RTdHJlYW0nLCB7ZGF0YSwgbWV0YSwgZ2V0U3RyZWFtfSlcbiAgICB0ZXN0Q2hlY2sgPSBkYXRhXG4gICAgdmFyIG9uQ2xvc2UgPSAoKSA9PiB7IENPTlNPTEUubG9nKCdzdHJlYW0gY2xvc2VkJykgfVxuICAgIHN0cmVhbSA9IGdldFN0cmVhbShvbkNsb3NlLCAxMjAwMDApXG4gICAgc3RyZWFtLndyaXRlKHt0ZXN0U3RyZWFtQ29ubm5lY3RlZDogMX0pXG4gICAgc2V0VGltZW91dCgoKSA9PiBzdHJlYW0ud3JpdGUoe3Rlc3RTdHJlYW1EYXRhOiAxfSksIDUwMClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHN0cmVhbS5lbmQoKSwgMTAwMClcbiAgfVxufVxudmFyIGdldE1ldGhvZHMgPSAoKSA9PiB7XG4gIHJldHVybiBNZXRob2RzXG59XG5cbnZhciBnZXRTaGFyZWRDb25maWcgPSBhc3luYyAoc2VydmljZSwgY29uZmlnID0gJ3NlcnZpY2UnLCBleGNsdWRlLCBhc09iaikgPT4ge1xuICBpZiAoc2VydmljZSA9PT0gJyonKSB7XG4gICAgdmFyIHJlc3VsdHMgPSB7fVxuICAgIGZvciAodmFyIGkgaW4gc2hhcmVkQ29uZmlnKSB7XG4gICAgICBpZiAoaSAhPT0gZXhjbHVkZSkge1xuICAgICAgICByZXN1bHRzW2ldID0gc2hhcmVkQ29uZmlnW2ldW2NvbmZpZ11cbiAgICAgICAgcmVzdWx0c1tpXS5zZXJ2aWNlTmFtZSA9IGlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFhc09iaikgeyByZXN1bHRzID0gT2JqZWN0LnZhbHVlcyhyZXN1bHRzKSB9XG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuICByZXR1cm4gc2hhcmVkQ29uZmlnW3NlcnZpY2VdW2NvbmZpZ11cbn1cbnZhciBuZXRTZXJ2ZXIxID0gcmVxdWlyZSgnLi4vbmV0LnNlcnZlcicpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZTogJ25ldDEnLCBzZXJ2aWNlSWQ6ICduZXQxJywgZ2V0TWV0aG9kcywgZ2V0U2hhcmVkQ29uZmlnLCBjb25maWc6IHNoYXJlZENvbmZpZy5uZXQxLm5ldH0pXG52YXIgbmV0U2VydmVyMiA9IHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQyJywgc2VydmljZUlkOiAnbmV0MicsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZywgY29uZmlnOiBzaGFyZWRDb25maWcubmV0Mi5uZXR9KVxudmFyIG5ldFNlcnZlcjMgPSByZXF1aXJlKCcuLi9uZXQuc2VydmVyJykoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lOiAnbmV0MycsIHNlcnZpY2VJZDogJ25ldDMnLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGNvbmZpZzogc2hhcmVkQ29uZmlnLm5ldDMubmV0fSlcbnZhciBuZXRTZXJ2ZXI0ID0gcmVxdWlyZSgnLi4vbmV0LnNlcnZlcicpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZTogJ25ldDQnLCBzZXJ2aWNlSWQ6ICduZXQ0JywgZ2V0TWV0aG9kcywgZ2V0U2hhcmVkQ29uZmlnLCBjb25maWc6IHNoYXJlZENvbmZpZy5uZXQ0Lm5ldH0pXG5uZXRTZXJ2ZXIxLnN0YXJ0KClcbm5ldFNlcnZlcjIuc3RhcnQoKVxubmV0U2VydmVyMy5zdGFydCgpXG5uZXRTZXJ2ZXI0LnN0YXJ0KClcblxudmFyIG5ldENsaWVudDEgPSByZXF1aXJlKCcuLi9uZXQuY2xpZW50Jykoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lOiAnbmV0MScsIHNlcnZpY2VJZDogJ25ldDEnLCBnZXRTaGFyZWRDb25maWcsIGNvbmZpZzogc2hhcmVkQ29uZmlnLm5ldDEubmV0fSlcblxudC50ZXN0KCcqKiogTkVUICoqKicsIHtcbiAgYXV0b2VuZDogdHJ1ZVxufSwgYXN5bmMgZnVuY3Rpb24gbWFpblRlc3QgKHQpIHtcbiAgdC5wbGFuKDUpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3ROb1Jlc3BvbnNlJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG5ldENsaWVudDEucnBjKHt0bzogJ25ldDEnLCBtZXRob2Q6ICd0ZXN0Tm9SZXNwb25zZScsIGRhdGE6IHsndGVzdF9kYXRhJzogMX0sIG1ldGEsIHRpbWVvdXQ6IDUwMDB9KVxuICAgIHQuc2FtZShyZXNwb25zZSwgbnVsbCwgJ3Jlc3BvbnNlPXRydWUgb24gTm9SZXNwb25zZScpXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgeyd0ZXN0X2RhdGEnOiAxfSwgJ3Rlc3ROb1Jlc3BvbnNlIHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3RBa25vd2xlZ21lbnQnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoe3RvOiAnbmV0MScsIG1ldGhvZDogJ3Rlc3RBa25vd2xlZ21lbnQnLCBkYXRhOiB7J3Rlc3RfZGF0YSc6IDF9LCBtZXRhLCB0aW1lb3V0OiA1MDAwfSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIG51bGwsICdBa25vd2xlZ21lbnQgb2snKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsndGVzdF9kYXRhJzogMX0sICd0ZXN0QWtub3dsZWdtZW50IHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuICAvL1xuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3RSZXNwb25zZScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBuZXRDbGllbnQxLnJwYyh7dG86ICduZXQxJywgbWV0aG9kOiAndGVzdFJlc3BvbnNlJywgZGF0YTogeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSwgdGltZW91dDogNTAwMH0pXG4gICAgdC5zYW1lKHJlc3BvbnNlLCB7J3Rlc3RfZGF0YSc6IDF9LCAncmVzcG9uc2UgYXMgc2VuZGVkJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdFJlc3BvbnNlIHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3RTdHJlYW0nLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHRlc3RTdHJlYW0gPSBmYWxzZVxuICAgIHZhciBzdHJlYW1pbmcgPSBhd2FpdCBuZXRDbGllbnQxLnJwYyh7dG86ICduZXQxJywgbWV0aG9kOiAndGVzdFN0cmVhbScsIGRhdGE6IHsndGVzdF9kYXRhJzogMX0sIG1ldGEsIHRpbWVvdXQ6IDUwMDB9KVxuICAgIHN0cmVhbWluZy5vbignZGF0YScsIChkYXRhKSA9PiB7IENPTlNPTEUuZGVidWcoJ3N0cmVhbWluZyBkYXRhJywgZGF0YSk7IHRlc3RTdHJlYW0gPSB0cnVlIH0pXG4gICAgc3RyZWFtaW5nLm9uKCdlcnJvcicsIChkYXRhKSA9PiBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgZXJyb3InLCBkYXRhKSlcbiAgICBzdHJlYW1pbmcub24oJ2VuZCcsIChkYXRhKSA9PiBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgY2xvc2UnLCBkYXRhKSlcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICAgIHQuc2FtZSh0ZXN0U3RyZWFtLCB0cnVlLCAnU3RyZWFtIHJlY2VpdmVkJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdFN0cmVhbSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEuZW1pdCAtPiB0ZXN0RW1pdCcsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBuZXRDbGllbnQxLmVtaXQoe2V2ZW50OiAndGVzdEV2ZW50JywgZGF0YTogeydldmVudFRlc3RfZGF0YSc6IDF9LCBtZXRhLCB0aW1lb3V0OiA1MDAwLCBzaW5nbGVSZXNwb25zZTogdHJ1ZX0pXG4gICAgdC5zYW1lKHJlc3BvbnNlLCB7J2V2ZW50VGVzdF9kYXRhJzogMX0sICdyZXNwb25zZSBhcyBzZW5kZWQnKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsnZXZlbnRUZXN0X2RhdGEnOiAxfSwgJ2RlbGF5ZWQgcmVjZWl2ZWQnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgdC5lbmQoKVxuICBwcm9jZXNzLmV4aXQoKVxufSlcbiJdfQ==