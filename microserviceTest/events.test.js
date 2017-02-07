'use strict';

if (!global._babelPolyfill) {
  require('babel-polyfill');
}
var getMicroservice = require('./microservice');
var t = require('tap');
var path = require('path');

t.test('*** JESUS SERVICE ENTITY ***', {
  autoend: true
}, function mainTest(t) {
  var SERVICE_1, CONFIG_1, DI_1, _ref, SERVICE_2, CONFIG_2, DI_2, _ref2;

  return regeneratorRuntime.async(function mainTest$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getMicroservice({ name: 'testMicroservice', grpcUrl: '0.0.0.0:10000', eventsRegistry: require('./shared/eventsRegistry.json') }));

        case 2:
          _ref = _context2.sent;
          SERVICE_1 = _ref.SERVICE;
          CONFIG_1 = _ref.CONFIG;
          DI_1 = _ref.DI;
          _context2.next = 8;
          return regeneratorRuntime.awrap(getMicroservice({ name: 'authorizations', proto: path.join(__dirname, '/shared/services/authorizations.proto'), grpcUrl: '0.0.0.0:10001', restPort: 8081, eventsRegistry: require('./shared/eventsRegistry.json') }));

        case 8:
          _ref2 = _context2.sent;
          SERVICE_2 = _ref2.SERVICE;
          CONFIG_2 = _ref2.CONFIG;
          DI_2 = _ref2.DI;

          t.plan(1);
          _context2.next = 15;
          return regeneratorRuntime.awrap(t.test('-> ENTITY CREATE', function _callee(t) {
            var rapidTest, reqData;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(DI_2.emitEvent({ name: 'viewsUpdated', data: { itemsIds: ['test'] } }));

                  case 2:
                    rapidTest = _context.sent;

                    console.log(rapidTest);
                    reqData = { action: 'write.test', entityName: 'User' };
                    _context.prev = 5;
                    _context.next = 8;
                    return regeneratorRuntime.awrap(DI_1.emitEvent({ name: 'authorize', data: reqData }));

                  case 8:
                    rapidTest = _context.sent;

                    console.log(rapidTest);
                    _context.next = 15;
                    break;

                  case 12:
                    _context.prev = 12;
                    _context.t0 = _context['catch'](5);

                    console.log({ error: _context.t0 });

                  case 15:
                    SERVICE_1.apiGrpc.stop();
                    SERVICE_1.apiRest.stop();
                    SERVICE_2.apiGrpc.stop();
                    SERVICE_2.apiRest.stop();
                    t.end();

                    // } catch (error) {
                    //   //DI.error(error)
                    //   t.fail('FAIL createEntityTest')
                    //   t.end('FAIL createEntityTest')
                    // }

                  case 20:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this, [[5, 12]]);
          }));

        case 15:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy50ZXN0LmVzNiJdLCJuYW1lcyI6WyJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsInJlcXVpcmUiLCJnZXRNaWNyb3NlcnZpY2UiLCJ0IiwicGF0aCIsInRlc3QiLCJhdXRvZW5kIiwibWFpblRlc3QiLCJuYW1lIiwiZ3JwY1VybCIsImV2ZW50c1JlZ2lzdHJ5IiwiU0VSVklDRV8xIiwiU0VSVklDRSIsIkNPTkZJR18xIiwiQ09ORklHIiwiRElfMSIsIkRJIiwicHJvdG8iLCJqb2luIiwiX19kaXJuYW1lIiwicmVzdFBvcnQiLCJTRVJWSUNFXzIiLCJDT05GSUdfMiIsIkRJXzIiLCJwbGFuIiwiZW1pdEV2ZW50IiwiZGF0YSIsIml0ZW1zSWRzIiwicmFwaWRUZXN0IiwiY29uc29sZSIsImxvZyIsInJlcURhdGEiLCJhY3Rpb24iLCJlbnRpdHlOYW1lIiwiZXJyb3IiLCJhcGlHcnBjIiwic3RvcCIsImFwaVJlc3QiLCJlbmQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxDQUFDQSxPQUFPQyxjQUFaLEVBQTRCO0FBQzFCQyxVQUFRLGdCQUFSO0FBQ0Q7QUFDRCxJQUFJQyxrQkFBa0JELFFBQVEsZ0JBQVIsQ0FBdEI7QUFDQSxJQUFJRSxJQUFJRixRQUFRLEtBQVIsQ0FBUjtBQUNBLElBQUlHLE9BQU9ILFFBQVEsTUFBUixDQUFYOztBQUVBRSxFQUFFRSxJQUFGLENBQU8sOEJBQVAsRUFBdUM7QUFDckNDLFdBQVM7QUFENEIsQ0FBdkMsRUFFRyxTQUFlQyxRQUFmLENBQXlCSixDQUF6QjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSwwQ0FFMkRELGdCQUFnQixFQUFDTSxNQUFNLGtCQUFQLEVBQTJCQyxTQUFTLGVBQXBDLEVBQXFEQyxnQkFBZ0JULFFBQVEsOEJBQVIsQ0FBckUsRUFBaEIsQ0FGM0Q7O0FBQUE7QUFBQTtBQUVXVSxtQkFGWCxRQUVFQyxPQUZGO0FBRThCQyxrQkFGOUIsUUFFc0JDLE1BRnRCO0FBRTRDQyxjQUY1QyxRQUV3Q0MsRUFGeEM7QUFBQTtBQUFBLDBDQUsyRGQsZ0JBQWdCLEVBQUNNLE1BQU0sZ0JBQVAsRUFBeUJTLE9BQU9iLEtBQUtjLElBQUwsQ0FBVUMsU0FBVixFQUFxQix1Q0FBckIsQ0FBaEMsRUFBK0ZWLFNBQVMsZUFBeEcsRUFBeUhXLFVBQVUsSUFBbkksRUFBeUlWLGdCQUFnQlQsUUFBUSw4QkFBUixDQUF6SixFQUFoQixDQUwzRDs7QUFBQTtBQUFBO0FBS1dvQixtQkFMWCxTQUtFVCxPQUxGO0FBSzhCVSxrQkFMOUIsU0FLc0JSLE1BTHRCO0FBSzRDUyxjQUw1QyxTQUt3Q1AsRUFMeEM7O0FBTURiLFlBQUVxQixJQUFGLENBQU8sQ0FBUDtBQU5DO0FBQUEsMENBT0tyQixFQUFFRSxJQUFGLENBQU8sa0JBQVAsRUFBMkIsaUJBQWdCRixDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG9EQUNUb0IsS0FBS0UsU0FBTCxDQUFlLEVBQUNqQixNQUFNLGNBQVAsRUFBdUJrQixNQUFNLEVBQUNDLFVBQVUsQ0FBQyxNQUFELENBQVgsRUFBN0IsRUFBZixDQURTOztBQUFBO0FBQzNCQyw2QkFEMkI7O0FBRS9CQyw0QkFBUUMsR0FBUixDQUFZRixTQUFaO0FBQ0lHLDJCQUgyQixHQUdqQixFQUFDQyxRQUFRLFlBQVQsRUFBdUJDLFlBQVksTUFBbkMsRUFIaUI7QUFBQTtBQUFBO0FBQUEsb0RBS1BsQixLQUFLVSxTQUFMLENBQWUsRUFBQ2pCLE1BQU0sV0FBUCxFQUFvQmtCLE1BQU1LLE9BQTFCLEVBQWYsQ0FMTzs7QUFBQTtBQUt6QkgsNkJBTHlCOztBQU03QkMsNEJBQVFDLEdBQVIsQ0FBWUYsU0FBWjtBQU42QjtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFRN0JDLDRCQUFRQyxHQUFSLENBQVksRUFBQ0ksa0JBQUQsRUFBWjs7QUFSNkI7QUFVL0J2Qiw4QkFBVXdCLE9BQVYsQ0FBa0JDLElBQWxCO0FBQ0F6Qiw4QkFBVTBCLE9BQVYsQ0FBa0JELElBQWxCO0FBQ0FmLDhCQUFVYyxPQUFWLENBQWtCQyxJQUFsQjtBQUNBZiw4QkFBVWdCLE9BQVYsQ0FBa0JELElBQWxCO0FBQ0FqQyxzQkFBRW1DLEdBQUY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFwQitCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQTNCLENBUEw7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FGSCIsImZpbGUiOiJldmVudHMudGVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJpZiAoIWdsb2JhbC5fYmFiZWxQb2x5ZmlsbCkge1xuICByZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpXG59XG52YXIgZ2V0TWljcm9zZXJ2aWNlID0gcmVxdWlyZSgnLi9taWNyb3NlcnZpY2UnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxudC50ZXN0KCcqKiogSkVTVVMgU0VSVklDRSBFTlRJVFkgKioqJywge1xuICBhdXRvZW5kOiB0cnVlXG59LCBhc3luYyBmdW5jdGlvbiBtYWluVGVzdCAodCkge1xuICB2YXIgU0VSVklDRV8xLCBDT05GSUdfMSwgRElfMVxuICAoeyBTRVJWSUNFOiBTRVJWSUNFXzEsIENPTkZJRzogQ09ORklHXzEsIERJOiBESV8xIH0gPSBhd2FpdCBnZXRNaWNyb3NlcnZpY2Uoe25hbWU6ICd0ZXN0TWljcm9zZXJ2aWNlJywgZ3JwY1VybDogJzAuMC4wLjA6MTAwMDAnLCBldmVudHNSZWdpc3RyeTogcmVxdWlyZSgnLi9zaGFyZWQvZXZlbnRzUmVnaXN0cnkuanNvbicpfSkpXG5cbiAgdmFyIFNFUlZJQ0VfMiwgQ09ORklHXzIsIERJXzJcbiAgKHsgU0VSVklDRTogU0VSVklDRV8yLCBDT05GSUc6IENPTkZJR18yLCBESTogRElfMiB9ID0gYXdhaXQgZ2V0TWljcm9zZXJ2aWNlKHtuYW1lOiAnYXV0aG9yaXphdGlvbnMnLCBwcm90bzogcGF0aC5qb2luKF9fZGlybmFtZSwgJy9zaGFyZWQvc2VydmljZXMvYXV0aG9yaXphdGlvbnMucHJvdG8nKSwgZ3JwY1VybDogJzAuMC4wLjA6MTAwMDEnLCByZXN0UG9ydDogODA4MSwgZXZlbnRzUmVnaXN0cnk6IHJlcXVpcmUoJy4vc2hhcmVkL2V2ZW50c1JlZ2lzdHJ5Lmpzb24nKX0pKVxuICB0LnBsYW4oMSlcbiAgYXdhaXQgdC50ZXN0KCctPiBFTlRJVFkgQ1JFQVRFJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB2YXIgcmFwaWRUZXN0ID0gYXdhaXQgRElfMi5lbWl0RXZlbnQoe25hbWU6ICd2aWV3c1VwZGF0ZWQnLCBkYXRhOiB7aXRlbXNJZHM6IFsndGVzdCddfX0pXG4gICAgY29uc29sZS5sb2cocmFwaWRUZXN0KVxuICAgIHZhciByZXFEYXRhID0ge2FjdGlvbjogJ3dyaXRlLnRlc3QnLCBlbnRpdHlOYW1lOiAnVXNlcid9XG4gICAgdHJ5IHtcbiAgICAgIHZhciByYXBpZFRlc3QgPSBhd2FpdCBESV8xLmVtaXRFdmVudCh7bmFtZTogJ2F1dGhvcml6ZScsIGRhdGE6IHJlcURhdGF9KVxuICAgICAgY29uc29sZS5sb2cocmFwaWRUZXN0KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyh7ZXJyb3J9KVxuICAgIH1cbiAgICBTRVJWSUNFXzEuYXBpR3JwYy5zdG9wKClcbiAgICBTRVJWSUNFXzEuYXBpUmVzdC5zdG9wKClcbiAgICBTRVJWSUNFXzIuYXBpR3JwYy5zdG9wKClcbiAgICBTRVJWSUNFXzIuYXBpUmVzdC5zdG9wKClcbiAgICB0LmVuZCgpXG5cbiAgICAvLyB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vICAgLy9ESS5lcnJvcihlcnJvcilcbiAgICAvLyAgIHQuZmFpbCgnRkFJTCBjcmVhdGVFbnRpdHlUZXN0JylcbiAgICAvLyAgIHQuZW5kKCdGQUlMIGNyZWF0ZUVudGl0eVRlc3QnKVxuICAgIC8vIH1cbiAgfSlcbn0pXG4iXX0=