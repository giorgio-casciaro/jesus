'use strict';

var jesus = require('../../../jesus');

var serviceName = require('./config').serviceName;
var serviceId = require('./serviceId.json');
var getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath);

var PACKAGE = 'methods';
var LOG = jesus.LOG(serviceName, serviceId, PACKAGE);

var EventEmitter = require('events');
LOG.debug('eventsStream global', global.eventsStream);
var eventsStream = global.eventsStream = global.eventsStream || new EventEmitter();
module.exports = {
  listenEvents: function listenEvents(views, meta, stream) {
    try {
      LOG.debug('start listenEvents() requestId:' + meta.requestId, { views: views, meta: meta, stream: stream, eventsStream: eventsStream });
      var callback = function callback(data, meta) {
        LOG.debug("listenEvents() callback count events 'connection'", eventsStream.listenerCount('connection'));
        stream.write(data);
      };
      var removeCallback = function removeCallback(r) {
        LOG.debug("listenEvents() removeCallback count events 'connection'", eventsStream.listenerCount('connection'));
        eventsStream.removeListener('connection', callback);
      };
      eventsStream.on('captured', callback);
      stream.res.on('close', removeCallback);
      stream.res.on('finish', removeCallback);
      stream.write({ connected: true });
      //setInterval(() => stream.write({keepAlive: true}), 1000)
    } catch (error) {
      LOG.warn('problems during listenEvents', error);
      return { error: 'problems during listenEvents', originalError: error };
    }
  },
  capture: function capture(data, meta) {
    return regeneratorRuntime.async(function capture$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            LOG.debug('capture requestId:' + meta.requestId, { data: data, meta: meta, eventsStream: eventsStream });
            eventsStream.emit('captured', data, meta);
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
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiZ2V0U2hhcmVkQ29uZmlnIiwic2hhcmVkU2VydmljZXNQYXRoIiwiUEFDS0FHRSIsIkxPRyIsIkV2ZW50RW1pdHRlciIsImRlYnVnIiwiZ2xvYmFsIiwiZXZlbnRzU3RyZWFtIiwibW9kdWxlIiwiZXhwb3J0cyIsImxpc3RlbkV2ZW50cyIsInZpZXdzIiwibWV0YSIsInN0cmVhbSIsInJlcXVlc3RJZCIsImNhbGxiYWNrIiwiZGF0YSIsImxpc3RlbmVyQ291bnQiLCJ3cml0ZSIsInJlbW92ZUNhbGxiYWNrIiwiciIsInJlbW92ZUxpc3RlbmVyIiwib24iLCJyZXMiLCJjb25uZWN0ZWQiLCJlcnJvciIsIndhcm4iLCJvcmlnaW5hbEVycm9yIiwiY2FwdHVyZSIsImVtaXQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxnQkFBUixDQUFaOztBQUVBLElBQUlDLGNBQWNELFFBQVEsVUFBUixFQUFvQkMsV0FBdEM7QUFDQSxJQUFJQyxZQUFZRixRQUFRLGtCQUFSLENBQWhCO0FBQ0EsSUFBSUcsa0JBQWtCSixNQUFNSSxlQUFOLENBQXNCSCxRQUFRLFVBQVIsRUFBb0JJLGtCQUExQyxDQUF0Qjs7QUFFQSxJQUFNQyxVQUFVLFNBQWhCO0FBQ0EsSUFBSUMsTUFBTVAsTUFBTU8sR0FBTixDQUFVTCxXQUFWLEVBQXVCQyxTQUF2QixFQUFrQ0csT0FBbEMsQ0FBVjs7QUFFQSxJQUFNRSxlQUFlUCxRQUFRLFFBQVIsQ0FBckI7QUFDQU0sSUFBSUUsS0FBSixDQUFVLHFCQUFWLEVBQWlDQyxPQUFPQyxZQUF4QztBQUNBLElBQUlBLGVBQWVELE9BQU9DLFlBQVAsR0FBc0JELE9BQU9DLFlBQVAsSUFBdUIsSUFBSUgsWUFBSixFQUFoRTtBQUNBSSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2RDLGNBRGMsd0JBQ0FDLEtBREEsRUFDT0MsSUFEUCxFQUNhQyxNQURiLEVBQ3FCO0FBQ2xDLFFBQUk7QUFDRlYsVUFBSUUsS0FBSixDQUFVLG9DQUFvQ08sS0FBS0UsU0FBbkQsRUFBOEQsRUFBQ0gsWUFBRCxFQUFRQyxVQUFSLEVBQWNDLGNBQWQsRUFBc0JOLDBCQUF0QixFQUE5RDtBQUNBLFVBQUlRLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxJQUFELEVBQU9KLElBQVAsRUFBZ0I7QUFDN0JULFlBQUlFLEtBQUosQ0FBVSxtREFBVixFQUErREUsYUFBYVUsYUFBYixDQUEyQixZQUEzQixDQUEvRDtBQUNBSixlQUFPSyxLQUFQLENBQWFGLElBQWI7QUFDRCxPQUhEO0FBSUEsVUFBSUcsaUJBQWlCLFNBQWpCQSxjQUFpQixDQUFDQyxDQUFELEVBQU87QUFDMUJqQixZQUFJRSxLQUFKLENBQVUseURBQVYsRUFBcUVFLGFBQWFVLGFBQWIsQ0FBMkIsWUFBM0IsQ0FBckU7QUFDQVYscUJBQWFjLGNBQWIsQ0FBNEIsWUFBNUIsRUFBMENOLFFBQTFDO0FBQ0QsT0FIRDtBQUlBUixtQkFBYWUsRUFBYixDQUFnQixVQUFoQixFQUE0QlAsUUFBNUI7QUFDQUYsYUFBT1UsR0FBUCxDQUFXRCxFQUFYLENBQWMsT0FBZCxFQUF1QkgsY0FBdkI7QUFDQU4sYUFBT1UsR0FBUCxDQUFXRCxFQUFYLENBQWMsUUFBZCxFQUF3QkgsY0FBeEI7QUFDQU4sYUFBT0ssS0FBUCxDQUFhLEVBQUNNLFdBQVcsSUFBWixFQUFiO0FBQ0E7QUFDRCxLQWZELENBZUUsT0FBT0MsS0FBUCxFQUFjO0FBQ2R0QixVQUFJdUIsSUFBSixDQUFTLDhCQUFULEVBQXlDRCxLQUF6QztBQUNBLGFBQU8sRUFBQ0EsT0FBTyw4QkFBUixFQUF3Q0UsZUFBZUYsS0FBdkQsRUFBUDtBQUNEO0FBQ0YsR0FyQmM7QUFzQlJHLFNBdEJRLG1CQXNCQ1osSUF0QkQsRUFzQk9KLElBdEJQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUF3QlhULGdCQUFJRSxLQUFKLENBQVUsdUJBQXVCTyxLQUFLRSxTQUF0QyxFQUFpRCxFQUFDRSxVQUFELEVBQU9KLFVBQVAsRUFBYUwsMEJBQWIsRUFBakQ7QUFDQUEseUJBQWFzQixJQUFiLENBQWtCLFVBQWxCLEVBQThCYixJQUE5QixFQUFvQ0osSUFBcEM7QUF6Qlc7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBMkJYVCxnQkFBSXVCLElBQUosQ0FBUyw4QkFBVDtBQTNCVyw2Q0E0QkosRUFBQ0QsT0FBTyw4QkFBUixFQUF3Q0UsMEJBQXhDLEVBNUJJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibWV0aG9kcy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgamVzdXMgPSByZXF1aXJlKCcuLi8uLi8uLi9qZXN1cycpXG5cbnZhciBzZXJ2aWNlTmFtZSA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2VydmljZU5hbWVcbnZhciBzZXJ2aWNlSWQgPSByZXF1aXJlKCcuL3NlcnZpY2VJZC5qc29uJylcbnZhciBnZXRTaGFyZWRDb25maWcgPSBqZXN1cy5nZXRTaGFyZWRDb25maWcocmVxdWlyZSgnLi9jb25maWcnKS5zaGFyZWRTZXJ2aWNlc1BhdGgpXG5cbmNvbnN0IFBBQ0tBR0UgPSAnbWV0aG9kcydcbnZhciBMT0cgPSBqZXN1cy5MT0coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcblxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJylcbkxPRy5kZWJ1ZygnZXZlbnRzU3RyZWFtIGdsb2JhbCcsIGdsb2JhbC5ldmVudHNTdHJlYW0pXG52YXIgZXZlbnRzU3RyZWFtID0gZ2xvYmFsLmV2ZW50c1N0cmVhbSA9IGdsb2JhbC5ldmVudHNTdHJlYW0gfHwgbmV3IEV2ZW50RW1pdHRlcigpXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgIGxpc3RlbkV2ZW50cyAodmlld3MsIG1ldGEsIHN0cmVhbSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cuZGVidWcoYHN0YXJ0IGxpc3RlbkV2ZW50cygpIHJlcXVlc3RJZDpgICsgbWV0YS5yZXF1ZXN0SWQsIHt2aWV3cywgbWV0YSwgc3RyZWFtLCBldmVudHNTdHJlYW19KVxuICAgICAgdmFyIGNhbGxiYWNrID0gKGRhdGEsIG1ldGEpID0+IHtcbiAgICAgICAgTE9HLmRlYnVnKFwibGlzdGVuRXZlbnRzKCkgY2FsbGJhY2sgY291bnQgZXZlbnRzICdjb25uZWN0aW9uJ1wiLCBldmVudHNTdHJlYW0ubGlzdGVuZXJDb3VudCgnY29ubmVjdGlvbicpKVxuICAgICAgICBzdHJlYW0ud3JpdGUoZGF0YSlcbiAgICAgIH1cbiAgICAgIHZhciByZW1vdmVDYWxsYmFjayA9IChyKSA9PiB7XG4gICAgICAgIExPRy5kZWJ1ZyhcImxpc3RlbkV2ZW50cygpIHJlbW92ZUNhbGxiYWNrIGNvdW50IGV2ZW50cyAnY29ubmVjdGlvbidcIiwgZXZlbnRzU3RyZWFtLmxpc3RlbmVyQ291bnQoJ2Nvbm5lY3Rpb24nKSlcbiAgICAgICAgZXZlbnRzU3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdjb25uZWN0aW9uJywgY2FsbGJhY2spXG4gICAgICB9XG4gICAgICBldmVudHNTdHJlYW0ub24oJ2NhcHR1cmVkJywgY2FsbGJhY2spXG4gICAgICBzdHJlYW0ucmVzLm9uKCdjbG9zZScsIHJlbW92ZUNhbGxiYWNrKVxuICAgICAgc3RyZWFtLnJlcy5vbignZmluaXNoJywgcmVtb3ZlQ2FsbGJhY2spXG4gICAgICBzdHJlYW0ud3JpdGUoe2Nvbm5lY3RlZDogdHJ1ZX0pXG4gICAgICAvL3NldEludGVydmFsKCgpID0+IHN0cmVhbS53cml0ZSh7a2VlcEFsaXZlOiB0cnVlfSksIDEwMDApXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIExPRy53YXJuKCdwcm9ibGVtcyBkdXJpbmcgbGlzdGVuRXZlbnRzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGxpc3RlbkV2ZW50cycsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIGNhcHR1cmUgKGRhdGEsIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgTE9HLmRlYnVnKGBjYXB0dXJlIHJlcXVlc3RJZDpgICsgbWV0YS5yZXF1ZXN0SWQsIHtkYXRhLCBtZXRhLCBldmVudHNTdHJlYW19KVxuICAgICAgZXZlbnRzU3RyZWFtLmVtaXQoJ2NhcHR1cmVkJywgZGF0YSwgbWV0YSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTE9HLndhcm4oJ3Byb2JsZW1zIGR1cmluZyBsaXN0ZW5FdmVudHMnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgbGlzdGVuRXZlbnRzJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9XG59XG4iXX0=