module.exports = class AppError extends Error {
  constructor (callerInfo, childError) {
    // Calling parent constructor of base Error class.
    super(callerInfo.message)

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor)

    // Saving class name in the property of our custom error as a shortcut.
    this.name = 'AppError'
    this.info = callerInfo
    if (childError.originalError) this.originalError = childError.originalError
    else this.originalError = childError
    // this.childError = childError
    this.appTrace = []
    if (childError.appTrace) this.appTrace = this.appTrace.concat(childError.appTrace)
    this.appTrace.push(childError)
    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
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
