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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11dGF0aW9ucy5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsInBhdGgiLCJmcyIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiY2hlY2tSZXF1aXJlZEZpbGVzIiwiZ2V0TXV0YXRpb25zRnVuY3Rpb25zIiwiYmFzZVBhdGgiLCJmaWxlc0pzTm9FeHRlbnNpb24iLCJtYXAiLCJjb21wb3NlIiwicmVwbGFjZSIsImJhc2VuYW1lIiwiZmlsdGVyIiwiZmlsZSIsImV4dG5hbWUiLCJyZWFkZGlyU3luYyIsInNwbGl0RmlsZXMiLCJzcGxpdCIsInNvcnRGaWxlcyIsInJldmVyc2UiLCJzb3J0QnkiLCJwYXJzZUludCIsInByb3AiLCJncm91cEZpbGVzIiwiZ3JvdXBCeSIsImFkZEZ1bmN0aW9uIiwiZWxlbWVudCIsIm11dGF0aW9uSWQiLCJtdXRhdGlvblZlcnNpb24iLCJtdXRhdGlvbnNGdW5jdGlvbnMiLCJjaGVja011dGF0aW9uRnVuY3Rpb24iLCJlcnJvclRocm93IiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE11dGF0aW9uc0NxcnNQYWNrYWdlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJtdXRhdGlvbnNQYXRoIiwibXV0YXRpb25zU3RvcmFnZVBhY2thZ2UiLCJMT0ciLCJhcHBseU11dGF0aW9uc0Zyb21QYXRoIiwiYXBwbHlNdXRhdGlvbnNGcm9tUGF0aEZ1bmMiLCJvcmlnaW5hbFN0YXRlIiwibXV0YXRpb25zIiwic3RhdGUiLCJjbG9uZSIsImRlYnVnIiwiYXBwbHlNdXRhdGlvbiIsIm11dGF0aW9uIiwibXV0YXRpb25GaWxlIiwiam9pbiIsInZlcnNpb24iLCJkYXRhIiwicmVkdWNlIiwibXV0YXRlIiwib2JqSWQiLCJtZXRhIiwibGFzdE11dGF0aW9uVmVyc2lvbiIsIm11dGF0aW9uU3RhdGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwiZ2V0VGltZSIsImluc2VydCIsIm9ianMiLCJlcnJvciIsImdldE9iak11dGF0aW9ucyIsIm1pblRpbWVzdGFtcCIsImZpbmQiLCJxdWVyeSIsIiRndGUiLCJzb3J0IiwicmVzdWx0cyIsImFwcGx5TXV0YXRpb25zIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBSUMsT0FBT0QsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJRSxLQUFLRixRQUFRLElBQVIsQ0FBVDtBQUNBLElBQU1HLFVBQVUsZ0JBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCSixRQUFRLFNBQVIsRUFBbUJJLGFBQXpDO0FBQ0EsSUFBSUMscUJBQXFCTCxRQUFRLFNBQVIsRUFBbUJLLGtCQUE1Qzs7QUFFQSxTQUFTQyxxQkFBVCxDQUFnQ0MsUUFBaEMsRUFBMEM7QUFDeEMsTUFBSUMscUJBQXFCVCxFQUFFVSxHQUFGLENBQU1WLEVBQUVXLE9BQUYsQ0FBVVgsRUFBRVksT0FBRixDQUFVLEtBQVYsRUFBaUIsRUFBakIsQ0FBVixFQUFnQ1YsS0FBS1csUUFBckMsQ0FBTixFQUFzRGIsRUFBRWMsTUFBRixDQUFTLFVBQUNDLElBQUQ7QUFBQSxXQUFVYixLQUFLYyxPQUFMLENBQWFELElBQWIsTUFBdUIsS0FBakM7QUFBQSxHQUFULEVBQWlEWixHQUFHYyxXQUFILENBQWVULFFBQWYsQ0FBakQsQ0FBdEQsQ0FBekI7QUFDQSxNQUFJVSxhQUFhbEIsRUFBRVUsR0FBRixDQUFNVixFQUFFbUIsS0FBRixDQUFRLEdBQVIsQ0FBTixDQUFqQjtBQUNBLE1BQUlDLFlBQVlwQixFQUFFVyxPQUFGLENBQVVYLEVBQUVxQixPQUFaLEVBQXFCckIsRUFBRXNCLE1BQUYsQ0FBU3RCLEVBQUVXLE9BQUYsQ0FBVVksUUFBVixFQUFvQnZCLEVBQUV3QixJQUFGLENBQU8sQ0FBUCxDQUFwQixDQUFULENBQXJCLENBQWhCO0FBQ0EsTUFBSUMsYUFBYXpCLEVBQUUwQixPQUFGLENBQVUxQixFQUFFd0IsSUFBRixDQUFPLENBQVAsQ0FBVixDQUFqQjtBQUNBLE1BQUlHLGNBQWMzQixFQUFFVSxHQUFGLENBQU1W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c0JLLGdCQUF0QixFQUE3QjtBQVJlLHdEQVNSQSxPQVRROztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBdEJaO0FBaUNMQyw0QkFBZ0IsU0FBZUEsY0FBZjtBQUFBLGtCQUFnQzVCLEtBQWhDLFNBQWdDQSxLQUFoQztBQUFBLGtCQUF1Q0QsU0FBdkMsU0FBdUNBLFNBQXZDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDZEosMEJBQUlPLEtBQUosQ0FBVSx3QkFBVixFQUFvQyxFQUFDRixZQUFELEVBQVFELG9CQUFSLEVBQW1CTiw0QkFBbkIsRUFBcEM7QUFEYyx3REFFUEcsdUJBQXVCSSxLQUF2QixFQUE4QkQsU0FBOUIsRUFBeUNOLGFBQXpDLENBRk87O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFqQ1gsV0FqQk07O0FBQUE7QUFBQTtBQUFBOztBQXdEYk4scUJBQVcseUJBQVgsRUFBc0MsRUFBQ2lDLG1CQUFELEVBQVEzQiw0QkFBUixFQUF1QkMsZ0RBQXZCLEVBQXRDOztBQXhEYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJtdXRhdGlvbnMuY3Fycy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBQQUNLQUdFID0gJ211dGF0aW9ucy5jcXJzJ1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG52YXIgY2hlY2tSZXF1aXJlZEZpbGVzID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRGaWxlc1xuXG5mdW5jdGlvbiBnZXRNdXRhdGlvbnNGdW5jdGlvbnMgKGJhc2VQYXRoKSB7XG4gIHZhciBmaWxlc0pzTm9FeHRlbnNpb24gPSBSLm1hcChSLmNvbXBvc2UoUi5yZXBsYWNlKCcuanMnLCAnJyksIHBhdGguYmFzZW5hbWUpLCBSLmZpbHRlcigoZmlsZSkgPT4gcGF0aC5leHRuYW1lKGZpbGUpID09PSAnLmpzJywgZnMucmVhZGRpclN5bmMoYmFzZVBhdGgpKSlcbiAgdmFyIHNwbGl0RmlsZXMgPSBSLm1hcChSLnNwbGl0KCcuJykpXG4gIHZhciBzb3J0RmlsZXMgPSBSLmNvbXBvc2UoUi5yZXZlcnNlLCBSLnNvcnRCeShSLmNvbXBvc2UocGFyc2VJbnQsIFIucHJvcCgwKSkpKVxuICB2YXIgZ3JvdXBGaWxlcyA9IFIuZ3JvdXBCeShSLnByb3AoMCkpXG4gIHZhciBhZGRGdW5jdGlvbiA9IFIubWFwKFIubWFwKChlbGVtZW50KSA9PiB7XG4gICAgcmV0dXJuIHttdXRhdGlvbklkOiBlbGVtZW50WzBdLCBtdXRhdGlvblZlcnNpb246IGVsZW1lbnRbMV19XG4gIH0pKVxuICB2YXIgbXV0YXRpb25zRnVuY3Rpb25zID0gUi5jb21wb3NlKGFkZEZ1bmN0aW9uLCBncm91cEZpbGVzLCBzb3J0RmlsZXMsIHNwbGl0RmlsZXMpKGZpbGVzSnNOb0V4dGVuc2lvbilcbiAgLy8gZGVidWcoJ2dldE11dGF0aW9uc0Z1bmN0aW9ucycsIG11dGF0aW9uc0Z1bmN0aW9ucylcbiAgcmV0dXJuIG11dGF0aW9uc0Z1bmN0aW9uc1xufVxuXG5mdW5jdGlvbiBjaGVja011dGF0aW9uRnVuY3Rpb24gKG11dGF0aW9uSWQsIG11dGF0aW9uc0Z1bmN0aW9ucykge1xuICBpZiAoIW11dGF0aW9uc0Z1bmN0aW9uc1ttdXRhdGlvbklkXSB8fCAhbXV0YXRpb25zRnVuY3Rpb25zW211dGF0aW9uSWRdWzBdKSB7XG4gICAgZXJyb3JUaHJvdygnbXV0YXRpb24gbm90IGRlZmluZWQnLCB7bXV0YXRpb25JZH0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBnZXRNdXRhdGlvbnNDcXJzUGFja2FnZSAoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIG11dGF0aW9uc1BhdGgsIG11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlfSkge1xuICB2YXIgTE9HID0gcmVxdWlyZSgnLi9qZXN1cycpLkxPRyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB2YXIgZXJyb3JUaHJvdyA9IHJlcXVpcmUoJy4vamVzdXMnKS5lcnJvclRocm93KHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG5cbiAgdmFyIGFwcGx5TXV0YXRpb25zRnJvbVBhdGggPSBmdW5jdGlvbiBhcHBseU11dGF0aW9uc0Zyb21QYXRoRnVuYyAob3JpZ2luYWxTdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRoKSB7XG4gICAgdmFyIHN0YXRlID0gUi5jbG9uZShvcmlnaW5hbFN0YXRlKVxuICAgIExPRy5kZWJ1ZygnYXBwbHlNdXRhdGlvbnNGcm9tUGF0aCcsIHtzdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRofSlcbiAgICBmdW5jdGlvbiBhcHBseU11dGF0aW9uIChzdGF0ZSwgbXV0YXRpb24pIHtcbiAgICAgIHZhciBtdXRhdGlvbkZpbGUgPSBwYXRoLmpvaW4obXV0YXRpb25zUGF0aCwgYCR7bXV0YXRpb24ubXV0YXRpb259LiR7bXV0YXRpb24udmVyc2lvbn0uanNgKVxuICAgICAgcmV0dXJuIHJlcXVpcmUobXV0YXRpb25GaWxlKShzdGF0ZSwgbXV0YXRpb24uZGF0YSlcbiAgICB9XG4gICAgcmV0dXJuIFIucmVkdWNlKGFwcGx5TXV0YXRpb24sIHN0YXRlLCBtdXRhdGlvbnMpXG4gIH1cblxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIG11dGF0aW9uc1BhdGgsIG11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlfSwgUEFDS0FHRSlcbiAgICBjaGVja1JlcXVpcmVkRmlsZXMoW211dGF0aW9uc1BhdGhdLCBQQUNLQUdFKVxuICAgIHJldHVybiB7XG4gICAgICBtdXRhdGU6IGFzeW5jIGZ1bmN0aW9uIG11dGF0ZSAoe211dGF0aW9uLCBvYmpJZCwgZGF0YSwgbWV0YX0pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjaGVja1JlcXVpcmVkKHtvYmpJZCwgbXV0YXRpb259LCBQQUNLQUdFKVxuICAgICAgICAgIHZhciBtdXRhdGlvbnNGdW5jdGlvbnMgPSBnZXRNdXRhdGlvbnNGdW5jdGlvbnMobXV0YXRpb25zUGF0aClcbiAgICAgICAgICBjaGVja011dGF0aW9uRnVuY3Rpb24obXV0YXRpb24sIG11dGF0aW9uc0Z1bmN0aW9ucylcbiAgICAgICAgICB2YXIgbGFzdE11dGF0aW9uVmVyc2lvbiA9IG11dGF0aW9uc0Z1bmN0aW9uc1ttdXRhdGlvbl1bMF0ubXV0YXRpb25WZXJzaW9uXG4gICAgICAgICAgdmFyIG11dGF0aW9uU3RhdGUgPSB7XG4gICAgICAgICAgICBvYmpJZDogb2JqSWQsXG4gICAgICAgICAgICBtdXRhdGlvbixcbiAgICAgICAgICAgIG1ldGEsXG4gICAgICAgICAgICB2ZXJzaW9uOiBsYXN0TXV0YXRpb25WZXJzaW9uLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDAsXG4gICAgICAgICAgICBkYXRhXG4gICAgICAgICAgfVxuICAgICAgICAgIExPRy5kZWJ1ZygnZGF0YVNpbmdsZU11dGF0aW9uIHRvIGNyZWF0ZScsIHttdXRhdGlvbiwgbGFzdE11dGF0aW9uVmVyc2lvbiwgb2JqSWQsIGRhdGEsIG11dGF0aW9uU3RhdGV9KVxuICAgICAgICAgIGF3YWl0IG11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlLmluc2VydCh7b2JqczogW211dGF0aW9uU3RhdGVdfSlcbiAgICAgICAgICByZXR1cm4gbXV0YXRpb25TdGF0ZVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGVycm9yVGhyb3coJ211dGF0ZShhcmdzKSBFcnJvcicsIHtlcnJvciwgbXV0YXRpb24sIG9iaklkLCBkYXRhfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGdldE9iak11dGF0aW9uczogYXN5bmMgZnVuY3Rpb24gZ2V0T2JqTXV0YXRpb25zICh7b2JqSWQsIG1pblRpbWVzdGFtcCA9IDB9KSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gYXdhaXQgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2UuZmluZCh7XG4gICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgIG9iaklkOiBvYmpJZCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogeyRndGU6IG1pblRpbWVzdGFtcH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNvcnQ6IHt0aW1lc3RhbXA6IDF9XG4gICAgICAgIH0pXG4gICAgICAgIExPRy5kZWJ1ZygnZ2V0T2JqTXV0YXRpb25zJywge29iaklkLCBtaW5UaW1lc3RhbXAsIHJlc3VsdHN9KVxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfSxcbiAgICAgIGFwcGx5TXV0YXRpb25zOiBhc3luYyBmdW5jdGlvbiBhcHBseU11dGF0aW9ucyAoe3N0YXRlLCBtdXRhdGlvbnN9KSB7XG4gICAgICAgIExPRy5kZWJ1ZygnYXBwbHlNdXRhdGlvbnNGcm9tUGF0aCcsIHtzdGF0ZSwgbXV0YXRpb25zLCBtdXRhdGlvbnNQYXRofSlcbiAgICAgICAgcmV0dXJuIGFwcGx5TXV0YXRpb25zRnJvbVBhdGgoc3RhdGUsIG11dGF0aW9ucywgbXV0YXRpb25zUGF0aClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JUaHJvdygnZ2V0TXV0YXRpb25zQ3Fyc1BhY2thZ2UnLCB7ZXJyb3IsIG11dGF0aW9uc1BhdGgsIG11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlfSlcbiAgfVxufVxuIl19