'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var express = require('express-http2');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var url = require('url');
var PACKAGE = 'channel.httpPublic.server';
var checkRequired = require('../utils').checkRequired;
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
                  var newMeta, metaK, methodName, data, message, isStream, response, getStream;
                  return regeneratorRuntime.async(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.prev = 0;
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
                          isStream = newMeta.stream === "true" || newMeta.stream === "1";

                          CONSOLE.debug('newMeta', { newMeta: newMeta });

                          if (isStream) {
                            _context.next = 15;
                            break;
                          }

                          _context.next = 11;
                          return regeneratorRuntime.awrap(methodCall(message, false, publicApi, "httpPublic"));

                        case 11:
                          response = _context.sent;

                          res.send(response);
                          _context.next = 19;
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

                          methodCall(message, getStream, publicApi, "httpPublic");

                        case 19:
                          _context.next = 25;
                          break;

                        case 21:
                          _context.prev = 21;
                          _context.t0 = _context['catch'](0);

                          CONSOLE.warn('Api error', { error: _context.t0 });
                          res.send({ error: _context.t0 });

                        case 25:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, null, _this, [[0, 21]]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBQdWJsaWMuc2VydmVyLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsInVybCIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicHVibGljQXBpIiwiaHR0cEFwaSIsImh0dHBTZXJ2ZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0VHJhbnNwb3J0SHR0cFB1YmxpY1NlcnZlclBhY2thZ2UiLCJnZXRDb25zb2xlIiwibWV0aG9kQ2FsbCIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiY29uZmlnIiwiQ09OU09MRSIsInN0YXJ0IiwiaHR0cFVybCIsInJlcGxhY2UiLCJodHRwUG9ydCIsInBhcnNlIiwicG9ydCIsInVzZSIsImxldmVsIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImFsbCIsInJlcSIsInJlcyIsIm5ld01ldGEiLCJtZXRhSyIsImhlYWRlcnMiLCJpbmRleE9mIiwibWV0aG9kTmFtZSIsImRhdGEiLCJib2R5IiwicXVlcnkiLCJtZXNzYWdlIiwibWV0YSIsIm1ldGhvZCIsImlzU3RyZWFtIiwic3RyZWFtIiwiZGVidWciLCJyZXNwb25zZSIsInNlbmQiLCJ3cml0ZUhlYWQiLCJnZXRTdHJlYW0iLCJvbkNsb3NlIiwiTUFYX1JFUVVFU1RfVElNRU9VVCIsImNsb3NlIiwidGltZW91dCIsImNsZWFyVGltZW91dCIsIm9uIiwic2V0VGltZW91dCIsImVuZCIsIndyaXRlIiwib2JqIiwiSlNPTiIsInN0cmluZ2lmeSIsIndhcm4iLCJlcnJvciIsInNvY2tldCIsImxpc3RlbiIsInN0b3AiLCJodHRwYXJ0IiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLGVBQVIsQ0FBZDtBQUNBLElBQUlDLGFBQWFELFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQUlFLGNBQWNGLFFBQVEsYUFBUixDQUFsQjtBQUNBLElBQUlH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RUFBQ2dCLGtCQUFELEVBQVQ7O0FBdENhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUFqQjtBQXlDQXZELDZCQUFhRCxRQUFRZ0QsRUFBUixDQUFXLFlBQVgsRUFBeUIsVUFBVVMsTUFBVixFQUFrQjtBQUN0RDtBQUNELGlCQUZZLEVBRVZDLE1BRlUsQ0FFSDVDLFFBRkcsQ0FBYjtBQUdBSix3QkFBUTRCLEtBQVIsQ0FBYywyQkFBMkI3QixPQUFPYixHQUFoRDs7QUFwREY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FGRTs7QUFDRkUsb0JBQWMsRUFBQ1csY0FBRCxFQUFTSCxzQkFBVCxFQUFxQkQsc0JBQXJCLEVBQWQ7OztBQXdEQTtBQUFBLFdBQU87QUFDTE0sc0JBREs7QUFFTGdELGNBRkssa0JBRUc7QUFDTjFELHVCQUFXNEMsS0FBWDtBQUNELFdBSkk7QUFLTGUsaUJBTEsscUJBS007QUFDVDNELHVCQUFXNEMsS0FBWCxDQUFpQmxDLEtBQWpCO0FBQ0Q7QUFQSTtBQUFQO0FBekRFOztBQUFBO0FBa0VILEdBbEVELENBa0VFLE9BQU82QyxLQUFQLEVBQWM7QUFDZDlDLFlBQVE4QyxLQUFSLENBQWNBLEtBQWQsRUFBcUIsRUFBQy9DLGNBQUQsRUFBckI7QUFDQSxVQUFNLElBQUlvRCxLQUFKLENBQVUsbUNBQW1DcEQsT0FBT2IsR0FBcEQsQ0FBTjtBQUNEO0FBQ0YsQ0F4RUQiLCJmaWxlIjoiaHR0cFB1YmxpYy5zZXJ2ZXIuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzLWh0dHAyJylcbnZhciBib2R5UGFyc2VyID0gcmVxdWlyZSgnYm9keS1wYXJzZXInKVxudmFyIGNvbXByZXNzaW9uID0gcmVxdWlyZSgnY29tcHJlc3Npb24nKVxudmFyIGhlbG1ldCA9IHJlcXVpcmUoJ2hlbG1ldCcpXG5jb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKVxuY29uc3QgUEFDS0FHRSA9ICd0cmFuc3BvcnQuaHR0cFB1YmxpYy5zZXJ2ZXInXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBwdWJsaWNBcGkgPSBmYWxzZVxudmFyIGh0dHBBcGlcbnZhciBodHRwU2VydmVyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0VHJhbnNwb3J0SHR0cFB1YmxpY1NlcnZlclBhY2thZ2UgKHsgZ2V0Q29uc29sZSwgbWV0aG9kQ2FsbCwgc2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycsIGNvbmZpZyB9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe2NvbmZpZywgbWV0aG9kQ2FsbCwgZ2V0Q29uc29sZX0pXG4gICAgYXN5bmMgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgdmFyIGh0dHBVcmwgPSAnaHR0cDovLycgKyBjb25maWcudXJsLnJlcGxhY2UoJ2h0dHA6Ly8nLCAnJykucmVwbGFjZSgnLy8nLCAnJylcbiAgICAgIHZhciBodHRwUG9ydCA9IHVybC5wYXJzZShodHRwVXJsLCBmYWxzZSwgdHJ1ZSkucG9ydFxuICAgICAgaHR0cEFwaSA9IGV4cHJlc3MoKVxuICAgICAgaHR0cEFwaS51c2UoaGVsbWV0KCkpXG4gICAgICBodHRwQXBpLnVzZShjb21wcmVzc2lvbih7bGV2ZWw6IDF9KSlcbiAgICAgIGh0dHBBcGkudXNlKGJvZHlQYXJzZXIuanNvbigpKSAvLyBzdXBwb3J0IGpzb24gZW5jb2RlZCBib2RpZXNcbiAgICAgIGh0dHBBcGkudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKSAvLyBzdXBwb3J0IGVuY29kZWQgYm9kaWVzXG4gICAgICBodHRwQXBpLmFsbCgnKicsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBuZXdNZXRhID0ge31cbiAgICAgICAgICBmb3IgKHZhciBtZXRhSyBpbiByZXEuaGVhZGVycykgaWYgKG1ldGFLLmluZGV4T2YoJ2FwcC1tZXRhLScpICsgMSluZXdNZXRhW21ldGFLLnJlcGxhY2UoJ2FwcC1tZXRhLScsICcnKV0gPSByZXEuaGVhZGVyc1ttZXRhS11cblxuICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gcmVxLnVybC5yZXBsYWNlKCcvJywgJycpXG4gICAgICAgICAgdmFyIGRhdGEgPSByZXEuYm9keSB8fCByZXEucXVlcnlcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgIG1ldGE6IG5ld01ldGEsIC8vIEhUVFAgSEVBREVSUyBPTkxZIExPV0VSQ0FTRVxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2ROYW1lLFxuICAgICAgICAgICAgZGF0YVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaXNTdHJlYW0gPSAobmV3TWV0YS5zdHJlYW09PT1cInRydWVcInx8bmV3TWV0YS5zdHJlYW09PT1cIjFcIilcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCduZXdNZXRhJywge25ld01ldGF9KVxuICAgICAgICAgIGlmICghaXNTdHJlYW0pIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGF3YWl0IG1ldGhvZENhbGwobWVzc2FnZSwgZmFsc2UsIHB1YmxpY0FwaSxcImh0dHBQdWJsaWNcIilcbiAgICAgICAgICAgIHJlcy5zZW5kKHJlc3BvbnNlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBDT05TT0xFLmRlYnVnKCdIdHRwUHVibGljIE1FU1NBR0UgU1RSRUFNJywge2lzU3RyZWFtLCBtZXNzYWdlLCBoZWFkZXJzOiByZXEuaGVhZGVycywgZGF0YX0pXG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvZXZlbnQtc3RyZWFtJyxcbiAgICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxuICAgICAgICAgICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZhciBnZXRTdHJlYW0gPSAob25DbG9zZSwgTUFYX1JFUVVFU1RfVElNRU9VVCA9IDEyMDAwMCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBjbG9zZSA9ICgpID0+IHsgaWYgKHRpbWVvdXQpY2xlYXJUaW1lb3V0KHRpbWVvdXQpOyBvbkNsb3NlKCkgfVxuICAgICAgICAgICAgICByZXMub24oJ2Nsb3NlJywgY2xvc2UpLm9uKCdmaW5pc2gnLCBjbG9zZSkub24oJ2Vycm9yJywgY2xvc2UpLm9uKCdlbmQnLCBjbG9zZSlcbiAgICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KHJlcy5lbmQsIE1BWF9SRVFVRVNUX1RJTUVPVVQpXG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd3JpdGU6IChvYmopID0+IHJlcy53cml0ZShKU09OLnN0cmluZ2lmeShvYmopKSxcbiAgICAgICAgICAgICAgICBlbmQ6IChvYmopID0+IHJlcy5lbmQoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1ldGhvZENhbGwobWVzc2FnZSwgZ2V0U3RyZWFtLCBwdWJsaWNBcGksXCJodHRwUHVibGljXCIpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIENPTlNPTEUud2FybignQXBpIGVycm9yJywge2Vycm9yfSlcbiAgICAgICAgICByZXMuc2VuZCh7ZXJyb3J9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgaHR0cFNlcnZlciA9IGh0dHBBcGkub24oJ2Nvbm5lY3Rpb24nLCBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICAgIC8vIHNvY2tldC5zZXRUaW1lb3V0KDYwMDAwKVxuICAgICAgfSkubGlzdGVuKGh0dHBQb3J0KVxuICAgICAgQ09OU09MRS5kZWJ1ZygnaHR0cCBBcGkgbGlzdGVuaW5nIG9uICcgKyBjb25maWcudXJsKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzdGFydCxcbiAgICAgIHN0b3AgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKClcbiAgICAgIH0sXG4gICAgICBodHRwYXJ0ICgpIHtcbiAgICAgICAgaHR0cFNlcnZlci5jbG9zZShzdGFydClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ09OU09MRS5lcnJvcihlcnJvciwge2NvbmZpZ30pXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRUcmFuc3BvcnRIdHRwU2VydmVyUGFja2FnZSAnICsgY29uZmlnLnVybClcbiAgfVxufVxuIl19