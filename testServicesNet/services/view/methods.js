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

var msNet = require('../../../net.client')({ getSharedConfig: getSharedConfig, serviceName: serviceName, serviceId: serviceId, getConsole: getConsole });
// const msNet = {emit: () => true, rpc: () => true}

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
  return msNet.emit('authorize', data, data.meta, true);
}; // ASYNC

function filterViews(views) {
  views.forEach(function (view) {
    if (view.email) delete view.email;
    if (view._viewHash) delete view._viewHash;
  });
  return views;
}

function updateViews(views, meta) {
  return regeneratorRuntime.async(function updateViews$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(!views || !views.length)) {
            _context.next = 2;
            break;
          }

          return _context.abrupt('return', false);

        case 2:
          views = filterViews(views);
          CONSOLE.debug('updateViews() filtered views', views);
          msNet.emit('viewsUpdated', views, meta);
          _context.next = 7;
          return regeneratorRuntime.awrap(storageInsert(views));

        case 7:
          return _context.abrupt('return', views);

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

module.exports = {
  viewsUpdated: function viewsUpdated(views, meta) {
    return regeneratorRuntime.async(function viewsUpdated$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            CONSOLE.debug('start viewsUpdated()', { views: views, meta: meta });
            _context2.next = 4;
            return regeneratorRuntime.awrap(updateViews(views, meta));

          case 4:
            return _context2.abrupt('return', { success: true });

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2['catch'](0);

            CONSOLE.warn('problems during viewsUpdated', _context2.t0);
            return _context2.abrupt('return', { error: 'problems during viewsUpdated', originalError: _context2.t0 });

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[0, 7]]);
  },
  rebuildViews: function rebuildViews(data, meta) {
    var loop, page, timestamp, pageItems, views;
    return regeneratorRuntime.async(function rebuildViews$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            CONSOLE.debug('start rebuildViews() requestId:' + meta.requestId);
            loop = true;
            page = 0;
            timestamp = Date.now();
            pageItems = 10;

          case 6:
            if (!loop) {
              _context3.next = 17;
              break;
            }

            page++;
            _context3.next = 10;
            return regeneratorRuntime.awrap(msNet.rpc('resources', 'listResources', { page: page, timestamp: timestamp, pageItems: pageItems }, meta));

          case 10:
            views = _context3.sent;

            CONSOLE.debug('rebuildViews() listResources response', views);
            _context3.next = 14;
            return regeneratorRuntime.awrap(updateViews(views, meta));

          case 14:
            if (!views || !views.length || views.length < pageItems) loop = false;
            _context3.next = 6;
            break;

          case 17:
            return _context3.abrupt('return', { success: true });

          case 20:
            _context3.prev = 20;
            _context3.t0 = _context3['catch'](0);

            CONSOLE.warn('problems during rebuildViews', _context3.t0);
            return _context3.abrupt('return', { error: 'problems during rebuildViews', originalError: _context3.t0 });

          case 24:
          case 'end':
            return _context3.stop();
        }
      }
    }, null, this, [[0, 20]]);
  },
  syncViews: function syncViews(data, meta) {
    var page, timestamp, pageItems, viewsToUpdate, loop, viewsChecksums, query, toNotUpdate, viewsChecksumsIds, idsToNotUpdate, idsToUpdate, views;
    return regeneratorRuntime.async(function syncViews$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            CONSOLE.debug('start syncViews() requestId:' + meta.requestId);
            page = 0;
            timestamp = Date.now();
            pageItems = 10;
            // FIND VIEWS IDS TO UPDATE BY CHECKSUM

            viewsToUpdate = [];
            loop = true;

          case 7:
            if (!loop) {
              _context4.next = 26;
              break;
            }

            page++;
            _context4.next = 11;
            return regeneratorRuntime.awrap(msNet.rpc('resources', 'listResources', { page: page, timestamp: timestamp, pageItems: pageItems, checksumOnly: true }, meta));

          case 11:
            viewsChecksums = _context4.sent;

            CONSOLE.debug('syncViews() listResources checksum response', { page: page, timestamp: timestamp, pageItems: pageItems, viewsChecksums: viewsChecksums });

            if (!(viewsChecksums && viewsChecksums.length)) {
              _context4.next = 23;
              break;
            }

            query = { $or: viewsChecksums };
            _context4.next = 17;
            return regeneratorRuntime.awrap(storageFind({ query: query, fields: { _id: 1 } }));

          case 17:
            toNotUpdate = _context4.sent;
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
            _context4.next = 7;
            break;

          case 26:
            // QUERY VIEWS BY ID AND UPDATE
            CONSOLE.debug('syncViews() viewsToUpdate requestId:' + meta.requestId, viewsToUpdate);

            if (!viewsToUpdate.length) {
              _context4.next = 34;
              break;
            }

            _context4.next = 30;
            return regeneratorRuntime.awrap(msNet.rpc('resources', 'listResources', { idIn: viewsToUpdate }, meta));

          case 30:
            views = _context4.sent;

            // var views = await msNet.emit('listResources', {idIn: viewsToUpdate}, meta)
            CONSOLE.debug('syncViews() listResources response', views);
            _context4.next = 34;
            return regeneratorRuntime.awrap(updateViews(views, meta));

          case 34:
            return _context4.abrupt('return', { success: true });

          case 37:
            _context4.prev = 37;
            _context4.t0 = _context4['catch'](0);

            CONSOLE.warn('problems during syncViews', _context4.t0);
            return _context4.abrupt('return', { error: 'problems during syncViews', originalError: _context4.t0 });

          case 41:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, this, [[0, 37]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIkNPTlNPTEUiLCJtc05ldCIsImVudGl0eUNvbmZpZyIsImdldFN0b3JhZ2UiLCJzdG9yYWdlQ29uZmlnIiwic3RvcmFnZSIsInN0b3JhZ2VGaW5kIiwiYXJncyIsImZpbmQiLCJPYmplY3QiLCJhc3NpZ24iLCJjb2xsZWN0aW9uTmFtZSIsImNvbGxlY3Rpb24iLCJzdG9yYWdlSW5zZXJ0Iiwib2JqcyIsImluc2VydCIsImF1dGhvcml6ZSIsImRhdGEiLCJlbWl0IiwibWV0YSIsImZpbHRlclZpZXdzIiwidmlld3MiLCJmb3JFYWNoIiwidmlldyIsImVtYWlsIiwiX3ZpZXdIYXNoIiwidXBkYXRlVmlld3MiLCJsZW5ndGgiLCJkZWJ1ZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJ2aWV3c1VwZGF0ZWQiLCJzdWNjZXNzIiwid2FybiIsImVycm9yIiwib3JpZ2luYWxFcnJvciIsInJlYnVpbGRWaWV3cyIsInJlcXVlc3RJZCIsImxvb3AiLCJwYWdlIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInBhZ2VJdGVtcyIsInJwYyIsInN5bmNWaWV3cyIsInZpZXdzVG9VcGRhdGUiLCJjaGVja3N1bU9ubHkiLCJ2aWV3c0NoZWNrc3VtcyIsInF1ZXJ5IiwiJG9yIiwiZmllbGRzIiwiX2lkIiwidG9Ob3RVcGRhdGUiLCJ2aWV3c0NoZWNrc3Vtc0lkcyIsIm1hcCIsImlkc1RvTm90VXBkYXRlIiwiaWRzVG9VcGRhdGUiLCJmaWx0ZXIiLCJpbmRleE9mIiwidmlld0lkIiwiY29uY2F0IiwiaWRJbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLGdCQUFSLENBQWQ7QUFDQSxJQUFNQyxVQUFV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QUFDQyxPQUFPLDJCQUFSLEVBQXFDQywyQkFBckMsRUFuRUk7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJtZXRob2RzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGplc3VzID0gcmVxdWlyZSgnLi4vLi4vLi4vamVzdXMnKVxuY29uc3QgUEFDS0FHRSA9ICdtZXRob2RzJ1xuY29uc3Qgc2VydmljZU5hbWUgPSByZXF1aXJlKCcuL2NvbmZpZycpLnNlcnZpY2VOYW1lXG5jb25zdCBzZXJ2aWNlSWQgPSByZXF1aXJlKCcuL3NlcnZpY2VJZC5qc29uJylcblxuY29uc3QgZ2V0U2hhcmVkQ29uZmlnID0gamVzdXMuZ2V0U2hhcmVkQ29uZmlnKHJlcXVpcmUoJy4vY29uZmlnJykuc2hhcmVkU2VydmljZXNQYXRoKVxuY29uc3QgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiBqZXN1cy5nZXRDb25zb2xlKHJlcXVpcmUoJy4vY29uZmlnJykuY29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbmNvbnN0IENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG5cbmNvbnN0IG1zTmV0ID0gcmVxdWlyZSgnLi4vLi4vLi4vbmV0LmNsaWVudCcpKHtnZXRTaGFyZWRDb25maWcsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGdldENvbnNvbGV9KVxuLy8gY29uc3QgbXNOZXQgPSB7ZW1pdDogKCkgPT4gdHJ1ZSwgcnBjOiAoKSA9PiB0cnVlfVxuXG52YXIgZW50aXR5Q29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcuUmVzb3VyY2VWaWV3JylcblxuY29uc3QgZ2V0U3RvcmFnZSA9ICgpID0+IHJlcXVpcmUoJy4uLy4uLy4uL3N0b3JhZ2UuaW5tZW1vcnknKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgc3RvcmFnZUNvbmZpZzogcmVxdWlyZSgnLi9jb25maWcnKS5zdG9yYWdlfSlcbmNvbnN0IHN0b3JhZ2VGaW5kID0gKGFyZ3MpID0+IGdldFN0b3JhZ2UoKS5maW5kKE9iamVjdC5hc3NpZ24oYXJncywge2NvbGxlY3Rpb25OYW1lOiBlbnRpdHlDb25maWcuY29sbGVjdGlvbn0pKSAvLyBBU1lOQ1xuY29uc3Qgc3RvcmFnZUluc2VydCA9IChvYmpzKSA9PiBnZXRTdG9yYWdlKCkuaW5zZXJ0KHtjb2xsZWN0aW9uTmFtZTogZW50aXR5Q29uZmlnLmNvbGxlY3Rpb24sIG9ianN9KSAvLyBBU1lOQ1xuXG5jb25zdCBhdXRob3JpemUgPSAoZGF0YSkgPT4gbXNOZXQuZW1pdCgnYXV0aG9yaXplJywgZGF0YSwgZGF0YS5tZXRhLCB0cnVlKS8vIEFTWU5DXG5cbmZ1bmN0aW9uIGZpbHRlclZpZXdzICh2aWV3cykge1xuICB2aWV3cy5mb3JFYWNoKHZpZXcgPT4ge1xuICAgIGlmICh2aWV3LmVtYWlsKSBkZWxldGUgdmlldy5lbWFpbFxuICAgIGlmICh2aWV3Ll92aWV3SGFzaCkgZGVsZXRlIHZpZXcuX3ZpZXdIYXNoXG4gIH0pXG4gIHJldHVybiB2aWV3c1xufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVWaWV3cyAodmlld3MsIG1ldGEpIHtcbiAgaWYgKCF2aWV3cyB8fCAhdmlld3MubGVuZ3RoKSByZXR1cm4gZmFsc2VcbiAgdmlld3MgPSBmaWx0ZXJWaWV3cyh2aWV3cylcbiAgQ09OU09MRS5kZWJ1ZyhgdXBkYXRlVmlld3MoKSBmaWx0ZXJlZCB2aWV3c2AsIHZpZXdzKVxuICBtc05ldC5lbWl0KCd2aWV3c1VwZGF0ZWQnLCB2aWV3cywgbWV0YSlcbiAgYXdhaXQgc3RvcmFnZUluc2VydCh2aWV3cylcbiAgcmV0dXJuIHZpZXdzXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhc3luYyAgdmlld3NVcGRhdGVkICh2aWV3cywgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCB2aWV3c1VwZGF0ZWQoKWAsIHt2aWV3cywgbWV0YX0pXG4gICAgICBhd2FpdCB1cGRhdGVWaWV3cyh2aWV3cywgbWV0YSlcbiAgICAgIHJldHVybiB7c3VjY2VzczogdHJ1ZX1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgdmlld3NVcGRhdGVkJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHZpZXdzVXBkYXRlZCcsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHJlYnVpbGRWaWV3cyAoZGF0YSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCByZWJ1aWxkVmlld3MoKSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkKVxuICAgICAgdmFyIGxvb3AgPSB0cnVlXG4gICAgICB2YXIgcGFnZSA9IDBcbiAgICAgIHZhciB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgICB2YXIgcGFnZUl0ZW1zID0gMTBcbiAgICAgIHdoaWxlIChsb29wKSB7XG4gICAgICAgIHBhZ2UrK1xuICAgICAgICB2YXIgdmlld3MgPSBhd2FpdCBtc05ldC5ycGMoJ3Jlc291cmNlcycsICdsaXN0UmVzb3VyY2VzJywge3BhZ2UsIHRpbWVzdGFtcCwgcGFnZUl0ZW1zfSwgbWV0YSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZyhgcmVidWlsZFZpZXdzKCkgbGlzdFJlc291cmNlcyByZXNwb25zZWAsIHZpZXdzKVxuICAgICAgICBhd2FpdCB1cGRhdGVWaWV3cyh2aWV3cywgbWV0YSlcbiAgICAgICAgaWYgKCF2aWV3cyB8fCAhdmlld3MubGVuZ3RoIHx8IHZpZXdzLmxlbmd0aCA8IHBhZ2VJdGVtcylsb29wID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiB7c3VjY2VzczogdHJ1ZX1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgcmVidWlsZFZpZXdzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHJlYnVpbGRWaWV3cycsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHN5bmNWaWV3cyAoZGF0YSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCBzeW5jVmlld3MoKSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkKVxuICAgICAgdmFyIHBhZ2UgPSAwXG4gICAgICB2YXIgdGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgICAgdmFyIHBhZ2VJdGVtcyA9IDEwXG4gICAgICAvLyBGSU5EIFZJRVdTIElEUyBUTyBVUERBVEUgQlkgQ0hFQ0tTVU1cbiAgICAgIHZhciB2aWV3c1RvVXBkYXRlID0gW11cbiAgICAgIHZhciBsb29wID0gdHJ1ZVxuICAgICAgd2hpbGUgKGxvb3ApIHtcbiAgICAgICAgcGFnZSsrXG4gICAgICAgIHZhciB2aWV3c0NoZWNrc3VtcyA9IGF3YWl0IG1zTmV0LnJwYygncmVzb3VyY2VzJywgJ2xpc3RSZXNvdXJjZXMnLCB7cGFnZSwgdGltZXN0YW1wLCBwYWdlSXRlbXMsIGNoZWNrc3VtT25seTogdHJ1ZX0sIG1ldGEpXG4gICAgICAgIENPTlNPTEUuZGVidWcoYHN5bmNWaWV3cygpIGxpc3RSZXNvdXJjZXMgY2hlY2tzdW0gcmVzcG9uc2VgLCB7cGFnZSwgdGltZXN0YW1wLCBwYWdlSXRlbXMsIHZpZXdzQ2hlY2tzdW1zfSlcbiAgICAgICAgaWYgKHZpZXdzQ2hlY2tzdW1zICYmIHZpZXdzQ2hlY2tzdW1zLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBxdWVyeSA9IHskb3I6IHZpZXdzQ2hlY2tzdW1zfVxuICAgICAgICAgIHZhciB0b05vdFVwZGF0ZSA9IGF3YWl0IHN0b3JhZ2VGaW5kKHsgcXVlcnksIGZpZWxkczogeyBfaWQ6IDEgfSB9KVxuICAgICAgICAgIHZhciB2aWV3c0NoZWNrc3Vtc0lkcyA9IHZpZXdzQ2hlY2tzdW1zLm1hcCh2aWV3ID0+IHZpZXcuX2lkKVxuICAgICAgICAgIHZhciBpZHNUb05vdFVwZGF0ZSA9IHRvTm90VXBkYXRlLm1hcCh2aWV3ID0+IHZpZXcuX2lkKVxuICAgICAgICAgIHZhciBpZHNUb1VwZGF0ZSA9IHZpZXdzQ2hlY2tzdW1zSWRzLmZpbHRlcih2aWV3SWQgPT4gaWRzVG9Ob3RVcGRhdGUuaW5kZXhPZih2aWV3SWQpID09PSAtMSlcbiAgICAgICAgICB2aWV3c1RvVXBkYXRlID0gdmlld3NUb1VwZGF0ZS5jb25jYXQoaWRzVG9VcGRhdGUpXG4gICAgICAgICAgQ09OU09MRS5kZWJ1Zyhgc3luY1ZpZXdzKCkgc3RvcmFnZUZpbmRgLCB7cXVlcnksIHRvTm90VXBkYXRlLCBpZHNUb1VwZGF0ZX0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2aWV3c0NoZWNrc3VtcyB8fCAhdmlld3NDaGVja3N1bXMubGVuZ3RoIHx8IHZpZXdzQ2hlY2tzdW1zLmxlbmd0aCA8IHBhZ2VJdGVtcylsb29wID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIC8vIFFVRVJZIFZJRVdTIEJZIElEIEFORCBVUERBVEVcbiAgICAgIENPTlNPTEUuZGVidWcoYHN5bmNWaWV3cygpIHZpZXdzVG9VcGRhdGUgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwgdmlld3NUb1VwZGF0ZSlcbiAgICAgIGlmICh2aWV3c1RvVXBkYXRlLmxlbmd0aCkge1xuICAgICAgICB2YXIgdmlld3MgPSBhd2FpdCBtc05ldC5ycGMoJ3Jlc291cmNlcycsICdsaXN0UmVzb3VyY2VzJywge2lkSW46IHZpZXdzVG9VcGRhdGV9LCBtZXRhKVxuICAgICAgICAvLyB2YXIgdmlld3MgPSBhd2FpdCBtc05ldC5lbWl0KCdsaXN0UmVzb3VyY2VzJywge2lkSW46IHZpZXdzVG9VcGRhdGV9LCBtZXRhKVxuICAgICAgICBDT05TT0xFLmRlYnVnKGBzeW5jVmlld3MoKSBsaXN0UmVzb3VyY2VzIHJlc3BvbnNlYCwgdmlld3MpXG4gICAgICAgIGF3YWl0IHVwZGF0ZVZpZXdzKHZpZXdzLCBtZXRhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge3N1Y2Nlc3M6IHRydWV9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIHN5bmNWaWV3cycsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBzeW5jVmlld3MnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH1cbn1cbiJdfQ==