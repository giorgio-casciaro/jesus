'use strict';

var path = require('path');
var fs = require('fs');
module.exports = function startMicroservice() {
  var CONFIG, serviceId, methodsFile, SERVICE;
  return regeneratorRuntime.async(function startMicroservice$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          CONFIG = require('./config');
          serviceId = require('shortid').generate();

          fs.writeFileSync(path.join(__dirname, './serviceId.json'), JSON.stringify(serviceId));
          methodsFile = path.join(__dirname, './methods.js');
          _context.next = 6;
          return regeneratorRuntime.awrap(require('../start')(CONFIG, serviceId, methodsFile));

        case 6:
          SERVICE = _context.sent;
          return _context.abrupt('return', SERVICE);

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXJ0LmVzNiJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImZzIiwibW9kdWxlIiwiZXhwb3J0cyIsInN0YXJ0TWljcm9zZXJ2aWNlIiwiQ09ORklHIiwic2VydmljZUlkIiwiZ2VuZXJhdGUiLCJ3cml0ZUZpbGVTeW5jIiwiam9pbiIsIl9fZGlybmFtZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJtZXRob2RzRmlsZSIsIlNFUlZJQ0UiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxLQUFLRCxRQUFRLElBQVIsQ0FBVDtBQUNBRSxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLGlCQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNYQyxnQkFEVyxHQUNGTCxRQUFRLFVBQVIsQ0FERTtBQUVYTSxtQkFGVyxHQUVDTixRQUFRLFNBQVIsRUFBbUJPLFFBQW5CLEVBRkQ7O0FBR2ZOLGFBQUdPLGFBQUgsQ0FBaUJULEtBQUtVLElBQUwsQ0FBVUMsU0FBVixFQUFxQixrQkFBckIsQ0FBakIsRUFBMkRDLEtBQUtDLFNBQUwsQ0FBZU4sU0FBZixDQUEzRDtBQUNJTyxxQkFKVyxHQUlDZCxLQUFLVSxJQUFMLENBQVVDLFNBQVYsRUFBcUIsY0FBckIsQ0FKRDtBQUFBO0FBQUEsMENBS0tWLFFBQVEsVUFBUixFQUFvQkssTUFBcEIsRUFBNEJDLFNBQTVCLEVBQXVDTyxXQUF2QyxDQUxMOztBQUFBO0FBS1hDLGlCQUxXO0FBQUEsMkNBTVJBLE9BTlE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoic3RhcnQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gc3RhcnRNaWNyb3NlcnZpY2UgKCkge1xuICB2YXIgQ09ORklHID0gcmVxdWlyZSgnLi9jb25maWcnKVxuICB2YXIgc2VydmljZUlkID0gcmVxdWlyZSgnc2hvcnRpZCcpLmdlbmVyYXRlKClcbiAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zZXJ2aWNlSWQuanNvbicpLCBKU09OLnN0cmluZ2lmeShzZXJ2aWNlSWQpKVxuICB2YXIgbWV0aG9kc0ZpbGU9cGF0aC5qb2luKF9fZGlybmFtZSwgJy4vbWV0aG9kcy5qcycpXG4gIHZhciBTRVJWSUNFID0gYXdhaXQgcmVxdWlyZSgnLi4vc3RhcnQnKShDT05GSUcsIHNlcnZpY2VJZCwgbWV0aG9kc0ZpbGUpXG4gIHJldHVybiBTRVJWSUNFXG59XG4iXX0=