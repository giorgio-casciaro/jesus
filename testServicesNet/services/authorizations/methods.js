'use strict';

var entityCqrs = require('../../../entity.cqrs');
var jesus = require('../../../jesus');
var uuidV4 = require('uuid/v4');
var netClient = require('../../../net.client');

var serviceName = require('./config').serviceName;
var serviceId = require('./serviceId.json');
var getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath);
var getConsole = function getConsole(serviceName, serviceId, pack) {
  return jesus.getConsole(require('./config').console, serviceName, serviceId, pack);
};

var PACKAGE = 'methods';
var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
var errorThrow = jesus.errorThrow(serviceName, serviceId, PACKAGE);

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
              userData: { 'userId': '195151662661' }
            });

          case 4:
            _context.prev = 4;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', DI.errorResponse({ message: 'problems during authorize', originalError: _context.t0 }));

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this, [[0, 4]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImVudGl0eUNxcnMiLCJyZXF1aXJlIiwiamVzdXMiLCJ1dWlkVjQiLCJuZXRDbGllbnQiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIlBBQ0tBR0UiLCJDT05TT0xFIiwiZXJyb3JUaHJvdyIsIm1vZHVsZSIsImV4cG9ydHMiLCJhdXRob3JpemUiLCJhY3Rpb24iLCJlbnRpdHlOYW1lIiwiaWQiLCJtZXRhIiwidXNlckRhdGEiLCJESSIsImVycm9yUmVzcG9uc2UiLCJtZXNzYWdlIiwib3JpZ2luYWxFcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxhQUFhQyxRQUFRLHNCQUFSLENBQWpCO0FBQ0EsSUFBSUMsUUFBUUQsUUFBUSxnQkFBUixDQUFaO0FBQ0EsSUFBTUUsU0FBU0YsUUFBUSxTQUFSLENBQWY7QUFDQSxJQUFNRyxZQUFZSCxRQUFRLHFCQUFSLENBQWxCOztBQUVBLElBQUlJLGNBQWNKLFFBQVEsVUFBUixFQUFvQkksV0FBdEM7QUFDQSxJQUFJQyxZQUFZTCxRQUFRLGtCQUFSLENBQWhCO0FBQ0EsSUFBSU0sa0JBQWtCTCxNQUFNSyxlQUFOLENBQXNCTixRQUFRLFVBQVIsRUFBb0JPLGtCQUExQyxDQUF0QjtBQUNBLElBQUlDLGFBQWEsU0FBYkEsVUFBYSxDQUFDSixXQUFELEVBQWNDLFNBQWQsRUFBeUJJLElBQXpCO0FBQUEsU0FBa0NSLE1BQU1PLFVBQU4sQ0FBaUJSLFFBQVEsVUFBUixFQUFvQlUsT0FBckMsRUFBOENOLFdBQTlDLEVBQTJEQyxTQUEzRCxFQUFzRUksSUFBdEUsQ0FBbEM7QUFBQSxDQUFqQjs7QUFFQSxJQUFNRSxVQUFVLFNBQWhCO0FBQ0EsSUFBSUMsVUFBVUosV0FBV0osV0FBWCxFQUF3QkMsU0FBeEIsRUFBbUNNLE9BQW5DLENBQWQ7QUFDQSxJQUFJRSxhQUFhWixNQUFNWSxVQUFOLENBQWlCVCxXQUFqQixFQUE4QkMsU0FBOUIsRUFBeUNNLE9BQXpDLENBQWpCOztBQUVBRyxPQUFPQyxPQUFQLEdBQWlCO0FBQ1JDLFdBRFE7QUFBQSxRQUNJQyxNQURKLFFBQ0lBLE1BREo7QUFBQSxRQUNZQyxVQURaLFFBQ1lBLFVBRFo7QUFBQSxRQUN3QkMsRUFEeEIsUUFDd0JBLEVBRHhCO0FBQUEsUUFDNEJDLElBRDVCLFFBQzRCQSxJQUQ1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw2Q0FJSjtBQUNMQyx3QkFBVSxFQUFDLFVBQVUsY0FBWDtBQURMLGFBSkk7O0FBQUE7QUFBQTtBQUFBO0FBQUEsNkNBUUpDLEdBQUdDLGFBQUgsQ0FBaUIsRUFBQ0MsU0FBUywyQkFBVixFQUF1Q0MsMEJBQXZDLEVBQWpCLENBUkk7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJtZXRob2RzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBlbnRpdHlDcXJzID0gcmVxdWlyZSgnLi4vLi4vLi4vZW50aXR5LmNxcnMnKVxudmFyIGplc3VzID0gcmVxdWlyZSgnLi4vLi4vLi4vamVzdXMnKVxuY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG5jb25zdCBuZXRDbGllbnQgPSByZXF1aXJlKCcuLi8uLi8uLi9uZXQuY2xpZW50JylcblxudmFyIHNlcnZpY2VOYW1lID0gcmVxdWlyZSgnLi9jb25maWcnKS5zZXJ2aWNlTmFtZVxudmFyIHNlcnZpY2VJZCA9IHJlcXVpcmUoJy4vc2VydmljZUlkLmpzb24nKVxudmFyIGdldFNoYXJlZENvbmZpZyA9IGplc3VzLmdldFNoYXJlZENvbmZpZyhyZXF1aXJlKCcuL2NvbmZpZycpLnNoYXJlZFNlcnZpY2VzUGF0aClcbnZhciBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IGplc3VzLmdldENvbnNvbGUocmVxdWlyZSgnLi9jb25maWcnKS5jb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKVxuXG5jb25zdCBQQUNLQUdFID0gJ21ldGhvZHMnXG52YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbnZhciBlcnJvclRocm93ID0gamVzdXMuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXN5bmMgIGF1dGhvcml6ZSAoe2FjdGlvbiwgZW50aXR5TmFtZSwgaWQsIG1ldGF9KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gREkud2Fybih7bXNnOiBgYXV0aG9yaXplYCwgZGVidWc6IHthY3Rpb24sIGVudGl0eU5hbWUsIGl0ZW1zSWRzLCBtZXRhfX0pXG4gICAgICByZXR1cm4ge1xuICAgICAgICB1c2VyRGF0YTogeyd1c2VySWQnOiAnMTk1MTUxNjYyNjYxJ31cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdwcm9ibGVtcyBkdXJpbmcgYXV0aG9yaXplJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuICAgIH1cbiAgfVxufVxuIl19