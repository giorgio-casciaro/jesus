'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var PACKAGE = 'validate';
module.exports = function getValidateFunction(CONFIG, DI) {
  try {
    var _ret = function () {
      var getValuePromise = require('./jesus').getValuePromise;
      var checkRequired = require('./jesus').checkRequired;
      CONFIG = checkRequired(CONFIG, ['validationSchema', 'validationType'], PACKAGE);
      DI = checkRequired(DI, ['throwError'], PACKAGE);

      return {
        v: function validate(args) {
          var validationType, validate, results;
          return regeneratorRuntime.async(function validate$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return regeneratorRuntime.awrap(getValuePromise(CONFIG.validationType));

                case 3:
                  validationType = _context.sent;
                  _context.next = 6;
                  return regeneratorRuntime.awrap(require('./validate.' + validationType)(CONFIG, DI));

                case 6:
                  validate = _context.sent;
                  _context.next = 9;
                  return regeneratorRuntime.awrap(validate(args));

                case 9:
                  results = _context.sent;
                  return _context.abrupt('return', results);

                case 13:
                  _context.prev = 13;
                  _context.t0 = _context['catch'](0);

                  DI.throwError(PACKAGE + " validate(args) Error", _context.t0, args);

                case 16:
                case 'end':
                  return _context.stop();
              }
            }
          }, null, this, [[0, 13]]);
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    DI.throwError(PACKAGE + " Error", error);
  }
  // return (args) => new Promise(async (resolve, reject) => {
  //   try {
  //     var validationType = await getValuePromise(CONFIG.validationType)
  //     var validate = await require('./validate.' + validationType)(CONFIG)
  //     console.log("validate",validate)// var results = await validate(args)
  //     resolve(true)
  //   } catch (error) {
  //   console.log("error captured",error)
  //     reject(error)
  //   }
  // })
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZhbGlkYXRlLmVzNiJdLCJuYW1lcyI6WyJQQUNLQUdFIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFZhbGlkYXRlRnVuY3Rpb24iLCJDT05GSUciLCJESSIsImdldFZhbHVlUHJvbWlzZSIsInJlcXVpcmUiLCJjaGVja1JlcXVpcmVkIiwidmFsaWRhdGUiLCJhcmdzIiwidmFsaWRhdGlvblR5cGUiLCJyZXN1bHRzIiwidGhyb3dFcnJvciIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsVUFBVSxVQUFoQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQVNDLG1CQUFULENBQThCQyxNQUE5QixFQUFzQ0MsRUFBdEMsRUFBMEM7QUFDekQsTUFBSTtBQUFBO0FBQ0YsVUFBTUMsa0JBQWtCQyxRQUFRLFNBQVIsRUFBbUJELGVBQTNDO0FBQ0EsVUFBTUUsZ0JBQWdCRCxRQUFRLFNBQVIsRUFBbUJDLGFBQXpDO0FBQ0FKLGVBQVNJLGNBQWNKLE1BQWQsRUFBc0IsQ0FBQyxrQkFBRCxFQUFxQixnQkFBckIsQ0FBdEIsRUFBOERKLE9BQTlELENBQVQ7QUFDQUssV0FBS0csY0FBY0gsRUFBZCxFQUFrQixDQUFDLFlBQUQsQ0FBbEIsRUFBa0NMLE9BQWxDLENBQUw7O0FBRUE7QUFBQSxXQUFPLFNBQWVTLFFBQWYsQ0FBeUJDLElBQXpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxrREFFd0JKLGdCQUFnQkYsT0FBT08sY0FBdkIsQ0FGeEI7O0FBQUE7QUFFQ0EsZ0NBRkQ7QUFBQTtBQUFBLGtEQUdrQkosUUFBUSxnQkFBZ0JJLGNBQXhCLEVBQXdDUCxNQUF4QyxFQUFnREMsRUFBaEQsQ0FIbEI7O0FBQUE7QUFHQ0ksMEJBSEQ7QUFBQTtBQUFBLGtEQUlpQkEsU0FBU0MsSUFBVCxDQUpqQjs7QUFBQTtBQUlDRSx5QkFKRDtBQUFBLG1EQUtJQSxPQUxKOztBQUFBO0FBQUE7QUFBQTs7QUFPSFAscUJBQUdRLFVBQUgsQ0FBY2IsVUFBUSx1QkFBdEIsZUFBb0RVLElBQXBEOztBQVBHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQVA7QUFORTs7QUFBQTtBQWdCSCxHQWhCRCxDQWdCRSxPQUFPSSxLQUFQLEVBQWM7QUFDZFQsT0FBR1EsVUFBSCxDQUFjYixVQUFRLFFBQXRCLEVBQWdDYyxLQUFoQztBQUNEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNELENBL0JEIiwiZmlsZSI6InZhbGlkYXRlLmVzNiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFBBQ0tBR0UgPSAndmFsaWRhdGUnXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFZhbGlkYXRlRnVuY3Rpb24gKENPTkZJRywgREkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG4gICAgY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG4gICAgQ09ORklHID0gY2hlY2tSZXF1aXJlZChDT05GSUcsIFsndmFsaWRhdGlvblNjaGVtYScsICd2YWxpZGF0aW9uVHlwZSddLCBQQUNLQUdFKVxuICAgIERJID0gY2hlY2tSZXF1aXJlZChESSwgWyd0aHJvd0Vycm9yJ10sIFBBQ0tBR0UpXG5cbiAgICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGUgKGFyZ3MpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciB2YWxpZGF0aW9uVHlwZSA9IGF3YWl0IGdldFZhbHVlUHJvbWlzZShDT05GSUcudmFsaWRhdGlvblR5cGUpXG4gICAgICAgIHZhciB2YWxpZGF0ZSA9IGF3YWl0IHJlcXVpcmUoJy4vdmFsaWRhdGUuJyArIHZhbGlkYXRpb25UeXBlKShDT05GSUcsIERJKVxuICAgICAgICB2YXIgcmVzdWx0cyA9IGF3YWl0IHZhbGlkYXRlKGFyZ3MpXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBESS50aHJvd0Vycm9yKFBBQ0tBR0UrXCIgdmFsaWRhdGUoYXJncykgRXJyb3JcIixlcnJvcixhcmdzKVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBESS50aHJvd0Vycm9yKFBBQ0tBR0UrXCIgRXJyb3JcIiwgZXJyb3IpXG4gIH1cbiAgLy8gcmV0dXJuIChhcmdzKSA9PiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gIC8vICAgdHJ5IHtcbiAgLy8gICAgIHZhciB2YWxpZGF0aW9uVHlwZSA9IGF3YWl0IGdldFZhbHVlUHJvbWlzZShDT05GSUcudmFsaWRhdGlvblR5cGUpXG4gIC8vICAgICB2YXIgdmFsaWRhdGUgPSBhd2FpdCByZXF1aXJlKCcuL3ZhbGlkYXRlLicgKyB2YWxpZGF0aW9uVHlwZSkoQ09ORklHKVxuICAvLyAgICAgY29uc29sZS5sb2coXCJ2YWxpZGF0ZVwiLHZhbGlkYXRlKS8vIHZhciByZXN1bHRzID0gYXdhaXQgdmFsaWRhdGUoYXJncylcbiAgLy8gICAgIHJlc29sdmUodHJ1ZSlcbiAgLy8gICB9IGNhdGNoIChlcnJvcikge1xuICAvLyAgIGNvbnNvbGUubG9nKFwiZXJyb3IgY2FwdHVyZWRcIixlcnJvcilcbiAgLy8gICAgIHJlamVjdChlcnJvcilcbiAgLy8gICB9XG4gIC8vIH0pXG59XG4iXX0=