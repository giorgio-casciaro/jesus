'use strict';

if (!global._babelPolyfill) {
  require('babel-polyfill');
}
var getMicroservice = require('./microservice');
var t = require('tap');
var request = require('restler');

t.test('*** JESUS SERVICE ENTITY ***', {
  autoend: true
}, function mainTest(t) {
  var SERVICE_1, CONFIG_1, DI_1, _ref;

  return regeneratorRuntime.async(function mainTest$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getMicroservice({ restPort: 8080 }));

        case 2:
          _ref = _context2.sent;
          SERVICE_1 = _ref.SERVICE;
          CONFIG_1 = _ref.CONFIG;
          DI_1 = _ref.DI;

          //
          // var SERVICE_2, CONFIG_2, DI_2
          // ({ SERVICE: SERVICE_2, CONFIG: CONFIG_2, DI: DI_2 } = await getMicroservice({grpcUrl: '0.0.0.0:11000'}))

          t.plan(1);
          _context2.next = 9;
          return regeneratorRuntime.awrap(t.test('-> ENTITY CREATE', function _callee(t) {
            var serviceCreateUserRequest;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    serviceCreateUserRequest = { items: [{ username: 'test', email: 'test@test.com' }, { username: 'test2', email: 'test@test.com' }] };
                    _context.next = 3;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      request.postJson('http://127.0.0.1:8080/createUser', serviceCreateUserRequest).on('complete', function (serviceCreateResponse, response) {
                        //console.log('serviceCreateResponse', serviceCreateResponse)
                        t.type(serviceCreateResponse, 'object', 'Response is object');
                        t.type(serviceCreateResponse.itemsIds, 'Array', 'itemsIds is array');
                        t.equal(serviceCreateResponse.itemsIds.length, 2, 'itemsIds length is 2');
                        resolve();
                      });
                    }));

                  case 3:
                    _context.next = 5;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      request.get('http://127.0.0.1:8080/createUser', { data: serviceCreateUserRequest }).on('complete', function (serviceCreateResponse, response) {
                        //console.log('serviceCreateResponse', serviceCreateResponse)
                        t.type(serviceCreateResponse, 'object', 'Response is object');
                        t.type(serviceCreateResponse.itemsIds, 'Array', 'itemsIds is array');
                        t.equal(serviceCreateResponse.itemsIds.length, 2, 'itemsIds length is 2');
                        resolve();
                      });
                    }));

                  case 5:

                    SERVICE_1.stop();
                    t.end();

                    // } catch (error) {
                    //   //DI.error(error)
                    //   t.fail('FAIL createEntityTest')
                    //   t.end('FAIL createEntityTest')
                    // }

                  case 7:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this);
          }));

        case 9:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3QudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiZ2V0TWljcm9zZXJ2aWNlIiwidCIsInJlcXVlc3QiLCJ0ZXN0IiwiYXV0b2VuZCIsIm1haW5UZXN0IiwicmVzdFBvcnQiLCJTRVJWSUNFXzEiLCJTRVJWSUNFIiwiQ09ORklHXzEiLCJDT05GSUciLCJESV8xIiwiREkiLCJwbGFuIiwic2VydmljZUNyZWF0ZVVzZXJSZXF1ZXN0IiwiaXRlbXMiLCJ1c2VybmFtZSIsImVtYWlsIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwb3N0SnNvbiIsIm9uIiwic2VydmljZUNyZWF0ZVJlc3BvbnNlIiwicmVzcG9uc2UiLCJ0eXBlIiwiaXRlbXNJZHMiLCJlcXVhbCIsImxlbmd0aCIsImdldCIsImRhdGEiLCJzdG9wIiwiZW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksQ0FBQ0EsT0FBT0MsY0FBWixFQUE0QjtBQUMxQkMsVUFBUSxnQkFBUjtBQUNEO0FBQ0QsSUFBSUMsa0JBQWtCRCxRQUFRLGdCQUFSLENBQXRCO0FBQ0EsSUFBSUUsSUFBSUYsUUFBUSxLQUFSLENBQVI7QUFDQSxJQUFJRyxVQUFVSCxRQUFRLFNBQVIsQ0FBZDs7QUFFQUUsRUFBRUUsSUFBRixDQUFPLDhCQUFQLEVBQXVDO0FBQ3JDQyxXQUFTO0FBRDRCLENBQXZDLEVBRUcsU0FBZUMsUUFBZixDQUF5QkosQ0FBekI7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsMENBRTJERCxnQkFBZ0IsRUFBQ00sVUFBVSxJQUFYLEVBQWhCLENBRjNEOztBQUFBO0FBQUE7QUFFV0MsbUJBRlgsUUFFRUMsT0FGRjtBQUU4QkMsa0JBRjlCLFFBRXNCQyxNQUZ0QjtBQUU0Q0MsY0FGNUMsUUFFd0NDLEVBRnhDOztBQUdEO0FBQ0E7QUFDQTs7QUFFQVgsWUFBRVksSUFBRixDQUFPLENBQVA7QUFQQztBQUFBLDBDQVFLWixFQUFFRSxJQUFGLENBQU8sa0JBQVAsRUFBMkIsaUJBQWdCRixDQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDM0JhLDRDQUQyQixHQUNBLEVBQUNDLE9BQU8sQ0FBQyxFQUFDQyxVQUFVLE1BQVgsRUFBbUJDLE9BQU8sZUFBMUIsRUFBRCxFQUE2QyxFQUFDRCxVQUFVLE9BQVgsRUFBb0JDLE9BQU8sZUFBM0IsRUFBN0MsQ0FBUixFQURBO0FBQUE7QUFBQSxvREFHekIsSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNyQ2xCLDhCQUFRbUIsUUFBUixDQUFpQixrQ0FBakIsRUFBcURQLHdCQUFyRCxFQUErRVEsRUFBL0UsQ0FBa0YsVUFBbEYsRUFBOEYsVUFBVUMscUJBQVYsRUFBaUNDLFFBQWpDLEVBQTJDO0FBQ3ZJO0FBQ0F2QiwwQkFBRXdCLElBQUYsQ0FBT0YscUJBQVAsRUFBOEIsUUFBOUIsRUFBd0Msb0JBQXhDO0FBQ0F0QiwwQkFBRXdCLElBQUYsQ0FBT0Ysc0JBQXNCRyxRQUE3QixFQUF1QyxPQUF2QyxFQUFnRCxtQkFBaEQ7QUFDQXpCLDBCQUFFMEIsS0FBRixDQUFRSixzQkFBc0JHLFFBQXRCLENBQStCRSxNQUF2QyxFQUErQyxDQUEvQyxFQUFrRCxzQkFBbEQ7QUFDQVQ7QUFDRCx1QkFORDtBQU9ELHFCQVJLLENBSHlCOztBQUFBO0FBQUE7QUFBQSxvREFhekIsSUFBSUQsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNyQ2xCLDhCQUFRMkIsR0FBUixDQUFZLGtDQUFaLEVBQWdELEVBQUNDLE1BQUtoQix3QkFBTixFQUFoRCxFQUFpRlEsRUFBakYsQ0FBb0YsVUFBcEYsRUFBZ0csVUFBVUMscUJBQVYsRUFBaUNDLFFBQWpDLEVBQTJDO0FBQ3pJO0FBQ0F2QiwwQkFBRXdCLElBQUYsQ0FBT0YscUJBQVAsRUFBOEIsUUFBOUIsRUFBd0Msb0JBQXhDO0FBQ0F0QiwwQkFBRXdCLElBQUYsQ0FBT0Ysc0JBQXNCRyxRQUE3QixFQUF1QyxPQUF2QyxFQUFnRCxtQkFBaEQ7QUFDQXpCLDBCQUFFMEIsS0FBRixDQUFRSixzQkFBc0JHLFFBQXRCLENBQStCRSxNQUF2QyxFQUErQyxDQUEvQyxFQUFrRCxzQkFBbEQ7QUFDQVQ7QUFDRCx1QkFORDtBQU9ELHFCQVJLLENBYnlCOztBQUFBOztBQXVCL0JaLDhCQUFVd0IsSUFBVjtBQUNBOUIsc0JBQUUrQixHQUFGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBOUIrQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUEzQixDQVJMOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgiLCJmaWxlIjoicmVzdC50ZXN0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbImlmICghZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKSB7XG4gIHJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJylcbn1cbnZhciBnZXRNaWNyb3NlcnZpY2UgPSByZXF1aXJlKCcuL21pY3Jvc2VydmljZScpXG52YXIgdCA9IHJlcXVpcmUoJ3RhcCcpXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3Jlc3RsZXInKVxuXG50LnRlc3QoJyoqKiBKRVNVUyBTRVJWSUNFIEVOVElUWSAqKionLCB7XG4gIGF1dG9lbmQ6IHRydWVcbn0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIHZhciBTRVJWSUNFXzEsIENPTkZJR18xLCBESV8xXG4gICh7IFNFUlZJQ0U6IFNFUlZJQ0VfMSwgQ09ORklHOiBDT05GSUdfMSwgREk6IERJXzEgfSA9IGF3YWl0IGdldE1pY3Jvc2VydmljZSh7cmVzdFBvcnQ6IDgwODB9KSlcbiAgLy9cbiAgLy8gdmFyIFNFUlZJQ0VfMiwgQ09ORklHXzIsIERJXzJcbiAgLy8gKHsgU0VSVklDRTogU0VSVklDRV8yLCBDT05GSUc6IENPTkZJR18yLCBESTogRElfMiB9ID0gYXdhaXQgZ2V0TWljcm9zZXJ2aWNlKHtncnBjVXJsOiAnMC4wLjAuMDoxMTAwMCd9KSlcblxuICB0LnBsYW4oMSlcbiAgYXdhaXQgdC50ZXN0KCctPiBFTlRJVFkgQ1JFQVRFJywgYXN5bmMgZnVuY3Rpb24gKHQpIHtcbiAgICB2YXIgc2VydmljZUNyZWF0ZVVzZXJSZXF1ZXN0ID0ge2l0ZW1zOiBbe3VzZXJuYW1lOiAndGVzdCcsIGVtYWlsOiAndGVzdEB0ZXN0LmNvbSd9LCB7dXNlcm5hbWU6ICd0ZXN0MicsIGVtYWlsOiAndGVzdEB0ZXN0LmNvbSd9XX1cblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlcXVlc3QucG9zdEpzb24oJ2h0dHA6Ly8xMjcuMC4wLjE6ODA4MC9jcmVhdGVVc2VyJywgc2VydmljZUNyZWF0ZVVzZXJSZXF1ZXN0KS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoc2VydmljZUNyZWF0ZVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdzZXJ2aWNlQ3JlYXRlUmVzcG9uc2UnLCBzZXJ2aWNlQ3JlYXRlUmVzcG9uc2UpXG4gICAgICAgIHQudHlwZShzZXJ2aWNlQ3JlYXRlUmVzcG9uc2UsICdvYmplY3QnLCAnUmVzcG9uc2UgaXMgb2JqZWN0JylcbiAgICAgICAgdC50eXBlKHNlcnZpY2VDcmVhdGVSZXNwb25zZS5pdGVtc0lkcywgJ0FycmF5JywgJ2l0ZW1zSWRzIGlzIGFycmF5JylcbiAgICAgICAgdC5lcXVhbChzZXJ2aWNlQ3JlYXRlUmVzcG9uc2UuaXRlbXNJZHMubGVuZ3RoLCAyLCAnaXRlbXNJZHMgbGVuZ3RoIGlzIDInKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlcXVlc3QuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjgwODAvY3JlYXRlVXNlcicsIHtkYXRhOnNlcnZpY2VDcmVhdGVVc2VyUmVxdWVzdH0pLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uIChzZXJ2aWNlQ3JlYXRlUmVzcG9uc2UsIHJlc3BvbnNlKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3NlcnZpY2VDcmVhdGVSZXNwb25zZScsIHNlcnZpY2VDcmVhdGVSZXNwb25zZSlcbiAgICAgICAgdC50eXBlKHNlcnZpY2VDcmVhdGVSZXNwb25zZSwgJ29iamVjdCcsICdSZXNwb25zZSBpcyBvYmplY3QnKVxuICAgICAgICB0LnR5cGUoc2VydmljZUNyZWF0ZVJlc3BvbnNlLml0ZW1zSWRzLCAnQXJyYXknLCAnaXRlbXNJZHMgaXMgYXJyYXknKVxuICAgICAgICB0LmVxdWFsKHNlcnZpY2VDcmVhdGVSZXNwb25zZS5pdGVtc0lkcy5sZW5ndGgsIDIsICdpdGVtc0lkcyBsZW5ndGggaXMgMicpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgU0VSVklDRV8xLnN0b3AoKVxuICAgIHQuZW5kKClcblxuICAgIC8vIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gICAvL0RJLmVycm9yKGVycm9yKVxuICAgIC8vICAgdC5mYWlsKCdGQUlMIGNyZWF0ZUVudGl0eVRlc3QnKVxuICAgIC8vICAgdC5lbmQoJ0ZBSUwgY3JlYXRlRW50aXR5VGVzdCcpXG4gICAgLy8gfVxuICB9KVxufSlcbiJdfQ==