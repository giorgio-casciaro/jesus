const R = require('ramda')
const fs = require('fs')
const path = require('path')
var deref = require('json-schema-deref-sync')
var normalise = require('ajv-error-messages')
var ajv = require('ajv')({allErrors: true})
var LOG = console
var sourceMapSupport = require('source-map-support')
sourceMapSupport.install()
const PACKAGE = 'jesus'

module.exports = {
  getAllServicesConfigFromDir (dir, fileName = 'api.json') {
    var services = {}
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file, fileName)
      if (fs.existsSync(filePath))services[file] = require(filePath)
    })
    // LOG.debug("getAllServicesConfigFromDir",services)
    return services
  },

  validateApiFromConfig (apiConfigFile, apiMethod, data, schemaField) {
      // TO FIX ADD CACHE
    var apiConfigPath = path.dirname(apiConfigFile) + '/'
    var apiConfig = require(apiConfigFile)
    if (!apiConfig || !apiConfig[apiMethod] || !apiConfig[apiMethod][schemaField]) throw `Api validation problem :${apiMethod} ${schemaField} in ${apiConfigFile}`
    var schema = deref(apiConfig[apiMethod][schemaField], {baseFolder: apiConfigPath, failOnMissing: true})
    LOG.debug(PACKAGE, 'validateApiFromConfig schema', {apiConfig, apiMethod, schemaField, apiConfigPath, schema})
    var validate = ajv.compile(schema)
    var valid = validate(data)

    if (!valid) {
      LOG.debug(PACKAGE, 'validate.errors', normalise(validate.errors))
      throw normalise(validate.errors)
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
  checkRequired (PROPS_OBJ, PACKAGE) {
    var propsNames = Object.keys(PROPS_OBJ)
    propsNames.forEach((propName) => {
      if (!PROPS_OBJ[propName]) {
        throw `PACKAGE ${PACKAGE} -> Required Dependency ${propName} is missing`
      }
    })
  },
  isEmptyArray (array) {
    return (!array || !array.length)
  },
  addObjectColumn: function (objectsArray, columnName, valuesArray) {
    var addColums = (val, index) => R.merge({
      [columnName]: valuesArray[index]
    }, val)
    return R.addIndex(R.map)(addColums, objectsArray)
  }

}
