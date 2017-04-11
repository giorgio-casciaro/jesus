'use strict';

var PACKAGE = 'net.client';
var checkRequired = require('./utils').checkRequired;
var R = require('ramda');
var preferedChannels = ['grpc', 'zeromq', 'http'];
// var delayedMessages = global.JESUS_NET_CLIENT_delayedMessages = global.JESUS_NET_CLIENT_delayedMessages || {}
var getConsole = function getConsole(serviceName, serviceId, pack) {
  return require('./utils').getConsole({ error: true, debug: true, log: false, warn: true }, serviceName, serviceId, pack);
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
              eventOutConfig = eventsOutConfigAll[event];
              _context2.next = 8;
              return regeneratorRuntime.awrap(getEventsFromServices(event));

            case 8:
              eventsInConfig = _context2.sent;

              CONSOLE.debug('emit start ' + event, { eventsOutConfigAll: eventsOutConfigAll, eventOutConfig: eventOutConfig, eventsInConfig: eventsInConfig, event: event, data: data, meta: meta, timeout: timeout });
              checkRequired({ eventOutConfig: eventOutConfig }, PACKAGE);
              _context2.next = 13;
              return regeneratorRuntime.awrap(Promise.all(eventsInConfig.map(function (rpcConfig) {
                return rpcCall({ to: rpcConfig.to, method: rpcConfig.method, data: data, meta: meta, timeout: timeout, log: false });
              })));

            case 13:
              responses = _context2.sent;

              responses = responses.filter(function (response) {
                return response !== null;
              });
              if (!eventOutConfig.multipleResponse) responses = responses[0] || null;
              CONSOLE.debug('emit response ' + event, { responses: responses, event: event, eventsInConfig: eventsInConfig });
              return _context2.abrupt('return', responses);

            case 18:
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

              if (listenerMethodsConfig[method]) {
                _context4.next = 15;
                break;
              }

              throw new Error(method + ' is not valid (not defined in listener methods config)');

            case 15:
              commonChannels = Object.keys(senderNetConfig.channels).filter(function (value) {
                return 1 + Object.keys(listenerNetConfig.channels).indexOf(value);
              });

              CONSOLE.debug('commonChannels', commonChannels, Object.keys(senderNetConfig.channels), Object.keys(listenerNetConfig.channels));

              if (commonChannels.length) {
                _context4.next = 19;
                break;
              }

              throw new Error('service ' + to + ' and service ' + serviceName + ' have no common channels');

            case 19:
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
              _context4.next = 30;
              return regeneratorRuntime.awrap(channel.send(sendTo, message, listenerMethodConfig.timeout, waitResponse, isStream));

            case 30:
              response = _context4.sent;

              CONSOLE.debug('=> CLIENT IN  RESPONSE', { response: response });
              // if (singleResponse && response && response[0])response = response[0]
              CONSOLE.debug('rpc to ' + to + ' ' + method + ' corrid:' + meta.corrid, { response: response, sendTo: sendTo, message: message, waitResponse: waitResponse });
              return _context4.abrupt('return', response);

            case 36:
              _context4.prev = 36;
              _context4.t0 = _context4['catch'](0);

              CONSOLE.error(_context4.t0, { to: to, method: method, data: data, meta: meta, timeout: timeout });
              throw new Error('Error during rpc');

            case 40:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, this, [[0, 36]]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicmVxdWlyZSIsIlIiLCJwcmVmZXJlZENoYW5uZWxzIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsImVycm9yIiwiZGVidWciLCJsb2ciLCJ3YXJuIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldENsaWVudFBhY2thZ2UiLCJnZXROZXRDb25maWciLCJnZXRFdmVudHNJbiIsImdldE1ldGhvZHNDb25maWciLCJnZXRScGNPdXQiLCJnZXRFdmVudHNPdXQiLCJDT05TT0xFIiwiZW1pdCIsImV2ZW50IiwiZGF0YSIsIm1ldGEiLCJ0aW1lb3V0IiwiZXZlbnRzT3V0Q29uZmlnQWxsIiwiZXZlbnRPdXRDb25maWciLCJnZXRFdmVudHNGcm9tU2VydmljZXMiLCJldmVudHNJbkNvbmZpZyIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJycGNDb25maWciLCJycGNDYWxsIiwidG8iLCJtZXRob2QiLCJyZXNwb25zZXMiLCJmaWx0ZXIiLCJyZXNwb25zZSIsIm11bHRpcGxlUmVzcG9uc2UiLCJycGMiLCJycGNOYW1lIiwicnBjT3V0Q29uZmlnQWxsIiwicnBjT3V0Q29uZmlnIiwic2VuZGVyTmV0Q29uZmlnIiwibGlzdGVuZXJOZXRDb25maWciLCJsaXN0ZW5lck1ldGhvZHNDb25maWciLCJsaXN0ZW5lck1ldGhvZENvbmZpZyIsIkVycm9yIiwiY29tbW9uQ2hhbm5lbHMiLCJPYmplY3QiLCJrZXlzIiwiY2hhbm5lbHMiLCJ2YWx1ZSIsImluZGV4T2YiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmaXJzdCIsImNoYW5uZWwiLCJnZXRDaGFubmVsIiwic2VuZFRvIiwid2FpdFJlc3BvbnNlIiwicmVzcG9uc2VUeXBlIiwiaXNTdHJlYW0iLCJtZXJnZSIsInJlcU91dFRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJmcm9tIiwic3RyZWFtIiwibWVzc2FnZSIsInNlbmQiLCJjb3JyaWQiLCJjaGFubmVsTmFtZSIsInNlcnZpY2VzRXZlbnRzSW4iLCJldmVudENvbmZpZyIsImZvckVhY2giLCJjb25maWciLCJpdGVtcyIsImV2ZW50TmFtZSIsInB1c2giLCJzZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFVBQVUsWUFBaEI7QUFDQSxJQUFNQyxnQkFBZ0JDLFFBQVEsU0FBUixFQUFtQkQsYUFBekM7QUFDQSxJQUFNRSxJQUFJRCxRQUFRLE9BQVIsQ0FBVjtBQUNBLElBQUlFLG1CQUFtQixDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLE1BQW5CLENBQXZCO0FBQ0E7QUFDQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0MsV0FBRCxFQUFjQyxTQUFkLEVBQXlCQyxJQUF6QjtBQUFBLFNBQWtDTixRQUFRLFNBQVIsRUFBbUJHLFVBQW5CLENBQThCLEVBQUNJLE9BQU8sSUFBUixFQUFjQyxPQUFPLElBQXJCLEVBQTJCQyxLQUFLLEtBQWhDLEVBQXVDQyxNQUFNLElBQTdDLEVBQTlCLEVBQWtGTixXQUFsRixFQUErRkMsU0FBL0YsRUFBMEdDLElBQTFHLENBQWxDO0FBQUEsQ0FBbkI7O0FBRUFLLE9BQU9DLE9BQVAsR0FBaUIsU0FBU0MsbUJBQVQsT0FBb0o7QUFBQTs7QUFBQSw4QkFBckhULFdBQXFIO0FBQUEsTUFBckhBLFdBQXFILG9DQUF2RyxRQUF1RztBQUFBLDRCQUE3RkMsU0FBNkY7QUFBQSxNQUE3RkEsU0FBNkYsa0NBQWpGLFFBQWlGO0FBQUEsTUFBdkVTLFlBQXVFLFFBQXZFQSxZQUF1RTtBQUFBLE1BQXpEQyxXQUF5RCxRQUF6REEsV0FBeUQ7QUFBQSxNQUE1Q0MsZ0JBQTRDLFFBQTVDQSxnQkFBNEM7QUFBQSxNQUExQkMsU0FBMEIsUUFBMUJBLFNBQTBCO0FBQUEsTUFBZkMsWUFBZSxRQUFmQSxZQUFlOztBQUNuSyxNQUFJQyxVQUFVaEIsV0FBV0MsV0FBWCxFQUF3QkMsU0FBeEIsRUFBbUNQLE9BQW5DLENBQWQ7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Y29uc3QgUEFDS0FHRSA9ICduZXQuY2xpZW50J1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vdXRpbHMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIHByZWZlcmVkQ2hhbm5lbHMgPSBbJ2dycGMnLCAnemVyb21xJywgJ2h0dHAnXVxuLy8gdmFyIGRlbGF5ZWRNZXNzYWdlcyA9IGdsb2JhbC5KRVNVU19ORVRfQ0xJRU5UX2RlbGF5ZWRNZXNzYWdlcyA9IGdsb2JhbC5KRVNVU19ORVRfQ0xJRU5UX2RlbGF5ZWRNZXNzYWdlcyB8fCB7fVxuY29uc3QgZ2V0Q29uc29sZSA9IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiByZXF1aXJlKCcuL3V0aWxzJykuZ2V0Q29uc29sZSh7ZXJyb3I6IHRydWUsIGRlYnVnOiB0cnVlLCBsb2c6IGZhbHNlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXROZXRDbGllbnRQYWNrYWdlICh7c2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycsIGdldE5ldENvbmZpZywgZ2V0RXZlbnRzSW4sIGdldE1ldGhvZHNDb25maWcsIGdldFJwY091dCwgZ2V0RXZlbnRzT3V0fSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHtnZXRFdmVudHNJbiwgZ2V0TWV0aG9kc0NvbmZpZywgZ2V0TmV0Q29uZmlnLCBnZXRScGNPdXQsIGdldEV2ZW50c091dH0sIFBBQ0tBR0UpXG4gICAgdmFyIGdldENoYW5uZWwgPSAoY2hhbm5lbE5hbWUpID0+IHJlcXVpcmUoYC4vY2hhbm5lbHMvJHtjaGFubmVsTmFtZX0uY2xpZW50YCkoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWR9KVxuXG4gICAgY29uc3QgZ2V0RXZlbnRzRnJvbVNlcnZpY2VzID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICB2YXIgc2VydmljZXNFdmVudHNJbiA9IGF3YWl0IGdldEV2ZW50c0luKCcqJywgc2VydmljZU5hbWUpXG4gICAgICBDT05TT0xFLmRlYnVnKCdnZXRFdmVudHNGcm9tU2VydmljZXMgc2VydmljZXNFdmVudHNJbicsIHNlcnZpY2VzRXZlbnRzSW4sIGV2ZW50KVxuICAgICAgdmFyIGV2ZW50Q29uZmlnID0gW11cbiAgICAgIHNlcnZpY2VzRXZlbnRzSW4uZm9yRWFjaChjb25maWcgPT4ge1xuICAgICAgICBPYmplY3Qua2V5cyhjb25maWcuaXRlbXMpLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQgPT09IGV2ZW50TmFtZSB8fCBldmVudE5hbWUgPT09ICcqJylldmVudENvbmZpZy5wdXNoKHt0bzogY29uZmlnLnNlcnZpY2UsIG1ldGhvZDogY29uZmlnLml0ZW1zW2V2ZW50TmFtZV0ubWV0aG9kLCBldmVudDogY29uZmlnLml0ZW1zW2V2ZW50TmFtZV0sIGV2ZW50TmFtZX0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgQ09OU09MRS5kZWJ1ZygnZ2V0RXZlbnRzRnJvbVNlcnZpY2VzICcsIGV2ZW50Q29uZmlnKVxuICAgICAgcmV0dXJuIGV2ZW50Q29uZmlnXG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZW1pdCAoZXZlbnQsIGRhdGEgPSB7fSwgbWV0YSA9IHt9LCB0aW1lb3V0ID0gNTAwMCkge1xuICAgICAgY2hlY2tSZXF1aXJlZCh7ZXZlbnR9LCBQQUNLQUdFKVxuICAgICAgbWV0YS5ldmVudCA9IGV2ZW50XG4gICAgICB2YXIgZXZlbnRzT3V0Q29uZmlnQWxsID0gYXdhaXQgZ2V0RXZlbnRzT3V0KClcbiAgICAgIHZhciBldmVudE91dENvbmZpZyA9IGV2ZW50c091dENvbmZpZ0FsbFtldmVudF1cbiAgICAgIHZhciBldmVudHNJbkNvbmZpZyA9IGF3YWl0IGdldEV2ZW50c0Zyb21TZXJ2aWNlcyhldmVudClcbiAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgc3RhcnQgJyArIGV2ZW50LCB7IGV2ZW50c091dENvbmZpZ0FsbCxldmVudE91dENvbmZpZyxldmVudHNJbkNvbmZpZywgZXZlbnQsIGRhdGEsIG1ldGEsIHRpbWVvdXQgfSlcbiAgICAgIGNoZWNrUmVxdWlyZWQoe2V2ZW50T3V0Q29uZmlnfSwgUEFDS0FHRSlcbiAgICAgIHZhciByZXNwb25zZXMgPSBhd2FpdCBQcm9taXNlLmFsbChldmVudHNJbkNvbmZpZy5tYXAoKHJwY0NvbmZpZykgPT4gcnBjQ2FsbCh7IHRvOiBycGNDb25maWcudG8sIG1ldGhvZDogcnBjQ29uZmlnLm1ldGhvZCwgZGF0YSwgbWV0YSwgdGltZW91dCwgbG9nOiBmYWxzZSB9KSkpXG4gICAgICByZXNwb25zZXMgPSByZXNwb25zZXMuZmlsdGVyKChyZXNwb25zZSkgPT4gcmVzcG9uc2UgIT09IG51bGwpXG4gICAgICBpZiAoIWV2ZW50T3V0Q29uZmlnLm11bHRpcGxlUmVzcG9uc2UpcmVzcG9uc2VzID0gcmVzcG9uc2VzWzBdIHx8IG51bGxcbiAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgcmVzcG9uc2UgJyArIGV2ZW50LCB7cmVzcG9uc2VzLCBldmVudCwgZXZlbnRzSW5Db25maWd9KVxuICAgICAgcmV0dXJuIHJlc3BvbnNlc1xuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBycGMgKHJwY05hbWUsIGRhdGEgPSB7fSwgbWV0YSA9IHt9LCB0aW1lb3V0ID0gNTAwMCkge1xuICAgICAgY2hlY2tSZXF1aXJlZCh7cnBjTmFtZX0sIFBBQ0tBR0UpXG4gICAgICB2YXIgcnBjT3V0Q29uZmlnQWxsID0gYXdhaXQgZ2V0UnBjT3V0KClcbiAgICAgIHZhciBycGNPdXRDb25maWcgPSBycGNPdXRDb25maWdBbGxbcnBjTmFtZV1cbiAgICAgIENPTlNPTEUuZGVidWcoJ3JwYygpIHN0YXJ0JywgeyBycGNOYW1lLCBycGNPdXRDb25maWcsIHJwY091dENvbmZpZ0FsbH0pXG4gICAgICBjaGVja1JlcXVpcmVkKHtycGNPdXRDb25maWd9LCBQQUNLQUdFKVxuICAgICAgaWYgKHJwY091dENvbmZpZy50aW1lb3V0KXRpbWVvdXQgPSBycGNPdXRDb25maWcudGltZW91dFxuICAgICAgcmV0dXJuIGF3YWl0IHJwY0NhbGwoe3RvOiBycGNPdXRDb25maWcudG8sIG1ldGhvZDogcnBjT3V0Q29uZmlnLm1ldGhvZCwgZGF0YSwgbWV0YSwgdGltZW91dCB9KVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBycGNDYWxsICh7dG8sIG1ldGhvZCwgZGF0YSA9IHt9LCBtZXRhID0ge30sIHRpbWVvdXQgPSA1MDAwIH0pIHtcbiAgICAgIC8vXG4gICAgICB0cnkge1xuICAgICAgICBjaGVja1JlcXVpcmVkKHt0bywgbWV0aG9kfSwgUEFDS0FHRSlcbiAgICAgICAgdmFyIHNlbmRlck5ldENvbmZpZyA9IGF3YWl0IGdldE5ldENvbmZpZyhzZXJ2aWNlTmFtZSlcbiAgICAgICAgdmFyIGxpc3RlbmVyTmV0Q29uZmlnID0gYXdhaXQgZ2V0TmV0Q29uZmlnKHRvKVxuICAgICAgICB2YXIgbGlzdGVuZXJNZXRob2RzQ29uZmlnID0gYXdhaXQgZ2V0TWV0aG9kc0NvbmZpZyh0bylcbiAgICAgICAgdmFyIGxpc3RlbmVyTWV0aG9kQ29uZmlnID0gbGlzdGVuZXJNZXRob2RzQ29uZmlnW21ldGhvZF1cblxuICAgICAgICBDT05TT0xFLmRlYnVnKCdycGNDYWxsKCkgc3RhcnQnLCB7IHRvLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXQsIGxpc3RlbmVyTmV0Q29uZmlnIH0pXG4gICAgICAgIGlmICghbGlzdGVuZXJNZXRob2RzQ29uZmlnW21ldGhvZF0pIHRocm93IG5ldyBFcnJvcihtZXRob2QgKyAnIGlzIG5vdCB2YWxpZCAobm90IGRlZmluZWQgaW4gbGlzdGVuZXIgbWV0aG9kcyBjb25maWcpJylcblxuICAgICAgICB2YXIgY29tbW9uQ2hhbm5lbHMgPSBPYmplY3Qua2V5cyhzZW5kZXJOZXRDb25maWcuY2hhbm5lbHMpLmZpbHRlcigodmFsdWUpID0+IDEgKyBPYmplY3Qua2V5cyhsaXN0ZW5lck5ldENvbmZpZy5jaGFubmVscykuaW5kZXhPZih2YWx1ZSkpXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ2NvbW1vbkNoYW5uZWxzJywgY29tbW9uQ2hhbm5lbHMsIE9iamVjdC5rZXlzKHNlbmRlck5ldENvbmZpZy5jaGFubmVscyksIE9iamVjdC5rZXlzKGxpc3RlbmVyTmV0Q29uZmlnLmNoYW5uZWxzKSlcbiAgICAgICAgaWYgKCFjb21tb25DaGFubmVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihgc2VydmljZSAke3RvfSBhbmQgc2VydmljZSAke3NlcnZpY2VOYW1lfSBoYXZlIG5vIGNvbW1vbiBjaGFubmVsc2ApXG4gICAgICAgIGNvbW1vbkNoYW5uZWxzLnNvcnQoKGEsIGIpID0+IHByZWZlcmVkQ2hhbm5lbHMuaW5kZXhPZihiKSAtIHByZWZlcmVkQ2hhbm5lbHMuaW5kZXhPZihhKSkvLyBsaXN0ZW5lck1ldGhvZCBwcmVmZXJlZENoYW5uZWxzXG5cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygncnBjIGNvbW1vbkNoYW5uZWxzJywge2NvbW1vbkNoYW5uZWxzLCBmaXJzdDogY29tbW9uQ2hhbm5lbHNbMF19KVxuICAgICAgICB2YXIgY2hhbm5lbCA9IGdldENoYW5uZWwoY29tbW9uQ2hhbm5lbHNbMF0pXG5cbiAgICAgICAgdmFyIHNlbmRUbyA9IGxpc3RlbmVyTmV0Q29uZmlnLmNoYW5uZWxzW2NvbW1vbkNoYW5uZWxzWzBdXVxuICAgICAgICB2YXIgd2FpdFJlc3BvbnNlID0gKGxpc3RlbmVyTWV0aG9kQ29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ25vUmVzcG9uc2UnKVxuICAgICAgICB2YXIgaXNTdHJlYW0gPSAobGlzdGVuZXJNZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAnc3RyZWFtJylcbiAgICAgICAgbWV0YSA9IFIubWVyZ2Uoe1xuICAgICAgICAgIHJlcU91dFRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICBmcm9tOiBzZXJ2aWNlTmFtZSxcbiAgICAgICAgICBzdHJlYW06IGlzU3RyZWFtLFxuICAgICAgICAgIHRvXG4gICAgICAgIH0sIG1ldGEpXG4gICAgICAgIHZhciBtZXNzYWdlID0ge21ldGhvZCwgbWV0YSwgZGF0YX1cblxuICAgICAgICAgIC8vIGlmIHN0cmVhbWluZyByZXR1cm4gZXZlbnRFbWl0ZXIgY29uIG9uIGRhdGEsb24gZXJyb3Isb24gZW5kIGFsdHJpbWVudGkgcmlzcG9zdGFcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnPT4gQ0xJRU5UIE9VVCAnLCB7dG86IHNlbmRUbywgbWVzc2FnZSwgd2FpdFJlc3BvbnNlfSlcbiAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgY2hhbm5lbC5zZW5kKHNlbmRUbywgbWVzc2FnZSwgbGlzdGVuZXJNZXRob2RDb25maWcudGltZW91dCwgd2FpdFJlc3BvbnNlLCBpc1N0cmVhbSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnPT4gQ0xJRU5UIElOICBSRVNQT05TRScsIHtyZXNwb25zZX0pXG4gICAgICAgICAgLy8gaWYgKHNpbmdsZVJlc3BvbnNlICYmIHJlc3BvbnNlICYmIHJlc3BvbnNlWzBdKXJlc3BvbnNlID0gcmVzcG9uc2VbMF1cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygncnBjIHRvICcgKyB0byArICcgJyArIG1ldGhvZCArICcgY29ycmlkOicgKyBtZXRhLmNvcnJpZCwge3Jlc3BvbnNlLCBzZW5kVG8sIG1lc3NhZ2UsIHdhaXRSZXNwb25zZX0pXG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgQ09OU09MRS5lcnJvcihlcnJvciwge3RvLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXR9KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBycGMnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgcnBjLCBlbWl0XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtzZXJ2aWNlTmFtZSAsIHNlcnZpY2VJZCAsIGdldE5ldENvbmZpZywgZ2V0RXZlbnRzSW4sIGdldE1ldGhvZHNDb25maWcsIGdldFJwY091dCwgZ2V0RXZlbnRzT3V0fSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBnZXROZXRDbGllbnRQYWNrYWdlJylcbiAgfVxufVxuIl19