var R = require('ramda')
var path = require('path')
var storagePackage = require('../storage')
module.exports = async function getEntityTestDI (DI,entityTestConfig) {
  var entityTestDI = R.clone(DI)
  entityTestDI.mutationsStoragePackage = storagePackage(R.merge(entityTestConfig, {
    storageCollection: () => 'entityTestMutations'
  }), DI)
  entityTestDI.viewsStoragePackage = storagePackage(R.merge(entityTestConfig, {
    storageCollection: () => 'entityTestViewsMain'
  }), DI)
  entityTestDI.viewsSnapshotsStoragePackage = storagePackage(R.merge(entityTestConfig, {
    storageCollection: () => 'entityTestViewsMainSnapshots'
  }), DI)
  entityTestDI.mutationsPackage = await require('../mutations.cqrs')(entityTestConfig, entityTestDI)
  entityTestDI.viewsPackage = await require('../views.cqrs')(entityTestConfig, entityTestDI)
  entityTestDI.validate = await require('../validate')(entityTestConfig, entityTestDI)
  return entityTestDI
}
