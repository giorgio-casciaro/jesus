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
  return msNet.emit('authorize', data, data.meta, true);
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

var refreshViews = function _callee3(args) {
  var results, views;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(viewsCqrsPack.refreshViews(args));

        case 2:
          results = _context3.sent;
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
          return _context3.abrupt('return', views);

        case 6:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, undefined);
};
var mutate = function _callee4(args) {
  var mutation;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          mutation = mutationsCqrsPack.mutate(args);
          _context4.next = 3;
          return regeneratorRuntime.awrap(storageInsert(entityConfig.mutationsCollection, mutation));

        case 3:
          return _context4.abrupt('return', mutation);

        case 4:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, undefined);
};

module.exports = {
  createResource: function createResource(_ref4, meta) {
    var data = _ref4.data,
        id = _ref4.id,
        userId = _ref4.userId,
        token = _ref4.token;
    var addedMutation, views, response;
    return regeneratorRuntime.async(function createResource$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;

            CONSOLE.debug('start createResource() requestId:' + meta.requestId, { data: data, id: id, meta: meta });
            _context5.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('createResource', { data: data, id: id, userId: userId, token: token }));

          case 4:
            _context5.next = 6;
            return regeneratorRuntime.awrap(authorize({ action: 'write.create', entityName: 'Resource', meta: meta, data: data, id: id }));

          case 6:

            data._id = id = id || data._id || uuidV4(); // generate id if necessary
            _context5.next = 9;
            return regeneratorRuntime.awrap(mutate({ data: data, objId: id, mutation: 'create', meta: meta }));

          case 9:
            addedMutation = _context5.sent;
            views = refreshViews({ objIds: [id], lastSnapshot: false, loadMutations: false, addMutations: [addedMutation] });

            msNet.emit('mainViewsUpdated', views, meta);

            _context5.next = 14;
            return regeneratorRuntime.awrap(validateMethodResponse('createResource', { id: id }));

          case 14:
            response = _context5.sent;
            return _context5.abrupt('return', response);

          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5['catch'](0);

            CONSOLE.warn('problems during create', _context5.t0);
            return _context5.abrupt('return', { error: 'problems during create', originalError: _context5.t0 });

          case 22:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, this, [[0, 18]]);
  },
  updateResource: function updateResource(_ref5, meta) {
    var data = _ref5.data,
        id = _ref5.id,
        userId = _ref5.userId,
        token = _ref5.token;
    var addedMutation, views;
    return regeneratorRuntime.async(function updateResource$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;

            CONSOLE.debug('start updateResource() requestId:' + meta.requestId, { data: data, id: id, meta: meta });
            _context6.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('updateResource', { data: data, id: id, userId: userId, token: token }));

          case 4:

            data._id = id = id || data._id;
            _context6.next = 7;
            return regeneratorRuntime.awrap(mutate({ data: data, objId: id, mutation: 'update', meta: meta }));

          case 7:
            addedMutation = _context6.sent;
            views = refreshViews({ objIds: [id], lastSnapshot: getLastSnapshot('Resource', id), loadMutations: true, addMutations: [addedMutation] });

            msNet.emit('mainViewsUpdated', views, meta);

            _context6.next = 12;
            return regeneratorRuntime.awrap(validateMethodResponse('updateResource', { id: id }));

          case 12:
            return _context6.abrupt('return', _context6.sent);

          case 15:
            _context6.prev = 15;
            _context6.t0 = _context6['catch'](0);

            CONSOLE.warn('problems during update', _context6.t0);
            return _context6.abrupt('return', { error: 'problems during update', originalError: _context6.t0 });

          case 19:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, this, [[0, 15]]);
  },
  deleteResource: function deleteResource(_ref6, meta) {
    var id = _ref6.id,
        userId = _ref6.userId,
        token = _ref6.token;
    var addedMutation, views;
    return regeneratorRuntime.async(function deleteResource$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;

            CONSOLE.debug('start deleteResource() requestId:' + meta.requestId, { id: id, meta: meta });
            _context7.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('deleteResource', { id: id, userId: userId, token: token }));

          case 4:
            _context7.next = 6;
            return regeneratorRuntime.awrap(authorize({ action: 'write.delete', entityName: 'Resource', meta: meta, id: id }));

          case 6:
            _context7.next = 8;
            return regeneratorRuntime.awrap(mutate({ objId: id, mutation: 'delete', meta: meta }));

          case 8:
            addedMutation = _context7.sent;
            views = refreshViews({ objIds: [id], lastSnapshot: getLastSnapshot('Resource', id), loadMutations: true, addMutations: [addedMutation] });

            msNet.emit('mainViewsUpdated', views, meta);

            _context7.next = 13;
            return regeneratorRuntime.awrap(validateMethodResponse('deleteResource', { id: id }));

          case 13:
            return _context7.abrupt('return', _context7.sent);

          case 16:
            _context7.prev = 16;
            _context7.t0 = _context7['catch'](0);

            CONSOLE.warn('problems during delete', _context7.t0);
            return _context7.abrupt('return', { error: 'problems during delete', originalError: _context7.t0 });

          case 20:
          case 'end':
            return _context7.stop();
        }
      }
    }, null, this, [[0, 16]]);
  },
  readResource: function readResource(_ref7, meta) {
    var id = _ref7.id,
        userId = _ref7.userId,
        token = _ref7.token;
    var viewsResult;
    return regeneratorRuntime.async(function readResource$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;

            CONSOLE.debug('start readResource() requestId:' + meta.requestId, { id: id, meta: meta });
            _context8.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('readResource', { id: id, userId: userId, token: token }));

          case 4:
            _context8.next = 6;
            return regeneratorRuntime.awrap(authorize({ action: 'read', entityName: 'Resource', meta: meta, id: id }));

          case 6:
            _context8.next = 8;
            return regeneratorRuntime.awrap(storageGet(entityConfig.viewsCollection, [id]));

          case 8:
            viewsResult = _context8.sent;

            if (!(viewsResult.length !== 1)) {
              _context8.next = 11;
              break;
            }

            throw 'id: ' + id + ' Item Not Found';

          case 11:
            _context8.next = 13;
            return regeneratorRuntime.awrap(validateMethodResponse('readResource', viewsResult[0]));

          case 13:
            return _context8.abrupt('return', _context8.sent);

          case 16:
            _context8.prev = 16;
            _context8.t0 = _context8['catch'](0);

            CONSOLE.warn('problems during read', _context8.t0);
            return _context8.abrupt('return', { error: 'problems during read', originalError: _context8.t0 });

          case 20:
          case 'end':
            return _context8.stop();
        }
      }
    }, null, this, [[0, 16]]);
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
    return regeneratorRuntime.async(function listResources$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;

            CONSOLE.debug('start listResources() requestId:' + meta.requestId, { page: page, timestamp: timestamp }, meta);
            _context9.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('listResources', { page: page, timestamp: timestamp }, meta));

          case 4:
            fields = checksumOnly ? { _viewHash: 1 } : null;
            query = {};

            if (timestamp) query._viewBuilded = { $lt: timestamp };
            if (idIn) query._id = { $in: idIn };
            _context9.next = 10;
            return regeneratorRuntime.awrap(storageFind({ collectionName: entityConfig.viewsCollection, query: query, limit: pageItems, start: (page - 1) * pageItems, fields: fields }));

          case 10:
            views = _context9.sent;

            CONSOLE.debug('listResources() views:', views);
            _context9.next = 14;
            return regeneratorRuntime.awrap(validateMethodResponse('listResources', views));

          case 14:
            return _context9.abrupt('return', _context9.sent);

          case 17:
            _context9.prev = 17;
            _context9.t0 = _context9['catch'](0);

            CONSOLE.warn('problems during listResources', _context9.t0);
            return _context9.abrupt('return', { error: 'problems during listResources', originalError: _context9.t0 });

          case 21:
          case 'end':
            return _context9.stop();
        }
      }
    }, null, this, [[0, 17]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsInV1aWRWNCIsIlBBQ0tBR0UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIkNPTlNPTEUiLCJ2YWxpZGF0ZU1ldGhvZFJlcXVlc3QiLCJtZXRob2ROYW1lIiwiZGF0YSIsInZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyIsInZhbGlkYXRlTWV0aG9kUmVzcG9uc2UiLCJtc05ldCIsImdldFN0b3JhZ2UiLCJzdG9yYWdlQ29uZmlnIiwic3RvcmFnZSIsInN0b3JhZ2VHZXQiLCJjb2xsZWN0aW9uTmFtZSIsImlkcyIsImdldCIsInN0b3JhZ2VGaW5kIiwiYXJncyIsImZpbmQiLCJzdG9yYWdlSW5zZXJ0Iiwib2JqIiwiaW5zZXJ0Iiwib2JqcyIsInN0b3JhZ2VVcGRhdGUiLCJ1cGRhdGUiLCJxdWVyaWVzQXJyYXkiLCJfaWQiLCJkYXRhQXJyYXkiLCJpbnNlcnRJZk5vdEV4aXN0cyIsImF1dGhvcml6ZSIsImVtaXQiLCJtZXRhIiwiZW50aXR5Q29uZmlnIiwiZ2V0T2JqTXV0YXRpb25zIiwiZW50aXR5TmFtZSIsIm9iaklkIiwibWluVGltZXN0YW1wIiwicXVlcnkiLCJ0aW1lc3RhbXAiLCIkZ3RlIiwic29ydCIsImdldExhc3RTbmFwc2hvdCIsImxpbWl0Iiwic3RhcnQiLCJtdXRhdGlvbnNDcXJzUGFjayIsIm11dGF0aW9uc1BhdGgiLCJ2aWV3c0NxcnNQYWNrIiwiYXBwbHlNdXRhdGlvbnMiLCJzbmFwc2hvdHNNYXhNdXRhdGlvbnMiLCJyZWZyZXNoVmlld3MiLCJyZXN1bHRzIiwidmlld3MiLCJmb3JFYWNoIiwidXBkYXRlZFZpZXciLCJuZXdTbmFwc2hvdCIsInB1c2giLCJ2aWV3c0NvbGxlY3Rpb24iLCJzbmFwc2hvdHNDb2xsZWN0aW9uIiwibXV0YXRlIiwibXV0YXRpb24iLCJtdXRhdGlvbnNDb2xsZWN0aW9uIiwibW9kdWxlIiwiZXhwb3J0cyIsImNyZWF0ZVJlc291cmNlIiwiaWQiLCJ1c2VySWQiLCJ0b2tlbiIsImRlYnVnIiwicmVxdWVzdElkIiwiYWN0aW9uIiwiYWRkZWRNdXRhdGlvbiIsIm9iaklkcyIsImxhc3RTbmFwc2hvdCIsImxvYWRNdXRhdGlvbnMiLCJhZGRNdXRhdGlvbnMiLCJyZXNwb25zZSIsIndhcm4iLCJlcnJvciIsIm9yaWdpbmFsRXJyb3IiLCJ1cGRhdGVSZXNvdXJjZSIsImRlbGV0ZVJlc291cmNlIiwicmVhZFJlc291cmNlIiwidmlld3NSZXN1bHQiLCJsZW5ndGgiLCJsaXN0UmVzb3VyY2VzIiwicGFnZSIsInBhZ2VJdGVtcyIsImNoZWNrc3VtT25seSIsImlkSW4iLCJmaWVsZHMiLCJfdmlld0hhc2giLCJfdmlld0J1aWxkZWQiLCIkbHQiLCIkaW4iXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxnQkFBUixDQUFkO0FBQ0EsSUFBTUMsU0FBU0QsUUFBUSxTQUFSLENBQWY7O0FBRUEsSUFBTUUsVUFBVSxTQUFoQjtBQUNBLElBQU1DLGNBQWNILFFBQVEsVUFBUixFQUFvQkcsV0FBeEM7QUFDQSxJQUFNQyxZQUFZSixRQUFRLGtCQUFSLENBQWxCOztBQUVBLElBQU1LLGtCQUFrQk4sTUFBTU0sZUFBTixDQUFzQkwsUUFBUSxVQUFSLEVBQW9CTSxrQkFBMUMsQ0FBeEI7QUFDQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0osV0FBRCxFQUFjQyxTQUFkLEVBQXlCSSxJQUF6QjtBQUFBLFNBQWtDVCxNQUFNUSxVQUFOLENBQWlCUCxRQUFRLFVBQVIsRUFBb0JTLE9BQXJDLEVBQThDTixXQUE5QyxFQUEyREMsU0FBM0QsRUFBc0VJLElBQXRFLENBQWxDO0FBQUEsQ0FBbkI7QUFDQSxJQUFNRSxVQUFVSCxXQUFXSixXQUFYLEVBQXdCQyxTQUF4QixFQUFtQ0YsT0FBbkMsQ0FBaEI7O0FBRUEsSUFBTVMs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Q0E5RUY7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBZ0ZYakQsb0JBQVEwRSxJQUFSLENBQWEsK0JBQWI7QUFoRlcsOENBaUZKLEVBQUNDLE9BQU8sK0JBQVIsRUFBeUNDLDJCQUF6QyxFQWpGSTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6Im1ldGhvZHMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgamVzdXMgPSByZXF1aXJlKCcuLi8uLi8uLi9qZXN1cycpXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcblxuY29uc3QgUEFDS0FHRSA9ICdtZXRob2RzJ1xuY29uc3Qgc2VydmljZU5hbWUgPSByZXF1aXJlKCcuL2NvbmZpZycpLnNlcnZpY2VOYW1lXG5jb25zdCBzZXJ2aWNlSWQgPSByZXF1aXJlKCcuL3NlcnZpY2VJZC5qc29uJylcblxuY29uc3QgZ2V0U2hhcmVkQ29uZmlnID0gamVzdXMuZ2V0U2hhcmVkQ29uZmlnKHJlcXVpcmUoJy4vY29uZmlnJykuc2hhcmVkU2VydmljZXNQYXRoKVxuY29uc3QgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiBqZXN1cy5nZXRDb25zb2xlKHJlcXVpcmUoJy4vY29uZmlnJykuY29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbmNvbnN0IENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG5cbmNvbnN0IHZhbGlkYXRlTWV0aG9kUmVxdWVzdCA9IGFzeW5jIChtZXRob2ROYW1lLCBkYXRhKSA9PiBqZXN1cy52YWxpZGF0ZU1ldGhvZEZyb21Db25maWcoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnbWV0aG9kcycpLCBtZXRob2ROYW1lLCBkYXRhLCAncmVxdWVzdFNjaGVtYScpXG5jb25zdCB2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlID0gYXN5bmMgKG1ldGhvZE5hbWUsIGRhdGEpID0+IGplc3VzLnZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdtZXRob2RzJyksIG1ldGhvZE5hbWUsIGRhdGEsICdyZXNwb25zZVNjaGVtYScpXG5jb25zdCBtc05ldCA9IHJlcXVpcmUoJy4uLy4uLy4uL25ldC5jbGllbnQnKSh7Z2V0U2hhcmVkQ29uZmlnLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBnZXRDb25zb2xlfSlcbi8vIGNvbnN0IG1zTmV0ID0ge2VtaXQ6KCk9PnRydWUscnBjOigpPT50cnVlfVxuXG5jb25zdCBnZXRTdG9yYWdlID0gKCkgPT4gcmVxdWlyZSgnLi4vLi4vLi4vc3RvcmFnZS5pbm1lbW9yeScpKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBzdG9yYWdlQ29uZmlnOiByZXF1aXJlKCcuL2NvbmZpZycpLnN0b3JhZ2V9KVxuY29uc3Qgc3RvcmFnZUdldCA9IChjb2xsZWN0aW9uTmFtZSwgaWRzKSA9PiBnZXRTdG9yYWdlKCkuZ2V0KHtjb2xsZWN0aW9uTmFtZSwgaWRzfSkgLy8gQVNZTkNcbmNvbnN0IHN0b3JhZ2VGaW5kID0gKGFyZ3MpID0+IGdldFN0b3JhZ2UoKS5maW5kKGFyZ3MpIC8vIEFTWU5DXG5jb25zdCBzdG9yYWdlSW5zZXJ0ID0gKGNvbGxlY3Rpb25OYW1lLCBvYmopID0+IGdldFN0b3JhZ2UoKS5pbnNlcnQoe2NvbGxlY3Rpb25OYW1lLCBvYmpzOiBbb2JqXX0pIC8vIEFTWU5DXG5jb25zdCBzdG9yYWdlVXBkYXRlID0gKGNvbGxlY3Rpb25OYW1lLCBvYmopID0+IGdldFN0b3JhZ2UoKS51cGRhdGUoe2NvbGxlY3Rpb25OYW1lLCBxdWVyaWVzQXJyYXk6IFt7J19pZCc6IG9iai5faWR9XSwgZGF0YUFycmF5OiBbb2JqXSwgaW5zZXJ0SWZOb3RFeGlzdHM6IHRydWV9KSAvLyBBU1lOQ1xuXG5jb25zdCBhdXRob3JpemUgPSAoZGF0YSkgPT4gbXNOZXQuZW1pdCgnYXV0aG9yaXplJywgZGF0YSwgZGF0YS5tZXRhLCB0cnVlKS8vIEFTWU5DXG5cbnZhciBlbnRpdHlDb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy5SZXNvdXJjZScpXG5cbmNvbnN0IGdldE9iak11dGF0aW9ucyA9ICh7ZW50aXR5TmFtZSwgb2JqSWQsIG1pblRpbWVzdGFtcCA9IDB9KSA9PiBnZXRTdG9yYWdlKCkuZmluZCh7IGNvbGxlY3Rpb25OYW1lOiBlbnRpdHlOYW1lICsgJ011dGF0aW9ucycsIHF1ZXJ5OiB7IG9iaklkLCB0aW1lc3RhbXA6IHskZ3RlOiBtaW5UaW1lc3RhbXB9IH0sIHNvcnQ6IHt0aW1lc3RhbXA6IDF9IH0pIC8vIEFTWU5DXG5jb25zdCBnZXRMYXN0U25hcHNob3QgPSAoe2VudGl0eU5hbWUsIG9iaklkfSkgPT4gZ2V0U3RvcmFnZSgpLmZpbmQoe2NvbGxlY3Rpb25OYW1lOiBlbnRpdHlOYW1lICsgJ01haW5WaWV3U25hcHNob3RzJywgcXVlcnk6IHtvYmpJZDogb2JqSWR9LCBzb3J0OiB7dGltZXN0YW1wOiAxfSwgbGltaXQ6IDEsIHN0YXJ0OiAwfSkvLyBBU1lOQ1xudmFyIG11dGF0aW9uc0NxcnNQYWNrID0gcmVxdWlyZSgnLi4vLi4vLi4vbXV0YXRpb25zLmNxcnMnKSh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZ2V0Q29uc29sZSwgbXV0YXRpb25zUGF0aDogZW50aXR5Q29uZmlnLm11dGF0aW9uc1BhdGh9KVxudmFyIHZpZXdzQ3Fyc1BhY2sgPSByZXF1aXJlKCcuLi8uLi8uLi92aWV3cy5jcXJzJykoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGdldENvbnNvbGUsIGdldE9iak11dGF0aW9ucywgYXBwbHlNdXRhdGlvbnM6IG11dGF0aW9uc0NxcnNQYWNrLmFwcGx5TXV0YXRpb25zLCBzbmFwc2hvdHNNYXhNdXRhdGlvbnM6IGVudGl0eUNvbmZpZy5zbmFwc2hvdHNNYXhNdXRhdGlvbnN9KVxuXG5jb25zdCByZWZyZXNoVmlld3MgPSBhc3luYyAoYXJncykgPT4ge1xuICB2YXIgcmVzdWx0cyA9IGF3YWl0IHZpZXdzQ3Fyc1BhY2sucmVmcmVzaFZpZXdzKGFyZ3MpXG4gIHZhciB2aWV3cyA9IFtdXG4gIHJlc3VsdHMuZm9yRWFjaCgoe3VwZGF0ZWRWaWV3LCBuZXdTbmFwc2hvdH0pID0+IHtcbiAgICBpZiAodXBkYXRlZFZpZXcpIHtcbiAgICAgIHZpZXdzLnB1c2godXBkYXRlZFZpZXcpXG4gICAgICBzdG9yYWdlVXBkYXRlKGVudGl0eUNvbmZpZy52aWV3c0NvbGxlY3Rpb24sIHVwZGF0ZWRWaWV3KVxuICAgIH1cbiAgICBpZiAobmV3U25hcHNob3Qpc3RvcmFnZUluc2VydChlbnRpdHlDb25maWcuc25hcHNob3RzQ29sbGVjdGlvbiwgbmV3U25hcHNob3QpXG4gIH0pXG4gIHJldHVybiB2aWV3c1xufVxuY29uc3QgbXV0YXRlID0gYXN5bmMgKGFyZ3MpID0+IHtcbiAgdmFyIG11dGF0aW9uID0gbXV0YXRpb25zQ3Fyc1BhY2subXV0YXRlKGFyZ3MpXG4gIGF3YWl0IHN0b3JhZ2VJbnNlcnQoZW50aXR5Q29uZmlnLm11dGF0aW9uc0NvbGxlY3Rpb24sIG11dGF0aW9uKVxuICByZXR1cm4gbXV0YXRpb25cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzeW5jICBjcmVhdGVSZXNvdXJjZSAoe2RhdGEsIGlkLCB1c2VySWQsIHRva2VufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCBjcmVhdGVSZXNvdXJjZSgpIHJlcXVlc3RJZDpgICsgbWV0YS5yZXF1ZXN0SWQsIHtkYXRhLCBpZCwgbWV0YX0pXG4gICAgICBhd2FpdCB2YWxpZGF0ZU1ldGhvZFJlcXVlc3QoJ2NyZWF0ZVJlc291cmNlJywge2RhdGEsIGlkLCB1c2VySWQsIHRva2VufSlcbiAgICAgIGF3YWl0IGF1dGhvcml6ZSh7YWN0aW9uOiAnd3JpdGUuY3JlYXRlJywgZW50aXR5TmFtZTogJ1Jlc291cmNlJywgbWV0YSwgZGF0YSwgaWR9KVxuXG4gICAgICBkYXRhLl9pZCA9IGlkID0gaWQgfHwgZGF0YS5faWQgfHwgdXVpZFY0KCkgLy8gZ2VuZXJhdGUgaWQgaWYgbmVjZXNzYXJ5XG4gICAgICB2YXIgYWRkZWRNdXRhdGlvbiA9IGF3YWl0IG11dGF0ZSh7ZGF0YSwgb2JqSWQ6IGlkLCBtdXRhdGlvbjogJ2NyZWF0ZScsIG1ldGF9KVxuICAgICAgdmFyIHZpZXdzID0gcmVmcmVzaFZpZXdzKHtvYmpJZHM6IFtpZF0sIGxhc3RTbmFwc2hvdDogZmFsc2UsIGxvYWRNdXRhdGlvbnM6IGZhbHNlLCBhZGRNdXRhdGlvbnM6IFthZGRlZE11dGF0aW9uXX0pXG4gICAgICBtc05ldC5lbWl0KCdtYWluVmlld3NVcGRhdGVkJywgdmlld3MsIG1ldGEpXG5cbiAgICAgIHZhciByZXNwb25zZSA9IGF3YWl0IHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UoJ2NyZWF0ZVJlc291cmNlJywge2lkfSlcbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDT05TT0xFLndhcm4oJ3Byb2JsZW1zIGR1cmluZyBjcmVhdGUnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgY3JlYXRlJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICBhc3luYyAgdXBkYXRlUmVzb3VyY2UgKHtkYXRhLCBpZCwgdXNlcklkLCB0b2tlbn0sIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgdXBkYXRlUmVzb3VyY2UoKSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkLCB7ZGF0YSwgaWQsIG1ldGF9KVxuICAgICAgYXdhaXQgdmFsaWRhdGVNZXRob2RSZXF1ZXN0KCd1cGRhdGVSZXNvdXJjZScsIHtkYXRhLCBpZCwgdXNlcklkLCB0b2tlbn0pXG5cbiAgICAgIGRhdGEuX2lkID0gaWQgPSBpZCB8fCBkYXRhLl9pZFxuICAgICAgdmFyIGFkZGVkTXV0YXRpb24gPSBhd2FpdCBtdXRhdGUoe2RhdGEsIG9iaklkOiBpZCwgbXV0YXRpb246ICd1cGRhdGUnLCBtZXRhfSlcbiAgICAgIHZhciB2aWV3cyA9IHJlZnJlc2hWaWV3cyh7b2JqSWRzOiBbaWRdLCBsYXN0U25hcHNob3Q6IGdldExhc3RTbmFwc2hvdCgnUmVzb3VyY2UnLCBpZCksIGxvYWRNdXRhdGlvbnM6IHRydWUsIGFkZE11dGF0aW9uczogW2FkZGVkTXV0YXRpb25dfSlcbiAgICAgIG1zTmV0LmVtaXQoJ21haW5WaWV3c1VwZGF0ZWQnLCB2aWV3cywgbWV0YSlcblxuICAgICAgcmV0dXJuIGF3YWl0IHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UoJ3VwZGF0ZVJlc291cmNlJywge2lkfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgdXBkYXRlJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHVwZGF0ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIGRlbGV0ZVJlc291cmNlICh7aWQsIHVzZXJJZCwgdG9rZW59LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIENPTlNPTEUuZGVidWcoYHN0YXJ0IGRlbGV0ZVJlc291cmNlKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwge2lkLCBtZXRhfSlcbiAgICAgIGF3YWl0IHZhbGlkYXRlTWV0aG9kUmVxdWVzdCgnZGVsZXRlUmVzb3VyY2UnLCB7aWQsIHVzZXJJZCwgdG9rZW59KVxuICAgICAgYXdhaXQgYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS5kZWxldGUnLCBlbnRpdHlOYW1lOiAnUmVzb3VyY2UnLCBtZXRhLCBpZH0pXG5cbiAgICAgIHZhciBhZGRlZE11dGF0aW9uID0gYXdhaXQgbXV0YXRlKHsgb2JqSWQ6IGlkLCBtdXRhdGlvbjogJ2RlbGV0ZScsIG1ldGF9KVxuICAgICAgdmFyIHZpZXdzID0gcmVmcmVzaFZpZXdzKHtvYmpJZHM6IFtpZF0sIGxhc3RTbmFwc2hvdDogZ2V0TGFzdFNuYXBzaG90KCdSZXNvdXJjZScsIGlkKSwgbG9hZE11dGF0aW9uczogdHJ1ZSwgYWRkTXV0YXRpb25zOiBbYWRkZWRNdXRhdGlvbl19KVxuICAgICAgbXNOZXQuZW1pdCgnbWFpblZpZXdzVXBkYXRlZCcsIHZpZXdzLCBtZXRhKVxuXG4gICAgICByZXR1cm4gYXdhaXQgdmFsaWRhdGVNZXRob2RSZXNwb25zZSgnZGVsZXRlUmVzb3VyY2UnLCB7aWR9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDT05TT0xFLndhcm4oJ3Byb2JsZW1zIGR1cmluZyBkZWxldGUnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgZGVsZXRlJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICBhc3luYyAgcmVhZFJlc291cmNlICh7aWQsIHVzZXJJZCwgdG9rZW59LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIENPTlNPTEUuZGVidWcoYHN0YXJ0IHJlYWRSZXNvdXJjZSgpIHJlcXVlc3RJZDpgICsgbWV0YS5yZXF1ZXN0SWQsIHtpZCwgbWV0YX0pXG4gICAgICBhd2FpdCB2YWxpZGF0ZU1ldGhvZFJlcXVlc3QoJ3JlYWRSZXNvdXJjZScsIHtpZCwgdXNlcklkLCB0b2tlbn0pXG4gICAgICBhd2FpdCBhdXRob3JpemUoe2FjdGlvbjogJ3JlYWQnLCBlbnRpdHlOYW1lOiAnUmVzb3VyY2UnLCBtZXRhLCBpZH0pXG5cbiAgICAgIHZhciB2aWV3c1Jlc3VsdCA9IGF3YWl0IHN0b3JhZ2VHZXQoZW50aXR5Q29uZmlnLnZpZXdzQ29sbGVjdGlvbiwgW2lkXSlcbiAgICAgIGlmICh2aWV3c1Jlc3VsdC5sZW5ndGggIT09IDEpIHRocm93IGBpZDogJHtpZH0gSXRlbSBOb3QgRm91bmRgXG5cbiAgICAgIHJldHVybiBhd2FpdCB2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlKCdyZWFkUmVzb3VyY2UnLCB2aWV3c1Jlc3VsdFswXSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgcmVhZCcsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyByZWFkJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICAvLyBQUklWQVRFXG4gIGFzeW5jICBsaXN0UmVzb3VyY2VzICh7cGFnZSA9IDEsIHRpbWVzdGFtcCwgcGFnZUl0ZW1zID0gMTAsIGNoZWNrc3VtT25seSA9IGZhbHNlLCBpZElufSwgbWV0YSkge1xuICAgIHRyeSB7XG4gICAgICBDT05TT0xFLmRlYnVnKGBzdGFydCBsaXN0UmVzb3VyY2VzKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwge3BhZ2UsIHRpbWVzdGFtcH0sIG1ldGEpXG4gICAgICBhd2FpdCB2YWxpZGF0ZU1ldGhvZFJlcXVlc3QoJ2xpc3RSZXNvdXJjZXMnLCB7cGFnZSwgdGltZXN0YW1wfSwgbWV0YSlcblxuICAgICAgdmFyIGZpZWxkcyA9IChjaGVja3N1bU9ubHkpID8geyBfdmlld0hhc2g6IDEgfSA6IG51bGxcbiAgICAgIHZhciBxdWVyeSA9IHt9XG4gICAgICBpZiAodGltZXN0YW1wKXF1ZXJ5Ll92aWV3QnVpbGRlZCA9IHskbHQ6IHRpbWVzdGFtcH1cbiAgICAgIGlmIChpZEluKXF1ZXJ5Ll9pZCA9IHskaW46IGlkSW59XG4gICAgICB2YXIgdmlld3MgPSBhd2FpdCBzdG9yYWdlRmluZCh7Y29sbGVjdGlvbk5hbWU6ZW50aXR5Q29uZmlnLnZpZXdzQ29sbGVjdGlvbixxdWVyeSwgbGltaXQ6IHBhZ2VJdGVtcywgc3RhcnQ6IChwYWdlIC0gMSkgKiBwYWdlSXRlbXMsIGZpZWxkc30pXG4gICAgICBDT05TT0xFLmRlYnVnKGBsaXN0UmVzb3VyY2VzKCkgdmlld3M6YCAsIHZpZXdzKVxuICAgICAgcmV0dXJuIGF3YWl0IHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UoJ2xpc3RSZXNvdXJjZXMnLCB2aWV3cylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ09OU09MRS53YXJuKCdwcm9ibGVtcyBkdXJpbmcgbGlzdFJlc291cmNlcycsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBsaXN0UmVzb3VyY2VzJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9XG59XG4iXX0=