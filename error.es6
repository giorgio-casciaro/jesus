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

// function getCallerInfo (stackIndex = 2) {
//   var callerInfo = {}
//   var trace = stackTrace.get()
//   callerInfo.fileName = trace[stackIndex].getFileName()
//   callerInfo.functionName = trace[stackIndex].getFunctionName()
//   callerInfo.lineNumber = trace[stackIndex].getLineNumber()
//   callerInfo.columnNumber = trace[stackIndex].getColumnNumber()
//   var source = fs.readFileSync(callerInfo.fileName, {encoding: 'utf-8'})
//   var rawSourceMap = convert.fromSource(source)
//   if (rawSourceMap) {
//     // console.log(rawSourceMap.toObject())
//
//     var smc = new sourceMap.SourceMapConsumer(rawSourceMap.toObject())
//   //
//   // // [ 'http://example.com/www/js/one.js',
//   // //   'http://example.com/www/js/two.js' ]
//   //
//   // trace on nodeFirstLineErrorBug
//     var getPositionData={
//       line: ((callerInfo.lineNumber ===1&&callerInfo.columnNumber > 1000) ? 1 : callerInfo.lineNumber),
//       column: ((callerInfo.lineNumber ===1&&callerInfo.columnNumber > 1000) ? 1 : callerInfo.columnNumber)
//     }
//     console.log(getPositionData)
//     callerInfo.originaPosition = smc.originalPositionFor(getPositionData)
//   }
//   return callerInfo
// }
//
// function prepareStackTrace (error, stack) {
//   return stack
// }
//
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
    // DI.log({context: 'packageName createEntityTest', type: 'ERROR', name: 'error', log: {
    //   error
    // }})
    // if(error.stack)console.log(error.stack[0].getFunctionName())//.getFunctionName(),error.stack.getMethodName(),error.stack.getFileName(),error.stack.getLineNumber())
    // var ErrorContainer = {error}
    // var stackLines = stack()
    // var site = stackLines[1]
    // var errorInfo={string:error && error.toString ? error.toString() : 'unknow',functionName: site.getFunctionName() || 'anonymous',fileName: site.getFileName(),lineNumber site.getLineNumber()}
    // site = stackLines[2]
    // console.error(error && error.toString ? error.toString() : 'unknow', site.getFunctionName() || 'anonymous', site.getFileName(), site.getLineNumber())
    // return error
    // error=
    var callerInfo = getCallerInfo()
    callerInfo.message=message;
    callerInfo.args=args;
    //console.log(callerInfo)

    throw new appError(callerInfo,childError,args)
  }
}
