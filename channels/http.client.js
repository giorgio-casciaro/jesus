'use strict';

var request = require('request');
var PACKAGE = 'channel.http.client';
var checkRequired = require('../utils').checkRequired;
var EventEmitter = require('events');

module.exports = function getChannelHttpClientPackage(_ref) {
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
    throw new Error('Error during getChannelGrpcClientPackage');
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHAuY2xpZW50LmVzNiJdLCJuYW1lcyI6WyJyZXF1ZXN0IiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiRXZlbnRFbWl0dGVyIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldENoYW5uZWxIdHRwQ2xpZW50UGFja2FnZSIsImdldENvbnNvbGUiLCJtZXRob2RDYWxsIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJDT05TT0xFIiwic2VuZCIsImxpc3RlbmVyIiwibWVzc2FnZSIsInRpbWVvdXQiLCJ3YWl0UmVzcG9uc2UiLCJpc1N0cmVhbSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiaHR0cFVybCIsInVybCIsInJlcGxhY2UiLCJkZWJ1ZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYWxsVGltZW91dCIsImNhbGwiLCJtZXRob2QiLCJwcmVhbWJsZUNSTEYiLCJwb3N0YW1ibGVDUkxGIiwiYm9keSIsImpzb24iLCJ1cmkiLCJyZWN0aWZpZWRDYWxsIiwib24iLCJkYXRhIiwiZW1pdCIsInBhcnNlIiwiZXJyb3IiLCJyZXNwb25zZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJlbmQiLCJ3YXJuIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsVUFBVUMsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFNQyxVQUFVLHFCQUFoQjtBQUNBLElBQU1DLGdCQUFnQkYsUUFBUSxVQUFSLEVBQW9CRSxhQUExQztBQUNBLElBQU1DLGVBQWVILFFBQVEsUUFBUixDQUFyQjs7QUFFQUksT0FBT0MsT0FBUCxHQUFpQixTQUFTQywyQkFBVCxPQUFnSDtBQUFBLE1BQXhFQyxVQUF3RSxRQUF4RUEsVUFBd0U7QUFBQSxNQUE1REMsVUFBNEQsUUFBNURBLFVBQTREO0FBQUEsOEJBQWhEQyxXQUFnRDtBQUFBLE1BQWhEQSxXQUFnRCxvQ0FBbEMsUUFBa0M7QUFBQSw0QkFBeEJDLFNBQXdCO0FBQUEsTUFBeEJBLFNBQXdCLGtD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LGNBQUksQ0FBQ0MsWUFBTCxFQUFrQkcsUUFBUSxJQUFSO0FBQ25CLFNBN0NNLENBQVA7QUE4Q0Q7QUFoREksS0FBUDtBQWtERCxHQXBERCxDQW9ERSxPQUFPcUIsS0FBUCxFQUFjO0FBQ2Q3QixZQUFRNkIsS0FBUixDQUFjQSxLQUFkLEVBQXFCLEVBQUNqQyxzQkFBRCxFQUFhQyxzQkFBYixFQUFyQjtBQUNBLFVBQU0sSUFBSXNDLEtBQUosQ0FBVSwwQ0FBVixDQUFOO0FBQ0Q7QUFDRixDQTNERCIsImZpbGUiOiJodHRwLmNsaWVudC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxuY29uc3QgUEFDS0FHRSA9ICdjaGFubmVsLmh0dHAuY2xpZW50J1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4uL3V0aWxzJykuY2hlY2tSZXF1aXJlZFxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRDaGFubmVsSHR0cENsaWVudFBhY2thZ2UgKHsgZ2V0Q29uc29sZSwgbWV0aG9kQ2FsbCwgc2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycgfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcblxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoeyBnZXRDb25zb2xlfSlcbiAgICByZXR1cm4ge1xuICAgICAgc2VuZCAobGlzdGVuZXIsIG1lc3NhZ2UsIHRpbWVvdXQgPSAxMjAwMDAsIHdhaXRSZXNwb25zZSA9IHRydWUsIGlzU3RyZWFtID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICB2YXIgaHR0cFVybCA9ICdodHRwOi8vJyArIGxpc3RlbmVyLnVybC5yZXBsYWNlKCdodHRwOi8vJywgJycpLnJlcGxhY2UoJy8vJywgJycpXG4gICAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2VuZDonLCBKU09OLnN0cmluZ2lmeSh7IGxpc3RlbmVyLCBtZXNzYWdlLCB0aW1lb3V0LCB3YWl0UmVzcG9uc2UsIGlzU3RyZWFtIH0pKVxuICAgICAgICAgIHZhciBjYWxsVGltZW91dCwgY2FsbFxuICAgICAgICAgIGlmIChpc1N0cmVhbSkge1xuICAgICAgICAgICAgY2FsbCA9IHJlcXVlc3QoXG4gICAgICAgICAgICAgIHsgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgcHJlYW1ibGVDUkxGOiB0cnVlLFxuICAgICAgICAgICAgICAgIHBvc3RhbWJsZUNSTEY6IHRydWUsXG4gICAgICAgICAgICAgICAgYm9keTogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVyaTogaHR0cFVybCArICcvX2h0dHBNZXNzYWdlU3RyZWFtJ1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gc3RyZWFtIHNlcmlhbGl6ZXJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coY2FsbC5saXN0ZW5lcnMoJ2RhdGEnKSlcbiAgICAgICAgICAgIHZhciByZWN0aWZpZWRDYWxsID0gbmV3IEV2ZW50RW1pdHRlcigpXG4gICAgICAgICAgICBjYWxsLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgcmVjdGlmaWVkQ2FsbC5lbWl0KCdkYXRhJywgSlNPTi5wYXJzZShkYXRhKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjYWxsLm9uKCdlcnJvcicsIChkYXRhKSA9PiByZWN0aWZpZWRDYWxsLmVtaXQoJ2Vycm9yJywgZGF0YSkpXG4gICAgICAgICAgICBjYWxsLm9uKCdlbmQnLCAoZGF0YSkgPT4gcmVjdGlmaWVkQ2FsbC5lbWl0KCdlbmQnLCBkYXRhKSlcbiAgICAgICAgICAgIHJlc29sdmUocmVjdGlmaWVkQ2FsbClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbCA9IHJlcXVlc3QoXG4gICAgICAgICAgICAgIHsgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgcHJlYW1ibGVDUkxGOiB0cnVlLFxuICAgICAgICAgICAgICAgIHBvc3RhbWJsZUNSTEY6IHRydWUsXG4gICAgICAgICAgICAgICAgYm9keTogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVyaTogaHR0cFVybCArICcvX2h0dHBNZXNzYWdlJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgICAgICAgICAgQ09OU09MRS5kZWJ1ZygnSHR0cCByZXF1ZXN0IHJlc3BvbnNlJywge2Vycm9yLCByZXNwb25zZSwgYm9keX0pXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxUaW1lb3V0KWNsZWFyVGltZW91dChjYWxsVGltZW91dClcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICAgICAgICAgICAgaWYgKHdhaXRSZXNwb25zZSlyZXNvbHZlKGJvZHkpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjYWxsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBjYWxsLmVuZCgpXG4gICAgICAgICAgICAgIENPTlNPTEUud2Fybignc2VuZE1lc3NhZ2UgdGltZW91dCAgdG8gJyArIGxpc3RlbmVyLnVybCwgeyBtZXNzYWdlLCBzZXJ2aWNlTmFtZSwgdGltZW91dCB9KVxuICAgICAgICAgICAgICBpZiAod2FpdFJlc3BvbnNlKXJlamVjdCgnUmVzcG9uc2UgcHJvYmxlbXM6IFJFUVVFU1QgVElNRU9VVCcpXG4gICAgICAgICAgICAgIGVsc2UgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgfSwgdGltZW91dClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCF3YWl0UmVzcG9uc2UpcmVzb2x2ZShudWxsKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDT05TT0xFLmVycm9yKGVycm9yLCB7Z2V0Q29uc29sZSwgbWV0aG9kQ2FsbH0pXG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBkdXJpbmcgZ2V0Q2hhbm5lbEdycGNDbGllbnRQYWNrYWdlJylcbiAgfVxufVxuIl19