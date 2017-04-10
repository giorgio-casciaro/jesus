'use strict';

var R = require('ramda');
var uuidV4 = require('uuid/v4');
var ajv = require('ajv')({ allErrors: true });
var PACKAGE = 'net.server';
var checkRequired = require('./utils').checkRequired;
var validatorMsg = ajv.compile(require('./schemas/message.schema.json'));

function defaultGetConsole() {
  return console;
}

module.exports = function getNetServerPackage(_ref) {
  var _ref$getConsole = _ref.getConsole,
      getConsole = _ref$getConsole === undefined ? defaultGetConsole : _ref$getConsole,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      getMethods = _ref.getMethods,
      getMethodsConfig = _ref.getMethodsConfig,
      getNetConfig = _ref.getNetConfig;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  checkRequired({ getMethods: getMethods, getMethodsConfig: getMethodsConfig, getConsole: getConsole, getNetConfig: getNetConfig });
  CONSOLE.debug('getNetServerPackage ', {});
  var validateMsg = function validateMsg(data) {
    if (!validatorMsg(data)) {
      CONSOLE.error('MESSAGE IS NOT VALID ', { errors: validate.errors });
      throw new Error('MESSAGE IS NOT VALID', { errors: validatorMsg.errors });
    } else return data;
  };
  try {
    // var defaultEventListen = require('./default.event.listen.json')
    var config;
    var validate = function validate(methodConfig, methodName, data) {
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
              validateMsg(message);

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
              methods = getMethods();

              if (serviceMethodsConfig[methodName]) {
                _context.next = 17;
                break;
              }

              throw new Error(methodName + ' is not valid (not defined in methods config)');

            case 17:
              if (!(!serviceMethodsConfig[methodName].public && publicApi)) {
                _context.next = 19;
                break;
              }

              throw new Error(methodName + ' is not public');

            case 19:
              if (methods[methodName]) {
                _context.next = 21;
                break;
              }

              throw new Error(methodName + ' is not valid (not defined service methods js file)');

            case 21:
              method = methods[methodName];
              methodConfig = serviceMethodsConfig[methodName];

              CONSOLE.debug('methodCall', { message: message, getStream: getStream, publicApi: publicApi, serviceMethodsConfig: serviceMethodsConfig, methodConfig: methodConfig }, serviceName);

              data = validate(methodConfig, methodName, data, 'requestSchema');

              if (!(methodConfig.responseType === 'noResponse' || methodConfig.responseType === 'aknowlegment')) {
                _context.next = 30;
                break;
              }

              method(data, meta, getStream || null);
              response = null;
              _context.next = 40;
              break;

            case 30:
              if (!(methodConfig.responseType === 'response')) {
                _context.next = 37;
                break;
              }

              _context.next = 33;
              return regeneratorRuntime.awrap(method(data, meta, getStream || null));

            case 33:
              response = _context.sent;

              response = validate(methodConfig, methodName, response, 'responseSchema');
              _context.next = 40;
              break;

            case 37:
              _context.next = 39;
              return regeneratorRuntime.awrap(method(data, meta, getStream || null));

            case 39:
              response = _context.sent;

            case 40:

              CONSOLE.log('SERVER OUT => ', { response: response, responseType: methodConfig.responseType });
              CONSOLE.debug('MAIN RESPONSE ' + methodName, response);
              return _context.abrupt('return', response);

            case 45:
              _context.prev = 45;
              _context.t0 = _context['catch'](0);

              CONSOLE.error(_context.t0, { methodName: methodName });
              throw new Error('Error during methodCall');

            case 49:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this, [[0, 45]]);
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
                forEachChannel(function (channel) {
                  return channel.start();
                });

              case 5:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwidXVpZFY0IiwiYWp2IiwiYWxsRXJyb3JzIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJ2YWxpZGF0b3JNc2ciLCJjb21waWxlIiwiZGVmYXVsdEdldENvbnNvbGUiLCJjb25zb2xlIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldFNlcnZlclBhY2thZ2UiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJnZXRNZXRob2RzIiwiZ2V0TWV0aG9kc0NvbmZpZyIsImdldE5ldENvbmZpZyIsIkNPTlNPTEUiLCJkZWJ1ZyIsInZhbGlkYXRlTXNnIiwiZGF0YSIsImVycm9yIiwiZXJyb3JzIiwidmFsaWRhdGUiLCJFcnJvciIsImNvbmZpZyIsIm1ldGhvZENvbmZpZyIsIm1ldGhvZE5hbWUiLCJzY2hlbWFGaWVsZCIsInZhbGlkIiwiZ2V0Q2hhbm5lbCIsImNoYW5uZWxOYW1lIiwibWV0aG9kQ2FsbCIsImNoYW5uZWxzIiwiZm9yRWFjaENoYW5uZWwiLCJmdW5jIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJtZXNzYWdlIiwiZ2V0U3RyZWFtIiwicHVibGljQXBpIiwiY2hhbm5lbCIsImxvZyIsIm1ldGhvZCIsIm1ldGEiLCJjb3JyaWQiLCJ1c2VyaWQiLCJmcm9tIiwicmVxSW5UaW1lc3RhbXAiLCJEYXRlIiwibm93Iiwic2VydmljZU1ldGhvZHNDb25maWciLCJtZXRob2RzIiwicHVibGljIiwicmVzcG9uc2VUeXBlIiwicmVzcG9uc2UiLCJzdGFydCIsInN0b3AiLCJyZXN0YXJ0Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBTUMsU0FBU0QsUUFBUSxTQUFSLENBQWY7QUFDQSxJQUFJRSxNQUFNRixRQUFRLEtBQVIsRUFBZSxFQUFDRyxXQUFXLElBQVosRUFBZixDQUFWO0FBQ0EsSUFBTUMsVUFB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UCxFQUFjO0FBQ2RKLFlBQVFJLEtBQVIsQ0FBY0EsS0FBZDtBQUNBLFVBQU0sSUFBSUcsS0FBSixDQUFVLGtDQUFWLENBQU47QUFDRDtBQUNGLENBNUZEIiwiZmlsZSI6Im5ldC5zZXJ2ZXIuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcbnZhciBhanYgPSByZXF1aXJlKCdhanYnKSh7YWxsRXJyb3JzOiB0cnVlfSlcbmNvbnN0IFBBQ0tBR0UgPSAnbmV0LnNlcnZlcidcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL3V0aWxzJykuY2hlY2tSZXF1aXJlZFxudmFyIHZhbGlkYXRvck1zZyA9IGFqdi5jb21waWxlKHJlcXVpcmUoJy4vc2NoZW1hcy9tZXNzYWdlLnNjaGVtYS5qc29uJykpXG5cbmZ1bmN0aW9uIGRlZmF1bHRHZXRDb25zb2xlICgpIHsgcmV0dXJuIGNvbnNvbGUgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE5ldFNlcnZlclBhY2thZ2UgKHsgZ2V0Q29uc29sZSA9IGRlZmF1bHRHZXRDb25zb2xlLCBzZXJ2aWNlTmFtZSA9ICd1bmtub3cnLCBzZXJ2aWNlSWQgPSAndW5rbm93JywgZ2V0TWV0aG9kcywgZ2V0TWV0aG9kc0NvbmZpZywgZ2V0TmV0Q29uZmlnfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgY2hlY2tSZXF1aXJlZCh7Z2V0TWV0aG9kcywgZ2V0TWV0aG9kc0NvbmZpZywgZ2V0Q29uc29sZSwgZ2V0TmV0Q29uZmlnfSlcbiAgQ09OU09MRS5kZWJ1ZygnZ2V0TmV0U2VydmVyUGFja2FnZSAnLCB7IH0pXG4gIHZhciB2YWxpZGF0ZU1zZyA9IChkYXRhKSA9PiB7XG4gICAgaWYgKCF2YWxpZGF0b3JNc2coZGF0YSkpIHtcbiAgICAgIENPTlNPTEUuZXJyb3IoJ01FU1NBR0UgSVMgTk9UIFZBTElEICcsIHtlcnJvcnM6IHZhbGlkYXRlLmVycm9yc30pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01FU1NBR0UgSVMgTk9UIFZBTElEJywge2Vycm9yczogdmFsaWRhdG9yTXNnLmVycm9yc30pXG4gICAgfSBlbHNlIHJldHVybiBkYXRhXG4gIH1cbiAgdHJ5IHtcbiAgLy8gdmFyIGRlZmF1bHRFdmVudExpc3RlbiA9IHJlcXVpcmUoJy4vZGVmYXVsdC5ldmVudC5saXN0ZW4uanNvbicpXG4gICAgdmFyIGNvbmZpZ1xuICAgIHZhciB2YWxpZGF0ZSA9IChtZXRob2RDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkID0gJ3JlcXVlc3RTY2hlbWEnKSA9PiB7XG4gICAgICBDT05TT0xFLmRlYnVnKCd2YWxpZGF0ZSAnLCB7IG1ldGhvZENvbmZpZywgbWV0aG9kTmFtZSwgZGF0YSwgc2NoZW1hRmllbGQgfSlcbiAgICAgIGlmICghbWV0aG9kQ29uZmlnW3NjaGVtYUZpZWxkXSkgdGhyb3cgbmV3IEVycm9yKHNjaGVtYUZpZWxkICsgJyBub3QgZGVmaW5lZCBpbiBtZXRob2RzLmpzb24gJyArIG1ldGhvZE5hbWUpXG4gICAgICB2YXIgdmFsaWRhdGUgPSBhanYuY29tcGlsZShtZXRob2RDb25maWdbc2NoZW1hRmllbGRdKVxuICAgICAgdmFyIHZhbGlkID0gdmFsaWRhdGUoZGF0YSlcbiAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgQ09OU09MRS5lcnJvcigndmFsaWRhdGlvbiBlcnJvcnMgJywge2Vycm9yczogdmFsaWRhdGUuZXJyb3JzLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZH0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndmFsaWRhdGlvbiBlcnJvciAnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnN9KVxuICAgICAgfSBlbHNlIHJldHVybiBkYXRhXG4gICAgfVxuICAgIHZhciBnZXRDaGFubmVsID0gKGNoYW5uZWxOYW1lKSA9PiByZXF1aXJlKGAuL2NoYW5uZWxzLyR7Y2hhbm5lbE5hbWV9LnNlcnZlcmApKHtnZXRDb25zb2xlLCBtZXRob2RDYWxsLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBjb25maWc6IGNvbmZpZy5jaGFubmVsc1tjaGFubmVsTmFtZV19KVxuICAgIHZhciBmb3JFYWNoQ2hhbm5lbCA9IChmdW5jKSA9PiBPYmplY3Qua2V5cyhjb25maWcuY2hhbm5lbHMpLmZvckVhY2goKGNoYW5uZWxOYW1lKSA9PiBmdW5jKGdldENoYW5uZWwoY2hhbm5lbE5hbWUpKSlcblxuICAgIC8vIG9nbmkgbWV0aG9kIGNhbGwgcHXDsiBhdmVyZSBwacO5IGRhdGkgYW5jaGUgZGF1c2VyaWQgZSByZXF1ZXN0aWQgZGl2ZXJzaVxuICAgIHZhciBtZXRob2RDYWxsID0gYXN5bmMgZnVuY3Rpb24gbWV0aG9kQ2FsbCAobWVzc2FnZSwgZ2V0U3RyZWFtLCBwdWJsaWNBcGkgPSB0cnVlLCBjaGFubmVsID0gJ1VOS05PVycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENPTlNPTEUubG9nKCc9PiBTRVJWRVIgSU4nLCB7bWVzc2FnZX0pXG4gICAgICAgIHZhbGlkYXRlTXNnKG1lc3NhZ2UpXG5cbiAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBtZXNzYWdlLm1ldGhvZFxuICAgICAgICB2YXIgbWV0YSA9IG1lc3NhZ2UubWV0YSB8fCB7fVxuICAgICAgICBtZXRhLmNvcnJpZCA9IG1ldGEuY29ycmlkIHx8IHV1aWRWNCgpXG4gICAgICAgIG1ldGEudXNlcmlkID0gbWV0YS51c2VyaWQgfHwgJ1VOS05PVydcbiAgICAgICAgbWV0YS5mcm9tID0gbWV0YS5mcm9tIHx8ICdVTktOT1cnXG4gICAgICAgIG1ldGEucmVxSW5UaW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgICAgIG1ldGEuY2hhbm5lbCA9IGNoYW5uZWxcbiAgICAgICAgdmFyIGRhdGEgPSBtZXNzYWdlLmRhdGEgfHwge31cblxuICAgICAgICB2YXIgc2VydmljZU1ldGhvZHNDb25maWcgPSBhd2FpdCBnZXRNZXRob2RzQ29uZmlnKHNlcnZpY2VOYW1lKVxuICAgICAgICB2YXIgbWV0aG9kcyA9IGdldE1ldGhvZHMoKVxuICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdKSB0aHJvdyBuZXcgRXJyb3IobWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkIChub3QgZGVmaW5lZCBpbiBtZXRob2RzIGNvbmZpZyknKVxuICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdLnB1YmxpYyAmJiBwdWJsaWNBcGkpIHRocm93IG5ldyBFcnJvcihtZXRob2ROYW1lICsgJyBpcyBub3QgcHVibGljJylcbiAgICAgICAgaWYgKCFtZXRob2RzW21ldGhvZE5hbWVdKSB0aHJvdyBuZXcgRXJyb3IobWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkIChub3QgZGVmaW5lZCBzZXJ2aWNlIG1ldGhvZHMganMgZmlsZSknKVxuICAgICAgICB2YXIgbWV0aG9kID0gbWV0aG9kc1ttZXRob2ROYW1lXVxuICAgICAgICB2YXIgbWV0aG9kQ29uZmlnID0gc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV1cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnbWV0aG9kQ2FsbCcsIHttZXNzYWdlLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSwgc2VydmljZU1ldGhvZHNDb25maWcsIG1ldGhvZENvbmZpZ30sIHNlcnZpY2VOYW1lKVxuXG4gICAgICAgIGRhdGEgPSB2YWxpZGF0ZShtZXRob2RDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsICdyZXF1ZXN0U2NoZW1hJylcblxuICAgICAgICB2YXIgcmVzcG9uc2VcbiAgICAgICAgLy8gaWYgbm9SZXNwb25zZSBub3QgYXdhaXQgcmVzcG9uc2Ugb24gdGhlIGNsaWVudCBzaWRlXG4gICAgICAgIC8vIGlmIGFrbm93bGVnbWVudCBhd2FpdCByZXNwb25zZSBvbiB0aGUgY2xpZW50IHNpZGUgYnV0IG5vdCBhd2FpdCByZXNwb25zZSBvbiB0aGUgc2VydmVyIHNpZGVcbiAgICAgICAgaWYgKG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGUgPT09ICdub1Jlc3BvbnNlJyB8fCBtZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAnYWtub3dsZWdtZW50Jykge1xuICAgICAgICAgIG1ldGhvZChkYXRhLCBtZXRhLCBnZXRTdHJlYW0gfHwgbnVsbClcbiAgICAgICAgICByZXNwb25zZSA9IG51bGxcbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAncmVzcG9uc2UnKSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2QoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtIHx8IG51bGwpXG4gICAgICAgICAgcmVzcG9uc2UgPSB2YWxpZGF0ZShtZXRob2RDb25maWcsIG1ldGhvZE5hbWUsIHJlc3BvbnNlLCAncmVzcG9uc2VTY2hlbWEnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3BvbnNlID0gYXdhaXQgbWV0aG9kKGRhdGEsIG1ldGEsIGdldFN0cmVhbSB8fCBudWxsKVxuICAgICAgICB9XG5cbiAgICAgICAgQ09OU09MRS5sb2coJ1NFUlZFUiBPVVQgPT4gJywge3Jlc3BvbnNlLCByZXNwb25zZVR5cGU6IG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGV9KVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdNQUlOIFJFU1BPTlNFICcgKyBtZXRob2ROYW1lLCByZXNwb25zZSlcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBDT05TT0xFLmVycm9yKGVycm9yLCB7bWV0aG9kTmFtZX0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgZHVyaW5nIG1ldGhvZENhbGwnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgYXN5bmMgc3RhcnQgKCkge1xuICAgICAgICBjb25maWcgPSBhd2FpdCBnZXROZXRDb25maWcoc2VydmljZU5hbWUpXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ1NUQVJUIENIQU5ORUxTIFNFUlZFUlMgJyxjb25maWcpXG4gICAgICAgIGZvckVhY2hDaGFubmVsKChjaGFubmVsKSA9PiBjaGFubmVsLnN0YXJ0KCkpXG4gICAgICB9LFxuICAgICAgc3RvcCAoKSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ1NUT1AgQ0hBTk5FTFMgU0VSVkVSUyAnLCB7Y2hhbm5lbHM6IGNvbmZpZy5jaGFubmVsc30pXG4gICAgICAgIGZvckVhY2hDaGFubmVsKChjaGFubmVsKSA9PiBjaGFubmVsLnN0b3AoKSlcbiAgICAgIH0sXG4gICAgICByZXN0YXJ0ICgpIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnUkVTVEFSVCBDSEFOTkVMUyBTRVJWRVJTICcsIHtjaGFubmVsczogY29uZmlnLmNoYW5uZWxzfSlcbiAgICAgICAgZm9yRWFjaENoYW5uZWwoKGNoYW5uZWwpID0+IGNoYW5uZWwucmVzdGFydCgpKVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDT05TT0xFLmVycm9yKGVycm9yKVxuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgZHVyaW5nIGdldE5ldFNlcnZlclBhY2thZ2UnKVxuICB9XG59XG4iXX0=