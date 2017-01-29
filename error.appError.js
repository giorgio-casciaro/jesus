'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_Error) {
  _inherits(AppError, _Error);

  function AppError(callerInfo, childError) {
    _classCallCheck(this, AppError);

    // Capturing stack trace, excluding constructor call from it.
    var _this = _possibleConstructorReturn(this, (AppError.__proto__ || Object.getPrototypeOf(AppError)).call(this, callerInfo.message));
    // Calling parent constructor of base Error class.


    Error.captureStackTrace(_this, _this.constructor);

    // Saving class name in the property of our custom error as a shortcut.
    _this.name = 'AppError';
    _this.info = callerInfo;
    if (childError.originalError) _this.originalError = childError.originalError;else _this.originalError = childError;
    // this.childError = childError
    _this.appTrace = [];
    if (childError.appTrace) _this.appTrace = _this.appTrace.concat(childError.appTrace);
    _this.appTrace.push(childError);
    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9yLmFwcEVycm9yLmVzNiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiY2FsbGVySW5mbyIsImNoaWxkRXJyb3IiLCJtZXNzYWdlIiwiRXJyb3IiLCJjYXB0dXJlU3RhY2tUcmFjZSIsImNvbnN0cnVjdG9yIiwibmFtZSIsImluZm8iLCJvcmlnaW5hbEVycm9yIiwiYXBwVHJhY2UiLCJjb25jYXQiLCJwdXNoIiwic3RhdHVzIiwidG9TdHJpbmciLCJmb3JtYXRTaW5nbGVFcnJvciIsImVycm9yIiwibXNnIiwiZmlsZU5hbWUiLCJhcmdzIiwiZ2V0QXBwVHJhY2UiLCJyZXN1bHQiLCJtYXAiLCJ0b09iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBT0MsT0FBUDtBQUFBOztBQUNFLG9CQUFhQyxVQUFiLEVBQXlCQyxVQUF6QixFQUFxQztBQUFBOztBQUluQztBQUptQyxvSEFFN0JELFdBQVdFLE9BRmtCO0FBQ25DOzs7QUFJQUMsVUFBTUMsaUJBQU4sUUFBOEIsTUFBS0MsV0FBbkM7O0FBRUE7QUFDQSxVQUFLQyxJQUFMLEdBQVksVUFBWjtBQUNBLFVBQUtDLElBQUwsR0FBWVAsVUFBWjtBQUNBLFFBQUlDLFdBQVdPLGFBQWYsRUFBOEIsTUFBS0EsYUFBTCxHQUFxQlAsV0FBV08sYUFBaEMsQ0FBOUIsS0FDSyxNQUFLQSxhQUFMLEdBQXFCUCxVQUFyQjtBQUNMO0FBQ0EsVUFBS1EsUUFBTCxHQUFnQixFQUFoQjtBQUNBLFFBQUlSLFdBQVdRLFFBQWYsRUFBeUIsTUFBS0EsUUFBTCxHQUFnQixNQUFLQSxRQUFMLENBQWNDLE1BQWQsQ0FBcUJULFdBQVdRLFFBQWhDLENBQWhCO0FBQ3pCLFVBQUtBLFFBQUwsQ0FBY0UsSUFBZCxDQUFtQlYsVUFBbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFLVyxNQUFMLEdBQWMsR0FBZDtBQUNBLFVBQUtDLFFBQUwsR0FBZ0IsWUFBTSxDQUVyQixDQUZEO0FBR0EsYUFBU0MsaUJBQVQsQ0FBMkJDLEtBQTNCLEVBQWlDO0FBQy9CLFVBQUcsQ0FBQ0EsTUFBTVIsSUFBVixFQUFlLE9BQU9RLE1BQU1GLFFBQU4sRUFBUDtBQUNmLGFBQU87QUFDTEcsYUFBS0QsTUFBTVIsSUFBTixDQUFXTCxPQURYO0FBRUxlLGtCQUFVRixNQUFNUixJQUFOLENBQVdVLFFBRmhCO0FBR0xDLGNBQU1ILE1BQU1SLElBQU4sQ0FBV1c7QUFIWixPQUFQO0FBS0Q7QUFDRCxVQUFLQyxXQUFMLEdBQW1CLFlBQU07QUFDdkIsVUFBSUMsU0FBTyxNQUFLWCxRQUFMLENBQWNZLEdBQWQsQ0FBa0JQLGlCQUFsQixDQUFYO0FBQ0FNLGFBQU9ULElBQVAsQ0FBWUcsd0JBQVo7QUFDQSxhQUFPTSxNQUFQO0FBQ0QsS0FKRDtBQUtBLFVBQUtFLFFBQUwsR0FBZ0IsWUFBTTtBQUNwQixhQUFPO0FBQ0xOLGFBQUssTUFBS1QsSUFBTCxDQUFVTCxPQURWO0FBRUxlLGtCQUFVLE1BQUtWLElBQUwsQ0FBVVUsUUFGZjtBQUdMQyxjQUFNLE1BQUtYLElBQUwsQ0FBVVcsSUFIWDtBQUlMLGFBQUssTUFBS2pCLFVBQUwsSUFBaUIsTUFBS0EsVUFBTCxDQUFnQnFCLFFBQWpDLEdBQTRDLE1BQUtyQixVQUFMLENBQWdCcUIsUUFBaEIsRUFBNUMsR0FBeUUsTUFBS3JCLFVBQUwsQ0FBZ0JZLFFBQWhCO0FBSnpFLE9BQVA7QUFNRCxLQVBEO0FBcENtQztBQTRDcEM7O0FBN0NIO0FBQUEsRUFBd0NWLEtBQXhDIiwiZmlsZSI6ImVycm9yLmFwcEVycm9yLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQXBwRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yIChjYWxsZXJJbmZvLCBjaGlsZEVycm9yKSB7XG4gICAgLy8gQ2FsbGluZyBwYXJlbnQgY29uc3RydWN0b3Igb2YgYmFzZSBFcnJvciBjbGFzcy5cbiAgICBzdXBlcihjYWxsZXJJbmZvLm1lc3NhZ2UpXG5cbiAgICAvLyBDYXB0dXJpbmcgc3RhY2sgdHJhY2UsIGV4Y2x1ZGluZyBjb25zdHJ1Y3RvciBjYWxsIGZyb20gaXQuXG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3RvcilcblxuICAgIC8vIFNhdmluZyBjbGFzcyBuYW1lIGluIHRoZSBwcm9wZXJ0eSBvZiBvdXIgY3VzdG9tIGVycm9yIGFzIGEgc2hvcnRjdXQuXG4gICAgdGhpcy5uYW1lID0gJ0FwcEVycm9yJ1xuICAgIHRoaXMuaW5mbyA9IGNhbGxlckluZm9cbiAgICBpZiAoY2hpbGRFcnJvci5vcmlnaW5hbEVycm9yKSB0aGlzLm9yaWdpbmFsRXJyb3IgPSBjaGlsZEVycm9yLm9yaWdpbmFsRXJyb3JcbiAgICBlbHNlIHRoaXMub3JpZ2luYWxFcnJvciA9IGNoaWxkRXJyb3JcbiAgICAvLyB0aGlzLmNoaWxkRXJyb3IgPSBjaGlsZEVycm9yXG4gICAgdGhpcy5hcHBUcmFjZSA9IFtdXG4gICAgaWYgKGNoaWxkRXJyb3IuYXBwVHJhY2UpIHRoaXMuYXBwVHJhY2UgPSB0aGlzLmFwcFRyYWNlLmNvbmNhdChjaGlsZEVycm9yLmFwcFRyYWNlKVxuICAgIHRoaXMuYXBwVHJhY2UucHVzaChjaGlsZEVycm9yKVxuICAgIC8vIFlvdSBjYW4gdXNlIGFueSBhZGRpdGlvbmFsIHByb3BlcnRpZXMgeW91IHdhbnQuXG4gICAgLy8gSSdtIGdvaW5nIHRvIHVzZSBwcmVmZXJyZWQgSFRUUCBzdGF0dXMgZm9yIHRoaXMgZXJyb3IgdHlwZXMuXG4gICAgLy8gYDUwMGAgaXMgdGhlIGRlZmF1bHQgdmFsdWUgaWYgbm90IHNwZWNpZmllZC5cbiAgICB0aGlzLnN0YXR1cyA9IDUwMFxuICAgIHRoaXMudG9TdHJpbmcgPSAoKSA9PiB7XG5cbiAgICB9XG4gICAgZnVuY3Rpb24gZm9ybWF0U2luZ2xlRXJyb3IoZXJyb3Ipe1xuICAgICAgaWYoIWVycm9yLmluZm8pcmV0dXJuIGVycm9yLnRvU3RyaW5nKClcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1zZzogZXJyb3IuaW5mby5tZXNzYWdlLFxuICAgICAgICBmaWxlTmFtZTogZXJyb3IuaW5mby5maWxlTmFtZSxcbiAgICAgICAgYXJnczogZXJyb3IuaW5mby5hcmdzXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZ2V0QXBwVHJhY2UgPSAoKSA9PiB7XG4gICAgICB2YXIgcmVzdWx0PXRoaXMuYXBwVHJhY2UubWFwKGZvcm1hdFNpbmdsZUVycm9yKVxuICAgICAgcmVzdWx0LnB1c2goZm9ybWF0U2luZ2xlRXJyb3IodGhpcykpXG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuICAgIHRoaXMudG9PYmplY3QgPSAoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtc2c6IHRoaXMuaW5mby5tZXNzYWdlLFxuICAgICAgICBmaWxlTmFtZTogdGhpcy5pbmZvLmZpbGVOYW1lLFxuICAgICAgICBhcmdzOiB0aGlzLmluZm8uYXJncyxcbiAgICAgICAgJz4nOiB0aGlzLmNoaWxkRXJyb3ImJnRoaXMuY2hpbGRFcnJvci50b09iamVjdCA/IHRoaXMuY2hpbGRFcnJvci50b09iamVjdCgpIDogdGhpcy5jaGlsZEVycm9yLnRvU3RyaW5nKClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==