'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var grpc = require('grpc');
var PACKAGE = 'transport.grpc.server';
var checkRequired = require('../jesus').checkRequired;
var zlib = require('zlib');
var publicApi = false;

// MESSAGE SERIALIZATION

var serviceServer;
module.exports = function getTransportGrpcServerPackage(_ref) {
  var serialize = _ref.serialize,
      deserialize = _ref.deserialize,
      getConsole = _ref.getConsole,
      methodCall = _ref.methodCall,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      config = _ref.config;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  try {
    var serializeDefault;
    var deserializeDefault;
    var grpcService;
    var grpcServiceFunctions;

    var _ret = function () {
      var start = function start() {
        serviceServer = new grpc.Server();
        serviceServer.addService(grpcService, grpcServiceFunctions);
        serviceServer.bind(config.url, grpc.ServerCredentials.createInsecure());
        serviceServer.start();
        CONSOLE.debug('Net started on port:' + config.url);
      };

      serializeDefault = function serializeDefault(obj) {
        return zlib.deflateSync(JSON.stringify(obj));
      };

      deserializeDefault = function deserializeDefault(buffer) {
        return JSON.parse(zlib.inflateSync(buffer));
      };

      grpcService = {
        message: {
          path: 'message',
          requestStream: null,
          responseStream: null,
          requestSerialize: serialize || serializeDefault,
          requestDeserialize: deserialize || deserializeDefault,
          responseSerialize: serialize || serializeDefault,
          responseDeserialize: deserialize || deserializeDefault
        },
        messageStream: {
          path: 'messageStream',
          requestStream: false,
          responseStream: true,
          requestSerialize: serialize || serializeDefault,
          requestDeserialize: deserialize || deserializeDefault,
          responseSerialize: serialize || serializeDefault,
          responseDeserialize: deserialize || deserializeDefault
        }
      };
      grpcServiceFunctions = {
        message: function message(call, callback) {
          var response;
          return regeneratorRuntime.async(function message$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return regeneratorRuntime.awrap(methodCall(call.request, false, publicApi));

                case 3:
                  response = _context.sent;

                  callback(null, response);
                  _context.next = 11;
                  break;

                case 7:
                  _context.prev = 7;
                  _context.t0 = _context['catch'](0);

                  CONSOLE.error('message error', _context.t0);
                  callback(_context.t0, null);

                case 11:
                case 'end':
                  return _context.stop();
              }
            }
          }, null, this, [[0, 7]]);
        },
        messageStream: function messageStream(call) {
          var getStream;
          return regeneratorRuntime.async(function messageStream$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  try {
                    getStream = function getStream(onClose) {
                      var MAX_REQUEST_TIMEOUT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 120000;

                      var close = function close() {
                        if (timeout) clearTimeout(timeout);onClose();
                      };
                      var timeout = setTimeout(function () {
                        call.end();close();
                      }, MAX_REQUEST_TIMEOUT);
                      return call;
                    };

                    methodCall(call.request, getStream, publicApi);
                  } catch (error) {
                    CONSOLE.error('messageStream error', error);
                    call.cancel();
                  }

                case 1:
                case 'end':
                  return _context2.stop();
              }
            }
          }, null, this);
        }
      };

      checkRequired({ serviceName: serviceName, serviceId: serviceId, config: config, methodCall: methodCall, getConsole: getConsole });
      return {
        v: {
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
    CONSOLE.error(error, { config: config });
    throw new Error('getTransportGrpcServerPackage ' + config.url);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdycGMuc2VydmVyLmVzNiJdLCJuYW1lcyI6WyJncnBjIiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiemxpYiIsInB1YmxpY0FwaSIsInNlcnZpY2VTZXJ2ZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0VHJhbnNwb3J0R3JwY1NlcnZlclBhY2thZ2UiLCJzZXJpYWxpemUiLCJkZXNlcmlhbGl6ZSIsImdldENvbnNvbGUiLCJtZXRob2RDYWxsIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJjb25maWciLCJDT05TT0xFIiwic2VyaWFsaXplRGVmYXVsdCIsImRlc2VyaWFsaXplRGVmYXVsdCIsImdycGNTZXJ2aWNlIiwiZ3JwY1NlcnZpY2VGdW5jdGlvbnMiLCJzdGFydCIsIlNlcnZlciIsImFkZFNlcnZpY2UiLCJiaW5kIiwidXJsIiwiU2VydmVyQ3JlZGVudGlhbHMiLCJjcmVhdGVJbnNlY3VyZSIsImRlYnVnIiwib2JqIiwiZGVmbGF0ZVN5bmMiLCJKU09OIiwic3RyaW5naWZ5IiwiYnVmZmVyIiwicGFyc2UiLCJpbmZsYXRlU3luYyIsIm1lc3NhZ2UiLCJwYXRoIiwicmVxdWVzdFN0cmVhbSIsInJlc3BvbnNlU3RyZWFtIiwicmVxdWVzdFNlcmlhbGl6ZSIsInJlcXVlc3REZXNlcmlhbGl6ZSIsInJlc3BvbnNlU2VyaWFsaXplIiwicmVzcG9uc2VEZXNlcmlhbGl6ZSIsIm1lc3NhZ2VTdHJlYW0iLCJjYWxsIiwiY2FsbGJhY2siLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJlcnJvciIsImdldFN0cmVhbSIsIm9uQ2xvc2UiLCJNQVhfUkVRVUVTVF9USU1FT1VUIiwiY2xvc2UiLCJ0aW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImVuZCIsImNhbmNlbCIsInN0b3AiLCJ0cnlTaHV0ZG93biIsInJlc3RhcnQiLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLE9BQU9DLFFBQVEsTUFBUixDQUFY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VSxHQUFwRCxDQUFOO0FBQ0Q7QUFDRixDQXRFRCIsImZpbGUiOiJncnBjLnNlcnZlci5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ3JwYyA9IHJlcXVpcmUoJ2dycGMnKVxuY29uc3QgUEFDS0FHRSA9ICd0cmFuc3BvcnQuZ3JwYy5zZXJ2ZXInXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG52YXIgemxpYiA9IHJlcXVpcmUoJ3psaWInKVxuY29uc3QgcHVibGljQXBpID0gZmFsc2VcblxuLy8gTUVTU0FHRSBTRVJJQUxJWkFUSU9OXG5cbnZhciBzZXJ2aWNlU2VydmVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFRyYW5zcG9ydEdycGNTZXJ2ZXJQYWNrYWdlICh7c2VyaWFsaXplLCBkZXNlcmlhbGl6ZSwgZ2V0Q29uc29sZSwgbWV0aG9kQ2FsbCwgc2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycsIGNvbmZpZ30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHRyeSB7XG4gICAgdmFyIHNlcmlhbGl6ZURlZmF1bHQgPSAob2JqKSA9PiB6bGliLmRlZmxhdGVTeW5jKEpTT04uc3RyaW5naWZ5KG9iaikpXG4gICAgdmFyIGRlc2VyaWFsaXplRGVmYXVsdCA9IChidWZmZXIpID0+IEpTT04ucGFyc2UoemxpYi5pbmZsYXRlU3luYyhidWZmZXIpKVxuICAgIHZhciBncnBjU2VydmljZSA9IHtcbiAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgcGF0aDogJ21lc3NhZ2UnLFxuICAgICAgICByZXF1ZXN0U3RyZWFtOiBudWxsLFxuICAgICAgICByZXNwb25zZVN0cmVhbTogbnVsbCxcbiAgICAgICAgcmVxdWVzdFNlcmlhbGl6ZTogc2VyaWFsaXplIHx8IHNlcmlhbGl6ZURlZmF1bHQsXG4gICAgICAgIHJlcXVlc3REZXNlcmlhbGl6ZTogZGVzZXJpYWxpemUgfHwgZGVzZXJpYWxpemVEZWZhdWx0LFxuICAgICAgICByZXNwb25zZVNlcmlhbGl6ZTogc2VyaWFsaXplIHx8IHNlcmlhbGl6ZURlZmF1bHQsXG4gICAgICAgIHJlc3BvbnNlRGVzZXJpYWxpemU6IGRlc2VyaWFsaXplIHx8IGRlc2VyaWFsaXplRGVmYXVsdFxuICAgICAgfSxcbiAgICAgIG1lc3NhZ2VTdHJlYW06IHtcbiAgICAgICAgcGF0aDogJ21lc3NhZ2VTdHJlYW0nLFxuICAgICAgICByZXF1ZXN0U3RyZWFtOiBmYWxzZSxcbiAgICAgICAgcmVzcG9uc2VTdHJlYW06IHRydWUsXG4gICAgICAgIHJlcXVlc3RTZXJpYWxpemU6IHNlcmlhbGl6ZSB8fCBzZXJpYWxpemVEZWZhdWx0LFxuICAgICAgICByZXF1ZXN0RGVzZXJpYWxpemU6IGRlc2VyaWFsaXplIHx8IGRlc2VyaWFsaXplRGVmYXVsdCxcbiAgICAgICAgcmVzcG9uc2VTZXJpYWxpemU6IHNlcmlhbGl6ZSB8fCBzZXJpYWxpemVEZWZhdWx0LFxuICAgICAgICByZXNwb25zZURlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZSB8fCBkZXNlcmlhbGl6ZURlZmF1bHRcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGdycGNTZXJ2aWNlRnVuY3Rpb25zID0ge1xuICAgICAgYXN5bmMgbWVzc2FnZSAoY2FsbCwgY2FsbGJhY2spIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2RDYWxsKGNhbGwucmVxdWVzdCwgZmFsc2UsIHB1YmxpY0FwaSlcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXNwb25zZSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBDT05TT0xFLmVycm9yKCdtZXNzYWdlIGVycm9yJywgZXJyb3IpXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhc3luYyBtZXNzYWdlU3RyZWFtIChjYWxsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGdldFN0cmVhbSA9IChvbkNsb3NlLCBNQVhfUkVRVUVTVF9USU1FT1VUID0gMTIwMDAwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjbG9zZSA9ICgpID0+IHsgaWYgKHRpbWVvdXQpY2xlYXJUaW1lb3V0KHRpbWVvdXQpOyBvbkNsb3NlKCkgfVxuICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHsgY2FsbC5lbmQoKTsgY2xvc2UoKSB9LCBNQVhfUkVRVUVTVF9USU1FT1VUKVxuICAgICAgICAgICAgcmV0dXJuIGNhbGxcbiAgICAgICAgICB9XG4gICAgICAgICAgbWV0aG9kQ2FsbChjYWxsLnJlcXVlc3QsIGdldFN0cmVhbSwgcHVibGljQXBpKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIENPTlNPTEUuZXJyb3IoJ21lc3NhZ2VTdHJlYW0gZXJyb3InLCBlcnJvcilcbiAgICAgICAgICBjYWxsLmNhbmNlbCgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgc2VydmljZVNlcnZlciA9IG5ldyBncnBjLlNlcnZlcigpXG4gICAgICBzZXJ2aWNlU2VydmVyLmFkZFNlcnZpY2UoZ3JwY1NlcnZpY2UsIGdycGNTZXJ2aWNlRnVuY3Rpb25zKVxuICAgICAgc2VydmljZVNlcnZlci5iaW5kKGNvbmZpZy51cmwsIGdycGMuU2VydmVyQ3JlZGVudGlhbHMuY3JlYXRlSW5zZWN1cmUoKSlcbiAgICAgIHNlcnZpY2VTZXJ2ZXIuc3RhcnQoKVxuICAgICAgQ09OU09MRS5kZWJ1ZygnTmV0IHN0YXJ0ZWQgb24gcG9ydDonICsgY29uZmlnLnVybClcbiAgICB9XG4gICAgY2hlY2tSZXF1aXJlZCh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgY29uZmlnLCBtZXRob2RDYWxsLCBnZXRDb25zb2xlfSlcbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQsXG4gICAgICBzdG9wICgpIHtcbiAgICAgICAgc2VydmljZVNlcnZlci50cnlTaHV0ZG93bigoKSA9PiB7fSlcbiAgICAgIH0sXG4gICAgICByZXN0YXJ0ICgpIHtcbiAgICAgICAgc2VydmljZVNlcnZlci50cnlTaHV0ZG93bihzdGFydClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ09OU09MRS5lcnJvcihlcnJvciwge2NvbmZpZ30pXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRUcmFuc3BvcnRHcnBjU2VydmVyUGFja2FnZSAnICsgY29uZmlnLnVybClcbiAgfVxufVxuIl19