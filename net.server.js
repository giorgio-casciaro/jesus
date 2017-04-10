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
function defaultGetMethods() {
  return { test: function test(echo) {
      return echo;
    } };
}
var defaultConfig = {
  channels: {
    'test': {
      url: 'localhost:10080'
    }
  }
};

module.exports = function getNetServerPackage(_ref) {
  var _ref$config = _ref.config,
      config = _ref$config === undefined ? defaultConfig : _ref$config,
      _ref$getConsole = _ref.getConsole,
      getConsole = _ref$getConsole === undefined ? defaultGetConsole : _ref$getConsole,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      _ref$getMethods = _ref.getMethods,
      getMethods = _ref$getMethods === undefined ? defaultGetMethods : _ref$getMethods,
      getSharedConfig = _ref.getSharedConfig;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  checkRequired({ getMethods: getMethods, getSharedConfig: getSharedConfig, getConsole: getConsole });
  CONSOLE.debug('getNetServerPackage ', { config: config });
  var validateMsg = function validateMsg(data) {
    if (!validatorMsg(data)) {
      CONSOLE.error('MESSAGE IS NOT VALID ', { errors: validate.errors });
      throw new Error('MESSAGE IS NOT VALID', { errors: validatorMsg.errors });
    } else return data;
  };
  try {
    // var defaultEventListen = require('./default.event.listen.json')
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
    var getTrans = function getTrans(channelName) {
      return require('./channels/' + channelName + '.server')({ getSharedConfig: getSharedConfig, getConsole: getConsole, methodCall: methodCall, serviceName: serviceName, serviceId: serviceId, config: config.channels[channelName] });
    };
    var forEachTransport = function forEachTransport(func) {
      return Object.keys(config.channels).forEach(function (channelName) {
        return func(getTrans(channelName));
      });
    };

    config = R.merge(defaultConfig, config);
    CONSOLE.debug('config ', config);
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
              return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'methods'));

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
        CONSOLE.log('START CHANNELS SERVERS ', { channels: config.channels });
        forEachTransport(function (channel) {
          return channel.start();
        });
      },
      stop: function stop() {
        CONSOLE.log('STOP CHANNELS SERVERS ', { channels: config.channels });
        forEachTransport(function (channel) {
          return channel.stop();
        });
      },
      restart: function restart() {
        CONSOLE.log('RESTART CHANNELS SERVERS ', { channels: config.channels });
        forEachTransport(function (channel) {
          return channel.restart();
        });
      }
    };
  } catch (error) {
    CONSOLE.error(error);
    throw new Error('Error during getNetServerPackage');
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwidXVpZFY0IiwiYWp2IiwiYWxsRXJyb3JzIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJ2YWxpZGF0b3JNc2ciLCJjb21waWxlIiwiZGVmYXVsdEdldENvbnNvbGUiLCJjb25zb2xlIiwiZGVmYXVsdEdldE1ldGhvZHMiLCJ0ZXN0IiwiZWNobyIsImRlZmF1bHRDb25maWciLCJjaGFubmVscyIsInVybCIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXROZXRTZXJ2ZXJQYWNrYWdlIiwiY29uZmlnIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiZ2V0TWV0aG9kcyIsImdldFNoYXJlZENvbmZpZyIsIkNPTlNPTEUiLCJkZWJ1ZyIsInZhbGlkYXRlTXNnIiwiZGF0YSIsImVycm9yIiwiZXJyb3JzIiwidmFsaWRhdGUiLCJFcnJvciIsIm1ldGhvZENvbmZpZyIsIm1ldGhvZE5hbWUiLCJzY2hlbWFGaWVsZCIsInZhbGlkIiwiZ2V0VHJhbnMiLCJjaGFubmVsTmFtZSIsIm1ldGhvZENhbGwiLCJmb3JFYWNoVHJhbnNwb3J0IiwiZnVuYyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwibWVyZ2UiLCJtZXNzYWdlIiwiZ2V0U3RyZWFtIiwicHVibGljQXBpIiwiY2hhbm5lbCIsImxvZyIsIm1ldGhvZCIsIm1ldGEiLCJjb3JyaWQiLCJ1c2VyaWQiLCJmcm9tIiwicmVxSW5UaW1lc3RhbXAiLCJEYXRlIiwibm93Iiwic2VydmljZU1ldGhvZHNDb25maWciLCJtZXRob2RzIiwicHVibGljIiwicmVzcG9uc2VUeXBlIiwicmVzcG9uc2UiLCJzdGFydCIsInN0b3AiLCJyZXN0YXJ0Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBTUMsU0FBU0QsUUFBUSxTQUFSLENBQWY7QUFDQSxJQUFJRSxNQUFNRixRQUFRLEtB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QkFBWixFQUF3QyxFQUFDcEMsVUFBVUssT0FBT0wsUUFBbEIsRUFBeEM7QUFDQTBCLHlCQUFpQixVQUFDUyxPQUFEO0FBQUEsaUJBQWFBLFFBQVFnQixJQUFSLEVBQWI7QUFBQSxTQUFqQjtBQUNELE9BUkk7QUFTTEMsYUFUSyxxQkFTTTtBQUNUekMsZ0JBQVF5QixHQUFSLENBQVksNkJBQVosRUFBMkMsRUFBQ3BDLFVBQVVLLE9BQU9MLFFBQWxCLEVBQTNDO0FBQ0EwQix5QkFBaUIsVUFBQ1MsT0FBRDtBQUFBLGlCQUFhQSxRQUFRaUIsT0FBUixFQUFiO0FBQUEsU0FBakI7QUFDRDtBQVpJLEtBQVA7QUFjRCxHQTlFRCxDQThFRSxPQUFPckMsS0FBUCxFQUFjO0FBQ2RKLFlBQVFJLEtBQVIsQ0FBY0EsS0FBZDtBQUNBLFVBQU0sSUFBSUcsS0FBSixDQUFVLGtDQUFWLENBQU47QUFDRDtBQUNGLENBNUZEIiwiZmlsZSI6Im5ldC5zZXJ2ZXIuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcbnZhciBhanYgPSByZXF1aXJlKCdhanYnKSh7YWxsRXJyb3JzOiB0cnVlfSlcbmNvbnN0IFBBQ0tBR0UgPSAnbmV0LnNlcnZlcidcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL3V0aWxzJykuY2hlY2tSZXF1aXJlZFxudmFyIHZhbGlkYXRvck1zZyA9IGFqdi5jb21waWxlKHJlcXVpcmUoJy4vc2NoZW1hcy9tZXNzYWdlLnNjaGVtYS5qc29uJykpXG5cbmZ1bmN0aW9uIGRlZmF1bHRHZXRDb25zb2xlKCl7cmV0dXJuIGNvbnNvbGV9XG5mdW5jdGlvbiBkZWZhdWx0R2V0TWV0aG9kcygpe3JldHVybiB7dGVzdDooZWNobyk9PmVjaG99fVxudmFyIGRlZmF1bHRDb25maWc9e1xuICBjaGFubmVsczoge1xuICAgICd0ZXN0Jzoge1xuICAgICAgdXJsOiAnbG9jYWxob3N0OjEwMDgwJ1xuICAgIH1cbiAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TmV0U2VydmVyUGFja2FnZSAoe2NvbmZpZz0gZGVmYXVsdENvbmZpZywgZ2V0Q29uc29sZT1kZWZhdWx0R2V0Q29uc29sZSwgc2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycsIGdldE1ldGhvZHM9ZGVmYXVsdEdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZ30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIGNoZWNrUmVxdWlyZWQoe2dldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZywgZ2V0Q29uc29sZX0pXG4gIENPTlNPTEUuZGVidWcoJ2dldE5ldFNlcnZlclBhY2thZ2UgJywgeyBjb25maWd9KVxuICB2YXIgdmFsaWRhdGVNc2cgPSAoZGF0YSkgPT4ge1xuICAgIGlmICghdmFsaWRhdG9yTXNnKGRhdGEpKSB7XG4gICAgICBDT05TT0xFLmVycm9yKCdNRVNTQUdFIElTIE5PVCBWQUxJRCAnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnN9KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNRVNTQUdFIElTIE5PVCBWQUxJRCcsIHtlcnJvcnM6IHZhbGlkYXRvck1zZy5lcnJvcnN9KVxuICAgIH0gZWxzZSByZXR1cm4gZGF0YVxuICB9XG4gIHRyeSB7XG4gIC8vIHZhciBkZWZhdWx0RXZlbnRMaXN0ZW4gPSByZXF1aXJlKCcuL2RlZmF1bHQuZXZlbnQubGlzdGVuLmpzb24nKVxuICAgIHZhciB2YWxpZGF0ZSA9IChtZXRob2RDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkID0gJ3JlcXVlc3RTY2hlbWEnKSA9PiB7XG4gICAgICBDT05TT0xFLmRlYnVnKCd2YWxpZGF0ZSAnLCB7IG1ldGhvZENvbmZpZywgbWV0aG9kTmFtZSwgZGF0YSwgc2NoZW1hRmllbGQgfSlcbiAgICAgIGlmICghbWV0aG9kQ29uZmlnW3NjaGVtYUZpZWxkXSkgdGhyb3cgbmV3IEVycm9yKHNjaGVtYUZpZWxkICsgJyBub3QgZGVmaW5lZCBpbiBtZXRob2RzLmpzb24gJyArIG1ldGhvZE5hbWUpXG4gICAgICB2YXIgdmFsaWRhdGUgPSBhanYuY29tcGlsZShtZXRob2RDb25maWdbc2NoZW1hRmllbGRdKVxuICAgICAgdmFyIHZhbGlkID0gdmFsaWRhdGUoZGF0YSlcbiAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgQ09OU09MRS5lcnJvcigndmFsaWRhdGlvbiBlcnJvcnMgJywge2Vycm9yczogdmFsaWRhdGUuZXJyb3JzLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZH0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndmFsaWRhdGlvbiBlcnJvciAnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnN9KVxuICAgICAgfSBlbHNlIHJldHVybiBkYXRhXG4gICAgfVxuICAgIHZhciBnZXRUcmFucyA9IChjaGFubmVsTmFtZSkgPT4gcmVxdWlyZShgLi9jaGFubmVscy8ke2NoYW5uZWxOYW1lfS5zZXJ2ZXJgKSh7Z2V0U2hhcmVkQ29uZmlnLCBnZXRDb25zb2xlLCBtZXRob2RDYWxsLCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBjb25maWc6IGNvbmZpZy5jaGFubmVsc1tjaGFubmVsTmFtZV19KVxuICAgIHZhciBmb3JFYWNoVHJhbnNwb3J0ID0gKGZ1bmMpID0+IE9iamVjdC5rZXlzKGNvbmZpZy5jaGFubmVscykuZm9yRWFjaCgoY2hhbm5lbE5hbWUpID0+IGZ1bmMoZ2V0VHJhbnMoY2hhbm5lbE5hbWUpKSlcblxuICAgIGNvbmZpZyA9IFIubWVyZ2UoZGVmYXVsdENvbmZpZywgY29uZmlnKVxuICAgIENPTlNPTEUuZGVidWcoJ2NvbmZpZyAnLCBjb25maWcpXG4gICAgLy8gb2duaSBtZXRob2QgY2FsbCBwdcOyIGF2ZXJlIHBpw7kgZGF0aSBhbmNoZSBkYXVzZXJpZCBlIHJlcXVlc3RpZCBkaXZlcnNpXG4gICAgdmFyIG1ldGhvZENhbGwgPSBhc3luYyBmdW5jdGlvbiBtZXRob2RDYWxsIChtZXNzYWdlLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSA9IHRydWUsIGNoYW5uZWwgPSAnVU5LTk9XJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgQ09OU09MRS5sb2coJz0+IFNFUlZFUiBJTicsIHttZXNzYWdlfSlcbiAgICAgICAgdmFsaWRhdGVNc2cobWVzc2FnZSlcblxuICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IG1lc3NhZ2UubWV0aG9kXG4gICAgICAgIHZhciBtZXRhID0gbWVzc2FnZS5tZXRhIHx8IHt9XG4gICAgICAgIG1ldGEuY29ycmlkID0gbWV0YS5jb3JyaWQgfHwgdXVpZFY0KClcbiAgICAgICAgbWV0YS51c2VyaWQgPSBtZXRhLnVzZXJpZCB8fCAnVU5LTk9XJ1xuICAgICAgICBtZXRhLmZyb20gPSBtZXRhLmZyb20gfHwgJ1VOS05PVydcbiAgICAgICAgbWV0YS5yZXFJblRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICAgICAgbWV0YS5jaGFubmVsID0gY2hhbm5lbFxuICAgICAgICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YSB8fCB7fVxuXG4gICAgICAgIHZhciBzZXJ2aWNlTWV0aG9kc0NvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ21ldGhvZHMnKVxuICAgICAgICB2YXIgbWV0aG9kcyA9IGdldE1ldGhvZHMoKVxuICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdKSB0aHJvdyBuZXcgRXJyb3IobWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkIChub3QgZGVmaW5lZCBpbiBtZXRob2RzIGNvbmZpZyknKVxuICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdLnB1YmxpYyAmJiBwdWJsaWNBcGkpIHRocm93IG5ldyBFcnJvcihtZXRob2ROYW1lICsgJyBpcyBub3QgcHVibGljJylcbiAgICAgICAgaWYgKCFtZXRob2RzW21ldGhvZE5hbWVdKSB0aHJvdyBuZXcgRXJyb3IobWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkIChub3QgZGVmaW5lZCBzZXJ2aWNlIG1ldGhvZHMganMgZmlsZSknKVxuICAgICAgICB2YXIgbWV0aG9kID0gbWV0aG9kc1ttZXRob2ROYW1lXVxuICAgICAgICB2YXIgbWV0aG9kQ29uZmlnID0gc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV1cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnbWV0aG9kQ2FsbCcsIHttZXNzYWdlLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSwgc2VydmljZU1ldGhvZHNDb25maWcsIG1ldGhvZENvbmZpZ30sIHNlcnZpY2VOYW1lKVxuXG4gICAgICAgIGRhdGEgPSB2YWxpZGF0ZShtZXRob2RDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsICdyZXF1ZXN0U2NoZW1hJylcblxuICAgICAgICB2YXIgcmVzcG9uc2VcbiAgICAgICAgLy8gaWYgbm9SZXNwb25zZSBub3QgYXdhaXQgcmVzcG9uc2Ugb24gdGhlIGNsaWVudCBzaWRlXG4gICAgICAgIC8vIGlmIGFrbm93bGVnbWVudCBhd2FpdCByZXNwb25zZSBvbiB0aGUgY2xpZW50IHNpZGUgYnV0IG5vdCBhd2FpdCByZXNwb25zZSBvbiB0aGUgc2VydmVyIHNpZGVcbiAgICAgICAgaWYgKG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGUgPT09ICdub1Jlc3BvbnNlJyB8fCBtZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAnYWtub3dsZWdtZW50Jykge1xuICAgICAgICAgIG1ldGhvZChkYXRhLCBtZXRhLCBnZXRTdHJlYW0gfHwgbnVsbClcbiAgICAgICAgICByZXNwb25zZSA9IG51bGxcbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAncmVzcG9uc2UnKSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2QoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtIHx8IG51bGwpXG4gICAgICAgICAgcmVzcG9uc2UgPSB2YWxpZGF0ZShtZXRob2RDb25maWcsIG1ldGhvZE5hbWUsIHJlc3BvbnNlLCAncmVzcG9uc2VTY2hlbWEnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3BvbnNlID0gYXdhaXQgbWV0aG9kKGRhdGEsIG1ldGEsIGdldFN0cmVhbSB8fCBudWxsKVxuICAgICAgICB9XG5cbiAgICAgICAgQ09OU09MRS5sb2coJ1NFUlZFUiBPVVQgPT4gJywge3Jlc3BvbnNlLCByZXNwb25zZVR5cGU6IG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGV9KVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdNQUlOIFJFU1BPTlNFICcgKyBtZXRob2ROYW1lLCByZXNwb25zZSlcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBDT05TT0xFLmVycm9yKGVycm9yLCB7bWV0aG9kTmFtZX0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgZHVyaW5nIG1ldGhvZENhbGwnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQgKCkge1xuICAgICAgICBDT05TT0xFLmxvZygnU1RBUlQgVFJBTlNQT1JUUyBTRVJWRVJTICcsIHtjaGFubmVsczogY29uZmlnLmNoYW5uZWxzfSlcbiAgICAgICAgZm9yRWFjaFRyYW5zcG9ydCgoY2hhbm5lbCkgPT4gY2hhbm5lbC5zdGFydCgpKVxuICAgICAgfSxcbiAgICAgIHN0b3AgKCkge1xuICAgICAgICBDT05TT0xFLmxvZygnU1RPUCBUUkFOU1BPUlRTIFNFUlZFUlMgJywge2NoYW5uZWxzOiBjb25maWcuY2hhbm5lbHN9KVxuICAgICAgICBmb3JFYWNoVHJhbnNwb3J0KChjaGFubmVsKSA9PiBjaGFubmVsLnN0b3AoKSlcbiAgICAgIH0sXG4gICAgICByZXN0YXJ0ICgpIHtcbiAgICAgICAgQ09OU09MRS5sb2coJ1JFU1RBUlQgVFJBTlNQT1JUUyBTRVJWRVJTICcsIHtjaGFubmVsczogY29uZmlnLmNoYW5uZWxzfSlcbiAgICAgICAgZm9yRWFjaFRyYW5zcG9ydCgoY2hhbm5lbCkgPT4gY2hhbm5lbC5yZXN0YXJ0KCkpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENPTlNPTEUuZXJyb3IoZXJyb3IpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBkdXJpbmcgZ2V0TmV0U2VydmVyUGFja2FnZScpXG4gIH1cbn1cbiJdfQ==