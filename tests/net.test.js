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
    rpcOut: {
      'testRpcNoResponse': {
        to: 'net1',
        method: 'testNoResponse',
        requestSchema: { 'type': 'object' },
        responseSchema: { 'type': 'object' }
      },
      'testRpcAknowlegment': {
        to: 'net1',
        method: 'testAknowlegment',
        requestSchema: { 'type': 'object' },
        responseSchema: { 'type': 'object' }
      },
      'testRpcResponse': {
        to: 'net1',
        method: 'testResponse',
        requestSchema: { 'type': 'object' },
        responseSchema: { 'type': 'object' }
      },
      'testRpcStream': {
        to: 'net1',
        method: 'testStream',
        requestSchema: { 'type': 'object' },
        responseSchema: { 'type': 'object' }
      }
    },
    eventsOut: {
      'testEvent': {
        multipleResponse: false,
        requestSchema: { 'type': 'object' },
        responseSchema: { 'type': 'object' }
      }
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
  var field = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'net';
  var service = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';
  var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  if (service === '*') return Object.keys(sharedConfig).filter(function (key) {
    return key !== exclude;
  }).map(function (key) {
    return { items: sharedConfig[key][field], service: key };
  });else return sharedConfig[service][field];
};

function getServer(serviceName, serviceId) {
  var _this = this;

  var getMethodsConfig = function _callee(service, exclude) {
    return regeneratorRuntime.async(function _callee$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', getSharedConfig('methods', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, _this);
  };
  var getNetConfig = function _callee2(service, exclude) {
    return regeneratorRuntime.async(function _callee2$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt('return', getSharedConfig('net', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, _this);
  };
  var getEventsIn = function _callee3(service, exclude) {
    return regeneratorRuntime.async(function _callee3$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt('return', getSharedConfig('eventsIn', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, _this);
  };
  var getEventsOut = function _callee4(service, exclude) {
    return regeneratorRuntime.async(function _callee4$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt('return', getSharedConfig('eventsOut', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context7.stop();
        }
      }
    }, null, _this);
  };
  var getRpcOut = function _callee5(service, exclude) {
    return regeneratorRuntime.async(function _callee5$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt('return', getSharedConfig('rpcOut', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context8.stop();
        }
      }
    }, null, _this);
  };
  return require('../net.server')({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, getMethods: getMethods, getMethodsConfig: getMethodsConfig, getNetConfig: getNetConfig });
}

function getClient(serviceName, serviceId) {
  var _this2 = this;

  var getMethodsConfig = function _callee6(service, exclude) {
    return regeneratorRuntime.async(function _callee6$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            return _context9.abrupt('return', getSharedConfig('methods', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context9.stop();
        }
      }
    }, null, _this2);
  };
  var getNetConfig = function _callee7(service, exclude) {
    return regeneratorRuntime.async(function _callee7$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            return _context10.abrupt('return', getSharedConfig('net', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context10.stop();
        }
      }
    }, null, _this2);
  };
  var getEventsIn = function _callee8(service, exclude) {
    return regeneratorRuntime.async(function _callee8$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            return _context11.abrupt('return', getSharedConfig('eventsIn', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context11.stop();
        }
      }
    }, null, _this2);
  };
  var getEventsOut = function _callee9(service, exclude) {
    return regeneratorRuntime.async(function _callee9$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            return _context12.abrupt('return', getSharedConfig('eventsOut', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context12.stop();
        }
      }
    }, null, _this2);
  };
  var getRpcOut = function _callee10(service, exclude) {
    return regeneratorRuntime.async(function _callee10$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            return _context13.abrupt('return', getSharedConfig('rpcOut', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context13.stop();
        }
      }
    }, null, _this2);
  };
  return require('../net.client')({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, getNetConfig: getNetConfig, getEventsIn: getEventsIn, getEventsOut: getEventsOut, getMethodsConfig: getMethodsConfig, getRpcOut: getRpcOut });
}

var netServer1 = getServer('net1', 'net1');
var netServer2 = getServer('net2', 'net2');
var netServer3 = getServer('net3', 'net3');
var netServer4 = getServer('net4', 'net4');
netServer1.start();
netServer2.start();
netServer3.start();
netServer4.start();

