'use strict';

var path = require('path');
var fs = require('fs');
var jesus = require('../../jesus');
module.exports = function startMicroservice(_ref) {
  var _this = this;

  var CONFIG = _ref.CONFIG,
      serviceId = _ref.serviceId,
      methodsFile = _ref.methodsFile,
      logDir = _ref.logDir;
  var serviceName, getSharedConfig, getConsole, getMethods, SHARED_CONFIG, SHARED_NET_CONFIG, SERVICE;
  return regeneratorRuntime.async(function startMicroservice$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          serviceName = CONFIG.serviceName;
          getSharedConfig = jesus.getSharedConfig(CONFIG.sharedServicesPath);

          getConsole = function getConsole(serviceName, serviceId, pack) {
            return jesus.getConsole(CONFIG.console, serviceName, serviceId, pack, logDir);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXJ0LmVzNiJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImZzIiwiamVzdXMiLCJtb2R1bGUiLCJleHBvcnRzIiwic3RhcnRNaWNyb3NlcnZpY2UiLCJDT05GSUciLCJzZXJ2aWNlSWQiLCJtZXRob2RzRmlsZSIsImxvZ0RpciIsInNlcnZpY2VOYW1lIiwiZ2V0U2hhcmVkQ29uZmlnIiwic2hhcmVkU2VydmljZXNQYXRoIiwiZ2V0Q29uc29sZSIsInBhY2siLCJjb25zb2xlIiwiZ2V0TWV0aG9kcyIsInNldEludGVydmFsIiwiY2FjaGUiLCJTSEFSRURfQ09ORklHIiwiU0hBUkVEX05FVF9DT05GSUciLCJTRVJWSUNFIiwibmV0IiwiY29uZmlnIiwic3RhcnQiLCJzdG9wIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLE9BQU9DLFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUMsS0FBS0QsUUFBUSxJQUFSLENBQVQ7QUFDQSxJQUFJRSxRQUFRRixRQUFRLGFBQVIsQ0FBWjtBQUNBRyxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLGlCQUFmO0FBQUE7O0FBQUEsTUFBbUNDLE1BQW5DLFFBQW1DQSxNQUFuQztBQUFBLE1BQTJDQyxTQUEzQyxRQUEyQ0EsU0FBM0M7QUFBQSxNQUFzREMsV0FBdEQsUUFBc0RBLFdBQXREO0FBQUEsTUFBa0VDLE1BQWxFLFFBQWtFQSxNQUFsRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDWEMscUJBRFcsR0FDR0osT0FBT0ksV0FEVjtBQUdYQyx5QkFIVyxHQUdPVCxNQUFNUyxlQUFOLENBQXNCTCxPQUFPTSxrQkFBN0IsQ0FIUDs7QUFJWEMsb0JBSlcsR0FJRSxTQUFiQSxVQUFhLENBQUNILFdBQUQsRUFBY0gsU0FBZCxFQUF5Qk8sSUFBekI7QUFBQSxtQkFBa0NaLE1BQU1XLFVBQU4sQ0FBaUJQLE9BQU9TLE9BQXhCLEVBQWlDTCxXQUFqQyxFQUE4Q0gsU0FBOUMsRUFBeURPLElBQXpELEVBQThETCxNQUE5RCxDQUFsQztBQUFBLFdBSkY7O0FBS1hPLG9CQUxXLEdBS0UsU0FBYkEsVUFBYSxHQUFNO0FBQ3JCLG1CQUFPaEIsUUFBUVEsV0FBUixDQUFQO0FBQ0QsV0FQYzs7QUFRZlMsc0JBQVk7QUFBQSxtQkFBTWpCLFFBQVFrQixLQUFSLEdBQWdCLEVBQXRCO0FBQUEsV0FBWixFQUFzQyxJQUF0QztBQVJlO0FBQUEsMENBU1dQLGdCQUFnQkQsV0FBaEIsRUFBNkIsU0FBN0IsQ0FUWDs7QUFBQTtBQVNYUyx1QkFUVztBQUFBO0FBQUEsMENBVWVSLGdCQUFnQkQsV0FBaEIsRUFBNkIsS0FBN0IsQ0FWZjs7QUFBQTtBQVVYVSwyQkFWVztBQVdYQyxpQkFYVyxHQVdELEVBQUVkLG9CQUFGLEVBQWFHLHdCQUFiLEVBQTBCUyw0QkFBMUIsRUFBeUNiLGNBQXpDLEVBQWlEYyxvQ0FBakQsRUFYQzs7QUFZZkMsa0JBQVFDLEdBQVIsR0FBY3RCLFFBQVEsa0JBQVIsRUFBNEIsRUFBQ08sb0JBQUQsRUFBWUcsd0JBQVosRUFBeUJhLFFBQVFILGlCQUFqQyxFQUFvREosc0JBQXBELEVBQWdFTCxnQ0FBaEUsRUFBaUZFLHNCQUFqRixFQUE1QixDQUFkOztBQUVBUSxrQkFBUUcsS0FBUixHQUFnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvREFDUkgsUUFBUUMsR0FBUixDQUFZRSxLQUFaLEVBRFE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBaEI7QUFHQUgsa0JBQVFJLElBQVIsR0FBZSxZQUFNO0FBQ25CSixvQkFBUUMsR0FBUixDQUFZRyxJQUFaO0FBQ0QsV0FGRDtBQWpCZTtBQUFBLDBDQW9CVEosUUFBUUcsS0FBUixFQXBCUzs7QUFBQTtBQUFBLDRDQXFCUkgsT0FyQlE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoic3RhcnQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uL2plc3VzJylcbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gc3RhcnRNaWNyb3NlcnZpY2UgKHtDT05GSUcsIHNlcnZpY2VJZCwgbWV0aG9kc0ZpbGUsbG9nRGlyfSkge1xuICB2YXIgc2VydmljZU5hbWUgPSBDT05GSUcuc2VydmljZU5hbWVcblxuICB2YXIgZ2V0U2hhcmVkQ29uZmlnID0gamVzdXMuZ2V0U2hhcmVkQ29uZmlnKENPTkZJRy5zaGFyZWRTZXJ2aWNlc1BhdGgpXG4gIHZhciBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IGplc3VzLmdldENvbnNvbGUoQ09ORklHLmNvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2ssbG9nRGlyKVxuICB2YXIgZ2V0TWV0aG9kcyA9ICgpID0+IHtcbiAgICByZXR1cm4gcmVxdWlyZShtZXRob2RzRmlsZSlcbiAgfVxuICBzZXRJbnRlcnZhbCgoKSA9PiByZXF1aXJlLmNhY2hlID0gW10sIDUwMDApXG4gIHZhciBTSEFSRURfQ09ORklHID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnc2VydmljZScpXG4gIHZhciBTSEFSRURfTkVUX0NPTkZJRyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ25ldCcpXG4gIHZhciBTRVJWSUNFID0geyBzZXJ2aWNlSWQsIHNlcnZpY2VOYW1lLCBTSEFSRURfQ09ORklHLCBDT05GSUcgLFNIQVJFRF9ORVRfQ09ORklHfVxuICBTRVJWSUNFLm5ldCA9IHJlcXVpcmUoJy4uLy4uL25ldC5zZXJ2ZXInKSh7c2VydmljZUlkLCBzZXJ2aWNlTmFtZSwgY29uZmlnOiBTSEFSRURfTkVUX0NPTkZJRywgZ2V0TWV0aG9kcywgZ2V0U2hhcmVkQ29uZmlnLCBnZXRDb25zb2xlfSlcblxuICBTRVJWSUNFLnN0YXJ0ID0gYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IFNFUlZJQ0UubmV0LnN0YXJ0KClcbiAgfVxuICBTRVJWSUNFLnN0b3AgPSAoKSA9PiB7XG4gICAgU0VSVklDRS5uZXQuc3RvcCgpXG4gIH1cbiAgYXdhaXQgU0VSVklDRS5zdGFydCgpXG4gIHJldHVybiBTRVJWSUNFXG59XG4iXX0=