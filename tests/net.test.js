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
// var Methods = {
//   testNoResponse: async(data, meta) => { CONSOLE.debug('testNoResponse', {data, meta}); testCheck = data },
//   testAknowlegment: async(data, meta) => { testCheck = data },
//   testResponse: async(data, meta) => { testCheck = data; return data },
//   testStream: (data, meta, getStream) => {
//     CONSOLE.debug('testStream', {data, meta, getStream})
//     testCheck = data
//     var onClose = () => { CONSOLE.log('stream closed') }
//     stream = getStream(onClose, 120000)
//     stream.write({testStreamConnnected: 1})
//     setTimeout(() => stream.write({testStreamData: 1}), 500)
//     setTimeout(() => stream.end(), 1000)
//   }
// }
var co = require('co');
var Methods = {
  testNoResponse: co.wrap(regeneratorRuntime.mark(function _callee(data, meta, getStream) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            testCheck = data;
          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  })),
  testAknowlegment: co.wrap(regeneratorRuntime.mark(function _callee2(data, meta, getStream) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            testCheck = data;
          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })),
  testResponse: co.wrap(regeneratorRuntime.mark(function _callee3(data, meta, getStream) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            });

          case 2:
            testCheck = data;
            return _context3.abrupt('return', data);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })),
  testStream: co.wrap(regeneratorRuntime.mark(function _callee4(data, meta, getStream) {
    var onClose;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            CONSOLE.debug('testStream', { data: data, meta: meta, getStream: getStream });
            testCheck = data;

            onClose = function onClose() {
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

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }))
};
co.wrap(regeneratorRuntime.mark(function _callee5(data, meta, getStream) {
  return regeneratorRuntime.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          testCheck = data;
        case 1:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee5, this);
}));

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

  var getMethodsConfig = function _callee6(service, exclude) {
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt('return', getSharedConfig('methods', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, _this);
  };
  var getNetConfig = function _callee7(service, exclude) {
    return regeneratorRuntime.async(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt('return', getSharedConfig('net', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context7.stop();
        }
      }
    }, null, _this);
  };
  var getEventsIn = function _callee8(service, exclude) {
    return regeneratorRuntime.async(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt('return', getSharedConfig('eventsIn', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context8.stop();
        }
      }
    }, null, _this);
  };
  var getEventsOut = function _callee9(service, exclude) {
    return regeneratorRuntime.async(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            return _context9.abrupt('return', getSharedConfig('eventsOut', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context9.stop();
        }
      }
    }, null, _this);
  };
  var getRpcOut = function _callee10(service, exclude) {
    return regeneratorRuntime.async(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            return _context10.abrupt('return', getSharedConfig('rpcOut', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context10.stop();
        }
      }
    }, null, _this);
  };
  return require('../net.server')({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, getMethods: getMethods, getMethodsConfig: getMethodsConfig, getNetConfig: getNetConfig });
}

