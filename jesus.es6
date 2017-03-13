const R = require('ramda')
const fs = require('fs')
const path = require('path')
var deref = require('json-schema-deref-sync')
var jsonfile = require('jsonfile')
// var normalise = require('ajv-error-messages')
var ajv = require('ajv')({allErrors: true})
// var sourceMapSupport = require('source-map-support')
// sourceMapSupport.install()
process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection Reason: ', promise, reason)
  console.trace(reason)
})

const PACKAGE = 'jesus'
const stringToColor = (string) => {
  var value = string.split('').map((char) => char.charCodeAt(0) * 2).reduce((a, b) => a + b, 0)
  return `hsl(${(value) % 255},80%,30%)`
}
var getConsoleInitTime=Date.now()
var getConsole = (config = {debug: false, log: true, error: true, warn: true}, serviceName, serviceId, pack) => {
  var initTime=getConsoleInitTime
  return {
    profile (name) { if (!console.profile) return false; console.profile(name) },
    profileEnd (name) { if (!console.profile) return false; console.profileEnd(name) },
    error () { if (!config.error) return false; var args = Array.prototype.slice.call(arguments);args[0]=args[0].message||args[0];console.error.apply(this, [serviceName,Date.now()-initTime, serviceId, pack].concat(args));console.trace() },
    log () { if (!config.log) return false; var args = Array.prototype.slice.call(arguments); console.log.apply(this, [serviceName,Date.now()-initTime, serviceId, pack].concat(args)) },
    debug () { if (!config.debug||typeof(console.debug)!=="function") return false; var args = Array.prototype.slice.call(arguments); console.debug.apply(this, ['%c' + serviceName, 'background: ' + stringToColor(serviceName) + '; color: white; display: block;', Date.now()-initTime,serviceId, pack].concat(args)) },
    warn () { if (!config.warn||!console.warn) return false; var args = Array.prototype.slice.call(arguments); console.warn.apply(this, [serviceName, Date.now()-initTime,serviceId, pack].concat(args)) }
  }
}

function errorThrow (serviceName, serviceId, pack) {
  return (msg, data) => {
    getConsole(false, serviceName, serviceId, pack).warn(msg, data)
    if (data && data.error) throw data.error
    else throw msg
  }
}

module.exports = {
  getAllServicesConfigFromDir (dir, fileName = 'methods.json') {
    var services = {}
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file, fileName)
      if (fs.existsSync(filePath))services[file] = require(filePath)
    })
    // CONSOLE.debug("getAllServicesConfigFromDir",services)
    return services
  },
  setSharedConfig (servicesRootDir, service, config, data) {
    return new Promise((resolve, reject) => {
      var filePath = path.join(servicesRootDir, service, config)
      jsonfile.writeFile(filePath + '.json', data, (err) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  },
  getSharedConfig (servicesRootDir) {
    return (service, config = 'service', exclude, asObj = false) => {

      return new Promise((resolve, reject) => {
        if (service === '*') {
          fs.readdir(servicesRootDir, (err, dirContents) => {
            if (err) return reject(err)
            var allFilePromises = []
            dirContents.forEach(serviceName => {
              if (exclude === serviceName) return false
              const filePath = path.join(servicesRootDir, serviceName, config)
              allFilePromises.push(new Promise((resolve, reject) => {
                // jsonfile.readFile(filePath + '.json', (err, data) => {
                //   if (err) return reject(err)
                //   data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
                //   data.serviceName = serviceName
                //   return resolve(data)
                // })
                var data = require(filePath + '.json')
                data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
                if(data instanceof Error)reject(data)
                data.serviceName = serviceName
                resolve(data)
              }))
            })
            Promise.all(allFilePromises).then(result => {
              if (asObj) {
                var objResult = {}
                result.forEach(serviceArray => objResult[serviceArray.serviceName] = serviceArray)
                return resolve(objResult)
              } else resolve(result)
            }).catch(reject)
          })
        } else {
          var filePath = path.join(servicesRootDir, service, config)
          console.debug("getSharedConfig",{filePath})
          // jsonfile.readFile(filePath + '.json', (err, data) => {
          //   if (err) return reject(err)
          //   data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
          //   data.serviceName = service
          //   return resolve(data)
          // })
          var data = require(filePath + '.json')
          data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
          if(data instanceof Error)reject(data)
          data.serviceName = service
          resolve(data)
        }
      })
    }
  },
  errorThrow,
  validateMethodFromConfig (errorThrow,serviceName, serviceId, methodsConfig, methodName, data, schemaField) {
    if (!methodsConfig || !methodsConfig[methodName] || !methodsConfig[methodName][schemaField]) errorThrow(`Method validation problem :${methodName} ${schemaField} in ${methodsConfigFile}`)
    var schema = methodsConfig[methodName][schemaField]
    var validate = ajv.compile(schema)
    var valid = validate(data)
    if (!valid) {
      errorThrow('validation errors', {errors: validate.errors, methodsConfig, methodName, data, schemaField})
    }
    return data
  },
  getAsPromise: function (value) {
    return new Promise((resolve, reject) => {
      Promise.resolve(value).then(function (value) {
        if (typeof (value) === 'function') {
          try { return resolve(value()) } catch (error) { return reject(error) }
        } else return resolve(value)
      })
    })
  },
  argsOverwrite () {
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
  },
  checkRequired (PROPS_OBJ, PACKAGE) {
    var propsNames = Object.keys(PROPS_OBJ)
    propsNames.forEach((propName) => {
      if (!PROPS_OBJ[propName]) {
        throw `PACKAGE:${PACKAGE}  Required Dependency ${propName} is missing`
      }
    })
  },
  checkRequiredFiles (FILES, PACKAGE) {
    FILES.forEach((file) => {
      if (!fs.existsSync(file)) {
        throw `Required File ${file} is missing`
      }
    })
  },
  isEmptyArray (array) {
    return (!array || !array.length)
  },
  getConsole,
  addObjectColumn: function (objectsArray, columnName, valuesArray) {
    var addColums = (val, index) => R.merge({
      [columnName]: valuesArray[index]
    }, val)
    return R.addIndex(R.map)(addColums, objectsArray)
  }

}
