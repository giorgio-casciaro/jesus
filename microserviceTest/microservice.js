'use strict';

var R = require('ramda');
module.exports = function startMicroservice() {
  var configOverwrite = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var CONFIG, SERVICE, DI, NET, userPermissionBasePackage, userCqrsPackage;
  return regeneratorRuntime.async(function startMicroservice$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          CONFIG = R.merge(require('./config'), configOverwrite);
          SERVICE = require('../SERVICE.default')(CONFIG);
          DI = {
            log: SERVICE.log,
            debug: SERVICE.debug,
            warn: SERVICE.warn,
            errorResponse: SERVICE.errorResponse,
            throwError: SERVICE.throwError,
            getRoutes: SERVICE.getRoutes,
            authorize: function authorize() {
              return regeneratorRuntime.async(function authorize$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      return _context.abrupt('return', {
                        'userId': 195151662661
                      });

                    case 1:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, null, this);
            }
          };
          _context12.next = 5;
          return regeneratorRuntime.awrap(require('../net')(CONFIG, DI));

        case 5:
          NET = _context12.sent;

          DI.emitEvent = NET.emitEvent;

          SERVICE.registerRoute({
            route: 'updateAutorizationsView',
            routeFunction: function authorize(_ref) {
              var entity = _ref.entity,
                  items = _ref.items,
                  itemsIds = _ref.itemsIds;
              var storagePackage;
              return regeneratorRuntime.async(function authorize$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.prev = 0;
                      _context2.next = 3;
                      return regeneratorRuntime.awrap(CONFIG.autorizationsView.storage(CONFIG.autorizationsView, DI));

                    case 3:
                      storagePackage = _context2.sent;

                      DI.warn({ msg: 'updateView', debug: { meta: meta, items: items, itemsIds: itemsIds } });
                      items = R.map(CONFIG.autorizationsView.filterIncomingData, items);
                      items = R.map(R.merge({ '_entity': entity }), items);
                      _context2.next = 9;
                      return regeneratorRuntime.awrap(storagePackage.update({
                        queriesArray: R.map(function (itemId) {
                          return { '_id': itemId };
                        }, itemsIds),
                        dataArray: items,
                        insertIfNotExists: true }));

                    case 9:
                      _context2.next = 14;
                      break;

                    case 11:
                      _context2.prev = 11;
                      _context2.t0 = _context2['catch'](0);
                      return _context2.abrupt('return', DI.errorResponse({ message: 'problems during updateAutorizationsView', originalError: _context2.t0 }));

                    case 14:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, null, this, [[0, 11]]);
            } });

          SERVICE.registerRoute({
            route: 'authorize',
            routeFunction: function authorize(_ref2) {
              var action = _ref2.action,
                  entityName = _ref2.entityName,
                  itemsIds = _ref2.itemsIds,
                  meta = _ref2.meta;
              return regeneratorRuntime.async(function authorize$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.prev = 0;

                      DI.warn({ msg: 'authorize', debug: { action: action, entityName: entityName, itemsIds: itemsIds, meta: meta } });
                      return _context3.abrupt('return', {
                        userData: { 'userId': '195151662661' }
                      });

                    case 5:
                      _context3.prev = 5;
                      _context3.t0 = _context3['catch'](0);
                      return _context3.abrupt('return', DI.errorResponse({ message: 'problems during authorize', originalError: _context3.t0 }));

                    case 8:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, null, this, [[0, 5]]);
            } });

          SERVICE.registerRoute({
            route: 'test',
            routeFunction: function test(_ref3) {
              var meta = _ref3.meta,
                  items = _ref3.items,
                  itemsIds = _ref3.itemsIds;
              return regeneratorRuntime.async(function test$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.prev = 0;

                      DI.warn({ msg: 'test', context: 'SERVICE', debug: { items: items, itemsIds: itemsIds } });
                      return _context4.abrupt('return', { itemsIds: itemsIds });

                    case 5:
                      _context4.prev = 5;
                      _context4.t0 = _context4['catch'](0);
                      return _context4.abrupt('return', DI.errorResponse({ message: 'problems during test', originalError: _context4.t0 }));

                    case 8:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, null, this, [[0, 5]]);
            } });

          _context12.next = 12;
          return regeneratorRuntime.awrap(require('../entity.base')(CONFIG['UserPermission'], DI));

        case 12:
          userPermissionBasePackage = _context12.sent;


          SERVICE.registerRoute({
            route: 'updateUserPermission',
            routeFunction: function updateUserPermissionRoute(_ref4) {
              var meta = _ref4.meta,
                  items = _ref4.items,
                  itemsIds = _ref4.itemsIds;

              var _require$checkRequest, filterProps, userData;

              return regeneratorRuntime.async(function updateUserPermissionRoute$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.prev = 0;
                      _require$checkRequest = require('../jesus').checkRequestItemsIdsAndItems({ items: items, itemsIds: itemsIds, appendIdsToItems: true });
                      items = _require$checkRequest.items;
                      itemsIds = _require$checkRequest.itemsIds;
                      filterProps = R.pickBy(function (val, key) {
                        return key === '_id' || key.charAt(0) !== '_';
                      }); // remove items data starting with _ (exclude _id )

                      items = R.map(filterProps, items);
                      _context5.next = 8;
                      return regeneratorRuntime.awrap(DI.authorize({ action: 'write.update', entityName: 'UserPermission', items: items, itemsIds: itemsIds, meta: meta }));

                    case 8:
                      userData = _context5.sent;
                      _context5.next = 11;
                      return regeneratorRuntime.awrap(userPermissionBasePackage.update({ items: items, itemsIds: itemsIds, userData: userData }));

                    case 11:
                      return _context5.abrupt('return', { itemsIds: itemsIds });

                    case 14:
                      _context5.prev = 14;
                      _context5.t0 = _context5['catch'](0);
                      return _context5.abrupt('return', DI.errorResponse({ message: 'Permission problems during update' }));

                    case 17:
                    case 'end':
                      return _context5.stop();
                  }
                }
              }, null, this, [[0, 14]]);
            } });
          SERVICE.registerRoute({
            route: 'deleteUserPermission',
            routeFunction: function deleteUserPermissionRoute(_ref5) {
              var meta = _ref5.meta,
                  itemsIds = _ref5.itemsIds,
                  items = _ref5.items;

              var _require$checkRequest2, userData;

              return regeneratorRuntime.async(function deleteUserPermissionRoute$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      _context6.prev = 0;
                      _require$checkRequest2 = require('../jesus').checkRequestItemsIdsAndItems({ items: items, itemsIds: itemsIds });
                      itemsIds = _require$checkRequest2.itemsIds;

                      items = R.map(function () {
                        return { '_deleted': true };
                      }, itemsIds);
                      console.log({ items: items });
                      _context6.next = 7;
                      return regeneratorRuntime.awrap(DI.authorize({ action: 'write.delete', entityName: 'UserPermission', items: items, itemsIds: itemsIds, meta: meta }));

                    case 7:
                      userData = _context6.sent;
                      _context6.next = 10;
                      return regeneratorRuntime.awrap(userPermissionBasePackage.update({ items: items, itemsIds: itemsIds, userData: userData }));

                    case 10:
                      return _context6.abrupt('return', { itemsIds: itemsIds });

                    case 13:
                      _context6.prev = 13;
                      _context6.t0 = _context6['catch'](0);
                      return _context6.abrupt('return', DI.errorResponse({ message: 'Permission problems during delete' }));

                    case 16:
                    case 'end':
                      return _context6.stop();
                  }
                }
              }, null, this, [[0, 13]]);
            } });

          SERVICE.registerRoute({
            route: 'readUserPermission',
            routeFunction: function readUserPermissionRoute(_ref6) {
              var meta = _ref6.meta,
                  items = _ref6.items,
                  itemsIds = _ref6.itemsIds;

              var _require$checkRequest3, userData;

              return regeneratorRuntime.async(function readUserPermissionRoute$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.prev = 0;
                      _require$checkRequest3 = require('../jesus').checkRequestItemsIdsAndItems({ itemsIds: itemsIds });
                      itemsIds = _require$checkRequest3.itemsIds;
                      _context7.next = 5;
                      return regeneratorRuntime.awrap(DI.authorize({ action: 'read', entityName: 'UserPermission', items: items, itemsIds: itemsIds, meta: meta }));

                    case 5:
                      userData = _context7.sent;
                      _context7.next = 8;
                      return regeneratorRuntime.awrap(userPermissionBasePackage.read({ items: items, itemsIds: itemsIds, userData: userData }));

                    case 8:
                      items = _context7.sent;
                      return _context7.abrupt('return', { items: items });

                    case 12:
                      _context7.prev = 12;
                      _context7.t0 = _context7['catch'](0);
                      return _context7.abrupt('return', DI.errorResponse({ message: 'Permission problems during read' }));

                    case 15:
                    case 'end':
                      return _context7.stop();
                  }
                }
              }, null, this, [[0, 12]]);
            } });

          _context12.next = 18;
          return regeneratorRuntime.awrap(require('../entity.cqrs')(CONFIG['User'], DI));

        case 18:
          userCqrsPackage = _context12.sent;


          SERVICE.registerRoute({
            route: 'createUser',
            routeFunction: function createUserRoute(_ref7) {
              var meta = _ref7.meta,
                  items = _ref7.items,
                  itemsIds = _ref7.itemsIds;

              var _require$checkRequest4, userData, addedMutations;

              return regeneratorRuntime.async(function createUserRoute$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      _context8.prev = 0;
                      _require$checkRequest4 = require('../jesus').checkRequestItemsIdsAndItems({ items: items, itemsIds: itemsIds, generateIds: true, appendIdsToItems: true });
                      items = _require$checkRequest4.items;
                      itemsIds = _require$checkRequest4.itemsIds;

                      DI.debug({ msg: 'start createUserRoute()', context: 'SERVICE', debug: { items: items, itemsIds: itemsIds } });
                      _context8.next = 7;
                      return regeneratorRuntime.awrap(DI.authorize({ action: 'write.create', entityName: 'User', items: items, itemsIds: itemsIds, meta: meta }));

                    case 7:
                      userData = _context8.sent;
                      _context8.next = 10;
                      return regeneratorRuntime.awrap(userCqrsPackage.mutate({ items: items, itemsIds: itemsIds, mutation: 'create', userData: userData }));

                    case 10:
                      addedMutations = _context8.sent;

                      userCqrsPackage.refreshViews({ itemsIds: itemsIds, loadSnapshot: false, loadMutations: false, addMutations: addedMutations }); // not await
                      return _context8.abrupt('return', { itemsIds: itemsIds });

                    case 15:
                      _context8.prev = 15;
                      _context8.t0 = _context8['catch'](0);
                      return _context8.abrupt('return', DI.errorResponse({ message: 'problems during create', originalError: _context8.t0 }));

                    case 18:
                    case 'end':
                      return _context8.stop();
                  }
                }
              }, null, this, [[0, 15]]);
            } });

          SERVICE.registerRoute({
            route: 'updateUser',
            routeFunction: function updateUserRoute(_ref8) {
              var meta = _ref8.meta,
                  itemsIds = _ref8.itemsIds,
                  items = _ref8.items;

              var _require$checkRequest5, filterProps, userData;

              return regeneratorRuntime.async(function updateUserRoute$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      _context9.prev = 0;
                      _require$checkRequest5 = require('../jesus').checkRequestItemsIdsAndItems({ items: items, itemsIds: itemsIds });
                      items = _require$checkRequest5.items;
                      itemsIds = _require$checkRequest5.itemsIds;
                      filterProps = R.pickBy(function (val, key) {
                        return key.charAt(0) !== '_';
                      }); // remove items data starting with _ ( _id , _deleted ecc)

                      items = R.map(filterProps, items);
                      _context9.next = 8;
                      return regeneratorRuntime.awrap(DI.authorize({ action: 'write.update', entityName: 'User', items: items, itemsIds: itemsIds, meta: meta }));

                    case 8:
                      userData = _context9.sent;
                      _context9.next = 11;
                      return regeneratorRuntime.awrap(userCqrsPackage.mutate({ items: items, itemsIds: itemsIds, mutation: 'update', userData: userData }));

                    case 11:
                      _context9.next = 13;
                      return regeneratorRuntime.awrap(userCqrsPackage.refreshViews({ itemsIds: itemsIds, loadSnapshot: true, loadMutations: true }));

                    case 13:
                      return _context9.abrupt('return', { itemsIds: itemsIds });

                    case 16:
                      _context9.prev = 16;
                      _context9.t0 = _context9['catch'](0);
                      return _context9.abrupt('return', DI.errorResponse({ message: 'problems during update' }));

                    case 19:
                    case 'end':
                      return _context9.stop();
                  }
                }
              }, null, this, [[0, 16]]);
            } });
          SERVICE.registerRoute({
            route: 'deleteUser',
            routeFunction: function deleteUserRoute(_ref9) {
              var meta = _ref9.meta,
                  itemsIds = _ref9.itemsIds,
                  items = _ref9.items;

              var _require$checkRequest6, userData;

              return regeneratorRuntime.async(function deleteUserRoute$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      _context10.prev = 0;
                      _require$checkRequest6 = require('../jesus').checkRequestItemsIdsAndItems({ itemsIds: itemsIds });
                      itemsIds = _require$checkRequest6.itemsIds;
                      _context10.next = 5;
                      return regeneratorRuntime.awrap(DI.authorize({ action: 'write.delete', entityName: 'User', itemsIds: itemsIds, meta: meta }));

                    case 5:
                      userData = _context10.sent;
                      _context10.next = 8;
                      return regeneratorRuntime.awrap(userCqrsPackage.mutate({ itemsIds: itemsIds, mutation: 'delete', userData: userData }));

                    case 8:
                      _context10.next = 10;
                      return regeneratorRuntime.awrap(userCqrsPackage.refreshViews({ itemsIds: itemsIds, loadSnapshot: true, loadMutations: true }));

                    case 10:
                      return _context10.abrupt('return', { itemsIds: itemsIds });

                    case 13:
                      _context10.prev = 13;
                      _context10.t0 = _context10['catch'](0);
                      return _context10.abrupt('return', DI.errorResponse(_context10.t0));

                    case 16:
                    case 'end':
                      return _context10.stop();
                  }
                }
              }, null, this, [[0, 13]]);
            } });
          SERVICE.registerRoute({
            route: 'readUser',
            private: true,
            routeFunction: function readUserRoute(_ref10) {
              var meta = _ref10.meta,
                  itemsIds = _ref10.itemsIds;

              var _require$checkRequest7, userData, items;

              return regeneratorRuntime.async(function readUserRoute$(_context11) {
                while (1) {
                  switch (_context11.prev = _context11.next) {
                    case 0:
                      _context11.prev = 0;
                      _require$checkRequest7 = require('../jesus').checkRequestItemsIdsAndItems({ itemsIds: itemsIds });
                      itemsIds = _require$checkRequest7.itemsIds;
                      _context11.next = 5;
                      return regeneratorRuntime.awrap(DI.authorize({ action: 'read', entityName: 'User', itemsIds: itemsIds, meta: meta }));

                    case 5:
                      userData = _context11.sent;
                      _context11.next = 8;
                      return regeneratorRuntime.awrap(userCqrsPackage.read({ itemsIds: itemsIds }));

                    case 8:
                      items = _context11.sent;

                      console.log({ itemsIds: itemsIds, items: items });
                      return _context11.abrupt('return', { items: items });

                    case 13:
                      _context11.prev = 13;
                      _context11.t0 = _context11['catch'](0);
                      return _context11.abrupt('return', DI.errorResponse(_context11.t0));

                    case 16:
                    case 'end':
                      return _context11.stop();
                  }
                }
              }, null, this, [[0, 13]]);
            } });

          SERVICE.apiGrpc = require('../api.grpc')(CONFIG, DI);
          _context12.next = 26;
          return regeneratorRuntime.awrap(SERVICE.apiGrpc.start());

        case 26:

          SERVICE.apiRest = require('../api.rest')(CONFIG, DI);
          _context12.next = 29;
          return regeneratorRuntime.awrap(SERVICE.apiRest.start());

        case 29:
          return _context12.abrupt('return', {
            SERVICE: SERVICE,
            CONFIG: CONFIG,
            DI: DI
          });

        case 30:
        case 'end':
          return _context12.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1pY3Jvc2VydmljZS5lczYiXSwibmFtZXMiOlsiUiIsInJlcXVpcmUiLCJtb2R1bGUiLCJleHBvcnRzIiwic3RhcnRNaWNyb3NlcnZpY2UiLCJjb25maWdPdmVyd3JpdGUiLCJDT05GSUciLCJtZXJnZSIsIlNFUlZJQ0UiLCJESSIsImxvZyIsImRlYnVnIiwid2FybiIsImVycm9yUmVzcG9uc2UiLCJ0aHJvd0Vycm9yIiwiZ2V0Um91dGVzIiwiYXV0aG9yaXplIiwiTkVUIiwiZW1pdEV2ZW50IiwicmVnaXN0ZXJSb3V0ZSIsInJvdXRlIiwicm91dGVGdW5jdGlvbiIsImVudGl0eSIsIml0ZW1zIiwiaXRlbXNJZHMiLCJhdXRvcml6YXRpb25zVmlldyIsInN0b3JhZ2UiLCJzdG9yYWdlUGFja2FnZSIsIm1zZyIsIm1ldGEiLCJtYXAiLCJmaWx0ZXJJbmNvbWluZ0RhdGEiLCJ1cGRhdGUiLCJxdWVyaWVzQXJyYXkiLCJpdGVtSWQiLCJkYXRhQXJyYXkiLCJpbnNlcnRJZk5vdEV4aXN0cyIsIm1lc3NhZ2UiLCJvcmlnaW5hbEVycm9yIiwiYWN0aW9uIiwiZW50aXR5TmFtZSIsInVzZXJEYXRhIiwidGVzdCIsImNvbnRleHQiLCJ1c2VyUGVybWlzc2lvbkJhc2VQYWNrYWdlIiwidXBkYXRlVXNlclBlcm1pc3Npb25Sb3V0ZSIsImNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMiLCJhcHBlbmRJZHNUb0l0ZW1zIiwiZmlsdGVyUHJvcHMiLCJwaWNrQnkiLCJ2YWwiLCJrZXkiLCJjaGFyQXQiLCJkZWxldGVVc2VyUGVybWlzc2lvblJvdXRlIiwiY29uc29sZSIsInJlYWRVc2VyUGVybWlzc2lvblJvdXRlIiwicmVhZCIsInVzZXJDcXJzUGFja2FnZSIsImNyZWF0ZVVzZXJSb3V0ZSIsImdlbmVyYXRlSWRzIiwibXV0YXRlIiwibXV0YXRpb24iLCJhZGRlZE11dGF0aW9ucyIsInJlZnJlc2hWaWV3cyIsImxvYWRTbmFwc2hvdCIsImxvYWRNdXRhdGlvbnMiLCJhZGRNdXRhdGlvbnMiLCJ1cGRhdGVVc2VyUm91dGUiLCJkZWxldGVVc2VyUm91dGUiLCJwcml2YXRlIiwicmVhZFVzZXJSb3V0ZSIsImFwaUdycGMiLCJzdGFydCIsImFwaVJlc3QiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQixTQUFlQyxpQkFBZjtBQUFBLE1BQWtDQyxlQUFsQyx1RUFBb0QsRUFBcEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1hDLGdCQURXLEdBQ0ZOLEVBQUVPLEtBQUYsQ0FBUU4sUUFBUSxVQUFSLENBQVIsRUFBNkJJLGVBQTdCLENBREU7QUFFWEcsaUJBRlcsR0FFRFAsUUFBUSxvQkFBUixFQUE4QkssTUFBOUIsQ0FGQztBQUlYRyxZQUpXLEdBSU47QUFDUEMsaUJBQUtGLFFBQVFFLEdBRE47QUFFUEMsbUJBQU9ILFFBQVFHLEtBRlI7QUFHUEMsa0JBQU1KLFFBQVFJLElBSFA7QUFJUEMsMkJBQWVMLFFBQVFLLGFBSmhCO0FBS1BDLHdCQUFZTixRQUFRTSxVQUxiO0FBTVBDLHVCQUFXUCxRQUFRTyxTQU5aO0FBT1BDLHVCQUFXLFNBQWVBLFNBQWY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHVEQUNGO0FBQ0wsa0NBQVU7QUFETCx1QkFERTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVBKLFdBSk07QUFBQTtBQUFBLDBDQWlCQ2YsUUFBUSxRQUFSLEVBQWtCSyxNQUFsQixFQUEwQkcsRUFBMUIsQ0FqQkQ7O0FBQUE7QUFpQlhRLGFBakJXOztBQWtCZlIsYUFBR1MsU0FBSCxHQUFlRCxJQUFJQyxTQUFuQjs7QUFHQVYsa0JBQVFXLGFBQVIsQ0FBc0I7QUFDcEJDLG1CQUFPLHlCQURhO0FBRXBCQywyQkFBZSxTQUFlTCxTQUFmO0FBQUEsa0JBQTJCTSxNQUEzQixRQUEyQkEsTUFBM0I7QUFBQSxrQkFBbUNDLEtBQW5DLFFBQW1DQSxLQUFuQztBQUFBLGtCQUEwQ0Ms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QUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibWljcm9zZXJ2aWNlLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBzdGFydE1pY3Jvc2VydmljZSAoY29uZmlnT3ZlcndyaXRlID0ge30pIHtcbiAgdmFyIENPTkZJRyA9IFIubWVyZ2UocmVxdWlyZSgnLi9jb25maWcnKSwgY29uZmlnT3ZlcndyaXRlKVxuICB2YXIgU0VSVklDRSA9IHJlcXVpcmUoJy4uL1NFUlZJQ0UuZGVmYXVsdCcpKENPTkZJRylcblxuICB2YXIgREkgPSB7XG4gICAgbG9nOiBTRVJWSUNFLmxvZyxcbiAgICBkZWJ1ZzogU0VSVklDRS5kZWJ1ZyxcbiAgICB3YXJuOiBTRVJWSUNFLndhcm4sXG4gICAgZXJyb3JSZXNwb25zZTogU0VSVklDRS5lcnJvclJlc3BvbnNlLFxuICAgIHRocm93RXJyb3I6IFNFUlZJQ0UudGhyb3dFcnJvcixcbiAgICBnZXRSb3V0ZXM6IFNFUlZJQ0UuZ2V0Um91dGVzLFxuICAgIGF1dGhvcml6ZTogYXN5bmMgZnVuY3Rpb24gYXV0aG9yaXplICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd1c2VySWQnOiAxOTUxNTE2NjI2NjFcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdmFyIE5FVCA9IGF3YWl0IHJlcXVpcmUoJy4uL25ldCcpKENPTkZJRywgREkpXG4gIERJLmVtaXRFdmVudCA9IE5FVC5lbWl0RXZlbnRcblxuXG4gIFNFUlZJQ0UucmVnaXN0ZXJSb3V0ZSh7XG4gICAgcm91dGU6ICd1cGRhdGVBdXRvcml6YXRpb25zVmlldycsXG4gICAgcm91dGVGdW5jdGlvbjogYXN5bmMgZnVuY3Rpb24gYXV0aG9yaXplICh7ZW50aXR5LCBpdGVtcywgaXRlbXNJZHN9KSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgc3RvcmFnZVBhY2thZ2UgPSBhd2FpdCBDT05GSUcuYXV0b3JpemF0aW9uc1ZpZXcuc3RvcmFnZShDT05GSUcuYXV0b3JpemF0aW9uc1ZpZXcsIERJKVxuICAgICAgICBESS53YXJuKHttc2c6IGB1cGRhdGVWaWV3YCwgZGVidWc6IHttZXRhLCBpdGVtcywgaXRlbXNJZHN9fSlcbiAgICAgICAgaXRlbXM9Ui5tYXAoQ09ORklHLmF1dG9yaXphdGlvbnNWaWV3LmZpbHRlckluY29taW5nRGF0YSwgaXRlbXMpXG4gICAgICAgIGl0ZW1zPVIubWFwKFIubWVyZ2UoeydfZW50aXR5JzogZW50aXR5fSksIGl0ZW1zKVxuICAgICAgICBhd2FpdCBzdG9yYWdlUGFja2FnZS51cGRhdGUoe1xuICAgICAgICAgIHF1ZXJpZXNBcnJheTogUi5tYXAoKGl0ZW1JZCkgPT4gKHsnX2lkJzogaXRlbUlkfSksIGl0ZW1zSWRzKSxcbiAgICAgICAgICBkYXRhQXJyYXk6IGl0ZW1zLFxuICAgICAgICAgIGluc2VydElmTm90RXhpc3RzOiB0cnVlfSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKHttZXNzYWdlOiAncHJvYmxlbXMgZHVyaW5nIHVwZGF0ZUF1dG9yaXphdGlvbnNWaWV3Jywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuICAgICAgfVxuICAgIH19KVxuXG4gIFNFUlZJQ0UucmVnaXN0ZXJSb3V0ZSh7XG4gICAgcm91dGU6ICdhdXRob3JpemUnLFxuICAgIHJvdXRlRnVuY3Rpb246IGFzeW5jIGZ1bmN0aW9uIGF1dGhvcml6ZSAoe2FjdGlvbiwgZW50aXR5TmFtZSwgaXRlbXNJZHMsIG1ldGF9KSB7XG4gICAgICB0cnkge1xuICAgICAgICBESS53YXJuKHttc2c6IGBhdXRob3JpemVgLCBkZWJ1Zzoge2FjdGlvbiwgZW50aXR5TmFtZSwgaXRlbXNJZHMsIG1ldGF9fSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1c2VyRGF0YTogeyd1c2VySWQnOiAnMTk1MTUxNjYyNjYxJ31cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdwcm9ibGVtcyBkdXJpbmcgYXV0aG9yaXplJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuICAgICAgfVxuICAgIH19KVxuXG4gIFNFUlZJQ0UucmVnaXN0ZXJSb3V0ZSh7XG4gICAgcm91dGU6ICd0ZXN0JyxcbiAgICByb3V0ZUZ1bmN0aW9uOiBhc3luYyBmdW5jdGlvbiB0ZXN0ICh7bWV0YSwgaXRlbXMsIGl0ZW1zSWRzfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgREkud2Fybih7bXNnOiBgdGVzdGAsIGNvbnRleHQ6ICdTRVJWSUNFJywgZGVidWc6IHtpdGVtcywgaXRlbXNJZHN9fSlcbiAgICAgICAgcmV0dXJuIHtpdGVtc0lkc31cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKHttZXNzYWdlOiAncHJvYmxlbXMgZHVyaW5nIHRlc3QnLCBvcmlnaW5hbEVycm9yOiBlcnJvcn0pXG4gICAgICB9XG4gICAgfX0pXG5cbiAgdmFyIHVzZXJQZXJtaXNzaW9uQmFzZVBhY2thZ2UgPSBhd2FpdCByZXF1aXJlKCcuLi9lbnRpdHkuYmFzZScpKENPTkZJR1snVXNlclBlcm1pc3Npb24nXSwgREkpXG5cbiAgU0VSVklDRS5yZWdpc3RlclJvdXRlKHtcbiAgICByb3V0ZTogJ3VwZGF0ZVVzZXJQZXJtaXNzaW9uJyxcbiAgICByb3V0ZUZ1bmN0aW9uOiBhc3luYyBmdW5jdGlvbiB1cGRhdGVVc2VyUGVybWlzc2lvblJvdXRlICh7bWV0YSwgaXRlbXMsIGl0ZW1zSWRzfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgKHtpdGVtcywgaXRlbXNJZHN9ID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVlc3RJdGVtc0lkc0FuZEl0ZW1zKHtpdGVtcywgaXRlbXNJZHMsIGFwcGVuZElkc1RvSXRlbXM6IHRydWV9KSlcbiAgICAgICAgdmFyIGZpbHRlclByb3BzID0gUi5waWNrQnkoKHZhbCwga2V5KSA9PiAoa2V5ID09PSAnX2lkJyB8fCBrZXkuY2hhckF0KDApICE9PSAnXycpKSAvLyByZW1vdmUgaXRlbXMgZGF0YSBzdGFydGluZyB3aXRoIF8gKGV4Y2x1ZGUgX2lkIClcbiAgICAgICAgaXRlbXMgPSBSLm1hcChmaWx0ZXJQcm9wcywgaXRlbXMpXG4gICAgICAgIHZhciB1c2VyRGF0YSA9IGF3YWl0IERJLmF1dGhvcml6ZSh7YWN0aW9uOiAnd3JpdGUudXBkYXRlJywgZW50aXR5TmFtZTogJ1VzZXJQZXJtaXNzaW9uJywgaXRlbXMsIGl0ZW1zSWRzLCBtZXRhfSlcbiAgICAgICAgYXdhaXQgdXNlclBlcm1pc3Npb25CYXNlUGFja2FnZS51cGRhdGUoe2l0ZW1zLCBpdGVtc0lkcywgdXNlckRhdGF9KVxuICAgICAgICByZXR1cm4ge2l0ZW1zSWRzfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdQZXJtaXNzaW9uIHByb2JsZW1zIGR1cmluZyB1cGRhdGUnfSlcbiAgICAgIH1cbiAgICB9fSlcbiAgU0VSVklDRS5yZWdpc3RlclJvdXRlKHtcbiAgICByb3V0ZTogJ2RlbGV0ZVVzZXJQZXJtaXNzaW9uJyxcbiAgICByb3V0ZUZ1bmN0aW9uOiBhc3luYyBmdW5jdGlvbiBkZWxldGVVc2VyUGVybWlzc2lvblJvdXRlICh7bWV0YSwgaXRlbXNJZHMsIGl0ZW1zfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgKHtpdGVtc0lkc30gPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMoe2l0ZW1zLCBpdGVtc0lkc30pKVxuICAgICAgICBpdGVtcyA9IFIubWFwKCgpID0+ICh7J19kZWxldGVkJzogdHJ1ZX0pLCBpdGVtc0lkcylcbiAgICAgICAgY29uc29sZS5sb2coe2l0ZW1zfSlcbiAgICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgREkuYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS5kZWxldGUnLCBlbnRpdHlOYW1lOiAnVXNlclBlcm1pc3Npb24nLCBpdGVtcywgaXRlbXNJZHMsIG1ldGF9KVxuICAgICAgICBhd2FpdCB1c2VyUGVybWlzc2lvbkJhc2VQYWNrYWdlLnVwZGF0ZSh7aXRlbXMsIGl0ZW1zSWRzLCB1c2VyRGF0YX0pXG4gICAgICAgIHJldHVybiB7aXRlbXNJZHN9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZSh7bWVzc2FnZTogJ1Blcm1pc3Npb24gcHJvYmxlbXMgZHVyaW5nIGRlbGV0ZSd9KVxuICAgICAgfVxuICAgIH19KVxuXG4gIFNFUlZJQ0UucmVnaXN0ZXJSb3V0ZSh7XG4gICAgcm91dGU6ICdyZWFkVXNlclBlcm1pc3Npb24nLFxuICAgIHJvdXRlRnVuY3Rpb246IGFzeW5jIGZ1bmN0aW9uIHJlYWRVc2VyUGVybWlzc2lvblJvdXRlICh7bWV0YSwgaXRlbXMsIGl0ZW1zSWRzfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgKHtpdGVtc0lkc30gPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMoe2l0ZW1zSWRzfSkpXG4gICAgICAgIHZhciB1c2VyRGF0YSA9IGF3YWl0IERJLmF1dGhvcml6ZSh7YWN0aW9uOiAncmVhZCcsIGVudGl0eU5hbWU6ICdVc2VyUGVybWlzc2lvbicsIGl0ZW1zLCBpdGVtc0lkcywgbWV0YX0pXG4gICAgICAgIGl0ZW1zID0gYXdhaXQgdXNlclBlcm1pc3Npb25CYXNlUGFja2FnZS5yZWFkKHtpdGVtcywgaXRlbXNJZHMsIHVzZXJEYXRhfSlcbiAgICAgICAgcmV0dXJuIHtpdGVtc31cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKHttZXNzYWdlOiAnUGVybWlzc2lvbiBwcm9ibGVtcyBkdXJpbmcgcmVhZCd9KVxuICAgICAgfVxuICAgIH19KVxuXG4gIHZhciB1c2VyQ3Fyc1BhY2thZ2UgPSBhd2FpdCByZXF1aXJlKCcuLi9lbnRpdHkuY3FycycpKENPTkZJR1snVXNlciddLCBESSlcblxuICBTRVJWSUNFLnJlZ2lzdGVyUm91dGUoe1xuICAgIHJvdXRlOiAnY3JlYXRlVXNlcicsXG4gICAgcm91dGVGdW5jdGlvbjogYXN5bmMgZnVuY3Rpb24gY3JlYXRlVXNlclJvdXRlICh7bWV0YSwgaXRlbXMsIGl0ZW1zSWRzfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgKHtpdGVtcywgaXRlbXNJZHN9ID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVlc3RJdGVtc0lkc0FuZEl0ZW1zKHtpdGVtcywgaXRlbXNJZHMsIGdlbmVyYXRlSWRzOiB0cnVlLCBhcHBlbmRJZHNUb0l0ZW1zOiB0cnVlfSkpXG4gICAgICAgIERJLmRlYnVnKHttc2c6IGBzdGFydCBjcmVhdGVVc2VyUm91dGUoKWAsIGNvbnRleHQ6ICdTRVJWSUNFJywgZGVidWc6IHtpdGVtcywgaXRlbXNJZHN9fSlcbiAgICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgREkuYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS5jcmVhdGUnLCBlbnRpdHlOYW1lOiAnVXNlcicsIGl0ZW1zLCBpdGVtc0lkcywgbWV0YX0pXG4gICAgICAgIHZhciBhZGRlZE11dGF0aW9ucyA9IGF3YWl0IHVzZXJDcXJzUGFja2FnZS5tdXRhdGUoe2l0ZW1zLCBpdGVtc0lkcywgbXV0YXRpb246ICdjcmVhdGUnLCB1c2VyRGF0YX0pXG4gICAgICAgIHVzZXJDcXJzUGFja2FnZS5yZWZyZXNoVmlld3Moe2l0ZW1zSWRzLCBsb2FkU25hcHNob3Q6IGZhbHNlLCBsb2FkTXV0YXRpb25zOiBmYWxzZSwgYWRkTXV0YXRpb25zOiBhZGRlZE11dGF0aW9uc30pIC8vIG5vdCBhd2FpdFxuICAgICAgICByZXR1cm4ge2l0ZW1zSWRzfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdwcm9ibGVtcyBkdXJpbmcgY3JlYXRlJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuICAgICAgfVxuICAgIH19KVxuXG4gIFNFUlZJQ0UucmVnaXN0ZXJSb3V0ZSh7XG4gICAgcm91dGU6ICd1cGRhdGVVc2VyJyxcbiAgICByb3V0ZUZ1bmN0aW9uOiBhc3luYyBmdW5jdGlvbiB1cGRhdGVVc2VyUm91dGUgKHttZXRhLCBpdGVtc0lkcywgaXRlbXN9KSB7XG4gICAgICB0cnkge1xuICAgICAgICAoe2l0ZW1zLCBpdGVtc0lkc30gPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMoe2l0ZW1zLCBpdGVtc0lkc30pKVxuICAgICAgICB2YXIgZmlsdGVyUHJvcHMgPSBSLnBpY2tCeSgodmFsLCBrZXkpID0+IChrZXkuY2hhckF0KDApICE9PSAnXycpKSAvLyByZW1vdmUgaXRlbXMgZGF0YSBzdGFydGluZyB3aXRoIF8gKCBfaWQgLCBfZGVsZXRlZCBlY2MpXG4gICAgICAgIGl0ZW1zID0gUi5tYXAoZmlsdGVyUHJvcHMsIGl0ZW1zKVxuICAgICAgICB2YXIgdXNlckRhdGEgPSBhd2FpdCBESS5hdXRob3JpemUoe2FjdGlvbjogJ3dyaXRlLnVwZGF0ZScsIGVudGl0eU5hbWU6ICdVc2VyJywgaXRlbXMsIGl0ZW1zSWRzLCBtZXRhfSlcbiAgICAgICAgYXdhaXQgdXNlckNxcnNQYWNrYWdlLm11dGF0ZSh7aXRlbXMsIGl0ZW1zSWRzLCBtdXRhdGlvbjogJ3VwZGF0ZScsIHVzZXJEYXRhfSlcbiAgICAgICAgYXdhaXQgdXNlckNxcnNQYWNrYWdlLnJlZnJlc2hWaWV3cyh7aXRlbXNJZHMsIGxvYWRTbmFwc2hvdDogdHJ1ZSwgbG9hZE11dGF0aW9uczogdHJ1ZSB9KSAvLyBub3QgYXdhaXRcbiAgICAgICAgcmV0dXJuIHtpdGVtc0lkc31cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKHttZXNzYWdlOiAncHJvYmxlbXMgZHVyaW5nIHVwZGF0ZSd9KVxuICAgICAgfVxuICAgIH19KVxuICBTRVJWSUNFLnJlZ2lzdGVyUm91dGUoe1xuICAgIHJvdXRlOiAnZGVsZXRlVXNlcicsXG4gICAgcm91dGVGdW5jdGlvbjogYXN5bmMgZnVuY3Rpb24gZGVsZXRlVXNlclJvdXRlICh7bWV0YSwgaXRlbXNJZHMsIGl0ZW1zfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgKHtpdGVtc0lkc30gPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMoe2l0ZW1zSWRzfSkpXG4gICAgICAgIHZhciB1c2VyRGF0YSA9IGF3YWl0IERJLmF1dGhvcml6ZSh7YWN0aW9uOiAnd3JpdGUuZGVsZXRlJywgZW50aXR5TmFtZTogJ1VzZXInLCBpdGVtc0lkcywgbWV0YX0pXG4gICAgICAgIGF3YWl0IHVzZXJDcXJzUGFja2FnZS5tdXRhdGUoe2l0ZW1zSWRzLCBtdXRhdGlvbjogJ2RlbGV0ZScsIHVzZXJEYXRhfSlcbiAgICAgICAgYXdhaXQgdXNlckNxcnNQYWNrYWdlLnJlZnJlc2hWaWV3cyh7aXRlbXNJZHMsIGxvYWRTbmFwc2hvdDogdHJ1ZSwgbG9hZE11dGF0aW9uczogdHJ1ZSB9KSAvLyBub3QgYXdhaXRcbiAgICAgICAgcmV0dXJuIHtpdGVtc0lkc31cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKGVycm9yKVxuICAgICAgfVxuICAgIH19KVxuICBTRVJWSUNFLnJlZ2lzdGVyUm91dGUoe1xuICAgIHJvdXRlOiAncmVhZFVzZXInLFxuICAgIHByaXZhdGU6IHRydWUsXG4gICAgcm91dGVGdW5jdGlvbjogYXN5bmMgZnVuY3Rpb24gcmVhZFVzZXJSb3V0ZSAoe21ldGEsIGl0ZW1zSWRzfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgKHtpdGVtc0lkc30gPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMoe2l0ZW1zSWRzfSkpXG4gICAgICAgIHZhciB1c2VyRGF0YSA9IGF3YWl0IERJLmF1dGhvcml6ZSh7YWN0aW9uOiAncmVhZCcsIGVudGl0eU5hbWU6ICdVc2VyJywgaXRlbXNJZHMsIG1ldGF9KVxuICAgICAgICB2YXIgaXRlbXMgPSBhd2FpdCB1c2VyQ3Fyc1BhY2thZ2UucmVhZCh7aXRlbXNJZHN9KVxuICAgICAgICBjb25zb2xlLmxvZyh7aXRlbXNJZHMsIGl0ZW1zfSlcbiAgICAgICAgcmV0dXJuIHtpdGVtc31cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKGVycm9yKVxuICAgICAgfVxuICAgIH19KVxuXG4gIFNFUlZJQ0UuYXBpR3JwYyA9IHJlcXVpcmUoJy4uL2FwaS5ncnBjJykoQ09ORklHLCBESSlcbiAgYXdhaXQgU0VSVklDRS5hcGlHcnBjLnN0YXJ0KClcblxuICBTRVJWSUNFLmFwaVJlc3QgPSByZXF1aXJlKCcuLi9hcGkucmVzdCcpKENPTkZJRywgREkpXG4gIGF3YWl0IFNFUlZJQ0UuYXBpUmVzdC5zdGFydCgpXG5cbiAgcmV0dXJuIHtcbiAgICBTRVJWSUNFLFxuICAgIENPTkZJRyxcbiAgICBESVxuICB9XG59XG4iXX0=