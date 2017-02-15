'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ajv = require('ajv')({ allErrors: true });
var PACKAGE = 'validate.jsonSchema';
module.exports = function getJsonSchemaValidateFunction(CONFIG, DI) {
  var _ret;

  return regeneratorRuntime.async(function getJsonSchemaValidateFunction$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          _ret = function () {
            var getValuePromise = require('./jesus').getValuePromise;
            var checkRequired = require('./jesus').checkRequired;
            CONFIG = checkRequired(CONFIG, ['validationSchema'], PACKAGE);
            DI = checkRequired(DI, ['throwError'], PACKAGE);

            return {
              v: function jsonSchemaValidate(_ref) {
                var items = _ref.items,
                    validation = _ref.validation;

                var validationSchema, validate, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

                return regeneratorRuntime.async(function jsonSchemaValidate$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return regeneratorRuntime.awrap(getValuePromise(CONFIG.validationSchema));

                      case 2:
                        validationSchema = _context.sent;
                        validate = ajv.compile(validationSchema);
                        _context.prev = 4;

                        if (items) {
                          _context.next = 7;
                          break;
                        }

                        throw new Error('Json Schema items are missing');

                      case 7:
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 10;
                        _iterator = items[Symbol.iterator]();

                      case 12:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                          _context.next = 19;
                          break;
                        }

                        item = _step.value;

                        if (validate(item)) {
                          _context.next = 16;
                          break;
                        }

                        throw new Error('JsonSchemaValidate Invalid: ' + ajv.errorsText(validate.errors));

                      case 16:
                        _iteratorNormalCompletion = true;
                        _context.next = 12;
                        break;

                      case 19:
                        _context.next = 25;
                        break;

                      case 21:
                        _context.prev = 21;
                        _context.t0 = _context['catch'](10);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                      case 25:
                        _context.prev = 25;
                        _context.prev = 26;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                        }

                      case 28:
                        _context.prev = 28;

                        if (!_didIteratorError) {
                          _context.next = 31;
                          break;
                        }

                        throw _iteratorError;

                      case 31:
                        return _context.finish(28);

                      case 32:
                        return _context.finish(25);

                      case 33:
                        _context.next = 38;
                        break;

                      case 35:
                        _context.prev = 35;
                        _context.t1 = _context['catch'](4);

                        DI.throwError("jsonSchemaValidate({items}) Error", _context.t1, { items: items });

                      case 38:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, null, this, [[4, 35], [10, 21, 25, 33], [26,, 28, 32]]);
              }
            };
          }();

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt('return', _ret.v);

        case 4:
          _context2.next = 9;
          break;

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2['catch'](0);

          DI.throwError("getJsonSchemaValidateFunction(CONFIG, DI) Error", _context2.t0);

        case 9:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this, [[0, 6]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZhbGlkYXRlLmpzb25TY2hlbWEuZXM2Il0sIm5hbWVzIjpbImFqdiIsInJlcXVpcmUiLCJhbGxFcnJvcnMiLCJQQUNLQUdFIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEpzb25TY2hlbWFWYWxpZGF0ZUZ1bmN0aW9uIiwiQ09ORklHIiwiREkiLCJnZXRWYWx1ZVByb21pc2UiLCJjaGVja1JlcXVpcmVkIiwianNvblNjaGVtYVZhbGlkYXRlIiwiaXRlbXMiLCJ2YWxpZGF0aW9uIiwidmFsaWRhdGlvblNjaGVtYSIsInZhbGlkYXRlIiwiY29tcGlsZSIsIkVycm9yIiwiaXRlbSIsImVycm9yc1RleHQiLCJlcnJvcnMiLCJ0aHJvd0Vycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsTUFBTUMsUUFBUSxLQUFSLEVBQWUsRUFBQ0MsV0FBVyxJQUFaLEVBQWYsQ0FBVjtBQUNBLElBQU1DLFVBQVUscUJBQWhCO0FBQ0FDLE9BQU9DLE9BQVAsR0FBaUIsU0FBZUMsNkJBQWYsQ0FBOENDLE1BQTlDLEVBQXNEQyxFQUF0RDtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFFYixnQkFBTUMsa0JBQWtCUixRQUFRLFNBQVIsRUFBbUJRLGVBQTNDO0FBQ0EsZ0JBQU1DLGdCQUFnQlQsUUFBUSxTQUFSLEVBQW1CUyxhQUF6QztBQUNBSCxxQkFBU0csY0FBY0gsTUFBZCxFQUFzQixDQUFDLGtCQUFELENBQXRCLEVBQTRDSixPQUE1QyxDQUFUO0FBQ0FLLGlCQUFLRSxjQUFjRixFQUFkLEVBQWtCLENBQUMsWUFBRCxDQUFsQixFQUFrQ0wsT0FBbEMsQ0FBTDs7QUFJQTtBQUFBLGlCQUFPLFNBQWVRLGtCQUFmO0FBQUEsb0JBQW9DQyxLQUFwQyxRQUFvQ0EsS0FBcEM7QUFBQSxvQkFBMENDLFVBQTFDLFFBQTBDQSxVQUExQzs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsd0RBQ3dCSixnQkFBZ0JGLE9BQU9PLGdCQUF2QixDQUR4Qjs7QUFBQTtBQUNEQSx3Q0FEQztBQUVEQyxnQ0FGQyxHQUVVZixJQUFJZ0IsT0FBSixDQUFZRixnQkFBWixDQUZWO0FBQUE7O0FBQUEsNEJBSUVGLEtBSkY7QUFBQTtBQUFBO0FBQUE7O0FBQUEsOEJBSWUsSUFBSUssS0FBSixpQ0FKZjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0NBS2NMLEtBTGQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFLTU0sNEJBTE47O0FBQUEsNEJBTUlILFNBQVNHLElBQVQsQ0FOSjtBQUFBO0FBQUE7QUFBQTs7QUFBQSw4QkFNMEIsSUFBSUQsS0FBSixDQUFVLGlDQUFpQ2pCLElBQUltQixVQUFKLENBQWVKLFNBQVNLLE1BQXhCLENBQTNDLENBTjFCOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFTSFosMkJBQUdhLFVBQUgsQ0FBYyxtQ0FBZCxlQUF3RCxFQUFDVCxZQUFELEVBQXhEOztBQVRHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQVA7QUFUYTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQXNCYkosYUFBR2EsVUFBSCxDQUFjLGlEQUFkOztBQXRCYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJ2YWxpZGF0ZS5qc29uU2NoZW1hLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBhanYgPSByZXF1aXJlKCdhanYnKSh7YWxsRXJyb3JzOiB0cnVlfSlcbmNvbnN0IFBBQ0tBR0UgPSAndmFsaWRhdGUuanNvblNjaGVtYSdcbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0SnNvblNjaGVtYVZhbGlkYXRlRnVuY3Rpb24gKENPTkZJRywgREkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG4gICAgY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG4gICAgQ09ORklHID0gY2hlY2tSZXF1aXJlZChDT05GSUcsIFsndmFsaWRhdGlvblNjaGVtYSddLCBQQUNLQUdFKVxuICAgIERJID0gY2hlY2tSZXF1aXJlZChESSwgWyd0aHJvd0Vycm9yJ10sIFBBQ0tBR0UpXG5cblxuXG4gICAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIGpzb25TY2hlbWFWYWxpZGF0ZSAoe2l0ZW1zLHZhbGlkYXRpb259KSB7XG4gICAgICB2YXIgdmFsaWRhdGlvblNjaGVtYSA9IGF3YWl0IGdldFZhbHVlUHJvbWlzZShDT05GSUcudmFsaWRhdGlvblNjaGVtYSlcbiAgICAgIHZhciB2YWxpZGF0ZSA9IGFqdi5jb21waWxlKHZhbGlkYXRpb25TY2hlbWEpXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIWl0ZW1zKSB0aHJvdyBuZXcgRXJyb3IoYEpzb24gU2NoZW1hIGl0ZW1zIGFyZSBtaXNzaW5nYClcbiAgICAgICAgZm9yICh2YXIgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICAgIGlmICghdmFsaWRhdGUoaXRlbSkpIHRocm93IG5ldyBFcnJvcignSnNvblNjaGVtYVZhbGlkYXRlIEludmFsaWQ6ICcgKyBhanYuZXJyb3JzVGV4dCh2YWxpZGF0ZS5lcnJvcnMpKVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBESS50aHJvd0Vycm9yKFwianNvblNjaGVtYVZhbGlkYXRlKHtpdGVtc30pIEVycm9yXCIsZXJyb3Ise2l0ZW1zfSlcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcihcImdldEpzb25TY2hlbWFWYWxpZGF0ZUZ1bmN0aW9uKENPTkZJRywgREkpIEVycm9yXCIsZXJyb3IpXG4gIH1cbn1cbiJdfQ==