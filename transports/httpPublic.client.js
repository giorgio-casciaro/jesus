'use strict';

var request = require('request');
var PACKAGE = 'transport.httpPublic.client';
var checkRequired = require('../utils').checkRequired;
var EventEmitter = require('events');

module.exports = function getTransportHttpPublicClientPackage(_ref) {
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
          var newMeta = {};
          for (var metaK in message.meta) {
            newMeta['app-meta-' + metaK] = message.meta[metaK];
          }newMeta['app-meta-stream'] = isStream;
          var httpUrl = 'http://' + listener.url.replace('http://', '').replace('//', '');
          CONSOLE.debug('send:', JSON.stringify({ listener: listener, message: message, timeout: timeout, waitResponse: waitResponse, isStream: isStream }));
          var callTimeout, call;
          if (isStream) {
            call = request({ method: 'POST',
              preambleCRLF: true,
              postambleCRLF: true,
              body: message.data,
              headers: newMeta,
              json: true,
              uri: httpUrl + '/' + message.method
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
              body: message.data,
              headers: newMeta,
              json: true,
              uri: httpUrl + '/' + message.method
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBQdWJsaWMuY2xpZW50LmVzNiJdLCJuYW1lcyI6WyJyZXF1ZXN0IiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiRXZlbnRFbWl0dGVyIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFRyYW5zcG9ydEh0dHBQdWJsaWNDbGllbnRQYWNrYWdlIiwiZ2V0Q29uc29sZSIsIm1ldGhvZENhbGwiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsIkNPTlNPTEUiLCJzZW5kIiwibGlzdGVuZXIiLCJtZXNzYWdlIiwidGltZW91dCIsIndhaXRSZXNwb25zZSIsImlzU3RyZWFtIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJuZXdNZXRhIiwibWV0YUsiLCJtZXRhIiwiaHR0cFVybCIsInVybCIsInJlcGxhY2UiLCJkZWJ1ZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYWxsVGltZW91dCIsImNhbGwiLCJtZXRob2QiLCJwcmVhbWJsZUNSTEYiLCJwb3N0YW1ibGVDUkxGIiwiYm9keSIsImRhdGEiLCJoZWFkZXJzIiwianNvbiIsInVyaSIsInJlY3RpZmllZENhbGwiLCJvbiIsImVtaXQiLCJwYXJzZSIsImVycm9yIiwicmVzcG9uc2UiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZW5kIiwid2FybiIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFVBQVVDLFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBTUMsVUFBVSw2QkFBaEI7QUFDQSxJQUFNQyxnQkFBZ0JGLFFBQVEsVUFBUixFQUFvQkUsYUFBMUM7QUFDQSxJQUFNQyxlQUFlSCxRQUFRLFFBQVIsQ0FBckI7O0FBRUFJLE9BQU9DLE9BQVAsR0FBaUIsU0FBU0MsbUNBQVQsT0FBd0g7QUFBQSxNQUF4RUMsVUFBd0UsUUFBeEVBLFVBQXdFO0FBQUEsTUFBNURDLFVBQTRELFFBQTVEQSxVQUE0RDtBQUFBLDhCQUFoREMsV0FBZ0Q7QUFBQSxNQUFoREEsV0FBZ0Qsb0NB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LE9BQU93QixLQUFQLENBQVA7QUFDWCxrQkFBSTVCLFlBQUosRUFBaUJHLFFBQVFnQixJQUFSO0FBQ2xCLGFBZEksQ0FBUDtBQWVBTCwwQkFBY2lCLFdBQVcsWUFBTTtBQUM3QmhCLG1CQUFLaUIsR0FBTDtBQUNBckMsc0JBQVFzQyxJQUFSLENBQWEsNkJBQTZCcEMsU0FBU1ksR0FBbkQsRUFBd0QsRUFBRVgsZ0JBQUYsRUFBV0wsd0JBQVgsRUFBd0JNLGdCQUF4QixFQUF4RDtBQUNBLGtCQUFJQyxZQUFKLEVBQWlCSSxPQUFPLG9DQUFQLEVBQWpCLEtBQ0tELFFBQVEsSUFBUjtBQUNOLGFBTGEsRUFLWEosT0FMVyxDQUFkO0FBTUQ7QUFDRCxjQUFJLENBQUNDLFlBQUwsRUFBa0JHLFFBQVEsSUFBUjtBQUNuQixTQWxETSxDQUFQO0FBbUREO0FBckRJLEtBQVA7QUF1REQsR0F6REQsQ0F5REUsT0FBT3lCLEtBQVAsRUFBYztBQUNkakMsWUFBUWlDLEtBQVIsQ0FBY0EsS0FBZCxFQUFxQixFQUFDckMsc0JBQUQsRUFBYUMsc0JBQWIsRUFBckI7QUFDQSxVQUFNLElBQUkwQyxLQUFKLENBQVUsNENBQVYsQ0FBTjtBQUNEO0FBQ0YsQ0FoRUQiLCJmaWxlIjoiaHR0cFB1YmxpYy5jbGllbnQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0JylcbmNvbnN0IFBBQ0tBR0UgPSAndHJhbnNwb3J0Lmh0dHBQdWJsaWMuY2xpZW50J1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4uL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRUcmFuc3BvcnRIdHRwUHVibGljQ2xpZW50UGFja2FnZSAoeyBnZXRDb25zb2xlLCBtZXRob2RDYWxsLCBzZXJ2aWNlTmFtZSA9ICd1bmtub3cnLCBzZXJ2aWNlSWQgPSAndW5rbm93JyB9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7IGdldENvbnNvbGV9KVxuICAgIHJldHVybiB7XG4gICAgICBzZW5kIChsaXN0ZW5lciwgbWVzc2FnZSwgdGltZW91dCA9IDEyMDAwMCwgd2FpdFJlc3BvbnNlID0gdHJ1ZSwgaXNTdHJlYW0gPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIHZhciBuZXdNZXRhID0ge31cbiAgICAgICAgICBmb3IgKHZhciBtZXRhSyBpbiBtZXNzYWdlLm1ldGEpbmV3TWV0YVsnYXBwLW1ldGEtJyArIG1ldGFLXSA9IG1lc3NhZ2UubWV0YVttZXRhS11cbiAgICAgICAgICBuZXdNZXRhWydhcHAtbWV0YS1zdHJlYW0nXT1pc1N0cmVhbVxuICAgICAgICAgIHZhciBodHRwVXJsID0gJ2h0dHA6Ly8nICsgbGlzdGVuZXIudXJsLnJlcGxhY2UoJ2h0dHA6Ly8nLCAnJykucmVwbGFjZSgnLy8nLCAnJylcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdzZW5kOicsIEpTT04uc3RyaW5naWZ5KHsgbGlzdGVuZXIsIG1lc3NhZ2UsIHRpbWVvdXQsIHdhaXRSZXNwb25zZSwgaXNTdHJlYW0gfSkpXG4gICAgICAgICAgdmFyIGNhbGxUaW1lb3V0LCBjYWxsXG4gICAgICAgICAgaWYgKGlzU3RyZWFtKSB7XG4gICAgICAgICAgICBjYWxsID0gcmVxdWVzdChcbiAgICAgICAgICAgICAgeyBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBwcmVhbWJsZUNSTEY6IHRydWUsXG4gICAgICAgICAgICAgICAgcG9zdGFtYmxlQ1JMRjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBib2R5OiBtZXNzYWdlLmRhdGEsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogbmV3TWV0YSxcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVyaTogaHR0cFVybCArICcvJyArIG1lc3NhZ2UubWV0aG9kXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvLyBzdHJlYW0gc2VyaWFsaXplclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhjYWxsLmxpc3RlbmVycygnZGF0YScpKVxuICAgICAgICAgICAgdmFyIHJlY3RpZmllZENhbGwgPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgICAgICAgICAgIGNhbGwub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICByZWN0aWZpZWRDYWxsLmVtaXQoJ2RhdGEnLCBKU09OLnBhcnNlKGRhdGEpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNhbGwub24oJ2Vycm9yJywgKGRhdGEpID0+IHJlY3RpZmllZENhbGwuZW1pdCgnZXJyb3InLCBkYXRhKSlcbiAgICAgICAgICAgIGNhbGwub24oJ2VuZCcsIChkYXRhKSA9PiByZWN0aWZpZWRDYWxsLmVtaXQoJ2VuZCcsIGRhdGEpKVxuICAgICAgICAgICAgcmVzb2x2ZShyZWN0aWZpZWRDYWxsKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsID0gcmVxdWVzdChcbiAgICAgICAgICAgICAgeyBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBwcmVhbWJsZUNSTEY6IHRydWUsXG4gICAgICAgICAgICAgICAgcG9zdGFtYmxlQ1JMRjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBib2R5OiBtZXNzYWdlLmRhdGEsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogbmV3TWV0YSxcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVyaTogaHR0cFVybCArICcvJyArIG1lc3NhZ2UubWV0aG9kXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnJvciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgICAgICAgICBDT05TT0xFLmRlYnVnKCdIdHRwIHJlcXVlc3QgcmVzcG9uc2UnLCB7ZXJyb3IsIHJlc3BvbnNlLCBib2R5fSlcbiAgICAgICAgICAgICAgICBpZiAoY2FsbFRpbWVvdXQpY2xlYXJUaW1lb3V0KGNhbGxUaW1lb3V0KVxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikgcmV0dXJuIHJlamVjdChlcnJvcilcbiAgICAgICAgICAgICAgICBpZiAod2FpdFJlc3BvbnNlKXJlc29sdmUoYm9keSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNhbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNhbGwuZW5kKClcbiAgICAgICAgICAgICAgQ09OU09MRS53YXJuKCdzZW5kTWVzc2FnZSB0aW1lb3V0ICB0byAnICsgbGlzdGVuZXIudXJsLCB7IG1lc3NhZ2UsIHNlcnZpY2VOYW1lLCB0aW1lb3V0IH0pXG4gICAgICAgICAgICAgIGlmICh3YWl0UmVzcG9uc2UpcmVqZWN0KCdSZXNwb25zZSBwcm9ibGVtczogUkVRVUVTVCBUSU1FT1VUJylcbiAgICAgICAgICAgICAgZWxzZSByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXdhaXRSZXNwb25zZSlyZXNvbHZlKG51bGwpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtnZXRDb25zb2xlLCBtZXRob2RDYWxsfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBnZXRUcmFuc3BvcnRHcnBjQ2xpZW50UGFja2FnZScpXG4gIH1cbn1cbiJdfQ==