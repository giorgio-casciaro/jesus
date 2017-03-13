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
var errorThrow = jesus.errorThrow(serviceName, serviceId, PACKAGE);

var MAX_REQUEST_TIMEOUT = require('./config').MAX_REQUEST_TIMEOUT || 120000;
var EventEmitter = require('events');
var eventsStream = global.eventsStream = global.eventsStream || new EventEmitter();

module.exports = {
  listenEvents: function listenEvents(data, meta, getStream) {
    var _this = this;

    // STREAM
    try {
      var writeStream = function _callee(data) {
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                try {
                  stream.write(data);
                } catch (error) {
                  CONSOLE.warn('problems during stream', error);
                }

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, null, _this);
      };
      var onStreamClose = function onStreamClose() {
        return eventsStream.removeListener('captured', writeStream);
      };
      var stream = getStream(onStreamClose, 120000);
      //eventsStream.on('captured', (data)=>stream(data).catch(error=>errorThrow('problems during streaming', {error})))
      stream.write({ _connected: true });
      eventsStream.on('captured', writeStream);
      return { streamConnected: true };
    } catch (error) {
      CONSOLE.warn('problems during listenEvents', error);
      return { error: 'problems during listenEvents', originalError: error };
    }
  },
  capture: function capture(data, meta) {
    return regeneratorRuntime.async(function capture$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            CONSOLE.debug('capture corrid:' + meta.corrid, { data: data, meta: meta, eventsStream: eventsStream });
            eventsStream.emit('captured', 'captured', { data: data, meta: meta });
            _context2.next = 9;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2['catch'](0);

            CONSOLE.warn('problems during listenEvents', _context2.t0);
            return _context2.abrupt('return', { error: 'problems during listenEvents', originalError: _context2.t0 });

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[0, 5]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIkNPTlNPTEUiLCJlcnJvclRocm93IiwiTUFYX1JFUVVFU1RfVElNRU9VVCIsIkV2ZW50RW1pdHRlciIsImV2ZW50c1N0cmVhbSIsImdsb2JhbCIsIm1vZHVsZSIsImV4cG9ydHMiLCJsaXN0ZW5FdmVudHMiLCJkYXRhIiwibWV0YSIsImdldFN0cmVhbSIsIndyaXRlU3RyZWFtIiwic3RyZWFtIiwid3JpdGUiLCJlcnJvciIsIndhcm4iLCJvblN0cmVhbUNsb3NlIiwicmVtb3ZlTGlzdGVuZXIiLCJfY29ubmVjdGVkIiwib24iLCJzdHJlYW1Db25uZWN0ZWQiLCJvcmlnaW5hbEVycm9yIiwiY2FwdHVyZSIsImRlYnVnIiwiY29ycmlkIiwiZW1pdCJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFNQSxRQUFRQyxRQUFRLGdCQUFSLENBQWQ7QUFDQSxJQUFNQyxVQUFVLFNBQWhCO0FBQ0EsSUFBTUMsY0FBY0YsUUFBUSxVQUFSLEVBQW9CRSxXQUF4QztBQUNBLElBQU1DLFlBQVlILFFBQVEsa0JBQVIsQ0FBbEI7O0FBRUEsSUFBTUksa0JBQWtCTCxNQUFNSyxlQUFOLENBQXNCSixRQUFRLFVBQVIsRUFBb0JLLGtCQUExQyxDQUF4QjtBQUNBLElBQU1DLGFBQWEsU0FBYkEsVUFBYSxDQUFDSixXQUFELEVBQWNDLFNBQWQsRUFBeUJJLElBQXpCO0FBQUEsU0FBa0NSLE1BQU1PLFVBQU4sQ0FBaUJOLFFBQVEsVUFBUixFQUFvQlEsT0FBckMsRUFBOENOLFdBQTlDLEVBQTJEQyxTQUEzRCxFQUFzRUksSUFBdEUsQ0FBbEM7QUFBQSxDQUFuQjtBQUNBLElBQU1FLFVBQVVILFdBQVdKLFdBQVgsRUFBd0JDLFNBQXhCLEVBQW1DRixPQUFuQyxDQUFoQjtBQUNBLElBQUlTLGFBQWFYLE1BQU1XLFVBQU4sQ0FBaUJSLFdBQWpCLEVBQThCQyxTQUE5QixFQUF5Q0YsT0FBekMsQ0FBakI7O0FBRUEsSUFBTVUsc0JBQXNCWCxRQUFRLFVBQVIsRUFBb0JXLG1CQUFwQixJQUEyQyxNQUF2RTtBQUNBLElBQU1DLGVBQWVaLFFBQVEsUUFBUixDQUFyQjtBQUNBLElBQUlhLGVBQWVDLE9BQU9ELFlBQVAsR0FBc0JDLE9BQU9ELFlBQVAsSUFBdUIsSUFBSUQsWUFBSixFQUFoRTs7QUFFQUcsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxjQURlLHdCQUNEQyxJQURDLEVBQ0tDLElBREwsRUFDV0MsU0FEWCxFQUNzQjtBQUFBOztBQUFFO0FBQ3JDLFFBQUk7QUFDRixVQUFJQyxjQUFZLGlCQUFNSCxJQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDZCxvQkFBSTtBQUFFSSx5QkFBT0MsS0FBUCxDQUFhTCxJQUFiO0FBQW9CLGlCQUExQixDQUNBLE9BQU9NLEtBQVAsRUFBYztBQUNaZiwwQkFBUWdCLElBQVIsQ0FBYSx3QkFBYixFQUF1Q0QsS0FBdkM7QUFDRDs7QUFKYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUFoQjtBQU1BLFVBQUlFLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxlQUFNYixhQUFhYyxjQUFiLENBQTRCLFVBQTVCLEVBQXdDTixXQUF4QyxDQUFOO0FBQUEsT0FBcEI7QUFDQSxVQUFJQyxTQUFTRixVQUFVTSxhQUFWLEVBQXlCLE1BQXpCLENBQWI7QUFDQTtBQUNBSixhQUFPQyxLQUFQLENBQWEsRUFBQ0ssWUFBVyxJQUFaLEVBQWI7QUFDQWYsbUJBQWFnQixFQUFiLENBQWdCLFVBQWhCLEVBQTRCUixXQUE1QjtBQUNBLGFBQU8sRUFBQ1MsaUJBQWlCLElBQWxCLEVBQVA7QUFDRCxLQWJELENBYUUsT0FBT04sS0FBUCxFQUFjO0FBQ2RmLGNBQVFnQixJQUFSLENBQWEsOEJBQWIsRUFBNkNELEtBQTdDO0FBQ0EsYUFBTyxFQUFDQSxPQUFPLDhCQUFSLEVBQXdDTyxlQUFlUCxLQUF2RCxFQUFQO0FBQ0Q7QUFDRixHQW5CYztBQW9CUlEsU0FwQlEsbUJBb0JDZCxJQXBCRCxFQW9CT0MsSUFwQlA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQXNCWFYsb0JBQVF3QixLQUFSLENBQWMsb0JBQW9CZCxLQUFLZSxNQUF2QyxFQUErQyxFQUFDaEIsVUFBRCxFQUFPQyxVQUFQLEVBQWFOLDBCQUFiLEVBQS9DO0FBQ0FBLHlCQUFhc0IsSUFBYixDQUFrQixVQUFsQixFQUE4QixVQUE5QixFQUEwQyxFQUFDakIsVUFBRCxFQUFPQyxVQUFQLEVBQTFDO0FBdkJXO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQXlCWFYsb0JBQVFnQixJQUFSLENBQWEsOEJBQWI7QUF6QlcsOENBMEJKLEVBQUNELE9BQU8sOEJBQVIsRUFBd0NPLDJCQUF4QyxFQTFCSTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6Im1ldGhvZHMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5jb25zdCBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2plc3VzJylcbmNvbnN0IFBBQ0tBR0UgPSAnbWV0aG9kcydcbmNvbnN0IHNlcnZpY2VOYW1lID0gcmVxdWlyZSgnLi9jb25maWcnKS5zZXJ2aWNlTmFtZVxuY29uc3Qgc2VydmljZUlkID0gcmVxdWlyZSgnLi9zZXJ2aWNlSWQuanNvbicpXG5cbmNvbnN0IGdldFNoYXJlZENvbmZpZyA9IGplc3VzLmdldFNoYXJlZENvbmZpZyhyZXF1aXJlKCcuL2NvbmZpZycpLnNoYXJlZFNlcnZpY2VzUGF0aClcbmNvbnN0IGdldENvbnNvbGUgPSAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykgPT4gamVzdXMuZ2V0Q29uc29sZShyZXF1aXJlKCcuL2NvbmZpZycpLmNvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spXG5jb25zdCBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxudmFyIGVycm9yVGhyb3cgPSBqZXN1cy5lcnJvclRocm93KHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG5cbmNvbnN0IE1BWF9SRVFVRVNUX1RJTUVPVVQgPSByZXF1aXJlKCcuL2NvbmZpZycpLk1BWF9SRVFVRVNUX1RJTUVPVVQgfHwgMTIwMDAwXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKVxudmFyIGV2ZW50c1N0cmVhbSA9IGdsb2JhbC5ldmVudHNTdHJlYW0gPSBnbG9iYWwuZXZlbnRzU3RyZWFtIHx8IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbGlzdGVuRXZlbnRzIChkYXRhLCBtZXRhLCBnZXRTdHJlYW0pIHsgLy8gU1RSRUFNXG4gICAgdHJ5IHtcbiAgICAgIHZhciB3cml0ZVN0cmVhbT1hc3luYyhkYXRhKSA9PiB7XG4gICAgICAgIHRyeSB7IHN0cmVhbS53cml0ZShkYXRhKSB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIHN0cmVhbScsIGVycm9yKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgb25TdHJlYW1DbG9zZSA9ICgpID0+IGV2ZW50c1N0cmVhbS5yZW1vdmVMaXN0ZW5lcignY2FwdHVyZWQnLCB3cml0ZVN0cmVhbSlcbiAgICAgIHZhciBzdHJlYW0gPSBnZXRTdHJlYW0ob25TdHJlYW1DbG9zZSwgMTIwMDAwKVxuICAgICAgLy9ldmVudHNTdHJlYW0ub24oJ2NhcHR1cmVkJywgKGRhdGEpPT5zdHJlYW0oZGF0YSkuY2F0Y2goZXJyb3I9PmVycm9yVGhyb3coJ3Byb2JsZW1zIGR1cmluZyBzdHJlYW1pbmcnLCB7ZXJyb3J9KSkpXG4gICAgICBzdHJlYW0ud3JpdGUoe19jb25uZWN0ZWQ6dHJ1ZX0pXG4gICAgICBldmVudHNTdHJlYW0ub24oJ2NhcHR1cmVkJywgd3JpdGVTdHJlYW0pXG4gICAgICByZXR1cm4ge3N0cmVhbUNvbm5lY3RlZDogdHJ1ZX1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgbGlzdGVuRXZlbnRzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGxpc3RlbkV2ZW50cycsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIGNhcHR1cmUgKGRhdGEsIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1ZyhgY2FwdHVyZSBjb3JyaWQ6YCArIG1ldGEuY29ycmlkLCB7ZGF0YSwgbWV0YSwgZXZlbnRzU3RyZWFtfSlcbiAgICAgIGV2ZW50c1N0cmVhbS5lbWl0KCdjYXB0dXJlZCcsICdjYXB0dXJlZCcsIHtkYXRhLCBtZXRhfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgbGlzdGVuRXZlbnRzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGxpc3RlbkV2ZW50cycsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfVxufVxuIl19