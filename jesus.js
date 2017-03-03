'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var R = require('ramda');
var fs = require('fs');
var path = require('path');
var deref = require('json-schema-deref-sync');
var jsonfile = require('jsonfile');
// var normalise = require('ajv-error-messages')
var ajv = require('ajv')({ allErrors: true });
// var sourceMapSupport = require('source-map-support')
// sourceMapSupport.install()
process.on('unhandledRejection', function (reason, promise) {
  console.error('unhandledRejection Reason: ', promise, reason);
  console.trace(reason);
});

var PACKAGE = 'jesus';
var stringToColor = function stringToColor(string) {
  var value = string.split('').map(function (char) {
    return char.charCodeAt(0) * 2;
  }).reduce(function (a, b) {
    return a + b;
  }, 0);
  return 'hsl(' + value % 255 + ',80%,30%)';
};

var getConsole = function getConsole() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { debug: false, log: true, error: true, warn: true };
  var serviceName = arguments[1];
  var serviceId = arguments[2];
  var pack = arguments[3];

  return {
    profile: function profile(name) {
      if (!console.profile) return false;console.profile(name);
    },
    profileEnd: function profileEnd(name) {
      if (!console.profile) return false;console.profileEnd(name);
    },
    error: function error() {
      if (!config.error) return false;var args = Array.prototype.slice.call(arguments);console.error.apply(this, [serviceName, serviceId, pack].concat(args));
    },
    log: function log() {
      if (!config.log) return false;var args = Array.prototype.slice.call(arguments);console.log.apply(this, [serviceName, serviceId, pack].concat(args));
    },
    debug: function debug() {
      if (!config.debug) return false;var args = Array.prototype.slice.call(arguments);console.debug.apply(this, ['%c' + serviceName, 'background: ' + stringToColor(serviceName) + '; color: white; display: block;', serviceId, pack].concat(args));
    },
    warn: function warn() {
      if (!config.warn) return false;var args = Array.prototype.slice.call(arguments);console.warn.apply(this, [serviceName, serviceId, pack].concat(args));
    }
  };
};

function errorThrow(serviceName, serviceId, pack) {
  return function (msg, data) {
    getConsole(false, serviceName, serviceId, pack).warn(msg, data);
    if (data && data.error) throw data.error;else throw msg;
  };
}

