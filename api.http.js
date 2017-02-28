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
      getSharedConfig = _ref.getSharedConfig;

  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);
  try {
    var LOG;
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

                          LOG.debug('Api request ' + methodName + ' requestId:' + meta.requestId, { methodName: methodName, httpPort: httpPort, serviceMethods: serviceMethods, data: data, meta: meta });
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
                            res: res
                          };

                          serviceMethods[methodName](eventReqResult || data, meta, stream);

                        case 28:
                          _context.next = 34;
                          break;

                        case 30:
                          _context.prev = 30;
                          _context.t0 = _context['catch'](0);

                          LOG.warn('Api error', { error: _context.t0 });
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
                LOG.debug('http Api listening on port' + httpPort);

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, null, this);
      };

      checkRequired({ serviceName: serviceName, serviceId: serviceId, getMethods: getMethods, getSharedConfig: getSharedConfig });
      LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE);
      netClientPackage = netClient({ getSharedConfig: getSharedConfig, serviceName: serviceName, serviceId: serviceId });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5odHRwLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsIm5ldENsaWVudCIsInV1aWRWNCIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEh0dHBBcGlQYWNrYWdlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwdWJsaWNPbmx5IiwiaHR0cFBvcnQiLCJnZXRNZXRob2RzIiwiZ2V0U2hhcmVkQ29uZmlnIiwiZXJyb3JUaHJvdyIsIkxPRyIsIm5ldENsaWVudFBhY2thZ2UiLCJodHRwQXBpIiwiaHR0cFNlcnZlciIsInN0YXJ0IiwidXNlIiwibGV2ZWwiLCJqc29uIiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwiYWxsIiwicmVxIiwicmVzIiwibWV0aG9kTmFtZSIsInVybCIsInJlcGxhY2UiLCJzZXJ2aWNlTWV0aG9kcyIsInNlcnZpY2VNZXRob2RzQ29uZmlnIiwicHVibGljIiwiZGF0YSIsImJvZHkiLCJxdWVyeSIsIm1ldGEiLCJ0eXBlIiwicmVxdWVzdElkIiwiaGVhZGVycyIsInVzZXJJZCIsImlwIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsImRlYnVnIiwiZW1pdCIsImV2ZW50UmVxUmVzdWx0Iiwic3RyZWFtIiwicmVzcG9uc2UiLCJldmVudFJlc1Jlc3VsdCIsInNlbmQiLCJ3cml0ZUhlYWQiLCJ3cml0ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3YXJuIiwiZXJyb3IiLCJvbiIsInNvY2tldCIsInNldFRpbWVvdXQiLCJsaXN0ZW4iLCJzdG9wIiwiY2xvc2UiLCJodHRwYXJ0Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsVUFBVUMsUUFBUSxlQUFSLENBQWQ7QUFDQSxJQUFJQyxhQUFhRCxRQUFRLGFBQVIsQ0FBakI7QUFDQSxJQUFJRSxjQUFjRixRQUFRLGFBQVIsQ0FBbEI7QUFDQSxJQUFJRyxTQUFT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QUF5QixVQUFVQyxNQUFWLEVBQWtCO0FBQ3REQSx5QkFBT0MsVUFBUCxDQUFrQixLQUFsQjtBQUNELGlCQUZZLEVBRVZDLE1BRlUsQ0FFSG5ELFFBRkcsQ0FBYjtBQUdBSSxvQkFBSStCLEtBQUosQ0FBVSwrQkFBK0JuQyxRQUF6Qzs7QUFyREY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FORTs7QUFDRlAsb0JBQWMsRUFBQ0ksd0JBQUQsRUFBY0Msb0JBQWQsRUFBeUJHLHNCQUF6QixFQUFxQ0MsZ0NBQXJDLEVBQWQ7QUFDSUUsWUFBTWxCLFFBQVEsU0FBUixFQUFtQmtCLEdBQW5CLENBQXVCUCxXQUF2QixFQUFvQ0MsU0FBcEMsRUFBK0NOLE9BQS9DLENBRlI7QUFHRWEseUJBQW1CZixVQUFVLEVBQUNZLGdDQUFELEVBQWtCTCx3QkFBbEIsRUFBK0JDLG9CQUEvQixFQUFWLENBSHJCOztBQTZERjtBQUFBLFdBQU87QUFDTFUsc0JBREs7QUFFTDRDLGNBRkssa0JBRUc7QUFDTjdDLHVCQUFXOEMsS0FBWDtBQUNELFdBSkk7QUFLTEMsaUJBTEsscUJBS007QUFDVC9DLHVCQUFXOEMsS0FBWCxDQUFpQjdDLEtBQWpCO0FBQ0Q7QUFQSTtBQUFQO0FBN0RFOztBQUFBO0FBc0VILEdBdEVELENBc0VFLE9BQU91QyxLQUFQLEVBQWM7QUFDZDVDLGVBQVcsbUJBQVgsRUFBZ0MsRUFBQzRDLFlBQUQsRUFBaEM7QUFDRDtBQUNGLENBM0VEOztBQTZFQTs7QUFFQSIsImZpbGUiOiJhcGkuaHR0cC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MtaHR0cDInKVxudmFyIGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpXG52YXIgY29tcHJlc3Npb24gPSByZXF1aXJlKCdjb21wcmVzc2lvbicpXG52YXIgaGVsbWV0ID0gcmVxdWlyZSgnaGVsbWV0JylcbmNvbnN0IG5ldENsaWVudCA9IHJlcXVpcmUoJy4vbmV0LmNsaWVudCcpXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcbmNvbnN0IFBBQ0tBR0UgPSAnYXBpLmh0dHAnXG5cbnZhciBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRIdHRwQXBpUGFja2FnZSAoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHB1YmxpY09ubHkgPSB0cnVlLCBodHRwUG9ydCA9IDgwLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWd9KSB7XG4gIHZhciBlcnJvclRocm93ID0gcmVxdWlyZSgnLi9qZXN1cycpLmVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWd9KVxuICAgIHZhciBMT0cgPSByZXF1aXJlKCcuL2plc3VzJykuTE9HKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gICAgdmFyIG5ldENsaWVudFBhY2thZ2UgPSBuZXRDbGllbnQoe2dldFNoYXJlZENvbmZpZywgc2VydmljZU5hbWUsIHNlcnZpY2VJZH0pXG4gICAgdmFyIGh0dHBBcGlcbiAgICB2YXIgaHR0cFNlcnZlclxuICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAgICAgIGh0dHBBcGkgPSBleHByZXNzKClcbiAgICAgIGh0dHBBcGkudXNlKGhlbG1ldCgpKVxuICAgICAgaHR0cEFwaS51c2UoY29tcHJlc3Npb24oe2xldmVsOiAxfSkpXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLmpzb24oKSkgLy8gc3VwcG9ydCBqc29uIGVuY29kZWQgYm9kaWVzXG4gICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSkgLy8gc3VwcG9ydCBlbmNvZGVkIGJvZGllc1xuICAgICAgaHR0cEFwaS5hbGwoJyonLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IHJlcS51cmwucmVwbGFjZSgnLycsICcnKVxuICAgICAgICAgIHZhciBzZXJ2aWNlTWV0aG9kcyA9IGdldE1ldGhvZHMoKVxuICAgICAgICAgIHZhciBzZXJ2aWNlTWV0aG9kc0NvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ21ldGhvZHMnKVxuICAgICAgICAgIGlmICghc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV0pZXJyb3JUaHJvdyhtZXRob2ROYW1lICsgJyBpcyBub3QgdmFsaWQgKG5vdCBkZWZpbmVkIGluIG1ldGhvZHMgY29uZmlnKScpXG4gICAgICAgICAgaWYgKCFzZXJ2aWNlTWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXS5wdWJsaWMgJiYgcHVibGljT25seSllcnJvclRocm93KG1ldGhvZE5hbWUgKyAnIGlzIG5vdCBwdWJsaWMnKVxuICAgICAgICAgIGlmICghc2VydmljZU1ldGhvZHNbbWV0aG9kTmFtZV0pZXJyb3JUaHJvdyhtZXRob2ROYW1lICsgJyBpcyBub3QgdmFsaWQgKG5vdCBkZWZpbmVkIHNlcnZpY2UgbWV0aG9kcyBqcyBmaWxlKScpXG4gICAgICAgICAgdmFyIGRhdGEgPSByZXEuYm9keSB8fCByZXEucXVlcnlcbiAgICAgICAgICB2YXIgbWV0YSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcGlSZXF1ZXN0JyxcbiAgICAgICAgICAgIHJlcXVlc3RJZDogcmVxLmhlYWRlcnMucmVxdWVzdElkIHx8IHV1aWRWNCgpLFxuICAgICAgICAgICAgdXNlcklkOiBkYXRhLnVzZXJJZCxcbiAgICAgICAgICAgIG1ldGhvZE5hbWUsXG4gICAgICAgICAgICBpcDogcmVxLmlwLFxuICAgICAgICAgICAgLy8gaGVhZGVyczogcmVxLmhlYWRlcnMsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLyAxMDAwXG4gICAgICAgICAgfVxuICAgICAgICAgIExPRy5kZWJ1ZygnQXBpIHJlcXVlc3QgJyArIG1ldGhvZE5hbWUgKyAnIHJlcXVlc3RJZDonICsgbWV0YS5yZXF1ZXN0SWQsIHttZXRob2ROYW1lLCBodHRwUG9ydCwgc2VydmljZU1ldGhvZHMsIGRhdGEsIG1ldGF9KVxuICAgICAgICAgIHZhciBldmVudFJlcVJlc3VsdCA9IGF3YWl0IG5ldENsaWVudFBhY2thZ2UuZW1pdCgnYXBpUmVxdWVzdCcsIHtkYXRhLCBtZXRhfSwgbWV0YSlcbiAgICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdLnN0cmVhbSkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgc2VydmljZU1ldGhvZHNbbWV0aG9kTmFtZV0oZXZlbnRSZXFSZXN1bHQgfHwgZGF0YSwgbWV0YSlcbiAgICAgICAgICAgIHZhciBldmVudFJlc1Jlc3VsdCA9IGF3YWl0IG5ldENsaWVudFBhY2thZ2UuZW1pdCgnYXBpUmVzcG9uc2UnLCB7cmVzcG9uc2UsIG1ldGF9LCBtZXRhKVxuICAgICAgICAgICAgcmVzLnNlbmQoZXZlbnRSZXNSZXN1bHQgfHwgcmVzcG9uc2UpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNUUkVBTVxuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L2V2ZW50LXN0cmVhbScsXG4gICAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb24nOiAna2VlcC1hbGl2ZSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB2YXIgc3RyZWFtID0ge1xuICAgICAgICAgICAgICB3cml0ZTogKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICByZXMud3JpdGUoJ2RhdGE6ICcgKyBKU09OLnN0cmluZ2lmeShkYXRhKSArICdcXG5cXG4nKVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICByZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlcnZpY2VNZXRob2RzW21ldGhvZE5hbWVdKGV2ZW50UmVxUmVzdWx0IHx8IGRhdGEsIG1ldGEsIHN0cmVhbSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgTE9HLndhcm4oJ0FwaSBlcnJvcicsIHtlcnJvcn0pXG4gICAgICAgICAgcmVzLnNlbmQoe2Vycm9yfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGh0dHBTZXJ2ZXIgPSBodHRwQXBpLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24gKHNvY2tldCkge1xuICAgICAgICBzb2NrZXQuc2V0VGltZW91dCg2MDAwMClcbiAgICAgIH0pLmxpc3RlbihodHRwUG9ydClcbiAgICAgIExPRy5kZWJ1ZygnaHR0cCBBcGkgbGlzdGVuaW5nIG9uIHBvcnQnICsgaHR0cFBvcnQpXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdGFydCxcbiAgICAgIHN0b3AgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKClcbiAgICAgIH0sXG4gICAgICBodHRwYXJ0ICgpIHtcbiAgICAgICAgaHR0cFNlcnZlci5jbG9zZShzdGFydClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JUaHJvdygnZ2V0SHR0cEFwaVBhY2thZ2UnLCB7ZXJyb3J9KVxuICB9XG59XG5cbi8vIHtcblxuLy8gfVxuIl19