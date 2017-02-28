var path = require('path')

var entityName = 'ResourceView'
var sharedPath = path.join(__dirname, '/../../shared/entities/', entityName)
module.exports = {
  entityName: entityName,
  schema: path.join(sharedPath, '/entity.schema.json'),
  storage: require('../../../storage.inmemory'),
  storageConfig: {
    path: path.join(__dirname, '../../fileDb')
  },
  storageCollection: entityName + 'Views'
}
