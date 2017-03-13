'use strict';

var jesus = require('../../../jesus');
var uuidV4 = require('uuid/v4');

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
var netEmit = function _callee2(event, data, meta) {
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
          return regeneratorRuntime.awrap(client.emit({ event: event, data: data, meta: meta }));

        case 5:
          return _context2.abrupt('return', _context2.sent);

        case 6:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, undefined);
};
var netRpc = function _callee3(args) {
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
          return regeneratorRuntime.awrap(client.rpc(args));

        case 5:
          return _context3.abrupt('return', _context3.sent);

        case 6:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, undefined);
};
// const msNet = {emit:()=>true,rpc:()=>true}

var getStorage = function getStorage() {
  return require('../../../storage.inmemory')({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, storageConfig: require('./config').storage });
};
var storageGet = function storageGet(collectionName, ids) {
  return getStorage().get({ collectionName: collectionName, ids: ids });
}; // ASYNC
var storageFind = function storageFind(args) {
  return getStorage().find(args);
}; // ASYNC
var storageInsert = function storageInsert(collectionName, obj) {
  return getStorage().insert({ collectionName: collectionName, objs: [obj] });
}; // ASYNC
var storageUpdate = function storageUpdate(collectionName, obj) {
  return getStorage().update({ collectionName: collectionName, queriesArray: [{ '_id': obj._id }], dataArray: [obj], insertIfNotExists: true });
}; // ASYNC

var authorize = function authorize(data) {
  return netEmit('authorize', data, data.meta, true);
}; // ASYNC

var entityConfig = require('./config.Resource');

var getObjMutations = function getObjMutations(_ref) {
  var entityName = _ref.entityName,
      objId = _ref.objId,
      _ref$minTimestamp = _ref.minTimestamp,
      minTimestamp = _ref$minTimestamp === undefined ? 0 : _ref$minTimestamp;
  return getStorage().find({ collectionName: entityName + 'Mutations', query: { objId: objId, timestamp: { $gte: minTimestamp } }, sort: { timestamp: 1 } });
}; // ASYNC
var getLastSnapshot = function getLastSnapshot(_ref2) {
  var entityName = _ref2.entityName,
      objId = _ref2.objId;
  return getStorage().find({ collectionName: entityName + 'MainViewSnapshots', query: { objId: objId }, sort: { timestamp: 1 }, limit: 1, start: 0 });
}; // ASYNC
var mutationsCqrsPack = require('../../../mutations.cqrs')({ serviceName: serviceName, serviceId: serviceId, getConsole: getConsole, mutationsPath: entityConfig.mutationsPath });
var viewsCqrsPack = require('../../../views.cqrs')({ serviceName: serviceName, serviceId: serviceId, getConsole: getConsole, getObjMutations: getObjMutations, applyMutations: mutationsCqrsPack.applyMutations, snapshotsMaxMutations: entityConfig.snapshotsMaxMutations });

var refreshViews = function _callee4(args) {
  var results, views;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(viewsCqrsPack.refreshViews(args));

        case 2:
          results = _context4.sent;
          views = [];

          results.forEach(function (_ref3) {
            var updatedView = _ref3.updatedView,
                newSnapshot = _ref3.newSnapshot;

            if (updatedView) {
              views.push(updatedView);
              storageUpdate(entityConfig.viewsCollection, updatedView);
            }
            if (newSnapshot) storageInsert(entityConfig.snapshotsCollection, newSnapshot);
          });
          return _context4.abrupt('return', views);

        case 6:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, undefined);
};
var mutate = function _callee5(args) {
  var mutation;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          mutation = mutationsCqrsPack.mutate(args);
          _context5.next = 3;
          return regeneratorRuntime.awrap(storageInsert(entityConfig.mutationsCollection, mutation));

        case 3:
          return _context5.abrupt('return', mutation);

        case 4:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, undefined);
};

