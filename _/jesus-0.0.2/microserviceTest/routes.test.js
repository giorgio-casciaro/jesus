'use strict';

if (!global._babelPolyfill) {
  require('babel-polyfill');
}
var getMicroservice = require('./microservice');
var t = require('tap');
t.test('*** JESUS SERVICE ENTITY ***', {
  autoend: true
}, function mainTest(t) {
  var SERVICE, CONFIG, DI, _ref;

  return regeneratorRuntime.async(function mainTest$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getMicroservice());

        case 2:
          _ref = _context2.sent;
          SERVICE = _ref.SERVICE;
          CONFIG = _ref.CONFIG;
          DI = _ref.DI;

          t.plan(1);
          _context2.next = 9;
          return regeneratorRuntime.awrap(t.test('-> ENTITY CREATE', function _callee(t) {
            var serviceCreateUserRequest, serviceReadUserRequest, serviceUpdateUserRequest, serviceRead2UserRequest, serviceDeleteUserRequest, serviceRead3UserRequest, serviceUpdateUserErrorRequest, serviceUpdateUserPermissionRequest, serviceReadUserPermissionRequest, serviceDeleteUserPermissionRequest, serviceUpdateNotAllowedUserPermissionRequest;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    // try {

                    // CALL CREATE USER
                    serviceCreateUserRequest = { items: [{ username: 'test', email: 'test@test.com' }, { username: 'test2', email: 'test@test.com' }] };
                    _context.next = 3;
                    return regeneratorRuntime.awrap(SERVICE.callRoute({ route: 'createUser', request: serviceCreateUserRequest }));

                  case 3:
                    global.serviceCreateResponse = _context.sent;

                    DI.debug('global.serviceCreateResponse', global.serviceCreateResponse);
                    t.type(global.serviceCreateResponse, 'object', 'Response is object');
                    t.type(global.serviceCreateResponse.itemsIds, 'Array', 'itemsIds is array');
                    t.equal(global.serviceCreateResponse.itemsIds.length, 2, 'itemsIds length is 2');

                    // CALL READ USER
                    serviceReadUserRequest = { itemsIds: [global.serviceCreateResponse.itemsIds[0]] };
                    _context.next = 11;
                    return regeneratorRuntime.awrap(SERVICE.callRoute({ route: 'readUser', request: serviceReadUserRequest }));

                  case 11:
                    global.serviceReadResponse = _context.sent;

                    DI.debug('global.serviceReadResponse', global.serviceReadResponse);
                    t.type(global.serviceReadResponse, 'object', 'serviceReadResponse is object');
                    t.type(global.serviceReadResponse.items, 'Array', 'items is array');
                    t.equal(global.serviceReadResponse.items.length, 1, 'items length is 1');
                    t.equal(global.serviceReadResponse.items[0].username, 'test', 'name item 0 same as sended');

                    // CALL UPDATE USER
                    serviceUpdateUserRequest = { itemsIds: [global.serviceCreateResponse.itemsIds[0]], items: [{ username: 'testUpdated' }] };
                    _context.next = 20;
                    return regeneratorRuntime.awrap(SERVICE.callRoute({ route: 'updateUser', request: serviceUpdateUserRequest }));

                  case 20:
                    global.serviceUpdateResponse = _context.sent;

                    DI.debug('global.serviceUpdateResponse', global.serviceUpdateResponse);
                    t.type(global.serviceUpdateResponse, 'object', 'serviceUpdateResponse is object');
                    t.type(global.serviceUpdateResponse.itemsIds, 'Array', 'items is array');
                    t.equal(global.serviceUpdateResponse.itemsIds.length, 1, 'items length is 1');

                    // CALL READ USER
                    serviceRead2UserRequest = { itemsIds: [global.serviceCreateResponse.itemsIds[0]] };
                    _context.next = 28;
                    return regeneratorRuntime.awrap(SERVICE.callRoute({ route: 'readUser', request: serviceRead2UserRequest }));

                  case 28:
                    global.serviceRead2Response = _context.sent;

                    DI.debug('global.serviceRead2Response', global.serviceRead2Response);
                    t.type(global.serviceRead2Response, 'object', 'serviceRead2Response is object');
                    t.type(global.serviceRead2Response.items, 'Array', 'items is array');
                    t.equal(global.serviceRead2Response.items.length, 1, 'items length is 1');
                    t.equal(global.serviceRead2Response.items[0].username, 'testUpdated', 'name item 0 same as sended');

                    // CALL DELETE USER
                    serviceDeleteUserRequest = { itemsIds: [global.serviceCreateResponse.itemsIds[0]] };
                    _context.next = 37;
                    return regeneratorRuntime.awrap(SERVICE.callRoute({ route: 'deleteUser', request: serviceDeleteUserRequest }));

                  case 37:
                    global.serviceDeleteResponse = _context.sent;

                    DI.debug('global.serviceRead2Response', global.serviceRead2Response);
                    t.type(global.serviceDeleteResponse, 'object', 'serviceDeleteResponse is object');
                    t.type(global.serviceDeleteResponse.itemsIds, 'Array', 'items is array');
                    t.equal(global.serviceDeleteResponse.itemsIds.length, 1, 'items length is 1');

                    // CALL READ DELETED USER
                    serviceRead3UserRequest = { itemsIds: [global.serviceCreateResponse.itemsIds[0]] };
                    _context.next = 45;
                    return regeneratorRuntime.awrap(SERVICE.callRoute({ route: 'readUser', request: serviceRead3UserRequest }));

                  case 45:
                    global.serviceRead3Response = _context.sent;

                    DI.debug('global.serviceRead3Response', global.serviceRead3Response);
                    t.type(global.serviceRead3Response, 'object', 'serviceRead3Response is object');
                    t.type(global.serviceRead3Response.items, 'Array', 'items is array');
                    t.equal(global.serviceRead3Response.items.length, 1, 'items length is 1');
                    t.equal(global.serviceRead3Response.items[0]._deleted, true, '_deleted item 0 set to true');

                    // CALL UPDATE USER WITH ERRORS
                    serviceUpdateUserErrorRequest = {};
                    _context.next = 54;
                    return regeneratorRuntime.awrap(SERVICE.callRoute({ route: 'updateUser', request: serviceUpdateUserErrorRequest }));

                  case 54:
                    global.serviceUpdateErrorResponse = _context.sent;

                    DI.debug('global.serviceUpdateResponse', global.serviceUpdateErrorResponse);
                    t.equal(global.serviceUpdateErrorResponse._error, true, 'items length is 1');

                    // CALL UPDATE USER PERMISSION
                    serviceUpdateUserPermissionRequest = { itemsIds: ['testPermission'], items: [{ entity: '*', action: '*', type: 'rbac', permit: true, force: true, args: { roleId: 'admin' } }] };
                    _context.next = 60;
                    return regeneratorRuntime.awrap(SERVICE.callRoute({ route: 'updateUserPermission', request: serviceUpdateUserPermissionRequest }));

                  case 60:
                    global.serviceUpdateUserPermissionResponse = _context.sent;

                    DI.debug('global.serviceUpdateUserPermissionResponse', global.serviceUpdateUserPermissionResponse);
                    t.equal(global.serviceUpdateUserPermissionResponse.itemsIds[0], 'testPermission', 'serviceUpdate UserPermission Response');

                    // CALL READ USER PERMISSION
                    serviceReadUserPermissionRequest = { itemsIds: ['testPermission'] };
                    _context.next = 66;
                    return regeneratorRuntime.awrap(SERVICE.callRoute({ route: 'readUserPermission', request: serviceReadUserPermissionRequest }));

                  case 66:
                    global.serviceReadUserPermissionResponse = _context.sent;

                    DI.debug('global.serviceReadUserPermissionResponse', global.serviceReadUserPermissionResponse);
                    t.equal(global.serviceReadUserPermissionResponse.items[0].entity, '*', 'serviceRead UserPermission Response SAME AS SENDED');

                    // CALL DELETE USER PERMISSION
                    serviceDeleteUserPermissionRequest = { itemsIds: ['testPermission'] };
                    _context.next = 72;
                    return regeneratorRuntime.awrap(SERVICE.callRoute({ route: 'deleteUserPermission', request: serviceDeleteUserPermissionRequest }));

                  case 72:
                    global.serviceDeleteUserPermissionResponse = _context.sent;

                    DI.debug('global.serviceDeleteUserPermissionResponse', global.serviceDeleteUserPermissionResponse);
                    t.equal(global.serviceUpdateUserPermissionResponse.itemsIds[0], 'testPermission', 'serviceDelete UserPermission Response');

                    serviceUpdateNotAllowedUserPermissionRequest = { itemsIds: ['testPermission'], items: [{ _deleted: false }] };
                    _context.next = 78;
                    return regeneratorRuntime.awrap(SERVICE.callRoute({ route: 'updateUserPermission', request: serviceUpdateNotAllowedUserPermissionRequest }));

                  case 78:
                    global.serviceDeleteUserPermissionResponse = _context.sent;


                    SERVICE.stop();
                    t.end();
                    // } catch (error) {
                    //   //DI.error(error)
                    //   t.fail('FAIL createEntityTest')
                    //   t.end('FAIL createEntityTest')
                    // }

                  case 81:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this);
          }));

        case 9:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJvdXRlcy50ZXN0LmVzNiJdLCJuYW1lcyI6WyJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsInJlcXVpcmUiLCJnZXRNaWNyb3NlcnZpY2UiLCJ0IiwidGVzdCIsImF1dG9lbmQiLCJtYWluVGVzdCIsIlNFUlZJQ0UiLCJDT05GSUciLCJESSIsInBsYW4iLCJzZXJ2aWNlQ3JlYXRlVXNlclJlcXVlc3QiLCJpdGVtcyIsInVzZXJuYW1lIiwiZW1haWwiLCJjYWxsUm91dGUiLCJyb3V0ZSIsInJlcXVlc3QiLCJzZXJ2aWNlQ3JlYXRlUmVzcG9uc2UiLCJkZWJ1ZyIsInR5cGUiLCJpdGVtc0lkcyIsImVxdWFsIiwibGVuZ3RoIiwic2VydmljZVJlYWRVc2VyUmVxdWVzdCIsInNlcnZpY2VSZWFkUmVzcG9uc2UiLCJzZXJ2aWNlVXBkYXRlVXNlclJlcXVlc3QiLCJzZXJ2aWNlVXBkYXRlUmVzcG9uc2UiLCJzZXJ2aWNlUmVhZDJVc2VyUmVxdWVzdCIsInNlcnZpY2VSZWFkMlJlc3BvbnNlIiwic2VydmljZURlbGV0ZVVzZXJSZXF1ZXN0Iiwic2VydmljZURlbGV0ZVJlc3BvbnNlIiwic2VydmljZVJlYWQzVXNlclJlcXVlc3QiLCJzZXJ2aWNlUmVhZDNSZXNwb25zZSIsIl9kZWxldGVkIiwic2VydmljZVVwZGF0ZVVzZXJFcnJvclJlcXVlc3QiLCJzZXJ2aWNlVXBkYXRlRXJyb3JSZXNwb25zZSIsIl9lcnJvciIsInNlcnZpY2VVcGRhdGVVc2VyUGVybWlzc2lvblJlcXVlc3QiLCJlbnRpdHkiLCJhY3Rpb24iLCJwZXJtaXQiLCJmb3JjZSIsImFyZ3MiLCJyb2xlSWQiLCJzZXJ2aWNlVXBkYXRlVXNlclBlcm1pc3Npb25SZXNwb25zZSIsInNlcnZpY2VSZWFkVXNlclBlcm1pc3Npb25SZXF1ZXN0Iiwic2VydmljZVJlYWRVc2VyUGVybWlzc2lvblJlc3BvbnNlIiwic2VydmljZURlbGV0ZVVzZXJQZXJtaXNzaW9uUmVxdWVzdCIsInNlcnZpY2VEZWxldGVVc2VyUGVybWlzc2lvblJlc3BvbnNlIiwic2VydmljZVVwZGF0ZU5vdEFsbG93ZWRVc2VyUGVybWlzc2lvblJlcXVlc3QiLCJzdG9wIiwiZW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksQ0FBQ0EsT0FBT0MsY0FBWixFQUE0QjtBQUMxQkMsVUFBUSxnQkFBUjtBQUNEO0FBQ0QsSUFBSUMsa0JBQWtCRCxRQUFRLGdCQUFSLENBQXRCO0FBQ0EsSUFBSUUsSUFBSUYsUUFBUSxLQUFSLENBQVI7QUFDQUUsRUFBRUMsSUFBRixDQUFPLDhCQUFQLEVBQXVDO0FBQ3JDQyxXQUFTO0FBRDRCLENBQXZDLEVBRUcsU0FBZUMsUUFBZixDQUF5QkgsQ0FBekI7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsMENBRWdDRCxpQkFGaEM7O0FBQUE7QUFBQTtBQUVFSyxpQkFGRixRQUVFQSxPQUZGO0FBRVdDLGdCQUZYLFFBRVdBLE1BRlg7QUFFbUJDLFlBRm5CLFFBRW1CQSxFQUZuQjs7QUFHRE4sWUFBRU8sSUFBRixDQUFPLENBQVA7QUFIQztBQUFBLDBDQUlLUCxFQUFFQyxJQUFGLENBQU8sa0JBQVAsRUFBMkIsaUJBQWdCRCxDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDL0I7O0FBRUU7QUFDRVEsNENBSjJCLEdBSUEsRUFBQ0MsT0FBTyxDQUFDLEVBQUNDLFVBQVUsTUFBWCxFQUFtQkMsT0FBTyxlQUExQixFQUFELEVBQTZDLEVBQUNELFVBQVUsT0FBWCxFQUFvQkMsT0FBTyxlQUEzQixFQUE3QyxDQUFSLEVBSkE7QUFBQTtBQUFBLG9EQUtNUCxRQUFRUSxTQUFSLENBQWtCLEVBQUNDLE9BQU8sWUFBUixFQUFzQkMsU0FBU04sd0JBQS9CLEVBQWxCLENBTE47O0FBQUE7QUFLL0JaLDJCQUFPbUIscUJBTHdCOztBQU0vQlQsdUJBQUdVLEtBQUgsQ0FBUyw4QkFBVCxFQUF5Q3BCLE9BQU9tQixxQkFBaEQ7QUFDQWYsc0JBQUVpQixJQUFGLENBQU9yQixPQUFPbUIscUJBQWQsRUFBcUMs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QUM3QixVQUFVLENBQUMsZ0JBQUQsQ0FBWCxFQUErQlQsT0FBTyxDQUFDLEVBQUNzQixVQUFVLEtBQVgsRUFBRCxDQUF0QyxFQTlFcEI7QUFBQTtBQUFBLG9EQStFb0IzQixRQUFRUSxTQUFSLENBQWtCLEVBQUNDLE9BQU8sc0JBQVIsRUFBZ0NDLFNBQVNpQyw0Q0FBekMsRUFBbEIsQ0EvRXBCOztBQUFBO0FBK0UvQm5ELDJCQUFPa0QsbUNBL0V3Qjs7O0FBaUYvQjFDLDRCQUFRNEMsSUFBUjtBQUNBaEQsc0JBQUVpRCxHQUFGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUF2RitCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQTNCLENBSkw7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FGSCIsImZpbGUiOiJyb3V0ZXMudGVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJpZiAoIWdsb2JhbC5fYmFiZWxQb2x5ZmlsbCkge1xuICByZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpXG59XG52YXIgZ2V0TWljcm9zZXJ2aWNlID0gcmVxdWlyZSgnLi9taWNyb3NlcnZpY2UnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudC50ZXN0KCcqKiogSkVTVVMgU0VSVklDRSBFTlRJVFkgKioqJywge1xuICBhdXRvZW5kOiB0cnVlXG59LCBhc3luYyBmdW5jdGlvbiBtYWluVGVzdCAodCkge1xuICB2YXIgU0VSVklDRSwgQ09ORklHLCBESVxuICAoeyBTRVJWSUNFLCBDT05GSUcsIERJIH0gPSBhd2FpdCBnZXRNaWNyb3NlcnZpY2UoKSlcbiAgdC5wbGFuKDEpXG4gIGF3YWl0IHQudGVzdCgnLT4gRU5USVRZIENSRUFURScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgLy8gdHJ5IHtcblxuICAgICAgLy8gQ0FMTCBDUkVBVEUgVVNFUlxuICAgIHZhciBzZXJ2aWNlQ3JlYXRlVXNlclJlcXVlc3QgPSB7aXRlbXM6IFt7dXNlcm5hbWU6ICd0ZXN0JywgZW1haWw6ICd0ZXN0QHRlc3QuY29tJ30sIHt1c2VybmFtZTogJ3Rlc3QyJywgZW1haWw6ICd0ZXN0QHRlc3QuY29tJ31dfVxuICAgIGdsb2JhbC5zZXJ2aWNlQ3JlYXRlUmVzcG9uc2UgPSBhd2FpdCBTRVJWSUNFLmNhbGxSb3V0ZSh7cm91dGU6ICdjcmVhdGVVc2VyJywgcmVxdWVzdDogc2VydmljZUNyZWF0ZVVzZXJSZXF1ZXN0fSlcbiAgICBESS5kZWJ1ZygnZ2xvYmFsLnNlcnZpY2VDcmVhdGVSZXNwb25zZScsIGdsb2JhbC5zZXJ2aWNlQ3JlYXRlUmVzcG9uc2UpXG4gICAgdC50eXBlKGdsb2JhbC5zZXJ2aWNlQ3JlYXRlUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgaXMgb2JqZWN0JylcbiAgICB0LnR5cGUoZ2xvYmFsLnNlcnZpY2VDcmVhdGVSZXNwb25zZS5pdGVtc0lkcywgJ0FycmF5JywgJ2l0ZW1zSWRzIGlzIGFycmF5JylcbiAgICB0LmVxdWFsKGdsb2JhbC5zZXJ2aWNlQ3JlYXRlUmVzcG9uc2UuaXRlbXNJZHMubGVuZ3RoLCAyLCAnaXRlbXNJZHMgbGVuZ3RoIGlzIDInKVxuXG4gICAgICAvLyBDQUxMIFJFQUQgVVNFUlxuICAgIHZhciBzZXJ2aWNlUmVhZFVzZXJSZXF1ZXN0ID0ge2l0ZW1zSWRzOiBbZ2xvYmFsLnNlcnZpY2VDcmVhdGVSZXNwb25zZS5pdGVtc0lkc1swXV19XG4gICAgZ2xvYmFsLnNlcnZpY2VSZWFkUmVzcG9uc2UgPSBhd2FpdCBTRVJWSUNFLmNhbGxSb3V0ZSh7cm91dGU6ICdyZWFkVXNlcicsIHJlcXVlc3Q6IHNlcnZpY2VSZWFkVXNlclJlcXVlc3R9KVxuICAgIERJLmRlYnVnKCdnbG9iYWwuc2VydmljZVJlYWRSZXNwb25zZScsIGdsb2JhbC5zZXJ2aWNlUmVhZFJlc3BvbnNlKVxuICAgIHQudHlwZShnbG9iYWwuc2VydmljZVJlYWRSZXNwb25zZSwgJ29iamVjdCcsICdzZXJ2aWNlUmVhZFJlc3BvbnNlIGlzIG9iamVjdCcpXG4gICAgdC50eXBlKGdsb2JhbC5zZXJ2aWNlUmVhZFJlc3BvbnNlLml0ZW1zLCAnQXJyYXknLCAnaXRlbXMgaXMgYXJyYXknKVxuICAgIHQuZXF1YWwoZ2xvYmFsLnNlcnZpY2VSZWFkUmVzcG9uc2UuaXRlbXMubGVuZ3RoLCAxLCAnaXRlbXMgbGVuZ3RoIGlzIDEnKVxuICAgIHQuZXF1YWwoZ2xvYmFsLnNlcnZpY2VSZWFkUmVzcG9uc2UuaXRlbXNbMF0udXNlcm5hbWUsICd0ZXN0JywgJ25hbWUgaXRlbSAwIHNhbWUgYXMgc2VuZGVkJylcblxuICAgICAgLy8gQ0FMTCBVUERBVEUgVVNFUlxuICAgIHZhciBzZXJ2aWNlVXBkYXRlVXNlclJlcXVlc3QgPSB7aXRlbXNJZHM6IFtnbG9iYWwuc2VydmljZUNyZWF0ZVJlc3BvbnNlLml0ZW1zSWRzWzBdXSwgaXRlbXM6IFt7dXNlcm5hbWU6ICd0ZXN0VXBkYXRlZCd9XX1cbiAgICBnbG9iYWwuc2VydmljZVVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgU0VSVklDRS5jYWxsUm91dGUoe3JvdXRlOiAndXBkYXRlVXNlcicsIHJlcXVlc3Q6IHNlcnZpY2VVcGRhdGVVc2VyUmVxdWVzdH0pXG4gICAgREkuZGVidWcoJ2dsb2JhbC5zZXJ2aWNlVXBkYXRlUmVzcG9uc2UnLCBnbG9iYWwuc2VydmljZVVwZGF0ZVJlc3BvbnNlKVxuICAgIHQudHlwZShnbG9iYWwuc2VydmljZVVwZGF0ZVJlc3BvbnNlLCAnb2JqZWN0JywgJ3NlcnZpY2VVcGRhdGVSZXNwb25zZSBpcyBvYmplY3QnKVxuICAgIHQudHlwZShnbG9iYWwuc2VydmljZVVwZGF0ZVJlc3BvbnNlLml0ZW1zSWRzLCAnQXJyYXknLCAnaXRlbXMgaXMgYXJyYXknKVxuICAgIHQuZXF1YWwoZ2xvYmFsLnNlcnZpY2VVcGRhdGVSZXNwb25zZS5pdGVtc0lkcy5sZW5ndGgsIDEsICdpdGVtcyBsZW5ndGggaXMgMScpXG5cbiAgICAgIC8vIENBTEwgUkVBRCBVU0VSXG4gICAgdmFyIHNlcnZpY2VSZWFkMlVzZXJSZXF1ZXN0ID0ge2l0ZW1zSWRzOiBbZ2xvYmFsLnNlcnZpY2VDcmVhdGVSZXNwb25zZS5pdGVtc0lkc1swXV19XG4gICAgZ2xvYmFsLnNlcnZpY2VSZWFkMlJlc3BvbnNlID0gYXdhaXQgU0VSVklDRS5jYWxsUm91dGUoe3JvdXRlOiAncmVhZFVzZXInLCByZXF1ZXN0OiBzZXJ2aWNlUmVhZDJVc2VyUmVxdWVzdH0pXG4gICAgREkuZGVidWcoJ2dsb2JhbC5zZXJ2aWNlUmVhZDJSZXNwb25zZScsIGdsb2JhbC5zZXJ2aWNlUmVhZDJSZXNwb25zZSlcbiAgICB0LnR5cGUoZ2xvYmFsLnNlcnZpY2VSZWFkMlJlc3BvbnNlLCAnb2JqZWN0JywgJ3NlcnZpY2VSZWFkMlJlc3BvbnNlIGlzIG9iamVjdCcpXG4gICAgdC50eXBlKGdsb2JhbC5zZXJ2aWNlUmVhZDJSZXNwb25zZS5pdGVtcywgJ0FycmF5JywgJ2l0ZW1zIGlzIGFycmF5JylcbiAgICB0LmVxdWFsKGdsb2JhbC5zZXJ2aWNlUmVhZDJSZXNwb25zZS5pdGVtcy5sZW5ndGgsIDEsICdpdGVtcyBsZW5ndGggaXMgMScpXG4gICAgdC5lcXVhbChnbG9iYWwuc2VydmljZVJlYWQyUmVzcG9uc2UuaXRlbXNbMF0udXNlcm5hbWUsICd0ZXN0VXBkYXRlZCcsICduYW1lIGl0ZW0gMCBzYW1lIGFzIHNlbmRlZCcpXG5cbiAgICAgIC8vIENBTEwgREVMRVRFIFVTRVJcbiAgICB2YXIgc2VydmljZURlbGV0ZVVzZXJSZXF1ZXN0ID0ge2l0ZW1zSWRzOiBbZ2xvYmFsLnNlcnZpY2VDcmVhdGVSZXNwb25zZS5pdGVtc0lkc1swXV19XG4gICAgZ2xvYmFsLnNlcnZpY2VEZWxldGVSZXNwb25zZSA9IGF3YWl0IFNFUlZJQ0UuY2FsbFJvdXRlKHtyb3V0ZTogJ2RlbGV0ZVVzZXInLCByZXF1ZXN0OiBzZXJ2aWNlRGVsZXRlVXNlclJlcXVlc3R9KVxuICAgIERJLmRlYnVnKCdnbG9iYWwuc2VydmljZVJlYWQyUmVzcG9uc2UnLCBnbG9iYWwuc2VydmljZVJlYWQyUmVzcG9uc2UpXG4gICAgdC50eXBlKGdsb2JhbC5zZXJ2aWNlRGVsZXRlUmVzcG9uc2UsICdvYmplY3QnLCAnc2VydmljZURlbGV0ZVJlc3BvbnNlIGlzIG9iamVjdCcpXG4gICAgdC50eXBlKGdsb2JhbC5zZXJ2aWNlRGVsZXRlUmVzcG9uc2UuaXRlbXNJZHMsICdBcnJheScsICdpdGVtcyBpcyBhcnJheScpXG4gICAgdC5lcXVhbChnbG9iYWwuc2VydmljZURlbGV0ZVJlc3BvbnNlLml0ZW1zSWRzLmxlbmd0aCwgMSwgJ2l0ZW1zIGxlbmd0aCBpcyAxJylcblxuICAgICAgLy8gQ0FMTCBSRUFEIERFTEVURUQgVVNFUlxuICAgIHZhciBzZXJ2aWNlUmVhZDNVc2VyUmVxdWVzdCA9IHtpdGVtc0lkczogW2dsb2JhbC5zZXJ2aWNlQ3JlYXRlUmVzcG9uc2UuaXRlbXNJZHNbMF1dfVxuICAgIGdsb2JhbC5zZXJ2aWNlUmVhZDNSZXNwb25zZSA9IGF3YWl0IFNFUlZJQ0UuY2FsbFJvdXRlKHtyb3V0ZTogJ3JlYWRVc2VyJywgcmVxdWVzdDogc2VydmljZVJlYWQzVXNlclJlcXVlc3R9KVxuICAgIERJLmRlYnVnKCdnbG9iYWwuc2VydmljZVJlYWQzUmVzcG9uc2UnLCBnbG9iYWwuc2VydmljZVJlYWQzUmVzcG9uc2UpXG4gICAgdC50eXBlKGdsb2JhbC5zZXJ2aWNlUmVhZDNSZXNwb25zZSwgJ29iamVjdCcsICdzZXJ2aWNlUmVhZDNSZXNwb25zZSBpcyBvYmplY3QnKVxuICAgIHQudHlwZShnbG9iYWwuc2VydmljZVJlYWQzUmVzcG9uc2UuaXRlbXMsICdBcnJheScsICdpdGVtcyBpcyBhcnJheScpXG4gICAgdC5lcXVhbChnbG9iYWwuc2VydmljZVJlYWQzUmVzcG9uc2UuaXRlbXMubGVuZ3RoLCAxLCAnaXRlbXMgbGVuZ3RoIGlzIDEnKVxuICAgIHQuZXF1YWwoZ2xvYmFsLnNlcnZpY2VSZWFkM1Jlc3BvbnNlLml0ZW1zWzBdLl9kZWxldGVkLCB0cnVlLCAnX2RlbGV0ZWQgaXRlbSAwIHNldCB0byB0cnVlJylcblxuICAgICAgLy8gQ0FMTCBVUERBVEUgVVNFUiBXSVRIIEVSUk9SU1xuICAgIHZhciBzZXJ2aWNlVXBkYXRlVXNlckVycm9yUmVxdWVzdCA9IHt9XG4gICAgZ2xvYmFsLnNlcnZpY2VVcGRhdGVFcnJvclJlc3BvbnNlID0gYXdhaXQgU0VSVklDRS5jYWxsUm91dGUoe3JvdXRlOiAndXBkYXRlVXNlcicsIHJlcXVlc3Q6IHNlcnZpY2VVcGRhdGVVc2VyRXJyb3JSZXF1ZXN0fSlcbiAgICBESS5kZWJ1ZygnZ2xvYmFsLnNlcnZpY2VVcGRhdGVSZXNwb25zZScsIGdsb2JhbC5zZXJ2aWNlVXBkYXRlRXJyb3JSZXNwb25zZSlcbiAgICB0LmVxdWFsKGdsb2JhbC5zZXJ2aWNlVXBkYXRlRXJyb3JSZXNwb25zZS5fZXJyb3IsIHRydWUsICdpdGVtcyBsZW5ndGggaXMgMScpXG5cbiAgICAvLyBDQUxMIFVQREFURSBVU0VSIFBFUk1JU1NJT05cbiAgICB2YXIgc2VydmljZVVwZGF0ZVVzZXJQZXJtaXNzaW9uUmVxdWVzdCA9IHtpdGVtc0lkczogWyd0ZXN0UGVybWlzc2lvbiddLCBpdGVtczogW3tlbnRpdHk6ICcqJywgYWN0aW9uOiAnKicsIHR5cGU6ICdyYmFjJywgcGVybWl0OiB0cnVlLCBmb3JjZTogdHJ1ZSwgYXJnczoge3JvbGVJZDogJ2FkbWluJ319XX1cbiAgICBnbG9iYWwuc2VydmljZVVwZGF0ZVVzZXJQZXJtaXNzaW9uUmVzcG9uc2UgPSBhd2FpdCBTRVJWSUNFLmNhbGxSb3V0ZSh7cm91dGU6ICd1cGRhdGVVc2VyUGVybWlzc2lvbicsIHJlcXVlc3Q6IHNlcnZpY2VVcGRhdGVVc2VyUGVybWlzc2lvblJlcXVlc3R9KVxuICAgIERJLmRlYnVnKCdnbG9iYWwuc2VydmljZVVwZGF0ZVVzZXJQZXJtaXNzaW9uUmVzcG9uc2UnLCBnbG9iYWwuc2VydmljZVVwZGF0ZVVzZXJQZXJtaXNzaW9uUmVzcG9uc2UpXG4gICAgdC5lcXVhbChnbG9iYWwuc2VydmljZVVwZGF0ZVVzZXJQZXJtaXNzaW9uUmVzcG9uc2UuaXRlbXNJZHNbMF0sICd0ZXN0UGVybWlzc2lvbicsICdzZXJ2aWNlVXBkYXRlIFVzZXJQZXJtaXNzaW9uIFJlc3BvbnNlJylcblxuICAgIC8vIENBTEwgUkVBRCBVU0VSIFBFUk1JU1NJT05cbiAgICB2YXIgc2VydmljZVJlYWRVc2VyUGVybWlzc2lvblJlcXVlc3QgPSB7aXRlbXNJZHM6IFsndGVzdFBlcm1pc3Npb24nXX1cbiAgICBnbG9iYWwuc2VydmljZVJlYWRVc2VyUGVybWlzc2lvblJlc3BvbnNlID0gYXdhaXQgU0VSVklDRS5jYWxsUm91dGUoe3JvdXRlOiAncmVhZFVzZXJQZXJtaXNzaW9uJywgcmVxdWVzdDogc2VydmljZVJlYWRVc2VyUGVybWlzc2lvblJlcXVlc3R9KVxuICAgIERJLmRlYnVnKCdnbG9iYWwuc2VydmljZVJlYWRVc2VyUGVybWlzc2lvblJlc3BvbnNlJywgZ2xvYmFsLnNlcnZpY2VSZWFkVXNlclBlcm1pc3Npb25SZXNwb25zZSlcbiAgICB0LmVxdWFsKGdsb2JhbC5zZXJ2aWNlUmVhZFVzZXJQZXJtaXNzaW9uUmVzcG9uc2UuaXRlbXNbMF0uZW50aXR5LCAnKicsICdzZXJ2aWNlUmVhZCBVc2VyUGVybWlzc2lvbiBSZXNwb25zZSBTQU1FIEFTIFNFTkRFRCcpXG5cbiAgICAvLyBDQUxMIERFTEVURSBVU0VSIFBFUk1JU1NJT05cbiAgICB2YXIgc2VydmljZURlbGV0ZVVzZXJQZXJtaXNzaW9uUmVxdWVzdCA9IHtpdGVtc0lkczogWyd0ZXN0UGVybWlzc2lvbiddfVxuICAgIGdsb2JhbC5zZXJ2aWNlRGVsZXRlVXNlclBlcm1pc3Npb25SZXNwb25zZSA9IGF3YWl0IFNFUlZJQ0UuY2FsbFJvdXRlKHtyb3V0ZTogJ2RlbGV0ZVVzZXJQZXJtaXNzaW9uJywgcmVxdWVzdDogc2VydmljZURlbGV0ZVVzZXJQZXJtaXNzaW9uUmVxdWVzdH0pXG4gICAgREkuZGVidWcoJ2dsb2JhbC5zZXJ2aWNlRGVsZXRlVXNlclBlcm1pc3Npb25SZXNwb25zZScsIGdsb2JhbC5zZXJ2aWNlRGVsZXRlVXNlclBlcm1pc3Npb25SZXNwb25zZSlcbiAgICB0LmVxdWFsKGdsb2JhbC5zZXJ2aWNlVXBkYXRlVXNlclBlcm1pc3Npb25SZXNwb25zZS5pdGVtc0lkc1swXSwgJ3Rlc3RQZXJtaXNzaW9uJywgJ3NlcnZpY2VEZWxldGUgVXNlclBlcm1pc3Npb24gUmVzcG9uc2UnKVxuXG4gICAgdmFyIHNlcnZpY2VVcGRhdGVOb3RBbGxvd2VkVXNlclBlcm1pc3Npb25SZXF1ZXN0ID0ge2l0ZW1zSWRzOiBbJ3Rlc3RQZXJtaXNzaW9uJ10sIGl0ZW1zOiBbe19kZWxldGVkOiBmYWxzZX1dfVxuICAgIGdsb2JhbC5zZXJ2aWNlRGVsZXRlVXNlclBlcm1pc3Npb25SZXNwb25zZSA9IGF3YWl0IFNFUlZJQ0UuY2FsbFJvdXRlKHtyb3V0ZTogJ3VwZGF0ZVVzZXJQZXJtaXNzaW9uJywgcmVxdWVzdDogc2VydmljZVVwZGF0ZU5vdEFsbG93ZWRVc2VyUGVybWlzc2lvblJlcXVlc3QgfSlcblxuICAgIFNFUlZJQ0Uuc3RvcCgpXG4gICAgdC5lbmQoKVxuICAgIC8vIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gICAvL0RJLmVycm9yKGVycm9yKVxuICAgIC8vICAgdC5mYWlsKCdGQUlMIGNyZWF0ZUVudGl0eVRlc3QnKVxuICAgIC8vICAgdC5lbmQoJ0ZBSUwgY3JlYXRlRW50aXR5VGVzdCcpXG4gICAgLy8gfVxuICB9KVxufSlcbiJdfQ==