'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
var grpc = require('grpc');
var url = require('url');
var net = require('net');
var zlib = require('zlib');
var msgpack = require('msgpack');
// const avro = require('avsc');
var dictionary = new Buffer('"{}[]test', 'utf8');
var serializedDataByte = 0;
var serializeFunction = function serializeFunction(obj, dictionary) {
  return zlib.deflateSync(JSON.stringify(obj), { dictionary: dictionary });
};
var deserializeFunction = function deserializeFunction(obj, dictionary) {
  return JSON.parse(zlib.inflateSync(obj, { dictionary: dictionary }));
};
function serializeJson(obj) {
  // var testType = avro.infer(obj);
  // return testType.toBuffer(obj)
  // return zlib.deflateSync(msgpack.pack(obj),{level:1})
  // return msgpack.pack(obj)
  // return zlib.gzipSync(msgpack.pack(obj),{level:3})
  // var result = zlib.deflateSync(JSON.stringify(obj), {dictionary})
  var result = serializeFunction(obj, dictionary);
  serializedDataByte += result.byteLength;
  return result;
  // console.log(serializedDataByte)

  // return zlib.gzipSync(JSON.stringify(obj),{level:3})
  // return new Buffer(JSON.stringify(obj))
}
function deserializeJson(buffer) {
  var result = deserializeFunction(buffer, dictionary);
  return result;
  // var testType = avro.infer(buffer);
  // return testType.fromBuffer(buffer)
  // return msgpack.unpack(zlib.inflateSync(buffer))
  // return msgpack.unpack(buffer)
  // return msgpack.unpack(zlib.gunzipSync(buffer))
  // return JSON.parse(zlib.inflateSync(buffer, {dictionary}))
  // return JSON.parse(zlib.gunzipSync(buffer))
  // return JSON.parse(buffer.toString())
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
  }
};

