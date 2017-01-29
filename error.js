'use strict';

var appError = require('./error.appError');
var path = require('path');
var fs = require('fs');
var sourceMapSupport = require('source-map-support');
sourceMapSupport.install();
//
function prepareStackTrace(error, stack) {
  return stack.map(function (frame) {
    return sourceMapSupport.wrapCallSite(frame);
  });
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
function getCallerInfo() {
  var stackIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;

  var originalFunc = Error.prepareStackTrace;
  var callerInfo = {};
  Error.prepareStackTrace = prepareStackTrace;
  var err = new Error();
  callerInfo.fileName = err.stack[stackIndex].getFileName();
  callerInfo.functionName = err.stack[stackIndex].getFunctionName();
  callerInfo.lineNumber = err.stack[stackIndex].getLineNumber();
  callerInfo.columnNumber = err.stack[stackIndex].getColumnNumber();
  Error.prepareStackTrace = originalFunc;
  return callerInfo;
}
module.exports = {
  throwError: function throwError(message, childError, args) {
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
    var callerInfo = getCallerInfo();
    callerInfo.message = message;
    callerInfo.args = args;
    //console.log(callerInfo)

    throw new appError(callerInfo, childError, args);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9yLmVzNiJdLCJuYW1lcyI6WyJhcHBFcnJvciIsInJlcXVpcmUiLCJwYXRoIiwiZnMiLCJzb3VyY2VNYXBTdXBwb3J0IiwiaW5zdGFsbCIsInByZXBhcmVTdGFja1RyYWNlIiwiZXJyb3IiLCJzdGFjayIsIm1hcCIsImZyYW1lIiwid3JhcENhbGxTaXRlIiwiZ2V0Q2FsbGVySW5mbyIsInN0YWNrSW5kZXgiLCJvcmlnaW5hbEZ1bmMiLCJFcnJvciIsImNhbGxlckluZm8iLCJlcnIiLCJmaWxlTmFtZSIsImdldEZpbGVOYW1lIiwiZnVuY3Rpb25OYW1lIiwiZ2V0RnVuY3Rpb25OYW1lIiwibGluZU51bWJlciIsImdldExpbmVOdW1iZXIiLCJjb2x1bW5OdW1iZXIiLCJnZXRDb2x1bW5OdW1iZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwidGhyb3dFcnJvciIsIm1lc3NhZ2UiLCJjaGlsZEVycm9yIiwiYXJncyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxXQUFXQyxRQUFRLGtCQUFSLENBQWY7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlFLEtBQUtGLFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBSUcsbUJBQW1CSCxRQUFRLG9CQUFSLENBQXZCO0FBQ0FHLGlCQUFpQkMsT0FBakI7QUFDQTtBQUNBLFNBQVNDLGlCQUFULENBQTRCQyxLQUE1QixFQUFtQ0MsS0FBbkMsRUFBMEM7QUFDeEMsU0FBT0EsTUFBTUMsR0FBTixDQUFVLFVBQVVDLEtBQVYsRUFBaUI7QUFDaEMsV0FBT04saUJBQWlCTyxZQUFqQixDQUE4QkQsS0FBOUIsQ0FBUDtBQUNELEdBRk0sQ0FBUDtBQUdEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTRSxhQUFULEdBQXdDO0FBQUEsTUFBaEJDLFVBQWdCLHVFQUFILENBQUc7O0FBQ3RDLE1BQUlDLGVBQWVDLE1BQU1ULGlCQUF6QjtBQUNBLE1BQUlVLGFBQWEsRUFBakI7QUFDQUQsUUFBTVQsaUJBQU4sR0FBMEJBLGlCQUExQjtBQUNBLE1BQUlXLE1BQU0sSUFBSUYsS0FBSixFQUFWO0FBQ0FDLGFBQVdFLFFBQVgsR0FBc0JELElBQUlULEtBQUosQ0FBVUssVUFBVixFQUFzQk0sV0FBdEIsRUFBdEI7QUFDQUgsYUFBV0ksWUFBWCxHQUEwQkgsSUFBSVQsS0FBSixDQUFVSyxVQUFWLEVBQXNCUSxlQUF0QixFQUExQjtBQUNBTCxhQUFXTSxVQUFYLEdBQXdCTCxJQUFJVCxLQUFKLENBQVVLLFVBQVYsRUFBc0JVLGFBQXRCLEVBQXhCO0FBQ0FQLGFBQVdRLFlBQVgsR0FBMEJQLElBQUlULEtBQUosQ0FBVUssVUFBVixFQUFzQlksZUFBdEIsRUFBMUI7QUFDQVYsUUFBTVQsaUJBQU4sR0FBMEJRLFlBQTFCO0FBQ0EsU0FBT0UsVUFBUDtBQUNEO0FBQ0RVLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsY0FBWSxvQkFBQ0MsT0FBRCxFQUFTQyxVQUFULEVBQW9CQyxJQUFwQixFQUE2QjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFJZixhQUFhSixlQUFqQjtBQUNBSSxlQUFXYSxPQUFYLEdBQW1CQSxPQUFuQjtBQUNBYixlQUFXZSxJQUFYLEdBQWdCQSxJQUFoQjtBQUNBOztBQUVBLFVBQU0sSUFBSS9CLFFBQUosQ0FBYWdCLFVBQWIsRUFBd0JjLFVBQXhCLEVBQW1DQyxJQUFuQyxDQUFOO0FBQ0Q7QUFwQmMsQ0FBakIiLCJmaWxlIjoiZXJyb3IuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcEVycm9yID0gcmVxdWlyZSgnLi9lcnJvci5hcHBFcnJvcicpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxudmFyIHNvdXJjZU1hcFN1cHBvcnQgPSByZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKVxuc291cmNlTWFwU3VwcG9ydC5pbnN0YWxsKClcbi8vXG5mdW5jdGlvbiBwcmVwYXJlU3RhY2tUcmFjZSAoZXJyb3IsIHN0YWNrKSB7XG4gIHJldHVybiBzdGFjay5tYXAoZnVuY3Rpb24gKGZyYW1lKSB7XG4gICAgcmV0dXJuIHNvdXJjZU1hcFN1cHBvcnQud3JhcENhbGxTaXRlKGZyYW1lKVxuICB9KVxufVxuXG4vLyBmdW5jdGlvbiBnZXRDYWxsZXJJbmZvIChzdGFja0luZGV4ID0gMikge1xuLy8gICB2YXIgY2FsbGVySW5mbyA9IHt9XG4vLyAgIHZhciB0cmFjZSA9IHN0YWNrVHJhY2UuZ2V0KClcbi8vICAgY2FsbGVySW5mby5maWxlTmFtZSA9IHRyYWNlW3N0YWNrSW5kZXhdLmdldEZpbGVOYW1lKClcbi8vICAgY2FsbGVySW5mby5mdW5jdGlvbk5hbWUgPSB0cmFjZVtzdGFja0luZGV4XS5nZXRGdW5jdGlvbk5hbWUoKVxuLy8gICBjYWxsZXJJbmZvLmxpbmVOdW1iZXIgPSB0cmFjZVtzdGFja0luZGV4XS5nZXRMaW5lTnVtYmVyKClcbi8vICAgY2FsbGVySW5mby5jb2x1bW5OdW1iZXIgPSB0cmFjZVtzdGFja0luZGV4XS5nZXRDb2x1bW5OdW1iZXIoKVxuLy8gICB2YXIgc291cmNlID0gZnMucmVhZEZpbGVTeW5jKGNhbGxlckluZm8uZmlsZU5hbWUsIHtlbmNvZGluZzogJ3V0Zi04J30pXG4vLyAgIHZhciByYXdTb3VyY2VNYXAgPSBjb252ZXJ0LmZyb21Tb3VyY2Uoc291cmNlKVxuLy8gICBpZiAocmF3U291cmNlTWFwKSB7XG4vLyAgICAgLy8gY29uc29sZS5sb2cocmF3U291cmNlTWFwLnRvT2JqZWN0KCkpXG4vL1xuLy8gICAgIHZhciBzbWMgPSBuZXcgc291cmNlTWFwLlNvdXJjZU1hcENvbnN1bWVyKHJhd1NvdXJjZU1hcC50b09iamVjdCgpKVxuLy8gICAvL1xuLy8gICAvLyAvLyBbICdodHRwOi8vZXhhbXBsZS5jb20vd3d3L2pzL29uZS5qcycsXG4vLyAgIC8vIC8vICAgJ2h0dHA6Ly9leGFtcGxlLmNvbS93d3cvanMvdHdvLmpzJyBdXG4vLyAgIC8vXG4vLyAgIC8vIHRyYWNlIG9uIG5vZGVGaXJzdExpbmVFcnJvckJ1Z1xuLy8gICAgIHZhciBnZXRQb3NpdGlvbkRhdGE9e1xuLy8gICAgICAgbGluZTogKChjYWxsZXJJbmZvLmxpbmVOdW1iZXIgPT09MSYmY2FsbGVySW5mby5jb2x1bW5OdW1iZXIgPiAxMDAwKSA/IDEgOiBjYWxsZXJJbmZvLmxpbmVOdW1iZXIpLFxuLy8gICAgICAgY29sdW1uOiAoKGNhbGxlckluZm8ubGluZU51bWJlciA9PT0xJiZjYWxsZXJJbmZvLmNvbHVtbk51bWJlciA+IDEwMDApID8gMSA6IGNhbGxlckluZm8uY29sdW1uTnVtYmVyKVxuLy8gICAgIH1cbi8vICAgICBjb25zb2xlLmxvZyhnZXRQb3NpdGlvbkRhdGEpXG4vLyAgICAgY2FsbGVySW5mby5vcmlnaW5hUG9zaXRpb24gPSBzbWMub3JpZ2luYWxQb3NpdGlvbkZvcihnZXRQb3NpdGlvbkRhdGEpXG4vLyAgIH1cbi8vICAgcmV0dXJuIGNhbGxlckluZm9cbi8vIH1cbi8vXG4vLyBmdW5jdGlvbiBwcmVwYXJlU3RhY2tUcmFjZSAoZXJyb3IsIHN0YWNrKSB7XG4vLyAgIHJldHVybiBzdGFja1xuLy8gfVxuLy9cbmZ1bmN0aW9uIGdldENhbGxlckluZm8gKHN0YWNrSW5kZXggPSAyKSB7XG4gIHZhciBvcmlnaW5hbEZ1bmMgPSBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZVxuICB2YXIgY2FsbGVySW5mbyA9IHt9XG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gcHJlcGFyZVN0YWNrVHJhY2VcbiAgdmFyIGVyciA9IG5ldyBFcnJvcigpXG4gIGNhbGxlckluZm8uZmlsZU5hbWUgPSBlcnIuc3RhY2tbc3RhY2tJbmRleF0uZ2V0RmlsZU5hbWUoKVxuICBjYWxsZXJJbmZvLmZ1bmN0aW9uTmFtZSA9IGVyci5zdGFja1tzdGFja0luZGV4XS5nZXRGdW5jdGlvbk5hbWUoKVxuICBjYWxsZXJJbmZvLmxpbmVOdW1iZXIgPSBlcnIuc3RhY2tbc3RhY2tJbmRleF0uZ2V0TGluZU51bWJlcigpXG4gIGNhbGxlckluZm8uY29sdW1uTnVtYmVyID0gZXJyLnN0YWNrW3N0YWNrSW5kZXhdLmdldENvbHVtbk51bWJlcigpXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gb3JpZ2luYWxGdW5jXG4gIHJldHVybiBjYWxsZXJJbmZvXG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGhyb3dFcnJvcjogKG1lc3NhZ2UsY2hpbGRFcnJvcixhcmdzKSA9PiB7XG4gICAgLy8gREkubG9nKHtjb250ZXh0OiAncGFja2FnZU5hbWUgY3JlYXRlRW50aXR5VGVzdCcsIHR5cGU6ICdFUlJPUicsIG5hbWU6ICdlcnJvcicsIGxvZzoge1xuICAgIC8vICAgZXJyb3JcbiAgICAvLyB9fSlcbiAgICAvLyBpZihlcnJvci5zdGFjayljb25zb2xlLmxvZyhlcnJvci5zdGFja1swXS5nZXRGdW5jdGlvbk5hbWUoKSkvLy5nZXRGdW5jdGlvbk5hbWUoKSxlcnJvci5zdGFjay5nZXRNZXRob2ROYW1lKCksZXJyb3Iuc3RhY2suZ2V0RmlsZU5hbWUoKSxlcnJvci5zdGFjay5nZXRMaW5lTnVtYmVyKCkpXG4gICAgLy8gdmFyIEVycm9yQ29udGFpbmVyID0ge2Vycm9yfVxuICAgIC8vIHZhciBzdGFja0xpbmVzID0gc3RhY2soKVxuICAgIC8vIHZhciBzaXRlID0gc3RhY2tMaW5lc1sxXVxuICAgIC8vIHZhciBlcnJvckluZm89e3N0cmluZzplcnJvciAmJiBlcnJvci50b1N0cmluZyA/IGVycm9yLnRvU3RyaW5nKCkgOiAndW5rbm93JyxmdW5jdGlvbk5hbWU6IHNpdGUuZ2V0RnVuY3Rpb25OYW1lKCkgfHwgJ2Fub255bW91cycsZmlsZU5hbWU6IHNpdGUuZ2V0RmlsZU5hbWUoKSxsaW5lTnVtYmVyIHNpdGUuZ2V0TGluZU51bWJlcigpfVxuICAgIC8vIHNpdGUgPSBzdGFja0xpbmVzWzJdXG4gICAgLy8gY29uc29sZS5lcnJvcihlcnJvciAmJiBlcnJvci50b1N0cmluZyA/IGVycm9yLnRvU3RyaW5nKCkgOiAndW5rbm93Jywgc2l0ZS5nZXRGdW5jdGlvbk5hbWUoKSB8fCAnYW5vbnltb3VzJywgc2l0ZS5nZXRGaWxlTmFtZSgpLCBzaXRlLmdldExpbmVOdW1iZXIoKSlcbiAgICAvLyByZXR1cm4gZXJyb3JcbiAgICAvLyBlcnJvcj1cbiAgICB2YXIgY2FsbGVySW5mbyA9IGdldENhbGxlckluZm8oKVxuICAgIGNhbGxlckluZm8ubWVzc2FnZT1tZXNzYWdlO1xuICAgIGNhbGxlckluZm8uYXJncz1hcmdzO1xuICAgIC8vY29uc29sZS5sb2coY2FsbGVySW5mbylcblxuICAgIHRocm93IG5ldyBhcHBFcnJvcihjYWxsZXJJbmZvLGNoaWxkRXJyb3IsYXJncylcbiAgfVxufVxuIl19