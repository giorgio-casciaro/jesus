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
                CONSOLE.debug('rpc ' + serviceName + ' ' + method + ' corrid:' + meta.corrid, { data: data, timeout: timeout, meta: meta });
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
                CONSOLE.debug('emit ' + name + ' corrid:' + meta.corrid, { name: name, data: data, meta: meta });
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
            var corrid = meta.corrid;
            var userid = meta.userid;
            var messageFunction = 'message';
            if (multi) messageFunction = 'messageMulti';
            var call = client[messageFunction]({ serviceName: serviceName, serviceId: serviceId, event: name, method: method, data: data, corrid: corrid, userid: userid }, function (error, serviceResponse) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9uZXQuY2xpZW50LmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImdycGMiLCJ6bGliIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJzZXJpYWxpemVkRGF0YUJ5dGUiLCJzZXJpYWxpemVGdW5jdGlvbiIsIm9iaiIsImRpY3Rpb25hcnkiLCJkZWZsYXRlU3luYyIsIkpTT04iLCJzdHJpbmdpZnkiLCJkZXNlcmlhbGl6ZUZ1bmN0aW9uIiwicGFyc2UiLCJpbmZsYXRlU3luYyIsInNlcmlhbGl6ZUpzb24iLCJyZXN1bHQiLCJieXRlTGVuZ3RoIiwiZGVzZXJpYWxpemVKc29uIiwiYnVmZmVyIiwiZ3JwY1NlcnZpY2UiLCJtZXNzYWdlIiwicGF0aCIsInJlcXVlc3RTdHJlYW0iLCJyZXNwb25zZVN0cmVhbSIsInJlcXVlc3RTZXJpYWxpemUiLCJyZXF1ZXN0RGVzZXJpYWxpemUiLCJyZXNwb25zZVNlcmlhbGl6ZSIsInJlc3BvbnNlRGVzZXJpYWxpemUiLCJtZXNzYWdlTXVsdGkiLCJkZWxheWVkU2VuZERhdGEiLCJnbG9iYWwiLCJKRVNVU19ORVRfQ0xJRU5UX2RlbGF5ZWRTZW5kRGF0YSIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXROZXRDbGllbnRQYWNrYWdlIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiZ2V0U2hhcmVkQ29uZmlnIiwiQ09OU09MRSIsImVycm9yVGhyb3ciLCJkZWZhdWx0RXZlbnRFbWl0IiwiY2xpZW50Q2FjaGUiLCJnZXRHcnBjQ2xpZW50Iiwic2VuZE1lc3NhZ2UiLCJmaWx0ZXJCeVRhZyIsInRhZ3MiLCJ0YWdGaWx0ZXIiLCJkZWJ1ZyIsImluZGV4T2YiLCJycGMiLCJtZXRob2QiLCJkYXRhIiwibWV0YSIsInRpbWVvdXQiLCJjb3JySWQiLCJsaXN0ZW5lclNlcnZpY2UiLCJuYW1lIiwibGlzdGVuZXJTZXJ2aWNlTmFtZSIsIm5ldFVybCIsImhhdmVSZXNwb25zZSIsInNlbmRNZXNzYWdlUmVzcG9uc2UiLCJlbWl0IiwidGhyb3dPbkVycm9yUmVzcG9uc2UiLCJPYmplY3QiLCJldmVudHNFbWl0Q29uZmlnIiwiYXNzaWduIiwid2FybiIsImV2ZW50RW1pdENvbmZpZyIsImJ1aWxkU2VydmljZXNSZWdpc3RyeSIsImV2ZW50c0xpc3RlblJlZ2lzdHJ5Iiwic2VydmljZXNSZWdpc3RyeSIsIndhaXRSZXNwb25zZXMiLCJldmVudExpc3RlbmVycyIsImNvbmNhdCIsImZpbHRlckJ5VGFnRXZlbnRFbWl0IiwiZmlsdGVyIiwiZXZlbnRMaXN0ZW5lciIsImV2ZW50IiwibGVuZ3RoIiwiZm9yRWFjaCIsImV2ZW50TGlzdGVuQ29uZmlnIiwiZGVsYXllZCIsImluZGV4Iiwic2V0VGltZW91dCIsIm11bHRpRXZlbnQiLCJtdWx0aSIsIm1lc3NhZ2VzIiwicHVzaCIsInNlbmRNZXNzYWdlUHJvbWlzZSIsIndhaXRSZXNwb25zZSIsInJlc3BvbnNlUmVxdWlyZWQiLCJzaW5nbGVSZXNwb25zZSIsInJlc3VsdFByb21pc2UiLCJQcm9taXNlIiwiYWxsIiwicmVzb2x2ZSIsInJlamVjdCIsImNsaWVudCIsIkNsaWVudENsYXNzIiwibWFrZUdlbmVyaWNDbGllbnRDb25zdHJ1Y3RvciIsImNyZWRlbnRpYWxzIiwiY3JlYXRlSW5zZWN1cmUiLCJ0aGVuIiwiY2FsbFRpbWVvdXQiLCJ1c2VySWQiLCJtZXNzYWdlRnVuY3Rpb24iLCJjYWxsIiwiZXJyb3IiLCJzZXJ2aWNlUmVzcG9uc2UiLCJjbGVhclRpbWVvdXQiLCJjYW5jZWwiLCJjYXRjaCIsInNjaGVtYSIsImV4Y2x1ZGUiLCJzZXJ2aWNlc0NvbmZpZyIsImxpc3RlbmVycyIsInNlcnZpY2UiLCJrZXlzIiwiZXZlbnROYW1lIiwiZ2V0U2VyaWFsaXplZERhdGFCeXRlIiwicmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJzZXRTZXJpYWxpemVGdW5jdGlvbiIsIm5ld0Z1bmMiLCJzZXREZXNlcmlhbGl6ZUZ1bmN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEs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bGllbnQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgZ3JwYyA9IHJlcXVpcmUoJ2dycGMnKVxudmFyIHpsaWIgPSByZXF1aXJlKCd6bGliJylcbmNvbnN0IFBBQ0tBR0UgPSAnbmV0LmNsaWVudCdcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuXG4vLyBNRVNTQUdFIFNFUklBTElaQVRJT05cbnZhciBzZXJpYWxpemVkRGF0YUJ5dGUgPSAwXG52YXIgc2VyaWFsaXplRnVuY3Rpb24gPSAob2JqLCBkaWN0aW9uYXJ5KSA9PiB6bGliLmRlZmxhdGVTeW5jKEpTT04uc3RyaW5naWZ5KG9iaiksIHtkaWN0aW9uYXJ5fSlcbnZhciBkZXNlcmlhbGl6ZUZ1bmN0aW9uID0gKG9iaiwgZGljdGlvbmFyeSkgPT4gSlNPTi5wYXJzZSh6bGliLmluZmxhdGVTeW5jKG9iaiwge2RpY3Rpb25hcnl9KSlcbmZ1bmN0aW9uIHNlcmlhbGl6ZUpzb24gKG9iaikge1xuICB2YXIgcmVzdWx0ID0gc2VyaWFsaXplRnVuY3Rpb24ob2JqKVxuICBzZXJpYWxpemVkRGF0YUJ5dGUgKz0gKHJlc3VsdC5ieXRlTGVuZ3RoKVxuICByZXR1cm4gcmVzdWx0XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUpzb24gKGJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gZGVzZXJpYWxpemVGdW5jdGlvbihidWZmZXIpXG4gIHJldHVybiByZXN1bHRcbn1cbnZhciBncnBjU2VydmljZSA9IHtcbiAgbWVzc2FnZToge1xuICAgIHBhdGg6ICdtZXNzYWdlJyxcbiAgICByZXF1ZXN0U3RyZWFtOiBmYWxzZSxcbiAgICByZXNwb25zZVN0cmVhbTogZmFsc2UsXG4gICAgcmVxdWVzdFNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXF1ZXN0RGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZVNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZURlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb25cbiAgfSxcblxuICBtZXNzYWdlTXVsdGk6IHtcbiAgICBwYXRoOiAnbWVzc2FnZU11bHRpJyxcbiAgICByZXF1ZXN0U3RyZWFtOiBmYWxzZSxcbiAgICByZXNwb25zZVN0cmVhbTogZmFsc2UsXG4gICAgcmVxdWVzdFNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXF1ZXN0RGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZVNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZURlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb25cbiAgfVxufVxuXG52YXIgZGVsYXllZFNlbmREYXRhID0gZ2xvYmFsLkpFU1VTX05FVF9DTElFTlRfZGVsYXllZFNlbmREYXRhID0gZ2xvYmFsLkpFU1VTX05FVF9DTElFTlRfZGVsYXllZFNlbmREYXRhIHx8IHt9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TmV0Q2xpZW50UGFja2FnZSAoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGdldFNoYXJlZENvbmZpZ30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHZhciBlcnJvclRocm93ID0gcmVxdWlyZSgnLi9qZXN1cycpLmVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBnZXRTaGFyZWRDb25maWd9KVxuICAgIHZhciBkZWZhdWx0RXZlbnRFbWl0ID0gcmVxdWlyZSgnLi9kZWZhdWx0LmV2ZW50LmVtaXQuanNvbicpXG5cbiAgICB2YXIgY2xpZW50Q2FjaGUgPSB7fVxuICAgIHZhciBnZXRHcnBjQ2xpZW50ID0gKG5ldFVybCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIGNsaWVudFxuICAgICAgaWYgKGNsaWVudENhY2hlW25ldFVybF0pY2xpZW50ID0gY2xpZW50Q2FjaGVbbmV0VXJsXVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBDbGllbnRDbGFzcyA9IGdycGMubWFrZUdlbmVyaWNDbGllbnRDb25zdHJ1Y3RvcihncnBjU2VydmljZSlcbiAgICAgICAgY2xpZW50ID0gY2xpZW50Q2FjaGVbbmV0VXJsXSA9IG5ldyBDbGllbnRDbGFzcyhuZXRVcmwsIGdycGMuY3JlZGVudGlhbHMuY3JlYXRlSW5zZWN1cmUoKSlcbiAgICAgIH1cbiAgICAgIENPTlNPTEUuZGVidWcoJ2dldEdycGNDbGllbnQgJywgY2xpZW50KVxuICAgICAgcmVzb2x2ZShjbGllbnQpXG4gICAgfSlcbiAgICB2YXIgc2VuZE1lc3NhZ2UgPSAoe3Rocm93T25FcnJvclJlc3BvbnNlLCBuYW1lLCBuZXRVcmwsIHRpbWVvdXQgPSA1MDAwLCBtZXRob2QsIG11bHRpID0gZmFsc2UsIGhhdmVSZXNwb25zZSwgZGF0YSwgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbWV0YX0pID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmRNZXNzYWdlICcgKyBuYW1lICsgJyB0byAnICsgbGlzdGVuZXJTZXJ2aWNlTmFtZSwge25hbWUsIGRhdGEsIGxpc3RlbmVyU2VydmljZU5hbWUsIG1ldGF9KVxuICAgICAgZ2V0R3JwY0NsaWVudChuZXRVcmwpLnRoZW4oKGNsaWVudCkgPT4ge1xuICAgICAgICAvLyBpZiAoZXZlbnRMaXN0ZW5Db25maWcuaGF2ZVJlc3BvbnNlKSB7XG4gICAgICAgIHZhciBjYWxsVGltZW91dFxuICAgICAgICB2YXIgY29ycklkID0gbWV0YS5jb3JySWRcbiAgICAgICAgdmFyIHVzZXJJZCA9IG1ldGEudXNlcklkXG4gICAgICAgIHZhciBtZXNzYWdlRnVuY3Rpb24gPSAnbWVzc2FnZSdcbiAgICAgICAgaWYgKG11bHRpKSBtZXNzYWdlRnVuY3Rpb24gPSAnbWVzc2FnZU11bHRpJ1xuICAgICAgICB2YXIgY2FsbCA9IGNsaWVudFttZXNzYWdlRnVuY3Rpb25dKHsgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZXZlbnQ6IG5hbWUsIG1ldGhvZCwgZGF0YSwgY29ycklkLCB1c2VySWR9LCAoZXJyb3IsIHNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmIChjYWxsVGltZW91dCljbGVhclRpbWVvdXQoY2FsbFRpbWVvdXQpXG4gICAgICAgICAgaWYgKGVycm9yKXJlamVjdChlcnJvcilcbiAgICAgICAgICByZXNvbHZlKHNlcnZpY2VSZXNwb25zZSlcbiAgICAgICAgfSlcbiAgICAgICAgY2FsbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjYWxsLmNhbmNlbCgpXG4gICAgICAgICAgQ09OU09MRS53YXJuKCdzZW5kTWVzc2FnZSB0aW1lb3V0ICcgKyBuYW1lICsgJyB0byAnICsgbGlzdGVuZXJTZXJ2aWNlTmFtZSwge3NlcnZpY2VOYW1lLCB0aW1lb3V0IH0pXG4gICAgICAgICAgaWYgKGhhdmVSZXNwb25zZSlyZWplY3Qoe21lc3NhZ2U6ICdSZXNwb25zZSBwcm9ibGVtczogUkVRVUVTVCBUSU1FT1VUJywgZGF0YSwgbGlzdGVuZXJTZXJ2aWNlTmFtZX0pXG4gICAgICAgICAgZWxzZSByZXNvbHZlKClcbiAgICAgICAgfSwgdGltZW91dClcbiAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgQ09OU09MRS53YXJuKCdzZW5kTWVzc2FnZSBlcnJvcicgKyBuYW1lICsgJyB0byAnICsgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgZXJyb3IpXG4gICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIH0pXG4gICAgfSlcbiAgICBjb25zdCBidWlsZFNlcnZpY2VzUmVnaXN0cnkgPSBhc3luYyAoc2NoZW1hID0gJ2V2ZW50cy5saXN0ZW4nLCBleGNsdWRlKSA9PiB7XG4gICAgICB2YXIgc2VydmljZXNDb25maWcgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcoJyonLCBzY2hlbWEsIGV4Y2x1ZGUpXG4gICAgICB2YXIgbGlzdGVuZXJzID0ge31cbiAgICAgIHNlcnZpY2VzQ29uZmlnLmZvckVhY2goc2VydmljZSA9PiB7XG4gICAgICAgIHZhciBzZXJ2aWNlTmFtZSA9IHNlcnZpY2Uuc2VydmljZU5hbWVcbiAgICAgICAgT2JqZWN0LmtleXMoc2VydmljZSkuZm9yRWFjaChldmVudE5hbWUgPT4ge1xuICAgICAgICAgIGlmICghbGlzdGVuZXJzW2V2ZW50TmFtZV0pbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXVxuICAgICAgICAgIGxpc3RlbmVyc1tldmVudE5hbWVdLnB1c2goe3NlcnZpY2VOYW1lLCBldmVudDogc2VydmljZVtldmVudE5hbWVdLCBldmVudE5hbWV9KVxuICAgICAgICB9LCBzZXJ2aWNlKVxuICAgICAgfSlcbiAgICAgIHJldHVybiBsaXN0ZW5lcnNcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJCeVRhZyAodGFncykge1xuICAgICAgcmV0dXJuICh0YWdGaWx0ZXIpID0+IHtcbiAgICAgICAgaWYgKHRhZ0ZpbHRlcilDT05TT0xFLmRlYnVnKGBmaWx0ZXJCeVRhZygpYCwgdGFncy5pbmRleE9mKHRhZ0ZpbHRlcikgKyAxKVxuICAgICAgICByZXR1cm4gIXRhZ3MgfHwgIXRhZ0ZpbHRlciA/IHRydWUgOiB0YWdzLmluZGV4T2YodGFnRmlsdGVyKSArIDFcbiAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gcnBjIChzZXJ2aWNlTmFtZSwgbWV0aG9kLCBkYXRhLCBtZXRhLCB0aW1lb3V0ID0gNTAwMCkge1xuICAgICAgQ09OU09MRS5kZWJ1ZygncnBjICcgKyBzZXJ2aWNlTmFtZSArICcgJyArIG1ldGhvZCArICcgY29ycklkOicgKyBtZXRhLmNvcnJJZCwge2RhdGEsIHRpbWVvdXQsIG1ldGF9KVxuICAgICAgdmFyIGxpc3RlbmVyU2VydmljZSA9IGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ3NlcnZpY2UnKSAvLyBUTyBGSVggQUREIENBQ0hFXG4gICAgICB2YXIgc2VuZE1lc3NhZ2VSZXNwb25zZSA9IGF3YWl0IHNlbmRNZXNzYWdlKHtuYW1lOiAnX3JwY0NhbGwnLCBsaXN0ZW5lclNlcnZpY2VOYW1lOiBzZXJ2aWNlTmFtZSwgbmV0VXJsOiBsaXN0ZW5lclNlcnZpY2UubmV0VXJsLCB0aW1lb3V0LCBtZXRob2QsIGhhdmVSZXNwb25zZTogdHJ1ZSwgZGF0YSwgbWV0YX0pXG4gICAgICByZXR1cm4gc2VuZE1lc3NhZ2VSZXNwb25zZVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBlbWl0IChuYW1lLCBkYXRhLCBtZXRhLCB0aHJvd09uRXJyb3JSZXNwb25zZSA9IHRydWUpIHtcbiAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgJyArIG5hbWUgKyAnIGNvcnJJZDonICsgbWV0YS5jb3JySWQsIHtuYW1lLCBkYXRhLCBtZXRhfSlcbiAgICAgIHZhciBldmVudHNFbWl0Q29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdEV2ZW50RW1pdCwgYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnZXZlbnRzLmVtaXQnKSlcbiAgICAgIGlmICghZXZlbnRzRW1pdENvbmZpZ1tuYW1lXSkgcmV0dXJuIENPTlNPTEUud2FybihuYW1lICsgJyBldmVudCBub3QgZGVmaW5lZCBpbiAvZXZlbnRzLmVtaXQuanNvbicpXG4gICAgICB2YXIgZXZlbnRFbWl0Q29uZmlnID0gZXZlbnRzRW1pdENvbmZpZ1tuYW1lXVxuXG4gICAgICB2YXIgZXZlbnRzTGlzdGVuUmVnaXN0cnkgPSBhd2FpdCBidWlsZFNlcnZpY2VzUmVnaXN0cnkoJ2V2ZW50cy5saXN0ZW4nLCBzZXJ2aWNlTmFtZSlcblxuICAgICAgdmFyIHNlcnZpY2VzUmVnaXN0cnkgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcoJyonLCAnc2VydmljZScsIHNlcnZpY2VOYW1lLCB0cnVlKVxuICAgICAgLy8gQ09OU09MRS5kZWJ1ZygnZW1pdCBpbmZvJywge2V2ZW50RW1pdENvbmZpZywgZXZlbnRzTGlzdGVuUmVnaXN0cnksIHNlcnZpY2VzUmVnaXN0cnl9KVxuICAgICAgdmFyIHdhaXRSZXNwb25zZXMgPSBbXVxuICAgICAgdmFyIGV2ZW50TGlzdGVuZXJzID0gW11cbiAgICAgIGlmIChldmVudHNMaXN0ZW5SZWdpc3RyeVtuYW1lXSlldmVudExpc3RlbmVycyA9IGV2ZW50TGlzdGVuZXJzLmNvbmNhdChldmVudHNMaXN0ZW5SZWdpc3RyeVtuYW1lXSlcbiAgICAgIGlmIChldmVudHNMaXN0ZW5SZWdpc3RyeVsnKiddKWV2ZW50TGlzdGVuZXJzID0gZXZlbnRMaXN0ZW5lcnMuY29uY2F0KGV2ZW50c0xpc3RlblJlZ2lzdHJ5WycqJ10pXG4gICAgICB2YXIgZmlsdGVyQnlUYWdFdmVudEVtaXQgPSBmaWx0ZXJCeVRhZyhldmVudEVtaXRDb25maWcudGFncylcbiAgICAgIGV2ZW50TGlzdGVuZXJzID0gZXZlbnRMaXN0ZW5lcnMuZmlsdGVyKGV2ZW50TGlzdGVuZXIgPT4gZmlsdGVyQnlUYWdFdmVudEVtaXQoZXZlbnRMaXN0ZW5lci5ldmVudC5maWx0ZXJCeVRhZykpXG4gICAgICBpZiAoIWV2ZW50TGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKG5hbWUgKyAnIGV2ZW50IGhhdmUgbm8gbGlzdGVuZXJzICcpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcikgPT4ge1xuICAgICAgICB2YXIgbGlzdGVuZXJTZXJ2aWNlTmFtZSA9IGV2ZW50TGlzdGVuZXIuc2VydmljZU5hbWVcbiAgICAgICAgdmFyIGxpc3RlbmVyU2VydmljZSA9IHNlcnZpY2VzUmVnaXN0cnlbbGlzdGVuZXJTZXJ2aWNlTmFtZV1cbiAgICAgICAgdmFyIGV2ZW50TGlzdGVuQ29uZmlnID0gZXZlbnRMaXN0ZW5lci5ldmVudFxuXG4gICAgICAgIC8vIHZhciBzZW5kTWVzc2FnZVByb21pc2UgPSBzZW5kTWVzc2FnZSh7bmFtZSwgbGlzdGVuZXJTZXJ2aWNlLCBsaXN0ZW5lclNlcnZpY2VOYW1lLCBldmVudExpc3RlbkNvbmZpZywgZXZlbnRFbWl0Q29uZmlnLCBkYXRhLCBsaXN0ZW5lclNlcnZpY2VOYW1lLCBtZXRhfSlcbiAgICAgICAgaWYgKGV2ZW50TGlzdGVuQ29uZmlnLmRlbGF5ZWQpIHtcbiAgICAgICAgICB2YXIgaW5kZXggPSBuYW1lICsgbGlzdGVuZXJTZXJ2aWNlTmFtZSArIGV2ZW50TGlzdGVuQ29uZmlnLm1ldGhvZFxuICAgICAgICAgIGlmICghZGVsYXllZFNlbmREYXRhW2luZGV4XSkge1xuICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgdmFyIG11bHRpRXZlbnQgPSBkZWxheWVkU2VuZERhdGFbaW5kZXhdXG4gICAgICAgICAgICAgIGRlbGV0ZSBkZWxheWVkU2VuZERhdGFbaW5kZXhdXG4gICAgICAgICAgICAgIHNlbmRNZXNzYWdlKG11bHRpRXZlbnQpXG4gICAgICAgICAgICB9LCBldmVudExpc3RlbkNvbmZpZy5kZWxheWVkKVxuICAgICAgICAgICAgZGVsYXllZFNlbmREYXRhW2luZGV4XSA9IHt0aHJvd09uRXJyb3JSZXNwb25zZSwgbmFtZTogJ19tZXNzYWdlTXVsdGknLCBsaXN0ZW5lclNlcnZpY2VOYW1lLCBtdWx0aTogdHJ1ZSwgdGltZW91dDogNjAwMDAsIG1ldGhvZDogZXZlbnRMaXN0ZW5Db25maWcubWV0aG9kLCBuZXRVcmw6IGxpc3RlbmVyU2VydmljZS5uZXRVcmwsIGRhdGE6IHtldmVudDogbmFtZSwgbWVzc2FnZXM6IFtdfSwgbWV0YX1cbiAgICAgICAgICB9XG4gICAgICAgICAgZGVsYXllZFNlbmREYXRhW2luZGV4XS5kYXRhLm1lc3NhZ2VzLnB1c2goe2RhdGEsIG1ldGF9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzZW5kTWVzc2FnZVByb21pc2UgPSBzZW5kTWVzc2FnZSh7bmFtZSwgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgbmV0VXJsOiBsaXN0ZW5lclNlcnZpY2UubmV0VXJsLCB0aW1lb3V0OiBldmVudEVtaXRDb25maWcudGltZW91dCwgbWV0aG9kOiBldmVudExpc3RlbkNvbmZpZy5tZXRob2QsIGhhdmVSZXNwb25zZTogZXZlbnRMaXN0ZW5Db25maWcuaGF2ZVJlc3BvbnNlLCBkYXRhLCBtZXRhfSlcbiAgICAgICAgICBpZiAoZXZlbnRMaXN0ZW5Db25maWcuaGF2ZVJlc3BvbnNlICYmIGV2ZW50RW1pdENvbmZpZy53YWl0UmVzcG9uc2Upd2FpdFJlc3BvbnNlcy5wdXNoKHNlbmRNZXNzYWdlUHJvbWlzZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgJyArIG5hbWUgKyAnIHdhaXRSZXNwb25zZXMnLCB3YWl0UmVzcG9uc2VzKVxuICAgICAgdmFyIHJlc3VsdFByb21pc2VcbiAgICAgIGlmIChldmVudEVtaXRDb25maWcud2FpdFJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChldmVudEVtaXRDb25maWcucmVzcG9uc2VSZXF1aXJlZCAmJiAhd2FpdFJlc3BvbnNlcy5sZW5ndGgpIGVycm9yVGhyb3cobmFtZSArICcgZXZlbnQgbmVlZCBhIHJlc3BvbnNlJylcbiAgICAgICAgaWYgKGV2ZW50RW1pdENvbmZpZy5zaW5nbGVSZXNwb25zZSkgcmVzdWx0UHJvbWlzZSA9IHdhaXRSZXNwb25zZXNbMF1cbiAgICAgICAgZWxzZSByZXN1bHRQcm9taXNlID0gUHJvbWlzZS5hbGwod2FpdFJlc3BvbnNlcylcbiAgICAgICAgdmFyIHJlc3VsdCA9IGF3YWl0IHJlc3VsdFByb21pc2VcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnZW1pdCAnICsgbmFtZSArICcgcmVzdWx0cycsIHJlc3VsdClcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBnZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICByZXR1cm4gc2VyaWFsaXplZERhdGFCeXRlXG4gICAgICB9LFxuICAgICAgcmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICBzZXJpYWxpemVkRGF0YUJ5dGUgPSAwXG4gICAgICB9LFxuICAgICAgc2V0U2VyaWFsaXplRnVuY3Rpb24gKG5ld0Z1bmMpIHtcbiAgICAgICAgc2VyaWFsaXplRnVuY3Rpb24gPSBuZXdGdW5jXG4gICAgICB9LFxuICAgICAgc2V0RGVzZXJpYWxpemVGdW5jdGlvbiAobmV3RnVuYykge1xuICAgICAgICBkZXNlcmlhbGl6ZUZ1bmN0aW9uID0gbmV3RnVuY1xuICAgICAgfSxcbiAgICAgIGVtaXQsXG4gICAgICBycGNcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JUaHJvdygnZ2V0TmV0Q2xpZW50UGFja2FnZScsIHtlcnJvciwgZ2V0U2hhcmVkQ29uZmlnLCBzZXJ2aWNlTmFtZX0pXG4gIH1cbn1cbiJdfQ==