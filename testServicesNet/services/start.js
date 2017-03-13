'use strict';

var path = require('path');
var fs = require('fs');
var jesus = require('../../jesus');
module.exports = function startMicroservice(CONFIG, serviceId, methodsFile) {
  var _this = this;

  var serviceName, getSharedConfig, getConsole, getMethods, SHARED_CONFIG, SHARED_NET_CONFIG, SERVICE;
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
            return require(methodsFile);
          };

          setInterval(function () {
            return require.cache = [];
          }, 5000);
          _context2.next = 7;
          return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'service'));

        case 7:
          SHARED_CONFIG = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'net'));

        case 10:
          SHARED_NET_CONFIG = _context2.sent;
          SERVICE = { serviceId: serviceId, serviceName: serviceName, SHARED_CONFIG: SHARED_CONFIG, CONFIG: CONFIG, SHARED_NET_CONFIG: SHARED_NET_CONFIG };

          SERVICE.net = require('../../net.server')({ serviceId: serviceId, serviceName: serviceName, config: SHARED_NET_CONFIG, getMethods: getMethods, getSharedConfig: getSharedConfig, getConsole: getConsole });

          SERVICE.start = function _callee() {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(SERVICE.net.start());

                  case 2:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, _this);
          };
          SERVICE.stop = function () {
            SERVICE.net.stop();
          };
          _context2.next = 17;
          return regeneratorRuntime.awrap(SERVICE.start());

        case 17:
          return _context2.abrupt('return', SERVICE);

        case 18:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXJ0LmVzNiJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImZzIiwiamVzdXMiLCJtb2R1bGUiLCJleHBvcnRzIiwic3RhcnRNaWNyb3NlcnZpY2UiLCJDT05GSUciLCJzZXJ2aWNlSWQiLCJtZXRob2RzRmlsZSIsInNlcnZpY2VOYW1lIiwiZ2V0U2hhcmVkQ29uZmlnIiwic2hhcmVkU2VydmljZXNQYXRoIiwiZ2V0Q29uc29sZSIsInBhY2siLCJjb25zb2xlIiwiZ2V0TWV0aG9kcyIsInNldEludGVydmFsIiwiY2FjaGUiLCJTSEFSRURfQ09ORklHIiwiU0hBUkVEX05FVF9DT05GSUciLCJTRVJWSUNFIiwibmV0IiwiY29uZmlnIiwic3RhcnQiLCJzdG9wIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLE9BQU9DLFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUMsS0FBS0QsUUFBUSxJQUFSLENBQVQ7QUFDQSxJQUFJRSxRQUFRRixRQUFRLGFBQVIsQ0FBWjtBQUNBRyxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLGlCQUFmLENBQWtDQyxNQUFsQyxFQUEwQ0MsU0FBMUMsRUFBcURDLFdBQXJEO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNYQyxxQkFEVyxHQUNHSCxPQUFPRyxXQURWO0FBR1hDLHlCQUhXLEdBR09SLE1BQU1RLGVBQU4sQ0FBc0JKLE9BQU9LLGtCQUE3QixDQUhQOztBQUlYQyxvQkFKVyxHQUlFLFNBQWJBLFVBQWEsQ0FBQ0gsV0FBRCxFQUFjRixTQUFkLEVBQXlCTSxJQUF6QjtBQUFBLG1CQUFrQ1gsTUFBTVUsVUFBTixDQUFpQk4sT0FBT1EsT0FBeEIsRUFBaUNMLFdBQWpDLEVBQThDRixTQUE5QyxFQUF5RE0sSUFBekQsQ0FBbEM7QUFBQSxXQUpGOztBQUtYRSxvQkFMVyxHQUtFLFNBQWJBLFVBQWEsR0FBTTtBQUNyQixtQkFBT2YsUUFBUVEsV0FBUixDQUFQO0FBQ0QsV0FQYzs7QUFRZlEsc0JBQVk7QUFBQSxtQkFBTWhCLFFBQVFpQixLQUFSLEdBQWdCLEVBQXRCO0FBQUEsV0FBWixFQUFzQyxJQUF0QztBQVJlO0FBQUEsMENBU1dQLGdCQUFnQkQsV0FBaEIsRUFBNkIsU0FBN0IsQ0FUWDs7QUFBQTtBQVNYUyx1QkFUVztBQUFBO0FBQUEsMENBVWVSLGdCQUFnQkQsV0FBaEIsRUFBNkIsS0FBN0IsQ0FWZjs7QUFBQTtBQVVYVSwyQkFWVztBQVdYQyxpQkFYVyxHQVdELEVBQUViLG9CQUFGLEVBQWFFLHdCQUFiLEVBQTBCUyw0QkFBMUIsRUFBeUNaLGNBQXpDLEVBQWlEYSxvQ0FBakQsRUFYQzs7QUFZZkMsa0JBQVFDLEdBQVIsR0FBY3JCLFFBQVEsa0JBQVIsRUFBNEIsRUFBQ08sb0JBQUQsRUFBWUUsd0JBQVosRUFBeUJhLFFBQVFILGlCQUFqQyxFQUFvREosc0JBQXBELEVBQWdFTCxnQ0FBaEUsRUFBaUZFLHNCQUFqRixFQUE1QixDQUFkOztBQUVBUSxrQkFBUUcsS0FBUixHQUFnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvREFDUkgsUUFBUUMsR0FBUixDQUFZRSxLQUFaLEVBRFE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBaEI7QUFHQUgsa0JBQVFJLElBQVIsR0FBZSxZQUFNO0FBQ25CSixvQkFBUUMsR0FBUixDQUFZRyxJQUFaO0FBQ0QsV0FGRDtBQWpCZTtBQUFBLDBDQW9CVEosUUFBUUcsS0FBUixFQXBCUzs7QUFBQTtBQUFBLDRDQXFCUkgsT0FyQlE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoic3RhcnQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uL2plc3VzJylcbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gc3RhcnRNaWNyb3NlcnZpY2UgKENPTkZJRywgc2VydmljZUlkLCBtZXRob2RzRmlsZSkge1xuICB2YXIgc2VydmljZU5hbWUgPSBDT05GSUcuc2VydmljZU5hbWVcblxuICB2YXIgZ2V0U2hhcmVkQ29uZmlnID0gamVzdXMuZ2V0U2hhcmVkQ29uZmlnKENPTkZJRy5zaGFyZWRTZXJ2aWNlc1BhdGgpXG4gIHZhciBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IGplc3VzLmdldENvbnNvbGUoQ09ORklHLmNvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spXG4gIHZhciBnZXRNZXRob2RzID0gKCkgPT4ge1xuICAgIHJldHVybiByZXF1aXJlKG1ldGhvZHNGaWxlKVxuICB9XG4gIHNldEludGVydmFsKCgpID0+IHJlcXVpcmUuY2FjaGUgPSBbXSwgNTAwMClcbiAgdmFyIFNIQVJFRF9DT05GSUcgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdzZXJ2aWNlJylcbiAgdmFyIFNIQVJFRF9ORVRfQ09ORklHID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnbmV0JylcbiAgdmFyIFNFUlZJQ0UgPSB7IHNlcnZpY2VJZCwgc2VydmljZU5hbWUsIFNIQVJFRF9DT05GSUcsIENPTkZJRyAsU0hBUkVEX05FVF9DT05GSUd9XG4gIFNFUlZJQ0UubmV0ID0gcmVxdWlyZSgnLi4vLi4vbmV0LnNlcnZlcicpKHtzZXJ2aWNlSWQsIHNlcnZpY2VOYW1lLCBjb25maWc6IFNIQVJFRF9ORVRfQ09ORklHLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGdldENvbnNvbGV9KVxuXG4gIFNFUlZJQ0Uuc3RhcnQgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgU0VSVklDRS5uZXQuc3RhcnQoKVxuICB9XG4gIFNFUlZJQ0Uuc3RvcCA9ICgpID0+IHtcbiAgICBTRVJWSUNFLm5ldC5zdG9wKClcbiAgfVxuICBhd2FpdCBTRVJWSUNFLnN0YXJ0KClcbiAgcmV0dXJuIFNFUlZJQ0Vcbn1cbiJdfQ==