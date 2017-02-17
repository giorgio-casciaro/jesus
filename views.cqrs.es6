var R = require('ramda')
// var path = require('path')
// var fs = require('fs')
var jesus = require('./jesus')
const PACKAGE = 'views.cqrs'
const checkRequired = require('./jesus').checkRequired
var LOG = console

module.exports = async function getViewsCqrsPackage ({viewsSnapshotsMaxMutations, viewsStoragePackage, viewsSnapshotsStoragePackage, mutationsPackage}) {
  try {
    checkRequired({viewsSnapshotsMaxMutations, viewsStoragePackage, viewsSnapshotsStoragePackage, mutationsPackage}, PACKAGE)
    async function updateView ({objId, loadSnapshot = true, loadMutations = true, addMutations = []}) {
      try {
        LOG.debug(PACKAGE, 'updateView', {objId, loadSnapshot, loadMutations, addMutations })
        var lastSnapshot = {timestamp: 0, state: {}}
        var mutations = []
        if (loadSnapshot) {
          var lastSnapshotFromDb = await viewsSnapshotsStoragePackage.find({query: {objId: objId}, sort: {timestamp: 1}, limit: 1, start: 0})
          if (lastSnapshotFromDb && lastSnapshotFromDb[0]) lastSnapshot = lastSnapshotFromDb[0]
        }
        if (loadMutations)mutations = await mutationsPackage.getObjMutations({objId, minTimestamp: lastSnapshot.timestamp})

        mutations = mutations.concat(addMutations)
        // clear array, remove duplicate ids
        mutations = R.uniqBy(R.prop('_id'), mutations)
        var updatedView = await mutationsPackage.applyMutations({state: lastSnapshot.state, mutations})
        viewsStoragePackage.update({queriesArray: [{'_id': objId}], dataArray: [updatedView], insertIfNotExists: true})
        LOG.debug(PACKAGE, 'updatedView', {updatedView, mutations})

        if (viewsSnapshotsMaxMutations < mutations && mutations.length) {
          await viewsSnapshotsStorage.insert({timestamp: Date.now(), state: updatedView}) // update snapshot if required
        }
        return true
      } catch (error) {
        LOG.error(PACKAGE, error, {objId, loadSnapshot, loadMutations, addMutations})
        throw new Error(PACKAGE + ` updateView`)
      }
    }
    return {
      refreshViews: function refreshViews ({objIds, loadSnapshot, loadMutations, addMutations }) {
        LOG.debug(PACKAGE, 'refreshsViews', {objIds, loadSnapshot, addMutations })
        function singleView (objId) {
          return updateView({objId, loadSnapshot, loadMutations, addMutations})
        }
        return Promise.all(R.map(singleView, objIds))
      },
      get: viewsStoragePackage.get
    }
  } catch (error) {
    LOG.error(PACKAGE, error)
    throw new Error(PACKAGE + `getViewsCqrsPackage()`)
  }
}
