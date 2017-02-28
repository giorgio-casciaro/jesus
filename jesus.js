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
//process.on('unhandledRejection', (reason, promise) => console.error('unhandledRejection Reason: ', promise, reason))

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
    profile: function profile(name) {
      if (!console.profile) return false;console.profile(name);
    },
    profileEnd: function profileEnd(name) {
      if (!console.profile) return false;console.profileEnd(name);
    },
    error: function error() {
      var args = Array.prototype.slice.call(arguments);console.error.apply(this, [serviceName, serviceId, pack].concat(args));
    },
    log: function log() {
      var args = Array.prototype.slice.call(arguments);console.log.apply(this, [serviceName, serviceId, pack].concat(args));
    },
    debug: function debug() {
      if (!console.debug) return false;var args = Array.prototype.slice.call(arguments);console.debug.apply(this, ['%c' + serviceName, 'background: ' + stringToColor(serviceName) + '; color: white; display: block;', serviceId, pack].concat(args));
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
    // TO FIX ADD CACHE
    if (!methodsConfig || !methodsConfig[methodName] || !methodsConfig[methodName][schemaField]) errorThrow('Method validation problem :' + methodName + ' ' + schemaField + ' in ' + methodsConfigFile);
    var schema = methodsConfig[methodName][schemaField];
    LOG(serviceName, serviceId, PACKAGE).debug('validateMethodFromConfig schema', { methodsConfig: methodsConfig, methodName: methodName, schemaField: schemaField, schema: schema });
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

  LOG: LOG,
  addObjectColumn: function addObjectColumn(objectsArray, columnName, valuesArray) {
    var addColums = function addColums(val, index) {
      return R.merge(_defineProperty({}, columnName, valuesArray[index]), val);
    };
    return R.addIndex(R.map)(addColums, objectsArray);
  }

};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImplc3VzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImZzIiwicGF0aCIsImRlcmVmIiwianNvbmZpbGUiLCJhanYiLCJhbGxFcnJvcnMiLCJQQUNLQUdFIiwic3RyaW5nVG9Db2xvciIsInN0cmluZyIsInZhbHVlIiwic3BsaXQiLCJtYXAiLCJjaGFyIiwiY2hhckNvZGVBdCIsInJlZHVjZSIsImEiLCJiIiwiTE9HIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwYWNrIiwicHJvZmlsZSIsIm5hbWUiLCJjb25zb2xlIiwicHJvZmlsZUVuZCIsImVycm9yIiwiYXJncyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJjb25jYXQiLCJsb2ciLCJkZWJ1ZyIsIndhcm4iLCJlcnJvclRocm93IiwibXNnIiwiZGF0YSIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRBbGxTZXJ2aWNlc0NvbmZpZ0Zyb21EaXIiLCJkaXIiLCJmaWxlTmFtZSIsInNlcnZpY2VzIiwicmVhZGRpclN5bmMiLCJmb3JFYWNoIiwiZmlsZVBhdGgiLCJqb2luIiwiZmlsZSIsImV4aXN0c1N5bmMiLCJzZXRTaGFyZWRDb25maWciLCJzZXJ2aWNlc1Jvb3REaXIiLCJzZXJ2aWNlIiwiY29uZmlnIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ3cml0ZUZpbGUiLCJlcnIiLCJnZXRTaGFyZWRDb25maWciLCJleGNsdWRlIiwiYXNPYmoiLCJyZWFkZGlyIiwiZGlyQ29udGVudHMiLCJhbGxGaWxlUHJvbWlzZXMiLCJwdXNoIiwicmVhZEZpbGUiLCJiYXNlRm9sZGVyIiwiZGlybmFtZSIsImZhaWxPbk1pc3NpbmciLCJhbGwiLCJ0aGVuIiwib2JqUmVzdWx0IiwicmVzdWx0Iiwic2VydmljZUFycmF5IiwiY2F0Y2giLCJ2YWxpZGF0ZU1ldGhvZEZyb21Db25maWciLCJtZXRob2RzQ29uZmlnIiwibWV0aG9kTmFtZSIsInNjaGVtYUZpZWxkIiwibWV0aG9kc0NvbmZpZ0ZpbGUiLCJzY2hlbWEiLCJ2YWxpZGF0ZSIsImNvbXBpbGUiLCJ2YWxpZCIsImVycm9ycyIsImdldEFzUHJvbWlzZSIsImFyZ3NPdmVyd3JpdGUiLCJvdmVyd3JpdGVBcmdzIiwib3JpZ2luYWxQYWNrYWdlIiwibW9kaWZpZWRQYWNrYWdlIiwiaSIsInBhY2thZ2VBcmdzT3ZlcndyaXRlIiwibW9kaWZpZWRBcmd1bWVudHMiLCJPYmplY3QiLCJhc3NpZ24iLCJjaGVja1JlcXVpcmVkIiwiUFJPUFNfT0JKIiwicHJvcHNOYW1lcyIsImtleXMiLCJwcm9wTmFtZSIsImNoZWNrUmVxdWlyZWRGaWxlcyIsIkZJTEVTIiwiaXNFbXB0eUFycmF5IiwiYXJyYXkiLCJsZW5ndGgiLCJhZGRPYmplY3RDb2x1bW4iLCJvYmplY3RzQXJyYXkiLCJjb2x1bW5OYW1lIiwidmFsdWVzQXJyYXkiLCJhZGRDb2x1bXMiLCJ2YWwiLCJpbmRleCIsIm1lcmdlIiwiYWRkSW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFNQSxJQUFJQyxRQUFRLE9BQVIsQ0FBVjtBQUNBLElBQU1DLEtBQUtELFFBQVEsSUFBUixDQUFYO0FBQ0EsSUFBTUUsT0FBT0YsUUFBUSxNQUFSLENBQWI7QUFDQSxJQUFJRyxRQUFRSCxRQUFRLHdCQUFSLENBQVo7QUFDQSxJQUFJSSxXQUFXSixRQUFRLFVBQVIsQ0FBZjtBQUNBO0FBQ0EsSUFBSUssTUFBTUwsUUFBUSxLQUFSLEVBQWUsRUFBQ00sV0FBVyxJQUFaLEVBQWYsQ0FBVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFNQyxVQUFVLE9BQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFDQyxNQUFELEVBQVk7QUFDaEMsTUFBSUMsUUFBUUQsT0FBT0UsS0FBUCxDQUFhLEVBQWIsRUFBaUJDLEdBQWpCLENBQXFCLFVBQUNDLElBQUQ7QUFBQSxXQUFVQSxLQUFLQyxVQUFMLENBQWdCLENBQWhCLElBQXFCLENBQS9CO0FBQUEsR0FB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aEI7QUFBQSxLQUFoQjtBQUdBLFdBQU9uSCxFQUFFc0gsUUFBRixDQUFXdEgsRUFBRWEsR0FBYixFQUFrQnFHLFNBQWxCLEVBQTZCSCxZQUE3QixDQUFQO0FBQ0Q7O0FBckhjLENBQWpCIiwiZmlsZSI6Implc3VzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFIgPSByZXF1aXJlKCdyYW1kYScpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBkZXJlZiA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLWRlcmVmLXN5bmMnKVxudmFyIGpzb25maWxlID0gcmVxdWlyZSgnanNvbmZpbGUnKVxuLy8gdmFyIG5vcm1hbGlzZSA9IHJlcXVpcmUoJ2Fqdi1lcnJvci1tZXNzYWdlcycpXG52YXIgYWp2ID0gcmVxdWlyZSgnYWp2Jykoe2FsbEVycm9yczogdHJ1ZX0pXG4vLyB2YXIgc291cmNlTWFwU3VwcG9ydCA9IHJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpXG4vLyBzb3VyY2VNYXBTdXBwb3J0Lmluc3RhbGwoKVxuLy9wcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwcm9taXNlKSA9PiBjb25zb2xlLmVycm9yKCd1bmhhbmRsZWRSZWplY3Rpb24gUmVhc29uOiAnLCBwcm9taXNlLCByZWFzb24pKVxuXG5jb25zdCBQQUNLQUdFID0gJ2plc3VzJ1xuY29uc3Qgc3RyaW5nVG9Db2xvciA9IChzdHJpbmcpID0+IHtcbiAgdmFyIHZhbHVlID0gc3RyaW5nLnNwbGl0KCcnKS5tYXAoKGNoYXIpID0+IGNoYXIuY2hhckNvZGVBdCgwKSAqIDIpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApXG4gIHJldHVybiBgaHNsKCR7KHZhbHVlKSAlIDI1NX0sODAlLDMwJSlgXG59XG52YXIgTE9HID0gKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IHtcbiAgcmV0dXJuIHtcbiAgICBwcm9maWxlIChuYW1lKSB7IGlmICghY29uc29sZS5wcm9maWxlKSByZXR1cm4gZmFsc2U7IGNvbnNvbGUucHJvZmlsZShuYW1lKSB9LFxuICAgIHByb2ZpbGVFbmQgKG5hbWUpIHsgaWYgKCFjb25zb2xlLnByb2ZpbGUpIHJldHVybiBmYWxzZTsgY29uc29sZS5wcm9maWxlRW5kKG5hbWUpIH0sXG4gICAgZXJyb3IgKCkgeyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IGNvbnNvbGUuZXJyb3IuYXBwbHkodGhpcywgW3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSkgfSxcbiAgICBsb2cgKCkgeyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IGNvbnNvbGUubG9nLmFwcGx5KHRoaXMsIFtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrXS5jb25jYXQoYXJncykpIH0sXG4gICAgZGVidWcgKCkgeyBpZiAoIWNvbnNvbGUuZGVidWcpIHJldHVybiBmYWxzZTsgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpOyBjb25zb2xlLmRlYnVnLmFwcGx5KHRoaXMsIFsnJWMnICsgc2VydmljZU5hbWUsICdiYWNrZ3JvdW5kOiAnICsgc3RyaW5nVG9Db2xvcihzZXJ2aWNlTmFtZSkgKyAnOyBjb2xvcjogd2hpdGU7IGRpc3BsYXk6IGJsb2NrOycsIHNlcnZpY2VJZCwgcGFja10uY29uY2F0KGFyZ3MpKSB9LFxuICAgIHdhcm4gKCkgeyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IGNvbnNvbGUud2Fybi5hcHBseSh0aGlzLCBbc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFja10uY29uY2F0KGFyZ3MpKSB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZXJyb3JUaHJvdyAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykge1xuICByZXR1cm4gKG1zZywgZGF0YSkgPT4ge1xuICAgIExPRyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKS53YXJuKG1zZywgZGF0YSlcbiAgICBpZiAoZGF0YSAmJiBkYXRhLmVycm9yKSB0aHJvdyBkYXRhLmVycm9yXG4gICAgZWxzZSB0aHJvdyBtc2dcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyIChkaXIsIGZpbGVOYW1lID0gJ21ldGhvZHMuanNvbicpIHtcbiAgICB2YXIgc2VydmljZXMgPSB7fVxuICAgIGZzLnJlYWRkaXJTeW5jKGRpcikuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGRpciwgZmlsZSwgZmlsZU5hbWUpXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpc2VydmljZXNbZmlsZV0gPSByZXF1aXJlKGZpbGVQYXRoKVxuICAgIH0pXG4gICAgLy8gTE9HLmRlYnVnKFwiZ2V0QWxsU2VydmljZXNDb25maWdGcm9tRGlyXCIsc2VydmljZXMpXG4gICAgcmV0dXJuIHNlcnZpY2VzXG4gIH0sXG4gIHNldFNoYXJlZENvbmZpZyAoc2VydmljZXNSb290RGlyLCBzZXJ2aWNlLCBjb25maWcsIGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIGZpbGVQYXRoID0gcGF0aC5qb2luKHNlcnZpY2VzUm9vdERpciwgc2VydmljZSwgY29uZmlnKVxuICAgICAganNvbmZpbGUud3JpdGVGaWxlKGZpbGVQYXRoICsgJy5qc29uJywgZGF0YSwgKGVycikgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuICBnZXRTaGFyZWRDb25maWcgKHNlcnZpY2VzUm9vdERpcikge1xuICAgIHJldHVybiAoc2VydmljZSwgY29uZmlnID0gJ3NlcnZpY2UnLCBleGNsdWRlLCBhc09iaiA9IGZhbHNlKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoc2VydmljZSA9PT0gJyonKSB7XG4gICAgICAgICAgZnMucmVhZGRpcihzZXJ2aWNlc1Jvb3REaXIsIChlcnIsIGRpckNvbnRlbnRzKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgICAgIHZhciBhbGxGaWxlUHJvbWlzZXMgPSBbXVxuICAgICAgICAgICAgZGlyQ29udGVudHMuZm9yRWFjaChzZXJ2aWNlTmFtZSA9PiB7XG4gICAgICAgICAgICAgIGlmIChleGNsdWRlID09PSBzZXJ2aWNlTmFtZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHNlcnZpY2VzUm9vdERpciwgc2VydmljZU5hbWUsIGNvbmZpZylcbiAgICAgICAgICAgICAgYWxsRmlsZVByb21pc2VzLnB1c2gobmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGpzb25maWxlLnJlYWRGaWxlKGZpbGVQYXRoICsgJy5qc29uJywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgICAgICAgICBkYXRhID0gZGVyZWYoZGF0YSwge2Jhc2VGb2xkZXI6IHBhdGguZGlybmFtZShmaWxlUGF0aCksIGZhaWxPbk1pc3Npbmc6IHRydWV9KVxuICAgICAgICAgICAgICAgICAgZGF0YS5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lXG4gICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFByb21pc2UuYWxsKGFsbEZpbGVQcm9taXNlcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICBpZiAoYXNPYmopIHtcbiAgICAgICAgICAgICAgICB2YXIgb2JqUmVzdWx0ID0ge31cbiAgICAgICAgICAgICAgICByZXN1bHQuZm9yRWFjaChzZXJ2aWNlQXJyYXkgPT4gb2JqUmVzdWx0W3NlcnZpY2VBcnJheS5zZXJ2aWNlTmFtZV0gPSBzZXJ2aWNlQXJyYXkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUob2JqUmVzdWx0KVxuICAgICAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpXG4gICAgICAgICAgICB9KS5jYXRjaChyZWplY3QpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgZmlsZVBhdGggPSBwYXRoLmpvaW4oc2VydmljZXNSb290RGlyLCBzZXJ2aWNlLCBjb25maWcpXG4gICAgICAgICAganNvbmZpbGUucmVhZEZpbGUoZmlsZVBhdGggKyAnLmpzb24nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgICAgIGRhdGEgPSBkZXJlZihkYXRhLCB7YmFzZUZvbGRlcjogcGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgZmFpbE9uTWlzc2luZzogdHJ1ZX0pXG4gICAgICAgICAgICBkYXRhLnNlcnZpY2VOYW1lID0gc2VydmljZVxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSxcbiAgZXJyb3JUaHJvdyxcbiAgdmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBtZXRob2RzQ29uZmlnLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZCkge1xuICAgICAgLy8gVE8gRklYIEFERCBDQUNIRVxuICAgIGlmICghbWV0aG9kc0NvbmZpZyB8fCAhbWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXSB8fCAhbWV0aG9kc0NvbmZpZ1ttZXRob2ROYW1lXVtzY2hlbWFGaWVsZF0pIGVycm9yVGhyb3coYE1ldGhvZCB2YWxpZGF0aW9uIHByb2JsZW0gOiR7bWV0aG9kTmFtZX0gJHtzY2hlbWFGaWVsZH0gaW4gJHttZXRob2RzQ29uZmlnRmlsZX1gKVxuICAgIHZhciBzY2hlbWEgPSBtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdW3NjaGVtYUZpZWxkXVxuICAgIExPRyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKS5kZWJ1ZygndmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIHNjaGVtYScsIHttZXRob2RzQ29uZmlnLCBtZXRob2ROYW1lLCBzY2hlbWFGaWVsZCwgc2NoZW1hfSlcbiAgICB2YXIgdmFsaWRhdGUgPSBhanYuY29tcGlsZShzY2hlbWEpXG4gICAgdmFyIHZhbGlkID0gdmFsaWRhdGUoZGF0YSlcblxuICAgIGlmICghdmFsaWQpIHtcbiAgICAgIGVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSkoJ3ZhbGlkYXRpb24gZXJyb3JzJywge2Vycm9yczogdmFsaWRhdGUuZXJyb3JzLCBtZXRob2RzQ29uZmlnLCBtZXRob2ROYW1lLCBkYXRhLCBzY2hlbWFGaWVsZH0pXG4gICAgfVxuICAgIHJldHVybiBkYXRhXG4gIH0sXG4gIGdldEFzUHJvbWlzZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAodmFsdWUpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdHJ5IHsgcmV0dXJuIHJlc29sdmUodmFsdWUoKSkgfSBjYXRjaCAoZXJyb3IpIHsgcmV0dXJuIHJlamVjdChlcnJvcikgfVxuICAgICAgICB9IGVsc2UgcmV0dXJuIHJlc29sdmUodmFsdWUpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG4gIGFyZ3NPdmVyd3JpdGUgKCkge1xuICAgIHZhciBvdmVyd3JpdGVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgIHZhciBvcmlnaW5hbFBhY2thZ2UgPSBhcmd1bWVudHNbMF1cbiAgICB2YXIgbW9kaWZpZWRQYWNrYWdlID0ge31cbiAgICBmb3IgKHZhciBpIGluIG9yaWdpbmFsUGFja2FnZSkge1xuICAgICAgbW9kaWZpZWRQYWNrYWdlW2ldID0gZnVuY3Rpb24gcGFja2FnZUFyZ3NPdmVyd3JpdGUgKCkge1xuICAgICAgICB2YXIgbW9kaWZpZWRBcmd1bWVudHMgPSBPYmplY3QuYXNzaWduKGFyZ3VtZW50cywgb3ZlcndyaXRlQXJncylcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsUGFja2FnZVtpXS5hcHBseSh0aGlzLCBtb2RpZmllZEFyZ3VtZW50cylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vZGlmaWVkUGFja2FnZVxuICB9LFxuICBjaGVja1JlcXVpcmVkIChQUk9QU19PQkopIHtcbiAgICB2YXIgcHJvcHNOYW1lcyA9IE9iamVjdC5rZXlzKFBST1BTX09CSilcbiAgICBwcm9wc05hbWVzLmZvckVhY2goKHByb3BOYW1lKSA9PiB7XG4gICAgICBpZiAoIVBST1BTX09CSltwcm9wTmFtZV0pIHtcbiAgICAgICAgdGhyb3cgYFJlcXVpcmVkIERlcGVuZGVuY3kgJHtwcm9wTmFtZX0gaXMgbWlzc2luZ2BcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBjaGVja1JlcXVpcmVkRmlsZXMgKEZJTEVTLCBQQUNLQUdFKSB7XG4gICAgRklMRVMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGUpKSB7XG4gICAgICAgIHRocm93IGBSZXF1aXJlZCBGaWxlICR7ZmlsZX0gaXMgbWlzc2luZ2BcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBpc0VtcHR5QXJyYXkgKGFycmF5KSB7XG4gICAgcmV0dXJuICghYXJyYXkgfHwgIWFycmF5Lmxlbmd0aClcbiAgfSxcbiAgTE9HLFxuICBhZGRPYmplY3RDb2x1bW46IGZ1bmN0aW9uIChvYmplY3RzQXJyYXksIGNvbHVtbk5hbWUsIHZhbHVlc0FycmF5KSB7XG4gICAgdmFyIGFkZENvbHVtcyA9ICh2YWwsIGluZGV4KSA9PiBSLm1lcmdlKHtcbiAgICAgIFtjb2x1bW5OYW1lXTogdmFsdWVzQXJyYXlbaW5kZXhdXG4gICAgfSwgdmFsKVxuICAgIHJldHVybiBSLmFkZEluZGV4KFIubWFwKShhZGRDb2x1bXMsIG9iamVjdHNBcnJheSlcbiAgfVxuXG59XG4iXX0=