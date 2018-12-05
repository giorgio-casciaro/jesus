var Ajv = require('ajv')
var ajv = new Ajv({ coerceTypes: 'array', allErrors: true, removeAdditional: true })

const log = (msg, data) => { console.log('\n' + JSON.stringify(['LOG', 'SCHEMA VALIDATION', msg, data])) }
const debug = (msg, data) => { if (process.env.debugJesus)console.log('\n' + JSON.stringify(['DEBUG', 'SCHEMA VALIDATION', msg, data])) }
const error = (msg, data) => { console.log('\n' + JSON.stringify(['ERROR', 'SCHEMA VALIDATION', msg, data])); console.error(data) }

class ValidationError extends Error {
  constructor (errors, schema, data) {
    super(errors ? 'ValidationErrors : ' + errors.map((err) => err.dataPath + ' ' + err.message).join(', ') : 'ValidationErrors')
    this.name = this.constructor.name
    this.data = { errorsType: 'ValidationError', errors, schema, data }
  }
}
module.exports = {
  validate: (schema, data) => {
    if (!schema) return data
    if (!schema.additionalProperties)schema.additionalProperties = false
    // log('schema', schema)
    var validate = ajv.compile(schema)
    log('validate', { data, schema })
    var valid = validate(data)
    debug('schema data after validation', {data})
    if (!valid) {
      error('ValidationError', {data, errors: validate.errors, schema})
      throw new ValidationError(validate.errors, schema, data)
    } else return data
  }
}
