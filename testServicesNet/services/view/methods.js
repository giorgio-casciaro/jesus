'use strict';

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var jesus = require('../../../jesus');
var PACKAGE = 'methods';
var serviceName = require('./config').serviceName;
var serviceId = require('./serviceId.json');

var getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath);
var getConsole = function getConsole(serviceName, serviceId, pack) {
  return jesus.getConsole(require('./config').console, serviceName, serviceId, pack);
};
var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);

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
          CONSOLE.debug('updateViews() filtered views', views);
          msNet.emit('viewsUpdated', views, meta);
          _context3.next = 7;
          return regeneratorRuntime.awrap(storageInsert(views));

        case 7:
          return _context3.abrupt('return', views);

        case 8:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
}

module.exports = {
  viewsUpdated: function viewsUpdated(views, meta) {
    return regeneratorRuntime.async(function viewsUpdated$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            CONSOLE.debug('start viewsUpdated()', { views: views, meta: meta });
            _context4.next = 4;
            return regeneratorRuntime.awrap(updateViews(views, meta));

          case 4:
            return _context4.abrupt('return', { success: true });

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4['catch'](0);

            CONSOLE.warn('problems during viewsUpdated', _context4.t0);
            return _context4.abrupt('return', { error: 'problems during viewsUpdated', originalError: _context4.t0 });

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, this, [[0, 7]]);
  },
  rebuildViews: function rebuildViews(_ref, meta) {
    var entityConfig, loop, page, timestamp, pageItems, views;
    return regeneratorRuntime.async(function rebuildViews$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _objectDestructuringEmpty(_ref);

            _context5.prev = 1;

            CONSOLE.debug('start rebuildViews() requestId:' + meta.requestId);
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
            return regeneratorRuntime.awrap(msNet.rpc('resources', 'listResources', { page: page, timestamp: timestamp, pageItems: pageItems }, meta));

          case 12:
            views = _context5.sent;

            CONSOLE.debug('rebuildViews() listResources response', views);
            _context5.next = 16;
            return regeneratorRuntime.awrap(updateViews(views, meta));

          case 16:
            if (!views || !views.length || views.length < pageItems) loop = false;
            _context5.next = 8;
            break;

          case 19:
            return _context5.abrupt('return', { success: true });

          case 22:
            _context5.prev = 22;
            _context5.t0 = _context5['catch'](1);

            CONSOLE.warn('problems during rebuildViews', _context5.t0);
            return _context5.abrupt('return', { error: 'problems during rebuildViews', originalError: _context5.t0 });

          case 26:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, this, [[1, 22]]);
  },
  syncViews: function syncViews(_ref2, meta) {
    var entityConfig, page, timestamp, pageItems, viewsToUpdate, loop, viewsChecksums, query, toNotUpdate, viewsChecksumsIds, idsToNotUpdate, idsToUpdate, views;
    return regeneratorRuntime.async(function syncViews$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _objectDestructuringEmpty(_ref2);

            _context6.prev = 1;

            CONSOLE.debug('start syncViews() requestId:' + meta.requestId);
            entityConfig = require('./config.ResourceView');
            page = 0;
            timestamp = Date.now();
            pageItems = 10;
            // FIND VIEWS IDS TO UPDATE BY CHECKSUM

            viewsToUpdate = [];
            loop = true;

          case 9:
            if (!loop) {
              _context6.next = 28;
              break;
            }

            page++;
            _context6.next = 13;
            return regeneratorRuntime.awrap(msNet.rpc('resources', 'listResources', { page: page, timestamp: timestamp, pageItems: pageItems, checksumOnly: true }, meta));

          case 13:
            viewsChecksums = _context6.sent;

            CONSOLE.debug('syncViews() listResources checksum response', { page: page, timestamp: timestamp, pageItems: pageItems, viewsChecksums: viewsChecksums });

            if (!(viewsChecksums && viewsChecksums.length)) {
              _context6.next = 25;
              break;
            }

            query = { $or: viewsChecksums };
            _context6.next = 19;
            return regeneratorRuntime.awrap(storageFind({ query: query, fields: { _id: 1 } }));

          case 19:
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
            CONSOLE.debug('syncViews() storageFind', { query: query, toNotUpdate: toNotUpdate, idsToUpdate: idsToUpdate });

          case 25:
            if (!viewsChecksums || !viewsChecksums.length || viewsChecksums.length < pageItems) loop = false;
            _context6.next = 9;
            break;

          case 28:
            // QUERY VIEWS BY ID AND UPDATE
            CONSOLE.debug('syncViews() viewsToUpdate requestId:' + meta.requestId, viewsToUpdate);

            if (!viewsToUpdate.length) {
              _context6.next = 36;
              break;
            }

            _context6.next = 32;
            return regeneratorRuntime.awrap(msNet.rpc('resources', 'listResources', { idIn: viewsToUpdate }, meta));

          case 32:
            views = _context6.sent;

            // var views = await msNet.emit('listResources', {idIn: viewsToUpdate}, meta)
            CONSOLE.debug('syncViews() listResources response', views);
            _context6.next = 36;
            return regeneratorRuntime.awrap(updateViews(views, meta));

          case 36:
            return _context6.abrupt('return', { success: true });

          case 39:
            _context6.prev = 39;
            _context6.t0 = _context6['catch'](1);

            CONSOLE.warn('problems during syncViews', _context6.t0);
            return _context6.abrupt('return', { error: 'problems during syncViews', originalError: _context6.t0 });

          case 43:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, this, [[1, 39]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsIlBBQ0tBR0UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIkNPTlNPTEUiLCJ2YWxpZGF0ZU1ldGhvZFJlcXVlc3QiLCJtZXRob2ROYW1lIiwiZGF0YSIsInZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyIsInZhbGlkYXRlTWV0aG9kUmVzcG9uc2UiLCJtc05ldCIsImVudGl0eUNvbmZpZyIsImdldFN0b3JhZ2UiLCJzdG9yYWdlQ29uZmlnIiwic3RvcmFnZSIsInN0b3JhZ2VGaW5kIiwiYXJncyIsImZpbmQiLCJPYmplY3QiLCJhc3NpZ24iLCJjb2xsZWN0aW9uTmFtZSIsImNvbGxlY3Rpb24iLCJzdG9yYWdlSW5zZXJ0Iiwib2JqcyIsImluc2VydCIsImF1dGhvcml6ZSIsImVtaXQiLCJtZXRhIiwiZmlsdGVyVmlld3MiLCJ2aWV3cyIsImZvckVhY2giLCJ2aWV3IiwiZW1haWwiLCJfdmlld0hhc2giLCJ1cGRhdGVWaWV3cyIsImxlbmd0aCIsImRlYnVnIiwibW9kdWxlIiwiZXhwb3J0cyIsInZpZXdzVXBkYXRlZCIsInN1Y2Nlc3MiLCJ3YXJuIiwiZXJyb3IiLCJvcmlnaW5hbEVycm9yIiwicmVidWlsZFZpZXdzIiwicmVxdWVzdElkIiwibG9vcCIsInBhZ2UiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwicGFnZUl0ZW1zIiwicnBjIiwic3luY1ZpZXdzIiwidmlld3NUb1VwZGF0ZSIsImNoZWNrc3VtT25seSIsInZpZXdzQ2hlY2tzdW1zIiwicXVlcnkiLCIkb3IiLCJmaWVsZHMiLCJfaWQiLCJ0b05vdFVwZGF0ZSIsInZpZXdzQ2hlY2tzdW1zSWRzIiwibWFwIiwiaWRzVG9Ob3RVcGRhdGUiLCJpZHNUb1VwZGF0ZSIsImZpbHRlciIsImluZGV4T2Yi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cmUoJy4uLy4uLy4uL2plc3VzJylcbmNvbnN0IFBBQ0tBR0UgPSAnbWV0aG9kcydcbmNvbnN0IHNlcnZpY2VOYW1lID0gcmVxdWlyZSgnLi9jb25maWcnKS5zZXJ2aWNlTmFtZVxuY29uc3Qgc2VydmljZUlkID0gcmVxdWlyZSgnLi9zZXJ2aWNlSWQuanNvbicpXG5cbmNvbnN0IGdldFNoYXJlZENvbmZpZyA9IGplc3VzLmdldFNoYXJlZENvbmZpZyhyZXF1aXJlKCcuL2NvbmZpZycpLnNoYXJlZFNlcnZpY2VzUGF0aClcbmNvbnN0IGdldENvbnNvbGUgPSAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykgPT4gamVzdXMuZ2V0Q29uc29sZShyZXF1aXJlKCcuL2NvbmZpZycpLmNvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spXG5jb25zdCBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG5jb25zdCB2YWxpZGF0ZU1ldGhvZFJlcXVlc3QgPSBhc3luYyAobWV0aG9kTmFtZSwgZGF0YSkgPT4gamVzdXMudmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ21ldGhvZHMnKSwgbWV0aG9kTmFtZSwgZGF0YSwgJ3JlcXVlc3RTY2hlbWEnKVxuY29uc3QgdmFsaWRhdGVNZXRob2RSZXNwb25zZSA9IGFzeW5jIChtZXRob2ROYW1lLCBkYXRhKSA9PiBqZXN1cy52YWxpZGF0ZU1ldGhvZEZyb21Db25maWcoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnbWV0aG9kcycpLCBtZXRob2ROYW1lLCBkYXRhLCAncmVzcG9uc2VTY2hlbWEnKVxuY29uc3QgbXNOZXQgPSByZXF1aXJlKCcuLi8uLi8uLi9uZXQuY2xpZW50Jykoe2dldFNoYXJlZENvbmZpZywgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZ2V0Q29uc29sZX0pXG4vLyBjb25zdCBtc05ldCA9IHtlbWl0OiAoKSA9PiB0cnVlLCBycGM6ICgpID0+IHRydWV9XG5cbnZhciBlbnRpdHlDb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZVZpZXcnKVxuXG5jb25zdCBnZXRTdG9yYWdlID0gKCkgPT4gcmVxdWlyZSgnLi4vLi4vLi4vc3RvcmFnZS5pbm1lbW9yeScpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBzdG9yYWdlQ29uZmlnOiByZXF1aXJlKCcuL2NvbmZpZycpLnN0b3JhZ2V9KVxuY29uc3Qgc3RvcmFnZUZpbmQgPSAoYXJncykgPT4gZ2V0U3RvcmFnZSgpLmZpbmQoT2JqZWN0LmFzc2lnbihhcmdzLCB7Y29sbGVjdGlvbk5hbWU6IGVudGl0eUNvbmZpZy5jb2xsZWN0aW9ufSkpIC8vIEFTWU5DXG5jb25zdCBzdG9yYWdlSW5zZXJ0ID0gKG9ianMpID0+IGdldFN0b3JhZ2UoKS5pbnNlcnQoe2NvbGxlY3Rpb25OYW1lOiBlbnRpdHlDb25maWcuY29sbGVjdGlvbiwgb2Jqc30pIC8vIEFTWU5DXG5cbmNvbnN0IGF1dGhvcml6ZSA9IChkYXRhKSA9PiBtc05ldC5lbWl0KCdhdXRob3JpemUnLCBkYXRhLCBkYXRhLm1ldGEsIHRydWUpLy8gQVNZTkNcblxuZnVuY3Rpb24gZmlsdGVyVmlld3MgKHZpZXdzKSB7XG4gIHZpZXdzLmZvckVhY2godmlldyA9PiB7XG4gICAgaWYgKHZpZXcuZW1haWwpIGRlbGV0ZSB2aWV3LmVtYWlsXG4gICAgaWYgKHZpZXcuX3ZpZXdIYXNoKSBkZWxldGUgdmlldy5fdmlld0hhc2hcbiAgfSlcbiAgcmV0dXJuIHZpZXdzXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVZpZXdzICh2aWV3cywgbWV0YSkge1xuICBpZiAoIXZpZXdzIHx8ICF2aWV3cy5sZW5ndGgpIHJldHVybiBmYWxzZVxuICB2aWV3cyA9IGZpbHRlclZpZXdzKHZpZXdzKVxuICBDT05TT0xFLmRlYnVnKGB1cGRhdGVWaWV3cygpIGZpbHRlcmVkIHZpZXdzYCwgdmlld3MpXG4gIG1zTmV0LmVtaXQoJ3ZpZXdzVXBkYXRlZCcsIHZpZXdzLCBtZXRhKVxuICBhd2FpdCBzdG9yYWdlSW5zZXJ0KHZpZXdzKVxuICByZXR1cm4gdmlld3Ncbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzeW5jICB2aWV3c1VwZGF0ZWQgKHZpZXdzLCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIENPTlNPTEUuZGVidWcoYHN0YXJ0IHZpZXdzVXBkYXRlZCgpYCwge3ZpZXdzLCBtZXRhfSlcbiAgICAgIGF3YWl0IHVwZGF0ZVZpZXdzKCB2aWV3cywgbWV0YSlcbiAgICAgIHJldHVybiB7c3VjY2VzczogdHJ1ZX1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgdmlld3NVcGRhdGVkJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHZpZXdzVXBkYXRlZCcsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHJlYnVpbGRWaWV3cyAoe30sIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgcmVidWlsZFZpZXdzKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZClcbiAgICAgIHZhciBlbnRpdHlDb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZVZpZXcnKVxuICAgICAgdmFyIGxvb3AgPSB0cnVlXG4gICAgICB2YXIgcGFnZSA9IDBcbiAgICAgIHZhciB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgICB2YXIgcGFnZUl0ZW1zID0gMTBcbiAgICAgIHdoaWxlIChsb29wKSB7XG4gICAgICAgIHBhZ2UrK1xuICAgICAgICB2YXIgdmlld3MgPSBhd2FpdCBtc05ldC5ycGMoJ3Jlc291cmNlcycsICdsaXN0UmVzb3VyY2VzJywge3BhZ2UsIHRpbWVzdGFtcCwgcGFnZUl0ZW1zfSwgbWV0YSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZyhgcmVidWlsZFZpZXdzKCkgbGlzdFJlc291cmNlcyByZXNwb25zZWAsIHZpZXdzKVxuICAgICAgICBhd2FpdCB1cGRhdGVWaWV3cyh2aWV3cywgbWV0YSlcbiAgICAgICAgaWYgKCF2aWV3cyB8fCAhdmlld3MubGVuZ3RoIHx8IHZpZXdzLmxlbmd0aCA8IHBhZ2VJdGVtcylsb29wID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiB7c3VjY2VzczogdHJ1ZX1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgcmVidWlsZFZpZXdzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHJlYnVpbGRWaWV3cycsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHN5bmNWaWV3cyAoe30sIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgc3luY1ZpZXdzKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZClcbiAgICAgIHZhciBlbnRpdHlDb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZVZpZXcnKVxuICAgICAgdmFyIHBhZ2UgPSAwXG4gICAgICB2YXIgdGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgICAgdmFyIHBhZ2VJdGVtcyA9IDEwXG4gICAgICAvLyBGSU5EIFZJRVdTIElEUyBUTyBVUERBVEUgQlkgQ0hFQ0tTVU1cbiAgICAgIHZhciB2aWV3c1RvVXBkYXRlID0gW11cbiAgICAgIHZhciBsb29wID0gdHJ1ZVxuICAgICAgd2hpbGUgKGxvb3ApIHtcbiAgICAgICAgcGFnZSsrXG4gICAgICAgIHZhciB2aWV3c0NoZWNrc3VtcyA9IGF3YWl0IG1zTmV0LnJwYygncmVzb3VyY2VzJywgJ2xpc3RSZXNvdXJjZXMnLCB7cGFnZSwgdGltZXN0YW1wLCBwYWdlSXRlbXMsIGNoZWNrc3VtT25seTogdHJ1ZX0sIG1ldGEpXG4gICAgICAgIENPTlNPTEUuZGVidWcoYHN5bmNWaWV3cygpIGxpc3RSZXNvdXJjZXMgY2hlY2tzdW0gcmVzcG9uc2VgLCB7cGFnZSwgdGltZXN0YW1wLCBwYWdlSXRlbXMsIHZpZXdzQ2hlY2tzdW1zfSlcbiAgICAgICAgaWYgKHZpZXdzQ2hlY2tzdW1zICYmIHZpZXdzQ2hlY2tzdW1zLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBxdWVyeSA9IHskb3I6IHZpZXdzQ2hlY2tzdW1zfVxuICAgICAgICAgIHZhciB0b05vdFVwZGF0ZSA9IGF3YWl0IHN0b3JhZ2VGaW5kKHtxdWVyeSwgZmllbGRzOiB7IF9pZDogMSB9IH0pXG4gICAgICAgICAgdmFyIHZpZXdzQ2hlY2tzdW1zSWRzID0gdmlld3NDaGVja3N1bXMubWFwKHZpZXcgPT4gdmlldy5faWQpXG4gICAgICAgICAgdmFyIGlkc1RvTm90VXBkYXRlID0gdG9Ob3RVcGRhdGUubWFwKHZpZXcgPT4gdmlldy5faWQpXG4gICAgICAgICAgdmFyIGlkc1RvVXBkYXRlID0gdmlld3NDaGVja3N1bXNJZHMuZmlsdGVyKHZpZXdJZCA9PiBpZHNUb05vdFVwZGF0ZS5pbmRleE9mKHZpZXdJZCkgPT09IC0xKVxuICAgICAgICAgIHZpZXdzVG9VcGRhdGUgPSB2aWV3c1RvVXBkYXRlLmNvbmNhdChpZHNUb1VwZGF0ZSlcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKGBzeW5jVmlld3MoKSBzdG9yYWdlRmluZGAsIHtxdWVyeSwgdG9Ob3RVcGRhdGUsIGlkc1RvVXBkYXRlfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZpZXdzQ2hlY2tzdW1zIHx8ICF2aWV3c0NoZWNrc3Vtcy5sZW5ndGggfHwgdmlld3NDaGVja3N1bXMubGVuZ3RoIDwgcGFnZUl0ZW1zKWxvb3AgPSBmYWxzZVxuICAgICAgfVxuICAgICAgLy8gUVVFUlkgVklFV1MgQlkgSUQgQU5EIFVQREFURVxuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3luY1ZpZXdzKCkgdmlld3NUb1VwZGF0ZSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkLCB2aWV3c1RvVXBkYXRlKVxuICAgICAgaWYgKHZpZXdzVG9VcGRhdGUubGVuZ3RoKSB7XG4gICAgICAgIHZhciB2aWV3cyA9IGF3YWl0IG1zTmV0LnJwYygncmVzb3VyY2VzJywgJ2xpc3RSZXNvdXJjZXMnLCB7aWRJbjogdmlld3NUb1VwZGF0ZX0sIG1ldGEpXG4gICAgICAgIC8vIHZhciB2aWV3cyA9IGF3YWl0IG1zTmV0LmVtaXQoJ2xpc3RSZXNvdXJjZXMnLCB7aWRJbjogdmlld3NUb1VwZGF0ZX0sIG1ldGEpXG4gICAgICAgIENPTlNPTEUuZGVidWcoYHN5bmNWaWV3cygpIGxpc3RSZXNvdXJjZXMgcmVzcG9uc2VgLCB2aWV3cylcbiAgICAgICAgYXdhaXQgdXBkYXRlVmlld3Modmlld3MsIG1ldGEpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7c3VjY2VzczogdHJ1ZX1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgc3luY1ZpZXdzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHN5bmNWaWV3cycsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfVxufVxuIl19