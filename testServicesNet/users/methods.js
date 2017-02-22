'use strict';

var entityCqrs = require('../../../entity.cqrs');
var jesus = require('../../../jesus');
var uuidV4 = require('uuid/v4');
var LOG = jesus.LOG(serviceName, serviceId, PACKAGE);
process.on('unhandledRejection', function (reason, promise) {
  return LOG.error('unhandledRejection Reason: ', promise, reason);
});

var CONFIG = require('./config');
var PACKAGE = 'service.users';

var getAllServicesConfig = function getAllServicesConfig(schema) {
  return jesus.getAllServicesConfigFromDir(CONFIG.sharedServicesPath, schema);
};
var validateApiRequest = function validateApiRequest(apiMethod, data) {
  return jesus.validateApiFromConfig(CONFIG.sharedServicePath + '/methods.json', apiMethod, data, 'requestSchema');
};
var validateApiResponse = function validateApiResponse(apiMethod, data) {
  return jesus.validateApiFromConfig(CONFIG.sharedServicePath + '/methods.json', apiMethod, data, 'responseSchema');
};

var NET_CLIENT_ARGS = { getAllServicesConfig: getAllServicesConfig, sharedServicePath: CONFIG.sharedServicePath };
var netClient = require('../../../net.client')(NET_CLIENT_ARGS);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZHMuZXM2Il0sIm5hbWVzIjpbImVudGl0eUNxcnMiLCJyZXF1aXJlIiwiamVzdXMiLCJ1dWlkVjQiLCJMT0ciLCJjb25zb2xlIiwicHJvY2VzcyIsIm9uIiwicmVhc29uIiwicHJvbWlzZSIsImVycm9yIiwiQ09ORklHIiwiUEFDS0FHRSIsImdldEFsbFNlcnZpY2VzQ29uZmlnIiwic2NoZW1hIiwiZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyIiwic2hhcmVkU2VydmljZXNQYXRoIiwidmFsaWRhdGVBcGlSZXF1ZXN0IiwiYXBpTWV0aG9kIiwiZGF0YSIsInZhbGlkYXRlQXBpRnJvbUNvbmZpZyIsInNoYXJlZFNlcnZpY2VQYXRoIiwidmFsaWRhdGVBcGlSZXNwb25zZSIsIk5FVF9DTElFTlRfQVJHUyIsIm5ldENsaWVudCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0ZXN0IiwibWVzc2FnZSIsIm9yaWdpbmFsRXJyb3IiLCJjcmVhdGVVc2VyIiwibWV0YSIsImlkIiwicHJvZmlsZSIsImRlYnVnIiwiX2lkIiwiY3FycyIsImVtaXQiLCJhY3Rpb24iLCJlbnRpdHlOYW1lIiwidXNlckRhdGEiLCJtdXRhdGlvbnNQYWNrYWdlIiwibXV0YXRlIiwib2JqSWQiLCJtdXRhdGlvbiIsImFkZGVkTXV0YXRpb24iLCJ2aWV3c1BhY2thZ2UiLCJyZWZyZXNoVmlld3MiLCJvYmpJZHMiLCJsb2FkU25hcHNob3QiLCJsb2FkTXV0YXRpb25zIiwiYWRkTXV0YXRpb25zIiwicHJvZmlsZUVuZCIsIndhcm4iLCJ1cGRhdGVVc2VyIiwiZGVsZXRlVXNlciIsInJlYWRVc2VyIiwiZ2V0IiwiaWRzIiwidmlld3NSZXN1bHQiLCJsZW5ndGgiLCJhdXRob3JpemUiLCJESSIsImVycm9yUmVzcG9uc2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsYUFBYUMsUUFBUSxzQkFBUixDQUFqQjtBQUNBLElBQUlDLFFBQVFELFFBQVEsZ0JBQVIsQ0FBWjtBQUNBLElBQU1FLFNB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Q0xTLHdCQUFVLEVBQUMsVUFBVSxjQUFYO0FBREwsYUExRUk7O0FBQUE7QUFBQTtBQUFBO0FBQUEsOENBOEVKc0IsR0FBR0MsYUFBSCxDQUFpQixFQUFDbkMsU0FBUywyQkFBVixFQUF1Q0MsMkJBQXZDLEVBQWpCLENBOUVJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakI7O0FBbUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1ldGhvZHMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVudGl0eUNxcnMgPSByZXF1aXJlKCcuLi8uLi8uLi9lbnRpdHkuY3FycycpXG52YXIgamVzdXMgPSByZXF1aXJlKCcuLi8uLi8uLi9qZXN1cycpXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcbnZhciBMT0cgPSBjb25zb2xlXG5wcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwcm9taXNlKSA9PiBMT0cuZXJyb3IoJ3VuaGFuZGxlZFJlamVjdGlvbiBSZWFzb246ICcsIHByb21pc2UsIHJlYXNvbikpXG5cbnZhciBDT05GSUcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG5jb25zdCBQQUNLQUdFID0gJ3NlcnZpY2UudXNlcnMnXG5cbmNvbnN0IGdldEFsbFNlcnZpY2VzQ29uZmlnID0gKHNjaGVtYSkgPT4gamVzdXMuZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyKENPTkZJRy5zaGFyZWRTZXJ2aWNlc1BhdGgsIHNjaGVtYSlcbmNvbnN0IHZhbGlkYXRlQXBpUmVxdWVzdCA9IChhcGlNZXRob2QsIGRhdGEpID0+IGplc3VzLnZhbGlkYXRlQXBpRnJvbUNvbmZpZyhDT05GSUcuc2hhcmVkU2VydmljZVBhdGggKyAnL2FwaS5qc29uJywgYXBpTWV0aG9kLCBkYXRhLCAncmVxdWVzdFNjaGVtYScpXG5jb25zdCB2YWxpZGF0ZUFwaVJlc3BvbnNlID0gKGFwaU1ldGhvZCwgZGF0YSkgPT4gamVzdXMudmFsaWRhdGVBcGlGcm9tQ29uZmlnKENPTkZJRy5zaGFyZWRTZXJ2aWNlUGF0aCArICcvYXBpLmpzb24nLCBhcGlNZXRob2QsIGRhdGEsICdyZXNwb25zZVNjaGVtYScpXG5cbmNvbnN0IE5FVF9DTElFTlRfQVJHUyA9IHtnZXRBbGxTZXJ2aWNlc0NvbmZpZywgc2hhcmVkU2VydmljZVBhdGg6IENPTkZJRy5zaGFyZWRTZXJ2aWNlUGF0aH1cbnZhciBuZXRDbGllbnQgPSByZXF1aXJlKCcuLi8uLi8uLi9uZXQuY2xpZW50JykoTkVUX0NMSUVOVF9BUkdTKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXN5bmMgIHRlc3QgKHRlc3QpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRlc3RcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIExPRy5lcnJvcih7bWVzc2FnZTogJ3Byb2JsZW1zIGR1cmluZyB0ZXN0Jywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIGNyZWF0ZVVzZXIgKHttZXRhLCBkYXRhLCBpZH0pIHtcbiAgICB0cnkge1xuICAgICAgTE9HLnByb2ZpbGUoXCJjcmVhdGVVc2VyXCIpXG4gICAgICBMT0cuZGVidWcoUEFDS0FHRSwgYHN0YXJ0IGNyZWF0ZVVzZXIoKWAsIHttZXRhLCBkYXRhLCBpZH0pXG4gICAgICB2YWxpZGF0ZUFwaVJlcXVlc3QoJ2NyZWF0ZVVzZXInLCB7bWV0YSwgZGF0YSwgaWR9KVxuICAgICAgZGF0YS5faWQgPSBpZCA9IGlkIHx8IGRhdGEuX2lkIHx8IHV1aWRWNCgpIC8vIGdlbmVyYXRlIGlkIGlmIG5lY2Vzc2FyeVxuICAgICAgdmFyIGNxcnMgPSBhd2FpdCBlbnRpdHlDcXJzKHJlcXVpcmUoJy4vY29uZmlnLlVzZXInKSlcbiAgICAgIHZhciB1c2VyRGF0YSA9IGF3YWl0IG5ldENsaWVudC5lbWl0KCdhdXRob3JpemUnLCB7YWN0aW9uOiAnd3JpdGUuY3JlYXRlJywgZW50aXR5TmFtZTogJ1VzZXInLCBtZXRhLCBkYXRhLCBpZH0pXG4gICAgICB2YXIgYWRkZWRNdXRhdGlvbiA9IGF3YWl0IGNxcnMubXV0YXRpb25zUGFja2FnZS5tdXRhdGUoe2RhdGEsIG9iaklkOiBpZCwgbXV0YXRpb246ICdjcmVhdGUnLCB1c2VyRGF0YX0pXG4gICAgICBjcXJzLnZpZXdzUGFja2FnZS5yZWZyZXNoVmlld3Moe29iaklkczogW2lkXSwgbG9hZFNuYXBzaG90OiBmYWxzZSwgbG9hZE11dGF0aW9uczogZmFsc2UsIGFkZE11dGF0aW9uczogW2FkZGVkTXV0YXRpb25dfSkgLy8gbm90IGF3YWl0XG4gICAgICBMT0cucHJvZmlsZUVuZChcImNyZWF0ZVVzZXJcIilcbiAgICAgIHJldHVybiB2YWxpZGF0ZUFwaVJlc3BvbnNlKCdjcmVhdGVVc2VyJywge2lkfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTE9HLndhcm4oUEFDS0FHRSwgJ3Byb2JsZW1zIGR1cmluZyBjcmVhdGUnLCBlcnJvcilcbiAgICAgIHJldHVybiB7ZXJyb3I6ICdwcm9ibGVtcyBkdXJpbmcgY3JlYXRlJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9XG4gICAgfVxuICB9LFxuICBhc3luYyAgdXBkYXRlVXNlciAoe21ldGEsIGRhdGEsIGlkfSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cuZGVidWcoUEFDS0FHRSwgYHN0YXJ0IHVwZGF0ZVVzZXIoKWAsIHttZXRhLCBkYXRhLCBpZH0pXG4gICAgICB2YWxpZGF0ZUFwaVJlcXVlc3QoJ3VwZGF0ZVVzZXInLCB7bWV0YSwgZGF0YSwgaWR9KVxuICAgICAgZGF0YS5faWQgPSBpZCA9IGlkIHx8IGRhdGEuX2lkXG4gICAgICB2YXIgY3FycyA9IGF3YWl0IGVudGl0eUNxcnMocmVxdWlyZSgnLi9jb25maWcuVXNlcicpKVxuICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgbmV0Q2xpZW50LmVtaXQoJ2F1dGhvcml6ZScsIHthY3Rpb246ICd3cml0ZS51cGRhdGUnLCBlbnRpdHlOYW1lOiAnVXNlcicsIG1ldGEsIGRhdGEsIGlkfSlcbiAgICAgIHZhciBhZGRlZE11dGF0aW9uID0gYXdhaXQgY3Fycy5tdXRhdGlvbnNQYWNrYWdlLm11dGF0ZSh7ZGF0YSwgb2JqSWQ6IGlkLCBtdXRhdGlvbjogJ3VwZGF0ZScsIHVzZXJEYXRhfSlcbiAgICAgIGNxcnMudmlld3NQYWNrYWdlLnJlZnJlc2hWaWV3cyh7b2JqSWRzOiBbaWRdLCBsb2FkU25hcHNob3Q6IHRydWUsIGxvYWRNdXRhdGlvbnM6IHRydWUsIGFkZE11dGF0aW9uczogW2FkZGVkTXV0YXRpb25dfSkgLy8gbm90IGF3YWl0XG4gICAgICByZXR1cm4gdmFsaWRhdGVBcGlSZXNwb25zZSgndXBkYXRlVXNlcicsIHtpZH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIExPRy53YXJuKFBBQ0tBR0UsICdwcm9ibGVtcyBkdXJpbmcgdXBkYXRlJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHVwZGF0ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfVxuICAgIH1cbiAgfSxcbiAgYXN5bmMgIGRlbGV0ZVVzZXIgKHttZXRhLCBkYXRhLCBpZH0pIHtcbiAgICB0cnkge1xuICAgICAgTE9HLmRlYnVnKFBBQ0tBR0UsIGBzdGFydCBkZWxldGVVc2VyKClgLCB7bWV0YSwgZGF0YSwgaWR9KVxuICAgICAgdmFsaWRhdGVBcGlSZXF1ZXN0KCdkZWxldGVVc2VyJywge21ldGEsIGRhdGEsIGlkfSlcbiAgICAgIGRhdGEuX2lkID0gaWQgPSBpZCB8fCBkYXRhLl9pZFxuICAgICAgdmFyIGNxcnMgPSBhd2FpdCBlbnRpdHlDcXJzKHJlcXVpcmUoJy4vY29uZmlnLlVzZXInKSlcbiAgICAgIHZhciB1c2VyRGF0YSA9IGF3YWl0IG5ldENsaWVudC5lbWl0KCdhdXRob3JpemUnLCB7YWN0aW9uOiAnd3JpdGUuZGVsZXRlJywgZW50aXR5TmFtZTogJ1VzZXInLCBtZXRhLCBkYXRhLCBpZH0pXG4gICAgICB2YXIgYWRkZWRNdXRhdGlvbiA9IGF3YWl0IGNxcnMubXV0YXRpb25zUGFja2FnZS5tdXRhdGUoe2RhdGEsIG9iaklkOiBpZCwgbXV0YXRpb246ICdkZWxldGUnLCB1c2VyRGF0YX0pXG4gICAgICBjcXJzLnZpZXdzUGFja2FnZS5yZWZyZXNoVmlld3Moe29iaklkczogW2lkXSwgbG9hZFNuYXBzaG90OiB0cnVlLCBsb2FkTXV0YXRpb25zOiB0cnVlLCBhZGRNdXRhdGlvbnM6IFthZGRlZE11dGF0aW9uXX0pIC8vIG5vdCBhd2FpdFxuICAgICAgcmV0dXJuIHZhbGlkYXRlQXBpUmVzcG9uc2UoJ2RlbGV0ZVVzZXInLCB7aWR9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMT0cud2FybihQQUNLQUdFLCAncHJvYmxlbXMgZHVyaW5nIGRlbGV0ZScsIGVycm9yKVxuICAgICAgcmV0dXJuIHtlcnJvcjogJ3Byb2JsZW1zIGR1cmluZyBkZWxldGUnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICByZWFkVXNlciAoe21ldGEsIGRhdGEsIGlkfSkge1xuICAgIHRyeSB7XG4gICAgICBMT0cuZGVidWcoUEFDS0FHRSwgYHN0YXJ0IHJlYWRVc2VyKClgLCB7bWV0YSwgZGF0YSwgaWR9KVxuICAgICAgdmFsaWRhdGVBcGlSZXF1ZXN0KCdyZWFkVXNlcicsIHttZXRhLCBkYXRhLCBpZH0pXG4gICAgICBpZCA9IGlkIHx8IGRhdGEuX2lkXG4gICAgICB2YXIgY3FycyA9IGF3YWl0IGVudGl0eUNxcnMocmVxdWlyZSgnLi9jb25maWcuVXNlcicpKVxuICAgICAgdmFyIHZpZXdzUmVzdWx0ID0gYXdhaXQgY3Fycy52aWV3c1BhY2thZ2UuZ2V0KHtpZHM6IFtpZF19KVxuICAgICAgTE9HLmRlYnVnKFBBQ0tBR0UsIGByZWFkVXNlciB2aWV3c1Jlc3VsdGAsIHZpZXdzUmVzdWx0KVxuICAgICAgaWYgKHZpZXdzUmVzdWx0Lmxlbmd0aCAhPT0gMSkgdGhyb3cgYGlkOiAke2lkfSBJdGVtIE5vdCBGb3VuZGVkYFxuICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgbmV0Q2xpZW50LmVtaXQoJ2F1dGhvcml6ZScsIHthY3Rpb246ICdyZWFkJywgZW50aXR5TmFtZTogJ1VzZXInLCBtZXRhLCBkYXRhLCBpZH0pXG4gICAgICByZXR1cm4gdmFsaWRhdGVBcGlSZXNwb25zZSgncmVhZFVzZXInLCB2aWV3c1Jlc3VsdFswXSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTE9HLndhcm4oUEFDS0FHRSwgJ3Byb2JsZW1zIGR1cmluZyByZWFkJywgZXJyb3IpXG4gICAgICByZXR1cm4ge2Vycm9yOiAncHJvYmxlbXMgZHVyaW5nIHJlYWQnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn1cbiAgICB9XG4gIH0sXG4gIGFzeW5jICBhdXRob3JpemUgKHthY3Rpb24sIGVudGl0eU5hbWUsIGlkLCBtZXRhfSkge1xuICAgIHRyeSB7XG4gICAgICAgIC8vIERJLndhcm4oe21zZzogYGF1dGhvcml6ZWAsIGRlYnVnOiB7YWN0aW9uLCBlbnRpdHlOYW1lLCBpdGVtc0lkcywgbWV0YX19KVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXNlckRhdGE6IHsndXNlcklkJzogJzE5NTE1MTY2MjY2MSd9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKHttZXNzYWdlOiAncHJvYmxlbXMgZHVyaW5nIGF1dGhvcml6ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfSlcbiAgICB9XG4gIH1cbn1cblxuLy8gdmFyIENPTkZJRyA9IFIubWVyZ2UocmVxdWlyZSgnLi9jb25maWcnKSwgY29uZmlnT3ZlcndyaXRlKVxuLy8gdmFyIHVzZXJQZXJtaXNzaW9uQmFzZVBhY2thZ2UgPSBhd2FpdCByZXF1aXJlKCcuLi9lbnRpdHkuYmFzZScpKENPTkZJR1snVXNlclBlcm1pc3Npb24nXSwgREkpXG4vLyB2YXIgdXNlckNxcnNQYWNrYWdlID0gYXdhaXQgcmVxdWlyZSgnLi4vZW50aXR5LmNxcnMnKShDT05GSUdbJ1VzZXInXSwgREkpXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHtcbi8vICAgYXN5bmMgdXBkYXRlQXV0b3JpemF0aW9uc1ZpZXcgKHtlbnRpdHksIGl0ZW1zLCBpdGVtc0lkc30pIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgdmFyIHN0b3JhZ2VQYWNrYWdlID0gYXdhaXQgQ09ORklHLmF1dG9yaXphdGlvbnNWaWV3LnN0b3JhZ2UoQ09ORklHLmF1dG9yaXphdGlvbnNWaWV3LCBESSlcbi8vICAgICAgIERJLndhcm4oe21zZzogYHVwZGF0ZVZpZXdgLCBkZWJ1Zzoge21ldGEsIGl0ZW1zLCBpdGVtc0lkc319KVxuLy8gICAgICAgaXRlbXMgPSBSLm1hcChDT05GSUcuYXV0b3JpemF0aW9uc1ZpZXcuZmlsdGVySW5jb21pbmdEYXRhLCBpdGVtcylcbi8vICAgICAgIGl0ZW1zID0gUi5tYXAoUi5tZXJnZSh7J19lbnRpdHknOiBlbnRpdHl9KSwgaXRlbXMpXG4vLyAgICAgICBhd2FpdCBzdG9yYWdlUGFja2FnZS51cGRhdGUoe1xuLy8gICAgICAgICBxdWVyaWVzQXJyYXk6IFIubWFwKChpdGVtSWQpID0+ICh7J19pZCc6IGl0ZW1JZH0pLCBpdGVtc0lkcyksXG4vLyAgICAgICAgIGRhdGFBcnJheTogaXRlbXMsXG4vLyAgICAgICAgIGluc2VydElmTm90RXhpc3RzOiB0cnVlfSlcbi8vICAgICB9IGNhdGNoIChlcnJvcikge1xuLy8gICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdwcm9ibGVtcyBkdXJpbmcgdXBkYXRlQXV0b3JpemF0aW9uc1ZpZXcnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn0pXG4vLyAgICAgfVxuLy8gICB9LFxuLy8gICBhc3luYyAgYXV0aG9yaXplICh7YWN0aW9uLCBlbnRpdHlOYW1lLCBpdGVtc0lkcywgbWV0YX0pIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgLy8gREkud2Fybih7bXNnOiBgYXV0aG9yaXplYCwgZGVidWc6IHthY3Rpb24sIGVudGl0eU5hbWUsIGl0ZW1zSWRzLCBtZXRhfX0pXG4vLyAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICB1c2VyRGF0YTogeyd1c2VySWQnOiAnMTk1MTUxNjYyNjYxJ31cbi8vICAgICAgIH1cbi8vICAgICB9IGNhdGNoIChlcnJvcikge1xuLy8gICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdwcm9ibGVtcyBkdXJpbmcgYXV0aG9yaXplJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuLy8gICAgIH1cbi8vICAgfSxcbi8vICAgYXN5bmMgIHRlc3QgKHRlc3QpIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgcmV0dXJuIHRlc3Rcbi8vICAgICB9IGNhdGNoIChlcnJvcikge1xuLy8gICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdwcm9ibGVtcyBkdXJpbmcgdGVzdCcsIG9yaWdpbmFsRXJyb3I6IGVycm9yfSlcbi8vICAgICB9XG4vLyAgIH0sXG4vLyAgIGFzeW5jICB1cGRhdGVVc2VyUGVybWlzc2lvblJvdXRlICh7bWV0YSwgaXRlbXMsIGl0ZW1zSWRzfSkge1xuLy8gICAgIHRyeSB7XG4vLyAgICAgICAoe2l0ZW1zLCBpdGVtc0lkc30gPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMoe2l0ZW1zLCBpdGVtc0lkcywgYXBwZW5kSWRzVG9JdGVtczogdHJ1ZX0pKVxuLy8gICAgICAgdmFyIGZpbHRlclByb3BzID0gUi5waWNrQnkoKHZhbCwga2V5KSA9PiAoa2V5ID09PSAnX2lkJyB8fCBrZXkuY2hhckF0KDApICE9PSAnXycpKSAvLyByZW1vdmUgaXRlbXMgZGF0YSBzdGFydGluZyB3aXRoIF8gKGV4Y2x1ZGUgX2lkIClcbi8vICAgICAgIGl0ZW1zID0gUi5tYXAoZmlsdGVyUHJvcHMsIGl0ZW1zKVxuLy8gICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgREkuYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS51cGRhdGUnLCBlbnRpdHlOYW1lOiAnVXNlclBlcm1pc3Npb24nLCBpdGVtcywgaXRlbXNJZHMsIG1ldGF9KVxuLy8gICAgICAgYXdhaXQgdXNlclBlcm1pc3Npb25CYXNlUGFja2FnZS51cGRhdGUoe2l0ZW1zLCBpdGVtc0lkcywgdXNlckRhdGF9KVxuLy8gICAgICAgcmV0dXJuIHtpdGVtc0lkc31cbi8vICAgICB9IGNhdGNoIChlcnJvcikge1xuLy8gICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdQZXJtaXNzaW9uIHByb2JsZW1zIGR1cmluZyB1cGRhdGUnfSlcbi8vICAgICB9XG4vLyAgIH0sXG4vL1xuLy8gICBhc3luYyAgZGVsZXRlVXNlclBlcm1pc3Npb25Sb3V0ZSAoe21ldGEsIGl0ZW1zSWRzLCBpdGVtc30pIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgKHtpdGVtc0lkc30gPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMoe2l0ZW1zLCBpdGVtc0lkc30pKVxuLy8gICAgICAgaXRlbXMgPSBSLm1hcCgoKSA9PiAoeydfZGVsZXRlZCc6IHRydWV9KSwgaXRlbXNJZHMpXG4vLyAgICAgICAvLyBjb25zb2xlLmxvZyh7aXRlbXN9KVxuLy8gICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgREkuYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS5kZWxldGUnLCBlbnRpdHlOYW1lOiAnVXNlclBlcm1pc3Npb24nLCBpdGVtcywgaXRlbXNJZHMsIG1ldGF9KVxuLy8gICAgICAgYXdhaXQgdXNlclBlcm1pc3Npb25CYXNlUGFja2FnZS51cGRhdGUoe2l0ZW1zLCBpdGVtc0lkcywgdXNlckRhdGF9KVxuLy8gICAgICAgcmV0dXJuIHtpdGVtc0lkc31cbi8vICAgICB9IGNhdGNoIChlcnJvcikge1xuLy8gICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdQZXJtaXNzaW9uIHByb2JsZW1zIGR1cmluZyBkZWxldGUnfSlcbi8vICAgICB9XG4vLyAgIH0sXG4vLyAgIGFzeW5jICByZWFkVXNlclBlcm1pc3Npb25Sb3V0ZSAoe21ldGEsIGl0ZW1zLCBpdGVtc0lkc30pIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgKHtpdGVtc0lkc30gPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMoe2l0ZW1zSWRzfSkpXG4vLyAgICAgICB2YXIgdXNlckRhdGEgPSBhd2FpdCBESS5hdXRob3JpemUoe2FjdGlvbjogJ3JlYWQnLCBlbnRpdHlOYW1lOiAnVXNlclBlcm1pc3Npb24nLCBpdGVtcywgaXRlbXNJZHMsIG1ldGF9KVxuLy8gICAgICAgaXRlbXMgPSBhd2FpdCB1c2VyUGVybWlzc2lvbkJhc2VQYWNrYWdlLnJlYWQoe2l0ZW1zLCBpdGVtc0lkcywgdXNlckRhdGF9KVxuLy8gICAgICAgcmV0dXJuIHtpdGVtc31cbi8vICAgICB9IGNhdGNoIChlcnJvcikge1xuLy8gICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdQZXJtaXNzaW9uIHByb2JsZW1zIGR1cmluZyByZWFkJ30pXG4vLyAgICAgfVxuLy8gICB9LFxuXG4vLyAgIGFzeW5jICBkZWxldGVVc2VyUm91dGUgKHttZXRhLCBpdGVtc0lkcywgaXRlbXN9KSB7XG4vLyAgICAgdHJ5IHtcbi8vICAgICAgICh7aXRlbXNJZHN9ID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVlc3RJdGVtc0lkc0FuZEl0ZW1zKHtpdGVtc0lkc30pKVxuLy8gICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgREkuYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS5kZWxldGUnLCBlbnRpdHlOYW1lOiAnVXNlcicsIGl0ZW1zSWRzLCBtZXRhfSlcbi8vICAgICAgIGF3YWl0IHVzZXJDcXJzUGFja2FnZS5tdXRhdGUoe2l0ZW1zSWRzLCBtdXRhdGlvbjogJ2RlbGV0ZScsIHVzZXJEYXRhfSlcbi8vICAgICAgIGF3YWl0IHVzZXJDcXJzUGFja2FnZS5yZWZyZXNoVmlld3Moe2l0ZW1zSWRzLCBsb2FkU25hcHNob3Q6IHRydWUsIGxvYWRNdXRhdGlvbnM6IHRydWUgfSkgLy8gbm90IGF3YWl0XG4vLyAgICAgICByZXR1cm4ge2l0ZW1zSWRzfVxuLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4vLyAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZShlcnJvcilcbi8vICAgICB9XG4vLyAgIH0sXG4vLyAgIGFzeW5jICByZWFkVXNlclJvdXRlICh7bWV0YSwgaXRlbXNJZHN9KSB7XG4vLyAgICAgdHJ5IHtcbi8vICAgICAgICh7aXRlbXNJZHN9ID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVlc3RJdGVtc0lkc0FuZEl0ZW1zKHtpdGVtc0lkc30pKVxuLy8gICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgREkuYXV0aG9yaXplKHthY3Rpb246ICdyZWFkJywgZW50aXR5TmFtZTogJ1VzZXInLCBpdGVtc0lkcywgbWV0YX0pXG4vLyAgICAgICB2YXIgaXRlbXMgPSBhd2FpdCB1c2VyQ3Fyc1BhY2thZ2UucmVhZCh7aXRlbXNJZHN9KVxuLy8gICAgICAgLy8gY29uc29sZS5sb2coe2l0ZW1zSWRzLCBpdGVtc30pXG4vLyAgICAgICByZXR1cm4ge2l0ZW1zfVxuLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4vLyAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZShlcnJvcilcbi8vICAgICB9XG4vLyAgIH19XG4iXX0=