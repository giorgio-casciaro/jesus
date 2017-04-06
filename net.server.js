'use strict';

var R = require('ramda');
var uuidV4 = require('uuid/v4');
var ajv = require('ajv')({ allErrors: true });
var PACKAGE = 'net.server';
var checkRequired = require('./utils').checkRequired;
var validatorMsg = ajv.compile(require('./schemas/message.schema.json'));

module.exports = function getNetServerPackage(_ref) {
  var config = _ref.config,
      getConsole = _ref.getConsole,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? 'unknow' : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? 'unknow' : _ref$serviceId,
      getMethods = _ref.getMethods,
      getSharedConfig = _ref.getSharedConfig;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  checkRequired({ config: config, getMethods: getMethods, getSharedConfig: getSharedConfig, getConsole: getConsole });
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
    var getTrans = function getTrans(transportName) {
      return require('./transports/' + transportName + '.server')({ getSharedConfig: getSharedConfig, getConsole: getConsole, methodCall: methodCall, serviceName: serviceName, serviceId: serviceId, config: config.transports[transportName] });
    };
    var forEachTransport = function forEachTransport(func) {
      return Object.keys(config.transports).forEach(function (transportName) {
        return func(getTrans(transportName));
      });
    };

    config = R.merge({
      transports: {
        'grpc': {
          'url': 'localhost:8080',
          'public': true
        }
      }
    }, config);
    CONSOLE.debug('config ', config);
    // ogni method call può avere più dati anche dauserid e requestid diversi
    var methodCall = function methodCall(message, getStream) {
      var publicApi = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var transport = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'UNKNOW';
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
              meta.transport = transport;
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
      methodCall: methodCall,
      start: function start() {
        CONSOLE.log('START TRANSPORTS SERVERS ', { transports: config.transports });
        forEachTransport(function (transport) {
          return transport.start();
        });
      },
      stop: function stop() {
        CONSOLE.log('STOP TRANSPORTS SERVERS ', { transports: config.transports });
        forEachTransport(function (transport) {
          return transport.stop();
        });
      },
      restart: function restart() {
        CONSOLE.log('RESTART TRANSPORTS SERVERS ', { transports: config.transports });
        forEachTransport(function (transport) {
          return transport.restart();
        });
      }
    };
  } catch (error) {
    CONSOLE.error(error);
    throw new Error('Error during getNetServerPackage');
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwidXVpZFY0IiwiYWp2IiwiYWxsRXJyb3JzIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJ2YWxpZGF0b3JNc2ciLCJjb21waWxlIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldFNlcnZlclBhY2thZ2UiLCJjb25maWciLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJnZXRNZXRob2RzIiwiZ2V0U2hhcmVkQ29uZmlnIiwiQ09OU09MRSIsInZhbGlkYXRlTXNnIiwiZGF0YSIsImVycm9yIiwiZXJyb3JzIiwidmFsaWRhdGUiLCJFcnJvciIsIm1ldGhvZENvbmZpZyIsIm1ldGhvZE5hbWUiLCJzY2hlbWFGaWVsZCIsImRlYnVnIiwidmFsaWQiLCJnZXRUcmFucyIsInRyYW5zcG9ydE5hbWUiLCJtZXRob2RDYWxsIiwidHJhbnNwb3J0cyIsImZvckVhY2hUcmFuc3BvcnQiLCJmdW5jIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJtZXJnZSIsIm1lc3NhZ2UiLCJnZXRTdHJlYW0iLCJwdWJsaWNBcGkiLCJ0cmFuc3BvcnQiLCJsb2ciLCJtZXRob2QiLCJtZXRhIiwiY29ycmlkIiwidXNlcmlkIiwiZnJvbSIsInJlcUluVGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInNlcnZpY2VNZXRob2RzQ29uZmlnIiwibWV0aG9kcyIsInB1YmxpYyIsInJlc3BvbnNlVHlwZSIsInJlc3BvbnNlIiwic3RhcnQiLCJzdG9wIiwicmVzdGFydCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQU1DLFNBQVNELFFBQVEsU0FBUixDQUFmO0FBQ0EsSUFBSUUsTUFBTUYsUUFBUSxLQUFSLEVBQWUsRUFBQ0csV0FBVyxJQUFaLEVBQWYsQ0FBVjtBQUNBLElBQU1DLFVBQVUsWUFBaEI7QUFDQSxJQUFNQyxnQkFBZ0JMLFFBQVEs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SCxZQUFRRyxLQUFSLENBQWNBLEtBQWQ7QUFDQSxVQUFNLElBQUlHLEtBQUosQ0FBVSxrQ0FBVixDQUFOO0FBQ0Q7QUFDRixDQW5HRCIsImZpbGUiOiJuZXQuc2VydmVyLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxuY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG52YXIgYWp2ID0gcmVxdWlyZSgnYWp2Jykoe2FsbEVycm9yczogdHJ1ZX0pXG5jb25zdCBQQUNLQUdFID0gJ25ldC5zZXJ2ZXInXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi91dGlscycpLmNoZWNrUmVxdWlyZWRcbnZhciB2YWxpZGF0b3JNc2cgPSBhanYuY29tcGlsZShyZXF1aXJlKCcuL3NjaGVtYXMvbWVzc2FnZS5zY2hlbWEuanNvbicpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE5ldFNlcnZlclBhY2thZ2UgKHtjb25maWcsIGdldENvbnNvbGUsIHNlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWd9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICBjaGVja1JlcXVpcmVkKHtjb25maWcsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZywgZ2V0Q29uc29sZX0pXG4gIHZhciB2YWxpZGF0ZU1zZyA9IChkYXRhKSA9PiB7XG4gICAgaWYgKCF2YWxpZGF0b3JNc2coZGF0YSkpIHtcbiAgICAgIENPTlNPTEUuZXJyb3IoJ01FU1NBR0UgSVMgTk9UIFZBTElEICcsIHtlcnJvcnM6IHZhbGlkYXRlLmVycm9yc30pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01FU1NBR0UgSVMgTk9UIFZBTElEJywge2Vycm9yczogdmFsaWRhdG9yTXNnLmVycm9yc30pXG4gICAgfSBlbHNlIHJldHVybiBkYXRhXG4gIH1cbiAgdHJ5IHtcbiAgLy8gdmFyIGRlZmF1bHRFdmVudExpc3RlbiA9IHJlcXVpcmUoJy4vZGVmYXVsdC5ldmVudC5saXN0ZW4uanNvbicpXG4gICAgdmFyIHZhbGlkYXRlID0gKG1ldGhvZENvbmZpZywgbWV0aG9kTmFtZSwgZGF0YSwgc2NoZW1hRmllbGQgPSAncmVxdWVzdFNjaGVtYScpID0+IHtcbiAgICAgIENPTlNPTEUuZGVidWcoJ3ZhbGlkYXRlICcsIHsgbWV0aG9kQ29uZmlnLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZCB9KVxuICAgICAgaWYgKCFtZXRob2RDb25maWdbc2NoZW1hRmllbGRdKSB0aHJvdyBuZXcgRXJyb3Ioc2NoZW1hRmllbGQgKyAnIG5vdCBkZWZpbmVkIGluIG1ldGhvZHMuanNvbiAnICsgbWV0aG9kTmFtZSlcbiAgICAgIHZhciB2YWxpZGF0ZSA9IGFqdi5jb21waWxlKG1ldGhvZENvbmZpZ1tzY2hlbWFGaWVsZF0pXG4gICAgICB2YXIgdmFsaWQgPSB2YWxpZGF0ZShkYXRhKVxuICAgICAgaWYgKCF2YWxpZCkge1xuICAgICAgICBDT05TT0xFLmVycm9yKCd2YWxpZGF0aW9uIGVycm9ycyAnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnMsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkfSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd2YWxpZGF0aW9uIGVycm9yICcsIHtlcnJvcnM6IHZhbGlkYXRlLmVycm9yc30pXG4gICAgICB9IGVsc2UgcmV0dXJuIGRhdGFcbiAgICB9XG4gICAgdmFyIGdldFRyYW5zID0gKHRyYW5zcG9ydE5hbWUpID0+IHJlcXVpcmUoYC4vdHJhbnNwb3J0cy8ke3RyYW5zcG9ydE5hbWV9LnNlcnZlcmApKHtnZXRTaGFyZWRDb25maWcsIGdldENvbnNvbGUsIG1ldGhvZENhbGwsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGNvbmZpZzogY29uZmlnLnRyYW5zcG9ydHNbdHJhbnNwb3J0TmFtZV19KVxuICAgIHZhciBmb3JFYWNoVHJhbnNwb3J0ID0gKGZ1bmMpID0+IE9iamVjdC5rZXlzKGNvbmZpZy50cmFuc3BvcnRzKS5mb3JFYWNoKCh0cmFuc3BvcnROYW1lKSA9PiBmdW5jKGdldFRyYW5zKHRyYW5zcG9ydE5hbWUpKSlcblxuICAgIGNvbmZpZyA9IFIubWVyZ2Uoe1xuICAgICAgdHJhbnNwb3J0czoge1xuICAgICAgICAnZ3JwYyc6IHtcbiAgICAgICAgICAndXJsJzogJ2xvY2FsaG9zdDo4MDgwJyxcbiAgICAgICAgICAncHVibGljJzogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgY29uZmlnKVxuICAgIENPTlNPTEUuZGVidWcoJ2NvbmZpZyAnLCBjb25maWcpXG4gICAgLy8gb2duaSBtZXRob2QgY2FsbCBwdcOyIGF2ZXJlIHBpw7kgZGF0aSBhbmNoZSBkYXVzZXJpZCBlIHJlcXVlc3RpZCBkaXZlcnNpXG4gICAgdmFyIG1ldGhvZENhbGwgPSBhc3luYyBmdW5jdGlvbiBtZXRob2RDYWxsIChtZXNzYWdlLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSA9IHRydWUsIHRyYW5zcG9ydCA9ICdVTktOT1cnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBDT05TT0xFLmxvZygnPT4gU0VSVkVSIElOJywge21lc3NhZ2V9KVxuICAgICAgICB2YWxpZGF0ZU1zZyhtZXNzYWdlKVxuXG4gICAgICAgIHZhciBtZXRob2ROYW1lID0gbWVzc2FnZS5tZXRob2RcbiAgICAgICAgdmFyIG1ldGEgPSBtZXNzYWdlLm1ldGEgfHwge31cbiAgICAgICAgbWV0YS5jb3JyaWQgPSBtZXRhLmNvcnJpZCB8fCB1dWlkVjQoKVxuICAgICAgICBtZXRhLnVzZXJpZCA9IG1ldGEudXNlcmlkIHx8ICdVTktOT1cnXG4gICAgICAgIG1ldGEuZnJvbSA9IG1ldGEuZnJvbSB8fCAnVU5LTk9XJ1xuICAgICAgICBtZXRhLnJlcUluVGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgICAgICBtZXRhLnRyYW5zcG9ydCA9IHRyYW5zcG9ydFxuICAgICAgICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YSB8fCB7fVxuXG4gICAgICAgIHZhciBzZXJ2aWNlTWV0aG9kc0NvbmZpZyA9IGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ21ldGhvZHMnKVxuICAgICAgICB2YXIgbWV0aG9kcyA9IGdldE1ldGhvZHMoKVxuICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdKSB0aHJvdyBuZXcgRXJyb3IobWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkIChub3QgZGVmaW5lZCBpbiBtZXRob2RzIGNvbmZpZyknKVxuICAgICAgICBpZiAoIXNlcnZpY2VNZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdLnB1YmxpYyAmJiBwdWJsaWNBcGkpIHRocm93IG5ldyBFcnJvcihtZXRob2ROYW1lICsgJyBpcyBub3QgcHVibGljJylcbiAgICAgICAgaWYgKCFtZXRob2RzW21ldGhvZE5hbWVdKSB0aHJvdyBuZXcgRXJyb3IobWV0aG9kTmFtZSArICcgaXMgbm90IHZhbGlkIChub3QgZGVmaW5lZCBzZXJ2aWNlIG1ldGhvZHMganMgZmlsZSknKVxuICAgICAgICB2YXIgbWV0aG9kID0gbWV0aG9kc1ttZXRob2ROYW1lXVxuICAgICAgICB2YXIgbWV0aG9kQ29uZmlnID0gc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV1cbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnbWV0aG9kQ2FsbCcsIHttZXNzYWdlLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSwgc2VydmljZU1ldGhvZHNDb25maWcsIG1ldGhvZENvbmZpZ30sIHNlcnZpY2VOYW1lKVxuXG4gICAgICAgIGRhdGEgPSB2YWxpZGF0ZShtZXRob2RDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsICdyZXF1ZXN0U2NoZW1hJylcblxuICAgICAgICB2YXIgcmVzcG9uc2VcbiAgICAgICAgLy8gaWYgbm9SZXNwb25zZSBub3QgYXdhaXQgcmVzcG9uc2Ugb24gdGhlIGNsaWVudCBzaWRlXG4gICAgICAgIC8vIGlmIGFrbm93bGVnbWVudCBhd2FpdCByZXNwb25zZSBvbiB0aGUgY2xpZW50IHNpZGUgYnV0IG5vdCBhd2FpdCByZXNwb25zZSBvbiB0aGUgc2VydmVyIHNpZGVcbiAgICAgICAgaWYgKG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGUgPT09ICdub1Jlc3BvbnNlJyB8fCBtZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAnYWtub3dsZWdtZW50Jykge1xuICAgICAgICAgIG1ldGhvZChkYXRhLCBtZXRhLCBnZXRTdHJlYW0gfHwgbnVsbClcbiAgICAgICAgICByZXNwb25zZSA9IG51bGxcbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAncmVzcG9uc2UnKSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2QoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtIHx8IG51bGwpXG4gICAgICAgICAgcmVzcG9uc2UgPSB2YWxpZGF0ZShtZXRob2RDb25maWcsIG1ldGhvZE5hbWUsIHJlc3BvbnNlLCAncmVzcG9uc2VTY2hlbWEnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3BvbnNlID0gYXdhaXQgbWV0aG9kKGRhdGEsIG1ldGEsIGdldFN0cmVhbSB8fCBudWxsKVxuICAgICAgICB9XG5cbiAgICAgICAgQ09OU09MRS5sb2coJ1NFUlZFUiBPVVQgPT4gJywge3Jlc3BvbnNlLCByZXNwb25zZVR5cGU6IG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGV9KVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdNQUlOIFJFU1BPTlNFICcgKyBtZXRob2ROYW1lLCByZXNwb25zZSlcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBDT05TT0xFLmVycm9yKGVycm9yLCB7bWV0aG9kTmFtZX0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgZHVyaW5nIG1ldGhvZENhbGwnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgbWV0aG9kQ2FsbCxcbiAgICAgIHN0YXJ0ICgpIHtcbiAgICAgICAgQ09OU09MRS5sb2coJ1NUQVJUIFRSQU5TUE9SVFMgU0VSVkVSUyAnLCB7dHJhbnNwb3J0czogY29uZmlnLnRyYW5zcG9ydHN9KVxuICAgICAgICBmb3JFYWNoVHJhbnNwb3J0KCh0cmFuc3BvcnQpID0+IHRyYW5zcG9ydC5zdGFydCgpKVxuICAgICAgfSxcbiAgICAgIHN0b3AgKCkge1xuICAgICAgICBDT05TT0xFLmxvZygnU1RPUCBUUkFOU1BPUlRTIFNFUlZFUlMgJywge3RyYW5zcG9ydHM6IGNvbmZpZy50cmFuc3BvcnRzfSlcbiAgICAgICAgZm9yRWFjaFRyYW5zcG9ydCgodHJhbnNwb3J0KSA9PiB0cmFuc3BvcnQuc3RvcCgpKVxuICAgICAgfSxcbiAgICAgIHJlc3RhcnQgKCkge1xuICAgICAgICBDT05TT0xFLmxvZygnUkVTVEFSVCBUUkFOU1BPUlRTIFNFUlZFUlMgJywge3RyYW5zcG9ydHM6IGNvbmZpZy50cmFuc3BvcnRzfSlcbiAgICAgICAgZm9yRWFjaFRyYW5zcG9ydCgodHJhbnNwb3J0KSA9PiB0cmFuc3BvcnQucmVzdGFydCgpKVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDT05TT0xFLmVycm9yKGVycm9yKVxuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgZHVyaW5nIGdldE5ldFNlcnZlclBhY2thZ2UnKVxuICB9XG59XG4iXX0=