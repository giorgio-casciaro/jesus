'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var PACKAGE = 'net.client';
var checkRequired = require('./jesus').checkRequired;
var preferedTransports = ['grpc', 'zeromq', 'http'];
var delayedMessages = global.JESUS_NET_CLIENT_delayedMessages = global.JESUS_NET_CLIENT_delayedMessages || {};

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
      var filterByTag = function filterByTag(tags) {
        return function (tagFilter) {
          if (tagFilter) CONSOLE.debug('filterByTag()', tags.indexOf(tagFilter) + 1);
          return !tags || !tagFilter ? true : tags.indexOf(tagFilter) + 1;
        };
      };

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
            timeout = _ref3$timeout === undefined ? 5000 : _ref3$timeout,
            _ref3$delayed = _ref3.delayed,
            delayed = _ref3$delayed === undefined ? false : _ref3$delayed,
            _ref3$log = _ref3.log,
            log = _ref3$log === undefined ? true : _ref3$log,
            _ref3$logDelay = _ref3.logDelay,
            logDelay = _ref3$logDelay === undefined ? 5000 : _ref3$logDelay;
        var senderNetConfig, listenerNetConfig, listenerMethodsConfig, listenerMethodConfig, commonTransports, transport, sendTo, waitResponse, isStream, message, index, response;
        return regeneratorRuntime.async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;

                //if(log)rpc ({to:"logs", method:"log", data, meta, timeout, delayed:logDelay, log:false})
                CONSOLE.debug('rpc() start', { to: to, method: method, data: data, meta: meta, timeout: timeout, delayed: delayed });
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
                message = {
                  f: serviceName,
                  m: method,
                  d: [{ d: data, r: meta.corrid, u: meta.userid }]
                };

                if (!delayed) {
                  _context3.next = 30;
                  break;
                }

                index = to + method;

                if (!delayedMessages[index]) {
                  setTimeout(function () {
                    var delayedMessage = delayedMessages[index];
                    delete delayedMessages[index];
                    CONSOLE.log('=> CLIENT OUT', { to: sendTo, message: delayedMessage, waitResponse: waitResponse });
                    transport.send(sendTo, delayedMessage, listenerMethodConfig.timeout, waitResponse).then(function (response) {
                      return CONSOLE.log('=> CLIENT IN RESPONSE', { response: response });
                    });
                  }, delayed);
                  delayedMessages[index] = message;
                } else delayedMessages[index].d.push({ d: data, r: meta.corrid, u: meta.userid });
                _context3.next = 37;
                break;

              case 30:
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

              case 37:
                _context3.next = 43;
                break;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicmVxdWlyZSIsInByZWZlcmVkVHJhbnNwb3J0cyIsImRlbGF5ZWRNZXNzYWdlcyIsImdsb2JhbCIsIkpFU1VTX05FVF9DTElFTlRfZGVsYXllZE1lc3NhZ2VzIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldENsaWVudFBhY2thZ2UiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJnZXRTaGFyZWRDb25maWciLCJjb25maWciLCJDT05TT0xFIiwiZ2V0VHJhbnMiLCJmaWx0ZXJCeVRhZyIsInRhZ3MiLCJ0YWdGaWx0ZXIiLCJkZWJ1ZyIsImluZGV4T2YiLCJlbWl0IiwiZXZlbnQiLCJkYXRhIiwibWV0YSIsInRpbWVvdXQiLCJzaW5nbGVSZXNwb25zZSIsImdldFNlcnZpY2VzRXZlbnRzQ29uZmlnQnlFdmVudE5hbWUiLCJldmVudENvbmZpZyIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJycGNDb25maWciLCJycGMiLCJ0byIsIm1ldGhvZCIsImxvZyIsInJlc3BvbnNlcyIsImZpbHRlciIsInJlc3BvbnNlIiwiZGVsYXllZCIsImxvZ0RlbGF5Iiwic2VuZGVyTmV0Q29uZmlnIiwibGlzdGVuZXJOZXRDb25maWciLCJsaXN0ZW5lck1ldGhvZHNDb25maWciLCJsaXN0ZW5lck1ldGhvZENvbmZpZyIsIkVycm9yIiwiY29tbW9uVHJhbnNwb3J0cyIsIk9iamVjdCIsImtleXMiLCJ0cmFuc3BvcnRzIiwidmFsdWUiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmaXJzdCIsInRyYW5zcG9ydCIsInNlbmRUbyIsIndhaXRSZXNwb25zZSIsInJlc3BvbnNlVHlwZSIsImlzU3RyZWFtIiwibWVzc2FnZSIsImYiLCJtIiwiZCIsInIiLCJjb3JyaWQiLCJ1IiwidXNlcmlkIiwiaW5kZXgiLCJzZXRUaW1lb3V0IiwiZGVsYXllZE1lc3NhZ2UiLCJzZW5kIiwidGhlbiIsInB1c2giLCJKU09OIiwic3RyaW5naWZ5IiwiZXJyb3IiLCJ0cmFuc3BvcnROYW1lIiwiY29uZmlncyIsImZvckVhY2giLCJldmVudE5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFNQSxVQUFVLFlBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCQyxRQUFRLFNBQVIsRUFBbUJELGFBQXpDO0FBQ0EsSUFBSUUscUJBQXFCLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsTUFBbkIsQ0FBekI7QUFDQSxJQUFJQyxrQkFBa0JDLE9BQU9DLGdDQUFQLEdBQTBDRCxPQUFPQyxnQ0FBUCxJQUEyQyxFQUEzRzs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQixTQUFTQyxtQkFBVCxPQUFtSDtBQUFBOztBQUFBLE1BQXBGQyxVQUFvRixRQUFwRkEsVUFBb0Y7QUFBQSw4QkFBeEVDLFdBQXdFO0FBQUEsTUFBeEVBLFdBQXdFLG9DQUExRCxRQUEwRDtBQUFBLDRCQUFoREMsU0FBZ0Q7QUFBQSxNQUFoREEsU0FBZ0Qsa0NBQXBDLFFBQW9DO0FBQUEsTUFBMUJDLGVBQTBCLFFBQTFCQSxlQUEwQjtBQUFBLE1BQVRDLE1BQVMsUUFBVEEsTUFBUzs7QUFDbEksTUFBSUMsVUFBVUwsV0FBV0MsV0FBWCxFQUF3QkMsU0FBeEIsRUFBbUNaLE9BQW5DLENBQWQ7QUFDQSxNQUFJO0FBQUEsUUFFRWdCLFFBRkY7O0FBQUE7QUFBQSxVQWVPQyxXQWZQLEdBZUYsU0FBU0EsV0FBVCxDQUFzQkMsSUFBdEIsRUFBNEI7QUFDMUIsZUFBTyxVQUFDQyxTQUFELEVBQWU7QUFDcEIsY0FBSUEsU0FBSixFQUFjSixRQUFRSyxLQUFSLGtCQUErQkYsS0FBS0csT0FBTCxDQUFhRixTQUFiLElBQTBCLENBQXpEO0FBQ2QsaUJBQU8sQ0FBQ0QsSUFBRCxJQUFTLENBQUNDLFNBQVYsR0FBc0IsSUFBdEIsR0FBNkJELEtBQUtHLE9BQUwsQ0FBYUYsU0FBYixJQUEwQixDQUE5RDtBQUNELFNBSEQ7QUFJRCxPQXBCQzs7QUFBQSxVQXNC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QUFoRCxDQUFuQjtBQUFBLE9BRmI7QUFHRjs7QUFFQSxVQUFNZ0IscUNBQXFDLGlCQUFPTCxLQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0RBQ3JCVixnQkFBZ0IsR0FBaEIsRUFBcUIsZUFBckIsRUFBc0NGLFdBQXRDLENBRHFCOztBQUFBO0FBQ3JDc0UsdUJBRHFDO0FBRXJDcEQsMkJBRnFDLEdBRXZCLEVBRnVCOztBQUd6Q29ELHdCQUFRQyxPQUFSLENBQWdCLGtCQUFVO0FBQ3hCakMseUJBQU9DLElBQVAsQ0FBWXBDLE1BQVosRUFBb0JvRSxPQUFwQixDQUE0QixxQkFBYTtBQUN2Qyx3QkFBSTNELFVBQVU0RCxTQUFWLElBQXVCQSxjQUFjLEdBQXpDLEVBQTZDdEQsWUFBWStDLElBQVosQ0FBaUIsRUFBQ3pDLElBQUlyQixPQUFPSCxXQUFaLEVBQXlCeUIsUUFBUXRCLE9BQU9xRSxTQUFQLEVBQWtCL0MsTUFBbkQsRUFBMkRiLE9BQU9ULE9BQU9xRSxTQUFQLENBQWxFLEVBQXFGQSxvQkFBckYsRUFBakI7QUFDOUMsbUJBRkQ7QUFHRCxpQkFKRDtBQUh5QyxpREFRbEN0RCxXQVJrQzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUEzQzs7QUFrRkE7QUFBQSxXQUFPO0FBQ0xLLGtCQURLLEVBQ0FaO0FBREE7QUFBUDtBQXZGRTs7QUFBQTtBQTBGSCxHQTFGRCxDQTBGRSxPQUFPeUQsS0FBUCxFQUFjO0FBQ2RoRSxZQUFRZ0UsS0FBUixDQUFjQSxLQUFkLEVBQXFCLEVBQUNqRSxjQUFELEVBQXJCO0FBQ0EsVUFBTSxJQUFJaUMsS0FBSixDQUFVLGtDQUFWLENBQU47QUFDRDtBQUNGLENBaEdEIiwiZmlsZSI6Im5ldC5jbGllbnQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUEFDS0FHRSA9ICduZXQuY2xpZW50J1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG52YXIgcHJlZmVyZWRUcmFuc3BvcnRzID0gWydncnBjJywgJ3plcm9tcScsICdodHRwJ11cbnZhciBkZWxheWVkTWVzc2FnZXMgPSBnbG9iYWwuSkVTVVNfTkVUX0NMSUVOVF9kZWxheWVkTWVzc2FnZXMgPSBnbG9iYWwuSkVTVVNfTkVUX0NMSUVOVF9kZWxheWVkTWVzc2FnZXMgfHwge31cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXROZXRDbGllbnRQYWNrYWdlICh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycsIGdldFNoYXJlZENvbmZpZywgY29uZmlnfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHtnZXRTaGFyZWRDb25maWcsIGNvbmZpZ30pXG4gICAgdmFyIGdldFRyYW5zID0gKHRyYW5zcG9ydE5hbWUpID0+IHJlcXVpcmUoYC4vdHJhbnNwb3J0cy8ke3RyYW5zcG9ydE5hbWV9LmNsaWVudGApKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkfSlcbiAgICAvLyB2YXIgZGVmYXVsdEV2ZW50RW1pdCA9IHJlcXVpcmUoJy4vZGVmYXVsdC5ldmVudC5lbWl0Lmpzb24nKVxuXG4gICAgY29uc3QgZ2V0U2VydmljZXNFdmVudHNDb25maWdCeUV2ZW50TmFtZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgdmFyIGNvbmZpZ3MgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcoJyonLCAnZXZlbnRzLmxpc3RlbicsIHNlcnZpY2VOYW1lKVxuICAgICAgdmFyIGV2ZW50Q29uZmlnID0gW11cbiAgICAgIGNvbmZpZ3MuZm9yRWFjaChjb25maWcgPT4ge1xuICAgICAgICBPYmplY3Qua2V5cyhjb25maWcpLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQgPT09IGV2ZW50TmFtZSB8fCBldmVudE5hbWUgPT09ICcqJylldmVudENvbmZpZy5wdXNoKHt0bzogY29uZmlnLnNlcnZpY2VOYW1lLCBtZXRob2Q6IGNvbmZpZ1tldmVudE5hbWVdLm1ldGhvZCwgZXZlbnQ6IGNvbmZpZ1tldmVudE5hbWVdLCBldmVudE5hbWV9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIHJldHVybiBldmVudENvbmZpZ1xuICAgIH1cbiAgICBmdW5jdGlvbiBmaWx0ZXJCeVRhZyAodGFncykge1xuICAgICAgcmV0dXJuICh0YWdGaWx0ZXIpID0+IHtcbiAgICAgICAgaWYgKHRhZ0ZpbHRlcilDT05TT0xFLmRlYnVnKGBmaWx0ZXJCeVRhZygpYCwgdGFncy5pbmRleE9mKHRhZ0ZpbHRlcikgKyAxKVxuICAgICAgICByZXR1cm4gIXRhZ3MgfHwgIXRhZ0ZpbHRlciA/IHRydWUgOiB0YWdzLmluZGV4T2YodGFnRmlsdGVyKSArIDFcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBlbWl0ICh7ZXZlbnQsIGRhdGE9e30sIG1ldGE9e30sIHRpbWVvdXQgPSA1MDAwLCBzaW5nbGVSZXNwb25zZSA9IHRydWV9KSB7XG4gICAgICBtZXRhLmV2ZW50PWV2ZW50O1xuICAgICAgdmFyIGV2ZW50Q29uZmlnID0gYXdhaXQgZ2V0U2VydmljZXNFdmVudHNDb25maWdCeUV2ZW50TmFtZShldmVudClcbiAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgc3RhcnQgJytldmVudCwge3NpbmdsZVJlc3BvbnNlLCBldmVudCwgZGF0YSwgbWV0YSwgdGltZW91dCwgZXZlbnRDb25maWd9KVxuICAgICAgdmFyIHJlc3BvbnNlcyA9IGF3YWl0IFByb21pc2UuYWxsKGV2ZW50Q29uZmlnLm1hcCgocnBjQ29uZmlnKSA9PiBycGMoe3RvOiBycGNDb25maWcudG8sIG1ldGhvZDogcnBjQ29uZmlnLm1ldGhvZCwgZGF0YSwgbWV0YSwgdGltZW91dCwgbG9nIDogZmFsc2UgfSkpKVxuICAgICAgcmVzcG9uc2VzID0gcmVzcG9uc2VzLmZpbHRlcigocmVzcG9uc2UpID0+IHJlc3BvbnNlICE9PSBudWxsKVxuICAgICAgaWYgKHNpbmdsZVJlc3BvbnNlKXJlc3BvbnNlcyA9IHJlc3BvbnNlc1swXSB8fCBudWxsXG4gICAgICBDT05TT0xFLmRlYnVnKCdlbWl0IHJlc3BvbnNlJytldmVudCwge3Jlc3BvbnNlcywgZXZlbnQsIGV2ZW50Q29uZmlnfSlcbiAgICAgIHJldHVybiByZXNwb25zZXNcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBycGMgKHt0bywgbWV0aG9kLCBkYXRhPXt9LCBtZXRhPXt9LCB0aW1lb3V0ID0gNTAwMCwgZGVsYXllZCA9IGZhbHNlLCBsb2cgPSB0cnVlLCBsb2dEZWxheSA9IDUwMDB9KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvL2lmKGxvZylycGMgKHt0bzpcImxvZ3NcIiwgbWV0aG9kOlwibG9nXCIsIGRhdGEsIG1ldGEsIHRpbWVvdXQsIGRlbGF5ZWQ6bG9nRGVsYXksIGxvZzpmYWxzZX0pXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3JwYygpIHN0YXJ0Jywge3RvLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXQgLCBkZWxheWVkICB9KVxuICAgICAgICB2YXIgc2VuZGVyTmV0Q29uZmlnID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnbmV0JylcbiAgICAgICAgdmFyIGxpc3RlbmVyTmV0Q29uZmlnID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHRvLCAnbmV0JylcbiAgICAgICAgdmFyIGxpc3RlbmVyTWV0aG9kc0NvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZyh0bywgJ21ldGhvZHMnKVxuICAgICAgICB2YXIgbGlzdGVuZXJNZXRob2RDb25maWcgPSBsaXN0ZW5lck1ldGhvZHNDb25maWdbbWV0aG9kXVxuXG4gICAgICAgIGlmICghbGlzdGVuZXJNZXRob2RzQ29uZmlnW21ldGhvZF0pIHRocm93IG5ldyBFcnJvcihtZXRob2QgKyAnIGlzIG5vdCB2YWxpZCAobm90IGRlZmluZWQgaW4gbGlzdGVuZXIgbWV0aG9kcyBjb25maWcpJylcblxuICAgICAgICB2YXIgY29tbW9uVHJhbnNwb3J0cyA9IE9iamVjdC5rZXlzKHNlbmRlck5ldENvbmZpZy50cmFuc3BvcnRzKS5maWx0ZXIoKHZhbHVlKSA9PiAxICsgT2JqZWN0LmtleXMobGlzdGVuZXJOZXRDb25maWcudHJhbnNwb3J0cykuaW5kZXhPZih2YWx1ZSkpXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ2NvbW1vblRyYW5zcG9ydHMnLCBjb21tb25UcmFuc3BvcnRzLCBPYmplY3Qua2V5cyhzZW5kZXJOZXRDb25maWcudHJhbnNwb3J0cyksIE9iamVjdC5rZXlzKGxpc3RlbmVyTmV0Q29uZmlnLnRyYW5zcG9ydHMpKVxuICAgICAgICBpZiAoIWNvbW1vblRyYW5zcG9ydHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoYHNlcnZpY2UgJHt0b30gYW5kIHNlcnZpY2UgJHtzZXJ2aWNlTmFtZX0gaGF2ZSBubyBjb21tb24gdHJhbnNwb3J0c2ApXG4gICAgICAgIGNvbW1vblRyYW5zcG9ydHMuc29ydCgoYSwgYikgPT4gcHJlZmVyZWRUcmFuc3BvcnRzLmluZGV4T2YoYikgLSBwcmVmZXJlZFRyYW5zcG9ydHMuaW5kZXhPZihhKSkvLyBsaXN0ZW5lck1ldGhvZCBwcmVmZXJlZFRyYW5zcG9ydHNcblxuICAgICAgICBDT05TT0xFLmRlYnVnKCdycGMgY29tbW9uVHJhbnNwb3J0cycsIHtjb21tb25UcmFuc3BvcnRzLCBmaXJzdDogY29tbW9uVHJhbnNwb3J0c1swXX0pXG4gICAgICAgIHZhciB0cmFuc3BvcnQgPSBnZXRUcmFucyhjb21tb25UcmFuc3BvcnRzWzBdKVxuXG4gICAgICAgIHZhciBzZW5kVG8gPSBsaXN0ZW5lck5ldENvbmZpZy50cmFuc3BvcnRzW2NvbW1vblRyYW5zcG9ydHNbMF1dXG4gICAgICAgIHZhciB3YWl0UmVzcG9uc2UgPSAobGlzdGVuZXJNZXRob2RDb25maWcucmVzcG9uc2VUeXBlICE9PSAnbm9SZXNwb25zZScpXG4gICAgICAgIHZhciBpc1N0cmVhbSA9IChsaXN0ZW5lck1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGUgPT09ICdzdHJlYW0nKVxuXG4gICAgICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgICAgIGY6IHNlcnZpY2VOYW1lLFxuICAgICAgICAgIG06IG1ldGhvZCxcbiAgICAgICAgICBkOiBbeyBkOiBkYXRhLCByOiBtZXRhLmNvcnJpZCwgdTogbWV0YS51c2VyaWQgfV1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZWxheWVkKSB7XG4gICAgICAgICAgdmFyIGluZGV4ID0gdG8gKyBtZXRob2RcbiAgICAgICAgICBpZiAoIWRlbGF5ZWRNZXNzYWdlc1tpbmRleF0pIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB2YXIgZGVsYXllZE1lc3NhZ2UgPSBkZWxheWVkTWVzc2FnZXNbaW5kZXhdXG4gICAgICAgICAgICAgIGRlbGV0ZSBkZWxheWVkTWVzc2FnZXNbaW5kZXhdXG4gICAgICAgICAgICAgIENPTlNPTEUubG9nKCc9PiBDTElFTlQgT1VUJywge3RvOiBzZW5kVG8sIG1lc3NhZ2U6IGRlbGF5ZWRNZXNzYWdlLCB3YWl0UmVzcG9uc2V9KVxuICAgICAgICAgICAgICB0cmFuc3BvcnQuc2VuZChzZW5kVG8sIGRlbGF5ZWRNZXNzYWdlLCBsaXN0ZW5lck1ldGhvZENvbmZpZy50aW1lb3V0LCB3YWl0UmVzcG9uc2UpLnRoZW4oKHJlc3BvbnNlKSA9PiBDT05TT0xFLmxvZygnPT4gQ0xJRU5UIElOIFJFU1BPTlNFJywge3Jlc3BvbnNlfSkpXG4gICAgICAgICAgICB9LCBkZWxheWVkKVxuICAgICAgICAgICAgZGVsYXllZE1lc3NhZ2VzW2luZGV4XSA9IG1lc3NhZ2VcbiAgICAgICAgICB9IGVsc2UgZGVsYXllZE1lc3NhZ2VzW2luZGV4XS5kLnB1c2goeyBkOiBkYXRhLCByOiBtZXRhLmNvcnJpZCwgdTogbWV0YS51c2VyaWQgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBpZiBzdHJlYW1pbmcgcmV0dXJuIGV2ZW50RW1pdGVyIGNvbiBvbiBkYXRhLG9uIGVycm9yLG9uIGVuZCBhbHRyaW1lbnRpIHJpc3Bvc3RhXG4gICAgICAgICAgQ09OU09MRS5sb2coJz0+IENMSUVOVCBPVVQgU1RSRUFNJywge3RvOiBzZW5kVG8sIG1lc3NhZ2UsIHdhaXRSZXNwb25zZX0pXG4gICAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgdHJhbnNwb3J0LnNlbmQoc2VuZFRvLCBtZXNzYWdlLCBsaXN0ZW5lck1ldGhvZENvbmZpZy50aW1lb3V0LCB3YWl0UmVzcG9uc2UsIGlzU3RyZWFtKVxuICAgICAgICAgIENPTlNPTEUubG9nKCc9PiBDTElFTlQgSU4gU1RSRUFNIFJFU1BPTlNFJywge3Jlc3BvbnNlfSlcbiAgICAgICAgICAvLyBpZiAoc2luZ2xlUmVzcG9uc2UgJiYgcmVzcG9uc2UgJiYgcmVzcG9uc2VbMF0pcmVzcG9uc2UgPSByZXNwb25zZVswXVxuICAgICAgICAgIENPTlNPTEUuZGVidWcoJ3JwYyB0byAnICsgdG8gKyAnICcgKyBtZXRob2QgKyAnIGNvcnJpZDonICsgbWV0YS5jb3JyaWQsIEpTT04uc3RyaW5naWZ5KHtyZXNwb25zZSwgc2VuZFRvLCBtZXNzYWdlLCB3YWl0UmVzcG9uc2V9KSlcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgQ09OU09MRS5lcnJvcihlcnJvciwge3RvLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXR9KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBycGMnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgcnBjLCBlbWl0XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtjb25maWd9KVxuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgZHVyaW5nIGdldE5ldENsaWVudFBhY2thZ2UnKVxuICB9XG59XG4iXX0=