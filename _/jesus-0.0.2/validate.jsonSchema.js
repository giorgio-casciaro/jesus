'use strict';

var ajv = require('ajv')({ allErrors: true });
var fs = require('fs');
var getCompiledSchema = function getCompiledSchema(validationSchema) {
  return new Promise(function (resolve, reject) {
    fs.readFile(validationSchema, 'utf8', function (err, contents) {
      if (err) return resolve(false);
      var compiledSchema = ajv.compile(JSON.parse(contents));
      resolve(compiledSchema);
    });
  });
};

var PACKAGE = 'validate.jsonSchema';
module.exports = function jsonSchemaValidate(_ref) {
  var items = _ref.items,
      validationSchema = _ref.validationSchema,
      _ref$throwIfFileNotFo = _ref.throwIfFileNotFounded,
      throwIfFileNotFounded = _ref$throwIfFileNotFo === undefined ? true : _ref$throwIfFileNotFo;

  var compiledSchema, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

  return regeneratorRuntime.async(function jsonSchemaValidate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(getCompiledSchema(validationSchema));

        case 3:
          compiledSchema = _context.sent;

          if (compiledSchema) {
            _context.next = 8;
            break;
          }

          if (!throwIfFileNotFounded) {
            _context.next = 7;
            break;
          }

          throw new Error('REQUIRED Json Schema file not found ' + validationSchema);

        case 7:
          return _context.abrupt('return', false);

        case 8:
          if (items) {
            _context.next = 10;
            break;
          }

          throw new Error('Json Schema items are missing');

        case 10:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 13;
          _iterator = items[Symbol.iterator]();

        case 15:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 22;
            break;
          }

          item = _step.value;

          if (compiledSchema(item)) {
            _context.next = 19;
            break;
          }

          throw new Error('JsonSchemaValidate Invalid: ' + ajv.errorsText(compiledSchema.errors));

        case 19:
          _iteratorNormalCompletion = true;
          _context.next = 15;
          break;

        case 22:
          _context.next = 28;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context['catch'](13);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 28:
          _context.prev = 28;
          _context.prev = 29;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 31:
          _context.prev = 31;

          if (!_didIteratorError) {
            _context.next = 34;
            break;
          }

          throw _iteratorError;

        case 34:
          return _context.finish(31);

        case 35:
          return _context.finish(28);

        case 36:
          return _context.abrupt('return', true);

        case 39:
          _context.prev = 39;
          _context.t1 = _context['catch'](0);
          throw new Error(_context.t1);

        case 42:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[0, 39], [13, 24, 28, 36], [29,, 31, 35]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZhbGlkYXRlLmpzb25TY2hlbWEuZXM2Il0sIm5hbWVzIjpbImFqdiIsInJlcXVpcmUiLCJhbGxFcnJvcnMiLCJmcyIsImdldENvbXBpbGVkU2NoZW1hIiwidmFsaWRhdGlvblNjaGVtYSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVhZEZpbGUiLCJlcnIiLCJjb250ZW50cyIsImNvbXBpbGVkU2NoZW1hIiwiY29tcGlsZSIsIkpTT04iLCJwYXJzZSIsIlBBQ0tBR0UiLCJtb2R1bGUiLCJleHBvcnRzIiwianNvblNjaGVtYVZhbGlkYXRlIiwiaXRlbXMiLCJ0aHJvd0lmRmlsZU5vdEZvdW5kZWQiLCJFcnJvciIsIml0ZW0iLCJlcnJvcnNUZXh0IiwiZXJyb3JzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLE1BQU1DLFFBQVEsS0FBUixFQUFlLEVBQUNDLFdBQVcsSUFBWixFQUFmLENBQVY7QUFDQSxJQUFJQyxLQUFLRixRQUFRLElBQVIsQ0FBVDtBQUNBLElBQUlHLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQUNDLGdCQUFEO0FBQUEsU0FBc0IsSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUM3RUwsT0FBR00sUUFBSCxDQUFZSixnQkFBWixFQUE4QixNQUE5QixFQUFzQyxVQUFVSyxHQUFWLEVBQWVDLFFBQWYsRUFBeUI7QUFDN0QsVUFBSUQsR0FBSixFQUFTLE9BQU9ILFFBQVEsS0FBUixDQUFQO0FBQ1QsVUFBSUssaUJBQWlCWixJQUFJYSxPQUFKLENBQVlDLEtBQUtDLEtBQUwsQ0FBV0osUUFBWCxDQUFaLENBQXJCO0FBQ0FKLGNBQVFLLGNBQVI7QUFDRCxLQUpEO0FBS0QsR0FONkMsQ0FBdEI7QUFBQSxDQUF4Qjs7QUFRQSxJQUFNSSxVQUFVLHFCQUFoQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLGtCQUFmO0FBQUEsTUFBb0NDLEtBQXBDLFFBQW9DQSxLQUFwQztBQUFBLE1BQTJDZixnQkFBM0MsUUFBMkNBLGdCQUEzQztBQUFBLG1DQUE2RGdCLHFCQUE3RDtBQUFBLE1BQTZEQSxxQkFBN0QseUNBQW1GLElBQW5GOztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDBDQUVjakIsa0JBQWtCQyxnQkFBbEIsQ0FGZDs7QUFBQTtBQUVUTyx3QkFGUzs7QUFBQSxjQUdSQSxjQUhRO0FBQUE7QUFBQTtBQUFBOztBQUFBLGVBSVBTLHFCQUpPO0FBQUE7QUFBQTtBQUFBOztBQUFBLGdCQUlzQixJQUFJQyxLQUFKLENBQVUseUNBQXVDakIsZ0JBQWpELENBSnRCOztBQUFBO0FBQUEsMkNBS0wsS0FMSzs7QUFBQTtBQUFBLGNBUVJlLEtBUlE7QUFBQTtBQUFBO0FBQUE7O0FBQUEsZ0JBUUssSUFBSUUsS0FBSixpQ0FSTDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBU0lGLEtBVEo7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFTSkcsY0FUSTs7QUFBQSxjQVVOWCxlQUFlVyxJQUFmLENBVk07QUFBQTtBQUFBO0FBQUE7O0FBQUEsZ0JBVXNCLElBQUlELEtBQUosQ0FBVSxpQ0FBaUN0QixJQUFJd0IsVUFBSixDQUFlWixlQUFlYSxNQUE5QixDQUEzQyxDQVZ0Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUEsMkNBWU4sSUFaTTs7QUFBQTtBQUFBO0FBQUE7QUFBQSxnQkFjUCxJQUFJSCxLQUFKLGFBZE87O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoidmFsaWRhdGUuanNvblNjaGVtYS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYWp2ID0gcmVxdWlyZSgnYWp2Jykoe2FsbEVycm9yczogdHJ1ZX0pXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgZ2V0Q29tcGlsZWRTY2hlbWEgPSAodmFsaWRhdGlvblNjaGVtYSkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICBmcy5yZWFkRmlsZSh2YWxpZGF0aW9uU2NoZW1hLCAndXRmOCcsIGZ1bmN0aW9uIChlcnIsIGNvbnRlbnRzKSB7XG4gICAgaWYgKGVycikgcmV0dXJuIHJlc29sdmUoZmFsc2UpXG4gICAgdmFyIGNvbXBpbGVkU2NoZW1hID0gYWp2LmNvbXBpbGUoSlNPTi5wYXJzZShjb250ZW50cykpXG4gICAgcmVzb2x2ZShjb21waWxlZFNjaGVtYSlcbiAgfSlcbn0pXG5cbmNvbnN0IFBBQ0tBR0UgPSAndmFsaWRhdGUuanNvblNjaGVtYSdcbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24ganNvblNjaGVtYVZhbGlkYXRlICh7aXRlbXMsIHZhbGlkYXRpb25TY2hlbWEsIHRocm93SWZGaWxlTm90Rm91bmRlZD10cnVlfSkge1xuICB0cnkge1xuICAgIHZhciBjb21waWxlZFNjaGVtYSA9IGF3YWl0IGdldENvbXBpbGVkU2NoZW1hKHZhbGlkYXRpb25TY2hlbWEpXG4gICAgaWYgKCFjb21waWxlZFNjaGVtYSl7XG4gICAgICBpZiAodGhyb3dJZkZpbGVOb3RGb3VuZGVkKSB0aHJvdyBuZXcgRXJyb3IoYFJFUVVJUkVEIEpzb24gU2NoZW1hIGZpbGUgbm90IGZvdW5kIGArdmFsaWRhdGlvblNjaGVtYSlcbiAgICAgcmV0dXJuIGZhbHNlIC8vZmlsZSBub3QgZm91bmRlZFxuICB9XG5cbiAgICBpZiAoIWl0ZW1zKSB0aHJvdyBuZXcgRXJyb3IoYEpzb24gU2NoZW1hIGl0ZW1zIGFyZSBtaXNzaW5nYClcbiAgICBmb3IgKHZhciBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICBpZiAoIWNvbXBpbGVkU2NoZW1hKGl0ZW0pKSB0aHJvdyBuZXcgRXJyb3IoJ0pzb25TY2hlbWFWYWxpZGF0ZSBJbnZhbGlkOiAnICsgYWp2LmVycm9yc1RleHQoY29tcGlsZWRTY2hlbWEuZXJyb3JzKSlcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpXG4gIH1cbn1cbiJdfQ==