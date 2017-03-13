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

t.test('*** MUTATIONS CQRS ***', {
  autoend: true
}, function mainTest(t) {
  return regeneratorRuntime.async(function mainTest$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          t.plan(2);
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1000);
          }));

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(t.test('mutationsCqrs.mutate -> mutationState', function _callee(t) {
            var mutationState;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    mutationState = mutationsCqrs.mutate({ mutation: 'update', objId: 'testobjId', data: { testData: 1 }, meta: meta });
                    // mutationsCqrs.applyMutations()

                    CONSOLE.debug('mutationState', mutationState);
                    t.ok(mutationState.timestamp, 'mutationState.timestamp setted');
                    t.same(mutationState.version, '001', 'mutationState.version setted');
                    t.end();

                  case 5:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this);
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(t.test('mutationsCqrs.applyMutations -> state', function _callee2(t) {
            var mutations, state;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    mutations = [];

                    mutations.push(mutationsCqrs.mutate({ mutation: 'update', objId: 'testobjId', data: { testData: 1 }, meta: meta }));
                    mutations.push(mutationsCqrs.mutate({ mutation: 'update', objId: 'testobjId', data: { testData: 2 }, meta: meta }));
                    mutations.push(mutationsCqrs.mutate({ mutation: 'update', objId: 'testobjId', data: { testData2: 1 }, meta: meta }));
                    CONSOLE.debug('mutations', mutations);
                    _context2.next = 7;
                    return regeneratorRuntime.awrap(mutationsCqrs.applyMutations({ state: {}, mutations: mutations }));

                  case 7:
                    state = _context2.sent;

                    CONSOLE.debug('state', state);
                    t.equal(state.testData, 2, 'state.testData as expected');
                    t.equal(state.testData2, 1, 'state.testData2 as expected');
                    t.end();

                  case 12:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, this);
          }));

        case 7:
          //await new Promise((resolve) => setTimeout(resolve, 1000))
          t.end();
          process.exit();

        case 9:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11dGF0aW9ucy5jcXJzLnRlc3QuZXM2Il0sIm5hbWVzIjpbImdsb2JhbCIsIl9iYWJlbFBvbHlmaWxsIiwicmVxdWlyZSIsIlIiLCJ0IiwicGF0aCIsImplc3VzIiwibWV0YSIsImNvcnJJZCIsInVzZXJJZCIsImdldENvbnNvbGUiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsInBhY2siLCJlcnJvciIsImRlYnVnIiwibG9nIiwid2FybiIsIkNPTlNPTEUiLCJtdXRhdGlvbnNDcXJzIiwibXV0YXRpb25zUGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJ0ZXN0IiwiYXV0b2VuZCIsIm1haW5UZXN0IiwicGxhbiIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsIm11dGF0aW9uU3RhdGUiLCJtdXRhdGUiLCJtdXRhdGlvbiIsIm9iaklkIiwiZGF0YSIsInRlc3REYXRhIiwib2siLCJ0aW1lc3RhbXAiLCJzYW1lIiwidmVyc2lvbiIsImVuZCIsIm11dGF0aW9ucyIsInB1c2giLCJ0ZXN0RGF0YTIiLCJhcHBseU11dGF0aW9ucyIsInN0YXRlIiwiZXF1YWwiLCJwcm9jZXNzIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLENBQUNBLE9BQU9DLGNBQVosRUFBMkJDLFFBQVEsZ0JBQVI7QUFDM0IsSUFBSUMsSUFBSUQsUUFBUSxPQUFSLENBQVI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJRSxJQUFJRixRQUFRLEtBQVIsQ0FBUjtBQUNBLElBQUlHLE9BQU9ILFFBQVEsTUFBUixDQUFYOztBQUVBLElBQUlJLFFBQVFKLFFBQVEsVUFBUixDQUFaO0FBQ0EsSUFBSUssT0FBTztBQUNUQyxVQUFRLGFBREM7QUFFVEMsVUFBUTtBQUZDLENBQVg7QUFJQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0MsV0FBRCxFQUFjQyxTQUFkLEVBQXlCQyxJQUF6QjtBQUFBLFNBQWtDUCxNQUFNSSxVQUFOLENBQWlCLEVBQUNJ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QWQsRUFBeUIsQ0FBekIsRUFBNEIsNkJBQTVCO0FBQ0F2QyxzQkFBRW9DLEdBQUY7O0FBVm9EO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQWhELENBYkw7O0FBQUE7QUF5QkQ7QUFDQXBDLFlBQUVvQyxHQUFGO0FBQ0FPLGtCQUFRQyxJQUFSOztBQTNCQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUZIIiwiZmlsZSI6Im11dGF0aW9ucy5jcXJzLnRlc3QuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5pZiAoIWdsb2JhbC5fYmFiZWxQb2x5ZmlsbClyZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpXG52YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbi8vIHZhciBkZXJlZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWRlcmVmLXN5bmMnKVxuLy8gdmFyIGZha2VyID0gcmVxdWlyZSgnZmFrZXInKVxuLy8gdmFyIGpzZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWZha2VyJylcbi8vIGZha2VyLmxvY2FsZSA9ICdpdCdcbi8vIHZhciByZXN0bGVyID0gcmVxdWlyZSgncmVzdGxlcicpXG4vL1xudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxudmFyIGplc3VzID0gcmVxdWlyZSgnLi4vamVzdXMnKVxudmFyIG1ldGEgPSB7XG4gIGNvcnJJZDogJ3Rlc3RSZXF1ZXN0JyxcbiAgdXNlcklkOiAndGVzdFVzZXInXG59XG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IGplc3VzLmdldENvbnNvbGUoe2Vycm9yOiB0cnVlLCBkZWJ1ZzogdHJ1ZSwgbG9nOiB0cnVlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcbnZhciBDT05TT0xFID0gZ2V0Q29uc29sZSgnQkFTRSBURVNUJywgJy0tLS0nLCAnLS0tLS0nKVxuXG52YXIgbXV0YXRpb25zQ3FycyA9IHJlcXVpcmUoJy4uL211dGF0aW9ucy5jcXJzJykoe2dldENvbnNvbGUsIG11dGF0aW9uc1BhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICdtdXRhdGlvbnMnKX0pXG5cbnQudGVzdCgnKioqIE1VVEFUSU9OUyBDUVJTICoqKicsIHtcbiAgYXV0b2VuZDogdHJ1ZVxufSwgYXN5bmMgZnVuY3Rpb24gbWFpblRlc3QgKHQpIHtcbiAgdC5wbGFuKDIpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICAvL1xuICBhd2FpdCB0LnRlc3QoJ211dGF0aW9uc0NxcnMubXV0YXRlIC0+IG11dGF0aW9uU3RhdGUnLCBhc3luYyBmdW5jdGlvbiAodCkge1xuICAgIHZhciBtdXRhdGlvblN0YXRlID0gbXV0YXRpb25zQ3Fycy5tdXRhdGUoe211dGF0aW9uOiAndXBkYXRlJywgb2JqSWQ6ICd0ZXN0b2JqSWQnLCBkYXRhOiB7dGVzdERhdGE6IDF9LCBtZXRhfSlcbiAgICAvLyBtdXRhdGlvbnNDcXJzLmFwcGx5TXV0YXRpb25zKClcbiAgICBDT05TT0xFLmRlYnVnKCdtdXRhdGlvblN0YXRlJywgbXV0YXRpb25TdGF0ZSlcbiAgICB0Lm9rKG11dGF0aW9uU3RhdGUudGltZXN0YW1wLCAnbXV0YXRpb25TdGF0ZS50aW1lc3RhbXAgc2V0dGVkJylcbiAgICB0LnNhbWUobXV0YXRpb25TdGF0ZS52ZXJzaW9uLCAnMDAxJywgJ211dGF0aW9uU3RhdGUudmVyc2lvbiBzZXR0ZWQnKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgLy9cbiAgYXdhaXQgdC50ZXN0KCdtdXRhdGlvbnNDcXJzLmFwcGx5TXV0YXRpb25zIC0+IHN0YXRlJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB2YXIgbXV0YXRpb25zID0gW11cbiAgICBtdXRhdGlvbnMucHVzaChtdXRhdGlvbnNDcXJzLm11dGF0ZSh7bXV0YXRpb246ICd1cGRhdGUnLCBvYmpJZDogJ3Rlc3RvYmpJZCcsIGRhdGE6IHt0ZXN0RGF0YTogMX0sIG1ldGF9KSlcbiAgICBtdXRhdGlvbnMucHVzaChtdXRhdGlvbnNDcXJzLm11dGF0ZSh7bXV0YXRpb246ICd1cGRhdGUnLCBvYmpJZDogJ3Rlc3RvYmpJZCcsIGRhdGE6IHt0ZXN0RGF0YTogMn0sIG1ldGF9KSlcbiAgICBtdXRhdGlvbnMucHVzaChtdXRhdGlvbnNDcXJzLm11dGF0ZSh7bXV0YXRpb246ICd1cGRhdGUnLCBvYmpJZDogJ3Rlc3RvYmpJZCcsIGRhdGE6IHt0ZXN0RGF0YTI6IDF9LCBtZXRhfSkpXG4gICAgQ09OU09MRS5kZWJ1ZygnbXV0YXRpb25zJywgbXV0YXRpb25zKVxuICAgIHZhciBzdGF0ZSA9IGF3YWl0IG11dGF0aW9uc0NxcnMuYXBwbHlNdXRhdGlvbnMoe3N0YXRlOiB7fSwgbXV0YXRpb25zfSlcbiAgICBDT05TT0xFLmRlYnVnKCdzdGF0ZScsIHN0YXRlKVxuICAgIHQuZXF1YWwoc3RhdGUudGVzdERhdGEsIDIsICdzdGF0ZS50ZXN0RGF0YSBhcyBleHBlY3RlZCcpXG4gICAgdC5lcXVhbChzdGF0ZS50ZXN0RGF0YTIsIDEsICdzdGF0ZS50ZXN0RGF0YTIgYXMgZXhwZWN0ZWQnKVxuICAgIHQuZW5kKClcbiAgfSlcbiAgLy9hd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgdC5lbmQoKVxuICBwcm9jZXNzLmV4aXQoKVxufSlcbiJdfQ==