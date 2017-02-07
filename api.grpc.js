'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var grpc = require('grpc');
var R = require('ramda');
module.exports = function getGrpcApiPackage(CONFIG, DI) {
  try {
    var addGrpcRoutesBridge;
    var grpcApi;
    var routeServer;

    var _ret = function () {
      var PACKAGE = 'api.grpc';
      var getValuePromise = require('./jesus').getValuePromise;
      var checkRequired = require('./jesus').checkRequired;
      CONFIG = checkRequired(CONFIG, ['proto', 'grpcUrl'], PACKAGE);
      DI = checkRequired(DI, ['getRoutes', 'throwError', 'log', 'debug'], PACKAGE);

      addGrpcRoutesBridge = function addGrpcRoutesBridge(routeFunction) {
        return function grpcBridge(call, callback) {
          routeFunction(call.request).then(function (response) {
            return callback(null, response);
          }) // PROBLEMA: grpc non da errore in caso di risposta formattata male
          .catch(function (error) {
            return callback(null, error);
          });
        };
      };

      return {
        v: {
          start: function start() {
            var protoFile, grpcUrl, PROTO;
            return regeneratorRuntime.async(function start$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    grpcApi = R.map(addGrpcRoutesBridge, DI.getRoutes());
                    _context.next = 3;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.proto));

                  case 3:
                    protoFile = _context.sent;
                    _context.next = 6;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.grpcUrl));

                  case 6:
                    grpcUrl = _context.sent;
                    PROTO = grpc.load(protoFile);

                    routeServer = new grpc.Server();
                    routeServer.addProtoService(PROTO.Service.service, grpcApi);
                    routeServer.bind(grpcUrl, grpc.ServerCredentials.createInsecure());
                    routeServer.start();

                  case 12:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this);
          },
          stop: function stop() {
            routeServer.tryShutdown(function () {});
          },
          restart: function restart() {
            routeServer.tryShutdown(start);
          }
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    DI.throwError('getGrpcApiPackage(CONFIG, DI)', error);
  }
};

// {

// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5ncnBjLmVzNiJdLCJuYW1lcyI6WyJncnBjIiwicmVxdWlyZSIsIlIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0R3JwY0FwaVBhY2thZ2UiLCJDT05GSUciLCJESSIsImFkZEdycGNSb3V0ZXNCcmlkZ2UiLCJncnBjQXBpIiwicm91dGVTZXJ2ZXIiLCJQQUNLQUdFIiwiZ2V0VmFsdWVQcm9taXNlIiwiY2hlY2tSZXF1aXJlZCIsInJvdXRlRnVuY3Rpb24iLCJncnBjQnJpZGdlIiwiY2FsbCIsImNhbGxiYWNrIiwicmVxdWVzdCIsInRoZW4iLCJyZXNwb25zZSIsImNhdGNoIiwiZXJyb3IiLCJzdGFydCIsIm1hcCIsImdldFJvdXRlcyIsInByb3RvIiwicHJvdG9GaWxlIiwiZ3JwY1VybCIsIlBST1RPIiwibG9hZCIsIlNlcnZlciIsImFkZFByb3RvU2VydmljZSIsIlNlcnZpY2UiLCJzZXJ2aWNlIiwiYmluZCIsIlNlcnZlckNyZWRlbnRpYWxzIiwiY3JlYXRlSW5zZWN1cmUiLCJzdG9wIiwidHJ5U2h1dGRvd24iLCJyZXN0YXJ0IiwidGhyb3dFcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLE9BQU9DLFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUMsSUFBSUQsUUFBUSxPQUFSLENBQVI7QUFDQUUsT0FBT0MsT0FBUCxHQUFpQixTQUFTQyxpQkFBVCxDQUE0QkMsTUFBNUIsRUFBb0NDLEVBQXBDLEVBQXdDO0FBQ3ZELE1BQUk7QUFBQSxRQU9FQyxtQkFQRjtBQUFBLFFBY0VDLE9BZEY7QUFBQSxRQWVFQyxXQWZGOztBQUFBO0FBQ0YsVUFBTUMsVUFBVSxVQUFoQjtBQUNBLFVBQU1DLGtCQUFrQlgsUUFBUSxTQUFSLEVBQW1CVyxlQUEzQztBQUNBLFVBQU1DLGdCQUFnQlosUUFBUSxTQUFSLEVBQW1CWSxhQUF6QztBQUNBUCxlQUFTTyxjQUFjUCxNQUFkLEVBQXNCLENBQUMsT0FBRCxFQUFVLFNBQVYsQ0FBdEIsRUFBNENLLE9BQTVDLENBQVQ7QUFDQUosV0FBS00sY0FBY04sRUFBZCxFQUFrQixDQUFFLFdBQUYsRUFBYyxZQUFkLEVBQTRCLEtBQTVCLEVBQW1DLE9BQW5DLENBQWxCLEVBQStESSxPQUEvRCxDQUFMOztBQUVJSCw0QkFBc0IsNkJBQUNNLGFBQUQsRUFBbUI7QUFDM0MsZUFBTyxTQUFTQyxVQUFULENBQXFCQyxJQUFyQixFQUEyQkMsUUFBM0IsRUFBcUM7QUFDMUNILHdCQUFjRSxLQUFLRSxPQUFuQixFQUNDQyxJQURELENBQ007QUFBQSxtQkFBWUYsU0FBUyxJQUFULEVBQWVHLFFBQWYsQ0FBWjtBQUFBLFdBRE4sRUFDNEM7QUFENUMsV0FFQ0MsS0FGRCxDQUVPO0FBQUEsbUJBQVNKLFNBQVMsSUFBVCxFQUFlSyxLQUFmLENBQVQ7QUFBQSxXQUZQO0FBR0QsU0FKRDtBQUtELE9BYkM7O0FBZ0JGO0FBQUEsV0FBTztBQUNDQyxlQUREO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVIZCw4QkFBVVAsRUFBRXNCLEdBQUYsQ0FBTWhCLG1CQUFOLEVBQTJCRCxHQUFHa0IsU0FBSCxFQUEzQixDQUFWO0FBRkc7QUFBQSxvREFHbUJiLGdCQUFnQk4sT0FBT29CLEtBQXZCLENBSG5COztBQUFBO0FBR0NDLDZCQUhEO0FBQUE7QUFBQSxvREFJaUJmLGdCQUFnQk4sT0FBT3NCLE9BQXZCLENBSmpCOztBQUFBO0FBSUNBLDJCQUpEO0FBS0NDLHlCQUxELEdBS1M3QixLQUFLOEIsSUFBTCxDQUFVSCxTQUFWLENBTFQ7O0FBTUhqQixrQ0FBYyxJQUFJVixLQUFLK0IsTUFBVCxFQUFkO0FBQ0FyQixnQ0FBWXNCLGVBQVosQ0FBNEJILE1BQU1JLE9BQU4sQ0FBY0MsT0FBMUMsRUFBbUR6QixPQUFuRDtBQUNBQyxnQ0FBWXlCLElBQVosQ0FBaUJQLE9BQWpCLEVBQTBCNUIsS0FBS29DLGlCQUFMLENBQXVCQyxjQUF2QixFQUExQjtBQUNBM0IsZ0NBQVlhLEtBQVo7O0FBVEc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXTGUsY0FYSyxrQkFXRztBQUNONUIsd0JBQVk2QixXQUFaLENBQXdCLFlBQU0sQ0FBRSxDQUFoQztBQUNELFdBYkk7QUFjTEMsaUJBZEsscUJBY007QUFDVDlCLHdCQUFZNkIsV0FBWixDQUF3QmhCLEtBQXhCO0FBQ0Q7QUFoQkk7QUFBUDtBQWhCRTs7QUFBQTtBQWtDSCxHQWxDRCxDQWtDRSxPQUFPRCxLQUFQLEVBQWM7QUFDZGYsT0FBR2tDLFVBQUgsQ0FBYywrQkFBZCxFQUErQ25CLEtBQS9DO0FBQ0Q7QUFDRixDQXRDRDs7QUF3Q0E7O0FBRUEiLCJmaWxlIjoiYXBpLmdycGMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdycGMgPSByZXF1aXJlKCdncnBjJylcbnZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRHcnBjQXBpUGFja2FnZSAoQ09ORklHLCBESSkge1xuICB0cnkge1xuICAgIGNvbnN0IFBBQ0tBR0UgPSAnYXBpLmdycGMnXG4gICAgY29uc3QgZ2V0VmFsdWVQcm9taXNlID0gcmVxdWlyZSgnLi9qZXN1cycpLmdldFZhbHVlUHJvbWlzZVxuICAgIGNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuICAgIENPTkZJRyA9IGNoZWNrUmVxdWlyZWQoQ09ORklHLCBbJ3Byb3RvJywgJ2dycGNVcmwnXSwgUEFDS0FHRSlcbiAgICBESSA9IGNoZWNrUmVxdWlyZWQoREksIFsgJ2dldFJvdXRlcycsJ3Rocm93RXJyb3InLCAnbG9nJywgJ2RlYnVnJ10sIFBBQ0tBR0UpXG5cbiAgICB2YXIgYWRkR3JwY1JvdXRlc0JyaWRnZSA9IChyb3V0ZUZ1bmN0aW9uKSA9PiB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gZ3JwY0JyaWRnZSAoY2FsbCwgY2FsbGJhY2spIHtcbiAgICAgICAgcm91dGVGdW5jdGlvbihjYWxsLnJlcXVlc3QpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKSkgLy8gUFJPQkxFTUE6IGdycGMgbm9uIGRhIGVycm9yZSBpbiBjYXNvIGRpIHJpc3Bvc3RhIGZvcm1hdHRhdGEgbWFsZVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY2FsbGJhY2sobnVsbCwgZXJyb3IpKVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZ3JwY0FwaVxuICAgIHZhciByb3V0ZVNlcnZlclxuICAgIHJldHVybiB7XG4gICAgICBhc3luYyBzdGFydCAoKSB7XG4gICAgICAgIGdycGNBcGkgPSBSLm1hcChhZGRHcnBjUm91dGVzQnJpZGdlLCBESS5nZXRSb3V0ZXMoKSlcbiAgICAgICAgdmFyIHByb3RvRmlsZSA9IGF3YWl0IGdldFZhbHVlUHJvbWlzZShDT05GSUcucHJvdG8pXG4gICAgICAgIHZhciBncnBjVXJsID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5ncnBjVXJsKVxuICAgICAgICB2YXIgUFJPVE8gPSBncnBjLmxvYWQocHJvdG9GaWxlKVxuICAgICAgICByb3V0ZVNlcnZlciA9IG5ldyBncnBjLlNlcnZlcigpXG4gICAgICAgIHJvdXRlU2VydmVyLmFkZFByb3RvU2VydmljZShQUk9UTy5TZXJ2aWNlLnNlcnZpY2UsIGdycGNBcGkpXG4gICAgICAgIHJvdXRlU2VydmVyLmJpbmQoZ3JwY1VybCwgZ3JwYy5TZXJ2ZXJDcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgICAgICByb3V0ZVNlcnZlci5zdGFydCgpXG4gICAgICB9LFxuICAgICAgc3RvcCAoKSB7XG4gICAgICAgIHJvdXRlU2VydmVyLnRyeVNodXRkb3duKCgpID0+IHt9KVxuICAgICAgfSxcbiAgICAgIHJlc3RhcnQgKCkge1xuICAgICAgICByb3V0ZVNlcnZlci50cnlTaHV0ZG93bihzdGFydClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0R3JwY0FwaVBhY2thZ2UoQ09ORklHLCBESSknLCBlcnJvcilcbiAgfVxufVxuXG4vLyB7XG5cbi8vIH1cbiJdfQ==