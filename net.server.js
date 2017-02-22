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
  }
};

module.exports = function getNetServerPackage(_ref) {
  var serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      netUrl = _ref.netUrl,
      serviceMethodsFile = _ref.serviceMethodsFile,
      sharedServicePath = _ref.sharedServicePath;

  var LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE);
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);
  try {
    var serviceServer;

    var _ret = function () {
      var start = function _callee() {
        var grpcServiceFunctions;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                grpcServiceFunctions = {
                  message: function message(call, callback) {
                    var event = call.request.event;
                    var eventsListenConfig = require(sharedServicePath + '/events.listen.json');
                    if (!eventsListenConfig[event] && !eventsListenConfig['*']) return LOG.warn(netUrl, event + ' event not defined in /events.listen.json');
                    var eventConfig = eventsListenConfig[event] || eventsListenConfig['*'];

                    var serviceName = call.request.serviceName;
                    var methodName = call.request.method;
                    var service = require(serviceMethodsFile);
                    if (!service[methodName]) throw methodName + ' is not valid';
                    var method = service[methodName];
                    var data = call.request.data;
                    var meta = {
                      type: 'netEvent',
                      from: serviceName,
                      event: event,
                      timestamp: Date.now()
                    };
                    LOG.debug('message received ' + methodName, { eventConfig: eventConfig });
                    if (eventConfig.haveResponse) {
                      method(data, meta).then(function (response) {
                        LOG.debug('message response ' + methodName, { response: response });
                        callback(null, response);
                      }).catch(function (error) {
                        LOG.warn('message error ' + methodName, { error: error });
                        callback(null, error);
                      });
                    } else {
                      LOG.debug('message aknowlegment ' + methodName);
                      method(data, meta);
                      callback(null, { aknowlegment: true });
                    }
                  }
                };

                serviceServer = new grpc.Server();
                serviceServer.addService(grpcService, grpcServiceFunctions);
                serviceServer.bind(netUrl, grpc.ServerCredentials.createInsecure());
                serviceServer.start();
                LOG.debug('Net started on port:' + netUrl);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, null, this);
      };

      checkRequired({ serviceName: serviceName, serviceId: serviceId, netUrl: netUrl, serviceMethodsFile: serviceMethodsFile, sharedServicePath: sharedServicePath });

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
    errorThrow('getNetServerPackage', { error: error, netUrl: netUrl, serviceMethodsFile: serviceMethodsFile, sharedServicePath: sharedServicePath });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbImdycGMiLCJyZXF1aXJlIiwiemxpYiIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwic2VyaWFsaXplZERhdGFCeXRlIiwic2VyaWFsaXplRnVuY3Rpb24iLCJvYmoiLCJkaWN0aW9uYXJ5IiwiZGVmbGF0ZVN5bmMiLCJKU09OIiwic3RyaW5naWZ5IiwiZGVzZXJpYWxpemVGdW5jdGlvbiIsInBhcnNlIiwiaW5mbGF0ZVN5bmMiLCJzZXJpYWxpemVKc29uIiwicmVzdWx0IiwiYnl0ZUxlbmd0aCIsImRlc2VyaWFsaXplSnNvbiIsImJ1ZmZlciIsImdycGNTZXJ2aWNlIiwibWVzc2FnZSIsInBhdGgiLCJyZXF1ZXN0U3RyZWFtIiwicmVzcG9uc2VTdHJlYW0iLCJyZXF1ZXN0U2VyaWFsaXplIiwicmVxdWVzdERlc2VyaWFsaXplIiwicmVzcG9uc2VTZXJpYWxpemUiLCJyZXNwb25zZURlc2VyaWFsaXplIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldFNlcnZlclBhY2thZ2UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsIm5ldFVybCIsInNlcnZpY2VNZXRob2RzRmlsZSIsInNoYXJlZFNlcnZpY2VQYXRoIiwiTE9HIiwiZXJyb3JUaHJvdyIsInNlcnZpY2VTZXJ2ZXIiLCJzdGFydCIsImdycGNTZXJ2aWNlRnVuY3Rpb25zIiwiY2FsbCIsImNhbGxiYWNrIiwiZXZlbnQiLCJyZXF1ZXN0IiwiZXZlbnRzTGlzdGVuQ29uZmlnIiwid2FybiIsImV2ZW50Q29uZmlnIiwibWV0aG9kTmFtZSIsIm1ldGhvZCIsInNlcnZpY2UiLCJkYXRhIiwibWV0YSIsInR5cGUiLCJmcm9tIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsImRlYnVnIiwiaGF2ZVJlc3BvbnNlIiwidGhlbiIsInJlc3BvbnNlIiwiY2F0Y2giLCJlcnJvciIsImFrbm93bGVnbWVudCIsIlNlcnZlciIsImFkZFNlcnZpY2UiLCJiaW5kIiwiU2VydmVyQ3JlZGVudGlhbHMiLCJjcmVhdGVJbnNlY3VyZSIsImdldFNlcmlhbGl6ZWREYXRhQnl0ZSIsInJlc2V0U2VyaWFsaXplZERhdGFCeXRlIiwic2V0U2VyaWFsaXplRnVuY3Rpb24iLCJuZXdGdW5jIiwic2V0RGVzZXJpYWxpemVGdW5jdGlvbiIsInN0b3AiLCJ0cnlTaHV0ZG93biIsInJlc3RhcnQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxPQUFPQyxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlDLE9BQU9ELFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBTUUsVUFBVSxZQUFoQjtBQUNBLElBQU1DLGdCQUFnQkgsUUFBUSxTQUFSLEVBQW1CRyxhQUF6Qzs7QUFFQTtBQUNBLElBQUlDLHFCQUFxQixDQUF6QjtBQUNBLElBQUlDLG9CQUFvQiwyQkFBQ0MsR0FBRCxFQUFNQyxVQUFOO0FBQUEsU0FBcUJOLEtBQUtPLFdBQUwsQ0FBaUJDLEtBQUtDLFNBQUwsQ0FBZUosR0FBZixDQUFqQixFQUFzQyxFQUFDQyxzQkFBRCxFQUF0QyxDQUFyQjtBQUFBLENBQXhCO0FBQ0EsSUFBSUksc0JBQXNCLDZCQUFDTCxHQUFELEVBQU1DLFVBQU47QUFBQSxTQUFxQkUsS0FBS0csS0FBTCxDQUFXWCxLQUFLWSxXQUFMLENBQWlCUCxHQUFqQixFQUFzQixFQUFDQyxzQkFBRCxFQUF0QixDQUFYLENBQXJCO0FBQUEsQ0FBMUI7QUFDQSxTQUFTTyxhQUFULENBQXdCUixHQUF4QixFQUE2QjtBQUMzQixNQUFJUyxTQUFTVixrQkFBa0JDLEdBQWxCLENBQWI7QUFDQUYsd0JBQXVCVyxPQUFPQyxVQUE5QjtBQUNBLFNBQU9ELE1BQVA7QUFDRDtBQUNELFNBQVNFLGVBQVQsQ0FBMEJDLE1BQTFCLEVBQWtDO0FBQ2hDLE1BQUlILFNBQVNKLG9CQUFvQk8sTUFBcEIsQ0FBYjtBQUNBLFNBQU9ILE1BQVA7QUFDRDtBQUNELElBQUlJLGNBQWM7QUFDaEJDLFdBQVM7QUFDUEMsVUFBTSxTQURDO0FBRVBDLG1CQUFlLEtBRlI7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ZXIuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdycGMgPSByZXF1aXJlKCdncnBjJylcbnZhciB6bGliID0gcmVxdWlyZSgnemxpYicpXG5jb25zdCBQQUNLQUdFID0gJ25ldC5zZXJ2ZXInXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcblxuLy8gTUVTU0FHRSBTRVJJQUxJWkFUSU9OXG52YXIgc2VyaWFsaXplZERhdGFCeXRlID0gMFxudmFyIHNlcmlhbGl6ZUZ1bmN0aW9uID0gKG9iaiwgZGljdGlvbmFyeSkgPT4gemxpYi5kZWZsYXRlU3luYyhKU09OLnN0cmluZ2lmeShvYmopLCB7ZGljdGlvbmFyeX0pXG52YXIgZGVzZXJpYWxpemVGdW5jdGlvbiA9IChvYmosIGRpY3Rpb25hcnkpID0+IEpTT04ucGFyc2UoemxpYi5pbmZsYXRlU3luYyhvYmosIHtkaWN0aW9uYXJ5fSkpXG5mdW5jdGlvbiBzZXJpYWxpemVKc29uIChvYmopIHtcbiAgdmFyIHJlc3VsdCA9IHNlcmlhbGl6ZUZ1bmN0aW9uKG9iailcbiAgc2VyaWFsaXplZERhdGFCeXRlICs9IChyZXN1bHQuYnl0ZUxlbmd0aClcbiAgcmV0dXJuIHJlc3VsdFxufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVKc29uIChidWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IGRlc2VyaWFsaXplRnVuY3Rpb24oYnVmZmVyKVxuICByZXR1cm4gcmVzdWx0XG59XG52YXIgZ3JwY1NlcnZpY2UgPSB7XG4gIG1lc3NhZ2U6IHtcbiAgICBwYXRoOiAnbWVzc2FnZScsXG4gICAgcmVxdWVzdFN0cmVhbTogZmFsc2UsXG4gICAgcmVzcG9uc2VTdHJlYW06IGZhbHNlLFxuICAgIHJlcXVlc3RTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVxdWVzdERlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VEZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXROZXRTZXJ2ZXJQYWNrYWdlICh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgbmV0VXJsLCBzZXJ2aWNlTWV0aG9kc0ZpbGUsIHNoYXJlZFNlcnZpY2VQYXRofSkge1xuICB2YXIgTE9HID0gcmVxdWlyZSgnLi9qZXN1cycpLkxPRyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB2YXIgZXJyb3JUaHJvdyA9IHJlcXVpcmUoJy4vamVzdXMnKS5lcnJvclRocm93KHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHRyeSB7XG4gICAgdmFyIHNlcnZpY2VTZXJ2ZXJcbiAgICBjaGVja1JlcXVpcmVkKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBuZXRVcmwsIHNlcnZpY2VNZXRob2RzRmlsZSwgc2hhcmVkU2VydmljZVBhdGh9KVxuICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAgICAgIHZhciBncnBjU2VydmljZUZ1bmN0aW9ucyA9IHtcbiAgICAgICAgbWVzc2FnZSAoY2FsbCwgY2FsbGJhY2spIHtcbiAgICAgICAgICB2YXIgZXZlbnQgPSBjYWxsLnJlcXVlc3QuZXZlbnRcbiAgICAgICAgICB2YXIgZXZlbnRzTGlzdGVuQ29uZmlnID0gcmVxdWlyZShzaGFyZWRTZXJ2aWNlUGF0aCArICcvZXZlbnRzLmxpc3Rlbi5qc29uJylcbiAgICAgICAgICBpZiAoIWV2ZW50c0xpc3RlbkNvbmZpZ1tldmVudF0gJiYgIWV2ZW50c0xpc3RlbkNvbmZpZ1snKiddKSByZXR1cm4gTE9HLndhcm4obmV0VXJsLCBldmVudCArICcgZXZlbnQgbm90IGRlZmluZWQgaW4gL2V2ZW50cy5saXN0ZW4uanNvbicpXG4gICAgICAgICAgdmFyIGV2ZW50Q29uZmlnID0gZXZlbnRzTGlzdGVuQ29uZmlnW2V2ZW50XSB8fCBldmVudHNMaXN0ZW5Db25maWdbJyonXVxuXG4gICAgICAgICAgdmFyIHNlcnZpY2VOYW1lID0gY2FsbC5yZXF1ZXN0LnNlcnZpY2VOYW1lXG4gICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBjYWxsLnJlcXVlc3QubWV0aG9kXG4gICAgICAgICAgdmFyIHNlcnZpY2UgPSByZXF1aXJlKHNlcnZpY2VNZXRob2RzRmlsZSlcbiAgICAgICAgICBpZiAoIXNlcnZpY2VbbWV0aG9kTmFtZV0pIHRocm93IG1ldGhvZE5hbWUgKyAnIGlzIG5vdCB2YWxpZCdcbiAgICAgICAgICB2YXIgbWV0aG9kID0gc2VydmljZVttZXRob2ROYW1lXVxuICAgICAgICAgIHZhciBkYXRhID0gY2FsbC5yZXF1ZXN0LmRhdGFcbiAgICAgICAgICB2YXIgbWV0YSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICduZXRFdmVudCcsXG4gICAgICAgICAgICBmcm9tOiBzZXJ2aWNlTmFtZSxcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpXG4gICAgICAgICAgfVxuICAgICAgICAgIExPRy5kZWJ1ZygnbWVzc2FnZSByZWNlaXZlZCAnICsgbWV0aG9kTmFtZSwge2V2ZW50Q29uZmlnfSlcbiAgICAgICAgICBpZiAoZXZlbnRDb25maWcuaGF2ZVJlc3BvbnNlKSB7XG4gICAgICAgICAgICBtZXRob2QoZGF0YSwgbWV0YSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgIExPRy5kZWJ1ZygnbWVzc2FnZSByZXNwb25zZSAnICsgbWV0aG9kTmFtZSwge3Jlc3BvbnNlfSlcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UpXG4gICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgIExPRy53YXJuKCdtZXNzYWdlIGVycm9yICcgKyBtZXRob2ROYW1lLCB7ZXJyb3J9KVxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBlcnJvcilcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIExPRy5kZWJ1ZygnbWVzc2FnZSBha25vd2xlZ21lbnQgJyArIG1ldGhvZE5hbWUpXG4gICAgICAgICAgICBtZXRob2QoZGF0YSwgbWV0YSlcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtha25vd2xlZ21lbnQ6IHRydWV9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2VydmljZVNlcnZlciA9IG5ldyBncnBjLlNlcnZlcigpXG4gICAgICBzZXJ2aWNlU2VydmVyLmFkZFNlcnZpY2UoZ3JwY1NlcnZpY2UsIGdycGNTZXJ2aWNlRnVuY3Rpb25zKVxuICAgICAgc2VydmljZVNlcnZlci5iaW5kKG5ldFVybCwgZ3JwYy5TZXJ2ZXJDcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgICAgc2VydmljZVNlcnZlci5zdGFydCgpXG4gICAgICBMT0cuZGVidWcoJ05ldCBzdGFydGVkIG9uIHBvcnQ6JyArIG5ldFVybClcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNlcmlhbGl6ZWREYXRhQnl0ZSAoKSB7XG4gICAgICAgIHJldHVybiBzZXJpYWxpemVkRGF0YUJ5dGVcbiAgICAgIH0sXG4gICAgICByZXNldFNlcmlhbGl6ZWREYXRhQnl0ZSAoKSB7XG4gICAgICAgIHNlcmlhbGl6ZWREYXRhQnl0ZSA9IDBcbiAgICAgIH0sXG4gICAgICBzZXRTZXJpYWxpemVGdW5jdGlvbiAobmV3RnVuYykge1xuICAgICAgICBzZXJpYWxpemVGdW5jdGlvbiA9IG5ld0Z1bmNcbiAgICAgIH0sXG4gICAgICBzZXREZXNlcmlhbGl6ZUZ1bmN0aW9uIChuZXdGdW5jKSB7XG4gICAgICAgIGRlc2VyaWFsaXplRnVuY3Rpb24gPSBuZXdGdW5jXG4gICAgICB9LFxuICAgICAgc3RhcnQsXG4gICAgICBzdG9wICgpIHtcbiAgICAgICAgc2VydmljZVNlcnZlci50cnlTaHV0ZG93bigoKSA9PiB7fSlcbiAgICAgIH0sXG4gICAgICByZXN0YXJ0ICgpIHtcbiAgICAgICAgc2VydmljZVNlcnZlci50cnlTaHV0ZG93bihzdGFydClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JUaHJvdygnZ2V0TmV0U2VydmVyUGFja2FnZScsIHtlcnJvciwgbmV0VXJsLCBzZXJ2aWNlTWV0aG9kc0ZpbGUsIHNoYXJlZFNlcnZpY2VQYXRofSlcbiAgfVxufVxuIl19