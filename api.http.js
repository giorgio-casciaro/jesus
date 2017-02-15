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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5odHRwLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsIlIiLCJMT0ciLCJjb25zb2xlIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0SHR0cEFwaVBhY2thZ2UiLCJwcml2YXRlT25seSIsImh0dHBQb3J0Iiwic2VydmljZU1ldGhvZHNGaWxlIiwiaHR0cEFwaSIsImh0dHBTZXJ2ZXIiLCJzdGFydCIsInVzZSIsImxldmVsIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImFsbCIsInJlcSIsInJlcyIsImZ1bmN0aW9uTmFtZSIsInVybCIsInJlcGxhY2UiLCJzZXJ2aWNlIiwiRXJyb3IiLCJkZWJ1ZyIsImRhdGEiLCJib2R5IiwicXVlcnkiLCJ0aGVuIiwic2VuZCIsInJlc3BvbnNlIiwiY2F0Y2giLCJlcnJvciIsImxpc3RlbiIsInN0b3AiLCJjbG9zZSIsImh0dHBhcnQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLGVBQVIsQ0FBZDtBQUNBLElBQUlDLGFBQWFELFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQUlFLGNBQWNGLFFBQVEsYUFBUixDQUFsQjtBQUNBLElBQUlHLFNBQVNILFFBQVEsUUFBUixDQUFiO0FBQ0EsSUFBSUksSUFBSUosUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJSyxNQUFNQyxPQUFWO0FBQ0EsSUFBTUMsVUFBVSxVQUFoQjs7QUFFQSxJQUFJQyxnQkFBZ0JSLFFBQVEsU0FBUixFQUFtQlEsYUFBdkM7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQixTQUFTQyxpQkFBVCxPQUF1RjtBQUFBLDhCQUExREMsV0FBMEQ7QUFBQSxNQUExREEsV0FBMEQsb0NBQTVDLEtBQTRDO0FBQUEsMkJBQXJDQyxRQUFxQztBQUFBLE1BQXJDQSxRQUFxQyxpQ0FBMUIsRUFBMEI7QUFBQSxNQUF0QkMsa0JBQXNCLFFBQXRCQSxrQkFBc0I7O0FBQ3RHLE1BQUk7QUFBQSxRQUVFQyxPQUZGO0FBQUEsUUFHRUMsVUFIRjs7QUFBQTtBQUFBLFVBS2FDLEtBTGIsR0FLRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0VGLDBCQUFVaEIsU0FBVjtBQUNBZ0Isd0JBQVFHLEdBQVIsQ0FBWWhCLFlBQVksRUFBQ2lCLE9BQU8sQ0FBUixFQUFaLENBQVo7QUFDQUosd0JBQVFHLEdBQVIsQ0FBWWpCLFdBQVdtQixJQUFYLEVBQVosRUFIRixDQUdpQztBQUMvQkwsd0JBQVFHLEdBQVIsQ0FBWWpCLFdBQVdvQixVQUFYLENBQXNCLEVBQUVDLFVBQVUsSUFBWixFQUF0QixDQUFaLEVBSkYsQ0FJeUQ7QUFDdkRQLHdCQUFRUSxHQUFSLENBQVksR0FBWixFQUFpQixVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUM3QixzQkFBSUMsZUFBZUYsSUFBSUcsR0FBSixDQUFRQyxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLEVBQXJCLENBQW5CO0FBQ0Esc0JBQUlDLFVBQVU3QixRQUFRYyxrQkFBUixDQUFkO0FBQ0Esc0JBQUksQ0FBQ2UsUUFBUUgsWUFBUixDQUFMLEVBQTRCLE1BQU0sSUFBSUksS0FBSixDQUFVSixlQUFlLGVBQXpCLENBQU47O0FBRTVCckIsc0JBQUkwQixLQUFKLENBQVVsQixRQUFWLEVBQW9CQyxrQkFBcEI7O0FBRUEsc0JBQUlrQixPQUFPUixJQUFJUyxJQUFKLElBQVlULElBQUlVLEtBQTNCO0FBQ0FMLDBCQUFRSCxZQUFSLEVBQXNCTSxJQUF0QixFQUNHRyxJQURILENBQ1E7QUFBQSwyQkFBWVYsSUFBSVcsSUFBSixDQUFTQyxRQUFULENBQVo7QUFBQSxtQkFEUixFQUVHQyxLQUZILENBRVM7QUFBQSwyQkFBU2IsSUFBSVcsSUFBSixDQUFTRyxLQUFULENBQVQ7QUFBQSxtQkFGVDtBQUdELGlCQVhEOztBQWFBdkIsNkJBQWFELFFBQVF5QixNQUFSLENBQWUzQixRQUFmLENBQWI7O0FBbEJGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BTEU7O0FBSUZMLG9CQUFjLEVBQUNNLHNDQUFELEVBQWQ7O0FBcUJBO0FBQUEsV0FBTztBQUNMRyxzQkFESztBQUVMd0IsY0FGSyxrQkFFRztBQUNOekIsdUJBQVcwQixLQUFYO0FBQ0QsV0FKSTtBQUtMQyxpQkFMSyxxQkFLTTtBQUNUM0IsdUJBQVcwQixLQUFYLENBQWlCekIsS0FBakI7QUFDRDtBQVBJO0FBQVA7QUF6QkU7O0FBQUE7QUFrQ0gsR0FsQ0QsQ0FrQ0UsT0FBT3NCLEtBQVAsRUFBYztBQUNkbEMsUUFBSWtDLEtBQUosQ0FBVUEsS0FBVjtBQUNBLFVBQU1BLEtBQU47QUFDRDtBQUNGLENBdkNEOztBQXlDQTs7QUFFQSIsImZpbGUiOiJhcGkuaHR0cC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MtaHR0cDInKVxudmFyIGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpXG52YXIgY29tcHJlc3Npb24gPSByZXF1aXJlKCdjb21wcmVzc2lvbicpXG52YXIgaGVsbWV0ID0gcmVxdWlyZSgnaGVsbWV0JylcbnZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIExPRyA9IGNvbnNvbGVcbmNvbnN0IFBBQ0tBR0UgPSAnYXBpLmh0dHAnXG5cbnZhciBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0SHR0cEFwaVBhY2thZ2UgKHtwcml2YXRlT25seSA9IGZhbHNlLCBodHRwUG9ydCA9IDgwLCBzZXJ2aWNlTWV0aG9kc0ZpbGUgfSkge1xuICB0cnkge1xuXG4gICAgdmFyIGh0dHBBcGlcbiAgICB2YXIgaHR0cFNlcnZlclxuICAgIGNoZWNrUmVxdWlyZWQoe3NlcnZpY2VNZXRob2RzRmlsZX0pXG4gICAgYXN5bmMgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgaHR0cEFwaSA9IGV4cHJlc3MoKVxuICAgICAgaHR0cEFwaS51c2UoY29tcHJlc3Npb24oe2xldmVsOiAxfSkpXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLmpzb24oKSkgLy8gc3VwcG9ydCBqc29uIGVuY29kZWQgYm9kaWVzXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSkgLy8gc3VwcG9ydCBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS5hbGwoJyonLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHJlcS51cmwucmVwbGFjZSgnLycsICcnKVxuICAgICAgICB2YXIgc2VydmljZSA9IHJlcXVpcmUoc2VydmljZU1ldGhvZHNGaWxlKVxuICAgICAgICBpZiAoIXNlcnZpY2VbZnVuY3Rpb25OYW1lXSkgdGhyb3cgbmV3IEVycm9yKGZ1bmN0aW9uTmFtZSArICcgaXMgbm90IHZhbGlkJylcblxuICAgICAgICBMT0cuZGVidWcoaHR0cFBvcnQsIHNlcnZpY2VNZXRob2RzRmlsZSlcblxuICAgICAgICB2YXIgZGF0YSA9IHJlcS5ib2R5IHx8IHJlcS5xdWVyeVxuICAgICAgICBzZXJ2aWNlW2Z1bmN0aW9uTmFtZV0oZGF0YSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXMuc2VuZChyZXNwb25zZSkpXG4gICAgICAgICAgLmNhdGNoKGVycm9yID0+IHJlcy5zZW5kKGVycm9yKSlcbiAgICAgIH0pXG5cbiAgICAgIGh0dHBTZXJ2ZXIgPSBodHRwQXBpLmxpc3RlbihodHRwUG9ydClcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0LFxuICAgICAgc3RvcCAoKSB7XG4gICAgICAgIGh0dHBTZXJ2ZXIuY2xvc2UoKVxuICAgICAgfSxcbiAgICAgIGh0dHBhcnQgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKHN0YXJ0KVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBMT0cuZXJyb3IoZXJyb3IpXG4gICAgdGhyb3cgZXJyb3JcbiAgfVxufVxuXG4vLyB7XG5cbi8vIH1cbiJdfQ==