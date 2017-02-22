'use strict';

var jesus = require('../../../jesus');

var serviceName = require('./config').serviceName;
var serviceId = require('./serviceId.json');
var sharedServicesPath = require('./config').sharedServicesPath;
var sharedServicePath = require('./config').sharedServicePath;
// const netClient = require('../../../net.client')

process.on('unhandledRejection', function (reason, promise) {
  return LOG.error('unhandledRejection Reason: ', promise, reason);
});

var PACKAGE = 'methods';
var LOG = jesus.LOG(serviceName, serviceId, PACKAGE);
var errorThrow = jesus.errorThrow(serviceName, serviceId, PACKAGE);

var EventEmitter = require('events');
var eventsStream = new EventEmitter();

module.exports = {
  listenEvents: function listenEvents(views, meta, stream) {
    return regeneratorRuntime.async(function listenEvents$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            LOG.debug('start listenEvents()', { views: views, meta: meta, stream: stream });
            eventsStream.on('captured', function (data) {
              stream.write(data);
            });
            _context.next = 9;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context['catch'](0);

            LOG.warn('problems during listenEvents', _context.t0);
            return _context.abrupt('return', { error: 'problems during listenEvents', originalError: _context.t0 });

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this, [[0, 5]]);
  },
  capture: function capture(data, meta) {
    return regeneratorRuntime.async(function capture$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            LOG.debug('capture', { data: data, meta: meta });
            eventsStream.emit('captured', data);
            _context2.next = 9;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2['catch'](0);

            LOG.warn('problems during listenEvents', _context2.t0);
            return _context2.abrupt('return', { error: 'problems during listenEvents', originalError: _context2.t0 });

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[0, 5]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwic2hhcmVkU2VydmljZXNQYXRoIiwic2hhcmVkU2VydmljZVBhdGgiLCJwcm9jZXNzIiwib24iLCJyZWFzb24iLCJwcm9taXNlIiwiTE9HIiwiZXJyb3IiLCJQQUNLQUdFIiwiZXJyb3JUaHJvdyIsIkV2ZW50RW1pdHRlciIsImV2ZW50c1N0cmVhbSIsIm1vZHVsZSIsImV4cG9ydHMiLCJsaXN0ZW5FdmVudHMiLCJ2aWV3cyIsIm1ldGEiLCJzdHJlYW0iLCJkZWJ1ZyIsImRhdGEiLCJ3cml0ZSIsIndhcm4iLCJvcmlnaW5hbEVycm9yIiwiY2FwdHVyZSIsImVtaXQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxnQkFBUixDQUFaOztBQUVBLElBQUlDLGNBQWNELFFBQVEsVUFBUixFQUFvQkMsV0FBdEM7QUFDQSxJQUFJQyxZQUFZRixRQUFRLGtCQUFSLENBQWhCO0FBQ0EsSUFBSUcscUJBQXFCSCxRQUFRLFVBQVIsRUFBb0JHLGtCQUE3QztBQUNBLElBQUlDLG9CQUFvQkosUUFBUSxVQUFSLEVBQW9CSSxpQkFBNUM7QUFDQTs7QUFFQUMsUUFBUUMsRUFBUixDQUFXLG9CQUFYLEVBQWlDLFVBQUNDLE1BQUQsRUFBU0MsT0FBVDtBQUFBLFNBQXFCQyxJQUFJQyxLQUFKLENBQVUsNkJBQVYsRUFBeUNGLE9BQXpDLEVBQWtERCxNQUFsRCxDQUFyQjtBQUFBLENBQWpDOztBQUVBLElBQU1JLFVBQVUsU0FBaEI7QUFDQSxJQUFJRixNQUFNVixNQUFNVSxHQUFOLENBQVVSLFdBQVYsRUFBdUJDLFNBQXZCLEVBQWtDUyxPQUFsQyxDQUFWO0FBQ0EsSUFBSUMsYUFBYWIsTUFBTWEsVUFBTixDQUFpQlgsV0FBakIsRUFBOEJDLFNBQTlCLEVBQXlDUyxPQUF6QyxDQUFqQjs7QUFFQSxJQUFNRSxlQUFlYixRQUFRLFFBQVIsQ0FBckI7QUFDQSxJQUFJYyxlQUFlLElBQUlELFlBQUosRUFBbkI7O0FBRUFFLE9BQU9DLE9BQVAsR0FBaUI7QUFDUkMsY0FEUSx3QkFDTUMsS0FETixFQUNhQyxJQURiLEVBQ21CQyxNQURuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBR1hYLGdCQUFJWSxLQUFKLHlCQUFrQyxFQUFDSCxZQUFELEVBQVFDLFVBQVIsRUFBY0MsY0FBZCxFQUFsQztBQUNBTix5QkFBYVIsRUFBYixDQUFnQixVQUFoQixFQUE0QixVQUFDZ0IsSUFBRCxFQUFVO0FBQ3BDRixxQkFBT0csS0FBUCxDQUFhRCxJQUFiO0FBQ0QsYUFGRDtBQUpXO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQVFYYixnQkFBSWUsSUFBSixDQUFTLDhCQUFUO0FBUlcsNkNBU0osRUFBQ2QsT0FBTyw4QkFBUixFQUF3Q2UsMEJBQXhDLEVBVEk7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFZUkMsU0FaUSxtQkFZQ0osSUFaRCxFQVlPSCxJQVpQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFjWFYsZ0JBQUlZLEtBQUosWUFBcUIsRUFBQ0MsVUFBRCxFQUFPSCxVQUFQLEVBQXJCO0FBQ0FMLHlCQUFhYSxJQUFiLENBQWtCLFVBQWxCLEVBQThCTCxJQUE5QjtBQWZXO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQWlCWGIsZ0JBQUllLElBQUosQ0FBUyw4QkFBVDtBQWpCVyw4Q0FrQkosRUFBQ2QsT0FBTyw4QkFBUixFQUF3Q2UsMkJBQXhDLEVBbEJJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibWV0aG9kcy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgamVzdXMgPSByZXF1aXJlKCcuLi8uLi8uLi9qZXN1cycpXG5cbnZhciBzZXJ2aWNlTmFtZSA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2VydmljZU5hbWVcbnZhciBzZXJ2aWNlSWQgPSByZXF1aXJlKCcuL3NlcnZpY2VJZC5qc29uJylcbnZhciBzaGFyZWRTZXJ2aWNlc1BhdGggPSByZXF1aXJlKCcuL2NvbmZpZycpLnNoYXJlZFNlcnZpY2VzUGF0aFxudmFyIHNoYXJlZFNlcnZpY2VQYXRoID0gcmVxdWlyZSgnLi9jb25maWcnKS5zaGFyZWRTZXJ2aWNlUGF0aFxuLy8gY29uc3QgbmV0Q2xpZW50ID0gcmVxdWlyZSgnLi4vLi4vLi4vbmV0LmNsaWVudCcpXG5cbnByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIChyZWFzb24sIHByb21pc2UpID0+IExPRy5lcnJvcigndW5oYW5kbGVkUmVqZWN0aW9uIFJlYXNvbjogJywgcHJvbWlzZSwgcmVhc29uKSlcblxuY29uc3QgUEFDS0FHRSA9ICdtZXRob2RzJ1xudmFyIExPRyA9IGplc3VzLkxPRyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxudmFyIGVycm9yVGhyb3cgPSBqZXN1cy5lcnJvclRocm93KHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG5cbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpXG52YXIgZXZlbnRzU3RyZWFtID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhc3luYyAgbGlzdGVuRXZlbnRzICh2aWV3cywgbWV0YSwgc3RyZWFtKSB7XG4gICAgdHJ5IHtcbiAgICAgIExPRy5kZWJ1Zyhgc3RhcnQgbGlzdGVuRXZlbnRzKClgLCB7dmlld3MsIG1ldGEsIHN0cmVhbX0pXG4gICAgICBldmVudHNTdHJlYW0ub24oJ2NhcHR1cmVkJywgKGRhdGEpID0+IHtcbiAgICAgICAgc3RyZWFtLndyaXRlKGRhdGEpXG4gICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMT0cud2FybigncHJvYmxlbXMgZHVyaW5nIGxpc3RlbkV2ZW50cycsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBsaXN0ZW5FdmVudHMnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICBjYXB0dXJlIChkYXRhLCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIExPRy5kZWJ1ZyhgY2FwdHVyZWAsIHtkYXRhLCBtZXRhfSlcbiAgICAgIGV2ZW50c1N0cmVhbS5lbWl0KCdjYXB0dXJlZCcsIGRhdGEpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIExPRy53YXJuKCdwcm9ibGVtcyBkdXJpbmcgbGlzdGVuRXZlbnRzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGxpc3RlbkV2ZW50cycsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfVxufVxuIl19