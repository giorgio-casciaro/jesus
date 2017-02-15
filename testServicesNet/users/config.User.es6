var path = require('path')

var mainStorage = require('../../storage.inmemory')
var mainStorageType = 'inmemory'
var mainStorageConfig = {
  path: path.join(__dirname, '../fileDb')
}
var entityName = 'User'
var sharedPath = path.join(__dirname, '/../shared/entities/User/')
module.exports = {
  entityName,
  schema: path.join(sharedPath, '/entity.schema.json'),
  mutationsStorage: mainStorage,
  mutationsStorageConfig: mainStorageConfig,
  mutationsStorageCollection: 'UserMutations',
  mutationsPath: path.join(sharedPath, '/mutations'),
  viewsStorage: mainStorage,
  viewsStorageConfig: mainStorageConfig,
  viewsStorageCollection: entityName + 'ViewsStorage',
  viewsSnapshotsStorage: mainStorage,
  viewsSnapshotsStorageConfig: mainStorageConfig,
  viewsSnapshotsStorageCollection: entityName + 'ViewsSnapshots',
  viewsSnapshotsMaxMutations: 10
}
