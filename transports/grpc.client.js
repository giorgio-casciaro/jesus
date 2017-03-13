'use strict';

var grpc = require('grpc');
var zlib = require('zlib');
var PACKAGE = 'transport.grpc.client';
var checkRequired = require('../jesus').checkRequired;

module.exports = function getTransportGrpcClientPackage(_ref) {
  var serialize = _ref.serialize,
      deserialize = _ref.deserialize,
      getConsole = _ref.getConsole,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);

  try {
    var serializeDefault = function serializeDefault(obj) {
      return zlib.deflateSync(JSON.stringify(obj));
    };
    var deserializeDefault = function deserializeDefault(buffer) {
      return JSON.parse(zlib.inflateSync(buffer));
    };
    var grpcService = {
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
    var getClient = function getClient(url) {
      var ClientClass = grpc.makeGenericClientConstructor(grpcService);
      return new ClientClass(url, grpc.credentials.createInsecure());
    };
    checkRequired({ serviceName: serviceName, serviceId: serviceId, getConsole: getConsole });
    return {
      send: function send(listener, message) {
        var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 120000;
        var waitResponse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        var isStream = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

        return new Promise(function (resolve, reject) {
          CONSOLE.debug('send:', JSON.stringify({ listener: listener, message: message, timeout: timeout, waitResponse: waitResponse, isStream: isStream }));
          var client = getClient(listener.url);
          var callTimeout, call;
          if (isStream) {
            call = client.messageStream(message);
            resolve(call);
          } else {
            CONSOLE.debug('client.message call');
            call = client.message(message, function (error, serviceResponse) {
              CONSOLE.debug('client.message response:', JSON.stringify({ error: error, serviceResponse: serviceResponse }));
              if (callTimeout) clearTimeout(callTimeout);
              if (error) return reject(error);
              if (waitResponse) resolve(serviceResponse);
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
    CONSOLE.error(error, { getConsole: getConsole });
    throw new Error('Error during getTransportGrpcClientPackage');
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdycGMuY2xpZW50LmVzNiJdLCJuYW1lcyI6WyJncnBjIiwicmVxdWlyZSIsInpsaWIiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRUcmFuc3BvcnRHcnBjQ2xpZW50UGFja2FnZSIsInNlcmlhbGl6ZSIsImRlc2VyaWFsaXplIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiQ09OU09MRSIsInNlcmlhbGl6ZURlZmF1bHQiLCJvYmoiLCJkZWZsYXRlU3luYyIsIkpTT04iLCJzdHJpbmdpZnkiLCJkZXNlcmlhbGl6ZURlZmF1bHQiLCJidWZmZXIiLCJwYXJzZSIsImluZmxhdGVTeW5jIiwiZ3JwY1NlcnZpY2UiLCJtZXNzYWdlIiwicGF0aCIsInJlcXVlc3RTdHJlYW0iLCJyZXNwb25zZVN0cmVhbSIsInJlcXVlc3RTZXJpYWxpemUiLCJyZXF1ZXN0RGVzZXJpYWxpemUiLCJyZXNwb25zZVNlcmlhbGl6ZSIsInJlc3BvbnNlRGVzZXJpYWxpemUiLCJtZXNzYWdlU3RyZWFtIiwiZ2V0Q2xpZW50IiwidXJsIiwiQ2xpZW50Q2xhc3MiLCJtYWtlR2VuZXJpY0NsaWVudENvbnN0cnVjdG9yIiwiY3JlZGVudGlhbHMiLCJjcmVhdGVJbnNlY3VyZSIsInNlbmQiLCJsaXN0ZW5lciIsInRpbWVvdXQiLCJ3YWl0UmVzcG9uc2UiLCJpc1N0cmVhbSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZGVidWciLCJjbGllbnQiLCJjYWxsVGltZW91dCIsImNhbGwiLCJlcnJvciIsInNlcnZpY2VSZXNwb25zZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJlbmQiLCJ3YXJuIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQU1FLFVBQVUsdUJBQWhCO0FBQ0EsSUFB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QUN6RHZDLHNCQUFRa0MsS0FBUixDQUFjLDBCQUFkLEVBQTBDOUIsS0FBS0MsU0FBTCxDQUFlLEVBQUNpQyxZQUFELEVBQVFDLGdDQUFSLEVBQWYsQ0FBMUM7QUFDQSxrQkFBSUgsV0FBSixFQUFnQkksYUFBYUosV0FBYjtBQUNoQixrQkFBSUUsS0FBSixFQUFXLE9BQU9MLE9BQU9LLEtBQVAsQ0FBUDtBQUNYLGtCQUFJVCxZQUFKLEVBQWlCRyxRQUFRTyxlQUFSO0FBQ2xCLGFBTE0sQ0FBUDtBQU1BSCwwQkFBY0ssV0FBVyxZQUFNO0FBQzdCSixtQkFBS0ssR0FBTDtBQUNBMUMsc0JBQVEyQyxJQUFSLENBQWEsNkJBQTZCaEIsU0FBU04sR0FBbkQsRUFBd0QsRUFBRVYsZ0JBQUYsRUFBVWIsd0JBQVYsRUFBdUI4QixnQkFBdkIsRUFBeEQ7QUFDQSxrQkFBSUMsWUFBSixFQUFpQkksT0FBTyxvQ0FBUCxFQUFqQixLQUNLRCxRQUFRLElBQVI7QUFDTixhQUxhLEVBS1hKLE9BTFcsQ0FBZDtBQU1EO0FBQ0QsY0FBSSxDQUFDQyxZQUFMLEVBQWtCRyxRQUFRLElBQVI7QUFDbkIsU0F2Qk0sQ0FBUDtBQXdCRDtBQTFCSSxLQUFQO0FBNEJELEdBeERELENBd0RFLE9BQU9NLEtBQVAsRUFBYztBQUNkdEMsWUFBUXNDLEtBQVIsQ0FBY0EsS0FBZCxFQUFxQixFQUFDekMsc0JBQUQsRUFBckI7QUFDQSxVQUFNLElBQUkrQyxLQUFKLENBQVUsNENBQVYsQ0FBTjtBQUNEO0FBQ0YsQ0EvREQiLCJmaWxlIjoiZ3JwYy5jbGllbnQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdycGMgPSByZXF1aXJlKCdncnBjJylcbnZhciB6bGliID0gcmVxdWlyZSgnemxpYicpXG5jb25zdCBQQUNLQUdFID0gJ3RyYW5zcG9ydC5ncnBjLmNsaWVudCdcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRUcmFuc3BvcnRHcnBjQ2xpZW50UGFja2FnZSAoe3NlcmlhbGl6ZSwgZGVzZXJpYWxpemUsIGdldENvbnNvbGUsIHNlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcblxuICB0cnkge1xuICAgIHZhciBzZXJpYWxpemVEZWZhdWx0ID0gKG9iaikgPT4gemxpYi5kZWZsYXRlU3luYyhKU09OLnN0cmluZ2lmeShvYmopKVxuICAgIHZhciBkZXNlcmlhbGl6ZURlZmF1bHQgPSAoYnVmZmVyKSA9PiBKU09OLnBhcnNlKHpsaWIuaW5mbGF0ZVN5bmMoYnVmZmVyKSlcbiAgICB2YXIgZ3JwY1NlcnZpY2UgPSB7XG4gICAgICBtZXNzYWdlOiB7XG4gICAgICAgIHBhdGg6ICdtZXNzYWdlJyxcbiAgICAgICAgcmVxdWVzdFN0cmVhbTogbnVsbCxcbiAgICAgICAgcmVzcG9uc2VTdHJlYW06IG51bGwsXG4gICAgICAgIHJlcXVlc3RTZXJpYWxpemU6IHNlcmlhbGl6ZSB8fCBzZXJpYWxpemVEZWZhdWx0LFxuICAgICAgICByZXF1ZXN0RGVzZXJpYWxpemU6IGRlc2VyaWFsaXplIHx8IGRlc2VyaWFsaXplRGVmYXVsdCxcbiAgICAgICAgcmVzcG9uc2VTZXJpYWxpemU6IHNlcmlhbGl6ZSB8fCBzZXJpYWxpemVEZWZhdWx0LFxuICAgICAgICByZXNwb25zZURlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZSB8fCBkZXNlcmlhbGl6ZURlZmF1bHRcbiAgICAgIH0sXG4gICAgICBtZXNzYWdlU3RyZWFtOiB7XG4gICAgICAgIHBhdGg6ICdtZXNzYWdlU3RyZWFtJyxcbiAgICAgICAgcmVxdWVzdFN0cmVhbTogZmFsc2UsXG4gICAgICAgIHJlc3BvbnNlU3RyZWFtOiB0cnVlLFxuICAgICAgICByZXF1ZXN0U2VyaWFsaXplOiBzZXJpYWxpemUgfHwgc2VyaWFsaXplRGVmYXVsdCxcbiAgICAgICAgcmVxdWVzdERlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZSB8fCBkZXNlcmlhbGl6ZURlZmF1bHQsXG4gICAgICAgIHJlc3BvbnNlU2VyaWFsaXplOiBzZXJpYWxpemUgfHwgc2VyaWFsaXplRGVmYXVsdCxcbiAgICAgICAgcmVzcG9uc2VEZXNlcmlhbGl6ZTogZGVzZXJpYWxpemUgfHwgZGVzZXJpYWxpemVEZWZhdWx0XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBnZXRDbGllbnQgPSAodXJsKSA9PiB7XG4gICAgICB2YXIgQ2xpZW50Q2xhc3MgPSBncnBjLm1ha2VHZW5lcmljQ2xpZW50Q29uc3RydWN0b3IoZ3JwY1NlcnZpY2UpXG4gICAgICByZXR1cm4gbmV3IENsaWVudENsYXNzKHVybCwgZ3JwYy5jcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgIH1cbiAgICBjaGVja1JlcXVpcmVkKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBnZXRDb25zb2xlfSlcbiAgICByZXR1cm4ge1xuICAgICAgc2VuZCAobGlzdGVuZXIsIG1lc3NhZ2UsIHRpbWVvdXQgPSAxMjAwMDAsIHdhaXRSZXNwb25zZSA9IHRydWUsIGlzU3RyZWFtID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdzZW5kOicsIEpTT04uc3RyaW5naWZ5KHtsaXN0ZW5lciwgbWVzc2FnZSwgdGltZW91dCwgd2FpdFJlc3BvbnNlLCBpc1N0cmVhbX0pKVxuICAgICAgICAgIHZhciBjbGllbnQgPSBnZXRDbGllbnQobGlzdGVuZXIudXJsKVxuICAgICAgICAgIHZhciBjYWxsVGltZW91dCwgY2FsbFxuICAgICAgICAgIGlmIChpc1N0cmVhbSkge1xuICAgICAgICAgICAgY2FsbCA9IGNsaWVudC5tZXNzYWdlU3RyZWFtKG1lc3NhZ2UpXG4gICAgICAgICAgICByZXNvbHZlKGNhbGwpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIENPTlNPTEUuZGVidWcoJ2NsaWVudC5tZXNzYWdlIGNhbGwnKVxuICAgICAgICAgICAgY2FsbCA9IGNsaWVudC5tZXNzYWdlKG1lc3NhZ2UsIChlcnJvciwgc2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgIENPTlNPTEUuZGVidWcoJ2NsaWVudC5tZXNzYWdlIHJlc3BvbnNlOicsIEpTT04uc3RyaW5naWZ5KHtlcnJvciwgc2VydmljZVJlc3BvbnNlfSkpXG4gICAgICAgICAgICAgIGlmIChjYWxsVGltZW91dCljbGVhclRpbWVvdXQoY2FsbFRpbWVvdXQpXG4gICAgICAgICAgICAgIGlmIChlcnJvcikgcmV0dXJuIHJlamVjdChlcnJvcilcbiAgICAgICAgICAgICAgaWYgKHdhaXRSZXNwb25zZSlyZXNvbHZlKHNlcnZpY2VSZXNwb25zZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjYWxsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBjYWxsLmVuZCgpXG4gICAgICAgICAgICAgIENPTlNPTEUud2Fybignc2VuZE1lc3NhZ2UgdGltZW91dCAgdG8gJyArIGxpc3RlbmVyLnVybCwgeyBtZXNzYWdlLHNlcnZpY2VOYW1lLCB0aW1lb3V0IH0pXG4gICAgICAgICAgICAgIGlmICh3YWl0UmVzcG9uc2UpcmVqZWN0KCdSZXNwb25zZSBwcm9ibGVtczogUkVRVUVTVCBUSU1FT1VUJylcbiAgICAgICAgICAgICAgZWxzZSByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXdhaXRSZXNwb25zZSlyZXNvbHZlKG51bGwpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtnZXRDb25zb2xlfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBnZXRUcmFuc3BvcnRHcnBjQ2xpZW50UGFja2FnZScpXG4gIH1cbn1cbiJdfQ==