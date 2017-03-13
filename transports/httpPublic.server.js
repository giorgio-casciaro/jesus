'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var express = require('express-http2');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var url = require('url');
var PACKAGE = 'transport.httpPublic.server';
var checkRequired = require('../jesus').checkRequired;
var publicApi = false;
var httpApi;
var httpServer;

module.exports = function getTransportHttpPublicServerPackage(_ref) {
  var getConsole = _ref.getConsole,
      methodCall = _ref.methodCall,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      config = _ref.config;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  try {
    var _ret = function () {
      var start = function _callee2() {
        var _this = this;

        var httpUrl, httpPort;
        return regeneratorRuntime.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                httpUrl = 'http://' + config.url.replace('http://', '').replace('//', '');
                httpPort = url.parse(httpUrl, false, true).port;

                httpApi = express();
                httpApi.use(helmet());
                httpApi.use(compression({ level: 1 }));
                httpApi.use(bodyParser.json()); // support json encoded bodies
                httpApi.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
                httpApi.all('*', function _callee(req, res) {
                  var methodName, data, message, isStream, response, getStream;
                  return regeneratorRuntime.async(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.prev = 0;
                          methodName = req.url.replace('/', '');
                          data = req.body || req.query;
                          message = {
                            f: req.headers.from || '__HTTP_CLIENT__',
                            m: methodName,
                            d: [{ d: data, r: req.headers.corrid, u: req.headers.userid }] // HTTP HEADERS ONLY LOWERCASE
                          };
                          isStream = !!req.headers.stream;

                          if (isStream) {
                            _context.next = 13;
                            break;
                          }

                          CONSOLE.debug('HttpPublic MESSAGE', { isStream: isStream, message: message, headers: req.headers, data: data });
                          _context.next = 9;
                          return regeneratorRuntime.awrap(methodCall(message, false, publicApi));

                        case 9:
                          response = _context.sent;

                          res.send(response);
                          _context.next = 17;
                          break;

                        case 13:
                          CONSOLE.debug('HttpPublic MESSAGE STREAM', { isStream: isStream, message: message, headers: req.headers, data: data });
                          res.writeHead(200, {
                            'Content-Type': 'text/event-stream',
                            'Cache-Control': 'no-cache',
                            'Connection': 'keep-alive'
                          });

                          getStream = function getStream(onClose) {
                            var MAX_REQUEST_TIMEOUT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 120000;

                            var close = function close() {
                              if (timeout) clearTimeout(timeout);onClose();
                            };
                            res.on('close', close).on('finish', close).on('error', close).on('end', close);
                            var timeout = setTimeout(res.end, MAX_REQUEST_TIMEOUT);
                            return {
                              write: function write(obj) {
                                return res.write(JSON.stringify(obj));
                              },
                              end: function end(obj) {
                                return res.end();
                              }
                            };
                          };

                          methodCall(message, getStream, publicApi);

                        case 17:
                          _context.next = 23;
                          break;

                        case 19:
                          _context.prev = 19;
                          _context.t0 = _context['catch'](0);

                          CONSOLE.warn('Api error', { error: _context.t0 });
                          res.send({ error: _context.t0 });

                        case 23:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, null, _this, [[0, 19]]);
                });
                httpServer = httpApi.on('connection', function (socket) {
                  // socket.setTimeout(60000)
                }).listen(httpPort);
                CONSOLE.debug('http Api listening on ' + config.url);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, null, this);
      };

      checkRequired({ config: config, methodCall: methodCall, getConsole: getConsole });


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
    CONSOLE.error(error, { config: config });
    throw new Error('getTransportHttpServerPackage ' + config.url);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBQdWJsaWMuc2VydmVyLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsInVybCIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicHVibGljQXBpIiwiaHR0cEFwaSIsImh0dHBTZXJ2ZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0VHJhbnNwb3J0SHR0cFB1YmxpY1NlcnZlclBhY2thZ2UiLCJnZXRDb25zb2xlIiwibWV0aG9kQ2FsbCIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiY29uZmlnIiwiQ09OU09MRSIsInN0YXJ0IiwiaHR0cFVybCIsInJlcGxhY2UiLCJodHRwUG9ydCIsInBhcnNlIiwicG9ydCIsInVzZSIsImxldmVsIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImFsbCIsInJlcSIsInJlcyIsIm1ldGhvZE5hbWUiLCJkYXRhIiwiYm9keSIsInF1ZXJ5IiwibWVzc2FnZSIsImYiLCJoZWFkZXJzIiwiZnJvbSIsIm0iLCJkIiwiciIsImNvcnJpZCIsInUiLCJ1c2VyaWQiLCJpc1N0cmVhbSIsInN0cmVhbSIsImRlYnVnIiwicmVzcG9uc2UiLCJzZW5kIiwid3JpdGVIZWFkIiwiZ2V0U3RyZWFtIiwib25DbG9zZSIsIk1BWF9SRVFVRVNUX1RJTUVPVVQiLCJjbG9zZSIsInRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJvbiIsInNldFRpbWVvdXQiLCJlbmQiLCJ3cml0ZSIsIm9iaiIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3YXJuIiwiZXJyb3IiLCJzb2NrZXQiLCJsaXN0ZW4iLCJzdG9wIiwiaHR0cGFydCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsVUFBVUMsUUFBUSxlQUFSLENBQWQ7QUFDQSxJQUFJQyxhQUFhRCxRQUFRLGFBQVIsQ0FBakI7QUFDQSxJQUFJRSxjQUFjRixRQUFRLGFBQVIsQ0FBbEI7QUFDQSxJQUFJ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QUFBLGlCQUFqQjtBQXNDQTFELDZCQUFhRCxRQUFRbUQsRUFBUixDQUFXLFlBQVgsRUFBeUIsVUFBVVMsTUFBVixFQUFrQjtBQUN0RDtBQUNELGlCQUZZLEVBRVZDLE1BRlUsQ0FFSC9DLFFBRkcsQ0FBYjtBQUdBSix3QkFBUStCLEtBQVIsQ0FBYywyQkFBMkJoQyxPQUFPYixHQUFoRDs7QUFqREY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FIRTs7QUFFRkUsb0JBQWMsRUFBQ1csY0FBRCxFQUFTSCxzQkFBVCxFQUFxQkQsc0JBQXJCLEVBQWQ7OztBQXFEQTtBQUFBLFdBQU87QUFDTE0sc0JBREs7QUFFTG1ELGNBRkssa0JBRUc7QUFDTjdELHVCQUFXK0MsS0FBWDtBQUNELFdBSkk7QUFLTGUsaUJBTEsscUJBS007QUFDVDlELHVCQUFXK0MsS0FBWCxDQUFpQnJDLEtBQWpCO0FBQ0Q7QUFQSTtBQUFQO0FBdkRFOztBQUFBO0FBZ0VILEdBaEVELENBZ0VFLE9BQU9nRCxLQUFQLEVBQWM7QUFDZGpELFlBQVFpRCxLQUFSLENBQWNBLEtBQWQsRUFBcUIsRUFBQ2xELGNBQUQsRUFBckI7QUFDQSxVQUFNLElBQUl1RCxLQUFKLENBQVUsbUNBQW1DdkQsT0FBT2IsR0FBcEQsQ0FBTjtBQUNEO0FBQ0YsQ0F0RUQiLCJmaWxlIjoiaHR0cFB1YmxpYy5zZXJ2ZXIuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzLWh0dHAyJylcbnZhciBib2R5UGFyc2VyID0gcmVxdWlyZSgnYm9keS1wYXJzZXInKVxudmFyIGNvbXByZXNzaW9uID0gcmVxdWlyZSgnY29tcHJlc3Npb24nKVxudmFyIGhlbG1ldCA9IHJlcXVpcmUoJ2hlbG1ldCcpXG5jb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKVxuY29uc3QgUEFDS0FHRSA9ICd0cmFuc3BvcnQuaHR0cFB1YmxpYy5zZXJ2ZXInXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBwdWJsaWNBcGkgPSBmYWxzZVxudmFyIGh0dHBBcGlcbnZhciBodHRwU2VydmVyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0VHJhbnNwb3J0SHR0cFB1YmxpY1NlcnZlclBhY2thZ2UgKHsgZ2V0Q29uc29sZSwgbWV0aG9kQ2FsbCwgc2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycsIGNvbmZpZyB9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB0cnkge1xuXG4gICAgY2hlY2tSZXF1aXJlZCh7Y29uZmlnLCBtZXRob2RDYWxsLCBnZXRDb25zb2xlfSlcbiAgICBhc3luYyBmdW5jdGlvbiBzdGFydCAoKSB7XG4gICAgICB2YXIgaHR0cFVybCA9ICdodHRwOi8vJyArIGNvbmZpZy51cmwucmVwbGFjZSgnaHR0cDovLycsICcnKS5yZXBsYWNlKCcvLycsICcnKVxuICAgICAgdmFyIGh0dHBQb3J0ID0gdXJsLnBhcnNlKGh0dHBVcmwsIGZhbHNlLCB0cnVlKS5wb3J0XG4gICAgICBodHRwQXBpID0gZXhwcmVzcygpXG4gICAgICBodHRwQXBpLnVzZShoZWxtZXQoKSlcbiAgICAgIGh0dHBBcGkudXNlKGNvbXByZXNzaW9uKHtsZXZlbDogMX0pKVxuICAgICAgaHR0cEFwaS51c2UoYm9keVBhcnNlci5qc29uKCkpIC8vIHN1cHBvcnQganNvbiBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUgfSkpIC8vIHN1cHBvcnQgZW5jb2RlZCBib2RpZXNcbiAgICAgIGh0dHBBcGkuYWxsKCcqJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSByZXEudXJsLnJlcGxhY2UoJy8nLCAnJylcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlcS5ib2R5IHx8IHJlcS5xdWVyeVxuICAgICAgICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgICAgICAgZjogcmVxLmhlYWRlcnMuZnJvbSB8fCAnX19IVFRQX0NMSUVOVF9fJyxcbiAgICAgICAgICAgIG06IG1ldGhvZE5hbWUsXG4gICAgICAgICAgICBkOiBbeyBkOiBkYXRhLCByOiByZXEuaGVhZGVycy5jb3JyaWQsIHU6IHJlcS5oZWFkZXJzLnVzZXJpZCB9XSAvLyBIVFRQIEhFQURFUlMgT05MWSBMT1dFUkNBU0VcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGlzU3RyZWFtID0gISFyZXEuaGVhZGVycy5zdHJlYW1cbiAgICAgICAgICBpZiAoIWlzU3RyZWFtKSB7XG4gICAgICAgICAgICBDT05TT0xFLmRlYnVnKCdIdHRwUHVibGljIE1FU1NBR0UnLCB7aXNTdHJlYW0sIG1lc3NhZ2UsIGhlYWRlcnM6IHJlcS5oZWFkZXJzLCBkYXRhfSlcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG1ldGhvZENhbGwobWVzc2FnZSwgZmFsc2UsIHB1YmxpY0FwaSlcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc3BvbnNlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBDT05TT0xFLmRlYnVnKCdIdHRwUHVibGljIE1FU1NBR0UgU1RSRUFNJywge2lzU3RyZWFtLCBtZXNzYWdlLCBoZWFkZXJzOiByZXEuaGVhZGVycywgZGF0YX0pXG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvZXZlbnQtc3RyZWFtJyxcbiAgICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxuICAgICAgICAgICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZhciBnZXRTdHJlYW0gPSAob25DbG9zZSwgTUFYX1JFUVVFU1RfVElNRU9VVCA9IDEyMDAwMCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBjbG9zZSA9ICgpID0+IHsgaWYgKHRpbWVvdXQpY2xlYXJUaW1lb3V0KHRpbWVvdXQpOyBvbkNsb3NlKCkgfVxuICAgICAgICAgICAgICByZXMub24oJ2Nsb3NlJywgY2xvc2UpLm9uKCdmaW5pc2gnLCBjbG9zZSkub24oJ2Vycm9yJywgY2xvc2UpLm9uKCdlbmQnLCBjbG9zZSlcbiAgICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KHJlcy5lbmQsIE1BWF9SRVFVRVNUX1RJTUVPVVQpXG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd3JpdGU6IChvYmopID0+IHJlcy53cml0ZShKU09OLnN0cmluZ2lmeShvYmopKSxcbiAgICAgICAgICAgICAgICBlbmQ6IChvYmopID0+IHJlcy5lbmQoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1ldGhvZENhbGwobWVzc2FnZSwgZ2V0U3RyZWFtLCBwdWJsaWNBcGkpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIENPTlNPTEUud2FybignQXBpIGVycm9yJywge2Vycm9yfSlcbiAgICAgICAgICByZXMuc2VuZCh7ZXJyb3J9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgaHR0cFNlcnZlciA9IGh0dHBBcGkub24oJ2Nvbm5lY3Rpb24nLCBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICAgIC8vIHNvY2tldC5zZXRUaW1lb3V0KDYwMDAwKVxuICAgICAgfSkubGlzdGVuKGh0dHBQb3J0KVxuICAgICAgQ09OU09MRS5kZWJ1ZygnaHR0cCBBcGkgbGlzdGVuaW5nIG9uICcgKyBjb25maWcudXJsKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzdGFydCxcbiAgICAgIHN0b3AgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKClcbiAgICAgIH0sXG4gICAgICBodHRwYXJ0ICgpIHtcbiAgICAgICAgaHR0cFNlcnZlci5jbG9zZShzdGFydClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ09OU09MRS5lcnJvcihlcnJvciwge2NvbmZpZ30pXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRUcmFuc3BvcnRIdHRwU2VydmVyUGFja2FnZSAnICsgY29uZmlnLnVybClcbiAgfVxufVxuIl19