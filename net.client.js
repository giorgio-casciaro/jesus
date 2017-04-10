'use strict';

var PACKAGE = 'net.client';
var checkRequired = require('./utils').checkRequired;
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
              checkRequired({ to: to, method: method });
              _context3.next = 5;
              return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'net'));

            case 5:
              senderNetConfig = _context3.sent;
              _context3.next = 8;
              return regeneratorRuntime.awrap(getSharedConfig(to, 'net'));

            case 8:
              listenerNetConfig = _context3.sent;
              _context3.next = 11;
              return regeneratorRuntime.awrap(getSharedConfig(to, 'methods'));

            case 11:
              listenerMethodsConfig = _context3.sent;
              listenerMethodConfig = listenerMethodsConfig[method];

              if (listenerMethodsConfig[method]) {
                _context3.next = 15;
                break;
              }

              throw new Error(method + ' is not valid (not defined in listener methods config)');

            case 15:
              commonTransports = Object.keys(senderNetConfig.transports).filter(function (value) {
                return 1 + Object.keys(listenerNetConfig.transports).indexOf(value);
              });

              CONSOLE.debug('commonTransports', commonTransports, Object.keys(senderNetConfig.transports), Object.keys(listenerNetConfig.transports));

              if (commonTransports.length) {
                _context3.next = 19;
                break;
              }

              throw new Error('service ' + to + ' and service ' + serviceName + ' have no common transports');

            case 19:
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
              _context3.next = 34;
              return regeneratorRuntime.awrap(transport.send(sendTo, message, listenerMethodConfig.timeout, waitResponse, isStream));

            case 34:
              response = _context3.sent;

              CONSOLE.log('=> CLIENT IN STREAM RESPONSE', { response: response });
              // if (singleResponse && response && response[0])response = response[0]
              CONSOLE.debug('rpc to ' + to + ' ' + method + ' corrid:' + meta.corrid, { response: response, sendTo: sendTo, message: message, waitResponse: waitResponse });
              return _context3.abrupt('return', response);

            case 40:
              _context3.prev = 40;
              _context3.t0 = _context3['catch'](0);

              CONSOLE.error(_context3.t0, { to: to, method: method, data: data, meta: meta, timeout: timeout });
              throw new Error('Error during rpc');

            case 44:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this, [[0, 40]]);
    };

    checkRequired({ getSharedConfig: getSharedConfig, config: config });
    var getTrans = function getTrans(transportName) {
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
      rpc: rpc, emit: emit
    };
  } catch (error) {
    CONSOLE.error(error, { config: config });
    throw new Error('Error during getNetClientPackage');
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicmVxdWlyZSIsIlIiLCJwcmVmZXJlZFRyYW5zcG9ydHMiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0TmV0Q2xpZW50UGFja2FnZSIsImdldENvbnNvbGUiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldFNoYXJlZENvbmZpZyIsImNvbmZpZyIsIkNPTlNPTEUiLCJlbWl0IiwiZXZlbnQiLCJkYXRhIiwibWV0YSIsInRpbWVvdXQiLCJzaW5nbGVSZXNwb25zZSIsImdldFNlcnZpY2VzRXZlbnRzQ29uZmlnQnlFdmVudE5hbWUiLCJldmVudENvbmZpZyIsImRlYnVnIiwiUHJvbWlzZSIsImFsbCIsIm1hcCIsInJwY0NvbmZpZyIsInJwYyIsInRvIiwibWV0aG9kIiwibG9nIiwicmVzcG9uc2VzIiwiZmlsdGVyIiwicmVzcG9uc2UiLCJzZW5kZXJOZXRDb25maWciLCJsaXN0ZW5lck5ldENvbmZpZyIsImxpc3RlbmVyTWV0aG9kc0NvbmZpZyIsImxpc3RlbmVyTWV0aG9kQ29uZmlnIiwiRXJyb3IiLCJjb21tb25UcmFuc3BvcnRzIiwiT2JqZWN0Iiwia2V5cyIsInRyYW5zcG9ydHMiLCJ2YWx1ZSIsImluZGV4T2YiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmaXJzdCIsInRyYW5zcG9ydCIsImdldFRyYW5zIiwic2VuZFRvIiwid2FpdFJlc3BvbnNlIiwicmVzcG9uc2VUeXBlIiwiaXNTdHJlYW0iLCJjbG9uZSIsInJlcU91dFRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJmcm9tIiwic3RyZWFtIiwibWVzc2FnZSIsInNlbmQiLCJjb3JyaWQiLCJlcnJvciIsInRyYW5zcG9ydE5hbWUiLCJjb25maWdzIiwiZm9yRWFjaCIsImV2ZW50TmFtZSIsInB1c2giXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsVUFBVSxZQUFoQjtBQUNBLElBQU1DLGdCQUFnQkMs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YyxHQUF6QyxFQUE2Q2hELFlBQVlpRCxJQUFaLENBQWlCLEVBQUMxQyxJQUFJaEIsT0FBT0gsV0FBWixFQUF5Qm9CLFFBQVFqQixPQUFPeUQsU0FBUCxFQUFrQnhDLE1BQW5ELEVBQTJEZCxPQUFPSCxPQUFPeUQsU0FBUCxDQUFsRSxFQUFxRkEsb0JBQXJGLEVBQWpCO0FBQzlDLGlCQUZEO0FBR0QsZUFKRDtBQUh5QywrQ0FRbENoRCxXQVJrQzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUEzQztBQXFFQSxXQUFPO0FBQ0xNLGNBREssRUFDQWI7QUFEQSxLQUFQO0FBR0QsR0E3RUQsQ0E2RUUsT0FBT21ELEtBQVAsRUFBYztBQUNkcEQsWUFBUW9ELEtBQVIsQ0FBY0EsS0FBZCxFQUFxQixFQUFDckQsY0FBRCxFQUFyQjtBQUNBLFVBQU0sSUFBSTBCLEtBQUosQ0FBVSxrQ0FBVixDQUFOO0FBQ0Q7QUFDRixDQW5GRCIsImZpbGUiOiJuZXQuY2xpZW50LmVzNiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFBBQ0tBR0UgPSAnbmV0LmNsaWVudCdcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL3V0aWxzJykuY2hlY2tSZXF1aXJlZFxuY29uc3QgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBwcmVmZXJlZFRyYW5zcG9ydHMgPSBbJ2dycGMnLCAnemVyb21xJywgJ2h0dHAnXVxuLy8gdmFyIGRlbGF5ZWRNZXNzYWdlcyA9IGdsb2JhbC5KRVNVU19ORVRfQ0xJRU5UX2RlbGF5ZWRNZXNzYWdlcyA9IGdsb2JhbC5KRVNVU19ORVRfQ0xJRU5UX2RlbGF5ZWRNZXNzYWdlcyB8fCB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE5ldENsaWVudFBhY2thZ2UgKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSA9ICd1bmtub3cnLCBzZXJ2aWNlSWQgPSAndW5rbm93JywgZ2V0U2hhcmVkQ29uZmlnLCBjb25maWd9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe2dldFNoYXJlZENvbmZpZywgY29uZmlnfSlcbiAgICB2YXIgZ2V0VHJhbnMgPSAodHJhbnNwb3J0TmFtZSkgPT4gcmVxdWlyZShgLi90cmFuc3BvcnRzLyR7dHJhbnNwb3J0TmFtZX0uY2xpZW50YCkoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWR9KVxuICAgIC8vIHZhciBkZWZhdWx0RXZlbnRFbWl0ID0gcmVxdWlyZSgnLi9kZWZhdWx0LmV2ZW50LmVtaXQuanNvbicpXG5cbiAgICBjb25zdCBnZXRTZXJ2aWNlc0V2ZW50c0NvbmZpZ0J5RXZlbnROYW1lID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICB2YXIgY29uZmlncyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZygnKicsICdldmVudHMubGlzdGVuJywgc2VydmljZU5hbWUpXG4gICAgICB2YXIgZXZlbnRDb25maWcgPSBbXVxuICAgICAgY29uZmlncy5mb3JFYWNoKGNvbmZpZyA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKGNvbmZpZykuZm9yRWFjaChldmVudE5hbWUgPT4ge1xuICAgICAgICAgIGlmIChldmVudCA9PT0gZXZlbnROYW1lIHx8IGV2ZW50TmFtZSA9PT0gJyonKWV2ZW50Q29uZmlnLnB1c2goe3RvOiBjb25maWcuc2VydmljZU5hbWUsIG1ldGhvZDogY29uZmlnW2V2ZW50TmFtZV0ubWV0aG9kLCBldmVudDogY29uZmlnW2V2ZW50TmFtZV0sIGV2ZW50TmFtZX0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgcmV0dXJuIGV2ZW50Q29uZmlnXG4gICAgfVxuICAgIC8vIGZ1bmN0aW9uIGZpbHRlckJ5VGFnICh0YWdzKSB7XG4gICAgLy8gICByZXR1cm4gKHRhZ0ZpbHRlcikgPT4ge1xuICAgIC8vICAgICBpZiAodGFnRmlsdGVyKUNPTlNPTEUuZGVidWcoYGZpbHRlckJ5VGFnKClgLCB0YWdzLmluZGV4T2YodGFnRmlsdGVyKSArIDEpXG4gICAgLy8gICAgIHJldHVybiAhdGFncyB8fCAhdGFnRmlsdGVyID8gdHJ1ZSA6IHRhZ3MuaW5kZXhPZih0YWdGaWx0ZXIpICsgMVxuICAgIC8vICAgfVxuICAgIC8vIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGVtaXQgKHtldmVudCwgZGF0YSA9IHt9LCBtZXRhID0ge30sIHRpbWVvdXQgPSA1MDAwLCBzaW5nbGVSZXNwb25zZSA9IHRydWV9KSB7XG4gICAgICBtZXRhLmV2ZW50ID0gZXZlbnRcbiAgICAgIHZhciBldmVudENvbmZpZyA9IGF3YWl0IGdldFNlcnZpY2VzRXZlbnRzQ29uZmlnQnlFdmVudE5hbWUoZXZlbnQpXG4gICAgICBDT05TT0xFLmRlYnVnKCdlbWl0IHN0YXJ0ICcgKyBldmVudCwge3NpbmdsZVJlc3BvbnNlLCBldmVudCwgZGF0YSwgbWV0YSwgdGltZW91dCwgZXZlbnRDb25maWd9KVxuICAgICAgdmFyIHJlc3BvbnNlcyA9IGF3YWl0IFByb21pc2UuYWxsKGV2ZW50Q29uZmlnLm1hcCgocnBjQ29uZmlnKSA9PiBycGMoe3RvOiBycGNDb25maWcudG8sIG1ldGhvZDogcnBjQ29uZmlnLm1ldGhvZCwgZGF0YSwgbWV0YSwgdGltZW91dCwgbG9nOiBmYWxzZSB9KSkpXG4gICAgICByZXNwb25zZXMgPSByZXNwb25zZXMuZmlsdGVyKChyZXNwb25zZSkgPT4gcmVzcG9uc2UgIT09IG51bGwpXG4gICAgICBpZiAoc2luZ2xlUmVzcG9uc2UpcmVzcG9uc2VzID0gcmVzcG9uc2VzWzBdIHx8IG51bGxcbiAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgcmVzcG9uc2UnICsgZXZlbnQsIHtyZXNwb25zZXMsIGV2ZW50LCBldmVudENvbmZpZ30pXG4gICAgICByZXR1cm4gcmVzcG9uc2VzXG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gcnBjICh7dG8sIG1ldGhvZCwgZGF0YSA9IHt9LCBtZXRhID0ge30sIHRpbWVvdXQgPSA1MDAwLCB9KSB7XG4gICAgICB0cnkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdycGMoKSBzdGFydCcsIHt0bywgbWV0aG9kLCBkYXRhLCBtZXRhLCB0aW1lb3V0IH0pXG4gICAgICAgIGNoZWNrUmVxdWlyZWQoe3RvLCBtZXRob2R9KVxuICAgICAgICB2YXIgc2VuZGVyTmV0Q29uZmlnID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnbmV0JylcbiAgICAgICAgdmFyIGxpc3RlbmVyTmV0Q29uZmlnID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHRvLCAnbmV0JylcbiAgICAgICAgdmFyIGxpc3RlbmVyTWV0aG9kc0NvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZyh0bywgJ21ldGhvZHMnKVxuICAgICAgICB2YXIgbGlzdGVuZXJNZXRob2RDb25maWcgPSBsaXN0ZW5lck1ldGhvZHNDb25maWdbbWV0aG9kXVxuXG4gICAgICAgIGlmICghbGlzdGVuZXJNZXRob2RzQ29uZmlnW21ldGhvZF0pIHRocm93IG5ldyBFcnJvcihtZXRob2QgKyAnIGlzIG5vdCB2YWxpZCAobm90IGRlZmluZWQgaW4gbGlzdGVuZXIgbWV0aG9kcyBjb25maWcpJylcblxuICAgICAgICB2YXIgY29tbW9uVHJhbnNwb3J0cyA9IE9iamVjdC5rZXlzKHNlbmRlck5ldENvbmZpZy50cmFuc3BvcnRzKS5maWx0ZXIoKHZhbHVlKSA9PiAxICsgT2JqZWN0LmtleXMobGlzdGVuZXJOZXRDb25maWcudHJhbnNwb3J0cykuaW5kZXhPZih2YWx1ZSkpXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ2NvbW1vblRyYW5zcG9ydHMnLCBjb21tb25UcmFuc3BvcnRzLCBPYmplY3Qua2V5cyhzZW5kZXJOZXRDb25maWcudHJhbnNwb3J0cyksIE9iamVjdC5rZXlzKGxpc3RlbmVyTmV0Q29uZmlnLnRyYW5zcG9ydHMpKVxuICAgICAgICBpZiAoIWNvbW1vblRyYW5zcG9ydHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoYHNlcnZpY2UgJHt0b30gYW5kIHNlcnZpY2UgJHtzZXJ2aWNlTmFtZX0gaGF2ZSBubyBjb21tb24gdHJhbnNwb3J0c2ApXG4gICAgICAgIGNvbW1vblRyYW5zcG9ydHMuc29ydCgoYSwgYikgPT4gcHJlZmVyZWRUcmFuc3BvcnRzLmluZGV4T2YoYikgLSBwcmVmZXJlZFRyYW5zcG9ydHMuaW5kZXhPZihhKSkvLyBsaXN0ZW5lck1ldGhvZCBwcmVmZXJlZFRyYW5zcG9ydHNcblxuICAgICAgICBDT05TT0xFLmRlYnVnKCdycGMgY29tbW9uVHJhbnNwb3J0cycsIHtjb21tb25UcmFuc3BvcnRzLCBmaXJzdDogY29tbW9uVHJhbnNwb3J0c1swXX0pXG4gICAgICAgIHZhciB0cmFuc3BvcnQgPSBnZXRUcmFucyhjb21tb25UcmFuc3BvcnRzWzBdKVxuXG4gICAgICAgIHZhciBzZW5kVG8gPSBsaXN0ZW5lck5ldENvbmZpZy50cmFuc3BvcnRzW2NvbW1vblRyYW5zcG9ydHNbMF1dXG4gICAgICAgIHZhciB3YWl0UmVzcG9uc2UgPSAobGlzdGVuZXJNZXRob2RDb25maWcucmVzcG9uc2VUeXBlICE9PSAnbm9SZXNwb25zZScpXG4gICAgICAgIHZhciBpc1N0cmVhbSA9IChsaXN0ZW5lck1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGUgPT09ICdzdHJlYW0nKVxuICAgICAgICB2YXIgbWV0YSA9IFIuY2xvbmUobWV0YSlcbiAgICAgICAgbWV0YS5yZXFPdXRUaW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgICAgIG1ldGEuZnJvbSA9IHNlcnZpY2VOYW1lXG4gICAgICAgIG1ldGEuc3RyZWFtID0gaXNTdHJlYW1cbiAgICAgICAgbWV0YS50byA9IHRvXG4gICAgICAgIHZhciBtZXNzYWdlID0ge21ldGhvZCwgbWV0YSwgZGF0YX1cblxuICAgICAgICAgIC8vIGlmIHN0cmVhbWluZyByZXR1cm4gZXZlbnRFbWl0ZXIgY29uIG9uIGRhdGEsb24gZXJyb3Isb24gZW5kIGFsdHJpbWVudGkgcmlzcG9zdGFcbiAgICAgICAgQ09OU09MRS5sb2coJz0+IENMSUVOVCBPVVQgU1RSRUFNJywge3RvOiBzZW5kVG8sIG1lc3NhZ2UsIHdhaXRSZXNwb25zZX0pXG4gICAgICAgIHZhciByZXNwb25zZSA9IGF3YWl0IHRyYW5zcG9ydC5zZW5kKHNlbmRUbywgbWVzc2FnZSwgbGlzdGVuZXJNZXRob2RDb25maWcudGltZW91dCwgd2FpdFJlc3BvbnNlLCBpc1N0cmVhbSlcbiAgICAgICAgQ09OU09MRS5sb2coJz0+IENMSUVOVCBJTiBTVFJFQU0gUkVTUE9OU0UnLCB7cmVzcG9uc2V9KVxuICAgICAgICAgIC8vIGlmIChzaW5nbGVSZXNwb25zZSAmJiByZXNwb25zZSAmJiByZXNwb25zZVswXSlyZXNwb25zZSA9IHJlc3BvbnNlWzBdXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3JwYyB0byAnICsgdG8gKyAnICcgKyBtZXRob2QgKyAnIGNvcnJpZDonICsgbWV0YS5jb3JyaWQsIHtyZXNwb25zZSwgc2VuZFRvLCBtZXNzYWdlLCB3YWl0UmVzcG9uc2V9KVxuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHt0bywgbWV0aG9kLCBkYXRhLCBtZXRhLCB0aW1lb3V0fSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBkdXJpbmcgcnBjJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHJwYywgZW1pdFxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDT05TT0xFLmVycm9yKGVycm9yLCB7Y29uZmlnfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBnZXROZXRDbGllbnRQYWNrYWdlJylcbiAgfVxufVxuIl19