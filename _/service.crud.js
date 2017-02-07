'use strict';

require('babel-polyfill');
var R = require('ramda');
var jesus = require('jesus');
var path = require('path');
var PACKAGE_NAME = 'permissions';
var CONFIG = require('./config');

// SHARED FUNCTIONS
// var optionsStorage = jesus.getStoragePackage(CONFIG.optionsStorage, CONFIG.entities.Permission.optionsStorageCollection)
var mutationsStorage = jesus.getStoragePackage(CONFIG.entities.Permission.mutationsStorage, CONFIG.entities.Permission.mutationsStorageCollection);
var mutationsPackage = require('jesus/cqrs.mutations')({
  mutationsPath: path.join(__dirname, 'mutations'),
  storage: mutationsStorage
});
var mainViewPackage = require('jesus/cqrs.views')({
  mutations: mutationsPackage,
  snapshotsMaxMutations: 10,
  snapshotsStorage: jesus.getStoragePackage(CONFIG.entities.Permission.mainViewSnapshotsStorage, CONFIG.entities.Permission.mainViewSnapshotsStorageCollection),
  storage: jesus.getStoragePackage(CONFIG.entities.Permission.mainViewStorage, CONFIG.entities.Permission.mainViewStorageCollection)
});
var validateData = require('jesus/validate.jsonSchema')(require('civilconnect/entities/Permission/entity.schema.json'));

function getDeleteFunction(DI) {
  var FUNCTION_NAME = 'delete';
  jesus.checkRequiredDependencies(DI, ['authenticate', 'authorize', 'log', 'validate', 'mutate', 'refreshViews']);
  function log(type, data) {
    DI.log({ type: type, context: [PACKAGE_NAME, FUNCTION_NAME], data: data });
  }
  return function () {
    var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new Promise(function createPromise(resolve, reject) {
      var entityIds, authorizationsData;
      return regeneratorRuntime.async(function createPromise$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              entityIds = request.ids;
              _context.next = 4;
              return regeneratorRuntime.awrap(DI.authenticate(request.token));

            case 4:
              authorizationsData = _context.sent;
              _context.next = 7;
              return regeneratorRuntime.awrap(DI.authorize('Permission', 'read', authorizationsData, { ids: entityIds }));

            case 7:
              _context.next = 9;
              return regeneratorRuntime.awrap(mutationsPackage.mutate('delete', entityIds));

            case 9:
              _context.next = 11;
              return regeneratorRuntime.awrap(mainViewPackage.refreshEntitiesViews(entityIds));

            case 11:
              log('LOG', { entityIds: entityIds });
              resolve({ ids: entityIds });
              _context.next = 19;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context['catch'](0);

              log('ERROR', _context.t0);
              reject(_context.t0);

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this, [[0, 15]]);
    });
  };
}

