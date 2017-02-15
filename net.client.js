'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
var grpc = require('grpc');
var zlib = require('zlib');
var LOG = console;
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
  }
};

module.exports = function getNetClientPackage(_ref) {
  var getAllServicesConfig = _ref.getAllServicesConfig,
      sharedServicePath = _ref.sharedServicePath;

  try {
    var clientCache;
    var getGrpcClient;
    var callServiceApi;

    var _ret = function () {
      checkRequired({ getAllServicesConfig: getAllServicesConfig, sharedServicePath: sharedServicePath }, PACKAGE);

      // var callServiceApi = ({service, eventListener, data}) => new Promise((resolve, reject) => {
      //   if (clientCache[service.url]) var client = clientCache[service.url]
      //   else {
      //     var clientClass = grpc.makeGenericClientConstructor(grpcService)
      //     var client = clientCache[service.url] = new clientClass(service.url, grpc.credentials.createInsecure())
      //   }
      //   var callTimeout = setTimeout(() => {
      //     grpc.closeClient(client)
      //     reject({message: 'Response problems: REQUEST TIMEOUT', service, eventListener, data})
      //   }, eventListener.timeout || 5000)
      //   // DI.log('NET MESSAGE SENDING', {route: eventListener.route, data})
      //   client.message({route: eventListener.route, data}, (error, serviceResponse) => {
      //     clearTimeout(callTimeout)
      //     if (error)reject(error)
      //     resolve(serviceResponse)
      //   })
      // })
      clientCache = {};

      getGrpcClient = function getGrpcClient(netUrl) {
        return new Promise(function (resolve, reject) {
          if (clientCache[netUrl]) resolve(clientCache[netUrl]);else {
            var ClientClass = grpc.makeGenericClientConstructor(grpcService);
            var client = clientCache[netUrl] = new ClientClass(netUrl, grpc.credentials.createInsecure());
            // grpc.waitForClientReady(client, 100000000, (error, response) => {
            //   LOG.debug("waitForClientReady",error, response)
            //   if (error)reject("GRPC cant connect to server "+netUrl)
            //   resolve(client)
            // })
            resolve(client);
          }
        });
      };

      callServiceApi = function callServiceApi(_ref2) {
        var service = _ref2.service,
            eventListenConfig = _ref2.eventListenConfig,
            eventEmitConfig = _ref2.eventEmitConfig,
            data = _ref2.data,
            serviceName = _ref2.serviceName;
        return new Promise(function (resolve, reject) {
          LOG.debug('callServiceApi', service, eventListenConfig, eventEmitConfig, data, serviceName);
          getGrpcClient(service.netUrl).then(function (client) {
            var callTimeout = setTimeout(function () {
              grpc.closeClient(client);
              reject({ message: 'Response problems: REQUEST TIMEOUT', service: service, eventListenConfig: eventListenConfig, eventEmitConfig: eventEmitConfig, data: data, serviceName: serviceName });
            }, eventEmitConfig.timeout || 5000);
            // DI.log('NET MESSAGE SENDING', {route: eventListener.route, data})
            client.message({ method: eventListenConfig.method, data: data }, function (error, serviceResponse) {
              clearTimeout(callTimeout);
              if (error) reject(error);
              resolve(serviceResponse);
            });
          }).catch(function (error) {
            LOG.warn('callServiceApi error', error);
            reject(error);
          });
        });
      };

      var buildServicesRegistry = function buildServicesRegistry() {
        var schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'events.listen.json';

        var services = getAllServicesConfig(schema);
        var listeners = {};
        R.mapObjIndexed(function (service, serviceName) {
          R.mapObjIndexed(function (event, eventName) {
            if (!listeners[eventName]) listeners[eventName] = [];
            listeners[eventName].push({ serviceName: serviceName, event: event, eventName: eventName });
          }, service);
        }, services);
        return listeners;
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
          emit: function emit(name, data) {
            LOG.debug('emit', name, data, sharedServicePath + "/events.emit.json");
            var eventsEmitConfig = require(sharedServicePath + "/events.emit.json");
            if (!eventsEmitConfig[name]) return LOG.warn(name + ' event not defined in ' + eventsEmitConfigFile);
            var eventEmitConfig = eventsEmitConfig[name];

            var eventsListenRegistry = buildServicesRegistry('events.listen.json'); // TO FIX ADD CACHE
            if (!eventsListenRegistry[name] || !eventsListenRegistry[name].length) {
              LOG.warn(name + ' event have no listeners ');
              return false;
            }
            var servicesRegistry = getAllServicesConfig('service.json'); // TO FIX ADD CACHE
            LOG.debug('servicesRegistry', servicesRegistry);
            var waitResponses = [];
            eventsListenRegistry[name].forEach(function (eventListener) {
              var serviceName = eventListener.serviceName;
              var service = servicesRegistry[serviceName];
              var eventListenConfig = eventListener.event;
              var callServiceApiPromise = callServiceApi({ service: service, eventListenConfig: eventListenConfig, eventEmitConfig: eventEmitConfig, data: data, serviceName: serviceName });
              if (eventListenConfig.haveResponse && eventEmitConfig.waitResponse) waitResponses.push(callServiceApiPromise);
            });
            LOG.debug('waitResponses', waitResponses);
            var result;
            if (eventEmitConfig.waitResponse) {
              if (eventEmitConfig.singleResponse) result = waitResponses[0];else result = Promise.all(waitResponses);
            } else {
              result = false;
            }

            LOG.debug('emit result', result);
            return result;
          }
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    LOG.error(PACKAGE, error);
    throw new Error('getNetClientPackage');
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiZ3JwYyIsInpsaWIiLCJMT0ciLCJjb25zb2xlIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJzZXJpYWxpemVkRGF0YUJ5dGUiLCJzZXJpYWxpemVGdW5jdGlvbiIsIm9iaiIsImRpY3Rpb25hcnkiLCJkZWZsYXRlU3luYyIsIkpTT04iLCJzdHJpbmdpZnkiLCJkZXNlcmlhbGl6ZUZ1bmN0aW9uIiwicGFyc2UiLCJpbmZsYXRlU3luYyIsInNlcmlhbGl6ZUpzb24iLCJyZXN1bHQiLCJieXRlTGVuZ3RoIiwiZGVzZXJpYWxpemVKc29uIiwiYnVmZmVyIiwiZ3JwY1NlcnZpY2UiLCJtZXNzYWdlIiwicGF0aCIsInJlcXVlc3RTdHJlYW0iLCJyZXNwb25zZVN0cmVhbSIsInJlcXVlc3RTZXJpYWxpemUiLCJyZXF1ZXN0RGVzZXJpYWxpemUiLCJyZXNwb25zZVNlcmlhbGl6ZSIsInJlc3BvbnNlRGVzZXJpYWxpemUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0TmV0Q2xpZW50UGFja2FnZSIsImdldEFsbFNlcnZpY2VzQ29uZmlnIiwic2hhcmVkU2VydmljZVBhdGgiLCJjbGllbnRDYWNoZSIsImdldEdycGNDbGllbnQiLCJjYWxsU2VydmljZUFwaSIsIm5ldFVybCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiQ2xpZW50Q2xhc3MiLCJtYWtlR2VuZXJpY0NsaWVudENvbnN0cnVjdG9yIiwiY2xpZW50IiwiY3JlZGVudGlhbHMiLCJjcmVhdGVJbnNlY3VyZSIsInNlcnZpY2UiLCJldmVudExpc3RlbkNvbmZpZyIsImV2ZW50RW1pdENvbmZpZyIsImRhdGEiLCJzZXJ2aWNlTmFtZSIsImRlYnVnIiwidGhlbiIsImNhbGxUaW1lb3V0Iiwic2V0VGltZW91dCIsImNsb3NlQ2xpZW50IiwidGltZW91dCIsIm1ldGhvZCIsImVycm9yIiwic2VydmljZVJlc3BvbnNlIiwiY2xlYXJUaW1lb3V0IiwiY2F0Y2giLCJ3YXJuIiwiYnVpbGRTZXJ2aWNlc1JlZ2lzdHJ5Iiwic2NoZW1hIiwic2VydmljZXMiLCJsaXN0ZW5lcnMiLCJtYXBPYmpJbmRleGVkIiwiZXZlbnQiLCJldmVudE5hbWUiLCJwdXNoIiwiZ2V0U2VyaWFsaXplZERhdGFCeXRlIiwicmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJzZXRTZXJpYWxpemVGdW5jdGlvbiIsIm5ld0Z1bmMiLCJzZXREZXNlcmlhbGl6ZUZ1bmN0aW9uIiwiZW1pdCIsIm5hbWUiLCJldmVudHNFbWl0Q29uZmlnIiwiZXZlbnRzRW1pdENvbmZpZ0ZpbGUiLCJldmVudHNMaXN0ZW5SZWdpc3RyeSIsImxlbmd0aCIsInNlcnZpY2VzUmVnaXN0cnkiLCJ3YWl0UmVzcG9uc2VzIiwiZm9yRWFjaCIsImV2ZW50TGlzdGVuZXIiLCJjYWxsU2VydmljZUFwaVByb21pc2UiLCJoYXZlUmVzcG9uc2UiLCJ3YWl0UmVzcG9uc2UiLCJzaW5nbGVSZXNwb25zZSIsImFsbCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlFLE9BQU9GLFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUcsTUFBTUMsT0FBVjtBQUNBLElBQU1DLFVBQVUsWUFBaEI7QUFDQSxJQUFNQyxnQkFBZ0JOLFFBQVEsU0FBUixFQUFtQk0sYUFBekM7O0FBRUE7QUFDQSxJQUFJQyxxQkFBcUIsQ0FBekI7QUFDQSxJQUFJQyxvQkFBb0IsMkJBQUNDLEdBQUQsRUFBTUMsVUFBTjtBQUFBLFNBQXFCUixLQUFLUyxXQUFMLENBQWlCQyxLQUFLQyxTQUFMLENBQWVKLEdBQWYsQ0FBakIsRUFBc0MsRUFBQ0Msc0JBQUQsRUFBdEMsQ0FBckI7QUFBQSxDQUF4QjtBQUNBLElBQUlJLHNCQUFzQiw2QkFBQ0wsR0FBRCxFQUFNQyxVQUFOO0FBQUEsU0FBcUJFLEtBQUtHLEtBQUwsQ0FB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QUFDQSxrQkFBSWtCLHdCQUF3QmxELGVBQWUsRUFBQ1UsZ0JBQUQsRUFBVUMsb0NBQVYsRUFBNkJDLGdDQUE3QixFQUE4Q0MsVUFBOUMsRUFBb0RDLHdCQUFwRCxFQUFmLENBQTVCO0FBQ0Esa0JBQUlILGtCQUFrQndDLFlBQWxCLElBQWtDdkMsZ0JBQWdCd0MsWUFBdEQsRUFBbUVMLGNBQWNiLElBQWQsQ0FBbUJnQixxQkFBbkI7QUFDcEUsYUFORDtBQU9BckYsZ0JBQUlrRCxLQUFKLENBQVUsZUFBVixFQUEyQmdDLGFBQTNCO0FBQ0EsZ0JBQUluRSxNQUFKO0FBQ0EsZ0JBQUlnQyxnQkFBZ0J3QyxZQUFwQixFQUFrQztBQUNoQyxrQkFBSXhDLGdCQUFnQnlDLGNBQXBCLEVBQW9DekUsU0FBU21FLGNBQWMsQ0FBZCxDQUFULENBQXBDLEtBQ0tuRSxTQUFTc0IsUUFBUW9ELEdBQVIsQ0FBWVAsYUFBWixDQUFUO0FBQ04sYUFIRCxNQUdPO0FBQUVuRSx1QkFBUyxLQUFUO0FBQWdCOztBQUV6QmYsZ0JBQUlrRCxLQUFKLENBQVUsYUFBVixFQUF5Qm5DLE1BQXpCO0FBQ0EsbUJBQU9BLE1BQVA7QUFDRDtBQTNDSTtBQUFQO0FBL0RFOztBQUFBO0FBNEdILEdBNUdELENBNEdFLE9BQU8wQyxLQUFQLEVBQWM7QUFDZHpELFFBQUl5RCxLQUFKLENBQVV2RCxPQUFWLEVBQW1CdUQsS0FBbkI7QUFDQSxVQUFNLElBQUlpQyxLQUFKLENBQVUscUJBQVYsQ0FBTjtBQUNEO0FBQ0YsQ0FqSEQiLCJmaWxlIjoibmV0LmNsaWVudC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBncnBjID0gcmVxdWlyZSgnZ3JwYycpXG52YXIgemxpYiA9IHJlcXVpcmUoJ3psaWInKVxudmFyIExPRyA9IGNvbnNvbGVcbmNvbnN0IFBBQ0tBR0UgPSAnbmV0LmNsaWVudCdcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuXG4vLyBNRVNTQUdFIFNFUklBTElaQVRJT05cbnZhciBzZXJpYWxpemVkRGF0YUJ5dGUgPSAwXG52YXIgc2VyaWFsaXplRnVuY3Rpb24gPSAob2JqLCBkaWN0aW9uYXJ5KSA9PiB6bGliLmRlZmxhdGVTeW5jKEpTT04uc3RyaW5naWZ5KG9iaiksIHtkaWN0aW9uYXJ5fSlcbnZhciBkZXNlcmlhbGl6ZUZ1bmN0aW9uID0gKG9iaiwgZGljdGlvbmFyeSkgPT4gSlNPTi5wYXJzZSh6bGliLmluZmxhdGVTeW5jKG9iaiwge2RpY3Rpb25hcnl9KSlcbmZ1bmN0aW9uIHNlcmlhbGl6ZUpzb24gKG9iaikge1xuICB2YXIgcmVzdWx0ID0gc2VyaWFsaXplRnVuY3Rpb24ob2JqKVxuICBzZXJpYWxpemVkRGF0YUJ5dGUgKz0gKHJlc3VsdC5ieXRlTGVuZ3RoKVxuICByZXR1cm4gcmVzdWx0XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUpzb24gKGJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gZGVzZXJpYWxpemVGdW5jdGlvbihidWZmZXIpXG4gIHJldHVybiByZXN1bHRcbn1cbnZhciBncnBjU2VydmljZSA9IHtcbiAgbWVzc2FnZToge1xuICAgIHBhdGg6ICdtZXNzYWdlJyxcbiAgICByZXF1ZXN0U3RyZWFtOiBmYWxzZSxcbiAgICByZXNwb25zZVN0cmVhbTogZmFsc2UsXG4gICAgcmVxdWVzdFNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXF1ZXN0RGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZVNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZURlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb25cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9ICBmdW5jdGlvbiBnZXROZXRDbGllbnRQYWNrYWdlICh7Z2V0QWxsU2VydmljZXNDb25maWcsIHNoYXJlZFNlcnZpY2VQYXRofSkge1xuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe2dldEFsbFNlcnZpY2VzQ29uZmlnLCBzaGFyZWRTZXJ2aWNlUGF0aH0sIFBBQ0tBR0UpXG5cbiAgICAvLyB2YXIgY2FsbFNlcnZpY2VBcGkgPSAoe3NlcnZpY2UsIGV2ZW50TGlzdGVuZXIsIGRhdGF9KSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgLy8gICBpZiAoY2xpZW50Q2FjaGVbc2VydmljZS51cmxdKSB2YXIgY2xpZW50ID0gY2xpZW50Q2FjaGVbc2VydmljZS51cmxdXG4gICAgLy8gICBlbHNlIHtcbiAgICAvLyAgICAgdmFyIGNsaWVudENsYXNzID0gZ3JwYy5tYWtlR2VuZXJpY0NsaWVudENvbnN0cnVjdG9yKGdycGNTZXJ2aWNlKVxuICAgIC8vICAgICB2YXIgY2xpZW50ID0gY2xpZW50Q2FjaGVbc2VydmljZS51cmxdID0gbmV3IGNsaWVudENsYXNzKHNlcnZpY2UudXJsLCBncnBjLmNyZWRlbnRpYWxzLmNyZWF0ZUluc2VjdXJlKCkpXG4gICAgLy8gICB9XG4gICAgLy8gICB2YXIgY2FsbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAvLyAgICAgZ3JwYy5jbG9zZUNsaWVudChjbGllbnQpXG4gICAgLy8gICAgIHJlamVjdCh7bWVzc2FnZTogJ1Jlc3BvbnNlIHByb2JsZW1zOiBSRVFVRVNUIFRJTUVPVVQnLCBzZXJ2aWNlLCBldmVudExpc3RlbmVyLCBkYXRhfSlcbiAgICAvLyAgIH0sIGV2ZW50TGlzdGVuZXIudGltZW91dCB8fCA1MDAwKVxuICAgIC8vICAgLy8gREkubG9nKCdORVQgTUVTU0FHRSBTRU5ESU5HJywge3JvdXRlOiBldmVudExpc3RlbmVyLnJvdXRlLCBkYXRhfSlcbiAgICAvLyAgIGNsaWVudC5tZXNzYWdlKHtyb3V0ZTogZXZlbnRMaXN0ZW5lci5yb3V0ZSwgZGF0YX0sIChlcnJvciwgc2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgLy8gICAgIGNsZWFyVGltZW91dChjYWxsVGltZW91dClcbiAgICAvLyAgICAgaWYgKGVycm9yKXJlamVjdChlcnJvcilcbiAgICAvLyAgICAgcmVzb2x2ZShzZXJ2aWNlUmVzcG9uc2UpXG4gICAgLy8gICB9KVxuICAgIC8vIH0pXG4gICAgdmFyIGNsaWVudENhY2hlID0ge31cbiAgICB2YXIgZ2V0R3JwY0NsaWVudCA9IChuZXRVcmwpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChjbGllbnRDYWNoZVtuZXRVcmxdKXJlc29sdmUoY2xpZW50Q2FjaGVbbmV0VXJsXSlcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgQ2xpZW50Q2xhc3MgPSBncnBjLm1ha2VHZW5lcmljQ2xpZW50Q29uc3RydWN0b3IoZ3JwY1NlcnZpY2UpXG4gICAgICAgIHZhciBjbGllbnQgPSBjbGllbnRDYWNoZVtuZXRVcmxdID0gbmV3IENsaWVudENsYXNzKG5ldFVybCwgZ3JwYy5jcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgICAgICAvLyBncnBjLndhaXRGb3JDbGllbnRSZWFkeShjbGllbnQsIDEwMDAwMDAwMCwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xuICAgICAgICAvLyAgIExPRy5kZWJ1ZyhcIndhaXRGb3JDbGllbnRSZWFkeVwiLGVycm9yLCByZXNwb25zZSlcbiAgICAgICAgLy8gICBpZiAoZXJyb3IpcmVqZWN0KFwiR1JQQyBjYW50IGNvbm5lY3QgdG8gc2VydmVyIFwiK25ldFVybClcbiAgICAgICAgLy8gICByZXNvbHZlKGNsaWVudClcbiAgICAgICAgLy8gfSlcbiAgICAgICAgcmVzb2x2ZShjbGllbnQpXG4gICAgICB9XG4gICAgfSlcbiAgICB2YXIgY2FsbFNlcnZpY2VBcGkgPSAoe3NlcnZpY2UsIGV2ZW50TGlzdGVuQ29uZmlnLCBldmVudEVtaXRDb25maWcsIGRhdGEsIHNlcnZpY2VOYW1lfSkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgTE9HLmRlYnVnKCdjYWxsU2VydmljZUFwaScsIHNlcnZpY2UsIGV2ZW50TGlzdGVuQ29uZmlnLCBldmVudEVtaXRDb25maWcsIGRhdGEsIHNlcnZpY2VOYW1lKVxuICAgICAgZ2V0R3JwY0NsaWVudChzZXJ2aWNlLm5ldFVybCkudGhlbigoY2xpZW50KSA9PiB7XG4gICAgICAgIHZhciBjYWxsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGdycGMuY2xvc2VDbGllbnQoY2xpZW50KVxuICAgICAgICAgIHJlamVjdCh7bWVzc2FnZTogJ1Jlc3BvbnNlIHByb2JsZW1zOiBSRVFVRVNUIFRJTUVPVVQnLCBzZXJ2aWNlLCBldmVudExpc3RlbkNvbmZpZywgZXZlbnRFbWl0Q29uZmlnLCBkYXRhLCBzZXJ2aWNlTmFtZX0pXG4gICAgICAgIH0sIGV2ZW50RW1pdENvbmZpZy50aW1lb3V0IHx8IDUwMDApXG4gICAgICAgIC8vIERJLmxvZygnTkVUIE1FU1NBR0UgU0VORElORycsIHtyb3V0ZTogZXZlbnRMaXN0ZW5lci5yb3V0ZSwgZGF0YX0pXG4gICAgICAgIGNsaWVudC5tZXNzYWdlKHttZXRob2Q6IGV2ZW50TGlzdGVuQ29uZmlnLm1ldGhvZCwgZGF0YX0sIChlcnJvciwgc2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KGNhbGxUaW1lb3V0KVxuICAgICAgICAgIGlmIChlcnJvcilyZWplY3QoZXJyb3IpXG4gICAgICAgICAgcmVzb2x2ZShzZXJ2aWNlUmVzcG9uc2UpXG4gICAgICAgIH0pXG4gICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIExPRy53YXJuKCdjYWxsU2VydmljZUFwaSBlcnJvcicsIGVycm9yKVxuICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICB9KVxuICAgIH0pXG4gICAgY29uc3QgYnVpbGRTZXJ2aWNlc1JlZ2lzdHJ5ID0gKHNjaGVtYSA9ICdldmVudHMubGlzdGVuLmpzb24nKSA9PiB7XG4gICAgICB2YXIgc2VydmljZXMgPSBnZXRBbGxTZXJ2aWNlc0NvbmZpZyhzY2hlbWEpXG4gICAgICB2YXIgbGlzdGVuZXJzID0ge31cbiAgICAgIFIubWFwT2JqSW5kZXhlZCgoc2VydmljZSwgc2VydmljZU5hbWUpID0+IHtcbiAgICAgICAgUi5tYXBPYmpJbmRleGVkKChldmVudCwgZXZlbnROYW1lKSA9PiB7XG4gICAgICAgICAgaWYgKCFsaXN0ZW5lcnNbZXZlbnROYW1lXSlsaXN0ZW5lcnNbZXZlbnROYW1lXSA9IFtdXG4gICAgICAgICAgbGlzdGVuZXJzW2V2ZW50TmFtZV0ucHVzaCh7c2VydmljZU5hbWUsIGV2ZW50LCBldmVudE5hbWV9KVxuICAgICAgICB9LCBzZXJ2aWNlKVxuICAgICAgfSwgc2VydmljZXMpXG4gICAgICByZXR1cm4gbGlzdGVuZXJzXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBnZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICByZXR1cm4gc2VyaWFsaXplZERhdGFCeXRlXG4gICAgICB9LFxuICAgICAgcmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICBzZXJpYWxpemVkRGF0YUJ5dGUgPSAwXG4gICAgICB9LFxuICAgICAgc2V0U2VyaWFsaXplRnVuY3Rpb24gKG5ld0Z1bmMpIHtcbiAgICAgICAgc2VyaWFsaXplRnVuY3Rpb24gPSBuZXdGdW5jXG4gICAgICB9LFxuICAgICAgc2V0RGVzZXJpYWxpemVGdW5jdGlvbiAobmV3RnVuYykge1xuICAgICAgICBkZXNlcmlhbGl6ZUZ1bmN0aW9uID0gbmV3RnVuY1xuICAgICAgfSxcbiAgICAgIGVtaXQgKG5hbWUsIGRhdGEpIHtcbiAgICAgICAgTE9HLmRlYnVnKCdlbWl0JywgbmFtZSwgZGF0YSxzaGFyZWRTZXJ2aWNlUGF0aCtcIi9ldmVudHMuZW1pdC5qc29uXCIpXG4gICAgICAgIHZhciBldmVudHNFbWl0Q29uZmlnID0gcmVxdWlyZShzaGFyZWRTZXJ2aWNlUGF0aCtcIi9ldmVudHMuZW1pdC5qc29uXCIpXG4gICAgICAgIGlmICghZXZlbnRzRW1pdENvbmZpZ1tuYW1lXSkgcmV0dXJuIExPRy53YXJuKG5hbWUgKyAnIGV2ZW50IG5vdCBkZWZpbmVkIGluICcgKyBldmVudHNFbWl0Q29uZmlnRmlsZSlcbiAgICAgICAgdmFyIGV2ZW50RW1pdENvbmZpZyA9IGV2ZW50c0VtaXRDb25maWdbbmFtZV1cblxuICAgICAgICB2YXIgZXZlbnRzTGlzdGVuUmVnaXN0cnkgPSBidWlsZFNlcnZpY2VzUmVnaXN0cnkoJ2V2ZW50cy5saXN0ZW4uanNvbicpIC8vIFRPIEZJWCBBREQgQ0FDSEVcbiAgICAgICAgaWYgKCFldmVudHNMaXN0ZW5SZWdpc3RyeVtuYW1lXSB8fCAhZXZlbnRzTGlzdGVuUmVnaXN0cnlbbmFtZV0ubGVuZ3RoKSB7XG4gICAgICAgICAgTE9HLndhcm4obmFtZSArICcgZXZlbnQgaGF2ZSBubyBsaXN0ZW5lcnMgJylcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICB2YXIgc2VydmljZXNSZWdpc3RyeSA9IGdldEFsbFNlcnZpY2VzQ29uZmlnKCdzZXJ2aWNlLmpzb24nKSAvLyBUTyBGSVggQUREIENBQ0hFXG4gICAgICAgIExPRy5kZWJ1Zygnc2VydmljZXNSZWdpc3RyeScsIHNlcnZpY2VzUmVnaXN0cnkpXG4gICAgICAgIHZhciB3YWl0UmVzcG9uc2VzID0gW11cbiAgICAgICAgZXZlbnRzTGlzdGVuUmVnaXN0cnlbbmFtZV0uZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcikgPT4ge1xuICAgICAgICAgIHZhciBzZXJ2aWNlTmFtZSA9IGV2ZW50TGlzdGVuZXIuc2VydmljZU5hbWVcbiAgICAgICAgICB2YXIgc2VydmljZSA9IHNlcnZpY2VzUmVnaXN0cnlbc2VydmljZU5hbWVdXG4gICAgICAgICAgdmFyIGV2ZW50TGlzdGVuQ29uZmlnID0gZXZlbnRMaXN0ZW5lci5ldmVudFxuICAgICAgICAgIHZhciBjYWxsU2VydmljZUFwaVByb21pc2UgPSBjYWxsU2VydmljZUFwaSh7c2VydmljZSwgZXZlbnRMaXN0ZW5Db25maWcsIGV2ZW50RW1pdENvbmZpZywgZGF0YSwgc2VydmljZU5hbWV9KVxuICAgICAgICAgIGlmIChldmVudExpc3RlbkNvbmZpZy5oYXZlUmVzcG9uc2UgJiYgZXZlbnRFbWl0Q29uZmlnLndhaXRSZXNwb25zZSl3YWl0UmVzcG9uc2VzLnB1c2goY2FsbFNlcnZpY2VBcGlQcm9taXNlKVxuICAgICAgICB9KVxuICAgICAgICBMT0cuZGVidWcoJ3dhaXRSZXNwb25zZXMnLCB3YWl0UmVzcG9uc2VzKVxuICAgICAgICB2YXIgcmVzdWx0XG4gICAgICAgIGlmIChldmVudEVtaXRDb25maWcud2FpdFJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKGV2ZW50RW1pdENvbmZpZy5zaW5nbGVSZXNwb25zZSkgcmVzdWx0ID0gd2FpdFJlc3BvbnNlc1swXVxuICAgICAgICAgIGVsc2UgcmVzdWx0ID0gUHJvbWlzZS5hbGwod2FpdFJlc3BvbnNlcylcbiAgICAgICAgfSBlbHNlIHsgcmVzdWx0ID0gZmFsc2UgfVxuXG4gICAgICAgIExPRy5kZWJ1ZygnZW1pdCByZXN1bHQnLCByZXN1bHQpXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgTE9HLmVycm9yKFBBQ0tBR0UsIGVycm9yKVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0TmV0Q2xpZW50UGFja2FnZScpXG4gIH1cbn1cbiJdfQ==