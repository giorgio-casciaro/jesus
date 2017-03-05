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
  listenEvents: function listenEvents(data, meta, res, getStream) {
    var _this = this;

    // STREAM
    try {
      var onStreamClose = function onStreamClose() {
        return eventsStream.removeListener('captured', stream);
      };
      var stream = getStream(onStreamClose, 120000);
      //eventsStream.on('captured', (data)=>stream(data).catch(error=>errorThrow('problems during streaming', {error})))
      eventsStream.on('captured', function _callee(data) {
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                try {
                  stream(data);
                } catch (error) {
                  CONSOLE.warn('problems during stream', error);
                }

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, null, _this);
      });
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

            CONSOLE.debug('capture requestId:' + meta.requestId, { data: data, meta: meta, eventsStream: eventsStream });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIkNPTlNPTEUiLCJlcnJvclRocm93IiwiTUFYX1JFUVVFU1RfVElNRU9VVCIsIkV2ZW50RW1pdHRlciIsImV2ZW50c1N0cmVhbSIsImdsb2JhbCIsIm1vZHVsZSIsImV4cG9ydHMiLCJsaXN0ZW5FdmVudHMiLCJkYXRhIiwibWV0YSIsInJlcyIsImdldFN0cmVhbSIsIm9uU3RyZWFtQ2xvc2UiLCJyZW1vdmVMaXN0ZW5lciIsInN0cmVhbSIsIm9uIiwiZXJyb3IiLCJ3YXJuIiwic3RyZWFtQ29ubmVjdGVkIiwib3JpZ2luYWxFcnJvciIsImNhcHR1cmUiLCJkZWJ1ZyIsInJlcXVlc3RJZCIsImVtaXQiXSwibWFwcGluZ3MiOiI7O0FBQ0EsSUFBTUEsUUFBUUMsUUFBUSxnQkFBUixDQUFkO0FBQ0EsSUFBTUMsVUFBVSxTQUFoQjtBQUNBLElBQU1DLGNBQWNGLFFBQVEsVUFBUixFQUFvQkUsV0FBeEM7QUFDQSxJQUFNQyxZQUFZSCxRQUFRLGtCQUFSLENBQWxCOztBQUVBLElBQU1JLGtCQUFrQkwsTUFBTUssZUFBTixDQUFzQkosUUFBUSxVQUFSLEVBQW9CSyxrQkFBMUMsQ0FBeEI7QUFDQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0osV0FBRCxFQUFjQyxTQUFkLEVBQXlCSSxJQUF6QjtBQUFBLFNBQWtDUixNQUFNTyxVQUFOLENBQWlCTixRQUFRLFVBQVIsRUFBb0JRLE9BQXJDLEVBQThDTixXQUE5QyxFQUEyREMsU0FBM0QsRUFBc0VJLElBQXRFLENBQWxDO0FBQUEsQ0FBbkI7QUFDQSxJQUFNRSxVQUFVSCxXQUFXSixXQUFYLEVBQXdCQyxTQUF4QixFQUFtQ0YsT0FBbkMsQ0FBaEI7QUFDQSxJQUFJUyxhQUFhWCxNQUFNVyxVQUFOLENBQWlCUixXQUFqQixFQUE4QkMsU0FBOUIsRUFBeUNGLE9BQXpDLENBQWpCOztBQUVBLElBQU1VLHNCQUFzQlgsUUFBUSxVQUFSLEVBQW9CVyxtQkFBcEIsSUFBMkMsTUFBdkU7QUFDQSxJQUFNQyxlQUFlWixRQUFRLFFBQVIsQ0FBckI7QUFDQSxJQUFJYSxlQUFlQyxPQUFPRCxZQUFQLEdBQXNCQyxPQUFPRCxZQUFQLElBQXVCLElBQUlELFlBQUosRUFBaEU7O0FBRUFHLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsY0FEZSx3QkFDREMsSUFEQyxFQUNLQyxJQURMLEVBQ1dDLEdBRFgsRUFDZ0JDLFNBRGhCLEVBQzJCO0FBQUE7O0FBQUU7QUFDMUMsUUFBSTtBQUNGLFVBQUlDLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxlQUFNVCxhQUFhVSxjQUFiLENBQTRCLFVBQTVCLEVBQXdDQyxNQUF4QyxDQUFOO0FBQUEsT0FBcEI7QUFDQSxVQUFJQSxTQUFTSCxVQUFVQyxhQUFWLEVBQXlCLE1BQXpCLENBQWI7QUFDQTtBQUNBVCxtQkFBYVksRUFBYixDQUFnQixVQUFoQixFQUE0QixpQkFBTVAsSUFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQzFCLG9CQUFJO0FBQUVNLHlCQUFPTixJQUFQO0FBQWMsaUJBQXBCLENBQ0EsT0FBT1EsS0FBUCxFQUFjO0FBQ1pqQiwwQkFBUWtCLElBQVIsQ0FBYSx3QkFBYixFQUF1Q0QsS0FBdkM7QUFDRDs7QUFKeUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBNUI7QUFNQSxhQUFPLEVBQUNFLGlCQUFpQixJQUFsQixFQUFQO0FBQ0QsS0FYRCxDQVdFLE9BQU9GLEtBQVAsRUFBYztBQUNkakIsY0FBUWtCLElBQVIsQ0FBYSw4QkFBYixFQUE2Q0QsS0FBN0M7QUFDQSxhQUFPLEVBQUNBLE9BQU8sOEJBQVIsRUFBd0NHLGVBQWVILEtBQXZELEVBQVA7QUFDRDtBQUNGLEdBakJjO0FBa0JSSSxTQWxCUSxtQkFrQkNaLElBbEJELEVBa0JPQyxJQWxCUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBb0JYVixvQkFBUXNCLEtBQVIsQ0FBYyx1QkFBdUJaLEtBQUthLFNBQTFDLEVBQXFELEVBQUNkLFVBQUQsRUFBT0MsVUFBUCxFQUFhTiwwQkFBYixFQUFyRDtBQUNBQSx5QkFBYW9CLElBQWIsQ0FBa0IsVUFBbEIsRUFBOEIsVUFBOUIsRUFBMEMsRUFBQ2YsVUFBRCxFQUFPQyxVQUFQLEVBQTFDO0FBckJXO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQXVCWFYsb0JBQVFrQixJQUFSLENBQWEsOEJBQWI7QUF2QlcsOENBd0JKLEVBQUNELE9BQU8sOEJBQVIsRUFBd0NHLDJCQUF4QyxFQXhCSTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6Im1ldGhvZHMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5jb25zdCBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2plc3VzJylcbmNvbnN0IFBBQ0tBR0UgPSAnbWV0aG9kcydcbmNvbnN0IHNlcnZpY2VOYW1lID0gcmVxdWlyZSgnLi9jb25maWcnKS5zZXJ2aWNlTmFtZVxuY29uc3Qgc2VydmljZUlkID0gcmVxdWlyZSgnLi9zZXJ2aWNlSWQuanNvbicpXG5cbmNvbnN0IGdldFNoYXJlZENvbmZpZyA9IGplc3VzLmdldFNoYXJlZENvbmZpZyhyZXF1aXJlKCcuL2NvbmZpZycpLnNoYXJlZFNlcnZpY2VzUGF0aClcbmNvbnN0IGdldENvbnNvbGUgPSAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykgPT4gamVzdXMuZ2V0Q29uc29sZShyZXF1aXJlKCcuL2NvbmZpZycpLmNvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spXG5jb25zdCBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxudmFyIGVycm9yVGhyb3cgPSBqZXN1cy5lcnJvclRocm93KHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG5cbmNvbnN0IE1BWF9SRVFVRVNUX1RJTUVPVVQgPSByZXF1aXJlKCcuL2NvbmZpZycpLk1BWF9SRVFVRVNUX1RJTUVPVVQgfHwgMTIwMDAwXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKVxudmFyIGV2ZW50c1N0cmVhbSA9IGdsb2JhbC5ldmVudHNTdHJlYW0gPSBnbG9iYWwuZXZlbnRzU3RyZWFtIHx8IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbGlzdGVuRXZlbnRzIChkYXRhLCBtZXRhLCByZXMsIGdldFN0cmVhbSkgeyAvLyBTVFJFQU1cbiAgICB0cnkge1xuICAgICAgdmFyIG9uU3RyZWFtQ2xvc2UgPSAoKSA9PiBldmVudHNTdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2NhcHR1cmVkJywgc3RyZWFtKVxuICAgICAgdmFyIHN0cmVhbSA9IGdldFN0cmVhbShvblN0cmVhbUNsb3NlLCAxMjAwMDApXG4gICAgICAvL2V2ZW50c1N0cmVhbS5vbignY2FwdHVyZWQnLCAoZGF0YSk9PnN0cmVhbShkYXRhKS5jYXRjaChlcnJvcj0+ZXJyb3JUaHJvdygncHJvYmxlbXMgZHVyaW5nIHN0cmVhbWluZycsIHtlcnJvcn0pKSlcbiAgICAgIGV2ZW50c1N0cmVhbS5vbignY2FwdHVyZWQnLCBhc3luYyhkYXRhKSA9PiB7XG4gICAgICAgIHRyeSB7IHN0cmVhbShkYXRhKSB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIHN0cmVhbScsIGVycm9yKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIHtzdHJlYW1Db25uZWN0ZWQ6IHRydWV9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIGxpc3RlbkV2ZW50cycsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBsaXN0ZW5FdmVudHMnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICBjYXB0dXJlIChkYXRhLCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIENPTlNPTEUuZGVidWcoYGNhcHR1cmUgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwge2RhdGEsIG1ldGEsIGV2ZW50c1N0cmVhbX0pXG4gICAgICBldmVudHNTdHJlYW0uZW1pdCgnY2FwdHVyZWQnLCAnY2FwdHVyZWQnLCB7ZGF0YSwgbWV0YX0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIGxpc3RlbkV2ZW50cycsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBsaXN0ZW5FdmVudHMnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH1cbn1cbiJdfQ==