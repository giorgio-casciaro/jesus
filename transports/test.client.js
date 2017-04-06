'use strict';

var PACKAGE = 'transport.test.server';
var checkRequired = require('../utils').checkRequired;
var EventEmitter = require('events');
var globalEmitters = global.transportTestServers = global.transportTestServers || [];

module.exports = function getTransportTestClientPackage(_ref) {
  var getConsole = _ref.getConsole,
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

        var globalEmitter = globalEmitters[listener.url] = globalEmitters[listener.url] || new EventEmitter();
        CONSOLE.debug('send', { listener: listener, message: message, timeout: timeout, waitResponse: waitResponse, isStream: isStream });
        return new Promise(function (resolve, reject) {
          if (isStream) {
            globalEmitter.emit('messageStream', message, function (stream) {
              return resolve(stream);
            });
          } else {
            globalEmitter.emit('message', message, function (response) {
              return resolve(response);
            });
          }
          if (!waitResponse) resolve(null);
        });
      }
    };
  } catch (error) {
    CONSOLE.error(error, { getConsole: getConsole });
    throw new Error('Error during getTransportTestClientPackage');
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QuY2xpZW50LmVzNiJdLCJuYW1lcyI6WyJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsInJlcXVpcmUiLCJFdmVudEVtaXR0ZXIiLCJnbG9iYWxFbWl0dGVycyIsImdsb2JhbCIsInRyYW5zcG9ydFRlc3RTZXJ2ZXJzIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFRyYW5zcG9ydFRlc3RDbGllbnRQYWNrYWdlIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiQ09OU09MRSIsInNlbmQiLCJsaXN0ZW5lciIsIm1lc3NhZ2UiLCJ0aW1lb3V0Iiwid2FpdFJlc3BvbnNlIiwiaXNTdHJlYW0iLCJnbG9iYWxFbWl0dGVyIiwidXJsIiwiZGVidWciLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImVtaXQiLCJzdHJlYW0iLCJyZXNwb25zZSIsImVycm9yIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsVUFBVSx1QkFBaEI7QUFDQSxJQUFNQyxnQkFBZ0JDLFFBQVEsVUFBUixFQUFvQkQsYUFBMUM7QUFDQSxJQUFNRSxlQUFlRCxRQUFRLFFBQVIsQ0FBckI7QUFDQSxJQUFJRSxpQkFBaUJDLE9BQU9DLG9CQUFQLEdBQThCRCxPQUFPQyxvQkFBUCxJQUErQixFQUFsRjs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQixTQUFTQyw2QkFBVCxPQUFxRztBQUFBLE1BQTNEQyxVQUEyRCxRQUEzREEsVUFBMkQ7QUFBQSw4QkFBL0NDLFdBQStDO0FBQUEsTUFBL0NBLFdBQStDLG9DQUFqQyxRQUFpQztBQUFBLDRCQUF2QkMsU0FBdUI7QUFBQSxNQUF2QkEsU0FBdUIsa0NBQVgsUUFBVzs7QUFDcEgsTUFBSUMsVUFBVUgsV0FBV0MsV0FBWCxFQUF3QkMsU0FBeEIsRUFBbUNaLE9BQW5DLENBQWQ7QUFDQSxNQUFJO0FBQ0ZDLGtCQUFjLEVBQUNTLHNCQUFELEVBQWQ7QUFDQSxXQUFPO0FBQ0xJLFVBREssZ0JBQ0NDLFFBREQsRUFDV0MsT0FEWCxFQUM2RTtBQUFBLFlBQXpEQyxPQUF5RCx1RUFBL0MsTUFBK0M7QUFBQSxZQUF2Q0MsWUFBdUMsdUVBQXhCLElBQXdCO0FBQUEsWUFBbEJDLFFBQWtCLHVFQUFQLEtBQU87O0FBQ2hGLFlBQUlDLGdCQUFnQmhCLGVBQWVXLFNBQVNNLEdBQXhCLElBQStCakIsZUFBZVcsU0FBU00sR0FBeEIsS0FBZ0MsSUFBSWxCLFlBQUosRUFBbkY7QUFDQVUsZ0JBQVFTLEtBQVIsQ0FBYyxNQUFkLEVBQXNCLEVBQUNQLGtCQUFELEVBQVdDLGdCQUFYLEVBQW9CQyxnQkFBcEIsRUFBNkJDLDBCQUE3QixFQUEyQ0Msa0JBQTNDLEVBQXRCO0FBQ0EsZUFBTyxJQUFJSSxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLGNBQUlOLFFBQUosRUFBYztBQUNaQywwQkFBY00sSUFBZCxDQUFtQixlQUFuQixFQUFvQ1YsT0FBcEMsRUFBNkMsVUFBQ1csTUFBRDtBQUFBLHFCQUFZSCxRQUFRRyxNQUFSLENBQVo7QUFBQSxhQUE3QztBQUNELFdBRkQsTUFFTztBQUNMUCwwQkFBY00sSUFBZCxDQUFtQixTQUFuQixFQUE4QlYsT0FBOUIsRUFBdUMsVUFBQ1ksUUFBRDtBQUFBLHFCQUFjSixRQUFRSSxRQUFSLENBQWQ7QUFBQSxhQUF2QztBQUNEO0FBQ0QsY0FBSSxDQUFDVixZQUFMLEVBQWtCTSxRQUFRLElBQVI7QUFDbkIsU0FQTSxDQUFQO0FBUUQ7QUFaSSxLQUFQO0FBY0QsR0FoQkQsQ0FnQkUsT0FBT0ssS0FBUCxFQUFjO0FBQ2RoQixZQUFRZ0IsS0FBUixDQUFjQSxLQUFkLEVBQXFCLEVBQUNuQixzQkFBRCxFQUFyQjtBQUNBLFVBQU0sSUFBSW9CLEtBQUosQ0FBVSw0Q0FBVixDQUFOO0FBQ0Q7QUFDRixDQXRCRCIsImZpbGUiOiJ0ZXN0LmNsaWVudC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQQUNLQUdFID0gJ3RyYW5zcG9ydC50ZXN0LnNlcnZlcidcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpXG52YXIgZ2xvYmFsRW1pdHRlcnMgPSBnbG9iYWwudHJhbnNwb3J0VGVzdFNlcnZlcnMgPSBnbG9iYWwudHJhbnNwb3J0VGVzdFNlcnZlcnMgfHwgW11cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRUcmFuc3BvcnRUZXN0Q2xpZW50UGFja2FnZSAoeyBnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSA9ICd1bmtub3cnLCBzZXJ2aWNlSWQgPSAndW5rbm93J30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7Z2V0Q29uc29sZX0pXG4gICAgcmV0dXJuIHtcbiAgICAgIHNlbmQgKGxpc3RlbmVyLCBtZXNzYWdlLCB0aW1lb3V0ID0gMTIwMDAwLCB3YWl0UmVzcG9uc2UgPSB0cnVlLCBpc1N0cmVhbSA9IGZhbHNlKSB7XG4gICAgICAgIHZhciBnbG9iYWxFbWl0dGVyID0gZ2xvYmFsRW1pdHRlcnNbbGlzdGVuZXIudXJsXSA9IGdsb2JhbEVtaXR0ZXJzW2xpc3RlbmVyLnVybF0gfHwgbmV3IEV2ZW50RW1pdHRlcigpXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3NlbmQnLCB7bGlzdGVuZXIsIG1lc3NhZ2UsIHRpbWVvdXQsIHdhaXRSZXNwb25zZSwgaXNTdHJlYW19KVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGlmIChpc1N0cmVhbSkge1xuICAgICAgICAgICAgZ2xvYmFsRW1pdHRlci5lbWl0KCdtZXNzYWdlU3RyZWFtJywgbWVzc2FnZSwgKHN0cmVhbSkgPT4gcmVzb2x2ZShzdHJlYW0pKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWxFbWl0dGVyLmVtaXQoJ21lc3NhZ2UnLCBtZXNzYWdlLCAocmVzcG9uc2UpID0+IHJlc29sdmUocmVzcG9uc2UpKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXdhaXRSZXNwb25zZSlyZXNvbHZlKG51bGwpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtnZXRDb25zb2xlfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBnZXRUcmFuc3BvcnRUZXN0Q2xpZW50UGFja2FnZScpXG4gIH1cbn1cbiJdfQ==