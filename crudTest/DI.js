'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var path = require('path');
var fs = require('fs');
var R = require('ramda');
//
// var debugActive = true
// var debugSaveTimeout
// var debugFile
// var debugRegistry = []
//
// var DEBUG = function (type, debug, msg = 'unknow', context = 'unknow') {
//   if (!debugActive) return null
//   debugRegistry.push({
//     [`${type} ${context} > ${msg}`]: debug
//   })
//   if (debugSaveTimeout) clearTimeout(debugSaveTimeout)
//   debugSaveTimeout = setTimeout(function () {
//     fs.writeFile(debugFile, JSON.stringify(debugRegistry, null, 4), 'utf8')
//   }, 1000)
// }
//
// var LOG = function (type, log, msg = 'unknow', context = 'unknow') {
//   const ANSI_RESET = '\u001B[0m'
//   const ANSI_BLACK = '\u001B[30m'
//   const ANSI_BACKGROUND_CYAN = '\u001B[46m'
//   console.log(`${ANSI_BACKGROUND_CYAN + ANSI_BLACK}`)
//   console.log(`LOG --> ${type} ${context} > ${msg} ${ANSI_RESET}`)
//   DEBUG(type, log, msg, context)
// }
//
// var ERROR = function (error) {
//   const ANSI_RESET = '\u001B[0m'
//   const ANSI_RED = '\u001B[31m'
//   console.log(`${ANSI_RED} ORIGINAL ERROR ${ANSI_RESET}`)
//   console.log(error.originalError || error)
//   console.log(`APP ERROR --> ${error.info && error.info.message ? error.info.message : 'unknow'}`)
//   console.log(`${ANSI_RED} APP TRACE ${ANSI_RESET}`)
//   if (error.getAppTrace)console.log(JSON.stringify(error.getAppTrace(), null, 4))
//   // if (error.toString)console.log(JSON.stringify(error.toString(), null, 4))
//   LOG('ERROR', error, 'jesus-test', 'APP-ERROR')
// }

