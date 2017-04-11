'use strict';

var R = require('ramda');
var uuidV4 = require('uuid/v4');
var ajv = require('ajv')({ allErrors: true });
var PACKAGE = 'net.server';
var checkRequired = require('./utils').checkRequired;
var validateMsg = ajv.compile(require('./schemas/message.schema.json'));

var getConsole = function getConsole(serviceName, serviceId, pack) {
  return require('./utils').getConsole({ error: true, debug: true, log: false, warn: true }, serviceName, serviceId, pack);
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

              data = validateResponse(methodConfig, methodName, data, 'requestSchema');

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

              response = validateResponse(methodConfig, methodName, response, 'responseSchema');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwidXVpZFY0IiwiYWp2IiwiYWxsRXJyb3JzIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJ2YWxpZGF0ZU1zZyIsImNvbXBpbGUiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwYWNrIiwiZXJyb3IiLCJkZWJ1ZyIsImxvZyIsIndhcm4iLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0TmV0U2VydmVyUGFja2FnZSIsImdldE1ldGhvZHMiLCJnZXRNZXRob2RzQ29uZmlnIiwiZ2V0TmV0Q29uZmlnIiwiQ09OU09MRSIsInZhbGlkYXRlUmVxdWVzdCIsImRhdGEiLCJlcnJvcnMiLCJ2YWxpZGF0ZSIsIkVycm9yIiwidmFsaWRhdGVSZXNwb25zZSIsIm1ldGhvZENvbmZpZyIsIm1ldGhvZE5hbWUiLCJzY2hlbWFGaWVsZCIsInZhbGlkIiwiY29uZmlnIiwiZ2V0Q2hhbm5lbCIsImNoYW5uZWxOYW1lIiwibWV0aG9kQ2FsbCIsImNoYW5uZWxzIiwiZm9yRWFjaENoYW5uZWwiLCJmdW5jIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJtZXNzYWdlIiwiZ2V0U3RyZWFtIiwicHVibGljQXBpIiwiY2hhbm5lbCIsIm1ldGhvZCIsIm1ldGEiLCJjb3JyaWQiLCJ1c2VyaWQiLCJmcm9tIiwicmVxSW5UaW1lc3RhbXAiLCJEYXRlIiwibm93Iiwic2VydmljZU1ldGhvZHNDb25maWciLCJtZXRob2RzIiwicHVibGljIiwicmVzcG9uc2VUeXBlIiwicmVzcG9uc2UiLCJzdGFydCIsInN0b3AiLCJyZXN0YXJ0Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBTUMsU0FBU0QsUUFBUSxTQUFSLENBQWY7QUFDQSxJQUFJRSxNQUFNRixRQUFRLEtBQVIsRUFBZSxFQUFDRyxXQUFXLElBQVosRUFBZixDQUFWO0FBQ0EsSUFB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VUFBQ1EsT0FBRDtBQUFBLGlCQUFhQSxRQUFRZSxJQUFSLEVBQWI7QUFBQSxTQUFmO0FBQ0QsT0FWSTtBQVdMQyxhQVhLLHFCQVdNO0FBQ1R4QyxnQkFBUVQsS0FBUixDQUFjLDJCQUFkLEVBQTJDLEVBQUN3QixVQUFVSixPQUFPSSxRQUFsQixFQUEzQztBQUNBQyx1QkFBZSxVQUFDUSxPQUFEO0FBQUEsaUJBQWFBLFFBQVFnQixPQUFSLEVBQWI7QUFBQSxTQUFmO0FBQ0Q7QUFkSSxLQUFQO0FBZ0JELEdBdEVELENBc0VFLE9BQU9sRCxLQUFQLEVBQWM7QUFDZFUsWUFBUVYsS0FBUixDQUFjQSxLQUFkO0FBQ0EsVUFBTSxJQUFJZSxLQUFKLENBQVUsa0NBQVYsQ0FBTjtBQUNEO0FBQ0YsQ0E5RkQiLCJmaWxlIjoibmV0LnNlcnZlci5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxudmFyIGFqdiA9IHJlcXVpcmUoJ2FqdicpKHthbGxFcnJvcnM6IHRydWV9KVxuY29uc3QgUEFDS0FHRSA9ICduZXQuc2VydmVyJ1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vdXRpbHMnKS5jaGVja1JlcXVpcmVkXG52YXIgdmFsaWRhdGVNc2cgPSBhanYuY29tcGlsZShyZXF1aXJlKCcuL3NjaGVtYXMvbWVzc2FnZS5zY2hlbWEuanNvbicpKVxuXG5jb25zdCBnZXRDb25zb2xlID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IHJlcXVpcmUoJy4vdXRpbHMnKS5nZXRDb25zb2xlKHtlcnJvcjogdHJ1ZSwgZGVidWc6IHRydWUsIGxvZzogZmFsc2UsIHdhcm46IHRydWV9LCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TmV0U2VydmVyUGFja2FnZSAoeyAgc2VydmljZU5hbWUgPSAndW5rbm93Jywgc2VydmljZUlkID0gJ3Vua25vdycsIGdldE1ldGhvZHMsIGdldE1ldGhvZHNDb25maWcsIGdldE5ldENvbmZpZ30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIGNoZWNrUmVxdWlyZWQoe2dldE1ldGhvZHMsIGdldE1ldGhvZHNDb25maWcsIGdldENvbnNvbGUsIGdldE5ldENvbmZpZ30sIFBBQ0tBR0UpXG4gIENPTlNPTEUuZGVidWcoJ2dldE5ldFNlcnZlclBhY2thZ2UgJywgeyB9KVxuICB2YXIgdmFsaWRhdGVSZXF1ZXN0ID0gKGRhdGEpID0+IHtcbiAgICBpZiAoIXZhbGlkYXRlTXNnKGRhdGEpKSB7XG4gICAgICBDT05TT0xFLmVycm9yKCdNRVNTQUdFIElTIE5PVCBWQUxJRCAnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnN9KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNRVNTQUdFIElTIE5PVCBWQUxJRCcsIHtlcnJvcnM6IHZhbGlkYXRlTXNnLmVycm9yc30pXG4gICAgfSBlbHNlIHJldHVybiBkYXRhXG4gIH1cbiAgdmFyIHZhbGlkYXRlUmVzcG9uc2UgPSAobWV0aG9kQ29uZmlnLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZCA9ICdyZXF1ZXN0U2NoZW1hJykgPT4ge1xuICAgIENPTlNPTEUuZGVidWcoJ3ZhbGlkYXRlICcsIHsgbWV0aG9kQ29uZmlnLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZCB9KVxuICAgIGlmICghbWV0aG9kQ29uZmlnW3NjaGVtYUZpZWxkXSkgdGhyb3cgbmV3IEVycm9yKHNjaGVtYUZpZWxkICsgJyBub3QgZGVmaW5lZCBpbiBtZXRob2RzLmpzb24gJyArIG1ldGhvZE5hbWUpXG4gICAgdmFyIHZhbGlkYXRlID0gYWp2LmNvbXBpbGUobWV0aG9kQ29uZmlnW3NjaGVtYUZpZWxkXSlcbiAgICB2YXIgdmFsaWQgPSB2YWxpZGF0ZShkYXRhKVxuICAgIGlmICghdmFsaWQpIHtcbiAgICAgIENPTlNPTEUuZXJyb3IoJ3ZhbGlkYXRpb24gZXJyb3JzICcsIHtlcnJvcnM6IHZhbGlkYXRlLmVycm9ycywgbWV0aG9kTmFtZSwgZGF0YSwgc2NoZW1hRmllbGR9KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd2YWxpZGF0aW9uIGVycm9yICcsIHtlcnJvcnM6IHZhbGlkYXRlLmVycm9yc30pXG4gICAgfSBlbHNlIHJldHVybiBkYXRhXG4gIH1cbiAgdHJ5IHtcbiAgLy8gdmFyIGRlZmF1bHRFdmVudExpc3RlbiA9IHJlcXVpcmUoJy4vZGVmYXVsdC5ldmVudC5saXN0ZW4uanNvbicpXG4gICAgdmFyIGNvbmZpZ1xuXG4gICAgdmFyIGdldENoYW5uZWwgPSAoY2hhbm5lbE5hbWUpID0+IHJlcXVpcmUoYC4vY2hhbm5lbHMvJHtjaGFubmVsTmFtZX0uc2VydmVyYCkoe2dldENvbnNvbGUsIG1ldGhvZENhbGwsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGNvbmZpZzogY29uZmlnLmNoYW5uZWxzW2NoYW5uZWxOYW1lXX0pXG4gICAgdmFyIGZvckVhY2hDaGFubmVsID0gKGZ1bmMpID0+IE9iamVjdC5rZXlzKGNvbmZpZy5jaGFubmVscykuZm9yRWFjaCgoY2hhbm5lbE5hbWUpID0+IGZ1bmMoZ2V0Q2hhbm5lbChjaGFubmVsTmFtZSkpKVxuXG4gICAgLy8gb2duaSBtZXRob2QgY2FsbCBwdcOyIGF2ZXJlIHBpw7kgZGF0aSBhbmNoZSBkYXVzZXJpZCBlIHJlcXVlc3RpZCBkaXZlcnNpXG4gICAgdmFyIG1ldGhvZENhbGwgPSBhc3luYyBmdW5jdGlvbiBtZXRob2RDYWxsIChtZXNzYWdlLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSA9IHRydWUsIGNoYW5uZWwgPSAnVU5LTk9XJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgQ09OU09MRS5sb2coJz0+IFNFUlZFUiBJTicsIHttZXNzYWdlfSlcbiAgICAgICAgdmFsaWRhdGVSZXF1ZXN0KG1lc3NhZ2UpXG5cbiAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBtZXNzYWdlLm1ldGhvZFxuICAgICAgICB2YXIgbWV0YSA9IG1lc3NhZ2UubWV0YSB8fCB7fVxuICAgICAgICBtZXRhLmNvcnJpZCA9IG1ldGEuY29ycmlkIHx8IHV1aWRWNCgpXG4gICAgICAgIG1ldGEudXNlcmlkID0gbWV0YS51c2VyaWQgfHwgJ1VOS05PVydcbiAgICAgICAgbWV0YS5mcm9tID0gbWV0YS5mcm9tIHx8ICdVTktOT1cnXG4gICAgICAgIG1ldGEucmVxSW5UaW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgICAgIG1ldGEuY2hhbm5lbCA9IGNoYW5uZWxcbiAgICAgICAgdmFyIGRhdGEgPSBtZXNzYWdlLmRhdGEgfHwge31cblxuICAgICAgICB2YXIgc2VydmljZU1ldGhvZHNDb25maWcgPSBhd2FpdCBnZXRNZXRob2RzQ29uZmlnKHNlcnZpY2VOYW1lKVxuICAgICAgICB2YXIgbWV0aG9kcyA9IGdldE1ldGhvZHMoKVxuICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdKSB0aHJvdyBuZXcgRXJyb3IobWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkIChub3QgZGVmaW5lZCBpbiBtZXRob2RzIGNvbmZpZyknKVxuICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdLnB1YmxpYyAmJiBwdWJsaWNBcGkpIHRocm93IG5ldyBFcnJvcihtZXRob2ROYW1lICsgJyBpcyBub3QgcHVibGljJylcbiAgICAgICAgaWYgKCFtZXRob2RzW21ldGhvZE5hbWVdKSB0aHJvdyBuZXcgRXJyb3IobWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkIChub3QgZGVmaW5lZCBzZXJ2aWNlIG1ldGhvZHMganMgZmlsZSknKVxuICAgICAgICB2YXIgbWV0aG9kID0gbWV0aG9kc1ttZXRob2ROYW1lXVxuICAgICAgICB2YXIgbWV0aG9kQ29uZmlnID0gc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV1cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnbWV0aG9kQ2FsbCcsIHttZXNzYWdlLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSwgc2VydmljZU1ldGhvZHNDb25maWcsIG1ldGhvZENvbmZpZ30sIHNlcnZpY2VOYW1lKVxuXG4gICAgICAgIGRhdGEgPSB2YWxpZGF0ZVJlc3BvbnNlKG1ldGhvZENvbmZpZywgbWV0aG9kTmFtZSwgZGF0YSwgJ3JlcXVlc3RTY2hlbWEnKVxuXG4gICAgICAgIHZhciByZXNwb25zZVxuICAgICAgICAvLyBpZiBub1Jlc3BvbnNlIG5vdCBhd2FpdCByZXNwb25zZSBvbiB0aGUgY2xpZW50IHNpZGVcbiAgICAgICAgLy8gaWYgYWtub3dsZWdtZW50IGF3YWl0IHJlc3BvbnNlIG9uIHRoZSBjbGllbnQgc2lkZSBidXQgbm90IGF3YWl0IHJlc3BvbnNlIG9uIHRoZSBzZXJ2ZXIgc2lkZVxuICAgICAgICBpZiAobWV0aG9kQ29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ25vUmVzcG9uc2UnIHx8IG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGUgPT09ICdha25vd2xlZ21lbnQnKSB7XG4gICAgICAgICAgbWV0aG9kKGRhdGEsIG1ldGEsIGdldFN0cmVhbSB8fCBudWxsKVxuICAgICAgICAgIHJlc3BvbnNlID0gbnVsbFxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGUgPT09ICdyZXNwb25zZScpIHtcbiAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IG1ldGhvZChkYXRhLCBtZXRhLCBnZXRTdHJlYW0gfHwgbnVsbClcbiAgICAgICAgICByZXNwb25zZSA9IHZhbGlkYXRlUmVzcG9uc2UobWV0aG9kQ29uZmlnLCBtZXRob2ROYW1lLCByZXNwb25zZSwgJ3Jlc3BvbnNlU2NoZW1hJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IG1ldGhvZChkYXRhLCBtZXRhLCBnZXRTdHJlYW0gfHwgbnVsbClcbiAgICAgICAgfVxuXG4gICAgICAgIENPTlNPTEUubG9nKCdTRVJWRVIgT1VUID0+ICcsIHtyZXNwb25zZSwgcmVzcG9uc2VUeXBlOiBtZXRob2RDb25maWcucmVzcG9uc2VUeXBlfSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnTUFJTiBSRVNQT05TRSAnICsgbWV0aG9kTmFtZSwgcmVzcG9uc2UpXG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgQ09OU09MRS5lcnJvcihlcnJvciwge21ldGhvZE5hbWV9KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBtZXRob2RDYWxsJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGFzeW5jIHN0YXJ0ICgpIHtcbiAgICAgICAgY29uZmlnID0gYXdhaXQgZ2V0TmV0Q29uZmlnKHNlcnZpY2VOYW1lKVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdTVEFSVCBDSEFOTkVMUyBTRVJWRVJTICcsY29uZmlnKVxuICAgICAgICBjaGVja1JlcXVpcmVkKHtjaGFubmVsczpjb25maWcuY2hhbm5lbHN9LCBQQUNLQUdFKVxuICAgICAgICBmb3JFYWNoQ2hhbm5lbCgoY2hhbm5lbCkgPT4gY2hhbm5lbC5zdGFydCgpKVxuICAgICAgfSxcbiAgICAgIHN0b3AgKCkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdTVE9QIENIQU5ORUxTIFNFUlZFUlMgJywge2NoYW5uZWxzOiBjb25maWcuY2hhbm5lbHN9KVxuICAgICAgICBmb3JFYWNoQ2hhbm5lbCgoY2hhbm5lbCkgPT4gY2hhbm5lbC5zdG9wKCkpXG4gICAgICB9LFxuICAgICAgcmVzdGFydCAoKSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ1JFU1RBUlQgQ0hBTk5FTFMgU0VSVkVSUyAnLCB7Y2hhbm5lbHM6IGNvbmZpZy5jaGFubmVsc30pXG4gICAgICAgIGZvckVhY2hDaGFubmVsKChjaGFubmVsKSA9PiBjaGFubmVsLnJlc3RhcnQoKSlcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ09OU09MRS5lcnJvcihlcnJvcilcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBnZXROZXRTZXJ2ZXJQYWNrYWdlJylcbiAgfVxufVxuIl19