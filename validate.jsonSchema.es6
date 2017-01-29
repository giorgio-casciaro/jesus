var ajv = require('ajv')({allErrors: true})
const PACKAGE = 'validate.jsonSchema'
module.exports = async function getJsonSchemaValidateFunction (CONFIG, DI) {
  try {
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['validationSchema'], PACKAGE)
    DI = checkRequired(DI, ['throwError'], PACKAGE)

    var validationSchema = await getValuePromise(CONFIG.validationSchema)
    var validate = ajv.compile(validationSchema)

    return async function jsonSchemaValidate ({items}) {
      try {
        if (!items) throw new Error(`Json Schema items are missing`)
        for (var item of items) {
          if (!validate(item)) throw new Error('JsonSchemaValidate Invalid: ' + ajv.errorsText(validate.errors))
        }
      } catch (error) {
        DI.throwError("jsonSchemaValidate({items}) Error",error,{items})
      }
    }
  } catch (error) {
    DI.throwError("getJsonSchemaValidateFunction(CONFIG, DI) Error",error)
  }
}
