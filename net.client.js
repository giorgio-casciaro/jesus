'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var PACKAGE = 'net.client';
var checkRequired = require('./jesus').checkRequired;
var R = require('ramda');
var preferedTransports = ['grpc', 'zeromq', 'http'];
// var delayedMessages = global.JESUS_NET_CLIENT_delayedMessages = global.JESUS_NET_CLIENT_delayedMessages || {}

module.exports = function getNetClientPackage(_ref) {
  var _this = this;

  var getConsole = _ref.getConsole,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      getSharedConfig = _ref.getSharedConfig,
      config = _ref.config;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  try {
    var getTrans;

    var _ret = function () {
      // function filterByTag (tags) {
      //   return (tagFilter) => {
      //     if (tagFilter)CONSOLE.debug(`filterByTag()`, tags.indexOf(tagFilter) + 1)
      //     return !tags || !tagFilter ? true : tags.indexOf(tagFilter) + 1
      //   }
      // }

      var emit = function _callee2(_ref2) {
        var event = _ref2.event,
            _ref2$data = _ref2.data,
            data = _ref2$data === undefined ? {} : _ref2$data,
            _ref2$meta = _ref2.meta,
            meta = _ref2$meta === undefined ? {} : _ref2$meta,
            _ref2$timeout = _ref2.timeout,
            timeout = _ref2$timeout === undefined ? 5000 : _ref2$timeout,
            _ref2$singleResponse = _ref2.singleResponse,
            singleResponse = _ref2$singleResponse === undefined ? true : _ref2$singleResponse;
        var eventConfig, responses;
        return regeneratorRuntime.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                meta.event = event;
                _context2.next = 3;
                return regeneratorRuntime.awrap(getServicesEventsConfigByEventName(event));

              case 3:
                eventConfig = _context2.sent;

                CONSOLE.debug('emit start ' + event, { singleResponse: singleResponse, event: event, data: data, meta: meta, timeout: timeout, eventConfig: eventConfig });
                _context2.next = 7;
                return regeneratorRuntime.awrap(Promise.all(eventConfig.map(function (rpcConfig) {
                  return rpc({ to: rpcConfig.to, method: rpcConfig.method, data: data, meta: meta, timeout: timeout, log: false });
                })));

              case 7:
                responses = _context2.sent;

                responses = responses.filter(function (response) {
                  return response !== null;
                });
                if (singleResponse) responses = responses[0] || null;
                CONSOLE.debug('emit response' + event, { responses: responses, event: event, eventConfig: eventConfig });
                return _context2.abrupt('return', responses);

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, null, this);
      };

      var rpc = function _callee3(_ref3) {
        var to = _ref3.to,
            method = _ref3.method,
            _ref3$data = _ref3.data,
            data = _ref3$data === undefined ? {} : _ref3$data,
            _ref3$meta = _ref3.meta,
            meta = _ref3$meta === undefined ? {} : _ref3$meta,
            _ref3$timeout = _ref3.timeout,
            timeout = _ref3$timeout === undefined ? 5000 : _ref3$timeout;
        var senderNetConfig, listenerNetConfig, listenerMethodsConfig, listenerMethodConfig, commonTransports, transport, sendTo, waitResponse, isStream, meta, message, response;
        return regeneratorRuntime.async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;

                CONSOLE.debug('rpc() start', { to: to, method: method, data: data, meta: meta, timeout: timeout });
                _context3.next = 4;
                return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'net'));

              case 4:
                senderNetConfig = _context3.sent;
                _context3.next = 7;
                return regeneratorRuntime.awrap(getSharedConfig(to, 'net'));

              case 7:
                listenerNetConfig = _context3.sent;
                _context3.next = 10;
                return regeneratorRuntime.awrap(getSharedConfig(to, 'methods'));

              case 10:
                listenerMethodsConfig = _context3.sent;
                listenerMethodConfig = listenerMethodsConfig[method];

                if (listenerMethodsConfig[method]) {
                  _context3.next = 14;
                  break;
                }

                throw new Error(method + ' is not valid (not defined in listener methods config)');

              case 14:
                commonTransports = Object.keys(senderNetConfig.transports).filter(function (value) {
                  return 1 + Object.keys(listenerNetConfig.transports).indexOf(value);
                });

                CONSOLE.debug('commonTransports', commonTransports, Object.keys(senderNetConfig.transports), Object.keys(listenerNetConfig.transports));

                if (commonTransports.length) {
                  _context3.next = 18;
                  break;
                }

                throw new Error('service ' + to + ' and service ' + serviceName + ' have no common transports');

              case 18:
                commonTransports.sort(function (a, b) {
                  return preferedTransports.indexOf(b) - preferedTransports.indexOf(a);
                }); // listenerMethod preferedTransports

                CONSOLE.debug('rpc commonTransports', { commonTransports: commonTransports, first: commonTransports[0] });
                transport = getTrans(commonTransports[0]);
                sendTo = listenerNetConfig.transports[commonTransports[0]];
                waitResponse = listenerMethodConfig.responseType !== 'noResponse';
                isStream = listenerMethodConfig.responseType === 'stream';
                meta = R.clone(meta);

                meta.reqOutTimestamp = Date.now();
                meta.from = serviceName;
                meta.stream = isStream;
                meta.to = to;
                message = { method: method, meta: meta, data: data };

                // if streaming return eventEmiter con on data,on error,on end altrimenti risposta

                CONSOLE.log('=> CLIENT OUT STREAM', { to: sendTo, message: message, waitResponse: waitResponse });
                _context3.next = 33;
                return regeneratorRuntime.awrap(transport.send(sendTo, message, listenerMethodConfig.timeout, waitResponse, isStream));

              case 33:
                response = _context3.sent;

                CONSOLE.log('=> CLIENT IN STREAM RESPONSE', { response: response });
                // if (singleResponse && response && response[0])response = response[0]
                CONSOLE.debug('rpc to ' + to + ' ' + method + ' corrid:' + meta.corrid, JSON.stringify({ response: response, sendTo: sendTo, message: message, waitResponse: waitResponse }));
                return _context3.abrupt('return', response);

              case 39:
                _context3.prev = 39;
                _context3.t0 = _context3['catch'](0);

                CONSOLE.error(_context3.t0, { to: to, method: method, data: data, meta: meta, timeout: timeout });
                throw new Error('Error during rpc');

              case 43:
              case 'end':
                return _context3.stop();
            }
          }
        }, null, this, [[0, 39]]);
      };

      checkRequired({ getSharedConfig: getSharedConfig, config: config });

      getTrans = function getTrans(transportName) {
        return require('./transports/' + transportName + '.client')({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId });
      };
      // var defaultEventEmit = require('./default.event.emit.json')

      var getServicesEventsConfigByEventName = function _callee(event) {
        var configs, eventConfig;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return regeneratorRuntime.awrap(getSharedConfig('*', 'events.listen', serviceName));

              case 2:
                configs = _context.sent;
                eventConfig = [];

                configs.forEach(function (config) {
                  Object.keys(config).forEach(function (eventName) {
                    if (event === eventName || eventName === '*') eventConfig.push({ to: config.serviceName, method: config[eventName].method, event: config[eventName], eventName: eventName });
                  });
                });
                return _context.abrupt('return', eventConfig);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, null, _this);
      };
      return {
        v: {
          rpc: rpc, emit: emit
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    CONSOLE.error(error, { config: config });
    throw new Error('Error during getNetClientPackage');
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicmVxdWlyZSIsIlIiLCJwcmVmZXJlZFRyYW5zcG9ydHMiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0TmV0Q2xpZW50UGFja2FnZSIsImdldENvbnNvbGUiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsImNvbmZpZyIsIkNPTlNPTEUiLCJnZXRUcmFucyIsImVtaXQiLCJldmVudCIsImRhdGEiLCJtZXRhIiwidGltZW91dCIsInNpbmdsZVJlc3BvbnNlIiwiZ2V0U2VydmljZXNFdmVudHNDb25maWdCeUV2ZW50TmFtZSIsImV2ZW50Q29uZmlnIiwiZGVidWciLCJQcm9taXNlIiwiYWxsIiwibWFwIiwicnBjQ29uZmlnIiwicnBjIiwidG8iLCJtZXRob2QiLCJsb2ciLCJyZXNwb25zZXMiLCJmaWx0ZXIiLCJyZXNwb25zZSIsInNlbmRlck5ldENvbmZpZyIsImxpc3RlbmVyTmV0Q29uZmlnIiwibGlzdGVuZXJNZXRob2RzQ29uZmlnIiwibGlzdGVuZXJNZXRob2RDb25maWciLCJFcnJvciIsImNvbW1vblRyYW5zcG9ydHMiLCJPYmplY3QiLCJrZXlzIiwidHJhbnNwb3J0cyIsInZhbHVlIiwiaW5kZXhPZiIsImxlbmd0aCIsInNvcnQiLCJhIiwiYiIsImZpcnN0IiwidHJhbnNwb3J0Iiwic2VuZFRvIiwid2FpdFJlc3BvbnNlIiwicmVzcG9uc2VUeXBlIiwiaXNTdHJlYW0iLCJjbG9uZSIsInJlcU91dFRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJmcm9tIiwic3RyZWFtIiwibWVzc2FnZSIsInNlbmQiLCJjb3JyaWQiLCJKU09OIiwic3RyaW5naWZ5IiwiZXJyb3IiLCJ0cmFuc3BvcnROYW1lIiwiY29uZmlncyIsImZvckVhY2giLCJldmVudE5hbWUiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsVUFBVSxZQUFo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U0FBVixJQUF1QkEsY0FBYyxHQUF6QyxFQUE2Q2pELFlBQVlrRCxJQUFaLENBQWlCLEVBQUMzQyxJQUFJakIsT0FBT0gsV0FBWixFQUF5QnFCLFFBQVFsQixPQUFPMkQsU0FBUCxFQUFrQnpDLE1BQW5ELEVBQTJEZCxPQUFPSixPQUFPMkQsU0FBUCxDQUFsRSxFQUFxRkEsb0JBQXJGLEVBQWpCO0FBQzlDLG1CQUZEO0FBR0QsaUJBSkQ7QUFIeUMsaURBUWxDakQsV0FSa0M7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBM0M7QUFvRUE7QUFBQSxXQUFPO0FBQ0xNLGtCQURLLEVBQ0FiO0FBREE7QUFBUDtBQXpFRTs7QUFBQTtBQTRFSCxHQTVFRCxDQTRFRSxPQUFPb0QsS0FBUCxFQUFjO0FBQ2R0RCxZQUFRc0QsS0FBUixDQUFjQSxLQUFkLEVBQXFCLEVBQUN2RCxjQUFELEVBQXJCO0FBQ0EsVUFBTSxJQUFJMkIsS0FBSixDQUFVLGtDQUFWLENBQU47QUFDRDtBQUNGLENBbEZEIiwiZmlsZSI6Im5ldC5jbGllbnQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUEFDS0FHRSA9ICduZXQuY2xpZW50J1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIHByZWZlcmVkVHJhbnNwb3J0cyA9IFsnZ3JwYycsICd6ZXJvbXEnLCAnaHR0cCddXG4vLyB2YXIgZGVsYXllZE1lc3NhZ2VzID0gZ2xvYmFsLkpFU1VTX05FVF9DTElFTlRfZGVsYXllZE1lc3NhZ2VzID0gZ2xvYmFsLkpFU1VTX05FVF9DTElFTlRfZGVsYXllZE1lc3NhZ2VzIHx8IHt9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TmV0Q2xpZW50UGFja2FnZSAoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnLCBnZXRTaGFyZWRDb25maWcsIGNvbmZpZ30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7Z2V0U2hhcmVkQ29uZmlnLCBjb25maWd9KVxuICAgIHZhciBnZXRUcmFucyA9ICh0cmFuc3BvcnROYW1lKSA9PiByZXF1aXJlKGAuL3RyYW5zcG9ydHMvJHt0cmFuc3BvcnROYW1lfS5jbGllbnRgKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZH0pXG4gICAgLy8gdmFyIGRlZmF1bHRFdmVudEVtaXQgPSByZXF1aXJlKCcuL2RlZmF1bHQuZXZlbnQuZW1pdC5qc29uJylcblxuICAgIGNvbnN0IGdldFNlcnZpY2VzRXZlbnRzQ29uZmlnQnlFdmVudE5hbWUgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgIHZhciBjb25maWdzID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKCcqJywgJ2V2ZW50cy5saXN0ZW4nLCBzZXJ2aWNlTmFtZSlcbiAgICAgIHZhciBldmVudENvbmZpZyA9IFtdXG4gICAgICBjb25maWdzLmZvckVhY2goY29uZmlnID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMoY29uZmlnKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50ID09PSBldmVudE5hbWUgfHwgZXZlbnROYW1lID09PSAnKicpZXZlbnRDb25maWcucHVzaCh7dG86IGNvbmZpZy5zZXJ2aWNlTmFtZSwgbWV0aG9kOiBjb25maWdbZXZlbnROYW1lXS5tZXRob2QsIGV2ZW50OiBjb25maWdbZXZlbnROYW1lXSwgZXZlbnROYW1lfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICByZXR1cm4gZXZlbnRDb25maWdcbiAgICB9XG4gICAgLy8gZnVuY3Rpb24gZmlsdGVyQnlUYWcgKHRhZ3MpIHtcbiAgICAvLyAgIHJldHVybiAodGFnRmlsdGVyKSA9PiB7XG4gICAgLy8gICAgIGlmICh0YWdGaWx0ZXIpQ09OU09MRS5kZWJ1ZyhgZmlsdGVyQnlUYWcoKWAsIHRhZ3MuaW5kZXhPZih0YWdGaWx0ZXIpICsgMSlcbiAgICAvLyAgICAgcmV0dXJuICF0YWdzIHx8ICF0YWdGaWx0ZXIgPyB0cnVlIDogdGFncy5pbmRleE9mKHRhZ0ZpbHRlcikgKyAxXG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZW1pdCAoe2V2ZW50LCBkYXRhID0ge30sIG1ldGEgPSB7fSwgdGltZW91dCA9IDUwMDAsIHNpbmdsZVJlc3BvbnNlID0gdHJ1ZX0pIHtcbiAgICAgIG1ldGEuZXZlbnQgPSBldmVudFxuICAgICAgdmFyIGV2ZW50Q29uZmlnID0gYXdhaXQgZ2V0U2VydmljZXNFdmVudHNDb25maWdCeUV2ZW50TmFtZShldmVudClcbiAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgc3RhcnQgJyArIGV2ZW50LCB7c2luZ2xlUmVzcG9uc2UsIGV2ZW50LCBkYXRhLCBtZXRhLCB0aW1lb3V0LCBldmVudENvbmZpZ30pXG4gICAgICB2YXIgcmVzcG9uc2VzID0gYXdhaXQgUHJvbWlzZS5hbGwoZXZlbnRDb25maWcubWFwKChycGNDb25maWcpID0+IHJwYyh7dG86IHJwY0NvbmZpZy50bywgbWV0aG9kOiBycGNDb25maWcubWV0aG9kLCBkYXRhLCBtZXRhLCB0aW1lb3V0LCBsb2c6IGZhbHNlIH0pKSlcbiAgICAgIHJlc3BvbnNlcyA9IHJlc3BvbnNlcy5maWx0ZXIoKHJlc3BvbnNlKSA9PiByZXNwb25zZSAhPT0gbnVsbClcbiAgICAgIGlmIChzaW5nbGVSZXNwb25zZSlyZXNwb25zZXMgPSByZXNwb25zZXNbMF0gfHwgbnVsbFxuICAgICAgQ09OU09MRS5kZWJ1ZygnZW1pdCByZXNwb25zZScgKyBldmVudCwge3Jlc3BvbnNlcywgZXZlbnQsIGV2ZW50Q29uZmlnfSlcbiAgICAgIHJldHVybiByZXNwb25zZXNcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBycGMgKHt0bywgbWV0aG9kLCBkYXRhID0ge30sIG1ldGEgPSB7fSwgdGltZW91dCA9IDUwMDAsIH0pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3JwYygpIHN0YXJ0Jywge3RvLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXQgfSlcbiAgICAgICAgdmFyIHNlbmRlck5ldENvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ25ldCcpXG4gICAgICAgIHZhciBsaXN0ZW5lck5ldENvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZyh0bywgJ25ldCcpXG4gICAgICAgIHZhciBsaXN0ZW5lck1ldGhvZHNDb25maWcgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcodG8sICdtZXRob2RzJylcbiAgICAgICAgdmFyIGxpc3RlbmVyTWV0aG9kQ29uZmlnID0gbGlzdGVuZXJNZXRob2RzQ29uZmlnW21ldGhvZF1cblxuICAgICAgICBpZiAoIWxpc3RlbmVyTWV0aG9kc0NvbmZpZ1ttZXRob2RdKSB0aHJvdyBuZXcgRXJyb3IobWV0aG9kICsgJyBpcyBub3QgdmFsaWQgKG5vdCBkZWZpbmVkIGluIGxpc3RlbmVyIG1ldGhvZHMgY29uZmlnKScpXG5cbiAgICAgICAgdmFyIGNvbW1vblRyYW5zcG9ydHMgPSBPYmplY3Qua2V5cyhzZW5kZXJOZXRDb25maWcudHJhbnNwb3J0cykuZmlsdGVyKCh2YWx1ZSkgPT4gMSArIE9iamVjdC5rZXlzKGxpc3RlbmVyTmV0Q29uZmlnLnRyYW5zcG9ydHMpLmluZGV4T2YodmFsdWUpKVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdjb21tb25UcmFuc3BvcnRzJywgY29tbW9uVHJhbnNwb3J0cywgT2JqZWN0LmtleXMoc2VuZGVyTmV0Q29uZmlnLnRyYW5zcG9ydHMpLCBPYmplY3Qua2V5cyhsaXN0ZW5lck5ldENvbmZpZy50cmFuc3BvcnRzKSlcbiAgICAgICAgaWYgKCFjb21tb25UcmFuc3BvcnRzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKGBzZXJ2aWNlICR7dG99IGFuZCBzZXJ2aWNlICR7c2VydmljZU5hbWV9IGhhdmUgbm8gY29tbW9uIHRyYW5zcG9ydHNgKVxuICAgICAgICBjb21tb25UcmFuc3BvcnRzLnNvcnQoKGEsIGIpID0+IHByZWZlcmVkVHJhbnNwb3J0cy5pbmRleE9mKGIpIC0gcHJlZmVyZWRUcmFuc3BvcnRzLmluZGV4T2YoYSkpLy8gbGlzdGVuZXJNZXRob2QgcHJlZmVyZWRUcmFuc3BvcnRzXG5cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygncnBjIGNvbW1vblRyYW5zcG9ydHMnLCB7Y29tbW9uVHJhbnNwb3J0cywgZmlyc3Q6IGNvbW1vblRyYW5zcG9ydHNbMF19KVxuICAgICAgICB2YXIgdHJhbnNwb3J0ID0gZ2V0VHJhbnMoY29tbW9uVHJhbnNwb3J0c1swXSlcblxuICAgICAgICB2YXIgc2VuZFRvID0gbGlzdGVuZXJOZXRDb25maWcudHJhbnNwb3J0c1tjb21tb25UcmFuc3BvcnRzWzBdXVxuICAgICAgICB2YXIgd2FpdFJlc3BvbnNlID0gKGxpc3RlbmVyTWV0aG9kQ29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ25vUmVzcG9uc2UnKVxuICAgICAgICB2YXIgaXNTdHJlYW0gPSAobGlzdGVuZXJNZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAnc3RyZWFtJylcbiAgICAgICAgdmFyIG1ldGEgPSBSLmNsb25lKG1ldGEpXG4gICAgICAgIG1ldGEucmVxT3V0VGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgICAgICBtZXRhLmZyb20gPSBzZXJ2aWNlTmFtZVxuICAgICAgICBtZXRhLnN0cmVhbSA9IGlzU3RyZWFtXG4gICAgICAgIG1ldGEudG8gPSB0b1xuICAgICAgICB2YXIgbWVzc2FnZSA9IHttZXRob2QsIG1ldGEsIGRhdGF9XG5cbiAgICAgICAgICAvLyBpZiBzdHJlYW1pbmcgcmV0dXJuIGV2ZW50RW1pdGVyIGNvbiBvbiBkYXRhLG9uIGVycm9yLG9uIGVuZCBhbHRyaW1lbnRpIHJpc3Bvc3RhXG4gICAgICAgIENPTlNPTEUubG9nKCc9PiBDTElFTlQgT1VUIFNUUkVBTScsIHt0bzogc2VuZFRvLCBtZXNzYWdlLCB3YWl0UmVzcG9uc2V9KVxuICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCB0cmFuc3BvcnQuc2VuZChzZW5kVG8sIG1lc3NhZ2UsIGxpc3RlbmVyTWV0aG9kQ29uZmlnLnRpbWVvdXQsIHdhaXRSZXNwb25zZSwgaXNTdHJlYW0pXG4gICAgICAgIENPTlNPTEUubG9nKCc9PiBDTElFTlQgSU4gU1RSRUFNIFJFU1BPTlNFJywge3Jlc3BvbnNlfSlcbiAgICAgICAgICAvLyBpZiAoc2luZ2xlUmVzcG9uc2UgJiYgcmVzcG9uc2UgJiYgcmVzcG9uc2VbMF0pcmVzcG9uc2UgPSByZXNwb25zZVswXVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdycGMgdG8gJyArIHRvICsgJyAnICsgbWV0aG9kICsgJyBjb3JyaWQ6JyArIG1ldGEuY29ycmlkLCBKU09OLnN0cmluZ2lmeSh7cmVzcG9uc2UsIHNlbmRUbywgbWVzc2FnZSwgd2FpdFJlc3BvbnNlfSkpXG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgQ09OU09MRS5lcnJvcihlcnJvciwge3RvLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXR9KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBycGMnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgcnBjLCBlbWl0XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtjb25maWd9KVxuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgZHVyaW5nIGdldE5ldENsaWVudFBhY2thZ2UnKVxuICB9XG59XG4iXX0=