module.exports = function getNetPackage(CONFIG, DI) {
  var _this = this;

  var clientCache, callServiceApi, serviceServer, netRegistry, _ret;

  return regeneratorRuntime.async(function getNetPackage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(function _callee() {
            var PACKAGE, getValuePromise, checkRequired;
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    PACKAGE = 'net';
                    getValuePromise = require('./jesus').getValuePromise;
                    checkRequired = require('./jesus').checkRequired;

                    CONFIG = checkRequired(CONFIG, ['url', 'netRegistry'], PACKAGE);
                    DI = checkRequired(DI, ['throwError', 'log', 'debug'], PACKAGE);

                    clientCache = {};

                    callServiceApi = function callServiceApi(_ref) {
                      var service = _ref.service,
                          eventListener = _ref.eventListener,
                          data = _ref.data;
                      return new Promise(function (resolve, reject) {
                        if (clientCache[service.url]) var client = clientCache[service.url];else {
                          var clientClass = grpc.makeGenericClientConstructor(grpcService);
                          var client = clientCache[service.url] = new clientClass(service.url, grpc.credentials.createInsecure());
                        }
                        var callTimeout = setTimeout(function () {
                          grpc.closeClient(client);
                          reject({ message: 'Response problems: REQUEST TIMEOUT: control proto file for correct response format', service: service, eventListener: eventListener, data: data });
                        }, eventListener.timeout || 5000);
                        // DI.log('NET MESSAGE SENDING', {route: eventListener.route, data})
                        client.message({ route: eventListener.route, data: data }, function (error, serviceResponse) {
                          clearTimeout(callTimeout);
                          if (error) reject(error);
                          resolve(serviceResponse);
                        });
                      });
                    };
                    // var serviceFunctions


                    _context2.next = 9;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.netRegistry));

                  case 9:
                    netRegistry = _context2.sent;
                    return _context2.abrupt('return', {
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
                        start: function start() {
                          var grpcServiceFunctions, url;
                          return regeneratorRuntime.async(function start$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  grpcServiceFunctions = {
                                    message: function message(call, callback) {
                                      // DI.log('NET MESSAGE RECEIVED', call.request)
                                      var routes = DI.getRoutes();
                                      var routeFunction = routes[call.request.route];
                                      var data = call.request.data;
                                      routeFunction(data).then(function (response) {
                                        return callback(null, response);
                                      }).catch(function (error) {
                                        return callback(null, error);
                                      });
                                    }
                                  };
                                  _context.next = 3;
                                  return regeneratorRuntime.awrap(getValuePromise(CONFIG.url));

                                case 3:
                                  url = _context.sent;

                                  serviceServer = new grpc.Server();
                                  serviceServer.addService(grpcService, grpcServiceFunctions);
                                  serviceServer.bind(url, grpc.ServerCredentials.createInsecure());
                                  serviceServer.start();

                                case 8:
                                case 'end':
                                  return _context.stop();
                              }
                            }
                          }, null, this);
                        },
                        stop: function stop() {
                          serviceServer.tryShutdown(function () {});
                        },
                        restart: function restart() {
                          serviceServer.tryShutdown(start);
                        },
                        emitEvent: function emitEvent(_ref2) {
                          var name = _ref2.name,
                              data = _ref2.data,
                              _ref2$singleResponse = _ref2.singleResponse,
                              singleResponse = _ref2$singleResponse === undefined ? true : _ref2$singleResponse;

                          if (netRegistry && netRegistry.listeners && netRegistry.listeners[name]) {
                            var waitResponses = [];
                            netRegistry.listeners[name].forEach(function (eventListener) {
                              var service = netRegistry.services[eventListener.service];
                              var callServiceApiPromise = callServiceApi({ service: service, eventListener: eventListener, data: data });
                              if (eventListener.haveResponse) waitResponses.push(callServiceApiPromise);
                            });
                            if (waitResponses.length) {
                              if (singleResponse) return waitResponses[0];else return Promise.all(waitResponses);
                            }
                          }
                        }
                      }
                    });

                  case 11:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, _this);
          }());

        case 3:
          _ret = _context3.sent;

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt('return', _ret.v);

        case 6:
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3['catch'](0);

          DI.throwError('getNetPackage(CONFIG, DI)', _context3.t0);

        case 11:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this, [[0, 8]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC5lczYiXSwibmFtZXMiOlsiUiIsInJlcXVpcmUiLCJncnBjIiwidXJsIiwibmV0IiwiemxpYiIsIm1zZ3BhY2siLCJkaWN0aW9uYXJ5IiwiQnVmZmVyIiwic2VyaWFsaXplZERhdGFCeXRlIiwic2VyaWFsaXplRnVuY3Rpb24iLCJvYmoiLCJkZWZsYXRlU3luYyIsIkpTT04iLCJzdHJpbmdpZnkiLCJkZXNlcmlhbGl6ZUZ1bmN0aW9uIiwicGFyc2UiLCJpbmZsYXRlU3luYyIsInNlcmlhbGl6ZUpzb24iLCJyZXN1bHQiLCJieXRlTGVuZ3RoIiwiZGVzZXJpYWxpemVKc29uIiwiYnVmZmVyIiwiZ3JwY1NlcnZpY2UiLCJtZXNzYWdlIiwicGF0aCIsInJlcXVlc3RTdHJlYW0iLCJyZXNwb25zZVN0cmVhbSIsInJlcXVlc3RTZXJpYWxpemUiLCJyZXF1ZXN0RGVzZXJpYWxpemUiLCJyZXNwb25zZVNlcmlhbGl6ZSIsInJlc3BvbnNlRGVzZXJpYWxpemUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0TmV0UGFja2FnZSIsIkNPTkZJRyIsIkRJIiwiUEFDS0FHRSIsImdldFZhbHVlUHJvbWlzZSIsImNoZWNrUmVxdWlyZWQiLCJjbGllbnRDYWNoZSIsImNhbGxTZXJ2aWNlQXBpIiwic2VydmljZSIsImV2ZW50TGlzdGVuZXIiLCJkYXRhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjbGllbnQiLCJjbGllbnRDbGFzcyIsIm1ha2VHZW5lcmljQ2xpZW50Q29uc3RydWN0b3IiLCJjcmVkZW50aWFscyIsImNyZWF0ZUluc2VjdXJlIiwiY2FsbFRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiY2xvc2VDbGllbnQiLCJ0aW1lb3V0Iiwicm91dGUiLCJlcnJvciIsInNlcnZpY2VSZXNwb25zZSIsImNsZWFyVGltZW91dCIsIm5ldFJlZ2lzdHJ5IiwiZ2V0U2VyaWFsaXplZERhdGFCeXRlIiwicmVzZXRTZXJpYWxpemVkRGF0YUJ5dGUiLCJzZXRTZXJpYWxpemVGdW5jdGlvbiIsIm5ld0Z1bmMiLCJzZXREZXNlcmlhbGl6ZUZ1bmN0aW9uIiwic3RhcnQiLCJncnBjU2VydmljZUZ1bmN0aW9ucyIsImNhbGwiLCJjYWxsYmFjayIsInJvdXRlcyIsImdldFJvdXRlcyIsInJvdXRlRnVuY3Rpb24iLCJyZXF1ZXN0IiwidGhlbiIsInJlc3BvbnNlIiwiY2F0Y2giLCJzZXJ2aWNlU2VydmVyIiwiU2VydmVyIiwiYWRkU2VydmljZSIsImJpbmQiLCJTZXJ2ZXJDcmVkZW50aWFscyIsInN0b3AiLCJ0cnlTaHV0ZG93biIsInJlc3RhcnQiLCJlbWl0RXZlbnQiLCJuYW1lIiwic2luZ2xlUmVzcG9uc2UiLCJsaXN0ZW5lcnMiLCJ3YWl0UmVzcG9uc2VzIiwiZm9yRWFjaCIsInNlcnZpY2VzIiwiY2FsbFNlcnZpY2VBcGlQcm9taXNlIiwiaGF2ZVJlc3BvbnNlIiwicHVzaCIsImxlbmd0aCIsImFsbCIsInRocm93RXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUUsTUFBTUYsUUFBUSxLQUFSLENBQVY7QUFDQSxJQUFJRyxNQUFNSCxRQUFRLEtBQVIsQ0FBVjtBQUNBLElBQUlJLE9BQU9KLFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUssVUFBVUwsUUFBUSxTQUFSLENBQWQ7QUFDQTtBQUNBLElBQUlNLGFBQWEsSUFBSUMsTUFBSixDQUFXLFdBQVgsRUFBd0IsTUFBeEIsQ0FBakI7QUFDQSxJQUFJQyxxQkFBcUIsQ0FBekI7QUFDQSxJQUFJQyxvQkFBb0IsMkJBQUNDLEdBQUQsRUFBTUosVUFBTjtBQUFBLFNBQXFCRixLQUFLTyxXQUFMLENBQWlCQyxLQUFLQyxTQUFMLENBQWVILEdBQWYsQ0FBakIsRUFBc0MsRUFBQ0osc0JBQUQsRUFBdEMsQ0FBckI7QUFBQSxDQUF4QjtBQUNBLElBQUlRLHNCQUFzQiw2QkFBQ0osR0FBRCxFQUFNSixVQUFOO0FBQUEs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QyxRQUFRb0QsR0FBUixDQUFZUCxhQUFaLENBQVA7QUFDTjtBQUNGO0FBQ0Y7QUFuREk7QUE5Qk07O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQW9GYnRELGFBQUc4RCxVQUFILENBQWMsMkJBQWQ7O0FBcEZhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6Im5ldC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBncnBjID0gcmVxdWlyZSgnZ3JwYycpXG52YXIgdXJsID0gcmVxdWlyZSgndXJsJylcbnZhciBuZXQgPSByZXF1aXJlKCduZXQnKVxudmFyIHpsaWIgPSByZXF1aXJlKCd6bGliJylcbnZhciBtc2dwYWNrID0gcmVxdWlyZSgnbXNncGFjaycpXG4vLyBjb25zdCBhdnJvID0gcmVxdWlyZSgnYXZzYycpO1xudmFyIGRpY3Rpb25hcnkgPSBuZXcgQnVmZmVyKCdcInt9W110ZXN0JywgJ3V0ZjgnKVxudmFyIHNlcmlhbGl6ZWREYXRhQnl0ZSA9IDBcbnZhciBzZXJpYWxpemVGdW5jdGlvbiA9IChvYmosIGRpY3Rpb25hcnkpID0+IHpsaWIuZGVmbGF0ZVN5bmMoSlNPTi5zdHJpbmdpZnkob2JqKSwge2RpY3Rpb25hcnl9KVxudmFyIGRlc2VyaWFsaXplRnVuY3Rpb24gPSAob2JqLCBkaWN0aW9uYXJ5KSA9PiBKU09OLnBhcnNlKHpsaWIuaW5mbGF0ZVN5bmMob2JqLCB7ZGljdGlvbmFyeX0pKVxuZnVuY3Rpb24gc2VyaWFsaXplSnNvbiAob2JqKSB7XG4gIC8vIHZhciB0ZXN0VHlwZSA9IGF2cm8uaW5mZXIob2JqKTtcbiAgLy8gcmV0dXJuIHRlc3RUeXBlLnRvQnVmZmVyKG9iailcbiAgLy8gcmV0dXJuIHpsaWIuZGVmbGF0ZVN5bmMobXNncGFjay5wYWNrKG9iaikse2xldmVsOjF9KVxuICAvLyByZXR1cm4gbXNncGFjay5wYWNrKG9iailcbiAgLy8gcmV0dXJuIHpsaWIuZ3ppcFN5bmMobXNncGFjay5wYWNrKG9iaikse2xldmVsOjN9KVxuICAvLyB2YXIgcmVzdWx0ID0gemxpYi5kZWZsYXRlU3luYyhKU09OLnN0cmluZ2lmeShvYmopLCB7ZGljdGlvbmFyeX0pXG4gIHZhciByZXN1bHQgPSBzZXJpYWxpemVGdW5jdGlvbihvYmosIGRpY3Rpb25hcnkpXG4gIHNlcmlhbGl6ZWREYXRhQnl0ZSArPSAocmVzdWx0LmJ5dGVMZW5ndGgpXG4gIHJldHVybiByZXN1bHRcbiAgLy8gY29uc29sZS5sb2coc2VyaWFsaXplZERhdGFCeXRlKVxuXG4gIC8vIHJldHVybiB6bGliLmd6aXBTeW5jKEpTT04uc3RyaW5naWZ5KG9iaikse2xldmVsOjN9KVxuICAvLyByZXR1cm4gbmV3IEJ1ZmZlcihKU09OLnN0cmluZ2lmeShvYmopKVxufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVKc29uIChidWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IGRlc2VyaWFsaXplRnVuY3Rpb24oYnVmZmVyLCBkaWN0aW9uYXJ5KVxuICByZXR1cm4gcmVzdWx0XG4gIC8vIHZhciB0ZXN0VHlwZSA9IGF2cm8uaW5mZXIoYnVmZmVyKTtcbiAgLy8gcmV0dXJuIHRlc3RUeXBlLmZyb21CdWZmZXIoYnVmZmVyKVxuICAvLyByZXR1cm4gbXNncGFjay51bnBhY2soemxpYi5pbmZsYXRlU3luYyhidWZmZXIpKVxuICAvLyByZXR1cm4gbXNncGFjay51bnBhY2soYnVmZmVyKVxuICAvLyByZXR1cm4gbXNncGFjay51bnBhY2soemxpYi5ndW56aXBTeW5jKGJ1ZmZlcikpXG4gIC8vIHJldHVybiBKU09OLnBhcnNlKHpsaWIuaW5mbGF0ZVN5bmMoYnVmZmVyLCB7ZGljdGlvbmFyeX0pKVxuICAvLyByZXR1cm4gSlNPTi5wYXJzZSh6bGliLmd1bnppcFN5bmMoYnVmZmVyKSlcbiAgLy8gcmV0dXJuIEpTT04ucGFyc2UoYnVmZmVyLnRvU3RyaW5nKCkpXG59XG52YXIgZ3JwY1NlcnZpY2UgPSB7XG4gIG1lc3NhZ2U6IHtcbiAgICBwYXRoOiAnbWVzc2FnZScsXG4gICAgcmVxdWVzdFN0cmVhbTogZmFsc2UsXG4gICAgcmVzcG9uc2VTdHJlYW06IGZhbHNlLFxuICAgIHJlcXVlc3RTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVxdWVzdERlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VTZXJpYWxpemU6IHNlcmlhbGl6ZUpzb24sXG4gICAgcmVzcG9uc2VEZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVKc29uXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBnZXROZXRQYWNrYWdlIChDT05GSUcsIERJKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgUEFDS0FHRSA9ICduZXQnXG4gICAgY29uc3QgZ2V0VmFsdWVQcm9taXNlID0gcmVxdWlyZSgnLi9qZXN1cycpLmdldFZhbHVlUHJvbWlzZVxuICAgIGNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuICAgIENPTkZJRyA9IGNoZWNrUmVxdWlyZWQoQ09ORklHLCBbJ3VybCcsICduZXRSZWdpc3RyeSddLCBQQUNLQUdFKVxuICAgIERJID0gY2hlY2tSZXF1aXJlZChESSwgWyAndGhyb3dFcnJvcicsICdsb2cnLCAnZGVidWcnXSwgUEFDS0FHRSlcblxuICAgIHZhciBjbGllbnRDYWNoZSA9IHt9XG4gICAgdmFyIGNhbGxTZXJ2aWNlQXBpID0gKHtzZXJ2aWNlLCBldmVudExpc3RlbmVyLCBkYXRhfSkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKGNsaWVudENhY2hlW3NlcnZpY2UudXJsXSkgdmFyIGNsaWVudCA9IGNsaWVudENhY2hlW3NlcnZpY2UudXJsXVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBjbGllbnRDbGFzcyA9IGdycGMubWFrZUdlbmVyaWNDbGllbnRDb25zdHJ1Y3RvcihncnBjU2VydmljZSlcbiAgICAgICAgdmFyIGNsaWVudCA9IGNsaWVudENhY2hlW3NlcnZpY2UudXJsXSA9IG5ldyBjbGllbnRDbGFzcyhzZXJ2aWNlLnVybCwgZ3JwYy5jcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgICAgfVxuICAgICAgdmFyIGNhbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGdycGMuY2xvc2VDbGllbnQoY2xpZW50KVxuICAgICAgICByZWplY3Qoe21lc3NhZ2U6ICdSZXNwb25zZSBwcm9ibGVtczogUkVRVUVTVCBUSU1FT1VUOiBjb250cm9sIHByb3RvIGZpbGUgZm9yIGNvcnJlY3QgcmVzcG9uc2UgZm9ybWF0Jywgc2VydmljZSwgZXZlbnRMaXN0ZW5lciwgZGF0YX0pXG4gICAgICB9LCBldmVudExpc3RlbmVyLnRpbWVvdXQgfHwgNTAwMClcbiAgICAgIC8vIERJLmxvZygnTkVUIE1FU1NBR0UgU0VORElORycsIHtyb3V0ZTogZXZlbnRMaXN0ZW5lci5yb3V0ZSwgZGF0YX0pXG4gICAgICBjbGllbnQubWVzc2FnZSh7cm91dGU6IGV2ZW50TGlzdGVuZXIucm91dGUsIGRhdGF9LCAoZXJyb3IsIHNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQoY2FsbFRpbWVvdXQpXG4gICAgICAgIGlmIChlcnJvcilyZWplY3QoZXJyb3IpXG4gICAgICAgIHJlc29sdmUoc2VydmljZVJlc3BvbnNlKVxuICAgICAgfSlcbiAgICB9KVxuICAgIC8vIHZhciBzZXJ2aWNlRnVuY3Rpb25zXG4gICAgdmFyIHNlcnZpY2VTZXJ2ZXJcbiAgICB2YXIgbmV0UmVnaXN0cnkgPSBhd2FpdCBnZXRWYWx1ZVByb21pc2UoQ09ORklHLm5ldFJlZ2lzdHJ5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNlcmlhbGl6ZWREYXRhQnl0ZSAoKSB7XG4gICAgICAgIHJldHVybiBzZXJpYWxpemVkRGF0YUJ5dGVcbiAgICAgIH0sXG4gICAgICByZXNldFNlcmlhbGl6ZWREYXRhQnl0ZSAoKSB7XG4gICAgICAgIHNlcmlhbGl6ZWREYXRhQnl0ZSA9IDBcbiAgICAgIH0sXG4gICAgICBzZXRTZXJpYWxpemVGdW5jdGlvbiAobmV3RnVuYykge1xuICAgICAgICBzZXJpYWxpemVGdW5jdGlvbiA9IG5ld0Z1bmNcbiAgICAgIH0sXG4gICAgICBzZXREZXNlcmlhbGl6ZUZ1bmN0aW9uIChuZXdGdW5jKSB7XG4gICAgICAgIGRlc2VyaWFsaXplRnVuY3Rpb24gPSBuZXdGdW5jXG4gICAgICB9LFxuICAgICAgYXN5bmMgc3RhcnQgKCkge1xuICAgICAgICB2YXIgZ3JwY1NlcnZpY2VGdW5jdGlvbnMgPSB7XG4gICAgICAgICAgbWVzc2FnZSAoY2FsbCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIERJLmxvZygnTkVUIE1FU1NBR0UgUkVDRUlWRUQnLCBjYWxsLnJlcXVlc3QpXG4gICAgICAgICAgICB2YXIgcm91dGVzID0gREkuZ2V0Um91dGVzKClcbiAgICAgICAgICAgIHZhciByb3V0ZUZ1bmN0aW9uID0gcm91dGVzW2NhbGwucmVxdWVzdC5yb3V0ZV1cbiAgICAgICAgICAgIHZhciBkYXRhID0gY2FsbC5yZXF1ZXN0LmRhdGFcbiAgICAgICAgICAgIHJvdXRlRnVuY3Rpb24oZGF0YSlcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBjYWxsYmFjayhudWxsLCBlcnJvcikpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVybCA9IGF3YWl0IGdldFZhbHVlUHJvbWlzZShDT05GSUcudXJsKVxuICAgICAgICBzZXJ2aWNlU2VydmVyID0gbmV3IGdycGMuU2VydmVyKClcbiAgICAgICAgc2VydmljZVNlcnZlci5hZGRTZXJ2aWNlKGdycGNTZXJ2aWNlLCBncnBjU2VydmljZUZ1bmN0aW9ucylcbiAgICAgICAgc2VydmljZVNlcnZlci5iaW5kKHVybCwgZ3JwYy5TZXJ2ZXJDcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuICAgICAgICBzZXJ2aWNlU2VydmVyLnN0YXJ0KClcbiAgICAgIH0sXG4gICAgICBzdG9wICgpIHtcbiAgICAgICAgc2VydmljZVNlcnZlci50cnlTaHV0ZG93bigoKSA9PiB7fSlcbiAgICAgIH0sXG4gICAgICByZXN0YXJ0ICgpIHtcbiAgICAgICAgc2VydmljZVNlcnZlci50cnlTaHV0ZG93bihzdGFydClcbiAgICAgIH0sXG4gICAgICBlbWl0RXZlbnQgKHtuYW1lLCBkYXRhLCBzaW5nbGVSZXNwb25zZSA9IHRydWV9KSB7XG4gICAgICAgIGlmIChuZXRSZWdpc3RyeSAmJiBuZXRSZWdpc3RyeS5saXN0ZW5lcnMgJiYgbmV0UmVnaXN0cnkubGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICAgICAgdmFyIHdhaXRSZXNwb25zZXMgPSBbXVxuICAgICAgICAgIG5ldFJlZ2lzdHJ5Lmxpc3RlbmVyc1tuYW1lXS5mb3JFYWNoKChldmVudExpc3RlbmVyKSA9PiB7XG4gICAgICAgICAgICB2YXIgc2VydmljZSA9IG5ldFJlZ2lzdHJ5LnNlcnZpY2VzW2V2ZW50TGlzdGVuZXIuc2VydmljZV1cbiAgICAgICAgICAgIHZhciBjYWxsU2VydmljZUFwaVByb21pc2UgPSBjYWxsU2VydmljZUFwaSh7c2VydmljZSwgZXZlbnRMaXN0ZW5lciwgZGF0YX0pXG4gICAgICAgICAgICBpZiAoZXZlbnRMaXN0ZW5lci5oYXZlUmVzcG9uc2Upd2FpdFJlc3BvbnNlcy5wdXNoKGNhbGxTZXJ2aWNlQXBpUHJvbWlzZSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICh3YWl0UmVzcG9uc2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHNpbmdsZVJlc3BvbnNlKSByZXR1cm4gd2FpdFJlc3BvbnNlc1swXVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gUHJvbWlzZS5hbGwod2FpdFJlc3BvbnNlcylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0TmV0UGFja2FnZShDT05GSUcsIERJKScsIGVycm9yKVxuICB9XG59XG4iXX0=