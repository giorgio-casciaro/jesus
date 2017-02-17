'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var grpc = require('grpc');
var zlib = require('zlib');
var LOG = console;
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
  var netUrl = _ref.netUrl,
      serviceMethodsFile = _ref.serviceMethodsFile;

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
                    // DI.log('NET MESSAGE RECEIVED', call.request)
                    var methodName = call.request.method;
                    var service = require(serviceMethodsFile);
                    if (!service[methodName]) throw methodName + ' is not valid';
                    var method = service[methodName];
                    var data = call.request.data;
                    method(data).then(function (response) {
                      return callback(null, response);
                    }).catch(function (error) {
                      return callback(null, error);
                    });
                  }
                };

                serviceServer = new grpc.Server();
                serviceServer.addService(grpcService, grpcServiceFunctions);
                serviceServer.bind(netUrl, grpc.ServerCredentials.createInsecure());
                serviceServer.start();
                LOG.debug(PACKAGE, 'Net started on port:' + netUrl);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, null, this);
      };

      checkRequired({ netUrl: netUrl, serviceMethodsFile: serviceMethodsFile });

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
    LOG.error(PACKAGE, error);
    throw PACKAGE + ' getNetServerPackage';
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbImdycGMiLCJyZXF1aXJlIiwiemxpYiIsIkxPRyIsImNvbnNvbGUiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsInNlcmlhbGl6ZWREYXRhQnl0ZSIsInNlcmlhbGl6ZUZ1bmN0aW9uIiwib2JqIiwiZGljdGlvbmFyeSIsImRlZmxhdGVTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlc2VyaWFsaXplRnVuY3Rpb24iLCJwYXJzZSIsImluZmxhdGVTeW5jIiwic2VyaWFsaXplSnNvbiIsInJlc3VsdCIsImJ5dGVMZW5ndGgiLCJkZXNlcmlhbGl6ZUpzb24iLCJidWZmZXIiLCJncnBjU2VydmljZSIsIm1lc3NhZ2UiLCJwYXRoIiwicmVxdWVzdFN0cmVhbSIsInJlc3BvbnNlU3RyZWFtIiwicmVxdWVzdFNlcmlhbGl6ZSIsInJlcXVlc3REZXNlcmlhbGl6ZSIsInJlc3BvbnNlU2VyaWFsaXplIiwicmVzcG9uc2VEZXNlcmlhbGl6ZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXROZXRTZXJ2ZXJQYWNrYWdlIiwibmV0VXJsIiwic2VydmljZU1ldGhvZHNGaWxlIiwic2VydmljZVNlcnZlciIsInN0YXJ0IiwiZ3JwY1NlcnZpY2VGdW5jdGlvbnMiLCJjYWxsIiwiY2FsbGJhY2siLCJtZXRob2ROYW1lIiwicmVxdWVzdCIsIm1ldGhvZCIsInNlcnZpY2UiLCJkYXRhIiwidGhlbiIsInJlc3BvbnNlIiwiY2F0Y2giLCJlcnJvciIsIlNlcnZlciIsImFkZFNlcnZpY2UiLCJiaW5kIiwiU2VydmVyQ3JlZGVudGlhbHMiLCJjcmVhdGVJbnNlY3VyZSIsImRlYnVnIiwiZ2V0U2VyaWFsaXplZERhdGFCeXRlIiwicmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJzZXRTZXJpYWxpemVGdW5jdGlvbiIsIm5ld0Z1bmMiLCJzZXREZXNlcmlhbGl6ZUZ1bmN0aW9uIiwic3RvcCIsInRyeVNodXRkb3duIiwicmVzdGFydCJdLCJt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QUFxQkE7QUFBQSxXQUFPO0FBQ0xxQiwrQkFESyxtQ0FDb0I7QUFDdkIsbUJBQU9qRCxrQkFBUDtBQUNELFdBSEk7QUFJTGtELGlDQUpLLHFDQUlzQjtBQUN6QmxELGlDQUFxQixDQUFyQjtBQUNELFdBTkk7QUFPTG1ELDhCQVBLLGdDQU9pQkMsT0FQakIsRUFPMEI7QUFDN0JuRCxnQ0FBb0JtRCxPQUFwQjtBQUNELFdBVEk7QUFVTEMsZ0NBVkssa0NBVW1CRCxPQVZuQixFQVU0QjtBQUMvQjdDLGtDQUFzQjZDLE9BQXRCO0FBQ0QsV0FaSTs7QUFhTHRCLHNCQWJLO0FBY0x3QixjQWRLLGtCQWNHO0FBQ056QiwwQkFBYzBCLFdBQWQsQ0FBMEIsWUFBTSxDQUFFLENBQWxDO0FBQ0QsV0FoQkk7QUFpQkxDLGlCQWpCSyxxQkFpQk07QUFDVDNCLDBCQUFjMEIsV0FBZCxDQUEwQnpCLEtBQTFCO0FBQ0Q7QUFuQkk7QUFBUDtBQXZCRTs7QUFBQTtBQTRDSCxHQTVDRCxDQTRDRSxPQUFPWSxLQUFQLEVBQWM7QUFDZDlDLFFBQUk4QyxLQUFKLENBQVU1QyxPQUFWLEVBQW1CNEMsS0FBbkI7QUFDQSxVQUFNNUMsVUFBVSxzQkFBaEI7QUFDRDtBQUNGLENBakREIiwiZmlsZSI6Im5ldC5zZXJ2ZXIuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdycGMgPSByZXF1aXJlKCdncnBjJylcbnZhciB6bGliID0gcmVxdWlyZSgnemxpYicpXG52YXIgTE9HID0gY29uc29sZVxuY29uc3QgUEFDS0FHRSA9ICduZXQuc2VydmVyJ1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5cbi8vIE1FU1NBR0UgU0VSSUFMSVpBVElPTlxudmFyIHNlcmlhbGl6ZWREYXRhQnl0ZSA9IDBcbnZhciBzZXJpYWxpemVGdW5jdGlvbiA9IChvYmosIGRpY3Rpb25hcnkpID0+IHpsaWIuZGVmbGF0ZVN5bmMoSlNPTi5zdHJpbmdpZnkob2JqKSwge2RpY3Rpb25hcnl9KVxudmFyIGRlc2VyaWFsaXplRnVuY3Rpb24gPSAob2JqLCBkaWN0aW9uYXJ5KSA9PiBKU09OLnBhcnNlKHpsaWIuaW5mbGF0ZVN5bmMob2JqLCB7ZGljdGlvbmFyeX0pKVxuZnVuY3Rpb24gc2VyaWFsaXplSnNvbiAob2JqKSB7XG4gIHZhciByZXN1bHQgPSBzZXJpYWxpemVGdW5jdGlvbihvYmopXG4gIHNlcmlhbGl6ZWREYXRhQnl0ZSArPSAocmVzdWx0LmJ5dGVMZW5ndGgpXG4gIHJldHVybiByZXN1bHRcbn1cbmZ1bmN0aW9uIGRlc2VyaWFsaXplSnNvbiAoYnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBkZXNlcmlhbGl6ZUZ1bmN0aW9uKGJ1ZmZlcilcbiAgcmV0dXJuIHJlc3VsdFxufVxudmFyIGdycGNTZXJ2aWNlID0ge1xuICBtZXNzYWdlOiB7XG4gICAgcGF0aDogJ21lc3NhZ2UnLFxuICAgIHJlcXVlc3RTdHJlYW06IGZhbHNlLFxuICAgIHJlc3BvbnNlU3RyZWFtOiBmYWxzZSxcbiAgICByZXF1ZXN0U2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlcXVlc3REZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlU2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlRGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvblxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TmV0U2VydmVyUGFja2FnZSAoe25ldFVybCwgc2VydmljZU1ldGhvZHNGaWxlfSkge1xuICB0cnkge1xuICAgIHZhciBzZXJ2aWNlU2VydmVyXG4gICAgY2hlY2tSZXF1aXJlZCh7bmV0VXJsLCBzZXJ2aWNlTWV0aG9kc0ZpbGV9KVxuICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAgICAgIHZhciBncnBjU2VydmljZUZ1bmN0aW9ucyA9IHtcbiAgICAgICAgbWVzc2FnZSAoY2FsbCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAvLyBESS5sb2coJ05FVCBNRVNTQUdFIFJFQ0VJVkVEJywgY2FsbC5yZXF1ZXN0KVxuICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gY2FsbC5yZXF1ZXN0Lm1ldGhvZFxuICAgICAgICAgIHZhciBzZXJ2aWNlID0gcmVxdWlyZShzZXJ2aWNlTWV0aG9kc0ZpbGUpXG4gICAgICAgICAgaWYgKCFzZXJ2aWNlW21ldGhvZE5hbWVdKSB0aHJvdyBtZXRob2ROYW1lICsgJyBpcyBub3QgdmFsaWQnXG4gICAgICAgICAgdmFyIG1ldGhvZCA9IHNlcnZpY2VbbWV0aG9kTmFtZV1cbiAgICAgICAgICB2YXIgZGF0YSA9IGNhbGwucmVxdWVzdC5kYXRhXG4gICAgICAgICAgbWV0aG9kKGRhdGEpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UpKVxuICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBjYWxsYmFjayhudWxsLCBlcnJvcikpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNlcnZpY2VTZXJ2ZXIgPSBuZXcgZ3JwYy5TZXJ2ZXIoKVxuICAgICAgc2VydmljZVNlcnZlci5hZGRTZXJ2aWNlKGdycGNTZXJ2aWNlLCBncnBjU2VydmljZUZ1bmN0aW9ucylcbiAgICAgIHNlcnZpY2VTZXJ2ZXIuYmluZChuZXRVcmwsIGdycGMuU2VydmVyQ3JlZGVudGlhbHMuY3JlYXRlSW5zZWN1cmUoKSlcbiAgICAgIHNlcnZpY2VTZXJ2ZXIuc3RhcnQoKVxuICAgICAgTE9HLmRlYnVnKFBBQ0tBR0UsICdOZXQgc3RhcnRlZCBvbiBwb3J0OicgKyBuZXRVcmwpXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBnZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICByZXR1cm4gc2VyaWFsaXplZERhdGFCeXRlXG4gICAgICB9LFxuICAgICAgcmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICBzZXJpYWxpemVkRGF0YUJ5dGUgPSAwXG4gICAgICB9LFxuICAgICAgc2V0U2VyaWFsaXplRnVuY3Rpb24gKG5ld0Z1bmMpIHtcbiAgICAgICAgc2VyaWFsaXplRnVuY3Rpb24gPSBuZXdGdW5jXG4gICAgICB9LFxuICAgICAgc2V0RGVzZXJpYWxpemVGdW5jdGlvbiAobmV3RnVuYykge1xuICAgICAgICBkZXNlcmlhbGl6ZUZ1bmN0aW9uID0gbmV3RnVuY1xuICAgICAgfSxcbiAgICAgIHN0YXJ0LFxuICAgICAgc3RvcCAoKSB7XG4gICAgICAgIHNlcnZpY2VTZXJ2ZXIudHJ5U2h1dGRvd24oKCkgPT4ge30pXG4gICAgICB9LFxuICAgICAgcmVzdGFydCAoKSB7XG4gICAgICAgIHNlcnZpY2VTZXJ2ZXIudHJ5U2h1dGRvd24oc3RhcnQpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIExPRy5lcnJvcihQQUNLQUdFLCBlcnJvcilcbiAgICB0aHJvdyBQQUNLQUdFICsgJyBnZXROZXRTZXJ2ZXJQYWNrYWdlJ1xuICB9XG59XG4iXX0=