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
                          return regeneratorRuntime.awrap(methodCall(data, false, publicApi, 'http'));

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

                            methodCall(data, getStream, publicApi, 'http');
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
                  var newMeta, metaK, methodName, data, message, isStream, response, getStream;
                  return regeneratorRuntime.async(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.prev = 0;
                          newMeta = {};

                          for (metaK in req.headers) {
                            if (metaK.indexOf('app-meta-') + 1) newMeta[metaK.replace('app-meta-', '')] = req.headers[metaK];
                          }methodName = req.url.replace('/', '');
                          data = req.body || req.query;
                          message = {
                            meta: newMeta, // HTTP HEADERS ONLY LOWERCASE
                            method: methodName,
                            data: data
                          };
                          isStream = newMeta.stream === 'true' || newMeta.stream === '1';

                          CONSOLE.debug('newMeta', { newMeta: newMeta });

                          if (isStream) {
                            _context3.next = 15;
                            break;
                          }

                          _context3.next = 11;
                          return regeneratorRuntime.awrap(methodCall(message, false, publicApi, 'httpPublic'));

                        case 11:
                          response = _context3.sent;

                          res.send(response);
                          _context3.next = 19;
                          break;

                        case 15:
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

                          methodCall(message, getStream, publicApi, 'httpPublic');

                        case 19:
                          _context3.next = 25;
                          break;

                        case 21:
                          _context3.prev = 21;
                          _context3.t0 = _context3['catch'](0);

                          CONSOLE.warn('Api error', { error: _context3.t0 });
                          res.send({ error: _context3.t0 });

                        case 25:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, null, _this, [[0, 21]]);
                });
                httpServer = httpApi.on('connection', function (socket) {
                  // socket.setTimeout(60000)
                }).listen(httpPort);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHAuc2VydmVyLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsInVybCIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicHVibGljQXBpIiwiaHR0cEFwaSIsImh0dHBTZXJ2ZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0VHJhbnNwb3J0SHR0cFNlcnZlclBhY2thZ2UiLCJnZXRDb25zb2xlIiwibWV0aG9kQ2FsbCIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiY29uZmlnIiwiQ09OU09MRSIsInN0YXJ0IiwiaHR0cFVybCIsInJlcGxhY2UiLCJodHRwUG9ydCIsInBhcnNlIiwicG9ydCIsInVzZSIsImxldmVsIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImFsbCIsInJlcSIsInJlcyIsImRhdGEiLCJib2R5IiwicXVlcnkiLCJkZWJ1ZyIsInJlc3BvbnNlIiwic2VuZCIsIndhcm4iLCJlcnJvciIsIndyaXRlSGVhZCIsImdldFN0cmVhbSIsIm9uQ2xvc2UiLCJNQVhfUkVRVUVTVF9USU1FT1VUIiwiY2xvc2UiLCJ0aW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwib24iLCJzZXRUaW1lb3V0IiwiZW5kIiwid3JpdGUiLCJvYmoiLCJKU09OIiwic3RyaW5naWZ5IiwibmV3TWV0YSIsIm1ldGFLIiwiaGVhZGVycyIsImluZGV4T2YiLCJtZXRob2ROYW1lIiwibWVzc2FnZSIsIm1ldGEiLCJtZXRob2QiLCJpc1N0cmVhbSIsInN0cmVhbSIsInNvY2tldCIsImxpc3RlbiIsInN0b3AiLCJodHRwYXJ0IiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLGVBQVIsQ0FBZDtBQUNBLElBQUlDLGFBQWFELFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQUlFLGNBQWNGLFFBQVEsYUFBUixDQUFsQjtBQUNBLElBQUlHLFNBQVNILFFBQVEs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QUF2RkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FGRTs7QUFDRkUsb0JBQWMsRUFBQ1csY0FBRCxFQUFTSCxzQkFBVCxFQUFxQkQsc0JBQXJCLEVBQWQ7OztBQTJGQTtBQUFBLFdBQU87QUFDTE0sc0JBREs7QUFFTGdELGNBRkssa0JBRUc7QUFDTjFELHVCQUFXb0MsS0FBWDtBQUNELFdBSkk7QUFLTHVCLGlCQUxLLHFCQUtNO0FBQ1QzRCx1QkFBV29DLEtBQVgsQ0FBaUIxQixLQUFqQjtBQUNEO0FBUEk7QUFBUDtBQTVGRTs7QUFBQTtBQXFHSCxHQXJHRCxDQXFHRSxPQUFPcUIsS0FBUCxFQUFjO0FBQ2R0QixZQUFRc0IsS0FBUixDQUFjQSxLQUFkLEVBQXFCLEVBQUN2QixjQUFELEVBQXJCO0FBQ0EsVUFBTSxJQUFJb0QsS0FBSixDQUFVLG1DQUFtQ3BELE9BQU9iLEdBQXBELENBQU47QUFDRDtBQUNGLENBM0dEIiwiZmlsZSI6Imh0dHAuc2VydmVyLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcy1odHRwMicpXG52YXIgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2JvZHktcGFyc2VyJylcbnZhciBjb21wcmVzc2lvbiA9IHJlcXVpcmUoJ2NvbXByZXNzaW9uJylcbnZhciBoZWxtZXQgPSByZXF1aXJlKCdoZWxtZXQnKVxuY29uc3QgdXJsID0gcmVxdWlyZSgndXJsJylcbmNvbnN0IFBBQ0tBR0UgPSAndHJhbnNwb3J0Lmh0dHAuc2VydmVyJ1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4uL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuY29uc3QgcHVibGljQXBpID0gZmFsc2VcbnZhciBodHRwQXBpXG52YXIgaHR0cFNlcnZlclxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFRyYW5zcG9ydEh0dHBTZXJ2ZXJQYWNrYWdlICh7Z2V0Q29uc29sZSwgbWV0aG9kQ2FsbCwgc2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycsIGNvbmZpZ30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7Y29uZmlnLCBtZXRob2RDYWxsLCBnZXRDb25zb2xlfSlcbiAgICBhc3luYyBmdW5jdGlvbiBzdGFydCAoKSB7XG4gICAgICB2YXIgaHR0cFVybCA9ICdodHRwOi8vJyArIGNvbmZpZy51cmwucmVwbGFjZSgnaHR0cDovLycsICcnKS5yZXBsYWNlKCcvLycsICcnKVxuICAgICAgdmFyIGh0dHBQb3J0ID0gdXJsLnBhcnNlKGh0dHBVcmwsIGZhbHNlLCB0cnVlKS5wb3J0XG4gICAgICBodHRwQXBpID0gZXhwcmVzcygpXG4gICAgICBodHRwQXBpLnVzZShoZWxtZXQoKSlcbiAgICAgIGh0dHBBcGkudXNlKGNvbXByZXNzaW9uKHtsZXZlbDogMX0pKVxuICAgICAgaHR0cEFwaS51c2UoYm9keVBhcnNlci5qc29uKCkpIC8vIHN1cHBvcnQganNvbiBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUgfSkpIC8vIHN1cHBvcnQgZW5jb2RlZCBib2RpZXNcbiAgICAgIGh0dHBBcGkuYWxsKCcvX2h0dHBNZXNzYWdlJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSByZXEuYm9keSB8fCByZXEucXVlcnlcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdfaHR0cE1lc3NhZ2UnLCByZXEsIGRhdGEpXG4gICAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbWV0aG9kQ2FsbChkYXRhLCBmYWxzZSwgcHVibGljQXBpLCAnaHR0cCcpXG4gICAgICAgICAgcmVzLnNlbmQocmVzcG9uc2UpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgQ09OU09MRS53YXJuKCdBcGkgZXJyb3InLCB7ZXJyb3J9KVxuICAgICAgICAgIHJlcy5zZW5kKHtlcnJvcn0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBodHRwQXBpLmFsbCgnL19odHRwTWVzc2FnZVN0cmVhbScsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBkYXRhID0gcmVxLmJvZHkgfHwgcmVxLnF1ZXJ5XG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygnX2h0dHBNZXNzYWdlU3RyZWFtJywgcmVxLCBkYXRhKVxuICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvZXZlbnQtc3RyZWFtJyxcbiAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICAgICAgICAgICdDb25uZWN0aW9uJzogJ2tlZXAtYWxpdmUnXG4gICAgICAgICAgfSlcbiAgICAgICAgICB2YXIgZ2V0U3RyZWFtID0gKG9uQ2xvc2UsIE1BWF9SRVFVRVNUX1RJTUVPVVQgPSAxMjAwMDApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NlID0gKCkgPT4geyBpZiAodGltZW91dCljbGVhclRpbWVvdXQodGltZW91dCk7IG9uQ2xvc2UoKSB9XG4gICAgICAgICAgICByZXMub24oJ2Nsb3NlJywgY2xvc2UpLm9uKCdmaW5pc2gnLCBjbG9zZSkub24oJ2Vycm9yJywgY2xvc2UpLm9uKCdlbmQnLCBjbG9zZSlcbiAgICAgICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChyZXMuZW5kLCBNQVhfUkVRVUVTVF9USU1FT1VUKVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgd3JpdGU6IChvYmopID0+IHJlcy53cml0ZShKU09OLnN0cmluZ2lmeShvYmopKSxcbiAgICAgICAgICAgICAgZW5kOiAob2JqKSA9PiByZXMuZW5kKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgbWV0aG9kQ2FsbChkYXRhLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSwgJ2h0dHAnKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIENPTlNPTEUud2FybignQXBpIGVycm9yJywge2Vycm9yfSlcbiAgICAgICAgICByZXMuc2VuZCh7ZXJyb3J9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgaHR0cEFwaS5hbGwoJyonLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgbmV3TWV0YSA9IHt9XG4gICAgICAgICAgZm9yICh2YXIgbWV0YUsgaW4gcmVxLmhlYWRlcnMpIGlmIChtZXRhSy5pbmRleE9mKCdhcHAtbWV0YS0nKSArIDEpbmV3TWV0YVttZXRhSy5yZXBsYWNlKCdhcHAtbWV0YS0nLCAnJyldID0gcmVxLmhlYWRlcnNbbWV0YUtdXG5cbiAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IHJlcS51cmwucmVwbGFjZSgnLycsICcnKVxuICAgICAgICAgIHZhciBkYXRhID0gcmVxLmJvZHkgfHwgcmVxLnF1ZXJ5XG4gICAgICAgICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICBtZXRhOiBuZXdNZXRhLCAvLyBIVFRQIEhFQURFUlMgT05MWSBMT1dFUkNBU0VcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kTmFtZSxcbiAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGlzU3RyZWFtID0gKG5ld01ldGEuc3RyZWFtID09PSAndHJ1ZScgfHwgbmV3TWV0YS5zdHJlYW0gPT09ICcxJylcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCduZXdNZXRhJywge25ld01ldGF9KVxuICAgICAgICAgIGlmICghaXNTdHJlYW0pIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG1ldGhvZENhbGwobWVzc2FnZSwgZmFsc2UsIHB1YmxpY0FwaSwgJ2h0dHBQdWJsaWMnKVxuICAgICAgICAgICAgcmVzLnNlbmQocmVzcG9uc2UpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIENPTlNPTEUuZGVidWcoJ0h0dHBQdWJsaWMgTUVTU0FHRSBTVFJFQU0nLCB7aXNTdHJlYW0sIG1lc3NhZ2UsIGhlYWRlcnM6IHJlcS5oZWFkZXJzLCBkYXRhfSlcbiAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9ldmVudC1zdHJlYW0nLFxuICAgICAgICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZScsXG4gICAgICAgICAgICAgICdDb25uZWN0aW9uJzogJ2tlZXAtYWxpdmUnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdmFyIGdldFN0cmVhbSA9IChvbkNsb3NlLCBNQVhfUkVRVUVTVF9USU1FT1VUID0gMTIwMDAwKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGNsb3NlID0gKCkgPT4geyBpZiAodGltZW91dCljbGVhclRpbWVvdXQodGltZW91dCk7IG9uQ2xvc2UoKSB9XG4gICAgICAgICAgICAgIHJlcy5vbignY2xvc2UnLCBjbG9zZSkub24oJ2ZpbmlzaCcsIGNsb3NlKS5vbignZXJyb3InLCBjbG9zZSkub24oJ2VuZCcsIGNsb3NlKVxuICAgICAgICAgICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQocmVzLmVuZCwgTUFYX1JFUVVFU1RfVElNRU9VVClcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB3cml0ZTogKG9iaikgPT4gcmVzLndyaXRlKEpTT04uc3RyaW5naWZ5KG9iaikpLFxuICAgICAgICAgICAgICAgIGVuZDogKG9iaikgPT4gcmVzLmVuZCgpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWV0aG9kQ2FsbChtZXNzYWdlLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSwgJ2h0dHBQdWJsaWMnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBDT05TT0xFLndhcm4oJ0FwaSBlcnJvcicsIHtlcnJvcn0pXG4gICAgICAgICAgcmVzLnNlbmQoe2Vycm9yfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGh0dHBTZXJ2ZXIgPSBodHRwQXBpLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24gKHNvY2tldCkge1xuICAgICAgICAvLyBzb2NrZXQuc2V0VGltZW91dCg2MDAwMClcbiAgICAgIH0pLmxpc3RlbihodHRwUG9ydClcbiAgICAgIENPTlNPTEUuZGVidWcoJ2h0dHAgQXBpIGxpc3RlbmluZyBvbiAnICsgY29uZmlnLnVybClcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQsXG4gICAgICBzdG9wICgpIHtcbiAgICAgICAgaHR0cFNlcnZlci5jbG9zZSgpXG4gICAgICB9LFxuICAgICAgaHR0cGFydCAoKSB7XG4gICAgICAgIGh0dHBTZXJ2ZXIuY2xvc2Uoc3RhcnQpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtjb25maWd9KVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0VHJhbnNwb3J0SHR0cFNlcnZlclBhY2thZ2UgJyArIGNvbmZpZy51cmwpXG4gIH1cbn1cbiJdfQ==