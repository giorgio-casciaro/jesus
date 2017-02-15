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
          return regeneratorRuntime.awrap(require('../net')(CONFIG.net, DI));

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
                      return _context3.abrupt('return', {
                        userData: { 'userId': '195151662661' }
                      });

                    case 4:
                      _context3.prev = 4;
                      _context3.t0 = _context3['catch'](0);
                      return _context3.abrupt('return', DI.errorResponse({ message: 'problems during authorize', originalError: _context3.t0 }));

                    case 7:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, null, this, [[0, 4]]);
            } });

          SERVICE.registerRoute({
            route: 'test',
            routeFunction: function test(test) {
              return regeneratorRuntime.async(function test$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.prev = 0;
                      return _context4.abrupt('return', test);

                    case 4:
                      _context4.prev = 4;
                      _context4.t0 = _context4['catch'](0);
                      return _context4.abrupt('return', DI.errorResponse({ message: 'problems during test', originalError: _context4.t0 }));

                    case 7:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, null, this, [[0, 4]]);
            } });

          _context12.next = 12;
          return regeneratorRuntime.awrap(require('../entity.base')(CONFIG['UserPermission'], DI));

        case 12:
          userPermissionBasePackage = _context12.sent;


          SERVICE.registerRoute({
            route: 'updateUserPermission',
            routeFunction: function updateUserPermissionRoute(_ref3) {
              var meta = _ref3.meta,
                  items = _ref3.items,
                  itemsIds = _ref3.itemsIds;

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
            routeFunction: function deleteUserPermissionRoute(_ref4) {
              var meta = _ref4.meta,
                  itemsIds = _ref4.itemsIds,
                  items = _ref4.items;

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
                      //console.log({items})
                      _context6.next = 6;
                      return regeneratorRuntime.awrap(DI.authorize({ action: 'write.delete', entityName: 'UserPermission', items: items, itemsIds: itemsIds, meta: meta }));

                    case 6:
                      userData = _context6.sent;
                      _context6.next = 9;
                      return regeneratorRuntime.awrap(userPermissionBasePackage.update({ items: items, itemsIds: itemsIds, userData: userData }));

                    case 9:
                      return _context6.abrupt('return', { itemsIds: itemsIds });

                    case 12:
                      _context6.prev = 12;
                      _context6.t0 = _context6['catch'](0);
                      return _context6.abrupt('return', DI.errorResponse({ message: 'Permission problems during delete' }));

                    case 15:
                    case 'end':
                      return _context6.stop();
                  }
                }
              }, null, this, [[0, 12]]);
            } });

          SERVICE.registerRoute({
            route: 'readUserPermission',
            routeFunction: function readUserPermissionRoute(_ref5) {
              var meta = _ref5.meta,
                  items = _ref5.items,
                  itemsIds = _ref5.itemsIds;

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
            routeFunction: function createUserRoute(_ref6) {
              var meta = _ref6.meta,
                  items = _ref6.items,
                  itemsIds = _ref6.itemsIds;

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
            routeFunction: function updateUserRoute(_ref7) {
              var meta = _ref7.meta,
                  itemsIds = _ref7.itemsIds,
                  items = _ref7.items;

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
            routeFunction: function deleteUserRoute(_ref8) {
              var meta = _ref8.meta,
                  itemsIds = _ref8.itemsIds,
                  items = _ref8.items;

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
            routeFunction: function readUserRoute(_ref9) {
              var meta = _ref9.meta,
                  itemsIds = _ref9.itemsIds;

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
                      return _context11.abrupt('return', { items: items });

                    case 12:
                      _context11.prev = 12;
                      _context11.t0 = _context11['catch'](0);
                      return _context11.abrupt('return', DI.errorResponse(_context11.t0));

                    case 15:
                    case 'end':
                      return _context11.stop();
                  }
                }
              }, null, this, [[0, 12]]);
            } });

          SERVICE.apiRest = require('../api.http')(CONFIG, DI);
          _context12.next = 26;
          return regeneratorRuntime.awrap(SERVICE.apiRest.start());

        case 26:
          _context12.next = 28;
          return regeneratorRuntime.awrap(NET.start());

        case 28:
          SERVICE.stop = function () {
            SERVICE.apiRest.stop();
            NET.stop();
          };
          return _context12.abrupt('return', {
            SERVICE: SERVICE,
            CONFIG: CONFIG,
            DI: DI,
            NET: NET
          });

        case 30:
        case 'end':
          return _context12.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1pY3Jvc2VydmljZS5lczYiXSwibmFtZXMiOlsiUiIsInJlcXVpcmUiLCJtb2R1bGUiLCJleHBvcnRzIiwic3RhcnRNaWNyb3NlcnZpY2UiLCJjb25maWdPdmVyd3JpdGUiLCJDT05GSUciLCJtZXJnZSIsIlNFUlZJQ0UiLCJESSIsImxvZyIsImRlYnVnIiwid2FybiIsImVycm9yUmVzcG9uc2UiLCJ0aHJvd0Vycm9yIiwiZ2V0Um91dGVzIiwiYXV0aG9yaXplIiwibmV0IiwiTkVUIiwiZW1pdEV2ZW50IiwicmVnaXN0ZXJSb3V0ZSIsInJvdXRlIiwicm91dGVGdW5jdGlvbiIsImVudGl0eSIsIml0ZW1zIiwiaXRlbXNJZHMiLCJhdXRvcml6YXRpb25zVmlldyIsInN0b3JhZ2UiLCJzdG9yYWdlUGFja2FnZSIsIm1zZyIsIm1ldGEiLCJtYXAiLCJmaWx0ZXJJbmNvbWluZ0RhdGEiLCJ1cGRhdGUiLCJxdWVyaWVzQXJyYXkiLCJpdGVtSWQiLCJkYXRhQXJyYXkiLCJpbnNlcnRJZk5vdEV4aXN0cyIsIm1lc3NhZ2UiLCJvcmlnaW5hbEVycm9yIiwiYWN0aW9uIiwiZW50aXR5TmFtZSIsInVzZXJEYXRhIiwidGVzdCIsInVzZXJQZXJtaXNzaW9uQmFzZVBhY2thZ2UiLCJ1cGRhdGVVc2VyUGVybWlzc2lvblJvdXRlIiwiY2hlY2tSZXF1ZXN0SXRlbXNJZHNBbmRJdGVtcyIsImFwcGVuZElkc1RvSXRlbXMiLCJmaWx0ZXJQcm9wcyIsInBpY2tCeSIsInZhbCIsImtleSIsImNoYXJBdCIsImRlbGV0ZVVzZXJQZXJtaXNzaW9uUm91dGUiLCJyZWFkVXNlclBlcm1pc3Npb25Sb3V0ZSIsInJlYWQiLCJ1c2VyQ3Fyc1BhY2thZ2UiLCJjcmVhdGVVc2VyUm91dGUiLCJnZW5lcmF0ZUlkcyIsImNvbnRleHQiLCJtdXRhdGUiLCJtdXRhdGlvbiIsImFkZGVkTXV0YXRpb25zIiwicmVmcmVzaFZpZXdzIiwibG9hZFNuYXBzaG90IiwibG9hZE11dGF0aW9ucyIsImFkZE11dGF0aW9ucyIsInVwZGF0ZVVzZXJSb3V0ZSIsImRlbGV0ZVVzZXJSb3V0ZSIsInByaXZhdGUiLCJyZWFkVXNlclJvdXRlIiwiYXBpUmVzdCIsInN0YXJ0Iiwic3RvcCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLGlCQUFmO0FBQUEsTUFBa0NDLGVBQWxDLHVFQUFvRCxFQUFwRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDWEMsZ0JBRFcsR0FDRk4sRUFBRU8sS0FBRixDQUFRTixRQUFRLFVBQVIsQ0FBUixFQUE2QkksZUFBN0IsQ0FERTtBQUVYRyxpQkFGVyxHQUVEUCxRQUFRLG9CQUFSLEVBQThCSyxNQUE5QixDQUZDO0FBSVhHLFlBSlcsR0FJTjtBQUNQQyxpQkFBS0YsUUFBUUUsR0FETjtBQUVQQyxtQkFBT0gsUUFBUUcsS0FGUjtBQUdQQyxrQkFBTUosUUFBUUksSUFIUDtBQUlQQywyQkFBZUwsUUFBUUssYUFKaEI7QUFLUEMsd0JBQVlOLFFBQVFNLFVBTGI7QUFNUEMsdUJBQVdQLFFBQVFPLFNBTlo7QUFPUEMsdUJBQVcsU0FBZUEsU0FBZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsdURBQ0Y7QUFDTCxrQ0FBVTtBQURMLHVCQURFOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUEosV0FKTTtBQUFBO0FBQUEsMENBaUJDZixRQUFRLFFBQVIsRUFBa0JLLE9BQU9XLEdBQXpCLEVBQThCUixFQUE5QixDQWpCRDs7QUFBQTtBQWlCWFMsYUFqQlc7O0FBa0JmVCxhQUFHVSxTQUFILEdBQWVELElBQUlDLFNBQW5COztBQUVBWCxrQkFBUVksYUFBUixDQUFzQjtBQUNwQkMsbUJBQU8seUJBRGE7QUFFcEJDLDJCQUFlLFNBQWVOLFNBQWY7QUFBQSxrQkFBMkJPLE1BQTNCLFFBQTJCQSxNQUEzQjtBQUFBLGtCQUFtQ0MsS0FBbkMsUUFBbUNBLEtBQW5DO0FBQUEsa0JBQTBDQyxR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LHNEQUlPYyxnQkFBZ0JELElBQWhCLENBQXFCLEVBQUM5QixrQkFBRCxFQUFyQixDQUpQOztBQUFBO0FBSVBELDJCQUpPO0FBQUEseURBTUosRUFBQ0EsWUFBRCxFQU5JOztBQUFBO0FBQUE7QUFBQTtBQUFBLHlEQVFKZixHQUFHSSxhQUFILGVBUkk7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFISyxFQUF0Qjs7QUFlQUwsa0JBQVErRCxPQUFSLEdBQWtCdEUsUUFBUSxhQUFSLEVBQXVCSyxNQUF2QixFQUErQkcsRUFBL0IsQ0FBbEI7QUFwS2U7QUFBQSwwQ0FxS1RELFFBQVErRCxPQUFSLENBQWdCQyxLQUFoQixFQXJLUzs7QUFBQTtBQUFBO0FBQUEsMENBc0tUdEQsSUFBSXNELEtBQUosRUF0S1M7O0FBQUE7QUF1S2ZoRSxrQkFBUWlFLElBQVIsR0FBZSxZQUFNO0FBQ25CakUsb0JBQVErRCxPQUFSLENBQWdCRSxJQUFoQjtBQUNBdkQsZ0JBQUl1RCxJQUFKO0FBQ0QsV0FIRDtBQXZLZSw2Q0EyS1I7QUFDTGpFLDRCQURLO0FBRUxGLDBCQUZLO0FBR0xHLGtCQUhLO0FBSUxTO0FBSkssV0EzS1E7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibWljcm9zZXJ2aWNlLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBzdGFydE1pY3Jvc2VydmljZSAoY29uZmlnT3ZlcndyaXRlID0ge30pIHtcbiAgdmFyIENPTkZJRyA9IFIubWVyZ2UocmVxdWlyZSgnLi9jb25maWcnKSwgY29uZmlnT3ZlcndyaXRlKVxuICB2YXIgU0VSVklDRSA9IHJlcXVpcmUoJy4uL1NFUlZJQ0UuZGVmYXVsdCcpKENPTkZJRylcblxuICB2YXIgREkgPSB7XG4gICAgbG9nOiBTRVJWSUNFLmxvZyxcbiAgICBkZWJ1ZzogU0VSVklDRS5kZWJ1ZyxcbiAgICB3YXJuOiBTRVJWSUNFLndhcm4sXG4gICAgZXJyb3JSZXNwb25zZTogU0VSVklDRS5lcnJvclJlc3BvbnNlLFxuICAgIHRocm93RXJyb3I6IFNFUlZJQ0UudGhyb3dFcnJvcixcbiAgICBnZXRSb3V0ZXM6IFNFUlZJQ0UuZ2V0Um91dGVzLFxuICAgIGF1dGhvcml6ZTogYXN5bmMgZnVuY3Rpb24gYXV0aG9yaXplICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd1c2VySWQnOiAxOTUxNTE2NjI2NjFcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdmFyIE5FVCA9IGF3YWl0IHJlcXVpcmUoJy4uL25ldCcpKENPTkZJRy5uZXQsIERJKVxuICBESS5lbWl0RXZlbnQgPSBORVQuZW1pdEV2ZW50XG5cbiAgU0VSVklDRS5yZWdpc3RlclJvdXRlKHtcbiAgICByb3V0ZTogJ3VwZGF0ZUF1dG9yaXphdGlvbnNWaWV3JyxcbiAgICByb3V0ZUZ1bmN0aW9uOiBhc3luYyBmdW5jdGlvbiBhdXRob3JpemUgKHtlbnRpdHksIGl0ZW1zLCBpdGVtc0lkc30pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBzdG9yYWdlUGFja2FnZSA9IGF3YWl0IENPTkZJRy5hdXRvcml6YXRpb25zVmlldy5zdG9yYWdlKENPTkZJRy5hdXRvcml6YXRpb25zVmlldywgREkpXG4gICAgICAgIERJLndhcm4oe21zZzogYHVwZGF0ZVZpZXdgLCBkZWJ1Zzoge21ldGEsIGl0ZW1zLCBpdGVtc0lkc319KVxuICAgICAgICBpdGVtcyA9IFIubWFwKENPTkZJRy5hdXRvcml6YXRpb25zVmlldy5maWx0ZXJJbmNvbWluZ0RhdGEsIGl0ZW1zKVxuICAgICAgICBpdGVtcyA9IFIubWFwKFIubWVyZ2UoeydfZW50aXR5JzogZW50aXR5fSksIGl0ZW1zKVxuICAgICAgICBhd2FpdCBzdG9yYWdlUGFja2FnZS51cGRhdGUoe1xuICAgICAgICAgIHF1ZXJpZXNBcnJheTogUi5tYXAoKGl0ZW1JZCkgPT4gKHsnX2lkJzogaXRlbUlkfSksIGl0ZW1zSWRzKSxcbiAgICAgICAgICBkYXRhQXJyYXk6IGl0ZW1zLFxuICAgICAgICAgIGluc2VydElmTm90RXhpc3RzOiB0cnVlfSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKHttZXNzYWdlOiAncHJvYmxlbXMgZHVyaW5nIHVwZGF0ZUF1dG9yaXphdGlvbnNWaWV3Jywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuICAgICAgfVxuICAgIH19KVxuXG4gIFNFUlZJQ0UucmVnaXN0ZXJSb3V0ZSh7XG4gICAgcm91dGU6ICdhdXRob3JpemUnLFxuICAgIHJvdXRlRnVuY3Rpb246IGFzeW5jIGZ1bmN0aW9uIGF1dGhvcml6ZSAoe2FjdGlvbiwgZW50aXR5TmFtZSwgaXRlbXNJZHMsIG1ldGF9KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBESS53YXJuKHttc2c6IGBhdXRob3JpemVgLCBkZWJ1Zzoge2FjdGlvbiwgZW50aXR5TmFtZSwgaXRlbXNJZHMsIG1ldGF9fSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1c2VyRGF0YTogeyd1c2VySWQnOiAnMTk1MTUxNjYyNjYxJ31cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdwcm9ibGVtcyBkdXJpbmcgYXV0aG9yaXplJywgb3JpZ2luYWxFcnJvcjogZXJyb3J9KVxuICAgICAgfVxuICAgIH19KVxuXG4gIFNFUlZJQ0UucmVnaXN0ZXJSb3V0ZSh7XG4gICAgcm91dGU6ICd0ZXN0JyxcbiAgICByb3V0ZUZ1bmN0aW9uOiBhc3luYyBmdW5jdGlvbiB0ZXN0ICh0ZXN0KSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdGVzdFxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdwcm9ibGVtcyBkdXJpbmcgdGVzdCcsIG9yaWdpbmFsRXJyb3I6IGVycm9yfSlcbiAgICAgIH1cbiAgICB9fSlcblxuICB2YXIgdXNlclBlcm1pc3Npb25CYXNlUGFja2FnZSA9IGF3YWl0IHJlcXVpcmUoJy4uL2VudGl0eS5iYXNlJykoQ09ORklHWydVc2VyUGVybWlzc2lvbiddLCBESSlcblxuICBTRVJWSUNFLnJlZ2lzdGVyUm91dGUoe1xuICAgIHJvdXRlOiAndXBkYXRlVXNlclBlcm1pc3Npb24nLFxuICAgIHJvdXRlRnVuY3Rpb246IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVVzZXJQZXJtaXNzaW9uUm91dGUgKHttZXRhLCBpdGVtcywgaXRlbXNJZHN9KSB7XG4gICAgICB0cnkge1xuICAgICAgICAoe2l0ZW1zLCBpdGVtc0lkc30gPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWVzdEl0ZW1zSWRzQW5kSXRlbXMoe2l0ZW1zLCBpdGVtc0lkcywgYXBwZW5kSWRzVG9JdGVtczogdHJ1ZX0pKVxuICAgICAgICB2YXIgZmlsdGVyUHJvcHMgPSBSLnBpY2tCeSgodmFsLCBrZXkpID0+IChrZXkgPT09ICdfaWQnIHx8IGtleS5jaGFyQXQoMCkgIT09ICdfJykpIC8vIHJlbW92ZSBpdGVtcyBkYXRhIHN0YXJ0aW5nIHdpdGggXyAoZXhjbHVkZSBfaWQgKVxuICAgICAgICBpdGVtcyA9IFIubWFwKGZpbHRlclByb3BzLCBpdGVtcylcbiAgICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgREkuYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS51cGRhdGUnLCBlbnRpdHlOYW1lOiAnVXNlclBlcm1pc3Npb24nLCBpdGVtcywgaXRlbXNJZHMsIG1ldGF9KVxuICAgICAgICBhd2FpdCB1c2VyUGVybWlzc2lvbkJhc2VQYWNrYWdlLnVwZGF0ZSh7aXRlbXMsIGl0ZW1zSWRzLCB1c2VyRGF0YX0pXG4gICAgICAgIHJldHVybiB7aXRlbXNJZHN9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZSh7bWVzc2FnZTogJ1Blcm1pc3Npb24gcHJvYmxlbXMgZHVyaW5nIHVwZGF0ZSd9KVxuICAgICAgfVxuICAgIH19KVxuICBTRVJWSUNFLnJlZ2lzdGVyUm91dGUoe1xuICAgIHJvdXRlOiAnZGVsZXRlVXNlclBlcm1pc3Npb24nLFxuICAgIHJvdXRlRnVuY3Rpb246IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVVzZXJQZXJtaXNzaW9uUm91dGUgKHttZXRhLCBpdGVtc0lkcywgaXRlbXN9KSB7XG4gICAgICB0cnkge1xuICAgICAgICAoe2l0ZW1zSWRzfSA9IHJlcXVpcmUoJy4uL2plc3VzJykuY2hlY2tSZXF1ZXN0SXRlbXNJZHNBbmRJdGVtcyh7aXRlbXMsIGl0ZW1zSWRzfSkpXG4gICAgICAgIGl0ZW1zID0gUi5tYXAoKCkgPT4gKHsnX2RlbGV0ZWQnOiB0cnVlfSksIGl0ZW1zSWRzKVxuICAgICAgICAvL2NvbnNvbGUubG9nKHtpdGVtc30pXG4gICAgICAgIHZhciB1c2VyRGF0YSA9IGF3YWl0IERJLmF1dGhvcml6ZSh7YWN0aW9uOiAnd3JpdGUuZGVsZXRlJywgZW50aXR5TmFtZTogJ1VzZXJQZXJtaXNzaW9uJywgaXRlbXMsIGl0ZW1zSWRzLCBtZXRhfSlcbiAgICAgICAgYXdhaXQgdXNlclBlcm1pc3Npb25CYXNlUGFja2FnZS51cGRhdGUoe2l0ZW1zLCBpdGVtc0lkcywgdXNlckRhdGF9KVxuICAgICAgICByZXR1cm4ge2l0ZW1zSWRzfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIERJLmVycm9yUmVzcG9uc2Uoe21lc3NhZ2U6ICdQZXJtaXNzaW9uIHByb2JsZW1zIGR1cmluZyBkZWxldGUnfSlcbiAgICAgIH1cbiAgICB9fSlcblxuICBTRVJWSUNFLnJlZ2lzdGVyUm91dGUoe1xuICAgIHJvdXRlOiAncmVhZFVzZXJQZXJtaXNzaW9uJyxcbiAgICByb3V0ZUZ1bmN0aW9uOiBhc3luYyBmdW5jdGlvbiByZWFkVXNlclBlcm1pc3Npb25Sb3V0ZSAoe21ldGEsIGl0ZW1zLCBpdGVtc0lkc30pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgICh7aXRlbXNJZHN9ID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVlc3RJdGVtc0lkc0FuZEl0ZW1zKHtpdGVtc0lkc30pKVxuICAgICAgICB2YXIgdXNlckRhdGEgPSBhd2FpdCBESS5hdXRob3JpemUoe2FjdGlvbjogJ3JlYWQnLCBlbnRpdHlOYW1lOiAnVXNlclBlcm1pc3Npb24nLCBpdGVtcywgaXRlbXNJZHMsIG1ldGF9KVxuICAgICAgICBpdGVtcyA9IGF3YWl0IHVzZXJQZXJtaXNzaW9uQmFzZVBhY2thZ2UucmVhZCh7aXRlbXMsIGl0ZW1zSWRzLCB1c2VyRGF0YX0pXG4gICAgICAgIHJldHVybiB7aXRlbXN9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZSh7bWVzc2FnZTogJ1Blcm1pc3Npb24gcHJvYmxlbXMgZHVyaW5nIHJlYWQnfSlcbiAgICAgIH1cbiAgICB9fSlcblxuICB2YXIgdXNlckNxcnNQYWNrYWdlID0gYXdhaXQgcmVxdWlyZSgnLi4vZW50aXR5LmNxcnMnKShDT05GSUdbJ1VzZXInXSwgREkpXG5cbiAgU0VSVklDRS5yZWdpc3RlclJvdXRlKHtcbiAgICByb3V0ZTogJ2NyZWF0ZVVzZXInLFxuICAgIHJvdXRlRnVuY3Rpb246IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVVzZXJSb3V0ZSAoe21ldGEsIGl0ZW1zLCBpdGVtc0lkc30pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgICh7aXRlbXMsIGl0ZW1zSWRzfSA9IHJlcXVpcmUoJy4uL2plc3VzJykuY2hlY2tSZXF1ZXN0SXRlbXNJZHNBbmRJdGVtcyh7aXRlbXMsIGl0ZW1zSWRzLCBnZW5lcmF0ZUlkczogdHJ1ZSwgYXBwZW5kSWRzVG9JdGVtczogdHJ1ZX0pKVxuICAgICAgICBESS5kZWJ1Zyh7bXNnOiBgc3RhcnQgY3JlYXRlVXNlclJvdXRlKClgLCBjb250ZXh0OiAnU0VSVklDRScsIGRlYnVnOiB7aXRlbXMsIGl0ZW1zSWRzfX0pXG4gICAgICAgIHZhciB1c2VyRGF0YSA9IGF3YWl0IERJLmF1dGhvcml6ZSh7YWN0aW9uOiAnd3JpdGUuY3JlYXRlJywgZW50aXR5TmFtZTogJ1VzZXInLCBpdGVtcywgaXRlbXNJZHMsIG1ldGF9KVxuICAgICAgICB2YXIgYWRkZWRNdXRhdGlvbnMgPSBhd2FpdCB1c2VyQ3Fyc1BhY2thZ2UubXV0YXRlKHtpdGVtcywgaXRlbXNJZHMsIG11dGF0aW9uOiAnY3JlYXRlJywgdXNlckRhdGF9KVxuICAgICAgICB1c2VyQ3Fyc1BhY2thZ2UucmVmcmVzaFZpZXdzKHtpdGVtc0lkcywgbG9hZFNuYXBzaG90OiBmYWxzZSwgbG9hZE11dGF0aW9uczogZmFsc2UsIGFkZE11dGF0aW9uczogYWRkZWRNdXRhdGlvbnN9KSAvLyBub3QgYXdhaXRcbiAgICAgICAgcmV0dXJuIHtpdGVtc0lkc31cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKHttZXNzYWdlOiAncHJvYmxlbXMgZHVyaW5nIGNyZWF0ZScsIG9yaWdpbmFsRXJyb3I6IGVycm9yfSlcbiAgICAgIH1cbiAgICB9fSlcblxuICBTRVJWSUNFLnJlZ2lzdGVyUm91dGUoe1xuICAgIHJvdXRlOiAndXBkYXRlVXNlcicsXG4gICAgcm91dGVGdW5jdGlvbjogYXN5bmMgZnVuY3Rpb24gdXBkYXRlVXNlclJvdXRlICh7bWV0YSwgaXRlbXNJZHMsIGl0ZW1zfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgKHtpdGVtcywgaXRlbXNJZHN9ID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVlc3RJdGVtc0lkc0FuZEl0ZW1zKHtpdGVtcywgaXRlbXNJZHN9KSlcbiAgICAgICAgdmFyIGZpbHRlclByb3BzID0gUi5waWNrQnkoKHZhbCwga2V5KSA9PiAoa2V5LmNoYXJBdCgwKSAhPT0gJ18nKSkgLy8gcmVtb3ZlIGl0ZW1zIGRhdGEgc3RhcnRpbmcgd2l0aCBfICggX2lkICwgX2RlbGV0ZWQgZWNjKVxuICAgICAgICBpdGVtcyA9IFIubWFwKGZpbHRlclByb3BzLCBpdGVtcylcbiAgICAgICAgdmFyIHVzZXJEYXRhID0gYXdhaXQgREkuYXV0aG9yaXplKHthY3Rpb246ICd3cml0ZS51cGRhdGUnLCBlbnRpdHlOYW1lOiAnVXNlcicsIGl0ZW1zLCBpdGVtc0lkcywgbWV0YX0pXG4gICAgICAgIGF3YWl0IHVzZXJDcXJzUGFja2FnZS5tdXRhdGUoe2l0ZW1zLCBpdGVtc0lkcywgbXV0YXRpb246ICd1cGRhdGUnLCB1c2VyRGF0YX0pXG4gICAgICAgIGF3YWl0IHVzZXJDcXJzUGFja2FnZS5yZWZyZXNoVmlld3Moe2l0ZW1zSWRzLCBsb2FkU25hcHNob3Q6IHRydWUsIGxvYWRNdXRhdGlvbnM6IHRydWUgfSkgLy8gbm90IGF3YWl0XG4gICAgICAgIHJldHVybiB7aXRlbXNJZHN9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZSh7bWVzc2FnZTogJ3Byb2JsZW1zIGR1cmluZyB1cGRhdGUnfSlcbiAgICAgIH1cbiAgICB9fSlcbiAgU0VSVklDRS5yZWdpc3RlclJvdXRlKHtcbiAgICByb3V0ZTogJ2RlbGV0ZVVzZXInLFxuICAgIHJvdXRlRnVuY3Rpb246IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVVzZXJSb3V0ZSAoe21ldGEsIGl0ZW1zSWRzLCBpdGVtc30pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgICh7aXRlbXNJZHN9ID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVlc3RJdGVtc0lkc0FuZEl0ZW1zKHtpdGVtc0lkc30pKVxuICAgICAgICB2YXIgdXNlckRhdGEgPSBhd2FpdCBESS5hdXRob3JpemUoe2FjdGlvbjogJ3dyaXRlLmRlbGV0ZScsIGVudGl0eU5hbWU6ICdVc2VyJywgaXRlbXNJZHMsIG1ldGF9KVxuICAgICAgICBhd2FpdCB1c2VyQ3Fyc1BhY2thZ2UubXV0YXRlKHtpdGVtc0lkcywgbXV0YXRpb246ICdkZWxldGUnLCB1c2VyRGF0YX0pXG4gICAgICAgIGF3YWl0IHVzZXJDcXJzUGFja2FnZS5yZWZyZXNoVmlld3Moe2l0ZW1zSWRzLCBsb2FkU25hcHNob3Q6IHRydWUsIGxvYWRNdXRhdGlvbnM6IHRydWUgfSkgLy8gbm90IGF3YWl0XG4gICAgICAgIHJldHVybiB7aXRlbXNJZHN9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gREkuZXJyb3JSZXNwb25zZShlcnJvcilcbiAgICAgIH1cbiAgICB9fSlcbiAgU0VSVklDRS5yZWdpc3RlclJvdXRlKHtcbiAgICByb3V0ZTogJ3JlYWRVc2VyJyxcbiAgICBwcml2YXRlOiB0cnVlLFxuICAgIHJvdXRlRnVuY3Rpb246IGFzeW5jIGZ1bmN0aW9uIHJlYWRVc2VyUm91dGUgKHttZXRhLCBpdGVtc0lkc30pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgICh7aXRlbXNJZHN9ID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVlc3RJdGVtc0lkc0FuZEl0ZW1zKHtpdGVtc0lkc30pKVxuICAgICAgICB2YXIgdXNlckRhdGEgPSBhd2FpdCBESS5hdXRob3JpemUoe2FjdGlvbjogJ3JlYWQnLCBlbnRpdHlOYW1lOiAnVXNlcicsIGl0ZW1zSWRzLCBtZXRhfSlcbiAgICAgICAgdmFyIGl0ZW1zID0gYXdhaXQgdXNlckNxcnNQYWNrYWdlLnJlYWQoe2l0ZW1zSWRzfSlcbiAgICAgICAgLy9jb25zb2xlLmxvZyh7aXRlbXNJZHMsIGl0ZW1zfSlcbiAgICAgICAgcmV0dXJuIHtpdGVtc31cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBESS5lcnJvclJlc3BvbnNlKGVycm9yKVxuICAgICAgfVxuICAgIH19KVxuXG4gIFNFUlZJQ0UuYXBpUmVzdCA9IHJlcXVpcmUoJy4uL2FwaS5odHRwJykoQ09ORklHLCBESSlcbiAgYXdhaXQgU0VSVklDRS5hcGlSZXN0LnN0YXJ0KClcbiAgYXdhaXQgTkVULnN0YXJ0KClcbiAgU0VSVklDRS5zdG9wID0gKCkgPT4ge1xuICAgIFNFUlZJQ0UuYXBpUmVzdC5zdG9wKClcbiAgICBORVQuc3RvcCgpXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBTRVJWSUNFLFxuICAgIENPTkZJRyxcbiAgICBESSxcbiAgICBORVRcbiAgfVxufVxuIl19