'use strict';

var PACKAGE = 'net.client';
var checkRequired = require('./utils').checkRequired;
var R = require('ramda');
var preferedChannels = ['grpc', 'zeromq', 'http'];
// var delayedMessages = global.JESUS_NET_CLIENT_delayedMessages = global.JESUS_NET_CLIENT_delayedMessages || {}

module.exports = function getNetClientPackage(_ref) {
  var _this = this;

  var getConsole = _ref.getConsole,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      getNetConfig = _ref.getNetConfig,
      getEventsIn = _ref.getEventsIn,
      getMethodsConfig = _ref.getMethodsConfig;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  try {
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
              return regeneratorRuntime.awrap(getEventsInConfig(event));

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
      var senderNetConfig, listenerNetConfig, listenerMethodsConfig, listenerMethodConfig, commonChannels, channel, sendTo, waitResponse, isStream, message, response;
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;

              CONSOLE.debug('rpc() start', { to: to, method: method, data: data, meta: meta, timeout: timeout });
              checkRequired({ to: to, method: method });
              _context3.next = 5;
              return regeneratorRuntime.awrap(getNetConfig(serviceName));

            case 5:
              senderNetConfig = _context3.sent;
              _context3.next = 8;
              return regeneratorRuntime.awrap(getNetConfig(to));

            case 8:
              listenerNetConfig = _context3.sent;
              _context3.next = 11;
              return regeneratorRuntime.awrap(getMethodsConfig(to));

            case 11:
              listenerMethodsConfig = _context3.sent;
              listenerMethodConfig = listenerMethodsConfig[method];

              if (listenerMethodsConfig[method]) {
                _context3.next = 15;
                break;
              }

              throw new Error(method + ' is not valid (not defined in listener methods config)');

            case 15:
              commonChannels = Object.keys(senderNetConfig.channels).filter(function (value) {
                return 1 + Object.keys(listenerNetConfig.channels).indexOf(value);
              });

              CONSOLE.debug('commonChannels', commonChannels, Object.keys(senderNetConfig.channels), Object.keys(listenerNetConfig.channels));

              if (commonChannels.length) {
                _context3.next = 19;
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

              CONSOLE.debug('=> CLIENT OUT STREAM', { to: sendTo, message: message, waitResponse: waitResponse });
              _context3.next = 30;
              return regeneratorRuntime.awrap(channel.send(sendTo, message, listenerMethodConfig.timeout, waitResponse, isStream));

            case 30:
              response = _context3.sent;

              CONSOLE.debug('=> CLIENT IN STREAM RESPONSE', { response: response });
              // if (singleResponse && response && response[0])response = response[0]
              CONSOLE.debug('rpc to ' + to + ' ' + method + ' corrid:' + meta.corrid, { response: response, sendTo: sendTo, message: message, waitResponse: waitResponse });
              return _context3.abrupt('return', response);

            case 36:
              _context3.prev = 36;
              _context3.t0 = _context3['catch'](0);

              CONSOLE.error(_context3.t0, { to: to, method: method, data: data, meta: meta, timeout: timeout });
              throw new Error('Error during rpc');

            case 40:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this, [[0, 36]]);
    };

    checkRequired({ getEventsIn: getEventsIn, getMethodsConfig: getMethodsConfig, getNetConfig: getNetConfig });
    var getChannel = function getChannel(channelName) {
      return require('./channels/' + channelName + '.client')({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId });
    };

    var getEventsInConfig = function _callee(event) {
      var servicesEventsIn, eventConfig;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(getEventsIn('*', serviceName));

            case 2:
              servicesEventsIn = _context.sent;
              eventConfig = [];

              servicesEventsIn.forEach(function (config) {
                Object.keys(config.items).forEach(function (eventName) {
                  if (event === eventName || eventName === '*') eventConfig.push({ to: config.service, method: config.items[eventName].method, event: config.items[eventName], eventName: eventName });
                });
              });
              CONSOLE.debug('getEventsInConfig ', eventConfig);
              return _context.abrupt('return', eventConfig);

            case 7:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5jbGllbnQuZXM2Il0sIm5hbWVzIjpbIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwicmVxdWlyZSIsIlIiLCJwcmVmZXJlZENoYW5uZWxzIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldENsaWVudFBhY2thZ2UiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJnZXROZXRDb25maWciLCJnZXRFdmVudHNJbiIsImdldE1ldGhvZHNDb25maWciLCJDT05TT0xFIiwiZW1pdCIsImV2ZW50IiwiZGF0YSIsIm1ldGEiLCJ0aW1lb3V0Iiwic2luZ2xlUmVzcG9uc2UiLCJnZXRFdmVudHNJbkNvbmZpZyIsImV2ZW50Q29uZmlnIiwiZGVidWciLCJQcm9taXNlIiwiYWxsIiwibWFwIiwicnBjQ29uZmlnIiwicnBjIiwidG8iLCJtZXRob2QiLCJsb2ciLCJyZXNwb25zZXMiLCJmaWx0ZXIiLCJyZXNwb25zZSIsInNlbmRlck5ldENvbmZpZyIsImxpc3RlbmVyTmV0Q29uZmlnIiwibGlzdGVuZXJNZXRob2RzQ29uZmlnIiwibGlzdGVuZXJNZXRob2RDb25maWciLCJFcnJvciIsImNvbW1vbkNoYW5uZWxzIiwiT2JqZWN0Iiwia2V5cyIsImNoYW5uZWxzIiwidmFsdWUiLCJpbmRleE9mIiwibGVuZ3RoIiwic29ydCIsImEiLCJiIiwiZmlyc3QiLCJjaGFubmVsIiwiZ2V0Q2hhbm5lbCIsInNlbmRUbyIsIndhaXRSZXNwb25zZSIsInJlc3BvbnNlVHlwZSIsImlzU3RyZWFtIiwibWVyZ2UiLCJyZXFPdXRUaW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZnJvbSIsInN0cmVhbSIsIm1lc3NhZ2UiLCJzZW5kIiwiY29ycmlkIiwiZXJyb3IiLCJjaGFubmVsTmFtZSIsInNlcnZpY2VzRXZlbnRzSW4iLCJmb3JFYWNoIiwiY29uZmlnIiwiaXRlbXMiLCJldmVudE5hbWUiLCJwdXNoIiwic2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFN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T0MsS0FBUCxDQUFhQyxTQUFiLEVBQXdCMUMsTUFBckQsRUFBNkRkLE9BQU9zRCxPQUFPQyxLQUFQLENBQWFDLFNBQWIsQ0FBcEUsRUFBNkZBLG9CQUE3RixFQUFqQjtBQUM5QyxpQkFGRDtBQUdELGVBSkQ7QUFLQTFELHNCQUFRUyxLQUFSLENBQWMsb0JBQWQsRUFBb0NELFdBQXBDO0FBUndCLCtDQVNqQkEsV0FUaUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBMUI7O0FBaUVBLFdBQU87QUFDTE0sY0FESyxFQUNBYjtBQURBLEtBQVA7QUFHRCxHQXhFRCxDQXdFRSxPQUFPbUQsS0FBUCxFQUFjO0FBQ2RwRCxZQUFRb0QsS0FBUixDQUFjQSxLQUFkLEVBQXFCLEVBQUNJLGNBQUQsRUFBckI7QUFDQSxVQUFNLElBQUkvQixLQUFKLENBQVUsa0NBQVYsQ0FBTjtBQUNEO0FBQ0YsQ0E5RUQiLCJmaWxlIjoibmV0LmNsaWVudC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQQUNLQUdFID0gJ25ldC5jbGllbnQnXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi91dGlscycpLmNoZWNrUmVxdWlyZWRcbmNvbnN0IFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcHJlZmVyZWRDaGFubmVscyA9IFsnZ3JwYycsICd6ZXJvbXEnLCAnaHR0cCddXG4vLyB2YXIgZGVsYXllZE1lc3NhZ2VzID0gZ2xvYmFsLkpFU1VTX05FVF9DTElFTlRfZGVsYXllZE1lc3NhZ2VzID0gZ2xvYmFsLkpFU1VTX05FVF9DTElFTlRfZGVsYXllZE1lc3NhZ2VzIHx8IHt9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TmV0Q2xpZW50UGFja2FnZSAoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnLCBnZXROZXRDb25maWcsIGdldEV2ZW50c0luLCBnZXRNZXRob2RzQ29uZmlnfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHtnZXRFdmVudHNJbiwgZ2V0TWV0aG9kc0NvbmZpZywgZ2V0TmV0Q29uZmlnfSlcbiAgICB2YXIgZ2V0Q2hhbm5lbCA9IChjaGFubmVsTmFtZSkgPT4gcmVxdWlyZShgLi9jaGFubmVscy8ke2NoYW5uZWxOYW1lfS5jbGllbnRgKSh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZH0pXG5cbiAgICBjb25zdCBnZXRFdmVudHNJbkNvbmZpZyA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgdmFyIHNlcnZpY2VzRXZlbnRzSW4gPSBhd2FpdCBnZXRFdmVudHNJbignKicsIHNlcnZpY2VOYW1lKVxuICAgICAgdmFyIGV2ZW50Q29uZmlnID0gW11cbiAgICAgIHNlcnZpY2VzRXZlbnRzSW4uZm9yRWFjaChjb25maWcgPT4ge1xuICAgICAgICBPYmplY3Qua2V5cyhjb25maWcuaXRlbXMpLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQgPT09IGV2ZW50TmFtZSB8fCBldmVudE5hbWUgPT09ICcqJylldmVudENvbmZpZy5wdXNoKHt0bzogY29uZmlnLnNlcnZpY2UsIG1ldGhvZDogY29uZmlnLml0ZW1zW2V2ZW50TmFtZV0ubWV0aG9kLCBldmVudDogY29uZmlnLml0ZW1zW2V2ZW50TmFtZV0sIGV2ZW50TmFtZX0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgQ09OU09MRS5kZWJ1ZygnZ2V0RXZlbnRzSW5Db25maWcgJywgZXZlbnRDb25maWcpXG4gICAgICByZXR1cm4gZXZlbnRDb25maWdcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBlbWl0ICh7ZXZlbnQsIGRhdGEgPSB7fSwgbWV0YSA9IHt9LCB0aW1lb3V0ID0gNTAwMCwgc2luZ2xlUmVzcG9uc2UgPSB0cnVlfSkge1xuICAgICAgbWV0YS5ldmVudCA9IGV2ZW50XG4gICAgICB2YXIgZXZlbnRDb25maWcgPSBhd2FpdCBnZXRFdmVudHNJbkNvbmZpZyhldmVudClcbiAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgc3RhcnQgJyArIGV2ZW50LCB7c2luZ2xlUmVzcG9uc2UsIGV2ZW50LCBkYXRhLCBtZXRhLCB0aW1lb3V0LCBldmVudENvbmZpZ30pXG4gICAgICB2YXIgcmVzcG9uc2VzID0gYXdhaXQgUHJvbWlzZS5hbGwoZXZlbnRDb25maWcubWFwKChycGNDb25maWcpID0+IHJwYyh7IHRvOiBycGNDb25maWcudG8sIG1ldGhvZDogcnBjQ29uZmlnLm1ldGhvZCwgZGF0YSwgbWV0YSwgdGltZW91dCwgbG9nOiBmYWxzZSB9KSkpXG4gICAgICByZXNwb25zZXMgPSByZXNwb25zZXMuZmlsdGVyKChyZXNwb25zZSkgPT4gcmVzcG9uc2UgIT09IG51bGwpXG4gICAgICBpZiAoc2luZ2xlUmVzcG9uc2UpcmVzcG9uc2VzID0gcmVzcG9uc2VzWzBdIHx8IG51bGxcbiAgICAgIENPTlNPTEUuZGVidWcoJ2VtaXQgcmVzcG9uc2UnICsgZXZlbnQsIHtyZXNwb25zZXMsIGV2ZW50LCBldmVudENvbmZpZ30pXG4gICAgICByZXR1cm4gcmVzcG9uc2VzXG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gcnBjICh7dG8sIG1ldGhvZCwgZGF0YSA9IHt9LCBtZXRhID0ge30sIHRpbWVvdXQgPSA1MDAwIH0pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3JwYygpIHN0YXJ0JywgeyB0bywgbWV0aG9kLCBkYXRhLCBtZXRhLCB0aW1lb3V0IH0pXG4gICAgICAgIGNoZWNrUmVxdWlyZWQoe3RvLCBtZXRob2R9KVxuICAgICAgICB2YXIgc2VuZGVyTmV0Q29uZmlnID0gYXdhaXQgZ2V0TmV0Q29uZmlnKHNlcnZpY2VOYW1lKVxuICAgICAgICB2YXIgbGlzdGVuZXJOZXRDb25maWcgPSBhd2FpdCBnZXROZXRDb25maWcodG8pXG4gICAgICAgIHZhciBsaXN0ZW5lck1ldGhvZHNDb25maWcgPSBhd2FpdCBnZXRNZXRob2RzQ29uZmlnKHRvKVxuICAgICAgICB2YXIgbGlzdGVuZXJNZXRob2RDb25maWcgPSBsaXN0ZW5lck1ldGhvZHNDb25maWdbbWV0aG9kXVxuXG4gICAgICAgIGlmICghbGlzdGVuZXJNZXRob2RzQ29uZmlnW21ldGhvZF0pIHRocm93IG5ldyBFcnJvcihtZXRob2QgKyAnIGlzIG5vdCB2YWxpZCAobm90IGRlZmluZWQgaW4gbGlzdGVuZXIgbWV0aG9kcyBjb25maWcpJylcblxuICAgICAgICB2YXIgY29tbW9uQ2hhbm5lbHMgPSBPYmplY3Qua2V5cyhzZW5kZXJOZXRDb25maWcuY2hhbm5lbHMpLmZpbHRlcigodmFsdWUpID0+IDEgKyBPYmplY3Qua2V5cyhsaXN0ZW5lck5ldENvbmZpZy5jaGFubmVscykuaW5kZXhPZih2YWx1ZSkpXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ2NvbW1vbkNoYW5uZWxzJywgY29tbW9uQ2hhbm5lbHMsIE9iamVjdC5rZXlzKHNlbmRlck5ldENvbmZpZy5jaGFubmVscyksIE9iamVjdC5rZXlzKGxpc3RlbmVyTmV0Q29uZmlnLmNoYW5uZWxzKSlcbiAgICAgICAgaWYgKCFjb21tb25DaGFubmVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihgc2VydmljZSAke3RvfSBhbmQgc2VydmljZSAke3NlcnZpY2VOYW1lfSBoYXZlIG5vIGNvbW1vbiBjaGFubmVsc2ApXG4gICAgICAgIGNvbW1vbkNoYW5uZWxzLnNvcnQoKGEsIGIpID0+IHByZWZlcmVkQ2hhbm5lbHMuaW5kZXhPZihiKSAtIHByZWZlcmVkQ2hhbm5lbHMuaW5kZXhPZihhKSkvLyBsaXN0ZW5lck1ldGhvZCBwcmVmZXJlZENoYW5uZWxzXG5cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygncnBjIGNvbW1vbkNoYW5uZWxzJywge2NvbW1vbkNoYW5uZWxzLCBmaXJzdDogY29tbW9uQ2hhbm5lbHNbMF19KVxuICAgICAgICB2YXIgY2hhbm5lbCA9IGdldENoYW5uZWwoY29tbW9uQ2hhbm5lbHNbMF0pXG5cbiAgICAgICAgdmFyIHNlbmRUbyA9IGxpc3RlbmVyTmV0Q29uZmlnLmNoYW5uZWxzW2NvbW1vbkNoYW5uZWxzWzBdXVxuICAgICAgICB2YXIgd2FpdFJlc3BvbnNlID0gKGxpc3RlbmVyTWV0aG9kQ29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ25vUmVzcG9uc2UnKVxuICAgICAgICB2YXIgaXNTdHJlYW0gPSAobGlzdGVuZXJNZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAnc3RyZWFtJylcbiAgICAgICAgbWV0YSA9IFIubWVyZ2Uoe1xuICAgICAgICAgIHJlcU91dFRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICBmcm9tOiBzZXJ2aWNlTmFtZSxcbiAgICAgICAgICBzdHJlYW06IGlzU3RyZWFtLFxuICAgICAgICAgIHRvXG4gICAgICAgIH0sIG1ldGEpXG4gICAgICAgIHZhciBtZXNzYWdlID0ge21ldGhvZCwgbWV0YSwgZGF0YX1cblxuICAgICAgICAgIC8vIGlmIHN0cmVhbWluZyByZXR1cm4gZXZlbnRFbWl0ZXIgY29uIG9uIGRhdGEsb24gZXJyb3Isb24gZW5kIGFsdHJpbWVudGkgcmlzcG9zdGFcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnPT4gQ0xJRU5UIE9VVCBTVFJFQU0nLCB7dG86IHNlbmRUbywgbWVzc2FnZSwgd2FpdFJlc3BvbnNlfSlcbiAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgY2hhbm5lbC5zZW5kKHNlbmRUbywgbWVzc2FnZSwgbGlzdGVuZXJNZXRob2RDb25maWcudGltZW91dCwgd2FpdFJlc3BvbnNlLCBpc1N0cmVhbSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnPT4gQ0xJRU5UIElOIFNUUkVBTSBSRVNQT05TRScsIHtyZXNwb25zZX0pXG4gICAgICAgICAgLy8gaWYgKHNpbmdsZVJlc3BvbnNlICYmIHJlc3BvbnNlICYmIHJlc3BvbnNlWzBdKXJlc3BvbnNlID0gcmVzcG9uc2VbMF1cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygncnBjIHRvICcgKyB0byArICcgJyArIG1ldGhvZCArICcgY29ycmlkOicgKyBtZXRhLmNvcnJpZCwge3Jlc3BvbnNlLCBzZW5kVG8sIG1lc3NhZ2UsIHdhaXRSZXNwb25zZX0pXG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgQ09OU09MRS5lcnJvcihlcnJvciwge3RvLCBtZXRob2QsIGRhdGEsIG1ldGEsIHRpbWVvdXR9KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBycGMnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgcnBjLCBlbWl0XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtjb25maWd9KVxuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgZHVyaW5nIGdldE5ldENsaWVudFBhY2thZ2UnKVxuICB9XG59XG4iXX0=