function getCreatePermissionFunction(DI) {
  var FUNCTION_NAME = 'create';
  jesus.checkRequiredDependencies(DI, ['authenticate', 'authorize', 'getLogFunction']);
  var log = DI.getLogFunction([PACKAGE_NAME, FUNCTION_NAME]);
  // MAIN FUNCTION
  return function create() {
    var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var resolve = arguments[1];
    var reject = arguments[2];
    var entityInstances, authorizationsData, entityIds, entitiesMutations;
    return regeneratorRuntime.async(function create$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            entityInstances = request.items;
            _context2.next = 4;
            return regeneratorRuntime.awrap(validateData(entityInstances));

          case 4:
            _context2.next = 6;
            return regeneratorRuntime.awrap(DI.authenticate(request.token));

          case 6:
            authorizationsData = _context2.sent;
            _context2.next = 9;
            return regeneratorRuntime.awrap(DI.authorize('Permission', 'write', authorizationsData, { instances: entityInstances }));

          case 9:

            // var newIds = jesus.createNewIds(entityInstances.length)
            // var entityInstancesWithIds = jesus.addObjectColumn(entityInstances, '_id', newIds)
            entityIds = R.map(R.prop('_id'), entityInstances);
            _context2.next = 12;
            return regeneratorRuntime.awrap(mutationsPackage.mutate('create', entityIds, entityInstances));

          case 12:
            entitiesMutations = _context2.sent;
            _context2.next = 15;
            return regeneratorRuntime.awrap(mainViewPackage.refreshEntitiesViews(entityIds, false, entitiesMutations));

          case 15:
            log('LOG', { entityInstances: entityInstances });
            resolve({ ids: entityIds });
            _context2.next = 23;
            break;

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2['catch'](0);

            log('ERROR', _context2.t0);
            reject(_context2.t0);

          case 23:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[0, 19]]);
  };
}
function getReadPermissionFunction(DI) {
  var FUNCTION_NAME = 'read';
  jesus.checkRequiredDependencies(DI, ['authenticate', 'authorize', 'getLogFunction']);
  var log = DI.getLogFunction([PACKAGE_NAME, FUNCTION_NAME]);
  return function create() {
    var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var resolve = arguments[1];
    var reject = arguments[2];
    var entityIds, authorizationsData, entityInstances;
    return regeneratorRuntime.async(function create$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            entityIds = request.ids;
            _context3.next = 4;
            return regeneratorRuntime.awrap(DI.authenticate(request.token));

          case 4:
            authorizationsData = _context3.sent;
            _context3.next = 7;
            return regeneratorRuntime.awrap(DI.authorize('Permission', 'read', authorizationsData, { ids: entityIds }));

          case 7:
            _context3.next = 9;
            return regeneratorRuntime.awrap(mainViewPackage.get(entityIds));

          case 9:
            entityInstances = _context3.sent;

            log('LOG', { entityInstances: entityInstances });
            resolve({ entityInstances: entityInstances });
            _context3.next = 18;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3['catch'](0);

            log('ERROR', _context3.t0);
            reject(_context3.t0);

          case 18:
          case 'end':
            return _context3.stop();
        }
      }
    }, null, this, [[0, 14]]);
  };
}

function getUpdatePermissionFunction(DI) {
  var FUNCTION_NAME = 'update';
  jesus.checkRequiredDependencies(DI, ['authenticate', 'authorize', 'getLogFunction']);
  var log = DI.getLogFunction([PACKAGE_NAME, FUNCTION_NAME]);
  // MAIN FUNCTION
  return function create() {
    var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var resolve = arguments[1];
    var reject = arguments[2];
    var entityInstances, authorizationsData, entityIds;
    return regeneratorRuntime.async(function create$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            entityInstances = request.items;
            _context4.next = 4;
            return regeneratorRuntime.awrap(validateData(entityInstances));

          case 4:
            _context4.next = 6;
            return regeneratorRuntime.awrap(DI.authenticate(request.token));

          case 6:
            authorizationsData = _context4.sent;
            _context4.next = 9;
            return regeneratorRuntime.awrap(DI.authorize('Permission', 'write', authorizationsData, { instances: entityInstances }));

          case 9:

            // var newIds = jesus.createNewIds(entityInstances.length)
            // var entityInstancesWithIds = jesus.addObjectColumn(entityInstances, '_id', newIds)
            entityIds = R.map(R.prop('_id'), entityInstances);
            _context4.next = 12;
            return regeneratorRuntime.awrap(mutationsPackage.mutate('update', entityIds, entityInstances));

          case 12:
            _context4.next = 14;
            return regeneratorRuntime.awrap(mainViewPackage.refreshEntitiesViews(entityIds));

          case 14:
            log('LOG', { entityIds: entityIds });
            resolve({ ids: entityIds });
            _context4.next = 22;
            break;

          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4['catch'](0);

            log('ERROR', _context4.t0);
            reject(_context4.t0);

          case 22:
          case 'end':
            return _context4.stop();
        }
      }
    }, null, this, [[0, 18]]);
  };
}
// FUNCTIONS
module.exports = function (DI) {
  DI = R.clone(DI);
  // DI.on('createPermission', getCreatePermissionFunction(DI))
  DI.on('deletePermission', getDeletePermissionFunction(DI), { localEvent: true });
  // api.createPermission = getCreatePermissionFunction(DI)
  // api.readPermission = getReadPermissionFunction(DI)
  // api.deletePermission = getDeletePermissionFunction(DI)
  // api.updatePermission = getUpdatePermissionFunction(DI)
  // return api
};