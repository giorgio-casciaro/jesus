'use strict';

var path = require('path');
var fs = require('fs');
var uuidV4 = require('uuid/v4');
var R = require('ramda');

var sourceMapSupport = require('source-map-support');
sourceMapSupport.install();
var appError = require('./error.appError');
var logger;

process.on('unhandledRejection', function (reason, promise) {
  logger.error('unhandledRejection Reason: ', promise, reason);
  //console.trace(promise)
});

module.exports = function getSERVICE(CONFIG) {
  var _this = this;

  var SERVICE = {
    routes: {},
    events: {}
  };

  {
    // LOGGER
    var winston = require('winston');
    var logPath = CONFIG.logPath;
    // Create the log directory if it does not exist
    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath);
    }
    var tsFormat = function tsFormat() {
      return new Date().toLocaleTimeString();
    };
    var transports = [
    // colorize the output to the console
    new winston.transports.Console({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }), new winston.transports.File({
      filename: logPath + '/results.log',
      timestamp: tsFormat,
      level: CONFIG.NODE_ENV === 'development' ? 'debug' : 'info'
    })];
    if (CONFIG.debugActive) {
      if (fs.existsSync(logPath + '/debug.log')) fs.unlink(logPath + '/debug.log');
      transports.push(new winston.transports.File({
        name: 'debug',
        filename: logPath + '/debug.log',
        timestamp: tsFormat,
        level: 'debug'
      }));
      if (fs.existsSync(logPath + '/errors.log')) fs.unlink(logPath + '/errors.log');
      transports.push(new winston.transports.File({
        name: 'debug_errors',
        filename: logPath + '/errors.log',
        timestamp: tsFormat,
        level: 'error'
      }));
    }
    logger = new winston.Logger({
      transports: transports
    });
  }

  return {

    registerRoute: function registerRoute(_ref) {
      var route = _ref.route,
          routeFunction = _ref.routeFunction;
      return regeneratorRuntime.async(function registerRoute$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              SERVICE.routes[route] = routeFunction;
            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, null, _this);
    },
    callRoute: function callRoute(_ref2) {
      var route = _ref2.route,
          request = _ref2.request;
      return regeneratorRuntime.async(function callRoute$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(SERVICE.routes[route](request));

            case 2:
              return _context2.abrupt('return', _context2.sent);

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, _this);
    },
    getRoutes: function getRoutes() {
      return SERVICE.routes;
    },
    deregisterRoute: function deregisterRoute(_ref3) {
      var route = _ref3.route;
      return regeneratorRuntime.async(function deregisterRoute$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              delete SERVICE.routes[route];
            case 1:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, _this);
    },

    throwError: function throwError(message, originalError, args) {
      logger.error('throwError', message, originalError, args);
      throw new appError(message, originalError, args);
    },
    log: logger.info,
    warn: logger.warn,
    debug: logger.debug,
    error: function error(_error) {
      if (_error.originalError) {
        logger.error('originalError', _error.originalError);
        logger.error('appError', _error.info, _error.appTrace);
      } else logger.error(_error);
      if (_error.appTrace) logger.debug(_error.appTrace);else console.trace(_error);
    },

    errorResponse: function errorResponse(error) {
      if (error.originalError) {
        logger.error('originalError', error.originalError);
        logger.error('appError', error.info, error.appTrace);
      } else logger.error(error);
      if (error.appTrace) logger.debug(error.appTrace);
      //else console.trace(error)
      return {
        _error: true,
        message: error.message
      };
    }
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNFUlZJQ0UuZGVmYXVsdC5lczYiXSwibmFtZXMiOlsicGF0aCIsInJlcXVpcmUiLCJmcyIsInV1aWRWNCIsIlIiLCJzb3VyY2VNYXBTdXBwb3J0IiwiaW5zdGFsbCIsImFwcEVycm9yIiwibG9nZ2VyIiwicHJvY2VzcyIsIm9uIiwicmVhc29uIiwicHJvbWlzZSIsImVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFNFUlZJQ0UiLCJDT05GSUciLCJTRVJWSUNFIiwicm91dGVzIiwiZXZlbnRzIiwid2luc3RvbiIsImxvZ1BhdGgiLCJleGlzdHNTeW5jIiwibWtkaXJTeW5jIiwidHNGb3JtYXQiLCJEYXRlIiwidG9Mb2NhbGVUaW1lU3RyaW5nIiwidHJhbnNwb3J0cyIsIkNvbnNvbGUiLCJ0aW1lc3RhbXAiLCJjb2xvcml6ZSIsImxldmVsIiwiRmlsZSIsImZpbGVuYW1lIiwiTk9ERV9FTlYiLCJkZWJ1Z0FjdGl2ZSIsInVubGluayIsInB1c2giLCJuYW1lIiwiTG9nZ2VyIiwicmVnaXN0ZXJSb3V0ZSIsInJvdXRlIiwicm91dGVGdW5jdGlvbiIsImNhbGxSb3V0ZSIsInJlcXVlc3QiLCJnZXRSb3V0ZXMiLCJkZXJlZ2lzdGVyUm91dGUiLCJ0aHJvd0Vycm9yIiwibWVzc2FnZSIsIm9yaWdpbmFsRXJyb3IiLCJhcmdzIiwibG9nIiwiaW5mbyIsIndhcm4iLCJkZWJ1ZyIsImFwcFRyYWNlIiwiY29uc29sZSIsInRyYWNlIiwiZXJyb3JSZXNwb25zZSIsIl9lcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxPQUFPQyxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlDLEtBQUtELFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBTUUsU0FBU0YsUUFBUSxTQUFSLENBQWY7QUFDQSxJQUFJRyxJQUFJSCxRQUFRLE9BQVIsQ0FBUjs7QUFFQSxJQUFJSSxtQkFBbUJKLFFBQVEsb0JBQVIsQ0FBdkI7QUFDQUksaUJBQWlCQyxPQUFqQjtBQUNBLElBQUlDLFdBQVdO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QUFNd0MsSUFBL0IsRUFBcUN4QyxNQUFNMkMsUUFBM0M7QUFDRCxPQUhELE1BR09oRCxPQUFPSyxLQUFQLENBQWFBLEtBQWI7QUFDUCxVQUFJQSxNQUFNMkMsUUFBVixFQUFtQmhELE9BQU8rQyxLQUFQLENBQWExQyxNQUFNMkMsUUFBbkI7QUFDbkI7QUFDQSxhQUFPO0FBQ0xJLGdCQUFPLElBREY7QUFFTFgsaUJBQVFwQyxNQUFNb0M7QUFGVCxPQUFQO0FBSUQ7QUFsQ0ksR0FBUDtBQW9DRCxDQXRGRCIsImZpbGUiOiJTRVJWSUNFLmRlZmF1bHQuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxudmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG5cbnZhciBzb3VyY2VNYXBTdXBwb3J0ID0gcmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JylcbnNvdXJjZU1hcFN1cHBvcnQuaW5zdGFsbCgpXG52YXIgYXBwRXJyb3IgPSByZXF1aXJlKCcuL2Vycm9yLmFwcEVycm9yJylcbnZhciBsb2dnZXJcblxucHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgKHJlYXNvbiwgcHJvbWlzZSkgPT4ge1xuICBsb2dnZXIuZXJyb3IoJ3VuaGFuZGxlZFJlamVjdGlvbiBSZWFzb246ICcsIHByb21pc2UsIHJlYXNvbilcbiAgLy9jb25zb2xlLnRyYWNlKHByb21pc2UpXG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFNFUlZJQ0UgKENPTkZJRykge1xuICB2YXIgU0VSVklDRSA9IHtcbiAgICByb3V0ZXM6IHt9LFxuICAgIGV2ZW50czoge31cbiAgfVxuXG5cbiAgeyAvLyBMT0dHRVJcbiAgICBjb25zdCB3aW5zdG9uID0gcmVxdWlyZSgnd2luc3RvbicpXG4gICAgY29uc3QgbG9nUGF0aCA9IENPTkZJRy5sb2dQYXRoXG4gIC8vIENyZWF0ZSB0aGUgbG9nIGRpcmVjdG9yeSBpZiBpdCBkb2VzIG5vdCBleGlzdFxuICAgIGlmICghZnMuZXhpc3RzU3luYyhsb2dQYXRoKSkge1xuICAgICAgZnMubWtkaXJTeW5jKGxvZ1BhdGgpXG4gICAgfVxuICAgIGNvbnN0IHRzRm9ybWF0ID0gKCkgPT4gKG5ldyBEYXRlKCkpLnRvTG9jYWxlVGltZVN0cmluZygpXG4gICAgdmFyIHRyYW5zcG9ydHMgPSBbXG4gICAgLy8gY29sb3JpemUgdGhlIG91dHB1dCB0byB0aGUgY29uc29sZVxuICAgICAgbmV3ICh3aW5zdG9uLnRyYW5zcG9ydHMuQ29uc29sZSkoe1xuICAgICAgICB0aW1lc3RhbXA6IHRzRm9ybWF0LFxuICAgICAgICBjb2xvcml6ZTogdHJ1ZSxcbiAgICAgICAgbGV2ZWw6ICdpbmZvJ1xuICAgICAgfSksXG4gICAgICBuZXcgKHdpbnN0b24udHJhbnNwb3J0cy5GaWxlKSh7XG4gICAgICAgIGZpbGVuYW1lOiBgJHtsb2dQYXRofS9yZXN1bHRzLmxvZ2AsXG4gICAgICAgIHRpbWVzdGFtcDogdHNGb3JtYXQsXG4gICAgICAgIGxldmVsOiBDT05GSUcuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgPyAnZGVidWcnIDogJ2luZm8nXG4gICAgICB9KVxuXG4gICAgXVxuICAgIGlmIChDT05GSUcuZGVidWdBY3RpdmUpIHtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGAke2xvZ1BhdGh9L2RlYnVnLmxvZ2ApKWZzLnVubGluayhgJHtsb2dQYXRofS9kZWJ1Zy5sb2dgKVxuICAgICAgdHJhbnNwb3J0cy5wdXNoKG5ldyAod2luc3Rvbi50cmFuc3BvcnRzLkZpbGUpKHtcbiAgICAgICAgbmFtZTogJ2RlYnVnJyxcbiAgICAgICAgZmlsZW5hbWU6IGAke2xvZ1BhdGh9L2RlYnVnLmxvZ2AsXG4gICAgICAgIHRpbWVzdGFtcDogdHNGb3JtYXQsXG4gICAgICAgIGxldmVsOiAnZGVidWcnXG4gICAgICB9KSlcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGAke2xvZ1BhdGh9L2Vycm9ycy5sb2dgKSlmcy51bmxpbmsoYCR7bG9nUGF0aH0vZXJyb3JzLmxvZ2ApXG4gICAgICB0cmFuc3BvcnRzLnB1c2gobmV3ICh3aW5zdG9uLnRyYW5zcG9ydHMuRmlsZSkoe1xuICAgICAgICBuYW1lOiAnZGVidWdfZXJyb3JzJyxcbiAgICAgICAgZmlsZW5hbWU6IGAke2xvZ1BhdGh9L2Vycm9ycy5sb2dgLFxuICAgICAgICB0aW1lc3RhbXA6IHRzRm9ybWF0LFxuICAgICAgICBsZXZlbDogJ2Vycm9yJ1xuICAgICAgfSkpXG4gICAgfVxuICAgIGxvZ2dlciA9IG5ldyAod2luc3Rvbi5Mb2dnZXIpKHtcbiAgICAgIHRyYW5zcG9ydHNcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIHJlZ2lzdGVyUm91dGU6IGFzeW5jKHtyb3V0ZSwgcm91dGVGdW5jdGlvbn0pID0+IHsgU0VSVklDRS5yb3V0ZXNbcm91dGVdID0gcm91dGVGdW5jdGlvbiB9LFxuICAgIGNhbGxSb3V0ZTogYXN5bmMoe3JvdXRlLCByZXF1ZXN0fSkgPT4gYXdhaXQgU0VSVklDRS5yb3V0ZXNbcm91dGVdKHJlcXVlc3QpLFxuICAgIGdldFJvdXRlczogKCkgPT4gU0VSVklDRS5yb3V0ZXMsXG4gICAgZGVyZWdpc3RlclJvdXRlOiBhc3luYyh7cm91dGV9KSA9PiB7IGRlbGV0ZSBTRVJWSUNFLnJvdXRlc1tyb3V0ZV0gfSxcblxuICAgIHRocm93RXJyb3I6IChtZXNzYWdlLCBvcmlnaW5hbEVycm9yLCBhcmdzKSA9PiB7XG4gICAgICBsb2dnZXIuZXJyb3IoJ3Rocm93RXJyb3InLCBtZXNzYWdlLCBvcmlnaW5hbEVycm9yLCBhcmdzKVxuICAgICAgdGhyb3cgbmV3IGFwcEVycm9yKG1lc3NhZ2UsIG9yaWdpbmFsRXJyb3IsIGFyZ3MpXG4gICAgfSxcbiAgICBsb2c6IGxvZ2dlci5pbmZvLFxuICAgIHdhcm46IGxvZ2dlci53YXJuLFxuICAgIGRlYnVnOiBsb2dnZXIuZGVidWcsXG4gICAgZXJyb3I6IChlcnJvcikgPT4ge1xuICAgICAgaWYgKGVycm9yLm9yaWdpbmFsRXJyb3IpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdvcmlnaW5hbEVycm9yJywgZXJyb3Iub3JpZ2luYWxFcnJvcilcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdhcHBFcnJvcicsIGVycm9yLmluZm8sIGVycm9yLmFwcFRyYWNlKVxuICAgICAgfSBlbHNlIGxvZ2dlci5lcnJvcihlcnJvcilcbiAgICAgIGlmIChlcnJvci5hcHBUcmFjZSlsb2dnZXIuZGVidWcoZXJyb3IuYXBwVHJhY2UpXG4gICAgICBlbHNlIGNvbnNvbGUudHJhY2UoZXJyb3IpXG4gICAgfSxcblxuICAgIGVycm9yUmVzcG9uc2U6IChlcnJvcikgPT4ge1xuICAgICAgaWYgKGVycm9yLm9yaWdpbmFsRXJyb3IpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdvcmlnaW5hbEVycm9yJywgZXJyb3Iub3JpZ2luYWxFcnJvcilcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdhcHBFcnJvcicsIGVycm9yLmluZm8sIGVycm9yLmFwcFRyYWNlKVxuICAgICAgfSBlbHNlIGxvZ2dlci5lcnJvcihlcnJvcilcbiAgICAgIGlmIChlcnJvci5hcHBUcmFjZSlsb2dnZXIuZGVidWcoZXJyb3IuYXBwVHJhY2UpXG4gICAgICAvL2Vsc2UgY29uc29sZS50cmFjZShlcnJvcilcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9lcnJvcjp0cnVlLFxuICAgICAgICBtZXNzYWdlOmVycm9yLm1lc3NhZ2VcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==