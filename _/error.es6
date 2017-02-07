var appError = require('./error.appError')
var path = require('path')
var fs = require('fs')
var sourceMapSupport = require('source-map-support')
sourceMapSupport.install()
//
function prepareStackTrace (error, stack) {
  return stack.map(function (frame) {
    return sourceMapSupport.wrapCallSite(frame)
  })
}
function getCallerInfo (stackIndex = 2) {
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
module.exports = {
  throwError: (message,childError,args) => {
    var callerInfo = getCallerInfo()
    callerInfo.message=message;
    callerInfo.args=args;
    throw new appError(callerInfo,childError,args)
  }
}
