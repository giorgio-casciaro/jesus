'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
var grpc = require('grpc');
var zlib = require('zlib');
var PACKAGE = 'net.client';
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

var delayedSendData = global.JESUS_NET_CLIENT_delayedSendData = global.JESUS_NET_CLIENT_delayedSendData || {};

module.exports = function getNetClientPackage(_ref) {
  var _this = this;

  var getConsole = _ref.getConsole,
      serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      getSharedConfig = _ref.getSharedConfig;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);
  try {
    var defaultEventEmit;
    var clientCache;
    var getGrpcClient;
    var sendMessage;

    var _ret = function () {
      var filterByTag = function filterByTag(tags) {
        return function (tagFilter) {
          if (tagFilter) CONSOLE.debug('filterByTag()', tags.indexOf(tagFilter) + 1);
          return !tags || !tagFilter ? true : tags.indexOf(tagFilter) + 1;
        };
      };

      var rpc = function _callee2(serviceName, method, data, meta) {
        var timeout = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 5000;
        var listenerService, sendMessageResponse;
        return regeneratorRuntime.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                CONSOLE.debug('rpc ' + serviceName + ' ' + method + ' requestId:' + meta.requestId, { data: data, timeout: timeout, meta: meta });
                _context2.next = 3;
                return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'service'));

              case 3:
                listenerService = _context2.sent;
                _context2.next = 6;
                return regeneratorRuntime.awrap(sendMessage({ name: '_rpcCall', listenerServiceName: serviceName, netUrl: listenerService.netUrl, timeout: timeout, method: method, haveResponse: true, data: data, meta: meta }));

              case 6:
                sendMessageResponse = _context2.sent;
                return _context2.abrupt('return', sendMessageResponse);

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, null, this);
      };

      var emit = function _callee3(name, data, meta) {
        var throwOnErrorResponse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        var eventsEmitConfig, eventEmitConfig, eventsListenRegistry, servicesRegistry, waitResponses, eventListeners, filterByTagEventEmit, resultPromise, result;
        return regeneratorRuntime.async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                CONSOLE.debug('emit ' + name + ' requestId:' + meta.requestId, { name: name, data: data, meta: meta });
                _context3.t0 = Object;
                _context3.t1 = {};
                _context3.t2 = defaultEventEmit;
                _context3.next = 6;
                return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'events.emit'));

              case 6:
                _context3.t3 = _context3.sent;
                eventsEmitConfig = _context3.t0.assign.call(_context3.t0, _context3.t1, _context3.t2, _context3.t3);

                if (eventsEmitConfig[name]) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt('return', CONSOLE.warn(name + ' event not defined in /events.emit.json'));

              case 10:
                eventEmitConfig = eventsEmitConfig[name];
                _context3.next = 13;
                return regeneratorRuntime.awrap(buildServicesRegistry('events.listen', serviceName));

              case 13:
                eventsListenRegistry = _context3.sent;
                _context3.next = 16;
                return regeneratorRuntime.awrap(getSharedConfig('*', 'service', serviceName, true));

              case 16:
                servicesRegistry = _context3.sent;

                // CONSOLE.debug('emit info', {eventEmitConfig, eventsListenRegistry, servicesRegistry})
                waitResponses = [];
                eventListeners = [];

                if (eventsListenRegistry[name]) eventListeners = eventListeners.concat(eventsListenRegistry[name]);
                if (eventsListenRegistry['*']) eventListeners = eventListeners.concat(eventsListenRegistry['*']);
                filterByTagEventEmit = filterByTag(eventEmitConfig.tags);

                eventListeners = eventListeners.filter(function (eventListener) {
                  return filterByTagEventEmit(eventListener.event.filterByTag);
                });

                if (eventListeners.length) {
                  _context3.next = 26;
                  break;
                }

                CONSOLE.debug(name + ' event have no listeners ');
                return _context3.abrupt('return', false);

              case 26:
                eventListeners.forEach(function (eventListener) {
                  var listenerServiceName = eventListener.serviceName;
                  var listenerService = servicesRegistry[listenerServiceName];
                  var eventListenConfig = eventListener.event;

                  // var sendMessagePromise = sendMessage({name, listenerService, listenerServiceName, eventListenConfig, eventEmitConfig, data, listenerServiceName, meta})
                  if (eventListenConfig.delayed) {
                    var index = name + listenerServiceName + eventListenConfig.method;
                    if (!delayedSendData[index]) {
                      var timeout = setTimeout(function () {
                        var multiEvent = delayedSendData[index];
                        delete delayedSendData[index];
                        sendMessage(multiEvent);
                      }, eventListenConfig.delayed);
                      delayedSendData[index] = { throwOnErrorResponse: throwOnErrorResponse, name: '_messageMulti', listenerServiceName: listenerServiceName, multi: true, timeout: 60000, method: eventListenConfig.method, netUrl: listenerService.netUrl, data: { event: name, messages: [] }, meta: meta };
                    }
                    delayedSendData[index].data.messages.push({ data: data, meta: meta });
                  } else {
                    var sendMessagePromise = sendMessage({ name: name, listenerServiceName: listenerServiceName, netUrl: listenerService.netUrl, timeout: eventEmitConfig.timeout, method: eventListenConfig.method, haveResponse: eventListenConfig.haveResponse, data: data, meta: meta });
                    if (eventListenConfig.haveResponse && eventEmitConfig.waitResponse) waitResponses.push(sendMessagePromise);
                  }
                });
                CONSOLE.debug('emit ' + name + ' waitResponses', waitResponses);

                if (!eventEmitConfig.waitResponse) {
                  _context3.next = 36;
                  break;
                }

                if (eventEmitConfig.responseRequired && !waitResponses.length) errorThrow(name + ' event need a response');
                if (eventEmitConfig.singleResponse) resultPromise = waitResponses[0];else resultPromise = Promise.all(waitResponses);
                _context3.next = 33;
                return regeneratorRuntime.awrap(resultPromise);

              case 33:
                result = _context3.sent;

                CONSOLE.debug('emit ' + name + ' results', result);
                return _context3.abrupt('return', result);

              case 36:
              case 'end':
                return _context3.stop();
            }
          }
        }, null, this);
      };

      checkRequired({ serviceName: serviceName, serviceId: serviceId, getSharedConfig: getSharedConfig });
      defaultEventEmit = require('./default.event.emit.json');
      clientCache = {};

      getGrpcClient = function getGrpcClient(netUrl) {
        return new Promise(function (resolve, reject) {
          var client;
          if (clientCache[netUrl]) client = clientCache[netUrl];else {
            var ClientClass = grpc.makeGenericClientConstructor(grpcService);
            client = clientCache[netUrl] = new ClientClass(netUrl, grpc.credentials.createInsecure());
          }
          CONSOLE.debug('getGrpcClient ', client);
          resolve(client);
        });
      };

      sendMessage = function sendMessage(_ref2) {
        var throwOnErrorResponse = _ref2.throwOnErrorResponse,
            name = _ref2.name,
            netUrl = _ref2.netUrl,
            _ref2$timeout = _ref2.timeout,
            timeout = _ref2$timeout === undefined ? 5000 : _ref2$timeout,
            method = _ref2.method,
            _ref2$multi = _ref2.multi,
            multi = _ref2$multi === undefined ? false : _ref2$multi,
            haveResponse = _ref2.haveResponse,
            data = _ref2.data,
            listenerServiceName = _ref2.listenerServiceName,
            meta = _ref2.meta;
        return new Promise(function (resolve, reject) {
          CONSOLE.debug('sendMessage ' + name + ' to ' + listenerServiceName, { name: name, data: data, listenerServiceName: listenerServiceName, meta: meta });
          getGrpcClient(netUrl).then(function (client) {
            // if (eventListenConfig.haveResponse) {
            var callTimeout;
            var requestId = meta.requestId;
            var userId = meta.userId;
            var messageFunction = 'message';
            if (multi) messageFunction = 'messageMulti';
            var call = client[messageFunction]({ serviceName: serviceName, serviceId: serviceId, event: name, method: method, data: data, requestId: requestId, userId: userId }, function (error, serviceResponse) {
              if (callTimeout) clearTimeout(callTimeout);
              if (error) reject(error);
              resolve(serviceResponse);
            });
            callTimeout = setTimeout(function () {
              call.cancel();
              CONSOLE.warn('sendMessage timeout ' + name + ' to ' + listenerServiceName, { serviceName: serviceName, timeout: timeout });
              if (haveResponse) reject({ message: 'Response problems: REQUEST TIMEOUT', data: data, listenerServiceName: listenerServiceName });else resolve();
            }, timeout);
          }).catch(function (error) {
            CONSOLE.warn('sendMessage error' + name + ' to ' + listenerServiceName, error);
            reject(error);
          });
        });
      };

      var buildServicesRegistry = function _callee() {
        var schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'events.listen';
        var exclude = arguments[1];
        var servicesConfig, listeners;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return regeneratorRuntime.awrap(getSharedConfig('*', schema, exclude));

              case 2:
                servicesConfig = _context.sent;
                listeners = {};

                servicesConfig.forEach(function (service) {
                  var serviceName = service.serviceName;
                  Object.keys(service).forEach(function (eventName) {
                    if (!listeners[eventName]) listeners[eventName] = [];
                    listeners[eventName].push({ serviceName: serviceName, event: service[eventName], eventName: eventName });
                  }, service);
                });
                return _context.abrupt('return', listeners);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, null, _this);
      };

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

          emit: emit,
          rpc: rpc
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    errorThrow('getNetClientPackage', { error: error, getSharedConfig: getSharedConfig, serviceName: serviceName });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiZ3JwYyIsInpsaWIiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsInNlcmlhbGl6ZWREYXRhQnl0ZSIsInNlcmlhbGl6ZUZ1bmN0aW9uIiwib2JqIiwiZGljdGlvbmFyeSIsImRlZmxhdGVTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlc2VyaWFsaXplRnVuY3Rpb24iLCJwYXJzZSIsImluZmxhdGVTeW5jIiwic2VyaWFsaXplSnNvbiIsInJlc3VsdCIsImJ5dGVMZW5ndGgiLCJkZXNlcmlhbGl6ZUpzb24iLCJidWZmZXIiLCJncnBjU2VydmljZSIsIm1lc3NhZ2UiLCJwYXRoIiwicmVxdWVzdFN0cmVhbSIsInJlc3BvbnNlU3RyZWFtIiwicmVxdWVzdFNlcmlhbGl6ZSIsInJlcXVlc3REZXNlcmlhbGl6ZSIsInJlc3BvbnNlU2VyaWFsaXplIiwicmVzcG9uc2VEZXNlcmlhbGl6ZSIsIm1lc3NhZ2VNdWx0aSIsImRlbGF5ZWRTZW5kRGF0YSIsImdsb2JhbCIsIkpFU1VTX05FVF9DTElFTlRfZGVsYXllZFNlbmREYXRhIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldENsaWVudFBhY2thZ2UiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJnZXRTaGFyZWRDb25maWciLCJDT05TT0xFIiwiZXJyb3JUaHJvdyIsImRlZmF1bHRFdmVudEVtaXQiLCJjbGllbnRDYWNoZSIsImdldEdycGNDbGllbnQiLCJzZW5kTWVzc2FnZSIsImZpbHRlckJ5VGFnIiwidGFncyIsInRhZ0ZpbHRlciIsImRlYnVnIiwiaW5kZXhPZiIsInJwYyIsIm1ldGhvZCIsImRhdGEiLCJtZXRhIiwidGltZW91dCIsInJlcXVlc3RJZCIsImxpc3RlbmVyU2VydmljZSIsIm5hbWUiLCJsaXN0ZW5lclNlcnZpY2VOYW1lIiwibmV0VXJsIiwiaGF2ZVJlc3BvbnNlIiwic2VuZE1lc3NhZ2VSZXNwb25zZSIsImVtaXQiLCJ0aHJvd09uRXJyb3JSZXNwb25zZSIsIk9iamVjdCIsImV2ZW50c0VtaXRDb25maWciLCJhc3NpZ24iLCJ3YXJuIiwiZXZlbnRFbWl0Q29uZmlnIiwiYnVpbGRTZXJ2aWNlc1JlZ2lzdHJ5IiwiZXZlbnRzTGlzdGVuUmVnaXN0cnkiLCJzZXJ2aWNlc1JlZ2lzdHJ5Iiwid2FpdFJlc3BvbnNlcyIsImV2ZW50TGlzdGVuZXJzIiwiY29uY2F0IiwiZmlsdGVyQnlUYWdFdmVudEVtaXQiLCJmaWx0ZXIiLCJldmVudExpc3RlbmVyIiwiZXZlbnQiLCJsZW5ndGgiLCJmb3JFYWNoIiwiZXZlbnRMaXN0ZW5Db25maWciLCJkZWxheWVkIiwiaW5kZXgiLCJzZXRUaW1lb3V0IiwibXVsdGlFdmVudCIsIm11bHRpIiwibWVzc2FnZXMiLCJwdXNoIiwic2VuZE1lc3NhZ2VQcm9taXNlIiwid2FpdFJlc3BvbnNlIiwicmVzcG9uc2VSZXF1aXJlZCIsInNpbmdsZVJlc3BvbnNlIiwicmVzdWx0UHJvbWlzZSIsIlByb21pc2UiLCJhbGwiLCJyZXNvbHZlIiwicmVqZWN0IiwiY2xpZW50IiwiQ2xpZW50Q2xhc3MiLCJtYWtlR2VuZXJpY0NsaWVudENvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJjcmVhdGVJbnNlY3VyZSIsInRoZW4iLCJjYWxsVGltZW91dCIsInVzZXJJZCIsIm1lc3NhZ2VGdW5jdGlvbiIsImNhbGwiLCJlcnJvciIsInNlcnZpY2VSZXNwb25zZSIsImNsZWFyVGltZW91dCIsImNhbmNlbCIsImNhdGNoIiwic2NoZW1hIiwiZXhjbHVkZSIsInNlcnZpY2VzQ29uZmlnIiwibGlzdGVuZXJzIiwic2VydmljZSIsImtleXMiLCJldmVudE5hbWUiLCJnZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJyZXNldFNlcmlhbGl6ZWREYXRhQnl0ZSIsInNldFNlcmlhbGl6ZUZ1bmN0aW9uIiwibmV3RnVuYyIsInNldERlc2VyaWFsaXplRnVuY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUUsT0FBT0YsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFNRyxVQUFVLFlBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCSixRQUFRLFNBQVIsRUFBbUJJLGFBQXpDOztBQUVBO0FBQ0EsSUFBSUMscUJBQXFCLENBQXpCO0FBQ0EsSUFBSUMsb0JBQW9CLDJCQUFDQyxHQUFELEVBQU1DLFVBQU47QUFBQSxTQUFxQk4sS0FBS08sV0FBTCxDQUFpQkMsS0FBS0MsU0FBTCxDQUFlSixHQUFmLENBQWpCLEVBQXNDLEVBQUNDLHNCQUFELEVBQXRDLENBQXJCO0FBQUEsQ0FBeEI7QUFDQSxJQUFJSSxzQkFBc0IsNkJBQUNMLEdBQUQsRUFBTUMsVUFBTjtBQUFBLFNBQXFCRSxLQUFLRyxLQUFMLENBQVdYLEtBQUtZLFdBQUwsQ0FBaUJQLEdBQWpCLEVBQXNCLEVBQUNDLHNCQUFELEVBQXRCLENBQVgsQ0FBckI7QUFBQSxDQUExQjtBQUNBLFNBQVNPLGFBQVQsQ0FBd0JSLEdBQXhCLEVBQTZCO0FBQzNCLE1BQUlTLFNBQVNWLGtCQUFrQkMsR0FBbEIsQ0FBYjtBQUNBRix3QkFBdUJXLE9BQU9DLFVBQTlCO0FBQ0EsU0FBT0QsTUFBUDtBQUNEO0FBQ0QsU0FBU0UsZUFBVCxDQUEwQkMsTUFBMUIsRUFBa0M7QUFDaEMsTUFBSUgsU0FBU0osb0JBQW9CTyxNQUFwQixDQUFiO0FBQ0EsU0FBT0gsTUFBUDtBQUNEO0FBQ0QsSUFBSUksY0FBYztBQUNoQkMsV0FBUztBQUNQQyxVQUFNLFNBREM7QUFFUEMsbUJBQWUsS0FGUjtBQUdQQyxvQkFBZ0IsS0FIVDtBQUlQQyxzQkFBa0JWLGFBSlg7QUFLUFcsd0JBQW9CUixlQUxiO0FBTVBTLHVCQUFtQlosYUFOWjtBQU9QYSx5QkFBcUJWO0FBUGQsR0FETzs7QUFXaEJXLGdCQUFjO0FBQ1pQLFVBQU0sY0FETTtBQUVaQyxtQkFBZSxLQUZIO0FBR1pDLG9CQUFnQixLQUhKO0FBSVpDLHNCQUFrQlYsYUFKTjtBQUtaVyx3QkFBb0JSLGVBTFI7QUFNWlMsdUJBQW1CWixhQU5QO0FBT1phLHlCQUFxQlY7QUFQVDtBQVhFLENBQWxCOztBQXNCQSxJQUFJWSxrQkFBa0JDLE9BQU9DLGdDQUFQLEdBQTBDRCxPQUFPQyxnQ0FBUCxJQUEyQyxFQUEzRzs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQixTQUFTQyxtQkFBVCxPQUFxRjtBQUFBOztBQUFBLE1BQXREQyxVQUFzRCxRQUF0REEsVUFBc0Q7QUFBQSxNQUExQ0MsV0FBMEMsUUFBMUNBLFdBQTBDO0FBQUEsTUFBN0JDLFNBQTZCLFFBQTdCQSxTQUE2QjtBQUFBLE1BQWxCQyxlQUFrQixRQUFsQkEsZUFBa0I7O0FBQ3BHLE1BQUlDLFVBQVVKLFdBQVdDLFdBQVgsRUFBd0JDLFNBQXhCLEVBQW1DbkMsT0FBbkMsQ0FBZDtBQUNBLE1BQUlzQyxhQUFhekMsUUFBUSxTQUFSLEVBQW1CeUMsVUFBbkIsQ0FBOEJKLFdBQTlCLEVBQTJDQyxTQUEzQyxFQUFzRG5DLE9BQXRELENBQWpCO0FBQ0EsTUFBSTtBQUFBLFFBRUV1QyxnQkFGRjtBQUFBLFFBSUVDLFdBSkY7QUFBQSxRQUtFQyxhQUxGO0FBQUEsUUFlRUMsV0FmRjs7QUFBQTtBQUFBLFVBcURPQyxXQXJEUCxHQXFERixTQUFTQSxXQUFULENBQXNCQyxJQUF0QixFQUE0QjtBQUMxQixlQUFPLFVBQUNDLFNBQUQsRUFBZTtBQUNwQixjQUFJQSxTQUFKLEVBQWNSLFFBQVFTLEtBQVIsa0JBQStCRixLQUFLRyxPQUFMLENBQWFGLFNBQWIsSUFBMEIsQ0FBekQ7QUFDZCxpQkFBTyxDQUFDRCxJQUFELElBQVMsQ0FBQ0MsU0FBVixHQUFzQixJQUF0QixHQUE2QkQsS0FBS0csT0FBTCxDQUFhRixTQUFiLElBQTBCLENBQTlEO0FBQ0QsU0FIRDtBQUlELE9BMURDOztBQUFBLFVBMkRhRyxHQTNEYixHQTJERixrQkFBb0JkLFdBQXBCLEVBQWlDZSxNQUFqQyxFQUF5Q0MsSUFBekMsRUFBK0NDLElBQS9DO0FBQUEsWUFBcURDLE9BQXJELHVFQUErRCxJQUEvRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRWYsd0JBQVFTLEtBQVIsQ0FBYyxTQUFTWixXQUFULEdBQXVCLEdBQXZCLEdBQTZCZSxNQUE3QixHQUFzQyxhQUF0QyxHQUFzREUsS0FBS0UsU0FBekUsRUFBb0YsRUFBQ0gsVUFBRCxFQUFPRSxnQkFBUCxFQUFnQkQsVUFBaEIsRUFBcEY7QUFERjtBQUFBLGdEQUU4QmYsZ0JBQWdCRixXQUFoQixFQUE2QixTQUE3QixDQUY5Qjs7QUFBQTtBQUVNb0IsK0JBRk47QUFBQTtBQUFBLGdEQUdrQ1osWUFBWSxFQUFDYSxNQUFNLFVBQVAsRUFBbUJDLHFCQUFxQnRCLFdBQXhDLEVBQXFEdUIsUUFBUUgsZ0JBQWdCRyxNQUE3RSxFQUFxRkwsZ0JBQXJGLEVBQThGSCxjQUE5RixFQUFzR1MsY0FBYyxJQUFwSCxFQUEwSFIsVUFBMUgsRUFBZ0lDLFVBQWhJLEVBQVosQ0FIbEM7O0FBQUE7QUFHTVEsbUNBSE47QUFBQSxrREFJU0EsbUJBSlQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0EzREU7O0FBQUEsVUFpRWFDLElBakViLEdBaUVGLGtCQUFxQkwsSUFBckIsRUFBMkJMLElBQTNCLEVBQWlDQyxJQUFqQztBQUFBLFlBQXVDVSxvQkFBdkMsdUVBQThELElBQTlEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFeEIsd0JBQVFTLEtBQVIsQ0FBYyxVQUFVUyxJQUFWLEdBQWlCLGFBQWpCLEdBQWlDSixLQUFLRSxTQUFwRCxFQUErRCxFQUFDRSxVQUFELEVBQU9MLFVBQVAsRUFBYUMsVUFBYixFQUEvRDtBQURGLCtCQUV5QlcsTUFGekI7QUFBQSwrQkFFdUMsRUFGdkM7QUFBQSwrQkFFMkN2QixnQkFGM0M7QUFBQTtBQUFBLGdEQUVtRUgsZ0JBQWdCRixXQUFoQixFQUE2QixhQUE3QixDQUZuRTs7QUFBQTtBQUFBO0FBRU02QixnQ0FGTixnQkFFZ0NDLE1BRmhDOztBQUFBLG9CQUdPRCxpQkFBaUJSLElBQWpCLENBSFA7QUFBQTtBQUFBO0FBQUE7O0FBQUEsa0RBR3NDbEIsUUFBUTRCLElBQVIsQ0FBYVYsT0FBTyx5Q0FBcEIsQ0FIdEM7O0FBQUE7QUFJTVcsK0JBSk4sR0FJd0JILGlCQUFpQlIsSUFBakIsQ0FKeEI7QUFBQTtBQUFBLGdEQU1tQ1ksc0JBQXNCLGVBQXRCLEVBQXVDakMsV0FBdkMsQ0FObkM7O0FBQUE7QUFNTWtDLG9DQU5OO0FBQUE7QUFBQSxnREFRK0JoQyxnQkFBZ0IsR0FBaEIsRUFBcUIsU0FBckIsRUFBZ0NGLFdBQWhDLEVBQTZDLElBQTdDLENBUi9COztBQUFBO0FBUU1tQyxnQ0FSTjs7QUFTRTtBQUNJQyw2QkFWTixHQVVzQixFQVZ0QjtBQVdNQyw4QkFYTixHQVd1QixFQVh2Qjs7QUFZRSxvQkFBSUgscUJBQXFCYixJQUFyQixDQUFKLEVBQStCZ0IsaUJBQWlCQSxlQUFlQyxNQUFmLENBQXNCSixxQkFBcUJiLElBQXJCLENBQXRCLENBQWpCO0FBQy9CLG9CQUFJYSxxQkFBcUIsR0FBckIsQ0FBSixFQUE4QkcsaUJBQWlCQSxlQUFlQyxNQUFmLENBQXNCSixxQkFBcUIsR0FBckIsQ0FBdEIsQ0FBakI7QUFDMUJLLG9DQWROLEdBYzZCOUIsWUFBWXVCLGdCQUFnQnRCLElBQTVCLENBZDdCOztBQWVFMkIsaUNBQWlCQSxlQUFlRyxNQUFmLENBQXNCO0FBQUEseUJBQWlCRCxxQkFBcUJFLGNBQWNDLEtBQWQsQ0FBb0JqQyxXQUF6QyxDQUFqQjtBQUFBLGlCQUF0QixDQUFqQjs7QUFmRixvQkFnQk80QixlQUFlTSxNQWhCdEI7QUFBQTtBQUFBO0FBQUE7O0FBaUJJeEMsd0JBQVFTLEtBQVIsQ0FBY1MsT0FBTywyQkFBckI7QUFqQkosa0RBa0JXLEtBbEJYOztBQUFBO0FBb0JFZ0IsK0JBQWVPLE9BQWYsQ0FBdUIsVUFBQ0gsYUFBRCxFQUFtQjtBQUN4QyxzQkFBSW5CLHNCQUFzQm1CLGNBQWN6QyxXQUF4QztBQUNBLHNCQUFJb0Isa0JBQWtCZSxpQkFBaUJiLG1CQUFqQixDQUF0QjtBQUNBLHNCQUFJdUIsb0JBQW9CSixjQUFjQyxLQUF0Qzs7QUFFQTtBQUNBLHNCQUFJRyxrQkFBa0JDLE9BQXRCLEVBQStCO0FBQzdCLHdCQUFJQyxRQUFRMUIsT0FBT0MsbUJBQVAsR0FBNkJ1QixrQkFBa0I5QixNQUEzRDtBQUNBLHdCQUFJLENBQUN0QixnQkFBZ0JzRCxLQUFoQixDQUFMLEVBQTZCO0FBQzNCLDBCQUFJN0IsVUFBVThCLFdBQVcsWUFBTTtBQUM3Qiw0QkFBSUMsYUFBYXhELGdCQUFnQnNELEtBQWhCLENBQWpCO0FBQ0EsK0JBQU90RCxnQkFBZ0JzRCxLQUFoQixDQUFQO0FBQ0F2QyxvQ0FBWXlDLFVBQVo7QUFDRCx1QkFKYSxFQUlYSixrQkFBa0JDLE9BSlAsQ0FBZDtBQUtBckQsc0NBQWdCc0QsS0FBaEIsSUFBeUIsRUFBQ3BCLDBDQUFELEVBQXVCTixNQUFNLGVBQTdCLEVBQThDQyx3Q0FBOUMsRUFBbUU0QixPQUFPLElBQTFFLEVBQWdGaEMsU0FBUyxLQUF6RixFQUFnR0gsUUFBUThCLGtCQUFrQjlCLE1BQTFILEVBQWtJUSxRQUFRSCxnQkFBZ0JHLE1BQTFKLEVBQWtLUCxNQUFNLEVBQUMwQixPQUFPckIsSUFBUixFQUFjOEIsVUFBVSxFQUF4QixFQUF4SyxFQUFxTWxDLFVBQXJNLEVBQXpCO0FBQ0Q7QUFDRHhCLG9DQUFnQnNELEtBQWhCLEVBQXVCL0IsSUFBdkIsQ0FBNEJtQyxRQUE1QixDQUFxQ0MsSUFBckMsQ0FBMEMsRUFBQ3BDLFVBQUQsRUFBT0MsVUFBUCxFQUExQztBQUNELG1CQVhELE1BV087QUFDTCx3QkFBSW9DLHFCQUFxQjdDLFlBQVksRUFBQ2EsVUFBRCxFQUFPQyx3Q0FBUCxFQUE0QkMsUUFBUUgsZ0JBQWdCRyxNQUFwRCxFQUE0REwsU0FBU2MsZ0JBQWdCZCxPQUFyRixFQUE4RkgsUUFBUThCLGtCQUFrQjlCLE1BQXhILEVBQWdJUyxjQUFjcUIsa0JBQWtCckIsWUFBaEssRUFBOEtSLFVBQTlLLEVBQW9MQyxVQUFwTCxFQUFaLENBQXpCO0FBQ0Esd0JBQUk0QixrQkFBa0JyQixZQUFsQixJQUFrQ1EsZ0JBQWdCc0IsWUFBdEQsRUFBbUVsQixjQUFjZ0IsSUFBZCxDQUFtQkMsa0JBQW5CO0FBQ3BFO0FBQ0YsaUJBckJEO0FBc0JBbEQsd0JBQVFTLEtBQVIsQ0FBYyxVQUFVUyxJQUFWLEdBQWlCLGdCQUEvQixFQUFpRGUsYUFBakQ7O0FBMUNGLHFCQTRDTUosZ0JBQWdCc0IsWUE1Q3RCO0FBQUE7QUFBQTtBQUFBOztBQTZDSSxvQkFBSXRCLGdCQUFnQnVCLGdCQUFoQixJQUFvQyxDQUFDbkIsY0FBY08sTUFBdkQsRUFBK0R2QyxXQUFXaUIsT0FBTyx3QkFBbEI7QUFDL0Qsb0JBQUlXLGdCQUFnQndCLGNBQXBCLEVBQW9DQyxnQkFBZ0JyQixjQUFjLENBQWQsQ0FBaEIsQ0FBcEMsS0FDS3FCLGdCQUFnQkMsUUFBUUMsR0FBUixDQUFZdkIsYUFBWixDQUFoQjtBQS9DVDtBQUFBLGdEQWdEdUJxQixhQWhEdkI7O0FBQUE7QUFnRFE5RSxzQkFoRFI7O0FBaURJd0Isd0JBQVFTLEtBQVIsQ0FBYyxVQUFVUyxJQUFWLEdBQWlCLFVBQS9CLEVBQTJDMUMsTUFBM0M7QUFqREosa0RBa0RXQSxNQWxEWDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQWpFRTs7QUFDRlosb0JBQWMsRUFBQ2lDLHdCQUFELEVBQWNDLG9CQUFkLEVBQXlCQyxnQ0FBekIsRUFBZDtBQUNJRyx5QkFBbUIxQyxRQUFRLDJCQUFSLENBRnJCO0FBSUUyQyxvQkFBYyxFQUpoQjs7QUFLRUMsc0JBQWdCLHVCQUFDZ0IsTUFBRDtBQUFBLGVBQVksSUFBSW1DLE9BQUosQ0FBWSxVQUFDRSxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDL0QsY0FBSUMsTUFBSjtBQUNBLGNBQUl4RCxZQUFZaUIsTUFBWixDQUFKLEVBQXdCdUMsU0FBU3hELFlBQVlpQixNQUFaLENBQVQsQ0FBeEIsS0FDSztBQUNILGdCQUFJd0MsY0FBY25HLEtBQUtvRyw0QkFBTCxDQUFrQ2pGLFdBQWxDLENBQWxCO0FBQ0ErRSxxQkFBU3hELFlBQVlpQixNQUFaLElBQXNCLElBQUl3QyxXQUFKLENBQWdCeEMsTUFBaEIsRUFBd0IzRCxLQUFLcUcsV0FBTCxDQUFpQkMsY0FBakIsRUFBeEIsQ0FBL0I7QUFDRDtBQUNEL0Qsa0JBQVFTLEtBQVIsQ0FBYyxnQkFBZCxFQUFnQ2tELE1BQWhDO0FBQ0FGLGtCQUFRRSxNQUFSO0FBQ0QsU0FUK0IsQ0FBWjtBQUFBLE9BTGxCOztBQWVFdEQsb0JBQWM7QUFBQSxZQUFFbUIsb0JBQUYsU0FBRUEsb0JBQUY7QUFBQSxZQUF3Qk4sSUFBeEIsU0FBd0JBLElBQXhCO0FBQUEsWUFBOEJFLE1BQTlCLFNBQThCQSxNQUE5QjtBQUFBLGtDQUFzQ0wsT0FBdEM7QUFBQSxZQUFzQ0EsT0FBdEMsaUNBQWdELElBQWhEO0FBQUEsWUFBc0RILE1BQXRELFNBQXNEQSxNQUF0RDtBQUFBLGdDQUE4RG1DLEtBQTlEO0FBQUEsWUFBOERBLEtBQTlELCtCQUFzRSxLQUF0RTtBQUFBLFlBQTZFMUIsWUFBN0UsU0FBNkVBLFlBQTdFO0FBQUEsWUFBMkZSLElBQTNGLFNBQTJGQSxJQUEzRjtBQUFBLFlBQWlHTSxtQkFBakcsU0FBaUdBLG1CQUFqRztBQUFBLFlBQXNITCxJQUF0SCxTQUFzSEEsSUFBdEg7QUFBQSxlQUFnSSxJQUFJeUMsT0FBSixDQUFZLFVBQUNFLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNqTDFELGtCQUFRUyxLQUFSLENBQWMsaUJBQWlCUyxJQUFqQixHQUF3QixNQUF4QixHQUFpQ0MsbUJBQS9DLEVBQW9FLEVBQUNELFVBQUQsRUFBT0wsVUFBUCxFQUFhTSx3Q0FBYixFQUFrQ0wsVUFBbEMsRUFBcEU7QUFDQVYsd0JBQWNnQixNQUFkLEVBQXNCNEMsSUFBdEIsQ0FBMkIsVUFBQ0wsTUFBRCxFQUFZO0FBQ3JDO0FBQ0EsZ0JBQUlNLFdBQUo7QUFDQSxnQkFBSWpELFlBQVlGLEtBQUtFLFNBQXJCO0FBQ0EsZ0JBQUlrRCxTQUFTcEQsS0FBS29ELE1BQWxCO0FBQ0EsZ0JBQUlDLGtCQUFrQixTQUF0QjtBQUNBLGdCQUFJcEIsS0FBSixFQUFXb0Isa0JBQWtCLGNBQWxCO0FBQ1gsZ0JBQUlDLE9BQU9ULE9BQU9RLGVBQVAsRUFBd0IsRUFBRXRFLHdCQUFGLEVBQWVDLG9CQUFmLEVBQTBCeUMsT0FBT3JCLElBQWpDLEVBQXVDTixjQUF2QyxFQUErQ0MsVUFBL0MsRUFBcURHLG9CQUFyRCxFQUFnRWtELGNBQWhFLEVBQXhCLEVBQWlHLFVBQUNHLEtBQUQsRUFBUUMsZUFBUixFQUE0QjtBQUN0SSxrQkFBSUwsV0FBSixFQUFnQk0sYUFBYU4sV0FBYjtBQUNoQixrQkFBSUksS0FBSixFQUFVWCxPQUFPVyxLQUFQO0FBQ1ZaLHNCQUFRYSxlQUFSO0FBQ0QsYUFKVSxDQUFYO0FBS0FMLDBCQUFjcEIsV0FBVyxZQUFNO0FBQzdCdUIsbUJBQUtJLE1BQUw7QUFDQXhFLHNCQUFRNEIsSUFBUixDQUFhLHlCQUF5QlYsSUFBekIsR0FBZ0MsTUFBaEMsR0FBeUNDLG1CQUF0RCxFQUEyRSxFQUFDdEIsd0JBQUQsRUFBY2tCLGdCQUFkLEVBQTNFO0FBQ0Esa0JBQUlNLFlBQUosRUFBaUJxQyxPQUFPLEVBQUM3RSxTQUFTLG9DQUFWLEVBQWdEZ0MsVUFBaEQsRUFBc0RNLHdDQUF0RCxFQUFQLEVBQWpCLEtBQ0tzQztBQUNOLGFBTGEsRUFLWDFDLE9BTFcsQ0FBZDtBQU1ELFdBbEJELEVBa0JHMEQsS0FsQkgsQ0FrQlMsaUJBQVM7QUFDaEJ6RSxvQkFBUTRCLElBQVIsQ0FBYSxzQkFBc0JWLElBQXRCLEdBQTZCLE1BQTdCLEdBQXNDQyxtQkFBbkQsRUFBd0VrRCxLQUF4RTtBQUNBWCxtQkFBT1csS0FBUDtBQUNELFdBckJEO0FBc0JELFNBeEJpSixDQUFoSTtBQUFBLE9BZmhCOztBQXdDRixVQUFNdkMsd0JBQXdCO0FBQUEsWUFBTzRDLE1BQVAsdUVBQWdCLGVBQWhCO0FBQUEsWUFBaUNDLE9BQWpDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0RBQ0Q1RSxnQkFBZ0IsR0FBaEIsRUFBcUIyRSxNQUFyQixFQUE2QkMsT0FBN0IsQ0FEQzs7QUFBQTtBQUN4QkMsOEJBRHdCO0FBRXhCQyx5QkFGd0IsR0FFWixFQUZZOztBQUc1QkQsK0JBQWVuQyxPQUFmLENBQXVCLG1CQUFXO0FBQ2hDLHNCQUFJNUMsY0FBY2lGLFFBQVFqRixXQUExQjtBQUNBNEIseUJBQU9zRCxJQUFQLENBQVlELE9BQVosRUFBcUJyQyxPQUFyQixDQUE2QixxQkFBYTtBQUN4Qyx3QkFBSSxDQUFDb0MsVUFBVUcsU0FBVixDQUFMLEVBQTBCSCxVQUFVRyxTQUFWLElBQXVCLEVBQXZCO0FBQzFCSCw4QkFBVUcsU0FBVixFQUFxQi9CLElBQXJCLENBQTBCLEVBQUNwRCx3QkFBRCxFQUFjMEMsT0FBT3VDLFFBQVFFLFNBQVIsQ0FBckIsRUFBeUNBLG9CQUF6QyxFQUExQjtBQUNELG1CQUhELEVBR0dGLE9BSEg7QUFJRCxpQkFORDtBQUg0QixpREFVckJELFNBVnFCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQTlCOztBQStFQTtBQUFBLFdBQU87QUFDTEksK0JBREssbUNBQ29CO0FBQ3ZCLG1CQUFPcEgsa0JBQVA7QUFDRCxXQUhJO0FBSUxxSCxpQ0FKSyxxQ0FJc0I7QUFDekJySCxpQ0FBcUIsQ0FBckI7QUFDRCxXQU5JO0FBT0xzSCw4QkFQSyxnQ0FPaUJDLE9BUGpCLEVBTzBCO0FBQzdCdEgsZ0NBQW9Cc0gsT0FBcEI7QUFDRCxXQVRJO0FBVUxDLGdDQVZLLGtDQVVtQkQsT0FWbkIsRUFVNEI7QUFDL0JoSCxrQ0FBc0JnSCxPQUF0QjtBQUNELFdBWkk7O0FBYUw3RCxvQkFiSztBQWNMWjtBQWRLO0FBQVA7QUF2SEU7O0FBQUE7QUF1SUgsR0F2SUQsQ0F1SUUsT0FBTzBELEtBQVAsRUFBYztBQUNkcEUsZUFBVyxxQkFBWCxFQUFrQyxFQUFDb0UsWUFBRCxFQUFRdEUsZ0NBQVIsRUFBeUJGLHdCQUF6QixFQUFsQztBQUNEO0FBQ0YsQ0E3SUQiLCJmaWxlIjoibmV0LmNsaWVudC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBncnBjID0gcmVxdWlyZSgnZ3JwYycpXG52YXIgemxpYiA9IHJlcXVpcmUoJ3psaWInKVxuY29uc3QgUEFDS0FHRSA9ICduZXQuY2xpZW50J1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5cbi8vIE1FU1NBR0UgU0VSSUFMSVpBVElPTlxudmFyIHNlcmlhbGl6ZWREYXRhQnl0ZSA9IDBcbnZhciBzZXJpYWxpemVGdW5jdGlvbiA9IChvYmosIGRpY3Rpb25hcnkpID0+IHpsaWIuZGVmbGF0ZVN5bmMoSlNPTi5zdHJpbmdpZnkob2JqKSwge2RpY3Rpb25hcnl9KVxudmFyIGRlc2VyaWFsaXplRnVuY3Rpb24gPSAob2JqLCBkaWN0aW9uYXJ5KSA9PiBKU09OLnBhcnNlKHpsaWIuaW5mbGF0ZVN5bmMob2JqLCB7ZGljdGlvbmFyeX0pKVxuZnVuY3Rpb24gc2VyaWFsaXplSnNvbiAob2JqKSB7XG4gIHZhciByZXN1bHQgPSBzZXJpYWxpemVGdW5jdGlvbihvYmopXG4gIHNlcmlhbGl6ZWREYXRhQnl0ZSArPSAocmVzdWx0LmJ5dGVMZW5ndGgpXG4gIHJldHVybiByZXN1bHRcbn1cbmZ1bmN0aW9uIGRlc2VyaWFsaXplSnNvbiAoYnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBkZXNlcmlhbGl6ZUZ1bmN0aW9uKGJ1ZmZlcilcbiAgcmV0dXJuIHJlc3VsdFxufVxudmFyIGdycGNTZXJ2aWNlID0ge1xuICBtZXNzYWdlOiB7XG4gICAgcGF0aDogJ21lc3NhZ2UnLFxuICAgIHJlcXVlc3RTdHJlYW06IGZhbHNlLFxuICAgIHJlc3BvbnNlU3RyZWFtOiBmYWxzZSxcbiAgICByZXF1ZXN0U2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlcXVlc3REZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlU2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlRGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvblxuICB9LFxuXG4gIG1lc3NhZ2VNdWx0aToge1xuICAgIHBhdGg6ICdtZXNzYWdlTXVsdGknLFxuICAgIHJlcXVlc3RTdHJlYW06IGZhbHNlLFxuICAgIHJlc3BvbnNlU3RyZWFtOiBmYWxzZSxcbiAgICByZXF1ZXN0U2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlcXVlc3REZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlU2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlRGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvblxuICB9XG59XG5cbnZhciBkZWxheWVkU2VuZERhdGEgPSBnbG9iYWwuSkVTVVNfTkVUX0NMSUVOVF9kZWxheWVkU2VuZERhdGEgPSBnbG9iYWwuSkVTVVNfTkVUX0NMSUVOVF9kZWxheWVkU2VuZERhdGEgfHwge31cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXROZXRDbGllbnRQYWNrYWdlICh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZ2V0U2hhcmVkQ29uZmlnfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGdldFNoYXJlZENvbmZpZ30pXG4gICAgdmFyIGRlZmF1bHRFdmVudEVtaXQgPSByZXF1aXJlKCcuL2RlZmF1bHQuZXZlbnQuZW1pdC5qc29uJylcblxuICAgIHZhciBjbGllbnRDYWNoZSA9IHt9XG4gICAgdmFyIGdldEdycGNDbGllbnQgPSAobmV0VXJsKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB2YXIgY2xpZW50XG4gICAgICBpZiAoY2xpZW50Q2FjaGVbbmV0VXJsXSljbGllbnQgPSBjbGllbnRDYWNoZVtuZXRVcmxdXG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIENsaWVudENsYXNzID0gZ3JwYy5tYWtlR2VuZXJpY0NsaWVudENvbnN0cnVjdG9yKGdycGNTZXJ2aWNlKVxuICAgICAgICBjbGllbnQgPSBjbGllbnRDYWNoZVtuZXRVcmxdID0gbmV3IENsaWVudENsYXNzKG5ldFVybCwgZ3JwYy5jcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgICAgfVxuICAgICAgQ09OU09MRS5kZWJ1ZygnZ2V0R3JwY0NsaWVudCAnLCBjbGllbnQpXG4gICAgICByZXNvbHZlKGNsaWVudClcbiAgICB9KVxuICAgIHZhciBzZW5kTWVzc2FnZSA9ICh7dGhyb3dPbkVycm9yUmVzcG9uc2UsIG5hbWUsIG5ldFVybCwgdGltZW91dCA9IDUwMDAsIG1ldGhvZCwgbXVsdGkgPSBmYWxzZSwgaGF2ZVJlc3BvbnNlLCBkYXRhLCBsaXN0ZW5lclNlcnZpY2VOYW1lLCBtZXRhfSkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZE1lc3NhZ2UgJyArIG5hbWUgKyAnIHRvICcgKyBsaXN0ZW5lclNlcnZpY2VOYW1lLCB7bmFtZSwgZGF0YSwgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbWV0YX0pXG4gICAgICBnZXRHcnBjQ2xpZW50KG5ldFVybCkudGhlbigoY2xpZW50KSA9PiB7XG4gICAgICAgIC8vIGlmIChldmVudExpc3RlbkNvbmZpZy5oYXZlUmVzcG9uc2UpIHtcbiAgICAgICAgdmFyIGNhbGxUaW1lb3V0XG4gICAgICAgIHZhciByZXF1ZXN0SWQgPSBtZXRhLnJlcXVlc3RJZFxuICAgICAgICB2YXIgdXNlcklkID0gbWV0YS51c2VySWRcbiAgICAgICAgdmFyIG1lc3NhZ2VGdW5jdGlvbiA9ICdtZXNzYWdlJ1xuICAgICAgICBpZiAobXVsdGkpIG1lc3NhZ2VGdW5jdGlvbiA9ICdtZXNzYWdlTXVsdGknXG4gICAgICAgIHZhciBjYWxsID0gY2xpZW50W21lc3NhZ2VGdW5jdGlvbl0oeyBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBldmVudDogbmFtZSwgbWV0aG9kLCBkYXRhLCByZXF1ZXN0SWQsIHVzZXJJZH0sIChlcnJvciwgc2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKGNhbGxUaW1lb3V0KWNsZWFyVGltZW91dChjYWxsVGltZW91dClcbiAgICAgICAgICBpZiAoZXJyb3IpcmVqZWN0KGVycm9yKVxuICAgICAgICAgIHJlc29sdmUoc2VydmljZVJlc3BvbnNlKVxuICAgICAgICB9KVxuICAgICAgICBjYWxsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGNhbGwuY2FuY2VsKClcbiAgICAgICAgICBDT05TT0xFLndhcm4oJ3NlbmRNZXNzYWdlIHRpbWVvdXQgJyArIG5hbWUgKyAnIHRvICcgKyBsaXN0ZW5lclNlcnZpY2VOYW1lLCB7c2VydmljZU5hbWUsIHRpbWVvdXQgfSlcbiAgICAgICAgICBpZiAoaGF2ZVJlc3BvbnNlKXJlamVjdCh7bWVzc2FnZTogJ1Jlc3BvbnNlIHByb2JsZW1zOiBSRVFVRVNUIFRJTUVPVVQnLCBkYXRhLCBsaXN0ZW5lclNlcnZpY2VOYW1lfSlcbiAgICAgICAgICBlbHNlIHJlc29sdmUoKVxuICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBDT05TT0xFLndhcm4oJ3NlbmRNZXNzYWdlIGVycm9yJyArIG5hbWUgKyAnIHRvICcgKyBsaXN0ZW5lclNlcnZpY2VOYW1lLCBlcnJvcilcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfSlcbiAgICB9KVxuICAgIGNvbnN0IGJ1aWxkU2VydmljZXNSZWdpc3RyeSA9IGFzeW5jIChzY2hlbWEgPSAnZXZlbnRzLmxpc3RlbicsIGV4Y2x1ZGUpID0+IHtcbiAgICAgIHZhciBzZXJ2aWNlc0NvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZygnKicsIHNjaGVtYSwgZXhjbHVkZSlcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSB7fVxuICAgICAgc2VydmljZXNDb25maWcuZm9yRWFjaChzZXJ2aWNlID0+IHtcbiAgICAgICAgdmFyIHNlcnZpY2VOYW1lID0gc2VydmljZS5zZXJ2aWNlTmFtZVxuICAgICAgICBPYmplY3Qua2V5cyhzZXJ2aWNlKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgICAgaWYgKCFsaXN0ZW5lcnNbZXZlbnROYW1lXSlsaXN0ZW5lcnNbZXZlbnROYW1lXSA9IFtdXG4gICAgICAgICAgbGlzdGVuZXJzW2V2ZW50TmFtZV0ucHVzaCh7c2VydmljZU5hbWUsIGV2ZW50OiBzZXJ2aWNlW2V2ZW50TmFtZV0sIGV2ZW50TmFtZX0pXG4gICAgICAgIH0sIHNlcnZpY2UpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIGxpc3RlbmVyc1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckJ5VGFnICh0YWdzKSB7XG4gICAgICByZXR1cm4gKHRhZ0ZpbHRlcikgPT4ge1xuICAgICAgICBpZiAodGFnRmlsdGVyKUNPTlNPTEUuZGVidWcoYGZpbHRlckJ5VGFnKClgLCB0YWdzLmluZGV4T2YodGFnRmlsdGVyKSArIDEpXG4gICAgICAgIHJldHVybiAhdGFncyB8fCAhdGFnRmlsdGVyID8gdHJ1ZSA6IHRhZ3MuaW5kZXhPZih0YWdGaWx0ZXIpICsgMVxuICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBycGMgKHNlcnZpY2VOYW1lLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXQgPSA1MDAwKSB7XG4gICAgICBDT05TT0xFLmRlYnVnKCdycGMgJyArIHNlcnZpY2VOYW1lICsgJyAnICsgbWV0aG9kICsgJyByZXF1ZXN0SWQ6JyArIG1ldGEucmVxdWVzdElkLCB7ZGF0YSwgdGltZW91dCwgbWV0YX0pXG4gICAgICB2YXIgbGlzdGVuZXJTZXJ2aWNlID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnc2VydmljZScpIC8vIFRPIEZJWCBBREQgQ0FDSEVcbiAgICAgIHZhciBzZW5kTWVzc2FnZVJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2Uoe25hbWU6ICdfcnBjQ2FsbCcsIGxpc3RlbmVyU2VydmljZU5hbWU6IHNlcnZpY2VOYW1lLCBuZXRVcmw6IGxpc3RlbmVyU2VydmljZS5uZXRVcmwsIHRpbWVvdXQsIG1ldGhvZCwgaGF2ZVJlc3BvbnNlOiB0cnVlLCBkYXRhLCBtZXRhfSlcbiAgICAgIHJldHVybiBzZW5kTWVzc2FnZVJlc3BvbnNlXG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGVtaXQgKG5hbWUsIGRhdGEsIG1ldGEsIHRocm93T25FcnJvclJlc3BvbnNlID0gdHJ1ZSkge1xuICAgICAgQ09OU09MRS5kZWJ1ZygnZW1pdCAnICsgbmFtZSArICcgcmVxdWVzdElkOicgKyBtZXRhLnJlcXVlc3RJZCwge25hbWUsIGRhdGEsIG1ldGF9KVxuICAgICAgdmFyIGV2ZW50c0VtaXRDb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0RXZlbnRFbWl0LCBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdldmVudHMuZW1pdCcpKVxuICAgICAgaWYgKCFldmVudHNFbWl0Q29uZmlnW25hbWVdKSByZXR1cm4gQ09OU09MRS53YXJuKG5hbWUgKyAnIGV2ZW50IG5vdCBkZWZpbmVkIGluIC9ldmVudHMuZW1pdC5qc29uJylcbiAgICAgIHZhciBldmVudEVtaXRDb25maWcgPSBldmVudHNFbWl0Q29uZmlnW25hbWVdXG5cbiAgICAgIHZhciBldmVudHNMaXN0ZW5SZWdpc3RyeSA9IGF3YWl0IGJ1aWxkU2VydmljZXNSZWdpc3RyeSgnZXZlbnRzLmxpc3RlbicsIHNlcnZpY2VOYW1lKVxuXG4gICAgICB2YXIgc2VydmljZXNSZWdpc3RyeSA9IGF3YWl0IGdldFNoYXJlZENvbmZpZygnKicsICdzZXJ2aWNlJywgc2VydmljZU5hbWUsIHRydWUpXG4gICAgICAvLyBDT05TT0xFLmRlYnVnKCdlbWl0IGluZm8nLCB7ZXZlbnRFbWl0Q29uZmlnLCBldmVudHNMaXN0ZW5SZWdpc3RyeSwgc2VydmljZXNSZWdpc3RyeX0pXG4gICAgICB2YXIgd2FpdFJlc3BvbnNlcyA9IFtdXG4gICAgICB2YXIgZXZlbnRMaXN0ZW5lcnMgPSBbXVxuICAgICAgaWYgKGV2ZW50c0xpc3RlblJlZ2lzdHJ5W25hbWVdKWV2ZW50TGlzdGVuZXJzID0gZXZlbnRMaXN0ZW5lcnMuY29uY2F0KGV2ZW50c0xpc3RlblJlZ2lzdHJ5W25hbWVdKVxuICAgICAgaWYgKGV2ZW50c0xpc3RlblJlZ2lzdHJ5WycqJ10pZXZlbnRMaXN0ZW5lcnMgPSBldmVudExpc3RlbmVycy5jb25jYXQoZXZlbnRzTGlzdGVuUmVnaXN0cnlbJyonXSlcbiAgICAgIHZhciBmaWx0ZXJCeVRhZ0V2ZW50RW1pdCA9IGZpbHRlckJ5VGFnKGV2ZW50RW1pdENvbmZpZy50YWdzKVxuICAgICAgZXZlbnRMaXN0ZW5lcnMgPSBldmVudExpc3RlbmVycy5maWx0ZXIoZXZlbnRMaXN0ZW5lciA9PiBmaWx0ZXJCeVRhZ0V2ZW50RW1pdChldmVudExpc3RlbmVyLmV2ZW50LmZpbHRlckJ5VGFnKSlcbiAgICAgIGlmICghZXZlbnRMaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcobmFtZSArICcgZXZlbnQgaGF2ZSBubyBsaXN0ZW5lcnMgJylcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKSA9PiB7XG4gICAgICAgIHZhciBsaXN0ZW5lclNlcnZpY2VOYW1lID0gZXZlbnRMaXN0ZW5lci5zZXJ2aWNlTmFtZVxuICAgICAgICB2YXIgbGlzdGVuZXJTZXJ2aWNlID0gc2VydmljZXNSZWdpc3RyeVtsaXN0ZW5lclNlcnZpY2VOYW1lXVxuICAgICAgICB2YXIgZXZlbnRMaXN0ZW5Db25maWcgPSBldmVudExpc3RlbmVyLmV2ZW50XG5cbiAgICAgICAgLy8gdmFyIHNlbmRNZXNzYWdlUHJvbWlzZSA9IHNlbmRNZXNzYWdlKHtuYW1lLCBsaXN0ZW5lclNlcnZpY2UsIGxpc3RlbmVyU2VydmljZU5hbWUsIGV2ZW50TGlzdGVuQ29uZmlnLCBldmVudEVtaXRDb25maWcsIGRhdGEsIGxpc3RlbmVyU2VydmljZU5hbWUsIG1ldGF9KVxuICAgICAgICBpZiAoZXZlbnRMaXN0ZW5Db25maWcuZGVsYXllZCkge1xuICAgICAgICAgIHZhciBpbmRleCA9IG5hbWUgKyBsaXN0ZW5lclNlcnZpY2VOYW1lICsgZXZlbnRMaXN0ZW5Db25maWcubWV0aG9kXG4gICAgICAgICAgaWYgKCFkZWxheWVkU2VuZERhdGFbaW5kZXhdKSB7XG4gICAgICAgICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB2YXIgbXVsdGlFdmVudCA9IGRlbGF5ZWRTZW5kRGF0YVtpbmRleF1cbiAgICAgICAgICAgICAgZGVsZXRlIGRlbGF5ZWRTZW5kRGF0YVtpbmRleF1cbiAgICAgICAgICAgICAgc2VuZE1lc3NhZ2UobXVsdGlFdmVudClcbiAgICAgICAgICAgIH0sIGV2ZW50TGlzdGVuQ29uZmlnLmRlbGF5ZWQpXG4gICAgICAgICAgICBkZWxheWVkU2VuZERhdGFbaW5kZXhdID0ge3Rocm93T25FcnJvclJlc3BvbnNlLCBuYW1lOiAnX21lc3NhZ2VNdWx0aScsIGxpc3RlbmVyU2VydmljZU5hbWUsIG11bHRpOiB0cnVlLCB0aW1lb3V0OiA2MDAwMCwgbWV0aG9kOiBldmVudExpc3RlbkNvbmZpZy5tZXRob2QsIG5ldFVybDogbGlzdGVuZXJTZXJ2aWNlLm5ldFVybCwgZGF0YToge2V2ZW50OiBuYW1lLCBtZXNzYWdlczogW119LCBtZXRhfVxuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxheWVkU2VuZERhdGFbaW5kZXhdLmRhdGEubWVzc2FnZXMucHVzaCh7ZGF0YSwgbWV0YX0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNlbmRNZXNzYWdlUHJvbWlzZSA9IHNlbmRNZXNzYWdlKHtuYW1lLCBsaXN0ZW5lclNlcnZpY2VOYW1lLCBuZXRVcmw6IGxpc3RlbmVyU2VydmljZS5uZXRVcmwsIHRpbWVvdXQ6IGV2ZW50RW1pdENvbmZpZy50aW1lb3V0LCBtZXRob2Q6IGV2ZW50TGlzdGVuQ29uZmlnLm1ldGhvZCwgaGF2ZVJlc3BvbnNlOiBldmVudExpc3RlbkNvbmZpZy5oYXZlUmVzcG9uc2UsIGRhdGEsIG1ldGF9KVxuICAgICAgICAgIGlmIChldmVudExpc3RlbkNvbmZpZy5oYXZlUmVzcG9uc2UgJiYgZXZlbnRFbWl0Q29uZmlnLndhaXRSZXNwb25zZSl3YWl0UmVzcG9uc2VzLnB1c2goc2VuZE1lc3NhZ2VQcm9taXNlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgQ09OU09MRS5kZWJ1ZygnZW1pdCAnICsgbmFtZSArICcgd2FpdFJlc3BvbnNlcycsIHdhaXRSZXNwb25zZXMpXG4gICAgICB2YXIgcmVzdWx0UHJvbWlzZVxuICAgICAgaWYgKGV2ZW50RW1pdENvbmZpZy53YWl0UmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKGV2ZW50RW1pdENvbmZpZy5yZXNwb25zZVJlcXVpcmVkICYmICF3YWl0UmVzcG9uc2VzLmxlbmd0aCkgZXJyb3JUaHJvdyhuYW1lICsgJyBldmVudCBuZWVkIGEgcmVzcG9uc2UnKVxuICAgICAgICBpZiAoZXZlbnRFbWl0Q29uZmlnLnNpbmdsZVJlc3BvbnNlKSByZXN1bHRQcm9taXNlID0gd2FpdFJlc3BvbnNlc1swXVxuICAgICAgICBlbHNlIHJlc3VsdFByb21pc2UgPSBQcm9taXNlLmFsbCh3YWl0UmVzcG9uc2VzKVxuICAgICAgICB2YXIgcmVzdWx0ID0gYXdhaXQgcmVzdWx0UHJvbWlzZVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdlbWl0ICcgKyBuYW1lICsgJyByZXN1bHRzJywgcmVzdWx0KVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNlcmlhbGl6ZWREYXRhQnl0ZSAoKSB7XG4gICAgICAgIHJldHVybiBzZXJpYWxpemVkRGF0YUJ5dGVcbiAgICAgIH0sXG4gICAgICByZXNldFNlcmlhbGl6ZWREYXRhQnl0ZSAoKSB7XG4gICAgICAgIHNlcmlhbGl6ZWREYXRhQnl0ZSA9IDBcbiAgICAgIH0sXG4gICAgICBzZXRTZXJpYWxpemVGdW5jdGlvbiAobmV3RnVuYykge1xuICAgICAgICBzZXJpYWxpemVGdW5jdGlvbiA9IG5ld0Z1bmNcbiAgICAgIH0sXG4gICAgICBzZXREZXNlcmlhbGl6ZUZ1bmN0aW9uIChuZXdGdW5jKSB7XG4gICAgICAgIGRlc2VyaWFsaXplRnVuY3Rpb24gPSBuZXdGdW5jXG4gICAgICB9LFxuICAgICAgZW1pdCxcbiAgICAgIHJwY1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnJvclRocm93KCdnZXROZXRDbGllbnRQYWNrYWdlJywge2Vycm9yLCBnZXRTaGFyZWRDb25maWcsIHNlcnZpY2VOYW1lfSlcbiAgfVxufVxuIl19