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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC50ZXN0LmVzNiJdLCJuYW1lcyI6WyJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsInJlcXVpcmUiLCJSIiwicmVxdWVzdCIsInQiLCJwYXRoIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsImVycm9yIiwiZGVidWciLCJsb2ciLCJ3YXJuIiwiQ09OU09MRSIsInNoYXJlZENvbmZpZyIsInRyYW5zcG9ydHMiLCJ1cmwiLCJ0ZXN0RXZlbnQiLCJtZXRob2QiLCJwdWJsaWMiLCJyZXNwb25zZVR5cGUiLCJyZXNwb25zZVNjaGVtYSIsInJlcXVlc3RTY2hlbWEiLCJuZXQyIiwibWVyZ2UiLCJuZXQxIiwibmV0IiwibmV0MyIsIm5ldDQiLCJtZXRhIiwiY29ycmlkIiwidXNlcmlkIiwidGVzdENoZWNrIiwic3RyZWFtIiwiTWV0aG9kcyIsInRlc3ROb1Jlc3BvbnNlIiwiZGF0YSIsInRlc3RBa25vd2xlZ21lbnQiLCJ0ZXN0UmVzcG9uc2UiLCJ0ZXN0U3RyZWFtIiwiZ2V0U3RyZWFtIiwib25DbG9zZSIsIndyaXRlIiwidGVzdFN0cmVhbUNvbm5uZWN0ZWQiLCJzZXRUaW1lb3V0IiwidGVzdFN0cmVhbURhdGEiLCJlbmQiLCJnZXRNZXRob2RzIiwiZ2V0U2hhcmVkQ29uZmlnIiwic2VydmljZSIsImNvbmZpZyIsImV4Y2x1ZGUiLCJhc09iaiIsInJlc3VsdHMiLCJpIiwiT2JqZWN0IiwidmFsdWVzIiwibmV0U2VydmVyMSIsIm5ldFNlcnZlcjIiLCJuZXRTZXJ2ZXIzIiwibmV0U2VydmVyNCIsInN0YXJ0IiwibmV0Q2xpZW50MSIsInRlc3QiLCJhdXRvZW5kIiwibWFpblRlc3QiLCJwbGFuIiwiUHJvbWlzZSIsInJlc29sdmUiLCJycGMiLCJ0byIsInRpbWVvdXQiLCJyZXNwb25zZSIsInNhbWUiLCJzdHJlYW1pbmciLCJvbiIsImVtaXQiLCJldmVudCIsInNpbmdsZVJlc3BvbnNlIiwidGhlbiIsInByb2Nlc3MiLCJleGl0Il0sIm1hcHBpbmdzIjoiOztBQUNBLElBQUksQ0FBQ0EsT0FBT0MsY0FBWixFQUEyQkMsUUFBUSxnQkFBUjtBQUMzQixJQUFJQyxJQUFJRCxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlFLFVBQVVGLFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBSUcsSUFBSUgsUUFBUSxLQUFSLENBQVI7QUFDQSxJQUFJSSxPQUFPSixRQUFRLE1BQVIsQ0FBWDs7QUFHQSxJQUFNSyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0MsV0FBRCxFQUFjQyxTQUFkLEVBQXlCQyxJQUF6QjtBQUFBLFNBQWtDUixRQUFRLFVBQVIsRUFBb0JLLFVBQXBCLENBQStCLEVBQUNJLE9BQU8sSUFBUixFQUFjQyxPQUFPLElBQXJCLEVBQTJCQyxLQUFLLEtBQWhDLEVBQXVDQyxNQUFNLElBQTdDLEVBQS9CLEVBQW1GTixXQUFuRixFQUFnR0MsU0FBaEcsRUFBMkdDLElBQTNHLENBQWxDO0FBQUEsQ0FBbkI7QUFDQSxJQUFJSyxVQUFVUixXQUFXLFdBQVgsRUFBd0IsTUFBeEIsRUFBZ0MsT0FBaEMsQ0FBZDs7QUFFQSxJQUFJUyxlQUFlO0FBQ2pCLFVBQVE7QUFDTixXQUFPO0FBQ0xDLGtCQUFZO0FBQ1YsZ0JBQVE7QUFDTkMsZUFBSztBQURDO0FBREU7QUFEUCxLQUREO0FBUU4sbUJBQWU7QUFDYkMsaUJBQVc7QUFERSxLQVJUO0FBV04scUJBQWlCO0FBQ2ZBLGlCQUFXO0FBQ1RDLGdCQUFRO0FBREM7QUFESSxLQVhYO0FBZ0JOLGVBQVc7QUFDVCx3QkFBa0I7QUFDaEJDLGdCQUFRLElBRFE7QUFFaEJDLHNCQUFjLFlBRkU7QUFHaEJDLHdCQUFnQixFQUFDLFFBQVEsUUFBVCxFQUhBO0FBSWhCQyx1QkFBZSxFQUFDLFFBQVEsUUFBVDtBQUpDLE9BRFQ7QUFPVCwwQkFBb0I7QUFDbEJILGdCQUFRLElBRFU7QUFFbEJDLHNCQUFjLGNBRkk7QUFHbEJDLHdCQUFnQixFQUFDLFFBQVEsUUFBVCxFQUhFO0FBSWxCQyx1QkFBZSxFQUFDLFFBQVEsUUFBVDtBQUpHLE9BUFg7QUFhVCxzQkFBZ0I7QUFDZEgsZ0JBQVEsSUFETTtBQUVkQyxzQkFBYyxVQUZBO0FBR2RDLHdCQUFnQixFQUFDLFFBQVEsUUFBVCxFQUhGO0FBSWRDLHVCQUFlLEVBQUMsUUFBUSxRQUFUO0FBSkQsT0FiUDtBQW1CVCxvQkFBYztBQUNaSCxnQkFBUSxJQURJO0FBRVpDLHNCQUFjLFFBRkY7QUFHWkMsd0JBQWdCLEVBQUMsUUFBUSxRQUFULEVBSEo7QUFJWkMsdUJBQWUsRUFBQyxRQUFRLFFBQVQ7QUFKSDtBQW5CTDtBQWhCTDtBQURTLENBQW5CO0FBNkNBUixhQUFhUyxJQUFiLEdBQW9CdEIsRUFBRXVCLEtBQUYsQ0FBUVYsYUFBYVcsSUFBckIsRUFBMkI7QUFDN0NDLE9BQUs7QUFDSFgsZ0JBQVk7QUFDVixjQUFRO0FBQ05DLGFBQUs7QUFEQztBQURFO0FBRFQsR0FEd0M7QUFRN0MsbUJBQWlCO0FBQ2ZDLGVBQVc7QUFDVEMsY0FBUTtBQURDO0FBREk7QUFSNEIsQ0FBM0IsQ0FBcEI7QUFjQUosYUFBYWEsSUFBYixHQUFvQjFCLEVBQUV1QixLQUFGLENBQVFWLGFBQWFXLElBQXJCLEVBQTJCO0FBQzdDQyxPQUFLO0FBQ0hYLGdCQUFZO0FBQ1YsY0FBUTtBQUNOQyxhQUFLO0FBREM7QUFERTtBQURULEdBRHdDO0FBUTdDLG1CQUFpQjtBQUNmQyxlQUFXO0FBQ1RDLGNBQVE7QUFEQztBQURJO0FBUjRCLENBQTNCLENBQXBCO0FBY0FKLGFBQWFjLElBQWIsR0FBb0IzQixFQUFFdUIsS0FBRixDQUFRVixhQUFhVyxJQUFyQixFQUEyQjtBQUM3Q0MsT0FBSztBQUNIWCxnQkFBWTtBQUNWLGNBQVE7QUFDTkMsYUFBSztBQURDO0FBREU7QUFEVCxHQUR3QztBQVE3QyxtQkFBaUI7QUFDZkMsZUFBVztBQUNUQyxjQUFRO0FBREM7QUFESTtBQVI0QixDQUEzQixDQUFwQjtBQWNBLElBQUlXLE9BQU87QUFDVEMsVUFBUSxhQURDO0FBRVRDLFVBQVE7QUFGQyxDQUFYOztBQUtBLElBQUlDLFlBQVksS0FBaEI7QUFDQSxJQUFJQyxNQUFKO0FBQ0EsSUFBSUMsVUFBVTtBQUNaQyxrQkFBZ0Isd0JBQU1DLElBQU4sRUFBWVAsSUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXVCaEIsb0JBQVFILEtBQVIsQ0FBYyxnQkFBZCxFQUFnQyxFQUFDMEIsVUFBRCxFQUFPUCxVQUFQLEVBQWhDLEVBQStDRyxZQUFZSSxJQUFaO0FBQXRFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBREo7QUFFWkMsb0JBQWtCLDBCQUFNRCxJQUFOLEVBQVlQLElBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUF1Qkcsd0JBQVlJLElBQVo7QUFBdkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FGTjtBQUdaRSxnQkFBYyxzQkFBTUYsSUFBTixFQUFZUCxJQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBdUJHLHdCQUFZSSxJQUFaLENBQXZCLGtDQUFnREEsSUFBaEQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FIRjtBQUlaRyxjQUFZLG9CQUFDSCxJQUFELEVBQU9QLElBQVAsRUFBYVcsU0FBYixFQUEyQjtBQUNyQzNCLFlBQVFILEtBQVIsQ0FBYyxZQUFkLEVBQTRCLEVBQUMwQixVQUFELEVBQU9QLFVBQVAsRUFBYVcsb0JBQWIsRUFBNUI7QUFDQVIsZ0JBQVlJLElBQVo7QUFDQSxRQUFJSyxVQUFVLFNBQVZBLE9BQVUsR0FBTTtBQUFFNUIsY0FBUUYsR0FBUixDQUFZLGVBQVo7QUFBOEIsS0FBcEQ7QUFDQXNCLGFBQVNPLFVBQVVDLE9BQVYsRUFBbUIsTUFBbkIsQ0FBVDtBQUNBUixXQUFPUyxLQUFQLENBQWEsRUFBQ0Msc0JBQXNCLENBQXZCLEVBQWI7QUFDQUMsZUFBVztBQUFBLGFBQU1YLE9BQU9TLEtBQVAsQ0FBYSxFQUFDRyxnQkFBZ0IsQ0FBakIsRUFBYixDQUFOO0FBQUEsS0FBWCxFQUFvRCxHQUFwRDtBQUNBRCxlQUFXO0FBQUEsYUFBTVgsT0FBT2EsR0FBUCxFQUFOO0FBQUEsS0FBWCxFQUErQixJQUEvQjtBQUNEO0FBWlcsQ0FBZDtBQWNBLElBQUlDLGFBQWEsU0FBYkEsVUFBYSxHQUFNO0FBQ3JCLFNBQU9iLE9BQVA7QUFDRCxDQUZEOztBQUlBLElBQUljLGtCQUFrQixpQkFBT0MsT0FBUDtBQUFBLE1BQWdCQyxNQUFoQix1RUFBeUIsU0FBekI7QUFBQSxNQUFvQ0MsT0FBcEM7QUFBQSxNQUE2Q0MsS0FBN0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBQ2hCSCxZQUFZLEdBREk7QUFBQTtBQUFBO0FBQUE7O0FBRWRJLGlCQUZjLEdBRUosRUFGSTs7QUFHbEIsZUFBU0MsQ0FBVCxJQUFjeEMsWUFBZCxFQUE0QjtBQUMxQixnQkFBSXdDLE1BQU1ILE9BQVYsRUFBbUI7QUFDakJFLHNCQUFRQyxDQUFSLElBQWF4QyxhQUFhd0MsQ0FBYixFQUFnQkosTUFBaEIsQ0FBYjtBQUNBRyxzQkFBUUMsQ0FBUixFQUFXaEQsV0FBWCxHQUF5QmdELENBQXpCO0FBQ0Q7QUFDRjtBQUNELGNBQUksQ0FBQ0YsS0FBTCxFQUFZO0FBQUVDLHNCQUFVRSxPQUFPQyxNQUFQLENBQWNILE9BQWQsQ0FBVjtBQUFrQztBQVQ5Qiw0Q0FVWEEsT0FWVzs7QUFBQTtBQUFBLDRDQVlidkMsYUFBYW1DLE9BQWIsRUFBc0JDLE1BQXRCLENBWmE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBdEI7QUFjQSxJQUFJTyxhQUFhekQsUUFBUSxlQUFSLEVBQXlCLEVBQUNLLHNCQUFELEVBQWFDLGFBQWEsTUFBMUIsRUFBa0NDLFdBQVcsTUFBN0MsRUFBcUR3QyxzQkFBckQsRUFBaUVDLGdDQUFqRSxFQUFrRkUsUUFBUXBDLGFBQWFXLElBQWIsQ0FBa0JDLEdBQTVHLEVBQXpCLENBQWpCO0FBQ0EsSUFBSWdDLGFBQWExRCxRQUFRLGVBQVIsRUFBeUIsRUFBQ0ssc0JBQUQsRUFBYUMsYUFBYSxNQUExQixFQUFrQ0MsV0FBVyxNQUE3QyxFQUFxRHdDLHNCQUFyRCxFQUFpRUMsZ0NBQWpFLEVBQWtGRSxRQUFRcEMsYUFBYVMsSUFBYixDQUFrQkcsR0FBNUcsRUFBekIsQ0FBakI7QUFDQSxJQUFJaUMsYUFBYTNELFFBQVEsZUFBUixFQUF5QixFQUFDSyxzQkFBRCxFQUFhQyxhQUFhLE1BQTFCLEVBQWtDQyxXQUFXLE1BQTdDLEVBQXFEd0Msc0JBQXJELEVBQWlFQyxnQ0FBakUsRUFBa0ZFLFFBQVFwQyxhQUFhYSxJQUFiLENBQWtCRCxHQUE1RyxFQUF6QixDQUFqQjtBQUNBLElBQUlrQyxhQUFhNUQsUUFBUSxlQUFSLEVBQXlCLEVBQUNLLHNCQUFELEVBQWFDLGFBQWEsTUFBMUIsRUFBa0NDLFdBQVcsTUFBN0MsRUFBcUR3QyxzQkFBckQsRUFBaUVDLGdDQUFqRSxFQUFrRkUsUUFBUXBDLGFBQWFjLElBQWIsQ0FBa0JGLEdBQTVHLEVBQXpCLENBQWpCO0FBQ0ErQixXQUFXSSxLQUFYO0FBQ0FILFdBQVdHLEtBQVg7QUFDQUYsV0FBV0UsS0FBWDtBQUNBRCxXQUFXQyxLQUFYOztBQUVBLElBQUlDLGFBQWE5RCxRQUFRLGVBQVIsRUFBeUIsRUFBQ0ssc0JBQUQsRUFBYUMsYUFBYSxNQUExQixFQUFrQ0MsV0FBVyxNQUE3QyxFQUFxRHlDLGdDQUFyRCxFQUFzRUUsUUFBUXBDLGFBQWFXLElBQWIsQ0FBa0JDLEdBQWhHLEVBQXpCLENBQWpCOztBQUVBdkIsRUFBRTRELElBQUYsQ0FBTyxhQUFQLEVBQXNCO0FBQ3BCQyxXQUFTO0FBRFcsQ0FBdEIsRUFFRyxTQUFlQyxRQUFmLENBQXlCOUQsQ0FBekI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNEQSxZQUFFK0QsSUFBRixDQUFPLENBQVA7QUFEQztBQUFBLDBDQUVLLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWF4QixXQUFXd0IsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQUZMOztBQUFBO0FBQUE7QUFBQSwwQ0FHS2pFLEVBQUU0RCxJQUFGLENBQU8sa0NBQVAsRUFBMkMsa0JBQWdCNUQsQ0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQy9DNkIsZ0NBQVksS0FBWjtBQUQrQztBQUFBLG9EQUUxQjhCLFdBQVdPLEdBQVgsQ0FBZSxFQUFDQyxJQUFJLE1BQUwsRUFBYXBELFFBQVEsZ0JBQXJCLEVBQXVDa0IsTUFBTSxFQUFDLGFBQWEsQ0FBZCxFQUE3QyxFQUErRFAsVUFBL0QsRUFBcUUwQyxTQUFTLElBQTlFLEVBQWYsQ0FGMEI7O0FBQUE7QUFFM0NDLDRCQUYyQzs7QUFHL0NyRSxzQkFBRXNFLElBQUYsQ0FBT0QsUUFBUCxFQUFpQixJQUFqQixFQUF1Qiw2QkFBdkI7QUFIK0M7QUFBQSxvREFJekMsSUFBSUwsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSw2QkFBYXhCLFdBQVd3QixPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxxQkFBWixDQUp5Qzs7QUFBQTtBQUsvQ2pFLHNCQUFFc0UsSUFBRixDQUFPekMsU0FBUCxFQUFrQixFQUFDLGFBQWEsQ0FBZCxFQUFsQixFQUFvQyxtQ0FBcEM7QUFDQTdCLHNCQUFFMkMsR0FBRjs7QUFOK0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBM0MsQ0FITDs7QUFBQTtBQUFBO0FBQUEsMENBV0szQyxFQUFFNEQsSUFBRixDQUFPLG9DQUFQLEVBQTZDLGtCQUFnQjVELENBQWhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNqRDZCLGdDQUFZLEtBQVo7QUFEaUQ7QUFBQSxvREFFNUI4QixXQUFXTyxHQUFYLENBQWUsRUFBQ0MsSUFBSSxNQUFMLEVBQWFwRCxRQUFRLGtCQUFyQixFQUF5Q2tCLE1BQU0sRUFBQyxhQUFhLENBQWQsRUFBL0MsRUFBaUVQLFVBQWpFLEVBQXVFMEMsU0FBUyxJQUFoRixFQUFmLENBRjRCOztBQUFBO0FBRTdDQyw0QkFGNkM7O0FBR2pEckUsc0JBQUVzRSxJQUFGLENBQU9ELFFBQVAsRUFBaUIsSUFBakIsRUFBdUIsaUJBQXZCO0FBQ0FyRSxzQkFBRXNFLElBQUYsQ0FBT3pDLFNBQVAsRUFBa0IsRUFBQyxhQUFhLENBQWQsRUFBbEIsRUFBb0MscUNBQXBDO0FBQ0E3QixzQkFBRTJDLEdBQUY7O0FBTGlEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQTdDLENBWEw7O0FBQUE7QUFBQTtBQUFBLDBDQW1CSzNDLEVBQUU0RCxJQUFGLENBQU8sZ0NBQVAsRUFBeUMsa0JBQWdCNUQsQ0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQzdDNkIsZ0NBQVksS0FBWjtBQUQ2QztBQUFBLG9EQUV4QjhCLFdBQVdPLEdBQVgsQ0FBZSxFQUFDQyxJQUFJLE1BQUwsRUFBYXBELFFBQVEsY0FBckIsRUFBcUNrQixNQUFNLEVBQUMsYUFBYSxDQUFkLEVBQTNDLEVBQTZEUCxVQUE3RCxFQUFtRTBDLFNBQVMsSUFBNUUsRUFBZixDQUZ3Qjs7QUFBQTtBQUV6Q0MsNEJBRnlDOztBQUc3Q3JFLHNCQUFFc0UsSUFBRixDQUFPRCxRQUFQLEVBQWlCLEVBQUMsYUFBYSxDQUFkLEVBQWpCLEVBQW1DLG9CQUFuQztBQUNBckUsc0JBQUVzRSxJQUFGLENBQU96QyxTQUFQLEVBQWtCLEVBQUMsYUFBYSxDQUFkLEVBQWxCLEVBQW9DLGlDQUFwQztBQUNBN0Isc0JBQUUyQyxHQUFGOztBQUw2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUF6QyxDQW5CTDs7QUFBQTtBQUFBO0FBQUEsMENBMEJLM0MsRUFBRTRELElBQUYsQ0FBTyw4QkFBUCxFQUF1QyxrQkFBZ0I1RCxDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDM0M2QixnQ0FBWSxLQUFaO0FBQ0lPLDhCQUZ1QyxHQUUxQixLQUYwQjtBQUFBO0FBQUEsb0RBR3JCdUIsV0FBV08sR0FBWCxDQUFlLEVBQUNDLElBQUksTUFBTCxFQUFhcEQsUUFBUSxZQUFyQixFQUFtQ2tCLE1BQU0sRUFBQyxhQUFhLENBQWQsRUFBekMsRUFBMkRQLFVBQTNELEVBQWlFMEMsU0FBUyxJQUExRSxFQUFmLENBSHFCOztBQUFBO0FBR3ZDRyw2QkFIdUM7O0FBSTNDQSw4QkFBVUMsRUFBVixDQUFhLE1BQWIsRUFBcUIsVUFBQ3ZDLElBQUQsRUFBVTtBQUFFdkIsOEJBQVFILEtBQVIsQ0FBYyxnQkFBZCxFQUFnQzBCLElBQWhDLEVBQXVDRyxhQUFhLElBQWI7QUFBbUIscUJBQTNGO0FBQ0FtQyw4QkFBVUMsRUFBVixDQUFhLE9BQWIsRUFBc0IsVUFBQ3ZDLElBQUQ7QUFBQSw2QkFBVXZCLFFBQVFILEtBQVIsQ0FBYyxpQkFBZCxFQUFpQzBCLElBQWpDLENBQVY7QUFBQSxxQkFBdEI7QUFDQXNDLDhCQUFVQyxFQUFWLENBQWEsS0FBYixFQUFvQixVQUFDdkMsSUFBRDtBQUFBLDZCQUFVdkIsUUFBUUgsS0FBUixDQUFjLGlCQUFkLEVBQWlDMEIsSUFBakMsQ0FBVjtBQUFBLHFCQUFwQjs7QUFOMkM7QUFBQSxvREFRckMsSUFBSStCLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsNkJBQWF4QixXQUFXd0IsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEscUJBQVosQ0FScUM7O0FBQUE7QUFTM0NqRSxzQkFBRXNFLElBQUYsQ0FBT2xDLFVBQVAsRUFBbUIsSUFBbkIsRUFBeUIsaUJBQXpCO0FBQ0FwQyxzQkFBRXNFLElBQUYsQ0FBT3pDLFNBQVAsRUFBa0IsRUFBQyxhQUFhLENBQWQsRUFBbEIsRUFBb0MsK0JBQXBDO0FBQ0E3QixzQkFBRTJDLEdBQUY7O0FBWDJDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXZDLENBMUJMOztBQUFBO0FBQUE7QUFBQSwwQ0F3Q0szQyxFQUFFNEQsSUFBRixDQUFPLDZCQUFQLEVBQXNDLGtCQUFnQjVELENBQWhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUMxQzZCLGdDQUFZLEtBQVo7QUFEMEM7QUFBQSxvREFFckI4QixXQUFXYyxJQUFYLENBQWdCLEVBQUNDLE9BQU8sV0FBUixFQUFxQnpDLE1BQU0sRUFBQyxrQkFBa0IsQ0FBbkIsRUFBM0IsRUFBa0RQLFVBQWxELEVBQXdEMEMsU0FBUyxJQUFqRSxFQUF1RU8sZ0JBQWdCLElBQXZGLEVBQWhCLENBRnFCOztBQUFBO0FBRXRDTiw0QkFGc0M7O0FBRzFDckUsc0JBQUVzRSxJQUFGLENBQU9ELFFBQVAsRUFBaUIsRUFBQyxrQkFBa0IsQ0FBbkIsRUFBakIsRUFBd0Msb0JBQXhDO0FBQ0FyRSxzQkFBRXNFLElBQUYsQ0FBT3pDLFNBQVAsRUFBa0IsRUFBQyxrQkFBa0IsQ0FBbkIsRUFBbEIsRUFBeUMsa0JBQXpDO0FBQ0E3QixzQkFBRTJDLEdBQUY7O0FBTDBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXRDLENBeENMOztBQUFBO0FBQUE7QUFBQSwwQ0FnREssSUFBSXFCLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWF4QixXQUFXd0IsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQWhETDs7QUFBQTtBQWlERGpFLFlBQUUyQyxHQUFGO0FBQ0E7O0FBbERDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgsRUFxREdpQyxJQXJESCxDQXFEUTtBQUFBLFNBQU1DLFFBQVFDLElBQVIsRUFBTjtBQUFBLENBckRSIiwiZmlsZSI6Im5ldC50ZXN0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaWYgKCFnbG9iYWwuX2JhYmVsUG9seWZpbGwpcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKVxudmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IHJlcXVpcmUoJy4uL3V0aWxzJykuZ2V0Q29uc29sZSh7ZXJyb3I6IHRydWUsIGRlYnVnOiB0cnVlLCBsb2c6IGZhbHNlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbnZhciBDT05TT0xFID0gZ2V0Q29uc29sZSgnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxuXG52YXIgc2hhcmVkQ29uZmlnID0ge1xuICAnbmV0MSc6IHtcbiAgICAnbmV0Jzoge1xuICAgICAgdHJhbnNwb3J0czoge1xuICAgICAgICAndGVzdCc6IHtcbiAgICAgICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4MCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2V2ZW50cy5lbWl0Jzoge1xuICAgICAgdGVzdEV2ZW50OiB7fVxuICAgIH0sXG4gICAgJ2V2ZW50cy5saXN0ZW4nOiB7XG4gICAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgICAgbWV0aG9kOiAndGVzdFJlc3BvbnNlJ1xuICAgICAgfVxuICAgIH0sXG4gICAgJ21ldGhvZHMnOiB7XG4gICAgICAndGVzdE5vUmVzcG9uc2UnOiB7XG4gICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnbm9SZXNwb25zZScsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0QWtub3dsZWdtZW50Jzoge1xuICAgICAgICBwdWJsaWM6IHRydWUsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2Frbm93bGVnbWVudCcsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0UmVzcG9uc2UnOiB7XG4gICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAncmVzcG9uc2UnLFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH0sXG4gICAgICAndGVzdFN0cmVhbSc6IHtcbiAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdzdHJlYW0nLFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbnNoYXJlZENvbmZpZy5uZXQyID0gUi5tZXJnZShzaGFyZWRDb25maWcubmV0MSwge1xuICBuZXQ6IHtcbiAgICB0cmFuc3BvcnRzOiB7XG4gICAgICAndGVzdCc6IHtcbiAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODInXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAnZXZlbnRzLmxpc3Rlbic6IHtcbiAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgIG1ldGhvZDogJ3Rlc3RSZXNwb25zZSdcbiAgICB9XG4gIH1cbn0pXG5zaGFyZWRDb25maWcubmV0MyA9IFIubWVyZ2Uoc2hhcmVkQ29uZmlnLm5ldDEsIHtcbiAgbmV0OiB7XG4gICAgdHJhbnNwb3J0czoge1xuICAgICAgJ3Rlc3QnOiB7XG4gICAgICAgIHVybDogJ2xvY2FsaG9zdDo4MDgzJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJ2V2ZW50cy5saXN0ZW4nOiB7XG4gICAgdGVzdEV2ZW50OiB7XG4gICAgICBtZXRob2Q6ICd0ZXN0Tm9SZXNwb25zZSdcbiAgICB9XG4gIH1cbn0pXG5zaGFyZWRDb25maWcubmV0NCA9IFIubWVyZ2Uoc2hhcmVkQ29uZmlnLm5ldDEsIHtcbiAgbmV0OiB7XG4gICAgdHJhbnNwb3J0czoge1xuICAgICAgJ3Rlc3QnOiB7XG4gICAgICAgIHVybDogJ2xvY2FsaG9zdDo4MDg0J1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJ2V2ZW50cy5saXN0ZW4nOiB7XG4gICAgdGVzdEV2ZW50OiB7XG4gICAgICBtZXRob2Q6ICd0ZXN0QWtub3dsZWdtZW50J1xuICAgIH1cbiAgfVxufSlcbnZhciBtZXRhID0ge1xuICBjb3JyaWQ6ICd0ZXN0UmVxdWVzdCcsXG4gIHVzZXJpZDogJ3Rlc3RVc2VyJ1xufVxuXG52YXIgdGVzdENoZWNrID0gZmFsc2VcbnZhciBzdHJlYW1cbnZhciBNZXRob2RzID0ge1xuICB0ZXN0Tm9SZXNwb25zZTogYXN5bmMoZGF0YSwgbWV0YSkgPT4geyBDT05TT0xFLmRlYnVnKCd0ZXN0Tm9SZXNwb25zZScsIHtkYXRhLCBtZXRhfSk7IHRlc3RDaGVjayA9IGRhdGEgfSxcbiAgdGVzdEFrbm93bGVnbWVudDogYXN5bmMoZGF0YSwgbWV0YSkgPT4geyB0ZXN0Q2hlY2sgPSBkYXRhIH0sXG4gIHRlc3RSZXNwb25zZTogYXN5bmMoZGF0YSwgbWV0YSkgPT4geyB0ZXN0Q2hlY2sgPSBkYXRhOyByZXR1cm4gZGF0YSB9LFxuICB0ZXN0U3RyZWFtOiAoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtKSA9PiB7XG4gICAgQ09OU09MRS5kZWJ1ZygndGVzdFN0cmVhbScsIHtkYXRhLCBtZXRhLCBnZXRTdHJlYW19KVxuICAgIHRlc3RDaGVjayA9IGRhdGFcbiAgICB2YXIgb25DbG9zZSA9ICgpID0+IHsgQ09OU09MRS5sb2coJ3N0cmVhbSBjbG9zZWQnKSB9XG4gICAgc3RyZWFtID0gZ2V0U3RyZWFtKG9uQ2xvc2UsIDEyMDAwMClcbiAgICBzdHJlYW0ud3JpdGUoe3Rlc3RTdHJlYW1Db25ubmVjdGVkOiAxfSlcbiAgICBzZXRUaW1lb3V0KCgpID0+IHN0cmVhbS53cml0ZSh7dGVzdFN0cmVhbURhdGE6IDF9KSwgNTAwKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLmVuZCgpLCAxMDAwKVxuICB9XG59XG52YXIgZ2V0TWV0aG9kcyA9ICgpID0+IHtcbiAgcmV0dXJuIE1ldGhvZHNcbn1cblxudmFyIGdldFNoYXJlZENvbmZpZyA9IGFzeW5jIChzZXJ2aWNlLCBjb25maWcgPSAnc2VydmljZScsIGV4Y2x1ZGUsIGFzT2JqKSA9PiB7XG4gIGlmIChzZXJ2aWNlID09PSAnKicpIHtcbiAgICB2YXIgcmVzdWx0cyA9IHt9XG4gICAgZm9yICh2YXIgaSBpbiBzaGFyZWRDb25maWcpIHtcbiAgICAgIGlmIChpICE9PSBleGNsdWRlKSB7XG4gICAgICAgIHJlc3VsdHNbaV0gPSBzaGFyZWRDb25maWdbaV1bY29uZmlnXVxuICAgICAgICByZXN1bHRzW2ldLnNlcnZpY2VOYW1lID0gaVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWFzT2JqKSB7IHJlc3VsdHMgPSBPYmplY3QudmFsdWVzKHJlc3VsdHMpIH1cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG4gIHJldHVybiBzaGFyZWRDb25maWdbc2VydmljZV1bY29uZmlnXVxufVxudmFyIG5ldFNlcnZlcjEgPSByZXF1aXJlKCcuLi9uZXQuc2VydmVyJykoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lOiAnbmV0MScsIHNlcnZpY2VJZDogJ25ldDEnLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGNvbmZpZzogc2hhcmVkQ29uZmlnLm5ldDEubmV0fSlcbnZhciBuZXRTZXJ2ZXIyID0gcmVxdWlyZSgnLi4vbmV0LnNlcnZlcicpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZTogJ25ldDInLCBzZXJ2aWNlSWQ6ICduZXQyJywgZ2V0TWV0aG9kcywgZ2V0U2hhcmVkQ29uZmlnLCBjb25maWc6IHNoYXJlZENvbmZpZy5uZXQyLm5ldH0pXG52YXIgbmV0U2VydmVyMyA9IHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQzJywgc2VydmljZUlkOiAnbmV0MycsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZywgY29uZmlnOiBzaGFyZWRDb25maWcubmV0My5uZXR9KVxudmFyIG5ldFNlcnZlcjQgPSByZXF1aXJlKCcuLi9uZXQuc2VydmVyJykoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lOiAnbmV0NCcsIHNlcnZpY2VJZDogJ25ldDQnLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGNvbmZpZzogc2hhcmVkQ29uZmlnLm5ldDQubmV0fSlcbm5ldFNlcnZlcjEuc3RhcnQoKVxubmV0U2VydmVyMi5zdGFydCgpXG5uZXRTZXJ2ZXIzLnN0YXJ0KClcbm5ldFNlcnZlcjQuc3RhcnQoKVxuXG52YXIgbmV0Q2xpZW50MSA9IHJlcXVpcmUoJy4uL25ldC5jbGllbnQnKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWU6ICduZXQxJywgc2VydmljZUlkOiAnbmV0MScsIGdldFNoYXJlZENvbmZpZywgY29uZmlnOiBzaGFyZWRDb25maWcubmV0MS5uZXR9KVxuXG50LnRlc3QoJyoqKiBORVQgKioqJywge1xuICBhdXRvZW5kOiB0cnVlXG59LCBhc3luYyBmdW5jdGlvbiBtYWluVGVzdCAodCkge1xuICB0LnBsYW4oNSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5ycGMgLT4gdGVzdE5vUmVzcG9uc2UnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoe3RvOiAnbmV0MScsIG1ldGhvZDogJ3Rlc3ROb1Jlc3BvbnNlJywgZGF0YTogeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSwgdGltZW91dDogNTAwMH0pXG4gICAgdC5zYW1lKHJlc3BvbnNlLCBudWxsLCAncmVzcG9uc2U9dHJ1ZSBvbiBOb1Jlc3BvbnNlJylcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdE5vUmVzcG9uc2UgcmljaGllc3RhIHJpY2V2dXRhJylcbiAgICB0LmVuZCgpXG4gIH0pXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5ycGMgLT4gdGVzdEFrbm93bGVnbWVudCcsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBuZXRDbGllbnQxLnJwYyh7dG86ICduZXQxJywgbWV0aG9kOiAndGVzdEFrbm93bGVnbWVudCcsIGRhdGE6IHsndGVzdF9kYXRhJzogMX0sIG1ldGEsIHRpbWVvdXQ6IDUwMDB9KVxuICAgIHQuc2FtZShyZXNwb25zZSwgbnVsbCwgJ0Frbm93bGVnbWVudCBvaycpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgeyd0ZXN0X2RhdGEnOiAxfSwgJ3Rlc3RBa25vd2xlZ21lbnQgcmljaGllc3RhIHJpY2V2dXRhJylcbiAgICB0LmVuZCgpXG4gIH0pXG4gIC8vXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5ycGMgLT4gdGVzdFJlc3BvbnNlJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG5ldENsaWVudDEucnBjKHt0bzogJ25ldDEnLCBtZXRob2Q6ICd0ZXN0UmVzcG9uc2UnLCBkYXRhOiB7J3Rlc3RfZGF0YSc6IDF9LCBtZXRhLCB0aW1lb3V0OiA1MDAwfSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIHsndGVzdF9kYXRhJzogMX0sICdyZXNwb25zZSBhcyBzZW5kZWQnKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsndGVzdF9kYXRhJzogMX0sICd0ZXN0UmVzcG9uc2UgcmljaGllc3RhIHJpY2V2dXRhJylcbiAgICB0LmVuZCgpXG4gIH0pXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5ycGMgLT4gdGVzdFN0cmVhbScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgdGVzdFN0cmVhbSA9IGZhbHNlXG4gICAgdmFyIHN0cmVhbWluZyA9IGF3YWl0IG5ldENsaWVudDEucnBjKHt0bzogJ25ldDEnLCBtZXRob2Q6ICd0ZXN0U3RyZWFtJywgZGF0YTogeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSwgdGltZW91dDogNTAwMH0pXG4gICAgc3RyZWFtaW5nLm9uKCdkYXRhJywgKGRhdGEpID0+IHsgQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGRhdGEnLCBkYXRhKTsgdGVzdFN0cmVhbSA9IHRydWUgfSlcbiAgICBzdHJlYW1pbmcub24oJ2Vycm9yJywgKGRhdGEpID0+IENPTlNPTEUuZGVidWcoJ3N0cmVhbWluZyBlcnJvcicsIGRhdGEpKVxuICAgIHN0cmVhbWluZy5vbignZW5kJywgKGRhdGEpID0+IENPTlNPTEUuZGVidWcoJ3N0cmVhbWluZyBjbG9zZScsIGRhdGEpKVxuXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gICAgdC5zYW1lKHRlc3RTdHJlYW0sIHRydWUsICdTdHJlYW0gcmVjZWl2ZWQnKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsndGVzdF9kYXRhJzogMX0sICd0ZXN0U3RyZWFtIHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5lbWl0IC0+IHRlc3RFbWl0JywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG5ldENsaWVudDEuZW1pdCh7ZXZlbnQ6ICd0ZXN0RXZlbnQnLCBkYXRhOiB7J2V2ZW50VGVzdF9kYXRhJzogMX0sIG1ldGEsIHRpbWVvdXQ6IDUwMDAsIHNpbmdsZVJlc3BvbnNlOiB0cnVlfSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIHsnZXZlbnRUZXN0X2RhdGEnOiAxfSwgJ3Jlc3BvbnNlIGFzIHNlbmRlZCcpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgeydldmVudFRlc3RfZGF0YSc6IDF9LCAnZGVsYXllZCByZWNlaXZlZCcpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICB0LmVuZCgpXG4gIC8vcHJvY2Vzcy5leGl0KClcbn0pLnRoZW4oKCkgPT4gcHJvY2Vzcy5leGl0KCkpXG4iXX0=