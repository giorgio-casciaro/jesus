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
var getConsoleInitTime = Date.now();
var getConsole = function getConsole() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { debug: false, log: true, error: true, warn: true };
  var serviceName = arguments[1];
  var serviceId = arguments[2];
  var pack = arguments[3];
  var logDir = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  var initTime = getConsoleInitTime;
  return {
    profile: function profile(name) {
      if (!console.profile) return false;console.profile(name);
    },
    profileEnd: function profileEnd(name) {
      if (!console.profile) return false;console.profileEnd(name);
    },
    error: function error() {
      if (!config.error) return false;var args = Array.prototype.slice.call(arguments);args[0] = args[0].message || args[0];console.error.apply(this, [serviceName, Date.now() - initTime, serviceId, pack].concat(args));console.trace();
    },
    log: function log() {
      if (!config.log) return false;
      var args = Array.prototype.slice.call(arguments);
      console.log.apply(this, [serviceName, Date.now() - initTime, serviceId, pack].concat(args));
    },
    debug: function debug() {
      if (!config.debug || typeof console.debug !== "function") return false;var args = Array.prototype.slice.call(arguments);console.debug.apply(this, ['%c' + serviceName, 'background: ' + stringToColor(serviceName) + '; color: white; display: block;', Date.now() - initTime, serviceId, pack].concat(args));
    },
    warn: function warn() {
      if (!config.warn || !console.warn) return false;var args = Array.prototype.slice.call(arguments);console.warn.apply(this, [serviceName, Date.now() - initTime, serviceId, pack].concat(args));
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
                // jsonfile.readFile(filePath + '.json', (err, data) => {
                //   if (err) return reject(err)
                //   data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
                //   data.serviceName = serviceName
                //   return resolve(data)
                // })
                var data = require(filePath + '.json');
                data = deref(data, { baseFolder: path.dirname(filePath), failOnMissing: true });
                if (data instanceof Error) reject(data);
                data.serviceName = serviceName;
                resolve(data);
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
          console.debug("getSharedConfig", { filePath: filePath });
          // jsonfile.readFile(filePath + '.json', (err, data) => {
          //   if (err) return reject(err)
          //   data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
          //   data.serviceName = service
          //   return resolve(data)
          // })
          var data = require(filePath + '.json');
          data = deref(data, { baseFolder: path.dirname(filePath), failOnMissing: true });
          if (data instanceof Error) reject(data);
          data.serviceName = service;
          resolve(data);
        }
      });
    };
  },

  errorThrow: errorThrow,
  validateMethodFromConfig: function validateMethodFromConfig(errorThrow, serviceName, serviceId, methodsConfig, methodName, data, schemaField) {
    if (!methodsConfig || !methodsConfig[methodName] || !methodsConfig[methodName][schemaField]) errorThrow('Method validation problem :' + methodName + ' ' + schemaField + ' in ' + methodsConfigFile);
    var schema = methodsConfig[methodName][schemaField];
    var validate = ajv.compile(schema);
    var valid = validate(data);
    if (!valid) {
      errorThrow('validation errors', { errors: validate.errors, methodsConfig: methodsConfig, methodName: methodName, data: data, schemaField: schemaField });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImplc3VzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImZzIiwicGF0aCIsImRlcmVmIiwianNvbmZpbGUiLCJhanYiLCJhbGxFcnJvcnMiLCJwcm9jZXNzIiwib24iLCJyZWFzb24iLCJwcm9taXNlIiwiY29uc29sZSIsImVycm9yIiwidHJhY2UiLCJQQUNLQUdFIiwic3RyaW5nVG9Db2xvciIsInN0cmluZyIsInZhbHVlIiwic3BsaXQiLCJtYXAiLCJjaGFyIiwiY2hhckNvZGVBdCIsInJlZHVjZSIsImEiLCJiIiwiZ2V0Q29uc29sZUluaXRUaW1lIiwiRGF0ZSIsIm5vdyIsImdldENvbnNvbGUiLCJjb25maWciLCJkZWJ1ZyIsImxvZyIsIndhcm4iLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsInBhY2siLCJsb2dEaXIiLCJpbml0VGltZSIsInByb2ZpbGUiLCJuYW1lIiwicHJvZmlsZUVuZCIsImFyZ3MiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImFyZ3VtZW50cyIsIm1lc3NhZ2UiLCJhcHBseSIsImNvbmNhdCIsImVycm9yVGhyb3ciLCJtc2ciLCJkYXRhIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEFsbFNlcnZpY2VzQ29uZmlnRnJvbURpciIsImRpciIsImZpbGVOYW1lIiwic2VydmljZXMiLCJyZWFkZGlyU3luYyIsImZvckVhY2giLCJmaWxlUGF0aCIsImpvaW4iLCJmaWxlIiwiZXhpc3RzU3luYyIsInNldFNoYXJlZENvbmZpZyIsInNlcnZpY2VzUm9vdERpciIsInNlcnZpY2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIndyaXRlRmlsZSIsImVyciIsImdldFNoYXJlZENvbmZpZyIsImV4Y2x1ZGUiLCJhc09iaiIsInJlYWRkaXIiLCJkaXJDb250ZW50cyIsImFsbEZpbGVQcm9taXNlcyIsInB1c2giLCJiYXNlRm9sZGVyIiwiZGlybmFtZSIsImZhaWxPbk1pc3NpbmciLCJFcnJvciIsImFsbCIsInRoZW4iLCJvYmpSZXN1bHQiLCJyZXN1bHQiLCJzZXJ2aWNlQXJyYXkiLCJjYXRjaCIsInZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyIsIm1ldGhvZHNDb25maWciLCJtZXRob2ROYW1lIiwic2NoZW1hRmllbGQiLCJtZXRob2RzQ29uZmlnRmlsZSIsInNjaGVtYSIsInZhbGlkYXRlIiwiY29tcGlsZSIsInZhbGlkIiwiZXJyb3JzIiwiZ2V0QXNQcm9taXNlIiwiYXJnc092ZXJ3cml0ZSIsIm92ZXJ3cml0ZUFyZ3MiLCJvcmlnaW5hbFBhY2thZ2UiLCJtb2RpZmllZFBhY2thZ2UiLCJpIiwicGFja2FnZUFyZ3NPdmVyd3JpdGUiLCJtb2RpZmllZEFyZ3VtZW50cyIsIk9iamVjdCIsImFzc2lnbiIsImNoZWNrUmVxdWlyZWQiLCJQUk9QU19PQkoiLCJwcm9wc05hbWVzIiwia2V5cyIsInByb3BOYW1lIiwiY2hlY2tSZXF1aXJlZEZpbGVzIiwiRklMRVMiLCJpc0VtcHR5QXJyYXkiLCJhcnJheSIsImxlbmd0aCIsImFkZE9iamVjdENvbHVtbiIsIm9iamVjdHNBcnJheSIsImNvbHVtbk5hbWUiLCJ2YWx1ZXNBcnJheSIsImFkZENvbHVtcyIsInZhbCIsImluZGV4IiwibWVyZ2UiLCJhZGRJbmRleCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQU1BLElBQUlDLFFBQVEsT0FBUixDQUFWO0FBQ0EsSUFBTUMsS0FBS0QsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNRSxPQUFPRixRQUFRLE1BQVIsQ0FBYjtBQUNBLElBQUlHLFFBQVFILFFBQVEsd0JBQVIsQ0FBWjtBQUNBLElBQUlJLFdBQVdKLFFBQVEsVUFBUixDQUFmO0FBQ0E7QUFDQSxJQUFJSyxNQUFNTCxRQUFRLEtBQVIsRUFBZSxFQUFDTSxXQUFXLElBQVosRUFBZixDQUFWO0FBQ0E7QUFDQTtBQUNBQyxRQUFRQyxFQUFSLENBQVcsb0JBQVgsRUFBaUMsVUFBQ0MsTUFBRCxFQUFTQyxPQUFULEVBQXFCO0FBQ3BEQyxVQUFRQyxLQUFSLENBQWMsNkJB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IiwiZmlsZSI6Implc3VzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFIgPSByZXF1aXJlKCdyYW1kYScpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBkZXJlZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWRlcmVmLXN5bmMnKVxudmFyIGpzb25maWxlID0gcmVxdWlyZSgnanNvbmZpbGUnKVxuLy8gdmFyIG5vcm1hbGlzZSA9IHJlcXVpcmUoJ2Fqdi1lcnJvci1tZXNzYWdlcycpXG52YXIgYWp2ID0gcmVxdWlyZSgnYWp2Jykoe2FsbEVycm9yczogdHJ1ZX0pXG4vLyB2YXIgc291cmNlTWFwU3VwcG9ydCA9IHJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpXG4vLyBzb3VyY2VNYXBTdXBwb3J0Lmluc3RhbGwoKVxucHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgKHJlYXNvbiwgcHJvbWlzZSkgPT4ge1xuICBjb25zb2xlLmVycm9yKCd1bmhhbmRsZWRSZWplY3Rpb24gUmVhc29uOiAnLCBwcm9taXNlLCByZWFzb24pXG4gIGNvbnNvbGUudHJhY2UocmVhc29uKVxufSlcblxuY29uc3QgUEFDS0FHRSA9ICdqZXN1cydcbmNvbnN0IHN0cmluZ1RvQ29sb3IgPSAoc3RyaW5nKSA9PiB7XG4gIHZhciB2YWx1ZSA9IHN0cmluZy5zcGxpdCgnJykubWFwKChjaGFyKSA9PiBjaGFyLmNoYXJDb2RlQXQoMCkgKiAyKS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKVxuICByZXR1cm4gYGhzbCgkeyh2YWx1ZSkgJSAyNTV9LDgwJSwzMCUpYFxufVxudmFyIGdldENvbnNvbGVJbml0VGltZT1EYXRlLm5vdygpXG52YXIgZ2V0Q29uc29sZSA9IChjb25maWcgPSB7ZGVidWc6IGZhbHNlLCBsb2c6IHRydWUsIGVycm9yOiB0cnVlLCB3YXJuOiB0cnVlfSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaywgbG9nRGlyPWZhbHNlKSA9PiB7XG4gIHZhciBpbml0VGltZT1nZXRDb25zb2xlSW5pdFRpbWVcbiAgcmV0dXJuIHtcbiAgICBwcm9maWxlIChuYW1lKSB7IGlmICghY29uc29sZS5wcm9maWxlKSByZXR1cm4gZmFsc2U7IGNvbnNvbGUucHJvZmlsZShuYW1lKSB9LFxuICAgIHByb2ZpbGVFbmQgKG5hbWUpIHsgaWYgKCFjb25zb2xlLnByb2ZpbGUpIHJldHVybiBmYWxzZTsgY29uc29sZS5wcm9maWxlRW5kKG5hbWUpIH0sXG4gICAgZXJyb3IgKCkgeyBpZiAoIWNvbmZpZy5lcnJvcikgcmV0dXJuIGZhbHNlOyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7YXJnc1swXT1hcmdzWzBdLm1lc3NhZ2V8fGFyZ3NbMF07Y29uc29sZS5lcnJvci5hcHBseSh0aGlzLCBbc2VydmljZU5hbWUsRGF0ZS5ub3coKS1pbml0VGltZSwgc2VydmljZUlkLCBwYWNrXS5jb25jYXQoYXJncykpO2NvbnNvbGUudHJhY2UoKSB9LFxuICAgIGxvZyAoKSB7XG4gICAgICBpZiAoIWNvbmZpZy5sb2cpIHJldHVybiBmYWxzZTtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIGNvbnNvbGUubG9nLmFwcGx5KHRoaXMsIFtzZXJ2aWNlTmFtZSxEYXRlLm5vdygpLWluaXRUaW1lLCBzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSlcbiAgICB9LFxuICAgIGRlYnVnICgpIHsgaWYgKCFjb25maWcuZGVidWd8fHR5cGVvZihjb25zb2xlLmRlYnVnKSE9PVwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlOyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IGNvbnNvbGUuZGVidWcuYXBwbHkodGhpcywgWyclYycgKyBzZXJ2aWNlTmFtZSwgJ2JhY2tncm91bmQ6ICcgKyBzdHJpbmdUb0NvbG9yKHNlcnZpY2VOYW1lKSArICc7IGNvbG9yOiB3aGl0ZTsgZGlzcGxheTogYmxvY2s7JywgRGF0ZS5ub3coKS1pbml0VGltZSxzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSkgfSxcbiAgICB3YXJuICgpIHsgaWYgKCFjb25maWcud2Fybnx8IWNvbnNvbGUud2FybikgcmV0dXJuIGZhbHNlOyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IGNvbnNvbGUud2Fybi5hcHBseSh0aGlzLCBbc2VydmljZU5hbWUsIERhdGUubm93KCktaW5pdFRpbWUsc2VydmljZUlkLCBwYWNrXS5jb25jYXQoYXJncykpIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlcnJvclRocm93IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSB7XG4gIHJldHVybiAobXNnLCBkYXRhKSA9PiB7XG4gICAgZ2V0Q29uc29sZShmYWxzZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykud2Fybihtc2csIGRhdGEpXG4gICAgaWYgKGRhdGEgJiYgZGF0YS5lcnJvcikgdGhyb3cgZGF0YS5lcnJvclxuICAgIGVsc2UgdGhyb3cgbXNnXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEFsbFNlcnZpY2VzQ29uZmlnRnJvbURpciAoZGlyLCBmaWxlTmFtZSA9ICdtZXRob2RzLmpzb24nKSB7XG4gICAgdmFyIHNlcnZpY2VzID0ge31cbiAgICBmcy5yZWFkZGlyU3luYyhkaXIpLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihkaXIsIGZpbGUsIGZpbGVOYW1lKVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKXNlcnZpY2VzW2ZpbGVdID0gcmVxdWlyZShmaWxlUGF0aClcbiAgICB9KVxuICAgIC8vIENPTlNPTEUuZGVidWcoXCJnZXRBbGxTZXJ2aWNlc0NvbmZpZ0Zyb21EaXJcIixzZXJ2aWNlcylcbiAgICByZXR1cm4gc2VydmljZXNcbiAgfSxcbiAgc2V0U2hhcmVkQ29uZmlnIChzZXJ2aWNlc1Jvb3REaXIsIHNlcnZpY2UsIGNvbmZpZywgZGF0YSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB2YXIgZmlsZVBhdGggPSBwYXRoLmpvaW4oc2VydmljZXNSb290RGlyLCBzZXJ2aWNlLCBjb25maWcpXG4gICAgICBqc29uZmlsZS53cml0ZUZpbGUoZmlsZVBhdGggKyAnLmpzb24nLCBkYXRhLCAoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICByZXNvbHZlKGRhdGEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG4gIGdldFNoYXJlZENvbmZpZyAoc2VydmljZXNSb290RGlyKSB7XG4gICAgcmV0dXJuIChzZXJ2aWNlLCBjb25maWcgPSAnc2VydmljZScsIGV4Y2x1ZGUsIGFzT2JqID0gZmFsc2UpID0+IHtcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKHNlcnZpY2UgPT09ICcqJykge1xuICAgICAgICAgIGZzLnJlYWRkaXIoc2VydmljZXNSb290RGlyLCAoZXJyLCBkaXJDb250ZW50cykgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgICB2YXIgYWxsRmlsZVByb21pc2VzID0gW11cbiAgICAgICAgICAgIGRpckNvbnRlbnRzLmZvckVhY2goc2VydmljZU5hbWUgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXhjbHVkZSA9PT0gc2VydmljZU5hbWUpIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihzZXJ2aWNlc1Jvb3REaXIsIHNlcnZpY2VOYW1lLCBjb25maWcpXG4gICAgICAgICAgICAgIGFsbEZpbGVQcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBqc29uZmlsZS5yZWFkRmlsZShmaWxlUGF0aCArICcuanNvbicsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAvLyAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICAgICAgICAgIC8vICAgZGF0YSA9IGRlcmVmKGRhdGEsIHtiYXNlRm9sZGVyOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCBmYWlsT25NaXNzaW5nOiB0cnVlfSlcbiAgICAgICAgICAgICAgICAvLyAgIGRhdGEuc2VydmljZU5hbWUgPSBzZXJ2aWNlTmFtZVxuICAgICAgICAgICAgICAgIC8vICAgcmV0dXJuIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgICAgICAvLyB9KVxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVxdWlyZShmaWxlUGF0aCArICcuanNvbicpXG4gICAgICAgICAgICAgICAgZGF0YSA9IGRlcmVmKGRhdGEsIHtiYXNlRm9sZGVyOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCBmYWlsT25NaXNzaW5nOiB0cnVlfSlcbiAgICAgICAgICAgICAgICBpZihkYXRhIGluc3RhbmNlb2YgRXJyb3IpcmVqZWN0KGRhdGEpXG4gICAgICAgICAgICAgICAgZGF0YS5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBQcm9taXNlLmFsbChhbGxGaWxlUHJvbWlzZXMpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgaWYgKGFzT2JqKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9ialJlc3VsdCA9IHt9XG4gICAgICAgICAgICAgICAgcmVzdWx0LmZvckVhY2goc2VydmljZUFycmF5ID0+IG9ialJlc3VsdFtzZXJ2aWNlQXJyYXkuc2VydmljZU5hbWVdID0gc2VydmljZUFycmF5KVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG9ialJlc3VsdClcbiAgICAgICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KVxuICAgICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGZpbGVQYXRoID0gcGF0aC5qb2luKHNlcnZpY2VzUm9vdERpciwgc2VydmljZSwgY29uZmlnKVxuICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJnZXRTaGFyZWRDb25maWdcIix7ZmlsZVBhdGh9KVxuICAgICAgICAgIC8vIGpzb25maWxlLnJlYWRGaWxlKGZpbGVQYXRoICsgJy5qc29uJywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgIC8vICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgLy8gICBkYXRhID0gZGVyZWYoZGF0YSwge2Jhc2VGb2xkZXI6IHBhdGguZGlybmFtZShmaWxlUGF0aCksIGZhaWxPbk1pc3Npbmc6IHRydWV9KVxuICAgICAgICAgIC8vICAgZGF0YS5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VcbiAgICAgICAgICAvLyAgIHJldHVybiByZXNvbHZlKGRhdGEpXG4gICAgICAgICAgLy8gfSlcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlcXVpcmUoZmlsZVBhdGggKyAnLmpzb24nKVxuICAgICAgICAgIGRhdGEgPSBkZXJlZihkYXRhLCB7YmFzZUZvbGRlcjogcGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgZmFpbE9uTWlzc2luZzogdHJ1ZX0pXG4gICAgICAgICAgaWYoZGF0YSBpbnN0YW5jZW9mIEVycm9yKXJlamVjdChkYXRhKVxuICAgICAgICAgIGRhdGEuc2VydmljZU5hbWUgPSBzZXJ2aWNlXG4gICAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSxcbiAgZXJyb3JUaHJvdyxcbiAgdmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIChlcnJvclRocm93LHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIG1ldGhvZHNDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkKSB7XG4gICAgaWYgKCFtZXRob2RzQ29uZmlnIHx8ICFtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdIHx8ICFtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdW3NjaGVtYUZpZWxkXSkgZXJyb3JUaHJvdyhgTWV0aG9kIHZhbGlkYXRpb24gcHJvYmxlbSA6JHttZXRob2ROYW1lfSAke3NjaGVtYUZpZWxkfSBpbiAke21ldGhvZHNDb25maWdGaWxlfWApXG4gICAgdmFyIHNjaGVtYSA9IG1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV1bc2NoZW1hRmllbGRdXG4gICAgdmFyIHZhbGlkYXRlID0gYWp2LmNvbXBpbGUoc2NoZW1hKVxuICAgIHZhciB2YWxpZCA9IHZhbGlkYXRlKGRhdGEpXG4gICAgaWYgKCF2YWxpZCkge1xuICAgICAgZXJyb3JUaHJvdygndmFsaWRhdGlvbiBlcnJvcnMnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnMsIG1ldGhvZHNDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkfSlcbiAgICB9XG4gICAgcmV0dXJuIGRhdGFcbiAgfSxcbiAgZ2V0QXNQcm9taXNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0cnkgeyByZXR1cm4gcmVzb2x2ZSh2YWx1ZSgpKSB9IGNhdGNoIChlcnJvcikgeyByZXR1cm4gcmVqZWN0KGVycm9yKSB9XG4gICAgICAgIH0gZWxzZSByZXR1cm4gcmVzb2x2ZSh2YWx1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcbiAgYXJnc092ZXJ3cml0ZSAoKSB7XG4gICAgdmFyIG92ZXJ3cml0ZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgdmFyIG9yaWdpbmFsUGFja2FnZSA9IGFyZ3VtZW50c1swXVxuICAgIHZhciBtb2RpZmllZFBhY2thZ2UgPSB7fVxuICAgIGZvciAodmFyIGkgaW4gb3JpZ2luYWxQYWNrYWdlKSB7XG4gICAgICBtb2RpZmllZFBhY2thZ2VbaV0gPSBmdW5jdGlvbiBwYWNrYWdlQXJnc092ZXJ3cml0ZSAoKSB7XG4gICAgICAgIHZhciBtb2RpZmllZEFyZ3VtZW50cyA9IE9iamVjdC5hc3NpZ24oYXJndW1lbnRzLCBvdmVyd3JpdGVBcmdzKVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxQYWNrYWdlW2ldLmFwcGx5KHRoaXMsIG1vZGlmaWVkQXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW9kaWZpZWRQYWNrYWdlXG4gIH0sXG4gIGNoZWNrUmVxdWlyZWQgKFBST1BTX09CSiwgUEFDS0FHRSkge1xuICAgIHZhciBwcm9wc05hbWVzID0gT2JqZWN0LmtleXMoUFJPUFNfT0JKKVxuICAgIHByb3BzTmFtZXMuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcbiAgICAgIGlmICghUFJPUFNfT0JKW3Byb3BOYW1lXSkge1xuICAgICAgICB0aHJvdyBgUEFDS0FHRToke1BBQ0tBR0V9ICBSZXF1aXJlZCBEZXBlbmRlbmN5ICR7cHJvcE5hbWV9IGlzIG1pc3NpbmdgXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgY2hlY2tSZXF1aXJlZEZpbGVzIChGSUxFUywgUEFDS0FHRSkge1xuICAgIEZJTEVTLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhmaWxlKSkge1xuICAgICAgICB0aHJvdyBgUmVxdWlyZWQgRmlsZSAke2ZpbGV9IGlzIG1pc3NpbmdgXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgaXNFbXB0eUFycmF5IChhcnJheSkge1xuICAgIHJldHVybiAoIWFycmF5IHx8ICFhcnJheS5sZW5ndGgpXG4gIH0sXG4gIGdldENvbnNvbGUsXG4gIGFkZE9iamVjdENvbHVtbjogZnVuY3Rpb24gKG9iamVjdHNBcnJheSwgY29sdW1uTmFtZSwgdmFsdWVzQXJyYXkpIHtcbiAgICB2YXIgYWRkQ29sdW1zID0gKHZhbCwgaW5kZXgpID0+IFIubWVyZ2Uoe1xuICAgICAgW2NvbHVtbk5hbWVdOiB2YWx1ZXNBcnJheVtpbmRleF1cbiAgICB9LCB2YWwpXG4gICAgcmV0dXJuIFIuYWRkSW5kZXgoUi5tYXApKGFkZENvbHVtcywgb2JqZWN0c0FycmF5KVxuICB9XG5cbn1cbiJdfQ==