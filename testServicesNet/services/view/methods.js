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

var getNetClient = function _callee() {
  var config;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'net'));

        case 2:
          config = _context.sent;
          return _context.abrupt('return', require('../../../net.client')({ getSharedConfig: getSharedConfig, serviceName: serviceName, serviceId: serviceId, getConsole: getConsole, config: config }));

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, null, undefined);
};
var netEmit = function _callee2(args) {
  var client;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getNetClient());

        case 2:
          client = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(client.emit(args));

        case 5:
          return _context2.abrupt('return', _context2.sent);

        case 6:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, undefined);
};
var netRpc = function _callee3(to, method, data, meta) {
  var client;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(getNetClient());

        case 2:
          client = _context3.sent;
          _context3.next = 5;
          return regeneratorRuntime.awrap(client.rpc({ to: to, method: method, data: data, meta: meta }));

        case 5:
          return _context3.abrupt('return', _context3.sent);

        case 6:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, undefined);
};

var entityConfig = require('./config.ResourceView');

var getStorage = function getStorage() {
  return require('../../../storage.inmemory')({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, storageConfig: require('./config').storage });
};
var storageFind = function storageFind(args) {
  return getStorage().find(Object.assign(args, { collectionName: entityConfig.collection }));
}; // ASYNC
var storageInsert = function storageInsert(objs) {
  return getStorage().insert({ collectionName: entityConfig.collection, objs: objs });
}; // ASYNC

var authorize = function authorize(data) {
  return netEmit('authorize', data, data.meta, true);
}; // ASYNC

function filterViews(views) {
  views.forEach(function (view) {
    if (view.email) delete view.email;
    if (view._viewHash) delete view._viewHash;
  });
  return views;
}

function updateViews(views, meta) {
  return regeneratorRuntime.async(function updateViews$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(!views || !views.length)) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt('return', false);

        case 2:
          views = filterViews(views);
          CONSOLE.debug('updateViews() filtered views', views);
          netEmit('viewsUpdated', views, meta);
          _context4.next = 7;
          return regeneratorRuntime.awrap(storageInsert(views));

        case 7:
          return _context4.abrupt('return', views);

        case 8:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this);
}

