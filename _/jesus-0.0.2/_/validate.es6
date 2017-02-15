const PACKAGE = 'validate'
module.exports = function getValidateFunction (CONFIG, DI) {
  try {
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['validationSchema', 'validationType'], PACKAGE)
    DI = checkRequired(DI, ['throwError'], PACKAGE)

    return async function validate (args) {
      try {
        var validationType = await getValuePromise(CONFIG.validationType)
        var validate = await require('./validate.' + validationType)(CONFIG, DI)
        var results = await validate(args)
        return results
      } catch (error) {
        DI.throwError(PACKAGE+" validate(args) Error",error,args)
      }
    }
  } catch (error) {
    DI.throwError(PACKAGE+" Error", error)
  }
  // return (args) => new Promise(async (resolve, reject) => {
  //   try {
  //     var validationType = await getValuePromise(CONFIG.validationType)
  //     var validate = await require('./validate.' + validationType)(CONFIG)
  //     console.log("validate",validate)// var results = await validate(args)
  //     resolve(true)
  //   } catch (error) {
  //   console.log("error captured",error)
  //     reject(error)
  //   }
  // })
}
