if (!global._babelPolyfill) {
  require('babel-polyfill')
}
var getMicroservice = require('./microservice')
var t = require('tap')
t.test('*** JESUS SERVICE ENTITY ***', {
  autoend: true
}, async function mainTest (t) {
  var SERVICE, CONFIG, DI
  ({ SERVICE, CONFIG, DI } = await getMicroservice())
  t.plan(1)
  await t.test('-> ENTITY CREATE', async function (t) {
    // try {

      // CALL CREATE USER
    var serviceCreateUserRequest = {items: [{username: 'test', email: 'test@test.com'}, {username: 'test2', email: 'test@test.com'}]}
    global.serviceCreateResponse = await SERVICE.callRoute({route: 'createUser', request: serviceCreateUserRequest})
    DI.debug('global.serviceCreateResponse', global.serviceCreateResponse)
    t.type(global.serviceCreateResponse, 'object', 'Response is object')
    t.type(global.serviceCreateResponse.itemsIds, 'Array', 'itemsIds is array')
    t.equal(global.serviceCreateResponse.itemsIds.length, 2, 'itemsIds length is 2')

      // CALL READ USER
    var serviceReadUserRequest = {itemsIds: [global.serviceCreateResponse.itemsIds[0]]}
    global.serviceReadResponse = await SERVICE.callRoute({route: 'readUser', request: serviceReadUserRequest})
    DI.debug('global.serviceReadResponse', global.serviceReadResponse)
    t.type(global.serviceReadResponse, 'object', 'serviceReadResponse is object')
    t.type(global.serviceReadResponse.items, 'Array', 'items is array')
    t.equal(global.serviceReadResponse.items.length, 1, 'items length is 1')
    t.equal(global.serviceReadResponse.items[0].username, 'test', 'name item 0 same as sended')

      // CALL UPDATE USER
    var serviceUpdateUserRequest = {itemsIds: [global.serviceCreateResponse.itemsIds[0]], items: [{username: 'testUpdated'}]}
    global.serviceUpdateResponse = await SERVICE.callRoute({route: 'updateUser', request: serviceUpdateUserRequest})
    DI.debug('global.serviceUpdateResponse', global.serviceUpdateResponse)
    t.type(global.serviceUpdateResponse, 'object', 'serviceUpdateResponse is object')
    t.type(global.serviceUpdateResponse.itemsIds, 'Array', 'items is array')
    t.equal(global.serviceUpdateResponse.itemsIds.length, 1, 'items length is 1')

      // CALL READ USER
    var serviceRead2UserRequest = {itemsIds: [global.serviceCreateResponse.itemsIds[0]]}
    global.serviceRead2Response = await SERVICE.callRoute({route: 'readUser', request: serviceRead2UserRequest})
    DI.debug('global.serviceRead2Response', global.serviceRead2Response)
    t.type(global.serviceRead2Response, 'object', 'serviceRead2Response is object')
    t.type(global.serviceRead2Response.items, 'Array', 'items is array')
    t.equal(global.serviceRead2Response.items.length, 1, 'items length is 1')
    t.equal(global.serviceRead2Response.items[0].username, 'testUpdated', 'name item 0 same as sended')

      // CALL DELETE USER
    var serviceDeleteUserRequest = {itemsIds: [global.serviceCreateResponse.itemsIds[0]]}
    global.serviceDeleteResponse = await SERVICE.callRoute({route: 'deleteUser', request: serviceDeleteUserRequest})
    DI.debug('global.serviceRead2Response', global.serviceRead2Response)
    t.type(global.serviceDeleteResponse, 'object', 'serviceDeleteResponse is object')
    t.type(global.serviceDeleteResponse.itemsIds, 'Array', 'items is array')
    t.equal(global.serviceDeleteResponse.itemsIds.length, 1, 'items length is 1')

      // CALL READ DELETED USER
    var serviceRead3UserRequest = {itemsIds: [global.serviceCreateResponse.itemsIds[0]]}
    global.serviceRead3Response = await SERVICE.callRoute({route: 'readUser', request: serviceRead3UserRequest})
    DI.debug('global.serviceRead3Response', global.serviceRead3Response)
    t.type(global.serviceRead3Response, 'object', 'serviceRead3Response is object')
    t.type(global.serviceRead3Response.items, 'Array', 'items is array')
    t.equal(global.serviceRead3Response.items.length, 1, 'items length is 1')
    t.equal(global.serviceRead3Response.items[0]._deleted, true, '_deleted item 0 set to true')

      // CALL UPDATE USER WITH ERRORS
    var serviceUpdateUserErrorRequest = {}
    global.serviceUpdateErrorResponse = await SERVICE.callRoute({route: 'updateUser', request: serviceUpdateUserErrorRequest})
    DI.debug('global.serviceUpdateResponse', global.serviceUpdateErrorResponse)
    t.equal(global.serviceUpdateErrorResponse._error, true, 'items length is 1')

    // CALL UPDATE USER PERMISSION
    var serviceUpdateUserPermissionRequest = {itemsIds: ['testPermission'], items: [{entity: '*', action: '*', type: 'rbac', permit: true, force: true, args: {roleId: 'admin'}}]}
    global.serviceUpdateUserPermissionResponse = await SERVICE.callRoute({route: 'updateUserPermission', request: serviceUpdateUserPermissionRequest})
    DI.debug('global.serviceUpdateUserPermissionResponse', global.serviceUpdateUserPermissionResponse)
    t.equal(global.serviceUpdateUserPermissionResponse.itemsIds[0], 'testPermission', 'serviceUpdate UserPermission Response')

    // CALL READ USER PERMISSION
    var serviceReadUserPermissionRequest = {itemsIds: ['testPermission']}
    global.serviceReadUserPermissionResponse = await SERVICE.callRoute({route: 'readUserPermission', request: serviceReadUserPermissionRequest})
    DI.debug('global.serviceReadUserPermissionResponse', global.serviceReadUserPermissionResponse)
    t.equal(global.serviceReadUserPermissionResponse.items[0].entity, '*', 'serviceRead UserPermission Response SAME AS SENDED')

    // CALL DELETE USER PERMISSION
    var serviceDeleteUserPermissionRequest = {itemsIds: ['testPermission']}
    global.serviceDeleteUserPermissionResponse = await SERVICE.callRoute({route: 'deleteUserPermission', request: serviceDeleteUserPermissionRequest})
    DI.debug('global.serviceDeleteUserPermissionResponse', global.serviceDeleteUserPermissionResponse)
    t.equal(global.serviceUpdateUserPermissionResponse.itemsIds[0], 'testPermission', 'serviceDelete UserPermission Response')

    var serviceUpdateNotAllowedUserPermissionRequest = {itemsIds: ['testPermission'], items: [{_deleted: false}]}
    global.serviceDeleteUserPermissionResponse = await SERVICE.callRoute({route: 'updateUserPermission', request: serviceUpdateNotAllowedUserPermissionRequest })

    SERVICE.stop()
    t.end()
    // } catch (error) {
    //   //DI.error(error)
    //   t.fail('FAIL createEntityTest')
    //   t.end('FAIL createEntityTest')
    // }
  })
})
