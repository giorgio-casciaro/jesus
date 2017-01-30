'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
var path = require('path');
var fs = require('fs');
function debug() {
  console.log('\x1B[1;33m' + '<State Mutations>' + '\x1B[0m');
  console.log.apply(console, arguments);
}
// var checkNullId = function checkNullId (instance) {
//   if (!instance._id) {
//     delete instance._id
//   }
//   return instance
// }

function createItemsMutation(mutationId, mutationVersion, mutationsItemsIds, mutationsArgs) {
  var mutations = R.addIndex(R.map)(function (itemId, index) {
    return {
      itemId: itemId,
      mutation: mutationId,
      version: mutationVersion,
      time: new Date().getTime() / 1000,
      data: mutationsArgs && mutationsArgs[index] ? mutationsArgs[index] : {}
    };
  }, mutationsItemsIds);
  return mutations;
}

// function applyMutations (mutationsFunctions, mutations, states) {
//   debug('applyMutations', mutationsFunctions, mutations, states)
//   states = states || {}
//   var mutationsByItem = R.groupBy(R.prop('itemId'), mutations)
//   var statesByItem = R.zipObj(R.map(R.prop('itemId', states)), states)
//   for (let itemId in mutationsByItem) {
//     for (let mutation of mutationsByItem[itemId]) {
//       statesByItem[itemId] = mutationsFunctions[mutation.mutation][mutation.version](statesByItem[itemId] || {}, mutation.data)
//     }
//   }
//   debug('appliedMutations', statesByItem)
//   return R.values(statesByItem)
// }

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

function applyMutationsFromPath(state, mutations, mutationsPath) {
  state = R.clone(state);
  function applyMutation(state, mutation) {
    // console.log(`applyMutationsFromPath ${mutation.mutation}.${mutation.version}.js`)
    var mutationFile = path.join(mutationsPath, mutation.mutation + '.' + mutation.version + '.js');
    return require(mutationFile)(state, mutation.data);
  }
  return R.reduce(applyMutation, state, mutations);
}

function checkMutationFunction(mutationId, mutationsFunctions) {
  if (!mutationsFunctions[mutationId] || !mutationsFunctions[mutationId][0]) {
    throw new Error('mutation non definita');
  }
}

// function getFunctions (basePath, filterByMutationId, filterByVersion) {
//   var versions = getVersions(basePath)
//   if (filterByMutationId) {
//     versions = {
//       [filterByMutationId]: versions[filterByMutationId]
//     }
//   }
//   if (filterByVersion) {
//     versions[filterByMutationId] = [filterByVersion]
//   }
//   var mutationsFunctions = R.mapObjIndexed((val, muName, obj) => R.zipObj(val, R.map((muVers) => require(`${basePath}/${muName}.${muVers}`), val)), versions)
//   debug('getFunctions', mutationsFunctions)
//   return mutationsFunctions
// }

