var path = require('path')
var entityName = 'Resource'
var sharedPath = path.join(__dirname, '/../../shared/entities/Resource/')
module.exports = {
  entityName: entityName,
  schema: path.join(sharedPath, '/entity.schema.json'),
  sharedPath,
  mutationsCollection: entityName + 'Mutations',
  mutationsPath: path.join(sharedPath, '/mutations'),
  viewsCollection: entityName + 'MainView',
  snapshotsCollection: entityName + 'MainViewSnapshots',
  snapshotsMaxMutations: 10
}
