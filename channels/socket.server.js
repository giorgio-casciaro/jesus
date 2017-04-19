'use strict';

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

module.exports = function getChannelHttpServerPackage(_ref) {
  var getConsole = _ref.getConsole,
      methodCall = _ref.methodCall,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      config = _ref.config;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  try {
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
      start: start,
      stop: function stop() {
        httpServer.close();
      },
      restart: function restart() {
        httpServer.close(start);
      }
    };
  } catch (error) {
    CONSOLE.error(error, { config: config });
    throw new Error('getChannelHttpServerPackage ' + config.file);
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbImV4cHJlc3MiLCJyZXF1aXJlIiwiYm9keVBhcnNlciIsImNvbXByZXNzaW9uIiwiZnMiLCJoZWxtZXQiLCJ1cmwiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsInB1YmxpY0FwaSIsImh0dHBBcGkiLCJodHRwU2VydmVyIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldENoYW5uZWxIdHRwU2VydmVyUGFja2FnZSIsImdldENvbnNvbGUiLCJtZXRob2RDYWxsIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJjb25maWciLCJDT05TT0xFIiwic3RhcnQiLCJzb2NrZXRGaWxlIiwiZmlsZSIsInJlcGxhY2UiLCJleGlzdHNTeW5jIiwidW5saW5rU3luYyIsInVzZSIsImxldmVsIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImFsbCIsInJlcSIsInJlcyIsImRhdGEiLCJib2R5IiwicXVlcnkiLCJkZWJ1ZyIsInJlc3BvbnNlIiwic2VuZCIsIndhcm4iLCJlcnJvciIsIndyaXRlSGVhZCIsImdldFN0cmVhbSIsIm9uQ2xvc2UiLCJNQVhfUkVRVUVTVF9USU1FT1VUIiwiY2xvc2UiLCJ0aW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwib24iLCJzZXRUaW1lb3V0IiwiZW5kIiwid3JpdGUiLCJvYmoiLCJKU09OIiwic3RyaW5naWZ5IiwibGlzdGVuIiwic3RvcCIsInJlc3RhcnQiLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLGVBQVIsQ0FBZDtBQUNBLElBQUlDLGFBQWFELFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQUlFLGNBQWNGLFFBQVEsYUFBUixDQUFsQjtBQUNBLElBQUlHLEtBQUtILFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBSUksU0FBU0osUUFBUSxRQUFSLENBQWI7QUFDQSxJQUFNSyxNQUFNTCxRQUFRLEtBQVIsQ0FBWjtBQUNBLElBQU1NLFVBQVUscUJB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QUtMWSxhQUxLLHFCQUtNO0FBQ1RoRCxtQkFBV29DLEtBQVgsQ0FBaUIxQixLQUFqQjtBQUNEO0FBUEksS0FBUDtBQVNELEdBN0RELENBNkRFLE9BQU9xQixLQUFQLEVBQWM7QUFDZHRCLFlBQVFzQixLQUFSLENBQWNBLEtBQWQsRUFBcUIsRUFBQ3ZCLGNBQUQsRUFBckI7QUFDQSxVQUFNLElBQUl5QyxLQUFKLENBQVUsaUNBQWlDekMsT0FBT0ksSUFBbEQsQ0FBTjtBQUNEO0FBQ0YsQ0FuRUQiLCJmaWxlIjoic29ja2V0LnNlcnZlci5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MtaHR0cDInKVxudmFyIGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpXG52YXIgY29tcHJlc3Npb24gPSByZXF1aXJlKCdjb21wcmVzc2lvbicpXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgaGVsbWV0ID0gcmVxdWlyZSgnaGVsbWV0JylcbmNvbnN0IHVybCA9IHJlcXVpcmUoJ3VybCcpXG5jb25zdCBQQUNLQUdFID0gJ2NoYW5uZWwuaHR0cC5zZXJ2ZXInXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBwdWJsaWNBcGkgPSBmYWxzZVxudmFyIGh0dHBBcGlcbnZhciBodHRwU2VydmVyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0Q2hhbm5lbEh0dHBTZXJ2ZXJQYWNrYWdlICh7Z2V0Q29uc29sZSwgbWV0aG9kQ2FsbCwgc2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycsIGNvbmZpZ30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7Y29uZmlnLCBtZXRob2RDYWxsLCBnZXRDb25zb2xlfSlcbiAgICBhc3luYyBmdW5jdGlvbiBzdGFydCAoKSB7XG4gICAgICB2YXIgc29ja2V0RmlsZT1jb25maWcuZmlsZS5yZXBsYWNlKFwiOlwiLFwiXCIpXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhzb2NrZXRGaWxlKSlmcy51bmxpbmtTeW5jKHNvY2tldEZpbGUpO1xuICAgICAgLy8gdmFyIGh0dHBVcmwgPSAnaHR0cDovLycgKyBjb25maWcuZmlsZS5yZXBsYWNlKCdodHRwOi8vJywgJycpLnJlcGxhY2UoJy8vJywgJycpXG4gICAgICAvLyB2YXIgaHR0cFBvcnQgPSB1cmwucGFyc2UoaHR0cFVybCwgZmFsc2UsIHRydWUpLnBvcnRcbiAgICAgIGh0dHBBcGkgPSBleHByZXNzKClcbiAgICAgIGh0dHBBcGkudXNlKGhlbG1ldCgpKVxuICAgICAgaHR0cEFwaS51c2UoY29tcHJlc3Npb24oe2xldmVsOiAxfSkpXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLmpzb24oKSkgLy8gc3VwcG9ydCBqc29uIGVuY29kZWQgYm9kaWVzXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSkgLy8gc3VwcG9ydCBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS5hbGwoJy9faHR0cE1lc3NhZ2UnLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlcS5ib2R5IHx8IHJlcS5xdWVyeVxuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ19odHRwTWVzc2FnZScsIHJlcSwgZGF0YSlcbiAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2RDYWxsKGRhdGEsIGZhbHNlLCBwdWJsaWNBcGksXCJzb2NrZXRcIilcbiAgICAgICAgICByZXMuc2VuZChyZXNwb25zZSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBDT05TT0xFLndhcm4oJ0FwaSBlcnJvcicsIHtlcnJvcn0pXG4gICAgICAgICAgcmVzLnNlbmQoe2Vycm9yfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGh0dHBBcGkuYWxsKCcvX2h0dHBNZXNzYWdlU3RyZWFtJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSByZXEuYm9keSB8fCByZXEucXVlcnlcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdfaHR0cE1lc3NhZ2VTdHJlYW0nLCByZXEsIGRhdGEpXG4gICAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9ldmVudC1zdHJlYW0nLFxuICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxuICAgICAgICAgICAgJ0Nvbm5lY3Rpb24nOiAna2VlcC1hbGl2ZSdcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZhciBnZXRTdHJlYW0gPSAob25DbG9zZSwgTUFYX1JFUVVFU1RfVElNRU9VVCA9IDEyMDAwMCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7IGlmICh0aW1lb3V0KWNsZWFyVGltZW91dCh0aW1lb3V0KTsgb25DbG9zZSgpIH1cbiAgICAgICAgICAgIHJlcy5vbignY2xvc2UnLCBjbG9zZSkub24oJ2ZpbmlzaCcsIGNsb3NlKS5vbignZXJyb3InLCBjbG9zZSkub24oJ2VuZCcsIGNsb3NlKVxuICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KHJlcy5lbmQsIE1BWF9SRVFVRVNUX1RJTUVPVVQpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB3cml0ZTogKG9iaikgPT4gcmVzLndyaXRlKEpTT04uc3RyaW5naWZ5KG9iaikpLFxuICAgICAgICAgICAgICBlbmQ6IChvYmopID0+IHJlcy5lbmQoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBtZXRob2RDYWxsKGRhdGEsIGdldFN0cmVhbSwgcHVibGljQXBpLFwic29ja2V0XCIpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgQ09OU09MRS53YXJuKCdBcGkgZXJyb3InLCB7ZXJyb3J9KVxuICAgICAgICAgIHJlcy5zZW5kKHtlcnJvcn0pXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGh0dHBTZXJ2ZXIgPSBodHRwQXBpLmxpc3Rlbiggc29ja2V0RmlsZSlcbiAgICAgIENPTlNPTEUuZGVidWcoJ2h0dHAgQXBpIGxpc3RlbmluZyBvbiAnICsgc29ja2V0RmlsZSlcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQsXG4gICAgICBzdG9wICgpIHtcbiAgICAgICAgaHR0cFNlcnZlci5jbG9zZSgpXG4gICAgICB9LFxuICAgICAgcmVzdGFydCAoKSB7XG4gICAgICAgIGh0dHBTZXJ2ZXIuY2xvc2Uoc3RhcnQpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtjb25maWd9KVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0Q2hhbm5lbEh0dHBTZXJ2ZXJQYWNrYWdlICcgKyBjb25maWcuZmlsZSlcbiAgfVxufVxuIl19