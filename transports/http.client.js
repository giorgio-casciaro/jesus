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
            console.log(call.listeners('data'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHAuY2xpZW50LmVzNiJdLCJuYW1lcyI6WyJyZXF1ZXN0IiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiRXZlbnRFbWl0dGVyIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFRyYW5zcG9ydEh0dHBDbGllbnRQYWNrYWdlIiwiZ2V0Q29uc29sZSIsIm1ldGhvZENhbGwiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsIkNPTlNPTEUiLCJzZW5kIiwibGlzdGVuZXIiLCJtZXNzYWdlIiwidGltZW91dCIsIndhaXRSZXNwb25zZSIsImlzU3RyZWFtIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJodHRwVXJsIiwidXJsIiwicmVwbGFjZSIsImRlYnVnIiwiSlNPTiIsInN0cmluZ2lmeSIsImNhbGxUaW1lb3V0IiwiY2FsbCIsIm1ldGhvZCIsInByZWFtYmxlQ1JMRiIsInBvc3RhbWJsZUNSTEYiLCJib2R5IiwianNvbiIsInVyaSIsImNvbnNvbGUiLCJsb2ciLCJsaXN0ZW5lcnMiLCJyZWN0aWZpZWRDYWxsIiwib24iLCJkYXRhIiwiZW1pdCIsInBhcnNlIiwiZXJyb3IiLCJyZXNwb25zZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJlbmQiLCJ3YXJuIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsVUFBVUMsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFNQyxVQUFVLHVCQUFoQjtBQUNBLElBQU1DLGdCQUFnQkYsUUFBUSxVQUFSLEVBQW9CRSxhQUExQztBQUNBLElBQU1DLGVBQWVILFFBQVEsUUFBUixDQUFyQjs7QUFFQUksT0FBT0MsT0FBUCxHQUFpQixTQUFTQyw2QkFBVCxPQUFrSDtBQUFBLE1BQXhFQyxVQUF3RSxRQUF4RUEsVUFBd0U7QUFBQSxNQUE1REMsVUFBNEQsUUFBNURBLFVBQTREO0FBQUEsOEJBQWhEQyxXQUFnRDtBQUFBLE1BQWhEQSxXQUFnRCxvQ0FBbEMsUUFBa0M7QUFBQSw0QkFB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LFlBQUosRUFBaUJJLE9BQU8sb0NBQVAsRUFBakIsS0FDS0QsUUFBUSxJQUFSO0FBQ04sYUFMYSxFQUtYSixPQUxXLENBQWQ7QUFNRDtBQUNELGNBQUksQ0FBQ0MsWUFBTCxFQUFrQkcsUUFBUSxJQUFSO0FBQ25CLFNBN0NNLENBQVA7QUE4Q0Q7QUFoREksS0FBUDtBQWtERCxHQXBERCxDQW9ERSxPQUFPd0IsS0FBUCxFQUFjO0FBQ2RoQyxZQUFRZ0MsS0FBUixDQUFjQSxLQUFkLEVBQXFCLEVBQUNwQyxzQkFBRCxFQUFhQyxzQkFBYixFQUFyQjtBQUNBLFVBQU0sSUFBSXlDLEtBQUosQ0FBVSw0Q0FBVixDQUFOO0FBQ0Q7QUFDRixDQTNERCIsImZpbGUiOiJodHRwLmNsaWVudC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxuY29uc3QgUEFDS0FHRSA9ICd0cmFuc3BvcnQuaHR0cC5jbGllbnQnXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFRyYW5zcG9ydEh0dHBDbGllbnRQYWNrYWdlICh7IGdldENvbnNvbGUsIG1ldGhvZENhbGwsIHNlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnIH0pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG5cbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHsgZ2V0Q29uc29sZX0pXG4gICAgcmV0dXJuIHtcbiAgICAgIHNlbmQgKGxpc3RlbmVyLCBtZXNzYWdlLCB0aW1lb3V0ID0gMTIwMDAwLCB3YWl0UmVzcG9uc2UgPSB0cnVlLCBpc1N0cmVhbSA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgdmFyIGh0dHBVcmwgPSAnaHR0cDovLycgKyBsaXN0ZW5lci51cmwucmVwbGFjZSgnaHR0cDovLycsICcnKS5yZXBsYWNlKCcvLycsICcnKVxuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQ6JywgSlNPTi5zdHJpbmdpZnkoeyBsaXN0ZW5lciwgbWVzc2FnZSwgdGltZW91dCwgd2FpdFJlc3BvbnNlLCBpc1N0cmVhbSB9KSlcbiAgICAgICAgICB2YXIgY2FsbFRpbWVvdXQsIGNhbGxcbiAgICAgICAgICBpZiAoaXNTdHJlYW0pIHtcbiAgICAgICAgICAgIGNhbGwgPSByZXF1ZXN0KFxuICAgICAgICAgICAgICB7IG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHByZWFtYmxlQ1JMRjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwb3N0YW1ibGVDUkxGOiB0cnVlLFxuICAgICAgICAgICAgICAgIGJvZHk6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB1cmk6IGh0dHBVcmwgKyAnL19odHRwTWVzc2FnZVN0cmVhbSdcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIHN0cmVhbSBzZXJpYWxpemVyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYWxsLmxpc3RlbmVycygnZGF0YScpKVxuICAgICAgICAgICAgdmFyIHJlY3RpZmllZENhbGwgPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgICAgICAgICAgIGNhbGwub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICByZWN0aWZpZWRDYWxsLmVtaXQoJ2RhdGEnLCBKU09OLnBhcnNlKGRhdGEpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNhbGwub24oJ2Vycm9yJywgKGRhdGEpID0+IHJlY3RpZmllZENhbGwuZW1pdCgnZXJyb3InLCBkYXRhKSlcbiAgICAgICAgICAgIGNhbGwub24oJ2VuZCcsIChkYXRhKSA9PiByZWN0aWZpZWRDYWxsLmVtaXQoJ2VuZCcsIGRhdGEpKVxuICAgICAgICAgICAgcmVzb2x2ZShyZWN0aWZpZWRDYWxsKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsID0gcmVxdWVzdChcbiAgICAgICAgICAgICAgeyBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBwcmVhbWJsZUNSTEY6IHRydWUsXG4gICAgICAgICAgICAgICAgcG9zdGFtYmxlQ1JMRjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBib2R5OiBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIGpzb246IHRydWUsXG4gICAgICAgICAgICAgICAgdXJpOiBodHRwVXJsICsgJy9faHR0cE1lc3NhZ2UnXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnJvciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgICAgICAgICBDT05TT0xFLmRlYnVnKCdIdHRwIHJlcXVlc3QgcmVzcG9uc2UnLCB7ZXJyb3IsIHJlc3BvbnNlLCBib2R5fSlcbiAgICAgICAgICAgICAgICBpZiAoY2FsbFRpbWVvdXQpY2xlYXJUaW1lb3V0KGNhbGxUaW1lb3V0KVxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikgcmV0dXJuIHJlamVjdChlcnJvcilcbiAgICAgICAgICAgICAgICBpZiAod2FpdFJlc3BvbnNlKXJlc29sdmUoYm9keSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNhbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNhbGwuZW5kKClcbiAgICAgICAgICAgICAgQ09OU09MRS53YXJuKCdzZW5kTWVzc2FnZSB0aW1lb3V0ICB0byAnICsgbGlzdGVuZXIudXJsLCB7IG1lc3NhZ2UsIHNlcnZpY2VOYW1lLCB0aW1lb3V0IH0pXG4gICAgICAgICAgICAgIGlmICh3YWl0UmVzcG9uc2UpcmVqZWN0KCdSZXNwb25zZSBwcm9ibGVtczogUkVRVUVTVCBUSU1FT1VUJylcbiAgICAgICAgICAgICAgZWxzZSByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXdhaXRSZXNwb25zZSlyZXNvbHZlKG51bGwpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtnZXRDb25zb2xlLCBtZXRob2RDYWxsfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBnZXRUcmFuc3BvcnRHcnBjQ2xpZW50UGFja2FnZScpXG4gIH1cbn1cbiJdfQ==