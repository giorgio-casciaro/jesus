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
      if (!config.log) return false;var args = Array.prototype.slice.call(arguments);console.log.apply(this, [serviceName, Date.now() - initTime, serviceId, pack].concat(args));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImplc3VzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImZzIiwicGF0aCIsImRlcmVmIiwianNvbmZpbGUiLCJhanYiLCJhbGxFcnJvcnMiLCJwcm9jZXNzIiwib24iLCJyZWFzb24iLCJwcm9taXNlIiwiY29uc29sZSIsImVycm9yIiwidHJhY2UiLCJQQUNLQUdFIiwic3RyaW5nVG9Db2xvciIsInN0cmluZyIsInZhbHVlIiwic3BsaXQiLCJtYXAiLCJjaGFyIiwiY2hhckNvZGVBdCIsInJlZHVjZSIsImEiLCJiIiwiZ2V0Q29uc29sZUluaXRUaW1lIiwiRGF0ZSIsIm5vdyIsImdldENvbnNvbGUiLCJjb25maWciLCJkZWJ1ZyIsImxvZyIsIndhcm4iLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsInBhY2siLCJpbml0VGltZSIsInByb2ZpbGUiLCJuYW1lIiwicHJvZmlsZUVuZCIsImFyZ3MiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImFyZ3VtZW50cyIsIm1lc3NhZ2UiLCJhcHBseSIsImNvbmNhdCIsImVycm9yVGhyb3ciLCJtc2ciLCJkYXRhIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEFsbFNlcnZpY2VzQ29uZmlnRnJvbURpciIsImRpciIsImZpbGVOYW1lIiwic2VydmljZXMiLCJyZWFkZGlyU3luYyIsImZvckVhY2giLCJmaWxlUGF0aCIsImpvaW4iLCJmaWxlIiwiZXhpc3RzU3luYyIsInNldFNoYXJlZENvbmZpZyIsInNlcnZpY2VzUm9vdERpciIsInNlcnZpY2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIndyaXRlRmlsZSIsImVyciIsImdldFNoYXJlZENvbmZpZyIsImV4Y2x1ZGUiLCJhc09iaiIsInJlYWRkaXIiLCJkaXJDb250ZW50cyIsImFsbEZpbGVQcm9taXNlcyIsInB1c2giLCJiYXNlRm9sZGVyIiwiZGlybmFtZSIsImZhaWxPbk1pc3NpbmciLCJFcnJvciIsImFsbCIsInRoZW4iLCJvYmpSZXN1bHQiLCJyZXN1bHQiLCJzZXJ2aWNlQXJyYXkiLCJjYXRjaCIsInZhbGlkYXRlTWV0aG9kRnJvbUNvbmZpZyIsIm1ldGhvZHNDb25maWciLCJtZXRob2ROYW1lIiwic2NoZW1hRmllbGQiLCJtZXRob2RzQ29uZmlnRmlsZSIsInNjaGVtYSIsInZhbGlkYXRlIiwiY29tcGlsZSIsInZhbGlkIiwiZXJyb3JzIiwiZ2V0QXNQcm9taXNlIiwiYXJnc092ZXJ3cml0ZSIsIm92ZXJ3cml0ZUFyZ3MiLCJvcmlnaW5hbFBhY2thZ2UiLCJtb2RpZmllZFBhY2thZ2UiLCJpIiwicGFja2FnZUFyZ3NPdmVyd3JpdGUiLCJtb2RpZmllZEFyZ3VtZW50cyIsIk9iamVjdCIsImFzc2lnbiIsImNoZWNrUmVxdWlyZWQiLCJQUk9QU19PQkoiLCJwcm9wc05hbWVzIiwia2V5cyIsInByb3BOYW1lIiwiY2hlY2tSZXF1aXJlZEZpbGVzIiwiRklMRVMiLCJpc0VtcHR5QXJyYXkiLCJhcnJheSIsImxlbmd0aCIsImFkZE9iamVjdENvbHVtbiIsIm9iamVjdHNBcnJheSIsImNvbHVtbk5hbWUiLCJ2YWx1ZXNBcnJheSIsImFkZENvbHVtcyIsInZhbCIsImluZGV4IiwibWVyZ2UiLCJhZGRJbmRleCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQU1BLElBQUlDLFFBQVEsT0FBUixDQUFWO0FBQ0EsSUFBTUMsS0FBS0QsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNRSxPQUFPRixRQUFRLE1BQVIsQ0FBYjtBQUNBLElBQUlHLFFBQVFILFFBQVEsd0JBQVIsQ0FBWjtBQUNBLElBQUlJLFdBQVdKLFFBQVEsVUFBUixDQUFmO0FBQ0E7QUFDQSxJQUFJSyxNQUFNTCxRQUFRLEtBQVIsRUFBZSxFQUFDTSxXQUFXLElBQVosRUFBZixDQUFWO0FBQ0E7QUFDQTtBQUNBQyxRQUFRQyxFQUFSLENBQVcsb0JBQVgsRUFBaUMsVUFBQ0MsTUFBRCxFQUFTQyxPQUFULEVBQXFCO0FBQ3BEQyxVQUFRQyxLQUFSLENBQWMsNkJBQWQsRUFBNkNGLE9BQTdDLEVBQXNERCxNQUF0RDtBQUNBRSxVQUFRRSxLQUFSLENBQWNKLE1BQWQ7QUFDRCxDQUhEOztBQUtBLElBQU1LLFVBQVUsT0FBaEI7QUFDQSxJQUFNQyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNDLE1BQUQsRUFBWTtBQUNoQyxNQUFJQyxRQUFRRCxPQUFPRSxLQUFQLENBQWEsRUFBYixFQUFpQkMsR0FBakIsQ0FBcUIsVUFBQ0MsSUFBRDtBQUFBLFdBQVVBLEtBQUtDLFVBQUwsQ0FBZ0IsQ0FBaEIsSUFBcUIsQ0FBL0I7QUFBQSxHQUFyQixFQUF1REMsTUFBdkQsQ0FBOEQsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsV0FBVUQsSUFBSUMsQ0FBZDtBQUFBLEdBQTlELEVBQStFLENBQS9FLENBQVo7QUFDQSxrQkFBZVAsS0FBRCxHQUFVLEdBQXhCO0FBQ0QsQ0FIRDtBQUlBLElBQUlRLHFCQUFtQkMsS0FBS0MsR0FBTCxFQUF2QjtBQUNBLElBQUlDLGFBQWEsU0FBYkEsVUFBYSxHQUErRjtBQUFBLE1BQTlGQyxNQUE4Rix1RUFBckYsRUFBQ0MsT0FBTyxLQUFSLEVBQWVDLEtBQUssSUFBcEIsRUFBMEJuQixPQUFPLElBQWpDLEVBQXVDb0IsTUFBTSxJQUE3QyxFQUFxRjtBQUFBLE1BQWpDQyxXQUFpQztBQUFBLE1BQXBCQyxTQUFvQjtBQUFBLE1BQVRDLElBQVM7O0FBQzlHLE1BQUlDLFdBQVNYLGtCQUFiO0FBQ0EsU0FBTztBQUNMWSxXQURLLG1CQUNJQyxJQURKLEVBQ1U7QUFBRSxVQUFJLENBQUMzQixRQUFRMEIsT0FBYixFQUFzQixPQUFPLEtBQVAsQ0FBYzFCLFFBQVEwQixPQUFSLENBQWdCQyxJQUFoQjtBQUF1QixLQUR2RTtBQUVMQyxjQUZLLHNCQUVPRCxJQUZQLEVBRWE7QUFBRSxVQUFJLENBQUMzQixRQUFRMEIsT0FBYixFQUFzQixPQUFPLEtBQVAsQ0FBYzFCLFFBQVE0QixVQUFSLENBQW1CRCxJQUFuQjtBQUEwQixLQUY3RTtBQUdMMUIsU0FISyxtQkFHSTtBQUFFLFVBQUksQ0FBQ2lCLE9BQU9qQixLQUFaLEVBQW1CLE9BQU8sS0FBUCxDQUFjLElBQUk0QixPQUFPQyxNQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkJDLFNBQTNCLENBQVgsQ0FBaURMLEtBQUssQ0FBTCxJQUFRQSxLQUFLLENBQUwsRUFBUU0sT0FBUixJQUFpQk4sS0FBSyxDQUFMLENBQXpCLENBQWlDN0IsUUFBUUMsS0FBUixDQUFjbUMsS0FBZCxDQUFvQixJQUFwQixFQUEwQixDQUFDZCxXQUFELEVBQWFQLEtBQUtDLEdBQUwsS0FBV1MsUUFBeEIsRUFBa0NGLFNBQWxDLEVBQTZDQyxJQUE3QyxFQUFtRGEsTUFBbkQsQ0FBMERSLElBQTFELENBQTFCLEVBQTJGN0IsUUFBUUUsS0FBUjtBQUFpQixLQUhyTztBQUlMa0IsT0FKSyxpQkFJRTtBQUFFLFVBQUksQ0FBQ0YsT0FBT0UsR0FBWixFQUFpQixPQUFPLEtBQVAsQ0FBYyxJQUFJUyxPQUFPQyxNQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkJDLFNBQTNCLENBQVgsQ0FBa0RsQyxRQUFRb0IsR0FBUixDQUFZZ0IsS0FBWixDQUFrQixJQUFsQixFQUF3QixDQUFDZCxXQUFELEVBQWFQLEtBQUtDLEdBQUwsS0FBV1MsUUFBeEIsRUFBa0NGLFNBQWxDLEVBQTZDQyxJQUE3QyxFQUFtRGEsTUFBbkQsQ0FBMERSLElBQTFELENBQXhCO0FBQTBGLEtBSi9LO0FBS0xWLFNBTEssbUJBS0k7QUFBRSxVQUFJLENBQUNELE9BQU9DLEtBQVIsSUFBZSxPQUFPbkIsUUFBUW1CLEtBQWYsS0FBd0IsVUFBM0MsRUFBdUQsT0FBTyxLQUFQLENBQWMsSUFBSVUsT0FBT0MsTUFBTUMsU0FBTixDQUFnQkMsS0FBaEIsQ0FBc0JDLElBQXRCLENBQTJCQyxTQUEzQixDQUFYLENBQWtEbEMsUUFBUW1CLEtBQVIsQ0FBY2lCLEtBQWQsQ0FBb0IsSUFBcEIsRUFBMEIsQ0FBQyxPQUFPZCxXQUFSLEVBQXFCLGlCQUFpQmxCLGNBQWNrQixXQUFkLENBQWpCLEdBQThDLGlDQUFuRSxFQUFzR1AsS0FBS0MsR0FBTCxLQUFXUyxRQUFqSCxFQUEwSEYsU0FBMUgsRUFBcUlDLElBQXJJLEVBQTJJYSxNQUEzSSxDQUFrSlIsSUFBbEosQ0FBMUI7QUFBb0wsS0FMalQ7QUFNTFIsUUFOSyxrQkFNRztBQUFFLFVBQUksQ0FBQ0gsT0FBT0csSUFBUixJQUFjLENBQUNyQixRQUFRcUIsSUFBM0IsRUFBaUMsT0FBTyxLQUFQLENBQWMsSUFBSVEsT0FBT0MsTUFBTUMsU0FBTixDQUFnQkMsS0FBaEIsQ0FBc0JDLElBQXRCLENBQTJCQyxTQUEzQixDQUFYLENBQWtEbEMsUUFBUXFCLElBQVIsQ0FBYWUsS0FBYixDQUFtQixJQUFuQixFQUF5QixDQUFDZCxXQUFELEVBQWNQLEtBQUtDLEdBQUwsS0FBV1MsUUFBekIsRUFBa0NGLFNBQWxDLEVBQTZDQyxJQUE3QyxFQUFtRGEsTUFBbkQsQ0FBMERSLElBQTFELENBQXpCO0FBQTJGO0FBTmpNLEdBQVA7QUFRRCxDQVZEOztBQVlBLFNBQVNTLFVBQVQsQ0FBcUJoQixXQUFyQixFQUFrQ0MsU0FBbEMsRUFBNkNDLElBQTdDLEVBQW1EO0FBQ2pELFNBQU8sVUFBQ2UsR0FBRCxFQUFNQyxJQUFOLEVBQWU7QUFDcEJ2QixlQUFXLEtBQVgsRUFBa0JLLFdBQWxCLEVBQStCQyxTQUEvQixFQUEwQ0MsSUFBMUMsRUFBZ0RILElBQWhELENBQXFEa0IsR0FBckQsRUFBMERDLElBQTFEO0FBQ0EsUUFBSUEsUUFBUUEsS0FBS3ZDLEtBQWpCLEVBQXdCLE1BQU11QyxLQUFLdkMsS0FBWCxDQUF4QixLQUNLLE1BQU1zQyxHQUFOO0FBQ04sR0FKRDtBQUtEOztBQUVERSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLDZCQURlLHVDQUNjQyxHQURkLEVBQzhDO0FBQUEsUUFBM0JDLFFBQTJCLHVFQUFoQixjQUFnQjs7QUFDM0QsUUFBSUMsV0FBVyxFQUFmO0FBQ0F4RCxPQUFHeUQsV0FBSCxDQUFlSCxHQUFmLEVBQW9CSSxPQUFwQixDQUE0QixnQkFBUTtBQUNsQyxVQUFNQyxXQUFXMUQsS0FBSzJELElBQUwsQ0FBVU4sR0FBVixFQUFlTyxJQUFmLEVBQXFCTixRQUFyQixDQUFqQjtBQUNBLFVBQUl2RCxHQUFHOEQsVUFBSCxDQUFjSCxRQUFkLENBQUosRUFBNEJILFNBQVNLLElBQVQsSUFBaUI5RCxRQUFRNEQsUUFBUixDQUFqQjtBQUM3QixLQUhEO0FBSUE7QUFDQSxXQUFPSCxRQUFQO0FBQ0QsR0FUYztBQVVmTyxpQkFWZSwyQkFVRUMsZUFWRixFQVVtQkMsT0FWbkIsRUFVNEJyQyxNQVY1QixFQVVvQ3NCLElBVnBDLEVBVTBDO0FBQ3ZELFdBQU8sSUFBSWdCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsVUFBSVQsV0FBVzFELEtBQUsyRCxJQUFMLENBQVVJLGVBQVYsRUFBMkJDLE9BQTNCLEVBQW9DckMsTUFBcEMsQ0FBZjtBQUNBekIsZUFBU2tFLFNBQVQsQ0FBbUJWLFdBQVcsT0FBOUIsRUFBdUNULElBQXZDLEVBQTZDLFVBQUNvQixHQUFELEVBQVM7QUFDcEQsWUFBSUEsR0FBSixFQUFTLE9BQU9GLE9BQU9FLEdBQVAsQ0FBUDtBQUNUSCxnQkFBUWpCLElBQVI7QUFDRCxPQUhEO0FBSUQsS0FOTSxDQUFQO0FBT0QsR0FsQmM7QUFtQmZxQixpQkFuQmUsMkJBbUJFUCxlQW5CRixFQW1CbUI7QUFDaEMsV0FBTyxVQUFDQyxPQUFELEVBQXlEO0FBQUEsVUFBL0NyQyxNQUErQyx1RUFBdEMsU0FBc0M7QUFBQSxVQUEzQjRDLE9BQTJCO0FBQUEsVUFBbEJDLEtBQWtCLHVFQUFWLEtBQVU7OztBQUU5RCxhQUFPLElBQUlQLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsWUFBSUgsWUFBWSxHQUFoQixFQUFxQjtBQUNuQmpFLGFBQUcwRSxPQUFILENBQVdWLGVBQVgsRUFBNEIsVUFBQ00sR0FBRCxFQUFNSyxXQUFOLEVBQXNCO0FBQ2hELGdCQUFJTCxHQUFKLEVBQVMsT0FBT0YsT0FBT0UsR0FBUCxDQUFQO0FBQ1QsZ0JBQUlNLGtCQUFrQixFQUF0QjtBQUNBRCx3QkFBWWpCLE9BQVosQ0FBb0IsdUJBQWU7QUFDakMsa0JBQUljLFlBQVl4QyxXQUFoQixFQUE2QixPQUFPLEtBQVA7QUFDN0Isa0JBQU0yQixXQUFXMUQsS0FBSzJELElBQUwsQ0FBVUksZUFBVixFQUEyQmhDLFdBQTNCLEVBQXdDSixNQUF4QyxDQUFqQjtBQUNBZ0QsOEJBQWdCQyxJQUFoQixDQUFxQixJQUFJWCxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFJbEIsT0FBT25ELFFBQVE0RCxXQUFXLE9BQW5CLENBQVg7QUFDQVQsdUJBQU9oRCxNQUFNZ0QsSUFBTixFQUFZLEVBQUM0QixZQUFZN0UsS0FBSzhFLE9BQUwsQ0FBYXBCLFFBQWIsQ0FBYixFQUFxQ3FCLGVBQWUsSUFBcEQsRUFBWixDQUFQO0FBQ0Esb0JBQUc5QixnQkFBZ0IrQixLQUFuQixFQUF5QmIsT0FBT2xCLElBQVA7QUFDekJBLHFCQUFLbEIsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQW1DLHdCQUFRakIsSUFBUjtBQUNELGVBWm9CLENBQXJCO0FBYUQsYUFoQkQ7QUFpQkFnQixvQkFBUWdCLEdBQVIsQ0FBWU4sZUFBWixFQUE2Qk8sSUFBN0IsQ0FBa0Msa0JBQVU7QUFDMUMsa0JBQUlWLEtBQUosRUFBVztBQUNULG9CQUFJVyxZQUFZLEVBQWhCO0FBQ0FDLHVCQUFPM0IsT0FBUCxDQUFlO0FBQUEseUJBQWdCMEIsVUFBVUUsYUFBYXRELFdBQXZCLElBQXNDc0QsWUFBdEQ7QUFBQSxpQkFBZjtBQUNBLHVCQUFPbkIsUUFBUWlCLFNBQVIsQ0FBUDtBQUNELGVBSkQsTUFJT2pCLFFBQVFrQixNQUFSO0FBQ1IsYUFORCxFQU1HRSxLQU5ILENBTVNuQixNQU5UO0FBT0QsV0EzQkQ7QUE0QkQsU0E3QkQsTUE2Qk87QUFDTCxjQUFJVCxXQUFXMUQsS0FBSzJELElBQUwsQ0FBVUksZUFBVixFQUEyQkMsT0FBM0IsRUFBb0NyQyxNQUFwQyxDQUFmO0FBQ0FsQixrQkFBUW1CLEtBQVIsQ0FBYyxpQkFBZCxFQUFnQyxFQUFDOEIsa0JBQUQsRUFBaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFJVCxPQUFPbkQsUUFBUTRELFdBQVcsT0FBbkIsQ0FBWDtBQUNBVCxpQkFBT2hELE1BQU1nRCxJQUFOLEVBQVksRUFBQzRCLFlBQVk3RSxLQUFLOEUsT0FBTCxDQUFhcEIsUUFBYixDQUFiLEVBQXFDcUIsZUFBZSxJQUFwRCxFQUFaLENBQVA7QUFDQSxjQUFHOUIsZ0JBQWdCK0IsS0FBbkIsRUFBeUJiLE9BQU9sQixJQUFQO0FBQ3pCQSxlQUFLbEIsV0FBTCxHQUFtQmlDLE9BQW5CO0FBQ0FFLGtCQUFRakIsSUFBUjtBQUNEO0FBQ0YsT0E3Q00sQ0FBUDtBQThDRCxLQWhERDtBQWlERCxHQXJFYzs7QUFzRWZGLHdCQXRFZTtBQXVFZndDLDBCQXZFZSxvQ0F1RVd4QyxVQXZFWCxFQXVFc0JoQixXQXZFdEIsRUF1RW1DQyxTQXZFbkMsRUF1RThDd0QsYUF2RTlDLEVBdUU2REMsVUF2RTdELEVBdUV5RXhDLElBdkV6RSxFQXVFK0V5QyxXQXZFL0UsRUF1RTRGO0FBQ3pHLFFBQUksQ0FBQ0YsYUFBRCxJQUFrQixDQUFDQSxjQUFjQyxVQUFkLENBQW5CLElBQWdELENBQUNELGNBQWNDLFVBQWQsRUFBMEJDLFdBQTFCLENBQXJELEVBQTZGM0MsMkNBQXlDMEMsVUFBekMsU0FBdURDLFdBQXZELFlBQXlFQyxpQkFBekU7QUFDN0YsUUFBSUMsU0FBU0osY0FBY0MsVUFBZCxFQUEwQkMsV0FBMUIsQ0FBYjtBQUNBLFFBQUlHLFdBQVcxRixJQUFJMkYsT0FBSixDQUFZRixNQUFaLENBQWY7QUFDQSxRQUFJRyxRQUFRRixTQUFTNUMsSUFBVCxDQUFaO0FBQ0EsUUFBSSxDQUFDOEMsS0FBTCxFQUFZO0FBQ1ZoRCxpQkFBVyxtQkFBWCxFQUFnQyxFQUFDaUQsUUFBUUgsU0FBU0csTUFBbEIsRUFBMEJSLDRCQUExQixFQUF5Q0Msc0JBQXpDLEVBQXFEeEMsVUFBckQsRUFBMkR5Qyx3QkFBM0QsRUFBaEM7QUFDRDtBQUNELFdBQU96QyxJQUFQO0FBQ0QsR0FoRmM7O0FBaUZmZ0QsZ0JBQWMsc0JBQVVsRixLQUFWLEVBQWlCO0FBQzdCLFdBQU8sSUFBSWtELE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdENGLGNBQVFDLE9BQVIsQ0FBZ0JuRCxLQUFoQixFQUF1Qm1FLElBQXZCLENBQTRCLFVBQVVuRSxLQUFWLEVBQWlCO0FBQzNDLFlBQUksT0FBUUEsS0FBUixLQUFtQixVQUF2QixFQUFtQztBQUNqQyxjQUFJO0FBQUUsbUJBQU9tRCxRQUFRbkQsT0FBUixDQUFQO0FBQXlCLFdBQS9CLENBQWdDLE9BQU9MLEtBQVAsRUFBYztBQUFFLG1CQUFPeUQsT0FBT3pELEtBQVAsQ0FBUDtBQUFzQjtBQUN2RSxTQUZELE1BRU8sT0FBT3dELFFBQVFuRCxLQUFSLENBQVA7QUFDUixPQUpEO0FBS0QsS0FOTSxDQUFQO0FBT0QsR0F6RmM7QUEwRmZtRixlQTFGZSwyQkEwRkU7QUFDZixRQUFJQyxnQkFBZ0I1RCxNQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkJDLFNBQTNCLEVBQXNDLENBQXRDLENBQXBCO0FBQ0EsUUFBSXlELGtCQUFrQnpELFVBQVUsQ0FBVixDQUF0QjtBQUNBLFFBQUkwRCxrQkFBa0IsRUFBdEI7QUFDQSxTQUFLLElBQUlDLENBQVQsSUFBY0YsZUFBZCxFQUErQjtBQUM3QkMsc0JBQWdCQyxDQUFoQixJQUFxQixTQUFTQyxvQkFBVCxHQUFpQztBQUNwRCxZQUFJQyxvQkFBb0JDLE9BQU9DLE1BQVAsQ0FBYy9ELFNBQWQsRUFBeUJ3RCxhQUF6QixDQUF4QjtBQUNBLGVBQU9DLGdCQUFnQkUsQ0FBaEIsRUFBbUJ6RCxLQUFuQixDQUF5QixJQUF6QixFQUErQjJELGlCQUEvQixDQUFQO0FBQ0QsT0FIRDtBQUlEO0FBQ0QsV0FBT0gsZUFBUDtBQUNELEdBckdjO0FBc0dmTSxlQXRHZSx5QkFzR0FDLFNBdEdBLEVBc0dXaEcsT0F0R1gsRUFzR29CO0FBQ2pDLFFBQUlpRyxhQUFhSixPQUFPSyxJQUFQLENBQVlGLFNBQVosQ0FBakI7QUFDQUMsZUFBV3BELE9BQVgsQ0FBbUIsVUFBQ3NELFFBQUQsRUFBYztBQUMvQixVQUFJLENBQUNILFVBQVVHLFFBQVYsQ0FBTCxFQUEwQjtBQUN4QiwyQkFBaUJuRyxPQUFqQiw4QkFBaURtRyxRQUFqRDtBQUNEO0FBQ0YsS0FKRDtBQUtELEdBN0djO0FBOEdmQyxvQkE5R2UsOEJBOEdLQyxLQTlHTCxFQThHWXJHLE9BOUdaLEVBOEdxQjtBQUNsQ3FHLFVBQU14RCxPQUFOLENBQWMsVUFBQ0csSUFBRCxFQUFVO0FBQ3RCLFVBQUksQ0FBQzdELEdBQUc4RCxVQUFILENBQWNELElBQWQsQ0FBTCxFQUEwQjtBQUN4QixpQ0FBdUJBLElBQXZCO0FBQ0Q7QUFDRixLQUpEO0FBS0QsR0FwSGM7QUFxSGZzRCxjQXJIZSx3QkFxSERDLEtBckhDLEVBcUhNO0FBQ25CLFdBQVEsQ0FBQ0EsS0FBRCxJQUFVLENBQUNBLE1BQU1DLE1BQXpCO0FBQ0QsR0F2SGM7O0FBd0hmMUYsd0JBeEhlO0FBeUhmMkYsbUJBQWlCLHlCQUFVQyxZQUFWLEVBQXdCQyxVQUF4QixFQUFvQ0MsV0FBcEMsRUFBaUQ7QUFDaEUsUUFBSUMsWUFBWSxTQUFaQSxTQUFZLENBQUNDLEdBQUQsRUFBTUMsS0FBTjtBQUFBLGFBQWdCOUgsRUFBRStILEtBQUYscUJBQzdCTCxVQUQ2QixFQUNoQkMsWUFBWUcsS0FBWixDQURnQixHQUU3QkQsR0FGNkIsQ0FBaEI7QUFBQSxLQUFoQjtBQUdBLFdBQU83SCxFQUFFZ0ksUUFBRixDQUFXaEksRUFBRW9CLEdBQWIsRUFBa0J3RyxTQUFsQixFQUE2QkgsWUFBN0IsQ0FBUDtBQUNEOztBQTlIYyxDQUFqQiIsImZpbGUiOiJqZXN1cy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBSID0gcmVxdWlyZSgncmFtZGEnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgZGVyZWYgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1kZXJlZi1zeW5jJylcbnZhciBqc29uZmlsZSA9IHJlcXVpcmUoJ2pzb25maWxlJylcbi8vIHZhciBub3JtYWxpc2UgPSByZXF1aXJlKCdhanYtZXJyb3ItbWVzc2FnZXMnKVxudmFyIGFqdiA9IHJlcXVpcmUoJ2FqdicpKHthbGxFcnJvcnM6IHRydWV9KVxuLy8gdmFyIHNvdXJjZU1hcFN1cHBvcnQgPSByZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKVxuLy8gc291cmNlTWFwU3VwcG9ydC5pbnN0YWxsKClcbnByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIChyZWFzb24sIHByb21pc2UpID0+IHtcbiAgY29uc29sZS5lcnJvcigndW5oYW5kbGVkUmVqZWN0aW9uIFJlYXNvbjogJywgcHJvbWlzZSwgcmVhc29uKVxuICBjb25zb2xlLnRyYWNlKHJlYXNvbilcbn0pXG5cbmNvbnN0IFBBQ0tBR0UgPSAnamVzdXMnXG5jb25zdCBzdHJpbmdUb0NvbG9yID0gKHN0cmluZykgPT4ge1xuICB2YXIgdmFsdWUgPSBzdHJpbmcuc3BsaXQoJycpLm1hcCgoY2hhcikgPT4gY2hhci5jaGFyQ29kZUF0KDApICogMikucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMClcbiAgcmV0dXJuIGBoc2woJHsodmFsdWUpICUgMjU1fSw4MCUsMzAlKWBcbn1cbnZhciBnZXRDb25zb2xlSW5pdFRpbWU9RGF0ZS5ub3coKVxudmFyIGdldENvbnNvbGUgPSAoY29uZmlnID0ge2RlYnVnOiBmYWxzZSwgbG9nOiB0cnVlLCBlcnJvcjogdHJ1ZSwgd2FybjogdHJ1ZX0sIHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHBhY2spID0+IHtcbiAgdmFyIGluaXRUaW1lPWdldENvbnNvbGVJbml0VGltZVxuICByZXR1cm4ge1xuICAgIHByb2ZpbGUgKG5hbWUpIHsgaWYgKCFjb25zb2xlLnByb2ZpbGUpIHJldHVybiBmYWxzZTsgY29uc29sZS5wcm9maWxlKG5hbWUpIH0sXG4gICAgcHJvZmlsZUVuZCAobmFtZSkgeyBpZiAoIWNvbnNvbGUucHJvZmlsZSkgcmV0dXJuIGZhbHNlOyBjb25zb2xlLnByb2ZpbGVFbmQobmFtZSkgfSxcbiAgICBlcnJvciAoKSB7IGlmICghY29uZmlnLmVycm9yKSByZXR1cm4gZmFsc2U7IHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTthcmdzWzBdPWFyZ3NbMF0ubWVzc2FnZXx8YXJnc1swXTtjb25zb2xlLmVycm9yLmFwcGx5KHRoaXMsIFtzZXJ2aWNlTmFtZSxEYXRlLm5vdygpLWluaXRUaW1lLCBzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSk7Y29uc29sZS50cmFjZSgpIH0sXG4gICAgbG9nICgpIHsgaWYgKCFjb25maWcubG9nKSByZXR1cm4gZmFsc2U7IHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTsgY29uc29sZS5sb2cuYXBwbHkodGhpcywgW3NlcnZpY2VOYW1lLERhdGUubm93KCktaW5pdFRpbWUsIHNlcnZpY2VJZCwgcGFja10uY29uY2F0KGFyZ3MpKSB9LFxuICAgIGRlYnVnICgpIHsgaWYgKCFjb25maWcuZGVidWd8fHR5cGVvZihjb25zb2xlLmRlYnVnKSE9PVwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlOyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IGNvbnNvbGUuZGVidWcuYXBwbHkodGhpcywgWyclYycgKyBzZXJ2aWNlTmFtZSwgJ2JhY2tncm91bmQ6ICcgKyBzdHJpbmdUb0NvbG9yKHNlcnZpY2VOYW1lKSArICc7IGNvbG9yOiB3aGl0ZTsgZGlzcGxheTogYmxvY2s7JywgRGF0ZS5ub3coKS1pbml0VGltZSxzZXJ2aWNlSWQsIHBhY2tdLmNvbmNhdChhcmdzKSkgfSxcbiAgICB3YXJuICgpIHsgaWYgKCFjb25maWcud2Fybnx8IWNvbnNvbGUud2FybikgcmV0dXJuIGZhbHNlOyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IGNvbnNvbGUud2Fybi5hcHBseSh0aGlzLCBbc2VydmljZU5hbWUsIERhdGUubm93KCktaW5pdFRpbWUsc2VydmljZUlkLCBwYWNrXS5jb25jYXQoYXJncykpIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlcnJvclRocm93IChzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKSB7XG4gIHJldHVybiAobXNnLCBkYXRhKSA9PiB7XG4gICAgZ2V0Q29uc29sZShmYWxzZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykud2Fybihtc2csIGRhdGEpXG4gICAgaWYgKGRhdGEgJiYgZGF0YS5lcnJvcikgdGhyb3cgZGF0YS5lcnJvclxuICAgIGVsc2UgdGhyb3cgbXNnXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEFsbFNlcnZpY2VzQ29uZmlnRnJvbURpciAoZGlyLCBmaWxlTmFtZSA9ICdtZXRob2RzLmpzb24nKSB7XG4gICAgdmFyIHNlcnZpY2VzID0ge31cbiAgICBmcy5yZWFkZGlyU3luYyhkaXIpLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihkaXIsIGZpbGUsIGZpbGVOYW1lKVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKXNlcnZpY2VzW2ZpbGVdID0gcmVxdWlyZShmaWxlUGF0aClcbiAgICB9KVxuICAgIC8vIENPTlNPTEUuZGVidWcoXCJnZXRBbGxTZXJ2aWNlc0NvbmZpZ0Zyb21EaXJcIixzZXJ2aWNlcylcbiAgICByZXR1cm4gc2VydmljZXNcbiAgfSxcbiAgc2V0U2hhcmVkQ29uZmlnIChzZXJ2aWNlc1Jvb3REaXIsIHNlcnZpY2UsIGNvbmZpZywgZGF0YSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB2YXIgZmlsZVBhdGggPSBwYXRoLmpvaW4oc2VydmljZXNSb290RGlyLCBzZXJ2aWNlLCBjb25maWcpXG4gICAgICBqc29uZmlsZS53cml0ZUZpbGUoZmlsZVBhdGggKyAnLmpzb24nLCBkYXRhLCAoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICByZXNvbHZlKGRhdGEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG4gIGdldFNoYXJlZENvbmZpZyAoc2VydmljZXNSb290RGlyKSB7XG4gICAgcmV0dXJuIChzZXJ2aWNlLCBjb25maWcgPSAnc2VydmljZScsIGV4Y2x1ZGUsIGFzT2JqID0gZmFsc2UpID0+IHtcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKHNlcnZpY2UgPT09ICcqJykge1xuICAgICAgICAgIGZzLnJlYWRkaXIoc2VydmljZXNSb290RGlyLCAoZXJyLCBkaXJDb250ZW50cykgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgICB2YXIgYWxsRmlsZVByb21pc2VzID0gW11cbiAgICAgICAgICAgIGRpckNvbnRlbnRzLmZvckVhY2goc2VydmljZU5hbWUgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXhjbHVkZSA9PT0gc2VydmljZU5hbWUpIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihzZXJ2aWNlc1Jvb3REaXIsIHNlcnZpY2VOYW1lLCBjb25maWcpXG4gICAgICAgICAgICAgIGFsbEZpbGVQcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBqc29uZmlsZS5yZWFkRmlsZShmaWxlUGF0aCArICcuanNvbicsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAvLyAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICAgICAgICAgIC8vICAgZGF0YSA9IGRlcmVmKGRhdGEsIHtiYXNlRm9sZGVyOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCBmYWlsT25NaXNzaW5nOiB0cnVlfSlcbiAgICAgICAgICAgICAgICAvLyAgIGRhdGEuc2VydmljZU5hbWUgPSBzZXJ2aWNlTmFtZVxuICAgICAgICAgICAgICAgIC8vICAgcmV0dXJuIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgICAgICAvLyB9KVxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVxdWlyZShmaWxlUGF0aCArICcuanNvbicpXG4gICAgICAgICAgICAgICAgZGF0YSA9IGRlcmVmKGRhdGEsIHtiYXNlRm9sZGVyOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCBmYWlsT25NaXNzaW5nOiB0cnVlfSlcbiAgICAgICAgICAgICAgICBpZihkYXRhIGluc3RhbmNlb2YgRXJyb3IpcmVqZWN0KGRhdGEpXG4gICAgICAgICAgICAgICAgZGF0YS5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBQcm9taXNlLmFsbChhbGxGaWxlUHJvbWlzZXMpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgaWYgKGFzT2JqKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9ialJlc3VsdCA9IHt9XG4gICAgICAgICAgICAgICAgcmVzdWx0LmZvckVhY2goc2VydmljZUFycmF5ID0+IG9ialJlc3VsdFtzZXJ2aWNlQXJyYXkuc2VydmljZU5hbWVdID0gc2VydmljZUFycmF5KVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG9ialJlc3VsdClcbiAgICAgICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KVxuICAgICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGZpbGVQYXRoID0gcGF0aC5qb2luKHNlcnZpY2VzUm9vdERpciwgc2VydmljZSwgY29uZmlnKVxuICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJnZXRTaGFyZWRDb25maWdcIix7ZmlsZVBhdGh9KVxuICAgICAgICAgIC8vIGpzb25maWxlLnJlYWRGaWxlKGZpbGVQYXRoICsgJy5qc29uJywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgIC8vICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgLy8gICBkYXRhID0gZGVyZWYoZGF0YSwge2Jhc2VGb2xkZXI6IHBhdGguZGlybmFtZShmaWxlUGF0aCksIGZhaWxPbk1pc3Npbmc6IHRydWV9KVxuICAgICAgICAgIC8vICAgZGF0YS5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VcbiAgICAgICAgICAvLyAgIHJldHVybiByZXNvbHZlKGRhdGEpXG4gICAgICAgICAgLy8gfSlcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlcXVpcmUoZmlsZVBhdGggKyAnLmpzb24nKVxuICAgICAgICAgIGRhdGEgPSBkZXJlZihkYXRhLCB7YmFzZUZvbGRlcjogcGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgZmFpbE9uTWlzc2luZzogdHJ1ZX0pXG4gICAgICAgICAgaWYoZGF0YSBpbnN0YW5jZW9mIEVycm9yKXJlamVjdChkYXRhKVxuICAgICAgICAgIGRhdGEuc2VydmljZU5hbWUgPSBzZXJ2aWNlXG4gICAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSxcbiAgZXJyb3JUaHJvdyxcbiAgdmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIChlcnJvclRocm93LHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIG1ldGhvZHNDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkKSB7XG4gICAgaWYgKCFtZXRob2RzQ29uZmlnIHx8ICFtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdIHx8ICFtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdW3NjaGVtYUZpZWxkXSkgZXJyb3JUaHJvdyhgTWV0aG9kIHZhbGlkYXRpb24gcHJvYmxlbSA6JHttZXRob2ROYW1lfSAke3NjaGVtYUZpZWxkfSBpbiAke21ldGhvZHNDb25maWdGaWxlfWApXG4gICAgdmFyIHNjaGVtYSA9IG1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV1bc2NoZW1hRmllbGRdXG4gICAgdmFyIHZhbGlkYXRlID0gYWp2LmNvbXBpbGUoc2NoZW1hKVxuICAgIHZhciB2YWxpZCA9IHZhbGlkYXRlKGRhdGEpXG4gICAgaWYgKCF2YWxpZCkge1xuICAgICAgZXJyb3JUaHJvdygndmFsaWRhdGlvbiBlcnJvcnMnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnMsIG1ldGhvZHNDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkfSlcbiAgICB9XG4gICAgcmV0dXJuIGRhdGFcbiAgfSxcbiAgZ2V0QXNQcm9taXNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0cnkgeyByZXR1cm4gcmVzb2x2ZSh2YWx1ZSgpKSB9IGNhdGNoIChlcnJvcikgeyByZXR1cm4gcmVqZWN0KGVycm9yKSB9XG4gICAgICAgIH0gZWxzZSByZXR1cm4gcmVzb2x2ZSh2YWx1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcbiAgYXJnc092ZXJ3cml0ZSAoKSB7XG4gICAgdmFyIG92ZXJ3cml0ZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgdmFyIG9yaWdpbmFsUGFja2FnZSA9IGFyZ3VtZW50c1swXVxuICAgIHZhciBtb2RpZmllZFBhY2thZ2UgPSB7fVxuICAgIGZvciAodmFyIGkgaW4gb3JpZ2luYWxQYWNrYWdlKSB7XG4gICAgICBtb2RpZmllZFBhY2thZ2VbaV0gPSBmdW5jdGlvbiBwYWNrYWdlQXJnc092ZXJ3cml0ZSAoKSB7XG4gICAgICAgIHZhciBtb2RpZmllZEFyZ3VtZW50cyA9IE9iamVjdC5hc3NpZ24oYXJndW1lbnRzLCBvdmVyd3JpdGVBcmdzKVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxQYWNrYWdlW2ldLmFwcGx5KHRoaXMsIG1vZGlmaWVkQXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW9kaWZpZWRQYWNrYWdlXG4gIH0sXG4gIGNoZWNrUmVxdWlyZWQgKFBST1BTX09CSiwgUEFDS0FHRSkge1xuICAgIHZhciBwcm9wc05hbWVzID0gT2JqZWN0LmtleXMoUFJPUFNfT0JKKVxuICAgIHByb3BzTmFtZXMuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcbiAgICAgIGlmICghUFJPUFNfT0JKW3Byb3BOYW1lXSkge1xuICAgICAgICB0aHJvdyBgUEFDS0FHRToke1BBQ0tBR0V9ICBSZXF1aXJlZCBEZXBlbmRlbmN5ICR7cHJvcE5hbWV9IGlzIG1pc3NpbmdgXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgY2hlY2tSZXF1aXJlZEZpbGVzIChGSUxFUywgUEFDS0FHRSkge1xuICAgIEZJTEVTLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhmaWxlKSkge1xuICAgICAgICB0aHJvdyBgUmVxdWlyZWQgRmlsZSAke2ZpbGV9IGlzIG1pc3NpbmdgXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgaXNFbXB0eUFycmF5IChhcnJheSkge1xuICAgIHJldHVybiAoIWFycmF5IHx8ICFhcnJheS5sZW5ndGgpXG4gIH0sXG4gIGdldENvbnNvbGUsXG4gIGFkZE9iamVjdENvbHVtbjogZnVuY3Rpb24gKG9iamVjdHNBcnJheSwgY29sdW1uTmFtZSwgdmFsdWVzQXJyYXkpIHtcbiAgICB2YXIgYWRkQ29sdW1zID0gKHZhbCwgaW5kZXgpID0+IFIubWVyZ2Uoe1xuICAgICAgW2NvbHVtbk5hbWVdOiB2YWx1ZXNBcnJheVtpbmRleF1cbiAgICB9LCB2YWwpXG4gICAgcmV0dXJuIFIuYWRkSW5kZXgoUi5tYXApKGFkZENvbHVtcywgb2JqZWN0c0FycmF5KVxuICB9XG5cbn1cbiJdfQ==