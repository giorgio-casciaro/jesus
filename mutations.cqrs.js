'use strict';

var R = require('ramda');
var path = require('path');
var fs = require('fs');
var LOG = console;
var PACKAGE = 'mutations.cqrs';
var checkRequired = require('./jesus').checkRequired;

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
  LOG.debug(PACKAGE, 'applyMutationsFromPath', { state: state, mutations: mutations, mutationsPath: mutationsPath });
  function applyMutation(state, mutation) {
    var mutationFile = path.join(mutationsPath, mutation.mutation + '.' + mutation.version + '.js');
    return require(mutationFile)(state, mutation.data);
  }
  return R.reduce(applyMutation, state, mutations);
};

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

                      LOG.debug(PACKAGE, 'dataSingleMutation to create', { mutation: mutation, lastMutationVersion: lastMutationVersion, objId: objId, data: data, mutationState: mutationState });
                      _context.next = 9;
                      return regeneratorRuntime.awrap(mutationsStoragePackage.insert({ objs: [mutationState] }));

                    case 9:
                      return _context.abrupt('return', mutationState);

                    case 12:
                      _context.prev = 12;
                      _context.t0 = _context['catch'](0);

                      LOG.error(PACKAGE, _context.t0, { mutation: mutation, objId: objId, data: data });
                      throw 'mutate(args) Error';

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

                      LOG.debug(PACKAGE, 'getObjMutations', { objId: objId, minTimestamp: minTimestamp, results: results });
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
                      LOG.debug(PACKAGE, 'applyMutationsFromPath', { state: state, mutations: mutations, mutationsPath: mutationsPath });
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
          throw PACKAGE + ' getMutationsCqrsPackage';

        case 9:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this, [[0, 5]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11dGF0aW9ucy5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsInBhdGgiLCJmcyIsIkxPRyIsImNvbnNvbGUiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsImdldE11dGF0aW9uc0Z1bmN0aW9ucyIsImJhc2VQYXRoIiwiZmlsZXNKc05vRXh0ZW5zaW9uIiwibWFwIiwiY29tcG9zZSIsInJlcGxhY2UiLCJiYXNlbmFtZSIsImZpbHRlciIsImZpbGUiLCJleHRuYW1lIiwicmVhZGRpclN5bmMiLCJzcGxpdEZpbGVzIiwic3BsaXQiLCJzb3J0RmlsZXMiLCJyZXZlcnNlIiwic29ydEJ5IiwicGFyc2VJbnQiLCJwcm9wIiwiZ3JvdXBGaWxlcyIsImdyb3VwQnkiLCJhZGRGdW5jdGlvbiIsImVsZW1lbnQiLCJtdXRhdGlvbklkIiwibXV0YXRpb25WZXJzaW9uIiwibXV0YXRpb25zRnVuY3Rpb25zIiwiY2hlY2tNdXRhdGlvbkZ1bmN0aW9uIiwiRXJyb3IiLCJhcHBseU11dGF0aW9uc0Zyb21QYXRoIiwiYXBwbHlNdXRhdGlvbnNGcm9tUGF0aEZ1bmMiLCJvcmlnaW5hbFN0YXRlIiwibXV0YXRpb25zIiwibXV0YXRpb25zUGF0aCIsInN0YXRlIiwiY2xvbmUiLCJkZWJ1ZyIsImFwcGx5TXV0YXRpb24iLCJtdXRhdGlvbiIsIm11dGF0aW9uRmlsZSIsImpvaW4iLCJ2ZXJzaW9uIiwiZGF0YSIsInJlZHVjZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRNdXRhdGlvbnNDcXJzUGFja2FnZSIsIm11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlIiwibXV0YXRlIiwib2JqSWQiLCJsYXN0TXV0YXRpb25WZXJzaW9uIiwibXV0YXRpb25TdGF0ZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJnZXRUaW1lIiwiaW5zZXJ0Iiwib2JqcyIsImVycm9yIiwiZ2V0T2JqTXV0YXRpb25zIiwibWluVGltZXN0YW1wIiwiZmluZCIsInF1ZXJ5IiwiJGd0ZSIsInNvcnQiLCJyZXN1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QUFBQTtBQUFBO0FBQUE7O0FBMENibkMsY0FBSTJELEtBQUosQ0FBVXpELE9BQVY7QUExQ2EsZ0JBMkNQQSxVQUFRLDBCQTNDRDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJtdXRhdGlvbnMuY3Fycy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgTE9HID0gY29uc29sZVxuY29uc3QgUEFDS0FHRSA9ICdtdXRhdGlvbnMuY3FycydcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuXG5mdW5jdGlvbiBnZXRNdXRhdGlvbnNGdW5jdGlvbnMgKGJhc2VQYXRoKSB7XG4gIHZhciBmaWxlc0pzTm9FeHRlbnNpb24gPSBSLm1hcChSLmNvbXBvc2UoUi5yZXBsYWNlKCcuanMnLCAnJyksIHBhdGguYmFzZW5hbWUpLCBSLmZpbHRlcigoZmlsZSkgPT4gcGF0aC5leHRuYW1lKGZpbGUpID09PSAnLmpzJywgZnMucmVhZGRpclN5bmMoYmFzZVBhdGgpKSlcbiAgdmFyIHNwbGl0RmlsZXMgPSBSLm1hcChSLnNwbGl0KCcuJykpXG4gIHZhciBzb3J0RmlsZXMgPSBSLmNvbXBvc2UoUi5yZXZlcnNlLCBSLnNvcnRCeShSLmNvbXBvc2UocGFyc2VJbnQsIFIucHJvcCgwKSkpKVxuICB2YXIgZ3JvdXBGaWxlcyA9IFIuZ3JvdXBCeShSLnByb3AoMCkpXG4gIHZhciBhZGRGdW5jdGlvbiA9IFIubWFwKFIubWFwKChlbGVtZW50KSA9PiB7XG4gICAgcmV0dXJuIHttdXRhdGlvbklkOiBlbGVtZW50WzBdLCBtdXRhdGlvblZlcnNpb246IGVsZW1lbnRbMV19XG4gIH0pKVxuICB2YXIgbXV0YXRpb25zRnVuY3Rpb25zID0gUi5jb21wb3NlKGFkZEZ1bmN0aW9uLCBncm91cEZpbGVzLCBzb3J0RmlsZXMsIHNwbGl0RmlsZXMpKGZpbGVzSnNOb0V4dGVuc2lvbilcbiAgLy8gZGVidWcoJ2dldE11dGF0aW9uc0Z1bmN0aW9ucycsIG11dGF0aW9uc0Z1bmN0aW9ucylcbiAgcmV0dXJuIG11dGF0aW9uc0Z1bmN0aW9uc1xufVxuXG5mdW5jdGlvbiBjaGVja011dGF0aW9uRnVuY3Rpb24gKG11dGF0aW9uSWQsIG11dGF0aW9uc0Z1bmN0aW9ucykge1xuICBpZiAoIW11dGF0aW9uc0Z1bmN0aW9uc1ttdXRhdGlvbklkXSB8fCAhbXV0YXRpb25zRnVuY3Rpb25zW211dGF0aW9uSWRdWzBdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdtdXRhdGlvbiBub24gZGVmaW5pdGEnKVxuICB9XG59XG52YXIgYXBwbHlNdXRhdGlvbnNGcm9tUGF0aCA9IGZ1bmN0aW9uIGFwcGx5TXV0YXRpb25zRnJvbVBhdGhGdW5jIChvcmlnaW5hbFN0YXRlLCBtdXRhdGlvbnMsIG11dGF0aW9uc1BhdGgpIHtcbiAgdmFyIHN0YXRlID0gUi5jbG9uZShvcmlnaW5hbFN0YXRlKVxuICBMT0cuZGVidWcoUEFDS0FHRSwgJ2FwcGx5TXV0YXRpb25zRnJvbVBhdGgnLCB7c3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aH0pXG4gIGZ1bmN0aW9uIGFwcGx5TXV0YXRpb24gKHN0YXRlLCBtdXRhdGlvbikge1xuICAgIHZhciBtdXRhdGlvbkZpbGUgPSBwYXRoLmpvaW4obXV0YXRpb25zUGF0aCwgYCR7bXV0YXRpb24ubXV0YXRpb259LiR7bXV0YXRpb24udmVyc2lvbn0uanNgKVxuICAgIHJldHVybiByZXF1aXJlKG11dGF0aW9uRmlsZSkoc3RhdGUsIG11dGF0aW9uLmRhdGEpXG4gIH1cbiAgcmV0dXJuIFIucmVkdWNlKGFwcGx5TXV0YXRpb24sIHN0YXRlLCBtdXRhdGlvbnMpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UgKHttdXRhdGlvbnNQYXRoLCBtdXRhdGlvbnNTdG9yYWdlUGFja2FnZX0pIHtcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHttdXRhdGlvbnNQYXRoLCBtdXRhdGlvbnNTdG9yYWdlUGFja2FnZX0sIFBBQ0tBR0UpXG4gICAgcmV0dXJuIHtcbiAgICAgIG11dGF0ZTogYXN5bmMgZnVuY3Rpb24gbXV0YXRlICh7bXV0YXRpb24sIG9iaklkLCBkYXRhfSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNoZWNrUmVxdWlyZWQoe29iaklkLCBtdXRhdGlvbn0sIFBBQ0tBR0UpXG4gICAgICAgICAgdmFyIG11dGF0aW9uc0Z1bmN0aW9ucyA9IGdldE11dGF0aW9uc0Z1bmN0aW9ucyhtdXRhdGlvbnNQYXRoKVxuICAgICAgICAgIGNoZWNrTXV0YXRpb25GdW5jdGlvbihtdXRhdGlvbiwgbXV0YXRpb25zRnVuY3Rpb25zKVxuICAgICAgICAgIHZhciBsYXN0TXV0YXRpb25WZXJzaW9uID0gbXV0YXRpb25zRnVuY3Rpb25zW211dGF0aW9uXVswXS5tdXRhdGlvblZlcnNpb25cbiAgICAgICAgICB2YXIgbXV0YXRpb25TdGF0ZSA9IHtcbiAgICAgICAgICAgIG9iaklkOiBvYmpJZCxcbiAgICAgICAgICAgIG11dGF0aW9uLFxuICAgICAgICAgICAgdmVyc2lvbjogbGFzdE11dGF0aW9uVmVyc2lvbixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwLFxuICAgICAgICAgICAgZGF0YVxuICAgICAgICAgIH1cbiAgICAgICAgICBMT0cuZGVidWcoUEFDS0FHRSwgJ2RhdGFTaW5nbGVNdXRhdGlvbiB0byBjcmVhdGUnLCB7bXV0YXRpb24sIGxhc3RNdXRhdGlvblZlcnNpb24sIG9iaklkLCBkYXRhLCBtdXRhdGlvblN0YXRlfSlcbiAgICAgICAgICBhd2FpdCBtdXRhdGlvbnNTdG9yYWdlUGFja2FnZS5pbnNlcnQoe29ianM6IFttdXRhdGlvblN0YXRlXX0pXG4gICAgICAgICAgcmV0dXJuIG11dGF0aW9uU3RhdGVcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBMT0cuZXJyb3IoUEFDS0FHRSwgZXJyb3IsIHttdXRhdGlvbiwgb2JqSWQsIGRhdGF9KVxuICAgICAgICAgIHRocm93ICdtdXRhdGUoYXJncykgRXJyb3InXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBnZXRPYmpNdXRhdGlvbnM6IGFzeW5jIGZ1bmN0aW9uIGdldE9iak11dGF0aW9ucyAoe29iaklkLCBtaW5UaW1lc3RhbXAgPSAwfSkge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IGF3YWl0IG11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlLmZpbmQoe1xuICAgICAgICAgIHF1ZXJ5OiB7XG4gICAgICAgICAgICBvYmpJZDogb2JqSWQsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHskZ3RlOiBtaW5UaW1lc3RhbXB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzb3J0OiB7dGltZXN0YW1wOiAxfVxuICAgICAgICB9KVxuICAgICAgICBMT0cuZGVidWcoUEFDS0FHRSwgJ2dldE9iak11dGF0aW9ucycsIHtvYmpJZCwgbWluVGltZXN0YW1wLCByZXN1bHRzfSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH0sXG4gICAgICBhcHBseU11dGF0aW9uczogYXN5bmMgZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnMgKHtzdGF0ZSwgbXV0YXRpb25zfSkge1xuICAgICAgICBMT0cuZGVidWcoUEFDS0FHRSwgJ2FwcGx5TXV0YXRpb25zRnJvbVBhdGgnLCB7c3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aH0pXG4gICAgICAgIHJldHVybiBhcHBseU11dGF0aW9uc0Zyb21QYXRoKHN0YXRlLCBtdXRhdGlvbnMsIG11dGF0aW9uc1BhdGgpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIExPRy5lcnJvcihQQUNLQUdFLCBlcnJvcilcbiAgICB0aHJvdyBQQUNLQUdFKycgZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UnXG4gIH1cbn1cbiJdfQ==