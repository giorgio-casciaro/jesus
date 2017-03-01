var R = require('ramda')
var shorthash = require('shorthash').unique
// var path = require('path')
// var fs = require('fs')
var jesus = require('./jesus')
const PACKAGE = 'views.cqrs'
const checkRequired = require('./jesus').checkRequired

module.exports = async function getViewsCqrsPackage ({getConsole,serviceName, serviceId, viewsSnapshotsMaxMutations, viewsStoragePackage, viewsSnapshotsStoragePackage, mutationsPackage}) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE)
  try {
    checkRequired({serviceName, serviceId, viewsSnapshotsMaxMutations, viewsStoragePackage, viewsSnapshotsStoragePackage, mutationsPackage})
    async function updateView ({objId, loadSnapshot = true, loadMutations = true, addMutations = []}) {
      try {
        CONSOLE.debug('updateView', {objId, loadSnapshot, loadMutations, addMutations })
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
        // META INFO _view
        if (updatedView._viewBuilded) delete updatedView._viewBuilded
        if (updatedView._viewHash) delete updatedView._viewHash
        updatedView._viewHash = shorthash(JSON.stringify(updatedView))
        updatedView._viewBuilded = Date.now()
        viewsStoragePackage.update({queriesArray: [{'_id': objId}], dataArray: [updatedView], insertIfNotExists: true})
        CONSOLE.debug('updatedView', {updatedView, mutations})

        if (viewsSnapshotsMaxMutations < mutations && mutations.length) {
          await viewsSnapshotsStorage.insert({timestamp: Date.now(), state: updatedView}) // update snapshot if required
        }
        return updatedView
      } catch (error) {
        CONSOLE.error(error, {objId, loadSnapshot, loadMutations, addMutations})
        throw new Error(PACKAGE + ` updateView`)
      }
    }
    return {
      refreshViews: function refreshViews ({objIds, loadSnapshot, loadMutations, addMutations }) {
        CONSOLE.debug('refreshsViews', {objIds, loadSnapshot, addMutations })
        function singleView (objId) {
          return updateView({objId, loadSnapshot, loadMutations, addMutations})
        }
        return Promise.all(R.map(singleView, objIds))
      },
      get: viewsStoragePackage.get,
      find: viewsStoragePackage.find
    }
  } catch (error) {
    errorThrow(`getViewsCqrsPackage()`, {error})
  }
}
