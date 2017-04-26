'use strict';

var R = require('ramda');
var uuidV4 = require('uuid/v4');
var ajv = require('ajv')({ allErrors: true });
var PACKAGE = 'net.server';
var checkRequired = require('./utils').checkRequired;
var validateMsg = ajv.compile(require('./schemas/message.schema.json'));

var getConsole = function getConsole(serviceName, serviceId, pack) {
  return require('./utils').getConsole({ error: true, debug: true, log: true, warn: true }, serviceName, serviceId, pack);
};

module.exports = function getNetServerPackage(_ref) {
  var _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      getMethods = _ref.getMethods,
      getMethodsConfig = _ref.getMethodsConfig,
      getNetConfig = _ref.getNetConfig;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  checkRequired({ getMethods: getMethods, getMethodsConfig: getMethodsConfig, getConsole: getConsole, getNetConfig: getNetConfig }, PACKAGE);
  CONSOLE.debug('getNetServerPackage ', {});
  var validateRequest = function validateRequest(data) {
    if (!validateMsg(data)) {
      CONSOLE.error('MESSAGE IS NOT VALID ', { errors: validate.errors });
      throw new Error('MESSAGE IS NOT VALID', { errors: validateMsg.errors });
    } else return data;
  };
  var validateResponse = function validateResponse(methodConfig, methodName, data) {
    var schemaField = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'requestSchema';

    CONSOLE.debug('validate ', { methodConfig: methodConfig, methodName: methodName, data: data, schemaField: schemaField });
    if (!methodConfig[schemaField]) throw new Error(schemaField + ' not defined in methods.json ' + methodName);
    var validate = ajv.compile(methodConfig[schemaField]);
    var valid = validate(data);
    if (!valid) {
      CONSOLE.error('validation errors ', { errors: validate.errors, methodName: methodName, data: data, schemaField: schemaField });
      throw new Error('validation error ', { errors: validate.errors });
    } else return data;
  };
  try {
    // var defaultEventListen = require('./default.event.listen.json')
    var config;

    var getChannel = function getChannel(channelName) {
      return require('./channels/' + channelName + '.server')({ getConsole: getConsole, methodCall: methodCall, serviceName: serviceName, serviceId: serviceId, config: config.channels[channelName] });
    };
    var forEachChannel = function forEachChannel(func) {
      return Object.keys(config.channels).forEach(function (channelName) {
        return func(getChannel(channelName));
      });
    };

    // ogni method call può avere più dati anche dauserid e requestid diversi
    var methodCall = function methodCall(message, getStream) {
      var publicApi = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var channel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'UNKNOW';
      var methodName, meta, data, serviceMethodsConfig, methods, method, methodConfig, response;
      return regeneratorRuntime.async(function methodCall$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              CONSOLE.log('=> SERVER IN', { message: message });
              validateRequest(message);

              methodName = message.method;
              meta = message.meta || {};

              meta.corrid = meta.corrid || uuidV4();
              meta.userid = meta.userid || 'UNKNOW';
              meta.from = meta.from || 'UNKNOW';
              meta.reqInTimestamp = Date.now();
              meta.channel = channel;
              data = message.data || {};
              _context.next = 13;
              return regeneratorRuntime.awrap(getMethodsConfig(serviceName));

            case 13:
              serviceMethodsConfig = _context.sent;
              _context.next = 16;
              return regeneratorRuntime.awrap(getMethods());

            case 16:
              methods = _context.sent;

              if (serviceMethodsConfig[methodName]) {
                _context.next = 19;
                break;
              }

              throw new Error(methodName + ' is not valid (not defined in methods config)');

            case 19:
              if (!(!serviceMethodsConfig[methodName].public && publicApi)) {
                _context.next = 21;
                break;
              }

              throw new Error(methodName + ' is not public');

            case 21:
              if (methods[methodName]) {
                _context.next = 23;
                break;
              }

              throw new Error(methodName + ' is not valid (not defined service methods js file)');

            case 23:
              method = methods[methodName];
              methodConfig = serviceMethodsConfig[methodName];

              CONSOLE.debug('methodCall', { message: message, getStream: getStream, publicApi: publicApi, serviceMethodsConfig: serviceMethodsConfig, methodConfig: methodConfig }, serviceName);

              data = validateResponse(methodConfig, methodName, data, 'requestSchema');

              if (!(methodConfig.responseType === 'noResponse' || methodConfig.responseType === 'aknowlegment')) {
                _context.next = 32;
                break;
              }

              method(data, meta, getStream || null);
              response = null;
              _context.next = 42;
              break;

            case 32:
              if (!(methodConfig.responseType === 'response')) {
                _context.next = 39;
                break;
              }

              _context.next = 35;
              return regeneratorRuntime.awrap(method(data, meta, getStream || null));

            case 35:
              response = _context.sent;

              response = validateResponse(methodConfig, methodName, response, 'responseSchema');
              _context.next = 42;
              break;

            case 39:
              _context.next = 41;
              return regeneratorRuntime.awrap(method(data, meta, getStream || null));

            case 41:
              response = _context.sent;

            case 42:

              CONSOLE.log('SERVER OUT => ', { response: response, responseType: methodConfig.responseType });
              CONSOLE.debug('MAIN RESPONSE ' + methodName, response);
              return _context.abrupt('return', response);

            case 47:
              _context.prev = 47;
              _context.t0 = _context['catch'](0);

              CONSOLE.error(_context.t0, { methodName: methodName });
              throw new Error('Error during methodCall');

            case 51:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this, [[0, 47]]);
    };
    return {
      start: function start() {
        return regeneratorRuntime.async(function start$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return regeneratorRuntime.awrap(getNetConfig(serviceName));

              case 2:
                config = _context2.sent;

                CONSOLE.debug('START CHANNELS SERVERS ', config);
                checkRequired({ channels: config.channels }, PACKAGE);
                forEachChannel(function (channel) {
                  return channel.start();
                });

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, null, this);
      },
      stop: function stop() {
        CONSOLE.debug('STOP CHANNELS SERVERS ', { channels: config.channels });
        forEachChannel(function (channel) {
          return channel.stop();
        });
      },
      restart: function restart() {
        CONSOLE.debug('RESTART CHANNELS SERVERS ', { channels: config.channels });
        forEachChannel(function (channel) {
          return channel.restart();
        });
      }
    };
  } catch (error) {
    CONSOLE.error(error);
    throw new Error('Error during getNetServerPackage');
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwidXVpZFY0IiwiYWp2IiwiYWxsRXJyb3JzIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJ2YWxpZGF0ZU1zZyIsImNvbXBpbGUiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwYWNrIiwiZXJyb3IiLCJkZWJ1ZyIsImxvZyIsIndhcm4iLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0TmV0U2VydmVyUGFja2FnZSIsImdldE1ldGhvZHMiLCJnZXRNZXRob2RzQ29uZmlnIiwiZ2V0TmV0Q29uZmlnIiwiQ09OU09MRSIsInZhbGlkYXRlUmVxdWVzdCIsImRhdGEiLCJlcnJvcnMiLCJ2YWxpZGF0ZSIsIkVycm9yIiwidmFsaWRhdGVSZXNwb25zZSIsIm1ldGhvZENvbmZpZyIsIm1ldGhvZE5hbWUiLCJzY2hlbWFGaWVsZCIsInZhbGlkIiwiY29uZmlnIiwiZ2V0Q2hhbm5lbCIsImNoYW5uZWxOYW1lIiwibWV0aG9kQ2FsbCIsImNoYW5uZWxzIiwiZm9yRWFjaENoYW5uZWwiLCJmdW5jIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJtZXNzYWdlIiwiZ2V0U3RyZWFtIiwicHVibGljQXBpIiwiY2hhbm5lbCIsIm1ldGhvZCIsIm1ldGEiLCJjb3JyaWQiLCJ1c2VyaWQiLCJmcm9tIiwicmVxSW5UaW1lc3RhbXAiLCJEYXRlIiwibm93Iiwic2VydmljZU1ldGhvZHNDb25maWciLCJtZXRob2RzIiwicHVibGljIiwicmVzcG9uc2VUeXBlIiwicmVzcG9uc2UiLCJzdGFydCIsInN0b3AiLCJyZXN0YXJ0Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBTUMsU0FBU0QsUUFBUSxTQUFSLENBQWY7QUFDQSxJQUFJRSxNQUFNRixRQUFRLEtBQVIsRUFBZSxFQUFDRyxXQUFXLElBQVosRUFBZixDQUFWO0FBQ0EsSUFB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QUF4QztBQUNBQyx1QkFBZSxVQUFDUSxPQUFEO0FBQUEsaUJBQWFBLFFBQVFlLElBQVIsRUFBYjtBQUFBLFNBQWY7QUFDRCxPQVZJO0FBV0xDLGFBWEsscUJBV007QUFDVHhDLGdCQUFRVCxLQUFSLENBQWMsMkJBQWQsRUFBMkMsRUFBQ3dCLFVBQVVKLE9BQU9JLFFBQWxCLEVBQTNDO0FBQ0FDLHVCQUFlLFVBQUNRLE9BQUQ7QUFBQSxpQkFBYUEsUUFBUWdCLE9BQVIsRUFBYjtBQUFBLFNBQWY7QUFDRDtBQWRJLEtBQVA7QUFnQkQsR0F0RUQsQ0FzRUUsT0FBT2xELEtBQVAsRUFBYztBQUNkVSxZQUFRVixLQUFSLENBQWNBLEtBQWQ7QUFDQSxVQUFNLElBQUllLEtBQUosQ0FBVSxrQ0FBVixDQUFOO0FBQ0Q7QUFDRixDQTlGRCIsImZpbGUiOiJuZXQuc2VydmVyLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxuY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG52YXIgYWp2ID0gcmVxdWlyZSgnYWp2Jykoe2FsbEVycm9yczogdHJ1ZX0pXG5jb25zdCBQQUNLQUdFID0gJ25ldC5zZXJ2ZXInXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi91dGlscycpLmNoZWNrUmVxdWlyZWRcbnZhciB2YWxpZGF0ZU1zZyA9IGFqdi5jb21waWxlKHJlcXVpcmUoJy4vc2NoZW1hcy9tZXNzYWdlLnNjaGVtYS5qc29uJykpXG5cbmNvbnN0IGdldENvbnNvbGUgPSAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykgPT4gcmVxdWlyZSgnLi91dGlscycpLmdldENvbnNvbGUoe2Vycm9yOiB0cnVlLCBkZWJ1ZzogdHJ1ZSwgbG9nOiB0cnVlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaylcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE5ldFNlcnZlclBhY2thZ2UgKHsgIHNlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnLCBnZXRNZXRob2RzLCBnZXRNZXRob2RzQ29uZmlnLCBnZXROZXRDb25maWd9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICBjaGVja1JlcXVpcmVkKHtnZXRNZXRob2RzLCBnZXRNZXRob2RzQ29uZmlnLCBnZXRDb25zb2xlLCBnZXROZXRDb25maWd9LCBQQUNLQUdFKVxuICBDT05TT0xFLmRlYnVnKCdnZXROZXRTZXJ2ZXJQYWNrYWdlICcsIHsgfSlcbiAgdmFyIHZhbGlkYXRlUmVxdWVzdCA9IChkYXRhKSA9PiB7XG4gICAgaWYgKCF2YWxpZGF0ZU1zZyhkYXRhKSkge1xuICAgICAgQ09OU09MRS5lcnJvcignTUVTU0FHRSBJUyBOT1QgVkFMSUQgJywge2Vycm9yczogdmFsaWRhdGUuZXJyb3JzfSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignTUVTU0FHRSBJUyBOT1QgVkFMSUQnLCB7ZXJyb3JzOiB2YWxpZGF0ZU1zZy5lcnJvcnN9KVxuICAgIH0gZWxzZSByZXR1cm4gZGF0YVxuICB9XG4gIHZhciB2YWxpZGF0ZVJlc3BvbnNlID0gKG1ldGhvZENvbmZpZywgbWV0aG9kTmFtZSwgZGF0YSwgc2NoZW1hRmllbGQgPSAncmVxdWVzdFNjaGVtYScpID0+IHtcbiAgICBDT05TT0xFLmRlYnVnKCd2YWxpZGF0ZSAnLCB7IG1ldGhvZENvbmZpZywgbWV0aG9kTmFtZSwgZGF0YSwgc2NoZW1hRmllbGQgfSlcbiAgICBpZiAoIW1ldGhvZENvbmZpZ1tzY2hlbWFGaWVsZF0pIHRocm93IG5ldyBFcnJvcihzY2hlbWFGaWVsZCArICcgbm90IGRlZmluZWQgaW4gbWV0aG9kcy5qc29uICcgKyBtZXRob2ROYW1lKVxuICAgIHZhciB2YWxpZGF0ZSA9IGFqdi5jb21waWxlKG1ldGhvZENvbmZpZ1tzY2hlbWFGaWVsZF0pXG4gICAgdmFyIHZhbGlkID0gdmFsaWRhdGUoZGF0YSlcbiAgICBpZiAoIXZhbGlkKSB7XG4gICAgICBDT05TT0xFLmVycm9yKCd2YWxpZGF0aW9uIGVycm9ycyAnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnMsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkfSlcbiAgICAgIHRocm93IG5ldyBFcnJvcigndmFsaWRhdGlvbiBlcnJvciAnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnN9KVxuICAgIH0gZWxzZSByZXR1cm4gZGF0YVxuICB9XG4gIHRyeSB7XG4gIC8vIHZhciBkZWZhdWx0RXZlbnRMaXN0ZW4gPSByZXF1aXJlKCcuL2RlZmF1bHQuZXZlbnQubGlzdGVuLmpzb24nKVxuICAgIHZhciBjb25maWdcblxuICAgIHZhciBnZXRDaGFubmVsID0gKGNoYW5uZWxOYW1lKSA9PiByZXF1aXJlKGAuL2NoYW5uZWxzLyR7Y2hhbm5lbE5hbWV9LnNlcnZlcmApKHtnZXRDb25zb2xlLCBtZXRob2RDYWxsLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBjb25maWc6IGNvbmZpZy5jaGFubmVsc1tjaGFubmVsTmFtZV19KVxuICAgIHZhciBmb3JFYWNoQ2hhbm5lbCA9IChmdW5jKSA9PiBPYmplY3Qua2V5cyhjb25maWcuY2hhbm5lbHMpLmZvckVhY2goKGNoYW5uZWxOYW1lKSA9PiBmdW5jKGdldENoYW5uZWwoY2hhbm5lbE5hbWUpKSlcblxuICAgIC8vIG9nbmkgbWV0aG9kIGNhbGwgcHXDsiBhdmVyZSBwacO5IGRhdGkgYW5jaGUgZGF1c2VyaWQgZSByZXF1ZXN0aWQgZGl2ZXJzaVxuICAgIHZhciBtZXRob2RDYWxsID0gYXN5bmMgZnVuY3Rpb24gbWV0aG9kQ2FsbCAobWVzc2FnZSwgZ2V0U3RyZWFtLCBwdWJsaWNBcGkgPSB0cnVlLCBjaGFubmVsID0gJ1VOS05PVycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENPTlNPTEUubG9nKCc9PiBTRVJWRVIgSU4nLCB7bWVzc2FnZX0pXG4gICAgICAgIHZhbGlkYXRlUmVxdWVzdChtZXNzYWdlKVxuXG4gICAgICAgIHZhciBtZXRob2ROYW1lID0gbWVzc2FnZS5tZXRob2RcbiAgICAgICAgdmFyIG1ldGEgPSBtZXNzYWdlLm1ldGEgfHwge31cbiAgICAgICAgbWV0YS5jb3JyaWQgPSBtZXRhLmNvcnJpZCB8fCB1dWlkVjQoKVxuICAgICAgICBtZXRhLnVzZXJpZCA9IG1ldGEudXNlcmlkIHx8ICdVTktOT1cnXG4gICAgICAgIG1ldGEuZnJvbSA9IG1ldGEuZnJvbSB8fCAnVU5LTk9XJ1xuICAgICAgICBtZXRhLnJlcUluVGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgICAgICBtZXRhLmNoYW5uZWwgPSBjaGFubmVsXG4gICAgICAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhIHx8IHt9XG5cbiAgICAgICAgdmFyIHNlcnZpY2VNZXRob2RzQ29uZmlnID0gYXdhaXQgZ2V0TWV0aG9kc0NvbmZpZyhzZXJ2aWNlTmFtZSlcbiAgICAgICAgdmFyIG1ldGhvZHMgPSBhd2FpdCBnZXRNZXRob2RzKClcbiAgICAgICAgaWYgKCFzZXJ2aWNlTWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXSkgdGhyb3cgbmV3IEVycm9yKG1ldGhvZE5hbWUgKyAnIGlzIG5vdCB2YWxpZCAobm90IGRlZmluZWQgaW4gbWV0aG9kcyBjb25maWcpJylcbiAgICAgICAgaWYgKCFzZXJ2aWNlTWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXS5wdWJsaWMgJiYgcHVibGljQXBpKSB0aHJvdyBuZXcgRXJyb3IobWV0aG9kTmFtZSArICcgaXMgbm90IHB1YmxpYycpXG4gICAgICAgIGlmICghbWV0aG9kc1ttZXRob2ROYW1lXSkgdGhyb3cgbmV3IEVycm9yKG1ldGhvZE5hbWUgKyAnIGlzIG5vdCB2YWxpZCAobm90IGRlZmluZWQgc2VydmljZSBtZXRob2RzIGpzIGZpbGUpJylcbiAgICAgICAgdmFyIG1ldGhvZCA9IG1ldGhvZHNbbWV0aG9kTmFtZV1cbiAgICAgICAgdmFyIG1ldGhvZENvbmZpZyA9IHNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ21ldGhvZENhbGwnLCB7bWVzc2FnZSwgZ2V0U3RyZWFtLCBwdWJsaWNBcGksIHNlcnZpY2VNZXRob2RzQ29uZmlnLCBtZXRob2RDb25maWd9LCBzZXJ2aWNlTmFtZSlcblxuICAgICAgICBkYXRhID0gdmFsaWRhdGVSZXNwb25zZShtZXRob2RDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsICdyZXF1ZXN0U2NoZW1hJylcblxuICAgICAgICB2YXIgcmVzcG9uc2VcbiAgICAgICAgLy8gaWYgbm9SZXNwb25zZSBub3QgYXdhaXQgcmVzcG9uc2Ugb24gdGhlIGNsaWVudCBzaWRlXG4gICAgICAgIC8vIGlmIGFrbm93bGVnbWVudCBhd2FpdCByZXNwb25zZSBvbiB0aGUgY2xpZW50IHNpZGUgYnV0IG5vdCBhd2FpdCByZXNwb25zZSBvbiB0aGUgc2VydmVyIHNpZGVcbiAgICAgICAgaWYgKG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGUgPT09ICdub1Jlc3BvbnNlJyB8fCBtZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAnYWtub3dsZWdtZW50Jykge1xuICAgICAgICAgIG1ldGhvZChkYXRhLCBtZXRhLCBnZXRTdHJlYW0gfHwgbnVsbClcbiAgICAgICAgICByZXNwb25zZSA9IG51bGxcbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAncmVzcG9uc2UnKSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2QoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtIHx8IG51bGwpXG4gICAgICAgICAgcmVzcG9uc2UgPSB2YWxpZGF0ZVJlc3BvbnNlKG1ldGhvZENvbmZpZywgbWV0aG9kTmFtZSwgcmVzcG9uc2UsICdyZXNwb25zZVNjaGVtYScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2QoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtIHx8IG51bGwpXG4gICAgICAgIH1cblxuICAgICAgICBDT05TT0xFLmxvZygnU0VSVkVSIE9VVCA9PiAnLCB7cmVzcG9uc2UsIHJlc3BvbnNlVHlwZTogbWV0aG9kQ29uZmlnLnJlc3BvbnNlVHlwZX0pXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ01BSU4gUkVTUE9OU0UgJyArIG1ldGhvZE5hbWUsIHJlc3BvbnNlKVxuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHttZXRob2ROYW1lfSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBkdXJpbmcgbWV0aG9kQ2FsbCcpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBhc3luYyBzdGFydCAoKSB7XG4gICAgICAgIGNvbmZpZyA9IGF3YWl0IGdldE5ldENvbmZpZyhzZXJ2aWNlTmFtZSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnU1RBUlQgQ0hBTk5FTFMgU0VSVkVSUyAnLGNvbmZpZylcbiAgICAgICAgY2hlY2tSZXF1aXJlZCh7Y2hhbm5lbHM6Y29uZmlnLmNoYW5uZWxzfSwgUEFDS0FHRSlcbiAgICAgICAgZm9yRWFjaENoYW5uZWwoKGNoYW5uZWwpID0+IGNoYW5uZWwuc3RhcnQoKSlcbiAgICAgIH0sXG4gICAgICBzdG9wICgpIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnU1RPUCBDSEFOTkVMUyBTRVJWRVJTICcsIHtjaGFubmVsczogY29uZmlnLmNoYW5uZWxzfSlcbiAgICAgICAgZm9yRWFjaENoYW5uZWwoKGNoYW5uZWwpID0+IGNoYW5uZWwuc3RvcCgpKVxuICAgICAgfSxcbiAgICAgIHJlc3RhcnQgKCkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdSRVNUQVJUIENIQU5ORUxTIFNFUlZFUlMgJywge2NoYW5uZWxzOiBjb25maWcuY2hhbm5lbHN9KVxuICAgICAgICBmb3JFYWNoQ2hhbm5lbCgoY2hhbm5lbCkgPT4gY2hhbm5lbC5yZXN0YXJ0KCkpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBkdXJpbmcgZ2V0TmV0U2VydmVyUGFja2FnZScpXG4gIH1cbn1cbiJdfQ==