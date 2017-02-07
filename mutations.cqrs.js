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
      timestamp: new Date().getTime() / 1000,
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
  var applyMutationsFromPath, _ret;

  return regeneratorRuntime.async(function getMutationsCqrsPackage$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;

          _ret = function () {
            var validateMutation = function _callee(mutationName, items, mutationsPath) {
              var validate, validationSchema, validationResults;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (!(!items || !items.length)) {
                        _context.next = 2;
                        break;
                      }

                      return _context.abrupt('return', null);

                    case 2:
                      // non ci sono dati da validare
                      validate = require('./validate.jsonSchema');
                      validationSchema = path.join(mutationsPath, mutationName + '.schema.json');
                      _context.next = 6;
                      return regeneratorRuntime.awrap(validate({ items: items, validationSchema: validationSchema, throwIfFileNotFounded: false }));

                    case 6:
                      validationResults = _context.sent;

                      if (validationResults === false) DI.warn({ msg: 'mutation not have a schema expected:' + validationSchema, context: PACKAGE, data: { mutationName: mutationName, items: items, mutationsPath: mutationsPath } });

                    case 8:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, null, this);
            };

            var PACKAGE = 'mutations.cqrs';
            var getValuePromise = require('./jesus').getValuePromise;
            var checkRequired = require('./jesus').checkRequired;
            CONFIG = checkRequired(CONFIG, ['mutationsPath'], PACKAGE);
            DI = checkRequired(DI, ['mutationsStoragePackage', 'throwError', 'log', 'debug', 'warn'], PACKAGE);

            applyMutationsFromPath = function applyMutationsFromPathFunc(originalState, mutations, mutationsPath) {
              var state = R.clone(originalState);
              DI.debug({ msg: 'applyMutationsFromPath', context: PACKAGE, debug: { state: state, mutations: mutations, mutationsPath: mutationsPath } });
              function applyMutation(state, mutation) {
                var mutationFile = path.join(mutationsPath, mutation.mutation + '.' + mutation.version + '.js');
                return require(mutationFile)(state, mutation.data);
              }
              return R.reduce(applyMutation, state, mutations);
            };

            return {
              v: {
                mutate: function mutate(_ref) {
                  var mutation = _ref.mutation,
                      itemsIds = _ref.itemsIds,
                      items = _ref.items;
                  var configMutationsPath, mutationsFunctions, lastMutationVersion, itemsSingleMutation;
                  return regeneratorRuntime.async(function mutate$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.prev = 0;
                          _context2.next = 3;
                          return regeneratorRuntime.awrap(getValuePromise(CONFIG.mutationsPath));

                        case 3:
                          configMutationsPath = _context2.sent;
                          _context2.next = 6;
                          return regeneratorRuntime.awrap(validateMutation(mutation, items, configMutationsPath));

                        case 6:
                          mutationsFunctions = getMutationsFunctions(configMutationsPath);

                          checkMutationFunction(mutation, mutationsFunctions);
                          lastMutationVersion = mutationsFunctions[mutation][0].mutationVersion;
                          // DI.debug({msg: 'createItemsMutations', context: PACKAGE, debug: {mutation, lastMutationVersion, itemsIds, items}})

                          itemsSingleMutation = createItemsMutation(mutation, lastMutationVersion, itemsIds, items);

                          DI.debug({ msg: 'itemsSingleMutation to create', context: PACKAGE, debug: { mutation: mutation, lastMutationVersion: lastMutationVersion, itemsIds: itemsIds, items: items, itemsSingleMutation: itemsSingleMutation } });
                          _context2.next = 13;
                          return regeneratorRuntime.awrap(DI.mutationsStoragePackage.insert({ items: itemsSingleMutation }));

                        case 13:
                          return _context2.abrupt('return', itemsSingleMutation);

                        case 16:
                          _context2.prev = 16;
                          _context2.t0 = _context2['catch'](0);

                          DI.throwError(PACKAGE + ' mutate(args) Error', _context2.t0, { mutation: mutation, itemsIds: itemsIds, items: items });

                        case 19:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, null, this, [[0, 16]]);
                },
                getItemMutations: function getItemMutations(_ref2) {
                  var itemId = _ref2.itemId,
                      _ref2$minTimestamp = _ref2.minTimestamp,
                      minTimestamp = _ref2$minTimestamp === undefined ? 0 : _ref2$minTimestamp;
                  var results;
                  return regeneratorRuntime.async(function getItemMutations$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return regeneratorRuntime.awrap(DI.mutationsStoragePackage.find({
                            query: {
                              itemId: itemId,
                              timestamp: { $gte: minTimestamp }
                            },
                            sort: { timestamp: 1 }
                          }));

                        case 2:
                          results = _context3.sent;

                          DI.debug({ msg: 'getItemMutations', context: PACKAGE, debug: { itemId: itemId, minTimestamp: minTimestamp, results: results } });
                          return _context3.abrupt('return', results);

                        case 5:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, null, this);
                },
                applyMutations: function applyMutations(_ref3) {
                  var state = _ref3.state,
                      mutations = _ref3.mutations;
                  var mutationsPath;
                  return regeneratorRuntime.async(function applyMutations$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.next = 2;
                          return regeneratorRuntime.awrap(getValuePromise(CONFIG.mutationsPath));

                        case 2:
                          mutationsPath = _context4.sent;


                          DI.debug({ msg: 'applyMutationsFromPath', context: PACKAGE, debug: { state: state, mutations: mutations, mutationsPath: mutationsPath } });
                          return _context4.abrupt('return', applyMutationsFromPath(state, mutations, mutationsPath));

                        case 5:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, null, this);
                }
              }
            };
          }();

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt('return', _ret.v);

        case 4:
          _context5.next = 9;
          break;

        case 6:
          _context5.prev = 6;
          _context5.t0 = _context5['catch'](0);

          DI.throwError('getMutationsCqrsPackage(CONFIG, DI)', _context5.t0);

        case 9:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, this, [[0, 6]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11dGF0aW9ucy5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsInBhdGgiLCJmcyIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsImFwcGx5IiwiYXJndW1lbnRzIiwiY3JlYXRlSXRlbXNNdXRhdGlvbiIsIm11dGF0aW9uSWQiLCJtdXRhdGlvblZlcnNpb24iLCJtdXRhdGlvbnNJdGVtc0lkcyIsIm11dGF0aW9uc0FyZ3MiLCJtdXRhdGlvbnMiLCJhZGRJbmRleCIsIm1hcCIsIml0ZW1JZCIsImluZGV4IiwibXV0YXRpb24iLCJ2ZXJzaW9uIiwidGltZXN0YW1wIiwiRGF0ZSIsImdldFRpbWUiLCJkYXRhIiwiZ2V0TXV0YXRpb25zRnVuY3Rpb25zIiwiYmFzZVBhdGgiLCJmaWxlc0pzTm9FeHRlbnNpb24iLCJjb21wb3NlIiwicmVwbGFjZSIsImJhc2VuYW1lIiwiZmlsdGVyIiwiZmlsZSIsImV4dG5hbWUiLCJyZWFkZGlyU3luYyIsInNwbGl0RmlsZXMiLCJzcGxpdCIsInNvcnRGaWxlcyIsInJldmVyc2UiLCJzb3J0QnkiLCJwYXJzZUludCIsInByb3AiLCJncm91cEZpbGVzIiwiZ3JvdXBCeSIsImFkZEZ1bmN0aW9uIiwiZWxlbWVudCIsIm11dGF0aW9uc0Z1bmN0aW9ucyIsImNoZWNrTXV0YXRpb25GdW5jdGlvbiIsIkVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE11dGF0aW9uc0NxcnNQYWNrYWdlIiwiQ09ORklHIiwiREkiLCJ2YWxpZGF0ZU11dGF0aW9uIiwibXV0YXRpb25OYW1lIiwiaXRlbXMiLCJtdXRhdGlvbnNQYXRoIiwibGVuZ3RoIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uU2NoZW1hIiwiam9pbiIsInRocm93SWZGaWxlTm90Rm91bmRlZCIsInZhbGlkYXRpb25SZXN1bHRzIiwid2FybiIsIm1zZyIsImNvbnRleHQiLCJQQUNLQUdFIiwiZ2V0VmFsdWVQcm9taXNlIiwiY2hlY2tSZXF1aXJlZCIsImFwcGx5TXV0YXRpb25zRnJvbVBhdGgiLCJhcHBseU11dGF0aW9uc0Zyb21QYXRoRnVuYyIsIm9yaWdpbmFsU3RhdGUiLCJzdGF0ZSIsImNsb25lIiwiYXBwbHlNdXRhdGlvbiIsIm11dGF0aW9uRmlsZSIsInJlZHVjZSIsIm11dGF0ZSIsIml0ZW1zSWRzIiwiY29uZmlnTXV0YXRpb25zUGF0aCIsImxhc3RNdXRhdGlvblZlcnNpb24iLCJpdGVtc1NpbmdsZU11dGF0aW9uIiwibXV0YXRpb25zU3RvcmFnZVBhY2thZ2UiLCJpbnNlcnQiLCJ0aHJvd0Vycm9yIiwiZ2V0SXRlbU11dGF0aW9ucyIsIm1pblRpbWVzdGFtcCIsImZpbmQiLCJxdWVyeSIsIiRndGUiLCJzb3J0IiwicmVzdWx0cyIsImFwcGx5TXV0YXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlFLEtBQUtGLFFBQVEsSUFBUixDQUFUOztBQUVBLFNBQVNHLEtBQVQsR0FBa0I7QUFDaEJDLFVBQVFDLEdBQVIsQ0FBWSxlQUNWLG1CQURVLEdBRVYsU0FGRjtBQUdBRCxVQUFRQyxHQUFSLENBQVlDLEtBQVosQ0FBa0JGLE9BQWxCLEVBQTJCRyxTQUEzQjtBQUNEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVNDLG1CQUFULENBQThCQyxVQUE5QixFQUEwQ0MsZUFBMUMsRUFBMkRDLGlCQUEzRCxFQUE4RUMsYUFBOUUsRUFBNkY7QUFDM0YsTUFBSUMsWUFBWWQsRUFBRWUsUUFBRixDQUFXZixFQUFFZ0IsR0FBYixFQUFrQixVQUFDQyxNQUFELEVBQVNDLEtBQVQsRUFBbUI7QUFDbkQsV0FBTztBQUNMRCxvQkFESztBQUVMRSxnQkFBVVQsVUFGTDtBQUdMVSxlQUFTVCxlQUhKO0FBSUxVLGlCQUFXLElBQUlDLElBQUosR0FBV0MsT0FBWCxLQUF1QixJQUo3QjtBQUtMQyxZQUFPWCxpQkFBaUJBLGNBQWNLLEtBQWQs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LEtBQUssd0JBQU4sRUFBZ0NDLFNBQVNDLE9BQXpDLEVBQWtEL0QsT0FBTyxFQUFDcUUsWUFBRCxFQUFRM0Qsb0JBQVIsRUFBbUIyQyw0QkFBbkIsRUFBekQsRUFBVDtBQUhjLDREQUlQYSx1QkFBdUJHLEtBQXZCLEVBQThCM0QsU0FBOUIsRUFBeUMyQyxhQUF6QyxDQUpPOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBOUJYO0FBQVA7QUF4QmE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUE4RGJKLGFBQUdnQyxVQUFILENBQWMscUNBQWQ7O0FBOURhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6Im11dGF0aW9ucy5jcXJzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcblxuZnVuY3Rpb24gZGVidWcgKCkge1xuICBjb25zb2xlLmxvZygnXFx1MDAxYlsxOzMzbScgK1xuICAgICc8U3RhdGUgTXV0YXRpb25zPicgK1xuICAgICdcXHUwMDFiWzBtJylcbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKVxufVxuLy8gdmFyIGNoZWNrTnVsbElkID0gZnVuY3Rpb24gY2hlY2tOdWxsSWQgKGluc3RhbmNlKSB7XG4vLyAgIGlmICghaW5zdGFuY2UuX2lkKSB7XG4vLyAgICAgZGVsZXRlIGluc3RhbmNlLl9pZFxuLy8gICB9XG4vLyAgIHJldHVybiBpbnN0YW5jZVxuLy8gfVxuXG5mdW5jdGlvbiBjcmVhdGVJdGVtc011dGF0aW9uIChtdXRhdGlvbklkLCBtdXRhdGlvblZlcnNpb24sIG11dGF0aW9uc0l0ZW1zSWRzLCBtdXRhdGlvbnNBcmdzKSB7XG4gIHZhciBtdXRhdGlvbnMgPSBSLmFkZEluZGV4KFIubWFwKSgoaXRlbUlkLCBpbmRleCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtSWQsXG4gICAgICBtdXRhdGlvbjogbXV0YXRpb25JZCxcbiAgICAgIHZlcnNpb246IG11dGF0aW9uVmVyc2lvbixcbiAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwLFxuICAgICAgZGF0YTogKG11dGF0aW9uc0FyZ3MgJiYgbXV0YXRpb25zQXJnc1tpbmRleF0pXG4gICAgICAgID8gbXV0YXRpb25zQXJnc1tpbmRleF1cbiAgICAgICAgOiB7fVxuICAgIH1cbiAgfSwgbXV0YXRpb25zSXRlbXNJZHMpXG4gIHJldHVybiBtdXRhdGlvbnNcbn1cblxuLy8gZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnMgKG11dGF0aW9uc0Z1bmN0aW9ucywgbXV0YXRpb25zLCBzdGF0ZXMpIHtcbi8vICAgZGVidWcoJ2FwcGx5TXV0YXRpb25zJywgbXV0YXRpb25zRnVuY3Rpb25zLCBtdXRhdGlvbnMsIHN0YXRlcylcbi8vICAgc3RhdGVzID0gc3RhdGVzIHx8IHt9XG4vLyAgIHZhciBtdXRhdGlvbnNCeUl0ZW0gPSBSLmdyb3VwQnkoUi5wcm9wKCdpdGVtSWQnKSwgbXV0YXRpb25zKVxuLy8gICB2YXIgc3RhdGVzQnlJdGVtID0gUi56aXBPYmooUi5tYXAoUi5wcm9wKCdpdGVtSWQnLCBzdGF0ZXMpKSwgc3RhdGVzKVxuLy8gICBmb3IgKGxldCBpdGVtSWQgaW4gbXV0YXRpb25zQnlJdGVtKSB7XG4vLyAgICAgZm9yIChsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zQnlJdGVtW2l0ZW1JZF0pIHtcbi8vICAgICAgIHN0YXRlc0J5SXRlbVtpdGVtSWRdID0gbXV0YXRpb25zRnVuY3Rpb25zW211dGF0aW9uLm11dGF0aW9uXVttdXRhdGlvbi52ZXJzaW9uXShzdGF0ZXNCeUl0ZW1baXRlbUlkXSB8fCB7fSwgbXV0YXRpb24uZGF0YSlcbi8vICAgICB9XG4vLyAgIH1cbi8vICAgZGVidWcoJ2FwcGxpZWRNdXRhdGlvbnMnLCBzdGF0ZXNCeUl0ZW0pXG4vLyAgIHJldHVybiBSLnZhbHVlcyhzdGF0ZXNCeUl0ZW0pXG4vLyB9XG5cbmZ1bmN0aW9uIGdldE11dGF0aW9uc0Z1bmN0aW9ucyAoYmFzZVBhdGgpIHtcbiAgdmFyIGZpbGVzSnNOb0V4dGVuc2lvbiA9IFIubWFwKFIuY29tcG9zZShSLnJlcGxhY2UoJy5qcycsICcnKSwgcGF0aC5iYXNlbmFtZSksIFIuZmlsdGVyKChmaWxlKSA9PiBwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcuanMnLCBmcy5yZWFkZGlyU3luYyhiYXNlUGF0aCkpKVxuICB2YXIgc3BsaXRGaWxlcyA9IFIubWFwKFIuc3BsaXQoJy4nKSlcbiAgdmFyIHNvcnRGaWxlcyA9IFIuY29tcG9zZShSLnJldmVyc2UsIFIuc29ydEJ5KFIuY29tcG9zZShwYXJzZUludCwgUi5wcm9wKDApKSkpXG4gIHZhciBncm91cEZpbGVzID0gUi5ncm91cEJ5KFIucHJvcCgwKSlcbiAgdmFyIGFkZEZ1bmN0aW9uID0gUi5tYXAoUi5tYXAoKGVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4ge211dGF0aW9uSWQ6IGVsZW1lbnRbMF0sIG11dGF0aW9uVmVyc2lvbjogZWxlbWVudFsxXX1cbiAgfSkpXG4gIHZhciBtdXRhdGlvbnNGdW5jdGlvbnMgPSBSLmNvbXBvc2UoYWRkRnVuY3Rpb24sIGdyb3VwRmlsZXMsIHNvcnRGaWxlcywgc3BsaXRGaWxlcykoZmlsZXNKc05vRXh0ZW5zaW9uKVxuICAvLyBkZWJ1ZygnZ2V0TXV0YXRpb25zRnVuY3Rpb25zJywgbXV0YXRpb25zRnVuY3Rpb25zKVxuICByZXR1cm4gbXV0YXRpb25zRnVuY3Rpb25zXG59XG5cbmZ1bmN0aW9uIGNoZWNrTXV0YXRpb25GdW5jdGlvbiAobXV0YXRpb25JZCwgbXV0YXRpb25zRnVuY3Rpb25zKSB7XG4gIGlmICghbXV0YXRpb25zRnVuY3Rpb25zW211dGF0aW9uSWRdIHx8ICFtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25JZF1bMF0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ211dGF0aW9uIG5vbiBkZWZpbml0YScpXG4gIH1cbn1cblxuLy8gZnVuY3Rpb24gZ2V0RnVuY3Rpb25zIChiYXNlUGF0aCwgZmlsdGVyQnlNdXRhdGlvbklkLCBmaWx0ZXJCeVZlcnNpb24pIHtcbi8vICAgdmFyIHZlcnNpb25zID0gZ2V0VmVyc2lvbnMoYmFzZVBhdGgpXG4vLyAgIGlmIChmaWx0ZXJCeU11dGF0aW9uSWQpIHtcbi8vICAgICB2ZXJzaW9ucyA9IHtcbi8vICAgICAgIFtmaWx0ZXJCeU11dGF0aW9uSWRdOiB2ZXJzaW9uc1tmaWx0ZXJCeU11dGF0aW9uSWRdXG4vLyAgICAgfVxuLy8gICB9XG4vLyAgIGlmIChmaWx0ZXJCeVZlcnNpb24pIHtcbi8vICAgICB2ZXJzaW9uc1tmaWx0ZXJCeU11dGF0aW9uSWRdID0gW2ZpbHRlckJ5VmVyc2lvbl1cbi8vICAgfVxuLy8gICB2YXIgbXV0YXRpb25zRnVuY3Rpb25zID0gUi5tYXBPYmpJbmRleGVkKCh2YWwsIG11TmFtZSwgb2JqKSA9PiBSLnppcE9iaih2YWwsIFIubWFwKChtdVZlcnMpID0+IHJlcXVpcmUoYCR7YmFzZVBhdGh9LyR7bXVOYW1lfS4ke211VmVyc31gKSwgdmFsKSksIHZlcnNpb25zKVxuLy8gICBkZWJ1ZygnZ2V0RnVuY3Rpb25zJywgbXV0YXRpb25zRnVuY3Rpb25zKVxuLy8gICByZXR1cm4gbXV0YXRpb25zRnVuY3Rpb25zXG4vLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UgKENPTkZJRywgREkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBQQUNLQUdFID0gJ211dGF0aW9ucy5jcXJzJ1xuICAgIGNvbnN0IGdldFZhbHVlUHJvbWlzZSA9IHJlcXVpcmUoJy4vamVzdXMnKS5nZXRWYWx1ZVByb21pc2VcbiAgICBjb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbiAgICBDT05GSUcgPSBjaGVja1JlcXVpcmVkKENPTkZJRywgWydtdXRhdGlvbnNQYXRoJ10sIFBBQ0tBR0UpXG4gICAgREkgPSBjaGVja1JlcXVpcmVkKERJLCBbJ211dGF0aW9uc1N0b3JhZ2VQYWNrYWdlJywgJ3Rocm93RXJyb3InLCAnbG9nJywgJ2RlYnVnJywgJ3dhcm4nXSwgUEFDS0FHRSlcblxuICAgIHZhciBhcHBseU11dGF0aW9uc0Zyb21QYXRoID0gZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnNGcm9tUGF0aEZ1bmMgKG9yaWdpbmFsU3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aCkge1xuICAgICAgdmFyIHN0YXRlID0gUi5jbG9uZShvcmlnaW5hbFN0YXRlKVxuICAgICAgREkuZGVidWcoe21zZzogJ2FwcGx5TXV0YXRpb25zRnJvbVBhdGgnLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge3N0YXRlLCBtdXRhdGlvbnMsIG11dGF0aW9uc1BhdGh9fSlcbiAgICAgIGZ1bmN0aW9uIGFwcGx5TXV0YXRpb24gKHN0YXRlLCBtdXRhdGlvbikge1xuICAgICAgICB2YXIgbXV0YXRpb25GaWxlID0gcGF0aC5qb2luKG11dGF0aW9uc1BhdGgsIGAke211dGF0aW9uLm11dGF0aW9ufS4ke211dGF0aW9uLnZlcnNpb259LmpzYClcbiAgICAgICAgcmV0dXJuIHJlcXVpcmUobXV0YXRpb25GaWxlKShzdGF0ZSwgbXV0YXRpb24uZGF0YSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBSLnJlZHVjZShhcHBseU11dGF0aW9uLCBzdGF0ZSwgbXV0YXRpb25zKVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiB2YWxpZGF0ZU11dGF0aW9uIChtdXRhdGlvbk5hbWUsIGl0ZW1zLCBtdXRhdGlvbnNQYXRoKSB7XG4gICAgICBpZiAoIWl0ZW1zIHx8ICFpdGVtcy5sZW5ndGgpIHJldHVybiBudWxsIC8vIG5vbiBjaSBzb25vIGRhdGkgZGEgdmFsaWRhcmVcbiAgICAgIHZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vdmFsaWRhdGUuanNvblNjaGVtYScpXG4gICAgICB2YXIgdmFsaWRhdGlvblNjaGVtYSA9IHBhdGguam9pbihtdXRhdGlvbnNQYXRoLCBgJHttdXRhdGlvbk5hbWV9LnNjaGVtYS5qc29uYClcbiAgICAgIHZhciB2YWxpZGF0aW9uUmVzdWx0cyA9IGF3YWl0IHZhbGlkYXRlKHtpdGVtcywgdmFsaWRhdGlvblNjaGVtYSwgdGhyb3dJZkZpbGVOb3RGb3VuZGVkOiBmYWxzZX0pXG4gICAgICBpZiAodmFsaWRhdGlvblJlc3VsdHMgPT09IGZhbHNlKSBESS53YXJuKHttc2c6ICdtdXRhdGlvbiBub3QgaGF2ZSBhIHNjaGVtYSBleHBlY3RlZDonICsgdmFsaWRhdGlvblNjaGVtYSwgY29udGV4dDogUEFDS0FHRSwgZGF0YToge211dGF0aW9uTmFtZSwgaXRlbXMsIG11dGF0aW9uc1BhdGh9fSlcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG11dGF0ZTogYXN5bmMgZnVuY3Rpb24gbXV0YXRlICh7bXV0YXRpb24sIGl0ZW1zSWRzLCBpdGVtc30pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyB2YWxpZGF0ZSBtdXRhdGlvblxuICAgICAgICAgIHZhciBjb25maWdNdXRhdGlvbnNQYXRoID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5tdXRhdGlvbnNQYXRoKVxuICAgICAgICAgIGF3YWl0IHZhbGlkYXRlTXV0YXRpb24obXV0YXRpb24sIGl0ZW1zLCBjb25maWdNdXRhdGlvbnNQYXRoKVxuICAgICAgICAgIHZhciBtdXRhdGlvbnNGdW5jdGlvbnMgPSBnZXRNdXRhdGlvbnNGdW5jdGlvbnMoY29uZmlnTXV0YXRpb25zUGF0aClcbiAgICAgICAgICBjaGVja011dGF0aW9uRnVuY3Rpb24obXV0YXRpb24sIG11dGF0aW9uc0Z1bmN0aW9ucylcbiAgICAgICAgICB2YXIgbGFzdE11dGF0aW9uVmVyc2lvbiA9IG11dGF0aW9uc0Z1bmN0aW9uc1ttdXRhdGlvbl1bMF0ubXV0YXRpb25WZXJzaW9uXG4gICAgICAgICAgLy8gREkuZGVidWcoe21zZzogJ2NyZWF0ZUl0ZW1zTXV0YXRpb25zJywgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHttdXRhdGlvbiwgbGFzdE11dGF0aW9uVmVyc2lvbiwgaXRlbXNJZHMsIGl0ZW1zfX0pXG5cbiAgICAgICAgICB2YXIgaXRlbXNTaW5nbGVNdXRhdGlvbiA9IGNyZWF0ZUl0ZW1zTXV0YXRpb24obXV0YXRpb24sIGxhc3RNdXRhdGlvblZlcnNpb24sIGl0ZW1zSWRzLCBpdGVtcylcbiAgICAgICAgICBESS5kZWJ1Zyh7bXNnOiAnaXRlbXNTaW5nbGVNdXRhdGlvbiB0byBjcmVhdGUnLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge211dGF0aW9uLCBsYXN0TXV0YXRpb25WZXJzaW9uLCBpdGVtc0lkcywgaXRlbXMsIGl0ZW1zU2luZ2xlTXV0YXRpb259fSlcbiAgICAgICAgICBhd2FpdCBESS5tdXRhdGlvbnNTdG9yYWdlUGFja2FnZS5pbnNlcnQoe2l0ZW1zOiBpdGVtc1NpbmdsZU11dGF0aW9ufSlcbiAgICAgICAgICByZXR1cm4gaXRlbXNTaW5nbGVNdXRhdGlvblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIERJLnRocm93RXJyb3IoUEFDS0FHRSArICcgbXV0YXRlKGFyZ3MpIEVycm9yJywgZXJyb3IsIHttdXRhdGlvbiwgaXRlbXNJZHMsIGl0ZW1zfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGdldEl0ZW1NdXRhdGlvbnM6IGFzeW5jIGZ1bmN0aW9uIGdldEl0ZW1NdXRhdGlvbnMgKHtpdGVtSWQsIG1pblRpbWVzdGFtcCA9IDB9KSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gYXdhaXQgREkubXV0YXRpb25zU3RvcmFnZVBhY2thZ2UuZmluZCh7XG4gICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgIGl0ZW1JZDogaXRlbUlkLFxuICAgICAgICAgICAgdGltZXN0YW1wOiB7JGd0ZTogbWluVGltZXN0YW1wfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc29ydDoge3RpbWVzdGFtcDogMX1cbiAgICAgICAgfSlcbiAgICAgICAgREkuZGVidWcoe21zZzogJ2dldEl0ZW1NdXRhdGlvbnMnLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge2l0ZW1JZCwgbWluVGltZXN0YW1wLCByZXN1bHRzfX0pXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9LFxuICAgICAgYXBwbHlNdXRhdGlvbnM6IGFzeW5jIGZ1bmN0aW9uIGFwcGx5TXV0YXRpb25zICh7c3RhdGUsIG11dGF0aW9uc30pIHtcbiAgICAgICAgdmFyIG11dGF0aW9uc1BhdGggPSBhd2FpdCBnZXRWYWx1ZVByb21pc2UoQ09ORklHLm11dGF0aW9uc1BhdGgpXG5cbiAgICAgICAgREkuZGVidWcoe21zZzogJ2FwcGx5TXV0YXRpb25zRnJvbVBhdGgnLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge3N0YXRlLCBtdXRhdGlvbnMsIG11dGF0aW9uc1BhdGh9fSlcbiAgICAgICAgcmV0dXJuIGFwcGx5TXV0YXRpb25zRnJvbVBhdGgoc3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UoQ09ORklHLCBESSknLCBlcnJvcilcbiAgfVxufVxuIl19