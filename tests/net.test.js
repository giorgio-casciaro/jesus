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
    'eventsOut': {
      testEvent: {}
    },
    'eventsIn': {
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

var getMethods = function getMethods(service, exclude) {
  return Methods;
};

var getSharedConfig = function getSharedConfig() {
  var field = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';
  var exclude = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var subfield = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'net';

  if (field === '*') return Object.keys(sharedConfig).filter(function (key) {
    return key !== exclude;
  }).map(function (key) {
    return { items: sharedConfig[key][subfield], service: key };
  });else return sharedConfig[field][subfield];
};
var getMethodsConfig = function _callee(service, exclude) {
  return regeneratorRuntime.async(function _callee$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt('return', getSharedConfig(service, exclude, 'methods'));

        case 1:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, undefined);
};
var getNetConfig = function _callee2(service, exclude) {
  return regeneratorRuntime.async(function _callee2$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt('return', getSharedConfig(service, exclude, 'net'));

        case 1:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, undefined);
};
var getEventsIn = function _callee3(service, exclude) {
  return regeneratorRuntime.async(function _callee3$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt('return', getSharedConfig(service, exclude, 'eventsIn'));

        case 1:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, undefined);
};
var getEventsOut = function _callee4(service, exclude) {
  return regeneratorRuntime.async(function _callee4$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          return _context7.abrupt('return', getSharedConfig(service, exclude, 'eventsOut'));

        case 1:
        case 'end':
          return _context7.stop();
      }
    }
  }, null, undefined);
};

var netServer1 = require('../net.server')({ getConsole: getConsole, serviceName: 'net1', serviceId: 'net1', getMethods: getMethods, getMethodsConfig: getMethodsConfig, getNetConfig: getNetConfig });
var netServer2 = require('../net.server')({ getConsole: getConsole, serviceName: 'net2', serviceId: 'net2', getMethods: getMethods, getMethodsConfig: getMethodsConfig, getNetConfig: getNetConfig });
var netServer3 = require('../net.server')({ getConsole: getConsole, serviceName: 'net3', serviceId: 'net3', getMethods: getMethods, getMethodsConfig: getMethodsConfig, getNetConfig: getNetConfig });
var netServer4 = require('../net.server')({ getConsole: getConsole, serviceName: 'net4', serviceId: 'net4', getMethods: getMethods, getMethodsConfig: getMethodsConfig, getNetConfig: getNetConfig });
netServer1.start();
netServer2.start();
netServer3.start();
netServer4.start();

var netClient1 = require('../net.client')({ getConsole: getConsole, serviceName: 'net1', serviceId: 'net1', getNetConfig: getNetConfig, getEventsIn: getEventsIn, getMethodsConfig: getMethodsConfig });

