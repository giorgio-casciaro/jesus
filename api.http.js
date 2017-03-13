'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var express = require('express-http2');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var netClient = require('./net.client');
var uuidV4 = require('uuid/v4');
var PACKAGE = 'api.http';

var checkRequired = require('./jesus').checkRequired;

module.exports = function getHttpApiPackage(_ref) {
  var serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      _ref$publicOnly = _ref.publicOnly,
      publicOnly = _ref$publicOnly === undefined ? true : _ref$publicOnly,
      _ref$httpPort = _ref.httpPort,
      httpPort = _ref$httpPort === undefined ? 80 : _ref$httpPort,
      getMethods = _ref.getMethods,
      getSharedConfig = _ref.getSharedConfig,
      getConsole = _ref.getConsole;

  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);

  var validateMethodRequest = function validateMethodRequest(methodName, serviceMethodsConfig, data) {
    return require('./jesus').validateMethodFromConfig(errorThrow, serviceName, serviceId, serviceMethodsConfig, methodName, data, 'requestSchema');
  };
  var validateMethodResponse = function validateMethodResponse(methodName, serviceMethodsConfig, data) {
    return require('./jesus').validateMethodFromConfig(errorThrow, serviceName, serviceId, serviceMethodsConfig, methodName, data, 'responseSchema');
  };
  // var validateMethodRequest = async (methodName, data) => true
  // var validateMethodResponse = async (methodName, data) => true
  try {
    var netClientPackage;
    var httpApi;
    var httpServer;

    var _ret = function () {
      var start = function _callee3() {
        var _this = this;

        return regeneratorRuntime.async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                httpApi = express();
                httpApi.use(helmet());
                httpApi.use(compression({ level: 1 }));
                httpApi.use(bodyParser.json()); // support json encoded bodies
                httpApi.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
                httpApi.all('*', function _callee2(req, res) {
                  var methodName, serviceMethods, serviceMethodsConfig, data, meta, eventReqResult, response, eventResResult, getStream;
                  return regeneratorRuntime.async(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.prev = 0;
                          methodName = req.url.replace('/', '');
                          serviceMethods = getMethods();
                          _context2.next = 5;
                          return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'methods'));

                        case 5:
                          serviceMethodsConfig = _context2.sent;

                          if (!serviceMethodsConfig[methodName]) errorThrow(methodName + ' is not valid (not defined in methods config)');
                          if (!serviceMethodsConfig[methodName].public && publicOnly) errorThrow(methodName + ' is not public');
                          if (!serviceMethods[methodName]) errorThrow(methodName + ' is not valid (not defined service methods js file)');
                          data = req.body || req.query;
                          meta = {
                            type: 'apiRequest',
                            corrid: req.headers.corrid || uuidV4(),
                            userid: data.userid,
                            methodName: methodName,
                            ip: req.ip,
                            // headers: req.headers,
                            timestamp: Date.now() / 1000
                          };
                          //  CONSOLE.debug('Api request ' + methodName + ' corrid:' + meta.corrid, {methodName, httpPort, serviceMethods, data, meta})

                          _context2.next = 13;
                          return regeneratorRuntime.awrap(netClientPackage.emit('apiRequest', { data: data, meta: meta }, meta));

                        case 13:
                          eventReqResult = _context2.sent;

                          validateMethodRequest(methodName, serviceMethodsConfig, data, meta);

                          if (serviceMethodsConfig[methodName].stream) {
                            _context2.next = 26;
                            break;
                          }

                          _context2.next = 18;
                          return regeneratorRuntime.awrap(serviceMethods[methodName](eventReqResult || data, meta, res));

                        case 18:
                          response = _context2.sent;

                          validateMethodResponse(methodName, serviceMethodsConfig, response, meta);
                          _context2.next = 22;
                          return regeneratorRuntime.awrap(netClientPackage.emit('apiResponse', { response: response, meta: meta }, meta));

                        case 22:
                          eventResResult = _context2.sent;

                          res.send(eventResResult || response);
                          _context2.next = 38;
                          break;

                        case 26:
                          // STREAM
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
                            res.on('close', close);
                            res.on('finish', close);
                            res.on('error', close);
                            var timeout = setTimeout(res.end, MAX_REQUEST_TIMEOUT);
                            return function _callee(data) {
                              var streamEventResult;
                              return regeneratorRuntime.async(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      _context.prev = 0;
                                      _context.next = 3;
                                      return regeneratorRuntime.awrap(netClientPackage.emit('apiStreamResponse', data, meta));

                                    case 3:
                                      streamEventResult = _context.sent;

                                      res.write('data: ' + JSON.stringify(streamEventResult || data) + '\n\n');
                                      res.flush();
                                      _context.next = 11;
                                      break;

                                    case 8:
                                      _context.prev = 8;
                                      _context.t0 = _context['catch'](0);

                                      errorThrow('apiStreamResponse', { error: _context.t0, methodName: methodName, serviceMethodsConfig: serviceMethodsConfig, data: data, meta: meta });

                                    case 11:
                                    case 'end':
                                      return _context.stop();
                                  }
                                }
                              }, null, _this, [[0, 8]]);
                            };
                          };

                          _context2.next = 30;
                          return regeneratorRuntime.awrap(serviceMethods[methodName](eventReqResult || data, meta, res, getStream));

                        case 30:
                          response = _context2.sent;

                          validateMethodResponse(methodName, serviceMethodsConfig, response, meta);

                          if (!response) {
                            _context2.next = 38;
                            break;
                          }

                          _context2.next = 35;
                          return regeneratorRuntime.awrap(netClientPackage.emit('apiResponse', { response: response, meta: meta }, meta));

                        case 35:
                          eventResResult = _context2.sent;

                          res.write('data: ' + JSON.stringify(eventResResult || response) + '\n\n');
                          res.flush();

                        case 38:
                          _context2.next = 44;
                          break;

                        case 40:
                          _context2.prev = 40;
                          _context2.t0 = _context2['catch'](0);

                          CONSOLE.warn('Api error', { error: _context2.t0 });
                          res.send({ error: _context2.t0 });

                        case 44:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, null, _this, [[0, 40]]);
                });
                httpServer = httpApi.on('connection', function (socket) {
                  // socket.setTimeout(60000)
                }).listen(httpPort);
                CONSOLE.debug('http Api listening on port' + httpPort);

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, null, this);
      };

      checkRequired({ serviceName: serviceName, serviceId: serviceId, getMethods: getMethods, getSharedConfig: getSharedConfig, getConsole: getConsole });
      netClientPackage = netClient({ getSharedConfig: getSharedConfig, serviceName: serviceName, serviceId: serviceId, getConsole: getConsole });

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
    errorThrow('getHttpApiPackage', { error: error });
  }
};

