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
  var serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      mutationsPath = _ref.mutationsPath,
      mutationsStoragePackage = _ref.mutationsStoragePackage;
  var LOG, errorThrow, applyMutationsFromPath;
  return regeneratorRuntime.async(function getMutationsCqrsPackage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE);
          errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);

          applyMutationsFromPath = function applyMutationsFromPathFunc(originalState, mutations, mutationsPath) {
            var state = R.clone(originalState);
            LOG.debug('applyMutationsFromPath', { state: state, mutations: mutations, mutationsPath: mutationsPath });
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

                      LOG.debug('dataSingleMutation to create', { mutation: mutation, lastMutationVersion: lastMutationVersion, objId: objId, data: data, mutationState: mutationState });
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

                      LOG.debug('getObjMutations', { objId: objId, minTimestamp: minTimestamp, results: results });
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
                      LOG.debug('applyMutationsFromPath', { state: state, mutations: mutations, mutationsPath: mutationsPath });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11dGF0aW9ucy5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsInBhdGgiLCJmcyIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiY2hlY2tSZXF1aXJlZEZpbGVzIiwiZ2V0TXV0YXRpb25zRnVuY3Rpb25zIiwiYmFzZVBhdGgiLCJmaWxlc0pzTm9FeHRlbnNpb24iLCJtYXAiLCJjb21wb3NlIiwicmVwbGFjZSIsImJhc2VuYW1lIiwiZmlsdGVyIiwiZmlsZSIsImV4dG5hbWUiLCJyZWFkZGlyU3luYyIsInNwbGl0RmlsZXMiLCJzcGxpdCIsInNvcnRGaWxlcyIsInJldmVyc2UiLCJzb3J0QnkiLCJwYXJzZUludCIsInByb3AiLCJncm91cEZpbGVzIiwiZ3JvdXBCeSIsImFkZEZ1bmN0aW9uIiwiZWxlbWVudCIsIm11dGF0aW9uSWQiLCJtdXRhdGlvblZlcnNpb24iLCJtdXRhdGlvbnNGdW5jdGlvbnMiLCJjaGVja011dGF0aW9uRnVuY3Rpb24iLCJlcnJvclRocm93IiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE11dGF0aW9uc0NxcnNQYWNrYWdlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJtdXRhdGlvbnNQYXRoIiwibXV0YXRpb25zU3RvcmFnZVBhY2thZ2UiLCJMT0ciLCJhcHBseU11dGF0aW9uc0Zyb21QYXRoIiwiYXBwbHlNdXRhdGlvbnNGcm9tUGF0aEZ1bmMiLCJvcmlnaW5hbFN0YXRlIiwibXV0YXRpb25zIiwic3RhdGUiLCJjbG9uZSIsImRlYnVnIiwiYXBwbHlNdXRhdGlvbiIsIm11dGF0aW9uIiwibXV0YXRpb25GaWxlIiwiam9pbiIsInZlcnNpb24iLCJkYXRhIiwicmVkdWNlIiwibXV0YXRlIiwib2JqSWQiLCJsYXN0TXV0YXRpb25WZXJzaW9uIiwibXV0YXRpb25TdGF0ZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJnZXRUaW1lIiwiaW5zZXJ0Iiwib2JqcyIsImVycm9yIiwiZ2V0T2JqTXV0YXRpb25zIiwibWluVGlt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QUFBO0FBQUE7QUFBQSxhQXJCWjtBQWdDTEMsNEJBQWdCLFNBQWVBLGNBQWY7QUFBQSxrQkFBZ0MzQixLQUFoQyxTQUFnQ0EsS0FBaEM7QUFBQSxrQkFBdUNELFNBQXZDLFNBQXVDQSxTQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ2RKLDBCQUFJTyxLQUFKLENBQVUsd0JBQVYsRUFBb0MsRUFBQ0YsWUFBRCxFQUFRRCxvQkFBUixFQUFtQk4sNEJBQW5CLEVBQXBDO0FBRGMsd0RBRVBHLHVCQUF1QkksS0FBdkIsRUFBOEJELFNBQTlCLEVBQXlDTixhQUF6QyxDQUZPOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBaENYLFdBakJNOztBQUFBO0FBQUE7QUFBQTs7QUF1RGJOLHFCQUFXLHlCQUFYLEVBQXNDLEVBQUNnQyxtQkFBRCxFQUFRMUIsNEJBQVIsRUFBdUJDLGdEQUF2QixFQUF0Qzs7QUF2RGE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoibXV0YXRpb25zLmNxcnMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgUEFDS0FHRSA9ICdtdXRhdGlvbnMuY3FycydcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxudmFyIGNoZWNrUmVxdWlyZWRGaWxlcyA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkRmlsZXNcblxuZnVuY3Rpb24gZ2V0TXV0YXRpb25zRnVuY3Rpb25zIChiYXNlUGF0aCkge1xuICB2YXIgZmlsZXNKc05vRXh0ZW5zaW9uID0gUi5tYXAoUi5jb21wb3NlKFIucmVwbGFjZSgnLmpzJywgJycpLCBwYXRoLmJhc2VuYW1lKSwgUi5maWx0ZXIoKGZpbGUpID0+IHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy5qcycsIGZzLnJlYWRkaXJTeW5jKGJhc2VQYXRoKSkpXG4gIHZhciBzcGxpdEZpbGVzID0gUi5tYXAoUi5zcGxpdCgnLicpKVxuICB2YXIgc29ydEZpbGVzID0gUi5jb21wb3NlKFIucmV2ZXJzZSwgUi5zb3J0QnkoUi5jb21wb3NlKHBhcnNlSW50LCBSLnByb3AoMCkpKSlcbiAgdmFyIGdyb3VwRmlsZXMgPSBSLmdyb3VwQnkoUi5wcm9wKDApKVxuICB2YXIgYWRkRnVuY3Rpb24gPSBSLm1hcChSLm1hcCgoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiB7bXV0YXRpb25JZDogZWxlbWVudFswXSwgbXV0YXRpb25WZXJzaW9uOiBlbGVtZW50WzFdfVxuICB9KSlcbiAgdmFyIG11dGF0aW9uc0Z1bmN0aW9ucyA9IFIuY29tcG9zZShhZGRGdW5jdGlvbiwgZ3JvdXBGaWxlcywgc29ydEZpbGVzLCBzcGxpdEZpbGVzKShmaWxlc0pzTm9FeHRlbnNpb24pXG4gIC8vIGRlYnVnKCdnZXRNdXRhdGlvbnNGdW5jdGlvbnMnLCBtdXRhdGlvbnNGdW5jdGlvbnMpXG4gIHJldHVybiBtdXRhdGlvbnNGdW5jdGlvbnNcbn1cblxuZnVuY3Rpb24gY2hlY2tNdXRhdGlvbkZ1bmN0aW9uIChtdXRhdGlvbklkLCBtdXRhdGlvbnNGdW5jdGlvbnMpIHtcbiAgaWYgKCFtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25JZF0gfHwgIW11dGF0aW9uc0Z1bmN0aW9uc1ttdXRhdGlvbklkXVswXSkge1xuICAgIGVycm9yVGhyb3coJ211dGF0aW9uIG5vdCBkZWZpbmVkJywge211dGF0aW9uSWR9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UgKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBtdXRhdGlvbnNQYXRoLCBtdXRhdGlvbnNTdG9yYWdlUGFja2FnZX0pIHtcbiAgdmFyIExPRyA9IHJlcXVpcmUoJy4vamVzdXMnKS5MT0coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuXG4gIHZhciBhcHBseU11dGF0aW9uc0Zyb21QYXRoID0gZnVuY3Rpb24gYXBwbHlNdXRhdGlvbnNGcm9tUGF0aEZ1bmMgKG9yaWdpbmFsU3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aCkge1xuICAgIHZhciBzdGF0ZSA9IFIuY2xvbmUob3JpZ2luYWxTdGF0ZSlcbiAgICBMT0cuZGVidWcoJ2FwcGx5TXV0YXRpb25zRnJvbVBhdGgnLCB7c3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aH0pXG4gICAgZnVuY3Rpb24gYXBwbHlNdXRhdGlvbiAoc3RhdGUsIG11dGF0aW9uKSB7XG4gICAgICB2YXIgbXV0YXRpb25GaWxlID0gcGF0aC5qb2luKG11dGF0aW9uc1BhdGgsIGAke211dGF0aW9uLm11dGF0aW9ufS4ke211dGF0aW9uLnZlcnNpb259LmpzYClcbiAgICAgIHJldHVybiByZXF1aXJlKG11dGF0aW9uRmlsZSkoc3RhdGUsIG11dGF0aW9uLmRhdGEpXG4gICAgfVxuICAgIHJldHVybiBSLnJlZHVjZShhcHBseU11dGF0aW9uLCBzdGF0ZSwgbXV0YXRpb25zKVxuICB9XG5cbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBtdXRhdGlvbnNQYXRoLCBtdXRhdGlvbnNTdG9yYWdlUGFja2FnZX0sIFBBQ0tBR0UpXG4gICAgY2hlY2tSZXF1aXJlZEZpbGVzKFttdXRhdGlvbnNQYXRoXSwgUEFDS0FHRSlcbiAgICByZXR1cm4ge1xuICAgICAgbXV0YXRlOiBhc3luYyBmdW5jdGlvbiBtdXRhdGUgKHttdXRhdGlvbiwgb2JqSWQsIGRhdGF9KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY2hlY2tSZXF1aXJlZCh7b2JqSWQsIG11dGF0aW9ufSwgUEFDS0FHRSlcbiAgICAgICAgICB2YXIgbXV0YXRpb25zRnVuY3Rpb25zID0gZ2V0TXV0YXRpb25zRnVuY3Rpb25zKG11dGF0aW9uc1BhdGgpXG4gICAgICAgICAgY2hlY2tNdXRhdGlvbkZ1bmN0aW9uKG11dGF0aW9uLCBtdXRhdGlvbnNGdW5jdGlvbnMpXG4gICAgICAgICAgdmFyIGxhc3RNdXRhdGlvblZlcnNpb24gPSBtdXRhdGlvbnNGdW5jdGlvbnNbbXV0YXRpb25dWzBdLm11dGF0aW9uVmVyc2lvblxuICAgICAgICAgIHZhciBtdXRhdGlvblN0YXRlID0ge1xuICAgICAgICAgICAgb2JqSWQ6IG9iaklkLFxuICAgICAgICAgICAgbXV0YXRpb24sXG4gICAgICAgICAgICB2ZXJzaW9uOiBsYXN0TXV0YXRpb25WZXJzaW9uLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDAsXG4gICAgICAgICAgICBkYXRhXG4gICAgICAgICAgfVxuICAgICAgICAgIExPRy5kZWJ1ZygnZGF0YVNpbmdsZU11dGF0aW9uIHRvIGNyZWF0ZScsIHttdXRhdGlvbiwgbGFzdE11dGF0aW9uVmVyc2lvbiwgb2JqSWQsIGRhdGEsIG11dGF0aW9uU3RhdGV9KVxuICAgICAgICAgIGF3YWl0IG11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlLmluc2VydCh7b2JqczogW211dGF0aW9uU3RhdGVdfSlcbiAgICAgICAgICByZXR1cm4gbXV0YXRpb25TdGF0ZVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGVycm9yVGhyb3coJ211dGF0ZShhcmdzKSBFcnJvcicsIHtlcnJvciwgbXV0YXRpb24sIG9iaklkLCBkYXRhfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGdldE9iak11dGF0aW9uczogYXN5bmMgZnVuY3Rpb24gZ2V0T2JqTXV0YXRpb25zICh7b2JqSWQsIG1pblRpbWVzdGFtcCA9IDB9KSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gYXdhaXQgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2UuZmluZCh7XG4gICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgIG9iaklkOiBvYmpJZCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogeyRndGU6IG1pblRpbWVzdGFtcH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNvcnQ6IHt0aW1lc3RhbXA6IDF9XG4gICAgICAgIH0pXG4gICAgICAgIExPRy5kZWJ1ZygnZ2V0T2JqTXV0YXRpb25zJywge29iaklkLCBtaW5UaW1lc3RhbXAsIHJlc3VsdHN9KVxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfSxcbiAgICAgIGFwcGx5TXV0YXRpb25zOiBhc3luYyBmdW5jdGlvbiBhcHBseU11dGF0aW9ucyAoe3N0YXRlLCBtdXRhdGlvbnN9KSB7XG4gICAgICAgIExPRy5kZWJ1ZygnYXBwbHlNdXRhdGlvbnNGcm9tUGF0aCcsIHtzdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRofSlcbiAgICAgICAgcmV0dXJuIGFwcGx5TXV0YXRpb25zRnJvbVBhdGgoc3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JUaHJvdygnZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UnLCB7ZXJyb3IsIG11dGF0aW9uc1BhdGgsIG11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlfSlcbiAgfVxufVxuIl19