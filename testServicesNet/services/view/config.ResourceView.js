var path = require('path')
var entityName = 'ResourceView'
var sharedPath = path.join(__dirname, '/../../shared/entities/', entityName)
module.exports = {
  entityName: entityName,
  schema: path.join(sharedPath, '/entity.schema.json'),
  collection: entityName + 'Views'
}
