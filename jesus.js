'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var R = require('ramda');
// const jesus = require('jesus')
var uuidV4 = require('uuid/v4');

function checkRequiredDependencies(DI, requiredDependenciesNames) {
  if (!DI) {
    throw new Error('Required Dependencies Container is missing');
  }
  requiredDependenciesNames.forEach(function (dependencyName) {
    if (!DI[dependencyName]) {
      throw new Error('Required Dependency ' + dependencyName + ' is missing');
    }
  });
}
function checkRequired(OBJ, propNames) {
  var PACKAGE = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'unknow';

  if (!OBJ && propNames.length) {
    throw new Error('PACKAGE ' + PACKAGE + ' -> Required Dependencies Container is missing');
  }
  propNames.forEach(function (propName) {
    if (!OBJ[propName]) {
      throw new Error('PACKAGE ' + PACKAGE + ' -> Required Dependency ' + propName + ' is missing');
    }
  });
  return R.clone(OBJ);
}
function debug() {
  console.log('\x1B[1;33m' + '<State Mutations>' + '\x1B[0m');
  console.log.apply(console, arguments);
}

module.exports = {
  asyncResponse: function asyncResponse() {
    return {};
  },
  getValuePromise: function getValuePromise(value) {
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
  checkRequired: checkRequired,
  checkRequiredDependencies: checkRequiredDependencies,
  createNewIds: R.compose(R.map(function () {
    return uuidV4();
  }), R.repeat(true)),
  debug: debug,
  // debug,
  addObjectColumn: function addObjectColumn(objectsArray, columnName, valuesArray) {
    var addColums = function addColums(val, index) {
      return R.merge(_defineProperty({}, columnName, valuesArray[index]), val);
    };
    return R.addIndex(R.map)(addColums, objectsArray);
  },
  getStoragePackage: R.curry(function (storage, collection) {
    return require('jesus/storage.' + storage.type)(storage, collection);
  }),
  getLogFunctionOld: function getLogFunctionOld(DI) {
    checkRequiredDependencies(DI, ['storage']);
    return R.curry(function (context, type, object) {
      var contextString = context.join(' > ');
      var time = Date.now();
      var readableTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      if (type === 'ERROR') {
        console.log('\x1B[1;33m ' + type + ' ( ' + contextString + ' ) \x1B[0m');
        console.log(object);
        console.trace(object);
      }
      DI.storage.insert([{
        type: type,
        readableTime: readableTime,
        context: context,
        object: object,
        time: time
      }]);
    });
  },
  getLogFunction: function getLogFunction(DI) {
    checkRequiredDependencies(DI, ['storage']);
    return function log(logData) {
      logData = R.merge(logData, {
        readableTime: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        type: 'LOG',
        time: Date.now(),
        data: {}
      });
      if (logData.type === 'ERROR') {
        var contextString = logData.context.join(' > ');
        console.log('\x1B[1;33m ' + logData.type + ' ( ' + contextString + ' ) \x1B[0m');
        console.log(logData.data);
        console.trace(logData.data);
      }
      DI.storage.insert([logData]);
    };
  },
  getServiceErrorFunction: function getServiceErrorFunction(DI) {
    checkRequiredDependencies(DI, ['log']);
    return function serviceError(e) {
      DI.log('serviceError', e);
      throw new Error(e);
    };
  }
};