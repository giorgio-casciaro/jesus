'use strict';

var grpc = require('grpc');
var R = require('ramda');

module.exports = function getNetPackage(CONFIG, DI) {
  var PACKAGE, getValuePromise, checkRequired, grpcCredentials, callGrpc, eventsRegistry;
  return regeneratorRuntime.async(function getNetPackage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          PACKAGE = 'net.grpc';
          getValuePromise = require('./jesus').getValuePromise;
          checkRequired = require('./jesus').checkRequired;

          CONFIG = checkRequired(CONFIG, ['eventsRegistry'], PACKAGE);
          DI = checkRequired(DI, ['throwError', 'log', 'debug'], PACKAGE);
          _context.next = 8;
          return regeneratorRuntime.awrap(getValuePromise(CONFIG.grpcCredentials));

        case 8:
          grpcCredentials = _context.sent;

          callGrpc = function callGrpc(_ref) {
            var service = _ref.service,
                eventListener = _ref.eventListener,
                data = _ref.data;
            return new Promise(function (resolve, reject) {
              var grpcService = grpc.load(service.proto).Service;
              var client = new grpcService(service.grpc.url, grpcCredentials);
              var callTimeout = setTimeout(function () {
                grpc.closeClient(client);
                reject({ message: 'Response problems: REQUEST TIMEOUT: control proto file for correct response format', service: service, eventListener: eventListener, data: data });
              }, eventListener.timeout || 5000);

              client[eventListener.route](data, function (error, serviceResponse) {
                clearTimeout(callTimeout);
                if (error) reject(error);
                resolve(serviceResponse);
              });
            });
          };

          _context.next = 12;
          return regeneratorRuntime.awrap(getValuePromise(CONFIG.eventsRegistry));

        case 12:
          eventsRegistry = _context.sent;
          return _context.abrupt('return', {
            emitEvent: function emitEvent(_ref2) {
              var name = _ref2.name,
                  data = _ref2.data,
                  _ref2$singleResponse = _ref2.singleResponse,
                  singleResponse = _ref2$singleResponse === undefined ? true : _ref2$singleResponse;

              if (eventsRegistry && eventsRegistry.listeners && eventsRegistry.listeners[name]) {
                var waitResponses = [];
                eventsRegistry.listeners[name].forEach(function (eventListener) {
                  var service = eventsRegistry.services[eventListener.service];
                  var callGrpcPromise = callGrpc({ service: service, eventListener: eventListener, data: data });
                  if (eventListener.haveResponse) waitResponses.push(callGrpcPromise);
                });
                if (waitResponses.length) {
                  if (singleResponse) return waitResponses[0];else return Promise.all(waitResponses);
                }
              }
            }
          });

        case 16:
          _context.prev = 16;
          _context.t0 = _context['catch'](0);

          DI.throwError('getNetPackage(CONFIG, DI)', _context.t0);

        case 19:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[0, 16]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5lczYiXSwibmFtZXMiOlsiZ3JwYyIsInJlcXVpcmUiLCJSIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldFBhY2thZ2UiLCJDT05GSUciLCJESSIsIlBBQ0tBR0UiLCJnZXRWYWx1ZVByb21pc2UiLCJjaGVja1JlcXVpcmVkIiwiZ3JwY0NyZWRlbnRpYWxzIiwiY2FsbEdycGMiLCJzZXJ2aWNlIiwiZXZlbnRMaXN0ZW5lciIsImRhdGEiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdycGNTZXJ2aWNlIiwibG9hZCIsInByb3RvIiwiU2VydmljZSIsImNsaWVudCIsInVybCIsImNhbGxUaW1lb3V0Iiwic2V0VGltZW91dCIsImNsb3NlQ2xpZW50IiwibWVzc2FnZSIsInRpbWVvdXQiLCJyb3V0ZSIsImVycm9yIiwic2VydmljZVJlc3BvbnNlIiwiY2xlYXJUaW1lb3V0IiwiZXZlbnRzUmVnaXN0cnkiLCJlbWl0RXZlbnQiLCJuYW1lIiwic2luZ2xlUmVzcG9uc2UiLCJsaXN0ZW5lcnMiLCJ3YWl0UmVzcG9uc2VzIiwiZm9yRWFjaCIsInNlcnZpY2VzIiwiY2FsbEdycGNQcm9taXNlIiwiaGF2ZVJlc3BvbnNlIiwicHVzaCIsImxlbmd0aCIsImFsbCIsInRocm93RXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxJQUFJRCxRQUFRLE9BQVIsQ0FBUjs7QUFFQUUsT0FBT0MsT0FBUCxHQUFpQixTQUFlQyxhQUFmLENBQThCQyxNQUE5QixFQUFzQ0MsRUFBdEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFUEMsaUJBRk8sR0FFRyxVQUZIO0FBR1BDLHlCQUhPLEdBR1dSLFFBQVEsU0FBUixFQUFtQlEsZUFIOUI7QUFJUEMsdUJBSk8sR0FJU1QsUUFBUSxTQUFSLEVBQW1CUyxhQUo1Qjs7QUFLYkosbUJBQVNJLGNBQWNKLE1BQWQsRUFBc0IsQ0FBQyxnQkFBRCxDQUF0QixFQUEwQ0UsT0FBMUMsQ0FBVDtBQUNBRCxlQUFLRyxjQUFjSCxFQUFkLEVBQWtCLENBQUUsWUFBRixFQUFnQixLQUFoQixFQUF1QixPQUF2QixDQUFsQixFQUFtREMsT0FBbkQsQ0FBTDtBQU5hO0FBQUEsMENBT2VDLGdCQUFnQkgsT0FBT0ssZUFBdkIsQ0FQZjs7QUFBQTtBQU9UQSx5QkFQUzs7QUFTVEMsa0JBVFMsR0FTRSxTQUFYQSxRQUFXO0FBQUEsZ0JBQUVDLE9BQUYsUUFBRUEsT0FBRjtBQUFBLGdCQUFXQyxhQUFYLFFBQVdBLGFBQVg7QUFBQSxnQkFBMEJDLElBQTFCLFFBQTBCQSxJQUExQjtBQUFBLG1CQUFvQyxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ2xGLGtCQUFJQyxjQUFjbkIsS0FBS29CLElBQUwsQ0FBVVAsUUFBUVEsS0FBbEIsRUFBeUJDLE9BQTNDO0FBQ0Esa0JBQUlDLFNBQVMsSUFBSUosV0FBSixDQUFnQk4sUUFBUWIsSUFBUixDQUFhd0IsR0FBN0IsRUFBa0NiLGVBQWxDLENBQWI7QUFDQSxrQkFBSWMsY0FBY0MsV0FBVyxZQUFNO0FBQ2pDMUIscUJBQUsyQixXQUFMLENBQWlCSixNQUFqQjtBQUNBTCx1QkFBTyxFQUFDVSxTQUFTLG9GQUFWLEVBQWdHZixnQkFBaEcsRUFBeUdDLDRCQUF6RyxFQUF3SEMsVUFBeEgsRUFBUDtBQUNELGVBSGlCLEVBR2ZELGNBQWNlLE9BQWQsSUFBeUIsSUFIVixDQUFsQjs7QUFLQU4scUJBQU9ULGNBQWNnQixLQUFyQixFQUE0QmYsSUFBNUIsRUFBa0MsVUFBQ2dCLEtBQUQsRUFBUUMsZUFBUixFQUE0QjtBQUM1REMsNkJBQWFSLFdBQWI7QUFDQSxvQkFBSU0sS0FBSixFQUFVYixPQUFPYSxLQUFQO0FBQ1ZkLHdCQUFRZSxlQUFSO0FBQ0QsZUFKRDtBQUtELGFBYmtELENBQXBDO0FBQUEsV0FURjs7QUFBQTtBQUFBLDBDQXVCY3ZCLGdCQUFnQkgsT0FBTzRCLGNBQXZCLENBdkJkOztBQUFBO0FBdUJUQSx3QkF2QlM7QUFBQSwyQ0F3Qk47QUFDTEMscUJBREssNEJBQzJDO0FBQUEsa0JBQXBDQyxJQUFvQyxTQUFwQ0EsSUFBb0M7QUFBQSxrQkFBOUJyQixJQUE4QixTQUE5QkEsSUFBOEI7QUFBQSwrQ0FBeEJzQixjQUF3QjtBQUFBLGtCQUF4QkEsY0FBd0Isd0NBQVAsSUFBTzs7QUFDOUMsa0JBQUlILGtCQUFrQkEsZUFBZUksU0FBakMsSUFBOENKLGVBQWVJLFNBQWYsQ0FBeUJGLElBQXpCLENBQWxELEVBQWtGO0FBQ2hGLG9CQUFJRyxnQkFBZ0IsRUFBcEI7QUFDQUwsK0JBQWVJLFNBQWYsQ0FBeUJGLElBQXpCLEVBQStCSSxPQUEvQixDQUF1QyxVQUFDMUIsYUFBRCxFQUFtQjtBQUN4RCxzQkFBSUQsVUFBVXFCLGVBQWVPLFFBQWYsQ0FBd0IzQixjQUFjRCxPQUF0QyxDQUFkO0FBQ0Esc0JBQUk2QixrQkFBa0I5QixTQUFTLEVBQUNDLFNBQVNBLE9BQVYsRUFBbUJDLDRCQUFuQixFQUFrQ0MsVUFBbEMsRUFBVCxDQUF0QjtBQUNBLHNCQUFJRCxjQUFjNkIsWUFBbEIsRUFBK0JKLGNBQWNLLElBQWQsQ0FBbUJGLGVBQW5CO0FBQ2hDLGlCQUpEO0FBS0Esb0JBQUlILGNBQWNNLE1BQWxCLEVBQTBCO0FBQ3hCLHNCQUFJUixjQUFKLEVBQW9CLE9BQU9FLGNBQWMsQ0FBZCxDQUFQLENBQXBCLEtBQ0ssT0FBT3ZCLFFBQVE4QixHQUFSLENBQVlQLGFBQVosQ0FBUDtBQUNOO0FBQ0Y7QUFDRjtBQWRJLFdBeEJNOztBQUFBO0FBQUE7QUFBQTs7QUF5Q2JoQyxhQUFHd0MsVUFBSCxDQUFjLDJCQUFkOztBQXpDYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJuZXQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdycGMgPSByZXF1aXJlKCdncnBjJylcbnZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldE5ldFBhY2thZ2UgKENPTkZJRywgREkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBQQUNLQUdFID0gJ25ldC5ncnBjJ1xuICAgIGNvbnN0IGdldFZhbHVlUHJvbWlzZSA9IHJlcXVpcmUoJy4vamVzdXMnKS5nZXRWYWx1ZVByb21pc2VcbiAgICBjb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbiAgICBDT05GSUcgPSBjaGVja1JlcXVpcmVkKENPTkZJRywgWydldmVudHNSZWdpc3RyeSddLCBQQUNLQUdFKVxuICAgIERJID0gY2hlY2tSZXF1aXJlZChESSwgWyAndGhyb3dFcnJvcicsICdsb2cnLCAnZGVidWcnXSwgUEFDS0FHRSlcbiAgICB2YXIgZ3JwY0NyZWRlbnRpYWxzID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5ncnBjQ3JlZGVudGlhbHMpXG5cbiAgICB2YXIgY2FsbEdycGMgPSAoe3NlcnZpY2UsIGV2ZW50TGlzdGVuZXIsIGRhdGF9KSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB2YXIgZ3JwY1NlcnZpY2UgPSBncnBjLmxvYWQoc2VydmljZS5wcm90bykuU2VydmljZVxuICAgICAgdmFyIGNsaWVudCA9IG5ldyBncnBjU2VydmljZShzZXJ2aWNlLmdycGMudXJsLCBncnBjQ3JlZGVudGlhbHMpXG4gICAgICB2YXIgY2FsbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZ3JwYy5jbG9zZUNsaWVudChjbGllbnQpXG4gICAgICAgIHJlamVjdCh7bWVzc2FnZTogJ1Jlc3BvbnNlIHByb2JsZW1zOiBSRVFVRVNUIFRJTUVPVVQ6IGNvbnRyb2wgcHJvdG8gZmlsZSBmb3IgY29ycmVjdCByZXNwb25zZSBmb3JtYXQnLCBzZXJ2aWNlLCBldmVudExpc3RlbmVyLCBkYXRhfSlcbiAgICAgIH0sIGV2ZW50TGlzdGVuZXIudGltZW91dCB8fCA1MDAwKVxuXG4gICAgICBjbGllbnRbZXZlbnRMaXN0ZW5lci5yb3V0ZV0oZGF0YSwgKGVycm9yLCBzZXJ2aWNlUmVzcG9uc2UpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNhbGxUaW1lb3V0KVxuICAgICAgICBpZiAoZXJyb3IpcmVqZWN0KGVycm9yKVxuICAgICAgICByZXNvbHZlKHNlcnZpY2VSZXNwb25zZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgICB2YXIgZXZlbnRzUmVnaXN0cnkgPSBhd2FpdCBnZXRWYWx1ZVByb21pc2UoQ09ORklHLmV2ZW50c1JlZ2lzdHJ5KVxuICAgIHJldHVybiB7XG4gICAgICBlbWl0RXZlbnQgKHtuYW1lLCBkYXRhLCBzaW5nbGVSZXNwb25zZSA9IHRydWV9KSB7XG4gICAgICAgIGlmIChldmVudHNSZWdpc3RyeSAmJiBldmVudHNSZWdpc3RyeS5saXN0ZW5lcnMgJiYgZXZlbnRzUmVnaXN0cnkubGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICAgICAgdmFyIHdhaXRSZXNwb25zZXMgPSBbXVxuICAgICAgICAgIGV2ZW50c1JlZ2lzdHJ5Lmxpc3RlbmVyc1tuYW1lXS5mb3JFYWNoKChldmVudExpc3RlbmVyKSA9PiB7XG4gICAgICAgICAgICB2YXIgc2VydmljZSA9IGV2ZW50c1JlZ2lzdHJ5LnNlcnZpY2VzW2V2ZW50TGlzdGVuZXIuc2VydmljZV1cbiAgICAgICAgICAgIHZhciBjYWxsR3JwY1Byb21pc2UgPSBjYWxsR3JwYyh7c2VydmljZTogc2VydmljZSwgZXZlbnRMaXN0ZW5lciwgZGF0YX0pXG4gICAgICAgICAgICBpZiAoZXZlbnRMaXN0ZW5lci5oYXZlUmVzcG9uc2Upd2FpdFJlc3BvbnNlcy5wdXNoKGNhbGxHcnBjUHJvbWlzZSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICh3YWl0UmVzcG9uc2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHNpbmdsZVJlc3BvbnNlKSByZXR1cm4gd2FpdFJlc3BvbnNlc1swXVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gUHJvbWlzZS5hbGwod2FpdFJlc3BvbnNlcylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0TmV0UGFja2FnZShDT05GSUcsIERJKScsIGVycm9yKVxuICB9XG59XG4iXX0=