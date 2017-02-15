'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sourceMapSupport = require('source-map-support');

function prepareStackTrace(error, stack) {
  return stack.map(function (frame) {
    return sourceMapSupport.wrapCallSite(frame);
  });
}
function getCallerInfo() {
  var stackIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

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

module.exports = function (_Error) {
  _inherits(AppError, _Error);

  function AppError(message, originalError, args) {
    _classCallCheck(this, AppError);

    var _this = _possibleConstructorReturn(this, (AppError.__proto__ || Object.getPrototypeOf(AppError)).call(this, message));
    // console.log("AppError",message, originalError, args)
    // Calling parent constructor of base Error class.


    Error.captureStackTrace(_this, _this.constructor);
    _this.name = 'AppError';
    _this.info = getCallerInfo();
    _this.info.args = args;
    if (originalError.originalError) _this.originalError = originalError.originalError;else _this.originalError = originalError;
    _this.appTrace = [];
    if (originalError.appTrace) _this.appTrace = _this.appTrace.concat(originalError.appTrace);
    _this.appTrace.push(_this.info);

    _this.status = 500;
    _this.toString = function () {};
    function formatSingleError(error) {
      if (!error.info) return error.toString();
      return {
        msg: error.info.message,
        fileName: error.info.fileName,
        args: error.info.args
      };
    }
    _this.getAppTrace = function () {
      var result = _this.appTrace.map(formatSingleError);
      result.push(formatSingleError(_this));
      return result;
    };
    _this.toObject = function () {
      return {
        msg: _this.info.message,
        fileName: _this.info.fileName,
        args: _this.info.args,
        '>': _this.childError && _this.childError.toObject ? _this.childError.toObject() : _this.childError.toString()
      };
    };
    return _this;
  }

  return AppError;
}(Error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9yLmFwcEVycm9yLmVzNiJdLCJuYW1lcyI6WyJzb3VyY2VNYXBTdXBwb3J0IiwicmVxdWlyZSIsInByZXBhcmVTdGFja1RyYWNlIiwiZXJyb3IiLCJzdGFjayIsIm1hcCIsImZyYW1lIiwid3JhcENhbGxTaXRlIiwiZ2V0Q2FsbGVySW5mbyIsInN0YWNrSW5kZXgiLCJvcmlnaW5hbEZ1bmMiLCJFcnJvciIsImNhbGxlckluZm8iLCJlcnIiLCJmaWxlTmFtZSIsImdldEZpbGVOYW1lIiwiZnVuY3Rpb25OYW1lIiwiZ2V0RnVuY3Rpb25OYW1lIiwibGluZU51bWJlciIsImdldExpbmVOdW1iZXIiLCJjb2x1bW5OdW1iZXIiLCJnZXRDb2x1bW5OdW1iZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwibWVzc2FnZSIsIm9yaWdpbmFsRXJyb3IiLCJhcmdzIiwiY2FwdHVyZVN0YWNrVHJhY2UiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJpbmZvIiwiYXBwVHJhY2UiLCJjb25jYXQiLCJwdXNoIiwic3RhdHVzIiwidG9TdHJpbmciLCJmb3JtYXRTaW5nbGVFcnJvciIsIm1zZyIsImdldEFwcFRyYWNlIiwicmVzdWx0IiwidG9PYmplY3QiLCJjaGlsZEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLG1CQUFtQkMsUUFBUSxvQkFBUixDQUF2Qjs7QUFFQSxTQUFTQyxpQkFBVCxDQUE0QkMsS0FBNUIsRUFBbUNDLEtBQW5DLEVBQTBDO0FBQ3hDLFNBQU9BLE1BQU1DLEdBQU4sQ0FBVSxVQUFVQyxLQUFWLEVBQWlCO0FBQ2hDLFdBQU9OLGlCQUFpQk8sWUFBakIsQ0FBOEJELEtBQTlCLENBQVA7QUFDRCxHQUZNLENBQVA7QUFHRDtBQUNELFNBQVNFLGFBQVQsR0FBd0M7QUFBQSxNQUFoQkMsVUFBZ0IsdUVBQUgsQ0FBRzs7QUFDdEMsTUFBSUMsZUFBZUMsTUFBTVQsaUJBQXpCO0FBQ0EsTUFBSVUsYUFBYSxFQUFqQjtBQUNBRCxRQUFNVCxpQkFBTixHQUEwQkEsaUJBQTFCO0FBQ0EsTUFBSVcsTUFBTSxJQUFJRixLQUFKLEVBQVY7QUFDQUMsYUFBV0UsUUFBWCxHQUFzQkQsSUFBSVQsS0FBSixDQUFVSyxVQUFWLEVBQXNCTSxXQUF0QixFQUF0QjtBQUNBSCxhQUFXSSxZQUFYLEdBQTBCSCxJQUFJVCxLQUFKLENBQVVLLFVBQVYsRUFBc0JRLGVBQXRCLEVBQTFCO0FBQ0FMLGFBQVdNLFVBQVgsR0FBd0JMLElBQUlULEtBQUosQ0FBVUssVUFBVixFQUFzQlUsYUFBdEIsRUFBeEI7QUFDQVAsYUFBV1EsWUFBWCxHQUEwQlAsSUFBSVQsS0FBSixDQUFVSyxVQUFWLEVBQXNCWSxlQUF0QixFQUExQjtBQUNBVixRQUFNVCxpQkFBTixHQUEwQlEsWUFBMUI7QUFDQSxTQUFPRSxVQUFQO0FBQ0Q7O0FBRURVLE9BQU9DLE9BQVA7QUFBQTs7QUFDRSxvQkFBYUMsT0FBYixFQUFzQkMsYUFBdEIsRUFBcUNDLElBQXJDLEVBQTJDO0FBQUE7O0FBQUEsb0hBR25DRixPQUhtQztBQUN6QztBQUNBOzs7QUFFQWIsVUFBTWdCLGlCQUFOLFFBQThCLE1BQUtDLFdBQW5DO0FBQ0EsVUFBS0MsSUFBTCxHQUFZLFVBQVo7QUFDQSxVQUFLQyxJQUFMLEdBQVl0QixlQUFaO0FBQ0EsVUFBS3NCLElBQUwsQ0FBVUosSUFBVixHQUFlQSxJQUFmO0FBQ0EsUUFBSUQsY0FBY0EsYUFBbEIsRUFBaUMsTUFBS0EsYUFBTCxHQUFxQkEsY0FBY0EsYUFBbkMsQ0FBakMsS0FDSyxNQUFLQSxhQUFMLEdBQXFCQSxhQUFyQjtBQUNMLFVBQUtNLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxRQUFJTixjQUFjTSxRQUFsQixFQUE0QixNQUFLQSxRQUFMLEdBQWdCLE1BQUtBLFFBQUwsQ0FBY0MsTUFBZCxDQUFxQlAsY0FBY00sUUFBbkMsQ0FBaEI7QUFDNUIsVUFBS0EsUUFBTCxDQUFjRSxJQUFkLENBQW1CLE1BQUtILElBQXhCOztBQUVBLFVBQUtJLE1BQUwsR0FBYyxHQUFkO0FBQ0EsVUFBS0MsUUFBTCxHQUFnQixZQUFNLENBRXJCLENBRkQ7QUFHQSxhQUFTQyxpQkFBVCxDQUEyQmpDLEtBQTNCLEVBQWlDO0FBQy9CLFVBQUcsQ0FBQ0EsTUFBTTJCLElBQVYsRUFBZSxPQUFPM0IsTUFBTWdDLFFBQU4sRUFBUDtBQUNmLGFBQU87QUFDTEUsYUFBS2xDLE1BQU0yQixJQUFOLENBQVdOLE9BRFg7QUFFTFYsa0JBQVVYLE1BQU0yQixJQUFOLENBQVdoQixRQUZoQjtBQUdMWSxjQUFNdkIsTUFBTTJCLElBQU4sQ0FBV0o7QUFIWixPQUFQO0FBS0Q7QUFDRCxVQUFLWSxXQUFMLEdBQW1CLFlBQU07QUFDdkIsVUFBSUMsU0FBTyxNQUFLUixRQUFMLENBQWMxQixHQUFkLENBQWtCK0IsaUJBQWxCLENBQVg7QUFDQUcsYUFBT04sSUFBUCxDQUFZRyx3QkFBWjtBQUNBLGFBQU9HLE1BQVA7QUFDRCxLQUpEO0FBS0EsVUFBS0MsUUFBTCxHQUFnQixZQUFNO0FBQ3BCLGFBQU87QUFDTEgsYUFBSyxNQUFLUCxJQUFMLENBQVVOLE9BRFY7QUFFTFYsa0JBQVUsTUFBS2dCLElBQUwsQ0FBVWhCLFFBRmY7QUFHTFksY0FBTSxNQUFLSSxJQUFMLENBQVVKLElBSFg7QUFJTCxhQUFLLE1BQUtlLFVBQUwsSUFBaUIsTUFBS0EsVUFBTCxDQUFnQkQsUUFBakMsR0FBNEMsTUFBS0MsVUFBTCxDQUFnQkQsUUFBaEIsRUFBNUMsR0FBeUUsTUFBS0MsVUFBTCxDQUFnQk4sUUFBaEI7QUFKekUsT0FBUDtBQU1ELEtBUEQ7QUEvQnlDO0FBdUMxQzs7QUF4Q0g7QUFBQSxFQUF3Q3hCLEtBQXhDIiwiZmlsZSI6ImVycm9yLmFwcEVycm9yLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBzb3VyY2VNYXBTdXBwb3J0ID0gcmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JylcblxuZnVuY3Rpb24gcHJlcGFyZVN0YWNrVHJhY2UgKGVycm9yLCBzdGFjaykge1xuICByZXR1cm4gc3RhY2subWFwKGZ1bmN0aW9uIChmcmFtZSkge1xuICAgIHJldHVybiBzb3VyY2VNYXBTdXBwb3J0LndyYXBDYWxsU2l0ZShmcmFtZSlcbiAgfSlcbn1cbmZ1bmN0aW9uIGdldENhbGxlckluZm8gKHN0YWNrSW5kZXggPSAzKSB7XG4gIHZhciBvcmlnaW5hbEZ1bmMgPSBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZVxuICB2YXIgY2FsbGVySW5mbyA9IHt9XG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gcHJlcGFyZVN0YWNrVHJhY2VcbiAgdmFyIGVyciA9IG5ldyBFcnJvcigpXG4gIGNhbGxlckluZm8uZmlsZU5hbWUgPSBlcnIuc3RhY2tbc3RhY2tJbmRleF0uZ2V0RmlsZU5hbWUoKVxuICBjYWxsZXJJbmZvLmZ1bmN0aW9uTmFtZSA9IGVyci5zdGFja1tzdGFja0luZGV4XS5nZXRGdW5jdGlvbk5hbWUoKVxuICBjYWxsZXJJbmZvLmxpbmVOdW1iZXIgPSBlcnIuc3RhY2tbc3RhY2tJbmRleF0uZ2V0TGluZU51bWJlcigpXG4gIGNhbGxlckluZm8uY29sdW1uTnVtYmVyID0gZXJyLnN0YWNrW3N0YWNrSW5kZXhdLmdldENvbHVtbk51bWJlcigpXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gb3JpZ2luYWxGdW5jXG4gIHJldHVybiBjYWxsZXJJbmZvXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQXBwRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yIChtZXNzYWdlLCBvcmlnaW5hbEVycm9yLCBhcmdzKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJBcHBFcnJvclwiLG1lc3NhZ2UsIG9yaWdpbmFsRXJyb3IsIGFyZ3MpXG4gICAgLy8gQ2FsbGluZyBwYXJlbnQgY29uc3RydWN0b3Igb2YgYmFzZSBFcnJvciBjbGFzcy5cbiAgICBzdXBlcihtZXNzYWdlKVxuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpXG4gICAgdGhpcy5uYW1lID0gJ0FwcEVycm9yJ1xuICAgIHRoaXMuaW5mbyA9IGdldENhbGxlckluZm8oKVxuICAgIHRoaXMuaW5mby5hcmdzPWFyZ3NcbiAgICBpZiAob3JpZ2luYWxFcnJvci5vcmlnaW5hbEVycm9yKSB0aGlzLm9yaWdpbmFsRXJyb3IgPSBvcmlnaW5hbEVycm9yLm9yaWdpbmFsRXJyb3JcbiAgICBlbHNlIHRoaXMub3JpZ2luYWxFcnJvciA9IG9yaWdpbmFsRXJyb3JcbiAgICB0aGlzLmFwcFRyYWNlID0gW11cbiAgICBpZiAob3JpZ2luYWxFcnJvci5hcHBUcmFjZSkgdGhpcy5hcHBUcmFjZSA9IHRoaXMuYXBwVHJhY2UuY29uY2F0KG9yaWdpbmFsRXJyb3IuYXBwVHJhY2UpXG4gICAgdGhpcy5hcHBUcmFjZS5wdXNoKHRoaXMuaW5mbylcblxuICAgIHRoaXMuc3RhdHVzID0gNTAwXG4gICAgdGhpcy50b1N0cmluZyA9ICgpID0+IHtcblxuICAgIH1cbiAgICBmdW5jdGlvbiBmb3JtYXRTaW5nbGVFcnJvcihlcnJvcil7XG4gICAgICBpZighZXJyb3IuaW5mbylyZXR1cm4gZXJyb3IudG9TdHJpbmcoKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbXNnOiBlcnJvci5pbmZvLm1lc3NhZ2UsXG4gICAgICAgIGZpbGVOYW1lOiBlcnJvci5pbmZvLmZpbGVOYW1lLFxuICAgICAgICBhcmdzOiBlcnJvci5pbmZvLmFyZ3NcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5nZXRBcHBUcmFjZSA9ICgpID0+IHtcbiAgICAgIHZhciByZXN1bHQ9dGhpcy5hcHBUcmFjZS5tYXAoZm9ybWF0U2luZ2xlRXJyb3IpXG4gICAgICByZXN1bHQucHVzaChmb3JtYXRTaW5nbGVFcnJvcih0aGlzKSlcbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG4gICAgdGhpcy50b09iamVjdCA9ICgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1zZzogdGhpcy5pbmZvLm1lc3NhZ2UsXG4gICAgICAgIGZpbGVOYW1lOiB0aGlzLmluZm8uZmlsZU5hbWUsXG4gICAgICAgIGFyZ3M6IHRoaXMuaW5mby5hcmdzLFxuICAgICAgICAnPic6IHRoaXMuY2hpbGRFcnJvciYmdGhpcy5jaGlsZEVycm9yLnRvT2JqZWN0ID8gdGhpcy5jaGlsZEVycm9yLnRvT2JqZWN0KCkgOiB0aGlzLmNoaWxkRXJyb3IudG9TdHJpbmcoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19