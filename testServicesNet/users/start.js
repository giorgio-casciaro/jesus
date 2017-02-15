'use strict';

var uuidV4 = require('uuid/v4');
var path = require('path');
// import { addListener } from 'storyboard'
// import wsServerListener from 'storyboard/lib/listeners/wsServer'
// addListener(wsServerListener)

var CONFIG = require('./config');
var SHARED_CONFIG = require('../shared/services/users/service.json');

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

          SERVICE.apiPublic = require('../../api.http')({ httpPort: SHARED_CONFIG.httpPublicApiPort, serviceMethodsFile: CONFIG.serviceMethodsFile });
          SERVICE.apiPrivate = require('../../api.http')({ privateOnly: true, httpPort: SHARED_CONFIG.httpPrivateApiPort, serviceMethodsFile: CONFIG.serviceMethodsFile });
          SERVICE.net = require('../../net.server')({ netUrl: SHARED_CONFIG.netUrl, serviceMethodsFile: CONFIG.serviceMethodsFile });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXJ0LmVzNiJdLCJuYW1lcyI6WyJ1dWlkVjQiLCJyZXF1aXJlIiwicGF0aCIsIkNPTkZJRyIsIlNIQVJFRF9DT05GSUciLCJtb2R1bGUiLCJleHBvcnRzIiwic3RhcnRNaWNyb3NlcnZpY2UiLCJjb25maWdPdmVyd3JpdGUiLCJTRVJWSUNFIiwiaW5zdGFuY2VJZCIsImFwaVB1YmxpYyIsImh0dHBQb3J0IiwiaHR0cFB1YmxpY0FwaVBvcnQiLCJzZXJ2aWNlTWV0aG9kc0ZpbGUiLCJhcGlQcml2YXRlIiwicHJpdmF0ZU9ubHkiLCJodHRwUHJpdmF0ZUFwaVBvcnQiLCJuZXQiLCJuZXRVcmwiLCJzdGFydCIsInN0b3AiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsU0FBU0MsUUFBUSxTQUFSLENBQWI7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJRSxTQUFVRixRQUFRLFVBQVIsQ0FBZDtBQUNBLElBQUlHLGdCQUFnQkgsUUFBUSx1Q0FBUixDQUFwQjs7QUFFQUksT0FBT0MsT0FBUCxHQUFpQixTQUFlQyxpQkFBZjtBQUFBLE1BQWtDQyxlQUFsQyx1RUFBb0QsRUFBcEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1hDLGlCQURXLEdBQ0Q7QUFDWkwsd0NBRFksRUFDR0Q7QUFESCxXQURDOztBQUlmTSxrQkFBUUMsVUFBUixHQUFxQlYsUUFBckI7O0FBRUFTLGtCQUFRRSxTQUFSLEdBQW9CVixRQUFRLGdCQUFSLEVBQTBCLEVBQUVXLFVBQVVSLGNBQWNTLGlCQUExQixFQUE4Q0Msb0JBQW9CWCxPQUFPVyxrQkFBekUsRUFBMUIsQ0FBcEI7QUFDQUwsa0JBQVFNLFVBQVIsR0FBcUJkLFFBQVEsZ0JBQVIsRUFBMEIsRUFBQ2UsYUFBYSxJQUFkLEVBQW9CSixVQUFVUixjQUFjYSxrQkFBNUMsRUFBaUVILG9CQUFvQlgsT0FBT1csa0JBQTVGLEVBQTFCLENBQXJCO0FBQ0FMLGtCQUFRUyxHQUFSLEdBQWVqQixRQUFRLGtCQUFSLEVBQTRCLEVBQUNrQixRQUFRZixjQUFjZSxNQUF2QixFQUE4Qkwsb0JBQW9CWCxPQUFPVyxrQkFBekQsRUFBNUIsQ0FBZjs7QUFSZTtBQUFBLDBDQVVUTCxRQUFRUyxHQUFSLENBQVlFLEtBQVosRUFWUzs7QUFBQTtBQUFBO0FBQUEsMENBV1RYLFFBQVFFLFNBQVIsQ0FBa0JTLEtBQWxCLEVBWFM7O0FBQUE7QUFBQTtBQUFBLDBDQVlUWCxRQUFRTSxVQUFSLENBQW1CSyxLQUFuQixFQVpTOztBQUFBOztBQWNmWCxrQkFBUVksSUFBUixHQUFlLFlBQU07QUFDbkJaLG9CQUFRRSxTQUFSLENBQWtCVSxJQUFsQjtBQUNBWixvQkFBUU0sVUFBUixDQUFtQk0sSUFBbkI7QUFDQVosb0JBQVFTLEdBQVIsQ0FBWUcsSUFBWjtBQUNELFdBSkQ7QUFkZSwyQ0FtQlJaLE9BbkJROztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6InN0YXJ0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4vLyBpbXBvcnQgeyBhZGRMaXN0ZW5lciB9IGZyb20gJ3N0b3J5Ym9hcmQnXG4vLyBpbXBvcnQgd3NTZXJ2ZXJMaXN0ZW5lciBmcm9tICdzdG9yeWJvYXJkL2xpYi9saXN0ZW5lcnMvd3NTZXJ2ZXInXG4vLyBhZGRMaXN0ZW5lcih3c1NlcnZlckxpc3RlbmVyKVxuXG52YXIgQ09ORklHICA9IHJlcXVpcmUoJy4vY29uZmlnJylcbnZhciBTSEFSRURfQ09ORklHID0gcmVxdWlyZSgnLi4vc2hhcmVkL3NlcnZpY2VzL3VzZXJzL3NlcnZpY2UuanNvbicpXG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gc3RhcnRNaWNyb3NlcnZpY2UgKGNvbmZpZ092ZXJ3cml0ZSA9IHt9KSB7XG4gIHZhciBTRVJWSUNFID0ge1xuICAgIFNIQVJFRF9DT05GSUcsIENPTkZJR1xuICB9XG4gIFNFUlZJQ0UuaW5zdGFuY2VJZCA9IHV1aWRWNCgpXG5cbiAgU0VSVklDRS5hcGlQdWJsaWMgPSByZXF1aXJlKCcuLi8uLi9hcGkuaHR0cCcpKHsgaHR0cFBvcnQ6IFNIQVJFRF9DT05GSUcuaHR0cFB1YmxpY0FwaVBvcnQsICBzZXJ2aWNlTWV0aG9kc0ZpbGU6IENPTkZJRy5zZXJ2aWNlTWV0aG9kc0ZpbGV9KVxuICBTRVJWSUNFLmFwaVByaXZhdGUgPSByZXF1aXJlKCcuLi8uLi9hcGkuaHR0cCcpKHtwcml2YXRlT25seTogdHJ1ZSwgaHR0cFBvcnQ6IFNIQVJFRF9DT05GSUcuaHR0cFByaXZhdGVBcGlQb3J0LCAgc2VydmljZU1ldGhvZHNGaWxlOiBDT05GSUcuc2VydmljZU1ldGhvZHNGaWxlfSlcbiAgU0VSVklDRS5uZXQgPSAgcmVxdWlyZSgnLi4vLi4vbmV0LnNlcnZlcicpKHtuZXRVcmw6IFNIQVJFRF9DT05GSUcubmV0VXJsLHNlcnZpY2VNZXRob2RzRmlsZTogQ09ORklHLnNlcnZpY2VNZXRob2RzRmlsZX0pXG5cbiAgYXdhaXQgU0VSVklDRS5uZXQuc3RhcnQoKVxuICBhd2FpdCBTRVJWSUNFLmFwaVB1YmxpYy5zdGFydCgpXG4gIGF3YWl0IFNFUlZJQ0UuYXBpUHJpdmF0ZS5zdGFydCgpXG5cbiAgU0VSVklDRS5zdG9wID0gKCkgPT4ge1xuICAgIFNFUlZJQ0UuYXBpUHVibGljLnN0b3AoKVxuICAgIFNFUlZJQ0UuYXBpUHJpdmF0ZS5zdG9wKClcbiAgICBTRVJWSUNFLm5ldC5zdG9wKClcbiAgfVxuICByZXR1cm4gU0VSVklDRVxufVxuIl19