module.exports = {
  getAllServicesConfigFromDir: function getAllServicesConfigFromDir(dir) {
    var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'methods.json';

    var services = {};
    fs.readdirSync(dir).forEach(function (file) {
      var filePath = path.join(dir, file, fileName);
      if (fs.existsSync(filePath)) services[file] = require(filePath);
    });
    // CONSOLE.debug("getAllServicesConfigFromDir",services)
    return services;
  },
  setSharedConfig: function setSharedConfig(servicesRootDir, service, config, data) {
    return new Promise(function (resolve, reject) {
      var filePath = path.join(servicesRootDir, service, config);
      jsonfile.writeFile(filePath + '.json', data, function (err) {
        if (err) return reject(err);
        resolve(data);
      });
    });
  },
  getSharedConfig: function getSharedConfig(servicesRootDir) {
    return function (service) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'service';
      var exclude = arguments[2];
      var asObj = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      return new Promise(function (resolve, reject) {
        if (service === '*') {
          fs.readdir(servicesRootDir, function (err, dirContents) {
            if (err) return reject(err);
            var allFilePromises = [];
            dirContents.forEach(function (serviceName) {
              if (exclude === serviceName) return false;
              var filePath = path.join(servicesRootDir, serviceName, config);
              allFilePromises.push(new Promise(function (resolve, reject) {
                jsonfile.readFile(filePath + '.json', function (err, data) {
                  if (err) return reject(err);
                  data = deref(data, { baseFolder: path.dirname(filePath), failOnMissing: true });
                  data.serviceName = serviceName;
                  return resolve(data);
                });
              }));
            });
            Promise.all(allFilePromises).then(function (result) {
              if (asObj) {
                var objResult = {};
                result.forEach(function (serviceArray) {
                  return objResult[serviceArray.serviceName] = serviceArray;
                });
                return resolve(objResult);
              } else resolve(result);
            }).catch(reject);
          });
        } else {
          var filePath = path.join(servicesRootDir, service, config);
          jsonfile.readFile(filePath + '.json', function (err, data) {
            if (err) return reject(err);
            data = deref(data, { baseFolder: path.dirname(filePath), failOnMissing: true });
            data.serviceName = service;
            return resolve(data);
          });
        }
      });
    };
  },

  errorThrow: errorThrow,
  validateMethodFromConfig: function validateMethodFromConfig(serviceName, serviceId, methodsConfig, methodName, data, schemaField) {
    if (!methodsConfig || !methodsConfig[methodName] || !methodsConfig[methodName][schemaField]) errorThrow('Method validation problem :' + methodName + ' ' + schemaField + ' in ' + methodsConfigFile);
    var schema = methodsConfig[methodName][schemaField];
    var validate = ajv.compile(schema);
    var valid = validate(data);
    if (!valid) {
      errorThrow(serviceName, serviceId, PACKAGE)('validation errors', { errors: validate.errors, methodsConfig: methodsConfig, methodName: methodName, data: data, schemaField: schemaField });
    }
    return data;
  },

  getAsPromise: function getAsPromise(value) {
    return new Promise(function (resolve, reject) {
      Promise.resolve(value).then(function (value) {
        if (typeof value === 'function') {
          try {
            return resolve(value());
          } catch (error) {
            return reject(error);
          }
        } else return resolve(value);
      });
    });
  },
  argsOverwrite: function argsOverwrite() {
    var overwriteArgs = Array.prototype.slice.call(arguments, 1);
    var originalPackage = arguments[0];
    var modifiedPackage = {};
    for (var i in originalPackage) {
      modifiedPackage[i] = function packageArgsOverwrite() {
        var modifiedArguments = Object.assign(arguments, overwriteArgs);
        return originalPackage[i].apply(this, modifiedArguments);
      };
    }
    return modifiedPackage;
  },
  checkRequired: function checkRequired(PROPS_OBJ, PACKAGE) {
    var propsNames = Object.keys(PROPS_OBJ);
    propsNames.forEach(function (propName) {
      if (!PROPS_OBJ[propName]) {
        throw 'PACKAGE:' + PACKAGE + '  Required Dependency ' + propName + ' is missing';
      }
    });
  },
  checkRequiredFiles: function checkRequiredFiles(FILES, PACKAGE) {
    FILES.forEach(function (file) {
      if (!fs.existsSync(file)) {
        throw 'Required File ' + file + ' is missing';
      }
    });
  },
  isEmptyArray: function isEmptyArray(array) {
    return !array || !array.length;
  },

  getConsole: getConsole,
  addObjectColumn: function addObjectColumn(objectsArray, columnName, valuesArray) {
    var addColums = function addColums(val, index) {
      return R.merge(_defineProperty({}, columnName, valuesArray[index]), val);
    };
    return R.addIndex(R.map)(addColums, objectsArray);
  }

};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImplc3VzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImZzIiwicGF0aCIsImRlcmVmIiwianNvbmZpbGUiLCJhanYiLCJhbGxFcnJvcnMiLCJwcm9jZXNzIiwib24iLCJyZWFzb24iLCJwcm9taXNlIiwiY29uc29sZSIsImVycm9yIiwidHJhY2UiLCJQQUNLQUdFIiwic3RyaW5nVG9Db2xvciIsInN0cmluZyIsInZhbHVlIiwic3BsaXQiLCJtYXAiLCJjaGFyIiwiY2hhckNvZGVBdCIsInJlZHVjZSIsImEiLCJiIiwiZ2V0Q29uc29sZSIsImNvbmZpZyIsImRlYnVnIiwibG9nIiwid2FybiIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsInByb2ZpbGUiLCJuYW1lIiwicHJvZmlsZUVuZCIsImFyZ3MiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImFyZ3VtZW50cyIsImFwcGx5IiwiY29uY2F0IiwiZXJyb3JUaHJvdyIsIm1zZyIsImRhdGEiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyIiwiZGlyIiwiZmlsZU5hbWUiLCJzZXJ2aWNlcyIsInJlYWRkaXJTeW5jIiwiZm9yRWFjaCIsImZpbGVQYXRoIiwiam9pbiIsImZpbGUiLCJleGlzdHNTeW5jIiwic2V0U2hhcmVkQ29uZmlnIiwic2VydmljZXNSb290RGlyIiwic2VydmljZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwid3JpdGVGaWxlIiwiZXJyIiwiZ2V0U2hhcmVkQ29uZmlnIiwiZXhjbHVkZSIsImFzT2JqIiwicmVhZGRpciIsImRpckNvbnRlbnRzIiwiYWxsRmlsZVByb21pc2VzIiwicHVzaCIsInJlYWRGaWxlIiwiYmFzZUZvbGRlciIsImRpcm5hbWUiLCJmYWlsT25NaXNzaW5nIiwiYWxsIiwidGhlbiIsIm9ialJlc3VsdCIsInJlc3VsdCIsInNlcnZpY2VBcnJheSIsImNhdGNoIiwidmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIiwibWV0aG9kc0NvbmZpZyIsIm1ldGhvZE5hbWUiLCJzY2hlbWFGaWVsZCIsIm1ldGhvZHNDb25maWdGaWxlIiwic2NoZW1hIiwidmFsaWRhdGUiLCJjb21waWxlIiwidmFsaWQiLCJlcnJvcnMiLCJnZXRBc1Byb21pc2UiLCJhcmdzT3ZlcndyaXRlIiwib3ZlcndyaXRlQXJncyIsIm9yaWdpbmFsUGFja2FnZSIsIm1vZGlmaWVkUGFja2FnZSIsImkiLCJwYWNrYWdlQXJnc092ZXJ3cml0ZSIsIm1vZGlmaWVkQXJndW1lbnRzIiwiT2JqZWN0IiwiYXNzaWduIiwiY2hlY2tSZXF1aXJlZCIsIlBST1BTX09CSiIsInByb3BzTmFtZXMiLCJrZXlzIiwicHJvcE5hbWUiLCJjaGVja1JlcXVpcmVkRmlsZXMiLCJGSUxFUyIsImlzRW1wdHlBcnJheSIsImFycmF5IiwibGVuZ3RoIiwiYWRkT2JqZWN0Q29sdW1uIiwib2JqZWN0c0FycmF5IiwiY29sdW1uTmFtZSIsInZhbHVlc0FycmF5IiwiYWRkQ29sdW1zIiwidmFsIiwiaW5kZXgiLCJtZXJnZSIsImFkZEluZGV4Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsSUFBSUMsUUFBUSxPQUFSLENBQVY7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1FLE9BQU9GLFFBQVEsTUFBUixDQUFiO0FBQ0EsSUFBSUcsUUFBUUgsUUFBUSx3QkFBUixDQUFaO0FBQ0EsSUFBSUksV0FBV0osUUFBUSxVQUFSLENBQWY7QUFDQTtBQUNBLElBQUlLLE1BQU1MLFFBQVEsS0FBUixFQUFlLEVBQUNNLFdBQVcsSUFBWixFQUFmLENBQVY7QUFDQTtBQUNBO0FBQ0FDLFFBQVFDLEVBQVIsQ0FBVyxvQkFBWCxFQUFpQyxVQUFDQyxNQUFELEVBQVNDLE9BQVQsRUFBcUI7QUFDcERDLFVBQVFDLEtBQVIsQ0FBYyw2QkFBZCxFQUE2Q0YsT0FBN0MsRUFBc0RELE1BQXREO0FBQ0FFLFVBQVFFLEtBQVIsQ0FBY0osTUFBZDtBQUNE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LEdBQUd5RCxVQUFILENBQWNELElBQWQsQ0FBTCxFQUEwQjtBQUN4QixpQ0FBdUJBLElBQXZCO0FBQ0Q7QUFDRixLQUpEO0FBS0QsR0F4R2M7QUF5R2ZzRCxjQXpHZSx3QkF5R0RDLEtBekdDLEVBeUdNO0FBQ25CLFdBQVEsQ0FBQ0EsS0FBRCxJQUFVLENBQUNBLE1BQU1DLE1BQXpCO0FBQ0QsR0EzR2M7O0FBNEdmeEYsd0JBNUdlO0FBNkdmeUYsbUJBQWlCLHlCQUFVQyxZQUFWLEVBQXdCQyxVQUF4QixFQUFvQ0MsV0FBcEMsRUFBaUQ7QUFDaEUsUUFBSUMsWUFBWSxTQUFaQSxTQUFZLENBQUNDLEdBQUQsRUFBTUMsS0FBTjtBQUFBLGFBQWdCekgsRUFBRTBILEtBQUYscUJBQzdCTCxVQUQ2QixFQUNoQkMsWUFBWUcsS0FBWixDQURnQixHQUU3QkQsR0FGNkIsQ0FBaEI7QUFBQSxLQUFoQjtBQUdBLFdBQU94SCxFQUFFMkgsUUFBRixDQUFXM0gsRUFBRW9CLEdBQWIsRUFBa0JtRyxTQUFsQixFQUE2QkgsWUFBN0IsQ0FBUDtBQUNEOztBQWxIYyxDQUFqQiIsImZpbGUiOiJqZXN1cy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBSID0gcmVxdWlyZSgncmFtZGEnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgZGVyZWYgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1kZXJlZi1zeW5jJylcbnZhciBqc29uZmlsZSA9IHJlcXVpcmUoJ2pzb25maWxlJylcbi8vIHZhciBub3JtYWxpc2UgPSByZXF1aXJlKCdhanYtZXJyb3ItbWVzc2FnZXMnKVxudmFyIGFqdiA9IHJlcXVpcmUoJ2FqdicpKHthbGxFcnJvcnM6IHRydWV9KVxuLy8gdmFyIHNvdXJjZU1hcFN1cHBvcnQgPSByZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKVxuLy8gc291cmNlTWFwU3VwcG9ydC5pbnN0YWxsKClcbnByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIChyZWFzb24sIHByb21pc2UpID0+IHtcbiAgY29uc29sZS5lcnJvcigndW5oYW5kbGVkUmVqZWN0aW9uIFJlYXNvbjogJywgcHJvbWlzZSwgcmVhc29uKVxuICBjb25zb2xlLnRyYWNlKHJlYXNvbilcbn0pXG5cbmNvbnN0IFBBQ0tBR0UgPSAnamVzdXMnXG5jb25zdCBzdHJpbmdUb0NvbG9yID0gKHN0cmluZykgPT4ge1xuICB2YXIgdmFsdWUgPSBzdHJpbmcuc3BsaXQoJycpLm1hcCgoY2hhcikgPT4gY2hhci5jaGFyQ29kZUF0KDApICogMikucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMClcbiAgcmV0dXJuIGBoc2woJHsodmFsdWUpICUgMjU1fSw4MCUsMzAlKWBcbn1cblxudmFyIGdldENvbnNvbGUgPSAoY29uZmlnID0ge2RlYnVnOiBmYWxzZSwgbG9nOiB0cnVlLCBlcnJvcjogdHJ1ZSwgd2FybjogdHJ1ZX0sIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IHtcbiAgcmV0dXJuIHtcbiAgICBwcm9maWxlIChuYW1lKSB7IGlmICghY29uc29sZS5wcm9maWxlKSByZXR1cm4gZmFsc2U7IGNvbnNvbGUucHJvZmlsZShuYW1lKSB9LFxuICAgIHByb2ZpbGVFbmQgKG5hbWUpIHsgaWYgKCFjb25zb2xlLnByb2ZpbGUpIHJldHVybiBmYWxzZTsgY29uc29sZS5wcm9maWxlRW5kKG5hbWUpIH0sXG4gICAgZXJyb3IgKCkgeyBpZiAoIWNvbmZpZy5lcnJvcikgcmV0dXJuIGZhbHNlOyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IGNvbnNvbGUuZXJyb3IuYXBwbHkodGhpcywgW3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSkgfSxcbiAgICBsb2cgKCkgeyBpZiAoIWNvbmZpZy5sb2cpIHJldHVybiBmYWxzZTsgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpOyBjb25zb2xlLmxvZy5hcHBseSh0aGlzLCBbc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFja10uY29uY2F0KGFyZ3MpKSB9LFxuICAgIGRlYnVnICgpIHsgaWYgKCFjb25maWcuZGVidWcpIHJldHVybiBmYWxzZTsgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpOyBjb25zb2xlLmRlYnVnLmFwcGx5KHRoaXMsIFsnJWMnICsgc2VydmljZU5hbWUsICdiYWNrZ3JvdW5kOiAnICsgc3RyaW5nVG9Db2xvcihzZXJ2aWNlTmFtZSkgKyAnOyBjb2xvcjogd2hpdGU7IGRpc3BsYXk6IGJsb2NrOycsIHNlcnZpY2VJZCwgcGFja10uY29uY2F0KGFyZ3MpKSB9LFxuICAgIHdhcm4gKCkgeyBpZiAoIWNvbmZpZy53YXJuKSByZXR1cm4gZmFsc2U7IHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTsgY29uc29sZS53YXJuLmFwcGx5KHRoaXMsIFtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrXS5jb25jYXQoYXJncykpIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlcnJvclRocm93IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSB7XG4gIHJldHVybiAobXNnLCBkYXRhKSA9PiB7XG4gICAgZ2V0Q29uc29sZShmYWxzZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykud2Fybihtc2csIGRhdGEpXG4gICAgaWYgKGRhdGEgJiYgZGF0YS5lcnJvcikgdGhyb3cgZGF0YS5lcnJvclxuICAgIGVsc2UgdGhyb3cgbXNnXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEFsbFNlcnZpY2VzQ29uZmlnRnJvbURpciAoZGlyLCBmaWxlTmFtZSA9ICdtZXRob2RzLmpzb24nKSB7XG4gICAgdmFyIHNlcnZpY2VzID0ge31cbiAgICBmcy5yZWFkZGlyU3luYyhkaXIpLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihkaXIsIGZpbGUsIGZpbGVOYW1lKVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKXNlcnZpY2VzW2ZpbGVdID0gcmVxdWlyZShmaWxlUGF0aClcbiAgICB9KVxuICAgIC8vIENPTlNPTEUuZGVidWcoXCJnZXRBbGxTZXJ2aWNlc0NvbmZpZ0Zyb21EaXJcIixzZXJ2aWNlcylcbiAgICByZXR1cm4gc2VydmljZXNcbiAgfSxcbiAgc2V0U2hhcmVkQ29uZmlnIChzZXJ2aWNlc1Jvb3REaXIsIHNlcnZpY2UsIGNvbmZpZywgZGF0YSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB2YXIgZmlsZVBhdGggPSBwYXRoLmpvaW4oc2VydmljZXNSb290RGlyLCBzZXJ2aWNlLCBjb25maWcpXG4gICAgICBqc29uZmlsZS53cml0ZUZpbGUoZmlsZVBhdGggKyAnLmpzb24nLCBkYXRhLCAoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICByZXNvbHZlKGRhdGEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG4gIGdldFNoYXJlZENvbmZpZyAoc2VydmljZXNSb290RGlyKSB7XG4gICAgcmV0dXJuIChzZXJ2aWNlLCBjb25maWcgPSAnc2VydmljZScsIGV4Y2x1ZGUsIGFzT2JqID0gZmFsc2UpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChzZXJ2aWNlID09PSAnKicpIHtcbiAgICAgICAgICBmcy5yZWFkZGlyKHNlcnZpY2VzUm9vdERpciwgKGVyciwgZGlyQ29udGVudHMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICAgICAgdmFyIGFsbEZpbGVQcm9taXNlcyA9IFtdXG4gICAgICAgICAgICBkaXJDb250ZW50cy5mb3JFYWNoKHNlcnZpY2VOYW1lID0+IHtcbiAgICAgICAgICAgICAgaWYgKGV4Y2x1ZGUgPT09IHNlcnZpY2VOYW1lKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oc2VydmljZXNSb290RGlyLCBzZXJ2aWNlTmFtZSwgY29uZmlnKVxuICAgICAgICAgICAgICBhbGxGaWxlUHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAganNvbmZpbGUucmVhZEZpbGUoZmlsZVBhdGggKyAnLmpzb24nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgICAgICAgICAgIGRhdGEgPSBkZXJlZihkYXRhLCB7YmFzZUZvbGRlcjogcGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgZmFpbE9uTWlzc2luZzogdHJ1ZX0pXG4gICAgICAgICAgICAgICAgICBkYXRhLnNlcnZpY2VOYW1lID0gc2VydmljZU5hbWVcbiAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGRhdGEpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoYWxsRmlsZVByb21pc2VzKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgIGlmIChhc09iaikge1xuICAgICAgICAgICAgICAgIHZhciBvYmpSZXN1bHQgPSB7fVxuICAgICAgICAgICAgICAgIHJlc3VsdC5mb3JFYWNoKHNlcnZpY2VBcnJheSA9PiBvYmpSZXN1bHRbc2VydmljZUFycmF5LnNlcnZpY2VOYW1lXSA9IHNlcnZpY2VBcnJheSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShvYmpSZXN1bHQpXG4gICAgICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdClcbiAgICAgICAgICAgIH0pLmNhdGNoKHJlamVjdClcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBmaWxlUGF0aCA9IHBhdGguam9pbihzZXJ2aWNlc1Jvb3REaXIsIHNlcnZpY2UsIGNvbmZpZylcbiAgICAgICAgICBqc29uZmlsZS5yZWFkRmlsZShmaWxlUGF0aCArICcuanNvbicsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICAgICAgZGF0YSA9IGRlcmVmKGRhdGEsIHtiYXNlRm9sZGVyOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCBmYWlsT25NaXNzaW5nOiB0cnVlfSlcbiAgICAgICAgICAgIGRhdGEuc2VydmljZU5hbWUgPSBzZXJ2aWNlXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkYXRhKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9LFxuICBlcnJvclRocm93LFxuICB2YWxpZGF0ZU1ldGhvZEZyb21Db25maWcgKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIG1ldGhvZHNDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkKSB7XG4gICAgaWYgKCFtZXRob2RzQ29uZmlnIHx8ICFtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdIHx8ICFtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdW3NjaGVtYUZpZWxkXSkgZXJyb3JUaHJvdyhgTWV0aG9kIHZhbGlkYXRpb24gcHJvYmxlbSA6JHttZXRob2ROYW1lfSAke3NjaGVtYUZpZWxkfSBpbiAke21ldGhvZHNDb25maWdGaWxlfWApXG4gICAgdmFyIHNjaGVtYSA9IG1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV1bc2NoZW1hRmllbGRdXG4gICAgdmFyIHZhbGlkYXRlID0gYWp2LmNvbXBpbGUoc2NoZW1hKVxuICAgIHZhciB2YWxpZCA9IHZhbGlkYXRlKGRhdGEpXG4gICAgaWYgKCF2YWxpZCkge1xuICAgICAgZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKSgndmFsaWRhdGlvbiBlcnJvcnMnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnMsIG1ldGhvZHNDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkfSlcbiAgICB9XG4gICAgcmV0dXJuIGRhdGFcbiAgfSxcbiAgZ2V0QXNQcm9taXNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0cnkgeyByZXR1cm4gcmVzb2x2ZSh2YWx1ZSgpKSB9IGNhdGNoIChlcnJvcikgeyByZXR1cm4gcmVqZWN0KGVycm9yKSB9XG4gICAgICAgIH0gZWxzZSByZXR1cm4gcmVzb2x2ZSh2YWx1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcbiAgYXJnc092ZXJ3cml0ZSAoKSB7XG4gICAgdmFyIG92ZXJ3cml0ZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgdmFyIG9yaWdpbmFsUGFja2FnZSA9IGFyZ3VtZW50c1swXVxuICAgIHZhciBtb2RpZmllZFBhY2thZ2UgPSB7fVxuICAgIGZvciAodmFyIGkgaW4gb3JpZ2luYWxQYWNrYWdlKSB7XG4gICAgICBtb2RpZmllZFBhY2thZ2VbaV0gPSBmdW5jdGlvbiBwYWNrYWdlQXJnc092ZXJ3cml0ZSAoKSB7XG4gICAgICAgIHZhciBtb2RpZmllZEFyZ3VtZW50cyA9IE9iamVjdC5hc3NpZ24oYXJndW1lbnRzLCBvdmVyd3JpdGVBcmdzKVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxQYWNrYWdlW2ldLmFwcGx5KHRoaXMsIG1vZGlmaWVkQXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW9kaWZpZWRQYWNrYWdlXG4gIH0sXG4gIGNoZWNrUmVxdWlyZWQgKFBST1BTX09CSiwgUEFDS0FHRSkge1xuICAgIHZhciBwcm9wc05hbWVzID0gT2JqZWN0LmtleXMoUFJPUFNfT0JKKVxuICAgIHByb3BzTmFtZXMuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcbiAgICAgIGlmICghUFJPUFNfT0JKW3Byb3BOYW1lXSkge1xuICAgICAgICB0aHJvdyBgUEFDS0FHRToke1BBQ0tBR0V9ICBSZXF1aXJlZCBEZXBlbmRlbmN5ICR7cHJvcE5hbWV9IGlzIG1pc3NpbmdgXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgY2hlY2tSZXF1aXJlZEZpbGVzIChGSUxFUywgUEFDS0FHRSkge1xuICAgIEZJTEVTLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhmaWxlKSkge1xuICAgICAgICB0aHJvdyBgUmVxdWlyZWQgRmlsZSAke2ZpbGV9IGlzIG1pc3NpbmdgXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgaXNFbXB0eUFycmF5IChhcnJheSkge1xuICAgIHJldHVybiAoIWFycmF5IHx8ICFhcnJheS5sZW5ndGgpXG4gIH0sXG4gIGdldENvbnNvbGUsXG4gIGFkZE9iamVjdENvbHVtbjogZnVuY3Rpb24gKG9iamVjdHNBcnJheSwgY29sdW1uTmFtZSwgdmFsdWVzQXJyYXkpIHtcbiAgICB2YXIgYWRkQ29sdW1zID0gKHZhbCwgaW5kZXgpID0+IFIubWVyZ2Uoe1xuICAgICAgW2NvbHVtbk5hbWVdOiB2YWx1ZXNBcnJheVtpbmRleF1cbiAgICB9LCB2YWwpXG4gICAgcmV0dXJuIFIuYWRkSW5kZXgoUi5tYXApKGFkZENvbHVtcywgb2JqZWN0c0FycmF5KVxuICB9XG5cbn1cbiJdfQ==