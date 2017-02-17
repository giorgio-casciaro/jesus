'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var express = require('express-http2');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var R = require('ramda');
var LOG = console;
var PACKAGE = 'api.http';

var checkRequired = require('./jesus').checkRequired;
module.exports = function getHttpApiPackage(_ref) {
  var _ref$privateOnly = _ref.privateOnly,
      privateOnly = _ref$privateOnly === undefined ? false : _ref$privateOnly,
      _ref$httpPort = _ref.httpPort,
      httpPort = _ref$httpPort === undefined ? 80 : _ref$httpPort,
      serviceMethodsFile = _ref.serviceMethodsFile;

  try {
    var httpApi;
    var httpServer;

    var _ret = function () {
      var start = function _callee() {
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                httpApi = express();
                httpApi.use(compression({ level: 1 }));
                httpApi.use(bodyParser.json()); // support json encoded bodies
                httpApi.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
                httpApi.all('*', function (req, res) {
                  var functionName = req.url.replace('/', '');
                  var service = require(serviceMethodsFile);
                  if (!service[functionName]) throw new Error(functionName + ' is not valid');
                  LOG.debug(httpPort, serviceMethodsFile);
                  var data = req.body || req.query;
                  service[functionName](data).then(function (response) {
                    return res.send(response);
                  }).catch(function (error) {
                    return res.send(error);
                  });
                });
                httpServer = httpApi.listen(httpPort);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, null, this);
      };

      checkRequired({ serviceMethodsFile: serviceMethodsFile });

      return {
        v: {
          start: start,
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
    LOG.error(error);
    throw error;
  }
};

// {

// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5odHRwLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsIlIiLCJMT0ciLCJjb25zb2xlIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0SHR0cEFwaVBhY2thZ2UiLCJwcml2YXRlT25seSIsImh0dHBQb3J0Iiwic2VydmljZU1ldGhvZHNGaWxlIiwiaHR0cEFwaSIsImh0dHBTZXJ2ZXIiLCJzdGFydCIsInVzZSIsImxldmVsIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImFsbCIsInJlcSIsInJlcyIsImZ1bmN0aW9uTmFtZSIsInVybCIsInJlcGxhY2UiLCJzZXJ2aWNlIiwiRXJyb3IiLCJkZWJ1ZyIsImRhdGEiLCJib2R5IiwicXVlcnkiLCJ0aGVuIiwic2VuZCIsInJlc3BvbnNlIiwiY2F0Y2giLCJlcnJvciIsImxpc3RlbiIsInN0b3AiLCJjbG9zZSIsImh0dHBhcnQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLGVBQVIsQ0FBZDtBQUNBLElBQUlDLGFBQWFELFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQUlFLGNBQWNGLFFBQVEsYUFBUixDQUFsQjtBQUNBLElBQUlHLFNBQVNILFFBQVEsUUFBUixDQUFiO0FBQ0EsSUFBSUksSUFBSUosUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJSyxNQUFNQyxPQUFWO0FBQ0EsSUFBTUMsVUFBVSxVQUFoQjs7QUFFQSxJQUFJQyxnQkFBZ0JSLFFBQVEsU0FBUixFQUFtQlEsYUFBdkM7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQixTQUFTQyxpQkFBVCxPQUF1RjtBQUFBLDhCQUExREMsV0FBMEQ7QUFBQSxNQUExREEsV0FBMEQsb0NBQTVDLEtBQTRDO0FBQUEsMkJBQXJDQyxRQUFxQztBQUFBLE1BQXJDQSxRQUFxQyxpQ0FBMUIsRUFBMEI7QUFBQSxNQUF0QkMsa0JBQXNCLFFBQXRCQSxrQkFBc0I7O0FBQ3RHLE1BQUk7QUFBQSxRQUNFQyxPQURGO0FBQUEsUUFFRUMsVUFGRjs7QUFBQTtBQUFBLFVBSWFDLEtBSmIsR0FJRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0VGLDBCQUFVaEIsU0FBVjtBQUNBZ0Isd0JBQVFHLEdBQVIsQ0FBWWhCLFlBQVksRUFBQ2lCLE9BQU8sQ0FBUixFQUFaLENBQVo7QUFDQUosd0JBQVFHLEdBQVIsQ0FBWWpCLFdBQVdtQixJQUFYLEVBQVosRUFIRixDQUdpQztBQUMvQkwsd0JBQVFHLEdBQVIsQ0FBWWpCLFdBQVdvQixVQUFYLENBQXNCLEVBQUVDLFVBQVUsSUFBWixFQUF0QixDQUFaLEVBSkYsQ0FJeUQ7QUFDdkRQLHdCQUFRUSxHQUFSLENBQVksR0FBWixFQUFpQixVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUM3QixzQkFBSUMsZUFBZUYsSUFBSUcsR0FBSixDQUFRQyxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLEVBQXJCLENBQW5CO0FBQ0Esc0JBQUlDLFVBQVU3QixRQUFRYyxrQkFBUixDQUFkO0FBQ0Esc0JBQUksQ0FBQ2UsUUFBUUgsWUFBUixDQUFMLEVBQTRCLE1BQU0sSUFBSUksS0FBSixDQUFVSixlQUFlLGVBQXpCLENBQU47QUFDNUJyQixzQkFBSTBCLEtBQUosQ0FBVWxCLFFBQVYsRUFBb0JDLGtCQUFwQjtBQUNBLHNCQUFJa0IsT0FBT1IsSUFBSVMsSUFBSixJQUFZVCxJQUFJVSxLQUEzQjtBQUNBTCwwQkFBUUgsWUFBUixFQUFzQk0sSUFBdEIsRUFDR0csSUFESCxDQUNRO0FBQUEsMkJBQVlWLElBQUlXLElBQUosQ0FBU0MsUUFBVCxDQUFaO0FBQUEsbUJBRFIsRUFFR0MsS0FGSCxDQUVTO0FBQUEsMkJBQVNiLElBQUlXLElBQUosQ0FBU0csS0FBVCxDQUFUO0FBQUEsbUJBRlQ7QUFHRCxpQkFURDtBQVVBdkIsNkJBQWFELFFBQVF5QixNQUFSLENBQWUzQixRQUFmLENBQWI7O0FBZkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FKRTs7QUFHRkwsb0JBQWMsRUFBQ00sc0NBQUQsRUFBZDs7QUFrQkE7QUFBQSxXQUFPO0FBQ0xHLHNCQURLO0FBRUx3QixjQUZLLGtCQUVHO0FBQ056Qix1QkFBVzBCLEtBQVg7QUFDRCxXQUpJO0FBS0xDLGlCQUxLLHFCQUtNO0FBQ1QzQix1QkFBVzBCLEtBQVgsQ0FBaUJ6QixLQUFqQjtBQUNEO0FBUEk7QUFBUDtBQXJCRTs7QUFBQTtBQThCSCxHQTlCRCxDQThCRSxPQUFPc0IsS0FBUCxFQUFjO0FBQ2RsQyxRQUFJa0MsS0FBSixDQUFVQSxLQUFWO0FBQ0EsVUFBTUEsS0FBTjtBQUNEO0FBQ0YsQ0FuQ0Q7O0FBcUNBOztBQUVBIiwiZmlsZSI6ImFwaS5odHRwLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcy1odHRwMicpXG52YXIgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2JvZHktcGFyc2VyJylcbnZhciBjb21wcmVzc2lvbiA9IHJlcXVpcmUoJ2NvbXByZXNzaW9uJylcbnZhciBoZWxtZXQgPSByZXF1aXJlKCdoZWxtZXQnKVxudmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgTE9HID0gY29uc29sZVxuY29uc3QgUEFDS0FHRSA9ICdhcGkuaHR0cCdcblxudmFyIGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRIdHRwQXBpUGFja2FnZSAoe3ByaXZhdGVPbmx5ID0gZmFsc2UsIGh0dHBQb3J0ID0gODAsIHNlcnZpY2VNZXRob2RzRmlsZSB9KSB7XG4gIHRyeSB7XG4gICAgdmFyIGh0dHBBcGlcbiAgICB2YXIgaHR0cFNlcnZlclxuICAgIGNoZWNrUmVxdWlyZWQoe3NlcnZpY2VNZXRob2RzRmlsZX0pXG4gICAgYXN5bmMgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgaHR0cEFwaSA9IGV4cHJlc3MoKVxuICAgICAgaHR0cEFwaS51c2UoY29tcHJlc3Npb24oe2xldmVsOiAxfSkpXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLmpzb24oKSkgLy8gc3VwcG9ydCBqc29uIGVuY29kZWQgYm9kaWVzXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSkgLy8gc3VwcG9ydCBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS5hbGwoJyonLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHJlcS51cmwucmVwbGFjZSgnLycsICcnKVxuICAgICAgICB2YXIgc2VydmljZSA9IHJlcXVpcmUoc2VydmljZU1ldGhvZHNGaWxlKVxuICAgICAgICBpZiAoIXNlcnZpY2VbZnVuY3Rpb25OYW1lXSkgdGhyb3cgbmV3IEVycm9yKGZ1bmN0aW9uTmFtZSArICcgaXMgbm90IHZhbGlkJylcbiAgICAgICAgTE9HLmRlYnVnKGh0dHBQb3J0LCBzZXJ2aWNlTWV0aG9kc0ZpbGUpXG4gICAgICAgIHZhciBkYXRhID0gcmVxLmJvZHkgfHwgcmVxLnF1ZXJ5XG4gICAgICAgIHNlcnZpY2VbZnVuY3Rpb25OYW1lXShkYXRhKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlcy5zZW5kKHJlc3BvbnNlKSlcbiAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gcmVzLnNlbmQoZXJyb3IpKVxuICAgICAgfSlcbiAgICAgIGh0dHBTZXJ2ZXIgPSBodHRwQXBpLmxpc3RlbihodHRwUG9ydClcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0LFxuICAgICAgc3RvcCAoKSB7XG4gICAgICAgIGh0dHBTZXJ2ZXIuY2xvc2UoKVxuICAgICAgfSxcbiAgICAgIGh0dHBhcnQgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKHN0YXJ0KVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBMT0cuZXJyb3IoZXJyb3IpXG4gICAgdGhyb3cgZXJyb3JcbiAgfVxufVxuXG4vLyB7XG5cbi8vIH1cbiJdfQ==