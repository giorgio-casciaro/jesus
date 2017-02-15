'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function getAuthorizationsPackage(CONFIG, DI) {
  try {
    var _ret = function () {
      var PACKAGE = 'auth.RoleBased';
      var getValuePromise = require('./jesus').getValuePromise;
      var checkRequired = require('./jesus').checkRequired;
      CONFIG = checkRequired(CONFIG, [], PACKAGE);
      DI = checkRequired(DI, ['throwError', 'log', 'debug'], PACKAGE);
      return {
        v: {
          authorize: function authorize(_ref) {
            var action = _ref.action,
                entityName = _ref.entityName,
                items = _ref.items,
                itemsIds = _ref.itemsIds,
                meta = _ref.meta,
                userData = _ref.userData;
            var findActionIn, storagePackage, Permissions;
            return regeneratorRuntime.async(function authorize$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;

                    if (entityName) {
                      _context.next = 3;
                      break;
                    }

                    throw new Error('authorize() entityName is required');

                  case 3:
                    if (action) {
                      _context.next = 5;
                      break;
                    }

                    throw new Error('authorize() action is required');

                  case 5:
                    if (userData.roleId) {
                      _context.next = 7;
                      break;
                    }

                    throw new Error('roleId is required');

                  case 7:

                    //calculate possible action values es write.create = *, write, write.create
                    findActionIn = ['*'];

                    action.split('.').forEach(function (value, returned) {
                      var str = returned ? returned + '.' + value : value;
                      findActionIn.push(str);
                      return str;
                    }, false);

                    storagePackage = CONFIG.storage(CONFIG, DI);
                    _context.next = 12;
                    return regeneratorRuntime.awrap(storagePackage.find({ 'action': { $in: findActionIn }, 'entity': entityName, 'roleId': userData.roleId }));

                  case 12:
                    Permissions = _context.sent;

                    if (!(!Permissions || !Permissions[0] || !Permissions[0].permit)) {
                      _context.next = 15;
                      break;
                    }

                    throw new Error('you not have permission to ' + action + ' ' + entityName);

                  case 15:
                    DI.debug({ msg: 'Permissions ' + entityName + ' authorize()', context: PACKAGE, debug: { Permissions: Permissions } });
                    _context.next = 21;
                    break;

                  case 18:
                    _context.prev = 18;
                    _context.t0 = _context['catch'](0);

                    DI.throwError('ENTITY: ' + entityName + ' you are not authorized', _context.t0, { action: action, entityName: entityName, items: items, itemsIds: itemsIds, meta: meta });

                  case 21:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this, [[0, 18]]);
          }
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    DI.throwError('getAuthorizationsPackage(CONFIG, DI)', error);
  }
};

// {

// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGgucm9sZUJhc2VkLmVzNiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0QXV0aG9yaXphdGlvbnNQYWNrYWdlIiwiQ09ORklHIiwiREkiLCJQQUNLQUdFIiwiZ2V0VmFsdWVQcm9taXNlIiwicmVxdWlyZSIsImNoZWNrUmVxdWlyZWQiLCJhdXRob3JpemUiLCJhY3Rpb24iLCJlbnRpdHlOYW1lIiwiaXRlbXMiLCJpdGVtc0lkcyIsIm1ldGEiLCJ1c2VyRGF0YSIsIkVycm9yIiwicm9sZUlkIiwiZmluZEFjdGlvbkluIiwic3BsaXQiLCJmb3JFYWNoIiwidmFsdWUiLCJyZXR1cm5lZCIsInN0ciIsInB1c2giLCJzdG9yYWdlUGFja2FnZSIsInN0b3JhZ2UiLCJmaW5kIiwiJGluIiwiUGVybWlzc2lvbnMiLCJwZXJtaXQiLCJkZWJ1ZyIsIm1zZyIsImNvbnRleHQiLCJ0aHJvd0Vycm9yIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQUEsT0FBT0MsT0FBUCxHQUFpQixTQUFTQyx3QkFBVCxDQUFtQ0MsTUFBbkMsRUFBMkNDLEVBQTNDLEVBQStDO0FBQzlELE1BQUk7QUFBQTtBQUNGLFVBQU1DLFVBQVUsZ0JBQWhCO0FBQ0EsVUFBTUMsa0JBQWtCQyxRQUFRLFNBQVIsRUFBbUJELGVBQTNDO0FBQ0EsVUFBTUUsZ0JBQWdCRCxRQUFRLFNBQVIsRUFBbUJDLGFBQXpDO0FBQ0FMLGVBQVNLLGNBQWNMLE1BQWQsRUFBc0IsRUFBdEIsRUFBMEJFLE9BQTFCLENBQVQ7QUFDQUQsV0FBS0ksY0FBY0osRUFBZCxFQUFrQixDQUFFLFlBQUYsRUFBZ0IsS0FBaEIsRUFBdUIsT0FBdkIsQ0FBbEIsRUFBbURDLE9BQW5ELENBQUw7QUFDQTtBQUFBLFdBQU87QUFDQ0ksbUJBREQ7QUFBQSxnQkFDYUMsTUFEYixRQUNhQSxNQURiO0FBQUEsZ0JBQ3FCQyxVQURyQixRQUNxQkEsVUFEckI7QUFBQSxnQkFDaUNDLEtBRGpDLFFBQ2lDQSxLQURqQztBQUFBLGdCQUN3Q0MsUUFEeEMsUUFDd0NBLFFBRHhDO0FBQUEsZ0JBQ2tEQyxJQURsRCxRQUNrREEsSUFEbEQ7QUFBQSxnQkFDd0RDLFFBRHhELFFBQ3dEQSxRQUR4RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQSx3QkFHSUosVUFISjtBQUFBO0FBQUE7QUFBQTs7QUFBQSwwQkFHc0IsSUFBSUssS0FBSixDQUFVLG9DQUFWLENBSHRCOztBQUFBO0FBQUEsd0JBSUlOLE1BSko7QUFBQTtBQUFBO0FBQUE7O0FBQUEsMEJBSWtCLElBQUlNLEtBQUosQ0FBVSxnQ0FBVixDQUpsQjs7QUFBQTtBQUFBLHdCQUtJRCxTQUFTRSxNQUxiO0FBQUE7QUFBQTtBQUFBOztBQUFBLDBCQUsyQixJQUFJRCxLQUFKLENBQVUsb0JBQVYsQ0FMM0I7O0FBQUE7O0FBT0Q7QUFDSUUsZ0NBUkgsR0FRa0IsQ0FBQyxHQUFELENBUmxCOztBQVNEUiwyQkFBT1MsS0FBUCxDQUFhLEdBQWIsRUFBa0JDLE9BQWxCLENBQTBCLFVBQUNDLEtBQUQsRUFBUUMsUUFBUixFQUFxQjtBQUM3QywwQkFBSUMsTUFBT0QsUUFBRCxHQUFhQSxXQUFXLEdBQVgsR0FBaUJELEtBQTlCLEdBQXNDQSxLQUFoRDtBQUNBSCxtQ0FBYU0sSUFBYixDQUFrQkQsR0FBbEI7QUFDQSw2QkFBT0EsR0FBUDtBQUNELHFCQUpELEVBSUcsS0FKSDs7QUFNSUUsa0NBZkgsR0Flb0J0QixPQUFPdUIsT0FBUCxDQUFldkIsTUFBZixFQUF1QkMsRUFBdkIsQ0FmcEI7QUFBQTtBQUFBLG9EQWdCdUJxQixlQUFlRSxJQUFmLENBQW9CLEVBQUMsVUFBVSxFQUFFQyxLQUFLVixZQUFQLEVBQVgsRUFBa0MsVUFBVVAsVUFBNUMsRUFBd0QsVUFBVUksU0FBU0UsTUFBM0UsRUFBcEIsQ0FoQnZCOztBQUFBO0FBZ0JHWSwrQkFoQkg7O0FBQUEsMEJBbUJHLENBQUNBLFdBQUQsSUFBZ0IsQ0FBQ0EsWUFBWSxDQUFaLENBQWpCLElBQW1DLENBQUNBLFlBQVksQ0FBWixFQUFlQyxNQW5CdEQ7QUFBQTtBQUFBO0FBQUE7O0FBQUEsMEJBbUJvRSxJQUFJZCxLQUFKLGlDQUF3Q04sTUFBeEMsU0FBa0RDLFVBQWxELENBbkJwRTs7QUFBQTtBQW9CRFAsdUJBQUcyQixLQUFILENBQVMsRUFBQ0Msc0JBQW9CckIsVUFBcEIsaUJBQUQsRUFBK0NzQixTQUFTNUIsT0FBeEQsRUFBaUUwQixPQUFPLEVBQUNGLHdCQUFELEVBQXhFLEVBQVQ7QUFwQkM7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBc0JEekIsdUJBQUc4QixVQUFILGNBQXlCdkIsVUFBekIsMkNBQXFFLEVBQUNELGNBQUQsRUFBU0Msc0JBQVQsRUFBcUJDLFlBQXJCLEVBQTRCQyxrQkFBNUIsRUFBc0NDLFVBQXRDLEVBQXJFOztBQXRCQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQVA7QUFORTs7QUFBQTtBQWdDSCxHQWhDRCxDQWdDRSxPQUFPcUIsS0FBUCxFQUFjO0FBQ2QvQixPQUFHOEIsVUFBSCxDQUFjLHNDQUFkLEVBQXNEQyxLQUF0RDtBQUNEO0FBQ0YsQ0FwQ0Q7O0FBc0NBOztBQUVBIiwiZmlsZSI6ImF1dGgucm9sZUJhc2VkLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0QXV0aG9yaXphdGlvbnNQYWNrYWdlIChDT05GSUcsIERJKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgUEFDS0FHRSA9ICdhdXRoLlJvbGVCYXNlZCdcbiAgICBjb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG4gICAgY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG4gICAgQ09ORklHID0gY2hlY2tSZXF1aXJlZChDT05GSUcsIFtdLCBQQUNLQUdFKVxuICAgIERJID0gY2hlY2tSZXF1aXJlZChESSwgWyAndGhyb3dFcnJvcicsICdsb2cnLCAnZGVidWcnXSwgUEFDS0FHRSlcbiAgICByZXR1cm4ge1xuICAgICAgYXN5bmMgYXV0aG9yaXplICh7YWN0aW9uLCBlbnRpdHlOYW1lLCBpdGVtcywgaXRlbXNJZHMsIG1ldGEsIHVzZXJEYXRhfSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICghZW50aXR5TmFtZSkgdGhyb3cgbmV3IEVycm9yKCdhdXRob3JpemUoKSBlbnRpdHlOYW1lIGlzIHJlcXVpcmVkJylcbiAgICAgICAgICBpZiAoIWFjdGlvbikgdGhyb3cgbmV3IEVycm9yKCdhdXRob3JpemUoKSBhY3Rpb24gaXMgcmVxdWlyZWQnKVxuICAgICAgICAgIGlmICghdXNlckRhdGEucm9sZUlkKSB0aHJvdyBuZXcgRXJyb3IoJ3JvbGVJZCBpcyByZXF1aXJlZCcpXG5cbiAgICAgICAgICAvL2NhbGN1bGF0ZSBwb3NzaWJsZSBhY3Rpb24gdmFsdWVzIGVzIHdyaXRlLmNyZWF0ZSA9ICosIHdyaXRlLCB3cml0ZS5jcmVhdGVcbiAgICAgICAgICB2YXIgZmluZEFjdGlvbkluID0gWycqJ11cbiAgICAgICAgICBhY3Rpb24uc3BsaXQoJy4nKS5mb3JFYWNoKCh2YWx1ZSwgcmV0dXJuZWQpID0+IHtcbiAgICAgICAgICAgIHZhciBzdHIgPSAocmV0dXJuZWQpID8gcmV0dXJuZWQgKyAnLicgKyB2YWx1ZSA6IHZhbHVlXG4gICAgICAgICAgICBmaW5kQWN0aW9uSW4ucHVzaChzdHIpXG4gICAgICAgICAgICByZXR1cm4gc3RyXG4gICAgICAgICAgfSwgZmFsc2UpXG5cbiAgICAgICAgICB2YXIgc3RvcmFnZVBhY2thZ2UgPSBDT05GSUcuc3RvcmFnZShDT05GSUcsIERJKVxuICAgICAgICAgIHZhciBQZXJtaXNzaW9ucyA9IGF3YWl0IHN0b3JhZ2VQYWNrYWdlLmZpbmQoeydhY3Rpb24nOiB7ICRpbjogZmluZEFjdGlvbkluIH0sICdlbnRpdHknOiBlbnRpdHlOYW1lLCAncm9sZUlkJzogdXNlckRhdGEucm9sZUlkIH0pXG5cbiAgICAgICAgICAvLyBUTyBGSVggLT4gIFJFTU9WRSBEVVBMSUNBVEVTIEJZIElELCBTT1JUICBCWSBFTlRJVFkgREVGSU5JVElPTiwgU09SVCBCWSBBQ1RJT04gREVGSU5JVElPTixTT1JUIEJZIFBSSU9SSVRZLFxuICAgICAgICAgIGlmICghUGVybWlzc2lvbnMgfHwgIVBlcm1pc3Npb25zWzBdIHx8ICFQZXJtaXNzaW9uc1swXS5wZXJtaXQpIHRocm93IG5ldyBFcnJvcihgeW91IG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gJHthY3Rpb259ICR7ZW50aXR5TmFtZX1gKVxuICAgICAgICAgIERJLmRlYnVnKHttc2c6IGBQZXJtaXNzaW9ucyAke2VudGl0eU5hbWV9IGF1dGhvcml6ZSgpYCwgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtQZXJtaXNzaW9uc319KVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIERJLnRocm93RXJyb3IoYEVOVElUWTogJHtlbnRpdHlOYW1lfSB5b3UgYXJlIG5vdCBhdXRob3JpemVkYCwgZXJyb3IsIHthY3Rpb24sIGVudGl0eU5hbWUsIGl0ZW1zLCBpdGVtc0lkcywgbWV0YX0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0QXV0aG9yaXphdGlvbnNQYWNrYWdlKENPTkZJRywgREkpJywgZXJyb3IpXG4gIH1cbn1cblxuLy8ge1xuXG4vLyB9XG4iXX0=