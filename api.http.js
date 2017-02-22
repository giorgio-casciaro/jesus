'use strict';

var express = require('express-http2');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var netClient = require('./net.client');
var PACKAGE = 'api.http';

var checkRequired = require('./jesus').checkRequired;
var checkRequiredFiles = require('./jesus').checkRequiredFiles;

module.exports = function getHttpApiPackage(_ref) {
  var serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      _ref$publicOnly = _ref.publicOnly,
      publicOnly = _ref$publicOnly === undefined ? true : _ref$publicOnly,
      _ref$httpPort = _ref.httpPort,
      httpPort = _ref$httpPort === undefined ? 80 : _ref$httpPort,
      serviceMethodsFile = _ref.serviceMethodsFile,
      sharedServicePath = _ref.sharedServicePath,
      sharedServicesPath = _ref.sharedServicesPath;

  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);
  try {
    checkRequired({ serviceName: serviceName, serviceId: serviceId, serviceMethodsFile: serviceMethodsFile, sharedServicePath: sharedServicePath, sharedServicesPath: sharedServicesPath });
    checkRequiredFiles([sharedServicePath + '/methods.json']);
    var LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE);
    var netClientPackage = netClient({ sharedServicesPath: sharedServicesPath, sharedServicePath: sharedServicePath, serviceName: serviceName, serviceId: serviceId });
    var httpApi;
    var httpServer;
    return {
      start: function start() {
        var _this = this;

        return regeneratorRuntime.async(function start$(_context2) {
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
                          serviceMethods = require(serviceMethodsFile);
                          serviceMethodsConfig = require(sharedServicePath + '/methods.json');

                          LOG.debug('serviceMethodsConfig', { sharedServicePath: sharedServicePath, serviceMethodsConfig: serviceMethodsConfig });
                          if (!serviceMethodsConfig[methodName]) errorThrow(methodName + ' is not valid (not defined in methods.json)');
                          if (!serviceMethodsConfig[methodName].public && publicOnly) errorThrow(methodName + ' is not public');
                          if (!serviceMethods[methodName]) errorThrow(methodName + ' is not valid (not defined service methods.js file)');
                          data = req.body || req.query;
                          meta = {
                            type: 'apiRequest',
                            methodName: methodName,
                            ip: req.ip,
                            headers: req.headers,
                            timestamp: Date.now() / 1000
                          };

                          LOG.debug('Api request ' + methodName, { methodName: methodName, httpPort: httpPort, serviceMethodsFile: serviceMethodsFile, data: data, meta: meta });
                          _context.next = 13;
                          return regeneratorRuntime.awrap(netClientPackage.emit('apiRequest', { data: data, meta: meta }));

                        case 13:
                          eventReqResult = _context.sent;

                          if (serviceMethodsConfig[methodName].stream) {
                            _context.next = 24;
                            break;
                          }

                          _context.next = 17;
                          return regeneratorRuntime.awrap(serviceMethods[methodName](eventReqResult || data, meta));

                        case 17:
                          response = _context.sent;
                          _context.next = 20;
                          return regeneratorRuntime.awrap(netClientPackage.emit('apiResponse', { response: response, meta: meta }));

                        case 20:
                          eventResResult = _context.sent;

                          res.send(eventResResult || response);
                          _context.next = 28;
                          break;

                        case 24:
                          // STREAM
                          res.writeHead(200, {
                            'Content-Type': 'text/event-stream',
                            'Cache-Control': 'no-cache',
                            'Connection': 'keep-alive'
                          });
                          stream = { write: function write(data) {
                              res.write('data: ' + JSON.stringify(data) + '\n\n');
                            }, close: res.close };
                          _context.next = 28;
                          return regeneratorRuntime.awrap(serviceMethods[methodName](eventReqResult || data, meta, stream));

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
                httpServer = httpApi.listen(httpPort);
                LOG.debug('http Api listening on port' + httpPort);

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, null, this);
      },
      stop: function stop() {
        httpServer.close();
      },
      httpart: function httpart() {
        httpServer.close(start);
      }
    };
  } catch (error) {
    errorThrow('getHttpApiPackage', { error: error });
  }
};

