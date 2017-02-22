'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var R = require('ramda');
var grpc = require('grpc');
var zlib = require('zlib');
var PACKAGE = 'net.client';
var checkRequired = require('./jesus').checkRequired;
var checkRequiredFiles = require('./jesus').checkRequiredFiles;

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
  var serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      sharedServicesPath = _ref.sharedServicesPath,
      sharedServicePath = _ref.sharedServicePath;

  var getAllServicesConfig = function getAllServicesConfig(schema) {
    return require('./jesus').getAllServicesConfigFromDir(sharedServicesPath, schema);
  };
  try {
    var LOG;
    var errorThrow;
    var clientCache;
    var getGrpcClient;
    var sendMessage;

    var _ret = function () {
      var emit = function emit(name, data) {
        LOG.debug('emit ' + name, { name: name, data: data, sharedServicePath: sharedServicePath });
        var eventsEmitConfig = require(sharedServicePath + '/events.emit.json');
        if (!eventsEmitConfig[name]) return LOG.warn(name + ' event not defined in /events.emit.json');
        var eventEmitConfig = eventsEmitConfig[name];

        var eventsListenRegistry = buildServicesRegistry('events.listen.json'); // TO FIX ADD CACHE

        var servicesRegistry = getAllServicesConfig('service.json'); // TO FIX ADD CACHE
        //LOG.debug('emit info', {eventEmitConfig, eventsListenRegistry, servicesRegistry})
        var waitResponses = [];
        var eventListeners = [];
        if (eventsListenRegistry[name]) eventListeners = eventListeners.concat(eventsListenRegistry[name]);
        if (eventsListenRegistry['*']) eventListeners = eventListeners.concat(eventsListenRegistry['*']);
        if (!eventListeners.length) {
          LOG.debug(name + ' event have no listeners ');
          return false;
        }
        eventListeners.forEach(function (eventListener) {
          var listenerServiceName = eventListener.serviceName;
          var listenerService = servicesRegistry[listenerServiceName];
          var eventListenConfig = eventListener.event;
          var sendMessagePromise = sendMessage(_defineProperty({ name: name, listenerService: listenerService, listenerServiceName: listenerServiceName, eventListenConfig: eventListenConfig, eventEmitConfig: eventEmitConfig, data: data }, 'listenerServiceName', listenerServiceName));
          if (eventListenConfig.haveResponse && eventEmitConfig.waitResponse) waitResponses.push(sendMessagePromise);
        });
        LOG.debug('emit ' + name + ' waitResponses', waitResponses);
        var result;
        if (eventEmitConfig.waitResponse) {
          if (eventEmitConfig.responseRequired && !waitResponses.length) errorThrow(name + ' event need a response');
          if (eventEmitConfig.singleResponse) result = waitResponses[0];else result = Promise.all(waitResponses);
        } else {
          result = false;
        }

        LOG.debug('emit ' + name + ' results', result);
        return result;
      };

      LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE);
      errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);


      checkRequired({ serviceName: serviceName, serviceId: serviceId, sharedServicesPath: sharedServicesPath, sharedServicePath: sharedServicePath });
      checkRequiredFiles([sharedServicePath + '/events.emit.json']);

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
            listenerService = _ref2.listenerService,
            eventListenConfig = _ref2.eventListenConfig,
            eventEmitConfig = _ref2.eventEmitConfig,
            data = _ref2.data,
            listenerServiceName = _ref2.listenerServiceName;
        return new Promise(function (resolve, reject) {
          LOG.debug('sendMessage ' + name + ' to ' + listenerServiceName, { name: name, listenerService: listenerService, eventListenConfig: eventListenConfig, eventEmitConfig: eventEmitConfig, data: data, listenerServiceName: listenerServiceName });
          getGrpcClient(listenerService.netUrl).then(function (client) {
            // if (eventListenConfig.haveResponse) {
            var callTimeout;
            var call = client.message({ serviceName: serviceName, serviceId: serviceId, event: name, method: eventListenConfig.method, data: data }, function (error, serviceResponse) {
              if (callTimeout) clearTimeout(callTimeout);
              if (error) reject(error);
              resolve(serviceResponse);
            });
            callTimeout = setTimeout(function () {
              // client.$channel.close()
              // grpc.closeClient(client)
              call.cancel();
              LOG.warn('sendMessage timeout ' + name + ' to ' + listenerServiceName, { serviceName: serviceName, listenerService: listenerService, timeout: eventEmitConfig.timeout });
              // grpc.closeClient(client)
              if (eventListenConfig.haveResponse) reject({ message: 'Response problems: REQUEST TIMEOUT', listenerService: listenerService, eventListenConfig: eventListenConfig, eventEmitConfig: eventEmitConfig, data: data, listenerServiceName: listenerServiceName });else resolve();
            }, eventListenConfig.timeout || 5000);
            // }
            // DI.log('NET MESSAGE SENDING', {route: eventListener.route, data})
            // var deadline = 10000000000
            // deadline.setSeconds(deadline.getSeconds() + 100000)
            // var deadline = Infinity

            // if (!eventListenConfig.haveResponse)resolve()
          }).catch(function (error) {
            LOG.warn('sendMessage error' + name + ' to ' + listenerServiceName, error);
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

          emit: emit
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    errorThrow('getNetClientPackage', { error: error, getAllServicesConfig: getAllServicesConfig, sharedServicePath: sharedServicePath, serviceName: serviceName });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiZ3JwYyIsInpsaWIiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsImNoZWNrUmVxdWlyZWRGaWxlcyIsInNlcmlhbGl6ZWREYXRhQnl0ZSIsInNlcmlhbGl6ZUZ1bmN0aW9uIiwib2JqIiwiZGljdGlvbmFyeSIsImRlZmxhdGVTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlc2VyaWFsaXplRnVuY3Rpb24iLCJwYXJzZSIsImluZmxhdGVTeW5jIiwic2VyaWFsaXplSnNvbiIsInJlc3VsdCIsImJ5dGVMZW5ndGgiLCJkZXNlcmlhbGl6ZUpzb24iLCJidWZmZXIiLCJncnBjU2VydmljZSIsIm1lc3NhZ2UiLCJwYXRoIiwicmVxdWVzdFN0cmVhbSIsInJlc3BvbnNlU3RyZWFtIiwicmVxdWVzdFNlcmlhbGl6ZSIsInJlcXVlc3REZXNlcmlhbGl6ZSIsInJlc3BvbnNlU2VyaWFsaXplIiwicmVzcG9uc2VEZXNlcmlhbGl6ZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXROZXRDbGllbnRQYWNrYWdlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJzaGFyZWRTZXJ2aWNlc1BhdGgiLCJzaGFyZWRTZXJ2aWNlUGF0aCIsImdldEFsbFNlcnZpY2VzQ29uZmlnIiwic2NoZW1hIiwiZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyIiwiTE9HIiwiZXJyb3JUaHJvdyIsImNsaWVudENhY2hlIiwiZ2V0R3JwY0NsaWVudCIsInNlbmRNZXNzYWdlIiwiZW1pdCIsIm5hbWUiLCJkYXRhIiwiZGVidWciLCJldmVudHNFbWl0Q29uZmlnIiwid2FybiIsImV2ZW50RW1pdENvbmZpZyIsImV2ZW50c0xpc3RlblJlZ2lzdHJ5IiwiYnVpbGRTZXJ2aWNlc1JlZ2lzdHJ5Iiwic2VydmljZXNSZWdpc3RyeSIsIndhaXRSZXNwb25zZXMiLCJldmVudExpc3RlbmVycyIsImNvbmNhdCIsImxlbmd0aCIsImZvckVhY2giLCJldmVudExpc3RlbmVyIiwibGlzdGVuZXJTZXJ2aWNlTmFtZSIsImxpc3RlbmVyU2VydmljZSIsImV2ZW50TGlzdGVuQ29uZmlnIiwiZXZlbnQiLCJzZW5kTWVzc2FnZVByb21pc2UiLCJoYXZlUmVzcG9uc2UiLCJ3YWl0UmVzcG9uc2UiLCJwdXNoIiwicmVzcG9uc2VSZXF1aXJlZCIsInNpbmdsZVJlc3BvbnNlIiwiUHJvbWlzZSIsImFsbCIsIm5ldFVybCIsInJlc29sdmUiLCJyZWplY3QiLCJjbGllbnQiLCJDbGllbnRDbGFzcyIsIm1ha2VHZW5lcmljQ2xpZW50Q29uc3RydWN0b3IiLCJjcmVkZW50aWFscyIsImNyZWF0ZUluc2VjdXJlIiwidGhlbiIsImNhbGxUaW1lb3V0IiwiY2FsbCIsIm1ldGhvZCIsImVycm9yIiwic2VydmljZVJlc3BvbnNlIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImNhbmNlbCIsInRpbWVvdXQiLCJjYXRjaCIsInNlcnZpY2VzIiwibGlzdGVuZXJzIiwibWFwT2JqSW5kZXhlZCIsInNlcnZpY2UiLCJldmVudE5hbWUiLCJnZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJyZXNldFNlcmlhbGl6ZWREYXRhQnl0ZSIsInNldFNlcmlhbGl6ZUZ1bmN0aW9uIiwibmV3RnVuYyIsInNldERlc2VyaWFsaXplRnVuY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBSUMsT0FBT0QsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJRSxPQUFPRixRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQU1HLFVBQVUsWUFBaEI7QUFDQSxJQUFNQyxnQkFBZ0JKLFFBQVEsU0FBUixFQUFtQkksYUFBekM7QUFDQSxJQUFNQyxxQkFBcUJMLFFBQVEsU0FBUixFQUFtQkssa0JBQTlDOztBQUVBO0FBQ0EsSUFBSUMscUJBQXFCLENBQXpCO0FBQ0EsSUFBSUMsb0JBQW9CLDJCQUFDQyxHQUFELEVBQU1DLFVBQU47QUFBQSxT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QyxZQUFELEVBQVFoRCwwQ0FBUixFQUE4QkQsb0NBQTlCLEVBQWlESCx3QkFBakQsRUFBbEM7QUFDRDtBQUNGLENBdEhEIiwiZmlsZSI6Im5ldC5jbGllbnQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgZ3JwYyA9IHJlcXVpcmUoJ2dycGMnKVxudmFyIHpsaWIgPSByZXF1aXJlKCd6bGliJylcbmNvbnN0IFBBQ0tBR0UgPSAnbmV0LmNsaWVudCdcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuY29uc3QgY2hlY2tSZXF1aXJlZEZpbGVzID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRGaWxlc1xuXG4vLyBNRVNTQUdFIFNFUklBTElaQVRJT05cbnZhciBzZXJpYWxpemVkRGF0YUJ5dGUgPSAwXG52YXIgc2VyaWFsaXplRnVuY3Rpb24gPSAob2JqLCBkaWN0aW9uYXJ5KSA9PiB6bGliLmRlZmxhdGVTeW5jKEpTT04uc3RyaW5naWZ5KG9iaiksIHtkaWN0aW9uYXJ5fSlcbnZhciBkZXNlcmlhbGl6ZUZ1bmN0aW9uID0gKG9iaiwgZGljdGlvbmFyeSkgPT4gSlNPTi5wYXJzZSh6bGliLmluZmxhdGVTeW5jKG9iaiwge2RpY3Rpb25hcnl9KSlcbmZ1bmN0aW9uIHNlcmlhbGl6ZUpzb24gKG9iaikge1xuICB2YXIgcmVzdWx0ID0gc2VyaWFsaXplRnVuY3Rpb24ob2JqKVxuICBzZXJpYWxpemVkRGF0YUJ5dGUgKz0gKHJlc3VsdC5ieXRlTGVuZ3RoKVxuICByZXR1cm4gcmVzdWx0XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUpzb24gKGJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gZGVzZXJpYWxpemVGdW5jdGlvbihidWZmZXIpXG4gIHJldHVybiByZXN1bHRcbn1cbnZhciBncnBjU2VydmljZSA9IHtcbiAgbWVzc2FnZToge1xuICAgIHBhdGg6ICdtZXNzYWdlJyxcbiAgICByZXF1ZXN0U3RyZWFtOiBmYWxzZSxcbiAgICByZXNwb25zZVN0cmVhbTogZmFsc2UsXG4gICAgcmVxdWVzdFNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXF1ZXN0RGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZVNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZURlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb25cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE5ldENsaWVudFBhY2thZ2UgKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBzaGFyZWRTZXJ2aWNlc1BhdGgsIHNoYXJlZFNlcnZpY2VQYXRofSkge1xuICB2YXIgZ2V0QWxsU2VydmljZXNDb25maWcgPSAoc2NoZW1hKSA9PiByZXF1aXJlKCcuL2plc3VzJykuZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyKHNoYXJlZFNlcnZpY2VzUGF0aCwgc2NoZW1hKVxuICB0cnkge1xuICAgIHZhciBMT0cgPSByZXF1aXJlKCcuL2plc3VzJykuTE9HKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gICAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG4gICAgY2hlY2tSZXF1aXJlZCh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgc2hhcmVkU2VydmljZXNQYXRoLCBzaGFyZWRTZXJ2aWNlUGF0aH0pXG4gICAgY2hlY2tSZXF1aXJlZEZpbGVzKFtzaGFyZWRTZXJ2aWNlUGF0aCArICcvZXZlbnRzLmVtaXQuanNvbiddKVxuXG4gICAgdmFyIGNsaWVudENhY2hlID0ge31cbiAgICB2YXIgZ2V0R3JwY0NsaWVudCA9IChuZXRVcmwpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHZhciBjbGllbnRcbiAgICAgIGlmIChjbGllbnRDYWNoZVtuZXRVcmxdKWNsaWVudCA9Y2xpZW50Q2FjaGVbbmV0VXJsXVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBDbGllbnRDbGFzcyA9IGdycGMubWFrZUdlbmVyaWNDbGllbnRDb25zdHJ1Y3RvcihncnBjU2VydmljZSlcbiAgICAgICAgIGNsaWVudCA9IGNsaWVudENhY2hlW25ldFVybF0gPSBuZXcgQ2xpZW50Q2xhc3MobmV0VXJsLCBncnBjLmNyZWRlbnRpYWxzLmNyZWF0ZUluc2VjdXJlKCkpXG4gICAgICB9XG4gICAgICBMT0cuZGVidWcoJ2dldEdycGNDbGllbnQgJywgY2xpZW50KVxuICAgICAgcmVzb2x2ZShjbGllbnQpXG4gICAgfSlcbiAgICB2YXIgc2VuZE1lc3NhZ2UgPSAoe25hbWUsIGxpc3RlbmVyU2VydmljZSwgZXZlbnRMaXN0ZW5Db25maWcsIGV2ZW50RW1pdENvbmZpZywgZGF0YSwgbGlzdGVuZXJTZXJ2aWNlTmFtZX0pID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIExPRy5kZWJ1Zygnc2VuZE1lc3NhZ2UgJyArIG5hbWUgKyAnIHRvICcgKyBsaXN0ZW5lclNlcnZpY2VOYW1lLCB7bmFtZSwgbGlzdGVuZXJTZXJ2aWNlLCBldmVudExpc3RlbkNvbmZpZywgZXZlbnRFbWl0Q29uZmlnLCBkYXRhLCBsaXN0ZW5lclNlcnZpY2VOYW1lfSlcbiAgICAgIGdldEdycGNDbGllbnQobGlzdGVuZXJTZXJ2aWNlLm5ldFVybCkudGhlbigoY2xpZW50KSA9PiB7XG4gICAgICAgIC8vIGlmIChldmVudExpc3RlbkNvbmZpZy5oYXZlUmVzcG9uc2UpIHtcbiAgICAgICAgdmFyIGNhbGxUaW1lb3V0XG4gICAgICAgIHZhciBjYWxsID0gY2xpZW50Lm1lc3NhZ2UoeyBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBldmVudDogbmFtZSwgbWV0aG9kOiBldmVudExpc3RlbkNvbmZpZy5tZXRob2QsIGRhdGF9LCAoZXJyb3IsIHNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmIChjYWxsVGltZW91dCljbGVhclRpbWVvdXQoY2FsbFRpbWVvdXQpXG4gICAgICAgICAgaWYgKGVycm9yKXJlamVjdChlcnJvcilcbiAgICAgICAgICByZXNvbHZlKHNlcnZpY2VSZXNwb25zZSlcbiAgICAgICAgfSlcbiAgICAgICAgY2FsbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBjbGllbnQuJGNoYW5uZWwuY2xvc2UoKVxuICAgICAgICAgIC8vIGdycGMuY2xvc2VDbGllbnQoY2xpZW50KVxuICAgICAgICAgIGNhbGwuY2FuY2VsKClcbiAgICAgICAgICBMT0cud2Fybignc2VuZE1lc3NhZ2UgdGltZW91dCAnICsgbmFtZSArICcgdG8gJyArIGxpc3RlbmVyU2VydmljZU5hbWUsIHtzZXJ2aWNlTmFtZSwgbGlzdGVuZXJTZXJ2aWNlLCB0aW1lb3V0OiBldmVudEVtaXRDb25maWcudGltZW91dH0pXG4gICAgICAgICAgICAvLyBncnBjLmNsb3NlQ2xpZW50KGNsaWVudClcbiAgICAgICAgICBpZiAoZXZlbnRMaXN0ZW5Db25maWcuaGF2ZVJlc3BvbnNlKXJlamVjdCh7bWVzc2FnZTogJ1Jlc3BvbnNlIHByb2JsZW1zOiBSRVFVRVNUIFRJTUVPVVQnLCBsaXN0ZW5lclNlcnZpY2UsIGV2ZW50TGlzdGVuQ29uZmlnLCBldmVudEVtaXRDb25maWcsIGRhdGEsIGxpc3RlbmVyU2VydmljZU5hbWV9KVxuICAgICAgICAgIGVsc2UgcmVzb2x2ZSgpXG4gICAgICAgIH0sIGV2ZW50TGlzdGVuQ29uZmlnLnRpbWVvdXR8fDUwMDApXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gREkubG9nKCdORVQgTUVTU0FHRSBTRU5ESU5HJywge3JvdXRlOiBldmVudExpc3RlbmVyLnJvdXRlLCBkYXRhfSlcbiAgICAgICAgLy8gdmFyIGRlYWRsaW5lID0gMTAwMDAwMDAwMDBcbiAgICAgICAgLy8gZGVhZGxpbmUuc2V0U2Vjb25kcyhkZWFkbGluZS5nZXRTZWNvbmRzKCkgKyAxMDAwMDApXG4gICAgICAgIC8vIHZhciBkZWFkbGluZSA9IEluZmluaXR5XG5cbiAgICAgICAgLy8gaWYgKCFldmVudExpc3RlbkNvbmZpZy5oYXZlUmVzcG9uc2UpcmVzb2x2ZSgpXG4gICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIExPRy53YXJuKCdzZW5kTWVzc2FnZSBlcnJvcicgKyBuYW1lICsgJyB0byAnICsgbGlzdGVuZXJTZXJ2aWNlTmFtZSwgZXJyb3IpXG4gICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIH0pXG4gICAgfSlcbiAgICBjb25zdCBidWlsZFNlcnZpY2VzUmVnaXN0cnkgPSAoc2NoZW1hID0gJ2V2ZW50cy5saXN0ZW4uanNvbicpID0+IHtcbiAgICAgIHZhciBzZXJ2aWNlcyA9IGdldEFsbFNlcnZpY2VzQ29uZmlnKHNjaGVtYSlcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSB7fVxuICAgICAgUi5tYXBPYmpJbmRleGVkKChzZXJ2aWNlLCBzZXJ2aWNlTmFtZSkgPT4ge1xuICAgICAgICBSLm1hcE9iakluZGV4ZWQoKGV2ZW50LCBldmVudE5hbWUpID0+IHtcbiAgICAgICAgICBpZiAoIWxpc3RlbmVyc1tldmVudE5hbWVdKWxpc3RlbmVyc1tldmVudE5hbWVdID0gW11cbiAgICAgICAgICBsaXN0ZW5lcnNbZXZlbnROYW1lXS5wdXNoKHtzZXJ2aWNlTmFtZSwgZXZlbnQsIGV2ZW50TmFtZX0pXG4gICAgICAgIH0sIHNlcnZpY2UpXG4gICAgICB9LCBzZXJ2aWNlcylcbiAgICAgIHJldHVybiBsaXN0ZW5lcnNcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbWl0IChuYW1lLCBkYXRhKSB7XG4gICAgICBMT0cuZGVidWcoJ2VtaXQgJyArIG5hbWUsIHtuYW1lLCBkYXRhLCBzaGFyZWRTZXJ2aWNlUGF0aH0pXG4gICAgICB2YXIgZXZlbnRzRW1pdENvbmZpZyA9IHJlcXVpcmUoc2hhcmVkU2VydmljZVBhdGggKyAnL2V2ZW50cy5lbWl0Lmpzb24nKVxuICAgICAgaWYgKCFldmVudHNFbWl0Q29uZmlnW25hbWVdKSByZXR1cm4gTE9HLndhcm4obmFtZSArICcgZXZlbnQgbm90IGRlZmluZWQgaW4gL2V2ZW50cy5lbWl0Lmpzb24nKVxuICAgICAgdmFyIGV2ZW50RW1pdENvbmZpZyA9IGV2ZW50c0VtaXRDb25maWdbbmFtZV1cblxuICAgICAgdmFyIGV2ZW50c0xpc3RlblJlZ2lzdHJ5ID0gYnVpbGRTZXJ2aWNlc1JlZ2lzdHJ5KCdldmVudHMubGlzdGVuLmpzb24nKSAvLyBUTyBGSVggQUREIENBQ0hFXG5cbiAgICAgIHZhciBzZXJ2aWNlc1JlZ2lzdHJ5ID0gZ2V0QWxsU2VydmljZXNDb25maWcoJ3NlcnZpY2UuanNvbicpIC8vIFRPIEZJWCBBREQgQ0FDSEVcbiAgICAgIC8vTE9HLmRlYnVnKCdlbWl0IGluZm8nLCB7ZXZlbnRFbWl0Q29uZmlnLCBldmVudHNMaXN0ZW5SZWdpc3RyeSwgc2VydmljZXNSZWdpc3RyeX0pXG4gICAgICB2YXIgd2FpdFJlc3BvbnNlcyA9IFtdXG4gICAgICB2YXIgZXZlbnRMaXN0ZW5lcnMgPSBbXVxuICAgICAgaWYgKGV2ZW50c0xpc3RlblJlZ2lzdHJ5W25hbWVdKWV2ZW50TGlzdGVuZXJzID0gZXZlbnRMaXN0ZW5lcnMuY29uY2F0KGV2ZW50c0xpc3RlblJlZ2lzdHJ5W25hbWVdKVxuICAgICAgaWYgKGV2ZW50c0xpc3RlblJlZ2lzdHJ5WycqJ10pZXZlbnRMaXN0ZW5lcnMgPSBldmVudExpc3RlbmVycy5jb25jYXQoZXZlbnRzTGlzdGVuUmVnaXN0cnlbJyonXSlcbiAgICAgIGlmICghZXZlbnRMaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICAgIExPRy5kZWJ1ZyhuYW1lICsgJyBldmVudCBoYXZlIG5vIGxpc3RlbmVycyAnKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGV2ZW50TGlzdGVuZXJzLmZvckVhY2goKGV2ZW50TGlzdGVuZXIpID0+IHtcbiAgICAgICAgdmFyIGxpc3RlbmVyU2VydmljZU5hbWUgPSBldmVudExpc3RlbmVyLnNlcnZpY2VOYW1lXG4gICAgICAgIHZhciBsaXN0ZW5lclNlcnZpY2UgPSBzZXJ2aWNlc1JlZ2lzdHJ5W2xpc3RlbmVyU2VydmljZU5hbWVdXG4gICAgICAgIHZhciBldmVudExpc3RlbkNvbmZpZyA9IGV2ZW50TGlzdGVuZXIuZXZlbnRcbiAgICAgICAgdmFyIHNlbmRNZXNzYWdlUHJvbWlzZSA9IHNlbmRNZXNzYWdlKHtuYW1lLCBsaXN0ZW5lclNlcnZpY2UsIGxpc3RlbmVyU2VydmljZU5hbWUsIGV2ZW50TGlzdGVuQ29uZmlnLCBldmVudEVtaXRDb25maWcsIGRhdGEsIGxpc3RlbmVyU2VydmljZU5hbWV9KVxuICAgICAgICBpZiAoZXZlbnRMaXN0ZW5Db25maWcuaGF2ZVJlc3BvbnNlICYmIGV2ZW50RW1pdENvbmZpZy53YWl0UmVzcG9uc2Upd2FpdFJlc3BvbnNlcy5wdXNoKHNlbmRNZXNzYWdlUHJvbWlzZSlcbiAgICAgIH0pXG4gICAgICBMT0cuZGVidWcoJ2VtaXQgJyArIG5hbWUgKycgd2FpdFJlc3BvbnNlcycsIHdhaXRSZXNwb25zZXMpXG4gICAgICB2YXIgcmVzdWx0XG4gICAgICBpZiAoZXZlbnRFbWl0Q29uZmlnLndhaXRSZXNwb25zZSkge1xuICAgICAgICBpZiAoZXZlbnRFbWl0Q29uZmlnLnJlc3BvbnNlUmVxdWlyZWQgJiYgIXdhaXRSZXNwb25zZXMubGVuZ3RoKSBlcnJvclRocm93KG5hbWUgKyAnIGV2ZW50IG5lZWQgYSByZXNwb25zZScpXG4gICAgICAgIGlmIChldmVudEVtaXRDb25maWcuc2luZ2xlUmVzcG9uc2UpIHJlc3VsdCA9IHdhaXRSZXNwb25zZXNbMF1cbiAgICAgICAgZWxzZSByZXN1bHQgPSBQcm9taXNlLmFsbCh3YWl0UmVzcG9uc2VzKVxuICAgICAgfSBlbHNlIHsgcmVzdWx0ID0gZmFsc2UgfVxuXG4gICAgICBMT0cuZGVidWcoJ2VtaXQgJyArIG5hbWUgKycgcmVzdWx0cycsIHJlc3VsdClcbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0U2VyaWFsaXplZERhdGFCeXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZWREYXRhQnl0ZVxuICAgICAgfSxcbiAgICAgIHJlc2V0U2VyaWFsaXplZERhdGFCeXRlICgpIHtcbiAgICAgICAgc2VyaWFsaXplZERhdGFCeXRlID0gMFxuICAgICAgfSxcbiAgICAgIHNldFNlcmlhbGl6ZUZ1bmN0aW9uIChuZXdGdW5jKSB7XG4gICAgICAgIHNlcmlhbGl6ZUZ1bmN0aW9uID0gbmV3RnVuY1xuICAgICAgfSxcbiAgICAgIHNldERlc2VyaWFsaXplRnVuY3Rpb24gKG5ld0Z1bmMpIHtcbiAgICAgICAgZGVzZXJpYWxpemVGdW5jdGlvbiA9IG5ld0Z1bmNcbiAgICAgIH0sXG4gICAgICBlbWl0XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVycm9yVGhyb3coJ2dldE5ldENsaWVudFBhY2thZ2UnLCB7ZXJyb3IsIGdldEFsbFNlcnZpY2VzQ29uZmlnLCBzaGFyZWRTZXJ2aWNlUGF0aCwgc2VydmljZU5hbWV9KVxuICB9XG59XG4iXX0=