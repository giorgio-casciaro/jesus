'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var grpc = require('grpc');
var zlib = require('zlib');
var PACKAGE = 'net.server';
var checkRequired = require('./jesus').checkRequired;

// MESSAGE SERIALIZATION
var serializedDataByte = 0;
var serializeFunction = function serializeFunction(obj, dictionary) {
  return zlib.deflateSync(JSON.stringify(obj), { dictionary: dictionary });
};
var deserializeFunction = function deserializeFunction(obj, dictionary) {
  return JSON.parse(zlib.inflateSync(obj, { dictionary: dictionary }));
};
function serializeJson(obj) {
  var result = serializeFunction(obj);
  serializedDataByte += result.byteLength;
  return result;
}
function deserializeJson(buffer) {
  var result = deserializeFunction(buffer);
  return result;
}
var grpcService = {
  message: {
    path: 'message',
    requestStream: false,
    responseStream: false,
    requestSerialize: serializeJson,
    requestDeserialize: deserializeJson,
    responseSerialize: serializeJson,
    responseDeserialize: deserializeJson
  },
  messageMulti: {
    path: 'messageMulti',
    requestStream: false,
    responseStream: false,
    requestSerialize: serializeJson,
    requestDeserialize: deserializeJson,
    responseSerialize: serializeJson,
    responseDeserialize: deserializeJson
  }
};

