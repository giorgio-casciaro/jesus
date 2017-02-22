const R = require('ramda')
const fs = require('fs')
const path = require('path')
var deref = require('json-schema-deref-sync')
// var normalise = require('ajv-error-messages')
var ajv = require('ajv')({allErrors: true})
var sourceMapSupport = require('source-map-support')
sourceMapSupport.install()
const PACKAGE = 'jesus'
const stringToColor = (string) => {
  var value = string.split('').map((char) => char.charCodeAt(0)*2).reduce((a, b) => a + b, 0)
  return `hsl(${(value) % 255},80%,30%)`
}
var LOG = (serviceName, serviceId, pack) => {
  return {
    error () { var args = Array.prototype.slice.call(arguments); console.error.apply(this, [serviceName, serviceId, pack].concat(args)) },
    log () { var args = Array.prototype.slice.call(arguments); console.log.apply(this, [serviceName, serviceId, pack].concat(args)) },
    debug () { var args = Array.prototype.slice.call(arguments); console.debug.apply(this, ['%c' + serviceName, 'background: ' + stringToColor(serviceName) + '; color: white; display: block;', serviceId, pack].concat(args)) },
    warn () { var args = Array.prototype.slice.call(arguments); console.warn.apply(this, [serviceName, serviceId, pack].concat(args)) }
  }
}

function errorThrow (serviceName, serviceId, pack) {
  return (msg, data) => {
    LOG(serviceName, serviceId, pack).warn(msg, data)
    if (data&&data.error) throw data.error
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
    // LOG.debug("getAllServicesConfigFromDir",services)
    return services
  },
  errorThrow,
  validateMethodFromConfig (serviceName, serviceId, apiConfigFile, apiMethod, data, schemaField) {
      // TO FIX ADD CACHE
    var apiConfigPath = path.dirname(apiConfigFile) + '/'
    var apiConfig = require(apiConfigFile)
    if (!apiConfig || !apiConfig[apiMethod] || !apiConfig[apiMethod][schemaField]) errorThrow(`Method validation problem :${apiMethod} ${schemaField} in ${apiConfigFile}`)
    var schema = deref(apiConfig[apiMethod][schemaField], {baseFolder: apiConfigPath, failOnMissing: true})
    LOG(serviceName, serviceId, PACKAGE).debug('validateMethodFromConfig schema', {apiConfig, apiMethod, schemaField, apiConfigPath, schema})
    var validate = ajv.compile(schema)
    var valid = validate(data)

    if (!valid) {
      errorThrow(serviceName, serviceId, PACKAGE)('validation errors', {errors: validate.errors, apiConfigFile, apiMethod, data, schemaField})
    }
    return data
  },
  getAsPromise: function (value) {
    return new Promise((resolve, reject) => {
      Promise.resolve(value).then(function (value) {
        if (typeof (value) === 'function') {
          try { resolve(value()) } catch (error) { reject(error) }
        } else resolve(value)
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
  checkRequired (PROPS_OBJ) {
    var propsNames = Object.keys(PROPS_OBJ)
    propsNames.forEach((propName) => {
      if (!PROPS_OBJ[propName]) {
        throw `Required Dependency ${propName} is missing`
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
  LOG,
  addObjectColumn: function (objectsArray, columnName, valuesArray) {
    var addColums = (val, index) => R.merge({
      [columnName]: valuesArray[index]
    }, val)
    return R.addIndex(R.map)(addColums, objectsArray)
  }

}
