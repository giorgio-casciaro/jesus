'use strict';

var path = require('path');
var fs = require('fs');
var jesus = require('../../jesus');
module.exports = function startMicroservice(CONFIG, serviceId, methodsFile) {
  var _this = this;

  var serviceName, getSharedConfig, getMethods, SHARED_CONFIG, SERVICE;
  return regeneratorRuntime.async(function startMicroservice$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          serviceName = CONFIG.serviceName;
          getSharedConfig = jesus.getSharedConfig(CONFIG.sharedServicesPath);

          getMethods = function getMethods() {
            if (CONFIG.NODE_ENV === 'development') delete require.cache[require.resolve(methodsFile)];
            return require(methodsFile);
          };

          _context2.next = 5;
          return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'service'));

        case 5:
          SHARED_CONFIG = _context2.sent;
          SERVICE = { serviceId: serviceId, serviceName: serviceName, SHARED_CONFIG: SHARED_CONFIG, CONFIG: CONFIG };


          SERVICE.apiPublic = require('../../api.http')({ serviceId: serviceId, serviceName: serviceName, publicOnly: true, httpPort: SHARED_CONFIG.httpPublicApiPort, getMethods: getMethods, getSharedConfig: getSharedConfig });
          SERVICE.apiPrivate = require('../../api.http')({ serviceId: serviceId, serviceName: serviceName, publicOnly: false, httpPort: SHARED_CONFIG.httpPrivateApiPort, getMethods: getMethods, getSharedConfig: getSharedConfig });
          SERVICE.net = require('../../net.server')({ serviceId: serviceId, serviceName: serviceName, netUrl: SHARED_CONFIG.netUrl, getMethods: getMethods, getSharedConfig: getSharedConfig });

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
          _context2.next = 14;
          return regeneratorRuntime.awrap(SERVICE.start());

        case 14:
          return _context2.abrupt('return', SERVICE);

        case 15:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXJ0LmVzNiJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImZzIiwiamVzdXMiLCJtb2R1bGUiLCJleHBvcnRzIiwic3RhcnRNaWNyb3NlcnZpY2UiLCJDT05GSUciLCJzZXJ2aWNlSWQiLCJtZXRob2RzRmlsZSIsInNlcnZpY2VOYW1lIiwiZ2V0U2hhcmVkQ29uZmlnIiwic2hhcmVkU2VydmljZXNQYXRoIiwiZ2V0TWV0aG9kcyIsIk5PREVfRU5WIiwiY2FjaGUiLCJyZXNvbHZlIiwiU0hBUkVEX0NPTkZJRyIsIlNFUlZJQ0UiLCJhcGlQdWJsaWMiLCJwdWJsaWNPbmx5IiwiaHR0cFBvcnQiLCJodHRwUHVibGljQXBpUG9ydCIsImFwaVByaXZhdGUiLCJodHRwUHJpdmF0ZUFwaVBvcnQiLCJuZXQiLCJuZXRVcmwiLCJzdGFydCIsInN0b3AiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxLQUFLRCxRQUFRLElBQVIsQ0FBVDtBQUNBLElBQUlFLFFBQVFGLFFBQVEsYUFBUixDQUFaO0FBQ0FHLE9BQU9DLE9BQVAsR0FBaUIsU0FBZUMsaUJBQWYsQ0FBa0NDLE1BQWxDLEVBQTBDQyxTQUExQyxFQUFxREMsV0FBckQ7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1hDLHFCQURXLEdBQ0dILE9BQU9HLFdBRFY7QUFHWEMseUJBSFcsR0FHT1IsTUFBTVEsZUFBTixDQUFzQkosT0FBT0ssa0JBQTdCLENBSFA7O0FBSVhDLG9CQUpXLEdBSUUsU0FBYkEsVUFBYSxHQUFNO0FBQ3JCLGdCQUFJTixPQUFPTyxRQUFQLEtBQW9CLGFBQXhCLEVBQXVDLE9BQU9iLFFBQVFjLEtBQVIsQ0FBY2QsUUFBUWUsT0FBUixDQUFnQlAsV0FBaEIsQ0FBZCxDQUFQO0FBQ3ZDLG1CQUFPUixRQUFRUSxXQUFSLENBQVA7QUFDRCxXQVBjOztBQUFBO0FBQUEsMENBUVdFLGdCQUFnQkQsV0FBaEIsRUFBNkIsU0FBN0IsQ0FSWDs7QUFBQTtBQVFYTyx1QkFSVztBQVVYQyxpQkFWVyxHQVVELEVBQUVWLG9CQUFGLEVBQWFFLHdCQUFiLEVBQTBCTyw0QkFBMUIsRUFBeUNWLGNBQXpDLEVBVkM7OztBQVlmVyxrQkFBUUMsU0FBUixHQUFvQmxCLFFBQVEsZ0JBQVIsRUFBMEIsRUFBRU8sb0JBQUYsRUFBYUUsd0JBQWIsRUFBMEJVLFlBQVksSUFBdEMsRUFBNENDLFVBQVVKLGNBQWNLLGlCQUFwRSxFQUF1RlQsc0JBQXZGLEVBQW1HRixnQ0FBbkcsRUFBMUIsQ0FBcEI7QUFDQU8sa0JBQVFLLFVBQVIsR0FBcUJ0QixRQUFRLGdCQUFSLEVBQTBCLEVBQUNPLG9CQUFELEVBQVlFLHdCQUFaLEVBQXlCVSxZQUFZLEtBQXJDLEVBQTRDQyxVQUFVSixjQUFjTyxrQkFBcEUsRUFBd0ZYLHNCQUF4RixFQUFvR0YsZ0NBQXBHLEVBQTFCLENBQXJCO0FBQ0FPLGtCQUFRTyxHQUFSLEdBQWN4QixRQUFRLGtCQUFSLEVBQTRCLEVBQUNPLG9CQUFELEVBQVlFLHdCQUFaLEVBQXlCZ0IsUUFBUVQsY0FBY1MsTUFBL0MsRUFBdURiLHNCQUF2RCxFQUFtRUYsZ0NBQW5FLEVBQTVCLENBQWQ7O0FBRUFPLGtCQUFRUyxLQUFSLEdBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG9EQUNSVCxRQUFRQyxTQUFSLENBQWtCUSxLQUFsQixFQURROztBQUFBO0FBQUE7QUFBQSxvREFFUlQsUUFBUUssVUFBUixDQUFtQkksS0FBbkIsRUFGUTs7QUFBQTtBQUFBO0FBQUEsb0RBR1JULFFBQVFPLEdBQVIsQ0FBWUUsS0FBWixFQUhROztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQWhCO0FBS0FULGtCQUFRVSxJQUFSLEdBQWUsWUFBTTtBQUNuQlYsb0JBQVFDLFNBQVIsQ0FBa0JTLElBQWxCO0FBQ0FWLG9CQUFRSyxVQUFSLENBQW1CSyxJQUFuQjtBQUNBVixvQkFBUU8sR0FBUixDQUFZRyxJQUFaO0FBQ0QsV0FKRDtBQXJCZTtBQUFBLDBDQTBCVFYsUUFBUVMsS0FBUixFQTFCUzs7QUFBQTtBQUFBLDRDQTJCUlQsT0EzQlE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoic3RhcnQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uL2plc3VzJylcbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gc3RhcnRNaWNyb3NlcnZpY2UgKENPTkZJRywgc2VydmljZUlkLCBtZXRob2RzRmlsZSkge1xuICB2YXIgc2VydmljZU5hbWUgPSBDT05GSUcuc2VydmljZU5hbWVcblxuICB2YXIgZ2V0U2hhcmVkQ29uZmlnID0gamVzdXMuZ2V0U2hhcmVkQ29uZmlnKENPTkZJRy5zaGFyZWRTZXJ2aWNlc1BhdGgpXG4gIHZhciBnZXRNZXRob2RzID0gKCkgPT4ge1xuICAgIGlmIChDT05GSUcuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIGRlbGV0ZSByZXF1aXJlLmNhY2hlW3JlcXVpcmUucmVzb2x2ZShtZXRob2RzRmlsZSldXG4gICAgcmV0dXJuIHJlcXVpcmUobWV0aG9kc0ZpbGUpXG4gIH1cbiAgdmFyIFNIQVJFRF9DT05GSUcgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdzZXJ2aWNlJylcblxuICB2YXIgU0VSVklDRSA9IHsgc2VydmljZUlkLCBzZXJ2aWNlTmFtZSwgU0hBUkVEX0NPTkZJRywgQ09ORklHIH1cblxuICBTRVJWSUNFLmFwaVB1YmxpYyA9IHJlcXVpcmUoJy4uLy4uL2FwaS5odHRwJykoeyBzZXJ2aWNlSWQsIHNlcnZpY2VOYW1lLCBwdWJsaWNPbmx5OiB0cnVlLCBodHRwUG9ydDogU0hBUkVEX0NPTkZJRy5odHRwUHVibGljQXBpUG9ydCwgZ2V0TWV0aG9kcywgZ2V0U2hhcmVkQ29uZmlnfSlcbiAgU0VSVklDRS5hcGlQcml2YXRlID0gcmVxdWlyZSgnLi4vLi4vYXBpLmh0dHAnKSh7c2VydmljZUlkLCBzZXJ2aWNlTmFtZSwgcHVibGljT25seTogZmFsc2UsIGh0dHBQb3J0OiBTSEFSRURfQ09ORklHLmh0dHBQcml2YXRlQXBpUG9ydCwgZ2V0TWV0aG9kcywgZ2V0U2hhcmVkQ29uZmlnfSlcbiAgU0VSVklDRS5uZXQgPSByZXF1aXJlKCcuLi8uLi9uZXQuc2VydmVyJykoe3NlcnZpY2VJZCwgc2VydmljZU5hbWUsIG5ldFVybDogU0hBUkVEX0NPTkZJRy5uZXRVcmwsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZ30pXG5cbiAgU0VSVklDRS5zdGFydCA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBTRVJWSUNFLmFwaVB1YmxpYy5zdGFydCgpXG4gICAgYXdhaXQgU0VSVklDRS5hcGlQcml2YXRlLnN0YXJ0KClcbiAgICBhd2FpdCBTRVJWSUNFLm5ldC5zdGFydCgpXG4gIH1cbiAgU0VSVklDRS5zdG9wID0gKCkgPT4ge1xuICAgIFNFUlZJQ0UuYXBpUHVibGljLnN0b3AoKVxuICAgIFNFUlZJQ0UuYXBpUHJpdmF0ZS5zdG9wKClcbiAgICBTRVJWSUNFLm5ldC5zdG9wKClcbiAgfVxuICBhd2FpdCBTRVJWSUNFLnN0YXJ0KClcbiAgcmV0dXJuIFNFUlZJQ0Vcbn1cbiJdfQ==