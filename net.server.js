'use strict';

var R = require('ramda');
var uuidV4 = require('uuid/v4');
var ajv = require('ajv')({ allErrors: true });
var PACKAGE = 'net.server';
var checkRequired = require('./jesus').checkRequired;

module.exports = function getNetServerPackage(_ref) {
  var config = _ref.config,
      getConsole = _ref.getConsole,
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? "unknow" : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? "unknow" : _ref$serviceId,
      getMethods = _ref.getMethods,
      getSharedConfig = _ref.getSharedConfig;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  checkRequired({ config: config, getMethods: getMethods, getSharedConfig: getSharedConfig, getConsole: getConsole });
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
      var _this = this;

      var publicApi = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var multiResponse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var singleCall, from, methodName, callDataArray, serviceMethodsConfig, methods, method, methodConfig, response;
      return regeneratorRuntime.async(function methodCall$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;

              singleCall = function _callee(callData) {
                var corrid, userid, data, meta, response;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;

                        CONSOLE.debug('singleCall', callData);
                        corrid = callData.r || uuidV4();
                        userid = callData.u || "UNKNOW";
                        data = callData.d || {};
                        meta = { corrid: corrid, userid: userid, methodName: methodName, from: from, timestamp: Date.now() };

                        CONSOLE.debug('singleCall data ', { data: data, meta: meta, getStream: getStream, publicApi: publicApi });

                        validate(methodConfig, methodName, data, 'requestSchema');

                        if (!(methodConfig.responseType === 'response')) {
                          _context.next = 17;
                          break;
                        }

                        _context.next = 11;
                        return regeneratorRuntime.awrap(method(data, meta, getStream || null));

                      case 11:
                        response = _context.sent;

                        validate(methodConfig, methodName, response, 'responseSchema');
                        CONSOLE.debug('singleCall response ' + methodName, { response: response });
                        return _context.abrupt('return', response);

                      case 17:
                        method(data, meta, getStream || null);
                        return _context.abrupt('return', true);

                      case 19:
                        _context.next = 25;
                        break;

                      case 21:
                        _context.prev = 21;
                        _context.t0 = _context['catch'](0);

                        CONSOLE.error(_context.t0);
                        throw new Error('message error ' + methodName);

                      case 25:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, null, _this, [[0, 21]]);
              };

              from = message.f;
              methodName = message.m;
              callDataArray = message.d;
              _context2.next = 7;
              return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'methods'));

            case 7:
              serviceMethodsConfig = _context2.sent;
              methods = getMethods();

              CONSOLE.log('=> SERVER IN', { message: message });
              CONSOLE.debug('methodCall', { message: message, getStream: getStream, publicApi: publicApi, serviceMethodsConfig: serviceMethodsConfig }, serviceName, getSharedConfig);

              if (serviceMethodsConfig[methodName]) {
                _context2.next = 13;
                break;
              }

              throw new Error(methodName + ' is not valid (not defined in methods config)');

            case 13:
              if (!(!serviceMethodsConfig[methodName].public && publicApi)) {
                _context2.next = 15;
                break;
              }

              throw new Error(methodName + ' is not public');

            case 15:
              if (methods[methodName]) {
                _context2.next = 17;
                break;
              }

              throw new Error(methodName + ' is not valid (not defined service methods js file)');

            case 17:
              method = methods[methodName];
              methodConfig = serviceMethodsConfig[methodName];

              if (!(methodConfig.responseType === 'noResponse')) {
                _context2.next = 24;
                break;
              }

              // NORESPONSE CAN have multiple CALL PER MESSAGE
              callDataArray.map(singleCall);
              response = null;
              _context2.next = 40;
              break;

            case 24:
              if (!(methodConfig.responseType === 'aknowlegment')) {
                _context2.next = 30;
                break;
              }

              _context2.next = 27;
              return regeneratorRuntime.awrap(Promise.all(callDataArray.map(singleCall)));

            case 27:
              response = null;
              _context2.next = 40;
              break;

            case 30:
              if (!(methodConfig.responseType === 'response')) {
                _context2.next = 37;
                break;
              }

              _context2.next = 33;
              return regeneratorRuntime.awrap(Promise.all(callDataArray.map(singleCall)));

            case 33:
              response = _context2.sent;

              if (!multiResponse) response = response[0];
              _context2.next = 40;
              break;

            case 37:
              _context2.next = 39;
              return regeneratorRuntime.awrap(singleCall(callDataArray[0]));

            case 39:
              response = _context2.sent;

            case 40:

              CONSOLE.log('SERVER OUT => ', { response: response, responseType: methodConfig.responseType });
              CONSOLE.debug('MAIN RESPONSE ' + methodName, response);
              return _context2.abrupt('return', response);

            case 45:
              _context2.prev = 45;
              _context2.t0 = _context2['catch'](0);

              CONSOLE.error(_context2.t0, { methodName: methodName });
              throw new Error('Error during methodCall');

            case 49:
            case 'end':
              return _context2.stop();
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
    CONSOLE.error(error, { methodName: methodName });
    throw new Error('Error during getNetServerPackage');
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwidXVpZFY0IiwiYWp2IiwiYWxsRXJyb3JzIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0TmV0U2VydmVyUGFja2FnZSIsImNvbmZpZyIsImdldENvbnNvbGUiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsImdldE1ldGhvZHMiLCJnZXRTaGFyZWRDb25maWciLCJDT05TT0xFIiwidmFsaWRhdGUiLCJtZXRob2RDb25maWciLCJtZXRob2ROYW1lIiwiZGF0YSIsInNjaGVtYUZpZWxkIiwiZGVidWciLCJFcnJvciIsImNvbXBpbGUiLCJ2YWxpZCIsImVycm9yIiwiZXJyb3JzIiwiZ2V0VHJhbnMiLCJ0cmFuc3BvcnROYW1lIiwibWV0aG9kQ2FsbCIsInRyYW5zcG9ydHMiLCJmb3JFYWNoVHJhbnNwb3J0IiwiZnVuYyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwibWVyZ2UiLCJtZXNzYWdlIiwiZ2V0U3RyZWFtIiwicHVibGljQXBpIiwibXVsdGlSZXNwb25zZSIsInNpbmdsZUNhbGwiLCJjYWxsRGF0YSIsImNvcnJpZCIsInIiLCJ1c2VyaWQiLCJ1IiwiZCIsIm1ldGEiLCJmcm9tIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInJlc3BvbnNlVHlwZSIsIm1ldGhvZCIsInJlc3BvbnNlIiwiZiIsIm0iLCJjYWxsRGF0YUFycmF5Iiwic2VydmljZU1ldGhvZHNDb25maWciLCJtZXRob2RzIiwibG9nIiwicHVibGljIiwibWFwIiwiUHJvbWlzZSIsImFsbCIsInN0YXJ0IiwidHJhbnNwb3J0Iiwic3RvcCIsInJlc3RhcnQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFNQyxTQUFTRCxRQUFRLFNBQVIsQ0FBZjtBQUNBLElBQUlFLE1BQU1GLFFBQVEsS0FBUixFQUFlLEVBQUNHLFdB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bkQsZ0JBQVE4QyxHQUFSLENBQVksMkJBQVosRUFBd0MsRUFBQy9CLFlBQVdyQixPQUFPcUIsVUFBbkIsRUFBeEM7QUFDQUMseUJBQWlCLFVBQUNvQyxTQUFEO0FBQUEsaUJBQWVBLFVBQVVELEtBQVYsRUFBZjtBQUFBLFNBQWpCO0FBQ0QsT0FKSTtBQUtMRSxVQUxLLGtCQUtHO0FBQ05yRCxnQkFBUThDLEdBQVIsQ0FBWSwwQkFBWixFQUF1QyxFQUFDL0IsWUFBV3JCLE9BQU9xQixVQUFuQixFQUF2QztBQUNBQyx5QkFBaUIsVUFBQ29DLFNBQUQ7QUFBQSxpQkFBZUEsVUFBVUMsSUFBVixFQUFmO0FBQUEsU0FBakI7QUFDRCxPQVJJO0FBU0xDLGFBVEsscUJBU007QUFDVHRELGdCQUFROEMsR0FBUixDQUFZLDZCQUFaLEVBQTBDLEVBQUMvQixZQUFXckIsT0FBT3FCLFVBQW5CLEVBQTFDO0FBQ0FDLHlCQUFpQixVQUFDb0MsU0FBRDtBQUFBLGlCQUFlQSxVQUFVRSxPQUFWLEVBQWY7QUFBQSxTQUFqQjtBQUNEO0FBWkksS0FBUDtBQWNELEdBMUdELENBMEdFLE9BQU81QyxLQUFQLEVBQWM7QUFDZFYsWUFBUVUsS0FBUixDQUFjQSxLQUFkLEVBQXFCLEVBQUNQLHNCQUFELEVBQXJCO0FBQ0EsVUFBTSxJQUFJSSxLQUFKLENBQVUsa0NBQVYsQ0FBTjtBQUNEO0FBQ0YsQ0FqSEQiLCJmaWxlIjoibmV0LnNlcnZlci5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxudmFyIGFqdiA9IHJlcXVpcmUoJ2FqdicpKHthbGxFcnJvcnM6IHRydWV9KVxuY29uc3QgUEFDS0FHRSA9ICduZXQuc2VydmVyJ1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TmV0U2VydmVyUGFja2FnZSAoe2NvbmZpZywgZ2V0Q29uc29sZSwgc2VydmljZU5hbWU9XCJ1bmtub3dcIiwgc2VydmljZUlkPVwidW5rbm93XCIsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZ30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIGNoZWNrUmVxdWlyZWQoe2NvbmZpZywgZ2V0TWV0aG9kcywgZ2V0U2hhcmVkQ29uZmlnLGdldENvbnNvbGV9KVxuICB0cnkge1xuICAvLyB2YXIgZGVmYXVsdEV2ZW50TGlzdGVuID0gcmVxdWlyZSgnLi9kZWZhdWx0LmV2ZW50Lmxpc3Rlbi5qc29uJylcbiAgICB2YXIgdmFsaWRhdGUgPSAobWV0aG9kQ29uZmlnLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZCA9ICdyZXF1ZXN0U2NoZW1hJykgPT4ge1xuICAgICAgQ09OU09MRS5kZWJ1ZygndmFsaWRhdGUgJywge21ldGhvZENvbmZpZywgbWV0aG9kTmFtZSwgZGF0YSwgc2NoZW1hRmllbGQgfSlcbiAgICAgIGlmICghbWV0aG9kQ29uZmlnW3NjaGVtYUZpZWxkXSkgdGhyb3cgbmV3IEVycm9yKHNjaGVtYUZpZWxkICsgJyBub3QgZGVmaW5lZCBpbiBtZXRob2RzLmpzb24gJyArIG1ldGhvZE5hbWUpXG4gICAgICB2YXIgdmFsaWRhdGUgPSBhanYuY29tcGlsZShtZXRob2RDb25maWdbc2NoZW1hRmllbGRdKVxuICAgICAgdmFyIHZhbGlkID0gdmFsaWRhdGUoZGF0YSlcbiAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgQ09OU09MRS5lcnJvcigndmFsaWRhdGlvbiBlcnJvcnMgJywge2Vycm9yczogdmFsaWRhdGUuZXJyb3JzLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZH0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndmFsaWRhdGlvbiBlcnJvciAnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnN9KVxuICAgICAgfSBlbHNlIHJldHVybiBkYXRhXG4gICAgfVxuICAgIHZhciBnZXRUcmFucyA9ICh0cmFuc3BvcnROYW1lKSA9PiByZXF1aXJlKGAuL3RyYW5zcG9ydHMvJHt0cmFuc3BvcnROYW1lfS5zZXJ2ZXJgKSh7Z2V0U2hhcmVkQ29uZmlnLGdldENvbnNvbGUsIG1ldGhvZENhbGwsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIGNvbmZpZzogY29uZmlnLnRyYW5zcG9ydHNbdHJhbnNwb3J0TmFtZV19KVxuICAgIHZhciBmb3JFYWNoVHJhbnNwb3J0ID0gKGZ1bmMpID0+IE9iamVjdC5rZXlzKGNvbmZpZy50cmFuc3BvcnRzKS5mb3JFYWNoKCh0cmFuc3BvcnROYW1lKSA9PiBmdW5jKGdldFRyYW5zKHRyYW5zcG9ydE5hbWUpKSlcblxuICAgIGNvbmZpZyA9IFIubWVyZ2Uoe1xuICAgICAgdHJhbnNwb3J0czoge1xuICAgICAgICAnZ3JwYyc6IHtcbiAgICAgICAgICAndXJsJzogJ2xvY2FsaG9zdDo4MDgwJyxcbiAgICAgICAgICAncHVibGljJzogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgY29uZmlnKVxuICAgIENPTlNPTEUuZGVidWcoJ2NvbmZpZyAnLCBjb25maWcpXG4gICAgLy8gb2duaSBtZXRob2QgY2FsbCBwdcOyIGF2ZXJlIHBpw7kgZGF0aSBhbmNoZSBkYXVzZXJpZCBlIHJlcXVlc3RpZCBkaXZlcnNpXG4gICAgdmFyIG1ldGhvZENhbGwgPSBhc3luYyBmdW5jdGlvbiBtZXRob2RDYWxsIChtZXNzYWdlLCBnZXRTdHJlYW0sIHB1YmxpY0FwaSA9IHRydWUsIG11bHRpUmVzcG9uc2UgPSBmYWxzZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHNpbmdsZUNhbGwgPSBhc3luYyAoY2FsbERhdGEpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2luZ2xlQ2FsbCcsIGNhbGxEYXRhKVxuICAgICAgICAgICAgdmFyIGNvcnJpZCA9IGNhbGxEYXRhLnIgfHwgdXVpZFY0KClcbiAgICAgICAgICAgIHZhciB1c2VyaWQgPSBjYWxsRGF0YS51IHx8IFwiVU5LTk9XXCJcbiAgICAgICAgICAgIHZhciBkYXRhID0gY2FsbERhdGEuZCB8fCB7fVxuICAgICAgICAgICAgdmFyIG1ldGEgPSB7IGNvcnJpZCwgdXNlcmlkLCBtZXRob2ROYW1lLCBmcm9tLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfVxuICAgICAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2luZ2xlQ2FsbCBkYXRhICcgLCB7ZGF0YSwgbWV0YSxnZXRTdHJlYW0scHVibGljQXBpfSlcbiAgICAgICAgICAgIHZhciByZXNwb25zZVxuICAgICAgICAgICAgdmFsaWRhdGUobWV0aG9kQ29uZmlnLCBtZXRob2ROYW1lLCBkYXRhLCAncmVxdWVzdFNjaGVtYScpXG4gICAgICAgICAgICBpZiAobWV0aG9kQ29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3Jlc3BvbnNlJykge1xuICAgICAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IG1ldGhvZChkYXRhLCBtZXRhLCBnZXRTdHJlYW0gfHwgbnVsbClcbiAgICAgICAgICAgICAgdmFsaWRhdGUobWV0aG9kQ29uZmlnLCBtZXRob2ROYW1lLCByZXNwb25zZSwgJ3Jlc3BvbnNlU2NoZW1hJylcbiAgICAgICAgICAgICAgQ09OU09MRS5kZWJ1Zygnc2luZ2xlQ2FsbCByZXNwb25zZSAnICsgbWV0aG9kTmFtZSwge3Jlc3BvbnNlfSlcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBtZXRob2QoZGF0YSwgbWV0YSwgZ2V0U3RyZWFtIHx8IG51bGwpXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIENPTlNPTEUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21lc3NhZ2UgZXJyb3IgJyArIG1ldGhvZE5hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZyb20gPSBtZXNzYWdlLmZcbiAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBtZXNzYWdlLm1cbiAgICAgICAgdmFyIGNhbGxEYXRhQXJyYXkgPSBtZXNzYWdlLmRcblxuICAgICAgICB2YXIgc2VydmljZU1ldGhvZHNDb25maWcgPSBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdtZXRob2RzJylcbiAgICAgICAgdmFyIG1ldGhvZHMgPSBnZXRNZXRob2RzKClcbiAgICAgICAgQ09OU09MRS5sb2coJz0+IFNFUlZFUiBJTicsICB7bWVzc2FnZX0pXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ21ldGhvZENhbGwnLCB7bWVzc2FnZSwgZ2V0U3RyZWFtLCBwdWJsaWNBcGksIHNlcnZpY2VNZXRob2RzQ29uZmlnfSxzZXJ2aWNlTmFtZSxnZXRTaGFyZWRDb25maWcpXG5cbiAgICAgICAgaWYgKCFzZXJ2aWNlTWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXSkgdGhyb3cgbmV3IEVycm9yKG1ldGhvZE5hbWUgKyAnIGlzIG5vdCB2YWxpZCAobm90IGRlZmluZWQgaW4gbWV0aG9kcyBjb25maWcpJylcbiAgICAgICAgaWYgKCFzZXJ2aWNlTWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXS5wdWJsaWMgJiYgcHVibGljQXBpKSB0aHJvdyBuZXcgRXJyb3IobWV0aG9kTmFtZSArICcgaXMgbm90IHB1YmxpYycpXG4gICAgICAgIGlmICghbWV0aG9kc1ttZXRob2ROYW1lXSkgdGhyb3cgbmV3IEVycm9yKG1ldGhvZE5hbWUgKyAnIGlzIG5vdCB2YWxpZCAobm90IGRlZmluZWQgc2VydmljZSBtZXRob2RzIGpzIGZpbGUpJylcblxuICAgICAgICB2YXIgbWV0aG9kID0gbWV0aG9kc1ttZXRob2ROYW1lXVxuICAgICAgICB2YXIgbWV0aG9kQ29uZmlnID0gc2VydmljZU1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV1cblxuICAgICAgICB2YXIgcmVzcG9uc2VcbiAgICAgICAgaWYgKG1ldGhvZENvbmZpZy5yZXNwb25zZVR5cGUgPT09ICdub1Jlc3BvbnNlJykge1xuICAgICAgICAgIC8vIE5PUkVTUE9OU0UgQ0FOIGhhdmUgbXVsdGlwbGUgQ0FMTCBQRVIgTUVTU0FHRVxuICAgICAgICAgIGNhbGxEYXRhQXJyYXkubWFwKHNpbmdsZUNhbGwpXG4gICAgICAgICAgcmVzcG9uc2UgPSBudWxsXG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kQ29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ2Frbm93bGVnbWVudCcpIHtcbiAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChjYWxsRGF0YUFycmF5Lm1hcChzaW5nbGVDYWxsKSlcbiAgICAgICAgICByZXNwb25zZSA9IG51bGxcbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2RDb25maWcucmVzcG9uc2VUeXBlID09PSAncmVzcG9uc2UnKSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBQcm9taXNlLmFsbChjYWxsRGF0YUFycmF5Lm1hcChzaW5nbGVDYWxsKSlcbiAgICAgICAgICBpZighbXVsdGlSZXNwb25zZSlyZXNwb25zZT1yZXNwb25zZVswXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFNUUkVBTSBDQU4gaGF2ZSBPTkxZIG9uZSBDQUxMIFBFUiBNRVNTQUdFXG4gICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBzaW5nbGVDYWxsKGNhbGxEYXRhQXJyYXlbMF0pXG4gICAgICAgIH1cblxuICAgICAgICBDT05TT0xFLmxvZygnU0VSVkVSIE9VVCA9PiAnLCAge3Jlc3BvbnNlLHJlc3BvbnNlVHlwZTptZXRob2RDb25maWcucmVzcG9uc2VUeXBlfSlcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnTUFJTiBSRVNQT05TRSAnICsgbWV0aG9kTmFtZSwgcmVzcG9uc2UpXG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgQ09OU09MRS5lcnJvcihlcnJvciwge21ldGhvZE5hbWV9KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGR1cmluZyBtZXRob2RDYWxsJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0ICgpIHtcbiAgICAgICAgQ09OU09MRS5sb2coJ1NUQVJUIFRSQU5TUE9SVFMgU0VSVkVSUyAnLHt0cmFuc3BvcnRzOmNvbmZpZy50cmFuc3BvcnRzfSlcbiAgICAgICAgZm9yRWFjaFRyYW5zcG9ydCgodHJhbnNwb3J0KSA9PiB0cmFuc3BvcnQuc3RhcnQoKSlcbiAgICAgIH0sXG4gICAgICBzdG9wICgpIHtcbiAgICAgICAgQ09OU09MRS5sb2coJ1NUT1AgVFJBTlNQT1JUUyBTRVJWRVJTICcse3RyYW5zcG9ydHM6Y29uZmlnLnRyYW5zcG9ydHN9KVxuICAgICAgICBmb3JFYWNoVHJhbnNwb3J0KCh0cmFuc3BvcnQpID0+IHRyYW5zcG9ydC5zdG9wKCkpXG4gICAgICB9LFxuICAgICAgcmVzdGFydCAoKSB7XG4gICAgICAgIENPTlNPTEUubG9nKCdSRVNUQVJUIFRSQU5TUE9SVFMgU0VSVkVSUyAnLHt0cmFuc3BvcnRzOmNvbmZpZy50cmFuc3BvcnRzfSlcbiAgICAgICAgZm9yRWFjaFRyYW5zcG9ydCgodHJhbnNwb3J0KSA9PiB0cmFuc3BvcnQucmVzdGFydCgpKVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDT05TT0xFLmVycm9yKGVycm9yLCB7bWV0aG9kTmFtZX0pXG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBkdXJpbmcgZ2V0TmV0U2VydmVyUGFja2FnZScpXG4gIH1cbn1cbiJdfQ==