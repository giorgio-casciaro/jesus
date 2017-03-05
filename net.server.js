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
  var defaultListeners = require('./default.event.listen.json');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbImdycGMiLCJyZXF1aXJlIiwiemxpYiIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwic2VyaWFsaXplZERhdGFCeXRlIiwic2VyaWFsaXplRnVuY3Rpb24iLCJvYmoiLCJkaWN0aW9uYXJ5IiwiZGVmbGF0ZVN5bmMiLCJKU09OIiwic3RyaW5naWZ5IiwiZGVzZXJpYWxpemVGdW5jdGlvbiIsInBhcnNlIiwiaW5mbGF0ZVN5bmMiLCJzZXJpYWxpemVKc29uIiwicmVzdWx0IiwiYnl0ZUxlbmd0aCIsImRlc2VyaWFsaXplSnNvbiIsImJ1ZmZlciIsImdycGNTZXJ2aWNlIiwibWVzc2FnZSIsInBhdGgiLCJyZXF1ZXN0U3RyZWFtIiwicmVzcG9uc2VTdHJlYW0iLCJyZXF1ZXN0U2VyaWFsaXplIiwicmVxdWVzdERlc2VyaWFsaXplIiwicmVzcG9uc2VTZXJpYWxpemUiLCJyZXNwb25zZURlc2VyaWFsaXplIiwibWVzc2FnZU11bHRpIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldFNlcnZlclBhY2thZ2UiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJuZXRVcmwiLCJnZXRNZXRob2RzIiwiZ2V0U2hhcmVkQ29uZmlnIiwiQ09OU09MRSIsImVycm9yVGhyb3ciLCJkZWZhdWx0TGlzdGVuZXJzIiwibWVzc2FnZUNhbGwiLCJyZXF1ZXN0RGF0YSIsImV2ZW50IiwiT2JqZWN0IiwiZXZlbnRzTGlzdGVuQ29uZmlnIiwiYXNzaWduIiwiZGVidWciLCJ3YXJuIiwiZXZlbnRDb25maWciLCJmcm9tIiwibWV0aG9kTmFtZSIsIm1ldGhvZCIsInNlcnZpY2UiLCJkYXRhIiwibWV0YSIsInR5cGUiLCJyZXF1ZXN0SWQiLCJ1dWlkVjQiLCJ1c2VySWQiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiaGF2ZVJlc3BvbnNlIiwicmVzcG9uc2UiLCJlcnJvciIsImFrbm93bGVnbWVudCIsInNlcnZpY2VTZXJ2ZXIiLCJzdGFydCIsImdycGNTZXJ2aWNlRnVuY3Rpb25zIiwiY2FsbCIsImNhbGxiYWNrIiwicmVxdWVzdCIsInByb21pc2VzIiwibWVzc2FnZXMiLCJmb3JFYWNoIiwicmVxRGF0YSIsInB1c2giLCJQcm9taXNlIiwiYWxsIiwiU2VydmVyIiwiYWRkU2VydmljZSIsImJpbmQiLCJTZXJ2ZXJDcmVkZW50aWFscyIsImNyZWF0ZUluc2VjdXJlIiwiZ2V0U2VyaWFsaXplZERhdGFCeXRlIiwicmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJzZXRTZXJpYWxpemVGdW5jdGlvbiIsIm5ld0Z1bmMiLCJzZXREZXNlcmlhbGl6ZUZ1bmN0aW9uIiwic3RvcCIsInRyeVNodXRkb3duIiwicmVzdGFydCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLE9BQU9DLFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUMsT0FBT0QsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFNRSxVQUFVLFlBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCSCxRQUFRLFNBQVIsRUFBbUJHLGFBQXpDOztBQUVBO0FBQ0EsSUFBSUMscUJBQXFCLENBQXpCO0FBQ0EsSUFBSUMsb0JBQW9CLDJCQUFDQyxHQUFELEVBQU1DLFVBQU47QUFBQSxTQUFxQk4sS0FBS08sV0FBTCxDQUFpQkMsS0FBS0MsU0FBTCxDQUFlSixHQUFmLENBQWpCLEVBQXNDLEVBQUNDLHNCQUFELEVBQXRDLENBQXJCO0FBQUEsQ0FBeEI7QUFDQSxJQUFJSSxzQkFBc0IsNkJBQUNMLEdBQUQsRUFBTUMsVUFBTjtBQUFBLFNBQXFCRSxLQUFLRyxLQUFMLENBQVdYLEtBQUtZLFdBQUwsQ0FBaUJQLEdBQWpCLEVBQXNCLEVBQUNDLHNCQUFELEVBQXRCLENBQVgsQ0FBckI7QUFBQSxDQUExQjtBQUNBLFNBQVNPLGFBQVQsQ0FBd0JSLEdBQXhCLEVBQTZCO0FBQzNCLE1BQUlTLFNBQVNWLGtCQUFrQkMsR0FBbEIsQ0FBYjtBQUNBRix3QkFBdUJXLE9BQU9DLFVBQTlCO0FBQ0EsU0FB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QkFBY0MsS0FBZDtBQUNBOUIsd0JBQVFTLEtBQVIsQ0FBYyx5QkFBeUJaLE1BQXZDOztBQTVCRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUhFOztBQUVGaEMsb0JBQWMsRUFBQzhCLHdCQUFELEVBQWNDLG9CQUFkLEVBQXlCQyxjQUF6QixFQUFpQ0Msc0JBQWpDLEVBQTZDQyxnQ0FBN0MsRUFBZDs7QUErQkE7QUFBQSxXQUFPO0FBQ0xnRCwrQkFESyxtQ0FDb0I7QUFDdkIsbUJBQU9qRixrQkFBUDtBQUNELFdBSEk7QUFJTGtGLGlDQUpLLHFDQUlzQjtBQUN6QmxGLGlDQUFxQixDQUFyQjtBQUNELFdBTkk7QUFPTG1GLDhCQVBLLGdDQU9pQkMsT0FQakIsRUFPMEI7QUFDN0JuRixnQ0FBb0JtRixPQUFwQjtBQUNELFdBVEk7QUFVTEMsZ0NBVkssa0NBVW1CRCxPQVZuQixFQVU0QjtBQUMvQjdFLGtDQUFzQjZFLE9BQXRCO0FBQ0QsV0FaSTs7QUFhTHBCLHNCQWJLO0FBY0xzQixjQWRLLGtCQWNHO0FBQ052QiwwQkFBY3dCLFdBQWQsQ0FBMEIsWUFBTSxDQUFFLENBQWxDO0FBQ0QsV0FoQkk7QUFpQkxDLGlCQWpCSyxxQkFpQk07QUFDVHpCLDBCQUFjd0IsV0FBZCxDQUEwQnZCLEtBQTFCO0FBQ0Q7QUFuQkk7QUFBUDtBQWpDRTs7QUFBQTtBQXNESCxHQXRERCxDQXNERSxPQUFPSCxLQUFQLEVBQWM7QUFDZDFCLGVBQVcscUJBQVgsRUFBa0MsRUFBQzBCLFlBQUQsRUFBUTlCLGNBQVIsRUFBZ0JFLGdDQUFoQixFQUFsQztBQUNEO0FBQ0YsQ0FuR0QiLCJmaWxlIjoibmV0LnNlcnZlci5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ3JwYyA9IHJlcXVpcmUoJ2dycGMnKVxudmFyIHpsaWIgPSByZXF1aXJlKCd6bGliJylcbmNvbnN0IFBBQ0tBR0UgPSAnbmV0LnNlcnZlcidcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuXG4vLyBNRVNTQUdFIFNFUklBTElaQVRJT05cbnZhciBzZXJpYWxpemVkRGF0YUJ5dGUgPSAwXG52YXIgc2VyaWFsaXplRnVuY3Rpb24gPSAob2JqLCBkaWN0aW9uYXJ5KSA9PiB6bGliLmRlZmxhdGVTeW5jKEpTT04uc3RyaW5naWZ5KG9iaiksIHtkaWN0aW9uYXJ5fSlcbnZhciBkZXNlcmlhbGl6ZUZ1bmN0aW9uID0gKG9iaiwgZGljdGlvbmFyeSkgPT4gSlNPTi5wYXJzZSh6bGliLmluZmxhdGVTeW5jKG9iaiwge2RpY3Rpb25hcnl9KSlcbmZ1bmN0aW9uIHNlcmlhbGl6ZUpzb24gKG9iaikge1xuICB2YXIgcmVzdWx0ID0gc2VyaWFsaXplRnVuY3Rpb24ob2JqKVxuICBzZXJpYWxpemVkRGF0YUJ5dGUgKz0gKHJlc3VsdC5ieXRlTGVuZ3RoKVxuICByZXR1cm4gcmVzdWx0XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUpzb24gKGJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gZGVzZXJpYWxpemVGdW5jdGlvbihidWZmZXIpXG4gIHJldHVybiByZXN1bHRcbn1cbnZhciBncnBjU2VydmljZSA9IHtcbiAgbWVzc2FnZToge1xuICAgIHBhdGg6ICdtZXNzYWdlJyxcbiAgICByZXF1ZXN0U3RyZWFtOiBmYWxzZSxcbiAgICByZXNwb25zZVN0cmVhbTogZmFsc2UsXG4gICAgcmVxdWVzdFNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXF1ZXN0RGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZVNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZURlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb25cbiAgfSxcbiAgbWVzc2FnZU11bHRpOiB7XG4gICAgcGF0aDogJ21lc3NhZ2VNdWx0aScsXG4gICAgcmVxdWVzdFN0cmVhbTogZmFsc2UsXG4gICAgcmVzcG9uc2VTdHJlYW06IGZhbHNlLFxuICAgIHJlcXVlc3RTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVxdWVzdERlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VEZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXROZXRTZXJ2ZXJQYWNrYWdlICh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgbmV0VXJsLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWd9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB2YXIgZXJyb3JUaHJvdyA9IHJlcXVpcmUoJy4vamVzdXMnKS5lcnJvclRocm93KHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHZhciBkZWZhdWx0TGlzdGVuZXJzID0gcmVxdWlyZSgnLi9kZWZhdWx0LmV2ZW50Lmxpc3Rlbi5qc29uJylcbiAgYXN5bmMgZnVuY3Rpb24gbWVzc2FnZUNhbGwgKHJlcXVlc3REYXRhKSB7XG4gICAgdmFyIGV2ZW50ID0gcmVxdWVzdERhdGEuZXZlbnRcbiAgICB2YXIgZXZlbnRzTGlzdGVuQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdExpc3RlbmVycywgYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnZXZlbnRzLmxpc3RlbicpKVxuICAgIENPTlNPTEUuZGVidWcoJ2V2ZW50c0xpc3RlbkNvbmZpZycsIHtzZXJ2aWNlTmFtZSwgZ2V0U2hhcmVkQ29uZmlnOiBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdldmVudHMubGlzdGVuJyksIGV2ZW50c0xpc3RlbkNvbmZpZ30pXG4gICAgaWYgKCFldmVudHNMaXN0ZW5Db25maWdbZXZlbnRdICYmICFldmVudHNMaXN0ZW5Db25maWdbJyonXSkgcmV0dXJuIENPTlNPTEUud2FybihuZXRVcmwsIGV2ZW50ICsgJyBldmVudCBub3QgZGVmaW5lZCBpbiAvZXZlbnRzLmxpc3Rlbi5qc29uJylcbiAgICB2YXIgZXZlbnRDb25maWcgPSBldmVudHNMaXN0ZW5Db25maWdbZXZlbnRdIHx8IGV2ZW50c0xpc3RlbkNvbmZpZ1snKiddXG5cbiAgICB2YXIgZnJvbSA9IHJlcXVlc3REYXRhLnNlcnZpY2VOYW1lXG4gICAgdmFyIG1ldGhvZE5hbWUgPSByZXF1ZXN0RGF0YS5tZXRob2RcbiAgICB2YXIgc2VydmljZSA9IGdldE1ldGhvZHMoKVxuICAgIGlmICghc2VydmljZVttZXRob2ROYW1lXSkgdGhyb3cgbWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkJ1xuICAgIHZhciBtZXRob2QgPSBzZXJ2aWNlW21ldGhvZE5hbWVdXG4gICAgdmFyIGRhdGEgPSByZXF1ZXN0RGF0YS5kYXRhXG4gICAgdmFyIG1ldGEgPSB7XG4gICAgICB0eXBlOiAnbmV0RXZlbnQnLFxuICAgICAgZnJvbSxcbiAgICAgIHJlcXVlc3RJZDogcmVxdWVzdERhdGEucmVxdWVzdElkIHx8IHV1aWRWNCgpLFxuICAgICAgdXNlcklkOiByZXF1ZXN0RGF0YS51c2VySWQsXG4gICAgICBtZXRob2ROYW1lLFxuICAgICAgZXZlbnQsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KClcbiAgICB9XG4gICAgQ09OU09MRS5kZWJ1ZygnbWVzc2FnZSByZWNlaXZlZCAnICsgbWV0aG9kTmFtZSArICcgcmVxdWVzdElkOicgKyBtZXRhLnJlcXVlc3RJZCwge2V2ZW50Q29uZmlnfSlcbiAgICBpZiAoZXZlbnRDb25maWcuaGF2ZVJlc3BvbnNlKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2QoZGF0YSwgbWV0YSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnbWVzc2FnZSByZXNwb25zZSAnICsgbWV0aG9kTmFtZSwge3Jlc3BvbnNlfSlcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBDT05TT0xFLndhcm4oJ21lc3NhZ2UgZXJyb3IgJyArIG1ldGhvZE5hbWUsIHtlcnJvcn0pXG4gICAgICAgIHJldHVybiBlcnJvclxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBDT05TT0xFLmRlYnVnKCdtZXNzYWdlIGFrbm93bGVnbWVudCAnICsgbWV0aG9kTmFtZSlcbiAgICAgIG1ldGhvZChkYXRhLCBtZXRhKVxuICAgICAgcmV0dXJuIHtha25vd2xlZ21lbnQ6IHRydWV9XG4gICAgfVxuICB9XG4gIHRyeSB7XG4gICAgdmFyIHNlcnZpY2VTZXJ2ZXJcbiAgICBjaGVja1JlcXVpcmVkKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBuZXRVcmwsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZ30pXG4gICAgYXN5bmMgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgdmFyIGdycGNTZXJ2aWNlRnVuY3Rpb25zID0ge1xuICAgICAgICBhc3luYyBtZXNzYWdlIChjYWxsLCBjYWxsYmFjaykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBtZXNzYWdlQ2FsbChjYWxsLnJlcXVlc3QpXG4gICAgICAgICAgICBDT05TT0xFLmRlYnVnKCdtZXNzYWdlIHJlc3BvbnNlJywge3JlcXVlc3Q6IGNhbGwucmVxdWVzdCwgcmVzcG9uc2V9KVxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIENPTlNPTEUuZXJyb3IoJ21lc3NhZ2UgZXJyb3InLCBlcnJvcilcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgbWVzc2FnZU11bHRpIChjYWxsLCBjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG51bGwpXG5cbiAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXVxuICAgICAgICAgIGNhbGwucmVxdWVzdC5kYXRhLm1lc3NhZ2VzLmZvckVhY2goKHtkYXRhLCBtZXRhfSkgPT4ge1xuICAgICAgICAgICAgdmFyIHJlcURhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBjYWxsLnJlcXVlc3QsIHtkYXRhLCBtZXRhfSlcbiAgICAgICAgICAgIENPTlNPTEUuZGVidWcoJ21lc3NhZ2VNdWx0aSByZXFEYXRhICcsIHJlcURhdGEpXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKG1lc3NhZ2VDYWxsKHJlcURhdGEsIGNhbGxiYWNrKSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2VydmljZVNlcnZlciA9IG5ldyBncnBjLlNlcnZlcigpXG4gICAgICBzZXJ2aWNlU2VydmVyLmFkZFNlcnZpY2UoZ3JwY1NlcnZpY2UsIGdycGNTZXJ2aWNlRnVuY3Rpb25zKVxuICAgICAgc2VydmljZVNlcnZlci5iaW5kKG5ldFVybCwgZ3JwYy5TZXJ2ZXJDcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgICAgc2VydmljZVNlcnZlci5zdGFydCgpXG4gICAgICBDT05TT0xFLmRlYnVnKCdOZXQgc3RhcnRlZCBvbiBwb3J0OicgKyBuZXRVcmwpXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBnZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICByZXR1cm4gc2VyaWFsaXplZERhdGFCeXRlXG4gICAgICB9LFxuICAgICAgcmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICBzZXJpYWxpemVkRGF0YUJ5dGUgPSAwXG4gICAgICB9LFxuICAgICAgc2V0U2VyaWFsaXplRnVuY3Rpb24gKG5ld0Z1bmMpIHtcbiAgICAgICAgc2VyaWFsaXplRnVuY3Rpb24gPSBuZXdGdW5jXG4gICAgICB9LFxuICAgICAgc2V0RGVzZXJpYWxpemVGdW5jdGlvbiAobmV3RnVuYykge1xuICAgICAgICBkZXNlcmlhbGl6ZUZ1bmN0aW9uID0gbmV3RnVuY1xuICAgICAgfSxcbiAgICAgIHN0YXJ0LFxuICAgICAgc3RvcCAoKSB7XG4gICAgICAgIHNlcnZpY2VTZXJ2ZXIudHJ5U2h1dGRvd24oKCkgPT4ge30pXG4gICAgICB9LFxuICAgICAgcmVzdGFydCAoKSB7XG4gICAgICAgIHNlcnZpY2VTZXJ2ZXIudHJ5U2h1dGRvd24oc3RhcnQpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVycm9yVGhyb3coJ2dldE5ldFNlcnZlclBhY2thZ2UnLCB7ZXJyb3IsIG5ldFVybCwgZ2V0U2hhcmVkQ29uZmlnfSlcbiAgfVxufVxuIl19