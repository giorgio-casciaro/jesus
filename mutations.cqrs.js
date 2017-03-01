'use strict';

var R = require('ramda');
var path = require('path');
var fs = require('fs');
var PACKAGE = 'mutations.cqrs';
var checkRequired = require('./jesus').checkRequired;
var checkRequiredFiles = require('./jesus').checkRequiredFiles;

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
    errorThrow('mutation not defined', { mutationId: mutationId });
  }
}

module.exports = function getMutationsCqrsPackage(_ref) {
  var getConsole = _ref.getConsole,
      serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      mutationsPath = _ref.mutationsPath,
      mutationsStoragePackage = _ref.mutationsStoragePackage;
  var CONSOLE, errorThrow, applyMutationsFromPath;
  return regeneratorRuntime.async(function getMutationsCqrsPackage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
          errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);

          applyMutationsFromPath = function applyMutationsFromPathFunc(originalState, mutations, mutationsPath) {
            var state = R.clone(originalState);
            CONSOLE.debug('applyMutationsFromPath', { state: state, mutations: mutations, mutationsPath: mutationsPath });
            function applyMutation(state, mutation) {
              var mutationFile = path.join(mutationsPath, mutation.mutation + '.' + mutation.version + '.js');
              return require(mutationFile)(state, mutation.data);
            }
            return R.reduce(applyMutation, state, mutations);
          };

          _context4.prev = 3;

          checkRequired({ serviceName: serviceName, serviceId: serviceId, mutationsPath: mutationsPath, mutationsStoragePackage: mutationsStoragePackage }, PACKAGE);
          checkRequiredFiles([mutationsPath], PACKAGE);
          return _context4.abrupt('return', {
            mutate: function mutate(_ref2) {
              var mutation = _ref2.mutation,
                  objId = _ref2.objId,
                  data = _ref2.data,
                  meta = _ref2.meta;
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
                        meta: meta,
                        version: lastMutationVersion,
                        timestamp: new Date().getTime() / 1000,
                        data: data
                      };

                      CONSOLE.debug('dataSingleMutation to create', { mutation: mutation, lastMutationVersion: lastMutationVersion, objId: objId, data: data, mutationState: mutationState });
                      _context.next = 9;
                      return regeneratorRuntime.awrap(mutationsStoragePackage.insert({ objs: [mutationState] }));

                    case 9:
                      return _context.abrupt('return', mutationState);

                    case 12:
                      _context.prev = 12;
                      _context.t0 = _context['catch'](0);

                      errorThrow('mutate(args) Error', { error: _context.t0, mutation: mutation, objId: objId, data: data });

                    case 15:
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

                      CONSOLE.debug('getObjMutations', { objId: objId, minTimestamp: minTimestamp, results: results });
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
                      CONSOLE.debug('applyMutationsFromPath', { state: state, mutations: mutations, mutationsPath: mutationsPath });
                      return _context3.abrupt('return', applyMutationsFromPath(state, mutations, mutationsPath));

                    case 2:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, null, this);
            }
          });

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4['catch'](3);

          errorThrow('getMutationsCqrsPackage', { error: _context4.t0, mutationsPath: mutationsPath, mutationsStoragePackage: mutationsStoragePackage });

        case 12:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this, [[3, 9]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11dGF0aW9ucy5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsInBhdGgiLCJmcyIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiY2hlY2tSZXF1aXJlZEZpbGVzIiwiZ2V0TXV0YXRpb25zRnVuY3Rpb25zIiwiYmFzZVBhdGgiLCJmaWxlc0pzTm9FeHRlbnNpb24iLCJtYXAiLCJjb21wb3NlIiwicmVwbGFjZSIsImJhc2VuYW1lIiwiZmlsdGVyIiwiZmlsZSIsImV4dG5hbWUiLCJyZWFkZGlyU3luYyIsInNwbGl0RmlsZXMiLCJzcGxpdCIsInNvcnRGaWxlcyIsInJldmVyc2UiLCJzb3J0QnkiLCJwYXJzZUludCIsInByb3AiLCJncm91cEZpbGVzIiwiZ3JvdXBCeSIsImFkZEZ1bmN0aW9uIiwiZWxlbWVudCIsIm11dGF0aW9uSWQiLCJtdXRhdGlvblZlcnNpb24iLCJtdXRhdGlvbnNGdW5jdGlvbnMiLCJjaGVja011dGF0aW9uRnVuY3Rpb24iLCJlcnJvclRocm93IiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE11dGF0aW9uc0NxcnNQYWNrYWdlIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwibXV0YXRpb25zUGF0aCIsIm11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlIiwiQ09OU09MRSIsImFwcGx5TXV0YXRpb25zRnJvbVBhdGgiLCJhcHBseU11dGF0aW9uc0Zyb21QYXRoRnVuYyIsIm9yaWdpbmFsU3RhdGUiLCJtdXRhdGlvbnMiLCJzdGF0ZSIsImNsb25lIiwiZGVidWciLCJhcHBseU11dGF0aW9uIiwibXV0YXRpb24iLCJtdXRhdGlvbkZpbGUiLCJqb2luIiwidmVyc2lvbiIsImRhdGEiLCJyZWR1Y2UiLCJtdXRhdGUiLCJvYmpJZCIsIm1ldGEiLCJsYXN0TXV0YXRpb25WZXJzaW9uIiwibXV0YXRpb25TdGF0ZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJnZXRUaW1lIiwiaW5zZXJ0Iiwib2JqcyIsImVycm9yIiwiZ2V0T2JqTXV0YXRpb25zIiwibWluVGltZXN0YW1wIiwiZmluZCIsInF1ZXJ5IiwiJGd0ZSIsInNvcnQiLCJyZXN1bHRzIiwiYXBwbHlNdXRhdGlvbnMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlFLEtBQUtGLFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBTUcsVUFBVSxnQkFBaEI7QUFDQSxJQUFNQyxnQkFBZ0JKLFFBQVEsU0FBUixFQUFtQkksYUFBekM7QUFDQSxJQUFJQyxxQkFBcUJMLFFBQVEsU0FBUixFQUFtQkssa0JBQTVDOztBQUVBLFNBQVNDLHFCQUFULENBQWdDQyxRQUFoQyxFQUEwQztBQUN4QyxNQUFJQyxxQkFBcUJULEVBQUVVLEdBQUYsQ0FBTVYsRUFBRVcsT0FBRixDQUFVWCxFQUFFWSxPQUFGLENBQVUsS0FBVixFQUFpQixFQUFqQixDQUFWLEVBQWdDVixLQUFLVyxRQUFyQyxDQUFOLEVBQXNEYixFQUFFYyxNQUFGLENBQVMsVUFBQ0MsSUFBRDtBQUFBLFdBQVViLEtBQUtjLE9BQUwsQ0FBYUQsSUFBYixNQUF1QixLQUFqQztBQUFBLEdBQVQsRUFBaURaLEdBQUdjLFdBQUgsQ0FBZVQsUUFBZixDQUFqRCxDQUF0RCxDQUF6QjtBQUNBLE1BQUlVLGFBQWFsQixFQUFFVSxHQUFGLENBQU1WLEVBQUVtQixLQUFGLENBQVEsR0FBUixDQUFOLENBQWpCO0FBQ0EsTUFBSUMsWUFBWXBCLEVBQUVXLE9BQUYsQ0FBVVgsRUFBRXFCLE9BQVosRUFBcUJyQixFQUFFc0IsTUFBRixDQUFTdEIsRUFBRVcsT0FBRixDQUFVWSxRQUFWLEVBQW9CdkIsRUFBRXdCLElBQUYsQ0FBTyxDQUFQLENBQXBCLENBQVQsQ0FBckIsQ0FBaEI7QUFDQSxNQUFJQyxhQUFhekIsRUFBRTBCLE9BQUYsQ0FBVTFCLEVBQUV3QixJQUFGLENBQU8sQ0FBUCxDQUFWLENBQWpCO0FBQ0EsTUFBSUcsY0FBYzNC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UyxZQUFELEVBQVFXLDBCQUFSLEVBQXNCSyxnQkFBdEIsRUFBakM7QUFSZSx3REFTUkEsT0FUUTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQXRCWjtBQWlDTEMsNEJBQWdCLFNBQWVBLGNBQWY7QUFBQSxrQkFBZ0M1QixLQUFoQyxTQUFnQ0EsS0FBaEM7QUFBQSxrQkFBdUNELFNBQXZDLFNBQXVDQSxTQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ2RKLDhCQUFRTyxLQUFSLENBQWMsd0JBQWQsRUFBd0MsRUFBQ0YsWUFBRCxFQUFRRCxvQkFBUixFQUFtQk4sNEJBQW5CLEVBQXhDO0FBRGMsd0RBRVBHLHVCQUF1QkksS0FBdkIsRUFBOEJELFNBQTlCLEVBQXlDTixhQUF6QyxDQUZPOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBakNYLFdBakJNOztBQUFBO0FBQUE7QUFBQTs7QUF3RGJQLHFCQUFXLHlCQUFYLEVBQXNDLEVBQUNrQyxtQkFBRCxFQUFRM0IsNEJBQVIsRUFBdUJDLGdEQUF2QixFQUF0Qzs7QUF4RGE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibXV0YXRpb25zLmNxcnMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgUEFDS0FHRSA9ICdtdXRhdGlvbnMuY3FycydcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxudmFyIGNoZWNrUmVxdWlyZWRGaWxlcyA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkRmlsZXNcblxuZnVuY3Rpb24gZ2V0TXV0YXRpb25zRnVuY3Rpb25zIChiYXNlUGF0aCkge1xuICB2YXIgZmlsZXNKc05vRXh0ZW5zaW9uID0gUi5tYXAoUi5jb21wb3NlKFIucmVwbGFjZSgnLmpzJywgJycpLCBwYXRoLmJhc2VuYW1lKSwgUi5maWx0ZXIoKGZpbGUpID0+IHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy5qcycsIGZzLnJlYWRkaXJTeW5jKGJhc2VQYXRoKSkpXG4gIHZhciBzcGxpdEZpbGVzID0gUi5tYXAoUi5zcGxpdCgnLicpKVxuICB2YXIgc29ydEZpbGVzID0gUi5jb21wb3NlKFIucmV2ZXJzZSwgUi5zb3J0QnkoUi5jb21wb3NlKHBhcnNlSW50LCBSLnByb3AoMCkpKSlcbiAgdmFyIGdyb3VwRmlsZXMgPSBSLmdyb3VwQnkoUi5wcm9wKDApKVxuICB2YXIgYWRkRnVuY3Rpb24gPSBSLm1hcChSLm1hcCgoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiB7bXV0YXRpb25JZDogZWxlbWVudFswXSwgbXV0YXRpb25WZXJzaW9uOiBlbGVtZW50WzFdfVxuICB9KSlcbiAgdmFyIG11dGF0aW9uc0Z1bmN0aW9ucyA9IFIuY29tcG9zZShhZGRGdW5jdGlvbiwgZ3JvdXBGaWxlcywgc29ydEZpbGVzLCBzcGxpdEZpbGVzKShmaWxlc0pzTm9FeHRlbnNpb24pXG4gIC8vIGRlYnVnKCdnZXRNdXRhdGlvbnNGdW5jdGlvbnMnLCBtdXRhdGlvbnNGdW5jdGlvbnMpXG4gIHJldHVybiBtdXRhdGlvbnNGdW5jdGlvbnNcbn1cblxuZnVuY3Rpb24gY2hlY2tNdXRhdGlvbkZ1bmN0aW9uIChtdXRhdGlvbklkLCBtdXRhdGlvbnNGdW5jdGlvbnMpIHtcbiAgaWYgKCFtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25JZF0gfHwgIW11dGF0aW9uc0Z1bmN0aW9uc1ttdXRhdGlvbklkXVswXSkge1xuICAgIGVycm9yVGhyb3coJ211dGF0aW9uIG5vdCBkZWZpbmVkJywge211dGF0aW9uSWR9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UgKHtnZXRDb25zb2xlLHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIG11dGF0aW9uc1BhdGgsIG11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG4gIHZhciBhcHBseU11dGF0aW9uc0Zyb21QYXRoID0gZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnNGcm9tUGF0aEZ1bmMgKG9yaWdpbmFsU3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aCkge1xuICAgIHZhciBzdGF0ZSA9IFIuY2xvbmUob3JpZ2luYWxTdGF0ZSlcbiAgICBDT05TT0xFLmRlYnVnKCdhcHBseU11dGF0aW9uc0Zyb21QYXRoJywge3N0YXRlLCBtdXRhdGlvbnMsIG11dGF0aW9uc1BhdGh9KVxuICAgIGZ1bmN0aW9uIGFwcGx5TXV0YXRpb24gKHN0YXRlLCBtdXRhdGlvbikge1xuICAgICAgdmFyIG11dGF0aW9uRmlsZSA9IHBhdGguam9pbihtdXRhdGlvbnNQYXRoLCBgJHttdXRhdGlvbi5tdXRhdGlvbn0uJHttdXRhdGlvbi52ZXJzaW9ufS5qc2ApXG4gICAgICByZXR1cm4gcmVxdWlyZShtdXRhdGlvbkZpbGUpKHN0YXRlLCBtdXRhdGlvbi5kYXRhKVxuICAgIH1cbiAgICByZXR1cm4gUi5yZWR1Y2UoYXBwbHlNdXRhdGlvbiwgc3RhdGUsIG11dGF0aW9ucylcbiAgfVxuXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgbXV0YXRpb25zUGF0aCwgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2V9LCBQQUNLQUdFKVxuICAgIGNoZWNrUmVxdWlyZWRGaWxlcyhbbXV0YXRpb25zUGF0aF0sIFBBQ0tBR0UpXG4gICAgcmV0dXJuIHtcbiAgICAgIG11dGF0ZTogYXN5bmMgZnVuY3Rpb24gbXV0YXRlICh7bXV0YXRpb24sIG9iaklkLCBkYXRhLCBtZXRhfSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNoZWNrUmVxdWlyZWQoe29iaklkLCBtdXRhdGlvbn0sIFBBQ0tBR0UpXG4gICAgICAgICAgdmFyIG11dGF0aW9uc0Z1bmN0aW9ucyA9IGdldE11dGF0aW9uc0Z1bmN0aW9ucyhtdXRhdGlvbnNQYXRoKVxuICAgICAgICAgIGNoZWNrTXV0YXRpb25GdW5jdGlvbihtdXRhdGlvbiwgbXV0YXRpb25zRnVuY3Rpb25zKVxuICAgICAgICAgIHZhciBsYXN0TXV0YXRpb25WZXJzaW9uID0gbXV0YXRpb25zRnVuY3Rpb25zW211dGF0aW9uXVswXS5tdXRhdGlvblZlcnNpb25cbiAgICAgICAgICB2YXIgbXV0YXRpb25TdGF0ZSA9IHtcbiAgICAgICAgICAgIG9iaklkOiBvYmpJZCxcbiAgICAgICAgICAgIG11dGF0aW9uLFxuICAgICAgICAgICAgbWV0YSxcbiAgICAgICAgICAgIHZlcnNpb246IGxhc3RNdXRhdGlvblZlcnNpb24sXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCxcbiAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICB9XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygnZGF0YVNpbmdsZU11dGF0aW9uIHRvIGNyZWF0ZScsIHttdXRhdGlvbiwgbGFzdE11dGF0aW9uVmVyc2lvbiwgb2JqSWQsIGRhdGEsIG11dGF0aW9uU3RhdGV9KVxuICAgICAgICAgIGF3YWl0IG11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlLmluc2VydCh7b2JqczogW211dGF0aW9uU3RhdGVdfSlcbiAgICAgICAgICByZXR1cm4gbXV0YXRpb25TdGF0ZVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGVycm9yVGhyb3coJ211dGF0ZShhcmdzKSBFcnJvcicsIHtlcnJvciwgbXV0YXRpb24sIG9iaklkLCBkYXRhfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGdldE9iak11dGF0aW9uczogYXN5bmMgZnVuY3Rpb24gZ2V0T2JqTXV0YXRpb25zICh7b2JqSWQsIG1pblRpbWVzdGFtcCA9IDB9KSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gYXdhaXQgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2UuZmluZCh7XG4gICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgIG9iaklkOiBvYmpJZCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogeyRndGU6IG1pblRpbWVzdGFtcH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNvcnQ6IHt0aW1lc3RhbXA6IDF9XG4gICAgICAgIH0pXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ2dldE9iak11dGF0aW9ucycsIHtvYmpJZCwgbWluVGltZXN0YW1wLCByZXN1bHRzfSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH0sXG4gICAgICBhcHBseU11dGF0aW9uczogYXN5bmMgZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnMgKHtzdGF0ZSwgbXV0YXRpb25zfSkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdhcHBseU11dGF0aW9uc0Zyb21QYXRoJywge3N0YXRlLCBtdXRhdGlvbnMsIG11dGF0aW9uc1BhdGh9KVxuICAgICAgICByZXR1cm4gYXBwbHlNdXRhdGlvbnNGcm9tUGF0aChzdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRoKVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnJvclRocm93KCdnZXRNdXRhdGlvbnNDcXJzUGFja2FnZScsIHtlcnJvciwgbXV0YXRpb25zUGF0aCwgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2V9KVxuICB9XG59XG4iXX0=