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
      mutationsPath = _ref.mutationsPath;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);

  var applyMutationsFromPath = function applyMutationsFromPathFunc(originalState, mutations, mutationsPath) {
    var state = R.clone(originalState);
    CONSOLE.debug('applyMutationsFromPath', { state: state, mutations: mutations, mutationsPath: mutationsPath });
    function applyMutation(state, mutation) {
      var mutationFile = path.join(mutationsPath, mutation.mutation + '.' + mutation.version + '.js');
      return require(mutationFile)(state, mutation.data);
    }
    return R.reduce(applyMutation, state, mutations);
  };

  try {
    checkRequired({ serviceName: serviceName, serviceId: serviceId, mutationsPath: mutationsPath }, PACKAGE);
    checkRequiredFiles([mutationsPath], PACKAGE);
    return {
      mutate: function mutate(_ref2) {
        var mutation = _ref2.mutation,
            objId = _ref2.objId,
            data = _ref2.data,
            meta = _ref2.meta;

        try {
          checkRequired({ objId: objId, mutation: mutation }, PACKAGE);
          var mutationsFunctions = getMutationsFunctions(mutationsPath);
          checkMutationFunction(mutation, mutationsFunctions);
          var lastMutationVersion = mutationsFunctions[mutation][0].mutationVersion;
          var mutationState = {
            objId: objId,
            mutation: mutation,
            meta: meta,
            version: lastMutationVersion,
            timestamp: new Date().getTime() / 1000,
            data: data
          };
          CONSOLE.debug('dataSingleMutation to create', { mutation: mutation, lastMutationVersion: lastMutationVersion, objId: objId, data: data, mutationState: mutationState });
          return mutationState;
        } catch (error) {
          errorThrow('mutate(args) Error', { error: error, mutation: mutation, objId: objId, data: data });
        }
      },
      applyMutations: function applyMutations(_ref3) {
        var state = _ref3.state,
            mutations = _ref3.mutations;
        return regeneratorRuntime.async(function applyMutations$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                CONSOLE.debug('applyMutationsFromPath', { state: state, mutations: mutations, mutationsPath: mutationsPath });
                return _context.abrupt('return', applyMutationsFromPath(state, mutations, mutationsPath));

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, null, this);
      }
    };
  } catch (error) {
    errorThrow('getMutationsCqrsPackage', { error: error, mutationsPath: mutationsPath, mutationsStoragePackage: mutationsStoragePackage });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11dGF0aW9ucy5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsInBhdGgiLCJmcyIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiY2hlY2tSZXF1aXJlZEZpbGVzIiwiZ2V0TXV0YXRpb25zRnVuY3Rpb25zIiwiYmFzZVBhdGgiLCJmaWxlc0pzTm9FeHRlbnNpb24iLCJtYXAiLCJjb21wb3NlIiwicmVwbGFjZSIsImJhc2VuYW1lIiwiZmlsdGVyIiwiZmlsZSIsImV4dG5hbWUiLCJyZWFkZGlyU3luYyIsInNwbGl0RmlsZXMiLCJzcGxpdCIsInNvcnRGaWxlcyIsInJldmVyc2UiLCJzb3J0QnkiLCJwYXJzZUludCIsInByb3AiLCJncm91cEZpbGVzIiwiZ3JvdXBCeSIsImFkZEZ1bmN0aW9uIiwiZWxlbWVudCIsIm11dGF0aW9uSWQiLCJtdXRhdGlvblZlcnNpb24iLCJtdXRhdGlvbnNGdW5jdGlvbnMiLCJjaGVja011dGF0aW9uRnVuY3Rpb24iLCJlcnJvclRocm93IiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE11dGF0aW9uc0NxcnNQYWNrYWdlIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwibXV0YXRpb25zUGF0aCIsIkNPTlNPTEUiLCJhcHBseU11dGF0aW9uc0Zyb21QYXRoIiwiYXBwbHlNdXRhdGlvbnNGcm9tUGF0aEZ1bmMiLCJvcmlnaW5hbFN0YXRlIiwibXV0YXRpb25zIiwic3RhdGUiLCJjbG9uZSIsImRlYnVnIiwiYXBwbHlNdXRhdGlvbiIsIm11dGF0aW9uIiwibXV0YXRpb25GaWxlIiwiam9pbiIsInZlcnNpb24iLCJkYXRhIiwicmVkdWNlIiwibXV0YXRlIiwib2JqSWQiLCJtZXRhIiwibGFzdE11dGF0aW9uVmVyc2lvbiIsIm11dGF0aW9uU3RhdGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwiZ2V0VGltZSIsImVycm9yIiwiYXBwbHlNdXRhdGlvbnMiLCJtdXRhdGlvbnNTdG9yYWdlUGFja2FnZSJd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VDtBQU5rQixXQUFwQjtBQVFBYixrQkFBUU8sS0FBUixDQUFjLDhCQUFkLEVBQThDLEVBQUNFLGtCQUFELEVBQVdTLHdDQUFYLEVBQWdDRixZQUFoQyxFQUF1Q0gsVUFBdkMsRUFBNkNNLDRCQUE3QyxFQUE5QztBQUNBLGlCQUFPQSxhQUFQO0FBQ0QsU0FmRCxDQWVFLE9BQU9JLEtBQVAsRUFBYztBQUNkL0IscUJBQVcsb0JBQVgsRUFBaUMsRUFBQytCLFlBQUQsRUFBUWQsa0JBQVIsRUFBa0JPLFlBQWxCLEVBQXlCSCxVQUF6QixFQUFqQztBQUNEO0FBQ0YsT0FwQkk7QUFxQkxXLHNCQUFnQixTQUFlQSxjQUFmO0FBQUEsWUFBZ0NuQixLQUFoQyxTQUFnQ0EsS0FBaEM7QUFBQSxZQUF1Q0QsU0FBdkMsU0FBdUNBLFNBQXZDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDZEosd0JBQVFPLEtBQVIsQ0FBYyx3QkFBZCxFQUF3QyxFQUFDRixZQUFELEVBQVFELG9CQUFSLEVBQW1CTCw0QkFBbkIsRUFBeEM7QUFEYyxpREFFUEUsdUJBQXVCSSxLQUF2QixFQUE4QkQsU0FBOUIsRUFBeUNMLGFBQXpDLENBRk87O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFyQlgsS0FBUDtBQTBCRCxHQTdCRCxDQTZCRSxPQUFPd0IsS0FBUCxFQUFjO0FBQ2QvQixlQUFXLHlCQUFYLEVBQXNDLEVBQUMrQixZQUFELEVBQVF4Qiw0QkFBUixFQUF1QjBCLGdEQUF2QixFQUF0QztBQUNEO0FBQ0YsQ0E5Q0QiLCJmaWxlIjoibXV0YXRpb25zLmNxcnMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgUEFDS0FHRSA9ICdtdXRhdGlvbnMuY3FycydcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxudmFyIGNoZWNrUmVxdWlyZWRGaWxlcyA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkRmlsZXNcblxuZnVuY3Rpb24gZ2V0TXV0YXRpb25zRnVuY3Rpb25zIChiYXNlUGF0aCkge1xuICB2YXIgZmlsZXNKc05vRXh0ZW5zaW9uID0gUi5tYXAoUi5jb21wb3NlKFIucmVwbGFjZSgnLmpzJywgJycpLCBwYXRoLmJhc2VuYW1lKSwgUi5maWx0ZXIoKGZpbGUpID0+IHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy5qcycsIGZzLnJlYWRkaXJTeW5jKGJhc2VQYXRoKSkpXG4gIHZhciBzcGxpdEZpbGVzID0gUi5tYXAoUi5zcGxpdCgnLicpKVxuICB2YXIgc29ydEZpbGVzID0gUi5jb21wb3NlKFIucmV2ZXJzZSwgUi5zb3J0QnkoUi5jb21wb3NlKHBhcnNlSW50LCBSLnByb3AoMCkpKSlcbiAgdmFyIGdyb3VwRmlsZXMgPSBSLmdyb3VwQnkoUi5wcm9wKDApKVxuICB2YXIgYWRkRnVuY3Rpb24gPSBSLm1hcChSLm1hcCgoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiB7bXV0YXRpb25JZDogZWxlbWVudFswXSwgbXV0YXRpb25WZXJzaW9uOiBlbGVtZW50WzFdfVxuICB9KSlcbiAgdmFyIG11dGF0aW9uc0Z1bmN0aW9ucyA9IFIuY29tcG9zZShhZGRGdW5jdGlvbiwgZ3JvdXBGaWxlcywgc29ydEZpbGVzLCBzcGxpdEZpbGVzKShmaWxlc0pzTm9FeHRlbnNpb24pXG4gIC8vIGRlYnVnKCdnZXRNdXRhdGlvbnNGdW5jdGlvbnMnLCBtdXRhdGlvbnNGdW5jdGlvbnMpXG4gIHJldHVybiBtdXRhdGlvbnNGdW5jdGlvbnNcbn1cblxuZnVuY3Rpb24gY2hlY2tNdXRhdGlvbkZ1bmN0aW9uIChtdXRhdGlvbklkLCBtdXRhdGlvbnNGdW5jdGlvbnMpIHtcbiAgaWYgKCFtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25JZF0gfHwgIW11dGF0aW9uc0Z1bmN0aW9uc1ttdXRhdGlvbklkXVswXSkge1xuICAgIGVycm9yVGhyb3coJ211dGF0aW9uIG5vdCBkZWZpbmVkJywge211dGF0aW9uSWR9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UgKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBtdXRhdGlvbnNQYXRofSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG4gIHZhciBhcHBseU11dGF0aW9uc0Zyb21QYXRoID0gZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnNGcm9tUGF0aEZ1bmMgKG9yaWdpbmFsU3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aCkge1xuICAgIHZhciBzdGF0ZSA9IFIuY2xvbmUob3JpZ2luYWxTdGF0ZSlcbiAgICBDT05TT0xFLmRlYnVnKCdhcHBseU11dGF0aW9uc0Zyb21QYXRoJywge3N0YXRlLCBtdXRhdGlvbnMsIG11dGF0aW9uc1BhdGh9KVxuICAgIGZ1bmN0aW9uIGFwcGx5TXV0YXRpb24gKHN0YXRlLCBtdXRhdGlvbikge1xuICAgICAgdmFyIG11dGF0aW9uRmlsZSA9IHBhdGguam9pbihtdXRhdGlvbnNQYXRoLCBgJHttdXRhdGlvbi5tdXRhdGlvbn0uJHttdXRhdGlvbi52ZXJzaW9ufS5qc2ApXG4gICAgICByZXR1cm4gcmVxdWlyZShtdXRhdGlvbkZpbGUpKHN0YXRlLCBtdXRhdGlvbi5kYXRhKVxuICAgIH1cbiAgICByZXR1cm4gUi5yZWR1Y2UoYXBwbHlNdXRhdGlvbiwgc3RhdGUsIG11dGF0aW9ucylcbiAgfVxuXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgbXV0YXRpb25zUGF0aH0sIFBBQ0tBR0UpXG4gICAgY2hlY2tSZXF1aXJlZEZpbGVzKFttdXRhdGlvbnNQYXRoXSwgUEFDS0FHRSlcbiAgICByZXR1cm4ge1xuICAgICAgbXV0YXRlOiBmdW5jdGlvbiBtdXRhdGUgKHttdXRhdGlvbiwgb2JqSWQsIGRhdGEsIG1ldGF9KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY2hlY2tSZXF1aXJlZCh7b2JqSWQsIG11dGF0aW9ufSwgUEFDS0FHRSlcbiAgICAgICAgICB2YXIgbXV0YXRpb25zRnVuY3Rpb25zID0gZ2V0TXV0YXRpb25zRnVuY3Rpb25zKG11dGF0aW9uc1BhdGgpXG4gICAgICAgICAgY2hlY2tNdXRhdGlvbkZ1bmN0aW9uKG11dGF0aW9uLCBtdXRhdGlvbnNGdW5jdGlvbnMpXG4gICAgICAgICAgdmFyIGxhc3RNdXRhdGlvblZlcnNpb24gPSBtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25dWzBdLm11dGF0aW9uVmVyc2lvblxuICAgICAgICAgIHZhciBtdXRhdGlvblN0YXRlID0ge1xuICAgICAgICAgICAgb2JqSWQ6IG9iaklkLFxuICAgICAgICAgICAgbXV0YXRpb24sXG4gICAgICAgICAgICBtZXRhLFxuICAgICAgICAgICAgdmVyc2lvbjogbGFzdE11dGF0aW9uVmVyc2lvbixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwLFxuICAgICAgICAgICAgZGF0YVxuICAgICAgICAgIH1cbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdkYXRhU2luZ2xlTXV0YXRpb24gdG8gY3JlYXRlJywge211dGF0aW9uLCBsYXN0TXV0YXRpb25WZXJzaW9uLCBvYmpJZCwgZGF0YSwgbXV0YXRpb25TdGF0ZX0pXG4gICAgICAgICAgcmV0dXJuIG11dGF0aW9uU3RhdGVcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlcnJvclRocm93KCdtdXRhdGUoYXJncykgRXJyb3InLCB7ZXJyb3IsIG11dGF0aW9uLCBvYmpJZCwgZGF0YX0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhcHBseU11dGF0aW9uczogYXN5bmMgZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnMgKHtzdGF0ZSwgbXV0YXRpb25zfSkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdhcHBseU11dGF0aW9uc0Zyb21QYXRoJywge3N0YXRlLCBtdXRhdGlvbnMsIG11dGF0aW9uc1BhdGh9KVxuICAgICAgICByZXR1cm4gYXBwbHlNdXRhdGlvbnNGcm9tUGF0aChzdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRoKVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnJvclRocm93KCdnZXRNdXRhdGlvbnNDcXJzUGFja2FnZScsIHtlcnJvciwgbXV0YXRpb25zUGF0aCwgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2V9KVxuICB9XG59XG4iXX0=