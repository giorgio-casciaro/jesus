'use strict';

var R = require('ramda');
var path = require('path');
var fs = require('fs');
var PACKAGE = 'mutations.cqrs';
var checkRequired = require('./jesus').checkRequired;
var checkRequiredFiles = require('./jesus').checkRequiredFiles;
var uuidV4 = require('uuid/v4');

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

function generateId() {
  return uuidV4();
}
module.exports = function getMutationsCqrsPackage(_ref) {
  var getConsole = _ref.getConsole,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      mutationsPath = _ref.mutationsPath;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);

  var applyMutationsFromPath = function applyMutationsFromPathFunc(originalState, mutations, mutationsPath) {
    var state = R.clone(originalState);
    CONSOLE.debug('applyMutationsFromPath', { state: state, mutations: mutations, mutationsPath: mutationsPath });
    function applyMutation(state, mutation) {
      var mutationFile = path.join(mutationsPath, mutation.mutation + '.' + mutation.version + '.js');
      CONSOLE.debug('applyMutation', { mutationFile: mutationFile, state: state, data: mutation.data });
      return require(mutationFile)(state, mutation.data);
    }
    return R.reduce(applyMutation, state, mutations);
  };

  try {
    checkRequired({ mutationsPath: mutationsPath }, PACKAGE);
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
            _id: generateId(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11dGF0aW9ucy5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsInBhdGgiLCJmcyIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiY2hlY2tSZXF1aXJlZEZpbGVzIiwidXVpZFY0IiwiZ2V0TXV0YXRpb25zRnVuY3Rpb25zIiwiYmFzZVBhdGgiLCJmaWxlc0pzTm9FeHRlbnNpb24iLCJtYXAiLCJjb21wb3NlIiwicmVwbGFjZSIsImJhc2VuYW1lIiwiZmlsdGVyIiwiZmlsZSIsImV4dG5hbWUiLCJyZWFkZGlyU3luYyIsInNwbGl0RmlsZXMiLCJzcGxpdCIsInNvcnRGaWxlcyIsInJldmVyc2UiLCJzb3J0QnkiLCJwYXJzZUludCIsInByb3AiLCJncm91cEZpbGVzIiwiZ3JvdXBCeSIsImFkZEZ1bmN0aW9uIiwiZWxlbWVudCIsIm11dGF0aW9uSWQiLCJtdXRhdGlvblZlcnNpb24iLCJtdXRhdGlvbnNGdW5jdGlvbnMiLCJjaGVja011dGF0aW9uRnVuY3Rpb24iLCJlcnJvclRocm93IiwiZ2VuZXJhdGVJZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRNdXRhdGlvbnNDcXJzUGFja2FnZSIsImdldENvbnNvbGUiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsIm11dGF0aW9uc1BhdGgiLCJDT05TT0xFIiwiYXBwbHlNdXRhdGlvbnNGcm9tUGF0aCIsImFwcGx5TXV0YXRpb25zRnJvbVBhdGhGdW5jIiwib3JpZ2luYWxTdGF0ZSIsIm11dGF0aW9ucyIsInN0YXRlIiwiY2xvbmUiLCJkZWJ1ZyIsImFwcGx5TXV0YXRpb24iLCJtdXRhdGlvbiIsIm11dGF0aW9uRmlsZSIsImpvaW4iLCJ2ZXJzaW9uIiwiZGF0YSIsInJlZHVjZSIsIm11dGF0ZSIsIm9iaklkIiwibWV0YSIsImxhc3RNdXRhdGlvblZlcnNpb24iLCJtdXRhdGlvblN0YXRlIiwiX2lkIiwidGltZXN0YW1wIiwiRGF0ZSIsImdldFRpbWUiLCJlcnJvciIsImFwcGx5TXV0YXRpb25z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aEREIiwiZmlsZSI6Im11dGF0aW9ucy5jcXJzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IFBBQ0tBR0UgPSAnbXV0YXRpb25zLmNxcnMnXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbnZhciBjaGVja1JlcXVpcmVkRmlsZXMgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZEZpbGVzXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcblxuZnVuY3Rpb24gZ2V0TXV0YXRpb25zRnVuY3Rpb25zIChiYXNlUGF0aCkge1xuICB2YXIgZmlsZXNKc05vRXh0ZW5zaW9uID0gUi5tYXAoUi5jb21wb3NlKFIucmVwbGFjZSgnLmpzJywgJycpLCBwYXRoLmJhc2VuYW1lKSwgUi5maWx0ZXIoKGZpbGUpID0+IHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy5qcycsIGZzLnJlYWRkaXJTeW5jKGJhc2VQYXRoKSkpXG4gIHZhciBzcGxpdEZpbGVzID0gUi5tYXAoUi5zcGxpdCgnLicpKVxuICB2YXIgc29ydEZpbGVzID0gUi5jb21wb3NlKFIucmV2ZXJzZSwgUi5zb3J0QnkoUi5jb21wb3NlKHBhcnNlSW50LCBSLnByb3AoMCkpKSlcbiAgdmFyIGdyb3VwRmlsZXMgPSBSLmdyb3VwQnkoUi5wcm9wKDApKVxuICB2YXIgYWRkRnVuY3Rpb24gPSBSLm1hcChSLm1hcCgoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiB7bXV0YXRpb25JZDogZWxlbWVudFswXSwgbXV0YXRpb25WZXJzaW9uOiBlbGVtZW50WzFdfVxuICB9KSlcbiAgdmFyIG11dGF0aW9uc0Z1bmN0aW9ucyA9IFIuY29tcG9zZShhZGRGdW5jdGlvbiwgZ3JvdXBGaWxlcywgc29ydEZpbGVzLCBzcGxpdEZpbGVzKShmaWxlc0pzTm9FeHRlbnNpb24pXG4gIC8vIGRlYnVnKCdnZXRNdXRhdGlvbnNGdW5jdGlvbnMnLCBtdXRhdGlvbnNGdW5jdGlvbnMpXG4gIHJldHVybiBtdXRhdGlvbnNGdW5jdGlvbnNcbn1cblxuZnVuY3Rpb24gY2hlY2tNdXRhdGlvbkZ1bmN0aW9uIChtdXRhdGlvbklkLCBtdXRhdGlvbnNGdW5jdGlvbnMpIHtcbiAgaWYgKCFtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25JZF0gfHwgIW11dGF0aW9uc0Z1bmN0aW9uc1ttdXRhdGlvbklkXVswXSkge1xuICAgIGVycm9yVGhyb3coJ211dGF0aW9uIG5vdCBkZWZpbmVkJywge211dGF0aW9uSWR9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSWQgKCkgeyByZXR1cm4gdXVpZFY0KCkgfVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRNdXRhdGlvbnNDcXJzUGFja2FnZSAoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnLCBtdXRhdGlvbnNQYXRofSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG4gIHZhciBhcHBseU11dGF0aW9uc0Zyb21QYXRoID0gZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnNGcm9tUGF0aEZ1bmMgKG9yaWdpbmFsU3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aCkge1xuICAgIHZhciBzdGF0ZSA9IFIuY2xvbmUob3JpZ2luYWxTdGF0ZSlcbiAgICBDT05TT0xFLmRlYnVnKCdhcHBseU11dGF0aW9uc0Zyb21QYXRoJywge3N0YXRlLCBtdXRhdGlvbnMsIG11dGF0aW9uc1BhdGh9KVxuICAgIGZ1bmN0aW9uIGFwcGx5TXV0YXRpb24gKHN0YXRlLCBtdXRhdGlvbikge1xuICAgICAgdmFyIG11dGF0aW9uRmlsZSA9IHBhdGguam9pbihtdXRhdGlvbnNQYXRoLCBgJHttdXRhdGlvbi5tdXRhdGlvbn0uJHttdXRhdGlvbi52ZXJzaW9ufS5qc2ApXG4gICAgICBDT05TT0xFLmRlYnVnKCdhcHBseU11dGF0aW9uJywge211dGF0aW9uRmlsZSwgc3RhdGUsIGRhdGE6IG11dGF0aW9uLmRhdGF9KVxuICAgICAgcmV0dXJuIHJlcXVpcmUobXV0YXRpb25GaWxlKShzdGF0ZSwgbXV0YXRpb24uZGF0YSlcbiAgICB9XG4gICAgcmV0dXJuIFIucmVkdWNlKGFwcGx5TXV0YXRpb24sIHN0YXRlLCBtdXRhdGlvbnMpXG4gIH1cblxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe211dGF0aW9uc1BhdGh9LCBQQUNLQUdFKVxuICAgIGNoZWNrUmVxdWlyZWRGaWxlcyhbbXV0YXRpb25zUGF0aF0sIFBBQ0tBR0UpXG4gICAgcmV0dXJuIHtcbiAgICAgIG11dGF0ZTogZnVuY3Rpb24gbXV0YXRlICh7bXV0YXRpb24sIG9iaklkLCBkYXRhLCBtZXRhfSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNoZWNrUmVxdWlyZWQoe29iaklkLCBtdXRhdGlvbn0sIFBBQ0tBR0UpXG4gICAgICAgICAgdmFyIG11dGF0aW9uc0Z1bmN0aW9ucyA9IGdldE11dGF0aW9uc0Z1bmN0aW9ucyhtdXRhdGlvbnNQYXRoKVxuICAgICAgICAgIGNoZWNrTXV0YXRpb25GdW5jdGlvbihtdXRhdGlvbiwgbXV0YXRpb25zRnVuY3Rpb25zKVxuICAgICAgICAgIHZhciBsYXN0TXV0YXRpb25WZXJzaW9uID0gbXV0YXRpb25zRnVuY3Rpb25zW211dGF0aW9uXVswXS5tdXRhdGlvblZlcnNpb25cbiAgICAgICAgICB2YXIgbXV0YXRpb25TdGF0ZSA9IHtcbiAgICAgICAgICAgIG9iaklkOiBvYmpJZCxcbiAgICAgICAgICAgIF9pZDogZ2VuZXJhdGVJZCgpLFxuICAgICAgICAgICAgbXV0YXRpb24sXG4gICAgICAgICAgICBtZXRhLFxuICAgICAgICAgICAgdmVyc2lvbjogbGFzdE11dGF0aW9uVmVyc2lvbixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwLFxuICAgICAgICAgICAgZGF0YVxuICAgICAgICAgIH1cbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdkYXRhU2luZ2xlTXV0YXRpb24gdG8gY3JlYXRlJywge211dGF0aW9uLCBsYXN0TXV0YXRpb25WZXJzaW9uLCBvYmpJZCwgZGF0YSwgbXV0YXRpb25TdGF0ZX0pXG4gICAgICAgICAgcmV0dXJuIG11dGF0aW9uU3RhdGVcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlcnJvclRocm93KCdtdXRhdGUoYXJncykgRXJyb3InLCB7ZXJyb3IsIG11dGF0aW9uLCBvYmpJZCwgZGF0YX0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhcHBseU11dGF0aW9uczogYXN5bmMgZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnMgKHtzdGF0ZSwgbXV0YXRpb25zfSkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdhcHBseU11dGF0aW9uc0Zyb21QYXRoJywge3N0YXRlLCBtdXRhdGlvbnMsIG11dGF0aW9uc1BhdGh9KVxuICAgICAgICByZXR1cm4gYXBwbHlNdXRhdGlvbnNGcm9tUGF0aChzdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRoKVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnJvclRocm93KCdnZXRNdXRhdGlvbnNDcXJzUGFja2FnZScsIHtlcnJvciwgbXV0YXRpb25zUGF0aCwgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2V9KVxuICB9XG59XG4iXX0=