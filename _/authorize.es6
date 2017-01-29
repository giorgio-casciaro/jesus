var R = require('ramda');
function debug() {
  console.log('\u001b[1;33m' +
    "<Auth>" +
    '\u001b[0m');
  console.log.apply(console, arguments);
}
module.exports = (storage) => {
  return {
    checkPermission: async function(permissions, permission, entityType, entityId) {
      var authUserRolePermissions = await permissionsStorage.find({"permission": ACTION, "ownerType": "UserRole", "ownerId": authUserInfo.userRoleId});
      var authUserPermissions = await permissionsStorage.find({"permission": ACTION, "ownerType": "User", "ownerId": authUserInfo.userId});
    },
    can: function(permissions, permission, entityType, entityId) {
      return new Promise(function userCan(resolve, reject) {
        debug("userCan", permission, entityType, entityId)
        var error = `No permissions to ${permission} ${entityType} ${entityId || ""}`;
        if (!permissions || !permission)
          reject(new Error(error));
        var filter = R.filter((el) => el.permission === permission);
        var sort = R.compose(R.reverse, R.sort((a, b) => {
          if (a.entityId && !b.entityId)
            return 1;
          if (a.entityType && !b.entityType)
            return 1;
          if (a.ownerType === "User" && b.ownerType !== "User")
            return 1;
          return -1;

        }));
        var finalPermissions = R.compose(sort, filter)(permissions);
        debug(R.map(JSON.stringify, finalPermissions))
        if (!finalPermissions[0] || !finalPermissions[0].permit)
          reject(new Error(error));
        resolve(finalPermissions[0]);

      });
    }
  }
};
