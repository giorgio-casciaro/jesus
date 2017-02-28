'use strict';

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

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

var validateMethodRequest = function _callee(methodName, data) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = jesus;
          _context.t1 = serviceName;
          _context.t2 = serviceId;
          _context.next = 5;
          return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'methods'));

        case 5:
          _context.t3 = _context.sent;
          _context.t4 = methodName;
          _context.t5 = data;
          return _context.abrupt('return', _context.t0.validateMethodFromConfig.call(_context.t0, _context.t1, _context.t2, _context.t3, _context.t4, _context.t5, 'requestSchema'));

        case 9:
        case 'end':
          return _context.stop();
      }
    }
  }, null, undefined);
};
var validateMethodResponse = function _callee2(methodName, data) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.t0 = jesus;
          _context2.t1 = serviceName;
          _context2.t2 = serviceId;
          _context2.next = 5;
          return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'methods'));

        case 5:
          _context2.t3 = _context2.sent;
          _context2.t4 = methodName;
          _context2.t5 = data;
          return _context2.abrupt('return', _context2.t0.validateMethodFromConfig.call(_context2.t0, _context2.t1, _context2.t2, _context2.t3, _context2.t4, _context2.t5, 'responseSchema'));

        case 9:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, undefined);
};

var netClientPackage = netClient({ getSharedConfig: getSharedConfig, serviceName: serviceName, serviceId: serviceId });

function filterViews(views) {
  views.forEach(function (view) {
    if (view.email) delete view.email;
    if (view._viewHash) delete view._viewHash;
  });
  return views;
}

function updateViews(serviceName, serviceId, entityConfig, views, meta) {
  var storagePackage;
  return regeneratorRuntime.async(function updateViews$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(!views || !views.length)) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt('return', false);

        case 2:
          views = filterViews(views);
          LOG.debug('updateViews() filtered views', views);
          netClientPackage.emit('viewsUpdated', views, meta);
          _context3.next = 7;
          return regeneratorRuntime.awrap(entityConfig.storage({ serviceName: serviceName, serviceId: serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig }));

        case 7:
          storagePackage = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(storagePackage.insert({ objs: views }));

        case 10:
          return _context3.abrupt('return', views);

        case 11:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
}

