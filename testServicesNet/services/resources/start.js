'use strict';

var path = require('path');
var fs = require('fs');

var CONFIG = require('./config');
var SHARED_CONFIG = require(CONFIG.sharedServicePath + '/service.json');
var serviceId = require('shortid').generate();
fs.writeFileSync(path.join(__dirname, './serviceId.json'), JSON.stringify(serviceId));
var serviceName = CONFIG.serviceName;

module.exports = function startMicroservice() {
  var _this = this;

  var SERVICE;
  return regeneratorRuntime.async(function startMicroservice$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          SERVICE = {
            serviceId: serviceId, serviceName: serviceName, SHARED_CONFIG: SHARED_CONFIG, CONFIG: CONFIG
          };

          SERVICE.apiPublic = require('../../../api.http')({ serviceId: serviceId, serviceName: serviceName, publicOnly: true, httpPort: SHARED_CONFIG.httpPublicApiPort, serviceMethodsFile: CONFIG.serviceMethodsFile, sharedServicesPath: CONFIG.sharedServicesPath, sharedServicePath: CONFIG.sharedServicePath });
          SERVICE.apiPrivate = require('../../../api.http')({ serviceId: serviceId, serviceName: serviceName, publicOnly: false, httpPort: SHARED_CONFIG.httpPrivateApiPort, serviceMethodsFile: CONFIG.serviceMethodsFile, sharedServicesPath: CONFIG.sharedServicesPath, sharedServicePath: CONFIG.sharedServicePath });
          SERVICE.net = require('../../../net.server')({ serviceId: serviceId, serviceName: serviceName, netUrl: SHARED_CONFIG.netUrl, serviceMethodsFile: CONFIG.serviceMethodsFile, sharedServicePath: CONFIG.sharedServicePath, sharedServicesPath: CONFIG.sharedServicesPath });

          SERVICE.start = function _callee() {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(SERVICE.apiPublic.start());

                  case 2:
                    _context.next = 4;
                    return regeneratorRuntime.awrap(SERVICE.apiPrivate.start());

                  case 4:
                    _context.next = 6;
                    return regeneratorRuntime.awrap(SERVICE.net.start());

                  case 6:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, _this);
          };
          SERVICE.stop = function () {
            SERVICE.apiPublic.stop();
            SERVICE.apiPrivate.stop();
            SERVICE.net.stop();
          };
          _context2.next = 8;
          return regeneratorRuntime.awrap(SERVICE.start());

        case 8:
          return _context2.abrupt('return', SERVICE);

        case 9:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXJ0LmVzNiJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImZzIiwiQ09ORklHIiwiU0hBUkVEX0NPTkZJRyIsInNoYXJlZFNlcnZpY2VQYXRoIiwic2VydmljZUlkIiwiZ2VuZXJhdGUiLCJ3cml0ZUZpbGVTeW5jIiwiam9pbiIsIl9fZGlybmFtZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXJ2aWNlTmFtZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJzdGFydE1pY3Jvc2VydmljZSIsIlNFUlZJQ0UiLCJhcGlQdWJsaWMiLCJwdWJsaWNPbmx5IiwiaHR0cFBvcnQiLCJodHRwUHVibGljQXBpUG9ydCIsInNlcnZpY2VNZXRob2RzRmlsZSIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImFwaVByaXZhdGUiLCJodHRwUHJpdmF0ZUFwaVBvcnQiLCJuZXQiLCJuZXRVcmwiLCJzdGFydCIsInN0b3AiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxLQUFLRCxRQUFRLElBQVIsQ0FBVDs7QUFFQSxJQUFJRSxTQUFTRixRQUFRLFVBQVIsQ0FBYjtBQUNBLElBQUlHLGdCQUFnQkgsUUFBUUUsT0FBT0UsaUJBQVAsR0FBMkIsZUFBbkMsQ0FBcEI7QUFDQSxJQUFJQyxZQUFZTCxRQUFRLFNBQVIsRUFBbUJNLFFBQW5CLEVBQWhCO0FBQ0FMLEdBQUdNLGFBQUgsQ0FBaUJSLEtBQUtTLElBQUwsQ0FBVUMsU0FBVixFQUFxQixrQkFBckIsQ0FBakIsRUFBMkRDLEtBQUtDLFNBQUwsQ0FBZU4sU0FBZixDQUEzRDtBQUNBLElBQUlPLGNBQWNWLE9BQU9VLFdBQXpCOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLGlCQUFmO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNYQyxpQkFEVyxHQUNEO0FBQ1pYLGdDQURZLEVBQ0RPLHdCQURDLEVBQ1lULDRCQURaLEVBQzJCRDtBQUQzQixXQURDOztBQUlmYyxrQkFBUUMsU0FBUixHQUFvQmpCLFFBQVEsbUJBQVIsRUFBNkIsRUFBRUssb0JBQUYsRUFBYU8sd0JBQWIsRUFBMEJNLFlBQVksSUFBdEMsRUFBNENDLFVBQVVoQixjQUFjaUIsaUJBQXBFLEVBQXVGQyxvQkFBb0JuQixPQUFPbUIsa0JBQWxILEVBQXNJQyxvQkFBb0JwQixPQUFPb0Isa0JBQWpLLEVBQXFMbEIsbUJBQW1CRixPQUFPRSxpQkFBL00sRUFBN0IsQ0FBcEI7QUFDQVksa0JBQVFPLFVBQVIsR0FBcUJ2QixRQUFRLG1CQUFSLEVBQTZCLEVBQUNLLG9CQUFELEVBQVlPLHdCQUFaLEVBQXlCTSxZQUFZLEtBQXJDLEVBQTRDQyxVQUFVaEIsY0FBY3FCLGtCQUFwRSxFQUF3Rkgsb0JBQW9CbkIsT0FBT21CLGtCQUFuSCxFQUF1SUMsb0JBQW9CcEIsT0FBT29CLGtCQUFsSyxFQUFzTGxCLG1CQUFtQkYsT0FBT0UsaUJBQWhOLEVBQTdCLENBQXJCO0FBQ0FZLGtCQUFRUyxHQUFSLEdBQWN6QixRQUFRLHFCQUFSLEVBQStCLEVBQUNLLG9CQUFELEVBQVlPLHdCQUFaLEVBQXlCYyxRQUFRdkIsY0FBY3VCLE1BQS9DLEVBQXVETCxvQkFBb0JuQixPQUFPbUIsa0JBQWxGLEVBQXNHakIsbUJBQW1CRixPQUFPRSxpQkFBaEksRUFBbUprQixvQkFBb0JwQixPQUFPb0Isa0JBQTlLLEVBQS9CLENBQWQ7O0FBRUFOLGtCQUFRVyxLQUFSLEdBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG9EQUNSWCxRQUFRQyxTQUFSLENBQWtCVSxLQUFsQixFQURROztBQUFBO0FBQUE7QUFBQSxvREFFUlgsUUFBUU8sVUFBUixDQUFtQkksS0FBbkIsRUFGUTs7QUFBQTtBQUFBO0FBQUEsb0RBR1JYLFFBQVFTLEdBQVIsQ0FBWUUsS0FBWixFQUhROztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQWhCO0FBS0FYLGtCQUFRWSxJQUFSLEdBQWUsWUFBTTtBQUNuQlosb0JBQVFDLFNBQVIsQ0FBa0JXLElBQWxCO0FBQ0FaLG9CQUFRTyxVQUFSLENBQW1CSyxJQUFuQjtBQUNBWixvQkFBUVMsR0FBUixDQUFZRyxJQUFaO0FBQ0QsV0FKRDtBQWJlO0FBQUEsMENBa0JUWixRQUFRVyxLQUFSLEVBbEJTOztBQUFBO0FBQUEsNENBbUJSWCxPQW5CUTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJzdGFydC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuXG52YXIgQ09ORklHID0gcmVxdWlyZSgnLi9jb25maWcnKVxudmFyIFNIQVJFRF9DT05GSUcgPSByZXF1aXJlKENPTkZJRy5zaGFyZWRTZXJ2aWNlUGF0aCArICcvc2VydmljZS5qc29uJylcbnZhciBzZXJ2aWNlSWQgPSByZXF1aXJlKCdzaG9ydGlkJykuZ2VuZXJhdGUoKVxuZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zZXJ2aWNlSWQuanNvbicpLCBKU09OLnN0cmluZ2lmeShzZXJ2aWNlSWQpKVxudmFyIHNlcnZpY2VOYW1lID0gQ09ORklHLnNlcnZpY2VOYW1lXG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gc3RhcnRNaWNyb3NlcnZpY2UgKCkge1xuICB2YXIgU0VSVklDRSA9IHtcbiAgICBzZXJ2aWNlSWQsIHNlcnZpY2VOYW1lLCBTSEFSRURfQ09ORklHLCBDT05GSUdcbiAgfVxuICBTRVJWSUNFLmFwaVB1YmxpYyA9IHJlcXVpcmUoJy4uLy4uLy4uL2FwaS5odHRwJykoeyBzZXJ2aWNlSWQsIHNlcnZpY2VOYW1lLCBwdWJsaWNPbmx5OiB0cnVlLCBodHRwUG9ydDogU0hBUkVEX0NPTkZJRy5odHRwUHVibGljQXBpUG9ydCwgc2VydmljZU1ldGhvZHNGaWxlOiBDT05GSUcuc2VydmljZU1ldGhvZHNGaWxlLCBzaGFyZWRTZXJ2aWNlc1BhdGg6IENPTkZJRy5zaGFyZWRTZXJ2aWNlc1BhdGgsIHNoYXJlZFNlcnZpY2VQYXRoOiBDT05GSUcuc2hhcmVkU2VydmljZVBhdGh9KVxuICBTRVJWSUNFLmFwaVByaXZhdGUgPSByZXF1aXJlKCcuLi8uLi8uLi9hcGkuaHR0cCcpKHtzZXJ2aWNlSWQsIHNlcnZpY2VOYW1lLCBwdWJsaWNPbmx5OiBmYWxzZSwgaHR0cFBvcnQ6IFNIQVJFRF9DT05GSUcuaHR0cFByaXZhdGVBcGlQb3J0LCBzZXJ2aWNlTWV0aG9kc0ZpbGU6IENPTkZJRy5zZXJ2aWNlTWV0aG9kc0ZpbGUsIHNoYXJlZFNlcnZpY2VzUGF0aDogQ09ORklHLnNoYXJlZFNlcnZpY2VzUGF0aCwgc2hhcmVkU2VydmljZVBhdGg6IENPTkZJRy5zaGFyZWRTZXJ2aWNlUGF0aH0pXG4gIFNFUlZJQ0UubmV0ID0gcmVxdWlyZSgnLi4vLi4vLi4vbmV0LnNlcnZlcicpKHtzZXJ2aWNlSWQsIHNlcnZpY2VOYW1lLCBuZXRVcmw6IFNIQVJFRF9DT05GSUcubmV0VXJsLCBzZXJ2aWNlTWV0aG9kc0ZpbGU6IENPTkZJRy5zZXJ2aWNlTWV0aG9kc0ZpbGUsIHNoYXJlZFNlcnZpY2VQYXRoOiBDT05GSUcuc2hhcmVkU2VydmljZVBhdGgsIHNoYXJlZFNlcnZpY2VzUGF0aDogQ09ORklHLnNoYXJlZFNlcnZpY2VzUGF0aH0pXG5cbiAgU0VSVklDRS5zdGFydCA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBTRVJWSUNFLmFwaVB1YmxpYy5zdGFydCgpXG4gICAgYXdhaXQgU0VSVklDRS5hcGlQcml2YXRlLnN0YXJ0KClcbiAgICBhd2FpdCBTRVJWSUNFLm5ldC5zdGFydCgpXG4gIH1cbiAgU0VSVklDRS5zdG9wID0gKCkgPT4ge1xuICAgIFNFUlZJQ0UuYXBpUHVibGljLnN0b3AoKVxuICAgIFNFUlZJQ0UuYXBpUHJpdmF0ZS5zdG9wKClcbiAgICBTRVJWSUNFLm5ldC5zdG9wKClcbiAgfVxuICBhd2FpdCBTRVJWSUNFLnN0YXJ0KClcbiAgcmV0dXJuIFNFUlZJQ0Vcbn1cbiJdfQ==