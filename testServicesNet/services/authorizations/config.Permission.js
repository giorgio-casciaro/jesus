var path = require('path')

var mainStorage = require('../../../storage.inmemory')
var mainStorageType = 'inmemory'
var mainStorageConfig = {
  path: path.join(__dirname, '../fileDb')
}
var entityName = 'Permission'
var sharedPath = path.join(__dirname, '/../../shared/entities/Permission/')
module.exports = {
  entityName: entityName,
  schema: path.join(sharedPath, '/entity.schema.json'),
  mutationsStorage: mainStorage,
  mutationsStorageConfig: mainStorageConfig,
  mutationsStorageCollection: 'PermissionMutations',
  mutationsPath: path.join(sharedPath, '/mutations'),
  viewsStorage: mainStorage,
  viewsStorageConfig: mainStorageConfig,
  viewsStorageCollection: entityName + 'ViewsStorage',
  viewsSnapshotsStorage: mainStorage,
  viewsSnapshotsStorageConfig: mainStorageConfig,
  viewsSnapshotsStorageCollection: entityName + 'ViewsSnapshots',
  viewsSnapshotsMaxMutations: 10
}
