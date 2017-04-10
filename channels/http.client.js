'use strict';

var request = require('request');
var PACKAGE = 'channel.http.client';
var checkRequired = require('../utils').checkRequired;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHAuY2xpZW50LmVzNiJdLCJuYW1lcyI6WyJyZXF1ZXN0IiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiRXZlbnRFbWl0dGVyIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFRyYW5zcG9ydEh0dHBDbGllbnRQYWNrYWdlIiwiZ2V0Q29uc29sZSIsIm1ldGhvZENhbGwiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsIkNPTlNPTEUiLCJzZW5kIiwibGlzdGVuZXIiLCJtZXNzYWdlIiwidGltZW91dCIsIndhaXRSZXNwb25zZSIsImlzU3RyZWFtIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJodHRwVXJsIiwidXJsIiwicmVwbGFjZSIsImRlYnVnIiwiSlNPTiIsInN0cmluZ2lmeSIsImNhbGxUaW1lb3V0IiwiY2FsbCIsIm1ldGhvZCIsInByZWFtYmxlQ1JMRiIsInBvc3RhbWJsZUNSTEYiLCJib2R5IiwianNvbiIsInVyaSIsInJlY3RpZmllZENhbGwiLCJvbiIsImRhdGEiLCJlbWl0IiwicGFyc2UiLCJlcnJvciIsInJlc3BvbnNlIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImVuZCIsIndhcm4iLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQU1DLFVBQVUscUJBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCRixRQUFRLFVBQVIsRUFBb0JFLGFBQTFDO0FBQ0EsSUFBTUMsZUFBZUgsUUFBUSxRQUFSLENBQXJCOztBQUVBSSxPQUFPQyxPQUFQLEdBQWlCLFNBQVNDLDZCQUFULE9BQWtIO0FBQUEsTUFBeEVDLFVBQXdFLFFBQXhFQSxVQUF3RTtBQUFBLE1BQTVEQyxVQUE0RCxRQUE1REEsVUFBNEQ7QUFBQSw4QkFBaERDLFdBQWdEO0FBQUEsTUFBaERBLFdBQWdELG9DQUFsQyxRQUFrQztBQUFBLDRCQUF4QkMsU0FBd0I7QUFBQSxNQUF4QkEsU0FBd0Isa0NBQVosUUFBWTs7QUFDakksTUFBSUMsVUFBVUosV0FBV0UsV0FBWCxFQUF3QkMsU0FBeEIsRUFBbUNULE9BQW5DLENBQWQ7O0FBRUEsTUFBSTtBQUNGQyxrQkFBYyxFQUFFSyxzQkFBRixFQUFkO0FBQ0EsV0FBTztBQUNMSyxVQURLLGdCQUNDQyxRQURELEVBQ1dDLE9BRFgsRUFDNkU7QUFBQSxZQUF6REMsT0FBeUQsdUVBQS9DLE1BQStDO0FBQUEsWUFBdkNDLFlBQXVDLHVFQUF4QixJQUF3QjtBQUFBLFlBQWxCQyxRQUFrQix1RUFBUCxLQUFPOztBQUNoRixlQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsY0FBSUMsVUFBVSxZQUFZUixTQUFTUyxHQUFULENBQWFDLE9BQWIsQ0FBcUIsU0FBckIsRUFBZ0MsRUFBaEMsRUFBb0NBLE9BQXBDLENBQTRDLElBQTVDLEVBQWtELEVBQWxELENBQTFCO0FBQ0FaLGtCQUFRYSxLQUFSLENBQWMsT0FBZCxFQUF1QkMsS0FBS0MsU0FBTCxDQUFlLEVBQUViLGtCQUFGLEVBQVlDLGdCQUFaLEVBQXFCQyxnQkFBckIsRUFBOEJDLDBCQUE5QixFQUE0Q0Msa0JBQTVDLEVBQWYsQ0FBdkI7QUFDQSxjQUFJVSxXQUFKLEVBQWlCQyxJQUFqQjtBQUNBLGNBQUlYLFFBQUosRUFBYztBQUNaVyxtQkFBTzdCLFFBQ0wsRUFBRThCLFFBQVEsTUFBVjtBQUNFQyw0QkFBYyxJQURoQjtBQUVFQyw2QkFBZSxJQUZqQjtBQUdFQyxvQkFBTWxCLE9BSFI7QUFJRW1CLG9CQUFNLElBSlI7QUFLRUMsbUJBQUtiLFVBQVU7QUFMakIsYUFESyxDQUFQO0FBUUE7QUFDQTtBQUNBLGdCQUFJYyxnQkFBZ0IsSUFBSWhDLFlBQUosRUFBcEI7QUFDQXlCLGlCQUFLUSxFQUFMLENBQVEsTUFBUixFQUFnQixVQUFDQyxJQUFELEVBQVU7QUFDeEJGLDRCQUFjRyxJQUFkLENBQW1CLE1BQW5CLEVBQTJCYixLQUFLYyxLQUFMLENBQVdGLElBQVgsQ0FBM0I7QUFDRCxhQUZEO0FBR0FULGlCQUFLUSxFQUFMLENBQVEsT0FBUixFQUFpQixVQUFDQyxJQUFEO0FBQUEscUJBQVVGLGNBQWNHLElBQWQsQ0FBbUIsT0FBbkIsRUFBNEJELElBQTVCLENBQVY7QUFBQSxhQUFqQjtBQUNBVCxpQkFBS1EsRUFBTCxDQUFRLEtBQVIsRUFBZSxVQUFDQyxJQUFEO0FBQUEscUJBQVVGLGNBQWNHLElBQWQsQ0FBbUIsS0FBbkIsRUFBMEJELElBQTFCLENBQVY7QUFBQSxhQUFmO0FBQ0FsQixvQkFBUWdCLGFBQVI7QUFDRCxXQWxCRCxNQWtCTztBQUNMUCxtQkFBTzdCLFFBQ0wsRUFBRThCLFFBQVEsTUFBVjtBQUNFQyw0QkFBYyxJQURoQjtBQUVFQyw2QkFBZSxJQUZqQjtBQUdFQyxvQkFBTWxCLE9BSFI7QUFJRW1CLG9CQUFNLElBSlI7QUFLRUMsbUJBQUtiLFVBQVU7QUFMakIsYUFESyxFQVFMLFVBQVVtQixLQUFWLEVBQWlCQyxRQUFqQixFQUEyQlQsSUFBM0IsRUFBaUM7QUFDL0JyQixzQkFBUWEsS0FBUixDQUFjLHVCQUFkLEVBQXVDLEVBQUNnQixZQUFELEVBQVFDLGtCQUFSLEVBQWtCVCxVQUFsQixFQUF2QztBQUNBLGtCQUFJTCxXQUFKLEVBQWdCZSxhQUFhZixXQUFiO0FBQ2hCLGtCQUFJYSxLQUFKLEVBQVcsT0FBT3BCLE9BQU9vQixLQUFQLENBQVA7QUFDWCxrQkFBSXhCLFlBQUosRUFBaUJHLFFBQVFhLElBQVI7QUFDbEIsYUFiSSxDQUFQO0FBY0FMLDBCQUFjZ0IsV0FBVyxZQUFNO0FBQzdCZixtQkFBS2dCLEdBQUw7QUFDQWpDLHNCQUFRa0MsSUFBUixDQUFhLDZCQUE2QmhDLFNBQVNTLEdBQW5ELEVBQXdELEVBQUVSLGdCQUFGLEVBQVdMLHdCQUFYLEVBQXdCTSxnQkFBeEIsRUFBeEQ7QUFDQSxrQkFBSUMsWUFBSixFQUFpQkksT0FBTyxvQ0FBUCxFQUFqQixLQUNLRCxRQUFRLElBQVI7QUFDTixhQUxhLEVBS1hKLE9BTFcsQ0FBZDtBQU1EO0FBQ0QsY0FBSSxDQUFDQyxZQUFMLEVBQWtCRyxRQUFRLElBQVI7QUFDbkIsU0E3Q00sQ0FBUDtBQThDRDtBQWhESSxLQUFQO0FBa0RELEdBcERELENBb0RFLE9BQU9xQixLQUFQLEVBQWM7QUFDZDdCLFlBQVE2QixLQUFSLENBQWNBLEtBQWQsRUFBcUIsRUFBQ2pDLHNCQUFELEVBQWFDLHNCQUFiLEVBQXJCO0FBQ0EsVUFBTSxJQUFJc0MsS0FBSixDQUFVLDRDQUFWLENBQU47QUFDRDtBQUNGLENBM0REIiwiZmlsZSI6Imh0dHAuY2xpZW50LmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpXG5jb25zdCBQQUNLQUdFID0gJ2NoYW5uZWwuaHR0cC5jbGllbnQnXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFRyYW5zcG9ydEh0dHBDbGllbnRQYWNrYWdlICh7IGdldENvbnNvbGUsIG1ldGhvZENhbGwsIHNlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnIH0pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG5cbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHsgZ2V0Q29uc29sZX0pXG4gICAgcmV0dXJuIHtcbiAgICAgIHNlbmQgKGxpc3RlbmVyLCBtZXNzYWdlLCB0aW1lb3V0ID0gMTIwMDAwLCB3YWl0UmVzcG9uc2UgPSB0cnVlLCBpc1N0cmVhbSA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgdmFyIGh0dHBVcmwgPSAnaHR0cDovLycgKyBsaXN0ZW5lci51cmwucmVwbGFjZSgnaHR0cDovLycsICcnKS5yZXBsYWNlKCcvLycsICcnKVxuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQ6JywgSlNPTi5zdHJpbmdpZnkoeyBsaXN0ZW5lciwgbWVzc2FnZSwgdGltZW91dCwgd2FpdFJlc3BvbnNlLCBpc1N0cmVhbSB9KSlcbiAgICAgICAgICB2YXIgY2FsbFRpbWVvdXQsIGNhbGxcbiAgICAgICAgICBpZiAoaXNTdHJlYW0pIHtcbiAgICAgICAgICAgIGNhbGwgPSByZXF1ZXN0KFxuICAgICAgICAgICAgICB7IG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHByZWFtYmxlQ1JMRjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwb3N0YW1ibGVDUkxGOiB0cnVlLFxuICAgICAgICAgICAgICAgIGJvZHk6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB1cmk6IGh0dHBVcmwgKyAnL19odHRwTWVzc2FnZVN0cmVhbSdcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIHN0cmVhbSBzZXJpYWxpemVyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGNhbGwubGlzdGVuZXJzKCdkYXRhJykpXG4gICAgICAgICAgICB2YXIgcmVjdGlmaWVkQ2FsbCA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuICAgICAgICAgICAgY2FsbC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIHJlY3RpZmllZENhbGwuZW1pdCgnZGF0YScsIEpTT04ucGFyc2UoZGF0YSkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY2FsbC5vbignZXJyb3InLCAoZGF0YSkgPT4gcmVjdGlmaWVkQ2FsbC5lbWl0KCdlcnJvcicsIGRhdGEpKVxuICAgICAgICAgICAgY2FsbC5vbignZW5kJywgKGRhdGEpID0+IHJlY3RpZmllZENhbGwuZW1pdCgnZW5kJywgZGF0YSkpXG4gICAgICAgICAgICByZXNvbHZlKHJlY3RpZmllZENhbGwpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGwgPSByZXF1ZXN0KFxuICAgICAgICAgICAgICB7IG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHByZWFtYmxlQ1JMRjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwb3N0YW1ibGVDUkxGOiB0cnVlLFxuICAgICAgICAgICAgICAgIGJvZHk6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB1cmk6IGh0dHBVcmwgKyAnL19odHRwTWVzc2FnZSdcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICAgICAgICAgIENPTlNPTEUuZGVidWcoJ0h0dHAgcmVxdWVzdCByZXNwb25zZScsIHtlcnJvciwgcmVzcG9uc2UsIGJvZHl9KVxuICAgICAgICAgICAgICAgIGlmIChjYWxsVGltZW91dCljbGVhclRpbWVvdXQoY2FsbFRpbWVvdXQpXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSByZXR1cm4gcmVqZWN0KGVycm9yKVxuICAgICAgICAgICAgICAgIGlmICh3YWl0UmVzcG9uc2UpcmVzb2x2ZShib2R5KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgY2FsbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgY2FsbC5lbmQoKVxuICAgICAgICAgICAgICBDT05TT0xFLndhcm4oJ3NlbmRNZXNzYWdlIHRpbWVvdXQgIHRvICcgKyBsaXN0ZW5lci51cmwsIHsgbWVzc2FnZSwgc2VydmljZU5hbWUsIHRpbWVvdXQgfSlcbiAgICAgICAgICAgICAgaWYgKHdhaXRSZXNwb25zZSlyZWplY3QoJ1Jlc3BvbnNlIHByb2JsZW1zOiBSRVFVRVNUIFRJTUVPVVQnKVxuICAgICAgICAgICAgICBlbHNlIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghd2FpdFJlc3BvbnNlKXJlc29sdmUobnVsbClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ09OU09MRS5lcnJvcihlcnJvciwge2dldENvbnNvbGUsIG1ldGhvZENhbGx9KVxuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgZHVyaW5nIGdldFRyYW5zcG9ydEdycGNDbGllbnRQYWNrYWdlJylcbiAgfVxufVxuIl19