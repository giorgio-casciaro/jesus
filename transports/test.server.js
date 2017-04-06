'use strict';

var PACKAGE = 'transport.test.server';
var checkRequired = require('../utils').checkRequired;
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
                return regeneratorRuntime.awrap(methodCall(message, false, publicApi, "test"));

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

                methodCall(message, getStream, publicApi, "test");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3Quc2VydmVyLmVzNiJdLCJuYW1lcyI6WyJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsInJlcXVpcmUiLCJFdmVudEVtaXR0ZXIiLCJnbG9iYWxFbWl0dGVycyIsImdsb2JhbCIsInRyYW5zcG9ydFRlc3RTZXJ2ZXJzIiwicHVibGljQXBpIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFRyYW5zcG9ydEdycGNTZXJ2ZXJQYWNrYWdlIiwic2VyaWFsaXplIiwiZGVzZXJpYWxpemUiLCJnZXRDb25zb2xlIiwibWV0aG9kQ2FsbCIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiY29uZmlnIiwiQ09OU09MRSIsInN0YXJ0IiwiZ2xvYmFsRW1pdHRlciIsInVybCIsIm9uIiwibWVzc2FnZSIsInJlc3BvbmQiLCJyZXNwb25zZSIsInN0cmVhbSIsIndyaXRlIiwiZGF0YSIsInJlYWRhYmxlU3RyZWFtIiwiZW1pdCIsImVuZCIsIl9yZWFkIiwic2l6ZSIsImdldFN0cmVhbSIsIm9uQ2xvc2UiLCJNQVhfUkVRVUVTVF9USU1FT1VUIiwiY2xvc2UiLCJ0aW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImRlYnVnIiwic3RvcCIsInJlc3RhcnQiLCJlcnJvciIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFVBQVUsdUJBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCQyxRQUFRLFVBQVIsRUFBb0JELGFBQTFDO0FBQ0EsSUFBTUUsZUFBZUQsUUFBUSxRQUFSLENBQXJCO0FBQ0EsSUFBSUUsaUJBQWlCQyxPQUFPQyxvQkFBUCxHQUE4QkQsT0FBT0Msb0JBQVAsSUFBK0IsRUFBbEY7QUFDQSxJQUFNQyxZQUFZLElBQWxCO0FBQ0FDLE9BQU9DLE9BQVAsR0FBaUIsU0FBU0MsNkJBQVQsT0FBZ0o7QUFBQSxNQUF2R0MsU0FBdUcsUUFBdkdBLFNBQXVHO0FBQUEsTUFBNUZDLFdBQTRGLFFBQTVGQSxXQUE0RjtBQUFBLE1BQS9FQyxVQUErRSxRQUEvRUEsVUFBK0U7QUFBQSxNQUFuRUMsVUFBbUUsUUFBbkVBLFVBQW1FO0FBQUEsOEJBQXZEQyxXQUF1RDtBQUFBLE1BQXZEQSxXQUF1RCxvQ0FBekMsUUFBeUM7QUFBQSw0QkFBL0JDLFNBQStCO0FBQUEsTUFBL0JBLFNBQStCLGtDQUFuQixRQUFtQjtBQUFBLE1BQVRDLE1BQVMsUUFBVEEsTUFBUzs7QUFDL0osTUFBSUMsVUFBVUwsV0FBV0UsV0FBWCxFQUF3QkMsU0FBeEIsRUFBbUNoQixPQUFuQyxDQUFkO0FBQ0EsTUFBSTtBQUFBLFFBQ09tQixLQURQLEdBQ0YsU0FBU0EsS0FBVCxHQUFrQjtBQUNoQixVQUFJQyxnQkFBY2hCLGVBQWVhLE9BQU9JLEdBQXRCLElBQTJCakIsZUFBZWEsT0FBT0ksR0FBdEIsS0FBNEIsSUFBSWxCLFlBQUosRUFBekU7QUFDQWlCLG9CQUFjRSxFQUFkLENBQWlCLFNBQWpCLEVBQTRCLGlCQUFnQkMsT0FBaEIsRUFBeUJDLE9BQXpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0RBQ0xWLFdBQVdTLE9BQVgsRUFBb0IsS0FBcEIsRUFBMkJoQixTQUEzQixFQUFxQyxNQUFyQyxDQURLOztBQUFBO0FBQ3RCa0Isd0JBRHNCOztBQUUxQkQsd0JBQVFDLFFBQVI7O0FBRjBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQTVCO0FBSUFMLG9CQUFjRSxFQUFkLENBQWlCLGVBQWpCLEVBQWtDLGtCQUFnQkMsT0FBaEIsRUFBeUJDLE9BQXpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUM1QkUsc0JBRDRCLEdBQ25CO0FBQ1hDLHlCQUFPLGVBQUNDLElBQUQ7QUFBQSwyQkFBVUMsZUFBZUMsSUFBZixDQUFvQixNQUFwQixFQUE0QkYsSUFBNUIsQ0FBVjtBQUFBLG1CQURJO0FBRVhHLHVCQUFLO0FBQUEsMkJBQU1GLGVBQWVDLElBQWYsQ0FBb0IsS0FBcEIsQ0FBTjtBQUFBO0FBRk0saUJBRG1CO0FBSzVCRCw4QkFMNEIsR0FLWCxJQUFJMUIsWUFBSixFQUxXOztBQU1oQzBCLCtCQUFlRyxLQUFmLEdBQXVCLFVBQVNDLElBQVQsRUFBZSxDQUFFLGdCQUFrQixDQUExRDs7QUFFSUMseUJBUjRCLEdBUWhCLFNBQVpBLFNBQVksQ0FBQ0MsT0FBRCxFQUEyQztBQUFBLHNCQUFqQ0MsbUJBQWlDLHVFQUFYLE1BQVc7O0FBQ3pELHNCQUFNQyxRQUFRLFNBQVJBLEtBQVEsR0FBTTtBQUFFUixtQ0FBZUUsR0FBZixHQUFzQixJQUFJTyxPQUFKLEVBQVlDLGFBQWFELE9BQWIsRUFBdUJIO0FBQVcsbUJBQTFGO0FBQ0Esc0JBQUlHLFVBQVVFLFdBQVdILEtBQVgsRUFBa0JELG1CQUFsQixDQUFkO0FBQ0EseUJBQU9WLE1BQVA7QUFDRCxpQkFaK0I7O0FBYWhDWiwyQkFBV1MsT0FBWCxFQUFvQlcsU0FBcEIsRUFBK0IzQixTQUEvQixFQUF5QyxNQUF6QztBQUNBaUIsd0JBQVFLLGNBQVI7O0FBZGdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQWxDO0FBZ0JBWCxjQUFRdUIsS0FBUixDQUFjLDRCQUFkO0FBQ0QsS0F4QkM7O0FBeUJGeEMsa0JBQWMsRUFBQ2dCLGNBQUQsRUFBU0gsc0JBQVQsRUFBcUJELHNCQUFyQixFQUFkO0FBQ0EsV0FBTztBQUNMTSxrQkFESztBQUVMdUIsVUFGSyxrQkFFRyxDQUFFLENBRkw7QUFHTEMsYUFISyxxQkFHTSxDQUFFO0FBSFIsS0FBUDtBQUtELEdBL0JELENBK0JFLE9BQU9DLEtBQVAsRUFBYztBQUNkMUIsWUFBUTBCLEtBQVIsQ0FBY0EsS0FBZCxFQUFxQixFQUFDM0IsY0FBRCxFQUFyQjtBQUNBLFVBQU0sSUFBSTRCLEtBQUosQ0FBVSxtQ0FBbUM1QixPQUFPSSxHQUFwRCxDQUFOO0FBQ0Q7QUFDRixDQXJDRCIsImZpbGUiOiJ0ZXN0LnNlcnZlci5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQQUNLQUdFID0gJ3RyYW5zcG9ydC50ZXN0LnNlcnZlcidcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpXG52YXIgZ2xvYmFsRW1pdHRlcnMgPSBnbG9iYWwudHJhbnNwb3J0VGVzdFNlcnZlcnMgPSBnbG9iYWwudHJhbnNwb3J0VGVzdFNlcnZlcnMgfHwgW11cbmNvbnN0IHB1YmxpY0FwaSA9IHRydWVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0VHJhbnNwb3J0R3JwY1NlcnZlclBhY2thZ2UgKHtzZXJpYWxpemUsIGRlc2VyaWFsaXplLCBnZXRDb25zb2xlLCBtZXRob2RDYWxsLCBzZXJ2aWNlTmFtZSA9ICd1bmtub3cnLCBzZXJ2aWNlSWQgPSAndW5rbm93JywgY29uZmlnfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcbiAgICBmdW5jdGlvbiBzdGFydCAoKSB7XG4gICAgICB2YXIgZ2xvYmFsRW1pdHRlcj1nbG9iYWxFbWl0dGVyc1tjb25maWcudXJsXT1nbG9iYWxFbWl0dGVyc1tjb25maWcudXJsXXx8bmV3IEV2ZW50RW1pdHRlcigpXG4gICAgICBnbG9iYWxFbWl0dGVyLm9uKCdtZXNzYWdlJywgYXN5bmMgZnVuY3Rpb24gKG1lc3NhZ2UsIHJlc3BvbmQpIHtcbiAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbWV0aG9kQ2FsbChtZXNzYWdlLCBmYWxzZSwgcHVibGljQXBpLFwidGVzdFwiKVxuICAgICAgICByZXNwb25kKHJlc3BvbnNlKVxuICAgICAgfSlcbiAgICAgIGdsb2JhbEVtaXR0ZXIub24oJ21lc3NhZ2VTdHJlYW0nLCBhc3luYyBmdW5jdGlvbiAobWVzc2FnZSwgcmVzcG9uZCkge1xuICAgICAgICB2YXIgc3RyZWFtID0ge1xuICAgICAgICAgIHdyaXRlOiAoZGF0YSkgPT4gcmVhZGFibGVTdHJlYW0uZW1pdCgnZGF0YScsIGRhdGEpLFxuICAgICAgICAgIGVuZDogKCkgPT4gcmVhZGFibGVTdHJlYW0uZW1pdCgnZW5kJylcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVhZGFibGVTdHJlYW0gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHJlYWRhYmxlU3RyZWFtLl9yZWFkID0gZnVuY3Rpb24oc2l6ZSkgeyAvKiBkbyBub3RoaW5nICovIH07XG5cbiAgICAgICAgdmFyIGdldFN0cmVhbSA9IChvbkNsb3NlLCBNQVhfUkVRVUVTVF9USU1FT1VUID0gMTIwMDAwKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7IHJlYWRhYmxlU3RyZWFtLmVuZCgpOyBpZiAodGltZW91dCljbGVhclRpbWVvdXQodGltZW91dCk7IG9uQ2xvc2UoKSB9XG4gICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsb3NlLCBNQVhfUkVRVUVTVF9USU1FT1VUKVxuICAgICAgICAgIHJldHVybiBzdHJlYW1cbiAgICAgICAgfVxuICAgICAgICBtZXRob2RDYWxsKG1lc3NhZ2UsIGdldFN0cmVhbSwgcHVibGljQXBpLFwidGVzdFwiKVxuICAgICAgICByZXNwb25kKHJlYWRhYmxlU3RyZWFtKVxuICAgICAgfSlcbiAgICAgIENPTlNPTEUuZGVidWcoJ05ldCBzdGFydGVkIFRFU1QgdHJhbnNwb3J0JylcbiAgICB9XG4gICAgY2hlY2tSZXF1aXJlZCh7Y29uZmlnLCBtZXRob2RDYWxsLCBnZXRDb25zb2xlfSlcbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQsXG4gICAgICBzdG9wICgpIHt9LFxuICAgICAgcmVzdGFydCAoKSB7fVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDT05TT0xFLmVycm9yKGVycm9yLCB7Y29uZmlnfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFRyYW5zcG9ydEdycGNTZXJ2ZXJQYWNrYWdlICcgKyBjb25maWcudXJsKVxuICB9XG59XG4iXX0=