'use strict';

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var entityCqrs = require('../../../entity.cqrs');
var jesus = require('../../../jesus');
var uuidV4 = require('uuid/v4');
var netClient = require('../../../net.client');

var serviceName = require('./config').serviceName;
var serviceId = require('./serviceId.json');
var getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath);
var getConsole = function getConsole(serviceName, serviceId, pack) {
  return jesus.getConsole(require('./config').console, serviceName, serviceId, pack);
};

var PACKAGE = 'methods';
var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
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

var netClientPackage = netClient({ getSharedConfig: getSharedConfig, serviceName: serviceName, serviceId: serviceId, getConsole: getConsole });

function filterViews(views) {
  views.forEach(function (view) {
    if (view.email) delete view.email;
    if (view._viewHash) delete view._viewHash;
  });
  return views;
}

function updateViews(entityConfig, views, meta) {
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
          CONSOLE.debug('updateViews() filtered views', views);
          netClientPackage.emit('viewsUpdated', views, meta);
          _context3.next = 7;
          return regeneratorRuntime.awrap(entityConfig.storage({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig }));

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

            CONSOLE.debug('start viewsUpdated()', { views: views, meta: meta });
            _context4.next = 5;
            return regeneratorRuntime.awrap(updateViews(entityConfig, views, meta));

          case 5:
            return _context4.abrupt('return', { success: true });

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](0);

            CONSOLE.warn('problems during viewsUpdated', _context4.t0);
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
            return regeneratorRuntime.awrap(netClientPackage.rpc('resources', 'listResources', { page: page, timestamp: timestamp, pageItems: pageItems }, meta));

          case 12:
            views = _context5.sent;

            CONSOLE.debug('rebuildViews() listResources response', views);
            _context5.next = 16;
            return regeneratorRuntime.awrap(updateViews(entityConfig, views, meta));

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
    var entityConfig, storagePackage, page, timestamp, pageItems, viewsToUpdate, loop, viewsChecksums, query, toNotUpdate, viewsChecksumsIds, idsToNotUpdate, idsToUpdate, views;
    return regeneratorRuntime.async(function syncViews$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _objectDestructuringEmpty(_ref2);

            _context6.prev = 1;

            CONSOLE.debug('start syncViews() requestId:' + meta.requestId);
            entityConfig = require('./config.ResourceView');
            _context6.next = 6;
            return regeneratorRuntime.awrap(entityConfig.storage({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig }));

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

            CONSOLE.debug('syncViews() listResources checksum response', { page: page, timestamp: timestamp, pageItems: pageItems, viewsChecksums: viewsChecksums });

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
            CONSOLE.debug('syncViews() storagePackage.find', { query: query, toNotUpdate: toNotUpdate, idsToUpdate: idsToUpdate });

          case 28:
            if (!viewsChecksums || !viewsChecksums.length || viewsChecksums.length < pageItems) loop = false;
            _context6.next = 12;
            break;

          case 31:
            // QUERY VIEWS BY ID AND UPDATE
            CONSOLE.debug('syncViews() viewsToUpdate requestId:' + meta.requestId, viewsToUpdate);

            if (!viewsToUpdate.length) {
              _context6.next = 39;
              break;
            }

            _context6.next = 35;
            return regeneratorRuntime.awrap(netClientPackage.rpc('resources', 'listResources', { idIn: viewsToUpdate }, meta));

          case 35:
            views = _context6.sent;

            // var views = await netClientPackage.emit('listResources', {idIn: viewsToUpdate}, meta)
            CONSOLE.debug('syncViews() listResources response', views);
            _context6.next = 39;
            return regeneratorRuntime.awrap(updateViews(entityConfig, views, meta));

          case 39:
            return _context6.abrupt('return', { success: true });

          case 42:
            _context6.prev = 42;
            _context6.t0 = _context6['catch'](1);

            CONSOLE.warn('problems during syncViews', _context6.t0);
            return _context6.abrupt('return', { error: 'problems during syncViews', originalError: _context6.t0 });

          case 46:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, this, [[1, 42]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImVudGl0eUNxcnMiLCJyZXF1aXJlIiwiamVzdXMiLCJ1dWlkVjQiLCJuZXRDbGllbnQiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIlBBQ0tBR0UiLCJDT05TT0xFIiwiZXJyb3JUaHJvdyIsInZhbGlkYXRlTWV0aG9kUmVxdWVzdCIsIm1ldGhvZE5hbWUiLCJkYXRhIiwidmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIiwidmFsaWRhdGVNZXRob2RSZXNwb25zZSIsIm5ldENsaWVudFBhY2thZ2UiLCJmaWx0ZXJWaWV3cyIsInZpZXdzIiwiZm9yRWFjaCIsInZpZXciLCJlbWFpbCIsIl92aWV3SGFzaCIsInVwZGF0ZVZpZXdzIiwiZW50aXR5Q29uZmlnIiwibWV0YSIsImxlbmd0aCIsImRlYnVnIiwiZW1pdCIsInN0b3JhZ2UiLCJzdG9yYWdlQ29sbGVjdGlvbiIsInN0b3JhZ2VDb25maWciLCJzdG9yYWdlUGFja2FnZSIsImluc2VydCIsIm9ianMiLCJtb2R1bGUiLCJleHBvcnRzIiwidmlld3NVcGRhdGVkIiwic3VjY2VzcyIsIndhcm4iLCJlcnJvciIsIm9yaWdpbmFsRXJyb3IiLCJyZWJ1aWxkVmlld3MiLCJyZXF1ZXN0SWQiLCJsb29wIiwicGFnZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJwYWdlSXRlbXMiLCJycGMiLCJzeW5jVmlld3MiLCJ2aWV3c1RvVXBkYXRlIiwiY2hlY2tzdW1Pbmx5Iiwidmlld3NDaGVja3N1bXMiLCJxdWVyeSIsIiRvciIsImZpbmQiLCJmaWVsZHMiLCJfaWQiLCJ0b05vdFVwZGF0ZSIsInZpZXdzQ2hlY2tzdW1zSWRzIiwibWFwIiwiaWRzVG9Ob3RVcGRhdGUiLCJpZHNUb1VwZGF0ZSIsImZpbHRlciIsImluZGV4T2YiLCJ2aWV3SWQiLCJjb25j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Ly4uLy4uL2VudGl0eS5jcXJzJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2plc3VzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxuY29uc3QgbmV0Q2xpZW50ID0gcmVxdWlyZSgnLi4vLi4vLi4vbmV0LmNsaWVudCcpXG5cbnZhciBzZXJ2aWNlTmFtZSA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2VydmljZU5hbWVcbnZhciBzZXJ2aWNlSWQgPSByZXF1aXJlKCcuL3NlcnZpY2VJZC5qc29uJylcbnZhciBnZXRTaGFyZWRDb25maWcgPSBqZXN1cy5nZXRTaGFyZWRDb25maWcocmVxdWlyZSgnLi9jb25maWcnKS5zaGFyZWRTZXJ2aWNlc1BhdGgpXG52YXIgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiBqZXN1cy5nZXRDb25zb2xlKHJlcXVpcmUoJy4vY29uZmlnJykuY29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcblxuY29uc3QgUEFDS0FHRSA9ICdtZXRob2RzJ1xudmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG52YXIgZXJyb3JUaHJvdyA9IGplc3VzLmVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcblxuY29uc3QgdmFsaWRhdGVNZXRob2RSZXF1ZXN0ID0gYXN5bmMgKG1ldGhvZE5hbWUsIGRhdGEpID0+IGplc3VzLnZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdtZXRob2RzJyksIG1ldGhvZE5hbWUsIGRhdGEsICdyZXF1ZXN0U2NoZW1hJylcbmNvbnN0IHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UgPSBhc3luYyAobWV0aG9kTmFtZSwgZGF0YSkgPT4gamVzdXMudmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ21ldGhvZHMnKSwgbWV0aG9kTmFtZSwgZGF0YSwgJ3Jlc3BvbnNlU2NoZW1hJylcblxudmFyIG5ldENsaWVudFBhY2thZ2UgPSBuZXRDbGllbnQoe2dldFNoYXJlZENvbmZpZywgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZ2V0Q29uc29sZX0pXG5cbmZ1bmN0aW9uIGZpbHRlclZpZXdzICh2aWV3cykge1xuICB2aWV3cy5mb3JFYWNoKHZpZXcgPT4ge1xuICAgIGlmICh2aWV3LmVtYWlsKSBkZWxldGUgdmlldy5lbWFpbFxuICAgIGlmICh2aWV3Ll92aWV3SGFzaCkgZGVsZXRlIHZpZXcuX3ZpZXdIYXNoXG4gIH0pXG4gIHJldHVybiB2aWV3c1xufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVWaWV3cyAoZW50aXR5Q29uZmlnLCB2aWV3cywgbWV0YSkge1xuICBpZiAoIXZpZXdzIHx8ICF2aWV3cy5sZW5ndGgpIHJldHVybiBmYWxzZVxuICB2aWV3cyA9IGZpbHRlclZpZXdzKHZpZXdzKVxuICBDT05TT0xFLmRlYnVnKGB1cGRhdGVWaWV3cygpIGZpbHRlcmVkIHZpZXdzYCwgdmlld3MpXG4gIG5ldENsaWVudFBhY2thZ2UuZW1pdCgndmlld3NVcGRhdGVkJywgdmlld3MsIG1ldGEpXG4gIHZhciBzdG9yYWdlUGFja2FnZSA9IGF3YWl0IGVudGl0eUNvbmZpZy5zdG9yYWdlKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBzdG9yYWdlQ29sbGVjdGlvbjogZW50aXR5Q29uZmlnLnN0b3JhZ2VDb2xsZWN0aW9uLCBzdG9yYWdlQ29uZmlnOiBlbnRpdHlDb25maWcuc3RvcmFnZUNvbmZpZ30pXG4gIGF3YWl0IHN0b3JhZ2VQYWNrYWdlLmluc2VydCh7b2Jqczogdmlld3N9KVxuICByZXR1cm4gdmlld3Ncbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzeW5jICB2aWV3c1VwZGF0ZWQgKHZpZXdzLCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBlbnRpdHlDb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZVZpZXcnKVxuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgdmlld3NVcGRhdGVkKClgLCB7dmlld3MsIG1ldGF9KVxuICAgICAgYXdhaXQgdXBkYXRlVmlld3MoZW50aXR5Q29uZmlnLCB2aWV3cywgbWV0YSlcbiAgICAgIHJldHVybiB7c3VjY2VzczogdHJ1ZX1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgdmlld3NVcGRhdGVkJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHZpZXdzVXBkYXRlZCcsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHJlYnVpbGRWaWV3cyAoe30sIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgcmVidWlsZFZpZXdzKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZClcbiAgICAgIHZhciBlbnRpdHlDb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZVZpZXcnKVxuICAgICAgdmFyIGxvb3AgPSB0cnVlXG4gICAgICB2YXIgcGFnZSA9IDBcbiAgICAgIHZhciB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgICB2YXIgcGFnZUl0ZW1zID0gMTBcbiAgICAgIHdoaWxlIChsb29wKSB7XG4gICAgICAgIHBhZ2UrK1xuICAgICAgICB2YXIgdmlld3MgPSBhd2FpdCBuZXRDbGllbnRQYWNrYWdlLnJwYygncmVzb3VyY2VzJywgJ2xpc3RSZXNvdXJjZXMnLCB7cGFnZSwgdGltZXN0YW1wLCBwYWdlSXRlbXN9LCBtZXRhKVxuICAgICAgICBDT05TT0xFLmRlYnVnKGByZWJ1aWxkVmlld3MoKSBsaXN0UmVzb3VyY2VzIHJlc3BvbnNlYCwgdmlld3MpXG4gICAgICAgIGF3YWl0IHVwZGF0ZVZpZXdzKGVudGl0eUNvbmZpZywgdmlld3MsIG1ldGEpXG4gICAgICAgIGlmICghdmlld3MgfHwgIXZpZXdzLmxlbmd0aCB8fCB2aWV3cy5sZW5ndGggPCBwYWdlSXRlbXMpbG9vcCA9IGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4ge3N1Y2Nlc3M6IHRydWV9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIHJlYnVpbGRWaWV3cycsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyByZWJ1aWxkVmlld3MnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICBzeW5jVmlld3MgKHt9LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIENPTlNPTEUuZGVidWcoYHN0YXJ0IHN5bmNWaWV3cygpIHJlcXVlc3RJZDpgICsgbWV0YS5yZXF1ZXN0SWQpXG4gICAgICB2YXIgZW50aXR5Q29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcuUmVzb3VyY2VWaWV3JylcbiAgICAgIHZhciBzdG9yYWdlUGFja2FnZSA9IGF3YWl0IGVudGl0eUNvbmZpZy5zdG9yYWdlKHtnZXRDb25zb2xlLHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb2xsZWN0aW9uOiBlbnRpdHlDb25maWcuc3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWc6IGVudGl0eUNvbmZpZy5zdG9yYWdlQ29uZmlnfSlcbiAgICAgIHZhciBwYWdlID0gMFxuICAgICAgdmFyIHRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICAgIHZhciBwYWdlSXRlbXMgPSAxMFxuICAgICAgLy8gRklORCBWSUVXUyBJRFMgVE8gVVBEQVRFIEJZIENIRUNLU1VNXG4gICAgICB2YXIgdmlld3NUb1VwZGF0ZSA9IFtdXG4gICAgICB2YXIgbG9vcCA9IHRydWVcbiAgICAgIHdoaWxlIChsb29wKSB7XG4gICAgICAgIHBhZ2UrK1xuICAgICAgICB2YXIgdmlld3NDaGVja3N1bXMgPSBhd2FpdCBuZXRDbGllbnRQYWNrYWdlLnJwYygncmVzb3VyY2VzJywgJ2xpc3RSZXNvdXJjZXMnLCB7cGFnZSwgdGltZXN0YW1wLCBwYWdlSXRlbXMsIGNoZWNrc3VtT25seTogdHJ1ZX0sIG1ldGEpXG4gICAgICAgIENPTlNPTEUuZGVidWcoYHN5bmNWaWV3cygpIGxpc3RSZXNvdXJjZXMgY2hlY2tzdW0gcmVzcG9uc2VgLCB7cGFnZSwgdGltZXN0YW1wLCBwYWdlSXRlbXMsIHZpZXdzQ2hlY2tzdW1zfSlcbiAgICAgICAgaWYgKHZpZXdzQ2hlY2tzdW1zICYmIHZpZXdzQ2hlY2tzdW1zLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBxdWVyeSA9IHskb3I6IHZpZXdzQ2hlY2tzdW1zfVxuICAgICAgICAgIHZhciB0b05vdFVwZGF0ZSA9IGF3YWl0IHN0b3JhZ2VQYWNrYWdlLmZpbmQoe3F1ZXJ5LCBmaWVsZHM6IHsgX2lkOiAxIH0gfSlcbiAgICAgICAgICB2YXIgdmlld3NDaGVja3N1bXNJZHMgPSB2aWV3c0NoZWNrc3Vtcy5tYXAodmlldyA9PiB2aWV3Ll9pZClcbiAgICAgICAgICB2YXIgaWRzVG9Ob3RVcGRhdGUgPSB0b05vdFVwZGF0ZS5tYXAodmlldyA9PiB2aWV3Ll9pZClcbiAgICAgICAgICB2YXIgaWRzVG9VcGRhdGUgPSB2aWV3c0NoZWNrc3Vtc0lkcy5maWx0ZXIodmlld0lkID0+IGlkc1RvTm90VXBkYXRlLmluZGV4T2Yodmlld0lkKSA9PT0gLTEpXG4gICAgICAgICAgdmlld3NUb1VwZGF0ZSA9IHZpZXdzVG9VcGRhdGUuY29uY2F0KGlkc1RvVXBkYXRlKVxuICAgICAgICAgIENPTlNPTEUuZGVidWcoYHN5bmNWaWV3cygpIHN0b3JhZ2VQYWNrYWdlLmZpbmRgLCB7cXVlcnksIHRvTm90VXBkYXRlLCBpZHNUb1VwZGF0ZX0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2aWV3c0NoZWNrc3VtcyB8fCAhdmlld3NDaGVja3N1bXMubGVuZ3RoIHx8IHZpZXdzQ2hlY2tzdW1zLmxlbmd0aCA8IHBhZ2VJdGVtcylsb29wID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIC8vIFFVRVJZIFZJRVdTIEJZIElEIEFORCBVUERBVEVcbiAgICAgIENPTlNPTEUuZGVidWcoYHN5bmNWaWV3cygpIHZpZXdzVG9VcGRhdGUgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwgdmlld3NUb1VwZGF0ZSlcbiAgICAgIGlmICh2aWV3c1RvVXBkYXRlLmxlbmd0aCkge1xuICAgICAgICB2YXIgdmlld3MgPSBhd2FpdCBuZXRDbGllbnRQYWNrYWdlLnJwYygncmVzb3VyY2VzJywgJ2xpc3RSZXNvdXJjZXMnLCB7aWRJbjogdmlld3NUb1VwZGF0ZX0sIG1ldGEpXG4gICAgICAgIC8vIHZhciB2aWV3cyA9IGF3YWl0IG5ldENsaWVudFBhY2thZ2UuZW1pdCgnbGlzdFJlc291cmNlcycsIHtpZEluOiB2aWV3c1RvVXBkYXRlfSwgbWV0YSlcbiAgICAgICAgQ09OU09MRS5kZWJ1Zyhgc3luY1ZpZXdzKCkgbGlzdFJlc291cmNlcyByZXNwb25zZWAsIHZpZXdzKVxuICAgICAgICBhd2FpdCB1cGRhdGVWaWV3cyhlbnRpdHlDb25maWcsIHZpZXdzLCBtZXRhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge3N1Y2Nlc3M6IHRydWV9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIHN5bmNWaWV3cycsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBzeW5jVmlld3MnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH1cbn1cbiJdfQ==