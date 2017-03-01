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

  getConsole: getConsole,
  addObjectColumn: function addObjectColumn(objectsArray, columnName, valuesArray) {
    var addColums = function addColums(val, index) {
      return R.merge(_defineProperty({}, columnName, valuesArray[index]), val);
    };
    return R.addIndex(R.map)(addColums, objectsArray);
  }

};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImplc3VzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImZzIiwicGF0aCIsImRlcmVmIiwianNvbmZpbGUiLCJhanYiLCJhbGxFcnJvcnMiLCJwcm9jZXNzIiwib24iLCJyZWFzb24iLCJwcm9taXNlIiwiY29uc29sZSIsImVycm9yIiwidHJhY2UiLCJQQUNLQUdFIiwic3RyaW5nVG9Db2xvciIsInN0cmluZyIsInZhbHVlIiwic3BsaXQiLCJtYXAiLCJjaGFyIiwiY2hhckNvZGVBdCIsInJlZHVjZSIsImEiLCJiIiwiZ2V0Q29uc29sZSIsImNvbmZpZyIsImRlYnVnIiwibG9nIiwid2FybiIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsInByb2ZpbGUiLCJuYW1lIiwicHJvZmlsZUVuZCIsImFyZ3MiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImFyZ3VtZW50cyIsImFwcGx5IiwiY29uY2F0IiwiZXJyb3JUaHJvdyIsIm1zZyIsImRhdGEiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyIiwiZGlyIiwiZmlsZU5hbWUiLCJzZXJ2aWNlcyIsInJlYWRkaXJTeW5jIiwiZm9yRWFjaCIsImZpbGVQYXRoIiwiam9pbiIsImZpbGUiLCJleGlzdHNTeW5jIiwic2V0U2hhcmVkQ29uZmlnIiwic2VydmljZXNSb290RGlyIiwic2VydmljZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwid3JpdGVGaWxlIiwiZXJyIiwiZ2V0U2hhcmVkQ29uZmlnIiwiZXhjbHVkZSIsImFzT2JqIiwicmVhZGRpciIsImRpckNvbnRlbnRzIiwiYWxsRmlsZVByb21pc2VzIiwicHVzaCIsInJlYWRGaWxlIiwiYmFzZUZvbGRlciIsImRpcm5hbWUiLCJmYWlsT25NaXNzaW5nIiwiYWxsIiwidGhlbiIsIm9ialJlc3VsdCIsInJlc3VsdCIsInNlcnZpY2VBcnJheSIsImNhdGNoIiwidmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIiwibWV0aG9kc0NvbmZpZyIsIm1ldGhvZE5hbWUiLCJzY2hlbWFGaWVsZCIsIm1ldGhvZHNDb25maWdGaWxlIiwic2NoZW1hIiwidmFsaWRhdGUiLCJjb21waWxlIiwidmFsaWQiLCJlcnJvcnMiLCJnZXRBc1Byb21pc2UiLCJhcmdzT3ZlcndyaXRlIiwib3ZlcndyaXRlQXJncyIsIm9yaWdpbmFsUGFja2FnZSIsIm1vZGlmaWVkUGFja2FnZSIsImkiLCJwYWNrYWdlQXJnc092ZXJ3cml0ZSIsIm1vZGlmaWVkQXJndW1lbnRzIiwiT2JqZWN0IiwiYXNzaWduIiwiY2hlY2tSZXF1aXJlZCIsIlBST1BTX09CSiIsInByb3BzTmFtZXMiLCJrZXlzIiwicHJvcE5hbWUiLCJjaGVja1JlcXVpcmVkRmlsZXMiLCJGSUxFUyIsImlzRW1wdHlBcnJheSIsImFycmF5IiwibGVuZ3RoIiwiYWRkT2JqZWN0Q29sdW1uIiwib2JqZWN0c0FycmF5IiwiY29sdW1uTmFtZSIsInZhbHVlc0FycmF5IiwiYWRkQ29sdW1zIiwidmFsIiwiaW5kZXgiLCJtZXJnZSIsImFkZEluZGV4Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsSUFBSUMsUUFBUSxPQUFSLENBQVY7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1FLE9BQU9GLFFBQVEsTUFBUixDQUFiO0FBQ0EsSUFBSUcsUUFBUUgsUUFBUSx3QkFBUixDQUFaO0FBQ0EsSUFBSUksV0FBV0osUUFBUSxVQUFSLENBQWY7QUFDQTtBQUNBLElBQUlLLE1BQU1MLFFBQVEsS0FBUixFQUFlLEVBQUNNLFdBQVcsSUFBWixFQUFmLENBQVY7QUFDQTtBQUNBO0FBQ0FDLFFBQVFDLEVBQVIsQ0FBVyxvQkFBWCxFQUFpQyxVQUFDQyxNQUFELEVBQVNDLE9BQVQsRUFBcUI7QUFDcERDLFVBQVFDLEtBQVIsQ0FBYyw2QkFBZCxFQUE2Q0YsT0FBN0MsRUFBc0RELE1BQXREO0FBQ0FFLFVBQVFFLEtBQVIsQ0FBY0osTUFBZDtBQUNE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MEI7QUFDeEIsaUNBQXVCQSxJQUF2QjtBQUNEO0FBQ0YsS0FKRDtBQUtELEdBeEdjO0FBeUdmc0QsY0F6R2Usd0JBeUdEQyxLQXpHQyxFQXlHTTtBQUNuQixXQUFRLENBQUNBLEtBQUQsSUFBVSxDQUFDQSxNQUFNQyxNQUF6QjtBQUNELEdBM0djOztBQTRHZnhGLHdCQTVHZTtBQTZHZnlGLG1CQUFpQix5QkFBVUMsWUFBVixFQUF3QkMsVUFBeEIsRUFBb0NDLFdBQXBDLEVBQWlEO0FBQ2hFLFFBQUlDLFlBQVksU0FBWkEsU0FBWSxDQUFDQyxHQUFELEVBQU1DLEtBQU47QUFBQSxhQUFnQnpILEVBQUUwSCxLQUFGLHFCQUM3QkwsVUFENkIsRUFDaEJDLFlBQVlHLEtBQVosQ0FEZ0IsR0FFN0JELEdBRjZCLENBQWhCO0FBQUEsS0FBaEI7QUFHQSxXQUFPeEgsRUFBRTJILFFBQUYsQ0FBVzNILEVBQUVvQixHQUFiLEVBQWtCbUcsU0FBbEIsRUFBNkJILFlBQTdCLENBQVA7QUFDRDs7QUFsSGMsQ0FBakIiLCJmaWxlIjoiamVzdXMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGRlcmVmID0gcmVxdWlyZSgnanNvbi1zY2hlbWEtZGVyZWYtc3luYycpXG52YXIganNvbmZpbGUgPSByZXF1aXJlKCdqc29uZmlsZScpXG4vLyB2YXIgbm9ybWFsaXNlID0gcmVxdWlyZSgnYWp2LWVycm9yLW1lc3NhZ2VzJylcbnZhciBhanYgPSByZXF1aXJlKCdhanYnKSh7YWxsRXJyb3JzOiB0cnVlfSlcbi8vIHZhciBzb3VyY2VNYXBTdXBwb3J0ID0gcmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0Jylcbi8vIHNvdXJjZU1hcFN1cHBvcnQuaW5zdGFsbCgpXG5wcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwcm9taXNlKSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IoJ3VuaGFuZGxlZFJlamVjdGlvbiBSZWFzb246ICcsIHByb21pc2UsIHJlYXNvbilcbiAgY29uc29sZS50cmFjZShyZWFzb24pXG59KVxuXG5jb25zdCBQQUNLQUdFID0gJ2plc3VzJ1xuY29uc3Qgc3RyaW5nVG9Db2xvciA9IChzdHJpbmcpID0+IHtcbiAgdmFyIHZhbHVlID0gc3RyaW5nLnNwbGl0KCcnKS5tYXAoKGNoYXIpID0+IGNoYXIuY2hhckNvZGVBdCgwKSAqIDIpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApXG4gIHJldHVybiBgaHNsKCR7KHZhbHVlKSAlIDI1NX0sODAlLDMwJSlgXG59XG5cbnZhciBnZXRDb25zb2xlID0gKGNvbmZpZyA9IHtkZWJ1ZzogZmFsc2UsIGxvZzogdHJ1ZSwgZXJyb3I6IHRydWUsIHdhcm46IHRydWV9LCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcHJvZmlsZSAobmFtZSkgeyBpZiAoIWNvbnNvbGUucHJvZmlsZSkgcmV0dXJuIGZhbHNlOyBjb25zb2xlLnByb2ZpbGUobmFtZSkgfSxcbiAgICBwcm9maWxlRW5kIChuYW1lKSB7IGlmICghY29uc29sZS5wcm9maWxlKSByZXR1cm4gZmFsc2U7IGNvbnNvbGUucHJvZmlsZUVuZChuYW1lKSB9LFxuICAgIGVycm9yICgpIHsgaWYgKCFjb25maWcuZXJyb3IpIHJldHVybiBmYWxzZTsgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpOyBjb25zb2xlLmVycm9yLmFwcGx5KHRoaXMsIFtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrXS5jb25jYXQoYXJncykpIH0sXG4gICAgbG9nICgpIHsgaWYgKCFjb25maWcubG9nKSByZXR1cm4gZmFsc2U7IHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTsgY29uc29sZS5sb2cuYXBwbHkodGhpcywgW3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSkgfSxcbiAgICBkZWJ1ZyAoKSB7IGlmICghY29uZmlnLmRlYnVnKSByZXR1cm4gZmFsc2U7IHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTsgY29uc29sZS5kZWJ1Zy5hcHBseSh0aGlzLCBbJyVjJyArIHNlcnZpY2VOYW1lLCAnYmFja2dyb3VuZDogJyArIHN0cmluZ1RvQ29sb3Ioc2VydmljZU5hbWUpICsgJzsgY29sb3I6IHdoaXRlOyBkaXNwbGF5OiBibG9jazsnLCBzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSkgfSxcbiAgICB3YXJuICgpIHsgaWYgKCFjb25maWcud2FybikgcmV0dXJuIGZhbHNlOyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IGNvbnNvbGUud2Fybi5hcHBseSh0aGlzLCBbc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFja10uY29uY2F0KGFyZ3MpKSB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZXJyb3JUaHJvdyAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykge1xuICByZXR1cm4gKG1zZywgZGF0YSkgPT4ge1xuICAgIGdldENvbnNvbGUoZmFsc2UsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spLndhcm4obXNnLCBkYXRhKVxuICAgIGlmIChkYXRhICYmIGRhdGEuZXJyb3IpIHRocm93IGRhdGEuZXJyb3JcbiAgICBlbHNlIHRocm93IG1zZ1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRBbGxTZXJ2aWNlc0NvbmZpZ0Zyb21EaXIgKGRpciwgZmlsZU5hbWUgPSAnbWV0aG9kcy5qc29uJykge1xuICAgIHZhciBzZXJ2aWNlcyA9IHt9XG4gICAgZnMucmVhZGRpclN5bmMoZGlyKS5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZGlyLCBmaWxlLCBmaWxlTmFtZSlcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSlzZXJ2aWNlc1tmaWxlXSA9IHJlcXVpcmUoZmlsZVBhdGgpXG4gICAgfSlcbiAgICAvLyBDT05TT0xFLmRlYnVnKFwiZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyXCIsc2VydmljZXMpXG4gICAgcmV0dXJuIHNlcnZpY2VzXG4gIH0sXG4gIHNldFNoYXJlZENvbmZpZyAoc2VydmljZXNSb290RGlyLCBzZXJ2aWNlLCBjb25maWcsIGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIGZpbGVQYXRoID0gcGF0aC5qb2luKHNlcnZpY2VzUm9vdERpciwgc2VydmljZSwgY29uZmlnKVxuICAgICAganNvbmZpbGUud3JpdGVGaWxlKGZpbGVQYXRoICsgJy5qc29uJywgZGF0YSwgKGVycikgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuICBnZXRTaGFyZWRDb25maWcgKHNlcnZpY2VzUm9vdERpcikge1xuICAgIHJldHVybiAoc2VydmljZSwgY29uZmlnID0gJ3NlcnZpY2UnLCBleGNsdWRlLCBhc09iaiA9IGZhbHNlKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoc2VydmljZSA9PT0gJyonKSB7XG4gICAgICAgICAgZnMucmVhZGRpcihzZXJ2aWNlc1Jvb3REaXIsIChlcnIsIGRpckNvbnRlbnRzKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgICAgIHZhciBhbGxGaWxlUHJvbWlzZXMgPSBbXVxuICAgICAgICAgICAgZGlyQ29udGVudHMuZm9yRWFjaChzZXJ2aWNlTmFtZSA9PiB7XG4gICAgICAgICAgICAgIGlmIChleGNsdWRlID09PSBzZXJ2aWNlTmFtZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHNlcnZpY2VzUm9vdERpciwgc2VydmljZU5hbWUsIGNvbmZpZylcbiAgICAgICAgICAgICAgYWxsRmlsZVByb21pc2VzLnB1c2gobmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGpzb25maWxlLnJlYWRGaWxlKGZpbGVQYXRoICsgJy5qc29uJywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgICAgICAgICBkYXRhID0gZGVyZWYoZGF0YSwge2Jhc2VGb2xkZXI6IHBhdGguZGlybmFtZShmaWxlUGF0aCksIGZhaWxPbk1pc3Npbmc6IHRydWV9KVxuICAgICAgICAgICAgICAgICAgZGF0YS5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lXG4gICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFByb21pc2UuYWxsKGFsbEZpbGVQcm9taXNlcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICBpZiAoYXNPYmopIHtcbiAgICAgICAgICAgICAgICB2YXIgb2JqUmVzdWx0ID0ge31cbiAgICAgICAgICAgICAgICByZXN1bHQuZm9yRWFjaChzZXJ2aWNlQXJyYXkgPT4gb2JqUmVzdWx0W3NlcnZpY2VBcnJheS5zZXJ2aWNlTmFtZV0gPSBzZXJ2aWNlQXJyYXkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUob2JqUmVzdWx0KVxuICAgICAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpXG4gICAgICAgICAgICB9KS5jYXRjaChyZWplY3QpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgZmlsZVBhdGggPSBwYXRoLmpvaW4oc2VydmljZXNSb290RGlyLCBzZXJ2aWNlLCBjb25maWcpXG4gICAgICAgICAganNvbmZpbGUucmVhZEZpbGUoZmlsZVBhdGggKyAnLmpzb24nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgICAgIGRhdGEgPSBkZXJlZihkYXRhLCB7YmFzZUZvbGRlcjogcGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgZmFpbE9uTWlzc2luZzogdHJ1ZX0pXG4gICAgICAgICAgICBkYXRhLnNlcnZpY2VOYW1lID0gc2VydmljZVxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSxcbiAgZXJyb3JUaHJvdyxcbiAgdmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBtZXRob2RzQ29uZmlnLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZCkge1xuICAgIGlmICghbWV0aG9kc0NvbmZpZyB8fCAhbWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXSB8fCAhbWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXVtzY2hlbWFGaWVsZF0pIGVycm9yVGhyb3coYE1ldGhvZCB2YWxpZGF0aW9uIHByb2JsZW0gOiR7bWV0aG9kTmFtZX0gJHtzY2hlbWFGaWVsZH0gaW4gJHttZXRob2RzQ29uZmlnRmlsZX1gKVxuICAgIHZhciBzY2hlbWEgPSBtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdW3NjaGVtYUZpZWxkXVxuICAgIHZhciB2YWxpZGF0ZSA9IGFqdi5jb21waWxlKHNjaGVtYSlcbiAgICB2YXIgdmFsaWQgPSB2YWxpZGF0ZShkYXRhKVxuICAgIGlmICghdmFsaWQpIHtcbiAgICAgIGVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSkoJ3ZhbGlkYXRpb24gZXJyb3JzJywge2Vycm9yczogdmFsaWRhdGUuZXJyb3JzLCBtZXRob2RzQ29uZmlnLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZH0pXG4gICAgfVxuICAgIHJldHVybiBkYXRhXG4gIH0sXG4gIGdldEFzUHJvbWlzZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAodmFsdWUpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdHJ5IHsgcmV0dXJuIHJlc29sdmUodmFsdWUoKSkgfSBjYXRjaCAoZXJyb3IpIHsgcmV0dXJuIHJlamVjdChlcnJvcikgfVxuICAgICAgICB9IGVsc2UgcmV0dXJuIHJlc29sdmUodmFsdWUpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG4gIGFyZ3NPdmVyd3JpdGUgKCkge1xuICAgIHZhciBvdmVyd3JpdGVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgIHZhciBvcmlnaW5hbFBhY2thZ2UgPSBhcmd1bWVudHNbMF1cbiAgICB2YXIgbW9kaWZpZWRQYWNrYWdlID0ge31cbiAgICBmb3IgKHZhciBpIGluIG9yaWdpbmFsUGFja2FnZSkge1xuICAgICAgbW9kaWZpZWRQYWNrYWdlW2ldID0gZnVuY3Rpb24gcGFja2FnZUFyZ3NPdmVyd3JpdGUgKCkge1xuICAgICAgICB2YXIgbW9kaWZpZWRBcmd1bWVudHMgPSBPYmplY3QuYXNzaWduKGFyZ3VtZW50cywgb3ZlcndyaXRlQXJncylcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsUGFja2FnZVtpXS5hcHBseSh0aGlzLCBtb2RpZmllZEFyZ3VtZW50cylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vZGlmaWVkUGFja2FnZVxuICB9LFxuICBjaGVja1JlcXVpcmVkIChQUk9QU19PQkopIHtcbiAgICB2YXIgcHJvcHNOYW1lcyA9IE9iamVjdC5rZXlzKFBST1BTX09CSilcbiAgICBwcm9wc05hbWVzLmZvckVhY2goKHByb3BOYW1lKSA9PiB7XG4gICAgICBpZiAoIVBST1BTX09CSltwcm9wTmFtZV0pIHtcbiAgICAgICAgdGhyb3cgYFJlcXVpcmVkIERlcGVuZGVuY3kgJHtwcm9wTmFtZX0gaXMgbWlzc2luZ2BcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBjaGVja1JlcXVpcmVkRmlsZXMgKEZJTEVTLCBQQUNLQUdFKSB7XG4gICAgRklMRVMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGUpKSB7XG4gICAgICAgIHRocm93IGBSZXF1aXJlZCBGaWxlICR7ZmlsZX0gaXMgbWlzc2luZ2BcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBpc0VtcHR5QXJyYXkgKGFycmF5KSB7XG4gICAgcmV0dXJuICghYXJyYXkgfHwgIWFycmF5Lmxlbmd0aClcbiAgfSxcbiAgZ2V0Q29uc29sZSxcbiAgYWRkT2JqZWN0Q29sdW1uOiBmdW5jdGlvbiAob2JqZWN0c0FycmF5LCBjb2x1bW5OYW1lLCB2YWx1ZXNBcnJheSkge1xuICAgIHZhciBhZGRDb2x1bXMgPSAodmFsLCBpbmRleCkgPT4gUi5tZXJnZSh7XG4gICAgICBbY29sdW1uTmFtZV06IHZhbHVlc0FycmF5W2luZGV4XVxuICAgIH0sIHZhbClcbiAgICByZXR1cm4gUi5hZGRJbmRleChSLm1hcCkoYWRkQ29sdW1zLCBvYmplY3RzQXJyYXkpXG4gIH1cblxufVxuIl19