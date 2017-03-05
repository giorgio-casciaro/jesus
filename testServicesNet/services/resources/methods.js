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

var refreshViews = function _callee(args) {
  var results, views;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(viewsCqrsPack.refreshViews(args));

        case 2:
          results = _context.sent;
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
          return _context.abrupt('return', views);

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, null, undefined);
};
var mutate = function _callee2(args) {
  var mutation;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          mutation = mutationsCqrsPack.mutate(args);
          _context2.next = 3;
          return regeneratorRuntime.awrap(storageInsert(entityConfig.mutationsCollection, mutation));

        case 3:
          return _context2.abrupt('return', mutation);

        case 4:
        case 'end':
          return _context2.stop();
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
    var addedMutation, views;
    return regeneratorRuntime.async(function createResource$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            CONSOLE.debug('start createResource() requestId:' + meta.requestId, { data: data, id: id, meta: meta });
            _context3.next = 4;
            return regeneratorRuntime.awrap(authorize({ action: 'write.create', entityName: 'Resource', meta: meta, data: data, id: id }));

          case 4:

            data._id = id = id || data._id || uuidV4(); // generate id if necessary
            _context3.next = 7;
            return regeneratorRuntime.awrap(mutate({ data: data, objId: id, mutation: 'create', meta: meta }));

          case 7:
            addedMutation = _context3.sent;
            views = refreshViews({ objIds: [id], lastSnapshot: false, loadMutations: false, addMutations: [addedMutation] });

            msNet.emit('mainViewsUpdated', views, meta);
            return _context3.abrupt('return', { id: id });

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3['catch'](0);

            CONSOLE.warn('problems during create', _context3.t0);
            return _context3.abrupt('return', { error: 'problems during create', originalError: _context3.t0 });

          case 17:
          case 'end':
            return _context3.stop();
        }
      }
    }, null, this, [[0, 13]]);
  },
  updateResource: function updateResource(_ref5, meta) {
    var data = _ref5.data,
        id = _ref5.id,
        userId = _ref5.userId,
        token = _ref5.token;
    var addedMutation, views;
    return regeneratorRuntime.async(function updateResource$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            CONSOLE.debug('start updateResource() requestId:' + meta.requestId, { data: data, id: id, meta: meta });

            data._id = id = id || data._id;
            _context4.next = 5;
            return regeneratorRuntime.awrap(mutate({ data: data, objId: id, mutation: 'update', meta: meta }));

          case 5:
            addedMutation = _context4.sent;
            views = refreshViews({ objIds: [id], lastSnapshot: getLastSnapshot('Resource', id), loadMutations: true, addMutations: [addedMutation] });

            msNet.emit('mainViewsUpdated', views, meta);
            return _context4.abrupt('return', { id: id });

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4['catch'](0);

            CONSOLE.warn('problems during update', _context4.t0);
            return _context4.abrupt('return', { error: 'problems during update', originalError: _context4.t0 });

          case 15:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, this, [[0, 11]]);
  },
  deleteResource: function deleteResource(_ref6, meta) {
    var id = _ref6.id,
        userId = _ref6.userId,
        token = _ref6.token;
    var addedMutation, views;
    return regeneratorRuntime.async(function deleteResource$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;

            CONSOLE.debug('start deleteResource() requestId:' + meta.requestId, { id: id, meta: meta });
            _context5.next = 4;
            return regeneratorRuntime.awrap(validateMethodRequest('deleteResource', { id: id, userId: userId, token: token }));

          case 4:
            _context5.next = 6;
            return regeneratorRuntime.awrap(authorize({ action: 'write.delete', entityName: 'Resource', meta: meta, id: id }));

          case 6:
            _context5.next = 8;
            return regeneratorRuntime.awrap(mutate({ objId: id, mutation: 'delete', meta: meta }));

          case 8:
            addedMutation = _context5.sent;
            views = refreshViews({ objIds: [id], lastSnapshot: getLastSnapshot('Resource', id), loadMutations: true, addMutations: [addedMutation] });

            msNet.emit('mainViewsUpdated', views, meta);

            return _context5.abrupt('return', { id: id });

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5['catch'](0);

            CONSOLE.warn('problems during delete', _context5.t0);
            return _context5.abrupt('return', { error: 'problems during delete', originalError: _context5.t0 });

          case 18:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, this, [[0, 14]]);
  },
  readResource: function readResource(_ref7, meta) {
    var id = _ref7.id,
        userId = _ref7.userId,
        token = _ref7.token;
    var viewsResult;
    return regeneratorRuntime.async(function readResource$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;

            CONSOLE.debug('start readResource() requestId:' + meta.requestId, { id: id, meta: meta });
            _context6.next = 4;
            return regeneratorRuntime.awrap(authorize({ action: 'read', entityName: 'Resource', meta: meta, id: id }));

          case 4:
            _context6.next = 6;
            return regeneratorRuntime.awrap(storageGet(entityConfig.viewsCollection, [id]));

          case 6:
            viewsResult = _context6.sent;

            if (!(viewsResult.length !== 1)) {
              _context6.next = 9;
              break;
            }

            throw 'id: ' + id + ' Item Not Found';

          case 9:
            return _context6.abrupt('return', viewsResult[0]);

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6['catch'](0);

            CONSOLE.warn('problems during read', _context6.t0);
            return _context6.abrupt('return', { error: 'problems during read', originalError: _context6.t0 });

          case 16:
          case 'end':
            return _context6.stop();
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
    return regeneratorRuntime.async(function listResources$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;

            CONSOLE.debug('start listResources() requestId:' + meta.requestId, { page: page, timestamp: timestamp }, meta);

            fields = checksumOnly ? { _viewHash: 1 } : null;
            query = {};

            if (timestamp) query._viewBuilded = { $lt: timestamp };
            if (idIn) query._id = { $in: idIn };
            _context7.next = 8;
            return regeneratorRuntime.awrap(storageFind({ collectionName: entityConfig.viewsCollection, query: query, limit: pageItems, start: (page - 1) * pageItems, fields: fields }));

          case 8:
            views = _context7.sent;

            CONSOLE.debug('listResources() views:', views);
            return _context7.abrupt('return', views);

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7['catch'](0);

            CONSOLE.warn('problems during listResources', _context7.t0);
            return _context7.abrupt('return', { error: 'problems during listResources', originalError: _context7.t0 });

          case 17:
          case 'end':
            return _context7.stop();
        }
      }
    }, null, this, [[0, 13]]);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImplc3VzIiwicmVxdWlyZSIsInV1aWRWNCIsIlBBQ0tBR0UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImdldENvbnNvbGUiLCJwYWNrIiwiY29uc29sZSIsIkNPTlNPTEUiLCJtc05ldCIsImdldFN0b3JhZ2UiLCJzdG9yYWdlQ29uZmlnIiwic3RvcmFnZSIsInN0b3JhZ2VHZXQiLCJjb2xsZWN0aW9uTmFtZSIsImlkcyIsImdldCIsInN0b3JhZ2VGaW5kIiwiYXJncyIsImZpbmQiLCJzdG9yYWdlSW5zZXJ0Iiwib2JqIiwiaW5zZXJ0Iiwib2JqcyIsInN0b3JhZ2VVcGRhdGUiLCJ1cGRhdGUiLCJxdWVyaWVzQXJyYXkiLCJfaWQiLCJkYXRhQXJyYXkiLCJpbnNlcnRJZk5vdEV4aXN0cyIsImF1dGhvcml6ZSIsImRhdGEiLCJlbWl0IiwibWV0YSIsImVudGl0eUNvbmZpZyIsImdldE9iak11dGF0aW9ucyIsImVudGl0eU5hbWUiLCJvYmpJZCIsIm1pblRpbWVzdGFtcCIsInF1ZXJ5IiwidGltZXN0YW1wIiwiJGd0ZSIsInNvcnQiLCJnZXRMYXN0U25hcHNob3QiLCJsaW1pdCIsInN0YXJ0IiwibXV0YXRpb25zQ3Fyc1BhY2siLCJtdXRhdGlvbnNQYXRoIiwidmlld3NDcXJzUGFjayIsImFwcGx5TXV0YXRpb25zIiwic25hcHNob3RzTWF4TXV0YXRpb25zIiwicmVmcmVzaFZpZXdzIiwicmVzdWx0cyIsInZpZXdzIiwiZm9yRWFjaCIsInVwZGF0ZWRWaWV3IiwibmV3U25hcHNob3QiLCJwdXNoIiwidmlld3NDb2xsZWN0aW9uIiwic25hcHNob3RzQ29sbGVjdGlvbiIsIm11dGF0ZSIsIm11dGF0aW9uIiwibXV0YXRpb25zQ29sbGVjdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiLCJjcmVhdGVSZXNvdXJjZSIsImlkIiwidXNlcklkIiwidG9rZW4iLCJkZWJ1ZyIsInJlcXVlc3RJZCIsImFjdGlvbiIsImFkZGVkTXV0YXRpb24iLCJvYmpJZHMiLCJsYXN0U25hcHNob3QiLCJsb2FkTXV0YXRpb25zIiwiYWRkTXV0YXRpb25zIiwid2FybiIsImVycm9yIiwib3JpZ2luYWxFcnJvciIsInVwZGF0ZVJlc291cmNlIiwiZGVsZXRlUmVzb3VyY2UiLCJ2YWxpZGF0ZU1ldGhvZFJlcXVlc3QiLCJyZWFkUmVzb3VyY2UiLCJ2aWV3c1Jlc3VsdCIsImxlbmd0aCIsImxpc3RSZXNvdXJjZXMiLCJwYWdlIiwicGFnZUl0ZW1zIiwiY2hlY2tzdW1Pbmx5IiwiaWRJbiIsImZpZWxkcyIsIl92aWV3SGFzaCIsIl92aWV3QnVpbGRlZCIsIiRsdCIsIiRpbiJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFNQSxRQUFRQyxRQUFRLGdCQUFSLENBQWQ7QUFDQSxJQUFNQyxTQUFTRCxRQUFRLFNBQVIsQ0FBZjs7QUFFQSxJQUFNRSxVQUFVLFNBQWhCO0FBQ0EsSUFBTUMsY0FBY0gsUUFBUSxVQUFSLEVBQW9CRyxXQUF4QztBQUNBLElBQU1DLFlBQVlKLFFBQVEsa0JBQVIsQ0FBbEI7O0FBRUEsSUFBTUssa0JBQWtCTixNQUFNTSxlQUFOLENBQXNCTCxRQUFRLFVBQVIsRUFBb0JNLGtCQUExQyxDQUF4QjtBQUNBLElBQU1DLGFBQWEsU0FBYkEsVUFBYSxDQUFDSixXQUFELEVBQWNDLFNBQWQsRUFBeUJJLElBQXpCO0FBQUEsU0FBa0NULE1BQU1RLFVBQU4sQ0FBaUJQLFFBQVEsVUFBUixFQUFvQlMsT0FBckMsRUFBOENOLFdBQTlDLEVBQTJEQyxTQUEzRCxFQUFzRUksSUFBdEUsQ0FBbEM7QUFBQSxDQUFuQjtBQUNBLElBQU1FLFVBQVVILFdBQVdKLFdBQVgsRUFBd0JDLFNBQXhCLEVBQW1DRixPQUFuQyxDQUFoQjs7QUFFQSxJQUFNUyxRQUFRWCxRQUFRLHFCQUFSLEVBQStCLEVBQUNLLGdDQUFELEVBQWtCRix3QkFBbEIsRUFBK0JDLG9CQUEvQixFQUEwQ0csc0JBQTFDLEVBQS9CLENBQWQ7QUFDQTs7QUFFQSxJQUFNSyxhQUFhLFNBQWJBLFVBQWE7QUFBQSxTQUFNWixRQUFRLDJCQUFSLEVBQXFDLEVBQUNPLHNCQUFELEVBQWFKLHdCQUFiLEVBQTBCQyxvQkFBMUIsRUFBcUNTLGVBQWViLFFBQVEsVUFBUixFQUFvQmMsT0FBeEUsRUFBckMsQ0FBTjtBQUFBLENBQW5CO0FBQ0EsSUFBTUMsYUFBYSxTQUFiQSxVQUFhLENBQUNDLGNBQUQsRUFBaUJDLEdBQWpCO0FBQUEsU0FBeUJMLGFBQWFNLEdBQWIsQ0FBaUIsRUFBQ0YsOEJBQUQsRUFBaUJDLFFBQWpCLEVBQWpCLENBQXpCO0FBQUEsQ0FBbkIsQyxDQUFvRjtBQUNwRixJQUFNRSxjQUFjLFNBQWRBLFdBQWMsQ0FBQ0MsSUFBRDtBQUFBLFNBQVVSLGFBQWFTLElBQWIsQ0FBa0JELElBQWxCLENBQVY7QUFBQSxDQUFwQixDLENBQXNEO0FBQ3RELElBQU1FLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ04sY0FBRCxFQUFpQk8sR0FBakI7QUFBQSxTQUF5QlgsYUFBYVksTUFBYixDQUFvQixFQUFDUiw4QkFBRCxFQUFpQlMsTUFBTSxDQUFDRixHQUFELENBQXZCLEVBQXBCLENBQXpCO0FBQUEsQ0FBdEIsQyxDQUFrRztBQUNsRyxJQUFNRyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNWLGNBQUQsRUFBaUJPLEdBQWpCO0FBQUEsU0FBeUJYLGFBQWFlLE1BQWIsQ0FBb0IsRUFBQ1gsOEJBQUQsRUFBaUJZLGNBQWMsQ0FBQyxFQUFDLE9BQU9MLElBQUlNLEdBQVosRUFBRCxDQUEvQixFQUFtREMsV0FBVyxDQUFDUCxHQUFELENBQTlELEVBQXFFUSxtQkFBbUIsSUFBeEYsRUFBcEIsQ0FBekI7QUFBQSxDQUF0QixDLENBQWtLOztBQUVsSyxJQUFNQyxZQUFZLFNBQVpBLFNBQVksQ0FBQ0MsSUFBRDtBQUFBLFNBQVV0QixNQUFNdUIsSUFBTixDQUFXLFdBQVgsRUFBd0JELElBQXhCLEVBQThCQSxLQUFLRSxJQUFuQyxFQUF5QyxJQUF6QyxDQUFWO0FBQUEsQ0FBbEIsQyxDQUEwRTs7QUFFMUUsSUFBSUMsZUFBZXBDLFFBQVEsbUJBQVIsQ0FBbkI7O0FBRUEsSUFBTXFDLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSxNQUFFQyxVQUFGLFFBQUVBLFVBQUY7QUFBQSxNQUFjQyxLQUFkLFFBQWNBLEtBQWQ7QUFBQSwrQkFBcUJDLFlBQXJCO0FBQUEsTUFBcUJBLFlBQXJCLHFDQUFvQyxDQUFwQztBQUFBLFNBQTJDNUIsYUFBYVMsSUFBYixDQUFrQixFQUFFTCxnQkFBZ0JzQixhQUFhLFdBQS9CLEVBQTRDRyxPQUFPLEVBQUVGLFlBQUYsRUFBU0csV0FBVyxFQUFDQyxNQUFNSCxZQUFQLEVBQXBCLEVBQW5ELEVBQStGSSxNQUFNLEVBQUNGLFdBQVcsQ0FBWixFQUFyRyxFQUFsQixDQUEzQztBQUFBLENBQXhCLEMsQ0FBNE07QUFDNU0sSUFBTUcsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLE1BQUVQLFVBQUYsU0FBRUEsVUFBRjtBQUFBLE1BQWNDLEtBQWQsU0FBY0EsS0FBZDtBQUFBLFNBQXlCM0IsYUFBYVMsSUFBYixDQUFrQixFQUFDTCxnQkFBZ0JzQixhQUFhLG1CQUE5QixFQUFtREcsT0FBTyxFQUFDRixPQUFPQSxLQUFSLEVBQTFELEVBQTBFSyxNQUFNLEVBQUNGLFdBQVcsQ0FBWixFQUFoRixFQUFnR0ksT0FBTyxDQUF2RyxFQUEwR0MsT0FBTyxDQUFqSCxFQUFsQixDQUF6QjtBQUFBLENBQXhCLEMsQ0FBdUw7QUFDdkwsSUFBSUMsb0JBQW9CaEQsUUFBUSx5QkFBUixFQUFtQyxFQUFDRyx3QkFBRCxFQUFjQyxvQkFBZCxFQUF5Qkcsc0JBQXpCLEVBQXFDMEMsZUFBZWIsYUFBYWEsYUFBakUsRUFBbkMsQ0FBeEI7QUFDQSxJQUFJQyxnQkFBZ0JsRCxRQUFRLHFCQUFSLEVBQStCLEVBQUNHLHdCQUFELEVBQWNDLG9CQUFkLEVBQXlCRyxzQkFBekIsRUFBcUM4QixnQ0FBckMsRUFBc0RjLGdCQUFnQkgsa0JBQWtCRyxjQUF4RixFQUF3R0MsdUJBQXVCaEIsYUFBYWdCLHFCQUE1SSxFQUEvQixDQUFwQjs7QUFFQSxJQUFNQyxlQUFlLGlCQUFPakMsSUFBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDBDQUNDOEIsY0FBY0csWUFBZCxDQUEyQmpDLElBQTNCLENBREQ7O0FBQUE7QUFDZmtDLGlCQURlO0FBRWZDLGVBRmUsR0FFUCxFQUZPOztBQUduQkQsa0JBQVFFLE9BQVIsQ0FBZ0IsaUJBQWdDO0FBQUEsZ0JBQTlCQyxXQUE4QixTQUE5QkEsV0FBOEI7QUFBQSxnQkFBakJDLFdBQWlCLFNBQWpCQSxXQUFpQjs7QUFDOUMsZ0JBQUlELFdBQUosRUFBaUI7QUFDZkYsb0JBQU1JLElBQU4sQ0FBV0YsV0FBWDtBQUNBL0IsNEJBQWNVLGFBQWF3QixlQUEzQixFQUE0Q0gsV0FBNUM7QUFDRDtBQUNELGdCQUFJQyxXQUFKLEVBQWdCcEMsY0FBY2MsYUFBYXlCLG1CQUEzQixFQUFnREgsV0FBaEQ7QUFDakIsV0FORDtBQUhtQiwyQ0FVWkgsS0FWWTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFyQjtBQVlBLElBQU1PLFNBQVMsa0JBQU8xQyxJQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNUMkMsa0JBRFMsR0FDRWYsa0JBQWtCYyxNQUFsQixDQUF5QjFDLElBQXpCLENBREY7QUFBQTtBQUFBLDBDQUVQRSxjQUFjYyxhQUFhNEIsbUJBQTNCLEVBQWdERCxRQUFoRCxDQUZPOztBQUFBO0FBQUEsNENBR05BLFFBSE07O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBZjs7QUFNQUUsT0FBT0MsT0FBUCxHQUFpQjtBQUNSQyxnQkFEUSxpQ0FDbUNoQyxJQURuQztBQUFBLFFBQ1NGLElBRFQsU0FDU0EsSUFEVDtBQUFBLFFBQ2VtQyxFQURmLFNBQ2VBLEVBRGY7QUFBQSxRQUNtQkMsTUFEbkIsU0FDbUJBLE1BRG5CO0FBQUEsUUFDMkJDLEtBRDNCLFNBQzJCQSxLQUQzQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFHWDVELG9CQUFRNkQsS0FBUixDQUFjLHNDQUFzQ3BDLEtBQUtxQyxTQUF6RCxFQUFvRSxFQUFDdkMsVUFBRCxFQUFPbUMsTUFBUCxFQUFXakMsVUFBWCxFQUFwRTtBQUhXO0FBQUEsNENBSUxILFVBQVUsRUFBQ3lDLFFBQVEsY0FBVCxFQUF5Qm5DLFlBQVksVUFBckMsRUFBaURILFVBQWpELEVBQXVERixVQUF2RCxFQUE2RG1DLE1BQTdELEVBQVYsQ0FKSzs7QUFBQTs7QUFNWG5DLGlCQUFLSixHQUFMLEdBQVd1QyxLQUFLQSxNQUFNbkMsS0FBS0osR0FBWCxJQUFrQjVCLFFBQWxDLENBTlcsQ0FNZ0M7QUFOaEM7QUFBQSw0Q0FPZTZELE9BQU8sRUFBQzdCLFVBQUQsRUFBT00sT0FBTzZCLEVBQWQsRUFBa0JMLFVBQVUsUUFBNUIsRUFBc0M1QixVQUF0QyxFQUFQLENBUGY7O0FBQUE7QUFPUHVDLHlCQVBPO0FBUVBuQixpQkFSTyxHQVFDRixhQUFhLEVBQUNzQixRQUFRLENBQUNQLEVBQUQsQ0FBVCxFQUFlUSxjQUFjLEtBQTdCLEVBQW9DQyxlQUFlLEtBQW5ELEVBQTBEQyxjQUFjLENBQUNKLGFBQUQsQ0FBeEUsRUFBYixDQVJEOztBQVNYL0Qsa0JBQU11QixJQUFOLENBQVcsa0JBQVgsRUFBK0JxQixLQUEvQixFQUFzQ3BCLElBQXRDO0FBVFcsOENBVUosRUFBQ2lDLE1BQUQsRUFWSTs7QUFBQTtBQUFBO0FBQUE7O0FBWVgxRCxvQkFBUXFFLElBQVIsQ0FBYSx3QkFBYjtBQVpXLDhDQWFKLEVBQUNDLE9BQU8sd0JBQVIsRUFBa0NDLDJCQUFsQyxFQWJJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBZ0JSQyxnQkFoQlEsaUNBZ0JtQy9DLElBaEJuQztBQUFBLFFBZ0JTRixJQWhCVCxTQWdCU0EsSUFoQlQ7QUFBQSxRQWdCZW1DLEVBaEJmLFNBZ0JlQSxFQWhCZjtBQUFBLFFBZ0JtQkMsTUFoQm5CLFNBZ0JtQkEsTUFoQm5CO0FBQUEsUUFnQjJCQyxLQWhCM0IsU0FnQjJCQSxLQWhCM0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBa0JYNUQsb0JBQVE2RCxLQUFSLENBQWMsc0NBQXNDcEMsS0FBS3FDLFNBQXpELEVBQW9FLEVBQUN2QyxVQUFELEVBQU9tQyxNQUFQLEVBQVdqQyxVQUFYLEVBQXBFOztBQUVBRixpQkFBS0osR0FBTCxHQUFXdUMsS0FBS0EsTUFBTW5DLEtBQUtKLEdBQTNCO0FBcEJXO0FBQUEsNENBcUJlaUMsT0FBTyxFQUFDN0IsVUFBRCxFQUFPTSxPQUFPNkIsRUFBZCxFQUFrQkwsVUFBVSxRQUE1QixFQUFzQzVCLFVBQXRDLEVBQVAsQ0FyQmY7O0FBQUE7QUFxQlB1Qyx5QkFyQk87QUFzQlBuQixpQkF0Qk8sR0FzQkNGLGFBQWEsRUFBQ3NCLFFBQVEsQ0FBQ1AsRUFBRCxDQUFULEVBQWVRLGNBQWMvQixnQkFBZ0IsVUFBaEIsRUFBNEJ1QixFQUE1QixDQUE3QixFQUE4RFMsZUFBZSxJQUE3RSxFQUFtRkMsY0FBYyxDQUFDSixhQUFELENBQWpHLEVBQWIsQ0F0QkQ7O0FBdUJYL0Qsa0JBQU11QixJQUFOLENBQVcsa0JBQVgsRUFBK0JxQixLQUEvQixFQUFzQ3BCLElBQXRDO0FBdkJXLDhDQXdCSixFQUFDaUMsTUFBRCxFQXhCSTs7QUFBQTtBQUFBO0FBQUE7O0FBMEJYMUQsb0JBQVFxRSxJQUFSLENBQWEsd0JBQWI7QUExQlcsOENBMkJKLEVBQUNDLE9BQU8sd0JBQVIsRUFBa0NDLDJCQUFsQyxFQTNCSTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQThCUkUsZ0JBOUJRLGlDQThCNkJoRCxJQTlCN0I7QUFBQSxRQThCU2lDLEVBOUJULFNBOEJTQSxFQTlCVDtBQUFBLFFBOEJhQyxNQTlCYixTQThCYUEsTUE5QmI7QUFBQSxRQThCcUJDLEtBOUJyQixTQThCcUJBLEtBOUJyQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFnQ1g1RCxvQkFBUTZELEtBQVIsQ0FBYyxzQ0FBc0NwQyxLQUFLcUMsU0FBekQsRUFBb0UsRUFBQ0osTUFBRCxFQUFLakMsVUFBTCxFQUFwRTtBQWhDVztBQUFBLDRDQWlDTGlELHNCQUFzQixnQkFBdEIsRUFBd0MsRUFBQ2hCLE1BQUQsRUFBS0MsY0FBTCxFQUFhQyxZQUFiLEVBQXhDLENBakNLOztBQUFBO0FBQUE7QUFBQSw0Q0FrQ0x0QyxVQUFVLEVBQUN5QyxRQUFRLGNBQVQsRUFBeUJuQyxZQUFZLFVBQXJDLEVBQWlESCxVQUFqRCxFQUF1RGlDLE1BQXZELEVBQVYsQ0FsQ0s7O0FBQUE7QUFBQTtBQUFBLDRDQW9DZU4sT0FBTyxFQUFFdkIsT0FBTzZCLEVBQVQsRUFBYUwsVUFBVSxRQUF2QixFQUFpQzVCLFVBQWpDLEVBQVAsQ0FwQ2Y7O0FBQUE7QUFvQ1B1Qyx5QkFwQ087QUFxQ1BuQixpQkFyQ08sR0FxQ0NGLGFBQWEsRUFBQ3NCLFFBQVEsQ0FBQ1AsRUFBRCxDQUFULEVBQWVRLGNBQWMvQixnQkFBZ0IsVUFBaEIsRUFBNEJ1QixFQUE1QixDQUE3QixFQUE4RFMsZUFBZSxJQUE3RSxFQUFtRkMsY0FBYyxDQUFDSixhQUFELENBQWpHLEVBQWIsQ0FyQ0Q7O0FBc0NYL0Qsa0JBQU11QixJQUFOLENBQVcsa0JBQVgsRUFBK0JxQixLQUEvQixFQUFzQ3BCLElBQXRDOztBQXRDVyw4Q0F3Q0osRUFBQ2lDLE1BQUQsRUF4Q0k7O0FBQUE7QUFBQTtBQUFBOztBQTBDWDFELG9CQUFRcUUsSUFBUixDQUFhLHdCQUFiO0FBMUNXLDhDQTJDSixFQUFDQyxPQUFPLHdCQUFSLEVBQWtDQywyQkFBbEMsRUEzQ0k7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUE4Q1JJLGNBOUNRLCtCQThDMkJsRCxJQTlDM0I7QUFBQSxRQThDT2lDLEVBOUNQLFNBOENPQSxFQTlDUDtBQUFBLFFBOENXQyxNQTlDWCxTQThDV0EsTUE5Q1g7QUFBQSxRQThDbUJDLEtBOUNuQixTQThDbUJBLEtBOUNuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFnRFg1RCxvQkFBUTZELEtBQVIsQ0FBYyxvQ0FBb0NwQyxLQUFLcUMsU0FBdkQsRUFBa0UsRUFBQ0osTUFBRCxFQUFLakMsVUFBTCxFQUFsRTtBQWhEVztBQUFBLDRDQWlETEgsVUFBVSxFQUFDeUMsUUFBUSxNQUFULEVBQWlCbkMsWUFBWSxVQUE3QixFQUF5Q0gsVUFBekMsRUFBK0NpQyxNQUEvQyxFQUFWLENBakRLOztBQUFBO0FBQUE7QUFBQSw0Q0FtRGFyRCxXQUFXcUIsYUFBYXdCLGVBQXhCLEVBQXlDLENBQUNRLEVBQUQsQ0FBekMsQ0FuRGI7O0FBQUE7QUFtRFBrQix1QkFuRE87O0FBQUEsa0JBb0RQQSxZQUFZQyxNQUFaLEtBQXVCLENBcERoQjtBQUFBO0FBQUE7QUFBQTs7QUFBQSwyQkFvRGdDbkIsRUFwRGhDOztBQUFBO0FBQUEsOENBc0RIa0IsWUFBWSxDQUFaLENBdERHOztBQUFBO0FBQUE7QUFBQTs7QUF3RFg1RSxvQkFBUXFFLElBQVIsQ0FBYSxzQkFBYjtBQXhEVyw4Q0F5REosRUFBQ0MsT0FBTyxzQkFBUixFQUFnQ0MsMkJBQWhDLEVBekRJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQTREZjtBQUNPTyxlQTdEUSxnQ0E2RDBFckQsSUE3RDFFO0FBQUEsMkJBNkRRc0QsSUE3RFI7QUFBQSxRQTZEUUEsSUE3RFIsOEJBNkRlLENBN0RmO0FBQUEsUUE2RGtCL0MsU0E3RGxCLFNBNkRrQkEsU0E3RGxCO0FBQUEsZ0NBNkQ2QmdELFNBN0Q3QjtBQUFBLFFBNkQ2QkEsU0E3RDdCLG1DQTZEeUMsRUE3RHpDO0FBQUEsbUNBNkQ2Q0MsWUE3RDdDO0FBQUEsUUE2RDZDQSxZQTdEN0Msc0NBNkQ0RCxLQTdENUQ7QUFBQSxRQTZEbUVDLElBN0RuRSxTQTZEbUVBLElBN0RuRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUErRFhsRixvQkFBUTZELEtBQVIsQ0FBYyxxQ0FBcUNwQyxLQUFLcUMsU0FBeEQsRUFBbUUsRUFBQ2lCLFVBQUQsRUFBTy9DLG9CQUFQLEVBQW5FLEVBQXNGUCxJQUF0Rjs7QUFFSTBELGtCQWpFTyxHQWlFR0YsWUFBRCxHQUFpQixFQUFFRyxXQUFXLENBQWIsRUFBakIsR0FBb0MsSUFqRXRDO0FBa0VQckQsaUJBbEVPLEdBa0VDLEVBbEVEOztBQW1FWCxnQkFBSUMsU0FBSixFQUFjRCxNQUFNc0QsWUFBTixHQUFxQixFQUFDQyxLQUFLdEQsU0FBTixFQUFyQjtBQUNkLGdCQUFJa0QsSUFBSixFQUFTbkQsTUFBTVosR0FBTixHQUFZLEVBQUNvRSxLQUFLTCxJQUFOLEVBQVo7QUFwRUU7QUFBQSw0Q0FxRU96RSxZQUFZLEVBQUNILGdCQUFnQm9CLGFBQWF3QixlQUE5QixFQUErQ25CLFlBQS9DLEVBQXNESyxPQUFPNEMsU0FBN0QsRUFBd0UzQyxPQUFPLENBQUMwQyxPQUFPLENBQVIsSUFBYUMsU0FBNUYsRUFBdUdHLGNBQXZHLEVBQVosQ0FyRVA7O0FBQUE7QUFxRVB0QyxpQkFyRU87O0FBc0VYN0Msb0JBQVE2RCxLQUFSLDJCQUF3Q2hCLEtBQXhDO0FBdEVXLDhDQXVFSkEsS0F2RUk7O0FBQUE7QUFBQTtBQUFBOztBQXlFWDdDLG9CQUFRcUUsSUFBUixDQUFhLCtCQUFiO0FBekVXLDhDQTBFSixFQUFDQyxPQUFPLCtCQUFSLEVBQXlDQywyQkFBekMsRUExRUk7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJtZXRob2RzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuY29uc3QgamVzdXMgPSByZXF1aXJlKCcuLi8uLi8uLi9qZXN1cycpXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcblxuY29uc3QgUEFDS0FHRSA9ICdtZXRob2RzJ1xuY29uc3Qgc2VydmljZU5hbWUgPSByZXF1aXJlKCcuL2NvbmZpZycpLnNlcnZpY2VOYW1lXG5jb25zdCBzZXJ2aWNlSWQgPSByZXF1aXJlKCcuL3NlcnZpY2VJZC5qc29uJylcblxuY29uc3QgZ2V0U2hhcmVkQ29uZmlnID0gamVzdXMuZ2V0U2hhcmVkQ29uZmlnKHJlcXVpcmUoJy4vY29uZmlnJykuc2hhcmVkU2VydmljZXNQYXRoKVxuY29uc3QgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiBqZXN1cy5nZXRDb25zb2xlKHJlcXVpcmUoJy4vY29uZmlnJykuY29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbmNvbnN0IENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG5cbmNvbnN0IG1zTmV0ID0gcmVxdWlyZSgnLi4vLi4vLi4vbmV0LmNsaWVudCcpKHtnZXRTaGFyZWRDb25maWcsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGdldENvbnNvbGV9KVxuLy8gY29uc3QgbXNOZXQgPSB7ZW1pdDooKT0+dHJ1ZSxycGM6KCk9PnRydWV9XG5cbmNvbnN0IGdldFN0b3JhZ2UgPSAoKSA9PiByZXF1aXJlKCcuLi8uLi8uLi9zdG9yYWdlLmlubWVtb3J5Jykoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb25maWc6IHJlcXVpcmUoJy4vY29uZmlnJykuc3RvcmFnZX0pXG5jb25zdCBzdG9yYWdlR2V0ID0gKGNvbGxlY3Rpb25OYW1lLCBpZHMpID0+IGdldFN0b3JhZ2UoKS5nZXQoe2NvbGxlY3Rpb25OYW1lLCBpZHN9KSAvLyBBU1lOQ1xuY29uc3Qgc3RvcmFnZUZpbmQgPSAoYXJncykgPT4gZ2V0U3RvcmFnZSgpLmZpbmQoYXJncykgLy8gQVNZTkNcbmNvbnN0IHN0b3JhZ2VJbnNlcnQgPSAoY29sbGVjdGlvbk5hbWUsIG9iaikgPT4gZ2V0U3RvcmFnZSgpLmluc2VydCh7Y29sbGVjdGlvbk5hbWUsIG9ianM6IFtvYmpdfSkgLy8gQVNZTkNcbmNvbnN0IHN0b3JhZ2VVcGRhdGUgPSAoY29sbGVjdGlvbk5hbWUsIG9iaikgPT4gZ2V0U3RvcmFnZSgpLnVwZGF0ZSh7Y29sbGVjdGlvbk5hbWUsIHF1ZXJpZXNBcnJheTogW3snX2lkJzogb2JqLl9pZH1dLCBkYXRhQXJyYXk6IFtvYmpdLCBpbnNlcnRJZk5vdEV4aXN0czogdHJ1ZX0pIC8vIEFTWU5DXG5cbmNvbnN0IGF1dGhvcml6ZSA9IChkYXRhKSA9PiBtc05ldC5lbWl0KCdhdXRob3JpemUnLCBkYXRhLCBkYXRhLm1ldGEsIHRydWUpLy8gQVNZTkNcblxudmFyIGVudGl0eUNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnLlJlc291cmNlJylcblxuY29uc3QgZ2V0T2JqTXV0YXRpb25zID0gKHtlbnRpdHlOYW1lLCBvYmpJZCwgbWluVGltZXN0YW1wID0gMH0pID0+IGdldFN0b3JhZ2UoKS5maW5kKHsgY29sbGVjdGlvbk5hbWU6IGVudGl0eU5hbWUgKyAnTXV0YXRpb25zJywgcXVlcnk6IHsgb2JqSWQsIHRpbWVzdGFtcDogeyRndGU6IG1pblRpbWVzdGFtcH0gfSwgc29ydDoge3RpbWVzdGFtcDogMX0gfSkgLy8gQVNZTkNcbmNvbnN0IGdldExhc3RTbmFwc2hvdCA9ICh7ZW50aXR5TmFtZSwgb2JqSWR9KSA9PiBnZXRTdG9yYWdlKCkuZmluZCh7Y29sbGVjdGlvbk5hbWU6IGVudGl0eU5hbWUgKyAnTWFpblZpZXdTbmFwc2hvdHMnLCBxdWVyeToge29iaklkOiBvYmpJZH0sIHNvcnQ6IHt0aW1lc3RhbXA6IDF9LCBsaW1pdDogMSwgc3RhcnQ6IDB9KS8vIEFTWU5DXG52YXIgbXV0YXRpb25zQ3Fyc1BhY2sgPSByZXF1aXJlKCcuLi8uLi8uLi9tdXRhdGlvbnMuY3FycycpKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBnZXRDb25zb2xlLCBtdXRhdGlvbnNQYXRoOiBlbnRpdHlDb25maWcubXV0YXRpb25zUGF0aH0pXG52YXIgdmlld3NDcXJzUGFjayA9IHJlcXVpcmUoJy4uLy4uLy4uL3ZpZXdzLmNxcnMnKSh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZ2V0Q29uc29sZSwgZ2V0T2JqTXV0YXRpb25zLCBhcHBseU11dGF0aW9uczogbXV0YXRpb25zQ3Fyc1BhY2suYXBwbHlNdXRhdGlvbnMsIHNuYXBzaG90c01heE11dGF0aW9uczogZW50aXR5Q29uZmlnLnNuYXBzaG90c01heE11dGF0aW9uc30pXG5cbmNvbnN0IHJlZnJlc2hWaWV3cyA9IGFzeW5jIChhcmdzKSA9PiB7XG4gIHZhciByZXN1bHRzID0gYXdhaXQgdmlld3NDcXJzUGFjay5yZWZyZXNoVmlld3MoYXJncylcbiAgdmFyIHZpZXdzID0gW11cbiAgcmVzdWx0cy5mb3JFYWNoKCh7dXBkYXRlZFZpZXcsIG5ld1NuYXBzaG90fSkgPT4ge1xuICAgIGlmICh1cGRhdGVkVmlldykge1xuICAgICAgdmlld3MucHVzaCh1cGRhdGVkVmlldylcbiAgICAgIHN0b3JhZ2VVcGRhdGUoZW50aXR5Q29uZmlnLnZpZXdzQ29sbGVjdGlvbiwgdXBkYXRlZFZpZXcpXG4gICAgfVxuICAgIGlmIChuZXdTbmFwc2hvdClzdG9yYWdlSW5zZXJ0KGVudGl0eUNvbmZpZy5zbmFwc2hvdHNDb2xsZWN0aW9uLCBuZXdTbmFwc2hvdClcbiAgfSlcbiAgcmV0dXJuIHZpZXdzXG59XG5jb25zdCBtdXRhdGUgPSBhc3luYyAoYXJncykgPT4ge1xuICB2YXIgbXV0YXRpb24gPSBtdXRhdGlvbnNDcXJzUGFjay5tdXRhdGUoYXJncylcbiAgYXdhaXQgc3RvcmFnZUluc2VydChlbnRpdHlDb25maWcubXV0YXRpb25zQ29sbGVjdGlvbiwgbXV0YXRpb24pXG4gIHJldHVybiBtdXRhdGlvblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXN5bmMgIGNyZWF0ZVJlc291cmNlICh7ZGF0YSwgaWQsIHVzZXJJZCwgdG9rZW59LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIENPTlNPTEUuZGVidWcoYHN0YXJ0IGNyZWF0ZVJlc291cmNlKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwge2RhdGEsIGlkLCBtZXRhfSlcbiAgICAgIGF3YWl0IGF1dGhvcml6ZSh7YWN0aW9uOiAnd3JpdGUuY3JlYXRlJywgZW50aXR5TmFtZTogJ1Jlc291cmNlJywgbWV0YSwgZGF0YSwgaWR9KVxuXG4gICAgICBkYXRhLl9pZCA9IGlkID0gaWQgfHwgZGF0YS5faWQgfHwgdXVpZFY0KCkgLy8gZ2VuZXJhdGUgaWQgaWYgbmVjZXNzYXJ5XG4gICAgICB2YXIgYWRkZWRNdXRhdGlvbiA9IGF3YWl0IG11dGF0ZSh7ZGF0YSwgb2JqSWQ6IGlkLCBtdXRhdGlvbjogJ2NyZWF0ZScsIG1ldGF9KVxuICAgICAgdmFyIHZpZXdzID0gcmVmcmVzaFZpZXdzKHtvYmpJZHM6IFtpZF0sIGxhc3RTbmFwc2hvdDogZmFsc2UsIGxvYWRNdXRhdGlvbnM6IGZhbHNlLCBhZGRNdXRhdGlvbnM6IFthZGRlZE11dGF0aW9uXX0pXG4gICAgICBtc05ldC5lbWl0KCdtYWluVmlld3NVcGRhdGVkJywgdmlld3MsIG1ldGEpXG4gICAgICByZXR1cm4ge2lkfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDT05TT0xFLndhcm4oJ3Byb2JsZW1zIGR1cmluZyBjcmVhdGUnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgY3JlYXRlJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICBhc3luYyAgdXBkYXRlUmVzb3VyY2UgKHtkYXRhLCBpZCwgdXNlcklkLCB0b2tlbn0sIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgdXBkYXRlUmVzb3VyY2UoKSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkLCB7ZGF0YSwgaWQsIG1ldGF9KVxuXG4gICAgICBkYXRhLl9pZCA9IGlkID0gaWQgfHwgZGF0YS5faWRcbiAgICAgIHZhciBhZGRlZE11dGF0aW9uID0gYXdhaXQgbXV0YXRlKHtkYXRhLCBvYmpJZDogaWQsIG11dGF0aW9uOiAndXBkYXRlJywgbWV0YX0pXG4gICAgICB2YXIgdmlld3MgPSByZWZyZXNoVmlld3Moe29iaklkczogW2lkXSwgbGFzdFNuYXBzaG90OiBnZXRMYXN0U25hcHNob3QoJ1Jlc291cmNlJywgaWQpLCBsb2FkTXV0YXRpb25zOiB0cnVlLCBhZGRNdXRhdGlvbnM6IFthZGRlZE11dGF0aW9uXX0pXG4gICAgICBtc05ldC5lbWl0KCdtYWluVmlld3NVcGRhdGVkJywgdmlld3MsIG1ldGEpXG4gICAgICByZXR1cm4ge2lkfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDT05TT0xFLndhcm4oJ3Byb2JsZW1zIGR1cmluZyB1cGRhdGUnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgdXBkYXRlJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICBhc3luYyAgZGVsZXRlUmVzb3VyY2UgKHtpZCwgdXNlcklkLCB0b2tlbn0sIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgZGVsZXRlUmVzb3VyY2UoKSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkLCB7aWQsIG1ldGF9KVxuICAgICAgYXdhaXQgdmFsaWRhdGVNZXRob2RSZXF1ZXN0KCdkZWxldGVSZXNvdXJjZScsIHtpZCwgdXNlcklkLCB0b2tlbn0pXG4gICAgICBhd2FpdCBhdXRob3JpemUoe2FjdGlvbjogJ3dyaXRlLmRlbGV0ZScsIGVudGl0eU5hbWU6ICdSZXNvdXJjZScsIG1ldGEsIGlkfSlcblxuICAgICAgdmFyIGFkZGVkTXV0YXRpb24gPSBhd2FpdCBtdXRhdGUoeyBvYmpJZDogaWQsIG11dGF0aW9uOiAnZGVsZXRlJywgbWV0YX0pXG4gICAgICB2YXIgdmlld3MgPSByZWZyZXNoVmlld3Moe29iaklkczogW2lkXSwgbGFzdFNuYXBzaG90OiBnZXRMYXN0U25hcHNob3QoJ1Jlc291cmNlJywgaWQpLCBsb2FkTXV0YXRpb25zOiB0cnVlLCBhZGRNdXRhdGlvbnM6IFthZGRlZE11dGF0aW9uXX0pXG4gICAgICBtc05ldC5lbWl0KCdtYWluVmlld3NVcGRhdGVkJywgdmlld3MsIG1ldGEpXG5cbiAgICAgIHJldHVybiB7aWR9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIENPTlNPTEUud2FybigncHJvYmxlbXMgZHVyaW5nIGRlbGV0ZScsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBkZWxldGUnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICByZWFkUmVzb3VyY2UgKHtpZCwgdXNlcklkLCB0b2tlbn0sIG1ldGEpIHtcbiAgICB0cnkge1xuICAgICAgQ09OU09MRS5kZWJ1Zyhgc3RhcnQgcmVhZFJlc291cmNlKCkgcmVxdWVzdElkOmAgKyBtZXRhLnJlcXVlc3RJZCwge2lkLCBtZXRhfSlcbiAgICAgIGF3YWl0IGF1dGhvcml6ZSh7YWN0aW9uOiAncmVhZCcsIGVudGl0eU5hbWU6ICdSZXNvdXJjZScsIG1ldGEsIGlkfSlcblxuICAgICAgdmFyIHZpZXdzUmVzdWx0ID0gYXdhaXQgc3RvcmFnZUdldChlbnRpdHlDb25maWcudmlld3NDb2xsZWN0aW9uLCBbaWRdKVxuICAgICAgaWYgKHZpZXdzUmVzdWx0Lmxlbmd0aCAhPT0gMSkgdGhyb3cgYGlkOiAke2lkfSBJdGVtIE5vdCBGb3VuZGBcblxuICAgICAgcmV0dXJuICB2aWV3c1Jlc3VsdFswXVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDT05TT0xFLndhcm4oJ3Byb2JsZW1zIGR1cmluZyByZWFkJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHJlYWQnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIC8vIFBSSVZBVEVcbiAgYXN5bmMgIGxpc3RSZXNvdXJjZXMgKHtwYWdlID0gMSwgdGltZXN0YW1wLCBwYWdlSXRlbXMgPSAxMCwgY2hlY2tzdW1Pbmx5ID0gZmFsc2UsIGlkSW59LCBtZXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIENPTlNPTEUuZGVidWcoYHN0YXJ0IGxpc3RSZXNvdXJjZXMoKSByZXF1ZXN0SWQ6YCArIG1ldGEucmVxdWVzdElkLCB7cGFnZSwgdGltZXN0YW1wfSwgbWV0YSlcblxuICAgICAgdmFyIGZpZWxkcyA9IChjaGVja3N1bU9ubHkpID8geyBfdmlld0hhc2g6IDEgfSA6IG51bGxcbiAgICAgIHZhciBxdWVyeSA9IHt9XG4gICAgICBpZiAodGltZXN0YW1wKXF1ZXJ5Ll92aWV3QnVpbGRlZCA9IHskbHQ6IHRpbWVzdGFtcH1cbiAgICAgIGlmIChpZEluKXF1ZXJ5Ll9pZCA9IHskaW46IGlkSW59XG4gICAgICB2YXIgdmlld3MgPSBhd2FpdCBzdG9yYWdlRmluZCh7Y29sbGVjdGlvbk5hbWU6IGVudGl0eUNvbmZpZy52aWV3c0NvbGxlY3Rpb24sIHF1ZXJ5LCBsaW1pdDogcGFnZUl0ZW1zLCBzdGFydDogKHBhZ2UgLSAxKSAqIHBhZ2VJdGVtcywgZmllbGRzfSlcbiAgICAgIENPTlNPTEUuZGVidWcoYGxpc3RSZXNvdXJjZXMoKSB2aWV3czpgLCB2aWV3cylcbiAgICAgIHJldHVybiB2aWV3c1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDT05TT0xFLndhcm4oJ3Byb2JsZW1zIGR1cmluZyBsaXN0UmVzb3VyY2VzJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGxpc3RSZXNvdXJjZXMnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH1cbn1cbiJdfQ==