'use strict';

var request = require('request');
var PACKAGE = 'transport.http.client';
var checkRequired = require('../jesus').checkRequired;
var EventEmitter = require('events');

module.exports = function getTransportHttpClientPackage(_ref) {
  var getConsole = _ref.getConsole,
      methodCall = _ref.methodCall,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);

  try {
    checkRequired({ getConsole: getConsole });
    return {
      send: function send(listener, message) {
        var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 120000;
        var waitResponse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        var isStream = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

        return new Promise(function (resolve, reject) {
          var httpUrl = 'http://' + listener.url.replace('http://', '').replace('//', '');
          CONSOLE.debug('send:', JSON.stringify({ listener: listener, message: message, timeout: timeout, waitResponse: waitResponse, isStream: isStream }));
          var callTimeout, call;
          if (isStream) {
            call = request({ method: 'POST',
              preambleCRLF: true,
              postambleCRLF: true,
              body: message,
              json: true,
              uri: httpUrl + '/_httpMessageStream'
            });
            // stream serializer
            //console.log(call.listeners('data'))
            var rectifiedCall = new EventEmitter();
            call.on('data', function (data) {
              rectifiedCall.emit('data', JSON.parse(data));
            });
            call.on('error', function (data) {
              return rectifiedCall.emit('error', data);
            });
            call.on('end', function (data) {
              return rectifiedCall.emit('end', data);
            });
            resolve(rectifiedCall);
          } else {
            call = request({ method: 'POST',
              preambleCRLF: true,
              postambleCRLF: true,
              body: message,
              json: true,
              uri: httpUrl + '/_httpMessage'
            }, function (error, response, body) {
              CONSOLE.debug('Http request response', { error: error, response: response, body: body });
              if (callTimeout) clearTimeout(callTimeout);
              if (error) return reject(error);
              if (waitResponse) resolve(body);
            });
            callTimeout = setTimeout(function () {
              call.end();
              CONSOLE.warn('sendMessage timeout  to ' + listener.url, { message: message, serviceName: serviceName, timeout: timeout });
              if (waitResponse) reject('Response problems: REQUEST TIMEOUT');else resolve(null);
            }, timeout);
          }
          if (!waitResponse) resolve(null);
        });
      }
    };
  } catch (error) {
    CONSOLE.error(error, { getConsole: getConsole, methodCall: methodCall });
    throw new Error('Error during getTransportGrpcClientPackage');
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHAuY2xpZW50LmVzNiJdLCJuYW1lcyI6WyJyZXF1ZXN0IiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiRXZlbnRFbWl0dGVyIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFRyYW5zcG9ydEh0dHBDbGllbnRQYWNrYWdlIiwiZ2V0Q29uc29sZSIsIm1ldGhvZENhbGwiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsIkNPTlNPTEUiLCJzZW5kIiwibGlzdGVuZXIiLCJtZXNzYWdlIiwidGltZW91dCIsIndhaXRSZXNwb25zZSIsImlzU3RyZWFtIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJodHRwVXJsIiwidXJsIiwicmVwbGFjZSIsImRlYnVnIiwiSlNPTiIsInN0cmluZ2lmeSIsImNhbGxUaW1lb3V0IiwiY2FsbCIsIm1ldGhvZCIsInByZWFtYmxlQ1JMRiIsInBvc3RhbWJsZUNSTEYiLCJib2R5IiwianNvbiIsInVyaSIsInJlY3RpZmllZENhbGwiLCJvbiIsImRhdGEiLCJlbWl0IiwicGFyc2UiLCJlcnJvciIsInJlc3BvbnNlIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImVuZCIsIndhcm4iLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQU1DLFVBQVUsdUJBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCRixRQUFRLFVBQVIsRUFBb0JFLGFBQTFDO0FBQ0EsSUFBTUMsZUFBZUgsUUFBUSxRQUFSLENBQXJCOztBQUVBSSxPQUFPQyxPQUFQLEdBQWlCLFNBQVNDLDZCQUFULE9BQWtIO0FBQUEsTUFBeEVDLFVBQXdFLFFBQXhFQSxVQUF3RTtBQUFBLE1BQTVEQyxVQUE0RCxRQUE1REEsVUFBNEQ7QUFBQSw4QkFBaERDLFdBQWdEO0FBQUEsTUFBaERBLFdBQWdELG9DQUFsQyxRQUFrQztBQUFBLDRCQUF4QkMsU0FBd0I7QUFBQSxNQUF4QkEsU0FBd0Is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Q0QsY0FBSSxDQUFDQyxZQUFMLEVBQWtCRyxRQUFRLElBQVI7QUFDbkIsU0E3Q00sQ0FBUDtBQThDRDtBQWhESSxLQUFQO0FBa0RELEdBcERELENBb0RFLE9BQU9xQixLQUFQLEVBQWM7QUFDZDdCLFlBQVE2QixLQUFSLENBQWNBLEtBQWQsRUFBcUIsRUFBQ2pDLHNCQUFELEVBQWFDLHNCQUFiLEVBQXJCO0FBQ0EsVUFBTSxJQUFJc0MsS0FBSixDQUFVLDRDQUFWLENBQU47QUFDRDtBQUNGLENBM0REIiwiZmlsZSI6Imh0dHAuY2xpZW50LmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpXG5jb25zdCBQQUNLQUdFID0gJ3RyYW5zcG9ydC5odHRwLmNsaWVudCdcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0VHJhbnNwb3J0SHR0cENsaWVudFBhY2thZ2UgKHsgZ2V0Q29uc29sZSwgbWV0aG9kQ2FsbCwgc2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycgfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcblxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoeyBnZXRDb25zb2xlfSlcbiAgICByZXR1cm4ge1xuICAgICAgc2VuZCAobGlzdGVuZXIsIG1lc3NhZ2UsIHRpbWVvdXQgPSAxMjAwMDAsIHdhaXRSZXNwb25zZSA9IHRydWUsIGlzU3RyZWFtID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICB2YXIgaHR0cFVybCA9ICdodHRwOi8vJyArIGxpc3RlbmVyLnVybC5yZXBsYWNlKCdodHRwOi8vJywgJycpLnJlcGxhY2UoJy8vJywgJycpXG4gICAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZDonLCBKU09OLnN0cmluZ2lmeSh7IGxpc3RlbmVyLCBtZXNzYWdlLCB0aW1lb3V0LCB3YWl0UmVzcG9uc2UsIGlzU3RyZWFtIH0pKVxuICAgICAgICAgIHZhciBjYWxsVGltZW91dCwgY2FsbFxuICAgICAgICAgIGlmIChpc1N0cmVhbSkge1xuICAgICAgICAgICAgY2FsbCA9IHJlcXVlc3QoXG4gICAgICAgICAgICAgIHsgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgcHJlYW1ibGVDUkxGOiB0cnVlLFxuICAgICAgICAgICAgICAgIHBvc3RhbWJsZUNSTEY6IHRydWUsXG4gICAgICAgICAgICAgICAgYm9keTogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVyaTogaHR0cFVybCArICcvX2h0dHBNZXNzYWdlU3RyZWFtJ1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gc3RyZWFtIHNlcmlhbGl6ZXJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coY2FsbC5saXN0ZW5lcnMoJ2RhdGEnKSlcbiAgICAgICAgICAgIHZhciByZWN0aWZpZWRDYWxsID0gbmV3IEV2ZW50RW1pdHRlcigpXG4gICAgICAgICAgICBjYWxsLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgcmVjdGlmaWVkQ2FsbC5lbWl0KCdkYXRhJywgSlNPTi5wYXJzZShkYXRhKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjYWxsLm9uKCdlcnJvcicsIChkYXRhKSA9PiByZWN0aWZpZWRDYWxsLmVtaXQoJ2Vycm9yJywgZGF0YSkpXG4gICAgICAgICAgICBjYWxsLm9uKCdlbmQnLCAoZGF0YSkgPT4gcmVjdGlmaWVkQ2FsbC5lbWl0KCdlbmQnLCBkYXRhKSlcbiAgICAgICAgICAgIHJlc29sdmUocmVjdGlmaWVkQ2FsbClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbCA9IHJlcXVlc3QoXG4gICAgICAgICAgICAgIHsgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgcHJlYW1ibGVDUkxGOiB0cnVlLFxuICAgICAgICAgICAgICAgIHBvc3RhbWJsZUNSTEY6IHRydWUsXG4gICAgICAgICAgICAgICAgYm9keTogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVyaTogaHR0cFVybCArICcvX2h0dHBNZXNzYWdlJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgICAgICAgICAgQ09OU09MRS5kZWJ1ZygnSHR0cCByZXF1ZXN0IHJlc3BvbnNlJywge2Vycm9yLCByZXNwb25zZSwgYm9keX0pXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxUaW1lb3V0KWNsZWFyVGltZW91dChjYWxsVGltZW91dClcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICAgICAgICAgICAgaWYgKHdhaXRSZXNwb25zZSlyZXNvbHZlKGJvZHkpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjYWxsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBjYWxsLmVuZCgpXG4gICAgICAgICAgICAgIENPTlNPTEUud2Fybignc2VuZE1lc3NhZ2UgdGltZW91dCAgdG8gJyArIGxpc3RlbmVyLnVybCwgeyBtZXNzYWdlLCBzZXJ2aWNlTmFtZSwgdGltZW91dCB9KVxuICAgICAgICAgICAgICBpZiAod2FpdFJlc3BvbnNlKXJlamVjdCgnUmVzcG9uc2UgcHJvYmxlbXM6IFJFUVVFU1QgVElNRU9VVCcpXG4gICAgICAgICAgICAgIGVsc2UgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgfSwgdGltZW91dClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCF3YWl0UmVzcG9uc2UpcmVzb2x2ZShudWxsKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDT05TT0xFLmVycm9yKGVycm9yLCB7Z2V0Q29uc29sZSwgbWV0aG9kQ2FsbH0pXG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBkdXJpbmcgZ2V0VHJhbnNwb3J0R3JwY0NsaWVudFBhY2thZ2UnKVxuICB9XG59XG4iXX0=