var netClient1 = getClient('net1', 'net1');

t.test('*** NET ***', {
  autoend: true
}, function mainTest(t) {
  return regeneratorRuntime.async(function mainTest$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          t.plan(5);
          _context19.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 3:
          _context19.next = 5;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testNoResponse', function _callee11(t) {
            var response;
            return regeneratorRuntime.async(function _callee11$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    testCheck = false;
                    _context14.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc('testRpcNoResponse', { 'test_data': 1 }, meta));

                  case 3:
                    response = _context14.sent;

                    t.same(response, null, 'response=true on NoResponse');
                    _context14.next = 7;
                    return regeneratorRuntime.awrap(new Promise(function (resolve) {
                      return setTimeout(resolve, 1000);
                    }));

                  case 7:
                    t.same(testCheck, { 'test_data': 1 }, 'testNoResponse richiesta ricevuta');
                    t.end();

                  case 9:
                  case 'end':
                    return _context14.stop();
                }
              }
            }, null, this);
          }));

        case 5:
          _context19.next = 7;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testAknowlegment', function _callee12(t) {
            var response;
            return regeneratorRuntime.async(function _callee12$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    testCheck = false;
                    _context15.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc('testRpcAknowlegment', { 'test_data': 1 }, meta));

                  case 3:
                    response = _context15.sent;

                    t.same(response, null, 'Aknowlegment ok');
                    t.same(testCheck, { 'test_data': 1 }, 'testAknowlegment richiesta ricevuta');
                    t.end();

                  case 7:
                  case 'end':
                    return _context15.stop();
                }
              }
            }, null, this);
          }));

        case 7:
          _context19.next = 9;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testResponse', function _callee13(t) {
            var response;
            return regeneratorRuntime.async(function _callee13$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    testCheck = false;
                    _context16.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc('testRpcResponse', { 'test_data': 1 }, meta));

                  case 3:
                    response = _context16.sent;

                    t.same(response, { 'test_data': 1 }, 'response as sended');
                    t.same(testCheck, { 'test_data': 1 }, 'testResponse richiesta ricevuta');
                    t.end();

                  case 7:
                  case 'end':
                    return _context16.stop();
                }
              }
            }, null, this);
          }));

        case 9:
          _context19.next = 11;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testStream', function _callee14(t) {
            var testStream, streaming;
            return regeneratorRuntime.async(function _callee14$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    testCheck = false;
                    testStream = false;
                    _context17.next = 4;
                    return regeneratorRuntime.awrap(netClient1.rpc('testRpcStream', { 'test_data': 1 }, meta));

                  case 4:
                    streaming = _context17.sent;

                    streaming.on('data', function (data) {
                      CONSOLE.debug('streaming data', data);testStream = true;
                    });
                    streaming.on('error', function (data) {
                      return CONSOLE.debug('streaming error', data);
                    });
                    streaming.on('end', function (data) {
                      return CONSOLE.debug('streaming close', data);
                    });

                    _context17.next = 10;
                    return regeneratorRuntime.awrap(new Promise(function (resolve) {
                      return setTimeout(resolve, 1000);
                    }));

                  case 10:
                    t.same(testStream, true, 'Stream received');
                    t.same(testCheck, { 'test_data': 1 }, 'testStream richiesta ricevuta');
                    t.end();

                  case 13:
                  case 'end':
                    return _context17.stop();
                }
              }
            }, null, this);
          }));

        case 11:
          _context19.next = 13;
          return regeneratorRuntime.awrap(t.test('netClient1.emit -> testEmit', function _callee15(t) {
            var response;
            return regeneratorRuntime.async(function _callee15$(_context18) {
              while (1) {
                switch (_context18.prev = _context18.next) {
                  case 0:
                    testCheck = false;
                    _context18.next = 3;
                    return regeneratorRuntime.awrap(netClient1.emit('testEvent', { 'eventTest_data': 1 }, meta));

                  case 3:
                    response = _context18.sent;

                    t.same(response, { 'eventTest_data': 1 }, 'response as sended');
                    t.same(testCheck, { 'eventTest_data': 1 }, 'delayed received');
                    t.end();

                  case 7:
                  case 'end':
                    return _context18.stop();
                }
              }
            }, null, this);
          }));

        case 13:
          _context19.next = 15;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 15:
          t.end();
          // process.exit()

        case 16:
        case 'end':
          return _context19.stop();
      }
    }
  }, null, this);
}).then(function () {
  return process.exit();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC50ZXN0LmVzNiJdLCJuYW1lcyI6WyJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsInJlcXVpcmUiLCJSIiwicmVxdWVzdCIsInQiLCJwYXRoIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsImVycm9yIiwiZGVidWciLCJsb2ciLCJ3YXJuIiwiQ09OU09MRSIsInNoYXJlZENvbmZpZyIsImNoYW5uZWxzIiwidXJsIiwicnBjT3V0IiwidG8iLCJtZXRob2QiLCJyZXF1ZXN0U2NoZW1hIiwicmVzcG9uc2VTY2hlbWEiLCJldmVudHNPdXQiLCJtdWx0aXBsZVJlc3BvbnNlIiwidGVzdEV2ZW50IiwicHVibGljIiwicmVzcG9uc2VUeXBlIiwibmV0MiIsIm1lcmdlIiwibmV0MSIsIm5ldCIsIm5ldDMiLCJuZXQ0IiwibWV0YSIsImNvcnJpZCIsInVzZXJpZCIsInRlc3RDaGVjayIsInN0cmVhbSIsIk1ldGhvZHMiLCJ0ZXN0Tm9SZXNwb25zZSIsImRhdGEiLCJ0ZXN0QWtub3dsZWdtZW50IiwidGVzdFJlc3BvbnNlIiwidGVzdFN0cmVhbSIsImdldFN0cmVhbSIsIm9uQ2xvc2UiLCJ3cml0ZSIsInRlc3RTdHJlYW1Db25ubmVjdGVkIiwic2V0VGltZW91dCIsInRlc3RTdHJlYW1EYXRhIiwiZW5kIiwiZ2V0TWV0aG9kcyIsInNlcnZpY2UiLCJleGNsdWRlIiwiZ2V0U2hhcmVkQ29uZmlnIiwiZmllbGQiLCJPYmplY3QiLCJrZXlzIiwiZmlsdGVyIiwia2V5IiwibWFwIiwiaXRlbXMiLCJnZXRTZXJ2ZXIiLCJnZXRNZXRob2RzQ29uZmlnIiwiZ2V0TmV0Q29uZmlnIiwiZ2V0RXZlbnRzSW4iLCJnZXRFdmVudHNPdXQiLCJnZXRScGNPdXQiLCJnZXRDbGllbnQiLCJuZXRTZXJ2ZXIxIiwibmV0U2VydmVyMiIsIm5ldFNlcnZlcjMiLCJuZXRTZXJ2ZXI0Iiwic3RhcnQiLCJuZXRDbGllbnQxIiwidGVzdCIsImF1dG9lbmQiLCJtYWluVGVzdCIsInBsYW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJwYyIsInJlc3BvbnNlIiwic2FtZSIsInN0cmVhbWluZyIsIm9uIiwiZW1pdCIsInRoZW4iLCJwcm9jZXNzIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLENBQUNBLE9BQU9DLGNBQVosRUFBMkJDLFFBQVEsZ0JBQVI7QUFDM0IsSUFBSUMsSUFBSUQsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJRSxVQUFVRixRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlHLElBQUlILFFBQVEsS0FBUixDQUFSO0FBQ0EsSUFBSUksT0FBT0osUUFBUSxNQUFSLENBQVg7O0FBRUEsSUFBTUssYUFBYSxTQUFiQSxVQUFhLENBQUNDLFdBQUQsRUFBY0MsU0FBZCxFQUF5QkMsSUFBekI7QUFBQSxTQUFrQ1IsUUFBUSxVQUFSLEVBQW9CSyxVQUFwQixDQUErQixFQUFDSSxPQUFPLElBQVIsRUFBY0MsT0FBTyxJQUFyQixFQUEyQkMsS0FBSyxLQUFoQyxFQUF1Q0MsTUFBTSxJQUE3QyxFQUEvQixFQUFtRk4sV0FBbkYsRUFBZ0dDLFNBQWhHLEVBQTJHQyxJQUEzRyxDQUFsQztBQUFBLENBQW5CO0FBQ0EsSUFBSUssVUFBVVIsV0FBVyxXQUFYLEVBQXdCLE1BQXhCLEVBQWdDLE9BQWhDLENBQWQ7O0FBRUEsSUFBSVMsZUFBZTtBQUNqQixVQUFRO0FBQ04sV0FBTztBQUNMQyxnQkFBVTtBQUNSLGdCQUFRO0FBQ05DLGVBQUs7QUFEQztBQURBO0FBREwsS0FERDtBQVFOQyxZQUFRO0FBQ04sMkJBQXFCO0FBQ25CQyxZQUFJLE1BRGU7QUFFbkJDLGdCQUFRLGdCQUZXO0FBR25CQyx1QkFBZSxFQUFDLFFBQVEsUUFBVCxFQUhJO0FBSW5CQyx3QkFBZ0IsRUFBQyxRQUFRLFFBQVQ7QUFKRyxPQURmO0FBT04sNkJBQXVCO0FBQ3JCSCxZQUFJLE1BRGlCO0FBRXJCQyxnQkFBUSxrQkFGYTtBQUdyQkMsdUJBQWUsRUFBQyxRQUFRLFFBQVQsRUFITTtBQUly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WSxJQUFYLENBQWdCLFdBQWhCLEVBQTZCLEVBQUMsa0JBQWtCLENBQW5CLEVBQTdCLEVBQW9EckQsSUFBcEQsQ0FGcUI7O0FBQUE7QUFFdENpRCw0QkFGc0M7O0FBRzFDL0Usc0JBQUVnRixJQUFGLENBQU9ELFFBQVAsRUFBaUIsRUFBQyxrQkFBa0IsQ0FBbkIsRUFBakIsRUFBd0Msb0JBQXhDO0FBQ0EvRSxzQkFBRWdGLElBQUYsQ0FBTy9DLFNBQVAsRUFBa0IsRUFBQyxrQkFBa0IsQ0FBbkIsRUFBbEIsRUFBeUMsa0JBQXpDO0FBQ0FqQyxzQkFBRStDLEdBQUY7O0FBTDBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXRDLENBeENMOztBQUFBO0FBQUE7QUFBQSwwQ0FnREssSUFBSTZCLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsbUJBQWFoQyxXQUFXZ0MsT0FBWCxFQUFvQixJQUFwQixDQUFiO0FBQUEsV0FBWixDQWhETDs7QUFBQTtBQWlERDdFLFlBQUUrQyxHQUFGO0FBQ0E7O0FBbERDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgsRUFxREdxQyxJQXJESCxDQXFEUTtBQUFBLFNBQU1DLFFBQVFDLElBQVIsRUFBTjtBQUFBLENBckRSIiwiZmlsZSI6Im5ldC50ZXN0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaWYgKCFnbG9iYWwuX2JhYmVsUG9seWZpbGwpcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKVxudmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuY29uc3QgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiByZXF1aXJlKCcuLi91dGlscycpLmdldENvbnNvbGUoe2Vycm9yOiB0cnVlLCBkZWJ1ZzogdHJ1ZSwgbG9nOiBmYWxzZSwgd2FybjogdHJ1ZX0sIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spXG52YXIgQ09OU09MRSA9IGdldENvbnNvbGUoJ0JBU0UgVEVTVCcsICctLS0tJywgJy0tLS0tJylcblxudmFyIHNoYXJlZENvbmZpZyA9IHtcbiAgJ25ldDEnOiB7XG4gICAgJ25ldCc6IHtcbiAgICAgIGNoYW5uZWxzOiB7XG4gICAgICAgICd0ZXN0Jzoge1xuICAgICAgICAgIHVybDogJ2xvY2FsaG9zdDo4MDgwJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBycGNPdXQ6IHtcbiAgICAgICd0ZXN0UnBjTm9SZXNwb25zZSc6IHtcbiAgICAgICAgdG86ICduZXQxJyxcbiAgICAgICAgbWV0aG9kOiAndGVzdE5vUmVzcG9uc2UnLFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH0sXG4gICAgICAndGVzdFJwY0Frbm93bGVnbWVudCc6IHtcbiAgICAgICAgdG86ICduZXQxJyxcbiAgICAgICAgbWV0aG9kOiAndGVzdEFrbm93bGVnbWVudCcsXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0UnBjUmVzcG9uc2UnOiB7XG4gICAgICAgIHRvOiAnbmV0MScsXG4gICAgICAgIG1ldGhvZDogJ3Rlc3RSZXNwb25zZScsXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0UnBjU3RyZWFtJzoge1xuICAgICAgICB0bzogJ25ldDEnLFxuICAgICAgICBtZXRob2Q6ICd0ZXN0U3RyZWFtJyxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9XG4gICAgfSxcbiAgICBldmVudHNPdXQ6IHtcbiAgICAgICd0ZXN0RXZlbnQnOiB7XG4gICAgICAgIG11bHRpcGxlUmVzcG9uc2U6IGZhbHNlLFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH1cbiAgICB9LFxuICAgICdldmVudHNJbic6IHtcbiAgICAgIHRlc3RFdmVudDoge1xuICAgICAgICBtZXRob2Q6ICd0ZXN0UmVzcG9uc2UnXG4gICAgICB9XG4gICAgfSxcbiAgICAnbWV0aG9kcyc6IHtcbiAgICAgICd0ZXN0Tm9SZXNwb25zZSc6IHtcbiAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdub1Jlc3BvbnNlJyxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9LFxuICAgICAgJ3Rlc3RBa25vd2xlZ21lbnQnOiB7XG4gICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnYWtub3dsZWdtZW50JyxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9LFxuICAgICAgJ3Rlc3RSZXNwb25zZSc6IHtcbiAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdyZXNwb25zZScsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0U3RyZWFtJzoge1xuICAgICAgICBwdWJsaWM6IHRydWUsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ3N0cmVhbScsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuc2hhcmVkQ29uZmlnLm5ldDIgPSBSLm1lcmdlKHNoYXJlZENvbmZpZy5uZXQxLCB7XG4gIG5ldDoge1xuICAgIGNoYW5uZWxzOiB7XG4gICAgICAndGVzdCc6IHtcbiAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODInXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAnZXZlbnRzLmxpc3Rlbic6IHtcbiAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgIG1ldGhvZDogJ3Rlc3RSZXNwb25zZSdcbiAgICB9XG4gIH1cbn0pXG5zaGFyZWRDb25maWcubmV0MyA9IFIubWVyZ2Uoc2hhcmVkQ29uZmlnLm5ldDEsIHtcbiAgbmV0OiB7XG4gICAgY2hhbm5lbHM6IHtcbiAgICAgICd0ZXN0Jzoge1xuICAgICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4MydcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICdldmVudHMubGlzdGVuJzoge1xuICAgIHRlc3RFdmVudDoge1xuICAgICAgbWV0aG9kOiAndGVzdE5vUmVzcG9uc2UnXG4gICAgfVxuICB9XG59KVxuc2hhcmVkQ29uZmlnLm5ldDQgPSBSLm1lcmdlKHNoYXJlZENvbmZpZy5uZXQxLCB7XG4gIG5ldDoge1xuICAgIGNoYW5uZWxzOiB7XG4gICAgICAndGVzdCc6IHtcbiAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODQnXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAnZXZlbnRzLmxpc3Rlbic6IHtcbiAgICB0ZXN0RXZlbnQ6IHtcbiAgICAgIG1ldGhvZDogJ3Rlc3RBa25vd2xlZ21lbnQnXG4gICAgfVxuICB9XG59KVxudmFyIG1ldGEgPSB7XG4gIGNvcnJpZDogJ3Rlc3RSZXF1ZXN0JyxcbiAgdXNlcmlkOiAndGVzdFVzZXInXG59XG5cbnZhciB0ZXN0Q2hlY2sgPSBmYWxzZVxudmFyIHN0cmVhbVxudmFyIE1ldGhvZHMgPSB7XG4gIHRlc3ROb1Jlc3BvbnNlOiBhc3luYyhkYXRhLCBtZXRhKSA9PiB7IENPTlNPTEUuZGVidWcoJ3Rlc3ROb1Jlc3BvbnNlJywge2RhdGEsIG1ldGF9KTsgdGVzdENoZWNrID0gZGF0YSB9LFxuICB0ZXN0QWtub3dsZWdtZW50OiBhc3luYyhkYXRhLCBtZXRhKSA9PiB7IHRlc3RDaGVjayA9IGRhdGEgfSxcbiAgdGVzdFJlc3BvbnNlOiBhc3luYyhkYXRhLCBtZXRhKSA9PiB7IHRlc3RDaGVjayA9IGRhdGE7IHJldHVybiBkYXRhIH0sXG4gIHRlc3RTdHJlYW06IChkYXRhLCBtZXRhLCBnZXRTdHJlYW0pID0+IHtcbiAgICBDT05TT0xFLmRlYnVnKCd0ZXN0U3RyZWFtJywge2RhdGEsIG1ldGEsIGdldFN0cmVhbX0pXG4gICAgdGVzdENoZWNrID0gZGF0YVxuICAgIHZhciBvbkNsb3NlID0gKCkgPT4geyBDT05TT0xFLmxvZygnc3RyZWFtIGNsb3NlZCcpIH1cbiAgICBzdHJlYW0gPSBnZXRTdHJlYW0ob25DbG9zZSwgMTIwMDAwKVxuICAgIHN0cmVhbS53cml0ZSh7dGVzdFN0cmVhbUNvbm5uZWN0ZWQ6IDF9KVxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLndyaXRlKHt0ZXN0U3RyZWFtRGF0YTogMX0pLCA1MDApXG4gICAgc2V0VGltZW91dCgoKSA9PiBzdHJlYW0uZW5kKCksIDEwMDApXG4gIH1cbn1cblxudmFyIGdldE1ldGhvZHMgPSAoc2VydmljZSwgZXhjbHVkZSkgPT4gTWV0aG9kc1xuXG52YXIgZ2V0U2hhcmVkQ29uZmlnID0gKGZpZWxkID0gJ25ldCcsIHNlcnZpY2UgPSAnKicsIGV4Y2x1ZGUgPSAnJykgPT4ge1xuICBpZiAoc2VydmljZSA9PT0gJyonKSByZXR1cm4gT2JqZWN0LmtleXMoc2hhcmVkQ29uZmlnKS5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBleGNsdWRlKS5tYXAoKGtleSkgPT4geyByZXR1cm4ge2l0ZW1zOiBzaGFyZWRDb25maWdba2V5XVtmaWVsZF0sIHNlcnZpY2U6IGtleX0gfSlcbiAgZWxzZSByZXR1cm4gc2hhcmVkQ29uZmlnW3NlcnZpY2VdW2ZpZWxkXVxufVxuXG5mdW5jdGlvbiBnZXRTZXJ2ZXIgKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQpIHtcbiAgdmFyIGdldE1ldGhvZHNDb25maWcgPSBhc3luYyAoc2VydmljZSwgZXhjbHVkZSkgPT4gZ2V0U2hhcmVkQ29uZmlnKCdtZXRob2RzJywgc2VydmljZSB8fCBzZXJ2aWNlTmFtZSwgZXhjbHVkZSlcbiAgdmFyIGdldE5ldENvbmZpZyA9IGFzeW5jIChzZXJ2aWNlLCBleGNsdWRlKSA9PiBnZXRTaGFyZWRDb25maWcoJ25ldCcsIHNlcnZpY2UgfHwgc2VydmljZU5hbWUsIGV4Y2x1ZGUpXG4gIHZhciBnZXRFdmVudHNJbiA9IGFzeW5jIChzZXJ2aWNlLCBleGNsdWRlKSA9PiBnZXRTaGFyZWRDb25maWcoJ2V2ZW50c0luJywgc2VydmljZSB8fCBzZXJ2aWNlTmFtZSwgZXhjbHVkZSlcbiAgdmFyIGdldEV2ZW50c091dCA9IGFzeW5jIChzZXJ2aWNlLCBleGNsdWRlKSA9PiBnZXRTaGFyZWRDb25maWcoJ2V2ZW50c091dCcsIHNlcnZpY2UgfHwgc2VydmljZU5hbWUsIGV4Y2x1ZGUpXG4gIHZhciBnZXRScGNPdXQgPSBhc3luYyAoc2VydmljZSwgZXhjbHVkZSkgPT4gZ2V0U2hhcmVkQ29uZmlnKCdycGNPdXQnLCBzZXJ2aWNlIHx8IHNlcnZpY2VOYW1lLCBleGNsdWRlKVxuICByZXR1cm4gcmVxdWlyZSgnLi4vbmV0LnNlcnZlcicpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBnZXRNZXRob2RzLCBnZXRNZXRob2RzQ29uZmlnLCBnZXROZXRDb25maWd9KVxufVxuXG5mdW5jdGlvbiBnZXRDbGllbnQgKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQpIHtcbiAgdmFyIGdldE1ldGhvZHNDb25maWcgPSBhc3luYyAoc2VydmljZSwgZXhjbHVkZSkgPT4gZ2V0U2hhcmVkQ29uZmlnKCdtZXRob2RzJywgc2VydmljZSB8fCBzZXJ2aWNlTmFtZSwgZXhjbHVkZSlcbiAgdmFyIGdldE5ldENvbmZpZyA9IGFzeW5jIChzZXJ2aWNlLCBleGNsdWRlKSA9PiBnZXRTaGFyZWRDb25maWcoJ25ldCcsIHNlcnZpY2UgfHwgc2VydmljZU5hbWUsIGV4Y2x1ZGUpXG4gIHZhciBnZXRFdmVudHNJbiA9IGFzeW5jIChzZXJ2aWNlLCBleGNsdWRlKSA9PiBnZXRTaGFyZWRDb25maWcoJ2V2ZW50c0luJywgc2VydmljZSB8fCBzZXJ2aWNlTmFtZSwgZXhjbHVkZSlcbiAgdmFyIGdldEV2ZW50c091dCA9IGFzeW5jIChzZXJ2aWNlLCBleGNsdWRlKSA9PiBnZXRTaGFyZWRDb25maWcoJ2V2ZW50c091dCcsIHNlcnZpY2UgfHwgc2VydmljZU5hbWUsIGV4Y2x1ZGUpXG4gIHZhciBnZXRScGNPdXQgPSBhc3luYyAoc2VydmljZSwgZXhjbHVkZSkgPT4gZ2V0U2hhcmVkQ29uZmlnKCdycGNPdXQnLCBzZXJ2aWNlIHx8IHNlcnZpY2VOYW1lLCBleGNsdWRlKVxuICByZXR1cm4gcmVxdWlyZSgnLi4vbmV0LmNsaWVudCcpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBnZXROZXRDb25maWcsIGdldEV2ZW50c0luLCBnZXRFdmVudHNPdXQsIGdldE1ldGhvZHNDb25maWcsIGdldFJwY091dH0pXG59XG5cbnZhciBuZXRTZXJ2ZXIxID0gZ2V0U2VydmVyKCduZXQxJywgJ25ldDEnKVxudmFyIG5ldFNlcnZlcjIgPSBnZXRTZXJ2ZXIoJ25ldDInLCAnbmV0MicpXG52YXIgbmV0U2VydmVyMyA9IGdldFNlcnZlcignbmV0MycsICduZXQzJylcbnZhciBuZXRTZXJ2ZXI0ID0gZ2V0U2VydmVyKCduZXQ0JywgJ25ldDQnKVxubmV0U2VydmVyMS5zdGFydCgpXG5uZXRTZXJ2ZXIyLnN0YXJ0KClcbm5ldFNlcnZlcjMuc3RhcnQoKVxubmV0U2VydmVyNC5zdGFydCgpXG5cbnZhciBuZXRDbGllbnQxID0gZ2V0Q2xpZW50KCduZXQxJywgJ25ldDEnKVxuXG50LnRlc3QoJyoqKiBORVQgKioqJywge1xuICBhdXRvZW5kOiB0cnVlXG59LCBhc3luYyBmdW5jdGlvbiBtYWluVGVzdCAodCkge1xuICB0LnBsYW4oNSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5ycGMgLT4gdGVzdE5vUmVzcG9uc2UnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoJ3Rlc3RScGNOb1Jlc3BvbnNlJywgeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIG51bGwsICdyZXNwb25zZT10cnVlIG9uIE5vUmVzcG9uc2UnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsndGVzdF9kYXRhJzogMX0sICd0ZXN0Tm9SZXNwb25zZSByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLnJwYyAtPiB0ZXN0QWtub3dsZWdtZW50JywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG5ldENsaWVudDEucnBjKCd0ZXN0UnBjQWtub3dsZWdtZW50Jywgeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIG51bGwsICdBa25vd2xlZ21lbnQgb2snKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsndGVzdF9kYXRhJzogMX0sICd0ZXN0QWtub3dsZWdtZW50IHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuICAvL1xuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3RSZXNwb25zZScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBuZXRDbGllbnQxLnJwYygndGVzdFJwY1Jlc3BvbnNlJywgeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSlcbiAgICB0LnNhbWUocmVzcG9uc2UsIHsndGVzdF9kYXRhJzogMX0sICdyZXNwb25zZSBhcyBzZW5kZWQnKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsndGVzdF9kYXRhJzogMX0sICd0ZXN0UmVzcG9uc2UgcmljaGllc3RhIHJpY2V2dXRhJylcbiAgICB0LmVuZCgpXG4gIH0pXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5ycGMgLT4gdGVzdFN0cmVhbScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgdGVzdFN0cmVhbSA9IGZhbHNlXG4gICAgdmFyIHN0cmVhbWluZyA9IGF3YWl0IG5ldENsaWVudDEucnBjKCd0ZXN0UnBjU3RyZWFtJywgeyd0ZXN0X2RhdGEnOiAxfSwgbWV0YSlcbiAgICBzdHJlYW1pbmcub24oJ2RhdGEnLCAoZGF0YSkgPT4geyBDT05TT0xFLmRlYnVnKCdzdHJlYW1pbmcgZGF0YScsIGRhdGEpOyB0ZXN0U3RyZWFtID0gdHJ1ZSB9KVxuICAgIHN0cmVhbWluZy5vbignZXJyb3InLCAoZGF0YSkgPT4gQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGVycm9yJywgZGF0YSkpXG4gICAgc3RyZWFtaW5nLm9uKCdlbmQnLCAoZGF0YSkgPT4gQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGNsb3NlJywgZGF0YSkpXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgICB0LnNhbWUodGVzdFN0cmVhbSwgdHJ1ZSwgJ1N0cmVhbSByZWNlaXZlZCcpXG4gICAgdC5zYW1lKHRlc3RDaGVjaywgeyd0ZXN0X2RhdGEnOiAxfSwgJ3Rlc3RTdHJlYW0gcmljaGllc3RhIHJpY2V2dXRhJylcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLmVtaXQgLT4gdGVzdEVtaXQnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5lbWl0KCd0ZXN0RXZlbnQnLCB7J2V2ZW50VGVzdF9kYXRhJzogMX0sIG1ldGEpXG4gICAgdC5zYW1lKHJlc3BvbnNlLCB7J2V2ZW50VGVzdF9kYXRhJzogMX0sICdyZXNwb25zZSBhcyBzZW5kZWQnKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsnZXZlbnRUZXN0X2RhdGEnOiAxfSwgJ2RlbGF5ZWQgcmVjZWl2ZWQnKVxuICAgIHQuZW5kKClcbiAgfSlcblxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgdC5lbmQoKVxuICAvLyBwcm9jZXNzLmV4aXQoKVxufSkudGhlbigoKSA9PiBwcm9jZXNzLmV4aXQoKSlcbiJdfQ==