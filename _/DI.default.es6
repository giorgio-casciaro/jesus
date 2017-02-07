var path = require('path')
var fs = require('fs')
// var R = require('ramda')

var debugActive = true
var debugSaveTimeout
var debugFile
var debugRegistry = []

var DEBUG = function ({type, debug, msg = 'unknow', context = 'unknow'}) {
  if (!debugActive&&debugFile) return null
  debugRegistry.push({
    [`${type} ${context} > ${msg}`]: debug
  })
  if (debugSaveTimeout) clearTimeout(debugSaveTimeout)
  debugSaveTimeout = setTimeout(function () {
    fs.writeFile(debugFile, JSON.stringify(debugRegistry, null, 4), 'utf8')
  }, 1000)
}

var LOG = function ({type = 'LOG', log, msg = 'unknow', context = 'unknow', filename = 'appLogs.log'}) {
  DEBUG({type, debug: log, msg, context})
}

var ERROR = function ({error}) {
  var log = {error: error.originalError || error}
  if (error.getAppTrace)log.appTrace = error.getAppTrace()
  LOG({type: 'ERROR', log, msg: error.toString(), context: 'APP-ERROR', filename: 'appErrors.log'})
}

module.exports = function getDI (SERVICE, PACKAGE) {
  debugFile = path.join(__dirname, 'debug', PACKAGE + '.json')
  return {
    throwError: require('./error').throwError,
    log: async({context, msg, log}) => LOG({type: 'LOG', log, msg, context}),
    debug: async({context, msg, debug}) => DEBUG({type: 'DEBUG', debug, msg, context}),
    error: async({error}) => ERROR({error})
  }
}
