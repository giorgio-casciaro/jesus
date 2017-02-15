var sourceMapSupport = require('source-map-support')

function prepareStackTrace (error, stack) {
  return stack.map(function (frame) {
    return sourceMapSupport.wrapCallSite(frame)
  })
}
function getCallerInfo (stackIndex = 3) {
  var originalFunc = Error.prepareStackTrace
  var callerInfo = {}
  Error.prepareStackTrace = prepareStackTrace
  var err = new Error()
  callerInfo.fileName = err.stack[stackIndex].getFileName()
  callerInfo.functionName = err.stack[stackIndex].getFunctionName()
  callerInfo.lineNumber = err.stack[stackIndex].getLineNumber()
  callerInfo.columnNumber = err.stack[stackIndex].getColumnNumber()
  Error.prepareStackTrace = originalFunc
  return callerInfo
}

module.exports = class AppError extends Error {
  constructor (message, originalError, args) {
    // console.log("AppError",message, originalError, args)
    // Calling parent constructor of base Error class.
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = 'AppError'
    this.info = getCallerInfo()
    this.info.args=args
    if (originalError.originalError) this.originalError = originalError.originalError
    else this.originalError = originalError
    this.appTrace = []
    if (originalError.appTrace) this.appTrace = this.appTrace.concat(originalError.appTrace)
    this.appTrace.push(this.info)

    this.status = 500
    this.toString = () => {

    }
    function formatSingleError(error){
      if(!error.info)return error.toString()
      return {
        msg: error.info.message,
        fileName: error.info.fileName,
        args: error.info.args
      }
    }
    this.getAppTrace = () => {
      var result=this.appTrace.map(formatSingleError)
      result.push(formatSingleError(this))
      return result
    }
    this.toObject = () => {
      return {
        msg: this.info.message,
        fileName: this.info.fileName,
        args: this.info.args,
        '>': this.childError&&this.childError.toObject ? this.childError.toObject() : this.childError.toString()
      }
    }
  }
}
