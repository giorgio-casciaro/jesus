'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var express = require('express-http2');
var bodyParser = require('body-parser');
var compression = require('compression');
var fs = require('fs');
var helmet = require('helmet');
var url = require('url');
var PACKAGE = 'channel.http.server';
var checkRequired = require('../utils').checkRequired;
var publicApi = false;
var httpApi;
var httpServer;

module.exports = function getTransportHttpServerPackage(_ref) {
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
      var start = function _callee3() {
        var _this = this;

        var socketFile;
        return regeneratorRuntime.async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                socketFile = config.file.replace(":", "");

                if (fs.existsSync(socketFile)) fs.unlinkSync(socketFile);
                // var httpUrl = 'http://' + config.file.replace('http://', '').replace('//', '')
                // var httpPort = url.parse(httpUrl, false, true).port
                httpApi = express();
                httpApi.use(helmet());
                httpApi.use(compression({ level: 1 }));
                httpApi.use(bodyParser.json()); // support json encoded bodies
                httpApi.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
                httpApi.all('/_httpMessage', function _callee(req, res) {
                  var data, response;
                  return regeneratorRuntime.async(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.prev = 0;
                          data = req.body || req.query;

                          CONSOLE.debug('_httpMessage', req, data);
                          _context.next = 5;
                          return regeneratorRuntime.awrap(methodCall(data, false, publicApi, "socket"));

                        case 5:
                          response = _context.sent;

                          res.send(response);
                          _context.next = 13;
                          break;

                        case 9:
                          _context.prev = 9;
                          _context.t0 = _context['catch'](0);

                          CONSOLE.warn('Api error', { error: _context.t0 });
                          res.send({ error: _context.t0 });

                        case 13:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, null, _this, [[0, 9]]);
                });
                httpApi.all('/_httpMessageStream', function _callee2(req, res) {
                  var data, getStream;
                  return regeneratorRuntime.async(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          try {
                            data = req.body || req.query;

                            CONSOLE.debug('_httpMessageStream', req, data);
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

                            methodCall(data, getStream, publicApi, "socket");
                          } catch (error) {
                            CONSOLE.warn('Api error', { error: error });
                            res.send({ error: error });
                          }

                        case 1:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, null, _this);
                });

                httpServer = httpApi.listen(socketFile);
                CONSOLE.debug('http Api listening on ' + socketFile);

              case 11:
              case 'end':
                return _context3.stop();
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
    throw new Error('getTransportHttpServerPackage ' + config.file);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbImV4cHJlc3MiLCJyZXF1aXJlIiwiYm9keVBhcnNlciIsImNvbXByZXNzaW9uIiwiZnMiLCJoZWxtZXQiLCJ1cmwiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsInB1YmxpY0FwaSIsImh0dHBBcGkiLCJodHRwU2VydmVyIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFRyYW5zcG9ydEh0dHBTZXJ2ZXJQYWNrYWdlIiwiZ2V0Q29uc29sZSIsIm1ldGhvZENhbGwiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImNvbmZpZyIsIkNPTlNPTEUiLCJzdGFydCIsInNvY2tldEZpbGUiLCJmaWxlIiwicmVwbGFjZSIsImV4aXN0c1N5bmMiLCJ1bmxpbmtTeW5jIiwidXNlIiwibGV2ZWwiLCJqc29uIiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwiYWxsIiwicmVxIiwicmVzIiwiZGF0YSIsImJvZHkiLCJxdWVyeSIsImRlYnVnIiwicmVzcG9uc2UiLCJzZW5kIiwid2FybiIsImVycm9yIiwid3JpdGVIZWFkIiwiZ2V0U3RyZWFtIiwib25DbG9zZSIsIk1BWF9SRVFVRVNUX1RJTUVPVVQiLCJjbG9zZSIsInRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJvbiIsInNldFRpbWVvdXQiLCJlbmQiLCJ3cml0ZSIsIm9iaiIsIkpTT04iLCJzdHJpbmdpZnkiLCJsaXN0ZW4iLCJzdG9wIiwiaHR0cGFydCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsVUFBVUMsUUFBUSxlQUFSLENBQWQ7QUFDQSxJQUFJQyxhQUFhRCxRQUFRLGFBQVIsQ0FBakI7QUFDQSxJQUFJRSxjQUFjRixRQUFRLGFBQVIsQ0FBbEI7QUFDQSxJQUFJRyxLQUFLSCxRQUFRLElBQVIsQ0FBVDtBQUNBLElBQUlJLFNBQVNKLFFBQVEsUUFBUixDQUFiO0FBQ0EsSUFBTUssTUFBTUwsUUFBUSxLQUFSLENBQVo7QUFDQSxJQUFNTSxVQUFV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S0FBWDtBQUNELFdBSkk7QUFLTFksaUJBTEsscUJBS007QUFDVGhELHVCQUFXb0MsS0FBWCxDQUFpQjFCLEtBQWpCO0FBQ0Q7QUFQSTtBQUFQO0FBcERFOztBQUFBO0FBNkRILEdBN0RELENBNkRFLE9BQU9xQixLQUFQLEVBQWM7QUFDZHRCLFlBQVFzQixLQUFSLENBQWNBLEtBQWQsRUFBcUIsRUFBQ3ZCLGNBQUQsRUFBckI7QUFDQSxVQUFNLElBQUl5QyxLQUFKLENBQVUsbUNBQW1DekMsT0FBT0ksSUFBcEQsQ0FBTjtBQUNEO0FBQ0YsQ0FuRUQiLCJmaWxlIjoic29ja2V0LnNlcnZlci5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MtaHR0cDInKVxudmFyIGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpXG52YXIgY29tcHJlc3Npb24gPSByZXF1aXJlKCdjb21wcmVzc2lvbicpXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgaGVsbWV0ID0gcmVxdWlyZSgnaGVsbWV0JylcbmNvbnN0IHVybCA9IHJlcXVpcmUoJ3VybCcpXG5jb25zdCBQQUNLQUdFID0gJ3RyYW5zcG9ydC5odHRwLnNlcnZlcidcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbmNvbnN0IHB1YmxpY0FwaSA9IGZhbHNlXG52YXIgaHR0cEFwaVxudmFyIGh0dHBTZXJ2ZXJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRUcmFuc3BvcnRIdHRwU2VydmVyUGFja2FnZSAoe2dldENvbnNvbGUsIG1ldGhvZENhbGwsIHNlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnLCBjb25maWd9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe2NvbmZpZywgbWV0aG9kQ2FsbCwgZ2V0Q29uc29sZX0pXG4gICAgYXN5bmMgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgdmFyIHNvY2tldEZpbGU9Y29uZmlnLmZpbGUucmVwbGFjZShcIjpcIixcIlwiKVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoc29ja2V0RmlsZSkpZnMudW5saW5rU3luYyhzb2NrZXRGaWxlKTtcbiAgICAgIC8vIHZhciBodHRwVXJsID0gJ2h0dHA6Ly8nICsgY29uZmlnLmZpbGUucmVwbGFjZSgnaHR0cDovLycsICcnKS5yZXBsYWNlKCcvLycsICcnKVxuICAgICAgLy8gdmFyIGh0dHBQb3J0ID0gdXJsLnBhcnNlKGh0dHBVcmwsIGZhbHNlLCB0cnVlKS5wb3J0XG4gICAgICBodHRwQXBpID0gZXhwcmVzcygpXG4gICAgICBodHRwQXBpLnVzZShoZWxtZXQoKSlcbiAgICAgIGh0dHBBcGkudXNlKGNvbXByZXNzaW9uKHtsZXZlbDogMX0pKVxuICAgICAgaHR0cEFwaS51c2UoYm9keVBhcnNlci5qc29uKCkpIC8vIHN1cHBvcnQganNvbiBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUgfSkpIC8vIHN1cHBvcnQgZW5jb2RlZCBib2RpZXNcbiAgICAgIGh0dHBBcGkuYWxsKCcvX2h0dHBNZXNzYWdlJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSByZXEuYm9keSB8fCByZXEucXVlcnlcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdfaHR0cE1lc3NhZ2UnLCByZXEsIGRhdGEpXG4gICAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbWV0aG9kQ2FsbChkYXRhLCBmYWxzZSwgcHVibGljQXBpLFwic29ja2V0XCIpXG4gICAgICAgICAgcmVzLnNlbmQocmVzcG9uc2UpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgQ09OU09MRS53YXJuKCdBcGkgZXJyb3InLCB7ZXJyb3J9KVxuICAgICAgICAgIHJlcy5zZW5kKHtlcnJvcn0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBodHRwQXBpLmFsbCgnL19odHRwTWVzc2FnZVN0cmVhbScsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBkYXRhID0gcmVxLmJvZHkgfHwgcmVxLnF1ZXJ5XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygnX2h0dHBNZXNzYWdlU3RyZWFtJywgcmVxLCBkYXRhKVxuICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvZXZlbnQtc3RyZWFtJyxcbiAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICAgICAgICAgICdDb25uZWN0aW9uJzogJ2tlZXAtYWxpdmUnXG4gICAgICAgICAgfSlcbiAgICAgICAgICB2YXIgZ2V0U3RyZWFtID0gKG9uQ2xvc2UsIE1BWF9SRVFVRVNUX1RJTUVPVVQgPSAxMjAwMDApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NlID0gKCkgPT4geyBpZiAodGltZW91dCljbGVhclRpbWVvdXQodGltZW91dCk7IG9uQ2xvc2UoKSB9XG4gICAgICAgICAgICByZXMub24oJ2Nsb3NlJywgY2xvc2UpLm9uKCdmaW5pc2gnLCBjbG9zZSkub24oJ2Vycm9yJywgY2xvc2UpLm9uKCdlbmQnLCBjbG9zZSlcbiAgICAgICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChyZXMuZW5kLCBNQVhfUkVRVUVTVF9USU1FT1VUKVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgd3JpdGU6IChvYmopID0+IHJlcy53cml0ZShKU09OLnN0cmluZ2lmeShvYmopKSxcbiAgICAgICAgICAgICAgZW5kOiAob2JqKSA9PiByZXMuZW5kKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgbWV0aG9kQ2FsbChkYXRhLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSxcInNvY2tldFwiKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIENPTlNPTEUud2FybignQXBpIGVycm9yJywge2Vycm9yfSlcbiAgICAgICAgICByZXMuc2VuZCh7ZXJyb3J9KVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBodHRwU2VydmVyID0gaHR0cEFwaS5saXN0ZW4oIHNvY2tldEZpbGUpXG4gICAgICBDT05TT0xFLmRlYnVnKCdodHRwIEFwaSBsaXN0ZW5pbmcgb24gJyArIHNvY2tldEZpbGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0LFxuICAgICAgc3RvcCAoKSB7XG4gICAgICAgIGh0dHBTZXJ2ZXIuY2xvc2UoKVxuICAgICAgfSxcbiAgICAgIGh0dHBhcnQgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKHN0YXJ0KVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDT05TT0xFLmVycm9yKGVycm9yLCB7Y29uZmlnfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFRyYW5zcG9ydEh0dHBTZXJ2ZXJQYWNrYWdlICcgKyBjb25maWcuZmlsZSlcbiAgfVxufVxuIl19