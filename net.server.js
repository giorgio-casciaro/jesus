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
  transports: {
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
    var getTrans = function getTrans(transportName) {
      return require('./transports/' + transportName + '.server')({ getSharedConfig: getSharedConfig, getConsole: getConsole, methodCall: methodCall, serviceName: serviceName, serviceId: serviceId, config: config.transports[transportName] });
    };
    var forEachTransport = function forEachTransport(func) {
      return Object.keys(config.transports).forEach(function (transportName) {
        return func(getTrans(transportName));
      });
    };

    config = R.merge(defaultConfig, config);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwidXVpZFY0IiwiYWp2IiwiYWxsRXJyb3JzIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJ2YWxpZGF0b3JNc2ciLCJjb21waWxlIiwiZGVmYXVsdEdldENvbnNvbGUiLCJjb25zb2xlIiwiZGVmYXVsdEdldE1ldGhvZHMiLCJ0ZXN0IiwiZWNobyIsImRlZmF1bHRDb25maWciLCJ0cmFuc3BvcnRzIiwidXJsIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldFNlcnZlclBhY2thZ2UiLCJjb25maWciLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJnZXRNZXRob2RzIiwiZ2V0U2hhcmVkQ29uZmlnIiwiQ09OU09MRSIsImRlYnVnIiwidmFsaWRhdGVNc2ciLCJkYXRhIiwiZXJyb3IiLCJlcnJvcnMiLCJ2YWxpZGF0ZSIsIkVycm9yIiwibWV0aG9kQ29uZmlnIiwibWV0aG9kTmFtZSIsInNjaGVtYUZpZWxkIiwidmFsaWQiLCJnZXRUcmFucyIsInRyYW5zcG9ydE5hbWUiLCJtZXRob2RDYWxsIiwiZm9yRWFjaFRyYW5zcG9ydCIsImZ1bmMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsIm1lcmdlIiwibWVzc2FnZSIsImdldFN0cmVhbSIsInB1YmxpY0FwaSIsInRyYW5zcG9ydCIsImxvZyIsIm1ldGhvZCIsIm1ldGEiLCJjb3JyaWQiLCJ1c2VyaWQiLCJmcm9tIiwicmVxSW5UaW1lc3RhbXAiLCJEYXRlIiwibm93Iiwic2VydmljZU1ldGhvZHNDb25maWciLCJtZXRob2RzIiwicHVibGljIiwicmVzcG9uc2VUeXBlIiwicmVzcG9uc2UiLCJzdGFydCIsInN0b3AiLCJyZXN0YXJ0Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBTUMsU0FBU0QsUUFBUSxTQUFSLENBQWY7QUFDQSxJQUFJRSxNQUFNRixRQUFRLEtBQVIsRUFBZSxFQUFDRyxXQUFXLElBQVosRUFBZixDQUFWO0FBQ0EsSUFBTUMsVUFBVSxZQUFoQjtBQUNBLElBQU1DLGdCQUFnQkwsUUFBUSxTQUFSLEVBQW1CSyxhQUF6QztBQUNBLElBQUlDLGVBQWVKLElBQUlLLE9BQUosQ0FBWVAsUUFBUSwrQkFBUixDQUFaLENBQW5COztBQUVBLFNBQVNRLGlCQUFULEdBQTRCO0FBQUMsU0FBT0MsT0FBUDtBQUFlO0FBQzVDLFNBQVNDLGlCQUFULEdBQTRCO0FBQUMsU0FBTyxFQUFDQyxNQUFLLGNBQUNDLElBQUQ7QUFBQSxhQUFRQSxJQUFSO0FBQUEsS0FBTixFQUFQO0FBQTJCO0FBQ3hELElBQUlDLGdCQUFjO0FBQ2hCQyxjQUFZO0FBQ1YsWUFBUTtBQUNOQyxXQUFLO0FBREM7QUFERTtBQURJLENBQWxCOztBQVNBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQVNDLG1CQUFULE9BQWtMO0FBQUEseUJBQW5KQyxNQUFtSjtBQUFBLE1BQW5KQSxNQUFtSiwrQkFBM0lOLGFBQTJJO0FBQUEsNkJBQTVITyxVQUE0SDtBQUFBLE1BQTVIQSxVQUE0SCxtQ0FBakhaLGlCQUFpSDtBQUFBLDhCQUE5RmEsV0FBOEY7QUFBQSxNQUE5RkEsV0FBOEYsb0NBQWhGLFFBQWdGO0FBQUEsNEJBQXRFQyxTQUFzRTtBQUFBLE1BQXRFQSxTQUFzRSxrQ0FBMUQsUUFBMEQ7QUFBQSw2QkFBaERDLFVBQWdEO0FBQUEsTUFBaERBLFVBQWdELG1DQUFyQ2IsaUJBQXFDO0FBQUEsTUFBbEJjLGVBQWtCLFFBQWxCQSxlQUFrQjs7QUFDak0sTUFBSUMsVUFBVUwsV0FBV0MsV0FBWCxFQUF3QkMsU0FBeEIsRUFBbUNsQixPQUFuQyxDQUFkO0FBQ0FDLGdCQUFjLEVBQUNrQixzQkFBRCxFQUFhQyxnQ0FBYixFQUE4Qkosc0JBQTlCLEVBQWQ7QUFDQUssVUFBUUMsS0FBUixDQUFjLHNCQUFkLEVBQXNDLEVBQUVQLGNBQUYsRUFBdEM7QUFDQSxNQUFJUSxjQUFjLFNBQWRBLFdBQWMsQ0FBQ0MsSUFBRCxFQUFVO0FBQzFCLFFBQUksQ0FBQ3RCLGFBQWFzQixJQUFiLENBQUwsRUFBeUI7QUFDdkJILGNBQVFJLEtBQVIsQ0FBYyx1QkFBZCxFQUF1QyxFQUFDQyxRQUFRQyxTQUFTRCxNQUFsQixFQUF2QztBQUNBLFlBQU0sSUFBSUUsS0FBSixDQUFVLHNCQUFWLEVBQWtDLEVBQUNGLFFBQVF4QixhQUFhd0IsTUFBdEIsRUFBbEMsQ0FBTjtBQUNELEtBSEQsTUFHTyxPQUFPRixJQUFQO0FBQ1IsR0FMRDtBQU1BLE1BQUk7QUFDSjtBQUNFLFFBQUlHLFdBQVcsa0JBQUNFLFlBQUQsRUFBZUMsVUFBZixFQUEyQk4sSUFBM0IsRUFBbUU7QUFBQSxVQUFsQ08sV0FBa0MsdUVBQXBCLGVBQW9COztBQUNoRlYsY0FBUUMsS0FBUixDQUFjLFdBQWQsRUFBMkIsRUFBRU8sMEJBQUYsRUFBZ0JDLHNCQUFoQixFQUE0Qk4sVUFBNUIsRUFBa0NPLHdCQUFsQyxFQUEzQjtBQUNBLFVBQUksQ0FBQ0YsYUFBYUUsV0FBYixDQUFMLEVBQWdDLE1BQU0sSUFBSUgsS0FBSixDQUFVRyxjQUFjLCtCQUFkLEdBQWdERCxVQUExRCxDQUFOO0FBQ2hDLFVBQUlILFdBQVc3QixJQUFJSyxPQUFKLENBQVkwQixhQUFhRSxXQUFiLENBQVosQ0FBZjtBQUNBLFVBQUlDLFFBQVFMLFNBQVNILElBQVQsQ0FBWjtBQUNBLFVBQUksQ0FBQ1EsS0FBTCxFQUFZO0FBQ1ZYLGdCQUFRSSxLQUFSLENBQWMsb0JBQWQsRUFBb0MsRUFBQ0MsUUFBUUMsU0FBU0QsTUFBbEIsRUFBMEJJLHNCQUExQixFQUFzQ04sVUFBdEMsRUFBNENPLHdCQUE1QyxFQUFwQztBQUNBLGNBQU0sSUFBSUgsS0FBSixDQUFVLG1CQUFWLEVBQStCLEVBQUNGLFFBQVFDLFNBQVNELE1BQWxCLEVBQS9CLENBQU47QUFDRCxPQUhELE1BR08sT0FBT0YsSUFBUDtBQUNSLEtBVEQ7QUFVQSxRQUFJUyxXQUFXLFNBQVhBLFFBQVcsQ0FBQ0MsYUFBRDtBQUFBLGFBQW1CdEMsMEJBQXdCc0MsYUFBeEIsY0FBZ0QsRUFBQ2QsZ0NBQUQsRUFBa0JKLHNCQUFsQixFQUE4Qm1CLHNCQUE5QixFQUEwQ2xCLHdCQUExQyxFQUF1REMsb0JBQXZELEVBQWtFSCxRQUFRQSxPQUFPTCxVQUFQLENBQWtCd0IsYUFBbEIsQ0FBMUUsRUFBaEQsQ0FBbkI7QUFBQSxLQUFmO0FBQ0EsUUFBSUUsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBQ0MsSUFBRDtBQUFBLGFBQVVDLE9BQU9DLElBQVAsQ0FBWXhCLE9BQU9MLFVBQW5CLEVBQStCOEIsT0FBL0IsQ0FBdUMsVUFBQ04sYUFBRDtBQUFBLGVBQW1CRyxLQUFLSixTQUFTQyxhQUFULENBQUwsQ0FBbkI7QUFBQSxPQUF2QyxDQUFWO0FBQUEsS0FBdkI7O0FBRUFuQixhQUFTcEIsRUFBRThDLEtBQUYsQ0FBUWhDLGFBQVIsRUFBdUJNLE1BQXZCLENBQVQ7QUFDQU0sWUFBUUMsS0FBUixDQUFjLFNBQWQsRUFBeUJQLE1BQXpCO0FBQ0E7QUFDQSxRQUFJb0IsYUFBYSxTQUFlQSxVQUFmLENBQTJCTyxPQUEzQixFQUFvQ0MsU0FBcEM7QUFBQSxVQUErQ0MsU0FBL0MsdUVBQTJELElBQTNEO0FBQUEsVUFBaUVDLFNBQWpFLHVFQUE2RSxRQUE3RTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFFYnhCLHNCQUFReUIsR0FBUixDQUFZLGNBQVosRUFBNEIsRUFBQ0osZ0JBQUQsRUFBNUI7QUFDQW5CLDBCQUFZbUIsT0FBWjs7QUFFSVosd0JBTFMsR0FLSVksUUFBUUssTUFMWjtBQU1UQyxrQkFOUyxHQU1GTixRQUFRTSxJQUFSLElBQWdCLEVBTmQ7O0FBT2JBLG1CQUFLQyxNQUFMLEdBQWNELEtBQUtDLE1BQUwsSUFBZXBELFFBQTdCO0FBQ0FtRCxtQkFBS0UsTUFBTCxHQUFjRixLQUFLRSxNQUFMLElBQWUsUUFBN0I7QUFDQUYsbUJBQUtHLElBQUwsR0FBWUgsS0FBS0csSUFBTCxJQUFhLFFBQXpCO0FBQ0FILG1CQUFLSSxjQUFMLEdBQXNCQyxLQUFLQyxHQUFMLEVBQXRCO0FBQ0FOLG1CQUFLSCxTQUFMLEdBQWlCQSxTQUFqQjtBQUNJckIsa0JBWlMsR0FZRmtCLFFBQVFsQixJQUFSLElBQWdCLEVBWmQ7QUFBQTtBQUFBLDhDQWNvQkosZ0JBQWdCSCxXQUFoQixFQUE2QixTQUE3QixDQWRwQjs7QUFBQTtBQWNUc0Msa0NBZFM7QUFlVEMscUJBZlMsR0FlQ3JDLFlBZkQ7O0FBQUEsa0JBZ0JSb0MscUJBQXFCekIsVUFBckIsQ0FoQlE7QUFBQTtBQUFBO0FBQUE7O0FBQUEsb0JBZ0JnQyxJQUFJRixLQUFKLENBQVVFLGFBQWEsK0NBQXZCLENBaEJoQzs7QUFBQTtBQUFBLG9CQWlCVCxDQUFDeUIscUJBQXFCekIsVUFBckIsRUFBaUMyQixNQUFsQyxJQUE0Q2IsU0FqQm5DO0FBQUE7QUFBQTtBQUFBOztBQUFBLG9CQWlCb0QsSUFBSWhCLEtBQUosQ0FBVUUsYUFBYSxnQkFBdkIsQ0FqQnBEOztBQUFBO0FBQUEsa0JBa0JSMEIsUUFBUTFCLFVBQVIsQ0FsQlE7QUFBQTtBQUFBO0FBQUE7O0FBQUEsb0JBa0JtQixJQUFJRixLQUFKLENBQVVFLGFBQWEscURBQXZCLENBbEJuQjs7QUFBQTtBQW1CVGlCLG9CQW5CUyxHQW1CQVMsUUFBUTFCLFVBQVIsQ0FuQkE7QUFvQlRELDBCQXBCUyxHQW9CTTBCLHFCQUFxQnpCLFVBQXJCLENBcEJOOztBQXFCYlQsc0JBQVFDLEtBQVIsQ0FBYyxZQUFkLEVBQTRCLEVBQUNvQixnQkFBRCxFQUFVQyxvQkFBVixFQUFxQkMsb0JBQXJCLEVBQWdDVywwQ0FBaEMsRUFBc0QxQiwwQkFBdEQsRUFBNUIsRUFBaUdaLFdBQWpHOztBQUVBTyxxQkFBT0csU0FBU0UsWUFBVCxFQUF1QkMsVUFBdkIsRUFBbUNOLElBQW5DLEVBQXlDLGVBQXpDLENBQVA7O0FBdkJhLG9CQTRCVEssYUFBYTZCLFlBQWIsS0FBOEIsWUFBOUIsSUFBOEM3QixhQUFhNkIsWUFBYixLQUE4QixjQTVCbkU7QUFBQTtBQUFBO0FBQUE7O0FBNkJYWCxxQkFBT3ZCLElBQVAsRUFBYXdCLElBQWIsRUFBbUJMLGFBQWEsSUFBaEM7QUFDQWdCLHlCQUFXLElBQVg7QUE5Qlc7QUFBQTs7QUFBQTtBQUFBLG9CQStCRjlCLGFBQWE2QixZQUFiLEtBQThCLFVBL0I1QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLDhDQWdDTVgsT0FBT3ZCLElBQVAsRUFBYXdCLElBQWIsRUFBbUJMLGFBQWEsSUFBaEMsQ0FoQ047O0FBQUE7QUFnQ1hnQixzQkFoQ1c7O0FBaUNYQSx5QkFBV2hDLFNBQVNFLFlBQVQsRUFBdUJDLFVBQXZCLEVBQW1DNkIsUUFBbkMsRUFBNkMsZ0JBQTdDLENBQVg7QUFqQ1c7QUFBQTs7QUFBQTtBQUFBO0FBQUEsOENBbUNNWixPQUFPdkIsSUFBUCxFQUFhd0IsSUFBYixFQUFtQkwsYUFBYSxJQUFoQyxDQW5DTjs7QUFBQTtBQW1DWGdCLHNCQW5DVzs7QUFBQTs7QUFzQ2J0QyxzQkFBUXlCLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixFQUFDYSxrQkFBRCxFQUFXRCxjQUFjN0IsYUFBYTZCLFlBQXRDLEVBQTlCO0FBQ0FyQyxzQkFBUUMsS0FBUixDQUFjLG1CQUFtQlEsVUFBakMsRUFBNkM2QixRQUE3QztBQXZDYSwrQ0F3Q05BLFFBeENNOztBQUFBO0FBQUE7QUFBQTs7QUEwQ2J0QyxzQkFBUUksS0FBUixjQUFxQixFQUFDSyxzQkFBRCxFQUFyQjtBQTFDYSxvQkEyQ1AsSUFBSUYsS0FBSixDQUFVLHlCQUFWLENBM0NPOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQWpCO0FBOENBLFdBQU87QUFDTGdDLFdBREssbUJBQ0k7QUFDUHZDLGdCQUFReUIsR0FBUixDQUFZLDJCQUFaLEVBQXlDLEVBQUNwQyxZQUFZSyxPQUFPTCxVQUFwQixFQUF6QztBQUNBMEIseUJBQWlCLFVBQUNTLFNBQUQ7QUFBQSxpQkFBZUEsVUFBVWUsS0FBVixFQUFmO0FBQUEsU0FBakI7QUFDRCxPQUpJO0FBS0xDLFVBTEssa0JBS0c7QUFDTnhDLGdCQUFReUIsR0FBUixDQUFZLDBCQUFaLEVBQXdDLEVBQUNwQyxZQUFZSyxPQUFPTCxVQUFwQixFQUF4QztBQUNBMEIseUJBQWlCLFVBQUNTLFNBQUQ7QUFBQSxpQkFBZUEsVUFBVWdCLElBQVYsRUFBZjtBQUFBLFNBQWpCO0FBQ0QsT0FSSTtBQVNMQyxhQVRLLHFCQVNNO0FBQ1R6QyxnQkFBUXlCLEdBQVIsQ0FBWSw2QkFBWixFQUEyQyxFQUFDcEMsWUFBWUssT0FBT0wsVUFBcEIsRUFBM0M7QUFDQTBCLHlCQUFpQixVQUFDUyxTQUFEO0FBQUEsaUJBQWVBLFVBQVVpQixPQUFWLEVBQWY7QUFBQSxTQUFqQjtBQUNEO0FBWkksS0FBUDtBQWNELEdBOUVELENBOEVFLE9BQU9yQyxLQUFQLEVBQWM7QUFDZEosWUFBUUksS0FBUixDQUFjQSxLQUFkO0FBQ0EsVUFBTSxJQUFJRyxLQUFKLENBQVUsa0NBQVYsQ0FBTjtBQUNEO0FBQ0YsQ0E1RkQiLCJmaWxlIjoibmV0LnNlcnZlci5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxudmFyIGFqdiA9IHJlcXVpcmUoJ2FqdicpKHthbGxFcnJvcnM6IHRydWV9KVxuY29uc3QgUEFDS0FHRSA9ICduZXQuc2VydmVyJ1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vdXRpbHMnKS5jaGVja1JlcXVpcmVkXG52YXIgdmFsaWRhdG9yTXNnID0gYWp2LmNvbXBpbGUocmVxdWlyZSgnLi9zY2hlbWFzL21lc3NhZ2Uuc2NoZW1hLmpzb24nKSlcblxuZnVuY3Rpb24gZGVmYXVsdEdldENvbnNvbGUoKXtyZXR1cm4gY29uc29sZX1cbmZ1bmN0aW9uIGRlZmF1bHRHZXRNZXRob2RzKCl7cmV0dXJuIHt0ZXN0OihlY2hvKT0+ZWNob319XG52YXIgZGVmYXVsdENvbmZpZz17XG4gIHRyYW5zcG9ydHM6IHtcbiAgICAndGVzdCc6IHtcbiAgICAgIHVybDogJ2xvY2FsaG9zdDoxMDA4MCdcbiAgICB9XG4gIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE5ldFNlcnZlclBhY2thZ2UgKHtjb25maWc9IGRlZmF1bHRDb25maWcsIGdldENvbnNvbGU9ZGVmYXVsdEdldENvbnNvbGUsIHNlcnZpY2VOYW1lID0gJ3Vua25vdycsIHNlcnZpY2VJZCA9ICd1bmtub3cnLCBnZXRNZXRob2RzPWRlZmF1bHRHZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWd9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICBjaGVja1JlcXVpcmVkKHtnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWcsIGdldENvbnNvbGV9KVxuICBDT05TT0xFLmRlYnVnKCdnZXROZXRTZXJ2ZXJQYWNrYWdlICcsIHsgY29uZmlnfSlcbiAgdmFyIHZhbGlkYXRlTXNnID0gKGRhdGEpID0+IHtcbiAgICBpZiAoIXZhbGlkYXRvck1zZyhkYXRhKSkge1xuICAgICAgQ09OU09MRS5lcnJvcignTUVTU0FHRSBJUyBOT1QgVkFMSUQgJywge2Vycm9yczogdmFsaWRhdGUuZXJyb3JzfSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignTUVTU0FHRSBJUyBOT1QgVkFMSUQnLCB7ZXJyb3JzOiB2YWxpZGF0b3JNc2cuZXJyb3JzfSlcbiAgICB9IGVsc2UgcmV0dXJuIGRhdGFcbiAgfVxuICB0cnkge1xuICAvLyB2YXIgZGVmYXVsdEV2ZW50TGlzdGVuID0gcmVxdWlyZSgnLi9kZWZhdWx0LmV2ZW50Lmxpc3Rlbi5qc29uJylcbiAgICB2YXIgdmFsaWRhdGUgPSAobWV0aG9kQ29uZmlnLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZCA9ICdyZXF1ZXN0U2NoZW1hJykgPT4ge1xuICAgICAgQ09OU09MRS5kZWJ1ZygndmFsaWRhdGUgJywgeyBtZXRob2RDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkIH0pXG4gICAgICBpZiAoIW1ldGhvZENvbmZpZ1tzY2hlbWFGaWVsZF0pIHRocm93IG5ldyBFcnJvcihzY2hlbWFGaWVsZCArICcgbm90IGRlZmluZWQgaW4gbWV0aG9kcy5qc29uICcgKyBtZXRob2ROYW1lKVxuICAgICAgdmFyIHZhbGlkYXRlID0gYWp2LmNvbXBpbGUobWV0aG9kQ29uZmlnW3NjaGVtYUZpZWxkXSlcbiAgICAgIHZhciB2YWxpZCA9IHZhbGlkYXRlKGRhdGEpXG4gICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgIENPTlNPTEUuZXJyb3IoJ3ZhbGlkYXRpb24gZXJyb3JzICcsIHtlcnJvcnM6IHZhbGlkYXRlLmVycm9ycywgbWV0aG9kTmFtZSwgZGF0YSwgc2NoZW1hRmllbGR9KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZhbGlkYXRpb24gZXJyb3IgJywge2Vycm9yczogdmFsaWRhdGUuZXJyb3JzfSlcbiAgICAgIH0gZWxzZSByZXR1cm4gZGF0YVxuICAgIH1cbiAgICB2YXIgZ2V0VHJhbnMgPSAodHJhbnNwb3J0TmFtZSkgPT4gcmVxdWlyZShgLi90cmFuc3BvcnRzLyR7dHJhbnNwb3J0TmFtZX0uc2VydmVyYCkoe2dldFNoYXJlZENvbmZpZywgZ2V0Q29uc29sZSwgbWV0aG9kQ2FsbCwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgY29uZmlnOiBjb25maWcudHJhbnNwb3J0c1t0cmFuc3BvcnROYW1lXX0pXG4gICAgdmFyIGZvckVhY2hUcmFuc3BvcnQgPSAoZnVuYykgPT4gT2JqZWN0LmtleXMoY29uZmlnLnRyYW5zcG9ydHMpLmZvckVhY2goKHRyYW5zcG9ydE5hbWUpID0+IGZ1bmMoZ2V0VHJhbnModHJhbnNwb3J0TmFtZSkpKVxuXG4gICAgY29uZmlnID0gUi5tZXJnZShkZWZhdWx0Q29uZmlnLCBjb25maWcpXG4gICAgQ09OU09MRS5kZWJ1ZygnY29uZmlnICcsIGNvbmZpZylcbiAgICAvLyBvZ25pIG1ldGhvZCBjYWxsIHB1w7IgYXZlcmUgcGnDuSBkYXRpIGFuY2hlIGRhdXNlcmlkIGUgcmVxdWVzdGlkIGRpdmVyc2lcbiAgICB2YXIgbWV0aG9kQ2FsbCA9IGFzeW5jIGZ1bmN0aW9uIG1ldGhvZENhbGwgKG1lc3NhZ2UsIGdldFN0cmVhbSwgcHVibGljQXBpID0gdHJ1ZSwgdHJhbnNwb3J0ID0gJ1VOS05PVycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENPTlNPTEUubG9nKCc9PiBTRVJWRVIgSU4nLCB7bWVzc2FnZX0pXG4gICAgICAgIHZhbGlkYXRlTXNnKG1lc3NhZ2UpXG5cbiAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBtZXNzYWdlLm1ldGhvZFxuICAgICAgICB2YXIgbWV0YSA9IG1lc3NhZ2UubWV0YSB8fCB7fVxuICAgICAgICBtZXRhLmNvcnJpZCA9IG1ldGEuY29ycmlkIHx8IHV1aWRWNCgpXG4gICAgICAgIG1ldGEudXNlcmlkID0gbWV0YS51c2VyaWQgfHwgJ1VOS05PVydcbiAgICAgICAgbWV0YS5mcm9tID0gbWV0YS5mcm9tIHx8ICdVTktOT1cnXG4gICAgICAgIG1ldGEucmVxSW5UaW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgICAgIG1ldGEudHJhbnNwb3J0ID0gdHJhbnNwb3J0XG4gICAgICAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhIHx8IHt9XG5cbiAgICAgICAgdmFyIHNlcnZpY2VNZXRob2RzQ29uZmlnID0gYXdhaXQgZ2V0U2hhcmVkQ29uZmlnKHNlcnZpY2VOYW1lLCAnbWV0aG9kcycpXG4gICAgICAgIHZhciBtZXRob2RzID0gZ2V0TWV0aG9kcygpXG4gICAgICAgIGlmICghc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV0pIHRocm93IG5ldyBFcnJvcihtZXRob2ROYW1lICsgJyBpcyBub3QgdmFsaWQgKG5vdCBkZWZpbmVkIGluIG1ldGhvZHMgY29uZmlnKScpXG4gICAgICAgIGlmICghc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV0ucHVibGljICYmIHB1YmxpY0FwaSkgdGhyb3cgbmV3IEVycm9yKG1ldGhvZE5hbWUgKyAnIGlzIG5vdCBwdWJsaWMnKVxuICAgICAgICBpZiAoIW1ldGhvZHNbbWV0aG9kTmFtZV0pIHRocm93IG5ldyBFcnJvcihtZXRob2ROYW1lICsgJyBpcyBub3QgdmFsaWQgKG5vdCBkZWZpbmVkIHNlcnZpY2UgbWV0aG9kcyBqcyBmaWxlKScpXG4gICAgICAgIHZhciBtZXRob2QgPSBtZXRob2RzW21ldGhvZE5hbWVdXG4gICAgICAgIHZhciBtZXRob2RDb25maWcgPSBzZXJ2aWNlTWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXVxuICAgICAgICBDT05TT0xFLmRlYnVnKCdtZXRob2RDYWxsJywge21lc3NhZ2UsIGdldFN0cmVhbSwgcHVibGljQXBpLCBzZXJ2aWNlTWV0aG9kc0NvbmZpZywgbWV0aG9kQ29uZmlnfSwgc2VydmljZU5hbWUpXG5cbiAgICAgICAgZGF0YSA9IHZhbGlkYXRlKG1ldGhvZENvbmZpZywgbWV0aG9kTmFtZSwgZGF0YSwgJ3JlcXVlc3RTY2hlbWEnKVxuXG4gICAgICAgIHZhciByZXNwb25zZVxuICAgICAgICAvLyBpZiBub1Jlc3BvbnNlIG5vdCBhd2FpdCByZXNwb25zZSBvbiB0aGUgY2xpZW50IHNpZGVcbiAgICAgICAgLy8gaWYgYWtub3dsZWdtZW50IGF3YWl0IHJlc3BvbnNlIG9uIHRoZSBjbGllbnQgc2lkZSBidXQgbm90IGF3YWl0IHJlc3BvbnNlIG9uIHRoZSBzZXJ2ZXIgc2lkZVxuICAgICAgICBpZiAobWV0aG9kQ29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ25vUmVzcG9uc2UnIHx8IG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGUgPT09ICdha25vd2xlZ21lbnQnKSB7XG4gICAgICAgICAgbWV0aG9kKGRhdGEsIG1ldGEsIGdldFN0cmVhbSB8fCBudWxsKVxuICAgICAgICAgIHJlc3BvbnNlID0gbnVsbFxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGUgPT09ICdyZXNwb25zZScpIHtcbiAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IG1ldGhvZChkYXRhLCBtZXRhLCBnZXRTdHJlYW0gfHwgbnVsbClcbiAgICAgICAgICByZXNwb25zZSA9IHZhbGlkYXRlKG1ldGhvZENvbmZpZywgbWV0aG9kTmFtZSwgcmVzcG9uc2UsICdyZXNwb25zZVNjaGVtYScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBtZXRob2QoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtIHx8IG51bGwpXG4gICAgICAgIH1cblxuICAgICAgICBDT05TT0xFLmxvZygnU0VSVkVSIE9VVCA9PiAnLCB7cmVzcG9uc2UsIHJlc3BvbnNlVHlwZTogbWV0aG9kQ29uZmlnLnJlc3BvbnNlVHlwZX0pXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ01BSU4gUkVTUE9OU0UgJyArIG1ldGhvZE5hbWUsIHJlc3BvbnNlKVxuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHttZXRob2ROYW1lfSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBkdXJpbmcgbWV0aG9kQ2FsbCcpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdGFydCAoKSB7XG4gICAgICAgIENPTlNPTEUubG9nKCdTVEFSVCBUUkFOU1BPUlRTIFNFUlZFUlMgJywge3RyYW5zcG9ydHM6IGNvbmZpZy50cmFuc3BvcnRzfSlcbiAgICAgICAgZm9yRWFjaFRyYW5zcG9ydCgodHJhbnNwb3J0KSA9PiB0cmFuc3BvcnQuc3RhcnQoKSlcbiAgICAgIH0sXG4gICAgICBzdG9wICgpIHtcbiAgICAgICAgQ09OU09MRS5sb2coJ1NUT1AgVFJBTlNQT1JUUyBTRVJWRVJTICcsIHt0cmFuc3BvcnRzOiBjb25maWcudHJhbnNwb3J0c30pXG4gICAgICAgIGZvckVhY2hUcmFuc3BvcnQoKHRyYW5zcG9ydCkgPT4gdHJhbnNwb3J0LnN0b3AoKSlcbiAgICAgIH0sXG4gICAgICByZXN0YXJ0ICgpIHtcbiAgICAgICAgQ09OU09MRS5sb2coJ1JFU1RBUlQgVFJBTlNQT1JUUyBTRVJWRVJTICcsIHt0cmFuc3BvcnRzOiBjb25maWcudHJhbnNwb3J0c30pXG4gICAgICAgIGZvckVhY2hUcmFuc3BvcnQoKHRyYW5zcG9ydCkgPT4gdHJhbnNwb3J0LnJlc3RhcnQoKSlcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ09OU09MRS5lcnJvcihlcnJvcilcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBnZXROZXRTZXJ2ZXJQYWNrYWdlJylcbiAgfVxufVxuIl19