t.test('*** NET ***', {
  autoend: true
}, function mainTest(t) {
  return regeneratorRuntime.async(function mainTest$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          t.plan(5);
          _context13.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 3:
          _context13.next = 5;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testNoResponse', function _callee5(t) {
            var response;
            return regeneratorRuntime.async(function _callee5$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    testCheck = false;
                    _context8.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testNoResponse', data: { 'test_data': 1 }, meta: meta, timeout: 5000 }));

                  case 3:
                    response = _context8.sent;

                    t.same(response, null, 'response=true on NoResponse');
                    _context8.next = 7;
                    return regeneratorRuntime.awrap(new Promise(function (resolve) {
                      return setTimeout(resolve, 1000);
                    }));

                  case 7:
                    t.same(testCheck, { 'test_data': 1 }, 'testNoResponse richiesta ricevuta');
                    t.end();

                  case 9:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, null, this);
          }));

        case 5:
          _context13.next = 7;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testAknowlegment', function _callee6(t) {
            var response;
            return regeneratorRuntime.async(function _callee6$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    testCheck = false;
                    _context9.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testAknowlegment', data: { 'test_data': 1 }, meta: meta, timeout: 5000 }));

                  case 3:
                    response = _context9.sent;

                    t.same(response, null, 'Aknowlegment ok');
                    t.same(testCheck, { 'test_data': 1 }, 'testAknowlegment richiesta ricevuta');
                    t.end();

                  case 7:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, null, this);
          }));

        case 7:
          _context13.next = 9;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testResponse', function _callee7(t) {
            var response;
            return regeneratorRuntime.async(function _callee7$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    testCheck = false;
                    _context10.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testResponse', data: { 'test_data': 1 }, meta: meta, timeout: 5000 }));

                  case 3:
                    response = _context10.sent;

                    t.same(response, { 'test_data': 1 }, 'response as sended');
                    t.same(testCheck, { 'test_data': 1 }, 'testResponse richiesta ricevuta');
                    t.end();

                  case 7:
                  case 'end':
                    return _context10.stop();
                }
              }
            }, null, this);
          }));

        case 9:
          _context13.next = 11;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testStream', function _callee8(t) {
            var testStream, streaming;
            return regeneratorRuntime.async(function _callee8$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    testCheck = false;
                    testStream = false;
                    _context11.next = 4;
                    return regeneratorRuntime.awrap(netClient1.rpc({ to: 'net1', method: 'testStream', data: { 'test_data': 1 }, meta: meta, timeout: 5000 }));

                  case 4:
                    streaming = _context11.sent;

                    streaming.on('data', function (data) {
                      CONSOLE.debug('streaming data', data);testStream = true;
                    });
                    streaming.on('error', function (data) {
                      return CONSOLE.debug('streaming error', data);
                    });
                    streaming.on('end', function (data) {
                      return CONSOLE.debug('streaming close', data);
                    });

                    _context11.next = 10;
                    return regeneratorRuntime.awrap(new Promise(function (resolve) {
                      return setTimeout(resolve, 1000);
                    }));

                  case 10:
                    t.same(testStream, true, 'Stream received');
                    t.same(testCheck, { 'test_data': 1 }, 'testStream richiesta ricevuta');
                    t.end();

                  case 13:
                  case 'end':
                    return _context11.stop();
                }
              }
            }, null, this);
          }));

        case 11:
          _context13.next = 13;
          return regeneratorRuntime.awrap(t.test('netClient1.emit -> testEmit', function _callee9(t) {
            var response;
            return regeneratorRuntime.async(function _callee9$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    testCheck = false;
                    _context12.next = 3;
                    return regeneratorRuntime.awrap(netClient1.emit({ event: 'testEvent', data: { 'eventTest_data': 1 }, meta: meta, timeout: 5000, singleResponse: true }));

                  case 3:
                    response = _context12.sent;

                    t.same(response, { 'eventTest_data': 1 }, 'response as sended');
                    t.same(testCheck, { 'eventTest_data': 1 }, 'delayed received');
                    t.end();

                  case 7:
                  case 'end':
                    return _context12.stop();
                }
              }
            }, null, this);
          }));

        case 13:
          _context13.next = 15;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 15:
          t.end();
          // process.exit()

        case 16:
        case 'end':
          return _context13.stop();
      }
    }
  }, null, this);
}).then(function () {
  return process.exit();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC50ZXN0LmVzNiJdLCJuYW1lcyI6WyJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsInJlcXVpcmUiLCJSIiwicmVxdWVzdCIsInQiLCJwYXRoIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsImVycm9yIiwiZGVidWciLCJsb2ciLCJ3YXJuIiwiQ09OU09MRSIsInNoYXJlZENvbmZpZyIsImNoYW5uZWxzIiwidXJsIiwidGVzdEV2ZW50IiwibWV0aG9kIiwicHVibGljIiwicmVzcG9uc2VUeXBlIiwicmVzcG9uc2VTY2hlbWEiLCJyZXF1ZXN0U2NoZW1hIiwibmV0MiIsIm1lcmdlIiwibmV0MSIsIm5ldCIsIm5ldDMiLCJuZXQ0IiwibWV0YSIsImNvcnJpZCIsInVzZXJpZCIsInRlc3RDaGVjayIsInN0cmVhbSIsIk1ldGhvZHMiLCJ0ZXN0Tm9SZXNwb25zZSIsImRhdGEiLCJ0ZXN0QWtub3dsZWdtZW50IiwidGVzdFJlc3BvbnNlIiwidGVzdFN0cmVhbSIsImdldFN0cmVhbSIsIm9uQ2xvc2UiLCJ3cml0ZSIsInRlc3RTdHJlYW1Db25ubmVjdGVkIiwic2V0VGltZW91dCIsInRlc3RTdHJlYW1EYXRhIiwiZW5kIiwiZ2V0TWV0aG9kcyIsInNlcnZpY2UiLCJleGNsdWRlIiwiZ2V0U2hhcmVkQ29uZmlnIiwiZmllbGQiLCJzdWJmaWVsZCIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJrZXkiLCJtYXAiLCJpdGVtcyIsImdldE1ldGhvZHNDb25maWciLCJnZXROZXRDb25maWciLCJnZXRFdmVudHNJbiIsImdldEV2ZW50c091dCIsIm5ldFNlcnZlcjEiLCJuZXRTZXJ2ZXIyIiwibmV0U2VydmVyMyIsIm5ldFNlcnZlcjQiLCJzdGFydCIsIm5ldENsaWVudDEiLCJ0ZXN0IiwiYXV0b2VuZCIsIm1haW5UZXN0IiwicGxhbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicnBjIiwidG8iLCJ0aW1lb3V0IiwicmVzcG9uc2UiLCJzYW1lIiwic3RyZWFtaW5nIiwib24iLCJlbWl0IiwiZXZlbnQiLCJzaW5nbGVSZXNwb25zZSIsInRoZW4iLCJwcm9jZXNzIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLENBQUNBLE9BQU9DLGNBQVosRUFBMkJDLFFBQVEsZ0JBQVI7QUFDM0IsSUFBSUMsSUFBSUQsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJRSxVQUFVRixRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlHLElBQUlILFFBQVEsS0FBUixDQUFSO0FBQ0EsSUFBSUksT0FBT0osUUFBUSxNQUFSLENBQVg7O0FBRUEsSUFBTUssYUFBYSxTQUFiQSxVQUFhLENBQUNDLFdBQUQsRUFBY0MsU0FBZCxFQUF5QkMsSUFBekI7QUFBQSxTQUFrQ1IsUUFBUSxVQUFSLEVBQW9CSyxVQUFwQixDQUErQixFQUFDSSxPQUFPLElBQVIsRUFBY0MsT0FBTyxJQUFyQixFQUEyQkMsS0FBSyxLQUFoQyxFQUF1Q0MsTUFBTSxJQUE3QyxFQUEvQixFQUFtRk4sV0FBbkYsRUFBZ0dDLFNBQWhHLEVBQTJHQyxJQUEzRyxDQUFsQztBQUFBLENBQW5CO0FBQ0EsSUFBSUssVUFBVVIsV0FBVyxXQUFYLEVBQXdCLE1BQXhCLEVBQWdDLE9BQWhDLENBQWQ7O0FBRUEsSUFBSVMsZUFBZTtBQUNqQixVQUFRO0FBQ04sV0FBTztBQUNMQyxnQkFBVTtBQUNSLGdCQUFRO0FBQ05DLGVBQUs7QUFEQztBQURBO0FBREwsS0FERDtBQVFOLGlCQUFhO0FBQ1hDLGlCQUFXO0FBREEsS0FSUDtBQVdOLGdCQUFZO0FBQ1ZBLGlCQUFXO0FBQ1RDLGdCQUFRO0FBREM7QUFERCxLQVhOO0FBZ0JOLGVBQVc7QUFDVCx3QkFBa0I7QUFDaEJDLGdCQUFRLElBRFE7QUFFaEJDLHNCQUFjLFlBRkU7QUFHaEJDLHdCQUFnQixFQUFDLFFBQVEsUUFBVCxFQUhBO0FBSWhCQyx1QkFBZSxFQUFDLFFBQVEsUUFBVDtBQUpDLE9BRFQ7QUFPVCwwQkFBb0I7QUFDbEJILGdCQUFRLElBRFU7QUFF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QUFaLENBaERMOztBQUFBO0FBaUREdkUsWUFBRTJDLEdBQUY7QUFDQTs7QUFsREM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FGSCxFQXFER3VDLElBckRILENBcURRO0FBQUEsU0FBTUMsUUFBUUMsSUFBUixFQUFOO0FBQUEsQ0FyRFIiLCJmaWxlIjoibmV0LnRlc3QuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5pZiAoIWdsb2JhbC5fYmFiZWxQb2x5ZmlsbClyZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpXG52YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpXG52YXIgdCA9IHJlcXVpcmUoJ3RhcCcpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IHJlcXVpcmUoJy4uL3V0aWxzJykuZ2V0Q29uc29sZSh7ZXJyb3I6IHRydWUsIGRlYnVnOiB0cnVlLCBsb2c6IGZhbHNlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbnZhciBDT05TT0xFID0gZ2V0Q29uc29sZSgnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxuXG52YXIgc2hhcmVkQ29uZmlnID0ge1xuICAnbmV0MSc6IHtcbiAgICAnbmV0Jzoge1xuICAgICAgY2hhbm5lbHM6IHtcbiAgICAgICAgJ3Rlc3QnOiB7XG4gICAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODAnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgICdldmVudHNPdXQnOiB7XG4gICAgICB0ZXN0RXZlbnQ6IHt9XG4gICAgfSxcbiAgICAnZXZlbnRzSW4nOiB7XG4gICAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgICAgbWV0aG9kOiAndGVzdFJlc3BvbnNlJ1xuICAgICAgfVxuICAgIH0sXG4gICAgJ21ldGhvZHMnOiB7XG4gICAgICAndGVzdE5vUmVzcG9uc2UnOiB7XG4gICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnbm9SZXNwb25zZScsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0QWtub3dsZWdtZW50Jzoge1xuICAgICAgICBwdWJsaWM6IHRydWUsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2Frbm93bGVnbWVudCcsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0UmVzcG9uc2UnOiB7XG4gICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAncmVzcG9uc2UnLFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH0sXG4gICAgICAndGVzdFN0cmVhbSc6IHtcbiAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdzdHJlYW0nLFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbnNoYXJlZENvbmZpZy5uZXQyID0gUi5tZXJnZShzaGFyZWRDb25maWcubmV0MSwge1xuICBuZXQ6IHtcbiAgICBjaGFubmVsczoge1xuICAgICAgJ3Rlc3QnOiB7XG4gICAgICAgIHVybDogJ2xvY2FsaG9zdDo4MDgyJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJ2V2ZW50cy5saXN0ZW4nOiB7XG4gICAgdGVzdEV2ZW50OiB7XG4gICAgICBtZXRob2Q6ICd0ZXN0UmVzcG9uc2UnXG4gICAgfVxuICB9XG59KVxuc2hhcmVkQ29uZmlnLm5ldDMgPSBSLm1lcmdlKHNoYXJlZENvbmZpZy5uZXQxLCB7XG4gIG5ldDoge1xuICAgIGNoYW5uZWxzOiB7XG4gICAgICAndGVzdCc6IHtcbiAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODMnXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAnZXZlbnRzLmxpc3Rlbic6IHtcbiAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgIG1ldGhvZDogJ3Rlc3ROb1Jlc3BvbnNlJ1xuICAgIH1cbiAgfVxufSlcbnNoYXJlZENvbmZpZy5uZXQ0ID0gUi5tZXJnZShzaGFyZWRDb25maWcubmV0MSwge1xuICBuZXQ6IHtcbiAgICBjaGFubmVsczoge1xuICAgICAgJ3Rlc3QnOiB7XG4gICAgICAgIHVybDogJ2xvY2FsaG9zdDo4MDg0J1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJ2V2ZW50cy5saXN0ZW4nOiB7XG4gICAgdGVzdEV2ZW50OiB7XG4gICAgICBtZXRob2Q6ICd0ZXN0QWtub3dsZWdtZW50J1xuICAgIH1cbiAgfVxufSlcbnZhciBtZXRhID0ge1xuICBjb3JyaWQ6ICd0ZXN0UmVxdWVzdCcsXG4gIHVzZXJpZDogJ3Rlc3RVc2VyJ1xufVxuXG52YXIgdGVzdENoZWNrID0gZmFsc2VcbnZhciBzdHJlYW1cbnZhciBNZXRob2RzID0ge1xuICB0ZXN0Tm9SZXNwb25zZTogYXN5bmMoZGF0YSwgbWV0YSkgPT4geyBDT05TT0xFLmRlYnVnKCd0ZXN0Tm9SZXNwb25zZScsIHtkYXRhLCBtZXRhfSk7IHRlc3RDaGVjayA9IGRhdGEgfSxcbiAgdGVzdEFrbm93bGVnbWVudDogYXN5bmMoZGF0YSwgbWV0YSkgPT4geyB0ZXN0Q2hlY2sgPSBkYXRhIH0sXG4gIHRlc3RSZXNwb25zZTogYXN5bmMoZGF0YSwgbWV0YSkgPT4geyB0ZXN0Q2hlY2sgPSBkYXRhOyByZXR1cm4gZGF0YSB9LFxuICB0ZXN0U3RyZWFtOiAoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtKSA9PiB7XG4gICAgQ09OU09MRS5kZWJ1ZygndGVzdFN0cmVhbScsIHtkYXRhLCBtZXRhLCBnZXRTdHJlYW19KVxuICAgIHRlc3RDaGVjayA9IGRhdGFcbiAgICB2YXIgb25DbG9zZSA9ICgpID0+IHsgQ09OU09MRS5sb2coJ3N0cmVhbSBjbG9zZWQnKSB9XG4gICAgc3RyZWFtID0gZ2V0U3RyZWFtKG9uQ2xvc2UsIDEyMDAwMClcbiAgICBzdHJlYW0ud3JpdGUoe3Rlc3RTdHJlYW1Db25ubmVjdGVkOiAxfSlcbiAgICBzZXRUaW1lb3V0KCgpID0+IHN0cmVhbS53cml0ZSh7dGVzdFN0cmVhbURhdGE6IDF9KSwgNTAwKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLmVuZCgpLCAxMDAwKVxuICB9XG59XG5cbnZhciBnZXRNZXRob2RzID0gKHNlcnZpY2UsIGV4Y2x1ZGUpID0+IE1ldGhvZHNcblxudmFyIGdldFNoYXJlZENvbmZpZyA9IChmaWVsZCA9ICcqJywgZXhjbHVkZSA9ICcnLCBzdWJmaWVsZCA9ICduZXQnKSA9PiB7XG4gIGlmIChmaWVsZCA9PT0gJyonKSByZXR1cm4gT2JqZWN0LmtleXMoc2hhcmVkQ29uZmlnKS5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBleGNsdWRlKS5tYXAoKGtleSkgPT4geyByZXR1cm4ge2l0ZW1zOiBzaGFyZWRDb25maWdba2V5XVtzdWJmaWVsZF0sIHNlcnZpY2U6IGtleX0gfSlcbiAgZWxzZSByZXR1cm4gc2hhcmVkQ29uZmlnW2ZpZWxkXVtzdWJmaWVsZF1cbn1cbnZhciBnZXRNZXRob2RzQ29uZmlnID0gYXN5bmMgKHNlcnZpY2UsIGV4Y2x1ZGUpID0+IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlLCBleGNsdWRlLCAnbWV0aG9kcycpXG52YXIgZ2V0TmV0Q29uZmlnID0gYXN5bmMgKHNlcnZpY2UsIGV4Y2x1ZGUpID0+IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlLCBleGNsdWRlLCAnbmV0JylcbnZhciBnZXRFdmVudHNJbiA9IGFzeW5jIChzZXJ2aWNlLCBleGNsdWRlKSA9PiBnZXRTaGFyZWRDb25maWcoc2VydmljZSwgZXhjbHVkZSwgJ2V2ZW50c0luJylcbnZhciBnZXRFdmVudHNPdXQgPSBhc3luYyAoc2VydmljZSwgZXhjbHVkZSkgPT4gZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2UsIGV4Y2x1ZGUsICdldmVudHNPdXQnKVxuXG52YXIgbmV0U2VydmVyMSA9IHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQxJywgc2VydmljZUlkOiAnbmV0MScsIGdldE1ldGhvZHMsIGdldE1ldGhvZHNDb25maWcsIGdldE5ldENvbmZpZ30pXG52YXIgbmV0U2VydmVyMiA9IHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQyJywgc2VydmljZUlkOiAnbmV0MicsIGdldE1ldGhvZHMsIGdldE1ldGhvZHNDb25maWcsIGdldE5ldENvbmZpZ30pXG52YXIgbmV0U2VydmVyMyA9IHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQzJywgc2VydmljZUlkOiAnbmV0MycsIGdldE1ldGhvZHMsIGdldE1ldGhvZHNDb25maWcsIGdldE5ldENvbmZpZ30pXG52YXIgbmV0U2VydmVyNCA9IHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQ0Jywgc2VydmljZUlkOiAnbmV0NCcsIGdldE1ldGhvZHMsIGdldE1ldGhvZHNDb25maWcsIGdldE5ldENvbmZpZ30pXG5uZXRTZXJ2ZXIxLnN0YXJ0KClcbm5ldFNlcnZlcjIuc3RhcnQoKVxubmV0U2VydmVyMy5zdGFydCgpXG5uZXRTZXJ2ZXI0LnN0YXJ0KClcblxudmFyIG5ldENsaWVudDEgPSByZXF1aXJlKCcuLi9uZXQuY2xpZW50Jykoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lOiAnbmV0MScsIHNlcnZpY2VJZDogJ25ldDEnLCBnZXROZXRDb25maWcsIGdldEV2ZW50c0luLCBnZXRNZXRob2RzQ29uZmlnfSlcblxudC50ZXN0KCcqKiogTkVUICoqKicsIHtcbiAgYXV0b2VuZDogdHJ1ZVxufSwgYXN5bmMgZnVuY3Rpb24gbWFpblRlc3QgKHQpIHtcbiAgdC5wbGFuKDUpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3ROb1Jlc3BvbnNlJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG5ldENsaWVudDEucnBjKHt0bzogJ25ldDEnLCBtZXRob2Q6ICd0ZXN0Tm9SZXNwb25zZScsIGRhdGE6IHsndGVzdF9kYXRhJzogMX0sIG1ldGEsIHRpbWVvdXQ6IDUwMDB9KVxuICAgIHQuc2FtZShyZXNwb25zZSwgbnVsbCwgJ3Jlc3BvbnNlPXRydWUgb24gTm9SZXNwb25zZScpXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgeyd0ZXN0X2RhdGEnOiAxfSwgJ3Rlc3ROb1Jlc3BvbnNlIHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3RBa25vd2xlZ21lbnQnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoe3RvOiAnbmV0MScsIG1ldGhvZDogJ3Rlc3RBa25vd2xlZ21lbnQnLCBkYXRhOiB7J3Rlc3RfZGF0YSc6IDF9LCBtZXRhLCB0aW1lb3V0OiA1MDAwfSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIG51bGwsICdBa25vd2xlZ21lbnQgb2snKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsndGVzdF9kYXRhJzogMX0sICd0ZXN0QWtub3dsZWdtZW50IHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuICAvL1xuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3RSZXNwb25zZScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBuZXRDbGllbnQxLnJwYyh7dG86ICduZXQxJywgbWV0aG9kOiAndGVzdFJlc3BvbnNlJywgZGF0YTogeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSwgdGltZW91dDogNTAwMH0pXG4gICAgdC5zYW1lKHJlc3BvbnNlLCB7J3Rlc3RfZGF0YSc6IDF9LCAncmVzcG9uc2UgYXMgc2VuZGVkJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdFJlc3BvbnNlIHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3RTdHJlYW0nLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHRlc3RTdHJlYW0gPSBmYWxzZVxuICAgIHZhciBzdHJlYW1pbmcgPSBhd2FpdCBuZXRDbGllbnQxLnJwYyh7dG86ICduZXQxJywgbWV0aG9kOiAndGVzdFN0cmVhbScsIGRhdGE6IHsndGVzdF9kYXRhJzogMX0sIG1ldGEsIHRpbWVvdXQ6IDUwMDB9KVxuICAgIHN0cmVhbWluZy5vbignZGF0YScsIChkYXRhKSA9PiB7IENPTlNPTEUuZGVidWcoJ3N0cmVhbWluZyBkYXRhJywgZGF0YSk7IHRlc3RTdHJlYW0gPSB0cnVlIH0pXG4gICAgc3RyZWFtaW5nLm9uKCdlcnJvcicsIChkYXRhKSA9PiBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgZXJyb3InLCBkYXRhKSlcbiAgICBzdHJlYW1pbmcub24oJ2VuZCcsIChkYXRhKSA9PiBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgY2xvc2UnLCBkYXRhKSlcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICAgIHQuc2FtZSh0ZXN0U3RyZWFtLCB0cnVlLCAnU3RyZWFtIHJlY2VpdmVkJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdFN0cmVhbSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEuZW1pdCAtPiB0ZXN0RW1pdCcsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBuZXRDbGllbnQxLmVtaXQoe2V2ZW50OiAndGVzdEV2ZW50JywgZGF0YTogeydldmVudFRlc3RfZGF0YSc6IDF9LCBtZXRhLCB0aW1lb3V0OiA1MDAwLCBzaW5nbGVSZXNwb25zZTogdHJ1ZX0pXG4gICAgdC5zYW1lKHJlc3BvbnNlLCB7J2V2ZW50VGVzdF9kYXRhJzogMX0sICdyZXNwb25zZSBhcyBzZW5kZWQnKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsnZXZlbnRUZXN0X2RhdGEnOiAxfSwgJ2RlbGF5ZWQgcmVjZWl2ZWQnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgdC5lbmQoKVxuICAvLyBwcm9jZXNzLmV4aXQoKVxufSkudGhlbigoKSA9PiBwcm9jZXNzLmV4aXQoKSlcbiJdfQ==