// {

// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5odHRwLmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJjb21wcmVzc2lvbiIsImhlbG1ldCIsIm5ldENsaWVudCIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwiY2hlY2tSZXF1aXJlZEZpbGVzIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEh0dHBBcGlQYWNrYWdlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwdWJsaWNPbmx5IiwiaHR0cFBvcnQiLCJzZXJ2aWNlTWV0aG9kc0ZpbGUiLCJzaGFyZWRTZXJ2aWNlUGF0aCIsInNoYXJlZFNlcnZpY2VzUGF0aCIsImVycm9yVGhyb3ciLCJMT0ciLCJuZXRDbGllbnRQYWNrYWdlIiwiaHR0cEFwaSIsImh0dHBTZXJ2ZXIiLCJzdGFydCIsInVzZSIsImxldmVsIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImFsbCIsInJlcSIsInJlcyIsIm1ldGhvZE5hbWUiLCJ1cmwiLCJyZXBsYWNlIiwic2VydmljZU1ldGhvZHMiLCJzZXJ2aWNlTWV0aG9kc0NvbmZpZyIsImRlYnVnIiwicHVibGljIiwiZGF0YSIsImJvZHkiLCJxdWVyeSIsIm1ldGEiLCJ0eXBlIiwiaXAiLCJoZWFkZXJzIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsImVtaXQiLCJldmVudFJlcVJlc3VsdCIsInN0cmVhbSIsInJlc3BvbnNlIiwiZXZlbnRSZXNSZXN1bHQiLCJzZW5kIiwid3JpdGVIZWFkIiwid3JpdGUiLCJKU09OIiwic3RyaW5naWZ5IiwiY2xvc2UiLCJ3YXJuIiwiZXJyb3IiLCJsaXN0ZW4iLCJzdG9wIiwiaHR0cGFydCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLGVBQVIsQ0FBZDtBQUNBLElBQUlDLGFBQWFELFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQUlFLGNBQWNGLFFBQVEsYUFBUixDQUFsQjtBQUNBLElBQUlHLFNBQVNILFFBQVEs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QUFmLEVBQTJCa0Isa0JBQWtCWCxJQUE3QyxFQUFtREcsSUFBbkQsRUFBeURTLE1BQXpELENBakNLOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBb0NiaEMsOEJBQUl5QyxJQUFKLENBQVMsV0FBVCxFQUFzQixFQUFDQyxrQkFBRCxFQUF0QjtBQUNBOUIsOEJBQUl1QixJQUFKLENBQVMsRUFBQ08sa0JBQUQsRUFBVDs7QUFyQ2E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQWpCO0FBd0NBdkMsNkJBQWFELFFBQVF5QyxNQUFSLENBQWVoRCxRQUFmLENBQWI7QUFDQUssb0JBQUlrQixLQUFKLENBQVUsK0JBQStCdkIsUUFBekM7O0FBaERHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBa0RMaUQsVUFsREssa0JBa0RHO0FBQ056QyxtQkFBV3FDLEtBQVg7QUFDRCxPQXBESTtBQXFETEssYUFyREsscUJBcURNO0FBQ1QxQyxtQkFBV3FDLEtBQVgsQ0FBaUJwQyxLQUFqQjtBQUNEO0FBdkRJLEtBQVA7QUF5REQsR0FoRUQsQ0FnRUUsT0FBT3NDLEtBQVAsRUFBYztBQUNkM0MsZUFBVyxtQkFBWCxFQUFnQyxFQUFDMkMsWUFBRCxFQUFoQztBQUNEO0FBQ0YsQ0FyRUQ7O0FBdUVBOztBQUVBIiwiZmlsZSI6ImFwaS5odHRwLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcy1odHRwMicpXG52YXIgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2JvZHktcGFyc2VyJylcbnZhciBjb21wcmVzc2lvbiA9IHJlcXVpcmUoJ2NvbXByZXNzaW9uJylcbnZhciBoZWxtZXQgPSByZXF1aXJlKCdoZWxtZXQnKVxuY29uc3QgbmV0Q2xpZW50ID0gcmVxdWlyZSgnLi9uZXQuY2xpZW50JylcbmNvbnN0IFBBQ0tBR0UgPSAnYXBpLmh0dHAnXG5cbnZhciBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbnZhciBjaGVja1JlcXVpcmVkRmlsZXMgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZEZpbGVzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0SHR0cEFwaVBhY2thZ2UgKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwdWJsaWNPbmx5ID0gdHJ1ZSwgaHR0cFBvcnQgPSA4MCwgc2VydmljZU1ldGhvZHNGaWxlLCBzaGFyZWRTZXJ2aWNlUGF0aCwgc2hhcmVkU2VydmljZXNQYXRofSkge1xuICB2YXIgZXJyb3JUaHJvdyA9IHJlcXVpcmUoJy4vamVzdXMnKS5lcnJvclRocm93KHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgc2VydmljZU1ldGhvZHNGaWxlLCBzaGFyZWRTZXJ2aWNlUGF0aCwgc2hhcmVkU2VydmljZXNQYXRofSlcbiAgICBjaGVja1JlcXVpcmVkRmlsZXMoW3NoYXJlZFNlcnZpY2VQYXRoICsgJy9tZXRob2RzLmpzb24nXSlcbiAgICB2YXIgTE9HID0gcmVxdWlyZSgnLi9qZXN1cycpLkxPRyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICAgIHZhciBuZXRDbGllbnRQYWNrYWdlID0gbmV0Q2xpZW50KHtzaGFyZWRTZXJ2aWNlc1BhdGgsIHNoYXJlZFNlcnZpY2VQYXRoLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkfSlcbiAgICB2YXIgaHR0cEFwaVxuICAgIHZhciBodHRwU2VydmVyXG4gICAgcmV0dXJuIHtcbiAgICAgIGFzeW5jICBzdGFydCAoKSB7XG4gICAgICAgIGh0dHBBcGkgPSBleHByZXNzKClcbiAgICAgICAgaHR0cEFwaS51c2UoaGVsbWV0KCkpXG4gICAgICAgIGh0dHBBcGkudXNlKGNvbXByZXNzaW9uKHtsZXZlbDogMX0pKVxuICAgICAgICBodHRwQXBpLnVzZShib2R5UGFyc2VyLmpzb24oKSkgLy8gc3VwcG9ydCBqc29uIGVuY29kZWQgYm9kaWVzXG4gICAgICAgIGh0dHBBcGkudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKSAvLyBzdXBwb3J0IGVuY29kZWQgYm9kaWVzXG4gICAgICAgIGh0dHBBcGkuYWxsKCcqJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gcmVxLnVybC5yZXBsYWNlKCcvJywgJycpXG4gICAgICAgICAgICB2YXIgc2VydmljZU1ldGhvZHMgPSByZXF1aXJlKHNlcnZpY2VNZXRob2RzRmlsZSlcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlTWV0aG9kc0NvbmZpZyA9IHJlcXVpcmUoc2hhcmVkU2VydmljZVBhdGggKyAnL21ldGhvZHMuanNvbicpXG4gICAgICAgICAgICBMT0cuZGVidWcoJ3NlcnZpY2VNZXRob2RzQ29uZmlnJywge3NoYXJlZFNlcnZpY2VQYXRoLCBzZXJ2aWNlTWV0aG9kc0NvbmZpZ30pXG4gICAgICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdKWVycm9yVGhyb3cobWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkIChub3QgZGVmaW5lZCBpbiBtZXRob2RzLmpzb24pJylcbiAgICAgICAgICAgIGlmICghc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV0ucHVibGljICYmIHB1YmxpY09ubHkpZXJyb3JUaHJvdyhtZXRob2ROYW1lICsgJyBpcyBub3QgcHVibGljJylcbiAgICAgICAgICAgIGlmICghc2VydmljZU1ldGhvZHNbbWV0aG9kTmFtZV0pZXJyb3JUaHJvdyhtZXRob2ROYW1lICsgJyBpcyBub3QgdmFsaWQgKG5vdCBkZWZpbmVkIHNlcnZpY2UgbWV0aG9kcy5qcyBmaWxlKScpXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJlcS5ib2R5IHx8IHJlcS5xdWVyeVxuICAgICAgICAgICAgdmFyIG1ldGEgPSB7XG4gICAgICAgICAgICAgIHR5cGU6ICdhcGlSZXF1ZXN0JyxcbiAgICAgICAgICAgICAgbWV0aG9kTmFtZSxcbiAgICAgICAgICAgICAgaXA6IHJlcS5pcCxcbiAgICAgICAgICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnMsXG4gICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAvIDEwMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIExPRy5kZWJ1ZygnQXBpIHJlcXVlc3QgJyArIG1ldGhvZE5hbWUsIHttZXRob2ROYW1lLCBodHRwUG9ydCwgc2VydmljZU1ldGhvZHNGaWxlLCBkYXRhLCBtZXRhfSlcbiAgICAgICAgICAgIHZhciBldmVudFJlcVJlc3VsdCA9IGF3YWl0IG5ldENsaWVudFBhY2thZ2UuZW1pdCgnYXBpUmVxdWVzdCcsIHtkYXRhLCBtZXRhfSlcbiAgICAgICAgICAgIGlmICghc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV0uc3RyZWFtKSB7XG4gICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGF3YWl0IHNlcnZpY2VNZXRob2RzW21ldGhvZE5hbWVdKGV2ZW50UmVxUmVzdWx0IHx8IGRhdGEsIG1ldGEpXG4gICAgICAgICAgICAgIHZhciBldmVudFJlc1Jlc3VsdCA9IGF3YWl0IG5ldENsaWVudFBhY2thZ2UuZW1pdCgnYXBpUmVzcG9uc2UnLCB7cmVzcG9uc2UsIG1ldGF9KVxuICAgICAgICAgICAgICByZXMuc2VuZChldmVudFJlc1Jlc3VsdCB8fCByZXNwb25zZSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIFNUUkVBTVxuICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9ldmVudC1zdHJlYW0nLFxuICAgICAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICAgICAgICAgICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJ1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB2YXIgc3RyZWFtID0ge3dyaXRlOiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZSgnZGF0YTogJyArIEpTT04uc3RyaW5naWZ5KGRhdGEpICsgJ1xcblxcbicpXG4gICAgICAgICAgICAgIH0sIGNsb3NlOiByZXMuY2xvc2V9XG4gICAgICAgICAgICAgIGF3YWl0IHNlcnZpY2VNZXRob2RzW21ldGhvZE5hbWVdKGV2ZW50UmVxUmVzdWx0IHx8IGRhdGEsIG1ldGEsIHN0cmVhbSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTE9HLndhcm4oJ0FwaSBlcnJvcicsIHtlcnJvcn0pXG4gICAgICAgICAgICByZXMuc2VuZCh7ZXJyb3J9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaHR0cFNlcnZlciA9IGh0dHBBcGkubGlzdGVuKGh0dHBQb3J0KVxuICAgICAgICBMT0cuZGVidWcoJ2h0dHAgQXBpIGxpc3RlbmluZyBvbiBwb3J0JyArIGh0dHBQb3J0KVxuICAgICAgfSxcbiAgICAgIHN0b3AgKCkge1xuICAgICAgICBodHRwU2VydmVyLmNsb3NlKClcbiAgICAgIH0sXG4gICAgICBodHRwYXJ0ICgpIHtcbiAgICAgICAgaHR0cFNlcnZlci5jbG9zZShzdGFydClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JUaHJvdygnZ2V0SHR0cEFwaVBhY2thZ2UnLCB7ZXJyb3J9KVxuICB9XG59XG5cbi8vIHtcblxuLy8gfVxuIl19