module.exports = function getDI(SERVICE, PACKAGE) {
  var _this = this,
      _ref10;

  return _ref10 = {
    authenticate: function authenticate(_ref) {
      var request = _ref.request;
      return regeneratorRuntime.async(function authenticate$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', require('./fakeAuth.json'));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, null, _this);
    },
    authorize: function authorize(_ref2) {
      var route = _ref2.route,
          request = _ref2.request;
      return regeneratorRuntime.async(function authorize$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', true);

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, _this);
    },
    // getEvents: (payload) => new Promise((resolve, reject) => {
    //   resolve(SERVICE.events)
    // }),
    // getConfig: (payload) => new Promise((resolve, reject) => {
    //   resolve(config)
    // }),
    registerRoute: function registerRoute(_ref3) {
      var route = _ref3.route,
          routeFunction = _ref3.routeFunction;
      return regeneratorRuntime.async(function registerRoute$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt('return', SERVICE.routes[route] = routeFunction);

            case 1:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, _this);
    },
    callRoute: function callRoute(_ref4) {
      var route = _ref4.route,
          request = _ref4.request;
      return regeneratorRuntime.async(function callRoute$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt('return', SERVICE.routes[route](request));

            case 1:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, _this);
    },
    deregisterRoute: function deregisterRoute(_ref5) {
      var route = _ref5.route;
      return regeneratorRuntime.async(function deregisterRoute$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt('return', SERVICE.routes[route](request));

            case 1:
            case 'end':
              return _context5.stop();
          }
        }
      }, null, _this);
    }
  }, _defineProperty(_ref10, 'deregisterRoute', function deregisterRoute(_ref6) {
    var route = _ref6.route;
    return regeneratorRuntime.async(function deregisterRoute$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt('return', delete SERVICE.routes[route]);

          case 1:
          case 'end':
            return _context6.stop();
        }
      }
    }, null, _this);
  }), _defineProperty(_ref10, 'registerEvent', function registerEvent(_ref7) {
    var name = _ref7.name,
        route = _ref7.route;
    return regeneratorRuntime.async(function registerEvent$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            SERVICE.events[name] = { name: name, route: route };

          case 1:
          case 'end':
            return _context7.stop();
        }
      }
    }, null, _this);
  }), _defineProperty(_ref10, 'deregisterEvent', function deregisterEvent(_ref8) {
    var name = _ref8.name;
    return regeneratorRuntime.async(function deregisterEvent$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt('return', delete SERVICE.events[event]);

          case 1:
          case 'end':
            return _context8.stop();
        }
      }
    }, null, _this);
  }), _defineProperty(_ref10, 'emitEvent', function emitEvent(_ref9) {
    var name = _ref9.name,
        payload = _ref9.payload;
    return regeneratorRuntime.async(function emitEvent$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
          case 'end':
            return _context9.stop();
        }
      }
    }, null, _this);
  }), _ref10;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRJLmVzNiJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImZzIiwiUiIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRESSIsIlNFUlZJQ0UiLCJQQUNLQUdFIiwiYXV0aGVudGljYXRlIiwicmVxdWVzdCIsImF1dGhvcml6ZSIsInJvdXRlIiwicmVnaXN0ZXJSb3V0ZSIsInJvdXRlRnVuY3Rpb24iLCJyb3V0ZXMiLCJjYWxsUm91dGUiLCJkZXJlZ2lzdGVyUm91dGUiLCJuYW1lIiwiZXZlbnRzIiwiZXZlbnQiLCJwYXlsb2FkIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxLQUFLRCxRQUFRLElBQVIsQ0FBVDtBQUNBLElBQUlFLElBQUlGLFFBQVEsT0FBUixDQUFSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFHLE9BQU9DLE9BQVAsR0FBaUIsU0FBU0MsS0FBVCxDQUFnQkMsT0FBaEIsRUFBeUJDLE9BQXpCLEVBQWtDO0FBQUE7QUFBQTs7QUFDakQ7QUFDRUMsa0JBQWM7QUFBQSxVQUFPQyxPQUFQLFFBQU9BLE9BQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLCtDQUFvQlQsUUFBUSxpQkFBUixDQUFwQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQURoQjtBQUVFVSxlQUFXO0FBQUEsVUFBT0MsS0FBUCxTQUFPQSxLQUFQO0FBQUEsVUFBY0YsT0FBZCxTQUFjQSxPQUFkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxnREFBMkIsSUFBM0I7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FGYjtBQUdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBRyxtQkFBZTtBQUFBLFVBQU9ELEtBQVAsU0FBT0EsS0FBUDtBQUFBLFVBQWNFLGFBQWQsU0FBY0EsYUFBZDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0RBQWlDUCxRQUFRUSxNQUFSLENBQWVILEtBQWYsSUFBd0JFLGFBQXpEOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBVGpCO0FBVUVFLGVBQVc7QUFBQSxVQUFPSixLQUFQLFNBQU9BLEtBQVA7QUFBQSxVQUFjRixPQUFkLFNBQWNBLE9BQWQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdEQUEyQkgsUUFBUVEsTUFBUixDQUFlSCxLQUFmLEVBQXNCRixPQUF0QixDQUEzQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQVZiO0FBV0VPLHFCQUFpQjtBQUFBLFVBQU9MLEtBQVAsU0FBT0EsS0FBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0RBQWtCTCxRQUFRUSxNQUFSLENBQWVILEtBQWYsRUFBc0JGLE9BQXRCLENBQWxCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWG5CLGdEQVltQjtBQUFBLFFBQU9FLEtBQVAsU0FBT0EsS0FBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOENBQWtCLE9BQU9MLFFBQVFRLE1BQVIsQ0FBZUgsS0FBZixDQUF6Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQVpuQiw0Q0FhaUI7QUFBQSxRQUFPTSxJQUFQLFNBQU9BLElBQVA7QUFBQSxRQUFhTixLQUFiLFNBQWFBLEtBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNiTCxvQkFBUVksTUFBUixDQUFlRCxJQUFmLElBQXVCLEVBQUNBLFVBQUQsRUFBT04sWUFBUCxFQUF2Qjs7QUFEYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQWJqQiw4Q0FnQm1CO0FBQUEsUUFBT00sSUFBUCxTQUFPQSxJQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FBaUIsT0FBT1gsUUFBUVksTUFBUixDQUFlQyxLQUFmLENBQXhCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBaEJuQix3Q0FpQmE7QUFBQSxRQUFPRixJQUFQLFNBQU9BLElBQVA7QUFBQSxRQUFhRyxPQUFiLFNBQWFBLE9BQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQWpCYjtBQW1CRCxDQXBCRCIsImZpbGUiOiJESS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxudmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG4vL1xuLy8gdmFyIGRlYnVnQWN0aXZlID0gdHJ1ZVxuLy8gdmFyIGRlYnVnU2F2ZVRpbWVvdXRcbi8vIHZhciBkZWJ1Z0ZpbGVcbi8vIHZhciBkZWJ1Z1JlZ2lzdHJ5ID0gW11cbi8vXG4vLyB2YXIgREVCVUcgPSBmdW5jdGlvbiAodHlwZSwgZGVidWcsIG1zZyA9ICd1bmtub3cnLCBjb250ZXh0ID0gJ3Vua25vdycpIHtcbi8vICAgaWYgKCFkZWJ1Z0FjdGl2ZSkgcmV0dXJuIG51bGxcbi8vICAgZGVidWdSZWdpc3RyeS5wdXNoKHtcbi8vICAgICBbYCR7dHlwZX0gJHtjb250ZXh0fSA+ICR7bXNnfWBdOiBkZWJ1Z1xuLy8gICB9KVxuLy8gICBpZiAoZGVidWdTYXZlVGltZW91dCkgY2xlYXJUaW1lb3V0KGRlYnVnU2F2ZVRpbWVvdXQpXG4vLyAgIGRlYnVnU2F2ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbi8vICAgICBmcy53cml0ZUZpbGUoZGVidWdGaWxlLCBKU09OLnN0cmluZ2lmeShkZWJ1Z1JlZ2lzdHJ5LCBudWxsLCA0KSwgJ3V0ZjgnKVxuLy8gICB9LCAxMDAwKVxuLy8gfVxuLy9cbi8vIHZhciBMT0cgPSBmdW5jdGlvbiAodHlwZSwgbG9nLCBtc2cgPSAndW5rbm93JywgY29udGV4dCA9ICd1bmtub3cnKSB7XG4vLyAgIGNvbnN0IEFOU0lfUkVTRVQgPSAnXFx1MDAxQlswbSdcbi8vICAgY29uc3QgQU5TSV9CTEFDSyA9ICdcXHUwMDFCWzMwbSdcbi8vICAgY29uc3QgQU5TSV9CQUNLR1JPVU5EX0NZQU4gPSAnXFx1MDAxQls0Nm0nXG4vLyAgIGNvbnNvbGUubG9nKGAke0FOU0lfQkFDS0dST1VORF9DWUFOICsgQU5TSV9CTEFDS31gKVxuLy8gICBjb25zb2xlLmxvZyhgTE9HIC0tPiAke3R5cGV9ICR7Y29udGV4dH0gPiAke21zZ30gJHtBTlNJX1JFU0VUfWApXG4vLyAgIERFQlVHKHR5cGUsIGxvZywgbXNnLCBjb250ZXh0KVxuLy8gfVxuLy9cbi8vIHZhciBFUlJPUiA9IGZ1bmN0aW9uIChlcnJvcikge1xuLy8gICBjb25zdCBBTlNJX1JFU0VUID0gJ1xcdTAwMUJbMG0nXG4vLyAgIGNvbnN0IEFOU0lfUkVEID0gJ1xcdTAwMUJbMzFtJ1xuLy8gICBjb25zb2xlLmxvZyhgJHtBTlNJX1JFRH0gT1JJR0lOQUwgRVJST1IgJHtBTlNJX1JFU0VUfWApXG4vLyAgIGNvbnNvbGUubG9nKGVycm9yLm9yaWdpbmFsRXJyb3IgfHwgZXJyb3IpXG4vLyAgIGNvbnNvbGUubG9nKGBBUFAgRVJST1IgLS0+ICR7ZXJyb3IuaW5mbyAmJiBlcnJvci5pbmZvLm1lc3NhZ2UgPyBlcnJvci5pbmZvLm1lc3NhZ2UgOiAndW5rbm93J31gKVxuLy8gICBjb25zb2xlLmxvZyhgJHtBTlNJX1JFRH0gQVBQIFRSQUNFICR7QU5TSV9SRVNFVH1gKVxuLy8gICBpZiAoZXJyb3IuZ2V0QXBwVHJhY2UpY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXJyb3IuZ2V0QXBwVHJhY2UoKSwgbnVsbCwgNCkpXG4vLyAgIC8vIGlmIChlcnJvci50b1N0cmluZyljb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShlcnJvci50b1N0cmluZygpLCBudWxsLCA0KSlcbi8vICAgTE9HKCdFUlJPUicsIGVycm9yLCAnamVzdXMtdGVzdCcsICdBUFAtRVJST1InKVxuLy8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldERJIChTRVJWSUNFLCBQQUNLQUdFKSB7XG4gIHJldHVybiB7XG4gICAgYXV0aGVudGljYXRlOiBhc3luYyh7cmVxdWVzdH0pID0+IHJlcXVpcmUoJy4vZmFrZUF1dGguanNvbicpLFxuICAgIGF1dGhvcml6ZTogYXN5bmMoe3JvdXRlLCByZXF1ZXN0fSkgPT4gdHJ1ZSxcbiAgICAvLyBnZXRFdmVudHM6IChwYXlsb2FkKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgLy8gICByZXNvbHZlKFNFUlZJQ0UuZXZlbnRzKVxuICAgIC8vIH0pLFxuICAgIC8vIGdldENvbmZpZzogKHBheWxvYWQpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyAgIHJlc29sdmUoY29uZmlnKVxuICAgIC8vIH0pLFxuICAgIHJlZ2lzdGVyUm91dGU6IGFzeW5jKHtyb3V0ZSwgcm91dGVGdW5jdGlvbn0pID0+IFNFUlZJQ0Uucm91dGVzW3JvdXRlXSA9IHJvdXRlRnVuY3Rpb24sXG4gICAgY2FsbFJvdXRlOiBhc3luYyh7cm91dGUsIHJlcXVlc3R9KSA9PiBTRVJWSUNFLnJvdXRlc1tyb3V0ZV0ocmVxdWVzdCksXG4gICAgZGVyZWdpc3RlclJvdXRlOiBhc3luYyh7cm91dGV9KSA9PiBTRVJWSUNFLnJvdXRlc1tyb3V0ZV0ocmVxdWVzdCksXG4gICAgZGVyZWdpc3RlclJvdXRlOiBhc3luYyh7cm91dGV9KSA9PiBkZWxldGUgU0VSVklDRS5yb3V0ZXNbcm91dGVdLFxuICAgIHJlZ2lzdGVyRXZlbnQ6IGFzeW5jKHtuYW1lLCByb3V0ZX0pID0+IHtcbiAgICAgIFNFUlZJQ0UuZXZlbnRzW25hbWVdID0ge25hbWUsIHJvdXRlfVxuICAgIH0sXG4gICAgZGVyZWdpc3RlckV2ZW50OiBhc3luYyh7bmFtZX0pID0+IGRlbGV0ZSBTRVJWSUNFLmV2ZW50c1tldmVudF0sXG4gICAgZW1pdEV2ZW50OiBhc3luYyh7bmFtZSwgcGF5bG9hZH0pID0+IHt9XG4gIH1cbn1cbiJdfQ==