function getClient(serviceName, serviceId) {
  var _this2 = this;

  var getMethodsConfig = function _callee11(service, exclude) {
    return regeneratorRuntime.async(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            return _context11.abrupt('return', getSharedConfig('methods', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context11.stop();
        }
      }
    }, null, _this2);
  };
  var getNetConfig = function _callee12(service, exclude) {
    return regeneratorRuntime.async(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            return _context12.abrupt('return', getSharedConfig('net', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context12.stop();
        }
      }
    }, null, _this2);
  };
  var getEventsIn = function _callee13(service, exclude) {
    return regeneratorRuntime.async(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            return _context13.abrupt('return', getSharedConfig('eventsIn', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context13.stop();
        }
      }
    }, null, _this2);
  };
  var getEventsOut = function _callee14(service, exclude) {
    return regeneratorRuntime.async(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            return _context14.abrupt('return', getSharedConfig('eventsOut', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context14.stop();
        }
      }
    }, null, _this2);
  };
  var getRpcOut = function _callee15(service, exclude) {
    return regeneratorRuntime.async(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            return _context15.abrupt('return', getSharedConfig('rpcOut', service || serviceName, exclude));

          case 1:
          case 'end':
            return _context15.stop();
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
  return regeneratorRuntime.async(function mainTest$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          t.plan(5);
          _context21.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 3:
          _context21.next = 5;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testNoResponse', function _callee16(t) {
            var response;
            return regeneratorRuntime.async(function _callee16$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    testCheck = false;
                    _context16.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc('testRpcNoResponse', { 'test_data': 1 }, meta));

                  case 3:
                    response = _context16.sent;

                    t.same(response, null, 'response=true on NoResponse');
                    _context16.next = 7;
                    return regeneratorRuntime.awrap(new Promise(function (resolve) {
                      return setTimeout(resolve, 1000);
                    }));

                  case 7:
                    t.same(testCheck, { 'test_data': 1 }, 'testNoResponse richiesta ricevuta');
                    t.end();

                  case 9:
                  case 'end':
                    return _context16.stop();
                }
              }
            }, null, this);
          }));

        case 5:
          _context21.next = 7;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testAknowlegment', function _callee17(t) {
            var response;
            return regeneratorRuntime.async(function _callee17$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    testCheck = false;
                    _context17.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc('testRpcAknowlegment', { 'test_data': 1 }, meta));

                  case 3:
                    response = _context17.sent;

                    t.same(response, null, 'Aknowlegment ok');
                    t.same(testCheck, { 'test_data': 1 }, 'testAknowlegment richiesta ricevuta');
                    t.end();

                  case 7:
                  case 'end':
                    return _context17.stop();
                }
              }
            }, null, this);
          }));

        case 7:
          _context21.next = 9;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testResponse', function _callee18(t) {
            var response;
            return regeneratorRuntime.async(function _callee18$(_context18) {
              while (1) {
                switch (_context18.prev = _context18.next) {
                  case 0:
                    testCheck = false;
                    _context18.next = 3;
                    return regeneratorRuntime.awrap(netClient1.rpc('testRpcResponse', { 'test_data': 1 }, meta));

                  case 3:
                    response = _context18.sent;

                    t.same(response, { 'test_data': 1 }, 'response as sended');
                    t.same(testCheck, { 'test_data': 1 }, 'testResponse richiesta ricevuta');
                    t.end();

                  case 7:
                  case 'end':
                    return _context18.stop();
                }
              }
            }, null, this);
          }));

        case 9:
          _context21.next = 11;
          return regeneratorRuntime.awrap(t.test('netClient1.rpc -> testStream', function _callee19(t) {
            var testStream, streaming;
            return regeneratorRuntime.async(function _callee19$(_context19) {
              while (1) {
                switch (_context19.prev = _context19.next) {
                  case 0:
                    testCheck = false;
                    testStream = false;
                    _context19.next = 4;
                    return regeneratorRuntime.awrap(netClient1.rpc('testRpcStream', { 'test_data': 1 }, meta));

                  case 4:
                    streaming = _context19.sent;

                    streaming.on('data', function (data) {
                      CONSOLE.debug('streaming data', data);testStream = true;
                    });
                    streaming.on('error', function (data) {
                      return CONSOLE.debug('streaming error', data);
                    });
                    streaming.on('end', function (data) {
                      return CONSOLE.debug('streaming close', data);
                    });

                    _context19.next = 10;
                    return regeneratorRuntime.awrap(new Promise(function (resolve) {
                      return setTimeout(resolve, 1000);
                    }));

                  case 10:
                    t.same(testStream, true, 'Stream received');
                    t.same(testCheck, { 'test_data': 1 }, 'testStream richiesta ricevuta');
                    t.end();

                  case 13:
                  case 'end':
                    return _context19.stop();
                }
              }
            }, null, this);
          }));

        case 11:
          _context21.next = 13;
          return regeneratorRuntime.awrap(t.test('netClient1.emit -> testEmit', function _callee20(t) {
            var response;
            return regeneratorRuntime.async(function _callee20$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    testCheck = false;
                    _context20.next = 3;
                    return regeneratorRuntime.awrap(netClient1.emit('testEvent', { 'eventTest_data': 1 }, meta));

                  case 3:
                    response = _context20.sent;

                    t.same(response, { 'eventTest_data': 1 }, 'response as sended');
                    t.same(testCheck, { 'eventTest_data': 1 }, 'delayed received');
                    t.end();

                  case 7:
                  case 'end':
                    return _context20.stop();
                }
              }
            }, null, this);
          }));

        case 13:
          _context21.next = 15;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 15:
          t.end();
          // process.exit()

        case 16:
        case 'end':
          return _context21.stop();
      }
    }
  }, null, this);
}).then(function () {
  return process.exit();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC50ZXN0LmVzNiJdLCJuYW1lcyI6WyJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsInJlcXVpcmUiLCJSIiwicmVxdWVzdCIsInQiLCJwYXRoIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsImVycm9yIiwiZGVidWciLCJsb2ciLCJ3YXJuIiwiQ09OU09MRSIsInNoYXJlZENvbmZpZyIsImNoYW5uZWxzIiwidXJsIiwicnBjT3V0IiwidG8iLCJtZXRob2QiLCJyZXF1ZXN0U2NoZW1hIiwicmVzcG9uc2VTY2hlbWEiLCJldmVudHNPdXQiLCJtdWx0aXBsZVJlc3BvbnNlIiwidGVzdEV2ZW50IiwicHVibGljIiwicmVzcG9uc2VUeXBlIiwibmV0MiIsIm1lcmdlIiwibmV0MSIsIm5ldCIsIm5ldDMiLCJuZXQ0IiwibWV0YSIsImNvcnJpZCIsInVzZXJpZCIsInRlc3RDaGVjayIsInN0cmVhbSIsImNvIiwiTWV0aG9kcyIsInRlc3ROb1Jlc3BvbnNlIiwid3JhcCIsImRhdGEiLCJnZXRTdHJlYW0iLCJ0ZXN0QWtub3dsZWdtZW50IiwidGVzdFJlc3BvbnNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwidGVzdFN0cmVhbSIsIm9uQ2xvc2UiLCJ3cml0ZSIsInRlc3RTdHJlYW1Db25ubmVjdGVkIiwidGVzdFN0cmVhbURhdGEiLCJlbmQiLCJnZXRNZXRob2RzIiwic2VydmljZSIsImV4Y2x1ZGUiLCJnZXRTaGFyZWRDb25maWciLCJmaWVsZCIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJrZXkiLCJtYXAiLCJpdGVtcyIsImdldFNlcnZlciIsImdldE1ldGhvZHNDb25maWciLCJnZXROZXRDb25maWciLCJnZXRFdmVudHNJbiIsImdldEV2ZW50c091dCIsImdldFJwY091dCIsImdldENsaWVudCIsIm5ldFNlcnZlcjEiLCJuZXRTZXJ2ZXIyIiwibmV0U2VydmVyMyIsIm5ldFNlcnZlcjQiLCJzdGFydCIsIm5ldENsaWVudDEiLCJ0ZXN0IiwiYXV0b2VuZCIsIm1haW5UZXN0IiwicGxhbiIsInJwYyIsInJlc3BvbnNlIiwic2FtZSIsInN0cmVhbWluZyIsIm9uIiwiZW1pdCIsInRoZW4iLCJwcm9jZXNzIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLENBQUNBLE9BQU9DLGNBQVosRUFBMkJDLFFBQVEsZ0JBQVI7QUFDM0IsSUFBSUMsSUFBSUQsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJRSxVQUFVRixRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlHLElBQUlILFFBQVEsS0FBUixDQUFSO0FBQ0EsSUFBSUksT0FBT0osUUFBUSxNQUFSLENBQVg7O0FBRUEsSUFBTUssYUFBYSxTQUFiQSxVQUFhLENBQUNDLFdBQUQsRUFBY0MsU0FBZCxFQUF5QkMsSUFBekI7QUFBQSxTQUFrQ1IsUUFBUSxVQUFSLEVBQW9CSyxVQUFwQixDQUErQixFQUFDSSxPQUFPLElBQVIsRUFBY0MsT0FBTyxJQUFyQixFQUEyQkMsS0FBSyxLQUFoQyxFQUF1Q0MsTUFBTSxJQUE3QyxFQUEvQixFQUFtRk4sV0FBbkYsRUFBZ0dDLFNBQWhHLEVBQTJHQyxJQUEzRyxDQUFsQztBQUFBLENBQW5CO0FBQ0EsSUFBSUssVUFBVVIsV0FBVyxXQUFYLEVBQXdCLE1BQXhCLEVBQWdDLE9BQWhDLENBQWQ7O0FBRUEsSUFBSVMsZUFBZTtBQUNqQixVQUFRO0FBQ04sV0FBTztBQUNMQyxnQkFBVTtBQUNSLGdCQUFRO0FBQ05DLGVBQUs7QUFEQztBQURBO0FBREwsS0FERDtBQVFOQyxZQUFRO0FBQ04sMkJBQXFCO0FBQ25CQyxZQUFJLE1BRGU7QUFFbkJDLGdCQUFRLGdCQUZXO0FBR25CQyx1QkFBZSxFQUFDLFFBQVEsUUFBVCxFQUhJO0FBSW5CQyx3QkFBZ0IsRUFBQyxRQUFRLFFBQVQ7QUFKRyxPQURmO0FBT04sNkJBQXVCO0FBQ3JCSCxZQUFJLE1BRGlCO0FBRXJCQyxnQkFBUSxrQkFGYTtBQUdyQkMsdUJBQWUsRUFBQyxRQUFRLFFB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QSxXQUFaLENBaERMOztBQUFBO0FBaURENUMsWUFBRW1ELEdBQUY7QUFDQTs7QUFsREM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FGSCxFQXFER21DLElBckRILENBcURRO0FBQUEsU0FBTUMsUUFBUUMsSUFBUixFQUFOO0FBQUEsQ0FyRFIiLCJmaWxlIjoibmV0LnRlc3QuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5pZiAoIWdsb2JhbC5fYmFiZWxQb2x5ZmlsbClyZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpXG52YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpXG52YXIgdCA9IHJlcXVpcmUoJ3RhcCcpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IHJlcXVpcmUoJy4uL3V0aWxzJykuZ2V0Q29uc29sZSh7ZXJyb3I6IHRydWUsIGRlYnVnOiB0cnVlLCBsb2c6IGZhbHNlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbnZhciBDT05TT0xFID0gZ2V0Q29uc29sZSgnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxuXG52YXIgc2hhcmVkQ29uZmlnID0ge1xuICAnbmV0MSc6IHtcbiAgICAnbmV0Jzoge1xuICAgICAgY2hhbm5lbHM6IHtcbiAgICAgICAgJ3Rlc3QnOiB7XG4gICAgICAgICAgdXJsOiAnbG9jYWxob3N0OjgwODAnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJwY091dDoge1xuICAgICAgJ3Rlc3RScGNOb1Jlc3BvbnNlJzoge1xuICAgICAgICB0bzogJ25ldDEnLFxuICAgICAgICBtZXRob2Q6ICd0ZXN0Tm9SZXNwb25zZScsXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfSxcbiAgICAgICd0ZXN0UnBjQWtub3dsZWdtZW50Jzoge1xuICAgICAgICB0bzogJ25ldDEnLFxuICAgICAgICBtZXRob2Q6ICd0ZXN0QWtub3dsZWdtZW50JyxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9LFxuICAgICAgJ3Rlc3RScGNSZXNwb25zZSc6IHtcbiAgICAgICAgdG86ICduZXQxJyxcbiAgICAgICAgbWV0aG9kOiAndGVzdFJlc3BvbnNlJyxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9LFxuICAgICAgJ3Rlc3RScGNTdHJlYW0nOiB7XG4gICAgICAgIHRvOiAnbmV0MScsXG4gICAgICAgIG1ldGhvZDogJ3Rlc3RTdHJlYW0nLFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J30sXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH1cbiAgICB9LFxuICAgIGV2ZW50c091dDoge1xuICAgICAgJ3Rlc3RFdmVudCc6IHtcbiAgICAgICAgbXVsdGlwbGVSZXNwb25zZTogZmFsc2UsXG4gICAgICAgIHJlcXVlc3RTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2V2ZW50c0luJzoge1xuICAgICAgdGVzdEV2ZW50OiB7XG4gICAgICAgIG1ldGhvZDogJ3Rlc3RSZXNwb25zZSdcbiAgICAgIH1cbiAgICB9LFxuICAgICdtZXRob2RzJzoge1xuICAgICAgJ3Rlc3ROb1Jlc3BvbnNlJzoge1xuICAgICAgICBwdWJsaWM6IHRydWUsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ25vUmVzcG9uc2UnLFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH0sXG4gICAgICAndGVzdEFrbm93bGVnbWVudCc6IHtcbiAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdha25vd2xlZ21lbnQnLFxuICAgICAgICByZXNwb25zZVNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9LFxuICAgICAgICByZXF1ZXN0U2NoZW1hOiB7J3R5cGUnOiAnb2JqZWN0J31cbiAgICAgIH0sXG4gICAgICAndGVzdFJlc3BvbnNlJzoge1xuICAgICAgICBwdWJsaWM6IHRydWUsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ3Jlc3BvbnNlJyxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9LFxuICAgICAgJ3Rlc3RTdHJlYW0nOiB7XG4gICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnc3RyZWFtJyxcbiAgICAgICAgcmVzcG9uc2VTY2hlbWE6IHsndHlwZSc6ICdvYmplY3QnfSxcbiAgICAgICAgcmVxdWVzdFNjaGVtYTogeyd0eXBlJzogJ29iamVjdCd9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5zaGFyZWRDb25maWcubmV0MiA9IFIubWVyZ2Uoc2hhcmVkQ29uZmlnLm5ldDEsIHtcbiAgbmV0OiB7XG4gICAgY2hhbm5lbHM6IHtcbiAgICAgICd0ZXN0Jzoge1xuICAgICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4MidcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICdldmVudHMubGlzdGVuJzoge1xuICAgIHRlc3RFdmVudDoge1xuICAgICAgbWV0aG9kOiAndGVzdFJlc3BvbnNlJ1xuICAgIH1cbiAgfVxufSlcbnNoYXJlZENvbmZpZy5uZXQzID0gUi5tZXJnZShzaGFyZWRDb25maWcubmV0MSwge1xuICBuZXQ6IHtcbiAgICBjaGFubmVsczoge1xuICAgICAgJ3Rlc3QnOiB7XG4gICAgICAgIHVybDogJ2xvY2FsaG9zdDo4MDgzJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJ2V2ZW50cy5saXN0ZW4nOiB7XG4gICAgdGVzdEV2ZW50OiB7XG4gICAgICBtZXRob2Q6ICd0ZXN0Tm9SZXNwb25zZSdcbiAgICB9XG4gIH1cbn0pXG5zaGFyZWRDb25maWcubmV0NCA9IFIubWVyZ2Uoc2hhcmVkQ29uZmlnLm5ldDEsIHtcbiAgbmV0OiB7XG4gICAgY2hhbm5lbHM6IHtcbiAgICAgICd0ZXN0Jzoge1xuICAgICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4NCdcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICdldmVudHMubGlzdGVuJzoge1xuICAgIHRlc3RFdmVudDoge1xuICAgICAgbWV0aG9kOiAndGVzdEFrbm93bGVnbWVudCdcbiAgICB9XG4gIH1cbn0pXG52YXIgbWV0YSA9IHtcbiAgY29ycmlkOiAndGVzdFJlcXVlc3QnLFxuICB1c2VyaWQ6ICd0ZXN0VXNlcidcbn1cblxudmFyIHRlc3RDaGVjayA9IGZhbHNlXG52YXIgc3RyZWFtXG4vLyB2YXIgTWV0aG9kcyA9IHtcbi8vICAgdGVzdE5vUmVzcG9uc2U6IGFzeW5jKGRhdGEsIG1ldGEpID0+IHsgQ09OU09MRS5kZWJ1ZygndGVzdE5vUmVzcG9uc2UnLCB7ZGF0YSwgbWV0YX0pOyB0ZXN0Q2hlY2sgPSBkYXRhIH0sXG4vLyAgIHRlc3RBa25vd2xlZ21lbnQ6IGFzeW5jKGRhdGEsIG1ldGEpID0+IHsgdGVzdENoZWNrID0gZGF0YSB9LFxuLy8gICB0ZXN0UmVzcG9uc2U6IGFzeW5jKGRhdGEsIG1ldGEpID0+IHsgdGVzdENoZWNrID0gZGF0YTsgcmV0dXJuIGRhdGEgfSxcbi8vICAgdGVzdFN0cmVhbTogKGRhdGEsIG1ldGEsIGdldFN0cmVhbSkgPT4ge1xuLy8gICAgIENPTlNPTEUuZGVidWcoJ3Rlc3RTdHJlYW0nLCB7ZGF0YSwgbWV0YSwgZ2V0U3RyZWFtfSlcbi8vICAgICB0ZXN0Q2hlY2sgPSBkYXRhXG4vLyAgICAgdmFyIG9uQ2xvc2UgPSAoKSA9PiB7IENPTlNPTEUubG9nKCdzdHJlYW0gY2xvc2VkJykgfVxuLy8gICAgIHN0cmVhbSA9IGdldFN0cmVhbShvbkNsb3NlLCAxMjAwMDApXG4vLyAgICAgc3RyZWFtLndyaXRlKHt0ZXN0U3RyZWFtQ29ubm5lY3RlZDogMX0pXG4vLyAgICAgc2V0VGltZW91dCgoKSA9PiBzdHJlYW0ud3JpdGUoe3Rlc3RTdHJlYW1EYXRhOiAxfSksIDUwMClcbi8vICAgICBzZXRUaW1lb3V0KCgpID0+IHN0cmVhbS5lbmQoKSwgMTAwMClcbi8vICAgfVxuLy8gfVxudmFyIGNvID0gcmVxdWlyZSgnY28nKVxudmFyIE1ldGhvZHMgPSB7XG4gIHRlc3ROb1Jlc3BvbnNlOiBjby53cmFwKGZ1bmN0aW9uKiAoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtKSB7IHRlc3RDaGVjayA9IGRhdGEgfSksXG4gIHRlc3RBa25vd2xlZ21lbnQ6IGNvLndyYXAoZnVuY3Rpb24qIChkYXRhLCBtZXRhLCBnZXRTdHJlYW0pIHsgdGVzdENoZWNrID0gZGF0YSB9KSxcbiAgdGVzdFJlc3BvbnNlOiBjby53cmFwKGZ1bmN0aW9uKiAoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtKSB7XG4gICAgeWllbGQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gICAgdGVzdENoZWNrID0gZGF0YVxuICAgIHJldHVybiBkYXRhXG4gIH0pLFxuICB0ZXN0U3RyZWFtOiBjby53cmFwKGZ1bmN0aW9uKiAoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtKSB7XG4gICAgQ09OU09MRS5kZWJ1ZygndGVzdFN0cmVhbScsIHtkYXRhLCBtZXRhLCBnZXRTdHJlYW19KVxuICAgIHRlc3RDaGVjayA9IGRhdGFcbiAgICB2YXIgb25DbG9zZSA9ICgpID0+IHsgQ09OU09MRS5sb2coJ3N0cmVhbSBjbG9zZWQnKSB9XG4gICAgc3RyZWFtID0gZ2V0U3RyZWFtKG9uQ2xvc2UsIDEyMDAwMClcbiAgICBzdHJlYW0ud3JpdGUoe3Rlc3RTdHJlYW1Db25ubmVjdGVkOiAxfSlcbiAgICBzZXRUaW1lb3V0KCgpID0+IHN0cmVhbS53cml0ZSh7dGVzdFN0cmVhbURhdGE6IDF9KSwgNTAwKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLmVuZCgpLCAxMDAwKVxuICB9KVxufVxuY28ud3JhcChmdW5jdGlvbiogKGRhdGEsIG1ldGEsIGdldFN0cmVhbSkgeyB0ZXN0Q2hlY2sgPSBkYXRhIH0pXG5cbnZhciBnZXRNZXRob2RzID0gKHNlcnZpY2UsIGV4Y2x1ZGUpID0+IE1ldGhvZHNcblxudmFyIGdldFNoYXJlZENvbmZpZyA9IChmaWVsZCA9ICduZXQnLCBzZXJ2aWNlID0gJyonLCBleGNsdWRlID0gJycpID0+IHtcbiAgaWYgKHNlcnZpY2UgPT09ICcqJykgcmV0dXJuIE9iamVjdC5rZXlzKHNoYXJlZENvbmZpZykuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gZXhjbHVkZSkubWFwKChrZXkpID0+IHsgcmV0dXJuIHtpdGVtczogc2hhcmVkQ29uZmlnW2tleV1bZmllbGRdLCBzZXJ2aWNlOiBrZXl9IH0pXG4gIGVsc2UgcmV0dXJuIHNoYXJlZENvbmZpZ1tzZXJ2aWNlXVtmaWVsZF1cbn1cblxuZnVuY3Rpb24gZ2V0U2VydmVyIChzZXJ2aWNlTmFtZSwgc2VydmljZUlkKSB7XG4gIHZhciBnZXRNZXRob2RzQ29uZmlnID0gYXN5bmMgKHNlcnZpY2UsIGV4Y2x1ZGUpID0+IGdldFNoYXJlZENvbmZpZygnbWV0aG9kcycsIHNlcnZpY2UgfHwgc2VydmljZU5hbWUsIGV4Y2x1ZGUpXG4gIHZhciBnZXROZXRDb25maWcgPSBhc3luYyAoc2VydmljZSwgZXhjbHVkZSkgPT4gZ2V0U2hhcmVkQ29uZmlnKCduZXQnLCBzZXJ2aWNlIHx8IHNlcnZpY2VOYW1lLCBleGNsdWRlKVxuICB2YXIgZ2V0RXZlbnRzSW4gPSBhc3luYyAoc2VydmljZSwgZXhjbHVkZSkgPT4gZ2V0U2hhcmVkQ29uZmlnKCdldmVudHNJbicsIHNlcnZpY2UgfHwgc2VydmljZU5hbWUsIGV4Y2x1ZGUpXG4gIHZhciBnZXRFdmVudHNPdXQgPSBhc3luYyAoc2VydmljZSwgZXhjbHVkZSkgPT4gZ2V0U2hhcmVkQ29uZmlnKCdldmVudHNPdXQnLCBzZXJ2aWNlIHx8IHNlcnZpY2VOYW1lLCBleGNsdWRlKVxuICB2YXIgZ2V0UnBjT3V0ID0gYXN5bmMgKHNlcnZpY2UsIGV4Y2x1ZGUpID0+IGdldFNoYXJlZENvbmZpZygncnBjT3V0Jywgc2VydmljZSB8fCBzZXJ2aWNlTmFtZSwgZXhjbHVkZSlcbiAgcmV0dXJuIHJlcXVpcmUoJy4uL25ldC5zZXJ2ZXInKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZ2V0TWV0aG9kcywgZ2V0TWV0aG9kc0NvbmZpZywgZ2V0TmV0Q29uZmlnfSlcbn1cblxuZnVuY3Rpb24gZ2V0Q2xpZW50IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkKSB7XG4gIHZhciBnZXRNZXRob2RzQ29uZmlnID0gYXN5bmMgKHNlcnZpY2UsIGV4Y2x1ZGUpID0+IGdldFNoYXJlZENvbmZpZygnbWV0aG9kcycsIHNlcnZpY2UgfHwgc2VydmljZU5hbWUsIGV4Y2x1ZGUpXG4gIHZhciBnZXROZXRDb25maWcgPSBhc3luYyAoc2VydmljZSwgZXhjbHVkZSkgPT4gZ2V0U2hhcmVkQ29uZmlnKCduZXQnLCBzZXJ2aWNlIHx8IHNlcnZpY2VOYW1lLCBleGNsdWRlKVxuICB2YXIgZ2V0RXZlbnRzSW4gPSBhc3luYyAoc2VydmljZSwgZXhjbHVkZSkgPT4gZ2V0U2hhcmVkQ29uZmlnKCdldmVudHNJbicsIHNlcnZpY2UgfHwgc2VydmljZU5hbWUsIGV4Y2x1ZGUpXG4gIHZhciBnZXRFdmVudHNPdXQgPSBhc3luYyAoc2VydmljZSwgZXhjbHVkZSkgPT4gZ2V0U2hhcmVkQ29uZmlnKCdldmVudHNPdXQnLCBzZXJ2aWNlIHx8IHNlcnZpY2VOYW1lLCBleGNsdWRlKVxuICB2YXIgZ2V0UnBjT3V0ID0gYXN5bmMgKHNlcnZpY2UsIGV4Y2x1ZGUpID0+IGdldFNoYXJlZENvbmZpZygncnBjT3V0Jywgc2VydmljZSB8fCBzZXJ2aWNlTmFtZSwgZXhjbHVkZSlcbiAgcmV0dXJuIHJlcXVpcmUoJy4uL25ldC5jbGllbnQnKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZ2V0TmV0Q29uZmlnLCBnZXRFdmVudHNJbiwgZ2V0RXZlbnRzT3V0LCBnZXRNZXRob2RzQ29uZmlnLCBnZXRScGNPdXR9KVxufVxuXG52YXIgbmV0U2VydmVyMSA9IGdldFNlcnZlcignbmV0MScsICduZXQxJylcbnZhciBuZXRTZXJ2ZXIyID0gZ2V0U2VydmVyKCduZXQyJywgJ25ldDInKVxudmFyIG5ldFNlcnZlcjMgPSBnZXRTZXJ2ZXIoJ25ldDMnLCAnbmV0MycpXG52YXIgbmV0U2VydmVyNCA9IGdldFNlcnZlcignbmV0NCcsICduZXQ0Jylcbm5ldFNlcnZlcjEuc3RhcnQoKVxubmV0U2VydmVyMi5zdGFydCgpXG5uZXRTZXJ2ZXIzLnN0YXJ0KClcbm5ldFNlcnZlcjQuc3RhcnQoKVxuXG52YXIgbmV0Q2xpZW50MSA9IGdldENsaWVudCgnbmV0MScsICduZXQxJylcblxudC50ZXN0KCcqKiogTkVUICoqKicsIHtcbiAgYXV0b2VuZDogdHJ1ZVxufSwgYXN5bmMgZnVuY3Rpb24gbWFpblRlc3QgKHQpIHtcbiAgdC5wbGFuKDUpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3ROb1Jlc3BvbnNlJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG5ldENsaWVudDEucnBjKCd0ZXN0UnBjTm9SZXNwb25zZScsIHsndGVzdF9kYXRhJzogMX0sIG1ldGEpXG4gICAgdC5zYW1lKHJlc3BvbnNlLCBudWxsLCAncmVzcG9uc2U9dHJ1ZSBvbiBOb1Jlc3BvbnNlJylcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdE5vUmVzcG9uc2UgcmljaGllc3RhIHJpY2V2dXRhJylcbiAgICB0LmVuZCgpXG4gIH0pXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5ycGMgLT4gdGVzdEFrbm93bGVnbWVudCcsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdGVzdENoZWNrID0gZmFsc2VcbiAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBuZXRDbGllbnQxLnJwYygndGVzdFJwY0Frbm93bGVnbWVudCcsIHsndGVzdF9kYXRhJzogMX0sIG1ldGEpXG4gICAgdC5zYW1lKHJlc3BvbnNlLCBudWxsLCAnQWtub3dsZWdtZW50IG9rJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdEFrbm93bGVnbWVudCByaWNoaWVzdGEgcmljZXZ1dGEnKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgLy9cbiAgYXdhaXQgdC50ZXN0KCduZXRDbGllbnQxLnJwYyAtPiB0ZXN0UmVzcG9uc2UnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbmV0Q2xpZW50MS5ycGMoJ3Rlc3RScGNSZXNwb25zZScsIHsndGVzdF9kYXRhJzogMX0sIG1ldGEpXG4gICAgdC5zYW1lKHJlc3BvbnNlLCB7J3Rlc3RfZGF0YSc6IDF9LCAncmVzcG9uc2UgYXMgc2VuZGVkJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J3Rlc3RfZGF0YSc6IDF9LCAndGVzdFJlc3BvbnNlIHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuICBhd2FpdCB0LnRlc3QoJ25ldENsaWVudDEucnBjIC0+IHRlc3RTdHJlYW0nLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHRlc3RDaGVjayA9IGZhbHNlXG4gICAgdmFyIHRlc3RTdHJlYW0gPSBmYWxzZVxuICAgIHZhciBzdHJlYW1pbmcgPSBhd2FpdCBuZXRDbGllbnQxLnJwYygndGVzdFJwY1N0cmVhbScsIHsndGVzdF9kYXRhJzogMX0sIG1ldGEpXG4gICAgc3RyZWFtaW5nLm9uKCdkYXRhJywgKGRhdGEpID0+IHsgQ09OU09MRS5kZWJ1Zygnc3RyZWFtaW5nIGRhdGEnLCBkYXRhKTsgdGVzdFN0cmVhbSA9IHRydWUgfSlcbiAgICBzdHJlYW1pbmcub24oJ2Vycm9yJywgKGRhdGEpID0+IENPTlNPTEUuZGVidWcoJ3N0cmVhbWluZyBlcnJvcicsIGRhdGEpKVxuICAgIHN0cmVhbWluZy5vbignZW5kJywgKGRhdGEpID0+IENPTlNPTEUuZGVidWcoJ3N0cmVhbWluZyBjbG9zZScsIGRhdGEpKVxuXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gICAgdC5zYW1lKHRlc3RTdHJlYW0sIHRydWUsICdTdHJlYW0gcmVjZWl2ZWQnKVxuICAgIHQuc2FtZSh0ZXN0Q2hlY2ssIHsndGVzdF9kYXRhJzogMX0sICd0ZXN0U3RyZWFtIHJpY2hpZXN0YSByaWNldnV0YScpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIGF3YWl0IHQudGVzdCgnbmV0Q2xpZW50MS5lbWl0IC0+IHRlc3RFbWl0JywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB0ZXN0Q2hlY2sgPSBmYWxzZVxuICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG5ldENsaWVudDEuZW1pdCgndGVzdEV2ZW50JywgeydldmVudFRlc3RfZGF0YSc6IDF9LCBtZXRhKVxuICAgIHQuc2FtZShyZXNwb25zZSwgeydldmVudFRlc3RfZGF0YSc6IDF9LCAncmVzcG9uc2UgYXMgc2VuZGVkJylcbiAgICB0LnNhbWUodGVzdENoZWNrLCB7J2V2ZW50VGVzdF9kYXRhJzogMX0sICdkZWxheWVkIHJlY2VpdmVkJylcbiAgICB0LmVuZCgpXG4gIH0pXG5cbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIHQuZW5kKClcbiAgLy8gcHJvY2Vzcy5leGl0KClcbn0pLnRoZW4oKCkgPT4gcHJvY2Vzcy5leGl0KCkpXG4iXX0=