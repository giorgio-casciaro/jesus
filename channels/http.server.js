'use strict';

var express = require('express-http2');
var bodyParser = require('body-parser');
var compression = require('compression');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHAuc2VydmVyLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsInVybCIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicHVibGljQXBpIiwiaHR0cEFwaSIsImh0dHBTZXJ2ZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0Q2hhbm5lbEh0dHBTZXJ2ZXJQYWNrYWdlIiwiZ2V0Q29uc29sZSIsIm1ldGhvZENhbGwiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImNvbmZpZyIsIkNPTlNPTEUiLCJzdGFydCIsImh0dHBVcmwiLCJyZXBsYWNlIiwiaHR0cFBvcnQiLCJwYXJzZSIsInBvcnQiLCJ1c2UiLCJsZXZlbCIsImpzb24iLCJ1cmxlbmNvZGVkIiwiZXh0ZW5kZWQiLCJhbGwiLCJyZXEiLCJyZXMiLCJkYXRhIiwiYm9keSIsInF1ZXJ5IiwiZGVidWciLCJyZXNwb25zZSIsInNlbmQiLCJ3YXJuIiwiZXJyb3IiLCJ3cml0ZUhlYWQiLCJnZXRTdHJlYW0iLCJvbkNsb3NlIiwiTUFYX1JFUVVFU1RfVElNRU9VVCIsImNsb3NlIiwidGltZW91dCIsImNsZWFyVGltZW91dCIsIm9uIiwic2V0VGltZW91dCIsImVuZCIsIndyaXRlIiwib2JqIiwiSlNPTiIsInN0cmluZ2lmeSIsIm5ld01ldGEiLCJtZXRhSyIsImhlYWRlcnMiLCJpbmRleE9mIiwibWV0aG9kTmFtZSIsIm1lc3NhZ2UiLCJtZXRhIiwibWV0aG9kIiwiaXNTdHJlYW0iLCJzdHJlYW0iLCJzb2NrZXQiLCJsaXN0ZW4iLCJzdG9wIiwicmVzdGFydCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFVBQVVDLFFBQVEsZUFBUixDQUFkO0FBQ0EsSUFBSUMsYUFBYUQsUUFBUSxhQUFSLENBQWpCO0FBQ0EsSUFBSUUsY0FBY0YsUUFBUSxhQUFSLENBQWxCO0FBQ0EsSUFBSUcsU0FBU0gsUUFBUSxRQUFS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QUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUZFOztBQUNGRSxrQkFBYyxFQUFDVyxjQUFELEVBQVNILHNCQUFULEVBQXFCRCxzQkFBckIsRUFBZDs7O0FBMkZBLFdBQU87QUFDTE0sa0JBREs7QUFFTGdELFVBRkssa0JBRUc7QUFDTmpELGdCQUFRa0IsS0FBUixDQUFjLHFCQUFkLEVBQXFDM0IsVUFBckM7QUFDQUEsbUJBQVdvQyxLQUFYO0FBQ0QsT0FMSTtBQU1MdUIsYUFOSyxxQkFNTTtBQUNUM0QsbUJBQVdvQyxLQUFYLENBQWlCMUIsS0FBakI7QUFDRDtBQVJJLEtBQVA7QUFVRCxHQXRHRCxDQXNHRSxPQUFPcUIsS0FBUCxFQUFjO0FBQ2R0QixZQUFRc0IsS0FBUixDQUFjQSxLQUFkLEVBQXFCLEVBQUN2QixjQUFELEVBQXJCO0FBQ0EsVUFBTSxJQUFJb0QsS0FBSixDQUFVLGlDQUFpQ3BELE9BQU9iLEdBQWxELENBQU47QUFDRDtBQUNGLENBNUdEIiwiZmlsZSI6Imh0dHAuc2VydmVyLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcy1odHRwMicpXG52YXIgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2JvZHktcGFyc2VyJylcbnZhciBjb21wcmVzc2lvbiA9IHJlcXVpcmUoJ2NvbXByZXNzaW9uJylcbnZhciBoZWxtZXQgPSByZXF1aXJlKCdoZWxtZXQnKVxuY29uc3QgdXJsID0gcmVxdWlyZSgndXJsJylcbmNvbnN0IFBBQ0tBR0UgPSAnY2hhbm5lbC5odHRwLnNlcnZlcidcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuLi91dGlscycpLmNoZWNrUmVxdWlyZWRcbmNvbnN0IHB1YmxpY0FwaSA9IGZhbHNlXG52YXIgaHR0cEFwaVxudmFyIGh0dHBTZXJ2ZXJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRDaGFubmVsSHR0cFNlcnZlclBhY2thZ2UgKHtnZXRDb25zb2xlLCBtZXRob2RDYWxsLCBzZXJ2aWNlTmFtZSA9ICd1bmtub3cnLCBzZXJ2aWNlSWQgPSAndW5rbm93JywgY29uZmlnfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHtjb25maWcsIG1ldGhvZENhbGwsIGdldENvbnNvbGV9KVxuICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAgICAgIHZhciBodHRwVXJsID0gJ2h0dHA6Ly8nICsgY29uZmlnLnVybC5yZXBsYWNlKCdodHRwOi8vJywgJycpLnJlcGxhY2UoJy8vJywgJycpXG4gICAgICB2YXIgaHR0cFBvcnQgPSB1cmwucGFyc2UoaHR0cFVybCwgZmFsc2UsIHRydWUpLnBvcnRcbiAgICAgIGh0dHBBcGkgPSBleHByZXNzKClcbiAgICAgIGh0dHBBcGkudXNlKGhlbG1ldCgpKVxuICAgICAgaHR0cEFwaS51c2UoY29tcHJlc3Npb24oe2xldmVsOiAxfSkpXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLmpzb24oKSkgLy8gc3VwcG9ydCBqc29uIGVuY29kZWQgYm9kaWVzXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSkgLy8gc3VwcG9ydCBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS5hbGwoJy9faHR0cE1lc3NhZ2UnLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlcS5ib2R5IHx8IHJlcS5xdWVyeVxuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ19odHRwTWVzc2FnZScsIHJlcSwgZGF0YSlcbiAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2RDYWxsKGRhdGEsIGZhbHNlLCBwdWJsaWNBcGksICdodHRwJylcbiAgICAgICAgICByZXMuc2VuZChyZXNwb25zZSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBDT05TT0xFLndhcm4oJ0FwaSBlcnJvcicsIHtlcnJvcn0pXG4gICAgICAgICAgcmVzLnNlbmQoe2Vycm9yfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGh0dHBBcGkuYWxsKCcvX2h0dHBNZXNzYWdlU3RyZWFtJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSByZXEuYm9keSB8fCByZXEucXVlcnlcbiAgICAgICAgICBDT05TT0xFLmRlYnVnKCdfaHR0cE1lc3NhZ2VTdHJlYW0nLCByZXEsIGRhdGEpXG4gICAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9ldmVudC1zdHJlYW0nLFxuICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxuICAgICAgICAgICAgJ0Nvbm5lY3Rpb24nOiAna2VlcC1hbGl2ZSdcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZhciBnZXRTdHJlYW0gPSAob25DbG9zZSwgTUFYX1JFUVVFU1RfVElNRU9VVCA9IDEyMDAwMCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7IGlmICh0aW1lb3V0KWNsZWFyVGltZW91dCh0aW1lb3V0KTsgb25DbG9zZSgpIH1cbiAgICAgICAgICAgIHJlcy5vbignY2xvc2UnLCBjbG9zZSkub24oJ2ZpbmlzaCcsIGNsb3NlKS5vbignZXJyb3InLCBjbG9zZSkub24oJ2VuZCcsIGNsb3NlKVxuICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KHJlcy5lbmQsIE1BWF9SRVFVRVNUX1RJTUVPVVQpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB3cml0ZTogKG9iaikgPT4gcmVzLndyaXRlKEpTT04uc3RyaW5naWZ5KG9iaikpLFxuICAgICAgICAgICAgICBlbmQ6IChvYmopID0+IHJlcy5lbmQoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBtZXRob2RDYWxsKGRhdGEsIGdldFN0cmVhbSwgcHVibGljQXBpLCAnaHR0cCcpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgQ09OU09MRS53YXJuKCdBcGkgZXJyb3InLCB7ZXJyb3J9KVxuICAgICAgICAgIHJlcy5zZW5kKHtlcnJvcn0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBodHRwQXBpLmFsbCgnKicsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBuZXdNZXRhID0ge31cbiAgICAgICAgICBmb3IgKHZhciBtZXRhSyBpbiByZXEuaGVhZGVycykgaWYgKG1ldGFLLmluZGV4T2YoJ2FwcC1tZXRhLScpICsgMSluZXdNZXRhW21ldGFLLnJlcGxhY2UoJ2FwcC1tZXRhLScsICcnKV0gPSByZXEuaGVhZGVyc1ttZXRhS11cblxuICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gcmVxLnVybC5yZXBsYWNlKCcvJywgJycpXG4gICAgICAgICAgdmFyIGRhdGEgPSByZXEuYm9keSB8fCByZXEucXVlcnlcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgIG1ldGE6IG5ld01ldGEsIC8vIEhUVFAgSEVBREVSUyBPTkxZIExPV0VSQ0FTRVxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2ROYW1lLFxuICAgICAgICAgICAgZGF0YVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaXNTdHJlYW0gPSAobmV3TWV0YS5zdHJlYW0gPT09ICd0cnVlJyB8fCBuZXdNZXRhLnN0cmVhbSA9PT0gJzEnKVxuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ25ld01ldGEnLCB7bmV3TWV0YX0pXG4gICAgICAgICAgaWYgKCFpc1N0cmVhbSkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbWV0aG9kQ2FsbChtZXNzYWdlLCBmYWxzZSwgcHVibGljQXBpLCAnaHR0cFB1YmxpYycpXG4gICAgICAgICAgICByZXMuc2VuZChyZXNwb25zZSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgQ09OU09MRS5kZWJ1ZygnSHR0cFB1YmxpYyBNRVNTQUdFIFNUUkVBTScsIHtpc1N0cmVhbSwgbWVzc2FnZSwgaGVhZGVyczogcmVxLmhlYWRlcnMsIGRhdGF9KVxuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L2V2ZW50LXN0cmVhbScsXG4gICAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb24nOiAna2VlcC1hbGl2ZSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB2YXIgZ2V0U3RyZWFtID0gKG9uQ2xvc2UsIE1BWF9SRVFVRVNUX1RJTUVPVVQgPSAxMjAwMDApID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7IGlmICh0aW1lb3V0KWNsZWFyVGltZW91dCh0aW1lb3V0KTsgb25DbG9zZSgpIH1cbiAgICAgICAgICAgICAgcmVzLm9uKCdjbG9zZScsIGNsb3NlKS5vbignZmluaXNoJywgY2xvc2UpLm9uKCdlcnJvcicsIGNsb3NlKS5vbignZW5kJywgY2xvc2UpXG4gICAgICAgICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChyZXMuZW5kLCBNQVhfUkVRVUVTVF9USU1FT1VUKVxuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHdyaXRlOiAob2JqKSA9PiByZXMud3JpdGUoSlNPTi5zdHJpbmdpZnkob2JqKSksXG4gICAgICAgICAgICAgICAgZW5kOiAob2JqKSA9PiByZXMuZW5kKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtZXRob2RDYWxsKG1lc3NhZ2UsIGdldFN0cmVhbSwgcHVibGljQXBpLCAnaHR0cFB1YmxpYycpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIENPTlNPTEUud2FybignQXBpIGVycm9yJywge2Vycm9yfSlcbiAgICAgICAgICByZXMuc2VuZCh7ZXJyb3J9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgaHR0cFNlcnZlciA9IGh0dHBBcGkub24oJ2Nvbm5lY3Rpb24nLCBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICAgIC8vIHNvY2tldC5zZXRUaW1lb3V0KDYwMDAwKVxuICAgICAgfSkubGlzdGVuKGh0dHBQb3J0KVxuICAgICAgQ09OU09MRS5kZWJ1ZygnaHR0cCBBcGkgbGlzdGVuaW5nIG9uICcgKyBjb25maWcudXJsKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzdGFydCxcbiAgICAgIHN0b3AgKCkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdTdG9wcGluZyBodHRwU2VydmVyJyAsaHR0cFNlcnZlcilcbiAgICAgICAgaHR0cFNlcnZlci5jbG9zZSgpXG4gICAgICB9LFxuICAgICAgcmVzdGFydCAoKSB7XG4gICAgICAgIGh0dHBTZXJ2ZXIuY2xvc2Uoc3RhcnQpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtjb25maWd9KVxuICAgIHRocm93IG5ldyBFcnJvcignZ2V0Q2hhbm5lbEh0dHBTZXJ2ZXJQYWNrYWdlICcgKyBjb25maWcudXJsKVxuICB9XG59XG4iXX0=