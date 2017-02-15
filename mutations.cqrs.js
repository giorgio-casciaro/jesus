'use strict';

var R = require('ramda');
var path = require('path');
var fs = require('fs');
var LOG = console;

function getMutationsFunctions(basePath) {
  var filesJsNoExtension = R.map(R.compose(R.replace('.js', ''), path.basename), R.filter(function (file) {
    return path.extname(file) === '.js';
  }, fs.readdirSync(basePath)));
  var splitFiles = R.map(R.split('.'));
  var sortFiles = R.compose(R.reverse, R.sortBy(R.compose(parseInt, R.prop(0))));
  var groupFiles = R.groupBy(R.prop(0));
  var addFunction = R.map(R.map(function (element) {
    return { mutationId: element[0], mutationVersion: element[1] };
  }));
  var mutationsFunctions = R.compose(addFunction, groupFiles, sortFiles, splitFiles)(filesJsNoExtension);
  // debug('getMutationsFunctions', mutationsFunctions)
  return mutationsFunctions;
}

function checkMutationFunction(mutationId, mutationsFunctions) {
  if (!mutationsFunctions[mutationId] || !mutationsFunctions[mutationId][0]) {
    throw new Error('mutation non definita');
  }
}
var applyMutationsFromPath = function applyMutationsFromPathFunc(originalState, mutations, mutationsPath) {
  var state = R.clone(originalState);
  LOG.debug('applyMutationsFromPath', { context: PACKAGE, debug: { state: state, mutations: mutations, mutationsPath: mutationsPath } });
  function applyMutation(state, mutation) {
    var mutationFile = path.join(mutationsPath, mutation.mutation + '.' + mutation.version + '.js');
    return require(mutationFile)(state, mutation.data);
  }
  return R.reduce(applyMutation, state, mutations);
};
// async function validateMutation (mutationName, data, mutationsPath) {
//   if (!data || !data.length) return null // non ci sono dati da validare
//   var validate = require('./validate.jsonSchema')
//   var validationSchema = path.join(mutationsPath, `${mutationName}.schema.json`)
//   var validationResults = await validate({data, validationSchema, throwIfFileNotFounded: false})
//   if (validationResults === false) LOG.warn({msg: 'mutation not have a schema expected:' + validationSchema, context: PACKAGE, data: {mutationName, data, mutationsPath}})
// }

