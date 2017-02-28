'use strict';

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

function authorize(data) {
  var results;
  return regeneratorRuntime.async(function authorize$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(netClientPackage.emit('authorize', data, data.meta));

        case 2:
          results = _context3.sent;

          if (!results) errorThrow('not authorized');
          return _context3.abrupt('return', results);

        case 5:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
}

module.exports = {
  createResource: function createResource(_ref, meta) {
    var data = _ref.data,
        id = _ref.id,
        userId = _ref.userId,
        token = _ref.token;
    var cqrs, addedMutation, response;
    return regeneratorRuntime.async(function createResource$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            LOG.profile('createResource');
            LOG.debug('start createResource() requestId:' + meta.requestId, { data: data, id: id, meta: meta });
            _context4.next = 5;
            return regeneratorRuntime.awrap(validateMethodRequest('createResource', { data: data, id: id, userId: userId, token: token }));

          case 5:
            data._id = id = id || data._id || uuidV4(); // generate id if necessary
            _context4.next = 8;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId }));

          case 8:
            cqrs = _context4.sent;
            _context4.next = 11;
            return regeneratorRuntime.awrap(authorize({ action: 'write.create', entityName: 'Resource', meta: meta, data: data, id: id }));

          case 11:
            _context4.next = 13;
            return regeneratorRuntime.awrap(cqrs.mutationsPackage.mutate({ data: data, objId: id, mutation: 'create', meta: meta }));

          case 13:
            addedMutation = _context4.sent;

            // REFRESH VIEWS
            cqrs.viewsPackage.refreshViews({ objIds: [id], loadSnapshot: false, loadMutations: false, addMutations: [addedMutation] }).then(function (views) {
              netClientPackage.emit('viewsUpdated', views, meta);
            });
            _context4.next = 17;
            return regeneratorRuntime.awrap(validateMethodResponse('createResource', { id: id }));

          case 17:
            response = _context4.sent;

            LOG.profileEnd('createResource');
            return _context4.abrupt('return', response);

          case 22:
            _context4.prev = 22;
            _context4.t0 = _context4['catch'](0);

            LOG.warn('problems during create', _context4.t0);
            return _context4.abrupt('return', { error: 'problems during create', originalError: _context4.t0 });

          case 26:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, this, [[0, 22]]);
  },
  updateResource: function updateResource(_ref2, meta) {
    var data = _ref2.data,
        id = _ref2.id,
        userId = _ref2.userId,
        token = _ref2.token;
    var cqrs, addedMutation;
    return regeneratorRuntime.async(function updateResource$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;

            LOG.debug('start updateResource() requestId:' + meta.requestId, { data: data, id: id, meta: meta });
            _context5.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('updateResource', { data: data, id: id, userId: userId, token: token }));

          case 4:
            data._id = id = id || data._id;
            _context5.next = 7;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId }));

          case 7:
            cqrs = _context5.sent;
            _context5.next = 10;
            return regeneratorRuntime.awrap(authorize({ action: 'write.update', entityName: 'Resource', meta: meta, data: data, id: id }));

          case 10:
            _context5.next = 12;
            return regeneratorRuntime.awrap(cqrs.mutationsPackage.mutate({ data: data, objId: id, mutation: 'update', meta: meta }));

          case 12:
            addedMutation = _context5.sent;

            cqrs.viewsPackage.refreshViews({ objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation] }).then(function (views) {
              netClientPackage.emit('viewsUpdated', views, meta);
            });
            _context5.next = 16;
            return regeneratorRuntime.awrap(validateMethodResponse('updateResource', { id: id }));

          case 16:
            return _context5.abrupt('return', _context5.sent);

          case 19:
            _context5.prev = 19;
            _context5.t0 = _context5['catch'](0);

            LOG.warn('problems during update', _context5.t0);
            return _context5.abrupt('return', { error: 'problems during update', originalError: _context5.t0 });

          case 23:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, this, [[0, 19]]);
  },
  deleteResource: function deleteResource(_ref3, meta) {
    var id = _ref3.id,
        userId = _ref3.userId,
        token = _ref3.token;
    var cqrs, addedMutation;
    return regeneratorRuntime.async(function deleteResource$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;

            LOG.debug('start deleteResource() requestId:' + meta.requestId, { id: id, meta: meta });
            _context6.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('deleteResource', { id: id, userId: userId, token: token }));

          case 4:
            _context6.next = 6;
            return regeneratorRuntime.awrap(authorize({ action: 'write.delete', entityName: 'Resource', meta: meta, id: id }));

          case 6:
            _context6.next = 8;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId }));

          case 8:
            cqrs = _context6.sent;
            _context6.next = 11;
            return regeneratorRuntime.awrap(cqrs.mutationsPackage.mutate({ objId: id, mutation: 'delete', meta: meta }));

          case 11:
            addedMutation = _context6.sent;

            cqrs.viewsPackage.refreshViews({ objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation] }).then(function (views) {
              netClientPackage.emit('viewsUpdated', views, meta);
            });
            _context6.next = 15;
            return regeneratorRuntime.awrap(validateMethodResponse('deleteResource', { id: id }));

          case 15:
            return _context6.abrupt('return', _context6.sent);

          case 18:
            _context6.prev = 18;
            _context6.t0 = _context6['catch'](0);

            LOG.warn('problems during delete', _context6.t0);
            return _context6.abrupt('return', { error: 'problems during delete', originalError: _context6.t0 });

          case 22:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, this, [[0, 18]]);
  },
  readResource: function readResource(_ref4, meta) {
    var id = _ref4.id,
        userId = _ref4.userId,
        token = _ref4.token;
    var cqrs, viewsResult;
    return regeneratorRuntime.async(function readResource$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;

            LOG.debug('start readResource() requestId:' + meta.requestId, { id: id, meta: meta });
            _context7.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('readResource', { id: id, userId: userId, token: token }));

          case 4:
            _context7.next = 6;
            return regeneratorRuntime.awrap(authorize({ action: 'read', entityName: 'Resource', meta: meta, id: id }));

          case 6:
            _context7.next = 8;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId }));

          case 8:
            cqrs = _context7.sent;
            _context7.next = 11;
            return regeneratorRuntime.awrap(cqrs.viewsPackage.get({ ids: [id] }));

          case 11:
            viewsResult = _context7.sent;

            LOG.debug('readResource viewsResult', viewsResult);

            if (!(viewsResult.length !== 1)) {
              _context7.next = 15;
              break;
            }

            throw 'id: ' + id + ' Item Not Founded';

          case 15:
            _context7.next = 17;
            return regeneratorRuntime.awrap(validateMethodResponse('readResource', viewsResult[0]));

          case 17:
            return _context7.abrupt('return', _context7.sent);

          case 20:
            _context7.prev = 20;
            _context7.t0 = _context7['catch'](0);

            LOG.warn('problems during read', _context7.t0);
            return _context7.abrupt('return', { error: 'problems during read', originalError: _context7.t0 });

          case 24:
          case 'end':
            return _context7.stop();
        }
      }
    }, null, this, [[0, 20]]);
  },

  // PRIVATE
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
    return regeneratorRuntime.async(function listResources$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;

            LOG.debug('start listResources() requestId:' + meta.requestId, { page: page, timestamp: timestamp }, meta);
            _context8.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('listResources', { page: page, timestamp: timestamp }, meta));

          case 4:
            _context8.next = 6;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId }));

          case 6:
            cqrs = _context8.sent;
            fields = checksumOnly ? { _viewHash: 1 } : null;
            query = {};

            if (timestamp) query._viewBuilded = { $lt: timestamp };
            if (idIn) query._id = { $in: idIn };
            _context8.next = 13;
            return regeneratorRuntime.awrap(cqrs.viewsPackage.find({ query: query, limit: pageItems, start: (page - 1) * pageItems, fields: fields }));

          case 13:
            views = _context8.sent;

            LOG.debug('listResources response', { views: views });
            _context8.next = 17;
            return regeneratorRuntime.awrap(validateMethodResponse('listResources', views));

          case 17:
            return _context8.abrupt('return', _context8.sent);

          case 20:
            _context8.prev = 20;
            _context8.t0 = _context8['catch'](0);

            LOG.warn('problems during listResources', _context8.t0);
            return _context8.abrupt('return', { error: 'problems during listResources', originalError: _context8.t0 });

          case 24:
          case 'end':
            return _context8.stop();
        }
      }
    }, null, this, [[0, 20]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImVudGl0eUNxcnMiLCJyZXF1aXJlIiwiamVzdXMiLCJ1dWlkVjQiLCJuZXRDbGllbnQiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsIlBBQ0tBR0UiLCJMT0ciLCJlcnJvclRocm93IiwidmFsaWRhdGVNZXRob2RSZXF1ZXN0IiwibWV0aG9kTmFtZSIsImRhdGEiLCJ2YWxpZGF0ZU1ldGhvZEZyb21Db25maWciLCJ2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlIiwibmV0Q2xpZW50UGFja2FnZSIsImF1dGhvcml6ZSIsImVtaXQiLCJtZXRhIiwicmVzdWx0cyIsIm1vZHVsZSIsImV4cG9ydHMiLCJjcmVhdGVSZXNvdXJjZSIsImlkIiwidXNlcklkIiwidG9rZW4iLCJwcm9maWxlIiwiZGVidWciLCJyZXF1ZXN0SWQiLCJfaWQiLCJjcXJzIiwiYWN0aW9uIiwiZW50aXR5TmFtZSIsIm11dGF0aW9uc1BhY2thZ2UiLCJtdXRhdGUiLCJvYmpJZCIsIm11dGF0aW9uIiwiYWRkZWRNdXRhdGlvbiIsInZpZXdzUGFja2FnZSIsInJlZnJlc2hWaWV3cyIsIm9iaklkcyIsImxvYWRTbmFwc2hvdCIsImxvYWRNdXRhdGlvbnMiLCJhZGRNdXRhdGlvbnMiLCJ0aGVuIiwidmlld3MiLCJyZXNwb25zZSIsInByb2ZpbGVFbmQiLCJ3YXJuIiwiZXJyb3IiLCJvcmlnaW5hbEVycm9yIiwidXBkYXRlUmVzb3VyY2UiLCJkZWxldGVSZXNvdXJjZSIsInJlYWRSZXNvdXJjZSIsImdldCIsImlkcyIsInZpZXdzUmVzdWx0IiwibGVuZ3RoIiwibGlzdFJlc291cmNlcyIsInBhZ2UiLCJ0aW1lc3RhbXAiLCJwYWdlSXRlbXMiLCJjaGVja3N1bU9ubHkiLCJpZEluIiwiZmllbGRzIiwiX3ZpZXdIYXNoIiwicXVlcnkiLCJfdmlld0J1aWxkZWQiLCIkbHQiLCIkaW4iLCJmaW5k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LENBQVMsK0JBQVQ7QUFwRlcsOENBcUZKLEVBQUNDLE9BQU8sK0JBQVIsRUFBeUNDLDJCQUF6QyxFQXJGSTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6Im1ldGhvZHMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVudGl0eUNxcnMgPSByZXF1aXJlKCcuLi8uLi8uLi9lbnRpdHkuY3FycycpXG52YXIgamVzdXMgPSByZXF1aXJlKCcuLi8uLi8uLi9qZXN1cycpXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcbmNvbnN0IG5ldENsaWVudCA9IHJlcXVpcmUoJy4uLy4uLy4uL25ldC5jbGllbnQnKVxuXG52YXIgc2VydmljZU5hbWUgPSByZXF1aXJlKCcuL2NvbmZpZycpLnNlcnZpY2VOYW1lXG52YXIgc2VydmljZUlkID0gcmVxdWlyZSgnLi9zZXJ2aWNlSWQuanNvbicpXG52YXIgZ2V0U2hhcmVkQ29uZmlnID0gamVzdXMuZ2V0U2hhcmVkQ29uZmlnKHJlcXVpcmUoJy4vY29uZmlnJykuc2hhcmVkU2VydmljZXNQYXRoKVxuXG5jb25zdCBQQUNLQUdFID0gJ21ldGhvZHMnXG52YXIgTE9HID0gamVzdXMuTE9HKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG52YXIgZXJyb3JUaHJvdyA9IGplc3VzLmVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcblxuY29uc3QgdmFsaWRhdGVNZXRob2RSZXF1ZXN0ID0gYXN5bmMgKG1ldGhvZE5hbWUsIGRhdGEpID0+IGplc3VzLnZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdtZXRob2RzJyksIG1ldGhvZE5hbWUsIGRhdGEsICdyZXF1ZXN0U2NoZW1hJylcbmNvbnN0IHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UgPSBhc3luYyAobWV0aG9kTmFtZSwgZGF0YSkgPT4gamVzdXMudmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ21ldGhvZHMnKSwgbWV0aG9kTmFtZSwgZGF0YSwgJ3Jlc3BvbnNlU2NoZW1hJylcblxudmFyIG5ldENsaWVudFBhY2thZ2UgPSBuZXRDbGllbnQoe2dldFNoYXJlZENvbmZpZywgc2VydmljZU5hbWUsIHNlcnZpY2VJZH0pXG5cbmFzeW5jIGZ1bmN0aW9uIGF1dGhvcml6ZSAoZGF0YSkge1xuICB2YXIgcmVzdWx0cyA9IGF3YWl0IG5ldENsaWVudFBhY2thZ2UuZW1pdCgnYXV0aG9yaXplJywgZGF0YSwgZGF0YS5tZXRhKVxuICBpZiAoIXJlc3VsdHMpIGVycm9yVGhyb3coYG5vdCBhdXRob3JpemVkYClcbiAgcmV0dXJuIHJlc3VsdHNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzeW5jICBjcmVhdGVSZXNvdXJjZSAoe2RhdGEsIGlkLCB1c2VySWQsIHRva2VufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cucHJvZmlsZSgnY3JlYXRlUmVzb3VyY2UnKVxuICAgICAgTE9HLmRlYnVnKGBzdGFydCBjcmVhdGVSZXNvdXJjZSgpIHJlcXVlc3RJZDpgICsgbWV0YS5yZXF1ZXN0SWQsIHtkYXRhLCBpZCwgbWV0YX0pXG4gICAgICBhd2FpdCB2YWxpZGF0ZU1ldGhvZFJlcXVlc3QoJ2NyZWF0ZVJlc291cmNlJywge2RhdGEsIGlkLCB1c2VySWQsIHRva2VufSlcbiAgICAgIGRhdGEuX2lkID0gaWQgPSBpZCB8fCBkYXRhLl9pZCB8fCB1dWlkVjQoKSAvLyBnZW5lcmF0ZSBpZCBpZiBuZWNlc3NhcnlcbiAgICAgIHZhciBjcXJzID0gYXdhaXQgZW50aXR5Q3FycyhyZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZScpLCB7c2VydmljZU5hbWUsIHNlcnZpY2VJZH0pXG4gICAgICBhd2FpdCBhdXRob3JpemUoe2FjdGlvbjogJ3dyaXRlLmNyZWF0ZScsIGVudGl0eU5hbWU6ICdSZXNvdXJjZScsIG1ldGEsIGRhdGEsIGlkfSlcbiAgICAgIHZhciBhZGRlZE11dGF0aW9uID0gYXdhaXQgY3Fycy5tdXRhdGlvbnNQYWNrYWdlLm11dGF0ZSh7ZGF0YSwgb2JqSWQ6IGlkLCBtdXRhdGlvbjogJ2NyZWF0ZScsIG1ldGF9KVxuICAgICAgLy8gUkVGUkVTSCBWSUVXU1xuICAgICAgY3Fycy52aWV3c1BhY2thZ2UucmVmcmVzaFZpZXdzKHtvYmpJZHM6IFtpZF0sIGxvYWRTbmFwc2hvdDogZmFsc2UsIGxvYWRNdXRhdGlvbnM6IGZhbHNlLCBhZGRNdXRhdGlvbnM6IFthZGRlZE11dGF0aW9uXX0pLnRoZW4oKHZpZXdzKSA9PiB7XG4gICAgICAgIG5ldENsaWVudFBhY2thZ2UuZW1pdCgndmlld3NVcGRhdGVkJywgdmlld3MsIG1ldGEpXG4gICAgICB9KVxuICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgdmFsaWRhdGVNZXRob2RSZXNwb25zZSgnY3JlYXRlUmVzb3VyY2UnLCB7aWR9KVxuICAgICAgTE9HLnByb2ZpbGVFbmQoJ2NyZWF0ZVJlc291cmNlJylcbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMT0cud2FybigncHJvYmxlbXMgZHVyaW5nIGNyZWF0ZScsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBjcmVhdGUnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICB1cGRhdGVSZXNvdXJjZSAoe2RhdGEsIGlkLCB1c2VySWQsIHRva2VufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cuZGVidWcoYHN0YXJ0IHVwZGF0ZVJlc291cmNlKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwge2RhdGEsIGlkLCBtZXRhfSlcbiAgICAgIGF3YWl0IHZhbGlkYXRlTWV0aG9kUmVxdWVzdCgndXBkYXRlUmVzb3VyY2UnLCB7ZGF0YSwgaWQsIHVzZXJJZCwgdG9rZW59KVxuICAgICAgZGF0YS5faWQgPSBpZCA9IGlkIHx8IGRhdGEuX2lkXG4gICAgICB2YXIgY3FycyA9IGF3YWl0IGVudGl0eUNxcnMocmVxdWlyZSgnLi9jb25maWcuUmVzb3VyY2UnKSwge3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWR9KVxuICAgICAgYXdhaXQgYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS51cGRhdGUnLCBlbnRpdHlOYW1lOiAnUmVzb3VyY2UnLCBtZXRhLCBkYXRhLCBpZH0pXG4gICAgICB2YXIgYWRkZWRNdXRhdGlvbiA9IGF3YWl0IGNxcnMubXV0YXRpb25zUGFja2FnZS5tdXRhdGUoe2RhdGEsIG9iaklkOiBpZCwgbXV0YXRpb246ICd1cGRhdGUnLCBtZXRhfSlcbiAgICAgIGNxcnMudmlld3NQYWNrYWdlLnJlZnJlc2hWaWV3cyh7b2JqSWRzOiBbaWRdLCBsb2FkU25hcHNob3Q6IHRydWUsIGxvYWRNdXRhdGlvbnM6IHRydWUsIGFkZE11dGF0aW9uczogW2FkZGVkTXV0YXRpb25dfSkudGhlbigodmlld3MpID0+IHtcbiAgICAgICAgbmV0Q2xpZW50UGFja2FnZS5lbWl0KCd2aWV3c1VwZGF0ZWQnLCB2aWV3cywgbWV0YSlcbiAgICAgIH0pXG4gICAgICByZXR1cm4gYXdhaXQgdmFsaWRhdGVNZXRob2RSZXNwb25zZSgndXBkYXRlUmVzb3VyY2UnLCB7aWR9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMT0cud2FybigncHJvYmxlbXMgZHVyaW5nIHVwZGF0ZScsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyB1cGRhdGUnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICBkZWxldGVSZXNvdXJjZSAoe2lkLCB1c2VySWQsIHRva2VufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cuZGVidWcoYHN0YXJ0IGRlbGV0ZVJlc291cmNlKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwge2lkLCBtZXRhfSlcbiAgICAgIGF3YWl0IHZhbGlkYXRlTWV0aG9kUmVxdWVzdCgnZGVsZXRlUmVzb3VyY2UnLCB7aWQsIHVzZXJJZCwgdG9rZW59KVxuICAgICAgYXdhaXQgYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS5kZWxldGUnLCBlbnRpdHlOYW1lOiAnUmVzb3VyY2UnLCBtZXRhLCBpZH0pXG4gICAgICB2YXIgY3FycyA9IGF3YWl0IGVudGl0eUNxcnMocmVxdWlyZSgnLi9jb25maWcuUmVzb3VyY2UnKSwge3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWR9KVxuICAgICAgdmFyIGFkZGVkTXV0YXRpb24gPSBhd2FpdCBjcXJzLm11dGF0aW9uc1BhY2thZ2UubXV0YXRlKHsgb2JqSWQ6IGlkLCBtdXRhdGlvbjogJ2RlbGV0ZScsIG1ldGF9KVxuICAgICAgY3Fycy52aWV3c1BhY2thZ2UucmVmcmVzaFZpZXdzKHtvYmpJZHM6IFtpZF0sIGxvYWRTbmFwc2hvdDogdHJ1ZSwgbG9hZE11dGF0aW9uczogdHJ1ZSwgYWRkTXV0YXRpb25zOiBbYWRkZWRNdXRhdGlvbl19KS50aGVuKCh2aWV3cykgPT4ge1xuICAgICAgICBuZXRDbGllbnRQYWNrYWdlLmVtaXQoJ3ZpZXdzVXBkYXRlZCcsIHZpZXdzLCBtZXRhKVxuICAgICAgfSlcbiAgICAgIHJldHVybiBhd2FpdCB2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlKCdkZWxldGVSZXNvdXJjZScsIHtpZH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIExPRy53YXJuKCdwcm9ibGVtcyBkdXJpbmcgZGVsZXRlJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGRlbGV0ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHJlYWRSZXNvdXJjZSAoe2lkLCB1c2VySWQsIHRva2VufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cuZGVidWcoYHN0YXJ0IHJlYWRSZXNvdXJjZSgpIHJlcXVlc3RJZDpgICsgbWV0YS5yZXF1ZXN0SWQsIHtpZCwgbWV0YX0pXG4gICAgICBhd2FpdCB2YWxpZGF0ZU1ldGhvZFJlcXVlc3QoJ3JlYWRSZXNvdXJjZScsIHtpZCwgdXNlcklkLCB0b2tlbn0pXG4gICAgICBhd2FpdCBhdXRob3JpemUoe2FjdGlvbjogJ3JlYWQnLCBlbnRpdHlOYW1lOiAnUmVzb3VyY2UnLCBtZXRhLCBpZH0pXG4gICAgICB2YXIgY3FycyA9IGF3YWl0IGVudGl0eUNxcnMocmVxdWlyZSgnLi9jb25maWcuUmVzb3VyY2UnKSwge3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWR9KVxuICAgICAgdmFyIHZpZXdzUmVzdWx0ID0gYXdhaXQgY3Fycy52aWV3c1BhY2thZ2UuZ2V0KHtpZHM6IFtpZF19KVxuICAgICAgTE9HLmRlYnVnKGByZWFkUmVzb3VyY2Ugdmlld3NSZXN1bHRgLCB2aWV3c1Jlc3VsdClcbiAgICAgIGlmICh2aWV3c1Jlc3VsdC5sZW5ndGggIT09IDEpIHRocm93IGBpZDogJHtpZH0gSXRlbSBOb3QgRm91bmRlZGBcbiAgICAgIHJldHVybiBhd2FpdCB2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlKCdyZWFkUmVzb3VyY2UnLCB2aWV3c1Jlc3VsdFswXSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTE9HLndhcm4oJ3Byb2JsZW1zIGR1cmluZyByZWFkJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHJlYWQnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIC8vIFBSSVZBVEVcbiAgYXN5bmMgIGxpc3RSZXNvdXJjZXMgKHtwYWdlID0gMSwgdGltZXN0YW1wLCBwYWdlSXRlbXMgPSAxMCwgY2hlY2tzdW1Pbmx5ID0gZmFsc2UsIGlkSW59LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIExPRy5kZWJ1Zyhgc3RhcnQgbGlzdFJlc291cmNlcygpIHJlcXVlc3RJZDpgICsgbWV0YS5yZXF1ZXN0SWQsIHtwYWdlLCB0aW1lc3RhbXB9LCBtZXRhKVxuICAgICAgYXdhaXQgdmFsaWRhdGVNZXRob2RSZXF1ZXN0KCdsaXN0UmVzb3VyY2VzJywge3BhZ2UsIHRpbWVzdGFtcH0sIG1ldGEpXG4gICAgICB2YXIgY3FycyA9IGF3YWl0IGVudGl0eUNxcnMocmVxdWlyZSgnLi9jb25maWcuUmVzb3VyY2UnKSwge3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWR9KVxuICAgICAgdmFyIGZpZWxkcyA9IChjaGVja3N1bU9ubHkpID8geyBfdmlld0hhc2g6IDEgfSA6IG51bGxcbiAgICAgIHZhciBxdWVyeSA9IHt9XG4gICAgICBpZiAodGltZXN0YW1wKXF1ZXJ5Ll92aWV3QnVpbGRlZCA9IHskbHQ6IHRpbWVzdGFtcH1cbiAgICAgIGlmIChpZEluKXF1ZXJ5Ll9pZCA9IHskaW46IGlkSW59XG4gICAgICB2YXIgdmlld3MgPSBhd2FpdCBjcXJzLnZpZXdzUGFja2FnZS5maW5kKHtxdWVyeSwgbGltaXQ6IHBhZ2VJdGVtcywgc3RhcnQ6IChwYWdlIC0gMSkgKiBwYWdlSXRlbXMsIGZpZWxkc30pXG4gICAgICBMT0cuZGVidWcoYGxpc3RSZXNvdXJjZXMgcmVzcG9uc2VgLCB7dmlld3N9KVxuICAgICAgcmV0dXJuIGF3YWl0IHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UoJ2xpc3RSZXNvdXJjZXMnLCB2aWV3cylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTE9HLndhcm4oJ3Byb2JsZW1zIGR1cmluZyBsaXN0UmVzb3VyY2VzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGxpc3RSZXNvdXJjZXMnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH1cbn1cbiJdfQ==