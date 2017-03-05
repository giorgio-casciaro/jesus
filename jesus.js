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
      if (!config.debug || !console.debug) return false;var args = Array.prototype.slice.call(arguments);console.debug.apply(this, ['%c' + serviceName, 'background: ' + stringToColor(serviceName) + '; color: white; display: block;', serviceId, pack].concat(args));
    },
    warn: function warn() {
      if (!config.warn || !console.warn) return false;var args = Array.prototype.slice.call(arguments);console.warn.apply(this, [serviceName, serviceId, pack].concat(args));
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
          // jsonfile.readFile(filePath + '.json', (err, data) => {
          //   if (err) return reject(err)
          //   data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
          //   data.serviceName = service
          //   return resolve(data)
          // })
          var data = require(filePath + '.json');
          data = deref(data, { baseFolder: path.dirname(filePath), failOnMissing: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImplc3VzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImZzIiwicGF0aCIsImRlcmVmIiwianNvbmZpbGUiLCJhanYiLCJhbGxFcnJvcnMiLCJwcm9jZXNzIiwib24iLCJyZWFzb24iLCJwcm9taXNlIiwiY29uc29sZSIsImVycm9yIiwidHJhY2UiLCJQQUNLQUdFIiwic3RyaW5nVG9Db2xvciIsInN0cmluZyIsInZhbHVlIiwic3BsaXQiLCJtYXAiLCJjaGFyIiwiY2hhckNvZGVBdCIsInJlZHVjZSIsImEiLCJiIiwiZ2V0Q29uc29sZSIsImNvbmZpZyIsImRlYnVnIiwibG9nIiwid2FybiIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwicGFjayIsInByb2ZpbGUiLCJuYW1lIiwicHJvZmlsZUVuZCIsImFyZ3MiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImFyZ3VtZW50cyIsImFwcGx5IiwiY29uY2F0IiwiZXJyb3JUaHJvdyIsIm1zZyIsImRhdGEiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyIiwiZGlyIiwiZmlsZU5hbWUiLCJzZXJ2aWNlcyIsInJlYWRkaXJTeW5jIiwiZm9yRWFjaCIsImZpbGVQYXRoIiwiam9pbiIsImZpbGUiLCJleGlzdHNTeW5jIiwic2V0U2hhcmVkQ29uZmlnIiwic2VydmljZXNSb290RGlyIiwic2VydmljZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwid3JpdGVGaWxlIiwiZXJyIiwiZ2V0U2hhcmVkQ29uZmlnIiwiZXhjbHVkZSIsImFzT2JqIiwicmVhZGRpciIsImRpckNvbnRlbnRzIiwiYWxsRmlsZVByb21pc2VzIiwicHVzaCIsImJhc2VGb2xkZXIiLCJkaXJuYW1lIiwiZmFpbE9uTWlzc2luZyIsImFsbCIsInRoZW4iLCJvYmpSZXN1bHQiLCJyZXN1bHQiLCJzZXJ2aWNlQXJyYXkiLCJjYXRjaCIsInZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyIsIm1ldGhvZHNDb25maWciLCJtZXRob2ROYW1lIiwic2NoZW1hRmllbGQiLCJtZXRob2RzQ29uZmlnRmlsZSIsInNjaGVtYSIsInZhbGlkYXRlIiwiY29tcGlsZSIsInZhbGlkIiwiZXJyb3JzIiwiZ2V0QXNQcm9taXNlIiwiYXJnc092ZXJ3cml0ZSIsIm92ZXJ3cml0ZUFyZ3MiLCJvcmlnaW5hbFBhY2thZ2UiLCJtb2RpZmllZFBhY2thZ2UiLCJpIiwicGFja2FnZUFyZ3NPdmVyd3JpdGUiLCJtb2RpZmllZEFyZ3VtZW50cyIsIk9iamVjdCIsImFzc2lnbiIsImNoZWNrUmVxdWlyZWQiLCJQUk9QU19PQkoiLCJwcm9wc05hbWVzIiwia2V5cyIsInByb3BOYW1lIiwiY2hlY2tSZXF1aXJlZEZpbGVzIiwiRklMRVMiLCJpc0VtcHR5QXJyYXkiLCJhcnJheSIsImxlbmd0aCIsImFkZE9iamVjdENvbHVtbiIsIm9iamVjdHNBcnJheSIsImNvbHVtbk5hbWUiLCJ2YWx1ZXNBcnJheSIsImFkZENvbHVtcyIsInZhbCIsImluZGV4IiwibWVyZ2UiLCJhZGRJbmRleCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQU1BLElBQUlDLFFBQVEsT0FBUixDQUFWO0FBQ0EsSUFBTUMsS0FBS0QsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNRSxPQUFPRixRQUFRLE1BQVIsQ0FBYjtBQUNBLElBQUlHLFFBQVFILFFBQVEsd0JBQVIsQ0FBWjtBQUNBLElBQUlJLFdBQVdKLFFBQVEsVUFBUixDQUFmO0FBQ0E7QUFDQSxJQUFJSyxNQUFNTCxRQUFRLEtBQVIsRUFBZSxFQUFDTSxXQUFXLElBQVosRUFBZixDQUFWO0FBQ0E7QUFDQTtBQUNBQyxRQUFRQyxFQUFSLENBQVcsb0JBQVgsRUFBaUMsVUFBQ0MsTUFBRCxFQUFTQyxPQUFULEVBQXFCO0FBQ3BEQyxVQUFRQyxLQUFSLENBQWMsNkJBQWQsRUFBNkNGLE9BQTdDLEVBQXNERCxNQUF0RDtBQUNBRSxVQUFRRSxLQUFSLENBQWNKLE1BQWQ7QUFDRCxDQUhEOztBQUtB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QVEsQ0FBQ0EsS0FBRCxJQUFVLENBQUNBLE1BQU1DLE1BQXpCO0FBQ0QsR0FuSGM7O0FBb0hmdkYsd0JBcEhlO0FBcUhmd0YsbUJBQWlCLHlCQUFVQyxZQUFWLEVBQXdCQyxVQUF4QixFQUFvQ0MsV0FBcEMsRUFBaUQ7QUFDaEUsUUFBSUMsWUFBWSxTQUFaQSxTQUFZLENBQUNDLEdBQUQsRUFBTUMsS0FBTjtBQUFBLGFBQWdCeEgsRUFBRXlILEtBQUYscUJBQzdCTCxVQUQ2QixFQUNoQkMsWUFBWUcsS0FBWixDQURnQixHQUU3QkQsR0FGNkIsQ0FBaEI7QUFBQSxLQUFoQjtBQUdBLFdBQU92SCxFQUFFMEgsUUFBRixDQUFXMUgsRUFBRW9CLEdBQWIsRUFBa0JrRyxTQUFsQixFQUE2QkgsWUFBN0IsQ0FBUDtBQUNEOztBQTFIYyxDQUFqQiIsImZpbGUiOiJqZXN1cy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBSID0gcmVxdWlyZSgncmFtZGEnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgZGVyZWYgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1kZXJlZi1zeW5jJylcbnZhciBqc29uZmlsZSA9IHJlcXVpcmUoJ2pzb25maWxlJylcbi8vIHZhciBub3JtYWxpc2UgPSByZXF1aXJlKCdhanYtZXJyb3ItbWVzc2FnZXMnKVxudmFyIGFqdiA9IHJlcXVpcmUoJ2FqdicpKHthbGxFcnJvcnM6IHRydWV9KVxuLy8gdmFyIHNvdXJjZU1hcFN1cHBvcnQgPSByZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKVxuLy8gc291cmNlTWFwU3VwcG9ydC5pbnN0YWxsKClcbnByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIChyZWFzb24sIHByb21pc2UpID0+IHtcbiAgY29uc29sZS5lcnJvcigndW5oYW5kbGVkUmVqZWN0aW9uIFJlYXNvbjogJywgcHJvbWlzZSwgcmVhc29uKVxuICBjb25zb2xlLnRyYWNlKHJlYXNvbilcbn0pXG5cbmNvbnN0IFBBQ0tBR0UgPSAnamVzdXMnXG5jb25zdCBzdHJpbmdUb0NvbG9yID0gKHN0cmluZykgPT4ge1xuICB2YXIgdmFsdWUgPSBzdHJpbmcuc3BsaXQoJycpLm1hcCgoY2hhcikgPT4gY2hhci5jaGFyQ29kZUF0KDApICogMikucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMClcbiAgcmV0dXJuIGBoc2woJHsodmFsdWUpICUgMjU1fSw4MCUsMzAlKWBcbn1cblxudmFyIGdldENvbnNvbGUgPSAoY29uZmlnID0ge2RlYnVnOiBmYWxzZSwgbG9nOiB0cnVlLCBlcnJvcjogdHJ1ZSwgd2FybjogdHJ1ZX0sIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IHtcbiAgcmV0dXJuIHtcbiAgICBwcm9maWxlIChuYW1lKSB7IGlmICghY29uc29sZS5wcm9maWxlKSByZXR1cm4gZmFsc2U7IGNvbnNvbGUucHJvZmlsZShuYW1lKSB9LFxuICAgIHByb2ZpbGVFbmQgKG5hbWUpIHsgaWYgKCFjb25zb2xlLnByb2ZpbGUpIHJldHVybiBmYWxzZTsgY29uc29sZS5wcm9maWxlRW5kKG5hbWUpIH0sXG4gICAgZXJyb3IgKCkgeyBpZiAoIWNvbmZpZy5lcnJvcikgcmV0dXJuIGZhbHNlOyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IGNvbnNvbGUuZXJyb3IuYXBwbHkodGhpcywgW3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSkgfSxcbiAgICBsb2cgKCkgeyBpZiAoIWNvbmZpZy5sb2cpIHJldHVybiBmYWxzZTsgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpOyBjb25zb2xlLmxvZy5hcHBseSh0aGlzLCBbc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFja10uY29uY2F0KGFyZ3MpKSB9LFxuICAgIGRlYnVnICgpIHsgaWYgKCFjb25maWcuZGVidWd8fCFjb25zb2xlLmRlYnVnKSByZXR1cm4gZmFsc2U7IHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTsgY29uc29sZS5kZWJ1Zy5hcHBseSh0aGlzLCBbJyVjJyArIHNlcnZpY2VOYW1lLCAnYmFja2dyb3VuZDogJyArIHN0cmluZ1RvQ29sb3Ioc2VydmljZU5hbWUpICsgJzsgY29sb3I6IHdoaXRlOyBkaXNwbGF5OiBibG9jazsnLCBzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSkgfSxcbiAgICB3YXJuICgpIHsgaWYgKCFjb25maWcud2Fybnx8IWNvbnNvbGUud2FybikgcmV0dXJuIGZhbHNlOyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IGNvbnNvbGUud2Fybi5hcHBseSh0aGlzLCBbc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFja10uY29uY2F0KGFyZ3MpKSB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZXJyb3JUaHJvdyAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykge1xuICByZXR1cm4gKG1zZywgZGF0YSkgPT4ge1xuICAgIGdldENvbnNvbGUoZmFsc2UsIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spLndhcm4obXNnLCBkYXRhKVxuICAgIGlmIChkYXRhICYmIGRhdGEuZXJyb3IpIHRocm93IGRhdGEuZXJyb3JcbiAgICBlbHNlIHRocm93IG1zZ1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRBbGxTZXJ2aWNlc0NvbmZpZ0Zyb21EaXIgKGRpciwgZmlsZU5hbWUgPSAnbWV0aG9kcy5qc29uJykge1xuICAgIHZhciBzZXJ2aWNlcyA9IHt9XG4gICAgZnMucmVhZGRpclN5bmMoZGlyKS5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZGlyLCBmaWxlLCBmaWxlTmFtZSlcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSlzZXJ2aWNlc1tmaWxlXSA9IHJlcXVpcmUoZmlsZVBhdGgpXG4gICAgfSlcbiAgICAvLyBDT05TT0xFLmRlYnVnKFwiZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyXCIsc2VydmljZXMpXG4gICAgcmV0dXJuIHNlcnZpY2VzXG4gIH0sXG4gIHNldFNoYXJlZENvbmZpZyAoc2VydmljZXNSb290RGlyLCBzZXJ2aWNlLCBjb25maWcsIGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIGZpbGVQYXRoID0gcGF0aC5qb2luKHNlcnZpY2VzUm9vdERpciwgc2VydmljZSwgY29uZmlnKVxuICAgICAganNvbmZpbGUud3JpdGVGaWxlKGZpbGVQYXRoICsgJy5qc29uJywgZGF0YSwgKGVycikgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuICBnZXRTaGFyZWRDb25maWcgKHNlcnZpY2VzUm9vdERpcikge1xuICAgIHJldHVybiAoc2VydmljZSwgY29uZmlnID0gJ3NlcnZpY2UnLCBleGNsdWRlLCBhc09iaiA9IGZhbHNlKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoc2VydmljZSA9PT0gJyonKSB7XG4gICAgICAgICAgZnMucmVhZGRpcihzZXJ2aWNlc1Jvb3REaXIsIChlcnIsIGRpckNvbnRlbnRzKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgICAgIHZhciBhbGxGaWxlUHJvbWlzZXMgPSBbXVxuICAgICAgICAgICAgZGlyQ29udGVudHMuZm9yRWFjaChzZXJ2aWNlTmFtZSA9PiB7XG4gICAgICAgICAgICAgIGlmIChleGNsdWRlID09PSBzZXJ2aWNlTmFtZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHNlcnZpY2VzUm9vdERpciwgc2VydmljZU5hbWUsIGNvbmZpZylcbiAgICAgICAgICAgICAgYWxsRmlsZVByb21pc2VzLnB1c2gobmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGpzb25maWxlLnJlYWRGaWxlKGZpbGVQYXRoICsgJy5qc29uJywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgICAgICAgLy8gICBkYXRhID0gZGVyZWYoZGF0YSwge2Jhc2VGb2xkZXI6IHBhdGguZGlybmFtZShmaWxlUGF0aCksIGZhaWxPbk1pc3Npbmc6IHRydWV9KVxuICAgICAgICAgICAgICAgIC8vICAgZGF0YS5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lXG4gICAgICAgICAgICAgICAgLy8gICByZXR1cm4gcmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSByZXF1aXJlKGZpbGVQYXRoICsgJy5qc29uJylcbiAgICAgICAgICAgICAgICBkYXRhID0gZGVyZWYoZGF0YSwge2Jhc2VGb2xkZXI6IHBhdGguZGlybmFtZShmaWxlUGF0aCksIGZhaWxPbk1pc3Npbmc6IHRydWV9KVxuICAgICAgICAgICAgICAgIGRhdGEuc2VydmljZU5hbWUgPSBzZXJ2aWNlTmFtZVxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoYWxsRmlsZVByb21pc2VzKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgIGlmIChhc09iaikge1xuICAgICAgICAgICAgICAgIHZhciBvYmpSZXN1bHQgPSB7fVxuICAgICAgICAgICAgICAgIHJlc3VsdC5mb3JFYWNoKHNlcnZpY2VBcnJheSA9PiBvYmpSZXN1bHRbc2VydmljZUFycmF5LnNlcnZpY2VOYW1lXSA9IHNlcnZpY2VBcnJheSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShvYmpSZXN1bHQpXG4gICAgICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdClcbiAgICAgICAgICAgIH0pLmNhdGNoKHJlamVjdClcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBmaWxlUGF0aCA9IHBhdGguam9pbihzZXJ2aWNlc1Jvb3REaXIsIHNlcnZpY2UsIGNvbmZpZylcbiAgICAgICAgICAvLyBqc29uZmlsZS5yZWFkRmlsZShmaWxlUGF0aCArICcuanNvbicsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAvLyAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICAgIC8vICAgZGF0YSA9IGRlcmVmKGRhdGEsIHtiYXNlRm9sZGVyOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCBmYWlsT25NaXNzaW5nOiB0cnVlfSlcbiAgICAgICAgICAvLyAgIGRhdGEuc2VydmljZU5hbWUgPSBzZXJ2aWNlXG4gICAgICAgICAgLy8gICByZXR1cm4gcmVzb2x2ZShkYXRhKVxuICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgdmFyIGRhdGEgPSByZXF1aXJlKGZpbGVQYXRoICsgJy5qc29uJylcbiAgICAgICAgICBkYXRhID0gZGVyZWYoZGF0YSwge2Jhc2VGb2xkZXI6IHBhdGguZGlybmFtZShmaWxlUGF0aCksIGZhaWxPbk1pc3Npbmc6IHRydWV9KVxuICAgICAgICAgIGRhdGEuc2VydmljZU5hbWUgPSBzZXJ2aWNlXG4gICAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSxcbiAgZXJyb3JUaHJvdyxcbiAgdmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIChlcnJvclRocm93LHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIG1ldGhvZHNDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkKSB7XG4gICAgaWYgKCFtZXRob2RzQ29uZmlnIHx8ICFtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdIHx8ICFtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdW3NjaGVtYUZpZWxkXSkgZXJyb3JUaHJvdyhgTWV0aG9kIHZhbGlkYXRpb24gcHJvYmxlbSA6JHttZXRob2ROYW1lfSAke3NjaGVtYUZpZWxkfSBpbiAke21ldGhvZHNDb25maWdGaWxlfWApXG4gICAgdmFyIHNjaGVtYSA9IG1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV1bc2NoZW1hRmllbGRdXG4gICAgdmFyIHZhbGlkYXRlID0gYWp2LmNvbXBpbGUoc2NoZW1hKVxuICAgIHZhciB2YWxpZCA9IHZhbGlkYXRlKGRhdGEpXG4gICAgaWYgKCF2YWxpZCkge1xuICAgICAgZXJyb3JUaHJvdygndmFsaWRhdGlvbiBlcnJvcnMnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnMsIG1ldGhvZHNDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkfSlcbiAgICB9XG4gICAgcmV0dXJuIGRhdGFcbiAgfSxcbiAgZ2V0QXNQcm9taXNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0cnkgeyByZXR1cm4gcmVzb2x2ZSh2YWx1ZSgpKSB9IGNhdGNoIChlcnJvcikgeyByZXR1cm4gcmVqZWN0KGVycm9yKSB9XG4gICAgICAgIH0gZWxzZSByZXR1cm4gcmVzb2x2ZSh2YWx1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcbiAgYXJnc092ZXJ3cml0ZSAoKSB7XG4gICAgdmFyIG92ZXJ3cml0ZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgdmFyIG9yaWdpbmFsUGFja2FnZSA9IGFyZ3VtZW50c1swXVxuICAgIHZhciBtb2RpZmllZFBhY2thZ2UgPSB7fVxuICAgIGZvciAodmFyIGkgaW4gb3JpZ2luYWxQYWNrYWdlKSB7XG4gICAgICBtb2RpZmllZFBhY2thZ2VbaV0gPSBmdW5jdGlvbiBwYWNrYWdlQXJnc092ZXJ3cml0ZSAoKSB7XG4gICAgICAgIHZhciBtb2RpZmllZEFyZ3VtZW50cyA9IE9iamVjdC5hc3NpZ24oYXJndW1lbnRzLCBvdmVyd3JpdGVBcmdzKVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxQYWNrYWdlW2ldLmFwcGx5KHRoaXMsIG1vZGlmaWVkQXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW9kaWZpZWRQYWNrYWdlXG4gIH0sXG4gIGNoZWNrUmVxdWlyZWQgKFBST1BTX09CSiwgUEFDS0FHRSkge1xuICAgIHZhciBwcm9wc05hbWVzID0gT2JqZWN0LmtleXMoUFJPUFNfT0JKKVxuICAgIHByb3BzTmFtZXMuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcbiAgICAgIGlmICghUFJPUFNfT0JKW3Byb3BOYW1lXSkge1xuICAgICAgICB0aHJvdyBgUEFDS0FHRToke1BBQ0tBR0V9ICBSZXF1aXJlZCBEZXBlbmRlbmN5ICR7cHJvcE5hbWV9IGlzIG1pc3NpbmdgXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgY2hlY2tSZXF1aXJlZEZpbGVzIChGSUxFUywgUEFDS0FHRSkge1xuICAgIEZJTEVTLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhmaWxlKSkge1xuICAgICAgICB0aHJvdyBgUmVxdWlyZWQgRmlsZSAke2ZpbGV9IGlzIG1pc3NpbmdgXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgaXNFbXB0eUFycmF5IChhcnJheSkge1xuICAgIHJldHVybiAoIWFycmF5IHx8ICFhcnJheS5sZW5ndGgpXG4gIH0sXG4gIGdldENvbnNvbGUsXG4gIGFkZE9iamVjdENvbHVtbjogZnVuY3Rpb24gKG9iamVjdHNBcnJheSwgY29sdW1uTmFtZSwgdmFsdWVzQXJyYXkpIHtcbiAgICB2YXIgYWRkQ29sdW1zID0gKHZhbCwgaW5kZXgpID0+IFIubWVyZ2Uoe1xuICAgICAgW2NvbHVtbk5hbWVdOiB2YWx1ZXNBcnJheVtpbmRleF1cbiAgICB9LCB2YWwpXG4gICAgcmV0dXJuIFIuYWRkSW5kZXgoUi5tYXApKGFkZENvbHVtcywgb2JqZWN0c0FycmF5KVxuICB9XG5cbn1cbiJdfQ==