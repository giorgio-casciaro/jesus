'use strict';

var entityCqrs = require('../../entity.cqrs');
var jesus = require('../../jesus');
var uuidV4 = require('uuid/v4');
var LOG = console;
process.on('unhandledRejection', function (reason, promise) {
  return LOG.error('unhandledRejection Reason: ', promise, reason);
});

var CONFIG = require('./config');
var PACKAGE = 'service.users';

var getAllServicesConfig = function getAllServicesConfig(schema) {
  return jesus.getAllServicesConfigFromDir(CONFIG.sharedServicesPath, schema);
};
var validateApiRequest = function validateApiRequest(apiMethod, data) {
  return jesus.validateApiFromConfig(CONFIG.sharedServicePath + '/api.json', apiMethod, data, 'requestSchema');
};
var validateApiResponse = function validateApiResponse(apiMethod, data) {
  return jesus.validateApiFromConfig(CONFIG.sharedServicePath + '/api.json', apiMethod, data, 'responseSchema');
};

var NET_CLIENT_ARGS = { getAllServicesConfig: getAllServicesConfig, sharedServicePath: CONFIG.sharedServicePath };
var netClient = require('../../net.client')(NET_CLIENT_ARGS);

module.exports = {
  test: function test(_test) {
    return regeneratorRuntime.async(function test$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            return _context.abrupt('return', _test);

          case 4:
            _context.prev = 4;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', LOG.error({ message: 'problems during test', originalError: _context.t0 }));

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this, [[0, 4]]);
  },
  createUser: function createUser(_ref) {
    var meta = _ref.meta,
        data = _ref.data,
        id = _ref.id;
    var cqrs, userData, addedMutation;
    return regeneratorRuntime.async(function createUser$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            LOG.profile("createUser");
            LOG.debug(PACKAGE, 'start createUser()', { meta: meta, data: data, id: id });
            validateApiRequest('createUser', { meta: meta, data: data, id: id });
            data._id = id = id || data._id || uuidV4(); // generate id if necessary
            _context2.next = 7;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.User')));

          case 7:
            cqrs = _context2.sent;
            _context2.next = 10;
            return regeneratorRuntime.awrap(netClient.emit('authorize', { action: 'write.create', entityName: 'User', meta: meta, data: data, id: id }));

          case 10:
            userData = _context2.sent;
            _context2.next = 13;
            return regeneratorRuntime.awrap(cqrs.mutationsPackage.mutate({ data: data, objId: id, mutation: 'create', userData: userData }));

          case 13:
            addedMutation = _context2.sent;

            cqrs.viewsPackage.refreshViews({ objIds: [id], loadSnapshot: false, loadMutations: false, addMutations: [addedMutation] }); // not await
            LOG.profileEnd("createUser");
            return _context2.abrupt('return', validateApiResponse('createUser', { id: id }));

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2['catch'](0);

            LOG.warn(PACKAGE, 'problems during create', _context2.t0);
            return _context2.abrupt('return', { error: 'problems during create', originalError: _context2.t0 });

          case 23:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[0, 19]]);
  },
  updateUser: function updateUser(_ref2) {
    var meta = _ref2.meta,
        data = _ref2.data,
        id = _ref2.id;
    var cqrs, userData, addedMutation;
    return regeneratorRuntime.async(function updateUser$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            LOG.debug(PACKAGE, 'start updateUser()', { meta: meta, data: data, id: id });
            validateApiRequest('updateUser', { meta: meta, data: data, id: id });
            data._id = id = id || data._id;
            _context3.next = 6;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.User')));

          case 6:
            cqrs = _context3.sent;
            _context3.next = 9;
            return regeneratorRuntime.awrap(netClient.emit('authorize', { action: 'write.update', entityName: 'User', meta: meta, data: data, id: id }));

          case 9:
            userData = _context3.sent;
            _context3.next = 12;
            return regeneratorRuntime.awrap(cqrs.mutationsPackage.mutate({ data: data, objId: id, mutation: 'update', userData: userData }));

          case 12:
            addedMutation = _context3.sent;

            cqrs.viewsPackage.refreshViews({ objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation] }); // not await
            return _context3.abrupt('return', validateApiResponse('updateUser', { id: id }));

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3['catch'](0);

            LOG.warn(PACKAGE, 'problems during update', _context3.t0);
            return _context3.abrupt('return', { error: 'problems during update', originalError: _context3.t0 });

          case 21:
          case 'end':
            return _context3.stop();
        }
      }
    }, null, this, [[0, 17]]);
  },
  deleteUser: function deleteUser(_ref3) {
    var meta = _ref3.meta,
        data = _ref3.data,
        id = _ref3.id;
    var cqrs, userData, addedMutation;
    return regeneratorRuntime.async(function deleteUser$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            LOG.debug(PACKAGE, 'start deleteUser()', { meta: meta, data: data, id: id });
            validateApiRequest('deleteUser', { meta: meta, data: data, id: id });
            data._id = id = id || data._id;
            _context4.next = 6;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.User')));

          case 6:
            cqrs = _context4.sent;
            _context4.next = 9;
            return regeneratorRuntime.awrap(netClient.emit('authorize', { action: 'write.delete', entityName: 'User', meta: meta, data: data, id: id }));

          case 9:
            userData = _context4.sent;
            _context4.next = 12;
            return regeneratorRuntime.awrap(cqrs.mutationsPackage.mutate({ data: data, objId: id, mutation: 'delete', userData: userData }));

          case 12:
            addedMutation = _context4.sent;

            cqrs.viewsPackage.refreshViews({ objIds: [id], loadSnapshot: true, loadMutations: true, addMutations: [addedMutation] }); // not await
            return _context4.abrupt('return', validateApiResponse('deleteUser', { id: id }));

          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4['catch'](0);

            LOG.warn(PACKAGE, 'problems during delete', _context4.t0);
            return _context4.abrupt('return', { error: 'problems during delete', originalError: _context4.t0 });

          case 21:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, this, [[0, 17]]);
  },
  readUser: function readUser(_ref4) {
    var meta = _ref4.meta,
        data = _ref4.data,
        id = _ref4.id;
    var cqrs, viewsResult, userData;
    return regeneratorRuntime.async(function readUser$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;

            LOG.debug(PACKAGE, 'start readUser()', { meta: meta, data: data, id: id });
            validateApiRequest('readUser', { meta: meta, data: data, id: id });
            id = id || data._id;
            _context5.next = 6;
            return regeneratorRuntime.awrap(entityCqrs(require('./config.User')));

          case 6:
            cqrs = _context5.sent;
            _context5.next = 9;
            return regeneratorRuntime.awrap(cqrs.viewsPackage.get({ ids: [id] }));

          case 9:
            viewsResult = _context5.sent;

            LOG.debug(PACKAGE, 'readUser viewsResult', viewsResult);

            if (!(viewsResult.length !== 1)) {
              _context5.next = 13;
              break;
            }

            throw 'id: ' + id + ' Item Not Founded';

          case 13:
            _context5.next = 15;
            return regeneratorRuntime.awrap(netClient.emit('authorize', { action: 'read', entityName: 'User', meta: meta, data: data, id: id }));

          case 15:
            userData = _context5.sent;
            return _context5.abrupt('return', validateApiResponse('readUser', viewsResult[0]));

          case 19:
            _context5.prev = 19;
            _context5.t0 = _context5['catch'](0);

            LOG.warn(PACKAGE, 'problems during read', _context5.t0);
            return _context5.abrupt('return', { error: 'problems during read', originalError: _context5.t0 });

          case 23:
          case 'end':
            return _context5.stop();
        }
      }
    }, null, this, [[0, 19]]);
  },
  authorize: function authorize(_ref5) {
    var action = _ref5.action,
        entityName = _ref5.entityName,
        id = _ref5.id,
        meta = _ref5.meta;
    return regeneratorRuntime.async(function authorize$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            return _context6.abrupt('return', {
              userData: { 'userId': '195151662661' }
            });

          case 4:
            _context6.prev = 4;
            _context6.t0 = _context6['catch'](0);
            return _context6.abrupt('return', DI.errorResponse({ message: 'problems during authorize', originalError: _context6.t0 }));

          case 7:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, this, [[0, 4]]);
  }
};