// {

// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5odHRwLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsIm5ldENsaWVudCIsInV1aWRWNCIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEh0dHBBcGlQYWNrYWdlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwdWJsaWNPbmx5IiwiaHR0cFBvcnQiLCJnZXRNZXRob2RzIiwiZ2V0U2hhcmVkQ29uZmlnIiwiZ2V0Q29uc29sZSIsImVycm9yVGhyb3ciLCJDT05TT0xFIiwidmFsaWRhdGVNZXRob2RSZXF1ZXN0IiwibWV0aG9kTmFtZSIsInNlcnZpY2VNZXRob2RzQ29uZmlnIiwiZGF0YSIsInZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyIsInZhbGlkYXRlTWV0aG9kUmVzcG9uc2UiLCJuZXRDbGllbnRQYWNrYWdlIiwiaHR0cEFwaSIsImh0dHBTZXJ2ZXIiLCJzdGFydCIsInVzZSIsImxldmVsIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImFsbCIsInJlcSIsInJlcyIsInVybCIsInJlcGxhY2UiLCJzZXJ2aWNlTWV0aG9kcyIsInB1YmxpYyIsImJvZHkiLCJxdWVyeSIsIm1ldGEiLCJ0eXBlIiwiY29ycklkIiwiaGVhZGVycyIsInVzZXJJZCIsImlwIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsImVtaXQiLCJldmVudFJlcVJlc3VsdCIsInN0cmVhbSIsInJlc3BvbnNlIiwiZXZlbnRSZXNSZXN1bHQiLCJzZW5kIiwid3JpdGVIZWFkIiwiZ2V0U3RyZWFtIiwib25DbG9zZSIsIk1BWF9SRVFVRVNUX1RJTUVPVVQiLCJjbG9zZSIsInRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJvbiIsInNldFRpbWVvdXQiLCJlbmQiLCJzdHJlYW1FdmVudFJlc3VsdCIsIndyaXRlIiwiSlNPTiIsInN0cmluZ2lmeSIsImZs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UTJELEtBQVIsQ0FBYywrQkFBK0JoRSxRQUE3Qzs7QUExRUY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FMRTs7QUFDRlAsb0JBQWMsRUFBQ0ksd0JBQUQsRUFBY0Msb0JBQWQsRUFBeUJHLHNCQUF6QixFQUFxQ0MsZ0NBQXJDLEVBQXNEQyxzQkFBdEQsRUFBZDtBQUNJUyx5QkFBbUJ0QixVQUFVLEVBQUNZLGdDQUFELEVBQWtCTCx3QkFBbEIsRUFBK0JDLG9CQUEvQixFQUEwQ0ssc0JBQTFDLEVBQVYsQ0FGckI7O0FBaUZGO0FBQUEsV0FBTztBQUNMWSxzQkFESztBQUVMa0QsY0FGSyxrQkFFRztBQUNObkQsdUJBQVdtQyxLQUFYO0FBQ0QsV0FKSTtBQUtMaUIsaUJBTEsscUJBS007QUFDVHBELHVCQUFXbUMsS0FBWCxDQUFpQmxDLEtBQWpCO0FBQ0Q7QUFQSTtBQUFQO0FBakZFOztBQUFBO0FBMEZILEdBMUZELENBMEZFLE9BQU82QyxLQUFQLEVBQWM7QUFDZHhELGVBQVcsbUJBQVgsRUFBZ0MsRUFBQ3dELFlBQUQsRUFBaEM7QUFDRDtBQUNGLENBckdEOztBQXVHQTs7QUFFQSIsImZpbGUiOiJhcGkuaHR0cC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MtaHR0cDInKVxudmFyIGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpXG52YXIgY29tcHJlc3Npb24gPSByZXF1aXJlKCdjb21wcmVzc2lvbicpXG52YXIgaGVsbWV0ID0gcmVxdWlyZSgnaGVsbWV0JylcbmNvbnN0IG5ldENsaWVudCA9IHJlcXVpcmUoJy4vbmV0LmNsaWVudCcpXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcbmNvbnN0IFBBQ0tBR0UgPSAnYXBpLmh0dHAnXG5cbnZhciBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRIdHRwQXBpUGFja2FnZSAoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHB1YmxpY09ubHkgPSB0cnVlLCBodHRwUG9ydCA9IDgwLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGdldENvbnNvbGV9KSB7XG4gIHZhciBlcnJvclRocm93ID0gcmVxdWlyZSgnLi9qZXN1cycpLmVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG5cbiAgdmFyIHZhbGlkYXRlTWV0aG9kUmVxdWVzdCA9IChtZXRob2ROYW1lLCBzZXJ2aWNlTWV0aG9kc0NvbmZpZywgZGF0YSkgPT4gcmVxdWlyZSgnLi9qZXN1cycpLnZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyhlcnJvclRocm93LCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBzZXJ2aWNlTWV0aG9kc0NvbmZpZywgbWV0aG9kTmFtZSwgZGF0YSwgJ3JlcXVlc3RTY2hlbWEnKVxuICB2YXIgdmFsaWRhdGVNZXRob2RSZXNwb25zZSA9IChtZXRob2ROYW1lLCBzZXJ2aWNlTWV0aG9kc0NvbmZpZywgZGF0YSkgPT4gcmVxdWlyZSgnLi9qZXN1cycpLnZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyhlcnJvclRocm93LCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBzZXJ2aWNlTWV0aG9kc0NvbmZpZywgbWV0aG9kTmFtZSwgZGF0YSwgJ3Jlc3BvbnNlU2NoZW1hJylcbiAgLy8gdmFyIHZhbGlkYXRlTWV0aG9kUmVxdWVzdCA9IGFzeW5jIChtZXRob2ROYW1lLCBkYXRhKSA9PiB0cnVlXG4gIC8vIHZhciB2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlID0gYXN5bmMgKG1ldGhvZE5hbWUsIGRhdGEpID0+IHRydWVcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGdldENvbnNvbGV9KVxuICAgIHZhciBuZXRDbGllbnRQYWNrYWdlID0gbmV0Q2xpZW50KHtnZXRTaGFyZWRDb25maWcsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGdldENvbnNvbGV9KVxuICAgIHZhciBodHRwQXBpXG4gICAgdmFyIGh0dHBTZXJ2ZXJcbiAgICBhc3luYyBmdW5jdGlvbiBzdGFydCAoKSB7XG4gICAgICBodHRwQXBpID0gZXhwcmVzcygpXG4gICAgICBodHRwQXBpLnVzZShoZWxtZXQoKSlcbiAgICAgIGh0dHBBcGkudXNlKGNvbXByZXNzaW9uKHtsZXZlbDogMX0pKVxuICAgICAgaHR0cEFwaS51c2UoYm9keVBhcnNlci5qc29uKCkpIC8vIHN1cHBvcnQganNvbiBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUgfSkpIC8vIHN1cHBvcnQgZW5jb2RlZCBib2RpZXNcbiAgICAgIGh0dHBBcGkuYWxsKCcqJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSByZXEudXJsLnJlcGxhY2UoJy8nLCAnJylcbiAgICAgICAgICB2YXIgc2VydmljZU1ldGhvZHMgPSBnZXRNZXRob2RzKClcbiAgICAgICAgICB2YXIgc2VydmljZU1ldGhvZHNDb25maWcgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdtZXRob2RzJylcbiAgICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdKWVycm9yVGhyb3cobWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkIChub3QgZGVmaW5lZCBpbiBtZXRob2RzIGNvbmZpZyknKVxuICAgICAgICAgIGlmICghc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV0ucHVibGljICYmIHB1YmxpY09ubHkpZXJyb3JUaHJvdyhtZXRob2ROYW1lICsgJyBpcyBub3QgcHVibGljJylcbiAgICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzW21ldGhvZE5hbWVdKWVycm9yVGhyb3cobWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkIChub3QgZGVmaW5lZCBzZXJ2aWNlIG1ldGhvZHMganMgZmlsZSknKVxuICAgICAgICAgIHZhciBkYXRhID0gcmVxLmJvZHkgfHwgcmVxLnF1ZXJ5XG4gICAgICAgICAgdmFyIG1ldGEgPSB7XG4gICAgICAgICAgICB0eXBlOiAnYXBpUmVxdWVzdCcsXG4gICAgICAgICAgICBjb3JySWQ6IHJlcS5oZWFkZXJzLmNvcnJJZCB8fCB1dWlkVjQoKSxcbiAgICAgICAgICAgIHVzZXJJZDogZGF0YS51c2VySWQsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgaXA6IHJlcS5pcCxcbiAgICAgICAgICAgIC8vIGhlYWRlcnM6IHJlcS5oZWFkZXJzLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC8gMTAwMFxuICAgICAgICAgIH1cbiAgICAgICAgLy8gIENPTlNPTEUuZGVidWcoJ0FwaSByZXF1ZXN0ICcgKyBtZXRob2ROYW1lICsgJyBjb3JySWQ6JyArIG1ldGEuY29ycklkLCB7bWV0aG9kTmFtZSwgaHR0cFBvcnQsIHNlcnZpY2VNZXRob2RzLCBkYXRhLCBtZXRhfSlcbiAgICAgICAgICB2YXIgZXZlbnRSZXFSZXN1bHQgPSBhd2FpdCBuZXRDbGllbnRQYWNrYWdlLmVtaXQoJ2FwaVJlcXVlc3QnLCB7ZGF0YSwgbWV0YX0sIG1ldGEpXG4gICAgICAgICAgdmFsaWRhdGVNZXRob2RSZXF1ZXN0KG1ldGhvZE5hbWUsIHNlcnZpY2VNZXRob2RzQ29uZmlnLCBkYXRhLCBtZXRhKVxuICAgICAgICAgIHZhciByZXNwb25zZSwgZXZlbnRSZXNSZXN1bHRcbiAgICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdLnN0cmVhbSkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlTWV0aG9kc1ttZXRob2ROYW1lXShldmVudFJlcVJlc3VsdCB8fCBkYXRhLCBtZXRhLCByZXMpXG4gICAgICAgICAgICB2YWxpZGF0ZU1ldGhvZFJlc3BvbnNlKG1ldGhvZE5hbWUsIHNlcnZpY2VNZXRob2RzQ29uZmlnLCByZXNwb25zZSwgbWV0YSlcbiAgICAgICAgICAgIGV2ZW50UmVzUmVzdWx0ID0gYXdhaXQgbmV0Q2xpZW50UGFja2FnZS5lbWl0KCdhcGlSZXNwb25zZScsIHtyZXNwb25zZSwgbWV0YX0sIG1ldGEpXG4gICAgICAgICAgICByZXMuc2VuZChldmVudFJlc1Jlc3VsdCB8fCByZXNwb25zZSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gU1RSRUFNXG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvZXZlbnQtc3RyZWFtJyxcbiAgICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxuICAgICAgICAgICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZhciBnZXRTdHJlYW0gPSAob25DbG9zZSwgTUFYX1JFUVVFU1RfVElNRU9VVCA9IDEyMDAwMCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBjbG9zZSA9ICgpID0+IHsgaWYgKHRpbWVvdXQpY2xlYXJUaW1lb3V0KHRpbWVvdXQpOyBvbkNsb3NlKCkgfVxuICAgICAgICAgICAgICByZXMub24oJ2Nsb3NlJywgY2xvc2UpXG4gICAgICAgICAgICAgIHJlcy5vbignZmluaXNoJywgY2xvc2UpXG4gICAgICAgICAgICAgIHJlcy5vbignZXJyb3InLCBjbG9zZSlcbiAgICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KHJlcy5lbmQsIE1BWF9SRVFVRVNUX1RJTUVPVVQpXG4gICAgICAgICAgICAgIHJldHVybiBhc3luYyAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAvLyAgQ09OU09MRS5kZWJ1Zygnc3RyZWFtIGNhbGxiYWNrJywgZGF0YSlcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgLy92YWxpZGF0ZU1ldGhvZFJlc3BvbnNlKG1ldGhvZE5hbWUsIHNlcnZpY2VNZXRob2RzQ29uZmlnLCBkYXRhLCBtZXRhKVxuICAgICAgICAgICAgICAgICAgdmFyIHN0cmVhbUV2ZW50UmVzdWx0ID0gYXdhaXQgbmV0Q2xpZW50UGFja2FnZS5lbWl0KCdhcGlTdHJlYW1SZXNwb25zZScsIGRhdGEsIG1ldGEpXG4gICAgICAgICAgICAgICAgICByZXMud3JpdGUoJ2RhdGE6ICcgKyBKU09OLnN0cmluZ2lmeShzdHJlYW1FdmVudFJlc3VsdCB8fCBkYXRhKSArICdcXG5cXG4nKVxuICAgICAgICAgICAgICAgICAgcmVzLmZsdXNoKClcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgZXJyb3JUaHJvdygnYXBpU3RyZWFtUmVzcG9uc2UnLCB7ZXJyb3IsbWV0aG9kTmFtZSwgc2VydmljZU1ldGhvZHNDb25maWcsIGRhdGEsIG1ldGF9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2aWNlTWV0aG9kc1ttZXRob2ROYW1lXShldmVudFJlcVJlc3VsdCB8fCBkYXRhLCBtZXRhLCByZXMsIGdldFN0cmVhbSlcbiAgICAgICAgICAgIHZhbGlkYXRlTWV0aG9kUmVzcG9uc2UobWV0aG9kTmFtZSwgc2VydmljZU1ldGhvZHNDb25maWcsIHJlc3BvbnNlLCBtZXRhKVxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7IC8vIFNFTkQgUkVTUE9OU0UgQVMgRklSU1QgQ0hVTktcbiAgICAgICAgICAgICAgZXZlbnRSZXNSZXN1bHQgPSBhd2FpdCBuZXRDbGllbnRQYWNrYWdlLmVtaXQoJ2FwaVJlc3BvbnNlJywge3Jlc3BvbnNlLCBtZXRhfSwgbWV0YSlcbiAgICAgICAgICAgICAgcmVzLndyaXRlKCdkYXRhOiAnICsgSlNPTi5zdHJpbmdpZnkoZXZlbnRSZXNSZXN1bHQgfHwgcmVzcG9uc2UpICsgJ1xcblxcbicpXG4gICAgICAgICAgICAgIHJlcy5mbHVzaCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIENPTlNPTEUud2FybignQXBpIGVycm9yJywge2Vycm9yfSlcbiAgICAgICAgICByZXMuc2VuZCh7ZXJyb3J9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgaHR0cFNlcnZlciA9IGh0dHBBcGkub24oJ2Nvbm5lY3Rpb24nLCBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICAgIC8vIHNvY2tldC5zZXRUaW1lb3V0KDYwMDAwKVxuICAgICAgfSkubGlzdGVuKGh0dHBQb3J0KVxuICAgICAgQ09OU09MRS5kZWJ1ZygnaHR0cCBBcGkgbGlzdGVuaW5nIG9uIHBvcnQnICsgaHR0cFBvcnQpXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdGFydCxcbiAgICAgIHN0b3AgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKClcbiAgICAgIH0sXG4gICAgICBodHRwYXJ0ICgpIHtcbiAgICAgICAgaHR0cFNlcnZlci5jbG9zZShzdGFydClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JUaHJvdygnZ2V0SHR0cEFwaVBhY2thZ2UnLCB7ZXJyb3J9KVxuICB9XG59XG5cbi8vIHtcblxuLy8gfVxuIl19