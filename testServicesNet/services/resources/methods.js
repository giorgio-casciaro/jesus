'use strict';

var entityCqrs = require('../../../entity.cqrs');
var jesus = require('../../../jesus');
var uuidV4 = require('uuid/v4');
var netClient = require('../../../net.client');

var serviceName = require('./config').serviceName;
var serviceId = require('./serviceId.json');
var sharedServicesPath = require('./config').sharedServicesPath;
var sharedServicePath = require('./config').sharedServicePath;

process.on('unhandledRejection', function (reason, promise) {
  return LOG.error('unhandledRejection Reason: ', promise, reason);
});

var PACKAGE = 'methods';
var LOG = jesus.LOG(serviceName, serviceId, PACKAGE);
var errorThrow = jesus.errorThrow(serviceName, serviceId, PACKAGE);

var validateMethodRequest = function validateMethodRequest(apiMethod, data) {
  return jesus.validateMethodFromConfig(serviceName, serviceId, sharedServicePath + '/methods.json', apiMethod, data, 'requestSchema');
};
var validateMethodResponse = function validateMethodResponse(apiMethod, data) {
  return jesus.validateMethodFromConfig(serviceName, serviceId, sharedServicePath + '/methods.json', apiMethod, data, 'responseSchema');
};

var NET_CLIENT_ARGS = { sharedServicesPath: sharedServicesPath, sharedServicePath: sharedServicePath, serviceName: serviceName, serviceId: serviceId };
var netClientPackage = netClient(NET_CLIENT_ARGS);

