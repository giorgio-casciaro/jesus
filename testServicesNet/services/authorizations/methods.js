'use strict';

var jesus = require('../../../jesus');

var serviceName = require('./config').serviceName;
var serviceId = require('./serviceId.json');
var sharedServicesPath = require('./config').sharedServicesPath;
var sharedServicePath = require('./config').sharedServicePath;

process.on('unhandledRejection', function (reason, promise) {
  return LOG.error('unhandledRejection Reason: ', promise, reason);
});

var PACKAGE = 'methods';
var LOG = jesus.LOG(serviceName, serviceId, PACKAGE);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwic2hhcmVkU2VydmljZXNQYXRoIiwic2hhcmVkU2VydmljZVBhdGgiLCJwcm9jZXNzIiwib24iLCJyZWFzb24iLCJwcm9taXNlIiwiTE9HIiwiZXJyb3IiLCJQQUNLQUdFIiwiZXJyb3JUaHJvdyIsIm1vZHVsZSIsImV4cG9ydHMiLCJhdXRob3JpemUiLCJhY3Rpb24iLCJlbnRpdHlOYW1lIiwiaWQiLCJtZXRhIiwidXNlckRhdGEiLCJESSIsImVycm9yUmVzcG9uc2UiLCJtZXNzYWdlIiwib3JpZ2luYWxFcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLGdCQUFSLENBQVo7O0FBRUEsSUFBSUMsY0FBY0QsUUFBUSxVQUFSLEVBQW9CQyxXQUF0QztBQUNBLElBQUlDLFlBQVlGLFFBQVEsa0JBQVIsQ0FBaEI7QUFDQSxJQUFJRyxxQkFBcUJILFFBQVEsVUFBUixFQUFvQkcsa0JBQTdDO0FBQ0EsSUFBSUMsb0JBQW9CSixRQUFRLFVBQVIsRUFBb0JJLGlCQUE1Qzs7QUFFQUMsUUFBUUMsRUFBUixDQUFXLG9CQUFYLEVBQWlDLFVBQUNDLE1BQUQsRUFBU0MsT0FBVDtBQUFBLFNBQXFCQyxJQUFJQyxLQUFKLENBQVUsNkJBQVYsRUFBeUNGLE9BQXpDLEVBQWtERCxNQUFsRCxDQUFyQjtBQUFBLENBQWpDOztBQUVBLElBQU1JLFVBQVUsU0FBaEI7QUFDQSxJQUFJRixNQUFNVixNQUFNVSxHQUFOLENBQVVSLFdBQVYsRUFBc0JDLFNBQXRCLEVBQWdDUyxPQUFoQyxDQUFWO0FBQ0EsSUFBSUMsYUFBYWIsTUFBTWEsVUFBTixDQUFpQlgsV0FBakIsRUFBNkJDLFNBQTdCLEVBQXVDUyxPQUF2QyxDQUFqQjs7QUFJQUUsT0FBT0MsT0FBUCxHQUFpQjtBQUNSQyxXQURRO0FBQUEsUUFDSUMsTUFESixRQUNJQSxNQURKO0FBQUEsUUFDWUMsVUFEWixRQUNZQSxVQURaO0FBQUEsUUFDd0JDLEVBRHhCLFFBQ3dCQSxFQUR4QjtBQUFBLFFBQzRCQyxJQUQ1QixRQUM0QkEsSUFENUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkNBSUo7QUFDTEMsd0JBQVUsRUFBQyxVQUFVLGNBQVg7QUFETCxhQUpJOztBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQVFKQyxHQUFHQyxhQUFILENBQWlCLEVBQUNDLFNBQVMsMkJBQVYsRUFBdUNDLDBCQUF2QyxFQUFqQixDQVJJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibWV0aG9kcy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgamVzdXMgPSByZXF1aXJlKCcuLi8uLi8uLi9qZXN1cycpXG5cbnZhciBzZXJ2aWNlTmFtZSA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2VydmljZU5hbWVcbnZhciBzZXJ2aWNlSWQgPSByZXF1aXJlKCcuL3NlcnZpY2VJZC5qc29uJylcbnZhciBzaGFyZWRTZXJ2aWNlc1BhdGggPSByZXF1aXJlKCcuL2NvbmZpZycpLnNoYXJlZFNlcnZpY2VzUGF0aFxudmFyIHNoYXJlZFNlcnZpY2VQYXRoID0gcmVxdWlyZSgnLi9jb25maWcnKS5zaGFyZWRTZXJ2aWNlUGF0aFxuXG5wcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwcm9taXNlKSA9PiBMT0cuZXJyb3IoJ3VuaGFuZGxlZFJlamVjdGlvbiBSZWFzb246ICcsIHByb21pc2UsIHJlYXNvbikpXG5cbmNvbnN0IFBBQ0tBR0UgPSAnbWV0aG9kcydcbnZhciBMT0cgPSBqZXN1cy5MT0coc2VydmljZU5hbWUsc2VydmljZUlkLFBBQ0tBR0UpXG52YXIgZXJyb3JUaHJvdyA9IGplc3VzLmVycm9yVGhyb3coc2VydmljZU5hbWUsc2VydmljZUlkLFBBQ0tBR0UpXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXN5bmMgIGF1dGhvcml6ZSAoe2FjdGlvbiwgZW50aXR5TmFtZSwgaWQsIG1ldGF9KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gREkud2Fybih7bXNnOiBgYXV0aG9yaXplYCwgZGVidWc6IHthY3Rpb24sIGVudGl0eU5hbWUsIGl0ZW1zSWRzLCBtZXRhfX0pXG4gICAgICByZXR1cm4ge1xuICAgICAgICB1c2VyRGF0YTogeyd1c2VySWQnOiAnMTk1MTUxNjYyNjYxJ31cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdwcm9ibGVtcyBkdXJpbmcgYXV0aG9yaXplJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuICAgIH1cbiAgfVxufVxuIl19