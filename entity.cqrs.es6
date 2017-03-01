var R = require('ramda')
const checkRequired = require('./jesus').checkRequired
const PACKAGE = 'entity.cqrs'

module.exports = async function getEntityCqrsPackage ({
  entityName,
  mutationsStorage, mutationsStorageCollection, mutationsStorageConfig, mutationsPath,
  viewsStorage, viewsStorageCollection, viewsStorageConfig,
  viewsSnapshotsStorage, viewsSnapshotsStorageCollection, viewsSnapshotsStorageConfig, viewsSnapshotsMaxMutations
}, {getConsole,serviceName, serviceId}) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE)
  try {
    checkRequired({
      serviceName, serviceId,
      entityName,getConsole,
      mutationsStorage, mutationsStorageCollection, mutationsStorageConfig, mutationsPath,
      viewsStorage, viewsStorageCollection, viewsStorageConfig,
      viewsSnapshotsStorage, viewsSnapshotsStorageCollection, viewsSnapshotsStorageConfig
    })
    var mutationsStoragePackage = await mutationsStorage({getConsole,serviceName, serviceId, storageCollection: mutationsStorageCollection, storageConfig: mutationsStorageConfig})
    var viewsStoragePackage = await viewsStorage({getConsole,serviceName, serviceId, storageCollection: viewsStorageCollection, storageConfig: viewsStorageConfig})
    var viewsSnapshotsStoragePackage = await viewsSnapshotsStorage({getConsole,serviceName, serviceId, storageCollection: viewsSnapshotsStorageCollection, storageConfig: viewsSnapshotsStorageConfig})
    var mutationsPackage = await require('./mutations.cqrs')({getConsole,serviceName, serviceId, mutationsStoragePackage, mutationsPath})
    var viewsPackage = await require('./views.cqrs')({getConsole,serviceName, serviceId, viewsStoragePackage, viewsSnapshotsStoragePackage, mutationsPackage, viewsSnapshotsMaxMutations})

    return {
      mutationsPackage, viewsPackage
    }
  } catch (error) {
    errorThrow('getEntityCqrsPackage', {error, entityName})
  }
}