// var CONFIG = R.merge(require('./config'), configOverwrite)
// var userPermissionBasePackage = await require('../entity.base')(CONFIG['UserPermission'], DI)
// var userCqrsPackage = await require('../entity.cqrs')(CONFIG['User'], DI)
// module.exports = {
//   async updateAutorizationsView ({entity, items, itemsIds}) {
//     try {
//       var storagePackage = await CONFIG.autorizationsView.storage(CONFIG.autorizationsView, DI)
//       DI.warn({msg: `updateView`, debug: {meta, items, itemsIds}})
//       items = R.map(CONFIG.autorizationsView.filterIncomingData, items)
//       items = R.map(R.merge({'_entity': entity}), items)
//       await storagePackage.update({
//         queriesArray: R.map((itemId) => ({'_id': itemId}), itemsIds),
//         dataArray: items,
//         insertIfNotExists: true})
//     } catch (error) {
//       return DI.errorResponse({message: 'problems during updateAutorizationsView', originalError: error})
//     }
//   },
//   async  authorize ({action, entityName, itemsIds, meta}) {
//     try {
//       // DI.warn({msg: `authorize`, debug: {action, entityName, itemsIds, meta}})
//       return {
//         userData: {'userId': '195151662661'}
//       }
//     } catch (error) {
//       return DI.errorResponse({message: 'problems during authorize', originalError: error})
//     }
//   },
//   async  test (test) {
//     try {
//       return test
//     } catch (error) {
//       return DI.errorResponse({message: 'problems during test', originalError: error})
//     }
//   },
//   async  updateUserPermissionRoute ({meta, items, itemsIds}) {
//     try {
//       ({items, itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({items, itemsIds, appendIdsToItems: true}))
//       var filterProps = R.pickBy((val, key) => (key === '_id' || key.charAt(0) !== '_')) // remove items data starting with _ (exclude _id )
//       items = R.map(filterProps, items)
//       var userData = await DI.authorize({action: 'write.update', entityName: 'UserPermission', items, itemsIds, meta})
//       await userPermissionBasePackage.update({items, itemsIds, userData})
//       return {itemsIds}
//     } catch (error) {
//       return DI.errorResponse({message: 'Permission problems during update'})
//     }
//   },
//
//   async  deleteUserPermissionRoute ({meta, itemsIds, items}) {
//     try {
//       ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({items, itemsIds}))
//       items = R.map(() => ({'_deleted': true}), itemsIds)
//       // console.log({items})
//       var userData = await DI.authorize({action: 'write.delete', entityName: 'UserPermission', items, itemsIds, meta})
//       await userPermissionBasePackage.update({items, itemsIds, userData})
//       return {itemsIds}
//     } catch (error) {
//       return DI.errorResponse({message: 'Permission problems during delete'})
//     }
//   },
//   async  readUserPermissionRoute ({meta, items, itemsIds}) {
//     try {
//       ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({itemsIds}))
//       var userData = await DI.authorize({action: 'read', entityName: 'UserPermission', items, itemsIds, meta})
//       items = await userPermissionBasePackage.read({items, itemsIds, userData})
//       return {items}
//     } catch (error) {
//       return DI.errorResponse({message: 'Permission problems during read'})
//     }
//   },

