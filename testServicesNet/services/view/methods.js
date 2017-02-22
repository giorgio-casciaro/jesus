'use strict';

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var jesus = require('../../../jesus');

var serviceName = require('./config').serviceName;
var serviceId = require('./serviceId.json');
var sharedServicesPath = require('./config').sharedServicesPath;
var sharedServicePath = require('./config').sharedServicePath;
var netClient = require('../../../net.client');

process.on('unhandledRejection', function (reason, promise) {
  return LOG.error('unhandledRejection Reason: ', promise, reason);
});

var PACKAGE = 'methods';
var LOG = jesus.LOG(serviceName, serviceId, PACKAGE);
var errorThrow = jesus.errorThrow(serviceName, serviceId, PACKAGE);

var NET_CLIENT_ARGS = { sharedServicesPath: sharedServicesPath, sharedServicePath: sharedServicePath, serviceName: serviceName, serviceId: serviceId };
var netClientPackage = netClient(NET_CLIENT_ARGS);

module.exports = {
  viewsUpdated: function viewsUpdated(views, meta) {
    var entityConfig, storagePackage;
    return regeneratorRuntime.async(function viewsUpdated$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            entityConfig = require('./config.ResourceView');

            LOG.debug('start viewsUpdated()', { views: views, meta: meta });
            _context.next = 5;
            return regeneratorRuntime.awrap(entityConfig.storage({ serviceName: serviceName, serviceId: serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig }));

          case 5:
            storagePackage = _context.sent;

            storagePackage.insert({ objs: views });
            return _context.abrupt('return', { success: true });

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](0);

            LOG.warn('problems during viewsUpdated', _context.t0);
            return _context.abrupt('return', { error: 'problems during viewsUpdated', originalError: _context.t0 });

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this, [[0, 10]]);
  },
  rebuildViews: function rebuildViews(_ref, meta) {
    var entityConfig, storagePackage, loop, page, timestamp, pageItems, views;
    return regeneratorRuntime.async(function rebuildViews$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _objectDestructuringEmpty(_ref);

            _context2.prev = 1;

            LOG.debug('start rebuildViews()');
            entityConfig = require('./config.ResourceView');
            _context2.next = 6;
            return regeneratorRuntime.awrap(entityConfig.storage({ serviceName: serviceName, serviceId: serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig }));

          case 6:
            storagePackage = _context2.sent;
            loop = true;
            page = 0;
            timestamp = Date.now();
            pageItems = 10;

          case 11:
            if (!loop) {
              _context2.next = 21;
              break;
            }

            page++;
            _context2.next = 15;
            return regeneratorRuntime.awrap(netClientPackage.emit('listResources', { page: page, timestamp: timestamp, pageItems: pageItems }));

          case 15:
            views = _context2.sent;

            LOG.debug('rebuildViews() listResources response', { page: page, timestamp: timestamp, pageItems: pageItems, views: views });
            if (views && views.length) storagePackage.insert({ objs: views });
            if (!views || !views.length || views.length < pageItems) loop = false;
            _context2.next = 11;
            break;

          case 21:
            return _context2.abrupt('return', { success: true });

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2['catch'](1);

            LOG.warn('problems during rebuildViews', _context2.t0);
            return _context2.abrupt('return', { error: 'problems during rebuildViews', originalError: _context2.t0 });

          case 28:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[1, 24]]);
  },
  syncViews: function syncViews(_ref2, meta) {
    var entityConfig, storagePackage, page, timestamp, pageItems, viewsToUpdate, loop, viewsChecksums, query, toNotUpdate, viewsChecksumsIds, idsToNotUpdate, idsToUpdate, views;
    return regeneratorRuntime.async(function syncViews$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _objectDestructuringEmpty(_ref2);

            _context3.prev = 1;

            LOG.debug('start syncViews()');
            entityConfig = require('./config.ResourceView');
            _context3.next = 6;
            return regeneratorRuntime.awrap(entityConfig.storage({ serviceName: serviceName, serviceId: serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig }));

          case 6:
            storagePackage = _context3.sent;
            page = 0;
            timestamp = Date.now();
            pageItems = 10;
            //FIND VIEWS IDS TO UPDATE BY CHECKSUM

            viewsToUpdate = [];
            loop = true;

          case 12:
            if (!loop) {
              _context3.next = 31;
              break;
            }

            page++;
            _context3.next = 16;
            return regeneratorRuntime.awrap(netClientPackage.emit('listResources', { page: page, timestamp: timestamp, pageItems: pageItems, checksumOnly: true }));

          case 16:
            viewsChecksums = _context3.sent;

            LOG.debug('syncViews() listResources response', { page: page, timestamp: timestamp, pageItems: pageItems, viewsChecksums: viewsChecksums });

            if (!(viewsChecksums && viewsChecksums.length)) {
              _context3.next = 28;
              break;
            }

            query = { $or: viewsChecksums };
            _context3.next = 22;
            return regeneratorRuntime.awrap(storagePackage.find({ query: query, fields: { _id: 1 } }));

          case 22:
            toNotUpdate = _context3.sent;
            viewsChecksumsIds = viewsChecksums.map(function (view) {
              return view._id;
            });
            idsToNotUpdate = toNotUpdate.map(function (view) {
              return view._id;
            });
            idsToUpdate = viewsChecksumsIds.filter(function (viewId) {
              return idsToNotUpdate.indexOf(viewId) === -1;
            });

            viewsToUpdate = viewsToUpdate.concat(idsToUpdate);
            LOG.debug('syncViews() storagePackage.find', { query: query, toNotUpdate: toNotUpdate, idsToUpdate: idsToUpdate });

          case 28:
            if (!viewsChecksums || !viewsChecksums.length || viewsChecksums.length < pageItems) loop = false;
            _context3.next = 12;
            break;

          case 31:
            //QUERY VIEWS BY ID AND UPDATE
            LOG.debug('syncViews() viewsToUpdate', viewsToUpdate);

            if (!viewsToUpdate.length) {
              _context3.next = 37;
              break;
            }

            _context3.next = 35;
            return regeneratorRuntime.awrap(netClientPackage.emit('listResources', { idIn: viewsToUpdate }));

          case 35:
            views = _context3.sent;

            if (views && views.length) storagePackage.insert({ objs: views });

          case 37:
            return _context3.abrupt('return', { success: true });

          case 40:
            _context3.prev = 40;
            _context3.t0 = _context3['catch'](1);

            LOG.warn('problems during syncViews', _context3.t0);
            return _context3.abrupt('return', { error: 'problems during syncViews', originalError: _context3.t0 });

          case 44:
          case 'end':
            return _context3.stop();
        }
      }
    }, null, this, [[1, 40]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwic2hhcmVkU2VydmljZXNQYXRoIiwic2hhcmVkU2VydmljZVBhdGgiLCJuZXRDbGllbnQiLCJwcm9jZXNzIiwib24iLCJyZWFzb24iLCJwcm9taXNlIiwiTE9HIiwiZXJyb3IiLCJQQUNLQUdFIiwiZXJyb3JUaHJvdyIsIk5FVF9DTElFTlRfQVJHUyIsIm5ldENsaWVudFBhY2thZ2UiLCJtb2R1bGUiLCJleHBvcnRzIiwidmlld3NVcGRhdGVkIiwidmlld3MiLCJtZXRhIiwiZW50aXR5Q29uZmlnIiwiZGVidWciLCJzdG9yYWdlIiwic3RvcmFnZUNvbGxlY3Rpb24iLCJzdG9yYWdlQ29uZmlnIiwic3RvcmFnZVBhY2thZ2UiLCJpbnNlcnQiLCJvYmpzIiwic3VjY2VzcyIsIndhcm4iLCJvcmlnaW5hbEVycm9yIiwicmVidWlsZFZpZXdzIiwibG9vcCIsInBhZ2UiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwicGFnZUl0ZW1zIiwiZW1pdCIsImxlbmd0aCIsInN5bmNWaWV3cyIsInZpZXdzVG9VcGRhdGUiLCJjaGVja3N1bU9ubHkiLCJ2aWV3c0NoZWNrc3VtcyIsInF1ZXJ5IiwiJG9yIiwiZmluZCIsImZpZWxkcyIsIl9pZCIsInRvTm90VXBkYXRlIiwidmlld3NDaGVja3N1bXNJZHMiLCJtYXAiLCJ2aWV3IiwiaWRzVG9Ob3RVcGRhdGUiLCJpZHNUb1VwZGF0ZSIsImZpbHRlciIsImluZGV4T2YiLCJ2aWV3SWQiLCJjb25jYXQiLCJpZEluIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxnQkFBUixDQUFaOztBQUVBLElBQUlDLGNBQWNELFFBQVEsVUFBUixFQUFvQkMsV0FBdEM7QUFDQSxJQUFJQyxZQUFZRixRQUFRLGtCQUFSLENBQWhCO0FBQ0EsSUFBSUcscUJBQXFCSCxRQUFRLFVBQVIsRUFBb0JHLGtC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QWhFVDs7QUFBQTtBQWdFTHZCLGlCQWhFSzs7QUFpRVQsZ0JBQUlBLFNBQVNBLE1BQU1xQixNQUFuQixFQUEwQmQsZUFBZUMsTUFBZixDQUFzQixFQUFDQyxNQUFNVCxLQUFQLEVBQXRCOztBQWpFakI7QUFBQSw4Q0FvRUosRUFBQ1UsU0FBUyxJQUFWLEVBcEVJOztBQUFBO0FBQUE7QUFBQTs7QUFzRVhuQixnQkFBSW9CLElBQUosQ0FBUywyQkFBVDtBQXRFVyw4Q0F1RUosRUFBQ25CLE9BQU8sMkJBQVIsRUFBcUNvQiwyQkFBckMsRUF2RUk7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJtZXRob2RzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2plc3VzJylcblxudmFyIHNlcnZpY2VOYW1lID0gcmVxdWlyZSgnLi9jb25maWcnKS5zZXJ2aWNlTmFtZVxudmFyIHNlcnZpY2VJZCA9IHJlcXVpcmUoJy4vc2VydmljZUlkLmpzb24nKVxudmFyIHNoYXJlZFNlcnZpY2VzUGF0aCA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2hhcmVkU2VydmljZXNQYXRoXG52YXIgc2hhcmVkU2VydmljZVBhdGggPSByZXF1aXJlKCcuL2NvbmZpZycpLnNoYXJlZFNlcnZpY2VQYXRoXG5jb25zdCBuZXRDbGllbnQgPSByZXF1aXJlKCcuLi8uLi8uLi9uZXQuY2xpZW50JylcblxucHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgKHJlYXNvbiwgcHJvbWlzZSkgPT4gTE9HLmVycm9yKCd1bmhhbmRsZWRSZWplY3Rpb24gUmVhc29uOiAnLCBwcm9taXNlLCByZWFzb24pKVxuXG5jb25zdCBQQUNLQUdFID0gJ21ldGhvZHMnXG52YXIgTE9HID0gamVzdXMuTE9HKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG52YXIgZXJyb3JUaHJvdyA9IGplc3VzLmVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcblxuY29uc3QgTkVUX0NMSUVOVF9BUkdTID0ge3NoYXJlZFNlcnZpY2VzUGF0aCwgc2hhcmVkU2VydmljZVBhdGgsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWR9XG52YXIgbmV0Q2xpZW50UGFja2FnZSA9IG5ldENsaWVudChORVRfQ0xJRU5UX0FSR1MpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhc3luYyAgdmlld3NVcGRhdGVkICh2aWV3cywgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgZW50aXR5Q29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcuUmVzb3VyY2VWaWV3JylcbiAgICAgIExPRy5kZWJ1Zyhgc3RhcnQgdmlld3NVcGRhdGVkKClgLCB7dmlld3MsIG1ldGF9KVxuICAgICAgdmFyIHN0b3JhZ2VQYWNrYWdlID0gYXdhaXQgZW50aXR5Q29uZmlnLnN0b3JhZ2Uoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb2xsZWN0aW9uOiBlbnRpdHlDb25maWcuc3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWc6IGVudGl0eUNvbmZpZy5zdG9yYWdlQ29uZmlnfSlcbiAgICAgIHN0b3JhZ2VQYWNrYWdlLmluc2VydCh7b2Jqczogdmlld3N9KVxuICAgICAgcmV0dXJuIHtzdWNjZXNzOiB0cnVlfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMT0cud2FybigncHJvYmxlbXMgZHVyaW5nIHZpZXdzVXBkYXRlZCcsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyB2aWV3c1VwZGF0ZWQnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICByZWJ1aWxkVmlld3MgKHt9LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIExPRy5kZWJ1Zyhgc3RhcnQgcmVidWlsZFZpZXdzKClgKVxuICAgICAgdmFyIGVudGl0eUNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnLlJlc291cmNlVmlldycpXG4gICAgICB2YXIgc3RvcmFnZVBhY2thZ2UgPSBhd2FpdCBlbnRpdHlDb25maWcuc3RvcmFnZSh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgc3RvcmFnZUNvbGxlY3Rpb246IGVudGl0eUNvbmZpZy5zdG9yYWdlQ29sbGVjdGlvbiwgc3RvcmFnZUNvbmZpZzogZW50aXR5Q29uZmlnLnN0b3JhZ2VDb25maWd9KVxuICAgICAgdmFyIGxvb3AgPSB0cnVlXG4gICAgICB2YXIgcGFnZSA9IDBcbiAgICAgIHZhciB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgICB2YXIgcGFnZUl0ZW1zID0gMTBcbiAgICAgIHdoaWxlIChsb29wKSB7XG4gICAgICAgIHBhZ2UrK1xuICAgICAgICB2YXIgdmlld3MgPSBhd2FpdCBuZXRDbGllbnRQYWNrYWdlLmVtaXQoJ2xpc3RSZXNvdXJjZXMnLCB7cGFnZSwgdGltZXN0YW1wLCBwYWdlSXRlbXN9KVxuICAgICAgICBMT0cuZGVidWcoYHJlYnVpbGRWaWV3cygpIGxpc3RSZXNvdXJjZXMgcmVzcG9uc2VgLCB7cGFnZSwgdGltZXN0YW1wLCBwYWdlSXRlbXMsIHZpZXdzfSlcbiAgICAgICAgaWYgKHZpZXdzICYmIHZpZXdzLmxlbmd0aClzdG9yYWdlUGFja2FnZS5pbnNlcnQoe29ianM6IHZpZXdzfSlcbiAgICAgICAgaWYgKCF2aWV3cyB8fCAhdmlld3MubGVuZ3RoIHx8IHZpZXdzLmxlbmd0aCA8IHBhZ2VJdGVtcylsb29wID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiB7c3VjY2VzczogdHJ1ZX1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTE9HLndhcm4oJ3Byb2JsZW1zIGR1cmluZyByZWJ1aWxkVmlld3MnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgcmVidWlsZFZpZXdzJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICBhc3luYyAgc3luY1ZpZXdzICh7fSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cuZGVidWcoYHN0YXJ0IHN5bmNWaWV3cygpYClcbiAgICAgIHZhciBlbnRpdHlDb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZVZpZXcnKVxuICAgICAgdmFyIHN0b3JhZ2VQYWNrYWdlID0gYXdhaXQgZW50aXR5Q29uZmlnLnN0b3JhZ2Uoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb2xsZWN0aW9uOiBlbnRpdHlDb25maWcuc3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWc6IGVudGl0eUNvbmZpZy5zdG9yYWdlQ29uZmlnfSlcbiAgICAgIHZhciBwYWdlID0gMFxuICAgICAgdmFyIHRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICAgIHZhciBwYWdlSXRlbXMgPSAxMFxuICAgICAgLy9GSU5EIFZJRVdTIElEUyBUTyBVUERBVEUgQlkgQ0hFQ0tTVU1cbiAgICAgIHZhciB2aWV3c1RvVXBkYXRlID0gW11cbiAgICAgIHZhciBsb29wID0gdHJ1ZVxuICAgICAgd2hpbGUgKGxvb3ApIHtcbiAgICAgICAgcGFnZSsrXG4gICAgICAgIHZhciB2aWV3c0NoZWNrc3VtcyA9IGF3YWl0IG5ldENsaWVudFBhY2thZ2UuZW1pdCgnbGlzdFJlc291cmNlcycsIHtwYWdlLCB0aW1lc3RhbXAsIHBhZ2VJdGVtcywgY2hlY2tzdW1Pbmx5OiB0cnVlfSlcbiAgICAgICAgTE9HLmRlYnVnKGBzeW5jVmlld3MoKSBsaXN0UmVzb3VyY2VzIHJlc3BvbnNlYCwge3BhZ2UsIHRpbWVzdGFtcCwgcGFnZUl0ZW1zLCB2aWV3c0NoZWNrc3Vtc30pXG4gICAgICAgIGlmICh2aWV3c0NoZWNrc3VtcyAmJiB2aWV3c0NoZWNrc3Vtcy5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgcXVlcnkgPSB7JG9yOiB2aWV3c0NoZWNrc3Vtc31cbiAgICAgICAgICB2YXIgdG9Ob3RVcGRhdGUgPSBhd2FpdCBzdG9yYWdlUGFja2FnZS5maW5kKHtxdWVyeSwgZmllbGRzOiB7IF9pZDogMSB9IH0pXG4gICAgICAgICAgdmFyIHZpZXdzQ2hlY2tzdW1zSWRzPXZpZXdzQ2hlY2tzdW1zLm1hcCh2aWV3ID0+IHZpZXcuX2lkKVxuICAgICAgICAgIHZhciBpZHNUb05vdFVwZGF0ZSA9IHRvTm90VXBkYXRlLm1hcCh2aWV3ID0+IHZpZXcuX2lkKVxuICAgICAgICAgIHZhciBpZHNUb1VwZGF0ZT12aWV3c0NoZWNrc3Vtc0lkcy5maWx0ZXIodmlld0lkID0+IGlkc1RvTm90VXBkYXRlLmluZGV4T2Yodmlld0lkKT09PS0xKVxuICAgICAgICAgIHZpZXdzVG9VcGRhdGUgPSB2aWV3c1RvVXBkYXRlLmNvbmNhdChpZHNUb1VwZGF0ZSlcbiAgICAgICAgICBMT0cuZGVidWcoYHN5bmNWaWV3cygpIHN0b3JhZ2VQYWNrYWdlLmZpbmRgLCB7cXVlcnksIHRvTm90VXBkYXRlLCBpZHNUb1VwZGF0ZX0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2aWV3c0NoZWNrc3VtcyB8fCAhdmlld3NDaGVja3N1bXMubGVuZ3RoIHx8IHZpZXdzQ2hlY2tzdW1zLmxlbmd0aCA8IHBhZ2VJdGVtcylsb29wID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIC8vUVVFUlkgVklFV1MgQlkgSUQgQU5EIFVQREFURVxuICAgICAgTE9HLmRlYnVnKGBzeW5jVmlld3MoKSB2aWV3c1RvVXBkYXRlYCwgdmlld3NUb1VwZGF0ZSlcbiAgICAgIGlmKHZpZXdzVG9VcGRhdGUubGVuZ3RoKXtcbiAgICAgICAgdmFyIHZpZXdzID0gYXdhaXQgbmV0Q2xpZW50UGFja2FnZS5lbWl0KCdsaXN0UmVzb3VyY2VzJywge2lkSW46dmlld3NUb1VwZGF0ZX0pXG4gICAgICAgIGlmICh2aWV3cyAmJiB2aWV3cy5sZW5ndGgpc3RvcmFnZVBhY2thZ2UuaW5zZXJ0KHtvYmpzOiB2aWV3c30pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7c3VjY2VzczogdHJ1ZX1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTE9HLndhcm4oJ3Byb2JsZW1zIGR1cmluZyBzeW5jVmlld3MnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgc3luY1ZpZXdzJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9XG59XG4iXX0=