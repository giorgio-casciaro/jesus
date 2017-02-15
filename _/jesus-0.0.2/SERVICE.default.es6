var path = require('path')
var fs = require('fs')
const uuidV4 = require('uuid/v4')
var R = require('ramda')

var sourceMapSupport = require('source-map-support')
sourceMapSupport.install()
var appError = require('./error.appError')
var logger

process.on('unhandledRejection', (reason, promise) => {
  logger.error('unhandledRejection Reason: ', promise, reason)
  //console.trace(promise)
})

module.exports = function getSERVICE (CONFIG) {
  var SERVICE = {
    routes: {},
    events: {}
  }


  { // LOGGER
    const winston = require('winston')
    const logPath = CONFIG.logPath
  // Create the log directory if it does not exist
    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath)
    }
    const tsFormat = () => (new Date()).toLocaleTimeString()
    var transports = [
    // colorize the output to the console
      new (winston.transports.Console)({
        timestamp: tsFormat,
        colorize: true,
        level: 'info'
      }),
      new (winston.transports.File)({
        filename: `${logPath}/results.log`,
        timestamp: tsFormat,
        level: CONFIG.NODE_ENV === 'development' ? 'debug' : 'info'
      })

    ]
    if (CONFIG.debugActive) {
      if (fs.existsSync(`${logPath}/debug.log`))fs.unlink(`${logPath}/debug.log`)
      transports.push(new (winston.transports.File)({
        name: 'debug',
        filename: `${logPath}/debug.log`,
        timestamp: tsFormat,
        level: 'debug'
      }))
      if (fs.existsSync(`${logPath}/errors.log`))fs.unlink(`${logPath}/errors.log`)
      transports.push(new (winston.transports.File)({
        name: 'debug_errors',
        filename: `${logPath}/errors.log`,
        timestamp: tsFormat,
        level: 'error'
      }))
    }
    logger = new (winston.Logger)({
      transports
    })
  }

  return {

    registerRoute: async({route, routeFunction}) => { SERVICE.routes[route] = routeFunction },
    callRoute: async({route, request}) => await SERVICE.routes[route](request),
    getRoutes: () => SERVICE.routes,
    deregisterRoute: async({route}) => { delete SERVICE.routes[route] },

    throwError: (message, originalError, args) => {
      logger.error('throwError', message, originalError, args)
      throw new appError(message, originalError, args)
    },
    log: logger.info,
    warn: logger.warn,
    debug: logger.debug,
    error: (error) => {
      if (error.originalError) {
        logger.error('originalError', error.originalError)
        logger.error('appError', error.info, error.appTrace)
      } else logger.error(error)
      if (error.appTrace)logger.debug(error.appTrace)
      else console.trace(error)
    },

    errorResponse: (error) => {
      if (error.originalError) {
        logger.error('originalError', error.originalError)
        logger.error('appError', error.info, error.appTrace)
      } else logger.error(error)
      if (error.appTrace)logger.debug(error.appTrace)
      //else console.trace(error)
      return {
        _error:true,
        message:error.message
      }
    }
  }
}
