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

var MAX_REQUEST_TIMEOUT = require('./config').MAX_REQUEST_TIMEOUT || 120000;
var EventEmitter = require('events');
var eventsStream = global.eventsStream = global.eventsStream || new EventEmitter();

module.exports = {
  listenEvents: function listenEvents(views, meta, stream) {
    try {
      CONSOLE.debug('start listenEvents() requestId:' + meta.requestId, { views: views, meta: meta, stream: stream, eventsStream: eventsStream });
      var callback = function callback(data, meta) {
        return stream.write(data);
      };
      var removeCallback = function removeCallback() {
        return eventsStream.removeListener('connection', callback);
      };
      eventsStream.on('captured', callback);
      stream.res.on('close', removeCallback);
      stream.res.on('finish', removeCallback);
      stream.write({ connected: true });
      setTimeout(stream.res.end, MAX_REQUEST_TIMEOUT);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIkNPTlNPTEUiLCJNQVhfUkVRVUVTVF9USU1FT1VUIiwiRXZlbnRFbWl0dGVyIiwiZXZlbnRzU3RyZWFtIiwiZ2xvYmFsIiwibW9kdWxlIiwiZXhwb3J0cyIsImxpc3RlbkV2ZW50cyIsInZpZXdzIiwibWV0YSIsInN0cmVhbSIsImRlYnVnIiwicmVxdWVzdElkIiwiY2FsbGJhY2siLCJkYXRhIiwid3JpdGUiLCJyZW1vdmVDYWxsYmFjayIsInJlbW92ZUxpc3RlbmVyIiwib24iLCJyZXMiLCJjb25uZWN0ZWQiLCJzZXRUaW1lb3V0IiwiZW5kIiwiZXJyb3IiLCJ3YXJuIiwib3JpZ2luYWxFcnJvciIsImNhcHR1cmUiLCJlbWl0Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFFBQVFDLFFBQVEsZ0JBQVIsQ0FBZDtBQUNBLElBQU1DLFVBQVUsU0FBaEI7QUFDQSxJQUFNQyxjQUFjRixRQUFRLFVBQVIsRUFBb0JFLFdBQXhDO0FBQ0EsSUFBTUMsWUFBWUgsUUFBUSxrQkFBUixDQUFsQjs7QUFFQSxJQUFNSSxrQkFBa0JMLE1BQU1LLGVBQU4sQ0FBc0JKLFFBQVEsVUFBUixFQUFvQkssa0JBQTFDLENBQXhCO0FBQ0EsSUFBTUMsYUFBYSxTQUFiQSxVQUFhLENBQUNKLFdBQUQsRUFBY0MsU0FBZCxFQUF5QkksSUFBekI7QUFBQSxTQUFrQ1IsTUFBTU8sVUFBTixDQUFpQk4sUUFBUSxVQUFSLEVBQW9CUSxPQUFyQyxFQUE4Q04sV0FBOUMsRUFBMkRDLFNBQTNELEVBQXNFSSxJQUF0RSxDQUFsQztBQUFBLENBQW5CO0FBQ0EsSUFBTUUsVUFBVUgsV0FBV0osV0FBWCxFQUF3QkMsU0FBeEIsRUFBbUNGLE9BQW5DLENBQWhCOztBQUVBLElBQU1TLHNCQUFzQlYsUUFBUSxVQUFSLEVBQW9CVSxtQkFBcEIsSUFBMkMsTUFBdkU7QUFDQSxJQUFNQyxlQUFlWCxRQUFRLFFBQVIsQ0FBckI7QUFDQSxJQUFJWSxlQUFlQyxPQUFPRCxZQUFQLEdBQXNCQyxPQUFPRCxZQUFQLElBQXVCLElBQUlELFlBQUosRUFBaEU7O0FBRUFHLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsY0FEZSx3QkFDREMsS0FEQyxFQUNNQyxJQUROLEVBQ1lDLE1BRFosRUFDb0I7QUFDakMsUUFBSTtBQUNGVixjQUFRVyxLQUFSLENBQWMsb0NBQW9DRixLQUFLRyxTQUF2RCxFQUFrRSxFQUFDSixZQUFELEVBQVFDLFVBQVIsRUFBY0MsY0FBZCxFQUFzQlAsMEJBQXRCLEVBQWxFO0FBQ0EsVUFBSVUsV0FBVyxTQUFYQSxRQUFXLENBQUNDLElBQUQsRUFBT0wsSUFBUDtBQUFBLGVBQWdCQyxPQUFPSyxLQUFQLENBQWFELElBQWIsQ0FBaEI7QUFBQSxPQUFmO0FBQ0EsVUFBSUUsaUJBQWlCLFNBQWpCQSxjQUFpQjtBQUFBLGVBQU1iLGFBQWFjLGNBQWIsQ0FBNEIsWUFBNUIsRUFBMENKLFFBQTFDLENBQU47QUFBQSxPQUFyQjtBQUNBVixtQkFBYWUsRUFBYixDQUFnQixVQUFoQixFQUE0QkwsUUFBNUI7QUFDQUgsYUFBT1MsR0FBUCxDQUFXRCxFQUFYLENBQWMsT0FBZCxFQUF1QkYsY0FBdkI7QUFDQU4sYUFBT1MsR0FBUCxDQUFXRCxFQUFYLENBQWMsUUFBZCxFQUF3QkYsY0FBeEI7QUFDQU4sYUFBT0ssS0FBUCxDQUFhLEVBQUNLLFdBQVcsSUFBWixFQUFiO0FBQ0FDLGlCQUFXWCxPQUFPUyxHQUFQLENBQVdHLEdBQXRCLEVBQTJCckIsbUJBQTNCO0FBQ0E7QUFDRCxLQVZELENBVUUsT0FBT3NCLEtBQVAsRUFBYztBQUNkdkIsY0FBUXdCLElBQVIsQ0FBYSw4QkFBYixFQUE2Q0QsS0FBN0M7QUFDQSxhQUFPLEVBQUNBLE9BQU8sOEJBQVIsRUFBd0NFLGVBQWVGLEtBQXZELEVBQVA7QUFDRDtBQUNGLEdBaEJjO0FBaUJSRyxTQWpCUSxtQkFpQkNaLElBakJELEVBaUJPTCxJQWpCUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBbUJYVCxvQkFBUVcsS0FBUixDQUFjLHVCQUF1QkYsS0FBS0csU0FBMUMsRUFBcUQsRUFBQ0UsVUFBRCxFQUFPTCxVQUFQLEVBQWFOLDBCQUFiLEVBQXJEO0FBQ0FBLHlCQUFhd0IsSUFBYixDQUFrQixVQUFsQixFQUE4QmIsSUFBOUIsRUFBb0NMLElBQXBDO0FBcEJXO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQXNCWFQsb0JBQVF3QixJQUFSLENBQWEsOEJBQWI7QUF0QlcsNkNBdUJKLEVBQUNELE9BQU8sOEJBQVIsRUFBd0NFLDBCQUF4QyxFQXZCSTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6Im1ldGhvZHMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgamVzdXMgPSByZXF1aXJlKCcuLi8uLi8uLi9qZXN1cycpXG5jb25zdCBQQUNLQUdFID0gJ21ldGhvZHMnXG5jb25zdCBzZXJ2aWNlTmFtZSA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2VydmljZU5hbWVcbmNvbnN0IHNlcnZpY2VJZCA9IHJlcXVpcmUoJy4vc2VydmljZUlkLmpzb24nKVxuXG5jb25zdCBnZXRTaGFyZWRDb25maWcgPSBqZXN1cy5nZXRTaGFyZWRDb25maWcocmVxdWlyZSgnLi9jb25maWcnKS5zaGFyZWRTZXJ2aWNlc1BhdGgpXG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IGplc3VzLmdldENvbnNvbGUocmVxdWlyZSgnLi9jb25maWcnKS5jb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKVxuY29uc3QgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcblxuY29uc3QgTUFYX1JFUVVFU1RfVElNRU9VVCA9IHJlcXVpcmUoJy4vY29uZmlnJykuTUFYX1JFUVVFU1RfVElNRU9VVCB8fCAxMjAwMDBcbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpXG52YXIgZXZlbnRzU3RyZWFtID0gZ2xvYmFsLmV2ZW50c1N0cmVhbSA9IGdsb2JhbC5ldmVudHNTdHJlYW0gfHwgbmV3IEV2ZW50RW1pdHRlcigpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBsaXN0ZW5FdmVudHMgKHZpZXdzLCBtZXRhLCBzdHJlYW0pIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgbGlzdGVuRXZlbnRzKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwge3ZpZXdzLCBtZXRhLCBzdHJlYW0sIGV2ZW50c1N0cmVhbX0pXG4gICAgICB2YXIgY2FsbGJhY2sgPSAoZGF0YSwgbWV0YSkgPT4gc3RyZWFtLndyaXRlKGRhdGEpXG4gICAgICB2YXIgcmVtb3ZlQ2FsbGJhY2sgPSAoKSA9PiBldmVudHNTdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2Nvbm5lY3Rpb24nLCBjYWxsYmFjaylcbiAgICAgIGV2ZW50c1N0cmVhbS5vbignY2FwdHVyZWQnLCBjYWxsYmFjaylcbiAgICAgIHN0cmVhbS5yZXMub24oJ2Nsb3NlJywgcmVtb3ZlQ2FsbGJhY2spXG4gICAgICBzdHJlYW0ucmVzLm9uKCdmaW5pc2gnLCByZW1vdmVDYWxsYmFjaylcbiAgICAgIHN0cmVhbS53cml0ZSh7Y29ubmVjdGVkOiB0cnVlfSlcbiAgICAgIHNldFRpbWVvdXQoc3RyZWFtLnJlcy5lbmQsIE1BWF9SRVFVRVNUX1RJTUVPVVQpXG4gICAgICAvLyBzZXRJbnRlcnZhbCgoKSA9PiBzdHJlYW0ud3JpdGUoe2tlZXBBbGl2ZTogdHJ1ZX0pLCAxMDAwKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDT05TT0xFLndhcm4oJ3Byb2JsZW1zIGR1cmluZyBsaXN0ZW5FdmVudHMnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgbGlzdGVuRXZlbnRzJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICBhc3luYyAgY2FwdHVyZSAoZGF0YSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBjYXB0dXJlIHJlcXVlc3RJZDpgICsgbWV0YS5yZXF1ZXN0SWQsIHtkYXRhLCBtZXRhLCBldmVudHNTdHJlYW19KVxuICAgICAgZXZlbnRzU3RyZWFtLmVtaXQoJ2NhcHR1cmVkJywgZGF0YSwgbWV0YSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgbGlzdGVuRXZlbnRzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGxpc3RlbkV2ZW50cycsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfVxufVxuIl19