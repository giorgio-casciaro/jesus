'use strict';

var R = require('ramda');
function debug() {
  console.log('\x1B[1;33m' + "<Auth>" + '\x1B[0m');
  console.log.apply(console, arguments);
}
module.exports = function (storage) {
  return {
    checkPermission: function checkPermission(permissions, permission, entityType, entityId) {
      var authUserRolePermissions, authUserPermissions;
      return regeneratorRuntime.async(function checkPermission$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(permissionsStorage.find({ "permission": ACTION, "ownerType": "UserRole", "ownerId": authUserInfo.userRoleId }));

            case 2:
              authUserRolePermissions = _context.sent;
              _context.next = 5;
              return regeneratorRuntime.awrap(permissionsStorage.find({ "permission": ACTION, "ownerType": "User", "ownerId": authUserInfo.userId }));

            case 5:
              authUserPermissions = _context.sent;

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    },
    can: function can(permissions, permission, entityType, entityId) {
      return new Promise(function userCan(resolve, reject) {
        debug("userCan", permission, entityType, entityId);
        var error = 'No permissions to ' + permission + ' ' + entityType + ' ' + (entityId || "");
        if (!permissions || !permission) reject(new Error(error));
        var filter = R.filter(function (el) {
          return el.permission === permission;
        });
        var sort = R.compose(R.reverse, R.sort(function (a, b) {
          if (a.entityId && !b.entityId) return 1;
          if (a.entityType && !b.entityType) return 1;
          if (a.ownerType === "User" && b.ownerType !== "User") return 1;
          return -1;
        }));
        var finalPermissions = R.compose(sort, filter)(permissions);
        debug(R.map(JSON.stringify, finalPermissions));
        if (!finalPermissions[0] || !finalPermissions[0].permit) reject(new Error(error));
        resolve(finalPermissions[0]);
      });
    }
  };
};