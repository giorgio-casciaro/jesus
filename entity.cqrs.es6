var R = require('ramda')
const checkRequired = require('./jesus').checkRequired
var LOG = console
const PACKAGE = 'entity.cqrs'

module.exports = async function getEntityCqrsPackage ({
  entityName,
  mutationsStorage, mutationsStorageCollection, mutationsStorageConfig, mutationsPath,
  viewsStorage, viewsStorageCollection, viewsStorageConfig,
  viewsSnapshotsStorage, viewsSnapshotsStorageCollection, viewsSnapshotsStorageConfig, viewsSnapshotsMaxMutations
  }) {
  checkRequired({
    entityName,
    mutationsStorage, mutationsStorageCollection, mutationsStorageConfig, mutationsPath,
    viewsStorage, viewsStorageCollection, viewsStorageConfig,
    viewsSnapshotsStorage, viewsSnapshotsStorageCollection, viewsSnapshotsStorageConfig
  }, PACKAGE)
  var mutationsStoragePackage = await mutationsStorage({storageCollection: mutationsStorageCollection, storageConfig: mutationsStorageConfig})
  var viewsStoragePackage = await viewsStorage({storageCollection: viewsStorageCollection, storageConfig: viewsStorageConfig})
  var viewsSnapshotsStoragePackage = await viewsSnapshotsStorage({storageCollection: viewsSnapshotsStorageCollection, storageConfig: viewsSnapshotsStorageConfig})
  var mutationsPackage = await require('./mutations.cqrs')({mutationsStoragePackage, mutationsPath})
  var viewsPackage = await require('./views.cqrs')({viewsStoragePackage, viewsSnapshotsStoragePackage, mutationsPackage, viewsSnapshotsMaxMutations})

  return {
    mutationsPackage, viewsPackage
  }
}