function authorize(data) {
  var results;
  return regeneratorRuntime.async(function authorize$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(netClientPackage.emit('authorize', data));

        case 2:
          results = _context.sent;

          if (!results) errorThrow('not authorized');
          return _context.abrupt('return', results);

        case 5:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

module.exports = {
  createResource: function createResource(_ref, meta) {
    var data = _ref.data,
        id = _ref.id;
    var cqrs, userData, addedMutation;
    return regeneratorRuntime.async(function createResource$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            // LOG.profile('createResource')
            LOG.debug('start createResource()', { data: data, id: id }, meta);
            validateMethodRequest('createResource', { data: data, id: id }, meta);
            data._id = id = id || data._id || uuidV4(); // generate id if necessary
            _context2.next = 6;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId }));

          case 6:
            cqrs = _context2.sent;
            userData = authorize({ action: 'write.create', entityName: 'Resource', meta: meta, data: data, id: id });
            _context2.next = 10;
            return regeneratorRuntime.awrap(cqrs.mutationsPackage.mutate({ data: data, objId: id, mutation: 'create', userData: userData }));

          case 10:
            addedMutation = _context2.sent;

            // REFRESH VIEWS
            cqrs.viewsPackage.refreshViews({ objIds: [id], loadSnapshot: false, loadMutations: false, addMutations: [addedMutation] }).then(function (views) {
              netClientPackage.emit('viewsUpdated', views);
            });
            // LOG.profileEnd('createResource')
            return _context2.abrupt('return', validateMethodResponse('createResource', { id: id }));

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2['catch'](0);

            LOG.warn('problems during create', _context2.t0);
            return _context2.abrupt('return', { error: 'problems during create', originalError: _context2.t0 });

          case 19:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[0, 15]]);
  },
  updateResource: function updateResource(_ref2, meta) {
    var data = _ref2.data,
        id = _ref2.id;
    var cqrs, userData, addedMutation;
    return regeneratorRuntime.async(function updateResource$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            LOG.debug('start updateResource()', { data: data, id: id }, meta);
            validateMethodRequest('updateResource', { data: data, id: id }, meta);
            data._id = id = id || data._id;
            _context3.next = 6;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId }));

          case 6:
            cqrs = _context3.sent;
            userData = authorize({ action: 'write.update', entityName: 'Resource', meta: meta, data: data, id: id });
            _context3.next = 10;
            return regeneratorRuntime.awrap(cqrs.mutationsPackage.mutate({ data: data, objId: id, mutation: 'update', userData: userData }));

          case 10:
            addedMutation = _context3.sent;

            cqrs.viewsPackage.refreshViews({ objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation] }).then(function (views) {
              netClientPackage.emit('viewsUpdated', views);
            });
            return _context3.abrupt('return', validateMethodResponse('updateResource', { id: id }));

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3['catch'](0);

            LOG.warn('problems during update', _context3.t0);
            return _context3.abrupt('return', { error: 'problems during update', originalError: _context3.t0 });

          case 19:
          case 'end':
            return _context3.stop();
        }
      }
    }, null, this, [[0, 15]]);
  },
  deleteResource: function deleteResource(_ref3, meta) {
    var data = _ref3.data,
        id = _ref3.id;
    var cqrs, userData, addedMutation;
    return regeneratorRuntime.async(function deleteResource$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            LOG.debug('start deleteResource()', { data: data, id: id }, meta);
            validateMethodRequest('deleteResource', { data: data, id: id }, meta);
            data._id = id = id || data._id;
            _context4.next = 6;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId }));

          case 6:
            cqrs = _context4.sent;
            userData = authorize({ action: 'write.delete', entityName: 'Resource', meta: meta, data: data, id: id });
            _context4.next = 10;
            return regeneratorRuntime.awrap(cqrs.mutationsPackage.mutate({ data: data, objId: id, mutation: 'delete', userData: userData }));

          case 10:
            addedMutation = _context4.sent;

            cqrs.viewsPackage.refreshViews({ objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation] }).then(function (views) {
              netClientPackage.emit('viewsUpdated', views);
            });
            return _context4.abrupt('return', validateMethodResponse('deleteResource', { id: id }));

          case 15:
            _context4.prev = 15;
            _context4.t0 = _context4['catch'](0);

            LOG.warn('problems during delete', _context4.t0);
            return _context4.abrupt('return', { error: 'problems during delete', originalError: _context4.t0 });

          case 19:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, this, [[0, 15]]);
  },
  readResource: function readResource(_ref4, meta) {
    var data = _ref4.data,
        id = _ref4.id;
    var cqrs, viewsResult, userData;
    return regeneratorRuntime.async(function readResource$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;

            LOG.debug('start readResource()', { data: data, id: id }, meta);
            validateMethodRequest('readResource', { data: data, id: id }, meta);
            id = id || data._id;
            _context5.next = 6;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId }));

          case 6:
            cqrs = _context5.sent;
            _context5.next = 9;
            return regeneratorRuntime.awrap(cqrs.viewsPackage.get({ ids: [id] }));

          case 9:
            viewsResult = _context5.sent;

            LOG.debug('readResource viewsResult', viewsResult);

            if (!(viewsResult.length !== 1)) {
              _context5.next = 13;
              break;
            }

            throw 'id: ' + id + ' Item Not Founded';

          case 13:
            userData = authorize({ action: 'read', entityName: 'Resource', meta: meta, data: data, id: id });
            return _context5.abrupt('return', validateMethodResponse('readResource', viewsResult[0]));

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5['catch'](0);

            LOG.warn('problems during read', _context5.t0);
            return _context5.abrupt('return', { error: 'problems during read', originalError: _context5.t0 });

          case 21:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, this, [[0, 17]]);
  },
  listResources: function listResources(_ref5, meta) {
    var _ref5$page = _ref5.page,
        page = _ref5$page === undefined ? 1 : _ref5$page,
        timestamp = _ref5.timestamp,
        _ref5$pageItems = _ref5.pageItems,
        pageItems = _ref5$pageItems === undefined ? 10 : _ref5$pageItems,
        _ref5$checksumOnly = _ref5.checksumOnly,
        checksumOnly = _ref5$checksumOnly === undefined ? false : _ref5$checksumOnly,
        idIn = _ref5.idIn;
    var cqrs, fields, query, views;
    return regeneratorRuntime.async(function listResources$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;

            LOG.debug('start listResources()', { page: page, timestamp: timestamp }, meta);
            validateMethodRequest('listResources', { page: page, timestamp: timestamp }, meta);
            _context6.next = 5;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId }));

          case 5:
            cqrs = _context6.sent;
            fields = checksumOnly ? { _viewHash: 1 } : null;
            query = {};

            if (timestamp) query._viewBuilded = { $lt: timestamp };
            if (idIn) query._id = { $in: idIn };
            _context6.next = 12;
            return regeneratorRuntime.awrap(cqrs.viewsPackage.find({ query: query, limit: pageItems, start: (page - 1) * pageItems, fields: fields }));

          case 12:
            views = _context6.sent;

            LOG.debug('listResources response', { views: views });
            return _context6.abrupt('return', validateMethodResponse('listResources', views));

          case 17:
            _context6.prev = 17;
            _context6.t0 = _context6['catch'](0);

            LOG.warn('problems during listResources', _context6.t0);
            return _context6.abrupt('return', { error: 'problems during listResources', originalError: _context6.t0 });

          case 21:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, this, [[0, 17]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImVudGl0eUNxcnMiLCJyZXF1aXJlIiwiamVzdXMiLCJ1dWlkVjQiLCJuZXRDbGllbnQiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsInNoYXJlZFNlcnZpY2VzUGF0aCIsInNoYXJlZFNlcnZpY2VQYXRoIiwicHJvY2VzcyIsIm9uIiwicmVhc29uIiwicHJvbWlzZSIsIkxPRyIsImVycm9yIiwiUEFDS0FHRSIsImVycm9yVGhyb3ciLCJ2YWxpZGF0ZU1ldGhvZFJlcXVlc3QiLCJhcGlNZXRob2QiLCJkYXRhIiwidmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIiwidmFsaWRhdGVNZXRob2RSZXNwb25zZSIsIk5FVF9DTElFTlRfQVJHUyIsIm5ldENsaWVudFBhY2thZ2UiLCJhdXRob3JpemUiLCJlbWl0IiwicmVzdWx0cyIsIm1vZHVsZSIsImV4cG9ydHMiLCJjcmVhdGVSZXNvdXJjZSIsIm1ldGEiLCJpZCIsImRlYnVnIiwiX2lkIiwiY3FycyIsInVzZXJEYXRhIiwiYWN0aW9uIiwiZW50aXR5TmFtZSIsIm11dGF0aW9uc1BhY2thZ2UiLCJtdXRhdGUiLCJvYmpJZCIsIm11dGF0aW9uIiwiYWRkZWRNdXRhdGlvbiIsInZpZXdzUGFja2FnZSIsInJlZnJlc2hWaWV3cyIsIm9iaklkcyIsImxvYWRTbmFwc2hvdCIsImxvYWRNdXRhdGlvbnMiLCJhZGRNdXRhdGlvbnMiLCJ0aGVuIiwidmlld3MiLCJ3YXJuIiwib3JpZ2luYWxFcnJvciIsInVwZGF0ZVJlc291cmNlIiwiZGVsZXRlUmVzb3VyY2UiLCJyZWFkUmVzb3VyY2UiLCJnZXQiLCJpZHMiLCJ2aWV3c1Jlc3VsdCIsImxlbmd0aCIsImxpc3RSZXNvdXJjZXMiLCJwYWdlIiwidGltZXN0YW1wIiwicGFnZUl0ZW1zIiwiY2hlY2tzdW1Pbmx5IiwiaWRJbiIsImZpZWxkcyIsIl92aWV3SGFzaCIsInF1ZXJ5IiwiX3ZpZXdCdWlsZGVkIiwiJGx0IiwiJGluIiwiZmlu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QyxLQUFLTixJQUFOLEVBQVo7QUEvRUU7QUFBQSw0Q0FnRk8vQixLQUFLUyxZQUFMLENBQWtCNkIsSUFBbEIsQ0FBdUIsRUFBQ0osWUFBRCxFQUFRSyxPQUFPVixTQUFmLEVBQTBCVyxPQUFPLENBQUNiLE9BQU8sQ0FBUixJQUFhRSxTQUE5QyxFQUF5REcsY0FBekQsRUFBdkIsQ0FoRlA7O0FBQUE7QUFnRlBoQixpQkFoRk87O0FBaUZYckMsZ0JBQUltQixLQUFKLDJCQUFvQyxFQUFDa0IsWUFBRCxFQUFwQztBQWpGVyw4Q0FrRko3Qix1QkFBdUIsZUFBdkIsRUFBd0M2QixLQUF4QyxDQWxGSTs7QUFBQTtBQUFBO0FBQUE7O0FBb0ZYckMsZ0JBQUlzQyxJQUFKLENBQVMsK0JBQVQ7QUFwRlcsOENBcUZKLEVBQUNyQyxPQUFPLCtCQUFSLEVBQXlDc0MsMkJBQXpDLEVBckZJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibWV0aG9kcy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZW50aXR5Q3FycyA9IHJlcXVpcmUoJy4uLy4uLy4uL2VudGl0eS5jcXJzJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2plc3VzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxuY29uc3QgbmV0Q2xpZW50ID0gcmVxdWlyZSgnLi4vLi4vLi4vbmV0LmNsaWVudCcpXG5cbnZhciBzZXJ2aWNlTmFtZSA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2VydmljZU5hbWVcbnZhciBzZXJ2aWNlSWQgPSByZXF1aXJlKCcuL3NlcnZpY2VJZC5qc29uJylcbnZhciBzaGFyZWRTZXJ2aWNlc1BhdGggPSByZXF1aXJlKCcuL2NvbmZpZycpLnNoYXJlZFNlcnZpY2VzUGF0aFxudmFyIHNoYXJlZFNlcnZpY2VQYXRoID0gcmVxdWlyZSgnLi9jb25maWcnKS5zaGFyZWRTZXJ2aWNlUGF0aFxuXG5wcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwcm9taXNlKSA9PiBMT0cuZXJyb3IoJ3VuaGFuZGxlZFJlamVjdGlvbiBSZWFzb246ICcsIHByb21pc2UsIHJlYXNvbikpXG5cbmNvbnN0IFBBQ0tBR0UgPSAnbWV0aG9kcydcbnZhciBMT0cgPSBqZXN1cy5MT0coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbnZhciBlcnJvclRocm93ID0gamVzdXMuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG5jb25zdCB2YWxpZGF0ZU1ldGhvZFJlcXVlc3QgPSAoYXBpTWV0aG9kLCBkYXRhKSA9PiBqZXN1cy52YWxpZGF0ZU1ldGhvZEZyb21Db25maWcoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgc2hhcmVkU2VydmljZVBhdGggKyAnL21ldGhvZHMuanNvbicsIGFwaU1ldGhvZCwgZGF0YSwgJ3JlcXVlc3RTY2hlbWEnKVxuY29uc3QgdmFsaWRhdGVNZXRob2RSZXNwb25zZSA9IChhcGlNZXRob2QsIGRhdGEpID0+IGplc3VzLnZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBzaGFyZWRTZXJ2aWNlUGF0aCArICcvbWV0aG9kcy5qc29uJywgYXBpTWV0aG9kLCBkYXRhLCAncmVzcG9uc2VTY2hlbWEnKVxuXG5jb25zdCBORVRfQ0xJRU5UX0FSR1MgPSB7c2hhcmVkU2VydmljZXNQYXRoLCBzaGFyZWRTZXJ2aWNlUGF0aCwgc2VydmljZU5hbWUsIHNlcnZpY2VJZH1cbnZhciBuZXRDbGllbnRQYWNrYWdlID0gbmV0Q2xpZW50KE5FVF9DTElFTlRfQVJHUylcblxuYXN5bmMgZnVuY3Rpb24gYXV0aG9yaXplIChkYXRhKSB7XG4gIHZhciByZXN1bHRzID0gYXdhaXQgbmV0Q2xpZW50UGFja2FnZS5lbWl0KCdhdXRob3JpemUnLCBkYXRhKVxuICBpZiAoIXJlc3VsdHMpIGVycm9yVGhyb3coYG5vdCBhdXRob3JpemVkYClcbiAgcmV0dXJuIHJlc3VsdHNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzeW5jICBjcmVhdGVSZXNvdXJjZSAoe2RhdGEsIGlkfSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICAvLyBMT0cucHJvZmlsZSgnY3JlYXRlUmVzb3VyY2UnKVxuICAgICAgTE9HLmRlYnVnKGBzdGFydCBjcmVhdGVSZXNvdXJjZSgpYCwge2RhdGEsIGlkfSwgbWV0YSlcbiAgICAgIHZhbGlkYXRlTWV0aG9kUmVxdWVzdCgnY3JlYXRlUmVzb3VyY2UnLCB7ZGF0YSwgaWR9LCBtZXRhKVxuICAgICAgZGF0YS5faWQgPSBpZCA9IGlkIHx8IGRhdGEuX2lkIHx8IHV1aWRWNCgpIC8vIGdlbmVyYXRlIGlkIGlmIG5lY2Vzc2FyeVxuICAgICAgdmFyIGNxcnMgPSBhd2FpdCBlbnRpdHlDcXJzKHJlcXVpcmUoJy4vY29uZmlnLlJlc291cmNlJyksIHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkfSlcbiAgICAgIHZhciB1c2VyRGF0YSA9IGF1dGhvcml6ZSh7YWN0aW9uOiAnd3JpdGUuY3JlYXRlJywgZW50aXR5TmFtZTogJ1Jlc291cmNlJywgbWV0YSwgZGF0YSwgaWR9KVxuICAgICAgdmFyIGFkZGVkTXV0YXRpb24gPSBhd2FpdCBjcXJzLm11dGF0aW9uc1BhY2thZ2UubXV0YXRlKHtkYXRhLCBvYmpJZDogaWQsIG11dGF0aW9uOiAnY3JlYXRlJywgdXNlckRhdGF9KVxuICAgICAgLy8gUkVGUkVTSCBWSUVXU1xuICAgICAgY3Fycy52aWV3c1BhY2thZ2UucmVmcmVzaFZpZXdzKHtvYmpJZHM6IFtpZF0sIGxvYWRTbmFwc2hvdDogZmFsc2UsIGxvYWRNdXRhdGlvbnM6IGZhbHNlLCBhZGRNdXRhdGlvbnM6IFthZGRlZE11dGF0aW9uXX0pLnRoZW4oKHZpZXdzKSA9PiB7XG4gICAgICAgIG5ldENsaWVudFBhY2thZ2UuZW1pdCgndmlld3NVcGRhdGVkJywgdmlld3MpXG4gICAgICB9KVxuICAgICAgLy8gTE9HLnByb2ZpbGVFbmQoJ2NyZWF0ZVJlc291cmNlJylcbiAgICAgIHJldHVybiB2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlKCdjcmVhdGVSZXNvdXJjZScsIHtpZH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIExPRy53YXJuKCdwcm9ibGVtcyBkdXJpbmcgY3JlYXRlJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGNyZWF0ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHVwZGF0ZVJlc291cmNlICh7ZGF0YSwgaWR9LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIExPRy5kZWJ1Zyhgc3RhcnQgdXBkYXRlUmVzb3VyY2UoKWAsIHtkYXRhLCBpZH0sIG1ldGEpXG4gICAgICB2YWxpZGF0ZU1ldGhvZFJlcXVlc3QoJ3VwZGF0ZVJlc291cmNlJywge2RhdGEsIGlkfSwgbWV0YSlcbiAgICAgIGRhdGEuX2lkID0gaWQgPSBpZCB8fCBkYXRhLl9pZFxuICAgICAgdmFyIGNxcnMgPSBhd2FpdCBlbnRpdHlDcXJzKHJlcXVpcmUoJy4vY29uZmlnLlJlc291cmNlJyksIHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkfSlcbiAgICAgIHZhciB1c2VyRGF0YSA9IGF1dGhvcml6ZSh7YWN0aW9uOiAnd3JpdGUudXBkYXRlJywgZW50aXR5TmFtZTogJ1Jlc291cmNlJywgbWV0YSwgZGF0YSwgaWR9KVxuICAgICAgdmFyIGFkZGVkTXV0YXRpb24gPSBhd2FpdCBjcXJzLm11dGF0aW9uc1BhY2thZ2UubXV0YXRlKHtkYXRhLCBvYmpJZDogaWQsIG11dGF0aW9uOiAndXBkYXRlJywgdXNlckRhdGF9KVxuICAgICAgY3Fycy52aWV3c1BhY2thZ2UucmVmcmVzaFZpZXdzKHtvYmpJZHM6IFtpZF0sIGxvYWRTbmFwc2hvdDogdHJ1ZSwgbG9hZE11dGF0aW9uczogdHJ1ZSwgYWRkTXV0YXRpb25zOiBbYWRkZWRNdXRhdGlvbl19KS50aGVuKCh2aWV3cykgPT4ge1xuICAgICAgICBuZXRDbGllbnRQYWNrYWdlLmVtaXQoJ3ZpZXdzVXBkYXRlZCcsIHZpZXdzKVxuICAgICAgfSlcbiAgICAgIHJldHVybiB2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlKCd1cGRhdGVSZXNvdXJjZScsIHtpZH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIExPRy53YXJuKCdwcm9ibGVtcyBkdXJpbmcgdXBkYXRlJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHVwZGF0ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIGRlbGV0ZVJlc291cmNlICh7ZGF0YSwgaWR9LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIExPRy5kZWJ1Zyhgc3RhcnQgZGVsZXRlUmVzb3VyY2UoKWAsIHtkYXRhLCBpZH0sIG1ldGEpXG4gICAgICB2YWxpZGF0ZU1ldGhvZFJlcXVlc3QoJ2RlbGV0ZVJlc291cmNlJywge2RhdGEsIGlkfSwgbWV0YSlcbiAgICAgIGRhdGEuX2lkID0gaWQgPSBpZCB8fCBkYXRhLl9pZFxuICAgICAgdmFyIGNxcnMgPSBhd2FpdCBlbnRpdHlDcXJzKHJlcXVpcmUoJy4vY29uZmlnLlJlc291cmNlJyksIHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkfSlcbiAgICAgIHZhciB1c2VyRGF0YSA9IGF1dGhvcml6ZSh7YWN0aW9uOiAnd3JpdGUuZGVsZXRlJywgZW50aXR5TmFtZTogJ1Jlc291cmNlJywgbWV0YSwgZGF0YSwgaWR9KVxuICAgICAgdmFyIGFkZGVkTXV0YXRpb24gPSBhd2FpdCBjcXJzLm11dGF0aW9uc1BhY2thZ2UubXV0YXRlKHtkYXRhLCBvYmpJZDogaWQsIG11dGF0aW9uOiAnZGVsZXRlJywgdXNlckRhdGF9KVxuICAgICAgY3Fycy52aWV3c1BhY2thZ2UucmVmcmVzaFZpZXdzKHtvYmpJZHM6IFtpZF0sIGxvYWRTbmFwc2hvdDogdHJ1ZSwgbG9hZE11dGF0aW9uczogdHJ1ZSwgYWRkTXV0YXRpb25zOiBbYWRkZWRNdXRhdGlvbl19KS50aGVuKCh2aWV3cykgPT4ge1xuICAgICAgICBuZXRDbGllbnRQYWNrYWdlLmVtaXQoJ3ZpZXdzVXBkYXRlZCcsIHZpZXdzKVxuICAgICAgfSlcbiAgICAgIHJldHVybiB2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlKCdkZWxldGVSZXNvdXJjZScsIHtpZH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIExPRy53YXJuKCdwcm9ibGVtcyBkdXJpbmcgZGVsZXRlJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGRlbGV0ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHJlYWRSZXNvdXJjZSAoe2RhdGEsIGlkfSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cuZGVidWcoYHN0YXJ0IHJlYWRSZXNvdXJjZSgpYCwge2RhdGEsIGlkfSwgbWV0YSlcbiAgICAgIHZhbGlkYXRlTWV0aG9kUmVxdWVzdCgncmVhZFJlc291cmNlJywge2RhdGEsIGlkfSwgbWV0YSlcbiAgICAgIGlkID0gaWQgfHwgZGF0YS5faWRcbiAgICAgIHZhciBjcXJzID0gYXdhaXQgZW50aXR5Q3FycyhyZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZScpLCB7c2VydmljZU5hbWUsIHNlcnZpY2VJZH0pXG4gICAgICB2YXIgdmlld3NSZXN1bHQgPSBhd2FpdCBjcXJzLnZpZXdzUGFja2FnZS5nZXQoe2lkczogW2lkXX0pXG4gICAgICBMT0cuZGVidWcoYHJlYWRSZXNvdXJjZSB2aWV3c1Jlc3VsdGAsIHZpZXdzUmVzdWx0KVxuICAgICAgaWYgKHZpZXdzUmVzdWx0Lmxlbmd0aCAhPT0gMSkgdGhyb3cgYGlkOiAke2lkfSBJdGVtIE5vdCBGb3VuZGVkYFxuICAgICAgdmFyIHVzZXJEYXRhID0gYXV0aG9yaXplKHthY3Rpb246ICdyZWFkJywgZW50aXR5TmFtZTogJ1Jlc291cmNlJywgbWV0YSwgZGF0YSwgaWR9KVxuICAgICAgcmV0dXJuIHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UoJ3JlYWRSZXNvdXJjZScsIHZpZXdzUmVzdWx0WzBdKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMT0cud2FybigncHJvYmxlbXMgZHVyaW5nIHJlYWQnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgcmVhZCcsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIGxpc3RSZXNvdXJjZXMgKHtwYWdlPTEsIHRpbWVzdGFtcCwgcGFnZUl0ZW1zID0gMTAsIGNoZWNrc3VtT25seSA9IGZhbHNlLCBpZElufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cuZGVidWcoYHN0YXJ0IGxpc3RSZXNvdXJjZXMoKWAsIHtwYWdlLCB0aW1lc3RhbXB9LCBtZXRhKVxuICAgICAgdmFsaWRhdGVNZXRob2RSZXF1ZXN0KCdsaXN0UmVzb3VyY2VzJywge3BhZ2UsIHRpbWVzdGFtcH0sIG1ldGEpXG4gICAgICB2YXIgY3FycyA9IGF3YWl0IGVudGl0eUNxcnMocmVxdWlyZSgnLi9jb25maWcuUmVzb3VyY2UnKSwge3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWR9KVxuICAgICAgdmFyIGZpZWxkcyA9IChjaGVja3N1bU9ubHkpID8geyBfdmlld0hhc2g6IDEgfSA6IG51bGxcbiAgICAgIHZhciBxdWVyeSA9IHt9XG4gICAgICBpZiAodGltZXN0YW1wKXF1ZXJ5Ll92aWV3QnVpbGRlZCA9IHskbHQ6IHRpbWVzdGFtcH1cbiAgICAgIGlmIChpZEluKXF1ZXJ5Ll9pZCA9IHskaW46IGlkSW59XG4gICAgICB2YXIgdmlld3MgPSBhd2FpdCBjcXJzLnZpZXdzUGFja2FnZS5maW5kKHtxdWVyeSwgbGltaXQ6IHBhZ2VJdGVtcywgc3RhcnQ6IChwYWdlIC0gMSkgKiBwYWdlSXRlbXMsIGZpZWxkc30pXG4gICAgICBMT0cuZGVidWcoYGxpc3RSZXNvdXJjZXMgcmVzcG9uc2VgLCB7dmlld3N9KVxuICAgICAgcmV0dXJuIHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UoJ2xpc3RSZXNvdXJjZXMnLCB2aWV3cylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTE9HLndhcm4oJ3Byb2JsZW1zIGR1cmluZyBsaXN0UmVzb3VyY2VzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGxpc3RSZXNvdXJjZXMnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH1cbn1cbiJdfQ==