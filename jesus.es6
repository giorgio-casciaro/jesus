const R = require('ramda')
// const jesus = require('jesus')
const uuidV4 = require('uuid/v4')
function setPackageArgsOverwrite () {
  var overwriteArgs = Array.prototype.slice.call(arguments, 1)
  var originalPackage = arguments[0]
  var modifiedPackage = {}
  for (var i in originalPackage) {
    modifiedPackage[i] = function packageArgsOverwrite () {
      var modifiedArguments = Object.assign(arguments, overwriteArgs)
      return originalPackage[i].apply(this, modifiedArguments)
    }
  }
  return modifiedPackage
}
function checkRequiredDependencies (DI, requiredDependenciesNames) {
  if (!DI) { throw new Error(`Required Dependencies Container is missing`) }
  requiredDependenciesNames.forEach((dependencyName) => {
    if (!DI[dependencyName]) {
      throw new Error(`Required Dependency ${dependencyName} is missing`)
    }
  })
}
function checkRequired (OBJ, propNames, PACKAGE = 'unknow') {
  if (!OBJ && propNames.length) { throw new Error(`PACKAGE ${PACKAGE} -> Required Dependencies Container is missing`) }
  propNames.forEach((propName) => {
    if (!OBJ[propName]) {
      throw new Error(`PACKAGE ${PACKAGE} -> Required Dependency ${propName} is missing`)
    }
  })
  return R.clone(OBJ)
}
function debug () {
  console.log('\u001b[1;33m' +
    '<State Mutations>' +
    '\u001b[0m')
  console.log.apply(console, arguments)
}

module.exports = {
  asyncResponse: function () {
    return {}
  },
  getValuePromise: function (value) {
    return new Promise((resolve, reject) => {
      Promise.resolve(value).then(function (value) {
        if (typeof (value) === 'function') {
          try { resolve(value()) } catch (error) { reject(error) }
        } else resolve(value)
      })
    })
  },
  checkRequired,
  checkRequiredDependencies,
  createNewIds: R.compose(R.map(() => uuidV4()), R.repeat(true)),
  debug,
  // debug,
  addObjectColumn: function (objectsArray, columnName, valuesArray) {
    var addColums = (val, index) => R.merge({
      [columnName]: valuesArray[index]
    }, val)
    return R.addIndex(R.map)(addColums, objectsArray)
  },
  getStoragePackage: R.curry((storage, collection) => {
    return require('jesus/storage.' + storage.type)(storage, collection)
  }),
  getLogFunctionOld: function (DI) {
    checkRequiredDependencies(DI, ['storage'])
    return R.curry((context, type, object) => {
      var contextString = context.join(' > ')
      var time = Date.now()
      var readableTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      if (type === 'ERROR') {
        console.log(`\u001b[1;33m ${type} ( ${contextString} ) \u001b[0m`)
        console.log(object)
        console.trace(object)
      }
      DI.storage.insert([
        {
          type,
          readableTime,
          context,
          object,
          time
        }
      ])
    })
  },
  getLogFunction: function (DI) {
    checkRequiredDependencies(DI, ['storage'])
    return function log (logData) {
      logData = R.merge(logData, {
        readableTime: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        type: 'LOG',
        time: Date.now(),
        data: {}
      })
      if (logData.type === 'ERROR') {
        var contextString = logData.context.join(' > ')
        console.log(`\u001b[1;33m ${logData.type} ( ${contextString} ) \u001b[0m`)
        console.log(logData.data)
        console.trace(logData.data)
      }
      DI.storage.insert([logData])
    }
  },
  getServiceErrorFunction: function (DI) {
    checkRequiredDependencies(DI, ['log'])
    return function serviceError (e) {
      DI.log('serviceError', e)
      throw new Error(e)
    }
  }
}
