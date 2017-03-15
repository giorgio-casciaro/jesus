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
          var httpUrl = 'http://unix:' + listener.file.replace(":", "") + ':';
          CONSOLE.debug('send:', JSON.stringify({ httpUrl: httpUrl, listener: listener, message: message, timeout: timeout, waitResponse: waitResponse, isStream: isStream }));
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
              CONSOLE.warn('sendMessage timeout  to ' + listener.file, { message: message, serviceName: serviceName, timeout: timeout });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbInJlcXVlc3QiLCJyZXF1aXJlIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJFdmVudEVtaXR0ZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0VHJhbnNwb3J0SHR0cENsaWVudFBhY2thZ2UiLCJnZXRDb25zb2xlIiwibWV0aG9kQ2FsbCIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiQ09OU09MRSIsInNlbmQiLCJsaXN0ZW5lciIsIm1lc3NhZ2UiLCJ0aW1lb3V0Iiwid2FpdFJlc3BvbnNlIiwiaXNTdHJlYW0iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImh0dHBVcmwiLCJmaWxlIiwicmVwbGFjZSIsImRlYnVnIiwiSlNPTiIsInN0cmluZ2lmeSIsImNhbGxUaW1lb3V0IiwiY2FsbCIsIm1ldGhvZCIsInByZWFtYmxlQ1JMRiIsInBvc3RhbWJsZUNSTEYiLCJib2R5IiwianNvbiIsInVyaSIsInJlY3RpZmllZENhbGwiLCJvbiIsImRhdGEiLCJlbWl0IiwicGFyc2UiLCJlcnJvciIsInJlc3BvbnNlIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImVuZCIsIndhcm4iLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQU1DLFVBQVUsdUJBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCRixRQUFRLFVBQVIsRUFBb0JFLGFBQTFDO0FBQ0EsSUFBTUMsZUFBZUgsUUFBUSxRQUFSLENBQXJCOztBQUVBSSxPQUFPQyxPQUFQLEdBQWlCLFNBQVNDLDZCQUFULE9BQWtIO0FBQUEsTUFBeEVDLFVBQXdFLFFBQXhFQSxVQUF3RTtBQUFBLE1BQTVEQyxVQUE0RCxRQUE1REEsVUFBNEQ7QUFBQSw4QkFBaERDLFdBQWdEO0FBQUEsTUFBaERBLFdBQWdELG9DQUFsQyxRQUFrQztBQUFBLDRCQUF4QkMsU0FBd0I7QUFBQSxNQUF4QkEsU0FB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SSxDQUFDQyxZQUFMLEVBQWtCRyxRQUFRLElBQVI7QUFDbkIsU0E3Q00sQ0FBUDtBQThDRDtBQWhESSxLQUFQO0FBa0RELEdBcERELENBb0RFLE9BQU9xQixLQUFQLEVBQWM7QUFDZDdCLFlBQVE2QixLQUFSLENBQWNBLEtBQWQsRUFBcUIsRUFBQ2pDLHNCQUFELEVBQWFDLHNCQUFiLEVBQXJCO0FBQ0EsVUFBTSxJQUFJc0MsS0FBSixDQUFVLDRDQUFWLENBQU47QUFDRDtBQUNGLENBM0REIiwiZmlsZSI6InNvY2tldC5jbGllbnQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0JylcbmNvbnN0IFBBQ0tBR0UgPSAndHJhbnNwb3J0Lmh0dHAuY2xpZW50J1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4uL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRUcmFuc3BvcnRIdHRwQ2xpZW50UGFja2FnZSAoeyBnZXRDb25zb2xlLCBtZXRob2RDYWxsLCBzZXJ2aWNlTmFtZSA9ICd1bmtub3cnLCBzZXJ2aWNlSWQgPSAndW5rbm93JyB9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7IGdldENvbnNvbGV9KVxuICAgIHJldHVybiB7XG4gICAgICBzZW5kIChsaXN0ZW5lciwgbWVzc2FnZSwgdGltZW91dCA9IDEyMDAwMCwgd2FpdFJlc3BvbnNlID0gdHJ1ZSwgaXNTdHJlYW0gPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIHZhciBodHRwVXJsID0gJ2h0dHA6Ly91bml4OicgKyBsaXN0ZW5lci5maWxlLnJlcGxhY2UoXCI6XCIsXCJcIikgKyAnOidcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdzZW5kOicsIEpTT04uc3RyaW5naWZ5KHsgaHR0cFVybCxsaXN0ZW5lciwgbWVzc2FnZSwgdGltZW91dCwgd2FpdFJlc3BvbnNlLCBpc1N0cmVhbSB9KSlcbiAgICAgICAgICB2YXIgY2FsbFRpbWVvdXQsIGNhbGxcbiAgICAgICAgICBpZiAoaXNTdHJlYW0pIHtcbiAgICAgICAgICAgIGNhbGwgPSByZXF1ZXN0KFxuICAgICAgICAgICAgICB7IG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHByZWFtYmxlQ1JMRjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwb3N0YW1ibGVDUkxGOiB0cnVlLFxuICAgICAgICAgICAgICAgIGJvZHk6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB1cmk6IGh0dHBVcmwgKyAnL19odHRwTWVzc2FnZVN0cmVhbSdcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIHN0cmVhbSBzZXJpYWxpemVyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGNhbGwubGlzdGVuZXJzKCdkYXRhJykpXG4gICAgICAgICAgICB2YXIgcmVjdGlmaWVkQ2FsbCA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuICAgICAgICAgICAgY2FsbC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIHJlY3RpZmllZENhbGwuZW1pdCgnZGF0YScsIEpTT04ucGFyc2UoZGF0YSkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY2FsbC5vbignZXJyb3InLCAoZGF0YSkgPT4gcmVjdGlmaWVkQ2FsbC5lbWl0KCdlcnJvcicsIGRhdGEpKVxuICAgICAgICAgICAgY2FsbC5vbignZW5kJywgKGRhdGEpID0+IHJlY3RpZmllZENhbGwuZW1pdCgnZW5kJywgZGF0YSkpXG4gICAgICAgICAgICByZXNvbHZlKHJlY3RpZmllZENhbGwpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGwgPSByZXF1ZXN0KFxuICAgICAgICAgICAgICB7IG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHByZWFtYmxlQ1JMRjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwb3N0YW1ibGVDUkxGOiB0cnVlLFxuICAgICAgICAgICAgICAgIGJvZHk6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB1cmk6IGh0dHBVcmwgKyAnL19odHRwTWVzc2FnZSdcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICAgICAgICAgIENPTlNPTEUuZGVidWcoJ0h0dHAgcmVxdWVzdCByZXNwb25zZScsIHtlcnJvciwgcmVzcG9uc2UsIGJvZHl9KVxuICAgICAgICAgICAgICAgIGlmIChjYWxsVGltZW91dCljbGVhclRpbWVvdXQoY2FsbFRpbWVvdXQpXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSByZXR1cm4gcmVqZWN0KGVycm9yKVxuICAgICAgICAgICAgICAgIGlmICh3YWl0UmVzcG9uc2UpcmVzb2x2ZShib2R5KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgY2FsbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgY2FsbC5lbmQoKVxuICAgICAgICAgICAgICBDT05TT0xFLndhcm4oJ3NlbmRNZXNzYWdlIHRpbWVvdXQgIHRvICcgKyBsaXN0ZW5lci5maWxlLCB7IG1lc3NhZ2UsIHNlcnZpY2VOYW1lLCB0aW1lb3V0IH0pXG4gICAgICAgICAgICAgIGlmICh3YWl0UmVzcG9uc2UpcmVqZWN0KCdSZXNwb25zZSBwcm9ibGVtczogUkVRVUVTVCBUSU1FT1VUJylcbiAgICAgICAgICAgICAgZWxzZSByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXdhaXRSZXNwb25zZSlyZXNvbHZlKG51bGwpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtnZXRDb25zb2xlLCBtZXRob2RDYWxsfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBnZXRUcmFuc3BvcnRHcnBjQ2xpZW50UGFja2FnZScpXG4gIH1cbn1cbiJdfQ==