module.exports = {
  viewsUpdated: function viewsUpdated(views, meta) {
    var entityConfig;
    return regeneratorRuntime.async(function viewsUpdated$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            entityConfig = require('./config.ResourceView');

            LOG.debug('start viewsUpdated()', { views: views, meta: meta });
            _context4.next = 5;
            return regeneratorRuntime.awrap(updateViews(serviceName, serviceId, entityConfig, views, meta));

          case 5:
            return _context4.abrupt('return', { success: true });

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](0);

            LOG.warn('problems during viewsUpdated', _context4.t0);
            return _context4.abrupt('return', { error: 'problems during viewsUpdated', originalError: _context4.t0 });

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, this, [[0, 8]]);
  },
  rebuildViews: function rebuildViews(_ref, meta) {
    var entityConfig, loop, page, timestamp, pageItems, views;
    return regeneratorRuntime.async(function rebuildViews$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _objectDestructuringEmpty(_ref);

            _context5.prev = 1;

            LOG.debug('start rebuildViews() requestId:' + meta.requestId);
            entityConfig = require('./config.ResourceView');
            loop = true;
            page = 0;
            timestamp = Date.now();
            pageItems = 10;

          case 8:
            if (!loop) {
              _context5.next = 19;
              break;
            }

            page++;
            _context5.next = 12;
            return regeneratorRuntime.awrap(netClientPackage.rpc('resources', 'listResources', { page: page, timestamp: timestamp, pageItems: pageItems }, meta));

          case 12:
            views = _context5.sent;

            LOG.debug('rebuildViews() listResources response', views);
            _context5.next = 16;
            return regeneratorRuntime.awrap(updateViews(serviceName, serviceId, entityConfig, views, meta));

          case 16:
            if (!views || !views.length || views.length < pageItems) loop = false;
            _context5.next = 8;
            break;

          case 19:
            return _context5.abrupt('return', { success: true });

          case 22:
            _context5.prev = 22;
            _context5.t0 = _context5['catch'](1);

            LOG.warn('problems during rebuildViews', _context5.t0);
            return _context5.abrupt('return', { error: 'problems during rebuildViews', originalError: _context5.t0 });

          case 26:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, this, [[1, 22]]);
  },
  syncViews: function syncViews(_ref2, meta) {
    var entityConfig, storagePackage, page, timestamp, pageItems, viewsToUpdate, loop, viewsChecksums, query, toNotUpdate, viewsChecksumsIds, idsToNotUpdate, idsToUpdate, views;
    return regeneratorRuntime.async(function syncViews$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _objectDestructuringEmpty(_ref2);

            _context6.prev = 1;

            LOG.debug('start syncViews() requestId:' + meta.requestId);
            entityConfig = require('./config.ResourceView');
            _context6.next = 6;
            return regeneratorRuntime.awrap(entityConfig.storage({ serviceName: serviceName, serviceId: serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig }));

          case 6:
            storagePackage = _context6.sent;
            page = 0;
            timestamp = Date.now();
            pageItems = 10;
            // FIND VIEWS IDS TO UPDATE BY CHECKSUM

            viewsToUpdate = [];
            loop = true;

          case 12:
            if (!loop) {
              _context6.next = 31;
              break;
            }

            page++;
            _context6.next = 16;
            return regeneratorRuntime.awrap(netClientPackage.rpc('resources', 'listResources', { page: page, timestamp: timestamp, pageItems: pageItems, checksumOnly: true }, meta));

          case 16:
            viewsChecksums = _context6.sent;

            LOG.debug('syncViews() listResources checksum response', { page: page, timestamp: timestamp, pageItems: pageItems, viewsChecksums: viewsChecksums });

            if (!(viewsChecksums && viewsChecksums.length)) {
              _context6.next = 28;
              break;
            }

            query = { $or: viewsChecksums };
            _context6.next = 22;
            return regeneratorRuntime.awrap(storagePackage.find({ query: query, fields: { _id: 1 } }));

          case 22:
            toNotUpdate = _context6.sent;
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
            _context6.next = 12;
            break;

          case 31:
            // QUERY VIEWS BY ID AND UPDATE
            LOG.debug('syncViews() viewsToUpdate requestId:' + meta.requestId, viewsToUpdate);

            if (!viewsToUpdate.length) {
              _context6.next = 39;
              break;
            }

            _context6.next = 35;
            return regeneratorRuntime.awrap(netClientPackage.rpc('resources', 'listResources', { idIn: viewsToUpdate }, meta));

          case 35:
            views = _context6.sent;

            //var views = await netClientPackage.emit('listResources', {idIn: viewsToUpdate}, meta)
            LOG.debug('syncViews() listResources response', views);
            _context6.next = 39;
            return regeneratorRuntime.awrap(updateViews(serviceName, serviceId, entityConfig, views, meta));

          case 39:
            return _context6.abrupt('return', { success: true });

          case 42:
            _context6.prev = 42;
            _context6.t0 = _context6['catch'](1);

            LOG.warn('problems during syncViews', _context6.t0);
            return _context6.abrupt('return', { error: 'problems during syncViews', originalError: _context6.t0 });

          case 46:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, this, [[1, 42]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImVudGl0eUNxcnMiLCJyZXF1aXJlIiwiamVzdXMiLCJ1dWlkVjQiLCJuZXRDbGllbnQiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsIlBBQ0tBR0UiLCJMT0ciLCJlcnJvclRocm93IiwidmFsaWRhdGVNZXRob2RSZXF1ZXN0IiwibWV0aG9kTmFtZSIsImRhdGEiLCJ2YWxpZGF0ZU1ldGhvZEZyb21Db25maWciLCJ2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlIiwibmV0Q2xpZW50UGFja2FnZSIsImZpbHRlclZpZXdzIiwidmlld3MiLCJmb3JFYWNoIiwidmlldyIsImVtYWlsIiwiX3ZpZXdIYXNoIiwidXBkYXRlVmlld3MiLCJlbnRpdHlDb25maWciLCJtZXRhIiwibGVuZ3RoIiwiZGVidWciLCJlbWl0Iiwic3RvcmFnZSIsInN0b3JhZ2VDb2xsZWN0aW9uIiwic3RvcmFnZUNvbmZpZyIsInN0b3JhZ2VQYWNrYWdlIiwiaW5zZXJ0Iiwib2JqcyIsIm1vZHVsZSIsImV4cG9ydHMiLCJ2aWV3c1VwZGF0ZWQiLCJzdWNjZXNzIiwid2FybiIsImVycm9yIiwib3JpZ2luYWxFcnJvciIsInJlYnVpbGRWaWV3cyIsInJlcXVlc3RJZCIsImxvb3AiLCJwYWdlIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInBhZ2VJdGVtcyIsInJwYyIsInN5bmNWaWV3cyIsInZpZXdzVG9VcGRhdGUiLCJjaGVja3N1bU9ubHkiLCJ2aWV3c0NoZWNrc3VtcyIsInF1ZXJ5IiwiJG9yIiwiZmluZCIsImZpZWxkcyIsIl9pZCIsInRvTm90VXBkYXRlIiwidmlld3NDaGVja3N1bXNJZHMiLCJtYXAiLCJpZHNUb05vdFVwZGF0ZSIsImlkc1RvVXBkYXRlIiwiZmlsdGVyIiwiaW5kZXhPZiIsInZpZXdJZCIsImNvbmNhdCIsImlkSW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJ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Syx3QkFBUixFQUFxQkksd0JBQXJCLEVBQTdDOztBQXZETztBQXlEVCxnQkFBSSxDQUFDVixjQUFELElBQW1CLENBQUNBLGVBQWU1QixNQUFuQyxJQUE2QzRCLGVBQWU1QixNQUFmLEdBQXdCdUIsU0FBekUsRUFBbUZMLE9BQU8sS0FBUDtBQXpEMUU7QUFBQTs7QUFBQTtBQTJEWDtBQUNBbkMsZ0JBQUlrQixLQUFKLENBQVUseUNBQXlDRixLQUFLa0IsU0FBeEQsRUFBbUVTLGFBQW5FOztBQTVEVyxpQkE2RFBBLGNBQWMxQixNQTdEUDtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLDRDQThEU1YsaUJBQWlCa0MsR0FBakIsQ0FBcUIsV0FBckIsRUFBaUMsZUFBakMsRUFBa0QsRUFBQ21CLE1BQU1qQixhQUFQLEVBQWxELEVBQXlFM0IsSUFBekUsQ0E5RFQ7O0FBQUE7QUE4RExQLGlCQTlESzs7QUErRFQ7QUFDQVQsZ0JBQUlrQixLQUFKLHVDQUFnRFQsS0FBaEQ7QUFoRVM7QUFBQSw0Q0FpRUhLLFlBQVluQixXQUFaLEVBQXlCQyxTQUF6QixFQUFvQ21CLFlBQXBDLEVBQWtETixLQUFsRCxFQUF5RE8sSUFBekQsQ0FqRUc7O0FBQUE7QUFBQSw4Q0FvRUosRUFBQ2EsU0FBUyxJQUFWLEVBcEVJOztBQUFBO0FBQUE7QUFBQTs7QUFzRVg3QixnQkFBSThCLElBQUosQ0FBUywyQkFBVDtBQXRFVyw4Q0F1RUosRUFBQ0MsT0FBTywyQkFBUixFQUFxQ0MsMkJBQXJDLEVBdkVJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibWV0aG9kcy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZW50aXR5Q3FycyA9IHJlcXVpcmUoJy4uLy4uLy4uL2VudGl0eS5jcXJzJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2plc3VzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxuY29uc3QgbmV0Q2xpZW50ID0gcmVxdWlyZSgnLi4vLi4vLi4vbmV0LmNsaWVudCcpXG5cbnZhciBzZXJ2aWNlTmFtZSA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2VydmljZU5hbWVcbnZhciBzZXJ2aWNlSWQgPSByZXF1aXJlKCcuL3NlcnZpY2VJZC5qc29uJylcbnZhciBnZXRTaGFyZWRDb25maWcgPSBqZXN1cy5nZXRTaGFyZWRDb25maWcocmVxdWlyZSgnLi9jb25maWcnKS5zaGFyZWRTZXJ2aWNlc1BhdGgpXG5cbmNvbnN0IFBBQ0tBR0UgPSAnbWV0aG9kcydcbnZhciBMT0cgPSBqZXN1cy5MT0coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbnZhciBlcnJvclRocm93ID0gamVzdXMuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG5jb25zdCB2YWxpZGF0ZU1ldGhvZFJlcXVlc3QgPSBhc3luYyAobWV0aG9kTmFtZSwgZGF0YSkgPT4gamVzdXMudmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ21ldGhvZHMnKSwgbWV0aG9kTmFtZSwgZGF0YSwgJ3JlcXVlc3RTY2hlbWEnKVxuY29uc3QgdmFsaWRhdGVNZXRob2RSZXNwb25zZSA9IGFzeW5jIChtZXRob2ROYW1lLCBkYXRhKSA9PiBqZXN1cy52YWxpZGF0ZU1ldGhvZEZyb21Db25maWcoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnbWV0aG9kcycpLCBtZXRob2ROYW1lLCBkYXRhLCAncmVzcG9uc2VTY2hlbWEnKVxuXG52YXIgbmV0Q2xpZW50UGFja2FnZSA9IG5ldENsaWVudCh7Z2V0U2hhcmVkQ29uZmlnLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkfSlcblxuXG5mdW5jdGlvbiBmaWx0ZXJWaWV3cyAodmlld3MpIHtcbiAgdmlld3MuZm9yRWFjaCh2aWV3ID0+IHtcbiAgICBpZiAodmlldy5lbWFpbCkgZGVsZXRlIHZpZXcuZW1haWxcbiAgICBpZiAodmlldy5fdmlld0hhc2gpIGRlbGV0ZSB2aWV3Ll92aWV3SGFzaFxuICB9KVxuICByZXR1cm4gdmlld3Ncbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlVmlld3MgKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGVudGl0eUNvbmZpZywgdmlld3MsIG1ldGEpIHtcbiAgaWYgKCF2aWV3cyB8fCAhdmlld3MubGVuZ3RoKSByZXR1cm4gZmFsc2VcbiAgdmlld3MgPSBmaWx0ZXJWaWV3cyh2aWV3cylcbiAgTE9HLmRlYnVnKGB1cGRhdGVWaWV3cygpIGZpbHRlcmVkIHZpZXdzYCwgdmlld3MpXG4gIG5ldENsaWVudFBhY2thZ2UuZW1pdCgndmlld3NVcGRhdGVkJywgdmlld3MsIG1ldGEpXG4gIHZhciBzdG9yYWdlUGFja2FnZSA9IGF3YWl0IGVudGl0eUNvbmZpZy5zdG9yYWdlKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBzdG9yYWdlQ29sbGVjdGlvbjogZW50aXR5Q29uZmlnLnN0b3JhZ2VDb2xsZWN0aW9uLCBzdG9yYWdlQ29uZmlnOiBlbnRpdHlDb25maWcuc3RvcmFnZUNvbmZpZ30pXG4gIGF3YWl0IHN0b3JhZ2VQYWNrYWdlLmluc2VydCh7b2Jqczogdmlld3N9KVxuICByZXR1cm4gdmlld3Ncbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzeW5jICB2aWV3c1VwZGF0ZWQgKHZpZXdzLCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBlbnRpdHlDb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZVZpZXcnKVxuICAgICAgTE9HLmRlYnVnKGBzdGFydCB2aWV3c1VwZGF0ZWQoKWAsIHt2aWV3cywgbWV0YX0pXG4gICAgICBhd2FpdCB1cGRhdGVWaWV3cyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBlbnRpdHlDb25maWcsIHZpZXdzLCBtZXRhKVxuICAgICAgcmV0dXJuIHtzdWNjZXNzOiB0cnVlfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMT0cud2FybigncHJvYmxlbXMgZHVyaW5nIHZpZXdzVXBkYXRlZCcsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyB2aWV3c1VwZGF0ZWQnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICByZWJ1aWxkVmlld3MgKHt9LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIExPRy5kZWJ1Zyhgc3RhcnQgcmVidWlsZFZpZXdzKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZClcbiAgICAgIHZhciBlbnRpdHlDb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZVZpZXcnKVxuICAgICAgdmFyIGxvb3AgPSB0cnVlXG4gICAgICB2YXIgcGFnZSA9IDBcbiAgICAgIHZhciB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgICB2YXIgcGFnZUl0ZW1zID0gMTBcbiAgICAgIHdoaWxlIChsb29wKSB7XG4gICAgICAgIHBhZ2UrK1xuICAgICAgICB2YXIgdmlld3MgPSBhd2FpdCBuZXRDbGllbnRQYWNrYWdlLnJwYygncmVzb3VyY2VzJywnbGlzdFJlc291cmNlcycsIHtwYWdlLCB0aW1lc3RhbXAsIHBhZ2VJdGVtc30sIG1ldGEpXG4gICAgICAgIExPRy5kZWJ1ZyhgcmVidWlsZFZpZXdzKCkgbGlzdFJlc291cmNlcyByZXNwb25zZWAsIHZpZXdzKVxuICAgICAgICBhd2FpdCB1cGRhdGVWaWV3cyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBlbnRpdHlDb25maWcsIHZpZXdzLCBtZXRhKVxuICAgICAgICBpZiAoIXZpZXdzIHx8ICF2aWV3cy5sZW5ndGggfHwgdmlld3MubGVuZ3RoIDwgcGFnZUl0ZW1zKWxvb3AgPSBmYWxzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHtzdWNjZXNzOiB0cnVlfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMT0cud2FybigncHJvYmxlbXMgZHVyaW5nIHJlYnVpbGRWaWV3cycsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyByZWJ1aWxkVmlld3MnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICBzeW5jVmlld3MgKHt9LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIExPRy5kZWJ1Zyhgc3RhcnQgc3luY1ZpZXdzKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZClcbiAgICAgIHZhciBlbnRpdHlDb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZVZpZXcnKVxuICAgICAgdmFyIHN0b3JhZ2VQYWNrYWdlID0gYXdhaXQgZW50aXR5Q29uZmlnLnN0b3JhZ2Uoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb2xsZWN0aW9uOiBlbnRpdHlDb25maWcuc3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWc6IGVudGl0eUNvbmZpZy5zdG9yYWdlQ29uZmlnfSlcbiAgICAgIHZhciBwYWdlID0gMFxuICAgICAgdmFyIHRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICAgIHZhciBwYWdlSXRlbXMgPSAxMFxuICAgICAgLy8gRklORCBWSUVXUyBJRFMgVE8gVVBEQVRFIEJZIENIRUNLU1VNXG4gICAgICB2YXIgdmlld3NUb1VwZGF0ZSA9IFtdXG4gICAgICB2YXIgbG9vcCA9IHRydWVcbiAgICAgIHdoaWxlIChsb29wKSB7XG4gICAgICAgIHBhZ2UrK1xuICAgICAgICB2YXIgdmlld3NDaGVja3N1bXMgPSBhd2FpdCBuZXRDbGllbnRQYWNrYWdlLnJwYygncmVzb3VyY2VzJywnbGlzdFJlc291cmNlcycsIHtwYWdlLCB0aW1lc3RhbXAsIHBhZ2VJdGVtcywgY2hlY2tzdW1Pbmx5OiB0cnVlfSwgbWV0YSlcbiAgICAgICAgTE9HLmRlYnVnKGBzeW5jVmlld3MoKSBsaXN0UmVzb3VyY2VzIGNoZWNrc3VtIHJlc3BvbnNlYCwge3BhZ2UsIHRpbWVzdGFtcCwgcGFnZUl0ZW1zLCB2aWV3c0NoZWNrc3Vtc30pXG4gICAgICAgIGlmICh2aWV3c0NoZWNrc3VtcyAmJiB2aWV3c0NoZWNrc3Vtcy5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgcXVlcnkgPSB7JG9yOiB2aWV3c0NoZWNrc3Vtc31cbiAgICAgICAgICB2YXIgdG9Ob3RVcGRhdGUgPSBhd2FpdCBzdG9yYWdlUGFja2FnZS5maW5kKHtxdWVyeSwgZmllbGRzOiB7IF9pZDogMSB9IH0pXG4gICAgICAgICAgdmFyIHZpZXdzQ2hlY2tzdW1zSWRzID0gdmlld3NDaGVja3N1bXMubWFwKHZpZXcgPT4gdmlldy5faWQpXG4gICAgICAgICAgdmFyIGlkc1RvTm90VXBkYXRlID0gdG9Ob3RVcGRhdGUubWFwKHZpZXcgPT4gdmlldy5faWQpXG4gICAgICAgICAgdmFyIGlkc1RvVXBkYXRlID0gdmlld3NDaGVja3N1bXNJZHMuZmlsdGVyKHZpZXdJZCA9PiBpZHNUb05vdFVwZGF0ZS5pbmRleE9mKHZpZXdJZCkgPT09IC0xKVxuICAgICAgICAgIHZpZXdzVG9VcGRhdGUgPSB2aWV3c1RvVXBkYXRlLmNvbmNhdChpZHNUb1VwZGF0ZSlcbiAgICAgICAgICBMT0cuZGVidWcoYHN5bmNWaWV3cygpIHN0b3JhZ2VQYWNrYWdlLmZpbmRgLCB7cXVlcnksIHRvTm90VXBkYXRlLCBpZHNUb1VwZGF0ZX0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2aWV3c0NoZWNrc3VtcyB8fCAhdmlld3NDaGVja3N1bXMubGVuZ3RoIHx8IHZpZXdzQ2hlY2tzdW1zLmxlbmd0aCA8IHBhZ2VJdGVtcylsb29wID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIC8vIFFVRVJZIFZJRVdTIEJZIElEIEFORCBVUERBVEVcbiAgICAgIExPRy5kZWJ1Zyhgc3luY1ZpZXdzKCkgdmlld3NUb1VwZGF0ZSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkLCB2aWV3c1RvVXBkYXRlKVxuICAgICAgaWYgKHZpZXdzVG9VcGRhdGUubGVuZ3RoKSB7XG4gICAgICAgIHZhciB2aWV3cyA9IGF3YWl0IG5ldENsaWVudFBhY2thZ2UucnBjKCdyZXNvdXJjZXMnLCdsaXN0UmVzb3VyY2VzJywge2lkSW46IHZpZXdzVG9VcGRhdGV9LCBtZXRhKVxuICAgICAgICAvL3ZhciB2aWV3cyA9IGF3YWl0IG5ldENsaWVudFBhY2thZ2UuZW1pdCgnbGlzdFJlc291cmNlcycsIHtpZEluOiB2aWV3c1RvVXBkYXRlfSwgbWV0YSlcbiAgICAgICAgTE9HLmRlYnVnKGBzeW5jVmlld3MoKSBsaXN0UmVzb3VyY2VzIHJlc3BvbnNlYCwgdmlld3MpXG4gICAgICAgIGF3YWl0IHVwZGF0ZVZpZXdzKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGVudGl0eUNvbmZpZywgdmlld3MsIG1ldGEpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7c3VjY2VzczogdHJ1ZX1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTE9HLndhcm4oJ3Byb2JsZW1zIGR1cmluZyBzeW5jVmlld3MnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgc3luY1ZpZXdzJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9XG59XG4iXX0=