module.exports = {
  viewsUpdated: function viewsUpdated(views, meta) {
    return regeneratorRuntime.async(function viewsUpdated$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;

            CONSOLE.debug('start viewsUpdated()', { views: views, meta: meta });
            _context5.next = 4;
            return regeneratorRuntime.awrap(updateViews(views, meta));

          case 4:
            return _context5.abrupt('return', { success: true });

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5['catch'](0);

            CONSOLE.warn('problems during viewsUpdated', _context5.t0);
            return _context5.abrupt('return', { error: 'problems during viewsUpdated', originalError: _context5.t0 });

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, this, [[0, 7]]);
  },
  rebuildViews: function rebuildViews(data, meta) {
    var loop, page, timestamp, pageItems, views;
    return regeneratorRuntime.async(function rebuildViews$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;

            CONSOLE.debug('start rebuildViews() corrid:' + meta.corrid, { data: data, meta: meta });
            loop = true;
            page = 0;
            timestamp = Date.now();
            pageItems = 10;

          case 6:
            if (!loop) {
              _context6.next = 17;
              break;
            }

            page++;
            _context6.next = 10;
            return regeneratorRuntime.awrap(netRpc('resources', 'listResources', { page: page, timestamp: timestamp, pageItems: pageItems }, meta));

          case 10:
            views = _context6.sent;

            CONSOLE.debug('rebuildViews() listResources response', views);
            _context6.next = 14;
            return regeneratorRuntime.awrap(updateViews(views, meta));

          case 14:
            if (!views || !views.length || views.length < pageItems) loop = false;
            _context6.next = 6;
            break;

          case 17:
            return _context6.abrupt('return', { success: true });

          case 20:
            _context6.prev = 20;
            _context6.t0 = _context6['catch'](0);

            CONSOLE.warn('problems during rebuildViews', _context6.t0);
            return _context6.abrupt('return', { error: 'problems during rebuildViews', originalError: _context6.t0 });

          case 24:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, this, [[0, 20]]);
  },
  syncViews: function syncViews(data, meta) {
    var page, timestamp, pageItems, viewsToUpdate, loop, viewsChecksums, query, toNotUpdate, viewsChecksumsIds, idsToNotUpdate, idsToUpdate, views;
    return regeneratorRuntime.async(function syncViews$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;

            CONSOLE.debug('start syncViews() ', { data: data, meta: meta });
            page = 0;
            timestamp = Date.now();
            pageItems = 10;
            // FIND VIEWS IDS TO UPDATE BY CHECKSUM

            viewsToUpdate = [];
            loop = true;

          case 7:
            if (!loop) {
              _context7.next = 26;
              break;
            }

            page++;
            _context7.next = 11;
            return regeneratorRuntime.awrap(netRpc('resources', 'listResources', { page: page, timestamp: timestamp, pageItems: pageItems, checksumOnly: true }, meta));

          case 11:
            viewsChecksums = _context7.sent;

            CONSOLE.debug('syncViews() listResources checksum response', { page: page, timestamp: timestamp, pageItems: pageItems, viewsChecksums: viewsChecksums });

            if (!(viewsChecksums && viewsChecksums.length)) {
              _context7.next = 23;
              break;
            }

            query = { $or: viewsChecksums };
            _context7.next = 17;
            return regeneratorRuntime.awrap(storageFind({ query: query, fields: { _id: 1 } }));

          case 17:
            toNotUpdate = _context7.sent;
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
            CONSOLE.debug('syncViews() storageFind', { query: query, toNotUpdate: toNotUpdate, idsToUpdate: idsToUpdate });

          case 23:
            if (!viewsChecksums || !viewsChecksums.length || viewsChecksums.length < pageItems) loop = false;
            _context7.next = 7;
            break;

          case 26:
            // QUERY VIEWS BY ID AND UPDATE
            CONSOLE.debug('syncViews() viewsToUpdate corrid:' + meta.corrid, viewsToUpdate);

            if (!viewsToUpdate.length) {
              _context7.next = 34;
              break;
            }

            _context7.next = 30;
            return regeneratorRuntime.awrap(netRpc('resources', 'listResources', { idIn: viewsToUpdate }, meta));

          case 30:
            views = _context7.sent;

            // var views = await netEmit('listResources', {idIn: viewsToUpdate}, meta)
            CONSOLE.debug('syncViews() listResources response', views);
            _context7.next = 34;
            return regeneratorRuntime.awrap(updateViews(views, meta));

          case 34:
            return _context7.abrupt('return', { success: true });

          case 37:
            _context7.prev = 37;
            _context7.t0 = _context7['catch'](0);

            CONSOLE.warn('problems during syncViews', _context7.t0);
            return _context7.abrupt('return', { error: 'problems during syncViews', originalError: _context7.t0 });

          case 41:
          case 'end':
            return _context7.stop();
        }
      }
    }, null, this, [[0, 37]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIkNPTlNPTEUiLCJnZXROZXRDbGllbnQiLCJjb25maWciLCJuZXRFbWl0IiwiYXJncyIsImNsaWVudCIsImVtaXQiLCJuZXRScGMiLCJ0byIsIm1ldGhvZCIsImRhdGEiLCJtZXRhIiwicnBjIiwiZW50aXR5Q29uZmlnIiwiZ2V0U3RvcmFnZSIsInN0b3JhZ2VDb25maWciLCJzdG9yYWdlIiwic3RvcmFnZUZpbmQiLCJmaW5kIiwiT2JqZWN0IiwiYXNzaWduIiwiY29sbGVjdGlvbk5hbWUiLCJjb2xsZWN0aW9uIiwic3RvcmFnZUluc2VydCIsIm9ianMiLCJpbnNlcnQiLCJhdXRob3JpemUiLCJmaWx0ZXJWaWV3cyIsInZpZXdzIiwiZm9yRWFjaCIsInZpZXciLCJlbWFpbCIsIl92aWV3SGFzaCIsInVwZGF0ZVZpZXdzIiwibGVuZ3RoIiwiZGVidWciLCJtb2R1bGUiLCJleHBvcnRzIiwidmlld3NVcGRhdGVkIiwic3VjY2VzcyIsIndhcm4iLCJlcnJvciIsIm9yaWdpbmFsRXJyb3IiLCJyZWJ1aWxkVmlld3MiLCJjb3JyaWQiLCJsb29wIiwicGFnZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJwYWdlSXRlbXMiLCJzeW5jVmlld3MiLCJ2aWV3c1RvVXBkYXRlIiwiY2hlY2tzdW1Pbmx5Iiwidmlld3NDaGVja3N1bXMiLCJxdWVyeSIsIiRvciIsImZpZWxkcyIsIl9pZCIsInRvTm90VXBkYXRlIiwidmlld3NDaGVja3N1bXNJZHMiLCJtYXAiLCJpZHNUb05vdFVwZGF0ZSIsImlkc1RvVXBkYXRlIiwiZmlsdGVyIiwiaW5kZXhPZiIsInZpZXdJZCIsImNvbmNhdCIsImlkSW4iXSwibWFwcGlu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QTlDO0FBQUEsYUFBekIsQ0FqRFg7O0FBa0RQZCw0QkFBZ0JBLGNBQWNlLE1BQWQsQ0FBcUJKLFdBQXJCLENBQWhCO0FBQ0EvRCxvQkFBUW1DLEtBQVIsNEJBQXlDLEVBQUNvQixZQUFELEVBQVFJLHdCQUFSLEVBQXFCSSx3QkFBckIsRUFBekM7O0FBbkRPO0FBcURULGdCQUFJLENBQUNULGNBQUQsSUFBbUIsQ0FBQ0EsZUFBZXBCLE1BQW5DLElBQTZDb0IsZUFBZXBCLE1BQWYsR0FBd0JnQixTQUF6RSxFQUFtRkwsT0FBTyxLQUFQO0FBckQxRTtBQUFBOztBQUFBO0FBdURYO0FBQ0E3QyxvQkFBUW1DLEtBQVIsQ0FBYyxzQ0FBc0N4QixLQUFLaUMsTUFBekQsRUFBaUVRLGFBQWpFOztBQXhEVyxpQkF5RFBBLGNBQWNsQixNQXpEUDtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLDRDQTBEUzNCLE9BQU8sV0FBUCxFQUFvQixlQUFwQixFQUFxQyxFQUFDNkQsTUFBTWhCLGFBQVAsRUFBckMsRUFBNER6QyxJQUE1RCxDQTFEVDs7QUFBQTtBQTBETGlCLGlCQTFESzs7QUEyRFQ7QUFDQTVCLG9CQUFRbUMsS0FBUix1Q0FBb0RQLEtBQXBEO0FBNURTO0FBQUEsNENBNkRISyxZQUFZTCxLQUFaLEVBQW1CakIsSUFBbkIsQ0E3REc7O0FBQUE7QUFBQSw4Q0FnRUosRUFBQzRCLFNBQVMsSUFBVixFQWhFSTs7QUFBQTtBQUFBO0FBQUE7O0FBa0VYdkMsb0JBQVF3QyxJQUFSLENBQWEsMkJBQWI7QUFsRVcsOENBbUVKLEVBQUNDLE9BQU8sMkJBQVIsRUFBcUNDLDJCQUFyQyxFQW5FSTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6Im1ldGhvZHMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgamVzdXMgPSByZXF1aXJlKCcuLi8uLi8uLi9qZXN1cycpXG5jb25zdCBQQUNLQUdFID0gJ21ldGhvZHMnXG5jb25zdCBzZXJ2aWNlTmFtZSA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2VydmljZU5hbWVcbmNvbnN0IHNlcnZpY2VJZCA9IHJlcXVpcmUoJy4vc2VydmljZUlkLmpzb24nKVxuXG5jb25zdCBnZXRTaGFyZWRDb25maWcgPSBqZXN1cy5nZXRTaGFyZWRDb25maWcocmVxdWlyZSgnLi9jb25maWcnKS5zaGFyZWRTZXJ2aWNlc1BhdGgpXG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IGplc3VzLmdldENvbnNvbGUocmVxdWlyZSgnLi9jb25maWcnKS5jb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKVxuY29uc3QgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcblxuY29uc3QgZ2V0TmV0Q2xpZW50ID0gYXN5bmMgKCkgPT4ge1xuICB2YXIgY29uZmlnID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnbmV0JylcbiAgcmV0dXJuIHJlcXVpcmUoJy4uLy4uLy4uL25ldC5jbGllbnQnKSh7Z2V0U2hhcmVkQ29uZmlnLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBnZXRDb25zb2xlLCBjb25maWd9KVxufVxuY29uc3QgbmV0RW1pdCA9IGFzeW5jIChhcmdzKSA9PiB7XG4gIHZhciBjbGllbnQgPSBhd2FpdCBnZXROZXRDbGllbnQoKVxuICByZXR1cm4gYXdhaXQgY2xpZW50LmVtaXQoYXJncylcbn1cbmNvbnN0IG5ldFJwYyA9IGFzeW5jICh0byxtZXRob2QsZGF0YSxtZXRhKSA9PiB7XG4gIHZhciBjbGllbnQgPSBhd2FpdCBnZXROZXRDbGllbnQoKVxuICByZXR1cm4gYXdhaXQgY2xpZW50LnJwYyh7dG8sIG1ldGhvZCwgZGF0YSwgbWV0YX0pXG59XG5cbnZhciBlbnRpdHlDb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZVZpZXcnKVxuXG5jb25zdCBnZXRTdG9yYWdlID0gKCkgPT4gcmVxdWlyZSgnLi4vLi4vLi4vc3RvcmFnZS5pbm1lbW9yeScpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBzdG9yYWdlQ29uZmlnOiByZXF1aXJlKCcuL2NvbmZpZycpLnN0b3JhZ2V9KVxuY29uc3Qgc3RvcmFnZUZpbmQgPSAoYXJncykgPT4gZ2V0U3RvcmFnZSgpLmZpbmQoT2JqZWN0LmFzc2lnbihhcmdzLCB7Y29sbGVjdGlvbk5hbWU6IGVudGl0eUNvbmZpZy5jb2xsZWN0aW9ufSkpIC8vIEFTWU5DXG5jb25zdCBzdG9yYWdlSW5zZXJ0ID0gKG9ianMpID0+IGdldFN0b3JhZ2UoKS5pbnNlcnQoe2NvbGxlY3Rpb25OYW1lOiBlbnRpdHlDb25maWcuY29sbGVjdGlvbiwgb2Jqc30pIC8vIEFTWU5DXG5cbmNvbnN0IGF1dGhvcml6ZSA9IChkYXRhKSA9PiBuZXRFbWl0KCdhdXRob3JpemUnLCBkYXRhLCBkYXRhLm1ldGEsIHRydWUpLy8gQVNZTkNcblxuZnVuY3Rpb24gZmlsdGVyVmlld3MgKHZpZXdzKSB7XG4gIHZpZXdzLmZvckVhY2godmlldyA9PiB7XG4gICAgaWYgKHZpZXcuZW1haWwpIGRlbGV0ZSB2aWV3LmVtYWlsXG4gICAgaWYgKHZpZXcuX3ZpZXdIYXNoKSBkZWxldGUgdmlldy5fdmlld0hhc2hcbiAgfSlcbiAgcmV0dXJuIHZpZXdzXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVZpZXdzICh2aWV3cywgbWV0YSkge1xuICBpZiAoIXZpZXdzIHx8ICF2aWV3cy5sZW5ndGgpIHJldHVybiBmYWxzZVxuICB2aWV3cyA9IGZpbHRlclZpZXdzKHZpZXdzKVxuICBDT05TT0xFLmRlYnVnKGB1cGRhdGVWaWV3cygpIGZpbHRlcmVkIHZpZXdzYCwgdmlld3MpXG4gIG5ldEVtaXQoJ3ZpZXdzVXBkYXRlZCcsIHZpZXdzLCBtZXRhKVxuICBhd2FpdCBzdG9yYWdlSW5zZXJ0KHZpZXdzKVxuICByZXR1cm4gdmlld3Ncbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzeW5jICB2aWV3c1VwZGF0ZWQgKHZpZXdzLCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIENPTlNPTEUuZGVidWcoYHN0YXJ0IHZpZXdzVXBkYXRlZCgpYCwge3ZpZXdzLCBtZXRhfSlcbiAgICAgIGF3YWl0IHVwZGF0ZVZpZXdzKHZpZXdzLCBtZXRhKVxuICAgICAgcmV0dXJuIHtzdWNjZXNzOiB0cnVlfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDT05TT0xFLndhcm4oJ3Byb2JsZW1zIGR1cmluZyB2aWV3c1VwZGF0ZWQnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgdmlld3NVcGRhdGVkJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICBhc3luYyAgcmVidWlsZFZpZXdzIChkYXRhLCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIENPTlNPTEUuZGVidWcoYHN0YXJ0IHJlYnVpbGRWaWV3cygpIGNvcnJpZDpgICsgbWV0YS5jb3JyaWQse2RhdGEsIG1ldGF9KVxuICAgICAgdmFyIGxvb3AgPSB0cnVlXG4gICAgICB2YXIgcGFnZSA9IDBcbiAgICAgIHZhciB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgICB2YXIgcGFnZUl0ZW1zID0gMTBcbiAgICAgIHdoaWxlIChsb29wKSB7XG4gICAgICAgIHBhZ2UrK1xuICAgICAgICB2YXIgdmlld3MgPSBhd2FpdCBuZXRScGMoJ3Jlc291cmNlcycsICdsaXN0UmVzb3VyY2VzJywge3BhZ2UsIHRpbWVzdGFtcCwgcGFnZUl0ZW1zfSwgbWV0YSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZyhgcmVidWlsZFZpZXdzKCkgbGlzdFJlc291cmNlcyByZXNwb25zZWAsIHZpZXdzKVxuICAgICAgICBhd2FpdCB1cGRhdGVWaWV3cyh2aWV3cywgbWV0YSlcbiAgICAgICAgaWYgKCF2aWV3cyB8fCAhdmlld3MubGVuZ3RoIHx8IHZpZXdzLmxlbmd0aCA8IHBhZ2VJdGVtcylsb29wID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiB7c3VjY2VzczogdHJ1ZX1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgcmVidWlsZFZpZXdzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHJlYnVpbGRWaWV3cycsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHN5bmNWaWV3cyAoZGF0YSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCBzeW5jVmlld3MoKSBgLHtkYXRhLCBtZXRhfSlcbiAgICAgIHZhciBwYWdlID0gMFxuICAgICAgdmFyIHRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICAgIHZhciBwYWdlSXRlbXMgPSAxMFxuICAgICAgLy8gRklORCBWSUVXUyBJRFMgVE8gVVBEQVRFIEJZIENIRUNLU1VNXG4gICAgICB2YXIgdmlld3NUb1VwZGF0ZSA9IFtdXG4gICAgICB2YXIgbG9vcCA9IHRydWVcbiAgICAgIHdoaWxlIChsb29wKSB7XG4gICAgICAgIHBhZ2UrK1xuICAgICAgICB2YXIgdmlld3NDaGVja3N1bXMgPSBhd2FpdCBuZXRScGMoJ3Jlc291cmNlcycsICdsaXN0UmVzb3VyY2VzJywge3BhZ2UsIHRpbWVzdGFtcCwgcGFnZUl0ZW1zLCBjaGVja3N1bU9ubHk6IHRydWV9LCBtZXRhKVxuICAgICAgICBDT05TT0xFLmRlYnVnKGBzeW5jVmlld3MoKSBsaXN0UmVzb3VyY2VzIGNoZWNrc3VtIHJlc3BvbnNlYCwge3BhZ2UsIHRpbWVzdGFtcCwgcGFnZUl0ZW1zLCB2aWV3c0NoZWNrc3Vtc30pXG4gICAgICAgIGlmICh2aWV3c0NoZWNrc3VtcyAmJiB2aWV3c0NoZWNrc3Vtcy5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgcXVlcnkgPSB7JG9yOiB2aWV3c0NoZWNrc3Vtc31cbiAgICAgICAgICB2YXIgdG9Ob3RVcGRhdGUgPSBhd2FpdCBzdG9yYWdlRmluZCh7IHF1ZXJ5LCBmaWVsZHM6IHsgX2lkOiAxIH0gfSlcbiAgICAgICAgICB2YXIgdmlld3NDaGVja3N1bXNJZHMgPSB2aWV3c0NoZWNrc3Vtcy5tYXAodmlldyA9PiB2aWV3Ll9pZClcbiAgICAgICAgICB2YXIgaWRzVG9Ob3RVcGRhdGUgPSB0b05vdFVwZGF0ZS5tYXAodmlldyA9PiB2aWV3Ll9pZClcbiAgICAgICAgICB2YXIgaWRzVG9VcGRhdGUgPSB2aWV3c0NoZWNrc3Vtc0lkcy5maWx0ZXIodmlld0lkID0+IGlkc1RvTm90VXBkYXRlLmluZGV4T2Yodmlld0lkKSA9PT0gLTEpXG4gICAgICAgICAgdmlld3NUb1VwZGF0ZSA9IHZpZXdzVG9VcGRhdGUuY29uY2F0KGlkc1RvVXBkYXRlKVxuICAgICAgICAgIENPTlNPTEUuZGVidWcoYHN5bmNWaWV3cygpIHN0b3JhZ2VGaW5kYCwge3F1ZXJ5LCB0b05vdFVwZGF0ZSwgaWRzVG9VcGRhdGV9KVxuICAgICAgICB9XG4gICAgICAgIGlmICghdmlld3NDaGVja3N1bXMgfHwgIXZpZXdzQ2hlY2tzdW1zLmxlbmd0aCB8fCB2aWV3c0NoZWNrc3Vtcy5sZW5ndGggPCBwYWdlSXRlbXMpbG9vcCA9IGZhbHNlXG4gICAgICB9XG4gICAgICAvLyBRVUVSWSBWSUVXUyBCWSBJRCBBTkQgVVBEQVRFXG4gICAgICBDT05TT0xFLmRlYnVnKGBzeW5jVmlld3MoKSB2aWV3c1RvVXBkYXRlIGNvcnJpZDpgICsgbWV0YS5jb3JyaWQsIHZpZXdzVG9VcGRhdGUpXG4gICAgICBpZiAodmlld3NUb1VwZGF0ZS5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHZpZXdzID0gYXdhaXQgbmV0UnBjKCdyZXNvdXJjZXMnLCAnbGlzdFJlc291cmNlcycsIHtpZEluOiB2aWV3c1RvVXBkYXRlfSwgbWV0YSlcbiAgICAgICAgLy8gdmFyIHZpZXdzID0gYXdhaXQgbmV0RW1pdCgnbGlzdFJlc291cmNlcycsIHtpZEluOiB2aWV3c1RvVXBkYXRlfSwgbWV0YSlcbiAgICAgICAgQ09OU09MRS5kZWJ1Zyhgc3luY1ZpZXdzKCkgbGlzdFJlc291cmNlcyByZXNwb25zZWAsIHZpZXdzKVxuICAgICAgICBhd2FpdCB1cGRhdGVWaWV3cyh2aWV3cywgbWV0YSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtzdWNjZXNzOiB0cnVlfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDT05TT0xFLndhcm4oJ3Byb2JsZW1zIGR1cmluZyBzeW5jVmlld3MnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgc3luY1ZpZXdzJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9XG59XG4iXX0=