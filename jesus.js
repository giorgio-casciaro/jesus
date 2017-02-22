'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var R = require('ramda');
var fs = require('fs');
var path = require('path');
var deref = require('json-schema-deref-sync');
// var normalise = require('ajv-error-messages')
var ajv = require('ajv')({ allErrors: true });
var sourceMapSupport = require('source-map-support');
sourceMapSupport.install();
var PACKAGE = 'jesus';
var stringToColor = function stringToColor(string) {
  var value = string.split('').map(function (char) {
    return char.charCodeAt(0) * 2;
  }).reduce(function (a, b) {
    return a + b;
  }, 0);
  return 'hsl(' + value % 255 + ',80%,30%)';
};
var LOG = function LOG(serviceName, serviceId, pack) {
  return {
    error: function error() {
      var args = Array.prototype.slice.call(arguments);console.error.apply(this, [serviceName, serviceId, pack].concat(args));
    },
    log: function log() {
      var args = Array.prototype.slice.call(arguments);console.log.apply(this, [serviceName, serviceId, pack].concat(args));
    },
    debug: function debug() {
      var args = Array.prototype.slice.call(arguments);console.debug.apply(this, ['%c' + serviceName, 'background: ' + stringToColor(serviceName) + '; color: white; display: block;', serviceId, pack].concat(args));
    },
    warn: function warn() {
      var args = Array.prototype.slice.call(arguments);console.warn.apply(this, [serviceName, serviceId, pack].concat(args));
    }
  };
};

function errorThrow(serviceName, serviceId, pack) {
  return function (msg, data) {
    LOG(serviceName, serviceId, pack).warn(msg, data);
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
    // LOG.debug("getAllServicesConfigFromDir",services)
    return services;
  },

  errorThrow: errorThrow,
  validateMethodFromConfig: function validateMethodFromConfig(serviceName, serviceId, apiConfigFile, apiMethod, data, schemaField) {
    // TO FIX ADD CACHE
    var apiConfigPath = path.dirname(apiConfigFile) + '/';
    var apiConfig = require(apiConfigFile);
    if (!apiConfig || !apiConfig[apiMethod] || !apiConfig[apiMethod][schemaField]) errorThrow('Method validation problem :' + apiMethod + ' ' + schemaField + ' in ' + apiConfigFile);
    var schema = deref(apiConfig[apiMethod][schemaField], { baseFolder: apiConfigPath, failOnMissing: true });
    LOG(serviceName, serviceId, PACKAGE).debug('validateMethodFromConfig schema', { apiConfig: apiConfig, apiMethod: apiMethod, schemaField: schemaField, apiConfigPath: apiConfigPath, schema: schema });
    var validate = ajv.compile(schema);
    var valid = validate(data);

    if (!valid) {
      errorThrow(serviceName, serviceId, PACKAGE)('validation errors', { errors: validate.errors, apiConfigFile: apiConfigFile, apiMethod: apiMethod, data: data, schemaField: schemaField });
    }
    return data;
  },

  getAsPromise: function getAsPromise(value) {
    return new Promise(function (resolve, reject) {
      Promise.resolve(value).then(function (value) {
        if (typeof value === 'function') {
          try {
            resolve(value());
          } catch (error) {
            reject(error);
          }
        } else resolve(value);
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
  checkRequired: function checkRequired(PROPS_OBJ) {
    var propsNames = Object.keys(PROPS_OBJ);
    propsNames.forEach(function (propName) {
      if (!PROPS_OBJ[propName]) {
        throw 'Required Dependency ' + propName + ' is missing';
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

  LOG: LOG,
  addObjectColumn: function addObjectColumn(objectsArray, columnName, valuesArray) {
    var addColums = function addColums(val, index) {
      return R.merge(_defineProperty({}, columnName, valuesArray[index]), val);
    };
    return R.addIndex(R.map)(addColums, objectsArray);
  }

};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImplc3VzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImZzIiwicGF0aCIsImRlcmVmIiwiYWp2IiwiYWxsRXJyb3JzIiwic291cmNlTWFwU3VwcG9ydCIsImluc3RhbGwiLCJQQUNLQUdFIiwic3RyaW5nVG9Db2xvciIsInN0cmluZyIsInZhbHVlIiwic3BsaXQiLCJtYXAiLCJjaGFyIiwiY2hhckNvZGVBdCIsInJlZHVjZSIsImEiLCJiIiwiTE9HIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwYWNrIiwiZXJyb3IiLCJhcmdzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJjb25zb2xlIiwiYXBwbHkiLCJjb25jYXQiLCJsb2ciLCJkZWJ1ZyIsIndhcm4iLCJlcnJvclRocm93IiwibXNnIiwiZGF0YSIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRBbGxTZXJ2aWNlc0NvbmZpZ0Zyb21EaXIiLCJkaXIiLCJmaWxlTmFtZSIsInNlcnZpY2VzIiwicmVhZGRpclN5bmMiLCJmb3JFYWNoIiwiZmlsZVBhdGgiLCJqb2luIiwiZmlsZSIsImV4aXN0c1N5bmMiLCJ2YWxpZGF0ZU1ldGhvZEZyb21Db25maWciLCJhcGlDb25maWdGaWxlIiwiYXBpTWV0aG9kIiwic2NoZW1hRmllbGQiLCJhcGlDb25maWdQYXRoIiwiZGlybmFtZSIsImFwaUNvbmZpZyIsInNjaGVtYSIsImJhc2VGb2xkZXIiLCJmYWlsT25NaXNzaW5nIiwidmFsaWRhdGUiLCJjb21waWxlIiwidmFsaWQiLCJlcnJvcnMiLCJnZXRBc1Byb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInRoZW4iLCJhcmdzT3ZlcndyaXRlIiwib3ZlcndyaXRlQXJncyIsIm9yaWdpbmFsUGFja2FnZSIsIm1vZGlmaWVkUGFja2FnZSIsImkiLCJwYWNrYWdlQXJnc092ZXJ3cml0ZSIsIm1vZGlmaWVkQXJndW1lbnRzIiwiT2JqZWN0IiwiYXNzaWduIiwiY2hlY2tSZXF1aXJlZCIsIlBST1BTX09CSiIsInByb3BzTmFtZXMiLCJrZXlzIiwicHJvcE5hbWUiLCJjaGVja1JlcXVpcmVkRmlsZXMiLCJGSUxFUyIsImlzRW1wdHlBcnJheSIsImFycmF5IiwibGVuZ3RoIiwiYWRkT2JqZWN0Q29sdW1uIiwib2JqZWN0c0FycmF5IiwiY29sdW1uTmFtZSIsInZhbHVlc0FycmF5IiwiYWRkQ29sdW1zIiwidmFsIiwiaW5kZXgiLCJtZXJnZSIsImFkZEluZGV4Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsSUFBSUMsUUFBUSxPQUFSLENBQVY7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1FLE9BQU9GLFFBQVEsTUFBUixDQUFiO0FBQ0EsSUFBSUcsUUFBUUgsUUFBUSx3QkFBUixDQUFaO0FBQ0E7QUFDQSxJQUFJSSxNQUFNSixRQUFRLEtBQVIsRUFBZSxFQUFDSyxXQUFXLElBQVosRUFBZixDQUFWO0FBQ0EsSUFBSUMsbUJBQW1CTixRQUFRLG9CQUFSLENBQXZCO0FBQ0FNLGlCQUFpQkMsT0FBakI7QUFDQSxJQUFNQyxVQUFVLE9BQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFDQyxNQUFELEVBQVk7QUFDaEMsTUFBSUMsUUFBUUQsT0FBT0UsS0FBUCxDQUFhLEVBQWIsRUFBaUJDLEdBQWpCLENBQXFCLFVBQUNDLElBQUQ7QUFBQSxXQUFVQSxLQUFLQyxVQUFMLENBQWdCLENBQWhCLElBQW1CLENBQTdCO0FBQUEsR0FBckIsRUFBcURDLE1BQXJELENBQTRELFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFdBQVVELElBQUlDLENBQWQ7QUFBQSxHQUE1RCxFQUE2RSxDQUE3RSxDQUFaO0FBQ0Esa0JBQWVQLEtBQUQsR0FBVSxHQUF4QjtBQUNELENBSEQ7QUFJQSxJQUFJUSxNQUFNLFNBQU5BLEdBQU0sQ0FBQ0MsV0FBRCxFQUFjQyxTQUFkLEVBQXlCQyxJQUF6QixFQUFrQztBQUMxQyxTQUFPO0FBQ0xD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dkI7QUFDRDtBQUNGLEtBSkQ7QUFLRCxHQTdEYztBQThEZnFDLGNBOURlLHdCQThEREMsS0E5REMsRUE4RE07QUFDbkIsV0FBUSxDQUFDQSxLQUFELElBQVUsQ0FBQ0EsTUFBTUMsTUFBekI7QUFDRCxHQWhFYzs7QUFpRWZyRSxVQWpFZTtBQWtFZnNFLG1CQUFpQix5QkFBVUMsWUFBVixFQUF3QkMsVUFBeEIsRUFBb0NDLFdBQXBDLEVBQWlEO0FBQ2hFLFFBQUlDLFlBQVksU0FBWkEsU0FBWSxDQUFDQyxHQUFELEVBQU1DLEtBQU47QUFBQSxhQUFnQmhHLEVBQUVpRyxLQUFGLHFCQUM3QkwsVUFENkIsRUFDaEJDLFlBQVlHLEtBQVosQ0FEZ0IsR0FFN0JELEdBRjZCLENBQWhCO0FBQUEsS0FBaEI7QUFHQSxXQUFPL0YsRUFBRWtHLFFBQUYsQ0FBV2xHLEVBQUVjLEdBQWIsRUFBa0JnRixTQUFsQixFQUE2QkgsWUFBN0IsQ0FBUDtBQUNEOztBQXZFYyxDQUFqQiIsImZpbGUiOiJqZXN1cy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBSID0gcmVxdWlyZSgncmFtZGEnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgZGVyZWYgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1kZXJlZi1zeW5jJylcbi8vIHZhciBub3JtYWxpc2UgPSByZXF1aXJlKCdhanYtZXJyb3ItbWVzc2FnZXMnKVxudmFyIGFqdiA9IHJlcXVpcmUoJ2FqdicpKHthbGxFcnJvcnM6IHRydWV9KVxudmFyIHNvdXJjZU1hcFN1cHBvcnQgPSByZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKVxuc291cmNlTWFwU3VwcG9ydC5pbnN0YWxsKClcbmNvbnN0IFBBQ0tBR0UgPSAnamVzdXMnXG5jb25zdCBzdHJpbmdUb0NvbG9yID0gKHN0cmluZykgPT4ge1xuICB2YXIgdmFsdWUgPSBzdHJpbmcuc3BsaXQoJycpLm1hcCgoY2hhcikgPT4gY2hhci5jaGFyQ29kZUF0KDApKjIpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApXG4gIHJldHVybiBgaHNsKCR7KHZhbHVlKSAlIDI1NX0sODAlLDMwJSlgXG59XG52YXIgTE9HID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IHtcbiAgcmV0dXJuIHtcbiAgICBlcnJvciAoKSB7IHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTsgY29uc29sZS5lcnJvci5hcHBseSh0aGlzLCBbc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFja10uY29uY2F0KGFyZ3MpKSB9LFxuICAgIGxvZyAoKSB7IHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTsgY29uc29sZS5sb2cuYXBwbHkodGhpcywgW3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSkgfSxcbiAgICBkZWJ1ZyAoKSB7IHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTsgY29uc29sZS5kZWJ1Zy5hcHBseSh0aGlzLCBbJyVjJyArIHNlcnZpY2VOYW1lLCAnYmFja2dyb3VuZDogJyArIHN0cmluZ1RvQ29sb3Ioc2VydmljZU5hbWUpICsgJzsgY29sb3I6IHdoaXRlOyBkaXNwbGF5OiBibG9jazsnLCBzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSkgfSxcbiAgICB3YXJuICgpIHsgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpOyBjb25zb2xlLndhcm4uYXBwbHkodGhpcywgW3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSkgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGVycm9yVGhyb3cgKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spIHtcbiAgcmV0dXJuIChtc2csIGRhdGEpID0+IHtcbiAgICBMT0coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykud2Fybihtc2csIGRhdGEpXG4gICAgaWYgKGRhdGEmJmRhdGEuZXJyb3IpIHRocm93IGRhdGEuZXJyb3JcbiAgICBlbHNlIHRocm93IG1zZ1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyIChkaXIsIGZpbGVOYW1lID0gJ21ldGhvZHMuanNvbicpIHtcbiAgICB2YXIgc2VydmljZXMgPSB7fVxuICAgIGZzLnJlYWRkaXJTeW5jKGRpcikuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGRpciwgZmlsZSwgZmlsZU5hbWUpXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpc2VydmljZXNbZmlsZV0gPSByZXF1aXJlKGZpbGVQYXRoKVxuICAgIH0pXG4gICAgLy8gTE9HLmRlYnVnKFwiZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyXCIsc2VydmljZXMpXG4gICAgcmV0dXJuIHNlcnZpY2VzXG4gIH0sXG4gIGVycm9yVGhyb3csXG4gIHZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgYXBpQ29uZmlnRmlsZSwgYXBpTWV0aG9kLCBkYXRhLCBzY2hlbWFGaWVsZCkge1xuICAgICAgLy8gVE8gRklYIEFERCBDQUNIRVxuICAgIHZhciBhcGlDb25maWdQYXRoID0gcGF0aC5kaXJuYW1lKGFwaUNvbmZpZ0ZpbGUpICsgJy8nXG4gICAgdmFyIGFwaUNvbmZpZyA9IHJlcXVpcmUoYXBpQ29uZmlnRmlsZSlcbiAgICBpZiAoIWFwaUNvbmZpZyB8fCAhYXBpQ29uZmlnW2FwaU1ldGhvZF0gfHwgIWFwaUNvbmZpZ1thcGlNZXRob2RdW3NjaGVtYUZpZWxkXSkgZXJyb3JUaHJvdyhgTWV0aG9kIHZhbGlkYXRpb24gcHJvYmxlbSA6JHthcGlNZXRob2R9ICR7c2NoZW1hRmllbGR9IGluICR7YXBpQ29uZmlnRmlsZX1gKVxuICAgIHZhciBzY2hlbWEgPSBkZXJlZihhcGlDb25maWdbYXBpTWV0aG9kXVtzY2hlbWFGaWVsZF0sIHtiYXNlRm9sZGVyOiBhcGlDb25maWdQYXRoLCBmYWlsT25NaXNzaW5nOiB0cnVlfSlcbiAgICBMT0coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSkuZGVidWcoJ3ZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyBzY2hlbWEnLCB7YXBpQ29uZmlnLCBhcGlNZXRob2QsIHNjaGVtYUZpZWxkLCBhcGlDb25maWdQYXRoLCBzY2hlbWF9KVxuICAgIHZhciB2YWxpZGF0ZSA9IGFqdi5jb21waWxlKHNjaGVtYSlcbiAgICB2YXIgdmFsaWQgPSB2YWxpZGF0ZShkYXRhKVxuXG4gICAgaWYgKCF2YWxpZCkge1xuICAgICAgZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKSgndmFsaWRhdGlvbiBlcnJvcnMnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnMsIGFwaUNvbmZpZ0ZpbGUsIGFwaU1ldGhvZCwgZGF0YSwgc2NoZW1hRmllbGR9KVxuICAgIH1cbiAgICByZXR1cm4gZGF0YVxuICB9LFxuICBnZXRBc1Byb21pc2U6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgKHZhbHVlKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRyeSB7IHJlc29sdmUodmFsdWUoKSkgfSBjYXRjaCAoZXJyb3IpIHsgcmVqZWN0KGVycm9yKSB9XG4gICAgICAgIH0gZWxzZSByZXNvbHZlKHZhbHVlKVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuICBhcmdzT3ZlcndyaXRlICgpIHtcbiAgICB2YXIgb3ZlcndyaXRlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICB2YXIgb3JpZ2luYWxQYWNrYWdlID0gYXJndW1lbnRzWzBdXG4gICAgdmFyIG1vZGlmaWVkUGFja2FnZSA9IHt9XG4gICAgZm9yICh2YXIgaSBpbiBvcmlnaW5hbFBhY2thZ2UpIHtcbiAgICAgIG1vZGlmaWVkUGFja2FnZVtpXSA9IGZ1bmN0aW9uIHBhY2thZ2VBcmdzT3ZlcndyaXRlICgpIHtcbiAgICAgICAgdmFyIG1vZGlmaWVkQXJndW1lbnRzID0gT2JqZWN0LmFzc2lnbihhcmd1bWVudHMsIG92ZXJ3cml0ZUFyZ3MpXG4gICAgICAgIHJldHVybiBvcmlnaW5hbFBhY2thZ2VbaV0uYXBwbHkodGhpcywgbW9kaWZpZWRBcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb2RpZmllZFBhY2thZ2VcbiAgfSxcbiAgY2hlY2tSZXF1aXJlZCAoUFJPUFNfT0JKKSB7XG4gICAgdmFyIHByb3BzTmFtZXMgPSBPYmplY3Qua2V5cyhQUk9QU19PQkopXG4gICAgcHJvcHNOYW1lcy5mb3JFYWNoKChwcm9wTmFtZSkgPT4ge1xuICAgICAgaWYgKCFQUk9QU19PQkpbcHJvcE5hbWVdKSB7XG4gICAgICAgIHRocm93IGBSZXF1aXJlZCBEZXBlbmRlbmN5ICR7cHJvcE5hbWV9IGlzIG1pc3NpbmdgXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgY2hlY2tSZXF1aXJlZEZpbGVzIChGSUxFUywgUEFDS0FHRSkge1xuICAgIEZJTEVTLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhmaWxlKSkge1xuICAgICAgICB0aHJvdyBgUmVxdWlyZWQgRmlsZSAke2ZpbGV9IGlzIG1pc3NpbmdgXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgaXNFbXB0eUFycmF5IChhcnJheSkge1xuICAgIHJldHVybiAoIWFycmF5IHx8ICFhcnJheS5sZW5ndGgpXG4gIH0sXG4gIExPRyxcbiAgYWRkT2JqZWN0Q29sdW1uOiBmdW5jdGlvbiAob2JqZWN0c0FycmF5LCBjb2x1bW5OYW1lLCB2YWx1ZXNBcnJheSkge1xuICAgIHZhciBhZGRDb2x1bXMgPSAodmFsLCBpbmRleCkgPT4gUi5tZXJnZSh7XG4gICAgICBbY29sdW1uTmFtZV06IHZhbHVlc0FycmF5W2luZGV4XVxuICAgIH0sIHZhbClcbiAgICByZXR1cm4gUi5hZGRJbmRleChSLm1hcCkoYWRkQ29sdW1zLCBvYmplY3RzQXJyYXkpXG4gIH1cblxufVxuIl19