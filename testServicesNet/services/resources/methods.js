'use strict';

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

            CONSOLE.debug('start createResource() requestId:' + meta.requestId, { data: data, id: id, meta: meta });
            _context4.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('createResource', { data: data, id: id, userId: userId, token: token }));

          case 4:
            data._id = id = id || data._id || uuidV4(); // generate id if necessary
            _context4.next = 7;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId, getConsole: getConsole }));

          case 7:
            cqrs = _context4.sent;
            _context4.next = 10;
            return regeneratorRuntime.awrap(authorize({ action: 'write.create', entityName: 'Resource', meta: meta, data: data, id: id }));

          case 10:
            _context4.next = 12;
            return regeneratorRuntime.awrap(cqrs.mutationsPackage.mutate({ data: data, objId: id, mutation: 'create', meta: meta }));

          case 12:
            addedMutation = _context4.sent;

            // REFRESH VIEWS
            cqrs.viewsPackage.refreshViews({ objIds: [id], loadSnapshot: false, loadMutations: false, addMutations: [addedMutation] }).then(function (views) {
              netClientPackage.emit('mainViewsUpdated', views, meta);
            });
            _context4.next = 16;
            return regeneratorRuntime.awrap(validateMethodResponse('createResource', { id: id }));

          case 16:
            response = _context4.sent;
            return _context4.abrupt('return', response);

          case 20:
            _context4.prev = 20;
            _context4.t0 = _context4['catch'](0);

            CONSOLE.warn('problems during create', _context4.t0);
            return _context4.abrupt('return', { error: 'problems during create', originalError: _context4.t0 });

          case 24:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, this, [[0, 20]]);
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

            CONSOLE.debug('start updateResource() requestId:' + meta.requestId, { data: data, id: id, meta: meta });
            _context5.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('updateResource', { data: data, id: id, userId: userId, token: token }));

          case 4:
            data._id = id = id || data._id;
            _context5.next = 7;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId, getConsole: getConsole }));

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
              netClientPackage.emit('mainViewsUpdated', views, meta);
            });
            _context5.next = 16;
            return regeneratorRuntime.awrap(validateMethodResponse('updateResource', { id: id }));

          case 16:
            return _context5.abrupt('return', _context5.sent);

          case 19:
            _context5.prev = 19;
            _context5.t0 = _context5['catch'](0);

            CONSOLE.warn('problems during update', _context5.t0);
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

            CONSOLE.debug('start deleteResource() requestId:' + meta.requestId, { id: id, meta: meta });
            _context6.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('deleteResource', { id: id, userId: userId, token: token }));

          case 4:
            _context6.next = 6;
            return regeneratorRuntime.awrap(authorize({ action: 'write.delete', entityName: 'Resource', meta: meta, id: id }));

          case 6:
            _context6.next = 8;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId, getConsole: getConsole }));

          case 8:
            cqrs = _context6.sent;
            _context6.next = 11;
            return regeneratorRuntime.awrap(cqrs.mutationsPackage.mutate({ objId: id, mutation: 'delete', meta: meta }));

          case 11:
            addedMutation = _context6.sent;

            cqrs.viewsPackage.refreshViews({ objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation] }).then(function (views) {
              netClientPackage.emit('mainViewsUpdated', views, meta);
            });
            _context6.next = 15;
            return regeneratorRuntime.awrap(validateMethodResponse('deleteResource', { id: id }));

          case 15:
            return _context6.abrupt('return', _context6.sent);

          case 18:
            _context6.prev = 18;
            _context6.t0 = _context6['catch'](0);

            CONSOLE.warn('problems during delete', _context6.t0);
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

            CONSOLE.debug('start readResource() requestId:' + meta.requestId, { id: id, meta: meta });
            _context7.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('readResource', { id: id, userId: userId, token: token }));

          case 4:
            _context7.next = 6;
            return regeneratorRuntime.awrap(authorize({ action: 'read', entityName: 'Resource', meta: meta, id: id }));

          case 6:
            _context7.next = 8;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId, getConsole: getConsole }));

          case 8:
            cqrs = _context7.sent;
            _context7.next = 11;
            return regeneratorRuntime.awrap(cqrs.viewsPackage.get({ ids: [id] }));

          case 11:
            viewsResult = _context7.sent;

            CONSOLE.debug('readResource viewsResult', viewsResult);

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

            CONSOLE.warn('problems during read', _context7.t0);
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

            CONSOLE.debug('start listResources() requestId:' + meta.requestId, { page: page, timestamp: timestamp }, meta);
            _context8.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('listResources', { page: page, timestamp: timestamp }, meta));

          case 4:
            _context8.next = 6;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.Resource'), { serviceName: serviceName, serviceId: serviceId, getConsole: getConsole }));

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

            CONSOLE.debug('listResources response', { views: views });
            _context8.next = 17;
            return regeneratorRuntime.awrap(validateMethodResponse('listResources', views));

          case 17:
            return _context8.abrupt('return', _context8.sent);

          case 20:
            _context8.prev = 20;
            _context8.t0 = _context8['catch'](0);

            CONSOLE.warn('problems during listResources', _context8.t0);
            return _context8.abrupt('return', { error: 'problems during listResources', originalError: _context8.t0 });

          case 24:
          case 'end':
            return _context8.stop();
        }
      }
    }, null, this, [[0, 20]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImVudGl0eUNxcnMiLCJyZXF1aXJlIiwiamVzdXMiLCJ1dWlkVjQiLCJuZXRDbGllbnQiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIlBBQ0tBR0UiLCJDT05TT0xFIiwiZXJyb3JUaHJvdyIsInZhbGlkYXRlTWV0aG9kUmVxdWVzdCIsIm1ldGhvZE5hbWUiLCJkYXRhIiwidmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIiwidmFsaWRhdGVNZXRob2RSZXNwb25zZSIsIm5ldENsaWVudFBhY2thZ2UiLCJhdXRob3JpemUiLCJlbWl0IiwibWV0YSIsInJlc3VsdHMiLCJtb2R1bGUiLCJleHBvcnRzIiwiY3JlYXRlUmVzb3VyY2UiLCJpZCIsInVzZXJJZCIsInRva2VuIiwiZGVidWciLCJyZXF1ZXN0SWQiLCJfaWQiLCJjcXJzIiwiYWN0aW9uIiwiZW50aXR5TmFtZSIsIm11dGF0aW9uc1BhY2thZ2UiLCJtdXRhdGUiLCJvYmpJZCIsIm11dGF0aW9uIiwiYWRkZWRNdXRhdGlvbiIsInZpZXdzUGFja2FnZSIsInJlZnJlc2hWaWV3cyIsIm9iaklkcyIsImxvYWRTbmFwc2hvdCIsImxvYWRNdXRhdGlvbnMiLCJhZGRNdXRhdGlvbnMiLCJ0aGVuIiwidmlld3MiLCJyZXNwb25zZSIsIndhcm4iLCJlcnJvciIsIm9yaWdpbmFsRXJyb3IiLCJ1cGRhdGVSZXNvdXJjZSIsImRlbGV0ZVJlc291cmNlIiwicmVhZFJlc291cmNlIiwiZ2V0IiwiaWRzIiwidmlld3NSZXN1bHQiLCJsZW5ndGgiLCJsaXN0UmVzb3VyY2VzIiwicGFnZSIsInRpbWVzdGFtcCIsInBhZ2VJdGVtcyIsImNoZWNrc3VtT25seSIsImlkSW4iLCJmaWVsZHMiLCJfdmlld0hhc2giLCJxdWVyeSIsIl92aWV3QnVpbGRlZCIsIiRsdCIs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eURHLGNBQXpELEVBQXZCLENBOUVQOztBQUFBO0FBOEVQbEIsaUJBOUVPOztBQStFWHBDLG9CQUFRa0IsS0FBUiwyQkFBd0MsRUFBQ2tCLFlBQUQsRUFBeEM7QUEvRVc7QUFBQSw0Q0FnRkU5Qix1QkFBdUIsZUFBdkIsRUFBd0M4QixLQUF4QyxDQWhGRjs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFrRlhwQyxvQkFBUXNDLElBQVIsQ0FBYSwrQkFBYjtBQWxGVyw4Q0FtRkosRUFBQ0MsT0FBTywrQkFBUixFQUF5Q0MsMkJBQXpDLEVBbkZJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibWV0aG9kcy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZW50aXR5Q3FycyA9IHJlcXVpcmUoJy4uLy4uLy4uL2VudGl0eS5jcXJzJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2plc3VzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxuY29uc3QgbmV0Q2xpZW50ID0gcmVxdWlyZSgnLi4vLi4vLi4vbmV0LmNsaWVudCcpXG5cbnZhciBzZXJ2aWNlTmFtZSA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2VydmljZU5hbWVcbnZhciBzZXJ2aWNlSWQgPSByZXF1aXJlKCcuL3NlcnZpY2VJZC5qc29uJylcbnZhciBnZXRTaGFyZWRDb25maWcgPSBqZXN1cy5nZXRTaGFyZWRDb25maWcocmVxdWlyZSgnLi9jb25maWcnKS5zaGFyZWRTZXJ2aWNlc1BhdGgpXG52YXIgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiBqZXN1cy5nZXRDb25zb2xlKHJlcXVpcmUoJy4vY29uZmlnJykuY29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcblxuY29uc3QgUEFDS0FHRSA9ICdtZXRob2RzJ1xudmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG52YXIgZXJyb3JUaHJvdyA9IGplc3VzLmVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcblxuY29uc3QgdmFsaWRhdGVNZXRob2RSZXF1ZXN0ID0gYXN5bmMgKG1ldGhvZE5hbWUsIGRhdGEpID0+IGplc3VzLnZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdtZXRob2RzJyksIG1ldGhvZE5hbWUsIGRhdGEsICdyZXF1ZXN0U2NoZW1hJylcbmNvbnN0IHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UgPSBhc3luYyAobWV0aG9kTmFtZSwgZGF0YSkgPT4gamVzdXMudmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ21ldGhvZHMnKSwgbWV0aG9kTmFtZSwgZGF0YSwgJ3Jlc3BvbnNlU2NoZW1hJylcblxudmFyIG5ldENsaWVudFBhY2thZ2UgPSBuZXRDbGllbnQoe2dldFNoYXJlZENvbmZpZywgc2VydmljZU5hbWUsIHNlcnZpY2VJZCxnZXRDb25zb2xlfSlcblxuYXN5bmMgZnVuY3Rpb24gYXV0aG9yaXplIChkYXRhKSB7XG4gIHZhciByZXN1bHRzID0gYXdhaXQgbmV0Q2xpZW50UGFja2FnZS5lbWl0KCdhdXRob3JpemUnLCBkYXRhLCBkYXRhLm1ldGEpXG4gIGlmICghcmVzdWx0cykgZXJyb3JUaHJvdyhgbm90IGF1dGhvcml6ZWRgKVxuICByZXR1cm4gcmVzdWx0c1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXN5bmMgIGNyZWF0ZVJlc291cmNlICh7ZGF0YSwgaWQsIHVzZXJJZCwgdG9rZW59LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIENPTlNPTEUuZGVidWcoYHN0YXJ0IGNyZWF0ZVJlc291cmNlKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwge2RhdGEsIGlkLCBtZXRhfSlcbiAgICAgIGF3YWl0IHZhbGlkYXRlTWV0aG9kUmVxdWVzdCgnY3JlYXRlUmVzb3VyY2UnLCB7ZGF0YSwgaWQsIHVzZXJJZCwgdG9rZW59KVxuICAgICAgZGF0YS5faWQgPSBpZCA9IGlkIHx8IGRhdGEuX2lkIHx8IHV1aWRWNCgpIC8vIGdlbmVyYXRlIGlkIGlmIG5lY2Vzc2FyeVxuICAgICAgdmFyIGNxcnMgPSBhd2FpdCBlbnRpdHlDcXJzKHJlcXVpcmUoJy4vY29uZmlnLlJlc291cmNlJyksIHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLGdldENvbnNvbGV9KVxuICAgICAgYXdhaXQgYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS5jcmVhdGUnLCBlbnRpdHlOYW1lOiAnUmVzb3VyY2UnLCBtZXRhLCBkYXRhLCBpZH0pXG4gICAgICB2YXIgYWRkZWRNdXRhdGlvbiA9IGF3YWl0IGNxcnMubXV0YXRpb25zUGFja2FnZS5tdXRhdGUoe2RhdGEsIG9iaklkOiBpZCwgbXV0YXRpb246ICdjcmVhdGUnLCBtZXRhfSlcbiAgICAgIC8vIFJFRlJFU0ggVklFV1NcbiAgICAgIGNxcnMudmlld3NQYWNrYWdlLnJlZnJlc2hWaWV3cyh7b2JqSWRzOiBbaWRdLCBsb2FkU25hcHNob3Q6IGZhbHNlLCBsb2FkTXV0YXRpb25zOiBmYWxzZSwgYWRkTXV0YXRpb25zOiBbYWRkZWRNdXRhdGlvbl19KS50aGVuKCh2aWV3cykgPT4ge1xuICAgICAgICBuZXRDbGllbnRQYWNrYWdlLmVtaXQoJ21haW5WaWV3c1VwZGF0ZWQnLCB2aWV3cywgbWV0YSlcbiAgICAgIH0pXG4gICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCB2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlKCdjcmVhdGVSZXNvdXJjZScsIHtpZH0pXG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgY3JlYXRlJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGNyZWF0ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHVwZGF0ZVJlc291cmNlICh7ZGF0YSwgaWQsIHVzZXJJZCwgdG9rZW59LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIENPTlNPTEUuZGVidWcoYHN0YXJ0IHVwZGF0ZVJlc291cmNlKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwge2RhdGEsIGlkLCBtZXRhfSlcbiAgICAgIGF3YWl0IHZhbGlkYXRlTWV0aG9kUmVxdWVzdCgndXBkYXRlUmVzb3VyY2UnLCB7ZGF0YSwgaWQsIHVzZXJJZCwgdG9rZW59KVxuICAgICAgZGF0YS5faWQgPSBpZCA9IGlkIHx8IGRhdGEuX2lkXG4gICAgICB2YXIgY3FycyA9IGF3YWl0IGVudGl0eUNxcnMocmVxdWlyZSgnLi9jb25maWcuUmVzb3VyY2UnKSwge3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsZ2V0Q29uc29sZX0pXG4gICAgICBhd2FpdCBhdXRob3JpemUoe2FjdGlvbjogJ3dyaXRlLnVwZGF0ZScsIGVudGl0eU5hbWU6ICdSZXNvdXJjZScsIG1ldGEsIGRhdGEsIGlkfSlcbiAgICAgIHZhciBhZGRlZE11dGF0aW9uID0gYXdhaXQgY3Fycy5tdXRhdGlvbnNQYWNrYWdlLm11dGF0ZSh7ZGF0YSwgb2JqSWQ6IGlkLCBtdXRhdGlvbjogJ3VwZGF0ZScsIG1ldGF9KVxuICAgICAgY3Fycy52aWV3c1BhY2thZ2UucmVmcmVzaFZpZXdzKHtvYmpJZHM6IFtpZF0sIGxvYWRTbmFwc2hvdDogdHJ1ZSwgbG9hZE11dGF0aW9uczogdHJ1ZSwgYWRkTXV0YXRpb25zOiBbYWRkZWRNdXRhdGlvbl19KS50aGVuKCh2aWV3cykgPT4ge1xuICAgICAgICBuZXRDbGllbnRQYWNrYWdlLmVtaXQoJ21haW5WaWV3c1VwZGF0ZWQnLCB2aWV3cywgbWV0YSlcbiAgICAgIH0pXG4gICAgICByZXR1cm4gYXdhaXQgdmFsaWRhdGVNZXRob2RSZXNwb25zZSgndXBkYXRlUmVzb3VyY2UnLCB7aWR9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDT05TT0xFLndhcm4oJ3Byb2JsZW1zIGR1cmluZyB1cGRhdGUnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgdXBkYXRlJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICBhc3luYyAgZGVsZXRlUmVzb3VyY2UgKHtpZCwgdXNlcklkLCB0b2tlbn0sIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgZGVsZXRlUmVzb3VyY2UoKSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkLCB7aWQsIG1ldGF9KVxuICAgICAgYXdhaXQgdmFsaWRhdGVNZXRob2RSZXF1ZXN0KCdkZWxldGVSZXNvdXJjZScsIHtpZCwgdXNlcklkLCB0b2tlbn0pXG4gICAgICBhd2FpdCBhdXRob3JpemUoe2FjdGlvbjogJ3dyaXRlLmRlbGV0ZScsIGVudGl0eU5hbWU6ICdSZXNvdXJjZScsIG1ldGEsIGlkfSlcbiAgICAgIHZhciBjcXJzID0gYXdhaXQgZW50aXR5Q3FycyhyZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZScpLCB7c2VydmljZU5hbWUsIHNlcnZpY2VJZCxnZXRDb25zb2xlfSlcbiAgICAgIHZhciBhZGRlZE11dGF0aW9uID0gYXdhaXQgY3Fycy5tdXRhdGlvbnNQYWNrYWdlLm11dGF0ZSh7IG9iaklkOiBpZCwgbXV0YXRpb246ICdkZWxldGUnLCBtZXRhfSlcbiAgICAgIGNxcnMudmlld3NQYWNrYWdlLnJlZnJlc2hWaWV3cyh7b2JqSWRzOiBbaWRdLCBsb2FkU25hcHNob3Q6IHRydWUsIGxvYWRNdXRhdGlvbnM6IHRydWUsIGFkZE11dGF0aW9uczogW2FkZGVkTXV0YXRpb25dfSkudGhlbigodmlld3MpID0+IHtcbiAgICAgICAgbmV0Q2xpZW50UGFja2FnZS5lbWl0KCdtYWluVmlld3NVcGRhdGVkJywgdmlld3MsIG1ldGEpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIGF3YWl0IHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UoJ2RlbGV0ZVJlc291cmNlJywge2lkfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgZGVsZXRlJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGRlbGV0ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHJlYWRSZXNvdXJjZSAoe2lkLCB1c2VySWQsIHRva2VufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCByZWFkUmVzb3VyY2UoKSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkLCB7aWQsIG1ldGF9KVxuICAgICAgYXdhaXQgdmFsaWRhdGVNZXRob2RSZXF1ZXN0KCdyZWFkUmVzb3VyY2UnLCB7aWQsIHVzZXJJZCwgdG9rZW59KVxuICAgICAgYXdhaXQgYXV0aG9yaXplKHthY3Rpb246ICdyZWFkJywgZW50aXR5TmFtZTogJ1Jlc291cmNlJywgbWV0YSwgaWR9KVxuICAgICAgdmFyIGNxcnMgPSBhd2FpdCBlbnRpdHlDcXJzKHJlcXVpcmUoJy4vY29uZmlnLlJlc291cmNlJyksIHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLGdldENvbnNvbGV9KVxuICAgICAgdmFyIHZpZXdzUmVzdWx0ID0gYXdhaXQgY3Fycy52aWV3c1BhY2thZ2UuZ2V0KHtpZHM6IFtpZF19KVxuICAgICAgQ09OU09MRS5kZWJ1ZyhgcmVhZFJlc291cmNlIHZpZXdzUmVzdWx0YCwgdmlld3NSZXN1bHQpXG4gICAgICBpZiAodmlld3NSZXN1bHQubGVuZ3RoICE9PSAxKSB0aHJvdyBgaWQ6ICR7aWR9IEl0ZW0gTm90IEZvdW5kZWRgXG4gICAgICByZXR1cm4gYXdhaXQgdmFsaWRhdGVNZXRob2RSZXNwb25zZSgncmVhZFJlc291cmNlJywgdmlld3NSZXN1bHRbMF0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIHJlYWQnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgcmVhZCcsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgLy8gUFJJVkFURVxuICBhc3luYyAgbGlzdFJlc291cmNlcyAoe3BhZ2UgPSAxLCB0aW1lc3RhbXAsIHBhZ2VJdGVtcyA9IDEwLCBjaGVja3N1bU9ubHkgPSBmYWxzZSwgaWRJbn0sIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgbGlzdFJlc291cmNlcygpIHJlcXVlc3RJZDpgICsgbWV0YS5yZXF1ZXN0SWQsIHtwYWdlLCB0aW1lc3RhbXB9LCBtZXRhKVxuICAgICAgYXdhaXQgdmFsaWRhdGVNZXRob2RSZXF1ZXN0KCdsaXN0UmVzb3VyY2VzJywge3BhZ2UsIHRpbWVzdGFtcH0sIG1ldGEpXG4gICAgICB2YXIgY3FycyA9IGF3YWl0IGVudGl0eUNxcnMocmVxdWlyZSgnLi9jb25maWcuUmVzb3VyY2UnKSwge3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsZ2V0Q29uc29sZX0pXG4gICAgICB2YXIgZmllbGRzID0gKGNoZWNrc3VtT25seSkgPyB7IF92aWV3SGFzaDogMSB9IDogbnVsbFxuICAgICAgdmFyIHF1ZXJ5ID0ge31cbiAgICAgIGlmICh0aW1lc3RhbXApcXVlcnkuX3ZpZXdCdWlsZGVkID0geyRsdDogdGltZXN0YW1wfVxuICAgICAgaWYgKGlkSW4pcXVlcnkuX2lkID0geyRpbjogaWRJbn1cbiAgICAgIHZhciB2aWV3cyA9IGF3YWl0IGNxcnMudmlld3NQYWNrYWdlLmZpbmQoe3F1ZXJ5LCBsaW1pdDogcGFnZUl0ZW1zLCBzdGFydDogKHBhZ2UgLSAxKSAqIHBhZ2VJdGVtcywgZmllbGRzfSlcbiAgICAgIENPTlNPTEUuZGVidWcoYGxpc3RSZXNvdXJjZXMgcmVzcG9uc2VgLCB7dmlld3N9KVxuICAgICAgcmV0dXJuIGF3YWl0IHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UoJ2xpc3RSZXNvdXJjZXMnLCB2aWV3cylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgbGlzdFJlc291cmNlcycsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBsaXN0UmVzb3VyY2VzJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9XG59XG4iXX0=