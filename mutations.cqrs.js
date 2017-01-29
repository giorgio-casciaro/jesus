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

function createItemsMutations(mutationId, mutationVersion, mutationsitemsIds, mutationsArgs) {
  // debug('createItemsMutations', mutationId, mutationVersion, items)
  var mutations = R.addIndex(R.map)(function (itemId, index) {
    return {
      itemId: itemId,
      mutation: mutationId,
      version: mutationVersion,
      time: new Date().getTime() / 1000,
      data: mutationsArgs && mutationsArgs[index] ? mutationsArgs[index] : {}
    };
  }, mutationsitemsIds);
  return mutations;
}

// function applyMutations (mutationsFunctions, mutations, states) {
//   debug('applyMutations', mutationsFunctions, mutations, states)
//   states = states || {}
//   var mutationsByEntity = R.groupBy(R.prop('itemId'), mutations)
//   var statesByEntity = R.zipObj(R.map(R.prop('itemId', states)), states)
//   for (let itemId in mutationsByEntity) {
//     for (let mutation of mutationsByEntity[itemId]) {
//       statesByEntity[itemId] = mutationsFunctions[mutation.mutation][mutation.version](statesByEntity[itemId] || {}, mutation.data)
//     }
//   }
//   debug('appliedMutations', statesByEntity)
//   return R.values(statesByEntity)
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

  return regeneratorRuntime.async(function getMutationsCqrsPackage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;

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
                  var configMutationsPath, mutationsFunctions, lastMutationVersion, itemsMutations;
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
                          itemsMutations = createItemsMutations(mutation, lastMutationVersion, itemsIds, items);

                          DI.debug({ msg: 'itemsMutations to create', context: PACKAGE, debug: { mutation: mutation, lastMutationVersion: lastMutationVersion, itemsIds: itemsIds, items: items, itemsMutations: itemsMutations } });
                          _context.next = 11;
                          return regeneratorRuntime.awrap(DI.mutationsStoragePackage.insert({ items: itemsMutations }));

                        case 11:
                          return _context.abrupt('return', itemsMutations);

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
                getEntityMutations: function getEntityMutations(_ref2) {
                  var itemId = _ref2.itemId,
                      minTimestamp = _ref2.minTimestamp;

                  return DI.mutationsStoragePackage.find({
                    itemId: itemId,
                    timestamp: {
                      $gte: minTimestamp || 0
                    }
                  }, { timestamp: 1 });
                },
                applyMutations: function applyMutations(_ref3) {
                  var state = _ref3.state,
                      mutations = _ref3.mutations;
                  var mutationsPath;
                  return regeneratorRuntime.async(function applyMutations$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return regeneratorRuntime.awrap(getValuePromise(CONFIG.mutationsPath));

                        case 2:
                          mutationsPath = _context2.sent;
                          return _context2.abrupt('return', applyMutationsFromPath(state, mutations, mutationsPath));

                        case 4:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, null, this);
                }
              }
            };
          }();

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt('return', _ret.v);

        case 4:
          _context3.next = 9;
          break;

        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3['catch'](0);

          DI.throwError('getMutationsCqrsPackage(CONFIG, DI)', _context3.t0);

        case 9:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this, [[0, 6]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11dGF0aW9ucy5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsInBhdGgiLCJmcyIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsImFwcGx5IiwiYXJndW1lbnRzIiwiY3JlYXRlSXRlbXNNdXRhdGlvbnMiLCJtdXRhdGlvbklkIiwibXV0YXRpb25WZXJzaW9uIiwibXV0YXRpb25zaXRlbXNJZHMiLCJtdXRhdGlvbnNBcmdzIiwibXV0YXRpb25zIiwiYWRkSW5kZXgiLCJtYXAiLCJpdGVtSWQiLCJpbmRleCIsIm11dGF0aW9uIiwidmVyc2lvbiIsInRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsImRhdGEiLCJnZXRNdXRhdGlvbnNGdW5jdGlvbnMiLCJiYXNlUGF0aCIsImZpbGVzSnNOb0V4dGVuc2lvbiIsImNvbXBvc2UiLCJyZXBsYWNlIiwiYmFzZW5hbWUiLCJmaWx0ZXIiLCJmaWxlIiwiZXh0bmFtZSIsInJlYWRkaXJTeW5jIiwic3BsaXRGaWxlcyIsInNwbGl0Iiwic29ydEZpbGVzIiwicmV2ZXJzZSIsInNvcnRCeSIsInBhcnNlSW50IiwicHJvcCIsImdyb3VwRmlsZXMiLCJncm91cEJ5IiwiYWRkRnVuY3Rpb24iLCJlbGVtZW50IiwibXV0YXRpb25zRnVuY3Rpb25zIiwiYXBwbHlNdXRhdGlvbnNGcm9tUGF0aCIsInN0YXRlIiwibXV0YXRpb25zUGF0aCIsImNsb25lIiwiYXBwbHlNdXRhdGlvbiIsIm11dGF0aW9uRmlsZSIsImpvaW4iLCJyZWR1Y2UiLCJjaGVja011dGF0aW9uRnVuY3Rpb24iLCJFcnJvciIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRNdXRhdGlvbnNDcXJzUGFja2FnZSIsIkNPTkZJRyIsIkRJIiwiUEFDS0FHRSIsImdldFZhbHVlUHJvbWlzZSIsImNoZWNrUmVxdWlyZWQiLCJtdXRhdGUiLCJpdGVtc0lkcyIsIml0ZW1zIiwiY29uZmlnTXV0YXRpb25zUGF0aCIsImxhc3RNdXRhdGlvblZlcnNpb24iLCJpdGVtc011dGF0aW9ucyIsIm1zZyIsImNvbnRleHQiLCJtdXRhdGlvbnNTdG9yYWdlUGFja2FnZSIsImluc2VydCIsInRocm93RXJyb3IiLCJnZXRFbnRpdHlNdXRhdGlvbnMiLCJtaW5UaW1lc3RhbXAiLCJmaW5kIiwidGltZXN0YW1wIiwiJGd0ZSIsImFwcGx5TXV0YXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlFLEtBQUtGLFFBQVEsSUFBUixDQUFUO0FBQ0EsU0FBU0csS0FBVCxHQUFrQjtBQUNoQkMsVUFBUUMsR0FBUixDQUFZLGVBQ1YsbUJBRFUsR0FFVixTQUZGO0FBR0FELFVBQVFDLEdBQVIsQ0FBWUMsS0FBWixDQUFrQkYsT0FBbEIsRUFBMkJHLFNBQTNCO0FBQ0Q7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBU0Msb0JBQVQsQ0FBK0JDLFVBQS9CLEVBQTJDQyxlQUEzQyxFQUE0REMsaUJBQTVELEVBQStFQyxhQUEvRSxFQUE4RjtBQUM1RjtBQUNBLE1BQUlDLFlBQVlkLEVBQUVlLFFBQUYsQ0FBV2YsRUFBRWdCLEdBQWIsRUFBa0IsVUFBQ0MsTUFBRCxFQUFTQyxLQUFULEVBQW1CO0FBQ25ELFdBQU87QUFDTEQsb0JBREs7QUFFTEUsZ0JBQVVULFVBRkw7QUFHTFUsZUFBU1QsZUFISjtBQUlMVSxZQUFNLElBQUlDLElBQUosR0FBV0MsT0FBWCxLQUF1QixJQUp4QjtBQUtMQyxZQUFPWCxpQkFBaUJBLGNBQWNLLEtBQWQsQ0FBbEIsR0FDRkwsY0FBY0ssS0FBZCxDQURFLEdBRUY7QUFQQyxLQUFQO0FBU0QsR0FWZSxFQVViTixpQkFWYSxDQUFoQjtBQVdBLFNBQU9FLFNBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTVyxxQkFBVCxDQUFnQ0MsUUFB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OztBQVhJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURIO0FBZUxTLG9DQUFvQixTQUFTQSxrQkFBVCxRQUFxRDtBQUFBLHNCQUF2QjNELE1BQXVCLFNBQXZCQSxNQUF1QjtBQUFBLHNCQUFmNEQsWUFBZSxTQUFmQSxZQUFlOztBQUN2RSx5QkFBT2hCLEdBQUdZLHVCQUFILENBQTJCSyxJQUEzQixDQUFnQztBQUNyQzdELDRCQUFRQSxNQUQ2QjtBQUVyQzhELCtCQUFXO0FBQ1RDLDRCQUFNSCxnQkFBZ0I7QUFEYjtBQUYwQixtQkFBaEMsRUFLSixFQUFDRSxXQUFXLENBQVosRUFMSSxDQUFQO0FBTUQsaUJBdEJJO0FBdUJMRSxnQ0FBZ0IsU0FBZUEsY0FBZjtBQUFBLHNCQUFnQ2pDLEtBQWhDLFNBQWdDQSxLQUFoQztBQUFBLHNCQUF1Q2xDLFNBQXZDLFNBQXVDQSxTQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDBEQUNZaUQsZ0JBQWdCSCxPQUFPWCxhQUF2QixDQURaOztBQUFBO0FBQ1ZBLHVDQURVO0FBQUEsNERBRVBGLHVCQUF1QkMsS0FBdkIsRUFBOEJsQyxTQUE5QixFQUF5Q21DLGFBQXpDLENBRk87O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF2Qlg7QUFBUDtBQVBhOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBb0NiWSxhQUFHYyxVQUFILENBQWMscUNBQWQ7O0FBcENhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6Im11dGF0aW9ucy5jcXJzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbmZ1bmN0aW9uIGRlYnVnICgpIHtcbiAgY29uc29sZS5sb2coJ1xcdTAwMWJbMTszM20nICtcbiAgICAnPFN0YXRlIE11dGF0aW9ucz4nICtcbiAgICAnXFx1MDAxYlswbScpXG4gIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcbn1cbi8vIHZhciBjaGVja051bGxJZCA9IGZ1bmN0aW9uIGNoZWNrTnVsbElkIChpbnN0YW5jZSkge1xuLy8gICBpZiAoIWluc3RhbmNlLl9pZCkge1xuLy8gICAgIGRlbGV0ZSBpbnN0YW5jZS5faWRcbi8vICAgfVxuLy8gICByZXR1cm4gaW5zdGFuY2Vcbi8vIH1cblxuZnVuY3Rpb24gY3JlYXRlSXRlbXNNdXRhdGlvbnMgKG11dGF0aW9uSWQsIG11dGF0aW9uVmVyc2lvbiwgbXV0YXRpb25zaXRlbXNJZHMsIG11dGF0aW9uc0FyZ3MpIHtcbiAgLy8gZGVidWcoJ2NyZWF0ZUl0ZW1zTXV0YXRpb25zJywgbXV0YXRpb25JZCwgbXV0YXRpb25WZXJzaW9uLCBpdGVtcylcbiAgdmFyIG11dGF0aW9ucyA9IFIuYWRkSW5kZXgoUi5tYXApKChpdGVtSWQsIGluZGV4KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1JZCxcbiAgICAgIG11dGF0aW9uOiBtdXRhdGlvbklkLFxuICAgICAgdmVyc2lvbjogbXV0YXRpb25WZXJzaW9uLFxuICAgICAgdGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwLFxuICAgICAgZGF0YTogKG11dGF0aW9uc0FyZ3MgJiYgbXV0YXRpb25zQXJnc1tpbmRleF0pXG4gICAgICAgID8gbXV0YXRpb25zQXJnc1tpbmRleF1cbiAgICAgICAgOiB7fVxuICAgIH1cbiAgfSwgbXV0YXRpb25zaXRlbXNJZHMpXG4gIHJldHVybiBtdXRhdGlvbnNcbn1cblxuLy8gZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnMgKG11dGF0aW9uc0Z1bmN0aW9ucywgbXV0YXRpb25zLCBzdGF0ZXMpIHtcbi8vICAgZGVidWcoJ2FwcGx5TXV0YXRpb25zJywgbXV0YXRpb25zRnVuY3Rpb25zLCBtdXRhdGlvbnMsIHN0YXRlcylcbi8vICAgc3RhdGVzID0gc3RhdGVzIHx8IHt9XG4vLyAgIHZhciBtdXRhdGlvbnNCeUVudGl0eSA9IFIuZ3JvdXBCeShSLnByb3AoJ2l0ZW1JZCcpLCBtdXRhdGlvbnMpXG4vLyAgIHZhciBzdGF0ZXNCeUVudGl0eSA9IFIuemlwT2JqKFIubWFwKFIucHJvcCgnaXRlbUlkJywgc3RhdGVzKSksIHN0YXRlcylcbi8vICAgZm9yIChsZXQgaXRlbUlkIGluIG11dGF0aW9uc0J5RW50aXR5KSB7XG4vLyAgICAgZm9yIChsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zQnlFbnRpdHlbaXRlbUlkXSkge1xuLy8gICAgICAgc3RhdGVzQnlFbnRpdHlbaXRlbUlkXSA9IG11dGF0aW9uc0Z1bmN0aW9uc1ttdXRhdGlvbi5tdXRhdGlvbl1bbXV0YXRpb24udmVyc2lvbl0oc3RhdGVzQnlFbnRpdHlbaXRlbUlkXSB8fCB7fSwgbXV0YXRpb24uZGF0YSlcbi8vICAgICB9XG4vLyAgIH1cbi8vICAgZGVidWcoJ2FwcGxpZWRNdXRhdGlvbnMnLCBzdGF0ZXNCeUVudGl0eSlcbi8vICAgcmV0dXJuIFIudmFsdWVzKHN0YXRlc0J5RW50aXR5KVxuLy8gfVxuXG5mdW5jdGlvbiBnZXRNdXRhdGlvbnNGdW5jdGlvbnMgKGJhc2VQYXRoKSB7XG4gIHZhciBmaWxlc0pzTm9FeHRlbnNpb24gPSBSLm1hcChSLmNvbXBvc2UoUi5yZXBsYWNlKCcuanMnLCAnJyksIHBhdGguYmFzZW5hbWUpLCBSLmZpbHRlcigoZmlsZSkgPT4gcGF0aC5leHRuYW1lKGZpbGUpID09PSAnLmpzJywgZnMucmVhZGRpclN5bmMoYmFzZVBhdGgpKSlcbiAgdmFyIHNwbGl0RmlsZXMgPSBSLm1hcChSLnNwbGl0KCcuJykpXG4gIHZhciBzb3J0RmlsZXMgPSBSLmNvbXBvc2UoUi5yZXZlcnNlLCBSLnNvcnRCeShSLmNvbXBvc2UocGFyc2VJbnQsIFIucHJvcCgwKSkpKVxuICB2YXIgZ3JvdXBGaWxlcyA9IFIuZ3JvdXBCeShSLnByb3AoMCkpXG4gIHZhciBhZGRGdW5jdGlvbiA9IFIubWFwKFIubWFwKChlbGVtZW50KSA9PiB7XG4gICAgcmV0dXJuIHttdXRhdGlvbklkOiBlbGVtZW50WzBdLCBtdXRhdGlvblZlcnNpb246IGVsZW1lbnRbMV19XG4gIH0pKVxuICB2YXIgbXV0YXRpb25zRnVuY3Rpb25zID0gUi5jb21wb3NlKGFkZEZ1bmN0aW9uLCBncm91cEZpbGVzLCBzb3J0RmlsZXMsIHNwbGl0RmlsZXMpKGZpbGVzSnNOb0V4dGVuc2lvbilcbiAgLy8gZGVidWcoJ2dldE11dGF0aW9uc0Z1bmN0aW9ucycsIG11dGF0aW9uc0Z1bmN0aW9ucylcbiAgcmV0dXJuIG11dGF0aW9uc0Z1bmN0aW9uc1xufVxuXG5mdW5jdGlvbiBhcHBseU11dGF0aW9uc0Zyb21QYXRoIChzdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRoKSB7XG4gIHN0YXRlID0gUi5jbG9uZShzdGF0ZSlcbiAgZnVuY3Rpb24gYXBwbHlNdXRhdGlvbiAoc3RhdGUsIG11dGF0aW9uKSB7XG4gICAgdmFyIG11dGF0aW9uRmlsZT1wYXRoLmpvaW4obXV0YXRpb25zUGF0aCwgYCR7bXV0YXRpb24ubXV0YXRpb259LiR7bXV0YXRpb24udmVyc2lvbn0uanNgKVxuICAgIHJldHVybiByZXF1aXJlKG11dGF0aW9uRmlsZSkoc3RhdGUsIG11dGF0aW9uLmRhdGEpXG4gIH1cbiAgcmV0dXJuIFIucmVkdWNlKGFwcGx5TXV0YXRpb24sIHN0YXRlLCBtdXRhdGlvbnMpXG59XG5cbmZ1bmN0aW9uIGNoZWNrTXV0YXRpb25GdW5jdGlvbiAobXV0YXRpb25JZCwgbXV0YXRpb25zRnVuY3Rpb25zKSB7XG4gIGlmICghbXV0YXRpb25zRnVuY3Rpb25zW211dGF0aW9uSWRdIHx8ICFtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25JZF1bMF0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ211dGF0aW9uIG5vbiBkZWZpbml0YScpXG4gIH1cbn1cblxuLy8gZnVuY3Rpb24gZ2V0RnVuY3Rpb25zIChiYXNlUGF0aCwgZmlsdGVyQnlNdXRhdGlvbklkLCBmaWx0ZXJCeVZlcnNpb24pIHtcbi8vICAgdmFyIHZlcnNpb25zID0gZ2V0VmVyc2lvbnMoYmFzZVBhdGgpXG4vLyAgIGlmIChmaWx0ZXJCeU11dGF0aW9uSWQpIHtcbi8vICAgICB2ZXJzaW9ucyA9IHtcbi8vICAgICAgIFtmaWx0ZXJCeU11dGF0aW9uSWRdOiB2ZXJzaW9uc1tmaWx0ZXJCeU11dGF0aW9uSWRdXG4vLyAgICAgfVxuLy8gICB9XG4vLyAgIGlmIChmaWx0ZXJCeVZlcnNpb24pIHtcbi8vICAgICB2ZXJzaW9uc1tmaWx0ZXJCeU11dGF0aW9uSWRdID0gW2ZpbHRlckJ5VmVyc2lvbl1cbi8vICAgfVxuLy8gICB2YXIgbXV0YXRpb25zRnVuY3Rpb25zID0gUi5tYXBPYmpJbmRleGVkKCh2YWwsIG11TmFtZSwgb2JqKSA9PiBSLnppcE9iaih2YWwsIFIubWFwKChtdVZlcnMpID0+IHJlcXVpcmUoYCR7YmFzZVBhdGh9LyR7bXVOYW1lfS4ke211VmVyc31gKSwgdmFsKSksIHZlcnNpb25zKVxuLy8gICBkZWJ1ZygnZ2V0RnVuY3Rpb25zJywgbXV0YXRpb25zRnVuY3Rpb25zKVxuLy8gICByZXR1cm4gbXV0YXRpb25zRnVuY3Rpb25zXG4vLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UgKENPTkZJRywgREkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBQQUNLQUdFID0gJ211dGF0aW9ucy5jcXJzJ1xuICAgIGNvbnN0IGdldFZhbHVlUHJvbWlzZSA9IHJlcXVpcmUoJy4vamVzdXMnKS5nZXRWYWx1ZVByb21pc2VcbiAgICBjb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbiAgICBDT05GSUcgPSBjaGVja1JlcXVpcmVkKENPTkZJRywgWydtdXRhdGlvbnNQYXRoJ10sIFBBQ0tBR0UpXG4gICAgREkgPSBjaGVja1JlcXVpcmVkKERJLCBbJ211dGF0aW9uc1N0b3JhZ2VQYWNrYWdlJywnZXJyb3InLCAnbG9nJywgJ2RlYnVnJ10sIFBBQ0tBR0UpXG4gICAgcmV0dXJuIHtcbiAgICAgIG11dGF0ZTogYXN5bmMgZnVuY3Rpb24gbXV0YXRlICh7bXV0YXRpb24sIGl0ZW1zSWRzLCBpdGVtc30pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgY29uZmlnTXV0YXRpb25zUGF0aCA9IGF3YWl0IGdldFZhbHVlUHJvbWlzZShDT05GSUcubXV0YXRpb25zUGF0aClcbiAgICAgICAgICB2YXIgbXV0YXRpb25zRnVuY3Rpb25zID0gZ2V0TXV0YXRpb25zRnVuY3Rpb25zKGNvbmZpZ011dGF0aW9uc1BhdGgpXG4gICAgICAgICAgY2hlY2tNdXRhdGlvbkZ1bmN0aW9uKG11dGF0aW9uLCBtdXRhdGlvbnNGdW5jdGlvbnMpXG4gICAgICAgICAgdmFyIGxhc3RNdXRhdGlvblZlcnNpb24gPSBtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25dWzBdLm11dGF0aW9uVmVyc2lvblxuICAgICAgICAgIHZhciBpdGVtc011dGF0aW9ucyA9IGNyZWF0ZUl0ZW1zTXV0YXRpb25zKG11dGF0aW9uLCBsYXN0TXV0YXRpb25WZXJzaW9uLCBpdGVtc0lkcywgaXRlbXMpXG4gICAgICAgICAgREkuZGVidWcoe21zZzogJ2l0ZW1zTXV0YXRpb25zIHRvIGNyZWF0ZScsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7bXV0YXRpb24sIGxhc3RNdXRhdGlvblZlcnNpb24sIGl0ZW1zSWRzLCBpdGVtcywgaXRlbXNNdXRhdGlvbnN9fSlcbiAgICAgICAgICBhd2FpdCBESS5tdXRhdGlvbnNTdG9yYWdlUGFja2FnZS5pbnNlcnQoe2l0ZW1zOiBpdGVtc011dGF0aW9uc30pXG4gICAgICAgICAgcmV0dXJuIGl0ZW1zTXV0YXRpb25zXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgREkudGhyb3dFcnJvcihQQUNLQUdFICsgJyBtdXRhdGUoYXJncykgRXJyb3InLCBlcnJvciwge211dGF0aW9uLCBpdGVtc0lkcywgaXRlbXN9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZ2V0RW50aXR5TXV0YXRpb25zOiBmdW5jdGlvbiBnZXRFbnRpdHlNdXRhdGlvbnMgKHtpdGVtSWQsIG1pblRpbWVzdGFtcH0pIHtcbiAgICAgICAgcmV0dXJuIERJLm11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlLmZpbmQoe1xuICAgICAgICAgIGl0ZW1JZDogaXRlbUlkLFxuICAgICAgICAgIHRpbWVzdGFtcDoge1xuICAgICAgICAgICAgJGd0ZTogbWluVGltZXN0YW1wIHx8IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHt0aW1lc3RhbXA6IDF9KVxuICAgICAgfSxcbiAgICAgIGFwcGx5TXV0YXRpb25zOiBhc3luYyBmdW5jdGlvbiBhcHBseU11dGF0aW9ucyAoe3N0YXRlLCBtdXRhdGlvbnN9KSB7XG4gICAgICAgIHZhciBtdXRhdGlvbnNQYXRoID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5tdXRhdGlvbnNQYXRoKVxuICAgICAgICByZXR1cm4gYXBwbHlNdXRhdGlvbnNGcm9tUGF0aChzdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRoKVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBESS50aHJvd0Vycm9yKCdnZXRNdXRhdGlvbnNDcXJzUGFja2FnZShDT05GSUcsIERJKScsIGVycm9yKVxuICB9XG59XG4iXX0=