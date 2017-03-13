'use strict';

if (!global._babelPolyfill) require('babel-polyfill');
var R = require('ramda');
// var deref = require('json-schema-deref-sync')
// var faker = require('faker')
// var jsf = require('json-schema-faker')
// faker.locale = 'it'
// var restler = require('restler')
//
var t = require('tap');
var path = require('path');

var jesus = require('../jesus');
var meta = {
  corrid: 'testRequest',
  userid: 'testUser'
};
var getConsole = function getConsole(serviceName, serviceId, pack) {
  return jesus.getConsole({ error: true, debug: true, log: true, warn: true }, serviceName, serviceId, pack);
};
var CONSOLE = getConsole('BASE TEST', '----', '-----');

var mutationsCqrs = require('../mutations.cqrs')({ getConsole: getConsole, mutationsPath: path.join(__dirname, 'mutations') });

t.test('*** VIEWS CQRS ***', {
  autoend: true
}, function mainTest(t) {
  return regeneratorRuntime.async(function mainTest$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          t.plan(1);
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(t.test('mutationsCqrs.mutate -> mutationState', function _callee2(t) {
            var _this = this;

            var mutations, getObjMutations, applyMutations, viewsCqrs, addMutations, viewState;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    mutations = [];

                    mutations.push(mutationsCqrs.mutate({ mutation: 'update', objId: 'testobjId', data: { testData: 1 }, meta: meta }));
                    mutations.push(mutationsCqrs.mutate({ mutation: 'update', objId: 'testobjId', data: { testData2: 1 }, meta: meta }));

                    getObjMutations = function _callee() {
                      return regeneratorRuntime.async(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              return _context.abrupt('return', mutations);

                            case 1:
                            case 'end':
                              return _context.stop();
                          }
                        }
                      }, null, _this);
                    };

                    applyMutations = mutationsCqrs.applyMutations;
                    viewsCqrs = require('../views.cqrs')({ getConsole: getConsole, snapshotsMaxMutations: 10, getObjMutations: getObjMutations, applyMutations: applyMutations });
                    addMutations = [mutations[1], mutationsCqrs.mutate({ mutation: 'update', objId: 'testobjId', data: { testData: 2 }, meta: meta })];
                    _context2.next = 9;
                    return regeneratorRuntime.awrap(viewsCqrs.refreshViews({ objIds: ['testobjId'], loadMutations: true, addMutations: addMutations }));

                  case 9:
                    viewState = _context2.sent;

                    // mutationsCqrs.applyMutations()
                    CONSOLE.debug('viewState', viewState);
                    // t.ok(viewState.timestamp, 'mutationState.timestamp setted')
                    // t.same(viewState.version, '001', 'mutationState.version setted')
                    t.end();

                  case 12:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, this);
          }));

        case 5:

          // await new Promise((resolve) => setTimeout(resolve, 10000))
          t.end();
          process.exit();

        case 7:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzLmNxcnMudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiUiIsInQiLCJwYXRoIiwiamVzdXMiLCJtZXRhIiwiY29ycmlkIiwidXNlcmlkIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsImVycm9yIiwiZGVidWciLCJsb2ciLCJ3YXJuIiwiQ09OU09MRSIsIm11dGF0aW9uc0NxcnMiLCJtdXRhdGlvbnNQYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsInRlc3QiLCJhdXRvZW5kIiwibWFpblRlc3QiLCJwbGFuIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwibXV0YXRpb25zIiwicHVzaCIsIm11dGF0ZSIsIm11dGF0aW9uIiwib2JqSWQiLCJkYXRhIiwidGVzdERhdGEiLCJ0ZXN0RGF0YTIiLCJnZXRPYmpNdXRhdGlvbnMiLCJhcHBseU11dGF0aW9ucyIsInZpZXdzQ3FycyIsInNuYXBzaG90c01heE11dGF0aW9ucyIsImFkZE11dGF0aW9ucyIsInJlZnJlc2hWaWV3cyIsIm9iaklkcyIsImxvYWRNdXRhdGlvbnMiLCJ2aWV3U3RhdGUiLCJlbmQiLCJwcm9jZXNzIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLENBQUNBLE9BQU9DLGNBQVosRUFBMkJDLFFBQVEsZ0JBQVI7QUFDM0IsSUFBSUMsSUFBSUQsUUFBUSxPQUFSLENBQVI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJRSxJQUFJRixRQUFRLEtBQVIsQ0FBUjtBQUNBLElBQUlHLE9BQU9ILFFBQVEsTUFBUixDQUFYOztBQUVBLElBQUlJLFFBQVFKLFFBQVEsVUFBUixDQUFaO0FBQ0EsSUFBSUssT0FBTztBQUNUQyxVQUFRLGFBREM7QUFFVEMsVUFBUTtBQUZDLENBQVg7QUFJQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0MsV0FBRCxFQUFjQyxT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bC5fYmFiZWxQb2x5ZmlsbClyZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpXG52YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbi8vIHZhciBkZXJlZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWRlcmVmLXN5bmMnKVxuLy8gdmFyIGZha2VyID0gcmVxdWlyZSgnZmFrZXInKVxuLy8gdmFyIGpzZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWZha2VyJylcbi8vIGZha2VyLmxvY2FsZSA9ICdpdCdcbi8vIHZhciByZXN0bGVyID0gcmVxdWlyZSgncmVzdGxlcicpXG4vL1xudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxudmFyIGplc3VzID0gcmVxdWlyZSgnLi4vamVzdXMnKVxudmFyIG1ldGEgPSB7XG4gIGNvcnJpZDogJ3Rlc3RSZXF1ZXN0JyxcbiAgdXNlcmlkOiAndGVzdFVzZXInXG59XG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IGplc3VzLmdldENvbnNvbGUoe2Vycm9yOiB0cnVlLCBkZWJ1ZzogdHJ1ZSwgbG9nOiB0cnVlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbnZhciBDT05TT0xFID0gZ2V0Q29uc29sZSgnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxuXG52YXIgbXV0YXRpb25zQ3FycyA9IHJlcXVpcmUoJy4uL211dGF0aW9ucy5jcXJzJykoe2dldENvbnNvbGUsIG11dGF0aW9uc1BhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICdtdXRhdGlvbnMnKX0pXG5cbnQudGVzdCgnKioqIFZJRVdTIENRUlMgKioqJywge1xuICBhdXRvZW5kOiB0cnVlXG59LCBhc3luYyBmdW5jdGlvbiBtYWluVGVzdCAodCkge1xuICB0LnBsYW4oMSlcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpXG4gIC8vXG4gIGF3YWl0IHQudGVzdCgnbXV0YXRpb25zQ3Fycy5tdXRhdGUgLT4gbXV0YXRpb25TdGF0ZScsIGFzeW5jIGZ1bmN0aW9uICh0KSB7XG4gICAgdmFyIG11dGF0aW9ucyA9IFtdXG4gICAgbXV0YXRpb25zLnB1c2gobXV0YXRpb25zQ3Fycy5tdXRhdGUoe211dGF0aW9uOiAndXBkYXRlJywgb2JqSWQ6ICd0ZXN0b2JqSWQnLCBkYXRhOiB7dGVzdERhdGE6IDF9LCBtZXRhfSkpXG4gICAgbXV0YXRpb25zLnB1c2gobXV0YXRpb25zQ3Fycy5tdXRhdGUoe211dGF0aW9uOiAndXBkYXRlJywgb2JqSWQ6ICd0ZXN0b2JqSWQnLCBkYXRhOiB7dGVzdERhdGEyOiAxfSwgbWV0YX0pKVxuXG4gICAgdmFyIGdldE9iak11dGF0aW9ucyA9IGFzeW5jKCkgPT4ge1xuICAgICAgcmV0dXJuIG11dGF0aW9uc1xuICAgIH1cblxuICAgIHZhciBhcHBseU11dGF0aW9ucyA9IG11dGF0aW9uc0NxcnMuYXBwbHlNdXRhdGlvbnNcbiAgICB2YXIgdmlld3NDcXJzID0gcmVxdWlyZSgnLi4vdmlld3MuY3FycycpKHtnZXRDb25zb2xlLCBzbmFwc2hvdHNNYXhNdXRhdGlvbnM6IDEwLCBnZXRPYmpNdXRhdGlvbnMsIGFwcGx5TXV0YXRpb25zfSlcbiAgICB2YXIgYWRkTXV0YXRpb25zID0gW211dGF0aW9uc1sxXSwgbXV0YXRpb25zQ3Fycy5tdXRhdGUoe211dGF0aW9uOiAndXBkYXRlJywgb2JqSWQ6ICd0ZXN0b2JqSWQnLCBkYXRhOiB7dGVzdERhdGE6IDJ9LCBtZXRhfSldXG4gICAgdmFyIHZpZXdTdGF0ZSA9IGF3YWl0IHZpZXdzQ3Fycy5yZWZyZXNoVmlld3Moe29iaklkczogWyd0ZXN0b2JqSWQnXSwgbG9hZE11dGF0aW9uczogdHJ1ZSwgYWRkTXV0YXRpb25zfSlcbiAgICAvLyBtdXRhdGlvbnNDcXJzLmFwcGx5TXV0YXRpb25zKClcbiAgICBDT05TT0xFLmRlYnVnKCd2aWV3U3RhdGUnLCB2aWV3U3RhdGUpXG4gICAgLy8gdC5vayh2aWV3U3RhdGUudGltZXN0YW1wLCAnbXV0YXRpb25TdGF0ZS50aW1lc3RhbXAgc2V0dGVkJylcbiAgICAvLyB0LnNhbWUodmlld1N0YXRlLnZlcnNpb24sICcwMDEnLCAnbXV0YXRpb25TdGF0ZS52ZXJzaW9uIHNldHRlZCcpXG4gICAgdC5lbmQoKVxuICB9KVxuXG4gIC8vIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDAwKSlcbiAgdC5lbmQoKVxuICBwcm9jZXNzLmV4aXQoKVxufSlcbiJdfQ==