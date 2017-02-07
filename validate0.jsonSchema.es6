var ajv = require('ajv')({allErrors: true})
var fs = require('fs')
var getCompiledSchema = (validationSchema) => new Promise((resolve, reject) => {
  fs.readFile(validationSchema, 'utf8', function (err, contents) {
    if (err) return resolve(false)
    var compiledSchema = ajv.compile(JSON.parse(contents))
    resolve(compiledSchema)
  })
})

const PACKAGE = 'validate.jsonSchema'
module.exports = async function jsonSchemaValidate ({items, validationSchema, throwIfFileNotFounded=true}) {
  try {
    var compiledSchema = await getCompiledSchema(validationSchema)
    if (!compiledSchema){
      if (throwIfFileNotFounded) throw new Error(`REQUIRED Json Schema file not found `+validationSchema)
     return false //file not founded
  }

    if (!items) throw new Error(`Json Schema items are missing`)
    for (var item of items) {
      if (!compiledSchema(item)) throw new Error('JsonSchemaValidate Invalid: ' + ajv.errorsText(compiledSchema.errors))
    }
    return true
  } catch (error) {
    throw new Error(error)
  }
}
