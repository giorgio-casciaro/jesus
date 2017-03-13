'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var express = require('express-http2');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var url = require('url');
var PACKAGE = 'transport.http.server';
var checkRequired = require('../jesus').checkRequired;
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
      var start = function _callee4() {
        var _this = this;

        var httpUrl, httpPort;
        return regeneratorRuntime.async(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                httpUrl = 'http://' + config.url.replace('http://', '').replace('//', '');
                httpPort = url.parse(httpUrl, false, true).port;

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
                          return regeneratorRuntime.awrap(methodCall(data, false, publicApi));

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

                            methodCall(data, getStream, publicApi);
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
                httpApi.all('*', function _callee3(req, res) {
                  var methodName, data, message, isStream, response, getStream;
                  return regeneratorRuntime.async(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.prev = 0;
                          methodName = req.url.replace('/', '');
                          data = req.body || req.query;
                          message = {
                            f: req.headers.from || '__HTTP_CLIENT__',
                            m: methodName,
                            d: [{ d: data, r: req.headers.corrid, u: req.headers.userid }] // HTTP HEADERS ONLY LOWERCASE
                          };
                          isStream = !!req.headers.stream;

                          if (isStream) {
                            _context3.next = 13;
                            break;
                          }

                          CONSOLE.debug('HttpPublic MESSAGE', { isStream: isStream, message: message, headers: req.headers, data: data });
                          _context3.next = 9;
                          return regeneratorRuntime.awrap(methodCall(message, false, publicApi));

                        case 9:
                          response = _context3.sent;

                          res.send(response);
                          _context3.next = 17;
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
                          _context3.next = 23;
                          break;

                        case 19:
                          _context3.prev = 19;
                          _context3.t0 = _context3['catch'](0);

                          CONSOLE.warn('Api error', { error: _context3.t0 });
                          res.send({ error: _context3.t0 });

                        case 23:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, null, _this, [[0, 19]]);
                });
                httpServer = httpApi.listen(httpPort);
                CONSOLE.debug('http Api listening on ' + config.url);

              case 12:
              case 'end':
                return _context4.stop();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHAuc2VydmVyLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsInVybCIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicHVibGljQXBpIiwiaHR0cEFwaSIsImh0dHBTZXJ2ZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0VHJhbnNwb3J0SHR0cFNlcnZlclBhY2thZ2UiLCJnZXRDb25zb2xlIiwibWV0aG9kQ2FsbCIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiY29uZmlnIiwiQ09OU09MRSIsInN0YXJ0IiwiaHR0cFVybCIsInJlcGxhY2UiLCJodHRwUG9ydCIsInBhcnNlIiwicG9ydCIsInVzZSIsImxldmVsIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImFsbCIsInJlcSIsInJlcyIsImRhdGEiLCJib2R5IiwicXVlcnkiLCJkZWJ1ZyIsInJlc3BvbnNlIiwic2VuZCIsIndhcm4iLCJlcnJvciIsIndyaXRlSGVhZCIsImdldFN0cmVhbSIsIm9uQ2xvc2UiLCJNQVhfUkVRVUVTVF9USU1FT1VUIiwiY2xvc2UiLCJ0aW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwib24iLCJzZXRUaW1lb3V0IiwiZW5kIiwid3JpdGUiLCJvYmoiLCJKU09OIiwic3RyaW5naWZ5IiwibWV0aG9kTmFtZSIsIm1lc3NhZ2UiLCJmIiwiaGVhZGVycyIsImZyb20iLCJtIiwiZCIsInIiLCJjb3JyaWQiLCJ1IiwidXNlcmlkIiwiaXNTdHJlYW0iLCJzdHJlYW0iLCJsaXN0ZW4iLCJzdG9wIiwiaHR0cGFydCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsVUFBVUMsUUFBUSxlQUFSLENBQWQ7QUFDQSxJQUFJQyxhQUFhRCxRQUFRLGFBQVIsQ0FBakI7QUFDQSxJQUFJRSxjQUFjRixRQUFRLGFBQVIsQ0FBbEI7QUFDQSxJQUFJRyxTQUFTSCxRQUFRLFFBQVIsQ0FB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RztBQUNONUQsdUJBQVdvQyxLQUFYO0FBQ0QsV0FKSTtBQUtMeUIsaUJBTEsscUJBS007QUFDVDdELHVCQUFXb0MsS0FBWCxDQUFpQjFCLEtBQWpCO0FBQ0Q7QUFQSTtBQUFQO0FBdkZFOztBQUFBO0FBZ0dILEdBaEdELENBZ0dFLE9BQU9xQixLQUFQLEVBQWM7QUFDZHRCLFlBQVFzQixLQUFSLENBQWNBLEtBQWQsRUFBcUIsRUFBQ3ZCLGNBQUQsRUFBckI7QUFDQSxVQUFNLElBQUlzRCxLQUFKLENBQVUsbUNBQW1DdEQsT0FBT2IsR0FBcEQsQ0FBTjtBQUNEO0FBQ0YsQ0F0R0QiLCJmaWxlIjoiaHR0cC5zZXJ2ZXIuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzLWh0dHAyJylcbnZhciBib2R5UGFyc2VyID0gcmVxdWlyZSgnYm9keS1wYXJzZXInKVxudmFyIGNvbXByZXNzaW9uID0gcmVxdWlyZSgnY29tcHJlc3Npb24nKVxudmFyIGhlbG1ldCA9IHJlcXVpcmUoJ2hlbG1ldCcpXG5jb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKVxuY29uc3QgUEFDS0FHRSA9ICd0cmFuc3BvcnQuaHR0cC5zZXJ2ZXInXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBwdWJsaWNBcGkgPSBmYWxzZVxudmFyIGh0dHBBcGlcbnZhciBodHRwU2VydmVyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0VHJhbnNwb3J0SHR0cFNlcnZlclBhY2thZ2UgKHtnZXRDb25zb2xlLCBtZXRob2RDYWxsLCBzZXJ2aWNlTmFtZSA9ICd1bmtub3cnLCBzZXJ2aWNlSWQgPSAndW5rbm93JywgY29uZmlnfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHtjb25maWcsIG1ldGhvZENhbGwsIGdldENvbnNvbGV9KVxuICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAgICAgIHZhciBodHRwVXJsID0gJ2h0dHA6Ly8nICsgY29uZmlnLnVybC5yZXBsYWNlKCdodHRwOi8vJywgJycpLnJlcGxhY2UoJy8vJywgJycpXG4gICAgICB2YXIgaHR0cFBvcnQgPSB1cmwucGFyc2UoaHR0cFVybCwgZmFsc2UsIHRydWUpLnBvcnRcbiAgICAgIGh0dHBBcGkgPSBleHByZXNzKClcbiAgICAgIGh0dHBBcGkudXNlKGhlbG1ldCgpKVxuICAgICAgaHR0cEFwaS51c2UoY29tcHJlc3Npb24oe2xldmVsOiAxfSkpXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLmpzb24oKSkgLy8gc3VwcG9ydCBqc29uIGVuY29kZWQgYm9kaWVzXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSkgLy8gc3VwcG9ydCBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS5hbGwoJy9faHR0cE1lc3NhZ2UnLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlcS5ib2R5IHx8IHJlcS5xdWVyeVxuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ19odHRwTWVzc2FnZScsIHJlcSwgZGF0YSlcbiAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2RDYWxsKGRhdGEsIGZhbHNlLCBwdWJsaWNBcGkpXG4gICAgICAgICAgcmVzLnNlbmQocmVzcG9uc2UpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgQ09OU09MRS53YXJuKCdBcGkgZXJyb3InLCB7ZXJyb3J9KVxuICAgICAgICAgIHJlcy5zZW5kKHtlcnJvcn0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBodHRwQXBpLmFsbCgnL19odHRwTWVzc2FnZVN0cmVhbScsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBkYXRhID0gcmVxLmJvZHkgfHwgcmVxLnF1ZXJ5XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygnX2h0dHBNZXNzYWdlU3RyZWFtJywgcmVxLCBkYXRhKVxuICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvZXZlbnQtc3RyZWFtJyxcbiAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICAgICAgICAgICdDb25uZWN0aW9uJzogJ2tlZXAtYWxpdmUnXG4gICAgICAgICAgfSlcbiAgICAgICAgICB2YXIgZ2V0U3RyZWFtID0gKG9uQ2xvc2UsIE1BWF9SRVFVRVNUX1RJTUVPVVQgPSAxMjAwMDApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NlID0gKCkgPT4geyBpZiAodGltZW91dCljbGVhclRpbWVvdXQodGltZW91dCk7IG9uQ2xvc2UoKSB9XG4gICAgICAgICAgICByZXMub24oJ2Nsb3NlJywgY2xvc2UpLm9uKCdmaW5pc2gnLCBjbG9zZSkub24oJ2Vycm9yJywgY2xvc2UpLm9uKCdlbmQnLCBjbG9zZSlcbiAgICAgICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChyZXMuZW5kLCBNQVhfUkVRVUVTVF9USU1FT1VUKVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgd3JpdGU6IChvYmopID0+IHJlcy53cml0ZShKU09OLnN0cmluZ2lmeShvYmopKSxcbiAgICAgICAgICAgICAgZW5kOiAob2JqKSA9PiByZXMuZW5kKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgbWV0aG9kQ2FsbChkYXRhLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBDT05TT0xFLndhcm4oJ0FwaSBlcnJvcicsIHtlcnJvcn0pXG4gICAgICAgICAgcmVzLnNlbmQoe2Vycm9yfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGh0dHBBcGkuYWxsKCcqJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSByZXEudXJsLnJlcGxhY2UoJy8nLCAnJylcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlcS5ib2R5IHx8IHJlcS5xdWVyeVxuICAgICAgICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgICAgICAgZjogcmVxLmhlYWRlcnMuZnJvbSB8fCAnX19IVFRQX0NMSUVOVF9fJyxcbiAgICAgICAgICAgIG06IG1ldGhvZE5hbWUsXG4gICAgICAgICAgICBkOiBbeyBkOiBkYXRhLCByOiByZXEuaGVhZGVycy5jb3JyaWQsIHU6IHJlcS5oZWFkZXJzLnVzZXJpZCB9XSAvLyBIVFRQIEhFQURFUlMgT05MWSBMT1dFUkNBU0VcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGlzU3RyZWFtID0gISFyZXEuaGVhZGVycy5zdHJlYW1cbiAgICAgICAgICBpZiAoIWlzU3RyZWFtKSB7XG4gICAgICAgICAgICBDT05TT0xFLmRlYnVnKCdIdHRwUHVibGljIE1FU1NBR0UnLCB7aXNTdHJlYW0sIG1lc3NhZ2UsIGhlYWRlcnM6IHJlcS5oZWFkZXJzLCBkYXRhfSlcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG1ldGhvZENhbGwobWVzc2FnZSwgZmFsc2UsIHB1YmxpY0FwaSlcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc3BvbnNlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBDT05TT0xFLmRlYnVnKCdIdHRwUHVibGljIE1FU1NBR0UgU1RSRUFNJywge2lzU3RyZWFtLCBtZXNzYWdlLCBoZWFkZXJzOiByZXEuaGVhZGVycywgZGF0YX0pXG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvZXZlbnQtc3RyZWFtJyxcbiAgICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxuICAgICAgICAgICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZhciBnZXRTdHJlYW0gPSAob25DbG9zZSwgTUFYX1JFUVVFU1RfVElNRU9VVCA9IDEyMDAwMCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBjbG9zZSA9ICgpID0+IHsgaWYgKHRpbWVvdXQpY2xlYXJUaW1lb3V0KHRpbWVvdXQpOyBvbkNsb3NlKCkgfVxuICAgICAgICAgICAgICByZXMub24oJ2Nsb3NlJywgY2xvc2UpLm9uKCdmaW5pc2gnLCBjbG9zZSkub24oJ2Vycm9yJywgY2xvc2UpLm9uKCdlbmQnLCBjbG9zZSlcbiAgICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KHJlcy5lbmQsIE1BWF9SRVFVRVNUX1RJTUVPVVQpXG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd3JpdGU6IChvYmopID0+IHJlcy53cml0ZShKU09OLnN0cmluZ2lmeShvYmopKSxcbiAgICAgICAgICAgICAgICBlbmQ6IChvYmopID0+IHJlcy5lbmQoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1ldGhvZENhbGwobWVzc2FnZSwgZ2V0U3RyZWFtLCBwdWJsaWNBcGkpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIENPTlNPTEUud2FybignQXBpIGVycm9yJywge2Vycm9yfSlcbiAgICAgICAgICByZXMuc2VuZCh7ZXJyb3J9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgaHR0cFNlcnZlciA9IGh0dHBBcGkubGlzdGVuKGh0dHBQb3J0KVxuICAgICAgQ09OU09MRS5kZWJ1ZygnaHR0cCBBcGkgbGlzdGVuaW5nIG9uICcgKyBjb25maWcudXJsKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzdGFydCxcbiAgICAgIHN0b3AgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKClcbiAgICAgIH0sXG4gICAgICBodHRwYXJ0ICgpIHtcbiAgICAgICAgaHR0cFNlcnZlci5jbG9zZShzdGFydClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ09OU09MRS5lcnJvcihlcnJvciwge2NvbmZpZ30pXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRUcmFuc3BvcnRIdHRwU2VydmVyUGFja2FnZSAnICsgY29uZmlnLnVybClcbiAgfVxufVxuIl19