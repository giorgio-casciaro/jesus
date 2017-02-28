'use strict';

var entityCqrs = require('../../../entity.cqrs');
var jesus = require('../../../jesus');
var uuidV4 = require('uuid/v4');
var netClient = require('../../../net.client');

var serviceName = require('./config').serviceName;
var serviceId = require('./serviceId.json');
var getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImVudGl0eUNxcnMiLCJyZXF1aXJlIiwiamVzdXMiLCJ1dWlkVjQiLCJuZXRDbGllbnQiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsIlBBQ0tBR0UiLCJMT0ciLCJlcnJvclRocm93IiwibW9kdWxlIiwiZXhwb3J0cyIsImF1dGhvcml6ZSIsImFjdGlvbiIsImVudGl0eU5hbWUiLCJpZCIsIm1ldGEiLCJ1c2VyRGF0YSIsIkRJIiwiZXJyb3JSZXNwb25zZSIsIm1lc3NhZ2UiLCJvcmlnaW5hbEVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGFBQWFDLFFBQVEsc0JBQVIsQ0FBakI7QUFDQSxJQUFJQyxRQUFRRCxRQUFRLGdCQUFSLENBQVo7QUFDQSxJQUFNRSxTQUFTRixRQUFRLFNBQVIsQ0FBZjtBQUNBLElBQU1HLFlBQVlILFFBQVEscUJBQVIsQ0FBbEI7O0FBRUEsSUFBSUksY0FBY0osUUFBUSxVQUFSLEVBQW9CSSxXQUF0QztBQUNBLElBQUlDLFlBQVlMLFFBQVEsa0JBQVIsQ0FBaEI7QUFDQSxJQUFJTSxrQkFBa0JMLE1BQU1LLGVBQU4sQ0FBc0JOLFFBQVEsVUFBUixFQUFvQk8sa0JBQTFDLENBQXRCOztBQUVBLElBQU1DLFVBQVUsU0FBaEI7QUFDQSxJQUFJQyxNQUFNUixNQUFNUSxHQUFOLENBQVVMLFdBQVYsRUFBdUJDLFNBQXZCLEVBQWtDRyxPQUFsQyxDQUFWO0FBQ0EsSUFBSUUsYUFBYVQsTUFBTVMsVUFBTixDQUFpQk4sV0FBakIsRUFBOEJDLFNBQTlCLEVBQXlDRyxPQUF6QyxDQUFqQjs7QUFFQUcsT0FBT0MsT0FBUCxHQUFpQjtBQUNSQyxXQURRO0FBQUEsUUFDSUMsTUFESixRQUNJQSxNQURKO0FBQUEsUUFDWUMsVUFEWixRQUNZQSxVQURaO0FBQUEsUUFDd0JDLEVBRHhCLFFBQ3dCQSxFQUR4QjtBQUFBLFFBQzRCQyxJQUQ1QixRQUM0QkEsSUFENUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkNBSUo7QUFDTEMsd0JBQVUsRUFBQyxVQUFVLGNBQVg7QUFETCxhQUpJOztBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQVFKQyxHQUFHQyxhQUFILENBQWlCLEVBQUNDLFNBQVMsMkJBQVYsRUFBdUNDLDBCQUF2QyxFQUFqQixDQVJJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibWV0aG9kcy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZW50aXR5Q3FycyA9IHJlcXVpcmUoJy4uLy4uLy4uL2VudGl0eS5jcXJzJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2plc3VzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxuY29uc3QgbmV0Q2xpZW50ID0gcmVxdWlyZSgnLi4vLi4vLi4vbmV0LmNsaWVudCcpXG5cbnZhciBzZXJ2aWNlTmFtZSA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2VydmljZU5hbWVcbnZhciBzZXJ2aWNlSWQgPSByZXF1aXJlKCcuL3NlcnZpY2VJZC5qc29uJylcbnZhciBnZXRTaGFyZWRDb25maWcgPSBqZXN1cy5nZXRTaGFyZWRDb25maWcocmVxdWlyZSgnLi9jb25maWcnKS5zaGFyZWRTZXJ2aWNlc1BhdGgpXG5cbmNvbnN0IFBBQ0tBR0UgPSAnbWV0aG9kcydcbnZhciBMT0cgPSBqZXN1cy5MT0coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbnZhciBlcnJvclRocm93ID0gamVzdXMuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXN5bmMgIGF1dGhvcml6ZSAoe2FjdGlvbiwgZW50aXR5TmFtZSwgaWQsIG1ldGF9KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gREkud2Fybih7bXNnOiBgYXV0aG9yaXplYCwgZGVidWc6IHthY3Rpb24sIGVudGl0eU5hbWUsIGl0ZW1zSWRzLCBtZXRhfX0pXG4gICAgICByZXR1cm4ge1xuICAgICAgICB1c2VyRGF0YTogeyd1c2VySWQnOiAnMTk1MTUxNjYyNjYxJ31cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdwcm9ibGVtcyBkdXJpbmcgYXV0aG9yaXplJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuICAgIH1cbiAgfVxufVxuIl19