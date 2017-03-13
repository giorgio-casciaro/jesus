'use strict';

var PACKAGE = 'transport.test.server';
var checkRequired = require('../jesus').checkRequired;
var EventEmitter = require('events');
var globalEmitters = global.transportTestServers = global.transportTestServers || [];
var publicApi = true;
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
    var start = function start() {
      var globalEmitter = globalEmitters[config.url] = globalEmitters[config.url] || new EventEmitter();
      globalEmitter.on('message', function _callee(message, respond) {
        var response;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return regeneratorRuntime.awrap(methodCall(message, false, config.public));

              case 2:
                response = _context.sent;

                respond(response);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, null, this);
      });
      globalEmitter.on('messageStream', function _callee2(message, respond) {
        var stream, readableStream, getStream;
        return regeneratorRuntime.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                stream = {
                  write: function write(data) {
                    return readableStream.emit('data', data);
                  },
                  end: function end() {
                    return readableStream.emit('end');
                  }
                };
                readableStream = new EventEmitter();

                readableStream._read = function (size) {/* do nothing */};

                getStream = function getStream(onClose) {
                  var MAX_REQUEST_TIMEOUT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 120000;

                  var close = function close() {
                    readableStream.end();if (timeout) clearTimeout(timeout);onClose();
                  };
                  var timeout = setTimeout(close, MAX_REQUEST_TIMEOUT);
                  return stream;
                };

                methodCall(message, getStream, publicApi);
                respond(readableStream);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, null, this);
      });
      CONSOLE.debug('Net started TEST transport');
    };

    checkRequired({ config: config, methodCall: methodCall, getConsole: getConsole });
    return {
      start: start,
      stop: function stop() {},
      restart: function restart() {}
    };
  } catch (error) {
    CONSOLE.error(error, { config: config });
    throw new Error('getTransportGrpcServerPackage ' + config.url);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3Quc2VydmVyLmVzNiJdLCJuYW1lcyI6WyJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsInJlcXVpcmUiLCJFdmVudEVtaXR0ZXIiLCJnbG9iYWxFbWl0dGVycyIsImdsb2JhbCIsInRyYW5zcG9ydFRlc3RTZXJ2ZXJzIiwicHVibGljQXBpIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFRyYW5zcG9ydEdycGNTZXJ2ZXJQYWNrYWdlIiwic2VyaWFsaXplIiwiZGVzZXJpYWxpemUiLCJnZXRDb25zb2xlIiwibWV0aG9kQ2FsbCIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiY29uZmlnIiwiQ09OU09MRSIsInN0YXJ0IiwiZ2xvYmFsRW1pdHRlciIsInVybCIsIm9uIiwibWVzc2FnZSIsInJlc3BvbmQiLCJwdWJsaWMiLCJyZXNwb25zZSIsInN0cmVhbSIsIndyaXRlIiwiZGF0YSIsInJlYWRhYmxlU3RyZWFtIiwiZW1pdCIsImVuZCIsIl9yZWFkIiwic2l6ZSIsImdldFN0cmVhbSIsIm9uQ2xvc2UiLCJNQVhfUkVRVUVTVF9USU1FT1VUIiwiY2xvc2UiLCJ0aW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImRlYnVnIiwic3RvcCIsInJlc3RhcnQiLCJlcnJvciIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFVBQVUsdUJBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCQyxRQUFRLFVBQVIsRUFBb0JELGFBQTFDO0FBQ0EsSUFBTUUsZUFBZUQsUUFBUSxRQUFSLENBQXJCO0FBQ0EsSUFBSUUsaUJBQWlCQyxPQUFPQyxvQkFBUCxHQUE4QkQsT0FBT0Msb0JBQVAsSUFBK0IsRUFBbEY7QUFDQSxJQUFNQyxZQUFZLElBQWxCO0FBQ0FDLE9BQU9DLE9BQVAsR0FBaUIsU0FBU0MsNkJBQVQsT0FBZ0o7QUFBQSxNQUF2R0MsU0FBdUcsUUFBdkdBLFNBQXVHO0FBQUEsTUFBNUZDLFdBQTRGLFFBQTVGQSxXQUE0RjtBQUFBLE1BQS9FQyxVQUErRSxRQUEvRUEsVUFBK0U7QUFBQSxNQUFuRUMsVUFBbUUsUUFBbkVBLFVBQW1FO0FBQUEsOEJBQXZEQyxXQUF1RDtBQUFBLE1BQXZEQSxXQUF1RCxvQ0FBekMsUUFBeUM7QUFBQSw0QkFBL0JDLFNBQStCO0FBQUEsTUFBL0JBLFNBQStCLGtDQUFuQixRQUFtQjtBQUFBLE1BQVRDLE1BQVMsUUFBVEEsTUFBUzs7QUFDL0osTUFBSUMsVUFBVUwsV0FBV0UsV0FBWCxFQUF3QkMsU0FBeEIsRUFBbUNoQixPQUFuQyxDQUFkO0FBQ0EsTUFBSTtBQUFBLFFBQ09tQixLQURQLEdBQ0YsU0FBU0EsS0FBVCxHQUFrQjtBQUNoQixVQUFJQyxnQkFBY2hCLGVBQWVhLE9BQU9JLEdBQXRCLElBQTJCakIsZUFBZWEsT0FBT0ksR0FBdEIsS0FBNEIsSUFBSWxCLFlBQUosRUFBekU7QUFDQWlCLG9CQUFjRSxFQUFkLENBQWlCLFNBQWpCLEVBQTRCLGlCQUFnQkMsT0FBaEIsRUFBeUJDLE9BQXpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0RBQ0xWLFdBQVdTLE9BQVgsRUFBb0IsS0FBcEIsRUFBMkJOLE9BQU9RLE1BQWxDLENBREs7O0FBQUE7QUFDdEJDLHdCQURzQjs7QUFFMUJGLHdCQUFRRSxRQUFSOztBQUYwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUE1QjtBQUlBTixvQkFBY0UsRUFBZCxDQUFpQixlQUFqQixFQUFrQyxrQkFBZ0JDLE9BQWhCLEVBQXlCQyxPQUF6QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDNUJHLHNCQUQ0QixHQUNuQjtBQUNYQyx5QkFBTyxlQUFDQyxJQUFEO0FBQUEsMkJBQVVDLGVBQWVDLElBQWYsQ0FBb0IsTUFBcEIsRUFBNEJGLElBQTVCLENBQVY7QUFBQSxtQkFESTtBQUVYRyx1QkFBSztBQUFBLDJCQUFNRixlQUFlQyxJQUFmLENBQW9CLEtBQXBCLENBQU47QUFBQTtBQUZNLGlCQURtQjtBQUs1QkQsOEJBTDRCLEdBS1gsSUFBSTNCLFlBQUosRUFMVzs7QUFNaEMyQiwrQkFBZUcsS0FBZixHQUF1QixVQUFTQyxJQUFULEVBQWUsQ0FBRSxnQkFBa0IsQ0FBMUQ7O0FBRUlDLHlCQVI0QixHQVFoQixTQUFaQSxTQUFZLENBQUNDLE9BQUQsRUFBMkM7QUFBQSxzQkFBakNDLG1CQUFpQyx1RUFBWCxNQUFXOztBQUN6RCxzQkFBTUMsUUFBUSxTQUFSQSxLQUFRLEdBQU07QUFBRVIsbUNBQWVFLEdBQWYsR0FBc0IsSUFBSU8sT0FBSixFQUFZQyxhQUFhRCxPQUFiLEVBQXVCSDtBQUFXLG1CQUExRjtBQUNBLHNCQUFJRyxVQUFVRSxXQUFXSCxLQUFYLEVBQWtCRCxtQkFBbEIsQ0FBZDtBQUNBLHlCQUFPVixNQUFQO0FBQ0QsaUJBWitCOztBQWFoQ2IsMkJBQVdTLE9BQVgsRUFBb0JZLFNBQXBCLEVBQStCNUIsU0FBL0I7QUFDQWlCLHdCQUFRTSxjQUFSOztBQWRnQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUFsQztBQWdCQVosY0FBUXdCLEtBQVIsQ0FBYyw0QkFBZDtBQUNELEtBeEJDOztBQXlCRnpDLGtCQUFjLEVBQUNnQixjQUFELEVBQVNILHNCQUFULEVBQXFCRCxzQkFBckIsRUFBZDtBQUNBLFdBQU87QUFDTE0sa0JBREs7QUFFTHdCLFVBRkssa0JBRUcsQ0FBRSxDQUZMO0FBR0xDLGFBSEsscUJBR00sQ0FBRTtBQUhSLEtBQVA7QUFLRCxHQS9CRCxDQStCRSxPQUFPQyxLQUFQLEVBQWM7QUFDZDNCLFlBQVEyQixLQUFSLENBQWNBLEtBQWQsRUFBcUIsRUFBQzVCLGNBQUQsRUFBckI7QUFDQSxVQUFNLElBQUk2QixLQUFKLENBQVUsbUNBQW1DN0IsT0FBT0ksR0FBcEQsQ0FBTjtBQUNEO0FBQ0YsQ0FyQ0QiLCJmaWxlIjoidGVzdC5zZXJ2ZXIuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUEFDS0FHRSA9ICd0cmFuc3BvcnQudGVzdC5zZXJ2ZXInXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKVxudmFyIGdsb2JhbEVtaXR0ZXJzID0gZ2xvYmFsLnRyYW5zcG9ydFRlc3RTZXJ2ZXJzID0gZ2xvYmFsLnRyYW5zcG9ydFRlc3RTZXJ2ZXJzIHx8IFtdXG5jb25zdCBwdWJsaWNBcGkgPSB0cnVlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFRyYW5zcG9ydEdycGNTZXJ2ZXJQYWNrYWdlICh7c2VyaWFsaXplLCBkZXNlcmlhbGl6ZSwgZ2V0Q29uc29sZSwgbWV0aG9kQ2FsbCwgc2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycsIGNvbmZpZ30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHRyeSB7XG4gICAgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgdmFyIGdsb2JhbEVtaXR0ZXI9Z2xvYmFsRW1pdHRlcnNbY29uZmlnLnVybF09Z2xvYmFsRW1pdHRlcnNbY29uZmlnLnVybF18fG5ldyBFdmVudEVtaXR0ZXIoKVxuICAgICAgZ2xvYmFsRW1pdHRlci5vbignbWVzc2FnZScsIGFzeW5jIGZ1bmN0aW9uIChtZXNzYWdlLCByZXNwb25kKSB7XG4gICAgICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG1ldGhvZENhbGwobWVzc2FnZSwgZmFsc2UsIGNvbmZpZy5wdWJsaWMpXG4gICAgICAgIHJlc3BvbmQocmVzcG9uc2UpXG4gICAgICB9KVxuICAgICAgZ2xvYmFsRW1pdHRlci5vbignbWVzc2FnZVN0cmVhbScsIGFzeW5jIGZ1bmN0aW9uIChtZXNzYWdlLCByZXNwb25kKSB7XG4gICAgICAgIHZhciBzdHJlYW0gPSB7XG4gICAgICAgICAgd3JpdGU6IChkYXRhKSA9PiByZWFkYWJsZVN0cmVhbS5lbWl0KCdkYXRhJywgZGF0YSksXG4gICAgICAgICAgZW5kOiAoKSA9PiByZWFkYWJsZVN0cmVhbS5lbWl0KCdlbmQnKVxuICAgICAgICB9XG4gICAgICAgIHZhciByZWFkYWJsZVN0cmVhbSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgcmVhZGFibGVTdHJlYW0uX3JlYWQgPSBmdW5jdGlvbihzaXplKSB7IC8qIGRvIG5vdGhpbmcgKi8gfTtcblxuICAgICAgICB2YXIgZ2V0U3RyZWFtID0gKG9uQ2xvc2UsIE1BWF9SRVFVRVNUX1RJTUVPVVQgPSAxMjAwMDApID0+IHtcbiAgICAgICAgICBjb25zdCBjbG9zZSA9ICgpID0+IHsgcmVhZGFibGVTdHJlYW0uZW5kKCk7IGlmICh0aW1lb3V0KWNsZWFyVGltZW91dCh0aW1lb3V0KTsgb25DbG9zZSgpIH1cbiAgICAgICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xvc2UsIE1BWF9SRVFVRVNUX1RJTUVPVVQpXG4gICAgICAgICAgcmV0dXJuIHN0cmVhbVxuICAgICAgICB9XG4gICAgICAgIG1ldGhvZENhbGwobWVzc2FnZSwgZ2V0U3RyZWFtLCBwdWJsaWNBcGkpXG4gICAgICAgIHJlc3BvbmQocmVhZGFibGVTdHJlYW0pXG4gICAgICB9KVxuICAgICAgQ09OU09MRS5kZWJ1ZygnTmV0IHN0YXJ0ZWQgVEVTVCB0cmFuc3BvcnQnKVxuICAgIH1cbiAgICBjaGVja1JlcXVpcmVkKHtjb25maWcsIG1ldGhvZENhbGwsIGdldENvbnNvbGV9KVxuICAgIHJldHVybiB7XG4gICAgICBzdGFydCxcbiAgICAgIHN0b3AgKCkge30sXG4gICAgICByZXN0YXJ0ICgpIHt9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtjb25maWd9KVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0VHJhbnNwb3J0R3JwY1NlcnZlclBhY2thZ2UgJyArIGNvbmZpZy51cmwpXG4gIH1cbn1cbiJdfQ==