var path = require('path')
var fs = require('fs')
const uuidV4 = require('uuid/v4')

var sourceMapSupport = require('source-map-support')
sourceMapSupport.install()
var appError = require('../error.appError')

var logger

{ // LOGGER
  const winston = require('winston')
  const env = process.env.NODE_ENV || 'development'
  const logDir = 'log'
// Create the log directory if it does not exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
  }
  const tsFormat = () => (new Date()).toLocaleTimeString()
  logger = new (winston.Logger)({
    transports: [
    // colorize the output to the console
      new (winston.transports.Console)({
        timestamp: tsFormat,
        colorize: true,
        level: 'info'
      }),
      new (winston.transports.File)({
        filename: `${logDir}/results.log`,
        timestamp: tsFormat,
        level: env === 'development' ? 'debug' : 'info'
      })
    ]
  })
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error('unhandledRejection Reason: ', promise, reason)
  logger.trace(promise)
})

module.exports = {
  throwError: (message, originalError, args) => {
    throw new appError(message, originalError, args)
  },
  log: logger.info,
  debug: logger.debug,
  error: (error) => {
    if (error.originalError) {
      logger.error('originalError', error.originalError)
      logger.error('appError', error.info,error.appTrace)
    } else logger.error(error)
    if (error.appTrace)logger.debug(error.appTrace)
    else console.trace(error)
  }
}
