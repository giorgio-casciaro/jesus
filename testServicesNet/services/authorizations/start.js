'use strict';

var path = require('path');
var fs = require('fs');
module.exports = function startMicroservice() {
  var CONFIG, serviceId, methodsFile, logDir, SERVICE;
  return regeneratorRuntime.async(function startMicroservice$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          CONFIG = require('./config');
          serviceId = require('shortid').generate();

          fs.writeFileSync(path.join(__dirname, './serviceId.json'), JSON.stringify(serviceId));
          methodsFile = path.join(__dirname, './methods.js');
          logDir = path.join(__dirname, './logs');
          _context.next = 7;
          return regeneratorRuntime.awrap(require('../start')({ CONFIG: CONFIG, serviceId: serviceId, methodsFile: methodsFile, logDir: logDir }));

        case 7:
          SERVICE = _context.sent;
          return _context.abrupt('return', SERVICE);

        case 9:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXJ0LmVzNiJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImZzIiwibW9kdWxlIiwiZXhwb3J0cyIsInN0YXJ0TWljcm9zZXJ2aWNlIiwiQ09ORklHIiwic2VydmljZUlkIiwiZ2VuZXJhdGUiLCJ3cml0ZUZpbGVTeW5jIiwiam9pbiIsIl9fZGlybmFtZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJtZXRob2RzRmlsZSIsImxvZ0RpciIsIlNFUlZJQ0UiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxLQUFLRCxRQUFRLElBQVIsQ0FBVDtBQUNBRSxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLGlCQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNYQyxnQkFEVyxHQUNGTCxRQUFRLFVBQVIsQ0FERTtBQUVYTSxtQkFGVyxHQUVDTixRQUFRLFNBQVIsRUFBbUJPLFFBQW5CLEVBRkQ7O0FBR2ZOLGFBQUdPLGFBQUgsQ0FBaUJULEtBQUtVLElBQUwsQ0FBVUMsU0FBVixFQUFxQixrQkFBckIsQ0FBakIsRUFBMkRDLEtBQUtDLFNBQUwsQ0FBZU4sU0FBZixDQUEzRDtBQUNJTyxxQkFKVyxHQUlDZCxLQUFLVSxJQUFMLENBQVVDLFNBQVYsRUFBcUIsY0FBckIsQ0FKRDtBQUtYSSxnQkFMVyxHQUtGZixLQUFLVSxJQUFMLENBQVVDLFNBQVYsRUFBcUIsUUFBckIsQ0FMRTtBQUFBO0FBQUEsMENBTUtWLFFBQVEsVUFBUixFQUFvQixFQUFDSyxjQUFELEVBQVNDLG9CQUFULEVBQW9CTyx3QkFBcEIsRUFBaUNDLGNBQWpDLEVBQXBCLENBTkw7O0FBQUE7QUFNWEMsaUJBTlc7QUFBQSwyQ0FPUkEsT0FQUTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJzdGFydC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBzdGFydE1pY3Jvc2VydmljZSAoKSB7XG4gIHZhciBDT05GSUcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG4gIHZhciBzZXJ2aWNlSWQgPSByZXF1aXJlKCdzaG9ydGlkJykuZ2VuZXJhdGUoKVxuICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NlcnZpY2VJZC5qc29uJyksIEpTT04uc3RyaW5naWZ5KHNlcnZpY2VJZCkpXG4gIHZhciBtZXRob2RzRmlsZT1wYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9tZXRob2RzLmpzJylcbiAgdmFyIGxvZ0RpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuL2xvZ3MnKVxuICB2YXIgU0VSVklDRSA9IGF3YWl0IHJlcXVpcmUoJy4uL3N0YXJ0Jykoe0NPTkZJRywgc2VydmljZUlkLCBtZXRob2RzRmlsZSwgbG9nRGlyfSlcbiAgcmV0dXJuIFNFUlZJQ0Vcbn1cbiJdfQ==