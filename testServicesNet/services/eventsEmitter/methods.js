'use strict';

var jesus = require('../../../jesus');

var serviceName = require('./config').serviceName;
var serviceId = require('./serviceId.json');
var getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath);
var getConsole = function getConsole(serviceName, serviceId, pack) {
  return jesus.getConsole(require('./config').console, serviceName, serviceId, pack);
};

var PACKAGE = 'methods';
var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
var MAX_REQUEST_TIMEOUT = require('./config').MAX_REQUEST_TIMEOUT || 120000;

var EventEmitter = require('events');
CONSOLE.debug('eventsStream global', global.eventsStream);
var eventsStream = global.eventsStream = global.eventsStream || new EventEmitter();
module.exports = {
  listenEvents: function listenEvents(views, meta, stream) {
    try {
      CONSOLE.debug('start listenEvents() requestId:' + meta.requestId, { views: views, meta: meta, stream: stream, eventsStream: eventsStream });
      var callback = function callback(data, meta) {
        CONSOLE.debug("listenEvents() callback count events 'connection'", eventsStream.listenerCount('connection'));
        stream.write(data);
      };
      var removeCallback = function removeCallback(r) {
        CONSOLE.debug("listenEvents() removeCallback count events 'connection'", eventsStream.listenerCount('connection'));
        eventsStream.removeListener('connection', callback);
      };
      eventsStream.on('captured', callback);
      stream.res.on('close', removeCallback);
      stream.res.on('finish', removeCallback);
      stream.write({ connected: true });
      var maxTimeout = setTimeout(function () {
        CONSOLE.debug("listenEvents() maxTimeout closing requestId:" + meta.requestId);
        stream.res.end();
      }, MAX_REQUEST_TIMEOUT);
      // setInterval(() => stream.write({keepAlive: true}), 1000)
    } catch (error) {
      CONSOLE.warn('problems during listenEvents', error);
      return { error: 'problems during listenEvents', originalError: error };
    }
  },
  capture: function capture(data, meta) {
    return regeneratorRuntime.async(function capture$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            CONSOLE.debug('capture requestId:' + meta.requestId, { data: data, meta: meta, eventsStream: eventsStream });
            eventsStream.emit('captured', data, meta);
            _context.next = 9;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context['catch'](0);

            CONSOLE.warn('problems during listenEvents', _context.t0);
            return _context.abrupt('return', { error: 'problems during listenEvents', originalError: _context.t0 });

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this, [[0, 5]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiZ2V0U2hhcmVkQ29uZmlnIiwic2hhcmVkU2VydmljZXNQYXRoIiwiZ2V0Q29uc29sZSIsInBhY2siLCJjb25zb2xlIiwiUEFDS0FHRSIsIkNPTlNPTEUiLCJNQVhfUkVRVUVTVF9USU1FT1VUIiwiRXZlbnRFbWl0dGVyIiwiZGVidWciLCJnbG9iYWwiLCJldmVudHNTdHJlYW0iLCJtb2R1bGUiLCJleHBvcnRzIiwibGlzdGVuRXZlbnRzIiwidmlld3MiLCJtZXRhIiwic3RyZWFtIiwicmVxdWVzdElkIiwiY2FsbGJhY2siLCJkYXRhIiwibGlzdGVuZXJDb3VudCIsIndyaXRlIiwicmVtb3ZlQ2FsbGJhY2siLCJyIiwicmVtb3ZlTGlzdGVuZXIiLCJvbiIsInJlcyIsImNvbm5lY3RlZCIsIm1heFRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZW5kIiwiZXJyb3IiLCJ3YXJuIiwib3JpZ2luYWxFcnJvciIsImNhcHR1cmUiLCJlbWl0Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFFBQVFDLFFBQVEsZ0JBQVIsQ0FBWjs7QUFFQSxJQUFJQyxjQUFjRCxRQUFRLFVBQVIsRUFBb0JDLFdBQXRDO0FBQ0EsSUFBSUMsWUFBWUYsUUFBUSxrQkFBUixDQUFoQjtBQUNBLElBQUlHLGtCQUFrQkosTUFBTUksZUFBTixDQUFzQkgsUUFBUSxVQUFSLEVBQW9CSSxrQkFBMUMsQ0FBdEI7QUFDQSxJQUFJQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0osV0FBRCxFQUFjQyxTQUFkLEVBQXlCSSxJQUF6QjtBQUFBLFNBQWtDUCxNQUFNTSxVQUFOLENBQWlCTCxRQUFRLFVBQVIsRUFBb0JPLE9BQXJDLEVBQThDTixXQUE5QyxFQUEyREMsU0FBM0QsRUFBc0VJLElBQXRFLENBQWxDO0FBQUEsQ0FBakI7O0FBRUEsSUFBTUUsVUFBVSxTQUFoQjtBQUNBLElBQUlDLFVBQVVKLFdBQVdKLFdBQVgsRUFBd0JDLFNBQXhCLEVBQW1DTSxPQUFuQyxDQUFkO0FBQ0EsSUFBTUUsc0JBQXNCVixRQUFRLFVBQVIsRUFBb0JVLG1CQUFwQixJQUEyQyxNQUF2RTs7QUFFQSxJQUFNQyxlQUFlWCxRQUFRLFFBQVIsQ0FBckI7QUFDQVMsUUFBUUcsS0FBUixDQUFjLHFCQUFkLEVBQXFDQyxPQUFPQyxZQUE1QztBQUNBLElBQUlBLGVBQWVELE9BQU9DLFlBQVAsR0FBc0JELE9BQU9DLFlBQVAsSUFBdUIsSUFBSUgsWUFBSixFQUFoRTtBQUNBSSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLGNBRGUsd0JBQ0RDLEtBREMsRUFDTUMsSUFETixFQUNZQyxNQURaLEVBQ29CO0FBQ2pDLFFBQUk7QUFDRlgsY0FBUUcsS0FBUixDQUFjLG9DQUFvQ08sS0FBS0UsU0FBdkQsRUFBa0UsRUFBQ0gsWUFBRCxFQUFRQyxVQUFSLEVBQWNDLGNBQWQsRUFBc0JOLDBCQUF0QixFQUFsRTtBQUNBLFVBQUlRLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxJQUFELEVBQU9KLElBQVAsRUFBZ0I7QUFDN0JWLGdCQUFRRyxLQUFSLENBQWMsbURBQWQsRUFBbUVFLGFBQWFVLGFBQWIsQ0FBMkIsWUFBM0IsQ0FBbkU7QUFDQUosZUFBT0ssS0FBUCxDQUFhRixJQUFiO0FBQ0QsT0FIRDtBQUlBLFVBQUlHLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ0MsQ0FBRCxFQUFPO0FBQzFCbEIsZ0JBQVFHLEtBQVIsQ0FBYyx5REFBZCxFQUF5RUUsYUFBYVUsYUFBYixDQUEyQixZQUEzQixDQUF6RTtBQUNBVixxQkFBYWMsY0FBYixDQUE0QixZQUE1QixFQUEwQ04sUUFBMUM7QUFDRCxPQUhEO0FBSUFSLG1CQUFhZSxFQUFiLENBQWdCLFVBQWhCLEVBQTRCUCxRQUE1QjtBQUNBRixhQUFPVSxHQUFQLENBQVdELEVBQVgsQ0FBYyxPQUFkLEVBQXVCSCxjQUF2QjtBQUNBTixhQUFPVSxHQUFQLENBQVdELEVBQVgsQ0FBYyxRQUFkLEVBQXdCSCxjQUF4QjtBQUNBTixhQUFPSyxLQUFQLENBQWEsRUFBQ00sV0FBVyxJQUFaLEVBQWI7QUFDQSxVQUFJQyxhQUFhQyxXQUFXLFlBQU07QUFDaEN4QixnQkFBUUcsS0FBUixDQUFjLGlEQUFnRE8sS0FBS0UsU0FBbkU7QUFDQUQsZUFBT1UsR0FBUCxDQUFXSSxHQUFYO0FBQ0QsT0FIZ0IsRUFHZHhCLG1CQUhjLENBQWpCO0FBSUE7QUFDRCxLQW5CRCxDQW1CRSxPQUFPeUIsS0FBUCxFQUFjO0FBQ2QxQixjQUFRMkIsSUFBUixDQUFhLDhCQUFiLEVBQTZDRCxLQUE3QztBQUNBLGFBQU8sRUFBQ0EsT0FBTyw4QkFBUixFQUF3Q0UsZUFBZUYsS0FBdkQsRUFBUDtBQUNEO0FBQ0YsR0F6QmM7QUEwQlJHLFNBMUJRLG1CQTBCQ2YsSUExQkQsRUEwQk9KLElBMUJQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUE0QlhWLG9CQUFRRyxLQUFSLENBQWMsdUJBQXVCTyxLQUFLRSxTQUExQyxFQUFxRCxFQUFDRSxVQUFELEVBQU9KLFVBQVAsRUFBYUwsMEJBQWIsRUFBckQ7QUFDQUEseUJBQWF5QixJQUFiLENBQWtCLFVBQWxCLEVBQThCaEIsSUFBOUIsRUFBb0NKLElBQXBDO0FBN0JXO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQStCWFYsb0JBQVEyQixJQUFSLENBQWEsOEJBQWI7QUEvQlcsNkNBZ0NKLEVBQUNELE9BQU8sOEJBQVIsRUFBd0NFLDBCQUF4QyxFQWhDSTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6Im1ldGhvZHMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGplc3VzID0gcmVxdWlyZSgnLi4vLi4vLi4vamVzdXMnKVxuXG52YXIgc2VydmljZU5hbWUgPSByZXF1aXJlKCcuL2NvbmZpZycpLnNlcnZpY2VOYW1lXG52YXIgc2VydmljZUlkID0gcmVxdWlyZSgnLi9zZXJ2aWNlSWQuanNvbicpXG52YXIgZ2V0U2hhcmVkQ29uZmlnID0gamVzdXMuZ2V0U2hhcmVkQ29uZmlnKHJlcXVpcmUoJy4vY29uZmlnJykuc2hhcmVkU2VydmljZXNQYXRoKVxudmFyIGdldENvbnNvbGUgPSAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykgPT4gamVzdXMuZ2V0Q29uc29sZShyZXF1aXJlKCcuL2NvbmZpZycpLmNvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spXG5cbmNvbnN0IFBBQ0tBR0UgPSAnbWV0aG9kcydcbnZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuY29uc3QgTUFYX1JFUVVFU1RfVElNRU9VVCA9IHJlcXVpcmUoJy4vY29uZmlnJykuTUFYX1JFUVVFU1RfVElNRU9VVCB8fCAxMjAwMDBcblxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJylcbkNPTlNPTEUuZGVidWcoJ2V2ZW50c1N0cmVhbSBnbG9iYWwnLCBnbG9iYWwuZXZlbnRzU3RyZWFtKVxudmFyIGV2ZW50c1N0cmVhbSA9IGdsb2JhbC5ldmVudHNTdHJlYW0gPSBnbG9iYWwuZXZlbnRzU3RyZWFtIHx8IG5ldyBFdmVudEVtaXR0ZXIoKVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGxpc3RlbkV2ZW50cyAodmlld3MsIG1ldGEsIHN0cmVhbSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCBsaXN0ZW5FdmVudHMoKSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkLCB7dmlld3MsIG1ldGEsIHN0cmVhbSwgZXZlbnRzU3RyZWFtfSlcbiAgICAgIHZhciBjYWxsYmFjayA9IChkYXRhLCBtZXRhKSA9PiB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoXCJsaXN0ZW5FdmVudHMoKSBjYWxsYmFjayBjb3VudCBldmVudHMgJ2Nvbm5lY3Rpb24nXCIsIGV2ZW50c1N0cmVhbS5saXN0ZW5lckNvdW50KCdjb25uZWN0aW9uJykpXG4gICAgICAgIHN0cmVhbS53cml0ZShkYXRhKVxuICAgICAgfVxuICAgICAgdmFyIHJlbW92ZUNhbGxiYWNrID0gKHIpID0+IHtcbiAgICAgICAgQ09OU09MRS5kZWJ1ZyhcImxpc3RlbkV2ZW50cygpIHJlbW92ZUNhbGxiYWNrIGNvdW50IGV2ZW50cyAnY29ubmVjdGlvbidcIiwgZXZlbnRzU3RyZWFtLmxpc3RlbmVyQ291bnQoJ2Nvbm5lY3Rpb24nKSlcbiAgICAgICAgZXZlbnRzU3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdjb25uZWN0aW9uJywgY2FsbGJhY2spXG4gICAgICB9XG4gICAgICBldmVudHNTdHJlYW0ub24oJ2NhcHR1cmVkJywgY2FsbGJhY2spXG4gICAgICBzdHJlYW0ucmVzLm9uKCdjbG9zZScsIHJlbW92ZUNhbGxiYWNrKVxuICAgICAgc3RyZWFtLnJlcy5vbignZmluaXNoJywgcmVtb3ZlQ2FsbGJhY2spXG4gICAgICBzdHJlYW0ud3JpdGUoe2Nvbm5lY3RlZDogdHJ1ZX0pXG4gICAgICB2YXIgbWF4VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBDT05TT0xFLmRlYnVnKFwibGlzdGVuRXZlbnRzKCkgbWF4VGltZW91dCBjbG9zaW5nIHJlcXVlc3RJZDpcIisgbWV0YS5yZXF1ZXN0SWQpXG4gICAgICAgIHN0cmVhbS5yZXMuZW5kKCk7XG4gICAgICB9LCBNQVhfUkVRVUVTVF9USU1FT1VUKVxuICAgICAgLy8gc2V0SW50ZXJ2YWwoKCkgPT4gc3RyZWFtLndyaXRlKHtrZWVwQWxpdmU6IHRydWV9KSwgMTAwMClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgbGlzdGVuRXZlbnRzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGxpc3RlbkV2ZW50cycsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIGNhcHR1cmUgKGRhdGEsIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1ZyhgY2FwdHVyZSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkLCB7ZGF0YSwgbWV0YSwgZXZlbnRzU3RyZWFtfSlcbiAgICAgIGV2ZW50c1N0cmVhbS5lbWl0KCdjYXB0dXJlZCcsIGRhdGEsIG1ldGEpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIGxpc3RlbkV2ZW50cycsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBsaXN0ZW5FdmVudHMnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH1cbn1cbiJdfQ==