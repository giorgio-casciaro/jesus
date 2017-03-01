'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var grpc = require('grpc');
var zlib = require('zlib');
var PACKAGE = 'net.server';
var checkRequired = require('./jesus').checkRequired;

// MESSAGE SERIALIZATION
var serializedDataByte = 0;
var serializeFunction = function serializeFunction(obj, dictionary) {
  return zlib.deflateSync(JSON.stringify(obj), { dictionary: dictionary });
};
var deserializeFunction = function deserializeFunction(obj, dictionary) {
  return JSON.parse(zlib.inflateSync(obj, { dictionary: dictionary }));
};
function serializeJson(obj) {
  var result = serializeFunction(obj);
  serializedDataByte += result.byteLength;
  return result;
}
function deserializeJson(buffer) {
  var result = deserializeFunction(buffer);
  return result;
}
var grpcService = {
  message: {
    path: 'message',
    requestStream: false,
    responseStream: false,
    requestSerialize: serializeJson,
    requestDeserialize: deserializeJson,
    responseSerialize: serializeJson,
    responseDeserialize: deserializeJson
  },
  messageMulti: {
    path: 'messageMulti',
    requestStream: false,
    responseStream: false,
    requestSerialize: serializeJson,
    requestDeserialize: deserializeJson,
    responseSerialize: serializeJson,
    responseDeserialize: deserializeJson
  }
};

module.exports = function getNetServerPackage(_ref) {
  var getConsole = _ref.getConsole,
      serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      netUrl = _ref.netUrl,
      getMethods = _ref.getMethods,
      getSharedConfig = _ref.getSharedConfig;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);
  var defaultListeners = {
    '_rpcCall': {
      'haveResponse': true
    }
    // '_messageMulti': {
    //   'haveResponse': false
    // }
  };

  function messageCall(requestData) {
    var event, eventsListenConfig, eventConfig, from, methodName, service, method, data, meta, response;
    return regeneratorRuntime.async(function messageCall$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            event = requestData.event;
            _context.t0 = Object;
            _context.t1 = {};
            _context.t2 = defaultListeners;
            _context.next = 6;
            return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'events.listen'));

          case 6:
            _context.t3 = _context.sent;
            eventsListenConfig = _context.t0.assign.call(_context.t0, _context.t1, _context.t2, _context.t3);
            _context.t4 = CONSOLE;
            _context.t5 = serviceName;
            _context.next = 12;
            return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'events.listen'));

          case 12:
            _context.t6 = _context.sent;
            _context.t7 = eventsListenConfig;
            _context.t8 = {
              serviceName: _context.t5,
              getSharedConfig: _context.t6,
              eventsListenConfig: _context.t7
            };

            _context.t4.debug.call(_context.t4, 'eventsListenConfig', _context.t8);

            if (!(!eventsListenConfig[event] && !eventsListenConfig['*'])) {
              _context.next = 18;
              break;
            }

            return _context.abrupt('return', CONSOLE.warn(netUrl, event + ' event not defined in /events.listen.json'));

          case 18:
            eventConfig = eventsListenConfig[event] || eventsListenConfig['*'];
            from = requestData.serviceName;
            methodName = requestData.method;
            service = getMethods();

            if (service[methodName]) {
              _context.next = 24;
              break;
            }

            throw methodName + ' is not valid';

          case 24:
            method = service[methodName];
            data = requestData.data;
            meta = {
              type: 'netEvent',
              from: from,
              requestId: requestData.requestId || uuidV4(),
              userId: requestData.userId,
              methodName: methodName,
              event: event,
              timestamp: Date.now()
            };

            CONSOLE.debug('message received ' + methodName + ' requestId:' + meta.requestId, { eventConfig: eventConfig });

            if (!eventConfig.haveResponse) {
              _context.next = 43;
              break;
            }

            _context.prev = 29;
            _context.next = 32;
            return regeneratorRuntime.awrap(method(data, meta));

          case 32:
            response = _context.sent;

            CONSOLE.debug('message response ' + methodName, { response: response });
            return _context.abrupt('return', response);

          case 37:
            _context.prev = 37;
            _context.t9 = _context['catch'](29);

            CONSOLE.warn('message error ' + methodName, { error: _context.t9 });
            return _context.abrupt('return', _context.t9);

          case 41:
            _context.next = 46;
            break;

          case 43:
            CONSOLE.debug('message aknowlegment ' + methodName);
            method(data, meta);
            return _context.abrupt('return', { aknowlegment: true });

          case 46:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this, [[29, 37]]);
  }
  try {
    var serviceServer;

    var _ret = function () {
      var start = function _callee() {
        var grpcServiceFunctions;
        return regeneratorRuntime.async(function _callee$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                grpcServiceFunctions = {
                  message: function message(call, callback) {
                    var response;
                    return regeneratorRuntime.async(function message$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return regeneratorRuntime.awrap(messageCall(call.request));

                          case 3:
                            response = _context2.sent;

                            CONSOLE.debug('message response', { request: call.request, response: response });
                            callback(null, response);
                            _context2.next = 12;
                            break;

                          case 8:
                            _context2.prev = 8;
                            _context2.t0 = _context2['catch'](0);

                            CONSOLE.error('message error', _context2.t0);
                            callback(_context2.t0, null);

                          case 12:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, null, this, [[0, 8]]);
                  },
                  messageMulti: function messageMulti(call, callback) {
                    var promises;
                    return regeneratorRuntime.async(function messageMulti$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            callback(null, null);

                            promises = [];

                            call.request.data.messages.forEach(function (_ref2) {
                              var data = _ref2.data,
                                  meta = _ref2.meta;

                              var reqData = Object.assign({}, call.request, { data: data, meta: meta });
                              CONSOLE.debug('messageMulti reqData ', reqData);
                              promises.push(messageCall(reqData, callback));
                            });
                            _context3.next = 5;
                            return regeneratorRuntime.awrap(Promise.all(promises));

                          case 5:
                            return _context3.abrupt('return', _context3.sent);

                          case 6:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, null, this);
                  }
                };

                serviceServer = new grpc.Server();
                serviceServer.addService(grpcService, grpcServiceFunctions);
                serviceServer.bind(netUrl, grpc.ServerCredentials.createInsecure());
                serviceServer.start();
                CONSOLE.debug('Net started on port:' + netUrl);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, null, this);
      };

      checkRequired({ serviceName: serviceName, serviceId: serviceId, netUrl: netUrl, getMethods: getMethods, getSharedConfig: getSharedConfig });

      return {
        v: {
          getSerializedDataByte: function getSerializedDataByte() {
            return serializedDataByte;
          },
          resetSerializedDataByte: function resetSerializedDataByte() {
            serializedDataByte = 0;
          },
          setSerializeFunction: function setSerializeFunction(newFunc) {
            serializeFunction = newFunc;
          },
          setDeserializeFunction: function setDeserializeFunction(newFunc) {
            deserializeFunction = newFunc;
          },

          start: start,
          stop: function stop() {
            serviceServer.tryShutdown(function () {});
          },
          restart: function restart() {
            serviceServer.tryShutdown(start);
          }
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    errorThrow('getNetServerPackage', { error: error, netUrl: netUrl, getSharedConfig: getSharedConfig });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbImdycGMiLCJyZXF1aXJlIiwiemxpYiIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwic2VyaWFsaXplZERhdGFCeXRlIiwic2VyaWFsaXplRnVuY3Rpb24iLCJvYmoiLCJkaWN0aW9uYXJ5IiwiZGVmbGF0ZVN5bmMiLCJKU09OIiwic3RyaW5naWZ5IiwiZGVzZXJpYWxpemVGdW5jdGlvbiIsInBhcnNlIiwiaW5mbGF0ZVN5bmMiLCJzZXJpYWxpemVKc29uIiwicmVzdWx0IiwiYnl0ZUxlbmd0aCIsImRlc2VyaWFsaXplSnNvbiIsImJ1ZmZlciIsImdycGNTZXJ2aWNlIiwibWVzc2FnZSIsInBhdGgiLCJyZXF1ZXN0U3RyZWFtIiwicmVzcG9uc2VTdHJlYW0iLCJyZXF1ZXN0U2VyaWFsaXplIiwicmVxdWVzdERlc2VyaWFsaXplIiwicmVzcG9uc2VTZXJpYWxpemUiLCJyZXNwb25zZURlc2VyaWFsaXplIiwibWVzc2FnZU11bHRpIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldFNlcnZlclBhY2thZ2UiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJuZXRVcmwiLCJnZXRNZXRob2RzIiwiZ2V0U2hhcmVkQ29uZmlnIiwiQ09OU09MRSIsImVycm9yVGhyb3ciLCJkZWZhdWx0TGlzdGVuZXJzIiwibWVzc2FnZUNhbGwiLCJyZXF1ZXN0RGF0YSIsImV2ZW50IiwiT2JqZWN0IiwiZXZlbnRzTGlzdGVuQ29uZmlnIiwiYXNzaWduIiwiZGVidWciLCJ3YXJuIiwiZXZlbnRDb25maWciLCJmcm9tIiwibWV0aG9kTmFtZSIsIm1ldGhvZCIsInNlcnZpY2UiLCJkYXRhIiwibWV0YSIsInR5cGUiLCJyZXF1ZXN0SWQiLCJ1dWlkVjQiLCJ1c2VySWQiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiaGF2ZVJlc3BvbnNlIiwicmVzcG9uc2UiLCJlcnJvciIsImFrbm93bGVnbWVudCIsInNlcnZpY2VTZXJ2ZXIiLCJzdGFydCIsImdycGNTZXJ2aWNlRnVuY3Rpb25zIiwiY2FsbCIsImNhbGxiYWNrIiwicmVxdWVzdCIsInByb21pc2VzIiwibWVzc2FnZXMiLCJmb3JFYWNoIiwicmVxRGF0YSIsInB1c2giLCJQcm9taXNlIiwiYWxsIiwiU2VydmVyIiwiYWRkU2VydmljZSIsImJpbmQiLCJTZXJ2ZXJDcmVkZW50aWFscyIsImNyZWF0ZUluc2VjdXJlIiwiZ2V0U2VyaWFsaXplZERhdGFCeXRlIiwicmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJzZXRTZXJpYWxpemVGdW5jdGlvbiIsIm5ld0Z1bmMiLCJzZXREZXNlcmlhbGl6ZUZ1bmN0aW9uIiwic3RvcCIsInRyeVNodXRkb3duIiwicmVzdGFydCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLE9BQU9DLFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUMsT0FBT0QsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFNRSxVQUFVLFlBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCSCxRQUFRLFNBQVIsRUFBbUJHLGFBQXpDOztBQUVBO0FBQ0EsSUFBSUMscUJBQXFCLENBQXpCO0FBQ0EsSUFBSUMsb0JBQW9CLDJCQUFDQyxHQUFELEVBQU1DLFVBQU47QUFBQSxTQUFxQk4sS0FBS08sV0FBTCxDQUFpQkMsS0FBS0MsU0FBTCxDQUFlSixHQUFmLENBQWpCLEVBQXNDLEVBQUNDLHNCQUFELEVBQXRDLENBQXJCO0FBQUEsQ0FBeEI7QUFDQSxJQUFJSSxzQkFBc0IsNkJBQUNMLEdBQUQsRUFBTUMsVUFBTjtBQUFBLFNBQXFCRSxLQUFLRyxLQUFMLENBQVdYLEtBQUtZLFdBQUwsQ0FBaUJQLEdBQWpCLEVBQXNCLEVBQUNDLHNCQUFELEVBQXRCLENBQVgsQ0FBckI7QUFBQSxDQUExQjtBQUNBLFNBQVNPLGFBQVQsQ0FBd0JSLEdBQXhCLEVBQTZCO0FBQzNCLE1BQUlTLFNBQVNWLGtCQUFrQkMsR0FBbEIsQ0FBYjtBQUNBRix3QkFBdUJXLE9BQU9DLFVBQTlCO0FBQ0EsU0FB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S29GLGlCQUFMLENBQXVCQyxjQUF2QixFQUEzQjtBQUNBakIsOEJBQWNDLEtBQWQ7QUFDQTlCLHdCQUFRUyxLQUFSLENBQWMseUJBQXlCWixNQUF2Qzs7QUE1QkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FIRTs7QUFFRmhDLG9CQUFjLEVBQUM4Qix3QkFBRCxFQUFjQyxvQkFBZCxFQUF5QkMsY0FBekIsRUFBaUNDLHNCQUFqQyxFQUE2Q0MsZ0NBQTdDLEVBQWQ7O0FBK0JBO0FBQUEsV0FBTztBQUNMZ0QsK0JBREssbUNBQ29CO0FBQ3ZCLG1CQUFPakYsa0JBQVA7QUFDRCxXQUhJO0FBSUxrRixpQ0FKSyxxQ0FJc0I7QUFDekJsRixpQ0FBcUIsQ0FBckI7QUFDRCxXQU5JO0FBT0xtRiw4QkFQSyxnQ0FPaUJDLE9BUGpCLEVBTzBCO0FBQzdCbkYsZ0NBQW9CbUYsT0FBcEI7QUFDRCxXQVRJO0FBVUxDLGdDQVZLLGtDQVVtQkQsT0FWbkIsRUFVNEI7QUFDL0I3RSxrQ0FBc0I2RSxPQUF0QjtBQUNELFdBWkk7O0FBYUxwQixzQkFiSztBQWNMc0IsY0FkSyxrQkFjRztBQUNOdkIsMEJBQWN3QixXQUFkLENBQTBCLFlBQU0sQ0FBRSxDQUFsQztBQUNELFdBaEJJO0FBaUJMQyxpQkFqQksscUJBaUJNO0FBQ1R6QiwwQkFBY3dCLFdBQWQsQ0FBMEJ2QixLQUExQjtBQUNEO0FBbkJJO0FBQVA7QUFqQ0U7O0FBQUE7QUFzREgsR0F0REQsQ0FzREUsT0FBT0gsS0FBUCxFQUFjO0FBQ2QxQixlQUFXLHFCQUFYLEVBQWtDLEVBQUMwQixZQUFELEVBQVE5QixjQUFSLEVBQWdCRSxnQ0FBaEIsRUFBbEM7QUFDRDtBQUNGLENBM0dEIiwiZmlsZSI6Im5ldC5zZXJ2ZXIuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdycGMgPSByZXF1aXJlKCdncnBjJylcbnZhciB6bGliID0gcmVxdWlyZSgnemxpYicpXG5jb25zdCBQQUNLQUdFID0gJ25ldC5zZXJ2ZXInXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcblxuLy8gTUVTU0FHRSBTRVJJQUxJWkFUSU9OXG52YXIgc2VyaWFsaXplZERhdGFCeXRlID0gMFxudmFyIHNlcmlhbGl6ZUZ1bmN0aW9uID0gKG9iaiwgZGljdGlvbmFyeSkgPT4gemxpYi5kZWZsYXRlU3luYyhKU09OLnN0cmluZ2lmeShvYmopLCB7ZGljdGlvbmFyeX0pXG52YXIgZGVzZXJpYWxpemVGdW5jdGlvbiA9IChvYmosIGRpY3Rpb25hcnkpID0+IEpTT04ucGFyc2UoemxpYi5pbmZsYXRlU3luYyhvYmosIHtkaWN0aW9uYXJ5fSkpXG5mdW5jdGlvbiBzZXJpYWxpemVKc29uIChvYmopIHtcbiAgdmFyIHJlc3VsdCA9IHNlcmlhbGl6ZUZ1bmN0aW9uKG9iailcbiAgc2VyaWFsaXplZERhdGFCeXRlICs9IChyZXN1bHQuYnl0ZUxlbmd0aClcbiAgcmV0dXJuIHJlc3VsdFxufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVKc29uIChidWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IGRlc2VyaWFsaXplRnVuY3Rpb24oYnVmZmVyKVxuICByZXR1cm4gcmVzdWx0XG59XG52YXIgZ3JwY1NlcnZpY2UgPSB7XG4gIG1lc3NhZ2U6IHtcbiAgICBwYXRoOiAnbWVzc2FnZScsXG4gICAgcmVxdWVzdFN0cmVhbTogZmFsc2UsXG4gICAgcmVzcG9uc2VTdHJlYW06IGZhbHNlLFxuICAgIHJlcXVlc3RTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVxdWVzdERlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VEZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uXG4gIH0sXG4gIG1lc3NhZ2VNdWx0aToge1xuICAgIHBhdGg6ICdtZXNzYWdlTXVsdGknLFxuICAgIHJlcXVlc3RTdHJlYW06IGZhbHNlLFxuICAgIHJlc3BvbnNlU3RyZWFtOiBmYWxzZSxcbiAgICByZXF1ZXN0U2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlcXVlc3REZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlU2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlRGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvblxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TmV0U2VydmVyUGFja2FnZSAoe2dldENvbnNvbGUsc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgbmV0VXJsLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWd9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB2YXIgZXJyb3JUaHJvdyA9IHJlcXVpcmUoJy4vamVzdXMnKS5lcnJvclRocm93KHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHZhciBkZWZhdWx0TGlzdGVuZXJzID0ge1xuICAgICdfcnBjQ2FsbCc6IHtcbiAgICAgICdoYXZlUmVzcG9uc2UnOiB0cnVlXG4gICAgfVxuICAgIC8vICdfbWVzc2FnZU11bHRpJzoge1xuICAgIC8vICAgJ2hhdmVSZXNwb25zZSc6IGZhbHNlXG4gICAgLy8gfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gbWVzc2FnZUNhbGwgKHJlcXVlc3REYXRhKSB7XG4gICAgdmFyIGV2ZW50ID0gcmVxdWVzdERhdGEuZXZlbnRcbiAgICB2YXIgZXZlbnRzTGlzdGVuQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdExpc3RlbmVycywgYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnZXZlbnRzLmxpc3RlbicpKVxuICAgIENPTlNPTEUuZGVidWcoJ2V2ZW50c0xpc3RlbkNvbmZpZycsIHtzZXJ2aWNlTmFtZSwgZ2V0U2hhcmVkQ29uZmlnOiBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdldmVudHMubGlzdGVuJyksIGV2ZW50c0xpc3RlbkNvbmZpZ30pXG4gICAgaWYgKCFldmVudHNMaXN0ZW5Db25maWdbZXZlbnRdICYmICFldmVudHNMaXN0ZW5Db25maWdbJyonXSkgcmV0dXJuIENPTlNPTEUud2FybihuZXRVcmwsIGV2ZW50ICsgJyBldmVudCBub3QgZGVmaW5lZCBpbiAvZXZlbnRzLmxpc3Rlbi5qc29uJylcbiAgICB2YXIgZXZlbnRDb25maWcgPSBldmVudHNMaXN0ZW5Db25maWdbZXZlbnRdIHx8IGV2ZW50c0xpc3RlbkNvbmZpZ1snKiddXG5cbiAgICB2YXIgZnJvbSA9IHJlcXVlc3REYXRhLnNlcnZpY2VOYW1lXG4gICAgdmFyIG1ldGhvZE5hbWUgPSByZXF1ZXN0RGF0YS5tZXRob2RcbiAgICB2YXIgc2VydmljZSA9IGdldE1ldGhvZHMoKVxuICAgIGlmICghc2VydmljZVttZXRob2ROYW1lXSkgdGhyb3cgbWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkJ1xuICAgIHZhciBtZXRob2QgPSBzZXJ2aWNlW21ldGhvZE5hbWVdXG4gICAgdmFyIGRhdGEgPSByZXF1ZXN0RGF0YS5kYXRhXG4gICAgdmFyIG1ldGEgPSB7XG4gICAgICB0eXBlOiAnbmV0RXZlbnQnLFxuICAgICAgZnJvbSxcbiAgICAgIHJlcXVlc3RJZDogcmVxdWVzdERhdGEucmVxdWVzdElkIHx8IHV1aWRWNCgpLFxuICAgICAgdXNlcklkOiByZXF1ZXN0RGF0YS51c2VySWQsXG4gICAgICBtZXRob2ROYW1lLFxuICAgICAgZXZlbnQsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KClcbiAgICB9XG4gICAgQ09OU09MRS5kZWJ1ZygnbWVzc2FnZSByZWNlaXZlZCAnICsgbWV0aG9kTmFtZSArICcgcmVxdWVzdElkOicgKyBtZXRhLnJlcXVlc3RJZCwge2V2ZW50Q29uZmlnfSlcbiAgICBpZiAoZXZlbnRDb25maWcuaGF2ZVJlc3BvbnNlKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2QoZGF0YSwgbWV0YSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnbWVzc2FnZSByZXNwb25zZSAnICsgbWV0aG9kTmFtZSwge3Jlc3BvbnNlfSlcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBDT05TT0xFLndhcm4oJ21lc3NhZ2UgZXJyb3IgJyArIG1ldGhvZE5hbWUsIHtlcnJvcn0pXG4gICAgICAgIHJldHVybiBlcnJvclxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBDT05TT0xFLmRlYnVnKCdtZXNzYWdlIGFrbm93bGVnbWVudCAnICsgbWV0aG9kTmFtZSlcbiAgICAgIG1ldGhvZChkYXRhLCBtZXRhKVxuICAgICAgcmV0dXJuIHtha25vd2xlZ21lbnQ6IHRydWV9XG4gICAgfVxuICB9XG4gIHRyeSB7XG4gICAgdmFyIHNlcnZpY2VTZXJ2ZXJcbiAgICBjaGVja1JlcXVpcmVkKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBuZXRVcmwsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZ30pXG4gICAgYXN5bmMgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgdmFyIGdycGNTZXJ2aWNlRnVuY3Rpb25zID0ge1xuICAgICAgICBhc3luYyBtZXNzYWdlIChjYWxsLCBjYWxsYmFjaykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBtZXNzYWdlQ2FsbChjYWxsLnJlcXVlc3QpXG4gICAgICAgICAgICBDT05TT0xFLmRlYnVnKCdtZXNzYWdlIHJlc3BvbnNlJywge3JlcXVlc3Q6IGNhbGwucmVxdWVzdCwgcmVzcG9uc2V9KVxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIENPTlNPTEUuZXJyb3IoJ21lc3NhZ2UgZXJyb3InLCBlcnJvcilcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgbWVzc2FnZU11bHRpIChjYWxsLCBjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG51bGwpXG5cbiAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXVxuICAgICAgICAgIGNhbGwucmVxdWVzdC5kYXRhLm1lc3NhZ2VzLmZvckVhY2goKHtkYXRhLCBtZXRhfSkgPT4ge1xuICAgICAgICAgICAgdmFyIHJlcURhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBjYWxsLnJlcXVlc3QsIHtkYXRhLCBtZXRhfSlcbiAgICAgICAgICAgIENPTlNPTEUuZGVidWcoJ21lc3NhZ2VNdWx0aSByZXFEYXRhICcsIHJlcURhdGEpXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKG1lc3NhZ2VDYWxsKHJlcURhdGEsIGNhbGxiYWNrKSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2VydmljZVNlcnZlciA9IG5ldyBncnBjLlNlcnZlcigpXG4gICAgICBzZXJ2aWNlU2VydmVyLmFkZFNlcnZpY2UoZ3JwY1NlcnZpY2UsIGdycGNTZXJ2aWNlRnVuY3Rpb25zKVxuICAgICAgc2VydmljZVNlcnZlci5iaW5kKG5ldFVybCwgZ3JwYy5TZXJ2ZXJDcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgICAgc2VydmljZVNlcnZlci5zdGFydCgpXG4gICAgICBDT05TT0xFLmRlYnVnKCdOZXQgc3RhcnRlZCBvbiBwb3J0OicgKyBuZXRVcmwpXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBnZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICByZXR1cm4gc2VyaWFsaXplZERhdGFCeXRlXG4gICAgICB9LFxuICAgICAgcmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICBzZXJpYWxpemVkRGF0YUJ5dGUgPSAwXG4gICAgICB9LFxuICAgICAgc2V0U2VyaWFsaXplRnVuY3Rpb24gKG5ld0Z1bmMpIHtcbiAgICAgICAgc2VyaWFsaXplRnVuY3Rpb24gPSBuZXdGdW5jXG4gICAgICB9LFxuICAgICAgc2V0RGVzZXJpYWxpemVGdW5jdGlvbiAobmV3RnVuYykge1xuICAgICAgICBkZXNlcmlhbGl6ZUZ1bmN0aW9uID0gbmV3RnVuY1xuICAgICAgfSxcbiAgICAgIHN0YXJ0LFxuICAgICAgc3RvcCAoKSB7XG4gICAgICAgIHNlcnZpY2VTZXJ2ZXIudHJ5U2h1dGRvd24oKCkgPT4ge30pXG4gICAgICB9LFxuICAgICAgcmVzdGFydCAoKSB7XG4gICAgICAgIHNlcnZpY2VTZXJ2ZXIudHJ5U2h1dGRvd24oc3RhcnQpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVycm9yVGhyb3coJ2dldE5ldFNlcnZlclBhY2thZ2UnLCB7ZXJyb3IsIG5ldFVybCwgZ2V0U2hhcmVkQ29uZmlnfSlcbiAgfVxufVxuIl19