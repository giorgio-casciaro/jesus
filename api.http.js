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
  try {
    var CONSOLE;
    var netClientPackage;
    var httpApi;
    var httpServer;

    var _ret = function () {
      var start = function _callee2() {
        var _this = this;

        return regeneratorRuntime.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                httpApi = express();
                httpApi.use(helmet());
                httpApi.use(compression({ level: 1 }));
                httpApi.use(bodyParser.json()); // support json encoded bodies
                httpApi.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
                httpApi.all('*', function _callee(req, res) {
                  var methodName, serviceMethods, serviceMethodsConfig, data, meta, eventReqResult, response, eventResResult, stream;
                  return regeneratorRuntime.async(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.prev = 0;
                          methodName = req.url.replace('/', '');
                          serviceMethods = getMethods();
                          _context.next = 5;
                          return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'methods'));

                        case 5:
                          serviceMethodsConfig = _context.sent;

                          if (!serviceMethodsConfig[methodName]) errorThrow(methodName + ' is not valid (not defined in methods config)');
                          if (!serviceMethodsConfig[methodName].public && publicOnly) errorThrow(methodName + ' is not public');
                          if (!serviceMethods[methodName]) errorThrow(methodName + ' is not valid (not defined service methods js file)');
                          data = req.body || req.query;
                          meta = {
                            type: 'apiRequest',
                            requestId: req.headers.requestId || uuidV4(),
                            userId: data.userId,
                            methodName: methodName,
                            ip: req.ip,
                            // headers: req.headers,
                            timestamp: Date.now() / 1000
                          };

                          CONSOLE.debug('Api request ' + methodName + ' requestId:' + meta.requestId, { methodName: methodName, httpPort: httpPort, serviceMethods: serviceMethods, data: data, meta: meta });
                          _context.next = 14;
                          return regeneratorRuntime.awrap(netClientPackage.emit('apiRequest', { data: data, meta: meta }, meta));

                        case 14:
                          eventReqResult = _context.sent;

                          if (serviceMethodsConfig[methodName].stream) {
                            _context.next = 25;
                            break;
                          }

                          _context.next = 18;
                          return regeneratorRuntime.awrap(serviceMethods[methodName](eventReqResult || data, meta));

                        case 18:
                          response = _context.sent;
                          _context.next = 21;
                          return regeneratorRuntime.awrap(netClientPackage.emit('apiResponse', { response: response, meta: meta }, meta));

                        case 21:
                          eventResResult = _context.sent;

                          res.send(eventResResult || response);
                          _context.next = 28;
                          break;

                        case 25:
                          // STREAM
                          res.writeHead(200, {
                            'Content-Type': 'text/event-stream',
                            'Cache-Control': 'no-cache',
                            'Connection': 'keep-alive'
                          });
                          stream = {
                            write: function write(data) {
                              res.write('data: ' + JSON.stringify(data) + '\n\n');
                            },
                            res: res,
                            req: req
                          };

                          serviceMethods[methodName](eventReqResult || data, meta, stream);

                        case 28:
                          _context.next = 34;
                          break;

                        case 30:
                          _context.prev = 30;
                          _context.t0 = _context['catch'](0);

                          CONSOLE.warn('Api error', { error: _context.t0 });
                          res.send({ error: _context.t0 });

                        case 34:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, null, _this, [[0, 30]]);
                });
                httpServer = httpApi.on('connection', function (socket) {
                  socket.setTimeout(60000);
                }).listen(httpPort);
                CONSOLE.debug('http Api listening on port' + httpPort);

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, null, this);
      };

      checkRequired({ serviceName: serviceName, serviceId: serviceId, getMethods: getMethods, getSharedConfig: getSharedConfig, getConsole: getConsole });
      CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5odHRwLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsIm5ldENsaWVudCIsInV1aWRWNCIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEh0dHBBcGlQYWNrYWdlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwdWJsaWNPbmx5IiwiaHR0cFBvcnQiLCJnZXRNZXRob2RzIiwiZ2V0U2hhcmVkQ29uZmlnIiwiZ2V0Q29uc29sZSIsImVycm9yVGhyb3ciLCJDT05TT0xFIiwibmV0Q2xpZW50UGFja2FnZSIsImh0dHBBcGkiLCJodHRwU2VydmVyIiwic3RhcnQiLCJ1c2UiLCJsZXZlbCIsImpzb24iLCJ1cmxlbmNvZGVkIiwiZXh0ZW5kZWQiLCJhbGwiLCJyZXEiLCJyZXMiLCJtZXRob2ROYW1lIiwidXJsIiwicmVwbGFjZSIsInNlcnZpY2VNZXRob2RzIiwic2VydmljZU1ldGhvZHNDb25maWciLCJwdWJsaWMiLCJkYXRhIiwiYm9keSIsInF1ZXJ5IiwibWV0YSIsInR5cGUiLCJyZXF1ZXN0SWQiLCJoZWFkZXJzIiwidXNlcklkIiwiaXAiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZGVidWciLCJlbWl0IiwiZXZlbnRSZXFSZXN1bHQiLCJzdHJlYW0iLCJyZXNwb25zZSIsImV2ZW50UmVzUmVzdWx0Iiwic2VuZCIsIndyaXRlSGVhZCIsIndyaXRlIiwiSlNPTiIsInN0cmluZ2lmeSIsIndhcm4iLCJlcnJvciIsIm9uIiwic29ja2V0Iiwic2V0VGltZW91dCIsImxpc3RlbiIsInN0b3AiLCJjbG9zZSIsImh0dHBhcnQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLGVBQVIsQ0FBZDtBQUNBLElBQUlDLGFBQWFELFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQUlFLGNBQWNGLFFBQVEsYUFBUixDQUFs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O0FBQUE7QUFBQSxpQkFBakI7QUE2Q0F4Qyw2QkFBYUQsUUFBUTBDLEVBQVIsQ0FBVyxZQUFYLEVBQXlCLFVBQVVDLE1BQVYsRUFBa0I7QUFDdERBLHlCQUFPQyxVQUFQLENBQWtCLEtBQWxCO0FBQ0QsaUJBRlksRUFFVkMsTUFGVSxDQUVIcEQsUUFGRyxDQUFiO0FBR0FLLHdCQUFRK0IsS0FBUixDQUFjLCtCQUErQnBDLFFBQTdDOztBQXRERjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQU5FOztBQUNGUCxvQkFBYyxFQUFDSSx3QkFBRCxFQUFjQyxvQkFBZCxFQUF5Qkcsc0JBQXpCLEVBQXFDQyxnQ0FBckMsRUFBcURDLHNCQUFyRCxFQUFkO0FBQ0lFLGdCQUFVRixXQUFXTixXQUFYLEVBQXdCQyxTQUF4QixFQUFtQ04sT0FBbkMsQ0FGWjtBQUdFYyx5QkFBbUJoQixVQUFVLEVBQUNZLGdDQUFELEVBQWtCTCx3QkFBbEIsRUFBK0JDLG9CQUEvQixFQUF5Q0ssc0JBQXpDLEVBQVYsQ0FIckI7O0FBOERGO0FBQUEsV0FBTztBQUNMTSxzQkFESztBQUVMNEMsY0FGSyxrQkFFRztBQUNON0MsdUJBQVc4QyxLQUFYO0FBQ0QsV0FKSTtBQUtMQyxpQkFMSyxxQkFLTTtBQUNUL0MsdUJBQVc4QyxLQUFYLENBQWlCN0MsS0FBakI7QUFDRDtBQVBJO0FBQVA7QUE5REU7O0FBQUE7QUF1RUgsR0F2RUQsQ0F1RUUsT0FBT3VDLEtBQVAsRUFBYztBQUNkNUMsZUFBVyxtQkFBWCxFQUFnQyxFQUFDNEMsWUFBRCxFQUFoQztBQUNEO0FBQ0YsQ0E1RUQ7O0FBOEVBOztBQUVBIiwiZmlsZSI6ImFwaS5odHRwLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcy1odHRwMicpXG52YXIgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2JvZHktcGFyc2VyJylcbnZhciBjb21wcmVzc2lvbiA9IHJlcXVpcmUoJ2NvbXByZXNzaW9uJylcbnZhciBoZWxtZXQgPSByZXF1aXJlKCdoZWxtZXQnKVxuY29uc3QgbmV0Q2xpZW50ID0gcmVxdWlyZSgnLi9uZXQuY2xpZW50JylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxuY29uc3QgUEFDS0FHRSA9ICdhcGkuaHR0cCdcblxudmFyIGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEh0dHBBcGlQYWNrYWdlICh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcHVibGljT25seSA9IHRydWUsIGh0dHBQb3J0ID0gODAsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZyxnZXRDb25zb2xlfSkge1xuICB2YXIgZXJyb3JUaHJvdyA9IHJlcXVpcmUoJy4vamVzdXMnKS5lcnJvclRocm93KHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZ2V0TWV0aG9kcywgZ2V0U2hhcmVkQ29uZmlnLGdldENvbnNvbGV9KVxuICAgIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICAgIHZhciBuZXRDbGllbnRQYWNrYWdlID0gbmV0Q2xpZW50KHtnZXRTaGFyZWRDb25maWcsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsZ2V0Q29uc29sZX0pXG4gICAgdmFyIGh0dHBBcGlcbiAgICB2YXIgaHR0cFNlcnZlclxuICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAgICAgIGh0dHBBcGkgPSBleHByZXNzKClcbiAgICAgIGh0dHBBcGkudXNlKGhlbG1ldCgpKVxuICAgICAgaHR0cEFwaS51c2UoY29tcHJlc3Npb24oe2xldmVsOiAxfSkpXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLmpzb24oKSkgLy8gc3VwcG9ydCBqc29uIGVuY29kZWQgYm9kaWVzXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSkgLy8gc3VwcG9ydCBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS5hbGwoJyonLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IHJlcS51cmwucmVwbGFjZSgnLycsICcnKVxuICAgICAgICAgIHZhciBzZXJ2aWNlTWV0aG9kcyA9IGdldE1ldGhvZHMoKVxuICAgICAgICAgIHZhciBzZXJ2aWNlTWV0aG9kc0NvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ21ldGhvZHMnKVxuICAgICAgICAgIGlmICghc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV0pZXJyb3JUaHJvdyhtZXRob2ROYW1lICsgJyBpcyBub3QgdmFsaWQgKG5vdCBkZWZpbmVkIGluIG1ldGhvZHMgY29uZmlnKScpXG4gICAgICAgICAgaWYgKCFzZXJ2aWNlTWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXS5wdWJsaWMgJiYgcHVibGljT25seSllcnJvclRocm93KG1ldGhvZE5hbWUgKyAnIGlzIG5vdCBwdWJsaWMnKVxuICAgICAgICAgIGlmICghc2VydmljZU1ldGhvZHNbbWV0aG9kTmFtZV0pZXJyb3JUaHJvdyhtZXRob2ROYW1lICsgJyBpcyBub3QgdmFsaWQgKG5vdCBkZWZpbmVkIHNlcnZpY2UgbWV0aG9kcyBqcyBmaWxlKScpXG4gICAgICAgICAgdmFyIGRhdGEgPSByZXEuYm9keSB8fCByZXEucXVlcnlcbiAgICAgICAgICB2YXIgbWV0YSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcGlSZXF1ZXN0JyxcbiAgICAgICAgICAgIHJlcXVlc3RJZDogcmVxLmhlYWRlcnMucmVxdWVzdElkIHx8IHV1aWRWNCgpLFxuICAgICAgICAgICAgdXNlcklkOiBkYXRhLnVzZXJJZCxcbiAgICAgICAgICAgIG1ldGhvZE5hbWUsXG4gICAgICAgICAgICBpcDogcmVxLmlwLFxuICAgICAgICAgICAgLy8gaGVhZGVyczogcmVxLmhlYWRlcnMsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLyAxMDAwXG4gICAgICAgICAgfVxuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ0FwaSByZXF1ZXN0ICcgKyBtZXRob2ROYW1lICsgJyByZXF1ZXN0SWQ6JyArIG1ldGEucmVxdWVzdElkLCB7bWV0aG9kTmFtZSwgaHR0cFBvcnQsIHNlcnZpY2VNZXRob2RzLCBkYXRhLCBtZXRhfSlcbiAgICAgICAgICB2YXIgZXZlbnRSZXFSZXN1bHQgPSBhd2FpdCBuZXRDbGllbnRQYWNrYWdlLmVtaXQoJ2FwaVJlcXVlc3QnLCB7ZGF0YSwgbWV0YX0sIG1ldGEpXG4gICAgICAgICAgaWYgKCFzZXJ2aWNlTWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXS5zdHJlYW0pIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VNZXRob2RzW21ldGhvZE5hbWVdKGV2ZW50UmVxUmVzdWx0IHx8IGRhdGEsIG1ldGEpXG4gICAgICAgICAgICB2YXIgZXZlbnRSZXNSZXN1bHQgPSBhd2FpdCBuZXRDbGllbnRQYWNrYWdlLmVtaXQoJ2FwaVJlc3BvbnNlJywge3Jlc3BvbnNlLCBtZXRhfSwgbWV0YSlcbiAgICAgICAgICAgIHJlcy5zZW5kKGV2ZW50UmVzUmVzdWx0IHx8IHJlc3BvbnNlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTVFJFQU1cbiAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9ldmVudC1zdHJlYW0nLFxuICAgICAgICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZScsXG4gICAgICAgICAgICAgICdDb25uZWN0aW9uJzogJ2tlZXAtYWxpdmUnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdmFyIHN0cmVhbSA9IHtcbiAgICAgICAgICAgICAgd3JpdGU6IChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlKCdkYXRhOiAnICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkgKyAnXFxuXFxuJylcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmVzLFxuICAgICAgICAgICAgICByZXFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlcnZpY2VNZXRob2RzW21ldGhvZE5hbWVdKGV2ZW50UmVxUmVzdWx0IHx8IGRhdGEsIG1ldGEsIHN0cmVhbSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgQ09OU09MRS53YXJuKCdBcGkgZXJyb3InLCB7ZXJyb3J9KVxuICAgICAgICAgIHJlcy5zZW5kKHtlcnJvcn0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBodHRwU2VydmVyID0gaHR0cEFwaS5vbignY29ubmVjdGlvbicsIGZ1bmN0aW9uIChzb2NrZXQpIHtcbiAgICAgICAgc29ja2V0LnNldFRpbWVvdXQoNjAwMDApXG4gICAgICB9KS5saXN0ZW4oaHR0cFBvcnQpXG4gICAgICBDT05TT0xFLmRlYnVnKCdodHRwIEFwaSBsaXN0ZW5pbmcgb24gcG9ydCcgKyBodHRwUG9ydClcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0LFxuICAgICAgc3RvcCAoKSB7XG4gICAgICAgIGh0dHBTZXJ2ZXIuY2xvc2UoKVxuICAgICAgfSxcbiAgICAgIGh0dHBhcnQgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKHN0YXJ0KVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnJvclRocm93KCdnZXRIdHRwQXBpUGFja2FnZScsIHtlcnJvcn0pXG4gIH1cbn1cblxuLy8ge1xuXG4vLyB9XG4iXX0=