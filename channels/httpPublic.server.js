'use strict';

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

module.exports = function getChannelHttpPublicServerPackage(_ref) {
  var getConsole = _ref.getConsole,
      methodCall = _ref.methodCall,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      config = _ref.config;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  try {
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
      start: start,
      stop: function stop() {
        CONSOLE.debug('Stopping httpServer', httpServer);
        httpServer.close();
      },
      restart: function restart() {
        httpServer.close(start);
      }
    };
  } catch (error) {
    CONSOLE.error(error, { config: config });
    throw new Error('getChannelHttpServerPackage ' + config.url);
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBQdWJsaWMuc2VydmVyLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsInVybCIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicHVibGljQXBpIiwiaHR0cEFwaSIsImh0dHBTZXJ2ZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0Q2hhbm5lbEh0dHBQdWJsaWNTZXJ2ZXJQYWNrYWdlIiwiZ2V0Q29uc29sZSIsIm1ldGhvZENhbGwiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImNvbmZpZyIsIkNPTlNPTEUiLCJzdGFydCIsImh0dHBVcmwiLCJyZXBsYWNlIiwiaHR0cFBvcnQiLCJwYXJzZSIsInBvcnQiLCJ1c2UiLCJsZXZlbCIsImpzb24iLCJ1cmxlbmNvZGVkIiwiZXh0ZW5kZWQiLCJhbGwiLCJyZXEiLCJyZXMiLCJuZXdNZXRhIiwibWV0YUsiLCJoZWFkZXJzIiwiaW5kZXhPZiIsIm1ldGhvZE5hbWUiLCJkYXRhIiwiYm9keSIsInF1ZXJ5IiwibWVzc2FnZSIsIm1ldGEiLCJtZXRob2QiLCJpc1N0cmVhbSIsInN0cmVhbSIsImRlYnVnIiwicmVzcG9uc2UiLCJzZW5kIiwid3JpdGVIZWFkIiwiZ2V0U3RyZWFtIiwib25DbG9zZSIsIk1BWF9SRVFVRVNUX1RJTUVPVVQiLCJjbG9zZSIsInRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJvbiIsInNldFRpbWVvdXQiLCJlbmQiLCJ3cml0ZSIsIm9iaiIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3YXJuIiwiZXJyb3IiLCJzb2NrZXQiLCJsaXN0ZW4iLCJzdG9wIiwicmVzdGFydCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFVBQVVDLFFBQVEsZUFBUixDQUFkO0FBQ0EsSUFBSUMsYUFBYUQsUUFBUSxhQUFSLENBQWpCO0FBQ0EsSUFBSUUsY0FBY0YsUUFBUSxhQUFSLENBQWxCO0FBQ0EsSUFBSUcsU0FB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QUFELEVBQVQ7O0FBdENhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBQWpCO0FBeUNBdkQsMkJBQWFELFFBQVFnRCxFQUFSLENBQVcsWUFBWCxFQUF5QixVQUFVUyxNQUFWLEVBQWtCO0FBQ3REO0FBQ0QsZUFGWSxFQUVWQyxNQUZVLENBRUg1QyxRQUZHLENBQWI7QUFHQUosc0JBQVE0QixLQUFSLENBQWMsMkJBQTJCN0IsT0FBT2IsR0FBaEQ7O0FBcERGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBRkU7O0FBQ0ZFLGtCQUFjLEVBQUNXLGNBQUQsRUFBU0gsc0JBQVQsRUFBcUJELHNCQUFyQixFQUFkOzs7QUF3REEsV0FBTztBQUNMTSxrQkFESztBQUVMZ0QsVUFGSyxrQkFFRztBQUNOakQsZ0JBQVE0QixLQUFSLENBQWMscUJBQWQsRUFBcUNyQyxVQUFyQztBQUNBQSxtQkFBVzRDLEtBQVg7QUFDRCxPQUxJO0FBTUxlLGFBTksscUJBTU07QUFDVDNELG1CQUFXNEMsS0FBWCxDQUFpQmxDLEtBQWpCO0FBQ0Q7QUFSSSxLQUFQO0FBVUQsR0FuRUQsQ0FtRUUsT0FBTzZDLEtBQVAsRUFBYztBQUNkOUMsWUFBUThDLEtBQVIsQ0FBY0EsS0FBZCxFQUFxQixFQUFDL0MsY0FBRCxFQUFyQjtBQUNBLFVBQU0sSUFBSW9ELEtBQUosQ0FBVSxpQ0FBaUNwRCxPQUFPYixHQUFsRCxDQUFOO0FBQ0Q7QUFDRixDQXpFRCIsImZpbGUiOiJodHRwUHVibGljLnNlcnZlci5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MtaHR0cDInKVxudmFyIGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpXG52YXIgY29tcHJlc3Npb24gPSByZXF1aXJlKCdjb21wcmVzc2lvbicpXG52YXIgaGVsbWV0ID0gcmVxdWlyZSgnaGVsbWV0JylcbmNvbnN0IHVybCA9IHJlcXVpcmUoJ3VybCcpXG5jb25zdCBQQUNLQUdFID0gJ2NoYW5uZWwuaHR0cFB1YmxpYy5zZXJ2ZXInXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBwdWJsaWNBcGkgPSBmYWxzZVxudmFyIGh0dHBBcGlcbnZhciBodHRwU2VydmVyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0Q2hhbm5lbEh0dHBQdWJsaWNTZXJ2ZXJQYWNrYWdlICh7IGdldENvbnNvbGUsIG1ldGhvZENhbGwsIHNlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnLCBjb25maWcgfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHtjb25maWcsIG1ldGhvZENhbGwsIGdldENvbnNvbGV9KVxuICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAgICAgIHZhciBodHRwVXJsID0gJ2h0dHA6Ly8nICsgY29uZmlnLnVybC5yZXBsYWNlKCdodHRwOi8vJywgJycpLnJlcGxhY2UoJy8vJywgJycpXG4gICAgICB2YXIgaHR0cFBvcnQgPSB1cmwucGFyc2UoaHR0cFVybCwgZmFsc2UsIHRydWUpLnBvcnRcbiAgICAgIGh0dHBBcGkgPSBleHByZXNzKClcbiAgICAgIGh0dHBBcGkudXNlKGhlbG1ldCgpKVxuICAgICAgaHR0cEFwaS51c2UoY29tcHJlc3Npb24oe2xldmVsOiAxfSkpXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLmpzb24oKSkgLy8gc3VwcG9ydCBqc29uIGVuY29kZWQgYm9kaWVzXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSkgLy8gc3VwcG9ydCBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS5hbGwoJyonLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgbmV3TWV0YSA9IHt9XG4gICAgICAgICAgZm9yICh2YXIgbWV0YUsgaW4gcmVxLmhlYWRlcnMpIGlmIChtZXRhSy5pbmRleE9mKCdhcHAtbWV0YS0nKSArIDEpbmV3TWV0YVttZXRhSy5yZXBsYWNlKCdhcHAtbWV0YS0nLCAnJyldID0gcmVxLmhlYWRlcnNbbWV0YUtdXG5cbiAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IHJlcS51cmwucmVwbGFjZSgnLycsICcnKVxuICAgICAgICAgIHZhciBkYXRhID0gcmVxLmJvZHkgfHwgcmVxLnF1ZXJ5XG4gICAgICAgICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICBtZXRhOiBuZXdNZXRhLCAvLyBIVFRQIEhFQURFUlMgT05MWSBMT1dFUkNBU0VcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kTmFtZSxcbiAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGlzU3RyZWFtID0gKG5ld01ldGEuc3RyZWFtPT09XCJ0cnVlXCJ8fG5ld01ldGEuc3RyZWFtPT09XCIxXCIpXG4gICAgICAgICAgQ09OU09MRS5kZWJ1ZygnbmV3TWV0YScsIHtuZXdNZXRhfSlcbiAgICAgICAgICBpZiAoIWlzU3RyZWFtKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2RDYWxsKG1lc3NhZ2UsIGZhbHNlLCBwdWJsaWNBcGksXCJodHRwUHVibGljXCIpXG4gICAgICAgICAgICByZXMuc2VuZChyZXNwb25zZSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgQ09OU09MRS5kZWJ1ZygnSHR0cFB1YmxpYyBNRVNTQUdFIFNUUkVBTScsIHtpc1N0cmVhbSwgbWVzc2FnZSwgaGVhZGVyczogcmVxLmhlYWRlcnMsIGRhdGF9KVxuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L2V2ZW50LXN0cmVhbScsXG4gICAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb24nOiAna2VlcC1hbGl2ZSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB2YXIgZ2V0U3RyZWFtID0gKG9uQ2xvc2UsIE1BWF9SRVFVRVNUX1RJTUVPVVQgPSAxMjAwMDApID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7IGlmICh0aW1lb3V0KWNsZWFyVGltZW91dCh0aW1lb3V0KTsgb25DbG9zZSgpIH1cbiAgICAgICAgICAgICAgcmVzLm9uKCdjbG9zZScsIGNsb3NlKS5vbignZmluaXNoJywgY2xvc2UpLm9uKCdlcnJvcicsIGNsb3NlKS5vbignZW5kJywgY2xvc2UpXG4gICAgICAgICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChyZXMuZW5kLCBNQVhfUkVRVUVTVF9USU1FT1VUKVxuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHdyaXRlOiAob2JqKSA9PiByZXMud3JpdGUoSlNPTi5zdHJpbmdpZnkob2JqKSksXG4gICAgICAgICAgICAgICAgZW5kOiAob2JqKSA9PiByZXMuZW5kKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtZXRob2RDYWxsKG1lc3NhZ2UsIGdldFN0cmVhbSwgcHVibGljQXBpLFwiaHR0cFB1YmxpY1wiKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBDT05TT0xFLndhcm4oJ0FwaSBlcnJvcicsIHtlcnJvcn0pXG4gICAgICAgICAgcmVzLnNlbmQoe2Vycm9yfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGh0dHBTZXJ2ZXIgPSBodHRwQXBpLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24gKHNvY2tldCkge1xuICAgICAgICAvLyBzb2NrZXQuc2V0VGltZW91dCg2MDAwMClcbiAgICAgIH0pLmxpc3RlbihodHRwUG9ydClcbiAgICAgIENPTlNPTEUuZGVidWcoJ2h0dHAgQXBpIGxpc3RlbmluZyBvbiAnICsgY29uZmlnLnVybClcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQsXG4gICAgICBzdG9wICgpIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnU3RvcHBpbmcgaHR0cFNlcnZlcicgLGh0dHBTZXJ2ZXIpXG4gICAgICAgIGh0dHBTZXJ2ZXIuY2xvc2UoKVxuICAgICAgfSxcbiAgICAgIHJlc3RhcnQgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKHN0YXJ0KVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDT05TT0xFLmVycm9yKGVycm9yLCB7Y29uZmlnfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldENoYW5uZWxIdHRwU2VydmVyUGFja2FnZSAnICsgY29uZmlnLnVybClcbiAgfVxufVxuIl19