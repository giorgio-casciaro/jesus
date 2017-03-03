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
        var throwOnErrorResponse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiZ3JwYyIsInpsaWIiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsInNlcmlhbGl6ZWREYXRhQnl0ZSIsInNlcmlhbGl6ZUZ1bmN0aW9uIiwib2JqIiwiZGljdGlvbmFyeSIsImRlZmxhdGVTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlc2VyaWFsaXplRnVuY3Rpb24iLCJwYXJzZSIsImluZmxhdGVTeW5jIiwic2VyaWFsaXplSnNvbiIsInJlc3VsdCIsImJ5dGVMZW5ndGgiLCJkZXNlcmlhbGl6ZUpzb24iLCJidWZmZXIiLCJncnBjU2VydmljZSIsIm1lc3NhZ2UiLCJwYXRoIiwicmVxdWVzdFN0cmVhbSIsInJlc3BvbnNlU3RyZWFtIiwicmVxdWVzdFNlcmlhbGl6ZSIsInJlcXVlc3REZXNlcmlhbGl6ZSIsInJlc3BvbnNlU2VyaWFsaXplIiwicmVzcG9uc2VEZXNlcmlhbGl6ZSIsIm1lc3NhZ2VNdWx0aSIsImRlbGF5ZWRTZW5kRGF0YSIsImdsb2JhbCIsIkpFU1VTX05FVF9DTElFTlRfZGVsYXllZFNlbmREYXRhIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldENsaWVudFBhY2thZ2UiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJnZXRTaGFyZWRDb25maWciLCJDT05TT0xFIiwiZXJyb3JUaHJvdyIsImNsaWVudENhY2hlIiwiZ2V0R3JwY0NsaWVudCIsInNlbmRNZXNzYWdlIiwiZmlsdGVyQnlUYWciLCJ0YWdzIiwidGFnRmlsdGVyIiwiZGVidWciLCJpbmRleE9mIiwicnBjIiwibWV0aG9kIiwiZGF0YSIsIm1ldGEiLCJ0aW1lb3V0IiwicmVxdWVzdElkIiwibGlzdGVuZXJTZXJ2aWNlIiwibmFtZSIsImxpc3RlbmVyU2VydmljZU5hbWUiLCJuZXRVcmwiLCJoYXZlUmVzcG9uc2UiLCJzZW5kTWVzc2FnZVJlc3BvbnNlIiwiZW1pdCIsInRocm93T25FcnJvclJlc3BvbnNlIiwiZXZlbnRzRW1pdENvbmZpZyIsIndhcm4iLCJldmVudEVtaXRDb25maWciLCJidWlsZFNlcnZpY2VzUmVnaXN0cnkiLCJldmVudHNMaXN0ZW5SZWdpc3RyeSIsInNlcnZpY2VzUmVnaXN0cnkiLCJ3YWl0UmVzcG9uc2VzIiwiZXZlbnRMaXN0ZW5lcnMiLCJjb25jYXQiLCJmaWx0ZXJCeVRhZ0V2ZW50RW1pdCIsImZpbHRlciIsImV2ZW50TGlzdGVuZXIiLCJldmVudCIsImxlbmd0aCIsImZvckVhY2giLCJldmVudExpc3RlbkNvbmZpZyIsImRlbGF5ZWQiLCJpbmRleCIsInNldFRpbWVvdXQiLCJtdWx0aUV2ZW50IiwibXVsdGkiLCJtZXNzYWdlcyIsInB1c2giLCJzZW5kTWVzc2FnZVByb21pc2UiLCJ3YWl0UmVzcG9uc2UiLCJyZXNwb25zZVJlcXVpcmVkIiwic2luZ2xlUmVzcG9uc2UiLCJyZXN1bHRQcm9taXNlIiwiUHJvbWlzZSIsImFsbCIsInJlc29sdmUiLCJyZWplY3QiLCJjbGllbnQiLCJDbGllbnRDbGFzcyIsIm1ha2VHZW5lcmljQ2xpZW50Q29uc3RydWN0b3IiLCJjcmVkZW50aWFscyIsImNyZWF0ZUluc2VjdXJlIiwidGhlbiIsImNhbGxUaW1lb3V0IiwidXNlcklkIiwibWVzc2FnZUZ1bmN0aW9uIiwiY2FsbCIsImVycm9yIiwic2VydmljZVJlc3BvbnNlIiwiY2xlYXJUaW1lb3V0IiwiY2FuY2VsIiwiY2F0Y2giLCJzY2hlbWEiLCJleGNsdWRlIiwic2VydmljZXNDb25maWciLCJsaXN0ZW5lcnMiLCJzZXJ2aWNlIiwiT2JqZWN0Iiwia2V5cyIsImV2ZW50TmFtZSIsImdldFNlcmlhbGl6ZWREYXRhQnl0ZSIsInJlc2V0U2VyaWFsaXplZERhdGFCeXRlIiwic2V0U2VyaWFsaXplRnVuY3Rpb24iLCJuZXdGdW5jIiwic2V0RGVzZXJpYWxpemVGdW5jdGlvbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFS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QjtBQUNBK0UseUJBQU9DLElBQVAsQ0FBWUYsT0FBWixFQUFxQnJDLE9BQXJCLENBQTZCLHFCQUFhO0FBQ3hDLHdCQUFJLENBQUNvQyxVQUFVSSxTQUFWLENBQUwsRUFBMEJKLFVBQVVJLFNBQVYsSUFBdUIsRUFBdkI7QUFDMUJKLDhCQUFVSSxTQUFWLEVBQXFCaEMsSUFBckIsQ0FBMEIsRUFBQ2pELHdCQUFELEVBQWN1QyxPQUFPdUMsUUFBUUcsU0FBUixDQUFyQixFQUF5Q0Esb0JBQXpDLEVBQTFCO0FBQ0QsbUJBSEQsRUFHR0gsT0FISDtBQUlELGlCQU5EO0FBSDRCLGlEQVVyQkQsU0FWcUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBOUI7O0FBK0VBO0FBQUEsV0FBTztBQUNMSywrQkFESyxtQ0FDb0I7QUFDdkIsbUJBQU9sSCxrQkFBUDtBQUNELFdBSEk7QUFJTG1ILGlDQUpLLHFDQUlzQjtBQUN6Qm5ILGlDQUFxQixDQUFyQjtBQUNELFdBTkk7QUFPTG9ILDhCQVBLLGdDQU9pQkMsT0FQakIsRUFPMEI7QUFDN0JwSCxnQ0FBb0JvSCxPQUFwQjtBQUNELFdBVEk7QUFVTEMsZ0NBVkssa0NBVW1CRCxPQVZuQixFQVU0QjtBQUMvQjlHLGtDQUFzQjhHLE9BQXRCO0FBQ0QsV0FaSTs7QUFhTDVELG9CQWJLO0FBY0xaO0FBZEs7QUFBUDtBQXZIRTs7QUFBQTtBQXVJSCxHQXZJRCxDQXVJRSxPQUFPd0QsS0FBUCxFQUFjO0FBQ2RqRSxlQUFXLHFCQUFYLEVBQWtDLEVBQUNpRSxZQUFELEVBQVFuRSxnQ0FBUixFQUF5QkYsd0JBQXpCLEVBQWxDO0FBQ0Q7QUFDRixDQTdJRCIsImZpbGUiOiJuZXQuY2xpZW50LmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIGdycGMgPSByZXF1aXJlKCdncnBjJylcbnZhciB6bGliID0gcmVxdWlyZSgnemxpYicpXG5jb25zdCBQQUNLQUdFID0gJ25ldC5jbGllbnQnXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcblxuLy8gTUVTU0FHRSBTRVJJQUxJWkFUSU9OXG52YXIgc2VyaWFsaXplZERhdGFCeXRlID0gMFxudmFyIHNlcmlhbGl6ZUZ1bmN0aW9uID0gKG9iaiwgZGljdGlvbmFyeSkgPT4gemxpYi5kZWZsYXRlU3luYyhKU09OLnN0cmluZ2lmeShvYmopLCB7ZGljdGlvbmFyeX0pXG52YXIgZGVzZXJpYWxpemVGdW5jdGlvbiA9IChvYmosIGRpY3Rpb25hcnkpID0+IEpTT04ucGFyc2UoemxpYi5pbmZsYXRlU3luYyhvYmosIHtkaWN0aW9uYXJ5fSkpXG5mdW5jdGlvbiBzZXJpYWxpemVKc29uIChvYmopIHtcbiAgdmFyIHJlc3VsdCA9IHNlcmlhbGl6ZUZ1bmN0aW9uKG9iailcbiAgc2VyaWFsaXplZERhdGFCeXRlICs9IChyZXN1bHQuYnl0ZUxlbmd0aClcbiAgcmV0dXJuIHJlc3VsdFxufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVKc29uIChidWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IGRlc2VyaWFsaXplRnVuY3Rpb24oYnVmZmVyKVxuICByZXR1cm4gcmVzdWx0XG59XG52YXIgZ3JwY1NlcnZpY2UgPSB7XG4gIG1lc3NhZ2U6IHtcbiAgICBwYXRoOiAnbWVzc2FnZScsXG4gICAgcmVxdWVzdFN0cmVhbTogZmFsc2UsXG4gICAgcmVzcG9uc2VTdHJlYW06IGZhbHNlLFxuICAgIHJlcXVlc3RTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVxdWVzdERlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VEZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uXG4gIH0sXG5cbiAgbWVzc2FnZU11bHRpOiB7XG4gICAgcGF0aDogJ21lc3NhZ2VNdWx0aScsXG4gICAgcmVxdWVzdFN0cmVhbTogZmFsc2UsXG4gICAgcmVzcG9uc2VTdHJlYW06IGZhbHNlLFxuICAgIHJlcXVlc3RTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVxdWVzdERlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VEZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uXG4gIH1cbn1cblxudmFyIGRlbGF5ZWRTZW5kRGF0YSA9IGdsb2JhbC5KRVNVU19ORVRfQ0xJRU5UX2RlbGF5ZWRTZW5kRGF0YSA9IGdsb2JhbC5KRVNVU19ORVRfQ0xJRU5UX2RlbGF5ZWRTZW5kRGF0YSB8fCB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE5ldENsaWVudFBhY2thZ2UgKHtnZXRDb25zb2xlLHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGdldFNoYXJlZENvbmZpZ30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHZhciBlcnJvclRocm93ID0gcmVxdWlyZSgnLi9qZXN1cycpLmVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcblxuICAgIGNoZWNrUmVxdWlyZWQoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGdldFNoYXJlZENvbmZpZ30pXG5cbiAgICB2YXIgY2xpZW50Q2FjaGUgPSB7fVxuICAgIHZhciBnZXRHcnBjQ2xpZW50ID0gKG5ldFVybCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIGNsaWVudFxuICAgICAgaWYgKGNsaWVudENhY2hlW25ldFVybF0pY2xpZW50ID0gY2xpZW50Q2FjaGVbbmV0VXJsXVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBDbGllbnRDbGFzcyA9IGdycGMubWFrZUdlbmVyaWNDbGllbnRDb25zdHJ1Y3RvcihncnBjU2VydmljZSlcbiAgICAgICAgY2xpZW50ID0gY2xpZW50Q2FjaGVbbmV0VXJsXSA9IG5ldyBDbGllbnRDbGFzcyhuZXRVcmwsIGdycGMuY3JlZGVudGlhbHMuY3JlYXRlSW5zZWN1cmUoKSlcbiAgICAgIH1cbiAgICAgIENPTlNPTEUuZGVidWcoJ2dldEdycGNDbGllbnQgJywgY2xpZW50KVxuICAgICAgcmVzb2x2ZShjbGllbnQpXG4gICAgfSlcbiAgICB2YXIgc2VuZE1lc3NhZ2UgPSAoe3Rocm93T25FcnJvclJlc3BvbnNlLG5hbWUsIG5ldFVybCwgdGltZW91dCA9IDUwMDAsIG1ldGhvZCwgbXVsdGkgPSBmYWxzZSwgaGF2ZVJlc3BvbnNlLCBkYXRhLCBsaXN0ZW5lclNlcnZpY2VOYW1lLCBtZXRhfSkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZE1lc3NhZ2UgJyArIG5hbWUgKyAnIHRvICcgKyBsaXN0ZW5lclNlcnZpY2VOYW1lLCB7bmFtZSwgZGF0YSwgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbWV0YX0pXG4gICAgICBnZXRHcnBjQ2xpZW50KG5ldFVybCkudGhlbigoY2xpZW50KSA9PiB7XG4gICAgICAgIC8vIGlmIChldmVudExpc3RlbkNvbmZpZy5oYXZlUmVzcG9uc2UpIHtcbiAgICAgICAgdmFyIGNhbGxUaW1lb3V0XG4gICAgICAgIHZhciByZXF1ZXN0SWQgPSBtZXRhLnJlcXVlc3RJZFxuICAgICAgICB2YXIgdXNlcklkID0gbWV0YS51c2VySWRcbiAgICAgICAgdmFyIG1lc3NhZ2VGdW5jdGlvbiA9ICdtZXNzYWdlJ1xuICAgICAgICBpZiAobXVsdGkpIG1lc3NhZ2VGdW5jdGlvbiA9ICdtZXNzYWdlTXVsdGknXG4gICAgICAgIHZhciBjYWxsID0gY2xpZW50W21lc3NhZ2VGdW5jdGlvbl0oeyBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBldmVudDogbmFtZSwgbWV0aG9kLCBkYXRhLCByZXF1ZXN0SWQsIHVzZXJJZH0sIChlcnJvciwgc2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKGNhbGxUaW1lb3V0KWNsZWFyVGltZW91dChjYWxsVGltZW91dClcbiAgICAgICAgICBpZiAoZXJyb3IpcmVqZWN0KGVycm9yKVxuICAgICAgICAgIHJlc29sdmUoc2VydmljZVJlc3BvbnNlKVxuICAgICAgICB9KVxuICAgICAgICBjYWxsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGNhbGwuY2FuY2VsKClcbiAgICAgICAgICBDT05TT0xFLndhcm4oJ3NlbmRNZXNzYWdlIHRpbWVvdXQgJyArIG5hbWUgKyAnIHRvICcgKyBsaXN0ZW5lclNlcnZpY2VOYW1lLCB7c2VydmljZU5hbWUsIHRpbWVvdXQgfSlcbiAgICAgICAgICBpZiAoaGF2ZVJlc3BvbnNlKXJlamVjdCh7bWVzc2FnZTogJ1Jlc3BvbnNlIHByb2JsZW1zOiBSRVFVRVNUIFRJTUVPVVQnLCBkYXRhLCBsaXN0ZW5lclNlcnZpY2VOYW1lfSlcbiAgICAgICAgICBlbHNlIHJlc29sdmUoKVxuICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBDT05TT0xFLndhcm4oJ3NlbmRNZXNzYWdlIGVycm9yJyArIG5hbWUgKyAnIHRvICcgKyBsaXN0ZW5lclNlcnZpY2VOYW1lLCBlcnJvcilcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfSlcbiAgICB9KVxuICAgIGNvbnN0IGJ1aWxkU2VydmljZXNSZWdpc3RyeSA9IGFzeW5jIChzY2hlbWEgPSAnZXZlbnRzLmxpc3RlbicsIGV4Y2x1ZGUpID0+IHtcbiAgICAgIHZhciBzZXJ2aWNlc0NvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZygnKicsIHNjaGVtYSwgZXhjbHVkZSlcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSB7fVxuICAgICAgc2VydmljZXNDb25maWcuZm9yRWFjaChzZXJ2aWNlID0+IHtcbiAgICAgICAgdmFyIHNlcnZpY2VOYW1lID0gc2VydmljZS5zZXJ2aWNlTmFtZVxuICAgICAgICBPYmplY3Qua2V5cyhzZXJ2aWNlKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgICAgaWYgKCFsaXN0ZW5lcnNbZXZlbnROYW1lXSlsaXN0ZW5lcnNbZXZlbnROYW1lXSA9IFtdXG4gICAgICAgICAgbGlzdGVuZXJzW2V2ZW50TmFtZV0ucHVzaCh7c2VydmljZU5hbWUsIGV2ZW50OiBzZXJ2aWNlW2V2ZW50TmFtZV0sIGV2ZW50TmFtZX0pXG4gICAgICAgIH0sIHNlcnZpY2UpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIGxpc3RlbmVyc1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckJ5VGFnICh0YWdzKSB7XG4gICAgICByZXR1cm4gKHRhZ0ZpbHRlcikgPT4ge1xuICAgICAgICBpZiAodGFnRmlsdGVyKUNPTlNPTEUuZGVidWcoYGZpbHRlckJ5VGFnKClgLCB0YWdzLmluZGV4T2YodGFnRmlsdGVyKSArIDEpXG4gICAgICAgIHJldHVybiAhdGFncyB8fCAhdGFnRmlsdGVyID8gdHJ1ZSA6IHRhZ3MuaW5kZXhPZih0YWdGaWx0ZXIpICsgMVxuICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBycGMgKHNlcnZpY2VOYW1lLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXQgPSA1MDAwKSB7XG4gICAgICBDT05TT0xFLmRlYnVnKCdycGMgJyArIHNlcnZpY2VOYW1lICsgJyAnICsgbWV0aG9kICsgJyByZXF1ZXN0SWQ6JyArIG1ldGEucmVxdWVzdElkLCB7ZGF0YSwgdGltZW91dCwgbWV0YX0pXG4gICAgICB2YXIgbGlzdGVuZXJTZXJ2aWNlID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnc2VydmljZScpIC8vIFRPIEZJWCBBREQgQ0FDSEVcbiAgICAgIHZhciBzZW5kTWVzc2FnZVJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2Uoe25hbWU6ICdfcnBjQ2FsbCcsIGxpc3RlbmVyU2VydmljZU5hbWU6IHNlcnZpY2VOYW1lLCBuZXRVcmw6IGxpc3RlbmVyU2VydmljZS5uZXRVcmwsIHRpbWVvdXQsIG1ldGhvZCwgaGF2ZVJlc3BvbnNlOiB0cnVlLCBkYXRhLCBtZXRhfSlcbiAgICAgIHJldHVybiBzZW5kTWVzc2FnZVJlc3BvbnNlXG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGVtaXQgKG5hbWUsIGRhdGEsIG1ldGEsdGhyb3dPbkVycm9yUmVzcG9uc2U9dHJ1ZSkge1xuICAgICAgQ09OU09MRS5kZWJ1ZygnZW1pdCAnICsgbmFtZSArICcgcmVxdWVzdElkOicgKyBtZXRhLnJlcXVlc3RJZCwge25hbWUsIGRhdGEsIG1ldGF9KVxuICAgICAgdmFyIGV2ZW50c0VtaXRDb25maWcgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdldmVudHMuZW1pdCcpXG4gICAgICBpZiAoIWV2ZW50c0VtaXRDb25maWdbbmFtZV0pIHJldHVybiBDT05TT0xFLndhcm4obmFtZSArICcgZXZlbnQgbm90IGRlZmluZWQgaW4gL2V2ZW50cy5lbWl0Lmpzb24nKVxuICAgICAgdmFyIGV2ZW50RW1pdENvbmZpZyA9IGV2ZW50c0VtaXRDb25maWdbbmFtZV1cblxuICAgICAgdmFyIGV2ZW50c0xpc3RlblJlZ2lzdHJ5ID0gYXdhaXQgYnVpbGRTZXJ2aWNlc1JlZ2lzdHJ5KCdldmVudHMubGlzdGVuJywgc2VydmljZU5hbWUpXG5cbiAgICAgIHZhciBzZXJ2aWNlc1JlZ2lzdHJ5ID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKCcqJywgJ3NlcnZpY2UnLCBzZXJ2aWNlTmFtZSwgdHJ1ZSlcbiAgICAgIC8vIENPTlNPTEUuZGVidWcoJ2VtaXQgaW5mbycsIHtldmVudEVtaXRDb25maWcsIGV2ZW50c0xpc3RlblJlZ2lzdHJ5LCBzZXJ2aWNlc1JlZ2lzdHJ5fSlcbiAgICAgIHZhciB3YWl0UmVzcG9uc2VzID0gW11cbiAgICAgIHZhciBldmVudExpc3RlbmVycyA9IFtdXG4gICAgICBpZiAoZXZlbnRzTGlzdGVuUmVnaXN0cnlbbmFtZV0pZXZlbnRMaXN0ZW5lcnMgPSBldmVudExpc3RlbmVycy5jb25jYXQoZXZlbnRzTGlzdGVuUmVnaXN0cnlbbmFtZV0pXG4gICAgICBpZiAoZXZlbnRzTGlzdGVuUmVnaXN0cnlbJyonXSlldmVudExpc3RlbmVycyA9IGV2ZW50TGlzdGVuZXJzLmNvbmNhdChldmVudHNMaXN0ZW5SZWdpc3RyeVsnKiddKVxuICAgICAgdmFyIGZpbHRlckJ5VGFnRXZlbnRFbWl0ID0gZmlsdGVyQnlUYWcoZXZlbnRFbWl0Q29uZmlnLnRhZ3MpXG4gICAgICBldmVudExpc3RlbmVycyA9IGV2ZW50TGlzdGVuZXJzLmZpbHRlcihldmVudExpc3RlbmVyID0+IGZpbHRlckJ5VGFnRXZlbnRFbWl0KGV2ZW50TGlzdGVuZXIuZXZlbnQuZmlsdGVyQnlUYWcpKVxuICAgICAgaWYgKCFldmVudExpc3RlbmVycy5sZW5ndGgpIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1ZyhuYW1lICsgJyBldmVudCBoYXZlIG5vIGxpc3RlbmVycyAnKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGV2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpID0+IHtcbiAgICAgICAgdmFyIGxpc3RlbmVyU2VydmljZU5hbWUgPSBldmVudExpc3RlbmVyLnNlcnZpY2VOYW1lXG4gICAgICAgIHZhciBsaXN0ZW5lclNlcnZpY2UgPSBzZXJ2aWNlc1JlZ2lzdHJ5W2xpc3RlbmVyU2VydmljZU5hbWVdXG4gICAgICAgIHZhciBldmVudExpc3RlbkNvbmZpZyA9IGV2ZW50TGlzdGVuZXIuZXZlbnRcblxuICAgICAgICAvLyB2YXIgc2VuZE1lc3NhZ2VQcm9taXNlID0gc2VuZE1lc3NhZ2Uoe25hbWUsIGxpc3RlbmVyU2VydmljZSwgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgZXZlbnRMaXN0ZW5Db25maWcsIGV2ZW50RW1pdENvbmZpZywgZGF0YSwgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbWV0YX0pXG4gICAgICAgIGlmIChldmVudExpc3RlbkNvbmZpZy5kZWxheWVkKSB7XG4gICAgICAgICAgdmFyIGluZGV4ID0gbmFtZSArIGxpc3RlbmVyU2VydmljZU5hbWUgKyBldmVudExpc3RlbkNvbmZpZy5tZXRob2RcbiAgICAgICAgICBpZiAoIWRlbGF5ZWRTZW5kRGF0YVtpbmRleF0pIHtcbiAgICAgICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHZhciBtdWx0aUV2ZW50ID0gZGVsYXllZFNlbmREYXRhW2luZGV4XVxuICAgICAgICAgICAgICBkZWxldGUgZGVsYXllZFNlbmREYXRhW2luZGV4XVxuICAgICAgICAgICAgICBzZW5kTWVzc2FnZShtdWx0aUV2ZW50KVxuICAgICAgICAgICAgfSwgZXZlbnRMaXN0ZW5Db25maWcuZGVsYXllZClcbiAgICAgICAgICAgIGRlbGF5ZWRTZW5kRGF0YVtpbmRleF0gPSB7dGhyb3dPbkVycm9yUmVzcG9uc2UsIG5hbWU6ICdfbWVzc2FnZU11bHRpJywgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbXVsdGk6IHRydWUsIHRpbWVvdXQ6IDYwMDAwLCBtZXRob2Q6IGV2ZW50TGlzdGVuQ29uZmlnLm1ldGhvZCwgbmV0VXJsOiBsaXN0ZW5lclNlcnZpY2UubmV0VXJsLCBkYXRhOiB7ZXZlbnQ6IG5hbWUsIG1lc3NhZ2VzOiBbXX0sIG1ldGF9XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGF5ZWRTZW5kRGF0YVtpbmRleF0uZGF0YS5tZXNzYWdlcy5wdXNoKHtkYXRhLCBtZXRhfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2VuZE1lc3NhZ2VQcm9taXNlID0gc2VuZE1lc3NhZ2Uoe25hbWUsIGxpc3RlbmVyU2VydmljZU5hbWUsIG5ldFVybDogbGlzdGVuZXJTZXJ2aWNlLm5ldFVybCwgdGltZW91dDogZXZlbnRFbWl0Q29uZmlnLnRpbWVvdXQsIG1ldGhvZDogZXZlbnRMaXN0ZW5Db25maWcubWV0aG9kLCBoYXZlUmVzcG9uc2U6IGV2ZW50TGlzdGVuQ29uZmlnLmhhdmVSZXNwb25zZSwgZGF0YSwgbWV0YX0pXG4gICAgICAgICAgaWYgKGV2ZW50TGlzdGVuQ29uZmlnLmhhdmVSZXNwb25zZSAmJiBldmVudEVtaXRDb25maWcud2FpdFJlc3BvbnNlKXdhaXRSZXNwb25zZXMucHVzaChzZW5kTWVzc2FnZVByb21pc2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBDT05TT0xFLmRlYnVnKCdlbWl0ICcgKyBuYW1lICsgJyB3YWl0UmVzcG9uc2VzJywgd2FpdFJlc3BvbnNlcylcbiAgICAgIHZhciByZXN1bHRQcm9taXNlXG4gICAgICBpZiAoZXZlbnRFbWl0Q29uZmlnLndhaXRSZXNwb25zZSkge1xuICAgICAgICBpZiAoZXZlbnRFbWl0Q29uZmlnLnJlc3BvbnNlUmVxdWlyZWQgJiYgIXdhaXRSZXNwb25zZXMubGVuZ3RoKSBlcnJvclRocm93KG5hbWUgKyAnIGV2ZW50IG5lZWQgYSByZXNwb25zZScpXG4gICAgICAgIGlmIChldmVudEVtaXRDb25maWcuc2luZ2xlUmVzcG9uc2UpIHJlc3VsdFByb21pc2UgPSB3YWl0UmVzcG9uc2VzWzBdXG4gICAgICAgIGVsc2UgcmVzdWx0UHJvbWlzZSA9IFByb21pc2UuYWxsKHdhaXRSZXNwb25zZXMpXG4gICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCByZXN1bHRQcm9taXNlXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgJyArIG5hbWUgKyAnIHJlc3VsdHMnLCByZXN1bHQpXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0U2VyaWFsaXplZERhdGFCeXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZWREYXRhQnl0ZVxuICAgICAgfSxcbiAgICAgIHJlc2V0U2VyaWFsaXplZERhdGFCeXRlICgpIHtcbiAgICAgICAgc2VyaWFsaXplZERhdGFCeXRlID0gMFxuICAgICAgfSxcbiAgICAgIHNldFNlcmlhbGl6ZUZ1bmN0aW9uIChuZXdGdW5jKSB7XG4gICAgICAgIHNlcmlhbGl6ZUZ1bmN0aW9uID0gbmV3RnVuY1xuICAgICAgfSxcbiAgICAgIHNldERlc2VyaWFsaXplRnVuY3Rpb24gKG5ld0Z1bmMpIHtcbiAgICAgICAgZGVzZXJpYWxpemVGdW5jdGlvbiA9IG5ld0Z1bmNcbiAgICAgIH0sXG4gICAgICBlbWl0LFxuICAgICAgcnBjXG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVycm9yVGhyb3coJ2dldE5ldENsaWVudFBhY2thZ2UnLCB7ZXJyb3IsIGdldFNoYXJlZENvbmZpZywgc2VydmljZU5hbWV9KVxuICB9XG59XG4iXX0=