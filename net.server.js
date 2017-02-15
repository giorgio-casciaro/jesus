'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
                    if (!service[methodName]) throw new Error(methodName + ' is not valid');
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
                LOG.debug('Net started on port:', netUrl);

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
    throw new Error('getNetServerPackage');
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbImdycGMiLCJyZXF1aXJlIiwiemxpYiIsIkxPRyIsImNvbnNvbGUiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsInNlcmlhbGl6ZWREYXRhQnl0ZSIsInNlcmlhbGl6ZUZ1bmN0aW9uIiwib2JqIiwiZGljdGlvbmFyeSIsImRlZmxhdGVTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlc2VyaWFsaXplRnVuY3Rpb24iLCJwYXJzZSIsImluZmxhdGVTeW5jIiwic2VyaWFsaXplSnNvbiIsInJlc3VsdCIsImJ5dGVMZW5ndGgiLCJkZXNlcmlhbGl6ZUpzb24iLCJidWZmZXIiLCJncnBjU2VydmljZSIsIm1lc3NhZ2UiLCJwYXRoIiwicmVxdWVzdFN0cmVhbSIsInJlc3BvbnNlU3RyZWFtIiwicmVxdWVzdFNlcmlhbGl6ZSIsInJlcXVlc3REZXNlcmlhbGl6ZSIsInJlc3BvbnNlU2VyaWFsaXplIiwicmVzcG9uc2VEZXNlcmlhbGl6ZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXROZXRTZXJ2ZXJQYWNrYWdlIiwibmV0VXJsIiwic2VydmljZU1ldGhvZHNGaWxlIiwic2VydmljZVNlcnZlciIsInN0YXJ0IiwiZ3JwY1NlcnZpY2VGdW5jdGlvbnMiLCJjYWxsIiwiY2FsbGJhY2siLCJtZXRob2ROYW1lIiwicmVxdWVzdCIsIm1ldGhvZCIsInNlcnZpY2UiLCJFcnJvciIsImRhdGEiLCJ0aGVuIiwicmVzcG9uc2UiLCJjYXRjaCIsImVycm9yIiwiU2VydmVyIiwiYWRkU2VydmljZSIsImJpbmQiLCJTZXJ2ZXJDcmVkZW50aWFscyIsImNyZWF0ZUluc2VjdXJlIiwiZGVidWciLCJnZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJyZXNldFNlcmlhbGl6ZWREYXRhQnl0ZSIsInNldFNlcmlhbGl6ZUZ1bmN0aW9uIiwibmV3RnVuYyIsInNldERlc2VyaWFsaXplRnVuY3Rpb24iLCJzdG9wIiwidHJ5U2h1dGRvd24iLCJyZXN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlFLE1BQU1DLE9BQVY7QUFDQSxJQUFNQyxVQUFVLFlBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCTCxRQUFRLFNBQVIsRUFBbUJLLGFBQXpDOztBQUVBO0FBQ0EsSUFBSUMscUJBQXFCLENBQXpCO0FBQ0EsSUFBSUMsb0JBQW9CLDJCQUFDQyxHQUFELEVBQU1DLFVBQU47QUFBQSxTQUFxQlIsS0FBS1MsV0FBTCxDQUFpQkMsS0FBS0MsU0FBTCxDQUFlSixHQUFmLENBQWpCLEVBQXNDLEVBQUNDLHNCQUFELEVBQXRDLENBQXJCO0FBQUEsQ0FBeEI7QUFDQSxJQUFJSSxzQkFBc0IsNkJBQUNMLEdBQUQsRUFBTUMsVUFBTjtBQUFBLFNBQXFCRSxLQUFLRyxLQUFMLENBQVdiLEtBQUtjLFdBQUwsQ0FBaUJQLEdBQWpCLEVBQXNCLEVBQUNDLHNCQUFELEVBQXRCLENBQVgsQ0FBckI7QUFBQSxDQUExQjtBQUNBLFNBQVNPLGFBQVQsQ0FBd0JSLEdBQXhCLEVBQTZCO0FBQzNCLE1BQUlTLFNBQVNWLGtCQUFrQkMsR0FBbEIsQ0FBYjtBQUNBRix3QkFBdUJXLE9BQU9DLFVBQTlCO0FBQ0EsU0FBT0QsTUFBUDtBQUNEO0FBQ0QsU0FBU0UsZUFBVCxDQUEwQkMsTUFBMUIsRUFBa0M7QUFDaEMsTUFBSUgsU0FBU0osb0JBQW9CTyxNQUFwQixDQUFiO0FBQ0EsU0FBT0gsTUFBUDtBQUNEO0FBQ0QsSUFBSUksY0FBYztBQUNoQkMsV0FBUztBQUNQQyxVQUFNLFNBREM7QUFFUEMsbUJBQWUsS0FGUjtBQUdQQyxvQkFBZ0IsS0FIVDtBQUlQQyxzQkFBa0JWLGFBSlg7QUFLUFcsd0JBQW9CUixlQUxiO0FBTVBTLHVCQUFtQlosYUFOWjtBQU9QYSx5QkFBcUJWO0FBUGQ7QUFETyxDQUFsQjs7QUFZQVcsT0FBT0MsT0FBUCxHQUFpQixTQUFTQyxtQkFBVCxPQUE0RDtBQUFBLE1BQTdCQyxNQUE2QixRQUE3QkEsTUFBNkI7QUFBQSxNQUFyQkMsa0JBQXFCLFFBQXJCQSxrQkFBcUI7O0FBQzNFLE1BQUk7QUFBQSxRQUNFQyxhQURGOztBQUFBO0FBQUEsVUFHYUMsS0FIYixHQUdGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNNQyxvQ0FETixHQUM2QjtBQUN6QmYseUJBRHlCLG1CQUNoQmdCLElBRGdCLEVBQ1ZDLFFBRFUsRUFDQTtBQUN2QjtBQUNBLHdCQUFJQyxhQUFhRixLQUFLRyxPQUFMLENBQWFDLE1BQTlCO0FBQ0Esd0JBQUlDLFVBQVUzQyxRQUFRa0Msa0JBQVIsQ0FBZDtBQUNBLHdCQUFJLENBQUNTLFFBQVFILFVBQVIsQ0FBTCxFQUEwQixNQUFNLElBQUlJLEtBQUosQ0FBVUosYUFBYSxlQUF2QixDQUFOO0FBQzFCLHdCQUFJRSxTQUFTQyxRQUFRSCxVQUFSLENBQWI7QUFDQSx3QkFBSUssT0FBT1AsS0FBS0csT0FBTCxDQUFhSSxJQUF4QjtBQUNBSCwyQkFBT0csSUFBUCxFQUNDQyxJQURELENBQ007QUFBQSw2QkFBWVAsU0FBUyxJQUFULEVBQWVRLFFBQWYsQ0FBWjtBQUFBLHFCQUROLEVBRUNDLEtBRkQsQ0FFTztBQUFBLDZCQUFTVCxTQUFTLElBQVQsRUFBZVUsS0FBZixDQUFUO0FBQUEscUJBRlA7QUFHRDtBQVh3QixpQkFEN0I7O0FBY0VkLGdDQUFnQixJQUFJcEMsS0FBS21ELE1BQVQsRUFBaEI7QUFDQWYsOEJBQWNnQixVQUFkLENBQXlCOUIsV0FBekIsRUFBc0NnQixvQkFBdEM7QUFDQUYsOEJBQWNpQixJQUFkLENBQW1CbkIsTUFBbkIsRUFBMkJsQyxLQUFLc0QsaUJBQUwsQ0FBdUJDLGNBQXZCLEVBQTNCO0FBQ0FuQiw4QkFBY0MsS0FBZDtBQUNBbEMsb0JBQUlxRCxLQUFKLENBQVUsc0JBQVYsRUFBa0N0QixNQUFsQzs7QUFsQkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FIRTs7QUFFRjVCLG9CQUFjLEVBQUM0QixjQUFELEVBQVNDLHNDQUFULEVBQWQ7O0FBcUJBO0FBQUEsV0FBTztBQUNMc0IsK0JBREssbUNBQ29CO0FBQ3ZCLG1CQUFPbEQsa0JBQVA7QUFDRCxXQUhJO0FBSUxtRCxpQ0FKSyxxQ0FJc0I7QUFDekJuRCxpQ0FBcUIsQ0FBckI7QUFDRCxXQU5JO0FBT0xvRCw4QkFQSyxnQ0FPaUJDLE9BUGpCLEVBTzBCO0FBQzdCcEQsZ0NBQW9Cb0QsT0FBcEI7QUFDRCxXQVRJO0FBVUxDLGdDQVZLLGtDQVVtQkQsT0FWbkIsRUFVNEI7QUFDL0I5QyxrQ0FBc0I4QyxPQUF0QjtBQUNELFdBWkk7O0FBYUx2QixzQkFiSztBQWNMeUIsY0FkSyxrQkFjRztBQUNOMUIsMEJBQWMyQixXQUFkLENBQTBCLFlBQU0sQ0FBRSxDQUFsQztBQUNELFdBaEJJO0FBaUJMQyxpQkFqQksscUJBaUJNO0FBQ1Q1QiwwQkFBYzJCLFdBQWQsQ0FBMEIxQixLQUExQjtBQUNEO0FBbkJJO0FBQVA7QUF2QkU7O0FBQUE7QUE0Q0gsR0E1Q0QsQ0E0Q0UsT0FBT2EsS0FBUCxFQUFjO0FBQ2QvQyxRQUFJK0MsS0FBSixDQUFVN0MsT0FBVixFQUFtQjZDLEtBQW5CO0FBQ0EsVUFBTSxJQUFJTCxLQUFKLENBQVUscUJBQVYsQ0FBTjtBQUNEO0FBQ0YsQ0FqREQiLCJmaWxlIjoibmV0LnNlcnZlci5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ3JwYyA9IHJlcXVpcmUoJ2dycGMnKVxudmFyIHpsaWIgPSByZXF1aXJlKCd6bGliJylcbnZhciBMT0cgPSBjb25zb2xlXG5jb25zdCBQQUNLQUdFID0gJ25ldC5jbGllbnQnXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcblxuLy8gTUVTU0FHRSBTRVJJQUxJWkFUSU9OXG52YXIgc2VyaWFsaXplZERhdGFCeXRlID0gMFxudmFyIHNlcmlhbGl6ZUZ1bmN0aW9uID0gKG9iaiwgZGljdGlvbmFyeSkgPT4gemxpYi5kZWZsYXRlU3luYyhKU09OLnN0cmluZ2lmeShvYmopLCB7ZGljdGlvbmFyeX0pXG52YXIgZGVzZXJpYWxpemVGdW5jdGlvbiA9IChvYmosIGRpY3Rpb25hcnkpID0+IEpTT04ucGFyc2UoemxpYi5pbmZsYXRlU3luYyhvYmosIHtkaWN0aW9uYXJ5fSkpXG5mdW5jdGlvbiBzZXJpYWxpemVKc29uIChvYmopIHtcbiAgdmFyIHJlc3VsdCA9IHNlcmlhbGl6ZUZ1bmN0aW9uKG9iailcbiAgc2VyaWFsaXplZERhdGFCeXRlICs9IChyZXN1bHQuYnl0ZUxlbmd0aClcbiAgcmV0dXJuIHJlc3VsdFxufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVKc29uIChidWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IGRlc2VyaWFsaXplRnVuY3Rpb24oYnVmZmVyKVxuICByZXR1cm4gcmVzdWx0XG59XG52YXIgZ3JwY1NlcnZpY2UgPSB7XG4gIG1lc3NhZ2U6IHtcbiAgICBwYXRoOiAnbWVzc2FnZScsXG4gICAgcmVxdWVzdFN0cmVhbTogZmFsc2UsXG4gICAgcmVzcG9uc2VTdHJlYW06IGZhbHNlLFxuICAgIHJlcXVlc3RTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVxdWVzdERlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VEZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXROZXRTZXJ2ZXJQYWNrYWdlICh7bmV0VXJsLCBzZXJ2aWNlTWV0aG9kc0ZpbGV9KSB7XG4gIHRyeSB7XG4gICAgdmFyIHNlcnZpY2VTZXJ2ZXJcbiAgICBjaGVja1JlcXVpcmVkKHtuZXRVcmwsIHNlcnZpY2VNZXRob2RzRmlsZX0pXG4gICAgYXN5bmMgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgdmFyIGdycGNTZXJ2aWNlRnVuY3Rpb25zID0ge1xuICAgICAgICBtZXNzYWdlIChjYWxsLCBjYWxsYmFjaykge1xuICAgICAgICAgIC8vIERJLmxvZygnTkVUIE1FU1NBR0UgUkVDRUlWRUQnLCBjYWxsLnJlcXVlc3QpXG4gICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBjYWxsLnJlcXVlc3QubWV0aG9kXG4gICAgICAgICAgdmFyIHNlcnZpY2UgPSByZXF1aXJlKHNlcnZpY2VNZXRob2RzRmlsZSlcbiAgICAgICAgICBpZiAoIXNlcnZpY2VbbWV0aG9kTmFtZV0pIHRocm93IG5ldyBFcnJvcihtZXRob2ROYW1lICsgJyBpcyBub3QgdmFsaWQnKVxuICAgICAgICAgIHZhciBtZXRob2QgPSBzZXJ2aWNlW21ldGhvZE5hbWVdXG4gICAgICAgICAgdmFyIGRhdGEgPSBjYWxsLnJlcXVlc3QuZGF0YVxuICAgICAgICAgIG1ldGhvZChkYXRhKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKSlcbiAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY2FsbGJhY2sobnVsbCwgZXJyb3IpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXJ2aWNlU2VydmVyID0gbmV3IGdycGMuU2VydmVyKClcbiAgICAgIHNlcnZpY2VTZXJ2ZXIuYWRkU2VydmljZShncnBjU2VydmljZSwgZ3JwY1NlcnZpY2VGdW5jdGlvbnMpXG4gICAgICBzZXJ2aWNlU2VydmVyLmJpbmQobmV0VXJsLCBncnBjLlNlcnZlckNyZWRlbnRpYWxzLmNyZWF0ZUluc2VjdXJlKCkpXG4gICAgICBzZXJ2aWNlU2VydmVyLnN0YXJ0KClcbiAgICAgIExPRy5kZWJ1ZygnTmV0IHN0YXJ0ZWQgb24gcG9ydDonLCBuZXRVcmwpXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBnZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICByZXR1cm4gc2VyaWFsaXplZERhdGFCeXRlXG4gICAgICB9LFxuICAgICAgcmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUgKCkge1xuICAgICAgICBzZXJpYWxpemVkRGF0YUJ5dGUgPSAwXG4gICAgICB9LFxuICAgICAgc2V0U2VyaWFsaXplRnVuY3Rpb24gKG5ld0Z1bmMpIHtcbiAgICAgICAgc2VyaWFsaXplRnVuY3Rpb24gPSBuZXdGdW5jXG4gICAgICB9LFxuICAgICAgc2V0RGVzZXJpYWxpemVGdW5jdGlvbiAobmV3RnVuYykge1xuICAgICAgICBkZXNlcmlhbGl6ZUZ1bmN0aW9uID0gbmV3RnVuY1xuICAgICAgfSxcbiAgICAgIHN0YXJ0LFxuICAgICAgc3RvcCAoKSB7XG4gICAgICAgIHNlcnZpY2VTZXJ2ZXIudHJ5U2h1dGRvd24oKCkgPT4ge30pXG4gICAgICB9LFxuICAgICAgcmVzdGFydCAoKSB7XG4gICAgICAgIHNlcnZpY2VTZXJ2ZXIudHJ5U2h1dGRvd24oc3RhcnQpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIExPRy5lcnJvcihQQUNLQUdFLCBlcnJvcilcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldE5ldFNlcnZlclBhY2thZ2UnKVxuICB9XG59XG4iXX0=