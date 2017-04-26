'use strict';

var PACKAGE = 'net.client';
var checkRequired = require('./utils').checkRequired;
var R = require('ramda');
var preferedChannels = ['grpc', 'zeromq', 'http'];
// var delayedMessages = global.JESUS_NET_CLIENT_delayedMessages = global.JESUS_NET_CLIENT_delayedMessages || {}
var getConsole = function getConsole(serviceName, serviceId, pack) {
  return require('./utils').getConsole({ error: true, debug: true, log: true, warn: true }, serviceName, serviceId, pack);
};

module.exports = function getNetClientPackage(_ref) {
  var _this = this;

  var _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      getNetConfig = _ref.getNetConfig,
      getEventsIn = _ref.getEventsIn,
      getMethodsConfig = _ref.getMethodsConfig,
      getRpcOut = _ref.getRpcOut,
      getEventsOut = _ref.getEventsOut;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  try {
    var emit = function _callee2(event) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5000;
      var eventsOutConfigAll, eventOutConfig, eventsInConfig, responses;
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              checkRequired({ event: event }, PACKAGE);
              meta.event = event;
              _context2.next = 4;
              return regeneratorRuntime.awrap(getEventsOut());

            case 4:
              eventsOutConfigAll = _context2.sent;

              if (eventsOutConfigAll[event]) {
                _context2.next = 8;
                break;
              }

              CONSOLE.warn('event ' + event + ' not found in config EventsOut', eventsOutConfigAll);
              return _context2.abrupt('return', null);

            case 8:
              eventOutConfig = eventsOutConfigAll[event];
              _context2.next = 11;
              return regeneratorRuntime.awrap(getEventsFromServices(event));

            case 11:
              eventsInConfig = _context2.sent;

              CONSOLE.debug('emit start ' + event, { eventsOutConfigAll: eventsOutConfigAll, eventOutConfig: eventOutConfig, eventsInConfig: eventsInConfig, event: event, data: data, meta: meta, timeout: timeout });
              checkRequired({ eventOutConfig: eventOutConfig }, PACKAGE);
              _context2.next = 16;
              return regeneratorRuntime.awrap(Promise.all(eventsInConfig.map(function (rpcConfig) {
                return rpcCall({ to: rpcConfig.to, method: rpcConfig.method, data: data, meta: meta, timeout: timeout, log: false });
              })));

            case 16:
              responses = _context2.sent;

              responses = responses.filter(function (response) {
                return response !== null;
              });
              if (!eventOutConfig.multipleResponse) responses = responses[0] || null;
              CONSOLE.debug('emit response ' + event, { responses: responses, event: event, eventsInConfig: eventsInConfig });
              return _context2.abrupt('return', responses);

            case 21:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    };

    var rpc = function _callee3(rpcName) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5000;
      var rpcOutConfigAll, rpcOutConfig;
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              checkRequired({ rpcName: rpcName }, PACKAGE);
              _context3.next = 3;
              return regeneratorRuntime.awrap(getRpcOut());

            case 3:
              rpcOutConfigAll = _context3.sent;
              rpcOutConfig = rpcOutConfigAll[rpcName];

              CONSOLE.debug('rpc() start', { rpcName: rpcName, rpcOutConfig: rpcOutConfig, rpcOutConfigAll: rpcOutConfigAll });
              checkRequired({ rpcOutConfig: rpcOutConfig }, PACKAGE);
              if (rpcOutConfig.timeout) timeout = rpcOutConfig.timeout;
              _context3.next = 10;
              return regeneratorRuntime.awrap(rpcCall({ to: rpcOutConfig.to, method: rpcOutConfig.method, data: data, meta: meta, timeout: timeout }));

            case 10:
              return _context3.abrupt('return', _context3.sent);

            case 11:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this);
    };

    var rpcCall = function _callee4(_ref2) {
      var to = _ref2.to,
          method = _ref2.method,
          _ref2$data = _ref2.data,
          data = _ref2$data === undefined ? {} : _ref2$data,
          _ref2$meta = _ref2.meta,
          meta = _ref2$meta === undefined ? {} : _ref2$meta,
          _ref2$timeout = _ref2.timeout,
          timeout = _ref2$timeout === undefined ? 5000 : _ref2$timeout;
      var senderNetConfig, listenerNetConfig, listenerMethodsConfig, listenerMethodConfig, commonChannels, channel, sendTo, waitResponse, isStream, message, response;
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;

              checkRequired({ to: to, method: method }, PACKAGE);
              _context4.next = 4;
              return regeneratorRuntime.awrap(getNetConfig(serviceName));

            case 4:
              senderNetConfig = _context4.sent;
              _context4.next = 7;
              return regeneratorRuntime.awrap(getNetConfig(to));

            case 7:
              listenerNetConfig = _context4.sent;
              _context4.next = 10;
              return regeneratorRuntime.awrap(getMethodsConfig(to));

            case 10:
              listenerMethodsConfig = _context4.sent;
              listenerMethodConfig = listenerMethodsConfig[method];


              CONSOLE.debug('rpcCall() start', { to: to, method: method, data: data, meta: meta, timeout: timeout, listenerNetConfig: listenerNetConfig });
              CONSOLE.debug('rpcCall() start', to, listenerMethodsConfig);

              if (listenerMethodsConfig[method]) {
                _context4.next = 16;
                break;
              }

              throw new Error(method + ' is not valid (not defined in listener methods config)');

            case 16:
              commonChannels = Object.keys(senderNetConfig.channels).filter(function (value) {
                return 1 + Object.keys(listenerNetConfig.channels).indexOf(value);
              });

              CONSOLE.debug('commonChannels', commonChannels, Object.keys(senderNetConfig.channels), Object.keys(listenerNetConfig.channels));

              if (commonChannels.length) {
                _context4.next = 20;
                break;
              }

              throw new Error('service ' + to + ' and service ' + serviceName + ' have no common channels');

            case 20:
              commonChannels.sort(function (a, b) {
                return preferedChannels.indexOf(b) - preferedChannels.indexOf(a);
              }); // listenerMethod preferedChannels

              CONSOLE.debug('rpc commonChannels', { commonChannels: commonChannels, first: commonChannels[0] });
              channel = getChannel(commonChannels[0]);
              sendTo = listenerNetConfig.channels[commonChannels[0]];
              waitResponse = listenerMethodConfig.responseType !== 'noResponse';
              isStream = listenerMethodConfig.responseType === 'stream';

              meta = R.merge({
                reqOutTimestamp: Date.now(),
                from: serviceName,
                stream: isStream,
                to: to
              }, meta);
              message = { method: method, meta: meta, data: data };

              // if streaming return eventEmiter con on data,on error,on end altrimenti risposta

              CONSOLE.debug('=> CLIENT OUT ', { to: sendTo, message: message, waitResponse: waitResponse });
              _context4.next = 31;
              return regeneratorRuntime.awrap(channel.send(sendTo, message, listenerMethodConfig.timeout, waitResponse, isStream));

            case 31:
              response = _context4.sent;

              CONSOLE.debug('=> CLIENT IN  RESPONSE', { response: response });
              // if (singleResponse && response && response[0])response = response[0]
              CONSOLE.debug('rpc to ' + to + ' ' + method + ' corrid:' + meta.corrid, { response: response, sendTo: sendTo, message: message, waitResponse: waitResponse });
              return _context4.abrupt('return', response);

            case 37:
              _context4.prev = 37;
              _context4.t0 = _context4['catch'](0);

              CONSOLE.error(_context4.t0, { to: to, method: method, data: data, meta: meta, timeout: timeout });
              throw new Error('Error during rpc');

            case 41:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, this, [[0, 37]]);
    };

    checkRequired({ getEventsIn: getEventsIn, getMethodsConfig: getMethodsConfig, getNetConfig: getNetConfig, getRpcOut: getRpcOut, getEventsOut: getEventsOut }, PACKAGE);
    var getChannel = function getChannel(channelName) {
      return require('./channels/' + channelName + '.client')({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId });
    };

    var getEventsFromServices = function _callee(event) {
      var servicesEventsIn, eventConfig;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(getEventsIn('*', serviceName));

            case 2:
              servicesEventsIn = _context.sent;

              CONSOLE.debug('getEventsFromServices servicesEventsIn', servicesEventsIn, event);
              eventConfig = [];

              servicesEventsIn.forEach(function (config) {
                Object.keys(config.items).forEach(function (eventName) {
                  if (event === eventName || eventName === '*') eventConfig.push({ to: config.service, method: config.items[eventName].method, event: config.items[eventName], eventName: eventName });
                });
              });
              CONSOLE.debug('getEventsFromServices ', eventConfig);
              return _context.abrupt('return', eventConfig);

            case 8:
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
    CONSOLE.error(error, { serviceName: serviceName, serviceId: serviceId, getNetConfig: getNetConfig, getEventsIn: getEventsIn, getMethodsConfig: getMethodsConfig, getRpcOut: getRpcOut, getEventsOut: getEventsOut });
    throw new Error('Error during getNetClientPackage');
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicmVxdWlyZSIsIlIiLCJwcmVmZXJlZENoYW5uZWxzIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsImVycm9yIiwiZGVidWciLCJsb2ciLCJ3YXJuIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldENsaWVudFBhY2thZ2UiLCJnZXROZXRDb25maWciLCJnZXRFdmVudHNJbiIsImdldE1ldGhvZHNDb25maWciLCJnZXRScGNPdXQiLCJnZXRFdmVudHNPdXQiLCJDT05TT0xFIiwiZW1pdCIsImV2ZW50IiwiZGF0YSIsIm1ldGEiLCJ0aW1lb3V0IiwiZXZlbnRzT3V0Q29uZmlnQWxsIiwiZXZlbnRPdXRDb25maWciLCJnZXRFdmVudHNGcm9tU2VydmljZXMiLCJldmVudHNJbkNvbmZpZyIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJycGNDb25maWciLCJycGNDYWxsIiwidG8iLCJtZXRob2QiLCJyZXNwb25zZXMiLCJmaWx0ZXIiLCJyZXNwb25zZSIsIm11bHRpcGxlUmVzcG9uc2UiLCJycGMiLCJycGNOYW1lIiwicnBjT3V0Q29uZmlnQWxsIiwicnBjT3V0Q29uZmlnIiwic2VuZGVyTmV0Q29uZmlnIiwibGlzdGVuZXJOZXRDb25maWciLCJsaXN0ZW5lck1ldGhvZHNDb25maWciLCJsaXN0ZW5lck1ldGhvZENvbmZpZyIsIkVycm9yIiwiY29tbW9uQ2hhbm5lbHMiLCJPYmplY3QiLCJrZXlzIiwiY2hhbm5lbHMiLCJ2YWx1ZSIsImluZGV4T2YiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmaXJzdCIsImNoYW5uZWwiLCJnZXRDaGFubmVsIiwic2VuZFRvIiwid2FpdFJlc3BvbnNlIiwicmVzcG9uc2VUeXBlIiwiaXNTdHJlYW0iLCJtZXJnZSIsInJlcU91dFRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJmcm9tIiwic3RyZWFtIiwibWVzc2FnZSIsInNlbmQiLCJjb3JyaWQiLCJjaGFubmVsTmFtZSIsInNlcnZpY2VzRXZlbnRzSW4iLCJldmVudENvbmZpZyIsImZvckVhY2giLCJjb25maWciLCJpdGVtcyIsImV2ZW50TmFtZSIsInB1c2giLCJzZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFVBQVUsWUFBaEI7QUFDQSxJQUFNQyxnQkFBZ0JDLFFBQVEsU0FBUixFQUFtQkQsYUFBekM7QUFDQSxJQUFNRSxJQUFJRCxRQUFRLE9BQVIsQ0FBVjtBQUNBLElBQUlFLG1CQUFtQixDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLE1BQW5CLENBQXZCO0FBQ0E7QUFDQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0MsV0FBRCxFQUFjQyxTQUFkLEVBQXlCQyxJQUF6QjtBQUFBLFNBQWtDTixRQUFRLFNBQVIsRUFBbUJHLFVBQW5CLENBQThCLEVBQUNJLE9BQU8sSUFBUixFQUFjQyxPQUFPLElBQXJCLEVBQTJCQyxLQUFLLElBQWhDLEVBQXNDQyxNQUFNLElBQTVDLEVBQTlCLEVBQWlGTixXQUFqRixFQUE4RkMsU0FBOUYsRUFBeUdDLElBQXpHLENBQWxDO0FBQUEsQ0FBbkI7O0FBRUFLLE9BQU9DLE9BQVAsR0FBaUIsU0FBU0MsbUJBQVQsT0FBb0o7QUFBQTs7QUFBQSw4QkFBckhULFdBQXFIO0FBQUEsTUFBckhBLFdBQXFILG9DQUF2RyxRQUF1RztBQUFBLDRCQUE3RkMsU0FBNkY7QUFBQSxNQUE3RkEsU0FBNkYsa0NBQWpGLFFBQWlGO0FBQUEsTUFBdkVTLFlBQXVFLFFBQXZFQSxZQUF1RTtBQUFBLE1BQXpEQyxXQUF5RCxRQUF6REEsV0FBeUQ7QUFBQSxNQUE1Q0MsZ0JBQTRDLFFBQTVDQSxnQkFBNEM7QUFBQSxNQUExQkMsU0FBMEIsUUFBMUJBLFNBQTBCO0FBQUEsTUFBZkMsWUFBZSxRQUFmQSxZQUFlOztBQUNuSyxNQUFJQyxVQUFVaEIsV0FBV0MsV0FBWCxFQUF3QkMsU0FBeEIsRUFBbUNQLE9BQW5DLENBQWQ7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QkFBZixFQUEyQlMsMEJBQTNCLEVBQXlDQyx3QkFBekMsRUFBc0RDLGtDQUF0RCxFQUF3RUMsb0JBQXhFLEVBQW1GQywwQkFBbkYsRUFBckI7QUFDQSxVQUFNLElBQUk4QixLQUFKLENBQVUsa0NBQVYsQ0FBTjtBQUNEO0FBQ0YsQ0FqR0QiLCJmaWxlIjoibmV0LmNsaWVudC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQQUNLQUdFID0gJ25ldC5jbGllbnQnXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi91dGlscycpLmNoZWNrUmVxdWlyZWRcbmNvbnN0IFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcHJlZmVyZWRDaGFubmVscyA9IFsnZ3JwYycsICd6ZXJvbXEnLCAnaHR0cCddXG4vLyB2YXIgZGVsYXllZE1lc3NhZ2VzID0gZ2xvYmFsLkpFU1VTX05FVF9DTElFTlRfZGVsYXllZE1lc3NhZ2VzID0gZ2xvYmFsLkpFU1VTX05FVF9DTElFTlRfZGVsYXllZE1lc3NhZ2VzIHx8IHt9XG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IHJlcXVpcmUoJy4vdXRpbHMnKS5nZXRDb25zb2xlKHtlcnJvcjogdHJ1ZSwgZGVidWc6IHRydWUsIGxvZzogdHJ1ZSwgd2FybjogdHJ1ZX0sIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TmV0Q2xpZW50UGFja2FnZSAoe3NlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnLCBnZXROZXRDb25maWcsIGdldEV2ZW50c0luLCBnZXRNZXRob2RzQ29uZmlnLCBnZXRScGNPdXQsIGdldEV2ZW50c091dH0pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7Z2V0RXZlbnRzSW4sIGdldE1ldGhvZHNDb25maWcsIGdldE5ldENvbmZpZywgZ2V0UnBjT3V0LCBnZXRFdmVudHNPdXR9LCBQQUNLQUdFKVxuICAgIHZhciBnZXRDaGFubmVsID0gKGNoYW5uZWxOYW1lKSA9PiByZXF1aXJlKGAuL2NoYW5uZWxzLyR7Y2hhbm5lbE5hbWV9LmNsaWVudGApKHtnZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkfSlcblxuICAgIGNvbnN0IGdldEV2ZW50c0Zyb21TZXJ2aWNlcyA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgdmFyIHNlcnZpY2VzRXZlbnRzSW4gPSBhd2FpdCBnZXRFdmVudHNJbignKicsIHNlcnZpY2VOYW1lKVxuICAgICAgQ09OU09MRS5kZWJ1ZygnZ2V0RXZlbnRzRnJvbVNlcnZpY2VzIHNlcnZpY2VzRXZlbnRzSW4nLCBzZXJ2aWNlc0V2ZW50c0luLCBldmVudClcbiAgICAgIHZhciBldmVudENvbmZpZyA9IFtdXG4gICAgICBzZXJ2aWNlc0V2ZW50c0luLmZvckVhY2goY29uZmlnID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMoY29uZmlnLml0ZW1zKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50ID09PSBldmVudE5hbWUgfHwgZXZlbnROYW1lID09PSAnKicpZXZlbnRDb25maWcucHVzaCh7dG86IGNvbmZpZy5zZXJ2aWNlLCBtZXRob2Q6IGNvbmZpZy5pdGVtc1tldmVudE5hbWVdLm1ldGhvZCwgZXZlbnQ6IGNvbmZpZy5pdGVtc1tldmVudE5hbWVdLCBldmVudE5hbWV9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIENPTlNPTEUuZGVidWcoJ2dldEV2ZW50c0Zyb21TZXJ2aWNlcyAnLCBldmVudENvbmZpZylcbiAgICAgIHJldHVybiBldmVudENvbmZpZ1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGVtaXQgKGV2ZW50LCBkYXRhID0ge30sIG1ldGEgPSB7fSwgdGltZW91dCA9IDUwMDApIHtcbiAgICAgIGNoZWNrUmVxdWlyZWQoe2V2ZW50fSwgUEFDS0FHRSlcbiAgICAgIG1ldGEuZXZlbnQgPSBldmVudFxuICAgICAgdmFyIGV2ZW50c091dENvbmZpZ0FsbCA9IGF3YWl0IGdldEV2ZW50c091dCgpXG4gICAgICBpZighZXZlbnRzT3V0Q29uZmlnQWxsW2V2ZW50XSl7XG4gICAgICAgIENPTlNPTEUud2FybihgZXZlbnQgJHtldmVudH0gbm90IGZvdW5kIGluIGNvbmZpZyBFdmVudHNPdXRgLCBldmVudHNPdXRDb25maWdBbGwpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgICB2YXIgZXZlbnRPdXRDb25maWcgPSBldmVudHNPdXRDb25maWdBbGxbZXZlbnRdXG4gICAgICB2YXIgZXZlbnRzSW5Db25maWcgPSBhd2FpdCBnZXRFdmVudHNGcm9tU2VydmljZXMoZXZlbnQpXG4gICAgICBDT05TT0xFLmRlYnVnKCdlbWl0IHN0YXJ0ICcgKyBldmVudCwgeyBldmVudHNPdXRDb25maWdBbGwsZXZlbnRPdXRDb25maWcsZXZlbnRzSW5Db25maWcsIGV2ZW50LCBkYXRhLCBtZXRhLCB0aW1lb3V0IH0pXG4gICAgICBjaGVja1JlcXVpcmVkKHtldmVudE91dENvbmZpZ30sIFBBQ0tBR0UpXG4gICAgICB2YXIgcmVzcG9uc2VzID0gYXdhaXQgUHJvbWlzZS5hbGwoZXZlbnRzSW5Db25maWcubWFwKChycGNDb25maWcpID0+IHJwY0NhbGwoeyB0bzogcnBjQ29uZmlnLnRvLCBtZXRob2Q6IHJwY0NvbmZpZy5tZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXQsIGxvZzogZmFsc2UgfSkpKVxuICAgICAgcmVzcG9uc2VzID0gcmVzcG9uc2VzLmZpbHRlcigocmVzcG9uc2UpID0+IHJlc3BvbnNlICE9PSBudWxsKVxuICAgICAgaWYgKCFldmVudE91dENvbmZpZy5tdWx0aXBsZVJlc3BvbnNlKXJlc3BvbnNlcyA9IHJlc3BvbnNlc1swXSB8fCBudWxsXG4gICAgICBDT05TT0xFLmRlYnVnKCdlbWl0IHJlc3BvbnNlICcgKyBldmVudCwge3Jlc3BvbnNlcywgZXZlbnQsIGV2ZW50c0luQ29uZmlnfSlcbiAgICAgIHJldHVybiByZXNwb25zZXNcbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gcnBjIChycGNOYW1lLCBkYXRhID0ge30sIG1ldGEgPSB7fSwgdGltZW91dCA9IDUwMDApIHtcbiAgICAgIGNoZWNrUmVxdWlyZWQoe3JwY05hbWV9LCBQQUNLQUdFKVxuICAgICAgdmFyIHJwY091dENvbmZpZ0FsbCA9IGF3YWl0IGdldFJwY091dCgpXG4gICAgICB2YXIgcnBjT3V0Q29uZmlnID0gcnBjT3V0Q29uZmlnQWxsW3JwY05hbWVdXG4gICAgICBDT05TT0xFLmRlYnVnKCdycGMoKSBzdGFydCcsIHsgcnBjTmFtZSwgcnBjT3V0Q29uZmlnLCBycGNPdXRDb25maWdBbGx9KVxuICAgICAgY2hlY2tSZXF1aXJlZCh7cnBjT3V0Q29uZmlnfSwgUEFDS0FHRSlcbiAgICAgIGlmIChycGNPdXRDb25maWcudGltZW91dCl0aW1lb3V0ID0gcnBjT3V0Q29uZmlnLnRpbWVvdXRcbiAgICAgIHJldHVybiBhd2FpdCBycGNDYWxsKHt0bzogcnBjT3V0Q29uZmlnLnRvLCBtZXRob2Q6IHJwY091dENvbmZpZy5tZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXQgfSlcbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gcnBjQ2FsbCAoe3RvLCBtZXRob2QsIGRhdGEgPSB7fSwgbWV0YSA9IHt9LCB0aW1lb3V0ID0gNTAwMCB9KSB7XG4gICAgICAvL1xuICAgICAgdHJ5IHtcbiAgICAgICAgY2hlY2tSZXF1aXJlZCh7dG8sIG1ldGhvZH0sIFBBQ0tBR0UpXG4gICAgICAgIHZhciBzZW5kZXJOZXRDb25maWcgPSBhd2FpdCBnZXROZXRDb25maWcoc2VydmljZU5hbWUpXG4gICAgICAgIHZhciBsaXN0ZW5lck5ldENvbmZpZyA9IGF3YWl0IGdldE5ldENvbmZpZyh0bylcbiAgICAgICAgdmFyIGxpc3RlbmVyTWV0aG9kc0NvbmZpZyA9IGF3YWl0IGdldE1ldGhvZHNDb25maWcodG8pXG4gICAgICAgIHZhciBsaXN0ZW5lck1ldGhvZENvbmZpZyA9IGxpc3RlbmVyTWV0aG9kc0NvbmZpZ1ttZXRob2RdXG5cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygncnBjQ2FsbCgpIHN0YXJ0JywgeyB0bywgbWV0aG9kLCBkYXRhLCBtZXRhLCB0aW1lb3V0LCBsaXN0ZW5lck5ldENvbmZpZyB9KVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdycGNDYWxsKCkgc3RhcnQnLCB0byxsaXN0ZW5lck1ldGhvZHNDb25maWcpXG4gICAgICAgIGlmICghbGlzdGVuZXJNZXRob2RzQ29uZmlnW21ldGhvZF0pIHRocm93IG5ldyBFcnJvcihtZXRob2QgKyAnIGlzIG5vdCB2YWxpZCAobm90IGRlZmluZWQgaW4gbGlzdGVuZXIgbWV0aG9kcyBjb25maWcpJylcblxuICAgICAgICB2YXIgY29tbW9uQ2hhbm5lbHMgPSBPYmplY3Qua2V5cyhzZW5kZXJOZXRDb25maWcuY2hhbm5lbHMpLmZpbHRlcigodmFsdWUpID0+IDEgKyBPYmplY3Qua2V5cyhsaXN0ZW5lck5ldENvbmZpZy5jaGFubmVscykuaW5kZXhPZih2YWx1ZSkpXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ2NvbW1vbkNoYW5uZWxzJywgY29tbW9uQ2hhbm5lbHMsIE9iamVjdC5rZXlzKHNlbmRlck5ldENvbmZpZy5jaGFubmVscyksIE9iamVjdC5rZXlzKGxpc3RlbmVyTmV0Q29uZmlnLmNoYW5uZWxzKSlcbiAgICAgICAgaWYgKCFjb21tb25DaGFubmVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihgc2VydmljZSAke3RvfSBhbmQgc2VydmljZSAke3NlcnZpY2VOYW1lfSBoYXZlIG5vIGNvbW1vbiBjaGFubmVsc2ApXG4gICAgICAgIGNvbW1vbkNoYW5uZWxzLnNvcnQoKGEsIGIpID0+IHByZWZlcmVkQ2hhbm5lbHMuaW5kZXhPZihiKSAtIHByZWZlcmVkQ2hhbm5lbHMuaW5kZXhPZihhKSkvLyBsaXN0ZW5lck1ldGhvZCBwcmVmZXJlZENoYW5uZWxzXG5cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygncnBjIGNvbW1vbkNoYW5uZWxzJywge2NvbW1vbkNoYW5uZWxzLCBmaXJzdDogY29tbW9uQ2hhbm5lbHNbMF19KVxuICAgICAgICB2YXIgY2hhbm5lbCA9IGdldENoYW5uZWwoY29tbW9uQ2hhbm5lbHNbMF0pXG5cbiAgICAgICAgdmFyIHNlbmRUbyA9IGxpc3RlbmVyTmV0Q29uZmlnLmNoYW5uZWxzW2NvbW1vbkNoYW5uZWxzWzBdXVxuICAgICAgICB2YXIgd2FpdFJlc3BvbnNlID0gKGxpc3RlbmVyTWV0aG9kQ29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ25vUmVzcG9uc2UnKVxuICAgICAgICB2YXIgaXNTdHJlYW0gPSAobGlzdGVuZXJNZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAnc3RyZWFtJylcbiAgICAgICAgbWV0YSA9IFIubWVyZ2Uoe1xuICAgICAgICAgIHJlcU91dFRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICBmcm9tOiBzZXJ2aWNlTmFtZSxcbiAgICAgICAgICBzdHJlYW06IGlzU3RyZWFtLFxuICAgICAgICAgIHRvXG4gICAgICAgIH0sIG1ldGEpXG4gICAgICAgIHZhciBtZXNzYWdlID0ge21ldGhvZCwgbWV0YSwgZGF0YX1cblxuICAgICAgICAgIC8vIGlmIHN0cmVhbWluZyByZXR1cm4gZXZlbnRFbWl0ZXIgY29uIG9uIGRhdGEsb24gZXJyb3Isb24gZW5kIGFsdHJpbWVudGkgcmlzcG9zdGFcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnPT4gQ0xJRU5UIE9VVCAnLCB7dG86IHNlbmRUbywgbWVzc2FnZSwgd2FpdFJlc3BvbnNlfSlcbiAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgY2hhbm5lbC5zZW5kKHNlbmRUbywgbWVzc2FnZSwgbGlzdGVuZXJNZXRob2RDb25maWcudGltZW91dCwgd2FpdFJlc3BvbnNlLCBpc1N0cmVhbSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnPT4gQ0xJRU5UIElOICBSRVNQT05TRScsIHtyZXNwb25zZX0pXG4gICAgICAgICAgLy8gaWYgKHNpbmdsZVJlc3BvbnNlICYmIHJlc3BvbnNlICYmIHJlc3BvbnNlWzBdKXJlc3BvbnNlID0gcmVzcG9uc2VbMF1cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygncnBjIHRvICcgKyB0byArICcgJyArIG1ldGhvZCArICcgY29ycmlkOicgKyBtZXRhLmNvcnJpZCwge3Jlc3BvbnNlLCBzZW5kVG8sIG1lc3NhZ2UsIHdhaXRSZXNwb25zZX0pXG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgQ09OU09MRS5lcnJvcihlcnJvciwge3RvLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXR9KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBycGMnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgcnBjLCBlbWl0XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtzZXJ2aWNlTmFtZSAsIHNlcnZpY2VJZCAsIGdldE5ldENvbmZpZywgZ2V0RXZlbnRzSW4sIGdldE1ldGhvZHNDb25maWcsIGdldFJwY091dCwgZ2V0RXZlbnRzT3V0fSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBnZXROZXRDbGllbnRQYWNrYWdlJylcbiAgfVxufVxuIl19