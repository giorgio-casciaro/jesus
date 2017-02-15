'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var express = require('express-http2');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var R = require('ramda');
module.exports = function getHttpApiPackage(CONFIG, DI) {
  try {
    var httpApi;
    var httpServer;

    var _ret = function () {
      var PACKAGE = 'api.http';
      var getValuePromise = require('./jesus').getValuePromise;
      var checkRequired = require('./jesus').checkRequired;
      CONFIG = checkRequired(CONFIG, ['httpPort'], PACKAGE);
      DI = checkRequired(DI, ['getRoutes', 'throwError', 'log', 'debug'], PACKAGE);

      return {
        v: {
          start: function start() {
            var protoFile, httpPort;
            return regeneratorRuntime.async(function start$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.proto));

                  case 2:
                    protoFile = _context.sent;
                    _context.next = 5;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.httpPort));

                  case 5:
                    httpPort = _context.sent;

                    httpApi = express();
                    httpApi.use(compression({ level: 1 }));
                    httpApi.use(bodyParser.json()); // support json encoded bodies
                    httpApi.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

                    R.mapObjIndexed(function (routeFunction, routeName) {
                      var httpBridge = function httpBridge(req, res) {
                        var data = req.body || req.query;
                        routeFunction(data).then(function (response) {
                          return res.send(response);
                        }).catch(function (error) {
                          return res.send(error);
                        });
                      };
                      httpApi.get('/' + routeName, httpBridge);
                      httpApi.post('/' + routeName, httpBridge);
                    }, DI.getRoutes());
                    httpServer = httpApi.listen(httpPort);

                  case 12:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this);
          },
          stop: function stop() {
            httpServer.close();
          },
          httpart: function httpart() {
            httpServer.close(start);
          }
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    DI.throwError('getHttpApiPackage(CONFIG, DI)', error);
  }
};

// {

// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5odHRwLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsIlIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0SHR0cEFwaVBhY2thZ2UiLCJDT05GSUciLCJESSIsImh0dHBBcGkiLCJodHRwU2VydmVyIiwiUEFDS0FHRSIsImdldFZhbHVlUHJvbWlzZSIsImNoZWNrUmVxdWlyZWQiLCJzdGFydCIsInByb3RvIiwicHJvdG9GaWxlIiwiaHR0cFBvcnQiLCJ1c2UiLCJsZXZlbCIsImpzb24iLCJ1cmxlbmNvZGVkIiwiZXh0ZW5kZWQiLCJtYXBPYmpJbmRleGVkIiwicm91dGVGdW5jdGlvbiIsInJvdXRlTmFtZSIsImh0dHBCcmlkZ2UiLCJyZXEiLCJyZXMiLCJkYXRhIiwiYm9keSIsInF1ZXJ5IiwidGhlbiIsInNlbmQiLCJyZXNwb25zZSIsImNhdGNoIiwiZXJyb3IiLCJnZXQiLCJwb3N0IiwiZ2V0Um91dGVzIiwibGlzdGVuIiwic3RvcCIsImNsb3NlIiwiaHR0cGFydCIsInRocm93RXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLGVBQVIsQ0FBZDtBQUNBLElBQUlDLGFBQWFELFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQUlFLGNBQWNGLFFBQVEsYUFBUixDQUFsQjtBQUNBLElBQUlHLFNBQVNILFFBQVEsUUFBUixDQUFiO0FBQ0EsSUFBSUksSUFBSUosUUFBUSxPQUFSLENBQVI7QUFDQUssT0FBT0MsT0FBUCxHQUFpQixTQUFTQyxpQkFBVCxDQUE0QkMsTUFBNUIsRUFBb0NDLEVBQXBDLEVBQXdDO0FBQ3ZELE1BQUk7QUFBQSxRQU9FQyxPQVBGO0FBQUEsUUFRRUMsVUFSRjs7QUFBQTtBQUNGLFVBQU1DLFVBQVUsVUFBaEI7QUFDQSxVQUFNQyxrQkFBa0JiLFFBQVEsU0FBUixFQUFtQmEsZUFBM0M7QUFDQSxVQUFNQyxnQkFBZ0JkLFFBQVEsU0FBUixFQUFtQmMsYUFBekM7QUFDQU4sZUFBU00sY0FBY04sTUFBZCxFQUFzQixDQUFDLFVBQUQsQ0FBdEIsRUFBb0NJLE9BQXBDLENBQVQ7QUFDQUgsV0FBS0ssY0FBY0wsRUFBZCxFQUFrQixDQUFFLFdBQUYsRUFBZSxZQUFmLEVBQTZCLEtBQTdCLEVBQW9DLE9BQXBDLENBQWxCLEVBQWdFRyxPQUFoRSxDQUFMOztBQUtBO0FBQUEsV0FBTztBQUNDRyxlQUREO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0RBRW1CRixnQkFBZ0JMLE9BQU9RLEtBQXZCLENBRm5COztBQUFBO0FBRUNDLDZCQUZEO0FBQUE7QUFBQSxvREFHa0JKLGdCQUFnQkwsT0FBT1UsUUFBdkIsQ0FIbEI7O0FBQUE7QUFHQ0EsNEJBSEQ7O0FBSUhSLDhCQUFVWCxTQUFWO0FBQ0FXLDRCQUFRUyxHQUFSLENBQVlqQixZQUFZLEVBQUNrQixPQUFPLENBQVIsRUFBWixDQUFaO0FBQ0FWLDRCQUFRUyxHQUFSLENBQVlsQixXQUFXb0IsSUFBWCxFQUFaLEVBTkcsQ0FNNkI7QUFDaENYLDRCQUFRUyxHQUFSLENBQVlsQixXQUFXcUIsVUFBWCxDQUFzQixFQUFFQyxVQUFVLElBQVosRUFBdEIsQ0FBWixFQVBHLENBT3FEOztBQUV4RG5CLHNCQUFFb0IsYUFBRixDQUFnQixVQUFDQyxhQUFELEVBQWdCQyxTQUFoQixFQUE4QjtBQUM1QywwQkFBSUMsYUFBYSxTQUFiQSxVQUFhLENBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQzdCLDRCQUFJQyxPQUFLRixJQUFJRyxJQUFKLElBQVVILElBQUlJLEtBQXZCO0FBQ0FQLHNDQUFjSyxJQUFkLEVBQ0NHLElBREQsQ0FDTTtBQUFBLGlDQUFZSixJQUFJSyxJQUFKLENBQVNDLFFBQVQsQ0FBWjtBQUFBLHlCQUROLEVBRUNDLEtBRkQsQ0FFTztBQUFBLGlDQUFTUCxJQUFJSyxJQUFKLENBQVNHLEtBQVQsQ0FBVDtBQUFBLHlCQUZQO0FBR0QsdUJBTEQ7QUFNQTNCLDhCQUFRNEIsR0FBUixDQUFZLE1BQU1aLFNBQWxCLEVBQTZCQyxVQUE3QjtBQUNBakIsOEJBQVE2QixJQUFSLENBQWEsTUFBTWIsU0FBbkIsRUFBOEJDLFVBQTlCO0FBQ0QscUJBVEQsRUFTR2xCLEdBQUcrQixTQUFILEVBVEg7QUFVQTdCLGlDQUFhRCxRQUFRK0IsTUFBUixDQUFldkIsUUFBZixDQUFiOztBQW5CRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXFCTHdCLGNBckJLLGtCQXFCRztBQUNOL0IsdUJBQVdnQyxLQUFYO0FBQ0QsV0F2Qkk7QUF3QkxDLGlCQXhCSyxxQkF3Qk07QUFDVGpDLHVCQUFXZ0MsS0FBWCxDQUFpQjVCLEtBQWpCO0FBQ0Q7QUExQkk7QUFBUDtBQVZFOztBQUFBO0FBc0NILEdBdENELENBc0NFLE9BQU9zQixLQUFQLEVBQWM7QUFDZDVCLE9BQUdvQyxVQUFILENBQWMsK0JBQWQsRUFBK0NSLEtBQS9DO0FBQ0Q7QUFDRixDQTFDRDs7QUE0Q0E7O0FBRUEiLCJmaWxlIjoiYXBpLmh0dHAuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzLWh0dHAyJylcbnZhciBib2R5UGFyc2VyID0gcmVxdWlyZSgnYm9keS1wYXJzZXInKTtcbnZhciBjb21wcmVzc2lvbiA9IHJlcXVpcmUoJ2NvbXByZXNzaW9uJylcbnZhciBoZWxtZXQgPSByZXF1aXJlKCdoZWxtZXQnKVxudmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEh0dHBBcGlQYWNrYWdlIChDT05GSUcsIERJKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgUEFDS0FHRSA9ICdhcGkuaHR0cCdcbiAgICBjb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG4gICAgY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG4gICAgQ09ORklHID0gY2hlY2tSZXF1aXJlZChDT05GSUcsIFsnaHR0cFBvcnQnXSwgUEFDS0FHRSlcbiAgICBESSA9IGNoZWNrUmVxdWlyZWQoREksIFsgJ2dldFJvdXRlcycsICd0aHJvd0Vycm9yJywgJ2xvZycsICdkZWJ1ZyddLCBQQUNLQUdFKVxuXG4gICAgdmFyIGh0dHBBcGlcbiAgICB2YXIgaHR0cFNlcnZlclxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFzeW5jIHN0YXJ0ICgpIHtcbiAgICAgICAgdmFyIHByb3RvRmlsZSA9IGF3YWl0IGdldFZhbHVlUHJvbWlzZShDT05GSUcucHJvdG8pXG4gICAgICAgIHZhciBodHRwUG9ydCA9IGF3YWl0IGdldFZhbHVlUHJvbWlzZShDT05GSUcuaHR0cFBvcnQpXG4gICAgICAgIGh0dHBBcGkgPSBleHByZXNzKClcbiAgICAgICAgaHR0cEFwaS51c2UoY29tcHJlc3Npb24oe2xldmVsOiAxfSkpXG4gICAgICAgIGh0dHBBcGkudXNlKGJvZHlQYXJzZXIuanNvbigpKTsgLy8gc3VwcG9ydCBqc29uIGVuY29kZWQgYm9kaWVzXG4gICAgICAgIGh0dHBBcGkudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKTsgLy8gc3VwcG9ydCBlbmNvZGVkIGJvZGllc1xuXG4gICAgICAgIFIubWFwT2JqSW5kZXhlZCgocm91dGVGdW5jdGlvbiwgcm91dGVOYW1lKSA9PiB7XG4gICAgICAgICAgdmFyIGh0dHBCcmlkZ2UgPSAocmVxLCByZXMpID0+IHtcbiAgICAgICAgICAgIHZhciBkYXRhPXJlcS5ib2R5fHxyZXEucXVlcnlcbiAgICAgICAgICAgIHJvdXRlRnVuY3Rpb24oZGF0YSlcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlcy5zZW5kKHJlc3BvbnNlKSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiByZXMuc2VuZChlcnJvcikpXG4gICAgICAgICAgfVxuICAgICAgICAgIGh0dHBBcGkuZ2V0KCcvJyArIHJvdXRlTmFtZSwgaHR0cEJyaWRnZSlcbiAgICAgICAgICBodHRwQXBpLnBvc3QoJy8nICsgcm91dGVOYW1lLCBodHRwQnJpZGdlKVxuICAgICAgICB9LCBESS5nZXRSb3V0ZXMoKSlcbiAgICAgICAgaHR0cFNlcnZlciA9IGh0dHBBcGkubGlzdGVuKGh0dHBQb3J0KVxuICAgICAgfSxcbiAgICAgIHN0b3AgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKClcbiAgICAgIH0sXG4gICAgICBodHRwYXJ0ICgpIHtcbiAgICAgICAgaHR0cFNlcnZlci5jbG9zZShzdGFydClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0SHR0cEFwaVBhY2thZ2UoQ09ORklHLCBESSknLCBlcnJvcilcbiAgfVxufVxuXG4vLyB7XG5cbi8vIH1cbiJdfQ==