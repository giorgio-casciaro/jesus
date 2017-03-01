'use strict';

var path = require('path');
var fs = require('fs');
var jesus = require('../../jesus');
module.exports = function startMicroservice(CONFIG, serviceId, methodsFile) {
  var _this = this;

  var serviceName, getSharedConfig, getConsole, getMethods, SHARED_CONFIG, SERVICE;
  return regeneratorRuntime.async(function startMicroservice$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          serviceName = CONFIG.serviceName;
          getSharedConfig = jesus.getSharedConfig(CONFIG.sharedServicesPath);

          getConsole = function getConsole(serviceName, serviceId, pack) {
            return jesus.getConsole(CONFIG.console, serviceName, serviceId, pack);
          };

          getMethods = function getMethods() {
            if (CONFIG.NODE_ENV === 'development') delete require.cache[require.resolve(methodsFile)];
            return require(methodsFile);
          };

          _context2.next = 6;
          return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'service'));

        case 6:
          SHARED_CONFIG = _context2.sent;
          SERVICE = { serviceId: serviceId, serviceName: serviceName, SHARED_CONFIG: SHARED_CONFIG, CONFIG: CONFIG };


          SERVICE.apiPublic = require('../../api.http')({ serviceId: serviceId, serviceName: serviceName, publicOnly: true, httpPort: SHARED_CONFIG.httpPublicApiPort, getMethods: getMethods, getSharedConfig: getSharedConfig, getConsole: getConsole });
          SERVICE.apiPrivate = require('../../api.http')({ serviceId: serviceId, serviceName: serviceName, publicOnly: false, httpPort: SHARED_CONFIG.httpPrivateApiPort, getMethods: getMethods, getSharedConfig: getSharedConfig, getConsole: getConsole });
          SERVICE.net = require('../../net.server')({ serviceId: serviceId, serviceName: serviceName, netUrl: SHARED_CONFIG.netUrl, getMethods: getMethods, getSharedConfig: getSharedConfig, getConsole: getConsole });

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
          _context2.next = 15;
          return regeneratorRuntime.awrap(SERVICE.start());

        case 15:
          return _context2.abrupt('return', SERVICE);

        case 16:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXJ0LmVzNiJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImZzIiwiamVzdXMiLCJtb2R1bGUiLCJleHBvcnRzIiwic3RhcnRNaWNyb3NlcnZpY2UiLCJDT05GSUciLCJzZXJ2aWNlSWQiLCJtZXRob2RzRmlsZSIsInNlcnZpY2VOYW1lIiwiZ2V0U2hhcmVkQ29uZmlnIiwic2hhcmVkU2VydmljZXNQYXRoIiwiZ2V0Q29uc29sZSIsInBhY2siLCJjb25zb2xlIiwiZ2V0TWV0aG9kcyIsIk5PREVfRU5WIiwiY2FjaGUiLCJyZXNvbHZlIiwiU0hBUkVEX0NPTkZJRyIsIlNFUlZJQ0UiLCJhcGlQdWJsaWMiLCJwdWJsaWNPbmx5IiwiaHR0cFBvcnQiLCJodHRwUHVibGljQXBpUG9ydCIsImFwaVByaXZhdGUiLCJodHRwUHJpdmF0ZUFwaVBvcnQiLCJuZXQiLCJuZXRVcmwiLCJzdGFydCIsInN0b3AiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxLQUFLRCxRQUFRLElBQVIsQ0FBVDtBQUNBLElBQUlFLFFBQVFGLFFBQVEsYUFBUixDQUFaO0FBQ0FHLE9BQU9DLE9BQVAsR0FBaUIsU0FBZUMsaUJBQWYsQ0FBa0NDLE1BQWxDLEVBQTBDQyxTQUExQyxFQUFxREMsV0FBckQ7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1hDLHFCQURXLEdBQ0dILE9BQU9HLFdBRFY7QUFHWEMseUJBSFcsR0FHT1IsTUFBTVEsZUFBTixDQUFzQkosT0FBT0ssa0JBQTdCLENBSFA7O0FBSVhDLG9CQUpXLEdBSUUsU0FBYkEsVUFBYSxDQUFDSCxXQUFELEVBQWNGLFNBQWQsRUFBeUJNLElBQXpCO0FBQUEsbUJBQWtDWCxNQUFNVSxVQUFOLENBQWlCTixPQUFPUSxPQUF4QixFQUFpQ0wsV0FBakMsRUFBOENGLFNBQTlDLEVBQXlETSxJQUF6RCxDQUFsQztBQUFBLFdBSkY7O0FBS1hFLG9CQUxXLEdBS0UsU0FBYkEsVUFBYSxHQUFNO0FBQ3JCLGdCQUFJVCxPQUFPVSxRQUFQLEtBQW9CLGFBQXhCLEVBQXVDLE9BQU9oQixRQUFRaUIsS0FBUixDQUFjakIsUUFBUWtCLE9BQVIsQ0FBZ0JWLFdBQWhCLENBQWQsQ0FBUDtBQUN2QyxtQkFBT1IsUUFBUVEsV0FBUixDQUFQO0FBQ0QsV0FSYzs7QUFBQTtBQUFBLDBDQVNXRSxnQkFBZ0JELFdBQWhCLEVBQTZCLFNBQTdCLENBVFg7O0FBQUE7QUFTWFUsdUJBVFc7QUFXWEMsaUJBWFcsR0FXRCxFQUFFYixvQkFBRixFQUFhRSx3QkFBYixFQUEwQlUsNEJBQTFCLEVBQXlDYixjQUF6QyxFQVhDOzs7QUFhZmMsa0JBQVFDLFNBQVIsR0FBb0JyQixRQUFRLGdCQUFSLEVBQTBCLEVBQUVPLG9CQUFGLEVBQWFFLHdCQUFiLEVBQTBCYSxZQUFZLElBQXRDLEVBQTRDQyxVQUFVSixjQUFjSyxpQkFBcEUsRUFBdUZULHNCQUF2RixFQUFtR0wsZ0NBQW5HLEVBQW9IRSxzQkFBcEgsRUFBMUIsQ0FBcEI7QUFDQVEsa0JBQVFLLFVBQVIsR0FBcUJ6QixRQUFRLGdCQUFSLEVBQTBCLEVBQUNPLG9CQUFELEVBQVlFLHdCQUFaLEVBQXlCYSxZQUFZLEtBQXJDLEVBQTRDQyxVQUFVSixjQUFjTyxrQkFBcEUsRUFBd0ZYLHNCQUF4RixFQUFvR0wsZ0NBQXBHLEVBQXFIRSxzQkFBckgsRUFBMUIsQ0FBckI7QUFDQVEsa0JBQVFPLEdBQVIsR0FBYzNCLFFBQVEsa0JBQVIsRUFBNEIsRUFBQ08sb0JBQUQsRUFBWUUsd0JBQVosRUFBeUJtQixRQUFRVCxjQUFjUyxNQUEvQyxFQUF1RGIsc0JBQXZELEVBQW1FTCxnQ0FBbkUsRUFBb0ZFLHNCQUFwRixFQUE1QixDQUFkOztBQUVBUSxrQkFBUVMsS0FBUixHQUFnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvREFDUlQsUUFBUUMsU0FBUixDQUFrQlEsS0FBbEIsRUFEUTs7QUFBQTtBQUFBO0FBQUEsb0RBRVJULFFBQVFLLFVBQVIsQ0FBbUJJLEtBQW5CLEVBRlE7O0FBQUE7QUFBQTtBQUFBLG9EQUdSVCxRQUFRTyxHQUFSLENBQVlFLEtBQVosRUFIUTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFoQjtBQUtBVCxrQkFBUVUsSUFBUixHQUFlLFlBQU07QUFDbkJWLG9CQUFRQyxTQUFSLENBQWtCUyxJQUFsQjtBQUNBVixvQkFBUUssVUFBUixDQUFtQkssSUFBbkI7QUFDQVYsb0JBQVFPLEdBQVIsQ0FBWUcsSUFBWjtBQUNELFdBSkQ7QUF0QmU7QUFBQSwwQ0EyQlRWLFFBQVFTLEtBQVIsRUEzQlM7O0FBQUE7QUFBQSw0Q0E0QlJULE9BNUJROztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6InN0YXJ0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgamVzdXMgPSByZXF1aXJlKCcuLi8uLi9qZXN1cycpXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIHN0YXJ0TWljcm9zZXJ2aWNlIChDT05GSUcsIHNlcnZpY2VJZCwgbWV0aG9kc0ZpbGUpIHtcbiAgdmFyIHNlcnZpY2VOYW1lID0gQ09ORklHLnNlcnZpY2VOYW1lXG5cbiAgdmFyIGdldFNoYXJlZENvbmZpZyA9IGplc3VzLmdldFNoYXJlZENvbmZpZyhDT05GSUcuc2hhcmVkU2VydmljZXNQYXRoKVxuICB2YXIgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiBqZXN1cy5nZXRDb25zb2xlKENPTkZJRy5jb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKVxuICB2YXIgZ2V0TWV0aG9kcyA9ICgpID0+IHtcbiAgICBpZiAoQ09ORklHLk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSBkZWxldGUgcmVxdWlyZS5jYWNoZVtyZXF1aXJlLnJlc29sdmUobWV0aG9kc0ZpbGUpXVxuICAgIHJldHVybiByZXF1aXJlKG1ldGhvZHNGaWxlKVxuICB9XG4gIHZhciBTSEFSRURfQ09ORklHID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnc2VydmljZScpXG5cbiAgdmFyIFNFUlZJQ0UgPSB7IHNlcnZpY2VJZCwgc2VydmljZU5hbWUsIFNIQVJFRF9DT05GSUcsIENPTkZJRyB9XG5cbiAgU0VSVklDRS5hcGlQdWJsaWMgPSByZXF1aXJlKCcuLi8uLi9hcGkuaHR0cCcpKHsgc2VydmljZUlkLCBzZXJ2aWNlTmFtZSwgcHVibGljT25seTogdHJ1ZSwgaHR0cFBvcnQ6IFNIQVJFRF9DT05GSUcuaHR0cFB1YmxpY0FwaVBvcnQsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZywgZ2V0Q29uc29sZX0pXG4gIFNFUlZJQ0UuYXBpUHJpdmF0ZSA9IHJlcXVpcmUoJy4uLy4uL2FwaS5odHRwJykoe3NlcnZpY2VJZCwgc2VydmljZU5hbWUsIHB1YmxpY09ubHk6IGZhbHNlLCBodHRwUG9ydDogU0hBUkVEX0NPTkZJRy5odHRwUHJpdmF0ZUFwaVBvcnQsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZywgZ2V0Q29uc29sZX0pXG4gIFNFUlZJQ0UubmV0ID0gcmVxdWlyZSgnLi4vLi4vbmV0LnNlcnZlcicpKHtzZXJ2aWNlSWQsIHNlcnZpY2VOYW1lLCBuZXRVcmw6IFNIQVJFRF9DT05GSUcubmV0VXJsLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGdldENvbnNvbGV9KVxuXG4gIFNFUlZJQ0Uuc3RhcnQgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgU0VSVklDRS5hcGlQdWJsaWMuc3RhcnQoKVxuICAgIGF3YWl0IFNFUlZJQ0UuYXBpUHJpdmF0ZS5zdGFydCgpXG4gICAgYXdhaXQgU0VSVklDRS5uZXQuc3RhcnQoKVxuICB9XG4gIFNFUlZJQ0Uuc3RvcCA9ICgpID0+IHtcbiAgICBTRVJWSUNFLmFwaVB1YmxpYy5zdG9wKClcbiAgICBTRVJWSUNFLmFwaVByaXZhdGUuc3RvcCgpXG4gICAgU0VSVklDRS5uZXQuc3RvcCgpXG4gIH1cbiAgYXdhaXQgU0VSVklDRS5zdGFydCgpXG4gIHJldHVybiBTRVJWSUNFXG59XG4iXX0=