module.exports = function getNetServerPackage(_ref) {
  var serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      netUrl = _ref.netUrl,
      getMethods = _ref.getMethods,
      getSharedConfig = _ref.getSharedConfig;

  var LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE);
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);
  var defaultListeners = {
    '_rpcCall': {
      'haveResponse': true
    }
    // '_messageMulti': {
    //   'haveResponse': false
    // }
  };

  function messageCall(requestData) {
    var event, eventsListenConfig, eventConfig, from, methodName, service, method, data, meta, response;
    return regeneratorRuntime.async(function messageCall$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            event = requestData.event;
            _context.t0 = Object;
            _context.t1 = {};
            _context.t2 = defaultListeners;
            _context.next = 6;
            return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'events.listen'));

          case 6:
            _context.t3 = _context.sent;
            eventsListenConfig = _context.t0.assign.call(_context.t0, _context.t1, _context.t2, _context.t3);
            _context.t4 = LOG;
            _context.t5 = serviceName;
            _context.next = 12;
            return regeneratorRuntime.awrap(getSharedConfig(serviceName, 'events.listen'));

          case 12:
            _context.t6 = _context.sent;
            _context.t7 = eventsListenConfig;
            _context.t8 = {
              serviceName: _context.t5,
              getSharedConfig: _context.t6,
              eventsListenConfig: _context.t7
            };

            _context.t4.debug.call(_context.t4, 'eventsListenConfig', _context.t8);

            if (!(!eventsListenConfig[event] && !eventsListenConfig['*'])) {
              _context.next = 18;
              break;
            }

            return _context.abrupt('return', LOG.warn(netUrl, event + ' event not defined in /events.listen.json'));

          case 18:
            eventConfig = eventsListenConfig[event] || eventsListenConfig['*'];
            from = requestData.serviceName;
            methodName = requestData.method;
            service = getMethods();

            if (service[methodName]) {
              _context.next = 24;
              break;
            }

            throw methodName + ' is not valid';

          case 24:
            method = service[methodName];
            data = requestData.data;
            meta = {
              type: 'netEvent',
              from: from,
              requestId: requestData.requestId || uuidV4(),
              userId: requestData.userId,
              methodName: methodName,
              event: event,
              timestamp: Date.now()
            };

            LOG.debug('message received ' + methodName + ' requestId:' + meta.requestId, { eventConfig: eventConfig });

            if (!eventConfig.haveResponse) {
              _context.next = 43;
              break;
            }

            _context.prev = 29;
            _context.next = 32;
            return regeneratorRuntime.awrap(method(data, meta));

          case 32:
            response = _context.sent;

            LOG.debug('message response ' + methodName, { response: response });
            return _context.abrupt('return', response);

          case 37:
            _context.prev = 37;
            _context.t9 = _context['catch'](29);

            LOG.warn('message error ' + methodName, { error: _context.t9 });
            return _context.abrupt('return', _context.t9);

          case 41:
            _context.next = 46;
            break;

          case 43:
            LOG.debug('message aknowlegment ' + methodName);
            method(data, meta);
            return _context.abrupt('return', { aknowlegment: true });

          case 46:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this, [[29, 37]]);
  }
  try {
    var serviceServer;

    var _ret = function () {
      var start = function _callee() {
        var grpcServiceFunctions;
        return regeneratorRuntime.async(function _callee$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                grpcServiceFunctions = {
                  message: function message(call, callback) {
                    var response;
                    return regeneratorRuntime.async(function message$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return regeneratorRuntime.awrap(messageCall(call.request));

                          case 3:
                            response = _context2.sent;

                            LOG.debug('message response', { request: call.request, response: response });
                            callback(null, response);
                            _context2.next = 12;
                            break;

                          case 8:
                            _context2.prev = 8;
                            _context2.t0 = _context2['catch'](0);

                            LOG.error('message error', _context2.t0);
                            callback(_context2.t0, null);

                          case 12:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, null, this, [[0, 8]]);
                  },
                  messageMulti: function messageMulti(call, callback) {
                    return regeneratorRuntime.async(function messageMulti$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            callback(null, null);
                            LOG.debug('messageMulti ', call.request);
                            // var promises = []
                            // call.request.data.messages.forEach(({data, meta}) => {
                            //   var reqData = Object.assign({}, call.request, {data, meta})
                            //   promises.push(messageCall(reqData, callback))
                            // })
                            // return await Promise.all(promises)

                          case 2:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, null, this);
                  }
                };

                serviceServer = new grpc.Server();
                serviceServer.addService(grpcService, grpcServiceFunctions);
                serviceServer.bind(netUrl, grpc.ServerCredentials.createInsecure());
                serviceServer.start();
                LOG.debug('Net started on port:' + netUrl);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, null, this);
      };

      checkRequired({ serviceName: serviceName, serviceId: serviceId, netUrl: netUrl, getMethods: getMethods, getSharedConfig: getSharedConfig });

      return {
        v: {
          getSerializedDataByte: function getSerializedDataByte() {
            return serializedDataByte;
          },
          resetSerializedDataByte: function resetSerializedDataByte() {
            serializedDataByte = 0;
          },
          setSerializeFunction: function setSerializeFunction(newFunc) {
            serializeFunction = newFunc;
          },
          setDeserializeFunction: function setDeserializeFunction(newFunc) {
            deserializeFunction = newFunc;
          },

          start: start,
          stop: function stop() {
            serviceServer.tryShutdown(function () {});
          },
          restart: function restart() {
            serviceServer.tryShutdown(start);
          }
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    errorThrow('getNetServerPackage', { error: error, netUrl: netUrl, getSharedConfig: getSharedConfig });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5zZXJ2ZXIuZXM2Il0sIm5hbWVzIjpbImdycGMiLCJyZXF1aXJlIiwiemxpYiIsIlBBQ0tBR0UiLCJjaGVja1JlcXVpcmVkIiwic2VyaWFsaXplZERhdGFCeXRlIiwic2VyaWFsaXplRnVuY3Rpb24iLCJvYmoiLCJkaWN0aW9uYXJ5IiwiZGVmbGF0ZVN5bmMiLCJKU09OIiwic3RyaW5naWZ5IiwiZGVzZXJpYWxpemVGdW5jdGlvbiIsInBhcnNlIiwiaW5mbGF0ZVN5bmMiLCJzZXJpYWxpemVKc29uIiwicmVzdWx0IiwiYnl0ZUxlbmd0aCIsImRlc2VyaWFsaXplSnNvbiIsImJ1ZmZlciIsImdycGNTZXJ2aWNlIiwibWVzc2FnZSIsInBhdGgiLCJyZXF1ZXN0U3RyZWFtIiwicmVzcG9uc2VTdHJlYW0iLCJyZXF1ZXN0U2VyaWFsaXplIiwicmVxdWVzdERlc2VyaWFsaXplIiwicmVzcG9uc2VTZXJpYWxpemUiLCJyZXNwb25zZURlc2VyaWFsaXplIiwibWVzc2FnZU11bHRpIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldE5ldFNlcnZlclBhY2thZ2UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsIm5ldFVybCIsImdldE1ldGhvZHMiLCJnZXRTaGFyZWRDb25maWciLCJMT0ciLCJlcnJvclRocm93IiwiZGVmYXVsdExpc3RlbmVycyIsIm1lc3NhZ2VDYWxsIiwicmVxdWVzdERhdGEiLCJldmVudCIsIk9iamVjdCIsImV2ZW50c0xpc3RlbkNvbmZpZyIsImFzc2lnbiIsImRlYnVnIiwid2FybiIsImV2ZW50Q29uZmlnIiwiZnJvbSIsIm1ldGhvZE5hbWUiLCJtZXRob2QiLCJzZXJ2aWNlIiwiZGF0YSIsIm1ldGEiLCJ0eXBlIiwicmVxdWVzdElkIiwidXVpZFY0IiwidXNlcklkIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsImhhdmVSZXNwb25zZSIsInJlc3BvbnNlIiwiZXJyb3IiLCJha25vd2xlZ21lbnQiLCJzZXJ2aWNlU2VydmVyIiwic3RhcnQiLCJncnBjU2VydmljZUZ1bmN0aW9ucyIsImNhbGwiLCJjYWxsYmFjayIsInJlcXVlc3QiLCJTZXJ2ZXIiLCJhZGRTZXJ2aWNlIiwiYmluZCIsIlNlcnZlckNyZWRlbnRpYWxzIiwiY3JlYXRlSW5zZWN1cmUiLCJnZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJyZXNldFNlcmlhbGl6ZWREYXRhQnl0ZSIsInNldFNlcmlhbGl6ZUZ1bmN0aW9uIiwibmV3RnVuYyIsInNldERlc2VyaWFsaXplRnVuY3Rpb24iLCJzdG9wIiwidHJ5U2h1dGRvd24iLCJyZXN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQU1FLFVBQVUsWUFBaEI7QUFDQSxJQUFNQyxnQkFBZ0JILFFBQVEsU0FBUixFQUFtQkcsYUFBekM7O0FBRUE7QUFDQSxJQUFJQyxxQkFBcUIsQ0FBekI7QUFDQSxJQUFJQyxvQkFBb0IsMkJBQUNDLEdBQUQsRUFBTUMsVUFBTjtBQUFBLFNBQXFCTixLQUFLTyxXQUFMLENBQWlCQyxLQUFLQyxTQUFMLENBQWVKLEdBQWYsQ0FBakIsRUFBc0MsRUFBQ0Msc0JBQUQsRUFBdEMsQ0FBckI7QUFBQSxDQUF4QjtBQUNBLElBQUlJLHNCQUFzQiw2QkFBQ0wsR0FBRCxFQUFNQyxVQUFOO0FBQUEsU0FBcUJFLEtBQUtHLEtBQUwsQ0FBV1gsS0FBS1ksV0FBTCxDQUFpQlAsR0FBakIsRUFBc0IsRUFBQ0Msc0JBQUQsRUFBdEIsQ0FBWCxDQUFyQjtBQUFBLENBQTFCO0FBQ0EsU0FBU08sYUFBVCxDQUF3QlIsR0FBeEIsRUFBNkI7QUFDM0IsTUFBSVMsU0FBU1Ysa0JBQWtCQyxHQUFsQixDQUFiO0FBQ0FGLHdCQUF1QlcsT0FBT0MsVUFBOUI7QUFDQSxTQUFPRCxNQUFQO0FBQ0Q7QUFDRCxTQUFTRSxlQUFULENBQTBCQyxNQUExQixFQUFrQztBQUNoQyxNQUFJSCxTQUFTSixvQkFBb0JPLE1BQXBCLENB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c0JxRSxPQUF0QjtBQUNELFdBWkk7O0FBYUxiLHNCQWJLO0FBY0xlLGNBZEssa0JBY0c7QUFDTmhCLDBCQUFjaUIsV0FBZCxDQUEwQixZQUFNLENBQUUsQ0FBbEM7QUFDRCxXQWhCSTtBQWlCTEMsaUJBakJLLHFCQWlCTTtBQUNUbEIsMEJBQWNpQixXQUFkLENBQTBCaEIsS0FBMUI7QUFDRDtBQW5CSTtBQUFQO0FBaENFOztBQUFBO0FBcURILEdBckRELENBcURFLE9BQU9ILEtBQVAsRUFBYztBQUNkMUIsZUFBVyxxQkFBWCxFQUFrQyxFQUFDMEIsWUFBRCxFQUFROUIsY0FBUixFQUFnQkUsZ0NBQWhCLEVBQWxDO0FBQ0Q7QUFDRixDQTFHRCIsImZpbGUiOiJuZXQuc2VydmVyLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBncnBjID0gcmVxdWlyZSgnZ3JwYycpXG52YXIgemxpYiA9IHJlcXVpcmUoJ3psaWInKVxuY29uc3QgUEFDS0FHRSA9ICduZXQuc2VydmVyJ1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5cbi8vIE1FU1NBR0UgU0VSSUFMSVpBVElPTlxudmFyIHNlcmlhbGl6ZWREYXRhQnl0ZSA9IDBcbnZhciBzZXJpYWxpemVGdW5jdGlvbiA9IChvYmosIGRpY3Rpb25hcnkpID0+IHpsaWIuZGVmbGF0ZVN5bmMoSlNPTi5zdHJpbmdpZnkob2JqKSwge2RpY3Rpb25hcnl9KVxudmFyIGRlc2VyaWFsaXplRnVuY3Rpb24gPSAob2JqLCBkaWN0aW9uYXJ5KSA9PiBKU09OLnBhcnNlKHpsaWIuaW5mbGF0ZVN5bmMob2JqLCB7ZGljdGlvbmFyeX0pKVxuZnVuY3Rpb24gc2VyaWFsaXplSnNvbiAob2JqKSB7XG4gIHZhciByZXN1bHQgPSBzZXJpYWxpemVGdW5jdGlvbihvYmopXG4gIHNlcmlhbGl6ZWREYXRhQnl0ZSArPSAocmVzdWx0LmJ5dGVMZW5ndGgpXG4gIHJldHVybiByZXN1bHRcbn1cbmZ1bmN0aW9uIGRlc2VyaWFsaXplSnNvbiAoYnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBkZXNlcmlhbGl6ZUZ1bmN0aW9uKGJ1ZmZlcilcbiAgcmV0dXJuIHJlc3VsdFxufVxudmFyIGdycGNTZXJ2aWNlID0ge1xuICBtZXNzYWdlOiB7XG4gICAgcGF0aDogJ21lc3NhZ2UnLFxuICAgIHJlcXVlc3RTdHJlYW06IGZhbHNlLFxuICAgIHJlc3BvbnNlU3RyZWFtOiBmYWxzZSxcbiAgICByZXF1ZXN0U2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlcXVlc3REZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlU2VyaWFsaXplOiBzZXJpYWxpemVKc29uLFxuICAgIHJlc3BvbnNlRGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvblxuICB9LFxuICBtZXNzYWdlTXVsdGk6IHtcbiAgICBwYXRoOiAnbWVzc2FnZU11bHRpJyxcbiAgICByZXF1ZXN0U3RyZWFtOiBmYWxzZSxcbiAgICByZXNwb25zZVN0cmVhbTogZmFsc2UsXG4gICAgcmVxdWVzdFNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXF1ZXN0RGVzZXJpYWxpemU6IGRlc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZVNlcmlhbGl6ZTogc2VyaWFsaXplSnNvbixcbiAgICByZXNwb25zZURlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb25cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE5ldFNlcnZlclBhY2thZ2UgKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBuZXRVcmwsIGdldE1ldGhvZHMsIGdldFNoYXJlZENvbmZpZ30pIHtcbiAgdmFyIExPRyA9IHJlcXVpcmUoJy4vamVzdXMnKS5MT0coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB2YXIgZGVmYXVsdExpc3RlbmVycyA9IHtcbiAgICAnX3JwY0NhbGwnOiB7XG4gICAgICAnaGF2ZVJlc3BvbnNlJzogdHJ1ZVxuICAgIH1cbiAgICAvLyAnX21lc3NhZ2VNdWx0aSc6IHtcbiAgICAvLyAgICdoYXZlUmVzcG9uc2UnOiBmYWxzZVxuICAgIC8vIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIG1lc3NhZ2VDYWxsIChyZXF1ZXN0RGF0YSkge1xuICAgIHZhciBldmVudCA9IHJlcXVlc3REYXRhLmV2ZW50XG4gICAgdmFyIGV2ZW50c0xpc3RlbkNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRMaXN0ZW5lcnMsIGF3YWl0IGdldFNoYXJlZENvbmZpZyhzZXJ2aWNlTmFtZSwgJ2V2ZW50cy5saXN0ZW4nKSlcbiAgICBMT0cuZGVidWcoJ2V2ZW50c0xpc3RlbkNvbmZpZycsIHtzZXJ2aWNlTmFtZSwgZ2V0U2hhcmVkQ29uZmlnOiBhd2FpdCBnZXRTaGFyZWRDb25maWcoc2VydmljZU5hbWUsICdldmVudHMubGlzdGVuJyksIGV2ZW50c0xpc3RlbkNvbmZpZ30pXG4gICAgaWYgKCFldmVudHNMaXN0ZW5Db25maWdbZXZlbnRdICYmICFldmVudHNMaXN0ZW5Db25maWdbJyonXSkgcmV0dXJuIExPRy53YXJuKG5ldFVybCwgZXZlbnQgKyAnIGV2ZW50IG5vdCBkZWZpbmVkIGluIC9ldmVudHMubGlzdGVuLmpzb24nKVxuICAgIHZhciBldmVudENvbmZpZyA9IGV2ZW50c0xpc3RlbkNvbmZpZ1tldmVudF0gfHwgZXZlbnRzTGlzdGVuQ29uZmlnWycqJ11cblxuICAgIHZhciBmcm9tID0gcmVxdWVzdERhdGEuc2VydmljZU5hbWVcbiAgICB2YXIgbWV0aG9kTmFtZSA9IHJlcXVlc3REYXRhLm1ldGhvZFxuICAgIHZhciBzZXJ2aWNlID0gZ2V0TWV0aG9kcygpXG4gICAgaWYgKCFzZXJ2aWNlW21ldGhvZE5hbWVdKSB0aHJvdyBtZXRob2ROYW1lICsgJyBpcyBub3QgdmFsaWQnXG4gICAgdmFyIG1ldGhvZCA9IHNlcnZpY2VbbWV0aG9kTmFtZV1cbiAgICB2YXIgZGF0YSA9IHJlcXVlc3REYXRhLmRhdGFcbiAgICB2YXIgbWV0YSA9IHtcbiAgICAgIHR5cGU6ICduZXRFdmVudCcsXG4gICAgICBmcm9tLFxuICAgICAgcmVxdWVzdElkOiByZXF1ZXN0RGF0YS5yZXF1ZXN0SWQgfHwgdXVpZFY0KCksXG4gICAgICB1c2VySWQ6IHJlcXVlc3REYXRhLnVzZXJJZCxcbiAgICAgIG1ldGhvZE5hbWUsXG4gICAgICBldmVudCxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuICAgIH1cbiAgICBMT0cuZGVidWcoJ21lc3NhZ2UgcmVjZWl2ZWQgJyArIG1ldGhvZE5hbWUgKyAnIHJlcXVlc3RJZDonICsgbWV0YS5yZXF1ZXN0SWQsIHtldmVudENvbmZpZ30pXG4gICAgaWYgKGV2ZW50Q29uZmlnLmhhdmVSZXNwb25zZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbWV0aG9kKGRhdGEsIG1ldGEpXG4gICAgICAgIExPRy5kZWJ1ZygnbWVzc2FnZSByZXNwb25zZSAnICsgbWV0aG9kTmFtZSwge3Jlc3BvbnNlfSlcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBMT0cud2FybignbWVzc2FnZSBlcnJvciAnICsgbWV0aG9kTmFtZSwge2Vycm9yfSlcbiAgICAgICAgcmV0dXJuIGVycm9yXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIExPRy5kZWJ1ZygnbWVzc2FnZSBha25vd2xlZ21lbnQgJyArIG1ldGhvZE5hbWUpXG4gICAgICBtZXRob2QoZGF0YSwgbWV0YSlcbiAgICAgIHJldHVybiB7YWtub3dsZWdtZW50OiB0cnVlfVxuICAgIH1cbiAgfVxuICB0cnkge1xuICAgIHZhciBzZXJ2aWNlU2VydmVyXG4gICAgY2hlY2tSZXF1aXJlZCh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgbmV0VXJsLCBnZXRNZXRob2RzLCBnZXRTaGFyZWRDb25maWd9KVxuICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAgICAgIHZhciBncnBjU2VydmljZUZ1bmN0aW9ucyA9IHtcbiAgICAgICAgYXN5bmMgbWVzc2FnZSAoY2FsbCwgY2FsbGJhY2spIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgbWVzc2FnZUNhbGwoY2FsbC5yZXF1ZXN0KVxuICAgICAgICAgICAgTE9HLmRlYnVnKCdtZXNzYWdlIHJlc3BvbnNlJywge3JlcXVlc3Q6IGNhbGwucmVxdWVzdCwgcmVzcG9uc2V9KVxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExPRy5lcnJvcignbWVzc2FnZSBlcnJvcicsIGVycm9yKVxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhc3luYyBtZXNzYWdlTXVsdGkgKGNhbGwsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgbnVsbClcbiAgICAgICAgICBMT0cuZGVidWcoJ21lc3NhZ2VNdWx0aSAnLCBjYWxsLnJlcXVlc3QpXG4gICAgICAgICAgLy8gdmFyIHByb21pc2VzID0gW11cbiAgICAgICAgICAvLyBjYWxsLnJlcXVlc3QuZGF0YS5tZXNzYWdlcy5mb3JFYWNoKCh7ZGF0YSwgbWV0YX0pID0+IHtcbiAgICAgICAgICAvLyAgIHZhciByZXFEYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgY2FsbC5yZXF1ZXN0LCB7ZGF0YSwgbWV0YX0pXG4gICAgICAgICAgLy8gICBwcm9taXNlcy5wdXNoKG1lc3NhZ2VDYWxsKHJlcURhdGEsIGNhbGxiYWNrKSlcbiAgICAgICAgICAvLyB9KVxuICAgICAgICAgIC8vIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2VydmljZVNlcnZlciA9IG5ldyBncnBjLlNlcnZlcigpXG4gICAgICBzZXJ2aWNlU2VydmVyLmFkZFNlcnZpY2UoZ3JwY1NlcnZpY2UsIGdycGNTZXJ2aWNlRnVuY3Rpb25zKVxuICAgICAgc2VydmljZVNlcnZlci5iaW5kKG5ldFVybCwgZ3JwYy5TZXJ2ZXJDcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgICAgc2VydmljZVNlcnZlci5zdGFydCgpXG4gICAgICBMT0cuZGVidWcoJ05ldCBzdGFydGVkIG9uIHBvcnQ6JyArIG5ldFVybClcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNlcmlhbGl6ZWREYXRhQnl0ZSAoKSB7XG4gICAgICAgIHJldHVybiBzZXJpYWxpemVkRGF0YUJ5dGVcbiAgICAgIH0sXG4gICAgICByZXNldFNlcmlhbGl6ZWREYXRhQnl0ZSAoKSB7XG4gICAgICAgIHNlcmlhbGl6ZWREYXRhQnl0ZSA9IDBcbiAgICAgIH0sXG4gICAgICBzZXRTZXJpYWxpemVGdW5jdGlvbiAobmV3RnVuYykge1xuICAgICAgICBzZXJpYWxpemVGdW5jdGlvbiA9IG5ld0Z1bmNcbiAgICAgIH0sXG4gICAgICBzZXREZXNlcmlhbGl6ZUZ1bmN0aW9uIChuZXdGdW5jKSB7XG4gICAgICAgIGRlc2VyaWFsaXplRnVuY3Rpb24gPSBuZXdGdW5jXG4gICAgICB9LFxuICAgICAgc3RhcnQsXG4gICAgICBzdG9wICgpIHtcbiAgICAgICAgc2VydmljZVNlcnZlci50cnlTaHV0ZG93bigoKSA9PiB7fSlcbiAgICAgIH0sXG4gICAgICByZXN0YXJ0ICgpIHtcbiAgICAgICAgc2VydmljZVNlcnZlci50cnlTaHV0ZG93bihzdGFydClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JUaHJvdygnZ2V0TmV0U2VydmVyUGFja2FnZScsIHtlcnJvciwgbmV0VXJsLCBnZXRTaGFyZWRDb25maWd9KVxuICB9XG59XG4iXX0=