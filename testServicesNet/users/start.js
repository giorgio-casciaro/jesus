'use strict';

var uuidV4 = require('uuid/v4');
var path = require('path');
// import { addListener } from 'storyboard'
// import wsServerListener from 'storyboard/lib/listeners/wsServer'
// addListener(wsServerListener)

var CONFIG = require('./config');
var SHARED_CONFIG = require(CONFIG.sharedServicePath + '/service.json');

module.exports = function startMicroservice() {
  var configOverwrite = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var SERVICE;
  return regeneratorRuntime.async(function startMicroservice$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          SERVICE = {
            SHARED_CONFIG: SHARED_CONFIG, CONFIG: CONFIG
          };

          SERVICE.instanceId = uuidV4();

          SERVICE.apiPublic = require('../../../api.http')({ publicOnly: true, httpPort: SHARED_CONFIG.httpPublicApiPort, serviceMethodsFile: CONFIG.serviceMethodsFile, sharedServicePath: CONFIG.sharedServicePath });
          SERVICE.apiPrivate = require('../../../api.http')({ publicOnly: false, httpPort: SHARED_CONFIG.httpPrivateApiPort, serviceMethodsFile: CONFIG.serviceMethodsFile, sharedServicePath: CONFIG.sharedServicePath });
          SERVICE.net = require('../../../net.server')({ netUrl: SHARED_CONFIG.netUrl, serviceMethodsFile: CONFIG.serviceMethodsFile });

          _context.next = 7;
          return regeneratorRuntime.awrap(SERVICE.net.start());

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(SERVICE.apiPublic.start());

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(SERVICE.apiPrivate.start());

        case 11:

          SERVICE.stop = function () {
            SERVICE.apiPublic.stop();
            SERVICE.apiPrivate.stop();
            SERVICE.net.stop();
          };
          return _context.abrupt('return', SERVICE);

        case 13:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXJ0LmVzNiJdLCJuYW1lcyI6WyJ1dWlkVjQiLCJyZXF1aXJlIiwicGF0aCIsIkNPTkZJRyIsIlNIQVJFRF9DT05GSUciLCJzaGFyZWRTZXJ2aWNlUGF0aCIsIm1vZHVsZSIsImV4cG9ydHMiLCJzdGFydE1pY3Jvc2VydmljZSIsImNvbmZpZ092ZXJ3cml0ZSIsIlNFUlZJQ0UiLCJpbnN0YW5jZUlkIiwiYXBpUHVibGljIiwicHVibGljT25seSIsImh0dHBQb3J0IiwiaHR0cFB1YmxpY0FwaVBvcnQiLCJzZXJ2aWNlTWV0aG9kc0ZpbGUiLCJhcGlQcml2YXRlIiwiaHR0cFByaXZhdGVBcGlQb3J0IiwibmV0IiwibmV0VXJsIiwic3RhcnQiLCJzdG9wIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFNBQVNDLFFBQVEsU0FBUixDQUFiO0FBQ0EsSUFBSUMsT0FBT0QsUUFBUSxNQUFSLENBQVg7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSUUsU0FBVUYsUUFBUSxVQUFSLENBQWQ7QUFDQSxJQUFJRyxnQkFBZ0JILFFBQVFFLE9BQU9FLGlCQUFQLEdBQXlCLGVBQWpDLENBQXBCOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLGlCQUFmO0FBQUEsTUFBa0NDLGVBQWxDLHVFQUFvRCxFQUFwRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDWEMsaUJBRFcsR0FDRDtBQUNaTix3Q0FEWSxFQUNHRDtBQURILFdBREM7O0FBSWZPLGtCQUFRQyxVQUFSLEdBQXFCWCxRQUFyQjs7QUFFQVUsa0JBQVFFLFNBQVIsR0FBb0JYLFFBQVEsbUJBQVIsRUFBNkIsRUFBRVksWUFBWSxJQUFkLEVBQW9CQyxVQUFVVixjQUFjVyxpQkFBNUMsRUFBZ0VDLG9CQUFvQmIsT0FBT2Esa0JBQTNGLEVBQWdIWCxtQkFBbUJGLE9BQU9FLGlCQUExSSxFQUE3QixDQUFwQjtBQUNBSyxrQkFBUU8sVUFBUixHQUFxQmhCLFFBQVEsbUJBQVIsRUFBNkIsRUFBQ1ksWUFBWSxLQUFiLEVBQW9CQyxVQUFVVixjQUFjYyxrQkFBNUMsRUFBaUVGLG9CQUFvQmIsT0FBT2Esa0JBQTVGLEVBQWlIWCxtQkFBbUJGLE9BQU9FLGlCQUEzSSxFQUE3QixDQUFyQjtBQUNBSyxrQkFBUVMsR0FBUixHQUFlbEIsUUFBUSxxQkFBUixFQUErQixFQUFDbUIsUUFBUWhCLGNBQWNnQixNQUF2QixFQUE4Qkosb0JBQW9CYixPQUFPYSxrQkFBekQsRUFBL0IsQ0FBZjs7QUFSZTtBQUFBLDBDQVVUTixRQUFRUyxHQUFSLENBQVlFLEtBQVosRUFWUzs7QUFBQTtBQUFBO0FBQUEsMENBV1RYLFFBQVFFLFNBQVIsQ0FBa0JTLEtBQWxCLEVBWFM7O0FBQUE7QUFBQTtBQUFBLDBDQVlUWCxRQUFRTyxVQUFSLENBQW1CSSxLQUFuQixFQVpTOztBQUFBOztBQWNmWCxrQkFBUVksSUFBUixHQUFlLFlBQU07QUFDbkJaLG9CQUFRRSxTQUFSLENBQWtCVSxJQUFsQjtBQUNBWixvQkFBUU8sVUFBUixDQUFtQkssSUFBbkI7QUFDQVosb0JBQVFTLEdBQVIsQ0FBWUcsSUFBWjtBQUNELFdBSkQ7QUFkZSwyQ0FtQlJaLE9BbkJROztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6InN0YXJ0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4vLyBpbXBvcnQgeyBhZGRMaXN0ZW5lciB9IGZyb20gJ3N0b3J5Ym9hcmQnXG4vLyBpbXBvcnQgd3NTZXJ2ZXJMaXN0ZW5lciBmcm9tICdzdG9yeWJvYXJkL2xpYi9saXN0ZW5lcnMvd3NTZXJ2ZXInXG4vLyBhZGRMaXN0ZW5lcih3c1NlcnZlckxpc3RlbmVyKVxuXG52YXIgQ09ORklHICA9IHJlcXVpcmUoJy4vY29uZmlnJylcbnZhciBTSEFSRURfQ09ORklHID0gcmVxdWlyZShDT05GSUcuc2hhcmVkU2VydmljZVBhdGgrJy9zZXJ2aWNlLmpzb24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIHN0YXJ0TWljcm9zZXJ2aWNlIChjb25maWdPdmVyd3JpdGUgPSB7fSkge1xuICB2YXIgU0VSVklDRSA9IHtcbiAgICBTSEFSRURfQ09ORklHLCBDT05GSUdcbiAgfVxuICBTRVJWSUNFLmluc3RhbmNlSWQgPSB1dWlkVjQoKVxuXG4gIFNFUlZJQ0UuYXBpUHVibGljID0gcmVxdWlyZSgnLi4vLi4vLi4vYXBpLmh0dHAnKSh7IHB1YmxpY09ubHk6IHRydWUsIGh0dHBQb3J0OiBTSEFSRURfQ09ORklHLmh0dHBQdWJsaWNBcGlQb3J0LCAgc2VydmljZU1ldGhvZHNGaWxlOiBDT05GSUcuc2VydmljZU1ldGhvZHNGaWxlLCAgc2hhcmVkU2VydmljZVBhdGg6IENPTkZJRy5zaGFyZWRTZXJ2aWNlUGF0aH0pXG4gIFNFUlZJQ0UuYXBpUHJpdmF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL2FwaS5odHRwJykoe3B1YmxpY09ubHk6IGZhbHNlLCBodHRwUG9ydDogU0hBUkVEX0NPTkZJRy5odHRwUHJpdmF0ZUFwaVBvcnQsICBzZXJ2aWNlTWV0aG9kc0ZpbGU6IENPTkZJRy5zZXJ2aWNlTWV0aG9kc0ZpbGUsICBzaGFyZWRTZXJ2aWNlUGF0aDogQ09ORklHLnNoYXJlZFNlcnZpY2VQYXRofSlcbiAgU0VSVklDRS5uZXQgPSAgcmVxdWlyZSgnLi4vLi4vLi4vbmV0LnNlcnZlcicpKHtuZXRVcmw6IFNIQVJFRF9DT05GSUcubmV0VXJsLHNlcnZpY2VNZXRob2RzRmlsZTogQ09ORklHLnNlcnZpY2VNZXRob2RzRmlsZX0pXG5cbiAgYXdhaXQgU0VSVklDRS5uZXQuc3RhcnQoKVxuICBhd2FpdCBTRVJWSUNFLmFwaVB1YmxpYy5zdGFydCgpXG4gIGF3YWl0IFNFUlZJQ0UuYXBpUHJpdmF0ZS5zdGFydCgpXG5cbiAgU0VSVklDRS5zdG9wID0gKCkgPT4ge1xuICAgIFNFUlZJQ0UuYXBpUHVibGljLnN0b3AoKVxuICAgIFNFUlZJQ0UuYXBpUHJpdmF0ZS5zdG9wKClcbiAgICBTRVJWSUNFLm5ldC5zdG9wKClcbiAgfVxuICByZXR1cm4gU0VSVklDRVxufVxuIl19