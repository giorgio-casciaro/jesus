'use strict';

var jesus = require('../../../jesus');
var PACKAGE = 'methods';
var serviceName = require('./config').serviceName;
var serviceId = require('./serviceId.json');

var getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath);
var getConsole = function getConsole(serviceName, serviceId, pack) {
  return jesus.getConsole(require('./config').console, serviceName, serviceId, pack);
};
var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);

module.exports = {
  authorize: function authorize(_ref) {
    var action = _ref.action,
        entityName = _ref.entityName,
        id = _ref.id,
        meta = _ref.meta;
    return regeneratorRuntime.async(function authorize$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            return _context.abrupt('return', {
              userData: { 'userid': '195151662661' }
            });

          case 4:
            _context.prev = 4;
            _context.t0 = _context['catch'](0);

            CONSOLE.warn('problems during listenEvents', _context.t0);
            return _context.abrupt('return', { error: 'problems during authorizations', originalError: _context.t0 });

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this, [[0, 4]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIkNPTlNPTEUiLCJtb2R1bGUiLCJleHBvcnRzIiwiYXV0aG9yaXplIiwiYWN0aW9uIiwiZW50aXR5TmFtZSIsImlkIiwibWV0YSIsInVzZXJEYXRhIiwid2FybiIsImVycm9yIiwib3JpZ2luYWxFcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLGdCQUFSLENBQWQ7QUFDQSxJQUFNQyxVQUFVLFNBQWhCO0FBQ0EsSUFBTUMsY0FBY0YsUUFBUSxVQUFSLEVBQW9CRSxXQUF4QztBQUNBLElBQU1DLFlBQVlILFFBQVEsa0JBQVIsQ0FBbEI7O0FBRUEsSUFBTUksa0JBQWtCTCxNQUFNSyxlQUFOLENBQXNCSixRQUFRLFVBQVIsRUFBb0JLLGtCQUExQyxDQUF4QjtBQUNBLElBQU1DLGFBQWEsU0FBYkEsVUFBYSxDQUFDSixXQUFELEVBQWNDLFNBQWQsRUFBeUJJLElBQXpCO0FBQUEsU0FBa0NSLE1BQU1PLFVBQU4sQ0FBaUJOLFFBQVEsVUFBUixFQUFvQlEsT0FBckMsRUFBOENOLFdBQTlDLEVBQTJEQyxTQUEzRCxFQUFzRUksSUFBdEUsQ0FBbEM7QUFBQSxDQUFuQjtBQUNBLElBQU1FLFVBQVVILFdBQVdKLFdBQVgsRUFBd0JDLFNBQXhCLEVBQW1DRixPQUFuQyxDQUFoQjs7QUFFQVMsT0FBT0MsT0FBUCxHQUFpQjtBQUNSQyxXQURRO0FBQUEsUUFDSUMsTUFESixRQUNJQSxNQURKO0FBQUEsUUFDWUMsVUFEWixRQUNZQSxVQURaO0FBQUEsUUFDd0JDLEVBRHhCLFFBQ3dCQSxFQUR4QjtBQUFBLFFBQzRCQyxJQUQ1QixRQUM0QkEsSUFENUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkNBSUo7QUFDTEMsd0JBQVUsRUFBQyxVQUFVLGNBQVg7QUFETCxhQUpJOztBQUFBO0FBQUE7QUFBQTs7QUFRWFIsb0JBQVFTLElBQVIsQ0FBYSw4QkFBYjtBQVJXLDZDQVNKLEVBQUNDLE9BQU8sZ0NBQVIsRUFBMENDLDBCQUExQyxFQVRJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibWV0aG9kcy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2plc3VzJylcbmNvbnN0IFBBQ0tBR0UgPSAnbWV0aG9kcydcbmNvbnN0IHNlcnZpY2VOYW1lID0gcmVxdWlyZSgnLi9jb25maWcnKS5zZXJ2aWNlTmFtZVxuY29uc3Qgc2VydmljZUlkID0gcmVxdWlyZSgnLi9zZXJ2aWNlSWQuanNvbicpXG5cbmNvbnN0IGdldFNoYXJlZENvbmZpZyA9IGplc3VzLmdldFNoYXJlZENvbmZpZyhyZXF1aXJlKCcuL2NvbmZpZycpLnNoYXJlZFNlcnZpY2VzUGF0aClcbmNvbnN0IGdldENvbnNvbGUgPSAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykgPT4gamVzdXMuZ2V0Q29uc29sZShyZXF1aXJlKCcuL2NvbmZpZycpLmNvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spXG5jb25zdCBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXN5bmMgIGF1dGhvcml6ZSAoe2FjdGlvbiwgZW50aXR5TmFtZSwgaWQsIG1ldGF9KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gREkud2Fybih7bXNnOiBgYXV0aG9yaXplYCwgZGVidWc6IHthY3Rpb24sIGVudGl0eU5hbWUsIGl0ZW1zSWRzLCBtZXRhfX0pXG4gICAgICByZXR1cm4ge1xuICAgICAgICB1c2VyRGF0YTogeyd1c2VySWQnOiAnMTk1MTUxNjYyNjYxJ31cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgbGlzdGVuRXZlbnRzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGF1dGhvcml6YXRpb25zJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9XG59XG4iXX0=