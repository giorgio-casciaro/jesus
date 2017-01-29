'use strict';

var ajv = require('ajv')({ allErrors: true });
var PACKAGE = 'validate.jsonSchema';
module.exports = function getJsonSchemaValidateFunction(CONFIG, DI) {
  var getValuePromise, checkRequired, validationSchema, validate;
  return regeneratorRuntime.async(function getJsonSchemaValidateFunction$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          getValuePromise = require('./jesus').getValuePromise;
          checkRequired = require('./jesus').checkRequired;

          CONFIG = checkRequired(CONFIG, ['validationSchema'], PACKAGE);
          DI = checkRequired(DI, ['throwError'], PACKAGE);

          _context2.next = 7;
          return regeneratorRuntime.awrap(getValuePromise(CONFIG.validationSchema));

        case 7:
          validationSchema = _context2.sent;
          validate = ajv.compile(validationSchema);
          return _context2.abrupt('return', function jsonSchemaValidate(_ref) {
            var items = _ref.items;

            var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

            return regeneratorRuntime.async(function jsonSchemaValidate$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;

                    if (items) {
                      _context.next = 3;
                      break;
                    }

                    throw new Error('Json Schema items are missing');

                  case 3:
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 6;
                    _iterator = items[Symbol.iterator]();

                  case 8:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context.next = 15;
                      break;
                    }

                    item = _step.value;

                    if (validate(item)) {
                      _context.next = 12;
                      break;
                    }

                    throw new Error('JsonSchemaValidate Invalid: ' + ajv.errorsText(validate.errors));

                  case 12:
                    _iteratorNormalCompletion = true;
                    _context.next = 8;
                    break;

                  case 15:
                    _context.next = 21;
                    break;

                  case 17:
                    _context.prev = 17;
                    _context.t0 = _context['catch'](6);
                    _didIteratorError = true;
                    _iteratorError = _context.t0;

                  case 21:
                    _context.prev = 21;
                    _context.prev = 22;

                    if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                    }

                  case 24:
                    _context.prev = 24;

                    if (!_didIteratorError) {
                      _context.next = 27;
                      break;
                    }

                    throw _iteratorError;

                  case 27:
                    return _context.finish(24);

                  case 28:
                    return _context.finish(21);

                  case 29:
                    _context.next = 34;
                    break;

                  case 31:
                    _context.prev = 31;
                    _context.t1 = _context['catch'](0);

                    DI.throwError("jsonSchemaValidate({items}) Error", _context.t1, { items: items });

                  case 34:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this, [[0, 31], [6, 17, 21, 29], [22,, 24, 28]]);
          });

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2['catch'](0);

          DI.throwError("getJsonSchemaValidateFunction(CONFIG, DI) Error", _context2.t0);

        case 15:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this, [[0, 12]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZhbGlkYXRlLmpzb25TY2hlbWEuZXM2Il0sIm5hbWVzIjpbImFqdiIsInJlcXVpcmUiLCJhbGxFcnJvcnMiLCJQQUNLQUdFIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEpzb25TY2hlbWFWYWxpZGF0ZUZ1bmN0aW9uIiwiQ09ORklHIiwiREkiLCJnZXRWYWx1ZVByb21pc2UiLCJjaGVja1JlcXVpcmVkIiwidmFsaWRhdGlvblNjaGVtYSIsInZhbGlkYXRlIiwiY29tcGlsZSIsImpzb25TY2hlbWFWYWxpZGF0ZSIsIml0ZW1zIiwiRXJyb3IiLCJpdGVtIiwiZXJyb3JzVGV4dCIsImVycm9ycyIsInRocm93RXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsTUFBTUMsUUFBUSxLQUFSLEVBQWUsRUFBQ0MsV0FBVyxJQUFaLEVBQWYsQ0FBVjtBQUNBLElBQU1DLFVBQVUscUJBQWhCO0FBQ0FDLE9BQU9DLE9BQVAsR0FBaUIsU0FBZUMsNkJBQWYsQ0FBOENDLE1BQTlDLEVBQXNEQyxFQUF0RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVQQyx5QkFGTyxHQUVXUixRQUFRLFNBQVIsRUFBbUJRLGVBRjlCO0FBR1BDLHVCQUhPLEdBR1NULFFBQVEsU0FBUixFQUFtQlMsYUFINUI7O0FBSWJILG1CQUFTRyxjQUFjSCxNQUFkLEVBQXNCLENBQUMsa0JBQUQsQ0FBdEIsRUFBNENKLE9BQTVDLENBQVQ7QUFDQUssZUFBS0UsY0FBY0YsRUFBZCxFQUFrQixDQUFDLFlBQUQsQ0FBbEIsRUFBa0NMLE9BQWxDLENBQUw7O0FBTGE7QUFBQSwwQ0FPZ0JNLGdCQUFnQkYsT0FBT0ksZ0JBQXZCLENBUGhCOztBQUFBO0FBT1RBLDBCQVBTO0FBUVRDLGtCQVJTLEdBUUVaLElBQUlhLE9BQUosQ0FBWUYsZ0JBQVosQ0FSRjtBQUFBLDRDQVVOLFNBQWVHLGtCQUFmO0FBQUEsZ0JBQW9DQyxLQUFwQyxRQUFvQ0EsS0FBcEM7O0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQSx3QkFFRUEsS0FGRjtBQUFBO0FBQUE7QUFBQTs7QUFBQSwwQkFFZSxJQUFJQyxLQUFKLGlDQUZmOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxnQ0FHY0QsS0FIZDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUdNRSx3QkFITjs7QUFBQSx3QkFJSUwsU0FBU0ssSUFBVCxDQUpKO0FBQUE7QUFBQTtBQUFBOztBQUFBLDBCQUkwQixJQUFJRCxLQUFKLENBQVUsaUNBQWlDaEIsSUFBSWtCLFVBQUosQ0FBZU4sU0FBU08sTUFBeEIsQ0FBM0MsQ0FKMUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQU9IWCx1QkFBR1ksVUFBSCxDQUFjLG1DQUFkLGVBQXdELEVBQUNMLFlBQUQsRUFBeEQ7O0FBUEc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FWTTs7QUFBQTtBQUFBO0FBQUE7O0FBcUJiUCxhQUFHWSxVQUFILENBQWMsaURBQWQ7O0FBckJhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6InZhbGlkYXRlLmpzb25TY2hlbWEuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFqdiA9IHJlcXVpcmUoJ2FqdicpKHthbGxFcnJvcnM6IHRydWV9KVxuY29uc3QgUEFDS0FHRSA9ICd2YWxpZGF0ZS5qc29uU2NoZW1hJ1xubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBnZXRKc29uU2NoZW1hVmFsaWRhdGVGdW5jdGlvbiAoQ09ORklHLCBESSkge1xuICB0cnkge1xuICAgIGNvbnN0IGdldFZhbHVlUHJvbWlzZSA9IHJlcXVpcmUoJy4vamVzdXMnKS5nZXRWYWx1ZVByb21pc2VcbiAgICBjb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbiAgICBDT05GSUcgPSBjaGVja1JlcXVpcmVkKENPTkZJRywgWyd2YWxpZGF0aW9uU2NoZW1hJ10sIFBBQ0tBR0UpXG4gICAgREkgPSBjaGVja1JlcXVpcmVkKERJLCBbJ3Rocm93RXJyb3InXSwgUEFDS0FHRSlcblxuICAgIHZhciB2YWxpZGF0aW9uU2NoZW1hID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy52YWxpZGF0aW9uU2NoZW1hKVxuICAgIHZhciB2YWxpZGF0ZSA9IGFqdi5jb21waWxlKHZhbGlkYXRpb25TY2hlbWEpXG5cbiAgICByZXR1cm4gYXN5bmMgZnVuY3Rpb24ganNvblNjaGVtYVZhbGlkYXRlICh7aXRlbXN9KSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIWl0ZW1zKSB0aHJvdyBuZXcgRXJyb3IoYEpzb24gU2NoZW1hIGl0ZW1zIGFyZSBtaXNzaW5nYClcbiAgICAgICAgZm9yICh2YXIgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICAgIGlmICghdmFsaWRhdGUoaXRlbSkpIHRocm93IG5ldyBFcnJvcignSnNvblNjaGVtYVZhbGlkYXRlIEludmFsaWQ6ICcgKyBhanYuZXJyb3JzVGV4dCh2YWxpZGF0ZS5lcnJvcnMpKVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBESS50aHJvd0Vycm9yKFwianNvblNjaGVtYVZhbGlkYXRlKHtpdGVtc30pIEVycm9yXCIsZXJyb3Ise2l0ZW1zfSlcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcihcImdldEpzb25TY2hlbWFWYWxpZGF0ZUZ1bmN0aW9uKENPTkZJRywgREkpIEVycm9yXCIsZXJyb3IpXG4gIH1cbn1cbiJdfQ==