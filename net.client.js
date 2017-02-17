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

      clientCache = {};

      getGrpcClient = function getGrpcClient(netUrl) {
        return new Promise(function (resolve, reject) {
          if (clientCache[netUrl]) resolve(clientCache[netUrl]);else {
            var ClientClass = grpc.makeGenericClientConstructor(grpcService);
            var client = clientCache[netUrl] = new ClientClass(netUrl, grpc.credentials.createInsecure());
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
          LOG.debug(PACKAGE, 'callServiceApi', { service: service, eventListenConfig: eventListenConfig, eventEmitConfig: eventEmitConfig, data: data, serviceName: serviceName });
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
            LOG.warn(PACKAGE, 'callServiceApi error', error);
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
            LOG.debug(PACKAGE, 'emit', { name: name, data: data, sharedServicePath: sharedServicePath });
            var eventsEmitConfig = require(sharedServicePath + '/events.emit.json');
            if (!eventsEmitConfig[name]) return LOG.warn(name + ' event not defined in ' + eventsEmitConfigFile);
            var eventEmitConfig = eventsEmitConfig[name];

            var eventsListenRegistry = buildServicesRegistry('events.listen.json'); // TO FIX ADD CACHE
            if (!eventsListenRegistry[name] || !eventsListenRegistry[name].length) {
              LOG.warn(PACKAGE, name + ' event have no listeners ');
              return false;
            }
            var servicesRegistry = getAllServicesConfig('service.json'); // TO FIX ADD CACHE
            LOG.debug(PACKAGE, 'servicesRegistry', servicesRegistry);
            var waitResponses = [];
            eventsListenRegistry[name].forEach(function (eventListener) {
              var serviceName = eventListener.serviceName;
              var service = servicesRegistry[serviceName];
              var eventListenConfig = eventListener.event;
              var callServiceApiPromise = callServiceApi({ service: service, eventListenConfig: eventListenConfig, eventEmitConfig: eventEmitConfig, data: data, serviceName: serviceName });
              if (eventListenConfig.haveResponse && eventEmitConfig.waitResponse) waitResponses.push(callServiceApiPromise);
            });
            LOG.debug(PACKAGE, 'waitResponses', waitResponses);
            var result;
            if (eventEmitConfig.waitResponse) {
              if (eventEmitConfig.singleResponse) result = waitResponses[0];else result = Promise.all(waitResponses);
            } else {
              result = false;
            }

            LOG.debug(PACKAGE, 'emit result', result);
            return result;
          }
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    LOG.error(PACKAGE, error);
    throw PACKAGE + ' getNetClientPackage';
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiZ3JwYyIsInpsaWIiLCJMT0ciLCJjb25zb2xlIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJzZXJpYWxpemVkRGF0YUJ5dGUiLCJzZXJpYWxpemVGdW5jdGlvbiIsIm9iaiIsImRpY3Rpb25hcnkiLCJkZWZsYXRlU3luYyIsIkpTT04iLCJzdHJpbmdpZnkiLCJkZXNlcmlhbGl6ZUZ1bmN0aW9uIiwicGFyc2UiLCJpbmZsYXRlU3luYyIsInNlcmlhbGl6ZUpzb24iLCJyZXN1bHQiLCJieXRlTGVuZ3RoIiwiZGVzZXJpYWxpemVKc29uIiwiYnVmZmVyIiwiZ3JwY1NlcnZpY2UiLCJtZXNzYWdlIiwicGF0aCIsInJlcXVlc3RTdHJlYW0iLCJyZXNwb25zZVN0cmVhbSIsInJlcXVlc3RTZXJpYWxpemUiLCJyZXF1ZXN0RGVzZXJpYWxpemUiLCJyZXNwb25zZVNlcmlhbGl6ZSIsInJlc3BvbnNlRGVzZXJpYWxpemUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0TmV0Q2xpZW50UGFja2FnZSIsImdldEFsbFNlcnZpY2VzQ29uZmlnIiwic2hhcmVkU2VydmljZVBhdGgiLCJjbGllbnRDYWNoZSIsImdldEdycGNDbGllbnQiLCJjYWxsU2VydmljZUFwaSIsIm5ldFVybCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiQ2xpZW50Q2xhc3MiLCJtYWtlR2VuZXJpY0NsaWVudENvbnN0cnVjdG9yIiwiY2xpZW50IiwiY3JlZGVudGlhbHMiLCJjcmVhdGVJbnNlY3VyZSIsInNlcnZpY2UiLCJldmVudExpc3RlbkNvbmZpZyIsImV2ZW50RW1pdENvbmZpZyIsImRhdGEiLCJzZXJ2aWNlTmFtZSIsImRlYnVnIiwidGhlbiIsImNhbGxUaW1lb3V0Iiwic2V0VGltZW91dCIsImNsb3NlQ2xpZW50IiwidGltZW91dCIsIm1ldGhvZCIsImVycm9yIiwic2VydmljZVJlc3BvbnNlIiwiY2xlYXJUaW1lb3V0IiwiY2F0Y2giLCJ3YXJuIiwiYnVpbGRTZXJ2aWNlc1JlZ2lzdHJ5Iiwic2NoZW1hIiwic2VydmljZXMiLCJsaXN0ZW5lcnMiLCJtYXBPYmpJbmRleGVkIiwiZXZlbnQiLCJldmVudE5hbWUiLCJwdXNoIiwiZ2V0U2VyaWFsaXplZERhdGFCeXRlIiwicmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJzZXRTZXJpYWxpemVGdW5jdGlvbiIsIm5ld0Z1bmMiLCJzZXREZXNlcmlhbGl6ZUZ1bmN0aW9uIiwiZW1pdCIsIm5hbWUiLCJldmVudHNFbWl0Q29uZmlnIiwiZXZlbnRzRW1pdENvbmZpZ0ZpbGUiLCJldmVudHNMaXN0ZW5SZWdpc3RyeSIsImxlbmd0aCIsInNlcnZpY2VzUmVnaXN0cnkiLCJ3YWl0UmVzcG9uc2VzIiwiZm9yRWFjaCIsImV2ZW50TGlzdGVuZXIiLCJjYWxsU2VydmljZUFwaVByb21pc2UiLCJoYXZlUmVzcG9uc2UiLCJ3YWl0UmVzcG9uc2UiLCJzaW5nbGVSZXNwb25zZSIsImFsbCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBSUMsT0FBT0QsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJRSxPQUFPRixRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlHLE1BQU1DLE9BQVY7QUFDQSxJQUFNQyxVQUFVLFlBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCTixRQUFRLFNBQVIsRUFBbUJNLGFBQXpDOztBQUVBO0FBQ0EsSUFBSUMscUJBQXFCLENBQXpCO0FBQ0EsSUFBSUMsb0JBQW9CLDJCQUFDQyxHQUFELEVBQU1DLFVBQU47QUFBQSxTQUFxQlIsS0FBS1MsV0FBTCxDQUFpQkMsS0FBS0MsU0FBTCxDQUFlSixHQUFmLENBQWpCLEVBQXNDLEVBQUNDLHNCQUFELEVBQXRDLENBQXJCO0FBQUEsQ0FBeEI7QUFDQSxJQUFJSSxzQkFBc0IsNkJBQUNMLEdBQUQsRUFBTUMsVUFBTjtBQUFBLFNBQXFCRSxLQUFLRyxLQUFMLENBQVdiLEtBQUtj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QUFWLEVBQTZCQyxnQ0FBN0IsRUFBOENDLFVBQTlDLEVBQW9EQyx3QkFBcEQsRUFBZixDQUE1QjtBQUNBLGtCQUFJSCxrQkFBa0J3QyxZQUFsQixJQUFrQ3ZDLGdCQUFnQndDLFlBQXRELEVBQW1FTCxjQUFjYixJQUFkLENBQW1CZ0IscUJBQW5CO0FBQ3BFLGFBTkQ7QUFPQXJGLGdCQUFJa0QsS0FBSixDQUFVaEQsT0FBVixFQUFtQixlQUFuQixFQUFvQ2dGLGFBQXBDO0FBQ0EsZ0JBQUluRSxNQUFKO0FBQ0EsZ0JBQUlnQyxnQkFBZ0J3QyxZQUFwQixFQUFrQztBQUNoQyxrQkFBSXhDLGdCQUFnQnlDLGNBQXBCLEVBQW9DekUsU0FBU21FLGNBQWMsQ0FBZCxDQUFULENBQXBDLEtBQ0tuRSxTQUFTc0IsUUFBUW9ELEdBQVIsQ0FBWVAsYUFBWixDQUFUO0FBQ04sYUFIRCxNQUdPO0FBQUVuRSx1QkFBUyxLQUFUO0FBQWdCOztBQUV6QmYsZ0JBQUlrRCxLQUFKLENBQVVoRCxPQUFWLEVBQW1CLGFBQW5CLEVBQWtDYSxNQUFsQztBQUNBLG1CQUFPQSxNQUFQO0FBQ0Q7QUEzQ0k7QUFBUDtBQXpDRTs7QUFBQTtBQXNGSCxHQXRGRCxDQXNGRSxPQUFPMEMsS0FBUCxFQUFjO0FBQ2R6RCxRQUFJeUQsS0FBSixDQUFVdkQsT0FBVixFQUFtQnVELEtBQW5CO0FBQ0EsVUFBTXZELFVBQVUsc0JBQWhCO0FBQ0Q7QUFDRixDQTNGRCIsImZpbGUiOiJuZXQuY2xpZW50LmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIGdycGMgPSByZXF1aXJlKCdncnBjJylcbnZhciB6bGliID0gcmVxdWlyZSgnemxpYicpXG52YXIgTE9HID0gY29uc29sZVxuY29uc3QgUEFDS0FHRSA9ICduZXQuY2xpZW50J1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5cbi8vIE1FU1NBR0UgU0VSSUFMSVpBVElPTlxudmFyIHNlcmlhbGl6ZWREYXRhQnl0ZSA9IDBcbnZhciBzZXJpYWxpemVGdW5jdGlvbiA9IChvYmosIGRpY3Rpb25hcnkpID0+IHpsaWIuZGVmbGF0ZVN5bmMoSlNPTi5zdHJpbmdpZnkob2JqKSwge2RpY3Rpb25hcnl9KVxudmFyIGRlc2VyaWFsaXplRnVuY3Rpb24gPSAob2JqLCBkaWN0aW9uYXJ5KSA9PiBKU09OLnBhcnNlKHpsaWIuaW5mbGF0ZVN5bmMob2JqLCB7ZGljdGlvbmFyeX0pKVxuZnVuY3Rpb24gc2VyaWFsaXplSnNvbiAob2JqKSB7XG4gIHZhciByZXN1bHQgPSBzZXJpYWxpemVGdW5jdGlvbihvYmopXG4gIHNlcmlhbGl6ZWREYXRhQnl0ZSArPSAocmVzdWx0LmJ5dGVMZW5ndGgpXG4gIHJldHVybiByZXN1bHRcbn1cbmZ1bmN0aW9uIGRlc2VyaWFsaXplSnNvbiAoYnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBkZXNlcmlhbGl6ZUZ1bmN0aW9uKGJ1ZmZlcilcbiAgcmV0dXJuIHJlc3VsdFxufVxudmFyIGdycGNTZXJ2aWNlID0ge1xuICBtZXNzYWdlOiB7XG4gICAgcGF0aDogJ21lc3NhZ2UnLFxuICAgIHJlcXVlc3RTdHJlYW06IGZhbHNlLFxuICAgIHJlc3BvbnNlU3RyZWFtOiBmYWxzZSxcbiAgICByZXF1ZXN0U2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlcXVlc3REZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlU2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlRGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvblxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TmV0Q2xpZW50UGFja2FnZSAoe2dldEFsbFNlcnZpY2VzQ29uZmlnLCBzaGFyZWRTZXJ2aWNlUGF0aH0pIHtcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHtnZXRBbGxTZXJ2aWNlc0NvbmZpZywgc2hhcmVkU2VydmljZVBhdGh9LCBQQUNLQUdFKVxuXG4gICAgdmFyIGNsaWVudENhY2hlID0ge31cbiAgICB2YXIgZ2V0R3JwY0NsaWVudCA9IChuZXRVcmwpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChjbGllbnRDYWNoZVtuZXRVcmxdKXJlc29sdmUoY2xpZW50Q2FjaGVbbmV0VXJsXSlcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgQ2xpZW50Q2xhc3MgPSBncnBjLm1ha2VHZW5lcmljQ2xpZW50Q29uc3RydWN0b3IoZ3JwY1NlcnZpY2UpXG4gICAgICAgIHZhciBjbGllbnQgPSBjbGllbnRDYWNoZVtuZXRVcmxdID0gbmV3IENsaWVudENsYXNzKG5ldFVybCwgZ3JwYy5jcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgICAgICByZXNvbHZlKGNsaWVudClcbiAgICAgIH1cbiAgICB9KVxuICAgIHZhciBjYWxsU2VydmljZUFwaSA9ICh7c2VydmljZSwgZXZlbnRMaXN0ZW5Db25maWcsIGV2ZW50RW1pdENvbmZpZywgZGF0YSwgc2VydmljZU5hbWV9KSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBMT0cuZGVidWcoUEFDS0FHRSwgJ2NhbGxTZXJ2aWNlQXBpJywge3NlcnZpY2UsIGV2ZW50TGlzdGVuQ29uZmlnLCBldmVudEVtaXRDb25maWcsIGRhdGEsIHNlcnZpY2VOYW1lfSlcbiAgICAgIGdldEdycGNDbGllbnQoc2VydmljZS5uZXRVcmwpLnRoZW4oKGNsaWVudCkgPT4ge1xuICAgICAgICB2YXIgY2FsbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBncnBjLmNsb3NlQ2xpZW50KGNsaWVudClcbiAgICAgICAgICByZWplY3Qoe21lc3NhZ2U6ICdSZXNwb25zZSBwcm9ibGVtczogUkVRVUVTVCBUSU1FT1VUJywgc2VydmljZSwgZXZlbnRMaXN0ZW5Db25maWcsIGV2ZW50RW1pdENvbmZpZywgZGF0YSwgc2VydmljZU5hbWV9KVxuICAgICAgICB9LCBldmVudEVtaXRDb25maWcudGltZW91dCB8fCA1MDAwKVxuICAgICAgICAvLyBESS5sb2coJ05FVCBNRVNTQUdFIFNFTkRJTkcnLCB7cm91dGU6IGV2ZW50TGlzdGVuZXIucm91dGUsIGRhdGF9KVxuICAgICAgICBjbGllbnQubWVzc2FnZSh7bWV0aG9kOiBldmVudExpc3RlbkNvbmZpZy5tZXRob2QsIGRhdGF9LCAoZXJyb3IsIHNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGNsZWFyVGltZW91dChjYWxsVGltZW91dClcbiAgICAgICAgICBpZiAoZXJyb3IpcmVqZWN0KGVycm9yKVxuICAgICAgICAgIHJlc29sdmUoc2VydmljZVJlc3BvbnNlKVxuICAgICAgICB9KVxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBMT0cud2FybihQQUNLQUdFLCAnY2FsbFNlcnZpY2VBcGkgZXJyb3InLCBlcnJvcilcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfSlcbiAgICB9KVxuICAgIGNvbnN0IGJ1aWxkU2VydmljZXNSZWdpc3RyeSA9IChzY2hlbWEgPSAnZXZlbnRzLmxpc3Rlbi5qc29uJykgPT4ge1xuICAgICAgdmFyIHNlcnZpY2VzID0gZ2V0QWxsU2VydmljZXNDb25maWcoc2NoZW1hKVxuICAgICAgdmFyIGxpc3RlbmVycyA9IHt9XG4gICAgICBSLm1hcE9iakluZGV4ZWQoKHNlcnZpY2UsIHNlcnZpY2VOYW1lKSA9PiB7XG4gICAgICAgIFIubWFwT2JqSW5kZXhlZCgoZXZlbnQsIGV2ZW50TmFtZSkgPT4ge1xuICAgICAgICAgIGlmICghbGlzdGVuZXJzW2V2ZW50TmFtZV0pbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXVxuICAgICAgICAgIGxpc3RlbmVyc1tldmVudE5hbWVdLnB1c2goe3NlcnZpY2VOYW1lLCBldmVudCwgZXZlbnROYW1lfSlcbiAgICAgICAgfSwgc2VydmljZSlcbiAgICAgIH0sIHNlcnZpY2VzKVxuICAgICAgcmV0dXJuIGxpc3RlbmVyc1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0U2VyaWFsaXplZERhdGFCeXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZWREYXRhQnl0ZVxuICAgICAgfSxcbiAgICAgIHJlc2V0U2VyaWFsaXplZERhdGFCeXRlICgpIHtcbiAgICAgICAgc2VyaWFsaXplZERhdGFCeXRlID0gMFxuICAgICAgfSxcbiAgICAgIHNldFNlcmlhbGl6ZUZ1bmN0aW9uIChuZXdGdW5jKSB7XG4gICAgICAgIHNlcmlhbGl6ZUZ1bmN0aW9uID0gbmV3RnVuY1xuICAgICAgfSxcbiAgICAgIHNldERlc2VyaWFsaXplRnVuY3Rpb24gKG5ld0Z1bmMpIHtcbiAgICAgICAgZGVzZXJpYWxpemVGdW5jdGlvbiA9IG5ld0Z1bmNcbiAgICAgIH0sXG4gICAgICBlbWl0IChuYW1lLCBkYXRhKSB7XG4gICAgICAgIExPRy5kZWJ1ZyhQQUNLQUdFLCAnZW1pdCcsIHtuYW1lLCBkYXRhLCBzaGFyZWRTZXJ2aWNlUGF0aH0pXG4gICAgICAgIHZhciBldmVudHNFbWl0Q29uZmlnID0gcmVxdWlyZShzaGFyZWRTZXJ2aWNlUGF0aCArICcvZXZlbnRzLmVtaXQuanNvbicpXG4gICAgICAgIGlmICghZXZlbnRzRW1pdENvbmZpZ1tuYW1lXSkgcmV0dXJuIExPRy53YXJuKG5hbWUgKyAnIGV2ZW50IG5vdCBkZWZpbmVkIGluICcgKyBldmVudHNFbWl0Q29uZmlnRmlsZSlcbiAgICAgICAgdmFyIGV2ZW50RW1pdENvbmZpZyA9IGV2ZW50c0VtaXRDb25maWdbbmFtZV1cblxuICAgICAgICB2YXIgZXZlbnRzTGlzdGVuUmVnaXN0cnkgPSBidWlsZFNlcnZpY2VzUmVnaXN0cnkoJ2V2ZW50cy5saXN0ZW4uanNvbicpIC8vIFRPIEZJWCBBREQgQ0FDSEVcbiAgICAgICAgaWYgKCFldmVudHNMaXN0ZW5SZWdpc3RyeVtuYW1lXSB8fCAhZXZlbnRzTGlzdGVuUmVnaXN0cnlbbmFtZV0ubGVuZ3RoKSB7XG4gICAgICAgICAgTE9HLndhcm4oUEFDS0FHRSwgbmFtZSArICcgZXZlbnQgaGF2ZSBubyBsaXN0ZW5lcnMgJylcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICB2YXIgc2VydmljZXNSZWdpc3RyeSA9IGdldEFsbFNlcnZpY2VzQ29uZmlnKCdzZXJ2aWNlLmpzb24nKSAvLyBUTyBGSVggQUREIENBQ0hFXG4gICAgICAgIExPRy5kZWJ1ZyhQQUNLQUdFLCAnc2VydmljZXNSZWdpc3RyeScsIHNlcnZpY2VzUmVnaXN0cnkpXG4gICAgICAgIHZhciB3YWl0UmVzcG9uc2VzID0gW11cbiAgICAgICAgZXZlbnRzTGlzdGVuUmVnaXN0cnlbbmFtZV0uZm9yRWFjaCgoZXZlbnRMaXN0ZW5lcikgPT4ge1xuICAgICAgICAgIHZhciBzZXJ2aWNlTmFtZSA9IGV2ZW50TGlzdGVuZXIuc2VydmljZU5hbWVcbiAgICAgICAgICB2YXIgc2VydmljZSA9IHNlcnZpY2VzUmVnaXN0cnlbc2VydmljZU5hbWVdXG4gICAgICAgICAgdmFyIGV2ZW50TGlzdGVuQ29uZmlnID0gZXZlbnRMaXN0ZW5lci5ldmVudFxuICAgICAgICAgIHZhciBjYWxsU2VydmljZUFwaVByb21pc2UgPSBjYWxsU2VydmljZUFwaSh7c2VydmljZSwgZXZlbnRMaXN0ZW5Db25maWcsIGV2ZW50RW1pdENvbmZpZywgZGF0YSwgc2VydmljZU5hbWV9KVxuICAgICAgICAgIGlmIChldmVudExpc3RlbkNvbmZpZy5oYXZlUmVzcG9uc2UgJiYgZXZlbnRFbWl0Q29uZmlnLndhaXRSZXNwb25zZSl3YWl0UmVzcG9uc2VzLnB1c2goY2FsbFNlcnZpY2VBcGlQcm9taXNlKVxuICAgICAgICB9KVxuICAgICAgICBMT0cuZGVidWcoUEFDS0FHRSwgJ3dhaXRSZXNwb25zZXMnLCB3YWl0UmVzcG9uc2VzKVxuICAgICAgICB2YXIgcmVzdWx0XG4gICAgICAgIGlmIChldmVudEVtaXRDb25maWcud2FpdFJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKGV2ZW50RW1pdENvbmZpZy5zaW5nbGVSZXNwb25zZSkgcmVzdWx0ID0gd2FpdFJlc3BvbnNlc1swXVxuICAgICAgICAgIGVsc2UgcmVzdWx0ID0gUHJvbWlzZS5hbGwod2FpdFJlc3BvbnNlcylcbiAgICAgICAgfSBlbHNlIHsgcmVzdWx0ID0gZmFsc2UgfVxuXG4gICAgICAgIExPRy5kZWJ1ZyhQQUNLQUdFLCAnZW1pdCByZXN1bHQnLCByZXN1bHQpXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgTE9HLmVycm9yKFBBQ0tBR0UsIGVycm9yKVxuICAgIHRocm93IFBBQ0tBR0UgKyAnIGdldE5ldENsaWVudFBhY2thZ2UnXG4gIH1cbn1cbiJdfQ==