module.exports = {
  createResource: function createResource(_ref4, meta) {
    var data = _ref4.data,
        id = _ref4.id,
        userid = _ref4.userid,
        token = _ref4.token;
    var addedMutation, views;
    return regeneratorRuntime.async(function createResource$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;

            CONSOLE.debug('start createResource() corrid:' + meta.corrid, { data: data, id: id, meta: meta });
            _context6.next = 4;
            return regeneratorRuntime.awrap(authorize({ action: 'write.create', entityName: 'Resource', meta: meta, data: data, id: id }));

          case 4:

            data._id = id = id || data._id || uuidV4(); // generate id if necessary
            _context6.next = 7;
            return regeneratorRuntime.awrap(mutate({ data: data, objId: id, mutation: 'create', meta: meta }));

          case 7:
            addedMutation = _context6.sent;
            views = refreshViews({ objIds: [id], lastSnapshot: false, loadMutations: false, addMutations: [addedMutation] });

            netEmit('mainViewsUpdated', views, meta);
            return _context6.abrupt('return', { id: id });

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6['catch'](0);

            CONSOLE.warn('problems during create', _context6.t0);
            return _context6.abrupt('return', { error: 'problems during create', originalError: _context6.t0 });

          case 17:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, this, [[0, 13]]);
  },
  updateResource: function updateResource(_ref5, meta) {
    var data = _ref5.data,
        id = _ref5.id,
        userid = _ref5.userid,
        token = _ref5.token;
    var addedMutation, views;
    return regeneratorRuntime.async(function updateResource$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;

            CONSOLE.debug('start updateResource() corrid:' + meta.corrid, { data: data, id: id, meta: meta });

            data._id = id = id || data._id;
            _context7.next = 5;
            return regeneratorRuntime.awrap(mutate({ data: data, objId: id, mutation: 'update', meta: meta }));

          case 5:
            addedMutation = _context7.sent;
            views = refreshViews({ objIds: [id], lastSnapshot: getLastSnapshot('Resource', id), loadMutations: true, addMutations: [addedMutation] });

            netEmit('mainViewsUpdated', views, meta);
            return _context7.abrupt('return', { id: id });

          case 11:
            _context7.prev = 11;
            _context7.t0 = _context7['catch'](0);

            CONSOLE.warn('problems during update', _context7.t0);
            return _context7.abrupt('return', { error: 'problems during update', originalError: _context7.t0 });

          case 15:
          case 'end':
            return _context7.stop();
        }
      }
    }, null, this, [[0, 11]]);
  },
  deleteResource: function deleteResource(_ref6, meta) {
    var id = _ref6.id,
        userid = _ref6.userid,
        token = _ref6.token;
    var addedMutation, views;
    return regeneratorRuntime.async(function deleteResource$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;

            CONSOLE.debug('start deleteResource() corrid:' + meta.corrid, { id: id, meta: meta });
            _context8.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('deleteResource', { id: id, userid: userid, token: token }));

          case 4:
            _context8.next = 6;
            return regeneratorRuntime.awrap(authorize({ action: 'write.delete', entityName: 'Resource', meta: meta, id: id }));

          case 6:
            _context8.next = 8;
            return regeneratorRuntime.awrap(mutate({ objId: id, mutation: 'delete', meta: meta }));

          case 8:
            addedMutation = _context8.sent;
            views = refreshViews({ objIds: [id], lastSnapshot: getLastSnapshot('Resource', id), loadMutations: true, addMutations: [addedMutation] });

            netEmit('mainViewsUpdated', views, meta);

            return _context8.abrupt('return', { id: id });

          case 14:
            _context8.prev = 14;
            _context8.t0 = _context8['catch'](0);

            CONSOLE.warn('problems during delete', _context8.t0);
            return _context8.abrupt('return', { error: 'problems during delete', originalError: _context8.t0 });

          case 18:
          case 'end':
            return _context8.stop();
        }
      }
    }, null, this, [[0, 14]]);
  },
  readResource: function readResource(_ref7, meta) {
    var id = _ref7.id,
        userid = _ref7.userid,
        token = _ref7.token;
    var viewsResult;
    return regeneratorRuntime.async(function readResource$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;

            CONSOLE.debug('start readResource() corrid:' + meta.corrid, { id: id, meta: meta });
            _context9.next = 4;
            return regeneratorRuntime.awrap(authorize({ action: 'read', entityName: 'Resource', meta: meta, id: id }));

          case 4:
            _context9.next = 6;
            return regeneratorRuntime.awrap(storageGet(entityConfig.viewsCollection, [id]));

          case 6:
            viewsResult = _context9.sent;

            if (!(viewsResult.length !== 1)) {
              _context9.next = 9;
              break;
            }

            throw 'id: ' + id + ' Item Not Found';

          case 9:
            return _context9.abrupt('return', viewsResult[0]);

          case 12:
            _context9.prev = 12;
            _context9.t0 = _context9['catch'](0);

            CONSOLE.warn('problems during read', _context9.t0);
            return _context9.abrupt('return', { error: 'problems during read', originalError: _context9.t0 });

          case 16:
          case 'end':
            return _context9.stop();
        }
      }
    }, null, this, [[0, 12]]);
  },

  // PRIVATE
  listResources: function listResources(_ref8, meta) {
    var _ref8$page = _ref8.page,
        page = _ref8$page === undefined ? 1 : _ref8$page,
        timestamp = _ref8.timestamp,
        _ref8$pageItems = _ref8.pageItems,
        pageItems = _ref8$pageItems === undefined ? 10 : _ref8$pageItems,
        _ref8$checksumOnly = _ref8.checksumOnly,
        checksumOnly = _ref8$checksumOnly === undefined ? false : _ref8$checksumOnly,
        idIn = _ref8.idIn;
    var fields, query, views;
    return regeneratorRuntime.async(function listResources$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;

            CONSOLE.debug('start listResources() corrid:' + meta.corrid, { page: page, timestamp: timestamp }, meta);

            fields = checksumOnly ? { _viewHash: 1 } : null;
            query = {};

            if (timestamp) query._viewBuilded = { $lt: timestamp };
            if (idIn) query._id = { $in: idIn };
            _context10.next = 8;
            return regeneratorRuntime.awrap(storageFind({ collectionName: entityConfig.viewsCollection, query: query, limit: pageItems, start: (page - 1) * pageItems, fields: fields }));

          case 8:
            views = _context10.sent;

            CONSOLE.debug('listResources() views:', views);
            return _context10.abrupt('return', views);

          case 13:
            _context10.prev = 13;
            _context10.t0 = _context10['catch'](0);

            CONSOLE.warn('problems during listResources', _context10.t0);
            return _context10.abrupt('return', { error: 'problems during listResources', originalError: _context10.t0 });

          case 17:
          case 'end':
            return _context10.stop();
        }
      }
    }, null, this, [[0, 13]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsInV1aWRWNCIsIlBBQ0tBR0UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIkNPTlNPTEUiLCJnZXROZXRDbGllbnQiLCJjb25maWciLCJuZXRFbWl0IiwiZXZlbnQiLCJkYXRhIiwibWV0YSIsImNsaWVudCIsImVtaXQiLCJuZXRScGMiLCJhcmdzIiwicnBjIiwiZ2V0U3RvcmFnZSIsInN0b3JhZ2VDb25maWciLCJzdG9yYWdlIiwic3RvcmFnZUdldCIsImNvbGxlY3Rpb25OYW1lIiwiaWRzIiwiZ2V0Iiwic3RvcmFnZUZpbmQiLCJmaW5kIiwic3RvcmFnZUluc2VydCIsIm9iaiIsImluc2VydCIsIm9ianMiLCJzdG9yYWdlVXBkYXRlIiwidXBkYXRlIiwicXVlcmllc0FycmF5IiwiX2lkIiwiZGF0YUFycmF5IiwiaW5zZXJ0SWZOb3RFeGlzdHMiLCJhdXRob3JpemUiLCJlbnRpdHlDb25maWciLCJnZXRPYmpNdXRhdGlvbnMiLCJlbnRpdHlOYW1lIiwib2JqSWQiLCJtaW5UaW1lc3RhbXAiLCJxdWVyeSIsInRpbWVzdGFtcCIsIiRndGUiLCJzb3J0IiwiZ2V0TGFzdFNuYXBzaG90IiwibGltaXQiLCJzdGFydCIsIm11dGF0aW9uc0NxcnNQYWNrIiwibXV0YXRpb25zUGF0aCIsInZpZXdzQ3Fyc1BhY2siLCJhcHBseU11dGF0aW9ucyIsInNuYXBzaG90c01heE11dGF0aW9ucyIsInJlZnJlc2hWaWV3cyIsInJlc3VsdHMiLCJ2aWV3cyIsImZvckVhY2giLCJ1cGRhdGVkVmlldyIsIm5ld1NuYXBzaG90IiwicHVzaCIsInZpZXdzQ29sbGVjdGlvbiIsInNuYXBzaG90c0NvbGxlY3Rpb24iLCJtdXRhdGUiLCJtdXRhdGlvbiIsIm11dGF0aW9uc0NvbGxlY3Rpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwiY3JlYXRlUmVzb3VyY2UiLCJpZCIsInVzZXJpZCIsInRva2VuIiwiZGVidWciLCJjb3JyaWQiLCJhY3Rpb24iLCJhZGRlZE11dGF0aW9uIiwib2JqSWRzIiwibGFzdFNuYXBzaG90IiwibG9hZE11dGF0aW9ucyIsImFkZE11dGF0aW9ucyIsIndhcm4iLCJlcnJvciIsIm9yaWdpbmFsRXJyb3IiLCJ1cGRhdGVSZXNvdXJjZSIsImRlbGV0ZVJlc291cmNlIiwidmFsaWRhdGVNZXRob2RSZXF1ZXN0IiwicmVhZFJlc291cmNlIiwidmlld3NSZXN1bHQiLCJsZW5ndGgiLCJsaXN0UmVzb3VyY2VzIiwicGFnZSIsInBhZ2VJdGVtcyIsImNoZWNrc3VtT25seSIsImlkSW4iLCJmaWVsZHMiLCJfdmlld0hhc2giLCJfdmlld0J1aWxkZWQiLCIkbHQiLCIkaW4iXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxnQkFBUixDQUFkO0FBQ0EsSUFBTUMsU0FBU0QsUUFBUSxTQUFSLENBQWY7O0FBRUEsSUFBTUUsVUFBVSxTQUFoQjtBQUNBLElBQU1DLGNBQWNILFFBQVEsVUFBUixFQUFvQkcsV0FBeEM7QUFDQSxJQUFNQyxZQUFZSixRQUFRLGtCQUFSLENBQWxCOztBQUVBLElBQU1LLGtCQUFrQk4sTUFBTU0sZUFBTixDQUFzQkwsUUFBUSxVQUFSLEVBQW9CTSxrQkFBMUMsQ0FBeEI7QUFDQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0osV0FBRCxFQUFjQyxTQUFkLEVBQXlCSSxJQUF6QjtBQUFBLFNBQWtDVCxNQUFNUSxVQUFOLENBQWlCUCxRQUFRLFVBQVIsRUFBb0JTLE9BQXJDLEVBQThDTixXQUE5QyxFQUEyREMsU0FBM0QsRUFBc0VJLElBQXRFLENBQWxDO0FBQUEsQ0FBbkI7QUFDQSxJQUFNRSxVQUFVSCxXQUFXSixXQUFYLEVBQXdCQyxTQUF4QixFQUFtQ0YsT0FBbkMsQ0FBaEI7O0FBRUEsSUFBTVMsZUFBZTtBQUFBO0FBQUE7QUFBQTtB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WUFBWSxFQUFDSCxnQkFBZ0JnQixhQUFhd0IsZUFBOUIsRUFBK0NuQixZQUEvQyxFQUFzREssT0FBTzRDLFNBQTdELEVBQXdFM0MsT0FBTyxDQUFDMEMsT0FBTyxDQUFSLElBQWFDLFNBQTVGLEVBQXVHRyxjQUF2RyxFQUFaLENBckVQOztBQUFBO0FBcUVQdEMsaUJBckVPOztBQXNFWG5ELG9CQUFRbUUsS0FBUiwyQkFBd0NoQixLQUF4QztBQXRFVywrQ0F1RUpBLEtBdkVJOztBQUFBO0FBQUE7QUFBQTs7QUF5RVhuRCxvQkFBUTJFLElBQVIsQ0FBYSwrQkFBYjtBQXpFVywrQ0EwRUosRUFBQ0MsT0FBTywrQkFBUixFQUF5Q0MsNEJBQXpDLEVBMUVJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibWV0aG9kcy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2plc3VzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxuXG5jb25zdCBQQUNLQUdFID0gJ21ldGhvZHMnXG5jb25zdCBzZXJ2aWNlTmFtZSA9IHJlcXVpcmUoJy4vY29uZmlnJykuc2VydmljZU5hbWVcbmNvbnN0IHNlcnZpY2VJZCA9IHJlcXVpcmUoJy4vc2VydmljZUlkLmpzb24nKVxuXG5jb25zdCBnZXRTaGFyZWRDb25maWcgPSBqZXN1cy5nZXRTaGFyZWRDb25maWcocmVxdWlyZSgnLi9jb25maWcnKS5zaGFyZWRTZXJ2aWNlc1BhdGgpXG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IGplc3VzLmdldENvbnNvbGUocmVxdWlyZSgnLi9jb25maWcnKS5jb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKVxuY29uc3QgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcblxuY29uc3QgZ2V0TmV0Q2xpZW50ID0gYXN5bmMgKCkgPT4ge1xuICB2YXIgY29uZmlnID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnbmV0JylcbiAgcmV0dXJuIHJlcXVpcmUoJy4uLy4uLy4uL25ldC5jbGllbnQnKSh7Z2V0U2hhcmVkQ29uZmlnLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBnZXRDb25zb2xlLCBjb25maWd9KVxufVxuY29uc3QgbmV0RW1pdCA9IGFzeW5jIChldmVudCwgZGF0YSwgbWV0YSkgPT4ge1xuICB2YXIgY2xpZW50ID0gYXdhaXQgZ2V0TmV0Q2xpZW50KClcbiAgcmV0dXJuIGF3YWl0IGNsaWVudC5lbWl0KHtldmVudCwgZGF0YSwgbWV0YSB9KVxufVxuY29uc3QgbmV0UnBjID0gYXN5bmMgKGFyZ3MpID0+IHtcbiAgdmFyIGNsaWVudCA9IGF3YWl0IGdldE5ldENsaWVudCgpXG4gIHJldHVybiBhd2FpdCBjbGllbnQucnBjKGFyZ3MpXG59XG4vLyBjb25zdCBtc05ldCA9IHtlbWl0OigpPT50cnVlLHJwYzooKT0+dHJ1ZX1cblxuY29uc3QgZ2V0U3RvcmFnZSA9ICgpID0+IHJlcXVpcmUoJy4uLy4uLy4uL3N0b3JhZ2UuaW5tZW1vcnknKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgc3RvcmFnZUNvbmZpZzogcmVxdWlyZSgnLi9jb25maWcnKS5zdG9yYWdlfSlcbmNvbnN0IHN0b3JhZ2VHZXQgPSAoY29sbGVjdGlvbk5hbWUsIGlkcykgPT4gZ2V0U3RvcmFnZSgpLmdldCh7Y29sbGVjdGlvbk5hbWUsIGlkc30pIC8vIEFTWU5DXG5jb25zdCBzdG9yYWdlRmluZCA9IChhcmdzKSA9PiBnZXRTdG9yYWdlKCkuZmluZChhcmdzKSAvLyBBU1lOQ1xuY29uc3Qgc3RvcmFnZUluc2VydCA9IChjb2xsZWN0aW9uTmFtZSwgb2JqKSA9PiBnZXRTdG9yYWdlKCkuaW5zZXJ0KHtjb2xsZWN0aW9uTmFtZSwgb2JqczogW29ial19KSAvLyBBU1lOQ1xuY29uc3Qgc3RvcmFnZVVwZGF0ZSA9IChjb2xsZWN0aW9uTmFtZSwgb2JqKSA9PiBnZXRTdG9yYWdlKCkudXBkYXRlKHtjb2xsZWN0aW9uTmFtZSwgcXVlcmllc0FycmF5OiBbeydfaWQnOiBvYmouX2lkfV0sIGRhdGFBcnJheTogW29ial0sIGluc2VydElmTm90RXhpc3RzOiB0cnVlfSkgLy8gQVNZTkNcblxuY29uc3QgYXV0aG9yaXplID0gKGRhdGEpID0+IG5ldEVtaXQoJ2F1dGhvcml6ZScsIGRhdGEsIGRhdGEubWV0YSwgdHJ1ZSkvLyBBU1lOQ1xuXG52YXIgZW50aXR5Q29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcuUmVzb3VyY2UnKVxuXG5jb25zdCBnZXRPYmpNdXRhdGlvbnMgPSAoe2VudGl0eU5hbWUsIG9iaklkLCBtaW5UaW1lc3RhbXAgPSAwfSkgPT4gZ2V0U3RvcmFnZSgpLmZpbmQoeyBjb2xsZWN0aW9uTmFtZTogZW50aXR5TmFtZSArICdNdXRhdGlvbnMnLCBxdWVyeTogeyBvYmpJZCwgdGltZXN0YW1wOiB7JGd0ZTogbWluVGltZXN0YW1wfSB9LCBzb3J0OiB7dGltZXN0YW1wOiAxfSB9KSAvLyBBU1lOQ1xuY29uc3QgZ2V0TGFzdFNuYXBzaG90ID0gKHtlbnRpdHlOYW1lLCBvYmpJZH0pID0+IGdldFN0b3JhZ2UoKS5maW5kKHtjb2xsZWN0aW9uTmFtZTogZW50aXR5TmFtZSArICdNYWluVmlld1NuYXBzaG90cycsIHF1ZXJ5OiB7b2JqSWQ6IG9iaklkfSwgc29ydDoge3RpbWVzdGFtcDogMX0sIGxpbWl0OiAxLCBzdGFydDogMH0pLy8gQVNZTkNcbnZhciBtdXRhdGlvbnNDcXJzUGFjayA9IHJlcXVpcmUoJy4uLy4uLy4uL211dGF0aW9ucy5jcXJzJykoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGdldENvbnNvbGUsIG11dGF0aW9uc1BhdGg6IGVudGl0eUNvbmZpZy5tdXRhdGlvbnNQYXRofSlcbnZhciB2aWV3c0NxcnNQYWNrID0gcmVxdWlyZSgnLi4vLi4vLi4vdmlld3MuY3FycycpKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBnZXRDb25zb2xlLCBnZXRPYmpNdXRhdGlvbnMsIGFwcGx5TXV0YXRpb25zOiBtdXRhdGlvbnNDcXJzUGFjay5hcHBseU11dGF0aW9ucywgc25hcHNob3RzTWF4TXV0YXRpb25zOiBlbnRpdHlDb25maWcuc25hcHNob3RzTWF4TXV0YXRpb25zfSlcblxuY29uc3QgcmVmcmVzaFZpZXdzID0gYXN5bmMgKGFyZ3MpID0+IHtcbiAgdmFyIHJlc3VsdHMgPSBhd2FpdCB2aWV3c0NxcnNQYWNrLnJlZnJlc2hWaWV3cyhhcmdzKVxuICB2YXIgdmlld3MgPSBbXVxuICByZXN1bHRzLmZvckVhY2goKHt1cGRhdGVkVmlldywgbmV3U25hcHNob3R9KSA9PiB7XG4gICAgaWYgKHVwZGF0ZWRWaWV3KSB7XG4gICAgICB2aWV3cy5wdXNoKHVwZGF0ZWRWaWV3KVxuICAgICAgc3RvcmFnZVVwZGF0ZShlbnRpdHlDb25maWcudmlld3NDb2xsZWN0aW9uLCB1cGRhdGVkVmlldylcbiAgICB9XG4gICAgaWYgKG5ld1NuYXBzaG90KXN0b3JhZ2VJbnNlcnQoZW50aXR5Q29uZmlnLnNuYXBzaG90c0NvbGxlY3Rpb24sIG5ld1NuYXBzaG90KVxuICB9KVxuICByZXR1cm4gdmlld3Ncbn1cbmNvbnN0IG11dGF0ZSA9IGFzeW5jIChhcmdzKSA9PiB7XG4gIHZhciBtdXRhdGlvbiA9IG11dGF0aW9uc0NxcnNQYWNrLm11dGF0ZShhcmdzKVxuICBhd2FpdCBzdG9yYWdlSW5zZXJ0KGVudGl0eUNvbmZpZy5tdXRhdGlvbnNDb2xsZWN0aW9uLCBtdXRhdGlvbilcbiAgcmV0dXJuIG11dGF0aW9uXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhc3luYyAgY3JlYXRlUmVzb3VyY2UgKHtkYXRhLCBpZCwgdXNlcmlkLCB0b2tlbn0sIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgY3JlYXRlUmVzb3VyY2UoKSBjb3JyaWQ6YCArIG1ldGEuY29ycmlkLCB7ZGF0YSwgaWQsIG1ldGF9KVxuICAgICAgYXdhaXQgYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS5jcmVhdGUnLCBlbnRpdHlOYW1lOiAnUmVzb3VyY2UnLCBtZXRhLCBkYXRhLCBpZH0pXG5cbiAgICAgIGRhdGEuX2lkID0gaWQgPSBpZCB8fCBkYXRhLl9pZCB8fCB1dWlkVjQoKSAvLyBnZW5lcmF0ZSBpZCBpZiBuZWNlc3NhcnlcbiAgICAgIHZhciBhZGRlZE11dGF0aW9uID0gYXdhaXQgbXV0YXRlKHtkYXRhLCBvYmpJZDogaWQsIG11dGF0aW9uOiAnY3JlYXRlJywgbWV0YX0pXG4gICAgICB2YXIgdmlld3MgPSByZWZyZXNoVmlld3Moe29iaklkczogW2lkXSwgbGFzdFNuYXBzaG90OiBmYWxzZSwgbG9hZE11dGF0aW9uczogZmFsc2UsIGFkZE11dGF0aW9uczogW2FkZGVkTXV0YXRpb25dfSlcbiAgICAgIG5ldEVtaXQoJ21haW5WaWV3c1VwZGF0ZWQnLCB2aWV3cywgbWV0YSlcbiAgICAgIHJldHVybiB7aWR9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIGNyZWF0ZScsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBjcmVhdGUnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICB1cGRhdGVSZXNvdXJjZSAoe2RhdGEsIGlkLCB1c2VyaWQsIHRva2VufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCB1cGRhdGVSZXNvdXJjZSgpIGNvcnJpZDpgICsgbWV0YS5jb3JyaWQsIHtkYXRhLCBpZCwgbWV0YX0pXG5cbiAgICAgIGRhdGEuX2lkID0gaWQgPSBpZCB8fCBkYXRhLl9pZFxuICAgICAgdmFyIGFkZGVkTXV0YXRpb24gPSBhd2FpdCBtdXRhdGUoe2RhdGEsIG9iaklkOiBpZCwgbXV0YXRpb246ICd1cGRhdGUnLCBtZXRhfSlcbiAgICAgIHZhciB2aWV3cyA9IHJlZnJlc2hWaWV3cyh7b2JqSWRzOiBbaWRdLCBsYXN0U25hcHNob3Q6IGdldExhc3RTbmFwc2hvdCgnUmVzb3VyY2UnLCBpZCksIGxvYWRNdXRhdGlvbnM6IHRydWUsIGFkZE11dGF0aW9uczogW2FkZGVkTXV0YXRpb25dfSlcbiAgICAgIG5ldEVtaXQoJ21haW5WaWV3c1VwZGF0ZWQnLCB2aWV3cywgbWV0YSlcbiAgICAgIHJldHVybiB7aWR9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIHVwZGF0ZScsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyB1cGRhdGUnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICBkZWxldGVSZXNvdXJjZSAoe2lkLCB1c2VyaWQsIHRva2VufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCBkZWxldGVSZXNvdXJjZSgpIGNvcnJpZDpgICsgbWV0YS5jb3JyaWQsIHtpZCwgbWV0YX0pXG4gICAgICBhd2FpdCB2YWxpZGF0ZU1ldGhvZFJlcXVlc3QoJ2RlbGV0ZVJlc291cmNlJywge2lkLCB1c2VyaWQsIHRva2VufSlcbiAgICAgIGF3YWl0IGF1dGhvcml6ZSh7YWN0aW9uOiAnd3JpdGUuZGVsZXRlJywgZW50aXR5TmFtZTogJ1Jlc291cmNlJywgbWV0YSwgaWR9KVxuXG4gICAgICB2YXIgYWRkZWRNdXRhdGlvbiA9IGF3YWl0IG11dGF0ZSh7IG9iaklkOiBpZCwgbXV0YXRpb246ICdkZWxldGUnLCBtZXRhfSlcbiAgICAgIHZhciB2aWV3cyA9IHJlZnJlc2hWaWV3cyh7b2JqSWRzOiBbaWRdLCBsYXN0U25hcHNob3Q6IGdldExhc3RTbmFwc2hvdCgnUmVzb3VyY2UnLCBpZCksIGxvYWRNdXRhdGlvbnM6IHRydWUsIGFkZE11dGF0aW9uczogW2FkZGVkTXV0YXRpb25dfSlcbiAgICAgIG5ldEVtaXQoJ21haW5WaWV3c1VwZGF0ZWQnLCB2aWV3cywgbWV0YSlcblxuICAgICAgcmV0dXJuIHtpZH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgZGVsZXRlJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGRlbGV0ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHJlYWRSZXNvdXJjZSAoe2lkLCB1c2VyaWQsIHRva2VufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCByZWFkUmVzb3VyY2UoKSBjb3JyaWQ6YCArIG1ldGEuY29ycmlkLCB7aWQsIG1ldGF9KVxuICAgICAgYXdhaXQgYXV0aG9yaXplKHthY3Rpb246ICdyZWFkJywgZW50aXR5TmFtZTogJ1Jlc291cmNlJywgbWV0YSwgaWR9KVxuXG4gICAgICB2YXIgdmlld3NSZXN1bHQgPSBhd2FpdCBzdG9yYWdlR2V0KGVudGl0eUNvbmZpZy52aWV3c0NvbGxlY3Rpb24sIFtpZF0pXG4gICAgICBpZiAodmlld3NSZXN1bHQubGVuZ3RoICE9PSAxKSB0aHJvdyBgaWQ6ICR7aWR9IEl0ZW0gTm90IEZvdW5kYFxuXG4gICAgICByZXR1cm4gdmlld3NSZXN1bHRbMF1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgcmVhZCcsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyByZWFkJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICAvLyBQUklWQVRFXG4gIGFzeW5jICBsaXN0UmVzb3VyY2VzICh7cGFnZSA9IDEsIHRpbWVzdGFtcCwgcGFnZUl0ZW1zID0gMTAsIGNoZWNrc3VtT25seSA9IGZhbHNlLCBpZElufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCBsaXN0UmVzb3VyY2VzKCkgY29ycmlkOmAgKyBtZXRhLmNvcnJpZCwge3BhZ2UsIHRpbWVzdGFtcH0sIG1ldGEpXG5cbiAgICAgIHZhciBmaWVsZHMgPSAoY2hlY2tzdW1Pbmx5KSA/IHsgX3ZpZXdIYXNoOiAxIH0gOiBudWxsXG4gICAgICB2YXIgcXVlcnkgPSB7fVxuICAgICAgaWYgKHRpbWVzdGFtcClxdWVyeS5fdmlld0J1aWxkZWQgPSB7JGx0OiB0aW1lc3RhbXB9XG4gICAgICBpZiAoaWRJbilxdWVyeS5faWQgPSB7JGluOiBpZElufVxuICAgICAgdmFyIHZpZXdzID0gYXdhaXQgc3RvcmFnZUZpbmQoe2NvbGxlY3Rpb25OYW1lOiBlbnRpdHlDb25maWcudmlld3NDb2xsZWN0aW9uLCBxdWVyeSwgbGltaXQ6IHBhZ2VJdGVtcywgc3RhcnQ6IChwYWdlIC0gMSkgKiBwYWdlSXRlbXMsIGZpZWxkc30pXG4gICAgICBDT05TT0xFLmRlYnVnKGBsaXN0UmVzb3VyY2VzKCkgdmlld3M6YCwgdmlld3MpXG4gICAgICByZXR1cm4gdmlld3NcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgbGlzdFJlc291cmNlcycsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBsaXN0UmVzb3VyY2VzJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9XG59XG4iXX0=