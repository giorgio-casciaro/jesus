'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var express = require('express');
var bodyParser = require('body-parser');

var helmet = require('helmet');
var protobuf = require('protobufjs'); // for validation
var R = require('ramda');
module.exports = function getGrpcApiPackage(CONFIG, DI) {
  try {
    var restApi;
    var restServer;

    var _ret = function () {
      var PACKAGE = 'api.rest';
      var getValuePromise = require('./jesus').getValuePromise;
      var checkRequired = require('./jesus').checkRequired;
      CONFIG = checkRequired(CONFIG, ['proto', 'restPort'], PACKAGE);
      DI = checkRequired(DI, ['getRoutes', 'throwError', 'log', 'debug'], PACKAGE);

      return {
        v: {
          start: function start() {
            var protoFile, restPort;
            return regeneratorRuntime.async(function start$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.proto));

                  case 2:
                    protoFile = _context.sent;
                    _context.next = 5;
                    return regeneratorRuntime.awrap(getValuePromise(CONFIG.restPort));

                  case 5:
                    restPort = _context.sent;

                    restApi = express();
                    restApi.use(bodyParser.json()); // support json encoded bodies
                    restApi.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

                    R.mapObjIndexed(function (routeFunction, routeName) {
                      var restBridge = function restBridge(req, res) {
                        var data = req.body || req.query;
                        routeFunction(data).then(function (response) {
                          return res.send(response);
                        }).catch(function (error) {
                          return res.send(error);
                        });
                      };
                      restApi.get('/' + routeName, restBridge);
                      restApi.post('/' + routeName, restBridge);
                    }, DI.getRoutes());
                    restServer = restApi.listen(restPort);

                  case 11:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this);
          },
          stop: function stop() {
            restServer.close();
          },
          restart: function restart() {
            restServer.close(start);
          }
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    DI.throwError('getGrpcApiPackage(CONFIG, DI)', error);
  }
};

// {

// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5yZXN0LmVzNiJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJoZWxtZXQiLCJwcm90b2J1ZiIsIlIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0R3JwY0FwaVBhY2thZ2UiLCJDT05GSUciLCJESSIsInJlc3RBcGkiLCJyZXN0U2VydmVyIiwiUEFDS0FHRSIsImdldFZhbHVlUHJvbWlzZSIsImNoZWNrUmVxdWlyZWQiLCJzdGFydCIsInByb3RvIiwicHJvdG9GaWxlIiwicmVzdFBvcnQiLCJ1c2UiLCJqc29uIiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwibWFwT2JqSW5kZXhlZCIsInJvdXRlRnVuY3Rpb24iLCJyb3V0ZU5hbWUiLCJyZXN0QnJpZGdlIiwicmVxIiwicmVzIiwiZGF0YSIsImJvZHkiLCJxdWVyeSIsInRoZW4iLCJzZW5kIiwicmVzcG9uc2UiLCJjYXRjaCIsImVycm9yIiwiZ2V0IiwicG9zdCIsImdldFJvdXRlcyIsImxpc3RlbiIsInN0b3AiLCJjbG9zZSIsInJlc3RhcnQiLCJ0aHJvd0Vycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsVUFBVUMsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFJQyxhQUFhRCxRQUFRLGFBQVIsQ0FBakI7O0FBRUEsSUFBSUUsU0FBU0YsUUFBUSxRQUFSLENBQWI7QUFDQSxJQUFJRyxXQUFXSCxRQUFRLFlBQVIsQ0FBZixDLENBQW9DO0FBQ3BDLElBQUlJLElBQUlKLFFBQVEsT0FBUixDQUFSO0FBQ0FLLE9BQU9DLE9BQVAsR0FBaUIsU0FBU0MsaUJBQVQsQ0FBNEJDLE1BQTVCLEVBQW9DQyxFQUFwQyxFQUF3QztBQUN2RCxNQUFJO0FBQUEsUUFPRUMsT0FQRjtBQUFBLFFBUUVDLFVBUkY7O0FBQUE7QUFDRixVQUFNQyxVQUFVLFVBQWhCO0FBQ0EsVUFBTUMsa0JBQWtCYixRQUFRLFNBQVIsRUFBbUJhLGVBQTNDO0FBQ0EsVUFBTUMsZ0JBQWdCZCxRQUFRLFNBQVIsRUFBbUJjLGFBQXpDO0FBQ0FOLGVBQVNNLGNBQWNOLE1BQWQsRUFBc0IsQ0FBQyxPQUFELEVBQVUsVUFBVixDQUF0QixFQUE2Q0ksT0FBN0MsQ0FBVDtBQUNBSCxXQUFLSyxjQUFjTCxFQUFkLEVBQWtCLENBQUUsV0FBRixFQUFlLFlBQWYsRUFBNkIsS0FBN0IsRUFBb0MsT0FBcEMsQ0FBbEIsRUFBZ0VHLE9BQWhFLENBQUw7O0FBS0E7QUFBQSxXQUFPO0FBQ0NHLGVBREQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvREFFbUJGLGdCQUFnQkwsT0FBT1EsS0FBdkIsQ0FGbkI7O0FBQUE7QUFFQ0MsNkJBRkQ7QUFBQTtBQUFBLG9EQUdrQkosZ0JBQWdCTCxPQUFPVSxRQUF2QixDQUhsQjs7QUFBQTtBQUdDQSw0QkFIRDs7QUFJSFIsOEJBQVVYLFNBQVY7QUFDQVcsNEJBQVFTLEdBQVIsQ0FBWWxCLFdBQVdtQixJQUFYLEVBQVosRUFMRyxDQUs2QjtBQUNoQ1YsNEJBQVFTLEdBQVIsQ0FBWWxCLFdBQVdvQixVQUFYLENBQXNCLEVBQUVDLFVBQVUsSUFBWixFQUF0QixDQUFaLEVBTkcsQ0FNcUQ7O0FBRXhEbEIsc0JBQUVtQixhQUFGLENBQWdCLFVBQUNDLGFBQUQsRUFBZ0JDLFNBQWhCLEVBQThCO0FBQzVDLDBCQUFJQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDN0IsNEJBQUlDLE9BQUtGLElBQUlHLElBQUosSUFBVUgsSUFBSUksS0FBdkI7QUFDQVAsc0NBQWNLLElBQWQsRUFDQ0csSUFERCxDQUNNO0FBQUEsaUNBQVlKLElBQUlLLElBQUosQ0FBU0MsUUFBVCxDQUFaO0FBQUEseUJBRE4sRUFFQ0MsS0FGRCxDQUVPO0FBQUEsaUNBQVNQLElBQUlLLElBQUosQ0FBU0csS0FBVCxDQUFUO0FBQUEseUJBRlA7QUFHRCx1QkFMRDtBQU1BMUIsOEJBQVEyQixHQUFSLENBQVksTUFBTVosU0FBbEIsRUFBNkJDLFVBQTdCO0FBQ0FoQiw4QkFBUTRCLElBQVIsQ0FBYSxNQUFNYixTQUFuQixFQUE4QkMsVUFBOUI7QUFDRCxxQkFURCxFQVNHakIsR0FBRzhCLFNBQUgsRUFUSDtBQVVBNUIsaUNBQWFELFFBQVE4QixNQUFSLENBQWV0QixRQUFmLENBQWI7O0FBbEJHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBb0JMdUIsY0FwQkssa0JBb0JHO0FBQ045Qix1QkFBVytCLEtBQVg7QUFDRCxXQXRCSTtBQXVCTEMsaUJBdkJLLHFCQXVCTTtBQUNUaEMsdUJBQVcrQixLQUFYLENBQWlCM0IsS0FBakI7QUFDRDtBQXpCSTtBQUFQO0FBVkU7O0FBQUE7QUFxQ0gsR0FyQ0QsQ0FxQ0UsT0FBT3FCLEtBQVAsRUFBYztBQUNkM0IsT0FBR21DLFVBQUgsQ0FBYywrQkFBZCxFQUErQ1IsS0FBL0M7QUFDRDtBQUNGLENBekNEOztBQTJDQTs7QUFFQSIsImZpbGUiOiJhcGkucmVzdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxudmFyIGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpO1xuXG52YXIgaGVsbWV0ID0gcmVxdWlyZSgnaGVsbWV0JylcbnZhciBwcm90b2J1ZiA9IHJlcXVpcmUoJ3Byb3RvYnVmanMnKS8vIGZvciB2YWxpZGF0aW9uXG52YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0R3JwY0FwaVBhY2thZ2UgKENPTkZJRywgREkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBQQUNLQUdFID0gJ2FwaS5yZXN0J1xuICAgIGNvbnN0IGdldFZhbHVlUHJvbWlzZSA9IHJlcXVpcmUoJy4vamVzdXMnKS5nZXRWYWx1ZVByb21pc2VcbiAgICBjb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbiAgICBDT05GSUcgPSBjaGVja1JlcXVpcmVkKENPTkZJRywgWydwcm90bycsICdyZXN0UG9ydCddLCBQQUNLQUdFKVxuICAgIERJID0gY2hlY2tSZXF1aXJlZChESSwgWyAnZ2V0Um91dGVzJywgJ3Rocm93RXJyb3InLCAnbG9nJywgJ2RlYnVnJ10sIFBBQ0tBR0UpXG5cbiAgICB2YXIgcmVzdEFwaVxuICAgIHZhciByZXN0U2VydmVyXG5cbiAgICByZXR1cm4ge1xuICAgICAgYXN5bmMgc3RhcnQgKCkge1xuICAgICAgICB2YXIgcHJvdG9GaWxlID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5wcm90bylcbiAgICAgICAgdmFyIHJlc3RQb3J0ID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5yZXN0UG9ydClcbiAgICAgICAgcmVzdEFwaSA9IGV4cHJlc3MoKVxuICAgICAgICByZXN0QXBpLnVzZShib2R5UGFyc2VyLmpzb24oKSk7IC8vIHN1cHBvcnQganNvbiBlbmNvZGVkIGJvZGllc1xuICAgICAgICByZXN0QXBpLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSk7IC8vIHN1cHBvcnQgZW5jb2RlZCBib2RpZXNcblxuICAgICAgICBSLm1hcE9iakluZGV4ZWQoKHJvdXRlRnVuY3Rpb24sIHJvdXRlTmFtZSkgPT4ge1xuICAgICAgICAgIHZhciByZXN0QnJpZGdlID0gKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgICAgICB2YXIgZGF0YT1yZXEuYm9keXx8cmVxLnF1ZXJ5XG4gICAgICAgICAgICByb3V0ZUZ1bmN0aW9uKGRhdGEpXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXMuc2VuZChyZXNwb25zZSkpXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gcmVzLnNlbmQoZXJyb3IpKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXN0QXBpLmdldCgnLycgKyByb3V0ZU5hbWUsIHJlc3RCcmlkZ2UpXG4gICAgICAgICAgcmVzdEFwaS5wb3N0KCcvJyArIHJvdXRlTmFtZSwgcmVzdEJyaWRnZSlcbiAgICAgICAgfSwgREkuZ2V0Um91dGVzKCkpXG4gICAgICAgIHJlc3RTZXJ2ZXIgPSByZXN0QXBpLmxpc3RlbihyZXN0UG9ydClcbiAgICAgIH0sXG4gICAgICBzdG9wICgpIHtcbiAgICAgICAgcmVzdFNlcnZlci5jbG9zZSgpXG4gICAgICB9LFxuICAgICAgcmVzdGFydCAoKSB7XG4gICAgICAgIHJlc3RTZXJ2ZXIuY2xvc2Uoc3RhcnQpXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIERJLnRocm93RXJyb3IoJ2dldEdycGNBcGlQYWNrYWdlKENPTkZJRywgREkpJywgZXJyb3IpXG4gIH1cbn1cblxuLy8ge1xuXG4vLyB9XG4iXX0=