var PACKAGE = 'mutations.cqrs';
var checkRequired = require('./jesus').checkRequired;
module.exports = function getMutationsCqrsPackage(_ref) {
  var mutationsPath = _ref.mutationsPath,
      mutationsStoragePackage = _ref.mutationsStoragePackage;
  return regeneratorRuntime.async(function getMutationsCqrsPackage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;

          checkRequired({ mutationsPath: mutationsPath, mutationsStoragePackage: mutationsStoragePackage }, PACKAGE);
          return _context4.abrupt('return', {
            mutate: function mutate(_ref2) {
              var mutation = _ref2.mutation,
                  objId = _ref2.objId,
                  data = _ref2.data;
              var mutationsFunctions, lastMutationVersion, mutationState;
              return regeneratorRuntime.async(function mutate$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;

                      checkRequired({ objId: objId, mutation: mutation }, PACKAGE);
                      mutationsFunctions = getMutationsFunctions(mutationsPath);

                      checkMutationFunction(mutation, mutationsFunctions);
                      lastMutationVersion = mutationsFunctions[mutation][0].mutationVersion;
                      mutationState = {
                        objId: objId,
                        mutation: mutation,
                        version: lastMutationVersion,
                        timestamp: new Date().getTime() / 1000,
                        data: data
                      };

                      LOG.debug('dataSingleMutation to create', { context: PACKAGE, debug: { mutation: mutation, lastMutationVersion: lastMutationVersion, objId: objId, data: data, mutationState: mutationState } });
                      _context.next = 9;
                      return regeneratorRuntime.awrap(mutationsStoragePackage.insert({ objs: [mutationState] }));

                    case 9:
                      return _context.abrupt('return', mutationState);

                    case 12:
                      _context.prev = 12;
                      _context.t0 = _context['catch'](0);

                      LOG.error(PACKAGE, _context.t0, { mutation: mutation, objId: objId, data: data });
                      throw new Error('mutate(args) Error');

                    case 16:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, null, this, [[0, 12]]);
            },
            getObjMutations: function getObjMutations(_ref3) {
              var objId = _ref3.objId,
                  _ref3$minTimestamp = _ref3.minTimestamp,
                  minTimestamp = _ref3$minTimestamp === undefined ? 0 : _ref3$minTimestamp;
              var results;
              return regeneratorRuntime.async(function getObjMutations$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return regeneratorRuntime.awrap(mutationsStoragePackage.find({
                        query: {
                          objId: objId,
                          timestamp: { $gte: minTimestamp }
                        },
                        sort: { timestamp: 1 }
                      }));

                    case 2:
                      results = _context2.sent;

                      LOG.debug('getObjMutations', { context: PACKAGE, debug: { objId: objId, minTimestamp: minTimestamp, results: results } });
                      return _context2.abrupt('return', results);

                    case 5:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, null, this);
            },
            applyMutations: function applyMutations(_ref4) {
              var state = _ref4.state,
                  mutations = _ref4.mutations;
              return regeneratorRuntime.async(function applyMutations$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      LOG.debug('applyMutationsFromPath', { context: PACKAGE, debug: { state: state, mutations: mutations, mutationsPath: mutationsPath } });
                      return _context3.abrupt('return', applyMutationsFromPath(state, mutations, mutationsPath));

                    case 2:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, null, this);
            }
          });

        case 5:
          _context4.prev = 5;
          _context4.t0 = _context4['catch'](0);

          LOG.error(PACKAGE, _context4.t0);
          throw new Error('getMutationsCqrsPackage');

        case 9:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this, [[0, 5]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11dGF0aW9ucy5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsInBhdGgiLCJmcyIsIkxPRyIsImNvbnNvbGUiLCJnZXRNdXRhdGlvbnNGdW5jdGlvbnMiLCJiYXNlUGF0aCIsImZpbGVzSnNOb0V4dGVuc2lvbiIsIm1hcCIsImNvbXBvc2UiLCJyZXBsYWNlIiwiYmFzZW5hbWUiLCJmaWx0ZXIiLCJmaWxlIiwiZXh0bmFtZSIsInJlYWRkaXJTeW5jIiwic3BsaXRGaWxlcyIsInNwbGl0Iiwic29ydEZpbGVzIiwicmV2ZXJzZSIsInNvcnRCeSIsInBhcnNlSW50IiwicHJvcCIsImdyb3VwRmlsZXMiLCJncm91cEJ5IiwiYWRkRnVuY3Rpb24iLCJlbGVtZW50IiwibXV0YXRpb25JZCIsIm11dGF0aW9uVmVyc2lvbiIsIm11dGF0aW9uc0Z1bmN0aW9ucyIsImNoZWNrTXV0YXRpb25GdW5jdGlvbiIsIkVycm9yIiwiYXBwbHlNdXRhdGlvbnNGcm9tUGF0aCIsImFwcGx5TXV0YXRpb25zRnJvbVBhdGhGdW5jIiwib3JpZ2luYWxTdGF0ZSIsIm11dGF0aW9ucyIsIm11dGF0aW9uc1BhdGgiLCJzdGF0ZSIsImNsb25lIiwiZGVidWciLCJjb250ZXh0IiwiUEFDS0FHRSIsImFwcGx5TXV0YXRpb24iLCJtdXRhdGlvbiIsIm11dGF0aW9uRmlsZSIsImpvaW4iLCJ2ZXJzaW9uIiwiZGF0YSIsInJlZHVjZSIsImNoZWNrUmVxdWlyZWQiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UiLCJtdXRhdGlvbnNTdG9yYWdlUGFja2FnZSIsIm11dGF0ZSIsIm9iaklkIiwibGFzdE11dGF0aW9uVmVyc2lvbiIsIm11dGF0aW9uU3RhdGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwiZ2V0VGltZSIsImluc2VydCIsIm9ianMiLCJlcnJvciIsImdldE9iak11dGF0aW9ucyIsIm1pblRpbWVzdGFtcCIsImZpbmQiLCJxdWVyeSIsIiRndGUiLCJzb3J0IiwicmVzdWx0cyIsImFwcGx5TXV0YXRpb25zIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBSUMsT0FBT0QsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJRSxLQUFLRixRQUFRLElBQVIsQ0FBVDtBQUNBLElBQUlHLE1BQU1DLE9BQVY7O0FBRUEsU0FBU0MscUJBQVQsQ0FBZ0NDLFFBQWhDLEVBQTBDO0FBQ3hDLE1BQUlDLHFCQUFxQlIsRUFBRVMsR0FBRixDQUFNVCxFQUFFVSxPQUFGLENBQVVWLEVBQUVXLE9BQUYsQ0FBVSxLQUFWLEVBQWlCLEVBQWpCLENBQVYsRUFBZ0NULEtBQUtVLFFBQXJDLENBQU4sRUFBc0RaLEVBQUVhLE1BQUYsQ0FBUyxVQUFDQyxJQUFEO0FBQUEsV0FBVVosS0FBS2EsT0FBTCxDQUFhRCxJQUFiLE1BQXVCLEtBQWpDO0FBQUEsR0FBVCxFQUFpRFgsR0FBR2EsV0FBSCxDQUFlVCxRQUFmLENBQWpELENBQXRELENBQXpCO0FBQ0EsTUFBSVUsYUFBYWpCLEVBQUVTLEdBQUYsQ0FBTVQsRUFBRWtCLEtBQUYsQ0FBUSxHQUFSLENBQU4sQ0FBakI7QUFDQSxNQUFJQyxZQUFZbkIsRUFBRVUsT0FBRixDQUFVVixFQUFFb0IsT0FBWixFQUFxQnBCLEVBQUVxQixNQUFGLENBQVNyQixFQUFFVSxPQUFGLENBQVVZLFFBQVYsRUFBb0J0QixFQUFFdUIsSUFBRixDQUFPLENBQVAsQ0FBcEIsQ0FBVCxDQUFyQixDQUFoQjtBQUNBLE1BQUlDLGFBQWF4QixFQUFFeUIsT0FBRixDQUFVekIsRUFBRXVCLElBQUYsQ0FBTyxDQUFQLENBQVYsQ0FBakI7QUFDQSxNQUFJRyxjQUFjMUIsRUFBRVMsR0FBRixDQUFNVCxFQUFFUyxHQUFGLENBQU0sVUFBQ2tCLE9BQUQsRUFBYTtBQUN6QyxXQUFPLEVBQUNDLFlBQVlELFFBQVEsQ0FBUixDQUFiLEVBQXlCRSxpQkFBaUJGLFFBQVEsQ0FBUixDQUExQyxFQUFQO0FBQ0QsR0FGdUIsQ0FBTixDQUFsQjtBQUdBLE1BQUlHLHFCQUFxQjlCLEVBQUVVLE9BQUYsQ0FBVWdCLFdBQVYsRUFBdUJGLFVBQXZCLEVBQW1DTCxTQUFuQyxFQUE4Q0YsVUFBOUMsRUFBMERULGtCQUExRCxDQUF6QjtBQUNBO0FBQ0EsU0FBT3NCLGtCQUFQO0FBQ0Q7O0FBRUQsU0FBU0MscUJBQVQsQ0FBZ0NILFVBQWhDLEVBQTRDRSxrQkFBNUMsRUFBZ0U7QUFDOUQsTUFBSSxDQUFDQSxtQkFBbUJGLFVBQW5CLENBQUQsSUFBbUMsQ0FBQ0UsbUJBQW1CRixVQUFuQixFQUErQixDQUEvQixDQUF4QyxFQUEyRTtBQUN6RSxVQUFNLElBQUlJLEtBQUosQ0FBVSx1QkFBVixDQUFOO0FBQ0Q7QUFDRjtBQUNELElBQUlDLHlCQUF5QixTQUFTQywwQkFBVCxDQUFxQ0MsYUFBckMsRUFBb0RDLFNBQXBELEVBQStEQyxhQUEvRCxFQUE4RTtBQUN6RyxNQUFJQyxRQUFRdEMsRUFBRXVDLEtBQUYsQ0FBUUosYUFBUixDQUFaO0FBQ0EvQixNQUFJb0MsS0FBSixDQUFVLHdCQUFWLEVBQW1DLEVBQUNDLFNBQVNDLE9BQVYsRUFBbUJGLE9BQU8sRUFBQ0YsWUFBRCxFQUFRRixvQkFBUixFQUFtQkMsNEJBQW5CLEVBQTFCLEVBQW5DO0FBQ0EsV0FBU00sYUFBVCxDQUF3QkwsS0FBeEIsRUFBK0JNLFFBQS9CLEVBQXlDO0FBQ3ZDLFFBQUlDLGVBQWUzQyxLQUFLNEMsSUFBTCxDQUFVVCxhQUFWLEVBQTRCTyxTQUFTQSxRQUFyQyxTQUFpREEsU0FBU0csT0FBMUQsU0FBbkI7QUFDQSxXQUFPOUMsUUFBUTRDLFlBQVIsRUFBc0JQLEtBQXRCLEVBQTZCTSxTQUFTSSxJQUF0QyxDQUFQO0FBQ0Q7QUFDRCxTQUFPaEQsRUFBRWlELE1BQUYsQ0FBU04sYUFBVCxFQUF3QkwsS0FBeEIsRUFBK0JGLFNBQS9CLENBQVA7QUFDRCxDQVJEO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBTU0sVUFBVSxnQkFBaEI7QUFDQSxJQUFNUSxnQkFBZ0JqRCxRQUFRLFNBQVIsRUFBbUJpRCxhQUF6QztBQUNBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLHVCQUFmO0FBQUEsTUFBeUNoQixhQUF6QyxRQUF5Q0EsYUFBekM7QUFBQSxNQUF3RGlCLHVCQUF4RCxRQUF3REEsdUJBQXhEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFFYkosd0JBQWMsRUFBQ2IsNEJBQUQsRUFBZ0JpQixnREFBaEIsRUFBZCxFQUF3RFosT0FBeEQ7QUFGYSw0Q0FHTjtBQUNMYSxvQkFBUSxTQUFlQSxNQUFmO0FBQUEsa0JBQXdCWCxRQUF4QixTQUF3QkEsUUFBeEI7QUFBQSxrQkFBa0NZLEtBQWxDLFNBQWtDQSxLQUFsQztBQUFBLGtCQUF5Q1IsSUFBekMsU0FBeUNBLElBQXpDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUVKRSxvQ0FBYyxFQUFDTSxZQUFELEVBQVFaLGtCQUFSLEVBQWQsRUFBaUNGLE9BQWpDO0FBQ0laLHdDQUhBLEdBR3FCeEIsc0JBQXNCK0IsYUFBdEIsQ0FIckI7O0FBSUpOLDRDQUFzQmEsUUFBdEIsRUFBZ0NkLGtCQUFoQztBQUNJMkIseUNBTEEsR0FLc0IzQixtQkFBbUJjLFFBQW5CLEVBQTZCLENBQTdCLEVBQWdDZixlQUx0RDtBQU1BNkIsbUNBTkEsR0FNZ0I7QUFDbEJGLCtCQUFPQSxLQURXO0FBRWxCWiwwQ0FGa0I7QUFHbEJHLGlDQUFTVSxtQkFIUztBQUlsQkUsbUNBQVcsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEtBQXVCLElBSmhCO0FBS2xCYjtBQUxrQix1QkFOaEI7O0FBYUo1QywwQkFBSW9DLEtBQUosQ0FBVSw4QkFBVixFQUF5QyxFQUFFQyxTQUFTQyxPQUFYLEVBQW9CRixPQUFPLEVBQUNJLGtCQUFELEVBQVdhLHdDQUFYLEVBQWdDRCxZQUFoQyxFQUF1Q1IsVUFBdkMsRUFBNkNVLDRCQUE3QyxFQUEzQixFQUF6QztBQWJJO0FBQUEsc0RBY0VKLHdCQUF3QlEsTUFBeEIsQ0FBK0IsRUFBQ0MsTUFBTSxDQUFDTCxhQUFELENBQVAsRUFBL0IsQ0FkRjs7QUFBQTtBQUFBLHVEQWVHQSxhQWZIOztBQUFBO0FBQUE7QUFBQTs7QUFpQkp0RCwwQkFBSTRELEtBQUosQ0FBVXRCLE9BQVYsZUFBMEIsRUFBQ0Usa0JBQUQsRUFBV1ksWUFBWCxFQUFrQlIsVUFBbEIsRUFBMUI7QUFqQkksNEJBa0JFLElBQUloQixLQUFKLHNCQWxCRjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQURIO0FBc0JMaUMsNkJBQWlCLFNBQWVBLGVBQWY7QUFBQSxrQkFBaUNULEtBQWpDLFNBQWlDQSxLQUFqQztBQUFBLDZDQUF3Q1UsWUFBeEM7QUFBQSxrQkFBd0NBLFlBQXhDLHNDQUF1RCxDQUF2RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNEQUNLWix3QkFBd0JhLElBQXhCLENBQTZCO0FBQy9DQywrQkFBTztBQUNMWixpQ0FBT0EsS0FERjtBQUVMRyxxQ0FBVyxFQUFDVSxNQUFNSCxZQUFQO0FBRk4seUJBRHdDO0FBSy9DSSw4QkFBTSxFQUFDWCxXQUFXLENBQVo7QUFMeUMsdUJBQTdCLENBREw7O0FBQUE7QUFDWFksNkJBRFc7O0FBUWZuRSwwQkFBSW9DLEtBQUosQ0FBVSxpQkFBVixFQUE0QixFQUFFQyxTQUFTQyxPQUFYLEVBQW9CRixPQUFPLEVBQUNnQixZQUFELEVBQVFVLDBCQUFSLEVBQXNCSyxnQkFBdEIsRUFBM0IsRUFBNUI7QUFSZSx3REFTUkEsT0FUUTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQXRCWjtBQWlDTEMsNEJBQWdCLFNBQWVBLGNBQWY7QUFBQSxrQkFBZ0NsQyxLQUFoQyxTQUFnQ0EsS0FBaEM7QUFBQSxrQkFBdUNGLFNBQXZDLFNBQXVDQSxTQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ2RoQywwQkFBSW9DLEtBQUosQ0FBVSx3QkFBVixFQUFtQyxFQUFDQyxTQUFTQyxPQUFWLEVBQW1CRixPQUFPLEVBQUNGLFlBQUQsRUFBUUYsb0JBQVIsRUFBbUJDLDRCQUFuQixFQUExQixFQUFuQztBQURjLHdEQUVQSix1QkFBdUJLLEtBQXZCLEVBQThCRixTQUE5QixFQUF5Q0MsYUFBekMsQ0FGTzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWpDWCxXQUhNOztBQUFBO0FBQUE7QUFBQTs7QUEwQ2JqQyxjQUFJNEQsS0FBSixDQUFVdEIsT0FBVjtBQTFDYSxnQkEyQ1AsSUFBSVYsS0FBSixDQUFVLHlCQUFWLENBM0NPOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6Im11dGF0aW9ucy5jcXJzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbnZhciBMT0cgPSBjb25zb2xlXG5cbmZ1bmN0aW9uIGdldE11dGF0aW9uc0Z1bmN0aW9ucyAoYmFzZVBhdGgpIHtcbiAgdmFyIGZpbGVzSnNOb0V4dGVuc2lvbiA9IFIubWFwKFIuY29tcG9zZShSLnJlcGxhY2UoJy5qcycsICcnKSwgcGF0aC5iYXNlbmFtZSksIFIuZmlsdGVyKChmaWxlKSA9PiBwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcuanMnLCBmcy5yZWFkZGlyU3luYyhiYXNlUGF0aCkpKVxuICB2YXIgc3BsaXRGaWxlcyA9IFIubWFwKFIuc3BsaXQoJy4nKSlcbiAgdmFyIHNvcnRGaWxlcyA9IFIuY29tcG9zZShSLnJldmVyc2UsIFIuc29ydEJ5KFIuY29tcG9zZShwYXJzZUludCwgUi5wcm9wKDApKSkpXG4gIHZhciBncm91cEZpbGVzID0gUi5ncm91cEJ5KFIucHJvcCgwKSlcbiAgdmFyIGFkZEZ1bmN0aW9uID0gUi5tYXAoUi5tYXAoKGVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4ge211dGF0aW9uSWQ6IGVsZW1lbnRbMF0sIG11dGF0aW9uVmVyc2lvbjogZWxlbWVudFsxXX1cbiAgfSkpXG4gIHZhciBtdXRhdGlvbnNGdW5jdGlvbnMgPSBSLmNvbXBvc2UoYWRkRnVuY3Rpb24sIGdyb3VwRmlsZXMsIHNvcnRGaWxlcywgc3BsaXRGaWxlcykoZmlsZXNKc05vRXh0ZW5zaW9uKVxuICAvLyBkZWJ1ZygnZ2V0TXV0YXRpb25zRnVuY3Rpb25zJywgbXV0YXRpb25zRnVuY3Rpb25zKVxuICByZXR1cm4gbXV0YXRpb25zRnVuY3Rpb25zXG59XG5cbmZ1bmN0aW9uIGNoZWNrTXV0YXRpb25GdW5jdGlvbiAobXV0YXRpb25JZCwgbXV0YXRpb25zRnVuY3Rpb25zKSB7XG4gIGlmICghbXV0YXRpb25zRnVuY3Rpb25zW211dGF0aW9uSWRdIHx8ICFtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25JZF1bMF0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ211dGF0aW9uIG5vbiBkZWZpbml0YScpXG4gIH1cbn1cbnZhciBhcHBseU11dGF0aW9uc0Zyb21QYXRoID0gZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnNGcm9tUGF0aEZ1bmMgKG9yaWdpbmFsU3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aCkge1xuICB2YXIgc3RhdGUgPSBSLmNsb25lKG9yaWdpbmFsU3RhdGUpXG4gIExPRy5kZWJ1ZygnYXBwbHlNdXRhdGlvbnNGcm9tUGF0aCcse2NvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7c3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aH19KVxuICBmdW5jdGlvbiBhcHBseU11dGF0aW9uIChzdGF0ZSwgbXV0YXRpb24pIHtcbiAgICB2YXIgbXV0YXRpb25GaWxlID0gcGF0aC5qb2luKG11dGF0aW9uc1BhdGgsIGAke211dGF0aW9uLm11dGF0aW9ufS4ke211dGF0aW9uLnZlcnNpb259LmpzYClcbiAgICByZXR1cm4gcmVxdWlyZShtdXRhdGlvbkZpbGUpKHN0YXRlLCBtdXRhdGlvbi5kYXRhKVxuICB9XG4gIHJldHVybiBSLnJlZHVjZShhcHBseU11dGF0aW9uLCBzdGF0ZSwgbXV0YXRpb25zKVxufVxuLy8gYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGVNdXRhdGlvbiAobXV0YXRpb25OYW1lLCBkYXRhLCBtdXRhdGlvbnNQYXRoKSB7XG4vLyAgIGlmICghZGF0YSB8fCAhZGF0YS5sZW5ndGgpIHJldHVybiBudWxsIC8vIG5vbiBjaSBzb25vIGRhdGkgZGEgdmFsaWRhcmVcbi8vICAgdmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi92YWxpZGF0ZS5qc29uU2NoZW1hJylcbi8vICAgdmFyIHZhbGlkYXRpb25TY2hlbWEgPSBwYXRoLmpvaW4obXV0YXRpb25zUGF0aCwgYCR7bXV0YXRpb25OYW1lfS5zY2hlbWEuanNvbmApXG4vLyAgIHZhciB2YWxpZGF0aW9uUmVzdWx0cyA9IGF3YWl0IHZhbGlkYXRlKHtkYXRhLCB2YWxpZGF0aW9uU2NoZW1hLCB0aHJvd0lmRmlsZU5vdEZvdW5kZWQ6IGZhbHNlfSlcbi8vICAgaWYgKHZhbGlkYXRpb25SZXN1bHRzID09PSBmYWxzZSkgTE9HLndhcm4oe21zZzogJ211dGF0aW9uIG5vdCBoYXZlIGEgc2NoZW1hIGV4cGVjdGVkOicgKyB2YWxpZGF0aW9uU2NoZW1hLCBjb250ZXh0OiBQQUNLQUdFLCBkYXRhOiB7bXV0YXRpb25OYW1lLCBkYXRhLCBtdXRhdGlvbnNQYXRofX0pXG4vLyB9XG5cbmNvbnN0IFBBQ0tBR0UgPSAnbXV0YXRpb25zLmNxcnMnXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UgKHttdXRhdGlvbnNQYXRoLCBtdXRhdGlvbnNTdG9yYWdlUGFja2FnZX0pIHtcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHttdXRhdGlvbnNQYXRoLCBtdXRhdGlvbnNTdG9yYWdlUGFja2FnZX0sIFBBQ0tBR0UpXG4gICAgcmV0dXJuIHtcbiAgICAgIG11dGF0ZTogYXN5bmMgZnVuY3Rpb24gbXV0YXRlICh7bXV0YXRpb24sIG9iaklkLCBkYXRhfSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNoZWNrUmVxdWlyZWQoe29iaklkLCBtdXRhdGlvbn0sIFBBQ0tBR0UpXG4gICAgICAgICAgdmFyIG11dGF0aW9uc0Z1bmN0aW9ucyA9IGdldE11dGF0aW9uc0Z1bmN0aW9ucyhtdXRhdGlvbnNQYXRoKVxuICAgICAgICAgIGNoZWNrTXV0YXRpb25GdW5jdGlvbihtdXRhdGlvbiwgbXV0YXRpb25zRnVuY3Rpb25zKVxuICAgICAgICAgIHZhciBsYXN0TXV0YXRpb25WZXJzaW9uID0gbXV0YXRpb25zRnVuY3Rpb25zW211dGF0aW9uXVswXS5tdXRhdGlvblZlcnNpb25cbiAgICAgICAgICB2YXIgbXV0YXRpb25TdGF0ZSA9IHtcbiAgICAgICAgICAgIG9iaklkOiBvYmpJZCxcbiAgICAgICAgICAgIG11dGF0aW9uLFxuICAgICAgICAgICAgdmVyc2lvbjogbGFzdE11dGF0aW9uVmVyc2lvbixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwLFxuICAgICAgICAgICAgZGF0YVxuICAgICAgICAgIH1cbiAgICAgICAgICBMT0cuZGVidWcoJ2RhdGFTaW5nbGVNdXRhdGlvbiB0byBjcmVhdGUnLHsgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHttdXRhdGlvbiwgbGFzdE11dGF0aW9uVmVyc2lvbiwgb2JqSWQsIGRhdGEsIG11dGF0aW9uU3RhdGV9fSlcbiAgICAgICAgICBhd2FpdCBtdXRhdGlvbnNTdG9yYWdlUGFja2FnZS5pbnNlcnQoe29ianM6IFttdXRhdGlvblN0YXRlXX0pXG4gICAgICAgICAgcmV0dXJuIG11dGF0aW9uU3RhdGVcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBMT0cuZXJyb3IoUEFDS0FHRSwgZXJyb3IsIHttdXRhdGlvbiwgb2JqSWQsIGRhdGF9KVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgbXV0YXRlKGFyZ3MpIEVycm9yYClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGdldE9iak11dGF0aW9uczogYXN5bmMgZnVuY3Rpb24gZ2V0T2JqTXV0YXRpb25zICh7b2JqSWQsIG1pblRpbWVzdGFtcCA9IDB9KSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gYXdhaXQgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2UuZmluZCh7XG4gICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgIG9iaklkOiBvYmpJZCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogeyRndGU6IG1pblRpbWVzdGFtcH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNvcnQ6IHt0aW1lc3RhbXA6IDF9XG4gICAgICAgIH0pXG4gICAgICAgIExPRy5kZWJ1ZygnZ2V0T2JqTXV0YXRpb25zJyx7IGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7b2JqSWQsIG1pblRpbWVzdGFtcCwgcmVzdWx0c319KVxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfSxcbiAgICAgIGFwcGx5TXV0YXRpb25zOiBhc3luYyBmdW5jdGlvbiBhcHBseU11dGF0aW9ucyAoe3N0YXRlLCBtdXRhdGlvbnN9KSB7XG4gICAgICAgIExPRy5kZWJ1ZygnYXBwbHlNdXRhdGlvbnNGcm9tUGF0aCcse2NvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7c3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aH19KVxuICAgICAgICByZXR1cm4gYXBwbHlNdXRhdGlvbnNGcm9tUGF0aChzdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRoKVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBMT0cuZXJyb3IoUEFDS0FHRSwgZXJyb3IpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRNdXRhdGlvbnNDcXJzUGFja2FnZScpXG4gIH1cbn1cbiJdfQ==