//   async  deleteUserRoute ({meta, itemsIds, items}) {
//     try {
//       ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({itemsIds}))
//       var userData = await DI.authorize({action: 'write.delete', entityName: 'User', itemsIds, meta})
//       await userCqrsPackage.mutate({itemsIds, mutation: 'delete', userData})
//       await userCqrsPackage.refreshViews({itemsIds, loadSnapshot: true, loadMutations: true }) // not await
//       return {itemsIds}
//     } catch (error) {
//       return DI.errorResponse(error)
//     }
//   },
//   async  readUserRoute ({meta, itemsIds}) {
//     try {
//       ({itemsIds} = require('../jesus').checkRequestItemsIdsAndItems({itemsIds}))
//       var userData = await DI.authorize({action: 'read', entityName: 'User', itemsIds, meta})
//       var items = await userCqrsPackage.read({itemsIds})
//       // console.log({itemsIds, items})
//       return {items}
//     } catch (error) {
//       return DI.errorResponse(error)
//     }
//   }}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImVudGl0eUNxcnMiLCJyZXF1aXJlIiwiamVzdXMiLCJ1dWlkVjQiLCJMT0ciLCJjb25zb2xlIiwicHJvY2VzcyIsIm9uIiwicmVhc29uIiwicHJvbWlzZSIsImVycm9yIiwiQ09ORklHIiwiUEFDS0FHRSIsImdldEFsbFNlcnZpY2VzQ29uZmlnIiwic2NoZW1hIiwiZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyIiwic2hhcmVkU2VydmljZXNQYXRoIiwidmFsaWRhdGVBcGlSZXF1ZXN0IiwiYXBpTWV0aG9kIiwiZGF0YSIsInZhbGlkYXRlQXBpRnJvbUNvbmZpZyIsInNoYXJlZFNlcnZpY2VQYXRoIiwidmFsaWRhdGVBcGlSZXNwb25zZSIsIk5FVF9DTElFTlRfQVJHUyIsIm5ldENsaWVudCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0ZXN0IiwibWVzc2FnZSIsIm9yaWdpbmFsRXJyb3IiLCJjcmVhdGVVc2VyIiwibWV0YSIsImlkIiwicHJvZmlsZSIsImRlYnVnIiwiX2lkIiwiY3FycyIsImVtaXQiLCJhY3Rpb24iLCJlbnRpdHlOYW1lIiwidXNlckRhdGEiLCJtdXRhdGlvbnNQYWNrYWdlIiwibXV0YXRlIiwib2JqSWQiLCJtdXRhdGlvbiIsImFkZGVkTXV0YXRpb24iLCJ2aWV3c1BhY2thZ2UiLCJyZWZyZXNoVmlld3MiLCJvYmpJZHMiLCJsb2FkU25hcHNob3QiLCJsb2FkTXV0YXRpb25zIiwiYWRkTXV0YXRpb25zIiwicHJvZmlsZUVuZCIsIndhcm4iLCJ1cGRhdGVVc2VyIiwiZGVsZXRlVXNlciIsInJlYWRVc2VyIiwiZ2V0IiwiaWRzIiwidmlld3NSZXN1bHQiLCJsZW5ndGgiLCJhdXRob3JpemUiLCJESSIsImVycm9yUmVzcG9uc2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsYUFBYUMsUUFBUSxtQkFBUixDQUFqQjtBQUNBLElBQUlDLFFBQVFELFFBQVEsYUFBUixDQUFaO0FBQ0EsSUFBTUUsU0FB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TFMsd0JBQVUsRUFBQyxVQUFVLGNBQVg7QUFETCxhQTFFSTs7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0E4RUpzQixHQUFHQyxhQUFILENBQWlCLEVBQUNuQyxTQUFTLDJCQUFWLEVBQXVDQywyQkFBdkMsRUFBakIsQ0E5RUk7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQjs7QUFtRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWV0aG9kcy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZW50aXR5Q3FycyA9IHJlcXVpcmUoJy4uLy4uL2VudGl0eS5jcXJzJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4uLy4uL2plc3VzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxudmFyIExPRyA9IGNvbnNvbGVcbnByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIChyZWFzb24sIHByb21pc2UpID0+IExPRy5lcnJvcigndW5oYW5kbGVkUmVqZWN0aW9uIFJlYXNvbjogJywgcHJvbWlzZSwgcmVhc29uKSlcblxudmFyIENPTkZJRyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbmNvbnN0IFBBQ0tBR0UgPSAnc2VydmljZS51c2VycydcblxuY29uc3QgZ2V0QWxsU2VydmljZXNDb25maWcgPSAoc2NoZW1hKSA9PiBqZXN1cy5nZXRBbGxTZXJ2aWNlc0NvbmZpZ0Zyb21EaXIoQ09ORklHLnNoYXJlZFNlcnZpY2VzUGF0aCwgc2NoZW1hKVxuY29uc3QgdmFsaWRhdGVBcGlSZXF1ZXN0ID0gKGFwaU1ldGhvZCwgZGF0YSkgPT4gamVzdXMudmFsaWRhdGVBcGlGcm9tQ29uZmlnKENPTkZJRy5zaGFyZWRTZXJ2aWNlUGF0aCArICcvYXBpLmpzb24nLCBhcGlNZXRob2QsIGRhdGEsICdyZXF1ZXN0U2NoZW1hJylcbmNvbnN0IHZhbGlkYXRlQXBpUmVzcG9uc2UgPSAoYXBpTWV0aG9kLCBkYXRhKSA9PiBqZXN1cy52YWxpZGF0ZUFwaUZyb21Db25maWcoQ09ORklHLnNoYXJlZFNlcnZpY2VQYXRoICsgJy9hcGkuanNvbicsIGFwaU1ldGhvZCwgZGF0YSwgJ3Jlc3BvbnNlU2NoZW1hJylcblxuY29uc3QgTkVUX0NMSUVOVF9BUkdTID0ge2dldEFsbFNlcnZpY2VzQ29uZmlnLCBzaGFyZWRTZXJ2aWNlUGF0aDogQ09ORklHLnNoYXJlZFNlcnZpY2VQYXRofVxudmFyIG5ldENsaWVudCA9IHJlcXVpcmUoJy4uLy4uL25ldC5jbGllbnQnKShORVRfQ0xJRU5UX0FSR1MpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhc3luYyAgdGVzdCAodGVzdCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGVzdFxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gTE9HLmVycm9yKHttZXNzYWdlOiAncHJvYmxlbXMgZHVyaW5nIHRlc3QnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn0pXG4gICAgfVxuICB9LFxuICBhc3luYyAgY3JlYXRlVXNlciAoe21ldGEsIGRhdGEsIGlkfSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cucHJvZmlsZShcImNyZWF0ZVVzZXJcIilcbiAgICAgIExPRy5kZWJ1ZyhQQUNLQUdFLCBgc3RhcnQgY3JlYXRlVXNlcigpYCwge21ldGEsIGRhdGEsIGlkfSlcbiAgICAgIHZhbGlkYXRlQXBpUmVxdWVzdCgnY3JlYXRlVXNlcicsIHttZXRhLCBkYXRhLCBpZH0pXG4gICAgICBkYXRhLl9pZCA9IGlkID0gaWQgfHwgZGF0YS5faWQgfHwgdXVpZFY0KCkgLy8gZ2VuZXJhdGUgaWQgaWYgbmVjZXNzYXJ5XG4gICAgICB2YXIgY3FycyA9IGF3YWl0IGVudGl0eUNxcnMocmVxdWlyZSgnLi9jb25maWcuVXNlcicpKVxuICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgbmV0Q2xpZW50LmVtaXQoJ2F1dGhvcml6ZScsIHthY3Rpb246ICd3cml0ZS5jcmVhdGUnLCBlbnRpdHlOYW1lOiAnVXNlcicsIG1ldGEsIGRhdGEsIGlkfSlcbiAgICAgIHZhciBhZGRlZE11dGF0aW9uID0gYXdhaXQgY3Fycy5tdXRhdGlvbnNQYWNrYWdlLm11dGF0ZSh7ZGF0YSwgb2JqSWQ6IGlkLCBtdXRhdGlvbjogJ2NyZWF0ZScsIHVzZXJEYXRhfSlcbiAgICAgIGNxcnMudmlld3NQYWNrYWdlLnJlZnJlc2hWaWV3cyh7b2JqSWRzOiBbaWRdLCBsb2FkU25hcHNob3Q6IGZhbHNlLCBsb2FkTXV0YXRpb25zOiBmYWxzZSwgYWRkTXV0YXRpb25zOiBbYWRkZWRNdXRhdGlvbl19KSAvLyBub3QgYXdhaXRcbiAgICAgIExPRy5wcm9maWxlRW5kKFwiY3JlYXRlVXNlclwiKVxuICAgICAgcmV0dXJuIHZhbGlkYXRlQXBpUmVzcG9uc2UoJ2NyZWF0ZVVzZXInLCB7aWR9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMT0cud2FybihQQUNLQUdFLCAncHJvYmxlbXMgZHVyaW5nIGNyZWF0ZScsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBjcmVhdGUnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICB1cGRhdGVVc2VyICh7bWV0YSwgZGF0YSwgaWR9KSB7XG4gICAgdHJ5IHtcbiAgICAgIExPRy5kZWJ1ZyhQQUNLQUdFLCBgc3RhcnQgdXBkYXRlVXNlcigpYCwge21ldGEsIGRhdGEsIGlkfSlcbiAgICAgIHZhbGlkYXRlQXBpUmVxdWVzdCgndXBkYXRlVXNlcicsIHttZXRhLCBkYXRhLCBpZH0pXG4gICAgICBkYXRhLl9pZCA9IGlkID0gaWQgfHwgZGF0YS5faWRcbiAgICAgIHZhciBjcXJzID0gYXdhaXQgZW50aXR5Q3FycyhyZXF1aXJlKCcuL2NvbmZpZy5Vc2VyJykpXG4gICAgICB2YXIgdXNlckRhdGEgPSBhd2FpdCBuZXRDbGllbnQuZW1pdCgnYXV0aG9yaXplJywge2FjdGlvbjogJ3dyaXRlLnVwZGF0ZScsIGVudGl0eU5hbWU6ICdVc2VyJywgbWV0YSwgZGF0YSwgaWR9KVxuICAgICAgdmFyIGFkZGVkTXV0YXRpb24gPSBhd2FpdCBjcXJzLm11dGF0aW9uc1BhY2thZ2UubXV0YXRlKHtkYXRhLCBvYmpJZDogaWQsIG11dGF0aW9uOiAndXBkYXRlJywgdXNlckRhdGF9KVxuICAgICAgY3Fycy52aWV3c1BhY2thZ2UucmVmcmVzaFZpZXdzKHtvYmpJZHM6IFtpZF0sIGxvYWRTbmFwc2hvdDogdHJ1ZSwgbG9hZE11dGF0aW9uczogdHJ1ZSwgYWRkTXV0YXRpb25zOiBbYWRkZWRNdXRhdGlvbl19KSAvLyBub3QgYXdhaXRcbiAgICAgIHJldHVybiB2YWxpZGF0ZUFwaVJlc3BvbnNlKCd1cGRhdGVVc2VyJywge2lkfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTE9HLndhcm4oUEFDS0FHRSwgJ3Byb2JsZW1zIGR1cmluZyB1cGRhdGUnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgdXBkYXRlJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICBhc3luYyAgZGVsZXRlVXNlciAoe21ldGEsIGRhdGEsIGlkfSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cuZGVidWcoUEFDS0FHRSwgYHN0YXJ0IGRlbGV0ZVVzZXIoKWAsIHttZXRhLCBkYXRhLCBpZH0pXG4gICAgICB2YWxpZGF0ZUFwaVJlcXVlc3QoJ2RlbGV0ZVVzZXInLCB7bWV0YSwgZGF0YSwgaWR9KVxuICAgICAgZGF0YS5faWQgPSBpZCA9IGlkIHx8IGRhdGEuX2lkXG4gICAgICB2YXIgY3FycyA9IGF3YWl0IGVudGl0eUNxcnMocmVxdWlyZSgnLi9jb25maWcuVXNlcicpKVxuICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgbmV0Q2xpZW50LmVtaXQoJ2F1dGhvcml6ZScsIHthY3Rpb246ICd3cml0ZS5kZWxldGUnLCBlbnRpdHlOYW1lOiAnVXNlcicsIG1ldGEsIGRhdGEsIGlkfSlcbiAgICAgIHZhciBhZGRlZE11dGF0aW9uID0gYXdhaXQgY3Fycy5tdXRhdGlvbnNQYWNrYWdlLm11dGF0ZSh7ZGF0YSwgb2JqSWQ6IGlkLCBtdXRhdGlvbjogJ2RlbGV0ZScsIHVzZXJEYXRhfSlcbiAgICAgIGNxcnMudmlld3NQYWNrYWdlLnJlZnJlc2hWaWV3cyh7b2JqSWRzOiBbaWRdLCBsb2FkU25hcHNob3Q6IHRydWUsIGxvYWRNdXRhdGlvbnM6IHRydWUsIGFkZE11dGF0aW9uczogW2FkZGVkTXV0YXRpb25dfSkgLy8gbm90IGF3YWl0XG4gICAgICByZXR1cm4gdmFsaWRhdGVBcGlSZXNwb25zZSgnZGVsZXRlVXNlcicsIHtpZH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIExPRy53YXJuKFBBQ0tBR0UsICdwcm9ibGVtcyBkdXJpbmcgZGVsZXRlJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIGRlbGV0ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIHJlYWRVc2VyICh7bWV0YSwgZGF0YSwgaWR9KSB7XG4gICAgdHJ5IHtcbiAgICAgIExPRy5kZWJ1ZyhQQUNLQUdFLCBgc3RhcnQgcmVhZFVzZXIoKWAsIHttZXRhLCBkYXRhLCBpZH0pXG4gICAgICB2YWxpZGF0ZUFwaVJlcXVlc3QoJ3JlYWRVc2VyJywge21ldGEsIGRhdGEsIGlkfSlcbiAgICAgIGlkID0gaWQgfHwgZGF0YS5faWRcbiAgICAgIHZhciBjcXJzID0gYXdhaXQgZW50aXR5Q3FycyhyZXF1aXJlKCcuL2NvbmZpZy5Vc2VyJykpXG4gICAgICB2YXIgdmlld3NSZXN1bHQgPSBhd2FpdCBjcXJzLnZpZXdzUGFja2FnZS5nZXQoe2lkczogW2lkXX0pXG4gICAgICBMT0cuZGVidWcoUEFDS0FHRSwgYHJlYWRVc2VyIHZpZXdzUmVzdWx0YCwgdmlld3NSZXN1bHQpXG4gICAgICBpZiAodmlld3NSZXN1bHQubGVuZ3RoICE9PSAxKSB0aHJvdyBgaWQ6ICR7aWR9IEl0ZW0gTm90IEZvdW5kZWRgXG4gICAgICB2YXIgdXNlckRhdGEgPSBhd2FpdCBuZXRDbGllbnQuZW1pdCgnYXV0aG9yaXplJywge2FjdGlvbjogJ3JlYWQnLCBlbnRpdHlOYW1lOiAnVXNlcicsIG1ldGEsIGRhdGEsIGlkfSlcbiAgICAgIHJldHVybiB2YWxpZGF0ZUFwaVJlc3BvbnNlKCdyZWFkVXNlcicsIHZpZXdzUmVzdWx0WzBdKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMT0cud2FybihQQUNLQUdFLCAncHJvYmxlbXMgZHVyaW5nIHJlYWQnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgcmVhZCcsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIGF1dGhvcml6ZSAoe2FjdGlvbiwgZW50aXR5TmFtZSwgaWQsIG1ldGF9KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gREkud2Fybih7bXNnOiBgYXV0aG9yaXplYCwgZGVidWc6IHthY3Rpb24sIGVudGl0eU5hbWUsIGl0ZW1zSWRzLCBtZXRhfX0pXG4gICAgICByZXR1cm4ge1xuICAgICAgICB1c2VyRGF0YTogeyd1c2VySWQnOiAnMTk1MTUxNjYyNjYxJ31cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdwcm9ibGVtcyBkdXJpbmcgYXV0aG9yaXplJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuICAgIH1cbiAgfVxufVxuXG4vLyB2YXIgQ09ORklHID0gUi5tZXJnZShyZXF1aXJlKCcuL2NvbmZpZycpLCBjb25maWdPdmVyd3JpdGUpXG4vLyB2YXIgdXNlclBlcm1pc3Npb25CYXNlUGFja2FnZSA9IGF3YWl0IHJlcXVpcmUoJy4uL2VudGl0eS5iYXNlJykoQ09ORklHWydVc2VyUGVybWlzc2lvbiddLCBESSlcbi8vIHZhciB1c2VyQ3Fyc1BhY2thZ2UgPSBhd2FpdCByZXF1aXJlKCcuLi9lbnRpdHkuY3FycycpKENPTkZJR1snVXNlciddLCBESSlcbi8vIG1vZHVsZS5leHBvcnRzID0ge1xuLy8gICBhc3luYyB1cGRhdGVBdXRvcml6YXRpb25zVmlldyAoe2VudGl0eSwgaXRlbXMsIGl0ZW1zSWRzfSkge1xuLy8gICAgIHRyeSB7XG4vLyAgICAgICB2YXIgc3RvcmFnZVBhY2thZ2UgPSBhd2FpdCBDT05GSUcuYXV0b3JpemF0aW9uc1ZpZXcuc3RvcmFnZShDT05GSUcuYXV0b3JpemF0aW9uc1ZpZXcsIERJKVxuLy8gICAgICAgREkud2Fybih7bXNnOiBgdXBkYXRlVmlld2AsIGRlYnVnOiB7bWV0YSwgaXRlbXMsIGl0ZW1zSWRzfX0pXG4vLyAgICAgICBpdGVtcyA9IFIubWFwKENPTkZJRy5hdXRvcml6YXRpb25zVmlldy5maWx0ZXJJbmNvbWluZ0RhdGEsIGl0ZW1zKVxuLy8gICAgICAgaXRlbXMgPSBSLm1hcChSLm1lcmdlKHsnX2VudGl0eSc6IGVudGl0eX0pLCBpdGVtcylcbi8vICAgICAgIGF3YWl0IHN0b3JhZ2VQYWNrYWdlLnVwZGF0ZSh7XG4vLyAgICAgICAgIHF1ZXJpZXNBcnJheTogUi5tYXAoKGl0ZW1JZCkgPT4gKHsnX2lkJzogaXRlbUlkfSksIGl0ZW1zSWRzKSxcbi8vICAgICAgICAgZGF0YUFycmF5OiBpdGVtcyxcbi8vICAgICAgICAgaW5zZXJ0SWZOb3RFeGlzdHM6IHRydWV9KVxuLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4vLyAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZSh7bWVzc2FnZTogJ3Byb2JsZW1zIGR1cmluZyB1cGRhdGVBdXRvcml6YXRpb25zVmlldycsIG9yaWdpbmFsRXJyb3I6IGVycm9yfSlcbi8vICAgICB9XG4vLyAgIH0sXG4vLyAgIGFzeW5jICBhdXRob3JpemUgKHthY3Rpb24sIGVudGl0eU5hbWUsIGl0ZW1zSWRzLCBtZXRhfSkge1xuLy8gICAgIHRyeSB7XG4vLyAgICAgICAvLyBESS53YXJuKHttc2c6IGBhdXRob3JpemVgLCBkZWJ1Zzoge2FjdGlvbiwgZW50aXR5TmFtZSwgaXRlbXNJZHMsIG1ldGF9fSlcbi8vICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgIHVzZXJEYXRhOiB7J3VzZXJJZCc6ICcxOTUxNTE2NjI2NjEnfVxuLy8gICAgICAgfVxuLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4vLyAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZSh7bWVzc2FnZTogJ3Byb2JsZW1zIGR1cmluZyBhdXRob3JpemUnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn0pXG4vLyAgICAgfVxuLy8gICB9LFxuLy8gICBhc3luYyAgdGVzdCAodGVzdCkge1xuLy8gICAgIHRyeSB7XG4vLyAgICAgICByZXR1cm4gdGVzdFxuLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4vLyAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZSh7bWVzc2FnZTogJ3Byb2JsZW1zIGR1cmluZyB0ZXN0Jywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuLy8gICAgIH1cbi8vICAgfSxcbi8vICAgYXN5bmMgIHVwZGF0ZVVzZXJQZXJtaXNzaW9uUm91dGUgKHttZXRhLCBpdGVtcywgaXRlbXNJZHN9KSB7XG4vLyAgICAgdHJ5IHtcbi8vICAgICAgICh7aXRlbXMsIGl0ZW1zSWRzfSA9IHJlcXVpcmUoJy4uL2plc3VzJykuY2hlY2tSZXF1ZXN0SXRlbXNJZHNBbmRJdGVtcyh7aXRlbXMsIGl0ZW1zSWRzLCBhcHBlbmRJZHNUb0l0ZW1zOiB0cnVlfSkpXG4vLyAgICAgICB2YXIgZmlsdGVyUHJvcHMgPSBSLnBpY2tCeSgodmFsLCBrZXkpID0+IChrZXkgPT09ICdfaWQnIHx8IGtleS5jaGFyQXQoMCkgIT09ICdfJykpIC8vIHJlbW92ZSBpdGVtcyBkYXRhIHN0YXJ0aW5nIHdpdGggXyAoZXhjbHVkZSBfaWQgKVxuLy8gICAgICAgaXRlbXMgPSBSLm1hcChmaWx0ZXJQcm9wcywgaXRlbXMpXG4vLyAgICAgICB2YXIgdXNlckRhdGEgPSBhd2FpdCBESS5hdXRob3JpemUoe2FjdGlvbjogJ3dyaXRlLnVwZGF0ZScsIGVudGl0eU5hbWU6ICdVc2VyUGVybWlzc2lvbicsIGl0ZW1zLCBpdGVtc0lkcywgbWV0YX0pXG4vLyAgICAgICBhd2FpdCB1c2VyUGVybWlzc2lvbkJhc2VQYWNrYWdlLnVwZGF0ZSh7aXRlbXMsIGl0ZW1zSWRzLCB1c2VyRGF0YX0pXG4vLyAgICAgICByZXR1cm4ge2l0ZW1zSWRzfVxuLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4vLyAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZSh7bWVzc2FnZTogJ1Blcm1pc3Npb24gcHJvYmxlbXMgZHVyaW5nIHVwZGF0ZSd9KVxuLy8gICAgIH1cbi8vICAgfSxcbi8vXG4vLyAgIGFzeW5jICBkZWxldGVVc2VyUGVybWlzc2lvblJvdXRlICh7bWV0YSwgaXRlbXNJZHMsIGl0ZW1zfSkge1xuLy8gICAgIHRyeSB7XG4vLyAgICAgICAoe2l0ZW1zSWRzfSA9IHJlcXVpcmUoJy4uL2plc3VzJykuY2hlY2tSZXF1ZXN0SXRlbXNJZHNBbmRJdGVtcyh7aXRlbXMsIGl0ZW1zSWRzfSkpXG4vLyAgICAgICBpdGVtcyA9IFIubWFwKCgpID0+ICh7J19kZWxldGVkJzogdHJ1ZX0pLCBpdGVtc0lkcylcbi8vICAgICAgIC8vIGNvbnNvbGUubG9nKHtpdGVtc30pXG4vLyAgICAgICB2YXIgdXNlckRhdGEgPSBhd2FpdCBESS5hdXRob3JpemUoe2FjdGlvbjogJ3dyaXRlLmRlbGV0ZScsIGVudGl0eU5hbWU6ICdVc2VyUGVybWlzc2lvbicsIGl0ZW1zLCBpdGVtc0lkcywgbWV0YX0pXG4vLyAgICAgICBhd2FpdCB1c2VyUGVybWlzc2lvbkJhc2VQYWNrYWdlLnVwZGF0ZSh7aXRlbXMsIGl0ZW1zSWRzLCB1c2VyRGF0YX0pXG4vLyAgICAgICByZXR1cm4ge2l0ZW1zSWRzfVxuLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4vLyAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZSh7bWVzc2FnZTogJ1Blcm1pc3Npb24gcHJvYmxlbXMgZHVyaW5nIGRlbGV0ZSd9KVxuLy8gICAgIH1cbi8vICAgfSxcbi8vICAgYXN5bmMgIHJlYWRVc2VyUGVybWlzc2lvblJvdXRlICh7bWV0YSwgaXRlbXMsIGl0ZW1zSWRzfSkge1xuLy8gICAgIHRyeSB7XG4vLyAgICAgICAoe2l0ZW1zSWRzfSA9IHJlcXVpcmUoJy4uL2plc3VzJykuY2hlY2tSZXF1ZXN0SXRlbXNJZHNBbmRJdGVtcyh7aXRlbXNJZHN9KSlcbi8vICAgICAgIHZhciB1c2VyRGF0YSA9IGF3YWl0IERJLmF1dGhvcml6ZSh7YWN0aW9uOiAncmVhZCcsIGVudGl0eU5hbWU6ICdVc2VyUGVybWlzc2lvbicsIGl0ZW1zLCBpdGVtc0lkcywgbWV0YX0pXG4vLyAgICAgICBpdGVtcyA9IGF3YWl0IHVzZXJQZXJtaXNzaW9uQmFzZVBhY2thZ2UucmVhZCh7aXRlbXMsIGl0ZW1zSWRzLCB1c2VyRGF0YX0pXG4vLyAgICAgICByZXR1cm4ge2l0ZW1zfVxuLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4vLyAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZSh7bWVzc2FnZTogJ1Blcm1pc3Npb24gcHJvYmxlbXMgZHVyaW5nIHJlYWQnfSlcbi8vICAgICB9XG4vLyAgIH0sXG5cbi8vICAgYXN5bmMgIGRlbGV0ZVVzZXJSb3V0ZSAoe21ldGEsIGl0ZW1zSWRzLCBpdGVtc30pIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgKHtpdGVtc0lkc30gPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMoe2l0ZW1zSWRzfSkpXG4vLyAgICAgICB2YXIgdXNlckRhdGEgPSBhd2FpdCBESS5hdXRob3JpemUoe2FjdGlvbjogJ3dyaXRlLmRlbGV0ZScsIGVudGl0eU5hbWU6ICdVc2VyJywgaXRlbXNJZHMsIG1ldGF9KVxuLy8gICAgICAgYXdhaXQgdXNlckNxcnNQYWNrYWdlLm11dGF0ZSh7aXRlbXNJZHMsIG11dGF0aW9uOiAnZGVsZXRlJywgdXNlckRhdGF9KVxuLy8gICAgICAgYXdhaXQgdXNlckNxcnNQYWNrYWdlLnJlZnJlc2hWaWV3cyh7aXRlbXNJZHMsIGxvYWRTbmFwc2hvdDogdHJ1ZSwgbG9hZE11dGF0aW9uczogdHJ1ZSB9KSAvLyBub3QgYXdhaXRcbi8vICAgICAgIHJldHVybiB7aXRlbXNJZHN9XG4vLyAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbi8vICAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKGVycm9yKVxuLy8gICAgIH1cbi8vICAgfSxcbi8vICAgYXN5bmMgIHJlYWRVc2VyUm91dGUgKHttZXRhLCBpdGVtc0lkc30pIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgKHtpdGVtc0lkc30gPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMoe2l0ZW1zSWRzfSkpXG4vLyAgICAgICB2YXIgdXNlckRhdGEgPSBhd2FpdCBESS5hdXRob3JpemUoe2FjdGlvbjogJ3JlYWQnLCBlbnRpdHlOYW1lOiAnVXNlcicsIGl0ZW1zSWRzLCBtZXRhfSlcbi8vICAgICAgIHZhciBpdGVtcyA9IGF3YWl0IHVzZXJDcXJzUGFja2FnZS5yZWFkKHtpdGVtc0lkc30pXG4vLyAgICAgICAvLyBjb25zb2xlLmxvZyh7aXRlbXNJZHMsIGl0ZW1zfSlcbi8vICAgICAgIHJldHVybiB7aXRlbXN9XG4vLyAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbi8vICAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKGVycm9yKVxuLy8gICAgIH1cbi8vICAgfX1cbiJdfQ==