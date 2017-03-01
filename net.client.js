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
        var eventsEmitConfig, eventEmitConfig, eventsListenRegistry, servicesRegistry, waitResponses, eventListeners, filterByTagEventEmit, resultPromise, result;
        return regeneratorRuntime.async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                CONSOLE.debug('emit ' + name + ' requestId:' + meta.requestId, { name: name, data: data, meta: meta });
                _context3.next = 3;
                return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'events.emit'));

              case 3:
                eventsEmitConfig = _context3.sent;

                if (eventsEmitConfig[name]) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt('return', CONSOLE.warn(name + ' event not defined in /events.emit.json'));

              case 6:
                eventEmitConfig = eventsEmitConfig[name];
                _context3.next = 9;
                return regeneratorRuntime.awrap(buildServicesRegistry('events.listen', serviceName));

              case 9:
                eventsListenRegistry = _context3.sent;
                _context3.next = 12;
                return regeneratorRuntime.awrap(getSharedConfig('*', 'service', serviceName, true));

              case 12:
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
                  _context3.next = 22;
                  break;
                }

                CONSOLE.debug(name + ' event have no listeners ');
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
                CONSOLE.debug('emit ' + name + ' waitResponses', waitResponses);

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

                CONSOLE.debug('emit ' + name + ' results', result);
                return _context3.abrupt('return', result);

              case 32:
              case 'end':
                return _context3.stop();
            }
          }
        }, null, this);
      };

      checkRequired({ serviceName: serviceName, serviceId: serviceId, getSharedConfig: getSharedConfig });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiZ3JwYyIsInpsaWIiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsInNlcmlhbGl6ZWREYXRhQnl0ZSIsInNlcmlhbGl6ZUZ1bmN0aW9uIiwib2JqIiwiZGljdGlvbmFyeSIsImRlZmxhdGVTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlc2VyaWFsaXplRnVuY3Rpb24iLCJwYXJzZSIsImluZmxhdGVTeW5jIiwic2VyaWFsaXplSnNvbiIsInJlc3VsdCIsImJ5dGVMZW5ndGgiLCJkZXNlcmlhbGl6ZUpzb24iLCJidWZmZXIiLCJncnBjU2VydmljZSIsIm1lc3NhZ2UiLCJwYXRoIiwicmVxdWVzdFN0cmVhbSIsInJlc3BvbnNlU3RyZWFtIiwicmVxdWVzdFNlcmlhbGl6ZSIsInJlcXVlc3REZXNlcmlhbGl6ZSIsInJlc3BvbnNlU2VyaWFsaXplIiwicmVzcG9uc2VEZXNlcmlhbGl6ZSIsIm1lc3NhZ2VNdWx0aSIsImRlbGF5ZWRTZW5kRGF0YSIsImdsb2JhbCIsIkpFU1VTX05FVF9DTElFTlRfZGVsYXllZFNlbmREYXRhIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldENsaWVudFBhY2thZ2UiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJnZXRTaGFyZWRDb25maWciLCJDT05TT0xFIiwiZXJyb3JUaHJvdyIsImNsaWVudENhY2hlIiwiZ2V0R3JwY0NsaWVudCIsInNlbmRNZXNzYWdlIiwiZmlsdGVyQnlUYWciLCJ0YWdzIiwidGFnRmlsdGVyIiwiZGVidWciLCJpbmRleE9mIiwicnBjIiwibWV0aG9kIiwiZGF0YSIsIm1ldGEiLCJ0aW1lb3V0IiwicmVxdWVzdElkIiwibGlzdGVuZXJTZXJ2aWNlIiwibmFtZSIsImxpc3RlbmVyU2VydmljZU5hbWUiLCJuZXRVcmwiLCJoYXZlUmVzcG9uc2UiLCJzZW5kTWVzc2FnZVJlc3BvbnNlIiwiZW1pdCIsImV2ZW50c0VtaXRDb25maWciLCJ3YXJuIiwiZXZlbnRFbWl0Q29uZmlnIiwiYnVpbGRTZXJ2aWNlc1JlZ2lzdHJ5IiwiZXZlbnRzTGlzdGVuUmVnaXN0cnkiLCJzZXJ2aWNlc1JlZ2lzdHJ5Iiwid2FpdFJlc3BvbnNlcyIsImV2ZW50TGlzdGVuZXJzIiwiY29uY2F0IiwiZmlsdGVyQnlUYWdFdmVudEVtaXQiLCJmaWx0ZXIiLCJldmVudExpc3RlbmVyIiwiZXZlbnQiLCJsZW5ndGgiLCJmb3JFYWNoIiwiZXZlbnRMaXN0ZW5Db25maWciLCJkZWxheWVkIiwiaW5kZXgiLCJzZXRUaW1lb3V0IiwibXVsdGlFdmVudCIsIm11bHRpIiwibWVzc2FnZXMiLCJwdXNoIiwic2VuZE1lc3NhZ2VQcm9taXNlIiwid2FpdFJlc3BvbnNlIiwicmVzcG9uc2VSZXF1aXJlZCIsInNpbmdsZVJlc3BvbnNlIiwicmVzdWx0UHJvbWlzZSIsIlByb21pc2UiLCJhbGwiLCJyZXNvbHZlIiwicmVqZWN0IiwiY2xpZW50IiwiQ2xpZW50Q2xhc3MiLCJtYWtlR2VuZXJpY0NsaWVudENvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJjcmVhdGVJbnNlY3VyZSIsInRoZW4iLCJjYWxsVGltZW91dCIsInVzZXJJZCIsIm1lc3NhZ2VGdW5jdGlvbiIsImNhbGwiLCJlcnJvciIsInNlcnZpY2VSZXNwb25zZSIsImNsZWFyVGltZW91dCIsImNhbmNlbCIsImNhdGNoIiwic2NoZW1hIiwiZXhjbHVkZSIsInNlcnZpY2VzQ29uZmlnIiwibGlzdGVuZXJzIiwic2VydmljZSIsIk9iamVjdCIsImtleXMiLCJldmVudE5hbWUiLCJnZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJyZXNldFNlcmlhbGl6ZWREYXRhQnl0ZSIsInNldFNlcmlhbGl6ZUZ1bmN0aW9uIiwibmV3RnVuYyIsInNldERlc2VyaWFsaXplRnVuY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLE9BQU9ELFFBQVEs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QVYsSUFBdUIsRUFBdkI7QUFDMUJKLDhCQUFVSSxTQUFWLEVBQXFCaEMsSUFBckIsQ0FBMEIsRUFBQ2hELHdCQUFELEVBQWNzQyxPQUFPdUMsUUFBUUcsU0FBUixDQUFyQixFQUF5Q0Esb0JBQXpDLEVBQTFCO0FBQ0QsbUJBSEQsRUFHR0gsT0FISDtBQUlELGlCQU5EO0FBSDRCLGlEQVVyQkQsU0FWcUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBOUI7O0FBK0VBO0FBQUEsV0FBTztBQUNMSywrQkFESyxtQ0FDb0I7QUFDdkIsbUJBQU9qSCxrQkFBUDtBQUNELFdBSEk7QUFJTGtILGlDQUpLLHFDQUlzQjtBQUN6QmxILGlDQUFxQixDQUFyQjtBQUNELFdBTkk7QUFPTG1ILDhCQVBLLGdDQU9pQkMsT0FQakIsRUFPMEI7QUFDN0JuSCxnQ0FBb0JtSCxPQUFwQjtBQUNELFdBVEk7QUFVTEMsZ0NBVkssa0NBVW1CRCxPQVZuQixFQVU0QjtBQUMvQjdHLGtDQUFzQjZHLE9BQXRCO0FBQ0QsV0FaSTs7QUFhTDNELG9CQWJLO0FBY0xaO0FBZEs7QUFBUDtBQXZIRTs7QUFBQTtBQXVJSCxHQXZJRCxDQXVJRSxPQUFPdUQsS0FBUCxFQUFjO0FBQ2RoRSxlQUFXLHFCQUFYLEVBQWtDLEVBQUNnRSxZQUFELEVBQVFsRSxnQ0FBUixFQUF5QkYsd0JBQXpCLEVBQWxDO0FBQ0Q7QUFDRixDQTdJRCIsImZpbGUiOiJuZXQuY2xpZW50LmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIGdycGMgPSByZXF1aXJlKCdncnBjJylcbnZhciB6bGliID0gcmVxdWlyZSgnemxpYicpXG5jb25zdCBQQUNLQUdFID0gJ25ldC5jbGllbnQnXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcblxuLy8gTUVTU0FHRSBTRVJJQUxJWkFUSU9OXG52YXIgc2VyaWFsaXplZERhdGFCeXRlID0gMFxudmFyIHNlcmlhbGl6ZUZ1bmN0aW9uID0gKG9iaiwgZGljdGlvbmFyeSkgPT4gemxpYi5kZWZsYXRlU3luYyhKU09OLnN0cmluZ2lmeShvYmopLCB7ZGljdGlvbmFyeX0pXG52YXIgZGVzZXJpYWxpemVGdW5jdGlvbiA9IChvYmosIGRpY3Rpb25hcnkpID0+IEpTT04ucGFyc2UoemxpYi5pbmZsYXRlU3luYyhvYmosIHtkaWN0aW9uYXJ5fSkpXG5mdW5jdGlvbiBzZXJpYWxpemVKc29uIChvYmopIHtcbiAgdmFyIHJlc3VsdCA9IHNlcmlhbGl6ZUZ1bmN0aW9uKG9iailcbiAgc2VyaWFsaXplZERhdGFCeXRlICs9IChyZXN1bHQuYnl0ZUxlbmd0aClcbiAgcmV0dXJuIHJlc3VsdFxufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVKc29uIChidWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IGRlc2VyaWFsaXplRnVuY3Rpb24oYnVmZmVyKVxuICByZXR1cm4gcmVzdWx0XG59XG52YXIgZ3JwY1NlcnZpY2UgPSB7XG4gIG1lc3NhZ2U6IHtcbiAgICBwYXRoOiAnbWVzc2FnZScsXG4gICAgcmVxdWVzdFN0cmVhbTogZmFsc2UsXG4gICAgcmVzcG9uc2VTdHJlYW06IGZhbHNlLFxuICAgIHJlcXVlc3RTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVxdWVzdERlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VEZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uXG4gIH0sXG5cbiAgbWVzc2FnZU11bHRpOiB7XG4gICAgcGF0aDogJ21lc3NhZ2VNdWx0aScsXG4gICAgcmVxdWVzdFN0cmVhbTogZmFsc2UsXG4gICAgcmVzcG9uc2VTdHJlYW06IGZhbHNlLFxuICAgIHJlcXVlc3RTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVxdWVzdERlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VEZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uXG4gIH1cbn1cblxudmFyIGRlbGF5ZWRTZW5kRGF0YSA9IGdsb2JhbC5KRVNVU19ORVRfQ0xJRU5UX2RlbGF5ZWRTZW5kRGF0YSA9IGdsb2JhbC5KRVNVU19ORVRfQ0xJRU5UX2RlbGF5ZWRTZW5kRGF0YSB8fCB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE5ldENsaWVudFBhY2thZ2UgKHtnZXRDb25zb2xlLHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGdldFNoYXJlZENvbmZpZ30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHZhciBlcnJvclRocm93ID0gcmVxdWlyZSgnLi9qZXN1cycpLmVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcblxuICAgIGNoZWNrUmVxdWlyZWQoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGdldFNoYXJlZENvbmZpZ30pXG5cbiAgICB2YXIgY2xpZW50Q2FjaGUgPSB7fVxuICAgIHZhciBnZXRHcnBjQ2xpZW50ID0gKG5ldFVybCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIGNsaWVudFxuICAgICAgaWYgKGNsaWVudENhY2hlW25ldFVybF0pY2xpZW50ID0gY2xpZW50Q2FjaGVbbmV0VXJsXVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBDbGllbnRDbGFzcyA9IGdycGMubWFrZUdlbmVyaWNDbGllbnRDb25zdHJ1Y3RvcihncnBjU2VydmljZSlcbiAgICAgICAgY2xpZW50ID0gY2xpZW50Q2FjaGVbbmV0VXJsXSA9IG5ldyBDbGllbnRDbGFzcyhuZXRVcmwsIGdycGMuY3JlZGVudGlhbHMuY3JlYXRlSW5zZWN1cmUoKSlcbiAgICAgIH1cbiAgICAgIENPTlNPTEUuZGVidWcoJ2dldEdycGNDbGllbnQgJywgY2xpZW50KVxuICAgICAgcmVzb2x2ZShjbGllbnQpXG4gICAgfSlcbiAgICB2YXIgc2VuZE1lc3NhZ2UgPSAoe25hbWUsIG5ldFVybCwgdGltZW91dCA9IDUwMDAsIG1ldGhvZCwgbXVsdGkgPSBmYWxzZSwgaGF2ZVJlc3BvbnNlLCBkYXRhLCBsaXN0ZW5lclNlcnZpY2VOYW1lLCBtZXRhfSkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZE1lc3NhZ2UgJyArIG5hbWUgKyAnIHRvICcgKyBsaXN0ZW5lclNlcnZpY2VOYW1lLCB7bmFtZSwgZGF0YSwgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbWV0YX0pXG4gICAgICBnZXRHcnBjQ2xpZW50KG5ldFVybCkudGhlbigoY2xpZW50KSA9PiB7XG4gICAgICAgIC8vIGlmIChldmVudExpc3RlbkNvbmZpZy5oYXZlUmVzcG9uc2UpIHtcbiAgICAgICAgdmFyIGNhbGxUaW1lb3V0XG4gICAgICAgIHZhciByZXF1ZXN0SWQgPSBtZXRhLnJlcXVlc3RJZFxuICAgICAgICB2YXIgdXNlcklkID0gbWV0YS51c2VySWRcbiAgICAgICAgdmFyIG1lc3NhZ2VGdW5jdGlvbiA9ICdtZXNzYWdlJ1xuICAgICAgICBpZiAobXVsdGkpIG1lc3NhZ2VGdW5jdGlvbiA9ICdtZXNzYWdlTXVsdGknXG4gICAgICAgIHZhciBjYWxsID0gY2xpZW50W21lc3NhZ2VGdW5jdGlvbl0oeyBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBldmVudDogbmFtZSwgbWV0aG9kLCBkYXRhLCByZXF1ZXN0SWQsIHVzZXJJZH0sIChlcnJvciwgc2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKGNhbGxUaW1lb3V0KWNsZWFyVGltZW91dChjYWxsVGltZW91dClcbiAgICAgICAgICBpZiAoZXJyb3IpcmVqZWN0KGVycm9yKVxuICAgICAgICAgIHJlc29sdmUoc2VydmljZVJlc3BvbnNlKVxuICAgICAgICB9KVxuICAgICAgICBjYWxsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGNhbGwuY2FuY2VsKClcbiAgICAgICAgICBDT05TT0xFLndhcm4oJ3NlbmRNZXNzYWdlIHRpbWVvdXQgJyArIG5hbWUgKyAnIHRvICcgKyBsaXN0ZW5lclNlcnZpY2VOYW1lLCB7c2VydmljZU5hbWUsIHRpbWVvdXQgfSlcbiAgICAgICAgICBpZiAoaGF2ZVJlc3BvbnNlKXJlamVjdCh7bWVzc2FnZTogJ1Jlc3BvbnNlIHByb2JsZW1zOiBSRVFVRVNUIFRJTUVPVVQnLCBkYXRhLCBsaXN0ZW5lclNlcnZpY2VOYW1lfSlcbiAgICAgICAgICBlbHNlIHJlc29sdmUoKVxuICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBDT05TT0xFLndhcm4oJ3NlbmRNZXNzYWdlIGVycm9yJyArIG5hbWUgKyAnIHRvICcgKyBsaXN0ZW5lclNlcnZpY2VOYW1lLCBlcnJvcilcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfSlcbiAgICB9KVxuICAgIGNvbnN0IGJ1aWxkU2VydmljZXNSZWdpc3RyeSA9IGFzeW5jIChzY2hlbWEgPSAnZXZlbnRzLmxpc3RlbicsIGV4Y2x1ZGUpID0+IHtcbiAgICAgIHZhciBzZXJ2aWNlc0NvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZygnKicsIHNjaGVtYSwgZXhjbHVkZSlcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSB7fVxuICAgICAgc2VydmljZXNDb25maWcuZm9yRWFjaChzZXJ2aWNlID0+IHtcbiAgICAgICAgdmFyIHNlcnZpY2VOYW1lID0gc2VydmljZS5zZXJ2aWNlTmFtZVxuICAgICAgICBPYmplY3Qua2V5cyhzZXJ2aWNlKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgICAgaWYgKCFsaXN0ZW5lcnNbZXZlbnROYW1lXSlsaXN0ZW5lcnNbZXZlbnROYW1lXSA9IFtdXG4gICAgICAgICAgbGlzdGVuZXJzW2V2ZW50TmFtZV0ucHVzaCh7c2VydmljZU5hbWUsIGV2ZW50OiBzZXJ2aWNlW2V2ZW50TmFtZV0sIGV2ZW50TmFtZX0pXG4gICAgICAgIH0sIHNlcnZpY2UpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIGxpc3RlbmVyc1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckJ5VGFnICh0YWdzKSB7XG4gICAgICByZXR1cm4gKHRhZ0ZpbHRlcikgPT4ge1xuICAgICAgICBpZiAodGFnRmlsdGVyKUNPTlNPTEUuZGVidWcoYGZpbHRlckJ5VGFnKClgLCB0YWdzLmluZGV4T2YodGFnRmlsdGVyKSArIDEpXG4gICAgICAgIHJldHVybiAhdGFncyB8fCAhdGFnRmlsdGVyID8gdHJ1ZSA6IHRhZ3MuaW5kZXhPZih0YWdGaWx0ZXIpICsgMVxuICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBycGMgKHNlcnZpY2VOYW1lLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXQgPSA1MDAwKSB7XG4gICAgICBDT05TT0xFLmRlYnVnKCdycGMgJyArIHNlcnZpY2VOYW1lICsgJyAnICsgbWV0aG9kICsgJyByZXF1ZXN0SWQ6JyArIG1ldGEucmVxdWVzdElkLCB7ZGF0YSwgdGltZW91dCwgbWV0YX0pXG4gICAgICB2YXIgbGlzdGVuZXJTZXJ2aWNlID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnc2VydmljZScpIC8vIFRPIEZJWCBBREQgQ0FDSEVcbiAgICAgIHZhciBzZW5kTWVzc2FnZVJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2Uoe25hbWU6ICdfcnBjQ2FsbCcsIGxpc3RlbmVyU2VydmljZU5hbWU6IHNlcnZpY2VOYW1lLCBuZXRVcmw6IGxpc3RlbmVyU2VydmljZS5uZXRVcmwsIHRpbWVvdXQsIG1ldGhvZCwgaGF2ZVJlc3BvbnNlOiB0cnVlLCBkYXRhLCBtZXRhfSlcbiAgICAgIHJldHVybiBzZW5kTWVzc2FnZVJlc3BvbnNlXG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGVtaXQgKG5hbWUsIGRhdGEsIG1ldGEpIHtcbiAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgJyArIG5hbWUgKyAnIHJlcXVlc3RJZDonICsgbWV0YS5yZXF1ZXN0SWQsIHtuYW1lLCBkYXRhLCBtZXRhfSlcbiAgICAgIHZhciBldmVudHNFbWl0Q29uZmlnID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnZXZlbnRzLmVtaXQnKVxuICAgICAgaWYgKCFldmVudHNFbWl0Q29uZmlnW25hbWVdKSByZXR1cm4gQ09OU09MRS53YXJuKG5hbWUgKyAnIGV2ZW50IG5vdCBkZWZpbmVkIGluIC9ldmVudHMuZW1pdC5qc29uJylcbiAgICAgIHZhciBldmVudEVtaXRDb25maWcgPSBldmVudHNFbWl0Q29uZmlnW25hbWVdXG5cbiAgICAgIHZhciBldmVudHNMaXN0ZW5SZWdpc3RyeSA9IGF3YWl0IGJ1aWxkU2VydmljZXNSZWdpc3RyeSgnZXZlbnRzLmxpc3RlbicsIHNlcnZpY2VOYW1lKVxuXG4gICAgICB2YXIgc2VydmljZXNSZWdpc3RyeSA9IGF3YWl0IGdldFNoYXJlZENvbmZpZygnKicsICdzZXJ2aWNlJywgc2VydmljZU5hbWUsIHRydWUpXG4gICAgICAvLyBDT05TT0xFLmRlYnVnKCdlbWl0IGluZm8nLCB7ZXZlbnRFbWl0Q29uZmlnLCBldmVudHNMaXN0ZW5SZWdpc3RyeSwgc2VydmljZXNSZWdpc3RyeX0pXG4gICAgICB2YXIgd2FpdFJlc3BvbnNlcyA9IFtdXG4gICAgICB2YXIgZXZlbnRMaXN0ZW5lcnMgPSBbXVxuICAgICAgaWYgKGV2ZW50c0xpc3RlblJlZ2lzdHJ5W25hbWVdKWV2ZW50TGlzdGVuZXJzID0gZXZlbnRMaXN0ZW5lcnMuY29uY2F0KGV2ZW50c0xpc3RlblJlZ2lzdHJ5W25hbWVdKVxuICAgICAgaWYgKGV2ZW50c0xpc3RlblJlZ2lzdHJ5WycqJ10pZXZlbnRMaXN0ZW5lcnMgPSBldmVudExpc3RlbmVycy5jb25jYXQoZXZlbnRzTGlzdGVuUmVnaXN0cnlbJyonXSlcbiAgICAgIHZhciBmaWx0ZXJCeVRhZ0V2ZW50RW1pdCA9IGZpbHRlckJ5VGFnKGV2ZW50RW1pdENvbmZpZy50YWdzKVxuICAgICAgZXZlbnRMaXN0ZW5lcnMgPSBldmVudExpc3RlbmVycy5maWx0ZXIoZXZlbnRMaXN0ZW5lciA9PiBmaWx0ZXJCeVRhZ0V2ZW50RW1pdChldmVudExpc3RlbmVyLmV2ZW50LmZpbHRlckJ5VGFnKSlcbiAgICAgIGlmICghZXZlbnRMaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcobmFtZSArICcgZXZlbnQgaGF2ZSBubyBsaXN0ZW5lcnMgJylcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBldmVudExpc3RlbmVycy5mb3JFYWNoKChldmVudExpc3RlbmVyKSA9PiB7XG4gICAgICAgIHZhciBsaXN0ZW5lclNlcnZpY2VOYW1lID0gZXZlbnRMaXN0ZW5lci5zZXJ2aWNlTmFtZVxuICAgICAgICB2YXIgbGlzdGVuZXJTZXJ2aWNlID0gc2VydmljZXNSZWdpc3RyeVtsaXN0ZW5lclNlcnZpY2VOYW1lXVxuICAgICAgICB2YXIgZXZlbnRMaXN0ZW5Db25maWcgPSBldmVudExpc3RlbmVyLmV2ZW50XG5cbiAgICAgICAgLy8gdmFyIHNlbmRNZXNzYWdlUHJvbWlzZSA9IHNlbmRNZXNzYWdlKHtuYW1lLCBsaXN0ZW5lclNlcnZpY2UsIGxpc3RlbmVyU2VydmljZU5hbWUsIGV2ZW50TGlzdGVuQ29uZmlnLCBldmVudEVtaXRDb25maWcsIGRhdGEsIGxpc3RlbmVyU2VydmljZU5hbWUsIG1ldGF9KVxuICAgICAgICBpZiAoZXZlbnRMaXN0ZW5Db25maWcuZGVsYXllZCkge1xuICAgICAgICAgIHZhciBpbmRleCA9IG5hbWUgKyBsaXN0ZW5lclNlcnZpY2VOYW1lICsgZXZlbnRMaXN0ZW5Db25maWcubWV0aG9kXG4gICAgICAgICAgaWYgKCFkZWxheWVkU2VuZERhdGFbaW5kZXhdKSB7XG4gICAgICAgICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB2YXIgbXVsdGlFdmVudCA9IGRlbGF5ZWRTZW5kRGF0YVtpbmRleF1cbiAgICAgICAgICAgICAgZGVsZXRlIGRlbGF5ZWRTZW5kRGF0YVtpbmRleF1cbiAgICAgICAgICAgICAgc2VuZE1lc3NhZ2UobXVsdGlFdmVudClcbiAgICAgICAgICAgIH0sIGV2ZW50TGlzdGVuQ29uZmlnLmRlbGF5ZWQpXG4gICAgICAgICAgICBkZWxheWVkU2VuZERhdGFbaW5kZXhdID0ge25hbWU6ICdfbWVzc2FnZU11bHRpJywgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbXVsdGk6IHRydWUsIHRpbWVvdXQ6IDYwMDAwLCBtZXRob2Q6IGV2ZW50TGlzdGVuQ29uZmlnLm1ldGhvZCwgbmV0VXJsOiBsaXN0ZW5lclNlcnZpY2UubmV0VXJsLCBkYXRhOiB7ZXZlbnQ6IG5hbWUsIG1lc3NhZ2VzOiBbXX0sIG1ldGF9XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGF5ZWRTZW5kRGF0YVtpbmRleF0uZGF0YS5tZXNzYWdlcy5wdXNoKHtkYXRhLCBtZXRhfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2VuZE1lc3NhZ2VQcm9taXNlID0gc2VuZE1lc3NhZ2Uoe25hbWUsIGxpc3RlbmVyU2VydmljZU5hbWUsIG5ldFVybDogbGlzdGVuZXJTZXJ2aWNlLm5ldFVybCwgdGltZW91dDogZXZlbnRFbWl0Q29uZmlnLnRpbWVvdXQsIG1ldGhvZDogZXZlbnRMaXN0ZW5Db25maWcubWV0aG9kLCBoYXZlUmVzcG9uc2U6IGV2ZW50TGlzdGVuQ29uZmlnLmhhdmVSZXNwb25zZSwgZGF0YSwgbWV0YX0pXG4gICAgICAgICAgaWYgKGV2ZW50TGlzdGVuQ29uZmlnLmhhdmVSZXNwb25zZSAmJiBldmVudEVtaXRDb25maWcud2FpdFJlc3BvbnNlKXdhaXRSZXNwb25zZXMucHVzaChzZW5kTWVzc2FnZVByb21pc2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBDT05TT0xFLmRlYnVnKCdlbWl0ICcgKyBuYW1lICsgJyB3YWl0UmVzcG9uc2VzJywgd2FpdFJlc3BvbnNlcylcbiAgICAgIHZhciByZXN1bHRQcm9taXNlXG4gICAgICBpZiAoZXZlbnRFbWl0Q29uZmlnLndhaXRSZXNwb25zZSkge1xuICAgICAgICBpZiAoZXZlbnRFbWl0Q29uZmlnLnJlc3BvbnNlUmVxdWlyZWQgJiYgIXdhaXRSZXNwb25zZXMubGVuZ3RoKSBlcnJvclRocm93KG5hbWUgKyAnIGV2ZW50IG5lZWQgYSByZXNwb25zZScpXG4gICAgICAgIGlmIChldmVudEVtaXRDb25maWcuc2luZ2xlUmVzcG9uc2UpIHJlc3VsdFByb21pc2UgPSB3YWl0UmVzcG9uc2VzWzBdXG4gICAgICAgIGVsc2UgcmVzdWx0UHJvbWlzZSA9IFByb21pc2UuYWxsKHdhaXRSZXNwb25zZXMpXG4gICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCByZXN1bHRQcm9taXNlXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgJyArIG5hbWUgKyAnIHJlc3VsdHMnLCByZXN1bHQpXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0U2VyaWFsaXplZERhdGFCeXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZWREYXRhQnl0ZVxuICAgICAgfSxcbiAgICAgIHJlc2V0U2VyaWFsaXplZERhdGFCeXRlICgpIHtcbiAgICAgICAgc2VyaWFsaXplZERhdGFCeXRlID0gMFxuICAgICAgfSxcbiAgICAgIHNldFNlcmlhbGl6ZUZ1bmN0aW9uIChuZXdGdW5jKSB7XG4gICAgICAgIHNlcmlhbGl6ZUZ1bmN0aW9uID0gbmV3RnVuY1xuICAgICAgfSxcbiAgICAgIHNldERlc2VyaWFsaXplRnVuY3Rpb24gKG5ld0Z1bmMpIHtcbiAgICAgICAgZGVzZXJpYWxpemVGdW5jdGlvbiA9IG5ld0Z1bmNcbiAgICAgIH0sXG4gICAgICBlbWl0LFxuICAgICAgcnBjXG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVycm9yVGhyb3coJ2dldE5ldENsaWVudFBhY2thZ2UnLCB7ZXJyb3IsIGdldFNoYXJlZENvbmZpZywgc2VydmljZU5hbWV9KVxuICB9XG59XG4iXX0=