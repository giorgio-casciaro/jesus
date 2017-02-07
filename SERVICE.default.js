'use strict';

var path = require('path');
var fs = require('fs');
var uuidV4 = require('uuid/v4');
var R = require('ramda');

var sourceMapSupport = require('source-map-support');
sourceMapSupport.install();
var appError = require('./error.appError');

process.on('unhandledRejection', function (reason, promise) {
  logger.error('unhandledRejection Reason: ', promise, reason);
  logger.trace(promise);
});

module.exports = function getSERVICE(CONFIG) {
  var _this = this;

  var SERVICE = {
    routes: {},
    events: {}
  };

  var logger;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNFUlZJQ0UuZGVmYXVsdC5lczYiXSwibmFtZXMiOlsicGF0aCIsInJlcXVpcmUiLCJmcyIsInV1aWRWNCIsIlIiLCJzb3VyY2VNYXBTdXBwb3J0IiwiaW5zdGFsbCIsImFwcEVycm9yIiwicHJvY2VzcyIsIm9uIiwicmVhc29uIiwicHJvbWlzZSIsImxvZ2dlciIsImVycm9yIiwidHJhY2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0U0VSVklDRSIsIkNPTkZJRyIsIlNFUlZJQ0UiLCJyb3V0ZXMiLCJldmVudHMiLCJ3aW5zdG9uIiwibG9nUGF0aCIsImV4aXN0c1N5bmMiLCJta2RpclN5bmMiLCJ0c0Zvcm1hdCIsIkRhdGUiLCJ0b0xvY2FsZVRpbWVTdHJpbmciLCJ0cmFuc3BvcnRzIiwiQ29uc29sZSIsInRpbWVzdGFtcCIsImNvbG9yaXplIiwibGV2ZWwiLCJGaWxlIiwiZmlsZW5hbWUiLCJOT0RFX0VOViIsImRlYnVnQWN0aXZlIiwidW5saW5rIiwicHVzaCIsIm5hbWUiLCJMb2dnZXIiLCJyZWdpc3RlclJvdXRlIiwicm91dGUiLCJyb3V0ZUZ1bmN0aW9uIiwiY2FsbFJvdXRlIiwicmVxdWVzdCIsImdldFJvdXRlcyIsImRlcmVnaXN0ZXJSb3V0ZSIsInRocm93RXJyb3IiLCJtZXNzYWdlIiwib3JpZ2luYWxFcnJvciIsImFyZ3MiLCJsb2ciLCJpbmZvIiwid2FybiIsImRlYnVnIiwiYXBwVHJhY2UiLCJjb25zb2xlIiwiZXJyb3JSZXNwb25zZSIsIl9lcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxPQUFPQyxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlDLEtBQUtELFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBTUUsU0FBU0YsUUFBUSxTQUFSLENBQWY7QUFDQSxJQUFJRyxJQUFJSCxRQUFRLE9BQVIsQ0FBUjs7QUFFQSxJQUFJSSxtQkFBbUJKLFFBQVEsb0JBQVIsQ0FBdkI7QUFDQUksaUJBQWlCQyxPQUFqQjtBQUNBLElBQUlDLFdBQVdO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S0FBUCxDQUFhLFVBQWIsRUFBeUJBLE1BQU15QyxJQUEvQixFQUFxQ3pDLE1BQU00QyxRQUEzQztBQUNELE9BSEQsTUFHTzdDLE9BQU9DLEtBQVAsQ0FBYUEsS0FBYjtBQUNQLFVBQUlBLE1BQU00QyxRQUFWLEVBQW1CN0MsT0FBTzRDLEtBQVAsQ0FBYTNDLE1BQU00QyxRQUFuQjtBQUNuQjtBQUNBLGFBQU87QUFDTEcsZ0JBQU8sSUFERjtBQUVMVixpQkFBUXJDLE1BQU1xQztBQUZULE9BQVA7QUFJRDtBQWxDSSxHQUFQO0FBb0NELENBdEZEIiwiZmlsZSI6IlNFUlZJQ0UuZGVmYXVsdC5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG52YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcblxudmFyIHNvdXJjZU1hcFN1cHBvcnQgPSByZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKVxuc291cmNlTWFwU3VwcG9ydC5pbnN0YWxsKClcbnZhciBhcHBFcnJvciA9IHJlcXVpcmUoJy4vZXJyb3IuYXBwRXJyb3InKVxuXG5wcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwcm9taXNlKSA9PiB7XG4gIGxvZ2dlci5lcnJvcigndW5oYW5kbGVkUmVqZWN0aW9uIFJlYXNvbjogJywgcHJvbWlzZSwgcmVhc29uKVxuICBsb2dnZXIudHJhY2UocHJvbWlzZSlcbn0pXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U0VSVklDRSAoQ09ORklHKSB7XG4gIHZhciBTRVJWSUNFID0ge1xuICAgIHJvdXRlczoge30sXG4gICAgZXZlbnRzOiB7fVxuICB9XG5cbiAgdmFyIGxvZ2dlclxuICB7IC8vIExPR0dFUlxuICAgIGNvbnN0IHdpbnN0b24gPSByZXF1aXJlKCd3aW5zdG9uJylcbiAgICBjb25zdCBsb2dQYXRoID0gQ09ORklHLmxvZ1BhdGhcbiAgLy8gQ3JlYXRlIHRoZSBsb2cgZGlyZWN0b3J5IGlmIGl0IGRvZXMgbm90IGV4aXN0XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGxvZ1BhdGgpKSB7XG4gICAgICBmcy5ta2RpclN5bmMobG9nUGF0aClcbiAgICB9XG4gICAgY29uc3QgdHNGb3JtYXQgPSAoKSA9PiAobmV3IERhdGUoKSkudG9Mb2NhbGVUaW1lU3RyaW5nKClcbiAgICB2YXIgdHJhbnNwb3J0cyA9IFtcbiAgICAvLyBjb2xvcml6ZSB0aGUgb3V0cHV0IHRvIHRoZSBjb25zb2xlXG4gICAgICBuZXcgKHdpbnN0b24udHJhbnNwb3J0cy5Db25zb2xlKSh7XG4gICAgICAgIHRpbWVzdGFtcDogdHNGb3JtYXQsXG4gICAgICAgIGNvbG9yaXplOiB0cnVlLFxuICAgICAgICBsZXZlbDogJ2luZm8nXG4gICAgICB9KSxcbiAgICAgIG5ldyAod2luc3Rvbi50cmFuc3BvcnRzLkZpbGUpKHtcbiAgICAgICAgZmlsZW5hbWU6IGAke2xvZ1BhdGh9L3Jlc3VsdHMubG9nYCxcbiAgICAgICAgdGltZXN0YW1wOiB0c0Zvcm1hdCxcbiAgICAgICAgbGV2ZWw6IENPTkZJRy5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/ICdkZWJ1ZycgOiAnaW5mbydcbiAgICAgIH0pXG5cbiAgICBdXG4gICAgaWYgKENPTkZJRy5kZWJ1Z0FjdGl2ZSkge1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoYCR7bG9nUGF0aH0vZGVidWcubG9nYCkpZnMudW5saW5rKGAke2xvZ1BhdGh9L2RlYnVnLmxvZ2ApXG4gICAgICB0cmFuc3BvcnRzLnB1c2gobmV3ICh3aW5zdG9uLnRyYW5zcG9ydHMuRmlsZSkoe1xuICAgICAgICBuYW1lOiAnZGVidWcnLFxuICAgICAgICBmaWxlbmFtZTogYCR7bG9nUGF0aH0vZGVidWcubG9nYCxcbiAgICAgICAgdGltZXN0YW1wOiB0c0Zvcm1hdCxcbiAgICAgICAgbGV2ZWw6ICdkZWJ1ZydcbiAgICAgIH0pKVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoYCR7bG9nUGF0aH0vZXJyb3JzLmxvZ2ApKWZzLnVubGluayhgJHtsb2dQYXRofS9lcnJvcnMubG9nYClcbiAgICAgIHRyYW5zcG9ydHMucHVzaChuZXcgKHdpbnN0b24udHJhbnNwb3J0cy5GaWxlKSh7XG4gICAgICAgIG5hbWU6ICdkZWJ1Z19lcnJvcnMnLFxuICAgICAgICBmaWxlbmFtZTogYCR7bG9nUGF0aH0vZXJyb3JzLmxvZ2AsXG4gICAgICAgIHRpbWVzdGFtcDogdHNGb3JtYXQsXG4gICAgICAgIGxldmVsOiAnZXJyb3InXG4gICAgICB9KSlcbiAgICB9XG4gICAgbG9nZ2VyID0gbmV3ICh3aW5zdG9uLkxvZ2dlcikoe1xuICAgICAgdHJhbnNwb3J0c1xuICAgIH0pXG4gIH1cblxuICByZXR1cm4ge1xuXG4gICAgcmVnaXN0ZXJSb3V0ZTogYXN5bmMoe3JvdXRlLCByb3V0ZUZ1bmN0aW9ufSkgPT4geyBTRVJWSUNFLnJvdXRlc1tyb3V0ZV0gPSByb3V0ZUZ1bmN0aW9uIH0sXG4gICAgY2FsbFJvdXRlOiBhc3luYyh7cm91dGUsIHJlcXVlc3R9KSA9PiBhd2FpdCBTRVJWSUNFLnJvdXRlc1tyb3V0ZV0ocmVxdWVzdCksXG4gICAgZ2V0Um91dGVzOiAoKSA9PiBTRVJWSUNFLnJvdXRlcyxcbiAgICBkZXJlZ2lzdGVyUm91dGU6IGFzeW5jKHtyb3V0ZX0pID0+IHsgZGVsZXRlIFNFUlZJQ0Uucm91dGVzW3JvdXRlXSB9LFxuICAgIFxuICAgIHRocm93RXJyb3I6IChtZXNzYWdlLCBvcmlnaW5hbEVycm9yLCBhcmdzKSA9PiB7XG4gICAgICBsb2dnZXIuZXJyb3IoJ3Rocm93RXJyb3InLCBtZXNzYWdlLCBvcmlnaW5hbEVycm9yLCBhcmdzKVxuICAgICAgdGhyb3cgbmV3IGFwcEVycm9yKG1lc3NhZ2UsIG9yaWdpbmFsRXJyb3IsIGFyZ3MpXG4gICAgfSxcbiAgICBsb2c6IGxvZ2dlci5pbmZvLFxuICAgIHdhcm46IGxvZ2dlci53YXJuLFxuICAgIGRlYnVnOiBsb2dnZXIuZGVidWcsXG4gICAgZXJyb3I6IChlcnJvcikgPT4ge1xuICAgICAgaWYgKGVycm9yLm9yaWdpbmFsRXJyb3IpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdvcmlnaW5hbEVycm9yJywgZXJyb3Iub3JpZ2luYWxFcnJvcilcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdhcHBFcnJvcicsIGVycm9yLmluZm8sIGVycm9yLmFwcFRyYWNlKVxuICAgICAgfSBlbHNlIGxvZ2dlci5lcnJvcihlcnJvcilcbiAgICAgIGlmIChlcnJvci5hcHBUcmFjZSlsb2dnZXIuZGVidWcoZXJyb3IuYXBwVHJhY2UpXG4gICAgICBlbHNlIGNvbnNvbGUudHJhY2UoZXJyb3IpXG4gICAgfSxcblxuICAgIGVycm9yUmVzcG9uc2U6IChlcnJvcikgPT4ge1xuICAgICAgaWYgKGVycm9yLm9yaWdpbmFsRXJyb3IpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdvcmlnaW5hbEVycm9yJywgZXJyb3Iub3JpZ2luYWxFcnJvcilcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdhcHBFcnJvcicsIGVycm9yLmluZm8sIGVycm9yLmFwcFRyYWNlKVxuICAgICAgfSBlbHNlIGxvZ2dlci5lcnJvcihlcnJvcilcbiAgICAgIGlmIChlcnJvci5hcHBUcmFjZSlsb2dnZXIuZGVidWcoZXJyb3IuYXBwVHJhY2UpXG4gICAgICAvL2Vsc2UgY29uc29sZS50cmFjZShlcnJvcilcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9lcnJvcjp0cnVlLFxuICAgICAgICBtZXNzYWdlOmVycm9yLm1lc3NhZ2VcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==