module.exports = function getMutationsCqrsPackage(CONFIG, DI) {
  var _ret;

  return regeneratorRuntime.async(function getMutationsCqrsPackage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;

          _ret = function () {
            var PACKAGE = 'mutations.cqrs';
            var getValuePromise = require('./jesus').getValuePromise;
            var checkRequired = require('./jesus').checkRequired;
            CONFIG = checkRequired(CONFIG, ['mutationsPath'], PACKAGE);
            DI = checkRequired(DI, ['mutationsStoragePackage', 'error', 'log', 'debug'], PACKAGE);
            return {
              v: {
                mutate: function mutate(_ref) {
                  var mutation = _ref.mutation,
                      itemsIds = _ref.itemsIds,
                      items = _ref.items;
                  var configMutationsPath, mutationsFunctions, lastMutationVersion, itemsSingleMutation;
                  return regeneratorRuntime.async(function mutate$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.prev = 0;
                          _context.next = 3;
                          return regeneratorRuntime.awrap(getValuePromise(CONFIG.mutationsPath));

                        case 3:
                          configMutationsPath = _context.sent;
                          mutationsFunctions = getMutationsFunctions(configMutationsPath);

                          checkMutationFunction(mutation, mutationsFunctions);
                          lastMutationVersion = mutationsFunctions[mutation][0].mutationVersion;
                          // DI.debug({msg: 'createItemsMutations', context: PACKAGE, debug: {mutation, lastMutationVersion, itemsIds, items}})

                          itemsSingleMutation = createItemsMutation(mutation, lastMutationVersion, itemsIds, items);

                          DI.debug({ msg: 'itemsSingleMutation to create', context: PACKAGE, debug: { mutation: mutation, lastMutationVersion: lastMutationVersion, itemsIds: itemsIds, items: items, itemsSingleMutation: itemsSingleMutation } });
                          _context.next = 11;
                          return regeneratorRuntime.awrap(DI.mutationsStoragePackage.insert({ items: itemsSingleMutation }));

                        case 11:
                          return _context.abrupt('return', itemsSingleMutation);

                        case 14:
                          _context.prev = 14;
                          _context.t0 = _context['catch'](0);

                          DI.throwError(PACKAGE + ' mutate(args) Error', _context.t0, { mutation: mutation, itemsIds: itemsIds, items: items });

                        case 17:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, null, this, [[0, 14]]);
                },
                getItemMutations: function getItemMutations(_ref2) {
                  var itemId = _ref2.itemId,
                      _ref2$minTimestamp = _ref2.minTimestamp,
                      minTimestamp = _ref2$minTimestamp === undefined ? 0 : _ref2$minTimestamp;
                  var results;
                  return regeneratorRuntime.async(function getItemMutations$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return regeneratorRuntime.awrap(DI.mutationsStoragePackage.find({
                            query: {
                              itemId: itemId
                            },
                            sort: { timestamp: 1 }
                          }));

                        case 2:
                          results = _context2.sent;

                          DI.debug({ msg: 'getItemMutations', context: PACKAGE, debug: { itemId: itemId, minTimestamp: minTimestamp, results: results } });
                          return _context2.abrupt('return', results);

                        case 5:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, null, this);
                },
                applyMutations: function applyMutations(_ref3) {
                  var state = _ref3.state,
                      mutations = _ref3.mutations;
                  var mutationsPath;
                  return regeneratorRuntime.async(function applyMutations$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return regeneratorRuntime.awrap(getValuePromise(CONFIG.mutationsPath));

                        case 2:
                          mutationsPath = _context3.sent;


                          DI.debug({ msg: 'applyMutationsFromPath', context: PACKAGE, debug: { state: state, mutations: mutations, mutationsPath: mutationsPath } });
                          return _context3.abrupt('return', applyMutationsFromPath(state, mutations, mutationsPath));

                        case 5:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, null, this);
                }
              }
            };
          }();

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt('return', _ret.v);

        case 4:
          _context4.next = 9;
          break;

        case 6:
          _context4.prev = 6;
          _context4.t0 = _context4['catch'](0);

          DI.throwError('getMutationsCqrsPackage(CONFIG, DI)', _context4.t0);

        case 9:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this, [[0, 6]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11dGF0aW9ucy5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsInBhdGgiLCJmcyIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsImFwcGx5IiwiYXJndW1lbnRzIiwiY3JlYXRlSXRlbXNNdXRhdGlvbiIsIm11dGF0aW9uSWQiLCJtdXRhdGlvblZlcnNpb24iLCJtdXRhdGlvbnNJdGVtc0lkcyIsIm11dGF0aW9uc0FyZ3MiLCJtdXRhdGlvbnMiLCJhZGRJbmRleCIsIm1hcCIsIml0ZW1JZCIsImluZGV4IiwibXV0YXRpb24iLCJ2ZXJzaW9uIiwidGltZSIsIkRhdGUiLCJnZXRUaW1lIiwiZGF0YSIsImdldE11dGF0aW9uc0Z1bmN0aW9ucyIsImJhc2VQYXRoIiwiZmlsZXNKc05vRXh0ZW5zaW9uIiwiY29tcG9zZSIsInJlcGxhY2UiLCJiYXNlbmFtZSIsImZpbHRlciIsImZpbGUiLCJleHRuYW1lIiwicmVhZGRpclN5bmMiLCJzcGxpdEZpbGVzIiwic3BsaXQiLCJzb3J0RmlsZXMiLCJyZXZlcnNlIiwic29ydEJ5IiwicGFyc2VJbnQiLCJwcm9wIiwiZ3JvdXBGaWxlcyIsImdyb3VwQnkiLCJhZGRGdW5jdGlvbiIsImVsZW1lbnQiLCJtdXRhdGlvbnNGdW5jdGlvbnMiLCJhcHBseU11dGF0aW9uc0Zyb21QYXRoIiwic3RhdGUiLCJtdXRhdGlvbnNQYXRoIiwiY2xvbmUiLCJhcHBseU11dGF0aW9uIiwibXV0YXRpb25GaWxlIiwiam9pbiIsInJlZHVjZSIsImNoZWNrTXV0YXRpb25GdW5jdGlvbiIsIkVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE11dGF0aW9uc0NxcnNQYWNrYWdlIiwiQ09ORklHIiwiREkiLCJQQUNLQUdFIiwiZ2V0VmFsdWVQcm9taXNlIiwiY2hlY2tSZXF1aXJlZCIsIm11dGF0ZSIsIml0ZW1zSWRzIiwiaXRlbXMiLCJjb25maWdNdXRhdGlvbnNQYXRoIiwibGFzdE11dGF0aW9uVmVyc2lvbiIsIml0ZW1zU2luZ2xlTXV0YXRpb24iLCJtc2ciLCJjb250ZXh0IiwibXV0YXRpb25zU3RvcmFnZVBhY2thZ2UiLCJpbnNlcnQiLCJ0aHJvd0Vycm9yIiwiZ2V0SXRlbU11dGF0aW9ucyIsIm1pblRpbWVzdGFtcCIsImZpbmQiLCJxdWVyeSIsInNvcnQiLCJ0aW1lc3RhbXAiLCJyZXN1bHRzIiwiYXBwbHlNdXRhdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUUsS0FBS0YsUUFBUSxJQUFSLENBQVQ7QUFDQSxTQUFTRyxLQUFULEdBQWtCO0FBQ2hCQyxVQUFRQyxHQUFSLENBQVksZUFDVixtQkFEVSxHQUVWLFNBRkY7QUFHQUQsVUFBUUMsR0FBUixDQUFZQyxLQUFaLENBQWtCRixPQUFsQixFQUEyQkcsU0FBM0I7QUFDRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTQyxtQkFBVCxDQUE4QkMsVUFBOUIsRUFBMENDLGVBQTFDLEVBQTJEQyxpQkFBM0QsRUFBOEVDLGFBQTlFLEVBQTZGO0FBQzNGLE1BQUlDLFlBQVlkLEVBQUVlLFFBQUYsQ0FBV2YsRUFBRWdCLEdBQWIsRUFBa0IsVUFBQ0MsTUFBRCxFQUFTQyxLQUFULEVBQW1CO0FBQ25ELFdBQU87QUFDTEQsb0JBREs7QUFFTEUsZ0JBQVVULFVBRkw7QUFHTFUsZUFBU1QsZUFISjtBQUlMVSxZQUFNLElBQUlDLElBQUosR0FBV0MsT0FBWCxLQUF1QixJQUp4QjtBQUtMQyxZQUFPWCxpQkFBaUJBLGNBQWNLLEtBQWQsQ0FBbEIsR0FDRkwsY0FBY0ssS0FBZCxDQURFLEdBRUY7QUFQQyxLQUFQO0FBU0QsR0FWZSxFQVViTixpQkFWYSxDQUFoQjtBQVdBLFNBQU9FLFNBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTVyxx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YUFBekMsQ0FKTzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTdCWDtBQUFQO0FBUGE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUE0Q2JZLGFBQUdjLFVBQUgsQ0FBYyxxQ0FBZDs7QUE1Q2E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibXV0YXRpb25zLmNxcnMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuZnVuY3Rpb24gZGVidWcgKCkge1xuICBjb25zb2xlLmxvZygnXFx1MDAxYlsxOzMzbScgK1xuICAgICc8U3RhdGUgTXV0YXRpb25zPicgK1xuICAgICdcXHUwMDFiWzBtJylcbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKVxufVxuLy8gdmFyIGNoZWNrTnVsbElkID0gZnVuY3Rpb24gY2hlY2tOdWxsSWQgKGluc3RhbmNlKSB7XG4vLyAgIGlmICghaW5zdGFuY2UuX2lkKSB7XG4vLyAgICAgZGVsZXRlIGluc3RhbmNlLl9pZFxuLy8gICB9XG4vLyAgIHJldHVybiBpbnN0YW5jZVxuLy8gfVxuXG5mdW5jdGlvbiBjcmVhdGVJdGVtc011dGF0aW9uIChtdXRhdGlvbklkLCBtdXRhdGlvblZlcnNpb24sIG11dGF0aW9uc0l0ZW1zSWRzLCBtdXRhdGlvbnNBcmdzKSB7XG4gIHZhciBtdXRhdGlvbnMgPSBSLmFkZEluZGV4KFIubWFwKSgoaXRlbUlkLCBpbmRleCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtSWQsXG4gICAgICBtdXRhdGlvbjogbXV0YXRpb25JZCxcbiAgICAgIHZlcnNpb246IG11dGF0aW9uVmVyc2lvbixcbiAgICAgIHRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCxcbiAgICAgIGRhdGE6IChtdXRhdGlvbnNBcmdzICYmIG11dGF0aW9uc0FyZ3NbaW5kZXhdKVxuICAgICAgICA/IG11dGF0aW9uc0FyZ3NbaW5kZXhdXG4gICAgICAgIDoge31cbiAgICB9XG4gIH0sIG11dGF0aW9uc0l0ZW1zSWRzKVxuICByZXR1cm4gbXV0YXRpb25zXG59XG5cbi8vIGZ1bmN0aW9uIGFwcGx5TXV0YXRpb25zIChtdXRhdGlvbnNGdW5jdGlvbnMsIG11dGF0aW9ucywgc3RhdGVzKSB7XG4vLyAgIGRlYnVnKCdhcHBseU11dGF0aW9ucycsIG11dGF0aW9uc0Z1bmN0aW9ucywgbXV0YXRpb25zLCBzdGF0ZXMpXG4vLyAgIHN0YXRlcyA9IHN0YXRlcyB8fCB7fVxuLy8gICB2YXIgbXV0YXRpb25zQnlJdGVtID0gUi5ncm91cEJ5KFIucHJvcCgnaXRlbUlkJyksIG11dGF0aW9ucylcbi8vICAgdmFyIHN0YXRlc0J5SXRlbSA9IFIuemlwT2JqKFIubWFwKFIucHJvcCgnaXRlbUlkJywgc3RhdGVzKSksIHN0YXRlcylcbi8vICAgZm9yIChsZXQgaXRlbUlkIGluIG11dGF0aW9uc0J5SXRlbSkge1xuLy8gICAgIGZvciAobGV0IG11dGF0aW9uIG9mIG11dGF0aW9uc0J5SXRlbVtpdGVtSWRdKSB7XG4vLyAgICAgICBzdGF0ZXNCeUl0ZW1baXRlbUlkXSA9IG11dGF0aW9uc0Z1bmN0aW9uc1ttdXRhdGlvbi5tdXRhdGlvbl1bbXV0YXRpb24udmVyc2lvbl0oc3RhdGVzQnlJdGVtW2l0ZW1JZF0gfHwge30sIG11dGF0aW9uLmRhdGEpXG4vLyAgICAgfVxuLy8gICB9XG4vLyAgIGRlYnVnKCdhcHBsaWVkTXV0YXRpb25zJywgc3RhdGVzQnlJdGVtKVxuLy8gICByZXR1cm4gUi52YWx1ZXMoc3RhdGVzQnlJdGVtKVxuLy8gfVxuXG5mdW5jdGlvbiBnZXRNdXRhdGlvbnNGdW5jdGlvbnMgKGJhc2VQYXRoKSB7XG4gIHZhciBmaWxlc0pzTm9FeHRlbnNpb24gPSBSLm1hcChSLmNvbXBvc2UoUi5yZXBsYWNlKCcuanMnLCAnJyksIHBhdGguYmFzZW5hbWUpLCBSLmZpbHRlcigoZmlsZSkgPT4gcGF0aC5leHRuYW1lKGZpbGUpID09PSAnLmpzJywgZnMucmVhZGRpclN5bmMoYmFzZVBhdGgpKSlcbiAgdmFyIHNwbGl0RmlsZXMgPSBSLm1hcChSLnNwbGl0KCcuJykpXG4gIHZhciBzb3J0RmlsZXMgPSBSLmNvbXBvc2UoUi5yZXZlcnNlLCBSLnNvcnRCeShSLmNvbXBvc2UocGFyc2VJbnQsIFIucHJvcCgwKSkpKVxuICB2YXIgZ3JvdXBGaWxlcyA9IFIuZ3JvdXBCeShSLnByb3AoMCkpXG4gIHZhciBhZGRGdW5jdGlvbiA9IFIubWFwKFIubWFwKChlbGVtZW50KSA9PiB7XG4gICAgcmV0dXJuIHttdXRhdGlvbklkOiBlbGVtZW50WzBdLCBtdXRhdGlvblZlcnNpb246IGVsZW1lbnRbMV19XG4gIH0pKVxuICB2YXIgbXV0YXRpb25zRnVuY3Rpb25zID0gUi5jb21wb3NlKGFkZEZ1bmN0aW9uLCBncm91cEZpbGVzLCBzb3J0RmlsZXMsIHNwbGl0RmlsZXMpKGZpbGVzSnNOb0V4dGVuc2lvbilcbiAgLy8gZGVidWcoJ2dldE11dGF0aW9uc0Z1bmN0aW9ucycsIG11dGF0aW9uc0Z1bmN0aW9ucylcbiAgcmV0dXJuIG11dGF0aW9uc0Z1bmN0aW9uc1xufVxuXG5mdW5jdGlvbiBhcHBseU11dGF0aW9uc0Zyb21QYXRoIChzdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRoKSB7XG4gIHN0YXRlID0gUi5jbG9uZShzdGF0ZSlcbiAgZnVuY3Rpb24gYXBwbHlNdXRhdGlvbiAoc3RhdGUsIG11dGF0aW9uKSB7XG4gICAgLy8gY29uc29sZS5sb2coYGFwcGx5TXV0YXRpb25zRnJvbVBhdGggJHttdXRhdGlvbi5tdXRhdGlvbn0uJHttdXRhdGlvbi52ZXJzaW9ufS5qc2ApXG4gICAgdmFyIG11dGF0aW9uRmlsZSA9IHBhdGguam9pbihtdXRhdGlvbnNQYXRoLCBgJHttdXRhdGlvbi5tdXRhdGlvbn0uJHttdXRhdGlvbi52ZXJzaW9ufS5qc2ApXG4gICAgcmV0dXJuIHJlcXVpcmUobXV0YXRpb25GaWxlKShzdGF0ZSwgbXV0YXRpb24uZGF0YSlcbiAgfVxuICByZXR1cm4gUi5yZWR1Y2UoYXBwbHlNdXRhdGlvbiwgc3RhdGUsIG11dGF0aW9ucylcbn1cblxuZnVuY3Rpb24gY2hlY2tNdXRhdGlvbkZ1bmN0aW9uIChtdXRhdGlvbklkLCBtdXRhdGlvbnNGdW5jdGlvbnMpIHtcbiAgaWYgKCFtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25JZF0gfHwgIW11dGF0aW9uc0Z1bmN0aW9uc1ttdXRhdGlvbklkXVswXSkge1xuICAgIHRocm93IG5ldyBFcnJvcignbXV0YXRpb24gbm9uIGRlZmluaXRhJylcbiAgfVxufVxuXG4vLyBmdW5jdGlvbiBnZXRGdW5jdGlvbnMgKGJhc2VQYXRoLCBmaWx0ZXJCeU11dGF0aW9uSWQsIGZpbHRlckJ5VmVyc2lvbikge1xuLy8gICB2YXIgdmVyc2lvbnMgPSBnZXRWZXJzaW9ucyhiYXNlUGF0aClcbi8vICAgaWYgKGZpbHRlckJ5TXV0YXRpb25JZCkge1xuLy8gICAgIHZlcnNpb25zID0ge1xuLy8gICAgICAgW2ZpbHRlckJ5TXV0YXRpb25JZF06IHZlcnNpb25zW2ZpbHRlckJ5TXV0YXRpb25JZF1cbi8vICAgICB9XG4vLyAgIH1cbi8vICAgaWYgKGZpbHRlckJ5VmVyc2lvbikge1xuLy8gICAgIHZlcnNpb25zW2ZpbHRlckJ5TXV0YXRpb25JZF0gPSBbZmlsdGVyQnlWZXJzaW9uXVxuLy8gICB9XG4vLyAgIHZhciBtdXRhdGlvbnNGdW5jdGlvbnMgPSBSLm1hcE9iakluZGV4ZWQoKHZhbCwgbXVOYW1lLCBvYmopID0+IFIuemlwT2JqKHZhbCwgUi5tYXAoKG11VmVycykgPT4gcmVxdWlyZShgJHtiYXNlUGF0aH0vJHttdU5hbWV9LiR7bXVWZXJzfWApLCB2YWwpKSwgdmVyc2lvbnMpXG4vLyAgIGRlYnVnKCdnZXRGdW5jdGlvbnMnLCBtdXRhdGlvbnNGdW5jdGlvbnMpXG4vLyAgIHJldHVybiBtdXRhdGlvbnNGdW5jdGlvbnNcbi8vIH1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBnZXRNdXRhdGlvbnNDcXJzUGFja2FnZSAoQ09ORklHLCBESSkge1xuICB0cnkge1xuICAgIGNvbnN0IFBBQ0tBR0UgPSAnbXV0YXRpb25zLmNxcnMnXG4gICAgY29uc3QgZ2V0VmFsdWVQcm9taXNlID0gcmVxdWlyZSgnLi9qZXN1cycpLmdldFZhbHVlUHJvbWlzZVxuICAgIGNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuICAgIENPTkZJRyA9IGNoZWNrUmVxdWlyZWQoQ09ORklHLCBbJ211dGF0aW9uc1BhdGgnXSwgUEFDS0FHRSlcbiAgICBESSA9IGNoZWNrUmVxdWlyZWQoREksIFsnbXV0YXRpb25zU3RvcmFnZVBhY2thZ2UnLCAnZXJyb3InLCAnbG9nJywgJ2RlYnVnJ10sIFBBQ0tBR0UpXG4gICAgcmV0dXJuIHtcbiAgICAgIG11dGF0ZTogYXN5bmMgZnVuY3Rpb24gbXV0YXRlICh7bXV0YXRpb24sIGl0ZW1zSWRzLCBpdGVtc30pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgY29uZmlnTXV0YXRpb25zUGF0aCA9IGF3YWl0IGdldFZhbHVlUHJvbWlzZShDT05GSUcubXV0YXRpb25zUGF0aClcbiAgICAgICAgICB2YXIgbXV0YXRpb25zRnVuY3Rpb25zID0gZ2V0TXV0YXRpb25zRnVuY3Rpb25zKGNvbmZpZ011dGF0aW9uc1BhdGgpXG4gICAgICAgICAgY2hlY2tNdXRhdGlvbkZ1bmN0aW9uKG11dGF0aW9uLCBtdXRhdGlvbnNGdW5jdGlvbnMpXG4gICAgICAgICAgdmFyIGxhc3RNdXRhdGlvblZlcnNpb24gPSBtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25dWzBdLm11dGF0aW9uVmVyc2lvblxuICAgICAgICAgIC8vIERJLmRlYnVnKHttc2c6ICdjcmVhdGVJdGVtc011dGF0aW9ucycsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7bXV0YXRpb24sIGxhc3RNdXRhdGlvblZlcnNpb24sIGl0ZW1zSWRzLCBpdGVtc319KVxuXG4gICAgICAgICAgdmFyIGl0ZW1zU2luZ2xlTXV0YXRpb24gPSBjcmVhdGVJdGVtc011dGF0aW9uKG11dGF0aW9uLCBsYXN0TXV0YXRpb25WZXJzaW9uLCBpdGVtc0lkcywgaXRlbXMpXG4gICAgICAgICAgREkuZGVidWcoe21zZzogJ2l0ZW1zU2luZ2xlTXV0YXRpb24gdG8gY3JlYXRlJywgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHttdXRhdGlvbiwgbGFzdE11dGF0aW9uVmVyc2lvbiwgaXRlbXNJZHMsIGl0ZW1zLCBpdGVtc1NpbmdsZU11dGF0aW9ufX0pXG4gICAgICAgICAgYXdhaXQgREkubXV0YXRpb25zU3RvcmFnZVBhY2thZ2UuaW5zZXJ0KHtpdGVtczogaXRlbXNTaW5nbGVNdXRhdGlvbn0pXG4gICAgICAgICAgcmV0dXJuIGl0ZW1zU2luZ2xlTXV0YXRpb25cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBESS50aHJvd0Vycm9yKFBBQ0tBR0UgKyAnIG11dGF0ZShhcmdzKSBFcnJvcicsIGVycm9yLCB7bXV0YXRpb24sIGl0ZW1zSWRzLCBpdGVtc30pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBnZXRJdGVtTXV0YXRpb25zOiBhc3luYyBmdW5jdGlvbiBnZXRJdGVtTXV0YXRpb25zICh7aXRlbUlkLCBtaW5UaW1lc3RhbXAgPSAwfSkge1xuICAgICAgICAvLyBUTyBGSVhcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBhd2FpdCBESS5tdXRhdGlvbnNTdG9yYWdlUGFja2FnZS5maW5kKHtcbiAgICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgaXRlbUlkOiBpdGVtSWQsXG4gICAgICAgICAgICAvL3RpbWVzdGFtcDogeyRndGU6IG1pblRpbWVzdGFtcH0vLyBUTyBGSVhcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNvcnQ6IHt0aW1lc3RhbXA6IDF9XG4gICAgICAgIH0pXG4gICAgICAgIERJLmRlYnVnKHttc2c6ICdnZXRJdGVtTXV0YXRpb25zJywgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtpdGVtSWQsIG1pblRpbWVzdGFtcCwgcmVzdWx0c319KVxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfSxcbiAgICAgIGFwcGx5TXV0YXRpb25zOiBhc3luYyBmdW5jdGlvbiBhcHBseU11dGF0aW9ucyAoe3N0YXRlLCBtdXRhdGlvbnN9KSB7XG4gICAgICAgIHZhciBtdXRhdGlvbnNQYXRoID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5tdXRhdGlvbnNQYXRoKVxuXG4gICAgICAgIERJLmRlYnVnKHttc2c6ICdhcHBseU11dGF0aW9uc0Zyb21QYXRoJywgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtzdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRofX0pXG4gICAgICAgIHJldHVybiBhcHBseU11dGF0aW9uc0Zyb21QYXRoKHN0YXRlLCBtdXRhdGlvbnMsIG11dGF0aW9uc1BhdGgpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIERJLnRocm93RXJyb3IoJ2dldE11dGF0aW9uc0NxcnNQYWNrYWdlKENPTkZJRywgREkpJywgZXJyb3IpXG4gIH1cbn1cbiJdfQ==