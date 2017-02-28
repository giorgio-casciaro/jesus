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

  var serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      getSharedConfig = _ref.getSharedConfig;

  // var getAllServicesConfig = (schema) => require('./jesus').getAllServicesConfigFromDir(sharedServicesPath, schema)
  try {
    var LOG;
    var errorThrow;
    var clientCache;
    var getGrpcClient;
    var sendMessage;

    var _ret = function () {
      var filterByTag = function filterByTag(tags) {
        return function (tagFilter) {
          if (tagFilter) LOG.debug('filterByTag()', tags.indexOf(tagFilter) + 1);
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
                LOG.debug('rpc ' + serviceName + ' ' + method + ' requestId:' + meta.requestId, { data: data, timeout: timeout, meta: meta });
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
        var eventsEmitConfig, eventEmitConfig, eventsListenRegistry, servicesRegistry, waitResponses, eventListeners, filterByTagEventEmit, resultPromise, result;
        return regeneratorRuntime.async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                LOG.debug('emit ' + name + ' requestId:' + meta.requestId, { name: name, data: data, meta: meta });
                _context3.next = 3;
                return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'events.emit'));

              case 3:
                eventsEmitConfig = _context3.sent;

                if (eventsEmitConfig[name]) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt('return', LOG.warn(name + ' event not defined in /events.emit.json'));

              case 6:
                eventEmitConfig = eventsEmitConfig[name];
                _context3.next = 9;
                return regeneratorRuntime.awrap(buildServicesRegistry('events.listen'));

              case 9:
                eventsListenRegistry = _context3.sent;
                _context3.next = 12;
                return regeneratorRuntime.awrap(getSharedConfig('*', 'service', null, true));

              case 12:
                servicesRegistry = _context3.sent;
                // TO FIX ADD CACHE
                // LOG.debug('emit info', {eventEmitConfig, eventsListenRegistry, servicesRegistry})
                waitResponses = [];
                eventListeners = [];

                if (eventsListenRegistry[name]) eventListeners = eventListeners.concat(eventsListenRegistry[name]);
                if (eventsListenRegistry['*']) eventListeners = eventListeners.concat(eventsListenRegistry['*']);
                filterByTagEventEmit = filterByTag(eventEmitConfig.tags);

                eventListeners = eventListeners.filter(function (eventListener) {
                  return filterByTagEventEmit(eventListener.event.filterByTag);
                });

                if (eventListeners.length) {
                  _context3.next = 22;
                  break;
                }

                LOG.debug(name + ' event have no listeners ');
                return _context3.abrupt('return', false);

              case 22:
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
                      delayedSendData[index] = { name: '_messageMulti', listenerServiceName: listenerServiceName, multi: true, timeout: 60000, method: eventListenConfig.method, netUrl: listenerService.netUrl, data: { event: name, messages: [] }, meta: meta };
                    }
                    delayedSendData[index].data.messages.push({ data: data, meta: meta });
                  } else {
                    var sendMessagePromise = sendMessage({ name: name, listenerServiceName: listenerServiceName, netUrl: listenerService.netUrl, timeout: eventEmitConfig.timeout, method: eventListenConfig.method, haveResponse: eventListenConfig.haveResponse, data: data, meta: meta });
                    if (eventListenConfig.haveResponse && eventEmitConfig.waitResponse) waitResponses.push(sendMessagePromise);
                  }
                });
                LOG.debug('emit ' + name + ' waitResponses', waitResponses);

                if (!eventEmitConfig.waitResponse) {
                  _context3.next = 32;
                  break;
                }

                if (eventEmitConfig.responseRequired && !waitResponses.length) errorThrow(name + ' event need a response');
                if (eventEmitConfig.singleResponse) resultPromise = waitResponses[0];else resultPromise = Promise.all(waitResponses);
                _context3.next = 29;
                return regeneratorRuntime.awrap(resultPromise);

              case 29:
                result = _context3.sent;

                LOG.debug('emit ' + name + ' results', result);
                return _context3.abrupt('return', result);

              case 32:
              case 'end':
                return _context3.stop();
            }
          }
        }, null, this);
      };

      LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE);
      errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);


      checkRequired({ serviceName: serviceName, serviceId: serviceId, getSharedConfig: getSharedConfig });

      clientCache = {};

      getGrpcClient = function getGrpcClient(netUrl) {
        return new Promise(function (resolve, reject) {
          var client;
          if (clientCache[netUrl]) client = clientCache[netUrl];else {
            var ClientClass = grpc.makeGenericClientConstructor(grpcService);
            client = clientCache[netUrl] = new ClientClass(netUrl, grpc.credentials.createInsecure());
          }
          LOG.debug('getGrpcClient ', client);
          resolve(client);
        });
      };

      sendMessage = function sendMessage(_ref2) {
        var name = _ref2.name,
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
          LOG.debug('sendMessage ' + name + ' to ' + listenerServiceName, { name: name, data: data, listenerServiceName: listenerServiceName, meta: meta });
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
              LOG.warn('sendMessage timeout ' + name + ' to ' + listenerServiceName, { serviceName: serviceName, timeout: timeout });
              if (haveResponse) reject({ message: 'Response problems: REQUEST TIMEOUT', data: data, listenerServiceName: listenerServiceName });else resolve();
            }, timeout);
          }).catch(function (error) {
            LOG.warn('sendMessage error' + name + ' to ' + listenerServiceName, error);
            reject(error);
          });
        });
      };

      var buildServicesRegistry = function _callee() {
        var schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'events.listen';
        var servicesConfig, listeners;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return regeneratorRuntime.awrap(getSharedConfig('*', schema));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiZ3JwYyIsInpsaWIiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsInNlcmlhbGl6ZWREYXRhQnl0ZSIsInNlcmlhbGl6ZUZ1bmN0aW9uIiwib2JqIiwiZGljdGlvbmFyeSIsImRlZmxhdGVTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlc2VyaWFsaXplRnVuY3Rpb24iLCJwYXJzZSIsImluZmxhdGVTeW5jIiwic2VyaWFsaXplSnNvbiIsInJlc3VsdCIsImJ5dGVMZW5ndGgiLCJkZXNlcmlhbGl6ZUpzb24iLCJidWZmZXIiLCJncnBjU2VydmljZSIsIm1lc3NhZ2UiLCJwYXRoIiwicmVxdWVzdFN0cmVhbSIsInJlc3BvbnNlU3RyZWFtIiwicmVxdWVzdFNlcmlhbGl6ZSIsInJlcXVlc3REZXNlcmlhbGl6ZSIsInJlc3BvbnNlU2VyaWFsaXplIiwicmVzcG9uc2VEZXNlcmlhbGl6ZSIsIm1lc3NhZ2VNdWx0aSIsImRlbGF5ZWRTZW5kRGF0YSIsImdsb2JhbCIsIkpFU1VTX05FVF9DTElFTlRfZGVsYXllZFNlbmREYXRhIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldENsaWVudFBhY2thZ2UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsIkxPRyIsImVycm9yVGhyb3ciLCJjbGllbnRDYWNoZSIsImdldEdycGNDbGllbnQiLCJzZW5kTWVzc2FnZSIsImZpbHRlckJ5VGFnIiwidGFncyIsInRhZ0ZpbHRlciIsImRlYnVnIiwiaW5kZXhPZiIsInJwYyIsIm1ldGhvZCIsImRhdGEiLCJtZXRhIiwidGltZW91dCIsInJlcXVlc3RJZCIsImxpc3RlbmVyU2VydmljZSIsIm5hbWUiLCJsaXN0ZW5lclNlcnZpY2VOYW1lIiwibmV0VXJsIiwiaGF2ZVJlc3BvbnNlIiwic2VuZE1lc3NhZ2VSZXNwb25zZSIsImVtaXQiLCJldmVudHNFbWl0Q29uZmlnIiwid2FybiIsImV2ZW50RW1pdENvbmZpZyIsImJ1aWxkU2VydmljZXNSZWdpc3RyeSIsImV2ZW50c0xpc3RlblJlZ2lzdHJ5Iiwic2VydmljZXNSZWdpc3RyeSIsIndhaXRSZXNwb25zZXMiLCJldmVudExpc3RlbmVycyIsImNvbmNhdCIsImZpbHRlckJ5VGFnRXZlbnRFbWl0IiwiZmlsdGVyIiwiZXZlbnRMaXN0ZW5lciIsImV2ZW50IiwibGVuZ3RoIiwiZm9yRWFjaCIsImV2ZW50TGlzdGVuQ29uZmlnIiwiZGVsYXllZCIsImluZGV4Iiwic2V0VGltZW91dCIsIm11bHRpRXZlbnQiLCJtdWx0aSIsIm1lc3NhZ2VzIiwicHVzaCIsInNlbmRNZXNzYWdlUHJvbWlzZSIsIndhaXRSZXNwb25zZSIsInJlc3BvbnNlUmVxdWlyZWQiLCJzaW5nbGVSZXNwb25zZSIsInJlc3VsdFByb21pc2UiLCJQcm9taXNlIiwiYWxsIiwicmVzb2x2ZSIsInJlamVjdCIsImNsaWVudCIsIkNsaWVudENsYXNzIiwibWFrZUdlbmVyaWNDbGllbnRDb25zdHJ1Y3RvciIsImNyZWRlbnRpYWxzIiwiY3JlYXRlSW5zZWN1cmUiLCJ0aGVuIiwiY2FsbFRpbWVvdXQiLCJ1c2VySWQiLCJtZXNzYWdlRnVuY3Rpb24iLCJjYWxsIiwiZXJyb3IiLCJzZXJ2aWNlUmVzcG9uc2UiLCJjbGVhclRpbWVvdXQiLCJjYW5jZWwiLCJjYXRjaCIsInNjaGVtYSIsInNlcnZpY2VzQ29uZmlnIiwibGlzdGVuZXJzIiwic2VydmljZSIsIk9iamVjdCIsImtleXMiLCJldmVudE5hbWUiLCJnZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJyZXNldFNlcmlhbGl6ZWREYXRhQnl0ZSIsInNldFNlcmlhbGl6ZUZ1bmN0aW9uIiwibmV3RnVuYyIsInNldERlc2VyaWFsaXplRnVuY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUUsT0FBT0Ys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LElBQXJCLENBQTBCLEVBQUNoRCx3QkFBRCxFQUFjc0MsT0FBT3NDLFFBQVFHLFNBQVIsQ0FBckIsRUFBeUNBLG9CQUF6QyxFQUExQjtBQUNELG1CQUhELEVBR0dILE9BSEg7QUFJRCxpQkFORDtBQUg0QixpREFVckJELFNBVnFCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQTlCOztBQStFQTtBQUFBLFdBQU87QUFDTEssK0JBREssbUNBQ29CO0FBQ3ZCLG1CQUFPL0csa0JBQVA7QUFDRCxXQUhJO0FBSUxnSCxpQ0FKSyxxQ0FJc0I7QUFDekJoSCxpQ0FBcUIsQ0FBckI7QUFDRCxXQU5JO0FBT0xpSCw4QkFQSyxnQ0FPaUJDLE9BUGpCLEVBTzBCO0FBQzdCakgsZ0NBQW9CaUgsT0FBcEI7QUFDRCxXQVRJO0FBVUxDLGdDQVZLLGtDQVVtQkQsT0FWbkIsRUFVNEI7QUFDL0IzRyxrQ0FBc0IyRyxPQUF0QjtBQUNELFdBWkk7O0FBYUwxRCxvQkFiSztBQWNMWjtBQWRLO0FBQVA7QUF6SEU7O0FBQUE7QUF5SUgsR0F6SUQsQ0F5SUUsT0FBT3VELEtBQVAsRUFBYztBQUNkaEUsZUFBVyxxQkFBWCxFQUFrQyxFQUFDZ0UsWUFBRCxFQUFRbEUsZ0NBQVIsRUFBeUJGLHdCQUF6QixFQUFsQztBQUNEO0FBQ0YsQ0E5SUQiLCJmaWxlIjoibmV0LmNsaWVudC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBncnBjID0gcmVxdWlyZSgnZ3JwYycpXG52YXIgemxpYiA9IHJlcXVpcmUoJ3psaWInKVxuY29uc3QgUEFDS0FHRSA9ICduZXQuY2xpZW50J1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5cbi8vIE1FU1NBR0UgU0VSSUFMSVpBVElPTlxudmFyIHNlcmlhbGl6ZWREYXRhQnl0ZSA9IDBcbnZhciBzZXJpYWxpemVGdW5jdGlvbiA9IChvYmosIGRpY3Rpb25hcnkpID0+IHpsaWIuZGVmbGF0ZVN5bmMoSlNPTi5zdHJpbmdpZnkob2JqKSwge2RpY3Rpb25hcnl9KVxudmFyIGRlc2VyaWFsaXplRnVuY3Rpb24gPSAob2JqLCBkaWN0aW9uYXJ5KSA9PiBKU09OLnBhcnNlKHpsaWIuaW5mbGF0ZVN5bmMob2JqLCB7ZGljdGlvbmFyeX0pKVxuZnVuY3Rpb24gc2VyaWFsaXplSnNvbiAob2JqKSB7XG4gIHZhciByZXN1bHQgPSBzZXJpYWxpemVGdW5jdGlvbihvYmopXG4gIHNlcmlhbGl6ZWREYXRhQnl0ZSArPSAocmVzdWx0LmJ5dGVMZW5ndGgpXG4gIHJldHVybiByZXN1bHRcbn1cbmZ1bmN0aW9uIGRlc2VyaWFsaXplSnNvbiAoYnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBkZXNlcmlhbGl6ZUZ1bmN0aW9uKGJ1ZmZlcilcbiAgcmV0dXJuIHJlc3VsdFxufVxudmFyIGdycGNTZXJ2aWNlID0ge1xuICBtZXNzYWdlOiB7XG4gICAgcGF0aDogJ21lc3NhZ2UnLFxuICAgIHJlcXVlc3RTdHJlYW06IGZhbHNlLFxuICAgIHJlc3BvbnNlU3RyZWFtOiBmYWxzZSxcbiAgICByZXF1ZXN0U2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlcXVlc3REZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlU2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlRGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvblxuICB9LFxuXG4gIG1lc3NhZ2VNdWx0aToge1xuICAgIHBhdGg6ICdtZXNzYWdlTXVsdGknLFxuICAgIHJlcXVlc3RTdHJlYW06IGZhbHNlLFxuICAgIHJlc3BvbnNlU3RyZWFtOiBmYWxzZSxcbiAgICByZXF1ZXN0U2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlcXVlc3REZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlU2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlRGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvblxuICB9XG59XG5cbnZhciBkZWxheWVkU2VuZERhdGEgPSBnbG9iYWwuSkVTVVNfTkVUX0NMSUVOVF9kZWxheWVkU2VuZERhdGEgPSBnbG9iYWwuSkVTVVNfTkVUX0NMSUVOVF9kZWxheWVkU2VuZERhdGEgfHwge31cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXROZXRDbGllbnRQYWNrYWdlICh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZ2V0U2hhcmVkQ29uZmlnfSkge1xuICAvLyB2YXIgZ2V0QWxsU2VydmljZXNDb25maWcgPSAoc2NoZW1hKSA9PiByZXF1aXJlKCcuL2plc3VzJykuZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyKHNoYXJlZFNlcnZpY2VzUGF0aCwgc2NoZW1hKVxuICB0cnkge1xuICAgIHZhciBMT0cgPSByZXF1aXJlKCcuL2plc3VzJykuTE9HKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gICAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG4gICAgY2hlY2tSZXF1aXJlZCh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZ2V0U2hhcmVkQ29uZmlnfSlcblxuICAgIHZhciBjbGllbnRDYWNoZSA9IHt9XG4gICAgdmFyIGdldEdycGNDbGllbnQgPSAobmV0VXJsKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB2YXIgY2xpZW50XG4gICAgICBpZiAoY2xpZW50Q2FjaGVbbmV0VXJsXSljbGllbnQgPSBjbGllbnRDYWNoZVtuZXRVcmxdXG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIENsaWVudENsYXNzID0gZ3JwYy5tYWtlR2VuZXJpY0NsaWVudENvbnN0cnVjdG9yKGdycGNTZXJ2aWNlKVxuICAgICAgICBjbGllbnQgPSBjbGllbnRDYWNoZVtuZXRVcmxdID0gbmV3IENsaWVudENsYXNzKG5ldFVybCwgZ3JwYy5jcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgICAgfVxuICAgICAgTE9HLmRlYnVnKCdnZXRHcnBjQ2xpZW50ICcsIGNsaWVudClcbiAgICAgIHJlc29sdmUoY2xpZW50KVxuICAgIH0pXG4gICAgdmFyIHNlbmRNZXNzYWdlID0gKHtuYW1lLCBuZXRVcmwsIHRpbWVvdXQgPSA1MDAwLCBtZXRob2QsIG11bHRpID0gZmFsc2UsIGhhdmVSZXNwb25zZSwgZGF0YSwgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbWV0YX0pID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIExPRy5kZWJ1Zygnc2VuZE1lc3NhZ2UgJyArIG5hbWUgKyAnIHRvICcgKyBsaXN0ZW5lclNlcnZpY2VOYW1lLCB7bmFtZSwgZGF0YSwgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbWV0YX0pXG4gICAgICBnZXRHcnBjQ2xpZW50KG5ldFVybCkudGhlbigoY2xpZW50KSA9PiB7XG4gICAgICAgIC8vIGlmIChldmVudExpc3RlbkNvbmZpZy5oYXZlUmVzcG9uc2UpIHtcbiAgICAgICAgdmFyIGNhbGxUaW1lb3V0XG4gICAgICAgIHZhciByZXF1ZXN0SWQgPSBtZXRhLnJlcXVlc3RJZFxuICAgICAgICB2YXIgdXNlcklkID0gbWV0YS51c2VySWRcbiAgICAgICAgdmFyIG1lc3NhZ2VGdW5jdGlvbiA9ICdtZXNzYWdlJ1xuICAgICAgICBpZiAobXVsdGkpIG1lc3NhZ2VGdW5jdGlvbiA9ICdtZXNzYWdlTXVsdGknXG4gICAgICAgIHZhciBjYWxsID0gY2xpZW50W21lc3NhZ2VGdW5jdGlvbl0oeyBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBldmVudDogbmFtZSwgbWV0aG9kLCBkYXRhLCByZXF1ZXN0SWQsIHVzZXJJZH0sIChlcnJvciwgc2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKGNhbGxUaW1lb3V0KWNsZWFyVGltZW91dChjYWxsVGltZW91dClcbiAgICAgICAgICBpZiAoZXJyb3IpcmVqZWN0KGVycm9yKVxuICAgICAgICAgIHJlc29sdmUoc2VydmljZVJlc3BvbnNlKVxuICAgICAgICB9KVxuICAgICAgICBjYWxsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGNhbGwuY2FuY2VsKClcbiAgICAgICAgICBMT0cud2Fybignc2VuZE1lc3NhZ2UgdGltZW91dCAnICsgbmFtZSArICcgdG8gJyArIGxpc3RlbmVyU2VydmljZU5hbWUsIHtzZXJ2aWNlTmFtZSwgdGltZW91dCB9KVxuICAgICAgICAgIGlmIChoYXZlUmVzcG9uc2UpcmVqZWN0KHttZXNzYWdlOiAnUmVzcG9uc2UgcHJvYmxlbXM6IFJFUVVFU1QgVElNRU9VVCcsIGRhdGEsIGxpc3RlbmVyU2VydmljZU5hbWV9KVxuICAgICAgICAgIGVsc2UgcmVzb2x2ZSgpXG4gICAgICAgIH0sIHRpbWVvdXQpXG4gICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIExPRy53YXJuKCdzZW5kTWVzc2FnZSBlcnJvcicgKyBuYW1lICsgJyB0byAnICsgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgZXJyb3IpXG4gICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIH0pXG4gICAgfSlcbiAgICBjb25zdCBidWlsZFNlcnZpY2VzUmVnaXN0cnkgPSBhc3luYyAoc2NoZW1hID0gJ2V2ZW50cy5saXN0ZW4nKSA9PiB7XG4gICAgICB2YXIgc2VydmljZXNDb25maWcgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcoJyonLCBzY2hlbWEpXG4gICAgICB2YXIgbGlzdGVuZXJzID0ge31cbiAgICAgIHNlcnZpY2VzQ29uZmlnLmZvckVhY2goc2VydmljZSA9PiB7XG4gICAgICAgIHZhciBzZXJ2aWNlTmFtZSA9IHNlcnZpY2Uuc2VydmljZU5hbWVcbiAgICAgICAgT2JqZWN0LmtleXMoc2VydmljZSkuZm9yRWFjaChldmVudE5hbWUgPT4ge1xuICAgICAgICAgIGlmICghbGlzdGVuZXJzW2V2ZW50TmFtZV0pbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXVxuICAgICAgICAgIGxpc3RlbmVyc1tldmVudE5hbWVdLnB1c2goe3NlcnZpY2VOYW1lLCBldmVudDogc2VydmljZVtldmVudE5hbWVdLCBldmVudE5hbWV9KVxuICAgICAgICB9LCBzZXJ2aWNlKVxuICAgICAgfSlcbiAgICAgIHJldHVybiBsaXN0ZW5lcnNcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJCeVRhZyAodGFncykge1xuICAgICAgcmV0dXJuICh0YWdGaWx0ZXIpID0+IHtcbiAgICAgICAgaWYgKHRhZ0ZpbHRlcilMT0cuZGVidWcoYGZpbHRlckJ5VGFnKClgLCB0YWdzLmluZGV4T2YodGFnRmlsdGVyKSArIDEpXG4gICAgICAgIHJldHVybiAhdGFncyB8fCAhdGFnRmlsdGVyID8gdHJ1ZSA6IHRhZ3MuaW5kZXhPZih0YWdGaWx0ZXIpICsgMVxuICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBycGMgKHNlcnZpY2VOYW1lLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXQgPSA1MDAwKSB7XG4gICAgICBMT0cuZGVidWcoJ3JwYyAnICsgc2VydmljZU5hbWUgKyAnICcgKyBtZXRob2QgKyAnIHJlcXVlc3RJZDonICsgbWV0YS5yZXF1ZXN0SWQsIHtkYXRhLCB0aW1lb3V0LCBtZXRhfSlcbiAgICAgIHZhciBsaXN0ZW5lclNlcnZpY2UgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdzZXJ2aWNlJykgLy8gVE8gRklYIEFERCBDQUNIRVxuICAgICAgdmFyIHNlbmRNZXNzYWdlUmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZSh7bmFtZTogJ19ycGNDYWxsJywgbGlzdGVuZXJTZXJ2aWNlTmFtZTogc2VydmljZU5hbWUsIG5ldFVybDogbGlzdGVuZXJTZXJ2aWNlLm5ldFVybCwgdGltZW91dCwgbWV0aG9kLCBoYXZlUmVzcG9uc2U6IHRydWUsIGRhdGEsIG1ldGF9KVxuICAgICAgcmV0dXJuIHNlbmRNZXNzYWdlUmVzcG9uc2VcbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gZW1pdCAobmFtZSwgZGF0YSwgbWV0YSkge1xuICAgICAgTE9HLmRlYnVnKCdlbWl0ICcgKyBuYW1lICsgJyByZXF1ZXN0SWQ6JyArIG1ldGEucmVxdWVzdElkLCB7bmFtZSwgZGF0YSwgbWV0YX0pXG4gICAgICB2YXIgZXZlbnRzRW1pdENvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ2V2ZW50cy5lbWl0JylcbiAgICAgIGlmICghZXZlbnRzRW1pdENvbmZpZ1tuYW1lXSkgcmV0dXJuIExPRy53YXJuKG5hbWUgKyAnIGV2ZW50IG5vdCBkZWZpbmVkIGluIC9ldmVudHMuZW1pdC5qc29uJylcbiAgICAgIHZhciBldmVudEVtaXRDb25maWcgPSBldmVudHNFbWl0Q29uZmlnW25hbWVdXG5cbiAgICAgIHZhciBldmVudHNMaXN0ZW5SZWdpc3RyeSA9IGF3YWl0IGJ1aWxkU2VydmljZXNSZWdpc3RyeSgnZXZlbnRzLmxpc3RlbicpIC8vIFRPIEZJWCBBREQgQ0FDSEVcblxuICAgICAgdmFyIHNlcnZpY2VzUmVnaXN0cnkgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcoJyonLCAnc2VydmljZScsIG51bGwsIHRydWUpIC8vIFRPIEZJWCBBREQgQ0FDSEVcbiAgICAgIC8vIExPRy5kZWJ1ZygnZW1pdCBpbmZvJywge2V2ZW50RW1pdENvbmZpZywgZXZlbnRzTGlzdGVuUmVnaXN0cnksIHNlcnZpY2VzUmVnaXN0cnl9KVxuICAgICAgdmFyIHdhaXRSZXNwb25zZXMgPSBbXVxuICAgICAgdmFyIGV2ZW50TGlzdGVuZXJzID0gW11cbiAgICAgIGlmIChldmVudHNMaXN0ZW5SZWdpc3RyeVtuYW1lXSlldmVudExpc3RlbmVycyA9IGV2ZW50TGlzdGVuZXJzLmNvbmNhdChldmVudHNMaXN0ZW5SZWdpc3RyeVtuYW1lXSlcbiAgICAgIGlmIChldmVudHNMaXN0ZW5SZWdpc3RyeVsnKiddKWV2ZW50TGlzdGVuZXJzID0gZXZlbnRMaXN0ZW5lcnMuY29uY2F0KGV2ZW50c0xpc3RlblJlZ2lzdHJ5WycqJ10pXG4gICAgICB2YXIgZmlsdGVyQnlUYWdFdmVudEVtaXQgPSBmaWx0ZXJCeVRhZyhldmVudEVtaXRDb25maWcudGFncylcbiAgICAgIGV2ZW50TGlzdGVuZXJzID0gZXZlbnRMaXN0ZW5lcnMuZmlsdGVyKGV2ZW50TGlzdGVuZXIgPT4gZmlsdGVyQnlUYWdFdmVudEVtaXQoZXZlbnRMaXN0ZW5lci5ldmVudC5maWx0ZXJCeVRhZykpXG4gICAgICBpZiAoIWV2ZW50TGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgICBMT0cuZGVidWcobmFtZSArICcgZXZlbnQgaGF2ZSBubyBsaXN0ZW5lcnMgJylcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKSA9PiB7XG4gICAgICAgIHZhciBsaXN0ZW5lclNlcnZpY2VOYW1lID0gZXZlbnRMaXN0ZW5lci5zZXJ2aWNlTmFtZVxuICAgICAgICB2YXIgbGlzdGVuZXJTZXJ2aWNlID0gc2VydmljZXNSZWdpc3RyeVtsaXN0ZW5lclNlcnZpY2VOYW1lXVxuICAgICAgICB2YXIgZXZlbnRMaXN0ZW5Db25maWcgPSBldmVudExpc3RlbmVyLmV2ZW50XG5cbiAgICAgICAgLy8gdmFyIHNlbmRNZXNzYWdlUHJvbWlzZSA9IHNlbmRNZXNzYWdlKHtuYW1lLCBsaXN0ZW5lclNlcnZpY2UsIGxpc3RlbmVyU2VydmljZU5hbWUsIGV2ZW50TGlzdGVuQ29uZmlnLCBldmVudEVtaXRDb25maWcsIGRhdGEsIGxpc3RlbmVyU2VydmljZU5hbWUsIG1ldGF9KVxuICAgICAgICBpZiAoZXZlbnRMaXN0ZW5Db25maWcuZGVsYXllZCkge1xuICAgICAgICAgIHZhciBpbmRleCA9IG5hbWUgKyBsaXN0ZW5lclNlcnZpY2VOYW1lICsgZXZlbnRMaXN0ZW5Db25maWcubWV0aG9kXG4gICAgICAgICAgaWYgKCFkZWxheWVkU2VuZERhdGFbaW5kZXhdKSB7XG4gICAgICAgICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB2YXIgbXVsdGlFdmVudCA9IGRlbGF5ZWRTZW5kRGF0YVtpbmRleF1cbiAgICAgICAgICAgICAgZGVsZXRlIGRlbGF5ZWRTZW5kRGF0YVtpbmRleF1cbiAgICAgICAgICAgICAgc2VuZE1lc3NhZ2UobXVsdGlFdmVudClcbiAgICAgICAgICAgIH0sIGV2ZW50TGlzdGVuQ29uZmlnLmRlbGF5ZWQpXG4gICAgICAgICAgICBkZWxheWVkU2VuZERhdGFbaW5kZXhdID0ge25hbWU6ICdfbWVzc2FnZU11bHRpJywgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbXVsdGk6IHRydWUsIHRpbWVvdXQ6NjAwMDAsIG1ldGhvZDogZXZlbnRMaXN0ZW5Db25maWcubWV0aG9kLCBuZXRVcmw6IGxpc3RlbmVyU2VydmljZS5uZXRVcmwsIGRhdGE6IHtldmVudDogbmFtZSwgbWVzc2FnZXM6IFtdfSwgbWV0YX1cbiAgICAgICAgICB9XG4gICAgICAgICAgZGVsYXllZFNlbmREYXRhW2luZGV4XS5kYXRhLm1lc3NhZ2VzLnB1c2goe2RhdGEsIG1ldGF9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzZW5kTWVzc2FnZVByb21pc2UgPSBzZW5kTWVzc2FnZSh7bmFtZSwgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbmV0VXJsOiBsaXN0ZW5lclNlcnZpY2UubmV0VXJsLCB0aW1lb3V0OiBldmVudEVtaXRDb25maWcudGltZW91dCwgbWV0aG9kOiBldmVudExpc3RlbkNvbmZpZy5tZXRob2QsIGhhdmVSZXNwb25zZTogZXZlbnRMaXN0ZW5Db25maWcuaGF2ZVJlc3BvbnNlLCBkYXRhLCBtZXRhfSlcbiAgICAgICAgICBpZiAoZXZlbnRMaXN0ZW5Db25maWcuaGF2ZVJlc3BvbnNlICYmIGV2ZW50RW1pdENvbmZpZy53YWl0UmVzcG9uc2Upd2FpdFJlc3BvbnNlcy5wdXNoKHNlbmRNZXNzYWdlUHJvbWlzZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIExPRy5kZWJ1ZygnZW1pdCAnICsgbmFtZSArICcgd2FpdFJlc3BvbnNlcycsIHdhaXRSZXNwb25zZXMpXG4gICAgICB2YXIgcmVzdWx0UHJvbWlzZVxuICAgICAgaWYgKGV2ZW50RW1pdENvbmZpZy53YWl0UmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKGV2ZW50RW1pdENvbmZpZy5yZXNwb25zZVJlcXVpcmVkICYmICF3YWl0UmVzcG9uc2VzLmxlbmd0aCkgZXJyb3JUaHJvdyhuYW1lICsgJyBldmVudCBuZWVkIGEgcmVzcG9uc2UnKVxuICAgICAgICBpZiAoZXZlbnRFbWl0Q29uZmlnLnNpbmdsZVJlc3BvbnNlKSByZXN1bHRQcm9taXNlID0gd2FpdFJlc3BvbnNlc1swXVxuICAgICAgICBlbHNlIHJlc3VsdFByb21pc2UgPSBQcm9taXNlLmFsbCh3YWl0UmVzcG9uc2VzKVxuICAgICAgICB2YXIgcmVzdWx0ID0gYXdhaXQgcmVzdWx0UHJvbWlzZVxuICAgICAgICBMT0cuZGVidWcoJ2VtaXQgJyArIG5hbWUgKyAnIHJlc3VsdHMnLCByZXN1bHQpXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0U2VyaWFsaXplZERhdGFCeXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZWREYXRhQnl0ZVxuICAgICAgfSxcbiAgICAgIHJlc2V0U2VyaWFsaXplZERhdGFCeXRlICgpIHtcbiAgICAgICAgc2VyaWFsaXplZERhdGFCeXRlID0gMFxuICAgICAgfSxcbiAgICAgIHNldFNlcmlhbGl6ZUZ1bmN0aW9uIChuZXdGdW5jKSB7XG4gICAgICAgIHNlcmlhbGl6ZUZ1bmN0aW9uID0gbmV3RnVuY1xuICAgICAgfSxcbiAgICAgIHNldERlc2VyaWFsaXplRnVuY3Rpb24gKG5ld0Z1bmMpIHtcbiAgICAgICAgZGVzZXJpYWxpemVGdW5jdGlvbiA9IG5ld0Z1bmNcbiAgICAgIH0sXG4gICAgICBlbWl0LFxuICAgICAgcnBjXG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVycm9yVGhyb3coJ2dldE5ldENsaWVudFBhY2thZ2UnLCB7ZXJyb3IsIGdldFNoYXJlZENvbmZpZywgc2VydmljZU5hbWV9KVxuICB9XG59XG4iXX0=